import { useEffect, useMemo, useState } from "react";
import type { Entry, Metric } from "../lib/types";
import { TagInput } from "./TagInput";
import {
  formatWeekRange,
  isoWeekId,
  weekStartMonday,
} from "../lib/date";
import { newId } from "../lib/id";

type Props = {
  existing?: Entry;
  onSave: (entry: Entry) => void;
  onCancel?: () => void;
  weekDate?: Date;
};

function blankEntry(weekDate: Date): Entry {
  const weekStart = weekStartMonday(weekDate);
  const now = new Date().toISOString();
  return {
    id: newId(),
    weekISO: isoWeekId(weekStart),
    weekStart: weekStart.toISOString(),
    createdAt: now,
    updatedAt: now,
    wins: [""],
    metrics: [],
    skills: [],
    projects: [],
    notes: "",
  };
}

export function EntryForm({ existing, onSave, onCancel, weekDate }: Props) {
  const [draft, setDraft] = useState<Entry>(() =>
    existing
      ? {
          ...existing,
          wins: existing.wins.length ? existing.wins : [""],
        }
      : blankEntry(weekDate ?? new Date())
  );
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (existing) {
      setDraft({ ...existing, wins: existing.wins.length ? existing.wins : [""] });
    }
  }, [existing?.id]);

  const weekLabel = useMemo(
    () => formatWeekRange(draft.weekStart),
    [draft.weekStart]
  );

  function update<K extends keyof Entry>(key: K, value: Entry[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function setWin(index: number, value: string) {
    const next = [...draft.wins];
    next[index] = value;
    update("wins", next);
  }

  function addWin() {
    update("wins", [...draft.wins, ""]);
  }

  function removeWin(index: number) {
    if (draft.wins.length === 1) {
      update("wins", [""]);
      return;
    }
    update(
      "wins",
      draft.wins.filter((_, i) => i !== index)
    );
  }

  function setMetric(id: string, patch: Partial<Metric>) {
    update(
      "metrics",
      draft.metrics.map((m) => (m.id === id ? { ...m, ...patch } : m))
    );
  }

  function addMetric() {
    update("metrics", [
      ...draft.metrics,
      { id: newId(), label: "", value: "" },
    ]);
  }

  function removeMetric(id: string) {
    update(
      "metrics",
      draft.metrics.filter((m) => m.id !== id)
    );
  }

  function handleSave() {
    const cleaned: Entry = {
      ...draft,
      wins: draft.wins.map((w) => w.trim()).filter(Boolean),
      metrics: draft.metrics.filter((m) => m.label.trim() && m.value.trim()),
      skills: draft.skills.filter(Boolean),
      projects: draft.projects.filter(Boolean),
      notes: draft.notes.trim(),
      updatedAt: new Date().toISOString(),
    };
    onSave(cleaned);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1800);
  }

  const hasContent =
    draft.wins.some((w) => w.trim()) ||
    draft.metrics.length > 0 ||
    draft.skills.length > 0 ||
    draft.projects.length > 0 ||
    draft.notes.trim();

  return (
    <section className="card composer" aria-label="Weekly entry composer">
      <p className="card-eyebrow">{existing ? "Edit week" : "This week"}</p>
      <h2>{weekLabel}</h2>
      <p className="composer-week">
        Capture the work — small or large. Future-you will thank present-you when
        review season comes.
      </p>

      <div className="composer-section">
        <div className="composer-section-head">
          <h3>Wins</h3>
          <span className="hint">One per line. Action verb + outcome.</span>
        </div>
        <div className="bullet-rows">
          {draft.wins.map((w, i) => (
            <div className="bullet-row" key={i}>
              <span className="dot" aria-hidden="true">
                •
              </span>
              <textarea
                value={w}
                onChange={(e) => setWin(i, e.target.value)}
                rows={1}
                placeholder='e.g., "Shipped the onboarding redesign; activation rose 12%."'
              />
              <button
                type="button"
                className="remove"
                aria-label="Remove win"
                onClick={() => removeWin(i)}
                title="Remove"
              >
                −
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="add-row" onClick={addWin}>
          + Add another win
        </button>
      </div>

      <div className="composer-section">
        <div className="composer-section-head">
          <h3>Metrics</h3>
          <span className="hint">
            Numbers make every story land. Use whatever you have.
          </span>
        </div>
        <div className="metric-rows">
          {draft.metrics.map((m) => (
            <div className="metric-row" key={m.id}>
              <input
                placeholder="Metric label (e.g., Activation rate)"
                value={m.label}
                onChange={(e) => setMetric(m.id, { label: e.target.value })}
              />
              <input
                placeholder="Value (e.g., +12% / $45K / 3.2x)"
                value={m.value}
                onChange={(e) => setMetric(m.id, { value: e.target.value })}
              />
              <button
                type="button"
                className="remove"
                aria-label="Remove metric"
                onClick={() => removeMetric(m.id)}
                title="Remove"
              >
                −
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="add-row" onClick={addMetric}>
          + Add a metric
        </button>
      </div>

      <div className="composer-section">
        <div className="composer-section-head">
          <h3>Skills strengthened</h3>
          <span className="hint">Tag — Enter to add.</span>
        </div>
        <TagInput
          values={draft.skills}
          onChange={(next) => update("skills", next)}
          placeholder="e.g., Public speaking, SQL, Stakeholder management"
        />
      </div>

      <div className="composer-section">
        <div className="composer-section-head">
          <h3>Projects</h3>
          <span className="hint">Tag any projects you touched.</span>
        </div>
        <TagInput
          values={draft.projects}
          onChange={(next) => update("projects", next)}
          placeholder="e.g., Q2 launch, Migration, Partnership XYZ"
        />
      </div>

      <div className="composer-section">
        <div className="composer-section-head">
          <h3>Notes</h3>
          <span className="hint">
            Lessons, blockers, gratitude — anything for context.
          </span>
        </div>
        <textarea
          value={draft.notes}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="What was the context for this week? What did you learn?"
          style={{
            width: "100%",
            minHeight: 80,
            padding: "0.75rem 0.85rem",
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--surface)",
            font: "inherit",
            lineHeight: 1.5,
            resize: "vertical",
          }}
        />
      </div>

      <div className="composer-actions">
        {savedFlash && <span className="saved-note">Saved ✓</span>}
        {onCancel && (
          <button type="button" className="btn ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button
          type="button"
          className="btn primary"
          onClick={handleSave}
          disabled={!hasContent}
        >
          {existing ? "Save changes" : "Save this week"}
        </button>
      </div>
    </section>
  );
}
