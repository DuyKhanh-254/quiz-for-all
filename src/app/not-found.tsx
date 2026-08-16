import Link from "next/link";

export default function NotFound() {
  return <main className="shell flex min-h-screen items-center justify-center py-12"><section className="card max-w-lg p-8 text-center"><p className="mb-2 text-5xl">🧭</p><h1 className="text-2xl font-extrabold">We could not find that page</h1><p className="muted mt-3">The link may be old, or you may not have permission to view it.</p><Link className="btn btn-primary mt-6" href="/">Back to home</Link></section></main>;
}
