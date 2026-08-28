"use client";

export function SpriteImage({
  src,
  columns,
  rows = 1,
  index,
  alt,
  className = "",
}: {
  src: string;
  columns: number;
  rows?: number;
  index: number;
  alt: string;
  className?: string;
}) {
  const safeColumns = Math.max(1, columns);
  const safeRows = Math.max(1, rows);
  const maxIndex = safeColumns * safeRows - 1;
  const safeIndex = Math.min(Math.max(0, index), maxIndex);
  const column = safeIndex % safeColumns;
  const row = Math.floor(safeIndex / safeColumns);
  const x = safeColumns === 1 ? 0 : (column / (safeColumns - 1)) * 100;
  const y = safeRows === 1 ? 0 : (row / (safeRows - 1)) * 100;

  return (
    <div
      role="img"
      aria-label={alt}
      className={`aspect-square overflow-hidden rounded-2xl border border-[#c8def0] bg-white bg-no-repeat ${className}`}
      style={{
        backgroundImage: `url("${src}")`,
        backgroundSize: `${safeColumns * 100}% ${safeRows * 100}%`,
        backgroundPosition: `${x}% ${y}%`,
      }}
    />
  );
}
