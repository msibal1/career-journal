import { useState, type KeyboardEvent } from "react";

type Props = {
  values: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
};

export function TagInput({ values, onChange, placeholder }: Props) {
  const [draft, setDraft] = useState("");

  function add(raw: string) {
    const next = raw.trim();
    if (!next) return;
    if (values.includes(next)) {
      setDraft("");
      return;
    }
    onChange([...values, next]);
    setDraft("");
  }

  function remove(value: string) {
    onChange(values.filter((v) => v !== value));
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
    } else if (e.key === "Backspace" && !draft && values.length) {
      remove(values[values.length - 1]);
    }
  }

  return (
    <div className="tag-input">
      {values.map((value) => (
        <span key={value} className="tag-chip">
          {value}
          <button
            type="button"
            aria-label={`Remove ${value}`}
            onClick={() => remove(value)}
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => add(draft)}
        placeholder={values.length ? "" : placeholder}
      />
    </div>
  );
}
