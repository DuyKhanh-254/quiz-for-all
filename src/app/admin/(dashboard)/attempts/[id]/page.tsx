import Link from "next/link";
import { ArrowLeft, CheckCircle2, CircleX, HelpCircle, Music2 } from "lucide-react";
import { notFound } from "next/navigation";
import { AudioPlayer } from "@/components/audio-player";
import { QuestionImage } from "@/components/question-image";
import { SpriteImage } from "@/components/sprite-image";
import { formatDate, formatDuration } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase/admin";

type ResponseValue = { option?: string; value?: string; pairs?: Record<string, string>; accepted?: string[] };
type Option = { id: string; option_key: string; option_text: string | null; image_url: string | null; position: number };
type Section = { title: string; position: number; audio_url: string | null };
type Question = {
  id: string;
  prompt: string;
  image_url: string | null;
  audio_url: string | null;
  metadata: { left_items?: Array<{ key: string; text: string }>; sprite_columns?: number; sprite_rows?: number; sprite_index?: number; visual_theme?: string; concept?: string } | null;
  points: number;
  position: number;
  question_type: string;
  quiz_sections: Section | Section[];
  question_options: Option[];
  answer_keys: { answer: ResponseValue; explanation: string | null } | Array<{ answer: ResponseValue; explanation: string | null }>;
};
type AnswerRow = { question_id: string; response: ResponseValue; is_correct: boolean | null; awarded_points: number | null };

function one<T>(relation: T | T[] | null | undefined) {
  return Array.isArray(relation) ? relation[0] : relation;
}

function optionLabel(question: Question, key: string) {
  const option = question.question_options.find((item) => item.option_key === key);
  return option ? `${key.toUpperCase()}. ${option.option_text || `Hình ${key.toUpperCase()}`}` : key.toUpperCase();
}

function displayAnswer(response: ResponseValue | null | undefined, question: Question) {
  if (!response) return "Không trả lời";
  if (response.option) return optionLabel(question, response.option);
  if (response.value != null) return response.value.trim() || "Không trả lời";
  if (response.accepted?.length) return response.accepted.join(" / ");
  if (response.pairs) {
    const leftItems = question.metadata?.left_items ?? [];
    return Object.entries(response.pairs).map(([left, right]) => {
      const leftText = leftItems.find((item) => item.key === left)?.text || left;
      return `${leftText} → ${optionLabel(question, right)}`;
    }).join("; ");
  }
  return "Không trả lời";
}

function StatusBadge({ answer }: { answer?: AnswerRow }) {
  if (!answer) return <span className="badge bg-[#f1f5f9] text-[#64748b]"><HelpCircle size={15} /> Chưa trả lời</span>;
  return answer.is_correct
    ? <span className="badge bg-[#e8f7f0] text-[#246c53]"><CheckCircle2 size={15} /> Đúng</span>
    : <span className="badge bg-[#fff0f1] text-[#9a3038]"><CircleX size={15} /> Sai</span>;
}

