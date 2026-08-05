"use client";

// DESTINY MATRIX · VARIANT V2 — "THE OBSERVATORY". Same tool as v1 (date →
// @/lib/destiny-matrix → octagram + chakra health map + purpose lines) but a
// diagram-dominant composition: the computed octagram fills the center stage
// HUGE with large age-ring labels; a slim floating console overlaps its
// lower-left corner; the health map and the purpose plates become readout
// rails DOCKED to the diagram's left and right edges, counter-rotated like
// instrument side-panels. Logic and diagram geometry ported from matrix/v1
// (code copied, not imported). Production palette (lab/remix-v2), broken
// layout + magic background, CSS-only motion guarded by
// prefers-reduced-motion. Self-contained: inline SVG + Tailwind + one scoped
// <style> block (lm2- prefixed).

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
/* Geometry helpers                                                    */
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

// deterministic PRNG so the star field is stable between renders
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
const TAROT_TABS = [
  { href: "/tarot", label: "Tarot" },
  { href: "/tarot/spreads/daily-card", label: "Daily Card" },
  { href: "/tarot/spreads/yes-no", label: "Yes / No" },
  { href: "/tarot/spreads/past-present-future", label: "Past · Present · Future" },
  { href: "/tarot/spreads/love-three-card", label: "Love" },
  { href: "/tarot/birth-arcana", label: "Birth Arcana" },
  { href: "/tarot/cards", label: "Cards" },
  { href: "/matrix", label: "Matrix", active: true },
];

const VARIANTS = [
  { href: "/matrix/v1", label: "V1", note: "scriptorium" },
  { href: "/matrix/v2", label: "V2", note: "observatory", active: true },
  { href: "/matrix/v3", label: "V3", note: "variant" },
  { href: "/matrix/v4", label: "V4", note: "variant" },
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
  return Array.from({ length: 90 }, (_, i) => ({
    x: +(rnd() * 1600).toFixed(0),
    y: +(rnd() * 1000).toFixed(0),
    r: +(0.5 + rnd() * 1.1).toFixed(2),
    o: +(0.14 + rnd() * 0.4).toFixed(2),
    tw: i % 5 === 0,
    d: +(rnd() * 8).toFixed(1),
    key: i,
  }));
})();

/* ------------------------------------------------------------------ */
/* Scoped styles (lm2- prefix)                                         */
/* ------------------------------------------------------------------ */
const LM2_STYLES = `
  .lm2-serif { font-family: "Playfair Display", "Cormorant Garamond", Georgia, "Times New Roman", serif; }
  .lm2-glyph { font-family: "Noto Sans Symbols", "Noto Sans Symbols 2", Symbola, "Segoe UI Symbol", serif; font-style: normal; }

  /* panels stay translucent so the machinery passes visibly BEHIND them */
  .lm2-panel {
    background: linear-gradient(160deg, rgba(23,19,40,0.58), rgba(12,10,22,0.7));
    border: 1px solid rgba(233,230,242,0.10);
    backdrop-filter: blur(4px);
  }
  .lm2-chip {
    display: inline-block;
    border: 1px solid rgba(243,199,122,0.35);
    background: rgba(10,9,18,0.85);
    padding: 4px 10px;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #f3c77a;
  }

  .lm2-input { background: transparent; outline: none; }
  .lm2-input:focus { background: rgba(243,199,122,0.06); }
  .lm2-input::selection { background: rgba(243,199,122,0.3); }

  /* ---- magic background motion (all slow, all guarded below) ---- */
  @keyframes lm2-spin     { to { transform: rotate(360deg); } }
  @keyframes lm2-spin-rev { to { transform: rotate(-360deg); } }
  @keyframes lm2-twinkle  { 0%,100% { opacity: 0.12; } 50% { opacity: 0.75; } }
  @keyframes lm2-floatA   { 0%,100% { transform: translate(0,0) rotate(-2deg); } 50% { transform: translate(1.5vw,-2vh) rotate(1deg); } }
  @keyframes lm2-floatB   { 0%,100% { transform: translate(0,0) rotate(3deg); } 50% { transform: translate(-1.5vw,2vh) rotate(-1deg); } }
  .lm2-wheel-spin      { animation: lm2-spin 280s linear infinite; transform-origin: 50% 50%; }
  .lm2-wheel-spin-rev  { animation: lm2-spin-rev 340s linear infinite; transform-origin: 50% 50%; }
  .lm2-wheel-spin-slow { animation: lm2-spin 150s linear infinite; transform-origin: 50% 50%; }
  .lm2-twinkle         { animation: lm2-twinkle 7s ease-in-out infinite; }
  .lm2-float-a         { animation: lm2-floatA 34s ease-in-out infinite; }
  .lm2-float-b         { animation: lm2-floatB 42s ease-in-out infinite; }
  .lm2-nebula          { animation: lm2-floatA 60s ease-in-out infinite; }

  /* ---- observatory stage: idle ring breathes, result draws on ---- */
  .lm2-draw      { stroke-dasharray: 1600; stroke-dashoffset: 1600; animation: lm2-draw 2.8s ease-out forwards; }
  .lm2-draw-fast { stroke-dasharray: 700;  stroke-dashoffset: 700;  animation: lm2-draw 2s ease-out forwards; }
  .lm2-rise      { opacity: 0; transform: translateY(10px); animation: lm2-rise 0.9s ease-out forwards; }
  .lm2-halo      { animation: lm2-halo 6s ease-in-out infinite; }
  .lm2-idle-pulse { animation: lm2-halo 9s ease-in-out infinite; }
  @keyframes lm2-draw { to { stroke-dashoffset: 0; } }
  @keyframes lm2-rise { to { opacity: 1; transform: translateY(0); } }
  @keyframes lm2-halo { 0%,100% { opacity: 0.45; } 50% { opacity: 1; } }

  @media (prefers-reduced-motion: reduce) {
    .lm2-wheel-spin, .lm2-wheel-spin-rev, .lm2-wheel-spin-slow,
    .lm2-twinkle, .lm2-float-a, .lm2-float-b, .lm2-nebula, .lm2-halo, .lm2-idle-pulse { animation: none !important; }
    .lm2-draw, .lm2-draw-fast { animation: none !important; stroke-dashoffset: 0; }
    .lm2-rise { animation: none !important; opacity: 1; transform: none; }
  }
`;

