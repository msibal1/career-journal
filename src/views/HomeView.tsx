import { useMemo, useState } from "react";
import { EntryForm } from "../components/EntryForm";
import { EntryCard } from "../components/EntryCard";
import { EmptyState } from "../components/EmptyState";
import { WelcomeCard } from "../components/WelcomeCard";
import { NamePrompt } from "../components/NamePrompt";
import type { Entry } from "../lib/types";
import { isoWeekId } from "../lib/date";
import { buildSampleEntry } from "../lib/sample";

type Props = {
  entries: Entry[];
  name: string;
  welcomeSeen: boolean;
  onSave: (entry: Entry) => void;
  onDelete: (id: string) => void;
  onGoTo: (view: string) => void;
  onSetName: (name: string) => void;
  onDismissWelcome: () => void;
};

export function HomeView({
  entries,
  name,
  welcomeSeen,
  onSave,
  onDelete,
  onGoTo,
  onSetName,
  onDismissWelcome,
}: Props) {
  const currentWeekId = useMemo(() => isoWeekId(new Date()), []);
  const currentWeekEntry = entries.find((e) => e.weekISO === currentWeekId);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editing = editingId
    ? entries.find((e) => e.id === editingId) ?? null
    : null;
  const recent = entries
    .filter((e) => e.weekISO !== currentWeekId && e.id !== editingId)
    .slice(0, 4);

  const showWelcome = !welcomeSeen && entries.length === 0;
  const showNamePrompt = welcomeSeen && !name && entries.length >= 1;

  function handleLoadSample() {
    onSave(buildSampleEntry());
    onDismissWelcome();
  }

  return (
    <>
      <div className="page-head">
        <h1>{name ? `Welcome back, ${name}.` : "Your career, in your own words."}</h1>
        <p>
          Five quiet minutes a week is enough to keep this useful. Log what you
          shipped, the numbers, and the skills you stretched.
        </p>
      </div>

      {showWelcome && (
        <WelcomeCard
          onDismiss={onDismissWelcome}
          onLoadSample={handleLoadSample}
        />
      )}

      {showNamePrompt && <NamePrompt onSave={onSetName} />}

      {editing ? (
        <EntryForm
          existing={editing}
          onSave={(entry) => {
            onSave(entry);
            setEditingId(null);
          }}
          onCancel={() => setEditingId(null)}
        />
      ) : (
        <EntryForm
          existing={currentWeekEntry}
          onSave={onSave}
          weekDate={new Date()}
        />
      )}

      {entries.length === 0 ? (
        <div style={{ marginTop: "2rem" }}>
          <EmptyState
            title="No entries yet"
            message="Once you save your first week, you'll see it here. Aim for one entry every Friday — most people do their best logging at the end of the week."
          />
        </div>
      ) : (
        recent.length > 0 && (
          <>
            <div className="section-divider">
              <h2>Recent weeks</h2>
              <button
                type="button"
                className="btn text small"
                onClick={() => onGoTo("archive")}
              >
                See all →
              </button>
            </div>
            {recent.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onEdit={(e) => setEditingId(e.id)}
                onDelete={onDelete}
              />
            ))}
          </>
        )
      )}
    </>
  );
}
