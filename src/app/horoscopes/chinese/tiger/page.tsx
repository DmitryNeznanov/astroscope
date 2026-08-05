"use client";

// HOROSCOPES / CHINESE / TIGER — the Tiger sign page. Tool-page structure:
// compact header + cross-nav tabs, the period instrument at the top of the
// viewport, condensed sign dossier below. Broken layout + magic background,
// production palette (bg rgb(10,9,18), gold/violet accents).
// Instruments: an ORBIT DIAL drives the period selector (Today … 2026) with
// a pivoting needle and a reading plate; a CELESTIAL RING holds the 12
// animals of the cycle with the Tiger pinned at the zenith.
// Self-contained: inline SVG + Tailwind + one scoped <style> block (ltg-
// prefixed). No emojis — the Tiger mark is a drawn SVG paw sigil. All motion
// is CSS-only and guarded by prefers-reduced-motion.

import { useState } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/* Production palette (from lab/remix-v2)                              */
/* ------------------------------------------------------------------ */
const BG = "#0a0912"; // rgb(10,9,18)
const GOLD = "#f3c77a";
const GOLD_DEEP = "#c9a227";
const CREAM = "#ffdd9c";
const VIOLET = "#a25adf";
const VIOLET_SOFT = "#b794f6";
const TEXT_HI = "#e9e6f2";
const TEXT_LO = "#b7b1cc";

const DEG = Math.PI / 180;
const FE = "\uFE0E"; // variation selector: glyphs render as text, never emoji

