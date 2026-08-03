import Link from "next/link";
import { ArcanaArt } from "@/components/arcana-art";
import type { ArcanaCard } from "@/lib/arcana";

/* ------------------------------------------------------------------ */
/* Design tokens (system font stacks only)                             */
/* ------------------------------------------------------------------ */

export const SERIF = 'Georgia, "Times New Roman", "Nimbus Roman", serif';
export const SANS =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif';

export const PAPER = "#faf9f6";
export const INK = "#1a1714";
export const ACCENT = "#b3402a";
export const RULE = "rgba(26, 23, 20, 0.16)";

export const pad = (n: number) => String(n).padStart(2, "0");

/* ------------------------------------------------------------------ */
/* Scoped base styles shared by both v2 pages (classes prefixed "v2-") */
/* ------------------------------------------------------------------ */

export const V2_BASE_STYLES = `
  .v2-root {
    --v2-noise: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E");
    background: ${PAPER};
    color: ${INK};
    font-family: ${SANS};
    -webkit-font-smoothing: antialiased;
  }
  .v2-serif { font-family: ${SERIF}; }

  /* Underline-only calculator fields */
  .v2-field {
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(26, 23, 20, 0.55);
    border-radius: 0;
    font-family: ${SERIF};
    color: ${INK};
    outline: none;
    padding: 0 0 6px;
    caret-color: ${ACCENT};
    transition: border-color 160ms ease;
  }
  .v2-field::placeholder { color: rgba(26, 23, 20, 0.32); }
  .v2-field:focus { border-bottom-color: ${ACCENT}; }
  .v2-field::-webkit-outer-spin-button,
  .v2-field::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .v2-field[type="number"] { -moz-appearance: textfield; appearance: textfield; }

  .v2-calc-btn {
    transition: background-color 160ms ease, border-color 160ms ease;
  }
  .v2-calc-btn:hover {
    background: ${ACCENT};
    border-color: ${ACCENT};
  }

  .v2-back-link {
    transition: color 160ms ease;
  }
  .v2-back-link:hover { color: ${ACCENT}; }

  /* -------------------------------------------------------------- */
  /* Blind deboss — the illustration pressed into the paper          */
  /* Three stacked copies: dark shadow up-left, white highlight       */
  /* down-right, and a very faint ink copy to keep the motif readable */
  /* -------------------------------------------------------------- */
  .v2-deboss {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
  }
  .v2-deboss-copy {
    position: absolute;
    inset: 0;
  }
  .v2-deboss-shadow {
    color: rgba(26, 23, 20, 0.22);
    transform: translate(-1px, -1px);
  }
  .v2-deboss-light {
    color: rgba(255, 255, 255, 0.9);
    transform: translate(1px, 1px);
  }
  .v2-deboss-ink {
    color: rgba(26, 23, 20, 0.08);
    transition: color 160ms ease;
  }

  /* -------------------------------------------------------------- */
  /* Mini letterpress card — index grid + compatibility row          */
  /* -------------------------------------------------------------- */
  .v2-mini-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    aspect-ratio: 2 / 3;
    padding: 8% 9% 7%;
    border: 1px solid rgba(26, 23, 20, 0.14);
    border-radius: 2px 3px 3px 4px / 3px 2px 4px 3px;
    background: ${PAPER};
    color: ${INK};
    /* Cardstock thickness: stacked cream edges, bottom-right */
    box-shadow:
      1px 1px 0 #f0ede3,
      2px 2px 0 #eae6d9;
    transition: border-color 160ms ease;
  }
  /* Cotton paper fibre texture */
  .v2-mini-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-image: var(--v2-noise);
    opacity: 0.05;
    pointer-events: none;
  }
  /* Debossed plate border — dark groove top-left, light groove bottom-right */
  .v2-mini-card::after {
    content: "";
    position: absolute;
    inset: 5px;
    border-radius: 1px;
    box-shadow:
      inset 1px 1px 0 rgba(26, 23, 20, 0.22),
      inset -1px -1px 0 rgba(255, 255, 255, 0.85);
    pointer-events: none;
    transition: box-shadow 160ms ease;
  }
  .v2-mini-card-no {
    position: relative;
    font-size: 10px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: rgba(26, 23, 20, 0.55);
    transition: color 160ms ease;
  }
  .v2-mini-card-art {
    position: relative;
    flex: 1;
    width: 100%;
    min-height: 0;
    margin: 7% 0;
  }
  .v2-mini-card-name {
    position: relative;
    width: 100%;
    border-top: 1px solid rgba(26, 23, 20, 0.25);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
    padding-top: 8%;
    font-family: ${SERIF};
    text-align: center;
    font-size: 11px;
    line-height: 1.25;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    transition: color 160ms ease;
  }
  .v2-mini-card:hover { border-color: rgba(179, 64, 42, 0.5); }
  .v2-mini-card:hover .v2-mini-card-no,
  .v2-mini-card:hover .v2-mini-card-name { color: ${ACCENT}; }
  .v2-mini-card:hover .v2-deboss-ink { color: rgba(179, 64, 42, 0.45); }

  @media (prefers-reduced-motion: reduce) {
    .v2-root * { transition: none !important; }
  }
`;

/* ------------------------------------------------------------------ */
/* Blind-debossed art — dark copy up-left, highlight down-right,      */
/* faint ink copy on top                                              */
/* ------------------------------------------------------------------ */

export function DebossArt({ number }: { number: number }) {
  return (
    <span className="v2-deboss" aria-hidden="true">
      <span className="v2-deboss-copy v2-deboss-shadow">
        <ArcanaArt number={number} />
      </span>
      <span className="v2-deboss-copy v2-deboss-light">
        <ArcanaArt number={number} />
      </span>
      <span className="v2-deboss-copy v2-deboss-ink">
        <ArcanaArt number={number} />
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Mini visual card thumbnail — index grid + compatibility row         */
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
      href={`/designs/v2/${card.number}`}
      className={`v2-mini-card ${className}`}
      aria-label={`${card.name} — arcana number ${card.number}`}
    >
      <span className="v2-mini-card-no">No. {card.number}</span>
      <span className="v2-mini-card-art">
        <DebossArt number={card.number} />
      </span>
      <span className="v2-mini-card-name">{card.name}</span>
    </Link>
  );
}
