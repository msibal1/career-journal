import { useMemo, useState } from "react";
import type { Entry } from "../lib/types";
import { buildExport } from "../lib/export";
import { CopyOutput } from "../components/CopyOutput";
import { EmptyState } from "../components/EmptyState";

type Props = {
  entries: Entry[];
  name: string;
};

const PRESETS: { id: string; label: string; days: number | "all" }[] = [
  { id: "30", label: "Last 30 days", days: 30 },
  { id: "90", label: "Last quarter", days: 90 },
  { id: "180", label: "Last 6 months", days: 180 },
  { id: "365", label: "Last year", days: 365 },
  { id: "all", label: "All time", days: "all" },
];

export function ReviewView({ entries, name }: Props) {
  const [preset, setPreset] = useState<string>("90");

  const fromIso = useMemo(() => {
    const def = PRESETS.find((p) => p.id === preset)!;
    if (def.days === "all") return undefined;
    const d = new Date();
    d.setDate(d.getDate() - (def.days as number));
    return d.toISOString();
  }, [preset]);

  const output = useMemo(
    () =>
      buildExport(entries, {
        format: "selfreview",
        fromIso,
        name: name || undefined,
      }),
    [entries, fromIso, name]
  );

  return (
    <>
      <div className="page-head">
        <h1>Review draft</h1>
        <p>
          A starting point — not a finished review. Edit freely, then paste into
          your performance review or LinkedIn recap.
        </p>
      </div>

      {entries.length === 0 ? (
        <EmptyState
          title="No entries to summarize yet"
          message="Add a few weekly entries before generating a review draft."
        />
      ) : (
        <>
          <div className="card">
            <p className="card-eyebrow">Period</p>
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

          <div style={{ marginTop: "1rem" }}>
            <CopyOutput text={output} />
          </div>
        </>
      )}
    </>
  );
}
