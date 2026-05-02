import { useState } from "react";

type Props = {
  text: string;
};

export function CopyOutput({ text }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function download() {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `career-journal-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="output-area">
      <textarea readOnly value={text} />
      <div className="output-actions">
        {copied && <span className="copy-toast">Copied</span>}
        <button type="button" className="btn ghost small" onClick={copy}>
          Copy
        </button>
        <button type="button" className="btn ghost small" onClick={download}>
          Download .md
        </button>
      </div>
    </div>
  );
}
