// LAB / SELENE — a design exploration of the production landing in a
// silver-blue lunar language: a hero-first LANDING (headline, CTAs, sections
// flowing top to bottom) that keeps the dense mystical-apparatus aesthetic —
// engraved headers, tick scales, micro-readouts, hairline rules, a huge
// detailed moon rising behind the headline and a thin tidal chart on the
// hero's lower edge. Fully self-contained: inline SVG, Tailwind for layout,
// one scoped <style> block (lse- prefixed) for the rest. Server-component
// safe: no hooks, CSS animations only (slow 15–180s cycles, reduced-motion
// guarded), statically prerendered.

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Astro Scope — Selene",
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

// hand-sampled sine path for tidal charts
function sinePath(x0: number, x1: number, yMid: number, amp: number, cycles: number, phase = 0) {
  const steps = 96;
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

// moon phase shown on each sign plate, k in [-1, 1]
const SIGN_PHASE = [-0.92, -0.68, -0.4, -0.14, 0.12, 0.38, 0.62, 0.86, 1, 0.7, 0.3, -0.2];

const PLATES = [
  {
    n: "PL·01",
    tag: "FREE",
    name: "Birth Chart",
    copy: "Map your Sun, Moon, and Rising — the foundation of every reading.",
    href: "/birth-chart",
    fig: "FIG. 01 — NATAL WHEEL",
    dia: "wheel" as const,
  },
  {
    n: "PL·02",
    tag: "DAILY",
    name: "Daily Horoscope",
    copy: "Twelve signs, one sky. Clear forecasts without the fluff.",
    href: "/horoscope",
    fig: "FIG. 02 — SKY DIAL",
    dia: "dial" as const,
  },
  {
    n: "PL·03",
    tag: "SYNASTRY",
    name: "Compatibility",
    copy: "Zodiac match, Chinese pairs, and deep synastry for two charts.",
    href: "/compatibility",
    fig: "FIG. 03 — TWO MOONS",
    dia: "moons" as const,
  },
  {
    n: "PL·04",
    tag: "SPREADS",
    name: "Tarot",
    copy: "Daily card to Celtic Cross — pull, reflect, get a full reading.",
    href: "/tarot",
    fig: "FIG. 04 — THE CARD",
    dia: "card" as const,
  },
  {
    n: "PL·05",
    tag: "TESTS",
    name: "Psychology",
    copy: "MBTI, Big Five, empathy and more — meet yourself beyond the signs.",
    href: "/psychology",
    fig: "FIG. 05 — PRISM",
    dia: "prism" as const,
  },
  {
    n: "PL·06",
    tag: "YOU",
    name: "Cosmic Passport",
    copy: "Your Cosmic ID, people, journal, and Premium deep dives — one hub.",
    href: "/passport",
    fig: "FIG. 06 — SEAL",
    dia: "seal" as const,
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

/* ============================ SMALL PIECES ================================ */

// engraved panel header: diamond + tracked title + hairline + right readout
function PHead({ title, right }: { title: string; right?: string }) {
  return (
    <div className="flex items-center gap-2 px-3 pt-2.5 pb-2">
      <span className="text-[7px] lse-dim">◆</span>
      <span className="lse-caps text-[8.5px] lse-hi whitespace-nowrap">{title}</span>
      <span className="lse-hair flex-1" />
      {right ? <span className="lse-mono text-[7.5px] lse-dim whitespace-nowrap">{right}</span> : null}
      <span className="text-[7px] lse-dim">◆</span>
    </div>
  );
}

// small moon disc with a terminator; k in [-1,1]
function PhaseDisc({ k, r, active }: { k: number; r: number; active?: boolean }) {
  const s = r * 2 + 6;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-hidden="true">
      <circle cx={s / 2} cy={s / 2} r={r} fill="#aebfd9" />
      <ellipse cx={s / 2 + k * r} cy={s / 2} rx={r} ry={r * 1.02} fill={INK} opacity={0.92} />
      <circle cx={s / 2} cy={s / 2} r={r} fill="none" stroke={STEEL} strokeWidth={0.6} opacity={0.8} />
      {active ? (
        <circle
          cx={s / 2}
          cy={s / 2}
          r={r + 2.4}
          fill="none"
          stroke={SILVER}
          strokeWidth={0.7}
          strokeDasharray="2 2"
          className="lse-rot-c"
        />
      ) : null}
    </svg>
  );
}

// moonlit diagram for an observation plate, 120×120
function PlateDiagram({ kind }: { kind: (typeof PLATES)[number]["dia"] }) {
  const c = 60;
  if (kind === "wheel") {
    return (
      <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx={c} cy={c} r="52" fill="none" stroke={STEEL} strokeWidth="0.6" opacity="0.8" />
        <circle cx={c} cy={c} r="40" fill="none" stroke={STEEL} strokeWidth="0.4" opacity="0.6" />
        <circle cx={c} cy={c} r="14" fill="none" stroke={SILVER} strokeWidth="0.6" opacity="0.9" />
        {ringTicks(c, c, 46, 52, 36, 3).map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.major ? SILVER : STEEL} strokeWidth={t.major ? 0.7 : 0.4} opacity={t.major ? 0.9 : 0.55} />
        ))}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((d) => {
          const p = onCircle(c, c, 40, d);
          return <line key={d} x1={c} y1={c} x2={p.x} y2={p.y} stroke={STEEL} strokeWidth="0.3" opacity="0.5" />;
        })}
        <line x1={c} y1={c} x2={onCircle(c, c, 52, 218).x} y2={onCircle(c, c, 52, 218).y} stroke={SILVER} strokeWidth="0.8" />
        <circle cx={onCircle(c, c, 52, 218).x} cy={onCircle(c, c, 52, 218).y} r="1.6" fill={SILVER} />
        <circle cx={onCircle(c, c, 46, 88).x} cy={onCircle(c, c, 46, 88).y} r="1.3" fill={SILVER} opacity="0.8" />
        <circle cx={onCircle(c, c, 46, 312).x} cy={onCircle(c, c, 46, 312).y} r="1.3" fill={SILVER} opacity="0.8" />
        <circle cx={c} cy={c} r="1.6" fill={SILVER} />
        <text x={c} y={c - 20} textAnchor="middle" fontSize="7" fill={SILVER}>☉︎</text>
        <text x={c} y={c + 26} textAnchor="middle" fontSize="7" fill={SILVER}>☽︎</text>
      </svg>
    );
  }
  if (kind === "dial") {
    return (
      <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx={c} cy={c} r="52" fill="none" stroke={STEEL} strokeWidth="0.6" opacity="0.8" />
        <circle cx={c} cy={c} r="34" fill="none" stroke={STEEL} strokeWidth="0.4" strokeDasharray="2 3" opacity="0.7" className="lse-rot-b" />
        {ringTicks(c, c, 47, 52, 24, 6).map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.major ? SILVER : STEEL} strokeWidth={t.major ? 0.7 : 0.4} opacity={t.major ? 0.9 : 0.5} />
        ))}
        {/* needle */}
        <g className="lse-rot-a">
          <line x1={c} y1={c} x2={c} y2={c - 44} stroke={SILVER} strokeWidth="0.9" />
          <polygon points={`${c},${c - 50} ${c - 2.6},${c - 42} ${c + 2.6},${c - 42}`} fill={SILVER} />
        </g>
        <circle cx={c} cy={c} r="10" fill="none" stroke={SILVER} strokeWidth="0.6" />
        <path d={`M${c + 3.4} ${c - 6} a7 7 0 1 0 0 12 a5.4 5.4 0 1 1 0 -12 Z`} fill={SILVER} opacity="0.9" />
        {[0, 90, 180, 270].map((d) => {
          const p = onCircle(c, c, 56.5, d);
          return (
            <text key={d} x={p.x} y={p.y + 2} textAnchor="middle" fontSize="5.5" fill={DIM}>
              {["N", "E", "S", "W"][d / 90]}
            </text>
          );
        })}
      </svg>
    );
  }
  if (kind === "moons") {
    return (
      <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="44" cy="60" r="30" fill="none" stroke={STEEL} strokeWidth="0.5" opacity="0.7" />
        <circle cx="76" cy="60" r="30" fill="none" stroke={STEEL} strokeWidth="0.5" opacity="0.7" />
        <circle cx="44" cy="60" r="21" fill="url(#lse-moon)" opacity="0.95" />
        <ellipse cx="57" cy="60" rx="21" ry="21.4" fill={INK} opacity="0.55" />
        <circle cx="76" cy="60" r="21" fill="url(#lse-moon)" opacity="0.95" />
        <ellipse cx="63" cy="60" rx="21" ry="21.4" fill={INK} opacity="0.55" />
        <circle cx="44" cy="60" r="21" fill="none" stroke={STEEL} strokeWidth="0.6" />
        <circle cx="76" cy="60" r="21" fill="none" stroke={STEEL} strokeWidth="0.6" />
        {/* vesica aspect lines */}
        <line x1="60" y1="32" x2="60" y2="88" stroke={SILVER} strokeWidth="0.4" strokeDasharray="2 2" opacity="0.8" />
        <circle cx="60" cy="60" r="2" fill={SILVER} className="lse-pulse" />
        {ringTicks(60, 60, 52, 56, 24, 6).map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={STEEL} strokeWidth="0.4" opacity="0.5" />
        ))}
        <text x="44" y="102" textAnchor="middle" fontSize="5.5" fill={DIM}>A</text>
        <text x="76" y="102" textAnchor="middle" fontSize="5.5" fill={DIM}>B</text>
        <text x="60" y="26" textAnchor="middle" fontSize="6" fill={SILVER}>Δ 0°</text>
      </svg>
    );
  }
  if (kind === "card") {
    return (
      <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
        <rect x="38" y="18" width="44" height="76" fill="rgba(10,16,28,.6)" stroke={SILVER} strokeWidth="0.8" />
        <rect x="42" y="22" width="36" height="68" fill="none" stroke={STEEL} strokeWidth="0.4" />
        <circle cx="60" cy="48" r="13" fill="url(#lse-moon)" />
        <ellipse cx="68" cy="48" rx="13" ry="13.3" fill={INK} opacity="0.72" />
        <circle cx="60" cy="48" r="13" fill="none" stroke={STEEL} strokeWidth="0.5" />
        {ringTicks(60, 48, 16, 19, 16, 4).map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={STEEL} strokeWidth="0.4" opacity="0.8" />
        ))}
        <line x1="46" y1="72" x2="74" y2="72" stroke={STEEL} strokeWidth="0.4" />
        <text x="60" y="81" textAnchor="middle" fontSize="5.5" fill={SILVER} letterSpacing="1.5">XVIII</text>
        <text x="60" y="88" textAnchor="middle" fontSize="4.5" fill={DIM} letterSpacing="1">THE MOON</text>
        {/* fanned backs */}
        <rect x="30" y="24" width="40" height="66" fill="none" stroke={STEEL} strokeWidth="0.4" opacity="0.5" transform="rotate(-7 50 57)" />
        <rect x="50" y="24" width="40" height="66" fill="none" stroke={STEEL} strokeWidth="0.4" opacity="0.5" transform="rotate(7 70 57)" />
      </svg>
    );
  }
  if (kind === "prism") {
    return (
      <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
        <polygon points="60,26 94,86 26,86" fill="rgba(200,214,236,0.05)" stroke={SILVER} strokeWidth="0.8" />
        <polygon points="60,40 82,80 38,80" fill="none" stroke={STEEL} strokeWidth="0.4" opacity="0.7" />
        {/* incoming beam */}
        <line x1="8" y1="58" x2="44" y2="62" stroke={SILVER} strokeWidth="0.9" />
        <line x1="8" y1="54" x2="44" y2="60" stroke={STEEL} strokeWidth="0.4" opacity="0.7" />
        {/* split beams */}
        <line x1="76" y1="60" x2="112" y2="44" stroke={SILVER} strokeWidth="0.6" opacity="0.9" />
        <line x1="76" y1="62" x2="112" y2="58" stroke={SILVER} strokeWidth="0.5" opacity="0.7" />
        <line x1="76" y1="64" x2="112" y2="72" stroke={STEEL} strokeWidth="0.5" opacity="0.8" />
        <line x1="76" y1="66" x2="112" y2="86" stroke={STEEL} strokeWidth="0.4" opacity="0.6" />
        <circle cx="60" cy="68" r="1.6" fill={SILVER} className="lse-pulse" />
        {["I", "II", "III", "IV"].map((t, i) => (
          <text key={t} x="114" y={46 + i * 14} fontSize="4.5" fill={DIM} textAnchor="start">{t}</text>
        ))}
        <text x="60" y="100" textAnchor="middle" fontSize="5" fill={DIM} letterSpacing="1">SELF · REFRACTED</text>
      </svg>
    );
  }
  // seal
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
      <circle cx={c} cy={c} r="52" fill="none" stroke={STEEL} strokeWidth="0.6" opacity="0.8" />
      <circle cx={c} cy={c} r="44" fill="none" stroke={STEEL} strokeWidth="0.4" strokeDasharray="2 3" opacity="0.7" className="lse-rot-b" />
      {ringTicks(c, c, 48, 52, 36, 6).map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.major ? SILVER : STEEL} strokeWidth={t.major ? 0.6 : 0.35} opacity={t.major ? 0.9 : 0.5} />
      ))}
      {/* eight-point star seal */}
      <polygon points="60,26 68,52 94,60 68,68 60,94 52,68 26,60 52,52" fill="rgba(200,214,236,0.08)" stroke={SILVER} strokeWidth="0.7" />
      <polygon points="60,36 65.6,54.4 84,60 65.6,65.6 60,84 54.4,65.6 36,60 54.4,54.4" fill="none" stroke={STEEL} strokeWidth="0.4" transform="rotate(22.5 60 60)" />
      <circle cx={c} cy={c} r="8" fill="none" stroke={SILVER} strokeWidth="0.6" />
      <circle cx={c} cy={c} r="2" fill={SILVER} className="lse-pulse" />
      <text x={c} y="16" textAnchor="middle" fontSize="5" fill={DIM} letterSpacing="1">COSMIC ID</text>
    </svg>
  );
}

