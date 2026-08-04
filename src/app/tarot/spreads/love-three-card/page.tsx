"use client";

import { useState } from "react";

// TAROT / LOVE THREE-CARD — a working TOOL page, not a landing: compact
// header, tarot cross-nav tabs, and the spread itself immediately usable at
// the top, with two entry plates (YOU / THEM — first names required,
// birth dates optional) gating the cast; slots and the tide verdict
// personalize with the names. Explainer and FAQ are condensed below. Palette is PRODUCTION
// (lab/remix-v2): deep violet-ink #0a0912, text #e9e6f2/#b7b1cc, gold
// #f3c77a/#e39a4c/#ffdd9c, deep gold #c9a227, violet #a25adf/#b794f6.
// Broken + magic stays: twin-ring vesica and dashed arc fields bleed off
// the viewport behind translucent panels, hairline construction lines cross
// whole sections, giant dim glyphs drift, the board is tilted with slots at
// broken offsets and chips straddling borders. Mechanics: cast deals three
// sealed plates from a built-in 8-card love sample (staggered CSS deal),
// each flips open on click; the tide readout opens at 3/3 face-up.
// Self-contained: inline SVG + Tailwind + one scoped <style> block (llv-
// prefixed). Ambient motion CSS-only, slow, reduced-motion guarded.

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

/* ========================= PRODUCTION PALETTE ============================= */

const INK = "#0a0912"; // rgb(10,9,18) page ground
const TEXT_HI = "#e9e6f2";
const TEXT_LO = "#b7b1cc";
const GOLD = "#f3c77a"; // accent primary
const GOLD_MID = "#e39a4c"; // warm secondary gold
const GOLD_HI = "#ffdd9c"; // cream highlight
const GOLD_DEEP = "#c9a227"; // deep gold for hairlines
const VIOLET = "#a25adf";
const VIOLET_SOFT = "#b794f6";

/* ================================= DATA =================================== */

const GLYPH_FE0E = "︎";

const VENUS = "♀" + GLYPH_FE0E;
const MARS = "♂" + GLYPH_FE0E;
const LUNA = "☽" + GLYPH_FE0E;

// tarot cross-nav: all seven tarot pages, this one active
const TAROT_NAV = [
  { label: "Tarot Hub", href: "/tarot", active: false },
  { label: "Daily Card", href: "/tarot/spreads/daily-card", active: false },
  { label: "Yes / No", href: "/tarot/spreads/yes-no", active: false },
  { label: "Past · Present · Future", href: "/tarot/spreads/past-present-future", active: false },
  { label: "Love Three-Card", href: "/tarot/spreads/love-three-card", active: true },
  { label: "Birth Arcana", href: "/tarot/birth-arcana", active: false },
  { label: "All Cards", href: "/tarot/cards", active: false },
];

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
// faint specks scattered down the whole page (behind everything)
const PAGE_STARS = Array.from({ length: 230 }, () => ({
  x: +(rnd() * 1600).toFixed(0),
  y: +(rnd() * 4200).toFixed(0),
  r: +(0.4 + rnd() * 0.9).toFixed(2),
  o: +(0.06 + rnd() * 0.22).toFixed(2),
  g: Math.floor(rnd() * 3),
}));

/* ============================== SMALL PIECES ============================== */

