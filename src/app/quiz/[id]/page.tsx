import type { Metadata } from "next";
import { QuizRunner } from "@/components/quiz-runner";

export const metadata: Metadata = { title: "Take the test" };

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <QuizRunner attemptId={id} />;
}
