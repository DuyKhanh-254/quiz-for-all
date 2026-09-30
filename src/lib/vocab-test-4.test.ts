import { describe, it, expect } from "vitest";
import { TEST4_VOCABULARY, generateTest4Questions } from "@/components/vocab-flashcards";

describe("Vocab Test 4", () => {
  it("has exactly 7 vocabulary items as requested", () => {
    expect(TEST4_VOCABULARY).toHaveLength(7);
    const words = TEST4_VOCABULARY.map((v) => v.word.toLowerCase());
    expect(words).toContain("tablet");
    expect(words).toContain("wardrobe");
    expect(words).toContain("rug");
    expect(words).toContain("board games");
    expect(words).toContain("wheelchair");
    expect(words).toContain("hold");
    expect(words).toContain("reach for");
  });

  it("has correct Vietnamese meanings according to user prompt", () => {
    const vocabMap = new Map(TEST4_VOCABULARY.map((v) => [v.word.toLowerCase(), v.meaning]));
    expect(vocabMap.get("tablet")).toContain("máy tính bảng");
    expect(vocabMap.get("wardrobe")).toContain("tủ quần áo");
    expect(vocabMap.get("rug")).toContain("thảm trải sàn");
    expect(vocabMap.get("board games")).toContain("những trò chơi có tính tương tác cao");
    expect(vocabMap.get("wheelchair")).toContain("xe lăn");
    expect(vocabMap.get("hold")).toContain("giữ");
    expect(vocabMap.get("reach for")).toContain("vươn tay để lấy");
  });

  it("generates 14 practice questions with English prompt and Vietnamese choices", () => {
    const questions = generateTest4Questions();
    expect(questions).toHaveLength(14);

    // Part 1: Direct translation (7 questions)
    const part1 = questions.slice(0, 7);
    for (const q of part1) {
      expect(q.options).toHaveLength(4);
      expect(["a", "b", "c", "d"]).toContain(q.correctKey);
      const correctOption = q.options.find((opt) => opt.key === q.correctKey);
      expect(correctOption).toBeDefined();
      expect(correctOption?.text).toBe(q.targetMeaning);
      expect(q.prompt).toMatch(/Nghĩa tiếng Việt của/i);
    }

    // Part 2: Contextual sentences (7 questions)
    const part2 = questions.slice(7, 14);
    for (const q of part2) {
      expect(q.options).toHaveLength(4);
      expect(["a", "b", "c", "d"]).toContain(q.correctKey);
      const correctOption = q.options.find((opt) => opt.key === q.correctKey);
      expect(correctOption).toBeDefined();
      expect(correctOption?.text).toBe(q.targetMeaning);
      expect(q.explanation).toBeTruthy();
    }
  });
});
