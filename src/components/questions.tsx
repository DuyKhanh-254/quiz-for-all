"use client";

import { Check, CheckCircle2, CircleX, Link2, Volume2 } from "lucide-react";
import { AudioPlayer } from "@/components/audio-player";
import { QuestionImage } from "@/components/question-image";
import { SpriteImage } from "@/components/sprite-image";
import type { JsonResponse, QuizQuestion } from "@/lib/types";

interface Props {
  question: QuizQuestion;
  value?: JsonResponse;
  onChange?: (response: JsonResponse) => void;
  number: number;
  readonly?: boolean;
  isCorrect?: boolean | null;
}

type SpriteMetadata = {
  sprite_columns?: number;
  sprite_rows?: number;
  sprite_index?: number;
  left_items?: Array<{ key: string; text: string }>;
  visual_theme?: string;
  concept?: string;
};

function Status({ isCorrect }: { isCorrect?: boolean | null }) {
  if (isCorrect == null) return null;
  return isCorrect ? <span className="badge bg-[#e9f8f1] text-[#246c53]"><CheckCircle2 size={15} /> Correct</span> : <span className="badge bg-[#fff0f1] text-[#9a3038]"><CircleX size={15} /> Needs another look</span>;
}

function ChoiceQuestion({ question, value, onChange, readonly }: Omit<Props, "number" | "isCorrect">) {
  const selected = value && "option" in value ? value.option : "";
  const metadata = question.metadata as SpriteMetadata;
  const spriteColumns = Number(metadata.sprite_columns) || 0;
  const spriteRows = Number(metadata.sprite_rows) || 1;
  const isTestFive = metadata.visual_theme === "test-5-illustrated";
  const accentClasses = ["border-l-[#facc15]", "border-l-[#60a5fa]", "border-l-[#fb7185]", "border-l-[#a78bfa]"];
  return <div className={`grid gap-3 ${isTestFive ? "sm:grid-cols-2" : question.question_type === "image_choice" ? "sm:grid-cols-3" : ""}`} role="radiogroup" aria-label={question.prompt}>
    {question.question_options.map((option, index) => {
      const active = selected === option.option_key;
      return <button type="button" role="radio" aria-checked={active} disabled={readonly} key={option.id} onClick={() => onChange?.({ option: option.option_key })} className={`group relative min-h-16 rounded-2xl border-2 p-4 text-left transition duration-300 ${isTestFive ? `overflow-hidden border-l-8 ${accentClasses[index % accentClasses.length]} sm:min-h-28 sm:p-5` : ""} ${active ? "border-[#2869c7] bg-[#edf5ff] shadow-lg ring-4 ring-[#2869c7]/10" : "border-[#d5e0e8] bg-white hover:-translate-y-0.5 hover:border-[#96b4d0] hover:shadow-md"} ${readonly ? "cursor-default" : ""}`}>
        {question.question_type === "image_choice" && question.image_url && spriteColumns > 0 && <SpriteImage src={question.image_url} columns={spriteColumns} rows={spriteRows} index={index} alt={option.option_text || `Choice ${option.option_key.toUpperCase()}`} className="mb-3" />}
        {option.image_url && <QuestionImage src={option.image_url} alt={option.option_text || `Choice ${option.option_key.toUpperCase()}`} className="mb-3 min-h-36" />}
        <span className="flex items-center gap-3"><span className={`grid size-9 shrink-0 place-items-center rounded-full text-sm font-black uppercase ${active ? "bg-[#2869c7] text-white" : "bg-[#edf1f5] text-[#425d77]"}`}>{active ? <Check size={18} /> : option.option_key}</span><span className="text-lg font-bold">{option.option_text || `Picture ${option.option_key.toUpperCase()}`}</span></span>
      </button>;
    })}
  </div>;
}

