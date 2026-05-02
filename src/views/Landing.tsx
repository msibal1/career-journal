type Props = {
  onGetStarted: () => void;
  configured: boolean;
};

export function Landing({ onGetStarted, configured }: Props) {
  return (
    <div className="landing">
      <header className="landing-header">
        <div className="wrap landing-header-inner">
          <span className="landing-brand">
            <span className="brand-mark" aria-hidden="true" />
            Tenure Trail
          </span>
          <button
            type="button"
            className="btn ghost small"
            onClick={onGetStarted}
            disabled={!configured}
          >
            Sign in
          </button>
        </div>
      </header>

      <section className="landing-hero">
        <div className="wrap landing-hero-inner">
          <p className="landing-eyebrow">
            Weekly career documentation, built for high-stakes moments
          </p>
          <h1 className="landing-title">
            A structured journal for your professional wins and metrics
          </h1>
          <p className="landing-lede">
            Spend a few minutes each week logging outcomes and evidence. When it&apos;s
            time for a review, a raise discussion, or an interview, export polished
            bullets and narratives instead of reconstructing the year from memory.
          </p>
          {!configured ? (
            <p className="landing-warning">
              Supabase isn&apos;t wired into this build yet. Add{" "}
              <strong>VITE_SUPABASE_URL</strong> and{" "}
              <strong>VITE_SUPABASE_PUBLISHABLE_KEY</strong> in{" "}
              <strong>Vercel → Settings → Environment Variables</strong> for{" "}
              <strong>Production and Preview</strong>, then <strong>Redeploy</strong>.
              For local dev only: put them in <code>.env.local</code>.
            </p>
          ) : (
            <div className="landing-hero-cta">
              <button
                type="button"
                className="btn primary landing-cta-btn"
                onClick={onGetStarted}
              >
                Start free with email
              </button>
              <p className="landing-cta-note">
                No password — we send a secure sign-in link. Your journal syncs to your
                account on web and mobile.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="landing-section landing-outcomes">
        <div className="wrap">
          <h2 className="landing-section-title">Where this shows up for you</h2>
          <p className="landing-section-intro">
            One habit through the year — three situations where prepared beats improvised:
          </p>
          <ul className="landing-outcome-list">
            <li>
              <strong>Performance reviews</strong> — start from a generated self-review
              draft with wins and metrics grouped by period, then edit in your voice.
            </li>
            <li>
              <strong>Compensation discussions</strong> — cite scope, outcomes, and
              figures you captured when the work was still current.
            </li>
            <li>
              <strong>Hiring processes</strong> — export resume bullets and STAR stories
              aligned with what you actually shipped — no retroactive guesswork.
            </li>
          </ul>
        </div>
      </section>

      <section className="landing-section landing-alt">
        <div className="wrap">
          <h2 className="landing-section-title">Why informal memory isn&apos;t enough</h2>
          <div className="landing-grid">
            <article className="landing-card">
              <h3>Impact fades faster than you expect</h3>
              <p>
                Details from earlier in the year are hard to recover under deadline —
                unless you record them when projects and numbers are still at hand.
              </p>
            </article>
            <article className="landing-card">
              <h3>Strong cases pair narrative with evidence</h3>
              <p>
                Reviews and interviews reward specificity: outcomes, metrics, and scope.
                Tenure Trail helps you log wins and supporting data in one pass.
              </p>
            </article>
            <article className="landing-card">
              <h3>Lightweight by design</h3>
              <p>
                No complex workspace setup — a focused weekly flow, then exports when you
                need resume bullets, STAR answers, or a markdown archive.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="wrap">
          <h2 className="landing-section-title">Included in Tenure Trail</h2>
          <div className="landing-features">
            <div className="landing-feature">
              <span className="landing-feature-icon" aria-hidden="true">
                ✓
              </span>
              <div>
                <strong>Weekly capture</strong>
                <span>Wins, metrics, skills, projects — one focused screen.</span>
              </div>
            </div>
            <div className="landing-feature">
              <span className="landing-feature-icon" aria-hidden="true">
                ✓
              </span>
              <div>
                <strong>Smart exports</strong>
                <span>
                  Resume bullets, STAR interview answers, markdown archives — copy or
                  download.
                </span>
              </div>
            </div>
            <div className="landing-feature">
              <span className="landing-feature-icon" aria-hidden="true">
                ✓
              </span>
              <div>
                <strong>Review draft generator</strong>
                <span>
                  Turn months of entries into a structured self-review to edit — not
                  write from zero.
                </span>
              </div>
            </div>
            <div className="landing-feature">
              <span className="landing-feature-icon" aria-hidden="true">
                ✓
              </span>
              <div>
                <strong>Sync everywhere</strong>
                <span>
                  Same journal on your phone and laptop once you&apos;re signed in.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section landing-cta-block">
        <div className="wrap landing-cta-inner">
          <h2>Be ready for reviews, comp, and interviews</h2>
          <p>
            Free to use with email sign-in. Sign out anytime; your entries stay with your
            account until you remove them.
          </p>
          <button
            type="button"
            className="btn primary landing-cta-btn"
            onClick={onGetStarted}
            disabled={!configured}
          >
            Create your account
          </button>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="wrap landing-footer-inner">
          <span className="muted">Tenure Trail — educational tool, not legal or career advice.</span>
        </div>
      </footer>
    </div>
  );
}
