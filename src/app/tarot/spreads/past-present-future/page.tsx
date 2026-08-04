// TAROT / SPREADS / PAST-PRESENT-FUTURE — design exploration in the selene
// silver-blue lunar language. A working three-card spread on a tidal
// timeline: three face-down positions (PAST / PRESENT / FUTURE) that flip
// one by one on a staggered delay, drawn from a small built-in deck with
// inline mini card graphics in lunar silver. Broken layout — full-bleed
// hero with the moon bleeding off the top-right corner, tilted overlapping
// panels, station labels straddling the tide line — over a layered
// low-opacity apparatus of rings, hairlines, phase moons and star specks.
// Self-contained: inline SVG + Tailwind + one scoped <style> block (lpp-).
// Client component (useState for the draw); animations CSS-only, slow
// 15–180s cycles, reduced-motion guarded. Glyphs carry U+FE0E, never emoji.

"use client";

import { useState } from "react";

const DEG = Math.PI / 180;

// silver-on-navy palette (selene)
const SILVER = "#c8d6ec";
const STEEL = "#7d94b8";
const DIM = "#4a5c78";
const INK = "#060a12";

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
const SCORPIO_G = "\u264F\uFE0E"; // ♏︎
const NEPTUNE_G = "\u2646\uFE0E"; // ♆︎
const SATURN_G = "\u2644\uFE0E"; // ♄︎

type CardKind = "moon" | "star" | "lantern" | "wheel" | "sun" | "veil" | "fool" | "threshold";

interface DeckCard {
  id: string;
  num: string;
  name: string;
  line: string;
  kind: CardKind;
}

// the small built-in silver deck — eight arcana, one-line meanings
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
    copy: "The root of the situation — events, habits and influences already in motion before you sat down. Read it as ballast, not blame: it explains the weight, it does not assign the fault.",
    foot: "KEYWORDS: ORIGIN · INHERITANCE · UNDERTOW",
  },
  {
    n: "II",
    label: "Present",
    time: "T·0",
    title: "Where the water stands now",
    copy: "The energy around the question at this exact hour — including the parts of it you have not said out loud. This card is the actual question, beneath the one you asked.",
    foot: "KEYWORDS: CURRENT · STANCE · THE REAL ASK",
  },
  {
    n: "III",
    label: "Future",
    time: "T+1 → T+∞",
    title: "Where the current points",
    copy: "The likely trajectory if nothing changes course. A heading, not a verdict — the future card shows the water\u2019s direction, and the rudder is still in your hand.",
    foot: "KEYWORDS: TRAJECTORY · HEADING · DRIFT",
  },
];

const FAQ = [
  {
    n: "N·01",
    q: "Do I need a question before I draw?",
    a: "A question sharpens the reading but is not required. With no question, the spread defaults to your general current — what shaped this season, what defines it, where it leans. Ask silently; the deck answers the held question, not the spoken one.",
  },
  {
    n: "N·02",
    q: "Is the future card fixed?",
    a: "No. The third card shows the trajectory of the present moment — where things land if the current keeps its course. Change the present and the future card changes with it; that is the entire point of the spread.",
  },
  {
    n: "N·03",
    q: "How often should I cast the same spread?",
    a: "Once per situation per tidal cycle is the old rule — about two weeks. Re-drawing daily on the same question usually measures your anxiety, not the current. Let the water move before you read it again.",
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
      <span className="text-[7px] lpp-dim">◆</span>
      <span className="lpp-caps text-[8.5px] lpp-hi whitespace-nowrap">{title}</span>
      <span className="lpp-hair flex-1" />
      {right ? <span className="lpp-mono text-[7.5px] lpp-dim whitespace-nowrap">{right}</span> : null}
      <span className="text-[7px] lpp-dim">◆</span>
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
        <path d={b} fill="none" stroke={DIM} strokeWidth="0.5" opacity="0.55" />
        <path d={a} fill="none" stroke={STEEL} strokeWidth="0.6" opacity="0.6" />
        {Array.from({ length: 26 }, (_, i) => (
          <line key={i} x1={i * 64} y1="33" x2={i * 64} y2={i % 5 === 0 ? "27" : "30.5"} stroke={STEEL} strokeWidth="0.5" opacity="0.5" />
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
      <rect x="1" y="1" width="148" height="220" fill="#0a1020" stroke={STEEL} strokeWidth="1" />
      <rect x="6" y="6" width="138" height="210" fill="none" stroke={STEEL} strokeWidth="0.5" opacity="0.7" />
      <rect x="10" y="10" width="130" height="202" fill="none" stroke={DIM} strokeWidth="0.4" strokeDasharray="2 3" opacity="0.6" />
      {ringTicks(75, 111, 40, 46, 36, 3).map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.major ? SILVER : STEEL} strokeWidth={t.major ? 0.7 : 0.4} opacity={t.major ? 0.85 : 0.5} />
      ))}
      <circle cx="75" cy="111" r="34" fill="none" stroke={STEEL} strokeWidth="0.5" opacity="0.8" />
      <path d="M86 88 a26 26 0 1 0 0 46 a20 20 0 1 1 0 -46 Z" fill={SILVER} opacity="0.92" />
      <circle cx="75" cy="111" r="54" fill="none" stroke={STEEL} strokeWidth="0.4" strokeDasharray="1 5" opacity="0.6" className="lpp-rot-b" />
      <circle cx="48" cy="52" r="1" fill={SILVER} opacity="0.7" />
      <circle cx="108" cy="70" r="0.8" fill={SILVER} opacity="0.5" />
      <circle cx="98" cy="176" r="1" fill={SILVER} opacity="0.6" />
      <circle cx="44" cy="168" r="0.7" fill={SILVER} opacity="0.45" />
      <text x="75" y="206" textAnchor="middle" fontSize="5" fill={DIM} letterSpacing="2.5">ASTRO SCOPE</text>
    </svg>
  );
}

