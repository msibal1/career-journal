import { supabase } from "./supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Entry, Settings, Store } from "./types";
import { DEFAULT_STORE } from "./types";
import { isUuid, newId } from "./id";

function sb(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY."
    );
  }
  return supabase;
}

type DbEntry = {
  id: string;
  user_id: string;
  week_iso: string;
  week_start: string;
  wins: string[];
  metrics: { id: string; label: string; value: string }[];
  skills: string[];
  projects: string[];
  notes: string;
  created_at: string;
  updated_at: string;
};

type DbProfile = {
  user_id: string;
  name: string;
  friday_nudge: boolean;
  welcome_seen: boolean;
  updated_at: string;
};

function dbToEntry(row: DbEntry): Entry {
  return {
    id: row.id,
    weekISO: row.week_iso,
    weekStart: row.week_start,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    wins: Array.isArray(row.wins) ? row.wins : [],
    metrics: Array.isArray(row.metrics) ? row.metrics : [],
    skills: Array.isArray(row.skills) ? row.skills : [],
    projects: Array.isArray(row.projects) ? row.projects : [],
    notes: row.notes ?? "",
  };
}

function entryToDb(userId: string, e: Entry): Record<string, unknown> {
  const row: Record<string, unknown> = {
    user_id: userId,
    week_iso: e.weekISO,
    week_start: e.weekStart,
    wins: e.wins,
    metrics: e.metrics,
    skills: e.skills,
    projects: e.projects,
    notes: e.notes,
    updated_at: new Date().toISOString(),
  };
  // Postgres `entries.id` is UUID; omit invalid legacy client ids so DB assigns one.
  if (isUuid(e.id)) row.id = e.id;
  return row;
}

export async function fetchAllForUser(userId: string): Promise<Store> {
  const db = sb();
  const [profileRes, entriesRes] = await Promise.all([
    db
      .from("profiles")
      .select("user_id,name,friday_nudge,welcome_seen,updated_at")
      .eq("user_id", userId)
      .maybeSingle(),
    db
      .from("entries")
      .select(
        "id,user_id,week_iso,week_start,wins,metrics,skills,projects,notes,created_at,updated_at"
      )
      .eq("user_id", userId)
      .order("week_start", { ascending: false }),
  ]);

  if (profileRes.error) throw profileRes.error;
  if (entriesRes.error) throw entriesRes.error;

  const profile = (profileRes.data as DbProfile | null) ?? null;
  const settings: Settings = {
    name: profile?.name ?? "",
    fridayNudge: profile?.friday_nudge ?? false,
    welcomeSeen: profile?.welcome_seen ?? false,
  };

  return {
    version: 1,
    settings,
    entries: ((entriesRes.data ?? []) as DbEntry[]).map(dbToEntry),
  };
}

export async function upsertEntryCloud(userId: string, entry: Entry) {
  const { error } = await sb()
    .from("entries")
    .upsert(entryToDb(userId, entry), { onConflict: "user_id,week_iso" });
  if (error) throw error;
}

export async function deleteEntryCloud(userId: string, id: string) {
  const { error } = await sb()
    .from("entries")
    .delete()
    .eq("user_id", userId)
    .eq("id", id);
  if (error) throw error;
}

export async function updateProfileCloud(
  userId: string,
  patch: Partial<Settings>
) {
  const dbPatch: Record<string, unknown> = {};
  if (patch.name !== undefined) dbPatch.name = patch.name;
  if (patch.fridayNudge !== undefined) dbPatch.friday_nudge = patch.fridayNudge;
  if (patch.welcomeSeen !== undefined) dbPatch.welcome_seen = patch.welcomeSeen;
  dbPatch.updated_at = new Date().toISOString();

  const { error } = await sb()
    .from("profiles")
    .upsert({ user_id: userId, ...dbPatch }, { onConflict: "user_id" });
  if (error) throw error;
}

export async function bulkUploadEntries(userId: string, entries: Entry[]) {
  if (!entries.length) return;
  const fixed = entries.map((e) =>
    isUuid(e.id) ? e : { ...e, id: newId() }
  );
  const { error } = await sb()
    .from("entries")
    .upsert(
      fixed.map((e) => entryToDb(userId, e)),
      { onConflict: "user_id,week_iso" }
    );
  if (error) throw error;
}

export async function migrateLocalToCloud(
  userId: string,
  local: Store
): Promise<Store> {
  await updateProfileCloud(userId, local.settings);
  await bulkUploadEntries(userId, local.entries);
  const merged = await fetchAllForUser(userId);
  return merged;
}

export const _empty: Store = DEFAULT_STORE;
