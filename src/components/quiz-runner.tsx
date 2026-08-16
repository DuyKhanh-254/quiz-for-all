"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, Cloud, CloudOff, GraduationCap, LoaderCircle, Send, X } from "lucide-react";
import Link from "next/link";
import { AudioPlayer } from "@/components/audio-player";
import { QuestionCard, isAnswered } from "@/components/questions";
import { formatDuration } from "@/lib/format";
import type { AttemptAnswer, AttemptSummary, JsonResponse, Quiz } from "@/lib/types";

type Payload = { attempt: AttemptSummary; quiz: Quiz; answers: AttemptAnswer[] };
type Result = { score: number; maxScore: number; percentage: number; correctCount: number; totalQuestions: number; durationSeconds: number };

export function QuizRunner({ attemptId }: { attemptId: string }) {
  const [data, setData] = useState<Payload | null>(null);
  const [responses, setResponses] = useState<Record<string, JsonResponse>>({});
  const [sectionIndex, setSectionIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [saveState, setSaveState] = useState<"saved" | "saving" | "offline">("saved");
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const localKey = `quiz-attempt-${attemptId}`;

  useEffect(() => {
    let active = true;
    const activeTimers = timers.current;
    fetch(`/api/attempts/${attemptId}`, { cache: "no-store" }).then(async (response) => {
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);
      if (!active) return;
      const payload = body as Payload;
      setData(payload);
      const remote = Object.fromEntries(payload.answers.map((answer) => [answer.question_id, answer.response]));
      let local: Record<string, JsonResponse> = {};
      try { local = JSON.parse(localStorage.getItem(localKey) || "{}"); } catch { /* ignored */ }
      setResponses({ ...remote, ...(payload.attempt.status === "in_progress" ? local : {}) });
      if (payload.attempt.status === "submitted") setResult({ score: payload.attempt.score ?? 0, maxScore: payload.attempt.max_score ?? 0, percentage: payload.attempt.percentage ?? 0, correctCount: payload.attempt.correct_count ?? 0, totalQuestions: payload.attempt.total_questions ?? 0, durationSeconds: payload.attempt.duration_seconds ?? 0 });
    }).catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : "The test could not be loaded."); });
    return () => { active = false; Object.values(activeTimers).forEach(clearTimeout); };
  }, [attemptId, localKey]);

  useEffect(() => {
    if (!data || data.attempt.status !== "in_progress") return;
    const start = new Date(data.attempt.started_at).getTime();
    const update = () => setElapsed(Math.max(0, Math.floor((Date.now() - start) / 1000)));
    update(); const interval = setInterval(update, 1000); return () => clearInterval(interval);
  }, [data]);

  const questions = useMemo(() => data?.quiz.quiz_sections.flatMap((section) => section.questions) ?? [], [data]);
  const answered = questions.filter((question) => isAnswered(question, responses[question.id])).length;
  const unanswered = questions.length - answered;

  const save = useCallback(async (questionId: string, response: JsonResponse) => {
    setSaveState("saving");
    try {
      const request = await fetch(`/api/attempts/${attemptId}/answers`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ questionId, response }) });
      if (!request.ok) throw new Error();
      setSaveState("saved");
    } catch { setSaveState("offline"); }
  }, [attemptId]);

  function update(questionId: string, response: JsonResponse) {
    const next = { ...responses, [questionId]: response };
    setResponses(next);
    try { localStorage.setItem(localKey, JSON.stringify(next)); } catch { /* storage can be unavailable */ }
    clearTimeout(timers.current[questionId]);
    timers.current[questionId] = setTimeout(() => void save(questionId, response), 650);
  }

  async function submit() {
    setShowConfirm(false); setSubmitting(true); setError("");
    Object.values(timers.current).forEach(clearTimeout);
    try {
      const request = await fetch(`/api/attempts/${attemptId}/submit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers: responses }) });
      const body = await request.json();
      if (!request.ok) throw new Error(body.error);
      localStorage.removeItem(localKey);
      setResult(body as Result);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Submission timed out. Your test is still open; please try again."); }
    finally { setSubmitting(false); }
  }

  if (error && !data) return <main className="shell py-16"><div className="error-box mx-auto max-w-xl">{error}<div><Link className="btn btn-secondary mt-4" href="/">Back to home</Link></div></div></main>;
  if (!data) return <main className="shell py-16" aria-busy="true"><div className="skeleton h-72" /></main>;
  if (result) return <ResultView result={result} attemptId={attemptId} />;

  const section = data.quiz.quiz_sections[sectionIndex];
  let globalOffset = 0;
  for (let index = 0; index < sectionIndex; index++) globalOffset += data.quiz.quiz_sections[index].questions.length;
  return <main className="pb-28">
    <header className="sticky top-0 z-30 border-b border-[#d5e1ea] bg-white/95 backdrop-blur"><div className="shell flex min-h-17 items-center justify-between gap-3"><div className="min-w-0"><h1 className="truncate font-extrabold">{data.quiz.title}</h1><p className="muted truncate text-xs">{data.attempt.student_name} · {data.attempt.class_name}</p></div><div className="flex items-center gap-3 text-sm font-bold"><span className="hidden items-center gap-1 sm:flex">{saveState === "offline" ? <CloudOff className="text-[#b8424b]" size={17} /> : <Cloud className={saveState === "saving" ? "text-[#a66a00]" : "text-[#2e8b68]"} size={17} />}{saveState === "saving" ? "Saving…" : saveState === "offline" ? "Saved on this device" : "Saved"}</span><span className="flex items-center gap-1"><Clock3 size={17} /> {formatDuration(elapsed)}</span></div></div><div className="h-1 bg-[#e7eef3]"><div className="h-full bg-[#2e8b68] transition-all" style={{ width: `${questions.length ? answered / questions.length * 100 : 0}%` }} /></div></header>
    <div className="shell grid gap-7 py-7 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div>
        <section className="mb-5 rounded-2xl bg-[#183153] p-5 text-white"><p className="text-sm font-bold text-[#bed1e8]">Part {sectionIndex + 1} of {data.quiz.quiz_sections.length}</p><h2 className="mt-1 text-2xl font-black">{section.title}</h2><p className="mt-2 text-[#e3edf7]">{section.instruction}</p></section>
        {section.audio_url && <div className="card mb-5 p-5"><h3 className="mb-3 flex items-center gap-2 font-extrabold">Listen carefully</h3><AudioPlayer src={section.audio_url} label={`${section.title} audio`} /></div>}
        <div className="space-y-5">{section.questions.map((question, index) => <QuestionCard key={question.id} question={question} number={globalOffset + index + 1} value={responses[question.id]} onChange={(response) => update(question.id, response)} />)}</div>
      </div>
      <aside className="hidden lg:block"><div className="card sticky top-24 p-5"><p className="font-extrabold">Your progress</p><p className="muted mt-1 text-sm">{answered} / {questions.length} answered</p><nav className="mt-5 space-y-2" aria-label="Quiz sections">{data.quiz.quiz_sections.map((item, index) => { const count = item.questions.filter((q) => isAnswered(q, responses[q.id])).length; return <button key={item.id} onClick={() => setSectionIndex(index)} className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-bold ${index === sectionIndex ? "bg-[#e9f2ff] text-[#1f5da9]" : "hover:bg-[#f3f6f8]"}`}><span>Part {index + 1}</span><span>{count}/{item.questions.length}</span></button>; })}</nav><div className="mt-5 grid grid-cols-4 gap-2">{questions.map((question, index) => <button onClick={() => { const targetSection = data.quiz.quiz_sections.findIndex((s) => s.questions.some((q) => q.id === question.id)); setSectionIndex(targetSection); setTimeout(() => document.getElementById(`question-${question.id}`)?.scrollIntoView(), 50); }} key={question.id} aria-label={`Go to question ${index + 1}`} className={`grid aspect-square place-items-center rounded-lg text-xs font-black ${isAnswered(question, responses[question.id]) ? "bg-[#dff4eb] text-[#246c53]" : "bg-[#f0f3f6] text-[#61738a]"}`}>{index + 1}</button>)}</div></div></aside>
    </div>
    {error && <div className="fixed bottom-24 left-1/2 z-40 w-[min(90%,600px)] -translate-x-1/2 error-box shadow-xl" role="alert">{error}</div>}
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#d4e0e9] bg-white p-3 shadow-[0_-8px_24px_rgba(24,49,83,.08)]"><div className="shell flex items-center justify-between gap-3"><button className="btn btn-secondary" disabled={sectionIndex === 0} onClick={() => { setSectionIndex((value) => value - 1); window.scrollTo(0, 0); }}><ArrowLeft size={18} /> <span className="hidden sm:inline">Previous</span></button><span className="text-sm font-extrabold lg:hidden">{answered}/{questions.length} answered</span>{sectionIndex < data.quiz.quiz_sections.length - 1 ? <button className="btn btn-primary" onClick={() => { setSectionIndex((value) => value + 1); window.scrollTo(0, 0); }}><span className="hidden sm:inline">Next part</span><ArrowRight size={18} /></button> : <button className="btn btn-primary" disabled={submitting} onClick={() => setShowConfirm(true)}>{submitting ? <LoaderCircle className="animate-spin" size={18} /> : <Send size={18} />} Submit Test</button>}</div></div>
    {showConfirm && <div className="fixed inset-0 z-50 grid place-items-center bg-[#10243d]/60 p-4" role="dialog" aria-modal="true" aria-labelledby="submit-title"><div className="card w-full max-w-md p-6"><div className="flex items-start justify-between"><div><h2 id="submit-title" className="text-xl font-extrabold">Submit your test?</h2><p className="muted mt-2">{unanswered ? `You still have ${unanswered} unanswered question${unanswered === 1 ? "" : "s"}.` : "You answered every question. Great work!"}</p></div><button className="rounded-lg p-2 hover:bg-[#eef2f5]" onClick={() => setShowConfirm(false)} aria-label="Close"><X /></button></div><div className="mt-6 flex flex-col gap-3 sm:flex-row"><button className="btn btn-secondary flex-1" onClick={() => setShowConfirm(false)}>Continue Test</button><button className="btn btn-primary flex-1" onClick={() => void submit()}>Submit Anyway</button></div></div></div>}
  </main>;
}

