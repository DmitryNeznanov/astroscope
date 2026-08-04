"use client";

import { useState } from "react";

// TAROT / LOVE THREE-CARD — a working love spread in the AURUM idiom:
// gold-on-black engine, broken full-bleed layout, layered apparatus behind
// everything. Flow: editorial hero with a two-ring synastry engine bleeding
// off the right edge, the interactive SPREAD centerpiece (three positions —
// YOU / THEM / THE TIDE BETWEEN — dealt with staggered animation, flipped
// open one by one from a built-in 8-card love sample), an engraved HOW TO
// READ rail, FAQ as archive entries, CTA band and a stat-lined footer.
// Self-contained: inline SVG + Tailwind + one scoped <style> block (llv-
// prefixed). Client component: useState for the deal, CSS-only ambient
// motion (slow 15–180s cycles, reduced-motion guarded).

/* ============================ GEOMETRY HELPERS ============================ */

const DEG = Math.PI / 180;

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

const VENUS = "♀" + GLYPH_FE0E;
const MARS = "♂" + GLYPH_FE0E;
const LUNA = "☽" + GLYPH_FE0E;

interface LoveCard {
  n: string;
  name: string;
  suit: string;
  line: string;
  sigil: number;
}

// the built-in love sample: eight cards, eight small counsels
const LOVE_CARDS: LoveCard[] = [
  { n: "VI", name: "The Lovers", suit: "MAJOR · GEMINI PATH", line: "Two wills, one axis — the choice itself is the bond.", sigil: 0 },
  { n: "II", name: "The High Priestess", suit: "MAJOR · MOON PATH", line: "What goes unsaid is already steering this.", sigil: 1 },
  { n: "III", name: "The Empress", suit: "MAJOR · VENUS PATH", line: "Warmth that grows whatever it touches.", sigil: 2 },
  { n: "X", name: "Wheel of Fortune", suit: "MAJOR · JUPITER PATH", line: "The tide turns; meet it already turning.", sigil: 3 },
  { n: "XVII", name: "The Star", suit: "MAJOR · AQUARIUS PATH", line: "Hope, poured out without measuring.", sigil: 4 },
  { n: "XVIII", name: "The Moon", suit: "MAJOR · PISCES PATH", line: "Feelings arriving in disguise. Wait for full light.", sigil: 5 },
  { n: "A", name: "Ace of Cups", suit: "MINOR · SUIT OF CUPS", line: "A first vessel, brimming over. Drink.", sigil: 6 },
  { n: "2", name: "Two of Cups", suit: "MINOR · SUIT OF CUPS", line: "A quiet covenant, cup raised to cup.", sigil: 7 },
];

const POSITIONS = [
  { n: "I", tag: "POS. I", name: "You", q: "WHERE YOUR HEART ACTUALLY STANDS" },
  { n: "II", tag: "POS. II", name: "Them", q: "THE WEATHER ON THEIR SIDE OF THE WATER" },
  { n: "III", tag: "POS. III", name: "The Tide Between", q: "WHAT THE TWO CHARTS MAKE TOGETHER" },
];

const RITES = [
  {
    n: "I",
    t: "Read your own card first",
    c: "Position I is the only one you steer. Name what you actually bring — the hope, the fear, the old pattern — before you blame the tide.",
    micro: "POS I · THE QUESITENT",
  },
  {
    n: "II",
    t: "Read theirs as weather",
    c: "Position II reports conditions on the other shore — not a verdict on their soul. Weather changes; the card only promises today's sky.",
    micro: "POS II · THE OTHER SHORE",
  },
  {
    n: "III",
    t: "Read the tide last",
    c: "Position III is a current, not a sentence. It says which way the water moves when neither of you is rowing.",
    micro: "POS III · THE TIDE BETWEEN",
  },
];

const ARCHIVE = [
  {
    q: "Do I need the other person's birth data?",
    a: "No. The three-card love spread reads the dynamic between you, not two natal charts. A clear question and a quiet minute are the whole input.",
  },
  {
    q: "Can I cast about someone I barely know?",
    a: "Yes — read Position II as what they are showing, not what they are. Early tides shift fast: cast again in a month, not in an hour.",
  },
  {
    q: "What if the tide card looks grim?",
    a: "Grim cards are weather reports, not sentences. The spread shows the current so you can row with it, against it, or stay on shore a while.",
  },
];

const VERDICTS = [
  "WAXING — THE CURRENT FAVORS THE BRAVE",
  "FULL — SAY THE PLAIN THING PLAINLY",
  "WANING — RELEASE WHAT WAS NEVER YOURS",
  "NEW — BEGIN, BUT BEGIN SLOWLY",
];

const CHIPS = [
  { g: VENUS, name: "VENUS", v: "+66.5", up: true, cls: "-top-3 left-6 sm:left-10" },
  { g: LUNA, name: "LUNA", v: "+58.9", up: true, cls: "left-2 top-1/3 sm:-left-5" },
  { g: MARS, name: "MARS", v: "+41.2", up: true, cls: "-bottom-3 left-[38%]" },
  { g: "☍", name: "OPPOSITIO", v: "−12.8", up: false, cls: "bottom-10 left-2 sm:-left-4" },
];

