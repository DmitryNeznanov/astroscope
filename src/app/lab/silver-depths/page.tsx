// LAB / SILVER DEPTHS — a design exploration of the production landing in the
// "Lunar Tide Report" language of astro/Screenshot_20260804_230820.png:
// silver-blue on near-black navy, an overloaded arcana analysis engine with
// a tide force map, gauges, harmonic charts and dense engraved small print.
// Fully self-contained: inline SVG, Tailwind for layout, one scoped <style>
// block (lsd- prefixed) for the rest. Server-component safe: no hooks, CSS
// animations only (slow 3–180s cycles, reduced-motion guarded), statically
// prerendered.

import type { Metadata } from "next";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Astro Scope — Silver Depths",
  description:
    "Free birth chart, daily horoscopes, synastry and tarot — the moon pulls, the veil thins.",
};

const DEG = Math.PI / 180;

// silver-on-navy palette
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

// hand-sampled sine path for the tidal forecast chart
function sinePath(x0: number, x1: number, yMid: number, amp: number, cycles: number, phase = 0) {
  const steps = 72;
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
const SIGNS: Array<[string, string, string]> = [
  ["♈︎", "Aries", "Mar 21 – Apr 19"],
  ["♉︎", "Taurus", "Apr 20 – May 20"],
  ["♊︎", "Gemini", "May 21 – Jun 20"],
  ["♋︎", "Cancer", "Jun 21 – Jul 22"],
  ["♌︎", "Leo", "Jul 23 – Aug 22"],
  ["♍︎", "Virgo", "Aug 23 – Sep 22"],
  ["♎︎", "Libra", "Sep 23 – Oct 22"],
  ["♏︎", "Scorpio", "Oct 23 – Nov 21"],
  ["♐︎", "Sagittarius", "Nov 22 – Dec 21"],
  ["♑︎", "Capricorn", "Dec 22 – Jan 19"],
  ["♒︎", "Aquarius", "Jan 20 – Feb 18"],
  ["♓︎", "Pisces", "Feb 19 – Mar 20"],
];

const CHANNELS = [
  {
    n: "CH·01",
    tag: "FREE",
    name: "Birth Chart",
    copy: "Map your Sun, Moon, and Rising — the foundation of every reading.",
    href: "/birth-chart",
    glyph: "☉︎",
  },
  {
    n: "CH·02",
    tag: "DAILY",
    name: "Daily Horoscope",
    copy: "Twelve signs, one sky. Clear forecasts without the fluff.",
    href: "/horoscope",
    glyph: "☽︎",
  },
  {
    n: "CH·03",
    tag: "SYNASTRY",
    name: "Compatibility",
    copy: "Zodiac match, Chinese pairs, and deep synastry for two charts.",
    href: "/compatibility",
    glyph: "♀︎",
  },
  {
    n: "CH·04",
    tag: "SPREADS",
    name: "Tarot",
    copy: "Daily card to Celtic Cross — pull, reflect, get a full reading.",
    href: "/tarot",
    glyph: "✶",
  },
  {
    n: "CH·05",
    tag: "TESTS",
    name: "Psychology",
    copy: "MBTI, Big Five, empathy and more — meet yourself beyond the signs.",
    href: "/psychology",
    glyph: "☿︎",
  },
  {
    n: "CH·06",
    tag: "YOU",
    name: "Cosmic Passport",
    copy: "Your Cosmic ID, people, journal, and Premium deep dives — one hub.",
    href: "/passport",
    glyph: "◈",
  },
];

const FAQ = [
  {
    n: "N·01",
    q: "Which features are free?",
    a: "Birth chart, daily horoscopes, tarot pulls, compatibility basics and the psychology tests are all free. Premium adds deep-dive reports and journal sync.",
  },
  {
    n: "N·02",
    q: "How do I cast a birth chart?",
    a: "Open the Birth Chart channel and enter your birth date, time and place. The engine resolves coordinates, houses and aspects in seconds — no account required.",
  },
  {
    n: "N·03",
    q: "Where do the horoscopes live?",
    a: "The Daily Horoscope channel carries all twelve signs, refreshed at midnight UTC. Your own sign is pinned to the top once you create a Cosmic ID.",
  },
  {
    n: "N·04",
    q: "What is the Destiny Matrix?",
    a: "An optional birth-date octagram that maps purpose, love, money and age themes. It complements the natal chart; it never replaces it.",
  },
];

const INFLUENCES: Array<[string, string, number]> = [
  ["☽︎ The Moon", "+87", 87],
  ["♇︎ Pluto", "+64", 64],
  ["♆︎ Neptune", "+55", 55],
  ["♄︎ Saturn", "−12", -12],
  ["♂︎ Mars", "−24", -24],
];

const ELEMENTS: Array<[string, number, "up" | "down", boolean]> = [
  ["Fire", 12, "up", false],
  ["Earth", 24, "down", true],
  ["Air", 18, "up", true],
  ["Water", 46, "down", false],
];

const QUALITY: Array<[string, number]> = [
  ["Intuition", 90],
  ["Emotions", 78],
  ["Dreams", 88],
  ["Energy Flow", 82],
  ["Manifestation", 76],
];

const HARMONICS = [
  { hz: "0.78", name: "Primary Tide", r: 66 },
  { hz: "1.56", name: "Lunar Echo", r: 48 },
  { hz: "2.34", name: "Selenic Pulse", r: 36 },
  { hz: "3.12", name: "Siren Resonance", r: 27 },
  { hz: "4.68", name: "Deep Current", r: 55 },
];

const PHASE_CYCLE = [
  { d: "MAY 15", k: -0.85, on: false },
  { d: "MAY 18", k: -0.42, on: true },
  { d: "MAY 21", k: -0.1, on: false },
  { d: "MAY 24", k: 0.25, on: false },
  { d: "MAY 27", k: 0.6, on: false },
  { d: "MAY 30", k: 0.88, on: false },
  { d: "JUN 02", k: 1, on: false },
];

/* ============================ SMALL PIECES ================================ */

// engraved panel header: diamond + tracked title + hairline + right readout
function PHead({ title, right }: { title: string; right?: string }) {
  return (
    <div className="flex items-center gap-2 px-2.5 pt-2 pb-1.5">
      <span className="text-[7px] lsd-dim">◆</span>
      <span className="lsd-caps text-[8.5px] lsd-hi whitespace-nowrap">{title}</span>
      <span className="lsd-hair flex-1" />
      {right ? <span className="lsd-mono text-[7.5px] lsd-dim whitespace-nowrap">{right}</span> : null}
      <span className="text-[7px] lsd-dim">◆</span>
    </div>
  );
}

// dotted-track gauge row used in TIDE QUALITY
function GaugeRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="lsd-caps text-[7.5px] lsd-dim w-[72px] shrink-0">{label}</span>
      <span className="lsd-track relative h-[3px] flex-1">
        <span className="lsd-fill absolute inset-y-0 left-0" style={{ width: `${value}%` }} />
      </span>
      <span className="lsd-mono text-[8.5px] lsd-hi w-[18px] text-right">{value}</span>
    </div>
  );
}

// small moon disc with a draggable-looking terminator; k in [-1,1]
function PhaseDisc({ k, r, active }: { k: number; r: number; active?: boolean }) {
  const s = r * 2 + 6;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-hidden="true">
      <circle cx={s / 2} cy={s / 2} r={r} fill="#aebfd9" />
      <ellipse
        cx={s / 2 + k * r}
        cy={s / 2}
        rx={r}
        ry={r * 1.02}
        fill={INK}
        opacity={0.92}
      />
      <circle cx={s / 2} cy={s / 2} r={r} fill="none" stroke={STEEL} strokeWidth={0.6} opacity={0.8} />
      {active ? (
        <circle cx={s / 2} cy={s / 2} r={r + 2.4} fill="none" stroke={SILVER} strokeWidth={0.7} strokeDasharray="2 2" className="lsd-rot-c" />
      ) : null}
    </svg>
  );
}

// alchemical element triangle (fire/air up, earth/water down; earth/air barred)
function TriGlyph({ dir, bar, lit }: { dir: "up" | "down"; bar: boolean; lit: boolean }) {
  const pts = dir === "up" ? "12,4 20,19 4,19" : "4,5 20,5 12,20";
  const barY = dir === "up" ? 15.5 : 8.5;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <polygon
        points={pts}
        fill={lit ? "rgba(200,214,236,0.22)" : "none"}
        stroke={lit ? SILVER : STEEL}
        strokeWidth={1}
      />
      {bar ? <line x1="6" y1={barY} x2="18" y2={barY} stroke={lit ? SILVER : STEEL} strokeWidth={1} /> : null}
    </svg>
  );
}

/* ================================ PAGE ==================================== */

