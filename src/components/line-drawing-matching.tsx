"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Info, RotateCcw, Sparkles, X, MousePointerClick } from "lucide-react";
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
  x: number;
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
  { id: "person_anna", name: "Anna (Ví dụ - Cô bé nhìn con cá)", x: 34.0, y: 35.5, is_example: true },
  { id: "person_mother", name: "Người mẹ (Áo khoác xanh dương)", x: 18.5, y: 31.0 },
  { id: "person_dollhouse", name: "Người đàn ông xem nhà búp bê (Mark)", x: 65.5, y: 40.0 },
  { id: "person_book", name: "Người phụ nữ xem sách cây (Jill)", x: 79.0, y: 46.0 },
  { id: "person_mouse", name: "Người phụ nữ chỉ chuột đồ chơi (Sue)", x: 41.5, y: 62.0 },
  { id: "person_chair", name: "Cậu bé đeo kính ngồi ghế (Hugo)", x: 17.5, y: 77.0 },
  { id: "person_train", name: "Cậu bé chơi xe lửa dưới sàn (Ben)", x: 70.0, y: 79.0 },
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
  const stageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const nameRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const socketRefs = useRef<Record<string, HTMLSpanElement | null>>({});

  const targets: TargetPoint[] = (question.metadata?.targets as TargetPoint[]) || DEFAULT_TARGETS;
  const names: NameTag[] = (question.metadata?.names as NameTag[]) || DEFAULT_NAMES;

  // Resolve image URL with guaranteed fallback to Supabase CDN
  const rawUrl = (question.metadata?.scene_image as string) || question.image_url || "";
  const imageUrl = rawUrl.startsWith("http")
    ? rawUrl
    : rawUrl
    ? `https://syghsisooccdvpvshgvm.supabase.co/storage/v1/object/public/quiz-assets/english-grade-2-test-8/${rawUrl.replace(/^\/+/, "")}`
    : "https://syghsisooccdvpvshgvm.supabase.co/storage/v1/object/public/quiz-assets/english-grade-2-test-8/images/listening/test8-part1-scene.jpg";

  // User connections: { [nameId]: targetId }
  const pairs = (value && "pairs" in value ? value.pairs : {}) as Record<string, string>;

  // Selection & dragging state
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [hoverTarget, setHoverTarget] = useState<string | null>(null);
  const [dragRay, setDragRay] = useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);

  // Line coordinate state: absolute pixel coordinates relative to stageRef
  const [lines, setLines] = useState<Array<{ nameId: string; targetId: string; x1: number; y1: number; x2: number; y2: number; isExample?: boolean }>>([]);

  const recalculateCoordinates = useCallback(() => {
    if (!stageRef.current || !imageRef.current) return;
    const stageRect = stageRef.current.getBoundingClientRect();
    const imgRect = imageRef.current.getBoundingClientRect();

    if (imgRect.width === 0 || imgRect.height === 0) return;

    const computedLines: Array<{ nameId: string; targetId: string; x1: number; y1: number; x2: number; y2: number; isExample?: boolean }> = [];

    const getSocketCoord = (nameId: string) => {
      const socketEl = socketRefs.current[nameId];
      if (socketEl) {
        const r = socketEl.getBoundingClientRect();
        return { x: r.left + r.width / 2 - stageRect.left, y: r.top + r.height / 2 - stageRect.top };
      }
      const nameEl = nameRefs.current[nameId];
      if (nameEl) {
        const r = nameEl.getBoundingClientRect();
        const tag = names.find((n) => n.id === nameId);
        return {
          x: r.left + r.width / 2 - stageRect.left,
          y: (tag?.position === "bottom" ? r.top : r.bottom) - stageRect.top,
        };
      }
      return null;
    };

    const getTargetCoord = (targetId: string) => {
      const target = targets.find((t) => t.id === targetId);
      if (!target) return null;
      return {
        x: imgRect.left + (target.x / 100) * imgRect.width - stageRect.left,
        y: imgRect.top + (target.y / 100) * imgRect.height - stageRect.top,
      };
    };

    // 1. Example line: Anna -> person_anna
    const annaSocket = getSocketCoord("anna");
    const annaTargetCoord = getTargetCoord("person_anna");
    if (annaSocket && annaTargetCoord) {
      computedLines.push({
        nameId: "anna",
        targetId: "person_anna",
        x1: annaSocket.x,
        y1: annaSocket.y,
        x2: annaTargetCoord.x,
        y2: annaTargetCoord.y,
        isExample: true,
      });
    }

    // 2. User paired lines
    for (const [nameId, targetId] of Object.entries(pairs)) {
      const socketCoord = getSocketCoord(nameId);
      const targetCoord = getTargetCoord(targetId);
      if (socketCoord && targetCoord) {
        computedLines.push({
          nameId,
          targetId,
          x1: socketCoord.x,
          y1: socketCoord.y,
          x2: targetCoord.x,
          y2: targetCoord.y,
        });
      }
    }

    setLines(computedLines);
  }, [names, pairs, targets]);

  useEffect(() => {
    recalculateCoordinates();
    window.addEventListener("resize", recalculateCoordinates);

    const observer = new ResizeObserver(() => {
      recalculateCoordinates();
    });

    if (stageRef.current) observer.observe(stageRef.current);
    if (imageRef.current) observer.observe(imageRef.current);

    return () => {
      window.removeEventListener("resize", recalculateCoordinates);
      observer.disconnect();
    };
  }, [recalculateCoordinates]);

  // Connect helper
  const connect = (nameId: string, targetId: string) => {
    if (readonly) return;
    const next = { ...pairs };
    // If target already used by another name, remove that old pair
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

    if (!stageRef.current || !imageRef.current) return;
    const stageRect = stageRef.current.getBoundingClientRect();

    const socketEl = socketRefs.current[nameId];
    const sRect = socketEl ? socketEl.getBoundingClientRect() : (e.currentTarget as HTMLElement).getBoundingClientRect();
    const startX = sRect.left + sRect.width / 2 - stageRect.left;
    const startY = sRect.top + sRect.height / 2 - stageRect.top;

    setSelectedName(nameId);
    setDragRay({ startX, startY, currentX: e.clientX - stageRect.left, currentY: e.clientY - stageRect.top });

    const handlePointerMove = (ev: PointerEvent) => {
      if (!stageRef.current || !imageRef.current) return;
      const sR = stageRef.current.getBoundingClientRect();
      const iR = imageRef.current.getBoundingClientRect();
      const curX = ev.clientX - sR.left;
      const curY = ev.clientY - sR.top;

      setDragRay({ startX, startY, currentX: curX, currentY: curY });

      // Check hover over targets
      let found: string | null = null;
      for (const t of targets) {
        if (t.is_example) continue;
        const tx = iR.left + (t.x / 100) * iR.width;
        const ty = iR.top + (t.y / 100) * iR.height;
        const dist = Math.hypot(ev.clientX - tx, ev.clientY - ty);
        if (dist < 48) {
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
        const iR = imageRef.current.getBoundingClientRect();
        for (const t of targets) {
          if (t.is_example) continue;
          const tx = iR.left + (t.x / 100) * iR.width;
          const ty = iR.top + (t.y / 100) * iR.height;
          const dist = Math.hypot(ev.clientX - tx, ev.clientY - ty);
          if (dist < 52) {
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
      // If clicked a target that already has a line, disconnect it
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
    <div className="w-full select-none">
      {/* Instructions & Quick Status Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#f0f7ff] p-3.5 text-sm font-semibold text-[#1e4976] border border-[#d2e4f7]">
        <div className="flex items-center gap-2">
          <Info size={19} className="text-[#2563eb] shrink-0" />
          <span>Kéo tên hoặc chạm vào tên rồi chạm vào <strong>ô chấm</strong> trên người trong tranh để nối tia.</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-white px-3.5 py-1 text-xs font-black shadow-sm text-[#2563eb] border border-[#cbdbe8]">
            Đã nối: {connectedCount} / 5
          </span>
          {!readonly && connectedCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50 transition"
            >
              <RotateCcw size={14} /> Xóa làm lại
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Stage enclosing Top Names, Center Image, and Bottom Names */}
      <div ref={stageRef} className="relative w-full py-1">
        {/* Top Name Badges (Mark, Anna, Ben, Jill) */}
        <div className="mb-4 flex justify-around gap-2 px-1 sm:px-6">
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
                  className={`group relative flex items-center gap-2 rounded-2xl px-3.5 py-2.5 sm:px-5 sm:py-3 text-sm sm:text-base font-black shadow-md transition-all duration-200 active:scale-95 z-40 ${
                    tag.is_example
                      ? "border-2 border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-300 cursor-default"
                      : isSelected
                      ? "scale-105 border-2 border-[#2563eb] bg-[#2563eb] text-white ring-4 ring-blue-300"
                      : isConnected
                      ? `${color.bg} ${color.text} border-2 ${color.border}`
                      : "border-2 border-[#cbdbe8] bg-white text-[#2d4964] hover:border-[#60a5fa] hover:bg-[#f8fafc] hover:-translate-y-0.5 cursor-grab active:cursor-grabbing"
                  }`}
                >
                  <span>{tag.text}</span>
                  {tag.is_example && (
                    <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-black text-white">
                      Ví dụ
                    </span>
                  )}
                  {!readonly && !tag.is_example && isConnected && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        disconnect(tag.id);
                      }}
                      className="ml-1 inline-grid size-5 place-items-center rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                      title="Xóa đường nối"
                    >
                      <X size={12} />
                    </span>
                  )}
                </button>

                {/* Connector Socket Dot */}
                <span
                  ref={(el) => {
                    socketRefs.current[tag.id] = el;
                  }}
                  className={`mt-1.5 size-3.5 rounded-full border-2 border-white shadow-sm transition-all z-40 ${
                    isConnected ? "scale-125 shadow-md" : isSelected ? "bg-[#2563eb] scale-135 ring-4 ring-blue-300" : "bg-[#94a3b8]"
                  }`}
                  style={{ backgroundColor: isConnected ? color.stroke : undefined }}
                />
              </div>
            );
          })}
        </div>

        {/* Center Illustration Stage with Target Pins */}
        <div className="relative mx-auto w-full max-w-2xl rounded-3xl border-4 border-[#2869c7]/25 bg-white shadow-2xl aspect-[930/1184] overflow-hidden">
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Cambridge Starters Test 3 Part 1 - Toy Shop Scene"
            className="block h-full w-full object-contain pointer-events-none select-none"
            onLoad={recalculateCoordinates}
          />

          {/* Interactive Target Pins on People in the picture */}
          {targets.map((t) => {
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
                className={`group absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200 z-20 ${
                  readonly ? "cursor-default" : "cursor-pointer"
                }`}
                title={t.name}
                aria-label={`Target: ${t.name}`}
              >
                {/* Outer glowing ring / halo */}
                <div
                  className={`relative flex size-10 sm:size-12 items-center justify-center rounded-full transition-all duration-300 ${
                    isExample
                      ? "bg-emerald-500/30 ring-4 ring-emerald-500/70 shadow-lg"
                      : isHovered
                      ? "scale-130 bg-amber-400 ring-8 ring-amber-300 animate-pulse shadow-2xl"
                      : isTargeted
                      ? "scale-115 ring-4 ring-white shadow-xl"
                      : selectedName
                      ? "scale-120 ring-4 ring-blue-400 animate-bounce bg-blue-500/40 shadow-xl"
                      : "bg-white/85 ring-3 ring-[#2869c7]/70 hover:scale-125 hover:bg-white shadow-md"
                  }`}
                  style={{ backgroundColor: color ? color.fill : undefined }}
                >
                  {/* Center dot pin (ô chấm trên người) */}
                  <div
                    className={`size-6 rounded-full border-2 border-white shadow-md flex items-center justify-center text-xs font-black transition-all ${
                      isExample
                        ? "bg-emerald-600 text-white"
                        : isTargeted
                        ? "text-white scale-110"
                        : selectedName
                        ? "bg-[#2563eb] text-white"
                        : "bg-[#2563eb] text-white"
                    }`}
                    style={{ backgroundColor: color ? color.stroke : undefined }}
                  >
                    {isExample ? "✓" : isTargeted ? "✓" : <span className="size-2 rounded-full bg-white block" />}
                  </div>
                </div>

                {/* Person identification hint tooltip on hover */}
                <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900/80 px-2 py-0.5 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition shadow">
                  {t.name.split("(")[0].trim()}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom Name Badges (May, Hugo, Sue) */}
        <div className="mt-4 flex justify-around gap-2 px-1 sm:px-6">
          {bottomNames.map((tag) => {
            const color = COLOR_PALETTE[tag.id] || COLOR_PALETTE.hugo;
            const isConnected = Boolean(pairs[tag.id]);
            const isSelected = selectedName === tag.id;

            return (
              <div key={tag.id} className="relative flex flex-col items-center">
                {/* Connector Socket Dot */}
                <span
                  ref={(el) => {
                    socketRefs.current[tag.id] = el;
                  }}
                  className={`mb-1.5 size-3.5 rounded-full border-2 border-white shadow-sm transition-all z-40 ${
                    isConnected ? "scale-125 shadow-md" : isSelected ? "bg-[#2563eb] scale-135 ring-4 ring-blue-300" : "bg-[#94a3b8]"
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
                  className={`group relative flex items-center gap-2 rounded-2xl px-3.5 py-2.5 sm:px-5 sm:py-3 text-sm sm:text-base font-black shadow-md transition-all duration-200 active:scale-95 z-40 ${
                    isSelected
                      ? "scale-105 border-2 border-[#2563eb] bg-[#2563eb] text-white ring-4 ring-blue-300"
                      : isConnected
                      ? `${color.bg} ${color.text} border-2 ${color.border}`
                      : "border-2 border-[#cbdbe8] bg-white text-[#2d4964] hover:border-[#60a5fa] hover:bg-[#f8fafc] hover:-translate-y-0.5 cursor-grab active:cursor-grabbing"
                  }`}
                >
                  <span>{tag.text}</span>
                  {tag.is_distractor && (
                    <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">
                      Tên
                    </span>
                  )}
                  {!readonly && isConnected && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        disconnect(tag.id);
                      }}
                      className="ml-1 inline-grid size-5 place-items-center rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                      title="Xóa đường nối"
                    >
                      <X size={12} />
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Unified SVG Canvas spanning the whole stage from outside names into the picture */}
        <svg
          className="pointer-events-none absolute inset-0 size-full z-30"
          style={{ overflow: "visible" }}
        >
          <defs>
            <filter id="glow-ray" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Render All Confirmed Rays */}
          {lines.map((l) => {
            const color = COLOR_PALETTE[l.nameId] || COLOR_PALETTE.mark;
            const strokeColor = l.isExample ? "#10b981" : color.stroke;

            return (
              <g key={`${l.nameId}-${l.targetId}`} filter="url(#glow-ray)">
                {/* High Contrast White Shadow Track */}
                <line
                  x1={l.x1}
                  y1={l.y1}
                  x2={l.x2}
                  y2={l.y2}
                  stroke="#ffffff"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                {/* Primary Colored Ray Line */}
                <line
                  x1={l.x1}
                  y1={l.y1}
                  x2={l.x2}
                  y2={l.y2}
                  stroke={strokeColor}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={l.isExample ? "7,5" : undefined}
                />
                {/* Socket Anchor Pin */}
                <circle cx={l.x1} cy={l.y1} r="5.5" fill="#ffffff" stroke={strokeColor} strokeWidth="3" />
                {/* Person Target Pin Anchor */}
                <circle cx={l.x2} cy={l.y2} r="7.5" fill={strokeColor} stroke="#ffffff" strokeWidth="2.5" />
              </g>
            );
          })}

          {/* Render Live Dragging Ray */}
          {dragRay && selectedName && (
            <g filter="url(#glow-ray)">
              <line
                x1={dragRay.startX}
                y1={dragRay.startY}
                x2={dragRay.currentX}
                y2={dragRay.currentY}
                stroke="#ffffff"
                strokeWidth="7"
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
                r="9"
                fill={COLOR_PALETTE[selectedName]?.stroke || "#2563eb"}
                stroke="#ffffff"
                strokeWidth="3"
              />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
