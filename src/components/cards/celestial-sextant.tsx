// CELESTIAL SEXTANT — a full arcana gallery in one engraved-brass style.
// Engraved brass sextant on dark teal-black: the great degree arc (0-120°,
// fine ticks, numerals every 10°), radial frame arms, index arm with vernier
// swung to that card's reading, telescope tube, shade discs on pivots. Above
// the arc the sighted star burns; below it an engraved ivory vignette of the
// arcana's motif (default: The Hermit taking a sighting with his lantern).
// Server-component safe: no hooks, no client directive; both animation tiers
// are CSS-only in the scoped style block. With no props this renders exactly
// the original Hermit (IX) card.

import type { CSSProperties, ReactElement } from "react";

const PIVOT_X = 150;
const PIVOT_Y = 96;
const R_OUT = 190;
const R_IN = 170;
// physical half-sweep of the arc; the scale doubles the angle (sextant
// principle), so 0-120° of scale is engraved across 96° of physical arc
const HALF_SWEEP = 48;

const pt = (r: number, scaleDeg: number) => {
  const a = ((HALF_SWEEP - scaleDeg * 0.8) * Math.PI) / 180;
  return {
    x: Math.round((PIVOT_X + r * Math.sin(a)) * 10) / 10,
    y: Math.round((PIVOT_Y + r * Math.cos(a)) * 10) / 10,
  };
};

const MAJORS = Array.from({ length: 13 }, (_, i) => i * 10);
const MINORS = Array.from({ length: 61 }, (_, i) => i * 2).filter(
  (s) => s % 10 !== 0,
);

const BRASS = "#c39a3b";
const BRASS_HI = "#e8c66a";
const BRASS_DK = "#6d5316";
const ENGRAVE = "#2e230a";
const IVORY = "#eadfc0";
const INK_FILL = "#102a29";
const DARK = "#030809";

const o1 = pt(R_OUT, 0);
const o2 = pt(R_OUT, 120);
const i1 = pt(R_IN, 0);
const i2 = pt(R_IN, 120);
const g1 = pt(180, 0);
const g2 = pt(180, 120);

const BAND_PATH = `M ${o1.x} ${o1.y} A ${R_OUT} ${R_OUT} 0 0 1 ${o2.x} ${o2.y} L ${i2.x} ${i2.y} A ${R_IN} ${R_IN} 0 0 0 ${i1.x} ${i1.y} Z`;
const GLEAM_PATH = `M ${g1.x} ${g1.y} A 180 180 0 0 1 ${g2.x} ${g2.y}`;

const BG_STARS: ReadonlyArray<readonly [number, number, number]> = [
  [52, 66, 1.1],
  [86, 38, 0.8],
  [118, 62, 0.7],
  [196, 30, 0.9],
  [262, 96, 0.8],
  [272, 150, 0.6],
  [30, 130, 0.7],
  [44, 200, 0.6],
  [206, 78, 0.6],
  [96, 100, 0.5],
  [258, 210, 0.5],
  [24, 262, 0.5],
];

const NUMERALS: Record<number, string> = {
  1: "I",
  3: "III",
  7: "VII",
  9: "IX",
  10: "X",
  13: "XIII",
  17: "XVII",
  22: "XXII",
};

/* ------------------------------------------------------------------ */
/* Engraved ivory vignettes below the arc, one per arcana.             */
/* ------------------------------------------------------------------ */