function MatchingQuestion({ question, value, onChange, readonly }: Omit<Props, "number" | "isCorrect">) {
  const metadata = question.metadata as SpriteMetadata;
  const leftItems = metadata.left_items ?? [];
  const spriteColumns = Number(metadata.sprite_columns) || 0;
  const pairs = value && "pairs" in value ? value.pairs : {};
  function select(left: string, right: string) {
    const next = { ...pairs };
    Object.keys(next).forEach((key) => { if (next[key] === right && key !== left) delete next[key]; });
    next[left] = right;
    onChange?.({ pairs: next });
  }
  return <div className="space-y-4">
    {leftItems.map((left, index) => <fieldset key={left.key} className="rounded-2xl border border-[#d5e0e8] p-4"><legend className="px-2 text-lg font-extrabold"><span className="mr-2 inline-grid size-8 place-items-center rounded-full bg-[#fff0bc] text-sm">{index + 1}</span>{left.text}</legend><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">{question.question_options.map((option, optionIndex) => { const active = pairs[left.key] === option.option_key; const used = Object.entries(pairs).some(([key, answer]) => key !== left.key && answer === option.option_key); return <button type="button" disabled={readonly || used} aria-pressed={active} onClick={() => select(left.key, option.option_key)} key={option.id} className={`rounded-xl border-2 p-2 text-center font-bold transition ${active ? "border-[#2869c7] bg-[#edf5ff] text-[#1f5da9]" : "border-[#d5e0e8] bg-white hover:border-[#96b4d0]"} ${used ? "opacity-35" : ""}`}>{question.image_url && spriteColumns > 0 && <SpriteImage src={question.image_url} columns={spriteColumns} index={optionIndex} alt={option.option_text || `Choice ${option.option_key.toUpperCase()}`} className="mb-2" />}<span className="uppercase">{option.option_key}.</span> {option.option_text}</button>; })}</div>{pairs[left.key] && <p className="mt-3 flex items-center gap-2 text-sm font-bold text-[#2869c7]"><Link2 size={16} /> Matched with {pairs[left.key].toUpperCase()}</p>}</fieldset>)}
  </div>;
}

function FillBlankQuestion({ question, value, onChange, readonly }: Omit<Props, "number" | "isCorrect">) {
  const text = value && "value" in value ? value.value : "";
  const metadata = question.metadata as SpriteMetadata;
  const spriteColumns = Number(metadata.sprite_columns) || 0;
  const spriteRows = Number(metadata.sprite_rows) || 1;
  const spriteIndex = Number(metadata.sprite_index) || 0;
  return <div>{question.image_url && spriteColumns > 0 ? <SpriteImage src={question.image_url} columns={spriteColumns} rows={spriteRows} index={spriteIndex} alt={`Picture for: ${question.prompt}`} className="mx-auto mb-5 max-w-sm" /> : <QuestionImage src={question.image_url} alt={`Picture for: ${question.prompt}`} className="mb-5 min-h-64" />}<label className="label" htmlFor={`answer-${question.id}`}>Write your answer</label><input id={`answer-${question.id}`} className="field !min-h-16 !text-xl !font-bold" value={text} readOnly={readonly} onChange={(event) => onChange?.({ value: event.target.value })} autoComplete="off" autoCapitalize="none" spellCheck={false} maxLength={500} placeholder={readonly ? "No answer" : "Type the word here…"} /></div>;
}

export function QuestionCard(props: Props) {
  const { question, number, isCorrect } = props;
  const metadata = question.metadata as SpriteMetadata;
  const isTestFive = metadata.visual_theme === "test-5-illustrated";
  const spriteColumns = Number(metadata.sprite_columns) || 0;
  const spriteRows = Number(metadata.sprite_rows) || 1;
  const spriteIndex = Number(metadata.sprite_index) || 0;
  return <article id={`question-${question.id}`} className={`card scroll-mt-24 p-5 sm:p-7 ${isTestFive ? "test5-question-card relative overflow-hidden !border-[#94c11f] !bg-[#fffef8] sm:!p-8" : ""}`}>
    <header className={`mb-5 flex items-start justify-between gap-4 ${isTestFive ? "text-center sm:justify-center" : ""}`}><div className={isTestFive ? "w-full" : ""}><p className="text-sm font-extrabold uppercase tracking-wider text-[#617a94]">Câu {number}</p>{isTestFive && metadata.concept && <h2 className="mt-2 text-3xl font-black text-[#173b28]">{metadata.concept}</h2>}<h3 className={`${isTestFive ? "mx-auto mt-2 max-w-4xl text-xl sm:text-2xl" : "mt-1 text-xl"} font-extrabold leading-snug`}>{question.prompt}</h3></div><Status isCorrect={isCorrect} /></header>
    {question.audio_url && <div className="mb-5"><p className="mb-2 flex items-center gap-2 text-sm font-bold"><Volume2 size={17} /> Question audio</p><AudioPlayer src={question.audio_url} label={`Audio for question ${number}`} /></div>}
    {isTestFive && question.image_url && spriteColumns > 0 && <SpriteImage src={question.image_url} columns={spriteColumns} rows={spriteRows} index={spriteIndex} alt={`Cartoon illustration of ${metadata.concept || question.prompt}`} className="test5-concept-image mx-auto mb-7 w-full max-w-[17rem] border-4 border-white shadow-xl" />}
    {(question.question_type === "single_choice" || question.question_type === "image_choice") && <ChoiceQuestion {...props} />}
    {question.question_type === "matching" && <MatchingQuestion {...props} />}
    {question.question_type === "fill_blank" && <FillBlankQuestion {...props} />}
  </article>;
}

export function isAnswered(question: QuizQuestion, response?: JsonResponse) {
  if (!response) return false;
  if ("option" in response) return Boolean(response.option);
  if ("value" in response) return Boolean(response.value.trim());
  if ("pairs" in response) {
    const expected = ((question.metadata as { left_items?: unknown[] }).left_items ?? []).length;
    return expected > 0 && Object.keys(response.pairs).length >= expected;
  }
  return false;
}