// engraved section header: index + title + hairline + right-side readout
function SectionHead({ index, title, right }: { index: string; title: string; right?: string }) {
  return (
    <header className="mb-5 flex items-center gap-3 sm:gap-4">
      <span className="llv-mono border px-1.5 py-1 text-[8px] tracking-[0.2em]" style={{ borderColor: "rgba(243,199,122,0.3)", color: GOLD }}>
        {index}
      </span>
      <h2 className="llv-mono text-[9.5px] tracking-[0.34em] uppercase" style={{ color: GOLD_HI }}>
        {title}
      </h2>
      <span className="llv-panel-h-line" aria-hidden />
      {right && (
        <span className="llv-mono hidden text-[7.5px] tracking-[0.18em] uppercase md:inline" style={{ color: GOLD_MID }}>
          {right}
        </span>
      )}
    </header>
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
          <circle cx="58" cy="62" r="15" stroke={VIOLET_SOFT} strokeWidth="0.9" />
          <path d={starPath(50, 62, 4, 6, 2)} stroke={GOLD_HI} strokeWidth="0.7" />
        </>
      )}
      {v === 1 && (
        <>
          <path d="M 38 42 V 82 M 62 42 V 82" strokeWidth="0.7" opacity="0.7" />
          <path d={crescentPath(51, 60, 13)} stroke={VIOLET_SOFT} strokeWidth="0.9" />
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
          <circle cx="50" cy="62" r="11" stroke={VIOLET_SOFT} strokeWidth="0.5" strokeDasharray="1 3" opacity="0.7" />
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
          <path d="M 38 84 q 6 4 12 0 q 6 -4 12 0" stroke={VIOLET_SOFT} strokeWidth="0.6" opacity="0.7" />
        </>
      )}
      {v === 5 && (
        <>
          <path d={crescentPath(52, 58, 15)} stroke={VIOLET_SOFT} strokeWidth="0.9" />
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
          <path d="M 54 52 H 70 C 70 62 66 66 62 66 C 58 66 54 62 54 52 Z" stroke={VIOLET_SOFT} strokeWidth="0.8" />
          <path d="M 62 66 V 76 M 57 79 H 67" stroke={VIOLET_SOFT} strokeWidth="0.8" />
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
      <rect x="5" y="5" width="90" height="130" stroke={GOLD_DEEP} strokeWidth="0.45" strokeDasharray="1 3" opacity="0.6" />
      <path d="M 2 14 V 2 H 14 M 86 2 H 98 V 14 M 98 126 V 138 H 86 M 14 138 H 2 V 126" stroke={GOLD_HI} strokeWidth="0.8" opacity="0.8" />
      <text x="50" y="20" textAnchor="middle" fontSize="10" fill={GOLD_HI} fontFamily="Georgia, serif" letterSpacing="2">
        {card.n}
      </text>
      <path d="M 38 26 H 62" stroke={GOLD} strokeWidth="0.4" opacity="0.6" />
      <CardSigil i={card.sigil} />
      <path d="M 30 96 H 70" stroke={VIOLET_SOFT} strokeWidth="0.4" strokeDasharray="1 2" opacity="0.6" />
      <text x="50" y="128" textAnchor="middle" fontSize="5" fill={GOLD_MID} fontFamily="ui-monospace, Menlo, monospace" letterSpacing="1.6">
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
      <rect x="5" y="5" width="90" height="130" stroke={GOLD_DEEP} strokeWidth="0.45" strokeDasharray="1 3" opacity="0.55" />
      {ringTicks(50, 70, 30, 34, 36).map((t, i) => (
        <line key={i} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth="0.4" opacity="0.55" />
      ))}
      <circle cx="50" cy="70" r="26" stroke={VIOLET_SOFT} strokeWidth="0.7" opacity="0.8" />
      <circle cx="50" cy="70" r="21" stroke={GOLD} strokeWidth="0.4" strokeDasharray="1 3" opacity="0.6" />
      <path d={compassPath(50, 70, 17, 5)} stroke={GOLD_HI} strokeWidth="0.7" opacity="0.9" />
      <circle cx="50" cy="70" r="2.6" fill={GOLD_HI} stroke="none" className="llv-pulse-slow" />
      <path d={crescentPath(50, 24, 5)} stroke={GOLD} strokeWidth="0.7" opacity="0.8" />
      <path d={crescentPath(50, 116, 5)} stroke={GOLD} strokeWidth="0.7" opacity="0.8" transform="rotate(180 50 116)" />
      <text x="50" y="100" textAnchor="middle" fontSize="5" fill={GOLD_MID} fontFamily="ui-monospace, Menlo, monospace" letterSpacing="1.6">
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
  const [nameYou, setNameYou] = useState("");
  const [nameThem, setNameThem] = useState("");
  const [dateYou, setDateYou] = useState("");
  const [dateThem, setDateThem] = useState("");
  const [hint, setHint] = useState<string | null>(null);

  const you = nameYou.trim();
  const them = nameThem.trim();
  // Title Case for prose, tracked caps for readouts
  const disp = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const caps = (s: string) => s.toUpperCase();

  const cast = () => {
    const missing = [!you, !them];
    if (missing[0] || missing[1]) {
      setHint(
        missing[0] && missing[1]
          ? "THE ENGINE ASKS FOR TWO NAMES — PLATES A AND B"
          : missing[0]
            ? "PLATE A IS EMPTY — NAME YOURSELF FIRST"
            : "PLATE B IS EMPTY — WHO IS THE OTHER SHORE?",
      );
      return;
    }
    setHint(null);
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

  // slot captions personalize once a cast has been made
  const slotTitle = (i: number) => {
    if (!draw) return POSITIONS[i].name;
    if (i === 0) return `${caps(you)} — you`;
    if (i === 1) return `${caps(them)} — them`;
    return `The tide between ${disp(you)} & ${disp(them)}`;
  };
  const slotMicro = (i: number) => {
    if (draw && i === 2) return `WHAT ${caps(you)} & ${caps(them)} MAKE TOGETHER`;
    return POSITIONS[i].q;
  };

  return (
    <main className="llv-root relative min-h-screen overflow-x-clip font-sans antialiased" style={{ backgroundColor: INK, color: TEXT_HI }}>
      <style>{LLV_CSS}</style>

      {/* hero starfield */}
      <svg viewBox="0 0 1600 900" className="pointer-events-none absolute inset-x-0 top-0 h-[720px] w-full" preserveAspectRatio="xMidYMin slice" fill="none" aria-hidden>
        {HERO_STARS.map((s, i) => (
          <circle key={i} className={`llv-tw${s.g}`} cx={s.x} cy={s.y} r={s.r} fill={TEXT_HI} opacity={s.o} />
        ))}
      </svg>

      {/* deep background machinery: page specks, a giant twin-ring vesica
          bleeding off the right edge, huge arcs lower-left, construction lines */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <svg viewBox="0 0 1600 4200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMin slice" fill="none">
          {PAGE_STARS.map((s, i) => (
            <circle key={i} className={`llv-tw${s.g}`} cx={s.x} cy={s.y} r={s.r} fill={TEXT_LO} opacity={s.o} />
          ))}
        </svg>

        {/* nebula washes */}
        <span className="llv-nebula absolute top-[6vh] -left-[18vw] h-[64vmin] w-[64vmin] bg-[radial-gradient(circle,rgba(162,90,223,0.11),transparent_65%)]" />
        <span className="llv-nebula absolute top-[58vh] right-[-12vw] h-[72vmin] w-[72vmin] bg-[radial-gradient(circle,rgba(243,199,122,0.08),transparent_65%)]" />

        {/* giant twin-ring vesica, mostly off-screen right */}
        <svg viewBox="0 0 600 600" className="absolute top-[2vh] -right-[46vmin] h-[140vmin] w-[140vmin] opacity-[0.07]" fill="none">
          <circle cx="300" cy="300" r="294" stroke={GOLD} strokeWidth="0.8" />
          <circle cx="300" cy="300" r="284" stroke={GOLD_DEEP} strokeWidth="0.5" strokeDasharray="1 6" />
          <g className="llv-spin-b">
            {ringTicks(300, 300, 262, 280, 144).map((t, i) => (
              <line key={`wt${i}`} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth={t.major ? 1.1 : 0.4} />
            ))}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
              const p = polar(300, 300, 236, -75 + i * 30);
              return (
                <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="20" fill={GOLD} className="llv-glyph">
                  {i % 2 === 0 ? VENUS : MARS}
                </text>
              );
            })}
          </g>
          <circle cx="255" cy="300" r="150" stroke={GOLD} strokeWidth="0.6" />
          <circle cx="345" cy="300" r="150" stroke={VIOLET_SOFT} strokeWidth="0.6" strokeDasharray="12 5 2 5" />
          <path d="M 6 300 H 594 M 300 6 V 594" stroke={GOLD_DEEP} strokeWidth="0.4" strokeDasharray="4 9" />
        </svg>

        {/* huge dashed arcs, mostly off-screen lower-left */}
        <svg viewBox="0 0 400 400" className="absolute top-[46%] -left-[30vmin] h-[88vmin] w-[88vmin] opacity-[0.06]" fill="none">
          <g className="llv-spin-a">
            <circle cx="200" cy="200" r="192" stroke={VIOLET} strokeWidth="0.7" strokeDasharray="2 9" />
            <circle cx="200" cy="200" r="150" stroke={GOLD} strokeWidth="0.6" strokeDasharray="14 6 2 6" />
            {[25, 115, 205, 295].map((a, i) => {
              const p = polar(200, 200, 150, a);
              return <circle key={`an${i}`} cx={p.x} cy={p.y} r="3.4" stroke={GOLD} strokeWidth="0.8" fill={INK} />;
            })}
          </g>
          <circle cx="200" cy="200" r="108" stroke={GOLD_DEEP} strokeWidth="0.5" />
          {ringTicks(200, 200, 100, 108, 72).map((t, i) => (
            <line key={`at${i}`} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth="0.35" />
          ))}
          <path d={starPath(200, 200, 8, 84, 30)} stroke={GOLD} strokeWidth="0.5" />
        </svg>

        {/* a second faint arc field near the bottom-right */}
        <svg viewBox="0 0 400 400" className="absolute top-[78%] -right-[24vmin] h-[64vmin] w-[64vmin] opacity-[0.05]" fill="none">
          <circle cx="200" cy="200" r="190" stroke={VIOLET} strokeWidth="0.6" />
          <circle cx="200" cy="200" r="182" stroke={GOLD_DEEP} strokeWidth="0.5" strokeDasharray="1 7" />
          <path d={polyPath(200, 200, 160, 12)} stroke={GOLD} strokeWidth="0.5" strokeDasharray="3 6" />
          <path d={compassPath(200, 200, 150, 40)} stroke={GOLD} strokeWidth="0.5" />
        </svg>

        {/* hairline construction lines crossing whole sections */}
        <span className="llv-line" style={{ top: "18%", transform: "rotate(-3.5deg)" }}>
          <b>SYNASTRY AXIS · Δ VENUS 214°</b>
        </span>
        <span className="llv-line" style={{ top: "52%" }}>
          <b>HOUSE VII CUSP · PARTNERSHIPS</b>
        </span>
        <span className="llv-line" style={{ top: "84%", transform: "rotate(2.4deg)" }}>
          <b>TIDE LINE · MUTABLE WATER</b>
        </span>

        {/* giant dim glyphs drifting behind sections */}
        <span className="llv-glyph llv-float-a absolute top-[30vh] left-[2vw] text-[24vmin] leading-none opacity-[0.05]" style={{ color: VIOLET_SOFT }}>
          {VENUS}
        </span>
        <span className="llv-glyph llv-float-b absolute top-[140vh] right-[4vw] text-[28vmin] leading-none opacity-[0.045]" style={{ color: GOLD }}>
          {LUNA}
        </span>

        {/* occasional shooting stars */}
        <span className="llv-shoot" style={{ top: "16vh", right: "-12vw" }} />
        <span className="llv-shoot llv-shoot-b" style={{ top: "52vh", right: "-18vw" }} />
      </div>

      <div className="llv-vignette pointer-events-none absolute inset-0" aria-hidden />

      {/* faint grain over the whole page */}
      <div className="pointer-events-none fixed inset-0 z-30" aria-hidden>
        <span className="llv-grain absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 pb-8 sm:px-6">
        {/* ========================= COMPACT HEADER ========================= */}
        <header className="llv-panel mt-4 flex items-center gap-4 px-3 py-2 sm:px-4">
          <a href="/tarot" className="flex items-center gap-2.5">
            <span className="llv-inset flex h-7 w-7 items-center justify-center">
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden>
                <path d={compassPath(10, 10, 8, 3)} stroke={GOLD_HI} strokeWidth="0.9" />
                <circle cx="10" cy="10" r="2" fill={GOLD} stroke="none" />
              </svg>
            </span>
            <span className="llv-serif text-[15px] tracking-[0.28em]" style={{ color: TEXT_HI }}>
              ASTRO&nbsp;SCOPE
            </span>
          </a>
          <span className="llv-mono hidden text-[7px] tracking-[0.26em] uppercase sm:inline" style={{ color: GOLD_MID }}>
            Tarot Division · Love Spread Nº 03
          </span>
          <span className="llv-mono ml-auto text-[7px] tracking-[0.18em] uppercase" style={{ color: TEXT_LO }}>
            DECK 78 · SAMPLE 08 · SHUFFLED
          </span>
        </header>

        {/* ======================= TAROT CROSS-NAV TABS ===================== */}
        <nav className="mt-3 flex gap-1.5 overflow-x-auto pb-1" aria-label="Tarot pages">
          {TAROT_NAV.map((t) => (
            <a
              key={t.href}
              href={t.href}
              aria-current={t.active ? "page" : undefined}
              className={`llv-tab llv-mono shrink-0 px-3 py-1.5 text-[8px] tracking-[0.2em] uppercase whitespace-nowrap ${t.active ? "llv-tab-on" : ""}`}
            >
              {t.label}
            </a>
          ))}
        </nav>

        {/* ========================= THE TOOL — TOP ==========================
            title strip + the spread board itself, immediately usable */}
        <section id="llv-tool" className="mt-8 lg:mt-10">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div className="relative pl-5 sm:pl-6">
              <span className="llv-ruler" aria-hidden />
              <p className="llv-mono text-[8px] tracking-[0.4em] uppercase" style={{ color: GOLD }}>
                Three Cards · You / Them / The Tide
              </p>
              <h1 className="llv-serif llv-glow mt-2.5 text-[30px] leading-[1.05] sm:text-[42px]" style={{ color: TEXT_HI }}>
                Two charts. <span style={{ color: GOLD }}>One question.</span>
              </h1>
            </div>
            <p className="max-w-sm text-[11px] leading-relaxed" style={{ color: TEXT_LO }}>
              Hold the question steady, then cast. The engine deals three sealed plates — turn each one over in
              your own time. When all three face up, the tide readout opens along the board&rsquo;s lower rail.
            </p>
          </div>

          {/* two entry plates — name both hearts before the cast; broken
              offsets, a dashed thread and a lens chip between them */}
          <div className="relative mt-9 flex flex-col items-stretch gap-5 md:flex-row md:items-center md:gap-0">
            <div className={`llv-panel relative -rotate-[0.5deg] p-4 sm:p-5 md:w-[42%] ${hint && !you ? "llv-hint" : ""}`}>
              <span className="llv-chip llv-mono absolute -top-2.5 left-4 z-10 px-2 py-0.5 text-[7px] tracking-[0.22em]" style={{ color: GOLD_MID }}>
                PLATE A · QUESITENT
              </span>
              <label className="block">
                <span className="llv-mono text-[7px] tracking-[0.28em] uppercase" style={{ color: GOLD_MID }}>
                  You — first name *
                </span>
                <span className="llv-field mt-1.5 block">
                  <input
                    value={nameYou}
                    onChange={(e) => {
                      setNameYou(e.target.value);
                      if (hint) setHint(null);
                    }}
                    placeholder="Alex"
                    maxLength={24}
                    autoComplete="off"
                    aria-label="Your first name"
                    className="llv-input llv-mono w-full px-3 py-2.5 text-[13px] tracking-[0.12em]"
                    style={{ color: TEXT_HI }}
                  />
                </span>
              </label>
              <label className="mt-3 block">
                <span className="llv-mono text-[7px] tracking-[0.28em] uppercase" style={{ color: GOLD_MID }}>
                  Birth date — optional
                </span>
                <span className="llv-field mt-1.5 block">
                  <input
                    type="date"
                    value={dateYou}
                    onChange={(e) => setDateYou(e.target.value)}
                    aria-label="Your birth date (optional)"
                    className="llv-input llv-mono w-full px-3 py-2 text-[11px] tracking-[0.12em]"
                    style={{ color: dateYou ? TEXT_HI : TEXT_LO }}
                  />
                </span>
              </label>
            </div>

            {/* lens chip on the thread between the plates */}
            <span className="llv-chip llv-mono relative z-10 mx-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full md:mx-[-6px]" style={{ color: GOLD }} aria-hidden>
              <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke={GOLD} strokeWidth="0.9">
                <circle cx="7.5" cy="10" r="5" />
                <circle cx="12.5" cy="10" r="5" stroke={VIOLET_SOFT} />
              </svg>
            </span>
            <span className="llv-thread top-1/2 right-[42%] left-[42%] hidden md:block" aria-hidden />

            <div className={`llv-panel relative rotate-[0.6deg] p-4 sm:p-5 md:ml-auto md:w-[42%] md:translate-y-4 ${hint && you && !them ? "llv-hint" : ""}`}>
              <span className="llv-chip llv-mono absolute -top-2.5 right-4 z-10 px-2 py-0.5 text-[7px] tracking-[0.22em]" style={{ color: GOLD_MID }}>
                PLATE B · THE OTHER SHORE
              </span>
              <label className="block">
                <span className="llv-mono text-[7px] tracking-[0.28em] uppercase" style={{ color: GOLD_MID }}>
                  Them — first name *
                </span>
                <span className="llv-field mt-1.5 block">
                  <input
                    value={nameThem}
                    onChange={(e) => {
                      setNameThem(e.target.value);
                      if (hint) setHint(null);
                    }}
                    placeholder="Sam"
                    maxLength={24}
                    autoComplete="off"
                    aria-label="Their first name"
                    className="llv-input llv-mono w-full px-3 py-2.5 text-[13px] tracking-[0.12em]"
                    style={{ color: TEXT_HI }}
                  />
                </span>
              </label>
              <label className="mt-3 block">
                <span className="llv-mono text-[7px] tracking-[0.28em] uppercase" style={{ color: GOLD_MID }}>
                  Birth date — optional
                </span>
                <span className="llv-field mt-1.5 block">
                  <input
                    type="date"
                    value={dateThem}
                    onChange={(e) => setDateThem(e.target.value)}
                    aria-label="Their birth date (optional)"
                    className="llv-input llv-mono w-full px-3 py-2 text-[11px] tracking-[0.12em]"
                    style={{ color: dateThem ? TEXT_HI : TEXT_LO }}
                  />
                </span>
              </label>
            </div>
          </div>

          {/* gentle hint when a cast is attempted without both names */}
          {hint && (
            <p role="alert" className="llv-mono mt-4 text-center text-[7.5px] tracking-[0.26em] uppercase" style={{ color: GOLD_HI }}>
              ✦ {hint}
            </p>
          )}

          <div className="relative mt-7">
            {/* giant faint Venus behind the board */}
            <span className="llv-glyph pointer-events-none absolute -top-20 -right-4 hidden text-[200px] leading-none opacity-[0.05] select-none lg:block" style={{ color: VIOLET_SOFT }} aria-hidden>
              {VENUS}
            </span>

            <div className="llv-panel relative lg:ml-8 lg:rotate-[0.45deg]">
              {/* readout straddling the top border */}
              <span className="llv-chip llv-mono absolute -top-2.5 left-8 z-20 px-2 py-0.5 text-[7px] tracking-[0.2em]" style={{ color: GOLD_MID }}>
                Δ AMOR · FIG. 01 · THREE POSITIONS
              </span>
              <header className="llv-panel-h">
                <span style={{ color: GOLD }}>SPREAD OF THREE — LOVE DIVISION</span>
                <span className="llv-panel-h-line" aria-hidden />
                <span className="llv-mono text-[7.5px] tracking-[0.2em]" style={{ color: GOLD_MID }}>
                  {draw
                    ? `${caps(you)} × ${caps(them)} · DEALT Nº ${String(dealKey).padStart(3, "0")} · ${revealedCount}/3 FACE-UP`
                    : "AWAITING CAST"}
                </span>
              </header>

              <div className="relative px-4 py-11 sm:px-8 sm:py-12">
                {/* dashed thread running behind the row, with node glyphs */}
                <span className="llv-thread top-1/2 right-[10%] left-[10%] hidden sm:block" aria-hidden />
                <span className="llv-glyph llv-mono pointer-events-none absolute top-1/2 left-[33%] hidden -translate-x-1/2 -translate-y-1/2 bg-[#14101f] px-1.5 text-[11px] sm:block" style={{ color: GOLD_MID }} aria-hidden>
                  {VENUS}
                </span>
                <span className="llv-glyph llv-mono pointer-events-none absolute top-1/2 left-[67%] hidden -translate-x-1/2 -translate-y-1/2 bg-[#14101f] px-1.5 text-[11px] sm:block" style={{ color: GOLD_MID }} aria-hidden>
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
                                <span className="llv-mono mt-1 block text-center text-[5.8px] tracking-[0.22em]" style={{ color: GOLD_MID }}>
                                  {card.suit}
                                </span>
                                <span className="mt-1.5 block text-center text-[8px] leading-snug" style={{ color: TEXT_LO }}>
                                  {card.line}
                                </span>
                              </span>
                            </span>
                          </button>
                        ) : (
                          <div className="llv-slot flex aspect-[5/7] w-[148px] flex-col items-center justify-center gap-2 sm:w-[168px]">
                            <span className="llv-serif text-[22px]" style={{ color: GOLD_MID }}>
                              {pos.n}
                            </span>
                            <span className="llv-mono text-[6.5px] tracking-[0.3em]" style={{ color: GOLD_DEEP }}>
                              AWAITING CAST
                            </span>
                          </div>
                        )}

                        <p className="llv-serif mt-5 max-w-[190px] text-center text-[14px] leading-snug" style={{ color: GOLD_HI }}>
                          {slotTitle(i)}
                        </p>
                        <p className="llv-mono mt-1 max-w-[170px] text-center text-[6.5px] leading-relaxed tracking-[0.2em]" style={{ color: GOLD_MID }}>
                          {slotMicro(i)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* tide readout rail */}
              <footer className="llv-mono flex flex-wrap items-center justify-between gap-x-6 gap-y-1.5 border-t px-3 py-2 text-[7px] tracking-[0.18em] uppercase" style={{ borderColor: "rgba(243,199,122,0.14)", color: GOLD_MID }}>
                <span>POSITIONS 03 · YOU / THEM / TIDE</span>
                <span className="tabular-nums" style={{ color: allRevealed ? GOLD_HI : GOLD_MID }}>
                  {allRevealed
                    ? `THE TIDE BETWEEN ${caps(you)} & ${caps(them)} · INDEX +${tide.toFixed(1)} · ${verdict}`
                    : `REVEAL ALL THREE TO READ THE TIDE · ${revealedCount}/3`}
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
              <span className="llv-mono hidden text-[6.5px] tracking-[0.2em] uppercase lg:inline" style={{ color: GOLD_DEEP }}>
                SHUFFLE · FISHER-YATES · NO MEMORY
              </span>
            </div>
          </div>
        </section>

        {/* ================ HOW TO READ — CONDENSED RITES ================== */}
        <section className="mt-14 lg:mt-20 lg:ml-10">
          <SectionHead index="02" title="How to read the three positions" right="THREE RITES · ORDER MATTERS" />
          <div className="llv-panel lg:rotate-[-0.25deg]">
            <ol className="grid grid-cols-1 md:grid-cols-3">
              {RITES.map((s, i) => (
                <li
                  key={s.n}
                  className={`relative flex gap-4 p-5 ${i > 0 ? "border-t md:border-t-0 md:border-l" : ""}`}
                  style={{ borderColor: "rgba(233,230,242,0.08)" }}
                >
                  <span className="llv-medallion relative flex h-11 w-11 shrink-0 items-center justify-center">
                    <svg viewBox="0 0 44 44" className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
                      <circle cx="22" cy="22" r="20" stroke={GOLD} strokeWidth="0.8" opacity="0.7" />
                      {ringTicks(22, 22, 16.5, 20, 20, i * 7).map((t, k) => (
                        <line key={k} x1={t.x} y1={t.y} x2={t.x2} y2={t.y2} stroke={GOLD} strokeWidth="0.5" opacity="0.5" />
                      ))}
                      <circle cx="22" cy="22" r="13.5" stroke={VIOLET_SOFT} strokeWidth="0.5" strokeDasharray="1 3" opacity="0.6" />
                    </svg>
                    <span className="llv-serif text-[13px]" style={{ color: GOLD_HI }}>
                      {s.n}
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className="llv-serif block text-[13.5px] leading-snug" style={{ color: GOLD_HI }}>
                      {s.t}
                    </span>
                    <span className="mt-1.5 block text-[9.5px] leading-relaxed" style={{ color: TEXT_LO }}>
                      {s.c}
                    </span>
                    <span className="llv-mono mt-2 block text-[6.5px] tracking-[0.24em]" style={{ color: GOLD_MID }}>
                      {s.micro}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ===================== FAQ — CONDENSED ARCHIVE ==================== */}
        <section className="relative mt-14 lg:mt-20 lg:ml-[6%]">
          <span className="llv-glyph pointer-events-none absolute -top-14 -right-8 hidden text-[170px] leading-none opacity-[0.045] select-none lg:block" style={{ color: GOLD }} aria-hidden>
            {LUNA}
          </span>
          <SectionHead index="03" title="Archive entries — frequently asked" right="3 RECORDS · PUBLIC" />
          <div className="llv-panel lg:rotate-[0.3deg]">
            <ul className="grid grid-cols-1 md:grid-cols-3">
              {ARCHIVE.map((e, i) => (
                <li
                  key={e.q}
                  className={`flex gap-4 p-5 ${i > 0 ? "border-t md:border-t-0 md:border-l" : ""}`}
                  style={{ borderColor: "rgba(233,230,242,0.08)" }}
                >
                  <span className="llv-mono shrink-0 text-[8px] tracking-[0.14em]" style={{ color: GOLD_DEEP }}>
                    REC-{String(i + 1).padStart(3, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="llv-serif block text-[13.5px] leading-snug" style={{ color: GOLD_HI }}>
                      {e.q}
                    </span>
                    <span className="mt-1.5 block text-[9.5px] leading-relaxed" style={{ color: TEXT_LO }}>
                      {e.a}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ======================== COMPACT CTA STRIP ======================= */}
        <section className="llv-panel relative mt-14 px-4 py-9 text-center lg:mt-20 lg:-mx-6 lg:rotate-[-0.2deg]">
          <span className="llv-chip llv-mono absolute -top-2.5 right-8 z-10 px-2 py-0.5 text-[7px] tracking-[0.24em]" style={{ color: GOLD_MID }}>
            SEQ. 000 · FINAL INVOCATION
          </span>
          <h2 className="llv-serif llv-glow mx-auto max-w-2xl text-[22px] leading-snug sm:text-[30px]" style={{ color: TEXT_HI }}>
            Some questions deserve three cards, not three hundred messages.
          </h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a href="#llv-tool" className="llv-btn llv-mono px-7 py-3 text-[9.5px] tracking-[0.26em] uppercase">
              Cast the three cards
            </a>
            <a href="/compatibility" className="llv-btn-ghost llv-mono px-6 py-3 text-[9.5px] tracking-[0.26em] uppercase">
              Free synastry chart →
            </a>
          </div>
          <p className="llv-mono mt-4 text-[7px] tracking-[0.24em] uppercase" style={{ color: GOLD_MID }}>
            NO CARD REQUIRED · THE TIDE DOES NOT KEEP RECORDS
          </p>
        </section>

        {/* ============================= FOOTER ============================= */}
        <footer className="mt-12 lg:mt-16">
          <div className="llv-mono relative left-1/2 flex w-screen -translate-x-1/2 flex-wrap items-center justify-center gap-x-6 gap-y-1.5 border-y px-3 py-2.5 text-[8px] tracking-[0.26em] uppercase" style={{ borderColor: "rgba(243,199,122,0.18)", color: GOLD }}>
            <span>22 Major Arcana</span>
            <span style={{ color: GOLD_DEEP }}>·</span>
            <span>4 Suits</span>
            <span style={{ color: GOLD_DEEP }}>·</span>
            <span>1 Tide</span>
          </div>
          <div className="llv-mono flex flex-wrap items-center gap-x-6 gap-y-1.5 px-1 py-4 text-[7.5px] tracking-[0.18em] uppercase" style={{ color: TEXT_LO }}>
            <span style={{ color: GOLD }}>© 2026 ASTRO SCOPE — ALL HEARTS RESERVED</span>
            <nav className="flex items-center gap-4">
              {TAROT_NAV.slice(0, 4).map((t) => (
                <a key={t.href} href={t.href} className="llv-navlink">
                  {t.label}
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
.llv-root { font-family: ui-sans-serif, system-ui, sans-serif; }
.llv-serif { font-family: "Playfair Display", "Cormorant Garamond", Georgia, "Times New Roman", serif; }
.llv-mono { font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace; }
.llv-glyph { font-family: "Noto Sans Symbols", "Noto Sans Symbols 2", Symbola, "Segoe UI Symbol", serif; font-style: normal; }

/* panels stay translucent so the machinery passes visibly BEHIND them */
.llv-panel {
  position: relative;
  background: linear-gradient(160deg, rgba(23,19,40,0.62), rgba(12,10,22,0.72));
  border: 1px solid rgba(233,230,242,0.10);
  backdrop-filter: blur(3px);
  box-shadow: 0 0 22px rgba(0,0,0,.4);
}
.llv-panel::after {
  content: "";
  position: absolute; inset: 3px;
  border: 1px solid rgba(243,199,122,.08);
  pointer-events: none;
}
.llv-inset {
  border: 1px solid rgba(243,199,122,.2);
  background: rgba(10,9,18,.5);
  box-shadow: inset 0 1px 4px rgba(0,0,0,.6);
}
.llv-panel-h {
  display: flex; align-items: center; gap: 10px;
  padding: 6px 10px;
  border-bottom: 1px solid rgba(243,199,122,.18);
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 8.5px; letter-spacing: .3em; text-transform: uppercase;
}
.llv-panel-h-line {
  flex: 1; height: 1px;
  background: linear-gradient(90deg, rgba(243,199,122,.4), rgba(243,199,122,.05));
}

.llv-navlink { color: rgba(183,177,204,.75); transition: color .25s ease; }
.llv-navlink:hover { color: #ffdd9c; }

/* cross-nav tabs */
.llv-tab {
  border: 1px solid rgba(233,230,242,0.1);
  background: rgba(23,19,40,0.4);
  color: #b7b1cc;
  transition: color .25s ease, border-color .25s ease, background-color .25s ease;
}
.llv-tab:hover { color: #ffdd9c; border-color: rgba(243,199,122,.4); }
.llv-tab-on {
  border-color: rgba(243,199,122,.55);
  background: rgba(243,199,122,.1);
  color: #f3c77a;
  box-shadow: inset 0 0 10px rgba(243,199,122,.08);
}

.llv-btn {
  display: inline-block;
  color: #0a0912;
  background: linear-gradient(180deg, #ffdd9c, #f3c77a 55%, #e39a4c);
  border: 1px solid #f3c77a;
  box-shadow: 0 0 18px rgba(243,199,122,.3), inset 0 1px 0 rgba(255,248,230,.6);
  transition: box-shadow .3s ease, transform .3s ease;
}
.llv-btn:hover { box-shadow: 0 0 26px rgba(243,199,122,.5), inset 0 1px 0 rgba(255,248,230,.7); transform: translateY(-1px); }
.llv-btn-ghost {
  display: inline-block;
  color: #f3c77a;
  border: 1px solid rgba(243,199,122,.5);
  background: rgba(243,199,122,.06);
  transition: background-color .3s ease, color .3s ease;
}
.llv-btn-ghost:hover { background: rgba(243,199,122,.14); color: #ffdd9c; }

.llv-chip {
  border: 1px solid rgba(243,199,122,.4);
  background: rgba(10,9,18,.88);
  box-shadow: 0 0 14px rgba(0,0,0,.6), inset 0 0 8px rgba(243,199,122,.1);
}

/* vertical degree ruler beside the tool title */
.llv-ruler {
  position: absolute; left: 0; top: 2px; bottom: 2px; width: 10px;
  border-left: 1px solid rgba(243,199,122,.35);
  background-image: repeating-linear-gradient(180deg, rgba(243,199,122,.5) 0 1px, transparent 1px 11px);
  background-size: 6px 100%;
  background-repeat: no-repeat;
  opacity: .8;
}

.llv-medallion {
  background: #0a0912;
  border-radius: 9999px;
  box-shadow: 0 0 18px rgba(243,199,122,.2), inset 0 0 10px rgba(162,90,223,.14);
}

.llv-vignette {
  background:
    radial-gradient(1200px 500px at 78% -8%, rgba(162,90,223,.09), transparent 60%),
    radial-gradient(900px 600px at 8% 4%, rgba(243,199,122,.05), transparent 55%);
}

/* hairline construction lines crossing whole sections (drafting-style) */
.llv-line {
  position: absolute; left: -6vw; right: -6vw; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(201,162,39,.18) 10%, rgba(201,162,39,.18) 90%, transparent);
}
.llv-line::after {
  content: "+";
  position: absolute; left: 10vw; top: -7px;
  color: rgba(243,199,122,.4);
  font: 11px ui-monospace, Menlo, monospace;
}
.llv-line > b {
  position: absolute; right: 7vw; top: -4px;
  padding: 0 7px;
  background: #0a0912;
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 7px; font-weight: 400; letter-spacing: .26em;
  color: rgba(227,154,76,.85);
}

.llv-glow { text-shadow: 0 0 16px rgba(243,199,122,.35), 0 0 46px rgba(162,90,223,.2); }

::selection { background: rgba(243,199,122,.25); color: #ffdd9c; }

/* ---------- the interactive spread ---------- */
/* dashed thread running behind the three slots */
.llv-thread {
  position: absolute; height: 1px;
  background: repeating-linear-gradient(90deg, rgba(243,199,122,.45) 0 6px, transparent 6px 12px);
  opacity: .6;
}
/* empty slot before the first cast */
.llv-slot {
  border: 1px dashed rgba(243,199,122,.35);
  background: rgba(243,199,122,.03);
  box-shadow: inset 0 0 14px rgba(0,0,0,.5);
}
/* entry-plate input fields (dark, gold-traced, dark calendar picker) */
.llv-field {
  border: 1px solid rgba(243,199,122,.28);
  background: rgba(10,9,18,.7);
  transition: border-color .25s ease, box-shadow .25s ease;
}
.llv-field:focus-within { border-color: rgba(243,199,122,.6); box-shadow: 0 0 12px rgba(243,199,122,.12); }
.llv-input { background: transparent; outline: none; color-scheme: dark; }
.llv-input::placeholder { color: rgba(233,230,242,.18); }
.llv-input::selection { background: rgba(243,199,122,.3); }
/* plate asking for a missing name */
.llv-hint { border-color: rgba(243,199,122,.6); box-shadow: 0 0 18px rgba(243,199,122,.16); }
/* 3D flip */
.llv-flip { perspective: 1100px; background: none; border: 0; padding: 0; cursor: pointer; }
.llv-flip:focus-visible { outline: 1px solid rgba(255,221,156,.7); outline-offset: 4px; }
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
.llv-frontface {
  transform: rotateY(180deg);
  overflow: hidden;
  background: linear-gradient(170deg, rgba(26,21,44,.94), rgba(12,10,22,.96));
}
.llv-flip:hover .llv-flip-inner { transform: scale(1.03); }
.llv-flip:hover .llv-flip-inner.llv-open { transform: rotateY(180deg) scale(1.03); }

/* staggered deal */
@keyframes llvDeal {
  0% { opacity: 0; transform: translateY(-34px) rotate(-5deg) scale(.94); }
  60% { opacity: 1; }
  100% { opacity: 1; transform: none; }
}

/* dust / paper grain over the whole page (inline feTurbulence) */
.llv-grain {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>");
  background-size: 180px 180px;
  opacity: .05;
}

/* shooting stars */
.llv-shoot {
  position: absolute;
  width: 190px; height: 1px;
  background: linear-gradient(90deg, rgba(255,221,156,.9), rgba(255,221,156,0));
  opacity: 0;
}
.llv-shoot-b { width: 140px; }

/* ---------- slow, CSS-only motion (15–180s), reduced-motion guarded ------- */
@keyframes llvSpin { to { transform: rotate(360deg); } }
@keyframes llvSpinRev { to { transform: rotate(-360deg); } }
@keyframes llvPulse { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }
@keyframes llvTw { 0%, 100% { opacity: .15; } 50% { opacity: .8; } }
@keyframes llvFloatA { 0%,100% { transform: translate(0,0) rotate(-2deg); } 50% { transform: translate(1.5vw,-2vh) rotate(1deg); } }
@keyframes llvFloatB { 0%,100% { transform: translate(0,0) rotate(3deg); } 50% { transform: translate(-1.5vw,2vh) rotate(-1deg); } }
@keyframes llvShoot {
  0%    { opacity: 0; transform: translate3d(0,0,0) rotate(-26deg); }
  3%    { opacity: .9; }
  11%   { opacity: 0; transform: translate3d(-58vw, 30vh, 0) rotate(-26deg); }
  100%  { opacity: 0; transform: translate3d(-58vw, 30vh, 0) rotate(-26deg); }
}

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
  .llv-float-a { animation: llvFloatA 34s ease-in-out infinite; }
  .llv-float-b { animation: llvFloatB 42s ease-in-out infinite; }
  .llv-nebula { animation: llvFloatA 60s ease-in-out infinite; }
  .llv-shoot { animation: llvShoot 17s linear infinite 4s; }
  .llv-shoot-b { animation: llvShoot 23s linear infinite 12s; }
}

@media (prefers-reduced-motion: reduce) {
  .llv-flip-inner { transition: none; }
  .llv-shoot, .llv-shoot-b { display: none; }
}
`;
