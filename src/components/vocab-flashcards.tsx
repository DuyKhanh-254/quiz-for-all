"use client";

import { useState, useEffect } from "react";
import { Volume2, RotateCw, ArrowLeft, ArrowRight, CheckCircle2, XCircle, Sparkles, BookOpen, Award, RefreshCw, Send, LoaderCircle, Lock } from "lucide-react";
import type { JsonResponse } from "@/lib/types";

export interface VocabItem {
  id: number;
  word: string;
  phonetic: string;
  type: string;
  meaning: string;
  example: string;
  typeVi: string;
}

export const TEST1_VOCABULARY: VocabItem[] = [
  { id: 1, word: "garden", phonetic: "/ˈɡɑː.dən/", type: "noun", meaning: "khu vườn", example: "The children are playing in the garden.", typeVi: "danh từ" },
  { id: 2, word: "bedroom", phonetic: "/ˈbed.ruːm/", type: "noun", meaning: "phòng ngủ", example: "Tom and Mia are in their bedroom.", typeVi: "danh từ" },
  { id: 3, word: "sleeping", phonetic: "/ˈsliː.pɪŋ/", type: "verb", meaning: "đang ngủ", example: "Dad is sleeping on the deck chair.", typeVi: "động từ" },
  { id: 4, word: "camera", phonetic: "/ˈkæm.rə/", type: "noun", meaning: "máy ảnh", example: "The girl is taking a photo with a camera.", typeVi: "danh từ" },
  { id: 5, word: "teddy bear", phonetic: "/ˈted.i beər/", type: "noun", meaning: "gấu bông", example: "The boy is putting a teddy bear on Dad.", typeVi: "danh từ" },
  { id: 6, word: "photo", phonetic: "/ˈfəʊ.təʊ/", type: "noun", meaning: "bức ảnh", example: "Who is taking a photo?", typeVi: "danh từ" },
  { id: 7, word: "shorts", phonetic: "/ʃɔːts/", type: "noun", meaning: "quần đùi / quần ngắn", example: "Where are the shorts? Over there.", typeVi: "danh từ" },
  { id: 8, word: "shirts", phonetic: "/ʃɜːts/", type: "noun", meaning: "áo sơ mi", example: "He is wearing clean shirts.", typeVi: "danh từ" },
  { id: 9, word: "tent", phonetic: "/tent/", type: "noun", meaning: "lều cắm trại", example: "Is the teapot near the tent?", typeVi: "danh từ" },
  { id: 10, word: "teapot", phonetic: "/ˈtiː.pɒt/", type: "noun", meaning: "ấm trà", example: "The teapot is on the table.", typeVi: "danh từ" },
  { id: 11, word: "thirteen", phonetic: "/ˌθɜːˈtiːn/", type: "number", meaning: "số 13", example: "How old is your brother? He's thirteen.", typeVi: "số đếm" },
  { id: 12, word: "fourteen", phonetic: "/ˌfɔːˈtiːn/", type: "number", meaning: "số 14", example: "What number is it? It's fourteen.", typeVi: "số đếm" },
  { id: 13, word: "fifteen", phonetic: "/ˌfɪfˈtiːn/", type: "number", meaning: "số 15", example: "What number is it? It's fifteen.", typeVi: "số đếm" },
  { id: 14, word: "brother", phonetic: "/ˈbrʌð.ər/", type: "noun", meaning: "anh / em trai", example: "My brother is thirteen years old.", typeVi: "danh từ" },
  { id: 15, word: "sister", phonetic: "/ˈsɪs.tər/", type: "noun", meaning: "chị / em gái", example: "How old is your sister? She's eight.", typeVi: "danh từ" },
  { id: 16, word: "children", phonetic: "/ˈtʃɪl.drən/", type: "noun", meaning: "trẻ em / các con", example: "How many children are there?", typeVi: "danh từ" },
  { id: 17, word: "family", phonetic: "/ˈfæm.əl.i/", type: "noun", meaning: "gia đình", example: "Where is the family? In the garden.", typeVi: "danh từ" },
  { id: 18, word: "table", phonetic: "/ˈteɪ.bəl/", type: "noun", meaning: "cái bàn", example: "What is on the table?", typeVi: "danh từ" },
  { id: 19, word: "chair", phonetic: "/tʃeər/", type: "noun", meaning: "cái ghế", example: "Dad is on the deck chair.", typeVi: "danh từ" },
  { id: 20, word: "ball", phonetic: "/bɔːl/", type: "noun", meaning: "quả bóng", example: "The soccer ball is on the grass.", typeVi: "danh từ" },
  { id: 21, word: "robot", phonetic: "/ˈrəʊ.bɒt/", type: "noun", meaning: "người máy / rô-bốt", example: "I have a cool red robot.", typeVi: "danh từ" },
  { id: 22, word: "monster", phonetic: "/ˈmɒn.stər/", type: "noun", meaning: "con quái vật", example: "The green monster is friendly.", typeVi: "danh từ" },
  { id: 23, word: "spider", phonetic: "/ˈspaɪ.dər/", type: "noun", meaning: "con nhện", example: "There is a small spider on the wall.", typeVi: "danh từ" },
  { id: 24, word: "frog", phonetic: "/frɒɡ/", type: "noun", meaning: "con ếch", example: "The green frog can jump high.", typeVi: "danh từ" },
  { id: 25, word: "bird", phonetic: "/bɜːd/", type: "noun", meaning: "con chim", example: "The bird is singing in the tree.", typeVi: "danh từ" },
  { id: 26, word: "lizard", phonetic: "/ˈlɪz.əd/", type: "noun", meaning: "con thằn lằn", example: "Look at the quick lizard.", typeVi: "danh từ" },
  { id: 27, word: "bookcase", phonetic: "/ˈbʊk.keɪs/", type: "noun", meaning: "tủ sách", example: "The book is in the bookcase.", typeVi: "danh từ" },
  { id: 28, word: "door", phonetic: "/dɔːr/", type: "noun", meaning: "cửa ra vào", example: "Open the door, please.", typeVi: "danh từ" },
  { id: 29, word: "window", phonetic: "/ˈwɪn.dəʊ/", type: "noun", meaning: "cửa sổ", example: "Look out of the bedroom window.", typeVi: "danh từ" },
  { id: 30, word: "picture", phonetic: "/ˈpɪk.tʃər/", type: "noun", meaning: "bức tranh", example: "There is a picture on the wall.", typeVi: "danh từ" },
];

