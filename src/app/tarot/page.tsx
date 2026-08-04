"use client";

// TAROT HUB — the /tarot index rebuilt in the AURUM gold-on-black engine
// language. Broken layout: full-bleed bands, an apparatus bleeding off the
// right viewport edge, staggered + rotated spread plates, labels straddling
// borders. Magic background: a giant 22-arcana wheel off-screen, dashed arcs,
// hairline construction lines, star specks, soot and grain. Density: tick
// scales, micro-readouts, engraved headers, tracked caps.
// Self-contained: inline SVG + Tailwind + one scoped <style> block (ltr-).
// Client component: quick-pull card draw + birth-arcana arithmetic run on
// built-in sample data only. Motion is CSS-only, slow, reduced-motion guarded.

import { useState } from "react";
import type { CSSProperties } from "react";

const DEG = Math.PI / 180;

// gold-on-black engine palette (from lab/aurum)
const GOLD = "#d4a82c";
const GOLD_HI = "#f0cf6b";
const GOLD_DIM = "#8a6d1f";
const GOLD_FAINT = "#54430f";
const IVORY = "#e9dfc8";
const EMBER = "#c9713f";
const INK = "#0a0705";

const GLYPH_FE0E = "︎"; // literal U+FE0E, forces text-style glyph rendering

/* ============================ GEOMETRY HELPERS ============================ */

function polar(cx: number, cy: number, r: number, deg: number) {
  const t = deg * DEG;
  return { x: +(cx + r * Math.cos(t)).toFixed(1), y: +(cy + r * Math.sin(t)).toFixed(1) };
}

// tick marks around a circle: n radial lines from rIn to rOut around (cx, cy)
function ringTicks(cx: number, cy: number, rIn: number, rOut: number, n: number, offset = 0) {
  return Array.from({ length: n }, (_, k) => {
    const a = polar(cx, cy, rIn, offset + (360 / n) * k);
    const b = polar(cx, cy, rOut, offset + (360 / n) * k);
    return { ...a, x2: b.x, y2: b.y, major: n >= 12 ? k % (n / 12) === 0 : true };
  });
}

// crescent moon: outer arc one way, smaller arc back
function crescentPath(cx: number, cy: number, r: number) {
  return `M ${cx} ${cy - r} A ${r} ${r} 0 1 0 ${cx} ${cy + r} A ${(r * 0.72).toFixed(1)} ${(r * 0.72).toFixed(1)} 0 1 1 ${cx} ${cy - r} Z`;
}

// 8-point compass star as one path
function compassPath(cx: number, cy: number, rLong: number, rShort: number) {
  let d = "";
  for (let k = 0; k < 16; k++) {
    const r = k % 2 === 0 ? rLong : rShort;
    const p = polar(cx, cy, r, -90 + k * 22.5);
    d += `${k === 0 ? "M" : "L"} ${p.x} ${p.y} `;
  }
  return d + "Z";
}

// n-point star polygon (alternating radii), closed path
function starPath(cx: number, cy: number, n: number, rOut: number, rIn: number, offset = -90) {
  let d = "";
  for (let k = 0; k < n * 2; k++) {
    const r = k % 2 === 0 ? rOut : rIn;
    const p = polar(cx, cy, r, offset + (180 / n) * k);
    d += `${k === 0 ? "M" : "L"} ${p.x} ${p.y} `;
  }
  return d + "Z";
}

// regular polygon path
function polyPath(cx: number, cy: number, r: number, sides: number, offset = -90) {
  let d = "";
  for (let k = 0; k < sides; k++) {
    const p = polar(cx, cy, r, offset + (360 / sides) * k);
    d += `${k === 0 ? "M" : "L"} ${p.x} ${p.y} `;
  }
  return d + "Z";
}

// deterministic pseudo-random for starfields (stable across renders)
function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/* ================================= DATA =================================== */

const ROMAN = [
  "0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
  "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI",
];

const MAJORS: { name: string; keys: string }[] = [
  { name: "The Fool", keys: "BEGINNINGS · LEAP · FAITH" },
  { name: "The Magician", keys: "WILL · CRAFT · MANIFESTATION" },
  { name: "The High Priestess", keys: "INTUITION · VEIL · MYSTERY" },
  { name: "The Empress", keys: "ABUNDANCE · NATURE · CARE" },
  { name: "The Emperor", keys: "ORDER · STRUCTURE · RULE" },
  { name: "The Hierophant", keys: "TRADITION · DOCTRINE · TEACHING" },
  { name: "The Lovers", keys: "UNION · CHOICE · HARMONY" },
  { name: "The Chariot", keys: "DRIVE · VICTORY · CONTROL" },
  { name: "Strength", keys: "COURAGE · PATIENCE · FORCE" },
  { name: "The Hermit", keys: "SOLITUDE · LANTERN · SEARCH" },
  { name: "Wheel of Fortune", keys: "CYCLES · TURNING · FATE" },
  { name: "Justice", keys: "TRUTH · BALANCE · LAW" },
  { name: "The Hanged Man", keys: "PAUSE · SURRENDER · SIGHT" },
  { name: "Death", keys: "ENDINGS · CHANGE · RENEWAL" },
  { name: "Temperance", keys: "MEASURE · ALCHEMY · FLOW" },
  { name: "The Devil", keys: "SHADOW · BONDS · DESIRE" },
  { name: "The Tower", keys: "RUPTURE · TRUTH · RELEASE" },
  { name: "The Star", keys: "HOPE · RENEWAL · GUIDANCE" },
  { name: "The Moon", keys: "DREAMS · INSTINCT · TIDES" },
  { name: "The Sun", keys: "VITALITY · CLARITY · JOY" },
  { name: "Judgement", keys: "CALLING · AWAKENING · VERDICT" },
  { name: "The World", keys: "COMPLETION · DANCE · WHOLENESS" },
];

const SUITS = [
  { name: "Wands", el: "FIRE", sigil: "wands" },
  { name: "Cups", el: "WATER", sigil: "cups" },
  { name: "Swords", el: "AIR", sigil: "swords" },
  { name: "Pentacles", el: "EARTH", sigil: "pentacles" },
];

type SpreadKind = "one" | "one-yn" | "three-row" | "triad" | "cross";

const SPREADS: {
  plate: string;
  name: string;
  href: string;
  cards: string;
  time: string;
  copy: string;
  kind: SpreadKind;
  tag: string;
  sealed?: boolean;
}[] = [
  {
    plate: "PLATE 01",
    name: "Daily Card",
    href: "/tarot/spreads/daily-card",
    cards: "1 CARD",
    time: "30 SECONDS",
    copy: "One card, one day. A single door opened each morning — a theme to carry until dusk.",
    kind: "one",
    tag: "OPEN",
  },
  {
    plate: "PLATE 02",
    name: "Yes / No",
    href: "/tarot/spreads/yes-no",
    cards: "1 CARD",
    time: "ONE BREATH",
    copy: "Ask a closed question; one card answers. Upright leans yes, reversed leans no — the shade is yours to read.",
    kind: "one-yn",
    tag: "OPEN",
  },
  {
    plate: "PLATE 03",
    name: "Past · Present · Future",
    href: "/tarot/spreads/past-present-future",
    cards: "3 CARDS",
    time: "3 MINUTES",
    copy: "The classic triad: what was, what is, what comes. Three doors in a row, walked left to right.",
    kind: "three-row",
    tag: "OPEN",
  },
  {
    plate: "PLATE 04",
    name: "Love Three-Card",
    href: "/tarot/spreads/love-three-card",
    cards: "3 CARDS",
    time: "3 MINUTES",
    copy: "You, the other, and the space between. A triad tuned to the heart’s geometry.",
    kind: "triad",
    tag: "OPEN",
  },
  {
    plate: "PLATE 05",
    name: "Celtic Cross",
    href: "#",
    cards: "10 CARDS",
    time: "ONE SITTING",
    copy: "The grand folio. Ten positions — one cross and a staff — the deepest reading in the archive. Sealed for now.",
    kind: "cross",
    tag: "SEALED",
    sealed: true,
  },
];

const STEPS = [
  {
    n: "I",
    t: "Formulate the question",
    c: "One question, one breath. Vague questions get vague doors — sharpen it before you touch the deck.",
    micro: "INPUT · CLOSED OR OPEN",
  },
  {
    n: "II",
    t: "Shuffle & cut",
    c: "Seven riffles while holding the question in mind, then cut left. Entropy does the rest.",
    micro: "ENTROPY · 7 RIFFLES",
  },
  {
    n: "III",
    t: "Draw the spread",
    c: "Cards fall into fixed positions — past, present, obstacle, outcome. The geometry is the grammar.",
    micro: "GEOMETRY · POSITIONS FIXED",
  },
  {
    n: "IV",
    t: "Read & reflect",
    c: "Each position read in plain language, card by card, then as one sentence. Journal what lands.",
    micro: "OUTPUT · PLAIN LANGUAGE",
  },
];

