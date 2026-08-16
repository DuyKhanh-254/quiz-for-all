import { NextResponse } from "next/server";
import { requireUser, safeError } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase/admin";
import { calculateResult, gradeResponse } from "@/lib/grading";
import { submitSchema } from "@/lib/validation";
import type { AnswerKey, JsonResponse, QuestionType } from "@/lib/types";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  const parsed = submitSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return safeError("Some answers have an invalid format.", 400);
  const { id } = await context.params;
  const admin = createAdminClient();

  const { data: attempt } = await admin.from("attempts").select("id,quiz_id,user_id,status,started_at").eq("id", id).eq("user_id", auth.user.id).maybeSingle();
  if (!attempt) return safeError("Attempt not found.", 404);
  if (attempt.status !== "in_progress") return safeError("This test has already been submitted.", 409);

  const { data: questions, error: questionError } = await admin.from("questions").select("id,question_type,points,answer_keys(question_id,answer)").eq("quiz_id", attempt.quiz_id);
  if (questionError || !questions?.length) return safeError("The answer key is not ready. Please ask your teacher.");

  const { data: saved } = await admin.from("attempt_answers").select("question_id,response").eq("attempt_id", id).eq("user_id", auth.user.id);
  const responses = new Map<string, JsonResponse>((saved ?? []).map((item) => [item.question_id, item.response as JsonResponse]));
  Object.entries(parsed.data.answers).forEach(([questionId, response]) => responses.set(questionId, response));

  const graded = questions.map((question) => {
    const relation = question.answer_keys as unknown as AnswerKey | AnswerKey[] | null;
    const key = Array.isArray(relation) ? relation[0] : relation;
    if (!key) throw new Error(`Missing answer key for ${question.id}`);
    const response = responses.get(question.id) ?? null;
    const correct = gradeResponse(question.question_type as QuestionType, response, key.answer);
    return { question, response, correct, points: Number(question.points) };
  });
  const result = calculateResult(graded.map(({ correct, points }) => ({ correct, points })));
  const submittedAt = new Date();
  const durationSeconds = Math.max(0, Math.round((submittedAt.getTime() - new Date(attempt.started_at).getTime()) / 1000));

  const rows = graded.filter((item) => item.response).map((item) => ({
    attempt_id: id,
    question_id: item.question.id,
    user_id: auth.user.id,
    response: item.response,
    is_correct: item.correct,
    awarded_points: item.correct ? item.points : 0,
    updated_at: submittedAt.toISOString(),
  }));
  if (rows.length) {
    const { error } = await admin.from("attempt_answers").upsert(rows, { onConflict: "attempt_id,question_id" });
    if (error) return safeError("We could not finish grading. Your test is still safely open.");
  }

  const { data: updated, error: updateError } = await admin.from("attempts").update({
    status: "submitted",
    score: result.score,
    max_score: result.maxScore,
    percentage: result.percentage,
    correct_count: result.correctCount,
    total_questions: result.totalQuestions,
    submitted_at: submittedAt.toISOString(),
    duration_seconds: durationSeconds,
  }).eq("id", id).eq("user_id", auth.user.id).eq("status", "in_progress").select("id").maybeSingle();
  if (updateError || !updated) return safeError("This test was already submitted in another window.", 409);

  return NextResponse.json({ ...result, submittedAt: submittedAt.toISOString(), durationSeconds });
}
