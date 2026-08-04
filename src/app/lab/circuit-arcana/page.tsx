import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Astro Scope — Circuit Arcana",
  description:
    "Free birth chart, daily horoscopes, synastry and tarot — the pattern was always there.",
};

/* ------------------------------------------------------------------ */
/* data                                                                */
/* ------------------------------------------------------------------ */

const SIGNS: { glyph: string; name: string; dates: string; numeral: string }[] = [
  { glyph: "♈︎", name: "Aries", dates: "Mar 21 – Apr 19", numeral: "I" },
  { glyph: "♉︎", name: "Taurus", dates: "Apr 20 – May 20", numeral: "II" },
  { glyph: "♊︎", name: "Gemini", dates: "May 21 – Jun 20", numeral: "III" },
  { glyph: "♋︎", name: "Cancer", dates: "Jun 21 – Jul 22", numeral: "IV" },
  { glyph: "♌︎", name: "Leo", dates: "Jul 23 – Aug 22", numeral: "V" },
  { glyph: "♍︎", name: "Virgo", dates: "Aug 23 – Sep 22", numeral: "VI" },
  { glyph: "♎︎", name: "Libra", dates: "Sep 23 – Oct 22", numeral: "VII" },
  { glyph: "♏︎", name: "Scorpio", dates: "Oct 23 – Nov 21", numeral: "VIII" },
  { glyph: "♐︎", name: "Sagittarius", dates: "Nov 22 – Dec 21", numeral: "IX" },
  { glyph: "♑︎", name: "Capricorn", dates: "Dec 22 – Jan 19", numeral: "X" },
  { glyph: "♒︎", name: "Aquarius", dates: "Jan 20 – Feb 18", numeral: "XI" },
  { glyph: "♓︎", name: "Pisces", dates: "Feb 19 – Mar 20", numeral: "XII" },
];

const MODULES: { index: string; tag: string; title: string; copy: string }[] = [
  {
    index: "01",
    tag: "FREE",
    title: "Birth Chart",
    copy: "Map your Sun, Moon, and Rising — the foundation of every reading.",
  },
  {
    index: "02",
    tag: "DAILY",
    title: "Daily Horoscope",
    copy: "Twelve signs, one sky. Clear forecasts without the fluff.",
  },
  {
    index: "03",
    tag: "SYNASTRY",
    title: "Compatibility",
    copy: "Zodiac match, Chinese pairs, and deep synastry for two charts.",
  },
  {
    index: "04",
    tag: "SPREADS",
    title: "Tarot",
    copy: "Daily card to Celtic Cross — pull, reflect, get a full reading.",
  },
  {
    index: "05",
    tag: "TESTS",
    title: "Psychology",
    copy: "MBTI, Big Five, empathy and more — meet yourself beyond the signs.",
  },
  {
    index: "06",
    tag: "YOU",
    title: "Cosmic Passport",
    copy: "Your Cosmic ID, people, journal, and Premium deep dives — one hub.",
  },
];

const FAQ: { no: string; q: string; a: string }[] = [
  {
    no: "A1",
    q: "What can I do for free?",
    a: "The birth chart, daily horoscopes, tarot pulls, and the psychology tests are all free — no account required to begin a reading.",
  },
  {
    no: "A2",
    q: "How do I get my free birth chart?",
    a: "Enter your date, time, and place of birth in the calculator. The chart is drawn at once, with Sun, Moon, and Rising mapped.",
  },
  {
    no: "A3",
    q: "Where are daily horoscopes?",
    a: "On the homepage grid, one plate per sign — or collected together in the Horoscopes hub.",
  },
  {
    no: "A4",
    q: "What is the Destiny Matrix?",
    a: "An optional birth-date octagram. It maps purpose, love, money, and age themes from your birth date alone.",
  },
];

/* ------------------------------------------------------------------ */
/* small parts                                                         */
/* ------------------------------------------------------------------ */

function NodeDot({ className = "", delay = "0s" }: { className?: string; delay?: string }) {
  return (
    <span
      aria-hidden
      style={{ animationDelay: delay }}
      className={`lca-node-breathe pointer-events-none inline-block h-[5px] w-[5px] rounded-full bg-[#e8b45a] shadow-[0_0_8px_2px_rgba(232,180,90,0.55)] ${className}`}
    />
  );
}

