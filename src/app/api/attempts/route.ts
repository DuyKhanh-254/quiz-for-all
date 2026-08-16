import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireUser, safeError } from "@/lib/api";
import { studentProfileSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  if (!auth.user.is_anonymous) return safeError("Student mode requires a student session.", 403);

  const parsed = studentProfileSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return safeError(parsed.error.issues[0]?.message ?? "Please check your details.", 400);

  const admin = createAdminClient();
  const { data: quiz } = await admin.from("quizzes").select("id").eq("slug", parsed.data.quizSlug).eq("is_published", true).single();
  if (!quiz) return safeError("This practice test is not available yet.", 404);

  const { error: profileError } = await admin.from("profiles").upsert({
    id: auth.user.id,
    full_name: parsed.data.fullName,
    class_name: parsed.data.className,
    role: "student",
    updated_at: new Date().toISOString(),
  }, { onConflict: "id" });
  if (profileError) return safeError("We could not save the student details.");

  const { data: existing } = await admin.from("attempts").select("id").eq("quiz_id", quiz.id).eq("user_id", auth.user.id).eq("status", "in_progress").order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (existing) return NextResponse.json({ attemptId: existing.id, resumed: true });

  const { data: attempt, error } = await admin.from("attempts").insert({
    quiz_id: quiz.id,
    user_id: auth.user.id,
    student_name: parsed.data.fullName,
    class_name: parsed.data.className,
    status: "in_progress",
    started_at: new Date().toISOString(),
  }).select("id").single();
  if (error || !attempt) return safeError("We could not start the test. Please try again.");
  return NextResponse.json({ attemptId: attempt.id, resumed: false }, { status: 201 });
}
