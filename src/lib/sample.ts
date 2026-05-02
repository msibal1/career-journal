import type { Entry } from "./types";
import { isoWeekId, weekStartMonday } from "./date";
import { newId } from "./id";

export function buildSampleEntry(): Entry {
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const start = weekStartMonday(lastWeek);
  const now = new Date().toISOString();
  return {
    id: newId(),
    weekISO: isoWeekId(start),
    weekStart: start.toISOString(),
    createdAt: now,
    updatedAt: now,
    wins: [
      "Shipped the onboarding redesign — activation rose 12% week-over-week.",
      "Mentored a new engineer through their first production deploy.",
      "Closed the partnership with Acme — projected $40K ARR in year one.",
    ],
    metrics: [
      { id: newId(), label: "Activation rate", value: "+12%" },
      { id: newId(), label: "Projected ARR contribution", value: "$40K" },
    ],
    skills: ["Stakeholder communication", "Technical mentoring"],
    projects: ["Onboarding v2", "Acme partnership"],
    notes:
      "Tough quarter on staffing — proud of how the team rallied. Lesson: front-load reviewer assignments earlier in the cycle.",
  };
}
