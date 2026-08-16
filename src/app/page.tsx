import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { StudentHome } from "@/components/student-home";
import { hasPublicSupabaseEnv } from "@/lib/env-public";

export default function HomePage() {
  return <main><header className="border-b border-[#dce6ee] bg-white"><div className="shell flex min-h-16 items-center justify-between"><div className="flex items-center gap-2 font-black"><span className="grid size-10 place-items-center rounded-xl bg-[#2869c7] text-white"><GraduationCap size={23} /></span>English Practice</div><Link className="text-sm font-bold text-[#496580] hover:text-[#245eaa]" href="/admin/login">Teacher sign in</Link></div></header><div className="shell"><StudentHome configured={hasPublicSupabaseEnv()} /></div></main>;
}
