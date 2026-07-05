import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  _client = createClient(url, key);
  return _client;
}

/**
 * Supabase client — returns null when env vars aren't configured.
 * Use supabase() to get the client, and handle the null case in your component.
 */
export function supabase(): SupabaseClient | null {
  return getClient();
}