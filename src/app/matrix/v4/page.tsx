"use client";

// DESTINY MATRIX — VARIANT V4 "THE CONSTELLATION MAP".
// Same engine and geometry as v1 (math from @/lib/destiny-matrix, octagram
// construction ported inline — no imports from the v1 page), but a different
// composition: the octagram is rendered as a STAR MAP — glowing star-points
// instead of circled numbers, the age ring drawn as a celestial coordinate
// circle with degree ticks — with a floating glass date console top-center,
// a horizontal purpose readout strip overlapping the diagram from above and
// a compact 7-row health readout overlapping it from below. Plates stay
// translucent so the star map glows through them. Production palette only
// (lab/remix-v2). Scoped styles use the lm4- prefix.

import { useRef, useState } from "react";
import Link from "next/link";
import { fromParts, reduceNumber } from "@/lib/destiny-matrix";
import type { DestinyMatrix } from "@/lib/destiny-matrix";

/* ------------------------------------------------------------------ */
/* Production palette (from lab/remix-v2)                              */
/* ------------------------------------------------------------------ */
const BG = "#0a0912"; // rgb(10,9,18)
const GOLD = "#f3c77a";
const GOLD_DEEP = "#c9a227"; // darker gold for hairlines
const CREAM = "#ffdd9c";
const VIOLET = "#a25adf";
const VIOLET_SOFT = "#b794f6";
const TEXT_HI = "#e9e6f2";
const TEXT_LO = "#b7b1cc";

/* ------------------------------------------------------------------ */
/* Geometry helpers (ported from v1)                                   */
/* ------------------------------------------------------------------ */
const DEG = Math.PI / 180;

/** deg 0 = top of the circle, running clockwise. */
function onCircle(cx: number, cy: number, r: number, deg: number) {
  const t = (deg - 90) * DEG;
  return { x: +(cx + r * Math.cos(t)).toFixed(1), y: +(cy + r * Math.sin(t)).toFixed(1) };
}

function mid(p: { x: number; y: number }, q: { x: number; y: number }) {
  return { x: +((p.x + q.x) / 2).toFixed(1), y: +((p.y + q.y) / 2).toFixed(1) };
}

