import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Astro Scope — Arcana Wheel",
  description:
    "Free birth chart, daily horoscopes, synastry and tarot. The wheel turns. The paths reveal.",
};

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                    */
/* ------------------------------------------------------------------ */

const CX = 500;
const CY = 500;
const rad = (deg: number) => (deg * Math.PI) / 180;
const pt = (r: number, deg: number) => ({
  x: CX + r * Math.cos(rad(deg)),
  y: CY + r * Math.sin(rad(deg)),
});
const n = (v: number) => Math.round(v * 100) / 100;

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type Zodiac = { name: string; glyph: string; dates: string };

const ZODIAC: Zodiac[] = [
  { name: "ARIES", glyph: "\u2648\uFE0E", dates: "MAR 21 – APR 19" },
  { name: "TAURUS", glyph: "\u2649\uFE0E", dates: "APR 20 – MAY 20" },
  { name: "GEMINI", glyph: "\u264A\uFE0E", dates: "MAY 21 – JUN 20" },
  { name: "CANCER", glyph: "\u264B\uFE0E", dates: "JUN 21 – JUL 22" },
  { name: "LEO", glyph: "\u264C\uFE0E", dates: "JUL 23 – AUG 22" },
  { name: "VIRGO", glyph: "\u264D\uFE0E", dates: "AUG 23 – SEP 22" },
  { name: "LIBRA", glyph: "\u264E\uFE0E", dates: "SEP 23 – OCT 22" },
  { name: "SCORPIO", glyph: "\u264F\uFE0E", dates: "OCT 23 – NOV 21" },
  { name: "SAGITTARIUS", glyph: "\u2650\uFE0E", dates: "NOV 22 – DEC 21" },
  { name: "CAPRICORN", glyph: "\u2651\uFE0E", dates: "DEC 22 – JAN 19" },
  { name: "AQUARIUS", glyph: "\u2652\uFE0E", dates: "JAN 20 – FEB 18" },
  { name: "PISCES", glyph: "\u2653\uFE0E", dates: "FEB 19 – MAR 20" },
];

type ArcanaNode = {
  name: string;
  numeral: string;
  keyword: string;
  value: string;
  color: string;
  angle: number;
  radius: number;
  delay: string;
};

const NODES: ArcanaNode[] = [
  { name: "THE SUN", numeral: "XIX", keyword: "Energy", value: "+78", color: "#f5b93f", angle: -90, radius: 310, delay: "0s" },
  { name: "THE MOON", numeral: "XVIII", keyword: "Intuition", value: "+66", color: "#c9d4e6", angle: -35, radius: 322, delay: "1.4s" },
  { name: "THE HERMIT", numeral: "IX", keyword: "Wisdom", value: "+61", color: "#2dd4bf", angle: -5, radius: 288, delay: "2.8s" },
  { name: "THE LOVERS", numeral: "VI", keyword: "Connection", value: "+37", color: "#c084fc", angle: 22, radius: 326, delay: "4.2s" },
  { name: "DEATH", numeral: "XIII", keyword: "Transformation", value: "−24", color: "#b0465c", angle: 46, radius: 298, delay: "5.6s" },
  { name: "THE CHARIOT", numeral: "VII", keyword: "Focus", value: "+49", color: "#60a5fa", angle: 90, radius: 318, delay: "7s" },
  { name: "JUDGEMENT", numeral: "XX", keyword: "Renewal", value: "+35", color: "#e8b64c", angle: 118, radius: 332, delay: "8.4s" },
  { name: "THE STAR", numeral: "XVII", keyword: "Inspiration", value: "+42", color: "#a78bfa", angle: 150, radius: 328, delay: "9.8s" },
  { name: "THE EMPRESS", numeral: "III", keyword: "Growth", value: "+53", color: "#4ade80", angle: 172, radius: 292, delay: "11.2s" },
  { name: "THE TOWER", numeral: "XVI", keyword: "Change", value: "−18", color: "#f87171", angle: 196, radius: 330, delay: "12.6s" },
];

/* Faint minor arcana satellite points — small unlabeled dots with tiny values */
type MinorNode = { angle: number; radius: number; color: string; value: string; delay: string };

const MINOR_NODES: MinorNode[] = [
  { angle: -72, radius: 356, color: "#f5b93f", value: "+12", delay: "0.7s" },
  { angle: -54, radius: 288, color: "#c9d4e6", value: "+08", delay: "1.9s" },
  { angle: -18, radius: 352, color: "#2dd4bf", value: "+21", delay: "3.1s" },
  { angle: 12, radius: 300, color: "#c084fc", value: "−05", delay: "4.3s" },
  { angle: 34, radius: 358, color: "#a78bfa", value: "+16", delay: "5.5s" },
  { angle: 58, radius: 344, color: "#b0465c", value: "−09", delay: "6.7s" },
  { angle: 76, radius: 286, color: "#60a5fa", value: "+27", delay: "7.9s" },
  { angle: 104, radius: 356, color: "#e8b64c", value: "+11", delay: "9.1s" },
  { angle: 132, radius: 296, color: "#a78bfa", value: "+19", delay: "10.3s" },
  { angle: 146, radius: 364, color: "#4ade80", value: "+06", delay: "11.5s" },
  { angle: 164, radius: 340, color: "#2dd4bf", value: "−03", delay: "12.7s" },
  { angle: 186, radius: 300, color: "#f87171", value: "−14", delay: "13.9s" },
  { angle: 210, radius: 362, color: "#f5b93f", value: "+24", delay: "2.5s" },
  { angle: 224, radius: 320, color: "#c9d4e6", value: "+09", delay: "5.1s" },
  { angle: 240, radius: 348, color: "#60a5fa", value: "−07", delay: "8.3s" },
  { angle: 252, radius: 292, color: "#e8b64c", value: "+15", delay: "10.9s" },
];

type Sector = {
  no: string;
  kicker: string;
  title: string;
  copy: string;
  node: string;
  coord: string;
  color: string;
  span: string;
};

