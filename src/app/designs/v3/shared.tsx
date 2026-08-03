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

/* ------------------------------------------------------------------ */
/* Palette                                                             */
/* ------------------------------------------------------------------ */

export const INK = "#3b2d1f";
export const PARCHMENT = "#f3e9d2";
export const PARCHMENT_DEEP = "#e8d9b5";
export const OXBLOOD = "#6b1f1f";
export const GREEN = "#2f4a33";

export const ARCANA_ROUTES_BASE = "/designs/v3";

/* ------------------------------------------------------------------ */
/* Scoped base styles shared by both v3 pages (classes prefixed "v3-") */
/* ------------------------------------------------------------------ */

export const V3_BASE_STYLES = `
  .v3-root {
    background-color: ${PARCHMENT};
    color: ${INK};
    font-family: "Palatino Linotype", Palatino, "Book Antiqua", Georgia, "Times New Roman", serif;
    background-image:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E"),
      radial-gradient(ellipse at 18% 8%, rgba(59, 45, 31, 0.07), transparent 55%),
      radial-gradient(ellipse at 85% 92%, rgba(107, 31, 31, 0.05), transparent 55%),
      radial-gradient(ellipse at 90% 10%, rgba(47, 74, 51, 0.04), transparent 50%),
      repeating-linear-gradient(0deg, rgba(59, 45, 31, 0.022) 0px, rgba(59, 45, 31, 0.022) 1px, transparent 1px, transparent 4px),
      repeating-linear-gradient(90deg, rgba(59, 45, 31, 0.018) 0px, rgba(59, 45, 31, 0.018) 1px, transparent 1px, transparent 5px);
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  .v3-smallcaps {
    font-variant: small-caps;
    letter-spacing: 0.14em;
  }

  /* Ornamental rules ------------------------------------------------ */
  .v3-rule-double {
    border-top: 3px double ${INK};
  }
  .v3-rule-thin {
    border-top: 1px solid rgba(59, 45, 31, 0.45);
  }
  .v3-rule-ornament {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .v3-rule-ornament::before,
  .v3-rule-ornament::after {
    content: "";
    flex: 1 1 0%;
    border-top: 1px solid rgba(59, 45, 31, 0.55);
  }

  /* Ornate manuscript frame ----------------------------------------- */
  .v3-frame {
    position: relative;
    border: 1px solid ${INK};
    padding: 7px;
    background: rgba(232, 217, 181, 0.55);
    box-shadow: 0 1px 0 rgba(255, 250, 235, 0.6), 0 14px 30px -18px rgba(59, 45, 31, 0.55);
  }
  .v3-frame-inner {
    border: 3px double ${INK};
    background:
      radial-gradient(ellipse at 50% 0%, rgba(255, 250, 235, 0.65), transparent 70%),
      rgba(243, 233, 210, 0.6);
  }
  .v3-corner {
    position: absolute;
    width: 1.35rem;
    height: 1.35rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    line-height: 1;
    color: ${OXBLOOD};
    background: ${PARCHMENT};
    pointer-events: none;
  }
  .v3-corner-tl { top: -0.62rem; left: -0.62rem; }
  .v3-corner-tr { top: -0.62rem; right: -0.62rem; }
  .v3-corner-bl { bottom: -0.62rem; left: -0.62rem; }
  .v3-corner-br { bottom: -0.62rem; right: -0.62rem; }

  /* Typography flourishes ------------------------------------------- */
  .v3-chapter-title {
    font-variant: small-caps;
    letter-spacing: 0.1em;
  }
  .v3-dropcap::first-letter {
    float: left;
    font-size: 3.4em;
    line-height: 0.82;
    padding: 0.06em 0.14em 0 0;
    color: ${OXBLOOD};
    font-weight: 700;
  }

  /* Form elements ---------------------------------------------------- */
  .v3-field-label {
    font-variant: small-caps;
    letter-spacing: 0.18em;
    font-size: 0.85rem;
  }
  .v3-input {
    width: 100%;
    background: rgba(255, 250, 235, 0.55);
    border: 1px solid ${INK};
    box-shadow: inset 0 0 0 1px ${PARCHMENT}, inset 0 2px 6px rgba(59, 45, 31, 0.18);
    color: ${INK};
    font-family: inherit;
    font-size: 1.15rem;
    text-align: center;
    padding: 0.55rem 0.5rem;
    border-radius: 0;
    outline: none;
    appearance: textfield;
    -moz-appearance: textfield;
  }
  .v3-input::-webkit-outer-spin-button,
  .v3-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .v3-input:focus {
    border-color: ${OXBLOOD};
    box-shadow: inset 0 0 0 1px ${PARCHMENT}, inset 0 2px 6px rgba(59, 45, 31, 0.18), 0 0 0 2px rgba(107, 31, 31, 0.28);
  }
  .v3-input::placeholder {
    color: rgba(59, 45, 31, 0.4);
    font-style: italic;
  }

  .v3-button {
    display: inline-block;
    background: ${INK};
    color: ${PARCHMENT};
    font-variant: small-caps;
    letter-spacing: 0.16em;
    font-size: 1.05rem;
    padding: 0.7rem 2.2rem;
    border: 1px solid ${INK};
    box-shadow: inset 0 0 0 1px ${PARCHMENT}, inset 0 0 0 3px ${INK};
    cursor: pointer;
    transition: background-color 180ms ease, color 180ms ease, box-shadow 180ms ease;
  }
  .v3-button:hover {
    background: ${OXBLOOD};
    border-color: ${OXBLOOD};
    box-shadow: inset 0 0 0 1px ${PARCHMENT}, inset 0 0 0 3px ${OXBLOOD};
  }
  .v3-button:active {
    transform: translateY(1px);
  }

  .v3-notice {
    border: 1px solid ${OXBLOOD};
    background: rgba(107, 31, 31, 0.08);
    color: ${OXBLOOD};
    box-shadow: inset 0 0 0 1px rgba(243, 233, 210, 0.8);
  }

  /* Bordered inset note ---------------------------------------------- */
  .v3-inset {
    border: 1px solid rgba(59, 45, 31, 0.65);
    box-shadow: inset 0 0 0 1px ${PARCHMENT}, inset 0 0 0 4px rgba(59, 45, 31, 0.28);
    background: rgba(232, 217, 181, 0.5);
  }

  /* Annotated plates (upright / reversed) ------------------------------ */
  .v3-annotated {
    border: 1px solid rgba(59, 45, 31, 0.7);
    background: rgba(255, 250, 235, 0.4);
    box-shadow: inset 0 0 0 1px ${PARCHMENT}, inset 0 0 0 4px rgba(59, 45, 31, 0.22);
  }
  .v3-annotated-heading {
    border-bottom: 1px solid rgba(59, 45, 31, 0.5);
  }

  .v3-list-marker {
    color: ${OXBLOOD};
  }

  .v3-chip {
    display: inline-block;
    border: 1px solid ${GREEN};
    color: ${GREEN};
    padding: 0.2rem 0.8rem;
    font-variant: small-caps;
    letter-spacing: 0.1em;
    box-shadow: inset 0 0 0 1px ${PARCHMENT}, inset 0 0 0 3px rgba(47, 74, 51, 0.35);
  }

  /* Back link ---------------------------------------------------------- */
  .v3-back-link {
    color: ${INK};
    text-decoration: none;
    transition: color 150ms ease;
  }
  .v3-back-link:hover {
    color: ${OXBLOOD};
  }

  /* Antique copperplate engraving primitives --------------------------- */

  /* Engraving cross-hatch: two crossing sets of fine diagonal lines */
  .v3-hatch {
    position: relative;
  }
  .v3-hatch::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image:
      repeating-linear-gradient(45deg, rgba(59, 45, 31, 0.09) 0px, rgba(59, 45, 31, 0.09) 1px, transparent 1px, transparent 5px),
      repeating-linear-gradient(-45deg, rgba(59, 45, 31, 0.06) 0px, rgba(59, 45, 31, 0.06) 1px, transparent 1px, transparent 7px);
  }

  /* Plate mark — the embossed indentation left by the printing press:
     dark hairline top/left, light hairline bottom/right */
  .v3-plate-mark {
    position: relative;
    background: rgba(255, 250, 235, 0.35);
    box-shadow:
      inset 1px 1px 0 rgba(59, 45, 31, 0.5),
      inset -1px -1px 0 rgba(255, 252, 240, 0.95),
      inset 2px 2px 5px rgba(59, 45, 31, 0.14),
      inset 0 0 0 1px rgba(59, 45, 31, 0.1);
  }

  /* Foxing — soft brown age spots on the paper */
  .v3-foxing {
    background-image:
      radial-gradient(circle 26px at 16% 12%, rgba(146, 104, 52, 0.13), transparent 70%),
      radial-gradient(circle 18px at 84% 22%, rgba(122, 84, 40, 0.1), transparent 70%),
      radial-gradient(circle 32px at 78% 88%, rgba(146, 104, 52, 0.11), transparent 70%),
      radial-gradient(circle 14px at 28% 82%, rgba(122, 84, 40, 0.09), transparent 70%);
  }

  /* Mini engraved print — Compendium grid and kindred cards ------------- */
  .v3-mini-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    aspect-ratio: 2 / 3;
    padding: 7% 8% 6%;
    border: 1px solid rgba(59, 45, 31, 0.75);
    /* slightly uneven, deckle-like edge */
    border-radius: 2px 4px 3px 5px / 4px 2px 5px 3px;
    background-color: ${PARCHMENT};
    box-shadow:
      0 1px 0 rgba(255, 250, 235, 0.55),
      0 5px 12px -6px rgba(59, 45, 31, 0.5);
    text-decoration: none;
    transition: transform 160ms ease, box-shadow 160ms ease;
  }
  .v3-mini-card:hover {
    transform: translateY(-3px);
    box-shadow:
      0 1px 0 rgba(255, 250, 235, 0.55),
      0 11px 22px -8px rgba(59, 45, 31, 0.55);
  }
  .v3-mini-card:focus-visible {
    outline: 2px solid ${OXBLOOD};
    outline-offset: 3px;
  }
  .v3-mini-card-plate {
    flex: 1;
    width: 100%;
    min-height: 0;
    padding: 8% 9%;
    overflow: hidden;
  }
  .v3-mini-card-art {
    position: relative;
    width: 100%;
    height: 100%;
    color: ${INK};
    opacity: 0.9;
  }
  .v3-mini-card-caption {
    width: 100%;
    margin-top: 7%;
    padding-top: 5%;
    border-top: 1px solid rgba(59, 45, 31, 0.4);
    text-align: center;
    color: ${INK};
    line-height: 1.25;
  }
  .v3-mini-card-caption-roman {
    display: block;
    font-size: 10px;
    color: ${OXBLOOD};
  }
  .v3-mini-card-caption-name {
    display: block;
    font-variant: small-caps;
    letter-spacing: 0.08em;
    font-size: 11px;
  }
`;

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                         */
/* ------------------------------------------------------------------ */

