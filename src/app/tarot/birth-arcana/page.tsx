"use client";

// TAROT / BIRTH ARCANA — a TOOL page, not a landing. The calculator sits at
// the top of the viewport under a compact header and tarot cross-nav tabs;
// the explainer and FAQ are condensed below. Broken layout + magic background
// kept from the lab direction, recolored to the PRODUCTION palette lifted
// from src/app/lab/remix-v2/page.tsx (bg rgb(10,9,18), gold/violet accents).
// Self-contained: inline SVG + Tailwind + one scoped <style> block (lba-
// prefixed). Client component: the calculator is interactive.

import { useRef, useState } from "react";
import Link from "next/link";
import { calculateBirthArcana, getArcana } from "@/lib/arcana";
import type { ArcanaCard } from "@/lib/arcana";

/* ------------------------------------------------------------------ */
/* Production palette (from lab/remix-v2)                              */
/* ------------------------------------------------------------------ */
const BG = "#0a0912"; // rgb(10,9,18)
const GOLD = "#f3c77a"; // --accent-primary
const GOLD_HOT = "#e39a4c";
const GOLD_DEEP = "#c9a227"; // darker gold for hairlines
const CREAM = "#ffdd9c"; // --accent-tertiary
const VIOLET = "#a25adf";
const VIOLET_SOFT = "#b794f6";
const TEXT_HI = "#e9e6f2"; // --text-primary
const TEXT_LO = "#b7b1cc"; // --text-secondary

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                    */
/* ------------------------------------------------------------------ */
const DEG = Math.PI / 180;

function onCircle(cx: number, cy: number, r: number, deg: number) {
  const t = (deg - 90) * DEG;
  return { x: +(cx + r * Math.cos(t)).toFixed(1), y: +(cy + r * Math.sin(t)).toFixed(1) };
}

function ringPts(r: number, n: number, start: number, cx: number, cy: number) {
  return Array.from({ length: n }, (_, i) => {
    const p = onCircle(cx, cy, r, start + (360 / n) * i);
    return `${p.x},${p.y}`;
  }).join(" ");
}