// broken-layout transforms for the three card slots
const SLOT_TF = [
  "-rotate-[0.8deg] lg:-rotate-[1.6deg] lg:translate-y-3",
  "rotate-[0.6deg] translate-y-1 lg:rotate-[1.1deg] lg:-translate-y-5",
  "-rotate-[0.4deg] lg:rotate-[1.9deg] lg:translate-y-6",
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
// faint specks scattered down the whole page (behind everything)
const PAGE_STARS = Array.from({ length: 230 }, () => ({
  x: +(rnd() * 1600).toFixed(0),
  y: +(rnd() * 4200).toFixed(0),
  r: +(0.4 + rnd() * 0.9).toFixed(2),
  o: +(0.06 + rnd() * 0.22).toFixed(2),
  g: Math.floor(rnd() * 3),
}));

// gold-on-black engine palette (aurum)
const GOLD = "#d4a82c";
const GOLD_HI = "#f0cf6b";
const GOLD_DIM = "#8a6d1f";
const GOLD_FAINT = "#54430f";
const IVORY = "#e9dfc8";
const EMBER = "#c9713f";
const INK = "#0a0705";

/* ============================== SMALL PIECES ============================== */

// engraved section header: index + title + hairline + right-side readout
function SectionHead({ index, title, right }: { index: string; title: string; right?: string }) {
  return (
    <header className="mb-6 flex items-center gap-3 sm:gap-4">
      <span className="llv-mono border px-1.5 py-1 text-[8px] tracking-[0.2em]" style={{ borderColor: `${GOLD}40`, color: GOLD }}>
        {index}
      </span>
      <h2 className="llv-mono text-[9.5px] tracking-[0.34em] uppercase" style={{ color: GOLD_HI }}>
        {title}
      </h2>
      <span className="llv-panel-h-line" aria-hidden />
      {right && (
        <span className="llv-mono hidden text-[7.5px] tracking-[0.18em] uppercase md:inline" style={{ color: GOLD_DIM }}>
          {right}
        </span>
      )}
    </header>
  );
}

// the synastry engine — two ringed hearts of one machine, lens between (viewBox 420)
function SynastryEngine() {
  return (
    <svg viewBox="0 0 420 420" className="h-auto w-full" fill="none" aria-hidden>
      <defs>
        <radialGradient id="llv-lens-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={GOLD_HI} stopOpacity="0.5" />
          <stop offset="55%" stopColor={GOLD} stopOpacity="0.16" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* engine starfield */}
      {ENGINE_STARS.map((s, i) => (
        <circle key={i} className={`llv-tw${s.g}`} cx={s.x} cy={s.y} r={s.r} fill={IVORY} opacity={s.o} />
      ))}

      {/* outer static rings + ticks */}
      <circle cx="210" cy="210" r="202" stroke={GOLD} strokeWidth="0.8" opacity="0.5" />
      <circle cx="210" cy="210" r="196" stroke={GOLD} strokeWidth="0.5" strokeDasharray="1 5" opacity="0.45" />
      {ringTicks(210, 210, 186, 195, 96).map((t, i) => (
        <line key={`ot${i}`} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth={t.major ? 1 : 0.4} opacity={t.major ? 0.8 : 0.4} />
      ))}
      {[0, 90, 180, 270].map((a) => {
        const p = polar(210, 210, 176, a - 90);
        return (
          <text key={a} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="7" fill={GOLD_DIM} fontFamily="ui-monospace, Menlo, monospace">
            {a}°
          </text>
        );
      })}

      {/* axis lines */}
      <path d="M 8 210 H 412 M 210 8 V 412" stroke={GOLD} strokeWidth="0.4" strokeDasharray="3 7" opacity="0.35" />

      {/* left ring — the quesitent — slow drift */}
      <g className="llv-spin-l">
        <circle cx="168" cy="210" r="118" stroke={GOLD} strokeWidth="0.8" opacity="0.75" />
        {ringTicks(168, 210, 111, 118, 72).map((t, i) => (
          <line key={`lt${i}`} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth={t.major ? 0.9 : 0.35} opacity={t.major ? 0.7 : 0.35} />
        ))}
        {[40, 160, 280].map((a, i) => {
          const p = polar(168, 210, 118, a);
          return (
            <g key={`ln${i}`}>
              <circle cx={p.x} cy={p.y} r="3.6" stroke={GOLD} strokeWidth="0.8" fill={INK} />
              <circle cx={p.x} cy={p.y} r="1.1" fill={GOLD_HI} stroke="none" />
            </g>
          );
        })}
        {(() => {
          const p = polar(168, 210, 118, 215);
          return (
            <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="12" fill={GOLD_HI} opacity="0.9">
              {VENUS}
            </text>
          );
        })()}
      </g>

      {/* right ring — the other shore — counter drift */}
      <g className="llv-spin-r">
        <circle cx="252" cy="210" r="118" stroke={GOLD} strokeWidth="0.8" strokeDasharray="10 4 2 4" opacity="0.7" />
        {[75, 195, 315].map((a, i) => {
          const p = polar(252, 210, 118, a);
          return (
            <rect key={`rn${i}`} x={p.x - 2.4} y={p.y - 2.4} width="4.8" height="4.8" stroke={GOLD} strokeWidth="0.7" transform={`rotate(45 ${p.x} ${p.y})`} opacity="0.8" />
          );
        })}
        {(() => {
          const p = polar(252, 210, 118, 25);
          return (
            <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="12" fill={GOLD_HI} opacity="0.9">
              {MARS}
            </text>
          );
        })()}
      </g>

      {/* the lens where the two rings overlap */}
      <ellipse cx="210" cy="210" rx="40" ry="64" fill="url(#llv-lens-glow)" stroke="none" className="llv-pulse-slow" />
      <path d="M 168 210 H 252" stroke={GOLD} strokeWidth="0.5" strokeDasharray="2 4" opacity="0.6" />
      <circle cx="168" cy="210" r="4.4" stroke={GOLD} strokeWidth="0.9" fill={INK} />
      <circle cx="168" cy="210" r="1.4" fill={GOLD_HI} stroke="none" />
      <circle cx="252" cy="210" r="4.4" stroke={GOLD} strokeWidth="0.9" fill={INK} />
      <circle cx="252" cy="210" r="1.4" fill={GOLD_HI} stroke="none" />
      <path d={compassPath(210, 210, 24, 7)} stroke={GOLD_HI} strokeWidth="0.7" opacity="0.9" />
      <circle cx="210" cy="210" r="6" fill={GOLD_HI} stroke="none" className="llv-pulse" />
      <circle cx="210" cy="210" r="2" fill={INK} stroke="none" />

      {/* lens readouts */}
      <text x="210" y="132" textAnchor="middle" fontSize="7" fill={GOLD_DIM} fontFamily="ui-monospace, Menlo, monospace" letterSpacing="2">
        Δ 084°
      </text>
      <text x="210" y="292" textAnchor="middle" fontSize="7" fill={GOLD_DIM} fontFamily="ui-monospace, Menlo, monospace" letterSpacing="2">
        ORB 3.2°
      </text>
    </svg>
  );
}

// one of eight hand-drawn sigils for the card faces (drawn inside viewBox 100x140)
function CardSigil({ i }: { i: number }) {
  const v = i % 8;
  return (
    <g stroke={GOLD} fill="none">
      {v === 0 && (
        <>
          <circle cx="42" cy="62" r="15" strokeWidth="0.9" />
          <circle cx="58" cy="62" r="15" strokeWidth="0.9" />
          <path d={starPath(50, 62, 4, 6, 2)} stroke={GOLD_HI} strokeWidth="0.7" />
        </>
      )}
      {v === 1 && (
        <>
          <path d="M 38 42 V 82 M 62 42 V 82" strokeWidth="0.7" opacity="0.7" />
          <path d={crescentPath(51, 60, 13)} strokeWidth="0.9" />
          <circle cx="50" cy="60" r="2.2" fill={GOLD_HI} stroke="none" />
        </>
      )}
      {v === 2 && (
        <>
          <circle cx="50" cy="56" r="11" strokeWidth="0.9" />
          <path d="M 50 67 V 86 M 42 78 H 58" strokeWidth="0.9" />
          <path d={starPath(50, 56, 4, 4.5, 1.6)} stroke={GOLD_HI} strokeWidth="0.6" />
        </>
      )}
      {v === 3 && (
        <>
          <circle cx="50" cy="62" r="18" strokeWidth="0.9" />
          <circle cx="50" cy="62" r="11" strokeWidth="0.5" strokeDasharray="1 3" opacity="0.7" />
          <path d="M 50 44 V 80 M 32 62 H 68" strokeWidth="0.7" opacity="0.8" />
          {[45, 135, 225, 315].map((a) => {
            const p = polar(50, 62, 18, a);
            return <circle key={a} cx={p.x} cy={p.y} r="1.4" fill={GOLD_HI} stroke="none" />;
          })}
        </>
      )}
      {v === 4 && (
        <>
          <path d={starPath(50, 60, 8, 17, 6)} stroke={GOLD_HI} strokeWidth="0.8" />
          <circle cx="50" cy="60" r="2.4" fill={GOLD_HI} stroke="none" />
          <path d="M 38 84 q 6 4 12 0 q 6 -4 12 0" strokeWidth="0.6" opacity="0.7" />
        </>
      )}
      {v === 5 && (
        <>
          <path d={crescentPath(52, 58, 15)} strokeWidth="0.9" />
          <circle cx="40" cy="80" r="1.3" fill={GOLD} stroke="none" opacity="0.8" />
          <circle cx="60" cy="80" r="1.3" fill={GOLD} stroke="none" opacity="0.8" />
        </>
      )}
      {v === 6 && (
        <>
          <path d="M 36 48 H 64 C 64 62 57 68 50 68 C 43 68 36 62 36 48 Z" strokeWidth="0.9" />
          <path d="M 50 68 V 80 M 42 84 H 58" strokeWidth="0.9" />
          <path d="M 46 40 q 4 -6 8 0" stroke={GOLD_HI} strokeWidth="0.7" opacity="0.9" />
        </>
      )}
      {v === 7 && (
        <>
          <path d="M 30 52 H 46 C 46 62 42 66 38 66 C 34 66 30 62 30 52 Z" strokeWidth="0.8" />
          <path d="M 38 66 V 76 M 33 79 H 43" strokeWidth="0.8" />
          <path d="M 54 52 H 70 C 70 62 66 66 62 66 C 58 66 54 62 54 52 Z" strokeWidth="0.8" />
          <path d="M 62 66 V 76 M 57 79 H 67" strokeWidth="0.8" />
          <path d="M 46 44 q 4 -5 8 0" stroke={GOLD_HI} strokeWidth="0.7" />
        </>
      )}
    </g>
  );
}

