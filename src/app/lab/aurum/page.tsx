// LAB / AURUM — a design exploration of the production landing as a
// LANDING-first gold-on-black engine: hero with editorial left column and a
// large golden apparatus card (a smaller PRIMA MATERIA cousin with readout
// chips), then a full-width LIVE SKY instrument band, twelve-sign ecliptic
// band, an engraved HOW IT WORKS rail, six module plates, the Destiny Matrix
// octagram, TODAY instruments, FAQ as archive entries, CTA band and a
// stat-lined footer. Palette and density borrowed from lab/arcana-engine but
// the flow is pure marketing page: hero -> sections -> cta, top to bottom.
// Fully self-contained: inline SVG, Tailwind for layout, one scoped <style>
// block (lau- prefixed). Server-component safe: no hooks, CSS animations only
// (slow 15–180s cycles, reduced-motion guarded).

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Astro Scope — Aurum",
  description:
    "Free birth chart, daily horoscopes, synastry and tarot — a gold-on-black engine of fate, landing edition.",
};

const DEG = Math.PI / 180;

// gold-on-black engine palette (from lab/arcana-engine)
const GOLD = "#d4a82c";
const GOLD_HI = "#f0cf6b";
const GOLD_DIM = "#8a6d1f";
const GOLD_FAINT = "#54430f";
const IVORY = "#e9dfc8";
const EMBER = "#c9713f";
const INK = "#0a0705";

/* ============================ GEOMETRY HELPERS ============================ */

function polar(cx: number, cy: number, r: number, deg: number) {
  const t = deg * DEG;
  return { x: +(cx + r * Math.cos(t)).toFixed(1), y: +(cy + r * Math.sin(t)).toFixed(1) };
}

// tick marks around a circle: n radial lines from rIn to rOut around (cx, cy)
function ringTicks(cx: number, cy: number, rIn: number, rOut: number, n: number, offset = 0) {
  return Array.from({ length: n }, (_, k) => {
    const a = polar(cx, cy, rIn, offset + (360 / n) * k);
    const b = polar(cx, cy, rOut, offset + (360 / n) * k);
    return { ...a, x2: b.x, y2: b.y, major: n >= 12 ? k % (n / 12) === 0 : true };
  });
}

// crescent moon: outer arc one way, smaller arc back
function crescentPath(cx: number, cy: number, r: number) {
  return `M ${cx} ${cy - r} A ${r} ${r} 0 1 0 ${cx} ${cy + r} A ${(r * 0.72).toFixed(1)} ${(r * 0.72).toFixed(1)} 0 1 1 ${cx} ${cy - r} Z`;
}

// 8-point compass star as one path
function compassPath(cx: number, cy: number, rLong: number, rShort: number) {
  let d = "";
  for (let k = 0; k < 16; k++) {
    const r = k % 2 === 0 ? rLong : rShort;
    const p = polar(cx, cy, r, -90 + k * 22.5);
    d += `${k === 0 ? "M" : "L"} ${p.x} ${p.y} `;
  }
  return d + "Z";
}

// n-point star polygon (alternating radii), closed path
function starPath(cx: number, cy: number, n: number, rOut: number, rIn: number, offset = -90) {
  let d = "";
  for (let k = 0; k < n * 2; k++) {
    const r = k % 2 === 0 ? rOut : rIn;
    const p = polar(cx, cy, r, offset + (180 / n) * k);
    d += `${k === 0 ? "M" : "L"} ${p.x} ${p.y} `;
  }
  return d + "Z";
}

// regular polygon path
function polyPath(cx: number, cy: number, r: number, sides: number, offset = -90) {
  let d = "";
  for (let k = 0; k < sides; k++) {
    const p = polar(cx, cy, r, offset + (360 / sides) * k);
    d += `${k === 0 ? "M" : "L"} ${p.x} ${p.y} `;
  }
  return d + "Z";
}

// deterministic pseudo-random for starfields (stable across renders)
function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/* ================================= DATA =================================== */

const GLYPH_FE0E = "\uFE0E";

const ZODIAC = [
  { g: "♈", name: "Aries", dates: "Mar 21 – Apr 19", el: "FIRE" },
  { g: "♉", name: "Taurus", dates: "Apr 20 – May 20", el: "EARTH" },
  { g: "♊", name: "Gemini", dates: "May 21 – Jun 20", el: "AIR" },
  { g: "♋", name: "Cancer", dates: "Jun 21 – Jul 22", el: "WATER" },
  { g: "♌", name: "Leo", dates: "Jul 23 – Aug 22", el: "FIRE" },
  { g: "♍", name: "Virgo", dates: "Aug 23 – Sep 22", el: "EARTH" },
  { g: "♎", name: "Libra", dates: "Sep 23 – Oct 22", el: "AIR" },
  { g: "♏", name: "Scorpio", dates: "Oct 23 – Nov 21", el: "WATER" },
  { g: "♐", name: "Sagittarius", dates: "Nov 22 – Dec 21", el: "FIRE" },
  { g: "♑", name: "Capricorn", dates: "Dec 22 – Jan 19", el: "EARTH" },
  { g: "♒", name: "Aquarius", dates: "Jan 20 – Feb 18", el: "AIR" },
  { g: "♓", name: "Pisces", dates: "Feb 19 – Mar 20", el: "WATER" },
].map((z) => ({ ...z, g: z.g + GLYPH_FE0E }));

const CHIPS = [
  { g: "☉" + GLYPH_FE0E, name: "SOL", v: "+78.2", up: true, cls: "right-2 top-10 sm:-right-3" },
  { g: "☽" + GLYPH_FE0E, name: "LUNA", v: "+66.5", up: true, cls: "left-2 top-1/3 sm:-left-3" },
  { g: "☿" + GLYPH_FE0E, name: "MERCURIUS", v: "+22.1", up: true, cls: "right-2 bottom-16 sm:-right-2" },
  { g: "♄" + GLYPH_FE0E, name: "SATURNUS", v: "−28.9", up: false, cls: "left-2 bottom-6 sm:-left-2" },
];

