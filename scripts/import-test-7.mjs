import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://syghsisooccdvpvshgvm.supabase.co";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Z2hzaXNvb2NjZHZwdnNoZ3ZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njg3ODM5NSwiZXhwIjoyMTAyNDU0Mzk1fQ.kVg4wYbtpw2T5jqRbNL3g-zDDqeNZsa1WAs1gyFAzfw";

const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

const root = path.resolve(import.meta.dirname, "..");
const publicContent = JSON.parse(await readFile(path.join(root, "content/test-7.public.json"), "utf8"));
const privateAnswers = JSON.parse(await readFile(path.join(root, "content/test-7.private.json"), "utf8"));

const cleanAssetBase = publicContent.assetBase.startsWith("quiz-assets/")
  ? publicContent.assetBase
  : `quiz-assets/${publicContent.assetBase}`;
const storageBase = `${url}/storage/v1/object/public/${cleanAssetBase}`;

console.log(`Importing Quiz: ${publicContent.quiz.title}...`);

// 1. Upsert Quiz
const { error: quizError } = await supabase.from("quizzes").upsert(publicContent.quiz, { onConflict: "id" });
if (quizError) throw quizError;
console.log("Quiz upserted.");

// 2. Prepare Sections, Questions, Options, Answer Keys
const sectionRows = [];
const questionRows = [];
const allOptionRows = [];
const allKeyRows = [];
const questionIds = [];

for (const section of publicContent.sections) {
  sectionRows.push({
    id: section.id,
    quiz_id: publicContent.quiz.id,
    title: section.title,
    instruction: section.instruction,
    section_type: section.section_type,
    position: section.position,
    audio_url: section.audio ? `${storageBase}/${section.audio}` : null,
    image_url: section.image ? `${storageBase}/${section.image}` : null,
  });

  for (const q of section.questions) {
    questionIds.push(q.id);
    questionRows.push({
      id: q.id,
      quiz_id: publicContent.quiz.id,
      section_id: section.id,
      position: q.position,
      question_type: q.question_type,
      prompt: q.prompt,
      points: q.points,
      metadata: q.metadata || {},
    });

    if (q.options && q.options.length > 0) {
      q.options.forEach((opt, idx) => {
        allOptionRows.push({
          question_id: q.id,
          option_key: opt[0],
          option_text: opt[1],
          image_url: opt[2] ? `${storageBase}/${opt[2]}` : null,
          position: idx + 1,
        });
      });
    }

    const ans = privateAnswers[q.id];
    if (ans) {
      allKeyRows.push({
        question_id: q.id,
        answer: ans,
      });
    }
  }
}

// Batch Upsert Sections
const { error: secError } = await supabase.from("quiz_sections").upsert(sectionRows, { onConflict: "id" });
if (secError) throw secError;
console.log(`Upserted ${sectionRows.length} sections.`);

// Batch Upsert Questions
const { error: qError } = await supabase.from("questions").upsert(questionRows, { onConflict: "id" });
if (qError) throw qError;
console.log(`Upserted ${questionRows.length} questions.`);

// Delete and re-insert options for these questions
for (const qId of questionIds) {
  await supabase.from("question_options").delete().eq("question_id", qId);
}
if (allOptionRows.length > 0) {
  const { error: optError } = await supabase.from("question_options").insert(allOptionRows);
  if (optError) throw optError;
  console.log(`Inserted ${allOptionRows.length} question options.`);
}

// Batch Upsert Answer Keys
if (allKeyRows.length > 0) {
  const { error: keyError } = await supabase.from("answer_keys").upsert(allKeyRows, { onConflict: "question_id" });
  if (keyError) throw keyError;
  console.log(`Upserted ${allKeyRows.length} answer keys.`);
}

console.log("SUCCESS: Test 7 fully imported into Supabase!");
