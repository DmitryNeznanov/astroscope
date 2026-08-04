// LAB / REMIX — the CURRENT PRODUCTION landing, kept faithful in palette,
// copy and content structure, then rebuilt with two treatments:
//   · BROKEN LAYOUT ("dirt") — structural, not cosmetic: the hero natal wheel
//     is a dominant composition element bleeding off the right edge with the
//     headline over its left arc; the 12 signs ride a shallow arc that
//     overlaps the hero's bottom rule; the Destiny Matrix panel overlaps band
//     and toolkit with its octagram hanging off the edge; the toolkit is an
//     asymmetric cascade of varied-width plates; widgets overlap each other
//     and the full-bleed CTA band; FAQ and footer are offset and staggered.
//   · MAGIC BACKGROUND — two huge faint zodiac wheels (top-right and
//     bottom-left, counter-rotating, half off-screen), hairline orbit circles
//     and construction lines, giant dim glyphs (☉ ☽ ♄, U+FE0E), constellation
//     polylines, star specks, occasional shooting stars. Panels are
//     translucent so the machinery visibly passes BEHIND them — layered
//     depth, not stacked boxes. CSS-only, guarded by prefers-reduced-motion.
// Self-contained: inline SVG + Tailwind + one scoped <style> block (lrx-
// prefixed). Server component: no hooks, statically prerendered.

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Astro Scope — Remix",
  description:
    "Free birth charts, daily horoscopes, tarot and compatibility — the production landing, remixed with a broken layout and a magic sky.",
};

const DEG = Math.PI / 180;

// production palette, lifted from the live stylesheets
const GOLD = "#f3c77a"; // --accent-primary
const GOLD_DEEP = "#c9a227"; // darker gold for hairlines
const CREAM = "#ffdd9c"; // --accent-tertiary
const VIOLET = "#a25adf"; // purple tint
const VIOLET_SOFT = "#b794f6";
const TEXT_HI = "#e9e6f2"; // --text-primary
const TEXT_LO = "#b7b1cc"; // --text-secondary

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

/* ================================ DATA ==================================== */

// glyphs carry U+FE0E so they render as text, never emoji
const FE = "︎";

const SIGNS: Array<[string, string, string]> = [
  ["♈" + FE, "Aries", "Mar 21 – Apr 19"],
  ["♉" + FE, "Taurus", "Apr 20 – May 20"],
  ["♊" + FE, "Gemini", "May 21 – Jun 20"],
  ["♋" + FE, "Cancer", "Jun 21 – Jul 22"],
  ["♌" + FE, "Leo", "Jul 23 – Aug 22"],
  ["♍" + FE, "Virgo", "Aug 23 – Sep 22"],
  ["♎" + FE, "Libra", "Sep 23 – Oct 22"],
  ["♏" + FE, "Scorpio", "Oct 23 – Nov 21"],
  ["♐" + FE, "Sagittarius", "Nov 22 – Dec 21"],
  ["♑" + FE, "Capricorn", "Dec 22 – Jan 19"],
  ["♒" + FE, "Aquarius", "Jan 20 – Feb 18"],
  ["♓" + FE, "Pisces", "Feb 19 – Mar 20"],
];

// the sign band's shallow arc: edges sag, center rides highest; rotation
// follows the tangent, z-index peaks mid-arc so tiles weave over each other
const SIGN_ARC = [
  "lg:translate-y-[34px] lg:rotate-[-3deg]",
  "lg:translate-y-[22px] lg:rotate-[-2.5deg]",
  "lg:translate-y-[13px] lg:rotate-[-1.9deg]",
  "lg:translate-y-[7px] lg:rotate-[-1.4deg]",
  "lg:translate-y-[2px] lg:rotate-[-0.8deg]",
  "lg:translate-y-0 lg:rotate-[-0.3deg]",
  "lg:translate-y-0 lg:rotate-[0.3deg]",
  "lg:translate-y-[2px] lg:rotate-[0.8deg]",
  "lg:translate-y-[7px] lg:rotate-[1.4deg]",
  "lg:translate-y-[13px] lg:rotate-[1.9deg]",
  "lg:translate-y-[22px] lg:rotate-[2.5deg]",
  "lg:translate-y-[34px] lg:rotate-[3deg]",
];
const SIGN_Z = [
  "lg:z-10",
  "lg:z-20",
  "lg:z-30",
  "lg:z-40",
  "lg:z-50",
  "lg:z-[60]",
  "lg:z-[60]",
  "lg:z-50",
  "lg:z-40",
  "lg:z-30",
  "lg:z-20",
  "lg:z-10",
];

const TOOLKIT = [
  {
    glyph: "☉" + FE,
    name: "Birth Chart",
    tag: "Free",
    copy: "Map your Sun, Moon, and Rising — the foundation of every reading.",
    href: "/birth-chart",
    // featured plate: widest, slightly counter-rotated, carries a mini wheel
    frame: "relative z-20 rotate-[-0.5deg] lg:w-[63%]",
    featured: true,
  },
  {
    glyph: "✦",
    name: "Daily Horoscope",
    tag: "Daily",
    copy: "Twelve signs, one sky. Clear forecasts without the fluff.",
    href: "/horoscope",
    frame: "relative z-30 rotate-[0.6deg] lg:mr-[2%] lg:-mt-12 lg:w-[46%] lg:self-end",
    featured: false,
  },
  {
    glyph: "♡",
    name: "Compatibility",
    tag: "Synastry",
    copy: "Zodiac match, Chinese pairs, and deep synastry for two charts.",
    href: "/compatibility",
    frame: "relative z-10 rotate-[-0.7deg] lg:ml-[7%] lg:-mt-8 lg:w-[41%]",
    featured: false,
  },
  {
    glyph: "🂠",
    name: "Tarot",
    tag: "Spreads",
    copy: "Daily card to Celtic Cross — pull, reflect, get a full reading.",
    href: "/tarot",
    frame: "relative z-20 rotate-[0.4deg] lg:-mt-10 lg:w-[54%] lg:self-end",
    featured: false,
  },
  {
    glyph: "◈",
    name: "Psychology",
    tag: "Tests",
    copy: "MBTI, Big Five, empathy and more — meet yourself beyond the signs.",
    href: "/psychology",
    frame: "relative z-30 rotate-[-0.4deg] lg:ml-[15%] lg:-mt-7 lg:w-[44%]",
    featured: false,
  },
  {
    glyph: "☽" + FE,
    name: "Cosmic Passport",
    tag: "You",
    copy: "Your Cosmic ID, people, journal, and Premium deep dives — one hub.",
    href: "/passport",
    frame: "relative z-20 rotate-[0.5deg] lg:-mt-12 lg:w-[52%] lg:self-center",
    featured: false,
  },
];