// card face (revealed): frame, numeral, sigil — name and counsel set in HTML below
function CardFaceArt({ card }: { card: LoveCard }) {
  return (
    <svg viewBox="0 0 100 140" className="h-auto w-full" fill="none" aria-hidden>
      <rect x="2" y="2" width="96" height="136" stroke={GOLD} strokeWidth="0.9" />
      <rect x="5" y="5" width="90" height="130" stroke={GOLD} strokeWidth="0.45" strokeDasharray="1 3" opacity="0.55" />
      <path d="M 2 14 V 2 H 14 M 86 2 H 98 V 14 M 98 126 V 138 H 86 M 14 138 H 2 V 126" stroke={GOLD_HI} strokeWidth="0.8" opacity="0.8" />
      <text x="50" y="20" textAnchor="middle" fontSize="10" fill={GOLD_HI} fontFamily="Georgia, serif" letterSpacing="2">
        {card.n}
      </text>
      <path d="M 38 26 H 62" stroke={GOLD} strokeWidth="0.4" opacity="0.6" />
      <CardSigil i={card.sigil} />
      <path d="M 30 96 H 70" stroke={GOLD} strokeWidth="0.4" strokeDasharray="1 2" opacity="0.6" />
      <text x="50" y="128" textAnchor="middle" fontSize="5" fill={GOLD_DIM} fontFamily="ui-monospace, Menlo, monospace" letterSpacing="1.6">
        AMOR · AETERNVS
      </text>
    </svg>
  );
}

// card back (face-down): sealed plate of the love engine
function CardBackArt() {
  return (
    <svg viewBox="0 0 100 140" className="h-auto w-full" fill="none" aria-hidden>
      <rect x="2" y="2" width="96" height="136" stroke={GOLD} strokeWidth="0.9" opacity="0.85" />
      <rect x="5" y="5" width="90" height="130" stroke={GOLD} strokeWidth="0.45" strokeDasharray="1 3" opacity="0.5" />
      {ringTicks(50, 70, 30, 34, 36).map((t, i) => (
        <line key={i} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth="0.4" opacity="0.55" />
      ))}
      <circle cx="50" cy="70" r="26" stroke={GOLD} strokeWidth="0.7" opacity="0.8" />
      <circle cx="50" cy="70" r="21" stroke={GOLD} strokeWidth="0.4" strokeDasharray="1 3" opacity="0.6" />
      <path d={compassPath(50, 70, 17, 5)} stroke={GOLD_HI} strokeWidth="0.7" opacity="0.9" />
      <circle cx="50" cy="70" r="2.6" fill={GOLD_HI} stroke="none" className="llv-pulse-slow" />
      <path d={crescentPath(50, 24, 5)} stroke={GOLD} strokeWidth="0.7" opacity="0.8" />
      <path d={crescentPath(50, 116, 5)} stroke={GOLD} strokeWidth="0.7" opacity="0.8" transform="rotate(180 50 116)" />
      <text x="50" y="100" textAnchor="middle" fontSize="5" fill={GOLD_DIM} fontFamily="ui-monospace, Menlo, monospace" letterSpacing="1.6">
        SEALED
      </text>
    </svg>
  );
}

// pick three distinct cards from the love sample (client-side only)
function drawThree(): number[] {
  const pool = LOVE_CARDS.map((_, i) => i);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;
  }
  return pool.slice(0, 3);
}

/* ================================= PAGE =================================== */