const LIVE_SKY = [
  { label: "MOON PHASE", value: "Waxing · 62%", icon: "moon" },
  { label: "PLANETARY HOUR", value: "♄" + GLYPH_FE0E + " Saturn", icon: "hour" },
  { label: "RETROGRADE", value: "℞ Mercury", icon: "retro" },
  { label: "VOID OF COURSE", value: "— None", icon: "void" },
  { label: "NEXT TRANSIT", value: "☽" + GLYPH_FE0E + " △ ♃" + GLYPH_FE0E + " · 03:12", icon: "transit" },
  { label: "SIDEREAL TIME", value: "14:07:33 LST", icon: "time" },
  { label: "SOLAR ALTITUDE", value: "+42.6°", icon: "sun" },
];

const STEPS = [
  {
    n: "I",
    t: "Enter date, time & place",
    c: "Your birth moment, to the minute — city included. That is all the engine asks of you.",
    micro: "INPUT · ΔT CORRECTED",
  },
  {
    n: "II",
    t: "The engine computes",
    c: "Real ephemeris positions — houses, aspects, dignities. Computed, never guessed.",
    micro: "EPHEMERIS 1900–2100",
  },
  {
    n: "III",
    t: "Your wheel is revealed",
    c: "Sun, Moon, Rising and ten bodies across twelve houses, drawn as one golden wheel.",
    micro: "HOUSES · PLACIDUS",
  },
  {
    n: "IV",
    t: "Read your path",
    c: "Plain-language readings, daily transits and deep dives — free, forever.",
    micro: "OUTPUT · DAILY",
  },
];

const MODULES = [
  {
    tag: "FREE",
    title: "Birth Chart",
    copy: "Map your Sun, Moon, and Rising — the foundation of every reading.",
  },
  {
    tag: "DAILY",
    title: "Daily Horoscope",
    copy: "Twelve signs, one sky. Clear forecasts without the fluff.",
  },
  {
    tag: "SYNASTRY",
    title: "Compatibility",
    copy: "Zodiac match, Chinese pairs, and deep synastry for two charts.",
  },
  {
    tag: "SPREADS",
    title: "Tarot",
    copy: "Daily card to Celtic Cross — pull, reflect, get a full reading.",
  },
  {
    tag: "TESTS",
    title: "Psychology",
    copy: "MBTI, Big Five, empathy and more — meet yourself beyond the signs.",
  },
  {
    tag: "YOU",
    title: "Cosmic Passport",
    copy: "Your Cosmic ID, people, journal, and Premium deep dives — one hub.",
  },
];

const ARCHIVE = [
  {
    q: "Which features are free?",
    a: "Birth chart, daily horoscope, tarot pulls and psychology tests are free. Premium adds deep dives.",
  },
  {
    q: "How do I cast a chart?",
    a: "Enter birth date, exact time and city — the engine computes houses, aspects and dignities.",
  },
  {
    q: "Where do horoscopes live?",
    a: "In the Daily Horoscope module — twelve signs, one sky, updated every morning.",
  },
  {
    q: "What is the Destiny Matrix?",
    a: "An optional birth-date octagram mapping purpose, love, money and age themes.",
  },
];

/* ============================ PRECOMPUTED SVG ============================= */

const rnd = lcg(20260804);
const HERO_STARS = Array.from({ length: 140 }, () => ({
  x: +(rnd() * 1600).toFixed(0),
  y: +(rnd() * 900).toFixed(0),
  r: +(0.4 + rnd() * 0.9).toFixed(2),
  o: +(0.1 + rnd() * 0.38).toFixed(2),
  g: Math.floor(rnd() * 3),
}));
const ENGINE_STARS = Array.from({ length: 56 }, () => ({
  x: +(rnd() * 420).toFixed(0),
  y: +(rnd() * 420).toFixed(0),
  r: +(0.4 + rnd() * 0.8).toFixed(2),
  o: +(0.1 + rnd() * 0.35).toFixed(2),
  g: Math.floor(rnd() * 3),
}));

/* ============================== SMALL PIECES ============================== */

// tiny gold diagram icon, six deterministic variants
function MiniSigil({ i, size = 18 }: { i: number; size?: number }) {
  const c = size / 2;
  const variant = i % 6;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} fill="none" stroke={GOLD} strokeWidth="0.9" aria-hidden>
      <circle cx={c} cy={c} r={c - 1} opacity="0.55" />
      {variant === 0 && <path d={polyPath(c, c + 0.5, c - 4.5, 3)} />}
      {variant === 1 && (
        <path d={`M ${c} 2.5 V ${size - 2.5} M 3.5 ${c} H ${size - 3.5} M ${c} ${c} m -2.4 0 a 2.4 2.4 0 1 0 4.8 0 a 2.4 2.4 0 1 0 -4.8 0`} />
      )}
      {variant === 2 && <path d={starPath(c, c, 4, c - 3.5, 2.2)} />}
      {variant === 3 && <path d={crescentPath(c - 1, c, c - 4.6)} />}
      {variant === 4 && <path d={`${polyPath(c, c, c - 4, 4)} M ${c} 3 V ${size - 3}`} />}
      {variant === 5 && <path d={`${polyPath(c, c - 1, c - 4.6, 3, 90)} M 3.5 ${size - 4.5} H ${size - 3.5}`} />}
    </svg>
  );
}

// engraved section header: index + title + hairline + right-side readout
function SectionHead({ index, title, right }: { index: string; title: string; right?: string }) {
  return (
    <header className="mb-6 flex items-center gap-3 sm:gap-4">
      <span className="lau-mono border px-1.5 py-1 text-[8px] tracking-[0.2em]" style={{ borderColor: `${GOLD}40`, color: GOLD }}>
        {index}
      </span>
      <h2 className="lau-mono text-[9.5px] tracking-[0.34em] uppercase" style={{ color: GOLD_HI }}>
        {title}
      </h2>
      <span className="lau-panel-h-line" aria-hidden />
      {right && (
        <span className="lau-mono hidden text-[7.5px] tracking-[0.18em] uppercase md:inline" style={{ color: GOLD_DIM }}>
          {right}
        </span>
      )}
    </header>
  );
}