const FAQ = [
  {
    q: "What can I do on Astro Scope for free?",
    a: "Cast a free birth chart, read daily horoscopes for all twelve signs, pull tarot spreads, run compatibility tools, take psychology tests, and explore numerology — including an optional Destiny Matrix calculator.",
  },
  {
    q: "How do I get my free birth chart?",
    a: "Open the birth chart calculator, enter your birth date, time, and place, then generate your natal chart with Sun, Moon, Rising, and more.",
  },
  {
    q: "Where are daily horoscopes?",
    a: "Daily horoscopes are available for every zodiac sign from the homepage grid or the Horoscopes hub — clear forecasts without the fluff.",
  },
  {
    q: "What is the Destiny Matrix?",
    a: "An optional birth-date octagram tool on Astro Scope. It maps purpose, love, money, and age themes from your date of birth. Numbers are free; some deeper channel readings are Premium.",
  },
];

const FOOTER_GROUPS: Array<[string, string[]]> = [
  ["Horoscopes", ["Daily", "Tomorrow", "Weekly", "Monthly", "Yearly", "Love", "Career", "Health", "Money", "Chinese"]],
  ["Astrology", ["Basics", "Zodiac Signs", "Elements", "Lunar Calendar", "Planets", "Houses", "Birth Chart", "Advanced Charts", "Solar Return", "Composite Chart"]],
  ["Tarot", ["All Spreads", "Daily Card", "Yes/No Reading", "Past, Present & Future", "Love Reading", "Career Reading", "All Cards", "Birth Arcana", "Major Arcana"]],
  ["Psychology", ["Psychology Hub", "All Tests", "MBTI Test", "MBTI Compatibility", "Big Five", "PHQ-9", "GAD-7", "WHO-5"]],
  ["Numerology", ["Numerology Hub", "Life Path Calculator", "Destiny Matrix", "Matrix compatibility", "Angel Numbers", "Karmic Debt Calculator", "Life Path Numbers", "Master Numbers"]],
  ["Learn & Tools", ["Blog", "Birth Chart Reading", "Lunar Phases Planning", "Zodiac Compatibility", "Retrograde Planets", "Crystals & Astrology", "Transits & Forecasting"]],
  ["Account", ["Dashboard", "Cosmic Passport", "My People", "Journal", "Cosmic Portrait", "Yearly Forecast", "Pricing", "Profile settings"]],
  ["Legal", ["Privacy Policy", "Terms of Service", "Share Feedback"]],
];

// footer columns refuse to align on a shared baseline
const FOOTER_SHIFT = ["lg:mt-0", "lg:mt-7", "lg:mt-2", "lg:mt-10", "lg:mt-4", "lg:mt-8", "lg:mt-1", "lg:mt-5"];

// star field, generated once at module scope
const STARS = (() => {
  const rnd = mulberry32(20260204);
  return Array.from({ length: 110 }, (_, i) => ({
    x: +(rnd() * 1600).toFixed(0),
    y: +(rnd() * 1000).toFixed(0),
    r: +(0.5 + rnd() * 1.1).toFixed(2),
    o: +(0.14 + rnd() * 0.4).toFixed(2),
    tw: i % 5 === 0, // every fifth star twinkles
    d: +(rnd() * 8).toFixed(1), // twinkle delay
    key: i,
  }));
})();

/* ============================ BACKDROP PIECES ============================ */

// shared zodiac wheel artwork for the backdrop
function WheelSvg() {
  const C = 500;
  return (
    <svg viewBox="0 0 1000 1000" className="h-full w-full">
      <circle cx={C} cy={C} r={486} fill="none" stroke={GOLD} strokeWidth={1} />
      <circle cx={C} cy={C} r={430} fill="none" stroke={GOLD} strokeWidth={0.6} />
      <circle cx={C} cy={C} r={330} fill="none" stroke={VIOLET_SOFT} strokeWidth={0.6} />
      <circle cx={C} cy={C} r={150} fill="none" stroke={GOLD} strokeWidth={0.5} />
      {ringTicks(C, C, 430, 486, 120, 10).map((t) => (
        <line
          key={t.key}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={GOLD}
          strokeWidth={t.major ? 1.4 : 0.5}
        />
      ))}
      {SIGNS.map(([g], i) => {
        const p = onCircle(C, C, 458, i * 30 + 15);
        const a = onCircle(C, C, 330, i * 30);
        const b = onCircle(C, C, 486, i * 30);
        return (
          <g key={g}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={GOLD} strokeWidth={0.5} />
            <text
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={26}
              fill={CREAM}
              className="lrx-glyph"
            >
              {g}
            </text>
          </g>
        );
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const p = onCircle(C, C, 330, i * 30 + 15);
        return <line key={i} x1={C} y1={C} x2={p.x} y2={p.y} stroke={VIOLET_SOFT} strokeWidth={0.35} />;
      })}
      {[0, 90, 45, 135, 60, 150].map((a, i) => {
        const p1 = onCircle(C, C, 150, a);
        const p2 = onCircle(C, C, 150, a + 120);
        return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={GOLD} strokeWidth={0.45} />;
      })}
    </svg>
  );
}

