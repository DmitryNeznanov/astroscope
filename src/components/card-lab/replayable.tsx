"use client";

import { useState, type ReactNode } from "react";

/**
 * Wraps a card and remounts it on demand, restarting its CSS
 * load animations. Renders a small replay button in the corner.
 */
export default function Replayable({ children }: { children: ReactNode }) {
  const [run, setRun] = useState(0);
  return (
    <div className="relative">
      <div key={run}>{children}</div>
      <button
        type="button"
        onClick={() => setRun((r) => r + 1)}
        aria-label="Replay load animation"
        title="Replay load animation"
        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-black/55 text-sm text-white/80 backdrop-blur-sm transition hover:scale-110 hover:border-white/60 hover:text-white"
      >
        ↻
      </button>
    </div>
  );
}
