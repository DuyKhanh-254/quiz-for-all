import "server-only";

export function getServerSecrets() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error("The server database credential is not configured.");
  return { serviceKey };
}