// two huge wheels hang half off-screen and counter-rotate behind everything;
// translucent panels let them show through as the page scrolls past
function BackdropWheels() {
  return (
    <>
      <div
        aria-hidden
        className="lrx-wheel-spin pointer-events-none fixed -top-[42vmin] -right-[48vmin] z-0 h-[155vmin] w-[155vmin] opacity-[0.07]"
      >
        <WheelSvg />
      </div>
      <div
        aria-hidden
        className="lrx-wheel-spin-rev pointer-events-none fixed -bottom-[46vmin] -left-[44vmin] z-0 h-[135vmin] w-[135vmin] opacity-[0.055]"
      >
        <WheelSvg />
      </div>
    </>
  );
}

// fixed layer behind everything: stars, orbits, construction lines, constellations
function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* nebula washes */}
      <div className="lrx-nebula absolute -left-[20vw] top-[8vh] h-[70vmin] w-[70vmin] bg-[radial-gradient(circle,rgba(162,90,223,0.11),transparent_65%)]" />
      <div className="lrx-nebula absolute right-[-12vw] top-[52vh] h-[80vmin] w-[80vmin] bg-[radial-gradient(circle,rgba(243,199,122,0.08),transparent_65%)]" />
      <div className="lrx-nebula absolute left-[24vw] bottom-[-18vh] h-[60vmin] w-[60vmin] bg-[radial-gradient(circle,rgba(183,148,246,0.07),transparent_65%)]" />

      <svg
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        {/* star specks */}
        {STARS.map((s) =>
          s.tw ? (
            <circle
              key={s.key}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill={CREAM}
              className="lrx-twinkle"
              style={{ animationDelay: `${s.d}s`, opacity: s.o }}
            />
          ) : (
            <circle key={s.key} cx={s.x} cy={s.y} r={s.r} fill={TEXT_LO} opacity={s.o} />
          ),
        )}

        {/* hairline orbit circles, centers pushed off-canvas */}
        <circle cx={1730} cy={240} r={520} fill="none" stroke={GOLD_DEEP} strokeWidth={0.5} opacity={0.4} />
        <circle cx={1730} cy={240} r={700} fill="none" stroke={GOLD_DEEP} strokeWidth={0.4} opacity={0.26} strokeDasharray="2 7" />
        <circle cx={-160} cy={880} r={420} fill="none" stroke={VIOLET} strokeWidth={0.5} opacity={0.34} />
        <circle cx={-160} cy={880} r={560} fill="none" stroke={VIOLET} strokeWidth={0.4} opacity={0.2} strokeDasharray="2 8" />
        <circle cx={820} cy={1180} r={640} fill="none" stroke={GOLD_DEEP} strokeWidth={0.4} opacity={0.2} />

        {/* construction lines crossing the whole page */}
        <line x1={-80} y1={180} x2={1700} y2={760} stroke={TEXT_LO} strokeWidth={0.4} opacity={0.18} />
        <line x1={-80} y1={940} x2={1680} y2={120} stroke={TEXT_LO} strokeWidth={0.4} opacity={0.13} />
        <line x1={1240} y1={-60} x2={1240} y2={1060} stroke={GOLD_DEEP} strokeWidth={0.4} opacity={0.18} strokeDasharray="1 6" />
        <line x1={-60} y1={620} x2={1660} y2={620} stroke={GOLD_DEEP} strokeWidth={0.4} opacity={0.13} strokeDasharray="1 6" />
        {[160, 380, 620, 860].map((y) => (
          <line key={y} x1={1232} y1={y} x2={1248} y2={y} stroke={GOLD} strokeWidth={0.7} opacity={0.4} />
        ))}

        {/* constellation: Lyra-ish */}
        <g opacity={0.55}>
          <polyline
            points="180,160 258,208 344,182 402,252 318,286 236,258"
            fill="none"
            stroke={VIOLET_SOFT}
            strokeWidth={0.6}
            opacity={0.5}
          />
          {[
            [180, 160],
            [258, 208],
            [344, 182],
            [402, 252],
            [318, 286],
            [236, 258],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={1.7} fill={TEXT_HI} opacity={0.8} />
          ))}
        </g>
        {/* constellation: Cygnus-ish, lower right */}
        <g opacity={0.5}>
          <polyline
            points="1150,760 1228,700 1306,748 1352,684 1430,712"
            fill="none"
            stroke={GOLD}
            strokeWidth={0.6}
            opacity={0.45}
          />
          <line x1="1228" y1="700" x2="1268" y2="806" stroke={GOLD} strokeWidth={0.6} opacity={0.45} />
          {[
            [1150, 760],
            [1228, 700],
            [1306, 748],
            [1352, 684],
            [1430, 712],
            [1268, 806],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={1.7} fill={CREAM} opacity={0.75} />
          ))}
        </g>
      </svg>

      {/* giant dim glyphs drifting behind sections */}
      <span className="lrx-glyph lrx-float-a absolute left-[3vw] top-[86vh] text-[26vmin] leading-none text-[#b794f6] opacity-[0.055]">
        ☽{FE}
      </span>
      <span className="lrx-glyph lrx-float-b absolute right-[6vw] top-[188vh] text-[30vmin] leading-none text-[#f3c77a] opacity-[0.05]">
        ♄{FE}
      </span>
      <span className="lrx-glyph lrx-float-a absolute left-[38vw] top-[318vh] text-[24vmin] leading-none text-[#e9e6f2] opacity-[0.04]">
        ☉{FE}
      </span>

      {/* occasional shooting stars */}
      <span className="lrx-shoot" style={{ top: "14vh", right: "-12vw" }} />
      <span className="lrx-shoot lrx-shoot-b" style={{ top: "46vh", right: "-18vw" }} />
    </div>
  );
}

