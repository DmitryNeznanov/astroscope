import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Astro Scope — The Living Cosmos",
  description:
    "An alchemical codex of the living sky: free birth chart, daily horoscopes, synastry, tarot and the destiny octagram. As above — so below.",
};

/* ------------------------------------------------------------------ */
/* Palette                                                             */
/* ------------------------------------------------------------------ */
const GOLD = "#c9b037";
const GOLD_DIM = "#8f7f2a";
const VERDI = "#3fa37c";
const CREAM = "#e6e0c8";
const GROUND = "#06120c";
const PLATE = "#0a1a12";

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                    */
/* ------------------------------------------------------------------ */
const MC = 400; // mandala centre
const rad = (deg: number) => (deg * Math.PI) / 180;
const pt = (r: number, deg: number) => ({
  x: Math.round((MC + r * Math.cos(rad(deg))) * 100) / 100,
  y: Math.round((MC + r * Math.sin(rad(deg))) * 100) / 100,
});
const poly = (r: number, nPts: number, start: number, cx = MC, cy = MC) =>
  Array.from({ length: nPts }, (_, i) => {
    const a = rad(start + (360 / nPts) * i);
    return `${Math.round((cx + r * Math.cos(a)) * 100) / 100},${
      Math.round((cy + r * Math.sin(a)) * 100) / 100
    }`;
  }).join(" ");