function ResultView({ result, attemptId }: { result: Result; attemptId: string }) {
  return <main className="shell flex min-h-screen items-center justify-center py-12"><section className="card w-full max-w-2xl overflow-hidden text-center"><div className="bg-[#183153] px-6 py-9 text-white"><span className="mx-auto grid size-16 place-items-center rounded-full bg-[#ffd166] text-[#183153]"><GraduationCap size={34} /></span><h1 className="mt-4 text-3xl font-black">Great job!</h1><p className="mt-2 text-[#dce8f4]">You finished your English practice test.</p></div><div className="p-6 sm:p-9"><p className="muted text-sm font-extrabold uppercase tracking-widest">Your score</p><p className="mt-2 text-6xl font-black text-[#2869c7]">{result.score}<span className="text-3xl text-[#7890aa]"> / {result.maxScore}</span></p><p className="mt-2 text-2xl font-extrabold">{result.percentage}%</p><div className="mx-auto mt-7 grid max-w-lg grid-cols-3 gap-3"><div className="rounded-2xl bg-[#edf8f3] p-4"><strong className="text-xl text-[#267258]">{result.correctCount}</strong><span className="muted block text-xs font-bold">Correct</span></div><div className="rounded-2xl bg-[#f2f5f8] p-4"><strong className="text-xl">{result.totalQuestions}</strong><span className="muted block text-xs font-bold">Total</span></div><div className="rounded-2xl bg-[#fff5d8] p-4"><strong className="text-xl">{formatDuration(result.durationSeconds)}</strong><span className="muted block text-xs font-bold">Time</span></div></div><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link className="btn btn-primary" href={`/attempts/${attemptId}`}><CheckCircle2 size={18} /> Review My Answers</Link><Link className="btn btn-secondary" href="/">Back to Home</Link></div></div></section></main>;
}
