import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://syghsisooccdvpvshgvm.supabase.co";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Z2hzaXNvb2NjZHZwdnNoZ3ZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njg3ODM5NSwiZXhwIjoyMTAyNDU0Mzk1fQ.kVg4wYbtpw2T5jqRbNL3g-zDDqeNZsa1WAs1gyFAzfw";

const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

async function uploadFile(localPath, remotePath, contentType) {
  console.log(`Uploading ${localPath} -> ${remotePath}...`);
  const buf = await readFile(localPath);
  const { error } = await supabase.storage
    .from("quiz-assets")
    .upload(remotePath, buf, { contentType, upsert: true });

  if (error) throw error;
  console.log(`Uploaded ${remotePath} (${buf.length} bytes)`);
}

async function main() {
  const root = path.resolve(import.meta.dirname, "..");
  const assetsDir = path.join(root, "content/test-11-assets");

  // 1. Upload audio
  const audioPath = path.join(assetsDir, "audio/test11-lis-part2.mp3");
  await uploadFile(audioPath, "english-grade-2-test-11/audio/test11-lis-part2.mp3", "audio/mpeg");

  // 2. Upload cropped scene image
  const scenePath = path.join(assetsDir, "images/test11-scene.jpg");
  await uploadFile(scenePath, "english-grade-2-test-11/images/test11-scene.jpg", "image/jpeg");

  console.log("All Test 11 media uploaded successfully!");
}

main().catch(console.error);
