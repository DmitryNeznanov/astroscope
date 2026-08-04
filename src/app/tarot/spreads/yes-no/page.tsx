"use client";

import { useCallback, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Palette (emerald-gold codex)                                        */
/* ------------------------------------------------------------------ */
const GOLD = "#c9b037";
const GOLD_DIM = "#8f7f2a";
const VERDI = "#3fa37c";
const CREAM = "#e6e0c8";
const GROUND = "#06120c";
const PLATE = "#0a1a12";
const RUBRIC = "#b0503f"; // rubrication red — reserved for the NO verdict

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                    */
/* ------------------------------------------------------------------ */
const rad = (deg: number) => (deg * Math.PI) / 180;
const r2 = (n: number) => Math.round(n * 100) / 100;
const apt = (r: number, deg: number, cx: number, cy: number) => ({
  x: r2(cx + r * Math.cos(rad(deg))),
  y: r2(cy + r * Math.sin(rad(deg))),
});
const apoly = (r: number, n: number, start: number, cx: number, cy: number) =>
  Array.from({ length: n }, (_, i) => {
    const p = apt(r, start + (360 / n) * i, cx, cy);
    return `${p.x},${p.y}`;
  }).join(" ");

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

/* weighted: YES 42 · NO 42 · ASK AGAIN 16 — the deck&rsquo;s temper */
function drawVerdict(): Verdict {
  const r = Math.random();
  const key: VerdictKey = r < 0.42 ? "YES" : r < 0.84 ? "NO" : "AGAIN";
  const pool = COUNSEL[key];
  const counsel = pool[Math.floor(Math.random() * pool.length)];
  if (key === "YES")
    return { key, word: "YES", latin: "ITA VERO", color: VERDI, counsel };
  if (key === "NO")
    return { key, word: "NO", latin: "MINIME", color: RUBRIC, counsel };
  return { key, word: "ASK AGAIN", latin: "ITERVM ROGA", color: GOLD, counsel };
}

const PRECEPTS = [
  {
    no: "I",
    title: "One question, one seal",
    copy: "Do not smuggle three questions into one sleeve. The oracle answers a single point of doubt; everything else is noise in the beam.",
    gloss: "una quaestio · unum sigillum",
  },
  {
    no: "II",
    title: "Phrase it so a yes can land",
    copy: "Ask \u201Cshould I take the post?\u201D, not \u201Cwhat of my future?\u201D. If no arrangement of YES or NO could satisfy you, the question is not ready.",
    gloss: "sic dictum ut ita cadat",
  },
  {
    no: "III",
    title: "Ask once — the first seal stands",
    copy: "A second press on the same question voids the first. The deck does not bargain; it answers and closes the folio.",
    gloss: "prima cera stat",
  },
  {
    no: "IV",
    title: "Hold it in mind, then press",
    copy: "Fix the question behind your eyes for one breath. The seal reads attention, not haste.",
    gloss: "mente fixa · tum preme",
  },
];

const FAQ = [
  {
    q: "How does the yes/no oracle answer?",
    a: "One press, one word. Beneath the seal the deck weighs the question and returns YES, NO, or ASK AGAIN — with a single line of counsel. Treat the word as a lamp, not a chain: it lights the next step, it does not walk it for you.",
  },
  {
    q: "What does ASK AGAIN mean?",
    a: "That the beam found no clean edge. Usually the question is double-barrelled, badly timed, or already answered by something you know and avoid. Rephrase it to a single point, wait a little, and press the seal once more.",
  },
  {
    q: "Can I ask the same question twice?",
    a: "You can press the seal as often as you like, but the first answer is the reading — the rest are weather. If you dislike the word, sit with it a day before you appeal to the cards again.",
  },
];

/* ------------------------------------------------------------------ */
/* Vellum fibre noise (feTurbulence data URI)                          */
/* ------------------------------------------------------------------ */
const NOISE_URI =
  "url(\"data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.55 0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)'/%3E%3C/svg%3E\")";

/* ------------------------------------------------------------------ */
/* Scoped styles (lyn- prefix)                                         */
/* ------------------------------------------------------------------ */
const LYN_STYLES = `
  .lyn-rot-90    { animation: lyn-spin 90s  linear infinite; }
  .lyn-rot-140r  { animation: lyn-spin-rev 140s linear infinite; }
  .lyn-rot-200   { animation: lyn-spin 200s linear infinite; }
  .lyn-rot-260r  { animation: lyn-spin-rev 260s linear infinite; }
  .lyn-drift     { animation: lyn-drift 60s ease-in-out infinite; }
  .lyn-pulse     { animation: lyn-pulse 8s ease-in-out infinite; }
  .lyn-pulse-2   { animation: lyn-pulse 14s ease-in-out infinite; }
  .lyn-flicker   { animation: lyn-flicker 11s ease-in-out infinite; }
  .lyn-candle    { animation: lyn-candle 9s ease-in-out infinite; }
  .lyn-beam      { animation: lyn-beam 6s ease-in-out infinite; }
  .lyn-seal-work { animation: lyn-spin 2.2s linear infinite; }
  .lyn-reveal    { animation: lyn-reveal 0.9s cubic-bezier(.16,.84,.3,1) both; }
  .lyn-dot       { animation: lyn-dot 1.2s ease-in-out infinite; }
  @keyframes lyn-spin     { to { transform: rotate(360deg); } }
  @keyframes lyn-spin-rev { to { transform: rotate(-360deg); } }
  @keyframes lyn-drift    { 0%,100% { transform: translate(0,0); } 50% { transform: translate(14px,-10px); } }
  @keyframes lyn-pulse    { 0%,100% { opacity: .4; } 50% { opacity: 1; } }
  @keyframes lyn-flicker  { 0%,100% { opacity: .9; } 47% { opacity: .5; } 53% { opacity: .8; } }
  @keyframes lyn-candle   { 0%,100% { opacity: .55; } 37% { opacity: .85; } 52% { opacity: .6; } 71% { opacity: .95; } }
  @keyframes lyn-beam     { 0%,100% { stroke-opacity: .18; } 50% { stroke-opacity: .55; } }
  @keyframes lyn-reveal   { from { opacity: 0; transform: translateY(14px) rotate(1.5deg) scale(.96); }
                            to   { opacity: 1; transform: translateY(0)    rotate(1.5deg) scale(1); } }
  @keyframes lyn-dot      { 0%,100% { opacity: .15; } 50% { opacity: 1; } }
  /* --- age layer --- */
  .lyn-vellum { background-image: ${NOISE_URI}; background-size: 220px 220px; }
  .lyn-gilt { position: relative; }
  .lyn-gilt::after {
    content: ""; position: absolute; inset: 0; pointer-events: none;
    background-image: ${NOISE_URI}; background-size: 160px 160px;
    opacity: .22; mix-blend-mode: multiply;
  }
  .lyn-mottle { position: relative; }
  .lyn-mottle::before {
    content: ""; position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 60% 45% at 18% 12%, rgba(230,224,200,0.05), transparent 60%),
      radial-gradient(ellipse 50% 40% at 84% 88%, rgba(120,95,40,0.07), transparent 60%),
      radial-gradient(ellipse 40% 35% at 70% 20%, rgba(63,163,124,0.05), transparent 65%);
  }
  .lyn-bleed {
    box-shadow: 0 0 1.5px rgba(12,9,3,0.9), 0 0 3px rgba(201,176,55,0.25);
  }
  .lyn-seal-btn { transition: transform .35s cubic-bezier(.16,.84,.3,1), filter .35s; }
  .lyn-seal-btn:hover  { transform: rotate(-3deg) scale(1.04); filter: brightness(1.12); }
  .lyn-seal-btn:active { transform: rotate(2deg) scale(.96); }
  .lyn-seal-btn:disabled { cursor: wait; }
  @media (prefers-reduced-motion: reduce) {
    .lyn-rot-90, .lyn-rot-140r, .lyn-rot-200, .lyn-rot-260r, .lyn-drift,
    .lyn-pulse, .lyn-pulse-2, .lyn-flicker, .lyn-candle, .lyn-beam,
    .lyn-seal-work, .lyn-reveal, .lyn-dot { animation: none !important; }
  }
`;

/* ------------------------------------------------------------------ */
/* Background apparatus (behind everything)                            */
/* ------------------------------------------------------------------ */
const BIG_GLYPHS = [
  { g: "☉︎", top: "7%", left: "64%", size: 230, o: 0.05 },
  { g: "☽︎", top: "30%", left: "4%", size: 190, o: 0.055 },
  { g: "✶", top: "52%", left: "88%", size: 200, o: 0.05 },
  { g: "♀︎", top: "72%", left: "24%", size: 210, o: 0.045 },
  { g: "♄︎", top: "90%", left: "72%", size: 180, o: 0.05 },
];

const SPECKS = Array.from({ length: 46 }, (_, i) => ({
  top: `${(i * 53 + 9) % 100}%`,
  left: `${(i * 37 + 13) % 100}%`,
  s: 1 + ((i * 7) % 3) * 0.7,
  o: 0.15 + ((i * 11) % 10) / 40,
}));

function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* hairline construction work across the whole leaf */}
      <svg
        viewBox="0 0 1600 3200"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <g fill="none" stroke={VERDI} strokeOpacity="0.09" strokeWidth="1">
          <circle cx="300" cy="640" r="560" />
          <circle cx="300" cy="640" r="380" />
          <circle cx="1350" cy="1500" r="480" />
          <circle cx="250" cy="2500" r="600" />
          <circle cx="1300" cy="2900" r="420" />
        </g>
        <g fill="none" stroke={GOLD} strokeOpacity="0.08" strokeWidth="1">
          <polygon points={apoly(380, 3, -90, 300, 640)} />
          <polygon points={apoly(380, 3, 90, 300, 640)} />
          <polygon points={apoly(420, 4, -45, 1300, 2900)} />
          <polygon points={apoly(420, 4, 0, 1300, 2900)} />
          <line x1="-100" y1="380" x2="1700" y2="640" />
          <line x1="-100" y1="1900" x2="1700" y2="1650" />
          <line x1="1150" y1="-50" x2="920" y2="3250" />
          <line x1="200" y1="-50" x2="480" y2="3250" />
        </g>
        <g fill="none" stroke={GOLD} strokeOpacity="0.1" strokeWidth="0.6" strokeDasharray="2 5">
          <circle cx="300" cy="640" r="230" />
          <circle cx="1350" cy="1500" r="300" />
        </g>
      </svg>

      {/* giant bifurcation fork — the yes/no figure, half off the left edge */}
      <svg
        viewBox="0 0 600 600"
        className="lyn-rot-260r absolute -left-[340px] top-[30%] h-[860px] w-[860px] opacity-[0.09]"
      >
        <circle cx="300" cy="300" r="288" fill="none" stroke={GOLD} strokeWidth="1" strokeOpacity="0.8" />
        <circle cx="300" cy="300" r="280" fill="none" stroke={GOLD} strokeWidth="0.5" strokeOpacity="0.3" />
        <circle cx="300" cy="300" r="196" fill="none" stroke={VERDI} strokeWidth="0.6" strokeOpacity="0.4" strokeDasharray="2 4" />
        {Array.from({ length: 72 }, (_, i) => {
          const p1 = apt(i % 6 === 0 ? 262 : 272, i * 5, 300, 300);
          const p2 = apt(288, i * 5, 300, 300);
          return (
            <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.6" />
          );
        })}
        {/* one stem, two rays — the dichotomy */}
        <line x1="300" y1="470" x2="300" y2="300" stroke={GOLD} strokeOpacity="0.9" strokeWidth="1.4" />
        <line x1="300" y1="300" x2="150" y2="150" stroke={VERDI} strokeOpacity="0.8" strokeWidth="1.1" />
        <line x1="300" y1="300" x2="450" y2="150" stroke={RUBRIC} strokeOpacity="0.7" strokeWidth="1.1" />
        <circle cx="300" cy="300" r="10" fill={PLATE} stroke={GOLD} strokeWidth="1" />
        <text x="140" y="140" textAnchor="middle" fontSize="22" fill={VERDI} fontFamily="ui-monospace, monospace">ITA</text>
        <text x="460" y="140" textAnchor="middle" fontSize="22" fill={RUBRIC} fontFamily="ui-monospace, monospace">NON</text>
      </svg>

      {/* slowly-turning tick wheel, bleeding off the upper right corner */}
      <svg
        viewBox="0 0 600 600"
        className="lyn-rot-200 absolute -right-[280px] -top-40 h-[760px] w-[760px] opacity-[0.1]"
      >
        <circle cx="300" cy="300" r="290" fill="none" stroke={GOLD} strokeOpacity="0.7" strokeWidth="1" />
        <circle cx="300" cy="300" r="214" fill="none" stroke={VERDI} strokeOpacity="0.35" strokeWidth="0.6" strokeDasharray="1 4" />
        {Array.from({ length: 60 }, (_, i) => {
          const p1 = apt(i % 5 === 0 ? 268 : 278, i * 6, 300, 300);
          const p2 = apt(290, i * 6, 300, 300);
          return (
            <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={GOLD} strokeOpacity="0.6" strokeWidth="0.7" />
          );
        })}
        <polygon points={apoly(160, 3, -90, 300, 300)} fill="none" stroke={GOLD} strokeOpacity="0.4" strokeWidth="0.7" />
        <polygon points={apoly(160, 3, 90, 300, 300)} fill="none" stroke={GOLD} strokeOpacity="0.4" strokeWidth="0.7" />
        <circle cx="300" cy="300" r="56" fill="none" stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.7" />
        <text x="300" y="310" textAnchor="middle" fontSize="30" fill={GOLD} opacity="0.9">✦</text>
      </svg>

      {/* faint colossal glyphs looming behind the panels */}
      {BIG_GLYPHS.map((b, i) => (
        <span
          key={i}
          className="lyn-drift absolute select-none"
          style={{
            top: b.top,
            left: b.left,
            fontSize: b.size,
            lineHeight: 1,
            color: CREAM,
            opacity: b.o,
            animationDelay: `${i * -13}s`,
          }}
        >
          {b.g}
        </span>
      ))}

      {/* ink specks spattered across the leaf */}
      {SPECKS.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{ top: s.top, left: s.left, width: s.s, height: s.s, backgroundColor: "#000", opacity: s.o }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Age layer — vellum, foxing, smudges, candlelight                    */
/* ------------------------------------------------------------------ */
const FOXING = [
  { top: "3%", left: "7%", s: 78, o: 0.12 },
  { top: "5%", left: "90%", s: 58, o: 0.1 },
  { top: "16%", left: "95%", s: 44, o: 0.12 },
  { top: "31%", left: "2%", s: 62, o: 0.09 },
  { top: "47%", left: "96%", s: 52, o: 0.11 },
  { top: "61%", left: "1.5%", s: 70, o: 0.1 },
  { top: "76%", left: "93%", s: 56, o: 0.09 },
  { top: "88%", left: "5%", s: 64, o: 0.12 },
  { top: "95%", left: "80%", s: 52, o: 0.1 },
];

const SMUDGES = [
  { top: "24%", right: "4%", w: 68, h: 42, rot: 22, o: 0.16 },
  { top: "58%", left: "3%", w: 60, h: 38, rot: -16, o: 0.13 },
  { top: "83%", right: "7%", w: 78, h: 48, rot: 11, o: 0.12 },
];

function AgeLayer() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      <div className="lyn-vellum absolute inset-0 opacity-[0.07]" />
      <div
        className="lyn-candle absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 55% 38% at 84% 2%, rgba(255,186,92,0.08), transparent 65%), radial-gradient(ellipse 42% 30% at 8% 98%, rgba(255,170,80,0.05), transparent 60%)",
        }}
      />
      {FOXING.map((f, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            top: f.top,
            left: f.left,
            width: f.s,
            height: Math.round(f.s * 0.8),
            backgroundImage: `radial-gradient(ellipse at center, rgba(150,105,45,${f.o}) 0%, rgba(150,105,45,${f.o * 0.5}) 40%, transparent 70%)`,
            filter: "blur(1.5px)",
          }}
        />
      ))}
      {SMUDGES.map((sm, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            top: sm.top,
            right: sm.right,
            left: sm.left,
            width: sm.w,
            height: sm.h,
            opacity: sm.o,
            transform: `rotate(${sm.rot}deg)`,
            backgroundImage:
              "radial-gradient(ellipse at center, rgba(28,20,9,0.9) 0%, rgba(28,20,9,0.4) 45%, transparent 72%)",
            filter: "blur(3px)",
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */
function Corners() {
  const base = "pointer-events-none absolute h-2.5 w-2.5 border-[#c9b037]/60";
  return (
    <>
      <span aria-hidden className={`${base} left-0 top-0 border-l border-t`} />
      <span aria-hidden className={`${base} right-0 top-0 border-r border-t`} />
      <span aria-hidden className={`${base} bottom-0 left-0 border-b border-l`} />
      <span aria-hidden className={`${base} bottom-0 right-0 border-b border-r`} />
    </>
  );
}

function Hairline({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="lyn-bleed h-px flex-1 bg-[#c9b037]/30" />
      <span aria-hidden className="text-[8px] text-[#c9b037]">✦</span>
      <span className="font-mono text-[7px] tracking-[0.35em] text-[#e6e0c8]/40">{label}</span>
      <span aria-hidden className="text-[8px] text-[#c9b037]">✦</span>
      <span className="lyn-bleed h-px flex-1 bg-[#c9b037]/30" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Verdict diagram — a small codex figure per answer                   */
/* ------------------------------------------------------------------ */
function VerdictDiagram({ k }: { k: VerdictKey }) {
  const c = 48;
  return (
    <svg viewBox="0 0 96 96" className="h-20 w-20 shrink-0" aria-hidden>
      <rect x="4" y="4" width="88" height="88" fill={PLATE} stroke={GOLD} strokeOpacity="0.4" strokeWidth="0.6" />
      <rect x="8" y="8" width="80" height="80" fill="none" stroke={GOLD} strokeOpacity="0.15" strokeWidth="0.5" />
      {Array.from({ length: 24 }, (_, i) => {
        const p1 = apt(38, i * 15, c, c);
        const p2 = apt(41, i * 15, c, c);
        return (
          <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={GOLD} strokeOpacity="0.25" strokeWidth="0.5" />
        );
      })}

      {k === "YES" && (
        <g>
          {/* the upright beam */}
          <line x1={c} y1={c + 26} x2={c} y2={c - 22} stroke={VERDI} strokeWidth="1.6" />
          <circle cx={c} cy={c + 28} r="4" fill={PLATE} stroke={VERDI} strokeWidth="0.9" />
          <circle cx={c} cy={c - 26} r="6" fill="none" stroke={VERDI} strokeWidth="1" />
          <circle cx={c} cy={c - 26} r="2" fill={VERDI} />
          <line x1={c - 14} y1={c - 10} x2={c + 14} y2={c - 10} stroke={VERDI} strokeOpacity="0.5" strokeWidth="0.7" strokeDasharray="2 2" />
          <text x={c} y={c + 44} textAnchor="middle" fontSize="7" letterSpacing="2" fill={VERDI} fontFamily="ui-monospace, monospace">ITA</text>
        </g>
      )}

      {k === "NO" && (
        <g>
          {/* the crossed beam */}
          <line x1={c - 18} y1={c - 18} x2={c + 18} y2={c + 18} stroke={RUBRIC} strokeWidth="1.5" />
          <line x1={c + 18} y1={c - 18} x2={c - 18} y2={c + 18} stroke={RUBRIC} strokeWidth="1.5" />
          <circle cx={c} cy={c} r="26" fill="none" stroke={RUBRIC} strokeOpacity="0.45" strokeWidth="0.7" />
          <circle cx={c} cy={c} r="4" fill={PLATE} stroke={RUBRIC} strokeWidth="0.9" />
          <text x={c} y={c + 44} textAnchor="middle" fontSize="7" letterSpacing="2" fill={RUBRIC} fontFamily="ui-monospace, monospace">NON</text>
        </g>
      )}

      {k === "AGAIN" && (
        <g>
          {/* the wavering beam */}
          <path
            d={`M ${c} ${c + 24} Q ${c - 12} ${c + 6} ${c} ${c - 6} Q ${c + 12} ${c - 16} ${c} ${c - 26}`}
            fill="none"
            stroke={GOLD}
            strokeWidth="1.4"
          />
          <circle cx={c} cy={c + 26} r="4" fill={PLATE} stroke={GOLD} strokeWidth="0.9" />
          <circle cx={c} cy={c} r="27" fill="none" stroke={GOLD} strokeOpacity="0.4" strokeWidth="0.6" strokeDasharray="3 3" />
          <text x={c} y={c - 30} textAnchor="middle" fontSize="9" fill={GOLD}>?</text>
          <text x={c} y={c + 44} textAnchor="middle" fontSize="6" letterSpacing="1.5" fill={GOLD} fontFamily="ui-monospace, monospace">ITERVM</text>
        </g>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* The seal — press to consult                                         */
/* ------------------------------------------------------------------ */
function SealSigil({ working }: { working: boolean }) {
  const c = 90;
  return (
    <svg viewBox="0 0 180 180" className="h-full w-full" role="img" aria-label="The wax seal of the oracle">
      <defs>
        <path id="lyn-seal-ring" d="M 90 90 m -62 0 a 62 62 0 1 1 124 0 a 62 62 0 1 1 -124 0" />
      </defs>
      <circle cx={c} cy={c} r="86" fill={PLATE} stroke={GOLD} strokeOpacity="0.75" strokeWidth="1.2" />
      <circle cx={c} cy={c} r="80" fill="none" stroke={GOLD} strokeOpacity="0.35" strokeWidth="0.5" />
      {Array.from({ length: 48 }, (_, i) => {
        const p1 = apt(74, i * 7.5, c, c);
        const p2 = apt(79, i * 7.5, c, c);
        return (
          <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={GOLD} strokeOpacity="0.3" strokeWidth="0.5" />
        );
      })}
      <g
        className={working ? "lyn-seal-work" : "lyn-rot-90"}
        style={{ transformOrigin: "90px 90px", transformBox: "view-box" }}
      >
        <text fontSize="8.5" letterSpacing="3" fill={GOLD} fontFamily="ui-monospace, monospace" opacity="0.9">
          <textPath href="#lyn-seal-ring">RESPONDE · ORACVLVM · ITA · NON · ITERVM ·</textPath>
        </text>
      </g>
      {/* dichotomy mark at the seal&rsquo;s heart */}
      <circle cx={c} cy={c} r="44" fill="none" stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.8" />
      <line x1={c} y1={c + 26} x2={c} y2={c} stroke={GOLD} strokeWidth="1.3" />
      <line x1={c} y1={c} x2={c - 20} y2={c - 20} stroke={VERDI} strokeWidth="1.1" />
      <line x1={c} y1={c} x2={c + 20} y2={c - 20} stroke={RUBRIC} strokeWidth="1.1" />
      <circle cx={c} cy={c} r="4" fill={GOLD} />
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

  const folioNo = String(60 + (count.current % 39)).padStart(2, "0");
  const respNo = String(count.current).padStart(3, "0");

  return (
    <main
      className="relative isolate min-h-screen overflow-x-clip bg-[#06120c] text-[#e6e0c8] antialiased"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 50% 0%, rgba(63,163,124,0.07), transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(201,176,55,0.05), transparent 50%)",
      }}
    >
      <style>{LYN_STYLES}</style>
      <Backdrop />
      <AgeLayer />

      {/* ======================= 1 · CODEX HEADER BAR ======================= */}
      <header className="border-b border-[#c9b037]/25">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="flex items-center gap-4 py-3">
            <a href="#lyn-top" className="flex items-baseline gap-2">
              <span aria-hidden className="text-[11px] text-[#c9b037]">✦</span>
              <span className="font-serif text-sm font-bold tracking-[0.3em] text-[#c9b037]">
                ASTRO SCOPE
              </span>
              <span className="hidden font-mono text-[7px] tracking-[0.25em] text-[#3fa37c]/70 sm:inline">
                CODEX SMARAGDINVS
              </span>
            </a>
            <span className="hidden font-mono text-[7px] tracking-[0.2em] text-[#e6e0c8]/30 lg:inline">
              LIBER TAROTI · FOL. {folioNo} · MMXXVI
            </span>
            <nav className="ml-auto flex items-center gap-4 font-mono text-[9px] tracking-[0.25em] sm:gap-6">
              <a href="#lyn-oracle" className="hidden text-[#e6e0c8]/60 transition-colors hover:text-[#c9b037] sm:inline">
                THE ORACLE
              </a>
              <a href="#lyn-precepts" className="hidden text-[#e6e0c8]/60 transition-colors hover:text-[#c9b037] sm:inline">
                HOW TO ASK
              </a>
              <a href="#lyn-dubia" className="hidden text-[#e6e0c8]/60 transition-colors hover:text-[#c9b037] md:inline">
                Q&amp;A
              </a>
              <a
                href="#lyn-oracle"
                className="border border-[#c9b037]/50 px-3 py-1.5 text-[#c9b037] transition-colors hover:bg-[#c9b037] hover:text-[#06120c]"
              >
                PRESS THE SEAL
              </a>
            </nav>
          </div>
          {/* engraved double rule */}
          <div aria-hidden className="pb-2">
            <div className="lyn-bleed h-px bg-[#c9b037]/40" />
            <div className="mt-[3px] flex items-center gap-2">
              <span className="lyn-bleed h-px flex-1 bg-[#c9b037]/15" />
              <span className="font-mono text-[6px] tracking-[0.4em] text-[#e6e0c8]/25">
                INCIPIT ORACVLVM BIFVRCATVM · DE ITA ET NON
              </span>
              <span className="lyn-bleed h-px flex-1 bg-[#c9b037]/15" />
            </div>
          </div>
        </div>
      </header>

      {/* ======================= 2 · HERO — BROKEN CHAPTER OPENING ======================= */}
      <section id="lyn-top" className="relative overflow-hidden border-b border-[#c9b037]/25">
        {/* marginal scales */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-16 left-3 hidden w-px lg:block"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(201,176,55,0.4) 0 1px, transparent 1px 18px)",
            width: "8px",
          }}
        />
        <span aria-hidden className="absolute left-5 top-24 hidden -rotate-90 font-mono text-[6px] tracking-[0.3em] text-[#e6e0c8]/25 lg:inline">
          SCALA · DVBII
        </span>
        <span aria-hidden className="absolute right-5 top-32 hidden rotate-90 font-mono text-[6px] tracking-[0.3em] text-[#e6e0c8]/25 lg:inline">
          PONDVS · RESPONSI
        </span>

        <div className="relative mx-auto max-w-[1400px] px-4 pb-14 pt-10 sm:px-6 sm:pt-16">
          {/* eyebrow — offset left, not centered */}
          <div className="relative z-10 mb-8 flex items-center gap-3 font-mono text-[8px] tracking-[0.45em] text-[#3fa37c] sm:ml-[8%] sm:text-[9px]">
            <span className="h-px w-10 bg-[#3fa37c]/40 sm:w-24" />
            CAPVT VII · ORACVLVM BIFVRCATVM
          </div>

          <div className="relative">
            {/* headline block — pushed off-center, hanging Y */}
            <div className="relative z-10 max-w-2xl sm:ml-[14%] lg:ml-[20%]">
              <div className="relative">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -left-10 -top-14 select-none font-serif text-[11rem] leading-none text-[#c9b037]/[0.07] sm:-left-24 sm:text-[17rem]"
                >
                  ?
                </span>
                <h1 className="relative font-serif text-4xl leading-[1.08] tracking-[0.03em] text-[#e6e0c8] sm:text-6xl">
                  One question.
                  <br />
                  <span className="text-[#3fa37c]">One word</span>
                  <span className="text-[#c9b037]"> in answer.</span>
                </h1>
              </div>
              <p className="mt-6 max-w-md text-[13px] leading-relaxed text-[#e6e0c8]/60 sm:text-sm">
                The yes/no oracle is the oldest cut of the deck — a single card drawn
                for a single doubt. Frame the question, press the seal, and take
                the word the cards return: YES, NO, or ASK AGAIN.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <a
                  href="#lyn-oracle"
                  className="lyn-gilt inline-flex items-center gap-3 border border-[#e3cd5a]/60 bg-[#c9b037] px-7 py-3 font-mono text-[10px] font-bold tracking-[0.22em] text-[#06120c] shadow-[0_0_24px_rgba(201,176,55,0.25)] transition-colors hover:bg-[#e3cd5a]"
                >
                  <span aria-hidden className="flex h-4 w-4 items-center justify-center rounded-full border border-[#06120c]/50 text-[8px]">✦</span>
                  CONSULT THE ORACLE
                </a>
                <a
                  href="#lyn-precepts"
                  className="inline-flex items-center gap-2 border border-[#c9b037]/40 px-6 py-3 font-mono text-[10px] tracking-[0.22em] text-[#c9b037] transition-colors hover:bg-[#c9b037]/10"
                >
                  READ THE PRECEPTS <span aria-hidden>→</span>
                </a>
              </div>
            </div>

            {/* fork diagram plate — overlapping the headline column from the right */}
            <div className="pointer-events-none relative z-0 mx-auto -mt-8 w-64 rotate-3 opacity-90 sm:absolute sm:right-[2%] sm:top-[6%] sm:mt-0 sm:w-72 lg:right-[6%] lg:w-80">
              <svg viewBox="0 0 320 340" className="w-full" role="img" aria-label="Figura I — the bifurcated beam">
                <rect x="6" y="6" width="308" height="328" fill={PLATE} fillOpacity="0.85" stroke={GOLD} strokeOpacity="0.4" strokeWidth="0.8" />
                <rect x="12" y="12" width="296" height="316" fill="none" stroke={GOLD} strokeOpacity="0.15" strokeWidth="0.5" />
                <text x="160" y="36" textAnchor="middle" fontSize="8" letterSpacing="3" fill={VERDI} fontFamily="ui-monospace, monospace">
                  FIG. I — RADIUS BIFVRCATVS
                </text>
                {/* protractor arc */}
                <path d="M 60 260 A 100 100 0 0 1 260 260" fill="none" stroke={GOLD} strokeOpacity="0.4" strokeWidth="0.7" />
                {Array.from({ length: 19 }, (_, i) => {
                  const a = 180 + i * 10;
                  const p1 = apt(i % 9 === 0 ? 88 : 94, a, 160, 260);
                  const p2 = apt(100, a, 160, 260);
                  return (
                    <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={GOLD} strokeOpacity="0.45" strokeWidth="0.6" />
                  );
                })}
                {/* stem and two rays */}
                <line x1="160" y1="290" x2="160" y2="200" stroke={GOLD} strokeWidth="1.5" />
                <line x1="160" y1="200" x2="88" y2="96" stroke={VERDI} strokeWidth="1.2" className="lyn-beam" />
                <line x1="160" y1="200" x2="232" y2="96" stroke={RUBRIC} strokeWidth="1.2" className="lyn-beam" style={{ animationDelay: "3s" }} />
                <circle cx="160" cy="200" r="7" fill={GROUND} stroke={GOLD} strokeWidth="1" />
                <circle cx="160" cy="200" r="2.5" fill={GOLD} />
                <circle cx="88" cy="96" r="10" fill={PLATE} stroke={VERDI} strokeWidth="0.9" />
                <text x="88" y="100" textAnchor="middle" fontSize="8" fill={VERDI} fontFamily="ui-monospace, monospace">ITA</text>
                <circle cx="232" cy="96" r="10" fill={PLATE} stroke={RUBRIC} strokeWidth="0.9" />
                <text x="232" y="100" textAnchor="middle" fontSize="8" fill={RUBRIC} fontFamily="ui-monospace, monospace">NON</text>
                <text x="62" y="66" textAnchor="middle" fontSize="7" fill={GOLD_DIM} fontFamily="ui-monospace, monospace">42</text>
                <text x="258" y="66" textAnchor="middle" fontSize="7" fill={GOLD_DIM} fontFamily="ui-monospace, monospace">42</text>
                <text x="160" y="76" textAnchor="middle" fontSize="7" fill={GOLD_DIM} fontFamily="ui-monospace, monospace">16</text>
                <text x="160" y="318" textAnchor="middle" fontSize="6" letterSpacing="2" fill={GOLD_DIM} fontFamily="ui-monospace, monospace">
                  PONDERA · ITA 42 · NON 42 · ITERVM 16
                </text>
              </svg>
              {/* stamp straddling the plate corner */}
              <span className="absolute -left-6 -top-4 rotate-[-8deg] border border-[#3fa37c]/60 bg-[#06120c]/90 px-2 py-1 font-mono text-[6px] tracking-[0.3em] text-[#3fa37c]">
                PROBATVM
              </span>
            </div>

            {/* hero readout strip — offset right, overlapping the fork plate foot */}
            <div className="relative z-10 mt-10 flex max-w-2xl flex-wrap items-center gap-x-8 gap-y-2 border-t border-[#c9b037]/20 pt-4 font-mono text-[7px] tracking-[0.25em] text-[#e6e0c8]/35 sm:ml-[22%] lg:ml-[30%]">
              <span>DECK · 78 LEAVES</span>
              <span className="lyn-flicker text-[#3fa37c]">● SEAL READY</span>
              <span>☽︎ HOUR UNFIXED</span>
              <span>NO COIN REQUIRED · $0</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= 3 · THE ORACLE CENTERPIECE ======================= */}
      <section id="lyn-oracle" className="relative border-b border-[#c9b037]/25 bg-[#08160e]/70">
        {/* vertical label straddling the top border */}
        <span className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 border border-[#c9b037]/40 bg-[#06120c] px-3 py-1 font-mono text-[7px] tracking-[0.4em] text-[#c9b037]">
          TABVLA RESPONSORVM
        </span>

        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
          <div className="relative flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-center lg:gap-0">

            {/* left marginal note — hanging outside the plate */}
            <aside className="hidden w-52 -rotate-1 flex-col gap-3 border-r border-[#c9b037]/15 pr-5 pt-10 lg:mr-[-30px] lg:flex lg:translate-y-16">
              <span className="font-mono text-[6px] tracking-[0.3em] text-[#3fa37c]/60">NOTA · MARG.</span>
              <p className="font-serif text-[12px] italic leading-relaxed text-[#e6e0c8]/40">
                hic respondetur semel — the answer is given once, and the wax remembers.
              </p>
              <span aria-hidden className="text-[9px] text-[#c9b037]/40">❧</span>
              <div className="mt-4 space-y-1 font-mono text-[6px] tracking-[0.25em] text-[#e6e0c8]/30">
                <div>ITER I — FRAME THE DOUBT</div>
                <div>ITER II — PRESS THE SEAL</div>
                <div>ITER III — TAKE THE WORD</div>
              </div>
            </aside>

            {/* the codex plate */}
            <div className="lyn-mottle relative w-full max-w-xl -rotate-[0.8deg] border border-[#c9b037]/30 bg-[#0a1a12]/85 px-6 py-8 sm:px-10">
              <span aria-hidden className="pointer-events-none absolute inset-[4px] border border-[#c9b037]/15" />
              <Corners />
              {/* folio stamp straddling the plate edge */}
              <span className="absolute -right-4 -top-3 rotate-6 border border-[#c9b037]/50 bg-[#06120c] px-2 py-1 font-mono text-[6px] tracking-[0.3em] text-[#c9b037]/80">
                FOL. {folioNo} · RECTO
              </span>

              <div className="text-center">
                <div className="font-mono text-[8px] tracking-[0.4em] text-[#3fa37c]">
                  ORACVLVM · ITA / NON / ITERVM
                </div>
                <h2 className="mt-2 font-serif text-2xl tracking-[0.1em] text-[#c9b037] sm:text-3xl">
                  PRESS THE SEAL
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-[11px] leading-relaxed text-[#e6e0c8]/50 sm:text-[12px]">
                  Hold your question behind your eyes for one breath.
                  Then press — the plate below will bear the word.
                </p>
              </div>

              {/* seal button */}
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={phase === "revealed" ? reset : consult}
                  disabled={phase === "working"}
                  aria-label={phase === "revealed" ? "Seal another question" : "Press the seal to consult the oracle"}
                  className="lyn-seal-btn relative h-40 w-40 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9b037]/70 sm:h-44 sm:w-44"
                >
                  <SealSigil working={phase === "working"} />
                  <span className="absolute inset-x-0 -bottom-1 text-center font-mono text-[7px] tracking-[0.3em] text-[#e6e0c8]/45">
                    {phase === "working"
                      ? "CONSVLTANDO…"
                      : phase === "revealed"
                        ? "PRESS TO SEAL ANOTHER"
                        : "PRESS"}
                  </span>
                </button>
              </div>

              {/* the verdict plate */}
              <div className="mt-8 min-h-[190px]">
                {phase === "idle" && (
                  <div className="flex h-[190px] flex-col items-center justify-center gap-3 border border-dashed border-[#c9b037]/25 text-center">
                    <span aria-hidden className="text-lg text-[#c9b037]/40">✶</span>
                    <span className="font-mono text-[8px] tracking-[0.35em] text-[#e6e0c8]/35">
                      THE PLATE AWAITS A QUESTION
                    </span>
                    <span className="font-mono text-[6px] tracking-[0.25em] text-[#e6e0c8]/25">
                      NVLLVM RESPONSVM · ADHVC
                    </span>
                  </div>
                )}

                {phase === "working" && (
                  <div className="flex h-[190px] flex-col items-center justify-center gap-4 border border-[#c9b037]/25 text-center">
                    <div className="flex gap-2">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="lyn-dot h-1.5 w-1.5 rounded-full bg-[#c9b037]"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[8px] tracking-[0.35em] text-[#c9b037]/80">
                      THE DECK IS WEIGHING
                    </span>
                    <span className="font-mono text-[6px] tracking-[0.25em] text-[#e6e0c8]/30">
                      PONDERATIO · 42 : 42 : 16
                    </span>
                  </div>
                )}

                {phase === "revealed" && verdict && (
                  <div
                    key={`${verdict.key}-${respNo}`}
                    className="lyn-reveal relative border bg-[#06120c]/70 p-5 sm:p-6"
                    style={{ borderColor: `${verdict.color}55` }}
                  >
                    <Corners />
                    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
                      <VerdictDiagram k={verdict.key} />
                      <div className="min-w-0 text-center sm:text-left">
                        <div
                          className="font-serif text-4xl tracking-[0.12em] sm:text-5xl"
                          style={{ color: verdict.color }}
                        >
                          {verdict.word}
                        </div>
                        <div className="mt-1 font-mono text-[8px] tracking-[0.4em]" style={{ color: verdict.color }}>
                          {verdict.latin}
                        </div>
                        <p className="mt-3 max-w-xs text-[12px] italic leading-relaxed text-[#e6e0c8]/65">
                          {verdict.counsel}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-[#c9b037]/15 pt-3 font-mono text-[6px] tracking-[0.25em] text-[#e6e0c8]/30">
                      <span>RESP. Nº {respNo}</span>
                      <span>PRIMVM RESPONSVM STAT</span>
                      <span>FOL. {folioNo}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* tally strip */}
              <div className="mt-5 flex items-center justify-center gap-x-6 gap-y-1 border-t border-[#c9b037]/15 pt-3 font-mono text-[7px] tracking-[0.25em] text-[#e6e0c8]/35">
                <span>CONSVLT. Nº {respNo}</span>
                <span className="text-[#3fa37c]">ITA × {tally.YES}</span>
                <span style={{ color: RUBRIC }}>NON × {tally.NO}</span>
                <span className="text-[#c9b037]">ITERVM × {tally.AGAIN}</span>
              </div>
            </div>

            {/* right overhang — a small rotated card plate bleeding off the main plate */}
            <div className="relative hidden w-44 lg:-ml-10 lg:mt-40 lg:block lg:rotate-[4deg]">
              <div className="lyn-mottle border border-[#c9b037]/30 bg-[#0a1a12]/90 p-4 text-center">
                <span aria-hidden className="pointer-events-none absolute inset-[3px] border border-[#c9b037]/10" />
                <div className="font-mono text-[6px] tracking-[0.3em] text-[#3fa37c]">CHARTA ORACVLI</div>
                <div className="mx-auto my-3 flex h-24 w-16 flex-col items-center justify-center gap-1 border border-[#c9b037]/50 bg-[#06120c]/70">
                  <span className="font-mono text-[7px] text-[#3fa37c]">0 / I</span>
                  <span className="text-[18px] text-[#c9b037]">✶</span>
                  <span className="font-mono text-[5px] tracking-[0.2em] text-[#e6e0c8]/40">VNA CHARTA</span>
                </div>
                <p className="font-mono text-[6px] leading-relaxed tracking-[0.15em] text-[#e6e0c8]/35">
                  ONE LEAF DRAWN
                  <br />
                  FOR ONE DOUBT
                </p>
              </div>
            </div>
          </div>

          <div className="mt-14">
            <Hairline label="RESPONDE · QVOD ROGAVERIS · ET ABI" />
          </div>
        </div>
      </section>

      {/* ======================= 4 · HOW TO ASK — PRECEPTS ======================= */}
      <section id="lyn-precepts" className="border-b border-[#c9b037]/25">
        <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6">
          {/* section head — pushed left, oversized numeral overlapping */}
          <div className="relative mb-10 sm:ml-[6%]">
            <span aria-hidden className="pointer-events-none absolute -top-10 left-0 select-none font-serif text-[9rem] leading-none text-[#c9b037]/[0.06]">
              IV
            </span>
            <div className="relative flex items-center gap-3 font-mono text-[8px] tracking-[0.4em] text-[#3fa37c]/80">
              <span className="h-px w-8 bg-[#3fa37c]/40 sm:w-20" />
              PRAECEPTA · I – IV
            </div>
            <h2 className="relative mt-3 font-serif text-2xl tracking-[0.14em] text-[#c9b037] sm:text-4xl">
              HOW TO ASK
            </h2>
            <p className="relative mt-2 font-mono text-[8px] tracking-[0.3em] text-[#e6e0c8]/40 sm:text-[9px]">
              THE FOUR RULES WRITTEN ABOVE THE SEAL
            </p>
          </div>

          <div>
            {PRECEPTS.map((p, i) => (
              <article
                key={p.no}
                className={`grid gap-3 py-7 lg:grid-cols-[120px_minmax(0,1fr)_200px] lg:gap-8 ${
                  i > 0 ? "border-t border-[#c9b037]/15" : ""
                } ${i % 2 === 1 ? "lg:ml-24" : ""}`}
              >
                {/* numeral overlapping the hairline above */}
                <div
                  className={`relative z-10 font-serif text-6xl leading-none text-[#c9b037]/85 sm:text-7xl ${
                    i > 0 ? "-mt-3 lg:-mt-7" : ""
                  } ${i % 2 === 1 ? "lg:rotate-2" : "lg:-rotate-2"}`}
                >
                  {p.no}
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-xl tracking-[0.06em] text-[#e6e0c8] sm:text-2xl">
                    {p.title}
                  </h3>
                  <div className="my-2.5 flex items-center gap-2">
                    <span className="h-px w-12 bg-[#c9b037]/50" />
                    <span aria-hidden className="text-[7px] text-[#c9b037]/70">◆</span>
                    <span className="h-px w-20 bg-[#c9b037]/20" />
                  </div>
                  <p className="max-w-lg text-[12px] leading-relaxed text-[#e6e0c8]/55 sm:text-[13px]">
                    {p.copy}
                  </p>
                </div>
                {/* marginal gloss */}
                <aside className="hidden flex-col justify-center border-l border-[#c9b037]/15 pl-4 lg:flex">
                  <span className="font-mono text-[6px] tracking-[0.3em] text-[#3fa37c]/60">
                    PRAECEPTVM · {p.no}
                  </span>
                  <p className="mt-1 font-serif text-[11px] italic text-[#e6e0c8]/35">{p.gloss}</p>
                </aside>
              </article>
            ))}
          </div>

          <div className="mt-8 lg:ml-24">
            <Hairline label="QVIDQVID ROGAVERIS · SIMPLICITER ROGA" />
          </div>
        </div>
      </section>

      {/* ======================= 5 · DVBIA — FAQ ======================= */}
      <section id="lyn-dubia" className="relative border-b border-[#c9b037]/25 bg-[#08160e]/70">
        {/* diagram bleeding off the right edge behind the answers */}
        <svg
          viewBox="0 0 300 300"
          aria-hidden
          className="lyn-rot-140r pointer-events-none absolute -right-28 top-16 h-96 w-96 opacity-[0.07]"
        >
          <circle cx="150" cy="150" r="146" fill="none" stroke={GOLD} strokeWidth="1" />
          <polygon points={apoly(120, 4, -90, 150, 150)} fill="none" stroke={GOLD} strokeWidth="0.8" />
          <polygon points={apoly(120, 4, -45, 150, 150)} fill="none" stroke={VERDI} strokeWidth="0.8" />
          <circle cx="150" cy="150" r="40" fill="none" stroke={GOLD} strokeWidth="0.7" />
        </svg>

        <div className="relative mx-auto max-w-[1400px] px-4 py-14 sm:px-6">
          <div className="relative mb-8 sm:ml-[18%]">
            <div className="flex items-center gap-3 font-mono text-[8px] tracking-[0.4em] text-[#3fa37c]/80">
              <span className="h-px w-8 bg-[#3fa37c]/40 sm:w-16" />
              DVBIA · ET RESPONSA
            </div>
            <h2 className="mt-3 font-serif text-2xl tracking-[0.14em] text-[#c9b037] sm:text-4xl">
              QUAESTIONES
            </h2>
            <p className="mt-2 font-mono text-[8px] tracking-[0.3em] text-[#e6e0c8]/40 sm:text-[9px]">
              GATHERED FROM THE MARGINS OF THE ORACLE
            </p>
          </div>

          <dl className="max-w-3xl lg:ml-40">
            {FAQ.map((f, i) => (
              <div key={f.q} className={`py-6 ${i > 0 ? "border-t border-[#c9b037]/15" : ""} ${i === 1 ? "lg:ml-16" : ""}`}>
                <dt className="flex items-baseline gap-4">
                  <span className="shrink-0 font-serif text-2xl text-[#c9b037]">
                    {["Q. I", "Q. II", "Q. III"][i]}
                  </span>
                  <span className="font-serif text-lg tracking-[0.03em] text-[#e6e0c8] sm:text-xl">
                    {f.q}
                  </span>
                </dt>
                <dd className="mt-3 flex items-start gap-4 pl-2 sm:pl-14">
                  <span className="mt-0.5 shrink-0 font-serif text-base italic text-[#3fa37c]">R.</span>
                  <p className="border-l-2 border-[#c9b037]/25 pl-4 text-[12px] leading-relaxed text-[#e6e0c8]/55 sm:text-[13px]">
                    {f.a}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ======================= 6 · FINAL CTA ======================= */}
      <section className="relative overflow-hidden border-b border-[#c9b037]/25">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
          <div className="relative flex flex-col items-center text-center">
            {/* small seal */}
            <div className="mb-6 h-20 w-20 -rotate-3">
              <SealSigil working={false} />
            </div>
            <div className="mb-3 font-mono text-[8px] tracking-[0.4em] text-[#3fa37c]/80">
              VLTIMA CHARTA · ONE MORE LEAF
            </div>
            <h2 className="max-w-2xl font-serif text-3xl leading-tight tracking-[0.04em] text-[#e6e0c8] sm:text-5xl sm:leading-[1.15]">
              The word is only the doorway.{" "}
              <span className="text-[#c9b037]">The spread is the room.</span>
            </h2>
            <p className="mt-4 max-w-md text-[12px] leading-relaxed text-[#e6e0c8]/55 sm:text-[13px]">
              When one card is not enough — past, present and future; love; career —
              the longer spreads wait on the same shelf.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
              <a
                href="#lyn-oracle"
                className="lyn-gilt inline-flex items-center gap-3 border border-[#e3cd5a]/60 bg-[#c9b037] px-8 py-3.5 font-mono text-[11px] font-bold tracking-[0.25em] text-[#06120c] shadow-[0_0_24px_rgba(201,176,55,0.25)] transition-colors hover:bg-[#e3cd5a]"
              >
                ASK AGAIN — IT&rsquo;S FREE <span aria-hidden>→</span>
              </a>
              <a
                href="#lyn-top"
                className="inline-flex items-center gap-2 border border-[#c9b037]/40 px-6 py-3 font-mono text-[10px] tracking-[0.22em] text-[#c9b037] transition-colors hover:bg-[#c9b037]/10"
              >
                ALL SPREADS
              </a>
            </div>
            <div className="mt-5 font-mono text-[8px] tracking-[0.3em] text-[#e6e0c8]/35">
              YES · NO · ASK AGAIN — $0
            </div>
            <div className="mx-auto mt-10 w-full max-w-xl">
              <Hairline label="OMNIA VANITAS · PRAETER ASTRA" />
            </div>
          </div>
        </div>
      </section>

      {/* ======================= 7 · COLOPHON FOOTER ======================= */}
      <footer>
        <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
          <div className="flex flex-col items-center gap-5 md:flex-row md:justify-between">
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-sm font-bold tracking-[0.3em] text-[#c9b037]">ASTRO SCOPE</span>
              <span className="font-mono text-[7px] tracking-[0.25em] text-[#e6e0c8]/30">
                CODEX SMARAGDINVS · LIBER TAROTI
              </span>
            </div>
            <nav className="flex gap-6 font-mono text-[8px] tracking-[0.25em] text-[#e6e0c8]/40">
              <a href="#lyn-oracle" className="transition-colors hover:text-[#c9b037]">THE ORACLE</a>
              <a href="#lyn-precepts" className="transition-colors hover:text-[#c9b037]">HOW TO ASK</a>
              <a href="#lyn-dubia" className="transition-colors hover:text-[#c9b037]">Q&amp;A</a>
            </nav>
            <span className="font-mono text-[8px] tracking-[0.25em] text-[#e6e0c8]/25">
              © MMXXVI · AS ABOVE · SO BELOW
            </span>
          </div>
          <div className="mt-6 border-t border-[#c9b037]/15 pt-4 text-center">
            <p className="font-mono text-[6px] leading-relaxed tracking-[0.3em] text-[#e6e0c8]/25">
              EXPLICIT ORACVLVM BIFVRCATVM · SCRIPTVM ET ILLVMINATVM IN ANNO MMXXVI ·
              FELICITER · FELICITER · FELICITER
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
