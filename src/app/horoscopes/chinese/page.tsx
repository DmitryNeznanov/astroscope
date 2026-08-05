"use client";

// CHINESE HOROSCOPE HUB — /horoscopes/chinese. An instrument hub, not a
// landing: compact header with cross-nav tabs, a WORKING "find your animal"
// year engine at the top of the viewport, the twelve animals as an arc of
// staggered instrument plates, four understanding plates, slim FAQ + footer.
// Broken + magic structure kept: a 12-gate year-wheel bleeds off the right
// edge behind the tool frame, plates sag along a shallow arc and weave in z,
// chips straddle borders, layered background machinery passes BEHIND
// translucent panels. Palette = production (lab/remix-v2): ink #0a0912, text
// #e9e6f2/#b7b1cc, golds #f3c77a/#e39a4c/#ffdd9c, deep gold #c9a227
// hairlines, violet #a25adf/#b794f6. Self-contained: inline SVG + Tailwind +
// one scoped <style> block (lch-). No emojis — animals are hanzi glyph marks
// inside drawn SVG sigil rings. Client component: the year engine is live.
// Motion is CSS-only, slow, reduced-motion guarded.

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { CHINESE_ZODIAC_SIGNS } from "@/lib/chinese-zodiac";

const DEG = Math.PI / 180;

// production palette (from lab/remix-v2, lifted from the live stylesheets)
const TEXT_HI = "#e9e6f2"; // --text-primary
const TEXT_LO = "#b7b1cc"; // --text-secondary
const GOLD = "#f3c77a"; // --accent-primary
const GOLD_HI = "#ffdd9c"; // --accent-tertiary (cream)
const GOLD_DEEP = "#c9a227"; // darker gold, hairlines
const VIOLET = "#a25adf"; // purple tint
const VIOLET_SOFT = "#b794f6";

const FE = "︎"; // literal U+FE0E: glyphs render as text, never emoji

// hanzi marks + earthly branches, aligned with CHINESE_ZODIAC_SIGNS order
const HANZI = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
const BRANCH = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

// cross-nav: the site's tool routes as instrument tabs; this hub is active
const NAV = [
  { href: "/tarot", label: "Tarot", idx: "00", active: false },
  { href: "/tarot/spreads/daily-card", label: "Daily Card", idx: "01", active: false },
  { href: "/tarot/spreads/yes-no", label: "Yes / No", idx: "02", active: false },
  { href: "/tarot/spreads/past-present-future", label: "Past · Present · Future", idx: "03", active: false },
  { href: "/tarot/spreads/love-three-card", label: "Love", idx: "04", active: false },
  { href: "/tarot/birth-arcana", label: "Birth Arcana", idx: "05", active: false },
  { href: "/tarot/cards", label: "All Cards", idx: "06", active: false },
  { href: "/matrix", label: "Matrix", idx: "07", active: false },
  { href: "/horoscopes/chinese", label: "Horoscope", idx: "08", active: true },
];

// the twelve plates ride a shallow arc: edges sag, center rides highest;
// rotation follows the tangent, z-index peaks mid-arc so plates weave
const ARC = [
  "lg:translate-y-[30px] lg:rotate-[-2.6deg]",
  "lg:translate-y-[20px] lg:rotate-[-2.2deg]",
  "lg:translate-y-[12px] lg:rotate-[-1.7deg]",
  "lg:translate-y-[6px]  lg:rotate-[-1.2deg]",
  "lg:translate-y-[2px]  lg:rotate-[-0.6deg]",
  "lg:translate-y-0      lg:rotate-[-0.2deg]",
  "lg:translate-y-0      lg:rotate-[0.2deg]",
  "lg:translate-y-[2px]  lg:rotate-[0.6deg]",
  "lg:translate-y-[6px]  lg:rotate-[1.2deg]",
  "lg:translate-y-[12px] lg:rotate-[1.7deg]",
  "lg:translate-y-[20px] lg:rotate-[2.2deg]",
  "lg:translate-y-[30px] lg:rotate-[2.6deg]",
];
const ARC_Z = [
  "lg:z-10", "lg:z-20", "lg:z-30", "lg:z-40", "lg:z-50", "lg:z-[60]",
  "lg:z-[60]", "lg:z-50", "lg:z-40", "lg:z-30", "lg:z-20", "lg:z-10",
];

