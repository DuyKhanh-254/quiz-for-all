import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://syghsisooccdvpvshgvm.supabase.co";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Z2hzaXNvb2NjZHZwdnNoZ3ZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njg3ODM5NSwiZXhwIjoyMTAyNDU0Mzk1fQ.kVg4wYbtpw2T5jqRbNL3g-zDDqeNZsa1WAs1gyFAzfw";

const root = path.resolve(import.meta.dirname, "..");
const files = [
  // Audio files
  ["content/test-6-assets/audio/test6-lis-part2.mp3", "english-grade-2-test-6/audio/test6-lis-part2.mp3", "audio/mpeg"],
  ["content/test-6-assets/audio/test6-lis-part3.mp3", "english-grade-2-test-6/audio/test6-lis-part3.mp3", "audio/mpeg"],
  ["content/test-6-assets/audio/test6-lis-part4.mp3", "english-grade-2-test-6/audio/test6-lis-part4.mp3", "audio/mpeg"],
  // Scene images
  ["content/test-6-assets/images/test6-part1-scene.jpg", "english-grade-2-test-6/images/test6-part1-scene.jpg", "image/jpeg"],
  ["content/test-6-assets/images/test6-part3-scene.jpg", "english-grade-2-test-6/images/test6-part3-scene.jpg", "image/jpeg"],
];

// Add all image files from content/test-6-assets/images
const imgDir = path.join(root, "content/test-6-assets/images");
const imgFiles = await readdir(imgDir);
for (const file of imgFiles) {
  if (file.endsWith(".jpg") || file.endsWith(".png")) {
    if (!file.includes("scene")) {
      files.push([
        `content/test-6-assets/images/${file}`,
        `english-grade-2-test-6/images/${file}`,
        "image/jpeg"
      ]);
    }
  }
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
for (const [source, destination, contentType] of files) {
  const body = await readFile(path.join(root, source));
  const { error } = await supabase.storage.from("quiz-assets").upload(destination, body, { contentType, upsert: true });
  if (error) throw error;
  process.stdout.write(`Uploaded ${destination}\n`);
}