// point on a circle measured from the top, clockwise (degrees)
function fromTop(cx: number, cy: number, r: number, deg: number) {
  const t = deg * DEG;
  return { x: +(cx + r * Math.sin(t)).toFixed(1), y: +(cy - r * Math.cos(t)).toFixed(1) };
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

const STARS = (() => {
  const rnd = mulberry32(20260217);
  return Array.from({ length: 90 }, (_, i) => ({
    x: +(rnd() * 1600).toFixed(0),
    y: +(rnd() * 1000).toFixed(0),
    r: +(0.5 + rnd() * 1.1).toFixed(2),
    o: +(0.12 + rnd() * 0.38).toFixed(2),
    tw: i % 6 === 0,
    d: +(rnd() * 9).toFixed(1),
    key: i,
  }));
})();

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const PERIODS = ["Today", "Tomorrow", "Weekly", "Monthly", "2026"] as const;
type Period = (typeof PERIODS)[number];

const READINGS: Record<Period, string> = {
  Today:
    "The Tiger moves first today — speak before the room settles, and the room follows.",
  Tomorrow:
    "A rival's hesitation is your opening; strike cleanly and do not look back.",
  Weekly:
    "Midweek rewards the bold ask — name the number, hold the silence after it.",
  Monthly:
    "A long pursuit turns in your favor; spend the month consolidating, not chasing.",
  "2026":
    "The Year of the Horse feeds your fire: lead one campaign well instead of five badly.",
};

const ANIMALS = [
  "Rat",
  "Ox",
  "Tiger",
  "Rabbit",
  "Dragon",
  "Snake",
  "Horse",
  "Goat",
  "Monkey",
  "Rooster",
  "Dog",
  "Pig",
] as const;

const YEARS = [1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022, 2034];

const TRAITS = ["Brave", "Competitive", "Confident", "Charismatic", "Independent"];

const LUCKY = [
  { label: "Numeri", value: "1 · 3 · 4" },
  { label: "Colores", value: "Orange · Gray · Blue" },
  { label: "Directiones", value: "East · South" },
];

const STRENGTHS = [
  "Natural leadership and charisma",
  "Courage and bravery in challenges",
  "Strong competitive spirit",
  "Independent and self-reliant",
  "Passionate and energetic nature",
];

const GROWTH = [
  "Can be impulsive and reckless",
  "Sometimes too aggressive",
  "May lack patience",
  "Can be overly competitive",
  "Difficulty with authority",
];

const COMPATIBILITY = [
  { tier: "Excellent", animals: ["Horse", "Dog"], tone: "gold" as const },
  {
    tier: "Good",
    animals: ["Rat", "Ox", "Rabbit", "Dragon", "Snake", "Goat", "Rooster", "Pig"],
    tone: "violet" as const,
  },
  { tier: "Challenging", animals: ["Monkey"], tone: "dim" as const },
];

const FAMOUS = [
  { name: "Queen Elizabeth II", year: 1926 },
  { name: "Marilyn Monroe", year: 1926 },
  { name: "Leonardo DiCaprio", year: 1974 },
  { name: "Lady Gaga", year: 1986 },
  { name: "Tom Hardy", year: 1977 },
  { name: "Emma Stone", year: 1988 },
];

const NAV_TABS = [
  { href: "/tarot", label: "Tarot Hub" },
  { href: "/tarot/spreads/daily-card", label: "Daily Card" },
  { href: "/tarot/spreads/yes-no", label: "Yes / No" },
  { href: "/tarot/birth-arcana", label: "Birth Arcana" },
  { href: "/matrix", label: "Matrix" },
  { href: "/horoscopes/chinese/tiger", label: "Tiger", active: true },
];

/* ------------------------------------------------------------------ */
/* Scoped styles (ltg- prefix)                                         */
/* ------------------------------------------------------------------ */
const LTG_STYLES = `
  .ltg-serif { font-family: "Playfair Display", "Cormorant Garamond", Georgia, "Times New Roman", serif; }
  .ltg-glyph { font-family: "Noto Sans Symbols", "Noto Sans Symbols 2", Symbola, "Segoe UI Symbol", serif; font-style: normal; }
  .ltg-caps { text-transform: uppercase; letter-spacing: 0.24em; }
  .ltg-label {
    text-transform: uppercase; letter-spacing: 0.26em; font-size: 11px;
    color: #f3c77a; text-shadow: 0 1px 0 rgba(0,0,0,0.8), 0 0 14px rgba(243,199,122,0.25);
  }
  .ltg-panel {
    background: linear-gradient(160deg, rgba(23,19,40,0.62), rgba(12,10,22,0.72));
    border: 1px solid rgba(233,230,242,0.10);
    backdrop-filter: blur(3px);
  }
  .ltg-plate {
    background: linear-gradient(165deg, rgba(28,23,48,0.55), rgba(14,11,26,0.65));
    border: 1px solid rgba(201,162,39,0.28);
    box-shadow: inset 0 1px 0 rgba(233,230,242,0.05);
  }
  .ltg-chip {
    display: inline-block; border: 1px solid rgba(243,199,122,0.35);
    background: rgba(10,9,18,0.88); padding: 4px 10px; font-size: 9.5px;
    letter-spacing: 0.2em; text-transform: uppercase; color: #f3c77a;
  }
  .ltg-gold-link {
    color: #f3c77a; text-decoration: none;
    background-image: linear-gradient(#f3c77a, #f3c77a);
    background-size: 0% 1px; background-repeat: no-repeat; background-position: 0 100%;
    transition: background-size 0.35s ease, color 0.2s ease;
  }
  .ltg-gold-link:hover { color: #ffdd9c; background-size: 100% 1px; }

  /* ---- orbit dial (period selector) ---- */
  .ltg-needle {
    transform-origin: 300px 340px;
    transition: transform 0.7s cubic-bezier(0.34, 1.4, 0.44, 1);
  }
  .ltg-orbit-tab {
    position: absolute; transform: translate(-50%, -50%);
    border: 1px solid rgba(183,148,246,0.4); background: rgba(16,13,30,0.85);
    padding: 6px 13px; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
    color: #b7b1cc; cursor: pointer; white-space: nowrap;
    box-shadow: 0 4px 14px rgba(0,0,0,0.5);
    transition: border-color 0.25s ease, color 0.25s ease, box-shadow 0.3s ease, background 0.25s ease;
  }
  .ltg-orbit-tab:hover { color: #e9e6f2; border-color: rgba(183,148,246,0.75); }
  .ltg-orbit-on {
    color: #ffdd9c; border-color: #f3c77a; background: rgba(38,29,52,0.95);
    box-shadow: 0 0 20px rgba(243,199,122,0.4), 0 4px 14px rgba(0,0,0,0.5);
  }

  /* ---- celestial ring (animal switcher) ---- */
  .ltg-ring { transition: transform 0.8s cubic-bezier(0.3, 1.05, 0.4, 1); }
  .ltg-ring-chip {
    display: block; border: 1px solid rgba(183,148,246,0.4);
    background: rgba(14,11,26,0.92); padding: 5px 11px;
    font-size: 9.5px; letter-spacing: 0.16em; text-transform: uppercase;
    color: #b7b1cc; cursor: pointer; white-space: nowrap; text-decoration: none;
    transition: transform 0.8s cubic-bezier(0.3, 1.05, 0.4, 1), border-color 0.25s ease,
      color 0.25s ease, box-shadow 0.3s ease;
  }
  .ltg-ring-chip:hover { color: #e9e6f2; border-color: rgba(183,148,246,0.8); }
  .ltg-ring-on {
    color: #0a0912; background: #f3c77a; border-color: #ffdd9c;
    box-shadow: 0 0 22px rgba(243,199,122,0.55); cursor: default;
  }
  .ltg-marker {
    color: #f3c77a; font-size: 12px;
    text-shadow: 0 0 12px rgba(243,199,122,0.8); z-index: 10;
  }

  /* ---- year plates ---- */
  .ltg-year {
    border: 1px solid rgba(201,162,39,0.3); background: rgba(13,11,24,0.7);
    padding: 8px 0; text-align: center; font-family: ui-monospace, monospace;
    font-size: 12px; letter-spacing: 0.12em; color: #b7b1cc;
    box-shadow: inset 0 1px 0 rgba(255,221,156,0.08);
    transition: border-color 0.25s ease, color 0.25s ease, box-shadow 0.3s ease;
  }
  .ltg-year:hover {
    color: #ffdd9c; border-color: rgba(243,199,122,0.7);
    box-shadow: 0 0 16px rgba(243,199,122,0.18), inset 0 1px 0 rgba(255,221,156,0.08);
  }

  /* ---- background motion (slow, guarded below) ---- */
  @keyframes ltg-twinkle { 0%,100% { opacity: 0.1; } 50% { opacity: 0.7; } }
  @keyframes ltg-floatA { 0%,100% { transform: translate(0,0) rotate(-2deg); } 50% { transform: translate(1.4vw,-2vh) rotate(1deg); } }
  @keyframes ltg-floatB { 0%,100% { transform: translate(0,0) rotate(3deg); } 50% { transform: translate(-1.4vw,2vh) rotate(-1deg); } }
  @keyframes ltg-spin { to { transform: rotate(360deg); } }
  .ltg-twinkle { animation: ltg-twinkle 8s ease-in-out infinite; }
  .ltg-float-a { animation: ltg-floatA 38s ease-in-out infinite; }
  .ltg-float-b { animation: ltg-floatB 46s ease-in-out infinite; }
  .ltg-nebula  { animation: ltg-floatA 64s ease-in-out infinite; }
  .ltg-spin-slow { animation: ltg-spin 200s linear infinite; transform-origin: 50% 50%; }

  @media (prefers-reduced-motion: reduce) {
    .ltg-twinkle, .ltg-float-a, .ltg-float-b, .ltg-nebula, .ltg-spin-slow {
      animation: none !important;
    }
    .ltg-needle, .ltg-ring, .ltg-ring-chip, .ltg-year, .ltg-orbit-tab {
      transition: none !important;
    }
  }
`;

/* ------------------------------------------------------------------ */
/* Tiger paw sigil — drawn mark, replaces the emoji                    */
/* ------------------------------------------------------------------ */
function PawSigil({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
      {/* pad */}
      <path
        d="M12 13.2c-2.6 0-4.6 2-4.6 4.2 0 1.6 1.2 2.6 2.7 2.6 1 0 1.4-.4 1.9-.4s.9.4 1.9.4c1.5 0 2.7-1 2.7-2.6 0-2.2-2-4.2-4.6-4.2Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      {/* toes */}
      <ellipse cx="5.6" cy="9.4" rx="1.7" ry="2.3" transform="rotate(-18 5.6 9.4)" stroke="currentColor" strokeWidth="1.1" />
      <ellipse cx="9.6" cy="6.2" rx="1.7" ry="2.4" transform="rotate(-6 9.6 6.2)" stroke="currentColor" strokeWidth="1.1" />
      <ellipse cx="14.4" cy="6.2" rx="1.7" ry="2.4" transform="rotate(6 14.4 6.2)" stroke="currentColor" strokeWidth="1.1" />
      <ellipse cx="18.4" cy="9.4" rx="1.7" ry="2.3" transform="rotate(18 18.4 9.4)" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Backdrop — star field, hairline machinery, dim glyphs               */
/* ------------------------------------------------------------------ */
function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="ltg-nebula absolute -left-[18vw] top-[6vh] h-[64vmin] w-[64vmin] bg-[radial-gradient(circle,rgba(162,90,223,0.10),transparent_65%)]" />
      <div className="ltg-nebula absolute right-[-14vw] top-[58vh] h-[74vmin] w-[74vmin] bg-[radial-gradient(circle,rgba(243,199,122,0.07),transparent_65%)]" />

      {/* huge zodiac ring hanging off the top-right corner, slowly turning */}
      <svg
        viewBox="0 0 400 400"
        className="ltg-spin-slow absolute -right-[38vmin] -top-[40vmin] h-[130vmin] w-[130vmin] opacity-[0.06]"
      >
        <circle cx={200} cy={200} r={196} fill="none" stroke={GOLD} strokeWidth={0.7} />
        <circle cx={200} cy={200} r={168} fill="none" stroke={GOLD} strokeWidth={0.5} strokeDasharray="2 6" />
        <circle cx={200} cy={200} r={120} fill="none" stroke={VIOLET_SOFT} strokeWidth={0.5} />
        {Array.from({ length: 60 }, (_, k) => {
          const p1 = fromTop(200, 200, 188, k * 6);
          const p2 = fromTop(200, 200, 196, k * 6);
          return (
            <line
              key={k}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={GOLD}
              strokeWidth={k % 5 === 0 ? 1 : 0.4}
            />
          );
        })}
        {Array.from({ length: 12 }, (_, i) => {
          const p1 = fromTop(200, 200, 120, i * 30);
          const p2 = fromTop(200, 200, 196, i * 30);
          return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={VIOLET_SOFT} strokeWidth={0.4} />;
        })}
      </svg>

      <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        {STARS.map((s) =>
          s.tw ? (
            <circle
              key={s.key}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill={CREAM}
              className="ltg-twinkle"
              style={{ animationDelay: `${s.d}s`, opacity: s.o }}
            />
          ) : (
            <circle key={s.key} cx={s.x} cy={s.y} r={s.r} fill={TEXT_LO} opacity={s.o} />
          ),
        )}

        {/* hairline apparatus */}
        <circle cx={-140} cy={820} r={400} fill="none" stroke={VIOLET} strokeWidth={0.5} opacity={0.3} />
        <circle cx={-140} cy={820} r={540} fill="none" stroke={VIOLET} strokeWidth={0.4} opacity={0.18} strokeDasharray="2 8" />
        <line x1={-60} y1={140} x2={1660} y2={820} stroke={TEXT_LO} strokeWidth={0.4} opacity={0.15} />
        <line x1={-60} y1={900} x2={1640} y2={80} stroke={TEXT_LO} strokeWidth={0.4} opacity={0.11} />
        <line x1={1180} y1={-40} x2={1180} y2={1040} stroke={GOLD_DEEP} strokeWidth={0.4} opacity={0.16} strokeDasharray="1 6" />
        {[140, 340, 540, 740, 940].map((y) => (
          <line key={y} x1={1172} y1={y} x2={1188} y2={y} stroke={GOLD} strokeWidth={0.7} opacity={0.35} />
        ))}

        {/* constellation: a leaping arc, lower left */}
        <g opacity={0.5}>
          <polyline
            points="160,640 240,586 330,604 398,548 470,576 540,520"
            fill="none"
            stroke={VIOLET_SOFT}
            strokeWidth={0.6}
            opacity={0.5}
          />
          {[
            [160, 640],
            [240, 586],
            [330, 604],
            [398, 548],
            [470, 576],
            [540, 520],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={1.6} fill={TEXT_HI} opacity={0.75} />
          ))}
        </g>
      </svg>

      <span className="ltg-glyph ltg-float-a absolute right-[4vw] top-[34vh] text-[24vmin] leading-none text-[#b794f6] opacity-[0.05]">
        ♃{FE}
      </span>
      <span className="ltg-glyph ltg-float-b absolute left-[2vw] top-[150vh] text-[28vmin] leading-none text-[#f3c77a] opacity-[0.045]">
        ♂{FE}
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
          <span className="ltg-glyph grid h-7 w-7 place-items-center border border-[#f3c77a]/40 bg-[#f3c77a]/[0.07] text-[13px] text-[#f3c77a]">
            ☾{FE}
          </span>
          <span className="ltg-serif text-[16px] tracking-wide text-[#e9e6f2]">Astro Scope</span>
        </Link>
        <span className="hidden font-mono text-[9px] tracking-[0.3em] text-[#b7b1cc]/50 sm:inline">
          CHINESE ZODIAC · TIGER
        </span>
        <div className="ml-auto flex items-center gap-3">
          <Link
            href="#ltg-instrument"
            className="border border-[#f3c77a]/50 bg-[#f3c77a]/10 px-3 py-1.5 text-[12.5px] text-[#ffdd9c] transition-colors hover:bg-[#f3c77a]/20"
          >
            Read the period
          </Link>
        </div>
      </div>

      <nav aria-label="Tools and signs" className="border-t border-white/[0.05]">
        <div className="mx-auto flex max-w-6xl items-stretch gap-1 overflow-x-auto px-4 py-2 md:px-8">
          {NAV_TABS.map((t, i) =>
            t.active ? (
              <span
                key={t.href}
                aria-current="page"
                className="ltg-chip shrink-0 -rotate-[0.4deg] !border-[#f3c77a]/70 !bg-[#f3c77a]/15 !text-[#ffdd9c]"
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
/* Instrument I — orbit dial period selector + reading plate           */
/* ------------------------------------------------------------------ */
const ORBIT_ANGLES = [-40, -20, 0, 20, 40]; // degrees from vertical
const ORBIT_CX = 300;
const ORBIT_CY = 340;
const ORBIT_R = 270;

function OrbitDial() {
  const [active, setActive] = useState<Period>("Today");
  const idx = PERIODS.indexOf(active);
  const arcStart = fromTop(ORBIT_CX, ORBIT_CY, ORBIT_R, -52);
  const arcEnd = fromTop(ORBIT_CX, ORBIT_CY, ORBIT_R, 52);
  return (
    <div>
      <div className="relative mx-auto max-w-[560px]">
        <div className="aspect-[600/230]">
          <svg viewBox="0 0 600 230" className="absolute inset-0 h-full w-full">
            <path
              d={`M ${arcStart.x} ${arcStart.y} A ${ORBIT_R} ${ORBIT_R} 0 0 1 ${arcEnd.x} ${arcEnd.y}`}
              fill="none"
              stroke={GOLD_DEEP}
              strokeWidth={1}
              opacity={0.7}
            />
            <path
              d={`M ${arcStart.x} ${arcStart.y} A ${ORBIT_R} ${ORBIT_R} 0 0 1 ${arcEnd.x} ${arcEnd.y}`}
              fill="none"
              stroke={GOLD}
              strokeWidth={3}
              opacity={0.12}
            />
            {[-50, -30, -10, 10, 30, 50].map((a) => {
              const p1 = fromTop(ORBIT_CX, ORBIT_CY, ORBIT_R - 7, a);
              const p2 = fromTop(ORBIT_CX, ORBIT_CY, ORBIT_R + 7, a);
              return (
                <line
                  key={a}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={GOLD}
                  strokeWidth={0.7}
                  opacity={0.5}
                />
              );
            })}
            {/* the pointer, pivoting below the frame */}
            <g className="ltg-needle" style={{ transform: `rotate(${ORBIT_ANGLES[idx]}deg)` }}>
              <line
                x1={ORBIT_CX}
                y1={ORBIT_CY}
                x2={ORBIT_CX}
                y2={ORBIT_CY - ORBIT_R - 26}
                stroke={CREAM}
                strokeWidth={1.2}
                opacity={0.9}
              />
              <circle cx={ORBIT_CX} cy={ORBIT_CY - ORBIT_R - 30} r={3.2} fill={CREAM} />
            </g>
          </svg>
          {PERIODS.map((p, i) => {
            const pos = fromTop(ORBIT_CX, ORBIT_CY, ORBIT_R, ORBIT_ANGLES[i]);
            const on = p === active;
            return (
              <button
                key={p}
                type="button"
                aria-pressed={on}
                onClick={() => setActive(p)}
                className={`ltg-orbit-tab ${on ? "ltg-orbit-on" : ""}`}
                style={{
                  left: `${(pos.x / 600) * 100}%`,
                  top: `${(pos.y / 230) * 100}%`,
                }}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>
      <div className="ltg-plate relative mt-6 px-5 py-4">
        <span className="ltg-caps block text-[9px] text-[#b7b1cc]/70">
          Dial position {ORBIT_ANGLES[idx]}° · Tiger reading — {active}
        </span>
        <p key={active} className="ltg-serif mt-1.5 text-[15.5px] leading-relaxed text-[#e9e6f2]">
          {READINGS[active]}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Instrument II — celestial ring of the 12 animals, Tiger at zenith   */
/* ------------------------------------------------------------------ */
function CelestialRing() {
  const activeIdx = ANIMALS.indexOf("Tiger"); // 2
  const ringRot = -activeIdx * 30; // bring the Tiger to the top marker
  const R = 128; // ring radius in px (ring box is 320px)
  return (
    <div className="relative mx-auto h-[320px] w-[320px]">
      {/* dial furniture: outer hairline + tick ring (static) */}
      <svg viewBox="0 0 320 320" className="absolute inset-0 h-full w-full">
        <circle cx={160} cy={160} r={150} fill="none" stroke={GOLD_DEEP} strokeWidth={0.6} opacity={0.5} />
        <circle cx={160} cy={160} r={104} fill="none" stroke={VIOLET_SOFT} strokeWidth={0.5} opacity={0.35} strokeDasharray="2 5" />
        {Array.from({ length: 60 }, (_, k) => {
          const p1 = fromTop(160, 160, 144, k * 6);
          const p2 = fromTop(160, 160, 150, k * 6);
          return (
            <line
              key={k}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={GOLD}
              strokeWidth={k % 5 === 0 ? 1 : 0.4}
              opacity={k % 5 === 0 ? 0.7 : 0.35}
            />
          );
        })}
      </svg>
      {/* top marker */}
      <span aria-hidden className="ltg-marker absolute left-1/2 top-[-4px] -translate-x-1/2">
        ▼
      </span>
      {/* the ring of animals, rotated so the Tiger stands at the zenith */}
      <div className="ltg-ring absolute inset-0" style={{ transform: `rotate(${ringRot}deg)` }}>
        {ANIMALS.map((a, i) => {
          const on = a === "Tiger";
          const chip = (
            <span
              className={`ltg-ring-chip ${on ? "ltg-ring-on" : ""}`}
              style={{ transform: `rotate(${(activeIdx - i) * 30}deg)` }}
            >
              {a}
            </span>
          );
          return (
            <div
              key={a}
              className="absolute left-1/2 top-1/2"
              style={{ transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-${R}px)` }}
            >
              {on ? (
                <span aria-current="page">{chip}</span>
              ) : (
                <Link href="#" aria-label={`${a} — sign page not yet open`}>
                  {chip}
                </Link>
              )}
            </div>
          );
        })}
      </div>
      {/* hub readout */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <span className="ltg-caps block text-[8px] text-[#b7b1cc]/60">cycle</span>
        <span className="ltg-serif block text-[19px] text-[#ffdd9c]">Tiger</span>
        <span className="ltg-caps block text-[8px] text-[#b7b1cc]/60">03 / 12</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section shell — engraved panel with a straddling chip               */
/* ------------------------------------------------------------------ */
function SectionShell(props: {
  index: string;
  name: string;
  chip?: string;
  frame?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`relative ${props.frame ?? ""}`}>
      <div className="ltg-panel relative px-5 py-7 md:px-9 md:py-9">
        <span className="ltg-chip absolute -top-3 left-6 rotate-[0.5deg]">
          {props.chip ?? props.name}
        </span>
        <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="ltg-label">
            {props.index} — {props.name}
          </h2>
          <span className="hidden h-px flex-1 bg-gradient-to-r from-[#c9a227]/40 to-transparent sm:block" />
        </header>
        <div className="mt-6">{props.children}</div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function TigerPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#0a0912] font-sans text-[#e9e6f2] antialiased selection:bg-[#f3c77a]/25">
      <style>{LTG_STYLES}</style>
      <Backdrop />

      <div className="relative z-10">
        <Header />

        {/* ================= HERO + PERIOD INSTRUMENT — top of viewport ==== */}
        <section id="ltg-instrument" className="relative overflow-visible">
          {/* slashed hairline crossing the stage */}
          <div
            className="pointer-events-none absolute left-[-4vw] top-[58%] h-px w-[108vw] -rotate-[0.9deg] bg-gradient-to-r from-transparent via-[#b794f6]/25 to-transparent"
            aria-hidden
          />
          <span aria-hidden className="absolute right-5 top-24 hidden rotate-90 font-mono text-[7px] tracking-[0.3em] text-[#b7b1cc]/35 lg:inline">
            ANNVS TIGRIS · III / XII
          </span>

          <div className="mx-auto max-w-6xl px-5 pb-16 pt-10 md:px-8 md:pb-20 md:pt-12">
            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
              {/* left: sign identity */}
              <div className="relative z-10">
                <p className="ltg-chip -rotate-[0.5deg]">Wood Element · Chinese Zodiac</p>
                <h1 className="ltg-serif mt-5 flex items-center gap-4 text-[clamp(38px,5.5vw,64px)] leading-[1.02] tracking-tight text-[#e9e6f2]">
                  <span className="grid h-[0.9em] w-[0.9em] shrink-0 place-items-center border border-[#f3c77a]/40 bg-[#f3c77a]/[0.06] rotate-[0.5deg]">
                    <PawSigil className="h-[0.55em] w-[0.55em] text-[#f3c77a]" />
                  </span>
                  <span>
                    TIGER <span className="text-[#f3c77a]">虎</span>
                  </span>
                </h1>
                <p className="mt-4 max-w-lg text-[14px] leading-relaxed text-[#b7b1cc]">
                  The Tiger symbolizes courage, strength, and leadership. People born in the Year of
                  the Tiger are natural leaders with magnetic personalities. They are brave,
                  competitive, and independent, often taking on challenges that others might avoid.
                </p>

                {/* trait chips, straddling and tilted */}
                <div className="mt-7 flex max-w-lg flex-wrap gap-2">
                  {TRAITS.map((t, i) => (
                    <span
                      key={t}
                      className={`border border-[#f3c77a]/30 bg-[#0a0912]/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[#f3c77a] ${
                        i % 2 === 0 ? "-rotate-[0.6deg]" : "translate-y-1 rotate-[0.5deg]"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* micro readout strip */}
                <div className="mt-7 flex max-w-lg flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[8px] tracking-[0.22em] text-[#b7b1cc]/45">
                  <span>SIGNVM III · TIGRIS</span>
                  <span className="text-[#b794f6]">◆ ELEMENTVM · WOOD</span>
                  <span>POLARITAS · YANG</span>
                </div>
              </div>

              {/* right: the orbit dial, counter-rotated plate */}
              <div className="ltg-panel relative z-20 rotate-[0.6deg] px-5 py-7 md:px-7 lg:-ml-4 lg:mt-4">
                <span className="ltg-chip absolute -top-3 right-6 -rotate-[0.6deg] !border-[#b794f6]/50 !text-[#b794f6]">
                  Machina Periodorum
                </span>
                <h2 className="ltg-label">Period selector</h2>
                <p className="mt-2 text-[12.5px] leading-relaxed text-[#b7b1cc]/85">
                  Turn the dial to a period — the needle swings and the reading plate below is
                  re-engraved for the Tiger.
                </p>
                <div className="mt-5">
                  <OrbitDial />
                </div>
              </div>
            </div>
          </div>

          {/* bottom rule the next section rides over */}
          <div
            className="pointer-events-none absolute bottom-0 left-[-4vw] h-px w-[108vw] rotate-[0.3deg] bg-gradient-to-r from-transparent via-[#f3c77a]/30 to-transparent"
            aria-hidden
          />
        </section>

        {/* ================= ANIMAL SWITCHER — celestial ring ============== */}
        <SectionShell
          index="Tabula II"
          name="The twelve of the cycle"
          chip="Rota Animalium"
          frame="mx-auto max-w-6xl px-5 md:px-8 -mt-4 relative z-20"
        >
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
            <div className="-rotate-[0.4deg]">
              <CelestialRing />
            </div>
            <div className="lg:pl-6">
              <p className="max-w-xl text-[13px] leading-relaxed text-[#b7b1cc]">
                Twelve animals hold the cycle in turn; the Tiger stands third, at the zenith of this
                ring. Its station is lit in gold — the other stations are engraved but not yet open.
              </p>

              {/* years of birth, small plates */}
              <div className="mt-7">
                <span className="ltg-caps block text-[9px] text-[#b7b1cc]/70">Years of the Tiger</span>
                <div className="mt-3 grid max-w-xl grid-cols-5 gap-2">
                  {YEARS.map((y, i) => (
                    <span key={y} className={`ltg-year ${i % 2 === 0 ? "-rotate-[0.5deg]" : "rotate-[0.4deg]"}`}>
                      {y}
                    </span>
                  ))}
                </div>
              </div>

              {/* lucky elements register */}
              <div className="mt-7 grid max-w-xl gap-2 sm:grid-cols-3">
                {LUCKY.map((l, i) => (
                  <div
                    key={l.label}
                    className={`border border-white/[0.08] bg-[#0a0912]/50 px-3 py-2.5 font-mono ${
                      i % 2 === 0 ? "lg:-rotate-[0.4deg]" : "lg:translate-y-1 lg:rotate-[0.4deg]"
                    }`}
                  >
                    <span className="block text-[7px] tracking-[0.26em] text-[#b794f6]">{l.label}</span>
                    <span className="mt-1 block text-[10.5px] tracking-[0.1em] text-[#f3c77a]">{l.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionShell>

        {/* ================= STRENGTHS / GROWTH — paired plates ============ */}
        <section className="relative py-12 md:py-16">
          <div
            className="pointer-events-none absolute left-[9%] top-[-2rem] hidden h-[calc(100%+4rem)] w-px rotate-[0.4deg] bg-gradient-to-b from-transparent via-[#f3c77a]/25 to-transparent md:block"
            aria-hidden
          />
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-0">
              {/* strengths — tilted left */}
              <div className="ltg-panel relative z-10 -rotate-[0.5deg] px-6 py-7 lg:mr-6">
                <span className="ltg-chip absolute -top-3 left-6 !text-[9px]">Vires</span>
                <h2 className="ltg-serif text-[clamp(20px,2.6vw,28px)] text-[#e9e6f2]">Strengths</h2>
                <ol className="mt-4 space-y-3">
                  {STRENGTHS.map((s, i) => (
                    <li key={s} className="flex items-baseline gap-4">
                      <span className="ltg-serif shrink-0 text-[18px] leading-none text-[#f3c77a]">
                        {["I", "II", "III", "IV", "V"][i]}
                      </span>
                      <p className="text-[12.5px] leading-relaxed text-[#b7b1cc]">{s}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* areas for growth — counter-tilted, overlapping, pushed down */}
              <div className="ltg-panel relative z-20 rotate-[0.6deg] px-6 py-7 lg:-ml-10 lg:mt-14">
                <span className="ltg-chip absolute -top-3 right-6 !border-[#b794f6]/50 !text-[9px] !text-[#b794f6]">
                  Laborandum
                </span>
                <h2 className="ltg-serif text-[clamp(20px,2.6vw,28px)] text-[#e9e6f2]">
                  Areas for growth
                </h2>
                <ol className="mt-4 space-y-3">
                  {GROWTH.map((s, i) => (
                    <li key={s} className="flex items-baseline gap-4">
                      <span className="ltg-serif shrink-0 text-[18px] leading-none text-[#b794f6]">
                        {["I", "II", "III", "IV", "V"][i]}
                      </span>
                      <p className="text-[12.5px] leading-relaxed text-[#b7b1cc]">{s}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* ================= COMPATIBILITY + FAMOUS TIGERS ================= */}
        <section className="relative pb-14">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-8">
              {/* compatibility ledger */}
              <div className="ltg-panel relative rotate-[0.4deg] px-6 py-7">
                <span className="ltg-chip absolute -top-3 left-6 !text-[9px]">Concordantiae</span>
                <h2 className="ltg-serif text-[clamp(20px,2.6vw,28px)] text-[#e9e6f2]">
                  Compatibility
                </h2>
                <div className="mt-5 space-y-4">
                  {COMPATIBILITY.map((c) => (
                    <div key={c.tier} className="border-t border-white/[0.07] pt-3 first:border-t-0 first:pt-0">
                      <span
                        className={`ltg-caps block text-[9px] ${
                          c.tone === "gold"
                            ? "text-[#f3c77a]"
                            : c.tone === "violet"
                              ? "text-[#b794f6]"
                              : "text-[#b7b1cc]/60"
                        }`}
                      >
                        {c.tier}
                      </span>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {c.animals.map((a, i) => (
                          <span
                            key={a}
                            className={`border px-2.5 py-1 text-[9.5px] uppercase tracking-[0.16em] ${
                              i % 2 === 0 ? "rotate-[0.3deg]" : "-rotate-[0.3deg]"
                            } ${
                              c.tone === "gold"
                                ? "border-[#f3c77a]/50 bg-[#f3c77a]/10 text-[#ffdd9c]"
                                : c.tone === "violet"
                                  ? "border-[#b794f6]/35 text-[#b7b1cc]"
                                  : "border-white/[0.12] text-[#b7b1cc]/55"
                            }`}
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* famous tigers — counter-tilted, overlapping */}
              <div className="ltg-panel relative -rotate-[0.5deg] px-6 py-7 lg:-ml-6 lg:mt-10">
                <span className="ltg-chip absolute -top-3 right-6 !text-[9px]">Tigres Illustres</span>
                <h2 className="ltg-serif text-[clamp(20px,2.6vw,28px)] text-[#e9e6f2]">
                  Famous Tigers
                </h2>
                <ul className="mt-5 space-y-0">
                  {FAMOUS.map((f, i) => (
                    <li
                      key={f.name}
                      className={`flex items-baseline justify-between gap-4 border-t border-white/[0.06] py-2.5 first:border-t-0 ${
                        i % 2 === 0 ? "-rotate-[0.2deg]" : "rotate-[0.2deg]"
                      }`}
                    >
                      <span className="text-[13px] text-[#e9e6f2]">{f.name}</span>
                      <span className="font-mono text-[10px] tracking-[0.18em] text-[#f3c77a]/80">
                        {f.year}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 font-mono text-[7px] tracking-[0.24em] text-[#b7b1cc]/45">
                  CENSVS · ANNI TIGRIS VERIFICATI
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FOOTER — slim colophon ======================== */}
        <footer className="relative mt-4">
          <div className="pointer-events-none absolute -top-px left-0 h-px w-full bg-white/[0.07]" aria-hidden />
          <div
            className="pointer-events-none absolute -top-2 left-[-3vw] h-px w-[106vw] rotate-[0.5deg] bg-gradient-to-r from-transparent via-[#b794f6]/30 to-transparent"
            aria-hidden
          />
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-8 md:flex-row md:justify-between md:px-8">
            <div className="flex items-center gap-2.5">
              <span className="grid h-6 w-6 place-items-center border border-[#f3c77a]/40 bg-[#f3c77a]/[0.07]">
                <PawSigil className="h-3.5 w-3.5 text-[#f3c77a]" />
              </span>
              <span className="ltg-serif text-[14px] text-[#e9e6f2]">Astro Scope</span>
              <span className="font-mono text-[7px] tracking-[0.26em] text-[#b7b1cc]/45">
                CHINESE ZODIAC · TIGER
              </span>
            </div>
            <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1 font-mono text-[8px] uppercase tracking-[0.2em] text-[#b7b1cc]/60">
              <Link href="/tarot" className="transition-colors hover:text-[#f3c77a]">Tarot Hub</Link>
              <Link href="/matrix" className="transition-colors hover:text-[#f3c77a]">Matrix</Link>
              <Link href="#ltg-instrument" className="transition-colors hover:text-[#f3c77a]">Period dial ↑</Link>
            </nav>
            <p className="font-mono text-[8px] tracking-[0.22em] text-[#b7b1cc]/40">© MMXXVI · AS ABOVE · SO BELOW</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
