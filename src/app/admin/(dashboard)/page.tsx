import Link from "next/link";
import { Award, Clock3, Search, TrendingUp, Users } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate, formatDuration } from "@/lib/format";

export const metadata = { title: "Results dashboard" };

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search.trim().slice(0, 100) : "";
  const className = typeof params.class === "string" ? params.class.slice(0, 40) : "";
  const sort = params.sort === "score" ? "score" : "newest";
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = 20;
  const admin = createAdminClient();
  let query = admin.from("attempts").select("id,student_name,class_name,score,max_score,percentage,correct_count,total_questions,duration_seconds,submitted_at", { count: "exact" }).eq("status", "submitted");
  if (search) query = query.ilike("student_name", `%${search.replace(/[%_]/g, "")}%`);
  if (className) query = query.eq("class_name", className);
  query = sort === "score" ? query.order("percentage", { ascending: false }).order("submitted_at", { ascending: false }) : query.order("submitted_at", { ascending: false });
  const [{ data: attempts, count }, { data: allScores }, { count: studentCount }, { data: classRows }] = await Promise.all([
    query.range((page - 1) * pageSize, page * pageSize - 1),
    admin.from("attempts").select("percentage,submitted_at").eq("status", "submitted"),
    admin.from("profiles").select("id", { count: "exact", head: true }).eq("role", "student"),
    admin.from("attempts").select("class_name").eq("status", "submitted").not("class_name", "is", null),
  ]);
  const scores = allScores ?? [];
  const average = scores.length ? scores.reduce((sum, row) => sum + Number(row.percentage ?? 0), 0) / scores.length : 0;
  const highest = scores.length ? Math.max(...scores.map((row) => Number(row.percentage ?? 0))) : 0;
  const latest = scores.map((row) => row.submitted_at).filter(Boolean).sort().at(-1);
  const classes = [...new Set((classRows ?? []).map((row) => row.class_name).filter(Boolean))].sort();
  const pageCount = Math.max(1, Math.ceil((count ?? 0) / pageSize));
  return <main className="shell py-8"><div><p className="text-sm font-extrabold uppercase tracking-widest text-[#61738a]">Overview</p><h1 className="mt-1 text-3xl font-black">Student results</h1></div><section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><Metric icon={<Award />} label="Submissions" value={String(scores.length)} /><Metric icon={<TrendingUp />} label="Average score" value={`${average.toFixed(1)}%`} /><Metric icon={<Award />} label="Highest score" value={`${highest.toFixed(1)}%`} /><Metric icon={<Users />} label="Students" value={String(studentCount ?? 0)} /><Metric icon={<Clock3 />} label="Latest" value={latest ? formatDate(latest) : "—"} small /></section>
    <section className="card mt-7 overflow-hidden"><div className="border-b border-[#dce6ee] p-5"><form className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto]"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#70849a]" size={18} /><label className="sr-only" htmlFor="search">Search student</label><input className="field !pl-10" id="search" name="search" defaultValue={search} placeholder="Search student name…" /></div><label className="sr-only" htmlFor="class">Filter by class</label><select className="field" id="class" name="class" defaultValue={className}><option value="">All classes</option>{classes.map((item) => <option key={item} value={item}>{item}</option>)}</select><label className="sr-only" htmlFor="sort">Sort results</label><select className="field" id="sort" name="sort" defaultValue={sort}><option value="newest">Newest first</option><option value="score">Highest score</option></select><button className="btn btn-primary" type="submit">Apply</button></form></div>
      {!attempts?.length ? <div className="p-12 text-center"><p className="text-lg font-extrabold">No submissions found</p><p className="muted mt-2">Try changing the filters, or complete a student test first.</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[900px] border-collapse text-left"><thead className="bg-[#f5f8fa] text-xs uppercase tracking-wider text-[#5c7188]"><tr><th className="px-5 py-4">Student</th><th className="px-4 py-4">Class</th><th className="px-4 py-4">Score</th><th className="px-4 py-4">Correct</th><th className="px-4 py-4">Duration</th><th className="px-4 py-4">Submitted</th><th className="px-5 py-4"><span className="sr-only">Action</span></th></tr></thead><tbody>{attempts.map((attempt) => <tr key={attempt.id} className="border-t border-[#e2e9ef] hover:bg-[#f8fbfd]"><td className="px-5 py-4 font-extrabold">{attempt.student_name}</td><td className="px-4 py-4">{attempt.class_name}</td><td className="px-4 py-4"><strong className="text-[#245ea9]">{attempt.percentage}%</strong><span className="muted ml-2 text-xs">{attempt.score}/{attempt.max_score}</span></td><td className="px-4 py-4">{attempt.correct_count}/{attempt.total_questions}</td><td className="px-4 py-4">{formatDuration(attempt.duration_seconds)}</td><td className="px-4 py-4 text-sm">{formatDate(attempt.submitted_at)}</td><td className="px-5 py-4 text-right"><Link className="font-extrabold text-[#245ea9] hover:underline" href={`/admin/attempts/${attempt.id}`}>View details</Link></td></tr>)}</tbody></table></div>}
      {pageCount > 1 && <div className="flex items-center justify-between border-t border-[#dce6ee] p-4 text-sm"><span className="muted">Page {page} of {pageCount}</span><div className="flex gap-2">{page > 1 && <Link className="btn btn-secondary !min-h-10 !px-3" href={{ pathname: "/admin", query: { search, class: className, sort, page: page - 1 } }}>Previous</Link>}{page < pageCount && <Link className="btn btn-secondary !min-h-10 !px-3" href={{ pathname: "/admin", query: { search, class: className, sort, page: page + 1 } }}>Next</Link>}</div></div>}
    </section></main>;
}

function Metric({ icon, label, value, small = false }: { icon: React.ReactNode; label: string; value: string; small?: boolean }) {
  return <div className="card flex items-center gap-4 p-5"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#eaf2fb] text-[#245ea9]">{icon}</span><div className="min-w-0"><p className="text-xs font-extrabold uppercase tracking-wider text-[#61738a]">{label}</p><p className={`mt-1 truncate font-black ${small ? "text-sm" : "text-2xl"}`}>{value}</p></div></div>;
}
