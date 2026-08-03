/**
 * Card Lab — BAUHAUS
 * Geometric tarot card in 1920s Bauhaus abstraction: pure circle,
 * semicircle, triangle, rectangles, bars — flat unmodulated fills,
 * asymmetric diagonal composition, no gradients, no shadows, no ornament.
 * Defaults render The Hermit (IX); props allow any number/name/variant.
 *
 * Signature effects (CSS-only, server-component safe):
 * 1. One-shot mount assembly — shapes fly in from different edges.
 * 2. Always-on permutation — each shape oscillates a few px on its own
 *    staggered 5-9s loop.
 * 3. Color re-solve — every 8s the three primaries rotate between the big
 *    shapes in hard steps() swaps via CSS `fill`.
 * 4. The little star square spins slowly, forever.
 * 5. Hover — shapes drift apart along the diagonal; card tilts ~1.5deg.
 *
 * Layering: wrapper <g class="cl-bauhaus-g-*"> carries the one-shot
 * assembly + hover transforms; the shape itself (cl-bauhaus-s-*) carries
 * the infinite drift/spin/fill loops, so the two never compete for the
 * same animated property on the same element. Every rule and keyframe is
 * scoped per-variant (cl-bauhaus-v0..v7) so a gallery of variants on one
 * page never shares colliding CSS.
 */

import { toRoman } from "@/lib/roman";

const RED = "#e30613";
const YELLOW = "#f6c90e";
const BLUE = "#1e50a2";
const BLACK = "#111111";
const PAPER = "#f2ede0";

type Triple = [string, string, string];

type Palette = {
  bg: string; // card paper
  ink: string; // structural dark: dome, hood, staff, frame, numeral
  onInk: string; // title text sitting on the ink dome
  star: string; // star accent — must read on red, yellow and blue
  cycle: { circle: Triple; triangle: Triple; robe: Triple };
};

const PALETTES: Palette[] = [
  // 0 — classic: red mountain, yellow light, blue robe on off-white
  {
    bg: PAPER,
    ink: BLACK,
    onInk: PAPER,
    star: BLACK,
    cycle: {
      circle: [YELLOW, RED, BLUE],
      triangle: [RED, BLUE, YELLOW],
      robe: [BLUE, YELLOW, RED],
    },
  },
  // 1 — primaries rotated: blue mountain, red light, yellow robe
  {
    bg: PAPER,
    ink: BLACK,
    onInk: PAPER,
    star: BLACK,
    cycle: {
      circle: [RED, BLUE, YELLOW],
      triangle: [BLUE, YELLOW, RED],
      robe: [YELLOW, RED, BLUE],
    },
  },
  // 2 — primaries rotated again: yellow mountain, blue light, red robe
  {
    bg: PAPER,
    ink: BLACK,
    onInk: PAPER,
    star: BLACK,
    cycle: {
      circle: [BLUE, YELLOW, RED],
      triangle: [YELLOW, RED, BLUE],
      robe: [RED, BLUE, YELLOW],
    },
  },
  // 3 — inverted paper: black ground, off-white structure, classic cycle
  {
    bg: BLACK,
    ink: PAPER,
    onInk: BLACK,
    star: BLACK,
    cycle: {
      circle: [YELLOW, RED, BLUE],
      triangle: [RED, BLUE, YELLOW],
      robe: [BLUE, YELLOW, RED],
    },
  },
];

export interface BauhausCardProps {
  number?: number;
  name?: string;
  variant?: number;
}

/** All CSS for one variant, scoped under .cl-bauhaus-v{n} so variants can
    share a page; keyframe names get the same suffix for the same reason. */
