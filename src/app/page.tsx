import Link from "next/link";
import { StudentHome } from "@/components/student-home";
import { hasPublicSupabaseEnv } from "@/lib/env-public";

export default function HomePage() {
  return (
    <main>
      <header className="border-b-2 border-[#f6d77d] bg-[#fffdf5] shadow-xs">
        <div className="shell flex min-h-16 items-center justify-between">
          <div className="flex items-center gap-2.5 font-black text-[#78350f] text-lg">
            <span className="grid size-10 place-items-center rounded-2xl bg-[#f59e0b] text-white shadow-md text-xl">
              🦁
            </span>
            English Practice – Starters Zoo 🌟
          </div>
          <Link
            className="text-xs font-black text-[#b45309] hover:text-[#78350f] rounded-xl px-3.5 py-2 bg-[#fef3c7] hover:bg-[#fde68a] transition border border-[#f6d77d]"
            href="/admin/login"
          >
            Teacher Sign In 🔑
          </Link>
        </div>
      </header>
      <div className="shell">
        <StudentHome configured={hasPublicSupabaseEnv()} />
      </div>
    </main>
  );
}
