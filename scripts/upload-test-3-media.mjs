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
  // Scene images
  ["content/test-3-assets/page-20.jpg", "english-grade-2-test-3/images/listening/test2-part2-scene.jpg", "image/jpeg"],
  ["content/test-3-assets/page-34.jpg", "english-grade-2-test-3/images/listening/test3-part2-scene.jpg", "image/jpeg"],
];

// Add 15 individual option images (q1-a to q5-c)
for (let q = 1; q <= 5; q++) {
  for (const opt of ["a", "b", "c"]) {
    const filename = `q${q}-${opt}.jpg`;
    files.push([
      `content/test-3-assets/${filename}`,
      `english-grade-2-test-3/images/listening/${filename}`,
      "image/jpeg"
    ]);
  }
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
for (const [source, destination, contentType] of files) {
  const body = await readFile(path.join(root, source));
  const { error } = await supabase.storage.from("quiz-assets").upload(destination, body, { contentType, upsert: true });
  if (error) throw error;
  process.stdout.write(`Uploaded ${destination}\n`);
}
