import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { adminRegisterSchema } from "@/lib/validation";
import { createAdminClient } from "@/lib/supabase/admin";
import { safeError } from "@/lib/api";

function equalSecret(received: string, expected: string) {
  const left = Buffer.from(received);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function POST(request: Request) {
  const parsed = adminRegisterSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return safeError(parsed.error.issues[0]?.message ?? "Please check the form.", 400);
  const expected = process.env.ADMIN_SETUP_CODE;
  if (!expected || !equalSecret(parsed.data.setupCode, expected)) return safeError("The admin setup code is incorrect.", 403);

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({ email: parsed.data.email, password: parsed.data.password, email_confirm: true, user_metadata: { full_name: parsed.data.fullName } });
  if (error || !data.user) return safeError(error?.message.includes("registered") ? "An account with this email already exists." : "The administrator account could not be created.", 400);
  const { error: profileError } = await admin.from("profiles").upsert({ id: data.user.id, full_name: parsed.data.fullName, class_name: null, role: "admin", updated_at: new Date().toISOString() }, { onConflict: "id" });
  if (profileError) {
    await admin.auth.admin.deleteUser(data.user.id);
    return safeError("The administrator profile could not be created.");
  }
  return NextResponse.json({ created: true }, { status: 201 });
}
