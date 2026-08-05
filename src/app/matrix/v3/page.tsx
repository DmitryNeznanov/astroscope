"use client";

// DESTINY MATRIX · VARIANT III — "THE WORKSHEET". Same engine and diagram as
// v1 (math via @/lib/destiny-matrix, octagram geometry ported inline), but a
// different composition: a narrow fixed-feel LEFT RAIL holds the date entry
// plates, compute and a compact input echo; the main canvas to the right is a
// scrolling worksheet — octagram first (big, bleeding off the right edge and
// sliding under the rail), then the health map as a wide instrument table,
// then the purpose plates in a staggered cascade. A vertical hairline with a
// tick scale separates rail from canvas. Production palette (lab/remix-v2),
// broken+magic, scoped <style> with the lm3- prefix.

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
  { href: "/horoscopes/chinese", label: "Horoscope" },
];

const MATRIX_VARIANTS = [
  { href: "/matrix/v1", label: "V1", lat: "SPECIMEN I" },
  { href: "/matrix/v2", label: "V2", lat: "SPECIMEN II" },
  { href: "/matrix/v3", label: "V3", lat: "SPECIMEN III", active: true },
  { href: "/matrix/v4", label: "V4", lat: "SPECIMEN IV" },
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
/* Scoped styles (lm3- prefix)                                         */
/* ------------------------------------------------------------------ */
const LM3_STYLES = `
  .lm3-serif { font-family: "Playfair Display", "Cormorant Garamond", Georgia, "Times New Roman", serif; }
  .lm3-glyph { font-family: "Noto Sans Symbols", "Noto Sans Symbols 2", Symbola, "Segoe UI Symbol", serif; font-style: normal; }

  /* panels stay translucent so the machinery passes visibly BEHIND them */
  .lm3-panel {
    background: linear-gradient(160deg, rgba(23,19,40,0.62), rgba(12,10,22,0.72));
    border: 1px solid rgba(233,230,242,0.10);
    backdrop-filter: blur(3px);
  }
  .lm3-chip {
    display: inline-block;
    border: 1px solid rgba(243,199,122,0.35);
    background: rgba(10,9,18,0.85);
    padding: 4px 10px;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #f3c77a;
  }

  .lm3-input { background: transparent; outline: none; }
  .lm3-input:focus { background: rgba(243,199,122,0.06); }
  .lm3-input::selection { background: rgba(243,199,122,0.3); }

  /* engraved worksheet section headers */
  .lm3-engraved {
    font-family: ui-monospace, monospace;
    letter-spacing: 0.34em;
    text-transform: uppercase;
    color: rgba(183,177,204,0.55);
    text-shadow: 0 1px 0 rgba(243,199,122,0.12);
  }

  /* ---- magic background motion (all slow, all guarded below) ---- */
  @keyframes lm3-spin     { to { transform: rotate(360deg); } }
  @keyframes lm3-spin-rev { to { transform: rotate(-360deg); } }
  @keyframes lm3-twinkle  { 0%,100% { opacity: 0.12; } 50% { opacity: 0.75; } }
  @keyframes lm3-floatA   { 0%,100% { transform: translate(0,0) rotate(-2deg); } 50% { transform: translate(1.5vw,-2vh) rotate(1deg); } }
  @keyframes lm3-floatB   { 0%,100% { transform: translate(0,0) rotate(3deg); } 50% { transform: translate(-1.5vw,2vh) rotate(-1deg); } }
  .lm3-wheel-spin      { animation: lm3-spin 280s linear infinite; transform-origin: 50% 50%; }
  .lm3-wheel-spin-rev  { animation: lm3-spin-rev 340s linear infinite; transform-origin: 50% 50%; }
  .lm3-wheel-spin-slow { animation: lm3-spin 150s linear infinite; transform-origin: 50% 50%; }
  .lm3-twinkle         { animation: lm3-twinkle 7s ease-in-out infinite; }
  .lm3-float-a         { animation: lm3-floatA 34s ease-in-out infinite; }
  .lm3-float-b         { animation: lm3-floatB 42s ease-in-out infinite; }
  .lm3-nebula          { animation: lm3-floatA 60s ease-in-out infinite; }

  /* worksheet scanline — a hairline of light sweeping down the canvas */
  @keyframes lm3-sweep { 0% { transform: translateY(-10vh); opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { transform: translateY(120vh); opacity: 0; } }
  .lm3-sweep { animation: lm3-sweep 26s linear infinite; }

  /* ---- result reveal: star drawn on, nodes stamp in, center breathes ---- */
  .lm3-draw      { stroke-dasharray: 1600; stroke-dashoffset: 1600; animation: lm3-draw 2.8s ease-out forwards; }
  .lm3-draw-fast { stroke-dasharray: 700;  stroke-dashoffset: 700;  animation: lm3-draw 2s ease-out forwards; }
  .lm3-rise      { opacity: 0; transform: translateY(10px); animation: lm3-rise 0.9s ease-out forwards; }
  .lm3-halo      { animation: lm3-halo 6s ease-in-out infinite; }
  @keyframes lm3-draw { to { stroke-dashoffset: 0; } }
  @keyframes lm3-rise { to { opacity: 1; transform: translateY(0); } }
  @keyframes lm3-halo { 0%,100% { opacity: 0.45; } 50% { opacity: 1; } }

  @media (prefers-reduced-motion: reduce) {
    .lm3-wheel-spin, .lm3-wheel-spin-rev, .lm3-wheel-spin-slow,
    .lm3-twinkle, .lm3-float-a, .lm3-float-b, .lm3-nebula, .lm3-halo, .lm3-sweep { animation: none !important; }
    .lm3-draw, .lm3-draw-fast { animation: none !important; stroke-dashoffset: 0; }
    .lm3-rise { animation: none !important; opacity: 1; transform: none; }
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
      <div className="lm3-nebula absolute -left-[20vw] top-[6vh] h-[70vmin] w-[70vmin] bg-[radial-gradient(circle,rgba(162,90,223,0.11),transparent_65%)]" />
      <div className="lm3-nebula absolute right-[-12vw] top-[48vh] h-[80vmin] w-[80vmin] bg-[radial-gradient(circle,rgba(243,199,122,0.08),transparent_65%)]" />
      <div className="lm3-nebula absolute left-[24vw] bottom-[-18vh] h-[60vmin] w-[60vmin] bg-[radial-gradient(circle,rgba(183,148,246,0.07),transparent_65%)]" />

      {/* two huge octagram wheels, half off-screen, counter-rotating */}
      <div className="lm3-wheel-spin absolute -top-[42vmin] -right-[48vmin] h-[150vmin] w-[150vmin] opacity-[0.07]">
        <OctagramWheelSvg />
      </div>
      <div className="lm3-wheel-spin-rev absolute -bottom-[46vmin] -left-[44vmin] h-[130vmin] w-[130vmin] opacity-[0.055]">
        <OctagramWheelSvg />
      </div>

      <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        {/* star specks */}
        {STARS.map((s) =>
          s.tw ? (
            <circle key={s.key} cx={s.x} cy={s.y} r={s.r} fill={CREAM} className="lm3-twinkle" style={{ animationDelay: `${s.d}s`, opacity: s.o }} />
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
      <span className="lm3-glyph lm3-float-a absolute left-[3vw] top-[70vh] text-[26vmin] leading-none text-[#b794f6] opacity-[0.055]">
        ✦{FE}
      </span>
      <span className="lm3-glyph lm3-float-b absolute right-[6vw] top-[160vh] text-[30vmin] leading-none text-[#f3c77a] opacity-[0.05]">
        ☉{FE}
      </span>
      <span className="lm3-glyph lm3-float-a absolute left-[38vw] top-[280vh] text-[24vmin] leading-none text-[#e9e6f2] opacity-[0.04]">
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
      <div className="flex items-center gap-5 px-5 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="lm3-glyph grid h-7 w-7 place-items-center border border-[#f3c77a]/40 bg-[#f3c77a]/[0.07] text-[13px] text-[#f3c77a]">
            ☾{FE}
          </span>
          <span className="lm3-serif text-[16px] tracking-wide text-[#e9e6f2]">Astro Scope</span>
        </Link>
        <span className="hidden font-mono text-[9px] tracking-[0.3em] text-[#b7b1cc]/50 sm:inline">
          DESTINY MATRIX · TABVLA OPERA
        </span>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/" className="hidden text-[12.5px] text-[#b7b1cc] transition-colors hover:text-[#e9e6f2] sm:inline">
            Sign in
          </Link>
          <Link
            href="#lm3-tool"
            className="border border-[#f3c77a]/50 bg-[#f3c77a]/10 px-3 py-1.5 text-[12.5px] text-[#ffdd9c] transition-colors hover:bg-[#f3c77a]/20"
          >
            Compute
          </Link>
        </div>
      </div>

      {/* cross-nav tabs — all tarot pages plus the matrix, current one lit */}
      <nav aria-label="Tools" className="border-t border-white/[0.05]">
        <div className="flex items-stretch gap-1 overflow-x-auto px-4 py-2 md:px-8">
          {TAROT_TABS.map((t, i) =>
            t.active ? (
              <span
                key={t.href}
                aria-current="page"
                className="lm3-chip shrink-0 -rotate-[0.4deg] !border-[#f3c77a]/70 !bg-[#f3c77a]/15 !text-[#ffdd9c]"
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

      {/* variant switcher — four workings of the same instrument */}
      <nav aria-label="Matrix variants" className="border-t border-white/[0.05] bg-[#0a0912]/60">
        <div className="flex items-center gap-1 overflow-x-auto px-4 py-1.5 md:px-8">
          <span className="lm3-engraved mr-3 shrink-0 text-[7px]">Matricis · Var</span>
          {MATRIX_VARIANTS.map((v, i) =>
            v.active ? (
              <span
                key={v.href}
                aria-current="page"
                className="flex shrink-0 rotate-[0.4deg] items-baseline gap-1.5 border border-[#b794f6]/60 bg-[#b794f6]/[0.12] px-2.5 py-1"
              >
                <span className="font-mono text-[10px] tracking-[0.18em] text-[#b794f6]">{v.label}</span>
                <span className="hidden font-mono text-[6.5px] tracking-[0.24em] text-[#b794f6]/60 md:inline">{v.lat}</span>
              </span>
            ) : (
              <Link
                key={v.href}
                href={v.href}
                className={`flex shrink-0 items-baseline gap-1.5 border border-transparent px-2.5 py-1 transition-colors hover:border-[#f3c77a]/30 ${
                  i % 2 === 0 ? "-rotate-[0.3deg]" : "rotate-[0.3deg]"
                }`}
              >
                <span className="font-mono text-[10px] tracking-[0.18em] text-[#b7b1cc]/70 hover:text-[#f3c77a]">{v.label}</span>
                <span className="hidden font-mono text-[6.5px] tracking-[0.24em] text-[#b7b1cc]/35 md:inline">{v.lat}</span>
              </Link>
            ),
          )}
          <span className="ml-auto hidden shrink-0 font-mono text-[7px] tracking-[0.28em] text-[#b7b1cc]/35 lg:inline">
            IDEM INSTRUMENTVM · ALIA COMPOSITIO
          </span>
        </div>
      </nav>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* The octagram — centerpiece diagram (geometry ported from v1)        */
/* ------------------------------------------------------------------ */
function OctagramDiagram({ m }: { m: DestinyMatrix }) {
  const C = 320;
  const R = 196;
  const p = m.points;

  // cardinals — diamond square (0y/20y/40y/60y)
  const cardinals = [
    { deg: 270, value: p.apoint, age: "0y", tag: "A" },
    { deg: 0, value: p.bpoint, age: "20y", tag: "B" },
    { deg: 90, value: p.cpoint, age: "40y", tag: "C" },
    { deg: 180, value: p.dpoint, age: "60y", tag: "D" },
  ];
  // diagonals — axis square (10y/30y/50y/70y)
  const diagonals = [
    { deg: 315, value: p.fpoint, age: "10y", tag: "F" },
    { deg: 45, value: p.gpoint, age: "30y", tag: "G" },
    { deg: 135, value: p.ipoint, age: "50y", tag: "I" },
    { deg: 225, value: p.hpoint, age: "70y", tag: "H" },
  ];
  const outer = [...cardinals, ...diagonals].map((n) => ({ ...n, pos: onCircle(C, C, R, n.deg) }));

  // inner numbers along the spokes, straight from the engine's points
  const spoke = (deg: number, frac: number) => onCircle(C, C, R * frac, deg);
  const jPos = spoke(180, 0.46);
  const nPos = spoke(90, 0.46);
  const lPos = mid(jPos, nPos);
  const inner = [
    { pos: spoke(270, 0.2), value: p.wpoint, tag: "W" },
    { pos: spoke(270, 0.42), value: p.spoint, tag: "S" },
    { pos: spoke(270, 0.66), value: p.opoint, tag: "O" },
    { pos: spoke(0, 0.2), value: p.xpoint, tag: "X" },
    { pos: spoke(0, 0.42), value: p.tpoint, tag: "T" },
    { pos: spoke(0, 0.66), value: p.ppoint, tag: "P" },
    { pos: nPos, value: p.npoint, tag: "N" },
    { pos: jPos, value: p.jpoint, tag: "J" },
    { pos: mid(jPos, lPos), value: p.kpoint, tag: "K" },
    { pos: lPos, value: p.lpoint, tag: "L" },
    { pos: mid(lPos, nPos), value: p.mpoint, tag: "M" },
  ];

  const diamondPts = cardinals.map((n) => onCircle(C, C, R, n.deg)).map((q) => `${q.x},${q.y}`).join(" ");
  const axisPts = diagonals.map((n) => onCircle(C, C, R, n.deg)).map((q) => `${q.x},${q.y}`).join(" ");

  return (
    <svg
      viewBox="0 0 640 640"
      className="w-full max-w-[640px]"
      role="img"
      aria-label={`Destiny matrix octagram: day ${p.apoint}, month ${p.bpoint}, year ${p.cpoint}, base ${p.dpoint}, center ${p.epoint}`}
    >
      <defs>
        <radialGradient id="lm3-core-glow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.22" />
          <stop offset="55%" stopColor={VIOLET} stopOpacity="0.08" />
          <stop offset="100%" stopColor={BG} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lm3-center-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={CREAM} stopOpacity="0.5" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={C} cy={C} r={310} fill="url(#lm3-core-glow)" />

      {/* age ring */}
      <circle className="lm3-draw" cx={C} cy={C} r={248} fill="none" stroke={GOLD_DEEP} strokeOpacity="0.55" strokeWidth="0.8" />
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
          className="lm3-draw-fast"
          style={{ animationDelay: `${0.2 + i * 0.08}s` }}
          x1={C}
          y1={C}
          x2={n.pos.x}
          y2={n.pos.y}
          stroke={i % 2 === 0 ? GOLD : VIOLET_SOFT}
          strokeOpacity="0.3"
          strokeWidth="0.7"
        />
      ))}

      {/* the money line: J — K — L — M — N */}
      <line className="lm3-draw-fast" style={{ animationDelay: "0.9s" }} x1={jPos.x} y1={jPos.y} x2={nPos.x} y2={nPos.y} stroke={CREAM} strokeOpacity="0.35" strokeWidth="0.7" strokeDasharray="3 3" />

      {/* the two squares of the octagram */}
      <polygon className="lm3-draw" style={{ animationDelay: "0.4s" }} points={diamondPts} fill="none" stroke={GOLD} strokeOpacity="0.85" strokeWidth="1.2" />
      <polygon className="lm3-draw" style={{ animationDelay: "0.8s" }} points={axisPts} fill="none" stroke={VIOLET_SOFT} strokeOpacity="0.8" strokeWidth="1.2" />

      {/* age labels on the outer ring */}
      {outer.map((n, i) => {
        const lp = onCircle(C, C, 268, n.deg);
        return (
          <text
            key={`age-${n.tag}`}
            className="lm3-rise"
            style={{ animationDelay: `${1.3 + i * 0.06}s` }}
            x={lp.x}
            y={lp.y + 3}
            textAnchor="middle"
            fontSize="11"
            fill={GOLD}
            opacity="0.85"
            fontFamily="ui-monospace, monospace"
            letterSpacing="1"
          >
            {n.age}
          </text>
        );
      })}

      {/* inner nodes */}
      {inner.map((n, i) => (
        <g key={`inner-${n.tag}`} className="lm3-rise" style={{ animationDelay: `${1.5 + i * 0.07}s` }}>
          <circle cx={n.pos.x} cy={n.pos.y} r={13} fill="rgba(12,10,22,0.95)" stroke={VIOLET_SOFT} strokeOpacity="0.75" strokeWidth="0.9" />
          <text x={n.pos.x} y={n.pos.y + 3.5} textAnchor="middle" fontSize="10.5" fill={VIOLET_SOFT} fontFamily="ui-monospace, monospace">
            {n.value}
          </text>
        </g>
      ))}

      {/* outer nodes — the eight stations */}
      {outer.map((n, i) => (
        <g key={`outer-${n.tag}`} className="lm3-rise" style={{ animationDelay: `${1.1 + i * 0.07}s` }}>
          <circle cx={n.pos.x} cy={n.pos.y} r={21} fill="rgba(12,10,22,0.95)" stroke={GOLD} strokeOpacity="0.9" strokeWidth="1.1" />
          <circle cx={n.pos.x} cy={n.pos.y} r={16.5} fill="none" stroke={i % 2 === 0 ? GOLD : VIOLET_SOFT} strokeOpacity="0.35" strokeWidth="0.6" />
          <text x={n.pos.x} y={n.pos.y + 5} textAnchor="middle" fontSize="14" fill={CREAM} fontFamily="ui-monospace, monospace">
            {n.value}
          </text>
        </g>
      ))}

      {/* center — the largest node, glowing */}
      <g className="lm3-rise" style={{ animationDelay: "1.9s" }}>
        <circle className="lm3-halo" cx={C} cy={C} r={58} fill="url(#lm3-center-glow)" />
        <circle cx={C} cy={C} r={36} fill={BG} stroke={GOLD} strokeWidth="1.3" />
        <circle cx={C} cy={C} r={29} fill="none" stroke={VIOLET_SOFT} strokeOpacity="0.5" strokeWidth="0.7" />
        <text x={C} y={C + 9} textAnchor="middle" fontSize="26" fill={GOLD} fontFamily="ui-monospace, monospace" letterSpacing="1">
          {p.epoint}
        </text>
      </g>
      <text className="lm3-rise" style={{ animationDelay: "2.1s" }} x={C} y={C + 58} textAnchor="middle" fontSize="6.5" letterSpacing="2.5" fill={VIOLET_SOFT} fontFamily="ui-monospace, monospace">
        CENTRVM · E
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Purpose plate mini-diagram — tiny triangle X + Y → Z                */
/* ------------------------------------------------------------------ */
function MiniTri({ x, y, z, mono }: { x?: number; y?: number; z: number; mono: string }) {
  return (
    <svg viewBox="0 0 120 76" className="h-[76px] w-[120px]" aria-hidden>
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
/* The Worksheet — left rail (entry plates) + scrolling canvas         */
/* ------------------------------------------------------------------ */
function Worksheet() {
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

  const inputPlates = [
    { label: "Day", lat: "DIES", value: day, set: setDay, ph: "14", max: 2, tilt: "rotate-[0.5deg]" },
    { label: "Month", lat: "MENSIS", value: month, set: setMonth, ph: "03", max: 2, tilt: "-rotate-[0.4deg] lg:translate-x-2" },
    { label: "Year", lat: "ANNVS", value: year, set: setYear, ph: "1985", max: 4, tilt: "rotate-[0.5deg] lg:-translate-x-1" },
  ] as const;

  return (
    <section id="lm3-tool" className="relative overflow-visible">
      {/* slow scanline sweeping the whole worksheet */}
      <div
        aria-hidden
        className="lm3-sweep pointer-events-none absolute inset-x-0 top-0 z-30 h-px bg-gradient-to-r from-transparent via-[#f3c77a]/45 to-transparent"
      />

      <div className="lg:grid lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* ================= LEFT RAIL — the entry instrument ============ */}
        <aside className="relative z-20 border-b border-white/[0.07] lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0">
          {/* vertical hairline separating rail from canvas + tick scale */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-px bg-gradient-to-b from-transparent via-[#f3c77a]/30 to-transparent lg:block"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-6 right-[-5px] hidden lg:block"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, rgba(243,199,122,0.4) 0 1px, transparent 1px 14px)",
              width: "9px",
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute right-[-30px] top-1/2 hidden -translate-y-1/2 rotate-90 font-mono text-[7px] tracking-[0.34em] text-[#b7b1cc]/35 lg:inline"
          >
            SCALA · I AD XXII
          </span>

          <div className="relative px-6 py-8 lg:py-10">
            <span className="lm3-chip -rotate-[0.5deg] !text-[9px]">Machina Matricis · III</span>
            <h1 className="lm3-serif mt-5 text-[clamp(26px,2.6vw,34px)] leading-[1.1] tracking-tight text-[#e9e6f2]">
              The worksheet of <span className="text-[#f3c77a]">one birth date.</span>
            </h1>
            <p className="mt-3 text-[12.5px] leading-relaxed text-[#b7b1cc]">
              Three numbers in the rail; the star, the health map and the purposes
              unroll on the worksheet to the right.
            </p>

            {/* entry plates — stacked down the rail */}
            <form onSubmit={compute} className="relative mt-7">
              <div className="flex flex-col gap-3.5">
                {inputPlates.map((f) => (
                  <label key={f.lat} className={`lm3-panel relative block px-4 py-3 ${f.tilt}`}>
                    <span className="mb-1.5 flex items-baseline justify-between">
                      <span className="text-[9px] uppercase tracking-[0.24em] text-[#f3c77a]/80">{f.label}</span>
                      <span className="font-mono text-[7px] tracking-[0.2em] text-[#b7b1cc]/40">{f.lat}</span>
                    </span>
                    <span className="block border-b border-[#f3c77a]/30 transition-colors focus-within:border-[#f3c77a]/70">
                      <input
                        value={f.value}
                        onChange={(ev) => f.set(ev.target.value.replace(/[^\d]/g, "").slice(0, f.max))}
                        placeholder={f.ph}
                        inputMode="numeric"
                        autoComplete="off"
                        aria-label={f.label}
                        className="lm3-input w-full px-1 py-1.5 text-center font-mono text-2xl tracking-[0.2em] text-[#e9e6f2] placeholder:text-[#e9e6f2]/15"
                      />
                    </span>
                  </label>
                ))}
              </div>

              <button
                type="submit"
                className="mt-5 w-full rotate-[0.4deg] border border-[#f3c77a] bg-[#f3c77a] px-6 py-3 text-[13px] font-medium text-[#0a0912] transition-transform hover:-translate-y-0.5"
              >
                ✦ Compute my matrix
              </button>

              {error ? (
                <p className="mt-4 border border-[#e39a4c]/50 bg-[#e39a4c]/10 px-3 py-2 font-mono text-[9px] tracking-[0.18em] text-[#ffdd9c]">
                  {error}
                </p>
              ) : null}
            </form>

            {/* compact input echo — the raw folds, once computed */}
            {result ? (
              <div className="lm3-panel lm3-rise relative mt-6 -rotate-[0.4deg] px-4 py-4" key={`echo-${stamp}`}>
                <span className="lm3-chip absolute -top-3 left-4 !text-[8px]">Echo · Datum</span>
                <p className="mt-1 text-center font-mono text-[15px] tracking-[0.22em] text-[#e9e6f2]">
                  {String(result.inputs.day).padStart(2, "0")}
                  <span className="text-[#f3c77a]/60">·</span>
                  {String(result.inputs.month).padStart(2, "0")}
                  <span className="text-[#f3c77a]/60">·</span>
                  {result.inputs.year}
                </p>
                <div className="mt-3 grid grid-cols-5 gap-1 border-t border-white/[0.07] pt-3 text-center font-mono">
                  {(
                    [
                      ["A", result.points.apoint],
                      ["B", result.points.bpoint],
                      ["C", result.points.cpoint],
                      ["D", result.points.dpoint],
                      ["E", result.points.epoint],
                    ] as const
                  ).map(([tag, v]) => (
                    <div key={tag}>
                      <div className="text-[13px] text-[#ffdd9c]">{v}</div>
                      <div className="mt-0.5 text-[7px] tracking-[0.2em] text-[#b794f6]/70">{tag}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* rail micro-readouts */}
            <div className="mt-7 flex flex-col gap-1.5 font-mono text-[8px] leading-relaxed tracking-[0.22em] text-[#b7b1cc]/45">
              <span>POSITIONES · 22</span>
              <span className="text-[#b794f6]">◆ OCTAGRAM · CHAKRAS · PURPOSES</span>
              <span>DD·MM·YYYY → FOLD 1–22</span>
              <span>INSTANT · NO SIGN-UP</span>
            </div>

            {/* small wheel pinned to the rail's foot */}
            <div className="lm3-wheel-spin-slow pointer-events-none absolute -bottom-24 -left-24 hidden h-[260px] w-[260px] opacity-[0.12] lg:block" aria-hidden>
              <OctagramWheelSvg />
            </div>
          </div>
        </aside>

        {/* ================= CANVAS — the worksheet itself =============== */}
        <div className="relative min-w-0">
          {!result ? (
            /* empty folio before the first compute */
            <div className="relative px-5 py-10 md:px-12 md:py-14">
              <p className="lm3-engraved text-[8px]">Opvs I · Octagramma — Folio Cavum</p>
              <div aria-hidden className="lm3-panel relative mt-6 hidden select-none rotate-[0.4deg] px-6 py-6 opacity-60 md:block lg:-ml-4 lg:mr-10">
                <span className="lm3-chip absolute -top-3 right-6 -rotate-[0.6deg] !text-[9px]">Tabula Vacua</span>
                <div className="flex min-h-[380px] flex-col items-center justify-center gap-3 text-center">
                  <span className="lm3-glyph text-[26px] text-[#f3c77a]/40">✶</span>
                  <p className="max-w-[260px] font-mono text-[8px] leading-relaxed tracking-[0.24em] text-[#b7b1cc]/45">
                    HIC OCTAGRAMMA APPAREBIT — enter the date in the rail and the
                    eight-pointed star rises here on the worksheet.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div ref={resultRef} key={stamp} className="relative pb-6">
              {/* ------- OPVS I — the octagram, bleeding off the right edge ------- */}
              <div className="relative px-5 pt-10 md:px-12 md:pt-14">
                <div className="lm3-rise flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <p className="lm3-engraved text-[8px]">Opvs I · Octagramma</p>
                  <span className="font-mono text-[9px] tracking-[0.2em] text-[#b7b1cc]/60">
                    TABVLA ILLVMINATA · SCALA 1 : 22
                  </span>
                </div>

                {/* the panel overlaps the rail's hairline and runs off the right edge */}
                <figure className="lm3-panel lm3-rise relative z-10 mt-5 -rotate-[0.4deg] px-4 py-6 !border-[#f3c77a]/30 shadow-[0_0_70px_rgba(243,199,122,0.09)] md:px-6 lg:-ml-14 lg:mr-[-6rem] xl:mr-[-9rem]" style={{ animationDelay: "0.1s" }}>
                  <span className="lm3-chip absolute -top-3 left-6 rotate-[0.5deg]">Octagramma</span>
                  <span className="lm3-chip absolute -bottom-3 right-8 -rotate-[0.5deg] !border-[#b794f6]/50 !text-[#b794f6] !text-[9px]">
                    0 – 70 anni
                  </span>
                  <div className="flex justify-center">
                    <OctagramDiagram m={result} />
                  </div>
                  <figcaption className="mt-2 flex items-center justify-between gap-4 font-mono text-[7px] tracking-[0.24em] text-[#b7b1cc]/45">
                    <span>A·B·C·D CARDINALES — F·G·H·I AXES</span>
                    <span className="hidden text-[#b794f6]/70 sm:inline">J·K·L·M·N LINEA FORTVNAE</span>
                  </figcaption>
                </figure>
              </div>

              {/* ------- OPVS II — health map, wide instrument table ------- */}
              <div className="relative mt-12 px-5 md:px-12">
                <div className="lm3-rise flex flex-wrap items-baseline gap-x-4 gap-y-1 md:translate-x-6" style={{ animationDelay: "0.2s" }}>
                  <p className="lm3-engraved text-[8px]">Opvs II · Charta Cordis</p>
                  <span className="font-mono text-[9px] tracking-[0.2em] text-[#b7b1cc]/60">SEPTEM STATIONES</span>
                </div>

                <section className="lm3-panel lm3-rise relative mt-5 rotate-[0.3deg] px-5 py-6 md:px-8 lg:ml-6" style={{ animationDelay: "0.3s" }}>
                  <span className="lm3-chip absolute -top-3 left-6 -rotate-[0.4deg]">Chart of the heart · health map</span>
                  <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="lm3-serif text-[clamp(18px,2.4vw,26px)] text-[#e9e6f2]">Seven stations through the center</h2>
                    <span className="font-mono text-[8px] tracking-[0.26em] text-[#b7b1cc]/50">CORPVS · ENERGIA · AFFECTVS</span>
                  </div>

                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[560px] border-collapse font-mono">
                      <thead>
                        <tr className="border-b border-[#f3c77a]/25 text-left text-[8px] uppercase tracking-[0.26em] text-[#b7b1cc]/55">
                          <th className="py-2 pr-3 font-normal">№</th>
                          <th className="py-2 pr-3 font-normal">Chakra</th>
                          <th className="py-2 pr-3 font-normal">Sanskrit</th>
                          <th className="py-2 text-right font-normal text-[#f3c77a]/80">Body</th>
                          <th className="py-2 text-right font-normal text-[#b794f6]">Energy</th>
                          <th className="py-2 text-right font-normal text-[#ffdd9c]/80">Emotions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((r) => (
                          <tr
                            key={r.no}
                            className={`border-b border-white/[0.06] text-[12px] ${
                              r.no === "IV" ? "bg-[#f3c77a]/[0.05]" : ""
                            }`}
                          >
                            <td className="py-2.5 pr-3 text-[9px] text-[#f3c77a]/70">{r.no}</td>
                            <td className="py-2.5 pr-3 text-[#e9e6f2]">{r.name}</td>
                            <td className="py-2.5 pr-3 text-[10px] tracking-[0.12em] text-[#b7b1cc]/70">{r.sanskrit}</td>
                            <td className="py-2.5 text-right text-[#f3c77a]">{r.body}</td>
                            <td className="py-2.5 text-right text-[#b794f6]">{r.energy}</td>
                            <td className="py-2.5 text-right text-[#ffdd9c]">{r.emotions}</td>
                          </tr>
                        ))}
                        {totals ? (
                          <tr className="text-[12px]">
                            <td className="py-2.5 pr-3 text-[9px] uppercase tracking-[0.24em] text-[#b7b1cc]/60" colSpan={3}>
                              Σ Total · folded
                            </td>
                            <td className="py-2.5 text-right text-[#f3c77a]">{totals.body}</td>
                            <td className="py-2.5 text-right text-[#b794f6]">{totals.energy}</td>
                            <td className="py-2.5 text-right text-[#ffdd9c]">{totals.emotions}</td>
                          </tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>

                  <p className="mt-4 max-w-2xl text-[11.5px] leading-relaxed text-[#b7b1cc]">
                    Body is the number the chakra carries in the flesh, Energy the charge that moves
                    through it, Emotions the tone it sounds. The Heart row — Anahata — is lit because
                    the whole map is read from the heart of the star outward.
                  </p>
                </section>
              </div>

              {/* ------- OPVS III — purpose plates in a staggered cascade ------- */}
              <div className="relative mt-12 px-5 pb-10 md:px-12">
                <div className="lm3-rise flex flex-wrap items-baseline gap-x-4 gap-y-1 md:translate-x-12" style={{ animationDelay: "0.35s" }}>
                  <p className="lm3-engraved text-[8px]">Opvs III · Proposita</p>
                  <span className="font-mono text-[9px] tracking-[0.2em] text-[#b7b1cc]/60">QVATTVOR TABELLAE</span>
                </div>

                <div className="relative mt-5">
                  {/* dashed hairline threading the cascade */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute bottom-8 left-[26px] top-2 hidden w-px rotate-[0.6deg] md:block"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(to bottom, rgba(183,148,246,0.4) 0 4px, transparent 4px 9px)",
                    }}
                  />
                  <div className="flex flex-col gap-4">
                    {(
                      [
                        {
                          chip: "Finding yourself",
                          lat: "PROPOSITVM PERSONALE",
                          x: result.purposes.skypoint,
                          y: result.purposes.earthpoint,
                          z: result.purposes.perspurpose,
                          xl: "Sky",
                          yl: "Earth",
                          zl: "Personal",
                          copy: "What the soul came to do before forty — sky over earth, pressed into one number.",
                          tilt: "-rotate-[0.5deg] md:ml-10",
                        },
                        {
                          chip: "Socialization",
                          lat: "PROPOSITVM SOCIALE",
                          x: result.purposes.femalepoint,
                          y: result.purposes.malepoint,
                          z: result.purposes.socialpurpose,
                          xl: "Female",
                          yl: "Male",
                          zl: "Social",
                          copy: "The task other people hand you — the female and male lines folded together.",
                          tilt: "rotate-[0.5deg] md:ml-24",
                        },
                        {
                          chip: "Spiritual harmony",
                          lat: "PROPOSITVM GENERALE",
                          z: result.purposes.generalpurpose,
                          zl: "General",
                          copy: "Personal and social purposes summed — the note the whole instrument is tuned to.",
                          tilt: "-rotate-[0.4deg] md:ml-40",
                        },
                        {
                          chip: "Planetary",
                          lat: "PROPOSITVM PLANETARIVM",
                          z: result.purposes.planetarypurpose,
                          zl: "Planetary",
                          copy: "The widest ring — what this chart is asked to contribute beyond itself.",
                          tilt: "rotate-[0.4deg] md:ml-56",
                        },
                      ] as const
                    ).map((pl, i) => (
                      <article
                        key={pl.lat}
                        className={`lm3-panel lm3-rise relative max-w-xl px-5 py-4 ${pl.tilt}`}
                        style={{ animationDelay: `${0.4 + i * 0.12}s` }}
                      >
                        <span className="lm3-chip absolute -top-3 left-4 !text-[8px]">{pl.chip}</span>
                        <div className="mt-2 flex items-center justify-between gap-3">
                          <MiniTri
                            x={"x" in pl ? pl.x : undefined}
                            y={"y" in pl ? pl.y : undefined}
                            z={pl.z}
                            mono={"x" in pl ? `${pl.xl} + ${pl.yl} → ${pl.zl}` : `Σ → ${pl.zl}`}
                          />
                          <div className="text-right">
                            <div className="lm3-serif text-4xl leading-none text-[#f3c77a]">{pl.z}</div>
                            <div className="mt-1 font-mono text-[7px] tracking-[0.22em] text-[#b794f6]">{pl.lat}</div>
                          </div>
                        </div>
                        {"x" in pl ? (
                          <div className="mt-2 flex flex-wrap gap-1.5 font-mono text-[8px] tracking-[0.14em]">
                            <span className="border border-[#b794f6]/30 px-1.5 py-0.5 text-[#b794f6]">
                              {pl.xl} {pl.x}
                            </span>
                            <span className="border border-[#b794f6]/30 px-1.5 py-0.5 text-[#b794f6]">
                              {pl.yl} {pl.y}
                            </span>
                            <span className="border border-[#f3c77a]/40 px-1.5 py-0.5 text-[#ffdd9c]">
                              → {pl.zl} {pl.z}
                            </span>
                          </div>
                        ) : null}
                        <p className="mt-2 text-[11.5px] leading-relaxed text-[#b7b1cc]">{pl.copy}</p>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function DestinyMatrixV3Page() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#0a0912] font-sans text-[#e9e6f2] antialiased selection:bg-[#f3c77a]/25">
      <style>{LM3_STYLES}</style>
      <Backdrop />

      <div className="relative z-10">
        <Header />

        {/* ================= TOOL — rail + worksheet, top of the viewport ================= */}
        <Worksheet />

        {/* ================= EXPLAINER — condensed ================= */}
        <section className="relative z-20 pb-8">
          <div
            className="pointer-events-none absolute -top-2 left-[-4vw] h-px w-[108vw] rotate-[0.3deg] bg-gradient-to-r from-transparent via-[#f3c77a]/30 to-transparent"
            aria-hidden
          />
          <div className="mx-auto max-w-6xl px-5 pt-10 md:px-8">
            <div className="lm3-panel relative z-10 max-w-3xl -rotate-[0.5deg] px-6 py-7 md:ml-[8%] md:px-8">
              <span className="lm3-chip absolute -top-3 left-6 !text-[9px]">Quid est</span>
              <h2 className="lm3-serif text-[clamp(20px,2.6vw,28px)] text-[#e9e6f2]">
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
            <h2 className="lm3-serif rotate-[0.3deg] text-[clamp(22px,3vw,32px)] text-[#e9e6f2] md:translate-x-[14%]">
              Questions from the margins
            </h2>
            <div className="relative mx-auto mt-9 max-w-2xl md:ml-[10%]">
              {FAQ.map((f, i) => (
                <details
                  key={f.q}
                  className={`lm3-panel group relative z-10 mb-3 px-6 py-5 open:border-[#f3c77a]/40 ${
                    i % 2 === 0 ? "-rotate-[0.4deg] md:-ml-10 md:mr-6" : "rotate-[0.4deg] md:ml-10 md:-mr-4"
                  }`}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14.5px] text-[#e9e6f2] marker:hidden [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="lm3-glyph shrink-0 text-[13px] text-[#f3c77a] transition-transform group-open:rotate-45">
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
              <span className="lm3-glyph grid h-6 w-6 place-items-center border border-[#f3c77a]/40 bg-[#f3c77a]/[0.07] text-[11px] text-[#f3c77a]">
                ☾{FE}
              </span>
              <span className="lm3-serif text-[14px] text-[#e9e6f2]">Astro Scope</span>
              <span className="font-mono text-[7px] tracking-[0.26em] text-[#b7b1cc]/45">DESTINY MATRIX · III</span>
            </div>
            <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1 font-mono text-[8px] uppercase tracking-[0.2em] text-[#b7b1cc]/60">
              <Link href="/tarot" className="transition-colors hover:text-[#f3c77a]">Tarot</Link>
              <Link href="/tarot/birth-arcana" className="transition-colors hover:text-[#f3c77a]">Birth Arcana</Link>
              <Link href="/tarot/cards" className="transition-colors hover:text-[#f3c77a]">Cards</Link>
              <Link href="#lm3-tool" className="transition-colors hover:text-[#f3c77a]">Compute ↑</Link>
            </nav>
            <p className="font-mono text-[8px] tracking-[0.22em] text-[#b7b1cc]/40">© MMXXVI · AS ABOVE · SO BELOW</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
