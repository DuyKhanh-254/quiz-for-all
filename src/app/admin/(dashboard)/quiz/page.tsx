import Link from "next/link";
import { CheckCircle2, ImageIcon, Music2 } from "lucide-react";
import { AudioPlayer } from "@/components/audio-player";
import { QuestionImage } from "@/components/question-image";
import { SpriteImage } from "@/components/sprite-image";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = { title: "Quiz content" };

type Answer = { option?: string; accepted?: string[]; pairs?: Record<string, string> };
type Metadata = { visual_theme?: string; concept?: string; sprite_columns?: number; sprite_rows?: number; sprite_index?: number; left_items?: Array<{ key: string; text: string }> };

function first<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function answerText(answer: Answer | undefined, options: Array<{ option_key: string; option_text: string | null }>) {
  if (!answer) return "Chưa có đáp án";
  if (answer.option) {
    const option = options.find((item) => item.option_key === answer.option);
    return `${answer.option.toUpperCase()}. ${option?.option_text || "Hình minh họa"}`;
  }
  if (answer.accepted) return answer.accepted.join(" / ");
  if (answer.pairs) return Object.entries(answer.pairs).map(([left, right]) => `${left} → ${right.toUpperCase()}`).join("; ");
  return JSON.stringify(answer);
}

export default async function AdminQuizPage({ searchParams }: { searchParams: Promise<{ quiz?: string }> }) {
  const params = await searchParams;
  const admin = createAdminClient();
  const { data: quizList } = await admin.from("quizzes").select("id,title,is_published").order("created_at", { ascending: true });
  const selectedId = quizList?.some((item) => item.id === params.quiz) ? params.quiz : quizList?.at(-1)?.id;

  if (!selectedId) return <main className="shell py-8"><h1 className="text-3xl font-black">Nội dung bài kiểm tra</h1><div className="card muted mt-6 p-8">Chưa có bài kiểm tra nào được nhập.</div></main>;

  const { data: quiz } = await admin.from("quizzes")
    .select("id,title,description,grade,subject,is_published,quiz_sections(id,title,instruction,section_type,position,audio_url,questions(id,position,prompt,question_type,image_url,audio_url,metadata,points,question_options(id,option_key,option_text,image_url,position),answer_keys(answer)))")
    .eq("id", selectedId)
    .single();
  if (!quiz) return <main className="shell py-8"><div className="error-box">Không tải được nội dung bài kiểm tra.</div></main>;
  quiz.quiz_sections.sort((a, b) => a.position - b.position);

  return <main className="shell py-8">
    <div><p className="text-sm font-extrabold uppercase tracking-wider text-[#61738a]">Kho nội dung</p><h1 className="mt-1 text-3xl font-black">Kiểm tra đề và đáp án</h1><p className="muted mt-2">Chọn một bài để xem đầy đủ câu hỏi, hình ảnh, lựa chọn và đáp án chuẩn.</p></div>

    <nav className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Danh sách bài kiểm tra">
      {(quizList ?? []).map((item, index) => <Link key={item.id} href={`/admin/quiz?quiz=${item.id}`} className={`rounded-2xl border-2 p-4 transition hover:-translate-y-0.5 ${item.id === selectedId ? "border-[#2869c7] bg-[#edf5ff] shadow-md" : "border-[#dce6ee] bg-white hover:border-[#96b4d0]"}`}><div className="flex items-start justify-between gap-3"><span className="grid size-9 place-items-center rounded-xl bg-[#183153] font-black text-white">{index + 1}</span><span className={`badge ${item.is_published ? "bg-[#e8f7f0] text-[#246c53]" : "bg-[#fff0f1] text-[#9a3038]"}`}>{item.is_published ? "Đã mở" : "Bản nháp"}</span></div><p className="mt-3 font-black">{item.title}</p></Link>)}
    </nav>

    <section className="mt-8 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-3xl font-black">{quiz.title}</h2><p className="muted mt-2">{quiz.grade} · {quiz.subject} · {quiz.description}</p></div><span className={`badge ${quiz.is_published ? "bg-[#e8f7f0] text-[#246c53]" : "bg-[#fff0f1] text-[#9a3038]"}`}>{quiz.is_published ? "Published" : "Draft"}</span></section>

    <div className="mt-7 space-y-6">{quiz.quiz_sections.map((section) => <section className="card overflow-hidden" key={section.id}>
      <header className="border-b border-[#dce6ee] bg-[#f7fafc] p-5"><p className="text-xs font-extrabold uppercase tracking-wider text-[#61738a]">Part {section.position} · {section.section_type}</p><h2 className="mt-1 text-xl font-black">{section.title}</h2><p className="muted mt-1 text-sm">{section.instruction}</p>{section.audio_url && <div className="mt-4"><AudioPlayer src={section.audio_url} label={`Audio ${section.title}`} /></div>}</header>
      <ol className="divide-y divide-[#e1e8ee]">{section.questions.sort((a, b) => a.position - b.position).map((question) => {
        const key = first(question.answer_keys)?.answer as Answer | undefined;
        const metadata = question.metadata as Metadata;
        const options = [...question.question_options].sort((a, b) => a.position - b.position);
        return <li className="p-5 sm:p-6" key={question.id}>
          <div className="flex flex-wrap justify-between gap-3"><div><p className="text-xs font-bold text-[#61738a]">Câu {question.position} · {question.question_type} · {question.points} điểm</p>{metadata.concept && <p className="mt-2 text-2xl font-black text-[#326b24]">{metadata.concept}</p>}<p className="mt-1 font-extrabold">{question.prompt}</p></div><span className="badge h-fit bg-[#e8f7f0] text-[#246c53]"><CheckCircle2 size={15} /> {answerText(key, options)}</span></div>
          {question.audio_url && <div className="mt-4"><AudioPlayer src={question.audio_url} label={`Audio câu ${question.position}`} /></div>}
          {question.image_url && metadata.visual_theme === "test-5-illustrated" ? <SpriteImage src={question.image_url} columns={Number(metadata.sprite_columns) || 1} rows={Number(metadata.sprite_rows) || 1} index={Number(metadata.sprite_index) || 0} alt={`Minh họa ${metadata.concept || question.prompt}`} className="mt-4 w-full max-w-[16rem] border-4 border-white shadow-lg" /> : question.image_url ? <QuestionImage className="mt-4 max-w-xl" src={question.image_url} alt={question.prompt} /> : null}
          {options.length > 0 && <div className="mt-4 grid gap-2 sm:grid-cols-2">{options.map((option) => <div key={option.id} className={`rounded-xl border-2 p-3 font-bold ${key?.option === option.option_key ? "border-[#22c55e] bg-[#f0fdf4] text-[#166534]" : "border-[#dce6ee] bg-white"}`}><span className="mr-2 inline-grid size-7 place-items-center rounded-full bg-[#edf1f5] text-xs font-black uppercase">{option.option_key}</span>{option.option_text || "Hình minh họa"}{option.image_url && <span className="muted ml-2 inline-flex items-center gap-1 text-xs"><ImageIcon size={13} /> ảnh</span>}</div>)}</div>}
          {!question.image_url && !question.audio_url && options.length === 0 && <p className="muted mt-3 flex items-center gap-2 text-xs"><Music2 size={15} /> Không có media riêng</p>}
        </li>;
      })}</ol>
    </section>)}</div>
  </main>;
}
