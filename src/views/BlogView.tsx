import { useEffect } from "react";
import type { User } from "@supabase/supabase-js";

type Props = {
  user: User | null;
  onSignIn: () => void;
  configured: boolean;
};

const CANONICAL = "https://tenuretrail.com/blog";

export function BlogView({ user, onSignIn, configured }: Props) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title =
      "The 15-Minute Habit for Reviews & Interviews | Tenure Trail";

    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute("content") ?? "";
    const blogDesc =
      "Why logging wins weekly beats cramming before performance reviews, comp talks, and job interviews, plus how to start in under 15 minutes a week.";
    metaDesc?.setAttribute("content", blogDesc);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", CANONICAL);

    const og: [string, string][] = [
      ["og:title", document.title],
      ["og:description", blogDesc],
      ["og:url", CANONICAL],
      ["og:type", "article"],
    ];
    const ogEls: HTMLMetaElement[] = [];
    for (const [prop, content] of og) {
      const m = document.createElement("meta");
      m.setAttribute("property", prop);
      m.setAttribute("content", content);
      document.head.appendChild(m);
      ogEls.push(m);
    }

    return () => {
      document.title = prevTitle;
      metaDesc?.setAttribute("content", prevDesc);
      canonical?.setAttribute("href", "https://tenuretrail.com/");
      for (const el of ogEls) el.remove();
    };
  }, []);

  return (
    <div className="landing blog-page">
      <header className="landing-header">
        <div className="wrap landing-header-inner blog-header-row">
          <a href="/" className="landing-brand landing-brand--link">
            <span className="brand-mark" aria-hidden="true" />
            Tenure Trail
          </a>
          <nav className="blog-header-actions" aria-label="Blog actions">
            <a href="/" className="btn text small">
              Home
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

      <article className="blog-article wrap">
        <header className="blog-article-head">
          <p className="landing-eyebrow">Career strategy</p>
          <h1 className="blog-title">
            The 15-minute habit that makes performance reviews and interviews easier
          </h1>
          <p className="blog-dek">
            A practical guide to documenting impact while it&apos;s fresh, so you
            don&apos;t rebuild your year from memory under pressure.
          </p>
          <p className="blog-meta muted">
            <time dateTime="2026-05-02">May 2026</time>
            <span aria-hidden="true"> · </span>
            <span>About 5 min read</span>
          </p>
        </header>

        <div className="blog-body">
          <p>
            Most people treat performance reviews, comp conversations, and job
            interviews as <strong>events</strong> you prepare for the week before. In
            practice, the people who get credit for impact often treat them as{" "}
            <strong>outcomes of a small habit</strong> they keep all year.
          </p>

          <p>
            The habit is simple: <strong>once a week, write down what you actually did</strong>{" "}
            in language you could show a manager, not just a private diary.
          </p>

          <h2>Why &quot;I&apos;ll remember later&quot; doesn&apos;t work</h2>

          <p>
            Your brain is built to move on. By the time the fourth quarter arrives, the
            release you shepherded in March, the process you fixed in June, and the
            cross-team issue you untangled in August have blurred into &quot;I had a busy
            year.&quot; Busy is not a strategy. <strong>Specifics</strong> are.
          </p>

          <p>
            Hiring managers and leadership don&apos;t respond to &quot;I work hard.&quot; They
            respond to <strong>scope, outcomes, and evidence</strong>, ideally with{" "}
            <strong>numbers</strong> when you have them (time saved, revenue, reliability,
            cycle time, satisfaction).
          </p>

          <p>
            If you didn&apos;t write those details down when the work was fresh, you end up{" "}
            <strong>reconstructing your year under stress</strong>, which produces generic
            bullets and weak stories. That&apos;s usually not a character flaw. It&apos;s a{" "}
            <strong>memory problem</strong>.
          </p>

          <h2>What to capture in 15 minutes (or less)</h2>

          <p>
            You don&apos;t need a perfect system. You need a <strong>repeatable format</strong>{" "}
            so you&apos;re never staring at a blank page.
          </p>

          <p>Each week, try to log:</p>

          <ul>
            <li>
              <strong>1 to 3 wins</strong> (what shipped, what you unblocked, what you owned).
            </li>
            <li>
              <strong>Metrics</strong> when you have them; rough beats vague.
            </li>
            <li>
              <strong>Scope tags</strong> (product area, team, or project name).
            </li>
            <li>
              <strong>One line of context</strong> on why it mattered (customer, revenue, risk,
              quality).
            </li>
          </ul>

          <p>
            That combination is enough for <strong>resume bullets</strong>,{" "}
            <strong>STAR-style interview answers</strong>, and{" "}
            <strong>self-review paragraphs</strong> later, because you&apos;re storing story
            and proof in the same place.
          </p>

          <h2>Where this shows up when it counts</h2>

          <p>
            <strong>Performance reviews.</strong> You&apos;re not inventing a narrative the night
            before. You&apos;re editing a story that already exists from weeks of entries.
          </p>

          <p>
            <strong>Compensation discussions.</strong> You&apos;re not arguing from vibes. You&apos;re
            pointing to documented scope and outcomes from the period your company actually
            evaluates.
          </p>

          <p>
            <strong>Job searches.</strong> Recruiters and panels ask for examples. You want{" "}
            <strong>bullets and stories</strong> pulled from what you logged, not what you
            scrambled to remember on Sunday night.
          </p>

          <p>
            The habit is weekly; the payoff is when the stakes are highest.
          </p>

          <h2>The smallest commitment that still works</h2>

          <p>
            If full documentation feels heavy, pick one slot,{" "}
            <strong>Friday afternoon or Monday morning</strong>, and protect it. Miss a week?
            Don&apos;t quit the habit; restart the next week. A partial trail beats a perfect
            system you never use.
          </p>

          <h2>Closing</h2>

          <p>
            You don&apos;t need another complicated productivity stack. You need one trusted
            place where wins and metrics live until you need them: your review, your
            comp conversation, or your next role.
          </p>

          <p>
            <strong>Tenure Trail</strong> is built around that idea: a structured weekly
            journal that turns into exports when those moments hit, without rebuilding your
            year from memory.
          </p>
        </div>

        <aside className="blog-cta card-soft">
          <p className="blog-cta-lead">
            Start free with email (passwordless sign-in). Your journal syncs to your account.
          </p>
          <div className="blog-cta-actions">
            {user ? (
              <a href="/" className="btn primary">
                Open Tenure Trail
              </a>
            ) : (
              <button
                type="button"
                className="btn primary"
                onClick={onSignIn}
                disabled={!configured}
              >
                Get started
              </button>
            )}
          </div>
        </aside>
      </article>

      <footer className="landing-footer">
        <div className="wrap landing-footer-inner">
          <span className="muted">
            Tenure Trail is an educational tool, not legal or career advice.
          </span>
        </div>
      </footer>
    </div>
  );
}
