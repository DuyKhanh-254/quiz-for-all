import { describe, expect, it } from "vitest";
import { calculateResult, gradeResponse } from "./grading";

describe("secure grading helpers", () => {
  it("grades choices exactly", () => {
    expect(gradeResponse("single_choice", { option: "b" }, { option: "b" })).toBe(true);
    expect(gradeResponse("image_choice", { option: "a" }, { option: "c" })).toBe(false);
  });

  it("normalizes fill blanks without weakening the accepted list", () => {
    expect(gradeResponse("fill_blank", { value: "  Blue   Kite " }, { accepted: ["blue kite"] })).toBe(true);
    expect(gradeResponse("fill_blank", { value: "kite" }, { accepted: ["blue kite"] })).toBe(false);
  });

  it("requires every matching pair", () => {
    const key = { pairs: { one: "a", two: "b" } };
    expect(gradeResponse("matching", { pairs: { one: "a", two: "b" } }, key)).toBe(true);
    expect(gradeResponse("matching", { pairs: { one: "a" } }, key)).toBe(false);
  });

  it("calculates weighted results", () => {
    expect(calculateResult([{ correct: true, points: 2 }, { correct: false, points: 1 }])).toEqual({
      score: 2,
      maxScore: 3,
      correctCount: 1,
      totalQuestions: 2,
      percentage: 66.7,
    });
  });
});
