/** URL paths that render marketing/legal SPA routes (not hash journal routes). */
export type MarketingPath = "blog" | "privacy" | "terms";

export function getMarketingPath(): MarketingPath | null {
  if (typeof window === "undefined") return null;
  const p = window.location.pathname.replace(/\/$/, "") || "/";
  if (p === "/blog") return "blog";
  if (p === "/privacy") return "privacy";
  if (p === "/terms") return "terms";
  return null;
}
