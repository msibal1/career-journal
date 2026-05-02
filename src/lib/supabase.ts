import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

/** False if env vars were missing at build time (e.g. Vercel) or locally. */
export const supabaseConfigured = Boolean(url && key);

/**
 * Live Supabase client, or `null` when URL/key are missing — never call
 * `createClient` with undefined (that crashes the bundle → blank page).
 */
export const supabase: SupabaseClient | null =
  url && key
    ? createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: "pkce",
        },
      })
    : null;
