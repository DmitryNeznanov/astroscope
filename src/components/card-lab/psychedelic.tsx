import type { CSSProperties, ReactNode } from "react";
import { toRoman } from "@/lib/roman";

/**
 * PSYCHEDELIC — 1967 San Francisco poster art (Fillmore).
 * A deck of Major Arcana scenes, each drawn in the same technique:
 * concentric wavy contour bands radiating from the scene's light source,
 * deep-violet ink silhouettes with vibrating palette strokes, clipped
 * pattern swirls, paisley flourishes, a warped bubble border, the numeral
 * hidden in an ornamental sun, and the card name in warped bulbous type.
 *
 * Props: { number, name, variant }. No props → the canonical "IX — THE
 * HERMIT" card, visually unchanged. `variant` (0-7) picks a palette pair
 * (4 schemes) and mirrors the composition on odd numbers.
 */

const INK = "#2a0a4a"; // deep violet ink
const PAPER = "#1a0b2e"; // night-purple ground
const CREAM = "#ffe9a8"; // warm highlight

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

/** Regular pointed star (4-point diamonds, 8-point bursts, ...). */
function starPath(cx: number, cy: number, rO: number, rI: number, points = 4): string {
  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? rO : rI;
    const a = -Math.PI / 2 + (i / (points * 2)) * Math.PI * 2;
    d += `${i === 0 ? "M" : "L"}${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
  }
  return `${d}Z`;
}

/** Pulsing light-source glow (same class everywhere; CSS animates it). */
function Glow({ x, y, r }: { x: number; y: number; r: number }) {
  return <circle className="cl-psy-glow" cx={x} cy={y} r={r} fill="#fff3c4" opacity={0.7} />;
}

/** Clipped psychedelic swirl fill inside an ink silhouette. */
function SwirlFill({ id, d, cx, cy, pal }: { id: string; d: string; cx: number; cy: number; pal: string[] }) {
  const swirls: ReactNode[] = [];
  for (let i = 0; i < 4; i++) {
    swirls.push(
      <path
        key={i}
        d={wavyRing(cx, cy, 18 + i * 15, 5, 5 + (i % 3), i * 0.9, 72)}
        fill="none"
        stroke={pal[(i + 1) % pal.length]}
        strokeWidth={5}
      />,
    );
  }
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={d} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>{swirls}</g>
    </g>
  );
}

/** Contour bands: filled wavy discs stacked largest-first into rings. */
function ContourBands({ pal, variant, cx, cy }: { pal: string[]; variant: number; cx: number; cy: number }) {
  const discs: ReactNode[] = [];
  const COUNT = 18; // outer two are only visible for off-center scenes
  for (let i = COUNT - 1; i >= 0; i--) {
    const r = 34 + i * 33;
    discs.push(
      <path
        key={i}
        d={wavyRing(cx, cy, r, 7, 6 + ((i + variant) % 4), i * 1.3 + variant * 0.7)}
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
      <circle cx={200} cy={92} r={38} fill={CREAM} stroke="#ff2ea6" strokeWidth={3} />
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
        stroke={CREAM}
        strokeWidth={2.4}
        strokeLinecap="round"
      />
    </g>
  );
}

/* ------------------------------ scenes ------------------------------ */

/** IX — The Hermit (canonical scene; light = lantern at 136,168). */
function HermitArt({ pal }: { pal: string[] }) {
  const LX = 136;
  const LY = 168;
  const robe =
    "M200 214 C236 216 256 246 260 288 C266 332 284 384 291 440 " +
    "C295 470 301 488 307 500 L95 500 C101 486 107 468 111 442 " +
    "C119 386 137 336 145 292 C151 252 164 212 200 214 Z";

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
      <path d="M276 300 L276 502" stroke={pal[3]} strokeWidth={8} strokeLinecap="round" />
      <circle cx={276} cy={288} r={11} fill="none" stroke={pal[3]} strokeWidth={5} />
      <circle cx={276} cy={288} r={3.5} fill={CREAM} />

      {/* Robe silhouette + clipped swirls. */}
      <path d={robe} fill={INK} stroke={pal[1]} strokeWidth={3} />
      <g clipPath="url(#cl-psy-robe)">
        {swirls}
        <path
          d="M120 470 C160 440 240 440 296 472"
          fill="none"
          stroke={CREAM}
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
      <circle cx={144} cy={188} r={7.5} fill={CREAM} stroke={INK} strokeWidth={2} />

      {/* Lantern: handle, body, pulsing glow, star inside. */}
      <path d="M144 184 C138 172 132 168 136 158" fill="none" stroke={INK} strokeWidth={3} />
      <Glow x={LX} y={LY} r={30} />
      <path
        d={`M${LX - 13} ${LY - 12} L${LX + 13} ${LY - 12} L${LX + 16} ${LY + 12} L${LX - 16} ${LY + 12} Z`}
        fill={CREAM}
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

/** I — The Magician (light = wand tip at 284,142). */
function MagicianArt({ pal }: { pal: string[] }) {
  const body = "M160 255 L140 470 L260 470 L240 255 Z";
  return (
    <g>
      {/* Lemniscate above the head. */}
      <circle cx={186} cy={182} r={14} fill="none" stroke={pal[2]} strokeWidth={4} />
      <circle cx={214} cy={182} r={14} fill="none" stroke={pal[2]} strokeWidth={4} />

      {/* Head + robe with swirl fill. */}
      <circle cx={200} cy={225} r={22} fill={INK} stroke={pal[1]} strokeWidth={3} />
      <path d={body} fill={INK} stroke={pal[1]} strokeWidth={3} />
      <SwirlFill id="cl-psy-mag" d={body} cx={200} cy={360} pal={pal} />

      {/* Raised wand arm + down-pointing arm. */}
      <path d="M232 262 L270 170" stroke={INK} strokeWidth={16} strokeLinecap="round" />
      <path d="M168 262 L130 330" stroke={INK} strokeWidth={16} strokeLinecap="round" />

      {/* Wand with glowing tip — the scene's light source. */}
      <path d="M270 170 L284 142" stroke={pal[3]} strokeWidth={5} strokeLinecap="round" />
      <Glow x={284} y={142} r={24} />
      <path d={starPath(284, 142, 12, 4)} fill={pal[0]} stroke={INK} strokeWidth={2} />

      {/* Table with the four suit tools. */}
      <rect x={70} y={400} width={260} height={14} fill={INK} stroke={pal[0]} strokeWidth={3} />
      <path d="M95 414 L95 480 M305 414 L305 480" stroke={INK} strokeWidth={8} />
      <path d="M104 398 a11 11 0 0 0 22 0" fill="none" stroke={pal[2]} strokeWidth={3} />
      <path d="M150 398 L150 366 M142 376 L158 376" stroke={pal[3]} strokeWidth={3} />
      <circle cx={196} cy={384} r={10} fill="none" stroke={pal[1]} strokeWidth={3} />
      <path d={starPath(196, 384, 6, 2.5)} fill={pal[1]} />
      <path d="M234 398 L254 368" stroke={pal[2]} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
}

/** III — The Empress (light = crown star at 200,168). */
function EmpressArt({ pal }: { pal: string[] }) {
  const gown = "M150 250 Q120 340 112 470 L288 470 Q280 340 250 250 Z";
  const wheat = (x: number) => (
    <g stroke={pal[2]} strokeWidth={3} strokeLinecap="round">
      <path d={`M${x} 495 L${x} 442`} />
      <path d={`M${x - 8} 458 L${x} 450 M${x + 8} 458 L${x} 450`} />
      <path d={`M${x - 8} 472 L${x} 464 M${x + 8} 472 L${x} 464`} />
    </g>
  );
  return (
    <g>
      {/* Crown with star tips + glowing center star. */}
      <path
        d="M166 198 L178 172 L190 192 L200 168 L210 192 L222 172 L234 198"
        fill="none"
        stroke={pal[0]}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <Glow x={200} y={168} r={18} />
      <path d={starPath(200, 166, 9, 3.5)} fill={CREAM} stroke={INK} strokeWidth={1.5} />
      <circle cx={178} cy={170} r={3} fill={pal[0]} />
      <circle cx={222} cy={170} r={3} fill={pal[0]} />

      {/* Head + flowing gown with swirl fill. */}
      <circle cx={200} cy={222} r={22} fill={INK} stroke={pal[1]} strokeWidth={3} />
      <path d={gown} fill={INK} stroke={pal[1]} strokeWidth={3} />
      <SwirlFill id="cl-psy-emp" d={gown} cx={200} cy={370} pal={pal} />

      {/* Heart shield with Venus symbol. */}
      <path
        d="M140 356 C140 344 158 344 158 356 C158 368 140 380 140 388 C140 380 122 368 122 356 C122 344 140 344 140 356 Z"
        fill={pal[1]}
        stroke={INK}
        strokeWidth={3}
      />
      <circle cx={140} cy={362} r={5} fill="none" stroke={CREAM} strokeWidth={2.5} />
      <path d="M140 367 L140 379 M135 374 L145 374" stroke={CREAM} strokeWidth={2.5} />

      {/* Lush vines + wheat below. */}
      <path d="M72 470 Q58 390 92 320" fill="none" stroke={pal[3]} strokeWidth={3} />
      <path d="M328 470 Q342 390 308 320" fill="none" stroke={pal[3]} strokeWidth={3} />
      {wheat(92)}
      {wheat(118)}
      {wheat(282)}
      {wheat(308)}
    </g>
  );
}

/** VII — The Chariot (light = canopy star at 200,190). */
function ChariotArt({ pal }: { pal: string[] }) {
  return (
    <g>
      {/* City wall behind. */}
      <rect x={40} y={400} width={320} height={26} fill={INK} stroke={pal[3]} strokeWidth={3} />
      <path
        d="M56 400 L56 386 L72 386 L72 400 M112 400 L112 386 L128 386 L128 400 M168 400 L168 386 L184 386 L184 400 M224 400 L224 386 L240 386 L240 400 M280 400 L280 386 L296 386 L296 400 M336 400 L336 386 L352 386 L352 400"
        fill={INK}
        stroke={pal[3]}
        strokeWidth={3}
      />

      {/* Starred canopy + glowing center star. */}
      <path d="M100 225 Q200 152 300 225 Z" fill={INK} stroke={pal[1]} strokeWidth={3} />
      <Glow x={200} y={190} r={18} />
      <path d={starPath(200, 188, 10, 4)} fill={CREAM} stroke={INK} strokeWidth={1.5} />
      <path d={starPath(150, 206, 6, 2.5)} fill={pal[2]} />
      <path d={starPath(250, 206, 6, 2.5)} fill={pal[2]} />
      <path d="M120 225 L120 270 M280 225 L280 270" stroke={INK} strokeWidth={6} />

      {/* Charioteer. */}
      <circle cx={200} cy={262} r={18} fill={INK} stroke={pal[0]} strokeWidth={3} />
      <rect x={172} y={284} width={56} height={40} fill={INK} stroke={pal[0]} strokeWidth={3} />

      {/* Boxy chariot. */}
      <rect x={120} y={318} width={160} height={80} fill={INK} stroke={pal[0]} strokeWidth={4} />
      <path
        d="M132 358 Q158 346 184 358 T236 358 T268 358"
        fill="none"
        stroke={pal[2]}
        strokeWidth={3}
      />

      {/* Two sphinxes in front. */}
      <path
        d="M60 490 L60 455 Q60 432 84 432 Q100 432 100 448 L128 448 Q142 448 142 462 L142 490 Z"
        fill={INK}
        stroke={pal[1]}
        strokeWidth={3}
      />
      <circle cx={76} cy={438} r={10} fill={INK} stroke={pal[1]} strokeWidth={3} />
      <path
        d="M340 490 L340 455 Q340 432 316 432 Q300 432 300 448 L272 448 Q258 448 258 462 L258 490 Z"
        fill={INK}
        stroke={pal[3]}
        strokeWidth={3}
      />
      <circle cx={324} cy={438} r={10} fill={INK} stroke={pal[3]} strokeWidth={3} />
      <path d="M40 494 L360 494" stroke={pal[2]} strokeWidth={3} />
    </g>
  );
}

/** X — Wheel of Fortune (light = wheel hub at 200,300). */
function WheelArt({ pal }: { pal: string[] }) {
  const spokes: ReactNode[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    spokes.push(
      <line
        key={i}
        x1={200 + 20 * Math.cos(a)}
        y1={300 + 20 * Math.sin(a)}
        x2={200 + 106 * Math.cos(a)}
        y2={300 + 106 * Math.sin(a)}
        stroke={pal[2]}
        strokeWidth={4}
      />,
    );
  }
  return (
    <g>
      {/* Sphinx perched on top of the wheel. */}
      <path
        d="M172 158 L172 140 Q172 126 188 126 Q200 126 200 138 L214 138 Q224 138 224 148 L224 158 Z"
        fill={INK}
        stroke={pal[2]}
        strokeWidth={3}
      />
      <circle cx={184} cy={132} r={8} fill={INK} stroke={pal[2]} strokeWidth={3} />
      <path d="M180 124 L184 116 L188 124" fill="none" stroke={pal[2]} strokeWidth={2.5} />

      {/* Snake descending on the left, creature rising on the right. */}
      <path d="M64 396 q-16 20 -2 34 q12 12 2 32" fill="none" stroke={pal[2]} strokeWidth={5} strokeLinecap="round" />
      <path d="M60 394 l-6 -8 l10 2 Z" fill={pal[2]} />
      <path d="M336 436 q18 -12 12 -30 q-4 -16 10 -24" fill="none" stroke={pal[0]} strokeWidth={5} strokeLinecap="round" />
      <path d="M356 380 l4 -10 M360 384 l8 -6" stroke={pal[0]} strokeWidth={3} strokeLinecap="round" />

      {/* The wheel: rim, spokes, symbols, glowing hub. */}
      <circle cx={200} cy={300} r={130} fill="none" stroke={pal[0]} strokeWidth={10} />
      <circle cx={200} cy={300} r={106} fill="none" stroke={pal[1]} strokeWidth={3} />
      {spokes}
      <circle cx={200} cy={182} r={6} fill={pal[1]} />
      <circle cx={200} cy={418} r={6} fill={pal[1]} />
      <circle cx={82} cy={300} r={6} fill={pal[1]} />
      <circle cx={318} cy={300} r={6} fill={pal[1]} />
      <Glow x={200} y={300} r={30} />
      <circle cx={200} cy={300} r={20} fill={pal[3]} stroke={INK} strokeWidth={3} />
      <path d={starPath(200, 300, 10, 4)} fill={CREAM} />
    </g>
  );
}

/** XIII — Death (light = the white rose on the banner at 116,168). */
function DeathArt({ pal }: { pal: string[] }) {
  return (
    <g>
      {/* Sun rising between two towers on the horizon. */}
      <rect x={258} y={372} width={28} height={100} fill={INK} stroke={pal[1]} strokeWidth={3} />
      <rect x={326} y={372} width={28} height={100} fill={INK} stroke={pal[1]} strokeWidth={3} />
      <path d="M292 472 a20 20 0 0 1 40 0" fill={CREAM} stroke={pal[0]} strokeWidth={3} />
      <path d="M312 444 L312 434 M298 450 L292 442 M326 450 L332 442" stroke={pal[0]} strokeWidth={3} strokeLinecap="round" />
      <path d="M40 472 L360 472" stroke={pal[2]} strokeWidth={3} />

      {/* Banner pole + dark banner with glowing white rose. */}
      <path d="M152 240 L116 140" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <rect x={76} y={140} width={80} height={56} fill={INK} stroke={pal[1]} strokeWidth={3} />
      <Glow x={116} y={168} r={22} />
      <circle cx={116} cy={168} r={12} fill="none" stroke={CREAM} strokeWidth={3} />
      <path d="M116 156 L116 180 M104 168 L128 168 M108 160 L124 176 M124 160 L108 176" stroke={CREAM} strokeWidth={2} />

      {/* Horse. */}
      <path
        d="M150 380 Q144 330 190 318 Q250 306 290 322 Q320 334 314 366 L300 380 Z"
        fill={INK}
        stroke={pal[2]}
        strokeWidth={3}
      />
      <path
        d="M290 322 Q320 300 336 312 Q348 322 338 336 L312 344 Z"
        fill={INK}
        stroke={pal[2]}
        strokeWidth={3}
      />
      <circle cx={328} cy={320} r={2.5} fill={CREAM} />
      <path
        d="M170 378 L164 470 M196 382 L192 470 M268 380 L264 470 M296 376 L300 470"
        stroke={INK}
        strokeWidth={9}
        strokeLinecap="round"
      />

      {/* Skeletal rider. */}
      <circle cx={200} cy={225} r={17} fill={CREAM} stroke={INK} strokeWidth={3} />
      <circle cx={194} cy={222} r={2.5} fill={INK} />
      <circle cx={206} cy={222} r={2.5} fill={INK} />
      <path d="M200 242 L204 300" stroke={CREAM} strokeWidth={4} />
      <path d="M192 256 q10 6 20 0 M191 268 q11 6 22 0 M192 280 q10 6 20 0" fill="none" stroke={CREAM} strokeWidth={3} />
      <path d="M200 262 L152 240" stroke={CREAM} strokeWidth={5} strokeLinecap="round" />
    </g>
  );
}

/** XVII — The Star (light = the big eight-pointed star at 200,178). */
function StarArt({ pal }: { pal: string[] }) {
  const small: [number, number][] = [
    [76, 140],
    [324, 140],
    [58, 232],
    [342, 232],
    [118, 272],
    [282, 272],
    [200, 264],
  ];
  return (
    <g>
      {/* One big 8-pointed star + seven small ones. */}
      <Glow x={200} y={178} r={44} />
      <path d={starPath(200, 178, 34, 13, 8)} fill={pal[0]} stroke={INK} strokeWidth={3} />
      {small.map(([x, y], i) => (
        <path key={i} d={starPath(x, y, 10, 4)} fill={pal[2]} stroke={INK} strokeWidth={2} />
      ))}

      {/* Kneeling figure. */}
      <circle cx={180} cy={290} r={16} fill={INK} stroke={pal[1]} strokeWidth={3} />
      <path
        d="M160 312 Q146 350 158 380 L206 386 Q212 352 196 314 Z"
        fill={INK}
        stroke={pal[1]}
        strokeWidth={3}
      />
      <path d="M158 380 L128 420 L172 420 Z" fill={INK} stroke={pal[1]} strokeWidth={3} />
      <path d="M200 386 L230 420" stroke={INK} strokeWidth={10} strokeLinecap="round" />

      {/* Two jugs: one pouring to land, one to the pool. */}
      <path d="M168 322 L128 336" stroke={INK} strokeWidth={9} strokeLinecap="round" />
      <path d="M108 344 a10 10 0 0 0 20 0 l-3 -16 l-14 0 Z" fill={pal[3]} stroke={INK} strokeWidth={2.5} />
      <path d="M118 358 q-6 26 -2 50" fill="none" stroke={pal[3]} strokeWidth={4} strokeLinecap="round" />
      <path d="M192 324 L236 344" stroke={INK} strokeWidth={9} strokeLinecap="round" />
      <path d="M252 356 a10 10 0 0 1 -20 0 l3 -16 l14 0 Z" fill={pal[3]} stroke={INK} strokeWidth={2.5} />
      <path d="M244 368 q8 22 2 44" fill="none" stroke={pal[3]} strokeWidth={4} strokeLinecap="round" />

      {/* Land strip + pool waves. */}
      <path d="M48 432 L144 432" stroke={pal[2]} strokeWidth={3} />
      <path d="M206 462 q14 -10 28 0 q14 10 28 0 q14 -10 28 0 q14 10 28 0" fill="none" stroke={pal[3]} strokeWidth={3} />
      <path d="M214 480 q14 -10 28 0 q14 10 28 0 q14 -10 28 0 q14 10 28 0" fill="none" stroke={pal[3]} strokeWidth={3} />
    </g>
  );
}

/** XXII — The Fool (light = the sun behind him at 312,118). */
function FoolArt({ pal }: { pal: string[] }) {
  const rays: ReactNode[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + 0.4;
    rays.push(
      <line
        key={i}
        x1={312 + 26 * Math.cos(a)}
        y1={118 + 26 * Math.sin(a)}
        x2={312 + 36 * Math.cos(a)}
        y2={118 + 36 * Math.sin(a)}
        stroke={pal[0]}
        strokeWidth={3}
        strokeLinecap="round"
      />,
    );
  }
  return (
    <g>
      {/* Sun behind. */}
      <Glow x={312} y={118} r={30} />
      <circle cx={312} cy={118} r={20} fill={pal[0]} stroke={INK} strokeWidth={3} />
      {rays}

      {/* Cliff: ground rising to a plateau edge. */}
      <path d="M40 470 L180 470 L230 362 L312 362 L312 470 Z" fill={INK} stroke={pal[1]} strokeWidth={3} />
      <path d="M40 474 L360 474" stroke={pal[2]} strokeWidth={3} />

      {/* Small dog at his heels. */}
      <path
        d="M196 362 q-2 -16 10 -18 q8 -1 9 7 l0 11 q0 7 -6 7 l-9 0 q-5 0 -4 -7 Z"
        fill={INK}
        stroke={pal[3]}
        strokeWidth={2.5}
      />
      <path d="M202 344 l-1 -8 l6 6" fill="none" stroke={pal[3]} strokeWidth={2.5} />
      <path d="M214 350 q8 -6 10 2" fill="none" stroke={pal[3]} strokeWidth={2.5} />

      {/* Figure in profile, head tilted up, stepping toward the edge. */}
      <circle cx={270} cy={262} r={14} fill={INK} stroke={pal[0]} strokeWidth={3} />
      <path d="M260 278 L252 336 L284 338 L278 278 Z" fill={INK} stroke={pal[0]} strokeWidth={3} />
      <path d="M276 338 L296 360 M258 336 L246 360" stroke={INK} strokeWidth={9} strokeLinecap="round" />

      {/* Bundle on a stick over the shoulder. */}
      <path d="M264 282 L230 240" stroke={pal[2]} strokeWidth={4} strokeLinecap="round" />
      <circle cx={226} cy={232} r={10} fill={INK} stroke={pal[2]} strokeWidth={3} />

      {/* Flower in the free hand. */}
      <path d="M272 292 L292 282" stroke={INK} strokeWidth={7} strokeLinecap="round" />
      <circle cx={296} cy={278} r={5} fill={pal[1]} stroke={INK} strokeWidth={2} />
    </g>
  );
}

type SceneArt = (props: { pal: string[] }) => ReactNode;

interface Scene {
  /** Light-source point: contour bands radiate from here, spin orbits it. */
  lx: number;
  ly: number;
  Art: SceneArt;
}

const SCENES: Record<number, Scene> = {
  1: { lx: 284, ly: 142, Art: MagicianArt },
  3: { lx: 200, ly: 168, Art: EmpressArt },
  7: { lx: 200, ly: 190, Art: ChariotArt },
  9: { lx: 136, ly: 168, Art: HermitArt },
  10: { lx: 200, ly: 300, Art: WheelArt },
  13: { lx: 116, ly: 168, Art: DeathArt },
  17: { lx: 200, ly: 178, Art: StarArt },
  22: { lx: 312, ly: 118, Art: FoolArt },
};

const HERMIT = SCENES[9];

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
  /** Major Arcana number; 1/3/7/9/10/13/17/22 have bespoke scenes, others fall back to the Hermit. */
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
  const scene = SCENES[Math.round(number)] ?? HERMIT;
  const { lx, ly, Art } = scene;

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
          transform-origin: ${lx}px ${ly}px;
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
          {/* Contour bands radiating from the scene's light source. */}
          <ContourBands pal={pal} variant={v} cx={lx} cy={ly} />

          {/* Paisley flourishes (wrapped so CSS bobbing composes with placement). */}
          <g className="cl-psy-paisley cl-psy-paisley-1"><Paisley x={66} y={452} s={1} rot={-14 + pr} outer={pal[1]} inner={pal[2]} /></g>
          <g className="cl-psy-paisley cl-psy-paisley-2"><Paisley x={334} y={452} s={1} rot={14 + pr} outer={pal[1]} inner={pal[2]} flip /></g>
          <g className="cl-psy-paisley cl-psy-paisley-3"><Paisley x={72} y={84} s={0.55} rot={-24 + pr} outer={pal[1]} inner={pal[2]} /></g>
          <g className="cl-psy-paisley cl-psy-paisley-4"><Paisley x={328} y={84} s={0.55} rot={24 + pr} outer={pal[1]} inner={pal[2]} flip /></g>

          {/* The scene itself. */}
          <Art pal={pal} />
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