function buildStyle(v: number, p: Palette): string {
  const S = `.cl-bauhaus-v${v}`;
  const K = `cl-bauhaus-v${v}`;
  const [c0, c1, c2] = p.cycle.circle;
  const [t0, t1, t2] = p.cycle.triangle;
  const [r0, r1, r2] = p.cycle.robe;
  return `
        ${S} { display: block; line-height: 0; transition: transform 0.45s ease; }
        ${S} svg { display: block; width: 100%; height: 100%; }
        ${S} .cl-bauhaus-title {
          font-family: "Futura", "Century Gothic", "Avenir Next", Arial, Helvetica, sans-serif;
          font-weight: 900;
        }
        ${S}:hover { transform: rotate(1.5deg); }

        /* hover deconstruction: groups drift along the diagonal */
        ${S} svg * { transition: transform 0.5s ease; }
        ${S}:hover .cl-bauhaus-g-triangle { transform: translate(-5px, 4px); }
        ${S}:hover .cl-bauhaus-g-ground   { transform: translate(-4px, 2px); }
        ${S}:hover .cl-bauhaus-g-sun      { transform: translate(6px, -6px); }
        ${S}:hover .cl-bauhaus-g-star     { transform: translate(9px, -9px); }
        ${S}:hover .cl-bauhaus-g-robe     { transform: translate(2px, -2px); }
        ${S}:hover .cl-bauhaus-g-head     { transform: translate(4px, -5px); }
        ${S}:hover .cl-bauhaus-g-staff    { transform: translate(5px, 1px); }
        ${S}:hover .cl-bauhaus-g-arm      { transform: translate(5px, -4px); }

        /* one-shot assembly on mount; keyframes define only the "from"
           state so hover transitions take over cleanly afterwards */
        @keyframes ${K}-in-bottom { from { transform: translate(0, 90px); opacity: 0; } }
        @keyframes ${K}-in-left   { from { transform: translate(-110px, 0); opacity: 0; } }
        @keyframes ${K}-in-right  { from { transform: translate(110px, 0); opacity: 0; } }
        @keyframes ${K}-in-top    { from { transform: translate(0, -70px); opacity: 0; } }
        @keyframes ${K}-in-tr     { from { transform: translate(80px, -80px); opacity: 0; } }
        @keyframes ${K}-in-arm    { from { transform: translate(-60px, 30px); opacity: 0; } }
        @keyframes ${K}-in-pop    { from { transform: scale(0); opacity: 0; } }
        @keyframes ${K}-in-fade   { from { opacity: 0; } }

        ${S} .cl-bauhaus-g-triangle { animation: ${K}-in-bottom 0.6s ease-out 0s backwards; }
        ${S} .cl-bauhaus-g-ground   { animation: ${K}-in-left   0.6s ease-out 0.1s backwards; }
        ${S} .cl-bauhaus-g-sun      { animation: ${K}-in-tr     0.55s ease-out 0.25s backwards; }
        ${S} .cl-bauhaus-g-robe     { animation: ${K}-in-bottom 0.5s ease-out 0.4s backwards; }
        ${S} .cl-bauhaus-g-head     { animation: ${K}-in-top    0.5s ease-out 0.5s backwards; }
        ${S} .cl-bauhaus-g-staff    { animation: ${K}-in-right  0.5s ease-out 0.6s backwards; }
        ${S} .cl-bauhaus-g-arm      { animation: ${K}-in-arm    0.5s ease-out 0.65s backwards; }
        ${S} .cl-bauhaus-g-star     {
          transform-origin: 152px 66px;
          animation: ${K}-in-pop 0.45s ease-out 0.7s backwards;
        }
        ${S} .cl-bauhaus-s-numeral  { animation: ${K}-in-fade 0.6s ease-out 0.9s backwards; }
        ${S} .cl-bauhaus-s-caption  { animation: ${K}-in-fade 0.6s ease-out 1.05s backwards; }

        /* always-on permutation: gentle drift loops (on the shapes) */
        @keyframes ${K}-drift-a { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(3px, -3px); } }
        @keyframes ${K}-drift-b { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-3px, 2px); } }
        @keyframes ${K}-drift-c { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(4px, -4px); } }
        @keyframes ${K}-drift-d { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-2px, 3px); } }
        @keyframes ${K}-drift-e { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(2px, -3px); } }
        @keyframes ${K}-drift-f { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(3px, 1px); } }
        @keyframes ${K}-drift-arm {
          0%, 100% { transform: translate(0, 0) rotate(-24deg); }
          50%      { transform: translate(2px, -2px) rotate(-24deg); }
        }

        ${S} .cl-bauhaus-s-ground { animation: ${K}-drift-b 7.5s ease-in-out -4s infinite; }
        ${S} .cl-bauhaus-s-head   { animation: ${K}-drift-e 6s ease-in-out -2.5s infinite; }
        ${S} .cl-bauhaus-s-staff  { animation: ${K}-drift-f 9s ease-in-out -5s infinite; }
        ${S} .cl-bauhaus-s-arm    {
          transform: rotate(-24deg);
          transform-origin: 103px 96px;
          animation: ${K}-drift-arm 7s ease-in-out -1.5s infinite;
        }

        /* color re-solve: primaries rotate every 8s (hard steps swaps);
           fill lives in its own animation so it never fights the drift */
        @keyframes ${K}-cycle-circle {
          0% { fill: ${c0}; } 33.33% { fill: ${c1}; }
          66.66% { fill: ${c2}; } 100% { fill: ${c0}; }
        }
        @keyframes ${K}-cycle-triangle {
          0% { fill: ${t0}; } 33.33% { fill: ${t1}; }
          66.66% { fill: ${t2}; } 100% { fill: ${t0}; }
        }
        @keyframes ${K}-cycle-robe {
          0% { fill: ${r0}; } 33.33% { fill: ${r1}; }
          66.66% { fill: ${r2}; } 100% { fill: ${r0}; }
        }
        ${S} .cl-bauhaus-s-sun {
          animation:
            ${K}-drift-c 8s ease-in-out -1s infinite,
            ${K}-cycle-circle 24s steps(1, end) 1.2s backwards infinite;
        }
        ${S} .cl-bauhaus-s-triangle {
          animation:
            ${K}-drift-a 6.5s ease-in-out -2s infinite,
            ${K}-cycle-triangle 24s steps(1, end) 1.2s backwards infinite;
        }
        ${S} .cl-bauhaus-s-robe {
          animation:
            ${K}-drift-d 5.5s ease-in-out -3s infinite,
            ${K}-cycle-robe 24s steps(1, end) 1.2s backwards infinite;
        }

        /* the star square spins slowly, forever */
        @keyframes ${K}-spin { to { transform: rotate(360deg); } }
        ${S} .cl-bauhaus-s-star {
          transform-origin: 152px 66px;
          animation: ${K}-spin 14s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          ${S}, ${S}:hover, ${S} svg * {
            animation: none !important;
            transition: none !important;
          }
          ${S}:hover { transform: none; }
          ${S}:hover svg * { transform: none; }
          /* keep the arm's static rotation even with motion off */
          ${S} .cl-bauhaus-s-arm { transform: rotate(-24deg); }
        }
      `;
}