const ARCHIVE = [
  {
    q: "What is a daily card?",
    a: "One card drawn each morning as the day’s theme. You read it once, carry it with you, and check at dusk how it played out — the oldest journaling habit in tarot.",
  },
  {
    q: "How does a yes/no reading work?",
    a: "Ask a question that can honestly be answered yes or no. A single card is drawn; its nature and orientation tilt the answer — upright leans yes, reversed leans no, and the card’s own meaning shades the why.",
  },
  {
    q: "What are birth arcanas?",
    a: "Your birth date reduces by digit-sum to one of the 22 Major Arcana — a lifelong significator rather than a daily pull. Same arithmetic the numerologists use, mapped onto the deck.",
  },
];

const TELEMETRY = [
  { label: "DECK", value: "78 CARDS", icon: 0 },
  { label: "MAJOR ARCANA", value: "XXII", icon: 2 },
  { label: "MINOR ARCANA", value: "LVI", icon: 4 },
  { label: "SUITS", value: "IV · W C S P", icon: 5 },
  { label: "LAST PULL", value: "XVII — THE STAR", icon: 3 },
  { label: "SHUFFLE ENTROPY", value: "99.7%", icon: 1 },
];

const FAN = [
  { roman: "0", name: "The Fool" },
  { roman: "I", name: "The Magician" },
  { roman: "II", name: "The High Priestess" },
  { roman: "XVII", name: "The Star" },
  { roman: "XVIII", name: "The Moon" },
  { roman: "XIX", name: "The Sun" },
  { roman: "XXI", name: "The World" },
];

/* ============================ PRECOMPUTED SVG ============================= */

const rnd = lcg(20260804);
const HERO_STARS = Array.from({ length: 140 }, () => ({
  x: +(rnd() * 1600).toFixed(0),
  y: +(rnd() * 900).toFixed(0),
  r: +(0.4 + rnd() * 0.9).toFixed(2),
  o: +(0.1 + rnd() * 0.38).toFixed(2),
  g: Math.floor(rnd() * 3),
}));
const ENGINE_STARS = Array.from({ length: 56 }, () => ({
  x: +(rnd() * 420).toFixed(0),
  y: +(rnd() * 420).toFixed(0),
  r: +(0.4 + rnd() * 0.8).toFixed(2),
  o: +(0.1 + rnd() * 0.35).toFixed(2),
  g: Math.floor(rnd() * 3),
}));
// faint specks scattered down the whole page (behind everything)
const PAGE_STARS = Array.from({ length: 230 }, () => ({
  x: +(rnd() * 1600).toFixed(0),
  y: +(rnd() * 4200).toFixed(0),
  r: +(0.4 + rnd() * 0.9).toFixed(2),
  o: +(0.06 + rnd() * 0.22).toFixed(2),
  g: Math.floor(rnd() * 3),
}));

/* ============================== SMALL PIECES ============================== */

// tiny gold diagram icon, six deterministic variants
function MiniSigil({ i, size = 18 }: { i: number; size?: number }) {
  const c = size / 2;
  const variant = i % 6;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} fill="none" stroke={GOLD} strokeWidth="0.9" aria-hidden>
      <circle cx={c} cy={c} r={c - 1} opacity="0.55" />
      {variant === 0 && <path d={polyPath(c, c + 0.5, c - 4.5, 3)} />}
      {variant === 1 && (
        <path d={`M ${c} 2.5 V ${size - 2.5} M 3.5 ${c} H ${size - 3.5} M ${c} ${c} m -2.4 0 a 2.4 2.4 0 1 0 4.8 0 a 2.4 2.4 0 1 0 -4.8 0`} />
      )}
      {variant === 2 && <path d={starPath(c, c, 4, c - 3.5, 2.2)} />}
      {variant === 3 && <path d={crescentPath(c - 1, c, c - 4.6)} />}
      {variant === 4 && <path d={`${polyPath(c, c, c - 4, 4)} M ${c} 3 V ${size - 3}`} />}
      {variant === 5 && <path d={`${polyPath(c, c - 1, c - 4.6, 3, 90)} M 3.5 ${size - 4.5} H ${size - 3.5}`} />}
    </svg>
  );
}

// suit sigils: wands = up-triangle, cups = crescent, swords = crossed blades,
// pentacles = pentagon — each inside a hairline ring
function SuitSigil({ kind, size = 18 }: { kind: string; size?: number }) {
  const c = size / 2;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} fill="none" stroke={GOLD} strokeWidth="0.9" aria-hidden>
      <circle cx={c} cy={c} r={c - 1} opacity="0.5" />
      {kind === "wands" && <path d={`${polyPath(c, c + 0.6, c - 4.6, 3)} M ${c} ${c + 1.5} V ${size - 3}`} />}
      {kind === "cups" && <path d={crescentPath(c - 1, c, c - 4.6)} />}
      {kind === "swords" && (
        <path d={`M 4 ${size - 4} L ${size - 4} 4 M 4 4 L ${size - 4} ${size - 4} M ${c} ${c} m -2 0 a 2 2 0 1 0 4 0 a 2 2 0 1 0 -4 0`} />
      )}
      {kind === "pentacles" && <path d={`${polyPath(c, c, c - 4.2, 5)} ${polyPath(c, c, 2, 5)}`} />}
    </svg>
  );
}

// engraved section header: index + title + hairline + right-side readout
function SectionHead({ index, title, right }: { index: string; title: string; right?: string }) {
  return (
    <header className="mb-6 flex items-center gap-3 sm:gap-4">
      <span className="ltr-mono border px-1.5 py-1 text-[8px] tracking-[0.2em]" style={{ borderColor: `${GOLD}40`, color: GOLD }}>
        {index}
      </span>
      <h2 className="ltr-mono text-[9.5px] tracking-[0.34em] uppercase" style={{ color: GOLD_HI }}>
        {title}
      </h2>
      <span className="ltr-panel-h-line" aria-hidden />
      {right && (
        <span className="ltr-mono hidden text-[7.5px] tracking-[0.18em] uppercase md:inline" style={{ color: GOLD_DIM }}>
          {right}
        </span>
      )}
    </header>
  );
}

// a single tarot card (face shown) — used in the fan and the quick pull
function TarotCard({ roman, name, sigil, compact = false }: { roman: string; name: string; sigil: number; compact?: boolean }) {
  return (
    <span className="ltr-card block">
      <span className="ltr-mono block text-[7px] tracking-[0.24em]" style={{ color: GOLD_DIM }}>
        {roman}
      </span>
      <span className="my-1 flex justify-center">
        <MiniSigil i={sigil} size={compact ? 20 : 30} />
      </span>
      <span className={`ltr-serif block text-center leading-tight ${compact ? "text-[9px]" : "text-[10.5px]"}`} style={{ color: GOLD_HI }}>
        {name}
      </span>
    </span>
  );
}

// mini spread-position diagram per spread kind (viewBox 120x84)
function SpreadGlyph({ kind }: { kind: SpreadKind }) {
  const card = (x: number, y: number, rot = 0, key = "") => (
    <rect
      key={key || `${x}-${y}-${rot}`}
      x={x}
      y={y}
      width="13"
      height="19"
      stroke={GOLD}
      strokeWidth="0.8"
      fill={INK}
      transform={rot ? `rotate(${rot} ${x + 6.5} ${y + 9.5})` : undefined}
    />
  );
  return (
    <svg viewBox="0 0 120 84" className="h-20 w-full" fill="none" aria-hidden>
      {kind === "one" && (
        <>
          <circle cx="60" cy="42" r="22" stroke={GOLD} strokeWidth="0.5" strokeDasharray="2 4" opacity="0.55" />
          {card(53.5, 32.5)}
        </>
      )}
      {kind === "one-yn" && (
        <>
          {card(53.5, 32.5)}
          <text x="34" y="45" fontSize="8" fill={GOLD_DIM} fontFamily="ui-monospace, Menlo, monospace">Y</text>
          <text x="82" y="45" fontSize="8" fill={EMBER} fontFamily="ui-monospace, Menlo, monospace">N</text>
          <path d="M 44 42 H 48 M 72 42 H 76" stroke={GOLD} strokeWidth="0.5" strokeDasharray="1 2" opacity="0.6" />
        </>
      )}
      {kind === "three-row" && (
        <>
          <path d="M 20 42 H 100" stroke={GOLD} strokeWidth="0.4" strokeDasharray="2 4" opacity="0.4" />
          {card(27, 32.5)}
          {card(53.5, 32.5)}
          {card(80, 32.5)}
        </>
      )}
      {kind === "triad" && (
        <>
          <path d="M 60 24 L 42 56 M 60 24 L 78 56 M 42 56 H 78" stroke={GOLD} strokeWidth="0.4" strokeDasharray="2 4" opacity="0.45" />
          {card(53.5, 14)}
          {card(33, 47)}
          {card(74, 47)}
        </>
      )}
      {kind === "cross" && (
        <>
          {card(40, 32.5)}
          {card(38.5, 31, 90)}
          {card(40, 12)}
          {card(40, 54)}
          {card(16, 32.5)}
          {card(64, 32.5)}
          {card(96, 8)}
          {card(96, 27)}
          {card(96, 46)}
          {card(96, 65)}
        </>
      )}
    </svg>
  );
}

