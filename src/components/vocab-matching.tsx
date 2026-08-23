"use client";

import { useMemo, useState } from "react";
import { Award, CheckCircle2, GripVertical, Link2, RefreshCw, Send, Undo2, XCircle } from "lucide-react";

type Item = { id: string; question: string; answer: string };
type Topic = { id: "body" | "zoo"; title: string; vocabulary: string; items: Item[] };

const makeItems = (topic: string, rows: [string, string][]): Item[] =>
  rows.map(([question, answer], index) => ({ id: `${topic}-${index + 1}`, question, answer }));

const TOPICS: Topic[] = [
  {
    id: "body",
    title: "Topic 1: My Body",
    vocabulary: "head, hair, eyes, nose, mouth, ears, hands, foot, legs, arm, face, teeth",
    items: makeItems("body", [
      ["What do you wear a hat on?", "I wear a hat on my head."],
      ["What can be long, short, black or brown on your head?", "It is my hair."],
      ["What do you close when you go to sleep?", "I close my eyes."],
      ["What is between your eyes and your mouth?", "It is my nose."],
      ["What do you open when you want to eat?", "I open my mouth."],
      ["What are on the two sides of your head and help you hear?", "They are my ears."],
      ["What do you clap with?", "I clap with my hands."],
      ["What part of your body has five toes?", "My foot has five toes."],
      ["What do you move when you kick a ball?", "I move my legs."],
      ["What do you lift when you put your hand up in class?", "I lift my arm."],
      ["What part of your body do you wash in the morning and can see in a mirror?", "I wash my face."],
      ["What do you brush every morning and night?", "I brush my teeth."],
    ]),
  },
  {
    id: "zoo",
    title: "Topic 2: At the Zoo",
    vocabulary: "elephant, lion, monkey, tiger, giraffe, bear, snake, bird, fish, crocodile, hippo, zebra",
    items: makeItems("zoo", [
      ["Which animal has two big ears and a long trunk?", "It is an elephant."],
      ["Which big cat has a lot of hair around its head?", "It is a lion."],
      ["Which animal can use its hands and feet to climb trees?", "It is a monkey."],
      ["Which big cat has black stripes on its body?", "It is a tiger."],
      ["Which animal can eat leaves from very tall trees?", "It is a giraffe."],
      ["Which big animal has thick fur and strong legs?", "It is a bear."],
      ["Which animal moves on the ground without any legs?", "It is a snake."],
      ["Which animal has two wings, two legs and a beak?", "It is a bird."],
      ["Which animal lives in water and has no legs?", "It is a fish."],
      ["Which big green animal can swim and has many sharp teeth?", "It is a crocodile."],
      ["Which big animal spends a lot of time in water and has short legs?", "It is a hippo."],
      ["Which animal has black and white stripes all over its body?", "It is a zebra."],
    ]),
  },
];

const ORDER = [7, 2, 10, 5, 0, 9, 3, 11, 6, 1, 8, 4];