const SECTORS: Sector[] = [
  {
    no: "01",
    kicker: "FREE",
    title: "Birth Chart",
    copy: "Map your Sun, Moon, and Rising — the foundation of every reading.",
    node: "XIX · THE SUN",
    coord: "θ 270° · R 310",
    color: "#f5b93f",
    span: "lg:col-span-7",
  },
  {
    no: "02",
    kicker: "DAILY",
    title: "Daily Horoscope",
    copy: "Twelve signs, one sky. Clear forecasts without the fluff.",
    node: "XVIII · THE MOON",
    coord: "θ 325° · R 322",
    color: "#c9d4e6",
    span: "lg:col-span-5 lg:mt-14",
  },
  {
    no: "03",
    kicker: "SYNASTRY",
    title: "Compatibility",
    copy: "Zodiac match, Chinese pairs, and deep synastry for two charts.",
    node: "VI · THE LOVERS",
    coord: "θ 022° · R 326",
    color: "#c084fc",
    span: "lg:col-span-5",
  },
  {
    no: "04",
    kicker: "SPREADS",
    title: "Tarot",
    copy: "Daily card to Celtic Cross — pull, reflect, get a full reading.",
    node: "XVII · THE STAR",
    coord: "θ 150° · R 328",
    color: "#a78bfa",
    span: "lg:col-span-7 lg:-mt-6",
  },
  {
    no: "05",
    kicker: "TESTS",
    title: "Psychology",
    copy: "MBTI, Big Five, empathy and more — meet yourself beyond the signs.",
    node: "IX · THE HERMIT",
    coord: "θ 355° · R 288",
    color: "#2dd4bf",
    span: "lg:col-span-6",
  },
  {
    no: "06",
    kicker: "YOU",
    title: "Cosmic Passport",
    copy: "Your Cosmic ID, people, journal, and Premium deep dives — one hub.",
    node: "III · THE EMPRESS",
    coord: "θ 172° · R 292",
    color: "#4ade80",
    span: "lg:col-span-6 lg:mt-10",
  },
];

const INFLUENCES = [
  { k: "SOLAR PEAK", v: "HIGH", c: "#f5b93f" },
  { k: "LUNAR FLOW", v: "STRONG", c: "#c9d4e6" },
  { k: "MERCURY TIDE", v: "RISING", c: "#2dd4bf" },
  { k: "SATURN DRAG", v: "LOW", c: "#f87171" },
];

const ELEMENTS = [
  { k: "FIRE", v: 72, c: "#f87171" },
  { k: "WATER", v: 64, c: "#60a5fa" },
  { k: "AIR", v: 41, c: "#e8b64c" },
  { k: "EARTH", v: 88, c: "#4ade80" },
];

const RECENT_CARDS = [
  { n: "XVII", name: "THE STAR", c: "#a78bfa" },
  { n: "III", name: "THE EMPRESS", c: "#4ade80" },
  { n: "XVI", name: "THE TOWER", c: "#f87171" },
];

const FAQ = [
  {
    q: "What can I do for free?",
    a: "The birth chart, daily horoscopes, tarot pulls, and psychology tests are all free — no account required.",
  },
  {
    q: "How do I get my free birth chart?",
    a: "Enter your date, time, and place of birth in the calculator — the chart is drawn instantly.",
  },
  {
    q: "Where are daily horoscopes?",
    a: "On the homepage grid for all twelve signs, or collected in the Horoscopes hub.",
  },
  {
    q: "What is the Destiny Matrix?",
    a: "An optional birth-date octagram that maps purpose, love, money, and age themes from your date of birth.",
  },
];

/* ------------------------------------------------------------------ */
/* Computed wheel geometry                                             */
/* ------------------------------------------------------------------ */

const TICKS = Array.from({ length: 72 }, (_, i) => {
  const deg = i * 5;
  const major = deg % 30 === 0;
  const mid = deg % 10 === 0;
  const r1 = major ? 402 : mid ? 409 : 413;
  const r2 = 423;
  const a = pt(r1, deg);
  const b = pt(r2, deg);
  return { key: `t${i}`, x1: n(a.x), y1: n(a.y), x2: n(b.x), y2: n(b.y), major };
});

/* Secondary fine tick band — every 3°, majors every 15° */
const MINOR_TICKS = Array.from({ length: 120 }, (_, i) => {
  const deg = i * 3;
  const major = deg % 15 === 0;
  const a = pt(major ? 258 : 262, deg);
  const b = pt(268, deg);
  return { key: `mt${i}`, x1: n(a.x), y1: n(a.y), x2: n(b.x), y2: n(b.y), major };
});

const DEGREES = Array.from({ length: 12 }, (_, i) => {
  const deg = i * 30;
  const p = pt(388, deg);
  return { key: `d${i}`, x: n(p.x), y: n(p.y), label: `${deg}°` };
});

/* Dense degree band — every 10°, zero-padded */
const DEG_BAND = Array.from({ length: 36 }, (_, i) => {
  const deg = i * 10;
  const p = pt(240, deg);
  return { key: `db${i}`, x: n(p.x), y: n(p.y), label: String(deg).padStart(3, "0") };
});

const INNER_RING_POINTS = Array.from({ length: 12 }, (_, i) => {
  const p = pt(212, i * 30);
  return { key: `ir${i}`, x: n(p.x), y: n(p.y) };
});

const OCTAGRAM_SQUARE_A = [0, 90, 180, 270]
  .map((d) => {
    const p = pt(132, d);
    return `${n(p.x)},${n(p.y)}`;
  })
  .join(" ");

const OCTAGRAM_SQUARE_B = [45, 135, 225, 315]
  .map((d) => {
    const p = pt(132, d);
    return `${n(p.x)},${n(p.y)}`;
  })
  .join(" ");

const OCTAGRAM_VERTICES = Array.from({ length: 8 }, (_, i) => {
  const p = pt(132, i * 45);
  return { key: `ov${i}`, x: n(p.x), y: n(p.y) };
});

const CORE_STAR = Array.from({ length: 16 }, (_, i) => {
  const p = pt(i % 2 === 0 ? 46 : 19, i * 22.5);
  return `${n(p.x)},${n(p.y)}`;
}).join(" ");

