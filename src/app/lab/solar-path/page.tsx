// LAB / SOLAR PATH — a design exploration of the production landing in the
// "Arcana Console" language of astro/photo_2026-08-04_22-21-33.jpg: gold on
// near-black, an ornate instrument card with a breathing solar sphere, corner
// numerals, a narrow arcana-code column, and dense engraved small print.
// Fully self-contained: inline SVG, Tailwind for layout, one scoped <style>
// block (lsp- prefixed) for the rest. Server-component safe: no hooks, CSS
// animations only (15–180s cycles, reduced-motion guarded), statically
// prerendered.

import type { Metadata } from "next";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Astro Scope — Numbers hold meaning",
  description:
    "Free birth chart, daily horoscopes, synastry and tarot — an instrument console for reading your fate.",
};

const DEG = Math.PI / 180;

// gold-on-black arcana palette
const GOLD = "#c9a227";
const GOLD_HI = "#e8c76a";
const GOLD_DIM = "#8a6d1f";
const IVORY = "#efe6d2";
const INK = "#0a0805";

/* ============================ GEOMETRY HELPERS ============================ */

// tick marks around a circle: n radial lines from rIn to rOut around (cx, cy)
function ringTicks(cx: number, cy: number, rIn: number, rOut: number, n: number, offset = 0) {
  return Array.from({ length: n }, (_, k) => {
    const t = (offset + (360 / n) * k) * DEG;
    return {
      x1: +(cx + rIn * Math.cos(t)).toFixed(1),
      y1: +(cy + rIn * Math.sin(t)).toFixed(1),
      x2: +(cx + rOut * Math.cos(t)).toFixed(1),
      y2: +(cy + rOut * Math.sin(t)).toFixed(1),
      major: k % (n / 12) === 0,
    };
  });
}

// sun rays: alternating long/short spokes drawn as one path
function raysPath(cx: number, cy: number, n: number, rIn: number, rLong: number, rShort: number) {
  let d = "";
  for (let k = 0; k < n; k++) {
    const r = k % 2 ? rShort : rLong;
    const t = ((360 / n) * k) * DEG;
    d += `M ${(cx + rIn * Math.cos(t)).toFixed(1)} ${(cy + rIn * Math.sin(t)).toFixed(1)} L ${(cx + r * Math.cos(t)).toFixed(1)} ${(cy + r * Math.sin(t)).toFixed(1)} `;
  }
  return d;
}

// point on a circle, for hand-placed orbit labels
function onCircle(cx: number, cy: number, r: number, deg: number) {
  const t = deg * DEG;
  return { x: +(cx + r * Math.cos(t)).toFixed(1), y: +(cy + r * Math.sin(t)).toFixed(1) };
}

/* ============================== CONTENT DATA ============================== */

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

const SECTIONS = [
  { tag: "FREE", title: "Birth Chart", glyph: "☉︎", copy: "Map your Sun, Moon, and Rising — the foundation of every reading." },
  { tag: "DAILY", title: "Daily Horoscope", glyph: "☽︎", copy: "Twelve signs, one sky. Clear forecasts without the fluff." },
  { tag: "SYNASTRY", title: "Compatibility", glyph: "♀︎", copy: "Zodiac match, Chinese pairs, and deep synastry for two charts." },
  { tag: "SPREADS", title: "Tarot", glyph: "✶︎", copy: "Daily card to Celtic Cross — pull, reflect, get a full reading." },
  { tag: "TESTS", title: "Psychology", glyph: "☿︎", copy: "MBTI, Big Five, empathy and more — meet yourself beyond the signs." },
  { tag: "YOU", title: "Cosmic Passport", glyph: "♄︎", copy: "Your Cosmic ID, people, journal, and Premium deep dives — one hub." },
];

const STEPS = [
  {
    n: "01",
    title: "INPUT",
    copy: "Enter your birth date and name as it appears on documents.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" className="h-5 w-5">
        <circle cx="12" cy="8" r="3.4" />
        <path d="M5.5 19c.8-3.6 3.4-5.4 6.5-5.4s5.7 1.8 6.5 5.4" />
      </svg>
    ),
  },
  {
    n: "02",
    title: "CALCULATE",
    copy: "Our algorithm generates your unique Arcana code.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" className="h-5 w-5">
        <rect x="6" y="4" width="12" height="16" rx="1.4" />
        <path d="M9 8h6M9 12h.9M12 12h.9M15 12h.9M9 15.4h.9M12 15.4h.9M15 15.4h.9" />
      </svg>
    ),
  },
  {
    n: "03",
    title: "REVEAL",
    copy: "Your Arcana card and archetypes are revealed instantly.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" className="h-5 w-5">
        <path d="M2.8 12c2.6-4.4 5.6-6.4 9.2-6.4s6.6 2 9.2 6.4c-2.6 4.4-5.6 6.4-9.2 6.4s-6.6-2-9.2-6.4Z" />
        <circle cx="12" cy="12" r="2.7" />
      </svg>
    ),
  },
  {
    n: "04",
    title: "INSIGHT",
    copy: "Use the insights to align, decide, and create your best path.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" className="h-5 w-5">
        <path d="M12 3v18M3 12h18M6 6l12 12M18 6 6 18" strokeWidth="0.7" opacity="0.55" />
        <path d="M12 5.5 13.6 10.4 18.5 12 13.6 13.6 12 18.5 10.4 13.6 5.5 12 10.4 10.4Z" />
      </svg>
    ),
  },
];

