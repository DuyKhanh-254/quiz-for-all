import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before uploading.");

const root = path.resolve(import.meta.dirname, "..");
const files = [
  ["test-2/03-CUP Pre A1 Starters 03 CD 01 Test 01 Part 03.mp3", "english-grade-2-test-2/audio/listening-part-3.mp3", "audio/mpeg"],
  ["test-2/04-CUP Pre A1 Starters 03 CD 01 Test 01 Part 04.mp3", "english-grade-2-test-2/audio/listening-part-4.mp3", "audio/mpeg"],
  ...[
    "listening-part3-q1.jpg", "listening-part3-q2.jpg", "listening-part3-q3.jpg", "listening-part3-q4.jpg", "listening-part3-q5.jpg",
    "listening-part4-scene.jpg", "reading-part3-q1.jpg", "reading-part3-q2.jpg", "reading-part3-q3.jpg", "reading-part3-q4.jpg", "reading-part3-q5.jpg",
  ].map((name) => {
    const destination = name.startsWith("listening-part3-")
      ? `english-grade-2-test-2/images/listening/${name.replace("listening-", "")}`
      : name === "listening-part4-scene.jpg"
        ? "english-grade-2-test-2/images/listening/part4-scene.jpg"
        : `english-grade-2-test-2/images/reading/${name.replace("reading-", "")}`;
    return [`content/test-2-assets/${name}`, destination, "image/jpeg"];
  }),
  ["content/test-2-assets/reading-part5-scene.png", "english-grade-2-test-2/images/reading/part5-scene.png", "image/png"],
];

const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
for (const [source, destination, contentType] of files) {
  const body = await readFile(path.join(root, source));
  const { error } = await supabase.storage.from("quiz-assets").upload(destination, body, { contentType, upsert: true });
  if (error) throw error;
  process.stdout.write(`Uploaded ${destination}\n`);
}
