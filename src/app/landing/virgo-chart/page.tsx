// LANDING / VIRGO-CHART — a design exploration of the production landing in
// the "Engraved Celestial Atlas" language of src/components/cards/virgo-chart.tsx:
// midnight-blue plates, fine engraved gold linework, silver stars with
// greek-letter labels, a Milky Way wash, and the Maiden drawing herself
// line by line. Fully self-contained: inline SVG, Tailwind for layout, one
// scoped <style> block (lvc- prefixed) for the rest.
// Server-component safe: no hooks, CSS animations only, statically prerendered.

import type { Metadata } from "next";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Astro Scope — Every star is a letter. We read the sky.",
  description:
    "Free birth chart, daily horoscopes, synastry and tarot — an engraved celestial atlas of you.",
};

const DEG = Math.PI / 180;
const FE = "︎"; // U+FE0E appended to every glyph — monochrome text, never emoji

// the atlas palette: midnight blue, engraved gold, silver stars
const GOLD = "#d9b64a";
const GOLD_BRIGHT = "#f2d675";
const GOLD_DIM = "rgba(217, 182, 74, 0.55)";
const SILVER = "#c8d3e6";
const SILVER_BRIGHT = "#f0f4fb";
const INK = "#0b1026";

const SERIF = "Georgia, 'Times New Roman', 'Palatino Linotype', serif";
const GLYPH_FONT = "'DejaVu Sans', 'Segoe UI Symbol', Georgia, serif";

/* ============================ SHARED GEOMETRY =========================== */

// n points on a circle, angle measured clockwise from the top
function ringPts(cx: number, cy: number, r: number, n: number, offset = -90): [number, number][] {
  return Array.from({ length: n }, (_, k) => {
    const t = (offset + (360 / n) * k) * DEG;
    return [+(cx + r * Math.cos(t)).toFixed(1), +(cy + r * Math.sin(t)).toFixed(1)] as [number, number];
  });
}

// four-point engraver's sparkle at (x, y) with arm length a
function sparkle(x: number, y: number, a: number): string {
  return `M ${x} ${y - a} L ${x} ${y + a} M ${x - a} ${y} L ${x + a} ${y}`;
}

/* ==================== THE TWELVE CONSTELLATION PLATES =================== */

interface Asterism {
  stars: [number, number][];
  links: [number, number][];
  focal: number;
}

// each sign gets its own tiny engraved star-figure (viewBox 0 0 96 60)
const SIGNS: { g: string; n: string; d: string; aster: Asterism }[] = [
  { g: `♈${FE}`, n: "Aries", d: "Mar 21 – Apr 19", aster: { stars: [[10, 42], [28, 30], [50, 24], [72, 30], [86, 24]], links: [[0, 1], [1, 2], [2, 3], [3, 4]], focal: 1 } },
  { g: `♉${FE}`, n: "Taurus", d: "Apr 20 – May 20", aster: { stars: [[14, 14], [34, 30], [54, 44], [14, 46], [80, 18]], links: [[0, 1], [1, 2], [3, 1], [2, 4]], focal: 2 } },
  { g: `♊${FE}`, n: "Gemini", d: "May 21 – Jun 20", aster: { stars: [[16, 12], [22, 46], [52, 10], [58, 44], [78, 26]], links: [[0, 1], [2, 3], [0, 2], [1, 4], [3, 4]], focal: 4 } },
  { g: `♋${FE}`, n: "Cancer", d: "Jun 21 – Jul 22", aster: { stars: [[48, 10], [46, 34], [22, 52], [74, 50]], links: [[0, 1], [1, 2], [1, 3]], focal: 0 } },
  { g: `♌${FE}`, n: "Leo", d: "Jul 23 – Aug 22", aster: { stars: [[26, 8], [36, 16], [38, 28], [32, 38], [56, 44], [78, 30]], links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 2]], focal: 3 } },
  { g: `♍${FE}`, n: "Virgo", d: "Aug 23 – Sep 22", aster: { stars: [[12, 20], [30, 30], [50, 22], [38, 44], [66, 48], [82, 28]], links: [[0, 1], [1, 2], [1, 3], [3, 4], [2, 5]], focal: 4 } },
  { g: `♎${FE}`, n: "Libra", d: "Sep 23 – Oct 22", aster: { stars: [[48, 10], [20, 44], [76, 44]], links: [[0, 1], [0, 2], [1, 2]], focal: 0 } },
  { g: `♏${FE}`, n: "Scorpio", d: "Oct 23 – Nov 21", aster: { stars: [[10, 14], [26, 18], [42, 26], [56, 38], [70, 46], [84, 42], [88, 26]], links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]], focal: 2 } },
  { g: `♐${FE}`, n: "Sagittarius", d: "Nov 22 – Dec 21", aster: { stars: [[28, 14], [46, 22], [64, 16], [54, 36], [70, 50], [34, 44], [22, 30]], links: [[0, 1], [1, 2], [1, 3], [3, 4], [3, 5], [5, 6], [6, 0]], focal: 1 } },
  { g: `♑${FE}`, n: "Capricorn", d: "Dec 22 – Jan 19", aster: { stars: [[12, 26], [44, 12], [84, 30], [46, 48]], links: [[0, 1], [1, 2], [2, 3], [3, 0]], focal: 1 } },
  { g: `♒${FE}`, n: "Aquarius", d: "Jan 20 – Feb 18", aster: { stars: [[10, 20], [26, 30], [42, 20], [58, 30], [74, 22], [88, 32], [56, 48]], links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [3, 6]], focal: 3 } },
  { g: `♓${FE}`, n: "Pisces", d: "Feb 19 – Mar 20", aster: { stars: [[12, 16], [24, 24], [38, 32], [54, 38], [70, 42], [84, 34], [16, 8]], links: [[6, 0], [0, 1], [1, 2], [2, 3], [3, 4], [4, 5]], focal: 6 } },
];

/* ==================== HERO — THE MAIDEN OF THE ATLAS ==================== */

interface Segment {
  d: string;
  /** load-reveal delay in seconds */
  t: number;
  w?: number;
  op?: number;
}

interface Star {
  x: number;
  y: number;
  r: number;
  t: number;
  label?: string;
  lx?: number;
  ly?: number;
  anchor?: "start" | "end" | "middle";
}

