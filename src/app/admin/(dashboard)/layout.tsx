import Link from "next/link";
import { BarChart3, BookOpenCheck, GraduationCap } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSignOut } from "@/components/admin-sign-out";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await supabase.from("profiles").select("full_name,role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/");
  return <div className="min-h-screen bg-[#f2f5f8]"><header className="sticky top-0 z-30 border-b border-[#d7e1e8] bg-white"><div className="shell flex min-h-16 items-center gap-5"><Link href="/admin" className="mr-auto flex items-center gap-2 font-black"><span className="grid size-9 place-items-center rounded-xl bg-[#183153] text-white"><GraduationCap size={21} /></span><span className="hidden sm:inline">Teacher Dashboard</span></Link><nav className="flex items-center gap-1 text-sm font-bold"><Link className="rounded-xl px-3 py-2 hover:bg-[#edf2f5]" href="/admin"><BarChart3 className="inline sm:mr-1" size={17} /><span className="hidden sm:inline">Results</span></Link><Link className="rounded-xl px-3 py-2 hover:bg-[#edf2f5]" href="/admin/quiz"><BookOpenCheck className="inline sm:mr-1" size={17} /><span className="hidden sm:inline">Quiz</span></Link></nav><AdminSignOut /></div></header>{children}</div>;
}
