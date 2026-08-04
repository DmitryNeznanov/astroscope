// LAB / ASTRA CONSOLE — the landing page as a dense cosmic dashboard, after the
// "ASTRAVIS" reference: a thin icon rail, a top instrument bar, then a
// three-column console — stat panels left, a huge hand-built astral map in the
// center (concentric rings, ticks, glowing arcana nodes), cycle/element/weather
// panels right — with journey + daily pull beneath, then the six production
// modules folded in as a console row. Fully self-contained: inline SVG,
// Tailwind for layout, one scoped <style> block (lax- prefixed) for the rest.
// Server-component safe: no hooks, CSS animations only, statically prerendered.

import type { Metadata } from "next";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Astro Scope — Astra Console",
  description:
    "Free birth chart, daily horoscopes, synastry and tarot — the whole sky, rendered as one instrument.",
};

const DEG = Math.PI / 180;

// console palette — near-black blue glass, glowing instrument colors
const BG = "#05080f";
const PANEL = "#080d18";
const LINE = "#1c2740";
const INK = "#d8cfae";
const DIM = "#6f7d9c";
const FAINT = "#44506e";
const GOLD = "#e8b34b";
const ORANGE = "#e2703a";
const PINK = "#e05a9a";
const TEAL = "#3ec8b8";
const PURPLE = "#9a6ae0";
const BLUE = "#5a8ae0";
const RED = "#d04848";
const SILVER = "#9db4d8";

function polar(cx: number, cy: number, r: number, deg: number) {
  const t = deg * DEG;
  return { x: +(cx + r * Math.cos(t)).toFixed(1), y: +(cy + r * Math.sin(t)).toFixed(1) };
}

// n radial ticks from rIn to rOut around (cx, cy)
function ringTicks(cx: number, cy: number, rIn: number, rOut: number, n: number, offset = 0) {
  return Array.from({ length: n }, (_, k) => {
    const a = offset + (360 / n) * k;
    const p1 = polar(cx, cy, rIn, a);
    const p2 = polar(cx, cy, rOut, a);
    return { ...p1, x2: p2.x, y2: p2.y, major: k % (n / 12) === 0 };
  });
}

// regular star polygon path: n points alternating R/r, starting at top
function starN(cx: number, cy: number, n: number, R: number, r: number, rot = 0): string {
  let d = "";
  for (let k = 0; k < n * 2; k++) {
    const rad = k % 2 ? r : R;
    const t = ((k * 180) / n - 90 + rot) * DEG;
    d += `${k ? "L" : "M"} ${(cx + rad * Math.cos(t)).toFixed(1)} ${(cy + rad * Math.sin(t)).toFixed(1)} `;
  }
  return d + "Z";
}

// every glyph carries U+FE0E so it renders as monochrome text, never emoji
const SIGNS = [
  { g: "♈︎", n: "Aries", d: "Mar 21 – Apr 19" },
  { g: "♉︎", n: "Taurus", d: "Apr 20 – May 20" },
  { g: "♊︎", n: "Gemini", d: "May 21 – Jun 20" },
  { g: "♋︎", n: "Cancer", d: "Jun 21 – Jul 22" },
  { g: "♌︎", n: "Leo", d: "Jul 23 – Aug 22" },
  { g: "♍︎", n: "Virgo", d: "Aug 23 – Sep 22" },
  { g: "♎︎", n: "Libra", d: "Sep 23 – Oct 22" },
  { g: "♏︎", n: "Scorpio", d: "Oct 23 – Nov 21" },
  { g: "♐︎", n: "Sagittarius", d: "Nov 22 – Dec 21" },
  { g: "♑︎", n: "Capricorn", d: "Dec 22 – Jan 19" },
  { g: "♒︎", n: "Aquarius", d: "Jan 20 – Feb 18" },
  { g: "♓︎", n: "Pisces", d: "Feb 19 – Mar 20" },
];

const MODULES = [
  { tag: "FREE", title: "Birth Chart", copy: "Map your Sun, Moon, and Rising — the foundation of every reading." },
  { tag: "DAILY", title: "Daily Horoscope", copy: "Twelve signs, one sky. Clear forecasts without the fluff." },
  { tag: "SYNASTRY", title: "Compatibility", copy: "Zodiac match, Chinese pairs, and deep synastry for two charts." },
  { tag: "SPREADS", title: "Tarot", copy: "Daily card to Celtic Cross — pull, reflect, get a full reading." },
  { tag: "TESTS", title: "Psychology", copy: "MBTI, Big Five, empathy and more — meet yourself beyond the signs." },
  { tag: "YOU", title: "Cosmic Passport", copy: "Your Cosmic ID, people, journal, and Premium deep dives — one hub." },
];

const FAQ = [
  {
    q: "What can I do for free?",
    a: "Your birth chart, daily horoscopes, tarot pulls and psychology tests — all free, no account needed.",
  },
  {
    q: "How do I get my free birth chart?",
    a: "Enter your date, time and place of birth in the calculator — the chart is drawn instantly.",
  },
  {
    q: "Where are daily horoscopes?",
    a: "On the homepage grid for all twelve signs, or collected in the Horoscopes hub.",
  },
  {
    q: "What is the Destiny Matrix?",
    a: "An optional birth-date octagram that maps purpose, love, money and age themes from your date of birth.",
  },
];

const BALANCES = [
  { n: "Intuition", v: 68, c: TEAL },
  { n: "Willpower", v: 81, c: ORANGE },
  { n: "Wisdom", v: 64, c: PURPLE },
  { n: "Energy", v: 76, c: PINK },
];

const INFLUENCES = [
  { n: "Solar Peak", s: "High Vitality & Clarity", level: "HIGH", c: GOLD },
  { n: "Lunar Flow", s: "Intuition Enhanced", level: "STRONG", c: TEAL },
  { n: "Mercury Shift", s: "Messages & Movement", level: "MODERATE", c: ORANGE },
  { n: "Venus Grace", s: "Connection & Harmony", level: "FAVORABLE", c: PINK },
];