const wavePath = (w: number, h: number, cycles: number, amp: number) =>
  Array.from({ length: 49 }, (_, i) => {
    const x = (i / 48) * w;
    const y = h / 2 + Math.sin((i / 48) * Math.PI * 2 * cycles) * amp;
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */
const ZODIAC = [
  { name: "ARIES", glyph: "♈︎", dates: "MAR 21 – APR 19" },
  { name: "TAURUS", glyph: "♉︎", dates: "APR 20 – MAY 20" },
  { name: "GEMINI", glyph: "♊︎", dates: "MAY 21 – JUN 20" },
  { name: "CANCER", glyph: "♋︎", dates: "JUN 21 – JUL 22" },
  { name: "LEO", glyph: "♌︎", dates: "JUL 23 – AUG 22" },
  { name: "VIRGO", glyph: "♍︎", dates: "AUG 23 – SEP 22" },
  { name: "LIBRA", glyph: "♎︎", dates: "SEP 23 – OCT 22" },
  { name: "SCORPIO", glyph: "♏︎", dates: "OCT 23 – NOV 21" },
  { name: "SAGITTARIUS", glyph: "♐︎", dates: "NOV 22 – DEC 21" },
  { name: "CAPRICORN", glyph: "♑︎", dates: "DEC 22 – JAN 19" },
  { name: "AQUARIUS", glyph: "♒︎", dates: "JAN 20 – FEB 18" },
  { name: "PISCES", glyph: "♓︎", dates: "FEB 19 – MAR 20" },
];

const ETHER = [
  { no: "01", term: "AETHER", note: "the fifth essence, breath of stars" },
  { no: "02", term: "MANIFEST", note: "bring the unseen into being" },
  { no: "03", term: "TRANSMUTE", note: "turn the base into gold" },
  { no: "04", term: "SUSTAIN", note: "hold the form against time" },
  { no: "05", term: "DISSOLVE", note: "return all to the source" },
];

const ELEMENTS = [
  { sym: "△", latin: "IGNIS", eng: "Fire", virtue: "will · spark", v: "33%" },
  { sym: "▲", latin: "AER", eng: "Air", virtue: "mind · breath", v: "27%" },
  { sym: "▽", latin: "AQUA", eng: "Water", virtue: "feeling · tide", v: "21%" },
  { sym: "▼", latin: "TERRA", eng: "Earth", virtue: "body · root", v: "14%" },
  { sym: "✦", latin: "QUINTA ESSENTIA", eng: "Quintessence", virtue: "spirit · axis", v: "5%" },
];

const RITUAL = [
  { no: "I", step: "COMMENCE", note: "set the intent, still the hand" },
  { no: "II", step: "CAST", note: "date · hour · place — the wheel turns" },
  { no: "III", step: "CHARGE", note: "read the aspects, name the houses" },
  { no: "IV", step: "SEAL", note: "write the omen in the journal" },
  { no: "V", step: "RELEASE", note: "let the sky carry the rest" },
];

const GEOMETRY = [
  { name: "CIRCLE", note: "unity, the infinite", kind: "circle" },
  { name: "TRIANGLE", note: "fire, ascension", kind: "triangle" },
  { name: "HEXAGRAM", note: "union of above & below", kind: "hexagram" },
  { name: "SPIRAL", note: "growth, returning", kind: "spiral" },
  { name: "SQUARE", note: "earth, the four corners", kind: "square" },
  { name: "VESICA", note: "the portal between", kind: "vesica" },
];

const ALCHEMY = [
  { glyph: "☉︎", body: "SOL", metal: "GOLD", note: "perfection, the heart" },
  { glyph: "☽︎", body: "LUNA", metal: "SILVER", note: "reflection, the tide" },
  { glyph: "☿︎", body: "MERCURIUS", metal: "QUICKSILVER", note: "the messenger, flux" },
  { glyph: "♀︎", body: "VENUS", metal: "COPPER", note: "harmony, the mirror" },
  { glyph: "♂︎", body: "MARS", metal: "IRON", note: "the blade, drive" },
  { glyph: "♃︎", body: "JUPITER", metal: "TIN", note: "expansion, law" },
  { glyph: "♄︎", body: "SATURN", metal: "LEAD", note: "time, the threshold" },
];

type Phase = { name: string; shadowX: number | null; half: "left" | "right" | null };

const PHASES: Phase[] = [
  { name: "NEW", shadowX: 0, half: null },
  { name: "WAX. CRESC.", shadowX: -4, half: null },
  { name: "1ST QTR", shadowX: null, half: "left" },
  { name: "WAX. GIB.", shadowX: -6.5, half: null },
  { name: "FULL", shadowX: null, half: null },
  { name: "WAN. GIB.", shadowX: 6.5, half: null },
  { name: "LAST QTR", shadowX: null, half: "right" },
  { name: "WAN. CRESC.", shadowX: 4, half: null },
];

const VEINS = [
  { name: "SOLAR WIND", val: "432.0 HZ", cycles: 6, amp: 5 },
  { name: "LUNAR TIDE", val: "29.53 D", cycles: 3, amp: 7 },
  { name: "MERCURY LOOP", val: "88.0 D", cycles: 9, amp: 4 },
  { name: "VENUS ROSE", val: "584 D", cycles: 5, amp: 6 },
];

const LAYERS = [
  { name: "ASTRAL", note: "the dream-body, silver cord", d: "R.07" },
  { name: "CAUSAL", note: "karma, seed of events", d: "R.05" },
  { name: "MENTAL", note: "thought, the architect", d: "R.03" },
  { name: "ETHERIC", note: "vital current, the double", d: "R.02" },
  { name: "PHYSICAL", note: "flesh, the last veil", d: "R.01" },
];

const ARCANE = [
  { f: "Φ = (1 + √5) / 2", v: "1.618 033 988" },
  { f: "T = 2π · √(L / G)", v: "period of the pendulum" },
  { f: "☉︎ + ☽︎ → ASC", v: "lights conjoined at birth" },
  { f: "Δ = MC − IC", v: "axis of the meridian" },
];

const CORE_FORMULAE = [
  { name: "MANIFESTATION", formula: "I + E + A = R", note: "Intent + Energy + Action → Result" },
  { name: "TRANSMUTATION", formula: "S + M + W = T", note: "Solve + Manus + Will → Transmutatio" },
  { name: "PROTECTION", formula: "△ + ☉︎ + ▽ = ◎", note: "Fire + Sun + Water → the sealed circle" },
  { name: "ASCENSION", formula: "E + V + D = ∞", note: "Ether + Virtue + Devotio → the infinite" },
];

const CONSTANTS = [
  { k: "Φ", v: "1.618" },
  { k: "π", v: "3.14159" },
  { k: "YEAR", v: "365.25 D" },
  { k: "SYNODIC", v: "29.53 D" },
  { k: "SIGNS", v: "12" },
  { k: "WANDERERS", v: "7" },
  { k: "CIRCLE", v: "360°" },
  { k: "HOUSES", v: "12" },
];

const SECTIONS = [
  {
    no: "OP. I",
    kicker: "FREE",
    title: "Birth Chart",
    copy: "Map your Sun, Moon, and Rising — the foundation of every reading.",
  },
  {
    no: "OP. II",
    kicker: "DAILY",
    title: "Daily Horoscope",
    copy: "Twelve signs, one sky. Clear forecasts without the fluff.",
  },
  {
    no: "OP. III",
    kicker: "SYNASTRY",
    title: "Compatibility",
    copy: "Zodiac match, Chinese pairs, and deep synastry for two charts.",
  },
  {
    no: "OP. IV",
    kicker: "SPREADS",
    title: "Tarot",
    copy: "Daily card to Celtic Cross — pull, reflect, get a full reading.",
  },
  {
    no: "OP. V",
    kicker: "TESTS",
    title: "Psychology",
    copy: "MBTI, Big Five, empathy and more — meet yourself beyond the signs.",
  },
  {
    no: "OP. VI",
    kicker: "YOU",
    title: "Cosmic Passport",
    copy: "Your Cosmic ID, people, journal, and Premium deep dives — one hub.",
  },
];

const FAQ = [
  {
    q: "Which operations are free?",
    a: "The birth chart, the daily horoscope, tarot pulls and the psychology tests are free. Premium adds deeper reports, saved charts and the full synastry apparatus.",
  },
  {
    q: "How do I cast a chart?",
    a: "Enter your date, hour and place of birth. The wheel computes the houses, aspects and dignities itself — no knowledge of the art required.",
  },
  {
    q: "Where do the horoscopes live?",
    a: "In the Daily section — twelve signs beneath one sky, refreshed each morning, written plainly and without the fluff.",
  },
  {
    q: "What is the Destiny Matrix?",
    a: "An optional birth-date octagram. It maps purpose, love, money and the themes of each age from the numbers of your birth date.",
  },
];

/* ------------------------------------------------------------------ */
/* Scoped styles (llc- prefix)                                         */
/* ------------------------------------------------------------------ */
const LLC_STYLES = `
  .llc-rot-45  { animation: llc-spin 45s  linear infinite; }
  .llc-rot-60r { animation: llc-spin-rev 60s linear infinite; }
  .llc-rot-90  { animation: llc-spin 90s  linear infinite; }
  .llc-rot-120r{ animation: llc-spin-rev 120s linear infinite; }
  .llc-rot-180 { animation: llc-spin 180s linear infinite; }
  .llc-pulse   { animation: llc-pulse 7s ease-in-out infinite; }
  .llc-pulse-2 { animation: llc-pulse 11s ease-in-out infinite; }
  .llc-flicker { animation: llc-flicker 9s ease-in-out infinite; }
  @keyframes llc-spin     { to { transform: rotate(360deg); } }
  @keyframes llc-spin-rev { to { transform: rotate(-360deg); } }
  @keyframes llc-pulse    { 0%,100% { opacity: .45; } 50% { opacity: 1; } }
  @keyframes llc-flicker  { 0%,100% { opacity: .9; } 47% { opacity: .55; } 53% { opacity: .8; } }

  /* ---- age layer: vellum, foxing, worn gilding, candlelight ---- */
  .llc-aged { position: relative; }
  .llc-aged::before {
    content: ""; position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(7px 5px at 12% 18%, rgba(122,90,43,.20), transparent 70%),
      radial-gradient(4px 4px at 86% 12%, rgba(110,95,50,.18), transparent 70%),
      radial-gradient(9px 6px at 78% 84%, rgba(96,80,40,.16), transparent 70%),
      radial-gradient(3px 3px at 30% 88%, rgba(122,90,43,.22), transparent 70%),
      radial-gradient(5px 4px at 55% 42%, rgba(90,105,60,.10), transparent 70%);
    filter: blur(.6px);
  }
  .llc-aged:nth-child(2n)::before   { transform: scaleX(-1); }
  .llc-aged:nth-child(3n)::before   { transform: scaleY(-1); }
  .llc-aged:nth-child(3n+1)::before { transform: scale(-1,-1); }
  .llc-bleed {
    box-shadow: 0 0 2.5px rgba(201,176,55,.5), 0 0 6px rgba(201,176,55,.22);
    filter: blur(.3px);
  }
  .llc-worn {
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.09' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0.35 0.35 0.35 0 0.5'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23w)'/%3E%3C/svg%3E");
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.09' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0.35 0.35 0.35 0 0.5'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23w)'/%3E%3C/svg%3E");
    -webkit-mask-size: 180px 180px;
    mask-size: 180px 180px;
  }
  .llc-fiber {
    position: fixed; inset: 0; z-index: 40; pointer-events: none;
    opacity: .055; mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.9 0 0 0 0 0.85 0 0 0 0 0.62 0 0 0 0.6 0'/%3E%3C/filter%3E%3Crect width='260' height='260' filter='url(%23f)'/%3E%3C/svg%3E");
    background-size: 260px 260px;
  }
  .llc-stain {
    border-radius: 9999px;
    background: repeating-radial-gradient(ellipse 42% 38% at 50% 50%,
      transparent 0 12px, rgba(120,88,44,.16) 12px 13.5px,
      transparent 13.5px 24px, rgba(120,88,44,.11) 24px 25px,
      transparent 25px 37px, rgba(120,88,44,.08) 37px 38.5px,
      transparent 38.5px 120px);
    filter: blur(.8px);
  }
  .llc-hole {
    position: absolute; border-radius: 9999px;
    background: #020a05;
    box-shadow: 0 0 1.5px .8px rgba(120,90,50,.4), inset 0 0 1px rgba(0,0,0,.9);
  }
  .llc-candle {
    position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 55% 75% at 3% 42%, rgba(255,176,86,.07), rgba(255,176,86,.02) 45%, transparent 70%),
      radial-gradient(ellipse 40% 55% at 98% 96%, rgba(255,190,100,.03), transparent 65%);
    animation: llc-candle 14s ease-in-out infinite;
  }
  @keyframes llc-candle {
    0%,100% { opacity: .55; } 18% { opacity: .8; } 41% { opacity: .6; }
    63% { opacity: .95; } 82% { opacity: .7; }
  }
  .llc-specks {
    background-image:
      radial-gradient(1.3px 1.3px at 7% 14%,  rgba(230,224,200,.55), transparent 60%),
      radial-gradient(1px 1px at 19% 63%,     rgba(230,224,200,.4),  transparent 60%),
      radial-gradient(1.6px 1.6px at 27% 38%, rgba(201,176,55,.5),   transparent 60%),
      radial-gradient(1px 1px at 34% 81%,     rgba(230,224,200,.35), transparent 60%),
      radial-gradient(1.2px 1.2px at 41% 9%,  rgba(63,163,124,.55),  transparent 60%),
      radial-gradient(1px 1px at 49% 55%,     rgba(230,224,200,.45), transparent 60%),
      radial-gradient(1.4px 1.4px at 56% 29%, rgba(201,176,55,.4),   transparent 60%),
      radial-gradient(1px 1px at 63% 71%,     rgba(230,224,200,.4),  transparent 60%),
      radial-gradient(1.2px 1.2px at 70% 17%, rgba(230,224,200,.5),  transparent 60%),
      radial-gradient(1px 1px at 77% 47%,     rgba(63,163,124,.45),  transparent 60%),
      radial-gradient(1.5px 1.5px at 84% 88%, rgba(230,224,200,.4),  transparent 60%),
      radial-gradient(1px 1px at 91% 33%,     rgba(201,176,55,.5),   transparent 60%),
      radial-gradient(1.2px 1.2px at 96% 59%, rgba(230,224,200,.35), transparent 60%),
      radial-gradient(1px 1px at 13% 91%,     rgba(230,224,200,.4),  transparent 60%),
      radial-gradient(1.4px 1.4px at 22% 4%,  rgba(201,176,55,.35),  transparent 60%),
      radial-gradient(1px 1px at 45% 94%,     rgba(63,163,124,.5),   transparent 60%),
      radial-gradient(1.3px 1.3px at 66% 5%,  rgba(230,224,200,.45), transparent 60%),
      radial-gradient(1px 1px at 88% 72%,     rgba(230,224,200,.35), transparent 60%),
      radial-gradient(1.2px 1.2px at 3% 46%,  rgba(201,176,55,.45),  transparent 60%),
      radial-gradient(1px 1px at 52% 42%,     rgba(230,224,200,.3),  transparent 60%);
    opacity: .4;
  }
  @media (prefers-reduced-motion: reduce) {
    .llc-rot-45, .llc-rot-60r, .llc-rot-90, .llc-rot-120r, .llc-rot-180,
    .llc-pulse, .llc-pulse-2, .llc-flicker, .llc-candle { animation: none !important; }
  }
`;

/* ------------------------------------------------------------------ */
/* Age marks: wormhole pinpricks, water-stain rings, candle warmth     */
/* ------------------------------------------------------------------ */
const PINPRICKS: { l: string; t: string; s: number }[] = [
  { l: "1.2%", t: "7%", s: 2.5 },
  { l: "0.6%", t: "21%", s: 1.5 },
  { l: "1.8%", t: "34%", s: 2 },
  { l: "0.8%", t: "52%", s: 3 },
  { l: "1.4%", t: "68%", s: 1.5 },
  { l: "0.5%", t: "83%", s: 2.5 },
  { l: "98.6%", t: "11%", s: 2 },
  { l: "99.1%", t: "27%", s: 3 },
  { l: "98.2%", t: "44%", s: 1.5 },
  { l: "99.3%", t: "61%", s: 2.5 },
  { l: "98.7%", t: "76%", s: 1.5 },
  { l: "99.0%", t: "90%", s: 2 },
  { l: "14%", t: "0.8%", s: 2 },
  { l: "71%", t: "99.1%", s: 2.5 },
];

function AgeOverlay() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      <div className="llc-candle" />
      <div className="llc-stain absolute -bottom-10 -right-8 h-44 w-44 opacity-70" />
      <div className="llc-stain absolute right-24 top-[38%] hidden h-28 w-28 opacity-50 md:block" />
      <div className="llc-stain absolute -left-6 top-[64%] hidden h-32 w-32 opacity-40 lg:block" />
      {PINPRICKS.map((p, i) => (
        <span
          key={i}
          className="llc-hole"
          style={{ left: p.l, top: p.t, width: p.s, height: p.s }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Deep background: arcs, construction circles, glyphs, geometry       */
/* ------------------------------------------------------------------ */
function CosmosBackdrop() {
  const radii = Array.from({ length: 12 }, (_, i) => {
    const a = rad(i * 30);
    return {
      key: i,
      x2: Math.round((500 + 490 * Math.cos(a)) * 10) / 10,
      y2: Math.round((500 + 490 * Math.sin(a)) * 10) / 10,
    };
  });
  const fol = Array.from({ length: 6 }, (_, i) => {
    const a = rad(i * 60);
    return {
      key: i,
      cx: Math.round((200 + 60 * Math.cos(a)) * 10) / 10,
      cy: Math.round((200 + 60 * Math.sin(a)) * 10) / 10,
    };
  });
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* giant arcs spanning the page, mostly off-screen top */}
      <svg
        className="absolute left-1/2 top-[-55vmax] h-[140vmax] w-[140vmax] -translate-x-1/2 opacity-[0.07]"
        viewBox="0 0 1000 1000"
      >
        <g fill="none" stroke={GOLD} strokeWidth="0.7">
          <circle cx="500" cy="500" r="490" strokeOpacity="0.5" />
          <circle cx="500" cy="500" r="430" strokeOpacity="0.35" strokeDasharray="3 6" />
          <circle cx="500" cy="500" r="330" stroke={VERDI} strokeOpacity="0.45" />
          <circle cx="500" cy="500" r="240" strokeOpacity="0.25" strokeDasharray="1 5" />
          <polygon points="500,20 85,740 915,740" strokeOpacity="0.3" />
          <polygon points="500,980 85,260 915,260" strokeOpacity="0.3" />
          {radii.map((r) => (
            <line key={r.key} x1="500" y1="500" x2={r.x2} y2={r.y2} strokeOpacity="0.18" />
          ))}
        </g>
      </svg>

      {/* hairline construction circles + chords, full page */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.05]"
        viewBox="0 0 1600 2400"
        preserveAspectRatio="xMidYMid slice"
      >
        <g fill="none" strokeWidth="0.8">
          <circle cx="180" cy="420" r="700" stroke={GOLD} strokeOpacity="0.6" />
          <circle cx="1440" cy="880" r="820" stroke={VERDI} strokeOpacity="0.55" />
          <circle cx="820" cy="2050" r="940" stroke={GOLD} strokeOpacity="0.5" />
          <circle cx="1440" cy="880" r="410" stroke={GOLD} strokeOpacity="0.4" strokeDasharray="4 7" />
          <circle cx="180" cy="420" r="350" stroke={VERDI} strokeOpacity="0.4" strokeDasharray="2 6" />
          <line x1="-40" y1="1700" x2="1640" y2="240" stroke={GOLD} strokeOpacity="0.45" />
          <line x1="-60" y1="640" x2="1660" y2="1520" stroke={VERDI} strokeOpacity="0.4" />
          <line x1="330" y1="-40" x2="1180" y2="2440" stroke={GOLD} strokeOpacity="0.3" />
          <line x1="-40" y1="1700" x2="1440" y2="880" stroke={GOLD} strokeOpacity="0.35" />
          <line x1="180" y1="420" x2="820" y2="2050" stroke={VERDI} strokeOpacity="0.35" />
        </g>
      </svg>

      {/* giant slowly-rotating sacred geometry, bleeding off the right edge */}
      <svg
        className="llc-rot-180 absolute -right-[22vmin] top-[22%] h-[80vmin] w-[80vmin] opacity-[0.08]"
        viewBox="0 0 400 400"
      >
        <g fill="none" stroke={GOLD} strokeWidth="0.8">
          <circle cx="200" cy="200" r="130" strokeOpacity="0.6" />
          <circle cx="200" cy="200" r="60" />
          {fol.map((c) => (
            <circle key={c.key} cx={c.cx} cy={c.cy} r="60" strokeOpacity="0.8" />
          ))}
          <polygon points={poly(126, 3, -90, 200, 200)} stroke={VERDI} strokeOpacity="0.7" />
          <polygon points={poly(126, 3, 90, 200, 200)} stroke={VERDI} strokeOpacity="0.7" />
        </g>
      </svg>

      {/* counter-rotating octagram wheel, bleeding off the lower-left edge */}
      <svg
        className="llc-rot-120r absolute -left-[18vmin] bottom-[5%] h-[64vmin] w-[64vmin] opacity-[0.06]"
        viewBox="0 0 400 400"
      >
        <g fill="none" stroke={VERDI} strokeWidth="0.8">
          <circle cx="200" cy="200" r="150" />
          <circle cx="200" cy="200" r="110" strokeDasharray="3 5" />
          <polygon points={poly(150, 4, -90, 200, 200)} stroke={GOLD} strokeOpacity="0.8" />
          <polygon points={poly(150, 4, -45, 200, 200)} stroke={GOLD} strokeOpacity="0.8" />
          {Array.from({ length: 8 }, (_, i) => {
            const a = rad(i * 45);
            return (
              <line
                key={i}
                x1={200 + 110 * Math.cos(a)}
                y1={200 + 110 * Math.sin(a)}
                x2={200 + 150 * Math.cos(a)}
                y2={200 + 150 * Math.sin(a)}
                strokeOpacity="0.7"
              />
            );
          })}
        </g>
      </svg>

      {/* huge faint glyphs behind the panels */}
      <span className="absolute left-[5%] top-[10%] select-none text-[9rem] leading-none text-[#c9b037] opacity-[0.05] md:text-[24rem]">
        ☉︎
      </span>
      <span className="absolute right-[3%] top-[48%] select-none -rotate-12 text-[8rem] leading-none text-[#3fa37c] opacity-[0.05] md:text-[20rem]">
        ♄︎
      </span>
      <span className="absolute bottom-[3%] left-[36%] select-none rotate-6 text-[7rem] leading-none text-[#c9b037] opacity-[0.04] md:text-[17rem]">
        ✦
      </span>
      <span className="absolute left-[46%] top-[64%] hidden select-none -rotate-6 text-[13rem] leading-none text-[#3fa37c] opacity-[0.035] lg:block">
        ☽︎
      </span>

      {/* star specks */}
      <div className="llc-specks absolute inset-0" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */
function Corners() {
  const base = "pointer-events-none absolute h-3 w-3 border-[#c9b037]/70";
  return (
    <>
      <span aria-hidden className={`${base} -left-[4px] -top-[4px] border-l border-t`} />
      <span aria-hidden className={`${base} -right-[4px] -top-[4px] border-r border-t`} />
      <span aria-hidden className={`${base} -bottom-[4px] -left-[4px] border-b border-l`} />
      <span aria-hidden className={`${base} -bottom-[4px] -right-[4px] border-b border-r`} />
    </>
  );
}

function PanelHeader({ title, tag }: { title: string; tag?: string }) {
  return (
    <header className="mb-2 flex items-center gap-2">
      <span className="llc-bleed h-px w-3 bg-[#c9b037]/50" />
      <span aria-hidden className="text-[7px] text-[#c9b037]/80">◆</span>
      <h3 className="llc-worn font-mono text-[9px] font-semibold tracking-[0.35em] text-[#c9b037]">
        {title}
      </h3>
      <span aria-hidden className="text-[7px] text-[#c9b037]/80">◆</span>
      <span className="llc-bleed h-px flex-1 bg-[#c9b037]/30" />
      {tag ? (
        <span className="font-mono text-[7px] tracking-[0.25em] text-[#3fa37c]/80">{tag}</span>
      ) : null}
    </header>
  );
}

function Panel({
  title,
  tag,
  children,
  className = "",
}: {
  title: string;
  tag?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`llc-aged relative border border-[#c9b037]/25 bg-[#0a1a12]/70 p-3 ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[3px] border border-[#c9b037]/10"
      />
      <Corners />
      <PanelHeader title={title} tag={tag} />
      {children}
    </section>
  );
}

function GeoIcon({ kind }: { kind: string }) {
  const s = { stroke: GOLD, strokeWidth: 1, fill: "none" };
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden>
      {kind === "circle" && <circle cx="12" cy="12" r="8" {...s} />}
      {kind === "triangle" && <polygon points="12,4 20,19 4,19" {...s} />}
      {kind === "hexagram" && (
        <g {...s}>
          <polygon points="12,4 19,16 5,16" />
          <polygon points="12,20 19,8 5,8" />
        </g>
      )}
      {kind === "spiral" && (
        <path
          d="M12 12 m0 -1 a1 1 0 0 1 1 1 a2.5 2.5 0 0 1 -2.5 2.5 a4.5 4.5 0 0 1 -4.5 -4.5 a7 7 0 0 1 7 -7 a9.5 9.5 0 0 1 9.5 9.5"
          {...s}
        />
      )}
      {kind === "square" && <rect x="5" y="5" width="14" height="14" {...s} />}
      {kind === "vesica" && (
        <g {...s}>
          <circle cx="9" cy="12" r="6" />
          <circle cx="15" cy="12" r="6" />
        </g>
      )}
    </svg>
  );
}

function MoonPhase({ shadowX, half, name }: Phase) {
  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden>
        <circle cx="10" cy="10" r="7" fill={GOLD} opacity="0.9" />
        {shadowX !== null && (
          <circle cx={10 + shadowX} cy="10" r="7" fill={PLATE} opacity="0.97" />
        )}
        {half !== null && (
          <rect x={half === "left" ? 0 : 10} y="0" width="10" height="20" fill={PLATE} opacity="0.97" />
        )}
        <circle cx="10" cy="10" r="7" fill="none" stroke={GOLD} strokeOpacity="0.4" strokeWidth="0.6" />
      </svg>
      <span className="text-center font-mono text-[6px] leading-tight tracking-[0.12em] text-[#e6e0c8]/50">
        {name}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The great mandala apparatus                                         */
/* ------------------------------------------------------------------ */
function Mandala() {
  const ticks = Array.from({ length: 180 }, (_, i) => {
    const a = i * 2;
    const major = i % 15 === 0;
    const mid = i % 5 === 0;
    const r1 = major ? 366 : mid ? 374 : 381;
    const p1 = pt(r1, a);
    const p2 = pt(390, a);
    return { key: i, p1, p2, major, mid };
  });

  const degLabels = Array.from({ length: 12 }, (_, i) => {
    const a = i * 30 - 90;
    const p = pt(354, a);
    return { key: i, p, label: `${i * 30}°` };
  });

  const stars = Array.from({ length: 110 }, (_, i) => {
    const a = (i * 137.508) % 360;
    const r = 55 + ((i * 83) % 330);
    const p = pt(r, a);
    return { key: i, p, o: 0.15 + ((i * 7) % 10) / 22, rr: 0.5 + ((i * 13) % 5) / 4 };
  });

  const houses = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

  const ringPlanets = (
    r: number,
    items: { glyph: string; angle: number; name: string }[],
  ) =>
    items.map((pl) => {
      const p = pt(r, pl.angle);
      return (
        <g key={pl.name}>
          <circle cx={p.x} cy={p.y} r="11" fill="#0d241a" stroke={GOLD} strokeWidth="0.8" />
          <circle cx={p.x} cy={p.y} r="14" fill="none" stroke={VERDI} strokeOpacity="0.35" strokeWidth="0.5" />
          <text
            x={p.x}
            y={p.y + 4}
            textAnchor="middle"
            fontSize="11"
            fill={GOLD}
          >
            {pl.glyph}
          </text>
        </g>
      );
    });

  const crescent = (deg: number, flip: boolean) => {
    const p = pt(300, deg);
    return (
      <g key={deg}>
        <circle cx={p.x} cy={p.y} r="8" fill={GOLD} opacity="0.85" />
        <circle cx={p.x + (flip ? -4.5 : 4.5)} cy={p.y - 2} r="7.4" fill="#08160e" />
        <circle cx={p.x} cy={p.y} r="8" fill="none" stroke={GOLD} strokeOpacity="0.4" strokeWidth="0.5" />
      </g>
    );
  };

  return (
    <svg
      viewBox="0 0 800 800"
      className="mx-auto w-full max-w-[860px]"
      role="img"
      aria-label="The living cosmos — alchemical mandala apparatus"
    >
      <defs>
        <path id="llc-seal-arc" d="M 400 400 m -236 0 a 236 236 0 1 1 472 0 a 236 236 0 1 1 -472 0" />
      </defs>

      {/* ground plate */}
      <circle cx={MC} cy={MC} r="396" fill="#08160e" stroke={GOLD} strokeOpacity="0.5" strokeWidth="1" />
      <circle cx={MC} cy={MC} r="392" fill="none" stroke={GOLD} strokeOpacity="0.2" strokeWidth="0.5" />

      {/* star field */}
      {stars.map((s) => (
        <circle key={s.key} cx={s.p.x} cy={s.p.y} r={s.rr} fill={CREAM} opacity={s.o} />
      ))}

      {/* degree ticks */}
      {ticks.map((t) => (
        <line
          key={t.key}
          x1={t.p1.x}
          y1={t.p1.y}
          x2={t.p2.x}
          y2={t.p2.y}
          stroke={t.major ? GOLD : t.mid ? VERDI : GOLD}
          strokeOpacity={t.major ? 0.8 : t.mid ? 0.5 : 0.25}
          strokeWidth={t.major ? 1 : 0.5}
        />
      ))}
      {degLabels.map((d) => (
        <text
          key={d.key}
          x={d.p.x}
          y={d.p.y + 2}
          textAnchor="middle"
          fontSize="8"
          letterSpacing="1"
          fill={VERDI}
          opacity="0.8"
          fontFamily="ui-monospace, monospace"
        >
          {d.label}
        </text>
      ))}

      {/* zodiac medallion ring */}
      <circle cx={MC} cy={MC} r="338" fill="none" stroke={GOLD} strokeOpacity="0.35" strokeWidth="0.6" />
      <g className="llc-rot-180" style={{ transformOrigin: "400px 400px", transformBox: "view-box" }}>
        {ZODIAC.map((z, i) => {
          const a = i * 30 - 90;
          const p = pt(320, a);
          const s1 = pt(303, a);
          const s2 = pt(292, a);
          return (
            <g key={z.name}>
              <line x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y} stroke={GOLD} strokeOpacity="0.3" strokeWidth="0.5" />
              <circle cx={p.x} cy={p.y} r="17" fill={PLATE} stroke={GOLD} strokeOpacity="0.7" strokeWidth="0.8" />
              <circle cx={p.x} cy={p.y} r="13.5" fill="none" stroke={VERDI} strokeOpacity="0.35" strokeWidth="0.5" />
              <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize="14" fill={GOLD}>
                {z.glyph}
              </text>
            </g>
          );
        })}
      </g>

      {/* moon crescents at the quarters */}
      {[0, 90, 180, 270].map((d) => crescent(d, d === 90 || d === 180))}

      {/* house ring */}
      <circle cx={MC} cy={MC} r="290" fill="none" stroke={GOLD} strokeOpacity="0.3" strokeWidth="0.6" strokeDasharray="2 3" />
      {houses.map((h, i) => {
        const a = i * 30 - 90 + 15;
        const p = pt(268, a);
        const l1 = pt(240, i * 30 - 90);
        const l2 = pt(290, i * 30 - 90);
        return (
          <g key={h}>
            <line x1={l1.x} y1={l1.y} x2={l2.x} y2={l2.y} stroke={VERDI} strokeOpacity="0.25" strokeWidth="0.5" />
            <text
              x={p.x}
              y={p.y + 2}
              textAnchor="middle"
              fontSize="7.5"
              letterSpacing="0.5"
              fill={GOLD_DIM}
              fontFamily="ui-monospace, monospace"
            >
              {h}
            </text>
          </g>
        );
      })}

      {/* aspect geometry — trines & square */}
      <polygon points={poly(240, 3, -90)} fill="none" stroke={VERDI} strokeOpacity="0.18" strokeWidth="0.6" />
      <polygon points={poly(240, 3, 30)} fill="none" stroke={VERDI} strokeOpacity="0.18" strokeWidth="0.6" />
      <polygon points={poly(240, 4, -45)} fill="none" stroke={GOLD} strokeOpacity="0.14" strokeWidth="0.6" />

      {/* orbit rings */}
      {[240, 195, 150, 110].map((r) => (
        <circle key={r} cx={MC} cy={MC} r={r} fill="none" stroke={VERDI} strokeOpacity="0.3" strokeWidth="0.5" strokeDasharray="1 4" />
      ))}

      {/* orbiting wanderers */}
      <g className="llc-rot-45" style={{ transformOrigin: "400px 400px", transformBox: "view-box" }}>
        {ringPlanets(110, [
          { glyph: "☿︎", angle: -20, name: "mercury" },
          { glyph: "♀︎", angle: 160, name: "venus" },
        ])}
      </g>
      <g className="llc-rot-60r" style={{ transformOrigin: "400px 400px", transformBox: "view-box" }}>
        {ringPlanets(150, [
          { glyph: "☉︎", angle: 0, name: "sun" },
          { glyph: "☽︎", angle: 180, name: "moon" },
        ])}
      </g>
      <g className="llc-rot-90" style={{ transformOrigin: "400px 400px", transformBox: "view-box" }}>
        {ringPlanets(195, [
          { glyph: "♂︎", angle: 60, name: "mars" },
          { glyph: "♃︎", angle: 240, name: "jupiter" },
        ])}
      </g>
      <g className="llc-rot-120r" style={{ transformOrigin: "400px 400px", transformBox: "view-box" }}>
        {ringPlanets(240, [
          { glyph: "♄︎", angle: -90, name: "saturn" },
          { glyph: "☊", angle: 90, name: "node" },
        ])}
      </g>

      {/* rotating ring inscription */}
      <g className="llc-rot-180" style={{ transformOrigin: "400px 400px", transformBox: "view-box" }}>
        <text fontSize="8.5" letterSpacing="4.5" fill={GOLD_DIM} fontFamily="ui-monospace, monospace">
          <textPath href="#llc-seal-arc">
            · SOL INVICTUS · LUNA MATER · MERCURIUS CITUS · VENUS PULCHRA · MARS FORTIS · JUPITER MAGNUS · SATURNUS SENEX · STELLAE FIXAE
          </textPath>
        </text>
      </g>

      {/* geometric star core */}
      <circle cx={MC} cy={MC} r="88" fill="#0a1c12" stroke={GOLD} strokeOpacity="0.7" strokeWidth="0.8" />
      <circle cx={MC} cy={MC} r="80" fill="none" stroke={VERDI} strokeOpacity="0.4" strokeWidth="0.5" />
      <polygon points={poly(76, 4, -90)} fill="none" stroke={GOLD} strokeOpacity="0.6" strokeWidth="0.7" />
      <polygon points={poly(76, 4, -45)} fill="none" stroke={GOLD} strokeOpacity="0.6" strokeWidth="0.7" />
      <polygon
        points={Array.from({ length: 16 }, (_, i) => {
          const r = i % 2 === 0 ? 66 : 26;
          const a = rad(-90 + i * 22.5);
          return `${MC + r * Math.cos(a)},${MC + r * Math.sin(a)}`;
        }).join(" ")}
        fill={GOLD}
        fillOpacity="0.12"
        stroke={GOLD}
        strokeOpacity="0.85"
        strokeWidth="0.8"
        className="llc-pulse-2"
      />
      <circle cx={MC} cy={MC} r="13" fill={GOLD} className="llc-pulse" />
      <circle cx={MC} cy={MC} r="20" fill="none" stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.5" />
      <text
        x={MC}
        y={MC + 70}
        textAnchor="middle"
        fontSize="8"
        letterSpacing="3"
        fill={VERDI}
        fontFamily="ui-monospace, monospace"
      >
        · ANIMA MUNDI ·
      </text>

      {/* codex labels around the apparatus */}
      <text x="250" y="30" textAnchor="middle" fontSize="9" letterSpacing="4" fill={GOLD} opacity="0.85" fontFamily="ui-monospace, monospace">
        THE TABLE ISOLA
      </text>
      <text x="400" y="18" textAnchor="middle" fontSize="9" letterSpacing="4" fill={GOLD} opacity="0.85" fontFamily="ui-monospace, monospace">
        THE GARDEN
      </text>
      <text x="550" y="30" textAnchor="middle" fontSize="9" letterSpacing="4" fill={GOLD} opacity="0.85" fontFamily="ui-monospace, monospace">
        THE KITCHEN
      </text>
      <text x="330" y="790" textAnchor="middle" fontSize="8" letterSpacing="3" fill={VERDI} opacity="0.8" fontFamily="ui-monospace, monospace">
        AS ABOVE
      </text>
      <text x="470" y="790" textAnchor="middle" fontSize="8" letterSpacing="3" fill={VERDI} opacity="0.8" fontFamily="ui-monospace, monospace">
        SO BELOW
      </text>
      <text x="14" y="400" textAnchor="middle" fontSize="7" letterSpacing="2" fill={GOLD_DIM} fontFamily="ui-monospace, monospace" transform="rotate(-90 14 400)">
        HOROSCOPVS · NATIVITATIS
      </text>
      <text x="786" y="400" textAnchor="middle" fontSize="7" letterSpacing="2" fill={GOLD_DIM} fontFamily="ui-monospace, monospace" transform="rotate(90 786 400)">
        TABVLA · ASPECTVVM
      </text>

      {/* corner ornaments of the plate */}
      {[45, 135, 225, 315].map((a) => {
        const p = pt(378, a);
        return (
          <g key={a} opacity="0.7">
            <path
              d={`M ${p.x - 10} ${p.y} L ${p.x} ${p.y - 10} L ${p.x + 10} ${p.y} L ${p.x} ${p.y + 10} Z`}
              fill="none"
              stroke={GOLD}
              strokeWidth="0.6"
            />
            <circle cx={p.x} cy={p.y} r="1.6" fill={VERDI} />
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Destiny octagram plate                                              */
/* ------------------------------------------------------------------ */
function Octagram() {
  const c = 110;
  const oPt = (r: number, deg: number) => ({
    x: Math.round((c + r * Math.cos(rad(deg))) * 100) / 100,
    y: Math.round((c + r * Math.sin(rad(deg))) * 100) / 100,
  });
  const labels = ["PURPOSE", "LOVE", "MONEY", "AGE", "KARMA", "TALENT", "PATH", "FATE"];
  return (
    <svg viewBox="0 0 220 220" className="w-full max-w-[220px]" role="img" aria-label="Destiny octagram">
      <circle cx={c} cy={c} r="104" fill="#0a1a12" stroke={GOLD} strokeOpacity="0.6" strokeWidth="0.8" />
      <circle cx={c} cy={c} r="98" fill="none" stroke={VERDI} strokeOpacity="0.3" strokeWidth="0.5" strokeDasharray="2 3" />
      <polygon points={poly(84, 4, -90, c, c)} fill="none" stroke={GOLD} strokeOpacity="0.7" strokeWidth="0.8" />
      <polygon points={poly(84, 4, -45, c, c)} fill="none" stroke={GOLD} strokeOpacity="0.7" strokeWidth="0.8" />
      <polygon points={poly(38, 8, -90, c, c)} fill="none" stroke={VERDI} strokeOpacity="0.45" strokeWidth="0.6" />
      {labels.map((l, i) => {
        const a = -90 + i * 45;
        const p = oPt(84, a);
        const tp = oPt(66, a + 22.5);
        return (
          <g key={l}>
            <circle cx={p.x} cy={p.y} r="7" fill={PLATE} stroke={GOLD} strokeWidth="0.7" />
            <text x={p.x} y={p.y + 2.5} textAnchor="middle" fontSize="7" fill={GOLD} fontFamily="ui-monospace, monospace">
              {i + 1}
            </text>
            <text x={tp.x} y={tp.y + 2} textAnchor="middle" fontSize="5" letterSpacing="0.5" fill={VERDI} fontFamily="ui-monospace, monospace">
              {l}
            </text>
          </g>
        );
      })}
      <circle cx={c} cy={c} r="16" fill="none" stroke={GOLD} strokeWidth="0.8" />
      <text x={c} y={c + 4} textAnchor="middle" fontSize="12" fill={GOLD} fontFamily="ui-monospace, monospace">
        22
      </text>
      {Array.from({ length: 48 }, (_, i) => {
        const p1 = oPt(100, i * 7.5);
        const p2 = oPt(i % 6 === 0 ? 94 : 97, i * 7.5);
        return (
          <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={GOLD} strokeOpacity="0.35" strokeWidth="0.5" />
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Seal of authenticity                                                */
/* ------------------------------------------------------------------ */
function Seal() {
  return (
    <svg viewBox="0 0 160 160" className="h-28 w-28 shrink-0 md:h-32 md:w-32" role="img" aria-label="Seal of authenticity">
      <defs>
        <path id="llc-seal-ring" d="M 80 80 m -58 0 a 58 58 0 1 1 116 0 a 58 58 0 1 1 -116 0" />
      </defs>
      <circle cx="80" cy="80" r="76" fill="none" stroke={GOLD} strokeOpacity="0.6" strokeWidth="1" />
      <circle cx="80" cy="80" r="71" fill="none" stroke={GOLD} strokeOpacity="0.35" strokeWidth="0.5" />
      <circle cx="80" cy="80" r="44" fill="none" stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.7" />
      <g className="llc-rot-60r" style={{ transformOrigin: "80px 80px", transformBox: "view-box" }}>
        <text fontSize="8.5" letterSpacing="2.6" fill={GOLD} fontFamily="ui-monospace, monospace" opacity="0.9">
          <textPath href="#llc-seal-ring">
            SIGILLVM · AUTHENTICITATIS · ASTRO SCOPE · MMXXVI ·
          </textPath>
        </text>
      </g>
      <polygon points={poly(34, 4, -90, 80, 80)} fill="none" stroke={VERDI} strokeOpacity="0.7" strokeWidth="0.7" />
      <polygon points={poly(34, 4, -45, 80, 80)} fill="none" stroke={VERDI} strokeOpacity="0.7" strokeWidth="0.7" />
      <text x="80" y="85" textAnchor="middle" fontSize="16" fill={GOLD}>
        ✦
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function LivingCosmosPage() {
  return (
    <main
      className="relative isolate min-h-screen overflow-x-clip bg-[#06120c] text-[#e6e0c8] antialiased"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 50% 0%, rgba(63,163,124,0.07), transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(201,176,55,0.05), transparent 50%)",
      }}
    >
      <style>{LLC_STYLES}</style>
      <CosmosBackdrop />
      <div aria-hidden className="llc-fiber" />
      <AgeOverlay />

      {/* ======================= NAV ======================= */}
      <nav className="border-b border-[#c9b037]/25">
        <div className="mx-auto flex max-w-[1500px] items-center gap-4 px-4 py-3 sm:px-6">
          <a href="#llc-top" className="flex items-baseline gap-2">
            <span className="text-sm font-bold tracking-[0.35em] text-[#c9b037]">ASTRO SCOPE</span>
            <span className="hidden font-mono text-[8px] tracking-[0.25em] text-[#3fa37c]/70 sm:inline">
              CODEX · VOL. I
            </span>
          </a>
          <span className="hidden font-mono text-[8px] tracking-[0.2em] text-[#e6e0c8]/30 lg:inline">
            SIDEREAL 13:42:07 · LAT 51°30′N · LON 0°07′W
          </span>
          <div className="ml-auto flex items-center gap-4 font-mono text-[9px] tracking-[0.25em] sm:gap-6">
            <a href="#llc-operations" className="hidden text-[#e6e0c8]/60 transition-colors hover:text-[#c9b037] sm:inline">
              HOROSCOPES
            </a>
            <a href="#llc-operations" className="hidden text-[#e6e0c8]/60 transition-colors hover:text-[#c9b037] sm:inline">
              TAROT
            </a>
            <a href="#llc-operations" className="hidden text-[#e6e0c8]/60 transition-colors hover:text-[#c9b037] md:inline">
              COMPATIBILITY
            </a>
            <a
              href="#llc-cast"
              className="border border-[#c9b037]/50 px-3 py-1.5 text-[#c9b037] transition-colors hover:bg-[#c9b037] hover:text-[#06120c]"
            >
              SIGN IN
            </a>
          </div>
        </div>
      </nav>

      {/* ======================= CODEX HEADER ======================= */}
      <header id="llc-top" className="border-b border-[#c9b037]/25 px-4 pb-5 pt-8 text-center sm:px-6">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-3 flex items-center justify-center gap-3 font-mono text-[8px] tracking-[0.4em] text-[#3fa37c]/80">
            <span className="h-px w-10 bg-[#3fa37c]/40 sm:w-24" />
            LIBER PRIMUS · DE COELO VIVENTE
            <span className="h-px w-10 bg-[#3fa37c]/40 sm:w-24" />
          </div>
          <h1 className="llc-worn font-serif text-3xl tracking-[0.18em] text-[#c9b037] sm:text-5xl md:text-6xl">
            THE LIVING COSMOS
          </h1>
          <p className="mt-3 font-mono text-[9px] tracking-[0.45em] text-[#e6e0c8]/60 sm:text-[11px]">
            · AS ABOVE — SO BELOW · MMXXVI ·
          </p>
          <div className="mx-auto mt-4 flex max-w-3xl items-center gap-3">
            <span className="h-px flex-1 bg-[#c9b037]/30" />
            <span aria-hidden className="text-[8px] text-[#c9b037]">✦</span>
            <span className="font-mono text-[7px] tracking-[0.3em] text-[#e6e0c8]/35">
              FIG. I — THE GREAT APPARATUS OF THE SPHERES
            </span>
            <span aria-hidden className="text-[8px] text-[#c9b037]">✦</span>
            <span className="h-px flex-1 bg-[#c9b037]/30" />
          </div>
        </div>
      </header>

      {/* ======================= CTA STRIP ======================= */}
      <div className="border-b border-[#c9b037]/25 bg-[#c9b037]/[0.05]">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-3 sm:px-6">
          <span className="hidden font-mono text-[8px] tracking-[0.3em] text-[#3fa37c]/80 md:inline">
            OPERATIO PRIMA
          </span>
          <a
            id="llc-cast"
            href="#llc-operations"
            className="llc-worn inline-flex items-center gap-3 bg-[#c9b037] px-6 py-2.5 font-mono text-[10px] font-bold tracking-[0.25em] text-[#06120c] transition-colors hover:bg-[#e3cd5a]"
          >
            CAST YOUR FREE BIRTH CHART <span aria-hidden>→</span>
          </a>
          <span className="font-mono text-[8px] tracking-[0.25em] text-[#e6e0c8]/40">
            NO COIN REQUIRED · DATE + HOUR + PLACE · $0
          </span>
        </div>
      </div>

      {/* ======================= APPARATUS + CODEX PANELS ======================= */}
      <section className="relative mx-auto max-w-none px-2 py-6 sm:px-4">
        <span
          aria-hidden
          className="pointer-events-none absolute -left-1 top-16 hidden select-none font-mono text-[8px] tracking-[0.5em] text-[#c9b037]/40 [writing-mode:vertical-rl] xl:block"
        >
          MARGINALIA · OBSERVATIO NOCTIS · FOL. XII
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute -right-1 top-[46%] hidden select-none font-mono text-[8px] tracking-[0.5em] text-[#3fa37c]/40 [writing-mode:vertical-rl] xl:block"
        >
          ANNOTATIO PERITI · IN MARGINE · MMXXVI
        </span>
        <div className="grid gap-3 lg:grid-cols-[260px_minmax(0,1fr)_260px]">
          {/* -------- left column -------- */}
          <div className="relative z-[2] flex flex-col gap-3 lg:-mr-5">
            <Panel title="ETHER CODEX" tag="CAP. I" className="-rotate-[0.6deg]">
              <ol className="space-y-1.5">
                {ETHER.map((e) => (
                  <li key={e.no} className="flex items-baseline gap-2 border-b border-[#c9b037]/10 pb-1.5">
                    <span className="font-mono text-[9px] font-bold text-[#3fa37c]">{e.no}</span>
                    <div>
                      <div className="font-mono text-[9px] tracking-[0.2em] text-[#c9b037]">{e.term}</div>
                      <div className="text-[9px] italic leading-snug text-[#e6e0c8]/45">{e.note}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </Panel>

            <Panel title="ELEMENTAL MATRIX" tag="TAB. II" className="rotate-[0.4deg] lg:-ml-2">
              <ul className="space-y-1">
                {ELEMENTS.map((el) => (
                  <li key={el.latin} className="flex items-center gap-2 border-b border-[#c9b037]/10 pb-1">
                    <span className="w-5 text-center text-[11px] text-[#c9b037]">{el.sym}</span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-mono text-[8px] tracking-[0.15em] text-[#e6e0c8]/80">
                        {el.latin} <span className="text-[#e6e0c8]/35">· {el.eng}</span>
                      </div>
                      <div className="text-[8px] italic text-[#e6e0c8]/40">{el.virtue}</div>
                    </div>
                    <span className="font-mono text-[8px] text-[#3fa37c]">{el.v}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex h-1.5 overflow-hidden border border-[#c9b037]/20">
                {["33%", "27%", "21%", "14%", "5%"].map((w, i) => (
                  <span
                    key={w}
                    style={{ width: w, opacity: 0.85 - i * 0.15 }}
                    className={i % 2 === 0 ? "bg-[#c9b037]" : "bg-[#3fa37c]"}
                  />
                ))}
              </div>
            </Panel>

            <Panel title="RITUAL SEQUENCE" tag="ORDO" className="-rotate-[0.5deg]">
              <ol className="space-y-1.5">
                {RITUAL.map((r) => (
                  <li key={r.no} className="flex gap-2">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border border-[#c9b037]/40 font-mono text-[7px] text-[#c9b037]">
                      {r.no}
                    </span>
                    <div>
                      <div className="font-mono text-[9px] tracking-[0.2em] text-[#e6e0c8]/85">{r.step}</div>
                      <div className="text-[9px] italic leading-snug text-[#e6e0c8]/45">{r.note}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </Panel>

            <Panel title="SACRED GEOMETRY" tag="FIG. III" className="hidden rotate-[0.6deg] lg:-ml-3 lg:block">
              <ul className="space-y-1">
                {GEOMETRY.map((g) => (
                  <li key={g.name} className="flex items-center gap-2 border-b border-[#c9b037]/10 pb-1">
                    <GeoIcon kind={g.kind} />
                    <div>
                      <div className="font-mono text-[8px] tracking-[0.2em] text-[#c9b037]">{g.name}</div>
                      <div className="text-[8px] italic text-[#e6e0c8]/40">{g.note}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          {/* -------- centre: the apparatus -------- */}
          <div className="llc-aged relative border border-[#c9b037]/25 bg-[#08160e]/60 p-2 sm:p-3">
            <span aria-hidden className="pointer-events-none absolute inset-[3px] border border-[#c9b037]/10" />
            <Corners />
            <div className="mb-1 flex items-center justify-between px-2 font-mono text-[7px] tracking-[0.25em] text-[#e6e0c8]/35">
              <span>MERIDIAN +00°07′</span>
              <span className="llc-flicker text-[#3fa37c]">● TRANSIT ACTIVE</span>
              <span>EPOCH J2000.0</span>
            </div>
            <Mandala />
            {/* zodiacal band */}
            <div className="-mx-1 mt-2 grid rotate-[0.15deg] grid-cols-3 border border-[#c9b037]/20 sm:grid-cols-6 xl:grid-cols-12">
              {ZODIAC.map((z) => (
                <div
                  key={z.name}
                  className="flex flex-col items-center gap-0.5 border border-[#c9b037]/10 px-1 py-1.5 text-center"
                >
                  <span className="text-[13px] leading-none text-[#c9b037]">{z.glyph}</span>
                  <span className="font-mono text-[7px] tracking-[0.15em] text-[#e6e0c8]/75">{z.name}</span>
                  <span className="font-mono text-[6px] tracking-[0.05em] text-[#3fa37c]/80">{z.dates}</span>
                </div>
              ))}
            </div>
          </div>

          {/* -------- right column -------- */}
          <div className="relative z-[2] flex flex-col gap-3 lg:-ml-5">
            <Panel title="SOLAR ALCHEMY" tag="CAP. IV" className="rotate-[0.6deg]">
              <ul className="space-y-1">
                {ALCHEMY.map((a) => (
                  <li key={a.body} className="flex items-center gap-2 border-b border-[#c9b037]/10 pb-1">
                    <span className="w-4 text-center text-[12px] text-[#c9b037]">{a.glyph}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-[8px] tracking-[0.15em] text-[#e6e0c8]/85">
                        {a.body} <span className="text-[#3fa37c]">→ {a.metal}</span>
                      </div>
                      <div className="text-[8px] italic text-[#e6e0c8]/40">{a.note}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="LUNAR PHASES" tag="CYCL. XXIX" className="-rotate-[0.4deg] lg:-mr-2">
              <div className="grid grid-cols-4 gap-1">
                {PHASES.map((p) => (
                  <MoonPhase key={p.name} name={p.name} shadowX={p.shadowX} half={p.half} />
                ))}
              </div>
              <div className="mt-2 flex justify-between font-mono text-[7px] tracking-[0.15em] text-[#e6e0c8]/35">
                <span>SYNODIC 29.53 D</span>
                <span className="text-[#c9b037]">NOW: WAX. GIB. 83%</span>
              </div>
            </Panel>

            <Panel title="COSMIC VEINS" tag="FLUX." className="rotate-[0.5deg]">
              <ul className="space-y-2">
                {VEINS.map((v) => (
                  <li key={v.name}>
                    <div className="flex justify-between font-mono text-[7px] tracking-[0.2em]">
                      <span className="text-[#e6e0c8]/70">{v.name}</span>
                      <span className="text-[#3fa37c]">{v.val}</span>
                    </div>
                    <svg viewBox="0 0 200 16" className="mt-0.5 h-4 w-full" aria-hidden>
                      <line x1="0" y1="8" x2="200" y2="8" stroke={GOLD} strokeOpacity="0.15" strokeWidth="0.5" />
                      <path
                        d={wavePath(200, 16, v.cycles, v.amp)}
                        fill="none"
                        stroke={VERDI}
                        strokeWidth="0.9"
                        strokeOpacity="0.9"
                      />
                    </svg>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="PLANAR LAYERS" tag="ASCENS." className="-rotate-[0.6deg]">
              <ul className="space-y-1">
                {LAYERS.map((l) => (
                  <li key={l.name} className="flex items-baseline gap-2 border-b border-[#c9b037]/10 pb-1">
                    <span className="font-mono text-[7px] text-[#3fa37c]">{l.d}</span>
                    <span className="font-mono text-[9px] tracking-[0.2em] text-[#c9b037]">{l.name}</span>
                    <span className="h-px flex-1 bg-[#c9b037]/15" />
                    <span className="text-[8px] italic text-[#e6e0c8]/40">{l.note}</span>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="ARCANE FORMULAE" tag="ARITHM." className="hidden rotate-[0.4deg] lg:-mr-3 lg:block">
              <ul className="space-y-1.5">
                {ARCANE.map((f) => (
                  <li key={f.f} className="border border-[#c9b037]/15 bg-[#06120c]/60 px-2 py-1">
                    <div className="font-mono text-[9px] tracking-[0.1em] text-[#c9b037]">{f.f}</div>
                    <div className="font-mono text-[7px] tracking-[0.15em] text-[#e6e0c8]/40">{f.v}</div>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </section>

      {/* ======================= CORE FORMULAE STRIP ======================= */}
      <section className="mx-auto max-w-none px-2 pb-6 sm:px-4">
        <div className="mb-2 flex items-center gap-3">
          <span className="h-px flex-1 bg-[#c9b037]/30" />
          <h2 className="font-mono text-[10px] tracking-[0.4em] text-[#c9b037]">· CORE FORMULAE ·</h2>
          <span className="h-px flex-1 bg-[#c9b037]/30" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {CORE_FORMULAE.map((f, i) => (
            <div
              key={f.name}
              className={`llc-aged relative border border-[#c9b037]/25 bg-[#0a1a12]/70 p-3 text-center ${
                i % 2 === 0 ? "-rotate-[0.4deg]" : "rotate-[0.5deg] xl:-mt-2"
              }`}
            >
              <Corners />
              <div className="font-mono text-[7px] tracking-[0.3em] text-[#3fa37c]">
                PLATE {["I", "II", "III", "IV"][i]} — {f.name}
              </div>
              <div className="my-2 font-mono text-lg tracking-[0.12em] text-[#c9b037]">{f.formula}</div>
              <div className="text-[9px] italic text-[#e6e0c8]/45">{f.note}</div>
            </div>
          ))}
        </div>

        {/* constants + seal */}
        <div className="mt-3 flex flex-wrap items-center gap-4 border border-[#c9b037]/25 bg-[#0a1a12]/70 px-4 py-3">
          <div className="grid flex-1 grid-cols-4 gap-x-4 gap-y-2 sm:grid-cols-8">
            {CONSTANTS.map((c) => (
              <div key={c.k} className="text-center">
                <div className="font-mono text-[7px] tracking-[0.25em] text-[#3fa37c]/80">{c.k}</div>
                <div className="font-mono text-[11px] text-[#c9b037]">{c.v}</div>
              </div>
            ))}
          </div>
          <div className="mx-auto flex items-center gap-3">
            <div className="text-right">
              <div className="font-mono text-[8px] tracking-[0.3em] text-[#c9b037]">SEAL OF AUTHENTICITY</div>
              <div className="font-mono text-[7px] tracking-[0.2em] text-[#e6e0c8]/40">
                VERIFIED · COSMIC CONSTANTS · OBS. MMXXVI
              </div>
            </div>
            <Seal />
          </div>
        </div>
      </section>

      {/* ======================= TABLE OF OPERATIONS ======================= */}
      <section id="llc-operations" className="border-t border-[#c9b037]/25 bg-[#08160e]/70">
        <div className="mx-auto max-w-none px-2 py-10 sm:px-4">
          <div className="mb-6 text-center">
            <div className="font-mono text-[8px] tracking-[0.4em] text-[#3fa37c]/80">CAPITVLVM SECVNDVM</div>
            <h2 className="mt-2 font-serif text-2xl tracking-[0.15em] text-[#c9b037] sm:text-4xl">
              TABLE OF OPERATIONS
            </h2>
            <p className="mt-2 font-mono text-[8px] tracking-[0.3em] text-[#e6e0c8]/40">
              SIX WORKS OF THE ART · ALL MAY BE ENTERED FREELY
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {SECTIONS.map((s, i) => (
              <article
                key={s.no}
                className={`llc-aged relative border border-[#c9b037]/25 bg-[#0a1a12]/70 p-4 ${
                  i % 3 === 0
                    ? "-rotate-[0.5deg]"
                    : i % 3 === 1
                      ? "rotate-[0.4deg] xl:translate-y-2"
                      : "-rotate-[0.3deg] xl:-translate-y-1"
                }`}
              >
                <span aria-hidden className="pointer-events-none absolute inset-[3px] border border-[#c9b037]/10" />
                <Corners />
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-[8px] tracking-[0.3em] text-[#3fa37c]">{s.no}</span>
                  <span className="border border-[#c9b037]/40 px-1.5 py-0.5 font-mono text-[7px] tracking-[0.25em] text-[#c9b037]">
                    {s.kicker}
                  </span>
                </div>
                <h3 className="font-serif text-xl tracking-[0.08em] text-[#e6e0c8]">{s.title}</h3>
                <div className="my-2 h-px bg-[#c9b037]/20" />
                <p className="text-[11px] leading-relaxed text-[#e6e0c8]/55">{s.copy}</p>
                <a
                  href="#llc-cast"
                  className="mt-3 inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.25em] text-[#c9b037] transition-colors hover:text-[#e3cd5a]"
                >
                  EXPLORE <span aria-hidden>→</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= DESTINY MATRIX ======================= */}
      <section className="border-t border-[#c9b037]/25">
        <div className="mx-auto flex max-w-[1500px] flex-col items-center gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:gap-14">
          <div className="relative -rotate-[0.7deg] border border-[#c9b037]/25 bg-[#0a1a12]/70 p-4">
            <Corners />
            <div className="mb-2 text-center font-mono text-[7px] tracking-[0.35em] text-[#3fa37c]">
              FIG. VII — OCTAGRAMMA FATALIS
            </div>
            <Octagram />
          </div>
          <div className="max-w-xl text-center lg:text-left">
            <div className="font-mono text-[8px] tracking-[0.4em] text-[#3fa37c]/80">OPVS OPTIVVM</div>
            <h2 className="mt-2 font-serif text-2xl tracking-[0.12em] text-[#c9b037] sm:text-3xl">
              DESTINY MATRIX
            </h2>
            <p className="mt-3 text-[12px] leading-relaxed text-[#e6e0c8]/60">
              An optional birth-date octagram tool. It maps purpose, love, money, and age themes
              from your birth date.
            </p>
            <a
              href="#llc-cast"
              className="mt-4 inline-flex items-center gap-2 border border-[#c9b037]/50 px-5 py-2.5 font-mono text-[10px] tracking-[0.25em] text-[#c9b037] transition-colors hover:bg-[#c9b037] hover:text-[#06120c]"
            >
              OPEN DESTINY MATRIX <span aria-hidden>→</span>
            </a>
          </div>
          <div className="hidden flex-1 grid-cols-2 gap-2 self-stretch lg:grid">
            {["PURPOSE", "LOVE", "MONEY", "AGE THEMES"].map((t, i) => (
              <div key={t} className="flex flex-col justify-center border border-[#c9b037]/15 bg-[#0a1a12]/50 px-3 py-2">
                <span className="font-mono text-[7px] tracking-[0.3em] text-[#3fa37c]">ARCANA {["I", "VI", "X", "XXII"][i]}</span>
                <span className="font-mono text-[9px] tracking-[0.2em] text-[#e6e0c8]/70">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= QUAESTIONES ======================= */}
      <section className="border-t border-[#c9b037]/25 bg-[#08160e]/70">
        <div className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-16 bg-[#c9b037]/40" />
            <h2 className="font-serif text-xl tracking-[0.2em] text-[#c9b037] sm:text-2xl">QUAESTIONES</h2>
            <span className="font-mono text-[8px] tracking-[0.3em] text-[#e6e0c8]/35">
              FROM THE MARGINS OF THE MANUSCRIPT
            </span>
            <span className="h-px flex-1 bg-[#c9b037]/20" />
          </div>
          <dl className="grid gap-3 lg:grid-cols-2">
            {FAQ.map((f, i) => (
              <div
                key={f.q}
                className={`llc-aged relative border border-[#c9b037]/20 bg-[#0a1a12]/60 p-4 ${
                  i % 2 === 0 ? "-rotate-[0.35deg]" : "rotate-[0.45deg] lg:translate-y-1"
                }`}
              >
                <Corners />
                <dt className="flex items-baseline gap-3">
                  <span className="font-serif text-lg text-[#3fa37c]">
                    {["Q. I", "Q. II", "Q. III", "Q. IV"][i]}
                  </span>
                  <span className="font-serif text-[15px] tracking-[0.05em] text-[#e6e0c8]">{f.q}</span>
                </dt>
                <dd className="mt-2 border-l-2 border-[#c9b037]/30 pl-3 text-[11px] leading-relaxed text-[#e6e0c8]/55">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ======================= FINAL CTA ======================= */}
      <section className="border-t border-[#c9b037]/25">
        <div className="mx-auto max-w-[1500px] px-4 py-14 text-center sm:px-6">
          <div className="mb-3 font-mono text-[8px] tracking-[0.4em] text-[#3fa37c]/80">
            COLOPHON · THE LAST LEAF
          </div>
          <h2 className="mx-auto max-w-2xl font-serif text-3xl leading-tight tracking-[0.06em] text-[#e6e0c8] sm:text-4xl">
            Your chart is written in the stars.{" "}
            <span className="text-[#c9b037]">Come read it.</span>
          </h2>
          <a
            href="#llc-cast"
            className="llc-worn mt-7 inline-flex items-center gap-3 bg-[#c9b037] px-8 py-3.5 font-mono text-[11px] font-bold tracking-[0.25em] text-[#06120c] transition-colors hover:bg-[#e3cd5a]"
          >
            GET STARTED — IT&rsquo;S FREE <span aria-hidden>→</span>
          </a>
          <div className="mt-4 font-mono text-[8px] tracking-[0.3em] text-[#e6e0c8]/35">
            CHART · HOROSCOPE · TAROT · TESTS — $0
          </div>
        </div>
      </section>

      {/* ======================= FOOTER ======================= */}
      <footer className="border-t border-[#c9b037]/25">
        <div className="mx-auto flex max-w-[1500px] flex-col items-center gap-3 px-4 py-6 sm:px-6 md:flex-row md:justify-between">
          <span className="font-mono text-[9px] tracking-[0.35em] text-[#c9b037]">ASTRO SCOPE</span>
          <div className="flex gap-5 font-mono text-[8px] tracking-[0.25em] text-[#e6e0c8]/40">
            <a href="#llc-operations" className="transition-colors hover:text-[#c9b037]">HOROSCOPES</a>
            <a href="#llc-operations" className="transition-colors hover:text-[#c9b037]">TAROT</a>
            <a href="#llc-operations" className="transition-colors hover:text-[#c9b037]">COMPATIBILITY</a>
          </div>
          <span className="font-mono text-[8px] tracking-[0.25em] text-[#e6e0c8]/25">
            © MMXXVI · AS ABOVE · SO BELOW
          </span>
        </div>
      </footer>
    </main>
  );
}
