type Props = {
  onDismiss: () => void;
  onLoadSample: () => void;
};

export function WelcomeCard({ onDismiss, onLoadSample }: Props) {
  return (
    <section
      className="card"
      aria-label="Welcome"
      style={{
        marginBottom: "1.5rem",
        background:
          "linear-gradient(135deg, rgba(31,95,63,0.05) 0%, rgba(194,150,74,0.06) 100%)",
        position: "relative",
      }}
    >
      <button
        type="button"
        aria-label="Dismiss welcome"
        onClick={onDismiss}
        style={{
          position: "absolute",
          top: "0.85rem",
          right: "0.85rem",
          width: 28,
          height: 28,
          borderRadius: 8,
          border: "1px solid var(--border)",
          background: "var(--surface)",
          color: "var(--text-muted)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1rem",
          lineHeight: 1,
        }}
      >
        ×
      </button>

      <p className="card-eyebrow">Welcome</p>
      <h2 style={{ marginBottom: "0.5rem" }}>This is your brag document.</h2>
      <p
        className="muted"
        style={{ margin: "0 0 1rem", maxWidth: "60ch", fontSize: "1rem" }}
      >
        Five quiet minutes every Friday and you'll never lose a win to memory
        again. When review season or a new role comes around, you'll have a
        ready supply of bullets, metrics, and stories — already in your own
        words.
      </p>

      <div className="row" style={{ gap: "0.5rem" }}>
        <button type="button" className="btn primary" onClick={onLoadSample}>
          Show me an example
        </button>
        <button type="button" className="btn ghost" onClick={onDismiss}>
          I'll start from scratch
        </button>
      </div>

      <p
        className="muted"
        style={{ marginTop: "1rem", fontSize: "0.85rem", maxWidth: "60ch" }}
      >
        Your entries sync to your account — open this app on any device after
        you sign in. Export a JSON backup anytime from Settings if you want an
        offline copy.
      </p>
    </section>
  );
}