/* ------------------------------------------------------------------ */
/* Backdrop — giant octagram wheels, star field, hairlines, glyphs     */
/* ------------------------------------------------------------------ */
function OctagramWheelSvg() {
  const C = 500;
  const sq = (deg: number) =>
    [0, 90, 180, 270].map((a) => onCircle(C, C, 360, a + deg));
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
      <div className="lm2-nebula absolute -left-[20vw] top-[6vh] h-[70vmin] w-[70vmin] bg-[radial-gradient(circle,rgba(162,90,223,0.11),transparent_65%)]" />
      <div className="lm2-nebula absolute right-[-12vw] top-[48vh] h-[80vmin] w-[80vmin] bg-[radial-gradient(circle,rgba(243,199,122,0.08),transparent_65%)]" />
      <div className="lm2-nebula absolute left-[24vw] bottom-[-18vh] h-[60vmin] w-[60vmin] bg-[radial-gradient(circle,rgba(183,148,246,0.07),transparent_65%)]" />

      {/* two huge octagram wheels, half off-screen, counter-rotating */}
      <div className="lm2-wheel-spin absolute -top-[42vmin] -right-[48vmin] h-[150vmin] w-[150vmin] opacity-[0.07]">
        <OctagramWheelSvg />
      </div>
      <div className="lm2-wheel-spin-rev absolute -bottom-[46vmin] -left-[44vmin] h-[130vmin] w-[130vmin] opacity-[0.055]">
        <OctagramWheelSvg />
      </div>

      <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        {/* star specks */}
        {STARS.map((s) =>
          s.tw ? (
            <circle key={s.key} cx={s.x} cy={s.y} r={s.r} fill={CREAM} className="lm2-twinkle" style={{ animationDelay: `${s.d}s`, opacity: s.o }} />
          ) : (
            <circle key={s.key} cx={s.x} cy={s.y} r={s.r} fill={TEXT_LO} opacity={s.o} />
          ),
        )}

        {/* hairline orbit circles, centers pushed off-canvas */}
        <circle cx={1730} cy={240} r={520} fill="none" stroke={GOLD_DEEP} strokeWidth={0.5} opacity={0.4} />
        <circle cx={1730} cy={240} r={700} fill="none" stroke={GOLD_DEEP} strokeWidth={0.4} opacity={0.26} strokeDasharray="2 7" />
        <circle cx={-160} cy={880} r={420} fill="none" stroke={VIOLET} strokeWidth={0.5} opacity={0.34} />
        <circle cx={-160} cy={880} r={560} fill="none" stroke={VIOLET} strokeWidth={0.4} opacity={0.2} strokeDasharray="2 8" />

        {/* construction lines crossing the whole page */}
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
      <span className="lm2-glyph lm2-float-a absolute left-[3vw] top-[70vh] text-[26vmin] leading-none text-[#b794f6] opacity-[0.055]">
        ✦{FE}
      </span>
      <span className="lm2-glyph lm2-float-b absolute right-[6vw] top-[160vh] text-[30vmin] leading-none text-[#f3c77a] opacity-[0.05]">
        ☉{FE}
      </span>
      <span className="lm2-glyph lm2-float-a absolute left-[38vw] top-[280vh] text-[24vmin] leading-none text-[#e9e6f2] opacity-[0.04]">
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
      <div className="mx-auto flex max-w-[1400px] items-center gap-5 px-5 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="lm2-glyph grid h-7 w-7 place-items-center border border-[#f3c77a]/40 bg-[#f3c77a]/[0.07] text-[13px] text-[#f3c77a]">
            ☾{FE}
          </span>
          <span className="lm2-serif text-[16px] tracking-wide text-[#e9e6f2]">Astro Scope</span>
        </Link>
        <span className="hidden font-mono text-[9px] tracking-[0.3em] text-[#b7b1cc]/50 sm:inline">
          DESTINY MATRIX · OBSERVATORIVM
        </span>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/" className="hidden text-[12.5px] text-[#b7b1cc] transition-colors hover:text-[#e9e6f2] sm:inline">
            Sign in
          </Link>
          <Link
            href="#lm2-tool"
            className="border border-[#f3c77a]/50 bg-[#f3c77a]/10 px-3 py-1.5 text-[12.5px] text-[#ffdd9c] transition-colors hover:bg-[#f3c77a]/20"
          >
            Compute
          </Link>
        </div>
      </div>

      {/* cross-nav tabs — all tarot pages plus the matrix family */}
      <nav aria-label="Tools" className="border-t border-white/[0.05]">
        <div className="mx-auto flex max-w-[1400px] items-stretch gap-1 overflow-x-auto px-4 py-2 md:px-8">
          {TAROT_TABS.map((t, i) =>
            t.active ? (
              <span
                key={t.href}
                aria-current="page"
                className="lm2-chip shrink-0 -rotate-[0.4deg] !border-[#f3c77a]/70 !bg-[#f3c77a]/15 !text-[#ffdd9c]"
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

      {/* variant switcher — the four matrix explorations */}
      <nav aria-label="Matrix variants" className="border-t border-white/[0.05]">
        <div className="mx-auto flex max-w-[1400px] items-center gap-2 overflow-x-auto px-4 py-1.5 md:px-8">
          <span className="shrink-0 font-mono text-[8px] tracking-[0.3em] text-[#b7b1cc]/45">MATRIX FAMILY /</span>
          {VARIANTS.map((v) =>
            v.active ? (
              <span
                key={v.href}
                aria-current="page"
                className="lm2-chip shrink-0 rotate-[0.4deg] !border-[#b794f6]/60 !bg-[#b794f6]/10 !px-2 !py-0.5 !text-[9px] !text-[#b794f6]"
              >
                ◆ {v.label} · {v.note}
              </span>
            ) : (
              <Link
                key={v.href}
                href={v.href}
                className="shrink-0 border border-transparent px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-[#b7b1cc]/60 transition-colors hover:border-[#b794f6]/30 hover:text-[#b794f6]"
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
/* The octagram — center-stage instrument. `m` null = uncalibrated.    */
/* ------------------------------------------------------------------ */
function OctagramDiagram({ m }: { m: DestinyMatrix | null }) {
  const C = 320;
  const R = 196;
  const p = m?.points ?? null;
  const live = p !== null;

  const num = (v: number | undefined) => (v === undefined ? "··" : v);

  // cardinals — diamond square (0y/20y/40y/60y)
  const cardinals = [
    { deg: 270, value: num(p?.apoint), age: "0y", tag: "A" },
    { deg: 0, value: num(p?.bpoint), age: "20y", tag: "B" },
    { deg: 90, value: num(p?.cpoint), age: "40y", tag: "C" },
    { deg: 180, value: num(p?.dpoint), age: "60y", tag: "D" },
  ];
  // diagonals — axis square (10y/30y/50y/70y)
  const diagonals = [
    { deg: 315, value: num(p?.fpoint), age: "10y", tag: "F" },
    { deg: 45, value: num(p?.gpoint), age: "30y", tag: "G" },
    { deg: 135, value: num(p?.ipoint), age: "50y", tag: "I" },
    { deg: 225, value: num(p?.hpoint), age: "70y", tag: "H" },
  ];
  const outer = [...cardinals, ...diagonals].map((n) => ({ ...n, pos: onCircle(C, C, R, n.deg) }));

  // inner numbers along the spokes, straight from the engine's points
  const spoke = (deg: number, frac: number) => onCircle(C, C, R * frac, deg);
  const jPos = spoke(180, 0.46);
  const nPos = spoke(90, 0.46);
  const lPos = mid(jPos, nPos);
  const inner = [
    { pos: spoke(270, 0.2), value: num(p?.wpoint), tag: "W" },
    { pos: spoke(270, 0.42), value: num(p?.spoint), tag: "S" },
    { pos: spoke(270, 0.66), value: num(p?.opoint), tag: "O" },
    { pos: spoke(0, 0.2), value: num(p?.xpoint), tag: "X" },
    { pos: spoke(0, 0.42), value: num(p?.tpoint), tag: "T" },
    { pos: spoke(0, 0.66), value: num(p?.ppoint), tag: "P" },
    { pos: nPos, value: num(p?.npoint), tag: "N" },
    { pos: jPos, value: num(p?.jpoint), tag: "J" },
    { pos: mid(jPos, lPos), value: num(p?.kpoint), tag: "K" },
    { pos: lPos, value: num(p?.lpoint), tag: "L" },
    { pos: mid(lPos, nPos), value: num(p?.mpoint), tag: "M" },
  ];

  const diamondPts = cardinals.map((n) => onCircle(C, C, R, n.deg)).map((q) => `${q.x},${q.y}`).join(" ");
  const axisPts = diagonals.map((n) => onCircle(C, C, R, n.deg)).map((q) => `${q.x},${q.y}`).join(" ");

  return (
    <svg
      viewBox="0 0 640 640"
      className="w-full"
      role="img"
      aria-label={
        live
          ? `Destiny matrix octagram: day ${p.apoint}, month ${p.bpoint}, year ${p.cpoint}, base ${p.dpoint}, center ${p.epoint}`
          : "Uncalibrated destiny matrix octagram — enter a birth date to light the stations"
      }
    >
      <defs>
        <radialGradient id="lm2-core-glow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.22" />
          <stop offset="55%" stopColor={VIOLET} stopOpacity="0.08" />
          <stop offset="100%" stopColor={BG} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lm2-center-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={CREAM} stopOpacity="0.5" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={C} cy={C} r={310} fill="url(#lm2-core-glow)" />

      {/* age ring */}
      <circle className={live ? "lm2-draw" : "lm2-idle-pulse"} cx={C} cy={C} r={248} fill="none" stroke={GOLD_DEEP} strokeOpacity="0.55" strokeWidth="0.8" />
      <circle cx={C} cy={C} r={238} fill="none" stroke={GOLD_DEEP} strokeOpacity="0.3" strokeWidth="0.5" strokeDasharray="1 5" />
      {Array.from({ length: 80 }, (_, k) => {
        const a = (360 / 80) * k;
        const p1 = onCircle(C, C, 240, a);
        const p2 = onCircle(C, C, 248, a);
        return <line key={k} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={GOLD} strokeOpacity={k % 10 === 0 ? 0.6 : 0.28} strokeWidth={k % 10 === 0 ? 0.9 : 0.5} />;
      })}

      {/* spokes from the center to the eight outer stations */}
      {outer.map((n, i) => (
        <line
          key={`spoke-${n.tag}`}
          className={live ? "lm2-draw-fast" : undefined}
          style={live ? { animationDelay: `${0.2 + i * 0.08}s` } : undefined}
          x1={C}
          y1={C}
          x2={n.pos.x}
          y2={n.pos.y}
          stroke={i % 2 === 0 ? GOLD : VIOLET_SOFT}
          strokeOpacity={live ? 0.3 : 0.14}
          strokeWidth="0.7"
        />
      ))}

      {/* the money line: J — K — L — M — N */}
      <line className={live ? "lm2-draw-fast" : undefined} style={live ? { animationDelay: "0.9s" } : undefined} x1={jPos.x} y1={jPos.y} x2={nPos.x} y2={nPos.y} stroke={CREAM} strokeOpacity={live ? 0.35 : 0.14} strokeWidth="0.7" strokeDasharray="3 3" />

      {/* the two squares of the octagram */}
      <polygon className={live ? "lm2-draw" : undefined} style={live ? { animationDelay: "0.4s" } : undefined} points={diamondPts} fill="none" stroke={GOLD} strokeOpacity={live ? 0.85 : 0.4} strokeWidth="1.2" />
      <polygon className={live ? "lm2-draw" : undefined} style={live ? { animationDelay: "0.8s" } : undefined} points={axisPts} fill="none" stroke={VIOLET_SOFT} strokeOpacity={live ? 0.8 : 0.35} strokeWidth="1.2" />

      {/* age labels on the outer ring — large and legible, the observatory dial */}
      {outer.map((n, i) => {
        const lp = onCircle(C, C, 274, n.deg);
        return (
          <text
            key={`age-${n.tag}`}
            className={live ? "lm2-rise" : undefined}
            style={live ? { animationDelay: `${1.3 + i * 0.06}s` } : undefined}
            x={lp.x}
            y={lp.y + 5}
            textAnchor="middle"
            fontSize="16"
            fill={GOLD}
            opacity="0.9"
            fontFamily="ui-monospace, monospace"
            letterSpacing="1.5"
          >
            {n.age}
          </text>
        );
      })}

      {/* inner nodes */}
      {inner.map((n, i) => (
        <g key={`inner-${n.tag}`} className={live ? "lm2-rise" : undefined} style={live ? { animationDelay: `${1.5 + i * 0.07}s` } : undefined}>
          <circle cx={n.pos.x} cy={n.pos.y} r={14} fill="rgba(12,10,22,0.95)" stroke={VIOLET_SOFT} strokeOpacity={live ? 0.75 : 0.3} strokeWidth="0.9" strokeDasharray={live ? undefined : "2 3"} />
          <text x={n.pos.x} y={n.pos.y + 4} textAnchor="middle" fontSize="11.5" fill={VIOLET_SOFT} opacity={live ? 1 : 0.45} fontFamily="ui-monospace, monospace">
            {n.value}
          </text>
        </g>
      ))}

      {/* outer nodes — the eight stations */}
      {outer.map((n, i) => (
        <g key={`outer-${n.tag}`} className={live ? "lm2-rise" : undefined} style={live ? { animationDelay: `${1.1 + i * 0.07}s` } : undefined}>
          <circle cx={n.pos.x} cy={n.pos.y} r={23} fill="rgba(12,10,22,0.95)" stroke={GOLD} strokeOpacity={live ? 0.9 : 0.35} strokeWidth="1.1" strokeDasharray={live ? undefined : "3 4"} />
          <circle cx={n.pos.x} cy={n.pos.y} r={17.5} fill="none" stroke={i % 2 === 0 ? GOLD : VIOLET_SOFT} strokeOpacity={live ? 0.35 : 0.18} strokeWidth="0.6" />
          <text x={n.pos.x} y={n.pos.y + 5.5} textAnchor="middle" fontSize="15" fill={CREAM} opacity={live ? 1 : 0.4} fontFamily="ui-monospace, monospace">
            {n.value}
          </text>
        </g>
      ))}

      {/* center — the largest node, glowing */}
      <g className={live ? "lm2-rise" : undefined} style={live ? { animationDelay: "1.9s" } : undefined}>
        <circle className={live ? "lm2-halo" : "lm2-idle-pulse"} cx={C} cy={C} r={58} fill="url(#lm2-center-glow)" opacity={live ? undefined : 0.25} />
        <circle cx={C} cy={C} r={36} fill={BG} stroke={GOLD} strokeWidth="1.3" strokeOpacity={live ? 1 : 0.45} strokeDasharray={live ? undefined : "3 4"} />
        <circle cx={C} cy={C} r={29} fill="none" stroke={VIOLET_SOFT} strokeOpacity={live ? 0.5 : 0.25} strokeWidth="0.7" />
        <text x={C} y={C + 9} textAnchor="middle" fontSize="26" fill={GOLD} opacity={live ? 1 : 0.45} fontFamily="ui-monospace, monospace" letterSpacing="1">
          {live ? p.epoint : "··"}
        </text>
      </g>
      <text className={live ? "lm2-rise" : undefined} style={live ? { animationDelay: "2.1s" } : undefined} x={C} y={C + 58} textAnchor="middle" fontSize="6.5" letterSpacing="2.5" fill={VIOLET_SOFT} fontFamily="ui-monospace, monospace">
        {live ? "CENTRVM · E" : "INSTRVMENTVM IN EXPECTATIONE"}
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Purpose plate mini-diagram — tiny triangle X + Y → Z                */
/* ------------------------------------------------------------------ */
function MiniTri({ x, y, z, mono }: { x?: number; y?: number; z: number; mono: string }) {
  return (
    <svg viewBox="0 0 120 76" className="h-[66px] w-[104px]" aria-hidden>
      <polygon points="60,10 14,62 106,62" fill="none" stroke={GOLD_DEEP} strokeOpacity="0.7" strokeWidth="0.8" />
      {x !== undefined && y !== undefined ? (
        <>
          <circle cx="14" cy="62" r="11" fill={BG} stroke={VIOLET_SOFT} strokeOpacity="0.8" strokeWidth="0.8" />
          <text x="14" y="65.5" textAnchor="middle" fontSize="9.5" fill={VIOLET_SOFT} fontFamily="ui-monospace, monospace">{x}</text>
          <circle cx="106" cy="62" r="11" fill={BG} stroke={VIOLET_SOFT} strokeOpacity="0.8" strokeWidth="0.8" />
          <text x="106" y="65.5" textAnchor="middle" fontSize="9.5" fill={VIOLET_SOFT} fontFamily="ui-monospace, monospace">{y}</text>
        </>
      ) : null}
      <circle cx="60" cy="10" r="12" fill={BG} stroke={GOLD} strokeWidth="0.9" />
      <text x="60" y="14" textAnchor="middle" fontSize="10" fill={CREAM} fontFamily="ui-monospace, monospace">{z}</text>
      <text x="60" y="74" textAnchor="middle" fontSize="5" letterSpacing="1.6" fill={TEXT_LO} opacity="0.6" fontFamily="ui-monospace, monospace">
        {mono}
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* The observatory — console, huge dial, docked readout rails          */
/* ------------------------------------------------------------------ */
function Observatory() {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DestinyMatrix | null>(null);
  const [stamp, setStamp] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);

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
        stageRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
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

  const purposePlates = result
    ? ([
        {
          chip: "Personal",
          lat: "PROPOSITVM PERSONALE",
          x: result.purposes.skypoint,
          y: result.purposes.earthpoint,
          z: result.purposes.perspurpose,
          xl: "Sky",
          yl: "Earth",
          zl: "Personal",
          copy: "Sky over earth, pressed into one number — the work before forty.",
        },
        {
          chip: "Social",
          lat: "PROPOSITVM SOCIALE",
          x: result.purposes.femalepoint,
          y: result.purposes.malepoint,
          z: result.purposes.socialpurpose,
          xl: "Female",
          yl: "Male",
          zl: "Social",
          copy: "The task other people hand you — two ancestral lines folded.",
        },
        {
          chip: "General",
          lat: "PROPOSITVM GENERALE",
          z: result.purposes.generalpurpose,
          zl: "General",
          copy: "Personal and social summed — the note the instrument is tuned to.",
        },
        {
          chip: "Planetary",
          lat: "PROPOSITVM PLANETARIVM",
          z: result.purposes.planetarypurpose,
          zl: "Planetary",
          copy: "The widest ring — what this chart contributes beyond itself.",
        },
      ] as const)
    : [];

  return (
    <div ref={stageRef} className="relative">
      {/* compact title strip — the stage itself carries the page */}
      <div className="relative z-30 mx-auto flex max-w-[1400px] flex-wrap items-baseline gap-x-5 gap-y-1 px-5 pt-6 md:px-8">
        <p className="lm2-chip -rotate-[0.5deg] !text-[9px]">The Observatory · 22 arcana · free</p>
        <h1 className="lm2-serif text-[clamp(20px,2.6vw,30px)] leading-tight tracking-tight text-[#e9e6f2]">
          Destiny Matrix — <span className="text-[#f3c77a]">one date, one star.</span>
        </h1>
        <span className="hidden font-mono text-[8px] tracking-[0.26em] text-[#b7b1cc]/45 md:inline">
          SCALA I AD XXII · ANNI 0–70
        </span>
      </div>

      {/* ============ STAGE ============ */}
      <div className="relative z-10 mx-auto max-w-[1600px] px-3 pb-10 pt-4 md:px-6 lg:min-h-[92vh]">
        {/* slashed hairline crossing the stage */}
        <div
          className="pointer-events-none absolute left-[-4vw] top-[30%] h-px w-[108vw] -rotate-[0.9deg] bg-gradient-to-r from-transparent via-[#b794f6]/25 to-transparent"
          aria-hidden
        />

        <div className="flex flex-col items-center gap-6 lg:block">
          {/* ---- the dial: computed octagram, huge, slightly rotated ---- */}
          <figure
            key={stamp}
            className="relative order-2 w-full max-w-[min(92vw,560px)] rotate-[0.4deg] lg:mx-auto lg:max-w-[min(76vw,1040px)]"
          >
            <span className="lm2-chip absolute -top-3 left-[8%] z-20 rotate-[0.5deg]">Octagramma</span>
            <span className="lm2-chip absolute -bottom-3 right-[10%] z-20 -rotate-[0.5deg] !border-[#b794f6]/50 !text-[9px] !text-[#b794f6]">
              0 – 70 anni
            </span>
            {/* faint guide rings riding behind the dial, off its axis */}
            <div className="lm2-wheel-spin-slow pointer-events-none absolute -right-[16%] -top-[10%] h-[46%] w-[46%] opacity-[0.12]" aria-hidden>
              <OctagramWheelSvg />
            </div>
            <div className="relative border border-[#f3c77a]/[0.14] bg-[#0a0912]/[0.35] px-2 py-4 shadow-[0_0_90px_rgba(243,199,122,0.08)] backdrop-blur-[2px]">
              <OctagramDiagram m={result} />
              <figcaption className="mt-1 flex flex-wrap items-center justify-between gap-2 px-2 font-mono text-[7px] tracking-[0.24em] text-[#b7b1cc]/45">
                <span>A·B·C·D CARDINALES — F·G·H·I AXES</span>
                <span className="text-[#b794f6]/70">J·K·L·M·N LINEA FORTVNAE</span>
              </figcaption>
            </div>
            {result ? (
              <p className="lm2-rise mt-3 text-center font-mono text-[9px] tracking-[0.22em] text-[#b7b1cc]/70">
                Day <span className="text-[#e9e6f2]">{result.points.apoint}</span> · Month{" "}
                <span className="text-[#e9e6f2]">{result.points.bpoint}</span> · Year{" "}
                <span className="text-[#e9e6f2]">{result.points.cpoint}</span> · Base{" "}
                <span className="text-[#e9e6f2]">{result.points.dpoint}</span> · Center{" "}
                <span className="text-[#ffdd9c]">{result.points.epoint}</span>
              </p>
            ) : null}
          </figure>

          {/* ---- floating console: date input, docked on the dial's lower-left ---- */}
          <form
            onSubmit={compute}
            className="lm2-panel relative z-40 order-1 w-full max-w-[400px] -rotate-[0.5deg] px-5 py-5 shadow-[0_18px_60px_rgba(0,0,0,0.5)] lg:absolute lg:bottom-[7%] lg:left-[max(1.5vw,calc(50%-760px))] lg:w-[350px]"
          >
            <span className="lm2-chip absolute -top-3 left-5 rotate-[0.5deg] !text-[9px]">Consola · Machina Matricis</span>
            <div className="grid grid-cols-3 gap-2.5">
              {(
                [
                  { label: "Day", lat: "DIES", value: day, set: setDay, ph: "14", max: 2, tilt: "rotate-[0.5deg]" },
                  { label: "Month", lat: "MENSIS", value: month, set: setMonth, ph: "03", max: 2, tilt: "-rotate-[0.4deg] translate-y-0.5" },
                  { label: "Year", lat: "ANNVS", value: year, set: setYear, ph: "1985", max: 4, tilt: "rotate-[0.5deg]" },
                ] as const
              ).map((f) => (
                <label key={f.lat} className={`block ${f.tilt}`}>
                  <span className="mb-1 flex items-baseline justify-between">
                    <span className="text-[8px] uppercase tracking-[0.22em] text-[#f3c77a]/80">{f.label}</span>
                    <span className="font-mono text-[6px] tracking-[0.18em] text-[#b7b1cc]/40">{f.lat}</span>
                  </span>
                  <span className="block border border-[#f3c77a]/30 bg-[#0a0912]/70 transition-colors focus-within:border-[#f3c77a]/60">
                    <input
                      value={f.value}
                      onChange={(ev) => f.set(ev.target.value.replace(/[^\d]/g, "").slice(0, f.max))}
                      placeholder={f.ph}
                      inputMode="numeric"
                      autoComplete="off"
                      aria-label={f.label}
                      className="lm2-input w-full px-2 py-2 text-center font-mono text-lg tracking-[0.15em] text-[#e9e6f2] placeholder:text-[#e9e6f2]/15"
                    />
                  </span>
                </label>
              ))}
            </div>

            <button
              type="submit"
              className="mt-4 w-full rotate-[0.3deg] border border-[#f3c77a] bg-[#f3c77a] px-4 py-2.5 text-[13px] font-medium text-[#0a0912] transition-transform hover:-translate-y-0.5"
            >
              ✦ Compute my matrix
            </button>

            <p className="mt-3 flex items-center justify-between font-mono text-[7px] tracking-[0.22em] text-[#b7b1cc]/50">
              <span>DD·MM·YYYY → OCTAGRAMMA</span>
              <span className="text-[#b794f6]/70">FOLD 1–22</span>
            </p>

            {error ? (
              <p className="mt-3 border border-[#e39a4c]/50 bg-[#e39a4c]/10 px-3 py-2 font-mono text-[9px] tracking-[0.14em] text-[#ffdd9c]">
                {error}
              </p>
            ) : null}
          </form>

          {/* ---- left rail: chakra health map, docked to the dial's left edge ---- */}
          <aside
            className="lm2-panel relative z-30 order-3 w-full max-w-[400px] -rotate-[0.6deg] px-5 py-5 lg:absolute lg:left-[max(0.5vw,calc(50%-790px))] lg:top-[3%] lg:w-[292px]"
            aria-label="Health map — seven chakras"
          >
            <span className="lm2-chip absolute -top-3 left-5 -rotate-[0.4deg] !text-[9px]">Health map · chart of the heart</span>
            {result && totals ? (
              <div className="lm2-rise mt-1" style={{ animationDelay: "0.35s" }}>
                <div className="flex items-baseline justify-between font-mono text-[7px] uppercase tracking-[0.2em] text-[#b7b1cc]/50">
                  <span>Statio</span>
                  <span className="flex gap-3 pr-0.5">
                    <span className="w-5 text-right text-[#f3c77a]/80">B</span>
                    <span className="w-5 text-right text-[#b794f6]">E</span>
                    <span className="w-5 text-right text-[#ffdd9c]/80">A</span>
                  </span>
                </div>
                <ul className="mt-2 divide-y divide-white/[0.06] border-y border-[#f3c77a]/15">
                  {rows.map((r) => (
                    <li key={r.no} className={`flex items-baseline justify-between py-[7px] ${r.no === "IV" ? "bg-[#f3c77a]/[0.05]" : ""}`}>
                      <span className="min-w-0 pr-2">
                        <span className="mr-1.5 font-mono text-[8px] text-[#f3c77a]/70">{r.no}</span>
                        <span className="text-[11.5px] text-[#e9e6f2]">{r.name}</span>
                        <span className="ml-1.5 hidden font-mono text-[7px] tracking-[0.1em] text-[#b7b1cc]/50 xl:inline">{r.sanskrit}</span>
                      </span>
                      <span className="flex shrink-0 gap-3 font-mono text-[11px]">
                        <span className="w-5 text-right text-[#f3c77a]">{r.body}</span>
                        <span className="w-5 text-right text-[#b794f6]">{r.energy}</span>
                        <span className="w-5 text-right text-[#ffdd9c]">{r.emotions}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex items-baseline justify-between font-mono text-[8px] tracking-[0.18em] text-[#b7b1cc]/60">
                  <span>Σ FOLDED</span>
                  <span className="flex gap-3 text-[11px]">
                    <span className="w-5 text-right text-[#f3c77a]">{totals.body}</span>
                    <span className="w-5 text-right text-[#b794f6]">{totals.energy}</span>
                    <span className="w-5 text-right text-[#ffdd9c]">{totals.emotions}</span>
                  </span>
                </div>
                <p className="mt-3 text-[10.5px] leading-relaxed text-[#b7b1cc]">
                  Body in the flesh, Energy the moving charge, Emotions the tone. The Heart row is lit — the map reads outward from the heart of the star.
                </p>
              </div>
            ) : (
              <div className="mt-1 flex min-h-[220px] flex-col items-center justify-center gap-3 text-center">
                <span className="lm2-glyph lm2-idle-pulse text-[20px] text-[#f3c77a]/35">✶</span>
                <p className="max-w-[200px] font-mono text-[8px] leading-relaxed tracking-[0.22em] text-[#b7b1cc]/45">
                  SEPTEM STATIONES — seven stations stand by for a date.
                </p>
              </div>
            )}
          </aside>

          {/* ---- right rail: purpose lines, docked to the dial's right edge ---- */}
          <aside
            className="relative z-30 order-4 w-full max-w-[400px] rotate-[0.6deg] lg:absolute lg:right-[max(0.5vw,calc(50%-790px))] lg:top-[6%] lg:w-[292px]"
            aria-label="Purpose lines"
          >
            <span className="lm2-chip absolute -top-3 right-5 z-10 rotate-[0.4deg] !border-[#b794f6]/50 !text-[9px] !text-[#b794f6]">Purpose lines</span>
            {result ? (
              <div className="lm2-rise grid gap-3" style={{ animationDelay: "0.5s" }}>
                {purposePlates.map((pl, i) => (
                  <article
                    key={pl.lat}
                    className={`lm2-panel relative px-4 py-3.5 ${i % 2 === 0 ? "-rotate-[0.4deg]" : "rotate-[0.4deg] translate-x-1"}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <MiniTri
                        x={"x" in pl ? pl.x : undefined}
                        y={"y" in pl ? pl.y : undefined}
                        z={pl.z}
                        mono={"x" in pl ? `${pl.xl} + ${pl.yl} → ${pl.zl}` : `Σ → ${pl.zl}`}
                      />
                      <div className="text-right">
                        <div className="text-[8px] uppercase tracking-[0.22em] text-[#f3c77a]/80">{pl.chip}</div>
                        <div className="lm2-serif mt-0.5 text-3xl leading-none text-[#f3c77a]">{pl.z}</div>
                        <div className="mt-1 font-mono text-[6px] tracking-[0.2em] text-[#b794f6]">{pl.lat}</div>
                      </div>
                    </div>
                    <p className="mt-1.5 text-[10.5px] leading-relaxed text-[#b7b1cc]">{pl.copy}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="lm2-panel flex min-h-[220px] flex-col items-center justify-center gap-3 px-5 py-5 text-center">
                <span className="lm2-glyph lm2-idle-pulse text-[20px] text-[#b794f6]/35">◈</span>
                <p className="max-w-[200px] font-mono text-[8px] leading-relaxed tracking-[0.22em] text-[#b7b1cc]/45">
                  QUATVOR PROPOSITA — four purpose lines wait on the star.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* micro readout strip under the stage */}
      <div className="relative z-10 mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-6 gap-y-2 px-5 pb-6 font-mono text-[8px] tracking-[0.22em] text-[#b7b1cc]/45 md:px-8">
        <span>POSITIONES · 22</span>
        <span className="text-[#b794f6]">◆ OCTAGRAM · CHAKRAS · PURPOSES</span>
        <span>INSTANT · NO SIGN-UP</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function DestinyMatrixV2Page() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#0a0912] font-sans text-[#e9e6f2] antialiased selection:bg-[#f3c77a]/25">
      <style>{LM2_STYLES}</style>
      <Backdrop />

      <div className="relative z-10">
        <Header />

        {/* ================= TOOL — the observatory stage ================= */}
        <section id="lm2-tool" className="relative overflow-visible">
          <Observatory />
          {/* section's bottom rule — the explainer below rides over it */}
          <div
            className="pointer-events-none absolute bottom-0 left-[-4vw] h-px w-[108vw] rotate-[0.3deg] bg-gradient-to-r from-transparent via-[#f3c77a]/30 to-transparent"
            aria-hidden
          />
        </section>

        {/* ================= EXPLAINER — condensed ================= */}
        <section className="relative z-20 -mt-2 pb-8">
          <div className="mx-auto max-w-[1400px] px-5 md:px-8">
            <div className="lm2-panel relative z-10 max-w-3xl -rotate-[0.5deg] px-6 py-7 md:ml-[6%] md:px-8">
              <span className="lm2-chip absolute -top-3 left-6 !text-[9px]">Quid est</span>
              <h2 className="lm2-serif text-[clamp(20px,2.6vw,28px)] text-[#e9e6f2]">
                What is the Destiny Matrix?
              </h2>
              <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-[#b7b1cc]">
                A numerological chart built from a single birth date. Day, month and year are folded
                into the 1–22 range of the Major Arcana and set onto an eight-pointed star: the day
                at the left point, the month above, the year to the right, their sum below, and the
                sum of all four burning at the center. Every line drawn between those points carries
                another number, until twenty-two positions are lit — character at the day point,
                talent at the month, karma at the year, comfort zone at the center. The ring of ages
                lays the same numbers across a life, decade by decade, so the chart reads less like
                a horoscope and more like an instrument panel for one particular person.
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
          <div className="mx-auto max-w-[1400px] px-5 md:px-8">
            <h2 className="lm2-serif rotate-[0.3deg] text-[clamp(22px,3vw,32px)] text-[#e9e6f2] md:translate-x-[14%]">
              Questions from the margins
            </h2>
            <div className="relative mx-auto mt-9 max-w-2xl md:ml-[10%]">
              {FAQ.map((f, i) => (
                <details
                  key={f.q}
                  className={`lm2-panel group relative z-10 mb-3 px-6 py-5 open:border-[#f3c77a]/40 ${
                    i % 2 === 0 ? "-rotate-[0.4deg] md:-ml-10 md:mr-6" : "rotate-[0.4deg] md:ml-10 md:-mr-4"
                  }`}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14.5px] text-[#e9e6f2] marker:hidden [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="lm2-glyph shrink-0 text-[13px] text-[#f3c77a] transition-transform group-open:rotate-45">
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
          <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-4 px-5 py-8 md:flex-row md:justify-between md:px-8">
            <div className="flex items-center gap-2.5">
              <span className="lm2-glyph grid h-6 w-6 place-items-center border border-[#f3c77a]/40 bg-[#f3c77a]/[0.07] text-[11px] text-[#f3c77a]">
                ☾{FE}
              </span>
              <span className="lm2-serif text-[14px] text-[#e9e6f2]">Astro Scope</span>
              <span className="font-mono text-[7px] tracking-[0.26em] text-[#b7b1cc]/45">DESTINY MATRIX · V2</span>
            </div>
            <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1 font-mono text-[8px] uppercase tracking-[0.2em] text-[#b7b1cc]/60">
              <Link href="/tarot" className="transition-colors hover:text-[#f3c77a]">Tarot</Link>
              <Link href="/tarot/birth-arcana" className="transition-colors hover:text-[#f3c77a]">Birth Arcana</Link>
              <Link href="/matrix" className="transition-colors hover:text-[#f3c77a]">Matrix</Link>
              <Link href="/matrix/v1" className="transition-colors hover:text-[#f3c77a]">V1</Link>
              <Link href="/matrix/v3" className="transition-colors hover:text-[#f3c77a]">V3</Link>
              <Link href="/matrix/v4" className="transition-colors hover:text-[#f3c77a]">V4</Link>
              <Link href="#lm2-tool" className="transition-colors hover:text-[#f3c77a]">Compute ↑</Link>
            </nav>
            <p className="font-mono text-[8px] tracking-[0.22em] text-[#b7b1cc]/40">© MMXXVI · AS ABOVE · SO BELOW</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