const UNDERSTANDING = [
  {
    no: "I",
    title: "The 12-Year Cycle",
    copy: "Each lunar year belongs to one of twelve animals. The cycle repeats every dozen years, and the animal ruling your birth year is said to shape personality, inclination, and destiny.",
    frame: "relative z-20 rotate-[-0.5deg] lg:w-[58%]",
  },
  {
    no: "II",
    title: "Five Elements",
    copy: "Wood, Fire, Earth, Metal, and Water overlay the animals, adding depth and nuance — a Wood Tiger and a Metal Tiger share a spine but not a temperament.",
    frame: "relative z-30 rotate-[0.6deg] lg:ml-auto lg:-mt-8 lg:w-[52%]",
  },
  {
    no: "III",
    title: "Compatibility",
    copy: "Some pairings run harmonious, others rub toward conflict. Trines of affinity and the six clashes map which animals ease each other — and which negotiate.",
    frame: "relative z-10 rotate-[-0.6deg] lg:ml-[6%] lg:-mt-7 lg:w-[48%]",
  },
  {
    no: "IV",
    title: "Annual Forecasts",
    copy: "Each turning year carries its own animal weather: predictions for love, career, health, and fortune shift as the wheel advances through the twelve.",
    frame: "relative z-20 rotate-[0.4deg] lg:ml-auto lg:-mt-9 lg:w-[55%]",
  },
];

const FAQ = [
  {
    q: "How does the twelve-year cycle work?",
    a: "The Chinese zodiac assigns one animal to each lunar year in a repeating twelve-year loop — Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, Pig. Your sign is the animal that ruled the year you were born.",
  },
  {
    q: "How do I find my animal sign?",
    a: "Use the year engine at the top of this page: enter your four-digit birth year and the wheel names your animal, element, and traits. The count runs from 1924, a Rat year, advancing one animal per year.",
  },
  {
    q: "What do the five elements mean?",
    a: "Wood, Fire, Earth, Metal, and Water rotate through the cycle alongside the animals, so every sign appears in five elemental flavors across sixty years. The element colors the animal's character — tempering or sharpening its traits.",
  },
];

/* ============================ GEOMETRY HELPERS ============================ */

// point on a circle; 0deg = top, clockwise
function onCircle(cx: number, cy: number, r: number, deg: number) {
  const t = (deg - 90) * DEG;
  return { x: +(cx + r * Math.cos(t)).toFixed(1), y: +(cy + r * Math.sin(t)).toFixed(1) };
}

// n radial tick marks from rIn to rOut around (cx, cy)
function ringTicks(cx: number, cy: number, rIn: number, rOut: number, n: number, every = 6) {
  return Array.from({ length: n }, (_, k) => {
    const a = (360 / n) * k;
    const p1 = onCircle(cx, cy, rIn, a);
    const p2 = onCircle(cx, cy, rOut, a);
    return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, major: k % every === 0, key: k };
  });
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

// star field, generated once at module scope
const STARS = (() => {
  const rnd = mulberry32(19240125);
  return Array.from({ length: 100 }, (_, i) => ({
    x: +(rnd() * 1600).toFixed(0),
    y: +(rnd() * 1000).toFixed(0),
    r: +(0.5 + rnd() * 1.1).toFixed(2),
    o: +(0.14 + rnd() * 0.4).toFixed(2),
    tw: i % 5 === 0,
    d: +(rnd() * 8).toFixed(1),
    key: i,
  }));
})();

/* ============================ SIGILS & WHEELS ============================= */

// animal sigil: a drawn instrument ring with the hanzi mark at its center —
// ring, dual tick banks, branch spokes; no emoji, all strokes
function Sigil({ index, size = 56, dim = false }: { index: number; size?: number; dim?: boolean }) {
  const C = 50;
  const ticks = ringTicks(C, C, 38, 44, 12, 1);
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
      <circle cx={C} cy={C} r={47} fill="none" stroke={GOLD_DEEP} strokeWidth={0.8} opacity={dim ? 0.5 : 0.85} />
      <circle cx={C} cy={C} r={38} fill="none" stroke={GOLD} strokeWidth={0.4} opacity={0.55} />
      {ticks.map((t) => (
        <line
          key={t.key}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={index % 2 === 0 ? GOLD : VIOLET_SOFT}
          strokeWidth={t.key % 3 === 0 ? 1 : 0.45}
          opacity={0.7}
        />
      ))}
      {[0, 120, 240].map((a) => {
        const p = onCircle(C, C, 47, a + index * 30);
        return <circle key={a} cx={p.x} cy={p.y} r={1.6} fill={GOLD_HI} opacity={0.9} />;
      })}
      <text
        x={C}
        y={C + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={30}
        fill={dim ? TEXT_LO : GOLD_HI}
        opacity={dim ? 0.8 : 1}
      >
        {HANZI[index]}
      </text>
    </svg>
  );
}