const CHIPS = ["Sun Energy", "Leadership", "Manifestation", "Inner Fire"];

const FAQ = [
  {
    q: "What can I do for free?",
    a: "Your birth chart, daily horoscopes, tarot pulls, and psychology tests — all free, no account required.",
  },
  {
    q: "How do I get my free birth chart?",
    a: "Enter your date, time, and place of birth in the calculator and the chart is drawn instantly.",
  },
  {
    q: "Where are daily horoscopes?",
    a: "In the homepage grid of twelve signs, or gathered in the Horoscopes hub.",
  },
  {
    q: "What is the Destiny Matrix?",
    a: "An optional birth-date octagram that maps purpose, love, money, and age themes.",
  },
];

// fine starfield across the hero field, deterministic so the prerender is stable
const STARS = Array.from({ length: 90 }, (_, i) => ({
  x: +((i * 631.7 + 113) % 1600).toFixed(1),
  y: +((i * 389.3 + 61) % 900).toFixed(1),
  r: +(0.35 + ((i * 7) % 10) / 18).toFixed(2),
  o: +(0.22 + ((i * 13) % 10) / 26).toFixed(2),
  g: i % 3, // twinkle group
}));

// left margin ruler ticks 0..100 in steps of 2
const RULER = Array.from({ length: 51 }, (_, i) => i * 2);

// card dial: 60 ticks, roman numerals at the four cardinal points
const DIAL = ringTicks(150, 190, 118, 124, 60);
const RAYS = raysPath(150, 190, 36, 46, 84, 66);
const ROMAN = [
  { t: "XIX", p: onCircle(150, 190, 104, -90) },
  { t: "V", p: onCircle(150, 190, 104, 0) },
  { t: "IX", p: onCircle(150, 190, 104, 90) },
  { t: "XIV", p: onCircle(150, 190, 104, 180) },
];

/* ================================= PAGE ================================== */

