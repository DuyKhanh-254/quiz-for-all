"use client";

import { useEffect, useState } from "react";
import { BookOpen, Check, Clock3, History, Layers3, LoaderCircle, LockKeyhole, Sparkles, User, GraduationCap, Edit3, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/format";
import type { AttemptSummary } from "@/lib/types";
import { VocabFlashcards } from "@/components/vocab-flashcards";

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
  
  // Student Gate State & Active Tab State
  const [isInfoSubmitted, setIsInfoSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<"tests" | "vocab">("tests");

  useEffect(() => {
    // Restore student info from localStorage if available
    try {
      const savedInfo = localStorage.getItem("quiz_student_info");
      if (savedInfo) {
        const { name, cls } = JSON.parse(savedInfo);
        if (name && cls) {
          setFullName(name);
          setClassName(cls);
          setIsInfoSubmitted(true);
        }
      }
    } catch {
      /* storage check */
    }
  }, []);

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
        
        if (profile && profile.full_name && profile.class_name && !fullName) {
          setFullName(profile.full_name);
          setClassName(profile.class_name);
          setIsInfoSubmitted(true);
        }
        
        const available = (publishedQuizzes ?? []).filter((q: QuizCard) => q.slug !== "test-1-vocab-flashcards") as QuizCard[];
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
  }, [configured, fullName]);

  const handleSaveStudentInfo = (event: React.FormEvent) => {
    event.preventDefault();
    if (!fullName.trim() || !className.trim()) return;
    try {
      localStorage.setItem("quiz_student_info", JSON.stringify({ name: fullName.trim(), cls: className.trim() }));
    } catch {
      /* storage fallback */
    }
    setIsInfoSubmitted(true);
  };

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

  /* STEP 1: REQUIRE STUDENT INFO FIRST BEFORE SHOWING DASHBOARD */
  if (!isInfoSubmitted) {
    return (
      <div className="py-12 md:py-20 max-w-xl mx-auto">
        <section className="card p-8 shadow-2xl border-4 border-[#f6d77d] bg-[#fffdf7] text-center space-y-6">
          <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-[#fef3c7] text-[#b45309] shadow-inner">
            <GraduationCap size={44} />
          </div>

          <div>
            <span className="badge bg-[#fef0c7] text-[#926011] text-xs font-black mb-2">
              🦁 CHÀO MỪNG ĐẾN VỚI LỚP HỌC TIẾNG ANH
            </span>
            <h1 className="mt-2 text-3xl font-black text-[#78350f]">Nhập Thông Tin Học Sinh</h1>
            <p className="muted mt-2 text-sm">
              Em hãy điền Họ và tên cùng với Lớp để vào Giao diện học tập nhé!
            </p>
          </div>

          <form onSubmit={handleSaveStudentInfo} className="space-y-4 text-left">
            <div>
              <label className="label text-[#78350f] font-black" htmlFor="student-full-name">
                Họ và tên học sinh
              </label>
              <input
                className="field !min-h-14 !border-2 !border-[#f6d77d] focus:!border-[#f59e0b] !text-lg !font-bold"
                id="student-full-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                maxLength={100}
                required
                placeholder="Ví dụ: Nguyễn Văn A"
              />
            </div>

            <div>
              <label className="label text-[#78350f] font-black" htmlFor="student-class-name">
                Lớp học
              </label>
              <input
                className="field !min-h-14 !border-2 !border-[#f6d77d] focus:!border-[#f59e0b] !text-lg !font-bold"
                id="student-class-name"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                maxLength={40}
                required
                placeholder="Ví dụ: 2A1"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full !min-h-14 !bg-[#f59e0b] hover:!bg-[#d97706] text-lg font-black shadow-lg shadow-[#f59e0b]/20"
            >
              Vào Học Ngay <ArrowRight size={22} />
            </button>
          </form>
        </section>
      </div>
    );
  }

  /* STEP 2: LEARNING DASHBOARD (WITH 2 PARTS: PRACTICE TESTS & VOCAB FLASHCARDS) */
  return (
    <>
      {/* Student Badge & Info Banner */}
      <section className="pt-6 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-3 border-[#f6d77d] bg-[#fffdf5] p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-[#fef3c7] text-[#b45309] font-black">
              <User size={24} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-[#926011] tracking-wider">Học sinh</span>
                <span className="badge bg-[#fef0c7] text-[#785412] text-[10px]">Lớp {className}</span>
              </div>
              <h2 className="text-xl font-black text-[#78350f]">{fullName}</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsInfoSubmitted(false)}
            className="btn btn-secondary !min-h-10 !px-4 text-xs font-extrabold text-[#785412] border-[#f6d77d] hover:bg-[#fef3c7]"
          >
            <Edit3 size={15} /> Đổi học sinh
          </button>
        </div>
      </section>

      {/* Main Learning Hub Header & 2 Parts Tab Switcher */}
      <section className="py-6">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="badge bg-[#fef0c7] text-[#75530c] font-black">
            <Sparkles size={15} /> Giao Diện Học Tập Tiếng Anh
          </span>
          <h1 className="text-3xl font-black tracking-tight text-[#78350f] sm:text-5xl">
            Chọn Bài Học & Luyện Tập
          </h1>
          <p className="muted text-base font-bold text-[#64748b]">
            Em có thể chọn làm Bài Test Luyện Tập hoặc Học Từ Vựng Thẻ Nhớ ở bên dưới!
          </p>
        </div>

        {/* 2 MAIN PARTS TAB SWITCHER */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-2xl border-3 border-[#f6d77d] bg-[#fffcf2] p-1.5 shadow-md">
            <button
              type="button"
              onClick={() => setActiveTab("tests")}
              className={`flex items-center gap-2 rounded-xl px-6 py-3 text-base font-black transition ${
                activeTab === "tests"
                  ? "bg-[#f59e0b] text-white shadow-md"
                  : "text-[#785412] hover:bg-[#fef3c7]"
              }`}
            >
              <Layers3 size={20} /> 📑 Phần 1: Bài Test Luyện Tập
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("vocab")}
              className={`flex items-center gap-2 rounded-xl px-6 py-3 text-base font-black transition ${
                activeTab === "vocab"
                  ? "bg-[#f59e0b] text-white shadow-md"
                  : "text-[#785412] hover:bg-[#fef3c7]"
              }`}
            >
              <BookOpen size={20} /> 🎴 Phần 2: Học Từ Vựng Flashcard
            </button>
          </div>
        </div>
      </section>

      {/* TAB 1: PRACTICE TESTS */}
      {activeTab === "tests" && (
        <div className="space-y-10 pb-14">
          <section aria-labelledby="test-board-heading">
            <div className="mb-4">
              <p className="text-xs font-black uppercase tracking-wider text-[#926011]">Test board</p>
              <h2 id="test-board-heading" className="mt-1 text-2xl font-black text-[#78350f]">
                Danh sách Bài Test
              </h2>
            </div>

            {!ready ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="skeleton h-48" />
                <div className="skeleton h-48" />
              </div>
            ) : quizzes.length === 0 ? (
              <div className="error-box">Chưa có bài test nào được xuất bản.</div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {quizzes.map((quiz, index) => {
                  const selected = quiz.slug === selectedSlug;
                  const count = quiz.quiz_sections.reduce(
                    (total, section) => total + section.questions.length,
                    0
                  );
                  return (
                    <button
                      type="button"
                      key={quiz.id}
                      onClick={() => setSelectedSlug(quiz.slug)}
                      aria-pressed={selected}
                      className={`card relative p-6 text-left transition hover:-translate-y-0.5 ${
                        selected
                          ? "border-[#f59e0b] ring-4 ring-[#f59e0b]/20 bg-[#fffdf5]"
                          : "hover:border-[#f6d77d]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="grid size-12 place-items-center rounded-2xl bg-[#fef3c7] font-black text-[#b45309]">
                          {index + 1}
                        </span>
                        {selected && (
                          <span className="badge bg-[#dff4eb] text-[#246c53] font-bold">
                            <Check size={15} /> Đã chọn
                          </span>
                        )}
                      </div>
                      <h3 className="mt-5 text-xl font-black text-[#78350f]">Test {index + 1}</h3>
                      <p className="mt-1 font-bold text-[#35516e]">{quiz.title}</p>
                      <p className="muted mt-2 line-clamp-2 text-sm">{quiz.description}</p>
                      <p className="mt-4 text-xs font-extrabold uppercase tracking-wide text-[#61738a]">
                        {quiz.quiz_sections.length} phần · {count} câu hỏi
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section className="grid gap-8 lg:grid-cols-[1fr_.8fr]">
            <form onSubmit={start} className="card p-6 sm:p-8 border-2 border-[#f6d77d]">
              <h2 className="text-2xl font-black text-[#78350f]">Bắt đầu làm Bài Test</h2>
              <p className="muted mt-1 text-sm font-bold">
                Bài test đã chọn: <strong className="text-[#b45309]">{quizzes.find((q) => q.slug === selectedSlug)?.title || "Chưa chọn"}</strong>
              </p>

              <div className="mt-4 p-4 rounded-2xl bg-[#fffdf5] border border-[#fef0c7] space-y-1">
                <p className="text-sm font-extrabold text-[#78350f]">Học sinh: {fullName}</p>
                <p className="text-xs font-bold text-[#926011]">Lớp: {className}</p>
              </div>

              {error && <p className="error-box mt-4" role="alert">{error}</p>}

              <button
                className="btn btn-primary mt-6 w-full !bg-[#f59e0b] hover:!bg-[#d97706] text-lg font-black"
                disabled={!ready || loading || !selectedSlug}
              >
                {loading || !ready ? <LoaderCircle className="animate-spin" size={19} /> : <BookOpen size={19} />}
                {ready ? (loading ? "Đang tải bài test…" : "Vào làm bài test ngay") : "Đang chuẩn bị…"}
              </button>
            </form>

            <div aria-labelledby="history-heading">
              <div className="mb-4 flex items-center gap-2">
                <History size={22} className="text-[#78350f]" />
                <h2 id="history-heading" className="text-xl font-black text-[#78350f]">
                  Lịch sử kết quả làm bài
                </h2>
              </div>
              {!ready ? (
                <div className="skeleton h-24" />
              ) : attempts.length === 0 ? (
                <div className="card p-6 border-2 border-[#fef0c7]">
                  <p className="font-bold text-[#78350f]">Chưa có bài làm nào.</p>
                  <p className="muted mt-1 text-sm">Kết quả làm bài sẽ xuất hiện ở đây sau khi em làm xong.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {attempts.map((attempt) => (
                    <button
                      key={attempt.id}
                      onClick={() => router.push(`/attempts/${attempt.id}`)}
                      className="card flex w-full items-center justify-between p-5 text-left transition hover:-translate-y-0.5 hover:border-[#f59e0b]"
                    >
                      <div>
                        <p className="font-extrabold text-[#1e293b]">{quizTitle(attempt) ?? "Bài test Tiếng Anh"}</p>
                        <p className="muted mt-1 text-sm">
                          {attempt.student_name} · {formatDate(attempt.submitted_at)}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-[#fef3c7] px-4 py-3 text-center">
                        <strong className="block text-xl text-[#b45309]">{attempt.percentage}%</strong>
                        <span className="text-xs font-bold text-[#785412]">
                          {attempt.score}/{attempt.max_score}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: VOCABULARY FLASHCARDS */}
      {activeTab === "vocab" && (
        <div className="pb-14">
          <VocabFlashcards fullName={fullName} className={className} />
        </div>
      )}
    </>
  );
}
