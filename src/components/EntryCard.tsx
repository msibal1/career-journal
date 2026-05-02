import type { Entry } from "../lib/types";
import { formatRelative, formatWeekRange } from "../lib/date";

type Props = {
  entry: Entry;
  onEdit?: (entry: Entry) => void;
  onDelete?: (id: string) => void;
};

export function EntryCard({ entry, onEdit, onDelete }: Props) {
  return (
    <article className="entry-card">
      <header className="entry-card-head">
        <h3>{formatWeekRange(entry.weekStart)}</h3>
        <span className="meta">Updated {formatRelative(entry.updatedAt)}</span>
      </header>

      {entry.wins.length > 0 && (
        <section>
          <p className="section-label">Wins</p>
          <ul>
            {entry.wins.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </section>
      )}

      {entry.metrics.length > 0 && (
        <section>
          <p className="section-label">Metrics</p>
          <ul className="metrics">
            {entry.metrics.map((m) => (
              <li key={m.id} className="metric-pill">
                <span>{m.label}</span>
                <strong>{m.value}</strong>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(entry.skills.length > 0 || entry.projects.length > 0) && (
        <section>
          <div className="tags">
            {entry.projects.map((p) => (
              <span key={`p-${p}`} className="tag">
                {p}
              </span>
            ))}
            {entry.skills.map((s) => (
              <span key={`s-${s}`} className="tag">
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {entry.notes && (
        <section>
          <p className="section-label">Notes</p>
          <p className="muted" style={{ margin: 0 }}>
            {entry.notes}
          </p>
        </section>
      )}

      {(onEdit || onDelete) && (
        <div className="entry-card-actions">
          {onEdit && (
            <button
              type="button"
              className="btn text small"
              onClick={() => onEdit(entry)}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="btn text small"
              onClick={() => {
                if (confirm("Delete this week's entry?")) onDelete(entry.id);
              }}
              style={{ color: "var(--danger)" }}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </article>
  );
}
