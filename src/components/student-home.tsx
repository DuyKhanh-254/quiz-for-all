"use client";

import { useEffect, useState } from "react";
import { BookOpen, Check, Clock3, History, Layers3, LoaderCircle, LockKeyhole, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/format";
import type { AttemptSummary } from "@/lib/types";

type QuizCard = { id: string; slug: string; title: string; description: string | null; quiz_sections: Array<{ id: string; questions: Array<{ id: string }> }> };
type AttemptWithQuiz = AttemptSummary & { quizzes: { title: string } | Array<{ title: string }> | null };

function quizTitle(attempt: AttemptWithQuiz) {
  return Array.isArray(attempt.quizzes) ? attempt.quizzes[0]?.title : attempt.quizzes?.title;
}

export function StudentHome({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState<AttemptWithQuiz[]>([]);
  const [quizzes, setQuizzes] = useState<QuizCard[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("");
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
        const [{ data: profile }, { data: history }, { data: publishedQuizzes, error: quizError }] = await Promise.all([
          supabase.from("profiles").select("full_name,class_name").eq("id", user.id).maybeSingle(),
          supabase.from("attempts").select("id,student_name,class_name,status,score,max_score,percentage,correct_count,total_questions,started_at,submitted_at,duration_seconds,quizzes(title)").eq("status", "submitted").order("submitted_at", { ascending: false }).limit(8),
          supabase.from("quizzes").select("id,slug,title,description,quiz_sections(id,questions(id))").eq("is_published", true).order("created_at", { ascending: true }),
        ]);
        if (quizError) throw quizError;
        if (profile) { setFullName(profile.full_name ?? ""); setClassName(profile.class_name ?? ""); }
        const available = (publishedQuizzes ?? []) as QuizCard[];
        setAttempts((history ?? []) as AttemptWithQuiz[]);
        setQuizzes(available);
        setSelectedSlug(available[0]?.slug ?? "");
        setReady(true);
      } catch {
        setError("We could not prepare the tests. Please check the connection and refresh.");
      }
    }
    void initialize();
    return () => { active = false; };
  }, [configured]);

  async function start(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedSlug) return;
    setError(""); setLoading(true);
    try {
      const response = await fetch("/api/attempts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName, className, quizSlug: selectedSlug }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      router.push(`/quiz/${data.attemptId}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The test could not be started.");
      setLoading(false);
    }
  }

  if (!configured) return <section className="card mx-auto max-w-2xl p-7"><h1 className="text-2xl font-extrabold">Almost ready</h1><p className="muted mt-3">Add the Supabase values from <code>.env.example</code> to <code>.env.local</code>, then restart the app.</p></section>;

  return <>
    <section className="py-10 lg:py-14"><div className="max-w-3xl"><span className="badge bg-[#fff1c7] text-[#75530c]"><Sparkles size={15} /> Learn with confidence</span><h1 className="mt-5 text-4xl font-black leading-[1.08] tracking-tight sm:text-6xl">Choose your English test.</h1><p className="muted mt-5 text-lg leading-8">Pick a test from the board, enter your name and class, then work through each part at your own pace.</p><div className="mt-7 flex flex-wrap gap-4 text-sm font-bold text-[#3d5875]"><span className="flex items-center gap-2"><Layers3 size={19} /> Multiple practice tests</span><span className="flex items-center gap-2"><Clock3 size={19} /> Progress saves automatically</span><span className="flex items-center gap-2"><LockKeyhole size={19} /> Private results</span></div></div></section>

    <section className="pb-10" aria-labelledby="test-board-heading"><div className="mb-4"><p className="text-sm font-extrabold uppercase tracking-wider text-[#61738a]">Test board</p><h2 id="test-board-heading" className="mt-1 text-2xl font-black">Choose one test</h2></div>{!ready ? <div className="grid gap-4 sm:grid-cols-2"><div className="skeleton h-48" /><div className="skeleton h-48" /></div> : quizzes.length === 0 ? <div className="error-box">No published tests are available.</div> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{quizzes.map((quiz, index) => { const selected = quiz.slug === selectedSlug; const count = quiz.quiz_sections.reduce((total, section) => total + section.questions.length, 0); return <button type="button" key={quiz.id} onClick={() => setSelectedSlug(quiz.slug)} aria-pressed={selected} className={`card relative p-6 text-left transition hover:-translate-y-0.5 ${selected ? "border-[#2869c7] ring-2 ring-[#2869c7]/20" : "hover:border-[#93afd0]"}`}><div className="flex items-start justify-between gap-3"><span className="grid size-12 place-items-center rounded-2xl bg-[#e9f2ff] font-black text-[#245eaa]">{index + 1}</span>{selected && <span className="badge bg-[#dff4eb] text-[#246c53]"><Check size={15} /> Selected</span>}</div><h3 className="mt-5 text-xl font-black">Test {index + 1}</h3><p className="mt-1 font-bold text-[#35516e]">{quiz.title}</p><p className="muted mt-2 line-clamp-2 text-sm">{quiz.description}</p><p className="mt-4 text-xs font-extrabold uppercase tracking-wide text-[#61738a]">{quiz.quiz_sections.length} parts · {count} questions</p></button>; })}</div>}</section>

    <section className="grid gap-8 pb-14 lg:grid-cols-[1fr_.8fr]"><form onSubmit={start} className="card p-6 sm:p-8"><h2 className="text-2xl font-extrabold">Ready to begin?</h2><p className="muted mt-2">Tell us who is taking the selected test.</p><div className="mt-6"><label className="label" htmlFor="full-name">Full name</label><input className="field" id="full-name" value={fullName} onChange={(event) => setFullName(event.target.value)} maxLength={100} required autoComplete="name" placeholder="Nguyễn Văn A" /></div><div className="mt-4"><label className="label" htmlFor="class-name">Class</label><input className="field" id="class-name" value={className} onChange={(event) => setClassName(event.target.value)} maxLength={40} required autoComplete="off" placeholder="2A1" /></div>{error && <p className="error-box mt-4" role="alert">{error}</p>}<button className="btn btn-primary mt-6 w-full" disabled={!ready || loading || !selectedSlug}>{loading || !ready ? <LoaderCircle className="animate-spin" size={19} /> : <BookOpen size={19} />}{ready ? (loading ? "Starting…" : "Start selected test") : "Preparing tests…"}</button></form>

      <div aria-labelledby="history-heading"><div className="mb-4 flex items-center gap-2"><History size={22} /><h2 id="history-heading" className="text-xl font-extrabold">My previous attempts</h2></div>{!ready ? <div className="skeleton h-24" /> : attempts.length === 0 ? <div className="card p-6"><p className="font-bold">No completed tests yet.</p><p className="muted mt-1 text-sm">Your results will appear here after your first test.</p></div> : <div className="space-y-3">{attempts.map((attempt) => <button key={attempt.id} onClick={() => router.push(`/attempts/${attempt.id}`)} className="card flex w-full items-center justify-between p-5 text-left transition hover:-translate-y-0.5 hover:border-[#93afd0]"><div><p className="font-extrabold">{quizTitle(attempt) ?? "English test"}</p><p className="muted mt-1 text-sm">{attempt.student_name} · {formatDate(attempt.submitted_at)}</p></div><div className="rounded-2xl bg-[#edf5ff] px-4 py-3 text-center"><strong className="block text-xl text-[#245eaa]">{attempt.percentage}%</strong><span className="text-xs font-bold text-[#55708e]">{attempt.score}/{attempt.max_score}</span></div></button>)}</div>}</div>
    </section>
  </>;
}