function mulberry32(seed: number) {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ */
/* Text / math helpers                                                 */
/* ------------------------------------------------------------------ */
// glyphs carry U+FE0E so they render as text, never emoji
const FE = "\uFE0E";

/** Column totals can exceed 99 — fold until the number rests in 1–22. */
function foldTotal(n: number): number {
  let v = n;
  while (v > 22) v = reduceNumber(v);
  return v;
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */
const TAROT_TABS: { href: string; label: string; active?: boolean }[] = [
  { href: "/tarot", label: "Tarot" },
  { href: "/tarot/spreads/daily-card", label: "Daily Card" },
  { href: "/tarot/spreads/yes-no", label: "Yes / No" },
  { href: "/tarot/spreads/past-present-future", label: "Past · Present · Future" },
  { href: "/tarot/spreads/love-three-card", label: "Love" },
  { href: "/tarot/birth-arcana", label: "Birth Arcana" },
  { href: "/tarot/cards", label: "Cards" },
  { href: "/matrix", label: "Matrix", active: true },
];

const MATRIX_VARIANTS: { href: string; label: string; active?: boolean }[] = [
  { href: "/matrix/v1", label: "V1" },
  { href: "/matrix/v2", label: "V2" },
  { href: "/matrix/v3", label: "V3" },
  { href: "/matrix/v4", label: "V4", active: true },
];

interface ChakraRow {
  no: string;
  name: string;
  sanskrit: string;
  body: number;
  energy: number;
  emotions: number;
}

function chakraRows(m: DestinyMatrix): ChakraRow[] {
  const h = m.chartHeart;
  return [
    { no: "I", name: "Crown", sanskrit: "Sahasrara", body: h.sahphysics, energy: h.sahenergy, emotions: h.sahemotions },
    { no: "II", name: "Third eye", sanskrit: "Ajna", body: h.ajphysics, energy: h.ajenergy, emotions: h.ajemotions },
    { no: "III", name: "Throat", sanskrit: "Vishuddha", body: h.vishphysics, energy: h.vishenergy, emotions: h.vishemotions },
    { no: "IV", name: "Heart", sanskrit: "Anahata", body: h.anahphysics, energy: h.anahenergy, emotions: h.anahemotions },
    { no: "V", name: "Solar plexus", sanskrit: "Manipura", body: h.manphysics, energy: h.manenergy, emotions: h.manemotions },
    { no: "VI", name: "Sacral", sanskrit: "Svadhisthana", body: h.svadphysics, energy: h.svadenergy, emotions: h.svademotions },
    { no: "VII", name: "Root", sanskrit: "Muladhara", body: h.mulphysics, energy: h.mulenergy, emotions: h.mulemotions },
  ];
}

const FAQ = [
  {
    q: "What is the Destiny Matrix?",
    a: "A numerological method that folds the day, month and year of birth into twenty-two positions on an eight-pointed star — one for each Major Arcana. Every position answers a different question: character, talents, money, love, karma, purpose. The chart does not change across your life; your reading of it does.",
  },
  {
    q: "Why does no number in the chart exceed 22?",
    a: "The matrix speaks in the twenty-two Major Arcana, so every sum is folded back into 1–22: anything above 22 has its digits added together. Exactly 22 stays whole — the Fool's number, kept rather than pressed into a smaller one.",
  },
  {
    q: "What do chakras have to do with a birth date?",
    a: "The vertical and horizontal lines running through the center of the octagram form the health map: seven stations from Crown to Root, each carrying a Body, Energy and Emotions number. Read it as an instrument panel — where the charge flows and where it leaks.",
  },
  {
    q: "Is this the same as my Life Path number?",
    a: "Same digits, different fold. Life Path presses the whole date into a single number from 1 to 9. The Destiny Matrix stops the reduction at 22 and keeps every intermediate sum, so one date opens a whole chart instead of a single digit.",
  },
];

// star field, generated once at module scope
const STARS = (() => {
  const rnd = mulberry32(20260805);
  return Array.from({ length: 110 }, (_, i) => ({
    x: +(rnd() * 1600).toFixed(0),
    y: +(rnd() * 1000).toFixed(0),
    r: +(0.5 + rnd() * 1.1).toFixed(2),
    o: +(0.14 + rnd() * 0.4).toFixed(2),
    tw: i % 5 === 0,
    d: +(rnd() * 8).toFixed(1),
    key: i,
  }));
})();

// faint background stars sprinkled inside the star-map diagram itself
const CHART_STARS = (() => {
  const rnd = mulberry32(4104);
  return Array.from({ length: 42 }, (_, i) => ({
    x: +(30 + rnd() * 620).toFixed(1),
    y: +(30 + rnd() * 620).toFixed(1),
    r: +(0.4 + rnd() * 0.9).toFixed(2),
    o: +(0.1 + rnd() * 0.3).toFixed(2),
    tw: i % 6 === 0,
    d: +(rnd() * 9).toFixed(1),
    key: i,
  }));
})();

/* ------------------------------------------------------------------ */
/* Scoped styles (lm4- prefix)                                         */
/* ------------------------------------------------------------------ */
const LM4_STYLES = `
  .lm4-serif { font-family: "Playfair Display", "Cormorant Garamond", Georgia, "Times New Roman", serif; }
  .lm4-glyph { font-family: "Noto Sans Symbols", "Noto Sans Symbols 2", Symbola, "Segoe UI Symbol", serif; font-style: normal; }

  /* glass plates stay translucent so the star map passes visibly BEHIND them */
  .lm4-glass {
    background: linear-gradient(165deg, rgba(23,19,40,0.52), rgba(12,10,22,0.66));
    border: 1px solid rgba(233,230,242,0.10);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
  }
  .lm4-chip {
    display: inline-block;
    border: 1px solid rgba(243,199,122,0.35);
    background: rgba(10,9,18,0.85);
    padding: 4px 10px;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #f3c77a;
  }

  .lm4-input { background: transparent; outline: none; }
  .lm4-input:focus { background: rgba(243,199,122,0.06); }
  .lm4-input::selection { background: rgba(243,199,122,0.3); }

  /* ---- magic background motion (all slow, all guarded below) ---- */
  @keyframes lm4-spin     { to { transform: rotate(360deg); } }
  @keyframes lm4-spin-rev { to { transform: rotate(-360deg); } }
  @keyframes lm4-twinkle  { 0%,100% { opacity: 0.12; } 50% { opacity: 0.8; } }
  @keyframes lm4-floatA   { 0%,100% { transform: translate(0,0) rotate(-2deg); } 50% { transform: translate(1.5vw,-2vh) rotate(1deg); } }
  @keyframes lm4-floatB   { 0%,100% { transform: translate(0,0) rotate(3deg); } 50% { transform: translate(-1.5vw,2vh) rotate(-1deg); } }
  @keyframes lm4-sheen    { 0% { transform: translateX(-130%) skewX(-18deg); } 55%,100% { transform: translateX(240%) skewX(-18deg); } }
  .lm4-wheel-spin      { animation: lm4-spin 300s linear infinite; transform-origin: 50% 50%; }
  .lm4-wheel-spin-rev  { animation: lm4-spin-rev 360s linear infinite; transform-origin: 50% 50%; }
  .lm4-twinkle         { animation: lm4-twinkle 7s ease-in-out infinite; }
  .lm4-float-a         { animation: lm4-floatA 34s ease-in-out infinite; }
  .lm4-float-b         { animation: lm4-floatB 42s ease-in-out infinite; }
  .lm4-nebula          { animation: lm4-floatA 60s ease-in-out infinite; }
  .lm4-sheen           { animation: lm4-sheen 9s ease-in-out infinite; }
  /* the sun hand — a bright dot riding the coordinate circle */
  .lm4-orbit           { animation: lm4-spin 110s linear infinite; }

  /* ---- result reveal: lines draw on, stars flare in, glows breathe ---- */
  .lm4-draw      { stroke-dasharray: 1600; stroke-dashoffset: 1600; animation: lm4-draw 2.8s ease-out forwards; }
  .lm4-draw-fast { stroke-dasharray: 700;  stroke-dashoffset: 700;  animation: lm4-draw 2s ease-out forwards; }
  .lm4-rise      { opacity: 0; transform: translateY(10px); animation: lm4-rise 0.9s ease-out forwards; }
  .lm4-flare     { opacity: 0; animation: lm4-flare 1.1s ease-out forwards; }
  .lm4-halo      { animation: lm4-halo 6s ease-in-out infinite; }
  @keyframes lm4-draw  { to { stroke-dashoffset: 0; } }
  @keyframes lm4-rise  { to { opacity: 1; transform: translateY(0); } }
  @keyframes lm4-flare { 0% { opacity: 0; } 60% { opacity: 1; } 100% { opacity: 1; } }
  @keyframes lm4-halo  { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }

  @media (prefers-reduced-motion: reduce) {
    .lm4-wheel-spin, .lm4-wheel-spin-rev, .lm4-twinkle, .lm4-float-a, .lm4-float-b,
    .lm4-nebula, .lm4-sheen, .lm4-orbit, .lm4-halo { animation: none !important; }
    .lm4-draw, .lm4-draw-fast { animation: none !important; stroke-dashoffset: 0; }
    .lm4-rise, .lm4-flare { animation: none !important; opacity: 1; transform: none; }
  }
`;

/* ------------------------------------------------------------------ */
/* Backdrop — coordinate wheels, star field, ecliptic arcs, glyphs     */
/* ------------------------------------------------------------------ */
function CoordinateWheelSvg() {
  const C = 500;
  const sq = (deg: number) => [0, 90, 180, 270].map((a) => onCircle(C, C, 360, a + deg));
  const diamond = sq(0).map((p) => `${p.x},${p.y}`).join(" ");
  const axis = sq(45).map((p) => `${p.x},${p.y}`).join(" ");
  return (
    <svg viewBox="0 0 1000 1000" className="h-full w-full">
      <circle cx={C} cy={C} r={486} fill="none" stroke={GOLD} strokeWidth={1} />
      <circle cx={C} cy={C} r={430} fill="none" stroke={GOLD} strokeWidth={0.6} strokeDasharray="2 6" />
      <circle cx={C} cy={C} r={360} fill="none" stroke={VIOLET_SOFT} strokeWidth={0.6} />
      <circle cx={C} cy={C} r={140} fill="none" stroke={GOLD} strokeWidth={0.5} />
      <polygon points={diamond} fill="none" stroke={GOLD} strokeWidth={0.8} />
      <polygon points={axis} fill="none" stroke={VIOLET_SOFT} strokeWidth={0.8} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const p = onCircle(C, C, 486, deg);
        return <line key={deg} x1={C} y1={C} x2={p.x} y2={p.y} stroke={GOLD_DEEP} strokeWidth={0.4} />;
      })}
      {Array.from({ length: 96 }, (_, k) => {
        const a = (360 / 96) * k;
        const p1 = onCircle(C, C, 430, a);
        const p2 = onCircle(C, C, 486, a);
        return <line key={k} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={GOLD} strokeWidth={k % 12 === 0 ? 1.3 : 0.45} />;
      })}
      {Array.from({ length: 8 }, (_, i) => {
        const p = onCircle(C, C, 250, (360 / 8) * i + 22.5);
        return <circle key={i} cx={p.x} cy={p.y} r={4} fill="none" stroke={VIOLET_SOFT} strokeWidth={0.7} />;
      })}
    </svg>
  );
}

