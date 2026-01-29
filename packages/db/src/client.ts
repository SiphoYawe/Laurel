import { createClient } from "@supabase/supabase-js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

/**
 * Lazy-initialized Drizzle ORM client
 * Used for type-safe database queries
 * Initializes only when first accessed to prevent crashes during build/CI
 */
let _db: PostgresJsDatabase | null = null;

export function getDb(): PostgresJsDatabase {
  if (!_db) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL environment variable is not set. " + "Please configure it in your .env file."
      );
    }
    // Disable prefetch for serverless environments
    const client = postgres(connectionString, { prepare: false });
    _db = drizzle(client);
  }
  return _db;
}

// Export getter as db for convenience (lazy initialization)
export const db = new Proxy({} as PostgresJsDatabase, {
  get(_target, prop) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

/**
 * Lazy-initialized Supabase client
 * Used for auth, realtime, and storage features
 */
let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Supabase environment variables are not set. " +
          "Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file."
      );
    }
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
}

// Export getter as supabase for convenience (lazy initialization)
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