export function Corners() {
  return (
    <>
      <span aria-hidden className="v3-corner v3-corner-tl">✦</span>
      <span aria-hidden className="v3-corner v3-corner-tr">✦</span>
      <span aria-hidden className="v3-corner v3-corner-bl">✦</span>
      <span aria-hidden className="v3-corner v3-corner-br">✦</span>
    </>
  );
}

export function ChapterHeading({ numeral, title }: { numeral: string; title: string }) {
  return (
    <div className="mb-8 text-center">
      <p className="v3-rule-ornament v3-smallcaps text-sm opacity-80">
        <span>❧</span>
        <span>Caput {numeral}</span>
        <span>☙</span>
      </p>
      <h2 className="v3-chapter-title mt-3 text-3xl md:text-4xl">{title}</h2>
      <p aria-hidden className="mt-3 text-sm" style={{ color: OXBLOOD }}>
        ✦&ensp;✦&ensp;✦
      </p>
    </div>
  );
}

export function Divider({ glyph = "✦" }: { glyph?: string }) {
  return (
    <p className="v3-rule-ornament my-12 text-lg" aria-hidden>
      <span style={{ color: OXBLOOD }}>{glyph}</span>
    </p>
  );
}

export function Colophon() {
  return (
    <footer className="mt-16 text-center">
      <p className="v3-rule-ornament text-sm" aria-hidden>
        <span style={{ color: OXBLOOD }}>❦</span>
      </p>
      <p aria-hidden className="mt-6 text-lg tracking-[0.5em]" style={{ color: OXBLOOD }}>
        ✦&ensp;❧&ensp;✦
      </p>
      <p className="v3-smallcaps mt-5 text-sm opacity-80">
        Astro Scope — design variant v3 · Vintage Grimoire
      </p>
      <p className="mt-2 text-xs italic opacity-60">
        Set in old-style serif upon aged parchment · Finis coronat opus
      </p>
      <div className="v3-rule-thin mt-6" />
      <div className="v3-rule-double mt-[3px]" />
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Mini tarot plate thumbnail                                          */
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
      href={`${ARCANA_ROUTES_BASE}/${card.number}`}
      className={`v3-mini-card ${className}`}
      aria-label={`${card.name} — arcana ${toRoman(card.number)}`}
    >
      <span className="v3-mini-card-plate v3-plate-mark">
        <span className="v3-mini-card-art v3-hatch block" aria-hidden="true">
          <ArcanaArt number={card.number} />
        </span>
      </span>
      <span className="v3-mini-card-caption">
        <span className="v3-mini-card-caption-roman">{toRoman(card.number)}.</span>
        <span className="v3-mini-card-caption-name">{card.name}.</span>
      </span>
    </Link>
  );
}

/* Re-exported for pages that only need the type */
export type { ArcanaCard };