function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* nebula washes */}
      <div className="lm4-nebula absolute -left-[20vw] top-[6vh] h-[70vmin] w-[70vmin] bg-[radial-gradient(circle,rgba(162,90,223,0.11),transparent_65%)]" />
      <div className="lm4-nebula absolute right-[-12vw] top-[48vh] h-[80vmin] w-[80vmin] bg-[radial-gradient(circle,rgba(243,199,122,0.08),transparent_65%)]" />
      <div className="lm4-nebula absolute left-[24vw] bottom-[-18vh] h-[60vmin] w-[60vmin] bg-[radial-gradient(circle,rgba(183,148,246,0.07),transparent_65%)]" />

      {/* two huge coordinate wheels, half off-screen, counter-rotating */}
      <div className="lm4-wheel-spin absolute -top-[42vmin] -right-[48vmin] h-[150vmin] w-[150vmin] opacity-[0.07]">
        <CoordinateWheelSvg />
      </div>
      <div className="lm4-wheel-spin-rev absolute -bottom-[46vmin] -left-[44vmin] h-[130vmin] w-[130vmin] opacity-[0.055]">
        <CoordinateWheelSvg />
      </div>

      <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        {/* star specks */}
        {STARS.map((s) =>
          s.tw ? (
            <circle key={s.key} cx={s.x} cy={s.y} r={s.r} fill={CREAM} className="lm4-twinkle" style={{ animationDelay: `${s.d}s`, opacity: s.o }} />
          ) : (
            <circle key={s.key} cx={s.x} cy={s.y} r={s.r} fill={TEXT_LO} opacity={s.o} />
          ),
        )}

        {/* ecliptic arcs, centers pushed off-canvas */}
        <circle cx={1730} cy={240} r={520} fill="none" stroke={GOLD_DEEP} strokeWidth={0.5} opacity={0.4} />
        <circle cx={1730} cy={240} r={700} fill="none" stroke={GOLD_DEEP} strokeWidth={0.4} opacity={0.26} strokeDasharray="2 7" />
        <circle cx={-160} cy={880} r={420} fill="none" stroke={VIOLET} strokeWidth={0.5} opacity={0.34} />
        <circle cx={-160} cy={880} r={560} fill="none" stroke={VIOLET} strokeWidth={0.4} opacity={0.2} strokeDasharray="2 8" />

        {/* graticule lines crossing the whole page */}
        <line x1={-80} y1={180} x2={1700} y2={760} stroke={TEXT_LO} strokeWidth={0.4} opacity={0.18} />
        <line x1={-80} y1={940} x2={1680} y2={120} stroke={TEXT_LO} strokeWidth={0.4} opacity={0.13} />
        <line x1={1240} y1={-60} x2={1240} y2={1060} stroke={GOLD_DEEP} strokeWidth={0.4} opacity={0.18} strokeDasharray="1 6" />
        {[160, 380, 620, 860].map((y) => (
          <line key={y} x1={1232} y1={y} x2={1248} y2={y} stroke={GOLD} strokeWidth={0.7} opacity={0.4} />
        ))}

        {/* constellation: Lyra-ish */}
        <g opacity={0.55}>
          <polyline points="180,160 258,208 344,182 402,252 318,286 236,258" fill="none" stroke={VIOLET_SOFT} strokeWidth={0.6} opacity={0.5} />
          {[[180, 160], [258, 208], [344, 182], [402, 252], [318, 286], [236, 258]].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={1.7} fill={TEXT_HI} opacity={0.8} />
          ))}
        </g>
      </svg>

      {/* giant dim glyphs drifting behind sections */}
      <span className="lm4-glyph lm4-float-a absolute left-[3vw] top-[70vh] text-[26vmin] leading-none text-[#b794f6] opacity-[0.055]">
        ✦{FE}
      </span>
      <span className="lm4-glyph lm4-float-b absolute right-[6vw] top-[160vh] text-[30vmin] leading-none text-[#f3c77a] opacity-[0.05]">
        ☉{FE}
      </span>
      <span className="lm4-glyph lm4-float-a absolute left-[38vw] top-[280vh] text-[24vmin] leading-none text-[#e9e6f2] opacity-[0.04]">
        ☽{FE}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Header + cross-nav tabs + variant switcher                          */
