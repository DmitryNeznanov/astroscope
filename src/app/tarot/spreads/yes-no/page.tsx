"use client";

/* YES/NO ORACLE — tool page in the PRODUCTION palette (see lab/remix-v2).
   Structure: compact header + tarot tab bar, the working seal/verdict oracle
   immediately at the top of the viewport, condensed precepts and FAQ below.
   Broken layout + magic background: fixed counter-rotating wheels half
   off-screen, hairline construction lines, star specks, drifting giant
   glyphs; translucent panels let the machinery pass visibly behind them.
   Self-contained: inline SVG + Tailwind + one scoped <style> block (lyn-).
   All motion CSS-only, guarded by prefers-reduced-motion. */

import Link from "next/link";
import { useCallback, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Production palette (lifted from the live stylesheets)               */
/* ------------------------------------------------------------------ */
const GOLD = "#f3c77a";
const GOLD_DEEP = "#c9a227";
const CREAM = "#ffdd9c";
const VIOLET = "#a25adf";
const VIOLET_SOFT = "#b794f6";
const TEXT_HI = "#e9e6f2";
const TEXT_LO = "#b7b1cc";

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                    */
/* ------------------------------------------------------------------ */
const DEG = Math.PI / 180;
const onCircle = (cx: number, cy: number, r: number, deg: number) => {
  const t = (deg - 90) * DEG;
  return { x: +(cx + r * Math.cos(t)).toFixed(1), y: +(cy + r * Math.sin(t)).toFixed(1) };
};
const polyPts = (cx: number, cy: number, r: number, n: number, start: number) =>
  Array.from({ length: n }, (_, i) => {
    const p = onCircle(cx, cy, r, start + (360 / n) * i);
    return `${p.x},${p.y}`;
  }).join(" ");

// glyphs carry U+FE0E so they render as text, never emoji
const FE = "︎";

/* ------------------------------------------------------------------ */
/* Cross-nav: the seven tarot leaves                                   */
/* ------------------------------------------------------------------ */
const TAROT_TABS = [
  { href: "/tarot", label: "Tarot" },
  { href: "/tarot/spreads/daily-card", label: "Daily Card" },
  { href: "/tarot/spreads/yes-no", label: "Yes / No" },
  { href: "/tarot/spreads/past-present-future", label: "Past · Present · Future" },
  { href: "/tarot/spreads/love-three-card", label: "Love" },
  { href: "/tarot/birth-arcana", label: "Birth Arcana" },
  { href: "/tarot/cards", label: "All Cards" },
];
const ACTIVE_TAB = "/tarot/spreads/yes-no";

/* ------------------------------------------------------------------ */
/* Oracle data                                                         */
/* ------------------------------------------------------------------ */
type VerdictKey = "YES" | "NO" | "AGAIN";

interface Verdict {
  key: VerdictKey;
  word: string;
  latin: string;
  color: string;
  counsel: string;
}

const COUNSEL: Record<VerdictKey, string[]> = {
  YES: [
    "The beam falls upright — proceed while the hour is warm.",
    "The card nods once; do not make it nod twice.",
    "What you asked is already half done. Finish it.",
    "The gate is open; the walking is yours.",
    "Assent is written in the margin. Act before the ink fades.",
  ],
  NO: [
    "The beam is crossed — not this path, not this hour.",
    "The card withholds; forcing it will cost double.",
    "What you ask for would answer you with silence later.",
    "The seal says nay. Close this folio, open another.",
    "Refusal is also counsel. Step around, not through.",
  ],
  AGAIN: [
    "The beam wavers — the question is not yet a question.",
    "The card turned sideways; sharpen what you truly ask.",
    "Two answers quarrel under one seal. Divide them.",
    "The hour is wrong, or the words are. Mend one, return.",
  ],
};

/* weighted: YES 42 · NO 42 · ASK AGAIN 16 — the deck's temper */
function drawVerdict(): Verdict {
  const r = Math.random();
  const key: VerdictKey = r < 0.42 ? "YES" : r < 0.84 ? "NO" : "AGAIN";
  const pool = COUNSEL[key];
  const counsel = pool[Math.floor(Math.random() * pool.length)];
  if (key === "YES")
    return { key, word: "YES", latin: "ITA VERO", color: GOLD, counsel };
  if (key === "NO")
    return { key, word: "NO", latin: "MINIME", color: VIOLET, counsel };
  return { key, word: "ASK AGAIN", latin: "ITERVM ROGA", color: TEXT_LO, counsel };
}

const PRECEPTS = [
  {
    no: "I",
    title: "One question, one seal",
    copy: "The oracle answers a single point of doubt; everything else is noise in the beam.",
  },
  {
    no: "II",
    title: "Phrase it so a yes can land",
    copy: "Ask \u201Cshould I take the post?\u201D, not \u201Cwhat of my future?\u201D. Make the question answerable.",
  },
  {
    no: "III",
    title: "The first seal stands",
    copy: "A second press on the same question voids the first. The deck does not bargain.",
  },
  {
    no: "IV",
    title: "Hold it, then press",
    copy: "Fix the question behind your eyes for one breath. The seal reads attention, not haste.",
  },
];

const FAQ = [
  {
    q: "How does the yes/no oracle answer?",
    a: "One press, one word — YES, NO, or ASK AGAIN, with a single line of counsel. Treat the word as a lamp, not a chain: it lights the next step, it does not walk it for you.",
  },
  {
    q: "What does ASK AGAIN mean?",
    a: "The beam found no clean edge. Usually the question is double-barrelled, badly timed, or already answered by something you know and avoid. Rephrase it to a single point and press once more.",
  },
  {
    q: "Can I ask the same question twice?",
    a: "You can press the seal as often as you like, but the first answer is the reading — the rest are weather. If you dislike the word, sit with it a day before appealing to the cards again.",
  },
];

/* ------------------------------------------------------------------ */
/* Scoped styles (lyn- prefix)                                         */
/* ------------------------------------------------------------------ */
const LYN_STYLES = `
  .lyn-serif { font-family: "Playfair Display", "Cormorant Garamond", Georgia, "Times New Roman", serif; }
  .lyn-glyph { font-family: "Noto Sans Symbols", "Noto Sans Symbols 2", Symbola, "Segoe UI Symbol", serif; font-style: normal; }
  .lyn-caps  { text-transform: uppercase; letter-spacing: 0.24em; }

  /* panels stay translucent so the wheels/lines pass visibly BEHIND them */
  .lyn-panel {
    background: linear-gradient(160deg, rgba(23,19,40,0.62), rgba(12,10,22,0.72));
    border: 1px solid rgba(233,230,242,0.10);
    backdrop-filter: blur(3px);
  }
  .lyn-chip {
    display: inline-block;
    border: 1px solid rgba(243,199,122,0.35);
    background: rgba(10,9,18,0.85);
    padding: 4px 10px;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #f3c77a;
  }
  .lyn-gold-link {
    color: #f3c77a;
    text-decoration: none;
    background-image: linear-gradient(#f3c77a, #f3c77a);
    background-size: 0% 1px;
    background-repeat: no-repeat;
    background-position: 0 100%;
    transition: background-size 0.35s ease, color 0.2s ease;
  }
  .lyn-gold-link:hover { color: #ffdd9c; background-size: 100% 1px; }

  @keyframes lyn-spin     { to { transform: rotate(360deg); } }
  @keyframes lyn-spin-rev { to { transform: rotate(-360deg); } }
  @keyframes lyn-twinkle  { 0%,100% { opacity: 0.12; } 50% { opacity: 0.75; } }
  @keyframes lyn-floatA   { 0%,100% { transform: translate(0,0) rotate(-2deg); } 50% { transform: translate(1.5vw,-2vh) rotate(1deg); } }
  @keyframes lyn-floatB   { 0%,100% { transform: translate(0,0) rotate(3deg); } 50% { transform: translate(-1.5vw,2vh) rotate(-1deg); } }
  @keyframes lyn-beam     { 0%,100% { stroke-opacity: .18; } 50% { stroke-opacity: .6; } }
  @keyframes lyn-sealwork { to { transform: rotate(360deg); } }
  @keyframes lyn-reveal   { from { opacity: 0; transform: translateY(14px) rotate(0.8deg) scale(.96); }
                            to   { opacity: 1; transform: translateY(0)    rotate(0.8deg) scale(1); } }
  @keyframes lyn-dot      { 0%,100% { opacity: .15; } 50% { opacity: 1; } }

  .lyn-wheel      { animation: lyn-spin 260s linear infinite; }
  .lyn-wheel-rev  { animation: lyn-spin-rev 320s linear infinite; }
  .lyn-wheel-slow { animation: lyn-spin 140s linear infinite; transform-origin: 50% 50%; }
  .lyn-twinkle    { animation: lyn-twinkle 7s ease-in-out infinite; }
  .lyn-float-a    { animation: lyn-floatA 34s ease-in-out infinite; }
  .lyn-float-b    { animation: lyn-floatB 42s ease-in-out infinite; }
  .lyn-nebula     { animation: lyn-floatA 60s ease-in-out infinite; }
  .lyn-beam       { animation: lyn-beam 6s ease-in-out infinite; }
  .lyn-seal-work  { animation: lyn-sealwork 2.2s linear infinite; }
  .lyn-reveal     { animation: lyn-reveal 0.9s cubic-bezier(.16,.84,.3,1) both; }
  .lyn-dot        { animation: lyn-dot 1.2s ease-in-out infinite; }

  .lyn-seal-btn { transition: transform .35s cubic-bezier(.16,.84,.3,1), filter .35s; }
  .lyn-seal-btn:hover  { transform: rotate(-3deg) scale(1.04); filter: brightness(1.12); }
  .lyn-seal-btn:active { transform: rotate(2deg) scale(.96); }
  .lyn-seal-btn:disabled { cursor: wait; }

  @media (prefers-reduced-motion: reduce) {
    .lyn-wheel, .lyn-wheel-rev, .lyn-wheel-slow, .lyn-twinkle,
    .lyn-float-a, .lyn-float-b, .lyn-nebula, .lyn-beam,
    .lyn-seal-work, .lyn-reveal, .lyn-dot { animation: none !important; }
  }
`;

/* ------------------------------------------------------------------ */
/* Magic background — fixed machinery behind everything                */
/* ------------------------------------------------------------------ */
// deterministic star field
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
const STARS = (() => {
  const rnd = mulberry32(20260804);
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

// the bifurcation wheel — one stem, two rays (ITA / NON)
function ForkWheel() {
  const C = 500;
  return (
    <svg viewBox="0 0 1000 1000" className="h-full w-full">
      <circle cx={C} cy={C} r={486} fill="none" stroke={GOLD} strokeWidth={1} />
      <circle cx={C} cy={C} r={430} fill="none" stroke={GOLD} strokeWidth={0.6} />
      <circle cx={C} cy={C} r={330} fill="none" stroke={VIOLET_SOFT} strokeWidth={0.6} />
      {Array.from({ length: 120 }, (_, k) => {
        const a = k * 3;
        const p1 = onCircle(C, C, 430, a);
        const p2 = onCircle(C, C, k % 10 === 0 ? 486 : 458, a);
        return (
          <line key={k} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={GOLD} strokeWidth={k % 10 === 0 ? 1.4 : 0.5} />
        );
      })}
      <line x1={C} y1={C + 320} x2={C} y2={C} stroke={GOLD} strokeWidth={2} />
      <line x1={C} y1={C} x2={C - 220} y2={C - 220} stroke={GOLD} strokeWidth={1.6} />
      <line x1={C} y1={C} x2={C + 220} y2={C - 220} stroke={VIOLET} strokeWidth={1.6} />
      <circle cx={C} cy={C} r={16} fill="none" stroke={GOLD} strokeWidth={1.2} />
      <text x={C - 250} y={C - 250} textAnchor="middle" fontSize={34} fill={GOLD} className="lyn-glyph">ITA</text>
      <text x={C + 250} y={C - 250} textAnchor="middle" fontSize={34} fill={VIOLET_SOFT} className="lyn-glyph">NON</text>
    </svg>
  );
}

// plain tick wheel for the lower-left counterweight
function TickWheel() {
  const C = 500;
  return (
    <svg viewBox="0 0 1000 1000" className="h-full w-full">
      <circle cx={C} cy={C} r={486} fill="none" stroke={VIOLET_SOFT} strokeWidth={1} />
      <circle cx={C} cy={C} r={430} fill="none" stroke={GOLD_DEEP} strokeWidth={0.6} />
      {Array.from({ length: 96 }, (_, k) => {
        const a = k * 3.75;
        const p1 = onCircle(C, C, 430, a);
        const p2 = onCircle(C, C, k % 8 === 0 ? 486 : 460, a);
        return (
          <line key={k} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={VIOLET_SOFT} strokeWidth={k % 8 === 0 ? 1.3 : 0.5} />
        );
      })}
      <polygon points={polyPts(C, C, 300, 4, 0)} fill="none" stroke={GOLD} strokeWidth={0.8} />
      <polygon points={polyPts(C, C, 300, 4, 45)} fill="none" stroke={VIOLET_SOFT} strokeWidth={0.8} />
      <circle cx={C} cy={C} r={120} fill="none" stroke={GOLD_DEEP} strokeWidth={0.5} strokeDasharray="2 7" />
    </svg>
  );
}

function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* nebula washes */}
      <div className="lyn-nebula absolute -left-[20vw] top-[6vh] h-[70vmin] w-[70vmin] bg-[radial-gradient(circle,rgba(162,90,223,0.11),transparent_65%)]" />
      <div className="lyn-nebula absolute right-[-12vw] top-[48vh] h-[80vmin] w-[80vmin] bg-[radial-gradient(circle,rgba(243,199,122,0.08),transparent_65%)]" />
      <div className="lyn-nebula absolute bottom-[-18vh] left-[24vw] h-[60vmin] w-[60vmin] bg-[radial-gradient(circle,rgba(183,148,246,0.07),transparent_65%)]" />

      {/* two huge wheels, half off-screen, counter-rotating */}
      <div className="lyn-wheel absolute -right-[46vmin] -top-[40vmin] h-[150vmin] w-[150vmin] opacity-[0.07]">
        <ForkWheel />
      </div>
      <div className="lyn-wheel-rev absolute -bottom-[44vmin] -left-[42vmin] h-[130vmin] w-[130vmin] opacity-[0.055]">
        <TickWheel />
      </div>

      <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        {/* star specks */}
        {STARS.map((s) =>
          s.tw ? (
            <circle key={s.key} cx={s.x} cy={s.y} r={s.r} fill={CREAM} className="lyn-twinkle" style={{ animationDelay: `${s.d}s`, opacity: s.o }} />
          ) : (
            <circle key={s.key} cx={s.x} cy={s.y} r={s.r} fill={TEXT_LO} opacity={s.o} />
          ),
        )}
        {/* hairline orbit circles, centers pushed off-canvas */}
        <circle cx={-160} cy={180} r={420} fill="none" stroke={GOLD_DEEP} strokeWidth={0.5} opacity={0.35} />
        <circle cx={-160} cy={180} r={560} fill="none" stroke={GOLD_DEEP} strokeWidth={0.4} opacity={0.2} strokeDasharray="2 8" />
        <circle cx={1740} cy={820} r={520} fill="none" stroke={VIOLET} strokeWidth={0.5} opacity={0.3} />
        {/* construction lines crossing the whole page */}
        <line x1={-80} y1={240} x2={1700} y2={700} stroke={TEXT_LO} strokeWidth={0.4} opacity={0.16} />
        <line x1={-80} y1={900} x2={1680} y2={160} stroke={TEXT_LO} strokeWidth={0.4} opacity={0.12} />
        <line x1={320} y1={-60} x2={320} y2={1060} stroke={GOLD_DEEP} strokeWidth={0.4} opacity={0.16} strokeDasharray="1 6" />
        {/* constellation, lower-left */}
        <g opacity={0.5}>
          <polyline points="140,820 218,768 300,796 358,724 438,752" fill="none" stroke={VIOLET_SOFT} strokeWidth={0.6} opacity={0.5} />
          {[
            [140, 820],
            [218, 768],
            [300, 796],
            [358, 724],
            [438, 752],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={1.7} fill={TEXT_HI} opacity={0.8} />
          ))}
        </g>
      </svg>

      {/* giant dim glyphs drifting behind sections */}
      <span className="lyn-glyph lyn-float-a absolute left-[4vw] top-[70vh] text-[24vmin] leading-none text-[#b794f6] opacity-[0.05]">
        ☽{FE}
      </span>
      <span className="lyn-glyph lyn-float-b absolute right-[8vw] top-[150vh] text-[28vmin] leading-none text-[#f3c77a] opacity-[0.045]">
        ✶
      </span>
      <span className="lyn-glyph lyn-float-a absolute left-[36vw] top-[240vh] text-[22vmin] leading-none text-[#e9e6f2] opacity-[0.04]">
        ☉{FE}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The seal — press to consult                                         */
/* ------------------------------------------------------------------ */
function SealSigil({ working }: { working: boolean }) {
  const c = 90;
  return (
    <svg viewBox="0 0 180 180" className="h-full w-full" role="img" aria-label="The seal of the oracle">
      <defs>
        <path id="lyn-seal-ring" d="M 90 90 m -62 0 a 62 62 0 1 1 124 0 a 62 62 0 1 1 -124 0" />
      </defs>
      <circle cx={c} cy={c} r="86" fill="rgba(12,10,22,0.85)" stroke={GOLD} strokeOpacity="0.75" strokeWidth="1.2" />
      <circle cx={c} cy={c} r="80" fill="none" stroke={GOLD} strokeOpacity="0.3" strokeWidth="0.5" />
      {Array.from({ length: 48 }, (_, i) => {
        const p1 = onCircle(c, c, 74, i * 7.5);
        const p2 = onCircle(c, c, 79, i * 7.5);
        return (
          <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={GOLD} strokeOpacity="0.3" strokeWidth="0.5" />
        );
      })}
      <g
        className={working ? "lyn-seal-work" : "lyn-wheel-slow"}
        style={{ transformOrigin: "90px 90px", transformBox: "view-box" }}
      >
        <text fontSize="8.5" letterSpacing="3" fill={GOLD} fontFamily="ui-monospace, monospace" opacity="0.9">
          <textPath href="#lyn-seal-ring">YES · NO · ASK AGAIN · PRESS ·</textPath>
        </text>
      </g>
      {/* dichotomy mark at the seal's heart */}
      <circle cx={c} cy={c} r="44" fill="none" stroke={GOLD} strokeOpacity="0.45" strokeWidth="0.8" />
      <line x1={c} y1={c + 26} x2={c} y2={c} stroke={GOLD} strokeWidth="1.3" />
      <line x1={c} y1={c} x2={c - 20} y2={c - 20} stroke={GOLD} strokeWidth="1.1" />
      <line x1={c} y1={c} x2={c + 20} y2={c - 20} stroke={VIOLET} strokeWidth="1.1" />
      <circle cx={c} cy={c} r="4" fill={CREAM} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Verdict diagram — a small engraved figure per answer                */
/* ------------------------------------------------------------------ */
function VerdictDiagram({ k }: { k: VerdictKey }) {
  const c = 48;
  return (
    <svg viewBox="0 0 96 96" className="h-20 w-20 shrink-0" aria-hidden>
      <rect x="4" y="4" width="88" height="88" fill="rgba(12,10,22,0.8)" stroke={GOLD} strokeOpacity="0.35" strokeWidth="0.6" />
      <rect x="8" y="8" width="80" height="80" fill="none" stroke={GOLD} strokeOpacity="0.12" strokeWidth="0.5" />
      {Array.from({ length: 24 }, (_, i) => {
        const p1 = onCircle(c, c, 38, i * 15);
        const p2 = onCircle(c, c, 41, i * 15);
        return (
          <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={GOLD} strokeOpacity="0.25" strokeWidth="0.5" />
        );
      })}

      {k === "YES" && (
        <g>
          {/* the upright beam */}
          <line x1={c} y1={c + 26} x2={c} y2={c - 22} stroke={GOLD} strokeWidth="1.6" />
          <circle cx={c} cy={c + 28} r="4" fill="rgba(12,10,22,0.9)" stroke={GOLD} strokeWidth="0.9" />
          <circle cx={c} cy={c - 26} r="6" fill="none" stroke={GOLD} strokeWidth="1" />
          <circle cx={c} cy={c - 26} r="2" fill={GOLD} />
          <line x1={c - 14} y1={c - 10} x2={c + 14} y2={c - 10} stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.7" strokeDasharray="2 2" />
          <text x={c} y={c + 44} textAnchor="middle" fontSize="7" letterSpacing="2" fill={GOLD} fontFamily="ui-monospace, monospace">ITA</text>
        </g>
      )}

      {k === "NO" && (
        <g>
          {/* the crossed beam */}
          <line x1={c - 18} y1={c - 18} x2={c + 18} y2={c + 18} stroke={VIOLET} strokeWidth="1.5" />
          <line x1={c + 18} y1={c - 18} x2={c - 18} y2={c + 18} stroke={VIOLET} strokeWidth="1.5" />
          <circle cx={c} cy={c} r="26" fill="none" stroke={VIOLET} strokeOpacity="0.45" strokeWidth="0.7" />
          <circle cx={c} cy={c} r="4" fill="rgba(12,10,22,0.9)" stroke={VIOLET} strokeWidth="0.9" />
          <text x={c} y={c + 44} textAnchor="middle" fontSize="7" letterSpacing="2" fill={VIOLET_SOFT} fontFamily="ui-monospace, monospace">NON</text>
        </g>
      )}

      {k === "AGAIN" && (
        <g>
          {/* the wavering beam */}
          <path
            d={`M ${c} ${c + 24} Q ${c - 12} ${c + 6} ${c} ${c - 6} Q ${c + 12} ${c - 16} ${c} ${c - 26}`}
            fill="none"
            stroke={TEXT_LO}
            strokeWidth="1.4"
          />
          <circle cx={c} cy={c + 26} r="4" fill="rgba(12,10,22,0.9)" stroke={TEXT_LO} strokeWidth="0.9" />
          <circle cx={c} cy={c} r="27" fill="none" stroke={TEXT_LO} strokeOpacity="0.4" strokeWidth="0.6" strokeDasharray="3 3" />
          <text x={c} y={c - 30} textAnchor="middle" fontSize="9" fill={TEXT_LO}>?</text>
          <text x={c} y={c + 44} textAnchor="middle" fontSize="6" letterSpacing="1.5" fill={TEXT_LO} fontFamily="ui-monospace, monospace">ITERVM</text>
        </g>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
type Phase = "idle" | "working" | "revealed";

export default function YesNoOraclePage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [tally, setTally] = useState({ YES: 0, NO: 0, AGAIN: 0 });
  const count = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const consult = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setPhase("working");
    timer.current = setTimeout(() => {
      const v = drawVerdict();
      count.current += 1;
      setVerdict(v);
      setTally((t) => ({ ...t, [v.key]: t[v.key] + 1 }));
      setPhase("revealed");
    }, 1500);
  }, []);

  const reset = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setPhase("idle");
  }, []);

  const respNo = String(count.current).padStart(3, "0");

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#0a0912] font-sans text-[#e9e6f2] antialiased selection:bg-[#f3c77a]/25">
      <style>{LYN_STYLES}</style>
      <Backdrop />

      <div className="relative z-10">
        {/* ======================= COMPACT HEADER ======================= */}
        <header className="relative border-b border-white/[0.07]">
          <nav className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3 md:px-8">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="lyn-glyph grid h-7 w-7 place-items-center border border-[#f3c77a]/40 bg-[#f3c77a]/[0.07] text-[13px] text-[#f3c77a]">
                ☾{FE}
              </span>
              <span className="lyn-serif text-[16px] tracking-wide text-[#e9e6f2]">Astro Scope</span>
            </Link>
            <span className="hidden font-mono text-[8px] tracking-[0.3em] text-[#b7b1cc]/40 md:inline">
              TAROT · YES / NO ORACLE
            </span>
            <div className="ml-auto flex items-center gap-3">
              <Link href="/" className="hidden text-[12.5px] text-[#b7b1cc] transition-colors hover:text-[#e9e6f2] sm:inline">
                Sign in
              </Link>
              <Link
                href="/"
                className="border border-[#f3c77a]/50 bg-[#f3c77a]/10 px-3 py-1.5 text-[12.5px] text-[#ffdd9c] transition-colors hover:bg-[#f3c77a]/20"
              >
                Sign up
              </Link>
            </div>
          </nav>
          {/* tarot cross-nav tabs */}
          <div className="border-t border-white/[0.05]">
            <nav
              aria-label="Tarot pages"
              className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-0 md:px-8"
            >
              {TAROT_TABS.map((t) => {
                const active = t.href === ACTIVE_TAB;
                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    aria-current={active ? "page" : undefined}
                    className={`whitespace-nowrap border-b-2 px-3 py-2.5 text-[11.5px] tracking-wide transition-colors ${
                      active
                        ? "border-[#f3c77a] text-[#f3c77a]"
                        : "border-transparent text-[#b7b1cc]/75 hover:border-[#f3c77a]/30 hover:text-[#e9e6f2]"
                    }`}
                  >
                    {t.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>

        {/* ======================= THE ORACLE — TOP OF THE VIEWPORT ======================= */}
        <section id="lyn-oracle" className="relative">
          {/* diagonal hairline slashing through the tool stage */}
          <div
            className="pointer-events-none absolute left-[-4vw] top-[38%] h-px w-[108vw] -rotate-[1.1deg] bg-gradient-to-r from-transparent via-[#b794f6]/25 to-transparent"
            aria-hidden
          />

          <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-8 md:px-8 md:pt-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-0">

              {/* intro column — narrow, hangs over the backdrop fork wheel */}
              <div className="relative order-2 lg:order-1 lg:w-[42%] lg:pt-10">
                <p className="lyn-chip -rotate-[0.5deg]">Tarot · Yes / No oracle</p>
                <h1 className="lyn-serif mt-5 text-[clamp(30px,4.4vw,50px)] leading-[1.06] tracking-tight text-[#e9e6f2]">
                  One question.
                  <br />
                  <span className="text-[#f3c77a]">One word</span> in answer.
                </h1>
                <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-[#b7b1cc]">
                  The oldest cut of the deck — a single card drawn for a single doubt.
                  Frame the question, press the seal, and take the word:{" "}
                  <span className="text-[#f3c77a]">YES</span>,{" "}
                  <span className="text-[#b794f6]">NO</span>, or ASK AGAIN.
                </p>
                <div className="mt-5 flex max-w-sm flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/[0.07] pt-3 font-mono text-[7.5px] tracking-[0.25em] text-[#b7b1cc]/50">
                  <span>DECK · 78 LEAVES</span>
                  <span className="text-[#f3c77a]/80">● SEAL READY</span>
                  <span>WEIGHTS 42 : 42 : 16</span>
                  <span>$0 · NO COIN</span>
                </div>
                {/* marginal note hanging off the column edge */}
                <p className="mt-8 hidden max-w-[190px] -rotate-1 border-l border-[#b794f6]/30 pl-3 font-serif text-[12px] italic leading-relaxed text-[#b7b1cc]/50 lg:block">
                  hic respondetur semel — the answer is given once, and the wax remembers.
                </p>
              </div>

              {/* the response plate — the tool itself */}
              <div className="relative order-1 lg:order-2 lg:-ml-6 lg:w-[62%]">
                <div className="lyn-panel relative -rotate-[0.6deg] px-5 py-6 sm:px-8">
                  {/* chip straddling the top border */}
                  <span className="lyn-chip absolute -top-3 left-6 rotate-[0.6deg]">Response plate</span>
                  <span className="absolute -right-3 -top-3 rotate-6 border border-[#b794f6]/40 bg-[#0a0912]/90 px-2 py-1 font-mono text-[6px] tracking-[0.3em] text-[#b794f6]">
                    RESP. Nº {respNo}
                  </span>

                  <div className="flex flex-col items-center gap-6 pt-2 sm:flex-row sm:items-center sm:gap-8">
                    {/* seal button */}
                    <div className="flex shrink-0 flex-col items-center">
                      <button
                        type="button"
                        onClick={phase === "revealed" ? reset : consult}
                        disabled={phase === "working"}
                        aria-label={phase === "revealed" ? "Seal another question" : "Press the seal to consult the oracle"}
                        className="lyn-seal-btn relative h-40 w-40 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f3c77a]/70 sm:h-44 sm:w-44"
                      >
                        <SealSigil working={phase === "working"} />
                      </button>
                      <span className="mt-2 text-center font-mono text-[7px] tracking-[0.3em] text-[#b7b1cc]/50">
                        {phase === "working"
                          ? "WEIGHING…"
                          : phase === "revealed"
                            ? "PRESS TO SEAL ANOTHER"
                            : "HOLD THE QUESTION · PRESS"}
                      </span>
                    </div>

                    {/* verdict area */}
                    <div className="min-h-[196px] w-full min-w-0 flex-1">
                      {phase === "idle" && (
                        <div className="flex h-[196px] flex-col items-center justify-center gap-3 border border-dashed border-[#f3c77a]/25 text-center">
                          <span aria-hidden className="lyn-glyph text-lg text-[#f3c77a]/40">✶</span>
                          <span className="font-mono text-[8px] tracking-[0.35em] text-[#b7b1cc]/45">
                            THE PLATE AWAITS A QUESTION
                          </span>
                          <span className="font-mono text-[6px] tracking-[0.25em] text-[#b7b1cc]/30">
                            NVLLVM RESPONSVM · ADHVC
                          </span>
                        </div>
                      )}

                      {phase === "working" && (
                        <div className="flex h-[196px] flex-col items-center justify-center gap-4 border border-[#f3c77a]/20 text-center">
                          <div className="flex gap-2">
                            {[0, 1, 2].map((i) => (
                              <span
                                key={i}
                                className="lyn-dot h-1.5 w-1.5 rounded-full bg-[#f3c77a]"
                                style={{ animationDelay: `${i * 0.2}s` }}
                              />
                            ))}
                          </div>
                          <span className="font-mono text-[8px] tracking-[0.35em] text-[#f3c77a]/80">
                            THE DECK IS WEIGHING
                          </span>
                          <span className="font-mono text-[6px] tracking-[0.25em] text-[#b7b1cc]/35">
                            PONDERATIO · 42 : 42 : 16
                          </span>
                        </div>
                      )}

                      {phase === "revealed" && verdict && (
                        <div
                          key={`${verdict.key}-${respNo}`}
                          className="lyn-reveal relative border bg-[#0a0912]/60 p-5"
                          style={{ borderColor: `${verdict.color}55` }}
                        >
                          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
                            <VerdictDiagram k={verdict.key} />
                            <div className="min-w-0 text-center sm:text-left">
                              <div
                                className="lyn-serif text-4xl tracking-[0.1em] sm:text-5xl"
                                style={{ color: verdict.color }}
                              >
                                {verdict.word}
                              </div>
                              <div className="mt-1 font-mono text-[8px] tracking-[0.4em]" style={{ color: verdict.color }}>
                                {verdict.latin}
                              </div>
                              <p className="mt-3 max-w-xs text-[12.5px] italic leading-relaxed text-[#e9e6f2]/70">
                                {verdict.counsel}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-3 font-mono text-[6px] tracking-[0.25em] text-[#b7b1cc]/35">
                            <span>RESP. Nº {respNo}</span>
                            <span>THE FIRST ANSWER STANDS</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* tally strip */}
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 border-t border-white/[0.07] pt-3 font-mono text-[7px] tracking-[0.25em] text-[#b7b1cc]/40">
                    <span>CONSULTED × {respNo}</span>
                    <span className="text-[#f3c77a]">YES × {tally.YES}</span>
                    <span className="text-[#b794f6]">NO × {tally.NO}</span>
                    <span>AGAIN × {tally.AGAIN}</span>
                  </div>
                </div>

                {/* small card plate overlapping the main plate's lower right corner */}
                <div className="lyn-panel relative z-10 ml-auto hidden w-44 rotate-[3deg] px-4 py-3 text-center sm:-mt-6 sm:mr-6 lg:block">
                  <span className="lyn-chip absolute -top-2.5 left-4 !px-2 !py-0.5 !text-[8px]">One leaf</span>
                  <div className="mx-auto mt-1 flex h-16 w-11 flex-col items-center justify-center gap-0.5 border border-[#b794f6]/50 bg-[#0a0912]/70">
                    <span className="font-mono text-[6px] text-[#b794f6]">0 / I</span>
                    <span className="lyn-glyph text-[14px] text-[#f3c77a]">✦</span>
                  </div>
                  <p className="mt-2 font-mono text-[6px] leading-relaxed tracking-[0.2em] text-[#b7b1cc]/40">
                    ONE LEAF DRAWN
                    <br />
                    FOR ONE DOUBT
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================= PRECEPTS — CONDENSED ======================= */}
        <section className="relative border-t border-white/[0.06]">
          <div
            className="pointer-events-none absolute left-[-4vw] top-6 h-px w-[108vw] rotate-[0.5deg] bg-gradient-to-r from-transparent via-[#f3c77a]/20 to-transparent"
            aria-hidden
          />
          <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
              <h2 className="lyn-serif -rotate-[0.3deg] text-[clamp(20px,2.6vw,30px)] text-[#e9e6f2]">
                How to ask
              </h2>
              <span className="font-mono text-[7px] tracking-[0.3em] text-[#b7b1cc]/40">
                FOUR RULES WRITTEN ABOVE THE SEAL
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
              {PRECEPTS.map((p, i) => (
                <div
                  key={p.no}
                  className={`lyn-panel relative px-5 py-5 ${
                    [
                      "lg:-rotate-[0.6deg]",
                      "lg:translate-y-4 lg:rotate-[0.5deg] lg:-ml-3",
                      "lg:-translate-y-1 lg:-rotate-[0.4deg] lg:-ml-3",
                      "lg:translate-y-6 lg:rotate-[0.7deg] lg:-ml-3",
                    ][i]
                  }`}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="lyn-serif text-3xl leading-none text-[#f3c77a]/85">{p.no}</span>
                    <h3 className="text-[14px] font-medium text-[#e9e6f2]">{p.title}</h3>
                  </div>
                  <p className="mt-2.5 text-[12.5px] leading-relaxed text-[#b7b1cc]">{p.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================= FAQ — CONDENSED ======================= */}
        <section className="relative border-t border-white/[0.06]">
          {/* vertical hairline breaking through the FAQ column */}
          <div
            className="pointer-events-none absolute left-[7%] top-[-2rem] hidden h-[calc(100%+4rem)] w-px rotate-[0.4deg] bg-gradient-to-b from-transparent via-[#f3c77a]/25 to-transparent md:block"
            aria-hidden
          />
          <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
            <h2 className="lyn-serif rotate-[0.3deg] text-[clamp(20px,2.6vw,30px)] text-[#e9e6f2] md:translate-x-[12%]">
              Questions from the margins
            </h2>
            <div className="relative mx-auto mt-8 max-w-2xl md:ml-[10%]">
              {FAQ.map((f, i) => (
                <details
                  key={f.q}
                  className={`lyn-panel group relative z-10 mb-3 px-6 py-4 open:border-[#f3c77a]/40 ${
                    i % 2 === 0
                      ? "-rotate-[0.4deg] md:-ml-10 md:mr-6"
                      : "rotate-[0.4deg] md:ml-10 md:-mr-4"
                  }`}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14.5px] text-[#e9e6f2] marker:hidden [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="lyn-glyph shrink-0 text-[13px] text-[#f3c77a] transition-transform group-open:rotate-45">
                      ✦
                    </span>
                  </summary>
                  <p className="mt-3 text-[13px] leading-relaxed text-[#b7b1cc]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ======================= COMPACT CTA ======================= */}
        <section className="relative border-t border-white/[0.06] bg-[#151126]/50 backdrop-blur-[3px]">
          <div
            className="pointer-events-none absolute inset-x-[-2vw] top-4 h-px rotate-[0.3deg] bg-gradient-to-r from-transparent via-[#a25adf]/35 to-transparent"
            aria-hidden
          />
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-5 px-5 py-12 md:flex-row md:items-center md:justify-between md:px-8">
            <div className="max-w-xl">
              <span className="lyn-glyph text-[18px] text-[#f3c77a]" aria-hidden>
                ✧
              </span>
              <h2 className="lyn-serif mt-3 -rotate-[0.3deg] text-[clamp(20px,2.8vw,32px)] leading-tight text-[#e9e6f2]">
                The word is the doorway. <span className="text-[#f3c77a]">The spread is the room.</span>
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-[#b7b1cc]">
                When one card is not enough — three cards, love, or the whole deck wait on the same shelf.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/tarot/spreads/past-present-future"
                className="rotate-[0.4deg] border border-[#f3c77a] bg-[#f3c77a] px-5 py-2.5 text-[13px] font-medium text-[#0a0912] transition-transform hover:-translate-y-0.5"
              >
                Past · Present · Future
              </Link>
              <Link href="/tarot" className="lyn-gold-link -rotate-[0.4deg] text-[13px]">
                All tarot spreads →
              </Link>
            </div>
          </div>
        </section>

        {/* ======================= COMPACT FOOTER ======================= */}
        <footer className="relative border-t border-white/[0.07]">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 py-6 md:flex-row md:justify-between md:px-8">
            <div className="flex items-center gap-2.5">
              <span className="lyn-glyph grid h-6 w-6 place-items-center border border-[#f3c77a]/40 bg-[#f3c77a]/[0.07] text-[11px] text-[#f3c77a]">
                ☾{FE}
              </span>
              <span className="lyn-serif text-[14px] text-[#e9e6f2]">Astro Scope</span>
              <span className="font-mono text-[7px] tracking-[0.25em] text-[#b7b1cc]/35">
                TAROT · YES / NO
              </span>
            </div>
            <nav className="flex gap-5 text-[11px] text-[#b7b1cc]/70">
              <Link href="/tarot/spreads/daily-card" className="transition-colors hover:text-[#f3c77a]">Daily Card</Link>
              <Link href="/tarot/spreads/love-three-card" className="transition-colors hover:text-[#f3c77a]">Love</Link>
              <Link href="/tarot/cards" className="transition-colors hover:text-[#f3c77a]">All Cards</Link>
            </nav>
            <span className="text-[10.5px] text-[#b7b1cc]/50">© 2026 Astro Scope</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
