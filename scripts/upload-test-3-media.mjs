import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before uploading.");

const root = path.resolve(import.meta.dirname, "..");
const files = [
  // Audio files
  ["content/test-3-assets/audio/test2-lis-part2.mp3", "english-grade-2-test-3/audio/test2-lis-part2.mp3", "audio/mpeg"],
  ["content/test-3-assets/audio/test3-lis-part2.mp3", "english-grade-2-test-3/audio/test3-lis-part2.mp3", "audio/mpeg"],
  ["content/test-3-assets/audio/test3-lis-part3.mp3", "english-grade-2-test-3/audio/test3-lis-part3.mp3", "audio/mpeg"],
  // Scene images (full pages used as scene images)
  ["content/test-3-assets/page-20.jpg", "english-grade-2-test-3/images/listening/test2-part2-scene.jpg", "image/jpeg"],
  ["content/test-3-assets/page-34.jpg", "english-grade-2-test-3/images/listening/test3-part2-scene.jpg", "image/jpeg"],
  // Test 3 Part 3 question images (cropped from pages 36 and 37)
  ["content/test-3-assets/test3-part3-q1.jpg", "english-grade-2-test-3/images/listening/test3-part3-q1.jpg", "image/jpeg"],
  ["content/test-3-assets/test3-part3-q2.jpg", "english-grade-2-test-3/images/listening/test3-part3-q2.jpg", "image/jpeg"],
  ["content/test-3-assets/test3-part3-q3.jpg", "english-grade-2-test-3/images/listening/test3-part3-q3.jpg", "image/jpeg"],
  ["content/test-3-assets/test3-part3-q4.jpg", "english-grade-2-test-3/images/listening/test3-part3-q4.jpg", "image/jpeg"],
  ["content/test-3-assets/test3-part3-q5.jpg", "english-grade-2-test-3/images/listening/test3-part3-q5.jpg", "image/jpeg"],
];

const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
for (const [source, destination, contentType] of files) {
  const body = await readFile(path.join(root, source));
  const { error } = await supabase.storage.from("quiz-assets").upload(destination, body, { contentType, upsert: true });
  if (error) throw error;
  process.stdout.write(`Uploaded ${destination}\n`);
}