/* Cosmic weather wave — 24h mini polyline */
const WAVE = Array.from({ length: 41 }, (_, i) => {
  const x = i * 5;
  const y = 20 + 9 * Math.sin((i / 40) * Math.PI * 3.2) + 3 * Math.sin((i / 40) * Math.PI * 9);
  return `${n(x)},${n(y)}`;
}).join(" ");

/* ------------------------------------------------------------------ */
/* Scoped styles                                                       */
/* ------------------------------------------------------------------ */

const LAW_STYLES = `
  .law-root {
    background: #06060c;
    color: #e8e4d8;
  }
  .law-wheel-glow {
    background:
      radial-gradient(closest-side, rgba(232, 182, 76, 0.10), transparent 62%),
      radial-gradient(closest-side, rgba(45, 212, 191, 0.05), transparent 78%);
  }
  @keyframes law-rot {
    to { transform: rotate(360deg); }
  }
  @keyframes law-rot-rev {
    to { transform: rotate(-360deg); }
  }
  @keyframes law-pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
  @keyframes law-core-pulse {
    0%, 100% { opacity: 0.75; }
    50% { opacity: 1; }
  }
  @keyframes law-dash {
    to { stroke-dashoffset: -240; }
  }
  .law-rot-a { animation: law-rot 180s linear infinite; transform-origin: 500px 500px; }
  .law-rot-b { animation: law-rot-rev 120s linear infinite; transform-origin: 500px 500px; }
  .law-rot-c { animation: law-rot-rev 90s linear infinite; transform-origin: 500px 500px; }
  .law-rot-d { animation: law-rot 150s linear infinite; transform-origin: 500px 500px; }
  .law-core { animation: law-core-pulse 16s ease-in-out infinite; }
  .law-node-glow { animation: law-pulse 14s ease-in-out infinite; }
  .law-wave { animation: law-dash 40s linear infinite; }
  .law-begin { transition: letter-spacing 400ms ease; }
  .law-begin:hover .law-begin-text { letter-spacing: 0.55em; }
  .law-begin:hover .law-begin-ring { stroke-opacity: 0.9; }
  .law-panel { transition: border-color 200ms ease, background-color 200ms ease; }
  .law-panel:hover { border-color: rgba(232, 182, 76, 0.35); background-color: rgba(255, 255, 255, 0.02); }
  @media (max-width: 640px) {
    .law-hide-sm { display: none; }
  }
  @media (prefers-reduced-motion: reduce) {
    .law-rot-a, .law-rot-b, .law-rot-c, .law-rot-d, .law-core, .law-node-glow, .law-wave { animation: none; }
    .law-begin { transition: none; }
  }
`;

/* ------------------------------------------------------------------ */
/* Small parts                                                         */
/* ------------------------------------------------------------------ */

const MONO = "var(--font-geist-mono), ui-monospace, monospace";

