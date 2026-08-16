"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="shell flex min-h-screen items-center justify-center py-12"><section className="card max-w-lg p-8 text-center"><p className="mb-3 text-4xl">🌤️</p><h1 className="text-2xl font-extrabold">A small hiccup</h1><p className="muted mt-3">We could not load this page. Check your connection and try once more.</p><button className="btn btn-primary mt-6" onClick={reset}>Try again</button></section></main>;
}