// mini emblem per arcana, drawn in a 110×110 zone centered on (55,55)
function Emblem({ kind }: { kind: CardKind }) {
  if (kind === "moon") {
    return (
      <g>
        {ringTicks(55, 55, 34, 39, 16, 4).map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.major ? SILVER : STEEL} strokeWidth={t.major ? 0.7 : 0.4} opacity={t.major ? 0.9 : 0.55} />
        ))}
        <circle cx="55" cy="55" r="27" fill="url(#lpp-moon-grad)" />
        <ellipse cx="68" cy="55" rx="27" ry="27.5" fill={INK} opacity="0.68" />
        <circle cx="55" cy="55" r="27" fill="none" stroke={STEEL} strokeWidth="0.6" />
        <circle cx="24" cy="26" r="1.1" fill={SILVER} opacity="0.8" />
        <circle cx="90" cy="88" r="0.9" fill={SILVER} opacity="0.6" />
      </g>
    );
  }
  if (kind === "star") {
    return (
      <g>
        <polygon points="55,16 62,44 90,55 62,66 55,94 48,66 20,55 48,44" fill="rgba(200,214,236,0.12)" stroke={SILVER} strokeWidth="0.8" />
        <polygon points="55,28 60,48 80,55 60,62 55,82 50,62 30,55 50,48" fill="none" stroke={STEEL} strokeWidth="0.4" transform="rotate(22.5 55 55)" />
        <circle cx="55" cy="55" r="7" fill="none" stroke={SILVER} strokeWidth="0.6" />
        <circle cx="55" cy="55" r="1.8" fill={SILVER} className="lpp-pulse" />
        <line x1="55" y1="4" x2="55" y2="12" stroke={STEEL} strokeWidth="0.4" strokeDasharray="1 2" />
        <line x1="55" y1="98" x2="55" y2="106" stroke={STEEL} strokeWidth="0.4" strokeDasharray="1 2" />
      </g>
    );
  }
  if (kind === "lantern") {
    return (
      <g>
        <line x1="38" y1="10" x2="38" y2="100" stroke={STEEL} strokeWidth="0.7" />
        <line x1="38" y1="30" x2="66" y2="30" stroke={STEEL} strokeWidth="0.6" />
        <line x1="66" y1="30" x2="66" y2="38" stroke={STEEL} strokeWidth="0.5" />
        <rect x="58" y="38" width="16" height="22" fill="rgba(200,214,236,0.06)" stroke={SILVER} strokeWidth="0.8" />
        <circle cx="66" cy="49" r="5.5" fill="url(#lpp-halo-grad)" className="lpp-pulse" />
        <circle cx="66" cy="49" r="2" fill={SILVER} />
        <path d="M58 62 A 26 26 0 0 0 92 72" fill="none" stroke={STEEL} strokeWidth="0.5" strokeDasharray="2 3" opacity="0.8" />
        <circle cx="30" cy="94" r="1" fill={SILVER} opacity="0.6" />
      </g>
    );
  }
  if (kind === "wheel") {
    return (
      <g>
        <circle cx="55" cy="55" r="34" fill="none" stroke={SILVER} strokeWidth="0.8" />
        <circle cx="55" cy="55" r="20" fill="none" stroke={STEEL} strokeWidth="0.5" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => {
          const p = onCircle(55, 55, 34, d);
          const q = onCircle(55, 55, 20, d);
          return <line key={d} x1={q.x} y1={q.y} x2={p.x} y2={p.y} stroke={STEEL} strokeWidth="0.5" opacity="0.8" />;
        })}
        <circle cx="55" cy="55" r="4" fill="none" stroke={SILVER} strokeWidth="0.7" />
        {[22, 142, 262].map((d) => {
          const p = onCircle(55, 55, 34, d);
          return <circle key={d} cx={p.x} cy={p.y} r="1.6" fill={SILVER} />;
        })}
        <path d="M 91 38 A 40 40 0 0 1 93 66" fill="none" stroke={STEEL} strokeWidth="0.5" strokeDasharray="2 3" opacity="0.8" />
      </g>
    );
  }
  if (kind === "sun") {
    return (
      <g>
        {ringTicks(55, 52, 30, 40, 12, 1).map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={i % 3 === 0 ? SILVER : STEEL} strokeWidth={i % 3 === 0 ? 0.8 : 0.45} opacity={i % 3 === 0 ? 0.95 : 0.6} />
        ))}
        <circle cx="55" cy="52" r="24" fill="url(#lpp-sun-grad)" stroke={SILVER} strokeWidth="0.7" />
        <circle cx="55" cy="52" r="16" fill="none" stroke={INK} strokeWidth="0.4" opacity="0.35" />
        <line x1="12" y1="92" x2="98" y2="92" stroke={STEEL} strokeWidth="0.5" />
        <line x1="20" y1="98" x2="90" y2="98" stroke={DIM} strokeWidth="0.4" strokeDasharray="3 3" />
      </g>
    );
  }
  if (kind === "veil") {
    return (
      <g>
        <rect x="16" y="18" width="9" height="72" fill="rgba(200,214,236,0.05)" stroke={SILVER} strokeWidth="0.8" />
        <rect x="85" y="18" width="9" height="72" fill="rgba(200,214,236,0.05)" stroke={SILVER} strokeWidth="0.8" />
        <line x1="12" y1="94" x2="98" y2="94" stroke={STEEL} strokeWidth="0.5" />
        <path d={sinePath(27, 83, 52, 9, 1.5, 0.6)} fill="none" stroke={STEEL} strokeWidth="0.5" opacity="0.8" />
        <path d={sinePath(27, 83, 62, 7, 1.5, 1.7)} fill="none" stroke={DIM} strokeWidth="0.4" opacity="0.7" />
        <path d="M61 36 a9 9 0 1 0 0 16 a7 7 0 1 1 0 -16 Z" fill={SILVER} opacity="0.9" />
        <circle cx="55" cy="30" r="1" fill={SILVER} opacity="0.7" />
      </g>
    );
  }
  if (kind === "fool") {
    return (
      <g>
        <polyline points="8,86 34,86 44,96 70,96 78,104" fill="none" stroke={SILVER} strokeWidth="0.8" />
        <line x1="34" y1="86" x2="30" y2="104" stroke={STEEL} strokeWidth="0.4" opacity="0.7" />
        <line x1="70" y1="96" x2="66" y2="108" stroke={STEEL} strokeWidth="0.4" opacity="0.7" />
        <circle cx="40" cy="72" r="3.4" fill="none" stroke={SILVER} strokeWidth="0.8" />
        <line x1="40" y1="75.5" x2="40" y2="86" stroke={SILVER} strokeWidth="0.8" />
        <path d="M 46 70 A 26 26 0 0 1 86 56" fill="none" stroke={STEEL} strokeWidth="0.5" strokeDasharray="2 3" opacity="0.9" />
        <polygon points="88,53 84,57 90,59" fill={SILVER} />
        <circle cx="88" cy="30" r="1.4" fill={SILVER} className="lpp-pulse" />
        <circle cx="96" cy="38" r="0.8" fill={SILVER} opacity="0.6" />
      </g>
    );
  }
  // threshold
  return (
    <g>
      <rect x="32" y="20" width="46" height="72" fill="none" stroke={SILVER} strokeWidth="0.9" />
      <rect x="38" y="26" width="34" height="66" fill="none" stroke={STEEL} strokeWidth="0.4" opacity="0.8" />
      <line x1="12" y1="92" x2="98" y2="92" stroke={STEEL} strokeWidth="0.5" />
      <path d="M 41 76 A 14 14 0 0 1 69 76 Z" fill="url(#lpp-sun-grad)" opacity="0.95" />
      <line x1="41" y1="76" x2="69" y2="76" stroke={SILVER} strokeWidth="0.6" />
      <line x1="55" y1="20" x2="55" y2="8" stroke={STEEL} strokeWidth="0.4" strokeDasharray="1 3" />
      <circle cx="55" cy="6" r="1" fill={SILVER} opacity="0.7" />
    </g>
  );
}

