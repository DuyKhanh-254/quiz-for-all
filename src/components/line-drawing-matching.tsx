"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, CheckCircle2, Circle, Info, RotateCcw, Sparkles, X, XCircle } from "lucide-react";
import type { JsonResponse, QuizQuestion } from "@/lib/types";

interface TargetPoint {
  id: string;
  name: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  is_example?: boolean;
}

interface NameTag {
  id: string;
  text: string;
  position: "top" | "bottom";
  x: number; // visual offset %
  is_example?: boolean;
  target_id?: string;
  is_distractor?: boolean;
}

interface Props {
  question: QuizQuestion;
  value?: JsonResponse;
  onChange?: (response: JsonResponse) => void;
  readonly?: boolean;
  isCorrect?: boolean | null;
}

const COLOR_PALETTE: Record<string, { stroke: string; fill: string; bg: string; text: string; border: string }> = {
  anna: { stroke: "#10b981", fill: "#34d399", bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-500" },
  mark: { stroke: "#2563eb", fill: "#60a5fa", bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-500" },
  ben: { stroke: "#d97706", fill: "#fbbf24", bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-500" },
  jill: { stroke: "#7c3aed", fill: "#a78bfa", bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-500" },
  may: { stroke: "#db2777", fill: "#f472b6", bg: "bg-pink-100", text: "text-pink-800", border: "border-pink-500" },
  hugo: { stroke: "#0891b2", fill: "#22d3ee", bg: "bg-cyan-100", text: "text-cyan-800", border: "border-cyan-500" },
  sue: { stroke: "#e11d48", fill: "#fb7185", bg: "bg-rose-100", text: "text-rose-800", border: "border-rose-500" },
};

const DEFAULT_TARGETS: TargetPoint[] = [
  { id: "person_anna", name: "Anna (Example)", x: 36.5, y: 33.0, is_example: true },
  { id: "person_dollhouse", name: "Man at doll's house (Mark)", x: 68.3, y: 37.0 },
  { id: "person_book", name: "Woman with book (Jill)", x: 83.8, y: 42.0 },
  { id: "person_mouse", name: "Woman with mouse (Sue)", x: 43.5, y: 54.0 },
  { id: "person_chair", name: "Boy on chair (Hugo)", x: 18.8, y: 66.0 },
  { id: "person_train", name: "Boy with train (Ben)", x: 72.0, y: 71.0 },
];

const DEFAULT_NAMES: NameTag[] = [
  { id: "mark", text: "Mark", position: "top", x: 18 },
  { id: "anna", text: "Anna", position: "top", x: 40, is_example: true, target_id: "person_anna" },
  { id: "ben", text: "Ben", position: "top", x: 65 },
  { id: "jill", text: "Jill", position: "top", x: 88 },
  { id: "may", text: "May", position: "bottom", x: 22, is_distractor: true },
  { id: "hugo", text: "Hugo", position: "bottom", x: 50 },
  { id: "sue", text: "Sue", position: "bottom", x: 80 },
];

export function LineDrawingMatching({ question, value, onChange, readonly }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const nameRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const targets: TargetPoint[] = (question.metadata?.targets as TargetPoint[]) || DEFAULT_TARGETS;
  const names: NameTag[] = (question.metadata?.names as NameTag[]) || DEFAULT_NAMES;
  const imageUrl = (question.metadata?.scene_image as string) || question.image_url || "";

  // User connections: { [nameId]: targetId }
  const pairs = (value && "pairs" in value ? value.pairs : {}) as Record<string, string>;

  // Selection & dragging state
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [hoverTarget, setHoverTarget] = useState<string | null>(null);
  const [dragRay, setDragRay] = useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);

  // Line coordinate state: records absolute pixel coordinates within container
  const [lines, setLines] = useState<Array<{ nameId: string; targetId: string; x1: number; y1: number; x2: number; y2: number; isExample?: boolean }>>([]);

  const recalculateCoordinates = useCallback(() => {
    if (!containerRef.current || !imageRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const imgRect = imageRef.current.getBoundingClientRect();

    if (imgRect.width === 0 || imgRect.height === 0) return;

    const computedLines: Array<{ nameId: string; targetId: string; x1: number; y1: number; x2: number; y2: number; isExample?: boolean }> = [];

    // 1. Example line (Anna -> person_anna)
    const annaNameEl = nameRefs.current.anna;
    const annaTarget = targets.find((t) => t.id === "person_anna");
    if (annaNameEl && annaTarget) {
      const nameRect = annaNameEl.getBoundingClientRect();
      const x1 = nameRect.left + nameRect.width / 2 - containerRect.left;
      const y1 = nameRect.bottom - containerRect.top;
      const x2 = imgRect.left + (annaTarget.x / 100) * imgRect.width - containerRect.left;
      const y2 = imgRect.top + (annaTarget.y / 100) * imgRect.height - containerRect.top;
      computedLines.push({ nameId: "anna", targetId: "person_anna", x1, y1, x2, y2, isExample: true });
    }

    // 2. User paired lines
    for (const [nameId, targetId] of Object.entries(pairs)) {
      const nameEl = nameRefs.current[nameId];
      const target = targets.find((t) => t.id === targetId);
      if (nameEl && target) {
        const nameRect = nameEl.getBoundingClientRect();
        const tag = names.find((n) => n.id === nameId);
        const x1 = nameRect.left + nameRect.width / 2 - containerRect.left;
        const y1 = tag?.position === "bottom" ? nameRect.top - containerRect.top : nameRect.bottom - containerRect.top;
        const x2 = imgRect.left + (target.x / 100) * imgRect.width - containerRect.left;
        const y2 = imgRect.top + (target.y / 100) * imgRect.height - containerRect.top;
        computedLines.push({ nameId, targetId, x1, y1, x2, y2 });
      }
    }

    setLines(computedLines);
  }, [names, pairs, targets]);

  useEffect(() => {
    recalculateCoordinates();
    window.addEventListener("resize", recalculateCoordinates);
    return () => window.removeEventListener("resize", recalculateCoordinates);
  }, [recalculateCoordinates]);

  // Connect helper
  const connect = (nameId: string, targetId: string) => {
    if (readonly) return;
    const next = { ...pairs };
    // Remove if target already used by another name
    Object.keys(next).forEach((k) => {
      if (next[k] === targetId && k !== nameId) delete next[k];
    });
    next[nameId] = targetId;
    onChange?.({ pairs: next });
    setSelectedName(null);
  };

  const disconnect = (nameId: string) => {
    if (readonly) return;
    const next = { ...pairs };
    delete next[nameId];
    onChange?.({ pairs: next });
    if (selectedName === nameId) setSelectedName(null);
  };

  const clearAll = () => {
    if (readonly) return;
    onChange?.({ pairs: {} });
    setSelectedName(null);
  };

  // Pointer drag handling from name badge
  const handlePointerDownName = (nameId: string, e: React.PointerEvent) => {
    if (readonly) return;
    const tag = names.find((n) => n.id === nameId);
    if (tag?.is_example) return;

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const el = e.currentTarget as HTMLElement;
    const elRect = el.getBoundingClientRect();
    const startX = elRect.left + elRect.width / 2 - containerRect.left;
    const startY = tag?.position === "bottom" ? elRect.top - containerRect.top : elRect.bottom - containerRect.top;

    setSelectedName(nameId);
    setDragRay({ startX, startY, currentX: e.clientX - containerRect.left, currentY: e.clientY - containerRect.top });

    const handlePointerMove = (ev: PointerEvent) => {
      if (!containerRef.current || !imageRef.current) return;
      const cRect = containerRef.current.getBoundingClientRect();
      const iRect = imageRef.current.getBoundingClientRect();
      const curX = ev.clientX - cRect.left;
      const curY = ev.clientY - cRect.top;

      setDragRay({ startX, startY, currentX: curX, currentY: curY });

      // Check hover over targets
      let found: string | null = null;
      for (const t of targets) {
        if (t.is_example) continue;
        const tx = iRect.left + (t.x / 100) * iRect.width;
        const ty = iRect.top + (t.y / 100) * iRect.height;
        const dist = Math.hypot(ev.clientX - tx, ev.clientY - ty);
        if (dist < 40) {
          found = t.id;
          break;
        }
      }
      setHoverTarget(found);
    };

    const handlePointerUp = (ev: PointerEvent) => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);

      if (imageRef.current) {
        const iRect = imageRef.current.getBoundingClientRect();
        for (const t of targets) {
          if (t.is_example) continue;
          const tx = iRect.left + (t.x / 100) * iRect.width;
          const ty = iRect.top + (t.y / 100) * iRect.height;
          const dist = Math.hypot(ev.clientX - tx, ev.clientY - ty);
          if (dist < 45) {
            connect(nameId, t.id);
            break;
          }
        }
      }
      setDragRay(null);
      setHoverTarget(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handleTargetClick = (targetId: string) => {
    if (readonly) return;
    const target = targets.find((t) => t.id === targetId);
    if (target?.is_example) return;

    if (selectedName) {
      connect(selectedName, targetId);
    } else {
      // If clicked a target that already has a line, find its name and select it
      const existingName = Object.keys(pairs).find((n) => pairs[n] === targetId);
      if (existingName) {
        disconnect(existingName);
      }
    }
  };

  const topNames = names.filter((n) => n.position === "top");
  const bottomNames = names.filter((n) => n.position === "bottom");
  const connectedCount = Object.keys(pairs).length;

  return (
    <div className="w-full select-none" ref={containerRef}>
      {/* Instructions & Quick Status Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#f0f7ff] p-3 text-sm font-semibold text-[#1e4976]">
        <div className="flex items-center gap-2">
          <Info size={18} className="text-[#2563eb]" />
          <span>Kéo tên hoặc chạm vào tên rồi chạm vào người trong tranh để nối tia.</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-black shadow-sm text-[#2563eb]">
            Đã nối: {connectedCount} / 5
          </span>
          {!readonly && connectedCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-red-600 hover:bg-red-50 transition"
            >
              <RotateCcw size={14} /> Xóa làm lại
            </button>
          )}
        </div>
      </div>

      {/* Top Name Badges */}
      <div className="mb-3 flex justify-around gap-2 px-2 sm:px-6">
        {topNames.map((tag) => {
          const color = COLOR_PALETTE[tag.id] || COLOR_PALETTE.mark;
          const isConnected = Boolean(pairs[tag.id]) || tag.is_example;
          const isSelected = selectedName === tag.id;

          return (
            <div key={tag.id} className="relative flex flex-col items-center">
              <button
                ref={(el) => {
                  nameRefs.current[tag.id] = el;
                }}
                type="button"
                disabled={readonly || tag.is_example}
                onClick={() => {
                  if (tag.is_example || readonly) return;
                  setSelectedName(isSelected ? null : tag.id);
                }}
                onPointerDown={(e) => handlePointerDownName(tag.id, e)}
                className={`group relative flex items-center gap-1.5 rounded-full px-4 py-2 text-base font-extrabold shadow-md transition-all duration-200 active:scale-95 ${
                  tag.is_example
                    ? "border-2 border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-300"
                    : isSelected
                    ? "scale-105 border-2 border-[#2563eb] bg-[#2563eb] text-white ring-4 ring-blue-300"
                    : isConnected
                    ? `${color.bg} ${color.text} border-2 ${color.border}`
                    : "border-2 border-[#cbdbe8] bg-white text-[#2d4964] hover:border-[#60a5fa] hover:bg-[#f8fafc]"
                }`}
              >
                <span>{tag.text}</span>
                {tag.is_example && (
                  <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-black text-white">
                    Ví dụ
                  </span>
                )}
                {!readonly && !tag.is_example && isConnected && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      disconnect(tag.id);
                    }}
                    className="ml-1 inline-grid size-4 place-items-center rounded-full bg-red-500 text-white hover:bg-red-600"
                    title="Xóa đường nối"
                  >
                    <X size={10} />
                  </span>
                )}
              </button>
              {/* Connector socket dot */}
              <span
                className={`mt-1 size-3 rounded-full border-2 border-white shadow-sm transition ${
                  isConnected ? color.bg : isSelected ? "bg-[#2563eb] scale-125" : "bg-[#94a3b8]"
                }`}
                style={{ backgroundColor: isConnected ? color.stroke : undefined }}
              />
            </div>
          );
        })}
      </div>

      {/* Main Illustration Stage with SVG overlay & Target Pins */}
      <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border-4 border-[#2869c7]/20 bg-white shadow-2xl">
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Cambridge Starters Test 3 Part 1 - Toy Shop Scene"
          className="block h-auto w-full"
          onLoad={recalculateCoordinates}
        />

        {/* Interactive Target Pins on People */}
        {targets.map((t, idx) => {
          const isExample = t.is_example;
          const isTargeted = Object.values(pairs).includes(t.id);
          const isHovered = hoverTarget === t.id;
          const matchedName = Object.keys(pairs).find((n) => pairs[n] === t.id);
          const color = matchedName ? COLOR_PALETTE[matchedName] : isExample ? COLOR_PALETTE.anna : null;

          return (
            <button
              key={t.id}
              type="button"
              disabled={readonly || isExample}
              onClick={() => handleTargetClick(t.id)}
              style={{ left: `${t.x}%`, top: `${t.y}%` }}
              className={`group absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                readonly ? "cursor-default" : "cursor-pointer"
              }`}
              title={t.name}
              aria-label={`Target: ${t.name}`}
            >
              {/* Outer pulsing ring */}
              <div
                className={`relative flex size-10 items-center justify-center rounded-full transition-all ${
                  isExample
                    ? "bg-emerald-500/30 ring-4 ring-emerald-500/50"
                    : isHovered
                    ? "scale-125 bg-amber-400 ring-8 ring-amber-300/80 animate-pulse"
                    : isTargeted
                    ? "scale-110 ring-4 ring-white shadow-lg"
                    : selectedName
                    ? "scale-110 ring-4 ring-blue-400 animate-bounce bg-blue-500/30"
                    : "bg-white/80 ring-2 ring-[#2869c7]/60 hover:scale-125 hover:bg-white"
                }`}
                style={{ backgroundColor: color ? color.fill : undefined }}
              >
                {/* Center dot pin */}
                <div
                  className={`size-5 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[10px] font-black ${
                    isExample
                      ? "bg-emerald-600 text-white"
                      : isTargeted
                      ? "text-white"
                      : "bg-[#2563eb] text-white"
                  }`}
                  style={{ backgroundColor: color ? color.stroke : undefined }}
                >
                  {isExample ? "✓" : isTargeted ? "✓" : idx}
                </div>
              </div>
            </button>
          );
        })}

        {/* SVG Drawing Canvas Layer */}
        <svg
          className="pointer-events-none absolute inset-0 size-full"
          style={{ overflow: "visible" }}
        >
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Render all confirmed connections */}
          {lines.map((l) => {
            const color = COLOR_PALETTE[l.nameId] || COLOR_PALETTE.mark;
            const strokeColor = l.isExample ? "#10b981" : color.stroke;

            return (
              <g key={`${l.nameId}-${l.targetId}`} filter="url(#glow)">
                {/* Base Shadow / Contrast Border */}
                <line
                  x1={l.x1}
                  y1={l.y1}
                  x2={l.x2}
                  y2={l.y2}
                  stroke="#ffffff"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                {/* Primary Ray Line */}
                <line
                  x1={l.x1}
                  y1={l.y1}
                  x2={l.x2}
                  y2={l.y2}
                  stroke={strokeColor}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray={l.isExample ? "6,4" : undefined}
                />
                {/* End Point circles */}
                <circle cx={l.x1} cy={l.y1} r="5" fill="#ffffff" stroke={strokeColor} strokeWidth="2.5" />
                <circle cx={l.x2} cy={l.y2} r="6" fill={strokeColor} stroke="#ffffff" strokeWidth="2" />
              </g>
            );
          })}

          {/* Render Live Dragging Ray */}
          {dragRay && selectedName && (
            <g filter="url(#glow)">
              <line
                x1={dragRay.startX}
                y1={dragRay.startY}
                x2={dragRay.currentX}
                y2={dragRay.currentY}
                stroke="#ffffff"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <line
                x1={dragRay.startX}
                y1={dragRay.startY}
                x2={dragRay.currentX}
                y2={dragRay.currentY}
                stroke={COLOR_PALETTE[selectedName]?.stroke || "#2563eb"}
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle
                cx={dragRay.currentX}
                cy={dragRay.currentY}
                r="8"
                fill={COLOR_PALETTE[selectedName]?.stroke || "#2563eb"}
                stroke="#ffffff"
                strokeWidth="2.5"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Bottom Name Badges */}
      <div className="mt-3 flex justify-around gap-2 px-2 sm:px-6">
        {bottomNames.map((tag) => {
          const color = COLOR_PALETTE[tag.id] || COLOR_PALETTE.hugo;
          const isConnected = Boolean(pairs[tag.id]);
          const isSelected = selectedName === tag.id;

          return (
            <div key={tag.id} className="relative flex flex-col items-center">
              {/* Connector socket dot */}
              <span
                className={`mb-1 size-3 rounded-full border-2 border-white shadow-sm transition ${
                  isConnected ? color.bg : isSelected ? "bg-[#2563eb] scale-125" : "bg-[#94a3b8]"
                }`}
                style={{ backgroundColor: isConnected ? color.stroke : undefined }}
              />
              <button
                ref={(el) => {
                  nameRefs.current[tag.id] = el;
                }}
                type="button"
                disabled={readonly}
                onClick={() => {
                  if (readonly) return;
                  setSelectedName(isSelected ? null : tag.id);
                }}
                onPointerDown={(e) => handlePointerDownName(tag.id, e)}
                className={`group relative flex items-center gap-1.5 rounded-full px-4 py-2 text-base font-extrabold shadow-md transition-all duration-200 active:scale-95 ${
                  isSelected
                    ? "scale-105 border-2 border-[#2563eb] bg-[#2563eb] text-white ring-4 ring-blue-300"
                    : isConnected
                    ? `${color.bg} ${color.text} border-2 ${color.border}`
                    : "border-2 border-[#cbdbe8] bg-white text-[#2d4964] hover:border-[#60a5fa] hover:bg-[#f8fafc]"
                }`}
              >
                <span>{tag.text}</span>
                {tag.is_distractor && (
                  <span className="rounded-full bg-slate-200 px-1 py-0.2 text-[9px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition">
                    Tên
                  </span>
                )}
                {!readonly && isConnected && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      disconnect(tag.id);
                    }}
                    className="ml-1 inline-grid size-4 place-items-center rounded-full bg-red-500 text-white hover:bg-red-600"
                    title="Xóa đường nối"
                  >
                    <X size={10} />
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