export default function SolarPathPage() {
  return (
    <main className="lsp-root relative min-h-screen overflow-hidden text-[#efe6d2]" style={{ background: INK }}>
      <style>{LSP_CSS}</style>

      {/* ---- cosmic backdrop: starfield + faint chart circles, fixed behind ---- */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
      >
        {STARS.map((s, i) => (
          <circle
            key={i}
            className={`lsp-tw${s.g}`}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill={IVORY}
            opacity={s.o}
          />
        ))}
        <g stroke={GOLD} fill="none" opacity="0.07">
          <circle cx="1230" cy="330" r="300" />
          <circle cx="1230" cy="330" r="360" strokeDasharray="1 7" />
          <circle cx="240" cy="760" r="240" strokeDasharray="1 6" />
          <path d="M0 330 H1600 M1230 0 V900" strokeDasharray="2 9" />
        </g>
      </svg>

      {/* ---- left margin ruler, desktop only ---- */}
      <div aria-hidden className="lsp-ruler pointer-events-none absolute inset-y-0 left-0 hidden w-10 xl:block">
        {RULER.map((v) => (
          <div key={v} className="absolute left-0 flex items-center gap-1" style={{ top: `${v}%` }}>
            <span className="block h-px" style={{ width: v % 10 === 0 ? 14 : 7, background: GOLD_DIM }} />
            {v % 20 === 0 && (
              <span className="lsp-mono text-[8px] tracking-widest" style={{ color: GOLD_DIM }}>
                {String(v).padStart(3, "0")}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="relative mx-auto max-w-[1380px] px-5 sm:px-8 xl:pl-16">
        {/* ================================ NAV ================================ */}
        <header className="flex items-center justify-between gap-4 border-b py-5" style={{ borderColor: `${GOLD}26` }}>
          <a href="#" className="flex items-center gap-3">
            <svg viewBox="0 0 32 32" className="h-7 w-7" fill="none" stroke={GOLD} strokeWidth="1.1" aria-hidden>
              <circle cx="16" cy="16" r="13.5" />
              <circle cx="16" cy="16" r="4.4" fill={GOLD} stroke="none" />
              {ringTicks(16, 16, 8.5, 12.5, 12).map((t, i) => (
                <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} />
              ))}
            </svg>
            <span className="lsp-serif text-[15px] font-semibold tracking-[0.34em]" style={{ color: GOLD_HI }}>
              ASTRO&nbsp;SCOPE
            </span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {["Horoscopes", "Tarot", "Compatibility"].map((l) => (
              <a key={l} href="#" className="lsp-navlink lsp-mono text-[11px] tracking-[0.22em] uppercase">
                {l}
              </a>
            ))}
          </nav>
          <a href="#" className="lsp-btn-ghost lsp-mono px-4 py-2 text-[11px] tracking-[0.22em] uppercase">
            Sign&nbsp;In
          </a>
        </header>

        {/* ============================ HERO GRID ============================ */}
        <section className="grid grid-cols-1 gap-10 pt-12 pb-14 lg:grid-cols-12 lg:gap-6 lg:pt-16">
          {/* ---- left: headline column ---- */}
          <div className="lg:col-span-6 lg:pr-8">
            <p className="lsp-mono flex items-center gap-3 text-[10px] tracking-[0.42em] uppercase" style={{ color: GOLD }}>
              <span className="inline-block h-px w-10" style={{ background: GOLD }} />
              Discover your Arcana
              <span className="lsp-mono normal-case tracking-normal opacity-50">fig.&nbsp;01</span>
            </p>

            <h1 className="lsp-serif mt-7 text-[clamp(2.6rem,5.2vw,4.6rem)] leading-[1.04] font-medium">
              Numbers hold
              <br />
              meaning.{" "}
              <em className="lsp-gold-italic">Arcana reveals&nbsp;it.</em>
            </h1>

            <p className="mt-7 max-w-md text-[15px] leading-relaxed text-[#b9ac8d]">
              Free birth chart, daily horoscopes, synastry and tarot — an ancient system of numerical archetypes.
              Calculate your code and unveil the energies shaping your path, purpose, and potential.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a href="#" className="lsp-btn-primary lsp-mono px-7 py-3.5 text-[11px] tracking-[0.26em] uppercase">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                  <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8Z" />
                </svg>
                Cast your free birth chart
              </a>
              <a href="#" className="lsp-link-arrow lsp-mono text-[11px] tracking-[0.2em] uppercase">
                Read today&rsquo;s horoscope →
              </a>
            </div>

            {/* social proof */}
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2.5" aria-hidden>
                {["#d8b45a", "#a97f2e", "#e5cd8a", "#8a6d1f", "#c9a227"].map((c, i) => (
                  <span
                    key={i}
                    className="block h-7 w-7 rounded-full border"
                    style={{
                      borderColor: INK,
                      background: `radial-gradient(circle at 35% 30%, ${c}, #3a2a08 78%)`,
                    }}
                  />
                ))}
              </div>
              <p className="lsp-mono text-[10px] tracking-[0.18em] uppercase text-[#8d8168]">
                <span style={{ color: GOLD_HI }}>10,842</span> Arcana calculated
              </p>
              <span className="lsp-mono hidden text-[9px] tracking-[0.14em] text-[#57503e] sm:inline">
                / updated hourly
              </span>
            </div>

            {/* fine coordinate marginalia */}
            <p className="lsp-mono mt-12 hidden text-[9px] tracking-[0.3em] text-[#4d4636] uppercase lg:block">
              ecl. long. 132°44′ — lat. +00°00′ · plate XIX · heliocentric
            </p>
          </div>

          {/* ---- right: the arcana card ---- */}
          <div className="lg:col-span-4">
            <div className="lsp-card relative mx-auto w-full max-w-[340px]">
              {/* corner numerals */}
              <span className="lsp-coin lsp-serif absolute top-3 left-3">19</span>
              <span className="lsp-coin lsp-serif absolute top-3 right-3">5</span>
              {/* corner ornaments */}
              {[
                "top-2 left-2",
                "top-2 right-2 rotate-90",
                "bottom-2 right-2 rotate-180",
                "bottom-2 left-2 -rotate-90",
              ].map((pos) => (
                <svg key={pos} viewBox="0 0 28 28" aria-hidden className={`absolute h-7 w-7 ${pos}`} fill="none" stroke={GOLD_DIM} strokeWidth="1">
                  <path d="M2 26 V8 Q2 2 8 2 H26" />
                  <circle cx="7" cy="7" r="1.6" fill={GOLD_DIM} stroke="none" />
                </svg>
              ))}

              {/* the solar instrument */}
              <svg viewBox="0 0 300 380" className="relative block h-auto w-full" role="img" aria-label="The Solar Path — a golden sun with rings and rays">
                <defs>
                  <radialGradient id="lsp-sun" cx="42%" cy="38%" r="65%">
                    <stop offset="0%" stopColor="#fff6cf" />
                    <stop offset="22%" stopColor="#ffe27a" />
                    <stop offset="48%" stopColor="#f0b032" />
                    <stop offset="74%" stopColor="#a86a10" />
                    <stop offset="100%" stopColor="#a86a10" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="lsp-halo" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f5c34a" stopOpacity="0.55" />
                    <stop offset="55%" stopColor="#c9a227" stopOpacity="0.16" />
                    <stop offset="100%" stopColor="#c9a227" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="lsp-orb" cx="38%" cy="32%" r="70%">
                    <stop offset="0%" stopColor="#ffedb0" />
                    <stop offset="60%" stopColor="#c98f22" />
                    <stop offset="100%" stopColor="#5c3d08" />
                  </radialGradient>
                </defs>

                {/* axis line through the card */}
                <line x1="150" y1="16" x2="150" y2="330" stroke={GOLD} strokeWidth="0.5" opacity="0.35" />
                <line x1="30" y1="190" x2="270" y2="190" stroke={GOLD} strokeWidth="0.5" opacity="0.22" />

                {/* upper orbs on the axis */}
                <circle cx="150" cy="34" r="4.5" fill="url(#lsp-orb)" />
                <circle cx="150" cy="58" r="6.5" fill="url(#lsp-orb)" />
                <circle cx="150" cy="88" r="9" fill="url(#lsp-orb)" />
                {/* lower orbs */}
                <circle cx="150" cy="292" r="8" fill="url(#lsp-orb)" />
                <circle cx="150" cy="316" r="5" fill="url(#lsp-orb)" />

                {/* breathing halo */}
                <circle className="lsp-breathe" cx="150" cy="190" r="96" fill="url(#lsp-halo)" style={{ transformOrigin: "150px 190px" }} />

                {/* slow counter-rotating engraved rings */}
                <g className="lsp-spin-a" style={{ transformOrigin: "150px 190px" }}>
                  <circle cx="150" cy="190" r="104" fill="none" stroke={GOLD} strokeWidth="0.6" opacity="0.5" strokeDasharray="1 5" />
                  {DIAL.filter((t) => !t.major).map((t, i) => (
                    <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth="0.55" opacity="0.55" />
                  ))}
                </g>
                <g className="lsp-spin-b" style={{ transformOrigin: "150px 190px" }}>
                  <circle cx="150" cy="190" r="92" fill="none" stroke={GOLD} strokeWidth="0.5" opacity="0.4" />
                  <circle cx="150" cy="190" r="60" fill="none" stroke={GOLD} strokeWidth="0.5" opacity="0.45" strokeDasharray="14 6" />
                  {/* orbit bodies on the dashed ring */}
                  <circle cx={onCircle(150, 190, 60, 24).x} cy={onCircle(150, 190, 60, 24).y} r="3" fill={GOLD_HI} />
                  <circle cx={onCircle(150, 190, 60, 158).x} cy={onCircle(150, 190, 60, 158).y} r="2" fill={GOLD} opacity="0.8" />
                  <circle cx={onCircle(150, 190, 60, 262).x} cy={onCircle(150, 190, 60, 262).y} r="2.4" fill={GOLD} opacity="0.6" />
                </g>

                {/* static major ticks + roman numerals */}
                {DIAL.filter((t) => t.major).map((t, i) => (
                  <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={GOLD_HI} strokeWidth="1" opacity="0.8" />
                ))}
                {ROMAN.map((r) => (
                  <text
                    key={r.t}
                    x={r.p.x}
                    y={r.p.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={GOLD}
                    opacity="0.75"
                    fontSize="8"
                    letterSpacing="1.5"
                    className="lsp-mono"
                  >
                    {r.t}
                  </text>
                ))}

                {/* rays — very slow rotation */}
                <g className="lsp-spin-c" style={{ transformOrigin: "150px 190px" }}>
                  <path d={RAYS} stroke={GOLD_HI} strokeWidth="0.9" opacity="0.85" />
                </g>

                {/* the sun itself */}
                <circle className="lsp-breathe-core" cx="150" cy="190" r="44" fill="url(#lsp-sun)" style={{ transformOrigin: "150px 190px" }} />
                <circle cx="150" cy="190" r="44" fill="none" stroke="#ffe9a8" strokeWidth="0.8" opacity="0.7" />

                {/* flanking star sparks on the horizontal axis */}
                {[46, 254].map((x) => (
                  <path key={x} d={`M${x} 182 l1.6 6.4 6.4 1.6 -6.4 1.6 -1.6 6.4 -1.6 -6.4 -6.4 -1.6 6.4 -1.6Z`} fill={GOLD_HI} opacity="0.9" />
                ))}

                {/* caption */}
                <text x="150" y="352" textAnchor="middle" fill={GOLD_HI} fontSize="12.5" letterSpacing="4.5" className="lsp-serif">
                  THE SOLAR PATH
                </text>
                <line x1="52" y1="352" x2="98" y2="352" stroke={GOLD_DIM} strokeWidth="0.7" />
                <line x1="202" y1="352" x2="248" y2="352" stroke={GOLD_DIM} strokeWidth="0.7" />
                <text x="150" y="370" textAnchor="middle" fill={GOLD} fontSize="7" letterSpacing="2.6" className="lsp-mono" opacity="0.85">
                  VITALITY · PURPOSE · EXPANSION
                </text>
              </svg>
            </div>
          </div>

          {/* ---- far right: arcana code column ---- */}
          <aside className="lg:col-span-2 lg:pl-4">
            <div className="flex flex-row items-start gap-6 lg:flex-col lg:gap-0">
              <div>
                <p className="lsp-mono text-[9px] tracking-[0.34em] uppercase" style={{ color: GOLD }}>
                  Your Arcana Code
                </p>
                <p className="lsp-serif mt-2 text-[64px] leading-none" style={{ color: GOLD_HI, textShadow: "0 0 26px rgba(201,162,39,.45)" }}>
                  195
                </p>
              </div>
              <ul className="mt-1 flex flex-col gap-2 lg:mt-6">
                {CHIPS.map((c, i) => (
                  <li key={c} className="lsp-chip lsp-mono flex items-center gap-2.5 px-3 py-1.5 text-[9.5px] tracking-[0.16em] uppercase">
                    <span className="text-[10px]" style={{ color: GOLD }}>
                      ✶︎
                    </span>
                    {c}
                    <span className="ml-auto opacity-40">{String(i + 1).padStart(2, "0")}</span>
                  </li>
                ))}
              </ul>
            </div>
            <blockquote className="mt-8 border-l pl-4 lg:mt-10" style={{ borderColor: `${GOLD}55` }}>
              <p className="lsp-serif text-[26px] leading-none" style={{ color: GOLD }} aria-hidden>
                “
              </p>
              <p className="lsp-serif mt-1 text-[13.5px] leading-snug text-[#cbbd97] italic">
                Light does not seek permission to shine.
              </p>
            </blockquote>
          </aside>
        </section>

        {/* ========================= ZODIAC BAND ========================= */}
        <section aria-label="The twelve signs" className="border-y" style={{ borderColor: `${GOLD}26` }}>
          <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12">
            {SIGNS.map((s, i) => (
              <a
                key={s.n}
                href="#"
                className="lsp-sign group flex flex-col items-center gap-1 border-b px-1 py-4 text-center sm:border-b-0"
                style={{ borderColor: `${GOLD}14` }}
              >
                <span className="lsp-mono text-[8px] tracking-[0.2em] text-[#57503e]">{String(i + 1).padStart(2, "0")}</span>
                <span className="lsp-sign-glyph text-[19px] leading-none" style={{ color: GOLD_HI }}>
                  {s.g}
                </span>
                <span className="lsp-mono text-[8.5px] tracking-[0.22em] uppercase text-[#b9ac8d]">{s.n}</span>
                <span className="lsp-mono text-[8px] tracking-[0.06em] text-[#6f6650]">{s.d}</span>
              </a>
            ))}
          </div>
        </section>

        {/* ========================== HOW IT WORKS ========================== */}
        <section className="pt-16 pb-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="lsp-mono text-[10px] tracking-[0.42em] uppercase" style={{ color: GOLD }}>
              How it works
            </h2>
            <span className="lsp-mono text-[9px] tracking-[0.24em] text-[#57503e] uppercase">procedure / four movements</span>
          </div>

          <div className="relative mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {/* connecting hairline */}
            <span aria-hidden className="absolute top-7 right-[12%] left-[12%] hidden h-px lg:block" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}66, ${GOLD}66, transparent)` }} />
            {STEPS.map((s) => (
              <div key={s.n} className="relative flex flex-col items-start">
                <div className="lsp-medallion relative z-10 flex h-14 w-14 items-center justify-center rounded-full" style={{ color: GOLD_HI }}>
                  {s.icon}
                </div>
                <p className="lsp-mono mt-5 text-[10px] tracking-[0.3em] uppercase" style={{ color: GOLD }}>
                  <span className="mr-2 opacity-50">{s.n}</span>
                  {s.title}
                </p>
                <p className="mt-2.5 max-w-[230px] text-[12.5px] leading-relaxed text-[#8d8168]">{s.copy}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== SIX SECTIONS — ENGRAVED LIST ==================== */}
        <section className="pt-14 pb-4">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="lsp-mono text-[10px] tracking-[0.42em] uppercase" style={{ color: GOLD }}>
              The instrument panel
            </h2>
            <span className="lsp-mono text-[9px] tracking-[0.24em] text-[#57503e] uppercase">six registers · index a–f</span>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-x-12 md:grid-cols-2">
            {SECTIONS.map((s, i) => (
              <a key={s.title} href="#" className="lsp-row group flex items-start gap-5 border-b py-5" style={{ borderColor: `${GOLD}1f` }}>
                <span className="lsp-mono pt-1 text-[9px] tracking-[0.2em] text-[#57503e]">{String.fromCharCode(97 + i)}/</span>
                <span className="lsp-row-glyph flex h-9 w-9 shrink-0 items-center justify-center text-[16px]" style={{ color: GOLD_HI }}>
                  {s.glyph}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="lsp-serif text-[17px] text-[#efe6d2]">{s.title}</span>
                    <span className="lsp-mono shrink-0 text-[8.5px] tracking-[0.3em] uppercase" style={{ color: GOLD }}>
                      {s.tag}
                    </span>
                  </span>
                  <span className="mt-1.5 block text-[12.5px] leading-relaxed text-[#8d8168]">{s.copy}</span>
                </span>
                <span className="lsp-mono lsp-row-arrow shrink-0 pt-1 text-[10px] tracking-[0.14em] uppercase" style={{ color: GOLD }}>
                  Explore&nbsp;→
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ========================= DESTINY MATRIX ========================= */}
        <section className="lsp-matrix mt-12 flex flex-col items-start gap-6 px-6 py-7 sm:flex-row sm:items-center sm:gap-9 sm:px-9">
          <svg viewBox="0 0 64 64" className="h-14 w-14 shrink-0" fill="none" stroke={GOLD_HI} strokeWidth="1" aria-hidden>
            <rect x="14" y="14" width="36" height="36" />
            <rect x="14" y="14" width="36" height="36" transform="rotate(45 32 32)" />
            <circle cx="32" cy="32" r="6" fill={GOLD_HI} stroke="none" opacity="0.9" />
            <circle cx="32" cy="32" r="25.5" strokeDasharray="1 4" opacity="0.6" />
          </svg>
          <div className="min-w-0 flex-1">
            <p className="lsp-mono text-[9px] tracking-[0.34em] uppercase" style={{ color: GOLD }}>
              Appendix · optional instrument
            </p>
            <h3 className="lsp-serif mt-2 text-[22px] text-[#efe6d2]">Destiny Matrix</h3>
            <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-[#8d8168]">
              An optional birth-date octagram tool. It maps purpose, love, money, and age themes from your birth date.
            </p>
          </div>
          <a href="#" className="lsp-btn-ghost lsp-mono shrink-0 px-6 py-3 text-[10.5px] tracking-[0.24em] uppercase">
            Open Destiny Matrix →
          </a>
        </section>

        {/* ================================ FAQ ================================ */}
        <section className="pt-16 pb-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="lsp-mono text-[10px] tracking-[0.42em] uppercase" style={{ color: GOLD }}>
              Questions, answered
            </h2>
            <span className="lsp-mono text-[9px] tracking-[0.24em] text-[#57503e] uppercase">q.1 — q.4</span>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-x-12 md:grid-cols-2">
            {FAQ.map((f, i) => (
              <div key={f.q} className="border-b py-5" style={{ borderColor: `${GOLD}1f` }}>
                <p className="flex items-baseline gap-3">
                  <span className="lsp-mono text-[9px] tracking-[0.2em]" style={{ color: GOLD }}>
                    Q.{i + 1}
                  </span>
                  <span className="lsp-serif text-[15.5px] text-[#e6dcc4]">{f.q}</span>
                </p>
                <p className="mt-2 pl-10 text-[12.5px] leading-relaxed text-[#8d8168]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================= CTA BAND ============================= */}
        <section className="lsp-cta relative mt-14 overflow-hidden px-6 py-14 text-center sm:px-12">
          <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 300">
            <g stroke={GOLD} fill="none" opacity="0.14">
              <circle cx="600" cy="150" r="120" strokeDasharray="1 5" />
              <circle cx="600" cy="150" r="190" />
              <circle cx="600" cy="150" r="265" strokeDasharray="1 8" />
              <path d="M0 150 H1200" strokeDasharray="2 8" />
            </g>
          </svg>
          <p className="lsp-mono relative text-[9px] tracking-[0.4em] uppercase" style={{ color: GOLD }}>
            The reading is already written
          </p>
          <h2 className="lsp-serif relative mx-auto mt-5 max-w-2xl text-[clamp(1.7rem,3.4vw,2.7rem)] leading-tight font-medium">
            Your chart is written in the stars. <em className="lsp-gold-italic">Come read it.</em>
          </h2>
          <a href="#" className="lsp-btn-primary lsp-mono relative mt-9 inline-flex px-8 py-4 text-[11px] tracking-[0.26em] uppercase">
            Get started — it&rsquo;s free
          </a>
        </section>

        {/* ============================ FOOTER STRIP ============================ */}
        <footer className="mt-16 border-t" style={{ borderColor: `${GOLD}26` }}>
          <div className="grid grid-cols-1 gap-8 py-9 sm:grid-cols-3">
            {[
              { n: "22", l: "Major Arcana" },
              { n: "108", l: "Archetypes" },
              { n: "∞", l: "Possibilities" },
            ].map((s) => (
              <div key={s.l} className="flex items-baseline justify-center gap-3 sm:justify-start sm:last:justify-end sm:[&:nth-child(2)]:justify-center">
                <span className="lsp-serif text-[30px]" style={{ color: GOLD_HI }}>
                  {s.n}
                </span>
                <span className="lsp-mono text-[9.5px] tracking-[0.3em] uppercase text-[#8d8168]">{s.l}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center justify-between gap-4 border-t py-6 sm:flex-row" style={{ borderColor: `${GOLD}1a` }}>
            <p className="lsp-mono text-[9px] tracking-[0.3em] uppercase text-[#57503e]">
              Astro Scope — ancient wisdom, modern discovery
            </p>
            <nav className="flex items-center gap-6">
              {["Horoscopes", "Tarot", "Compatibility", "Sign In"].map((l) => (
                <a key={l} href="#" className="lsp-navlink lsp-mono text-[9px] tracking-[0.22em] uppercase">
                  {l}
                </a>
              ))}
            </nav>
            <p className="lsp-mono text-[9px] tracking-[0.2em] text-[#3f3a2d]">© MMXXVI · plate XIX</p>
          </div>
        </footer>
      </div>
    </main>
  );
}

/* ============================ SCOPED STYLES ============================ */

const LSP_CSS = `
.lsp-root {
  --gold: ${GOLD};
  --gold-hi: ${GOLD_HI};
  --gold-dim: ${GOLD_DIM};
  background-image:
    radial-gradient(1200px 700px at 78% 18%, rgba(201,162,39,.07), transparent 60%),
    radial-gradient(900px 600px at 8% 90%, rgba(201,162,39,.05), transparent 60%);
}
.lsp-serif { font-family: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Times New Roman", serif; }
.lsp-mono { font-family: ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, monospace; }
.lsp-gold-italic {
  font-style: italic;
  color: ${GOLD_HI};
  text-shadow: 0 0 34px rgba(201,162,39,.35);
}

/* nav + links */
.lsp-navlink { color: #b9ac8d; transition: color .3s ease; }
.lsp-navlink:hover { color: ${GOLD_HI}; }
.lsp-link-arrow { color: ${GOLD_HI}; border-bottom: 1px solid ${GOLD}44; padding-bottom: 3px; transition: border-color .3s ease, color .3s ease; }
.lsp-link-arrow:hover { border-color: ${GOLD_HI}; }

/* buttons */
.lsp-btn-primary {
  display: inline-flex; align-items: center; gap: .8rem;
  color: ${GOLD_HI};
  border: 1px solid ${GOLD}99;
  background: linear-gradient(180deg, rgba(201,162,39,.14), rgba(201,162,39,.05));
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.6), 0 0 24px rgba(201,162,39,.12);
  transition: box-shadow .4s ease, background .4s ease, border-color .4s ease;
}
.lsp-btn-primary:hover {
  border-color: ${GOLD_HI};
  background: linear-gradient(180deg, rgba(201,162,39,.22), rgba(201,162,39,.08));
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.6), 0 0 44px rgba(201,162,39,.3);
}
.lsp-btn-ghost {
  display: inline-block;
  color: ${GOLD_HI};
  border: 1px solid ${GOLD}55;
  transition: border-color .3s ease, background .3s ease;
}
.lsp-btn-ghost:hover { border-color: ${GOLD_HI}; background: rgba(201,162,39,.08); }

/* the arcana card */
.lsp-card {
  background:
    linear-gradient(160deg, rgba(201,162,39,.08), rgba(10,8,5,0) 38%),
    #0d0a06;
  border: 1px solid ${GOLD}66;
  outline: 1px solid ${GOLD}2e;
  outline-offset: 5px;
  box-shadow: 0 30px 80px rgba(0,0,0,.75), 0 0 90px rgba(201,162,39,.10);
  padding: 1.4rem 1rem .9rem;
}
.lsp-coin {
  z-index: 2;
  display: flex; align-items: center; justify-content: center;
  width: 2.5rem; height: 2.5rem;
  font-size: 1.05rem; color: ${GOLD_HI};
  border: 1px solid ${GOLD}77; border-radius: 9999px;
  background: radial-gradient(circle at 35% 30%, #241a08, #0d0a06 75%);
  box-shadow: 0 0 18px rgba(201,162,39,.2);
}

/* chips */
.lsp-chip {
  color: #cbbd97;
  border: 1px solid ${GOLD}33;
  background: rgba(201,162,39,.05);
  border-radius: 9999px;
  white-space: nowrap;
  transition: border-color .3s ease;
}
.lsp-chip:hover { border-color: ${GOLD}88; }

/* zodiac band */
.lsp-sign { transition: background .35s ease; }
.lsp-sign:hover { background: rgba(201,162,39,.06); }
.lsp-sign-glyph { font-family: "DejaVu Sans", "Segoe UI Symbol", Georgia, serif; transition: text-shadow .35s ease; }
.lsp-sign:hover .lsp-sign-glyph { text-shadow: 0 0 16px rgba(232,199,106,.8); }

/* step medallions */
.lsp-medallion {
  border: 1px solid ${GOLD}66;
  background:
    radial-gradient(circle at 34% 28%, rgba(232,199,106,.16), transparent 55%),
    #0d0a06;
  box-shadow: 0 0 0 5px ${INK}, 0 0 0 6px ${GOLD}22, 0 10px 30px rgba(0,0,0,.6);
}

/* engraved rows */
.lsp-row { transition: background .3s ease; }
.lsp-row:hover { background: rgba(201,162,39,.05); }
.lsp-row-glyph {
  font-family: "DejaVu Sans", "Segoe UI Symbol", Georgia, serif;
  border: 1px solid ${GOLD}44; border-radius: 9999px;
  background: radial-gradient(circle at 35% 30%, rgba(232,199,106,.14), transparent 60%);
}
.lsp-row-arrow { opacity: .55; transition: opacity .3s ease, transform .3s ease; }
.lsp-row:hover .lsp-row-arrow { opacity: 1; transform: translateX(3px); }

/* destiny matrix + cta panels */
.lsp-matrix, .lsp-cta {
  border: 1px solid ${GOLD}33;
  background:
    linear-gradient(150deg, rgba(201,162,39,.07), transparent 45%),
    #0c0906;
  outline: 1px solid ${GOLD}1c;
  outline-offset: 4px;
}

/* ---------- slow, CSS-only motion (15–180s), reduced-motion guarded ---------- */
@keyframes lspBreath {
  0%, 100% { opacity: .55; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.12); }
}
@keyframes lspBreathCore {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.045); }
}
@keyframes lspSpin { to { transform: rotate(360deg); } }
@keyframes lspSpinRev { to { transform: rotate(-360deg); } }
@keyframes lspTw {
  0%, 100% { opacity: .18; }
  50% { opacity: .85; }
}
@media (prefers-reduced-motion: no-preference) {
  .lsp-breathe { animation: lspBreath 16s ease-in-out infinite; }
  .lsp-breathe-core { animation: lspBreathCore 18s ease-in-out infinite; }
  .lsp-spin-a { animation: lspSpin 160s linear infinite; }
  .lsp-spin-b { animation: lspSpinRev 120s linear infinite; }
  .lsp-spin-c { animation: lspSpin 180s linear infinite; }
  .lsp-tw0 { animation: lspTw 22s ease-in-out infinite; }
  .lsp-tw1 { animation: lspTw 31s ease-in-out infinite 7s; }
  .lsp-tw2 { animation: lspTw 27s ease-in-out infinite 13s; }
}

::selection { background: rgba(201,162,39,.35); color: #fff6dd; }
`;
