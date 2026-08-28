import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before uploading.");

const root = path.resolve(import.meta.dirname, "..");
const names = ["family-1.png", "family-2.png", "family-3.png", "school-1.png", "school-2.png", "school-3.png"];
const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

for (const name of names) {
  const body = await readFile(path.join(root, "content", "test-5-assets", name));
  const destination = `english-grade-2-test-5/images/${name}`;
  const { error } = await supabase.storage.from("quiz-assets").upload(destination, body, { contentType: "image/png", upsert: true });
  if (error) throw error;
  process.stdout.write(`Uploaded ${destination}\n`);
}