function ringTicks(cx: number, cy: number, rIn: number, rOut: number, n: number, every = 6) {
  return Array.from({ length: n }, (_, k) => {
    const a = (360 / n) * k;
    const p1 = onCircle(cx, cy, rIn, a);
    const p2 = onCircle(cx, cy, rOut, a);
    return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, major: k % every === 0, key: k };
  });
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
/* Text helpers                                                        */
/* ------------------------------------------------------------------ */
const ROMAN_TABLE: ReadonlyArray<readonly [number, string]> = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"],
  [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"],
  [5, "V"], [4, "IV"], [1, "I"],
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

// glyphs carry U+FE0E so they render as text, never emoji
const FE = "\uFE0E";
const g = (base: string) => base + FE;

const ASTRO_GLYPHS: Record<string, string> = {
  Sun: g("☉"), Moon: g("☽"), Mercury: g("☿"), Venus: g("♀"), Mars: g("♂"),
  Jupiter: g("♃"), Saturn: g("♄"), Uranus: g("♅"), Neptune: g("♆"), Pluto: g("♇"),
  Aries: g("♈"), Taurus: g("♉"), Gemini: g("♊"), Cancer: g("♋"), Leo: g("♌"),
  Virgo: g("♍"), Libra: g("♎"), Scorpio: g("♏"), Sagittarius: g("♐"),
  Capricorn: g("♑"), Aquarius: g("♒"), Pisces: g("♓"),
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
const TAROT_TABS = [
  { href: "/tarot", label: "Tarot Hub" },
  { href: "/tarot/spreads/daily-card", label: "Daily Card" },
  { href: "/tarot/spreads/yes-no", label: "Yes / No" },
  { href: "/tarot/spreads/past-present-future", label: "Past · Present · Future" },
  { href: "/tarot/spreads/love-three-card", label: "Love Three-Card" },
  { href: "/tarot/birth-arcana", label: "Birth Arcana", active: true },
  { href: "/tarot/cards", label: "All Cards" },
  { href: "/matrix", label: "Matrix" },
];

const STEPS = [
  {
    no: "I",
    title: "Sum the digits",
    copy: "Write day, month, year and add every digit together.",
  },
  {
    no: "II",
    title: "Fold above 22",
    copy: "Over 22? Add the digits again until the number rests in 1–22.",
  },
  {
    no: "III",
    title: "Read the card",
    copy: "The number names a Major Arcana. Exactly 22 stays whole — The Fool.",
  },
];

const GIFTS = [
  ["MISSIO", "the life mission the card asks of you"],
  ["DOTES", "qualities and talents you arrive with"],
  ["LECTIONES", "lessons that keep returning until learned"],
  ["DIRECTIO", "the direction of your spiritual growth"],
];

const FAQ = [
  {
    q: "What does my Birth Arcana actually tell me?",
    a: "It names the Major Arcana card standing over your birth date — your life mission, natural qualities and talents, the lessons that keep returning, and the direction of your spiritual growth. Less fortune-telling, more the title page of your own chapter.",
  },
  {
    q: "Why is 22 kept as The Fool instead of reducing to 4?",
    a: "The Major Arcana run 0–21: twenty-two cards, with The Fool as the unnumbered wanderer. When a birth date folds to exactly 22, the tradition keeps it whole rather than pressing it into The Emperor's chair.",
  },
  {
    q: "How is this different from a Life Path number?",
    a: "Same digits, different fold. Life Path reduces the date to 1–9; Birth Arcana stops the reduction at 22 so the answer lands on a tarot card. The Destiny Matrix maps all 22 arcana across one chart at once.",
  },
];

// worked example strip: 14 · 03 · 1985 → 31 → 4 → The Emperor
const EXAMPLE = { date: "14 · 03 · 1985", digits: "1+4+0+3+1+9+8+5", sum: 31, fold: "3+1", result: 4 };

// star field, generated once at module scope
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

/* ------------------------------------------------------------------ */
/* Scoped styles (lba- prefix)                                         */
/* ------------------------------------------------------------------ */
const LBA_STYLES = `
  .lba-serif { font-family: "Playfair Display", "Cormorant Garamond", Georgia, "Times New Roman", serif; }
  .lba-glyph { font-family: "Noto Sans Symbols", "Noto Sans Symbols 2", Symbola, "Segoe UI Symbol", serif; font-style: normal; }
  .lba-caps { text-transform: uppercase; letter-spacing: 0.24em; }

  /* panels stay translucent so the apparatus passes visibly BEHIND them */
  .lba-panel {
    background: linear-gradient(160deg, rgba(23,19,40,0.62), rgba(12,10,22,0.72));
    border: 1px solid rgba(233,230,242,0.10);
    backdrop-filter: blur(3px);
  }
  .lba-chip {
    display: inline-block;
    border: 1px solid rgba(243,199,122,0.35);
    background: rgba(10,9,18,0.85);
    padding: 4px 10px;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #f3c77a;
  }
  .lba-gold-link {
    color: #f3c77a; text-decoration: none;
    background-image: linear-gradient(#f3c77a, #f3c77a);
    background-size: 0% 1px; background-repeat: no-repeat; background-position: 0 100%;
    transition: background-size 0.35s ease, color 0.2s ease;
  }
  .lba-gold-link:hover { color: #ffdd9c; background-size: 100% 1px; }

  .lba-input { background: transparent; outline: none; }
  .lba-input:focus { background: rgba(243,199,122,0.06); }
  .lba-input::selection { background: rgba(243,199,122,0.3); }

  /* ---- magic background motion (all slow, all guarded below) ---- */
  @keyframes lba-spin     { to { transform: rotate(360deg); } }
  @keyframes lba-spin-rev { to { transform: rotate(-360deg); } }
  @keyframes lba-twinkle  { 0%,100% { opacity: 0.12; } 50% { opacity: 0.75; } }
  @keyframes lba-floatA   { 0%,100% { transform: translate(0,0) rotate(-2deg); } 50% { transform: translate(1.5vw,-2vh) rotate(1deg); } }
  @keyframes lba-floatB   { 0%,100% { transform: translate(0,0) rotate(3deg); } 50% { transform: translate(-1.5vw,2vh) rotate(-1deg); } }
  .lba-wheel-spin     { animation: lba-spin 260s linear infinite; }
  .lba-wheel-spin-rev { animation: lba-spin-rev 320s linear infinite; }
  .lba-wheel-spin-slow{ animation: lba-spin 140s linear infinite; transform-origin: 50% 50%; }
  .lba-twinkle        { animation: lba-twinkle 7s ease-in-out infinite; }
  .lba-float-a        { animation: lba-floatA 34s ease-in-out infinite; }
  .lba-float-b        { animation: lba-floatB 42s ease-in-out infinite; }
  .lba-nebula         { animation: lba-floatA 60s ease-in-out infinite; }

  /* ---- result reveal: illumination drawn on, then ink rises ---- */
  .lba-draw      { stroke-dasharray: 1400; stroke-dashoffset: 1400; animation: lba-draw 2.6s ease-out forwards; }
  .lba-draw-slow { stroke-dasharray: 900;  stroke-dashoffset: 900;  animation: lba-draw 3.4s ease-out forwards; }
  .lba-rise      { opacity: 0; transform: translateY(10px); animation: lba-rise 0.9s ease-out forwards; }
  @keyframes lba-draw { to { stroke-dashoffset: 0; } }
  @keyframes lba-rise { to { opacity: 1; transform: translateY(0); } }

  @media (prefers-reduced-motion: reduce) {
    .lba-wheel-spin, .lba-wheel-spin-rev, .lba-wheel-spin-slow,
    .lba-twinkle, .lba-float-a, .lba-float-b, .lba-nebula { animation: none !important; }
    .lba-draw, .lba-draw-slow { animation: none !important; stroke-dashoffset: 0; }
    .lba-rise { animation: none !important; opacity: 1; transform: none; }
  }
`;

/* ------------------------------------------------------------------ */
/* Backdrop — wheels of the 22, star field, hairlines, dim glyphs      */
/* ------------------------------------------------------------------ */
function ArcanaWheelSvg() {
  const C = 500;
  return (
    <svg viewBox="0 0 1000 1000" className="h-full w-full">
      <circle cx={C} cy={C} r={486} fill="none" stroke={GOLD} strokeWidth={1} />
      <circle cx={C} cy={C} r={430} fill="none" stroke={GOLD} strokeWidth={0.6} />
      <circle cx={C} cy={C} r={330} fill="none" stroke={VIOLET_SOFT} strokeWidth={0.6} />
      <circle cx={C} cy={C} r={150} fill="none" stroke={GOLD} strokeWidth={0.5} />
      {ringTicks(C, C, 430, 486, 132, 6).map((t) => (
        <line key={t.key} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth={t.major ? 1.4 : 0.5} />
      ))}
      {/* the 22 stations of the Major Arcana */}
      {Array.from({ length: 22 }, (_, i) => {
        const a = (360 / 22) * i;
        const p = onCircle(C, C, 458, a + 360 / 44);
        const l1 = onCircle(C, C, 330, a);
        const l2 = onCircle(C, C, 486, a);
        return (
          <g key={i}>
            <line x1={l1.x} y1={l1.y} x2={l2.x} y2={l2.y} stroke={GOLD} strokeWidth={0.5} />
            <text
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={16}
              fill={CREAM}
              fontFamily="ui-monospace, monospace"
            >
              {toRoman(i + 1)}
            </text>
          </g>
        );
      })}
      {Array.from({ length: 22 }, (_, i) => {
        const p = onCircle(C, C, 330, (360 / 22) * i + 360 / 44);
        return <line key={i} x1={C} y1={C} x2={p.x} y2={p.y} stroke={VIOLET_SOFT} strokeWidth={0.3} />;
      })}
      <polygon points={ringPts(150, 4, 0, C, C)} fill="none" stroke={GOLD} strokeWidth={0.45} />
      <polygon points={ringPts(150, 4, 45, C, C)} fill="none" stroke={GOLD} strokeWidth={0.45} />
      <polygon points={ringPts(150, 3, 0, C, C)} fill="none" stroke={VIOLET_SOFT} strokeWidth={0.4} />
      <polygon points={ringPts(150, 3, 180, C, C)} fill="none" stroke={VIOLET_SOFT} strokeWidth={0.4} />
    </svg>
  );
}

function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* nebula washes */}
      <div className="lba-nebula absolute -left-[20vw] top-[6vh] h-[70vmin] w-[70vmin] bg-[radial-gradient(circle,rgba(162,90,223,0.11),transparent_65%)]" />
      <div className="lba-nebula absolute right-[-12vw] top-[48vh] h-[80vmin] w-[80vmin] bg-[radial-gradient(circle,rgba(243,199,122,0.08),transparent_65%)]" />
      <div className="lba-nebula absolute left-[24vw] bottom-[-18vh] h-[60vmin] w-[60vmin] bg-[radial-gradient(circle,rgba(183,148,246,0.07),transparent_65%)]" />

      {/* two huge arcana wheels, half off-screen, counter-rotating */}
      <div className="lba-wheel-spin absolute -top-[42vmin] -right-[48vmin] h-[150vmin] w-[150vmin] opacity-[0.07]">
        <ArcanaWheelSvg />
      </div>
      <div className="lba-wheel-spin-rev absolute -bottom-[46vmin] -left-[44vmin] h-[130vmin] w-[130vmin] opacity-[0.055]">
        <ArcanaWheelSvg />
      </div>

      <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        {/* star specks */}
        {STARS.map((s) =>
          s.tw ? (
            <circle key={s.key} cx={s.x} cy={s.y} r={s.r} fill={CREAM} className="lba-twinkle" style={{ animationDelay: `${s.d}s`, opacity: s.o }} />
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
      <span className="lba-glyph lba-float-a absolute left-[3vw] top-[70vh] text-[26vmin] leading-none text-[#b794f6] opacity-[0.055]">
        ☽{FE}
      </span>
      <span className="lba-glyph lba-float-b absolute right-[6vw] top-[150vh] text-[30vmin] leading-none text-[#f3c77a] opacity-[0.05]">
        ♄{FE}
      </span>
      <span className="lba-glyph lba-float-a absolute left-[38vw] top-[260vh] text-[24vmin] leading-none text-[#e9e6f2] opacity-[0.04]">
        ☉{FE}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Header + tarot cross-nav tabs                                       */
/* ------------------------------------------------------------------ */
function Header() {
  return (
    <header className="relative border-b border-white/[0.07]">
      <div className="mx-auto flex max-w-6xl items-center gap-5 px-5 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="lba-glyph grid h-7 w-7 place-items-center border border-[#f3c77a]/40 bg-[#f3c77a]/[0.07] text-[13px] text-[#f3c77a]">
            ☾{FE}
          </span>
          <span className="lba-serif text-[16px] tracking-wide text-[#e9e6f2]">Astro Scope</span>
        </Link>
        <span className="hidden font-mono text-[9px] tracking-[0.3em] text-[#b7b1cc]/50 sm:inline">
          TAROT · BIRTH ARCANA
        </span>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/" className="hidden text-[12.5px] text-[#b7b1cc] transition-colors hover:text-[#e9e6f2] sm:inline">
            Sign in
          </Link>
          <Link
            href="#lba-tool"
            className="border border-[#f3c77a]/50 bg-[#f3c77a]/10 px-3 py-1.5 text-[12.5px] text-[#ffdd9c] transition-colors hover:bg-[#f3c77a]/20"
          >
            Compute
          </Link>
        </div>
      </div>

      {/* cross-nav tabs — all seven tarot pages, current one lit */}
      <nav aria-label="Tarot pages" className="border-t border-white/[0.05]">
        <div className="mx-auto flex max-w-6xl items-stretch gap-1 overflow-x-auto px-4 py-2 md:px-8">
          {TAROT_TABS.map((t, i) =>
            t.active ? (
              <span
                key={t.href}
                aria-current="page"
                className="lba-chip shrink-0 -rotate-[0.4deg] !border-[#f3c77a]/70 !bg-[#f3c77a]/15 !text-[#ffdd9c]"
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
/* Result diagram — wheel of the 22 with the arcana illuminated        */
/* ------------------------------------------------------------------ */
function ResultDiagram({ n }: { n: number }) {
  const c = 160;
  const hiA = (360 / 22) * (n - 1);
  const hi = onCircle(c, c, 118, hiA);
  return (
    <svg
      viewBox="0 0 320 320"
      className="w-full max-w-[290px]"
      role="img"
      aria-label={`Wheel of the twenty-two arcana, ${toRoman(n)} illuminated`}
    >
      <defs>
        <radialGradient id="lba-res-glow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.18" />
          <stop offset="60%" stopColor={VIOLET} stopOpacity="0.07" />
          <stop offset="100%" stopColor={BG} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={c} cy={c} r="156" fill="url(#lba-res-glow)" />
      <circle cx={c} cy={c} r="150" fill="rgba(12,10,22,0.85)" stroke={GOLD} strokeOpacity="0.6" strokeWidth="0.9" />
      <circle cx={c} cy={c} r="143" fill="none" stroke={VIOLET_SOFT} strokeOpacity="0.35" strokeWidth="0.5" strokeDasharray="2 3" />

      {/* tick scale — 88 ticks */}
      {ringTicks(c, c, 137, 146, 88, 4).map((t) => (
        <line key={t.key} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={GOLD} strokeOpacity={t.major ? 0.5 : 0.3} strokeWidth={t.major ? 0.7 : 0.45} />
      ))}

      {/* inner figure, drawn on */}
      <polygon className="lba-draw" points={ringPts(96, 4, 0, c, c)} fill="none" stroke={GOLD} strokeOpacity="0.55" strokeWidth="0.8" />
      <polygon className="lba-draw" style={{ animationDelay: "0.5s" }} points={ringPts(96, 4, 45, c, c)} fill="none" stroke={VIOLET_SOFT} strokeOpacity="0.5" strokeWidth="0.8" />
      <line className="lba-draw-slow" x1={c} y1={c} x2={hi.x} y2={hi.y} stroke={GOLD} strokeOpacity="0.7" strokeWidth="0.8" />

      {/* the 22 stations */}
      {Array.from({ length: 22 }, (_, i) => {
        const p = onCircle(c, c, 118, (360 / 22) * i);
        const isHi = i === n - 1;
        return (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={isHi ? 13 : 9}
              fill={isHi ? GOLD : "rgba(12,10,22,0.95)"}
              stroke={isHi ? CREAM : GOLD}
              strokeOpacity={isHi ? 1 : 0.5}
              strokeWidth="0.8"
            />
            <text
              x={p.x}
              y={p.y + 2.5}
              textAnchor="middle"
              fontSize={isHi ? 8 : 6}
              fill={isHi ? BG : TEXT_HI}
              opacity={isHi ? 1 : 0.55}
              fontFamily="ui-monospace, monospace"
            >
              {toRoman(i + 1)}
            </text>
          </g>
        );
      })}

      {/* heart of the plate */}
      <circle cx={c} cy={c} r="34" fill={BG} stroke={GOLD} strokeWidth="0.9" />
      <circle cx={c} cy={c} r="28" fill="none" stroke={VIOLET_SOFT} strokeOpacity="0.4" strokeWidth="0.5" />
      <text x={c} y={c + 8} textAnchor="middle" fontSize="26" fill={GOLD} fontFamily="ui-monospace, monospace" letterSpacing="1">
        {toRoman(n)}
      </text>
      <text x={c} y={c + 48} textAnchor="middle" fontSize="6" letterSpacing="2" fill={VIOLET_SOFT} fontFamily="ui-monospace, monospace">
        ROTA · XXII
      </text>
    </svg>
  );
}

/* Alchemical element mark — tiny drawn triangle, no emoji. */
function ElementMark({ element }: { element: string }) {
  const up = element === "Fire" || element === "Air";
  const barred = element === "Air" || element === "Earth";
  const tri = up ? "6,1.5 10.5,10 1.5,10" : "1.5,2 10.5,2 6,10.5";
  return (
    <svg viewBox="0 0 12 14" className="h-3.5 w-3" aria-hidden>
      <polygon points={tri} fill="none" stroke={GOLD} strokeWidth="1" />
      {barred ? <line x1="2.5" y1="12.5" x2="9.5" y2="12.5" stroke={GOLD} strokeWidth="1" /> : null}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* The tool — calculator + result plate                                */
/* ------------------------------------------------------------------ */
function Tool() {
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
      setError("DIES INVALIDA — day must be a number from 1 to 31.");
      setResult(null);
      return;
    }
    if (!/^\d{1,2}$/.test(month) || m < 1 || m > 12) {
      setError("MENSIS INVALIDA — month must be a number from 1 to 12.");
      setResult(null);
      return;
    }
    if (!/^\d{4}$/.test(year) || y < 1900 || y > 2100) {
      setError("ANNVS INVALIDVS — year must be four digits, 1900–2100.");
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

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-0">
      {/* left: title + entry plate */}
      <div className="relative z-10 lg:pr-16">
        <p className="lba-chip -rotate-[0.5deg]">Birth-date numerology · free</p>
        <h1 className="lba-serif mt-5 max-w-xl text-[clamp(30px,4.4vw,48px)] leading-[1.08] tracking-tight text-[#e9e6f2]">
          The card you were <span className="text-[#f3c77a]">born carrying.</span>
        </h1>
        <p className="mt-4 max-w-lg text-[14px] leading-relaxed text-[#b7b1cc]">
          Every birth date folds down to one of the twenty-two Major Arcana. Three numbers open
          the plate — day, month, year.
        </p>

        <form onSubmit={compute} className="lba-panel relative mt-8 max-w-xl -rotate-[0.5deg] px-6 py-6 md:-ml-3 md:px-8">
          <span className="lba-chip absolute -top-3 left-6 rotate-[0.5deg] !text-[9px]">Machina Arcanorum</span>
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
                    className="lba-input w-full px-3 py-2.5 text-center font-mono text-xl tracking-[0.15em] text-[#e9e6f2] placeholder:text-[#e9e6f2]/15 sm:text-2xl"
                  />
                </span>
              </label>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-[8px] leading-relaxed tracking-[0.22em] text-[#b7b1cc]/50">
              Σ DD·MM·YYYY → FOLD TO 1–22
              <br />
              XXII = THE FOOL
            </p>
            <button
              type="submit"
              className="rotate-[0.4deg] border border-[#f3c77a] bg-[#f3c77a] px-6 py-2.5 text-[13px] font-medium text-[#0a0912] transition-transform hover:-translate-y-0.5"
            >
              ✦ Compute my arcana
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
          <span>ARCANA MAIORA · 22</span>
          <span className="text-[#b794f6]">◆ INSTANT · NO SIGN-UP</span>
          <span>MISSION · TALENTS · LESSONS</span>
        </div>
      </div>

      {/* right: result plate, counter-rotated, overlapping the form column */}
      <div ref={resultRef} className="relative z-20 lg:-ml-10 lg:mt-6">
        {result ? (
          <article
            key={`${result.number}-${stamp}`}
            className="lba-panel relative rotate-[1deg] px-6 py-6 !border-[#f3c77a]/35 shadow-[0_0_60px_rgba(243,199,122,0.10)]"
          >
            <span className="lba-chip absolute -top-3 right-6 -rotate-[0.6deg] !border-[#b794f6]/50 !text-[#b794f6]">
              Tabula Illuminata
            </span>

            <div className="lba-rise mb-3 flex items-center justify-between font-mono text-[8px] tracking-[0.22em] text-[#b7b1cc]/55">
              <span>
                Σ = {chain.join(" → ")} → {result.number}
              </span>
              <span className="text-[#b794f6]">FOL. {toRoman(result.number)}</span>
            </div>

            <figure className="lba-rise flex justify-center" style={{ animationDelay: "0.15s" }}>
              <ResultDiagram n={result.number} />
            </figure>

            <div className="lba-rise mt-4 text-center" style={{ animationDelay: "0.3s" }}>
              <div className="lba-serif text-3xl tracking-[0.1em] text-[#f3c77a]">{toRoman(result.number)}</div>
              <h2 className="lba-serif mt-1 text-[24px] tracking-[0.03em] text-[#e9e6f2]">{result.name}</h2>
              <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5">
                {result.keywords.map((k) => (
                  <span key={k} className="border border-[#f3c77a]/30 px-2 py-0.5 text-[8px] uppercase tracking-[0.2em] text-[#f3c77a]">
                    {k}
                  </span>
                ))}
              </div>
            </div>

            <div className="lba-rise mt-4 border-t border-white/[0.08] pt-3.5" style={{ animationDelay: "0.45s" }}>
              <div className="text-[8px] uppercase tracking-[0.28em] text-[#b794f6]">Missio · the life mission</div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-[#b7b1cc]">{result.mission}</p>
            </div>

            <div className="lba-rise mt-4 grid grid-cols-2 gap-2 font-mono" style={{ animationDelay: "0.6s" }}>
              <div className="border border-white/[0.08] bg-[#0a0912]/50 px-3 py-2">
                <span className="block text-[7px] tracking-[0.26em] text-[#b7b1cc]/50">ELEMENTVM</span>
                <span className="mt-1 flex items-center gap-2 text-[10px] tracking-[0.16em] text-[#f3c77a]">
                  <ElementMark element={result.element} />
                  {result.element.toUpperCase()}
                </span>
              </div>
              <div className="border border-white/[0.08] bg-[#0a0912]/50 px-3 py-2">
                <span className="block text-[7px] tracking-[0.26em] text-[#b7b1cc]/50">ASTRVM</span>
                <span className="mt-1 flex items-center gap-2 text-[10px] tracking-[0.16em] text-[#f3c77a]">
                  <span aria-hidden className="lba-glyph text-[13px] leading-none">
                    {ASTRO_GLYPHS[result.astrology] ?? "✦"}
                  </span>
                  {result.astrology.toUpperCase()}
                </span>
              </div>
            </div>

            <div
              className="lba-rise mt-4 flex items-center justify-between border-t border-white/[0.08] pt-3 font-mono text-[7px] tracking-[0.22em] text-[#b7b1cc]/45"
              style={{ animationDelay: "0.75s" }}
            >
              <span>CONCORDANTIAE · {result.compatibleArcanas.map(toRoman).join(" · ")}</span>
              <span>SCALA 1 : 22</span>
            </div>
          </article>
        ) : (
          <div aria-hidden className="lba-panel relative hidden select-none rotate-[1deg] px-6 py-6 lg:block lg:opacity-60">
            <span className="lba-chip absolute -top-3 right-6 -rotate-[0.6deg] !text-[9px]">Tabula Vacua</span>
            <div className="flex min-h-[380px] flex-col items-center justify-center gap-3 text-center">
              <span className="lba-glyph text-[26px] text-[#f3c77a]/40">✶</span>
              <p className="max-w-[230px] font-mono text-[8px] leading-relaxed tracking-[0.24em] text-[#b7b1cc]/45">
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
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function BirthArcanaPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#0a0912] font-sans text-[#e9e6f2] antialiased selection:bg-[#f3c77a]/25">
      <style>{LBA_STYLES}</style>
      <Backdrop />

      <div className="relative z-10">
        <Header />

        {/* ================= TOOL — top of the viewport ================= */}
        <section id="lba-tool" className="relative overflow-visible">
          {/* slashed hairline crossing the tool stage */}
          <div
            className="pointer-events-none absolute left-[-4vw] top-[62%] h-px w-[108vw] -rotate-[0.9deg] bg-gradient-to-r from-transparent via-[#b794f6]/25 to-transparent"
            aria-hidden
          />
          {/* small wheel hanging off the left margin behind the form */}
          <div className="lba-wheel-spin-slow pointer-events-none absolute -left-40 top-10 hidden h-[380px] w-[380px] opacity-[0.1] xl:block" aria-hidden>
            <ArcanaWheelSvg />
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
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-0">
              {/* what it is — wide, tilted left */}
              <div className="lba-panel relative z-10 -rotate-[0.5deg] px-6 py-7 lg:mr-6">
                <span className="lba-chip absolute -top-3 left-6 !text-[9px]">Quid est</span>
                <h2 className="lba-serif text-[clamp(20px,2.6vw,28px)] text-[#e9e6f2]">
                  What is a Birth Arcana
                </h2>
                <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-[#b7b1cc]">
                  One of the 22 Major Arcana, fixed by the digits of your birth date. Where a
                  zodiac sign describes the weather you were born under, the arcana describes the
                  errand you were born with — a single card that does not change across your life.
                </p>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {GIFTS.map(([k, v], i) => (
                    <div
                      key={k}
                      className={`border border-white/[0.08] bg-[#0a0912]/50 px-3 py-2.5 ${
                        i % 2 === 0 ? "lg:-rotate-[0.4deg]" : "lg:translate-y-1 lg:rotate-[0.4deg]"
                      }`}
                    >
                      <span className="block font-mono text-[7px] tracking-[0.26em] text-[#b794f6]">
                        {["I", "II", "III", "IV"][i]} · {k}
                      </span>
                      <span className="mt-1 block text-[11.5px] leading-snug text-[#b7b1cc]/90">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* how it is computed — counter-tilted, overlapping, pushed down */}
              <div className="lba-panel relative z-20 rotate-[0.6deg] px-6 py-7 lg:-ml-10 lg:mt-14">
                <span className="lba-chip absolute -top-3 right-6 !border-[#b794f6]/50 !text-[9px] !text-[#b794f6]">
                  Ars computandi
                </span>
                <h2 className="lba-serif text-[clamp(20px,2.6vw,28px)] text-[#e9e6f2]">
                  How it is calculated
                </h2>
                <ol className="mt-4 space-y-3">
                  {STEPS.map((s) => (
                    <li key={s.no} className="flex items-baseline gap-4">
                      <span className="lba-serif shrink-0 text-[22px] leading-none text-[#f3c77a]">{s.no}</span>
                      <p className="text-[12.5px] leading-relaxed text-[#b7b1cc]">
                        <span className="text-[11px] uppercase tracking-[0.14em] text-[#e9e6f2]">{s.title}.</span>{" "}
                        {s.copy}
                      </p>
                    </li>
                  ))}
                </ol>

                {/* worked example readout strip */}
                <div className="mt-5 -rotate-[0.4deg] border border-[#f3c77a]/25 bg-[#0a0912]/60 px-4 py-3">
                  <div className="font-mono text-[7px] tracking-[0.3em] text-[#b7b1cc]/50">EXEMPLVM</div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-[0.08em] text-[#b7b1cc]">
                    <span className="text-[#e9e6f2]">{EXAMPLE.date}</span>
                    <span aria-hidden className="text-[#f3c77a]/60">→</span>
                    <span>
                      {EXAMPLE.digits} = <span className="text-[#f3c77a]">{EXAMPLE.sum}</span>
                    </span>
                    <span aria-hidden className="text-[#f3c77a]/60">→</span>
                    <span>
                      {EXAMPLE.fold} = <span className="text-[#f3c77a]">{EXAMPLE.result}</span>
                    </span>
                    <span aria-hidden className="text-[#f3c77a]/60">→</span>
                    <span className="text-[#ffdd9c]">{toRoman(EXAMPLE.result)} · THE EMPEROR</span>
                  </div>
                </div>
              </div>
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
            <h2 className="lba-serif rotate-[0.3deg] text-[clamp(22px,3vw,32px)] text-[#e9e6f2] md:translate-x-[14%]">
              Questions from the margins
            </h2>
            <div className="relative mx-auto mt-9 max-w-2xl md:ml-[10%]">
              {FAQ.map((f, i) => (
                <details
                  key={f.q}
                  className={`lba-panel group relative z-10 mb-3 px-6 py-5 open:border-[#f3c77a]/40 ${
                    i % 2 === 0 ? "-rotate-[0.4deg] md:-ml-10 md:mr-6" : "rotate-[0.4deg] md:ml-10 md:-mr-4"
                  }`}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14.5px] text-[#e9e6f2] marker:hidden [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="lba-glyph shrink-0 text-[13px] text-[#f3c77a] transition-transform group-open:rotate-45">
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
              <span className="lba-glyph grid h-6 w-6 place-items-center border border-[#f3c77a]/40 bg-[#f3c77a]/[0.07] text-[11px] text-[#f3c77a]">
                ☾{FE}
              </span>
              <span className="lba-serif text-[14px] text-[#e9e6f2]">Astro Scope</span>
              <span className="font-mono text-[7px] tracking-[0.26em] text-[#b7b1cc]/45">TAROT · BIRTH ARCANA</span>
            </div>
            <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1 font-mono text-[8px] uppercase tracking-[0.2em] text-[#b7b1cc]/60">
              <Link href="/tarot" className="transition-colors hover:text-[#f3c77a]">Tarot Hub</Link>
              <Link href="/tarot/spreads/daily-card" className="transition-colors hover:text-[#f3c77a]">Daily Card</Link>
              <Link href="/tarot/cards" className="transition-colors hover:text-[#f3c77a]">All Cards</Link>
              <Link href="#lba-tool" className="transition-colors hover:text-[#f3c77a]">Compute ↑</Link>
            </nav>
            <p className="font-mono text-[8px] tracking-[0.22em] text-[#b7b1cc]/40">© MMXXVI · AS ABOVE · SO BELOW</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