// I — The Magician: robed figure behind the table of tools, wand raised,
// lemniscate above the head
function MagicianFigure() {
  return (
    <g>
      <ellipse cx="150" cy="372" rx="27" ry="3.5" fill="#000000" opacity="0.35" />
      {/* raised arm + wand with spark */}
      <path d="M 158 330 Q 166 322 171 314" fill="none" stroke={IVORY} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="171" y1="314" x2="176" y2="304" stroke={BRASS_HI} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M 176 299.5 L 177.4 303 L 176 306.5 L 174.6 303 Z" fill="#fff3cf" />
      {/* lemniscate above the head */}
      <circle cx="147" cy="308" r="2.8" fill="none" stroke={BRASS_HI} strokeWidth="0.9" />
      <circle cx="153" cy="308" r="2.8" fill="none" stroke={BRASS_HI} strokeWidth="0.9" />
      {/* robed figure behind the table */}
      <path d="M 140 332 Q 136 342 136 352 L 164 352 Q 164 342 160 332" fill={INK_FILL} stroke={IVORY} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M 140 334 Q 139 318 150 315 Q 161 318 160 334" fill={INK_FILL} stroke={IVORY} strokeWidth="1.2" />
      <ellipse cx="150" cy="326" rx="4.6" ry="5.6" fill={DARK} />
      {/* table with the four tools */}
      <line x1="126" y1="352" x2="174" y2="352" stroke={IVORY} strokeWidth="1.6" />
      <line x1="131" y1="352" x2="131" y2="370" stroke={IVORY} strokeWidth="1.1" />
      <line x1="169" y1="352" x2="169" y2="370" stroke={IVORY} strokeWidth="1.1" />
      <path d="M 134 344 L 139 344 L 138 348 L 135 348 Z" fill={BRASS} stroke={ENGRAVE} strokeWidth="0.5" />
      <line x1="136.5" y1="348" x2="136.5" y2="351" stroke={BRASS} strokeWidth="1" />
      <line x1="145" y1="350" x2="153" y2="344" stroke={IVORY} strokeWidth="0.9" />
      <line x1="146.5" y1="346.5" x2="149" y2="349" stroke={IVORY} strokeWidth="0.9" />
      <circle cx="160" cy="347.5" r="2.6" fill="none" stroke={BRASS} strokeWidth="0.9" />
      <circle cx="160" cy="347.5" r="0.6" fill={BRASS} />
      <line x1="166" y1="350" x2="171" y2="345" stroke={BRASS_HI} strokeWidth="1" strokeLinecap="round" />
    </g>
  );
}

// III — The Empress: crowned figure with wheat stalks
function EmpressFigure() {
  return (
    <g>
      <ellipse cx="150" cy="372" rx="27" ry="3.5" fill="#000000" opacity="0.35" />
      {/* wheat stalks */}
      <g stroke={BRASS_HI} strokeWidth="0.8" fill="none" strokeLinecap="round">
        <path d="M 172 368 Q 175 350 171 334" />
        <path d="M 179 368 Q 183 354 181 342" />
        <path d="M 171 338 l -2.6 -1.6 M 171 342 l 2.6 -1.6 M 171 346 l -2.6 -1.6 M 172 350 l 2.6 -1.6" />
        <path d="M 181 346 l -2.4 -1.5 M 181 350 l 2.4 -1.5 M 180 354 l -2.4 -1.5" />
      </g>
      {/* bell robe */}
      <path d="M 139 338 Q 133 352 134 370 L 166 370 Q 167 352 161 338" fill={INK_FILL} stroke={IVORY} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M 144 344 Q 143 356 143 368 M 150 346 Q 150 358 150 368" fill="none" stroke={BRASS} strokeWidth="0.6" opacity="0.5" />
      {/* head + crown */}
      <circle cx="150" cy="329" r="5.6" fill={INK_FILL} stroke={IVORY} strokeWidth="1.1" />
      <path d="M 144.5 325 L 145.5 318 L 148 322.5 L 150 317 L 152 322.5 L 154.5 318 L 155.5 325 Z" fill={BRASS} stroke={ENGRAVE} strokeWidth="0.6" strokeLinejoin="round" />
      <circle cx="150" cy="338" r="1" fill={BRASS_HI} />
    </g>
  );
}

