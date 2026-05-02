import { useMemo, useState } from "react";
import type { Entry } from "../lib/types";
import { EntryCard } from "../components/EntryCard";
import { EntryForm } from "../components/EntryForm";
import { EmptyState } from "../components/EmptyState";
import { formatMonth } from "../lib/date";

type Props = {
  entries: Entry[];
  onSave: (entry: Entry) => void;
  onDelete: (id: string) => void;
};

export function ArchiveView({ entries, onSave, onDelete }: Props) {
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => {
      const haystack = [
        ...e.wins,
        e.notes,
        ...e.skills,
        ...e.projects,
        ...e.metrics.map((m) => `${m.label} ${m.value}`),
      ]
        .join(" \n ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [entries, query]);

  const grouped = useMemo(() => groupByMonth(filtered), [filtered]);
  const editing = editingId
    ? entries.find((e) => e.id === editingId) ?? null
    : null;

  return (
    <>
      <div className="page-head">
        <h1>Archive</h1>
        <p>Every week you've logged, searchable.</p>
      </div>

      {editing && (
        <div style={{ marginBottom: "1.5rem" }}>
          <EntryForm
            existing={editing}
            onSave={(entry) => {
              onSave(entry);
              setEditingId(null);
            }}
            onCancel={() => setEditingId(null)}
          />
        </div>
      )}

      <div className="search">
        <input
          placeholder="Search wins, skills, projects, notes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {entries.length === 0 ? (
        <EmptyState
          title="Nothing logged yet"
          message="Save your first weekly entry from the Home tab and it will show up here."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No matches"
          message={`Nothing in the archive matches "${query}".`}
        />
      ) : (
        grouped.map(([month, group]) => (
          <section key={month} style={{ marginBottom: "2rem" }}>
            <div className="section-divider">
              <h2>{month}</h2>
              <span className="meta">
                {group.length} {group.length === 1 ? "entry" : "entries"}
              </span>
            </div>
            {group.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onEdit={(e) => setEditingId(e.id)}
                onDelete={onDelete}
              />
            ))}
          </section>
        ))
      )}
    </>
  );
}

function groupByMonth(entries: Entry[]): [string, Entry[]][] {
  const map = new Map<string, Entry[]>();
  for (const e of entries) {
    const k = formatMonth(e.weekStart);
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(e);
  }
  return [...map.entries()];
}
