import Link from "next/link";
import type { ReactNode } from "react";
import { ArcanaArt } from "@/components/arcana-art";
import type { ArcanaCard } from "@/lib/arcana";

/* ------------------------------------------------------------------ */
/* Design tokens                                                       */
/* ------------------------------------------------------------------ */

export const YELLOW = "#ffe600";
export const PINK = "#ff5da2";
export const BLUE = "#2b5bff";
/** Off-white recycled paper the "riso print" sits on. */
export const PAPER = "#f4f0e3";

export const ARCANA_ROUTES_BASE = "/designs/v4";

export const STICKER_COLORS = [PINK, BLUE, YELLOW, "#ffffff"];

/* ------------------------------------------------------------------ */
/* Scoped base styles (classes prefixed "v4-")                          */
/* ------------------------------------------------------------------ */

export const V4_BASE_STYLES = `
  .v4-heading {
    font-family: "Arial Black", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight: 900;
    letter-spacing: -0.02em;
  }
  .v4-shadow {
    box-shadow: 6px 6px 0 #000;
  }
  .v4-shadow-sm {
    box-shadow: 4px 4px 0 #000;
  }
  .v4-sticker {
    display: inline-block;
    border: 3px solid #000;
    padding: 0.25rem 0.75rem;
    font-weight: 900;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.05em;
    box-shadow: 3px 3px 0 #000;
    white-space: nowrap;
  }
  .v4-btn {
    transition: transform 80ms ease, box-shadow 80ms ease, background-color 120ms ease, color 120ms ease;
  }
  .v4-btn:hover {
    background-color: #000;
    color: ${YELLOW};
  }
  .v4-btn:active {
    transform: translate(6px, 6px);
    box-shadow: 0 0 0 #000;
  }
  .v4-input {
    border: 3px solid #000;
    background: #fff;
    padding: 0.75rem 1rem;
    font-size: 1.5rem;
    font-weight: 900;
    width: 100%;
    text-align: center;
    outline: none;
    border-radius: 0;
  }
  .v4-input:focus {
    background: ${YELLOW};
    box-shadow: 4px 4px 0 #000;
  }
  .v4-input::placeholder {
    color: #999;
  }
  .v4-marquee {
    overflow: hidden;
    white-space: nowrap;
  }
  .v4-marquee-track {
    display: inline-block;
    animation: v4-marquee 18s linear infinite;
  }
  @keyframes v4-marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  .v4-pop {
    animation: v4-pop 240ms cubic-bezier(0.2, 1.6, 0.4, 1);
  }
  @keyframes v4-pop {
    from { transform: scale(0.92) rotate(-1deg); opacity: 0; }
    to { transform: scale(1) rotate(0deg); opacity: 1; }
  }

  /* ------------------------------------------------------------ */
  /* RISOGRAPH PRINT — misregistered 2-color duotone card          */
  /* ------------------------------------------------------------ */

  /* Recycled paper stock: warm off-white + faint fibre noise      */
  .v4-riso-paper {
    background-color: ${PAPER};
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
  }

  /* Halftone dot screen laid over the print, like riso grain      */
  .v4-riso-halftone {
    position: absolute;
    inset: 0;
    pointer-events: none;
    mix-blend-mode: multiply;
    background-image:
      radial-gradient(rgba(0, 0, 0, 0.22) 1px, transparent 1.5px),
      radial-gradient(rgba(255, 93, 162, 0.28) 1px, transparent 1.5px);
    background-size: 7px 7px, 9px 9px;
    background-position: 0 0, 3px 4px;
    opacity: 0.55;
  }
  .v4-riso-halftone-sm {
    background-size: 5px 5px, 7px 7px;
    opacity: 0.5;
  }

  /* One ink layer of the duotone. The pink pass is offset and     */
  /* multiplied over the black pass — overlaps darken like real    */
  /* overprint.                                                    */
  .v4-riso-ink {
    position: absolute;
    inset: 0;
  }
  .v4-riso-ink-pink {
    mix-blend-mode: multiply;
    opacity: 0.92;
  }

  /* Rough hand-drawn ink frame (SVG wobble path stretched to fit) */
  .v4-riso-frame {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  /* Big card shell ------------------------------------------------ */
  .v4-riso-wrap {
    position: relative;
    width: min(350px, 86vw);
    aspect-ratio: 2 / 3;
  }
  .v4-riso-card {
    position: absolute;
    inset: 0;
    box-shadow: 8px 8px 0 #000;
  }
  /* Huge number bleeding off the top corner                        */
  .v4-riso-bleed {
    position: absolute;
    top: -0.55em;
    right: -0.18em;
    z-index: 20;
    font-size: 5.5rem;
    line-height: 1;
    color: #000;
    text-shadow: 5px 5px 0 ${PINK};
    pointer-events: none;
  }
  /* Black pasted-on name bar, slightly rotated, overlapping edge   */
  .v4-riso-nameplate {
    position: absolute;
    left: -5%;
    bottom: 6%;
    width: 110%;
    z-index: 15;
    background: #000;
    color: #fff;
    border: 3px solid #000;
    box-shadow: 5px 5px 0 ${PINK};
    padding: 0.55rem 1rem;
    font-size: 1.35rem;
    line-height: 1.05;
    text-transform: uppercase;
    text-align: center;
    transform: rotate(-1.5deg);
  }
  /* Print-shop sticker overlapping the card edge                   */
  .v4-riso-sticker {
    position: absolute;
    top: 9%;
    left: -0.9rem;
    z-index: 20;
    transform: rotate(-8deg);
    background: ${YELLOW};
    color: #000;
  }

  /* Mini riso card (grid + compatible) ------------------------------ */
  .v4-riso-mini {
    position: relative;
    display: flex;
    flex-direction: column;
    aspect-ratio: 2 / 3;
    padding: 9% 9% 22%;
    box-shadow: 4px 4px 0 #000;
    text-decoration: none;
    transition: transform 100ms ease, box-shadow 100ms ease;
  }
  .v4-riso-mini:hover {
    transform: translate(-2px, -2px);
    box-shadow: 7px 7px 0 #000;
  }
  .v4-riso-mini:active {
    transform: translate(3px, 3px);
    box-shadow: 0 0 0 #000;
  }
  .v4-riso-mini:focus-visible {
    outline: 3px solid ${BLUE};
    outline-offset: 3px;
  }
  .v4-riso-mini-num {
    position: absolute;
    top: -0.45em;
    right: -0.1em;
    z-index: 10;
    font-size: 1.6rem;
    line-height: 1;
    color: #000;
    text-shadow: 3px 3px 0 ${PINK};
    pointer-events: none;
  }
  .v4-riso-mini-art {
    position: relative;
    flex: 1;
    min-height: 0;
  }
  .v4-riso-mini-name {
    position: absolute;
    left: -6%;
    bottom: 7%;
    width: 112%;
    z-index: 10;
    background: #000;
    color: #fff;
    border: 2px solid #000;
    box-shadow: 3px 3px 0 ${PINK};
    padding: 0.3rem 0.4rem;
    font-size: 0.72rem;
    line-height: 1.1;
    text-transform: uppercase;
    text-align: center;
    transform: rotate(-1.5deg);
    transition: background-color 120ms ease, color 120ms ease;
  }
  .v4-riso-mini:hover .v4-riso-mini-name {
    background: ${PINK};
    color: #000;
  }
`;

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                          */
/* ------------------------------------------------------------------ */

