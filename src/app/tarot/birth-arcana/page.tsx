"use client";

import { useRef, useState } from "react";
import { calculateBirthArcana, getArcana } from "@/lib/arcana";
import type { ArcanaCard } from "@/lib/arcana";

/* ------------------------------------------------------------------ */
/* Palette (emerald-gold codex, after the Codex benchmark)             */
/* ------------------------------------------------------------------ */
const GOLD = "#c9b037";
const GOLD_DIM = "#8f7f2a";
const VERDI = "#3fa37c";
const CREAM = "#e6e0c8";
const GROUND = "#06120c";
const PLATE = "#0a1a12";

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
/* Text helpers                                                        */
/* ------------------------------------------------------------------ */
const ROMAN_TABLE: ReadonlyArray<readonly [number, string]> = [
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
function toRoman(n: number): string {
  let rest = n;
  let out = "";
  for (const [v, s] of ROMAN_TABLE) {
    while (rest >= v) {
      out += s;
      rest -= v;
    }
  }
  return out;
}

/* Variation selector U+FE0E — every zodiac / planet glyph is text-style. */
const VS15 = "\uFE0E";
const g = (base: string) => base + VS15;

const ASTRO_GLYPHS: Record<string, string> = {
  Sun: g("☉"),
  Moon: g("☽"),
  Mercury: g("☿"),
  Venus: g("♀"),
  Mars: g("♂"),
  Jupiter: g("♃"),
  Saturn: g("♄"),
  Uranus: g("♅"),
  Neptune: g("♆"),
  Pluto: g("♇"),
  Aries: g("♈"),
  Taurus: g("♉"),
  Gemini: g("♊"),
  Cancer: g("♋"),
  Leo: g("♌"),
  Virgo: g("♍"),
  Libra: g("♎"),
  Scorpio: g("♏"),
  Sagittarius: g("♐"),
  Capricorn: g("♑"),
  Aquarius: g("♒"),
  Pisces: g("♓"),
};

const sumDigits = (n: number) =>
  String(n)
    .split("")
    .reduce((a, d) => a + parseInt(d, 10), 0);

/** Reduction chain for the worked readout, e.g. [31, 4]. */
function birthChain(day: number, month: number, year: number): number[] {
  const raw = `${day}${month}${year}`
    .split("")
    .reduce((a, d) => a + parseInt(d, 10), 0);
  const chain = [raw];
  let t = raw;
  while (t > 22) {
    t = sumDigits(t);
    chain.push(t);
  }
  return chain;
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */
const STEPS = [
  {
    no: "I",
    title: "SUM THE DIGITS",
    lat: "SVMMA OMNIUM",
    copy: "Write the birth date — day, month, year — and add every single digit together. Nothing is skipped, nothing is weighted.",
  },
  {
    no: "II",
    title: "FOLD ABOVE 22",
    lat: "PLICA SVPER XXII",
    copy: "If the sum exceeds 22, add its digits again. Repeat the folding until the number rests between 1 and 22.",
  },
  {
    no: "III",
    title: "READ THE ARCANA",
    lat: "LEGE ARCANVM",
    copy: "The final number names one of the 22 Major Arcana. A sum of exactly 22 is kept whole — it is The Fool, zero wearing a number.",
  },
];

const FAQ = [
  {
    q: "What does my Birth Arcana actually tell me?",
    a: "It names the Major Arcana card that stands over your birth date — your life mission, your natural qualities and talents, the lessons that will keep returning until learned, and the general direction of your spiritual growth. Think of it less as fortune-telling and more as the title page of your own chapter.",
  },
  {
    q: "Why is 22 kept as The Fool instead of reducing to 4?",
    a: "Because the Major Arcana run from 0 to 21 — twenty-two cards. In this count The Fool is both nothing and everything: the unnumbered wanderer. When a birth date folds down to exactly 22, the tradition keeps it whole rather than pressing it into The Emperor's chair.",
  },
  {
    q: "How is this different from a Life Path number?",
    a: "Same digits, different fold. The Life Path number reduces the date to a single figure between 1 and 9; the Birth Arcana stops the reduction at 22 so the answer lands on a tarot card. The Destiny Matrix goes further still and maps all 22 arcana across one chart at once.",
  },
];

/* Worked example plate: 14 · 03 · 1985 → 31 → 4 → The Emperor. */
const EXAMPLE = {
  date: "14 · 03 · 1985",
  digits: "1+4+0+3+1+9+8+5",
  sum: 31,
  fold: "3+1",
  result: 4,
};

/* ------------------------------------------------------------------ */
/* Vellum fibre noise (feTurbulence data URI)                          */
/* ------------------------------------------------------------------ */
const NOISE_URI =
  "url(\"data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.55 0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)'/%3E%3C/svg%3E\")";

/* ------------------------------------------------------------------ */
/* Scoped styles (lba- prefix)                                         */
/* ------------------------------------------------------------------ */
const LBA_STYLES = `
  .lba-rot-90   { animation: lba-spin 90s  linear infinite; }
  .lba-rot-120r { animation: lba-spin-rev 120s linear infinite; }
  .lba-rot-180  { animation: lba-spin 180s linear infinite; }
  .lba-rot-240  { animation: lba-spin-rev 240s linear infinite; }
  .lba-pulse    { animation: lba-pulse 9s ease-in-out infinite; }
  .lba-pulse-2  { animation: lba-pulse 15s ease-in-out infinite; }
  .lba-flicker  { animation: lba-flicker 11s ease-in-out infinite; }
  .lba-candle   { animation: lba-candle 9s ease-in-out infinite; }
  .lba-drift    { animation: lba-drift 48s ease-in-out infinite alternate; }
  @keyframes lba-spin     { to { transform: rotate(360deg); } }
  @keyframes lba-spin-rev { to { transform: rotate(-360deg); } }
  @keyframes lba-pulse    { 0%,100% { opacity: .4; } 50% { opacity: 1; } }
  @keyframes lba-flicker  { 0%,100% { opacity: .9; } 47% { opacity: .5; } 53% { opacity: .8; } }
  @keyframes lba-candle   { 0%,100% { opacity: .55; } 37% { opacity: .85; } 52% { opacity: .6; } 71% { opacity: .95; } }
  @keyframes lba-drift    { from { transform: translate3d(0,0,0); } to { transform: translate3d(2.5%, -1.5%, 0); } }
  /* --- result reveal: illumination drawn on, then ink rises --- */
  .lba-draw  { stroke-dasharray: 1400; stroke-dashoffset: 1400; animation: lba-draw 2.6s ease-out forwards; }
  .lba-draw-slow { stroke-dasharray: 900; stroke-dashoffset: 900; animation: lba-draw 3.4s ease-out forwards; }
  .lba-rise  { opacity: 0; transform: translateY(10px); animation: lba-rise 0.9s ease-out forwards; }
  @keyframes lba-draw { to { stroke-dashoffset: 0; } }
  @keyframes lba-rise { to { opacity: 1; transform: translateY(0); } }
  /* --- age layer --- */
  .lba-vellum { background-image: ${NOISE_URI}; background-size: 220px 220px; }
  .lba-gilt { position: relative; }
  .lba-gilt::after {
    content: ""; position: absolute; inset: 0; pointer-events: none;
    background-image: ${NOISE_URI}; background-size: 160px 160px;
    opacity: .22; mix-blend-mode: multiply;
  }
  .lba-mottle { position: relative; }
  .lba-mottle::before {
    content: ""; position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 60% 45% at 18% 12%, rgba(230,224,200,0.05), transparent 60%),
      radial-gradient(ellipse 50% 40% at 84% 88%, rgba(120,95,40,0.07), transparent 60%),
      radial-gradient(ellipse 40% 35% at 70% 20%, rgba(63,163,124,0.05), transparent 65%);
  }
  .lba-bleed {
    box-shadow: 0 0 1.5px rgba(12,9,3,0.9), 0 0 3px rgba(201,176,55,0.25);
  }
  .lba-input { background: transparent; outline: none; }
  .lba-input:focus { background: rgba(201,176,55,0.05); }
  .lba-input::selection { background: rgba(201,176,55,0.3); }
  @media (prefers-reduced-motion: reduce) {
    .lba-rot-90, .lba-rot-120r, .lba-rot-180, .lba-rot-240,
    .lba-pulse, .lba-pulse-2, .lba-flicker, .lba-candle, .lba-drift { animation: none !important; }
    .lba-draw, .lba-draw-slow { animation: none !important; stroke-dashoffset: 0; }
    .lba-rise { animation: none !important; opacity: 1; transform: none; }
  }
`;

/* ------------------------------------------------------------------ */
/* Background graphic layers (behind everything)                       */
/* ------------------------------------------------------------------ */
const BIG_GLYPHS = [
  { g: "✶", top: "7%", left: "58%", size: 260, o: 0.05 },
  { g: g("☉"), top: "30%", left: "86%", size: 180, o: 0.055 },
  { g: g("☽"), top: "52%", left: "4%", size: 210, o: 0.05 },
  { g: g("♄"), top: "76%", left: "64%", size: 190, o: 0.05 },
  { g: "❧", top: "92%", left: "22%", size: 160, o: 0.045 },
];

const SPECKS = Array.from({ length: 44 }, (_, i) => ({
  top: `${(i * 53 + 7) % 100}%`,
  left: `${(i * 37 + 11) % 100}%`,
  s: 1 + ((i * 7) % 3) * 0.7,
  o: 0.15 + ((i * 11) % 10) / 40,
}));

function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* hairline construction circles & chords crossing the whole leaf */}
      <svg
        viewBox="0 0 1600 3200"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <g fill="none" stroke={VERDI} strokeOpacity="0.09" strokeWidth="1">
          <circle cx="800" cy="460" r="600" />
          <circle cx="800" cy="460" r="410" />
          <circle cx="160" cy="1500" r="540" />
          <circle cx="1450" cy="1900" r="500" />
          <circle cx="760" cy="2780" r="640" />
        </g>
        <g fill="none" stroke={GOLD} strokeOpacity="0.08" strokeWidth="1">
          <polygon points={apoly(410, 3, -90, 800, 460)} />
          <polygon points={apoly(410, 3, 90, 800, 460)} />
          <polygon points={apoly(640, 6, -90, 760, 2780)} />
          <polygon points={apoly(640, 6, -60, 760, 2780)} />
          <line x1="-100" y1="1080" x2="1700" y2="900" />
          <line x1="-100" y1="2300" x2="1700" y2="2450" />
          <line x1="300" y1="-50" x2="540" y2="3250" />
          <line x1="1300" y1="-50" x2="1060" y2="3250" />
        </g>
        <g fill="none" stroke={GOLD} strokeOpacity="0.1" strokeWidth="0.6" strokeDasharray="2 5">
          <circle cx="800" cy="460" r="230" />
          <circle cx="760" cy="2780" r="360" />
        </g>
      </svg>

      {/* giant wheel of the 22, mostly off the upper-left corner */}
      <svg
        viewBox="0 0 600 600"
        className="lba-rot-180 absolute -left-80 -top-80 h-[940px] w-[940px] opacity-[0.08]"
      >
        <g fill="none" stroke={GOLD} strokeWidth="1">
          <circle cx="300" cy="300" r="292" strokeOpacity="0.8" />
          <circle cx="300" cy="300" r="284" strokeOpacity="0.3" strokeWidth="0.5" />
          <circle cx="300" cy="300" r="238" strokeOpacity="0.5" />
          <polygon points={apoly(238, 4, -90, 300, 300)} strokeOpacity="0.6" />
          <polygon points={apoly(238, 4, -45, 300, 300)} strokeOpacity="0.6" />
          <polygon points={apoly(148, 3, -90, 300, 300)} stroke={VERDI} strokeOpacity="0.5" />
          <polygon points={apoly(148, 3, 90, 300, 300)} stroke={VERDI} strokeOpacity="0.5" />
          <circle cx="300" cy="300" r="60" strokeOpacity="0.7" />
        </g>
        {Array.from({ length: 22 }, (_, i) => {
          const a = -90 + (360 / 22) * i;
          const p = apt(266, a, 300, 300);
          return (
            <text
              key={i}
              x={p.x}
              y={p.y + 3}
              textAnchor="middle"
              fontSize="9"
              fill={GOLD}
              opacity="0.7"
              fontFamily="ui-monospace, monospace"
            >
              {toRoman(i + 1)}
            </text>
          );
        })}
        {Array.from({ length: 88 }, (_, i) => {
          const p1 = apt(i % 4 === 0 ? 246 : 252, (360 / 88) * i, 300, 300);
          const p2 = apt(258, (360 / 88) * i, 300, 300);
          return (
            <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.6" />
          );
        })}
      </svg>

      {/* slowly-turning arcana ring, half off the right edge */}
      <svg
        viewBox="0 0 600 600"
        className="lba-rot-240 absolute -right-[330px] top-[26%] h-[800px] w-[800px] opacity-[0.1]"
      >
        <circle cx="300" cy="300" r="288" fill="none" stroke={GOLD} strokeOpacity="0.7" strokeWidth="1" />
        <circle cx="300" cy="300" r="214" fill="none" stroke={VERDI} strokeOpacity="0.4" strokeWidth="0.6" strokeDasharray="2 4" />
        {Array.from({ length: 110 }, (_, i) => {
          const p1 = apt(i % 5 === 0 ? 270 : 278, (360 / 110) * i, 300, 300);
          const p2 = apt(288, (360 / 110) * i, 300, 300);
          return (
            <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={GOLD} strokeOpacity="0.6" strokeWidth="0.7" />
          );
        })}
        {Array.from({ length: 22 }, (_, i) => {
          const a = -90 + (360 / 22) * i;
          const p = apt(242, a, 300, 300);
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="15" fill={GROUND} fillOpacity="0.6" stroke={GOLD} strokeOpacity="0.6" strokeWidth="0.8" />
              <text x={p.x} y={p.y + 3.5} textAnchor="middle" fontSize="9" fill={GOLD} fontFamily="ui-monospace, monospace">
                {toRoman(i + 1)}
              </text>
            </g>
          );
        })}
        <polygon points={apoly(150, 3, -90, 300, 300)} fill="none" stroke={GOLD} strokeOpacity="0.4" strokeWidth="0.7" />
        <polygon points={apoly(150, 4, -45, 300, 300)} fill="none" stroke={VERDI} strokeOpacity="0.35" strokeWidth="0.7" />
      </svg>

      {/* faint colossal glyphs looming behind the panels */}
      {BIG_GLYPHS.map((b, i) => (
        <span
          key={i}
          className="absolute select-none"
          style={{ top: b.top, left: b.left, fontSize: b.size, lineHeight: 1, color: CREAM, opacity: b.o }}
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
/* Age layer data (deterministic)                                      */
/* ------------------------------------------------------------------ */
const FOXING = [
  { top: "2.5%", left: "5%", s: 80, o: 0.12 },
  { top: "4%", left: "88%", s: 60, o: 0.1 },
  { top: "14%", left: "94%", s: 46, o: 0.12 },
  { top: "27%", left: "2%", s: 64, o: 0.09 },
  { top: "43%", left: "96%", s: 52, o: 0.11 },
  { top: "58%", left: "1.5%", s: 72, o: 0.1 },
  { top: "71%", left: "93%", s: 58, o: 0.09 },
  { top: "86%", left: "4%", s: 66, o: 0.12 },
  { top: "93%", left: "82%", s: 54, o: 0.1 },
];

function AgeLayer() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      <div className="lba-vellum absolute inset-0 opacity-[0.07]" />
      <div
        className="lba-candle absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 55% 38% at 82% 3%, rgba(255,186,92,0.08), transparent 65%), radial-gradient(ellipse 42% 30% at 10% 97%, rgba(255,170,80,0.05), transparent 60%)",
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
      <span className="lba-bleed h-px flex-1 bg-[#c9b037]/30" />
      <span aria-hidden className="text-[8px] text-[#c9b037]">✦</span>
      <span className="font-mono text-[7px] tracking-[0.35em] text-[#e6e0c8]/40">{label}</span>
      <span aria-hidden className="text-[8px] text-[#c9b037]">✦</span>
      <span className="lba-bleed h-px flex-1 bg-[#c9b037]/30" />
    </div>
  );
}

function SectionHead({
  eyebrow,
  title,
  sub,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  align?: "center" | "left";
}) {
  const alignCls = align === "center" ? "text-center" : "text-left";
  const lineCls =
    align === "center" ? "flex items-center justify-center gap-3" : "flex items-center gap-3";
  return (
    <div className={`mb-8 ${alignCls}`}>
      <div className={`${lineCls} font-mono text-[8px] tracking-[0.4em] text-[#3fa37c]/80`}>
        <span className="h-px w-8 bg-[#3fa37c]/40 sm:w-20" />
        {eyebrow}
        {align === "center" ? <span className="h-px w-8 bg-[#3fa37c]/40 sm:w-20" /> : null}
      </div>
      <h2 className="mt-3 font-serif text-2xl tracking-[0.14em] text-[#c9b037] sm:text-4xl">{title}</h2>
      {sub ? (
        <p className="mt-2 font-mono text-[8px] tracking-[0.3em] text-[#e6e0c8]/40 sm:text-[9px]">{sub}</p>
      ) : null}
    </div>
  );
}

/* Alchemical element mark — tiny drawn triangle, no emoji. */
function ElementMark({ element }: { element: string }) {
  const up = element === "Fire" || element === "Air";
  const barred = element === "Air" || element === "Earth";
  const tri = up ? "6,1.5 10.5,10 1.5,10" : "1.5,2 10.5,2 6,10.5";
  const barY = up ? 12.5 : 12.5;
  return (
    <svg viewBox="0 0 12 14" className="h-3.5 w-3" aria-hidden>
      <polygon points={tri} fill="none" stroke={GOLD} strokeWidth="1" />
      {barred ? <line x1="2.5" y1={barY} x2="9.5" y2={barY} stroke={GOLD} strokeWidth="1" /> : null}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Hero card figure — a small illuminated card, rotated off-frame      */
/* ------------------------------------------------------------------ */
function CardFigure() {
  return (
    <svg viewBox="0 0 150 230" className="h-full w-full" role="img" aria-label="An illuminated tarot card plate">
      <rect x="4" y="4" width="142" height="222" fill={PLATE} stroke={GOLD} strokeOpacity="0.7" strokeWidth="1" />
      <rect x="10" y="10" width="130" height="210" fill="none" stroke={GOLD} strokeOpacity="0.3" strokeWidth="0.6" />
      <text x="75" y="30" textAnchor="middle" fontSize="12" letterSpacing="3" fill={GOLD} fontFamily="ui-monospace, monospace">
        XXII
      </text>
      <g className="lba-pulse-2">
        <polygon points={apoly(34, 8, -90, 75, 108)} fill="none" stroke={GOLD} strokeOpacity="0.8" strokeWidth="0.8" />
        <circle cx="75" cy="108" r="21" fill="none" stroke={VERDI} strokeOpacity="0.6" strokeWidth="0.7" />
        <text x="75" y="115" textAnchor="middle" fontSize="20" fill={GOLD}>✶</text>
      </g>
      {Array.from({ length: 22 }, (_, i) => {
        const p1 = apt(46, -90 + (360 / 22) * i, 75, 108);
        const p2 = apt(50, -90 + (360 / 22) * i, 75, 108);
        return (
          <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.6" />
        );
      })}
      <text x="75" y="196" textAnchor="middle" fontSize="8" letterSpacing="4" fill={GOLD_DIM} fontFamily="ui-monospace, monospace">
        STVLTVS
      </text>
      <text x="75" y="212" textAnchor="middle" fontSize="6" letterSpacing="2" fill={VERDI} fontFamily="ui-monospace, monospace">
        NVLLVS · OMNIA
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Result diagram — wheel of the 22 with the arcana illuminated        */
/* ------------------------------------------------------------------ */
function ResultDiagram({ n }: { n: number }) {
  const c = 160;
  const hiA = -90 + (360 / 22) * (n - 1);
  const hi = apt(118, hiA, c, c);
  return (
    <svg
      viewBox="0 0 320 320"
      className="w-full max-w-[320px]"
      role="img"
      aria-label={`Wheel of the twenty-two arcana, ${toRoman(n)} illuminated`}
    >
      <defs>
        <radialGradient id="lba-res-glow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.2" />
          <stop offset="70%" stopColor={VERDI} stopOpacity="0.05" />
          <stop offset="100%" stopColor={GROUND} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={c} cy={c} r="156" fill="url(#lba-res-glow)" />
      <circle cx={c} cy={c} r="150" fill="#0a1a12" stroke={GOLD} strokeOpacity="0.6" strokeWidth="0.9" />
      <circle cx={c} cy={c} r="143" fill="none" stroke={VERDI} strokeOpacity="0.3" strokeWidth="0.5" strokeDasharray="2 3" />

      {/* tick scale — 88 ticks */}
      {Array.from({ length: 88 }, (_, i) => {
        const p1 = apt(146, (360 / 88) * i, c, c);
        const p2 = apt(i % 4 === 0 ? 137 : 141, (360 / 88) * i, c, c);
        return (
          <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={GOLD} strokeOpacity="0.35" strokeWidth="0.5" />
        );
      })}

      {/* inner figure, drawn on */}
      <polygon
        className="lba-draw"
        points={apoly(96, 4, -90, c, c)}
        fill="none"
        stroke={GOLD}
        strokeOpacity="0.55"
        strokeWidth="0.8"
      />
      <polygon
        className="lba-draw"
        style={{ animationDelay: "0.5s" }}
        points={apoly(96, 4, -45, c, c)}
        fill="none"
        stroke={GOLD}
        strokeOpacity="0.55"
        strokeWidth="0.8"
      />
      <line
        className="lba-draw-slow"
        x1={c}
        y1={c}
        x2={hi.x}
        y2={hi.y}
        stroke={GOLD}
        strokeOpacity="0.7"
        strokeWidth="0.8"
      />

      {/* the 22 stations */}
      {Array.from({ length: 22 }, (_, i) => {
        const a = -90 + (360 / 22) * i;
        const p = apt(118, a, c, c);
        const isHi = i === n - 1;
        return (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={isHi ? 13 : 9}
              fill={isHi ? GOLD : PLATE}
              fillOpacity={isHi ? 0.95 : 1}
              stroke={GOLD}
              strokeOpacity={isHi ? 1 : 0.5}
              strokeWidth="0.8"
            />
            <text
              x={p.x}
              y={p.y + 2.5}
              textAnchor="middle"
              fontSize={isHi ? 8 : 6}
              fill={isHi ? GROUND : CREAM}
              opacity={isHi ? 1 : 0.55}
              fontFamily="ui-monospace, monospace"
            >
              {toRoman(i + 1)}
            </text>
          </g>
        );
      })}

      {/* heart of the plate */}
      <circle cx={c} cy={c} r="34" fill={GROUND} stroke={GOLD} strokeWidth="0.9" />
      <circle cx={c} cy={c} r="28" fill="none" stroke={GOLD} strokeOpacity="0.35" strokeWidth="0.5" />
      <text
        x={c}
        y={c + 8}
        textAnchor="middle"
        fontSize="26"
        fill={GOLD}
        fontFamily="ui-monospace, monospace"
        letterSpacing="1"
      >
        {toRoman(n)}
      </text>
      <text
        x={c}
        y={c + 48}
        textAnchor="middle"
        fontSize="6"
        letterSpacing="2"
        fill={VERDI}
        fontFamily="ui-monospace, monospace"
      >
        ROTA · XXII
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* The Machina — calculator centerpiece                                */
/* ------------------------------------------------------------------ */
function Machina() {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ArcanaCard | null>(null);
  const [chain, setChain] = useState<number[]>([]);
  const [stamp, setStamp] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  function compute(e: React.FormEvent) {
    e.preventDefault();
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    if (!/^\d{1,2}$/.test(day) || d < 1 || d > 31) {
      setError("DIES INVALIDA — the day must be a number from 1 to 31.");
      setResult(null);
      return;
    }
    if (!/^\d{1,2}$/.test(month) || m < 1 || m > 12) {
      setError("MENSIS INVALIDA — the month must be a number from 1 to 12.");
      setResult(null);
      return;
    }
    if (!/^\d{4}$/.test(year) || y < 1900 || y > 2100) {
      setError("ANNVS INVALIDVS — the year must be four digits, between 1900 and 2100.");
      setResult(null);
      return;
    }
    const n = calculateBirthArcana(d, m, y);
    setError(null);
    setChain(birthChain(d, m, y));
    setResult(getArcana(n));
    setStamp((s) => s + 1);
    requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  const plateCls =
    "lba-mottle relative border border-[#c9b037]/30 bg-[#0a1a12]/80 p-5 sm:p-7";

  return (
    <div className="relative">
      {/* entry plate — tilted, pushed past the left rail on wide screens */}
      <form
        onSubmit={compute}
        className={`${plateCls} relative z-10 lg:-ml-10 lg:-rotate-1 lg:pr-16`}
      >
        <span aria-hidden className="pointer-events-none absolute inset-[4px] border border-[#c9b037]/15" />
        <Corners />
        <span className="absolute -top-2 left-6 bg-[#06120c] px-2 font-mono text-[7px] tracking-[0.4em] text-[#3fa37c]">
          MACHINA ARCANORVM
        </span>
        <span className="absolute -right-4 top-8 hidden rotate-90 font-mono text-[6px] tracking-[0.3em] text-[#e6e0c8]/25 lg:block">
          SCRIBE · DIES NATIVITATIS
        </span>

        <div className="grid grid-cols-3 gap-3 sm:gap-5">
          {(
            [
              { label: "DIES", sub: "DAY", value: day, set: setDay, ph: "14", max: 2, tilt: "rotate-1" },
              { label: "MENSIS", sub: "MONTH", value: month, set: setMonth, ph: "03", max: 2, tilt: "-rotate-[0.6deg] translate-y-2" },
              { label: "ANNVS", sub: "YEAR", value: year, set: setYear, ph: "1985", max: 4, tilt: "rotate-[0.8deg] -translate-y-1" },
            ] as const
          ).map((f) => (
            <label key={f.label} className={`block ${f.tilt}`}>
              <span className="mb-1.5 flex items-baseline justify-between">
                <span className="font-mono text-[7px] tracking-[0.3em] text-[#3fa37c]">{f.label}</span>
                <span className="font-mono text-[6px] tracking-[0.2em] text-[#e6e0c8]/25">{f.sub}</span>
              </span>
              <span className="relative block border border-[#c9b037]/40 bg-[#06120c]/70">
                <Corners />
                <input
                  value={f.value}
                  onChange={(ev) => f.set(ev.target.value.replace(/[^\d]/g, "").slice(0, f.max))}
                  placeholder={f.ph}
                  inputMode="numeric"
                  autoComplete="off"
                  aria-label={f.sub}
                  className="lba-input w-full px-3 py-3 text-center font-serif text-2xl tracking-[0.15em] text-[#e6e0c8] placeholder:text-[#e6e0c8]/15 sm:text-3xl"
                />
              </span>
            </label>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="font-mono text-[7px] leading-relaxed tracking-[0.25em] text-[#e6e0c8]/35">
            Σ DD·MM·YYYY → FOLD TO 1–22
            <br />
            NVLLA MERCES · NO COIN REQUIRED
          </p>
          <button
            type="submit"
            className="lba-gilt inline-flex items-center gap-3 border border-[#e3cd5a]/60 bg-[#c9b037] px-7 py-3 font-mono text-[10px] font-bold tracking-[0.22em] text-[#06120c] shadow-[0_0_24px_rgba(201,176,55,0.25)] transition-colors hover:bg-[#e3cd5a]"
          >
            <span aria-hidden className="flex h-4 w-4 items-center justify-center rounded-full border border-[#06120c]/50 text-[8px]">
              ✦
            </span>
            COMPVTA ARCANVM
          </button>
        </div>

        {error ? (
          <p className="mt-4 border border-[#c05545]/50 bg-[#c05545]/10 px-3 py-2 font-mono text-[8px] tracking-[0.2em] text-[#e09080]">
            {error}
          </p>
        ) : null}
      </form>

      {/* result plate — overlaps the entry plate, tilted the other way */}
      <div ref={resultRef} className="relative z-20 mt-8 lg:-mt-16 lg:ml-auto lg:w-[46%]">
        {result ? (
          <article
            key={`${result.number}-${stamp}`}
            className={`${plateCls} lg:rotate-[1.3deg] lg:border-[#c9b037]/50 lg:shadow-[0_0_60px_rgba(201,176,55,0.12)]`}
          >
            <span aria-hidden className="pointer-events-none absolute inset-[4px] border border-[#c9b037]/20" />
            <Corners />
            <span className="absolute -top-2 right-6 bg-[#06120c] px-2 font-mono text-[7px] tracking-[0.4em] text-[#3fa37c]">
              TABVLA ILLVMINATA
            </span>

            <div className="lba-rise mb-4 flex items-center justify-between font-mono text-[7px] tracking-[0.25em] text-[#e6e0c8]/40">
              <span>
                Σ = {chain.join(" → ")} → {result.number}
              </span>
              <span className="text-[#3fa37c]">FOL. {toRoman(result.number)}</span>
            </div>

            <figure className="lba-rise flex justify-center" style={{ animationDelay: "0.15s" }}>
              <ResultDiagram n={result.number} />
            </figure>

            <div className="lba-rise mt-5 text-center" style={{ animationDelay: "0.3s" }}>
              <div className="font-serif text-4xl tracking-[0.1em] text-[#c9b037] sm:text-5xl">
                {toRoman(result.number)}
              </div>
              <h3 className="mt-1 font-serif text-2xl tracking-[0.06em] text-[#e6e0c8] sm:text-3xl">
                {result.name}
              </h3>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                {result.keywords.map((k) => (
                  <span
                    key={k}
                    className="border border-[#c9b037]/35 px-2 py-0.5 font-mono text-[7px] tracking-[0.25em] text-[#c9b037]"
                  >
                    {k.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            <div className="lba-rise mt-5 border-t border-[#c9b037]/20 pt-4" style={{ animationDelay: "0.45s" }}>
              <div className="font-mono text-[7px] tracking-[0.35em] text-[#3fa37c]">MISSIO · THE LIFE MISSION</div>
              <p className="mt-2 text-[12px] leading-relaxed text-[#e6e0c8]/65 sm:text-[13px]">
                {result.mission}
              </p>
            </div>

            <div
              className="lba-rise mt-4 grid grid-cols-2 gap-2 font-mono"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="border border-[#c9b037]/15 bg-[#06120c]/50 px-3 py-2">
                <span className="block text-[6px] tracking-[0.3em] text-[#e6e0c8]/35">ELEMENTVM</span>
                <span className="mt-1 flex items-center gap-2 text-[9px] tracking-[0.2em] text-[#c9b037]">
                  <ElementMark element={result.element} />
                  {result.element.toUpperCase()}
                </span>
              </div>
              <div className="border border-[#c9b037]/15 bg-[#06120c]/50 px-3 py-2">
                <span className="block text-[6px] tracking-[0.3em] text-[#e6e0c8]/35">ASTRVM</span>
                <span className="mt-1 flex items-center gap-2 text-[9px] tracking-[0.2em] text-[#c9b037]">
                  <span aria-hidden className="text-[13px] leading-none">
                    {ASTRO_GLYPHS[result.astrology] ?? "✦"}
                  </span>
                  {result.astrology.toUpperCase()}
                </span>
              </div>
            </div>

            <div
              className="lba-rise mt-4 flex items-center justify-between border-t border-[#c9b037]/20 pt-3 font-mono text-[6px] tracking-[0.25em] text-[#e6e0c8]/30"
              style={{ animationDelay: "0.75s" }}
            >
              <span>CONCORDANTIAE · {result.compatibleArcanas.map(toRoman).join(" · ")}</span>
              <span>SCALA 1 : 22</span>
            </div>
          </article>
        ) : (
          <div
            aria-hidden
            className={`${plateCls} hidden select-none lg:block lg:rotate-[1.3deg] lg:opacity-50`}
          >
            <span className="absolute -top-2 right-6 bg-[#06120c] px-2 font-mono text-[7px] tracking-[0.4em] text-[#3fa37c]/60">
              TABVLA VACVA
            </span>
            <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 text-center">
              <span className="text-[26px] text-[#c9b037]/40">✶</span>
              <p className="max-w-[240px] font-mono text-[7px] leading-relaxed tracking-[0.3em] text-[#e6e0c8]/30">
                HIC ARCANVM APPAREBIT — the illuminated plate rises here once the date is entered.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Wax seal                                                            */
/* ------------------------------------------------------------------ */
function WaxSeal() {
  const c = 60;
  return (
    <svg viewBox="0 0 120 120" className="h-16 w-16" role="img" aria-label="Wax seal">
      <defs>
        <path id="lba-seal-ring" d="M 60 60 m -42 0 a 42 42 0 1 1 84 0 a 42 42 0 1 1 -84 0" />
      </defs>
      <circle cx={c} cy={c} r="56" fill={PLATE} stroke={GOLD} strokeOpacity="0.7" strokeWidth="1" />
      <circle cx={c} cy={c} r="51" fill="none" stroke={GOLD} strokeOpacity="0.35" strokeWidth="0.5" />
      {Array.from({ length: 36 }, (_, i) => {
        const p1 = apt(47, i * 10, c, c);
        const p2 = apt(51, i * 10, c, c);
        return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={GOLD} strokeOpacity="0.3" strokeWidth="0.5" />;
      })}
      <g className="lba-rot-90" style={{ transformOrigin: "60px 60px", transformBox: "view-box" }}>
        <text fontSize="7" letterSpacing="2.2" fill={GOLD} fontFamily="ui-monospace, monospace" opacity="0.9">
          <textPath href="#lba-seal-ring">SIGILLVM · ARCANVM XXII · MMXXVI ·</textPath>
        </text>
      </g>
      <circle cx={c} cy={c} r="30" fill="none" stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.7" />
      <text x={c} y={c + 7} textAnchor="middle" fontSize="20" fill={GOLD}>✶</text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function BirthArcanaPage() {
  return (
    <main
      className="relative isolate min-h-screen overflow-x-clip bg-[#06120c] text-[#e6e0c8] antialiased"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 50% 0%, rgba(63,163,124,0.07), transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(201,176,55,0.05), transparent 50%)",
      }}
    >
      <style>{LBA_STYLES}</style>
      <Backdrop />
      <AgeLayer />

      {/* ======================= 1 · CODEX HEADER BAR ======================= */}
      <header className="border-b border-[#c9b037]/25">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="flex items-center gap-4 py-3">
            <a href="#lba-top" className="flex items-baseline gap-2">
              <span aria-hidden className="text-[11px] text-[#c9b037]">✦</span>
              <span className="font-serif text-sm font-bold tracking-[0.3em] text-[#c9b037]">
                ASTRO SCOPE
              </span>
              <span className="hidden font-mono text-[7px] tracking-[0.25em] text-[#3fa37c]/70 sm:inline">
                TAROTARIVM
              </span>
            </a>
            <span className="hidden font-mono text-[7px] tracking-[0.2em] text-[#e6e0c8]/30 lg:inline">
              FOL. 22 · DE ARCANIS MAIORIBVS
            </span>
            <nav className="ml-auto flex items-center gap-4 font-mono text-[9px] tracking-[0.25em] sm:gap-6">
              <a href="#lba-machina" className="hidden text-[#e6e0c8]/60 transition-colors hover:text-[#c9b037] sm:inline">
                CALCULATOR
              </a>
              <a href="#lba-ars" className="hidden text-[#e6e0c8]/60 transition-colors hover:text-[#c9b037] sm:inline">
                THE METHOD
              </a>
              <a
                href="#lba-machina"
                className="border border-[#c9b037]/50 px-3 py-1.5 text-[#c9b037] transition-colors hover:bg-[#c9b037] hover:text-[#06120c]"
              >
                COMPUTE
              </a>
            </nav>
          </div>
          {/* engraved double rule */}
          <div aria-hidden className="pb-2">
            <div className="lba-bleed h-px bg-[#c9b037]/40" />
            <div className="mt-[3px] flex items-center gap-2">
              <span className="lba-bleed h-px flex-1 bg-[#c9b037]/15" />
              <span className="font-mono text-[6px] tracking-[0.4em] text-[#e6e0c8]/25">
                INCIPIT TRACTATVS · DE ARCANO NATIVITATIS
              </span>
              <span className="lba-bleed h-px flex-1 bg-[#c9b037]/15" />
            </div>
          </div>
        </div>
      </header>

      {/* ======================= 2 · HERO — broken chapter opening ======================= */}
      <section id="lba-top" className="relative border-b border-[#c9b037]/25">
        {/* plate label straddling the top border */}
        <span className="absolute -top-2 left-[12%] z-10 bg-[#06120c] px-2 font-mono text-[7px] tracking-[0.4em] text-[#3fa37c]">
          TAB. I — ROTA ARCANORVM
        </span>
        {/* marginal scales */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-16 left-3 hidden lg:block"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(201,176,55,0.4) 0 1px, transparent 1px 18px)",
            width: "8px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-16 right-3 hidden lg:block"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(63,163,124,0.4) 0 1px, transparent 1px 18px)",
            width: "8px",
          }}
        />
        <span aria-hidden className="absolute left-5 top-28 hidden -rotate-90 font-mono text-[6px] tracking-[0.3em] text-[#e6e0c8]/25 lg:inline">
          SCALA · I AD XXII
        </span>

        <div className="relative mx-auto max-w-[1400px] px-4 pb-24 pt-14 sm:px-6 sm:pt-20 lg:pb-32">
          {/* headline block — shoved off-center, not centered */}
          <div className="relative z-10 max-w-2xl lg:ml-[9%]">
            <div className="mb-5 flex items-center gap-3 font-mono text-[8px] tracking-[0.45em] text-[#3fa37c]">
              <span className="h-px w-10 bg-[#3fa37c]/40 sm:w-24" />
              TRACTATVS · CAPVT PRIMVM
            </div>
            <h1 className="font-serif text-4xl leading-[1.1] tracking-[0.03em] text-[#e6e0c8] sm:text-6xl">
              The card you were
              <br />
              <span className="text-[#c9b037]">born carrying.</span>
              <span aria-hidden className="ml-3 align-top font-mono text-[10px] tracking-[0.3em] text-[#3fa37c]/70">
                NOTA · I
              </span>
            </h1>
            <p className="mt-6 max-w-md text-[13px] leading-relaxed text-[#e6e0c8]/60 sm:text-sm">
              Every birth date folds down to one of the twenty-two Major Arcana. That card is
              your Birth Arcana — the mission written under your name, the lessons that keep
              returning, the direction your growth leans. Three numbers open the plate.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#lba-machina"
                className="lba-gilt inline-flex items-center gap-3 border border-[#e3cd5a]/60 bg-[#c9b037] px-7 py-3 font-mono text-[10px] font-bold tracking-[0.22em] text-[#06120c] shadow-[0_0_24px_rgba(201,176,55,0.25)] transition-colors hover:bg-[#e3cd5a]"
              >
                <span aria-hidden className="flex h-4 w-4 items-center justify-center rounded-full border border-[#06120c]/50 text-[8px]">✦</span>
                REVEAL MY ARCANA
              </a>
              <a
                href="#lba-ars"
                className="inline-flex items-center gap-2 border border-[#c9b037]/40 px-6 py-3 font-mono text-[10px] tracking-[0.22em] text-[#c9b037] transition-colors hover:bg-[#c9b037]/10"
              >
                HOW IT IS COMPUTED <span aria-hidden>→</span>
              </a>
            </div>
            {/* readout strip */}
            <div className="mt-10 flex max-w-lg flex-wrap items-center gap-x-7 gap-y-2 border-t border-[#c9b037]/20 pt-4 font-mono text-[7px] tracking-[0.25em] text-[#e6e0c8]/35">
              <span>ARCANA MAIORA · 22</span>
              <span className="lba-flicker text-[#3fa37c]">● PLATE READY</span>
              <span>XXII = STVLTVS · THE FOOL</span>
              <span>NO COIN REQUIRED · $0</span>
            </div>
          </div>

          {/* rotated card figure bleeding off the right edge, straddling the bottom border */}
          <div className="pointer-events-none absolute -right-8 bottom-0 z-10 hidden w-[190px] translate-y-[38%] rotate-[7deg] md:block lg:-right-4 lg:w-[230px]">
            <div className="lba-drift">
              <CardFigure />
            </div>
          </div>
          {/* marginal gloss hanging outside the frame */}
          <aside className="absolute right-[27%] top-16 hidden w-40 -rotate-2 lg:block">
            <p className="border-l border-[#c9b037]/25 pl-3 font-serif text-[11px] italic leading-relaxed text-[#e6e0c8]/35">
              dies natalis numerus est — numerus arcanum aperit
            </p>
            <span aria-hidden className="mt-2 block pl-3 text-[8px] text-[#c9b037]/40">❧</span>
          </aside>
        </div>
      </section>

      {/* ======================= 3 · THE MACHINA — calculator centerpiece ======================= */}
      <section id="lba-machina" className="relative border-b border-[#c9b037]/25 bg-[#08160e]/70">
        <span className="absolute -top-2 right-[14%] z-10 bg-[#08160e] px-2 font-mono text-[7px] tracking-[0.4em] text-[#3fa37c]">
          TAB. II — MACHINA
        </span>
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:py-20">
          <SectionHead
            eyebrow="COMPVTATIO"
            title="THE BIRTH ARCANA ENGINE"
            sub="SCRIBE THE DATE · THE PLATE ILLUMINATES ITSELF"
          />
          <div className="lg:pl-[6%] lg:pr-[2%]">
            <Machina />
          </div>
          <div className="mt-14 lg:mt-6">
            <Hairline label="SICVT SVPRA · SICVT INTVS" />
          </div>
        </div>
      </section>

      {/* ======================= 4 · QVID EST — what is birth arcana ======================= */}
      <section className="relative border-b border-[#c9b037]/25">
        <span className="absolute -top-2 left-[8%] z-10 bg-[#06120c] px-2 font-mono text-[7px] tracking-[0.4em] text-[#3fa37c]">
          TAB. III — DEFINITIO
        </span>
        <div className="relative mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-0">
            {/* main plate — tilted, pushed right */}
            <div className="lba-mottle relative border border-[#c9b037]/30 bg-[#0a1a12]/80 p-6 sm:p-9 lg:ml-[7%] lg:rotate-[0.6deg]">
              <span aria-hidden className="pointer-events-none absolute inset-[4px] border border-[#c9b037]/15" />
              <Corners />
              <span className="absolute -left-14 top-16 hidden -rotate-90 font-mono text-[6px] tracking-[0.3em] text-[#3fa37c]/60 lg:block">
                NOTA · MARG. — QVID EST
              </span>
              <SectionHead
                align="left"
                eyebrow="QVID EST"
                title="WHAT IS A BIRTH ARCANA"
                sub="VNVS EX XXII · ONE CARD OF THE TWENTY-TWO"
              />
              <p className="max-w-xl text-[13px] leading-relaxed text-[#e6e0c8]/60">
                Your Birth Arcana is one of the 22 Major Arcana of the tarot, fixed by the
                digits of your birth date. Where a zodiac sign describes the weather you were
                born under, the arcana describes the errand you were born with — a single card
                that does not change across your life.
              </p>
              <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-[#e6e0c8]/60">
                Each arcana carries a particular energy and names the key lessons you are here
                to learn: the mission, the talents that come pre-installed, and the faults that
                will keep knocking until they are answered.
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {[
                  { k: "MISSIO", v: "the life mission — what the card asks of you" },
                  { k: "DOTES", v: "natural qualities and talents you arrive with" },
                  { k: "LECTIONES", v: "the main lessons set for your development" },
                  { k: "DIRECTIO", v: "the direction of your spiritual growth" },
                ].map((it, i) => (
                  <div
                    key={it.k}
                    className={`border border-[#c9b037]/15 bg-[#06120c]/50 px-3 py-2.5 ${
                      i % 2 === 0 ? "lg:-rotate-[0.5deg]" : "lg:translate-y-1 lg:rotate-[0.4deg]"
                    }`}
                  >
                    <span className="block font-mono text-[7px] tracking-[0.3em] text-[#3fa37c]">
                      {["I", "II", "III", "IV"][i]} · {it.k}
                    </span>
                    <span className="mt-1 block text-[11px] leading-snug text-[#e6e0c8]/60">{it.v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* side plate — overlapping, hanging off the bottom */}
            <aside className="relative z-10 lg:-ml-16 lg:mt-24">
              <div className="lba-mottle relative border border-[#c9b037]/30 bg-[#0a1a12]/90 p-5 lg:-rotate-1 lg:translate-y-10">
                <Corners />
                <div className="font-mono text-[7px] tracking-[0.35em] text-[#3fa37c]">EXEMPLVM · FOL. IX</div>
                <div className="mt-3 flex items-center gap-4">
                  <span className="flex h-16 w-12 shrink-0 -rotate-3 flex-col items-center justify-center border border-[#c9b037]/60 bg-[#06120c]/70">
                    <span className="font-mono text-[7px] text-[#3fa37c]">IX</span>
                    <span className="text-[16px] text-[#c9b037]">✶</span>
                    <span className="font-mono text-[4px] tracking-[1px] text-[#e6e0c8]/40">EREMITA</span>
                  </span>
                  <p className="text-[11px] leading-relaxed text-[#e6e0c8]/55">
                    A date folding to <span className="text-[#c9b037]">9</span> carries{" "}
                    <span className="text-[#c9b037]">The Hermit</span> — the lantern-bearer:
                    introspection, patient truth-seeking, wisdom earned in quiet and then held
                    up for others.
                  </p>
                </div>
                <div className="mt-3 border-t border-[#c9b037]/15 pt-2 font-mono text-[6px] tracking-[0.25em] text-[#e6e0c8]/30">
                  VIRGO {g("♍")} · EARTH · COMPLETION BEFORE RENEWAL
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ======================= 5 · ARS COMPUTANDI — how it is calculated ======================= */}
      <section id="lba-ars" className="relative border-b border-[#c9b037]/25 bg-[#08160e]/70">
        <span className="absolute -top-2 left-[38%] z-10 bg-[#08160e] px-2 font-mono text-[7px] tracking-[0.4em] text-[#3fa37c]">
          TAB. IV — ARITHMETICA
        </span>
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
          <SectionHead
            eyebrow="ARS COMPUTANDI"
            title="HOW IT IS CALCULATED"
            sub="THE DIGIT SUM · FOLDED TO THE TWENTY-TWO"
          />

          {/* three operation plates, staggered and tilted */}
          <div className="grid gap-4 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div
                key={s.no}
                className={`lba-mottle relative border border-[#c9b037]/25 bg-[#0a1a12]/70 p-5 ${
                  ["md:-rotate-1", "md:mt-6 md:rotate-[0.7deg]", "md:-mt-2 md:-rotate-[0.5deg]"][i]
                }`}
              >
                <span aria-hidden className="pointer-events-none absolute inset-[3px] border border-[#c9b037]/10" />
                <Corners />
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-4xl leading-none text-[#c9b037]/85">{s.no}</span>
                  <span className="font-mono text-[6px] tracking-[0.3em] text-[#3fa37c]/70">{s.lat}</span>
                </div>
                <div className="mt-3 font-mono text-[9px] tracking-[0.3em] text-[#c9b037]">{s.title}</div>
                <p className="mt-2 text-[11px] leading-relaxed text-[#e6e0c8]/55">{s.copy}</p>
              </div>
            ))}
          </div>

          {/* worked example — a manuscript computation, tilted and offset */}
          <div className="mt-12 lg:ml-[14%] lg:max-w-3xl">
            <div className="lba-mottle relative border border-[#c9b037]/35 bg-[#0a1a12]/85 p-6 sm:p-8 lg:-rotate-[0.7deg]">
              <span aria-hidden className="pointer-events-none absolute inset-[4px] border border-[#c9b037]/15" />
              <Corners />
              <span className="absolute -top-2 left-8 bg-[#08160e] px-2 font-mono text-[7px] tracking-[0.4em] text-[#3fa37c]">
                EXEMPLVM COMPUTATIONIS
              </span>
              <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
                <div>
                  <div className="font-mono text-[7px] tracking-[0.35em] text-[#e6e0c8]/40">DIES NATIVITATIS</div>
                  <div className="mt-1 font-serif text-2xl tracking-[0.12em] text-[#e6e0c8]">{EXAMPLE.date}</div>
                </div>
                <span aria-hidden className="hidden font-mono text-[#c9b037]/50 sm:inline">→</span>
                <div>
                  <div className="font-mono text-[7px] tracking-[0.35em] text-[#e6e0c8]/40">SVMMA DIGITORVM</div>
                  <div className="mt-1 font-mono text-sm tracking-[0.15em] text-[#c9b037]">
                    {EXAMPLE.digits} = {EXAMPLE.sum}
                  </div>
                </div>
                <span aria-hidden className="hidden font-mono text-[#c9b037]/50 sm:inline">→</span>
                <div>
                  <div className="font-mono text-[7px] tracking-[0.35em] text-[#e6e0c8]/40">PLICATIO</div>
                  <div className="mt-1 font-mono text-sm tracking-[0.15em] text-[#c9b037]">
                    {EXAMPLE.fold} = {EXAMPLE.result}
                  </div>
                </div>
                <span aria-hidden className="hidden font-mono text-[#c9b037]/50 sm:inline">→</span>
                <div className="border border-[#c9b037]/50 bg-[#06120c]/60 px-4 py-3">
                  <div className="font-mono text-[6px] tracking-[0.35em] text-[#3fa37c]">ARCANVM</div>
                  <div className="mt-1 font-serif text-lg tracking-[0.1em] text-[#c9b037]">
                    {toRoman(EXAMPLE.result)} · THE EMPEROR
                  </div>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#c9b037]/20 pt-3 font-mono text-[6px] tracking-[0.25em] text-[#e6e0c8]/30">
                <span>SI SVMMA &gt; XXII · ITERVM ADDE</span>
                <span>XXII SERVATVR INTEGRA · STVLTVS</span>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <Hairline label="NVLLVS NVMERVS PERIT · EVERY DIGIT IS COUNTED" />
          </div>
        </div>
      </section>

      {/* ======================= 6 · QVAESTIONES ======================= */}
      <section className="relative border-b border-[#c9b037]/25">
        <span className="absolute -top-2 right-[22%] z-10 bg-[#06120c] px-2 font-mono text-[7px] tracking-[0.4em] text-[#3fa37c]">
          TAB. V — DVBIA
        </span>
        <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6">
          <SectionHead
            eyebrow="DVBIA · ET RESPONSA"
            title="QUAESTIONES"
            sub="GATHERED FROM THE MARGINS OF THE MANUSCRIPT"
          />
          <dl className="max-w-3xl lg:ml-24">
            {FAQ.map((f, i) => (
              <div key={f.q} className={`py-6 ${i > 0 ? "border-t border-[#c9b037]/15" : ""}`}>
                <dt className="flex items-baseline gap-4">
                  <span className="shrink-0 font-serif text-2xl text-[#c9b037]">
                    {["Q. I", "Q. II", "Q. III"][i]}
                  </span>
                  <span className="font-serif text-lg tracking-[0.03em] text-[#e6e0c8] sm:text-xl">{f.q}</span>
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

      {/* ======================= 7 · FINAL CTA ======================= */}
      <section className="relative overflow-hidden border-b border-[#c9b037]/25 bg-[#08160e]/70">
        <div className="mx-auto max-w-[1400px] px-4 py-16 text-center sm:px-6">
          <div className="mx-auto mb-6 flex justify-center">
            <WaxSeal />
          </div>
          <div className="mb-3 font-mono text-[8px] tracking-[0.4em] text-[#3fa37c]/80">
            VLTIMA CHARTA · THE LAST LEAF
          </div>
          <h2 className="mx-auto max-w-2xl font-serif text-3xl leading-tight tracking-[0.04em] text-[#e6e0c8] sm:text-5xl sm:leading-[1.15]">
            Twenty-two cards.{" "}
            <span className="text-[#c9b037]">One has your date on it.</span>
          </h2>
          <a
            href="#lba-machina"
            className="lba-gilt mt-8 inline-flex items-center gap-3 border border-[#e3cd5a]/60 bg-[#c9b037] px-8 py-3.5 font-mono text-[11px] font-bold tracking-[0.25em] text-[#06120c] shadow-[0_0_24px_rgba(201,176,55,0.25)] transition-colors hover:bg-[#e3cd5a]"
          >
            COMPUTE YOUR BIRTH ARCANA <span aria-hidden>→</span>
          </a>
          <div className="mt-5 font-mono text-[8px] tracking-[0.3em] text-[#e6e0c8]/35">
            THREE NUMBERS · ONE PLATE · $0
          </div>
          <div className="mx-auto mt-10 max-w-xl">
            <Hairline label="OMNIA VANITAS · PRAETER ARCANA" />
          </div>
        </div>
      </section>

      {/* ======================= 8 · COLOPHON FOOTER ======================= */}
      <footer>
        <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
          <div className="flex flex-col items-center gap-5 md:flex-row md:justify-between">
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-sm font-bold tracking-[0.3em] text-[#c9b037]">ASTRO SCOPE</span>
              <span className="font-mono text-[7px] tracking-[0.25em] text-[#e6e0c8]/30">
                TAROTARIVM · DE ARCANO NATIVITATIS
              </span>
            </div>
            <nav className="flex gap-6 font-mono text-[8px] tracking-[0.25em] text-[#e6e0c8]/40">
              <a href="#lba-machina" className="transition-colors hover:text-[#c9b037]">CALCULATOR</a>
              <a href="#lba-ars" className="transition-colors hover:text-[#c9b037]">THE METHOD</a>
              <a href="#lba-top" className="transition-colors hover:text-[#c9b037]">TOP</a>
            </nav>
            <span className="font-mono text-[8px] tracking-[0.25em] text-[#e6e0c8]/25">
              © MMXXVI · AS ABOVE · SO BELOW
            </span>
          </div>
          <div className="mt-6 border-t border-[#c9b037]/15 pt-4 text-center">
            <p className="font-mono text-[6px] leading-relaxed tracking-[0.3em] text-[#e6e0c8]/25">
              EXPLICIT TRACTATVS DE ARCANO NATIVITATIS · SCRIPTVM ET ILLVMINATVM IN ANNO MMXXVI ·
              FELICITER · FELICITER · FELICITER
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
