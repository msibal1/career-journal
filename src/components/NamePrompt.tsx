import { useState, type FormEvent } from "react";

type Props = {
  onSave: (name: string) => void;
};

export function NamePrompt({ onSave }: Props) {
  const [value, setValue] = useState("");
  const [dismissed, setDismissed] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cleaned = value.trim();
    if (!cleaned) return;
    onSave(cleaned);
  }

  if (dismissed) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="card-soft"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: "1.25rem",
        flexWrap: "wrap",
      }}
    >
      <label
        htmlFor="quick-name"
        style={{ fontWeight: 600, fontSize: "0.9rem" }}
      >
        What should we call you?
      </label>
      <input
        id="quick-name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Your first name"
        style={{
          flex: 1,
          minWidth: 160,
          padding: "0.5rem 0.75rem",
          border: "1px solid var(--border)",
          background: "var(--surface)",
          borderRadius: "10px",
          font: "inherit",
        }}
      />
      <button type="submit" className="btn primary small" disabled={!value.trim()}>
        Save
      </button>
      <button
        type="button"
        className="btn text small"
        onClick={() => setDismissed(true)}
      >
        Skip
      </button>
    </form>
  );
}
