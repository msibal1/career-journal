import { useRef } from "react";
import type { User } from "@supabase/supabase-js";
import type { Settings, Store } from "../lib/types";
import { supabaseConfigured } from "../lib/supabase";

type Props = {
  store: Store;
  onUpdateSettings: (patch: Partial<Settings>) => void;
  onReplace: (next: Store) => void;
  onReset: () => void;
  user: User | null;
  onSignIn?: () => void;
  onSignOut: () => void;
};

export function SettingsView({
  store,
  onUpdateSettings,
  onReplace,
  onReset,
  user,
  onSignIn,
  onSignOut,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  function exportData() {
    const blob = new Blob([JSON.stringify(store, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tenure-trail-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    window.setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 800);
  }

  function pickImport() {
    fileRef.current?.click();
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!parsed || parsed.version !== 1)
          throw new Error("Unrecognized format");
        if (!Array.isArray(parsed.entries))
          throw new Error("Missing entries array");
        if (!confirm("Replace your current data with this file?")) return;
        onReplace(parsed);
        alert("Import complete.");
      } catch (err) {
        alert(`Import failed: ${(err as Error).message}`);
      } finally {
        if (fileRef.current) fileRef.current.value = "";
      }
    };
    reader.readAsText(file);
  }

  function reset() {
    if (
      !confirm(
        "Erase all entries and settings? This cannot be undone unless you exported first."
      )
    )
      return;
    onReset();
  }

  return (
    <>
      <div className="page-head">
        <h1>Settings</h1>
        <p>
          {user
            ? "Your data is synced to your account across every device you sign in on."
            : "Your data lives in this browser only — sign in to sync across devices."}
        </p>
      </div>

      {supabaseConfigured && (user || onSignIn) && (
        <div className="card settings-group">
          <h3>Account</h3>
          {user ? (
            <>
              <p className="field-help" style={{ marginBottom: "0.85rem" }}>
                Signed in as <strong>{user.email}</strong>
              </p>
              <button type="button" className="btn ghost" onClick={onSignOut}>
                Sign out
              </button>
            </>
          ) : (
            onSignIn && (
              <>
                <p className="field-help" style={{ marginBottom: "0.85rem" }}>
                  Sign in with a magic link to back up your journal and use it
                  from any device.
                </p>
                <button type="button" className="btn primary" onClick={onSignIn}>
                  Sign in with email
                </button>
              </>
            )
          )}
        </div>
      )}

      <div className="card settings-group">
        <h3>Profile</h3>
        <div className="field">
          <label htmlFor="name">Your name</label>
          <input
            id="name"
            value={store.settings.name}
            placeholder="What should we call you?"
            onChange={(e) => onUpdateSettings({ name: e.target.value })}
          />
          <p className="field-help">
            Used to greet you on the home page and in your review draft.
          </p>
        </div>

        <label className="toggle">
          <input
            type="checkbox"
            checked={store.settings.fridayNudge}
            onChange={(e) =>
              onUpdateSettings({ fridayNudge: e.target.checked })
            }
          />
          <span>
            <span style={{ fontWeight: 600 }}>Friday nudge</span>
            <br />
            <span className="muted" style={{ fontSize: "0.85rem" }}>
              Show a gentle reminder on Fridays when you open the app.
            </span>
          </span>
        </label>
      </div>

      <div className="card settings-group">
        <h3>Your data</h3>
        <p className="field-help" style={{ marginBottom: "1rem" }}>
          {user
            ? "Your entries live in your account database. Exporting still works for offline backups."
            : "Entries are stored in this browser's localStorage. Export regularly so you don't lose them."}
        </p>
        <div className="row">
          <button type="button" className="btn primary" onClick={exportData}>
            Export JSON backup
          </button>
          <button type="button" className="btn ghost" onClick={pickImport}>
            Import from JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            onChange={handleImport}
            style={{ display: "none" }}
          />
        </div>
        <div style={{ marginTop: "1.25rem" }}>
          <button type="button" className="btn danger" onClick={reset}>
            Erase all data
          </button>
        </div>
      </div>

      <p className="muted" style={{ fontSize: "0.85rem" }}>
        Tenure Trail is a tool for reflection. It is not a substitute for
        professional career, financial, or legal advice.
      </p>
    </>
  );
}
