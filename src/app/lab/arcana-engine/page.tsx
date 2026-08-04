// LAB / ARCANA ENGINE — a design exploration of the production landing as an
// overloaded gold-on-black ENGINE dashboard ('ARCANA — SYSTEMS ARCANA VER
// 7.2.1'), after astro/Screenshot_20260804_230805.png: a massive concentric
// golden apparatus (PRIMA MATERIA) flanked by dense instrument columns —
// reservoir bars, ritual countdowns, celestial influence tables, sigil
// matrix, timeline chart, resonance radar, virtues & flaws, eclipse card —
// plus engine output strip, module tiles, zodiac band, destiny octagram,
// archive entries and the required landing copy woven in as small print.
// Fully self-contained: inline SVG, Tailwind for layout, one scoped <style>
// block (len- prefixed) for the rest. Server-component safe: no hooks, CSS
// animations only (slow 9–180s cycles, reduced-motion guarded).

import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Astro Scope — Arcana Engine",
  description:
    "Free birth chart, daily horoscopes, synastry and tarot — rendered as a gold-on-black arcana engine dashboard.",
};

const DEG = Math.PI / 180;

// gold-on-black engine palette
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

// engine-output waveform: layered sines, hand-tuned to look unstable-but-periodic
function wavePoints(w: number, h: number, n: number) {
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const x = (w / n) * i;
    const y =
      h / 2 -
      (Math.sin(i * 0.52) * 0.52 + Math.sin(i * 1.61) * 0.3 + Math.sin(i * 0.21 + 1.4) * 0.34) *
        (h * 0.4);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(" ");
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
  { g: "♈", name: "Aries", dates: "Mar 21 – Apr 19" },
  { g: "♉", name: "Taurus", dates: "Apr 20 – May 20" },
  { g: "♊", name: "Gemini", dates: "May 21 – Jun 20" },
  { g: "♋", name: "Cancer", dates: "Jun 21 – Jul 22" },
  { g: "♌", name: "Leo", dates: "Jul 23 – Aug 22" },
  { g: "♍", name: "Virgo", dates: "Aug 23 – Sep 22" },
  { g: "♎", name: "Libra", dates: "Sep 23 – Oct 22" },
  { g: "♏", name: "Scorpio", dates: "Oct 23 – Nov 21" },
  { g: "♐", name: "Sagittarius", dates: "Nov 22 – Dec 21" },
  { g: "♑", name: "Capricorn", dates: "Dec 22 – Jan 19" },
  { g: "♒", name: "Aquarius", dates: "Jan 20 – Feb 18" },
  { g: "♓", name: "Pisces", dates: "Feb 19 – Mar 20" },
].map((z) => ({ ...z, g: z.g + GLYPH_FE0E }));

const PLANETS = [
  { g: "☉", name: "SOL", v: "+78.2", up: true },
  { g: "☽", name: "LUNA", v: "+66.5", up: true },
  { g: "☿", name: "MERCURIUS", v: "+22.1", up: true },
  { g: "♀", name: "VENUS", v: "+41.7", up: true },
  { g: "♂", name: "MARS", v: "−36.8", up: false },
  { g: "♃", name: "JUPITER", v: "+51.3", up: true },
  { g: "♄", name: "SATURNUS", v: "−28.9", up: false },
  { g: "♅", name: "URANUS", v: "−12.4", up: false },
  { g: "♆", name: "NEPTUNUS", v: "−18.7", up: false },
  { g: "♇", name: "PLUTO", v: "−8.1", up: false },
].map((p) => ({ ...p, g: p.g + GLYPH_FE0E }));

const RESERVOIR = [
  { g: "☉", name: "SOLAR ESSENCE", pct: 78.4 },
  { g: "☽", name: "LUNAR ESSENCE", pct: 61.2 },
  { g: "✶", name: "AETHER FLOW", pct: 42.7 },
  { g: "◐", name: "SHADOW VEIL", pct: 24.1 },
  { g: "△", name: "PRIMAL FIRE", pct: 57.8 },
].map((r) => ({ ...r, g: r.g + GLYPH_FE0E }));

const RITUALS = [
  { name: "SYNODIC CONVERGENCE", sub: "Grand Harmonization", t: "01:24:17" },
  { name: "VEIL BREACHING", sub: "Threshold Invocation", t: "02:17:33" },
  { name: "EMBER OF REMEMBRANCE", sub: "Memory Weaving", t: "03:42:08" },
];

const SYSSTATUS = [
  { name: "ENGINE", state: "ONLINE" },
  { name: "ORACLE", state: "ONLINE" },
  { name: "SENTRY", state: "ONLINE" },
  { name: "ARCHIVE", state: "SYNCED" },
  { name: "REALM LINK", state: "STABLE" },
];

const VIRTUES = [
  { name: "CLARITY", v: "+14", good: true },
  { name: "DISCIPLINE", v: "+12", good: true },
  { name: "COMPASSION", v: "+9", good: true },
  { name: "IMPULSE", v: "−7", good: false },
  { name: "PRIDE", v: "−9", good: false },
  { name: "DOUBT", v: "−11", good: false },
];