// the golden apparatus — PRIMA MATERIA at landing scale (viewBox 420)
function Apparatus() {
  return (
    <svg viewBox="0 0 420 420" className="h-auto w-full" fill="none" aria-hidden>
      <defs>
        <radialGradient id="lau-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={GOLD_HI} stopOpacity="0.5" />
          <stop offset="55%" stopColor={GOLD} stopOpacity="0.14" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* engine starfield */}
      {ENGINE_STARS.map((s, i) => (
        <circle key={i} className={`lau-tw${s.g}`} cx={s.x} cy={s.y} r={s.r} fill={IVORY} opacity={s.o} />
      ))}

      {/* outer static rings + ticks */}
      <circle cx="210" cy="210" r="202" stroke={GOLD} strokeWidth="0.8" opacity="0.5" />
      <circle cx="210" cy="210" r="196" stroke={GOLD} strokeWidth="0.5" strokeDasharray="1 5" opacity="0.45" />
      {ringTicks(210, 210, 186, 195, 96).map((t, i) => (
        <line key={`ot${i}`} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth={t.major ? 1 : 0.4} opacity={t.major ? 0.8 : 0.4} />
      ))}

      {/* degree labels */}
      {[0, 90, 180, 270].map((a) => {
        const p = polar(210, 210, 176, a - 90);
        return (
          <text key={a} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="7" fill={GOLD_DIM} fontFamily="ui-monospace, Menlo, monospace">
            {a}°
          </text>
        );
      })}

      {/* zodiac glyph ring */}
      {ZODIAC.map((z, i) => {
        const p = polar(210, 210, 163, -75 + i * 30);
        return (
          <text key={z.name} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="10" fill={GOLD} opacity="0.75">
            {z.g}
          </text>
        );
      })}
      <circle cx="210" cy="210" r="148" stroke={GOLD} strokeWidth="0.5" opacity="0.4" />

      {/* axis lines */}
      <path d="M 8 210 H 412 M 210 8 V 412" stroke={GOLD} strokeWidth="0.4" strokeDasharray="3 7" opacity="0.35" />

      {/* rotating group A — outer orbit ring with nodes */}
      <g className="lau-spin-a">
        <circle cx="210" cy="210" r="132" stroke={GOLD} strokeWidth="0.7" strokeDasharray="10 4 2 4" opacity="0.6" />
        {[15, 105, 200, 288].map((a, i) => {
          const p = polar(210, 210, 132, a);
          return (
            <g key={`na${i}`}>
              <circle cx={p.x} cy={p.y} r={i % 2 ? 3.2 : 4.4} stroke={GOLD} strokeWidth="0.8" fill={INK} />
              <circle cx={p.x} cy={p.y} r={i % 2 ? 1.1 : 1.6} fill={GOLD_HI} stroke="none" />
            </g>
          );
        })}
        {[60, 150, 245, 335].map((a, i) => {
          const p = polar(210, 210, 132, a);
          return <rect key={`sa${i}`} x={p.x - 2.4} y={p.y - 2.4} width="4.8" height="4.8" stroke={GOLD} strokeWidth="0.7" transform={`rotate(45 ${p.x} ${p.y})`} opacity="0.8" />;
        })}
      </g>

      {/* rotating group B — counter ring, moon crescents riding it */}
      <g className="lau-spin-b">
        <circle cx="210" cy="210" r="108" stroke={GOLD} strokeWidth="0.6" opacity="0.55" />
        {ringTicks(210, 210, 103, 108, 48).map((t, i) => (
          <line key={`bt${i}`} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth="0.4" opacity="0.4" />
        ))}
        {[0, 120, 240].map((a, i) => {
          const p = polar(210, 210, 108, a);
          return <path key={`cb${i}`} d={crescentPath(p.x, p.y, 6)} stroke={GOLD} strokeWidth="0.9" fill="rgba(212,168,44,0.14)" transform={`rotate(${a + 90} ${p.x} ${p.y})`} />;
        })}
        {[60, 180, 300].map((a, i) => {
          const p = polar(210, 210, 108, a);
          return <circle key={`nb${i}`} cx={p.x} cy={p.y} r="2.4" fill={GOLD} stroke="none" opacity="0.85" />;
        })}
      </g>

      {/* static mid rings */}
      <circle cx="210" cy="210" r="90" stroke={GOLD} strokeWidth="0.8" opacity="0.6" />
      <circle cx="210" cy="210" r="84" stroke={GOLD} strokeWidth="0.4" strokeDasharray="1 4" opacity="0.5" />
      {ringTicks(210, 210, 78, 84, 60, 3).map((t, i) => (
        <line key={`mt${i}`} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth={t.major ? 0.9 : 0.35} opacity={t.major ? 0.7 : 0.35} />
      ))}

      {/* rotating group C — inner dashed ring */}
      <g className="lau-spin-c">
        <circle cx="210" cy="210" r="66" stroke={GOLD} strokeWidth="0.7" strokeDasharray="2 6" opacity="0.65" />
        {[30, 150, 270].map((a, i) => {
          const p = polar(210, 210, 66, a);
          return (
            <g key={`nc${i}`}>
              <circle cx={p.x} cy={p.y} r="3.6" stroke={GOLD} strokeWidth="0.8" fill={INK} />
              <circle cx={p.x} cy={p.y} r="1.1" fill={GOLD_HI} stroke="none" />
            </g>
          );
        })}
      </g>

      {/* glowing core */}
      <circle cx="210" cy="210" r="72" fill="url(#lau-core-glow)" stroke="none" className="lau-pulse-slow" />
      <path d={polyPath(210, 210, 50, 3)} stroke={GOLD} strokeWidth="0.9" opacity="0.85" />
      <path d={polyPath(210, 210, 50, 3, 90)} stroke={GOLD} strokeWidth="0.9" opacity="0.55" />
      <circle cx="210" cy="210" r="30" stroke={GOLD} strokeWidth="0.8" opacity="0.8" />
      <path d={compassPath(210, 210, 26, 8)} stroke={GOLD_HI} strokeWidth="0.7" opacity="0.9" />
      <circle cx="210" cy="210" r="7" fill={GOLD_HI} stroke="none" className="lau-pulse" />
      <circle cx="210" cy="210" r="2.4" fill={INK} stroke="none" />
    </svg>
  );
}

