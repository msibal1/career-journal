/** Decorative hero UI preview (not interactive). */
export function LandingPreview() {
  return (
    <div className="landing-preview">
      <div className="landing-preview-chrome">
        <span className="landing-preview-traffic" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="landing-preview-url">tenuretrail.com</span>
      </div>
      <div className="landing-preview-body">
        <div className="landing-preview-toolbar">
          <span className="landing-preview-pill">This week</span>
          <span className="landing-preview-sync landing-preview-sync--pulse" aria-hidden="true">
            Synced
          </span>
        </div>
        <p className="landing-preview-label">Wins</p>
        <ul className="landing-preview-wins">
          <li className="landing-preview-line landing-preview-line--a">
            Shipped onboarding redesign; activation +12%
          </li>
          <li className="landing-preview-line landing-preview-line--b">
            Mentored new engineer through first prod deploy
          </li>
          <li className="landing-preview-line landing-preview-line--c">
            Partnership with Acme; ~$40K ARR projected Y1
          </li>
        </ul>
        <div className="landing-preview-metrics">
          <span className="landing-preview-metric">
            <small>North star</small>
            <strong>4.6↗</strong>
          </span>
          <span className="landing-preview-metric">
            <small>Cycle time</small>
            <strong>−18%</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
