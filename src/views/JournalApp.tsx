import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useStore } from "../lib/storage";
import { HomeView } from "./HomeView";
import { ArchiveView } from "./ArchiveView";
import { ReviewView } from "./ReviewView";
import { ExportView } from "./ExportView";
import { SettingsView } from "./SettingsView";

export type ViewId = "home" | "archive" | "review" | "export" | "settings";

const NAV: { id: ViewId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "archive", label: "Archive" },
  { id: "review", label: "Review" },
  { id: "export", label: "Export" },
  { id: "settings", label: "Settings" },
];

function getInitialView(): ViewId {
  if (typeof window === "undefined") return "home";
  const hash = window.location.hash.slice(1) as ViewId;
  return NAV.some((n) => n.id === hash) ? hash : "home";
}

type Props = {
  user: User;
  signOut: () => void;
};

export function JournalApp({ user, signOut }: Props) {
  const {
    store,
    syncState,
    syncError,
    upsertEntry,
    deleteEntry,
    updateSettings,
    replaceStore,
    resetStore,
  } = useStore(user.id);

  const [view, setView] = useState<ViewId>(getInitialView);

  useEffect(() => {
    window.location.hash = view;
  }, [view]);

  useEffect(() => {
    function onHashChange() {
      const next = window.location.hash.slice(1) as ViewId;
      if (NAV.some((n) => n.id === next)) setView(next);
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const fridayPrompt = useMemo(() => {
    if (!store.settings.fridayNudge) return null;
    const today = new Date().getDay();
    if (today !== 5) return null;
    const todayWeekStart = new Date();
    todayWeekStart.setDate(todayWeekStart.getDate() - ((today + 6) % 7));
    todayWeekStart.setHours(0, 0, 0, 0);
    const hasThisWeek = store.entries.some(
      (e) =>
        new Date(e.weekStart).toDateString() === todayWeekStart.toDateString()
    );
    if (hasThisWeek) return null;
    return "It's Friday — five minutes is enough to keep this useful.";
  }, [store.entries, store.settings.fridayNudge]);

  return (
    <div className="app app--journal">
      <header className="app-header">
        <div className="wrap app-header-inner">
          <a className="brand" href="#home" onClick={() => setView("home")}>
            <span className="brand-mark" aria-hidden="true" />
            Tenure Trail
          </a>
          <nav className="app-nav" aria-label="Primary">
            {NAV.map((n) => (
              <button
                key={n.id}
                className={view === n.id ? "active" : ""}
                onClick={() => setView(n.id)}
              >
                {n.label}
              </button>
            ))}
          </nav>
          <span
            className="muted"
            title={user.email ?? ""}
            style={{
              maxWidth: 180,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: "0.85rem",
            }}
          >
            {user.email}
          </span>
        </div>
      </header>

      <main>
        <div className="wrap">
          {syncError && (
            <div
              className="card-soft"
              style={{
                marginBottom: "1rem",
                background: "rgba(179, 73, 47, 0.08)",
                border: "1px solid rgba(179, 73, 47, 0.25)",
                color: "var(--danger)",
                fontSize: "0.92rem",
              }}
            >
              <strong>Couldn&apos;t sync:</strong> {syncError}. Your edits are in this
              session — try again or refresh.
            </div>
          )}

          {fridayPrompt && (
            <div className="card-soft" style={{ marginBottom: "1.25rem" }}>
              <strong>Friday nudge — </strong>
              <span className="muted">{fridayPrompt}</span>
            </div>
          )}

          {view === "home" && (
            <HomeView
              entries={store.entries}
              name={store.settings.name}
              welcomeSeen={store.settings.welcomeSeen}
              onSave={upsertEntry}
              onDelete={deleteEntry}
              onGoTo={(v) => setView(v as ViewId)}
              onSetName={(name) => updateSettings({ name })}
              onDismissWelcome={() => updateSettings({ welcomeSeen: true })}
            />
          )}
          {view === "archive" && (
            <ArchiveView
              entries={store.entries}
              onSave={upsertEntry}
              onDelete={deleteEntry}
            />
          )}
          {view === "review" && (
            <ReviewView entries={store.entries} name={store.settings.name} />
          )}
          {view === "export" && <ExportView entries={store.entries} />}
          {view === "settings" && (
            <SettingsView
              store={store}
              onUpdateSettings={updateSettings}
              onReplace={replaceStore}
              onReset={resetStore}
              user={user}
              onSignOut={signOut}
            />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="wrap">
          <span>
            Tenure Trail · {store.entries.length}{" "}
            {store.entries.length === 1 ? "entry" : "entries"} synced to your account
          </span>
          <span className="muted">
            {syncState === "loading" && "Loading…"}
            {syncState === "syncing" && "Syncing…"}
            {syncState === "idle" && "v0.3"}
          </span>
        </div>
      </footer>
    </div>
  );
}
