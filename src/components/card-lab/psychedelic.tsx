import type { CSSProperties, ReactNode } from "react";
import { toRoman } from "@/lib/roman";

/**
 * PSYCHEDELIC — 1967 San Francisco poster art (Fillmore).
 * The Hermit melted into swirling organic forms: concentric wavy contour
 * bands radiating from the lantern, a robe of psychedelic pattern swirls,
 * paisley flourishes, a warped bubble border, the numeral hidden in an
 * ornamental sun, and the card name in warped bulbous lettering.
 *
 * Reusable via optional props { number, name, variant }. With no props it
 * renders the original "IX — THE HERMIT" card exactly. `variant` (0-7)
 * picks a palette pair (4 schemes) and mirrors the composition on odd
 * variants; variant 0 is the original look.
 */

const INK = "#2a0a4a"; // deep violet ink
const PAPER = "#1a0b2e"; // night-purple ground

// Saturated vibrating 4-color schemes. Index 0 is the original palette.
const PALETTES = [
  ["#ff6d00", "#ff2ea6", "#a6ff00", "#00e5ff"], // orange / magenta / lime / turquoise
  ["#ffd400", "#ff3d00", "#00e676", "#7c4dff"], // yellow / vermilion / green / violet
  ["#00e5ff", "#ffea00", "#ff2ea6", "#76ff03"], // cyan / yellow / magenta / acid lime
  ["#b388ff", "#00e5ff", "#ff6d00", "#ccff00"], // lavender / cyan / orange / chartreuse
];

/** Closed wavy ring: a circle whose radius is modulated by a sine wave. */
function wavyRing(
  cx: number,
  cy: number,
  r: number,
  amp: number,
  lobes: number,
  phase: number,
  steps = 120,
): string {
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const rr = r + amp * Math.sin(lobes * a + phase);
    const x = cx + rr * Math.cos(a);
    const y = cy + rr * Math.sin(a);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `${d}Z`;
}

// Lantern position — the light source the whole poster radiates from.
const LX = 136;
const LY = 168;

/** Contour bands: filled wavy discs stacked largest-first into rings. */
function ContourBands({ pal, variant }: { pal: string[]; variant: number }) {
  const discs: ReactNode[] = [];
  const COUNT = 16;
  for (let i = COUNT - 1; i >= 0; i--) {
    const r = 34 + i * 33;
    discs.push(
      <path
        key={i}
        d={wavyRing(LX, LY, r, 7, 6 + ((i + variant) % 4), i * 1.3 + variant * 0.7)}
        fill={pal[i % pal.length]}
        stroke={INK}
        strokeWidth={1.5}
      />,
    );
  }
  // Stagger the hue-trip start per variant so a gallery doesn't pulse in sync.
  const ringsStyle: CSSProperties | undefined =
    variant === 0 ? undefined : { animationDelay: `0s, ${(-variant * 1.7).toFixed(1)}s` };
  return (
    <g className="cl-psy-rings-wrap">
      <g className="cl-psy-rings" style={ringsStyle}>
        {discs}
      </g>
    </g>
  );
}

/** Warped bubble border: alternating-size circles marching the inner frame. */
function BubbleBorder({ pal }: { pal: string[] }) {
  const bubbles: ReactNode[] = [];
  let n = 0;
  const add = (x: number, y: number) => {
    const r = n % 2 === 0 ? 6 : 3.4;
    bubbles.push(
      <circle
        key={n}
        cx={x}
        cy={y}
        r={r}
        fill={pal[n % pal.length]}
        stroke={INK}
        strokeWidth={1}
      />,
    );
    n += 1;
  };
  for (let x = 40; x <= 362; x += 22) {
    add(x, 24);
    add(x, 576);
  }
  for (let y = 46; y <= 556; y += 22) {
    add(24, y);
    add(376, y);
  }
  return <g>{bubbles}</g>;
}