export function Sticker({
  children,
  color,
  rotate = -2,
}: {
  children: ReactNode;
  color: string;
  rotate?: number;
}) {
  return (
    <span
      className="v4-sticker"
      style={{
        backgroundColor: color,
        color: color === BLUE ? "#ffffff" : "#000000",
        transform: `rotate(${rotate}deg)`,
      }}
    >
      {children}
    </span>
  );
}

export function Marquee({ text }: { text: string }) {
  return (
    <div
      className="v4-marquee border-t-4 border-black py-1"
      style={{ backgroundColor: PINK }}
      aria-hidden
    >
      <div className="v4-marquee-track v4-heading text-xs uppercase tracking-[0.3em] text-black">
        {Array.from({ length: 2 }).map((_, i) => (
          <span key={i}>
            {Array.from({ length: 6 }).map((_, j) => (
              <span key={j} className="mx-4">
                {text}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

export function V4Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-8 md:flex-row md:items-center">
        <p className="v4-heading text-sm uppercase tracking-widest">
          Astro Scope — Design variant V4 · Neo-Brutalist
        </p>
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: YELLOW }}
        >
          22 cards ★ 1 birthday ★ 0 gradients
        </p>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Risograph print primitives                                           */
/* ------------------------------------------------------------------ */

/** Hand-drawn-looking frame path, stretched to any box via the SVG. */
const WOBBLE_PATH =
  "M9,11 C62,4 158,13 231,7 C236,88 230,196 235,351 C166,357 74,349 6,355 C3,238 11,118 9,11 Z";

function WobbleFrame({ strokeWidth = 4, offset = 3 }: { strokeWidth?: number; offset?: number }) {
  return (
    <svg
      className="v4-riso-frame"
      viewBox="0 0 240 360"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d={WOBBLE_PATH}
        transform={`translate(${offset}, ${offset})`}
        fill="none"
        stroke={PINK}
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={WOBBLE_PATH}
        fill="none"
        stroke="#000000"
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** The illustration printed twice: black pass + offset pink pass. */
function RisoDuotone({ number, offset = 4 }: { number: number; offset?: number }) {
  return (
    <>
      <div className="v4-riso-ink" style={{ color: "#111111" }}>
        <ArcanaArt number={number} />
      </div>
      <div
        className="v4-riso-ink v4-riso-ink-pink"
        style={{
          color: PINK,
          transform: `translate(${offset}px, ${-Math.round(offset * 0.75)}px)`,
        }}
      >
        <ArcanaArt number={number} />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* The big riso card centerpiece                                        */
/* ------------------------------------------------------------------ */

export function RisoCard({ card }: { card: ArcanaCard }) {
  return (
    <div className="v4-riso-wrap">
      <span className="v4-riso-bleed v4-heading" aria-hidden>
        #{card.number}
      </span>
      <div className="v4-riso-card v4-riso-paper">
        <WobbleFrame />
        <div className="absolute inset-[9%]">
          <RisoDuotone number={card.number} offset={4} />
          <span className="v4-riso-halftone" aria-hidden />
        </div>
        <div className="v4-riso-nameplate v4-heading">{card.name}</div>
        <span className="v4-sticker v4-riso-sticker">2nd printing</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mini riso card (grid + compatible arcanas)                           */
/* ------------------------------------------------------------------ */

export function MiniRisoCard({
  card,
  className = "",
}: {
  card: ArcanaCard;
  className?: string;
}) {
  return (
    <Link
      href={`${ARCANA_ROUTES_BASE}/${card.number}`}
      className={`v4-riso-mini v4-riso-paper ${className}`}
      aria-label={`${card.name} — arcana ${card.number}`}
    >
      <span className="v4-riso-mini-num v4-heading" aria-hidden>
        {String(card.number).padStart(2, "0")}
      </span>
      <span className="v4-riso-mini-art">
        <WobbleFrame strokeWidth={2.5} offset={2} />
        <span className="absolute inset-[6%] block">
          <RisoDuotone number={card.number} offset={2} />
          <span className="v4-riso-halftone v4-riso-halftone-sm" aria-hidden />
        </span>
      </span>
      <span className="v4-riso-mini-name v4-heading">{card.name}</span>
    </Link>
  );
}

/* Re-exported for pages that only need the type */
export type { ArcanaCard };