// the golden tarot apparatus — a card-drawing engine (viewBox 420)
function Apparatus() {
  return (
    <svg viewBox="0 0 420 420" className="h-auto w-full" fill="none" aria-hidden>
      <defs>
        <radialGradient id="ltr-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={GOLD_HI} stopOpacity="0.5" />
          <stop offset="55%" stopColor={GOLD} stopOpacity="0.14" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* engine starfield */}
      {ENGINE_STARS.map((s, i) => (
        <circle key={i} className={`ltr-tw${s.g}`} cx={s.x} cy={s.y} r={s.r} fill={IVORY} opacity={s.o} />
      ))}

      {/* outer static rings + ticks */}
      <circle cx="210" cy="210" r="202" stroke={GOLD} strokeWidth="0.8" opacity="0.5" />
      <circle cx="210" cy="210" r="196" stroke={GOLD} strokeWidth="0.5" strokeDasharray="1 5" opacity="0.45" />
      {ringTicks(210, 210, 186, 195, 96).map((t, i) => (
        <line key={`ot${i}`} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth={t.major ? 1 : 0.4} opacity={t.major ? 0.8 : 0.4} />
      ))}

      {/* roman numeral ring — 0–XXI around the deck */}
      {ROMAN.map((r, i) => {
        const p = polar(210, 210, 172, -90 + (360 / 22) * i);
        return (
          <text key={r} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="6.5" fill={GOLD_DIM} fontFamily="ui-monospace, Menlo, monospace" opacity="0.9">
            {r}
          </text>
        );
      })}
      <circle cx="210" cy="210" r="160" stroke={GOLD} strokeWidth="0.5" opacity="0.4" />

      {/* suit sigils at the four quarters */}
      {SUITS.map((s, i) => {
        const p = polar(210, 210, 148, -90 + i * 90);
        return (
          <g key={s.name} transform={`translate(${p.x - 9} ${p.y - 9})`} opacity="0.85">
            <SuitSigil kind={s.sigil} size={18} />
          </g>
        );
      })}

      {/* axis lines */}
      <path d="M 8 210 H 412 M 210 8 V 412" stroke={GOLD} strokeWidth="0.4" strokeDasharray="3 7" opacity="0.35" />

      {/* rotating group A — outer orbit ring with card-node rectangles */}
      <g className="ltr-spin-a">
        <circle cx="210" cy="210" r="132" stroke={GOLD} strokeWidth="0.7" strokeDasharray="10 4 2 4" opacity="0.6" />
        {[15, 105, 200, 288].map((a, i) => {
          const p = polar(210, 210, 132, a);
          return (
            <g key={`na${i}`}>
              <circle cx={p.x} cy={p.y} r={i % 2 ? 3.2 : 4.4} stroke={GOLD} strokeWidth="0.8" fill={INK} />
              <circle cx={p.x} cy={p.y} r={i % 2 ? 1.1 : 1.6} fill={GOLD_HI} stroke="none" />
            </g>
          );
        })}
        {[60, 150, 245, 335].map((a, i) => {
          const p = polar(210, 210, 132, a);
          return <rect key={`sa${i}`} x={p.x - 2.6} y={p.y - 4} width="5.2" height="8" stroke={GOLD} strokeWidth="0.7" transform={`rotate(${a + 90} ${p.x} ${p.y})`} opacity="0.85" />;
        })}
      </g>

      {/* rotating group B — counter ring of 22 arcana nodes + crescents */}
      <g className="ltr-spin-b">
        <circle cx="210" cy="210" r="108" stroke={GOLD} strokeWidth="0.6" opacity="0.55" />
        {ringTicks(210, 210, 103, 108, 44).map((t, i) => (
          <line key={`bt${i}`} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth="0.4" opacity="0.4" />
        ))}
        {Array.from({ length: 22 }, (_, k) => {
          const p = polar(210, 210, 108, -90 + (360 / 22) * k);
          return <circle key={`nb${k}`} cx={p.x} cy={p.y} r={k % 2 ? 1.4 : 2.2} fill={k % 2 ? GOLD : GOLD_HI} stroke="none" opacity="0.85" />;
        })}
        {[45, 165, 285].map((a, i) => {
          const p = polar(210, 210, 92, a);
          return <path key={`cb${i}`} d={crescentPath(p.x, p.y, 5.4)} stroke={GOLD} strokeWidth="0.9" fill="rgba(212,168,44,0.14)" transform={`rotate(${a + 90} ${p.x} ${p.y})`} />;
        })}
      </g>

      {/* static mid rings */}
      <circle cx="210" cy="210" r="88" stroke={GOLD} strokeWidth="0.8" opacity="0.6" />
      <circle cx="210" cy="210" r="82" stroke={GOLD} strokeWidth="0.4" strokeDasharray="1 4" opacity="0.5" />
      {ringTicks(210, 210, 76, 82, 60, 3).map((t, i) => (
        <line key={`mt${i}`} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth={t.major ? 0.9 : 0.35} opacity={t.major ? 0.7 : 0.35} />
      ))}

      {/* rotating group C — inner dashed ring with three nodes */}
      <g className="ltr-spin-c">
        <circle cx="210" cy="210" r="72" stroke={GOLD} strokeWidth="0.7" strokeDasharray="2 6" opacity="0.65" />
        {[30, 150, 270].map((a, i) => {
          const p = polar(210, 210, 72, a);
          return (
            <g key={`nc${i}`}>
              <circle cx={p.x} cy={p.y} r="3.6" stroke={GOLD} strokeWidth="0.8" fill={INK} />
              <circle cx={p.x} cy={p.y} r="1.1" fill={GOLD_HI} stroke="none" />
            </g>
          );
        })}
      </g>

      {/* glowing core: the card itself */}
      <circle cx="210" cy="210" r="70" fill="url(#ltr-core-glow)" stroke="none" className="ltr-pulse-slow" />
      <rect x="182" y="158" width="56" height="104" rx="3" stroke={GOLD} strokeWidth="1" fill={INK} opacity="0.95" />
      <rect x="187" y="163" width="46" height="94" rx="2" stroke={GOLD} strokeWidth="0.5" opacity="0.55" />
      <path d={starPath(210, 204, 8, 20, 7)} stroke={GOLD_HI} strokeWidth="0.8" opacity="0.95" />
      <circle cx="210" cy="204" r="3" fill={GOLD_HI} stroke="none" className="ltr-pulse" />
      <path d="M 210 178 V 184 M 210 224 V 230" stroke={GOLD} strokeWidth="0.6" opacity="0.6" />
      <text x="210" y="247" textAnchor="middle" fontSize="7" fill={GOLD} fontFamily="Georgia, serif" letterSpacing="2">
        0·XXI
      </text>
    </svg>
  );
}

/* ================================= PAGE =================================== */

