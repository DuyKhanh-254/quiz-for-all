import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const roots = ["src/components", "src/app"];
const forbidden = [/correctAnswer/i, /correct_answer/i, /expectedAnswer/i, /quiz-content\.private/i, /SUPABASE_SERVICE_ROLE_KEY/];
const allowedServerFiles = new Set([
  path.normalize("src/app/api/attempts/[id]/submit/route.ts"),
  path.normalize("src/app/api/admin/register/route.ts"),
  path.normalize("src/app/admin/(dashboard)/attempts/[id]/page.tsx"),
  path.normalize("src/app/admin/(dashboard)/quiz/page.tsx")
]);

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await files(target));
    else if (/\.(ts|tsx|js|jsx|json)$/.test(entry.name)) result.push(target);
  }
  return result;
}

const violations = [];
for (const root of roots) {
  for (const file of await files(root)) {
    const normalized = path.normalize(file);
    if (allowedServerFiles.has(normalized)) continue;
    const source = await readFile(file, "utf8");
    for (const pattern of forbidden) if (pattern.test(source)) violations.push(`${file}: ${pattern}`);
  }
}
if (violations.length) {
  process.stderr.write(`Potential student-bundle answer leak:\n${violations.join("\n")}\n`);
  process.exit(1);
}
process.stdout.write("Answer-security audit passed: no private key payload or server secret appears in student-facing source.\n");
