"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock3, LoaderCircle } from "lucide-react";
import { QuestionCard } from "@/components/questions";
import { formatDate, formatDuration } from "@/lib/format";
import type { AttemptAnswer, AttemptSummary, Quiz } from "@/lib/types";

export function AttemptReview({ attemptId }: { attemptId: string }) {
  const [payload, setPayload] = useState<{ attempt: AttemptSummary; quiz: Quiz; answers: AttemptAnswer[] } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/attempts/${attemptId}`, { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error);
        if (body.attempt.status !== "submitted") throw new Error("This test has not been submitted yet.");
        setPayload(body);
      })
      .catch((cause) => setError(cause instanceof Error ? cause.message : "Review unavailable."));
  }, [attemptId]);

  const answers = useMemo(() => new Map(payload?.answers.map((answer) => [answer.question_id, answer]) ?? []), [payload]);
  if (error) return <main className="shell py-16"><div className="error-box mx-auto max-w-xl">{error}<div><Link className="btn btn-secondary mt-4" href="/">Back to home</Link></div></div></main>;
  if (!payload) return <main className="shell grid min-h-screen place-items-center"><LoaderCircle className="animate-spin text-[#2869c7]" size={35} /></main>;

  const questionNumbers = Object.fromEntries(
    payload.quiz.quiz_sections.flatMap((section) => section.questions).map((question, index) => [question.id, index + 1]),
  );

  return <main className="pb-16">
    <header className="border-b border-[#d6e1e9] bg-white"><div className="shell py-5">
      <Link className="inline-flex items-center gap-2 text-sm font-bold text-[#496580]" href="/"><ArrowLeft size={17} /> Home</Link>
      <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-bold text-[#61738a]">Answer review</p><h1 className="mt-1 text-3xl font-black">{payload.quiz.title}</h1><p className="muted mt-2">{payload.attempt.student_name} · {payload.attempt.class_name} · {formatDate(payload.attempt.submitted_at)}</p></div><div className="rounded-2xl bg-[#eaf3ff] px-6 py-4 text-center"><strong className="text-3xl text-[#245ea9]">{payload.attempt.percentage}%</strong><span className="block text-xs font-extrabold text-[#58728d]">{payload.attempt.score} / {payload.attempt.max_score} points</span></div></div>
      <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold"><span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-[#2e8b68]" /> {payload.attempt.correct_count} correct</span><span className="flex items-center gap-2"><Clock3 size={17} /> {formatDuration(payload.attempt.duration_seconds)}</span></div>
    </div></header>
    <div className="shell mt-7 max-w-4xl"><p className="mb-6 rounded-2xl bg-[#fff5d8] p-4 text-sm font-bold text-[#674c12]">This review shows your own answers and whether each was correct. The reusable master answer key stays protected with your teacher.</p>
      {payload.quiz.quiz_sections.map((section) => <section key={section.id} className="mb-9"><div className="mb-4"><p className="text-sm font-extrabold text-[#617a94]">Part {section.position}</p><h2 className="text-2xl font-black">{section.title}</h2></div><div className="space-y-5">{section.questions.map((question) => { const answer = answers.get(question.id); return <QuestionCard key={question.id} question={question} number={questionNumbers[question.id]} value={answer?.response} readonly isCorrect={answer?.is_correct ?? false} />; })}</div></section>)}
    </div>
  </main>;
}
