import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireUser, safeError } from "@/lib/api";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  const { id } = await context.params;
  const admin = createAdminClient();
  const { data: attempt } = await admin.from("attempts").select("*").eq("id", id).eq("user_id", auth.user.id).maybeSingle();
  if (!attempt) return safeError("Attempt not found or unavailable.", 404);

  const [{ data: quiz }, { data: answers }] = await Promise.all([
    admin.from("quizzes").select("id,slug,title,description,grade,subject,quiz_sections(id,title,instruction,section_type,position,audio_url,image_url,questions(id,position,question_type,prompt,image_url,audio_url,metadata,points,question_options(id,option_key,option_text,image_url,position)))").eq("id", attempt.quiz_id).single(),
    admin.from("attempt_answers").select("question_id,response,is_correct,awarded_points").eq("attempt_id", id).eq("user_id", auth.user.id),
  ]);
  if (!quiz) return safeError("The quiz content is unavailable.", 404);

  quiz.quiz_sections.sort((a, b) => a.position - b.position);
  quiz.quiz_sections.forEach((section) => {
    section.questions.sort((a, b) => a.position - b.position);
    section.questions.forEach((question) => question.question_options.sort((a: { position: number }, b: { position: number }) => a.position - b.position));
  });
  return NextResponse.json({ attempt, quiz, answers: answers ?? [] });
}
