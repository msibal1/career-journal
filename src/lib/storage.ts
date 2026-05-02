import { useEffect, useState, useCallback, useRef } from "react";
import type { Entry, Settings, Store } from "./types";
import { DEFAULT_STORE } from "./types";
import {
  fetchAllForUser,
  upsertEntryCloud,
  deleteEntryCloud,
  updateProfileCloud,
  migrateLocalToCloud,
} from "./cloud";
import { isUuid, newId } from "./id";

const KEY = "career-journal/v1";

function loadLocal(): Store {
  if (typeof window === "undefined") return DEFAULT_STORE;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STORE;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== 1) return DEFAULT_STORE;
    return {
      version: 1,
      settings: { ...DEFAULT_STORE.settings, ...(parsed.settings ?? {}) },
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
    };
  } catch {
    return DEFAULT_STORE;
  }
}

function clearLocal() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

type SyncState = "idle" | "loading" | "syncing" | "error";

export function useStore(userId: string | null) {
  const [store, setStore] = useState<Store>(() => DEFAULT_STORE);
  const [syncState, setSyncState] = useState<SyncState>("idle");
  const [syncError, setSyncError] = useState<string | null>(null);
  const lastUserId = useRef<string | null>(null);

  // When user signs in / out: load the right data
  useEffect(() => {
    if (lastUserId.current === userId) return;

    if (!userId) {
      lastUserId.current = null;
      setStore(DEFAULT_STORE);
      setSyncState("idle");
      return;
    }

    lastUserId.current = userId;
    setSyncState("loading");
    setSyncError(null);

    (async () => {
      try {
        let cloud = await fetchAllForUser(userId);
        const local = loadLocal();
        const cloudIsEmpty =
          cloud.entries.length === 0 &&
          !cloud.settings.name &&
          !cloud.settings.welcomeSeen;
        const localHasContent =
          local.entries.length > 0 ||
          local.settings.name ||
          local.settings.welcomeSeen;

        if (cloudIsEmpty && localHasContent) {
          cloud = await migrateLocalToCloud(userId, local);
          // Once migrated, clear local so future anonymous mode starts fresh
          clearLocal();
        }
        setStore(cloud);
        setSyncState("idle");
      } catch (err) {
        setSyncError((err as Error).message);
        setSyncState("error");
      }
    })();
  }, [userId]);

  const upsertEntry = useCallback(
    (entry: Entry) => {
      const finalized: Entry = {
        ...entry,
        updatedAt: new Date().toISOString(),
      };
      const toSave: Entry =
        userId && !isUuid(finalized.id)
          ? { ...finalized, id: newId() }
          : finalized;
      setStore((prev) => {
        const entries = prev.entries
          .filter((e) => e.weekISO !== toSave.weekISO)
          .concat([toSave])
          .sort((a, b) => (a.weekStart < b.weekStart ? 1 : -1));
        return { ...prev, entries };
      });

      if (userId) {
        setSyncState("syncing");
        upsertEntryCloud(userId, toSave)
          .then(() => {
            setSyncError(null);
            setSyncState("idle");
          })
          .catch((err) => {
            setSyncError((err as Error).message);
            setSyncState("error");
          });
      }
    },
    [userId]
  );

  const deleteEntry = useCallback(
    (id: string) => {
      setStore((prev) => ({
        ...prev,
        entries: prev.entries.filter((e) => e.id !== id),
      }));

      if (userId) {
        setSyncState("syncing");
        deleteEntryCloud(userId, id)
          .then(() => {
            setSyncError(null);
            setSyncState("idle");
          })
          .catch((err) => {
            setSyncError((err as Error).message);
            setSyncState("error");
          });
      }
    },
    [userId]
  );

  const updateSettings = useCallback(
    (patch: Partial<Settings>) => {
      setStore((prev) => ({
        ...prev,
        settings: { ...prev.settings, ...patch },
      }));

      if (userId) {
        setSyncState("syncing");
        updateProfileCloud(userId, patch)
          .then(() => {
            setSyncError(null);
            setSyncState("idle");
          })
          .catch((err) => {
            setSyncError((err as Error).message);
            setSyncState("error");
          });
      }
    },
    [userId]
  );

  const replaceStore = useCallback(
    (next: Store) => {
      const merged = { ...DEFAULT_STORE, ...next, version: 1 as const };
      setStore(merged);
      if (userId) {
        setSyncState("syncing");
        (async () => {
          try {
            await migrateLocalToCloud(userId, merged);
            setSyncError(null);
            setSyncState("idle");
          } catch (err) {
            setSyncError((err as Error).message);
            setSyncState("error");
          }
        })();
      }
    },
    [userId]
  );

  const resetStore = useCallback(() => {
    if (userId) {
      const previous = store.entries.map((e) => e.id);
      setStore(DEFAULT_STORE);
      setSyncState("syncing");
      (async () => {
        try {
          await Promise.all(
            previous.map((id) => deleteEntryCloud(userId, id))
          );
          await updateProfileCloud(userId, {
            name: "",
            fridayNudge: false,
            welcomeSeen: false,
          });
          setSyncError(null);
          setSyncState("idle");
        } catch (err) {
          setSyncError((err as Error).message);
          setSyncState("error");
        }
      })();
    } else {
      setStore(DEFAULT_STORE);
      clearLocal();
    }
  }, [userId, store.entries]);

  return {
    store,
    syncState,
    syncError,
    upsertEntry,
    deleteEntry,
    updateSettings,
    replaceStore,
    resetStore,
  };
}