/* ============================ HERO APPARATUS ============================ */

// detailed natal wheel — the hero's dominant mass, bleeding off the right edge
function HeroWheel() {
  const C = 400;
  const planets: Array<[string, number, number]> = [
    ["☉" + FE, 24, 205],
    ["☽" + FE, 96, 205],
    ["☿" + FE, 141, 205],
    ["♀" + FE, 188, 205],
    ["♂" + FE, 233, 205],
    ["♃" + FE, 296, 205],
    ["♄" + FE, 331, 205],
  ];
  return (
    <svg viewBox="0 0 800 800" className="h-full w-full drop-shadow-[0_0_80px_rgba(162,90,223,0.3)]">
      <defs>
        <radialGradient id="lrx-hg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={VIOLET} stopOpacity={0.18} />
          <stop offset="55%" stopColor={VIOLET} stopOpacity={0.06} />
          <stop offset="100%" stopColor={VIOLET} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={C} cy={C} r={392} fill="url(#lrx-hg)" />
      <circle cx={C} cy={C} r={330} fill="none" stroke={GOLD} strokeWidth={1.1} opacity={0.9} />
      <circle cx={C} cy={C} r={286} fill="none" stroke={GOLD} strokeWidth={0.5} opacity={0.6} />
      <circle cx={C} cy={C} r={212} fill="none" stroke={VIOLET_SOFT} strokeWidth={0.6} opacity={0.55} />
      <circle cx={C} cy={C} r={104} fill="none" stroke={GOLD} strokeWidth={0.5} opacity={0.55} />
      {ringTicks(C, C, 286, 330, 144, 12).map((t) => (
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
      {SIGNS.map(([g], i) => {
        const p = onCircle(C, C, 308, i * 30 + 15);
        const a = onCircle(C, C, 286, i * 30);
        const b = onCircle(C, C, 330, i * 30);
        return (
          <g key={g}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={GOLD} strokeWidth={0.5} opacity={0.6} />
            <text
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={19}
              fill={CREAM}
              opacity={0.95}
              className="lrx-glyph"
            >
              {g}
            </text>
          </g>
        );
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const p = onCircle(C, C, 212, i * 30);
        return <line key={i} x1={C} y1={C} x2={p.x} y2={p.y} stroke={VIOLET_SOFT} strokeWidth={0.35} opacity={0.5} />;
      })}
      {[10, 130, 250, 70, 190, 310].map((a, i) => {
        const p1 = onCircle(C, C, 104, a);
        const p2 = onCircle(C, C, 104, a + (i % 2 === 0 ? 120 : 90));
        return (
          <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={i % 2 === 0 ? GOLD : VIOLET_SOFT} strokeWidth={0.55} opacity={0.65} />
        );
      })}
      {planets.map(([g, deg, r]) => {
        const p = onCircle(C, C, r, deg);
        return (
          <text
            key={g}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={17}
            fill={TEXT_HI}
            opacity={0.95}
            className="lrx-glyph"
          >
            {g}
          </text>
        );
      })}
    </svg>
  );
}

/* ================================ SECTIONS ================================ */

function Nav() {
  return (
    <header className="relative border-b border-white/[0.07]">
      <nav className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="lrx-glyph grid h-8 w-8 place-items-center border border-[#f3c77a]/40 bg-[#f3c77a]/[0.07] text-[15px] text-[#f3c77a]">
            ☀{FE}
          </span>
          <span className="lrx-serif text-[19px] tracking-wide text-[#e9e6f2]">Astro Scope</span>
        </Link>
        <div className="ml-4 hidden items-center gap-5 text-[13px] text-[#b7b1cc] md:flex">
          {["Horoscopes", "Astrology", "Tarot", "Psychology", "More"].map((l) => (
            <Link key={l} href="/" className="transition-colors hover:text-[#f3c77a]">
              {l}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden items-center gap-2 border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[11px] text-[#b7b1cc] sm:flex">
            Search <span className="border border-white/15 px-1 text-[9px] text-[#e9e6f2]/70">⌘K</span>
          </span>
          <Link href="/" className="text-[13px] text-[#b7b1cc] transition-colors hover:text-[#e9e6f2]">
            Sign in
          </Link>
          <Link
            href="/"
            className="border border-[#f3c77a]/50 bg-[#f3c77a]/10 px-3.5 py-1.5 text-[13px] text-[#ffdd9c] transition-colors hover:bg-[#f3c77a]/20"
          >
            Sign up
          </Link>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    // near-viewport-tall stage; the wheel is the composition, text plays over it
    <section className="relative flex min-h-[86vh] items-center overflow-visible md:min-h-[92vh]">
      {/* dominant wheel: anchored past mid-viewport, bleeding off the right edge */}
      <div
        className="lrx-hero-drift pointer-events-none absolute top-1/2 left-[42%] hidden aspect-square w-[80vw] max-w-[1020px] -translate-y-1/2 rotate-[0.6deg] md:block"
        aria-hidden
      >
        <HeroWheel />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-40 pt-16 md:px-8 md:pb-48">
        {/* text block sits over the wheel's left arc; scrim keeps it readable */}
        <div className="relative max-w-2xl">
          <div
            className="pointer-events-none absolute -inset-10 -z-10 bg-[radial-gradient(closest-side,rgba(10,9,18,0.95),rgba(10,9,18,0.65)_55%,transparent_80%)] md:-inset-16"
            aria-hidden
          />
          <p className="lrx-chip -rotate-[0.5deg]">Read the sky · free tools · daily guidance</p>

          <h1 className="lrx-serif mt-7 text-[clamp(38px,6vw,68px)] leading-[1.04] tracking-tight text-[#e9e6f2]">
            The universe gives you signs.{" "}
            <span className="text-[#f3c77a]">The path is yours to choose.</span>
          </h1>

          <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-[#b7b1cc]">
            Free birth charts, daily horoscopes, tarot and compatibility — read the sky with tools
            built for clarity, not clutter.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/birth-chart"
              className="rotate-[-0.4deg] border border-[#f3c77a] bg-[#f3c77a] px-6 py-3 text-[14px] font-medium text-[#0a0912] transition-transform hover:-translate-y-0.5"
            >
              ✦ Cast your free birth chart
            </Link>
            <Link href="/horoscope" className="lrx-gold-link rotate-[0.5deg] text-[14px]">
              Read today&rsquo;s horoscope →
            </Link>
          </div>
        </div>

        <p className="absolute bottom-24 left-5 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#b7b1cc]/60 md:left-8 md:translate-x-6">
          <span className="lrx-bob inline-block">⌄</span> Scroll to explore
        </p>
      </div>

      {/* hero's bottom rule — the sign band rides straight over it */}
      <div
        className="pointer-events-none absolute bottom-16 left-[-4vw] h-px w-[108vw] -rotate-[0.35deg] bg-gradient-to-r from-transparent via-[#f3c77a]/30 to-transparent"
        aria-hidden
      />
    </section>
  );
}

function SignBand() {
  return (
    // pulled up over the hero's bottom rule; the matrix panel below pulls back over it
    <section className="relative z-20 -mt-28 md:-mt-36">
      <div className="mx-auto max-w-7xl px-3 md:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 px-2 md:px-4">
          <h2 className="lrx-serif max-w-md -rotate-[0.3deg] text-[clamp(26px,3.4vw,40px)] leading-tight text-[#e9e6f2]">
            Read your daily horoscope
          </h2>
          <Link href="/horoscope" className="lrx-gold-link translate-y-1 text-[13px]">
            All signs →
          </Link>
        </div>

        {/* shallow arc: tiles sag toward the edges, overlap sideways, weave in z */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:items-start lg:gap-0">
          {SIGNS.map(([glyph, name, dates], i) => (
            <Link
              key={name}
              href={`/horoscope/${name.toLowerCase()}`}
              className={`lrx-panel group relative px-4 py-5 transition-colors hover:border-[#f3c77a]/45 lg:flex-1 lg:px-3 ${
                i > 0 ? "lg:-ml-3" : ""
              } ${SIGN_ARC[i]} ${SIGN_Z[i]}`}
            >
              <span className="lrx-glyph block text-[26px] leading-none text-[#f3c77a] transition-transform group-hover:scale-110">
                {glyph}
              </span>
              <span className="lrx-serif mt-3 block text-[16px] text-[#e9e6f2]">{name}</span>
              <span className="mt-1 block text-[11px] tracking-wide text-[#b7b1cc]">{dates}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function MatrixPromo() {
  // octagram: two overlaid squares
  const sq = (rot: number) =>
    [0, 90, 180, 270]
      .map((a) => onCircle(100, 100, 78, a + rot))
      .map((p) => `${p.x},${p.y}`)
      .join(" ");
  return (
    // wide panel pulled UP over the sign band's sagging edges and left hanging
    // DOWN over the toolkit below; rotated against both
    <section className="relative z-30 -mt-10 md:-mt-14">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="lrx-panel relative -rotate-[0.6deg] px-6 py-12 md:-ml-8 md:px-14 md:py-14 lg:w-[calc(100%+4rem)]">
          {/* chip straddling the top border */}
          <span className="lrx-chip absolute -top-3 left-8 rotate-[0.6deg] !border-[#a25adf]/50 !text-[#b794f6]">
            New · try it
          </span>

          <div className="max-w-xl">
            <h2 className="lrx-serif text-[clamp(24px,3vw,34px)] text-[#e9e6f2]">Destiny Matrix</h2>
            <p className="mt-3 text-[14.5px] leading-relaxed text-[#b7b1cc]">
              A birth-date octagram for purpose, love, money, and the age ring. Free numbers —
              worth a look next to your chart.
            </p>
            <Link href="/numerology/destiny-matrix" className="lrx-gold-link mt-4 inline-block text-[13.5px]">
              Open Destiny Matrix →
            </Link>
          </div>

          {/* octagram hanging half off the panel's right edge */}
          <svg
            viewBox="0 0 200 200"
            className="lrx-wheel-spin-slow pointer-events-none absolute -right-14 top-1/2 hidden h-48 w-48 -translate-y-1/2 md:block lg:-right-20 lg:h-60 lg:w-60"
            aria-hidden
          >
            <polygon points={sq(0)} fill="none" stroke={GOLD} strokeWidth={1} opacity={0.85} />
            <polygon points={sq(45)} fill="none" stroke={VIOLET_SOFT} strokeWidth={1} opacity={0.75} />
            <circle cx={100} cy={100} r={78} fill="none" stroke={GOLD_DEEP} strokeWidth={0.5} opacity={0.6} />
            <circle cx={100} cy={100} r={7} fill="none" stroke={CREAM} strokeWidth={0.8} opacity={0.9} />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
              const p = onCircle(100, 100, 78, a);
              return <circle key={a} cx={p.x} cy={p.y} r={2} fill={CREAM} opacity={0.9} />;
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}

function Toolkit() {
  return (
    // pulled up under the matrix panel's overhang
    <section className="relative z-20 -mt-8 pt-24 pb-20 md:-mt-10 md:pt-32 md:pb-28">
      {/* hairline rule slashing diagonally through the whole cascade */}
      <div
        className="pointer-events-none absolute left-[-4vw] top-[34%] h-px w-[108vw] -rotate-[1.4deg] bg-gradient-to-r from-transparent via-[#b794f6]/25 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-[-4vw] top-[72%] h-px w-[108vw] rotate-[0.8deg] bg-gradient-to-r from-transparent via-[#f3c77a]/20 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        <p className="lrx-caps rotate-[-0.4deg] text-[11px] text-[#b7b1cc]/70">Your cosmic toolkit</p>
        <h2 className="lrx-serif mt-3 max-w-2xl text-[clamp(28px,3.8vw,44px)] leading-tight text-[#e9e6f2] md:translate-x-10">
          Everything the stars have to offer
        </h2>

        {/* asymmetric cascade: varied widths, alternating alignment, overlaps */}
        <div className="mt-14 flex flex-col gap-5 md:mt-20 lg:gap-0">
          {TOOLKIT.map((t) => (
            <div
              key={t.name}
              className={`lrx-panel group px-6 py-7 transition-colors hover:border-[#f3c77a]/45 ${t.frame} ${
                t.featured ? "md:px-10 md:py-10" : ""
              }`}
            >
              {/* tag chip straddling the card's top border */}
              <span className="lrx-chip absolute -top-2.5 right-5 !px-2 !py-0.5 !text-[9px]">{t.tag}</span>

              {t.featured ? (
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
                  <div>
                    <span className="lrx-glyph grid h-14 w-14 place-items-center border border-white/12 bg-white/[0.04] text-[26px] text-[#f3c77a] transition-colors group-hover:border-[#f3c77a]/50 group-hover:bg-[#f3c77a]/10">
                      {t.glyph}
                    </span>
                    <h3 className="lrx-serif mt-5 text-[26px] text-[#e9e6f2] md:text-[30px]">{t.name}</h3>
                    <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-[#b7b1cc]">{t.copy}</p>
                    <Link href={t.href} className="lrx-gold-link mt-4 inline-block text-[13.5px]">
                      Explore →
                    </Link>
                  </div>
                  {/* mini wheel hanging half off the featured plate's edge */}
                  <div className="pointer-events-none relative ml-auto hidden h-40 w-40 shrink-0 md:-mr-16 md:block md:h-48 md:w-48 lg:-mr-20" aria-hidden>
                    <HeroWheel />
                  </div>
                </div>
              ) : (
                <>
                  <span className="lrx-glyph grid h-11 w-11 place-items-center border border-white/12 bg-white/[0.04] text-[20px] text-[#f3c77a] transition-colors group-hover:border-[#f3c77a]/50 group-hover:bg-[#f3c77a]/10">
                    {t.glyph}
                  </span>
                  <h3 className="lrx-serif mt-5 text-[20px] text-[#e9e6f2]">{t.name}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-[#b7b1cc]">{t.copy}</p>
                  <Link href={t.href} className="lrx-gold-link mt-4 inline-block text-[13px]">
                    Explore →
                  </Link>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cta() {
  return (
    // full-bleed translucent band — the backdrop wheels and lines show through
    <section className="relative left-1/2 z-10 w-screen -translate-x-1/2 border-y border-[#f3c77a]/15 bg-[#151126]/50 py-20 backdrop-blur-[3px] md:py-28">
      {/* rules crossing the band at their own angles */}
      <div className="pointer-events-none absolute inset-x-[-2vw] top-5 h-px rotate-[0.3deg] bg-gradient-to-r from-transparent via-[#a25adf]/35 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-x-[-2vw] bottom-5 h-px -rotate-[0.25deg] bg-gradient-to-r from-transparent via-[#f3c77a]/30 to-transparent" aria-hidden />

      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="md:ml-[8%] md:max-w-2xl">
          <span className="lrx-glyph text-[22px] text-[#f3c77a]" aria-hidden>
            ✧
          </span>
          <h2 className="lrx-serif mt-4 rotate-[-0.3deg] text-[clamp(28px,4vw,48px)] leading-tight text-[#e9e6f2]">
            Your chart is written in the stars. <span className="text-[#f3c77a]">Come read it.</span>
          </h2>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/"
              className="rotate-[0.4deg] border border-[#f3c77a] bg-[#f3c77a] px-6 py-3 text-[14px] font-medium text-[#0a0912] transition-transform hover:-translate-y-0.5"
            >
              Get started — it&rsquo;s free
            </Link>
            <Link href="/dashboard" className="lrx-gold-link -rotate-[0.4deg] text-[13.5px]">
              Open dashboard →
            </Link>
            <Link
              href="/pricing"
              className="text-[13.5px] text-[#b7b1cc] underline decoration-[#b7b1cc]/40 underline-offset-4 transition-colors hover:text-[#e9e6f2]"
            >
              See Premium
            </Link>
          </div>

          <div className="mt-12 flex max-w-xl flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-[#b7b1cc]/80">
            <Link href="/astrology/retrogrades" className="transition-colors hover:text-[#f3c77a]">℞{FE} Retrogrades</Link>
            <Link href="/astrology/lunar-calendar" className="transition-colors hover:text-[#f3c77a]">●{FE} Full Moons</Link>
            <Link href="/numerology" className="transition-colors hover:text-[#f3c77a]">11 Numerology</Link>
            <Link href="/blog" className="transition-colors hover:text-[#f3c77a]">✎{FE} Blog</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Widgets() {
  return (
    // pulled UP over the CTA band's bottom edge; cards overlap each other too
    <section className="relative z-20 -mt-14 pb-16 md:-mt-20 md:pb-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid gap-5 md:grid-cols-3 md:gap-0">
          {/* Moon today — wide, rotated against its neighbours */}
          <div className="lrx-panel relative z-10 -rotate-[0.7deg] px-6 py-6 md:translate-y-8">
            <span className="lrx-chip absolute -top-3 left-5">Moon today</span>
            <div className="mt-2 flex items-start gap-4">
              {/* waxing gibbous, 70% */}
              <svg viewBox="0 0 48 48" className="mt-1 h-12 w-12 shrink-0" aria-hidden>
                <circle cx={24} cy={24} r={20} fill="none" stroke={GOLD} strokeWidth={0.8} opacity={0.7} />
                <path d="M 24 4 A 20 20 0 0 1 24 44 A 28 20 0 0 0 24 4 Z" fill={CREAM} opacity={0.85} />
              </svg>
              <p className="text-[12.5px] leading-relaxed text-[#b7b1cc]">
                The moon is a bright waxing gibbous, its generous glow spreading warmth and
                confidence. As it climbs toward fullness, it invites you to nurture the seeds
                you&rsquo;ve already planted. <span className="text-[#f3c77a]">· 70%</span>
              </p>
            </div>
          </div>

          {/* Sign of the day — rides highest, overlapping both neighbours */}
          <div className="lrx-panel relative z-30 rotate-[0.6deg] px-6 py-6 md:-ml-8 md:-translate-y-2">
            <span className="lrx-chip absolute -top-3 left-5">Sign of the day</span>
            <div className="mt-2 flex items-center gap-4">
              <span className="lrx-glyph text-[34px] leading-none text-[#f3c77a]">♒{FE}</span>
              <div>
                <p className="lrx-serif text-[18px] text-[#e9e6f2]">Aquarius</p>
                <p className="mt-1 text-[12px] text-[#b7b1cc]">
                  <span className="text-[#f3c77a]">88%</span> energy
                </p>
                <div className="mt-2 h-px w-28 bg-white/10">
                  <div className="h-px w-[88%] bg-[#f3c77a]" />
                </div>
              </div>
            </div>
          </div>

          {/* Card of the day — lowest, tucked under the sign card */}
          <div className="lrx-panel relative z-20 -rotate-[0.5deg] px-6 py-6 md:-ml-7 md:translate-y-12">
            <span className="lrx-chip absolute -top-3 left-5">Card of the day</span>
            <div className="mt-2 flex items-center gap-4">
              <svg viewBox="0 0 40 64" className="h-14 w-9 shrink-0" aria-hidden>
                <rect x={1} y={1} width={38} height={62} fill="none" stroke={VIOLET_SOFT} strokeWidth={1} opacity={0.8} />
                <rect x={5} y={5} width={30} height={54} fill="none" stroke={VIOLET_SOFT} strokeWidth={0.5} opacity={0.5} />
                <text x={20} y={36} textAnchor="middle" fontSize={16} fill={GOLD} className="lrx-glyph">✦</text>
              </svg>
              <div>
                <Link href="/tarot/daily-card" className="lrx-gold-link text-[13.5px]">
                  Draw your daily tarot card
                </Link>
                <p className="mt-1.5 text-[11.5px] text-[#b7b1cc]/80">One pull, one reflection.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  const link = "text-[#f3c77a] underline decoration-[#f3c77a]/35 underline-offset-4 transition-colors hover:decoration-[#f3c77a]";
  return (
    // extra top room so the lowest widget doesn't crowd the paragraph
    <section className="relative py-14 md:pt-20 md:pb-20">
      <div className="mx-auto max-w-2xl px-5 md:px-8">
        <h2 className="lrx-serif -ml-1 rotate-[-0.3deg] text-[clamp(20px,2.4vw,26px)] text-[#e9e6f2] md:-ml-10">
          Your cosmic toolkit on Astro Scope
        </h2>
        <p className="mt-4 text-[14px] leading-[1.9] text-[#b7b1cc]">
          Start with a <Link href="/birth-chart" className={link}>free birth chart</Link>, read{" "}
          <Link href="/horoscope" className={link}>daily horoscopes</Link>, explore{" "}
          <Link href="/compatibility" className={link}>compatibility</Link>,{" "}
          <Link href="/tarot" className={link}>tarot</Link>, and psychology tests. Prefer numbers?
          Try <Link href="/numerology" className={link}>numerology</Link> or the optional{" "}
          <Link href="/numerology/destiny-matrix" className={link}>Destiny Matrix</Link>.
        </p>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="relative py-16 md:py-24">
      {/* vertical hairline breaking through the FAQ column */}
      <div
        className="pointer-events-none absolute left-[7%] top-[-2rem] hidden h-[calc(100%+4rem)] w-px rotate-[0.4deg] bg-gradient-to-b from-transparent via-[#f3c77a]/25 to-transparent md:block"
        aria-hidden
      />
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <h2 className="lrx-serif rotate-[0.3deg] text-[clamp(24px,3vw,36px)] text-[#e9e6f2] md:translate-x-[16%]">
          Frequently asked questions
        </h2>
        <div className="relative mx-auto mt-12 max-w-2xl md:ml-[10%]">
          {FAQ.map((f, i) => (
            <details
              key={f.q}
              className={`lrx-panel group relative z-10 mb-3 px-6 py-5 open:border-[#f3c77a]/40 ${
                i % 2 === 0
                  ? "-rotate-[0.4deg] md:-ml-10 md:mr-6"
                  : "rotate-[0.4deg] md:ml-10 md:-mr-4"
              }`}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] text-[#e9e6f2] marker:hidden [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="lrx-glyph shrink-0 text-[13px] text-[#f3c77a] transition-transform group-open:rotate-45">
                  ✦
                </span>
              </summary>
              <p className="mt-3 text-[13.5px] leading-relaxed text-[#b7b1cc]">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative mt-10">
      {/* two rules disagree about where the footer starts */}
      <div className="pointer-events-none absolute -top-px left-0 h-px w-full bg-white/[0.07]" aria-hidden />
      <div
        className="pointer-events-none absolute -top-2 left-[-3vw] h-px w-[106vw] rotate-[0.5deg] bg-gradient-to-r from-transparent via-[#b794f6]/30 to-transparent"
        aria-hidden
      />

      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {FOOTER_GROUPS.map(([group, items], gi) => (
            <div key={group} className={FOOTER_SHIFT[gi]}>
              <p className="lrx-caps text-[10px] text-[#f3c77a]/80">{group}</p>
              <ul className="mt-3 space-y-1.5">
                {items.map((it) => (
                  <li key={it}>
                    <Link href="/" className="text-[12.5px] text-[#b7b1cc]/85 transition-colors hover:text-[#e9e6f2]">
                      {it}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/[0.06] pt-8 md:flex-row md:items-end md:justify-between">
          <div className="md:-rotate-[0.3deg]">
            <div className="flex items-center gap-2.5">
              <span className="lrx-glyph grid h-7 w-7 place-items-center border border-[#f3c77a]/40 bg-[#f3c77a]/[0.07] text-[13px] text-[#f3c77a]">
                ☾{FE}
              </span>
              <span className="lrx-serif text-[17px] text-[#e9e6f2]">Astro Scope</span>
            </div>
            <p className="mt-2 text-[12px] text-[#b7b1cc]/75">
              Your daily cosmic guidance and astrological insights
            </p>
          </div>
          <p className="text-[11.5px] text-[#b7b1cc]/60 md:translate-y-2">
            Made with <span className="text-[#f3c77a]">♡</span> for cosmic explorers · © 2026 Astro
            Scope. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ================================= PAGE =================================== */

export default function RemixPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#0a0912] font-sans text-[#e9e6f2] antialiased selection:bg-[#f3c77a]/25">
      <style>{`
        .lrx-serif { font-family: "Playfair Display", "Cormorant Garamond", Georgia, "Times New Roman", serif; }
        .lrx-glyph { font-family: "Noto Sans Symbols", "Noto Sans Symbols 2", Symbola, "Segoe UI Symbol", serif; font-style: normal; }
        .lrx-caps { text-transform: uppercase; letter-spacing: 0.24em; }

        /* panels stay translucent so the wheels/lines pass visibly BEHIND them */
        .lrx-panel {
          background: linear-gradient(160deg, rgba(23,19,40,0.62), rgba(12,10,22,0.72));
          border: 1px solid rgba(233,230,242,0.10);
          backdrop-filter: blur(3px);
        }
        .lrx-chip {
          display: inline-block;
          border: 1px solid rgba(243,199,122,0.35);
          background: rgba(10,9,18,0.85);
          padding: 4px 10px;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #f3c77a;
        }
        .lrx-gold-link {
          color: #f3c77a;
          text-decoration: none;
          background-image: linear-gradient(#f3c77a, #f3c77a);
          background-size: 0% 1px;
          background-repeat: no-repeat;
          background-position: 0 100%;
          transition: background-size 0.35s ease, color 0.2s ease;
        }
        .lrx-gold-link:hover { color: #ffdd9c; background-size: 100% 1px; }

        /* ---- magic background motion (all slow, all guarded below) ---- */
        @keyframes lrx-spin    { to { transform: rotate(360deg); } }
        @keyframes lrx-spin-rev{ to { transform: rotate(-360deg); } }
        @keyframes lrx-drift   { 0%,100% { transform: translateY(-50%) rotate(0.6deg); } 50% { transform: translateY(-52%) rotate(0.2deg); } }
        @keyframes lrx-twinkle { 0%,100% { opacity: 0.12; } 50% { opacity: 0.75; } }
        @keyframes lrx-floatA  { 0%,100% { transform: translate(0,0) rotate(-2deg); } 50% { transform: translate(1.5vw,-2vh) rotate(1deg); } }
        @keyframes lrx-floatB  { 0%,100% { transform: translate(0,0) rotate(3deg); } 50% { transform: translate(-1.5vw,2vh) rotate(-1deg); } }
        @keyframes lrx-bob     { 0%,100% { transform: translateY(0); } 50% { transform: translateY(4px); } }
        @keyframes lrx-shoot {
          0%    { opacity: 0; transform: translate3d(0,0,0) rotate(-26deg); }
          3%    { opacity: 0.9; }
          11%   { opacity: 0; transform: translate3d(-58vw, 30vh, 0) rotate(-26deg); }
          100%  { opacity: 0; transform: translate3d(-58vw, 30vh, 0) rotate(-26deg); }
        }

        .lrx-wheel-spin      { animation: lrx-spin 260s linear infinite; }
        .lrx-wheel-spin-rev  { animation: lrx-spin-rev 320s linear infinite; }
        .lrx-wheel-spin-slow { animation: lrx-spin 140s linear infinite; transform-origin: 50% 50%; }
        .lrx-hero-drift      { animation: lrx-drift 26s ease-in-out infinite; }
        .lrx-twinkle         { animation: lrx-twinkle 7s ease-in-out infinite; }
        .lrx-float-a         { animation: lrx-floatA 34s ease-in-out infinite; }
        .lrx-float-b         { animation: lrx-floatB 42s ease-in-out infinite; }
        .lrx-bob             { animation: lrx-bob 3.2s ease-in-out infinite; }
        .lrx-nebula          { animation: lrx-floatA 60s ease-in-out infinite; }

        .lrx-shoot {
          position: absolute;
          width: 190px; height: 1px;
          background: linear-gradient(90deg, rgba(255,221,156,0.9), rgba(255,221,156,0));
          opacity: 0;
          animation: lrx-shoot 17s linear infinite;
          animation-delay: 4s;
        }
        .lrx-shoot-b { animation-duration: 23s; animation-delay: 12s; width: 140px; }

        @media (prefers-reduced-motion: reduce) {
          .lrx-wheel-spin, .lrx-wheel-spin-rev, .lrx-wheel-spin-slow, .lrx-hero-drift,
          .lrx-twinkle, .lrx-float-a, .lrx-float-b, .lrx-bob, .lrx-nebula,
          .lrx-shoot, .lrx-shoot-b {
            animation: none !important;
          }
          .lrx-shoot, .lrx-shoot-b { display: none; }
        }
      `}</style>

      <BackdropWheels />
      <Backdrop />

      <div className="relative z-10">
        <Nav />
        <Hero />
        <SignBand />
        <MatrixPromo />
        <Toolkit />
        <Cta />
        <Widgets />
        <About />
        <Faq />
        <Footer />
      </div>
    </main>
  );
}