/* ================================ PAGE ==================================== */

export default function SelenePage() {
  const heroTicks = ringTicks(600, 470, 268, 276, 72, 6);
  const tide = sinePath(0, 1200, 30, 18, 2.25, 0.4);
  const tideSoft = sinePath(0, 1200, 30, 14, 2.25, 1.3);
  const tideFaint = sinePath(0, 1200, 30, 22, 2.25, 2.4);

  return (
    <main className="lse-root lse-mono min-h-screen">
      <style>{LSE_CSS}</style>

      {/* shared gradients */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <radialGradient id="lse-moon" cx="38%" cy="34%" r="80%">
            <stop offset="0%" stopColor="#dfe9f8" />
            <stop offset="55%" stopColor="#9db2d0" />
            <stop offset="100%" stopColor="#54678a" />
          </radialGradient>
          <radialGradient id="lse-moon-big" cx="42%" cy="38%" r="80%">
            <stop offset="0%" stopColor="#dde8f9" />
            <stop offset="48%" stopColor="#9db2d1" />
            <stop offset="86%" stopColor="#576b8e" />
            <stop offset="100%" stopColor="#3b4c6b" />
          </radialGradient>
          <radialGradient id="lse-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(150,175,215,0.22)" />
            <stop offset="70%" stopColor="rgba(150,175,215,0.05)" />
            <stop offset="100%" stopColor="rgba(150,175,215,0)" />
          </radialGradient>
        </defs>
      </svg>

      {/* ============================== TOP BAR ============================== */}
      <header className="lse-panel relative z-20 mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-5 gap-y-1 border-x border-b px-4 py-2">
        <Link href="/" className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" className="lse-rot-a">
            <circle cx="11" cy="11" r="9.5" fill="none" stroke={STEEL} strokeWidth="0.6" opacity="0.8" />
            <path d="M14 4.5 a7.5 7.5 0 1 0 0 13 a5.8 5.8 0 1 1 0 -13 Z" fill={SILVER} opacity="0.9" />
          </svg>
          <span className="lse-caps lse-serif text-[11px] lse-hi tracking-[0.3em]">Astro Scope</span>
        </Link>
        <span className="lse-mono text-[6.5px] lse-dim hidden md:inline">LUNAR OBSERVATORY · EST. MMXXVI</span>
        <span className="flex-1" />
        <nav className="flex items-center gap-4 text-[8.5px] lse-caps lse-mid">
          <a href="/horoscope" className="lse-link">Horoscopes</a>
          <a href="/tarot" className="lse-link">Tarot</a>
          <a href="/compatibility" className="lse-link">Compatibility</a>
        </nav>
        <span className="lse-vhair hidden sm:block" />
        <a href="/sign-in" className="lse-caps text-[8.5px] lse-mid lse-link">Sign In</a>
      </header>

      {/* ================================ HERO =============================== */}
      <section className="lse-panel relative z-10 mx-auto max-w-[1240px] overflow-hidden border-x border-b">
        {/* the rising moon */}
        <svg
          viewBox="0 0 1200 640"
          preserveAspectRatio="xMidYMax slice"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {/* moon assembly — shifted bottom-right so the disc rises clear of
              the headline column and only kisses its right edge */}
          <g transform="translate(260 100)">
          {/* halo */}
          <circle cx="600" cy="470" r="360" fill="url(#lse-halo)" className="lse-pulse" />
          {/* orbit rings */}
          <circle cx="600" cy="470" r="268" fill="none" stroke={STEEL} strokeWidth="0.5" opacity="0.45" />
          <circle cx="600" cy="470" r="288" fill="none" stroke={STEEL} strokeWidth="0.4" strokeDasharray="1 5" opacity="0.4" className="lse-rot-b" />
          {heroTicks.map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.major ? SILVER : STEEL} strokeWidth={t.major ? 0.7 : 0.4} opacity={t.major ? 0.6 : 0.35} />
          ))}
          {[0, 30, 60, 90, 120, 150].map((d) => {
            const p = onCircle(600, 470, 296, d - 90);
            return (
              <text key={d} x={p.x} y={p.y + 2} textAnchor="middle" fontSize="6.5" fill={DIM}>
                {String(d).padStart(3, "0")}°
              </text>
            );
          })}
          {/* moon body */}
          <circle cx="600" cy="470" r="240" fill="url(#lse-moon-big)" />
          {/* maria */}
          <g fill="#415270" opacity="0.5">
            <ellipse cx="530" cy="380" rx="62" ry="44" transform="rotate(-16 530 380)" />
            <ellipse cx="640" cy="440" rx="40" ry="62" transform="rotate(10 640 440)" />
            <ellipse cx="512" cy="500" rx="36" ry="26" />
            <ellipse cx="618" cy="330" rx="30" ry="22" />
            <ellipse cx="700" cy="520" rx="34" ry="24" transform="rotate(-24 700 520)" />
            <ellipse cx="560" cy="560" rx="26" ry="18" transform="rotate(14 560 560)" />
          </g>
          {/* craters */}
          <g fill="none" stroke="#4a5c78" strokeWidth="0.7" opacity="0.55">
            <circle cx="560" cy="430" r="13" />
            <circle cx="560" cy="430" r="7" />
            <circle cx="668" cy="386" r="9" />
            <circle cx="500" cy="466" r="10" />
            <circle cx="636" cy="508" r="12" />
            <circle cx="588" cy="352" r="6" />
            <circle cx="706" cy="452" r="7" />
          </g>
          <g stroke={STEEL} strokeWidth="0.5" opacity="0.5">
            <line x1="560" y1="417" x2="560" y2="405" />
            <line x1="547" y1="430" x2="535" y2="430" />
            <line x1="636" y1="496" x2="636" y2="484" />
            <line x1="648" y1="508" x2="660" y2="508" />
          </g>
          {/* upper terminator shading: waxing light from lower-left */}
          <ellipse cx="760" cy="340" rx="240" ry="244" fill={INK} opacity="0.18" />
          {/* dim the moon's left limb so it never fights the headline */}
          <ellipse cx="470" cy="470" rx="200" ry="235" fill={INK} opacity="0.3" />
          <circle cx="600" cy="470" r="240" fill="none" stroke={SILVER} strokeWidth="0.8" opacity="0.5" />
          </g>
          {/* horizon baseline where the moon rises from */}
          <line x1="0" y1="640" x2="1200" y2="640" stroke={STEEL} strokeWidth="0.5" opacity="0.6" />
        </svg>

        {/* contrast scrim behind the text column */}
        <div className="lse-hero-scrim pointer-events-none absolute inset-0" aria-hidden="true" />

        {/* hero copy */}
        <div className="relative grid grid-cols-1 gap-6 px-5 pb-24 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-12">
          {/* left micro-column */}
          <div className="hidden flex-col gap-2 self-start border-l border-[rgba(125,148,184,0.25)] pl-3 lg:col-span-2 lg:flex">
            <span className="lse-caps text-[7px] lse-dim">Observation Log</span>
            <span className="lse-mono text-[8px] lse-mid">MAY 18, 2025</span>
            <span className="lse-mono text-[7px] lse-dim">23:47:12 UTC</span>
            <span className="lse-hair my-1 w-14" />
            <span className="lse-mono text-[6.5px] lse-dim leading-[1.7]">
              LAT 40.7128° N<br />LON 74.0060° W<br />ELEV +10 M<br />BARO 1013.2 hPa
            </span>
            <span className="lse-hair my-1 w-14" />
            <span className="lse-mono text-[6.5px] lse-dim leading-[1.7]">
              SEL·LON 6.2° W<br />COLONG 41.8<br />LIB +4.7°
            </span>
          </div>

          {/* headline block — deliberately off-center */}
          <div className="lg:col-span-7 lg:col-start-3">
            <div className="lse-caps text-[8px] lse-mid">◆ Lunar Observatory — Nightly Reading ◆</div>
            <h1 className="lse-serif lse-glow mt-4 max-w-[640px] text-[34px] leading-[1.12] lse-hi sm:text-[46px] lg:text-[54px]">
              The moon pulls.<br />
              The veil thins.<br />
              <span className="italic">Read what moves you.</span>
            </h1>
            <p className="mt-5 max-w-[460px] text-[11px] leading-[1.75] lse-mid">
              Free birth charts, daily horoscopes, synastry and tarot — computed
              against tonight&apos;s sky and set in silver. No accounts, no
              noise: only the instruments and what they say about you.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a href="/birth-chart" className="lse-btn lse-caps px-6 py-2.5 text-[9.5px]">
                Cast your free birth chart
              </a>
              <a href="/horoscope" className="lse-caps lse-link text-[9px] lse-hi">
                {"Read today's horoscope →"}
              </a>
            </div>
            <div className="lse-mono mt-4 text-[6.5px] lse-dim">
              NO CARD REQUIRED · CHART IN &lt; 60 SECONDS · 12 SIGNS CALIBRATED NIGHTLY
            </div>
          </div>

          {/* right readout column */}
          <div className="hidden flex-col items-end gap-2 self-start text-right lg:col-span-3 lg:flex">
            <span className="lse-caps text-[7px] lse-dim">Fig. 00 — Luna, Waxing</span>
            <div className="lse-mono text-[7px] lse-dim leading-[1.8]">
              APPARENT Ø 31′06″<br />
              DIST 384,402 KM<br />
              MAG −12.4<br />
              Δλ 0.042 / H
            </div>
            <span className="lse-hair my-1 w-16" />
            <div className="lse-mono text-[7px] lse-mid leading-[1.8]">
              ☽︎ +87 · ♆︎ +55<br />♇︎ +64 · ♄︎ −12
            </div>
          </div>
        </div>

        {/* tidal wave chart along the hero's bottom edge */}
        <div className="absolute inset-x-0 bottom-0">
          <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="block h-[60px] w-full" aria-hidden="true">
            <path d={tideFaint} fill="none" stroke={DIM} strokeWidth="0.5" opacity="0.6" />
            <path d={tideSoft} fill="none" stroke={STEEL} strokeWidth="0.6" opacity="0.7" />
            <path d={tide} fill="none" stroke={SILVER} strokeWidth="0.8" opacity="0.9" />
            <line x1="0" y1="30" x2="1200" y2="30" stroke={STEEL} strokeWidth="0.3" strokeDasharray="1 6" opacity="0.5" />
            {Array.from({ length: 25 }, (_, i) => (
              <line key={i} x1={i * 50} y1="54" x2={i * 50} y2={i % 6 === 0 ? "46" : "50"} stroke={STEEL} strokeWidth="0.5" opacity="0.6" />
            ))}
          </svg>
          <div className="lse-mono flex justify-between px-4 pb-1 text-[6px] lse-dim">
            <span>TIDE GAUGE · HARMONIC M2</span>
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>24:00 UTC</span>
          </div>
        </div>
      </section>

      {/* ========================== LUNAR STATUS STRIP ========================== */}
      <section className="lse-panel relative z-10 mx-auto grid max-w-[1240px] grid-cols-2 border-x border-b sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Illumination", value: "68.2", unit: "%", foot: "−1.2% / DAY" },
          { label: "Moon Age", value: "20.6", unit: "d", foot: "SYNODIC 29.53 D" },
          { label: "Moon Sign", value: "♏︎", unit: " Scorpio", foot: "8TH HOUSE · WATER", serif: true },
          { label: "Next Full Moon", value: "JUN 02", unit: "", foot: "04:41 UTC · T−14.8 D", small: true },
          { label: "Tide Quality", value: "A", unit: "", foot: "COEFF 0.91 · SPRING" },
          { label: "Distance", value: "384,402", unit: " km", foot: "APOGEE −21,148 KM", small: true },
        ].map((cell) => (
          <div key={cell.label} className="border-r border-[rgba(125,148,184,0.14)] px-3 py-2.5 last:border-r-0">
            <div className="lse-caps text-[6.5px] lse-dim">{cell.label}</div>
            <div className={`mt-1 leading-none lse-hi ${cell.serif ? "lse-serif text-[17px]" : cell.small ? "lse-mono text-[13px]" : "lse-serif text-[19px]"}`}>
              {cell.value}
              {cell.unit ? <span className="text-[9px] lse-mid">{cell.unit}</span> : null}
            </div>
            <div className="lse-mono mt-1.5 text-[5.5px] lse-dim">{cell.foot}</div>
          </div>
        ))}
      </section>

      {/* ============================ SIGN BAND ============================ */}
      <section className="lse-panel relative z-10 mx-auto max-w-[1240px] border-x border-b">
        <PHead title="Twelve Houses of the Night" right="ECLIPTIC 360° · PLATES 12" />
        <div className="grid grid-cols-3 gap-px bg-[rgba(125,148,184,0.14)] px-0 pb-0 sm:grid-cols-4 lg:grid-cols-6">
          {SIGNS.map(([glyph, name, dates], i) => (
            <a
              key={name}
              href={`/horoscope/${name.toLowerCase()}`}
              className="lse-plate flex flex-col items-center gap-1 bg-[#080d18] px-1 py-3"
            >
              <PhaseDisc k={SIGN_PHASE[i]} r={11} active={name === "Scorpio"} />
              <span className={`lse-serif mt-1 text-[15px] leading-none ${name === "Scorpio" ? "lse-hi lse-glow" : "lse-mid"}`}>
                {glyph}
              </span>
              <span className="lse-caps text-[7px] lse-hi">{name}</span>
              <span className="lse-mono text-[5.5px] lse-dim">{dates}</span>
              <span className="lse-mono text-[5.5px] lse-dim">
                {String(i * 30).padStart(3, "0")}°–{String(i * 30 + 30).padStart(3, "0")}°
              </span>
            </a>
          ))}
        </div>
        <div className="flex justify-between border-t border-[rgba(125,148,184,0.18)] px-3 py-1 lse-mono text-[6.5px] lse-dim">
          <span>MOON CURRENTLY IN ♏︎ SCORPIO — 8TH HOUSE</span>
          <span className="hidden sm:inline">INGRESS ♐︎ SAGITTARIUS MAY 20 · 03:17 UTC</span>
        </div>
      </section>

      {/* ========================= OBSERVATION PLATES ========================= */}
      <section className="lse-panel relative z-10 mx-auto max-w-[1240px] border-x border-b">
        <PHead title="Observation Plates — Six Instruments" right="SECTION 02 · ALL CHANNELS OPEN" />
        <div className="grid grid-cols-1 gap-px bg-[rgba(125,148,184,0.14)] md:grid-cols-2">
          {PLATES.map((p) => (
            <article key={p.n} className="lse-plate relative bg-[#080d18] p-4">
              <div className="flex items-center gap-2">
                <span className="lse-mono text-[7px] lse-dim">{p.n}</span>
                <span className="lse-hair w-8" />
                <span className="lse-caps border border-[rgba(125,148,184,0.3)] px-1.5 py-px text-[6px] lse-mid">{p.tag}</span>
                <span className="flex-1" />
                <span className="lse-mono text-[6px] lse-dim">{p.fig}</span>
              </div>
              <div className="mt-3 grid grid-cols-[120px_1fr] items-center gap-4">
                <div className="border border-[rgba(125,148,184,0.18)] bg-[rgba(10,16,28,.4)] p-1">
                  <PlateDiagram kind={p.dia} />
                </div>
                <div>
                  <h3 className="lse-caps lse-serif text-[14px] lse-hi tracking-[0.22em]">{p.name}</h3>
                  <span className="lse-hair mt-2 block w-16" />
                  <p className="mt-2 text-[9.5px] leading-[1.65] lse-mid">{p.copy}</p>
                  <a href={p.href} className="lse-caps lse-link mt-3 inline-block text-[8px] lse-hi">
                    Explore →
                  </a>
                </div>
              </div>
              <div className="lse-mono mt-3 flex justify-between border-t border-[rgba(125,148,184,0.14)] pt-1.5 text-[5.5px] lse-dim">
                <span>CHANNEL OPEN · 24/7</span>
                <span>ACC ±0.003 · REV K</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ========================== DESTINY MATRIX BAND ========================== */}
      <section className="lse-panel relative z-10 mx-auto max-w-[1240px] border-x border-b">
        <PHead title="Destiny Matrix — Optional Instrument" right="BIRTH-DATE OCTAGRAM" />
        <div className="grid grid-cols-1 items-center gap-6 px-5 pb-5 pt-1 sm:px-8 lg:grid-cols-12">
          <div className="flex justify-center lg:col-span-3">
            <svg width="170" height="170" viewBox="0 0 170 170" aria-label="Birth-date octagram">
              <circle cx="85" cy="85" r="76" fill="none" stroke={STEEL} strokeWidth="0.5" opacity="0.7" />
              <circle cx="85" cy="85" r="54" fill="none" stroke={STEEL} strokeWidth="0.4" strokeDasharray="2 3" opacity="0.7" />
              <polygon points="85,15 134.5,35.5 155,85 134.5,134.5 85,155 35.5,134.5 15,85 35.5,35.5" fill="none" stroke={SILVER} strokeWidth="0.8" className="lse-rot-a" />
              <polygon points="85,29 124.7,45.3 141,85 124.7,124.7 85,141 45.3,124.7 29,85 45.3,45.3" fill="none" stroke={SILVER} strokeWidth="0.5" opacity="0.6" className="lse-rot-b" />
              <circle cx="85" cy="85" r="16" fill="none" stroke={SILVER} strokeWidth="0.7" />
              <circle cx="85" cy="85" r="2.4" fill={SILVER} className="lse-pulse" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((d, k) => {
                const p = onCircle(85, 85, 82, d);
                const q = onCircle(85, 85, 64, d);
                return (
                  <g key={d}>
                    <line x1="85" y1="85" x2={q.x} y2={q.y} stroke={STEEL} strokeWidth="0.3" opacity="0.4" />
                    <text x={p.x} y={p.y + 2} textAnchor="middle" fontSize="6" fill={DIM}>
                      {k * 10}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="lg:col-span-6">
            <div className="lse-caps text-[7px] lse-dim">Auxiliary Reading · Birth Date Only</div>
            <h3 className="lse-serif mt-2 text-[20px] leading-snug lse-hi sm:text-[24px]">
              Eight points, one date, a map of the life around it.
            </h3>
            <p className="mt-3 max-w-[480px] text-[10px] leading-[1.7] lse-mid">
              An optional birth-date octagram tool. It maps purpose, love, money,
              and age themes from your birth date.
            </p>
            <div className="mt-3 grid max-w-[380px] grid-cols-4 gap-1">
              {["Purpose", "Love", "Money", "Age"].map((s) => (
                <span key={s} className="lse-caps border border-[rgba(125,148,184,0.25)] py-0.5 text-center text-[6px] lse-mid">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="lg:col-span-3 lg:text-right">
            <a href="/destiny-matrix" className="lse-btn lse-caps inline-block px-5 py-2 text-[8.5px]">
              Open Destiny Matrix →
            </a>
            <div className="lse-mono mt-3 text-[6.5px] lse-dim leading-[1.7]">
              INPUT DD·MM·YYYY → 22 ARCANA<br />NO BIRTH TIME NEEDED
            </div>
          </div>
        </div>
      </section>

      {/* ===================== RITUAL WINDOW + TODAY ROW ===================== */}
      <section className="lse-panel relative z-10 mx-auto max-w-[1240px] border-x border-b">
        <PHead title="Ritual Window — Tonight" right="LOCAL MEAN TIME" />
        <div className="grid grid-cols-1 gap-px bg-[rgba(125,148,184,0.14)] lg:grid-cols-12">
          {/* ritual window card */}
          <div className="bg-[#080d18] p-4 lg:col-span-5">
            <div className="grid grid-cols-[110px_1fr] items-center gap-4">
              <svg width="110" height="110" viewBox="0 0 110 110" aria-hidden="true">
                <circle cx="55" cy="55" r="46" fill="none" stroke={STEEL} strokeWidth="0.5" opacity="0.7" />
                {ringTicks(55, 55, 41, 46, 48, 4).map((t, i) => (
                  <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.major ? SILVER : STEEL} strokeWidth={t.major ? 0.6 : 0.35} opacity={t.major ? 0.8 : 0.45} />
                ))}
                {/* window arc 23:40 – 01:12 */}
                <path
                  d={`M ${onCircle(55, 55, 36, 265).x} ${onCircle(55, 55, 36, 265).y} A 36 36 0 0 1 ${onCircle(55, 55, 36, 18).x} ${onCircle(55, 55, 36, 18).y}`}
                  fill="none" stroke={SILVER} strokeWidth="2.2" opacity="0.9"
                />
                <circle cx={onCircle(55, 55, 36, 265).x} cy={onCircle(55, 55, 36, 265).y} r="2" fill={SILVER} />
                <circle cx={onCircle(55, 55, 36, 18).x} cy={onCircle(55, 55, 36, 18).y} r="2" fill={SILVER} />
                <path d="M59 42 a15 15 0 1 0 0 26 a11.6 11.6 0 1 1 0 -26 Z" fill={SILVER} opacity="0.9" />
                <text x="55" y="12" textAnchor="middle" fontSize="5.5" fill={DIM}>00</text>
                <text x="55" y="104" textAnchor="middle" fontSize="5.5" fill={DIM}>12</text>
              </svg>
              <div>
                <div className="lse-caps text-[7px] lse-dim">Optimal Window</div>
                <div className="lse-serif mt-1 text-[22px] leading-none lse-hi">
                  23:40<span className="lse-dim text-[13px]"> — </span>01:12
                </div>
                <div className="lse-mono mt-2 text-[7px] lse-mid leading-[1.7]">
                  MOON AT ZENITH −0.4°<br />VEIL INDEX 0.91 · STILL AIR
                </div>
                <div className="lse-mono mt-2 text-[6px] lse-dim">
                  BEST FOR: PULLS · CASTINGS · SYNASTRY
                </div>
              </div>
            </div>
          </div>
          {/* today row */}
          <div className="grid grid-cols-1 gap-px bg-[rgba(125,148,184,0.14)] sm:grid-cols-3 lg:col-span-7">
            {[
              { label: "Moon today", big: "Waning Gibbous", sub: "ILLUM 68.2% · AGE 20.6 D", glyph: "☽︎" },
              { label: "Sign of the day", big: "♏︎ Scorpio", sub: "INTENSE · FIXED WATER", glyph: "♏︎" },
              { label: "Card of the day", big: "XVIII · The Moon", sub: "INTUITION OVER SIGHT", glyph: "✶" },
            ].map((c) => (
              <div key={c.label} className="lse-plate flex flex-col justify-between bg-[#080d18] p-4">
                <div className="flex items-center justify-between">
                  <span className="lse-caps text-[6.5px] lse-dim">{c.label}</span>
                  <span className="lse-serif text-[13px] lse-mid">{c.glyph}</span>
                </div>
                <div className="lse-serif mt-3 text-[16px] leading-tight lse-hi">{c.big}</div>
                <div className="lse-mono mt-2 border-t border-[rgba(125,148,184,0.14)] pt-1.5 text-[6px] lse-dim">{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ ANALYSIS NOTES ============================ */}
      <section className="lse-panel relative z-10 mx-auto max-w-[1240px] border-x border-b">
        <PHead title="Analysis Notes — Frequently Logged Queries" right="4 ENTRIES" />
        <div className="grid grid-cols-1 gap-x-6 px-5 pb-3 sm:grid-cols-2 sm:px-8">
          {FAQ.map((f) => (
            <div key={f.n} className="border-b border-[rgba(125,148,184,0.14)] py-3">
              <div className="flex items-baseline gap-2">
                <span className="lse-mono text-[7px] lse-dim shrink-0">{f.n}</span>
                <span className="lse-caps text-[8.5px] lse-hi">{f.q}</span>
              </div>
              <p className="mt-1.5 pl-[38px] text-[9px] leading-[1.65] lse-mid">{f.a}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-[rgba(125,148,184,0.18)] px-5 py-1.5 lse-mono text-[6.5px] lse-dim sm:px-8">
          LOG CONTINUES AT /SUPPORT · RESPONSE LATENCY &lt; 1 TIDAL CYCLE
        </div>
      </section>

      {/* ================================ CTA ================================ */}
      <section className="lse-panel relative z-10 mx-auto max-w-[1240px] overflow-hidden border-x border-b px-5 py-12 text-center sm:py-16">
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-40" aria-hidden="true" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 220">
          <circle cx="600" cy="110" r="90" fill="url(#lse-halo)" className="lse-pulse" />
          <circle cx="600" cy="110" r="80" fill="none" stroke={STEEL} strokeWidth="0.4" strokeDasharray="2 4" className="lse-rot-a" />
          <circle cx="600" cy="110" r="126" fill="none" stroke={STEEL} strokeWidth="0.3" strokeDasharray="1 5" className="lse-rot-b" />
          {ringTicks(600, 110, 148, 154, 48, 4).map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={STEEL} strokeWidth="0.4" opacity="0.6" />
          ))}
          <line x1="0" y1="110" x2="430" y2="110" stroke={STEEL} strokeWidth="0.3" opacity="0.5" />
          <line x1="770" y1="110" x2="1200" y2="110" stroke={STEEL} strokeWidth="0.3" opacity="0.5" />
        </svg>
        <div className="relative">
          <div className="lse-caps text-[7.5px] lse-dim">— Final Reading —</div>
          <p className="lse-serif lse-glow mx-auto mt-3 max-w-[600px] text-[22px] leading-snug lse-hi sm:text-[28px]">
            Your chart is written in the stars. Come read it.
          </p>
          <a href="/sign-up" className="lse-btn lse-caps mt-6 inline-block px-8 py-2.5 text-[10px]">
            {"Get started — it's free"}
          </a>
          <div className="lse-mono mt-4 text-[7px] lse-dim">
            NO CARD REQUIRED · CHART IN &lt; 60 SECONDS · CANCEL NEVER — {"IT'S"} FREE
          </div>
        </div>
      </section>

      {/* =============================== FOOTER =============================== */}
      <footer className="lse-panel relative z-10 mx-auto mb-0 flex max-w-[1240px] flex-wrap items-center gap-x-5 gap-y-1 border-x border-b px-4 py-2.5">
        <span className="flex items-center gap-1.5">
          <span className="lse-hi text-[10px]">☽︎</span>
          <span className="lse-caps lse-serif text-[9px] lse-hi tracking-[0.24em]">Astro Scope</span>
        </span>
        <span className="lse-mono text-[6.5px] lse-dim">SELENE LUNAR OBSERVATORY · PLATE REV K</span>
        <span className="flex-1" />
        {[
          ["Horoscopes", "/horoscope"],
          ["Tarot", "/tarot"],
          ["Compatibility", "/compatibility"],
          ["Psychology", "/psychology"],
          ["Cosmic Passport", "/passport"],
        ].map(([label, href]) => (
          <a key={href} href={href} className="lse-caps lse-link text-[6.5px] lse-dim">
            {label}
          </a>
        ))}
        <span className="lse-mono text-[6.5px] lse-dim">© 2026 · READINGS FOR ENTERTAINMENT + REFLECTION</span>
      </footer>
    </main>
  );
}

/* ============================ SCOPED STYLES =============================== */

const LSE_CSS = `
.lse-root{
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
.lse-serif{ font-family: Georgia, 'Times New Roman', serif; }
.lse-mono{ font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace; }
.lse-caps{ text-transform:uppercase; letter-spacing:.22em; }
.lse-hi{ color:#c8d6ec; }
.lse-mid{ color:#8ea3c2; }
.lse-dim{ color:#4a5c78; }
.lse-glow{ text-shadow:0 0 14px rgba(160,190,230,.38), 0 0 40px rgba(120,150,200,.16); }
.lse-panel{
  border-top:1px solid transparent;
  border-color:rgba(125,148,184,.24);
  background:linear-gradient(180deg, rgba(17,25,42,.55), rgba(7,11,20,.78));
  box-shadow: inset 0 0 0 1px rgba(200,214,236,.045), inset 0 0 40px rgba(10,16,30,.45);
  border-style:solid; border-width:0 1px 1px 1px;
}
.lse-hair{ height:1px; background:linear-gradient(90deg, transparent, rgba(125,148,184,.45) 20%, rgba(125,148,184,.45) 80%, transparent); }
.lse-vhair{ width:1px; height:14px; background:rgba(125,148,184,.35); }
.lse-btn{
  border:1px solid rgba(200,214,236,.55);
  color:#e2eafa;
  background:linear-gradient(180deg, rgba(60,80,116,.5), rgba(20,30,52,.7));
  box-shadow: inset 0 0 0 1px rgba(200,214,236,.12), 0 0 14px rgba(120,150,200,.18);
  letter-spacing:.22em;
  transition: box-shadow .3s ease, background .3s ease;
}
.lse-btn:hover{
  background:linear-gradient(180deg, rgba(90,116,160,.55), rgba(34,48,78,.75));
  box-shadow: inset 0 0 0 1px rgba(200,214,236,.2), 0 0 26px rgba(140,172,220,.4);
}
.lse-link{ transition: color .25s ease, text-shadow .25s ease; }
.lse-link:hover{ color:#e6eefb; text-shadow:0 0 10px rgba(160,190,230,.5); }
.lse-plate{ transition: box-shadow .3s ease, background .3s ease; }
.lse-plate:hover{ background:#0b1220; box-shadow: inset 0 0 0 1px rgba(200,214,236,.14), inset 0 0 30px rgba(20,32,56,.5); }
.lse-hero-scrim{
  background:
    linear-gradient(90deg, rgba(6,10,18,.94) 0%, rgba(6,10,18,.82) 28%, rgba(6,10,18,.45) 50%, rgba(6,10,18,0) 70%),
    linear-gradient(0deg, rgba(6,10,18,.55) 0%, rgba(6,10,18,0) 26%);
}

@keyframes lse-rot{ to{ transform: rotate(360deg); } }
@keyframes lse-pulse{ 0%,100%{ opacity:.55; } 50%{ opacity:1; } }
@keyframes lse-drift{ 0%,100%{ transform: translateY(0); } 50%{ transform: translateY(-6px); } }

@media (prefers-reduced-motion: no-preference){
  .lse-rot-a{ animation: lse-rot 180s linear infinite; transform-box: view-box; transform-origin: center; }
  .lse-rot-b{ animation: lse-rot 120s linear infinite reverse; transform-box: view-box; transform-origin: center; }
  .lse-rot-c{ animation: lse-rot 90s linear infinite; transform-box: view-box; transform-origin: center; }
  .lse-pulse{ animation: lse-pulse 16s ease-in-out infinite; }
  .lse-drift{ animation: lse-drift 60s ease-in-out infinite; }
}
@media (prefers-reduced-motion: reduce){
  .lse-rot-a,.lse-rot-b,.lse-rot-c,.lse-pulse,.lse-drift{ animation: none; }
}
`;