// the hero apparatus: a twelve-gate year-wheel, hanzi on the outer band,
// element ring inside — bleeds off the right edge of the viewport
function YearWheel() {
  const C = 400;
  const ELEMENTS = ["Water", "Earth", "Wood", "Wood", "Earth", "Fire", "Fire", "Earth", "Metal", "Metal", "Earth", "Water"];
  return (
    <svg viewBox="0 0 800 800" className="h-full w-full drop-shadow-[0_0_80px_rgba(162,90,223,0.28)]">
      <defs>
        <radialGradient id="lch-hg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={VIOLET} stopOpacity={0.16} />
          <stop offset="55%" stopColor={VIOLET} stopOpacity={0.05} />
          <stop offset="100%" stopColor={VIOLET} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={C} cy={C} r={392} fill="url(#lch-hg)" />
      <circle cx={C} cy={C} r={330} fill="none" stroke={GOLD} strokeWidth={1.1} opacity={0.9} />
      <circle cx={C} cy={C} r={284} fill="none" stroke={GOLD} strokeWidth={0.5} opacity={0.6} />
      <circle cx={C} cy={C} r={204} fill="none" stroke={VIOLET_SOFT} strokeWidth={0.6} opacity={0.55} />
      <circle cx={C} cy={C} r={96} fill="none" stroke={GOLD} strokeWidth={0.5} opacity={0.55} />
      {ringTicks(C, C, 284, 330, 120, 10).map((t) => (
        <line
          key={t.key}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={GOLD}
          strokeWidth={t.major ? 1.1 : 0.4}
          opacity={t.major ? 0.85 : 0.5}
        />
      ))}
      {HANZI.map((h, i) => {
        const p = onCircle(C, C, 307, i * 30 + 15);
        const a = onCircle(C, C, 284, i * 30);
        const b = onCircle(C, C, 330, i * 30);
        const e = onCircle(C, C, 244, i * 30 + 15);
        return (
          <g key={h}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={GOLD} strokeWidth={0.5} opacity={0.6} />
            <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize={24} fill={GOLD_HI} opacity={0.95}>
              {h}
            </text>
            <text x={e.x} y={e.y} textAnchor="middle" dominantBaseline="central" fontSize={10} letterSpacing={2} fill={VIOLET_SOFT} opacity={0.8} className="lch-mono">
              {ELEMENTS[i].toUpperCase()}
            </text>
          </g>
        );
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const p = onCircle(C, C, 204, i * 30);
        return <line key={i} x1={C} y1={C} x2={p.x} y2={p.y} stroke={VIOLET_SOFT} strokeWidth={0.35} opacity={0.5} />;
      })}
      {/* inner hexagram web */}
      {[0, 60, 120, 180, 240, 300].map((a, i) => {
        const p1 = onCircle(C, C, 96, a);
        const p2 = onCircle(C, C, 96, a + (i % 2 === 0 ? 120 : 180));
        return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={i % 2 === 0 ? GOLD : VIOLET_SOFT} strokeWidth={0.55} opacity={0.65} />;
      })}
      <text x={C} y={C} textAnchor="middle" dominantBaseline="central" fontSize={34} fill={TEXT_HI} opacity={0.9} className="lch-glyph">
        ☯{FE}
      </text>
    </svg>
  );
}

/* ============================ BACKDROP PIECES ============================= */

