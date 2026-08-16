import type { Metadata } from "next";
import { AdminAuthForm } from "@/components/admin-auth-form";
import { hasPublicSupabaseEnv } from "@/lib/env-public";

export const metadata: Metadata = { title: "Teacher sign in" };
export default function AdminLoginPage() { return <AdminAuthForm mode="login" configured={hasPublicSupabaseEnv()} />; }
