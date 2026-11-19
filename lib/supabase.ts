import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { LeadInsert } from "./leads";

const FALLBACK_URL = "https://vsknmngaqocpxkzhlmrc.supabase.co";
const FALLBACK_KEY = "sb_publishable_zAvriQwKGmOJylA94Oj4qw_m6_F89sM";

export type LeadInsertResult = {
  error: { message: string; code?: string } | null;
};

/**
 * Narrow writer so inserts can be tested without a live project.
 * The real client satisfies this: `insert` is awaited directly and never chained to `.select()`.
 */
export type LeadWriter = {
  from: (table: "leads") => {
    insert: (row: LeadInsert) => PromiseLike<LeadInsertResult>;
  };
};

type Database = {
  public: {
    Tables: {
      leads: {
        Row: LeadInsert & { id: string; created_at: string; status: string };
        Insert: LeadInsert;
        Update: Partial<LeadInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

function envOrFallback(name: string, fallback: string): string {
  const value = process.env[name];
  if (typeof value === "string" && value.trim() !== "") return value.trim();
  return fallback;
}

export function getSupabase(): SupabaseClient<Database> {
  return createClient<Database>(
    envOrFallback("NEXT_PUBLIC_SUPABASE_URL", FALLBACK_URL),
    envOrFallback("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", FALLBACK_KEY),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
}

export async function insertLead(
  lead: LeadInsert,
  writer: LeadWriter = getSupabase(),
): Promise<LeadInsertResult> {
  // Do not chain `.select()`. The anon role cannot read rows, and a returning
  // select would fail the insert even when the row was accepted.
  const { error } = await writer.from("leads").insert(lead);
  return { error: error ? { message: error.message, code: error.code } : null };
}