function CornerMotif({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 32 32"
      className={`pointer-events-none h-7 w-7 text-[#b97e46] ${className}`}
      fill="none"
    >
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1" opacity="0.9" />
      <path d="M16 9 L22.5 21 H9.5 Z" stroke="currentColor" strokeWidth="1" />
      <circle cx="16" cy="16" r="1.4" fill="#e8b45a" />
    </svg>
  );
}

/* 90° corner trace entering a plate corner; rotated per corner */
function CornerTrace({ rotate = "" }: { rotate?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 40 40"
      className={`pointer-events-none absolute h-10 w-10 text-[#b97e46] ${rotate}`}
      fill="none"
    >
      <path d="M2 38 V14 H26" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      <circle cx="2" cy="38" r="2.2" fill="#0a0e1c" stroke="currentColor" strokeWidth="1" />
      <circle cx="26" cy="14" r="1.6" fill="#e8b45a" />
    </svg>
  );
}

function SectionLabel({ left, right }: { left: string; right: string }) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div className="flex items-center gap-3">
        <NodeDot />
        <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-[#c9965b]">
          {left}
        </span>
      </div>
      <span className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-[#5d6580] sm:block">
        {right}
      </span>
    </div>
  );
}

/* horizontal bus line: trace — node — trace with end vias */
function BusLine({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`flex items-center gap-0 ${className}`}>
      <span className="h-[7px] w-[7px] rounded-full border border-[#b97e46] bg-[#0a0e1c]" />
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#b97e46]/50 to-[#b97e46]/50" />
      <NodeDot />
      <span className="h-px flex-1 bg-gradient-to-r from-[#b97e46]/50 via-[#b97e46]/50 to-transparent" />
      <span className="h-[7px] w-[7px] rounded-full border border-[#b97e46] bg-[#0a0e1c]" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* hero apparatus — the Solar Ascent column                            */
/* ------------------------------------------------------------------ */

function Apparatus() {
  const ticks = Array.from({ length: 36 }, (_, i) => i * 10);
  const rays = Array.from({ length: 16 }, (_, i) => i * 22.5);
  const orbitNodes = Array.from({ length: 8 }, (_, i) => i * 45);
  const frameTrace =
    "M60 26 H170 V42 H270 V26 H384 V120 H368 V240 H384 V560 H368 V620 H240 V636 H120 V620 H60 V440 H44 V300 H60 Z";

  return (
    <div className="relative">
      <svg
        viewBox="0 0 440 680"
        className="h-auto w-full"
        fill="none"
        role="img"
        aria-label="A glowing vertical column of light ringed by orbit circles and ray bursts, framed as a circuit panel"
      >
        <defs>
          <linearGradient id="lca-col-core" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe9b0" />
            <stop offset="0.45" stopColor="#f0a83e" />
            <stop offset="1" stopColor="#e056a0" />
          </linearGradient>
          <linearGradient id="lca-col-glow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f7c35f" stopOpacity="0.85" />
            <stop offset="0.55" stopColor="#f0762b" stopOpacity="0.55" />
            <stop offset="1" stopColor="#e056a0" stopOpacity="0.7" />
          </linearGradient>
          <radialGradient id="lca-halo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffd27a" stopOpacity="0.5" />
            <stop offset="1" stopColor="#ffd27a" stopOpacity="0" />
          </radialGradient>
          <filter id="lca-blur" x="-60%" y="-20%" width="220%" height="140%">
            <feGaussianBlur stdDeviation="13" />
          </filter>
        </defs>

        {/* outer panel */}
        <rect x="8" y="8" width="424" height="664" rx="6" stroke="#b97e46" strokeOpacity="0.7" />
        <rect x="14" y="14" width="412" height="652" rx="4" stroke="#b97e46" strokeOpacity="0.25" />

        {/* inner trace frame with 90° bends */}
        <path d={frameTrace} stroke="#b97e46" strokeOpacity="0.5" strokeWidth="1" />
        <path
          d={frameTrace}
          stroke="#e8b45a"
          strokeOpacity="0.35"
          strokeWidth="1"
          strokeDasharray="2 10"
          className="lca-dash-flow"
        />

        {/* corner triangle-in-circle motifs */}
        {[
          [36, 36],
          [404, 36],
          [36, 644],
          [404, 644],
        ].map(([cx, cy]) => (
          <g key={`${cx}-${cy}`} stroke="#c9965b">
            <circle cx={cx} cy={cy} r="13" strokeOpacity="0.9" />
            <path d={`M${cx} ${cy - 7} L${cx + 6.5} ${cy + 5} H${cx - 6.5} Z`} strokeOpacity="0.9" />
            <circle cx={cx} cy={cy} r="1.4" fill="#e8b45a" stroke="none" />
          </g>
        ))}

        {/* halo behind the column */}
        <ellipse cx="220" cy="350" rx="150" ry="270" fill="url(#lca-halo)" opacity="0.5" />

        {/* ray burst at the crown */}
        <g stroke="#f0c168" strokeOpacity="0.85">
          {rays.map((a) => {
            const long = a % 45 === 0;
            const r1 = 34;
            const r2 = long ? 62 : 48;
            const rad = (a * Math.PI) / 180;
            const x1 = 220 + r1 * Math.cos(rad);
            const y1 = 122 + r1 * Math.sin(rad);
            const x2 = 220 + r2 * Math.cos(rad);
            const y2 = 122 + r2 * Math.sin(rad);
            return (
              <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={long ? 1.4 : 0.8} />
            );
          })}
        </g>
        <circle cx="220" cy="122" r="26" stroke="#f0c168" strokeOpacity="0.9" />
        <circle cx="220" cy="122" r="19" stroke="#f0c168" strokeOpacity="0.4" strokeDasharray="1 4" />
        <circle cx="220" cy="122" r="7" fill="#ffe9b0" />
        <circle cx="220" cy="122" r="12" fill="none" stroke="#ffe9b0" strokeOpacity="0.6" />

        {/* glow + core column of light */}
        <rect
          x="194"
          y="96"
          width="52"
          height="520"
          rx="26"
          fill="url(#lca-col-glow)"
          filter="url(#lca-blur)"
          className="lca-glow-pulse"
        />
        <rect x="210" y="104" width="20" height="504" rx="10" fill="url(#lca-col-core)" />
        <rect x="217" y="116" width="6" height="480" rx="3" fill="#fff3d6" opacity="0.85" />

        {/* orbit rings crossing the column */}
        {[
          [170, 66, 9],
          [250, 96, 13],
          [350, 126, 17],
          [450, 96, 13],
          [540, 66, 9],
        ].map(([cy, rx, ry], i) => (
          <g key={cy}>
            <ellipse cx="220" cy={cy} rx={rx} ry={ry} stroke="#e8b45a" strokeOpacity="0.75" />
            <ellipse
              cx="220"
              cy={cy}
              rx={rx + 9}
              ry={ry + 4}
              stroke="#b97e46"
              strokeOpacity="0.3"
              strokeDasharray="1 5"
            />
            <circle cx={220 - rx} cy={cy} r="2.4" fill={i === 2 ? "#e056a0" : "#e8b45a"} />
            <circle cx={220 + rx} cy={cy} r="2.4" fill="#0a0e1c" stroke="#e8b45a" />
          </g>
        ))}

        {/* slow rotating graduated ring */}
        <g className="lca-spin-160" style={{ transformOrigin: "220px 350px" }}>
          <circle cx="220" cy="350" r="88" stroke="#c9965b" strokeOpacity="0.5" strokeDasharray="1 6" />
          {ticks.map((a) => (
            <line
              key={a}
              x1="220"
              y1="262"
              x2="220"
              y2={a % 90 === 0 ? "268" : "266"}
              stroke="#c9965b"
              strokeOpacity="0.6"
              strokeWidth={a % 90 === 0 ? 1.2 : 0.6}
              transform={`rotate(${a} 220 350)`}
            />
          ))}
        </g>

        {/* counter-rotating node orbit */}
        <g className="lca-spin-240" style={{ transformOrigin: "220px 350px" }}>
          {orbitNodes.map((a) => (
            <circle
              key={a}
              cx="220"
              cy="230"
              r="2.6"
              fill={a % 90 === 0 ? "#e056a0" : "#e8b45a"}
              opacity="0.9"
              transform={`rotate(${a} 220 350)`}
            />
          ))}
        </g>

        {/* side scale ticks + figures */}
        <g stroke="#8a6a44" strokeOpacity="0.7">
          {Array.from({ length: 21 }, (_, i) => (
            <line key={`l${i}`} x1="78" y1={120 + i * 24} x2={i % 5 === 0 ? "94" : "87"} y2={120 + i * 24} />
          ))}
          {Array.from({ length: 21 }, (_, i) => (
            <line key={`r${i}`} x1="362" y1={120 + i * 24} x2={i % 5 === 0 ? "346" : "353"} y2={120 + i * 24} />
          ))}
        </g>
        <g fill="#8a6a44" fontSize="7" fontFamily="ui-monospace, monospace" letterSpacing="1">
          <text x="98" y="124">000</text>
          <text x="98" y="244">120</text>
          <text x="98" y="364">240</text>
          <text x="98" y="604">360</text>
          <text x="322" y="124">ASC</text>
          <text x="322" y="364">MC</text>
          <text x="322" y="604">DSC</text>
        </g>

        {/* silkscreen annotations */}
        <g fill="#c9965b" fontSize="8" fontFamily="ui-monospace, monospace" letterSpacing="3">
          <text x="110" y="70">SOL-ASCENT · COL-01</text>
          <text x="120" y="664" opacity="0.7">LUMEN BUS 3.3V — DO NOT GROUND THE STARS</text>
        </g>

        {/* traveling light along the frame trace */}
        <circle r="3" fill="#ffd27a" className="lca-traveler">
          <animateMotion dur="26s" repeatCount="indefinite" path={frameTrace} />
        </circle>
        <circle r="2" fill="#e056a0" className="lca-traveler" opacity="0.9">
          <animateMotion dur="41s" begin="-17s" repeatCount="indefinite" path={frameTrace} />
        </circle>
      </svg>

      {/* floating DOM corner accents */}
      <CornerMotif className="absolute -left-2 -top-2 opacity-70" />
      <CornerMotif className="absolute -right-2 -top-2 opacity-70" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* page                                                                */
/* ------------------------------------------------------------------ */

export default function CircuitArcanaPage() {
  return (
    <main className="lca-root relative min-h-screen overflow-x-clip bg-[#0a0e1c] font-sans text-[#e9e2d4] antialiased">
      {/* faint board grid + vignette */}
      <div aria-hidden className="lca-board pointer-events-none absolute inset-0" />

      {/* side buses — desktop only */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-5 hidden w-px bg-gradient-to-b from-transparent via-[#b97e46]/35 to-transparent lg:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-5 hidden w-px bg-gradient-to-b from-transparent via-[#b97e46]/35 to-transparent lg:block"
      />

      <style>{LCA_CSS}</style>

      {/* ============================ NAV ============================ */}
      <header className="relative z-10 border-b border-[#b97e46]/25">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
          <a href="#" className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#e8b45a]" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="9" stroke="currentColor" />
              <path d="M12 5.5 L17.5 16 H6.5 Z" stroke="currentColor" />
              <circle cx="12" cy="12" r="1.3" fill="currentColor" />
            </svg>
            <span className="font-mono text-[12px] uppercase tracking-[0.5em] text-[#efe6d8]">
              Astro&nbsp;Scope
            </span>
          </a>
          <nav className="hidden items-center gap-8 font-mono text-[10px] uppercase tracking-[0.32em] text-[#9aa1b5] md:flex">
            <a href="#signs" className="transition-colors hover:text-[#e8b45a]">Horoscopes</a>
            <a href="#modules" className="transition-colors hover:text-[#e8b45a]">Tarot</a>
            <a href="#modules" className="transition-colors hover:text-[#e8b45a]">Compatibility</a>
          </nav>
          <a
            href="#"
            className="border border-[#b97e46]/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#e8b45a] transition-colors hover:bg-[#e8b45a]/10"
          >
            Sign&nbsp;In
          </a>
        </div>
        <BusLine className="mx-auto max-w-6xl px-6 pb-0" />
      </header>

      {/* ============================ HERO ============================ */}
      <section className="relative z-10 mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pt-20">
        <div className="flex flex-col justify-center">
          <div className="mb-8 flex items-center gap-3">
            <NodeDot />
            <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-[#c9965b]">
              Fig. 01 — The Celestial Circuit
            </span>
          </div>

          <h1 className="font-serif text-[44px] leading-[1.04] text-[#f3ead9] sm:text-[56px] lg:text-[64px]">
            The pattern
            <br />
            was <span className="italic text-[#e8b45a]">always</span> there.
          </h1>

          <p className="mt-7 max-w-md text-[15px] leading-relaxed text-[#9aa1b5]">
            Free birth chart, daily horoscopes, synastry and tarot — one instrument
            board, printed against the night sky.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <a
              href="#cta"
              className="group relative border border-[#e8b45a] bg-[#e8b45a] px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.24em] text-[#0a0e1c] transition-colors hover:bg-transparent hover:text-[#e8b45a]"
            >
              Cast your free birth chart
            </a>
            <a
              href="#signs"
              className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#c9965b] underline decoration-[#b97e46]/40 underline-offset-8 transition-colors hover:text-[#e8b45a]"
            >
              Read today&rsquo;s horoscope →
            </a>
          </div>

          <div className="mt-12 flex items-center gap-4 font-mono text-[9px] uppercase tracking-[0.3em] text-[#5d6580]">
            <span>No account</span>
            <span className="h-px w-6 bg-[#b97e46]/40" />
            <span>Three minutes</span>
            <span className="h-px w-6 bg-[#b97e46]/40" />
            <span>Ephemeris grade</span>
          </div>

          {/* degree ruler */}
          <div aria-hidden className="mt-14 hidden max-w-md sm:block">
            <div className="flex items-end justify-between">
              {Array.from({ length: 37 }, (_, i) => (
                <span
                  key={i}
                  className={`w-px ${i % 6 === 0 ? "h-4 bg-[#c9965b]" : i % 3 === 0 ? "h-2.5 bg-[#8a6a44]" : "h-1.5 bg-[#8a6a44]/60"}`}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between font-mono text-[8px] tracking-[0.2em] text-[#5d6580]">
              {["000°", "060°", "120°", "180°", "240°", "300°", "360°"].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[420px]">
          <Apparatus />
        </div>
      </section>

      {/* ============================ SIGN BUS ============================ */}
      <section id="signs" className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <SectionLabel left="The Twelve Gates" right="Zodiac Bus · 30° per gate" />
        <BusLine className="mt-5" />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {SIGNS.map((s, i) => (
            <a
              key={s.name}
              href="#"
              className="group relative border border-[#b97e46]/30 bg-[#0d1226]/70 px-4 py-4 transition-colors hover:border-[#e8b45a]/70"
            >
              <CornerTrace rotate={i % 2 === 0 ? "" : "-scale-x-100"} />
              <div className="flex items-baseline justify-between">
                <span className="text-[20px] leading-none text-[#e8b45a]">{s.glyph}</span>
                <span className="font-mono text-[8px] tracking-[0.2em] text-[#5d6580]">
                  {s.numeral}
                </span>
              </div>
              <div className="mt-3 font-serif text-[15px] text-[#efe6d8]">{s.name}</div>
              <div className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.14em] text-[#8a92a8]">
                {s.dates}
              </div>
              <span className="absolute bottom-2 right-2 h-[5px] w-[5px] rounded-full bg-[#e056a0] opacity-0 shadow-[0_0_8px_2px_rgba(224,86,160,0.6)] transition-opacity duration-500 group-hover:opacity-100" />
            </a>
          ))}
        </div>
        <div className="mt-4 flex justify-between font-mono text-[8px] uppercase tracking-[0.28em] text-[#5d6580]">
          <span>Gate I — Vernal Point</span>
          <span className="hidden sm:inline">Each plate carries one sign of the wheel</span>
          <span>Gate XII — the return</span>
        </div>
      </section>

      {/* ============================ SIX MODULES ============================ */}
      <section id="modules" className="relative z-10 mx-auto max-w-6xl px-6 pb-28">
        <SectionLabel left="Six Instruments" right="Main Board · Modules 01–06" />
        <BusLine className="mt-5" />

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m) => (
            <a
              key={m.index}
              href="#"
              className="group relative flex min-h-[220px] flex-col border border-[#b97e46]/30 bg-[#0d1226]/70 p-7 transition-colors hover:border-[#e8b45a]/70"
            >
              <CornerTrace rotate="" />
              <CornerTrace rotate="-scale-x-100 right-0" />
              <CornerTrace rotate="-scale-y-100 bottom-0" />
              <CornerTrace rotate="-scale-100 bottom-0 right-0" />

              <div className="flex items-center justify-between">
                <span className="font-mono text-[22px] font-light text-[#b97e46]/70">{m.index}</span>
                <span className="border border-[#b97e46]/40 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.3em] text-[#c9965b]">
                  {m.tag}
                </span>
              </div>

              <h3 className="mt-6 font-serif text-[24px] text-[#f3ead9]">{m.title}</h3>
              <p className="mt-3 max-w-[34ch] text-[13px] leading-relaxed text-[#9aa1b5]">
                {m.copy}
              </p>

              <div className="mt-auto flex items-center justify-between pt-7">
                <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-[#c9965b] transition-colors group-hover:text-[#e8b45a]">
                  Explore →
                </span>
                <span className="h-[6px] w-[6px] rounded-full bg-[#e8b45a] opacity-0 shadow-[0_0_10px_3px_rgba(232,180,90,0.7)] transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ============================ DESTINY MATRIX ============================ */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-28">
        <SectionLabel left="Optional Module" right="DMX-22 · Socketed" />
        <BusLine className="mt-5" />

        <div className="mt-12 flex items-stretch justify-center">
          {/* left pins */}
          <div aria-hidden className="hidden flex-col justify-between py-6 sm:flex">
            {["P1", "P2", "P3", "P4"].map((p) => (
              <div key={p} className="flex items-center gap-2">
                <span className="font-mono text-[8px] tracking-[0.2em] text-[#5d6580]">{p}</span>
                <span className="h-[5px] w-10 bg-gradient-to-r from-transparent to-[#b97e46]/70" />
              </div>
            ))}
          </div>

          {/* chip package */}
          <div className="relative mx-0 max-w-2xl flex-1 border border-[#b97e46]/50 bg-[#0d1226] px-8 py-12 text-center sm:mx-4 sm:px-14">
            <CornerTrace rotate="" />
            <CornerTrace rotate="-scale-x-100 right-0" />
            <CornerTrace rotate="-scale-y-100 bottom-0" />
            <CornerTrace rotate="-scale-100 bottom-0 right-0" />
            <div className="absolute left-1/2 top-0 h-3 w-10 -translate-x-1/2 -translate-y-px rounded-b-full border border-t-0 border-[#b97e46]/50" />

            <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#c9965b]">
              Destiny Matrix
            </div>
            <p className="mx-auto mt-5 max-w-md font-serif text-[19px] leading-relaxed text-[#efe6d8]">
              An optional birth-date octagram tool. It maps purpose, love, money,
              and age themes from your birth date.
            </p>
            <a
              href="#"
              className="mt-8 inline-block border border-[#e8b45a]/70 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.26em] text-[#e8b45a] transition-colors hover:bg-[#e8b45a]/10"
            >
              Open Destiny Matrix →
            </a>
            <div className="mt-9 font-mono text-[8px] uppercase tracking-[0.3em] text-[#5d6580]">
              Birth-date octagram · eight houses · optional
            </div>
          </div>

          {/* right pins */}
          <div aria-hidden className="hidden flex-col justify-between py-6 sm:flex">
            {["P5", "P6", "P7", "P8"].map((p) => (
              <div key={p} className="flex items-center gap-2">
                <span className="h-[5px] w-10 bg-gradient-to-l from-transparent to-[#b97e46]/70" />
                <span className="font-mono text-[8px] tracking-[0.2em] text-[#5d6580]">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ FAQ ============================ */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-28">
        <SectionLabel left="Service Notes" right="Printed Annotations · Rev. C" />
        <BusLine className="mt-5" />

        <div className="mt-12 grid gap-x-16 gap-y-12 lg:grid-cols-2">
          {FAQ.map((f, i) => (
            <div key={f.no} className={i % 2 === 1 ? "lg:mt-14" : ""}>
              <div className="flex items-center gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#b97e46]/60 font-mono text-[9px] tracking-[0.1em] text-[#e8b45a]">
                  {f.no}
                </span>
                <span aria-hidden className="h-px w-10 bg-[#b97e46]/40" />
                <h3 className="font-serif text-[18px] text-[#f3ead9]">{f.q}</h3>
              </div>
              <p className="mt-4 max-w-[52ch] border-l border-[#b97e46]/25 pl-5 text-[12.5px] leading-relaxed text-[#9aa1b5]">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ CTA ============================ */}
      <section id="cta" className="relative z-10 mx-auto max-w-6xl px-6 pb-28">
        <div className="relative border border-[#b97e46]/50 bg-[#0d1226]/80 px-8 py-16 text-center sm:px-16">
          <CornerMotif className="absolute left-3 top-3" />
          <CornerMotif className="absolute right-3 top-3" />
          <CornerMotif className="absolute bottom-3 left-3" />
          <CornerMotif className="absolute bottom-3 right-3" />

          <div className="font-mono text-[9px] uppercase tracking-[0.42em] text-[#c9965b]">
            Final Assembly
          </div>
          <h2 className="mx-auto mt-6 max-w-2xl font-serif text-[30px] leading-snug text-[#f3ead9] sm:text-[38px]">
            Your chart is written in the stars.{" "}
            <span className="italic text-[#e8b45a]">Come read it.</span>
          </h2>
          <a
            href="#"
            className="mt-10 inline-block border border-[#e8b45a] bg-[#e8b45a] px-9 py-4 font-mono text-[11px] uppercase tracking-[0.26em] text-[#0a0e1c] transition-colors hover:bg-transparent hover:text-[#e8b45a]"
          >
            Get started — it&rsquo;s free
          </a>
          <div className="mt-9 flex items-center justify-center gap-4 font-mono text-[8px] uppercase tracking-[0.3em] text-[#5d6580]">
            <NodeDot />
            <span>Signal acquired · the sky is already transmitting</span>
            <NodeDot delay="6s" />
          </div>
        </div>
      </section>

      {/* ============================ FOOTER ============================ */}
      <footer className="relative z-10 border-t border-[#b97e46]/25">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-3">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.5em] text-[#efe6d8]">
              Astro&nbsp;Scope
            </div>
            <p className="mt-4 max-w-[30ch] font-mono text-[9px] uppercase leading-relaxed tracking-[0.22em] text-[#5d6580]">
              A mystical instrument board for the
              serious seeker · assembled under a
              waxing moon
            </p>
          </div>
          <div className="flex gap-14 font-mono text-[9px] uppercase tracking-[0.26em] text-[#8a92a8]">
            <div className="flex flex-col gap-3">
              <span className="text-[#c9965b]">Board</span>
              <a href="#signs" className="hover:text-[#e8b45a]">Horoscopes</a>
              <a href="#modules" className="hover:text-[#e8b45a]">Tarot</a>
              <a href="#modules" className="hover:text-[#e8b45a]">Compatibility</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-[#c9965b]">Service</span>
              <a href="#" className="hover:text-[#e8b45a]">Sign In</a>
              <a href="#" className="hover:text-[#e8b45a]">Premium</a>
              <a href="#" className="hover:text-[#e8b45a]">Support</a>
            </div>
          </div>
          <div className="font-mono text-[8px] uppercase leading-loose tracking-[0.24em] text-[#5d6580] sm:text-right">
            <div>rev. MMXXVI · silkscreen layer</div>
            <div>astro scope pcb · eph. j2000.0</div>
            <div>copper 1oz · gold immersion</div>
            <div className="mt-3 text-[#8a6a44]">☉︎ ☽︎ — keep away from daylight saving</div>
          </div>
        </div>
        <BusLine className="mx-auto max-w-6xl px-6 pb-6" />
      </footer>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* scoped styles                                                       */
/* ------------------------------------------------------------------ */

const LCA_CSS = `
  .lca-board {
    background-image:
      radial-gradient(circle at 1px 1px, rgba(185,126,70,0.14) 1px, transparent 1.6px),
      radial-gradient(ellipse 90% 60% at 50% -10%, rgba(240,118,43,0.07), transparent),
      radial-gradient(ellipse 70% 50% at 50% 115%, rgba(224,86,160,0.06), transparent);
    background-size: 34px 34px, 100% 100%, 100% 100%;
  }

  @keyframes lca-kf-pulse {
    0%, 100% { opacity: 0.45; }
    50% { opacity: 0.95; }
  }
  @keyframes lca-kf-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes lca-kf-spin-rev {
    from { transform: rotate(360deg); }
    to { transform: rotate(0deg); }
  }
  @keyframes lca-kf-dash {
    from { stroke-dashoffset: 0; }
    to { stroke-dashoffset: -120; }
  }
  @keyframes lca-kf-node {
    0%, 100% { opacity: 0.55; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.35); }
  }

  @media (prefers-reduced-motion: no-preference) {
    .lca-glow-pulse { animation: lca-kf-pulse 24s ease-in-out infinite; }
    .lca-spin-160 { animation: lca-kf-spin 160s linear infinite; }
    .lca-spin-240 { animation: lca-kf-spin-rev 240s linear infinite; }
    .lca-dash-flow { animation: lca-kf-dash 36s linear infinite; }
    .lca-node-breathe { animation: lca-kf-node 18s ease-in-out infinite; }
  }

  @media (prefers-reduced-motion: reduce) {
    .lca-traveler { display: none; }
    .lca-root * { animation: none !important; }
  }
`;
