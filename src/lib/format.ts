export function formatDuration(seconds: number | null | undefined) {
  const value = Math.max(0, seconds ?? 0);
  const minutes = Math.floor(value / 60);
  const remaining = value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}
