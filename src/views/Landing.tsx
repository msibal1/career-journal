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
          <p className="landing-eyebrow">Built for performance reviews &amp; job hunts</p>
          <h1 className="landing-title">
            Stop forgetting your wins before they become promotions.
          </h1>
          <p className="landing-lede">
            Five minutes a week → a ready-made story when your manager asks what you
            shipped, when HR opens comp discussion, or when a recruiter wants proof.
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
                Start free — email only
              </button>
              <p className="landing-cta-note">
                No password. We&apos;ll email you a one-click link. Your journal syncs
                to your account — phone, laptop, anywhere.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="landing-section landing-outcomes">
        <div className="wrap">
          <h2 className="landing-section-title">What you actually get</h2>
          <p className="landing-section-intro">
            Not another productivity app — a career asset that pays off at three moments:
          </p>
          <ul className="landing-outcome-list">
            <li>
              <strong>Annual review</strong> — paste a generated self-review draft with
              wins and metrics already grouped. No Sunday-night scramble.
            </li>
            <li>
              <strong>Salary conversation</strong> — bring receipts: numbers, scope,
              and impact you logged when they were fresh.
            </li>
            <li>
              <strong>New role interviews</strong> — export resume bullets and STAR
              stories without rewriting history from memory.
            </li>
          </ul>
        </div>
      </section>

      <section className="landing-section landing-alt">
        <div className="wrap">
          <h2 className="landing-section-title">Why memory loses you money</h2>
          <div className="landing-grid">
            <article className="landing-card">
              <h3>You forget 90% of wins by Q4</h3>
              <p>
                The bug you fixed in March doesn&apos;t exist in your head by December —
                unless you wrote it down when your brain still cared.
              </p>
            </article>
            <article className="landing-card">
              <h3>&quot;I'm a hard worker&quot; loses to numbers</h3>
              <p>
                Managers promote narratives backed by metrics. This app makes you capture
                both in the same breath — win + number + skill tag.
              </p>
            </article>
            <article className="landing-card">
              <h3>Your competition keeps receipts</h3>
              <p>
                The person next to you is documenting. You can too — without a Notion PhD
                or a spreadsheet graveyard.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="wrap">
          <h2 className="landing-section-title">Everything included</h2>
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
          <h2>Ready when your career moment hits</h2>
          <p>
            Create your account with email — free to use. Sign out anytime; your data
            stays tied to your account until you delete it.
          </p>
          <button
            type="button"
            className="btn primary landing-cta-btn"
            onClick={onGetStarted}
            disabled={!configured}
          >
            Get started with email
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