// VII — The Chariot: canopied chariot flanked by two sphinxes
function ChariotFigure() {
  return (
    <g>
      <ellipse cx="150" cy="372" rx="32" ry="3.5" fill="#000000" opacity="0.35" />
      {/* sphinxes, mirrored */}
      <g fill={INK_FILL} stroke={IVORY} strokeWidth="0.9" strokeLinejoin="round">
        <path d="M 112 366 Q 112 357 121 357 L 128 357 Q 131 361 130 366 Z" />
        <circle cx="125" cy="351" r="3" />
        <path d="M 188 366 Q 188 357 179 357 L 172 357 Q 169 361 170 366 Z" />
        <circle cx="175" cy="351" r="3" />
      </g>
      <g stroke={IVORY} strokeWidth="0.7">
        <line x1="115" y1="366" x2="115" y2="369" />
        <line x1="127" y1="366" x2="127" y2="369" />
        <line x1="185" y1="366" x2="185" y2="369" />
        <line x1="173" y1="366" x2="173" y2="369" />
      </g>
      {/* chariot cart + wheel */}
      <path d="M 138 342 L 162 342 L 160 355 L 140 355 Z" fill={INK_FILL} stroke={IVORY} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M 136 342 Q 150 328 164 342" fill="none" stroke={IVORY} strokeWidth="1.1" />
      <path d="M 150 331.5 L 151.6 335 L 150 338.5 L 148.4 335 Z" fill={BRASS_HI} />
      <circle cx="150" cy="362" r="7" fill="none" stroke={IVORY} strokeWidth="1.2" />
      <g stroke={IVORY} strokeWidth="0.7">
        <line x1="150" y1="355" x2="150" y2="369" />
        <line x1="143" y1="362" x2="157" y2="362" />
        <line x1="145" y1="357" x2="155" y2="367" />
        <line x1="155" y1="357" x2="145" y2="367" />
      </g>
      <circle cx="150" cy="362" r="1.6" fill={BRASS} stroke={ENGRAVE} strokeWidth="0.5" />
    </g>
  );
}

// IX — The Hermit: lantern raised to the star, staff in hand (original)
function HermitFigure() {
  return (
    <g>
      <ellipse cx="151" cy="373" rx="26" ry="3.5" fill="#000000" opacity="0.35" />
      {/* staff */}
      <line x1="129" y1="316" x2="135" y2="371" stroke={BRASS_DK} strokeWidth="2" strokeLinecap="round" />
      {/* hooded robe */}
      <path
        d="M 140 332 Q 135 350 137 370 L 165 370 Q 167 350 162 332"
        fill={INK_FILL}
        stroke={IVORY}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M 140 334 Q 139 318 151 315 Q 163 318 162 334" fill={INK_FILL} stroke={IVORY} strokeWidth="1.2" />
      <ellipse cx="151" cy="326" rx="4.6" ry="5.6" fill={DARK} />
      {/* robe fold engraving */}
      <path d="M 144 340 Q 143 354 144 368 M 150 342 Q 150 356 150 368" fill="none" stroke={BRASS} strokeWidth="0.6" opacity="0.5" />
      {/* raised arm + gold lantern */}
      <path d="M 161 338 Q 168 330 172 322" fill="none" stroke={IVORY} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="175" cy="312" r="11" fill="url(#cz-sext-lamp)" />
      <line x1="175" y1="306" x2="175" y2="309" stroke={BRASS_DK} strokeWidth="0.9" />
      <path d="M 170 309 L 180 309 L 178.5 320 L 171.5 320 Z" fill={BRASS} stroke={ENGRAVE} strokeWidth="0.8" strokeLinejoin="round" />
      <path d="M 175 311.5 L 176.4 314.5 L 175 317.5 L 173.6 314.5 Z" fill="#fff6d8" />
    </g>
  );
}

// X — Wheel of Fortune: spoked wheel with ascending/descending creatures
function WheelFigure() {
  return (
    <g>
      <ellipse cx="150" cy="372" rx="27" ry="3.5" fill="#000000" opacity="0.35" />
      <g fill="none" stroke={IVORY}>
        <circle cx="150" cy="340" r="26" strokeWidth="1.4" />
        <circle cx="150" cy="340" r="19" strokeWidth="0.8" />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4;
          return (
            <line
              key={i}
              x1={150 + 19 * Math.sin(a)}
              y1={340 - 19 * Math.cos(a)}
              x2={150 + 26 * Math.sin(a)}
              y2={340 - 26 * Math.cos(a)}
              strokeWidth="0.8"
            />
          );
        })}
      </g>
      <circle cx="150" cy="340" r="3" fill={BRASS} stroke={ENGRAVE} strokeWidth="0.6" />
      {/* creatures on the rim: crowned top, ascending, descending */}
      <circle cx="150" cy="314" r="1.8" fill={BRASS_HI} />
      <circle cx="128.5" cy="327.5" r="1.5" fill={BRASS} />
      <circle cx="171.5" cy="352.5" r="1.5" fill={IVORY} opacity="0.8" />
    </g>
  );
}

