import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://syghsisooccdvpvshgvm.supabase.co";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Z2hzaXNvb2NjZHZwdnNoZ3ZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njg3ODM5NSwiZXhwIjoyMTAyNDU0Mzk1fQ.kVg4wYbtpw2T5jqRbNL3g-zDDqeNZsa1WAs1gyFAzfw";

const root = path.resolve(import.meta.dirname, "..");
const files = [
  // Audio files
  ["content/test-7-assets/audio/test-7-part-2.mp3", "english-grade-2-test-7/audio/test7-lis-part2.mp3", "audio/mpeg"],
  ["content/test-7-assets/audio/test-7-part-3.mp3", "english-grade-2-test-7/audio/test7-lis-part3.mp3", "audio/mpeg"],
  // Scene image
  ["content/test-7-assets/images/part-2-scene.jpg", "english-grade-2-test-7/images/listening/test7-part2-scene.jpg", "image/jpeg"],
];

// Add 15 option images (q1-a to q5-c)
for (let q = 1; q <= 5; q++) {
  for (const opt of ["a", "b", "c"]) {
    const filename = `q${q}-${opt}.jpg`;
    files.push([
      `content/test-7-assets/images/${filename}`,
      `english-grade-2-test-7/images/listening/${filename}`,
      "image/jpeg"
    ]);
  }
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
console.log(`Uploading ${files.length} media assets to Supabase Storage...`);

for (const [source, destination, contentType] of files) {
  const body = await readFile(path.join(root, source));
  const { error } = await supabase.storage.from("quiz-assets").upload(destination, body, { contentType, upsert: true });
  if (error) throw error;
  console.log(`Uploaded ${destination} (${body.length} bytes)`);
}

console.log("All Test 7 media uploaded successfully!");
