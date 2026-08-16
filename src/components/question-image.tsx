"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";

export function QuestionImage({ src, alt, className = "" }: { src: string | null; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return src ? <div className={`flex min-h-36 items-center justify-center rounded-2xl bg-[#f0f4f7] text-[#6f8297] ${className}`}><ImageOff className="mr-2" /> Image unavailable</div> : null;
  return <div className={`relative min-h-48 overflow-hidden rounded-2xl bg-[#f7fafc] ${className}`}><Image src={src} alt={alt} fill sizes="(max-width: 768px) 90vw, 520px" className="object-contain" onError={() => setFailed(true)} /></div>;
}
