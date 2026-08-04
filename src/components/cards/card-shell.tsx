import type { ReactNode } from "react";

/**
 * Gives a flat card component physical "real card" presence:
 * rounded corners, edge highlight, contact + ambient shadows.
 */
export default function CardShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative overflow-hidden rounded-[14px] bg-black"
      style={{
        boxShadow:
          "0 1px 1px rgba(0,0,0,0.5), 0 8px 16px rgba(0,0,0,0.45), 0 24px 48px rgba(0,0,0,0.55)",
      }}
    >
      {children}
      {/* top edge light — the thin bright rim a real card catches */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[14px]"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.35), inset 1px 0 0 rgba(255,255,255,0.05), inset -1px 0 0 rgba(0,0,0,0.2)",
        }}
      />
      {/* soft sheen across the surface */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[14px]"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.015) 28%, transparent 55%)",
        }}
      />
    </div>
  );
}