export default function SilverDepthsPage() {
  const ticks72 = ringTicks(320, 320, 288, 296, 72, 6);
  const ticks36 = ringTicks(320, 320, 252, 258, 36, 3);

  // tide force map moonlets: [ring radius, angleDeg, phaseOffset]
  const moonlets: Array<[number, number, number]> = [
    [112, 210, -0.5],
    [112, 330, 0.35],
    [168, 20, 0.75],
    [168, 140, -0.15],
    [168, 250, 0.5],
    [224, 75, -0.75],
    [224, 195, 0.1],
    [224, 300, -0.3],
  ];

  const forecast = sinePath(34, 292, 66, 30, 1.5, 0.6);
  const forecastSoft = sinePath(34, 292, 66, 30, 1.5, 1.1);

  return (
    <main className="lsd-root lsd-mono relative min-h-screen overflow-hidden p-2 sm:p-3">
      <style>{LSD_CSS}</style>

      {/* shared gradients */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <radialGradient id="lsd-moon" cx="38%" cy="34%" r="80%">
            <stop offset="0%" stopColor="#dfe9f8" />
            <stop offset="55%" stopColor="#9db2d0" />
            <stop offset="100%" stopColor="#54678a" />
          </radialGradient>
          <radialGradient id="lsd-moon-big" cx="40%" cy="36%" r="82%">
            <stop offset="0%" stopColor="#e6eefb" />
            <stop offset="50%" stopColor="#a8bcd8" />
            <stop offset="88%" stopColor="#5d7194" />
            <stop offset="100%" stopColor="#3c4c6a" />
          </radialGradient>
          <radialGradient id="lsd-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(150,175,215,0.20)" />
            <stop offset="70%" stopColor="rgba(150,175,215,0.05)" />
            <stop offset="100%" stopColor="rgba(150,175,215,0)" />
          </radialGradient>
          <linearGradient id="lsd-fillg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#54678a" />
            <stop offset="100%" stopColor="#c8d6ec" />
          </linearGradient>
        </defs>
      </svg>

      {/* ==================== BACKGROUND STRUCTURE ==================== */}
      {/* layered low-opacity graphics behind every panel */}
      <div className="lsd-bg" aria-hidden="true">
        {/* giant lunar dial, mostly off the viewport edge */}
        <svg className="lsd-bg-moon lsd-bg-moon-a" viewBox="0 0 900 900">
          <circle cx="450" cy="450" r="430" fill="none" stroke="#7d94b8" strokeWidth="0.8" opacity="0.16" />
          <circle cx="450" cy="450" r="360" fill="none" stroke="#7d94b8" strokeWidth="0.6" strokeDasharray="3 6" opacity="0.12" />
          <circle cx="450" cy="450" r="280" fill="none" stroke="#c8d6ec" strokeWidth="0.6" opacity="0.1" />
          <circle cx="450" cy="450" r="200" fill="url(#lsd-halo)" opacity="0.7" />
          <circle cx="450" cy="450" r="150" fill="url(#lsd-moon-big)" opacity="0.1" />
          <g className="lsd-rot-a">
            {ringTicks(450, 450, 396, 414, 96, 8).map((t, i) => (
              <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.major ? "#c8d6ec" : "#7d94b8"} strokeWidth="0.7" opacity={t.major ? 0.22 : 0.12} />
            ))}
          </g>
          {Array.from({ length: 8 }, (_, k) => {
            const p = onCircle(450, 450, 320, k * 45);
            return <circle key={k} cx={p.x} cy={p.y} r="3" fill="#c8d6ec" opacity="0.14" />;
          })}
        </svg>
        {/* second drowned dial, lower left depths */}
        <svg className="lsd-bg-moon lsd-bg-moon-b" viewBox="0 0 900 900">
          <circle cx="450" cy="450" r="420" fill="none" stroke="#7d94b8" strokeWidth="0.8" opacity="0.13" />
          <circle cx="450" cy="450" r="330" fill="none" stroke="#c8d6ec" strokeWidth="0.5" strokeDasharray="2 7" opacity="0.1" />
          <circle cx="450" cy="450" r="240" fill="none" stroke="#7d94b8" strokeWidth="0.6" opacity="0.09" />
          <circle cx="450" cy="450" r="130" fill="url(#lsd-halo)" opacity="0.5" />
          <g className="lsd-rot-b">
            {ringTicks(450, 450, 372, 386, 72, 6).map((t, i) => (
              <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#7d94b8" strokeWidth="0.7" opacity="0.12" />
            ))}
          </g>
        </svg>
        {/* hairline orbit circles crossing every section */}
        <div className="lsd-orbit lsd-orbit-a" />
        <div className="lsd-orbit lsd-orbit-b" />
        <div className="lsd-orbit lsd-orbit-c" />
        {/* constellation threads behind the panels */}
        <svg className="lsd-bg-const" viewBox="0 0 1200 1600" preserveAspectRatio="xMidYMin slice">
          <g stroke="#c8d6ec" strokeWidth="0.6" opacity="0.15" fill="none">
            <polyline points="820,140 900,210 965,180 1030,260 990,330 1080,380" />
            <polyline points="90,420 160,500 130,590 210,660 180,760" />
            <polyline points="300,1180 420,1120 520,1210 640,1160 700,1280 830,1240" />
          </g>
          <g fill="#c8d6ec" opacity="0.35">
            {([[820, 140], [900, 210], [965, 180], [1030, 260], [990, 330], [1080, 380], [90, 420], [160, 500], [130, 590], [210, 660], [180, 760], [300, 1180], [420, 1120], [520, 1210], [640, 1160], [700, 1280], [830, 1240]] as Array<[number, number]>).map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="1.8" />
            ))}
          </g>
          <g fill="#c8d6ec" opacity="0.18">
            {([[750, 96], [1120, 190], [870, 420], [240, 330], [60, 700], [330, 900], [1080, 860], [940, 1060], [150, 1330], [560, 1470], [1010, 1440], [700, 640]] as Array<[number, number]>).map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="1" />
            ))}
          </g>
        </svg>
        {/* extra star specks */}
        <div className="lsd-bg-stars" />
      </div>

      <div className="relative z-[1]">
      {/* ============================ MASTHEAD ============================ */}
      <header className="lsd-panel relative grid grid-cols-1 gap-2 px-3 py-2 lg:grid-cols-12 lg:items-center">
        {/* ornament dial bleeding off the viewport's top-right edge */}
        <svg className="lsd-rot-b absolute -right-12 -top-10 hidden h-36 w-36 lg:block" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="none" stroke={STEEL} strokeWidth="0.6" strokeDasharray="3 4" opacity="0.5" />
          <circle cx="50" cy="50" r="34" fill="none" stroke={STEEL} strokeWidth="0.5" opacity="0.4" />
          {ringTicks(50, 50, 39, 45, 24, 6).map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={SILVER} strokeWidth="0.6" opacity="0.5" />
          ))}
        </svg>
        <div className="flex items-center gap-3 lg:col-span-3">
          <svg width="40" height="40" viewBox="0 0 40 40" className="lsd-rot-a shrink-0" aria-hidden="true">
            <circle cx="20" cy="20" r="17" fill="none" stroke={STEEL} strokeWidth="0.7" opacity="0.7" />
            <circle cx="20" cy="20" r="12.5" fill="none" stroke={STEEL} strokeWidth="0.5" strokeDasharray="2 3" opacity="0.7" />
            <path d="M24 10 a11 11 0 1 0 0 20 a8.5 8.5 0 1 1 0 -20 Z" fill={SILVER} opacity="0.9" />
            <circle cx="20" cy="20" r="1.4" fill={SILVER} />
          </svg>
          <div>
            <div className="lsd-caps lsd-serif text-[13px] lsd-hi tracking-[0.3em]">Lunar Tide Report</div>
            <div className="lsd-caps text-[7.5px] lsd-dim mt-0.5">Arcana Analysis Engine v3.7</div>
            <div className="lsd-mono text-[7px] lsd-dim mt-0.5">SEQ 4471 · CAL ±0.003 · REV K</div>
          </div>
        </div>

        <div className="text-center lg:col-span-6">
          <div className="lsd-caps text-[7.5px] lsd-dim">— Current Reading —</div>
          <h1 className="lsd-serif lsd-glow text-[24px] sm:text-[30px] leading-tight tracking-[0.34em] lsd-hi pl-[0.34em]">
            SILVER DEPTHS
          </h1>
          <div className="lsd-caps text-[8px] lsd-mid mt-0.5">The Moon pulls, the veil thins</div>
        </div>

        <div className="lg:col-span-3 lg:text-right">
          <div className="lsd-mono text-[10px] lsd-hi">MAY 18, 2025 · 11:47 PM</div>
          <div className="lsd-mono text-[8px] lsd-dim mt-0.5">LAT 40.7128° N — LON 74.0060° W</div>
          <div className="lsd-mono text-[8px] lsd-dim mt-0.5">
            ☽︎ +87 · ♆︎ +55 · ♇︎ +64 · Δλ 0.042
          </div>
        </div>
      </header>

      {/* ========================= NAV / COMMAND STRIP ========================= */}
      <nav className="lsd-panel mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 px-3 py-1.5">
        <a href="/" className="flex items-center gap-2">
          <span className="lsd-hi text-[11px]">◈</span>
          <span className="lsd-caps lsd-serif text-[10.5px] lsd-hi tracking-[0.28em]">Astro Scope</span>
        </a>
        <span className="lsd-mono text-[7px] lsd-dim hidden md:inline">OBS·DECK 01</span>
        <span className="lsd-hair hidden md:block w-10" />
        <div className="flex items-center gap-4 text-[8.5px] lsd-caps lsd-mid">
          <a href="/horoscope" className="lsd-link">Horoscopes</a>
          <a href="/tarot" className="lsd-link">Tarot</a>
          <a href="/compatibility" className="lsd-link">Compatibility</a>
        </div>
        <span className="flex-1" />
        <a href="/sign-in" className="lsd-caps text-[8.5px] lsd-mid lsd-link">Sign In</a>
        <a href="/birth-chart" className="lsd-btn lsd-caps text-[8.5px] px-3 py-1">
          Cast your free birth chart →
        </a>
      </nav>

      {/* ========================= INSTRUMENT GRID ========================= */}
      <section className="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-12">
        {/* ------------------------- LEFT COLUMN ------------------------- */}
        <div className="flex flex-col gap-2 lg:col-span-3">
          {/* LUNAR STATUS */}
          <div className="lsd-panel">
            <PHead title="Lunar Status" right="PL·01" />
            <div className="grid grid-cols-[96px_1fr] items-center gap-2 px-3 pb-2">
              <svg width="96" height="96" viewBox="0 0 96 96" aria-label="Waning gibbous moon">
                <circle cx="48" cy="48" r="36" fill="url(#lsd-moon)" />
                {/* maria */}
                <g fill="#3c4c6a" opacity="0.55">
                  <ellipse cx="38" cy="36" rx="11" ry="8" transform="rotate(-18 38 36)" />
                  <ellipse cx="52" cy="48" rx="7" ry="11" transform="rotate(12 52 48)" />
                  <ellipse cx="36" cy="58" rx="6" ry="4.5" />
                  <ellipse cx="50" cy="28" rx="5" ry="4" />
                </g>
                <g fill="none" stroke="#4a5c78" strokeWidth="0.5" opacity="0.6">
                  <circle cx="42" cy="44" r="2.4" />
                  <circle cx="56" cy="38" r="1.6" />
                  <circle cx="34" cy="50" r="1.8" />
                </g>
                {/* waning terminator: dark bite from the right */}
                <ellipse cx="82" cy="48" rx="34" ry="37" fill={INK} opacity="0.9" />
                <ellipse cx="74" cy="48" rx="34" ry="37" fill={INK} opacity="0.28" />
                <circle cx="48" cy="48" r="36" fill="none" stroke={STEEL} strokeWidth="0.7" opacity="0.9" />
                <circle cx="48" cy="48" r="41" fill="none" stroke={STEEL} strokeWidth="0.4" strokeDasharray="1 3" opacity="0.6" className="lsd-rot-b" />
              </svg>
              <div>
                <div className="lsd-caps text-[8px] lsd-mid">Waning Gibbous</div>
                <div className="mt-1.5">
                  <div className="lsd-caps text-[7px] lsd-dim">Illumination</div>
                  <div className="lsd-serif text-[17px] lsd-hi leading-none">68.2<span className="text-[10px]">%</span></div>
                </div>
                <div className="mt-1.5">
                  <div className="lsd-caps text-[7px] lsd-dim">Age</div>
                  <div className="lsd-serif text-[15px] lsd-hi leading-none">20.6 <span className="text-[9px]">days</span></div>
                </div>
                <div className="lsd-mono text-[6.5px] lsd-dim mt-1.5">DIST 384,402 KM · −1.2%/D</div>
              </div>
            </div>
            <div className="lsd-hair mx-3" />
            <div className="flex justify-between px-3 py-1 lsd-mono text-[6.5px] lsd-dim">
              <span>SEL·LON 6.2° W</span>
              <span>COLONG 41.8</span>
              <span>LIB +4.7°</span>
            </div>
          </div>

          {/* MOON SIGN */}
          <div className="lsd-panel" style={{ transform: "rotate(-0.4deg)" }}>
            <PHead title="Moon Sign" right="PL·02" />
            <div className="flex items-center gap-3 px-3 pb-2">
              <div className="lsd-serif text-[34px] lsd-hi leading-none lsd-glow">♏︎</div>
              <div>
                <div className="lsd-caps lsd-serif text-[13px] lsd-hi tracking-[0.24em]">Scorpio</div>
                <div className="lsd-caps text-[7.5px] lsd-mid mt-0.5">Intense · Intuitive · Transformative</div>
                <div className="lsd-mono text-[7.5px] lsd-dim mt-1">Ruling Planet: Pluto ♇︎</div>
              </div>
            </div>
            <div className="flex justify-between border-t border-[rgba(125,148,184,0.18)] px-3 py-1 lsd-mono text-[6.5px] lsd-dim">
              <span>8TH HOUSE</span>
              <span>FIXED · WATER</span>
              <span>217°24′</span>
            </div>
          </div>

          {/* ELEMENTAL CURRENT */}
          <div className="lsd-panel" style={{ transform: "rotate(0.5deg)" }}>
            <PHead title="Elemental Current" right="Σ 100" />
            <div className="grid grid-cols-4 gap-1 px-3 pb-1.5">
              {ELEMENTS.map(([name, v, dir, bar]) => (
                <div key={name} className="flex flex-col items-center gap-0.5 border border-[rgba(125,148,184,0.14)] py-1.5">
                  <TriGlyph dir={dir} bar={bar} lit={name === "Water"} />
                  <span className="lsd-caps text-[6.5px] lsd-dim">{name}</span>
                  <span className={`lsd-mono text-[9px] ${name === "Water" ? "lsd-hi" : "lsd-mid"}`}>{v}%</span>
                </div>
              ))}
            </div>
            <div className="flex h-[5px] mx-3 mb-1.5 overflow-hidden">
              {ELEMENTS.map(([name, v]) => (
                <span
                  key={name}
                  style={{ width: `${v}%` }}
                  className={name === "Water" ? "lsd-fill" : "bg-[rgba(125,148,184,0.28)]"}
                />
              ))}
            </div>
            <div className="px-3 pb-2 lsd-mono text-[6.5px] lsd-dim">AQ DOMINANT · Δ +4 · TIDE-COUPLED</div>
          </div>

          {/* PLANETARY INFLUENCES */}
          <div className="lsd-panel flex-1">
            <PHead title="Planetary Influences" right="μ = +33.8" />
            <div className="flex flex-col gap-1.5 px-3 pb-2.5 pt-1">
              {INFLUENCES.map(([name, val, v]) => (
                <div key={name} className="grid grid-cols-[86px_1fr_26px] items-center gap-2">
                  <span className="lsd-mono text-[8px] lsd-mid">{name}</span>
                  <span className="relative h-[8px]">
                    <span className="absolute inset-y-0 left-1/2 w-px bg-[rgba(200,214,236,0.35)]" />
                    <span className="lsd-track absolute inset-y-[3px] inset-x-0 opacity-60" />
                    <span
                      className="lsd-fill absolute top-[2px] h-[4px]"
                      style={
                        v >= 0
                          ? { left: "50%", width: `${v * 0.45}%` }
                          : { right: "50%", width: `${-v * 0.45}%`, background: DIM, boxShadow: "none" }
                      }
                    />
                    <span
                      className="absolute top-[1px] h-[6px] w-[6px] rotate-45 border border-[#c8d6ec] bg-[#0a1120]"
                      style={v >= 0 ? { left: `calc(50% + ${v * 0.45}% - 3px)` } : { right: `calc(50% + ${-v * 0.45}% - 3px)` }}
                    />
                  </span>
                  <span className={`lsd-mono text-[8px] text-right ${v >= 0 ? "lsd-hi" : "lsd-dim"}`}>{val}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[rgba(125,148,184,0.18)] px-3 py-1 lsd-mono text-[6.5px] lsd-dim">
              NET PULL +0.87g<sub>0</sub> · ASPECT WT 0.62 · FIG. 04
            </div>
          </div>
        </div>

        {/* ------------------------- CENTER: TIDE FORCE MAP ------------------------- */}
        <div className="lsd-panel relative z-10 overflow-hidden lg:col-span-6 lg:-mx-3" style={{ transform: "rotate(0.25deg)" }}>
          <PHead title="Tide Force Map" right="PROJ STEREOGRAPHIC · GRID 5°" />
          <div className="relative mx-auto w-full max-w-[640px]">
            <svg viewBox="0 0 640 640" className="block w-full" role="img" aria-label="Tide force map: moon with orbiting nodes on concentric rings">
              <rect x="0" y="0" width="640" height="640" fill="none" />
              {/* halo */}
              <circle cx="320" cy="320" r="180" fill="url(#lsd-halo)" className="lsd-pulse" />

              {/* outer tick rings */}
              <circle cx="320" cy="320" r="288" fill="none" stroke={STEEL} strokeWidth="0.5" opacity="0.55" />
              <circle cx="320" cy="320" r="300" fill="none" stroke={STEEL} strokeWidth="0.4" opacity="0.3" />
              {ticks72.map((t, i) => (
                <line
                  key={i}
                  x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                  stroke={t.major ? SILVER : STEEL}
                  strokeWidth={t.major ? 0.9 : 0.45}
                  opacity={t.major ? 0.85 : 0.5}
                />
              ))}
              <circle cx="320" cy="320" r="252" fill="none" stroke={STEEL} strokeWidth="0.4" strokeDasharray="1 4" opacity="0.5" />
              {ticks36.map((t, i) => (
                <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={STEEL} strokeWidth="0.5" opacity="0.45" />
              ))}

              {/* degree labels */}
              {[
                { d: 0, s: "000°" }, { d: 45, s: "045°" }, { d: 90, s: "090°" }, { d: 135, s: "135°" },
                { d: 180, s: "180°" }, { d: 225, s: "225°" }, { d: 270, s: "270°" }, { d: 315, s: "315°" },
              ].map(({ d, s }) => {
                const p = onCircle(320, 320, 314, d);
                return (
                  <text key={s} x={p.x} y={p.y + 2} textAnchor="middle" fontSize="7" fill={DIM} letterSpacing="1">
                    {s}
                  </text>
                );
              })}

              {/* radial spokes */}
              {Array.from({ length: 12 }, (_, k) => {
                const a = onCircle(320, 320, 96, k * 30);
                const b = onCircle(320, 320, 288, k * 30);
                return <line key={k} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={STEEL} strokeWidth="0.35" opacity={k % 3 === 0 ? 0.5 : 0.22} />;
              })}

              {/* orbit rings */}
              <circle cx="320" cy="320" r="112" fill="none" stroke={STEEL} strokeWidth="0.6" opacity="0.6" />
              <circle cx="320" cy="320" r="168" fill="none" stroke={STEEL} strokeWidth="0.5" opacity="0.5" />
              <circle cx="320" cy="320" r="224" fill="none" stroke={STEEL} strokeWidth="0.6" opacity="0.6" />

              {/* slow counter-rotating marker rings */}
              <g className="lsd-rot-a">
                <circle cx="320" cy="320" r="140" fill="none" stroke={SILVER} strokeWidth="0.5" strokeDasharray="2 6" opacity="0.6" />
                {[0, 90, 180, 270].map((d) => {
                  const p = onCircle(320, 320, 140, d);
                  return <rect key={d} x={p.x - 2.5} y={p.y - 2.5} width="5" height="5" transform={`rotate(45 ${p.x} ${p.y})`} fill={INK} stroke={SILVER} strokeWidth="0.6" />;
                })}
              </g>
              <g className="lsd-rot-b">
                <circle cx="320" cy="320" r="196" fill="none" stroke={STEEL} strokeWidth="0.5" strokeDasharray="10 5" opacity="0.45" />
                {[30, 150, 270].map((d) => {
                  const p = onCircle(320, 320, 196, d);
                  return <circle key={d} cx={p.x} cy={p.y} r="2" fill={SILVER} opacity="0.8" />;
                })}
              </g>

              {/* moonlets on rings */}
              {moonlets.map(([r, ang, ph], i) => {
                const p = onCircle(320, 320, r, ang);
                return (
                  <g key={i}>
                    <line x1="320" y1="320" x2={p.x} y2={p.y} stroke={STEEL} strokeWidth="0.3" opacity="0.25" />
                    <circle cx={p.x} cy={p.y} r="12" fill="url(#lsd-moon)" />
                    <ellipse cx={p.x + ph * 12} cy={p.y} rx="12" ry="12.2" fill={INK} opacity="0.85" />
                    <circle cx={p.x} cy={p.y} r="12" fill="none" stroke={SILVER} strokeWidth="0.6" opacity="0.85" />
                    <circle cx={p.x} cy={p.y} r="16" fill="none" stroke={STEEL} strokeWidth="0.4" strokeDasharray="1.5 2.5" opacity="0.6" />
                    <text x={p.x} y={p.y - 20} textAnchor="middle" fontSize="6" fill={DIM} letterSpacing="1">
                      N·{String(i + 1).padStart(2, "0")}
                    </text>
                  </g>
                );
              })}

              {/* central moon */}
              <g>
                <circle cx="320" cy="320" r="64" fill="url(#lsd-moon-big)" />
                <g fill="#3c4c6a" opacity="0.5">
                  <ellipse cx="298" cy="300" rx="18" ry="13" transform="rotate(-18 298 300)" />
                  <ellipse cx="332" cy="326" rx="12" ry="18" transform="rotate(14 332 326)" />
                  <ellipse cx="300" cy="344" rx="10" ry="7" />
                  <ellipse cx="330" cy="288" rx="8" ry="6" />
                  <ellipse cx="346" cy="308" rx="5" ry="8" transform="rotate(-24 346 308)" />
                </g>
                <g fill="none" stroke="#4a5c78" strokeWidth="0.6" opacity="0.55">
                  <circle cx="312" cy="316" r="4" />
                  <circle cx="338" cy="300" r="2.6" />
                  <circle cx="296" cy="330" r="3" />
                  <circle cx="322" cy="346" r="2" />
                </g>
                <ellipse cx="364" cy="320" rx="52" ry="60" fill={INK} opacity="0.82" />
                <ellipse cx="356" cy="320" rx="52" ry="60" fill={INK} opacity="0.25" />
                <circle cx="320" cy="320" r="64" fill="none" stroke={SILVER} strokeWidth="0.8" opacity="0.9" />
                <circle cx="320" cy="320" r="72" fill="none" stroke={STEEL} strokeWidth="0.4" strokeDasharray="2 4" opacity="0.7" className="lsd-rot-c" />
              </g>

              {/* crosshair */}
              <line x1="320" y1="8" x2="320" y2="34" stroke={SILVER} strokeWidth="0.7" opacity="0.7" />
              <line x1="320" y1="606" x2="320" y2="632" stroke={SILVER} strokeWidth="0.7" opacity="0.7" />
              <line x1="8" y1="320" x2="34" y2="320" stroke={SILVER} strokeWidth="0.7" opacity="0.7" />
              <line x1="606" y1="320" x2="632" y2="320" stroke={SILVER} strokeWidth="0.7" opacity="0.7" />

              {/* corner formulas */}
              <text x="18" y="24" fontSize="7" fill={DIM} letterSpacing="1">F = G·m₁·m₂ / r²</text>
              <text x="18" y="34" fontSize="7" fill={DIM} letterSpacing="1">T = 12h 25m · sin(ωt + φ)</text>
              <text x="622" y="24" textAnchor="end" fontSize="7" fill={DIM} letterSpacing="1">λ = 584 NM</text>
              <text x="622" y="34" textAnchor="end" fontSize="7" fill={DIM} letterSpacing="1">ψ 217°24′ SCO</text>
              <text x="18" y="622" fontSize="7" fill={DIM} letterSpacing="1">NODE N·05 LOCKED</text>
              <text x="622" y="622" textAnchor="end" fontSize="7" fill={DIM} letterSpacing="1">DRIFT ±0.003°/H</text>
            </svg>

            {/* overlay readouts */}
            <div className="absolute left-[4%] top-[16%] hidden md:block">
              <div className="lsd-caps text-[7px] lsd-dim">High Tide</div>
              <div className="lsd-serif text-[13px] lsd-hi">02:14 AM</div>
              <div className="lsd-mono text-[8px] lsd-mid">+1.73 m</div>
              <svg width="34" height="10" viewBox="0 0 34 10" className="mt-0.5" aria-hidden="true">
                <path d="M1 6 Q5 2 9 6 T17 6 T25 6 T33 6" fill="none" stroke={STEEL} strokeWidth="0.8" />
              </svg>
            </div>
            <div className="absolute right-[4%] top-[16%] hidden text-right md:block">
              <div className="lsd-caps text-[7px] lsd-dim">Low Tide</div>
              <div className="lsd-serif text-[13px] lsd-hi">08:47 AM</div>
              <div className="lsd-mono text-[8px] lsd-mid">−0.92 m</div>
              <svg width="34" height="10" viewBox="0 0 34 10" className="mt-0.5 ml-auto" aria-hidden="true">
                <path d="M1 4 Q5 8 9 4 T17 4 T25 4 T33 4" fill="none" stroke={STEEL} strokeWidth="0.8" />
              </svg>
            </div>

            {/* water depth gauge */}
            <div className="absolute bottom-[12%] left-[3%] hidden items-end gap-1.5 md:flex">
              <svg width="14" height="64" viewBox="0 0 14 64" aria-hidden="true">
                <rect x="5" y="2" width="4" height="60" fill="none" stroke={STEEL} strokeWidth="0.6" />
                <rect x="5" y={62 - 56 * 0.87} width="4" height={56 * 0.87} fill="url(#lsd-fillg)" opacity="0.9" />
                {Array.from({ length: 9 }, (_, k) => (
                  <line key={k} x1="9" y1={6 + k * 6.5} x2="13" y2={6 + k * 6.5} stroke={STEEL} strokeWidth="0.5" opacity="0.7" />
                ))}
              </svg>
              <div>
                <div className="lsd-caps text-[6.5px] lsd-dim">Water Depth</div>
                <div className="lsd-serif text-[16px] lsd-hi leading-none">87<span className="text-[9px]"> m</span></div>
                <div className="lsd-caps text-[6px] lsd-dim mt-0.5">Abyssal</div>
              </div>
            </div>

            {/* gravity pull gauge */}
            <div className="absolute bottom-[12%] right-[3%] hidden text-right md:block">
              <div className="lsd-caps text-[6.5px] lsd-dim">Gravity Pull</div>
              <div className="lsd-serif text-[16px] lsd-hi leading-none">1.18<span className="text-[9px]">×</span></div>
              <div className="lsd-caps text-[6px] lsd-dim mt-0.5">Normal ×1.00</div>
              <div className="lsd-track relative mt-1 h-[3px] w-[72px] ml-auto">
                <span className="lsd-fill absolute inset-y-0 left-0" style={{ width: "59%" }} />
                <span className="absolute inset-y-[-2px] left-1/2 w-px bg-[rgba(200,214,236,0.6)]" />
              </div>
            </div>

            {/* tidal alignment */}
            <div className="absolute bottom-[3%] left-1/2 -translate-x-1/2 text-center">
              <div className="lsd-caps text-[7px] lsd-dim">— Tidal Alignment —</div>
              <div className="lsd-serif lsd-glow text-[22px] lsd-hi leading-tight">72%</div>
              <div className="lsd-caps text-[7.5px] lsd-mid">Strong Pull</div>
            </div>
          </div>
          <div className="flex justify-between border-t border-[rgba(125,148,184,0.18)] px-3 py-1 lsd-mono text-[6.5px] lsd-dim">
            <span>FIG. 01 — ORBITAL RESONANCE SURVEY</span>
            <span className="hidden sm:inline">ω = 2π / 29.53d</span>
            <span>SAMPLE 11:47:22 PM</span>
          </div>
        </div>

        {/* ------------------------- RIGHT COLUMN ------------------------- */}
        <div className="flex flex-col gap-2 lg:col-span-3">
          {/* TIDAL FORECAST */}
          <div className="lsd-panel">
            <PHead title="Tidal Forecast" right="24H" />
            <div className="px-2 pb-1">
              <svg viewBox="0 0 320 96" className="relative -left-4 block w-[calc(100%+32px)] max-w-none" role="img" aria-label="Tidal forecast sine chart">
                {/* phase dots */}
                {PHASE_CYCLE.map((p, i) => {
                  const x = 40 + i * 42;
                  return (
                    <g key={p.d}>
                      <circle cx={x} cy={9} r="4" fill="#aebfd9" />
                      <ellipse cx={x + p.k * 4} cy={9} rx="4" ry="4.1" fill={INK} opacity="0.9" />
                      <circle cx={x} cy={9} r="4" fill="none" stroke={STEEL} strokeWidth="0.4" />
                    </g>
                  );
                })}
                {/* grid */}
                {[0, 1, 2, 3, 4].map((k) => (
                  <line key={k} x1="34" y1={26 + k * 16} x2="292" y2={26 + k * 16} stroke={STEEL} strokeWidth="0.35" opacity={k === 2 ? 0.6 : 0.25} strokeDasharray={k === 2 ? "none" : "2 3"} />
                ))}
                {["2.0m", "1.0m", "0", "-1.0", "-2.0"].map((s, k) => (
                  <text key={s} x="30" y={29 + k * 16} textAnchor="end" fontSize="6" fill={DIM}>{s}</text>
                ))}
                {Array.from({ length: 25 }, (_, k) => (
                  <line key={k} x1={34 + k * 10.75} y1="90" x2={34 + k * 10.75} y2={k % 6 === 0 ? 85 : 88} stroke={STEEL} strokeWidth="0.4" opacity="0.6" />
                ))}
                {/* mean-sea-level hairline running edge to edge, over the panel rules */}
                <line x1="-6" y1="52" x2="326" y2="52" stroke={SILVER} strokeWidth="0.4" opacity="0.35" />
                {/* curves */}
                <path d={forecastSoft} fill="none" stroke={STEEL} strokeWidth="0.5" opacity="0.35" transform="translate(0,-14)" />
                <path d={forecast} fill="none" stroke={SILVER} strokeWidth="0.9" opacity="0.95" transform="translate(0,-14)" className="lsd-dash" strokeDasharray="3 2" />
                {/* now marker at 23:47 */}
                <line x1="289" y1="22" x2="289" y2="90" stroke={SILVER} strokeWidth="0.5" opacity="0.6" strokeDasharray="1 2" />
                <circle cx="289" cy="26" r="2.4" fill={SILVER} className="lsd-pulse" />
                <text x="285" y="20" textAnchor="end" fontSize="6" fill={SILVER}>NOW</text>
                {["00:00", "06:00", "12:00", "18:00", "24:00"].map((s, k) => (
                  <text key={s} x={34 + k * 64.5} y="96" textAnchor="middle" fontSize="6" fill={DIM}>{s}</text>
                ))}
              </svg>
            </div>
            <div className="flex justify-between px-3 pb-1.5 lsd-mono text-[6.5px] lsd-dim">
              <span>AMP 1.73M MAX</span>
              <span>PERIOD 12H25M</span>
              <span>PHASE LAG 38′</span>
            </div>
          </div>

          {/* MOON PHASE CYCLE */}
          <div className="lsd-panel">
            <PHead title="Moon Phase Cycle" right="29.53D" />
            <div className="flex items-end justify-between px-3 pb-1.5 pt-0.5">
              {PHASE_CYCLE.map((p) => (
                <div key={p.d} className="flex flex-col items-center gap-1">
                  <PhaseDisc k={p.k} r={8} active={p.on} />
                  <span className={`lsd-mono text-[6px] ${p.on ? "lsd-hi" : "lsd-dim"}`}>{p.d}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[rgba(125,148,184,0.18)] px-3 py-1 lsd-mono text-[6.5px] lsd-dim">
              NEXT NEW MOON JUN 14 · 04:12 UTC
            </div>
          </div>

          {/* RITUAL WINDOW */}
          <div className="lsd-panel" style={{ transform: "rotate(0.55deg)" }}>
            <PHead title="Ritual Window" right="TONIGHT" />
            <div className="grid grid-cols-[1fr_64px] items-center gap-2 px-3 pb-2">
              <div>
                <div className="lsd-caps text-[6.5px] lsd-dim">Best Window · Tonight</div>
                <div className="lsd-serif lsd-glow text-[16px] lsd-hi leading-tight">
                  11:23<span className="text-[9px]">PM</span> – 01:48<span className="text-[9px]">AM</span>
                </div>
                <div className="lsd-caps text-[7px] lsd-mid mt-1">Intention: Release + Divination</div>
                <div className="lsd-mono text-[6.5px] lsd-dim mt-1">WATER · MOON → SHADOW · 2H25M SPAN</div>
              </div>
              <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true" className="lsd-rot-b">
                <circle cx="32" cy="32" r="28" fill="none" stroke={STEEL} strokeWidth="0.6" />
                <circle cx="32" cy="32" r="22" fill="none" stroke={STEEL} strokeWidth="0.4" strokeDasharray="2 3" />
                <polygon points="32,12 49,42 15,42" fill="none" stroke={SILVER} strokeWidth="0.7" />
                <polygon points="32,52 15,22 49,22" fill="none" stroke={SILVER} strokeWidth="0.7" opacity="0.7" />
                <circle cx="32" cy="32" r="3" fill={SILVER} />
                <path d="M37 24 a9 9 0 1 0 0 16 a7 7 0 1 1 0 -16 Z" fill={INK} stroke={SILVER} strokeWidth="0.5" />
              </svg>
            </div>
          </div>

          {/* TIDE QUALITY */}
          <div className="lsd-panel relative z-10 -mt-4 flex-1" style={{ transform: "rotate(-0.45deg)" }}>
            <PHead title="Tide Quality" right="IDX 85" />
            <div className="grid grid-cols-[72px_1fr] gap-2 px-3 pb-2.5">
              <div className="flex flex-col items-center">
                <svg width="68" height="68" viewBox="0 0 68 68" aria-hidden="true">
                  <circle cx="34" cy="34" r="29" fill="none" stroke={DIM} strokeWidth="1" opacity="0.5" />
                  <circle
                    cx="34" cy="34" r="29" fill="none" stroke={SILVER} strokeWidth="2"
                    strokeDasharray={`${0.85 * 182.2} 182.2`} strokeLinecap="round"
                    transform="rotate(-90 34 34)" className="lsd-pulse"
                  />
                  {ringTicks(34, 34, 24, 26, 24, 6).map((t, i) => (
                    <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={STEEL} strokeWidth="0.5" opacity="0.6" />
                  ))}
                  <text x="34" y="39" textAnchor="middle" fontSize="20" fill={SILVER} fontFamily="Georgia, serif">A</text>
                </svg>
                <div className="lsd-caps text-[6.5px] lsd-hi">Exceptional</div>
                <div className="lsd-mono text-[7px] lsd-dim">85 / 100</div>
              </div>
              <div className="flex flex-col justify-center gap-[7px]">
                {QUALITY.map(([label, v]) => (
                  <GaugeRow key={label} label={label} value={v} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== BOTTOM INSTRUMENT ROW ======================== */}
      <section className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-12">
        {/* CELESTIAL ALIGNMENT */}
        <div className="lsd-panel lg:col-span-3">
          <PHead title="Celestial Alignment" right="TRINE 120°" />
          <div className="px-3 pb-1">
            <svg viewBox="0 0 260 150" className="block w-full" role="img" aria-label="Grand water trine diagram">
              <circle cx="130" cy="80" r="62" fill="none" stroke={STEEL} strokeWidth="0.4" strokeDasharray="2 4" opacity="0.7" />
              <circle cx="130" cy="80" r="74" fill="none" stroke={STEEL} strokeWidth="0.35" opacity="0.35" />
              <polygon points="130,24 78.4,116 181.6,116" fill="rgba(125,148,184,0.06)" stroke={SILVER} strokeWidth="0.7" opacity="0.95" />
              {([
                [130, 24, "☽︎", "Cancer ♋︎"],
                [78.4, 116, "♇︎", "Scorpio ♏︎"],
                [181.6, 116, "♆︎", "Pisces ♓︎"],
              ] as Array<[number, number, string, string]>).map(([x, y, g, lbl]) => (
                <g key={lbl}>
                  <circle cx={x} cy={y} r="13" fill="url(#lsd-moon)" opacity="0.95" />
                  <circle cx={x} cy={y} r="13" fill="none" stroke={SILVER} strokeWidth="0.6" />
                  <circle cx={x} cy={y} r="17" fill="none" stroke={STEEL} strokeWidth="0.4" strokeDasharray="1.5 2.5" className="lsd-rot-c" />
                  <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fill={INK}>{g}</text>
                  <text x={x} y={y + 30} textAnchor="middle" fontSize="6" fill={DIM} letterSpacing="1">{lbl.toUpperCase()}</text>
                </g>
              ))}
              <text x="130" y="84" textAnchor="middle" fontSize="6.5" fill={STEEL} letterSpacing="2">H₂O</text>
            </svg>
          </div>
          <div className="flex items-center justify-between border-t border-[rgba(125,148,184,0.18)] px-3 py-1.5">
            <div>
              <div className="lsd-caps text-[7.5px] lsd-hi">Grand Water Trine</div>
              <div className="lsd-mono text-[6.5px] lsd-dim">ORB &lt; 2.1° · ACTIVE</div>
            </div>
            <div className="lsd-serif text-[13px] lsd-mid">☽︎ ♆︎ ♇︎</div>
          </div>
        </div>

        {/* ARCANE CORRELATIONS */}
        <div className="lsd-panel relative z-10 lg:col-span-4 lg:-ml-4" style={{ transform: "rotate(0.35deg)" }}>
          <PHead title="Arcane Correlations" right="DECK R·W·1909" />
          <div className="grid grid-cols-4 gap-1.5 px-3 pb-2.5 pt-0.5">
            {/* High Priestess */}
            <div className="lsd-card">
              <svg viewBox="0 0 60 78" className="w-full" aria-hidden="true">
                <rect x="3" y="3" width="54" height="72" fill="none" stroke={STEEL} strokeWidth="0.5" opacity="0.6" />
                <path d="M36 10 a10 10 0 1 0 0 18 a7.8 7.8 0 1 1 0 -18 Z" fill={SILVER} opacity="0.9" />
                <rect x="12" y="26" width="5" height="38" fill="none" stroke={SILVER} strokeWidth="0.7" />
                <rect x="43" y="26" width="5" height="38" fill="none" stroke={SILVER} strokeWidth="0.7" />
                <path d="M17 30 Q30 22 43 30 M17 60 Q30 52 43 60" fill="none" stroke={STEEL} strokeWidth="0.5" />
                <rect x="25" y="40" width="10" height="14" fill="none" stroke={STEEL} strokeWidth="0.6" />
                <line x1="30" y1="40" x2="30" y2="54" stroke={STEEL} strokeWidth="0.4" />
                <text x="30" y="72" textAnchor="middle" fontSize="6" fill={DIM}>II</text>
              </svg>
              <div className="lsd-caps text-[6px] lsd-hi mt-1">The High Priestess</div>
              <div className="lsd-mono text-[5.5px] lsd-dim">Secrets · Wisdom · Inner Knowing</div>
            </div>
            {/* The Moon */}
            <div className="lsd-card">
              <svg viewBox="0 0 60 78" className="w-full" aria-hidden="true">
                <rect x="3" y="3" width="54" height="72" fill="none" stroke={STEEL} strokeWidth="0.5" opacity="0.6" />
                <circle cx="30" cy="17" r="9" fill="url(#lsd-moon)" />
                <ellipse cx="23" cy="15" rx="3.5" ry="2.6" fill="#3c4c6a" opacity="0.6" />
                <circle cx="30" cy="17" r="9" fill="none" stroke={SILVER} strokeWidth="0.6" />
                <rect x="9" y="42" width="6" height="24" fill="none" stroke={STEEL} strokeWidth="0.6" />
                <rect x="45" y="42" width="6" height="24" fill="none" stroke={STEEL} strokeWidth="0.6" />
                <path d="M15 66 Q30 56 45 66" fill="none" stroke={STEEL} strokeWidth="0.5" />
                <path d="M27 66 Q30 48 30 34" fill="none" stroke={SILVER} strokeWidth="0.5" strokeDasharray="2 2" />
                <text x="30" y="74" textAnchor="middle" fontSize="5.5" fill={DIM}>XVIII</text>
              </svg>
              <div className="lsd-caps text-[6px] lsd-hi mt-1">The Moon</div>
              <div className="lsd-mono text-[5.5px] lsd-dim">Illusion · Dreams · Subconscious</div>
            </div>
            {/* The Star */}
            <div className="lsd-card">
              <svg viewBox="0 0 60 78" className="w-full" aria-hidden="true">
                <rect x="3" y="3" width="54" height="72" fill="none" stroke={STEEL} strokeWidth="0.5" opacity="0.6" />
                <polygon
                  points="30,8 32.4,22.6 46,19 35.4,28.4 44,40 30.8,33.6 24,45 25.4,31 12,28 25.8,24.4"
                  fill="none" stroke={SILVER} strokeWidth="0.7"
                />
                <circle cx="30" cy="28" r="2" fill={SILVER} className="lsd-pulse" />
                {[[12, 52], [22, 58], [38, 55], [48, 50]].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="1" fill={STEEL} />
                ))}
                <path d="M8 66 Q15 62 22 66 T36 66 T50 66" fill="none" stroke={STEEL} strokeWidth="0.5" />
                <text x="30" y="74" textAnchor="middle" fontSize="5.5" fill={DIM}>XVII</text>
              </svg>
              <div className="lsd-caps text-[6px] lsd-hi mt-1">The Star</div>
              <div className="lsd-mono text-[5.5px] lsd-dim">Hope · Renewal · Guidance</div>
            </div>
            {/* Ace of Cups */}
            <div className="lsd-card">
              <svg viewBox="0 0 60 78" className="w-full" aria-hidden="true">
                <rect x="3" y="3" width="54" height="72" fill="none" stroke={STEEL} strokeWidth="0.5" opacity="0.6" />
                <path d="M19 30 h22 v6 a11 11 0 0 1 -22 0 Z" fill="none" stroke={SILVER} strokeWidth="0.8" />
                <line x1="30" y1="47" x2="30" y2="58" stroke={SILVER} strokeWidth="0.8" />
                <path d="M21 60 h18" stroke={SILVER} strokeWidth="0.8" />
                <path d="M24 24 q2 -4 0 -7 M30 22 q2 -4 0 -7 M36 24 q2 -4 0 -7" fill="none" stroke={STEEL} strokeWidth="0.6" />
                <circle cx="30" cy="12" r="1.4" fill={SILVER} className="lsd-pulse" />
                <text x="30" y="72" textAnchor="middle" fontSize="6" fill={DIM}>ACE</text>
              </svg>
              <div className="lsd-caps text-[6px] lsd-hi mt-1">Ace of Cups</div>
              <div className="lsd-mono text-[5.5px] lsd-dim">Overflow · Love · Intuition</div>
            </div>
          </div>
        </div>

        {/* TIDE HARMONICS */}
        <div className="lsd-panel lg:col-span-2" style={{ transform: "rotate(-0.5deg)" }}>
          <PHead title="Tide Harmonics" right="HZ" />
          <div className="flex items-center gap-2 px-3 pb-2">
            <svg width="92" height="92" viewBox="0 0 92 92" aria-hidden="true" className="shrink-0">
              {[16, 27, 38].map((r) => (
                <circle key={r} cx="46" cy="46" r={r} fill="none" stroke={STEEL} strokeWidth="0.35" opacity="0.5" />
              ))}
              {HARMONICS.map((h, k) => {
                const p = onCircle(46, 46, h.r * 0.62, k * 72);
                const e = onCircle(46, 46, 42, k * 72);
                return (
                  <g key={h.hz}>
                    <line x1="46" y1="46" x2={e.x} y2={e.y} stroke={STEEL} strokeWidth="0.3" opacity="0.5" />
                    <circle cx={p.x} cy={p.y} r="2.2" fill={SILVER} className={k === 0 ? "lsd-pulse" : undefined} />
                    <circle cx={p.x} cy={p.y} r="4.5" fill="none" stroke={STEEL} strokeWidth="0.4" opacity="0.6" />
                  </g>
                );
              })}
              <circle cx="46" cy="46" r="1.6" fill={SILVER} />
              <circle cx="46" cy="46" r="44" fill="none" stroke={STEEL} strokeWidth="0.4" strokeDasharray="1 3" className="lsd-rot-a" />
            </svg>
            <div className="flex flex-col gap-[3px]">
              {HARMONICS.map((h) => (
                <div key={h.hz} className="flex items-baseline gap-1.5">
                  <span className="lsd-mono text-[8px] lsd-hi w-[26px]">{h.hz}</span>
                  <span className="lsd-mono text-[5.5px] lsd-dim">Hz</span>
                  <span className="lsd-caps text-[5.5px] lsd-dim">{h.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-[rgba(125,148,184,0.18)] px-3 py-1 lsd-mono text-[6px] lsd-dim">
            FUND 0.78 Hz · Q-FACTOR 12.4
          </div>
        </div>

        {/* INSIGHT STREAM */}
        <div className="lsd-panel lg:col-span-3">
          <PHead title="Insight Stream" right="AUTO·SCRIBE" />
          <div className="grid grid-cols-[1fr_74px] gap-2 px-3 pb-2">
            <div>
              <p className="lsd-serif text-[10.5px] leading-[1.5] lsd-mid italic">
                The tides whisper of endings that are also beginnings. Release what no longer serves,
                and trust the current to carry your intentions beyond the veil.
              </p>
              <div className="lsd-caps lsd-serif mt-2 text-[9px] lsd-hi tracking-[0.3em] lsd-glow">
                — Trust the flow
              </div>
              <div className="lsd-mono mt-1 text-[6px] lsd-dim">
                CONF 0.94 · SRC LUNAR/SCORPIO · <span className="lsd-blink">▮</span>
              </div>
            </div>
            <svg width="74" height="86" viewBox="0 0 74 86" aria-hidden="true">
              <path d="M48 10 a26 26 0 1 0 0 52 a20 20 0 1 1 0 -52 Z" fill="none" stroke={SILVER} strokeWidth="0.8" className="lsd-pulse" />
              <path d="M6 70 Q14 64 22 70 T38 70 T54 70 T70 70" fill="none" stroke={STEEL} strokeWidth="0.5" />
              <path d="M6 78 Q14 72 22 78 T38 78 T54 78 T70 78" fill="none" stroke={STEEL} strokeWidth="0.5" opacity="0.6" />
              <path d="M6 62 Q14 56 22 62 T38 62 T54 62 T70 62" fill="none" stroke={STEEL} strokeWidth="0.5" opacity="0.35" />
              {[[14, 14], [60, 30], [10, 34]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="0.9" fill={STEEL} />
              ))}
            </svg>
          </div>
          <div className="border-t border-[rgba(125,148,184,0.18)] px-3 py-1 lsd-caps text-[6.5px] lsd-dim">
            Channel · Water · Depth · Mystery
          </div>
        </div>
      </section>

      {/* ======================= DECK 02: SERVICE CHANNELS ======================= */}
      <div className="mt-2 flex items-center gap-3 px-1">
        <span className="lsd-mono text-[7px] lsd-dim">▼</span>
        <span className="lsd-caps text-[8.5px] lsd-hi">Deck 02 — Service Channels</span>
        <span className="lsd-hair flex-1" />
        <span className="lsd-mono text-[7px] lsd-dim">SIX INSTRUMENTS · ALL READINGS LIVE</span>
      </div>

      <section className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {CHANNELS.map((c) => (
          <a
            key={c.n}
            href={c.href}
            className="lsd-panel lsd-card-link group relative block p-3"
            style={c.n === "CH·02" ? { transform: "rotate(0.55deg)" } : c.n === "CH·05" ? { transform: "rotate(-0.55deg)" } : undefined}
          >
            <div className="flex items-start justify-between">
              <span className="lsd-mono text-[7px] lsd-dim">{c.n}</span>
              <span className="lsd-caps border border-[rgba(125,148,184,0.4)] px-1.5 py-[1px] text-[6.5px] lsd-mid">
                {c.tag}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2.5">
              <span className="lsd-serif text-[20px] lsd-hi leading-none lsd-glow">{c.glyph}</span>
              <span className="lsd-caps lsd-serif text-[13px] lsd-hi tracking-[0.14em]">{c.name}</span>
            </div>
            <p className="mt-2 text-[9.5px] leading-[1.5] lsd-mid">{c.copy}</p>
            <div className="mt-2 flex items-center justify-between border-t border-[rgba(125,148,184,0.18)] pt-1.5">
              <span className="lsd-caps text-[7.5px] lsd-hi lsd-link">Explore →</span>
              <span className="lsd-mono text-[6.5px] lsd-dim">LAT 0.4s · ∞ USES</span>
            </div>
          </a>
        ))}
      </section>

      {/* ========================= MOON-SIGN BAND ========================= */}
      <section className="lsd-panel -mx-2 mt-2 sm:-mx-3">
        <PHead title="Moon-Sign Band — Twelve Houses of the Sky" right="TROPICAL ZODIAC" />
        <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12">
          {SIGNS.map(([glyph, name, dates], i) => (
            <a
              key={name}
              href={`/horoscope/${name.toLowerCase()}`}
              className={`lsd-card-link flex flex-col items-center gap-0.5 border-[rgba(125,148,184,0.14)] px-1 py-2 ${
                name === "Scorpio" ? "bg-[rgba(125,148,184,0.10)]" : ""
              } ${i % 3 !== 2 ? "border-r sm:border-r" : ""} ${i < 9 ? "border-b lg:border-b-0" : ""} lg:border-r lg:last:border-r-0`}
            >
              <span className={`lsd-serif text-[16px] leading-none ${name === "Scorpio" ? "lsd-hi lsd-glow" : "lsd-mid"}`}>
                {glyph}
              </span>
              <span className="lsd-caps text-[7px] lsd-hi">{name}</span>
              <span className="lsd-mono text-[5.5px] lsd-dim">{dates}</span>
              <span className="lsd-mono text-[5.5px] lsd-dim">{String(i * 30).padStart(3, "0")}°–{String(i * 30 + 30).padStart(3, "0")}°</span>
            </a>
          ))}
        </div>
        <div className="flex justify-between border-t border-[rgba(125,148,184,0.18)] px-3 py-1 lsd-mono text-[6.5px] lsd-dim">
          <span>MOON CURRENTLY IN ♏︎ SCORPIO — 8TH HOUSE</span>
          <span>INGRESS ♐︎ SAGITTARIUS MAY 20 · 03:17 UTC</span>
        </div>
      </section>

      {/* ==================== DESTINY MATRIX + ANALYSIS NOTES ==================== */}
      <section className="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-12">
        {/* DESTINY MATRIX */}
        <div className="lsd-panel relative z-10 lg:col-span-5 lg:-mt-4" style={{ transform: "rotate(-0.35deg)" }}>
          <PHead title="Destiny Matrix — Optional Instrument" right="OCTAGRAM" />
          <div className="grid grid-cols-[130px_1fr] gap-3 px-3 pb-2.5">
            <svg width="130" height="130" viewBox="0 0 130 130" aria-label="Birth-date octagram">
              <circle cx="65" cy="65" r="56" fill="none" stroke={STEEL} strokeWidth="0.5" opacity="0.7" />
              <circle cx="65" cy="65" r="40" fill="none" stroke={STEEL} strokeWidth="0.4" strokeDasharray="2 3" opacity="0.7" />
              <polygon points="65,15 100.4,29.6 115,65 100.4,100.4 65,115 29.6,100.4 15,65 29.6,29.6" fill="none" stroke={SILVER} strokeWidth="0.7" className="lsd-rot-a" />
              <polygon points="65,25 93.1,36.9 105,65 93.1,93.1 65,105 36.9,93.1 25,65 36.9,36.9" fill="none" stroke={SILVER} strokeWidth="0.5" opacity="0.6" className="lsd-rot-b" />
              <circle cx="65" cy="65" r="12" fill="none" stroke={SILVER} strokeWidth="0.7" />
              <circle cx="65" cy="65" r="2" fill={SILVER} className="lsd-pulse" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((d, k) => {
                const p = onCircle(65, 65, 61.5, d);
                const q = onCircle(65, 65, 48, d);
                return (
                  <g key={d}>
                    <line x1="65" y1="65" x2={q.x} y2={q.y} stroke={STEEL} strokeWidth="0.3" opacity="0.4" />
                    <text x={p.x} y={p.y + 2} textAnchor="middle" fontSize="5.5" fill={DIM}>
                      {k * 10}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div className="flex flex-col justify-center">
              <div className="lsd-caps text-[7px] lsd-dim">Auxiliary Reading · Birth Date Only</div>
              <p className="mt-1.5 text-[9.5px] leading-[1.55] lsd-mid">
                An optional birth-date octagram tool. It maps purpose, love, money, and age themes
                from your birth date.
              </p>
              <div className="mt-2 grid grid-cols-4 gap-1">
                {["Purpose", "Love", "Money", "Age"].map((s) => (
                  <span key={s} className="lsd-caps border border-[rgba(125,148,184,0.25)] py-0.5 text-center text-[6px] lsd-mid">
                    {s}
                  </span>
                ))}
              </div>
              <a href="/destiny-matrix" className="lsd-caps lsd-link mt-2.5 text-[8px] lsd-hi">
                Open Destiny Matrix →
              </a>
            </div>
          </div>
          <div className="border-t border-[rgba(125,148,184,0.18)] px-3 py-1 lsd-mono text-[6.5px] lsd-dim">
            INPUT DD·MM·YYYY → 22 ARCANA · NO BIRTH TIME NEEDED
          </div>
        </div>

        {/* ANALYSIS NOTES (FAQ) */}
        <div className="lsd-panel lg:col-span-7" style={{ transform: "rotate(0.3deg)" }}>
          <PHead title="Analysis Notes — Frequently Logged Queries" right="4 ENTRIES" />
          <div className="grid grid-cols-1 gap-x-4 px-3 pb-2 sm:grid-cols-2">
            {FAQ.map((f) => (
              <div key={f.n} className="border-b border-[rgba(125,148,184,0.14)] py-2">
                <div className="flex items-baseline gap-2">
                  <span className="lsd-mono text-[7px] lsd-dim shrink-0">{f.n}</span>
                  <span className="lsd-caps text-[8.5px] lsd-hi">{f.q}</span>
                </div>
                <p className="mt-1 pl-[34px] text-[8.5px] leading-[1.55] lsd-mid">{f.a}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-[rgba(125,148,184,0.18)] px-3 py-1 lsd-mono text-[6.5px] lsd-dim">
            LOG CONTINUES AT /SUPPORT · RESPONSE LATENCY &lt; 1 TIDAL CYCLE
          </div>
        </div>
      </section>

      {/* ============================== CTA PLATE ============================== */}
      <section className="lsd-panel relative -mx-2 mt-2 overflow-hidden px-4 py-6 text-center sm:-mx-3" style={{ transform: "rotate(-0.2deg)" }}>
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-40" aria-hidden="true" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 160">
          <circle cx="600" cy="80" r="70" fill="none" stroke={STEEL} strokeWidth="0.4" strokeDasharray="2 4" className="lsd-rot-a" />
          <circle cx="600" cy="80" r="110" fill="none" stroke={STEEL} strokeWidth="0.3" strokeDasharray="1 5" className="lsd-rot-b" />
          {ringTicks(600, 80, 130, 136, 48, 4).map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={STEEL} strokeWidth="0.4" opacity="0.6" />
          ))}
          <line x1="0" y1="80" x2="452" y2="80" stroke={STEEL} strokeWidth="0.3" opacity="0.5" />
          <line x1="748" y1="80" x2="1200" y2="80" stroke={STEEL} strokeWidth="0.3" opacity="0.5" />
        </svg>
        <div className="relative">
          <div className="lsd-caps text-[7.5px] lsd-dim">— Final Reading —</div>
          <p className="lsd-serif lsd-glow mx-auto mt-2 max-w-[560px] text-[19px] leading-snug lsd-hi sm:text-[23px]">
            Your chart is written in the stars. Come read it.
          </p>
          <a href="/sign-up" className="lsd-btn lsd-caps mt-4 inline-block px-6 py-2 text-[9.5px]">
            {"Get started — it's free"} ◈
          </a>
          <div className="lsd-mono mt-3 text-[7px] lsd-dim">
            NO CARD REQUIRED · CHART IN &lt; 60 SECONDS · CANCEL NEVER — {"IT'S"} FREE
          </div>
        </div>
      </section>

      {/* =============================== FOOTER =============================== */}
      <footer className="lsd-panel mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 px-3 py-2">
        <span className="flex items-center gap-1.5">
          <span className="lsd-hi text-[10px]">◈</span>
          <span className="lsd-caps lsd-serif text-[9px] lsd-hi tracking-[0.24em]">Astro Scope</span>
        </span>
        <span className="lsd-mono text-[6.5px] lsd-dim">ARCANA ANALYSIS ENGINE v3.7 · BUILD 4471</span>
        <span className="flex-1" />
        {[
          ["Horoscopes", "/horoscope"],
          ["Tarot", "/tarot"],
          ["Compatibility", "/compatibility"],
          ["Psychology", "/psychology"],
          ["Cosmic Passport", "/passport"],
        ].map(([label, href]) => (
          <a key={href} href={href} className="lsd-caps lsd-link text-[6.5px] lsd-dim">
            {label}
          </a>
        ))}
        <span className="lsd-mono text-[6.5px] lsd-dim">© 2026 · READINGS FOR ENTERTAINMENT + REFLECTION</span>
      </footer>
      </div>

      {/* ==================== WEATHERING / ATMOSPHERE ==================== */}
      {/* condensation: soft haze patches drifting very slowly across panels */}
      <div className="lsd-mist lsd-mist-a" aria-hidden="true" />
      <div className="lsd-mist lsd-mist-b" aria-hidden="true" />
      <div className="lsd-mist lsd-mist-c" aria-hidden="true" />
      <div className="lsd-mist lsd-mist-d" aria-hidden="true" />

      {/* water spots + salt-ring stains, dried onto a few panels */}
      <svg className="lsd-stain lsd-stain-a" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M50 6 C72 4 94 24 93 50 C92 76 74 95 49 93 C25 91 5 73 7 48 C9 25 28 8 50 6 Z" fill="none" stroke="#c8d6ec" strokeWidth="1" opacity="0.12" />
        <path d="M50 18 C66 16 82 31 81 50 C80 68 66 82 49 81 C32 80 18 66 19 48 C20 32 34 19 50 18 Z" fill="none" stroke="#c8d6ec" strokeWidth="0.6" opacity="0.08" />
        <circle cx="34" cy="40" r="3.2" fill="#c8d6ec" opacity="0.05" />
        <circle cx="62" cy="58" r="2.1" fill="#c8d6ec" opacity="0.06" />
        <circle cx="55" cy="30" r="1.4" fill="#c8d6ec" opacity="0.07" />
      </svg>
      <svg className="lsd-stain lsd-stain-b" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M48 8 C70 5 92 22 94 47 C96 72 76 92 51 94 C27 96 6 76 5 51 C4 27 26 11 48 8 Z" fill="none" stroke="#c8d6ec" strokeWidth="1.1" opacity="0.11" />
        <path d="M49 20 C64 18 80 30 82 48 C84 65 68 80 50 81 C33 82 19 68 18 51 C17 34 33 22 49 20 Z" fill="none" stroke="#c8d6ec" strokeWidth="0.5" opacity="0.07" />
        <path d="M49 33 C59 32 69 39 70 49 C71 60 61 69 50 69 C39 69 30 60 31 49 C32 39 40 34 49 33 Z" fill="none" stroke="#c8d6ec" strokeWidth="0.4" opacity="0.05" />
        <circle cx="60" cy="44" r="2.6" fill="#c8d6ec" opacity="0.05" />
        <circle cx="40" cy="60" r="1.7" fill="#c8d6ec" opacity="0.06" />
      </svg>
      <svg className="lsd-stain lsd-stain-c" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M51 10 C73 9 91 27 90 51 C89 74 71 92 48 90 C26 88 9 71 11 48 C13 27 30 11 51 10 Z" fill="none" stroke="#c8d6ec" strokeWidth="0.9" opacity="0.1" />
        <circle cx="45" cy="52" r="2.4" fill="#c8d6ec" opacity="0.05" />
        <circle cx="63" cy="38" r="1.5" fill="#c8d6ec" opacity="0.06" />
        <circle cx="36" cy="34" r="1" fill="#c8d6ec" opacity="0.07" />
      </svg>

      {/* fine scratch hairlines across the silver rules */}
      <svg className="lsd-scratch" viewBox="0 0 1200 1600" preserveAspectRatio="none" aria-hidden="true">
        <g stroke="#dfe9f8" strokeWidth="0.5" fill="none">
          <line x1="0" y1="132" x2="1200" y2="104" opacity="0.05" />
          <line x1="0" y1="388" x2="1200" y2="402" opacity="0.035" />
          <line x1="120" y1="0" x2="96" y2="1600" opacity="0.04" />
          <line x1="514" y1="0" x2="528" y2="1600" opacity="0.03" />
          <line x1="876" y1="0" x2="852" y2="1600" opacity="0.045" />
          <line x1="0" y1="742" x2="1200" y2="718" opacity="0.05" />
          <line x1="0" y1="1088" x2="1200" y2="1112" opacity="0.03" />
          <line x1="312" y1="0" x2="330" y2="1600" opacity="0.025" />
          <line x1="1060" y1="0" x2="1044" y2="1600" opacity="0.04" />
          <line x1="0" y1="1420" x2="1200" y2="1396" opacity="0.045" />
          <line x1="688" y1="0" x2="700" y2="1600" opacity="0.03" />
          <line x1="0" y1="560" x2="1200" y2="548" opacity="0.025" />
        </g>
      </svg>

      {/* dust/noise grain + uneven cold lighting vignette */}
      <div className="lsd-noise" aria-hidden="true" />
      <div className="lsd-vignette" aria-hidden="true" />
    </main>
  );
}

/* ============================ SCOPED STYLES =============================== */

const LSD_CSS = `
.lsd-root{
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
.lsd-serif{ font-family: Georgia, 'Times New Roman', serif; }
.lsd-mono{ font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace; }
.lsd-caps{ text-transform:uppercase; letter-spacing:.22em; }
.lsd-hi{ color:#c8d6ec; }
.lsd-mid{ color:#8ea3c2; }
.lsd-dim{ color:#4a5c78; }
.lsd-glow{ text-shadow:0 0 14px rgba(160,190,230,.38), 0 0 40px rgba(120,150,200,.16); }
.lsd-panel{
  border:1px solid rgba(125,148,184,.24);
  background:linear-gradient(180deg, rgba(17,25,42,.55), rgba(7,11,20,.78));
  box-shadow: inset 0 0 0 1px rgba(200,214,236,.045), inset 0 0 40px rgba(10,16,30,.45), 0 2px 18px rgba(0,0,0,.45);
}
.lsd-hair{ height:1px; background:linear-gradient(90deg, transparent, rgba(125,148,184,.45) 20%, rgba(125,148,184,.45) 80%, transparent); }
.lsd-track{ background:repeating-linear-gradient(90deg, rgba(125,148,184,.4) 0 1px, transparent 1px 4px); }
.lsd-fill{ background:linear-gradient(90deg, #54678a, #c8d6ec); box-shadow:0 0 8px rgba(150,180,220,.55); }
.lsd-btn{
  border:1px solid rgba(200,214,236,.55);
  color:#e2eafa;
  background:linear-gradient(180deg, rgba(60,80,116,.5), rgba(20,30,52,.7));
  box-shadow: inset 0 0 0 1px rgba(200,214,236,.12), 0 0 14px rgba(120,150,200,.18);
  letter-spacing:.22em;
  transition: box-shadow .3s ease, background .3s ease;
}
.lsd-btn:hover{
  background:linear-gradient(180deg, rgba(90,116,160,.55), rgba(34,48,78,.75));
  box-shadow: inset 0 0 0 1px rgba(200,214,236,.2), 0 0 26px rgba(140,172,220,.4);
}
.lsd-link{ transition: color .25s ease, text-shadow .25s ease; }
.lsd-link:hover{ color:#e6eefb; text-shadow:0 0 10px rgba(160,190,230,.5); }
.lsd-card{ border:1px solid rgba(125,148,184,.2); padding:5px 5px 6px; text-align:center; background:rgba(10,16,28,.4); }
.lsd-card-link{ transition: box-shadow .3s ease, border-color .3s ease; }
.lsd-card-link:hover{ border-color:rgba(200,214,236,.5); box-shadow: inset 0 0 0 1px rgba(200,214,236,.1), 0 0 22px rgba(120,150,200,.22); }

/* weathering layer — readable, nocturnal, aged */
.lsd-mist{
  position:absolute; pointer-events:none; z-index:33; border-radius:50%;
  background:radial-gradient(closest-side, rgba(170,198,235,.11), rgba(170,198,235,.045) 55%, transparent 78%);
  filter:blur(14px);
}
.lsd-mist-a{ width:52vw; height:26vw; min-width:480px; min-height:240px; top:4%; left:-10%; }
.lsd-mist-b{ width:40vw; height:22vw; min-width:380px; min-height:200px; top:34%; right:-12%; }
.lsd-mist-c{ width:46vw; height:24vw; min-width:420px; min-height:220px; top:58%; left:14%; }
.lsd-mist-d{ width:36vw; height:20vw; min-width:340px; min-height:180px; bottom:2%; right:6%; }
.lsd-stain{ position:absolute; pointer-events:none; z-index:34; }
.lsd-stain-a{ top:24%; left:0.5%; width:130px; }
.lsd-stain-b{ top:8%; right:1%; width:170px; }
.lsd-stain-c{ top:64%; left:38%; width:110px; }
.lsd-scratch{ position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:32; }
.lsd-noise{
  position:fixed; inset:0; pointer-events:none; z-index:31; opacity:.055;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  background-size:180px 180px;
}
.lsd-vignette{
  position:fixed; inset:0; pointer-events:none; z-index:30;
  background:
    radial-gradient(ellipse 130% 100% at 28% 8%, rgba(150,180,225,.07), transparent 45%),
    radial-gradient(ellipse 140% 110% at 50% 50%, transparent 52%, rgba(2,4,9,.62) 100%),
    linear-gradient(200deg, rgba(120,150,200,.05), transparent 30%, rgba(2,4,10,.25) 92%);
}

/* structural background layers, behind all content */
.lsd-bg{ position:absolute; inset:0; overflow:hidden; pointer-events:none; }
.lsd-bg-moon{ position:absolute; }
.lsd-bg-moon-a{ top:-24vmin; right:-34vmin; width:120vmin; height:120vmin; }
.lsd-bg-moon-b{ bottom:-30vmin; left:-26vmin; width:90vmin; height:90vmin; opacity:.7; }
.lsd-orbit{ position:absolute; border-radius:50%; border:1px solid rgba(125,148,184,.13); }
.lsd-orbit-a{ width:150vw; height:150vw; top:8%; left:-80vw; }
.lsd-orbit-b{ width:110vw; height:110vw; top:-55vw; right:-45vw; border-style:dashed; border-color:rgba(200,214,236,.1); }
.lsd-orbit-c{ width:80vw; height:80vw; bottom:-42vw; left:26vw; }
.lsd-bg-const{ position:absolute; inset:0; width:100%; height:100%; }
.lsd-bg-stars{
  position:absolute; inset:0;
  background-image:
    radial-gradient(1px 1px at 8% 12%, rgba(200,214,236,.3) 50%, transparent 51%),
    radial-gradient(1px 1px at 22% 46%, rgba(200,214,236,.2) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 34% 78%, rgba(200,214,236,.22) 50%, transparent 51%),
    radial-gradient(1px 1px at 47% 18%, rgba(200,214,236,.26) 50%, transparent 51%),
    radial-gradient(1px 1px at 58% 58%, rgba(200,214,236,.16) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 66% 32%, rgba(200,214,236,.24) 50%, transparent 51%),
    radial-gradient(1px 1px at 74% 86%, rgba(200,214,236,.2) 50%, transparent 51%),
    radial-gradient(1px 1px at 82% 6%, rgba(200,214,236,.28) 50%, transparent 51%),
    radial-gradient(1px 1px at 90% 52%, rgba(200,214,236,.18) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 15% 92%, rgba(200,214,236,.2) 50%, transparent 51%),
    radial-gradient(1px 1px at 42% 94%, rgba(200,214,236,.16) 50%, transparent 51%),
    radial-gradient(1px 1px at 96% 96%, rgba(200,214,236,.24) 50%, transparent 51%),
    radial-gradient(1px 1px at 28% 26%, rgba(200,214,236,.18) 50%, transparent 51%),
    radial-gradient(1px 1px at 62% 74%, rgba(200,214,236,.22) 50%, transparent 51%);
}

@keyframes lsd-rot{ to{ transform: rotate(360deg); } }
@keyframes lsd-pulse{ 0%,100%{ opacity:.55; } 50%{ opacity:1; } }
@keyframes lsd-blink{ 0%,60%{ opacity:1; } 61%,100%{ opacity:0; } }
@keyframes lsd-dash{ to{ stroke-dashoffset:-100; } }
@keyframes lsd-drift-a{ from{ transform:translate3d(0,0,0) scale(1); } to{ transform:translate3d(9vw,3vh,0) scale(1.12); } }
@keyframes lsd-drift-b{ from{ transform:translate3d(0,0,0) scale(1.05); } to{ transform:translate3d(-8vw,-2vh,0) scale(.96); } }

@media (prefers-reduced-motion: no-preference){
  .lsd-rot-a{ animation: lsd-rot 180s linear infinite; transform-box: view-box; transform-origin: center; }
  .lsd-rot-b{ animation: lsd-rot 120s linear infinite reverse; transform-box: view-box; transform-origin: center; }
  .lsd-rot-c{ animation: lsd-rot 90s linear infinite; transform-box: view-box; transform-origin: center; }
  .lsd-pulse{ animation: lsd-pulse 16s ease-in-out infinite; }
  .lsd-blink{ animation: lsd-blink 3.2s steps(1) infinite; }
  .lsd-dash{ animation: lsd-dash 45s linear infinite; }
  .lsd-mist-a{ animation: lsd-drift-a 150s ease-in-out infinite alternate; }
  .lsd-mist-b{ animation: lsd-drift-b 170s ease-in-out infinite alternate; }
  .lsd-mist-c{ animation: lsd-drift-a 190s ease-in-out infinite alternate-reverse; }
  .lsd-mist-d{ animation: lsd-drift-b 130s ease-in-out infinite alternate-reverse; }
  .lsd-orbit-b{ animation: lsd-rot 240s linear infinite; }
}
@media (prefers-reduced-motion: reduce){
  .lsd-rot-a,.lsd-rot-b,.lsd-rot-c,.lsd-pulse,.lsd-blink,.lsd-dash,.lsd-mist-a,.lsd-mist-b,.lsd-mist-c,.lsd-mist-d,.lsd-orbit-b{ animation: none; }
}
`;
