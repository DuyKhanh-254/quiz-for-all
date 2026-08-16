import { readFile } from "node:fs/promises";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before importing.");

const publicContent = JSON.parse(await readFile(new URL("../content/quiz-content.public.json", import.meta.url), "utf8"));
const privateAnswers = JSON.parse(await readFile(new URL("../content/quiz-content.private.json", import.meta.url), "utf8"));
const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

function assetUrl(relativePath) {
  if (!relativePath) return null;
  const base = `${url}/storage/v1/object/public/${publicContent.assetBase}`;
  return `${base}/${relativePath}`;
}

const { error: quizError } = await supabase.from("quizzes").upsert(publicContent.quiz, { onConflict: "id" });
if (quizError) throw quizError;

for (const section of publicContent.sections) {
  const { questions, audio, image, ...sectionRow } = section;
  const { error: sectionError } = await supabase.from("quiz_sections").upsert({ ...sectionRow, quiz_id: publicContent.quiz.id, audio_url: assetUrl(audio), image_url: assetUrl(image) }, { onConflict: "id" });
  if (sectionError) throw sectionError;
  for (const question of questions) {
    const { options, image: questionImage, audio: questionAudio, ...questionRow } = question;
    const { error: questionError } = await supabase.from("questions").upsert({ ...questionRow, quiz_id: publicContent.quiz.id, section_id: section.id, image_url: assetUrl(questionImage), audio_url: assetUrl(questionAudio), metadata: question.metadata ?? {} }, { onConflict: "id" });
    if (questionError) throw questionError;
    await supabase.from("question_options").delete().eq("question_id", question.id);
    if (options.length) {
      const optionRows = options.map(([key, text, imagePath], index) => ({ question_id: question.id, option_key: key, option_text: text, image_url: assetUrl(imagePath), position: index + 1 }));
      const { error: optionsError } = await supabase.from("question_options").insert(optionRows);
      if (optionsError) throw optionsError;
    }
    const answer = privateAnswers[question.id];
    if (!answer) throw new Error(`Private answer missing for ${question.id}`);
    const { error: keyError } = await supabase.from("answer_keys").upsert({ question_id: question.id, answer }, { onConflict: "question_id" });
    if (keyError) throw keyError;
  }
}

process.stdout.write(`Imported ${publicContent.quiz.title} with ${publicContent.sections.length} sections.\n`);
