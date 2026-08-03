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

  /* Mini visual card — hairline paper card with ink line illustration */
  .v2-mini-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    aspect-ratio: 2 / 3;
    padding: 8% 9% 7%;
    border: 1px solid rgba(26, 23, 20, 0.35);
    background: ${PAPER};
    color: ${INK};
    transition: border-color 160ms ease, color 160ms ease;
  }
  .v2-mini-card-no {
    font-size: 10px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: rgba(26, 23, 20, 0.55);
    transition: color 160ms ease;
  }
  .v2-mini-card-art {
    flex: 1;
    width: 100%;
    min-height: 0;
    margin: 7% 0;
    color: ${INK};
    transition: color 160ms ease;
  }
  .v2-mini-card-name {
    width: 100%;
    border-top: 1px solid rgba(26, 23, 20, 0.22);
    padding-top: 8%;
    font-family: ${SERIF};
    text-align: center;
    font-size: 11px;
    line-height: 1.25;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    transition: color 160ms ease;
  }
  .v2-mini-card:hover { border-color: ${ACCENT}; }
  .v2-mini-card:hover .v2-mini-card-no,
  .v2-mini-card:hover .v2-mini-card-art,
  .v2-mini-card:hover .v2-mini-card-name { color: ${ACCENT}; }

  @media (prefers-reduced-motion: reduce) {
    .v2-root * { transition: none !important; }
  }
`;

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
      <span className="v2-mini-card-art" aria-hidden="true">
        <ArcanaArt number={card.number} />
      </span>
      <span className="v2-mini-card-name">{card.name}</span>
    </Link>
  );
}
