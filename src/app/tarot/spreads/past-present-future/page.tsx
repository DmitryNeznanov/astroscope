// TAROT / SPREADS / PAST-PRESENT-FUTURE — a TOOL page, not a landing: the
// working three-card spread sits at the very top under a compact header and
// a cross-nav tab strip linking all seven tarot channels; the explainer and
// FAQ are condensed below. Production palette (from the live stylesheets /
// lab remix-v2): background rgb(10,9,18), text #e9e6f2/#b7b1cc, gold
// #f3c77a/#e39a4c/#ffdd9c, violet #a25adf/#b794f6, deep gold #c9a227.
// Broken + magic structure kept: translucent panels so the apparatus passes
// BEHIND them — two huge counter-rotating wheels half off-screen, giant dim
// glyphs, tide hairlines, star specks — plus tilted overlapping panels and
// station chips straddling the card edges. Three face-down positions
// (PAST / PRESENT / FUTURE) flip one by one on a staggered delay, drawn from
// a small built-in deck with inline mini card graphics. Self-contained:
// inline SVG + Tailwind + one scoped <style> block (lpp-). Client component
// (useState for the draw); animations CSS-only, slow cycles, reduced-motion
// guarded. Glyphs carry U+FE0E, never emoji.

"use client";

import { useState } from "react";

const DEG = Math.PI / 180;

// production palette (lab remix-v2 / live stylesheets)
const GOLD = "#f3c77a"; // --accent-primary
const GOLD_DEEP = "#c9a227"; // darker gold for hairlines
const CREAM = "#ffdd9c"; // --accent-tertiary
const AMBER = "#e39a4c"; // secondary gold
const VIOLET = "#a25adf"; // purple tint
const VIOLET_SOFT = "#b794f6";
const TEXT_HI = "#e9e6f2"; // --text-primary
const TEXT_LO = "#b7b1cc"; // --text-secondary
const TEXT_DIM = "#6f6890"; // dimmed lavender for micro-readouts
const INK = "#0a0912"; // page background

/* ============================ GEOMETRY HELPERS ============================ */

// tick marks around a circle: n radial lines from rIn to rOut around (cx, cy)
function ringTicks(cx: number, cy: number, rIn: number, rOut: number, n: number, every = 6) {
  return Array.from({ length: n }, (_, k) => {
    const t = ((360 / n) * k - 90) * DEG;
    return {
      x1: +(cx + rIn * Math.cos(t)).toFixed(1),
      y1: +(cy + rIn * Math.sin(t)).toFixed(1),
      x2: +(cx + rOut * Math.cos(t)).toFixed(1),
      y2: +(cy + rOut * Math.sin(t)).toFixed(1),
      major: k % every === 0,
    };
  });
}

// point on a circle; 0deg = top, clockwise
function onCircle(cx: number, cy: number, r: number, deg: number) {
  const t = (deg - 90) * DEG;
  return { x: +(cx + r * Math.cos(t)).toFixed(1), y: +(cy + r * Math.sin(t)).toFixed(1) };
}

