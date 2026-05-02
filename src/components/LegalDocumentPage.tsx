import { useEffect, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";

const SITE = "https://tenuretrail.com";

type Props = {
  title: string;
  metaDescription: string;
  canonicalPath: "/privacy" | "/terms";
  children: ReactNode;
  user: User | null;
  onSignIn: () => void;
  configured: boolean;
};

export function LegalDocumentPage({
  title,
  metaDescription,
  canonicalPath,
  children,
  user,
  onSignIn,
  configured,
}: Props) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} | Tenure Trail`;

    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute("content") ?? "";
    metaDesc?.setAttribute("content", metaDescription);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${SITE}${canonicalPath}`);

    return () => {
      document.title = prevTitle;
      metaDesc?.setAttribute("content", prevDesc);
      canonical?.setAttribute("href", `${SITE}/`);
    };
  }, [title, metaDescription, canonicalPath]);

  return (
    <div className="landing blog-page">
      <header className="landing-header">
        <div className="wrap landing-header-inner blog-header-row">
          <a href="/" className="landing-brand landing-brand--link">
            <span className="brand-mark" aria-hidden="true" />
            Tenure Trail
          </a>
          <nav className="blog-header-actions" aria-label="Site">
            <a href="/" className="btn text small">
              Home
            </a>
            <a href="/blog" className="btn text small">
              Blog
            </a>
            {user ? (
              <a href="/" className="btn primary small">
                Open app
              </a>
            ) : (
              <button
                type="button"
                className="btn ghost small"
                onClick={onSignIn}
                disabled={!configured}
              >
                Sign in
              </button>
            )}
          </nav>
        </div>
      </header>

      <article className="blog-article legal-doc wrap">
        <h1 className="blog-title">{title}</h1>
        <p className="blog-meta muted legal-doc-updated">
          Last updated: May 2026 · These documents are provided as general information,
          not legal advice. Have them reviewed by counsel for your situation.
        </p>
        <div className="legal-doc-body">{children}</div>
      </article>

      <footer className="landing-footer">
        <div className="wrap landing-footer-inner landing-footer-stack">
          <div className="landing-footer-links">
            <a href="/privacy">Privacy</a>
            <span aria-hidden="true"> · </span>
            <a href="/terms">Terms</a>
            <span aria-hidden="true"> · </span>
            <a href="/blog">Blog</a>
          </div>
          <span className="muted">
            Tenure Trail is an educational tool, not legal or career advice.
          </span>
        </div>
      </footer>
    </div>
  );
}
