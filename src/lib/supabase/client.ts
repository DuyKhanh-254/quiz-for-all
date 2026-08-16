"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getPublicSupabaseEnv } from "@/lib/env-public";

let client: ReturnType<typeof createBrowserClient> | undefined;

export function createClient() {
  const { url, key } = getPublicSupabaseEnv();
  client ??= createBrowserClient(url, key);
  return client;
}
