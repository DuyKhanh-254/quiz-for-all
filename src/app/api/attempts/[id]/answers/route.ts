import { NextResponse } from "next/server";
import { requireUser, safeError } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase/admin";
import { saveAnswerSchema } from "@/lib/validation";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  const parsed = saveAnswerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return safeError("That answer could not be saved.", 400);
  const { id } = await context.params;
  const admin = createAdminClient();

  const { data: attempt } = await admin.from("attempts").select("id,quiz_id,status").eq("id", id).eq("user_id", auth.user.id).maybeSingle();
  if (!attempt) return safeError("Attempt not found.", 404);
  if (attempt.status !== "in_progress") return safeError("This test has already been submitted.", 409);
  const { data: question } = await admin.from("questions").select("id").eq("id", parsed.data.questionId).eq("quiz_id", attempt.quiz_id).maybeSingle();
  if (!question) return safeError("Question not found.", 400);

  const { error } = await admin.from("attempt_answers").upsert({
    attempt_id: id,
    question_id: parsed.data.questionId,
    user_id: auth.user.id,
    response: parsed.data.response,
    is_correct: null,
    awarded_points: null,
    updated_at: new Date().toISOString(),
  }, { onConflict: "attempt_id,question_id" });
  if (error) return safeError("Your answer could not be saved. Please check your connection.");
  return NextResponse.json({ saved: true, savedAt: new Date().toISOString() });
}
