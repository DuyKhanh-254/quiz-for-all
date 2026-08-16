import Link from "next/link";
import { ArrowLeft, CheckCircle2, CircleX } from "lucide-react";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate, formatDuration } from "@/lib/format";
import { QuestionImage } from "@/components/question-image";

function displayAnswer(response: unknown) {
  if (!response || typeof response !== "object") return "No answer";
  const item = response as { option?: string; value?: string; pairs?: Record<string, string>; accepted?: string[] };
  if (item.option) return `Choice ${item.option.toUpperCase()}`;
  if (item.value != null) return item.value || "No answer";
  if (item.accepted) return item.accepted.join(" / ");
  if (item.pairs) return Object.entries(item.pairs).map(([left, right]) => `${left} → ${right}`).join(", ");
  return "No answer";
}

export default async function AdminAttemptDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createAdminClient();
  const { data: attempt } = await admin.from("attempts").select("*").eq("id", id).maybeSingle();
  if (!attempt) notFound();
  const [{ data: rows }, { data: quiz }] = await Promise.all([
    admin.from("attempt_answers").select("question_id,response,is_correct,awarded_points,questions(id,prompt,image_url,points,position,question_type,quiz_sections(title,position),answer_keys(answer,explanation))").eq("attempt_id", id),
    admin.from("quizzes").select("title").eq("id", attempt.quiz_id).single(),
  ]);
  const sorted = (rows ?? []).sort((a, b) => {
    const aq = a.questions as unknown as { position: number; quiz_sections: { position: number } };
    const bq = b.questions as unknown as { position: number; quiz_sections: { position: number } };
    return aq.quiz_sections.position - bq.quiz_sections.position || aq.position - bq.position;
  });
  return <main className="shell py-8"><Link className="inline-flex items-center gap-2 text-sm font-extrabold text-[#496580]" href="/admin"><ArrowLeft size={17} /> Back to results</Link><section className="card mt-5 p-6"><div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><p className="text-sm font-extrabold text-[#61738a]">{quiz?.title}</p><h1 className="mt-1 text-3xl font-black">{attempt.student_name}</h1><p className="muted mt-2">Class {attempt.class_name}</p></div><div className="rounded-2xl bg-[#eaf3ff] px-7 py-4 text-center"><strong className="text-3xl text-[#245ea9]">{attempt.percentage}%</strong><span className="block text-xs font-extrabold">{attempt.score} / {attempt.max_score} points</span></div></div><dl className="mt-6 grid gap-4 border-t border-[#dce6ee] pt-5 sm:grid-cols-2 lg:grid-cols-4"><Info label="Started" value={formatDate(attempt.started_at)} /><Info label="Submitted" value={formatDate(attempt.submitted_at)} /><Info label="Duration" value={formatDuration(attempt.duration_seconds)} /><Info label="Correct" value={`${attempt.correct_count} / ${attempt.total_questions}`} /></dl></section>
    <section className="mt-7"><h2 className="text-2xl font-black">Full submission</h2><div className="mt-4 space-y-4">{sorted.length === 0 ? <div className="card p-6 muted">No answer rows were saved for this submission.</div> : sorted.map((row, index) => { const question = row.questions as unknown as { id: string; prompt: string; image_url: string | null; points: number; quiz_sections: { title: string; position: number }; answer_keys: { answer: unknown; explanation: string | null } | Array<{ answer: unknown; explanation: string | null }> }; const relation = Array.isArray(question.answer_keys) ? question.answer_keys[0] : question.answer_keys; return <article className="card p-5 sm:p-6" key={row.question_id}><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-extrabold uppercase tracking-wider text-[#61738a]">Part {question.quiz_sections.position} · {question.quiz_sections.title}</p><h3 className="mt-1 text-lg font-extrabold">{index + 1}. {question.prompt}</h3></div>{row.is_correct ? <span className="badge bg-[#e8f7f0] text-[#246c53]"><CheckCircle2 size={15} /> Correct</span> : <span className="badge bg-[#fff0f1] text-[#9a3038]"><CircleX size={15} /> Incorrect</span>}</div>{question.image_url && <QuestionImage className="mt-4 max-w-xl" src={question.image_url} alt={question.prompt} />}<div className="mt-5 grid gap-3 sm:grid-cols-2"><div className={`rounded-2xl border p-4 ${row.is_correct ? "border-[#b9dfcf] bg-[#f0faf5]" : "border-[#efc8ca] bg-[#fff5f5]"}`}><p className="text-xs font-extrabold uppercase tracking-wider">Student answer</p><p className="mt-2 font-bold">{displayAnswer(row.response)}</p></div><div className="rounded-2xl border border-[#b9d1e8] bg-[#f1f7fd] p-4"><p className="text-xs font-extrabold uppercase tracking-wider">Correct answer</p><p className="mt-2 font-bold">{displayAnswer(relation?.answer)}</p></div></div><p className="muted mt-4 text-sm">Points: <strong>{row.awarded_points} / {question.points}</strong>{relation?.explanation ? ` · ${relation.explanation}` : ""}</p></article>; })}</div></section>
  </main>;
}

function Info({ label, value }: { label: string; value: string }) { return <div><dt className="text-xs font-extrabold uppercase tracking-wider text-[#61738a]">{label}</dt><dd className="mt-1 font-bold">{value}</dd></div>; }