// the Maiden of Virgo, drawn around her true asterism — the deck's own figure
const MAIDEN: { segments: Segment[]; stars: Star[]; links: [number, number][]; focal: number } = {
  focal: 8,
  segments: [
    { t: 0.15, d: "M 238 123 C 246 123 251 130 251 139 C 251 148 245 154 238 154 C 230 154 225 148 225 139 C 225 130 230 123 238 123 Z" },
    { t: 0.3, d: "M 225 137 C 227 129 234 124 243 125 C 252 126 257 132 255 139 C 253 145 246 146 243 141" },
    { t: 0.45, d: "M 232 154 C 227 172 216 188 211 206 C 206 238 204 268 205 298" },
    { t: 0.55, d: "M 244 154 C 250 178 246 212 232 250 C 225 272 214 288 205 298" },
    { t: 0.65, d: "M 246 212 C 232 240 218 268 204 292" },
    { t: 0.7, w: 0.45, op: 0.5, d: "M 252 220 C 238 246 224 272 212 294" },
    { t: 0.8, d: "M 238 192 C 266 158 294 148 316 152 C 320 153 322 156 320 160 C 306 178 280 194 250 204" },
    { t: 0.95, w: 0.5, op: 0.7, d: "M 246 200 C 268 184 290 172 306 168" },
    { t: 1.0, w: 0.45, op: 0.55, d: "M 252 206 C 270 194 286 186 298 182" },
    { t: 0.85, d: "M 228 190 C 190 156 138 150 100 176 C 94 181 91 190 94 200 C 130 208 180 210 224 206" },
    { t: 1.0, w: 0.5, op: 0.7, d: "M 222 212 C 190 226 164 240 150 252" },
    { t: 1.05, w: 0.45, op: 0.55, d: "M 224 218 C 200 232 180 244 168 254" },
    { t: 1.1, d: "M 212 208 C 188 244 158 292 142 330 C 134 356 138 382 152 402 C 158 412 164 421 167 428" },
    { t: 1.2, w: 0.5, op: 0.7, d: "M 224 216 C 202 250 174 296 158 332 C 150 356 152 380 162 398" },
    { t: 1.3, d: "M 167 428 C 171 431 173 435 171 439 C 167 441 163 438 164 434" },
    { t: 1.35, d: "M 167 430 C 166 427 166 424 167 421" },
    { t: 1.4, w: 0.6, d: "M 168 421 L 160 410 M 168 421 L 168 406 M 168 421 L 176 410 M 166 415 L 161 408 M 170 415 L 175 408" },
    { t: 1.42, w: 0.5, op: 0.7, d: "M 167 428 C 158 426 152 420 150 412 C 158 414 164 420 167 428 Z" },
    { t: 1.2, d: "M 205 298 C 196 350 190 400 196 448" },
    { t: 1.3, d: "M 218 302 C 236 352 252 402 268 452" },
    { t: 1.4, d: "M 196 448 C 218 456 246 458 268 452" },
    { t: 1.45, w: 0.5, op: 0.6, d: "M 210 312 C 206 360 204 406 210 446" },
    { t: 1.5, w: 0.5, op: 0.6, d: "M 224 314 C 227 362 233 410 240 448" },
    { t: 1.55, w: 0.5, op: 0.6, d: "M 238 318 C 246 364 255 408 258 446" },
    { t: 1.35, d: "M 246 210 C 272 250 290 296 300 340 C 304 364 300 384 288 396" },
    { t: 1.45, w: 0.45, op: 0.5, d: "M 252 216 C 276 254 292 296 300 336" },
  ],
  stars: [
    { x: 300, y: 190, r: 2.2, t: 1.3, label: "ε Vindemiatrix", lx: 308, ly: 186, anchor: "start" },
    { x: 90, y: 210, r: 1.8, t: 1.35, label: "β Zavijava", lx: 96, ly: 226, anchor: "start" },
    { x: 150, y: 250, r: 1.6, t: 1.4, label: "η Zaniah", lx: 116, ly: 246, anchor: "end" },
    { x: 205, y: 300, r: 2.4, t: 1.25, label: "γ Porrima", lx: 214, ly: 292, anchor: "start" },
    { x: 140, y: 330, r: 1.7, t: 1.45, label: "δ Auva", lx: 132, ly: 322, anchor: "end" },
    { x: 300, y: 340, r: 1.5, t: 1.5, label: "μ Rijl al Awwa", lx: 308, ly: 336, anchor: "start" },
    { x: 246, y: 382, r: 1.6, t: 1.5, label: "ι Syrma", lx: 254, ly: 376, anchor: "start" },
    { x: 150, y: 395, r: 1.7, t: 1.5, label: "ζ Heze", lx: 142, ly: 388, anchor: "end" },
    { x: 168, y: 420, r: 3.2, t: 1.45, label: "α Spica", lx: 150, ly: 438, anchor: "end" },
  ],
  links: [[8, 7], [7, 4], [4, 3], [3, 2], [2, 1], [3, 0], [3, 8], [8, 6], [6, 5]],
};

// Coma Berenices: faint neighbor-constellation hint, upper right
const COMA = {
  stars: [[318, 108], [334, 96], [348, 112], [330, 124]] as [number, number][],
  links: [[0, 1], [1, 2], [0, 3]] as [number, number][],
};

// deterministic faint silver field stars inside the hero plate
const PLATE_FIELD = Array.from({ length: 28 }, (_, i) => ({
  x: 30 + ((i * 83 + 47) % 340),
  y: 100 + ((i * 61 + 29) % 390),
  r: 0.35 + ((i * 11) % 8) / 14,
  twinkle: i % 10 === 3,
  dur: 18 + ((i * 9) % 26),
  delay: -((i * 3.1) % 14),
}));

// frame corners that carry star-rosette ornaments
const CORNERS: [number, number][] = [
  [26, 26],
  [374, 26],
  [26, 566],
  [374, 566],
];

// engraver's hatching between the outer and inner frame rules
const HATCH: [number, number, number, number][] = [];
for (let x = 48; x <= 352; x += 16) {
  HATCH.push([x, 10, x, 16], [x, 584, x, 590]);
}
for (let y = 48; y <= 544; y += 16) {
  HATCH.push([10, y, 16, y], [384, y, 390, y]);
}

/* ==================== SIX FOLDS — MINI CONSTELLATIONS =================== */

interface MiniAster {
  stars: { x: number; y: number; r: number }[];
  links: [number, number][];
  focal: number[];
}

// every plate of the atlas has its own small constellation (viewBox 0 0 110 110)
const MINIS: Record<string, MiniAster> = {
  // BIRTH CHART — a natal wheel: ring of houses around a central sun
  birth: (() => {
    const ring = ringPts(55, 55, 36, 8).map(([x, y]) => ({ x, y, r: 1.6 }));
    const stars = [...ring, { x: 55, y: 55, r: 2.6 }];
    const links: [number, number][] = [];
    for (let i = 0; i < 8; i++) links.push([i, (i + 1) % 8], [8, i]);
    return { stars, links, focal: [8] };
  })(),
  // DAILY HOROSCOPE — a sun asterism: one bright heart, six rays
  daily: (() => {
    const ring = ringPts(55, 55, 32, 6).map(([x, y]) => ({ x, y, r: 1.4 }));
    const stars = [{ x: 55, y: 55, r: 2.8 }, ...ring];
    const links: [number, number][] = ring.map((_, i) => [0, i + 1] as [number, number]);
    return { stars, links, focal: [0] };
  })(),
  // SYNASTRY — two small figures reaching across one bridge of stars
  synastry: {
    stars: [
      { x: 22, y: 28, r: 1.7 }, { x: 34, y: 44, r: 1.4 }, { x: 24, y: 66, r: 1.5 },
      { x: 88, y: 28, r: 1.7 }, { x: 76, y: 44, r: 1.4 }, { x: 86, y: 66, r: 1.5 },
      { x: 55, y: 47, r: 1.8 },
    ],
    links: [[0, 1], [1, 2], [3, 4], [4, 5], [1, 6], [4, 6]],
    focal: [0, 3],
  },
  // TAROT — the Star: one great star over a ring of seven small ones
  tarot: (() => {
    const smalls = ringPts(55, 58, 34, 7).map(([x, y]) => ({ x, y, r: 1.3 }));
    const stars = [{ x: 55, y: 36, r: 2.8 }, ...smalls];
    const links: [number, number][] = [];
    for (let i = 0; i < 7; i++) links.push([i + 1, ((i + 1) % 7) + 1]);
    return { stars, links, focal: [0] };
  })(),
  // PSYCHOLOGY — a prism asterism: one triangle fanning into three
  psychology: {
    stars: [
      { x: 50, y: 18, r: 1.8 }, { x: 26, y: 72, r: 1.4 }, { x: 70, y: 68, r: 1.4 },
      { x: 88, y: 44, r: 1.3 }, { x: 94, y: 64, r: 1.3 }, { x: 88, y: 86, r: 1.3 },
    ],
    links: [[0, 1], [1, 2], [2, 0], [2, 3], [2, 4], [2, 5]],
    focal: [0],
  },
  // COSMIC PASSPORT — a seal: ring of six around the bearer's star
  passport: (() => {
    const ring = ringPts(55, 53, 30, 6).map(([x, y]) => ({ x, y, r: 1.4 }));
    const stars = [...ring, { x: 55, y: 53, r: 2.2 }];
    const links: [number, number][] = [];
    for (let i = 0; i < 6; i++) links.push([i, (i + 1) % 6]);
    links.push([0, 6], [3, 6]);
    return { stars, links, focal: [6] };
  })(),
};