export default function LoveThreeCardPage() {
  const [draw, setDraw] = useState<number[] | null>(null);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false]);
  const [dealKey, setDealKey] = useState(0);

  const cast = () => {
    setDraw(drawThree());
    setRevealed([false, false, false]);
    setDealKey((k) => k + 1);
  };
  const reveal = (i: number) =>
    setRevealed((r) => r.map((v, idx) => (idx === i ? true : v)));
  const revealAll = () => setRevealed([true, true, true]);

  const revealedCount = revealed.filter(Boolean).length;
  const allRevealed = draw !== null && revealedCount === 3;
  const tide = draw ? draw.reduce((acc, c) => acc + (c + 1) * 37.7, 0) % 100 : 0;
  const verdict = VERDICTS[Math.floor(tide / 25) % VERDICTS.length];

  return (
    <main className="llv-root relative min-h-screen overflow-x-clip" style={{ backgroundColor: INK, color: IVORY }}>
      <style>{LLV_CSS}</style>

      {/* hero starfield */}
      <svg viewBox="0 0 1600 900" className="pointer-events-none absolute inset-x-0 top-0 h-[720px] w-full" preserveAspectRatio="xMidYMin slice" fill="none" aria-hidden>
        {HERO_STARS.map((s, i) => (
          <circle key={i} className={`llv-tw${s.g}`} cx={s.x} cy={s.y} r={s.r} fill={IVORY} opacity={s.o} />
        ))}
      </svg>

      {/* deep background machinery: page specks, a giant twin-ring vesica
          bleeding off the right edge, huge arcs lower-left, construction lines */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <svg viewBox="0 0 1600 4200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMin slice" fill="none">
          {PAGE_STARS.map((s, i) => (
            <circle key={i} className={`llv-tw${s.g}`} cx={s.x} cy={s.y} r={s.r} fill={IVORY} opacity={s.o} />
          ))}
        </svg>

        {/* giant twin-ring vesica, mostly off-screen right */}
        <svg viewBox="0 0 600 600" className="absolute top-[4vh] -right-[46vmin] h-[140vmin] w-[140vmin] opacity-[0.06]" fill="none">
          <circle cx="300" cy="300" r="294" stroke={GOLD} strokeWidth="0.8" />
          <circle cx="300" cy="300" r="284" stroke={GOLD} strokeWidth="0.5" strokeDasharray="1 6" />
          <g className="llv-spin-b">
            {ringTicks(300, 300, 262, 280, 144).map((t, i) => (
              <line key={`wt${i}`} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth={t.major ? 1.1 : 0.4} />
            ))}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
              const p = polar(300, 300, 236, -75 + i * 30);
              return (
                <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="20" fill={GOLD}>
                  {i % 2 === 0 ? VENUS : MARS}
                </text>
              );
            })}
          </g>
          <circle cx="255" cy="300" r="150" stroke={GOLD} strokeWidth="0.6" />
          <circle cx="345" cy="300" r="150" stroke={GOLD} strokeWidth="0.6" strokeDasharray="12 5 2 5" />
          <path d="M 6 300 H 594 M 300 6 V 594" stroke={GOLD} strokeWidth="0.4" strokeDasharray="4 9" />
        </svg>

        {/* huge dashed arcs, mostly off-screen lower-left */}
        <svg viewBox="0 0 400 400" className="absolute top-[46%] -left-[30vmin] h-[88vmin] w-[88vmin] opacity-[0.05]" fill="none">
          <g className="llv-spin-a">
            <circle cx="200" cy="200" r="192" stroke={GOLD} strokeWidth="0.7" strokeDasharray="2 9" />
            <circle cx="200" cy="200" r="150" stroke={GOLD} strokeWidth="0.6" strokeDasharray="14 6 2 6" />
            {[25, 115, 205, 295].map((a, i) => {
              const p = polar(200, 200, 150, a);
              return <circle key={`an${i}`} cx={p.x} cy={p.y} r="3.4" stroke={GOLD} strokeWidth="0.8" fill={INK} />;
            })}
          </g>
          <circle cx="200" cy="200" r="108" stroke={GOLD} strokeWidth="0.5" />
          {ringTicks(200, 200, 100, 108, 72).map((t, i) => (
            <line key={`at${i}`} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth="0.35" />
          ))}
          <path d={starPath(200, 200, 8, 84, 30)} stroke={GOLD} strokeWidth="0.5" />
        </svg>

        {/* a second faint arc field near the bottom-right */}
        <svg viewBox="0 0 400 400" className="absolute top-[78%] -right-[24vmin] h-[64vmin] w-[64vmin] opacity-[0.045]" fill="none">
          <circle cx="200" cy="200" r="190" stroke={GOLD} strokeWidth="0.6" />
          <circle cx="200" cy="200" r="182" stroke={GOLD} strokeWidth="0.5" strokeDasharray="1 7" />
          <path d={polyPath(200, 200, 160, 12)} stroke={GOLD} strokeWidth="0.5" strokeDasharray="3 6" />
          <path d={compassPath(200, 200, 150, 40)} stroke={GOLD} strokeWidth="0.5" />
        </svg>

        {/* hairline construction lines crossing whole sections */}
        <span className="llv-line" style={{ top: "16%", transform: "rotate(-3.5deg)" }}>
          <b>SYNASTRY AXIS · Δ VENUS 214°</b>
        </span>
        <span className="llv-line" style={{ top: "43%" }}>
          <b>HOUSE VII CUSP · PARTNERSHIPS</b>
        </span>
        <span className="llv-line" style={{ top: "71%", transform: "rotate(2.4deg)" }}>
          <b>DECLINATION OF THE HEART +18°26&prime;</b>
        </span>
        <span className="llv-line" style={{ top: "92%", transform: "rotate(-1.2deg)" }}>
          <b>TIDE LINE · MUTABLE WATER</b>
        </span>
      </div>

      <div className="llv-vignette pointer-events-none absolute inset-0" aria-hidden />

      {/* restrained grunge layer: candlelight, soot, grain — fixed over the page */}
      <div className="pointer-events-none fixed inset-0 z-30" aria-hidden>
        <span className="llv-candle absolute inset-0" />
        <span className="llv-soot llv-soot-a" />
        <span className="llv-soot llv-soot-b" />
        <span className="llv-soot llv-soot-c" />
        <span className="llv-grain absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 pb-8 sm:px-6">
        {/* ============================ TOP BAR ============================ */}
        <header className="llv-panel mt-4 flex items-center gap-4 px-3 py-2 sm:px-4">
          <a href="#" className="flex items-center gap-2.5">
            <span className="llv-inset flex h-7 w-7 items-center justify-center">
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden>
                <path d={compassPath(10, 10, 8, 3)} stroke={GOLD_HI} strokeWidth="0.9" />
                <circle cx="10" cy="10" r="2" fill={GOLD} stroke="none" />
              </svg>
            </span>
            <span className="llv-serif text-[15px] tracking-[0.3em]" style={{ color: GOLD_HI }}>
              ASTRO&nbsp;SCOPE
            </span>
          </a>
          <nav className="llv-mono ml-auto hidden items-center gap-5 text-[8.5px] tracking-[0.24em] uppercase md:flex">
            {["Spreads", "Love Hub", "Daily Card"].map((l) => (
              <a key={l} href="#" className="llv-navlink">
                {l}
              </a>
            ))}
          </nav>
          <a href="#llv-spread" className="llv-btn-ghost llv-mono ml-auto px-3.5 py-1.5 text-[8.5px] tracking-[0.24em] uppercase md:ml-0">
            Cast Now
          </a>
          <span className="llv-mono hidden text-[7px] tracking-[0.18em] lg:inline" style={{ color: GOLD_DIM }}>
            DECK 78 · SAMPLE 08 · SHUFFLED
          </span>
        </header>

        {/* ============================== HERO ==============================
            full-bleed: editorial left column; the synastry engine card bleeds
            off the right edge of the viewport */}
        <section className="relative left-1/2 mt-10 w-screen -translate-x-1/2 lg:mt-16 lg:min-h-[620px]">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            {/* left editorial column, with a vertical degree ruler */}
            <div className="relative max-w-xl pl-6 sm:pl-8">
              <span className="llv-ruler" aria-hidden />
              <p className="llv-mono text-[8.5px] tracking-[0.4em] uppercase" style={{ color: GOLD }}>
                Love Spread Nº 03 · Three Cards · You / Them / The Tide
              </p>
              <h1 className="llv-serif llv-glow mt-5 max-w-xl text-[42px] leading-[1.04] sm:text-[58px]" style={{ color: GOLD_HI }}>
                Two charts. One question.
              </h1>
              <p className="mt-6 max-w-md text-[12.5px] leading-relaxed" style={{ color: `${IVORY}b8` }}>
                The oldest love spread in the deck: one card for where you stand, one for the weather on their
                side of the water, one for the current that runs between. Cast below — the engine deals in
                staggered threes, and the tide readout only opens when all three are face-up.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a href="#llv-spread" className="llv-btn llv-mono px-7 py-3.5 text-[10px] tracking-[0.26em] uppercase">
                  Cast the three cards
                </a>
                <a href="#llv-how" className="llv-btn-ghost llv-mono px-6 py-3.5 text-[10px] tracking-[0.22em] uppercase">
                  How to read them →
                </a>
              </div>
              {/* hero stat strip */}
              <dl className="llv-mono mt-10 grid max-w-md grid-cols-3 border-t text-[7.5px] tracking-[0.16em] uppercase" style={{ borderColor: `${GOLD}2b` }}>
                {[
                  ["Spreads cast", "88,214"],
                  ["Positions", "03"],
                  ["Cost", "Free · always"],
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
          </div>

          {/* the synastry engine card, bleeding off the right viewport edge */}
          <div className="relative mx-auto mt-12 max-w-[540px] px-4 sm:px-6 lg:absolute lg:top-1/2 lg:right-[-7vw] lg:mt-0 lg:w-[min(46vw,640px)] lg:max-w-none lg:-translate-y-1/2 lg:px-0">
            <div className="llv-panel relative lg:rotate-[0.6deg]">
              <header className="llv-panel-h">
                <span className="llv-mono text-[7.5px] tracking-[0.2em]" style={{ color: GOLD_DIM }}>
                  FIG. 01 — TWIN ASSEMBLY
                </span>
                <span className="llv-panel-h-line" aria-hidden />
                <span className="llv-serif text-[10px] tracking-[0.36em]" style={{ color: GOLD_HI }}>
                  {VENUS} SYNASTRY ENGINE {MARS}
                </span>
                <span className="llv-panel-h-line" aria-hidden />
                <span className="llv-mono text-[7.5px] tracking-[0.2em]" style={{ color: GOLD_DIM }}>
                  SYNC 88.2%
                </span>
              </header>
              <div className="relative p-2 sm:p-3">
                <SynastryEngine />
                {/* faint handling marks on the glass */}
                <span className="llv-smudge llv-smudge-a" aria-hidden />
                <span className="llv-smudge llv-smudge-b" aria-hidden />
              </div>
              <footer className="llv-mono flex items-center justify-between border-t px-3 py-1.5 text-[7px] tracking-[0.16em] uppercase" style={{ borderColor: `${GOLD}22`, color: GOLD_DIM }}>
                <span>ASPECTS · APPLYING</span>
                <span className="hidden sm:inline">ORB LIMIT 3.2° · TROPICAL</span>
                <span>ΔT +0.042S</span>
              </footer>
            </div>
            {/* readout chips floating around the engine */}
            {CHIPS.map((c) => (
              <span
                key={c.name}
                className={`llv-chip llv-mono absolute z-10 flex items-center gap-1.5 px-2 py-1 text-[8px] tracking-[0.14em] ${c.cls}`}
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

        {/* ======================= THE SPREAD — CENTERPIECE ==================
            full-bleed board, tilted and shifted right; the three slots sit at
            broken offsets, position chips straddle the card borders, a dashed
            thread runs behind the row */}
        <section id="llv-spread" className="relative left-1/2 mt-14 w-screen -translate-x-1/2 scroll-mt-8 lg:mt-28">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <SectionHead index="02" title="The spread — cast three cards" right="DECK 78 · LOVE SAMPLE 08 · SEALED" />
            <p className="mb-8 max-w-lg text-[11px] leading-relaxed" style={{ color: `${IVORY}99` }}>
              Hold the question steady, then cast. The engine deals three sealed plates — turn each one over in
              your own time. When all three face up, the tide readout opens along the board&rsquo;s lower rail.
            </p>

            <div className="relative">
              {/* giant faint Venus behind the board */}
              <span className="llv-serif pointer-events-none absolute -top-24 -right-4 hidden text-[220px] leading-none opacity-[0.05] select-none lg:block" style={{ color: GOLD }} aria-hidden>
                {VENUS}
              </span>

              <div className="llv-panel relative lg:ml-8 lg:rotate-[0.45deg]">
                {/* readout straddling the top border */}
                <span className="llv-chip llv-mono absolute -top-2.5 left-8 z-20 px-2 py-0.5 text-[7px] tracking-[0.2em]" style={{ color: GOLD_DIM }}>
                  Δ AMOR · FIG. 02 · THREE POSITIONS
                </span>
                <header className="llv-panel-h">
                  <span style={{ color: GOLD }}>SPREAD OF THREE — LOVE DIVISION</span>
                  <span className="llv-panel-h-line" aria-hidden />
                  <span className="llv-mono text-[7.5px] tracking-[0.2em]" style={{ color: GOLD_DIM }}>
                    {draw ? `DEALT Nº ${String(dealKey).padStart(3, "0")} · ${revealedCount}/3 FACE-UP` : "AWAITING CAST"}
                  </span>
                </header>

                <div className="relative px-4 py-12 sm:px-8 sm:py-14">
                  {/* dashed thread running behind the row, with node glyphs */}
                  <span className="llv-thread top-1/2 right-[10%] left-[10%] hidden sm:block" aria-hidden />
                  <span className="llv-mono pointer-events-none absolute top-1/2 left-[33%] hidden -translate-x-1/2 -translate-y-1/2 bg-[#0d0906] px-1.5 text-[11px] sm:block" style={{ color: GOLD_DIM }} aria-hidden>
                    {VENUS}
                  </span>
                  <span className="llv-mono pointer-events-none absolute top-1/2 left-[67%] hidden -translate-x-1/2 -translate-y-1/2 bg-[#0d0906] px-1.5 text-[11px] sm:block" style={{ color: GOLD_DIM }} aria-hidden>
                    {MARS}
                  </span>

                  <div className="relative z-10 flex flex-wrap items-start justify-center gap-10 sm:gap-14 lg:gap-16">
                    {POSITIONS.map((pos, i) => {
                      const card = draw ? LOVE_CARDS[draw[i]] : null;
                      return (
                        <div key={pos.n} className={`relative flex flex-col items-center ${SLOT_TF[i]}`}>
                          {/* position chip straddling the card's top border */}
                          <span className="llv-chip llv-mono absolute -top-3 left-1/2 z-20 -translate-x-1/2 px-2 py-0.5 text-[7px] tracking-[0.24em]" style={{ color: GOLD }}>
                            {pos.tag}
                          </span>

                          {card ? (
                            <button
                              key={`${dealKey}-${i}`}
                              type="button"
                              onClick={() => reveal(i)}
                              aria-pressed={revealed[i]}
                              aria-label={`Reveal card for position ${pos.name}`}
                              className="llv-flip llv-deal block w-[148px] sm:w-[168px]"
                              style={{ animationDelay: `${i * 0.22}s` }}
                            >
                              <span className={`llv-flip-inner block aspect-[5/7] w-full ${revealed[i] ? "llv-open" : ""}`}>
                                {/* sealed back */}
                                <span className="llv-face llv-backface block">
                                  <CardBackArt />
                                </span>
                                {/* revealed face */}
                                <span className="llv-face llv-frontface llv-panel flex flex-col p-2">
                                  <span className="block">
                                    <CardFaceArt card={card} />
                                  </span>
                                  <span className="llv-serif mt-1.5 block text-center text-[12.5px] leading-tight" style={{ color: GOLD_HI }}>
                                    {card.name}
                                  </span>
                                  <span className="llv-mono mt-1 block text-center text-[5.8px] tracking-[0.22em]" style={{ color: GOLD_DIM }}>
                                    {card.suit}
                                  </span>
                                  <span className="mt-1.5 block text-center text-[8px] leading-snug" style={{ color: `${IVORY}b8` }}>
                                    {card.line}
                                  </span>
                                </span>
                              </span>
                            </button>
                          ) : (
                            <div className="llv-slot flex aspect-[5/7] w-[148px] flex-col items-center justify-center gap-2 sm:w-[168px]">
                              <span className="llv-serif text-[22px]" style={{ color: GOLD_DIM }}>
                                {pos.n}
                              </span>
                              <span className="llv-mono text-[6.5px] tracking-[0.3em]" style={{ color: GOLD_FAINT }}>
                                AWAITING CAST
                              </span>
                            </div>
                          )}

                          <p className="llv-serif mt-5 text-[14px]" style={{ color: GOLD_HI }}>
                            {pos.name}
                          </p>
                          <p className="llv-mono mt-1 max-w-[170px] text-center text-[6.5px] leading-relaxed tracking-[0.2em]" style={{ color: GOLD_DIM }}>
                            {pos.q}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* tide readout rail */}
                <footer className="llv-mono flex flex-wrap items-center justify-between gap-x-6 gap-y-1.5 border-t px-3 py-2 text-[7px] tracking-[0.18em] uppercase" style={{ borderColor: `${GOLD}22`, color: GOLD_DIM }}>
                  <span>POSITIONS 03 · YOU / THEM / TIDE</span>
                  <span className="tabular-nums" style={{ color: allRevealed ? GOLD_HI : GOLD_DIM }}>
                    {allRevealed ? `TIDE INDEX +${tide.toFixed(1)} · ${verdict}` : `REVEAL ALL THREE TO READ THE TIDE · ${revealedCount}/3`}
                  </span>
                </footer>
              </div>

              {/* controls, hanging off the board's lower-right corner */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 lg:justify-end lg:pr-10">
                <button type="button" onClick={cast} className="llv-btn llv-mono cursor-pointer px-7 py-3 text-[9.5px] tracking-[0.26em] uppercase">
                  {draw ? "Cast again" : "Cast the spread"}
                </button>
                <button
                  type="button"
                  onClick={revealAll}
                  disabled={!draw || allRevealed}
                  className="llv-btn-ghost llv-mono cursor-pointer px-6 py-3 text-[9.5px] tracking-[0.22em] uppercase disabled:cursor-default disabled:opacity-35"
                >
                  Reveal all three
                </button>
                <span className="llv-mono hidden text-[6.5px] tracking-[0.2em] uppercase lg:inline" style={{ color: GOLD_FAINT }}>
                  SHUFFLE · FISHER-YATES · NO MEMORY
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ======================== HOW TO READ ============================
            engraved rail, three rites at broken heights */}
        <section id="llv-how" className="mt-16 scroll-mt-8 lg:mt-32 lg:ml-10">
          <SectionHead index="03" title="How to read the three positions" right="THREE RITES · ORDER MATTERS" />
          <div className="relative">
            <span className="llv-rail absolute top-[27px] right-4 left-4 hidden md:block" aria-hidden />
            <ol className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
              {RITES.map((s, i) => (
                <li
                  key={s.n}
                  className={`relative flex flex-col items-center text-center ${i === 1 ? "md:translate-y-10" : ""} ${i === 2 ? "md:translate-y-4" : ""}`}
                >
                  <span className="llv-medallion relative z-10 flex h-14 w-14 items-center justify-center">
                    <svg viewBox="0 0 56 56" className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
                      <circle cx="28" cy="28" r="26" stroke={GOLD} strokeWidth="0.8" opacity="0.7" />
                      {ringTicks(28, 28, 22, 26, 24, i * 7).map((t, k) => (
                        <line key={k} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth="0.5" opacity="0.5" />
                      ))}
                      <circle cx="28" cy="28" r="18" stroke={GOLD} strokeWidth="0.5" strokeDasharray="1 3" opacity="0.6" />
                    </svg>
                    <span className="llv-serif text-[15px]" style={{ color: GOLD_HI }}>
                      {s.n}
                    </span>
                  </span>
                  <h3 className="llv-serif mt-4 text-[14.5px]" style={{ color: GOLD_HI }}>
                    {s.t}
                  </h3>
                  <p className="mt-1.5 max-w-[260px] text-[9.5px] leading-relaxed" style={{ color: `${IVORY}99` }}>
                    {s.c}
                  </p>
                  <p className="llv-mono mt-2 text-[6.5px] tracking-[0.24em]" style={{ color: GOLD_DIM }}>
                    {s.micro}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ========================= FAQ — ARCHIVE ========================== */}
        <section className="relative mt-16 lg:mt-32 lg:ml-[6%]">
          <span className="llv-serif pointer-events-none absolute -top-16 -right-8 hidden text-[190px] leading-none opacity-[0.045] select-none lg:block" style={{ color: GOLD }} aria-hidden>
            {LUNA}
          </span>
          <SectionHead index="04" title="Archive entries — frequently asked" right="3 RECORDS · PUBLIC" />
          <div className="llv-panel lg:rotate-[-0.3deg]">
            <ul className="grid grid-cols-1 md:grid-cols-3">
              {ARCHIVE.map((e, i) => (
                <li
                  key={e.q}
                  className={`flex gap-4 p-5 ${i > 0 ? "border-t md:border-t-0 md:border-l" : ""}`}
                  style={{ borderColor: `${GOLD}1a` }}
                >
                  <span className="llv-mono shrink-0 text-[8px] tracking-[0.14em]" style={{ color: GOLD_FAINT }}>
                    REC-{String(i + 1).padStart(3, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="llv-serif block text-[13.5px] leading-snug" style={{ color: GOLD_HI }}>
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

        {/* ============================== CTA ==============================
            band spills wider than the content column; readout crosses border */}
        <section className="llv-panel relative mt-16 px-4 py-12 text-center sm:py-16 lg:mt-28 lg:-mx-10">
          <span className="llv-chip llv-mono absolute top-1/2 -left-2.5 z-10 hidden origin-top-left -rotate-90 px-2 py-0.5 text-[7px] tracking-[0.24em] lg:block" style={{ color: GOLD_DIM }}>
            SEQ. 000 · FINAL INVOCATION
          </span>
          <svg viewBox="0 0 120 120" className="pointer-events-none absolute top-3 left-3 h-16 w-16 opacity-40" fill="none" stroke={GOLD} strokeWidth="0.8" aria-hidden>
            <path d="M 6 60 H 60 M 60 6 V 60" />
            <path d={compassPath(60, 60, 50, 12)} opacity="0.6" />
          </svg>
          <svg viewBox="0 0 120 120" className="pointer-events-none absolute right-3 bottom-3 h-16 w-16 rotate-180 opacity-40" fill="none" stroke={GOLD} strokeWidth="0.8" aria-hidden>
            <path d="M 6 60 H 60 M 60 6 V 60" />
            <path d={compassPath(60, 60, 50, 12)} opacity="0.6" />
          </svg>
          <p className="llv-mono text-[8px] tracking-[0.42em] uppercase" style={{ color: GOLD_DIM }}>
            Final Invocation · Seq. 000
          </p>
          <h2 className="llv-serif llv-glow mx-auto mt-4 max-w-2xl text-[28px] leading-snug sm:text-[38px]" style={{ color: GOLD_HI }}>
            Some questions deserve three cards, not three hundred messages.
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="#llv-spread" className="llv-btn llv-mono px-8 py-3.5 text-[10.5px] tracking-[0.26em] uppercase">
              Cast the three cards
            </a>
            <a href="#" className="llv-btn-ghost llv-mono px-7 py-3.5 text-[10.5px] tracking-[0.26em] uppercase">
              Free synastry chart →
            </a>
          </div>
          <p className="llv-mono mt-5 text-[7.5px] tracking-[0.24em]" style={{ color: GOLD_DIM }}>
            NO CARD REQUIRED · THE TIDE DOES NOT KEEP RECORDS
          </p>
        </section>

        {/* ============================= FOOTER ============================= */}
        <footer className="mt-16 lg:mt-24">
          <div className="llv-mono relative left-1/2 flex w-screen -translate-x-1/2 flex-wrap items-center justify-center gap-x-6 gap-y-1.5 border-y px-3 py-3 text-[8px] tracking-[0.26em] uppercase" style={{ borderColor: `${GOLD}2b`, color: GOLD }}>
            <span>22 Major Arcana</span>
            <span style={{ color: GOLD_FAINT }}>·</span>
            <span>4 Suits</span>
            <span style={{ color: GOLD_FAINT }}>·</span>
            <span>1 Tide</span>
          </div>
          <div className="llv-mono flex flex-wrap items-center gap-x-6 gap-y-1.5 px-1 py-4 text-[7.5px] tracking-[0.18em] uppercase" style={{ color: GOLD_DIM }}>
            <span style={{ color: GOLD }}>© 2026 ASTRO SCOPE — ALL HEARTS RESERVED</span>
            <nav className="flex items-center gap-4">
              {["Spreads", "Love Hub", "Daily Card", "Sign In"].map((l) => (
                <a key={l} href="#" className="llv-navlink">
                  {l}
                </a>
              ))}
            </nav>
            <span className="ml-auto">LOVE BUILD 3.1.4 · ENGINE NOMINAL · DEALT IN 0.042S</span>
          </div>
        </footer>
      </div>
    </main>
  );
}

/* ============================ SCOPED STYLES =============================== */

const LLV_CSS = `
.llv-root { font-family: Georgia, 'Times New Roman', serif; }
.llv-serif { font-family: Georgia, 'Times New Roman', serif; }
.llv-mono { font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace; }

.llv-panel {
  position: relative;
  border: 1px solid rgba(212,168,44,.28);
  background:
    linear-gradient(180deg, rgba(212,168,44,.055), rgba(212,168,44,0) 38%),
    rgba(16,11,6,.6);
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.65), 0 0 22px rgba(0,0,0,.4);
}
.llv-panel::after {
  content: "";
  position: absolute; inset: 3px;
  border: 1px solid rgba(212,168,44,.1);
  pointer-events: none;
}
.llv-inset {
  border: 1px solid rgba(212,168,44,.18);
  background: rgba(0,0,0,.35);
  box-shadow: inset 0 1px 4px rgba(0,0,0,.6);
}
.llv-panel-h {
  display: flex; align-items: center; gap: 10px;
  padding: 6px 10px;
  border-bottom: 1px solid rgba(212,168,44,.22);
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 8.5px; letter-spacing: .3em; text-transform: uppercase;
}
.llv-panel-h-line {
  flex: 1; height: 1px;
  background: linear-gradient(90deg, rgba(212,168,44,.4), rgba(212,168,44,.05));
}

.llv-navlink { color: rgba(233,223,200,.6); transition: color .25s ease; }
.llv-navlink:hover { color: #f0cf6b; }

.llv-btn {
  display: inline-block;
  color: #0a0705;
  background: linear-gradient(180deg, #f0cf6b, #d4a82c 55%, #a8841f);
  border: 1px solid #f0cf6b;
  box-shadow: 0 0 18px rgba(212,168,44,.35), inset 0 1px 0 rgba(255,244,214,.6);
  transition: box-shadow .3s ease;
}
.llv-btn:hover { box-shadow: 0 0 26px rgba(212,168,44,.55), inset 0 1px 0 rgba(255,244,214,.7); }
.llv-btn-ghost {
  display: inline-block;
  color: #d4a82c;
  border: 1px solid rgba(212,168,44,.5);
  background: rgba(212,168,44,.06);
  transition: background-color .3s ease, color .3s ease;
}
.llv-btn-ghost:hover { background: rgba(212,168,44,.14); color: #f0cf6b; }

.llv-chip {
  border: 1px solid rgba(212,168,44,.45);
  background: rgba(10,7,5,.88);
  box-shadow: 0 0 14px rgba(0,0,0,.6), inset 0 0 8px rgba(212,168,44,.1);
}

/* vertical degree ruler on the hero's left edge */
.llv-ruler {
  position: absolute; left: 0; top: 2px; bottom: 2px; width: 10px;
  border-left: 1px solid rgba(212,168,44,.35);
  background-image: repeating-linear-gradient(180deg, rgba(212,168,44,.5) 0 1px, transparent 1px 11px);
  background-size: 6px 100%;
  background-repeat: no-repeat;
  opacity: .8;
}

/* engraved rail connecting the rite medallions */
.llv-rail {
  height: 8px;
  border-top: 1px solid rgba(212,168,44,.4);
  border-bottom: 1px solid rgba(212,168,44,.14);
  background-image: repeating-linear-gradient(90deg, rgba(212,168,44,.55) 0 1px, transparent 1px 9px);
  background-size: 100% 4px;
  background-position: 0 2px;
  background-repeat: no-repeat;
}

.llv-medallion {
  background: #0a0705;
  border-radius: 9999px;
  box-shadow: 0 0 18px rgba(212,168,44,.22), inset 0 0 10px rgba(212,168,44,.14);
}

.llv-vignette {
  background:
    radial-gradient(1200px 500px at 78% -8%, rgba(212,168,44,.10), transparent 60%),
    radial-gradient(900px 600px at 8% 4%, rgba(212,168,44,.05), transparent 55%);
}

/* hairline construction lines crossing whole sections (drafting-style) */
.llv-line {
  position: absolute; left: -6vw; right: -6vw; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(212,168,44,.16) 10%, rgba(212,168,44,.16) 90%, transparent);
}
.llv-line::after {
  content: "+";
  position: absolute; left: 10vw; top: -7px;
  color: rgba(212,168,44,.4);
  font: 11px ui-monospace, Menlo, monospace;
}
.llv-line > b {
  position: absolute; right: 7vw; top: -4px;
  padding: 0 7px;
  background: #0a0705;
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 7px; font-weight: 400; letter-spacing: .26em;
  color: rgba(138,109,31,.9);
}

.llv-glow { text-shadow: 0 0 16px rgba(212,168,44,.45), 0 0 46px rgba(212,168,44,.2); }

::selection { background: rgba(212,168,44,.35); color: #fff6dd; }

/* ---------- the interactive spread ---------- */
/* dashed thread running behind the three slots */
.llv-thread {
  position: absolute; height: 1px;
  background: repeating-linear-gradient(90deg, rgba(212,168,44,.5) 0 6px, transparent 6px 12px);
  opacity: .6;
}
/* empty slot before the first cast */
.llv-slot {
  border: 1px dashed rgba(212,168,44,.35);
  background: rgba(212,168,44,.03);
  box-shadow: inset 0 0 14px rgba(0,0,0,.5);
}
/* 3D flip */
.llv-flip { perspective: 1100px; background: none; border: 0; padding: 0; cursor: pointer; }
.llv-flip:focus-visible { outline: 1px solid rgba(240,207,107,.7); outline-offset: 4px; }
.llv-flip-inner {
  position: relative;
  transform-style: preserve-3d;
  transition: transform .9s cubic-bezier(.22,.7,.24,1);
}
.llv-flip-inner.llv-open { transform: rotateY(180deg); }
.llv-face {
  position: absolute; inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.llv-backface { filter: drop-shadow(0 6px 14px rgba(0,0,0,.55)); }
.llv-frontface { transform: rotateY(180deg); overflow: hidden; }
.llv-flip:hover .llv-flip-inner { transform: scale(1.03); }
.llv-flip:hover .llv-flip-inner.llv-open { transform: rotateY(180deg) scale(1.03); }

/* staggered deal */
@keyframes llvDeal {
  0% { opacity: 0; transform: translateY(-34px) rotate(-5deg) scale(.94); }
  60% { opacity: 1; }
  100% { opacity: 1; transform: none; }
}

/* ---------- restrained age & handling: aged, not destroyed ---------- */
.llv-panel::before {
  content: "";
  position: absolute; inset: 0;
  pointer-events: none;
  background:
    linear-gradient(114deg, transparent 0 46%, rgba(0,0,0,.18) 46.15%, rgba(240,207,107,.05) 46.3%, transparent 46.5%),
    linear-gradient(61deg, transparent 0 79%, rgba(0,0,0,.13) 79.15%, transparent 79.4%),
    radial-gradient(150px 90px at 86% 10%, rgba(84,67,15,.16), transparent 70%),
    radial-gradient(190px 130px at 5% 90%, rgba(60,45,10,.13), transparent 70%),
    radial-gradient(90px 70px at 55% 105%, rgba(84,67,15,.1), transparent 70%);
}

/* dust / paper grain over the whole page (inline feTurbulence) */
.llv-grain {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>");
  background-size: 180px 180px;
  opacity: .055;
}

/* warm candlelight breathing in from the lower-left */
.llv-candle {
  background:
    radial-gradient(820px 640px at -8% 108%, rgba(201,113,63,.13), transparent 62%),
    radial-gradient(1250px 820px at -4% 104%, rgba(212,168,44,.07), transparent 55%);
}

/* soot/smoke smudges in the corners */
.llv-soot {
  position: absolute;
  border-radius: 9999px;
  background: radial-gradient(closest-side, rgba(0,0,0,.5), rgba(0,0,0,.18) 55%, transparent 72%);
  filter: blur(28px);
}
.llv-soot-a { width: 44vmax; height: 34vmax; top: -14vmax; right: -12vmax; }
.llv-soot-b { width: 38vmax; height: 30vmax; bottom: -12vmax; left: -10vmax; opacity: .85; }
.llv-soot-c { width: 26vmax; height: 20vmax; top: -8vmax; left: -6vmax; opacity: .55; }

/* fingerprint-ish smears on the engine glass */
.llv-smudge {
  position: absolute;
  pointer-events: none;
  border-radius: 9999px;
  background: radial-gradient(ellipse at center, rgba(233,223,200,.07), rgba(233,223,200,.02) 45%, transparent 68%);
  filter: blur(5px);
}
.llv-smudge-a { width: 34%; height: 22%; top: 16%; right: 6%; transform: rotate(-24deg); }
.llv-smudge-b { width: 26%; height: 17%; bottom: 12%; left: 9%; transform: rotate(31deg); }

/* ---------- slow, CSS-only motion (15–180s), reduced-motion guarded ------- */
@keyframes llvSpin { to { transform: rotate(360deg); } }
@keyframes llvSpinRev { to { transform: rotate(-360deg); } }
@keyframes llvPulse { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }
@keyframes llvTw { 0%, 100% { opacity: .15; } 50% { opacity: .8; } }
/* irregular, very subtle candle flicker */
@keyframes llvFlicker {
  0%, 100% { opacity: 1; }
  23% { opacity: .86; }
  41% { opacity: .95; }
  57% { opacity: .78; }
  74% { opacity: .92; }
  89% { opacity: .84; }
}
/* soot drift — barely perceptible */
@keyframes llvSootA { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-4%, 5%) scale(1.1); } }
@keyframes llvSootB { 0%, 100% { transform: translate(0, 0) scale(1.06); } 50% { transform: translate(5%, -4%) scale(0.95); } }

.llv-spin-a, .llv-spin-b { transform-box: view-box; transform-origin: center; }
/* the twin rings turn about their own centers, not the viewBox center */
.llv-spin-l { transform-box: view-box; transform-origin: 168px 210px; }
.llv-spin-r { transform-box: view-box; transform-origin: 252px 210px; }

@media (prefers-reduced-motion: no-preference) {
  .llv-deal { animation: llvDeal .8s cubic-bezier(.2,.7,.3,1) both; }
  .llv-spin-a { animation: llvSpin 170s linear infinite; }
  .llv-spin-b { animation: llvSpinRev 130s linear infinite; }
  .llv-spin-l { animation: llvSpin 150s linear infinite; }
  .llv-spin-r { animation: llvSpinRev 118s linear infinite; }
  .llv-pulse { animation: llvPulse 15s ease-in-out infinite; }
  .llv-pulse-slow { animation: llvPulse 22s ease-in-out infinite 4s; }
  .llv-tw0 { animation: llvTw 23s ease-in-out infinite; }
  .llv-tw1 { animation: llvTw 31s ease-in-out infinite 7s; }
  .llv-tw2 { animation: llvTw 27s ease-in-out infinite 13s; }
  .llv-candle { animation: llvFlicker 13s ease-in-out infinite; }
  .llv-soot-a { animation: llvSootA 165s ease-in-out infinite; }
  .llv-soot-b { animation: llvSootB 145s ease-in-out infinite 9s; }
}

@media (prefers-reduced-motion: reduce) {
  .llv-flip-inner { transition: none; }
}
`;
