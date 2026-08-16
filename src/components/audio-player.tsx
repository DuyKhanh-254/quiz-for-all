"use client";

import { Pause, Play, RotateCcw, Volume2, LoaderCircle, TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatDuration } from "@/lib/format";

export function AudioPlayer({ src, label = "Listening audio" }: { src: string; label?: string }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => () => ref.current?.pause(), []);
  function toggle() { const audio = ref.current; if (!audio) return; if (audio.paused) void audio.play(); else audio.pause(); }
  function replay() { const audio = ref.current; if (!audio) return; audio.currentTime = 0; void audio.play(); }

  if (failed) return <div className="error-box flex items-center gap-2" role="alert"><TriangleAlert size={19} /> Audio could not be loaded. Please ask your teacher.</div>;
  return <div className="rounded-2xl border border-[#cbdbe8] bg-[#f3f8fd] p-4" aria-label={label}>
    <audio ref={ref} src={src} preload="metadata" onCanPlay={() => setLoading(false)} onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)} onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => setFailed(true)} />
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" className="btn btn-primary !size-14 !rounded-full !p-0" onClick={toggle} disabled={loading} aria-label={playing ? "Pause audio" : "Play audio"}>{loading ? <LoaderCircle className="animate-spin" /> : playing ? <Pause /> : <Play className="ml-1" />}</button>
      <button type="button" className="btn btn-secondary !min-h-11 !px-3" onClick={replay}><RotateCcw size={18} /> Replay</button>
      <div className="min-w-48 flex-1"><label className="sr-only" htmlFor={`audio-progress-${src}`}>Audio progress</label><input id={`audio-progress-${src}`} className="w-full accent-[#2869c7]" type="range" min={0} max={duration || 1} step="0.1" value={current} onChange={(e) => { if (ref.current) ref.current.currentTime = Number(e.target.value); }} /><p className="mt-1 text-xs font-bold text-[#587088]">{formatDuration(Math.floor(current))} / {formatDuration(Math.floor(duration))}</p></div>
      <label className="flex items-center gap-2" aria-label="Volume"><Volume2 size={19} /><input className="w-24 accent-[#2869c7]" type="range" min={0} max={1} step="0.05" value={volume} onChange={(e) => { const next = Number(e.target.value); setVolume(next); if (ref.current) ref.current.volume = next; }} /></label>
    </div>
  </div>;
}