// hand-sampled sine path for tidal charts
function sinePath(x0: number, x1: number, yMid: number, amp: number, cycles: number, phase = 0) {
  const steps = 96;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const x = x0 + ((x1 - x0) * i) / steps;
    const y = yMid - amp * Math.sin((i / steps) * cycles * 2 * Math.PI + phase);
    d += `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d;
}

/* ================================ DATA ==================================== */

// glyphs carry U+FE0E so they render as text, never emoji
const MOON_G = "\u263D\uFE0E"; // ☽︎
const SUN_G = "\u2609\uFE0E"; // ☉︎
const SATURN_G = "\u2644\uFE0E"; // ♄︎

// cross-nav: every tarot channel, this spread marked active
const TABS = [
  { label: "Tarot", href: "/tarot" },
  { label: "Daily Card", href: "/tarot/spreads/daily-card" },
  { label: "Yes or No", href: "/tarot/spreads/yes-no" },
  { label: "Past · Present · Future", href: "/tarot/spreads/past-present-future", active: true },
  { label: "Love — Three Card", href: "/tarot/spreads/love-three-card" },
  { label: "Birth Arcana", href: "/tarot/birth-arcana" },
  { label: "All Cards", href: "/tarot/cards" },
  { label: "Matrix", href: "/tarot/destiny-matrix" },
];

type CardKind = "moon" | "star" | "lantern" | "wheel" | "sun" | "veil" | "fool" | "threshold";

interface DeckCard {
  id: string;
  num: string;
  name: string;
  line: string;
  kind: CardKind;
}

// the small built-in gold deck — eight arcana, one-line meanings
const DECK: DeckCard[] = [
  { id: "moon", num: "XVIII", name: "The Moon", line: "What you feel is data, not verdict.", kind: "moon" },
  { id: "star", num: "XVII", name: "The Star", line: "The storm is over; the sky kept its promise.", kind: "star" },
  { id: "lantern", num: "IX", name: "The Hermit", line: "One lantern, carried far enough, becomes a map.", kind: "lantern" },
  { id: "wheel", num: "X", name: "Wheel of Fortune", line: "The wheel turns for everyone — read its rhythm.", kind: "wheel" },
  { id: "sun", num: "XIX", name: "The Sun", line: "Clarity without shadows; joy without an asterisk.", kind: "sun" },
  { id: "veil", num: "II", name: "The High Priestess", line: "Sit still until the answer surfaces.", kind: "veil" },
  { id: "fool", num: "0", name: "The Fool", line: "The leap is where the flying lessons happen.", kind: "fool" },
  { id: "threshold", num: "XIII", name: "Death", line: "Something must end for anything to change.", kind: "threshold" },
];

// the three stations on the tide line
const POSITIONS = [
  {
    n: "I",
    label: "Past",
    time: "T−∞ → T−1",
    title: "What the tide carried in",
    copy: "The root of the situation — events, habits and influences already in motion. Read it as ballast, not blame.",
    foot: "ORIGIN · INHERITANCE · UNDERTOW",
  },
  {
    n: "II",
    label: "Present",
    time: "T·0",
    title: "Where the water stands now",
    copy: "The energy around the question at this exact hour — including the parts you have not said out loud.",
    foot: "CURRENT · STANCE · THE REAL ASK",
  },
  {
    n: "III",
    label: "Future",
    time: "T+1 → T+∞",
    title: "Where the current points",
    copy: "The likely trajectory if nothing changes course. A heading, not a verdict — the rudder stays in your hand.",
    foot: "TRAJECTORY · HEADING · DRIFT",
  },
];

const FAQ = [
  {
    n: "N·01",
    q: "Do I need a question before I draw?",
    a: "A question sharpens the reading but is not required — with none, the spread reads your general current. Ask silently; the deck answers the held question, not the spoken one.",
  },
  {
    n: "N·02",
    q: "Is the future card fixed?",
    a: "No. The third card shows the trajectory of the present moment — where things land if the current keeps its course. Change the present and the future card changes with it.",
  },
  {
    n: "N·03",
    q: "How often should I cast the same spread?",
    a: "Once per situation per tidal cycle — about two weeks. Re-drawing daily on the same question measures your anxiety, not the current.",
  },
];

// draw three distinct cards from the deck (called from event handlers only)
function sampleThree(): number[] {
  const pool = DECK.map((_, i) => i);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;
  }
  return pool.slice(0, 3);
}

/* ============================ SMALL PIECES ================================ */

// engraved panel header: diamond + tracked title + hairline + right readout
function PHead({ title, right }: { title: string; right?: string }) {
  return (
    <div className="flex items-center gap-2 px-3 pt-2.5 pb-2">
      <span className="text-[7px] text-[#c9a227]">◆</span>
      <span className="lpp-caps whitespace-nowrap text-[8.5px] lpp-hi">{title}</span>
      <span className="lpp-hair flex-1" />
      {right ? <span className="lpp-mono whitespace-nowrap text-[7.5px] lpp-dim">{right}</span> : null}
      <span className="text-[7px] text-[#c9a227]">◆</span>
    </div>
  );
}

// full-bleed tide hairline used between sections — crosses panel borders
function TideDivider({ phase }: { phase: number }) {
  const a = sinePath(0, 1600, 20, 10, 2.5, phase);
  const b = sinePath(0, 1600, 20, 7, 2.5, phase + 1.1);
  return (
    <div className="relative z-0 mx-auto -my-px h-[40px] w-full" aria-hidden="true">
      <svg viewBox="0 0 1600 40" preserveAspectRatio="none" className="block h-full w-full">
        <path d={b} fill="none" stroke={VIOLET} strokeWidth="0.5" opacity="0.4" />
        <path d={a} fill="none" stroke={GOLD_DEEP} strokeWidth="0.6" opacity="0.55" />
        {Array.from({ length: 26 }, (_, i) => (
          <line key={i} x1={i * 64} y1="33" x2={i * 64} y2={i % 5 === 0 ? "27" : "30.5"} stroke={GOLD_DEEP} strokeWidth="0.5" opacity="0.45" />
        ))}
      </svg>
    </div>
  );
}

/* ------------------------- card art (150×222 faces) ----------------------- */

// the engraved card back — crescent inside a tick ring
function CardBack() {
  return (
    <svg viewBox="0 0 150 222" className="block h-full w-full" aria-hidden="true">
      <rect x="1" y="1" width="148" height="220" fill="#120e1f" stroke={GOLD} strokeWidth="1" />
      <rect x="6" y="6" width="138" height="210" fill="none" stroke={GOLD_DEEP} strokeWidth="0.5" opacity="0.7" />
      <rect x="10" y="10" width="130" height="202" fill="none" stroke={VIOLET} strokeWidth="0.4" strokeDasharray="2 3" opacity="0.5" />
      {ringTicks(75, 111, 40, 46, 36, 3).map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.major ? GOLD : GOLD_DEEP} strokeWidth={t.major ? 0.7 : 0.4} opacity={t.major ? 0.85 : 0.5} />
      ))}
      <circle cx="75" cy="111" r="34" fill="none" stroke={GOLD_DEEP} strokeWidth="0.5" opacity="0.8" />
      <path d="M86 88 a26 26 0 1 0 0 46 a20 20 0 1 1 0 -46 Z" fill={CREAM} opacity="0.92" />
      <circle cx="75" cy="111" r="54" fill="none" stroke={VIOLET_SOFT} strokeWidth="0.4" strokeDasharray="1 5" opacity="0.5" className="lpp-rot-b" />
      <circle cx="48" cy="52" r="1" fill={CREAM} opacity="0.7" />
      <circle cx="108" cy="70" r="0.8" fill={VIOLET_SOFT} opacity="0.6" />
      <circle cx="98" cy="176" r="1" fill={CREAM} opacity="0.6" />
      <circle cx="44" cy="168" r="0.7" fill={VIOLET_SOFT} opacity="0.5" />
      <text x="75" y="206" textAnchor="middle" fontSize="5" fill={TEXT_DIM} letterSpacing="2.5">ASTRO SCOPE</text>
    </svg>
  );
}

// mini emblem per arcana, drawn in a 110×110 zone centered on (55,55)
function Emblem({ kind }: { kind: CardKind }) {
  if (kind === "moon") {
    return (
      <g>
        {ringTicks(55, 55, 34, 39, 16, 4).map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.major ? GOLD : GOLD_DEEP} strokeWidth={t.major ? 0.7 : 0.4} opacity={t.major ? 0.9 : 0.55} />
        ))}
        <circle cx="55" cy="55" r="27" fill="url(#lpp-moon-grad)" />
        <ellipse cx="68" cy="55" rx="27" ry="27.5" fill={INK} opacity="0.68" />
        <circle cx="55" cy="55" r="27" fill="none" stroke={GOLD} strokeWidth="0.6" />
        <circle cx="24" cy="26" r="1.1" fill={VIOLET_SOFT} opacity="0.8" />
        <circle cx="90" cy="88" r="0.9" fill={CREAM} opacity="0.6" />
      </g>
    );
  }
  if (kind === "star") {
    return (
      <g>
        <polygon points="55,16 62,44 90,55 62,66 55,94 48,66 20,55 48,44" fill="rgba(243,199,122,0.12)" stroke={GOLD} strokeWidth="0.8" />
        <polygon points="55,28 60,48 80,55 60,62 55,82 50,62 30,55 50,48" fill="none" stroke={VIOLET_SOFT} strokeWidth="0.4" transform="rotate(22.5 55 55)" />
        <circle cx="55" cy="55" r="7" fill="none" stroke={CREAM} strokeWidth="0.6" />
        <circle cx="55" cy="55" r="1.8" fill={CREAM} className="lpp-pulse" />
        <line x1="55" y1="4" x2="55" y2="12" stroke={GOLD_DEEP} strokeWidth="0.4" strokeDasharray="1 2" />
        <line x1="55" y1="98" x2="55" y2="106" stroke={GOLD_DEEP} strokeWidth="0.4" strokeDasharray="1 2" />
      </g>
    );
  }
  if (kind === "lantern") {
    return (
      <g>
        <line x1="38" y1="10" x2="38" y2="100" stroke={GOLD_DEEP} strokeWidth="0.7" />
        <line x1="38" y1="30" x2="66" y2="30" stroke={GOLD_DEEP} strokeWidth="0.6" />
        <line x1="66" y1="30" x2="66" y2="38" stroke={GOLD_DEEP} strokeWidth="0.5" />
        <rect x="58" y="38" width="16" height="22" fill="rgba(243,199,122,0.06)" stroke={GOLD} strokeWidth="0.8" />
        <circle cx="66" cy="49" r="5.5" fill="url(#lpp-halo-grad)" className="lpp-pulse" />
        <circle cx="66" cy="49" r="2" fill={CREAM} />
        <path d="M58 62 A 26 26 0 0 0 92 72" fill="none" stroke={VIOLET_SOFT} strokeWidth="0.5" strokeDasharray="2 3" opacity="0.8" />
        <circle cx="30" cy="94" r="1" fill={CREAM} opacity="0.6" />
      </g>
    );
  }
  if (kind === "wheel") {
    return (
      <g>
        <circle cx="55" cy="55" r="34" fill="none" stroke={GOLD} strokeWidth="0.8" />
        <circle cx="55" cy="55" r="20" fill="none" stroke={GOLD_DEEP} strokeWidth="0.5" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => {
          const p = onCircle(55, 55, 34, d);
          const q = onCircle(55, 55, 20, d);
          return <line key={d} x1={q.x} y1={q.y} x2={p.x} y2={p.y} stroke={VIOLET_SOFT} strokeWidth="0.5" opacity="0.7" />;
        })}
        <circle cx="55" cy="55" r="4" fill="none" stroke={CREAM} strokeWidth="0.7" />
        {[22, 142, 262].map((d) => {
          const p = onCircle(55, 55, 34, d);
          return <circle key={d} cx={p.x} cy={p.y} r="1.6" fill={CREAM} />;
        })}
        <path d="M 91 38 A 40 40 0 0 1 93 66" fill="none" stroke={GOLD_DEEP} strokeWidth="0.5" strokeDasharray="2 3" opacity="0.8" />
      </g>
    );
  }
  if (kind === "sun") {
    return (
      <g>
        {ringTicks(55, 52, 30, 40, 12, 1).map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={i % 3 === 0 ? GOLD : GOLD_DEEP} strokeWidth={i % 3 === 0 ? 0.8 : 0.45} opacity={i % 3 === 0 ? 0.95 : 0.6} />
        ))}
        <circle cx="55" cy="52" r="24" fill="url(#lpp-sun-grad)" stroke={GOLD} strokeWidth="0.7" />
        <circle cx="55" cy="52" r="16" fill="none" stroke={INK} strokeWidth="0.4" opacity="0.35" />
        <line x1="12" y1="92" x2="98" y2="92" stroke={VIOLET_SOFT} strokeWidth="0.5" opacity="0.8" />
        <line x1="20" y1="98" x2="90" y2="98" stroke={VIOLET} strokeWidth="0.4" strokeDasharray="3 3" opacity="0.6" />
      </g>
    );
  }
  if (kind === "veil") {
    return (
      <g>
        <rect x="16" y="18" width="9" height="72" fill="rgba(243,199,122,0.05)" stroke={GOLD} strokeWidth="0.8" />
        <rect x="85" y="18" width="9" height="72" fill="rgba(243,199,122,0.05)" stroke={GOLD} strokeWidth="0.8" />
        <line x1="12" y1="94" x2="98" y2="94" stroke={GOLD_DEEP} strokeWidth="0.5" />
        <path d={sinePath(27, 83, 52, 9, 1.5, 0.6)} fill="none" stroke={VIOLET_SOFT} strokeWidth="0.5" opacity="0.8" />
        <path d={sinePath(27, 83, 62, 7, 1.5, 1.7)} fill="none" stroke={VIOLET} strokeWidth="0.4" opacity="0.6" />
        <path d="M61 36 a9 9 0 1 0 0 16 a7 7 0 1 1 0 -16 Z" fill={CREAM} opacity="0.9" />
        <circle cx="55" cy="30" r="1" fill={CREAM} opacity="0.7" />
      </g>
    );
  }
  if (kind === "fool") {
    return (
      <g>
        <polyline points="8,86 34,86 44,96 70,96 78,104" fill="none" stroke={GOLD} strokeWidth="0.8" />
        <line x1="34" y1="86" x2="30" y2="104" stroke={GOLD_DEEP} strokeWidth="0.4" opacity="0.7" />
        <line x1="70" y1="96" x2="66" y2="108" stroke={GOLD_DEEP} strokeWidth="0.4" opacity="0.7" />
        <circle cx="40" cy="72" r="3.4" fill="none" stroke={CREAM} strokeWidth="0.8" />
        <line x1="40" y1="75.5" x2="40" y2="86" stroke={CREAM} strokeWidth="0.8" />
        <path d="M 46 70 A 26 26 0 0 1 86 56" fill="none" stroke={VIOLET_SOFT} strokeWidth="0.5" strokeDasharray="2 3" opacity="0.9" />
        <polygon points="88,53 84,57 90,59" fill={GOLD} />
        <circle cx="88" cy="30" r="1.4" fill={CREAM} className="lpp-pulse" />
        <circle cx="96" cy="38" r="0.8" fill={VIOLET_SOFT} opacity="0.6" />
      </g>
    );
  }
  // threshold
  return (
    <g>
      <rect x="32" y="20" width="46" height="72" fill="none" stroke={GOLD} strokeWidth="0.9" />
      <rect x="38" y="26" width="34" height="66" fill="none" stroke={GOLD_DEEP} strokeWidth="0.4" opacity="0.8" />
      <line x1="12" y1="92" x2="98" y2="92" stroke={GOLD_DEEP} strokeWidth="0.5" />
      <path d="M 41 76 A 14 14 0 0 1 69 76 Z" fill="url(#lpp-sun-grad)" opacity="0.95" />
      <line x1="41" y1="76" x2="69" y2="76" stroke={AMBER} strokeWidth="0.6" />
      <line x1="55" y1="20" x2="55" y2="8" stroke={VIOLET_SOFT} strokeWidth="0.4" strokeDasharray="1 3" />
      <circle cx="55" cy="6" r="1" fill={CREAM} opacity="0.7" />
    </g>
  );
}

// the revealed card face — numeral, emblem, hairline, name
function CardFront({ card }: { card: DeckCard }) {
  return (
    <svg viewBox="0 0 150 222" className="block h-full w-full" aria-hidden="true">
      <rect x="1" y="1" width="148" height="220" fill="#141021" stroke={GOLD} strokeWidth="1" />
      <rect x="6" y="6" width="138" height="210" fill="none" stroke={GOLD_DEEP} strokeWidth="0.5" opacity="0.8" />
      <text x="75" y="26" textAnchor="middle" fontSize="11" fill={CREAM} letterSpacing="3" fontFamily="Georgia, serif">{card.num}</text>
      <line x1="30" y1="34" x2="120" y2="34" stroke={GOLD_DEEP} strokeWidth="0.4" />
      <g transform="translate(20 44)">
        <Emblem kind={card.kind} />
      </g>
      <line x1="30" y1="166" x2="120" y2="166" stroke={GOLD_DEEP} strokeWidth="0.4" />
      <text x="75" y="180" textAnchor="middle" fontSize="7" fill={TEXT_HI} letterSpacing="1.6">{card.name.toUpperCase()}</text>
      <text x="75" y="206" textAnchor="middle" fontSize="4.6" fill={TEXT_DIM} letterSpacing="1.2">GOLD DECK · REV K</text>
    </svg>
  );
}

/* ============================ SPREAD CARD ================================= */

interface SpreadCardProps {
  index: number;
  position: (typeof POSITIONS)[number];
  card: DeckCard | null;
  up: boolean;
  delay: number;
  onToggle: () => void;
  className: string;
  captionSide: "left" | "right";
}

function SpreadCard({ index, position, card, up, delay, onToggle, className, captionSide }: SpreadCardProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={up}
        aria-label={`${position.label} card — ${up && card ? `${card.name}, revealed` : "face down, activate to reveal"}`}
        className="lpp-cardbtn block h-[222px] w-[150px] cursor-pointer"
      >
        <div className={`lpp-flip ${up ? "lpp-on" : ""}`} style={{ transitionDelay: `${delay}ms` }}>
          <div className="lpp-face">
            <CardBack />
          </div>
          <div className="lpp-face lpp-front">
            {card ? <CardFront card={card} /> : <CardBack />}
          </div>
        </div>
      </button>
      {/* station chip straddling the card's lower edge */}
      <div className={`lpp-chip -mt-3.5 flex items-center gap-1.5 px-2 py-0.5 ${captionSide === "left" ? "-translate-x-4" : "translate-x-4"}`}>
        <span className="text-[6px] text-[#c9a227]">◆</span>
        <span className="lpp-caps text-[7.5px] text-[#f3c77a]">{position.label}</span>
        <span className="lpp-mono text-[6px] lpp-dim">{position.time}</span>
      </div>
      {/* revealed one-liner */}
      <div className={`mt-3 h-[30px] max-w-[190px] text-center transition-opacity duration-700 ${up && card ? "opacity-100" : "opacity-0"}`}>
        <span className="lpp-serif text-[9.5px] italic leading-snug lpp-mid">{card ? card.line : ""}</span>
      </div>
      <span className="lpp-mono mt-1 text-[5.5px] lpp-dim">POSITION {index + 1} · {position.n}</span>
    </div>
  );
}

/* ================================ PAGE ==================================== */

export default function PastPresentFuturePage() {
  const [draw, setDraw] = useState<number[] | null>(null);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false]);
  const [autoReveal, setAutoReveal] = useState(false);
  const [casts, setCasts] = useState(0);

  // spread timeline: three stations at 1/6, 3/6, 5/6 of the beam
  const tlMain = sinePath(0, 1200, 70, 26, 1.5, 0.9);
  const tlGhost = sinePath(0, 1200, 70, 20, 1.5, 2.0);
  const stations = [200, 600, 1000].map((x) => ({ x, y: 70 }));

  function cast() {
    setDraw(sampleThree());
    setRevealed([false, false, false]);
    setAutoReveal(false);
    window.setTimeout(() => setAutoReveal(true), 240);
    setCasts((c) => c + 1);
  }

  function toggleCard(i: number) {
    if (!draw) return;
    setAutoReveal(false);
    setRevealed((r) => r.map((v, k) => (k === i ? !v : v)));
  }

  const cards = draw ? draw.map((d) => DECK[d]) : [null, null, null];
  const allUp = draw !== null && (autoReveal || revealed.every(Boolean));

  return (
    <main className="lpp-root lpp-mono min-h-screen overflow-clip font-sans antialiased">
      <style>{LPP_CSS}</style>

      {/* shared gradients */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <radialGradient id="lpp-moon-grad" cx="38%" cy="34%" r="80%">
            <stop offset="0%" stopColor="#ffe9bd" />
            <stop offset="55%" stopColor="#e8b96a" />
            <stop offset="100%" stopColor="#7a5a26" />
          </radialGradient>
          <radialGradient id="lpp-sun-grad" cx="42%" cy="36%" r="80%">
            <stop offset="0%" stopColor="#ffdd9c" />
            <stop offset="60%" stopColor="#e39a4c" />
            <stop offset="100%" stopColor="#8a5a1e" />
          </radialGradient>
          <radialGradient id="lpp-halo-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,221,156,0.6)" />
            <stop offset="70%" stopColor="rgba(243,199,122,0.14)" />
            <stop offset="100%" stopColor="rgba(243,199,122,0)" />
          </radialGradient>
          <radialGradient id="lpp-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(243,199,122,0.2)" />
            <stop offset="70%" stopColor="rgba(243,199,122,0.05)" />
            <stop offset="100%" stopColor="rgba(243,199,122,0)" />
          </radialGradient>
        </defs>
      </svg>

      {/* ======== DEEP BACKGROUND — wheels, giant glyphs, tides, stars ======== */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        {/* huge gold wheel bleeding off the top-right, behind the tool */}
        <svg className="lpp-wheel-a absolute -right-[380px] -top-[330px] opacity-50" width="1150" height="1150" viewBox="0 0 1150 1150">
          <circle cx="575" cy="575" r="380" fill="none" stroke={GOLD_DEEP} strokeWidth="0.6" strokeDasharray="1 5" opacity="0.55" />
          <circle cx="575" cy="575" r="470" fill="none" stroke={GOLD_DEEP} strokeWidth="0.5" opacity="0.4" />
          <circle cx="575" cy="575" r="560" fill="none" stroke={VIOLET} strokeWidth="0.4" strokeDasharray="2 6" opacity="0.35" />
          {ringTicks(575, 575, 540, 548, 60, 5).map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={GOLD_DEEP} strokeWidth="0.4" opacity="0.45" />
          ))}
          <circle cx={onCircle(575, 575, 380, 40).x} cy={onCircle(575, 575, 380, 40).y} r="9" fill="#e8b96a" opacity="0.7" />
          <circle cx={onCircle(575, 575, 470, 205).x} cy={onCircle(575, 575, 470, 205).y} r="6" fill={INK} stroke={VIOLET_SOFT} strokeWidth="0.6" opacity="0.8" />
          <text x={onCircle(575, 575, 470, 90).x} y={onCircle(575, 575, 470, 90).y} textAnchor="middle" fontSize="7" fill={TEXT_DIM} letterSpacing="2">ORB·III</text>
        </svg>

        {/* colossal violet wheel bleeding off the lower left */}
        <svg className="lpp-wheel-b absolute -left-[430px] top-[860px] opacity-45" width="1400" height="1400" viewBox="0 0 1400 1400">
          <circle cx="700" cy="700" r="600" fill="none" stroke={VIOLET} strokeWidth="0.6" strokeDasharray="1 6" opacity="0.5" />
          <circle cx="700" cy="700" r="520" fill="none" stroke={GOLD_DEEP} strokeWidth="0.5" opacity="0.4" />
          <circle cx="700" cy="700" r="390" fill="none" stroke={VIOLET_SOFT} strokeWidth="0.4" strokeDasharray="2 5" opacity="0.3" />
          {ringTicks(700, 700, 570, 582, 96, 8).map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.major ? GOLD : GOLD_DEEP} strokeWidth="0.5" opacity={t.major ? 0.5 : 0.3} />
          ))}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => {
            const p = onCircle(700, 700, 560, d);
            return <circle key={d} cx={p.x} cy={p.y} r="3" fill={CREAM} opacity="0.55" />;
          })}
          <text x="700" y="105" textAnchor="middle" fontSize="8" fill={TEXT_DIM} letterSpacing="3">TIDAL CYCLE · 29.53 D</text>
        </svg>

        {/* tide hairlines crossing the whole page, through every panel */}
        <svg className="absolute inset-0 h-full w-full opacity-70" viewBox="0 0 1200 2600" preserveAspectRatio="none">
          <path d={sinePath(0, 1200, 420, 26, 1.75, 0.3)} fill="none" stroke={GOLD_DEEP} strokeWidth="0.5" opacity="0.4" />
          <path d={sinePath(0, 1200, 420, 20, 1.75, 1.4)} fill="none" stroke={VIOLET} strokeWidth="0.4" opacity="0.35" />
          <path d={sinePath(0, 1200, 1180, 30, 2.25, 0.9)} fill="none" stroke={GOLD_DEEP} strokeWidth="0.5" opacity="0.35" />
          <path d={sinePath(0, 1200, 1980, 24, 1.5, 2.1)} fill="none" stroke={VIOLET_SOFT} strokeWidth="0.4" opacity="0.3" />
          <line x1="120" y1="0" x2="120" y2="2600" stroke={GOLD_DEEP} strokeWidth="0.3" strokeDasharray="1 8" opacity="0.3" />
          <line x1="1080" y1="0" x2="1080" y2="2600" stroke={GOLD_DEEP} strokeWidth="0.3" strokeDasharray="1 8" opacity="0.3" />
        </svg>

        {/* star specks over the whole scroll */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 2600" preserveAspectRatio="none">
          {Array.from({ length: 80 }, (_, i) => (
            <circle
              key={i}
              cx={(i * 173 + 41) % 1200}
              cy={(i * 389 + 97) % 2600}
              r={0.5 + (i % 3) * 0.35}
              fill={i % 4 === 0 ? VIOLET_SOFT : CREAM}
              opacity={0.1 + (i % 5) * 0.05}
            />
          ))}
        </svg>

        {/* giant dim glyphs drifting behind the panels */}
        <span className="lpp-glyph lpp-float-a absolute left-[2vw] top-[70vh] text-[24vmin] leading-none text-[#b794f6] opacity-[0.05]">{MOON_G}</span>
        <span className="lpp-glyph lpp-float-b absolute right-[4vw] top-[150vh] text-[27vmin] leading-none text-[#f3c77a] opacity-[0.045]">{SATURN_G}</span>
        <span className="lpp-glyph lpp-float-a absolute left-[36vw] top-[218vh] text-[20vmin] leading-none text-[#e9e6f2] opacity-[0.035]">{SUN_G}</span>
      </div>

      {/* ======== WEATHERING — vignette, dust, drifting nebula mist ======== */}
      <div className="lpp-vignette pointer-events-none fixed inset-0 z-30" aria-hidden="true" />
      <div className="lpp-dust pointer-events-none fixed inset-0 z-30" aria-hidden="true" />
      <div className="lpp-mist lpp-mist-a pointer-events-none absolute z-20" aria-hidden="true" />
      <div className="lpp-mist lpp-mist-b pointer-events-none absolute z-20" aria-hidden="true" />

      {/* ===================== COMPACT HEADER + CROSS-NAV ===================== */}
      <header className="lpp-panel relative z-20 border-x-0 border-t-0">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-5 gap-y-1 px-4 py-2">
          <a href="/" className="flex items-center gap-2">
            <span className="lpp-glyph grid h-7 w-7 place-items-center border border-[#f3c77a]/40 bg-[#f3c77a]/[0.07] text-[13px] text-[#f3c77a]">✦</span>
            <span className="lpp-serif text-[15px] tracking-wide lpp-hi">Astro Scope</span>
          </a>
          <span className="lpp-mono hidden text-[6.5px] lpp-dim md:inline">TAROT INSTRUMENT · SPREAD LIBRARY</span>
          <span className="flex-1" />
          <a href="/horoscope" className="lpp-caps lpp-link text-[8px] lpp-mid">Horoscopes</a>
          <a href="/compatibility" className="lpp-caps lpp-link text-[8px] lpp-mid">Compatibility</a>
          <span className="lpp-vhair hidden sm:block" />
          <a href="/sign-in" className="lpp-caps lpp-link text-[8px] lpp-mid">Sign In</a>
        </div>
        {/* cross-nav tabs — all seven tarot channels, this spread active */}
        <nav className="border-t border-[rgba(233,230,242,0.08)]">
          <div className="lpp-tabs mx-auto flex max-w-[1240px] items-stretch gap-1 overflow-x-auto px-3 py-1.5">
            {TABS.map((t) => (
              <a
                key={t.href}
                href={t.href}
                aria-current={t.active ? "page" : undefined}
                className={`lpp-tab ${t.active ? "lpp-tab-on" : ""}`}
              >
                {t.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      {/* ==================== THE TOOL — TIDAL TIMELINE SPREAD ==================== */}
      <section id="lpp-spread" className="lpp-panel relative z-10 mt-4 max-w-[1180px] lg:ml-[3%]">
        <PHead title="Past · Present · Future — Three Stations on One Current" right="SPREAD N·03 · 8 ARCANA · FREE" />
        <p className="lpp-mono px-3 pb-1 text-[7px] lpp-dim">
          HOLD A QUESTION · CAST · THE CARDS TURN PAST → PRESENT → FUTURE · TAP ANY CARD TO TURN IT BACK
        </p>

        <div className="relative px-4 pb-5 sm:px-8">
          {/* the tide beam the three stations hang on (desktop) */}
          <svg
            viewBox="0 0 1200 130"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 top-[228px] hidden h-[130px] w-full lg:block"
            aria-hidden="true"
          >
            <path d={tlGhost} fill="none" stroke={VIOLET} strokeWidth="0.5" opacity="0.55" />
            <path d={tlMain} fill="none" stroke={GOLD} strokeWidth="0.8" opacity="0.85" />
            {Array.from({ length: 49 }, (_, i) => (
              <line key={i} x1={i * 25} y1="122" x2={i * 25} y2={i % 6 === 0 ? "112" : "117"} stroke={GOLD_DEEP} strokeWidth="0.5" opacity="0.5" />
            ))}
            {stations.map((s, i) => (
              <g key={i}>
                <circle cx={s.x} cy={s.y} r="3" fill={GOLD} />
                <circle cx={s.x} cy={s.y} r="7" fill="none" stroke={GOLD_DEEP} strokeWidth="0.4" strokeDasharray="2 2" opacity="0.8" />
                <line x1={s.x} y1={s.y - 7} x2={s.x} y2={s.y - 60} stroke={GOLD_DEEP} strokeWidth="0.4" strokeDasharray="2 3" opacity="0.7" />
                <text x={s.x + 12} y={s.y + 3} fontSize="7" fill={TEXT_DIM} letterSpacing="2">
                  {["T−1", "T·0", "T+1"][i]}
                </text>
              </g>
            ))}
            <text x="8" y="18" fontSize="6" fill={TEXT_DIM} letterSpacing="2">MEAN WATER · STATION BEAM 03</text>
            <text x="1120" y="18" fontSize="6" fill={TEXT_DIM} letterSpacing="2">DRIFT →</text>
          </svg>

          {/* cards — stacked on mobile, broken across the beam on desktop */}
          <div className="relative flex flex-col items-center gap-9 pt-4 lg:block lg:h-[400px]">
            <SpreadCard
              index={0}
              position={POSITIONS[0]}
              card={cards[0]}
              up={draw !== null && (revealed[0] || autoReveal)}
              delay={0}
              onToggle={() => toggleCard(0)}
              captionSide="left"
              className="lpp-tilt-c lg:absolute lg:left-[7%] lg:top-[0px]"
            />
            <SpreadCard
              index={1}
              position={POSITIONS[1]}
              card={cards[1]}
              up={draw !== null && (revealed[1] || autoReveal)}
              delay={autoReveal && !revealed[1] ? 750 : 0}
              onToggle={() => toggleCard(1)}
              captionSide="right"
              className="lpp-tilt-b lg:absolute lg:left-1/2 lg:top-[52px] lg:-translate-x-1/2"
            />
            <SpreadCard
              index={2}
              position={POSITIONS[2]}
              card={cards[2]}
              up={draw !== null && (revealed[2] || autoReveal)}
              delay={autoReveal && !revealed[2] ? 1500 : 0}
              onToggle={() => toggleCard(2)}
              captionSide="left"
              className="lpp-tilt-d lg:absolute lg:right-[7%] lg:top-[4px]"
            />
          </div>

          {/* cast controls + session readout */}
          <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-[rgba(233,230,242,0.08)] pt-3.5">
            <button type="button" onClick={cast} className="lpp-btn lpp-caps rotate-[-0.4deg] px-6 py-2.5 text-[10px] font-medium">
              {draw === null ? "Cast the spread" : "Gather & cast again"}
            </button>
            <div className="lpp-mono text-[6.5px] leading-[1.7] lpp-dim">
              {draw === null
                ? "DECK FACE DOWN · AWAITING FIRST DRAW"
                : autoReveal
                  ? "REVEALING — PAST → PRESENT → FUTURE · ΔT 0.75 S"
                  : "TAP ANY CARD TO TURN IT BACK OR OVER"}
            </div>
            <span className="flex-1" />
            <div className="lpp-mono text-[6.5px] lpp-dim">
              DRAW &lt; 3 S · NO ACCOUNT · CASTS THIS SESSION: {String(casts).padStart(2, "0")}
            </div>
          </div>

          {/* synthesized reading, fades in behind the last flip */}
          <div className={`mt-3 border border-[rgba(243,199,122,0.18)] bg-[rgba(18,14,31,.55)] px-4 py-3 ${allUp ? "lpp-fade-late" : "hidden"}`}>
            {draw !== null && cards[0] && cards[1] && cards[2] ? (
              <>
                <div className="lpp-mono text-[6px] lpp-dim">
                  {`CAST ${String(casts).padStart(2, "0")} · PAST ${cards[0].num} ${cards[0].name.toUpperCase()} → PRESENT ${cards[1].num} ${cards[1].name.toUpperCase()} → FUTURE ${cards[2].num} ${cards[2].name.toUpperCase()}`}
                </div>
                <p className="lpp-serif mt-2 text-[14px] italic leading-relaxed text-[#ffdd9c] sm:text-[16px]">
                  {`${cards[0].name} set the current — ${cards[1].name} holds the water — ${cards[2].name} marks the heading.`}
                </p>
                <div className="lpp-mono mt-2 text-[6px] lpp-dim">
                  READING FOR REFLECTION · THE RUDDER STAYS IN YOUR HAND
                </div>
              </>
            ) : null}
          </div>
        </div>
      </section>

      {/* diagonal hairline crossing between tool and explainer */}
      <div className="pointer-events-none relative z-0 left-[-4vw] h-px w-[108vw] -rotate-[0.5deg] bg-gradient-to-r from-transparent via-[#f3c77a]/25 to-transparent" aria-hidden="true" />

      {/* ===================== READING THE THREE POSITIONS ===================== */}
      <section className="lpp-panel lpp-tilt-b relative z-20 mx-auto mt-10 max-w-[1180px]">
        <span className="lpp-chip absolute -top-3 left-8 rotate-[0.6deg]" style={{ borderColor: "rgba(162,90,223,0.5)", color: "#b794f6" }}>Section 02</span>
        <PHead title="Reading the Three Positions" right="STATIONS I–III" />
        <div className="grid grid-cols-1 gap-px bg-[rgba(233,230,242,0.08)] pb-3 lg:grid-cols-3">
          {POSITIONS.map((p, i) => (
            <article key={p.n} className={`lpp-plate relative bg-[#0d0a18]/80 p-4 ${i === 1 ? "lg:translate-y-3" : ""} ${i === 2 ? "lg:-translate-y-1" : ""}`}>
              <div className="flex items-center gap-2">
                <span className="lpp-serif text-[16px] leading-none text-[#f3c77a]">{p.n}</span>
                <span className="lpp-hair w-8" />
                <span className="lpp-caps text-[8px] lpp-hi">{p.label}</span>
                <span className="flex-1" />
                <span className="lpp-mono text-[6px] lpp-dim">{p.time}</span>
              </div>
              {/* tiny station diagram */}
              <svg width="100%" height="40" viewBox="0 0 260 40" className="mt-3" aria-hidden="true">
                <path d={sinePath(0, 260, 22, 8, 1.5, 0.9)} fill="none" stroke={GOLD_DEEP} strokeWidth="0.6" opacity="0.8" />
                <line x1="0" y1="22" x2="260" y2="22" stroke={VIOLET} strokeWidth="0.4" strokeDasharray="1 5" opacity="0.6" />
                <circle cx={[52, 130, 208][i]} cy="22" r="3" fill={GOLD} />
                <circle cx={[52, 130, 208][i]} cy="22" r="6.5" fill="none" stroke={GOLD_DEEP} strokeWidth="0.4" strokeDasharray="2 2" />
                {i === 0 ? <text x="10" y="11" fontSize="6" fill={TEXT_DIM} letterSpacing="1.5">← DRIFT</text> : null}
                {i === 1 ? <text x="112" y="11" fontSize="6" fill={TEXT_DIM} letterSpacing="1.5">YOU · HERE</text> : null}
                {i === 2 ? <text x="196" y="11" fontSize="6" fill={TEXT_DIM} letterSpacing="1.5">DRIFT →</text> : null}
              </svg>
              <h3 className="lpp-serif mt-2.5 text-[15px] leading-snug lpp-hi">{p.title}</h3>
              <p className="mt-1.5 text-[9.5px] leading-[1.65] lpp-mid">{p.copy}</p>
              <div className="lpp-mono mt-2.5 border-t border-[rgba(233,230,242,0.08)] pt-1.5 text-[5.5px] lpp-dim">
                {p.foot}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ============================ FAQ — CONDENSED ============================ */}
      <section className="lpp-panel lpp-tilt-a relative z-20 mx-auto mt-10 max-w-[1180px]">
        <PHead title="Analysis Notes — Frequently Logged Queries" right="3 ENTRIES" />
        <div className="grid grid-cols-1 gap-px bg-[rgba(233,230,242,0.08)] sm:grid-cols-3">
          {FAQ.map((f) => (
            <div key={f.n} className="lpp-plate bg-[#0d0a18]/80 p-4">
              <div className="flex items-baseline gap-2">
                <span className="lpp-mono shrink-0 text-[7px] text-[#c9a227]">{f.n}</span>
                <span className="lpp-caps text-[8px] leading-relaxed lpp-hi">{f.q}</span>
              </div>
              <span className="lpp-hair mt-2 block w-12" />
              <p className="mt-2 text-[9px] leading-[1.65] lpp-mid">{f.a}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-[rgba(233,230,242,0.08)] px-5 py-1.5 lpp-mono text-[6.5px] lpp-dim sm:px-6">
          LOG CONTINUES AT /SUPPORT · RESPONSE LATENCY &lt; 1 TIDAL CYCLE
        </div>
      </section>

      {/* ============================ NEXT SPREADS — SLIM CTA ============================ */}
      <section className="relative z-10 mx-auto mt-10 max-w-[1180px] overflow-hidden border border-[rgba(243,199,122,0.15)] bg-[#151126]/50 py-8 backdrop-blur-[3px]">
        <div className="pointer-events-none absolute inset-x-[-2vw] top-2.5 h-px rotate-[0.3deg] bg-gradient-to-r from-transparent via-[#a25adf]/35 to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-[-2vw] bottom-2.5 h-px -rotate-[0.25deg] bg-gradient-to-r from-transparent via-[#f3c77a]/30 to-transparent" aria-hidden="true" />
        <div className="relative mx-auto flex max-w-[1100px] flex-wrap items-center gap-x-8 gap-y-4 px-5">
          <div className="min-w-[240px] flex-1">
            <div className="lpp-caps text-[7.5px] lpp-dim">— Keep Pulling —</div>
            <p className="lpp-serif mt-2 text-[19px] leading-snug lpp-hi sm:text-[22px]">
              The tide is already moving. <span className="text-[#f3c77a]">Read your three</span> — or change instruments.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a href="#lpp-spread" className="lpp-btn lpp-caps inline-block rotate-[0.4deg] px-6 py-2.5 text-[9.5px] font-medium">
              Cast again — free
            </a>
            <a href="/tarot/spreads/daily-card" className="lpp-caps lpp-gold-link text-[8.5px]">
              {"Daily card →"}
            </a>
            <a href="/tarot/spreads/yes-no" className="lpp-caps lpp-gold-link text-[8.5px]">
              {"Yes or no →"}
            </a>
          </div>
        </div>
      </section>

      {/* =============================== FOOTER =============================== */}
      <footer className="lpp-panel relative z-10 mx-auto mt-10 max-w-[1180px] px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <span className="flex items-center gap-1.5">
            <span className="lpp-glyph text-[11px] text-[#f3c77a]">{MOON_G}</span>
            <span className="lpp-serif text-[11px] tracking-wide lpp-hi">Astro Scope</span>
          </span>
          <span className="lpp-mono text-[6.5px] lpp-dim">TAROT INSTRUMENT · SPREAD N·03 · PLATE REV K</span>
          <span className="flex-1" />
          {TABS.filter((t) => !t.active).slice(0, 4).map((t) => (
            <a key={t.href} href={t.href} className="lpp-caps lpp-link text-[6.5px] lpp-dim">
              {t.label}
            </a>
          ))}
          <span className="lpp-mono text-[6.5px] lpp-dim">© 2026 · READINGS FOR ENTERTAINMENT + REFLECTION</span>
        </div>
      </footer>
      {/* bottom tide rule closing the page */}
      <TideDivider phase={2.6} />
    </main>
  );
}

/* ============================ SCOPED STYLES =============================== */

const LPP_CSS = `
/* keep the page dark edge to edge — the global stylesheet paints body white
   in light color-scheme, and decorative layers must never expose it */
html,body{ background:#0a0912; }
.lpp-root{
  position:relative;
  background:#0a0912;
  color:#e9e6f2;
  font-size:11px;
  background-image:
    radial-gradient(1px 1px at 12% 22%, rgba(243,199,122,.26) 50%, transparent 51%),
    radial-gradient(1px 1px at 68% 8%, rgba(183,148,246,.2) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 84% 34%, rgba(255,221,156,.16) 50%, transparent 51%),
    radial-gradient(1px 1px at 38% 64%, rgba(243,199,122,.18) 50%, transparent 51%),
    radial-gradient(1px 1px at 92% 78%, rgba(183,148,246,.18) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 24% 88%, rgba(255,221,156,.14) 50%, transparent 51%),
    radial-gradient(1px 1px at 54% 44%, rgba(233,230,242,.12) 50%, transparent 51%),
    radial-gradient(1px 1px at 4% 52%, rgba(243,199,122,.2) 50%, transparent 51%),
    radial-gradient(ellipse 90% 60% at 50% 0%, rgba(46,32,84,.32), transparent 70%),
    linear-gradient(180deg, #0d0a18 0%, #0a0912 40%, #080712 100%);
}
.lpp-serif{ font-family: "Playfair Display", "Cormorant Garamond", Georgia, 'Times New Roman', serif; }
.lpp-mono{ font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace; }
.lpp-glyph{ font-family: "Noto Sans Symbols", "Noto Sans Symbols 2", Symbola, "Segoe UI Symbol", serif; font-style: normal; }
.lpp-caps{ text-transform:uppercase; letter-spacing:.22em; }
.lpp-hi{ color:#e9e6f2; }
.lpp-mid{ color:#b7b1cc; }
.lpp-dim{ color:#6f6890; }
/* panels stay translucent so the wheels/lines pass visibly BEHIND them */
.lpp-panel{
  background:linear-gradient(160deg, rgba(23,19,40,.62), rgba(12,10,22,.72));
  border:1px solid rgba(233,230,242,.10);
  backdrop-filter:blur(3px);
}
.lpp-hair{
  height:1px;
  background:
    repeating-linear-gradient(90deg, transparent 0 13px, rgba(10,9,18,.85) 13px 13.7px, transparent 13.7px 29px, rgba(10,9,18,.55) 29px 29.4px, transparent 29.4px 47px),
    linear-gradient(90deg, transparent, rgba(201,162,39,.5) 20%, rgba(201,162,39,.5) 80%, transparent);
}
.lpp-vhair{ width:1px; height:14px; background:rgba(243,199,122,.3); }
.lpp-chip{
  display:inline-block;
  border:1px solid rgba(243,199,122,.35);
  background:rgba(10,9,18,.85);
  padding:4px 10px;
  font-size:10px;
  letter-spacing:.2em;
  text-transform:uppercase;
  color:#f3c77a;
}
.lpp-btn{
  border:1px solid #f3c77a;
  background:#f3c77a;
  color:#0a0912;
  letter-spacing:.22em;
  box-shadow: 0 0 18px rgba(243,199,122,.22);
  transition: translate .25s ease, box-shadow .3s ease, background .3s ease;
}
.lpp-btn:hover{
  translate: 0 -2px;
  background:#ffdd9c;
  box-shadow: 0 0 28px rgba(243,199,122,.4);
}
.lpp-link{ transition: color .25s ease, text-shadow .25s ease; }
.lpp-link:hover{ color:#ffdd9c; text-shadow:0 0 10px rgba(243,199,122,.5); }
.lpp-gold-link{
  color:#f3c77a;
  text-decoration:none;
  background-image:linear-gradient(#f3c77a,#f3c77a);
  background-size:0% 1px;
  background-repeat:no-repeat;
  background-position:0 100%;
  transition:background-size .35s ease, color .2s ease;
}
.lpp-gold-link:hover{ color:#ffdd9c; background-size:100% 1px; }
.lpp-plate{ transition: box-shadow .3s ease, background .3s ease; }
.lpp-plate:hover{ background:#120e20; box-shadow: inset 0 0 0 1px rgba(243,199,122,.16), inset 0 0 30px rgba(46,32,84,.5); }

/* cross-nav tabs */
.lpp-tabs{ scrollbar-width:none; }
.lpp-tabs::-webkit-scrollbar{ display:none; }
.lpp-tab{
  flex:none;
  padding:6px 11px;
  border:1px solid rgba(233,230,242,.10);
  background:rgba(255,255,255,.02);
  font-size:8px;
  letter-spacing:.2em;
  text-transform:uppercase;
  color:#b7b1cc;
  transition: color .25s ease, border-color .25s ease, background .25s ease;
}
.lpp-tab:hover{ color:#ffdd9c; border-color:rgba(243,199,122,.45); }
.lpp-tab-on{
  color:#ffdd9c;
  border-color:rgba(243,199,122,.6);
  background:rgba(243,199,122,.10);
  box-shadow: inset 0 -2px 0 rgba(243,199,122,.7);
}

/* slight rotations — hand-set plates, not laser-aligned */
.lpp-tilt-a{ rotate: -0.45deg; }
.lpp-tilt-b{ rotate: 0.3deg; }
.lpp-tilt-c{ rotate: -2.1deg; }
.lpp-tilt-d{ rotate: 1.7deg; }

/* ---------------- the spread: 3d flip cards ---------------- */
.lpp-cardbtn{
  perspective: 900px;
  background: transparent;
  border: 0;
  padding: 0;
  transition: translate .35s ease;
}
.lpp-cardbtn:hover{ translate: 0 -5px; }
.lpp-cardbtn:focus-visible{
  outline: 1px solid rgba(243,199,122,.7);
  outline-offset: 4px;
}
.lpp-flip{
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform .85s cubic-bezier(.22,.7,.25,1);
}
.lpp-flip.lpp-on{ transform: rotateY(180deg); }
.lpp-face{
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  filter: drop-shadow(0 10px 18px rgba(2,2,8,.65));
}
.lpp-front{ transform: rotateY(180deg); }

/* ---------------- weathering ---------------- */
.lpp-vignette{
  background:
    radial-gradient(ellipse 70% 55% at 72% 10%, rgba(183,148,246,.06), transparent 60%),
    radial-gradient(ellipse 130% 95% at 46% 42%, transparent 52%, rgba(4,3,10,.6) 100%),
    linear-gradient(180deg, rgba(23,17,44,.16), transparent 28%, transparent 68%, rgba(4,3,10,.4));
}
.lpp-dust{
  opacity:.05;
  mix-blend-mode:screen;
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)'/%3E%3C/svg%3E"),
    repeating-linear-gradient(103deg, transparent 0 46px, rgba(243,199,122,.5) 46px 46.4px, transparent 46.4px 97px);
}
.lpp-mist{
  border-radius:50%;
  filter:blur(18px);
  background:radial-gradient(ellipse at center, rgba(162,90,223,.10), rgba(162,90,223,.04) 45%, transparent 70%);
}
.lpp-mist-a{ width:55vw; height:34vh; top:4%; left:-10%; }
.lpp-mist-b{ width:48vw; height:30vh; top:52%; right:-14%; }

@keyframes lpp-rot{ to{ transform: rotate(360deg); } }
@keyframes lpp-rot-rev{ to{ transform: rotate(-360deg); } }
@keyframes lpp-pulse{ 0%,100%{ opacity:.55; } 50%{ opacity:1; } }
@keyframes lpp-floatA{ 0%,100%{ transform: translate(0,0) rotate(-2deg); } 50%{ transform: translate(1.5vw,-2vh) rotate(1deg); } }
@keyframes lpp-floatB{ 0%,100%{ transform: translate(0,0) rotate(3deg); } 50%{ transform: translate(-1.5vw,2vh) rotate(-1deg); } }
@keyframes lpp-mist-a{ 0%,100%{ transform: translate(0,0); } 50%{ transform: translate(7vw,2.5vh); } }
@keyframes lpp-mist-b{ 0%,100%{ transform: translate(0,0); } 50%{ transform: translate(-6vw,-2vh); } }
@keyframes lpp-fade{ from{ opacity:0; transform: translateY(6px); } to{ opacity:1; transform: translateY(0); } }

@media (prefers-reduced-motion: no-preference){
  .lpp-rot-a{ animation: lpp-rot 180s linear infinite; transform-box: view-box; transform-origin: center; }
  .lpp-rot-b{ animation: lpp-rot 120s linear infinite reverse; transform-box: view-box; transform-origin: center; }
  .lpp-wheel-a{ animation: lpp-rot 300s linear infinite; }
  .lpp-wheel-b{ animation: lpp-rot-rev 340s linear infinite; }
  .lpp-pulse{ animation: lpp-pulse 16s ease-in-out infinite; }
  .lpp-float-a{ animation: lpp-floatA 34s ease-in-out infinite; }
  .lpp-float-b{ animation: lpp-floatB 42s ease-in-out infinite; }
  .lpp-mist-a{ animation: lpp-mist-a 170s ease-in-out infinite; }
  .lpp-mist-b{ animation: lpp-mist-b 190s ease-in-out infinite; }
  .lpp-fade-late{ animation: lpp-fade .9s ease 2.4s both; }
}
@media (prefers-reduced-motion: reduce){
  .lpp-rot-a,.lpp-rot-b,.lpp-wheel-a,.lpp-wheel-b,.lpp-pulse,
  .lpp-float-a,.lpp-float-b,.lpp-mist-a,.lpp-mist-b{ animation: none; }
  .lpp-flip{ transition: none; }
}
`;