export interface VocabQuestion {
  id: number;
  prompt: string;
  type: "eng_to_vi" | "vi_to_eng";
  options: { key: string; text: string }[];
  correctKey: string;
  targetWord: string;
  targetMeaning: string;
}

export function generateVocabQuestions(): VocabQuestion[] {
  const questions: VocabQuestion[] = [];

  // 20 Questions Eng -> Vi
  TEST1_VOCABULARY.slice(0, 20).forEach((item, index) => {
    const distractors = TEST1_VOCABULARY
      .filter((v) => v.id !== item.id)
      .sort(() => (index % 2 === 0 ? 0.5 - Math.random() : -0.5 + Math.random()))
      .map((v) => v.meaning)
      .slice(0, 3);

    const choices = [item.meaning, ...distractors].sort(() => 0.5 - Math.random());
    const keys = ["a", "b", "c", "d"];
    const options = choices.map((c, i) => ({ key: keys[i], text: c }));
    const correctOpt = options.find((o) => o.text === item.meaning)!;

    questions.push({
      id: index + 1,
      prompt: `Nghĩa tiếng Việt của từ "${item.word}" là gì?`,
      type: "eng_to_vi",
      options,
      correctKey: correctOpt.key,
      targetWord: item.word,
      targetMeaning: item.meaning,
    });
  });

  // 10 Questions Vi -> Eng
  TEST1_VOCABULARY.slice(20, 30).concat(TEST1_VOCABULARY.slice(0, 10)).slice(0, 10).forEach((item, index) => {
    const distractors = TEST1_VOCABULARY
      .filter((v) => v.id !== item.id)
      .sort(() => (index % 2 === 0 ? -0.5 + Math.random() : 0.5 - Math.random()))
      .map((v) => v.word)
      .slice(0, 3);

    const choices = [item.word, ...distractors].sort(() => 0.5 - Math.random());
    const keys = ["a", "b", "c", "d"];
    const options = choices.map((c, i) => ({ key: keys[i], text: c }));
    const correctOpt = options.find((o) => o.text === item.word)!;

    questions.push({
      id: 20 + index + 1,
      prompt: `Từ tiếng Anh nào có nghĩa là "${item.meaning}"?`,
      type: "vi_to_eng",
      options,
      correctKey: correctOpt.key,
      targetWord: item.word,
      targetMeaning: item.meaning,
    });
  });

  return questions;
}

