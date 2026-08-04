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

type Sector = {
  no: string;
  kicker: string;
  title: string;
  copy: string;
  node: string;
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
    color: "#f5b93f",
    span: "lg:col-span-7",
  },
  {
    no: "02",
    kicker: "DAILY",
    title: "Daily Horoscope",
    copy: "Twelve signs, one sky. Clear forecasts without the fluff.",
    node: "XVIII · THE MOON",
    color: "#c9d4e6",
    span: "lg:col-span-5 lg:mt-14",
  },
  {
    no: "03",
    kicker: "SYNASTRY",
    title: "Compatibility",
    copy: "Zodiac match, Chinese pairs, and deep synastry for two charts.",
    node: "VI · THE LOVERS",
    color: "#c084fc",
    span: "lg:col-span-5",
  },
  {
    no: "04",
    kicker: "SPREADS",
    title: "Tarot",
    copy: "Daily card to Celtic Cross — pull, reflect, get a full reading.",
    node: "XVII · THE STAR",
    color: "#a78bfa",
    span: "lg:col-span-7 lg:-mt-6",
  },
  {
    no: "05",
    kicker: "TESTS",
    title: "Psychology",
    copy: "MBTI, Big Five, empathy and more — meet yourself beyond the signs.",
    node: "IX · THE HERMIT",
    color: "#2dd4bf",
    span: "lg:col-span-6",
  },
  {
    no: "06",
    kicker: "YOU",
    title: "Cosmic Passport",
    copy: "Your Cosmic ID, people, journal, and Premium deep dives — one hub.",
    node: "III · THE EMPRESS",
    color: "#4ade80",
    span: "lg:col-span-6 lg:mt-10",
  },
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

const DEGREES = Array.from({ length: 12 }, (_, i) => {
  const deg = i * 30;
  const p = pt(388, deg);
  return { key: `d${i}`, x: n(p.x), y: n(p.y), label: `${deg}°` };
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
  .law-rot-a { animation: law-rot 180s linear infinite; transform-origin: 500px 500px; }
  .law-rot-b { animation: law-rot-rev 120s linear infinite; transform-origin: 500px 500px; }
  .law-rot-c { animation: law-rot-rev 90s linear infinite; transform-origin: 500px 500px; }
  .law-core { animation: law-core-pulse 16s ease-in-out infinite; }
  .law-node-glow { animation: law-pulse 14s ease-in-out infinite; }
  .law-begin { transition: letter-spacing 400ms ease; }
  .law-begin:hover .law-begin-text { letter-spacing: 0.55em; }
  .law-begin:hover .law-begin-ring { stroke-opacity: 0.9; }
  .law-panel { transition: border-color 200ms ease, background-color 200ms ease; }
  .law-panel:hover { border-color: rgba(232, 182, 76, 0.35); background-color: rgba(255, 255, 255, 0.02); }
  @media (max-width: 640px) {
    .law-hide-sm { display: none; }
  }
  @media (prefers-reduced-motion: reduce) {
    .law-rot-a, .law-rot-b, .law-rot-c, .law-core, .law-node-glow { animation: none; }
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
      <header id="law-wheel" className="relative flex flex-col lg:block lg:min-h-screen">
        {/* Hero text — small, top-left */}
        <div className="relative z-10 max-w-md px-4 pt-10 sm:px-8 lg:absolute lg:left-8 lg:top-10 lg:max-w-xs lg:px-0 lg:pt-0">
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

        {/* Instrument readout — top-right, desktop only */}
        <aside className="absolute right-8 top-10 z-10 hidden w-52 lg:block" aria-label="Instrument readout">
          <div className="border border-white/10 bg-black/30 p-4">
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
            <p className="mt-4 border-t border-white/10 pt-3 font-mono text-[9px] leading-relaxed tracking-[0.2em] text-white/30">
              UPDATED · 1 MIN AGO
              <br />
              CALIBRATION · TROPICAL
            </p>
          </div>
        </aside>

        {/* The wheel */}
        <div className="law-wheel-glow relative mx-auto w-[min(96vw,1020px)] lg:-mt-6">
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
              <circle cx={CX} cy={CY} r={442} strokeOpacity={0.1} strokeWidth={1} />
              <circle cx={CX} cy={CY} r={368} strokeOpacity={0.14} strokeWidth={1} />
              <circle cx={CX} cy={CY} r={300} strokeOpacity={0.1} strokeWidth={1} strokeDasharray="2 7" />
              <circle cx={CX} cy={CY} r={252} strokeOpacity={0.08} strokeWidth={1} />
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

            {/* Degree numbers (static, hidden on small screens) */}
            <g className="law-hide-sm" fontFamily={MONO} fontSize={9} fill="#6b6880" textAnchor="middle">
              {DEGREES.map((d) => (
                <text key={d.key} x={d.x} y={d.y + 3}>
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

        {/* Bottom hero marginalia */}
        <div className="relative z-10 flex items-center justify-between px-4 pb-6 font-mono text-[9px] tracking-[0.3em] text-white/25 sm:px-8 lg:absolute lg:bottom-6 lg:left-0 lg:right-0">
          <span>LAT 55.75° N · LON 37.61° E</span>
          <span className="hidden sm:inline">FIG. 01 — THE ARCANA WHEEL</span>
          <span>SCALE 1:1 · SKY</span>
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
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="font-mono text-[9px] tracking-[0.25em] text-white/30">
                  LINKED NODE · {s.node}
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
