export type QuestionType = "single_choice" | "image_choice" | "matching" | "fill_blank";

export type JsonResponse =
  | { option: string }
  | { value: string }
  | { pairs: Record<string, string> };

export interface QuestionOption {
  id: string;
  option_key: string;
  option_text: string | null;
  image_url: string | null;
  position: number;
}

export interface QuizQuestion {
  id: string;
  position: number;
  question_type: QuestionType;
  prompt: string;
  image_url: string | null;
  audio_url: string | null;
  metadata: Record<string, unknown>;
  points: number;
  question_options: QuestionOption[];
}

export interface QuizSection {
  id: string;
  title: string;
  instruction: string;
  section_type: string;
  position: number;
  audio_url: string | null;
  image_url: string | null;
  questions: QuizQuestion[];
}

export interface Quiz {
  id: string;
  slug: string;
  title: string;
  description: string;
  grade: string;
  subject: string;
  quiz_sections: QuizSection[];
}

export interface AttemptSummary {
  id: string;
  student_name: string;
  class_name: string;
  status: "in_progress" | "submitted";
  score: number | null;
  max_score: number | null;
  percentage: number | null;
  correct_count: number | null;
  total_questions: number | null;
  started_at: string;
  submitted_at: string | null;
  duration_seconds: number | null;
}

export interface AttemptAnswer {
  question_id: string;
  response: JsonResponse;
  is_correct: boolean | null;
  awarded_points: number | null;
}

export interface AnswerKey {
  question_id: string;
  answer: { option?: string; accepted?: string[]; pairs?: Record<string, string>; case_sensitive?: boolean };
}