// fixed layer behind everything: stars, nebulae, orbits, construction lines
function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="lch-nebula absolute -left-[20vw] top-[10vh] h-[70vmin] w-[70vmin] bg-[radial-gradient(circle,rgba(162,90,223,0.10),transparent_65%)]" />
      <div className="lch-nebula absolute right-[-14vw] top-[46vh] h-[80vmin] w-[80vmin] bg-[radial-gradient(circle,rgba(243,199,122,0.07),transparent_65%)]" />
      <div className="lch-nebula absolute left-[26vw] bottom-[-16vh] h-[60vmin] w-[60vmin] bg-[radial-gradient(circle,rgba(183,148,246,0.07),transparent_65%)]" />

      <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        {STARS.map((s) =>
          s.tw ? (
            <circle key={s.key} cx={s.x} cy={s.y} r={s.r} fill={GOLD_HI} className="lch-twinkle" style={{ animationDelay: `${s.d}s`, opacity: s.o }} />
          ) : (
            <circle key={s.key} cx={s.x} cy={s.y} r={s.r} fill={TEXT_LO} opacity={s.o} />
          ),
        )}

        {/* hairline orbit circles, centers pushed off-canvas */}
        <circle cx={1720} cy={220} r={520} fill="none" stroke={GOLD_DEEP} strokeWidth={0.5} opacity={0.4} />
        <circle cx={1720} cy={220} r={700} fill="none" stroke={GOLD_DEEP} strokeWidth={0.4} opacity={0.26} strokeDasharray="2 7" />
        <circle cx={-150} cy={860} r={430} fill="none" stroke={VIOLET} strokeWidth={0.5} opacity={0.32} />
        <circle cx={-150} cy={860} r={570} fill="none" stroke={VIOLET} strokeWidth={0.4} opacity={0.18} strokeDasharray="2 8" />

        {/* construction lines crossing the whole page */}
        <line x1={-80} y1={200} x2={1700} y2={740} stroke={TEXT_LO} strokeWidth={0.4} opacity={0.16} />
        <line x1={-80} y1={920} x2={1680} y2={140} stroke={TEXT_LO} strokeWidth={0.4} opacity={0.12} />
        <line x1={180} y1={-60} x2={180} y2={1060} stroke={GOLD_DEEP} strokeWidth={0.4} opacity={0.16} strokeDasharray="1 6" />

        {/* constellation: a lo-shu-ish square, upper left */}
        <g opacity={0.55}>
          <polyline points="220,150 310,120 380,190 330,270 236,244 220,150" fill="none" stroke={VIOLET_SOFT} strokeWidth={0.6} opacity={0.5} />
          <line x1={310} y1={120} x2={330} y2={270} stroke={VIOLET_SOFT} strokeWidth={0.6} opacity={0.4} />
          {[[220, 150], [310, 120], [380, 190], [330, 270], [236, 244]].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={1.7} fill={TEXT_HI} opacity={0.8} />
          ))}
        </g>
      </svg>

      {/* giant dim hanzi drifting behind sections */}
      <span className="lch-float-a absolute left-[2vw] top-[92vh] text-[24vmin] leading-none text-[#b794f6] opacity-[0.05]">辰</span>
      <span className="lch-float-b absolute right-[4vw] top-[212vh] text-[28vmin] leading-none text-[#f3c77a] opacity-[0.045]">申</span>
      <span className="lch-glyph lch-float-a absolute left-[40vw] top-[330vh] text-[22vmin] leading-none text-[#e9e6f2] opacity-[0.035]">☯{FE}</span>

      <span className="lch-shoot" style={{ top: "16vh", right: "-12vw" }} />
      <span className="lch-shoot lch-shoot-b" style={{ top: "52vh", right: "-18vw" }} />
    </div>
  );
}

/* ================================ SECTIONS ================================ */