/** Ornamental sun hiding the roman numeral. Kept out of the mirror group so text never flips. */
function SunSeal({ numeral }: { numeral: string }) {
  const size = numeral.length <= 2 ? 34 : 24;
  return (
    <g>
      <path
        d={wavyRing(200, 92, 56, 10, 12, 0.4)}
        fill="#ffb300"
        stroke={INK}
        strokeWidth={2}
      />
      <circle cx={200} cy={92} r={38} fill="#ffe9a8" stroke="#ff2ea6" strokeWidth={3} />
      <text
        x={200}
        y={92 + Math.round(size * 0.35)}
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight={700}
        fontSize={size}
        fill={INK}
        transform="rotate(-4 200 92)"
      >
        {numeral}
      </text>
    </g>
  );
}

/** Small paisley flourish, drawn around local origin, tip curling up-right. */
function Paisley({
  x,
  y,
  s,
  rot,
  flip,
  outer,
  inner,
}: {
  x: number;
  y: number;
  s: number;
  rot: number;
  flip?: boolean;
  outer: string;
  inner: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -s : s} ${s})`}>
      <path
        d="M0 -42 C24 -42 40 -22 36 2 C32 26 12 42 -6 38 C-26 33 -36 14 -30 -6 C-26 -20 -16 -27 -7 -23 C1 -20 3 -12 -3 -8 C-8 -5 -13 -8 -12 -14"
        fill={outer}
        stroke={INK}
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <circle cx={-4} cy={10} r={6.5} fill={inner} stroke={INK} strokeWidth={2} />
      <circle cx={-4} cy={10} r={2.2} fill={INK} />
      <path
        d="M14 30 C22 26 27 18 26 8"
        fill="none"
        stroke="#ffe9a8"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
    </g>
  );
}

/** The hermit: dark hooded silhouette filled with clipped pattern swirls. */
function HermitFigure({ pal }: { pal: string[] }) {
  const robe =
    "M200 214 C236 216 256 246 260 288 C266 332 284 384 291 440 " +
    "C295 470 301 488 307 500 L95 500 C101 486 107 468 111 442 " +
    "C119 386 137 336 145 292 C151 252 164 212 200 214 Z";

  // Swirl pattern strokes, clipped to the robe.
  const swirls: ReactNode[] = [];
  for (let i = 0; i < 5; i++) {
    swirls.push(
      <path
        key={i}
        d={wavyRing(206, 396, 22 + i * 15, 5, 5 + (i % 3), i * 0.9, 72)}
        fill="none"
        stroke={pal[(i + 1) % pal.length]}
        strokeWidth={5}
      />,
    );
  }

  return (
    <g>
      <defs>
        <clipPath id="cl-psy-robe">
          <path d={robe} />
        </clipPath>
      </defs>

      {/* Staff with a psychedelic curl top, planted on the right. */}
      <path
        d="M276 300 L276 502"
        stroke={pal[3]}
        strokeWidth={8}
        strokeLinecap="round"
      />
      <circle cx={276} cy={288} r={11} fill="none" stroke={pal[3]} strokeWidth={5} />
      <circle cx={276} cy={288} r={3.5} fill="#ffe9a8" />

      {/* Robe silhouette + clipped swirls. */}
      <path d={robe} fill={INK} stroke={pal[1]} strokeWidth={3} />
      <g clipPath="url(#cl-psy-robe)">
        {swirls}
        <path
          d="M120 470 C160 440 240 440 296 472"
          fill="none"
          stroke="#ffe9a8"
          strokeWidth={5}
          strokeLinecap="round"
        />
      </g>

      {/* Hood opening: a dark void, no face. */}
      <ellipse cx={200} cy={262} rx={17} ry={22} fill="#12031f" />
      <ellipse cx={200} cy={262} rx={17} ry={22} fill="none" stroke={pal[2]} strokeWidth={2.5} />

      {/* Raised sleeve reaching to the lantern. */}
      <path
        d="M163 284 C141 262 129 224 134 192 L153 186 C158 218 170 250 187 270 Z"
        fill={INK}
        stroke={pal[1]}
        strokeWidth={3}
      />
      <circle cx={144} cy={188} r={7.5} fill="#ffe9a8" stroke={INK} strokeWidth={2} />

      {/* Lantern: handle, body, pulsing glow, star inside. */}
      <path
        d="M144 184 C138 172 132 168 136 158"
        fill="none"
        stroke={INK}
        strokeWidth={3}
      />
      <circle className="cl-psy-glow" cx={LX} cy={LY} r={30} fill="#fff3c4" opacity={0.7} />
      <path
        d={`M${LX - 13} ${LY - 12} L${LX + 13} ${LY - 12} L${LX + 16} ${LY + 12} L${LX - 16} ${LY + 12} Z`}
        fill="#ffe9a8"
        stroke={INK}
        strokeWidth={2.5}
      />
      <path
        d={`M${LX} ${LY - 9} L${LX + 3} ${LY - 2} L${LX + 9} ${LY} L${LX + 3} ${LY + 2} L${LX} ${LY + 9} L${LX - 3} ${LY + 2} L${LX - 9} ${LY} L${LX - 3} ${LY - 2} Z`}
        fill={pal[0]}
      />
    </g>
  );
}

/** Warped bulbous title on a wavy baseline, with a vibrating offset shadow. */
function TitleBanner({ name, pal }: { name: string; pal: string[] }) {
  // Fit any card name: shrink the bulbous letters, tighten tracking, and
  // compress onto the baseline only when the estimate overflows the banner.
  const len = Math.max(1, name.length);
  const ls = len > 12 ? 1 : 2;
  const size = len <= 10 ? 40 : Math.max(20, Math.floor(380 / len));
  const est = len * (size * 0.72 + ls);
  const squeeze = est > 310 ? 290 : undefined;
  const textProps = {
    fontFamily: "'Arial Black', Arial, Helvetica, sans-serif",
    fontWeight: 900,
    fontSize: size,
    letterSpacing: ls,
    textLength: squeeze,
    lengthAdjust: "spacingAndGlyphs" as const,
  };
  return (
    <g className="cl-psy-title">
      <defs>
        <path id="cl-psy-titlePath" d="M52 544 Q126 528 200 540 T348 538" fill="none" />
      </defs>
      <path
        d="M30 514 Q112 498 200 512 T370 510 L370 566 Q288 580 200 568 T30 570 Z"
        fill={INK}
        stroke={pal[2]}
        strokeWidth={3}
      />
      <text {...textProps} fill={pal[3]}>
        <textPath href="#cl-psy-titlePath" startOffset="50%" textAnchor="middle">
          <tspan dy={3}>{name}</tspan>
        </textPath>
      </text>
      <text {...textProps} fill={pal[0]} stroke={INK} strokeWidth={1.2}>
        <textPath href="#cl-psy-titlePath" startOffset="50%" textAnchor="middle">
          {name}
        </textPath>
      </text>
    </g>
  );
}

export interface PsychedelicCardProps {
  /** Major Arcana number 1-22, rendered as a roman numeral in the sun seal. */
  number?: number;
  /** Card name rendered in the warped banner. */
  name?: string;
  /** 0-7: palette pair (4 schemes) + mirrored composition on odd numbers. */
  variant?: number;
}

export default function PsychedelicCard({
  number = 9,
  name = "THE HERMIT",
  variant = 0,
}: PsychedelicCardProps) {
  const v = Math.max(0, Math.min(7, Math.round(variant)));
  const pal = PALETTES[Math.floor(v / 2) % PALETTES.length];
  const mirror = v % 2 === 1;
  const pr = v * 5; // paisley rotation shuffle per variant

  return (
    <figure
      className="cl-psy-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0, overflow: "hidden" }}
    >
      <style>{`
        @keyframes cl-psy-pulse { 0%, 100% { opacity: .45 } 50% { opacity: .95 } }
        @keyframes cl-psy-spin { to { transform: rotate(360deg) } }
        @keyframes cl-psy-hue { to { filter: hue-rotate(360deg) } }
        @keyframes cl-psy-wobble {
          0%, 100% { transform: translateY(0) skewX(0deg) }
          25% { transform: translateY(-1.5px) skewX(-1.2deg) }
          75% { transform: translateY(1.5px) skewX(1.2deg) }
        }
        @keyframes cl-psy-bob {
          0%, 100% { transform: translateY(0) rotate(0deg) }
          50% { transform: translateY(-3px) rotate(2.5deg) }
        }
        .cl-psy-glow { animation: cl-psy-pulse 3.2s ease-in-out infinite }
        .cl-psy-rings {
          transform-box: view-box;
          transform-origin: ${LX}px ${LY}px;
          animation: cl-psy-spin 12s linear infinite, cl-psy-hue 14s linear infinite;
        }
        .cl-psy-title {
          transform-box: fill-box;
          transform-origin: center;
          animation: cl-psy-wobble 5s ease-in-out infinite;
        }
        .cl-psy-paisley {
          transform-box: fill-box;
          transform-origin: center;
          animation: cl-psy-bob 6s ease-in-out infinite;
        }
        .cl-psy-paisley-2 { animation-duration: 7.3s; animation-delay: -1.5s }
        .cl-psy-paisley-3 { animation-duration: 5.4s; animation-delay: -2.6s }
        .cl-psy-paisley-4 { animation-duration: 6.8s; animation-delay: -3.8s }
        .cl-psy-card:hover .cl-psy-rings {
          animation-duration: 4s, 14s;
        }
        .cl-psy-card:hover .cl-psy-rings-wrap {
          filter: saturate(1.6);
        }
        @media (prefers-reduced-motion: reduce) {
          .cl-psy-glow, .cl-psy-rings, .cl-psy-title, .cl-psy-paisley { animation: none }
        }
      `}</style>
      <svg
        viewBox="0 0 400 600"
        preserveAspectRatio="xMidYMid slice"
        width="100%"
        height="100%"
        role="img"
        aria-label={`${name} tarot card in psychedelic 1967 poster style`}
        style={{ display: "block" }}
      >
        <rect width={400} height={600} fill={PAPER} />

        {/* Artwork group — mirrored horizontally on odd variants. Text stays outside. */}
        <g transform={mirror ? "translate(400 0) scale(-1 1)" : undefined}>
          {/* Radiating contour bands behind everything. */}
          <ContourBands pal={pal} variant={v} />

          {/* Paisley flourishes (wrapped so CSS bobbing composes with placement). */}
          <g className="cl-psy-paisley cl-psy-paisley-1"><Paisley x={66} y={452} s={1} rot={-14 + pr} outer={pal[1]} inner={pal[2]} /></g>
          <g className="cl-psy-paisley cl-psy-paisley-2"><Paisley x={334} y={452} s={1} rot={14 + pr} outer={pal[1]} inner={pal[2]} flip /></g>
          <g className="cl-psy-paisley cl-psy-paisley-3"><Paisley x={72} y={84} s={0.55} rot={-24 + pr} outer={pal[1]} inner={pal[2]} /></g>
          <g className="cl-psy-paisley cl-psy-paisley-4"><Paisley x={328} y={84} s={0.55} rot={24 + pr} outer={pal[1]} inner={pal[2]} flip /></g>

          {/* The hermit himself. */}
          <HermitFigure pal={pal} />
        </g>

        {/* Ornamental sun with the hidden numeral (never mirrored). */}
        <SunSeal numeral={toRoman(number)} />

        {/* Warped bubble border + frame. */}
        <BubbleBorder pal={pal} />
        <rect
          x={10}
          y={10}
          width={380}
          height={580}
          rx={24}
          fill="none"
          stroke={pal[1]}
          strokeWidth={3}
        />

        {/* Warped bulbous title. */}
        <TitleBanner name={name} pal={pal} />
      </svg>
    </figure>
  );
}