// XIII — Death: skeletal rider on horseback carrying the rose banner
function DeathFigure() {
  return (
    <g>
      <ellipse cx="150" cy="372" rx="31" ry="3.5" fill="#000000" opacity="0.35" />
      {/* horse */}
      <path d="M 126 352 Q 128 343 141 343 L 157 343 Q 166 345 165 352 L 162 357 L 130 357 Z" fill={INK_FILL} stroke={IVORY} strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M 160 346 L 171 330 L 177 333 L 166 350 Z" fill={INK_FILL} stroke={IVORY} strokeWidth="1" strokeLinejoin="round" />
      <g stroke={IVORY} strokeWidth="1">
        <line x1="133" y1="357" x2="131" y2="369" />
        <line x1="141" y1="357" x2="141" y2="369" />
        <line x1="155" y1="357" x2="155" y2="369" />
        <line x1="162" y1="357" x2="164" y2="369" />
      </g>
      <path d="M 126 352 Q 121 354 120 360" fill="none" stroke={IVORY} strokeWidth="0.8" />
      {/* skeletal rider */}
      <line x1="145" y1="344" x2="147" y2="327" stroke={IVORY} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="148" cy="322" r="3.4" fill={IVORY} />
      <circle cx="149.5" cy="321.5" r="0.8" fill={DARK} />
      <line x1="147" y1="331" x2="158" y2="325" stroke={IVORY} strokeWidth="1" strokeLinecap="round" />
      {/* rose banner */}
      <line x1="160" y1="312" x2="160" y2="350" stroke={BRASS_DK} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M 160 313 L 179 316 L 179 327 L 160 324 Z" fill="#0d2624" stroke={IVORY} strokeWidth="0.9" strokeLinejoin="round" />
      <circle cx="169.5" cy="320" r="2.2" fill="none" stroke={BRASS_HI} strokeWidth="0.8" />
      <circle cx="169.5" cy="320" r="0.6" fill={BRASS_HI} />
    </g>
  );
}

// XVII — The Star: kneeling figure pouring from two jugs
function StarFigure() {
  return (
    <g>
      <ellipse cx="148" cy="372" rx="27" ry="3.5" fill="#000000" opacity="0.35" />
      {/* kneeling figure */}
      <path
        d="M 140 352 Q 136 360 138 368 L 146 368 L 148 360 L 156 366 L 160 363 L 152 355 Q 155 347 148 343 Q 141 345 140 352 Z"
        fill={INK_FILL}
        stroke={IVORY}
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <circle cx="146" cy="338" r="4" fill={INK_FILL} stroke={IVORY} strokeWidth="1" />
      {/* left jug + water onto the ground */}
      <line x1="141" y1="350" x2="130" y2="354" stroke={IVORY} strokeWidth="1" strokeLinecap="round" />
      <path d="M 123 350 L 131 350 L 130 359 L 124 359 Z" fill={BRASS} stroke={ENGRAVE} strokeWidth="0.5" strokeLinejoin="round" />
      <path d="M 125 359 q -3 4 -2 9 M 128 359 q -1 4 -0.5 9" fill="none" stroke={IVORY} strokeWidth="0.6" opacity="0.7" />
      {/* right jug, tilted, pouring in an arc */}
      <line x1="151" y1="348" x2="162" y2="344" stroke={IVORY} strokeWidth="1" strokeLinecap="round" />
      <g transform="rotate(28 166 342)">
        <path d="M 162 338 L 170 338 L 169 347 L 163 347 Z" fill={BRASS} stroke={ENGRAVE} strokeWidth="0.5" strokeLinejoin="round" />
      </g>
      <path d="M 170 346 q 5 5 3 12 M 172.5 344 q 6 6 4 14" fill="none" stroke={IVORY} strokeWidth="0.6" opacity="0.7" />
    </g>
  );
}