export function VocabMatching({ fullName, className, onLockChange }: {
  fullName: string;
  className: string;
  onLockChange?: (locked: boolean) => void;
}) {
  const [activeTopic, setActiveTopic] = useState<Topic["id"]>("body");
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [draggedAnswer, setDraggedAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const allItems = useMemo(() => TOPICS.flatMap((topic) => topic.items), []);
  const answers = useMemo(() => Object.fromEntries(allItems.map((item) => [item.id, item.answer])), [allItems]);
  const topic = TOPICS.find((item) => item.id === activeTopic) ?? TOPICS[0];
  const used = new Set(Object.values(assignments));
  const available = ORDER.map((index) => topic.items[index]).filter((item) => !used.has(item.id));
  const completed = Object.keys(assignments).length;
  const correct = allItems.filter((item) => assignments[item.id] === item.id).length;

  const place = (questionId: string, answerId: string) => {
    if (submitted || !answerId) return;
    setAssignments((current) => {
      const next = { ...current };
      for (const key of Object.keys(next)) if (next[key] === answerId) delete next[key];
      next[questionId] = answerId;
      return next;
    });
    setSelectedAnswer(null);
    setDraggedAnswer(null);
  };

  const remove = (questionId: string) => {
    if (submitted) return;
    setAssignments((current) => {
      const next = { ...current };
      delete next[questionId];
      return next;
    });
  };

  const reset = () => {
    setAssignments({});
    setSelectedAnswer(null);
    setSubmitted(false);
    setActiveTopic("body");
    onLockChange?.(true);
  };

  return (
    <div className="space-y-6">
      {submitted && (
        <section className="card overflow-hidden border-2 border-[#22c55e] bg-white text-center">
          <div className="bg-[#22c55e] p-6 text-white">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-white text-[#22c55e]"><Award size={32} /></span>
            <h3 className="mt-3 text-3xl font-black">Kết quả bài nối câu!</h3>
            <p className="mt-1 font-bold text-emerald-100">Học sinh: {fullName} · Lớp {className}</p>
          </div>
          <div className="p-6">
            <p className="text-5xl font-black text-[#15803d]">{correct} <span className="text-2xl text-slate-400">/ {allItems.length}</span></p>
            <p className="mt-2 text-xl font-extrabold text-[#166534]">Đạt {Math.round(correct / allItems.length * 100)}% số câu đúng</p>
            <button type="button" onClick={reset} className="btn btn-primary mt-6 !bg-[#f59e0b] hover:!bg-[#d97706]"><RefreshCw size={18} /> Làm lại</button>
          </div>
        </section>
      )}

      <section className="card border-2 border-[#f6d77d] bg-[#fffdf7] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="badge bg-[#fef0c7] text-[#785412] font-black"><Link2 size={15} /> Nối câu hỏi &amp; trả lời</span>
            <h3 className="mt-3 text-2xl font-black text-[#78350f]">Kéo câu trả lời vào câu hỏi phù hợp</h3>
            <p className="muted mt-1 text-sm font-bold">Trên điện thoại: chạm vào câu trả lời, sau đó chạm vào ô câu hỏi.</p>
          </div>
          <span className="badge bg-[#fef3c7] text-[#926011] font-black">Đã nối {completed}/{allItems.length}</span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          {TOPICS.map((item) => {
            const done = item.items.filter((entry) => assignments[entry.id]).length;
            return (
              <button key={item.id} type="button" onClick={() => { setActiveTopic(item.id); setSelectedAnswer(null); }}
                className={`rounded-2xl border-2 px-4 py-3 text-left transition ${activeTopic === item.id ? "border-[#f59e0b] bg-[#fef3c7] text-[#78350f] shadow-sm" : "border-[#e2e8f0] bg-white text-[#35516e] hover:border-[#f6d77d]"}`}>
                <span className="block text-sm font-black">{item.title}</span>
                <span className="mt-1 block text-xs font-bold">{done}/12 câu đã nối</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border-2 border-[#f6d77d] bg-[#fff8e7] p-5 sm:p-6">
        <h3 className="text-xl font-black text-[#78350f]">{topic.title}</h3>
        <p className="mt-2 text-sm font-bold text-[#785412]"><span className="font-black">Target vocabulary:</span> {topic.vocabulary}</p>
        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]">
          <div className="space-y-3">
            {topic.items.map((item, index) => {
              const answerId = assignments[item.id];
              const isCorrect = answerId === item.id;
              return (
                <article key={item.id} onClick={() => selectedAnswer && place(item.id, selectedAnswer)}
                  onDragOver={(event) => { if (!submitted) event.preventDefault(); }}
                  onDrop={(event) => { event.preventDefault(); place(item.id, event.dataTransfer.getData("text/plain") || draggedAnswer || ""); }}
                  className={`rounded-2xl border-2 bg-white p-4 transition ${submitted ? (isCorrect ? "border-[#86efac] bg-[#f0fdf4]" : "border-[#fca5a5] bg-[#fef2f2]") : selectedAnswer ? "cursor-pointer border-dashed border-[#f59e0b] hover:bg-[#fffbeb]" : answerId ? "border-[#f6d77d]" : "border-dashed border-[#cbd5e1]"}`}>
                  <div className="flex items-start gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#fef3c7] text-sm font-black text-[#926011]">{index + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-black leading-relaxed text-[#1e293b]">Q: {item.question}</p>
                      {answerId ? (
                        <div draggable={!submitted} onDragStart={(event) => { event.stopPropagation(); event.dataTransfer.setData("text/plain", answerId); setDraggedAnswer(answerId); }}
                          className={`mt-3 flex items-start gap-2 rounded-xl border-2 p-3 font-bold ${submitted ? (isCorrect ? "border-[#22c55e] bg-[#dcfce7] text-[#166534]" : "border-[#ef4444] bg-[#fee2e2] text-[#991b1b]") : "cursor-grab border-[#f59e0b] bg-[#fffbeb] text-[#78350f]"}`}>
                          <GripVertical className="mt-0.5 shrink-0" size={18} /><span className="flex-1">A: {answers[answerId]}</span>
                          {!submitted && <button type="button" aria-label="Bỏ câu trả lời" onClick={(event) => { event.stopPropagation(); remove(item.id); }} className="rounded-lg p-1 hover:bg-[#fde68a]"><Undo2 size={17} /></button>}
                        </div>
                      ) : (
                        <div className="mt-3 rounded-xl border-2 border-dashed border-[#cbd5e1] px-3 py-4 text-center text-sm font-extrabold text-[#94a3b8]">{selectedAnswer ? "Chạm vào đây để đặt câu trả lời" : "Kéo câu trả lời vào đây"}</div>
                      )}
                      {submitted && !isCorrect && <p className="mt-2 flex items-start gap-1.5 text-sm font-extrabold text-[#15803d]"><CheckCircle2 className="mt-0.5 shrink-0" size={16} /> Đáp án đúng: {item.answer}</p>}
                    </div>
                    {submitted && (isCorrect ? <CheckCircle2 className="shrink-0 text-[#16a34a]" /> : <XCircle className="shrink-0 text-[#dc2626]" />)}
                  </div>
                </article>
              );
            })}
          </div>
          <aside className="lg:sticky lg:top-4 lg:self-start">
            <div className="rounded-2xl border-2 border-[#f6d77d] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2"><h4 className="font-black text-[#78350f]">Các câu trả lời</h4><span className="text-xs font-extrabold text-[#926011]">Còn {available.length}</span></div>
              {!submitted && selectedAnswer && <p className="mt-2 rounded-lg bg-[#dbeafe] px-3 py-2 text-xs font-bold text-[#1d4ed8]">Đã chọn. Hãy chạm vào câu hỏi tương ứng.</p>}
              <div className="mt-3 space-y-2">
                {available.map((item) => (
                  <button key={item.id} type="button" draggable={!submitted} disabled={submitted}
                    onClick={() => setSelectedAnswer((current) => current === item.id ? null : item.id)}
                    onDragStart={(event) => { event.dataTransfer.setData("text/plain", item.id); setDraggedAnswer(item.id); }} onDragEnd={() => setDraggedAnswer(null)}
                    className={`flex w-full items-start gap-2 rounded-xl border-2 p-3 text-left text-sm font-bold transition ${selectedAnswer === item.id ? "border-[#3b82f6] bg-[#dbeafe] text-[#1e3a8a] ring-2 ring-[#3b82f6]/20" : "cursor-grab border-[#e2e8f0] bg-white text-[#334155] hover:border-[#f59e0b] hover:bg-[#fffbeb]"}`}>
                    <GripVertical className="mt-0.5 shrink-0 text-[#94a3b8]" size={17} /><span>{item.answer}</span>
                  </button>
                ))}
                {available.length === 0 && !submitted && <p className="rounded-xl bg-[#dcfce7] p-4 text-center text-sm font-black text-[#15803d]">Đã dùng hết câu trả lời của topic này!</p>}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {!submitted && (
        <div className="sticky bottom-4 z-20 rounded-2xl border-2 border-[#f59e0b] bg-white p-4 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div><p className="text-sm font-black text-[#78350f]">Đã nối {completed}/{allItems.length} câu</p><p className="text-xs font-bold text-slate-500">{completed === allItems.length ? "Đã hoàn thành, em có thể nộp bài." : "Hãy nối đủ cả hai topic trước khi nộp bài."}</p></div>
            <button type="button" disabled={completed !== allItems.length} onClick={() => { setSubmitted(true); setSelectedAnswer(null); onLockChange?.(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="btn btn-primary !bg-[#f59e0b] px-8 text-base font-black hover:!bg-[#d97706] disabled:cursor-not-allowed disabled:opacity-50"><Send size={20} /> Nộp bài nối câu</button>
          </div>
        </div>
      )}
    </div>
  );
}
