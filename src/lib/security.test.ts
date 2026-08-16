import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const migration = readFileSync(path.join(process.cwd(), "supabase/migrations/202608160001_initial_quiz.sql"), "utf8").toLowerCase();

describe("database security migration", () => {
  it("enables RLS on every exposed application table", () => {
    for (const table of ["profiles", "quizzes", "quiz_sections", "questions", "question_options", "answer_keys", "attempts", "attempt_answers"]) {
      expect(migration).toContain(`alter table public.${table} enable row level security`);
    }
  });

  it("keeps answer keys admin-only", () => {
    expect(migration).toContain("revoke all on public.answer_keys from anon, authenticated");
    expect(migration).toContain('create policy "answer_keys_admin_only"');
    expect(migration).not.toContain("answer_keys_student");
  });

  it("scopes attempts and answers to the current identity", () => {
    expect(migration).toContain("user_id = auth.uid() or public.is_admin()");
    expect(migration).toContain("a.user_id = auth.uid() and a.status = 'in_progress'");
  });

  it("does not grant students grading or role columns", () => {
    expect(migration).toContain("grant update (full_name, class_name, updated_at) on public.profiles");
    expect(migration).toContain("grant update (response, updated_at) on public.attempt_answers");
    expect(migration).not.toContain("grant update (role)");
    expect(migration).not.toContain("grant update (is_correct");
    expect(migration).not.toContain("grant update (score");
  });
});