export default function BauhausCard({
  number = 9,
  name = "THE HERMIT",
  variant = 0,
}: BauhausCardProps) {
  const v = ((Math.round(variant) % 8) + 8) % 8;
  const mirror = v % 2 === 1;
  const p = PALETTES[v >> 1];
  const numeral = toRoman(number);

  // Long captions are squeezed to the dome's width; the default caption
  // keeps its natural letterspaced rendering untouched.
  const captionFit =
    name.length > 10
      ? { textLength: 164, lengthAdjust: "spacingAndGlyphs" as const }
      : {};
  // Long numerals (e.g. XVIII) are squeezed into the ring.
  const numeralFit =
    numeral.length > 2
      ? { textLength: 34, lengthAdjust: "spacingAndGlyphs" as const }
      : {};

  return (
    <figure
      className={`cl-bauhaus-card cl-bauhaus-v${v}`}
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
    >
      <style>{buildStyle(v, p)}</style>

      <svg
        viewBox="0 0 200 300"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={`Bauhaus geometric tarot card: ${name}, number ${number}`}
      >
        {/* Artwork (mirrored horizontally for odd variants) */}
        <g transform={mirror ? "translate(200 0) scale(-1 1)" : undefined}>
          {/* Paper ground */}
          <rect x="0" y="0" width="200" height="300" fill={p.bg} />

          {/* Mountain — triangle, peak pushed right of center */}
          <g className="cl-bauhaus-g-triangle">
            <polygon
              className="cl-bauhaus-s-triangle"
              points="28,242 138,96 200,242"
              fill={p.cycle.triangle[0]}
            />
          </g>

          {/* Ground — semicircle dome rising from the bottom edge */}
          <g className="cl-bauhaus-g-ground">
            <path
              className="cl-bauhaus-s-ground"
              d="M 5 296 A 95 95 0 0 0 195 296 Z"
              fill={p.ink}
            />
          </g>

          {/* Lantern light / sun — large circle, top right */}
          <g className="cl-bauhaus-g-sun">
            <circle
              className="cl-bauhaus-s-sun"
              cx="152"
              cy="66"
              r="42"
              fill={p.cycle.circle[0]}
            />
          </g>

          {/* The figure: robe, hood, staff, raised lantern arm */}
          <g className="cl-bauhaus-g-robe">
            <rect
              className="cl-bauhaus-s-robe"
              x="78"
              y="128"
              width="26"
              height="118"
              fill={p.cycle.robe[0]}
            />
          </g>
          <g className="cl-bauhaus-g-head">
            <circle
              className="cl-bauhaus-s-head"
              cx="91"
              cy="116"
              r="12"
              fill={p.ink}
            />
          </g>
          <g className="cl-bauhaus-g-staff">
            <rect
              className="cl-bauhaus-s-staff"
              x="120"
              y="104"
              width="5"
              height="140"
              fill={p.ink}
            />
          </g>
          <g className="cl-bauhaus-g-arm">
            <rect
              className="cl-bauhaus-s-arm"
              x="103"
              y="96"
              width="34"
              height="6"
              fill={RED}
            />
          </g>
          {/* Star inside the lantern */}
          <g className="cl-bauhaus-g-star">
            <rect
              className="cl-bauhaus-s-star"
              x="147"
              y="61"
              width="10"
              height="10"
              fill={p.star}
            />
          </g>
        </g>

        {/* Numeral — bold numeral inside a ring (flips corner when mirrored) */}
        <g className="cl-bauhaus-s-numeral">
          <circle
            cx={mirror ? 166 : 34}
            cy="40"
            r="22"
            fill="none"
            stroke={p.ink}
            strokeWidth="3"
          />
          <text
            x={mirror ? 166 : 34}
            y="49"
            textAnchor="middle"
            className="cl-bauhaus-title"
            fontSize="24"
            fill={p.ink}
            {...numeralFit}
          >
            {numeral}
          </text>
        </g>

        {/* Caption — heavy letterspaced caps on the dome */}
        <text
          x="100"
          y="286"
          textAnchor="middle"
          className="cl-bauhaus-title cl-bauhaus-s-caption"
          fontSize="15"
          letterSpacing="6"
          fill={p.onInk}
          {...captionFit}
        >
          {name}
        </text>

        {/* Thin frame */}
        <rect
          x="4"
          y="4"
          width="192"
          height="292"
          fill="none"
          stroke={p.ink}
          strokeWidth="2"
        />
      </svg>
    </figure>
  );
}