// XXII — The Fool: stepping off the cliff edge, bindle over shoulder, dog at heel
function FoolFigure() {
  return (
    <g>
      <ellipse cx="148" cy="372" rx="28" ry="3.5" fill="#000000" opacity="0.35" />
      {/* cliff edge with engraved face */}
      <path d="M 110 368 L 170 368" fill="none" stroke={IVORY} strokeWidth="1.2" />
      <path d="M 170 368 L 173 372 L 170 376 M 158 368 l -2.5 4 M 164 368 l -2.5 4 M 146 368 l -2.5 4" fill="none" stroke={IVORY} strokeWidth="0.7" opacity="0.7" />
      {/* staff over shoulder + bindle */}
      <line x1="144" y1="333" x2="157" y2="348" stroke={BRASS_DK} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="142.5" cy="331" r="2.6" fill={BRASS} stroke={ENGRAVE} strokeWidth="0.6" />
      {/* stepping figure */}
      <path d="M 145 341 Q 142 350 144 360 L 149 362 L 154 360 Q 156 350 153 341 Z" fill={INK_FILL} stroke={IVORY} strokeWidth="1.1" strokeLinejoin="round" />
      <circle cx="149.5" cy="336" r="3.6" fill={INK_FILL} stroke={IVORY} strokeWidth="1" />
      <line x1="147" y1="362" x2="144" y2="368" stroke={IVORY} strokeWidth="1" strokeLinecap="round" />
      <line x1="152" y1="362" x2="157" y2="367" stroke={IVORY} strokeWidth="1" strokeLinecap="round" />
      {/* little dog at the edge */}
      <path d="M 163 364 Q 163 359 169 359 L 174 359 Q 177 361 176 364 Z" fill={INK_FILL} stroke={IVORY} strokeWidth="0.9" strokeLinejoin="round" />
      <circle cx="176.5" cy="357" r="2" fill={INK_FILL} stroke={IVORY} strokeWidth="0.9" />
      <path d="M 163 360 L 160 355" fill="none" stroke={IVORY} strokeWidth="0.8" strokeLinecap="round" />
      <line x1="167" y1="364" x2="167" y2="368" stroke={IVORY} strokeWidth="0.7" />
      <line x1="173" y1="364" x2="173" y2="368" stroke={IVORY} strokeWidth="0.7" />
    </g>
  );
}

const SCENES: Record<number, { reading: number; Figure: () => ReactElement }> = {
  1: { reading: 30, Figure: MagicianFigure },
  3: { reading: 55, Figure: EmpressFigure },
  7: { reading: 64.5, Figure: ChariotFigure },
  9: { reading: 42.5, Figure: HermitFigure },
  10: { reading: 90, Figure: WheelFigure },
  13: { reading: 13, Figure: DeathFigure },
  17: { reading: 71.25, Figure: StarFigure },
  22: { reading: 7.5, Figure: FoolFigure },
};

interface CelestialSextantCardProps {
  number?: number;
  name?: string;
  variant?: number;
}