const ELEMENTS = [
  { n: "Fire", v: 62, c: ORANGE },
  { n: "Water", v: 48, c: BLUE },
  { n: "Air", v: 71, c: GOLD },
  { n: "Earth", v: 55, c: TEAL },
];

const INSIGHTS = [
  { n: "The Sun: Upright", s: "Success · Vitality · Clarity", t: "2h ago", c: GOLD },
  { n: "The Two of Cups", s: "Union · Partnership · Balance", t: "6h ago", c: PINK },
  { n: "The Hierophant: Reversed", s: "Rebellion · Question · New Path", t: "1d ago", c: PURPLE },
];

const JOURNEY = [
  { n: "Clarity", v: 68, c: TEAL },
  { n: "Purpose", v: 72, c: GOLD },
  { n: "Growth", v: 58, c: BLUE },
  { n: "Harmony", v: 66, c: PINK },
];

// arcana placed on the map: angle in degrees (0 = east, -90 = north), r = orbit
type ArcanaNode = {
  name: string;
  aspect: string;
  numeral: string;
  value: number;
  color: string;
  angle: number;
  r: number;
};

const ARCANA: ArcanaNode[] = [
  { name: "The Sun", aspect: "Vitality", numeral: "XIX", value: 78, color: GOLD, angle: -90, r: 238 },
  { name: "The Moon", aspect: "Intuition", numeral: "XVIII", value: 66, color: SILVER, angle: -50, r: 256 },
  { name: "The Hermit", aspect: "Wisdom", numeral: "IX", value: 61, color: TEAL, angle: -14, r: 226 },
  { name: "The Lovers", aspect: "Connection", numeral: "VI", value: 37, color: PINK, angle: 22, r: 252 },
  { name: "Death", aspect: "Transformation", numeral: "XIII", value: -24, color: RED, angle: 58, r: 232 },
  { name: "Judgement", aspect: "Renewal", numeral: "XX", value: 35, color: ORANGE, angle: 90, r: 206 },
  { name: "The Chariot", aspect: "Focus", numeral: "VII", value: 49, color: BLUE, angle: 122, r: 246 },
  { name: "The Tower", aspect: "Change", numeral: "XVI", value: -18, color: "#c25a3a", angle: 158, r: 216 },
  { name: "The Empress", aspect: "Growth", numeral: "III", value: 53, color: "#7ac26a", angle: 196, r: 242 },
  { name: "The Star", aspect: "Inspiration", numeral: "XVII", value: 42, color: PURPLE, angle: 232, r: 222 },
];

/* ------------------------------------------------------------------ */
/* small building blocks                                               */
/* ------------------------------------------------------------------ */

function PanelHead({ index, title, meta }: { index: string; title: string; meta?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b px-4 pb-2 pt-3" style={{ borderColor: LINE }}>
      <div className="flex items-baseline gap-2">
        <span className="lax-mono text-[9px]" style={{ color: FAINT }}>{index}</span>
        <span className="lax-caps" style={{ color: DIM }}>{title}</span>
      </div>
      {meta ? (
        <span className="lax-mono text-[9px] uppercase tracking-widest" style={{ color: FAINT }}>{meta}</span>
      ) : null}
    </div>
  );
}