const SECTIONS = [
  {
    key: "birth",
    tag: "FREE",
    title: "Birth Chart",
    desc: "Map your Sun, Moon, and Rising — the foundation of every reading.",
    href: "/birth-chart",
  },
  {
    key: "daily",
    tag: "DAILY",
    title: "Daily Horoscope",
    desc: "Twelve signs, one sky. Clear forecasts without the fluff.",
    href: "/horoscope",
  },
  {
    key: "synastry",
    tag: "SYNASTRY",
    title: "Compatibility",
    desc: "Zodiac match, Chinese pairs, and deep synastry for two charts.",
    href: "/compatibility",
  },
  {
    key: "tarot",
    tag: "SPREADS",
    title: "Tarot",
    desc: "Daily card to Celtic Cross — pull, reflect, get a full reading.",
    href: "/tarot",
  },
  {
    key: "psychology",
    tag: "TESTS",
    title: "Psychology",
    desc: "MBTI, Big Five, empathy and more — meet yourself beyond the signs.",
    href: "/psychology",
  },
  {
    key: "passport",
    tag: "YOU",
    title: "Cosmic Passport",
    desc: "Your Cosmic ID, people, journal, and Premium deep dives — one hub.",
    href: "/passport",
  },
];

/* ======================== DESTINY MATRIX OCTAGRAM ======================= */

const OCT_C = 160;
const OCT_R = 118;
const OCT_PTS = ringPts(OCT_C, OCT_C, OCT_R, 8).map(([x, y]) => ({ x, y }));
const OCT_SQUARE_A = [0, 2, 4, 6].map((k) => OCT_PTS[k]);
const OCT_SQUARE_B = [1, 3, 5, 7].map((k) => OCT_PTS[k]);
const octPath = (pts: { x: number; y: number }[]) =>
  pts.map((p, i) => `${i ? "L" : "M"} ${p.x} ${p.y}`).join(" ") + " Z";
const OCT_NODES = [
  { label: "DESTINY", n: "22" },
  { label: "PURPOSE", n: "7" },
  { label: "LOVE", n: "15" },
  { label: "MONEY", n: "9" },
  { label: "TALENT", n: "13" },
  { label: "KARMA", n: "4" },
  { label: "HEALTH", n: "18" },
  { label: "SPIRIT", n: "11" },
];

/* ================================ FAQ ================================== */

const FAQS = [
  {
    n: "I",
    q: "What can I do on Astro Scope for free?",
    a: "Cast a free birth chart, read daily horoscopes for all twelve signs, pull tarot spreads, run compatibility, and explore the psychology tests — no account required.",
  },
  {
    n: "II",
    q: "How do I get my free birth chart?",
    a: "Open the calculator, enter your birth date, time and place, and generate — your wheel, planets and houses appear in seconds.",
  },
  {
    n: "III",
    q: "Where are daily horoscopes?",
    a: "Pick your sign from the homepage zodiac band, or open the Horoscopes hub — every sign, every day.",
  },
  {
    n: "IV",
    q: "What is the Destiny Matrix?",
    a: "An optional birth-date octagram that maps purpose, love, money and age themes from your birth date — a numerological companion to the natal chart.",
  },
];

/* ============================ PAGE STARFIELD ============================ */

// deterministic silver starfield across a 1600×1000 field
const SKY_STARS = Array.from({ length: 150 }, (_, i) => ({
  x: +((i * 719.3 + 131) % 1600).toFixed(1),
  y: +((i * 457.7 + 71) % 1000).toFixed(1),
  r: +(0.4 + ((i * 13) % 10) / 15).toFixed(2),
  o: +(0.25 + ((i * 17) % 10) / 26).toFixed(2),
  tw: i % 3 === 0,
  dur: 16 + ((i * 7) % 22),
  delay: -((i * 5.3) % 18),
}));

/* ============================ SMALL COMPONENTS ========================== */

// star-rosette corner ornament for engraved plates (HTML-positioned)
function Rosette({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 16 16" className={`pointer-events-none absolute h-4 w-4 ${className}`} aria-hidden="true">
      <circle cx="8" cy="8" r="6.6" fill={INK} fillOpacity="0.6" stroke={GOLD} strokeOpacity="0.55" strokeWidth="0.7" />
      <circle cx="8" cy="8" r="4.6" fill="none" stroke={GOLD} strokeOpacity="0.3" strokeWidth="0.4" />
      {Array.from({ length: 8 }, (_, k) => {
        const a = k * 45 * DEG;
        const len = k % 2 === 0 ? 4.6 : 2.8;
        return (
          <line
            key={k}
            x1="8"
            y1="8"
            x2={8 + len * Math.cos(a)}
            y2={8 + len * Math.sin(a)}
            stroke={GOLD}
            strokeOpacity="0.75"
            strokeWidth="0.55"
          />
        );
      })}
      <circle cx="8" cy="8" r="0.9" fill={GOLD_BRIGHT} />
    </svg>
  );
}