// resonance radar: 6 axes, values 0–100, starting at top, clockwise
const AXES = [
  { name: "MIND", v: 88 },
  { name: "SPIRIT", v: 74 },
  { name: "BODY", v: 52 },
  { name: "SOUL", v: 63 },
  { name: "FATE", v: 91 },
  { name: "MAGIC", v: 94 },
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

const FEED = [
  { t: "2m ago", s: "The Star aligned with The Tower" },
  { t: "11m ago", s: "The Empress rises in House IV" },
  { t: "17m ago", s: "Umbra flux detected in Sector VII" },
  { t: "23m ago", s: "New insight available for WATER signs" },
];

/* ============================ PRECOMPUTED SVG ============================= */

const rnd = lcg(20260804);
const STARS = Array.from({ length: 120 }, () => ({
  x: +(rnd() * 1600).toFixed(0),
  y: +(rnd() * 1000).toFixed(0),
  r: +(0.4 + rnd() * 0.9).toFixed(2),
  o: +(0.12 + rnd() * 0.4).toFixed(2),
  g: Math.floor(rnd() * 3),
}));

const ENGINE_STARS = Array.from({ length: 70 }, () => ({
  x: +(rnd() * 640).toFixed(0),
  y: +(rnd() * 640).toFixed(0),
  r: +(0.4 + rnd() * 0.8).toFixed(2),
  o: +(0.1 + rnd() * 0.35).toFixed(2),
  g: Math.floor(rnd() * 3),
}));

const WAVE = wavePoints(360, 84, 96);
const WAVE_SOFT = wavePoints(360, 84, 48);

// timeline chart points (viewBox 320x150, plot area y 20..115)
const TIMELINE = [
  { label: "PAST", x: 26, y: 96 },
  { label: "PRESENT", x: 92, y: 62 },
  { label: "POTENTIAL", x: 168, y: 78 },
  { label: "FATED", x: 238, y: 34 },
  { label: "BEYOND", x: 300, y: 52 },
];
const TIMELINE_PATH = TIMELINE.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

// radar polygon for AXES values (center 110,92 r 64)
function radarPath(rMax: number, scale: number[]) {
  return (
    AXES.map((a, i) => {
      const p = polar(110, 92, rMax * (scale[i] ?? 1), -90 + i * 60);
      return `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`;
    }).join(" ") + " Z"
  );
}
const RADAR_VALUE = radarPath(64, AXES.map((a) => a.v / 100));

// calibration gauge: 240° sweep from -210° to 30°, value 7.2 / 10
const GAUGE_CX = 70;
const GAUGE_CY = 66;
const GAUGE_R = 46;
const gaugeStart = polar(GAUGE_CX, GAUGE_CY, GAUGE_R, -210);
const gaugeEnd = polar(GAUGE_CX, GAUGE_CY, GAUGE_R, 30);
const gaugeValEnd = polar(GAUGE_CX, GAUGE_CY, GAUGE_R, -210 + 240 * 0.72);
const gaugeNeedle = polar(GAUGE_CX, GAUGE_CY, GAUGE_R - 12, -210 + 240 * 0.72);

/* ============================== SMALL PIECES ============================== */

function Panel({
  title,
  right,
  children,
  className = "",
  bodyClass = "p-2.5",
}: {
  title: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClass?: string;
}) {
  return (
    <section className={`len-panel ${className}`}>
      <header className="len-panel-h">
        <span style={{ color: GOLD }}>{title}</span>
        <span className="len-panel-h-line" aria-hidden />
        {right ? (
          <span className="len-mono text-[8px] tracking-[0.2em]" style={{ color: GOLD_DIM }}>
            {right}
          </span>
        ) : null}
      </header>
      <div className={bodyClass}>{children}</div>
    </section>
  );
}

// tiny engraved sigil for list bullets / queue rows
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

// bar with engraved tick overlay
function ReservoirBar({ pct }: { pct: number }) {
  return (
    <div className="len-bar relative mt-1 h-[5px]">
      <i className="absolute inset-y-0 left-0" style={{ width: `${pct}%` }} />
      <span className="len-bar-ticks absolute inset-0" aria-hidden />
    </div>
  );
}

/* ================================= PAGE =================================== */

export default function ArcanaEnginePage() {
  return (
    <main className="len-root relative min-h-screen overflow-hidden" style={{ background: INK, color: IVORY }}>
      <style>{LEN_CSS}</style>

      {/* ---- starfield backdrop, fixed behind everything ---- */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        {STARS.map((s, i) => (
          <circle key={i} className={`len-tw${s.g}`} cx={s.x} cy={s.y} r={s.r} fill={IVORY} opacity={s.o} />
        ))}
        <g stroke={GOLD} fill="none" opacity="0.05">
          <circle cx="1380" cy="180" r="260" />
          <circle cx="1380" cy="180" r="320" strokeDasharray="1 7" />
          <circle cx="120" cy="880" r="220" strokeDasharray="1 6" />
        </g>
      </svg>

      <div className="relative mx-auto max-w-[1720px] px-2 py-2 sm:px-3">
        {/* ======================= TOP STATUS BAR ======================= */}
        <header className="len-panel flex flex-wrap items-center gap-x-5 gap-y-2 px-3 py-2">
          <a href="#" className="flex items-center gap-2.5">
            <svg viewBox="0 0 30 30" className="h-6 w-6" fill="none" stroke={GOLD} strokeWidth="1" aria-hidden>
              <path d={polyPath(15, 16, 12, 3)} />
              <circle cx="15" cy="16" r="5.4" />
              <circle cx="15" cy="16" r="1.6" fill={GOLD} stroke="none" />
            </svg>
            <span className="leading-none">
              <span className="len-serif block text-[15px] font-semibold tracking-[0.32em]" style={{ color: GOLD_HI }}>
                ARCANA
              </span>
              <span className="len-mono mt-1 block text-[7px] tracking-[0.3em]" style={{ color: GOLD_DIM }}>
                SYSTEMS ARCANA VER 7.2.1
              </span>
            </span>
          </a>

          <nav className="len-mono order-3 flex w-full items-center gap-1 overflow-x-auto text-[9px] tracking-[0.24em] uppercase md:order-none md:w-auto md:flex-1 md:justify-center">
            {["Observatory", "Arcana Engine", "Codex", "Rituals", "Chronicle", "Map of Fates"].map((t) => (
              <a key={t} href="#" className={`len-tab ${t === "Arcana Engine" ? "len-tab-on" : ""}`}>
                {t}
              </a>
            ))}
          </nav>

          <div className="len-mono ml-auto text-right text-[8px] leading-relaxed tracking-[0.22em] md:ml-0">
            <span className="block" style={{ color: GOLD_HI }}>
              SOLARIS PRIME
            </span>
            <span className="block" style={{ color: GOLD_DIM }}>
              CYCLE 7, DAY 195 · 22:47:11 LOCAL
            </span>
          </div>
        </header>

        {/* ======================= SITE NAV (ASTRO SCOPE) ======================= */}
        <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 border px-3 py-2" style={{ borderColor: `${GOLD}22`, background: "rgba(212,168,44,0.03)" }}>
          <a href="#" className="len-mono flex items-baseline gap-2 text-[10px] tracking-[0.34em] uppercase" style={{ color: IVORY }}>
            <span style={{ color: GOLD }}>✶{GLYPH_FE0E}</span> ASTRO&nbsp;SCOPE
          </a>
          <nav className="len-mono flex items-center gap-5 text-[9px] tracking-[0.22em] uppercase">
            {["Horoscopes", "Tarot", "Compatibility"].map((l) => (
              <a key={l} href="#" className="len-navlink">
                {l}
              </a>
            ))}
          </nav>
          <div className="len-mono ml-auto flex items-center gap-4 text-[9px] tracking-[0.22em] uppercase">
            <span className="hidden md:inline" style={{ color: GOLD_DIM }}>
              FREE TIER ACTIVE · NO CARD REQUIRED
            </span>
            <a href="#" className="len-btn-ghost px-3 py-1.5">
              Sign&nbsp;In
            </a>
          </div>
        </div>

        {/* ========================= MAIN DASHBOARD ========================= */}
        <div className="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-[290px_minmax(0,1fr)] xl:grid-cols-[290px_minmax(0,1fr)_336px]">
          {/* ======================= LEFT COLUMN ======================= */}
          <div className="flex min-w-0 flex-col gap-2">
            {/* CURRENT ALIGNMENT */}
            <Panel title="CURRENT ALIGNMENT" right="SEQ. 114-A">
              <div className="flex items-start gap-3">
                <svg viewBox="0 0 64 64" className="h-14 w-14 shrink-0" fill="none" stroke={GOLD} strokeWidth="1" aria-hidden>
                  <path d={polyPath(32, 34, 26, 3)} opacity="0.9" />
                  <path d={polyPath(32, 30, 26, 3, 90)} opacity="0.55" />
                  <circle cx="32" cy="32" r="8" />
                  <circle cx="32" cy="32" r="2.4" fill={GOLD} stroke="none" className="len-pulse" />
                </svg>
                <div>
                  <p className="len-serif text-[15px] leading-tight" style={{ color: GOLD_HI }}>
                    The Gilded Balance
                  </p>
                  <p className="len-mono mt-1 text-[8px] tracking-[0.26em]" style={{ color: GOLD }}>
                    STATE: STABLE
                  </p>
                  <p className="mt-1.5 text-[9.5px] leading-relaxed opacity-70">
                    Equilibrium between celestial currents favors insight and transformation. The path is illuminated.
                  </p>
                </div>
              </div>
              <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                {[
                  { n: "LIGHT", v: "68", d: 0.68 },
                  { n: "VOID", v: "−32", d: 0.32 },
                  { n: "CHAOS", v: "−12", d: 0.12 },
                ].map((g) => (
                  <div key={g.n} className="len-inset flex flex-col items-center py-1.5">
                    <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none" aria-hidden>
                      <circle cx="20" cy="20" r="15" stroke={GOLD_FAINT} strokeWidth="2.4" />
                      <circle
                        cx="20"
                        cy="20"
                        r="15"
                        stroke={GOLD}
                        strokeWidth="2.4"
                        strokeDasharray={`${(g.d * 94.2).toFixed(1)} 94.2`}
                        transform="rotate(-90 20 20)"
                      />
                      {ringTicks(20, 20, 17.5, 19.5, 12).map((t, i) => (
                        <line key={i} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD_DIM} strokeWidth="0.5" />
                      ))}
                    </svg>
                    <span className="len-mono mt-0.5 text-[8px] tracking-[0.2em]" style={{ color: GOLD_DIM }}>
                      {g.n} <span style={{ color: GOLD_HI }}>{g.v}</span>
                    </span>
                  </div>
                ))}
              </div>
            </Panel>

            {/* ARCANA RESERVOIR */}
            <Panel title="ARCANA RESERVOIR" right="CAP. 5/5">
              <ul className="space-y-2.5">
                {RESERVOIR.map((r) => (
                  <li key={r.name}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="len-mono flex items-center gap-1.5 text-[8.5px] tracking-[0.18em]" style={{ color: IVORY }}>
                        <span style={{ color: GOLD }}>{r.g}</span> {r.name}
                      </span>
                      <span className="len-mono text-[9px]" style={{ color: GOLD_HI }}>
                        {r.pct.toFixed(1)}%
                      </span>
                    </div>
                    <ReservoirBar pct={r.pct} />
                  </li>
                ))}
              </ul>
              <p className="len-mono mt-2.5 border-t pt-1.5 text-[7.5px] tracking-[0.18em]" style={{ borderColor: `${GOLD}1f`, color: GOLD_DIM }}>
                DRAW RATE 0.42 TU/S · REPLENISHMENT NOMINAL
              </p>
            </Panel>

            {/* RITUAL QUEUE */}
            <Panel title="RITUAL QUEUE" right="3 / 6">
              <ul className="space-y-2">
                {RITUALS.map((r, i) => (
                  <li key={r.name} className="len-inset flex items-center gap-2.5 px-2 py-1.5">
                    <MiniSigil i={i} />
                    <span className="min-w-0 flex-1">
                      <span className="len-mono block truncate text-[8.5px] tracking-[0.14em]" style={{ color: IVORY }}>
                        {r.name}
                      </span>
                      <span className="block text-[8px] italic opacity-55">{r.sub}</span>
                    </span>
                    <span className="len-mono text-[10px] tabular-nums" style={{ color: GOLD_HI }}>
                      {r.t}
                    </span>
                  </li>
                ))}
              </ul>
              <a href="#" className="len-mono mt-2 block border-t pt-1.5 text-center text-[8px] tracking-[0.3em] uppercase" style={{ borderColor: `${GOLD}1f`, color: GOLD }}>
                View Full Schedule
              </a>
            </Panel>

            {/* SYSTEM STATUS */}
            <Panel title="SYSTEM STATUS" bodyClass="p-0" className="mt-auto">
              <div className="grid grid-cols-5">
                {SYSSTATUS.map((s, i) => (
                  <div
                    key={s.name}
                    className={`flex flex-col items-center gap-1 py-2 ${i > 0 ? "border-l" : ""}`}
                    style={{ borderColor: `${GOLD}1f` }}
                  >
                    <MiniSigil i={i + 2} size={16} />
                    <span className="len-mono text-[6.5px] tracking-[0.16em]" style={{ color: GOLD_DIM }}>
                      {s.name}
                    </span>
                    <span className="len-mono text-[7px] tracking-[0.14em]" style={{ color: GOLD_HI }}>
                      ● {s.state}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          {/* ======================= CENTER: PRIMA MATERIA ======================= */}
          <div className="len-panel flex min-w-0 flex-col">
            <header className="len-panel-h justify-center">
              <span className="len-mono text-[8px] tracking-[0.2em]" style={{ color: GOLD_DIM }}>
                FIG. 07 — CORE ASSEMBLY
              </span>
              <span className="len-panel-h-line" aria-hidden />
              <span className="len-serif text-[11px] tracking-[0.4em]" style={{ color: GOLD_HI }}>
                △ PRIMA MATERIA △
              </span>
              <span className="len-panel-h-line" aria-hidden />
              <span className="len-mono text-[8px] tracking-[0.2em]" style={{ color: GOLD_DIM }}>
                RING SYNC 99.2%
              </span>
            </header>

            {/* primary CTA command strip */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-3 py-2" style={{ borderColor: `${GOLD}22` }}>
              <span className="len-mono text-[8px] tracking-[0.28em] uppercase" style={{ color: GOLD_DIM }}>
                Primary Directive
              </span>
              <a href="#" className="len-btn len-mono px-4 py-1.5 text-[9.5px] tracking-[0.24em] uppercase">
                Cast your free birth chart
              </a>
              <span className="len-mono ml-auto hidden text-[7.5px] tracking-[0.18em] md:inline" style={{ color: GOLD_DIM }}>
                LAT 51.5072 N · LON 0.1276 W · ΔT +0.042S · HOUSES: PLACIDUS
              </span>
            </div>

            <div className="grid flex-1 grid-cols-1 md:grid-cols-[168px_minmax(0,1fr)]">
              {/* celestial influence + sigil matrix */}
              <div className="flex flex-col border-b md:border-r md:border-b-0" style={{ borderColor: `${GOLD}22` }}>
                <div className="border-b px-2.5 py-2" style={{ borderColor: `${GOLD}22` }}>
                  <p className="len-mono mb-1.5 text-[8px] tracking-[0.26em]" style={{ color: GOLD }}>
                    CELESTIAL INFLUENCE
                  </p>
                  <ul className="space-y-[3px]">
                    {PLANETS.map((p) => (
                      <li key={p.name} className="flex items-baseline gap-1.5">
                        <span className="w-3 text-[9px]" style={{ color: GOLD }}>
                          {p.g}
                        </span>
                        <span className="len-mono flex-1 text-[7.5px] tracking-[0.14em]" style={{ color: IVORY }}>
                          {p.name}
                        </span>
                        <span className="len-mono text-[8px] tabular-nums" style={{ color: p.up ? GOLD_HI : EMBER }}>
                          {p.v}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="len-mono mt-1.5 text-[6.5px] tracking-[0.16em]" style={{ color: GOLD_DIM }}>
                    NET INFLUX +183.6 · ASPECT Δ 4°12&prime;
                  </p>
                </div>
                <div className="flex-1 px-2.5 py-2">
                  <p className="len-mono mb-1.5 text-[8px] tracking-[0.26em]" style={{ color: GOLD }}>
                    SIGIL MATRIX
                  </p>
                  <div className="grid grid-cols-4 gap-1">
                    {Array.from({ length: 12 }, (_, i) => (
                      <span
                        key={i}
                        className={`len-inset flex items-center justify-center py-1 ${i < 7 ? "len-sigil-on" : "opacity-40"}`}
                      >
                        <MiniSigil i={i + 1} size={17} />
                      </span>
                    ))}
                  </div>
                  <p className="len-mono mt-1.5 text-center text-[7px] tracking-[0.24em]" style={{ color: GOLD_DIM }}>
                    ACTIVE SIGILS&nbsp;&nbsp;07 / 12
                  </p>
                </div>
              </div>

              {/* the apparatus */}
              <div className="relative flex items-center justify-center p-1">
                <svg viewBox="0 0 640 640" className="h-auto w-full max-w-[640px]" fill="none" aria-hidden>
                  {/* engine starfield */}
                  {ENGINE_STARS.map((s, i) => (
                    <circle key={i} className={`len-tw${s.g}`} cx={s.x} cy={s.y} r={s.r} fill={IVORY} opacity={s.o} />
                  ))}

                  {/* outer static rings + ticks */}
                  <circle cx="320" cy="320" r="308" stroke={GOLD} strokeWidth="0.8" opacity="0.5" />
                  <circle cx="320" cy="320" r="300" stroke={GOLD} strokeWidth="0.5" strokeDasharray="1 5" opacity="0.45" />
                  {ringTicks(320, 320, 288, 298, 96).map((t, i) => (
                    <line key={`ot${i}`} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth={t.major ? 1 : 0.4} opacity={t.major ? 0.8 : 0.4} />
                  ))}
                  {/* zodiac glyph ring */}
                  {ZODIAC.map((z, i) => {
                    const p = polar(320, 320, 272, -90 + i * 30);
                    return (
                      <text key={z.name} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="12" fill={GOLD} opacity="0.75">
                        {z.g}
                      </text>
                    );
                  })}
                  <circle cx="320" cy="320" r="258" stroke={GOLD} strokeWidth="0.5" opacity="0.4" />

                  {/* axis lines */}
                  <path d="M 12 320 H 628 M 320 12 V 628" stroke={GOLD} strokeWidth="0.4" strokeDasharray="3 7" opacity="0.35" />

                  {/* rotating group A — outer orbit ring with nodes */}
                  <g className="len-spin-a">
                    <circle cx="320" cy="320" r="238" stroke={GOLD} strokeWidth="0.7" strokeDasharray="10 4 2 4" opacity="0.6" />
                    {[15, 105, 200, 288].map((a, i) => {
                      const p = polar(320, 320, 238, a);
                      return (
                        <g key={`na${i}`}>
                          <circle cx={p.x} cy={p.y} r={i % 2 ? 4.5 : 6.5} stroke={GOLD} strokeWidth="0.8" fill={INK} />
                          <circle cx={p.x} cy={p.y} r={i % 2 ? 1.4 : 2.2} fill={GOLD_HI} stroke="none" />
                        </g>
                      );
                    })}
                    {[60, 150, 245, 335].map((a, i) => {
                      const p = polar(320, 320, 238, a);
                      return <rect key={`sa${i}`} x={p.x - 3} y={p.y - 3} width="6" height="6" stroke={GOLD} strokeWidth="0.7" transform={`rotate(45 ${p.x} ${p.y})`} opacity="0.8" />;
                    })}
                  </g>

                  {/* rotating group B — counter ring, moon crescents riding it */}
                  <g className="len-spin-b">
                    <circle cx="320" cy="320" r="196" stroke={GOLD} strokeWidth="0.6" opacity="0.55" />
                    {ringTicks(320, 320, 190, 196, 48).map((t, i) => (
                      <line key={`bt${i}`} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth="0.4" opacity="0.4" />
                    ))}
                    {[0, 120, 240].map((a, i) => {
                      const p = polar(320, 320, 196, a);
                      return <path key={`cb${i}`} d={crescentPath(p.x, p.y, 9)} stroke={GOLD} strokeWidth="0.9" fill="rgba(212,168,44,0.14)" transform={`rotate(${a + 90} ${p.x} ${p.y})`} />;
                    })}
                    {[60, 180, 300].map((a, i) => {
                      const p = polar(320, 320, 196, a);
                      return <circle key={`nb${i}`} cx={p.x} cy={p.y} r="3.4" fill={GOLD} stroke="none" opacity="0.85" />;
                    })}
                  </g>

                  {/* static mid rings */}
                  <circle cx="320" cy="320" r="164" stroke={GOLD} strokeWidth="0.8" opacity="0.6" />
                  <circle cx="320" cy="320" r="156" stroke={GOLD} strokeWidth="0.4" strokeDasharray="1 4" opacity="0.5" />
                  {ringTicks(320, 320, 148, 156, 60, 3).map((t, i) => (
                    <line key={`mt${i}`} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth={t.major ? 0.9 : 0.35} opacity={t.major ? 0.7 : 0.35} />
                  ))}

                  {/* rotating group C — inner dashed ring */}
                  <g className="len-spin-c">
                    <circle cx="320" cy="320" r="128" stroke={GOLD} strokeWidth="0.7" strokeDasharray="2 6" opacity="0.65" />
                    {[30, 150, 270].map((a, i) => {
                      const p = polar(320, 320, 128, a);
                      return (
                        <g key={`nc${i}`}>
                          <circle cx={p.x} cy={p.y} r="5" stroke={GOLD} strokeWidth="0.8" fill={INK} />
                          <circle cx={p.x} cy={p.y} r="1.5" fill={GOLD_HI} stroke="none" />
                        </g>
                      );
                    })}
                  </g>

                  {/* hexagram core frame */}
                  <path d={polyPath(320, 320, 96, 3)} stroke={GOLD} strokeWidth="0.9" opacity="0.85" />
                  <path d={polyPath(320, 320, 96, 3, 90)} stroke={GOLD} strokeWidth="0.9" opacity="0.55" />
                  <circle cx="320" cy="320" r="58" stroke={GOLD} strokeWidth="0.8" opacity="0.8" />
                  <circle cx="320" cy="320" r="50" stroke={GOLD} strokeWidth="0.4" strokeDasharray="1 3" opacity="0.6" />

                  {/* sun core with slow-breathing rays */}
                  <g className="len-pulse-slow" style={{ transformBox: "view-box", transformOrigin: "center" }}>
                    {ringTicks(320, 320, 22, 40, 24).map((t, i) => (
                      <line key={`ray${i}`} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD_HI} strokeWidth={i % 2 ? 0.5 : 1} opacity="0.9" />
                    ))}
                  </g>
                  <circle cx="320" cy="320" r="16" stroke={GOLD_HI} strokeWidth="1" fill="rgba(212,168,44,0.2)" />
                  <circle cx="320" cy="320" r="7" fill={GOLD_HI} stroke="none" className="len-pulse" />
                  <circle cx="320" cy="320" r="30" stroke={GOLD} strokeWidth="0.4" opacity="0.5" />

                  {/* cardinal sigils on axis ends */}
                  {([-90, 0, 90, 180] as number[]).map((a, i) => {
                    const p = polar(320, 320, 224, a);
                    return <path key={`cs${i}`} d={starPath(p.x, p.y, 4, 7, 2.4)} stroke={GOLD} strokeWidth="0.7" opacity="0.8" />;
                  })}

                  {/* large flanking crescents */}
                  <g>
                    <circle cx="52" cy="320" r="24" stroke={GOLD} strokeWidth="0.8" opacity="0.7" />
                    <path d={crescentPath(52, 320, 15)} stroke={GOLD} strokeWidth="1" fill="rgba(212,168,44,0.16)" />
                    <circle cx="588" cy="320" r="24" stroke={GOLD} strokeWidth="0.8" opacity="0.7" />
                    <path d={crescentPath(588, 320, 15)} stroke={GOLD} strokeWidth="1" fill="rgba(212,168,44,0.16)" transform="rotate(180 588 320)" />
                  </g>

                  {/* corner compass roses */}
                  {[
                    { x: 84, y: 556 },
                    { x: 556, y: 556 },
                  ].map((c, i) => (
                    <g key={`cr${i}`} opacity="0.85">
                      <circle cx={c.x} cy={c.y} r="30" stroke={GOLD} strokeWidth="0.7" />
                      <circle cx={c.x} cy={c.y} r="24" stroke={GOLD} strokeWidth="0.4" strokeDasharray="1 3" />
                      <path d={compassPath(c.x, c.y, 26, 7)} stroke={GOLD} strokeWidth="0.7" fill="rgba(212,168,44,0.08)" />
                      <circle cx={c.x} cy={c.y} r="3" fill={GOLD} stroke="none" />
                      <text x={c.x} y={c.y - 33} textAnchor="middle" fontSize="7" fill={GOLD_DIM} className="len-mono">N</text>
                      <text x={c.x} y={c.y + 40} textAnchor="middle" fontSize="7" fill={GOLD_DIM} className="len-mono">S</text>
                      <text x={c.x - 36} y={c.y + 2} textAnchor="middle" fontSize="7" fill={GOLD_DIM} className="len-mono">W</text>
                      <text x={c.x + 36} y={c.y + 2} textAnchor="middle" fontSize="7" fill={GOLD_DIM} className="len-mono">E</text>
                    </g>
                  ))}

                  {/* arc degree labels */}
                  {["000°", "090°", "180°", "270°"].map((t, i) => {
                    const p = polar(320, 320, 316, -90 + i * 90);
                    return (
                      <text key={`dl${i}`} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="7" fill={GOLD_DIM} className="len-mono">
                        {t}
                      </text>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* caption under apparatus */}
            <div className="flex items-center gap-3 border-t px-3 py-2" style={{ borderColor: `${GOLD}22` }}>
              <span className="len-panel-h-line" aria-hidden />
              <span className="text-center">
                <span className="len-mono block text-[9px] tracking-[0.42em]" style={{ color: GOLD }}>
                  UMBRA ORIGIN
                </span>
                <span className="len-mono mt-0.5 block text-[7px] tracking-[0.3em]" style={{ color: GOLD_DIM }}>
                  THE WELL OF POSSIBILITIES · RESONANCE LOCKED
                </span>
              </span>
              <span className="len-panel-h-line" aria-hidden />
            </div>
          </div>

          {/* ======================= RIGHT COLUMN ======================= */}
          <div className="flex min-w-0 flex-col gap-2 lg:col-span-2 xl:col-span-1">
            {/* PATH OF BECOMING */}
            <Panel title="PATH OF BECOMING" right="TIMELINE PROJECTION">
              <svg viewBox="0 0 320 150" className="h-auto w-full" fill="none" aria-hidden>
                {/* grid */}
                {[35, 65, 95].map((y) => (
                  <line key={y} x1="14" y1={y} x2="312" y2={y} stroke={GOLD} strokeWidth="0.3" strokeDasharray="2 5" opacity="0.3" />
                ))}
                {[0.25, 0.5, 0.75].map((f, i) => (
                  <text key={i} x="4" y={98 - i * 30} fontSize="6" fill={GOLD_DIM} className="len-mono">
                    {f.toFixed(2)}
                  </text>
                ))}
                {/* today marker */}
                <line x1="92" y1="18" x2="92" y2="120" stroke={GOLD_HI} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.7" />
                <path d={TIMELINE_PATH} stroke={GOLD} strokeWidth="1.1" />
                <path d={`${TIMELINE_PATH} L 300 120 L 26 120 Z`} fill="rgba(212,168,44,0.07)" stroke="none" />
                {TIMELINE.map((p, i) => (
                  <g key={p.label}>
                    <circle cx={p.x} cy={p.y} r={i === 3 ? 4.5 : 3} stroke={GOLD_HI} strokeWidth="0.8" fill={INK} />
                    <circle cx={p.x} cy={p.y} r="1.2" fill={GOLD_HI} stroke="none" />
                    <text x={p.x} y="134" textAnchor="middle" fontSize="6.5" fill={i === 3 ? GOLD_HI : GOLD_DIM} className="len-mono" letterSpacing="1">
                      {p.label}
                    </text>
                  </g>
                ))}
                <text x="238" y="24" textAnchor="middle" fontSize="6.5" fill={GOLD_HI} className="len-mono">APEX 0.94</text>
              </svg>
            </Panel>

            {/* RESONANCE CHART + VIRTUES & FLAWS side by side */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Panel title="RESONANCE CHART" bodyClass="p-1.5">
                <svg viewBox="0 0 220 178" className="h-auto w-full" fill="none" aria-hidden>
                  {[0.25, 0.5, 0.75, 1].map((f) => (
                    <path key={f} d={radarPath(64, AXES.map(() => f))} stroke={GOLD} strokeWidth="0.4" opacity={f === 1 ? 0.6 : 0.28} strokeDasharray={f === 1 ? "" : "2 4"} />
                  ))}
                  {AXES.map((a, i) => {
                    const p = polar(110, 92, 64, -90 + i * 60);
                    return <line key={a.name} x1="110" y1="92" x2={p.x} y2={p.y} stroke={GOLD} strokeWidth="0.3" opacity="0.35" />;
                  })}
                  <path d={RADAR_VALUE} stroke={GOLD_HI} strokeWidth="1" fill="rgba(212,168,44,0.16)" />
                  {AXES.map((a, i) => {
                    const p = polar(110, 92, 64 * (a.v / 100), -90 + i * 60);
                    return <circle key={`pt${a.name}`} cx={p.x} cy={p.y} r="2" fill={GOLD_HI} stroke="none" />;
                  })}
                  {AXES.map((a, i) => {
                    const p = polar(110, 92, 78, -90 + i * 60);
                    return (
                      <text key={`lb${a.name}`} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="6.5" fill={GOLD_DIM} className="len-mono" letterSpacing="1">
                        {a.name} {a.v}
                      </text>
                    );
                  })}
                </svg>
              </Panel>

              <Panel title="VIRTUES & FLAWS" bodyClass="p-1.5">
                <ul className="space-y-[5px] px-1 py-0.5">
                  {VIRTUES.map((v, i) => (
                    <li key={v.name} className="flex items-center gap-1.5">
                      <MiniSigil i={v.good ? i : i + 3} size={13} />
                      <span className="len-mono flex-1 text-[8px] tracking-[0.16em]" style={{ color: IVORY }}>
                        {v.name}
                      </span>
                      <span className="len-mono text-[8.5px] tabular-nums" style={{ color: v.good ? GOLD_HI : EMBER }}>
                        {v.v}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="len-mono mt-1 border-t px-1 pt-1 text-[6.5px] tracking-[0.16em]" style={{ borderColor: `${GOLD}1f`, color: GOLD_DIM }}>
                  NET VIRTUE Δ +8 · ASCENDING
                </p>
              </Panel>
            </div>

            {/* ACTIVE READINGS — eclipse card */}
            <Panel title="ACTIVE READINGS" right="1 RUNNING">
              <div className="flex gap-3">
                <svg viewBox="0 0 84 84" className="h-[76px] w-[76px] shrink-0" fill="none" aria-hidden>
                  <circle cx="42" cy="42" r="34" stroke={GOLD} strokeWidth="0.5" strokeDasharray="1 4" opacity="0.5" />
                  <circle cx="42" cy="42" r="24" fill="rgba(212,168,44,0.85)" className="len-pulse-slow" />
                  <circle cx="50" cy="38" r="22" fill={INK} stroke={GOLD} strokeWidth="0.8" />
                  {ringTicks(42, 42, 28, 33, 16).map((t, i) => (
                    <line key={i} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth="0.5" opacity="0.6" />
                  ))}
                </svg>
                <div className="min-w-0 flex-1">
                  <p className="len-mono text-[9.5px] tracking-[0.18em]" style={{ color: GOLD_HI }}>
                    ECLIPTIC CONJUNCTION
                  </p>
                  <p className="text-[8px] italic opacity-60">Rare Astral Alignment</p>
                  <p className="mt-1 text-[8.5px] leading-relaxed opacity-70">
                    The veil thins as opposing forces converge. Expect profound revelations and instabilities.
                  </p>
                  <div className="len-mono mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1 text-[7.5px] tracking-[0.14em]">
                    <span style={{ color: GOLD_DIM }}>
                      EXTENSITY <span style={{ color: GOLD_HI }}>88%</span>
                    </span>
                    <span style={{ color: GOLD_DIM }}>
                      DURATION <span style={{ color: GOLD_HI }}>02:44:19</span>
                    </span>
                    <span style={{ color: GOLD_DIM }}>
                      IMPACT <span style={{ color: EMBER }}>HIGH</span>
                    </span>
                    <span style={{ color: GOLD_DIM }}>
                      RELIABILITY <span style={{ color: GOLD_HI }}>77%</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="len-mono mt-2 grid grid-cols-4 gap-1 border-t pt-1.5 text-center text-[6.5px] tracking-[0.12em]" style={{ borderColor: `${GOLD}1f` }}>
                {[
                  ["ENERGY SURGE", "+123%"],
                  ["REALM INSTAB.", "+24%"],
                  ["VISION CLARITY", "+65%"],
                  ["RITUAL POTENCY", "+111%"],
                ].map(([k, v]) => (
                  <span key={k}>
                    <span className="block" style={{ color: GOLD_DIM }}>{k}</span>
                    <span className="block text-[8px]" style={{ color: GOLD_HI }}>{v}</span>
                  </span>
                ))}
              </div>
            </Panel>
          </div>
        </div>

        {/* ========================= ENGINE OUTPUT STRIP ========================= */}
        <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_190px_minmax(0,1.4fr)]">
          <Panel title="ENGINE OUTPUT" right="THAUMIC FLOW · 128HZ">
            <svg viewBox="0 0 360 84" className="h-auto w-full" fill="none" aria-hidden>
              {[21, 42, 63].map((y) => (
                <line key={y} x1="0" y1={y} x2="360" y2={y} stroke={GOLD} strokeWidth="0.3" strokeDasharray="2 6" opacity="0.3" />
              ))}
              <polyline points={WAVE_SOFT} stroke={GOLD_FAINT} strokeWidth="0.8" />
              <polyline points={WAVE} stroke={GOLD_HI} strokeWidth="1" />
              <polyline points={WAVE} stroke={GOLD} strokeWidth="0.6" strokeDasharray="4 6" className="len-dash" />
            </svg>
          </Panel>

          <Panel title="TOTAL THAUMIC OUTPUT" right="SINCE CONJUNCTION">
            <div className="flex h-full flex-col items-center justify-center py-1">
              <p className="len-serif len-glow text-[34px] leading-none tabular-nums" style={{ color: GOLD_HI }}>
                7,182.33
              </p>
              <p className="len-mono mt-1 text-[8px] tracking-[0.4em]" style={{ color: GOLD_DIM }}>
                THAUMIC UNITS
              </p>
              <p className="len-mono mt-1.5 text-[8.5px] tracking-[0.28em]" style={{ color: GOLD }}>
                ✶{GLYPH_FE0E} FLUX STABLE ✶{GLYPH_FE0E}
              </p>
            </div>
          </Panel>

          <Panel title="CALIBRATION" bodyClass="p-1">
            <svg viewBox="0 0 140 96" className="mx-auto h-auto w-full max-w-[150px]" fill="none" aria-hidden>
              <path d={`M ${gaugeStart.x} ${gaugeStart.y} A ${GAUGE_R} ${GAUGE_R} 0 1 1 ${gaugeEnd.x} ${gaugeEnd.y}`} stroke={GOLD_FAINT} strokeWidth="4" />
              <path d={`M ${gaugeStart.x} ${gaugeStart.y} A ${GAUGE_R} ${GAUGE_R} 0 1 1 ${gaugeValEnd.x} ${gaugeValEnd.y}`} stroke={GOLD} strokeWidth="4" />
              {ringTicks(GAUGE_CX, GAUGE_CY, GAUGE_R - 8, GAUGE_R - 3, 25, -210).map((t, i) => (
                <line key={i} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth={i % 4 === 0 ? 0.9 : 0.4} opacity="0.7" />
              ))}
              <line x1={GAUGE_CX} y1={GAUGE_CY} x2={gaugeNeedle.x} y2={gaugeNeedle.y} stroke={GOLD_HI} strokeWidth="1.4" />
              <circle cx={GAUGE_CX} cy={GAUGE_CY} r="3.4" fill={GOLD_HI} stroke="none" />
              <text x={GAUGE_CX} y={GAUGE_CY + 16} textAnchor="middle" fontSize="12" fill={GOLD_HI} className="len-serif">
                7.2
              </text>
              <text x={GAUGE_CX} y={GAUGE_CY + 26} textAnchor="middle" fontSize="6" fill={GOLD_DIM} className="len-mono" letterSpacing="2">
                OPTIMAL
              </text>
            </svg>
          </Panel>

          {/* action tiles */}
          <div className="grid grid-cols-3 gap-2 md:col-span-2 xl:col-span-1">
            {[
              { n: "DIVINATION", s: "Seek Hidden Truths", i: 0 },
              { n: "CONJURE", s: "Shape Reality", i: 2 },
              { n: "BANISH", s: "Sever the Unwanted", i: 4 },
            ].map((a) => (
              <a key={a.n} href="#" className="len-panel len-action flex flex-col items-center justify-center gap-1.5 px-1 py-3 text-center">
                <MiniSigil i={a.i} size={26} />
                <span className="len-mono text-[8.5px] tracking-[0.24em]" style={{ color: GOLD_HI }}>
                  {a.n}
                </span>
                <span className="text-[7.5px] italic opacity-55">{a.s}</span>
              </a>
            ))}
          </div>
        </div>

        {/* ========================= MODULES (SIX SECTIONS) ========================= */}
        <div className="mt-2">
          <div className="len-panel-h" style={{ border: `1px solid ${GOLD}22`, borderBottom: "none" }}>
            <span style={{ color: GOLD }}>MODULES — SIX INSTRUMENTS OF THE ENGINE</span>
            <span className="len-panel-h-line" aria-hidden />
            <span className="len-mono text-[8px] tracking-[0.2em]" style={{ color: GOLD_DIM }}>
              ALL SYSTEMS ACCESSIBLE · FREE TIER
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-6">
            {MODULES.map((m, i) => (
              <a key={m.title} href="#" className="len-panel len-action group flex flex-col p-2.5">
                <span className="len-mono flex items-center justify-between text-[7.5px] tracking-[0.26em]" style={{ color: GOLD }}>
                  {m.tag}
                  <span style={{ color: GOLD_FAINT }}>M-{String(i + 1).padStart(2, "0")}</span>
                </span>
                <span className="mt-1.5 flex justify-center py-1">
                  <MiniSigil i={i} size={30} />
                </span>
                <span className="len-serif text-center text-[13px]" style={{ color: GOLD_HI }}>
                  {m.title}
                </span>
                <span className="mt-1 flex-1 text-center text-[8.5px] leading-relaxed opacity-70">{m.copy}</span>
                <span className="len-mono mt-2 border-t pt-1.5 text-center text-[8px] tracking-[0.26em] uppercase" style={{ borderColor: `${GOLD}1f`, color: GOLD }}>
                  Explore →
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* ========================= ZODIAC BAND ========================= */}
        <div className="len-panel mt-2">
          <header className="len-panel-h">
            <span style={{ color: GOLD }}>ZODIACAL BAND — TWELVE HOUSES OF THE ECLIPTIC</span>
            <span className="len-panel-h-line" aria-hidden />
            <span className="len-mono text-[8px] tracking-[0.2em]" style={{ color: GOLD_DIM }}>
              TROPICAL · 360° / 12 = 30° PER SIGN
            </span>
          </header>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-12">
            {ZODIAC.map((z, i) => (
              <a
                key={z.name}
                href="#"
                className="len-action flex flex-col items-center gap-0.5 border-t px-1 py-2"
                style={{ borderColor: `${GOLD}1f` }}
              >
                <span className="text-[15px] leading-none" style={{ color: GOLD_HI }}>
                  {z.g}
                </span>
                <span className="len-mono text-[7.5px] tracking-[0.18em] uppercase" style={{ color: IVORY }}>
                  {z.name}
                </span>
                <span className="len-mono text-[6.5px] tracking-[0.06em]" style={{ color: GOLD_DIM }}>
                  {z.dates}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* ========================= DESTINY MATRIX + ARCHIVE ========================= */}
        <div className="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          {/* destiny matrix octagram */}
          <Panel title="DESTINY MATRIX" right="OPTIONAL INSTRUMENT">
            <div className="flex items-center gap-4">
              <svg viewBox="0 0 120 120" className="h-28 w-28 shrink-0" fill="none" stroke={GOLD} aria-hidden>
                <circle cx="60" cy="60" r="54" strokeWidth="0.6" opacity="0.5" />
                {ringTicks(60, 60, 49, 54, 32).map((t, i) => (
                  <line key={i} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} strokeWidth={t.major ? 0.8 : 0.35} opacity="0.6" />
                ))}
                <g className="len-spin-c">
                  <rect x="26" y="26" width="68" height="68" strokeWidth="0.9" opacity="0.85" />
                  <rect x="26" y="26" width="68" height="68" strokeWidth="0.9" opacity="0.55" transform="rotate(45 60 60)" />
                </g>
                <circle cx="60" cy="60" r="16" strokeWidth="0.8" />
                <circle cx="60" cy="60" r="3" fill={GOLD_HI} stroke="none" className="len-pulse" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
                  const p = polar(60, 60, 41, a - 90);
                  return <circle key={i} cx={p.x} cy={p.y} r="1.6" fill={GOLD} stroke="none" opacity="0.85" />;
                })}
              </svg>
              <div className="min-w-0">
                <p className="len-serif text-[14px]" style={{ color: GOLD_HI }}>
                  The Octagram of Birth
                </p>
                <p className="mt-1 text-[9.5px] leading-relaxed opacity-75">
                  An optional birth-date octagram tool. It maps purpose, love, money, and age themes from your birth
                  date.
                </p>
                <p className="len-mono mt-1.5 text-[7px] tracking-[0.18em]" style={{ color: GOLD_DIM }}>
                  8 VERTICES · 22 ARCANA PATHS · AGE CYCLES 0–80
                </p>
                <a href="#" className="len-mono mt-2 inline-block border px-3 py-1.5 text-[8.5px] tracking-[0.24em] uppercase len-btn-ghost">
                  Open Destiny Matrix →
                </a>
              </div>
            </div>
          </Panel>

          {/* FAQ as archive entries */}
          <Panel title="ARCHIVE ENTRIES" right="4 RECORDS · PUBLIC">
            <ul>
              {ARCHIVE.map((e, i) => (
                <li key={e.q} className={`flex gap-3 py-1.5 ${i > 0 ? "border-t" : ""}`} style={{ borderColor: `${GOLD}1a` }}>
                  <span className="len-mono shrink-0 text-[8px] tracking-[0.14em]" style={{ color: GOLD_FAINT }}>
                    REC-{String(i + 1).padStart(3, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="len-serif block text-[11px]" style={{ color: GOLD_HI }}>
                      {e.q}
                    </span>
                    <span className="mt-0.5 block text-[8.5px] leading-relaxed opacity-65">{e.a}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        {/* ========================= LIVE FEED ========================= */}
        <div className="len-mono mt-2 hidden flex-wrap items-center gap-x-5 gap-y-1 border px-3 py-1.5 text-[7.5px] tracking-[0.14em] md:flex" style={{ borderColor: `${GOLD}1f`, color: GOLD_DIM }}>
          <span style={{ color: GOLD }}>● LIVE FEED</span>
          {FEED.map((f, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <MiniSigil i={i} size={11} />
              <span style={{ color: IVORY }} className="opacity-70">{f.s}</span>
              <span>{f.t}</span>
            </span>
          ))}
          <span className="ml-auto">KNOWLEDGE NODES 7,231 · FATE THREADS 549 · ACTIVE RITUALS 17</span>
        </div>

        {/* ========================= CTA ========================= */}
        <section className="len-panel relative mt-2 px-4 py-10 text-center sm:py-14">
          <svg viewBox="0 0 120 120" className="pointer-events-none absolute top-3 left-3 h-16 w-16 opacity-40" fill="none" stroke={GOLD} strokeWidth="0.8" aria-hidden>
            <path d="M 6 60 H 60 M 60 6 V 60" />
            <path d={compassPath(60, 60, 50, 12)} opacity="0.6" />
          </svg>
          <svg viewBox="0 0 120 120" className="pointer-events-none absolute right-3 bottom-3 h-16 w-16 rotate-180 opacity-40" fill="none" stroke={GOLD} strokeWidth="0.8" aria-hidden>
            <path d="M 6 60 H 60 M 60 6 V 60" />
            <path d={compassPath(60, 60, 50, 12)} opacity="0.6" />
          </svg>
          <p className="len-mono text-[8px] tracking-[0.42em] uppercase" style={{ color: GOLD_DIM }}>
            Final Invocation · Seq. 000
          </p>
          <h2 className="len-serif len-glow mx-auto mt-3 max-w-2xl text-[26px] leading-snug sm:text-[34px]" style={{ color: GOLD_HI }}>
            Your chart is written in the stars. Come read it.
          </h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href="#" className="len-btn len-mono px-7 py-3 text-[10.5px] tracking-[0.26em] uppercase">
              Get started — it&rsquo;s free
            </a>
            <a href="#" className="len-btn-ghost len-mono px-7 py-3 text-[10.5px] tracking-[0.26em] uppercase">
              Cast your free birth chart
            </a>
          </div>
          <p className="len-mono mt-4 text-[7.5px] tracking-[0.24em]" style={{ color: GOLD_DIM }}>
            NO CARD REQUIRED · ENGINE ACCESS IN UNDER 60 SECONDS
          </p>
        </section>

        {/* ========================= FOOTER ========================= */}
        <footer className="len-mono mt-2 flex flex-wrap items-center gap-x-6 gap-y-1.5 border px-3 py-2.5 text-[7.5px] tracking-[0.18em] uppercase" style={{ borderColor: `${GOLD}1f`, color: GOLD_DIM }}>
          <span style={{ color: GOLD }}>© 2026 ASTRO SCOPE — ALL FATES RESERVED</span>
          <nav className="flex items-center gap-4">
            {["Horoscopes", "Tarot", "Compatibility", "Sign In"].map((l) => (
              <a key={l} href="#" className="len-navlink">
                {l}
              </a>
            ))}
          </nav>
          <span className="ml-auto">SYSTEMS ARCANA VER 7.2.1 · ENGINE NOMINAL · RENDERED IN 0.042S</span>
        </footer>
      </div>
    </main>
  );
}

/* ============================ SCOPED STYLES =============================== */

const LEN_CSS = `
.len-root { font-family: Georgia, 'Times New Roman', serif; }
.len-serif { font-family: Georgia, 'Times New Roman', serif; }
.len-mono { font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace; }

.len-panel {
  position: relative;
  border: 1px solid rgba(212,168,44,.28);
  background:
    linear-gradient(180deg, rgba(212,168,44,.055), rgba(212,168,44,0) 38%),
    rgba(16,11,6,.6);
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.65), 0 0 22px rgba(0,0,0,.4);
}
.len-panel::after {
  content: "";
  position: absolute; inset: 3px;
  border: 1px solid rgba(212,168,44,.1);
  pointer-events: none;
}
.len-inset {
  border: 1px solid rgba(212,168,44,.18);
  background: rgba(0,0,0,.35);
  box-shadow: inset 0 1px 4px rgba(0,0,0,.6);
}
.len-panel-h {
  display: flex; align-items: center; gap: 10px;
  padding: 6px 10px;
  border-bottom: 1px solid rgba(212,168,44,.22);
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 8.5px; letter-spacing: .3em; text-transform: uppercase;
}
.len-panel-h-line {
  flex: 1; height: 1px;
  background: linear-gradient(90deg, rgba(212,168,44,.4), rgba(212,168,44,.05));
}

.len-tab {
  padding: 5px 10px;
  color: rgba(233,223,200,.55);
  border: 1px solid transparent;
  white-space: nowrap;
}
.len-tab:hover { color: #f0cf6b; }
.len-tab-on {
  color: #f0cf6b;
  border-color: rgba(212,168,44,.45);
  background: rgba(212,168,44,.1);
  box-shadow: inset 0 0 10px rgba(212,168,44,.12);
}
.len-navlink { color: rgba(233,223,200,.6); }
.len-navlink:hover { color: #f0cf6b; }

.len-btn {
  color: #0a0705;
  background: linear-gradient(180deg, #f0cf6b, #d4a82c 55%, #a8841f);
  border: 1px solid #f0cf6b;
  box-shadow: 0 0 18px rgba(212,168,44,.35), inset 0 1px 0 rgba(255,244,214,.6);
}
.len-btn:hover { box-shadow: 0 0 26px rgba(212,168,44,.55), inset 0 1px 0 rgba(255,244,214,.7); }
.len-btn-ghost {
  color: #d4a82c;
  border: 1px solid rgba(212,168,44,.5);
  background: rgba(212,168,44,.06);
}
.len-btn-ghost:hover { background: rgba(212,168,44,.14); color: #f0cf6b; }

.len-action { transition: box-shadow .3s ease, background-color .3s ease; }
.len-action:hover { background-color: rgba(212,168,44,.07); box-shadow: inset 0 0 18px rgba(212,168,44,.12); }

.len-bar {
  background: rgba(212,168,44,.1);
  box-shadow: inset 0 1px 3px rgba(0,0,0,.8);
}
.len-bar > i {
  background: linear-gradient(90deg, #8a6d1f, #d4a82c 70%, #f0cf6b);
  box-shadow: 0 0 8px rgba(212,168,44,.5);
}
.len-bar-ticks {
  background-image: repeating-linear-gradient(90deg, transparent 0 9px, rgba(10,7,5,.95) 9px 10px);
}

.len-glow { text-shadow: 0 0 16px rgba(212,168,44,.45), 0 0 46px rgba(212,168,44,.2); }

::selection { background: rgba(212,168,44,.35); color: #fff6dd; }

/* ---------- slow, CSS-only motion (9–180s), reduced-motion guarded ---------- */
@keyframes lenSpin { to { transform: rotate(360deg); } }
@keyframes lenSpinRev { to { transform: rotate(-360deg); } }
@keyframes lenPulse { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }
@keyframes lenTw { 0%, 100% { opacity: .15; } 50% { opacity: .8; } }
@keyframes lenDash { to { stroke-dashoffset: -240; } }

.len-spin-a, .len-spin-b, .len-spin-c { transform-box: view-box; transform-origin: center; }

@media (prefers-reduced-motion: no-preference) {
  .len-spin-a { animation: lenSpin 170s linear infinite; }
  .len-spin-b { animation: lenSpinRev 130s linear infinite; }
  .len-spin-c { animation: lenSpin 95s linear infinite; }
  .len-pulse { animation: lenPulse 9s ease-in-out infinite; }
  .len-pulse-slow { animation: lenPulse 15s ease-in-out infinite 3s; }
  .len-tw0 { animation: lenTw 23s ease-in-out infinite; }
  .len-tw1 { animation: lenTw 31s ease-in-out infinite 7s; }
  .len-tw2 { animation: lenTw 27s ease-in-out infinite 13s; }
  .len-dash { animation: lenDash 60s linear infinite; }
}
`;
