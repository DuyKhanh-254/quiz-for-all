import type { Metadata } from "next";
import { AttemptReview } from "@/components/attempt-review";

export const metadata: Metadata = { title: "My answer review" };

export default async function AttemptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AttemptReview attemptId={id} />;
}
