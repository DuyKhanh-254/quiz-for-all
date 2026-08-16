const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publicKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function hasPublicSupabaseEnv() {
  return Boolean(publicUrl && publicKey);
}

export function getPublicSupabaseEnv() {
  if (!publicUrl || !publicKey) throw new Error("Supabase public environment variables are not configured.");
  return { url: publicUrl, key: publicKey };
}