// the revealed card face — numeral, emblem, hairline, name, one-liner
function CardFront({ card }: { card: DeckCard }) {
  return (
    <svg viewBox="0 0 150 222" className="block h-full w-full" aria-hidden="true">
      <rect x="1" y="1" width="148" height="220" fill="#0b1220" stroke={SILVER} strokeWidth="1" />
      <rect x="6" y="6" width="138" height="210" fill="none" stroke={STEEL} strokeWidth="0.5" opacity="0.8" />
      <text x="75" y="26" textAnchor="middle" fontSize="11" fill={SILVER} letterSpacing="3" fontFamily="Georgia, serif">{card.num}</text>
      <line x1="30" y1="34" x2="120" y2="34" stroke={STEEL} strokeWidth="0.4" />
      <g transform="translate(20 44)">
        <Emblem kind={card.kind} />
      </g>
      <line x1="30" y1="166" x2="120" y2="166" stroke={STEEL} strokeWidth="0.4" />
      <text x="75" y="180" textAnchor="middle" fontSize="7" fill={SILVER} letterSpacing="1.6">{card.name.toUpperCase()}</text>
      <text x="75" y="206" textAnchor="middle" fontSize="4.6" fill={DIM} letterSpacing="1.2">SILVER DECK · REV K</text>
    </svg>
  );
}

/* ============================ BACKGROUND ART ============================== */