export default async function AdminAttemptDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createAdminClient();
  const { data: attempt } = await admin.from("attempts").select("*").eq("id", id).maybeSingle();
  if (!attempt) notFound();

  const [{ data: rows }, { data: quiz }, { data: questionRows }] = await Promise.all([
    admin.from("attempt_answers").select("question_id,response,is_correct,awarded_points").eq("attempt_id", id),
    admin.from("quizzes").select("title").eq("id", attempt.quiz_id).single(),
    admin.from("questions")
      .select("id,prompt,image_url,audio_url,metadata,points,position,question_type,quiz_sections(title,position,audio_url),question_options(id,option_key,option_text,image_url,position),answer_keys(answer,explanation)")
      .eq("quiz_id", attempt.quiz_id),
  ]);

  const answers = new Map((rows as AnswerRow[] | null ?? []).map((row) => [row.question_id, row]));
  const questions = (questionRows as unknown as Question[] | null ?? [])
    .map((question) => ({ ...question, question_options: [...(question.question_options ?? [])].sort((a, b) => a.position - b.position) }))
    .sort((a, b) => {
      const sectionA = one(a.quiz_sections)?.position ?? 0;
      const sectionB = one(b.quiz_sections)?.position ?? 0;
      return sectionA - sectionB || a.position - b.position;
    });

  return (
    <main className="shell py-8">
      <Link className="inline-flex items-center gap-2 text-sm font-extrabold text-[#496580]" href="/admin"><ArrowLeft size={17} /> Quay lại bảng kết quả</Link>
      <section className="card mt-5 p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div><p className="text-sm font-extrabold text-[#61738a]">{quiz?.title}</p><h1 className="mt-1 text-3xl font-black">{attempt.student_name}</h1><p className="muted mt-2">Lớp {attempt.class_name}</p></div>
          <div className="rounded-2xl bg-[#eaf3ff] px-7 py-4 text-center"><strong className="text-3xl text-[#245ea9]">{attempt.percentage}%</strong><span className="block text-xs font-extrabold">{attempt.score} / {attempt.max_score} điểm</span></div>
        </div>
        <dl className="mt-6 grid gap-4 border-t border-[#dce6ee] pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <Info label="Bắt đầu" value={formatDate(attempt.started_at)} /><Info label="Nộp bài" value={formatDate(attempt.submitted_at)} /><Info label="Thời gian" value={formatDuration(attempt.duration_seconds)} /><Info label="Số câu đúng" value={`${attempt.correct_count} / ${attempt.total_questions}`} />
        </dl>
      </section>

      <section className="mt-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-xs font-extrabold uppercase tracking-wider text-[#61738a]">Toàn bộ đề và bài làm</p><h2 className="mt-1 text-2xl font-black">Chi tiết từng câu</h2></div>
          <span className="badge bg-[#eaf3ff] text-[#245ea9] font-extrabold">{questions.length} câu hỏi</span>
        </div>
        <div className="mt-4 space-y-5">
          {questions.length === 0 ? <div className="card p-6 muted">Không tìm thấy nội dung đề của bài làm này.</div> : questions.map((question, index) => {
            const answer = answers.get(question.id);
            const answerKey = one(question.answer_keys);
            const section = one(question.quiz_sections);
            const selectedKey = answer?.response?.option;
            const correctKey = answerKey?.answer?.option;
            return (
              <article className="card overflow-hidden" key={question.id}>
                <header className="border-b border-[#dce6ee] bg-[#f8fafc] p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div><p className="text-xs font-extrabold uppercase tracking-wider text-[#61738a]">Phần {section?.position ?? "—"} · {section?.title ?? "Bài kiểm tra"} · {question.points} điểm</p><h3 className="mt-2 text-lg font-extrabold leading-relaxed">Câu {index + 1}. {question.prompt}</h3></div>
                    <StatusBadge answer={answer} />
                  </div>
                </header>
                <div className="p-5 sm:p-6">
                  {section?.audio_url && <div className="mb-5"><p className="mb-2 flex items-center gap-2 text-sm font-extrabold"><Music2 size={17} /> Audio của phần</p><AudioPlayer src={section.audio_url} label={`Audio phần ${section.position}`} /></div>}
                  {question.audio_url && question.audio_url !== section?.audio_url && <div className="mb-5"><p className="mb-2 flex items-center gap-2 text-sm font-extrabold"><Music2 size={17} /> Audio của câu hỏi</p><AudioPlayer src={question.audio_url} label={`Audio câu ${index + 1}`} /></div>}
                  {question.image_url && question.metadata?.visual_theme === "test-5-illustrated" ? (
                    <div className="mb-5 rounded-3xl border border-[#c9dc9d] bg-[#f8fceb] p-5">
                      <p className="mb-3 text-center text-xl font-black text-[#326b24]">{question.metadata.concept}</p>
                      <SpriteImage
                        src={question.image_url}
                        columns={Number(question.metadata.sprite_columns) || 1}
                        rows={Number(question.metadata.sprite_rows) || 1}
                        index={Number(question.metadata.sprite_index) || 0}
                        alt={`Minh họa ${question.metadata.concept || question.prompt}`}
                        className="mx-auto w-full max-w-[17rem] border-4 border-white shadow-lg"
                      />
                    </div>
                  ) : question.image_url ? <QuestionImage className="mb-5 max-w-3xl" src={question.image_url} alt={question.prompt} /> : null}

                  {question.question_options.length > 0 && (
                    <div className={`grid gap-3 ${question.question_type === "image_choice" ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
                      {question.question_options.map((option) => {
                        const isSelected = selectedKey === option.option_key;
                        const isCorrect = correctKey === option.option_key;
                        const style = isCorrect ? "border-[#22c55e] bg-[#f0fdf4]" : isSelected ? "border-[#ef4444] bg-[#fef2f2]" : "border-[#dce6ee] bg-white";
                        return (
                          <div key={option.id} className={`rounded-2xl border-2 p-4 ${style}`}>
                            {option.image_url && <QuestionImage className="mb-3 min-h-32" src={option.image_url} alt={option.option_text || `Đáp án ${option.option_key}`} />}
                            <div className="flex items-start gap-3">
                              <span className={`grid size-9 shrink-0 place-items-center rounded-full text-sm font-black uppercase ${isCorrect ? "bg-[#22c55e] text-white" : isSelected ? "bg-[#ef4444] text-white" : "bg-[#edf1f5] text-[#425d77]"}`}>{option.option_key}</span>
                              <div><p className="font-bold">{option.option_text || `Hình ${option.option_key.toUpperCase()}`}</p><div className="mt-2 flex flex-wrap gap-2">{isCorrect && <span className="badge bg-[#dcfce7] text-[#15803d]"><CheckCircle2 size={14} /> Đáp án đúng</span>}{isSelected && <span className={`badge ${isCorrect ? "bg-[#dbeafe] text-[#1d4ed8]" : "bg-[#fee2e2] text-[#b91c1c]"}`}>Học sinh chọn</span>}</div></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className={`rounded-2xl border p-4 ${answer?.is_correct ? "border-[#b9dfcf] bg-[#f0faf5]" : "border-[#efc8ca] bg-[#fff5f5]"}`}><p className="text-xs font-extrabold uppercase tracking-wider">Đáp án học sinh chọn</p><p className="mt-2 whitespace-pre-wrap font-bold">{displayAnswer(answer?.response, question)}</p></div>
                    <div className="rounded-2xl border border-[#b9d1e8] bg-[#f1f7fd] p-4"><p className="text-xs font-extrabold uppercase tracking-wider">Đáp án đúng</p><p className="mt-2 whitespace-pre-wrap font-bold">{displayAnswer(answerKey?.answer, question)}</p></div>
                  </div>
                  <p className="muted mt-4 text-sm">Điểm: <strong>{answer?.awarded_points ?? 0} / {question.points}</strong>{answerKey?.explanation ? ` · ${answerKey.explanation}` : ""}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs font-extrabold uppercase tracking-wider text-[#61738a]">{label}</dt><dd className="mt-1 font-bold">{value}</dd></div>;
}
