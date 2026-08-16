import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Missing Supabase server environment.");

const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const bucket = "quiz-assets";

const media = [
  ["audio-end-of-term-test-1-semester-2-mp3cutnet.mp3", "english-grade-2-test-1/audio/section-1.mp3", "audio/mpeg"],
  ["audio-end-of-term-test-1-semester-2-mp3cutnet-1.mp3", "english-grade-2-test-1/audio/section-2.mp3", "audio/mpeg"],
  ["content/generated-images/part2-question-1.png", "english-grade-2-test-1/images/part2/question-1.png", "image/png"],
  ["content/generated-images/part2-question-2.png", "english-grade-2-test-1/images/part2/question-2.png", "image/png"],
  ["content/generated-images/part2-question-3.png", "english-grade-2-test-1/images/part2/question-3.png", "image/png"],
  ["content/generated-images/part2-question-4.png", "english-grade-2-test-1/images/part2/question-4.png", "image/png"],
  ["content/generated-images/part3-matching.png", "english-grade-2-test-1/images/part3/matching.png", "image/png"],
  ["content/generated-images/part4-fill-objects.png", "english-grade-2-test-1/images/part4/fill-objects.png", "image/png"],
];

for (const [source, objectPath, contentType] of media) {
  const bytes = await readFile(new URL(`../${source}`, import.meta.url));
  const { error } = await supabase.storage.from(bucket).upload(objectPath, bytes, {
    contentType,
    cacheControl: "3600",
    upsert: true,
  });
  if (error) throw error;
  process.stdout.write(`Uploaded ${objectPath}\n`);
}