// faint constellation figure with a tiny engraved label
function Constellation({ className }: { className: string }) {
  const pts: Array<[number, number]> = [[16, 30], [44, 44], [70, 66], [92, 92], [118, 104], [146, 96], [168, 76], [172, 52], [160, 34]];
  return (
    <svg width="220" height="154" viewBox="0 0 200 140" className={className} aria-hidden="true">
      {pts.slice(0, -1).map((p, i) => (
        <line key={i} x1={p[0]} y1={p[1]} x2={pts[i + 1][0]} y2={pts[i + 1][1]} stroke={STEEL} strokeWidth="0.5" opacity="0.45" strokeDasharray="3 2" />
      ))}
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={i === 0 ? 1.9 : 1.1} fill={SILVER} opacity="0.7" />
          <circle cx={x} cy={y} r={i === 0 ? 4 : 2.8} fill="none" stroke={STEEL} strokeWidth="0.3" opacity="0.4" />
        </g>
      ))}
      <text x={pts[0][0]} y={pts[0][1] + 13} fontSize="5.5" fill={DIM} letterSpacing="1.5">SCORPIUS</text>
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
        <span className="text-[6px] lpp-dim">◆</span>
        <span className="lpp-caps text-[7.5px] lpp-hi">{position.label}</span>
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

  const heroTicks = ringTicks(600, 470, 268, 276, 72, 6);
  const tide = sinePath(0, 1200, 30, 18, 2.25, 0.4);
  const tideSoft = sinePath(0, 1200, 30, 14, 2.25, 1.3);
  const tideFaint = sinePath(0, 1200, 30, 22, 2.25, 2.4);

  // spread timeline: three stations at 1/6, 3/6, 5/6 of the beam
  const tlMain = sinePath(0, 1200, 70, 26, 1.5, 0.9);
  const tlGhost = sinePath(0, 1200, 70, 20, 1.5, 2.0);
  const stations = [200, 600, 1000].map((x) => ({
    x,
    // mean line crossing — cards anchor to the beam, not the crest
    y: 70,
  }));

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
    <main className="lpp-root lpp-mono min-h-screen">
      <style>{LPP_CSS}</style>

      {/* shared gradients */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <radialGradient id="lpp-moon-grad" cx="38%" cy="34%" r="80%">
            <stop offset="0%" stopColor="#dfe9f8" />
            <stop offset="55%" stopColor="#9db2d0" />
            <stop offset="100%" stopColor="#54678a" />
          </radialGradient>
          <radialGradient id="lpp-moon-big" cx="42%" cy="38%" r="80%">
            <stop offset="0%" stopColor="#dde8f9" />
            <stop offset="48%" stopColor="#9db2d1" />
            <stop offset="86%" stopColor="#576b8e" />
            <stop offset="100%" stopColor="#3b4c6b" />
          </radialGradient>
          <radialGradient id="lpp-sun-grad" cx="42%" cy="36%" r="80%">
            <stop offset="0%" stopColor="#e8effb" />
            <stop offset="60%" stopColor="#a9bcdf" />
            <stop offset="100%" stopColor="#5d7194" />
          </radialGradient>
          <radialGradient id="lpp-halo-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(190,210,240,0.55)" />
            <stop offset="70%" stopColor="rgba(150,175,215,0.12)" />
            <stop offset="100%" stopColor="rgba(150,175,215,0)" />
          </radialGradient>
          <radialGradient id="lpp-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(150,175,215,0.22)" />
            <stop offset="70%" stopColor="rgba(150,175,215,0.05)" />
            <stop offset="100%" stopColor="rgba(150,175,215,0)" />
          </radialGradient>
        </defs>
      </svg>

      {/* ======== DEEP BACKGROUND — orbit charts, phase ring, tides, stars ======== */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        {/* huge off-screen orbit chart, upper left */}
        <svg className="absolute -left-[340px] -top-[300px] opacity-50" width="1150" height="1150" viewBox="0 0 1150 1150">
          <circle cx="575" cy="575" r="380" fill="none" stroke={STEEL} strokeWidth="0.6" strokeDasharray="1 5" opacity="0.55" className="lpp-rot-b" />
          <circle cx="575" cy="575" r="470" fill="none" stroke={STEEL} strokeWidth="0.5" opacity="0.4" />
          <circle cx="575" cy="575" r="560" fill="none" stroke={STEEL} strokeWidth="0.4" strokeDasharray="2 6" opacity="0.35" className="lpp-rot-a" />
          {ringTicks(575, 575, 540, 548, 60, 5).map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={STEEL} strokeWidth="0.4" opacity="0.45" />
          ))}
          <circle cx={onCircle(575, 575, 380, 40).x} cy={onCircle(575, 575, 380, 40).y} r="9" fill="#aebfd9" opacity="0.7" />
          <circle cx={onCircle(575, 575, 470, 205).x} cy={onCircle(575, 575, 470, 205).y} r="6" fill={INK} stroke={STEEL} strokeWidth="0.6" opacity="0.8" />
          <text x={onCircle(575, 575, 470, 90).x} y={onCircle(575, 575, 470, 90).y} textAnchor="middle" fontSize="7" fill={DIM} letterSpacing="2">ORB·III</text>
        </svg>

        {/* colossal moon-phase ring bleeding off the right edge, behind the spread */}
        <svg className="absolute -right-[430px] top-[980px] opacity-60" width="1500" height="1500" viewBox="0 0 1500 1500">
          <circle cx="750" cy="750" r="640" fill="none" stroke={STEEL} strokeWidth="0.6" strokeDasharray="1 6" opacity="0.5" className="lpp-rot-b" />
          <circle cx="750" cy="750" r="560" fill="none" stroke={STEEL} strokeWidth="0.5" opacity="0.4" />
          <circle cx="750" cy="750" r="420" fill="none" stroke={STEEL} strokeWidth="0.4" strokeDasharray="2 5" opacity="0.3" className="lpp-rot-a" />
          {ringTicks(750, 750, 610, 622, 96, 8).map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.major ? SILVER : STEEL} strokeWidth="0.5" opacity={t.major ? 0.55 : 0.35} />
          ))}
          {[-0.9, -0.55, -0.2, 0.15, 0.5, 0.85, 0.35, -0.35].map((k, i) => {
            const p = onCircle(750, 750, 600, i * 45);
            return (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="17" fill="#aebfd9" opacity="0.75" />
                <ellipse cx={p.x + k * 17} cy={p.y} rx="17" ry="17.4" fill={INK} opacity="0.9" />
                <circle cx={p.x} cy={p.y} r="17" fill="none" stroke={STEEL} strokeWidth="0.5" opacity="0.7" />
              </g>
            );
          })}
          <text x="750" y="120" textAnchor="middle" fontSize="8" fill={DIM} letterSpacing="3">LUNAR CYCLE · 29.53 D</text>
        </svg>

        {/* orbit arcs bleeding off the lower left */}
        <svg className="absolute -left-[260px] bottom-[200px] opacity-40" width="900" height="900" viewBox="0 0 900 900">
          <circle cx="450" cy="450" r="330" fill="none" stroke={STEEL} strokeWidth="0.5" strokeDasharray="1 5" opacity="0.6" className="lpp-rot-a" />
          <circle cx="450" cy="450" r="420" fill="none" stroke={STEEL} strokeWidth="0.4" opacity="0.5" />
          {ringTicks(450, 450, 400, 406, 48, 6).map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={STEEL} strokeWidth="0.4" opacity="0.5" />
          ))}
        </svg>

        {/* tide hairlines crossing the whole page, through every panel */}
        <svg className="absolute inset-0 h-full w-full opacity-70" viewBox="0 0 1200 3200" preserveAspectRatio="none">
          <path d={sinePath(0, 1200, 560, 26, 1.75, 0.3)} fill="none" stroke={STEEL} strokeWidth="0.5" opacity="0.4" />
          <path d={sinePath(0, 1200, 560, 20, 1.75, 1.4)} fill="none" stroke={DIM} strokeWidth="0.4" opacity="0.4" />
          <path d={sinePath(0, 1200, 1450, 30, 2.25, 0.9)} fill="none" stroke={STEEL} strokeWidth="0.5" opacity="0.35" />
          <path d={sinePath(0, 1200, 2340, 24, 1.5, 2.1)} fill="none" stroke={STEEL} strokeWidth="0.5" opacity="0.4" />
          <path d={sinePath(0, 1200, 2980, 18, 2.0, 0.5)} fill="none" stroke={DIM} strokeWidth="0.4" opacity="0.4" />
          <line x1="120" y1="0" x2="120" y2="3200" stroke={STEEL} strokeWidth="0.3" strokeDasharray="1 8" opacity="0.35" />
          <line x1="1080" y1="0" x2="1080" y2="3200" stroke={STEEL} strokeWidth="0.3" strokeDasharray="1 8" opacity="0.35" />
        </svg>

        {/* star specks over the whole scroll */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 3200" preserveAspectRatio="none">
          {Array.from({ length: 90 }, (_, i) => (
            <circle
              key={i}
              cx={(i * 173 + 41) % 1200}
              cy={(i * 389 + 97) % 3200}
              r={0.5 + (i % 3) * 0.35}
              fill={SILVER}
              opacity={0.1 + (i % 5) * 0.05}
            />
          ))}
        </svg>

        {/* faint constellation figure behind the lower panels */}
        <Constellation className="absolute left-[1.5%] top-[2380px] opacity-50" />
      </div>

      {/* ======== WEATHERING — night atmosphere, dust, mist, vignette ======== */}
      <div className="lpp-vignette pointer-events-none fixed inset-0 z-30" aria-hidden="true" />
      <div className="lpp-dust pointer-events-none fixed inset-0 z-30" aria-hidden="true" />
      <div className="lpp-mist lpp-mist-a pointer-events-none absolute z-20" aria-hidden="true" />
      <div className="lpp-mist lpp-mist-b pointer-events-none absolute z-20" aria-hidden="true" />
      <div className="lpp-mist lpp-mist-c pointer-events-none absolute z-20" aria-hidden="true" />

      {/* ============================== TOP BAR ============================== */}
      <header className="lpp-panel relative z-20 mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-5 gap-y-1 border-x border-b px-4 py-2">
        <a href="/" className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" className="lpp-rot-a">
            <circle cx="11" cy="11" r="9.5" fill="none" stroke={STEEL} strokeWidth="0.6" opacity="0.8" />
            <path d="M14 4.5 a7.5 7.5 0 1 0 0 13 a5.8 5.8 0 1 1 0 -13 Z" fill={SILVER} opacity="0.9" />
          </svg>
          <span className="lpp-caps lpp-serif text-[11px] lpp-hi tracking-[0.3em]">Astro Scope</span>
        </a>
        <span className="lpp-mono hidden text-[6.5px] lpp-dim md:inline">TAROT INSTRUMENT · SPREAD LIBRARY</span>
        <span className="flex-1" />
        <nav className="flex items-center gap-4 text-[8.5px] lpp-caps lpp-mid">
          <a href="/tarot" className="lpp-link">Tarot</a>
          <a href="/horoscope" className="lpp-link">Horoscopes</a>
          <a href="/compatibility" className="lpp-link">Compatibility</a>
        </nav>
        <span className="lpp-vhair hidden sm:block" />
        <a href="/sign-in" className="lpp-caps lpp-link text-[8.5px] lpp-mid">Sign In</a>
      </header>

      {/* ================================ HERO =============================== */}
      <section className="lpp-panel relative z-10 overflow-hidden border-b">
        {/* the moon falling off the top-right corner */}
        <svg
          viewBox="0 0 1200 620"
          preserveAspectRatio="xMidYMax slice"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {/* moon assembly — shoved into the upper-right corner so more than
              a third of the disc leaves the plate entirely */}
          <g transform="translate(430 -190)">
            <circle cx="600" cy="470" r="360" fill="url(#lpp-halo)" className="lpp-pulse" />
            <circle cx="600" cy="470" r="268" fill="none" stroke={STEEL} strokeWidth="0.5" opacity="0.45" />
            <circle cx="600" cy="470" r="288" fill="none" stroke={STEEL} strokeWidth="0.4" strokeDasharray="1 5" opacity="0.4" className="lpp-rot-b" />
            {heroTicks.map((t, i) => (
              <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.major ? SILVER : STEEL} strokeWidth={t.major ? 0.7 : 0.4} opacity={t.major ? 0.6 : 0.35} />
            ))}
            {[0, 30, 60, 90, 120, 150].map((d) => {
              const p = onCircle(600, 470, 296, d - 90);
              return (
                <text key={d} x={p.x} y={p.y + 2} textAnchor="middle" fontSize="6.5" fill={DIM}>
                  {String(d).padStart(3, "0")}°
                </text>
              );
            })}
            <circle cx="600" cy="470" r="240" fill="url(#lpp-moon-big)" />
            <g fill="#415270" opacity="0.5">
              <ellipse cx="530" cy="380" rx="62" ry="44" transform="rotate(-16 530 380)" />
              <ellipse cx="640" cy="440" rx="40" ry="62" transform="rotate(10 640 440)" />
              <ellipse cx="512" cy="500" rx="36" ry="26" />
              <ellipse cx="618" cy="330" rx="30" ry="22" />
              <ellipse cx="700" cy="520" rx="34" ry="24" transform="rotate(-24 700 520)" />
            </g>
            <g fill="none" stroke="#4a5c78" strokeWidth="0.7" opacity="0.55">
              <circle cx="560" cy="430" r="13" />
              <circle cx="560" cy="430" r="7" />
              <circle cx="668" cy="386" r="9" />
              <circle cx="500" cy="466" r="10" />
              <circle cx="636" cy="508" r="12" />
            </g>
            <ellipse cx="760" cy="340" rx="240" ry="244" fill={INK} opacity="0.18" />
            <ellipse cx="470" cy="470" rx="200" ry="235" fill={INK} opacity="0.3" />
            <circle cx="600" cy="470" r="240" fill="none" stroke={SILVER} strokeWidth="0.8" opacity="0.5" />
          </g>
          <line x1="0" y1="620" x2="1200" y2="620" stroke={STEEL} strokeWidth="0.5" opacity="0.6" />
        </svg>

        {/* contrast scrim behind the text column */}
        <div className="lpp-hero-scrim pointer-events-none absolute inset-0" aria-hidden="true" />

        {/* hero copy — deliberately off-center, last line kicked right */}
        <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 gap-6 px-5 pb-24 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-12">
          {/* left micro-column */}
          <div className="hidden flex-col gap-2 self-start border-l border-[rgba(125,148,184,0.25)] pl-3 lg:col-span-2 lg:flex">
            <span className="lpp-caps text-[7px] lpp-dim">Spread Log</span>
            <span className="lpp-mono text-[8px] lpp-mid">N·03 — TIDAL TIMELINE</span>
            <span className="lpp-mono text-[7px] lpp-dim">3 POSITIONS · 8 CARDS</span>
            <span className="lpp-hair my-1 w-14" />
            <span className="lpp-mono text-[6.5px] leading-[1.7] lpp-dim">
              DRAW &lt; 3 S<br />NO ACCOUNT<br />NO SPREAD LIMIT<br />RESET ANY TIME
            </span>
            <span className="lpp-hair my-1 w-14" />
            <span className="lpp-mono text-[6.5px] leading-[1.7] lpp-dim">
              STATION I — PAST<br />STATION II — PRESENT<br />STATION III — FUTURE
            </span>
          </div>

          {/* headline block */}
          <div className="lg:col-span-7 lg:col-start-3">
            <div className="lpp-caps text-[8px] lpp-mid">◆ Tarot Instrument — Spread N·03 ◆</div>
            <h1 className="lpp-serif lpp-glow mt-4 max-w-[640px] text-[34px] leading-[1.12] lpp-hi sm:text-[46px] lg:text-[54px]">
              Past is ballast.<br />
              Present is water.<br />
              <span className="italic lg:pl-20">Future is heading.</span>
            </h1>
            <p className="mt-5 max-w-[460px] text-[11px] leading-[1.75] lpp-mid lg:ml-10">
              The oldest spread in the book: three cards laid on one current.
              What the tide carried in, where the water stands, and where it
              points next. Draw below — the deck is already shuffled.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a href="#lpp-spread" className="lpp-btn lpp-caps px-6 py-2.5 text-[9.5px]">
                Cast the three cards
              </a>
              <a href="/tarot" className="lpp-caps lpp-link text-[9px] lpp-hi">
                {"All spreads →"}
              </a>
            </div>
            <div className="lpp-mono mt-4 text-[6.5px] lpp-dim">
              FREE · NO ACCOUNT · RE-DRAW UNTIL THE CURRENT MAKES SENSE
            </div>
          </div>

          {/* right readout column */}
          <div className="hidden flex-col items-end gap-2 self-start text-right lg:col-span-3 lg:flex">
            <span className="lpp-caps text-[7px] lpp-dim">Fig. 01 — The Triple Draw</span>
            <div className="lpp-mono text-[7px] leading-[1.8] lpp-dim">
              POSITIONS 03<br />
              DECK 08 ARCANA<br />
              COMBINATIONS 336<br />
              REVEAL ΔT 0.75 S
            </div>
            <span className="lpp-hair my-1 w-16" />
            <div className="lpp-mono text-[7px] leading-[1.8] lpp-mid">
              {MOON_G} +68 · {NEPTUNE_G} +55<br />{SATURN_G} −12 · {SCORPIO_G} 8TH H
            </div>
          </div>
        </div>

        {/* tidal wave gauge along the hero's bottom edge */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="lpp-mono flex justify-between px-4 pb-1 text-[6px] lpp-dim">
            <span>TIDE GAUGE · HARMONIC M2</span>
            <span>PAST</span>
            <span>PRESENT</span>
            <span>FUTURE</span>
          </div>
          <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="block h-[60px] w-full" aria-hidden="true">
            <path d={tideFaint} fill="none" stroke={DIM} strokeWidth="0.5" opacity="0.6" />
            <path d={tideSoft} fill="none" stroke={STEEL} strokeWidth="0.6" opacity="0.7" />
            <path d={tide} fill="none" stroke={SILVER} strokeWidth="0.8" opacity="0.9" />
            <line x1="0" y1="30" x2="1200" y2="30" stroke={STEEL} strokeWidth="0.3" strokeDasharray="1 6" opacity="0.5" />
            {Array.from({ length: 25 }, (_, i) => (
              <line key={i} x1={i * 50} y1="54" x2={i * 50} y2={i % 6 === 0 ? "46" : "50"} stroke={STEEL} strokeWidth="0.5" opacity="0.6" />
            ))}
            {[200, 600, 1000].map((x) => (
              <circle key={x} cx={x} cy="30" r="2.2" fill={SILVER} opacity="0.9" />
            ))}
          </svg>
        </div>
      </section>

      {/* ========================== CAST STATUS STRIP ========================== */}
      <section className="lpp-panel lpp-tilt-a relative z-20 mx-auto -mt-7 grid max-w-[1240px] grid-cols-2 border-x border-b sm:grid-cols-3 lg:-translate-x-3 lg:grid-cols-6">
        <span className="lpp-stain lpp-stain-a" aria-hidden="true" />
        {[
          { label: "Spread", value: "3-CARD", unit: "", foot: "PAST · PRESENT · FUTURE", small: true },
          { label: "Deck", value: "8", unit: " arcana", foot: "SILVER LIBRARY · REV K" },
          { label: "Draw Time", value: "< 3", unit: " s", foot: "STAGGERED REVEAL 0.75 S" },
          { label: "Moon Tonight", value: `${MOON_G} 68.2`, unit: "%", foot: "WANING GIBBOUS · AGE 20.6 D" },
          { label: "Veil Index", value: "0.91", unit: "", foot: "STILL AIR · GOOD WATER" },
          { label: "Cost", value: "FREE", unit: "", foot: "NO CARD · NO ACCOUNT", small: true },
        ].map((cell) => (
          <div key={cell.label} className="border-r border-[rgba(125,148,184,0.14)] px-3 py-2.5 last:border-r-0">
            <div className="lpp-caps text-[6.5px] lpp-dim">{cell.label}</div>
            <div className={`mt-1 leading-none lpp-hi ${cell.small ? "lpp-mono text-[13px]" : "lpp-serif text-[19px]"}`}>
              {cell.value}
              {cell.unit ? <span className="text-[9px] lpp-mid">{cell.unit}</span> : null}
            </div>
            <div className="lpp-mono mt-1.5 text-[5.5px] lpp-dim">{cell.foot}</div>
          </div>
        ))}
      </section>

      {/* ==================== THE SPREAD — TIDAL TIMELINE ==================== */}
      <TideDivider phase={0.7} />
      <section id="lpp-spread" className="lpp-panel relative z-10 max-w-[1180px] border-x border-b lg:ml-[4%] lg:translate-x-0">
        <span className="lpp-stain lpp-stain-b" aria-hidden="true" />
        <PHead title="The Spread — Three Stations on One Current" right="SILVER DECK · 8 ARCANA · DRAW WITHOUT REPLACEMENT" />

        <div className="relative px-4 pb-6 sm:px-8">
          {/* the tide beam the three stations hang on (desktop) */}
          <svg
            viewBox="0 0 1200 130"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 top-[270px] hidden h-[130px] w-full lg:block"
            aria-hidden="true"
          >
            <path d={tlGhost} fill="none" stroke={DIM} strokeWidth="0.5" opacity="0.6" />
            <path d={tlMain} fill="none" stroke={STEEL} strokeWidth="0.8" opacity="0.85" />
            {Array.from({ length: 49 }, (_, i) => (
              <line key={i} x1={i * 25} y1="122" x2={i * 25} y2={i % 6 === 0 ? "112" : "117"} stroke={STEEL} strokeWidth="0.5" opacity="0.55" />
            ))}
            {stations.map((s, i) => (
              <g key={i}>
                <circle cx={s.x} cy={s.y} r="3" fill={SILVER} />
                <circle cx={s.x} cy={s.y} r="7" fill="none" stroke={STEEL} strokeWidth="0.4" strokeDasharray="2 2" opacity="0.8" />
                <line x1={s.x} y1={s.y - 7} x2={s.x} y2={s.y - 60} stroke={STEEL} strokeWidth="0.4" strokeDasharray="2 3" opacity="0.7" />
                <text x={s.x + 12} y={s.y + 3} fontSize="7" fill={DIM} letterSpacing="2">
                  {["T−1", "T·0", "T+1"][i]}
                </text>
              </g>
            ))}
            <text x="8" y="18" fontSize="6" fill={DIM} letterSpacing="2">MEAN WATER · STATION BEAM 03</text>
            <text x="1120" y="18" fontSize="6" fill={DIM} letterSpacing="2">DRIFT →</text>
          </svg>

          {/* cards — stacked on mobile, broken across the beam on desktop */}
          <div className="relative flex flex-col items-center gap-10 pt-6 lg:block lg:h-[430px]">
            <SpreadCard
              index={0}
              position={POSITIONS[0]}
              card={cards[0]}
              up={draw !== null && (revealed[0] || autoReveal)}
              delay={autoReveal && !revealed[0] ? 0 : 0}
              onToggle={() => toggleCard(0)}
              captionSide="left"
              className="lpp-tilt-c lg:absolute lg:left-[7%] lg:top-[6px]"
            />
            <SpreadCard
              index={1}
              position={POSITIONS[1]}
              card={cards[1]}
              up={draw !== null && (revealed[1] || autoReveal)}
              delay={autoReveal && !revealed[1] ? 750 : 0}
              onToggle={() => toggleCard(1)}
              captionSide="right"
              className="lpp-tilt-b lg:absolute lg:left-1/2 lg:top-[58px] lg:-translate-x-1/2"
            />
            <SpreadCard
              index={2}
              position={POSITIONS[2]}
              card={cards[2]}
              up={draw !== null && (revealed[2] || autoReveal)}
              delay={autoReveal && !revealed[2] ? 1500 : 0}
              onToggle={() => toggleCard(2)}
              captionSide="left"
              className="lpp-tilt-d lg:absolute lg:right-[7%] lg:top-[0px]"
            />
          </div>

          {/* cast controls + readout */}
          <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-[rgba(125,148,184,0.14)] pt-4">
            <button type="button" onClick={cast} className="lpp-btn lpp-caps px-6 py-2.5 text-[9px]">
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
              CASTS THIS SESSION: {String(casts).padStart(2, "0")}
            </div>
          </div>

          {/* synthesized reading, fades in behind the last flip */}
          <div className={`mt-3 border border-[rgba(125,148,184,0.18)] bg-[rgba(10,16,28,.5)] px-4 py-3 ${allUp ? "lpp-fade-late" : "hidden"}`}>
            {draw !== null && cards[0] && cards[1] && cards[2] ? (
              <>
                <div className="lpp-mono text-[6px] lpp-dim">
                  {`CAST ${String(casts).padStart(2, "0")} · PAST ${cards[0].num} ${cards[0].name.toUpperCase()} → PRESENT ${cards[1].num} ${cards[1].name.toUpperCase()} → FUTURE ${cards[2].num} ${cards[2].name.toUpperCase()}`}
                </div>
                <p className="lpp-serif mt-2 text-[13px] italic leading-relaxed lpp-hi sm:text-[15px]">
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

      {/* ===================== READING THE THREE POSITIONS ===================== */}
      <TideDivider phase={2.1} />
      <section className="lpp-panel lpp-tilt-b relative z-20 mx-auto -mt-4 max-w-[1120px] border-x border-b lg:ml-auto lg:mr-[4%]">
        <span className="lpp-stain lpp-stain-c" aria-hidden="true" />
        <PHead title="Reading the Three Positions" right="SECTION 02 · STATIONS I–III" />
        <div className="grid grid-cols-1 gap-px bg-[rgba(125,148,184,0.14)] lg:grid-cols-3">
          {POSITIONS.map((p, i) => (
            <article key={p.n} className={`lpp-plate relative bg-[#080d18] p-4 ${i === 1 ? "lg:translate-y-3" : ""} ${i === 2 ? "lg:-translate-y-1" : ""}`}>
              <div className="flex items-center gap-2">
                <span className="lpp-serif text-[16px] leading-none lpp-hi">{p.n}</span>
                <span className="lpp-hair w-8" />
                <span className="lpp-caps text-[8px] lpp-hi">{p.label}</span>
                <span className="flex-1" />
                <span className="lpp-mono text-[6px] lpp-dim">{p.time}</span>
              </div>
              {/* tiny station diagram */}
              <svg width="100%" height="46" viewBox="0 0 260 46" className="mt-3" aria-hidden="true">
                <path d={sinePath(0, 260, 24, 9, 1.5, 0.9)} fill="none" stroke={STEEL} strokeWidth="0.6" opacity="0.8" />
                <line x1="0" y1="24" x2="260" y2="24" stroke={DIM} strokeWidth="0.4" strokeDasharray="1 5" opacity="0.7" />
                <circle cx={[52, 130, 208][i]} cy="24" r="3" fill={SILVER} />
                <circle cx={[52, 130, 208][i]} cy="24" r="6.5" fill="none" stroke={STEEL} strokeWidth="0.4" strokeDasharray="2 2" />
                {i === 0 ? <text x="10" y="12" fontSize="6" fill={DIM} letterSpacing="1.5">← DRIFT</text> : null}
                {i === 1 ? <text x="112" y="12" fontSize="6" fill={DIM} letterSpacing="1.5">YOU · HERE</text> : null}
                {i === 2 ? <text x="196" y="12" fontSize="6" fill={DIM} letterSpacing="1.5">DRIFT →</text> : null}
              </svg>
              <h3 className="lpp-serif mt-3 text-[15px] leading-snug lpp-hi">{p.title}</h3>
              <span className="lpp-hair mt-2 block w-16" />
              <p className="mt-2 text-[9.5px] leading-[1.65] lpp-mid">{p.copy}</p>
              <div className="lpp-mono mt-3 border-t border-[rgba(125,148,184,0.14)] pt-1.5 text-[5.5px] lpp-dim">
                {p.foot}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ============================ ANALYSIS NOTES ============================ */}
      <TideDivider phase={1.4} />
      <section className="lpp-panel lpp-tilt-a relative z-20 max-w-[1100px] border-x border-b lg:ml-[6%]">
        <PHead title="Analysis Notes — Frequently Logged Queries" right="3 ENTRIES" />
        <div className="grid grid-cols-1 gap-x-6 px-5 pb-3 sm:px-8">
          {FAQ.map((f) => (
            <div key={f.n} className="border-b border-[rgba(125,148,184,0.14)] py-3 last:border-b-0">
              <div className="flex items-baseline gap-2">
                <span className="lpp-mono shrink-0 text-[7px] lpp-dim">{f.n}</span>
                <span className="lpp-caps text-[8.5px] lpp-hi">{f.q}</span>
              </div>
              <p className="mt-1.5 pl-[38px] text-[9px] leading-[1.65] lpp-mid">{f.a}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-[rgba(125,148,184,0.18)] px-5 py-1.5 lpp-mono text-[6.5px] lpp-dim sm:px-8">
          LOG CONTINUES AT /SUPPORT · RESPONSE LATENCY &lt; 1 TIDAL CYCLE
        </div>
      </section>

      {/* ================================ CTA ================================ */}
      <section className="lpp-panel relative z-10 -mt-5 overflow-hidden border-b px-5 py-12 text-center sm:py-16">
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-40" aria-hidden="true" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 220">
          <circle cx="600" cy="110" r="90" fill="url(#lpp-halo)" className="lpp-pulse" />
          <circle cx="600" cy="110" r="80" fill="none" stroke={STEEL} strokeWidth="0.4" strokeDasharray="2 4" className="lpp-rot-a" />
          <circle cx="600" cy="110" r="126" fill="none" stroke={STEEL} strokeWidth="0.3" strokeDasharray="1 5" className="lpp-rot-b" />
          {ringTicks(600, 110, 148, 154, 48, 4).map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={STEEL} strokeWidth="0.4" opacity="0.6" />
          ))}
          <line x1="0" y1="110" x2="430" y2="110" stroke={STEEL} strokeWidth="0.3" opacity="0.5" />
          <line x1="770" y1="110" x2="1200" y2="110" stroke={STEEL} strokeWidth="0.3" opacity="0.5" />
        </svg>
        <div className="relative">
          <div className="lpp-caps text-[7.5px] lpp-dim">— Final Reading —</div>
          <p className="lpp-serif lpp-glow mx-auto mt-3 max-w-[600px] text-[22px] leading-snug lpp-hi sm:text-[28px]">
            The tide is already moving. Read your three.
          </p>
          <a href="#lpp-spread" className="lpp-btn lpp-caps mt-6 inline-block px-8 py-2.5 text-[10px]">
            Cast the spread — free
          </a>
          <div className="lpp-mono mt-4 text-[7px] lpp-dim">
            NO ACCOUNT · NO SPREAD LIMIT · THE DECK KEEPS NO LEDGER OF YOU
          </div>
        </div>
      </section>

      {/* =============================== FOOTER =============================== */}
      <footer className="lpp-panel relative z-10 mx-auto mb-0 flex max-w-[1240px] flex-wrap items-center gap-x-5 gap-y-1 border-x border-b px-4 py-2.5">
        <span className="lpp-stain lpp-stain-d" aria-hidden="true" />
        <span className="flex items-center gap-1.5">
          <span className="text-[10px] lpp-hi">{MOON_G}</span>
          <span className="lpp-caps lpp-serif text-[9px] tracking-[0.24em] lpp-hi">Astro Scope</span>
        </span>
        <span className="lpp-mono text-[6.5px] lpp-dim">TAROT INSTRUMENT · SPREAD N·03 · PLATE REV K</span>
        <span className="flex-1" />
        {[
          ["Tarot", "/tarot"],
          ["Horoscopes", "/horoscope"],
          ["Compatibility", "/compatibility"],
          ["Cosmic Passport", "/passport"],
        ].map(([label, href]) => (
          <a key={href} href={href} className="lpp-caps lpp-link text-[6.5px] lpp-dim">
            {label}
          </a>
        ))}
        <span className="lpp-mono text-[6.5px] lpp-dim">© 2026 · READINGS FOR ENTERTAINMENT + REFLECTION</span>
      </footer>
    </main>
  );
}

/* ============================ SCOPED STYLES =============================== */

const LPP_CSS = `
.lpp-root{
  position:relative;
  overflow:hidden;
  background:#060a12;
  color:#c8d6ec;
  font-size:11px;
  background-image:
    radial-gradient(1px 1px at 12% 22%, rgba(200,214,236,.28) 50%, transparent 51%),
    radial-gradient(1px 1px at 68% 8%, rgba(200,214,236,.22) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 84% 34%, rgba(200,214,236,.18) 50%, transparent 51%),
    radial-gradient(1px 1px at 38% 64%, rgba(200,214,236,.2) 50%, transparent 51%),
    radial-gradient(1px 1px at 92% 78%, rgba(200,214,236,.24) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 24% 88%, rgba(200,214,236,.16) 50%, transparent 51%),
    radial-gradient(1px 1px at 54% 44%, rgba(200,214,236,.14) 50%, transparent 51%),
    radial-gradient(1px 1px at 4% 52%, rgba(200,214,236,.22) 50%, transparent 51%),
    radial-gradient(ellipse 90% 60% at 50% 0%, rgba(30,44,72,.35), transparent 70%),
    linear-gradient(180deg, #070c16 0%, #060a12 40%, #050810 100%);
}
.lpp-serif{ font-family: Georgia, 'Times New Roman', serif; }
.lpp-mono{ font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace; }
.lpp-caps{ text-transform:uppercase; letter-spacing:.22em; }
.lpp-hi{ color:#c8d6ec; }
.lpp-mid{ color:#8ea3c2; }
.lpp-dim{ color:#4a5c78; }
.lpp-glow{ text-shadow:0 0 14px rgba(160,190,230,.38), 0 0 40px rgba(120,150,200,.16); }
.lpp-panel{
  border-top:1px solid transparent;
  border-color:rgba(125,148,184,.24);
  background:linear-gradient(180deg, rgba(17,25,42,.55), rgba(7,11,20,.78));
  box-shadow: inset 0 0 0 1px rgba(200,214,236,.045), inset 0 0 40px rgba(10,16,30,.45);
  border-style:solid; border-width:0 1px 1px 1px;
}
.lpp-hair{
  height:1px;
  background:
    repeating-linear-gradient(90deg, transparent 0 13px, rgba(6,10,18,.85) 13px 13.7px, transparent 13.7px 29px, rgba(6,10,18,.55) 29px 29.4px, transparent 29.4px 47px),
    linear-gradient(90deg, transparent, rgba(125,148,184,.45) 20%, rgba(125,148,184,.45) 80%, transparent);
}
.lpp-vhair{ width:1px; height:14px; background:rgba(125,148,184,.35); }
.lpp-btn{
  border:1px solid rgba(200,214,236,.55);
  color:#e2eafa;
  background:linear-gradient(180deg, rgba(60,80,116,.5), rgba(20,30,52,.7));
  box-shadow: inset 0 0 0 1px rgba(200,214,236,.12), 0 0 14px rgba(120,150,200,.18);
  letter-spacing:.22em;
  transition: box-shadow .3s ease, background .3s ease;
}
.lpp-btn:hover{
  background:linear-gradient(180deg, rgba(90,116,160,.55), rgba(34,48,78,.75));
  box-shadow: inset 0 0 0 1px rgba(200,214,236,.2), 0 0 26px rgba(140,172,220,.4);
}
.lpp-link{ transition: color .25s ease, text-shadow .25s ease; }
.lpp-link:hover{ color:#e6eefb; text-shadow:0 0 10px rgba(160,190,230,.5); }
.lpp-plate{ transition: box-shadow .3s ease, background .3s ease; }
.lpp-plate:hover{ background:#0b1220; box-shadow: inset 0 0 0 1px rgba(200,214,236,.14), inset 0 0 30px rgba(20,32,56,.5); }
.lpp-hero-scrim{
  background:
    linear-gradient(90deg, rgba(6,10,18,.94) 0%, rgba(6,10,18,.82) 28%, rgba(6,10,18,.45) 50%, rgba(6,10,18,0) 70%),
    linear-gradient(0deg, rgba(6,10,18,.55) 0%, rgba(6,10,18,0) 26%);
}
/* slight panel rotations — hand-set plates, not laser-aligned */
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
  outline: 1px solid rgba(200,214,236,.7);
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
  filter: drop-shadow(0 10px 18px rgba(2,4,9,.6));
}
.lpp-front{ transform: rotateY(180deg); }
.lpp-chip{
  position: relative;
  z-index: 2;
  background: #060a12;
  border: 1px solid rgba(125,148,184,.35);
  box-shadow: 0 0 10px rgba(2,4,9,.7);
}

/* ---------------- weathering ---------------- */
.lpp-vignette{
  background:
    radial-gradient(ellipse 70% 55% at 72% 10%, rgba(170,198,236,.07), transparent 60%),
    radial-gradient(ellipse 130% 95% at 46% 42%, transparent 52%, rgba(2,4,9,.58) 100%),
    linear-gradient(180deg, rgba(10,16,30,.14), transparent 28%, transparent 68%, rgba(2,4,9,.38));
}
.lpp-dust{
  opacity:.05;
  mix-blend-mode:screen;
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)'/%3E%3C/svg%3E"),
    repeating-linear-gradient(103deg, transparent 0 46px, rgba(200,214,236,.5) 46px 46.4px, transparent 46.4px 97px);
}
.lpp-mist{
  border-radius:50%;
  filter:blur(18px);
  background:radial-gradient(ellipse at center, rgba(160,185,220,.10), rgba(160,185,220,.04) 45%, transparent 70%);
}
.lpp-mist-a{ width:55vw; height:34vh; top:5%; left:-10%; }
.lpp-mist-b{ width:48vw; height:30vh; top:46%; right:-14%; }
.lpp-mist-c{ width:62vw; height:26vh; bottom:3%; left:10%; }
.lpp-stain{
  position:absolute;
  pointer-events:none;
  border-radius:50%;
  background:
    radial-gradient(circle at 50% 50%, transparent 56%, rgba(190,205,228,.10) 61%, rgba(190,205,228,.03) 65%, transparent 69%),
    radial-gradient(circle at 50% 50%, transparent 70%, rgba(190,205,228,.07) 74%, transparent 78%),
    radial-gradient(circle at 38% 42%, rgba(190,205,228,.05), transparent 34%);
}
.lpp-stain-a{ width:190px; height:130px; top:-30px; right:8%; transform:rotate(-8deg); }
.lpp-stain-b{ width:240px; height:150px; bottom:-34px; left:4%; transform:rotate(5deg); }
.lpp-stain-c{ width:170px; height:170px; top:6px; right:22%; transform:rotate(14deg); }
.lpp-stain-d{ width:120px; height:80px; top:-16px; left:36%; transform:rotate(-4deg); }

@keyframes lpp-rot{ to{ transform: rotate(360deg); } }
@keyframes lpp-pulse{ 0%,100%{ opacity:.55; } 50%{ opacity:1; } }
@keyframes lpp-drift{ 0%,100%{ transform: translateY(0); } 50%{ transform: translateY(-6px); } }
@keyframes lpp-mist-a{ 0%,100%{ transform: translate(0,0); } 50%{ transform: translate(7vw,2.5vh); } }
@keyframes lpp-mist-b{ 0%,100%{ transform: translate(0,0); } 50%{ transform: translate(-6vw,-2vh); } }
@keyframes lpp-mist-c{ 0%,100%{ transform: translate(0,0); } 50%{ transform: translate(5vw,-1.5vh); } }
@keyframes lpp-fade{ from{ opacity:0; transform: translateY(6px); } to{ opacity:1; transform: translateY(0); } }

@media (prefers-reduced-motion: no-preference){
  .lpp-rot-a{ animation: lpp-rot 180s linear infinite; transform-box: view-box; transform-origin: center; }
  .lpp-rot-b{ animation: lpp-rot 120s linear infinite reverse; transform-box: view-box; transform-origin: center; }
  .lpp-pulse{ animation: lpp-pulse 16s ease-in-out infinite; }
  .lpp-drift{ animation: lpp-drift 60s ease-in-out infinite; }
  .lpp-mist-a{ animation: lpp-mist-a 170s ease-in-out infinite; }
  .lpp-mist-b{ animation: lpp-mist-b 190s ease-in-out infinite; }
  .lpp-mist-c{ animation: lpp-mist-c 150s ease-in-out infinite; }
  .lpp-fade-late{ animation: lpp-fade .9s ease 2.4s both; }
}
@media (prefers-reduced-motion: reduce){
  .lpp-rot-a,.lpp-rot-b,.lpp-pulse,.lpp-drift,.lpp-mist-a,.lpp-mist-b,.lpp-mist-c{ animation: none; }
  .lpp-flip{ transition: none; }
}
`;