export function VocabFlashcards({
  fullName,
  className,
  onLockChange,
}: {
  fullName: string;
  className: string;
  onLockChange?: (locked: boolean) => void;
}) {
  const [subMode, setSubMode] = useState<"study" | "practice">("study");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Practice Quiz State
  const [questions, setQuestions] = useState<VocabQuestion[]>(generateVocabQuestions);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<{ score: number; total: number; percentage: number } | null>(null);

  // Notify parent component about lock status when taking the practice test
  useEffect(() => {
    const isLocked = subMode === "practice" && !isSubmitted;
    onLockChange?.(isLocked);
  }, [subMode, isSubmitted, onLockChange]);

  const speak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const currentItem = TEST1_VOCABULARY[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % TEST1_VOCABULARY.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + TEST1_VOCABULARY.length) % TEST1_VOCABULARY.length);
  };

  const handleOptionSelect = (questionId: number, key: string) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: key }));
  };

  const submitPractice = async () => {
    setIsSubmitting(true);
    let correctCount = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctKey) {
        correctCount++;
      }
    });

    const score = correctCount;
    const total = questions.length;
    const percentage = Math.round((correctCount / total) * 100);
    setQuizResult({ score, total, percentage });
    setIsSubmitted(true);

    // Record attempt to Supabase backend for Admin reporting
    try {
      const response = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, className, quizSlug: "test-1-vocab-flashcards" }),
      });
      const data = await response.json();
      if (response.ok && data.attemptId) {
        // Send answers
        const formattedAnswers: Record<string, JsonResponse> = {};
        questions.forEach((q) => {
          // Map to answer key format
          formattedAnswers[`32000000-0000-4000-8000-00000000${String(q.id).padStart(4, "0")}`] = {
            option: userAnswers[q.id] || "none",
          };
        });

        await fetch(`/api/attempts/${data.attemptId}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: formattedAnswers }),
        });
      }
    } catch (e) {
      console.warn("Could not save vocab attempt to server:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPractice = () => {
    setQuestions(generateVocabQuestions());
    setUserAnswers({});
    setIsSubmitted(false);
    setQuizResult(null);
  };

  const isTestingLocked = subMode === "practice" && !isSubmitted;

  return (
    <div className="space-y-6">
      {/* Sub Mode Header Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#fff8e7] p-2 border-2 border-[#f6d77d]">
        <div className="flex gap-2">
          <button
            type="button"
            disabled={isTestingLocked}
            onClick={() => setSubMode("study")}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-extrabold transition ${
              subMode === "study"
                ? "bg-[#f59e0b] text-white shadow-md"
                : isTestingLocked
                ? "opacity-50 cursor-not-allowed text-[#785412]"
                : "text-[#785412] hover:bg-[#ffe9ad]"
            }`}
          >
            <BookOpen size={18} /> 🎴 Thẻ Ghi Nhớ (Flashcards)
          </button>
          <button
            type="button"
            onClick={() => setSubMode("practice")}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-extrabold transition ${
              subMode === "practice"
                ? "bg-[#f59e0b] text-white shadow-md"
                : "text-[#785412] hover:bg-[#ffe9ad]"
            }`}
          >
            <Award size={18} /> 📝 Bài Luyện Tập (30 Câu)
          </button>
        </div>

        <div className="flex items-center gap-2">
          {isTestingLocked && (
            <span className="badge bg-[#fee2e2] text-[#991b1b] text-xs font-black animate-pulse">
              <Lock size={13} /> Khóa các phần khác cho tới khi nộp bài
            </span>
          )}
          <span className="badge bg-[#fef0c7] text-[#785412] text-xs font-black">
            🦁 30 Từ Vựng Test 1
          </span>
        </div>
      </div>

      {/* MODE 1: STUDY FLASHCARDS */}
      {subMode === "study" && (
        <div className="space-y-6">
          {/* Main Flashcard Display */}
          <div className="mx-auto max-w-xl">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative min-h-[320px] cursor-pointer rounded-3xl border-4 border-[#f6d77d] bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl flex flex-col justify-between text-center select-none"
              style={{
                background: isFlipped ? "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)" : "white",
              }}
            >
              <div className="flex items-center justify-between text-xs font-extrabold text-[#926011]">
                <span className="rounded-full bg-[#fef3c7] px-3 py-1 uppercase tracking-wider">
                  {currentItem.typeVi}
                </span>
                <span className="flex items-center gap-1">
                  <RotateCw size={14} /> Chạm để lật mặt
                </span>
              </div>

              {!isFlipped ? (
                /* Front Side (English) */
                <div className="my-auto py-6 space-y-3">
                  <span className="text-5xl font-black text-[#1e3a8a] tracking-wide block">
                    {currentItem.word}
                  </span>
                  <p className="text-xl font-bold text-[#64748b]">{currentItem.phonetic}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speak(currentItem.word);
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-[#3b82f6] px-4 py-2 text-sm font-extrabold text-white shadow hover:bg-[#2563eb] transition transform active:scale-95"
                  >
                    <Volume2 size={18} /> Nghe phát âm
                  </button>
                </div>
              ) : (
                /* Back Side (Vietnamese Meaning & Example) */
                <div className="my-auto py-6 space-y-4">
                  <p className="text-xs font-black uppercase text-[#926011] tracking-widest">Nghĩa tiếng Việt</p>
                  <h3 className="text-4xl font-black text-[#15803d]">{currentItem.meaning}</h3>
                  <div className="rounded-2xl bg-white/80 p-4 text-left border border-[#fef0c7]">
                    <p className="text-xs font-extrabold text-[#78350f]">Ví dụ câu:</p>
                    <p className="mt-1 text-base font-bold text-[#1e293b] italic">
                      &quot;{currentItem.example}&quot;
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs font-bold text-[#94a3b8]">
                <span>Mặt: {isFlipped ? "Tiếng Việt" : "Tiếng Anh"}</span>
                <span>{currentIndex + 1} / {TEST1_VOCABULARY.length}</span>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="mt-6 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handlePrev}
                className="btn btn-secondary flex-1 border-2 border-[#e2e8f0] font-extrabold"
              >
                <ArrowLeft size={18} /> Từ trước
              </button>

              <button
                type="button"
                onClick={() => speak(currentItem.word)}
                className="grid size-12 place-items-center rounded-2xl bg-[#dbeafe] text-[#1d4ed8] hover:bg-[#bfdbfe]"
                title="Nghe phát âm"
              >
                <Volume2 size={22} />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="btn btn-primary flex-1 !bg-[#f59e0b] hover:!bg-[#d97706] font-extrabold"
              >
                Từ tiếp <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Word List Grid */}
          <div className="card p-6 border-2 border-[#fef0c7]">
            <h3 className="text-lg font-extrabold text-[#78350f] mb-3 flex items-center gap-2">
              <Sparkles size={18} /> Danh sách 30 từ vựng Test 1
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
              {TEST1_VOCABULARY.map((item, idx) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsFlipped(false);
                  }}
                  className={`rounded-xl border-2 p-2.5 text-left text-xs font-bold transition ${
                    idx === currentIndex
                      ? "border-[#f59e0b] bg-[#fef3c7] text-[#78350f] font-black"
                      : "border-[#f1f5f9] bg-white hover:border-[#cbd5e1]"
                  }`}
                >
                  <span className="block text-[10px] text-[#94a3b8]">#{idx + 1}</span>
                  <span className="font-extrabold text-sm block truncate text-[#1e293b]">{item.word}</span>
                  <span className="text-[#64748b] block truncate">{item.meaning}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: PRACTICE QUIZ (30 Questions) */}
      {subMode === "practice" && (
        <div className="space-y-6">
          {/* Result Banner if Submitted */}
          {isSubmitted && quizResult && (
            <div className="card overflow-hidden border-2 border-[#22c55e] bg-white text-center">
              <div className="bg-[#22c55e] p-6 text-white">
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-white text-[#22c55e]">
                  <Award size={32} />
                </span>
                <h3 className="mt-3 text-3xl font-black">Kết quả Bài Luyện Từ Vựng!</h3>
                <p className="mt-1 text-emerald-100 font-bold">
                  Học sinh: {fullName} · Lớp {className}
                </p>
              </div>

              <div className="p-6">
                <p className="text-5xl font-black text-[#15803d]">
                  {quizResult.score} <span className="text-2xl text-slate-400">/ {quizResult.total}</span>
                </p>
                <p className="mt-2 text-xl font-extrabold text-[#166534]">
                  Đạt {quizResult.percentage}% số câu đúng
                </p>

                <p className="mt-4 text-sm font-bold text-slate-600">
                  ✅ Kết quả đã được tự động lưu và gửi cho Giáo viên (Admin) xem chi tiết! Các phần khác đã được mở khóa!
                </p>

                <div className="mt-6 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={resetPractice}
                    className="btn btn-primary !bg-[#f59e0b] hover:!bg-[#d97706]"
                  >
                    <RefreshCw size={18} /> Làm lại bài kiểm tra từ vựng
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Question Cards List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-[#78350f]">
                Bài Luyện Tập Từ Vựng (30 Câu Hỏi)
              </h3>
              <span className="text-sm font-extrabold text-[#926011]">
                Đã làm: {Object.keys(userAnswers).length} / {questions.length} câu
              </span>
            </div>

            {questions.map((q, idx) => {
              const selectedKey = userAnswers[q.id];
              const isCorrect = selectedKey === q.correctKey;

              return (
                <div
                  key={q.id}
                  className={`card p-5 border-2 transition ${
                    isSubmitted
                      ? isCorrect
                        ? "border-[#86efac] bg-[#f0fdf4]"
                        : "border-[#fca5a5] bg-[#fef2f2]"
                      : "border-[#fef0c7]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="badge bg-[#fef3c7] text-[#78350f] font-black">
                      Câu {idx + 1} ({q.type === "eng_to_vi" ? "Anh ➔ Việt" : "Việt ➔ Anh"})
                    </span>

                    {isSubmitted && (
                      <span
                        className={`badge font-extrabold ${
                          isCorrect ? "bg-[#dcfce7] text-[#15803d]" : "bg-[#fee2e2] text-[#b91c1c]"
                        }`}
                      >
                        {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                        {isCorrect ? "Đúng" : `Đáp án đúng: ${q.correctKey.toUpperCase()}`}
                      </span>
                    )}
                  </div>

                  <h4 className="text-lg font-black text-[#1e293b] mb-4">{q.prompt}</h4>

                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {q.options.map((opt) => {
                      const isChosen = selectedKey === opt.key;
                      const isCorrectChoice = opt.key === q.correctKey;

                      let btnStyle = "border-[#e2e8f0] bg-white hover:border-[#cbd5e1]";

                      if (isSubmitted) {
                        if (isCorrectChoice) {
                          btnStyle = "border-[#22c55e] bg-[#dcfce7] text-[#15803d] font-black";
                        } else if (isChosen && !isCorrectChoice) {
                          btnStyle = "border-[#ef4444] bg-[#fee2e2] text-[#b91c1c] font-black";
                        }
                      } else if (isChosen) {
                        btnStyle = "border-[#f59e0b] bg-[#fef3c7] text-[#78350f] font-black shadow-sm";
                      }

                      return (
                        <button
                          type="button"
                          key={opt.key}
                          disabled={isSubmitted}
                          onClick={() => handleOptionSelect(q.id, opt.key)}
                          className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left font-bold transition ${btnStyle}`}
                        >
                          <span
                            className={`grid size-7 shrink-0 place-items-center rounded-full text-xs uppercase font-extrabold ${
                              isChosen
                                ? "bg-[#f59e0b] text-white"
                                : "bg-[#f1f5f9] text-[#64748b]"
                            }`}
                          >
                            {opt.key}
                          </span>
                          <span className="text-base">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Button Bar */}
          {!isSubmitted && (
            <div className="sticky bottom-4 z-20 rounded-2xl bg-white p-4 shadow-2xl border-2 border-[#f59e0b]">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-slate-600">
                  Đã trả lời {Object.keys(userAnswers).length} / {questions.length} câu
                </span>

                <button
                  type="button"
                  onClick={submitPractice}
                  disabled={isSubmitting || Object.keys(userAnswers).length === 0}
                  className="btn btn-primary !bg-[#f59e0b] hover:!bg-[#d97706] px-8 text-base font-black"
                >
                  {isSubmitting ? (
                    <LoaderCircle className="animate-spin" size={20} />
                  ) : (
                    <Send size={20} />
                  )}
                  Nộp Bài Kiểm Tra Vocab
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