// compact instrument header + cross-nav tabs
function Header() {
  return (
    <header className="lch-panel mt-4 lg:rotate-[0.15deg]">
      <div className="flex items-center gap-4 border-b px-3 py-2 sm:px-4" style={{ borderColor: "rgba(233,230,242,0.08)" }}>
        <Link href="/horoscopes/chinese" className="flex items-center gap-2.5">
          <span className="lch-inset flex h-7 w-7 items-center justify-center">
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden>
              <circle cx="10" cy="10" r="7.4" stroke={GOLD_HI} strokeWidth="0.9" />
              <circle cx="10" cy="10" r="3.2" stroke={GOLD} strokeWidth="0.7" />
              {ringTicks(10, 10, 6, 7.4, 12, 1).map((t) => (
                <line key={t.key} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth="0.5" />
              ))}
            </svg>
          </span>
          <span className="lch-serif text-[15px] tracking-[0.3em]" style={{ color: GOLD_HI }}>
            HOROSCOPE
          </span>
        </Link>
        <span className="lch-mono hidden text-[7px] tracking-[0.22em] uppercase sm:inline" style={{ color: GOLD_DEEP }}>
          EASTERN ASTROLABE · CYCLE OF TWELVE
        </span>
        <span className="lch-mono ml-auto hidden text-[7px] tracking-[0.18em] lg:inline" style={{ color: TEXT_LO }}>
          EPOCH 1924 · RAT · ENGINE NOMINAL
        </span>
        <span className="lch-chip lch-mono ml-auto px-2 py-1 text-[7px] tracking-[0.2em] lg:ml-0">12 GATES</span>
      </div>
      <nav className="flex flex-wrap items-stretch" aria-label="Tool instruments">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            aria-current={n.active ? "page" : undefined}
            className={`lch-tab lch-mono flex items-baseline gap-1.5 px-3 py-2 text-[8px] tracking-[0.2em] uppercase sm:px-4 ${n.active ? "lch-tab-on" : ""}`}
          >
            <span className="text-[6.5px] tracking-[0.1em]">{n.idx}</span>
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

// headline + the working year engine, with the wheel bleeding off the edge
function HeroTool() {
  const [year, setYear] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function read(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const y = Number.parseInt(year, 10);
    if (!/^\d{4}$/.test(year.trim()) || Number.isNaN(y) || y < 1900 || y > 2100) {
      setResult(null);
      setError("The wheel reads four digits — a year between 1900 and 2100.");
      return;
    }
    setError(null);
    // 1924 is a Rat year; count forward one animal per year, wrapping at 12
    setResult((((y - 1924) % 12) + 12) % 12);
  }

  const sign = result !== null ? CHINESE_ZODIAC_SIGNS[result] : null;

  return (
    <section className="relative mt-8 lg:mt-12">
      {/* the year-wheel apparatus: dominant mass bleeding off the right edge */}
      <div
        className="lch-hero-drift pointer-events-none absolute top-1/2 left-[46%] hidden aspect-square w-[76vw] max-w-[940px] -translate-y-1/2 rotate-[0.6deg] md:block"
        aria-hidden
      >
        <YearWheel />
      </div>

      <div className="relative z-10 pb-16 md:pb-24">
        <div className="relative max-w-2xl">
          {/* scrim keeps the type readable over the wheel's left arc */}
          <div
            className="pointer-events-none absolute -inset-10 -z-10 bg-[radial-gradient(closest-side,rgba(10,9,18,0.95),rgba(10,9,18,0.65)_55%,transparent_80%)] md:-inset-16"
            aria-hidden
          />
          <p className="lch-chip -rotate-[0.5deg]">LUNAR CALENDAR · TWELVE ANIMALS · FIVE ELEMENTS</p>

          <h1 className="lch-serif mt-6 text-[clamp(34px,5.4vw,60px)] leading-[1.05] tracking-tight text-[#e9e6f2]">
            Twelve animals.{" "}
            <span className="text-[#f3c77a]">One turning wheel of years.</span>
          </h1>

          <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-[#b7b1cc]">
            The Chinese horoscope counts in twelves: every lunar year carries an animal, and the
            animal of your birth year rides with you for life. Name your year — the wheel names
            your animal.
          </p>
        </div>

        {/* ================= THE YEAR ENGINE =================
            engraved frame holding the working tool; corners + halo */}
        <div className="lch-frame relative z-10 mt-10 max-w-[620px] lg:rotate-[-0.3deg]">
          <span className="lch-corner lch-corner-tl" aria-hidden />
          <span className="lch-corner lch-corner-tr" aria-hidden />
          <span className="lch-corner lch-corner-bl" aria-hidden />
          <span className="lch-corner lch-corner-br" aria-hidden />
          <header className="flex items-center gap-3 px-4 pt-3.5 sm:px-5">
            <span className="lch-panel-h-line" aria-hidden />
            <span className="lch-serif text-[12px] tracking-[0.34em] whitespace-nowrap sm:text-[13px]" style={{ color: GOLD_HI }}>
              ✶ FIND YOUR ANIMAL ✶
            </span>
            <span className="lch-panel-h-line" aria-hidden />
            <span className="lch-mono hidden text-[7px] tracking-[0.22em] sm:inline" style={{ color: GOLD_DEEP }}>
              TOOL 01 · LIVE
            </span>
          </header>

          <div className="p-4 sm:p-5">
            <form onSubmit={read} className="flex flex-wrap items-stretch gap-3">
              <label className="lch-mono flex min-w-0 flex-1 items-center gap-2 border border-white/10 bg-white/[0.03] px-3 py-2.5 text-[9px] tracking-[0.2em] uppercase" style={{ color: TEXT_LO }}>
                Birth year
                <input
                  value={year}
                  onChange={(e) => setYear(e.target.value.replace(/[^\d]/g, "").slice(0, 4))}
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="1990"
                  aria-label="Birth year, four digits"
                  className="lch-mono w-full min-w-0 bg-transparent text-[15px] tracking-[0.3em] text-[#ffdd9c] outline-none placeholder:text-[#b7b1cc]/35"
                />
              </label>
              <button
                type="submit"
                className="rotate-[0.4deg] border border-[#f3c77a] bg-[#f3c77a] px-5 py-2.5 text-[12px] font-medium tracking-[0.12em] uppercase text-[#0a0912] transition-transform hover:-translate-y-0.5"
              >
                Read the wheel
              </button>
            </form>

            {error && (
              <p className="lch-mono mt-3 text-[10px] tracking-[0.14em] text-[#b794f6]">{error}</p>
            )}

            {sign && result !== null && (
              <div key={sign.key} className="lch-draw mt-4 flex items-center gap-4 border border-[#f3c77a]/25 bg-[#f3c77a]/[0.05] p-4">
                <Sigil index={result} size={72} />
                <div className="min-w-0">
                  <p className="lch-mono text-[7px] tracking-[0.24em] uppercase" style={{ color: GOLD_DEEP }}>
                    GATE {String(result + 1).padStart(2, "0")} · BRANCH {BRANCH[result]} · {sign.element.toUpperCase()}
                  </p>
                  <p className="lch-serif mt-1 text-[24px] leading-none text-[#e9e6f2]">
                    Year of the <span className="text-[#f3c77a]">{sign.name}</span>
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {sign.traits.slice(0, 3).map((t) => (
                      <span key={t} className="lch-chip !px-2 !py-0.5 !text-[8px] !tracking-[0.14em]">{t}</span>
                    ))}
                  </div>
                  <Link href={`/horoscopes/chinese/${sign.key}`} className="lch-gold-link mt-3 inline-block text-[12.5px]">
                    Open the {sign.name} dossier →
                  </Link>
                </div>
              </div>
            )}

            {!sign && !error && (
              <p className="mt-3 text-[11.5px] leading-relaxed text-[#b7b1cc]/70">
                The count runs from 1924 — a Rat year — advancing one animal per turn of the
                calendar. Enter any year from 1900 to 2100.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* hero's bottom rule — the twelve ride straight over it */}
      <div
        className="pointer-events-none absolute bottom-6 left-[-4vw] h-px w-[108vw] -rotate-[0.35deg] bg-gradient-to-r from-transparent via-[#f3c77a]/30 to-transparent"
        aria-hidden
      />
    </section>
  );
}

// THE TWELVE: instrument plates on a shallow arc, weaving in z
function Twelve() {
  return (
    // pulled up over the hero's bottom rule; understanding plates pull back over it
    <section className="relative z-20 -mt-6 md:-mt-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 px-2 md:px-4">
          <div>
            <p className="lch-mono rotate-[-0.4deg] text-[9px] tracking-[0.26em] uppercase" style={{ color: GOLD_DEEP }}>
              Index of gates · I – XII
            </p>
            <h2 className="lch-serif mt-2 max-w-md -rotate-[0.3deg] text-[clamp(24px,3.2vw,38px)] leading-tight text-[#e9e6f2]">
              The Twelve
            </h2>
          </div>
          <p className="max-w-xs translate-y-1 text-[11.5px] leading-relaxed text-[#b7b1cc]/75">
            Each plate is a gate of the cycle — sigil, element, first trait, and the years it rules.
          </p>
        </div>

        {/* shallow arc: plates sag toward the edges, overlap sideways, weave in z */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:items-start lg:gap-0">
          {CHINESE_ZODIAC_SIGNS.map((s, i) => (
            <Link
              key={s.key}
              href={`/horoscopes/chinese/${s.key}`}
              className={`lch-panel group relative px-4 py-5 transition-colors hover:border-[#f3c77a]/45 lg:flex-1 lg:px-3 ${
                i > 0 ? "lg:-ml-3" : ""
              } ${ARC[i]} ${ARC_Z[i]}`}
            >
              <span className="lch-mono absolute -top-2.5 left-3 border border-[#c9a227]/40 bg-[#0a0912] px-1.5 py-0.5 text-[7px] tracking-[0.2em]" style={{ color: GOLD_DEEP }}>
                {String(i + 1).padStart(2, "0")} · {BRANCH[i]}
              </span>
              <span className="block transition-transform group-hover:scale-105">
                <Sigil index={i} size={54} dim />
              </span>
              <span className="lch-serif mt-3 block text-[16px] text-[#e9e6f2] transition-colors group-hover:text-[#ffdd9c]">{s.name}</span>
              <span className="lch-mono mt-1 block text-[8px] tracking-[0.2em] uppercase" style={{ color: VIOLET_SOFT }}>
                {s.element}
              </span>
              <span className="lch-chip mt-2.5 !px-1.5 !py-0.5 !text-[7px] !tracking-[0.12em]">{s.traits[0]}</span>
              <span className="lch-mono mt-2.5 block text-[8px] tracking-[0.14em] text-[#b7b1cc]/70">
                {s.years[0]} – {s.years[s.years.length - 1]}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// four understanding plates in an asymmetric cascade
function Understanding() {
  return (
    <section className="relative z-20 mt-6 pb-4 pt-16 md:pt-24">
      {/* hairline rules slashing through the cascade at their own angles */}
      <div className="pointer-events-none absolute left-[-4vw] top-[30%] h-px w-[108vw] -rotate-[1.2deg] bg-gradient-to-r from-transparent via-[#b794f6]/25 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute left-[-4vw] top-[74%] h-px w-[108vw] rotate-[0.7deg] bg-gradient-to-r from-transparent via-[#f3c77a]/20 to-transparent" aria-hidden />

      <div className="relative">
        <p className="lch-mono rotate-[-0.4deg] text-[9px] tracking-[0.26em] uppercase" style={{ color: GOLD_DEEP }}>
          Field notes · read the system
        </p>
        <h2 className="lch-serif mt-3 max-w-2xl text-[clamp(26px,3.6vw,42px)] leading-tight text-[#e9e6f2] md:translate-x-10">
          Understanding Chinese Astrology
        </h2>

        <div className="mt-12 flex flex-col gap-5 md:mt-16 lg:gap-0">
          {UNDERSTANDING.map((u) => (
            <div key={u.no} className={`lch-panel group px-6 py-7 transition-colors hover:border-[#f3c77a]/45 ${u.frame}`}>
              <span className="lch-chip absolute -top-2.5 right-5 !px-2 !py-0.5 !text-[9px]">NOTE {u.no}</span>
              <h3 className="lch-serif text-[20px] text-[#e9e6f2]">{u.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[#b7b1cc]">{u.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="relative py-14 md:py-20">
      {/* vertical hairline breaking through the FAQ column */}
      <div
        className="pointer-events-none absolute left-[7%] top-[-2rem] hidden h-[calc(100%+4rem)] w-px rotate-[0.4deg] bg-gradient-to-b from-transparent via-[#f3c77a]/25 to-transparent md:block"
        aria-hidden
      />
      <h2 className="lch-serif rotate-[0.3deg] text-[clamp(22px,2.8vw,32px)] text-[#e9e6f2] md:translate-x-[16%]">
        Quick answers
      </h2>
      <div className="relative mx-auto mt-10 max-w-2xl md:ml-[10%]">
        {FAQ.map((f, i) => (
          <details
            key={f.q}
            className={`lch-panel group relative z-10 mb-3 px-6 py-5 open:border-[#f3c77a]/40 ${
              i % 2 === 0 ? "-rotate-[0.4deg] md:-ml-10 md:mr-6" : "rotate-[0.4deg] md:ml-10 md:-mr-4"
            }`}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14.5px] text-[#e9e6f2] marker:hidden [&::-webkit-details-marker]:hidden">
              {f.q}
              <span className="lch-glyph shrink-0 text-[13px] text-[#f3c77a] transition-transform group-open:rotate-45">✦</span>
            </summary>
            <p className="mt-3 text-[13px] leading-relaxed text-[#b7b1cc]">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative mt-6">
      {/* two rules disagree about where the footer starts */}
      <div className="pointer-events-none absolute -top-px left-0 h-px w-full bg-white/[0.07]" aria-hidden />
      <div
        className="pointer-events-none absolute -top-2 left-[-3vw] h-px w-[106vw] rotate-[0.5deg] bg-gradient-to-r from-transparent via-[#b794f6]/30 to-transparent"
        aria-hidden
      />
      <div className="flex flex-col gap-4 py-10 md:flex-row md:items-end md:justify-between">
        <div className="md:-rotate-[0.3deg]">
          <div className="flex items-center gap-2.5">
            <span className="lch-inset flex h-7 w-7 items-center justify-center text-[13px]" style={{ color: GOLD }}>
              辰
            </span>
            <span className="lch-serif text-[15px] tracking-[0.24em] text-[#e9e6f2]">CHINESE HOROSCOPE</span>
          </div>
          <p className="mt-2 text-[11.5px] text-[#b7b1cc]/70">Twelve animals, five elements, one turning wheel of years.</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-[#b7b1cc]/75 md:translate-y-2">
          <Link href="/tarot" className="transition-colors hover:text-[#f3c77a]">Tarot</Link>
          <Link href="/matrix" className="transition-colors hover:text-[#f3c77a]">Matrix</Link>
          <Link href="/horoscopes/chinese/rat" className="transition-colors hover:text-[#f3c77a]">Rat</Link>
          <Link href="/horoscopes/chinese/dragon" className="transition-colors hover:text-[#f3c77a]">Dragon</Link>
          <span className="text-[#b7b1cc]/50">© 2026 Astro Scope</span>
        </div>
      </div>
    </footer>
  );
}

/* ================================= PAGE =================================== */

export default function ChineseHubPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#0a0912] font-sans text-[#e9e6f2] antialiased selection:bg-[#f3c77a]/25">
      <style>{`
        .lch-serif { font-family: "Playfair Display", "Cormorant Garamond", Georgia, "Times New Roman", serif; }
        .lch-mono  { font-family: ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, monospace; }
        .lch-glyph { font-family: "Noto Sans Symbols", "Noto Sans Symbols 2", Symbola, "Segoe UI Symbol", serif; font-style: normal; }

        /* panels stay translucent so the machinery passes visibly BEHIND them */
        .lch-panel {
          background: linear-gradient(160deg, rgba(23,19,40,0.62), rgba(12,10,22,0.72));
          border: 1px solid rgba(233,230,242,0.10);
          backdrop-filter: blur(3px);
        }
        .lch-inset {
          background: rgba(243,199,122,0.06);
          border: 1px solid rgba(243,199,122,0.35);
        }
        .lch-chip {
          display: inline-block;
          border: 1px solid rgba(243,199,122,0.35);
          background: rgba(10,9,18,0.85);
          padding: 4px 10px;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #f3c77a;
        }
        .lch-gold-link {
          color: #f3c77a;
          text-decoration: none;
          background-image: linear-gradient(#f3c77a, #f3c77a);
          background-size: 0% 1px;
          background-repeat: no-repeat;
          background-position: 0 100%;
          transition: background-size 0.35s ease, color 0.2s ease;
        }
        .lch-gold-link:hover { color: #ffdd9c; background-size: 100% 1px; }

        /* instrument tabs — the cross-nav */
        .lch-tab {
          color: #b7b1cc;
          border-right: 1px solid rgba(233,230,242,0.07);
          transition: color 0.2s ease, background 0.2s ease;
        }
        .lch-tab:hover { color: #ffdd9c; background: rgba(243,199,122,0.06); }
        .lch-tab-on {
          color: #ffdd9c;
          background: linear-gradient(180deg, rgba(243,199,122,0.14), rgba(243,199,122,0.04));
          box-shadow: inset 0 -2px 0 #f3c77a;
        }

        /* engraved tool frame with corner brackets */
        .lch-frame {
          background: linear-gradient(160deg, rgba(23,19,40,0.78), rgba(12,10,22,0.85));
          border: 1px solid rgba(243,199,122,0.22);
          backdrop-filter: blur(4px);
          box-shadow: 0 0 60px rgba(162,90,223,0.10), 0 0 24px rgba(243,199,122,0.06);
        }
        .lch-corner { position: absolute; width: 14px; height: 14px; border: 0 solid #c9a227; }
        .lch-corner-tl { top: -1px; left: -1px; border-top-width: 1.5px; border-left-width: 1.5px; }
        .lch-corner-tr { top: -1px; right: -1px; border-top-width: 1.5px; border-right-width: 1.5px; }
        .lch-corner-bl { bottom: -1px; left: -1px; border-bottom-width: 1.5px; border-left-width: 1.5px; }
        .lch-corner-br { bottom: -1px; right: -1px; border-bottom-width: 1.5px; border-right-width: 1.5px; }
        .lch-panel-h-line {
          flex: 1 1 auto; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,162,39,0.45), transparent);
        }

        /* ---- magic background motion (all slow, all guarded below) ---- */
        @keyframes lch-drift   { 0%,100% { transform: translateY(-50%) rotate(0.6deg); } 50% { transform: translateY(-52%) rotate(0.2deg); } }
        @keyframes lch-twinkle { 0%,100% { opacity: 0.12; } 50% { opacity: 0.75; } }
        @keyframes lch-floatA  { 0%,100% { transform: translate(0,0) rotate(-2deg); } 50% { transform: translate(1.5vw,-2vh) rotate(1deg); } }
        @keyframes lch-floatB  { 0%,100% { transform: translate(0,0) rotate(3deg); } 50% { transform: translate(-1.5vw,2vh) rotate(-1deg); } }
        @keyframes lch-draw    { 0% { opacity: 0; transform: translateY(8px) rotate(-0.4deg); } 100% { opacity: 1; transform: translateY(0) rotate(0deg); } }
        @keyframes lch-shoot {
          0%    { opacity: 0; transform: translate3d(0,0,0) rotate(-26deg); }
          3%    { opacity: 0.9; }
          11%   { opacity: 0; transform: translate3d(-58vw, 30vh, 0) rotate(-26deg); }
          100%  { opacity: 0; transform: translate3d(-58vw, 30vh, 0) rotate(-26deg); }
        }

        .lch-hero-drift { animation: lch-drift 26s ease-in-out infinite; }
        .lch-twinkle    { animation: lch-twinkle 7s ease-in-out infinite; }
        .lch-float-a    { animation: lch-floatA 34s ease-in-out infinite; }
        .lch-float-b    { animation: lch-floatB 42s ease-in-out infinite; }
        .lch-nebula     { animation: lch-floatA 60s ease-in-out infinite; }
        .lch-draw       { animation: lch-draw 0.5s ease-out; }

        .lch-shoot {
          position: absolute;
          width: 190px; height: 1px;
          background: linear-gradient(90deg, rgba(255,221,156,0.9), rgba(255,221,156,0));
          opacity: 0;
          animation: lch-shoot 17s linear infinite;
          animation-delay: 4s;
        }
        .lch-shoot-b { animation-duration: 23s; animation-delay: 12s; width: 140px; }

        @media (prefers-reduced-motion: reduce) {
          .lch-hero-drift, .lch-twinkle, .lch-float-a, .lch-float-b, .lch-nebula,
          .lch-draw, .lch-shoot, .lch-shoot-b {
            animation: none !important;
          }
          .lch-shoot, .lch-shoot-b { display: none; }
        }
      `}</style>

      <Backdrop />

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 pb-6 sm:px-6">
        <Header />
        <HeroTool />
        <Twelve />
        <Understanding />
        <Faq />
        <Footer />
      </div>
    </main>
  );
}