function Ruler({ label }: { label: string }) {
  return (
    <div aria-hidden className="px-4 sm:px-8">
      <div className="flex items-end justify-between border-b border-white/5 pb-1">
        {Array.from({ length: 61 }, (_, i) => (
          <span
            key={i}
            className={
              i % 10 === 0
                ? "h-4 w-px bg-[#e8b64c]/40"
                : i % 5 === 0
                  ? "h-2.5 w-px bg-white/20"
                  : "h-1.5 w-px bg-white/10"
            }
          />
        ))}
      </div>
      <div className="mt-1 flex justify-between font-mono text-[9px] tracking-[0.3em] text-white/25">
        <span>0°</span>
        <span>{label}</span>
        <span>360°</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ArcanaWheelPage() {
  return (
    <main className="law-root min-h-screen font-sans">
      <style>{LAW_STYLES}</style>

      {/* ---------------- Nav ---------------- */}
      <nav className="relative z-20 flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-8">
        <div className="flex items-baseline gap-3">
          <a href="#law-wheel" className="text-sm font-semibold tracking-[0.35em] text-[#e8b64c]">
            ASTRO SCOPE
          </a>
          <span className="hidden font-mono text-[9px] tracking-[0.3em] text-white/30 sm:inline">
            ARCANA WHEEL / INSTRUMENT 01
          </span>
        </div>
        <div className="flex items-center gap-5 text-[11px] tracking-[0.2em] text-white/60">
          <a href="#law-sectors" className="hidden transition-colors hover:text-[#e8b64c] sm:inline">
            HOROSCOPES
          </a>
          <a href="#law-sectors" className="hidden transition-colors hover:text-[#e8b64c] sm:inline">
            TAROT
          </a>
          <a href="#law-sectors" className="hidden transition-colors hover:text-[#e8b64c] md:inline">
            COMPATIBILITY
          </a>
          <a
            href="#law-cast"
            className="border border-[#e8b64c]/40 px-3 py-1.5 text-[#e8b64c] transition-colors hover:bg-[#e8b64c]/10"
          >
            SIGN IN
          </a>
        </div>
      </nav>

      {/* ---------------- Hero: the wheel dominates ---------------- */}
      <header id="law-wheel" className="relative flex flex-col xl:block xl:min-h-screen">
        {/* Hero text — small, top-left */}
        <div className="relative z-10 max-w-md px-4 pt-10 sm:px-8 xl:absolute xl:left-8 xl:top-10 xl:max-w-xs xl:px-0 xl:pt-0">
          <p className="font-mono text-[10px] tracking-[0.4em] text-[#e8b64c]/80">
            NATAL INSTRUMENT · NO. 01
          </p>
          <h1 className="mt-4 text-3xl font-light leading-tight tracking-tight text-[#efe9dc] sm:text-4xl">
            The wheel turns.
            <br />
            The paths reveal.
          </h1>
          <p className="mt-4 text-[13px] leading-relaxed text-white/50">
            Free birth chart, daily horoscopes, synastry and tarot — one instrument,
            calibrated to your date, time and place.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <a
              href="#law-cast"
              className="inline-flex w-fit items-center gap-2 bg-[#e8b64c] px-5 py-2.5 text-[11px] font-semibold tracking-[0.2em] text-[#06060c] transition-colors hover:bg-[#f5cf6e]"
            >
              CAST YOUR FREE BIRTH CHART
            </a>
            <a
              href="#law-sectors"
              className="w-fit text-[11px] tracking-[0.2em] text-white/60 transition-colors hover:text-[#e8b64c]"
            >
              READ TODAY&rsquo;S HOROSCOPE →
            </a>
          </div>
        </div>

        {/* The wheel */}
        <div className="law-wheel-glow relative mx-auto w-[min(94vw,940px)] xl:-mt-6">
          <svg
            viewBox="0 0 1000 1000"
            className="h-auto w-full"
            role="img"
            aria-label="Arcana wheel: ten major arcana nodes and twelve zodiac signs on concentric instrument rings"
          >
            <defs>
              <filter id="law-blur" x="-120%" y="-120%" width="340%" height="340%">
                <feGaussianBlur stdDeviation="12" />
              </filter>
              <filter id="law-blur-core" x="-160%" y="-160%" width="420%" height="420%">
                <feGaussianBlur stdDeviation="22" />
              </filter>
            </defs>

            {/* Static hairline rings */}
            <g fill="none" stroke="#e8e4d8">
              <circle cx={CX} cy={CY} r={494} strokeOpacity={0.18} strokeWidth={1} />
              <circle cx={CX} cy={CY} r={470} strokeOpacity={0.08} strokeWidth={1} strokeDasharray="1 6" />
              <circle cx={CX} cy={CY} r={442} strokeOpacity={0.1} strokeWidth={1} />
              <circle cx={CX} cy={CY} r={368} strokeOpacity={0.14} strokeWidth={1} />
              <circle cx={CX} cy={CY} r={342} strokeOpacity={0.12} strokeWidth={1} />
              <circle cx={CX} cy={CY} r={300} strokeOpacity={0.1} strokeWidth={1} strokeDasharray="2 7" />
              <circle cx={CX} cy={CY} r={278} strokeOpacity={0.08} strokeWidth={1} />
              <circle cx={CX} cy={CY} r={252} strokeOpacity={0.08} strokeWidth={1} />
              <circle cx={CX} cy={CY} r={190} strokeOpacity={0.1} strokeWidth={1} strokeDasharray="2 5" />
              <circle cx={CX} cy={CY} r={158} strokeOpacity={0.12} strokeWidth={1} />
            </g>

            {/* 12 sector separators */}
            <g stroke="#e8b64c" strokeOpacity={0.12} strokeWidth={1}>
              {Array.from({ length: 12 }, (_, i) => {
                const a = pt(442, i * 30 + 15);
                const b = pt(494, i * 30 + 15);
                return <line key={`sep${i}`} x1={n(a.x)} y1={n(a.y)} x2={n(b.x)} y2={n(b.y)} />;
              })}
            </g>

            {/* Rotating tick ring (180s) */}
            <g className="law-rot-a">
              <circle cx={CX} cy={CY} r={423} fill="none" stroke="#e8e4d8" strokeOpacity={0.16} strokeWidth={1} />
              <circle cx={CX} cy={CY} r={400} fill="none" stroke="#e8e4d8" strokeOpacity={0.1} strokeWidth={1} />
              {TICKS.map((t) => (
                <line
                  key={t.key}
                  x1={t.x1}
                  y1={t.y1}
                  x2={t.x2}
                  y2={t.y2}
                  stroke={t.major ? "#e8b64c" : "#e8e4d8"}
                  strokeOpacity={t.major ? 0.5 : 0.22}
                  strokeWidth={1}
                />
              ))}
            </g>

            {/* Secondary fine tick band (150s) */}
            <g className="law-rot-d">
              <circle cx={CX} cy={CY} r={268} fill="none" stroke="#e8e4d8" strokeOpacity={0.1} strokeWidth={1} />
              {MINOR_TICKS.map((t) => (
                <line
                  key={t.key}
                  x1={t.x1}
                  y1={t.y1}
                  x2={t.x2}
                  y2={t.y2}
                  stroke={t.major ? "#e8b64c" : "#e8e4d8"}
                  strokeOpacity={t.major ? 0.35 : 0.16}
                  strokeWidth={1}
                />
              ))}
            </g>

            {/* Degree numbers (static, hidden on small screens) */}
            <g className="law-hide-sm" fontFamily={MONO} fontSize={9} fill="#6b6880" textAnchor="middle">
              {DEGREES.map((d) => (
                <text key={d.key} x={d.x} y={d.y + 3}>
                  {d.label}
                </text>
              ))}
            </g>

            {/* Dense degree band — every 10° (hidden on small screens) */}
            <g className="law-hide-sm" fontFamily={MONO} fontSize={7} fill="#55536a" textAnchor="middle">
              {DEG_BAND.map((d) => (
                <text key={d.key} x={d.x} y={d.y + 2}>
                  {d.label}
                </text>
              ))}
            </g>

            {/* Spokes from core to nodes */}
            <g strokeWidth={1}>
              {NODES.map((node) => {
                const a = pt(70, node.angle);
                const b = pt(node.radius - 26, node.angle);
                return (
                  <line
                    key={`sp-${node.numeral}`}
                    x1={n(a.x)}
                    y1={n(a.y)}
                    x2={n(b.x)}
                    y2={n(b.y)}
                    stroke={node.color}
                    strokeOpacity={0.14}
                    strokeDasharray="1 5"
                  />
                );
              })}
            </g>

            {/* Inner rotating geometric ring (120s reverse) */}
            <g className="law-rot-b">
              <circle
                cx={CX}
                cy={CY}
                r={212}
                fill="none"
                stroke="#e8b64c"
                strokeOpacity={0.22}
                strokeWidth={1}
                strokeDasharray="1 6"
              />
              {INNER_RING_POINTS.map((p, i) => (
                <g key={p.key}>
                  <circle cx={p.x} cy={p.y} r={2.5} fill="#e8b64c" fillOpacity={i % 3 === 0 ? 0.8 : 0.35} />
                  {i % 3 === 0 && (
                    <line
                      x1={p.x}
                      y1={p.y}
                      x2={n(pt(228, i * 30).x)}
                      y2={n(pt(228, i * 30).y)}
                      stroke="#e8b64c"
                      strokeOpacity={0.4}
                      strokeWidth={1}
                    />
                  )}
                </g>
              ))}
            </g>

            {/* Destiny Matrix — inner octagram ring (90s reverse) */}
            <g className="law-rot-c" fill="none" stroke="#e8b64c">
              <polygon points={OCTAGRAM_SQUARE_A} strokeOpacity={0.45} strokeWidth={1} />
              <polygon points={OCTAGRAM_SQUARE_B} strokeOpacity={0.45} strokeWidth={1} />
              <circle cx={CX} cy={CY} r={96} strokeOpacity={0.25} strokeWidth={1} strokeDasharray="1 4" />
              {OCTAGRAM_VERTICES.map((v) => (
                <rect
                  key={v.key}
                  x={v.x - 3}
                  y={v.y - 3}
                  width={6}
                  height={6}
                  transform={`rotate(45 ${v.x} ${v.y})`}
                  fill="#e8b64c"
                  fillOpacity={0.7}
                  stroke="none"
                />
              ))}
            </g>
            <text
              x={CX}
              y={652}
              textAnchor="middle"
              fontFamily={MONO}
              fontSize={8}
              letterSpacing="0.35em"
              fill="#e8b64c"
              fillOpacity={0.5}
            >
              DESTINY MATRIX · OCTAGRAM
            </text>

            {/* Center core: gold geometric star */}
            <g className="law-core">
              <circle cx={CX} cy={CY} r={72} fill="#e8b64c" fillOpacity={0.22} filter="url(#law-blur-core)" />
              <polygon points={CORE_STAR} fill="#e8b64c" fillOpacity={0.9} stroke="#f5cf6e" strokeWidth={1} />
              <circle cx={CX} cy={CY} r={12} fill="#06060c" stroke="#f5cf6e" strokeWidth={1} />
              <circle cx={CX} cy={CY} r={4} fill="#f5cf6e" />
            </g>

            {/* BEGIN CTA at the core */}
            <a href="#law-sectors" className="law-begin">
              <circle
                className="law-begin-ring"
                cx={CX}
                cy={CY}
                r={60}
                fill="transparent"
                stroke="#e8b64c"
                strokeOpacity={0.4}
                strokeWidth={1}
                strokeDasharray="3 5"
              />
              <text
                className="law-begin-text"
                x={CX}
                y={592}
                textAnchor="middle"
                fontFamily={MONO}
                fontSize={11}
                letterSpacing="0.45em"
                fill="#f5cf6e"
              >
                BEGIN
              </text>
            </a>

            {/* Minor arcana satellites — faint dots with tiny values */}
            <g>
              {MINOR_NODES.map((m, i) => {
                const p = pt(m.radius, m.angle);
                const right = Math.cos(rad(m.angle)) >= 0;
                return (
                  <g key={`mn${i}`}>
                    <circle
                      className="law-node-glow"
                      cx={n(p.x)}
                      cy={n(p.y)}
                      r={9}
                      fill={m.color}
                      fillOpacity={0.14}
                      filter="url(#law-blur)"
                      style={{ animationDelay: m.delay }}
                    />
                    <circle cx={n(p.x)} cy={n(p.y)} r={3.2} fill={m.color} fillOpacity={0.7} />
                    <circle cx={n(p.x)} cy={n(p.y)} r={6.5} fill="none" stroke={m.color} strokeOpacity={0.3} strokeWidth={0.75} />
                    <text
                      className="law-hide-sm"
                      x={n(right ? p.x + 10 : p.x - 10)}
                      y={n(p.y + 2.5)}
                      textAnchor={right ? "start" : "end"}
                      fontFamily={MONO}
                      fontSize={7}
                      fill={m.color}
                      fillOpacity={0.85}
                    >
                      {m.value}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Zodiac orbit — outermost ring */}
            <g>
              {ZODIAC.map((sign, i) => {
                const deg = -90 + i * 30;
                const g = pt(452, deg);
                const nm = pt(471, deg);
                const dt = pt(483, deg);
                return (
                  <g key={sign.name}>
                    <circle cx={n(g.x)} cy={n(g.y)} r={14} fill="#0a0a12" stroke="#e8e4d8" strokeOpacity={0.25} strokeWidth={1} />
                    <text x={n(g.x)} y={n(g.y) + 5} textAnchor="middle" fontSize={13} fill="#e8e4d8">
                      {sign.glyph}
                    </text>
                    <text
                      x={n(nm.x)}
                      y={n(nm.y) + 2}
                      textAnchor="middle"
                      fontFamily={MONO}
                      fontSize={8}
                      letterSpacing="0.2em"
                      fill="#9c98ad"
                    >
                      {sign.name}
                    </text>
                    <text
                      className="law-hide-sm"
                      x={n(dt.x)}
                      y={n(dt.y) + 2}
                      textAnchor="middle"
                      fontFamily={MONO}
                      fontSize={7}
                      letterSpacing="0.08em"
                      fill="#5b586e"
                    >
                      {sign.dates}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Arcana nodes */}
            <g>
              {NODES.map((node) => {
                const p = pt(node.radius, node.angle);
                const right = Math.cos(rad(node.angle)) >= 0;
                const lx = right ? p.x + 30 : p.x - 30;
                const anchor = right ? "start" : "end";
                return (
                  <g key={node.numeral}>
                    <circle
                      className="law-node-glow"
                      cx={n(p.x)}
                      cy={n(p.y)}
                      r={38}
                      fill={node.color}
                      fillOpacity={0.22}
                      filter="url(#law-blur)"
                      style={{ animationDelay: node.delay }}
                    />
                    <circle cx={n(p.x)} cy={n(p.y)} r={17} fill="#0a0a12" stroke={node.color} strokeWidth={1.2} />
                    <circle cx={n(p.x)} cy={n(p.y)} r={17} fill={node.color} fillOpacity={0.12} />
                    <circle cx={n(p.x)} cy={n(p.y)} r={22} fill="none" stroke={node.color} strokeOpacity={0.3} strokeWidth={1} strokeDasharray="1 4" />
                    <text x={n(p.x)} y={n(p.y) + 3.5} textAnchor="middle" fontFamily={MONO} fontSize={9} fill={node.color}>
                      {node.numeral}
                    </text>
                    <text
                      x={n(lx)}
                      y={n(p.y - 6)}
                      textAnchor={anchor}
                      fontSize={12}
                      letterSpacing="0.18em"
                      fill="#efe9dc"
                    >
                      {node.name}
                    </text>
                    <text x={n(lx)} y={n(p.y + 7)} textAnchor={anchor} fontSize={9.5} fill="#8a879c" fontStyle="italic">
                      {node.keyword}
                    </text>
                    <text x={n(lx)} y={n(p.y + 19)} textAnchor={anchor} fontFamily={MONO} fontSize={9.5} fill={node.color}>
                      {node.value}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Readout clusters — flank the wheel on xl, stack below on smaller screens */}
        <div className="grid gap-4 px-4 pb-10 sm:grid-cols-2 sm:px-8 xl:contents">
          {/* Left cluster — under the hero text */}
          <div className="space-y-4 xl:absolute xl:left-8 xl:top-72 xl:z-10 xl:w-60">
            {/* PATH ALIGNMENT */}
            <div className="border border-white/10 bg-black/40 p-4">
              <div className="flex items-baseline justify-between">
                <p className="font-mono text-[9px] tracking-[0.35em] text-white/35">PATH ALIGNMENT</p>
                <span className="font-mono text-[8px] tracking-[0.25em] text-[#4ade80]/70">LIVE</span>
              </div>
              <p className="mt-2 text-4xl font-light text-[#e8b64c]">
                87<span className="text-lg text-white/40">%</span>
              </p>
              <div className="mt-2 h-px w-full bg-white/10">
                <div className="h-px bg-[#e8b64c]" style={{ width: "87%" }} />
              </div>
              <p className="mt-2 font-mono text-[8px] tracking-[0.25em] text-white/25">
                UPDATED · 1 MIN AGO
              </p>
            </div>

            {/* TODAY'S INFLUENCES */}
            <div className="border border-white/10 bg-black/40 p-4">
              <p className="font-mono text-[9px] tracking-[0.35em] text-white/35">
                TODAY&rsquo;S INFLUENCES
              </p>
              <ul className="mt-3">
                {INFLUENCES.map((row) => (
                  <li
                    key={row.k}
                    className="flex items-baseline justify-between border-b border-white/5 py-1.5 last:border-0"
                  >
                    <span className="font-mono text-[9px] tracking-[0.2em] text-white/45">{row.k}</span>
                    <span className="font-mono text-[9px] tracking-[0.2em]" style={{ color: row.c }}>
                      {row.v}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ARCANA DRAW */}
            <div className="border border-white/10 bg-black/40 p-4">
              <div className="flex items-baseline justify-between">
                <p className="font-mono text-[9px] tracking-[0.35em] text-white/35">ARCANA DRAW</p>
                <span className="font-mono text-[9px] text-[#e8b64c]">1 / 3</span>
              </div>
              <div className="mt-3 flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span key={i} className={`h-1 flex-1 ${i === 0 ? "bg-[#e8b64c]" : "bg-white/10"}`} />
                ))}
              </div>
              <p className="mt-2 font-mono text-[8px] tracking-[0.25em] text-white/25">
                NEXT DRAW · 04:12:36
              </p>
            </div>

            {/* RECENT CARDS */}
            <div className="border border-white/10 bg-black/40 p-4">
              <div className="flex items-baseline justify-between">
                <p className="font-mono text-[9px] tracking-[0.35em] text-white/35">RECENT CARDS</p>
                <span className="font-mono text-[8px] tracking-[0.25em] text-white/30">VIEW ALL →</span>
              </div>
              <div className="mt-3 flex gap-2">
                {RECENT_CARDS.map((card) => (
                  <div
                    key={card.n}
                    className="flex-1 border px-1 pb-1.5 pt-3 text-center"
                    style={{
                      borderColor: `${card.c}55`,
                      background: `radial-gradient(circle at 50% 30%, ${card.c}33, transparent 72%)`,
                      boxShadow: `inset 0 0 14px ${card.c}22`,
                    }}
                  >
                    <span className="block font-mono text-[10px]" style={{ color: card.c }}>
                      {card.n}
                    </span>
                    <span className="mx-auto mt-1.5 block h-px w-4" style={{ backgroundColor: `${card.c}66` }} />
                    <span className="mt-1.5 block font-mono text-[6px] tracking-[0.15em] text-white/40">
                      {card.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right cluster — instrument readout */}
          <aside className="xl:absolute xl:right-8 xl:top-10 xl:z-10 xl:w-56" aria-label="Instrument readout">
            <div className="border border-white/10 bg-black/40 p-4">
              <p className="font-mono text-[9px] tracking-[0.35em] text-white/35">READOUT · LIVE SKY</p>
              <dl className="mt-3 space-y-3">
                {[
                  { k: "MAJOR ARCANA", v: "22", w: "100%" },
                  { k: "SIGNS TRACKED", v: "12", w: "66%" },
                  { k: "INSTRUMENT ARC", v: "360°", w: "88%" },
                  { k: "FREE TOOLS", v: "04", w: "44%" },
                ].map((row) => (
                  <div key={row.k}>
                    <div className="flex items-baseline justify-between">
                      <dt className="font-mono text-[9px] tracking-[0.25em] text-white/40">{row.k}</dt>
                      <dd className="font-mono text-xs text-[#e8b64c]">{row.v}</dd>
                    </div>
                    <div className="mt-1 h-px w-full bg-white/10">
                      <div className="h-px bg-[#e8b64c]/60" style={{ width: row.w }} />
                    </div>
                  </div>
                ))}
              </dl>

              {/* CYCLE PROGRESS */}
              <div className="mt-4 border-t border-white/10 pt-3">
                <p className="font-mono text-[9px] tracking-[0.35em] text-white/35">CYCLE PROGRESS</p>
                <div className="mt-2 flex items-baseline justify-between font-mono text-[9px] tracking-[0.2em]">
                  <span className="text-white/45">PERSONAL YEAR 7</span>
                  <span className="text-[#e8b64c]">DAY 198 / 365</span>
                </div>
                <div className="mt-2 h-px w-full bg-white/10">
                  <div className="h-px bg-[#e8b64c]" style={{ width: "54%" }} />
                </div>
              </div>

              {/* ELEMENTAL CURRENT */}
              <div className="mt-4 border-t border-white/10 pt-3">
                <p className="font-mono text-[9px] tracking-[0.35em] text-white/35">ELEMENTAL CURRENT</p>
                <div className="mt-2 space-y-2">
                  {ELEMENTS.map((el) => (
                    <div key={el.k} className="flex items-center gap-2">
                      <span className="w-10 font-mono text-[8px] tracking-[0.2em] text-white/40">{el.k}</span>
                      <div className="h-px flex-1 bg-white/10">
                        <div className="h-px" style={{ width: `${el.v}%`, backgroundColor: el.c }} />
                      </div>
                      <span className="font-mono text-[8px]" style={{ color: el.c }}>
                        {el.v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* COSMIC WEATHER */}
              <div className="mt-4 border-t border-white/10 pt-3">
                <p className="font-mono text-[9px] tracking-[0.35em] text-white/35">COSMIC WEATHER · 24H</p>
                <svg viewBox="0 0 200 40" className="mt-2 w-full" aria-hidden>
                  <line x1={0} y1={20} x2={200} y2={20} stroke="#e8e4d8" strokeOpacity={0.12} strokeWidth={0.5} />
                  <polyline
                    className="law-wave"
                    points={WAVE}
                    fill="none"
                    stroke="#2dd4bf"
                    strokeOpacity={0.7}
                    strokeWidth={1}
                    strokeDasharray="4 3"
                  />
                  {[0, 67, 133, 199].map((x) => (
                    <line key={x} x1={x} y1={16} x2={x} y2={24} stroke="#e8e4d8" strokeOpacity={0.2} strokeWidth={0.5} />
                  ))}
                </svg>
                <div className="mt-1 flex justify-between font-mono text-[7px] tracking-[0.2em] text-white/25">
                  <span>06H</span>
                  <span>12H</span>
                  <span>18H</span>
                  <span>24H</span>
                </div>
              </div>

              <p className="mt-4 border-t border-white/10 pt-3 font-mono text-[9px] leading-relaxed tracking-[0.2em] text-white/30">
                UPDATED · 1 MIN AGO
                <br />
                CALIBRATION · TROPICAL
              </p>
            </div>
          </aside>
        </div>

        {/* Bottom status strip */}
        <div className="relative z-10 border-t border-white/10 px-4 py-3 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 font-mono text-[9px] tracking-[0.3em] text-white/30">
            <span>FIG. 01 — THE ARCANA WHEEL · SCALE 1:1 · SKY</span>
            <span className="hidden md:inline">LAT 55.75° N · LON 37.61° E</span>
            <span>
              <span className="text-[#e8b64c]/80">372</span> DRAWS ·{" "}
              <span className="text-[#e8b64c]/80">5.6K</span> INSIGHTS ·{" "}
              <span className="text-[#e8b64c]/80">183</span> ARCANA POINTS
            </span>
          </div>
          <div aria-hidden className="mt-2 flex items-end justify-between">
            {Array.from({ length: 49 }, (_, i) => (
              <span
                key={i}
                className={
                  i % 8 === 0
                    ? "h-3 w-px bg-[#e8b64c]/40"
                    : i % 4 === 0
                      ? "h-2 w-px bg-white/20"
                      : "h-1 w-px bg-white/10"
                }
              />
            ))}
          </div>
        </div>
      </header>

      <Ruler label="SECTOR INDEX BELOW" />

      {/* ---------------- Sector panels ---------------- */}
      <section id="law-sectors" className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-white/10 pb-4">
          <h2 className="font-mono text-[10px] tracking-[0.4em] text-[#e8b64c]/80">
            SECTOR INDEX — SIX INSTRUMENTS
          </h2>
          <p className="font-mono text-[9px] tracking-[0.25em] text-white/30">
            EACH PANEL KEYED TO A NODE OF THE WHEEL
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-12">
          {SECTORS.map((s) => (
            <a
              key={s.no}
              href="#law-cast"
              className={`law-panel group relative border border-white/10 p-6 ${s.span}`}
            >
              {/* connector stub toward the wheel */}
              <span aria-hidden className="absolute -top-5 left-6 flex flex-col items-center">
                <span className="h-5 w-px bg-white/15" />
                <span className="mt-1 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
              </span>
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-mono text-[10px] tracking-[0.3em] text-white/30">
                  {s.no} / 06
                </span>
                <span
                  className="font-mono text-[9px] tracking-[0.3em]"
                  style={{ color: s.color }}
                >
                  {s.kicker}
                </span>
              </div>
              <h3 className="mt-5 text-2xl font-light tracking-tight text-[#efe9dc]">{s.title}</h3>
              <p className="mt-3 max-w-md text-[13px] leading-relaxed text-white/50">{s.copy}</p>

              {/* tiny scale ticks */}
              <div aria-hidden className="mt-5 flex items-end justify-between">
                {Array.from({ length: 25 }, (_, i) => (
                  <span
                    key={i}
                    className={
                      i % 6 === 0 ? "h-2.5 w-px bg-white/25" : "h-1.5 w-px bg-white/10"
                    }
                  />
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                <span className="font-mono text-[9px] tracking-[0.25em] text-white/30">
                  LINKED NODE · {s.node}
                </span>
                <span className="hidden font-mono text-[8px] tracking-[0.2em] text-white/25 sm:inline">
                  {s.coord}
                </span>
                <span className="text-[11px] tracking-[0.2em] text-[#e8b64c] transition-transform duration-300 group-hover:translate-x-1">
                  EXPLORE →
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <Ruler label="INNER RING — OPTIONAL INSTRUMENT" />

      {/* ---------------- Destiny Matrix ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <svg viewBox="0 0 260 260" className="mx-auto w-full max-w-[300px]" role="img" aria-label="Destiny Matrix octagram diagram">
              <g className="law-rot-c" style={{ transformOrigin: "130px 130px" }} fill="none" stroke="#e8b64c">
                <polygon points="130,10 250,130 130,250 10,130" strokeOpacity={0.5} strokeWidth={1} />
                <polygon points="45,45 215,45 215,215 45,215" strokeOpacity={0.5} strokeWidth={1} />
                <circle cx={130} cy={130} r={120} strokeOpacity={0.25} strokeWidth={1} strokeDasharray="1 5" />
                <circle cx={130} cy={130} r={58} strokeOpacity={0.35} strokeWidth={1} />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => {
                  const x = 130 + 120 * Math.cos(rad(d));
                  const y = 130 + 120 * Math.sin(rad(d));
                  return <circle key={d} cx={n(x)} cy={n(y)} r={2.5} fill="#e8b64c" fillOpacity={0.8} stroke="none" />;
                })}
              </g>
              <circle cx={130} cy={130} r={6} fill="#e8b64c" />
              <text x={130} y={158} textAnchor="middle" fontFamily={MONO} fontSize={8} letterSpacing="0.3em" fill="#e8b64c" fillOpacity={0.6}>
                VIII · OCTAGRAM
              </text>
            </svg>
            <p className="mt-4 text-center font-mono text-[9px] tracking-[0.3em] text-white/25">
              FIG. 07 — BIRTH-DATE OCTAGRAM
            </p>
          </div>
          <div className="lg:col-span-7">
            <p className="font-mono text-[10px] tracking-[0.4em] text-[#e8b64c]/80">
              INNER RING — OPTIONAL
            </p>
            <h2 className="mt-4 text-3xl font-light tracking-tight text-[#efe9dc]">Destiny Matrix</h2>
            <p className="mt-4 max-w-lg text-[13px] leading-relaxed text-white/50">
              An optional birth-date octagram tool. It maps purpose, love, money, and age
              themes from your birth date.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["PURPOSE", "LOVE", "MONEY", "AGE THEMES"].map((tag) => (
                <span
                  key={tag}
                  className="border border-white/10 px-3 py-1 font-mono text-[9px] tracking-[0.3em] text-white/40"
                >
                  {tag}
                </span>
              ))}
            </div>
            <a
              href="#law-cast"
              className="mt-8 inline-block text-[11px] tracking-[0.2em] text-[#e8b64c] transition-colors hover:text-[#f5cf6e]"
            >
              OPEN DESTINY MATRIX →
            </a>
          </div>
        </div>
      </section>

      <Ruler label="SMALL PRINT — FREQUENTLY ASKED" />

      {/* ---------------- FAQ — small print rows ---------------- */}
      <section id="law-faq" className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-20">
        <div className="flex items-baseline justify-between border-b border-white/10 pb-4">
          <h2 className="font-mono text-[10px] tracking-[0.4em] text-[#e8b64c]/80">FAQ / SMALL PRINT</h2>
          <span className="font-mono text-[9px] tracking-[0.25em] text-white/30">4 ENTRIES</span>
        </div>
        <dl>
          {FAQ.map((item, i) => (
            <div
              key={item.q}
              className="grid gap-2 border-b border-white/10 py-5 md:grid-cols-12 md:gap-6"
            >
              <dt className="font-mono text-[10px] tracking-[0.3em] text-white/30 md:col-span-1">
                F.0{i + 1}
              </dt>
              <dt className="text-sm font-medium tracking-wide text-[#efe9dc] md:col-span-4">
                {item.q}
              </dt>
              <dd className="text-[12px] leading-relaxed text-white/45 md:col-span-7">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------------- CTA band ---------------- */}
      <section id="law-cast" className="border-y border-[#e8b64c]/25 bg-[#e8b64c]/[0.04]">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-8 sm:py-20 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[10px] tracking-[0.4em] text-[#e8b64c]/80">
              FINAL TRANSIT — NO ACCOUNT NEEDED
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-light leading-tight tracking-tight text-[#efe9dc] sm:text-5xl">
              Your chart is written in the stars.
              <br />
              Come read it.
            </h2>
          </div>
          <div className="flex flex-col items-start gap-3">
            <a
              href="#law-wheel"
              className="inline-flex items-center gap-2 bg-[#e8b64c] px-7 py-3.5 text-[11px] font-semibold tracking-[0.2em] text-[#06060c] transition-colors hover:bg-[#f5cf6e]"
            >
              GET STARTED — IT&rsquo;S FREE
            </a>
            <span className="font-mono text-[9px] tracking-[0.3em] text-white/30">
              CHART + HOROSCOPE + TAROT + TESTS · $0
            </span>
          </div>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
        <span className="text-[11px] font-semibold tracking-[0.35em] text-[#e8b64c]">ASTRO SCOPE</span>
        <div className="flex gap-6 font-mono text-[9px] tracking-[0.25em] text-white/35">
          <a href="#law-sectors" className="transition-colors hover:text-[#e8b64c]">HOROSCOPES</a>
          <a href="#law-sectors" className="transition-colors hover:text-[#e8b64c]">TAROT</a>
          <a href="#law-sectors" className="transition-colors hover:text-[#e8b64c]">COMPATIBILITY</a>
          <a href="#law-faq" className="transition-colors hover:text-[#e8b64c]">FAQ</a>
        </div>
        <span className="font-mono text-[9px] tracking-[0.25em] text-white/25">
          © 2026 · THE WHEEL TURNS
        </span>
      </footer>
    </main>
  );
}
