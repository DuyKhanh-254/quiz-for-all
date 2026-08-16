import type { Metadata } from "next";
import { AdminAuthForm } from "@/components/admin-auth-form";
import { hasPublicSupabaseEnv } from "@/lib/env-public";

export const metadata: Metadata = { title: "Protected admin registration" };
export default function AdminRegisterPage() { return <AdminAuthForm mode="register" configured={hasPublicSupabaseEnv()} />; }
