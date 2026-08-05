"use client";

// DESTINY MATRIX — a TOOL page, not a landing. The calculator sits at the top
// of the viewport under a compact header and tarot cross-nav tabs; the result
// renders the full octagram diagram, the chakra health map and the purpose
// lines. Math ported from astral-day's destiny-matrix engine into
// src/lib/destiny-matrix.ts. Broken layout + magic background kept from the
// lab direction, in the PRODUCTION palette (lab/remix-v2). Self-contained:
// inline SVG + Tailwind + one scoped <style> block (ldm- prefixed).

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
  { href: "/tarot/destiny-matrix", label: "Matrix", active: true },
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
/* Scoped styles (ldm- prefix)                                         */
/* ------------------------------------------------------------------ */
const LDM_STYLES = `
  .ldm-serif { font-family: "Playfair Display", "Cormorant Garamond", Georgia, "Times New Roman", serif; }
  .ldm-glyph { font-family: "Noto Sans Symbols", "Noto Sans Symbols 2", Symbola, "Segoe UI Symbol", serif; font-style: normal; }

  /* panels stay translucent so the machinery passes visibly BEHIND them */
  .ldm-panel {
    background: linear-gradient(160deg, rgba(23,19,40,0.62), rgba(12,10,22,0.72));
    border: 1px solid rgba(233,230,242,0.10);
    backdrop-filter: blur(3px);
  }
  .ldm-chip {
    display: inline-block;
    border: 1px solid rgba(243,199,122,0.35);
    background: rgba(10,9,18,0.85);
    padding: 4px 10px;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #f3c77a;
  }

  .ldm-input { background: transparent; outline: none; }
  .ldm-input:focus { background: rgba(243,199,122,0.06); }
  .ldm-input::selection { background: rgba(243,199,122,0.3); }

  /* ---- magic background motion (all slow, all guarded below) ---- */
  @keyframes ldm-spin     { to { transform: rotate(360deg); } }
  @keyframes ldm-spin-rev { to { transform: rotate(-360deg); } }
  @keyframes ldm-twinkle  { 0%,100% { opacity: 0.12; } 50% { opacity: 0.75; } }
  @keyframes ldm-floatA   { 0%,100% { transform: translate(0,0) rotate(-2deg); } 50% { transform: translate(1.5vw,-2vh) rotate(1deg); } }
  @keyframes ldm-floatB   { 0%,100% { transform: translate(0,0) rotate(3deg); } 50% { transform: translate(-1.5vw,2vh) rotate(-1deg); } }
  .ldm-wheel-spin      { animation: ldm-spin 280s linear infinite; transform-origin: 50% 50%; }
  .ldm-wheel-spin-rev  { animation: ldm-spin-rev 340s linear infinite; transform-origin: 50% 50%; }
  .ldm-wheel-spin-slow { animation: ldm-spin 150s linear infinite; transform-origin: 50% 50%; }
  .ldm-twinkle         { animation: ldm-twinkle 7s ease-in-out infinite; }
  .ldm-float-a         { animation: ldm-floatA 34s ease-in-out infinite; }
  .ldm-float-b         { animation: ldm-floatB 42s ease-in-out infinite; }
  .ldm-nebula          { animation: ldm-floatA 60s ease-in-out infinite; }

  /* ---- result reveal: star drawn on, nodes stamp in, center breathes ---- */
  .ldm-draw      { stroke-dasharray: 1600; stroke-dashoffset: 1600; animation: ldm-draw 2.8s ease-out forwards; }
  .ldm-draw-fast { stroke-dasharray: 700;  stroke-dashoffset: 700;  animation: ldm-draw 2s ease-out forwards; }
  .ldm-rise      { opacity: 0; transform: translateY(10px); animation: ldm-rise 0.9s ease-out forwards; }
  .ldm-halo      { animation: ldm-halo 6s ease-in-out infinite; }
  @keyframes ldm-draw { to { stroke-dashoffset: 0; } }
  @keyframes ldm-rise { to { opacity: 1; transform: translateY(0); } }
  @keyframes ldm-halo { 0%,100% { opacity: 0.45; } 50% { opacity: 1; } }

  @media (prefers-reduced-motion: reduce) {
    .ldm-wheel-spin, .ldm-wheel-spin-rev, .ldm-wheel-spin-slow,
    .ldm-twinkle, .ldm-float-a, .ldm-float-b, .ldm-nebula, .ldm-halo { animation: none !important; }
    .ldm-draw, .ldm-draw-fast { animation: none !important; stroke-dashoffset: 0; }
    .ldm-rise { animation: none !important; opacity: 1; transform: none; }
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
      <div className="ldm-nebula absolute -left-[20vw] top-[6vh] h-[70vmin] w-[70vmin] bg-[radial-gradient(circle,rgba(162,90,223,0.11),transparent_65%)]" />
      <div className="ldm-nebula absolute right-[-12vw] top-[48vh] h-[80vmin] w-[80vmin] bg-[radial-gradient(circle,rgba(243,199,122,0.08),transparent_65%)]" />
      <div className="ldm-nebula absolute left-[24vw] bottom-[-18vh] h-[60vmin] w-[60vmin] bg-[radial-gradient(circle,rgba(183,148,246,0.07),transparent_65%)]" />

      {/* two huge octagram wheels, half off-screen, counter-rotating */}
      <div className="ldm-wheel-spin absolute -top-[42vmin] -right-[48vmin] h-[150vmin] w-[150vmin] opacity-[0.07]">
        <OctagramWheelSvg />
      </div>
      <div className="ldm-wheel-spin-rev absolute -bottom-[46vmin] -left-[44vmin] h-[130vmin] w-[130vmin] opacity-[0.055]">
        <OctagramWheelSvg />
      </div>

      <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        {/* star specks */}
        {STARS.map((s) =>
          s.tw ? (
            <circle key={s.key} cx={s.x} cy={s.y} r={s.r} fill={CREAM} className="ldm-twinkle" style={{ animationDelay: `${s.d}s`, opacity: s.o }} />
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
      <span className="ldm-glyph ldm-float-a absolute left-[3vw] top-[70vh] text-[26vmin] leading-none text-[#b794f6] opacity-[0.055]">
        ✦{FE}
      </span>
      <span className="ldm-glyph ldm-float-b absolute right-[6vw] top-[160vh] text-[30vmin] leading-none text-[#f3c77a] opacity-[0.05]">
        ☉{FE}
      </span>
      <span className="ldm-glyph ldm-float-a absolute left-[38vw] top-[280vh] text-[24vmin] leading-none text-[#e9e6f2] opacity-[0.04]">
        ☽{FE}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Header + cross-nav tabs                                             */
/* ------------------------------------------------------------------ */
function Header() {
  return (
    <header className="relative border-b border-white/[0.07]">
      <div className="mx-auto flex max-w-6xl items-center gap-5 px-5 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="ldm-glyph grid h-7 w-7 place-items-center border border-[#f3c77a]/40 bg-[#f3c77a]/[0.07] text-[13px] text-[#f3c77a]">
            ☾{FE}
          </span>
          <span className="ldm-serif text-[16px] tracking-wide text-[#e9e6f2]">Astro Scope</span>
        </Link>
        <span className="hidden font-mono text-[9px] tracking-[0.3em] text-[#b7b1cc]/50 sm:inline">
          DESTINY MATRIX · OCTAGRAMMA
        </span>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/" className="hidden text-[12.5px] text-[#b7b1cc] transition-colors hover:text-[#e9e6f2] sm:inline">
            Sign in
          </Link>
          <Link
            href="#ldm-tool"
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
                className="ldm-chip shrink-0 -rotate-[0.4deg] !border-[#f3c77a]/70 !bg-[#f3c77a]/15 !text-[#ffdd9c]"
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
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* The octagram — centerpiece diagram                                  */
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
      className="w-full max-w-[600px]"
      role="img"
      aria-label={`Destiny matrix octagram: day ${p.apoint}, month ${p.bpoint}, year ${p.cpoint}, base ${p.dpoint}, center ${p.epoint}`}
    >
      <defs>
        <radialGradient id="ldm-core-glow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.22" />
          <stop offset="55%" stopColor={VIOLET} stopOpacity="0.08" />
          <stop offset="100%" stopColor={BG} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ldm-center-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={CREAM} stopOpacity="0.5" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={C} cy={C} r={310} fill="url(#ldm-core-glow)" />

      {/* age ring */}
      <circle className="ldm-draw" cx={C} cy={C} r={248} fill="none" stroke={GOLD_DEEP} strokeOpacity="0.55" strokeWidth="0.8" />
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
          className="ldm-draw-fast"
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
      <line className="ldm-draw-fast" style={{ animationDelay: "0.9s" }} x1={jPos.x} y1={jPos.y} x2={nPos.x} y2={nPos.y} stroke={CREAM} strokeOpacity="0.35" strokeWidth="0.7" strokeDasharray="3 3" />

      {/* the two squares of the octagram */}
      <polygon className="ldm-draw" style={{ animationDelay: "0.4s" }} points={diamondPts} fill="none" stroke={GOLD} strokeOpacity="0.85" strokeWidth="1.2" />
      <polygon className="ldm-draw" style={{ animationDelay: "0.8s" }} points={axisPts} fill="none" stroke={VIOLET_SOFT} strokeOpacity="0.8" strokeWidth="1.2" />

      {/* age labels on the outer ring */}
      {outer.map((n, i) => {
        const lp = onCircle(C, C, 268, n.deg);
        return (
          <text
            key={`age-${n.tag}`}
            className="ldm-rise"
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
        <g key={`inner-${n.tag}`} className="ldm-rise" style={{ animationDelay: `${1.5 + i * 0.07}s` }}>
          <circle cx={n.pos.x} cy={n.pos.y} r={13} fill="rgba(12,10,22,0.95)" stroke={VIOLET_SOFT} strokeOpacity="0.75" strokeWidth="0.9" />
          <text x={n.pos.x} y={n.pos.y + 3.5} textAnchor="middle" fontSize="10.5" fill={VIOLET_SOFT} fontFamily="ui-monospace, monospace">
            {n.value}
          </text>
        </g>
      ))}

      {/* outer nodes — the eight stations */}
      {outer.map((n, i) => (
        <g key={`outer-${n.tag}`} className="ldm-rise" style={{ animationDelay: `${1.1 + i * 0.07}s` }}>
          <circle cx={n.pos.x} cy={n.pos.y} r={21} fill="rgba(12,10,22,0.95)" stroke={GOLD} strokeOpacity="0.9" strokeWidth="1.1" />
          <circle cx={n.pos.x} cy={n.pos.y} r={16.5} fill="none" stroke={i % 2 === 0 ? GOLD : VIOLET_SOFT} strokeOpacity="0.35" strokeWidth="0.6" />
          <text x={n.pos.x} y={n.pos.y + 5} textAnchor="middle" fontSize="14" fill={CREAM} fontFamily="ui-monospace, monospace">
            {n.value}
          </text>
        </g>
      ))}

      {/* center — the largest node, glowing */}
      <g className="ldm-rise" style={{ animationDelay: "1.9s" }}>
        <circle className="ldm-halo" cx={C} cy={C} r={58} fill="url(#ldm-center-glow)" />
        <circle cx={C} cy={C} r={36} fill={BG} stroke={GOLD} strokeWidth="1.3" />
        <circle cx={C} cy={C} r={29} fill="none" stroke={VIOLET_SOFT} strokeOpacity="0.5" strokeWidth="0.7" />
        <text x={C} y={C + 9} textAnchor="middle" fontSize="26" fill={GOLD} fontFamily="ui-monospace, monospace" letterSpacing="1">
          {p.epoint}
        </text>
      </g>
      <text className="ldm-rise" style={{ animationDelay: "2.1s" }} x={C} y={C + 58} textAnchor="middle" fontSize="6.5" letterSpacing="2.5" fill={VIOLET_SOFT} fontFamily="ui-monospace, monospace">
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
/* The tool — calculator + full result                                 */
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
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-0">
        {/* left: title + entry plate */}
        <div className="relative z-10 lg:pr-16">
          <p className="ldm-chip -rotate-[0.5deg]">The 22 arcana · one date · free</p>
          <h1 className="ldm-serif mt-5 max-w-xl text-[clamp(30px,4.4vw,48px)] leading-[1.08] tracking-tight text-[#e9e6f2]">
            Your whole life, folded into <span className="text-[#f3c77a]">one eight-pointed star.</span>
          </h1>
          <p className="mt-4 max-w-lg text-[14px] leading-relaxed text-[#b7b1cc]">
            The Destiny Matrix maps day, month and year onto twenty-two positions of the octagram —
            character, talents, money, purpose. Three numbers open the chart.
          </p>

          <form onSubmit={compute} className="ldm-panel relative mt-8 max-w-xl -rotate-[0.5deg] px-6 py-6 md:-ml-3 md:px-8">
            <span className="ldm-chip absolute -top-3 left-6 rotate-[0.5deg] !text-[9px]">Machina Matricis</span>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
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
                  <span className="block border border-[#f3c77a]/30 bg-[#0a0912]/70 transition-colors focus-within:border-[#f3c77a]/60">
                    <input
                      value={f.value}
                      onChange={(ev) => f.set(ev.target.value.replace(/[^\d]/g, "").slice(0, f.max))}
                      placeholder={f.ph}
                      inputMode="numeric"
                      autoComplete="off"
                      aria-label={f.label}
                      className="ldm-input w-full px-3 py-2.5 text-center font-mono text-xl tracking-[0.15em] text-[#e9e6f2] placeholder:text-[#e9e6f2]/15 sm:text-2xl"
                    />
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <p className="font-mono text-[8px] leading-relaxed tracking-[0.22em] text-[#b7b1cc]/50">
                DD·MM·YYYY → OCTAGRAMMA
                <br />
                FOLD ALL SUMS TO 1–22
              </p>
              <button
                type="submit"
                className="rotate-[0.4deg] border border-[#f3c77a] bg-[#f3c77a] px-6 py-2.5 text-[13px] font-medium text-[#0a0912] transition-transform hover:-translate-y-0.5"
              >
                ✦ Compute my matrix
              </button>
            </div>

            {error ? (
              <p className="mt-4 border border-[#e39a4c]/50 bg-[#e39a4c]/10 px-3 py-2 font-mono text-[9px] tracking-[0.18em] text-[#ffdd9c]">
                {error}
              </p>
            ) : null}
          </form>

          {/* micro readout strip under the form */}
          <div className="mt-6 flex max-w-xl flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[8px] tracking-[0.22em] text-[#b7b1cc]/45">
            <span>POSITIONES · 22</span>
            <span className="text-[#b794f6]">◆ OCTAGRAM · CHAKRAS · PURPOSES</span>
            <span>INSTANT · NO SIGN-UP</span>
          </div>
        </div>

        {/* right: placeholder plate before the first compute */}
        <div className="relative z-20 lg:-ml-10 lg:mt-6">
          {!result ? (
            <div aria-hidden className="ldm-panel relative hidden select-none rotate-[1deg] px-6 py-6 lg:block lg:opacity-60">
              <span className="ldm-chip absolute -top-3 right-6 -rotate-[0.6deg] !text-[9px]">Tabula Vacua</span>
              <div className="flex min-h-[380px] flex-col items-center justify-center gap-3 text-center">
                <span className="ldm-glyph text-[26px] text-[#f3c77a]/40">✶</span>
                <p className="max-w-[240px] font-mono text-[8px] leading-relaxed tracking-[0.24em] text-[#b7b1cc]/45">
                  HIC OCTAGRAMMA APPAREBIT — the eight-pointed star rises below once the date is entered.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* ==================== RESULT ==================== */}
      {result ? (
        <div ref={resultRef} key={stamp} className="relative z-10 mt-14">
          {/* header line */}
          <div className="ldm-rise flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-[#f3c77a]/20 py-3 font-mono text-[10px] tracking-[0.2em] text-[#b7b1cc]">
            <span className="text-[#f3c77a]">TABVLA ILLVMINATA</span>
            <span aria-hidden className="text-[#f3c77a]/40">/</span>
            <span>
              Day <span className="text-[#e9e6f2]">{result.points.apoint}</span> · Month{" "}
              <span className="text-[#e9e6f2]">{result.points.bpoint}</span> · Year{" "}
              <span className="text-[#e9e6f2]">{result.points.cpoint}</span> · Base{" "}
              <span className="text-[#e9e6f2]">{result.points.dpoint}</span> · Center{" "}
              <span className="text-[#ffdd9c]">{result.points.epoint}</span>
            </span>
            <span className="ml-auto hidden text-[#b794f6] sm:inline">SCALA 1 : 22</span>
          </div>

          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,600px)_minmax(0,1fr)]">
            {/* the octagram */}
            <figure className="ldm-panel ldm-rise relative -rotate-[0.4deg] px-4 py-6 !border-[#f3c77a]/30 shadow-[0_0_70px_rgba(243,199,122,0.09)] md:px-6" style={{ animationDelay: "0.1s" }}>
              <span className="ldm-chip absolute -top-3 left-6 rotate-[0.5deg]">Octagramma</span>
              <span className="ldm-chip absolute -bottom-3 right-8 -rotate-[0.5deg] !border-[#b794f6]/50 !text-[#b794f6] !text-[9px]">
                0 – 70 anni
              </span>
              <div className="flex justify-center">
                <OctagramDiagram m={result} />
              </div>
              <figcaption className="mt-2 flex items-center justify-between font-mono text-[7px] tracking-[0.24em] text-[#b7b1cc]/45">
                <span>A·B·C·D CARDINALES — F·G·H·I AXES</span>
                <span className="text-[#b794f6]/70">J·K·L·M·N LINEA FORTVNAE</span>
              </figcaption>
            </figure>

            {/* purpose & destiny lines */}
            <div className="relative lg:-ml-6 lg:mt-10">
              <div className="ldm-rise grid gap-3 sm:grid-cols-2" style={{ animationDelay: "0.25s" }}>
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
                      tilt: "-rotate-[0.5deg]",
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
                      tilt: "rotate-[0.5deg] sm:translate-y-2",
                    },
                    {
                      chip: "Spiritual harmony",
                      lat: "PROPOSITVM GENERALE",
                      z: result.purposes.generalpurpose,
                      zl: "General",
                      copy: "Personal and social purposes summed — the note the whole instrument is tuned to.",
                      tilt: "rotate-[0.4deg] sm:-translate-y-1",
                    },
                    {
                      chip: "Planetary",
                      lat: "PROPOSITVM PLANETARIVM",
                      z: result.purposes.planetarypurpose,
                      zl: "Planetary",
                      copy: "The widest ring — what this chart is asked to contribute beyond itself.",
                      tilt: "-rotate-[0.4deg] sm:translate-y-1",
                    },
                  ] as const
                ).map((pl) => (
                  <article key={pl.lat} className={`ldm-panel relative px-4 py-4 ${pl.tilt}`}>
                    <span className="ldm-chip absolute -top-3 left-4 !text-[8px]">{pl.chip}</span>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <MiniTri
                        x={"x" in pl ? pl.x : undefined}
                        y={"y" in pl ? pl.y : undefined}
                        z={pl.z}
                        mono={"x" in pl ? `${pl.xl} + ${pl.yl} → ${pl.zl}` : `Σ → ${pl.zl}`}
                      />
                      <div className="text-right">
                        <div className="ldm-serif text-4xl leading-none text-[#f3c77a]">{pl.z}</div>
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

          {/* health map — chakra readout table */}
          <section className="ldm-rise relative mt-10" style={{ animationDelay: "0.4s" }}>
            <div className="ldm-panel relative rotate-[0.3deg] px-5 py-6 md:px-8">
              <span className="ldm-chip absolute -top-3 left-6 -rotate-[0.4deg]">Chart of the heart · health map</span>
              <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="ldm-serif text-[clamp(18px,2.4vw,26px)] text-[#e9e6f2]">Seven stations through the center</h2>
                <span className="font-mono text-[8px] tracking-[0.26em] text-[#b7b1cc]/50">CORPVS · ENERGIA · AFFECTVS</span>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse font-mono">
                  <thead>
                    <tr className="border-b border-[#f3c77a]/25 text-left text-[8px] uppercase tracking-[0.26em] text-[#b7b1cc]/55">
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
                        <td className="py-2.5 pr-3 text-[#e9e6f2]">
                          <span className="mr-2 text-[9px] text-[#f3c77a]/70">{r.no}</span>
                          {r.name}
                        </td>
                        <td className="py-2.5 pr-3 text-[10px] tracking-[0.12em] text-[#b7b1cc]/70">{r.sanskrit}</td>
                        <td className="py-2.5 text-right text-[#f3c77a]">{r.body}</td>
                        <td className="py-2.5 text-right text-[#b794f6]">{r.energy}</td>
                        <td className="py-2.5 text-right text-[#ffdd9c]">{r.emotions}</td>
                      </tr>
                    ))}
                    {totals ? (
                      <tr className="text-[12px]">
                        <td className="py-2.5 pr-3 text-[9px] uppercase tracking-[0.24em] text-[#b7b1cc]/60" colSpan={2}>
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
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function DestinyMatrixPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#0a0912] font-sans text-[#e9e6f2] antialiased selection:bg-[#f3c77a]/25">
      <style>{LDM_STYLES}</style>
      <Backdrop />

      <div className="relative z-10">
        <Header />

        {/* ================= TOOL — top of the viewport ================= */}
        <section id="ldm-tool" className="relative overflow-visible">
          {/* slashed hairline crossing the tool stage */}
          <div
            className="pointer-events-none absolute left-[-4vw] top-[38%] h-px w-[108vw] -rotate-[0.9deg] bg-gradient-to-r from-transparent via-[#b794f6]/25 to-transparent"
            aria-hidden
          />
          {/* small wheel hanging off the left margin behind the form */}
          <div className="ldm-wheel-spin-slow pointer-events-none absolute -left-40 top-10 hidden h-[380px] w-[380px] opacity-[0.1] xl:block" aria-hidden>
            <OctagramWheelSvg />
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

          <div className="mx-auto max-w-6xl px-5 pb-16 pt-10 md:px-8 md:pb-20 md:pt-12">
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
            <div className="ldm-panel relative z-10 max-w-3xl -rotate-[0.5deg] px-6 py-7 md:px-8">
              <span className="ldm-chip absolute -top-3 left-6 !text-[9px]">Quid est</span>
              <h2 className="ldm-serif text-[clamp(20px,2.6vw,28px)] text-[#e9e6f2]">
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
            <h2 className="ldm-serif rotate-[0.3deg] text-[clamp(22px,3vw,32px)] text-[#e9e6f2] md:translate-x-[14%]">
              Questions from the margins
            </h2>
            <div className="relative mx-auto mt-9 max-w-2xl md:ml-[10%]">
              {FAQ.map((f, i) => (
                <details
                  key={f.q}
                  className={`ldm-panel group relative z-10 mb-3 px-6 py-5 open:border-[#f3c77a]/40 ${
                    i % 2 === 0 ? "-rotate-[0.4deg] md:-ml-10 md:mr-6" : "rotate-[0.4deg] md:ml-10 md:-mr-4"
                  }`}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14.5px] text-[#e9e6f2] marker:hidden [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="ldm-glyph shrink-0 text-[13px] text-[#f3c77a] transition-transform group-open:rotate-45">
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
              <span className="ldm-glyph grid h-6 w-6 place-items-center border border-[#f3c77a]/40 bg-[#f3c77a]/[0.07] text-[11px] text-[#f3c77a]">
                ☾{FE}
              </span>
              <span className="ldm-serif text-[14px] text-[#e9e6f2]">Astro Scope</span>
              <span className="font-mono text-[7px] tracking-[0.26em] text-[#b7b1cc]/45">DESTINY MATRIX</span>
            </div>
            <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1 font-mono text-[8px] uppercase tracking-[0.2em] text-[#b7b1cc]/60">
              <Link href="/tarot" className="transition-colors hover:text-[#f3c77a]">Tarot</Link>
              <Link href="/tarot/birth-arcana" className="transition-colors hover:text-[#f3c77a]">Birth Arcana</Link>
              <Link href="/tarot/cards" className="transition-colors hover:text-[#f3c77a]">Cards</Link>
              <Link href="#ldm-tool" className="transition-colors hover:text-[#f3c77a]">Compute ↑</Link>
            </nav>
            <p className="font-mono text-[8px] tracking-[0.22em] text-[#b7b1cc]/40">© MMXXVI · AS ABOVE · SO BELOW</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
