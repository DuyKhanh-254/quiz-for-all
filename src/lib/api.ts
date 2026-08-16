import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return { error: NextResponse.json({ error: "Your session has expired. Please return home and try again." }, { status: 401 }) } as const;
  return { user: data.user, supabase } as const;
}

export async function requireAdmin() {
  const auth = await requireUser();
  if ("error" in auth) return auth;
  const { data } = await auth.supabase.from("profiles").select("role").eq("id", auth.user.id).single();
  if (data?.role !== "admin") return { error: NextResponse.json({ error: "Administrator access is required." }, { status: 403 }) } as const;
  return auth;
}

export function safeError(message = "Something went wrong. Please try again.", status = 500) {
  return NextResponse.json({ error: message }, { status });
}
