import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getPublicSupabaseEnv } from "@/lib/env-public";
import { getServerSecrets } from "@/lib/env-server";

export function createAdminClient() {
  const { url } = getPublicSupabaseEnv();
  const { serviceKey } = getServerSecrets();
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