export default function TarotPage() {
  // quick-pull state: a random Major, possibly reversed; count re-triggers the draw animation
  const [pull, setPull] = useState<{ idx: number; reversed: boolean; count: number } | null>(null);
  // birth-arcana arithmetic state
  const [birthInput, setBirthInput] = useState("");
  const [birthResult, setBirthResult] = useState<{ ok: boolean; idx: number } | null>(null);

  function drawCard() {
    setPull((p) => ({
      idx: Math.floor(Math.random() * MAJORS.length),
      reversed: Math.random() < 0.35,
      count: (p?.count ?? 0) + 1,
    }));
  }

  function computeBirthArcana() {
    const digits = birthInput.replace(/\D/g, "");
    if (digits.length !== 8) {
      setBirthResult({ ok: false, idx: -1 });
      return;
    }
    let s = digits.split("").reduce((acc, d) => acc + Number(d), 0);
    while (s > 22) s = String(s).split("").reduce((acc, d) => acc + Number(d), 0);
    // s is now 1–22; 22 folds back to 0 The Fool, otherwise index = number
    setBirthResult({ ok: true, idx: s === 22 ? 0 : s });
  }

  return (
    <main className="ltr-root relative min-h-screen overflow-x-clip" style={{ backgroundColor: INK, color: IVORY }}>
      <style>{LTR_CSS}</style>

      {/* page starfield + vignette */}
      <svg viewBox="0 0 1600 900" className="pointer-events-none absolute inset-x-0 top-0 h-[720px] w-full" preserveAspectRatio="xMidYMin slice" fill="none" aria-hidden>
        {HERO_STARS.map((s, i) => (
          <circle key={i} className={`ltr-tw${s.g}`} cx={s.x} cy={s.y} r={s.r} fill={IVORY} opacity={s.o} />
        ))}
      </svg>

      {/* deep background machinery: page specks, a giant 22-arcana wheel bleeding
          off the left edge, huge arcs lower-right, hairline construction lines */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <svg viewBox="0 0 1600 4200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMin slice" fill="none">
          {PAGE_STARS.map((s, i) => (
            <circle key={i} className={`ltr-tw${s.g}`} cx={s.x} cy={s.y} r={s.r} fill={IVORY} opacity={s.o} />
          ))}
        </svg>

        {/* giant arcana wheel, mostly off-screen left */}
        <svg viewBox="0 0 600 600" className="absolute top-[3vh] -left-[44vmin] h-[132vmin] w-[132vmin] opacity-[0.06]" fill="none">
          <circle cx="300" cy="300" r="294" stroke={GOLD} strokeWidth="0.8" />
          <circle cx="300" cy="300" r="284" stroke={GOLD} strokeWidth="0.5" strokeDasharray="1 6" />
          <g className="ltr-spin-b">
            {ringTicks(300, 300, 262, 280, 132).map((t, i) => (
              <line key={`wt${i}`} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth={t.major ? 1.1 : 0.4} />
            ))}
            {ROMAN.map((r, i) => {
              const p = polar(300, 300, 238, -90 + (360 / 22) * i);
              return (
                <text key={r} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="15" fill={GOLD} fontFamily="ui-monospace, Menlo, monospace">
                  {r}
                </text>
              );
            })}
            <circle cx="300" cy="300" r="206" stroke={GOLD} strokeWidth="0.6" strokeDasharray="12 5 2 5" />
            {[0, 60, 120, 180, 240, 300].map((a, i) => {
              const p = polar(300, 300, 206, a);
              return <circle key={`wn${i}`} cx={p.x} cy={p.y} r="4" stroke={GOLD} strokeWidth="0.8" fill={INK} />;
            })}
          </g>
          <circle cx="300" cy="300" r="160" stroke={GOLD} strokeWidth="0.5" />
          <path d="M 6 300 H 594 M 300 6 V 594" stroke={GOLD} strokeWidth="0.4" strokeDasharray="4 9" />
          <path d={starPath(300, 300, 8, 130, 46)} stroke={GOLD} strokeWidth="0.5" opacity="0.8" />
        </svg>

        {/* huge dashed arcs, mostly off-screen lower-right */}
        <svg viewBox="0 0 400 400" className="absolute top-[44%] -right-[30vmin] h-[88vmin] w-[88vmin] opacity-[0.05]" fill="none">
          <g className="ltr-spin-a">
            <circle cx="200" cy="200" r="192" stroke={GOLD} strokeWidth="0.7" strokeDasharray="2 9" />
            <circle cx="200" cy="200" r="150" stroke={GOLD} strokeWidth="0.6" strokeDasharray="14 6 2 6" />
            {[25, 115, 205, 295].map((a, i) => {
              const p = polar(200, 200, 150, a);
              return <rect key={`an${i}`} x={p.x - 3} y={p.y - 4.6} width="6" height="9.2" stroke={GOLD} strokeWidth="0.8" fill={INK} />;
            })}
          </g>
          <circle cx="200" cy="200" r="108" stroke={GOLD} strokeWidth="0.5" />
          {ringTicks(200, 200, 100, 108, 72).map((t, i) => (
            <line key={`at${i}`} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth="0.35" />
          ))}
          <path d={polyPath(200, 200, 84, 12)} stroke={GOLD} strokeWidth="0.5" />
        </svg>

        {/* a second faint arc field near the bottom-left */}
        <svg viewBox="0 0 400 400" className="absolute top-[80%] -left-[22vmin] h-[60vmin] w-[60vmin] opacity-[0.045]" fill="none">
          <circle cx="200" cy="200" r="190" stroke={GOLD} strokeWidth="0.6" />
          <circle cx="200" cy="200" r="182" stroke={GOLD} strokeWidth="0.5" strokeDasharray="1 7" />
          <path d={polyPath(200, 200, 160, 12)} stroke={GOLD} strokeWidth="0.5" strokeDasharray="3 6" />
          <path d={compassPath(200, 200, 150, 40)} stroke={GOLD} strokeWidth="0.5" />
        </svg>

        {/* hairline construction lines crossing whole sections */}
        <span className="ltr-line" style={{ top: "15%", transform: "rotate(2.8deg)" }}>
          <b>AXIS OF VEILS · 78 PLATES</b>
        </span>
        <span className="ltr-line" style={{ top: "41%" }}>
          <b>MERIDIAN OF THE FOOL · 0°00&prime;</b>
        </span>
        <span className="ltr-line" style={{ top: "69%", transform: "rotate(-2.2deg)" }}>
          <b>DECLINATION OF THE MOON +18°26&prime;</b>
        </span>
        <span className="ltr-line" style={{ top: "91%", transform: "rotate(1.1deg)" }}>
          <b>LIMEN · PATH XXII</b>
        </span>
      </div>

      <div className="ltr-vignette pointer-events-none absolute inset-0" aria-hidden />

      {/* restrained grunge layer: candlelight, soot, grain — fixed over the page */}
      <div className="pointer-events-none fixed inset-0 z-30" aria-hidden>
        <span className="ltr-candle absolute inset-0" />
        <span className="ltr-soot ltr-soot-a" />
        <span className="ltr-soot ltr-soot-b" />
        <span className="ltr-soot ltr-soot-c" />
        <span className="ltr-grain absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 pb-8 sm:px-6">
        {/* ============================ TOP BAR ============================ */}
        <header className="ltr-panel mt-4 flex items-center gap-4 px-3 py-2 sm:px-4">
          <a href="/tarot" className="flex items-center gap-2.5">
            <span className="ltr-inset flex h-7 w-7 items-center justify-center">
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden>
                <rect x="5" y="2.5" width="10" height="15" rx="1" stroke={GOLD_HI} strokeWidth="0.9" />
                <path d={starPath(10, 10, 4, 4, 1.6)} stroke={GOLD} strokeWidth="0.7" />
              </svg>
            </span>
            <span className="ltr-serif text-[15px] tracking-[0.3em]" style={{ color: GOLD_HI }}>
              TAROT
            </span>
          </a>
          <span className="ltr-mono hidden text-[7px] tracking-[0.22em] uppercase sm:inline" style={{ color: GOLD_FAINT }}>
            ARCANA DIVISION · BOOK OF DOORS
          </span>
          <nav className="ltr-mono ml-auto hidden items-center gap-5 text-[8.5px] tracking-[0.24em] uppercase md:flex">
            <a href="#spreads" className="ltr-navlink">Spreads</a>
            <a href="/tarot/cards" className="ltr-navlink">Cards</a>
            <a href="/tarot/birth-arcana" className="ltr-navlink">Birth Arcana</a>
          </nav>
          <a href="/tarot/spreads/daily-card" className="ltr-btn-ghost ltr-mono ml-auto px-3.5 py-1.5 text-[8.5px] tracking-[0.24em] uppercase md:ml-0">
            Pull a card
          </a>
          <span className="ltr-mono hidden text-[7px] tracking-[0.18em] lg:inline" style={{ color: GOLD_DIM }}>
            DECK 78 · ENGINE NOMINAL
          </span>
        </header>

        {/* ============================== HERO ==============================
            full-bleed: editorial column left, apparatus card bleeding off the
            right edge; the quick-pull panel overlaps the apparatus' foot */}
        <section className="relative left-1/2 mt-10 w-screen -translate-x-1/2 lg:mt-16 lg:min-h-[640px]">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            {/* left editorial column, with a vertical tick ruler */}
            <div className="relative max-w-xl pl-6 sm:pl-8">
              <span className="ltr-ruler" aria-hidden />
              <p className="ltr-mono text-[8.5px] tracking-[0.4em] uppercase" style={{ color: GOLD }}>
                Tarot Division · 78 Plates · Free Readings
              </p>
              <h1 className="ltr-serif ltr-glow mt-5 max-w-xl text-[40px] leading-[1.05] sm:text-[56px]" style={{ color: GOLD_HI }}>
                Seventy-eight doors. Ask, and one opens.
              </h1>
              <p className="mt-6 max-w-md text-[12.5px] leading-relaxed" style={{ color: `${IVORY}b8` }}>
                A full deck, hand-shuffled by entropy: daily cards, yes/no verdicts, three-card geometries and the
                sealed Celtic Cross. Every pull read in plain language — free, forever.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a href="/tarot/spreads/daily-card" className="ltr-btn ltr-mono px-7 py-3.5 text-[10px] tracking-[0.26em] uppercase">
                  Pull your daily card
                </a>
                <a href="/tarot/cards" className="ltr-btn-ghost ltr-mono px-6 py-3.5 text-[10px] tracking-[0.22em] uppercase">
                  Browse all 78 cards →
                </a>
              </div>
              {/* hero stat strip */}
              <dl className="ltr-mono mt-10 grid max-w-md grid-cols-3 border-t text-[7.5px] tracking-[0.16em] uppercase" style={{ borderColor: `${GOLD}2b` }}>
                {[
                  ["Deck", "78 cards"],
                  ["Spreads", "5 plates"],
                  ["Cost", "Free"],
                ].map(([k, v], i) => (
                  <div key={k} className={`py-3 ${i > 0 ? "border-l pl-3" : ""}`} style={{ borderColor: `${GOLD}2b` }}>
                    <dt style={{ color: GOLD_DIM }}>{k}</dt>
                    <dd className="mt-1 text-[12px] tabular-nums" style={{ color: GOLD_HI }}>
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* the apparatus card, bleeding off the right viewport edge */}
          <div className="relative mx-auto mt-12 max-w-[540px] px-4 sm:px-6 lg:absolute lg:top-1/2 lg:right-[-7vw] lg:mt-0 lg:w-[min(46vw,640px)] lg:max-w-none lg:-translate-y-1/2 lg:px-0">
            <div className="ltr-panel relative lg:rotate-[0.6deg]">
              <header className="ltr-panel-h">
                <span className="ltr-mono text-[7.5px] tracking-[0.2em]" style={{ color: GOLD_DIM }}>
                  FIG. 01 — DRAWING ENGINE
                </span>
                <span className="ltr-panel-h-line" aria-hidden />
                <span className="ltr-serif text-[10px] tracking-[0.36em]" style={{ color: GOLD_HI }}>
                  ✶ THE DECK ✶
                </span>
                <span className="ltr-panel-h-line" aria-hidden />
                <span className="ltr-mono text-[7.5px] tracking-[0.2em]" style={{ color: GOLD_DIM }}>
                  SHUFFLED
                </span>
              </header>
              <div className="relative p-2 sm:p-3">
                <Apparatus />
                {/* faint handling marks on the glass */}
                <span className="ltr-smudge ltr-smudge-a" aria-hidden />
                <span className="ltr-smudge ltr-smudge-b" aria-hidden />
              </div>
              <footer className="ltr-mono flex items-center justify-between border-t px-3 py-1.5 text-[7px] tracking-[0.16em] uppercase" style={{ borderColor: `${GOLD}22`, color: GOLD_DIM }}>
                <span>RIDER–WAITE ORDER</span>
                <span className="hidden sm:inline">22 MAJOR · 56 MINOR</span>
                <span>CUT: LEFT HAND</span>
              </footer>
            </div>
            {/* readout chips floating around the apparatus */}
            <span className="ltr-chip ltr-mono absolute -top-3 left-6 z-10 flex items-center gap-1.5 px-2 py-1 text-[8px] tracking-[0.14em] sm:left-10">
              <span style={{ color: IVORY }}>MAJOR</span>
              <span className="tabular-nums" style={{ color: GOLD_HI }}>XXII</span>
            </span>
            <span className="ltr-chip ltr-mono absolute top-1/3 left-2 z-10 flex items-center gap-1.5 px-2 py-1 text-[8px] tracking-[0.14em] sm:-left-5">
              <span style={{ color: IVORY }}>MINOR</span>
              <span className="tabular-nums" style={{ color: GOLD_HI }}>LVI</span>
            </span>
            <span className="ltr-chip ltr-mono absolute -bottom-3 left-[38%] z-10 flex items-center gap-1.5 px-2 py-1 text-[8px] tracking-[0.14em]">
              <span style={{ color: IVORY }}>SUITS</span>
              <span className="tabular-nums" style={{ color: GOLD_HI }}>IV</span>
            </span>
            <span className="ltr-chip ltr-mono absolute bottom-10 left-2 z-10 flex items-center gap-1.5 px-2 py-1 text-[8px] tracking-[0.14em] sm:-left-4">
              <span style={{ color: IVORY }}>PATHS</span>
              <span className="tabular-nums" style={{ color: EMBER }}>0–XXI</span>
            </span>

            {/* quick pull — interactive, overlapping the apparatus' lower-left */}
            <div className="ltr-panel relative z-20 mt-6 lg:absolute lg:-bottom-12 lg:-left-24 lg:mt-0 lg:w-[300px] lg:rotate-[-1.3deg]">
              <header className="ltr-panel-h">
                <span style={{ color: GOLD }}>TEST THE DECK</span>
                <span className="ltr-panel-h-line" aria-hidden />
                <span className="ltr-mono text-[7px] tracking-[0.2em]" style={{ color: GOLD_DIM }}>
                  MAJORS ONLY
                </span>
              </header>
              <div className="p-3.5">
                {pull ? (
                  <div key={pull.count} className="ltr-draw flex items-center gap-3">
                    <span className="ltr-inset flex h-[74px] w-[52px] shrink-0 items-center justify-center" style={pull.reversed ? { transform: "rotate(180deg)" } : undefined}>
                      <TarotCard roman={ROMAN[pull.idx]} name="" sigil={pull.idx} compact />
                    </span>
                    <span className="min-w-0">
                      <span className="ltr-serif block text-[13px]" style={{ color: GOLD_HI }}>
                        {ROMAN[pull.idx]} — {MAJORS[pull.idx].name}
                      </span>
                      <span className="ltr-mono mt-1 block text-[7px] tracking-[0.18em]" style={{ color: IVORY }}>
                        {MAJORS[pull.idx].keys}
                      </span>
                      <span className="ltr-mono mt-0.5 block text-[6.5px] tracking-[0.18em]" style={{ color: pull.reversed ? EMBER : GOLD_DIM }}>
                        {pull.reversed ? "REVERSED — LOOK INWARD" : "UPRIGHT — LOOK OUTWARD"}
                      </span>
                    </span>
                  </div>
                ) : (
                  <p className="text-[9.5px] leading-relaxed" style={{ color: `${IVORY}99` }}>
                    No stakes, no question. Pull one of the twenty-two Majors and see which door opens.
                  </p>
                )}
                <button type="button" onClick={drawCard} className="ltr-btn ltr-mono mt-3 w-full px-4 py-2.5 text-[8.5px] tracking-[0.26em] uppercase">
                  {pull ? "Shuffle & draw again" : "Draw one card"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ======================== DECK TELEMETRY STRIP ====================
            full-bleed instrument band, wider than the content column */}
        <section className="ltr-panel relative left-1/2 mt-14 w-screen -translate-x-1/2 lg:mt-28">
          <header className="ltr-panel-h">
            <span style={{ color: GOLD }}>DECK TELEMETRY — CURRENT STATE OF THE PACK</span>
            <span className="ltr-panel-h-line" aria-hidden />
            <span className="ltr-mono text-[7.5px] tracking-[0.2em]" style={{ color: GOLD_DIM }}>
              REFRESH PER PULL · RIDER–WAITE
            </span>
          </header>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
            {TELEMETRY.map((c) => (
              <div
                key={c.label}
                className="flex flex-col items-center gap-1.5 border-r border-b px-2 py-3"
                style={{ borderColor: `${GOLD}1f` }}
              >
                <MiniSigil i={c.icon} size={16} />
                <span className="ltr-mono text-[6.5px] tracking-[0.22em]" style={{ color: GOLD_DIM }}>
                  {c.label}
                </span>
                <span className="ltr-mono text-[9px] tracking-[0.1em] tabular-nums" style={{ color: GOLD_HI }}>
                  {c.value}
                </span>
              </div>
            ))}
          </div>
          {/* readout straddling the lower border of the band */}
          <span className="ltr-chip ltr-mono absolute -bottom-2.5 right-6 z-10 px-2 py-0.5 text-[7px] tracking-[0.2em] sm:right-14" style={{ color: GOLD_DIM }}>
            Δψ 0.078 · DECK NOMINAL
          </span>
        </section>

        {/* ========================== SPREADS INDEX =========================
            staggered plates: alternating offsets and slight rotations */}
        <section id="spreads" className="relative mt-14 scroll-mt-8 lg:mt-24 lg:-mx-10">
          <span className="ltr-serif pointer-events-none absolute -top-16 -right-4 hidden text-[200px] leading-none opacity-[0.05] select-none lg:block" style={{ color: GOLD }} aria-hidden>
            {"☽" + GLYPH_FE0E}
          </span>
          <SectionHead index="02" title="Spreads index — choose your geometry" right="4 PLATES OPEN · 1 SEALED" />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {SPREADS.map((s, i) => (
              <a
                key={s.name}
                href={s.href}
                className={`ltr-panel ltr-action group relative flex flex-col p-4 ${
                  i % 3 === 1 ? "lg:translate-y-6 lg:rotate-[0.4deg]" : i % 3 === 2 ? "lg:translate-y-2 lg:rotate-[-0.35deg]" : "lg:rotate-[0.2deg]"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="ltr-mono border px-1.5 py-0.5 text-[6.5px] tracking-[0.26em]" style={{ borderColor: `${GOLD}45`, color: GOLD }}>
                    {s.plate}
                  </span>
                  <span className="ltr-mono text-[6.5px] tracking-[0.2em]" style={{ color: GOLD_FAINT }}>
                    {s.cards} · {s.time}
                  </span>
                  <span
                    className="ltr-mono ml-auto border px-1.5 py-0.5 text-[6px] tracking-[0.22em]"
                    style={{ borderColor: s.sealed ? `${EMBER}55` : `${GOLD}35`, color: s.sealed ? EMBER : GOLD_DIM }}
                  >
                    {s.tag}
                  </span>
                </span>
                <span className="ltr-inset mt-4 block px-3 py-2">
                  <SpreadGlyph kind={s.kind} />
                </span>
                <span className="ltr-serif mt-4 text-[17px]" style={{ color: GOLD_HI }}>
                  {s.name}
                </span>
                <span className="mt-1.5 flex-1 text-[10px] leading-relaxed" style={{ color: `${IVORY}99` }}>
                  {s.copy}
                </span>
                <span className="ltr-mono mt-4 flex items-center gap-2 border-t pt-2.5 text-[8px] tracking-[0.28em] uppercase" style={{ borderColor: `${GOLD}1f`, color: GOLD }}>
                  {s.sealed ? "Sealed folio" : "Open plate"} <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  <span className="ltr-panel-h-line" aria-hidden />
                </span>
              </a>
            ))}
            {/* filler plate: the suits, keeping the grid broken not empty */}
            <div className="ltr-panel relative hidden flex-col p-4 lg:flex lg:translate-y-8 lg:rotate-[0.5deg]">
              <span className="ltr-mono text-[6.5px] tracking-[0.26em]" style={{ color: GOLD_FAINT }}>
                APPENDIX — THE FOUR SUITS
              </span>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {SUITS.map((s) => (
                  <span key={s.name} className="flex flex-col items-center gap-1.5 py-1">
                    <SuitSigil kind={s.sigil} size={22} />
                    <span className="ltr-serif text-[9px] tracking-[0.1em] uppercase" style={{ color: IVORY }}>
                      {s.name}
                    </span>
                    <span className="ltr-mono text-[6px] tracking-[0.2em]" style={{ color: GOLD_DIM }}>
                      {s.el}
                    </span>
                  </span>
                ))}
              </div>
              <p className="mt-4 text-[9px] leading-relaxed" style={{ color: `${IVORY}80` }}>
                Fifty-six Minor Arcana: Wands for fire and craft, Cups for water and feeling, Swords for air and
                thought, Pentacles for earth and matter.
              </p>
              <span className="ltr-mono mt-auto pt-4 text-[6.5px] tracking-[0.24em] uppercase" style={{ color: GOLD_FAINT }}>
                14 PLATES PER SUIT · ACE → KING
              </span>
            </div>
          </div>
          {/* vertical edge label crossing the band's right border */}
          <span className="ltr-mono absolute top-1/2 -right-2 hidden origin-right -translate-y-1/2 rotate-90 text-[6.5px] tracking-[0.4em] uppercase lg:block" style={{ color: GOLD_DIM }} aria-hidden>
            GEOMETRY IS GRAMMAR
          </span>
        </section>

        {/* ======================== BIRTH ARCANA BAND =======================
            shifted left, rotated, with a 22-path wheel and live arithmetic */}
        <section className="ltr-panel relative z-10 mt-16 lg:mt-24 lg:mr-16 lg:-ml-4 lg:rotate-[-0.45deg]">
          <header className="ltr-panel-h">
            <span style={{ color: GOLD }}>BIRTH ARCANA — YOUR LIFELONG SIGNIFICATOR</span>
            <span className="ltr-panel-h-line" aria-hidden />
            <span className="ltr-mono text-[7.5px] tracking-[0.2em]" style={{ color: GOLD_DIM }}>
              DIGIT-SUM · 22 PATHS
            </span>
          </header>
          {/* readout straddling the top border */}
          <span className="ltr-chip ltr-mono absolute -top-2.5 right-8 z-10 px-2 py-0.5 text-[7px] tracking-[0.2em]" style={{ color: GOLD_DIM }}>
            FIG. 02 · HAND-COMPUTED
          </span>
          <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:gap-10 sm:p-8">
            {/* 22-path wheel */}
            <svg viewBox="0 0 120 120" className="h-36 w-36 shrink-0 sm:h-44 sm:w-44" fill="none" stroke={GOLD} aria-hidden>
              <circle cx="60" cy="60" r="54" strokeWidth="0.6" opacity="0.5" />
              {ringTicks(60, 60, 49, 54, 44).map((t, i) => (
                <line key={i} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} strokeWidth={t.major ? 0.8 : 0.35} opacity="0.6" />
              ))}
              <g className="ltr-spin-c">
                {Array.from({ length: 22 }, (_, k) => {
                  const p = polar(60, 60, 44, -90 + (360 / 22) * k);
                  return <circle key={k} cx={p.x} cy={p.y} r={k % 2 ? 1 : 1.7} fill={k % 2 ? GOLD : GOLD_HI} stroke="none" opacity="0.85" />;
                })}
                <path d={polyPath(60, 60, 34, 11)} strokeWidth="0.5" opacity="0.5" />
              </g>
              <circle cx="60" cy="60" r="24" strokeWidth="0.8" />
              <path d={starPath(60, 60, 8, 19, 7)} strokeWidth="0.6" opacity="0.7" />
              <circle cx="60" cy="60" r="3" fill={GOLD_HI} stroke="none" className="ltr-pulse" />
            </svg>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <p className="ltr-mono text-[7.5px] tracking-[0.32em] uppercase" style={{ color: GOLD_DIM }}>
                Fig. 02 — Digit-sum of birth
              </p>
              <h3 className="ltr-serif mt-2 text-[22px] sm:text-[26px]" style={{ color: GOLD_HI }}>
                Birth Arcana
              </h3>
              <p className="mt-3 max-w-md text-[11px] leading-relaxed" style={{ color: `${IVORY}a8` }}>
                Add the digits of your birth date; if the sum runs past XXI, fold it again. What remains is one of the
                twenty-two Majors — the card you carry for life.
              </p>
              {/* live arithmetic */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="DD.MM.YYYY"
                  value={birthInput}
                  onChange={(e) => {
                    setBirthInput(e.target.value);
                    setBirthResult(null);
                  }}
                  className="ltr-input ltr-mono w-[140px] px-3 py-2 text-[10px] tracking-[0.2em]"
                  aria-label="Birth date, eight digits"
                />
                <button type="button" onClick={computeBirthArcana} className="ltr-btn-ghost ltr-mono px-4 py-2 text-[8.5px] tracking-[0.24em] uppercase">
                  Reduce
                </button>
              </div>
              {birthResult && (
                <p className="ltr-draw ltr-mono mt-3 text-[8.5px] tracking-[0.18em] uppercase" style={{ color: birthResult.ok ? GOLD_HI : EMBER }} aria-live="polite">
                  {birthResult.ok
                    ? `YOUR ARCANA: ${ROMAN[birthResult.idx]} — ${MAJORS[birthResult.idx].name}`
                    : "EIGHT DIGITS, PLEASE — DD.MM.YYYY"}
                </p>
              )}
              <a href="/tarot/birth-arcana" className="ltr-btn ltr-mono mt-5 inline-block px-5 py-2.5 text-[8.5px] tracking-[0.24em] uppercase">
                Open Birth Arcana →
              </a>
            </div>
          </div>
        </section>

        {/* ============================ CARDS TEASER ========================
            copy column left, a hand-fanned row of majors overlapping right */}
        <section className="relative mt-16 lg:mt-28 lg:ml-8">
          <span className="ltr-serif pointer-events-none absolute -top-10 -left-6 hidden text-[220px] leading-none opacity-[0.045] select-none lg:block" style={{ color: GOLD }} aria-hidden>
            {"☉" + GLYPH_FE0E}
          </span>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div>
              <SectionHead index="03" title="The cards — seventy-eight plates" right="MAJORS 0–XXI · FULL TEXTS" />
              <h3 className="ltr-serif ltr-glow max-w-md text-[24px] leading-snug sm:text-[30px]" style={{ color: GOLD_HI }}>
                Every card, face up. Meanings, reversals, and the small print of each plate.
              </h3>
              <p className="mt-4 max-w-md text-[11px] leading-relaxed" style={{ color: `${IVORY}a8` }}>
                From 0 The Fool to XXI The World, then through the four suits to every Page and King — each card with
                upright and reversed readings, keywords, and the imagery decoded.
              </p>
              <a href="/tarot/cards" className="ltr-btn-ghost ltr-mono mt-6 inline-block px-6 py-3 text-[9.5px] tracking-[0.26em] uppercase">
                Browse all 78 cards →
              </a>
            </div>
            {/* the fan: overlapping cards, each slightly rotated, hover lifts */}
            <div className="ltr-fan relative mx-auto h-[210px] w-full max-w-[520px] sm:h-[240px]" aria-hidden>
              {FAN.map((c, i) => {
                const rot = (i - 3) * 7;
                const left = 4 + i * 14.6;
                const top = 14 + Math.abs(i - 3) * 9;
                return (
                  <span
                    key={c.roman}
                    className="ltr-fan-card"
                    style={{ left: `${left}%`, top: `${top}px`, zIndex: i, "--fr": `${rot}deg` } as CSSProperties}
                  >
                    <TarotCard roman={c.roman} name={c.name} sigil={i} />
                  </span>
                );
              })}
              <span className="ltr-chip ltr-mono absolute -bottom-1 left-1/2 z-20 -translate-x-1/2 px-2 py-0.5 text-[7px] tracking-[0.22em]" style={{ color: GOLD_DIM }}>
                7 OF 22 MAJORS SHOWN
              </span>
            </div>
          </div>
        </section>

        {/* ====================== HOW A READING WORKS ====================== */}
        <section className="mt-16 lg:mt-28 lg:mr-10 lg:-ml-2">
          <SectionHead index="04" title="How a reading works — the operating sequence" right="FOUR STAGES · NO ACCOUNT" />
          <div className="relative">
            {/* engraved rail behind the medallions */}
            <span className="ltr-rail absolute top-[27px] right-4 left-4 hidden md:block" aria-hidden />
            <ol className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
              {STEPS.map((s, i) => (
                <li key={s.n} className={`relative flex flex-col items-center text-center ${i % 2 === 1 ? "md:translate-y-4" : ""}`}>
                  <span className="ltr-medallion relative z-10 flex h-14 w-14 items-center justify-center">
                    <svg viewBox="0 0 56 56" className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
                      <circle cx="28" cy="28" r="26" stroke={GOLD} strokeWidth="0.8" opacity="0.7" />
                      {ringTicks(28, 28, 22, 26, 24, i * 7).map((t, k) => (
                        <line key={k} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth="0.5" opacity="0.5" />
                      ))}
                      <circle cx="28" cy="28" r="18" stroke={GOLD} strokeWidth="0.5" strokeDasharray="1 3" opacity="0.6" />
                    </svg>
                    <span className="ltr-serif text-[15px]" style={{ color: GOLD_HI }}>
                      {s.n}
                    </span>
                  </span>
                  <h3 className="ltr-serif mt-4 text-[14.5px]" style={{ color: GOLD_HI }}>
                    {s.t}
                  </h3>
                  <p className="mt-1.5 max-w-[230px] text-[9.5px] leading-relaxed" style={{ color: `${IVORY}99` }}>
                    {s.c}
                  </p>
                  <p className="ltr-mono mt-2 text-[6.5px] tracking-[0.24em]" style={{ color: GOLD_DIM }}>
                    {s.micro}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ========================= FAQ — ARCHIVE ========================== */}
        <section className="relative mt-16 lg:mt-28 lg:ml-[6%]">
          <span className="ltr-serif pointer-events-none absolute -top-14 -right-8 hidden text-[190px] leading-none opacity-[0.045] select-none lg:block" style={{ color: GOLD }} aria-hidden>
            {"☽" + GLYPH_FE0E}
          </span>
          <SectionHead index="05" title="Archive entries — frequently asked" right="3 RECORDS · PUBLIC" />
          <div className="ltr-panel lg:rotate-[0.25deg]">
            <ul className="grid grid-cols-1 md:grid-cols-3">
              {ARCHIVE.map((e, i) => (
                <li
                  key={e.q}
                  className={`flex gap-4 p-5 ${i > 0 ? "border-t md:border-t-0 md:border-l" : ""}`}
                  style={{ borderColor: `${GOLD}1a` }}
                >
                  <span className="ltr-mono shrink-0 text-[8px] tracking-[0.14em]" style={{ color: GOLD_FAINT }}>
                    REC-{String(i + 1).padStart(3, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="ltr-serif block text-[13.5px]" style={{ color: GOLD_HI }}>
                      {e.q}
                    </span>
                    <span className="mt-1.5 block text-[9.5px] leading-relaxed" style={{ color: `${IVORY}99` }}>
                      {e.a}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ============================== CTA ==============================
            band spills wider than the content column; readout crosses border */}
        <section className="ltr-panel relative mt-16 px-4 py-12 text-center sm:py-16 lg:mt-28 lg:-mx-10">
          {/* vertical readout straddling the left border */}
          <span className="ltr-chip ltr-mono absolute top-1/2 -left-2.5 z-10 hidden origin-top-left -rotate-90 px-2 py-0.5 text-[7px] tracking-[0.24em] lg:block" style={{ color: GOLD_DIM }}>
            SEQ. 000 · FIRST INVOCATION
          </span>
          <svg viewBox="0 0 120 120" className="pointer-events-none absolute top-3 left-3 h-16 w-16 opacity-40" fill="none" stroke={GOLD} strokeWidth="0.8" aria-hidden>
            <path d="M 6 60 H 60 M 60 6 V 60" />
            <path d={compassPath(60, 60, 50, 12)} opacity="0.6" />
          </svg>
          <svg viewBox="0 0 120 120" className="pointer-events-none absolute right-3 bottom-3 h-16 w-16 rotate-180 opacity-40" fill="none" stroke={GOLD} strokeWidth="0.8" aria-hidden>
            <path d="M 6 60 H 60 M 60 6 V 60" />
            <path d={compassPath(60, 60, 50, 12)} opacity="0.6" />
          </svg>
          <p className="ltr-mono text-[8px] tracking-[0.42em] uppercase" style={{ color: GOLD_DIM }}>
            First Invocation · Seq. 000
          </p>
          <h2 className="ltr-serif ltr-glow mx-auto mt-4 max-w-2xl text-[28px] leading-snug sm:text-[38px]" style={{ color: GOLD_HI }}>
            The deck is shuffled. The door is unlocked. Ask.
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="/tarot/spreads/daily-card" className="ltr-btn ltr-mono px-8 py-3.5 text-[10.5px] tracking-[0.26em] uppercase">
              Pull your daily card
            </a>
            <a href="/tarot/cards" className="ltr-btn-ghost ltr-mono px-7 py-3.5 text-[10.5px] tracking-[0.26em] uppercase">
              Browse all 78 cards
            </a>
          </div>
          <p className="ltr-mono mt-5 text-[7.5px] tracking-[0.24em]" style={{ color: GOLD_DIM }}>
            NO ACCOUNT · NO CARD REQUIRED · FIRST PULL IN UNDER 10 SECONDS
          </p>
        </section>

        {/* ============================= FOOTER ============================= */}
        <footer className="mt-16 lg:mt-24">
          <div className="ltr-mono relative left-1/2 flex w-screen -translate-x-1/2 flex-wrap items-center justify-center gap-x-6 gap-y-1.5 border-y px-3 py-3 text-[8px] tracking-[0.26em] uppercase" style={{ borderColor: `${GOLD}2b`, color: GOLD }}>
            <span>78 Cards</span>
            <span style={{ color: GOLD_FAINT }}>·</span>
            <span>22 Major Arcana</span>
            <span style={{ color: GOLD_FAINT }}>·</span>
            <span>56 Minor Arcana</span>
            <span style={{ color: GOLD_FAINT }}>·</span>
            <span>4 Suits</span>
            <span style={{ color: GOLD_FAINT }}>·</span>
            <span>5 Spreads</span>
          </div>
          <div className="ltr-mono flex flex-wrap items-center gap-x-6 gap-y-1.5 px-1 py-4 text-[7.5px] tracking-[0.18em] uppercase" style={{ color: GOLD_DIM }}>
            <span style={{ color: GOLD }}>© 2026 ASTRO SCOPE — ALL DOORS RESERVED</span>
            <nav className="flex items-center gap-4">
              <a href="/tarot/spreads/daily-card" className="ltr-navlink">Daily Card</a>
              <a href="/tarot/cards" className="ltr-navlink">Cards</a>
              <a href="/tarot/birth-arcana" className="ltr-navlink">Birth Arcana</a>
            </nav>
            <span className="ml-auto">TAROT BUILD 3.1.4 · DECK NOMINAL · SHUFFLED IN 0.078S</span>
          </div>
        </footer>
      </div>
    </main>
  );
}

/* ============================ SCOPED STYLES =============================== */

const LTR_CSS = `
.ltr-root { font-family: Georgia, 'Times New Roman', serif; }
.ltr-serif { font-family: Georgia, 'Times New Roman', serif; }
.ltr-mono { font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace; }

.ltr-panel {
  position: relative;
  border: 1px solid rgba(212,168,44,.28);
  background:
    linear-gradient(180deg, rgba(212,168,44,.055), rgba(212,168,44,0) 38%),
    rgba(16,11,6,.6);
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.65), 0 0 22px rgba(0,0,0,.4);
}
.ltr-panel::after {
  content: "";
  position: absolute; inset: 3px;
  border: 1px solid rgba(212,168,44,.1);
  pointer-events: none;
}
.ltr-inset {
  border: 1px solid rgba(212,168,44,.18);
  background: rgba(0,0,0,.35);
  box-shadow: inset 0 1px 4px rgba(0,0,0,.6);
}
.ltr-panel-h {
  display: flex; align-items: center; gap: 10px;
  padding: 6px 10px;
  border-bottom: 1px solid rgba(212,168,44,.22);
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 8.5px; letter-spacing: .3em; text-transform: uppercase;
}
.ltr-panel-h-line {
  flex: 1; height: 1px;
  background: linear-gradient(90deg, rgba(212,168,44,.4), rgba(212,168,44,.05));
}

.ltr-navlink { color: rgba(233,223,200,.6); transition: color .25s ease; }
.ltr-navlink:hover { color: #f0cf6b; }

.ltr-btn {
  display: inline-block;
  color: #0a0705;
  background: linear-gradient(180deg, #f0cf6b, #d4a82c 55%, #a8841f);
  border: 1px solid #f0cf6b;
  box-shadow: 0 0 18px rgba(212,168,44,.35), inset 0 1px 0 rgba(255,244,214,.6);
  transition: box-shadow .3s ease;
  cursor: pointer;
}
.ltr-btn:hover { box-shadow: 0 0 26px rgba(212,168,44,.55), inset 0 1px 0 rgba(255,244,214,.7); }
.ltr-btn-ghost {
  display: inline-block;
  color: #d4a82c;
  border: 1px solid rgba(212,168,44,.5);
  background: rgba(212,168,44,.06);
  transition: background-color .3s ease, color .3s ease;
  cursor: pointer;
}
.ltr-btn-ghost:hover { background: rgba(212,168,44,.14); color: #f0cf6b; }

.ltr-action { transition: box-shadow .3s ease, background-color .3s ease; }
.ltr-action:hover { background-color: rgba(212,168,44,.07); box-shadow: inset 0 0 18px rgba(212,168,44,.12); }

.ltr-chip {
  border: 1px solid rgba(212,168,44,.45);
  background: rgba(10,7,5,.88);
  box-shadow: 0 0 14px rgba(0,0,0,.6), inset 0 0 8px rgba(212,168,44,.1);
}

.ltr-input {
  color: #f0cf6b;
  background: rgba(0,0,0,.45);
  border: 1px solid rgba(212,168,44,.4);
  box-shadow: inset 0 1px 4px rgba(0,0,0,.6);
  outline: none;
}
.ltr-input::placeholder { color: rgba(138,109,31,.8); }
.ltr-input:focus { border-color: rgba(240,207,107,.8); box-shadow: inset 0 1px 4px rgba(0,0,0,.6), 0 0 12px rgba(212,168,44,.25); }

/* a tarot card face: gold frame, hairline inner border */
.ltr-card {
  position: relative;
  border: 1px solid rgba(212,168,44,.55);
  background:
    linear-gradient(180deg, rgba(212,168,44,.07), rgba(212,168,44,0) 45%),
    #0d0906;
  box-shadow: 0 6px 18px rgba(0,0,0,.65), inset 0 0 10px rgba(212,168,44,.08);
  padding: 7px 8px;
  text-align: center;
}
.ltr-card::after {
  content: "";
  position: absolute; inset: 3px;
  border: 1px solid rgba(212,168,44,.18);
  pointer-events: none;
}

/* the fan: cards absolutely placed by inline left/top, rotation via --fr */
.ltr-fan-card {
  position: absolute;
  width: clamp(64px, 17vw, 104px);
  transform: rotate(var(--fr, 0deg));
  transition: transform .35s ease, box-shadow .35s ease;
}
.ltr-fan-card:hover {
  transform: translateY(-16px) rotate(0deg);
  z-index: 30;
}
.ltr-fan-card:hover .ltr-card {
  box-shadow: 0 14px 30px rgba(0,0,0,.75), 0 0 20px rgba(212,168,44,.25);
}

/* vertical tick ruler on the hero's left edge */
.ltr-ruler {
  position: absolute; left: 0; top: 2px; bottom: 2px; width: 10px;
  border-left: 1px solid rgba(212,168,44,.35);
  background-image: repeating-linear-gradient(180deg, rgba(212,168,44,.5) 0 1px, transparent 1px 11px);
  background-size: 6px 100%;
  background-repeat: no-repeat;
  opacity: .8;
}

/* engraved rail connecting the how-it-works medallions */
.ltr-rail {
  height: 8px;
  border-top: 1px solid rgba(212,168,44,.4);
  border-bottom: 1px solid rgba(212,168,44,.14);
  background-image: repeating-linear-gradient(90deg, rgba(212,168,44,.55) 0 1px, transparent 1px 9px);
  background-size: 100% 4px;
  background-position: 0 2px;
  background-repeat: no-repeat;
}

.ltr-medallion {
  background: #0a0705;
  border-radius: 9999px;
  box-shadow: 0 0 18px rgba(212,168,44,.22), inset 0 0 10px rgba(212,168,44,.14);
}

.ltr-vignette {
  background:
    radial-gradient(1200px 500px at 78% -8%, rgba(212,168,44,.10), transparent 60%),
    radial-gradient(900px 600px at 8% 4%, rgba(212,168,44,.05), transparent 55%);
}

/* hairline construction lines crossing whole sections (drafting-style) */
.ltr-line {
  position: absolute; left: -6vw; right: -6vw; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(212,168,44,.16) 10%, rgba(212,168,44,.16) 90%, transparent);
}
.ltr-line::after {
  content: "+";
  position: absolute; left: 10vw; top: -7px;
  color: rgba(212,168,44,.4);
  font: 11px ui-monospace, Menlo, monospace;
}
.ltr-line > b {
  position: absolute; right: 7vw; top: -4px;
  padding: 0 7px;
  background: #0a0705;
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 7px; font-weight: 400; letter-spacing: .26em;
  color: rgba(138,109,31,.9);
}

.ltr-glow { text-shadow: 0 0 16px rgba(212,168,44,.45), 0 0 46px rgba(212,168,44,.2); }

::selection { background: rgba(212,168,44,.35); color: #fff6dd; }

/* ---------- restrained age & handling: aged, not destroyed ---------- */
/* fine scratches + tarnish blotches on every gold-framed panel */
.ltr-panel::before {
  content: "";
  position: absolute; inset: 0;
  pointer-events: none;
  background:
    linear-gradient(114deg, transparent 0 46%, rgba(0,0,0,.18) 46.15%, rgba(240,207,107,.05) 46.3%, transparent 46.5%),
    linear-gradient(61deg, transparent 0 79%, rgba(0,0,0,.13) 79.15%, transparent 79.4%),
    radial-gradient(150px 90px at 86% 10%, rgba(84,67,15,.16), transparent 70%),
    radial-gradient(190px 130px at 5% 90%, rgba(60,45,10,.13), transparent 70%),
    radial-gradient(90px 70px at 55% 105%, rgba(84,67,15,.1), transparent 70%);
}

/* dust / paper grain over the whole page (inline feTurbulence) */
.ltr-grain {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>");
  background-size: 180px 180px;
  opacity: .055;
}

/* warm candlelight breathing in from the lower-left */
.ltr-candle {
  background:
    radial-gradient(820px 640px at -8% 108%, rgba(201,113,63,.13), transparent 62%),
    radial-gradient(1250px 820px at -4% 104%, rgba(212,168,44,.07), transparent 55%);
}

/* soot/smoke smudges in the corners */
.ltr-soot {
  position: absolute;
  border-radius: 9999px;
  background: radial-gradient(closest-side, rgba(0,0,0,.5), rgba(0,0,0,.18) 55%, transparent 72%);
  filter: blur(28px);
}
.ltr-soot-a { width: 44vmax; height: 34vmax; top: -14vmax; right: -12vmax; }
.ltr-soot-b { width: 38vmax; height: 30vmax; bottom: -12vmax; left: -10vmax; opacity: .85; }
.ltr-soot-c { width: 26vmax; height: 20vmax; top: -8vmax; left: -6vmax; opacity: .55; }

/* fingerprint-ish smears on the apparatus glass */
.ltr-smudge {
  position: absolute;
  pointer-events: none;
  border-radius: 9999px;
  background: radial-gradient(ellipse at center, rgba(233,223,200,.07), rgba(233,223,200,.02) 45%, transparent 68%);
  filter: blur(5px);
}
.ltr-smudge-a { width: 34%; height: 22%; top: 16%; right: 6%; transform: rotate(-24deg); }
.ltr-smudge-b { width: 26%; height: 17%; bottom: 12%; left: 9%; transform: rotate(31deg); }

/* ---------- slow, CSS-only motion (15–180s), reduced-motion guarded ------- */
@keyframes ltrSpin { to { transform: rotate(360deg); } }
@keyframes ltrSpinRev { to { transform: rotate(-360deg); } }
@keyframes ltrPulse { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }
@keyframes ltrTw { 0%, 100% { opacity: .15; } 50% { opacity: .8; } }
/* irregular, very subtle candle flicker */
@keyframes ltrFlicker {
  0%, 100% { opacity: 1; }
  23% { opacity: .86; }
  41% { opacity: .95; }
  57% { opacity: .78; }
  74% { opacity: .92; }
  89% { opacity: .84; }
}
/* soot drift — barely perceptible */
@keyframes ltrSootA { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-4%, 5%) scale(1.1); } }
@keyframes ltrSootB { 0%, 100% { transform: translate(0, 0) scale(1.06); } 50% { transform: translate(5%, -4%) scale(0.95); } }
/* quick-pull / birth-arcana result reveal */
@keyframes ltrDraw {
  0% { opacity: 0; transform: translateY(10px) rotate(-1.5deg) scale(.96); }
  100% { opacity: 1; transform: none; }
}

.ltr-spin-a, .ltr-spin-b, .ltr-spin-c { transform-box: view-box; transform-origin: center; }

@media (prefers-reduced-motion: no-preference) {
  .ltr-spin-a { animation: ltrSpin 170s linear infinite; }
  .ltr-spin-b { animation: ltrSpinRev 130s linear infinite; }
  .ltr-spin-c { animation: ltrSpin 95s linear infinite; }
  .ltr-pulse { animation: ltrPulse 15s ease-in-out infinite; }
  .ltr-pulse-slow { animation: ltrPulse 22s ease-in-out infinite 4s; }
  .ltr-tw0 { animation: ltrTw 23s ease-in-out infinite; }
  .ltr-tw1 { animation: ltrTw 31s ease-in-out infinite 7s; }
  .ltr-tw2 { animation: ltrTw 27s ease-in-out infinite 13s; }
  .ltr-candle { animation: ltrFlicker 13s ease-in-out infinite; }
  .ltr-soot-a { animation: ltrSootA 165s ease-in-out infinite; }
  .ltr-soot-b { animation: ltrSootB 145s ease-in-out infinite 9s; }
  .ltr-draw { animation: ltrDraw .6s ease-out both; }
}
`;
