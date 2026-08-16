import type { AnswerKey, JsonResponse, QuestionType } from "@/lib/types";

function normalize(value: string, caseSensitive = false) {
  const compact = value.trim().replace(/\s+/g, " ");
  return caseSensitive ? compact : compact.toLocaleLowerCase("en");
}

export function gradeResponse(type: QuestionType, response: JsonResponse | null, key: AnswerKey["answer"]) {
  if (!response) return false;
  if (type === "single_choice" || type === "image_choice") {
    return "option" in response && response.option === key.option;
  }
  if (type === "fill_blank") {
    if (!("value" in response) || !key.accepted?.length) return false;
    const received = normalize(response.value, key.case_sensitive);
    return key.accepted.some((item) => normalize(item, key.case_sensitive) === received);
  }
  if (type === "matching") {
    if (!("pairs" in response) || !key.pairs) return false;
    const expected = Object.entries(key.pairs);
    return expected.length > 0 && expected.every(([left, right]) => response.pairs[left] === right);
  }
  return false;
}

export function calculateResult(items: Array<{ correct: boolean; points: number }>) {
  const score = items.reduce((sum, item) => sum + (item.correct ? item.points : 0), 0);
  const maxScore = items.reduce((sum, item) => sum + item.points, 0);
  const correctCount = items.filter((item) => item.correct).length;
  return {
    score,
    maxScore,
    correctCount,
    totalQuestions: items.length,
    percentage: maxScore ? Math.round((score / maxScore) * 1000) / 10 : 0,
  };
}
