import { useMemo, useState } from "react";
import type { Entry } from "../lib/types";
import { buildExport, type ExportFormat } from "../lib/export";
import { CopyOutput } from "../components/CopyOutput";
import { EmptyState } from "../components/EmptyState";

type Props = {
  entries: Entry[];
};

const PRESETS: { id: string; label: string; days: number | "all" }[] = [
  { id: "30", label: "30 days" },
  { id: "90", label: "Quarter" },
  { id: "180", label: "6 months" },
  { id: "365", label: "Year" },
  { id: "all", label: "All time" },
].map((p) => ({
  ...p,
  days: p.id === "all" ? "all" : Number(p.id),
})) as { id: string; label: string; days: number | "all" }[];

const FORMATS: { id: ExportFormat; label: string; help: string }[] = [
  {
    id: "bullets",
    label: "Resume bullets",
    help: "One line per win — paste into a resume or CV.",
  },
  {
    id: "star",
    label: "STAR format",
    help: "Situation, Task, Action, Result — for interview prep.",
  },
  {
    id: "markdown",
    label: "Markdown",
    help: "Full export grouped by month — for archives or sharing.",
  },
];

export function ExportView({ entries }: Props) {
  const [preset, setPreset] = useState<string>("90");
  const [format, setFormat] = useState<ExportFormat>("bullets");

  const fromIso = useMemo(() => {
    const def = PRESETS.find((p) => p.id === preset)!;
    if (def.days === "all") return undefined;
    const d = new Date();
    d.setDate(d.getDate() - (def.days as number));
    return d.toISOString();
  }, [preset]);

  const output = useMemo(
    () => buildExport(entries, { format, fromIso }),
    [entries, format, fromIso]
  );

  return (
    <>
      <div className="page-head">
        <h1>Export</h1>
        <p>
          Pull your wins into the format you need — resume bullets, interview
          stories, or full markdown.
        </p>
      </div>

      {entries.length === 0 ? (
        <EmptyState
          title="Nothing to export yet"
          message="Add entries first; come back when you have at least a few weeks logged."
        />
      ) : (
        <div className="output-row">
          <div className="output-controls">
            <div className="card">
              <p className="card-eyebrow">Range</p>
              <div className="preset-row">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={p.id === preset ? "active" : ""}
                    onClick={() => setPreset(p.id)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="card" style={{ marginTop: "1rem" }}>
              <p className="card-eyebrow">Format</p>
              <div
                className="spaced"
                style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
              >
                {FORMATS.map((f) => (
                  <label
                    key={f.id}
                    className="toggle"
                    style={{ alignItems: "flex-start" }}
                  >
                    <input
                      type="radio"
                      name="format"
                      checked={format === f.id}
                      onChange={() => setFormat(f.id)}
                    />
                    <span style={{ flex: 1 }}>
                      <span style={{ fontWeight: 600 }}>{f.label}</span>
                      <br />
                      <span className="muted" style={{ fontSize: "0.85rem" }}>
                        {f.help}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <CopyOutput text={output} />
        </div>
      )}
    </>
  );
}
