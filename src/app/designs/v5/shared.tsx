import Link from "next/link";
import type { ReactNode } from "react";
import { ArcanaArt } from "@/components/arcana-art";
import type { ArcanaCard } from "@/lib/arcana";

/* ------------------------------------------------------------------ */
/* Design tokens                                                        */
/* ------------------------------------------------------------------ */

export const SPACE = "#070b1a";
export const ARCANA_ROUTES_BASE = "/designs/v5";

/** 1 → "I", 9 → "IX", 22 → "XXII" … */
export function toRoman(n: number): string {
  const table: ReadonlyArray<readonly [number, string]> = [
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
  let out = "";
  let v = n;
  for (const [value, symbol] of table) {
    while (v >= value) {
      out += symbol;
      v -= value;
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Scoped base styles (classes prefixed "v5-")                          */
/* ------------------------------------------------------------------ */

export const V5_BASE_STYLES = `
  /* ---- Aurora backdrop ------------------------------------------ */
  .v5-aurora {
    position: fixed;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
  }
  .v5-blob {
    position: absolute;
    border-radius: 9999px;
    filter: blur(90px);
    opacity: 0.55;
    will-change: transform;
  }
  .v5-blob-violet {
    width: 55vmax; height: 55vmax;
    top: -18vmax; left: -12vmax;
    background: radial-gradient(circle at 35% 35%, rgba(139,92,246,0.55), transparent 65%);
    animation: v5-drift-a 26s ease-in-out infinite alternate;
  }
  .v5-blob-teal {
    width: 48vmax; height: 48vmax;
    top: 30%; right: -16vmax;
    background: radial-gradient(circle at 60% 40%, rgba(45,212,191,0.42), transparent 65%);
    animation: v5-drift-b 32s ease-in-out infinite alternate;
  }
  .v5-blob-magenta {
    width: 42vmax; height: 42vmax;
    bottom: -14vmax; left: 22%;
    background: radial-gradient(circle at 50% 50%, rgba(217,70,239,0.38), transparent 65%);
    animation: v5-drift-c 38s ease-in-out infinite alternate;
  }
  @keyframes v5-drift-a {
    0%   { transform: translate(0, 0) scale(1); }
    50%  { transform: translate(9vmax, 6vmax) scale(1.12); }
    100% { transform: translate(-4vmax, 12vmax) scale(0.94); }
  }
  @keyframes v5-drift-b {
    0%   { transform: translate(0, 0) scale(1.05); }
    50%  { transform: translate(-10vmax, -7vmax) scale(0.92); }
    100% { transform: translate(-5vmax, 8vmax) scale(1.15); }
  }
  @keyframes v5-drift-c {
    0%   { transform: translate(0, 0) scale(0.95); }
    50%  { transform: translate(8vmax, -9vmax) scale(1.1); }
    100% { transform: translate(-7vmax, -3vmax) scale(1); }
  }
  .v5-stars {
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(1px 1px at 12% 22%, rgba(255,255,255,0.7) 50%, transparent 51%),
      radial-gradient(1px 1px at 38% 8%, rgba(255,255,255,0.45) 50%, transparent 51%),
      radial-gradient(1.5px 1.5px at 67% 18%, rgba(255,255,255,0.6) 50%, transparent 51%),
      radial-gradient(1px 1px at 84% 34%, rgba(255,255,255,0.4) 50%, transparent 51%),
      radial-gradient(1px 1px at 24% 58%, rgba(255,255,255,0.5) 50%, transparent 51%),
      radial-gradient(1.5px 1.5px at 55% 72%, rgba(255,255,255,0.35) 50%, transparent 51%),
      radial-gradient(1px 1px at 78% 84%, rgba(255,255,255,0.55) 50%, transparent 51%),
      radial-gradient(1px 1px at 8% 88%, rgba(255,255,255,0.35) 50%, transparent 51%),
      radial-gradient(1px 1px at 92% 62%, rgba(255,255,255,0.45) 50%, transparent 51%);
    animation: v5-twinkle 7s ease-in-out infinite alternate;
  }
  @keyframes v5-twinkle {
    from { opacity: 0.5; }
    to   { opacity: 1; }
  }

  /* ---- Glass primitives ------------------------------------------ */
  .v5-glass {
    position: relative;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 24px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.14),
      inset 0 0 60px rgba(139,92,246,0.06),
      0 24px 60px rgba(0,0,0,0.45);
  }
  .v5-gradient-text {
    background: linear-gradient(100deg, #a5b4fc 0%, #e9d5ff 35%, #f0abfc 60%, #99f6e4 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .v5-pill {
    display: inline-flex;
    align-items: center;
    padding: 0.35rem 0.95rem;
    border-radius: 9999px;
    font-size: 0.78rem;
    font-weight: 400;
    letter-spacing: 0.06em;
    color: rgba(240,171,252,0.92);
    background: rgba(217,70,239,0.10);
    border: 1px solid rgba(217,70,239,0.28);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
  .v5-chip {
    display: inline-flex;
    align-items: center;
    padding: 0.45rem 1.05rem;
    border-radius: 9999px;
    font-size: 0.8rem;
    font-weight: 400;
    letter-spacing: 0.05em;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.14);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  .v5-input {
    width: 100%;
    border-radius: 16px;
    padding: 0.85rem 1rem;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.14);
    color: #fff;
    font-size: 1.05rem;
    font-weight: 300;
    text-align: center;
    letter-spacing: 0.12em;
    outline: none;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
  }
  .v5-input::placeholder {
    color: rgba(255,255,255,0.28);
    letter-spacing: 0.06em;
  }
  .v5-input:focus {
    border-color: rgba(167,139,250,0.65);
    background: rgba(255,255,255,0.08);
    box-shadow: 0 0 0 4px rgba(139,92,246,0.16), 0 0 26px rgba(139,92,246,0.25);
  }
  .v5-input::-webkit-outer-spin-button,
  .v5-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .v5-input[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield;
  }
  .v5-cta {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    border-radius: 9999px;
    padding: 0.95rem 2.4rem;
    font-size: 0.95rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    color: #0b0722;
    background: linear-gradient(100deg, #a5b4fc, #e9d5ff 40%, #f0abfc 70%, #99f6e4);
    border: none;
    cursor: pointer;
    box-shadow:
      0 0 30px rgba(139,92,246,0.45),
      0 8px 28px rgba(217,70,239,0.30),
      inset 0 1px 0 rgba(255,255,255,0.55);
    transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
  }
  .v5-cta:hover {
    transform: translateY(-2px);
    filter: brightness(1.08);
    box-shadow:
      0 0 44px rgba(139,92,246,0.6),
      0 14px 36px rgba(217,70,239,0.4),
      inset 0 1px 0 rgba(255,255,255,0.6);
  }
  .v5-cta:active {
    transform: translateY(0);
  }
  .v5-rise {
    animation: v5-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  @keyframes v5-rise {
    from { opacity: 0; transform: translateY(26px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .v5-nav-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.55rem 1.25rem;
    border-radius: 9999px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.14);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 10px 30px rgba(0,0,0,0.35);
  }
  .v5-list-item {
    position: relative;
    padding-left: 1.4rem;
    font-weight: 300;
    line-height: 1.65;
    color: rgba(255,255,255,0.72);
  }
  .v5-list-item::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.72em;
    width: 7px;
    height: 7px;
    border-radius: 9999px;
    background: linear-gradient(135deg, #a78bfa, #5eead4);
    box-shadow: 0 0 8px rgba(167,139,250,0.7);
  }

  /* ------------------------------------------------------------ */
  /* 3D HOLOGRAPHIC FOIL CARD                                      */
  /* ------------------------------------------------------------ */

  /* Floating shell + neon halo beneath the card                   */
  .v5-holo-wrap {
    position: relative;
    width: min(350px, 84vw);
    aspect-ratio: 2 / 3;
    animation: v5-holo-float 7s ease-in-out infinite;
  }
  @keyframes v5-holo-float {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-10px); }
  }
  .v5-holo-halo {
    position: absolute;
    left: 6%;
    right: 6%;
    bottom: -8%;
    height: 20%;
    border-radius: 50%;
    background: radial-gradient(ellipse at center,
      rgba(167,139,250,0.55) 0%,
      rgba(45,212,191,0.30) 45%,
      rgba(217,70,239,0.12) 62%,
      transparent 72%);
    filter: blur(26px);
    animation: v5-holo-halo 9s ease-in-out infinite alternate;
    pointer-events: none;
  }
  @keyframes v5-holo-halo {
    from { opacity: 0.55; transform: scaleX(0.94); }
    to   { opacity: 0.9;  transform: scaleX(1.05); }
  }

  /* 3D scene: perspective container -> flip-in wrapper -> tilted card.
     Flip and tilt live on separate elements so the mount animation
     never fights the pointer-driven transform.                     */
  .v5-holo-scene {
    position: absolute;
    inset: 0;
    perspective: 1000px;
  }
  .v5-holo-flip {
    position: absolute;
    inset: 0;
    transform-style: preserve-3d;
    animation: v5-holo-flip 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  @keyframes v5-holo-flip {
    from { transform: rotateY(90deg); opacity: 0; }
    to   { transform: rotateY(0deg);  opacity: 1; }
  }
  .v5-holo-card {
    position: absolute;
    inset: 0;
    border-radius: 22px;
    border: 1px solid transparent;
    /* Translucent glass body (padding-box) + 1px rainbow foil edge
       (border-box) that rotates with the pointer angle var.       */
    background:
      linear-gradient(160deg, rgba(13,18,42,0.62), rgba(9,12,30,0.55)) padding-box,
      conic-gradient(from var(--v5-holo-a, 200deg),
        #f0abfc, #a5b4fc, #99f6e4, #e9d5ff, #fda4af, #f0abfc) border-box;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    transform: rotateX(var(--v5-rx, 0deg)) rotateY(var(--v5-ry, 0deg));
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    box-shadow:
      0 30px 70px rgba(0,0,0,0.55),
      0 0 60px rgba(139,92,246,0.18);
    overflow: hidden;
  }

  /* Foil layers — sit UNDER the line art so the pale strokes catch
     the light above the rainbow.                                  */
  .v5-holo-sheen {
    position: absolute;
    inset: -25%;
    pointer-events: none;
    background: conic-gradient(
      from calc(var(--v5-holo-a, 200deg) + 90deg)
      at var(--v5-mx, 50%) var(--v5-my, 50%),
      rgba(255,0,128,0.55),
      rgba(255,170,0,0.5),
      rgba(240,255,60,0.45),
      rgba(0,255,170,0.5),
      rgba(0,160,255,0.55),
      rgba(170,0,255,0.55),
      rgba(255,0,128,0.55));
    mix-blend-mode: color-dodge;
    opacity: calc(0.3 + var(--v5-holo-o, 0) * 0.4);
    transition: opacity 0.35s ease;
  }
  .v5-holo-sweep {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(105deg,
      transparent 30%,
      rgba(255,255,255,0.5) calc(var(--v5-mx, 50%) - 8%),
      rgba(170,220,255,0.35) var(--v5-mx, 50%),
      transparent calc(var(--v5-mx, 50%) + 18%));
    mix-blend-mode: overlay;
    opacity: calc(0.3 + var(--v5-holo-o, 0) * 0.5);
    transition: opacity 0.35s ease;
  }
  .v5-holo-sparkle {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image:
      radial-gradient(1.2px 1.2px at 22% 30%, rgba(255,255,255,0.95) 50%, transparent 51%),
      radial-gradient(1px 1px at 64% 18%, rgba(255,255,255,0.8) 50%, transparent 51%),
      radial-gradient(1.4px 1.4px at 82% 55%, rgba(255,255,255,0.9) 50%, transparent 51%),
      radial-gradient(1px 1px at 40% 74%, rgba(255,255,255,0.75) 50%, transparent 51%),
      radial-gradient(1.2px 1.2px at 8% 62%, rgba(255,255,255,0.85) 50%, transparent 51%),
      radial-gradient(1px 1px at 52% 42%, rgba(255,255,255,0.7) 50%, transparent 51%);
    background-size: 140px 140px, 180px 180px, 110px 110px, 160px 160px, 130px 130px, 200px 200px;
    background-position:
      calc(var(--v5-mx, 50%) * 0.35) calc(var(--v5-my, 50%) * 0.35),
      calc(var(--v5-mx, 50%) * -0.3) calc(var(--v5-my, 50%) * 0.25),
      calc(var(--v5-mx, 50%) * 0.2) calc(var(--v5-my, 50%) * -0.3),
      calc(var(--v5-mx, 50%) * -0.25) calc(var(--v5-my, 50%) * -0.2),
      calc(var(--v5-mx, 50%) * 0.3) calc(var(--v5-my, 50%) * 0.15),
      calc(var(--v5-mx, 50%) * -0.15) calc(var(--v5-my, 50%) * 0.3);
    mix-blend-mode: screen;
    opacity: calc(0.25 + var(--v5-holo-o, 0) * 0.35);
    animation: v5-holo-sparkle 5s ease-in-out infinite alternate;
  }
  @keyframes v5-holo-sparkle {
    from { filter: brightness(0.8); }
    to   { filter: brightness(1.3); }
  }

  /* Content above the foil --------------------------------------- */
  .v5-holo-inner {
    position: absolute;
    inset: 0;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8% 12% 23%;
  }
  .v5-holo-numeral {
    font-size: 1.15rem;
    font-weight: 200;
    letter-spacing: 0.4em;
    text-indent: 0.4em;
    text-transform: uppercase;
    color: #ece9ff;
    text-shadow:
      0 0 12px rgba(196,181,253,0.9),
      0 0 38px rgba(217,70,239,0.5);
  }
  .v5-holo-art {
    flex: 1;
    min-height: 0;
    width: 100%;
    padding: 0.9rem 0.4rem;
    color: #f2efff;
    filter:
      drop-shadow(0 0 6px rgba(196,181,253,0.75))
      drop-shadow(0 0 22px rgba(139,92,246,0.45));
  }
  .v5-holo-name {
    position: absolute;
    left: 5%;
    right: 5%;
    bottom: 4.5%;
    z-index: 3;
    padding: 0.6rem 1rem;
    border-radius: 14px;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.16);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    font-size: 0.82rem;
    font-weight: 300;
    letter-spacing: 0.22em;
    text-indent: 0.22em;
    text-transform: uppercase;
    text-align: center;
    color: rgba(255,255,255,0.92);
    text-shadow: 0 0 10px rgba(196,181,253,0.6);
  }

  /* ---- Mini glass card (grid + compatible). Cheap: no tilt, no   */
  /* foil layers — just a holo border that fades in on hover.       */
  .v5-mini {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    aspect-ratio: 2 / 3;
    border-radius: 18px;
    padding: 11% 10% 13%;
    border: 1px solid transparent;
    background:
      linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.03)) padding-box,
      linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.06)) border-box;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    text-decoration: none;
    overflow: hidden;
    transition:
      transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
      box-shadow 0.3s ease;
  }
  .v5-mini:hover {
    transform: translateY(-5px);
    background:
      linear-gradient(rgba(255,255,255,0.07), rgba(255,255,255,0.04)) padding-box,
      conic-gradient(from 200deg, #f0abfc, #a5b4fc, #99f6e4, #e9d5ff, #f0abfc) border-box;
    box-shadow:
      0 0 26px rgba(139,92,246,0.35),
      0 14px 30px rgba(0,0,0,0.4);
  }
  .v5-mini:focus-visible {
    outline: 2px solid #a78bfa;
    outline-offset: 3px;
  }
  .v5-mini-num {
    font-size: 0.95rem;
    font-weight: 200;
    letter-spacing: 0.3em;
    text-indent: 0.3em;
    color: #ddd6fe;
    text-shadow: 0 0 10px rgba(167,139,250,0.7);
  }
  .v5-mini-art {
    flex: 1;
    min-height: 0;
    width: 100%;
    padding: 0.55rem 0.15rem;
    color: #efeaff;
    filter: drop-shadow(0 0 5px rgba(196,181,253,0.55));
  }
  .v5-mini-name {
    font-size: 0.72rem;
    font-weight: 300;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    text-align: center;
    color: rgba(255,255,255,0.85);
  }

  /* ---- Reduced motion ------------------------------------------- */
  @media (prefers-reduced-motion: reduce) {
    .v5-blob,
    .v5-stars,
    .v5-rise,
    .v5-holo-wrap,
    .v5-holo-halo,
    .v5-holo-flip,
    .v5-holo-sparkle {
      animation: none !important;
    }
    .v5-cta,
    .v5-input,
    .v5-mini,
    .v5-holo-card,
    .v5-holo-sheen,
    .v5-holo-sweep {
      transition: none !important;
    }
    .v5-cta:hover,
    .v5-mini:hover {
      transform: none !important;
    }
  }
`;

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                          */
/* ------------------------------------------------------------------ */

export function GradientText({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={`v5-gradient-text ${className}`}>{children}</span>;
}

export function KeywordPill({ label }: { label: string }) {
  return <span className="v5-pill">{label}</span>;
}

export function Chip({
  label,
  accent = "rgba(255,255,255,0.55)",
}: {
  label: string;
  accent?: string;
}) {
  return (
    <span className="v5-chip" style={{ color: accent }}>
      {label}
    </span>
  );
}

export function SectionHeading({
  kicker,
  title,
}: {
  kicker: string;
  title: ReactNode;
}) {
  return (
    <div className="mb-8 text-center">
      <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.35em] text-teal-200/70">
        {kicker}
      </p>
      <h2 className="text-3xl font-light tracking-tight text-white/90 sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}

export function AuroraBackdrop() {
  return (
    <div className="v5-aurora" aria-hidden="true">
      <div className="v5-blob v5-blob-violet" />
      <div className="v5-blob v5-blob-teal" />
      <div className="v5-blob v5-blob-magenta" />
      <div className="v5-stars" />
    </div>
  );
}

export function V5Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.07] py-10 text-center">
      <p className="text-[11px] font-light uppercase tracking-[0.3em] text-white/35">
        Astro Scope — design variant v5 · Aurora Glass
      </p>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Mini glass card (grid + compatible arcanas)                          */
/* ------------------------------------------------------------------ */

export function MiniHoloCard({
  card,
  className = "",
}: {
  card: ArcanaCard;
  className?: string;
}) {
  return (
    <Link
      href={`${ARCANA_ROUTES_BASE}/${card.number}`}
      className={`v5-mini ${className}`}
      aria-label={`${card.name} — arcana ${card.number}`}
    >
      <span className="v5-mini-num">{toRoman(card.number)}</span>
      <span className="v5-mini-art">
        <ArcanaArt number={card.number} />
      </span>
      <span className="v5-mini-name">{card.name}</span>
    </Link>
  );
}

/* Re-exported for pages that only need the type */
export type { ArcanaCard };
