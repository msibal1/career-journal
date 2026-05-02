import type { CSSProperties, ReactNode } from "react";
import { useReveal } from "../hooks/useReveal";

type Props = {
  children: ReactNode;
  className?: string;
  /** Delay stagger index for siblings (0–5 typical) */
  stagger?: number;
};

export function Reveal({ children, className = "", stagger = 0 }: Props) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const delayMs = stagger * 75;

  return (
    <div
      ref={ref}
      className={`landing-reveal ${visible ? "landing-reveal--in" : ""} ${className}`.trim()}
      style={
        {
          "--reveal-delay": `${delayMs}ms`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
