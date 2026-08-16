"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, LoaderCircle, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AdminAuthForm({ mode, configured }: { mode: "login" | "register"; configured: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      if (mode === "register") {
        const response = await fetch("/api/admin/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error);
      }
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email: String(values.email), password: String(values.password) });
      if (authError) throw new Error(mode === "login" ? "Email or password is incorrect." : "Account created, but sign-in failed. Please use the login page.");
      router.replace("/admin"); router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Something went wrong."); setLoading(false); }
  }
  return <form onSubmit={submit} className="card w-full max-w-md p-6 sm:p-8"><span className="grid size-12 place-items-center rounded-2xl bg-[#e9f2ff] text-[#245ea9]">{mode === "login" ? <KeyRound /> : <ShieldCheck />}</span><h1 className="mt-5 text-2xl font-black">{mode === "login" ? "Teacher sign in" : "Create administrator"}</h1><p className="muted mt-2 text-sm">{mode === "login" ? "Use your protected teacher account." : "A private setup code is required."}</p>{!configured && <p className="error-box mt-5">Supabase is not configured. Add the values in <code>.env.local</code>.</p>}
    {mode === "register" && <div className="mt-5"><label className="label" htmlFor="fullName">Full name</label><input className="field" id="fullName" name="fullName" required maxLength={100} autoComplete="name" /></div>}
    <div className="mt-4"><label className="label" htmlFor="email">Email</label><input className="field" id="email" name="email" type="email" required autoComplete="email" /></div>
    <div className="mt-4"><label className="label" htmlFor="password">Password</label><input className="field" id="password" name="password" type="password" required minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} /></div>
    {mode === "register" && <><div className="mt-4"><label className="label" htmlFor="confirmPassword">Confirm password</label><input className="field" id="confirmPassword" name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" /></div><div className="mt-4"><label className="label" htmlFor="setupCode">Admin setup code</label><input className="field" id="setupCode" name="setupCode" type="password" required autoComplete="off" /></div></>}
    {error && <p className="error-box mt-5" role="alert">{error}</p>}<button className="btn btn-primary mt-6 w-full" disabled={loading || !configured}>{loading && <LoaderCircle className="animate-spin" size={18} />}{loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create administrator"}</button><p className="muted mt-5 text-center text-sm">{mode === "login" ? <>First administrator? <Link className="font-bold text-[#245ea9]" href="/admin/register">Protected registration</Link></> : <>Already registered? <Link className="font-bold text-[#245ea9]" href="/admin/login">Sign in</Link></>}</p>
  </form>;
}
