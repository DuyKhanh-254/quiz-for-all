import { z } from "zod";

export const studentProfileSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter the student's full name.").max(100),
  className: z.string().trim().min(1, "Please enter the class.").max(40),
  quizSlug: z.string().trim().min(1).default("english-grade-2-semester-2"),
});

export const responseSchema = z.union([
  z.object({ option: z.string().min(1).max(50) }).strict(),
  z.object({ value: z.string().max(500) }).strict(),
  z.object({ pairs: z.record(z.string().max(100), z.string().max(100)) }).strict(),
]);

export const saveAnswerSchema = z.object({
  questionId: z.uuid(),
  response: responseSchema,
});

export const submitSchema = z.object({
  answers: z.record(z.uuid(), responseSchema).default({}),
});

export const adminRegisterSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  password: z.string().min(8).max(128),
  confirmPassword: z.string(),
  setupCode: z.string().min(1).max(500),
}).refine((data) => data.password === data.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match." });
