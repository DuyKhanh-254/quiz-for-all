"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AdminSignOut() {
  const router = useRouter();
  return <button className="btn btn-secondary !min-h-10 !px-3 !text-sm" onClick={async () => { await createClient().auth.signOut(); router.replace("/admin/login"); router.refresh(); }}><LogOut size={16} /> <span className="hidden sm:inline">Sign out</span></button>;
}