function BarRow({ name, value, color }: { name: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="lax-caps w-[74px] shrink-0" style={{ color: DIM }}>{name}</span>
      <span className="lax-bar-track">
        <span className="lax-bar-fill" style={{ width: `${value}%`, background: color }} />
      </span>
      <span className="lax-mono w-8 shrink-0 text-right text-[10px]" style={{ color: INK }}>{value}%</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* the astral map                                                      */
/* ------------------------------------------------------------------ */

const MC = 380; // map center in viewBox units

function AstralMap() {
  const outerTicks = ringTicks(MC, MC, 296, 304, 72);
  const innerTicks = ringTicks(MC, MC, 168, 173, 48, 3.75);
  const degrees = Array.from({ length: 12 }, (_, k) => {
    const p = polar(MC, MC, 284, k * 30 - 90);
    return { ...p, label: `${k * 30}°` };
  });
  return (
    <svg viewBox="0 0 760 760" className="lax-map" role="img" aria-label="Astral map of the ten arcana">
      <defs>
        <radialGradient id="lax-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe9b0" />
          <stop offset="35%" stopColor={GOLD} stopOpacity="0.9" />
          <stop offset="70%" stopColor={GOLD} stopOpacity="0.18" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lax-haze" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.10" />
          <stop offset="55%" stopColor={TEAL} stopOpacity="0.04" />
          <stop offset="100%" stopColor={BG} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ambient haze */}
      <circle cx={MC} cy={MC} r={360} fill="url(#lax-haze)" />

      {/* rotating instrument layer: orbit rings + ticks */}
      <g className="lax-spin-a">
        {[120, 160, 200, 240, 280].map((r, i) => (
          <circle
            key={r}
            cx={MC}
            cy={MC}
            r={r}
            fill="none"
            stroke={LINE}
            strokeWidth={i === 4 ? 1 : 0.6}
            strokeDasharray={i % 2 ? "2 6" : undefined}
          />
        ))}
        {outerTicks.map((t, k) => (
          <line
            key={k}
            x1={t.x} y1={t.y} x2={t.x2} y2={t.y2}
            stroke={t.major ? DIM : FAINT}
            strokeWidth={t.major ? 1 : 0.5}
          />
        ))}
        {/* orbit beads */}
        {ARCANA.map((a, k) => {
          const p = polar(MC, MC, a.r, a.angle + 14);
          return <circle key={k} cx={p.x} cy={p.y} r={1.4} fill={DIM} />;
        })}
      </g>

      {/* counter-rotating inner geometry */}
      <g className="lax-spin-b">
        {innerTicks.map((t, k) => (
          <line key={k} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={FAINT} strokeWidth={0.5} />
        ))}
        <circle cx={MC} cy={MC} r={150} fill="none" stroke={LINE} strokeWidth={0.6} strokeDasharray="10 4 2 4" />
      </g>

      {/* static zodiac band */}
      {SIGNS.map((s, k) => {
        const p = polar(MC, MC, 138, k * 30 - 90);
        return (
          <text key={s.n} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central"
            fontSize={13} fill={DIM} opacity={0.85}>
            {s.g}
          </text>
        );
      })}

      {/* degree readouts */}
      {degrees.map((d, k) => (
        <text key={k} x={d.x} y={d.y} textAnchor="middle" dominantBaseline="central"
          fontSize={8} fill={FAINT} className="lax-mono">
          {d.label}
        </text>
      ))}

      {/* inner star geometry */}
      <g className="lax-spin-c">
        <path d={starN(MC, MC, 8, 108, 46)} fill="none" stroke={GOLD} strokeWidth={0.7} opacity={0.55} />
        <path d={starN(MC, MC, 8, 108, 46, 22.5)} fill="none" stroke={GOLD} strokeWidth={0.5} opacity={0.3} />
        <circle cx={MC} cy={MC} r={108} fill="none" stroke={GOLD} strokeWidth={0.5} opacity={0.4} />
      </g>
      <path d={starN(MC, MC, 4, 76, 76)} fill="none" stroke={GOLD} strokeWidth={0.5} opacity={0.35} transform={`rotate(45 ${MC} ${MC})`} />
      <path d={starN(MC, MC, 4, 76, 76)} fill="none" stroke={GOLD} strokeWidth={0.5} opacity={0.35} />

      {/* spokes to nodes */}
      {ARCANA.map((a) => {
        const p1 = polar(MC, MC, 120, a.angle);
        const p2 = polar(MC, MC, a.r - 18, a.angle);
        return (
          <line key={a.name} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke={a.color} strokeWidth={0.5} opacity={0.28} strokeDasharray="1 4" />
        );
      })}

      {/* glowing core */}
      <circle cx={MC} cy={MC} r={52} fill="url(#lax-core)" className="lax-breathe" />
      <circle cx={MC} cy={MC} r={14} fill="#ffe9b0" opacity={0.95} />
      <circle cx={MC} cy={MC} r={22} fill="none" stroke={GOLD} strokeWidth={0.8} opacity={0.8} />
      <circle cx={MC} cy={MC} r={30} fill="none" stroke={GOLD} strokeWidth={0.4} opacity={0.4} strokeDasharray="2 3" />

      {/* north / south node markers */}
      <text x={MC} y={MC - 320} textAnchor="middle" fontSize={9} fill={DIM} className="lax-caps-svg">North Node</text>
      <text x={MC} y={MC + 332} textAnchor="middle" fontSize={9} fill={FAINT} className="lax-caps-svg">South Node</text>
      <circle cx={MC} cy={MC - 308} r={2.5} fill="none" stroke={DIM} strokeWidth={0.8} />
      <circle cx={MC} cy={MC + 308} r={2.5} fill={FAINT} />

      {/* arcana nodes */}
      {ARCANA.map((a, i) => {
        const p = polar(MC, MC, a.r, a.angle);
        const cos = Math.cos(a.angle * DEG);
        const anchor = cos > 0.35 ? "start" : cos < -0.35 ? "end" : "middle";
        const lp = polar(MC, MC, a.r + 34, a.angle);
        const lx = anchor === "middle" ? p.x : lp.x;
        const sign = a.value >= 0 ? "+" : "−";
        return (
          <g key={a.name}>
            <circle cx={p.x} cy={p.y} r={26} fill={a.color} opacity={0.14} className="lax-pulse"
              style={{ animationDelay: `${i * 1.7}s` } as CSSProperties} />
            <circle cx={p.x} cy={p.y} r={17} fill={PANEL} stroke={a.color} strokeWidth={1.1} />
            <circle cx={p.x} cy={p.y} r={21} fill="none" stroke={a.color} strokeWidth={0.4} opacity={0.45}
              strokeDasharray="2 3" />
            <text x={p.x} y={p.y + 0.5} textAnchor="middle" dominantBaseline="central"
              fontSize={9.5} fill={a.color} className="lax-mono">
              {a.numeral}
            </text>
            <text x={lx} y={lp.y - 6} textAnchor={anchor} fontSize={10.5} fill={INK} className="lax-caps-svg">
              {a.name}
            </text>
            <text x={lx} y={lp.y + 5} textAnchor={anchor} fontSize={8.5} fill={DIM}>
              {a.aspect}
            </text>
            <text x={lx} y={lp.y + 16} textAnchor={anchor} fontSize={9.5} fill={a.color} className="lax-mono">
              {sign} {Math.abs(a.value)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* smaller instruments                                                 */
/* ------------------------------------------------------------------ */

function WeatherWave() {
  // hand-tuned 3-day outlook curve
  const d = "M0,44 C18,22 30,18 44,32 S72,56 92,46 S128,10 152,24 S196,52 218,38 S246,24 260,30";
  const planets = [
    { x: 44, y: 32, c: PURPLE },
    { x: 112, y: 30, c: BLUE },
    { x: 152, y: 24, c: GOLD, big: true },
    { x: 218, y: 38, c: TEAL },
  ];
  return (
    <svg viewBox="0 0 260 64" className="h-auto w-full" role="img" aria-label="Cosmic weather, three day outlook">
      {[16, 32, 48].map((y) => (
        <line key={y} x1={0} y1={y} x2={260} y2={y} stroke={LINE} strokeWidth={0.5} strokeDasharray="2 4" />
      ))}
      <path d={d} fill="none" stroke={TEAL} strokeWidth={1.2} opacity={0.9} className="lax-wave" />
      <path d={`${d} L260,64 L0,64 Z`} fill={TEAL} opacity={0.06} />
      {planets.map((p, k) => (
        <g key={k}>
          <circle cx={p.x} cy={p.y} r={p.big ? 6 : 3.5} fill={p.c} opacity={0.25} />
          <circle cx={p.x} cy={p.y} r={p.big ? 3.2 : 1.8} fill={p.c} />
        </g>
      ))}
      {["D-1", "D0", "D+1", "D+2"].map((t, k) => (
        <text key={t} x={20 + k * 73} y={62} fontSize={7} fill={FAINT} textAnchor="middle" className="lax-mono">
          {t}
        </text>
      ))}
    </svg>
  );
}

function JourneyRing() {
  const r = 34;
  const c = 2 * Math.PI * r;
  const pct = 62;
  return (
    <svg viewBox="0 0 88 88" className="h-[88px] w-[88px] shrink-0" role="img" aria-label="Journey progress 62 percent">
      <circle cx={44} cy={44} r={r} fill="none" stroke={LINE} strokeWidth={4} />
      <circle cx={44} cy={44} r={r} fill="none" stroke={TEAL} strokeWidth={4} strokeLinecap="round"
        strokeDasharray={`${((pct / 100) * c).toFixed(1)} ${c.toFixed(1)}`}
        transform="rotate(-90 44 44)" />
      <circle cx={44} cy={44} r={r - 8} fill="none" stroke={LINE} strokeWidth={0.6} strokeDasharray="1 3" />
      <text x={44} y={42} textAnchor="middle" fontSize={15} fill={INK} className="lax-mono">{pct}%</text>
      <text x={44} y={55} textAnchor="middle" fontSize={6} fill={FAINT} className="lax-caps-svg">Seeker Augur</text>
    </svg>
  );
}

function DailyCard() {
  return (
    <svg viewBox="0 0 72 112" className="h-[104px] w-auto shrink-0" role="img" aria-label="Face-down tarot card">
      <rect x={2} y={2} width={68} height={108} rx={4} fill="#0b1120" stroke={GOLD} strokeWidth={1} opacity={0.95} />
      <rect x={7} y={7} width={58} height={98} rx={2} fill="none" stroke={GOLD} strokeWidth={0.5} opacity={0.5} />
      <path d={starN(36, 56, 8, 24, 10)} fill="none" stroke={GOLD} strokeWidth={0.7} opacity={0.8} />
      <circle cx={36} cy={56} r={5} fill="none" stroke={GOLD} strokeWidth={0.7} />
      <circle cx={36} cy={56} r={1.6} fill={GOLD} />
      {ringTicks(36, 56, 29, 32, 24).map((t, k) => (
        <line key={k} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth={0.4} opacity={0.5} />
      ))}
      <text x={36} y={98} textAnchor="middle" fontSize={6} fill={DIM} className="lax-caps-svg">Arcana</text>
    </svg>
  );
}

function Octagram() {
  return (
    <svg viewBox="0 0 200 200" className="h-auto w-full max-w-[220px]" role="img" aria-label="Destiny Matrix octagram">
      <circle cx={100} cy={100} r={92} fill="none" stroke={LINE} strokeWidth={0.8} />
      <circle cx={100} cy={100} r={70} fill="none" stroke={LINE} strokeWidth={0.5} strokeDasharray="2 4" />
      <path d={starN(100, 100, 8, 84, 36)} fill="none" stroke={GOLD} strokeWidth={0.8} opacity={0.8} />
      <path d={starN(100, 100, 8, 84, 36, 22.5)} fill="none" stroke={GOLD} strokeWidth={0.5} opacity={0.4} />
      {ringTicks(100, 100, 88, 92, 48).map((t, k) => (
        <line key={k} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={t.major ? DIM : FAINT} strokeWidth={0.5} />
      ))}
      {["Purpose", "Love", "Money", "Age"].map((t, k) => {
        const p = polar(100, 100, 58, k * 90 - 90);
        return (
          <text key={t} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central"
            fontSize={8} fill={DIM} className="lax-caps-svg">
            {t}
          </text>
        );
      })}
      <circle cx={100} cy={100} r={10} fill={GOLD} opacity={0.25} />
      <circle cx={100} cy={100} r={3} fill="#ffe9b0" />
    </svg>
  );
}

// thin rail icons — 18px stroke pictograms
function RailGlyph({ kind, active }: { kind: string; active?: boolean }) {
  const c = active ? GOLD : DIM;
  const common = { fill: "none", stroke: c, strokeWidth: 1.2 } as const;
  return (
    <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]">
      {kind === "home" && (
        <g {...common}><circle cx={10} cy={10} r={6.5} /><circle cx={10} cy={10} r={1.6} fill={c} stroke="none" /></g>
      )}
      {kind === "chart" && (
        <g {...common}>
          <circle cx={10} cy={10} r={6.5} />
          <line x1={10} y1={3.5} x2={10} y2={16.5} /><line x1={3.5} y1={10} x2={16.5} y2={10} />
        </g>
      )}
      {kind === "arcana" && (
        <path d={starN(10, 10, 4, 7, 2.6)} {...common} />
      )}
      {kind === "cycles" && (
        <g {...common}>
          <circle cx={10} cy={10} r={6.5} strokeDasharray="3 2" />
          <circle cx={10} cy={10} r={3} />
        </g>
      )}
      {kind === "moon" && (
        <path d="M13 3.5 A6.5 6.5 0 1 0 13 16.5 A5.2 5.2 0 1 1 13 3.5 Z" {...common} />
      )}
      {kind === "journal" && (
        <g {...common}>
          <rect x={5} y={3.5} width={10} height={13} rx={1} />
          <line x1={7.5} y1={7} x2={12.5} y2={7} /><line x1={7.5} y1={10} x2={12.5} y2={10} />
        </g>
      )}
      {kind === "gear" && (
        <g {...common}>
          <circle cx={10} cy={10} r={3} />
          {ringTicks(10, 10, 5, 7, 8).map((t, k) => (
            <line key={k} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} />
          ))}
        </g>
      )}
    </svg>
  );
}

const RAIL = [
  { kind: "home", label: "Home", active: true },
  { kind: "chart", label: "Chart" },
  { kind: "arcana", label: "Arcana" },
  { kind: "cycles", label: "Cycles" },
  { kind: "moon", label: "Lunar" },
  { kind: "journal", label: "Journal" },
  { kind: "gear", label: "Config" },
];

function WordmarkSigil({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" style={{ width: size, height: size }} aria-hidden="true">
      <circle cx={16} cy={16} r={14.5} fill="none" stroke={GOLD} strokeWidth={1} />
      <path d={starN(16, 16, 6, 11, 4.6)} fill="none" stroke={GOLD} strokeWidth={0.9} />
      <circle cx={16} cy={16} r={2} fill={GOLD} />
      {ringTicks(16, 16, 12.5, 14.5, 12).map((t, k) => (
        <line key={k} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth={0.5} />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* the page                                                            */
/* ------------------------------------------------------------------ */

export default function AstraConsolePage() {
  return (
    <div className="lax-root min-h-screen">
      {/* ============ top instrument bar ============ */}
      <header className="flex items-center gap-4 border-b px-4 py-2.5 lg:px-6" style={{ borderColor: LINE }}>
        <a href="#" className="flex items-center gap-2.5">
          <WordmarkSigil />
          <span className="leading-none">
            <span className="lax-wordmark block">Astro Scope</span>
            <span className="lax-mono mt-1 block text-[8px] uppercase tracking-[0.3em]" style={{ color: FAINT }}>
              Arcana OS
            </span>
          </span>
        </a>
        <nav className="mx-auto hidden items-center gap-1 md:flex">
          {["Horoscopes", "Tarot", "Compatibility"].map((t) => (
            <a key={t} href="#" className="lax-tab">{t}</a>
          ))}
        </nav>
        <span className="lax-mono ml-auto hidden text-[9px] uppercase tracking-widest md:ml-0 lg:block" style={{ color: FAINT }}>
          Seeker of Light · Level VII
        </span>
        <a href="#" className="lax-btn-ghost ml-auto md:ml-0">Sign In</a>
      </header>

      <div className="flex">
        {/* ============ left icon rail ============ */}
        <aside className="sticky top-0 hidden h-screen w-[64px] shrink-0 flex-col items-center gap-1 border-r py-4 lg:flex"
          style={{ borderColor: LINE }}>
          {RAIL.map((r) => (
            <a key={r.kind} href="#" className={`lax-rail-item${r.active ? " lax-rail-active" : ""}`}>
              <RailGlyph kind={r.kind} active={r.active} />
              <span className="lax-caps text-[7px]">{r.label}</span>
            </a>
          ))}
          <span className="lax-mono mt-auto rotate-180 text-[8px] uppercase tracking-[0.3em]"
            style={{ color: FAINT, writingMode: "vertical-rl" }}>
            Console 02.4
          </span>
        </aside>

        <main className="min-w-0 flex-1">
          {/* ============ hero strip ============ */}
          <section className="grid grid-cols-1 gap-6 border-b px-4 py-8 lg:grid-cols-[1.5fr_1fr] lg:px-8 lg:py-10"
            style={{ borderColor: LINE }}>
            <div>
              <p className="lax-caps mb-4" style={{ color: GOLD }}>
                Live sky · Arcana OS · Console 02.4
              </p>
              <h1 className="lax-serif max-w-[16ch] text-4xl leading-[1.05] lg:text-5xl" style={{ color: INK }}>
                Your fate, rendered as an instrument.
              </h1>
              <p className="mt-4 max-w-[52ch] text-sm leading-relaxed" style={{ color: DIM }}>
                Free birth chart, daily horoscopes, synastry and tarot — the whole sky
                read from a single console, calibrated to the moment you were born.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href="#" className="lax-btn-primary">Cast your free birth chart</a>
                <a href="#" className="lax-btn-ghost">Read today&rsquo;s horoscope →</a>
              </div>
            </div>
            <div className="grid grid-cols-2 content-start gap-px border lg:self-center"
              style={{ borderColor: LINE, background: LINE }}>
              {[
                { k: "Sidereal Time", v: "14:22:08" },
                { k: "Moon Phase", v: "Waxing · 78%" },
                { k: "Julian Date", v: "2460912.5" },
                { k: "Next Transit", v: "Mercury → Gemini · 5d" },
              ].map((c) => (
                <div key={c.k} className="px-3 py-2.5" style={{ background: PANEL }}>
                  <p className="lax-caps text-[8px]" style={{ color: FAINT }}>{c.k}</p>
                  <p className="lax-mono mt-1 text-[11px]" style={{ color: INK }}>{c.v}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ============ main console ============ */}
          <section className="grid grid-cols-1 gap-px border-b lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[290px_minmax(0,1fr)_310px]"
            style={{ borderColor: LINE, background: LINE }}>

            {/* ---- left column ---- */}
            <div className="flex flex-col gap-px" style={{ background: LINE }}>
              {/* arcana score */}
              <div style={{ background: PANEL }}>
                <PanelHead index="01" title="Arcana Score" meta="1 min ago" />
                <div className="flex items-end justify-between px-4 pb-1 pt-3">
                  <span className="lax-mono text-5xl leading-none" style={{ color: INK }}>742</span>
                  <span className="lax-mono text-[10px]" style={{ color: TEAL }}>▲ 12 this cycle</span>
                </div>
                <div className="px-4 pb-4 pt-2">
                  <div className="flex items-baseline justify-between">
                    <span className="lax-caps" style={{ color: DIM }}>Path Alignment</span>
                    <span className="lax-mono text-[10px]" style={{ color: INK }}>72%</span>
                  </div>
                  <span className="lax-bar-track mt-2">
                    <span className="lax-bar-fill" style={{ width: "72%", background: GOLD }} />
                  </span>
                </div>
              </div>

              {/* essential balances */}
              <div style={{ background: PANEL }}>
                <PanelHead index="02" title="Essential Balances" meta="4 ch" />
                <div className="flex flex-col gap-3 px-4 py-4">
                  {BALANCES.map((b) => (
                    <BarRow key={b.n} name={b.n} value={b.v} color={b.c} />
                  ))}
                </div>
              </div>

              {/* today's influences */}
              <div style={{ background: PANEL }}>
                <PanelHead index="03" title="Today’s Influences" meta="4 active" />
                <ul className="px-4 py-2">
                  {INFLUENCES.map((i) => (
                    <li key={i.n} className="flex items-start gap-2.5 border-b py-2.5 last:border-b-0"
                      style={{ borderColor: LINE }}>
                      <span className="mt-1.5 h-[5px] w-[5px] shrink-0 rounded-full"
                        style={{ background: i.c, boxShadow: `0 0 6px ${i.c}` }} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[11px]" style={{ color: INK }}>{i.n}</span>
                        <span className="block text-[9.5px]" style={{ color: DIM }}>{i.s}</span>
                      </span>
                      <span className="lax-mono shrink-0 text-[8px] uppercase tracking-widest" style={{ color: i.c }}>
                        {i.level}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ---- center: astral map ---- */}
            <div className="relative flex flex-col" style={{ background: BG }}>
              <PanelHead index="04" title="Astral Map" meta="Ten arcana · live" />
              <div className="lax-map-wrap relative flex-1 px-2 py-4">
                <AstralMap />
                <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2">
                  <span className="lax-btn-ghost pointer-events-auto inline-block">View full map</span>
                </div>
              </div>
            </div>

            {/* ---- right column ---- */}
            <div className="flex flex-col gap-px lg:col-span-2 xl:col-span-1" style={{ background: LINE }}>
              {/* cycle progress */}
              <div style={{ background: PANEL }}>
                <PanelHead index="05" title="Cycle Progress" meta="Day 198 / 365" />
                <div className="flex items-center gap-4 px-4 py-4">
                  <span className="lax-mono text-4xl leading-none" style={{ color: GOLD }}>7</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px]" style={{ color: INK }}>Personal Year 7 — The Seeker</p>
                    <span className="lax-bar-track mt-2">
                      <span className="lax-bar-fill" style={{ width: "54%", background: ORANGE }} />
                    </span>
                    <p className="lax-mono mt-1.5 text-right text-[9px]" style={{ color: DIM }}>54%</p>
                  </div>
                </div>
              </div>

              {/* elemental current */}
              <div style={{ background: PANEL }}>
                <PanelHead index="06" title="Elemental Current" meta="4 elem" />
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-4 py-4">
                  {ELEMENTS.map((e) => (
                    <div key={e.n}>
                      <div className="flex items-baseline justify-between">
                        <span className="lax-caps" style={{ color: DIM }}>{e.n}</span>
                        <span className="lax-mono text-[10px]" style={{ color: INK }}>{e.v}%</span>
                      </div>
                      <span className="lax-bar-track mt-1.5">
                        <span className="lax-bar-fill" style={{ width: `${e.v}%`, background: e.c }} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* cosmic weather */}
              <div style={{ background: PANEL }}>
                <PanelHead index="07" title="Cosmic Weather" meta="3 day outlook" />
                <div className="px-4 py-3">
                  <WeatherWave />
                </div>
              </div>

              {/* recent insights */}
              <div style={{ background: PANEL }}>
                <PanelHead index="08" title="Recent Insights" meta="View all →" />
                <ul className="px-4 py-2">
                  {INSIGHTS.map((i) => (
                    <li key={i.n} className="flex items-center gap-2.5 border-b py-2.5 last:border-b-0"
                      style={{ borderColor: LINE }}>
                      <span className="h-[18px] w-[14px] shrink-0 rounded-[2px] border"
                        style={{ borderColor: i.c, background: `${i.c}14` }} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[11px]" style={{ color: INK }}>{i.n}</span>
                        <span className="block truncate text-[9.5px]" style={{ color: DIM }}>{i.s}</span>
                      </span>
                      <span className="lax-mono shrink-0 text-[8px]" style={{ color: FAINT }}>{i.t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ============ journey + daily pull ============ */}
          <section className="grid grid-cols-1 gap-px border-b md:grid-cols-[1.4fr_1fr]"
            style={{ borderColor: LINE, background: LINE }}>
            <div style={{ background: PANEL }}>
              <PanelHead index="09" title="Your Journey" meta="View progress →" />
              <div className="flex flex-col gap-5 px-4 py-4 sm:flex-row sm:items-center">
                <JourneyRing />
                <div className="grid min-w-0 flex-1 grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                  {JOURNEY.map((j) => (
                    <div key={j.n}>
                      <div className="flex items-baseline justify-between">
                        <span className="lax-caps" style={{ color: DIM }}>{j.n}</span>
                        <span className="lax-mono text-[10px]" style={{ color: INK }}>{j.v}%</span>
                      </div>
                      <span className="lax-bar-track mt-1.5">
                        <span className="lax-bar-fill" style={{ width: `${j.v}%`, background: j.c }} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ background: PANEL }}>
              <PanelHead index="10" title="Daily Pull" meta="1 / 1" />
              <div className="flex items-center gap-4 px-4 py-4">
                <DailyCard />
                <div className="min-w-0">
                  <p className="text-[11px] leading-relaxed" style={{ color: DIM }}>
                    Draw insight for today&rsquo;s path. One card, one question, one answer.
                  </p>
                  <a href="#" className="lax-btn-ghost mt-3 inline-block">Draw card</a>
                </div>
              </div>
            </div>
          </section>

          {/* ============ modules: the six production sections ============ */}
          <section className="border-b" style={{ borderColor: LINE }}>
            <div className="flex items-baseline justify-between px-4 pb-2 pt-5 lg:px-8">
              <h2 className="lax-serif text-xl" style={{ color: INK }}>Modules</h2>
              <span className="lax-mono text-[9px] uppercase tracking-widest" style={{ color: FAINT }}>
                06 instruments · all free to start
              </span>
            </div>
            <div className="grid grid-cols-1 gap-px border-t sm:grid-cols-2 xl:grid-cols-3"
              style={{ borderColor: LINE, background: LINE }}>
              {MODULES.map((m, k) => (
                <a key={m.title} href="#" className="lax-module group" style={{ background: PANEL }}>
                  <div className="flex items-baseline justify-between">
                    <span className="lax-mono text-[9px]" style={{ color: FAINT }}>
                      {String(k + 1).padStart(2, "0")}
                    </span>
                    <span className="lax-caps text-[8px]" style={{ color: GOLD }}>{m.tag}</span>
                  </div>
                  <h3 className="lax-serif mt-3 text-lg" style={{ color: INK }}>{m.title}</h3>
                  <p className="mt-2 text-[11.5px] leading-relaxed" style={{ color: DIM }}>{m.copy}</p>
                  <span className="lax-mono mt-4 block text-[10px]" style={{ color: GOLD }}>
                    Explore <span className="lax-arrow">→</span>
                  </span>
                </a>
              ))}
            </div>
          </section>

          {/* ============ zodiac band ============ */}
          <section className="border-b" style={{ borderColor: LINE }}>
            <div className="flex items-baseline justify-between px-4 pb-2 pt-5 lg:px-8">
              <h2 className="lax-serif text-xl" style={{ color: INK }}>Twelve signs, one sky</h2>
              <span className="lax-mono text-[9px] uppercase tracking-widest" style={{ color: FAINT }}>
                Tropical zodiac · updated daily
              </span>
            </div>
            <div className="grid grid-cols-2 gap-px border-t sm:grid-cols-3 lg:grid-cols-6"
              style={{ borderColor: LINE, background: LINE }}>
              {SIGNS.map((s) => (
                <a key={s.n} href="#" className="lax-sign" style={{ background: PANEL }}>
                  <span className="text-xl leading-none" style={{ color: GOLD }}>{s.g}</span>
                  <span className="lax-caps mt-2 block" style={{ color: INK }}>{s.n}</span>
                  <span className="lax-mono mt-1 block text-[8.5px]" style={{ color: DIM }}>{s.d}</span>
                </a>
              ))}
            </div>
          </section>

          {/* ============ destiny matrix ============ */}
          <section className="grid grid-cols-1 gap-8 border-b px-4 py-10 md:grid-cols-[220px_1fr] lg:px-8"
            style={{ borderColor: LINE }}>
            <Octagram />
            <div className="self-center">
              <p className="lax-caps mb-3" style={{ color: GOLD }}>Optional instrument · 08</p>
              <h2 className="lax-serif max-w-[24ch] text-2xl leading-snug" style={{ color: INK }}>
                The Destiny Matrix
              </h2>
              <p className="mt-3 max-w-[56ch] text-sm leading-relaxed" style={{ color: DIM }}>
                An optional birth-date octagram tool. It maps purpose, love, money, and age
                themes from your birth date.
              </p>
              <a href="#" className="lax-btn-ghost mt-5 inline-block">Open Destiny Matrix →</a>
            </div>
          </section>

          {/* ============ faq ============ */}
          <section className="border-b px-4 py-10 lg:px-8" style={{ borderColor: LINE }}>
            <div className="flex items-baseline justify-between pb-5">
              <h2 className="lax-serif text-xl" style={{ color: INK }}>Questions from the deck</h2>
              <span className="lax-mono text-[9px] uppercase tracking-widest" style={{ color: FAINT }}>FAQ · 04</span>
            </div>
            <div className="grid grid-cols-1 gap-px border md:grid-cols-2"
              style={{ borderColor: LINE, background: LINE }}>
              {FAQ.map((f, k) => (
                <div key={f.q} className="px-4 py-4" style={{ background: PANEL }}>
                  <p className="flex items-baseline gap-3 text-[12.5px]" style={{ color: INK }}>
                    <span className="lax-mono text-[9px]" style={{ color: GOLD }}>
                      Q{String(k + 1).padStart(2, "0")}
                    </span>
                    {f.q}
                  </p>
                  <p className="mt-2 pl-9 text-[11.5px] leading-relaxed" style={{ color: DIM }}>{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ============ cta band ============ */}
          <section className="lax-cta relative overflow-hidden border-b px-4 py-14 text-center lg:px-8"
            style={{ borderColor: LINE }}>
            <div className="lax-cta-ring" aria-hidden="true" />
            <p className="lax-caps mb-4" style={{ color: GOLD }}>Begin calibration</p>
            <h2 className="lax-serif mx-auto max-w-[22ch] text-3xl leading-tight lg:text-4xl" style={{ color: INK }}>
              Your chart is written in the stars. Come read it.
            </h2>
            <a href="#" className="lax-btn-primary mt-7 inline-block">Get started — it&rsquo;s free</a>
          </section>

          {/* ============ footer ============ */}
          <footer className="flex flex-col gap-3 px-4 py-5 md:flex-row md:items-center md:justify-between lg:px-8">
            <div className="flex items-center gap-2">
              <WordmarkSigil size={16} />
              <span className="lax-caps text-[8px]" style={{ color: DIM }}>
                Astro Scope — instruments for reading the sky
              </span>
            </div>
            <nav className="flex flex-wrap gap-x-5 gap-y-1">
              {["Horoscopes", "Tarot", "Compatibility", "Birth Chart", "Sign In"].map((t) => (
                <a key={t} href="#" className="lax-mono text-[9px] uppercase tracking-widest transition-colors"
                  style={{ color: FAINT }}>
                  {t}
                </a>
              ))}
            </nav>
            <span className="lax-mono text-[9px]" style={{ color: FAINT }}>© 2026 · v02.4</span>
          </footer>
        </main>
      </div>

      <style>{`
        .lax-root {
          background: ${BG};
          color: ${INK};
          font-family: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
          background-image:
            radial-gradient(1200px 500px at 70% -10%, rgba(62,200,184,0.05), transparent 60%),
            radial-gradient(900px 500px at 10% 110%, rgba(232,179,75,0.05), transparent 60%);
        }
        .lax-root ::selection { background: rgba(232,179,75,.25); color: #ffe9b0; }
        .lax-serif { font-family: Georgia, 'Times New Roman', serif; }
        .lax-mono { font-family: var(--font-geist-mono), ui-monospace, 'SF Mono', Menlo, monospace; }
        .lax-caps {
          font-family: var(--font-geist-mono), ui-monospace, Menlo, monospace;
          font-size: 9px; letter-spacing: .22em; text-transform: uppercase;
        }
        .lax-caps-svg { letter-spacing: .18em; text-transform: uppercase;
          font-family: var(--font-geist-mono), ui-monospace, Menlo, monospace; }
        .lax-wordmark {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 15px; letter-spacing: .28em; text-transform: uppercase; color: ${INK};
        }

        /* controls */
        .lax-btn-primary {
          display: inline-block; padding: 10px 20px;
          font-family: var(--font-geist-mono), ui-monospace, Menlo, monospace;
          font-size: 10px; letter-spacing: .22em; text-transform: uppercase;
          color: #140e02; background: linear-gradient(180deg, #f2c662, ${GOLD});
          border: 1px solid #f2c662; border-radius: 2px;
          box-shadow: 0 0 18px rgba(232,179,75,.25);
          transition: box-shadow .3s, transform .3s;
        }
        .lax-btn-primary:hover { box-shadow: 0 0 28px rgba(232,179,75,.45); transform: translateY(-1px); }
        .lax-btn-ghost {
          display: inline-block; padding: 9px 16px;
          font-family: var(--font-geist-mono), ui-monospace, Menlo, monospace;
          font-size: 10px; letter-spacing: .22em; text-transform: uppercase;
          color: ${GOLD}; border: 1px solid rgba(232,179,75,.35); border-radius: 2px;
          transition: border-color .3s, background .3s;
        }
        .lax-btn-ghost:hover { border-color: rgba(232,179,75,.8); background: rgba(232,179,75,.06); }
        .lax-tab {
          padding: 7px 14px;
          font-family: var(--font-geist-mono), ui-monospace, Menlo, monospace;
          font-size: 9.5px; letter-spacing: .22em; text-transform: uppercase;
          color: ${DIM}; border: 1px solid transparent; border-radius: 2px;
          transition: color .3s, border-color .3s;
        }
        .lax-tab:hover { color: ${GOLD}; border-color: ${LINE}; }

        /* rail */
        .lax-rail-item {
          display: flex; flex-direction: column; align-items: center; gap: 5px;
          width: 52px; padding: 9px 0; border: 1px solid transparent; border-radius: 3px;
          color: ${FAINT}; transition: border-color .3s, background .3s;
        }
        .lax-rail-item:hover { border-color: ${LINE}; background: rgba(28,39,64,.25); }
        .lax-rail-active { border-color: rgba(232,179,75,.4); background: rgba(232,179,75,.06); color: ${GOLD}; }

        /* bars */
        .lax-bar-track {
          display: block; height: 3px; flex: 1; min-width: 0;
          background: #131c30; border-radius: 1px; overflow: hidden;
        }
        .lax-bar-fill {
          display: block; height: 100%; border-radius: 1px;
          box-shadow: 0 0 8px currentColor;
          animation: lax-bar-in 1.6s cubic-bezier(.2,.7,.2,1) both;
        }
        @keyframes lax-bar-in { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .lax-bar-fill { transform-origin: left center; }

        /* astral map */
        .lax-map { display: block; width: 100%; height: auto; max-height: 78vh; margin: 0 auto; }
        .lax-map-wrap { min-height: 420px; }
        .lax-spin-a { transform-origin: 380px 380px; animation: lax-rot 160s linear infinite; }
        .lax-spin-b { transform-origin: 380px 380px; animation: lax-rot-rev 220s linear infinite; }
        .lax-spin-c { transform-origin: 380px 380px; animation: lax-rot 300s linear infinite; }
        @keyframes lax-rot { to { transform: rotate(360deg); } }
        @keyframes lax-rot-rev { to { transform: rotate(-360deg); } }
        .lax-pulse { animation: lax-pulse 9s ease-in-out infinite alternate; }
        @keyframes lax-pulse { from { opacity: .10; } to { opacity: .30; } }
        .lax-breathe { animation: lax-breathe 14s ease-in-out infinite alternate; }
        @keyframes lax-breathe { from { opacity: .75; } to { opacity: 1; } }
        .lax-wave { stroke-dasharray: 4 3; animation: lax-wave-drift 40s linear infinite; }
        @keyframes lax-wave-drift { to { stroke-dashoffset: -140; } }

        /* modules + signs */
        .lax-module {
          display: block; padding: 18px; border-top: 1px solid transparent;
          transition: background .3s;
        }
        .lax-module:hover { background: #0b1220; }
        .lax-module .lax-arrow { display: inline-block; transition: transform .3s; }
        .lax-module:hover .lax-arrow { transform: translateX(4px); }
        .lax-sign { display: block; padding: 14px; text-align: left; transition: background .3s; }
        .lax-sign:hover { background: #0b1220; }

        /* cta band ornament */
        .lax-cta { background: radial-gradient(700px 260px at 50% 120%, rgba(232,179,75,.10), transparent 70%); }
        .lax-cta-ring {
          position: absolute; left: 50%; top: 130%; width: 560px; height: 560px;
          transform: translate(-50%, -50%);
          border: 1px dashed rgba(232,179,75,.25); border-radius: 50%;
          animation: lax-rot 180s linear infinite; pointer-events: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .lax-root *, .lax-root *::before, .lax-root *::after {
            animation: none !important; transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