/* ------------------------------------------------------------------ */
function Header() {
  return (
    <header className="relative border-b border-white/[0.07]">
      <div className="mx-auto flex max-w-6xl items-center gap-5 px-5 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="lm4-glyph grid h-7 w-7 place-items-center border border-[#f3c77a]/40 bg-[#f3c77a]/[0.07] text-[13px] text-[#f3c77a]">
            ☾{FE}
          </span>
          <span className="lm4-serif text-[16px] tracking-wide text-[#e9e6f2]">Astro Scope</span>
        </Link>
        <span className="hidden font-mono text-[9px] tracking-[0.3em] text-[#b7b1cc]/50 sm:inline">
          DESTINY MATRIX · CARTA CAELESTIS
        </span>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/" className="hidden text-[12.5px] text-[#b7b1cc] transition-colors hover:text-[#e9e6f2] sm:inline">
            Sign in
          </Link>
          <Link
            href="#lm4-tool"
            className="border border-[#f3c77a]/50 bg-[#f3c77a]/10 px-3 py-1.5 text-[12.5px] text-[#ffdd9c] transition-colors hover:bg-[#f3c77a]/20"
          >
            Compute
          </Link>
        </div>
      </div>

      {/* cross-nav tabs — all tarot pages plus the matrix, current one lit */}
      <nav aria-label="Tools" className="border-t border-white/[0.05]">
        <div className="mx-auto flex max-w-6xl items-stretch gap-1 overflow-x-auto px-4 py-2 md:px-8">
          {TAROT_TABS.map((t, i) =>
            t.active ? (
              <span
                key={t.href}
                aria-current="page"
                className="lm4-chip shrink-0 -rotate-[0.4deg] !border-[#f3c77a]/70 !bg-[#f3c77a]/15 !text-[#ffdd9c]"
              >
                ✦ {t.label}
              </span>
            ) : (
              <Link
                key={t.href}
                href={t.href}
                className={`shrink-0 border border-transparent px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[#b7b1cc]/75 transition-colors hover:border-[#f3c77a]/30 hover:text-[#f3c77a] ${
                  i % 2 === 0 ? "rotate-[0.3deg]" : "-rotate-[0.3deg]"
                }`}
              >
                {t.label}
              </Link>
            ),
          )}
        </div>
      </nav>

      {/* variant switcher — the four matrix compositions */}
      <nav aria-label="Matrix variants" className="border-t border-white/[0.05]">
        <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-1.5 md:px-8">
          <span className="shrink-0 font-mono text-[7px] tracking-[0.3em] text-[#b7b1cc]/40">VARIANT</span>
          {MATRIX_VARIANTS.map((v, i) =>
            v.active ? (
              <span
                key={v.href}
                aria-current="page"
                className="shrink-0 rotate-[0.4deg] border border-[#b794f6]/60 bg-[#b794f6]/15 px-2.5 py-0.5 font-mono text-[9px] tracking-[0.22em] text-[#b794f6]"
              >
                {v.label} · CARTA
              </span>
            ) : (
              <Link
                key={v.href}
                href={v.href}
                className={`shrink-0 border border-white/[0.08] px-2.5 py-0.5 font-mono text-[9px] tracking-[0.22em] text-[#b7b1cc]/60 transition-colors hover:border-[#f3c77a]/40 hover:text-[#f3c77a] ${
                  i % 2 === 0 ? "rotate-[0.3deg]" : "-rotate-[0.3deg]"
                }`}
              >
                {v.label}
              </Link>
            ),
          )}
        </div>
      </nav>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* The star map — octagram rendered as a constellation chart           */
/* ------------------------------------------------------------------ */
function StarMapDiagram({ m }: { m: DestinyMatrix }) {
  const C = 340;
  const R = 190;
  const p = m.points;

  // cardinals — diamond square (0y/20y/40y/60y)
  const cardinals = [
    { deg: 270, value: p.apoint, age: "0Y", tag: "A" },
    { deg: 0, value: p.bpoint, age: "20Y", tag: "B" },
    { deg: 90, value: p.cpoint, age: "40Y", tag: "C" },
    { deg: 180, value: p.dpoint, age: "60Y", tag: "D" },
  ];
  // diagonals — axis square (10y/30y/50y/70y)
  const diagonals = [
    { deg: 315, value: p.fpoint, age: "10Y", tag: "F" },
    { deg: 45, value: p.gpoint, age: "30Y", tag: "G" },
    { deg: 135, value: p.ipoint, age: "50Y", tag: "I" },
    { deg: 225, value: p.hpoint, age: "70Y", tag: "H" },
  ];
  const outer = [...cardinals, ...diagonals].map((n) => ({ ...n, pos: onCircle(C, C, R, n.deg) }));

  // inner numbers along the spokes, straight from the engine's points
  const spoke = (deg: number, frac: number) => onCircle(C, C, R * frac, deg);
  const jPos = spoke(180, 0.46);
  const nPos = spoke(90, 0.46);
  const lPos = mid(jPos, nPos);
  const inner = [
    { pos: spoke(270, 0.2), value: p.wpoint, tag: "W", side: "L" as const },
    { pos: spoke(270, 0.42), value: p.spoint, tag: "S", side: "L" as const },
    { pos: spoke(270, 0.66), value: p.opoint, tag: "O", side: "L" as const },
    { pos: spoke(0, 0.2), value: p.xpoint, tag: "X", side: "R" as const },
    { pos: spoke(0, 0.42), value: p.tpoint, tag: "T", side: "R" as const },
    { pos: spoke(0, 0.66), value: p.ppoint, tag: "P", side: "R" as const },
    { pos: nPos, value: p.npoint, tag: "N", side: "U" as const },
    { pos: jPos, value: p.jpoint, tag: "J", side: "U" as const },
    { pos: mid(jPos, lPos), value: p.kpoint, tag: "K", side: "U" as const },
    { pos: lPos, value: p.lpoint, tag: "L", side: "U" as const },
    { pos: mid(lPos, nPos), value: p.mpoint, tag: "M", side: "U" as const },
  ];

  const diamondPts = cardinals.map((n) => onCircle(C, C, R, n.deg)).map((q) => `${q.x},${q.y}`).join(" ");
  const axisPts = diagonals.map((n) => onCircle(C, C, R, n.deg)).map((q) => `${q.x},${q.y}`).join(" ");

  return (
    <svg
      viewBox="0 0 680 680"
      className="w-full max-w-[640px]"
      role="img"
      aria-label={`Destiny matrix star map: day ${p.apoint}, month ${p.bpoint}, year ${p.cpoint}, base ${p.dpoint}, center ${p.epoint}`}
    >
      <defs>
        <radialGradient id="lm4-sky-glow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.16" />
          <stop offset="55%" stopColor={VIOLET} stopOpacity="0.07" />
          <stop offset="100%" stopColor={BG} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lm4-star-gold" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={CREAM} stopOpacity="0.9" />
          <stop offset="35%" stopColor={GOLD} stopOpacity="0.4" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lm4-star-violet" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={VIOLET_SOFT} stopOpacity="0.85" />
          <stop offset="35%" stopColor={VIOLET} stopOpacity="0.35" />
          <stop offset="100%" stopColor={VIOLET} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lm4-star-center" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={CREAM} stopOpacity="0.95" />
          <stop offset="40%" stopColor={GOLD} stopOpacity="0.45" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={C} cy={C} r={320} fill="url(#lm4-sky-glow)" />

      {/* faint field stars inside the chart */}
      {CHART_STARS.map((s) =>
        s.tw ? (
          <circle key={s.key} cx={s.x} cy={s.y} r={s.r} fill={CREAM} className="lm4-twinkle" style={{ animationDelay: `${s.d}s`, opacity: s.o }} />
        ) : (
          <circle key={s.key} cx={s.x} cy={s.y} r={s.r} fill={TEXT_LO} opacity={s.o} />
        ),
      )}

      {/* declination circles */}
      <circle cx={C} cy={C} r={R * 0.46} fill="none" stroke={VIOLET_SOFT} strokeOpacity="0.16" strokeWidth="0.5" strokeDasharray="1 5" />
      <circle cx={C} cy={C} r={R * 0.8} fill="none" stroke={VIOLET_SOFT} strokeOpacity="0.12" strokeWidth="0.5" strokeDasharray="1 6" />

      {/* the age ring as a celestial coordinate circle */}
      <circle className="lm4-draw" cx={C} cy={C} r={270} fill="none" stroke={GOLD_DEEP} strokeOpacity="0.6" strokeWidth="0.9" />
      <circle cx={C} cy={C} r={262} fill="none" stroke={GOLD_DEEP} strokeOpacity="0.3" strokeWidth="0.5" strokeDasharray="1 5" />
      {Array.from({ length: 120 }, (_, k) => {
        const a = (360 / 120) * k;
        const major = k % 10 === 0;
        const midTick = k % 5 === 0;
        const p1 = onCircle(C, C, major ? 256 : midTick ? 261 : 264, a);
        const p2 = onCircle(C, C, 270, a);
        return (
          <line
            key={k}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke={GOLD}
            strokeOpacity={major ? 0.65 : 0.28}
            strokeWidth={major ? 1 : 0.5}
          />
        );
      })}
      {/* degree readouts on the coordinate circle */}
      {Array.from({ length: 12 }, (_, k) => {
        const a = k * 30;
        const lp = onCircle(C, C, 292, a);
        return (
          <text
            key={a}
            className="lm4-rise"
            style={{ animationDelay: `${1.6 + k * 0.05}s` }}
            x={lp.x}
            y={lp.y + 3}
            textAnchor="middle"
            fontSize="8"
            fill={GOLD}
            opacity="0.7"
            fontFamily="ui-monospace, monospace"
            letterSpacing="1.5"
          >
            {String(a).padStart(3, "0")}°
          </text>
        );
      })}

      {/* the sun hand — one bright satellite riding the coordinate circle */}
      <g className="lm4-orbit" style={{ transformOrigin: `${C}px ${C}px` }}>
        <circle cx={C} cy={C - 270} r={9} fill="url(#lm4-star-gold)" />
        <circle cx={C} cy={C - 270} r={2.4} fill={CREAM} />
      </g>

      {/* spokes from the center to the eight outer stations */}
      {outer.map((n, i) => (
        <line
          key={`spoke-${n.tag}`}
          className="lm4-draw-fast"
          style={{ animationDelay: `${0.2 + i * 0.08}s` }}
          x1={C}
          y1={C}
          x2={n.pos.x}
          y2={n.pos.y}
          stroke={i % 2 === 0 ? GOLD : VIOLET_SOFT}
          strokeOpacity="0.28"
          strokeWidth="0.7"
        />
      ))}

      {/* the money line: J — K — L — M — N */}
      <line className="lm4-draw-fast" style={{ animationDelay: "0.9s" }} x1={jPos.x} y1={jPos.y} x2={nPos.x} y2={nPos.y} stroke={CREAM} strokeOpacity="0.35" strokeWidth="0.7" strokeDasharray="3 3" />

      {/* the two squares of the octagram — constellation lines */}
      <polygon className="lm4-draw" style={{ animationDelay: "0.4s" }} points={diamondPts} fill="none" stroke={GOLD} strokeOpacity="0.8" strokeWidth="1.1" />
      <polygon className="lm4-draw" style={{ animationDelay: "0.8s" }} points={axisPts} fill="none" stroke={VIOLET_SOFT} strokeOpacity="0.75" strokeWidth="1.1" />

      {/* inner stars — small flares with catalog labels */}
      {inner.map((n, i) => {
        const lx = n.side === "L" ? n.pos.x - 15 : n.side === "R" ? n.pos.x + 15 : n.pos.x;
        const ly = n.side === "U" ? n.pos.y - 13 : n.pos.y + 4;
        const anchor = n.side === "L" ? "end" : n.side === "R" ? "start" : "middle";
        return (
          <g key={`inner-${n.tag}`} className="lm4-flare" style={{ animationDelay: `${1.5 + i * 0.07}s` }}>
            <circle cx={n.pos.x} cy={n.pos.y} r={13} fill="url(#lm4-star-violet)" />
            <circle cx={n.pos.x} cy={n.pos.y} r={2.2} fill={VIOLET_SOFT} />
            <text
              x={lx}
              y={ly}
              textAnchor={anchor}
              fontSize="10"
              fill={VIOLET_SOFT}
              fontFamily="ui-monospace, monospace"
              stroke={BG}
              strokeWidth="3"
              paintOrder="stroke"
            >
              {n.value}
            </text>
          </g>
        );
      })}

      {/* outer stations — bright star-points with sparkle + catalog plate */}
      {outer.map((n, i) => {
        const vp = onCircle(C, C, R + 34, n.deg);
        const ap = onCircle(C, C, R + 56, n.deg);
        const goldStar = i % 2 === 0;
        return (
          <g key={`outer-${n.tag}`} className="lm4-flare" style={{ animationDelay: `${1.1 + i * 0.07}s` }}>
            <circle className="lm4-halo" cx={n.pos.x} cy={n.pos.y} r={30} fill={goldStar ? "url(#lm4-star-gold)" : "url(#lm4-star-violet)"} />
            {/* four-point sparkle */}
            <line x1={n.pos.x - 10} y1={n.pos.y} x2={n.pos.x + 10} y2={n.pos.y} stroke={CREAM} strokeOpacity="0.7" strokeWidth="0.7" />
            <line x1={n.pos.x} y1={n.pos.y - 10} x2={n.pos.x} y2={n.pos.y + 10} stroke={CREAM} strokeOpacity="0.7" strokeWidth="0.7" />
            <circle cx={n.pos.x} cy={n.pos.y} r={3.6} fill={CREAM} />
            {/* leader line to the catalog label */}
            <line x1={n.pos.x} y1={n.pos.y} x2={vp.x} y2={vp.y} stroke={goldStar ? GOLD : VIOLET_SOFT} strokeOpacity="0.3" strokeWidth="0.5" />
            <text
              x={vp.x}
              y={vp.y + 5}
              textAnchor="middle"
              fontSize="15"
              fill={CREAM}
              fontFamily="ui-monospace, monospace"
              stroke={BG}
              strokeWidth="3.5"
              paintOrder="stroke"
              letterSpacing="0.5"
            >
              {n.value}
              <tspan fontSize="7.5" fill={goldStar ? GOLD : VIOLET_SOFT} dx="3" dy="-5">
                {n.tag}
              </tspan>
            </text>
            {/* age tick label riding toward the coordinate circle */}
            <text
              x={ap.x}
              y={ap.y + 3}
              textAnchor="middle"
              fontSize="8"
              fill={GOLD}
              opacity="0.85"
              fontFamily="ui-monospace, monospace"
              letterSpacing="1.5"
              stroke={BG}
              strokeWidth="3"
              paintOrder="stroke"
            >
              {n.age}
            </text>
          </g>
        );
      })}

      {/* center — the brightest star, breathing */}
      <g className="lm4-flare" style={{ animationDelay: "1.9s" }}>
        <circle className="lm4-halo" cx={C} cy={C} r={64} fill="url(#lm4-star-center)" />
        <line x1={C - 16} y1={C} x2={C + 16} y2={C} stroke={CREAM} strokeOpacity="0.8" strokeWidth="0.8" />
        <line x1={C} y1={C - 16} x2={C} y2={C + 16} stroke={CREAM} strokeOpacity="0.8" strokeWidth="0.8" />
        <circle cx={C} cy={C} r={5.5} fill={CREAM} />
        <text x={C} y={C + 38} textAnchor="middle" fontSize="22" fill={GOLD} fontFamily="ui-monospace, monospace" letterSpacing="1" stroke={BG} strokeWidth="4" paintOrder="stroke">
          {p.epoint}
        </text>
        <text x={C} y={C + 54} textAnchor="middle" fontSize="6.5" letterSpacing="2.5" fill={VIOLET_SOFT} fontFamily="ui-monospace, monospace">
          STELLA CENTRALIS · E
        </text>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Ghost star map — placeholder sky before the first compute           */
/* ------------------------------------------------------------------ */
function GhostStarMap() {
  const C = 340;
  const R = 190;
  const ring = [0, 45, 90, 135, 180, 225, 270, 315].map((deg) => ({ deg, pos: onCircle(C, C, R, deg) }));
  const diamond = [0, 90, 180, 270].map((deg) => onCircle(C, C, R, deg)).map((q) => `${q.x},${q.y}`).join(" ");
  const axis = [45, 135, 225, 315].map((deg) => onCircle(C, C, R, deg)).map((q) => `${q.x},${q.y}`).join(" ");
  return (
    <svg viewBox="0 0 680 680" className="w-full max-w-[560px] opacity-45" aria-hidden>
      <defs>
        <radialGradient id="lm4-star-gold" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={CREAM} stopOpacity="0.9" />
          <stop offset="35%" stopColor={GOLD} stopOpacity="0.4" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lm4-star-violet" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={VIOLET_SOFT} stopOpacity="0.85" />
          <stop offset="35%" stopColor={VIOLET} stopOpacity="0.35" />
          <stop offset="100%" stopColor={VIOLET} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lm4-star-center" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={CREAM} stopOpacity="0.95" />
          <stop offset="40%" stopColor={GOLD} stopOpacity="0.45" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={C} cy={C} r={270} fill="none" stroke={GOLD_DEEP} strokeOpacity="0.5" strokeWidth="0.8" />
      <circle cx={C} cy={C} r={262} fill="none" stroke={GOLD_DEEP} strokeOpacity="0.25" strokeWidth="0.5" strokeDasharray="1 5" />
      {Array.from({ length: 120 }, (_, k) => {
        const a = (360 / 120) * k;
        const p1 = onCircle(C, C, k % 10 === 0 ? 256 : 264, a);
        const p2 = onCircle(C, C, 270, a);
        return <line key={k} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={GOLD} strokeOpacity={k % 10 === 0 ? 0.5 : 0.2} strokeWidth={k % 10 === 0 ? 0.9 : 0.5} />;
      })}
      <polygon points={diamond} fill="none" stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.9" strokeDasharray="4 4" />
      <polygon points={axis} fill="none" stroke={VIOLET_SOFT} strokeOpacity="0.45" strokeWidth="0.9" strokeDasharray="4 4" />
      {ring.map((n, i) => (
        <g key={n.deg}>
          <line x1={C} y1={C} x2={n.pos.x} y2={n.pos.y} stroke={i % 2 === 0 ? GOLD : VIOLET_SOFT} strokeOpacity="0.2" strokeWidth="0.6" />
          <circle className="lm4-halo" style={{ animationDelay: `${i * 0.6}s` }} cx={n.pos.x} cy={n.pos.y} r={16} fill={i % 2 === 0 ? "url(#lm4-star-gold)" : "url(#lm4-star-violet)"} />
          <circle cx={n.pos.x} cy={n.pos.y} r={2.4} fill={i % 2 === 0 ? GOLD : VIOLET_SOFT} />
        </g>
      ))}
      <circle className="lm4-halo" cx={C} cy={C} r={40} fill="url(#lm4-star-center)" />
      <circle cx={C} cy={C} r={3.5} fill={CREAM} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* The tool — floating console + layered star-map result               */
/* ------------------------------------------------------------------ */
function Tool() {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DestinyMatrix | null>(null);
  const [stamp, setStamp] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  function compute(e: React.FormEvent) {
    e.preventDefault();
    const d = parseInt(day, 10);
    const mo = parseInt(month, 10);
    const y = parseInt(year, 10);
    if (!/^\d{1,2}$/.test(day) || d < 1 || d > 31) {
      setError("DIES INVALIDA — day must be a number from 1 to 31.");
      setResult(null);
      return;
    }
    if (!/^\d{1,2}$/.test(month) || mo < 1 || mo > 12) {
      setError("MENSIS INVALIDA — month must be a number from 1 to 12.");
      setResult(null);
      return;
    }
    if (!/^\d{4}$/.test(year) || y < 1900 || y > 2100) {
      setError("ANNVS INVALIDVS — year must be four digits, 1900–2100.");
      setResult(null);
      return;
    }
    try {
      const m = fromParts(d, mo, y);
      setError(null);
      setResult(m);
      setStamp((s) => s + 1);
      requestAnimationFrame(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    } catch (err) {
      setError(`DIES INVALIDA — ${err instanceof RangeError ? err.message : "the date does not exist."}`);
      setResult(null);
    }
  }

  const rows = result ? chakraRows(result) : [];
  const totals = rows.length
    ? {
        body: foldTotal(rows.reduce((a, r) => a + r.body, 0)),
        energy: foldTotal(rows.reduce((a, r) => a + r.energy, 0)),
        emotions: foldTotal(rows.reduce((a, r) => a + r.emotions, 0)),
      }
    : null;

  return (
    <>
      {/* title — compact, centered over the instrument */}
      <div className="relative z-30 mx-auto max-w-2xl text-center">
        <p className="lm4-chip -rotate-[0.5deg]">The 22 arcana · one date · free</p>
        <h1 className="lm4-serif mt-5 text-[clamp(28px,4.2vw,44px)] leading-[1.1] tracking-tight text-[#e9e6f2]">
          Your birth date, charted as <span className="text-[#f3c77a]">a map of stars.</span>
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-[13.5px] leading-relaxed text-[#b7b1cc]">
          The Destiny Matrix folds day, month and year onto twenty-two points of an eight-pointed
          star. Three numbers raise the constellation.
        </p>
      </div>

      {/* floating glass date console — top-center, riding over the sky */}
      <form
        onSubmit={compute}
        className="lm4-glass relative z-30 mx-auto mt-7 max-w-2xl -rotate-[0.4deg] overflow-hidden px-6 py-6 shadow-[0_24px_80px_rgba(10,9,18,0.55)] md:px-8"
      >
        {/* slow sheen sweeping the glass */}
        <div aria-hidden className="lm4-sheen pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[#ffdd9c]/[0.06] to-transparent" />
        <span className="lm4-chip absolute -top-3 left-1/2 -translate-x-1/2 rotate-[0.4deg] !text-[9px]">Consola · date of birth</span>

        <div className="mt-2 grid grid-cols-3 gap-3 sm:gap-4">
          {(
            [
              { label: "Day", lat: "DIES", value: day, set: setDay, ph: "14", max: 2, tilt: "rotate-[0.5deg]" },
              { label: "Month", lat: "MENSIS", value: month, set: setMonth, ph: "03", max: 2, tilt: "-rotate-[0.4deg] translate-y-1" },
              { label: "Year", lat: "ANNVS", value: year, set: setYear, ph: "1985", max: 4, tilt: "rotate-[0.5deg]" },
            ] as const
          ).map((f) => (
            <label key={f.lat} className={`block ${f.tilt}`}>
              <span className="mb-1.5 flex items-baseline justify-between">
                <span className="text-[9px] uppercase tracking-[0.24em] text-[#f3c77a]/80">{f.label}</span>
                <span className="font-mono text-[7px] tracking-[0.2em] text-[#b7b1cc]/40">{f.lat}</span>
              </span>
              <span className="block border border-[#f3c77a]/30 bg-[#0a0912]/60 transition-colors focus-within:border-[#f3c77a]/60">
                <input
                  value={f.value}
                  onChange={(ev) => f.set(ev.target.value.replace(/[^\d]/g, "").slice(0, f.max))}
                  placeholder={f.ph}
                  inputMode="numeric"
                  autoComplete="off"
                  aria-label={f.label}
                  className="lm4-input w-full px-3 py-2.5 text-center font-mono text-xl tracking-[0.15em] text-[#e9e6f2] placeholder:text-[#e9e6f2]/15 sm:text-2xl"
                />
              </span>
            </label>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-[8px] leading-relaxed tracking-[0.22em] text-[#b7b1cc]/50">
            DD·MM·YYYY → CONSTELLATIO
            <br />
            FOLD ALL SUMS TO 1–22
          </p>
          <button
            type="submit"
            className="rotate-[0.4deg] border border-[#f3c77a] bg-[#f3c77a] px-6 py-2.5 text-[13px] font-medium text-[#0a0912] transition-transform hover:-translate-y-0.5"
          >
            ✦ Chart the sky
          </button>
        </div>

        {error ? (
          <p className="mt-4 border border-[#e39a4c]/50 bg-[#e39a4c]/10 px-3 py-2 font-mono text-[9px] tracking-[0.18em] text-[#ffdd9c]">
            {error}
          </p>
        ) : null}
      </form>

      {/* micro readout strip under the console */}
      <div className="relative z-30 mx-auto mt-5 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[8px] tracking-[0.22em] text-[#b7b1cc]/45">
        <span>POSITIONES · 22</span>
        <span className="text-[#b794f6]">◆ OCTAGRAM · CHAKRAS · PURPOSES</span>
        <span>INSTANT · NO SIGN-UP</span>
      </div>

      {/* ==================== RESULT / PLACEHOLDER SKY ==================== */}
      {result ? (
        <div ref={resultRef} key={stamp} className="relative mt-2">
          {/* ---- purpose readout strip — rides ABOVE the star map ---- */}
          <section className="lm4-rise relative z-20 mx-auto -mb-14 max-w-3xl px-1" style={{ animationDelay: "0.05s" }}>
            <div className="lm4-glass relative rotate-[0.3deg] px-4 py-4 md:px-6">
              <span className="lm4-chip absolute -top-3 left-6 -rotate-[0.4deg] !text-[9px]">Purpose lines</span>
              <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
                {(
                  [
                    {
                      lat: "PERSONALE",
                      label: "Finding yourself",
                      z: result.purposes.perspurpose,
                      formula: `SKY ${result.purposes.skypoint} + EARTH ${result.purposes.earthpoint}`,
                      copy: "The soul's task before forty.",
                    },
                    {
                      lat: "SOCIALE",
                      label: "Socialization",
                      z: result.purposes.socialpurpose,
                      formula: `FEM ${result.purposes.femalepoint} + MASC ${result.purposes.malepoint}`,
                      copy: "The task other people hand you.",
                    },
                    {
                      lat: "GENERALE",
                      label: "Spiritual harmony",
                      z: result.purposes.generalpurpose,
                      formula: "PERS + SOC",
                      copy: "The note the instrument is tuned to.",
                    },
                    {
                      lat: "PLANETARIVM",
                      label: "Planetary",
                      z: result.purposes.planetarypurpose,
                      formula: "SOC + GEN",
                      copy: "The widest ring of contribution.",
                    },
                  ] as const
                ).map((pl, i) => (
                  <div key={pl.lat} className={`relative border-l border-[#f3c77a]/25 pl-3 ${i % 2 === 0 ? "-rotate-[0.3deg]" : "rotate-[0.3deg]"}`}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-mono text-[7px] tracking-[0.24em] text-[#b794f6]">{pl.lat}</span>
                      <span className="lm4-serif text-3xl leading-none text-[#f3c77a]">{pl.z}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-[#e9e6f2]">{pl.label}</div>
                    <div className="mt-0.5 font-mono text-[7px] tracking-[0.14em] text-[#ffdd9c]/70">→ {pl.formula}</div>
                    <div className="mt-1 text-[10px] leading-snug text-[#b7b1cc]/80">{pl.copy}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ---- the star map itself, glowing BEHIND both plates ---- */}
          <figure className="lm4-rise relative z-10 mx-auto max-w-[680px]" style={{ animationDelay: "0.15s" }}>
            {/* corner coordinate annotations */}
            <span aria-hidden className="absolute left-2 top-10 hidden font-mono text-[7px] tracking-[0.26em] text-[#b7b1cc]/40 md:inline">
              RA 00H·00M·00S
            </span>
            <span aria-hidden className="absolute bottom-24 right-2 hidden font-mono text-[7px] tracking-[0.26em] text-[#b7b1cc]/40 md:inline">
              DEC +00°00′00″
            </span>
            <span aria-hidden className="absolute right-4 top-16 hidden rotate-90 font-mono text-[7px] tracking-[0.3em] text-[#b7b1cc]/35 lg:inline">
              CIRCVLVS AETATVM · 0–70
            </span>
            <div className="flex justify-center drop-shadow-[0_0_60px_rgba(243,199,122,0.12)]">
              <StarMapDiagram m={result} />
            </div>
            <figcaption className="mx-auto -mt-2 flex max-w-[560px] items-center justify-between font-mono text-[7px] tracking-[0.24em] text-[#b7b1cc]/45">
              <span>A·B·C·D CARDINALES — F·G·H·I AXES</span>
              <span className="text-[#b794f6]/70">J·K·L·M·N LINEA FORTVNAE</span>
            </figcaption>
          </figure>

          {/* ---- health map — compact readout riding BELOW the star map ---- */}
          <section className="lm4-rise relative z-20 mx-auto -mt-16 max-w-2xl px-1" style={{ animationDelay: "0.3s" }}>
            <div className="lm4-glass relative -rotate-[0.3deg] px-5 py-5 md:px-7">
              <span className="lm4-chip absolute -top-3 right-6 rotate-[0.4deg] !text-[9px]">Chart of the heart</span>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="lm4-serif text-[clamp(16px,2.2vw,22px)] text-[#e9e6f2]">Seven stations through the center</h2>
                <span className="font-mono text-[7px] tracking-[0.26em] text-[#b7b1cc]/50">CORPVS · ENERGIA · AFFECTVS</span>
              </div>

              <div className="mt-4 font-mono">
                {/* column heads */}
                <div className="grid grid-cols-[2.2rem_minmax(0,1fr)_2rem_2rem_2rem] items-baseline gap-x-3 border-b border-[#f3c77a]/25 pb-1.5 text-[7px] uppercase tracking-[0.22em] text-[#b7b1cc]/55 sm:grid-cols-[2.6rem_minmax(0,1fr)_7rem_2.4rem_2.4rem_2.4rem]">
                  <span>St.</span>
                  <span>Chakra</span>
                  <span className="hidden sm:inline">Sanskrit</span>
                  <span className="text-right text-[#f3c77a]/80">B</span>
                  <span className="text-right text-[#b794f6]">E</span>
                  <span className="text-right text-[#ffdd9c]/80">A</span>
                </div>
                {rows.map((r) => (
                  <div
                    key={r.no}
                    className={`grid grid-cols-[2.2rem_minmax(0,1fr)_2rem_2rem_2rem] items-center gap-x-3 border-b border-white/[0.06] py-1.5 text-[12px] sm:grid-cols-[2.6rem_minmax(0,1fr)_7rem_2.4rem_2.4rem_2.4rem] ${
                      r.no === "IV" ? "bg-[#f3c77a]/[0.05]" : ""
                    }`}
                  >
                    <span className="text-[9px] text-[#f3c77a]/70">{r.no}</span>
                    <span className="truncate text-[#e9e6f2]">{r.name}</span>
                    <span className="hidden text-[10px] tracking-[0.1em] text-[#b7b1cc]/70 sm:inline">{r.sanskrit}</span>
                    <span className="text-right text-[#f3c77a]">{r.body}</span>
                    <span className="text-right text-[#b794f6]">{r.energy}</span>
                    <span className="text-right text-[#ffdd9c]">{r.emotions}</span>
                  </div>
                ))}
                {totals ? (
                  <div className="grid grid-cols-[2.2rem_minmax(0,1fr)_2rem_2rem_2rem] items-center gap-x-3 pt-2 text-[12px] sm:grid-cols-[2.6rem_minmax(0,1fr)_7rem_2.4rem_2.4rem_2.4rem]">
                    <span className="col-span-2 text-[8px] uppercase tracking-[0.24em] text-[#b7b1cc]/60 sm:col-span-3">
                      Σ Total · folded
                    </span>
                    <span className="text-right text-[#f3c77a]">{totals.body}</span>
                    <span className="text-right text-[#b794f6]">{totals.energy}</span>
                    <span className="text-right text-[#ffdd9c]">{totals.emotions}</span>
                  </div>
                ) : null}
              </div>

              <p className="mt-3 text-[11px] leading-relaxed text-[#b7b1cc]">
                Body is the number the chakra carries in the flesh, Energy the charge that moves
                through it, Emotions the tone it sounds. Anahata — the Heart row — is lit because
                the whole map is read from the heart of the star outward.
              </p>
            </div>
          </section>
        </div>
      ) : (
        /* placeholder sky — the unmarked constellation waits under the console */
        <div aria-hidden className="relative z-10 mx-auto -mt-8 max-w-[620px] select-none">
          <div className="flex justify-center">
            <GhostStarMap />
          </div>
          <p className="-mt-6 text-center font-mono text-[8px] tracking-[0.28em] text-[#b7b1cc]/45">
            CAELVM INEXPECTATVM — THE SKY WAITS FOR A DATE
          </p>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function DestinyMatrixV4Page() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#0a0912] font-sans text-[#e9e6f2] antialiased selection:bg-[#f3c77a]/25">
      <style>{LM4_STYLES}</style>
      <Backdrop />

      <div className="relative z-10">
        <Header />

        {/* ================= TOOL — top of the viewport ================= */}
        <section id="lm4-tool" className="relative overflow-visible">
          {/* slashed hairline crossing the tool stage */}
          <div
            className="pointer-events-none absolute left-[-4vw] top-[30%] h-px w-[108vw] -rotate-[0.9deg] bg-gradient-to-r from-transparent via-[#b794f6]/25 to-transparent"
            aria-hidden
          />
          {/* small wheel hanging off the left margin behind the console */}
          <div className="lm4-wheel-spin pointer-events-none absolute -left-40 top-16 hidden h-[380px] w-[380px] opacity-[0.1] xl:block" aria-hidden style={{ animationDuration: "150s" }}>
            <CoordinateWheelSvg />
          </div>
          {/* marginal tick scale */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-10 right-3 hidden lg:block"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, rgba(243,199,122,0.35) 0 1px, transparent 1px 18px)",
              width: "8px",
            }}
          />
          <span aria-hidden className="absolute right-5 top-24 hidden rotate-90 font-mono text-[7px] tracking-[0.3em] text-[#b7b1cc]/35 lg:inline">
            SCALA · I AD XXII
          </span>

          <div className="mx-auto max-w-6xl px-5 pb-16 pt-9 md:px-8 md:pb-20 md:pt-11">
            <Tool />
          </div>

          {/* section's bottom rule — the explainer below rides over it */}
          <div
            className="pointer-events-none absolute bottom-0 left-[-4vw] h-px w-[108vw] rotate-[0.3deg] bg-gradient-to-r from-transparent via-[#f3c77a]/30 to-transparent"
            aria-hidden
          />
        </section>

        {/* ================= EXPLAINER — condensed ================= */}
        <section className="relative z-20 -mt-4 pb-8">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <div className="lm4-glass relative z-10 max-w-3xl -rotate-[0.5deg] px-6 py-7 md:ml-[6%] md:px-8">
              <span className="lm4-chip absolute -top-3 left-6 !text-[9px]">Quid est</span>
              <h2 className="lm4-serif text-[clamp(20px,2.6vw,28px)] text-[#e9e6f2]">
                What is the Destiny Matrix?
              </h2>
              <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-[#b7b1cc]">
                A numerological chart built from a single birth date. Day, month and year are folded
                into the 1–22 range of the Major Arcana and set onto an eight-pointed star: the day
                at the left point, the month above, the year to the right, their sum below, and the
                sum of all four burning at the center. Every line drawn between those points carries
                another number, until twenty-two positions are lit.
              </p>
              <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-[#b7b1cc]">
                Each position answers a different question — character at the day point, talent at
                the month, karma at the year, comfort zone at the center. The ring of ages around
                the star lays the same numbers across a life, decade by decade, so the chart reads
                less like a horoscope and more like an instrument panel for one particular person.
              </p>
            </div>
          </div>
        </section>

        {/* ================= FAQ — condensed ================= */}
        <section className="relative py-12 md:py-16">
          {/* vertical hairline breaking through the FAQ column */}
          <div
            className="pointer-events-none absolute left-[7%] top-[-2rem] hidden h-[calc(100%+4rem)] w-px rotate-[0.4deg] bg-gradient-to-b from-transparent via-[#f3c77a]/25 to-transparent md:block"
            aria-hidden
          />
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <h2 className="lm4-serif rotate-[0.3deg] text-[clamp(22px,3vw,32px)] text-[#e9e6f2] md:translate-x-[14%]">
              Questions from the margins
            </h2>
            <div className="relative mx-auto mt-9 max-w-2xl md:ml-[10%]">
              {FAQ.map((f, i) => (
                <details
                  key={f.q}
                  className={`lm4-glass group relative z-10 mb-3 px-6 py-5 open:border-[#f3c77a]/40 ${
                    i % 2 === 0 ? "-rotate-[0.4deg] md:-ml-10 md:mr-6" : "rotate-[0.4deg] md:ml-10 md:-mr-4"
                  }`}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14.5px] text-[#e9e6f2] marker:hidden [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="lm4-glyph shrink-0 text-[13px] text-[#f3c77a] transition-transform group-open:rotate-45">
                      ✦
                    </span>
                  </summary>
                  <p className="mt-3 text-[13px] leading-relaxed text-[#b7b1cc]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FOOTER — slim colophon ================= */}
        <footer className="relative mt-4">
          <div className="pointer-events-none absolute -top-px left-0 h-px w-full bg-white/[0.07]" aria-hidden />
          <div
            className="pointer-events-none absolute -top-2 left-[-3vw] h-px w-[106vw] rotate-[0.5deg] bg-gradient-to-r from-transparent via-[#b794f6]/30 to-transparent"
            aria-hidden
          />
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-8 md:flex-row md:justify-between md:px-8">
            <div className="flex items-center gap-2.5">
              <span className="lm4-glyph grid h-6 w-6 place-items-center border border-[#f3c77a]/40 bg-[#f3c77a]/[0.07] text-[11px] text-[#f3c77a]">
                ☾{FE}
              </span>
              <span className="lm4-serif text-[14px] text-[#e9e6f2]">Astro Scope</span>
              <span className="font-mono text-[7px] tracking-[0.26em] text-[#b7b1cc]/45">DESTINY MATRIX · V4</span>
            </div>
            <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1 font-mono text-[8px] uppercase tracking-[0.2em] text-[#b7b1cc]/60">
              <Link href="/tarot" className="transition-colors hover:text-[#f3c77a]">Tarot</Link>
              <Link href="/tarot/birth-arcana" className="transition-colors hover:text-[#f3c77a]">Birth Arcana</Link>
              <Link href="/tarot/cards" className="transition-colors hover:text-[#f3c77a]">Cards</Link>
              <Link href="#lm4-tool" className="transition-colors hover:text-[#f3c77a]">Compute ↑</Link>
            </nav>
            <p className="font-mono text-[8px] tracking-[0.22em] text-[#b7b1cc]/40">© MMXXVI · AS ABOVE · SO BELOW</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
