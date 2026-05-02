import { useEffect, useState, type FormEvent } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
};

export function AuthModal({ open, onClose, onSubmit }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setStatus("idle");
      setError(null);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    setError(null);
    try {
      await onSubmit(email.trim());
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError((err as Error).message);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.45)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "1.75rem 1.75rem 1.5rem",
          maxWidth: 460,
          width: "100%",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <p className="card-eyebrow">Sync across devices</p>
        <h2
          id="auth-modal-title"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.5rem",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            margin: "0.25rem 0 0.6rem",
          }}
        >
          {status === "sent" ? "Check your inbox" : "Sign in with email"}
        </h2>

        {status !== "sent" && (
          <>
            <p className="muted" style={{ margin: "0 0 1.25rem" }}>
              We'll send a one‑click sign‑in link. No password to remember. Your
              data stays private to your account.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="auth-email">Email</label>
                <input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoFocus
                />
              </div>

              {error && (
                <p
                  style={{
                    color: "var(--danger)",
                    fontSize: "0.9rem",
                    margin: "0 0 0.85rem",
                  }}
                >
                  {error}
                </p>
              )}

              <div className="row" style={{ justifyContent: "flex-end" }}>
                <button type="button" className="btn ghost" onClick={onClose}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn primary"
                  disabled={status === "sending" || !email.trim()}
                >
                  {status === "sending" ? "Sending…" : "Send magic link"}
                </button>
              </div>
            </form>
          </>
        )}

        {status === "sent" && (
          <>
            <p style={{ margin: "0 0 1rem" }}>
              We sent a sign‑in link to <strong>{email}</strong>. Click the
              link in that email and you'll be signed in here automatically.
            </p>
            <p className="muted" style={{ fontSize: "0.9rem" }}>
              Don't see it? Check spam, or close this and try again.
            </p>
            <div
              className="row"
              style={{ justifyContent: "flex-end", marginTop: "1rem" }}
            >
              <button type="button" className="btn primary" onClick={onClose}>
                Got it
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
