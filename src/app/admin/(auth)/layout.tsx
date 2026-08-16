import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  return <main className="grid min-h-screen grid-rows-[auto_1fr] bg-[#f1f5f8]"><header className="border-b border-[#d7e1e8] bg-white"><div className="shell flex min-h-16 items-center justify-between"><Link href="/" className="flex items-center gap-2 font-black"><span className="grid size-9 place-items-center rounded-xl bg-[#183153] text-white"><GraduationCap size={21} /></span>English Practice</Link><span className="text-sm font-bold text-[#61738a]">Teacher area</span></div></header><div className="grid place-items-center p-5">{children}</div></main>;
}