export default function CelestialSextantHermitCard({
  number = 9,
  name = "THE HERMIT",
  variant = 0,
}: CelestialSextantCardProps) {
  const scene = SCENES[number] ?? SCENES[9];
  const v = ((Math.round(variant) % 8) + 8) % 8;
  const reading = scene.reading + v * 0.75;
  // load sweep always starts at the 0° end of the scale (or as close as a
  // full sweep allows) and settles on this card's reading
  const sweepFrom = 0.8 * (Math.max(reading - 42.5, 0) - reading);
  const starDx = (v % 4) * 2;
  const starDy = Math.floor(v / 4) * 2.5;
  const numeral = NUMERALS[number] ?? String(number);
  const titleSize = name.length <= 12 ? 17 : Math.max(11, Math.floor((17 * 12) / name.length));
  const titleSpacing = name.length <= 12 ? 5 : 2.5;
  const armTip = pt(R_IN + 1, reading);
  const armInner = pt(R_IN - 4, reading);
  const tailEnd = pt(-28, reading);
  const tailKnob = pt(-30, reading);
  const vernier = Array.from({ length: 13 }, (_, i) => reading - 7.5 + i * 1.25);
  const { Figure } = scene;

  return (
    <figure
      className="cz-sext-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
    >
      <style>{`
        .cz-sext-card { position: relative; overflow: hidden; }
        .cz-sext-card svg { display: block; width: 100%; height: 100%; }

        .cz-sext-frame-load  { animation: cz-sext-fade .9s ease-out backwards; }
        .cz-sext-scale-load  { animation: cz-sext-fade 1s ease-out .35s backwards; }
        .cz-sext-hermit-load { animation: cz-sext-rise 1s ease-out .9s backwards; }
        .cz-sext-arm {
          transform-box: view-box;
          transform-origin: 150px 96px;
          animation: cz-sext-sweep 1.25s cubic-bezier(.23,.9,.3,1) .55s backwards;
        }
        .cz-sext-star-load {
          transform-box: fill-box;
          transform-origin: center;
          animation: cz-sext-flash 1s ease-out 1.35s backwards;
        }
        .cz-sext-twinkle {
          transform-box: fill-box;
          transform-origin: center;
          animation: cz-sext-twinkle 16s ease-in-out infinite alternate;
        }
        .cz-sext-gleam { animation: cz-sext-gleam 25s linear infinite; }

        @keyframes cz-sext-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cz-sext-rise {
          from { opacity: 0; transform: translateY(7px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cz-sext-sweep {
          from { opacity: .35; transform: rotate(var(--cz-sext-from, -34deg)); }
          to   { opacity: 1;   transform: rotate(0deg); }
        }
        @keyframes cz-sext-flash {
          0%   { opacity: 0; transform: scale(.6); }
          45%  { opacity: 1; transform: scale(1.28); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes cz-sext-twinkle {
          from { opacity: .72; transform: scale(.96); }
          to   { opacity: 1;   transform: scale(1.05); }
        }
        @keyframes cz-sext-gleam {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -100; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cz-sext-frame-load,
          .cz-sext-scale-load,
          .cz-sext-hermit-load,
          .cz-sext-arm,
          .cz-sext-star-load,
          .cz-sext-twinkle,
          .cz-sext-gleam {
            animation: none;
          }
        }
      `}</style>

      <svg
        viewBox="0 0 300 450"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={`${name}, tarot card ${numeral}, drawn as an engraved brass sextant reading a star`}
      >
        <defs>
          <linearGradient id="cz-sext-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0c1d20" />
            <stop offset="55%" stopColor="#081416" />
            <stop offset="100%" stopColor="#040a0c" />
          </linearGradient>
          <linearGradient id="cz-sext-brass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e2bd5e" />
            <stop offset="45%" stopColor="#b98f2e" />
            <stop offset="100%" stopColor="#7d601a" />
          </linearGradient>
          <radialGradient id="cz-sext-hub" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#f0d17e" />
            <stop offset="60%" stopColor="#b98f2e" />
            <stop offset="100%" stopColor="#6d5316" />
          </radialGradient>
          <radialGradient id="cz-sext-starglow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff3cf" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#e8c66a" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#e8c66a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cz-sext-lamp" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe9a8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#e8c66a" stopOpacity="0" />
          </radialGradient>
          {/* engraving crosshatch for the brass band */}
          <pattern id="cz-sext-hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="4" stroke={ENGRAVE} strokeWidth="0.55" opacity="0.4" />
          </pattern>
        </defs>

        {/* dark teal-black ground + faint field stars */}
        <rect x="0" y="0" width="300" height="450" fill="url(#cz-sext-bg)" />
        <g fill="#cfe4dd">
          {BG_STARS.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} opacity={0.28 + (i % 3) * 0.12} />
          ))}
        </g>

        {/* metallic frame with rivet corners */}
        <g className="cz-sext-frame-load">
          <rect x="8" y="8" width="284" height="434" fill="none" stroke={BRASS} strokeWidth="1.3" opacity="0.9" />
          <rect x="13" y="13" width="274" height="424" fill="none" stroke={BRASS} strokeWidth="0.5" opacity="0.45" />
          {[
            [12, 12],
            [288, 12],
            [12, 438],
            [288, 438],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <circle cx={x} cy={y} r="3.1" fill="url(#cz-sext-hub)" stroke={ENGRAVE} strokeWidth="0.6" />
              <circle cx={x} cy={y} r="0.9" fill={ENGRAVE} />
            </g>
          ))}
        </g>

        {/* engraved numeral plaque, screwed to the plate */}
        <g className="cz-sext-frame-load">
          <rect x="30" y="28" width="54" height="30" rx="2" fill="url(#cz-sext-brass)" stroke={ENGRAVE} strokeWidth="1" />
          <rect x="33.5" y="31.5" width="47" height="23" rx="1" fill="none" stroke={ENGRAVE} strokeWidth="0.5" opacity="0.7" />
          <circle cx="36" cy="34" r="1.2" fill={ENGRAVE} />
          <circle cx="78" cy="34" r="1.2" fill={ENGRAVE} />
          <circle cx="36" cy="52" r="1.2" fill={ENGRAVE} />
          <circle cx="78" cy="52" r="1.2" fill={ENGRAVE} />
          <text
            x="57"
            y="49"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="700"
            fontSize={numeral.length > 3 ? 12 : 15}
            fill={ENGRAVE}
          >
            {numeral}
          </text>
        </g>

        {/* the sighted star + its sight line down to the index mirror */}
        <line x1={228 + starDx} y1={61 + starDy} x2="164" y2="104" stroke={IVORY} strokeWidth="0.6" strokeDasharray="2 4" opacity="0.25" />
        <g transform={`translate(${starDx} ${starDy})`}>
          <g className="cz-sext-star-load">
            <g className="cz-sext-twinkle">
              <circle cx="236" cy="54" r="17" fill="url(#cz-sext-starglow)" />
              <path
                d="M 236 39 L 239.2 50.8 L 251 54 L 239.2 57.2 L 236 69 L 232.8 57.2 L 221 54 L 232.8 50.8 Z"
                fill="#fff3cf"
                stroke={BRASS_HI}
                strokeWidth="0.5"
              />
              <circle cx="236" cy="54" r="2" fill="#ffffff" />
            </g>
          </g>
        </g>

        {/* sextant body */}
        <g className="cz-sext-frame-load">
          {/* radial frame arms */}
          {[0, 60, 120].map((s) => {
            const e = pt(R_IN - 2, s);
            return (
              <g key={s}>
                <line x1={PIVOT_X} y1={PIVOT_Y} x2={e.x} y2={e.y} stroke={BRASS} strokeWidth="5" opacity="0.95" />
                <line x1={PIVOT_X} y1={PIVOT_Y} x2={e.x} y2={e.y} stroke={ENGRAVE} strokeWidth="1" opacity="0.55" />
              </g>
            );
          })}

          {/* the great arc: brass band + engraving hatch */}
          <path d={BAND_PATH} fill="url(#cz-sext-brass)" stroke={ENGRAVE} strokeWidth="1.1" />
          <path d={BAND_PATH} fill="url(#cz-sext-hatch)" opacity="0.5" />
          {[172.5, 187.5].map((r) => {
            const p1 = pt(r, 0);
            const p2 = pt(r, 120);
            return (
              <path
                key={r}
                d={`M ${p1.x} ${p1.y} A ${r} ${r} 0 0 1 ${p2.x} ${p2.y}`}
                fill="none"
                stroke={ENGRAVE}
                strokeWidth="0.6"
                opacity="0.6"
              />
            );
          })}

          {/* frame screws on the band */}
          {[0, 60, 120].map((s) => {
            const c = pt(180, s);
            return (
              <g key={s}>
                <circle cx={c.x} cy={c.y} r="2.5" fill={BRASS_HI} stroke={ENGRAVE} strokeWidth="0.7" />
                <line x1={c.x - 1.4} y1={c.y - 1.4} x2={c.x + 1.4} y2={c.y + 1.4} stroke={ENGRAVE} strokeWidth="0.6" />
              </g>
            );
          })}

          {/* telescope tube on its mount */}
          <line x1="114" y1="144" x2="110" y2="158" stroke={BRASS} strokeWidth="3" />
          <rect x="88" y="136" width="50" height="8.5" rx="2" fill="url(#cz-sext-brass)" stroke={ENGRAVE} strokeWidth="0.8" />
          <rect x="134" y="133.5" width="8" height="13.5" rx="1.5" fill="url(#cz-sext-brass)" stroke={ENGRAVE} strokeWidth="0.8" />
          <rect x="82" y="138" width="7" height="4.5" rx="1" fill={BRASS_DK} stroke={ENGRAVE} strokeWidth="0.7" />
          <line x1="96" y1="136" x2="96" y2="144.5" stroke={ENGRAVE} strokeWidth="0.6" opacity="0.6" />
          <line x1="126" y1="136" x2="126" y2="144.5" stroke={ENGRAVE} strokeWidth="0.6" opacity="0.6" />

          {/* shade discs on pivots below the mirror */}
          <g stroke={ENGRAVE} strokeWidth="0.7">
            <circle cx="124" cy="114" r="5.5" fill="#10302e" />
            <circle cx="113" cy="122" r="4.5" fill="#0d2624" />
            <circle cx="104" cy="129" r="3.8" fill="#0a1d1c" />
          </g>
          <g fill={BRASS_HI}>
            <circle cx="124" cy="114" r="1" />
            <circle cx="113" cy="122" r="0.9" />
            <circle cx="104" cy="129" r="0.8" />
          </g>
        </g>

        {/* engraved degree scale: ticks + numerals every 10° */}
        <g className="cz-sext-scale-load">
          {MINORS.map((s) => {
            const a = pt(R_OUT - 1, s);
            const b = pt(R_OUT - 6.5, s);
            return <line key={s} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={ENGRAVE} strokeWidth="0.55" />;
          })}
          {MAJORS.map((s) => {
            const a = pt(R_OUT - 1, s);
            const b = pt(R_OUT - 11, s);
            const n = pt(R_IN - 12, s);
            return (
              <g key={s}>
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={ENGRAVE} strokeWidth="1" />
                <text
                  x={n.x}
                  y={n.y + 2.2}
                  textAnchor="middle"
                  fontFamily="Georgia, 'Times New Roman', serif"
                  fontSize="7"
                  fill={IVORY}
                  opacity="0.92"
                >
                  {s}
                </text>
              </g>
            );
          })}
        </g>

        {/* travelling gleam along the brass arc */}
        <path
          className="cz-sext-gleam"
          d={GLEAM_PATH}
          fill="none"
          stroke="#ffe9a8"
          strokeWidth="4"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="7 93"
          opacity="0.45"
        />

        {/* index arm with vernier, swung to this card's reading */}
        <g
          className="cz-sext-arm"
          style={{ "--cz-sext-from": `${sweepFrom}deg` } as CSSProperties}
        >
          {vernier.map((s, i) => {
            const a = pt(R_IN - 16, s);
            const b = pt(R_IN - (i % 4 === 0 ? 7 : 9.5), s);
            return <line key={s} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={BRASS_HI} strokeWidth="0.6" opacity="0.9" />;
          })}
          <line
            x1={PIVOT_X}
            y1={PIVOT_Y}
            x2={armTip.x}
            y2={armTip.y}
            stroke="url(#cz-sext-brass)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <line
            x1={PIVOT_X}
            y1={PIVOT_Y}
            x2={armInner.x}
            y2={armInner.y}
            stroke={ENGRAVE}
            strokeWidth="1"
            opacity="0.6"
          />
          {/* counterweight tail */}
          <line x1={PIVOT_X} y1={PIVOT_Y} x2={tailEnd.x} y2={tailEnd.y} stroke={BRASS} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx={tailKnob.x} cy={tailKnob.y} r="3.5" fill="url(#cz-sext-hub)" stroke={ENGRAVE} strokeWidth="0.7" />
          {/* index mirror hub */}
          <circle cx={PIVOT_X} cy={PIVOT_Y} r="7.5" fill="url(#cz-sext-hub)" stroke={ENGRAVE} strokeWidth="1" />
          <circle cx={PIVOT_X} cy={PIVOT_Y} r="1.7" fill={ENGRAVE} />
        </g>

        {/* the arcana vignette below the instrument */}
        <g className="cz-sext-hermit-load">
          <Figure />
        </g>

        {/* title plate */}
        <g>
          <line x1="58" y1="392" x2="126" y2="392" stroke={BRASS} strokeWidth="0.8" opacity="0.8" />
          <line x1="174" y1="392" x2="242" y2="392" stroke={BRASS} strokeWidth="0.8" opacity="0.8" />
          <path d="M 150 387 L 153.5 392 L 150 397 L 146.5 392 Z" fill={BRASS} />
          <text
            x="150"
            y="417"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="700"
            fontSize={titleSize}
            letterSpacing={titleSpacing}
            fill={IVORY}
          >
            {name}
          </text>
          <text
            x="150"
            y="432"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fontSize="8.5"
            letterSpacing="2.5"
            fill={BRASS}
            opacity="0.95"
          >
            sextans · astronomicus
          </text>
        </g>
      </svg>
    </figure>
  );
}
