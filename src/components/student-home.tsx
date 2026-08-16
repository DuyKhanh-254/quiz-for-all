"use client";

import { useEffect, useState } from "react";
import { BookOpen, Clock3, History, LoaderCircle, LockKeyhole, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/format";
import type { AttemptSummary } from "@/lib/types";

export function StudentHome({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState<AttemptSummary[]>([]);
  const [fullName, setFullName] = useState("");
  const [className, setClassName] = useState("");

  useEffect(() => {
    if (!configured) return;
    let active = true;
    async function initialize() {
      try {
        const supabase = createClient();
        let { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          const result = await supabase.auth.signInAnonymously();
          if (result.error) throw result.error;
          user = result.data.user;
        }
        if (!user?.is_anonymous) {
          await supabase.auth.signOut();
          const result = await supabase.auth.signInAnonymously();
          if (result.error) throw result.error;
          user = result.data.user;
        }
        if (!active || !user) return;
        const [{ data: profile }, { data: history }] = await Promise.all([
          supabase.from("profiles").select("full_name,class_name").eq("id", user.id).maybeSingle(),
          supabase.from("attempts").select("id,student_name,class_name,status,score,max_score,percentage,correct_count,total_questions,started_at,submitted_at,duration_seconds").eq("status", "submitted").order("submitted_at", { ascending: false }).limit(8),
        ]);
        if (profile) { setFullName(profile.full_name ?? ""); setClassName(profile.class_name ?? ""); }
        setAttempts((history ?? []) as AttemptSummary[]);
        setReady(true);
      } catch {
        setError("We could not prepare the test. Please check the connection and refresh.");
      }
    }
    void initialize();
    return () => { active = false; };
  }, [configured]);

  async function start(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/attempts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName, className }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      router.push(`/quiz/${data.attemptId}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The test could not be started.");
      setLoading(false);
    }
  }

  if (!configured) return <section className="card mx-auto max-w-2xl p-7"><h1 className="text-2xl font-extrabold">Almost ready</h1><p className="muted mt-3">Add the Supabase values from <code>.env.example</code> to <code>.env.local</code>, then restart the app. The setup guide has every dashboard step.</p></section>;

  return <>
    <section className="grid items-center gap-8 py-12 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
      <div>
        <span className="badge bg-[#fff1c7] text-[#75530c]"><Sparkles size={15} /> Learn with confidence</span>
        <h1 className="mt-5 max-w-xl text-4xl font-black leading-[1.08] tracking-tight sm:text-6xl">A bright little English adventure.</h1>
        <p className="muted mt-5 max-w-xl text-lg leading-8">English Grade 2 · Semester 2 Practice Test. Listen, match, choose, and write at your own pace.</p>
        <div className="mt-7 flex flex-wrap gap-4 text-sm font-bold text-[#3d5875]"><span className="flex items-center gap-2"><BookOpen size={19} /> 4 friendly parts</span><span className="flex items-center gap-2"><Clock3 size={19} /> Progress saves automatically</span><span className="flex items-center gap-2"><LockKeyhole size={19} /> Private results</span></div>
      </div>
      <form onSubmit={start} className="card p-6 sm:p-8">
        <h2 className="text-2xl font-extrabold">Ready to begin?</h2>
        <p className="muted mt-2">Tell us who is taking the test.</p>
        <div className="mt-6"><label className="label" htmlFor="full-name">Full name</label><input className="field" id="full-name" value={fullName} onChange={(event) => setFullName(event.target.value)} maxLength={100} required autoComplete="name" placeholder="Nguyễn Văn A" /></div>
        <div className="mt-4"><label className="label" htmlFor="class-name">Class</label><input className="field" id="class-name" value={className} onChange={(event) => setClassName(event.target.value)} maxLength={40} required autoComplete="off" placeholder="2A1" /></div>
        {error && <p className="error-box mt-4" role="alert">{error}</p>}
        <button className="btn btn-primary mt-6 w-full" disabled={!ready || loading}>{loading || !ready ? <LoaderCircle className="animate-spin" size={19} /> : <BookOpen size={19} />}{ready ? (loading ? "Starting…" : "Start Test") : "Preparing your test…"}</button>
      </form>
    </section>
    <section className="pb-16" aria-labelledby="history-heading">
      <div className="mb-4 flex items-center gap-2"><History size={22} /><h2 id="history-heading" className="text-xl font-extrabold">My previous attempts</h2></div>
      {!ready ? <div className="skeleton h-24" /> : attempts.length === 0 ? <div className="card p-6"><p className="font-bold">No completed tests yet.</p><p className="muted mt-1 text-sm">Your results will appear here after your first test.</p></div> : <div className="grid gap-3 sm:grid-cols-2">{attempts.map((attempt) => <button key={attempt.id} onClick={() => router.push(`/attempts/${attempt.id}`)} className="card flex items-center justify-between p-5 text-left transition hover:-translate-y-0.5 hover:border-[#93afd0]"><div><p className="font-extrabold">{attempt.student_name} · {attempt.class_name}</p><p className="muted mt-1 text-sm">{formatDate(attempt.submitted_at)}</p></div><div className="rounded-2xl bg-[#edf5ff] px-4 py-3 text-center"><strong className="block text-xl text-[#245eaa]">{attempt.percentage}%</strong><span className="text-xs font-bold text-[#55708e]">{attempt.score}/{attempt.max_score}</span></div></button>)}</div>}
    </section>
  </>;
}