// a small engraved constellation diagram: silver stars, hairline chart links
function MiniConstellation({ aster, delay = 0 }: { aster: MiniAster; delay?: number }) {
  return (
    <svg viewBox="0 0 110 110" className="h-[104px] w-[104px] shrink-0" role="img" aria-label="A small engraved constellation diagram">
      {/* dashed coordinate ring, like an atlas graticule */}
      <circle cx="55" cy="55" r="50" fill="none" stroke={GOLD} strokeOpacity="0.16" strokeWidth="0.5" strokeDasharray="2 4" />
      {aster.links.map(([a, b], i) => (
        <line
          key={i}
          className="lvc-fade"
          style={{ animationDelay: `${delay + 0.5 + i * 0.06}s` }}
          x1={aster.stars[a].x}
          y1={aster.stars[a].y}
          x2={aster.stars[b].x}
          y2={aster.stars[b].y}
          stroke={SILVER}
          strokeOpacity="0.3"
          strokeWidth="0.5"
        />
      ))}
      {aster.stars.map((s, i) => {
        const isFocal = aster.focal.includes(i);
        return (
          <g key={i}>
            {isFocal && (
              <circle className="lvc-pulse" style={{ "--t": "26s" } as CSSProperties} cx={s.x} cy={s.y} r={s.r + 5} fill="url(#lvc-g-silverglow)" />
            )}
            <circle
              className="lvc-star"
              style={{ animationDelay: `${delay + 0.35 + i * 0.07}s` }}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill={isFocal ? SILVER_BRIGHT : SILVER}
            />
            {isFocal && (
              <path
                className="lvc-fade"
                style={{ animationDelay: `${delay + 0.9}s` }}
                d={sparkle(s.x, s.y, s.r + 4)}
                stroke={SILVER_BRIGHT}
                strokeOpacity="0.85"
                strokeWidth="0.5"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ========================= HERO — MAIDEN PLATE ========================== */

function HeroMaiden() {
  const focal = MAIDEN.stars[MAIDEN.focal];
  return (
    <svg
      viewBox="0 0 400 600"
      className="h-auto w-full"
      role="img"
      aria-label="An engraved celestial plate of the Maiden of Virgo, drawn in gold lines around her silver asterism"
    >
      {/* plate ground: deep midnight gradient */}
      <rect x="0" y="0" width="400" height="600" fill="url(#lvc-g-platesky)" />

      {/* Milky Way band washing behind the figure */}
      <ellipse
        className="lvc-milky"
        cx="200"
        cy="290"
        rx="270"
        ry="46"
        fill="url(#lvc-g-band)"
        filter="url(#lvc-f-blur)"
        transform="rotate(-28 200 290)"
      />
      <text
        className="lvc-fade"
        style={{ animationDelay: "1.9s" }}
        x="66"
        y="168"
        transform="rotate(-28 66 168)"
        fill={SILVER}
        fillOpacity="0.5"
        fontSize="5.5"
        fontFamily={SERIF}
        fontStyle="italic"
        letterSpacing="2"
      >
        VIA LACTEA
      </text>

      {/* engraved plate frame: hatched double rule + star-rosette corners */}
      <g className="lvc-fade" style={{ animationDelay: "0.1s" }}>
        <rect x="10" y="10" width="380" height="580" fill="none" stroke={GOLD_DIM} strokeWidth="1.4" />
        <rect x="16" y="16" width="368" height="568" fill="none" stroke={GOLD_DIM} strokeWidth="0.5" />
        {HATCH.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={GOLD} strokeOpacity="0.22" strokeWidth="0.4" />
        ))}
        {CORNERS.map(([cx, cy], ci) => (
          <g key={ci}>
            <circle cx={cx} cy={cy} r="12" fill={INK} fillOpacity="0.7" stroke={GOLD} strokeOpacity="0.6" strokeWidth="0.8" />
            <circle cx={cx} cy={cy} r="8.5" fill="none" stroke={GOLD} strokeOpacity="0.35" strokeWidth="0.4" />
            {Array.from({ length: 8 }, (_, k) => {
              const a = k * 45 * DEG;
              const len = k % 2 === 0 ? 7.5 : 4.5;
              return (
                <line key={k} x1={cx} y1={cy} x2={cx + len * Math.cos(a)} y2={cy + len * Math.sin(a)} stroke={GOLD} strokeOpacity="0.7" strokeWidth="0.55" />
              );
            })}
            <circle cx={cx} cy={cy} r="1.3" fill={GOLD_BRIGHT} />
          </g>
        ))}
      </g>

      {/* background field stars */}
      <g className="lvc-fade" style={{ animationDelay: "0.5s" }}>
        {PLATE_FIELD.map((s, i) => (
          <circle
            key={i}
            className={s.twinkle ? "lvc-twinkle" : undefined}
            style={s.twinkle ? ({ animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` } as CSSProperties) : undefined}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill={SILVER}
            fillOpacity={s.twinkle ? 1 : 0.55}
          />
        ))}
      </g>

      {/* faint dashed ecliptic arc crossing the plate */}
      <g className="lvc-fade" style={{ animationDelay: "0.8s" }}>
        <ellipse
          cx="200"
          cy="300"
          rx="230"
          ry="64"
          fill="none"
          stroke={GOLD}
          strokeOpacity="0.14"
          strokeWidth="0.6"
          strokeDasharray="5 4"
          transform="rotate(-24 200 300)"
        />
        <text x="298" y="430" transform="rotate(-24 298 430)" fill={GOLD} fillOpacity="0.4" fontSize="5.5" fontFamily={SERIF} letterSpacing="2">
          ECLIPTICA
        </text>
      </g>

      {/* Coma Berenices: faint neighbor hint */}
      <g className="lvc-fade" style={{ animationDelay: "1.1s" }}>
        {COMA.links.map(([a, b], li) => (
          <line key={li} x1={COMA.stars[a][0]} y1={COMA.stars[a][1]} x2={COMA.stars[b][0]} y2={COMA.stars[b][1]} stroke={SILVER} strokeOpacity="0.2" strokeWidth="0.45" strokeDasharray="2 3" />
        ))}
        {COMA.stars.map(([sx, sy], si) => (
          <circle key={si} cx={sx} cy={sy} r={si === 1 ? 1.5 : 1.1} fill={SILVER} fillOpacity="0.5" />
        ))}
        <text x="312" y="88" fill={SILVER} fillOpacity="0.45" fontSize="6" fontFamily={SERIF} fontStyle="italic" letterSpacing="1.5">
          COMA BERENICES
        </text>
      </g>

      {/* chart hairlines between the asterism's stars */}
      <g className="lvc-fade" style={{ animationDelay: "1.55s" }}>
        {MAIDEN.links.map(([a, b], i) => (
          <line key={i} x1={MAIDEN.stars[a].x} y1={MAIDEN.stars[a].y} x2={MAIDEN.stars[b].x} y2={MAIDEN.stars[b].y} stroke={SILVER} strokeOpacity="0.28" strokeWidth="0.5" />
        ))}
      </g>

      {/* the Maiden, engraved segment by segment */}
      <g fill="none" stroke={GOLD} strokeLinecap="round" strokeLinejoin="round">
        {MAIDEN.segments.map((s, i) => (
          <path
            key={i}
            className="lvc-draw"
            pathLength={1}
            d={s.d}
            strokeWidth={s.w ?? 0.8}
            strokeOpacity={s.op ?? 0.9}
            style={{ animationDelay: `${s.t}s` }}
          />
        ))}
      </g>

      {/* the asterism: silver nodes, halos, greek-letter labels */}
      <g>
        {MAIDEN.stars.map((s, i) => (
          <g key={i}>
            <circle className="lvc-star" style={{ animationDelay: `${s.t}s` }} cx={s.x} cy={s.y} r={s.r + 2.6} fill="none" stroke={SILVER} strokeOpacity="0.3" strokeWidth="0.4" />
            <circle className="lvc-star" style={{ animationDelay: `${s.t}s` }} cx={s.x} cy={s.y} r={s.r} fill={i === MAIDEN.focal ? SILVER_BRIGHT : SILVER} />
            {s.label && (
              <text
                className="lvc-fade"
                style={{ animationDelay: `${s.t + 0.15}s` }}
                x={s.lx}
                y={s.ly}
                textAnchor={s.anchor ?? "start"}
                fill={SILVER}
                fillOpacity="0.8"
                fontSize="6.5"
                fontFamily={SERIF}
                fontStyle="italic"
                letterSpacing="0.5"
              >
                {s.label}
              </text>
            )}
          </g>
        ))}
        {/* Spica: slow-pulsing glow + four-point sparkle */}
        <circle className="lvc-pulse" style={{ "--t": "34s" } as CSSProperties} cx={focal.x} cy={focal.y} r={focal.r + 14} fill="url(#lvc-g-silverglow)" />
        <g className="lvc-fade" style={{ animationDelay: "1.6s" }}>
          <line x1={focal.x} y1={focal.y - 10} x2={focal.x} y2={focal.y + 10} stroke={SILVER_BRIGHT} strokeOpacity="0.9" strokeWidth="0.6" />
          <line x1={focal.x - 10} y1={focal.y} x2={focal.x + 10} y2={focal.y} stroke={SILVER_BRIGHT} strokeOpacity="0.9" strokeWidth="0.6" />
        </g>
      </g>

      {/* title cartouche at the head of the plate */}
      <g className="lvc-fade" style={{ animationDelay: "1.7s" }}>
        <rect x="86" y="52" width="228" height="26" fill={INK} fillOpacity="0.8" stroke={GOLD} strokeOpacity="0.55" strokeWidth="0.8" />
        <rect x="90" y="56" width="220" height="18" fill="none" stroke={GOLD} strokeOpacity="0.3" strokeWidth="0.4" />
        <path d="M 80 65 L 86 59 L 86 71 Z" fill={INK} stroke={GOLD} strokeOpacity="0.45" strokeWidth="0.6" />
        <path d="M 320 65 L 314 59 L 314 71 Z" fill={INK} stroke={GOLD} strokeOpacity="0.45" strokeWidth="0.6" />
        <text x="200" y="69" textAnchor="middle" fill={GOLD_BRIGHT} fontSize="8.5" fontFamily={SERIF} letterSpacing="1.5">
          {`♍${FE} VIRGO · DOMUS MERCURII ☿${FE}`}
        </text>
      </g>

      {/* plate signature at the foot */}
      <g className="lvc-fade" style={{ animationDelay: "1.85s" }}>
        <line x1="62" y1="548" x2="112" y2="548" stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.6" />
        <line x1="288" y1="548" x2="338" y2="548" stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.6" />
        <path d="M 52 548 L 56 544 L 60 548 L 56 552 Z" fill={GOLD} fillOpacity="0.6" />
        <path d="M 340 548 L 344 544 L 348 548 L 344 552 Z" fill={GOLD} fillOpacity="0.6" />
        <text x="200" y="553" textAnchor="middle" fill={GOLD_BRIGHT} fontSize="12" fontFamily={SERIF} letterSpacing="5">
          TABULA I
        </text>
      </g>
    </svg>
  );
}

/* ====================== DESTINY MATRIX STAR-OCTAGRAM ==================== */

function DestinyOctagram() {
  return (
    <svg
      viewBox="0 0 320 320"
      className="h-auto w-full"
      role="img"
      aria-label="An engraved star-octagram of the Destiny Matrix with eight labeled destiny nodes"
    >
      {/* plate ground + frame */}
      <rect x="0" y="0" width="320" height="320" fill="url(#lvc-g-platesky)" />
      <rect x="8" y="8" width="304" height="304" fill="none" stroke={GOLD_DIM} strokeWidth="1.2" />
      <rect x="13" y="13" width="294" height="294" fill="none" stroke={GOLD_DIM} strokeWidth="0.5" />
      {/* slow gleam traveling the outer halo */}
      <circle className="lvc-gleam" style={{ "--t": "90s" } as CSSProperties} cx="160" cy="160" r="146" fill="none" stroke="rgba(217,182,74,.35)" strokeWidth="1" strokeDasharray="22 895" strokeLinecap="round" />
      <circle cx="160" cy="160" r="136" fill="none" stroke={GOLD} strokeOpacity="0.18" strokeWidth="0.6" strokeDasharray="2 5" />

      {/* spokes from the heart to each vertex */}
      {OCT_PTS.map((p, i) => (
        <line key={i} className="lvc-fade" style={{ animationDelay: "0.6s" }} x1="160" y1="160" x2={p.x} y2={p.y} stroke={GOLD} strokeOpacity="0.28" strokeWidth="0.5" />
      ))}

      {/* the octagram itself: two overlaid squares, drawn on load */}
      <path className="lvc-draw" pathLength={1} style={{ animationDelay: "0.35s" }} d={octPath(OCT_SQUARE_A)} fill="none" stroke={GOLD} strokeOpacity="0.85" strokeWidth="0.9" strokeLinejoin="round" />
      <path className="lvc-draw" pathLength={1} style={{ animationDelay: "0.8s" }} d={octPath(OCT_SQUARE_B)} fill="none" stroke={GOLD} strokeOpacity="0.65" strokeWidth="0.9" strokeLinejoin="round" />

      {/* glowing heart of the matrix */}
      <circle className="lvc-pulse" style={{ "--t": "22s" } as CSSProperties} cx="160" cy="160" r="22" fill="url(#lvc-g-goldglow)" />
      <circle cx="160" cy="160" r="3.4" fill={GOLD_BRIGHT} />
      <path d={sparkle(160, 160, 12)} stroke={GOLD_BRIGHT} strokeOpacity="0.8" strokeWidth="0.6" />

      {/* vertex stars with arcana numbers, lighting up in slow sequence */}
      {OCT_PTS.map((p, i) => {
        const t = (i * 45 - 90) * DEG;
        const lx = 160 + (OCT_R + 24) * Math.cos(t);
        const ly = 160 + (OCT_R + 24) * Math.sin(t);
        return (
          <g key={i} className="lvc-node" style={{ "--d": `${i * 1.8}s` } as CSSProperties}>
            <circle cx={p.x} cy={p.y} r="10" fill={INK} fillOpacity="0.85" stroke={GOLD} strokeOpacity="0.7" strokeWidth="0.9" />
            <circle cx={p.x} cy={p.y} r="6.5" fill="none" stroke={GOLD} strokeOpacity="0.3" strokeWidth="0.4" />
            <text x={p.x} y={p.y + 2.6} textAnchor="middle" fontFamily={SERIF} fontWeight="700" fontSize="8" fill={GOLD_BRIGHT}>
              {OCT_NODES[i].n}
            </text>
            <text x={lx.toFixed(1)} y={(ly + 2.5).toFixed(1)} textAnchor="middle" fontSize="7" letterSpacing="1.5" fill={SILVER} fillOpacity="0.9">
              {OCT_NODES[i].label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ================================= PAGE ================================= */

const TICK_POS = [
  "left-1.5 top-1.5 border-l border-t",
  "right-1.5 top-1.5 border-r border-t",
  "left-1.5 bottom-1.5 border-l border-b",
  "right-1.5 bottom-1.5 border-r border-b",
];

export default function VirgoChartLanding() {
  return (
    <div className="lvc-root relative isolate min-h-screen">
      <style>{`
        .lvc-root { background: #060a1c; color: #dfe6f2; font-family: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif; }
        .lvc-root ::selection { background: rgba(217,182,74,.25); color: #f2d675; }
        .lvc-serif { font-family: Georgia, 'Times New Roman', serif; }
        .lvc-rule { height: 1px; background: linear-gradient(90deg, transparent, rgba(217,182,74,.45), transparent); }

        /* buttons */
        .lvc-btn-primary { display: inline-block; background: linear-gradient(180deg, #f2d675 0%, #d9b64a 52%, #a8842e 100%); color: #141024; border: 1px solid #8a6f2c; box-shadow: inset 0 1px 0 rgba(255,248,220,.8), inset 0 -1px 0 rgba(80,60,20,.6), 0 12px 30px -14px rgba(217,182,74,.45); transition: filter .35s ease, box-shadow .35s ease; }
        .lvc-btn-primary:hover { filter: brightness(1.07); box-shadow: inset 0 1px 0 rgba(255,248,220,.8), inset 0 -1px 0 rgba(80,60,20,.6), 0 16px 36px -12px rgba(217,182,74,.6); }
        .lvc-btn-ghost { display: inline-block; border: 1px solid rgba(217,182,74,.45); color: #f2d675; transition: border-color .35s ease, background .35s ease; }
        .lvc-btn-ghost:hover { border-color: rgba(242,214,117,.85); background: rgba(217,182,74,.07); }

        /* engraved plates */
        .lvc-plate, .lvc-sign, .lvc-faq { background: linear-gradient(180deg, rgba(20,29,68,.5) 0%, rgba(11,16,38,.9) 100%); border: 1px solid rgba(217,182,74,.3); box-shadow: inset 0 0 0 4px rgba(11,16,38,.55), inset 0 0 0 5px rgba(217,182,74,.16); transition: border-color .45s ease, box-shadow .45s ease, transform .45s ease; }
        .lvc-plate:hover, .lvc-sign:hover, .lvc-faq:hover { border-color: rgba(242,214,117,.6); box-shadow: 0 18px 40px -22px rgba(0,0,0,.9), 0 0 30px -10px rgba(217,182,74,.2), inset 0 0 0 4px rgba(11,16,38,.55), inset 0 0 0 5px rgba(242,214,117,.28); }
        .lvc-sign:hover { transform: translateY(-3px); }
        .lvc-tag { display: inline-block; border: 1px solid rgba(217,182,74,.5); color: #f2d675; background: rgba(217,182,74,.06); letter-spacing: .28em; }
        .lvc-link { color: #f2d675; transition: color .3s ease; }
        .lvc-plate:hover .lvc-link { color: #f8e7a8; }
        .lvc-mech { transition: filter .5s ease; }
        .lvc-plate:hover .lvc-mech { filter: drop-shadow(0 0 10px rgba(200,211,230,.3)); }
        .lvc-nav-link { transition: color .3s ease; }
        .lvc-nav-link:hover { color: #f2d675; }

        /* load: the plate engraves itself, stars pop in, text rises */
        .lvc-rise { animation: lvc-rise .9s cubic-bezier(.22,.7,.3,1) backwards; animation-delay: var(--d, 0s); }
        .lvc-fade { animation: lvc-fade-in 1s ease-out backwards; }
        .lvc-draw { stroke-dasharray: 1; animation: lvc-draw .9s ease-out both; }
        .lvc-star { transform-box: fill-box; transform-origin: center; animation: lvc-star-pop .5s cubic-bezier(.22,1,.36,1) both; }

        /* ambient motion — all slow, all restrained */
        .lvc-twinkle { animation: lvc-twinkle 22s ease-in-out infinite; }
        .lvc-milky { animation: lvc-milky 52s ease-in-out infinite; }
        .lvc-pulse { animation: lvc-pulse var(--t, 30s) ease-in-out infinite; }
        .lvc-gleam { transform-box: view-box; transform-origin: 160px 160px; animation: lvc-spin var(--t, 90s) linear infinite; }
        .lvc-node { animation: lvc-nodepulse 14.4s ease-in-out infinite; animation-delay: var(--d, 0s); }
        .lvc-wash { animation: lvc-wash 64s ease-in-out infinite alternate; }

        @keyframes lvc-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes lvc-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lvc-draw { from { opacity: 0; stroke-dashoffset: 1; } to { opacity: 1; stroke-dashoffset: 0; } }
        @keyframes lvc-star-pop { from { opacity: 0; transform: scale(.2); } to { opacity: 1; transform: scale(1); } }
        @keyframes lvc-twinkle { 0%, 100% { opacity: .18; } 50% { opacity: .75; } }
        @keyframes lvc-milky { 0%, 100% { opacity: .07; } 50% { opacity: .13; } }
        @keyframes lvc-pulse { 0%, 100% { opacity: .45; } 50% { opacity: .9; } }
        @keyframes lvc-spin { to { transform: rotate(360deg); } }
        @keyframes lvc-nodepulse { 0%, 100% { opacity: .5; } 7% { opacity: 1; } 20% { opacity: .5; } }
        @keyframes lvc-wash { from { opacity: .5; transform: rotate(-24deg) translate3d(0,0,0); } to { opacity: 1; transform: rotate(-24deg) translate3d(2.5%, -1.5%, 0); } }

        /* page background */
        .lvc-bg { position: fixed; inset: 0; z-index: -1; overflow: hidden; pointer-events: none; background: radial-gradient(140% 90% at 50% -10%, #141d44 0%, #0d1430 45%, #060a1c 100%); }

        @media (prefers-reduced-motion: reduce) {
          .lvc-root *, .lvc-root *::before, .lvc-root *::after { animation: none !important; }
        }
      `}</style>

      {/* page background: deep midnight sky, silver starfield, Milky Way wash */}
      <div className="lvc-bg" aria-hidden="true">
        <div
          className="lvc-wash absolute left-[-22%] top-[6%] h-[44vmax] w-[130vmax] rounded-full blur-3xl"
          style={{ background: "linear-gradient(90deg, transparent, rgba(200,211,230,.05) 28%, rgba(200,211,230,.1) 50%, rgba(200,211,230,.05) 72%, transparent)" }}
        />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
          {SKY_STARS.map((s, i) => (
            <circle
              key={i}
              className={s.tw ? "lvc-twinkle" : undefined}
              style={s.tw ? ({ animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` } as CSSProperties) : undefined}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill={i % 9 === 4 ? "#e6ddba" : SILVER}
              opacity={s.o}
            />
          ))}
        </svg>
        {/* a giant hairline graticule ring looming off the lower right */}
        <svg className="absolute -bottom-[38vmin] -right-[30vmin] h-[110vmin] w-[110vmin]" viewBox="0 0 1000 1000" aria-hidden="true">
          <circle cx="500" cy="500" r="470" fill="none" stroke={GOLD} strokeOpacity="0.08" strokeWidth="1" />
          <circle cx="500" cy="500" r="380" fill="none" stroke={GOLD} strokeOpacity="0.06" strokeWidth="0.7" strokeDasharray="2 7" />
          {ringPts(500, 500, 470, 48).map(([x, y], i) => (
            <line key={i} x1={x} y1={y} x2={500 + (x - 500) * 0.965} y2={500 + (y - 500) * 0.965} stroke={GOLD} strokeOpacity="0.09" strokeWidth={i % 4 === 0 ? 1 : 0.5} />
          ))}
        </svg>
      </div>

      {/* shared defs: gradients reusable across every SVG on the page */}
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="lvc-g-platesky" cx="50%" cy="42%" r="80%">
            <stop offset="0%" stopColor="#141d44" />
            <stop offset="50%" stopColor="#0d1430" />
            <stop offset="100%" stopColor="#070b1e" />
          </radialGradient>
          <radialGradient id="lvc-g-silverglow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={SILVER_BRIGHT} stopOpacity="0.95" />
            <stop offset="35%" stopColor={SILVER} stopOpacity="0.35" />
            <stop offset="100%" stopColor={SILVER} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="lvc-g-goldglow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={GOLD_BRIGHT} stopOpacity="0.9" />
            <stop offset="40%" stopColor={GOLD} stopOpacity="0.3" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="lvc-g-band" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={SILVER} stopOpacity="0" />
            <stop offset="50%" stopColor={SILVER} stopOpacity="0.55" />
            <stop offset="100%" stopColor={SILVER} stopOpacity="0" />
          </linearGradient>
          <filter id="lvc-f-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>
      </svg>

      {/* ==================== TOP NAV ==================== */}
      <header>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="flex items-center gap-2.5">
            <svg viewBox="0 0 34 22" className="h-[18px] w-[28px]" aria-hidden="true">
              <polyline points="3,17 11,11 19,13 26,6 31,9" fill="none" stroke={GOLD} strokeOpacity="0.7" strokeWidth="0.7" />
              {[[3, 17, 1.4], [11, 11, 1.7], [19, 13, 1.3], [26, 6, 2], [31, 9, 1.4]].map(([x, y, r]) => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={SILVER_BRIGHT} />
              ))}
              <path d={sparkle(26, 6, 4.6)} stroke={SILVER_BRIGHT} strokeOpacity="0.85" strokeWidth="0.5" />
            </svg>
            <span className="lvc-serif text-[13px] tracking-[0.38em] text-[#f2d675]">ASTRO&nbsp;SCOPE</span>
          </a>
          <nav className="flex items-center gap-7 text-[11px] uppercase tracking-[0.22em] text-[#dfe6f2]/65">
            <a href="/horoscope" className="lvc-nav-link hidden sm:inline">Horoscopes</a>
            <a href="/tarot" className="lvc-nav-link hidden sm:inline">Tarot</a>
            <a href="/compatibility" className="lvc-nav-link hidden md:inline">Compatibility</a>
            <a href="/sign-in" className="lvc-nav-link border border-[rgba(217,182,74,.5)] px-3.5 py-1.5 text-[#f2d675] hover:border-[rgba(242,214,117,.8)]">Sign&nbsp;In</a>
          </nav>
        </div>
        <div className="lvc-rule" />
      </header>

      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden">
        {/* faint graticule behind the headline */}
        <svg className="pointer-events-none absolute -left-40 top-1/2 hidden h-[560px] w-[560px] -translate-y-1/2 lg:block" viewBox="0 0 560 560" aria-hidden="true">
          <circle cx="280" cy="280" r="270" fill="none" stroke={GOLD} strokeOpacity="0.07" strokeWidth="0.8" />
          <circle cx="280" cy="280" r="205" fill="none" stroke={GOLD} strokeOpacity="0.05" strokeWidth="0.6" strokeDasharray="2 6" />
          <line x1="280" y1="10" x2="280" y2="550" stroke={GOLD} strokeOpacity="0.04" strokeWidth="0.6" />
          <line x1="10" y1="280" x2="550" y2="280" stroke={GOLD} strokeOpacity="0.04" strokeWidth="0.6" />
        </svg>
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <p className="lvc-rise flex items-center gap-3 text-[11px] uppercase tracking-[0.34em] text-[rgba(217,182,74,.75)]" style={{ "--d": ".1s" } as CSSProperties}>
              <svg viewBox="0 0 10 10" className="h-2 w-2" aria-hidden="true"><path d="M 5 0 L 6 4 L 10 5 L 6 6 L 5 10 L 4 6 L 0 5 L 4 4 Z" fill={GOLD} fillOpacity="0.8" /></svg>
              An Engraved Celestial Atlas
            </p>
            <h1 className="lvc-rise lvc-serif mt-6 text-5xl leading-[1.1] text-[#eef2fb] sm:text-6xl" style={{ "--d": ".25s" } as CSSProperties}>
              Every star is a <em className="text-[#f2d675]">letter.</em>
              <br />
              We read the sky.
            </h1>
            <p className="lvc-rise mt-6 max-w-md text-[15px] leading-relaxed text-[#dfe6f2]/60" style={{ "--d": ".45s" } as CSSProperties}>
              Free birth chart, daily horoscopes, synastry and tarot.
            </p>
            <div className="lvc-rise mt-9 flex flex-wrap items-center gap-4" style={{ "--d": ".6s" } as CSSProperties}>
              <a href="/birth-chart" className="lvc-btn-primary lvc-serif px-7 py-3.5 text-[13px] font-bold uppercase tracking-[0.18em]">
                Cast your free birth chart
              </a>
              <a href="/horoscope" className="lvc-btn-ghost px-6 py-3.5 text-[12px] uppercase tracking-[0.2em]">
                Read today&rsquo;s horoscope&nbsp;&rarr;
              </a>
            </div>
            <p className="lvc-rise mt-8 text-[10px] uppercase tracking-[0.3em] text-[#dfe6f2]/35" style={{ "--d": ".75s" } as CSSProperties}>
              Tabula caelestis&nbsp;&nbsp;·&nbsp;&nbsp;editio MMXXVI
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-[440px]">
            {/* silver glow breathing behind the plate */}
            <div
              className="lvc-pulse pointer-events-none absolute -inset-10 rounded-full blur-3xl"
              style={{ "--t": "38s", background: "radial-gradient(closest-side, rgba(200,211,230,.1), transparent 70%)" } as CSSProperties}
              aria-hidden="true"
            />
            <HeroMaiden />
          </div>
        </div>
        <div className="lvc-rule" />
      </section>

      {/* ==================== SIGN BAND — TWELVE CONSTELLATION PLATES ==================== */}
      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <p className="text-center text-[11px] uppercase tracking-[0.34em] text-[rgba(217,182,74,.75)]">Daily Horoscope</p>
        <h2 className="lvc-serif mt-4 text-center text-3xl text-[#eef2fb] sm:text-4xl">Twelve plates of the zodiac</h2>
        <div className="relative mt-12 lg:mt-14">
          {/* a faint dashed ecliptic arc threading behind the plates */}
          <svg className="pointer-events-none absolute inset-0 hidden h-full w-full xl:block" viewBox="0 0 1200 360" preserveAspectRatio="none" aria-hidden="true">
            <path d="M -20 250 Q 600 60 1220 250" fill="none" stroke={GOLD} strokeOpacity="0.14" strokeWidth="0.8" strokeDasharray="5 5" />
            <path d="M -20 262 Q 600 74 1220 262" fill="none" stroke={GOLD} strokeOpacity="0.07" strokeWidth="0.5" />
          </svg>
          <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {SIGNS.map((s, i) => (
              <a
                key={s.n}
                href={`/horoscope/${s.n.toLowerCase()}`}
                className={`lvc-sign group relative flex flex-col items-center px-3 pb-5 pt-4 text-center ${i % 2 === 1 ? "xl:translate-y-4" : ""}`}
              >
                <svg viewBox="0 0 96 60" className="h-[52px] w-[84px]" aria-hidden="true">
                  {s.aster.links.map(([a, b], li) => (
                    <line
                      key={li}
                      x1={s.aster.stars[a][0]}
                      y1={s.aster.stars[a][1]}
                      x2={s.aster.stars[b][0]}
                      y2={s.aster.stars[b][1]}
                      stroke={SILVER}
                      strokeOpacity="0.3"
                      strokeWidth="0.5"
                    />
                  ))}
                  {s.aster.stars.map(([x, y], si) => (
                    <circle
                      key={si}
                      className={si === s.aster.focal ? "lvc-twinkle" : undefined}
                      style={si === s.aster.focal ? ({ animationDuration: `${18 + i * 2}s`, animationDelay: `${-i * 1.7}s` } as CSSProperties) : undefined}
                      cx={x}
                      cy={y}
                      r={si === s.aster.focal ? 2 : 1.3}
                      fill={si === s.aster.focal ? SILVER_BRIGHT : SILVER}
                      fillOpacity={si === s.aster.focal ? 1 : 0.8}
                    />
                  ))}
                  <path
                    d={sparkle(s.aster.stars[s.aster.focal][0], s.aster.stars[s.aster.focal][1], 5)}
                    stroke={SILVER_BRIGHT}
                    strokeOpacity="0.5"
                    strokeWidth="0.45"
                  />
                </svg>
                <span className="mt-3 flex items-baseline gap-2">
                  <span className="text-[15px] leading-none text-[#f2d675]" style={{ fontFamily: GLYPH_FONT }}>{s.g}</span>
                  <span className="text-[11px] uppercase tracking-[0.22em] text-[#eef2fb]/85">{s.n}</span>
                </span>
                <span className="mt-1.5 text-[9.5px] uppercase tracking-[0.14em] text-[#dfe6f2]/40">{s.d}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SIX FOLDS OF THE ATLAS ==================== */}
      <section className="mx-auto max-w-5xl px-6 py-16 lg:py-20">
        <p className="text-center text-[11px] uppercase tracking-[0.34em] text-[rgba(217,182,74,.75)]">The Atlas, Fold by Fold</p>
        <h2 className="lvc-serif mt-4 text-center text-3xl text-[#eef2fb] sm:text-4xl">Everything the stars have to offer</h2>
        {/* star-atlas fold-out: plates alternate left and right of one vertical
            hairline, joined to it by short engraved connectors with node stars */}
        <div className="relative mt-14 lg:mt-16">
          <span
            className="absolute bottom-2 left-[7px] top-2 w-px lg:left-1/2"
            style={{ background: "linear-gradient(180deg, transparent, rgba(217,182,74,.4) 8%, rgba(217,182,74,.4) 92%, transparent)" }}
            aria-hidden="true"
          />
          <div className="flex flex-col gap-10 lg:gap-14">
            {SECTIONS.map((s, i) => {
              const right = i % 2 === 1;
              return (
                <div key={s.key} className="relative lg:grid lg:grid-cols-2 lg:gap-x-20">
                  {/* node star seated on the hairline */}
                  <svg
                    viewBox="0 0 16 16"
                    className="absolute left-[7px] top-[42px] h-4 w-4 -translate-x-1/2 lg:left-1/2"
                    aria-hidden="true"
                  >
                    <circle cx="8" cy="8" r="5.4" fill="#0d1430" stroke={GOLD} strokeOpacity="0.6" strokeWidth="0.7" />
                    <path d={sparkle(8, 8, 3.4)} stroke={GOLD_BRIGHT} strokeOpacity="0.9" strokeWidth="0.55" />
                    <circle cx="8" cy="8" r="0.9" fill={GOLD_BRIGHT} />
                  </svg>
                  {/* connector: from the hairline to the plate edge */}
                  <span
                    className="absolute left-[15px] top-[49px] h-px w-[25px] lg:hidden"
                    style={{ background: "linear-gradient(90deg, rgba(217,182,74,.5), rgba(217,182,74,.15))" }}
                    aria-hidden="true"
                  />
                  <span
                    className={`absolute top-[49px] hidden h-px w-20 lg:block ${right ? "left-1/2" : "right-1/2"}`}
                    style={{
                      background: right
                        ? "linear-gradient(90deg, rgba(217,182,74,.5), rgba(217,182,74,.15))"
                        : "linear-gradient(270deg, rgba(217,182,74,.5), rgba(217,182,74,.15))",
                    }}
                    aria-hidden="true"
                  />
                  <article className={`lvc-plate relative ml-10 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:gap-7 sm:p-7 lg:ml-0 ${right ? "lg:col-start-2" : ""}`}>
                    {TICK_POS.map((pos) => (
                      <span key={pos} className={`pointer-events-none absolute h-2.5 w-2.5 border-[rgba(217,182,74,.55)] ${pos}`} aria-hidden="true" />
                    ))}
                    <div className="lvc-mech mx-auto sm:mx-0">
                      <MiniConstellation aster={MINIS[s.key]} delay={0.15 + i * 0.1} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="lvc-serif text-xl text-[#eef2fb]">{s.title}</h3>
                        <span className="lvc-tag shrink-0 px-2 py-[3px] text-[9px] uppercase">{s.tag}</span>
                      </div>
                      <p className="mt-3 text-[13.5px] leading-relaxed text-[#dfe6f2]/60">{s.desc}</p>
                      <a href={s.href} className="lvc-link mt-5 inline-block text-[11px] uppercase tracking-[0.26em]">
                        Explore&nbsp;&rarr;
                      </a>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== DESTINY MATRIX ==================== */}
      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative mx-auto w-full max-w-[420px]">
            <div
              className="lvc-pulse pointer-events-none absolute -inset-8 rounded-full blur-3xl"
              style={{ "--t": "30s", background: "radial-gradient(closest-side, rgba(217,182,74,.09), transparent 70%)" } as CSSProperties}
              aria-hidden="true"
            />
            <DestinyOctagram />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-[rgba(217,182,74,.75)]">Birth-Date Octagram</p>
            <h2 className="lvc-serif mt-4 text-3xl text-[#eef2fb] sm:text-4xl">The Destiny Matrix</h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#dfe6f2]/60">
              An optional birth-date octagram tool. It maps purpose, love, money, and age themes from your birth date.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Purpose", "Love", "Money", "Age themes"].map((c) => (
                <span key={c} className="lvc-tag px-2.5 py-1.5 text-[10px] uppercase">
                  {c}
                </span>
              ))}
            </div>
            <a href="/destiny-matrix" className="lvc-btn-ghost mt-8 px-6 py-3 text-[12px] uppercase tracking-[0.2em]">
              Open Destiny Matrix&nbsp;&rarr;
            </a>
          </div>
        </div>
      </section>

      {/* ==================== FAQ — ENGRAVED PLATES ==================== */}
      <section className="mx-auto max-w-5xl px-6 py-16 lg:py-20">
        <p className="text-center text-[11px] uppercase tracking-[0.34em] text-[rgba(217,182,74,.75)]">Inquiries</p>
        <h2 className="lvc-serif mt-4 text-center text-3xl text-[#eef2fb] sm:text-4xl">Questions, answered</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 md:pb-6">
          {FAQS.map((f, i) => (
            <article key={f.n} className={`lvc-faq relative p-7 ${i % 2 === 1 ? "md:translate-y-6" : ""}`}>
              <Rosette className="left-1.5 top-1.5" />
              <Rosette className="right-1.5 top-1.5" />
              <Rosette className="bottom-1.5 left-1.5" />
              <Rosette className="bottom-1.5 right-1.5" />
              <div className="flex items-center gap-4">
                <span className="lvc-serif flex h-9 w-9 shrink-0 items-center justify-center border border-[rgba(217,182,74,.55)] bg-[rgba(217,182,74,.06)] text-[13px] font-bold text-[#f2d675]">
                  {f.n}
                </span>
                <h3 className="lvc-serif text-lg leading-snug text-[#eef2fb]">{f.q}</h3>
              </div>
              <div className="mt-4 flex items-center gap-3" aria-hidden="true">
                <span className="lvc-rule flex-1" />
                <svg viewBox="0 0 14 14" className="h-2.5 w-2.5">
                  <path d="M 7 0 L 8.2 5.8 L 14 7 L 8.2 8.2 L 7 14 L 5.8 8.2 L 0 7 L 5.8 5.8 Z" fill={GOLD} fillOpacity="0.85" />
                </svg>
                <span className="lvc-rule flex-1" />
              </div>
              <p className="mt-4 text-[13.5px] leading-relaxed text-[#dfe6f2]/60">{f.a}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ==================== CTA BAND ==================== */}
      <section className="mx-auto max-w-3xl px-6 py-20 lg:py-28">
        <div className="lvc-plate relative px-8 py-14 text-center sm:px-14">
          <Rosette className="left-2 top-2" />
          <Rosette className="right-2 top-2" />
          <Rosette className="bottom-2 left-2" />
          <Rosette className="bottom-2 right-2" />
          {/* a small arc of stars above the invitation */}
          <svg viewBox="0 0 120 28" className="mx-auto h-7 w-[120px]" aria-hidden="true">
            <polyline points="10,22 38,10 60,16 82,8 110,20" fill="none" stroke={SILVER} strokeOpacity="0.35" strokeWidth="0.5" />
            {[[10, 22, 1.2], [38, 10, 1.6], [60, 16, 1.2], [82, 8, 1.9], [110, 20, 1.2]].map(([x, y, r]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={SILVER_BRIGHT} fillOpacity="0.9" />
            ))}
            <path d={sparkle(82, 8, 4.5)} stroke={SILVER_BRIGHT} strokeOpacity="0.7" strokeWidth="0.45" />
          </svg>
          <h2 className="lvc-serif mt-6 text-3xl leading-snug text-[#eef2fb] sm:text-4xl">
            Your chart is written in the stars.
            <br />
            Come read it.
          </h2>
          <a href="/sign-up" className="lvc-btn-primary lvc-serif mt-10 px-8 py-4 text-[13px] font-bold uppercase tracking-[0.18em]">
            Get started — it&rsquo;s free
          </a>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer>
        <div className="lvc-rule" />
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="lvc-serif text-[12px] tracking-[0.34em] text-[#f2d675]">ASTRO&nbsp;SCOPE</p>
              <p className="mt-2 text-[12px] text-[#dfe6f2]/45">Astro Scope — your daily cosmic guidance.</p>
            </div>
            <nav className="flex flex-wrap gap-x-7 gap-y-2 text-[11px] uppercase tracking-[0.2em] text-[#dfe6f2]/60">
              <a href="/birth-chart" className="lvc-nav-link">Birth Chart</a>
              <a href="/horoscope" className="lvc-nav-link">Horoscopes</a>
              <a href="/tarot" className="lvc-nav-link">Tarot</a>
              <a href="/pricing" className="lvc-nav-link">Pricing</a>
            </nav>
          </div>
          <p className="mt-8 text-[10px] uppercase tracking-[0.18em] text-[#dfe6f2]/30">&copy; 2026 Astro Scope</p>
        </div>
      </footer>
    </div>
  );
}