// tiny moon-phase icon for the live-sky band
function MoonPhaseIcon() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="7.4" stroke={GOLD} strokeWidth="0.8" />
      <path d={crescentPath(11.4, 10, 5.6)} fill={GOLD} opacity="0.85" stroke="none" />
      <path d="M 10 2.6 V 5 M 10 15 V 17.4" stroke={GOLD} strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
}

/* ================================= PAGE =================================== */

export default function AurumPage() {
  return (
    <main className="lau-root relative min-h-screen overflow-x-clip" style={{ backgroundColor: INK, color: IVORY }}>
      <style>{LAU_CSS}</style>

      {/* page starfield + vignette */}
      <svg viewBox="0 0 1600 900" className="pointer-events-none absolute inset-x-0 top-0 h-[720px] w-full" preserveAspectRatio="xMidYMin slice" fill="none" aria-hidden>
        {HERO_STARS.map((s, i) => (
          <circle key={i} className={`lau-tw${s.g}`} cx={s.x} cy={s.y} r={s.r} fill={IVORY} opacity={s.o} />
        ))}
      </svg>
      <div className="lau-vignette pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative mx-auto max-w-[1200px] px-4 pb-8 sm:px-6">
        {/* ============================ TOP BAR ============================ */}
        <header className="lau-panel mt-4 flex items-center gap-4 px-3 py-2 sm:px-4">
          <a href="#" className="flex items-center gap-2.5">
            <span className="lau-inset flex h-7 w-7 items-center justify-center">
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden>
                <path d={compassPath(10, 10, 8, 3)} stroke={GOLD_HI} strokeWidth="0.9" />
                <circle cx="10" cy="10" r="2" fill={GOLD} stroke="none" />
              </svg>
            </span>
            <span className="lau-serif text-[15px] tracking-[0.3em]" style={{ color: GOLD_HI }}>
              ASTRO&nbsp;SCOPE
            </span>
          </a>
          <nav className="lau-mono ml-auto hidden items-center gap-5 text-[8.5px] tracking-[0.24em] uppercase md:flex">
            {["Horoscopes", "Tarot", "Compatibility"].map((l) => (
              <a key={l} href="#" className="lau-navlink">
                {l}
              </a>
            ))}
          </nav>
          <a href="#" className="lau-btn-ghost lau-mono ml-auto px-3.5 py-1.5 text-[8.5px] tracking-[0.24em] uppercase md:ml-0">
            Sign In
          </a>
          <span className="lau-mono hidden text-[7px] tracking-[0.18em] lg:inline" style={{ color: GOLD_DIM }}>
            VER 7.2.1 · ENGINE NOMINAL
          </span>
        </header>

        {/* ============================== HERO ============================== */}
        <section className="relative mt-10 grid grid-cols-1 gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-6">
          {/* left editorial column, with a vertical degree ruler */}
          <div className="relative pl-6 sm:pl-8">
            <span className="lau-ruler" aria-hidden />
            <p className="lau-mono text-[8.5px] tracking-[0.4em] uppercase" style={{ color: GOLD }}>
              Aurum Edition · Hand-Computed Ephemeris · Plates I–XII
            </p>
            <h1 className="lau-serif lau-glow mt-5 max-w-xl text-[42px] leading-[1.04] sm:text-[58px]" style={{ color: GOLD_HI }}>
              The engine of fate runs on numbers.
            </h1>
            <p className="mt-6 max-w-md text-[12.5px] leading-relaxed" style={{ color: `${IVORY}b8` }}>
              Astro Scope computes your natal wheel from real ephemeris data — then reads it in plain language. Sun,
              Moon, Rising, houses, aspects: the whole golden apparatus, free.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#" className="lau-btn lau-mono px-7 py-3.5 text-[10px] tracking-[0.26em] uppercase">
                Cast your free birth chart
              </a>
              <a href="#" className="lau-btn-ghost lau-mono px-6 py-3.5 text-[10px] tracking-[0.22em] uppercase">
                Read today&rsquo;s horoscope →
              </a>
            </div>
            {/* hero stat strip */}
            <dl className="lau-mono mt-10 grid max-w-md grid-cols-3 border-t text-[7.5px] tracking-[0.16em] uppercase" style={{ borderColor: `${GOLD}2b` }}>
              {[
                ["Charts cast", "214,807"],
                ["Precision", "±0.01°"],
                ["Ephemeris", "1900–2100"],
              ].map(([k, v], i) => (
                <div key={k} className={`py-3 ${i > 0 ? "border-l pl-3" : ""}`} style={{ borderColor: `${GOLD}2b` }}>
                  <dt style={{ color: GOLD_DIM }}>{k}</dt>
                  <dd className="mt-1 text-[12px] tabular-nums" style={{ color: GOLD_HI }}>
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* right: the apparatus card with readout chips */}
          <div className="relative">
            <div className="lau-panel relative">
              <header className="lau-panel-h">
                <span className="lau-mono text-[7.5px] tracking-[0.2em]" style={{ color: GOLD_DIM }}>
                  FIG. 01 — CORE ASSEMBLY
                </span>
                <span className="lau-panel-h-line" aria-hidden />
                <span className="lau-serif text-[10px] tracking-[0.36em]" style={{ color: GOLD_HI }}>
                  △ AURUM ENGINE △
                </span>
                <span className="lau-panel-h-line" aria-hidden />
                <span className="lau-mono text-[7.5px] tracking-[0.2em]" style={{ color: GOLD_DIM }}>
                  SYNC 99.2%
                </span>
              </header>
              <div className="p-2 sm:p-3">
                <Apparatus />
              </div>
              <footer className="lau-mono flex items-center justify-between border-t px-3 py-1.5 text-[7px] tracking-[0.16em] uppercase" style={{ borderColor: `${GOLD}22`, color: GOLD_DIM }}>
                <span>HOUSES · PLACIDUS</span>
                <span className="hidden sm:inline">LAT 51.5072 N · LON 0.1276 W</span>
                <span>ΔT +0.042S</span>
              </footer>
            </div>
            {/* readout chips floating around the apparatus */}
            {CHIPS.map((c) => (
              <span
                key={c.name}
                className={`lau-chip lau-mono absolute z-10 flex items-center gap-1.5 px-2 py-1 text-[8px] tracking-[0.14em] ${c.cls}`}
              >
                <span style={{ color: GOLD }}>{c.g}</span>
                <span style={{ color: IVORY }}>{c.name}</span>
                <span className="tabular-nums" style={{ color: c.up ? GOLD_HI : EMBER }}>
                  {c.v}
                </span>
              </span>
            ))}
          </div>
        </section>

        {/* ========================= LIVE SKY STRIP ========================= */}
        <section className="lau-panel mt-14 lg:mt-20">
          <header className="lau-panel-h">
            <span style={{ color: GOLD }}>LIVE SKY — CURRENT CELESTIAL TELEMETRY</span>
            <span className="lau-panel-h-line" aria-hidden />
            <span className="lau-mono text-[7.5px] tracking-[0.2em]" style={{ color: GOLD_DIM }}>
              REFRESH 60S · TROPICAL ZODIAC
            </span>
          </header>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7">
            {LIVE_SKY.map((c, i) => (
              <div
                key={c.label}
                className="flex flex-col items-center gap-1.5 border-r border-b px-2 py-3"
                style={{ borderColor: `${GOLD}1f` }}
              >
                {c.icon === "moon" ? <MoonPhaseIcon /> : <MiniSigil i={i + 1} size={16} />}
                <span className="lau-mono text-[6.5px] tracking-[0.22em]" style={{ color: GOLD_DIM }}>
                  {c.label}
                </span>
                <span className="lau-mono text-[9px] tracking-[0.1em] tabular-nums" style={{ color: GOLD_HI }}>
                  {c.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ============================ SIGN BAND =========================== */}
        <section className="mt-14 lg:mt-20">
          <SectionHead index="02" title="Twelve houses of the ecliptic — choose your sign" right="TROPICAL · 360° / 12 = 30° PER SIGN" />
          <div className="grid grid-cols-2 border-t border-l sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6" style={{ borderColor: `${GOLD}2b` }}>
            {ZODIAC.map((z, i) => (
              <a
                key={z.name}
                href="#"
                className="lau-action group flex flex-col items-center gap-1 border-r border-b px-2 py-4"
                style={{ borderColor: `${GOLD}2b` }}
              >
                <span className="lau-mono text-[6.5px] tracking-[0.26em]" style={{ color: GOLD_FAINT }}>
                  {String(i + 1).padStart(2, "0")} · {z.el}
                </span>
                <span className="text-[22px] leading-none transition-transform duration-300 group-hover:scale-110" style={{ color: GOLD_HI }}>
                  {z.g}
                </span>
                <span className="lau-serif text-[12px] tracking-[0.14em] uppercase" style={{ color: IVORY }}>
                  {z.name}
                </span>
                <span className="lau-mono text-[7px] tracking-[0.08em]" style={{ color: GOLD_DIM }}>
                  {z.dates}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ========================== HOW IT WORKS ========================== */}
        <section className="mt-14 lg:mt-20">
          <SectionHead index="03" title="Operating sequence — from data to destiny" right="FOUR STAGES · NO CARD REQUIRED" />
          <div className="relative">
            {/* engraved rail behind the medallions */}
            <span className="lau-rail absolute top-[27px] right-4 left-4 hidden md:block" aria-hidden />
            <ol className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
              {STEPS.map((s, i) => (
                <li key={s.n} className="relative flex flex-col items-center text-center">
                  <span className="lau-medallion relative z-10 flex h-14 w-14 items-center justify-center">
                    <svg viewBox="0 0 56 56" className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
                      <circle cx="28" cy="28" r="26" stroke={GOLD} strokeWidth="0.8" opacity="0.7" />
                      {ringTicks(28, 28, 22, 26, 24, i * 7).map((t, k) => (
                        <line key={k} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth="0.5" opacity="0.5" />
                      ))}
                      <circle cx="28" cy="28" r="18" stroke={GOLD} strokeWidth="0.5" strokeDasharray="1 3" opacity="0.6" />
                    </svg>
                    <span className="lau-serif text-[15px]" style={{ color: GOLD_HI }}>
                      {s.n}
                    </span>
                  </span>
                  <h3 className="lau-serif mt-4 text-[14.5px]" style={{ color: GOLD_HI }}>
                    {s.t}
                  </h3>
                  <p className="mt-1.5 max-w-[230px] text-[9.5px] leading-relaxed" style={{ color: `${IVORY}99` }}>
                    {s.c}
                  </p>
                  <p className="lau-mono mt-2 text-[6.5px] tracking-[0.24em]" style={{ color: GOLD_DIM }}>
                    {s.micro}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ======================== SIX ENGINE MODULES ====================== */}
        <section className="mt-14 lg:mt-20">
          <SectionHead index="04" title="Engine modules — six instruments, one account" right="MODULES 06 / 06 ONLINE" />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((m, i) => (
              <a key={m.title} href="#" className="lau-panel lau-action group flex flex-col p-4">
                <span className="flex items-center gap-3">
                  <span className="lau-inset flex h-10 w-10 items-center justify-center">
                    <MiniSigil i={i} size={24} />
                  </span>
                  <span className="lau-mono border px-1.5 py-0.5 text-[6.5px] tracking-[0.26em]" style={{ borderColor: `${GOLD}45`, color: GOLD }}>
                    {m.tag}
                  </span>
                  <span className="lau-mono ml-auto text-[6.5px] tracking-[0.2em]" style={{ color: GOLD_FAINT }}>
                    MOD-{String(i + 1).padStart(2, "0")}
                  </span>
                </span>
                <span className="lau-serif mt-4 text-[17px]" style={{ color: GOLD_HI }}>
                  {m.title}
                </span>
                <span className="mt-1.5 flex-1 text-[10px] leading-relaxed" style={{ color: `${IVORY}99` }}>
                  {m.copy}
                </span>
                <span className="lau-mono mt-4 flex items-center gap-2 border-t pt-2.5 text-[8px] tracking-[0.28em] uppercase" style={{ borderColor: `${GOLD}1f`, color: GOLD }}>
                  Explore <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  <span className="lau-panel-h-line" aria-hidden />
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ========================= DESTINY MATRIX ========================= */}
        <section className="lau-panel mt-14 lg:mt-20">
          <header className="lau-panel-h">
            <span style={{ color: GOLD }}>DESTINY MATRIX — OPTIONAL INSTRUMENT</span>
            <span className="lau-panel-h-line" aria-hidden />
            <span className="lau-mono text-[7.5px] tracking-[0.2em]" style={{ color: GOLD_DIM }}>
              8 VERTICES · 22 ARCANA PATHS · AGE CYCLES 0–80
            </span>
          </header>
          <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:gap-10 sm:p-8">
            <svg viewBox="0 0 120 120" className="h-36 w-36 shrink-0 sm:h-44 sm:w-44" fill="none" stroke={GOLD} aria-hidden>
              <circle cx="60" cy="60" r="54" strokeWidth="0.6" opacity="0.5" />
              {ringTicks(60, 60, 49, 54, 32).map((t, i) => (
                <line key={i} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} strokeWidth={t.major ? 0.8 : 0.35} opacity="0.6" />
              ))}
              <g className="lau-spin-c">
                <rect x="26" y="26" width="68" height="68" strokeWidth="0.9" opacity="0.85" />
                <rect x="26" y="26" width="68" height="68" strokeWidth="0.9" opacity="0.55" transform="rotate(45 60 60)" />
              </g>
              <circle cx="60" cy="60" r="16" strokeWidth="0.8" />
              <path d={starPath(60, 60, 8, 14, 5)} strokeWidth="0.6" opacity="0.7" />
              <circle cx="60" cy="60" r="3" fill={GOLD_HI} stroke="none" className="lau-pulse" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
                const p = polar(60, 60, 41, a - 90);
                return <circle key={i} cx={p.x} cy={p.y} r="1.6" fill={GOLD} stroke="none" opacity="0.85" />;
              })}
            </svg>
            <div className="min-w-0 text-center sm:text-left">
              <p className="lau-mono text-[7.5px] tracking-[0.32em] uppercase" style={{ color: GOLD_DIM }}>
                Fig. 08 — Octagram of Birth
              </p>
              <h3 className="lau-serif mt-2 text-[22px] sm:text-[26px]" style={{ color: GOLD_HI }}>
                Destiny Matrix
              </h3>
              <p className="mt-3 max-w-md text-[11px] leading-relaxed" style={{ color: `${IVORY}a8` }}>
                An optional birth-date octagram tool. It maps purpose, love, money, and age themes from your birth
                date.
              </p>
              <a href="#" className="lau-btn-ghost lau-mono mt-5 inline-block px-5 py-2.5 text-[8.5px] tracking-[0.24em] uppercase">
                Open Destiny Matrix →
              </a>
            </div>
          </div>
        </section>

        {/* ============================= TODAY ROW ========================== */}
        <section className="mt-14 lg:mt-20">
          <SectionHead index="05" title="Today — cycle readings" right="UPDATED 00:00 UTC" />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {/* moon today */}
            <div className="lau-panel flex items-center gap-4 p-4">
              <svg viewBox="0 0 48 48" className="h-14 w-14 shrink-0" fill="none" aria-hidden>
                <circle cx="24" cy="24" r="21" stroke={GOLD} strokeWidth="0.7" opacity="0.6" />
                {ringTicks(24, 24, 18, 21, 24).map((t, i) => (
                  <line key={i} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth="0.4" opacity="0.5" />
                ))}
                <circle cx="24" cy="24" r="13" stroke={GOLD} strokeWidth="0.8" />
                <path d={crescentPath(26.2, 24, 9.6)} fill={GOLD} stroke="none" opacity="0.85" />
              </svg>
              <div className="min-w-0">
                <p className="lau-mono text-[7px] tracking-[0.28em] uppercase" style={{ color: GOLD_DIM }}>
                  Moon today
                </p>
                <p className="lau-serif mt-1 text-[14px]" style={{ color: GOLD_HI }}>
                  Waxing Gibbous
                </p>
                <p className="lau-mono mt-1 text-[7.5px] tracking-[0.14em] tabular-nums" style={{ color: IVORY }}>
                  62% ILLUM · IN LEO ♌︎
                </p>
                <p className="lau-mono mt-0.5 text-[6.5px] tracking-[0.14em]" style={{ color: GOLD_FAINT }}>
                  HOUSE V — COURAGE FAVORED
                </p>
              </div>
            </div>
            {/* sign of the day */}
            <div className="lau-panel flex items-center gap-4 p-4">
              <span className="lau-inset flex h-14 w-14 shrink-0 items-center justify-center text-[26px]" style={{ color: GOLD_HI }}>
                {"♌" + GLYPH_FE0E}
              </span>
              <div className="min-w-0">
                <p className="lau-mono text-[7px] tracking-[0.28em] uppercase" style={{ color: GOLD_DIM }}>
                  Sign of the day
                </p>
                <p className="lau-serif mt-1 text-[14px]" style={{ color: GOLD_HI }}>
                  Leo
                </p>
                <p className="lau-mono mt-1 text-[7.5px] tracking-[0.14em]" style={{ color: IVORY }}>
                  JUL 23 – AUG 22 · FIRE
                </p>
                <p className="lau-mono mt-0.5 text-[6.5px] tracking-[0.14em]" style={{ color: GOLD_FAINT }}>
                  RULER ☉{GLYPH_FE0E} · FIXED MODALITY
                </p>
              </div>
            </div>
            {/* card of the day */}
            <div className="lau-panel flex items-center gap-4 p-4">
              <svg viewBox="0 0 40 56" className="h-14 w-10 shrink-0" fill="none" aria-hidden>
                <rect x="2" y="2" width="36" height="52" stroke={GOLD} strokeWidth="0.9" />
                <rect x="5" y="5" width="30" height="46" stroke={GOLD} strokeWidth="0.5" opacity="0.5" />
                <path d={starPath(20, 26, 8, 11, 4)} stroke={GOLD_HI} strokeWidth="0.8" />
                <circle cx="20" cy="26" r="2" fill={GOLD_HI} stroke="none" className="lau-pulse-slow" />
                <text x="20" y="48" textAnchor="middle" fontSize="6" fill={GOLD} fontFamily="Georgia, serif">
                  XVII
                </text>
              </svg>
              <div className="min-w-0">
                <p className="lau-mono text-[7px] tracking-[0.28em] uppercase" style={{ color: GOLD_DIM }}>
                  Card of the day
                </p>
                <p className="lau-serif mt-1 text-[14px]" style={{ color: GOLD_HI }}>
                  XVII — The Star
                </p>
                <p className="lau-mono mt-1 text-[7.5px] tracking-[0.14em]" style={{ color: IVORY }}>
                  HOPE · RENEWAL · GUIDANCE
                </p>
                <p className="lau-mono mt-0.5 text-[6.5px] tracking-[0.14em]" style={{ color: GOLD_FAINT }}>
                  MAJOR ARCANA · AQUARIUS PATH
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================= FAQ — ARCHIVE ========================== */}
        <section className="mt-14 lg:mt-20">
          <SectionHead index="06" title="Archive entries — frequently asked" right="4 RECORDS · PUBLIC" />
          <div className="lau-panel">
            <ul className="grid grid-cols-1 md:grid-cols-2">
              {ARCHIVE.map((e, i) => (
                <li
                  key={e.q}
                  className={`flex gap-4 p-5 ${i > 0 ? "border-t md:border-t-0" : ""} ${i % 2 === 1 ? "md:border-l" : ""} ${i > 1 ? "md:border-t" : ""}`}
                  style={{ borderColor: `${GOLD}1a` }}
                >
                  <span className="lau-mono shrink-0 text-[8px] tracking-[0.14em]" style={{ color: GOLD_FAINT }}>
                    REC-{String(i + 1).padStart(3, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="lau-serif block text-[13.5px]" style={{ color: GOLD_HI }}>
                      {e.q}
                    </span>
                    <span className="mt-1.5 block text-[9.5px] leading-relaxed" style={{ color: `${IVORY}99` }}>
                      {e.a}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ============================== CTA ============================== */}
        <section className="lau-panel relative mt-14 px-4 py-12 text-center sm:py-16 lg:mt-20">
          <svg viewBox="0 0 120 120" className="pointer-events-none absolute top-3 left-3 h-16 w-16 opacity-40" fill="none" stroke={GOLD} strokeWidth="0.8" aria-hidden>
            <path d="M 6 60 H 60 M 60 6 V 60" />
            <path d={compassPath(60, 60, 50, 12)} opacity="0.6" />
          </svg>
          <svg viewBox="0 0 120 120" className="pointer-events-none absolute right-3 bottom-3 h-16 w-16 rotate-180 opacity-40" fill="none" stroke={GOLD} strokeWidth="0.8" aria-hidden>
            <path d="M 6 60 H 60 M 60 6 V 60" />
            <path d={compassPath(60, 60, 50, 12)} opacity="0.6" />
          </svg>
          <p className="lau-mono text-[8px] tracking-[0.42em] uppercase" style={{ color: GOLD_DIM }}>
            Final Invocation · Seq. 000
          </p>
          <h2 className="lau-serif lau-glow mx-auto mt-4 max-w-2xl text-[28px] leading-snug sm:text-[38px]" style={{ color: GOLD_HI }}>
            Your chart is written in the stars. Come read it.
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="#" className="lau-btn lau-mono px-8 py-3.5 text-[10.5px] tracking-[0.26em] uppercase">
              Get started — it&rsquo;s free
            </a>
            <a href="#" className="lau-btn-ghost lau-mono px-7 py-3.5 text-[10.5px] tracking-[0.26em] uppercase">
              Cast your free birth chart
            </a>
          </div>
          <p className="lau-mono mt-5 text-[7.5px] tracking-[0.24em]" style={{ color: GOLD_DIM }}>
            NO CARD REQUIRED · ENGINE ACCESS IN UNDER 60 SECONDS
          </p>
        </section>

        {/* ============================= FOOTER ============================= */}
        <footer className="mt-14 lg:mt-20">
          <div className="lau-mono flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 border-y px-3 py-3 text-[8px] tracking-[0.26em] uppercase" style={{ borderColor: `${GOLD}2b`, color: GOLD }}>
            <span>22 Major Arcana</span>
            <span style={{ color: GOLD_FAINT }}>·</span>
            <span>12 Signs</span>
            <span style={{ color: GOLD_FAINT }}>·</span>
            <span>108 Archetypes</span>
          </div>
          <div className="lau-mono flex flex-wrap items-center gap-x-6 gap-y-1.5 px-1 py-4 text-[7.5px] tracking-[0.18em] uppercase" style={{ color: GOLD_DIM }}>
            <span style={{ color: GOLD }}>© 2026 ASTRO SCOPE — ALL FATES RESERVED</span>
            <nav className="flex items-center gap-4">
              {["Horoscopes", "Tarot", "Compatibility", "Sign In"].map((l) => (
                <a key={l} href="#" className="lau-navlink">
                  {l}
                </a>
              ))}
            </nav>
            <span className="ml-auto">AURUM BUILD 7.2.1 · ENGINE NOMINAL · RENDERED IN 0.042S</span>
          </div>
        </footer>
      </div>
    </main>
  );
}

/* ============================ SCOPED STYLES =============================== */

const LAU_CSS = `
.lau-root { font-family: Georgia, 'Times New Roman', serif; }
.lau-serif { font-family: Georgia, 'Times New Roman', serif; }
.lau-mono { font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace; }

.lau-panel {
  position: relative;
  border: 1px solid rgba(212,168,44,.28);
  background:
    linear-gradient(180deg, rgba(212,168,44,.055), rgba(212,168,44,0) 38%),
    rgba(16,11,6,.6);
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.65), 0 0 22px rgba(0,0,0,.4);
}
.lau-panel::after {
  content: "";
  position: absolute; inset: 3px;
  border: 1px solid rgba(212,168,44,.1);
  pointer-events: none;
}
.lau-inset {
  border: 1px solid rgba(212,168,44,.18);
  background: rgba(0,0,0,.35);
  box-shadow: inset 0 1px 4px rgba(0,0,0,.6);
}
.lau-panel-h {
  display: flex; align-items: center; gap: 10px;
  padding: 6px 10px;
  border-bottom: 1px solid rgba(212,168,44,.22);
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 8.5px; letter-spacing: .3em; text-transform: uppercase;
}
.lau-panel-h-line {
  flex: 1; height: 1px;
  background: linear-gradient(90deg, rgba(212,168,44,.4), rgba(212,168,44,.05));
}

.lau-navlink { color: rgba(233,223,200,.6); transition: color .25s ease; }
.lau-navlink:hover { color: #f0cf6b; }

.lau-btn {
  display: inline-block;
  color: #0a0705;
  background: linear-gradient(180deg, #f0cf6b, #d4a82c 55%, #a8841f);
  border: 1px solid #f0cf6b;
  box-shadow: 0 0 18px rgba(212,168,44,.35), inset 0 1px 0 rgba(255,244,214,.6);
  transition: box-shadow .3s ease;
}
.lau-btn:hover { box-shadow: 0 0 26px rgba(212,168,44,.55), inset 0 1px 0 rgba(255,244,214,.7); }
.lau-btn-ghost {
  display: inline-block;
  color: #d4a82c;
  border: 1px solid rgba(212,168,44,.5);
  background: rgba(212,168,44,.06);
  transition: background-color .3s ease, color .3s ease;
}
.lau-btn-ghost:hover { background: rgba(212,168,44,.14); color: #f0cf6b; }

.lau-action { transition: box-shadow .3s ease, background-color .3s ease; }
.lau-action:hover { background-color: rgba(212,168,44,.07); box-shadow: inset 0 0 18px rgba(212,168,44,.12); }

.lau-chip {
  border: 1px solid rgba(212,168,44,.45);
  background: rgba(10,7,5,.88);
  box-shadow: 0 0 14px rgba(0,0,0,.6), inset 0 0 8px rgba(212,168,44,.1);
}

/* vertical degree ruler on the hero's left edge */
.lau-ruler {
  position: absolute; left: 0; top: 2px; bottom: 2px; width: 10px;
  border-left: 1px solid rgba(212,168,44,.35);
  background-image: repeating-linear-gradient(180deg, rgba(212,168,44,.5) 0 1px, transparent 1px 11px);
  background-size: 6px 100%;
  background-repeat: no-repeat;
  opacity: .8;
}

/* engraved rail connecting the how-it-works medallions */
.lau-rail {
  height: 8px;
  border-top: 1px solid rgba(212,168,44,.4);
  border-bottom: 1px solid rgba(212,168,44,.14);
  background-image: repeating-linear-gradient(90deg, rgba(212,168,44,.55) 0 1px, transparent 1px 9px);
  background-size: 100% 4px;
  background-position: 0 2px;
  background-repeat: no-repeat;
}

.lau-medallion {
  background: #0a0705;
  border-radius: 9999px;
  box-shadow: 0 0 18px rgba(212,168,44,.22), inset 0 0 10px rgba(212,168,44,.14);
}

.lau-vignette {
  background:
    radial-gradient(1200px 500px at 78% -8%, rgba(212,168,44,.10), transparent 60%),
    radial-gradient(900px 600px at 8% 4%, rgba(212,168,44,.05), transparent 55%);
}

.lau-glow { text-shadow: 0 0 16px rgba(212,168,44,.45), 0 0 46px rgba(212,168,44,.2); }

::selection { background: rgba(212,168,44,.35); color: #fff6dd; }

/* ---------- slow, CSS-only motion (15–180s), reduced-motion guarded ------- */
@keyframes lauSpin { to { transform: rotate(360deg); } }
@keyframes lauSpinRev { to { transform: rotate(-360deg); } }
@keyframes lauPulse { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }
@keyframes lauTw { 0%, 100% { opacity: .15; } 50% { opacity: .8; } }

.lau-spin-a, .lau-spin-b, .lau-spin-c { transform-box: view-box; transform-origin: center; }

@media (prefers-reduced-motion: no-preference) {
  .lau-spin-a { animation: lauSpin 170s linear infinite; }
  .lau-spin-b { animation: lauSpinRev 130s linear infinite; }
  .lau-spin-c { animation: lauSpin 95s linear infinite; }
  .lau-pulse { animation: lauPulse 15s ease-in-out infinite; }
  .lau-pulse-slow { animation: lauPulse 22s ease-in-out infinite 4s; }
  .lau-tw0 { animation: lauTw 23s ease-in-out infinite; }
  .lau-tw1 { animation: lauTw 31s ease-in-out infinite 7s; }
  .lau-tw2 { animation: lauTw 27s ease-in-out infinite 13s; }
}
`;
