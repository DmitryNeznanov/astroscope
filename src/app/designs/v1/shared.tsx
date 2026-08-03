import Link from "next/link";
import type { ReactNode } from "react";
import { ArcanaArt } from "@/components/arcana-art";
import type { ArcanaCard } from "@/lib/arcana";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const ROMAN_TABLE: Array<[number, string]> = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

export function toRoman(n: number): string {
  let rest = n;
  let out = "";
  for (const [value, numeral] of ROMAN_TABLE) {
    while (rest >= value) {
      out += numeral;
      rest -= value;
    }
  }
  return out;
}

export const SERIF = 'Georgia, "Times New Roman", "Nimbus Roman", serif';
export const SANS =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif';

/* ------------------------------------------------------------------ */
/* Scoped base styles shared by both v1 pages (classes prefixed "v1-") */
/* ------------------------------------------------------------------ */

export const V1_BASE_STYLES = `
  .v1-root {
    background:
      radial-gradient(1200px 700px at 50% -10%, rgba(88, 70, 160, 0.16), transparent 65%),
      radial-gradient(900px 600px at 85% 110%, rgba(201, 162, 39, 0.06), transparent 60%),
      linear-gradient(180deg, #0a0a12 0%, #0d0c18 45%, #090911 100%);
  }

  /* Pure-CSS starfield: two layers of box-shadow stars, gently twinkling */
  .v1-stars,
  .v1-stars::before,
  .v1-stars::after {
    position: absolute;
    inset: 0;
    content: "";
    pointer-events: none;
    background-repeat: repeat;
  }
  .v1-stars {
    background-image:
      radial-gradient(1.4px 1.4px at 22px 34px, rgba(255, 244, 214, 0.85), transparent 60%),
      radial-gradient(1px 1px at 120px 90px, rgba(214, 222, 255, 0.7), transparent 60%),
      radial-gradient(1.2px 1.2px at 190px 160px, rgba(255, 244, 214, 0.55), transparent 60%),
      radial-gradient(0.9px 0.9px at 70px 200px, rgba(214, 222, 255, 0.6), transparent 60%),
      radial-gradient(1px 1px at 240px 60px, rgba(255, 244, 214, 0.5), transparent 60%);
    background-size: 280px 260px;
    animation: v1-twinkle 7s ease-in-out infinite alternate;
  }
  .v1-stars::before {
    background-image:
      radial-gradient(1.6px 1.6px at 60px 140px, rgba(255, 240, 200, 0.9), transparent 60%),
      radial-gradient(1.1px 1.1px at 210px 40px, rgba(220, 226, 255, 0.75), transparent 60%),
      radial-gradient(0.9px 0.9px at 150px 220px, rgba(255, 240, 200, 0.6), transparent 60%),
      radial-gradient(1.2px 1.2px at 30px 260px, rgba(220, 226, 255, 0.55), transparent 60%);
    background-size: 340px 320px;
    opacity: 0.7;
    animation: v1-twinkle 9s ease-in-out infinite alternate-reverse;
  }
  .v1-stars::after {
    background-image:
      radial-gradient(2px 2px at 100px 80px, rgba(255, 236, 190, 0.95), transparent 60%),
      radial-gradient(1.3px 1.3px at 260px 180px, rgba(226, 232, 255, 0.7), transparent 60%);
    background-size: 460px 420px;
    opacity: 0.55;
    animation: v1-twinkle 11s ease-in-out infinite alternate;
  }
  @keyframes v1-twinkle {
    from { opacity: 0.45; }
    to   { opacity: 1; }
  }

  .v1-serif { font-family: ${SERIF}; }
  .v1-sans { font-family: ${SANS}; }

  .v1-gold { color: #c9a227; }
  .v1-gold-soft { color: #e3c964; }
  .v1-ivory { color: #efe9dc; }
  .v1-muted { color: #9b97ab; }

  .v1-hairline { border: 1px solid rgba(201, 162, 39, 0.35); }
  .v1-hairline-faint { border: 1px solid rgba(201, 162, 39, 0.18); }

  .v1-glow-gold {
    box-shadow:
      0 0 24px rgba(201, 162, 39, 0.14),
      0 0 80px rgba(201, 162, 39, 0.06);
  }

  /* Ornate double border frame */
  .v1-card-frame {
    position: relative;
    border: 1px solid rgba(201, 162, 39, 0.55);
    background:
      radial-gradient(600px 300px at 50% 0%, rgba(201, 162, 39, 0.08), transparent 70%),
      linear-gradient(180deg, rgba(20, 18, 34, 0.92), rgba(12, 11, 22, 0.96));
  }
  .v1-card-frame::before {
    content: "";
    position: absolute;
    inset: 7px;
    border: 1px solid rgba(201, 162, 39, 0.28);
    pointer-events: none;
  }

  .v1-corner {
    position: absolute;
    width: 18px;
    height: 18px;
    border-color: rgba(201, 162, 39, 0.75);
    border-style: solid;
    pointer-events: none;
  }
  .v1-corner-tl { top: 3px; left: 3px; border-width: 1px 0 0 1px; }
  .v1-corner-tr { top: 3px; right: 3px; border-width: 1px 1px 0 0; }
  .v1-corner-bl { bottom: 3px; left: 3px; border-width: 0 0 1px 1px; }
  .v1-corner-br { bottom: 3px; right: 3px; border-width: 0 1px 1px 0; }

  .v1-chip {
    border: 1px solid rgba(201, 162, 39, 0.4);
    color: #e3c964;
    background: rgba(201, 162, 39, 0.07);
    letter-spacing: 0.14em;
  }

  .v1-divider {
    display: flex;
    align-items: center;
    gap: 14px;
    color: rgba(201, 162, 39, 0.7);
  }
  .v1-divider::before,
  .v1-divider::after {
    content: "";
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201, 162, 39, 0.45), transparent);
  }

  .v1-panel {
    background: linear-gradient(180deg, rgba(21, 19, 36, 0.8), rgba(12, 11, 22, 0.9));
  }

  /* Mini tarot card thumbnail — used in the deck grid and compatibility row */
  .v1-mini-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    aspect-ratio: 2 / 3;
    padding: 9% 10% 8%;
    border: 1px solid rgba(201, 162, 39, 0.45);
    border-radius: 4px;
    background:
      radial-gradient(130% 55% at 50% 0%, rgba(201, 162, 39, 0.09), transparent 62%),
      linear-gradient(180deg, #161428 0%, #0c0b16 100%);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
    transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
  }
  .v1-mini-card::before {
    content: "";
    position: absolute;
    inset: 5px;
    border: 1px solid rgba(201, 162, 39, 0.22);
    border-radius: 2px;
    pointer-events: none;
    transition: border-color 160ms ease;
  }
  .v1-mini-card:hover {
    border-color: rgba(201, 162, 39, 0.9);
    box-shadow: 0 0 26px rgba(201, 162, 39, 0.2), 0 12px 30px rgba(0, 0, 0, 0.5);
    transform: translateY(-4px);
  }
  .v1-mini-card:hover::before {
    border-color: rgba(201, 162, 39, 0.45);
  }
  .v1-mini-card-roman {
    text-shadow: 0 0 14px rgba(201, 162, 39, 0.45);
  }
  .v1-mini-card-art {
    flex: 1;
    width: 100%;
    min-height: 0;
    margin: 6% 0;
    color: #d9b64a;
    opacity: 0.92;
    filter: drop-shadow(0 0 5px rgba(201, 162, 39, 0.3));
  }
  .v1-mini-card-name {
    width: 100%;
    border-top: 1px solid rgba(201, 162, 39, 0.25);
    padding-top: 7%;
  }

  @media (prefers-reduced-motion: reduce) {
    .v1-stars,
    .v1-stars::before,
    .v1-stars::after {
      animation: none;
    }
  }
`;

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                         */
/* ------------------------------------------------------------------ */

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      className="v1-sans v1-gold text-[11px] uppercase tracking-[0.42em]"
      style={{ textIndent: "0.42em" }}
    >
      {children}
    </p>
  );
}

export function Divider({ glyph = "✦" }: { glyph?: string }) {
  return (
    <div className="v1-divider my-12 text-sm" aria-hidden="true">
      <span className="v1-serif">{glyph}</span>
    </div>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="v1-chip v1-sans inline-block rounded-full px-3.5 py-1 text-[11px] uppercase">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Mini tarot card thumbnail                                           */
/* ------------------------------------------------------------------ */

export function MiniTarotCard({
  card,
  className = "",
}: {
  card: ArcanaCard;
  className?: string;
}) {
  return (
    <Link
      href={`/designs/v1/${card.number}`}
      className={`v1-mini-card ${className}`}
      aria-label={`${card.name} — arcana ${toRoman(card.number)}`}
    >
      <span className="v1-mini-card-roman v1-serif v1-gold-soft text-sm leading-none sm:text-base">
        {toRoman(card.number)}
      </span>
      <span className="v1-mini-card-art" aria-hidden="true">
        <ArcanaArt number={card.number} />
      </span>
      <span className="v1-mini-card-name v1-serif v1-ivory text-center text-[11px] leading-tight tracking-[0.08em] uppercase sm:text-xs">
        {card.name}
      </span>
    </Link>
  );
}
