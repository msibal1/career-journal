import type { Entry } from "./types";
import { formatMonth, formatWeekRange } from "./date";

function within(entry: Entry, fromIso?: string, toIso?: string): boolean {
  if (fromIso && entry.weekStart < fromIso) return false;
  if (toIso && entry.weekStart > toIso) return false;
  return true;
}

export type ExportFormat = "bullets" | "star" | "markdown" | "selfreview";

export type ExportOptions = {
  fromIso?: string;
  toIso?: string;
  format: ExportFormat;
  name?: string;
};

export function buildExport(entries: Entry[], opts: ExportOptions): string {
  const filtered = entries
    .filter((e) => within(e, opts.fromIso, opts.toIso))
    .slice()
    .sort((a, b) => (a.weekStart < b.weekStart ? -1 : 1));

  switch (opts.format) {
    case "bullets":
      return renderBullets(filtered);
    case "star":
      return renderStar(filtered);
    case "markdown":
      return renderMarkdown(filtered);
    case "selfreview":
      return renderSelfReview(filtered, opts.name);
  }
}

function renderBullets(entries: Entry[]): string {
  const lines: string[] = [];
  for (const e of entries) {
    for (const w of e.wins) {
      lines.push(`- ${w.replace(/\.$/, "")}.`);
    }
  }
  return lines.length ? lines.join("\n") : "(No wins logged in this range yet.)";
}

function renderStar(entries: Entry[]): string {
  const blocks: string[] = [];
  for (const e of entries) {
    for (const w of e.wins) {
      blocks.push(
        [
          `WIN — ${formatWeekRange(e.weekStart)}`,
          `Situation: ${e.notes ? truncate(e.notes, 140) : "[Add the context that made this win matter]"}`,
          `Task: [What were you responsible for?]`,
          `Action: ${w}`,
          `Result: ${guessResult(w, e)}`,
        ].join("\n")
      );
    }
  }
  return blocks.length
    ? blocks.join("\n\n---\n\n")
    : "(No wins logged in this range yet.)";
}

function renderMarkdown(entries: Entry[]): string {
  if (!entries.length) return "_No entries in this range yet._";
  const out: string[] = ["# Tenure Trail export", ""];
  const months = groupByMonth(entries);
  for (const [month, group] of months) {
    out.push(`## ${month}`, "");
    for (const e of group) {
      out.push(`### ${formatWeekRange(e.weekStart)}`, "");
      if (e.wins.length) {
        out.push("**Wins**", "");
        for (const w of e.wins) out.push(`- ${w}`);
        out.push("");
      }
      if (e.metrics.length) {
        out.push("**Metrics**", "");
        for (const m of e.metrics) out.push(`- ${m.label}: **${m.value}**`);
        out.push("");
      }
      if (e.skills.length) {
        out.push(`**Skills:** ${e.skills.join(", ")}`, "");
      }
      if (e.projects.length) {
        out.push(`**Projects:** ${e.projects.join(", ")}`, "");
      }
      if (e.notes) {
        out.push("**Notes**", "", e.notes, "");
      }
    }
  }
  return out.join("\n");
}

function renderSelfReview(entries: Entry[], name?: string): string {
  if (!entries.length) {
    return "_No entries in this range yet — add a few weeks before generating a review._";
  }
  const wins = entries.flatMap((e) => e.wins);
  const metrics = entries.flatMap((e) => e.metrics);
  const skills = uniq(entries.flatMap((e) => e.skills));
  const projects = uniq(entries.flatMap((e) => e.projects));
  const range = `${formatWeekRange(entries[0].weekStart)} – ${formatWeekRange(
    entries[entries.length - 1].weekStart
  )}`;

  const lines: string[] = [];
  lines.push(`# Self-Review Draft`);
  lines.push(`**Period:** ${range}`);
  if (name) lines.push(`**By:** ${name}`);
  lines.push("");
  lines.push(`## Summary`);
  lines.push(
    `Across this period I delivered ${wins.length} tracked wins across ${projects.length || "multiple"} projects, ` +
      `with measurable outcomes${metrics.length ? ` (${metrics.length} tracked metrics)` : ""}. ` +
      `Below is a structured view of what I shipped, the impact, and what I'm taking forward.`
  );
  lines.push("");

  if (projects.length) {
    lines.push(`## Projects`);
    for (const p of projects) lines.push(`- ${p}`);
    lines.push("");
  }

  lines.push(`## Highlight wins`);
  for (const w of wins.slice(0, 12)) lines.push(`- ${w}`);
  if (wins.length > 12) lines.push(`- _…and ${wins.length - 12} more_`);
  lines.push("");

  if (metrics.length) {
    lines.push(`## Measurable impact`);
    for (const m of metrics) lines.push(`- **${m.label}:** ${m.value}`);
    lines.push("");
  }

  if (skills.length) {
    lines.push(`## Skills strengthened`);
    lines.push(skills.join(", "));
    lines.push("");
  }

  lines.push(`## What I'm taking into next period`);
  lines.push(`- [Edit: pick the 1–3 themes you want to double down on]`);
  lines.push(`- [Edit: a stretch goal worth pursuing]`);
  lines.push(`- [Edit: a skill you'll deepen]`);
  return lines.join("\n");
}

function groupByMonth(entries: Entry[]): [string, Entry[]][] {
  const map = new Map<string, Entry[]>();
  for (const e of entries) {
    const key = formatMonth(e.weekStart);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(e);
  }
  return [...map.entries()];
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function guessResult(win: string, entry: Entry): string {
  const numberMatch = win.match(/(\d+(?:\.\d+)?%?|\$[\d,]+)/);
  if (numberMatch) {
    return `Quantified above: ${numberMatch[0]}.`;
  }
  if (entry.metrics.length) {
    const m = entry.metrics[0];
    return `Tied to outcome: ${m.label} = ${m.value}.`;
  }
  return "[Add the measurable outcome — number, %, dollars, time saved.]";
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}
