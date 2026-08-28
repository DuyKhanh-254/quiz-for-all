import { spawnSync } from "node:child_process";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

if (process.env.VERCEL_ENV !== "production") {
  process.stdout.write("Skipping Test 5 provisioning outside Vercel production.\n");
  process.exit(0);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) throw new Error("Production Supabase values are unavailable during Test 5 provisioning.");

const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
const { data: existing, error } = await supabase
  .from("quizzes")
  .select("id")
  .eq("id", "15000000-0000-4000-8000-000000000001")
  .maybeSingle();
if (error) throw error;

if (existing) {
  process.stdout.write("Test 5 already exists; provisioning skipped.\n");
  process.exit(0);
}

for (const [script, args] of [
  ["scripts/upload-test-5-media.mjs", []],
  ["scripts/import-quiz.mjs", ["test-5"]],
]) {
  const result = spawnSync(process.execPath, [script, ...args], { stdio: "inherit", env: process.env });
  if (result.status !== 0) throw new Error(`Test 5 provisioning failed in ${script}.`);
}

process.stdout.write("Test 5 provisioning completed.\n");
