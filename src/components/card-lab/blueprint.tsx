/**
 * Card Lab — BLUEPRINT
 * Architectural cyanotype tarot deck: each arcana drafted as its own
 * technical schematic — white chalk construction geometry, dimension lines,
 * detail callouts and a drafting title block on blueprint blue with a fine
 * grid. Default render (no props) is THE HERMIT (IX), the canonical scene.
 *
 * Props:
 *  - number  (1-22, default 9)  → selects the scene + roman numeral (toRoman)
 *  - name    (default: scene name) → card name, auto-fitted (textLength)
 *  - variant (0-7, default 0)   → palette (4 schemes); mirror + deco set
 *                                  apply to the Hermit scene only
 *
 * Effects (CSS-only, server-safe): draw-on drafting, marching dashes,
 * plotter scan line, blinking dimensions, pulsing registration marks,
 * per-scene light-source glow, hover note + grid brighten.
 * All guarded by prefers-reduced-motion.
 */

import type { ReactNode } from "react";
import { toRoman } from "@/lib/roman";

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
const HAND = '"Segoe Script", "Bradley Hand", "Comic Sans MS", cursive';

interface Palette {
  bg: string;
  ink: string;
  grid: string;
  light: boolean;
}

/** 4 drafting-paper schemes; index 0 is the original classic cyanotype. */
const PALETTES: Palette[] = [
  { bg: "#1d4e7e", ink: "#f2f7fd", grid: "#ffffff", light: false }, // classic cyanotype
  { bg: "#143a5e", ink: "#e8f3ff", grid: "#ffffff", light: false }, // deep prussian
  { bg: "#e9f2f9", ink: "#1d4e7e", grid: "#1d4e7e", light: true }, // whiteprint (inverse)
  { bg: "#14565e", ink: "#eef9f7", grid: "#ffffff", light: false }, // teal diazo
];

const SCENE_NAMES: Record<number, string> = {
  1: "THE MAGICIAN",
  3: "THE EMPRESS",
  7: "THE CHARIOT",
  9: "THE HERMIT",
  10: "WHEEL OF FORTUNE",
  13: "DEATH",
  17: "THE STAR",
  22: "THE FOOL",
};

/** hover-note phrases, one per scene */
const SCENE_NOTES: Record<number, string> = {
  1: "as above, so below",
  3: "growth is structural",
  7: "will holds the line",
  9: "solitude is load-bearing",
  10: "the rim turns, the hub holds",
  13: "all lines end",
  17: "pour slowly, refill often",
  22: "mind the edge",
};

/** 4-point drafting star path (like the Hermit's lantern star) */
const star4 = (cx: number, cy: number, s: number) =>
  `M${cx},${cy - s} L${cx + s * 0.28},${cy - s * 0.28} L${cx + s},${cy} L${cx + s * 0.28},${cy + s * 0.28} ` +
  `L${cx},${cy + s} L${cx - s * 0.28},${cy + s * 0.28} L${cx - s},${cy} L${cx - s * 0.28},${cy - s * 0.28} Z`;

export interface BlueprintCardProps {
  number?: number;
  name?: string;
  variant?: number;
}

export default function BlueprintHermitCard({ number = 9, name, variant = 0 }: BlueprintCardProps) {
  const v = ((Math.round(variant) % 8) + 8) % 8;
  const pal = PALETTES[v % 4];
  const scene = SCENE_NAMES[number] ? number : 9;
  // mirror + deco variations are designed for the canonical Hermit sheet
  const mirror = scene === 9 && v >= 4;
  const deco = scene === 9 && v % 4 >= 2;

  const cardName = name ?? SCENE_NAMES[scene];
  const roman = toRoman(number);
  /** mirror an x coordinate across the card centerline (artwork is 400 wide) */
  const mx = (x: number) => (mirror ? 400 - x : x);

  // name fitting for the title-block cell (~134 units wide) and header
  const nameLen = cardName.length;
  const titleFontSize = nameLen > 10 ? 11 : 13;
  const titleTracking = nameLen > 14 ? 0.5 : nameLen > 10 ? 1 : 2;
  const titleFit = nameLen > 14 ? ({ textLength: 134, lengthAdjust: "spacingAndGlyphs" } as const) : {};
  const fig = scene === 9 ? (deco ? "2" : "1") : roman;
  const headerText = `CYANOTYPE STUDY — FIG. ${fig}: ${cardName}`;
  const headerFit =
    headerText.length > 44 ? ({ textLength: 240, lengthAdjust: "spacingAndGlyphs" } as const) : {};

  // numeral fitting inside the drafting box (inner width ~51)
  const rn = roman.length;
  const numeralFontSize = rn > 3 ? 14 : rn === 3 ? 17 : 20;
  const numeralFit = rn > 2 ? ({ textLength: 46, lengthAdjust: "spacingAndGlyphs" } as const) : {};

  const scanLine = pal.light ? "rgba(29, 78, 126, 0.85)" : "rgba(255, 255, 255, 0.95)";
  const scanGlow = pal.light ? "rgba(29, 78, 126, 0.35)" : "rgba(190, 225, 255, 0.55)";
  const noteBorder = pal.light ? "rgba(29, 78, 126, 0.7)" : "rgba(242, 247, 253, 0.8)";

  return (
    <figure
      className="cl-blueprint-card"
      style={{ aspectRatio: "2/3", width: "100%", position: "relative", margin: 0, containerType: "inline-size" }}
      aria-label={`${cardName} tarot card drawn as an architectural blueprint`}
    >
      <style>{`
        .cl-blueprint-card svg { display: block; width: 100%; height: 100%; }

        /* per-scene light-source glow */
        .cl-blueprint-glow { animation: cl-blueprint-pulse 3.4s ease-in-out infinite; }
        @keyframes cl-blueprint-pulse {
          0%, 100% { opacity: 0.18; }
          50% { opacity: 0.8; }
        }

        /* draw-on drafting: solid chalk lines draw via dashoffset (needs pathLength="1") */
        .cl-blueprint-draw {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: cl-blueprint-draft 1s cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }
        @keyframes cl-blueprint-draft {
          to { stroke-dashoffset: 0; }
        }
        /* dashed lines that only fade/sweep in once (no marching) */
        .cl-blueprint-sketch {
          opacity: 0;
          animation: cl-blueprint-sketch-in 1.2s ease-out forwards;
        }
        @keyframes cl-blueprint-sketch-in {
          from { opacity: 0; stroke-dashoffset: 240; }
          to { opacity: 1; stroke-dashoffset: 0; }
        }

        /* marching dashes — continuous re-tracing.
           Each group's dashoffset loop distance is a common multiple of its
           dash patterns' periods so the loop is seamless.
           a: "14 4 2 4" centerlines / "5 3" circles (period 24/8), forward
           b: "6 4" / "3 3" / "5 4" construction+projection (lcm 90), reverse
           c: "4 3" folds / "2 2" arc / "10 4" diagonal (lcm 28), forward */
        .cl-blueprint-march-a,
        .cl-blueprint-march-b,
        .cl-blueprint-march-c { opacity: 0; }
        .cl-blueprint-march-a {
          animation: cl-blueprint-sketch-in 1.2s ease-out forwards,
                     cl-blueprint-march-a 1.4s linear infinite;
        }
        .cl-blueprint-march-b {
          animation: cl-blueprint-sketch-in 1.2s ease-out forwards,
                     cl-blueprint-march-b 5s linear infinite;
        }
        .cl-blueprint-march-c {
          animation: cl-blueprint-sketch-in 1.2s ease-out forwards,
                     cl-blueprint-march-c 2s linear infinite;
        }
        @keyframes cl-blueprint-march-a { to { stroke-dashoffset: -24; } }
        @keyframes cl-blueprint-march-b { to { stroke-dashoffset: 90; } }
        @keyframes cl-blueprint-march-c { to { stroke-dashoffset: -28; } }

        /* plotter scan line sweeping top-to-bottom */
        .cl-blueprint-scan {
          position: absolute;
          left: 1%;
          right: 1%;
          top: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, ${scanLine}, transparent);
          box-shadow: 0 0 14px 4px ${scanGlow};
          opacity: 0;
          pointer-events: none;
          animation: cl-blueprint-scan 6s linear infinite;
        }
        @keyframes cl-blueprint-scan {
          0% { top: -1%; opacity: 0; }
          5% { opacity: 0.9; }
          92% { opacity: 0.9; }
          100% { top: 101%; opacity: 0; }
        }

        /* dimension arrows/values blink occasionally (hard steps) */
        .cl-blueprint-blink { animation: cl-blueprint-blink 7s steps(1, end) infinite; }
        @keyframes cl-blueprint-blink {
          0%, 86%, 100% { opacity: 1; }
          88% { opacity: 0.2; }
          90% { opacity: 1; }
          93% { opacity: 0.2; }
          95% { opacity: 1; }
        }

        /* registration crosshairs pulse on a loop */
        .cl-blueprint-reg { animation: cl-blueprint-reg-pulse 3s ease-in-out infinite; }
        @keyframes cl-blueprint-reg-pulse {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 1; }
        }

        /* hover: grid brightens + hidden annotation slides in */
        .cl-blueprint-grid { transition: opacity 0.4s ease; }
        .cl-blueprint-grid-fine { opacity: 0.7; }
        .cl-blueprint-grid-major { opacity: 0.45; }
        .cl-blueprint-card:hover .cl-blueprint-grid-fine { opacity: 1; }
        .cl-blueprint-card:hover .cl-blueprint-grid-major { opacity: 0.95; }
        .cl-blueprint-note9 {
          position: absolute;
          left: 6%;
          bottom: 15%;
          margin: 0;
          padding: 0.4em 0.7em;
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 11px;
          font-size: 3.4cqw;
          letter-spacing: 0.06em;
          color: ${pal.ink};
          background: ${pal.bg}99;
          border: 1px dashed ${noteBorder};
          transform: rotate(-3deg) translateY(10px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .cl-blueprint-card:hover .cl-blueprint-note9 {
          opacity: 1;
          transform: rotate(-3deg) translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .cl-blueprint-glow { animation: none; opacity: 0.45; }
          .cl-blueprint-draw { animation: none; stroke-dashoffset: 0; }
          .cl-blueprint-sketch { animation: none; opacity: 1; }
          .cl-blueprint-march-a,
          .cl-blueprint-march-b,
          .cl-blueprint-march-c { animation: none; opacity: 1; }
          .cl-blueprint-scan { animation: none; opacity: 0; }
          .cl-blueprint-blink { animation: none; opacity: 1; }
          .cl-blueprint-reg { animation: none; opacity: 0.8; }
          .cl-blueprint-grid, .cl-blueprint-note9 { transition: none; }
        }
      `}</style>

      <svg
        viewBox="0 0 400 600"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: "absolute", inset: 0 }}
        role="img"
      >
        <defs>
          <pattern id="cl-bp-grid-fine" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M10 0H0V10" fill="none" stroke={pal.grid} strokeOpacity="0.10" strokeWidth="0.4" />
          </pattern>
          <pattern id="cl-bp-grid-major" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M50 0H0V50" fill="none" stroke={pal.grid} strokeOpacity="0.20" strokeWidth="0.6" />
          </pattern>
          <filter id="cl-bp-chalk" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" seed="7" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" />
          </filter>
          <marker id="cl-bp-arr" markerWidth="8" markerHeight="8" refX="5" refY="2.5" orient="auto-start-reverse">
            <path d="M0,0 L5,2.5 L0,5" fill="none" stroke={pal.ink} strokeWidth="0.8" />
          </marker>
        </defs>

        {/* paper */}
        <rect x="0" y="0" width="400" height="600" fill={pal.bg} />
        <rect className="cl-blueprint-grid cl-blueprint-grid-fine" x="0" y="0" width="400" height="600" fill="url(#cl-bp-grid-fine)" />
        <rect className="cl-blueprint-grid cl-blueprint-grid-major" x="0" y="0" width="400" height="600" fill="url(#cl-bp-grid-major)" />

        {/* slightly irregular paper edge / drawing frame */}
        <path
          d="M13.5,11.2 L386.4,10.1 L389.2,300.4 L387.8,588.6 L200.3,590.2 L11.6,587.9 L10.4,290.7 Z"
          fill="none" stroke={pal.ink} strokeOpacity="0.55" strokeWidth="1.4"
        />
        <path d="M20,18 L380,17 L382,583 L18,582 Z" fill="none" stroke={pal.ink} strokeOpacity="0.25" strokeWidth="0.6" />

        {/* corner registration crosshairs (pulsing) */}
        <g stroke={pal.ink} strokeWidth="0.8" strokeOpacity="0.8" fill="none">
          <g className="cl-blueprint-reg" transform="translate(30 30)"><circle r="6" /><path d="M-10,0 H10 M0,-10 V10" /></g>
          <g className="cl-blueprint-reg" style={{ animationDelay: "0.7s" }} transform="translate(370 30)"><circle r="6" /><path d="M-10,0 H10 M0,-10 V10" /></g>
          <g className="cl-blueprint-reg" style={{ animationDelay: "1.4s" }} transform="translate(30 500)"><circle r="6" /><path d="M-10,0 H10 M0,-10 V10" /></g>
          <g className="cl-blueprint-reg" style={{ animationDelay: "2.1s" }} transform="translate(370 500)"><circle r="6" /><path d="M-10,0 H10 M0,-10 V10" /></g>
        </g>

        {scene === 9 ? (
          <>
            {/* ==== IX — THE HERMIT (canonical, mirrored as one group for odd variants) ==== */}
            <g transform={mirror ? "translate(400 0) scale(-1 1)" : undefined}>
              {/* construction geometry (dashed — marches continuously) */}
              <g fill="none" stroke={pal.ink}>
                <circle className="cl-blueprint-march-b" cx="200" cy="300" r="150" strokeOpacity="0.35" strokeWidth="0.7" strokeDasharray="6 4" />
                <circle className="cl-blueprint-march-b" style={{ animationDelay: "0.15s" }} cx="200" cy="222" r="34" strokeOpacity="0.4" strokeWidth="0.6" strokeDasharray="3 3" />
                <path className="cl-blueprint-march-a" style={{ animationDelay: "0.3s" }} d="M200,58 V470" strokeOpacity="0.5" strokeWidth="0.7" strokeDasharray="14 4 2 4" />
                <path className="cl-blueprint-march-a" style={{ animationDelay: "0.45s" }} d="M50,300 H350" strokeOpacity="0.3" strokeWidth="0.6" strokeDasharray="14 4 2 4" />
                <path className="cl-blueprint-march-b" style={{ animationDelay: "0.55s" }} d="M60,508 H340" strokeOpacity="0.4" strokeWidth="0.6" strokeDasharray="5 4" />
                {deco && (
                  <>
                    <circle className="cl-blueprint-march-a" style={{ animationDelay: "0.6s" }} cx="266" cy="160" r="30" strokeOpacity="0.45" strokeWidth="0.6" strokeDasharray="5 3" />
                    <path className="cl-blueprint-march-c" style={{ animationDelay: "0.7s" }} d="M118,468 L318,132" strokeOpacity="0.3" strokeWidth="0.6" strokeDasharray="10 4" />
                  </>
                )}
              </g>

              {/* mountain peak (drawn) */}
              <g fill="none" stroke={pal.ink} strokeWidth="1.2" filter="url(#cl-bp-chalk)">
                <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.5s" }} d="M96,508 L200,402 L304,508" />
                <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.65s" }} d="M200,402 L172,452 M200,402 L232,466" strokeWidth="0.7" strokeOpacity="0.7" />
                <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.8s" }} d="M150,470 l14,-10 M170,486 l14,-10 M228,482 l-14,-10" strokeWidth="0.6" strokeOpacity="0.6" />
              </g>

              {/* schematic figure (drawn) */}
              <g fill="none" stroke={pal.ink} strokeWidth="1.6" filter="url(#cl-bp-chalk)">
                <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.8s" }} cx="200" cy="222" r="16" />
                <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.9s" }} d="M178,236 A24,24 0 0 1 222,236" />
                <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.95s" }} d="M178,236 C170,252 162,320 158,398" />
                <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.05s" }} d="M222,236 C230,252 238,320 242,398" />
                <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.15s" }} d="M158,398 C180,406 220,406 242,398" />
                <path className="cl-blueprint-march-c" style={{ animationDelay: "1.3s" }} d="M192,256 C188,310 186,360 186,396" strokeWidth="0.7" strokeDasharray="4 3" strokeOpacity="0.7" />
                <path className="cl-blueprint-march-c" style={{ animationDelay: "1.4s" }} d="M210,256 C214,310 216,360 216,396" strokeWidth="0.7" strokeDasharray="4 3" strokeOpacity="0.7" />
                <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.2s" }} d="M222,252 L246,220 L266,188" />
                <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.35s" }} cx="266" cy="134" r="3.5" strokeWidth="1" />
                <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.4s" }} d="M266,137 V142" strokeWidth="1" />
                <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.45s" }} d="M256,142 H276 L273,150 H259 Z" strokeWidth="1.1" />
                <rect className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.5s" }} x="257" y="150" width="18" height="26" strokeWidth="1.1" />
                <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.6s" }} d="M257,163 H276 M266,150 V176" strokeWidth="0.6" strokeOpacity="0.8" />
                <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.65s" }} d="M259,176 H273 L271,181 H261 Z" strokeWidth="1.1" />
                <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.8s" }} d="M266,155 L268,161 L274,163 L268,165 L266,171 L264,165 L258,163 L264,161 Z" strokeWidth="0.9" />
                <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.25s" }} d="M178,252 L154,268 L146,272" />
                <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.35s" }} d="M140,206 V452" strokeWidth="1.8" />
                <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.5s" }} cx="140" cy="201" r="4" strokeWidth="1" />
              </g>

              {/* lantern glow (animated) */}
              <circle className="cl-blueprint-glow" cx="266" cy="163" r="12" fill="#ffffff" opacity="0.3" />

              {/* dimensions + projection lines (marching; whole group blinks) */}
              <g className="cl-blueprint-blink" style={{ animationDelay: "2.6s" }}>
                <g fill="none" stroke={pal.ink} strokeWidth="0.7" strokeOpacity="0.85">
                  <path className="cl-blueprint-march-b" style={{ animationDelay: "1.9s" }} d="M182,206 H60 M160,400 H60" strokeDasharray="3 3" />
                  <path className="cl-blueprint-sketch" style={{ animationDelay: "2s" }} d="M66,206 V400" markerStart="url(#cl-bp-arr)" markerEnd="url(#cl-bp-arr)" />
                  <path className="cl-blueprint-march-b" style={{ animationDelay: "2.05s" }} d="M158,404 V428 M242,404 V428" strokeDasharray="3 3" />
                  <path className="cl-blueprint-sketch" style={{ animationDelay: "2.1s" }} d="M158,422 H242" markerStart="url(#cl-bp-arr)" markerEnd="url(#cl-bp-arr)" />
                  <path className="cl-blueprint-march-c" style={{ animationDelay: "2.15s" }} d="M232,250 A36,36 0 0 1 258,222" strokeDasharray="2 2" />
                  <path className="cl-blueprint-sketch" style={{ animationDelay: "2.2s" }} d="M278,158 L292,142" strokeWidth="0.8" />
                  <path className="cl-blueprint-march-b" style={{ animationDelay: "2.25s" }} d="M140,452 V508" strokeDasharray="3 3" strokeOpacity="0.5" />
                </g>
              </g>

              {/* lantern detail callout */}
              <g fill="none" stroke={pal.ink}>
                <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.1s" }} cx="326" cy="118" r="40" strokeWidth="1" />
                <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.2s" }} cx="326" cy="118" r="36.5" strokeWidth="0.5" strokeOpacity="0.6" />
                <g strokeWidth="1.1" filter="url(#cl-bp-chalk)">
                  <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.3s" }} cx="326" cy="96" r="3" strokeWidth="0.9" />
                  <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.35s" }} d="M316,102 H336 L333,108 H319 Z" />
                  <rect className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.4s" }} x="318" y="108" width="16" height="22" />
                  <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.45s" }} d="M320,130 H332 L330,135 H322 Z" />
                  <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.5s" }} d="M326,112 L327.6,116.4 L332,118 L327.6,119.6 L326,124 L324.4,119.6 L320,118 L324.4,116.4 Z" strokeWidth="0.8" />
                </g>
                <path className="cl-blueprint-sketch" style={{ animationDelay: "2.55s" }} d="M346,146 v6 m-8,-3 h16" strokeWidth="0.5" strokeOpacity="0.7" />
              </g>

              {/* pointer for the handwritten annotation */}
              <path d="M96,312 C120,300 140,286 158,266" fill="none" stroke={pal.ink} strokeWidth="0.6" strokeOpacity="0.7" markerEnd="url(#cl-bp-arr)" />
            </g>

            {/* hermit text layer (fades in after drafting; dimension values blink) */}
            <g className="cl-blueprint-sketch" style={{ animationDelay: "2.4s" }} fontFamily={MONO} fill={pal.ink}>
              <g className="cl-blueprint-blink" style={{ animationDelay: "4.2s" }}>
                <text x={mx(52)} y="303" fontSize="10" textAnchor="middle" transform={`rotate(-90 ${mx(52)} 303)`} letterSpacing="1">1.83</text>
                <text x="200" y="417" fontSize="8" textAnchor="middle" letterSpacing="1">0.92</text>
                <text x={mx(254)} y="212" fontSize="8" letterSpacing="0.5" textAnchor={mirror ? "end" : undefined}>45deg</text>
                <text x={mx(326)} y="172" fontSize="7" textAnchor="middle" letterSpacing="0.5">{deco ? "DETAIL B" : "DETAIL A"} — LANTERN</text>
                <text x={mx(326)} y="146" fontSize="5.5" textAnchor="middle" opacity="0.8">Ø0.12</text>
                <text x={mx(22)} y="494" fontSize="6.5" opacity="0.75" letterSpacing="0.5" textAnchor={mirror ? "end" : undefined}>NOTE 9 — LIGHT CARRIED ALOFT, FOR OTHERS</text>
              </g>
            </g>
            <text
              x={mx(74)} y="318" fontFamily={HAND} fontSize="13" fill={pal.ink} opacity="0.9"
              textAnchor={mirror ? "end" : undefined}
              transform={`rotate(${mirror ? 5 : -5} ${mx(74)} 318)`}
            >
              solitude, see note 9
            </text>
          </>
        ) : (
          SCENES[scene](pal.ink)
        )}

        {/* numeral drafting box */}
        <g>
          <rect x={mirror ? 312 : 30} y="44" width="58" height="40" fill="none" stroke={pal.ink} strokeWidth="1.2" />
          <rect x={mirror ? 315.5 : 33.5} y="47.5" width="51" height="33" fill="none" stroke={pal.ink} strokeWidth="0.5" strokeOpacity="0.7" />
          <text x={mx(59)} y="72" fontFamily={MONO} fontSize={numeralFontSize} fill={pal.ink} textAnchor="middle" letterSpacing="2" {...numeralFit}>{roman}</text>
          <text x="206" y="34" fontFamily={MONO} fontSize="6" fill={pal.ink} opacity="0.7" textAnchor="middle" letterSpacing="1.5" {...headerFit}>
            {headerText}
          </text>
        </g>

        {/* title block strip */}
        <g fontFamily={MONO}>
          <rect x="16" y="524" width="368" height="60" fill={pal.bg} fillOpacity="0.6" stroke={pal.ink} strokeWidth="1.2" />
          <path d="M160,524 V584 M252,524 V584 M312,524 V584" stroke={pal.ink} strokeWidth="0.8" fill="none" />
          <g fill={pal.ink} opacity="0.65" fontSize="5.5" letterSpacing="1">
            <text x="22" y="537">TITLE</text>
            <text x="166" y="537">SUIT</text>
            <text x="258" y="537">SCALE</text>
            <text x="318" y="537">SHEET</text>
          </g>
          <g fill={pal.ink}>
            <text x="88" y="566" fontSize={titleFontSize} textAnchor="middle" letterSpacing={titleTracking} {...titleFit}>{cardName}</text>
            <text x="206" y="564" fontSize="8.5" textAnchor="middle" letterSpacing="1">MAJOR ARCANA</text>
            <text x="282" y="566" fontSize="12" textAnchor="middle">1:1</text>
            <text x="348" y="564" fontSize="9" textAnchor="middle" letterSpacing="0.5">{roman}/XXII</text>
          </g>
          <path d="M16,546 H160 M252,546 H384 M160,546 H252" stroke={pal.ink} strokeWidth="0.4" strokeOpacity="0.5" fill="none" />
        </g>
      </svg>

      {/* plotter scan line */}
      <div className="cl-blueprint-scan" aria-hidden="true" />

      {/* hidden annotation, revealed on hover */}
      <figcaption className="cl-blueprint-note9" style={mirror ? { left: "auto", right: "6%" } : undefined}>
        NOTE {number}: {SCENE_NOTES[scene]}
      </figcaption>
    </figure>
  );
}

/* ============================ scenes ============================
   Each returns the full artwork + label layer for one card, drawn in
   the same drafting technique: marching construction geometry, chalk
   draw-on linework, one glowing light source, a detail callout,
   dimension lines and a handwritten note. */

/** I — The Magician: raised wand, lemniscate, table with the four tools. */
function magicianScene(ink: string): ReactNode {
  return (
    <g fill="none" stroke={ink}>
      <path className="cl-blueprint-march-a" d="M200,60 V510" strokeOpacity="0.4" strokeWidth="0.7" strokeDasharray="14 4 2 4" />
      <circle className="cl-blueprint-march-b" style={{ animationDelay: "0.15s" }} cx="200" cy="290" r="175" strokeOpacity="0.3" strokeWidth="0.7" strokeDasharray="6 4" />
      <g strokeWidth="1.2" filter="url(#cl-bp-chalk)">
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.4s" }} cx="186" cy="120" r="14" />
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.45s" }} cx="214" cy="120" r="14" />
      </g>
      <g strokeWidth="1.6" filter="url(#cl-bp-chalk)">
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.6s" }} cx="200" cy="180" r="20" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.7s" }} d="M170,215 L150,380 L250,380 L230,215" />
        <path className="cl-blueprint-march-c" style={{ animationDelay: "0.8s" }} d="M158,290 H242" strokeWidth="0.8" strokeDasharray="4 3" strokeOpacity="0.7" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.85s" }} d="M228,222 L268,150" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.95s" }} d="M268,150 L286,104" strokeWidth="1.2" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.9s" }} d="M172,222 L140,300" />
      </g>
      <circle className="cl-blueprint-glow" cx="286" cy="104" r="10" fill="#ffffff" opacity="0.3" />
      <g strokeWidth="1.3" filter="url(#cl-bp-chalk)">
        <rect className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.1s" }} x="110" y="410" width="180" height="16" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.2s" }} d="M124,426 V478 M276,426 V478" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.3s" }} d="M132,410 a10,10 0 0 0 20,0" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.35s" }} d="M182,410 V380 M174,388 H190" strokeWidth="1" />
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.4s" }} cx="222" cy="398" r="10" strokeWidth="1" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.45s" }} d="M222,390 L228,398 L222,406 L216,398 Z" strokeWidth="0.9" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.5s" }} d="M246,410 L268,384" strokeWidth="1" />
      </g>
      <g strokeWidth="0.7" strokeOpacity="0.85">
        <path className="cl-blueprint-march-b" style={{ animationDelay: "1.9s" }} d="M168,160 H64 M152,380 H64" strokeDasharray="3 3" />
        <path className="cl-blueprint-sketch" style={{ animationDelay: "2s" }} d="M70,160 V380" markerStart="url(#cl-bp-arr)" markerEnd="url(#cl-bp-arr)" />
        <path className="cl-blueprint-march-b" style={{ animationDelay: "2.05s" }} d="M110,432 V456 M290,432 V456" strokeDasharray="3 3" />
        <path className="cl-blueprint-sketch" style={{ animationDelay: "2.1s" }} d="M110,450 H290" markerStart="url(#cl-bp-arr)" markerEnd="url(#cl-bp-arr)" />
        <path className="cl-blueprint-sketch" style={{ animationDelay: "2.2s" }} d="M290,110 L300,120" strokeWidth="0.8" />
      </g>
      <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.2s" }} cx="318" cy="132" r="36" strokeWidth="1" />
      <g strokeWidth="1.1" filter="url(#cl-bp-chalk)">
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.3s" }} d="M308,148 L324,112" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.4s" }} d={star4(328, 106, 7)} strokeWidth="0.9" />
      </g>
      <g className="cl-blueprint-blink" style={{ animationDelay: "4.2s" }} fontFamily={MONO} fill={ink} stroke="none">
        <g className="cl-blueprint-sketch" style={{ animationDelay: "2.4s" }}>
          <text x="56" y="270" fontSize="10" textAnchor="middle" transform="rotate(-90 56 270)" letterSpacing="1">1.78</text>
          <text x="200" y="445" fontSize="8" textAnchor="middle" letterSpacing="1">1.20</text>
          <text x="318" y="182" fontSize="7" textAnchor="middle" letterSpacing="0.5">DETAIL A — WAND</text>
        </g>
      </g>
      <text x="56" y="340" fontFamily={HAND} fontSize="13" fill={ink} stroke="none" opacity="0.9" transform="rotate(-4 56 340)">as above, so below</text>
    </g>
  );
}

/** III — The Empress: star crown, heart shield with Venus glyph, wheat below. */
function empressScene(ink: string): ReactNode {
  return (
    <g fill="none" stroke={ink}>
      <path className="cl-blueprint-march-a" d="M200,60 V510" strokeOpacity="0.4" strokeWidth="0.7" strokeDasharray="14 4 2 4" />
      <circle className="cl-blueprint-march-b" style={{ animationDelay: "0.15s" }} cx="200" cy="270" r="185" strokeOpacity="0.3" strokeWidth="0.7" strokeDasharray="6 4" />
      <g strokeWidth="1.4" filter="url(#cl-bp-chalk)">
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.5s" }} d="M168,140 L178,112 L190,130 L200,104 L210,130 L222,112 L232,140" />
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.6s" }} cx="178" cy="106" r="3" strokeWidth="1" />
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.65s" }} cx="200" cy="98" r="3" strokeWidth="1" />
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.7s" }} cx="222" cy="106" r="3" strokeWidth="1" />
      </g>
      <circle className="cl-blueprint-glow" cx="200" cy="98" r="9" fill="#ffffff" opacity="0.3" />
      <g strokeWidth="1.6" filter="url(#cl-bp-chalk)">
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.75s" }} cx="200" cy="162" r="20" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.85s" }} d="M176,188 Q150,250 138,400 L262,400 Q250,250 224,188" />
        <path className="cl-blueprint-march-c" style={{ animationDelay: "0.95s" }} d="M164,260 H236" strokeWidth="0.8" strokeDasharray="4 3" strokeOpacity="0.7" />
      </g>
      <g strokeWidth="1.4" filter="url(#cl-bp-chalk)">
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.05s" }} d="M292,288 C292,276 311,276 311,291 C311,303 292,316 292,322 C292,316 273,303 273,291 C273,276 292,276 292,288 Z" />
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.15s" }} cx="292" cy="296" r="6" strokeWidth="1" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.2s" }} d="M292,302 V314 M286,308 H298" strokeWidth="1" />
      </g>
      <path className="cl-blueprint-sketch" style={{ animationDelay: "1.25s" }} d="M56,418 Q200,382 344,418" strokeWidth="0.8" strokeOpacity="0.6" />
      <g strokeWidth="1" filter="url(#cl-bp-chalk)">
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.3s" }} d="M140,490 V444 M132,458 L140,450 M148,458 L140,450 M132,472 L140,464 M148,472 L140,464" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.4s" }} d="M180,490 V444 M172,458 L180,450 M188,458 L180,450 M172,472 L180,464 M188,472 L180,464" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.5s" }} d="M220,490 V444 M212,458 L220,450 M228,458 L220,450 M212,472 L220,464 M228,472 L220,464" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.6s" }} d="M260,490 V444 M252,458 L260,450 M268,458 L260,450 M252,472 L260,464 M268,472 L260,464" />
      </g>
      <g strokeWidth="0.7" strokeOpacity="0.85">
        <path className="cl-blueprint-march-b" style={{ animationDelay: "1.9s" }} d="M190,98 H64 M142,400 H64" strokeDasharray="3 3" />
        <path className="cl-blueprint-sketch" style={{ animationDelay: "2s" }} d="M58,98 V400" markerStart="url(#cl-bp-arr)" markerEnd="url(#cl-bp-arr)" />
        <path className="cl-blueprint-sketch" style={{ animationDelay: "2.1s" }} d="M314,286 V172" strokeWidth="0.8" />
      </g>
      <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.2s" }} cx="316" cy="130" r="38" strokeWidth="1" />
      <g strokeWidth="1.1" filter="url(#cl-bp-chalk)">
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.3s" }} cx="316" cy="124" r="12" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.4s" }} d="M316,136 V152 M308,144 H324" />
      </g>
      <g className="cl-blueprint-blink" style={{ animationDelay: "4.2s" }} fontFamily={MONO} fill={ink} stroke="none">
        <g className="cl-blueprint-sketch" style={{ animationDelay: "2.4s" }}>
          <text x="50" y="249" fontSize="10" textAnchor="middle" transform="rotate(-90 50 249)" letterSpacing="1">1.68</text>
          <text x="316" y="184" fontSize="7" textAnchor="middle" letterSpacing="0.5">DETAIL A — VENUS</text>
        </g>
      </g>
      <text x="58" y="470" fontFamily={HAND} fontSize="13" fill={ink} stroke="none" opacity="0.9" transform="rotate(-3 58 470)">abundance, see note 3</text>
    </g>
  );
}

/** VII — The Chariot: starred canopy, boxy chariot, two sphinxes, city wall. */
function chariotScene(ink: string): ReactNode {
  return (
    <g fill="none" stroke={ink}>
      <path className="cl-blueprint-march-a" d="M200,70 V500" strokeOpacity="0.4" strokeWidth="0.7" strokeDasharray="14 4 2 4" />
      <path className="cl-blueprint-march-a" style={{ animationDelay: "0.15s" }} d="M60,300 H340" strokeOpacity="0.3" strokeWidth="0.6" strokeDasharray="14 4 2 4" />
      <circle className="cl-blueprint-march-b" style={{ animationDelay: "0.3s" }} cx="200" cy="290" r="190" strokeOpacity="0.3" strokeWidth="0.7" strokeDasharray="6 4" />
      <g strokeWidth="1.4" filter="url(#cl-bp-chalk)">
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.5s" }} d="M110,150 Q200,106 290,150 L290,170 L110,170 Z" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.6s" }} d={star4(150, 142, 7)} strokeWidth="0.9" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.65s" }} d={star4(200, 130, 8)} strokeWidth="0.9" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.7s" }} d={star4(250, 142, 7)} strokeWidth="0.9" />
      </g>
      <circle className="cl-blueprint-glow" cx="200" cy="130" r="9" fill="#ffffff" opacity="0.3" />
      <g strokeWidth="1.2" filter="url(#cl-bp-chalk)">
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.75s" }} d="M118,170 V234 M282,170 V234" />
        <polygon className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.8s" }} points="186,200 190,186 197,196 203,184 209,196 214,188 214,200" />
      </g>
      <g strokeWidth="1.5" filter="url(#cl-bp-chalk)">
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.85s" }} cx="200" cy="220" r="16" />
        <rect className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.9s" }} x="176" y="240" width="48" height="42" />
        <rect className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1s" }} x="120" y="282" width="160" height="88" strokeWidth="1.6" />
      </g>
      <path className="cl-blueprint-march-b" style={{ animationDelay: "1.1s" }} d="M120,304 H280" strokeWidth="0.8" strokeDasharray="6 4" strokeOpacity="0.7" />
      <g strokeWidth="1.1" filter="url(#cl-bp-chalk)">
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.15s" }} d="M52,408 V392 H64 V400 H76 V392 H88 V408" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.2s" }} d="M312,408 V392 H324 V400 H336 V392 H348 V408" />
      </g>
      <g strokeWidth="1.4" filter="url(#cl-bp-chalk)">
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.25s" }} d="M96,462 q0,-26 22,-26 q14,0 14,14 l30,0 q10,0 10,10 l0,10 l-76,0 Z" />
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.3s" }} cx="108" cy="448" r="9" strokeWidth="1.1" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.35s" }} d="M304,462 q0,-26 -22,-26 q-14,0 -14,14 l-30,0 q-10,0 -10,10 l0,10 l76,0 Z" />
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.4s" }} cx="292" cy="448" r="9" strokeWidth="1.1" />
      </g>
      <path className="cl-blueprint-sketch" style={{ animationDelay: "1.45s" }} d="M48,486 H352" strokeWidth="1" strokeOpacity="0.8" />
      <g strokeWidth="0.7" strokeOpacity="0.85">
        <path className="cl-blueprint-march-b" style={{ animationDelay: "1.9s" }} d="M120,376 V392 M280,376 V392" strokeDasharray="3 3" />
        <path className="cl-blueprint-sketch" style={{ animationDelay: "2s" }} d="M120,386 H280" markerStart="url(#cl-bp-arr)" markerEnd="url(#cl-bp-arr)" />
        <path className="cl-blueprint-sketch" style={{ animationDelay: "2.1s" }} d="M124,138 L110,130" strokeWidth="0.8" />
      </g>
      <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.2s" }} cx="86" cy="120" r="36" strokeWidth="1" />
      <g strokeWidth="1.1" filter="url(#cl-bp-chalk)">
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.3s" }} d="M64,126 Q86,104 108,126 L108,136 L64,136 Z" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.4s" }} d={star4(86, 121, 6)} strokeWidth="0.9" />
      </g>
      <g className="cl-blueprint-blink" style={{ animationDelay: "4.2s" }} fontFamily={MONO} fill={ink} stroke="none">
        <g className="cl-blueprint-sketch" style={{ animationDelay: "2.4s" }}>
          <text x="200" y="381" fontSize="8" textAnchor="middle" letterSpacing="1">1.42</text>
          <text x="86" y="170" fontSize="7" textAnchor="middle" letterSpacing="0.5">DETAIL A — CANOPY</text>
        </g>
      </g>
      <text x="58" y="254" fontFamily={HAND} fontSize="13" fill={ink} stroke="none" opacity="0.9" transform="rotate(-4 58 254)">hold the line, see note 7</text>
    </g>
  );
}

/** X — Wheel of Fortune: spoked wheel, sphinx above, snake and creature. */
function wheelScene(ink: string): ReactNode {
  return (
    <g fill="none" stroke={ink}>
      <path className="cl-blueprint-march-a" d="M200,90 V450" strokeOpacity="0.4" strokeWidth="0.7" strokeDasharray="14 4 2 4" />
      <circle className="cl-blueprint-march-b" style={{ animationDelay: "0.15s" }} cx="200" cy="270" r="150" strokeOpacity="0.35" strokeWidth="0.7" strokeDasharray="6 4" />
      <g filter="url(#cl-bp-chalk)">
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.5s" }} cx="200" cy="270" r="120" strokeWidth="1.8" />
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.6s" }} cx="200" cy="270" r="88" strokeWidth="1.2" />
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.7s" }} cx="200" cy="270" r="14" strokeWidth="1.5" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.8s" }} d="M200,150 V390 M80,270 H320 M115,185 L285,355 M285,185 L115,355" strokeWidth="1" />
      </g>
      <circle className="cl-blueprint-glow" cx="200" cy="270" r="10" fill="#ffffff" opacity="0.3" />
      <g strokeWidth="1" filter="url(#cl-bp-chalk)">
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.9s" }} cx="200" cy="166" r="5" />
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.95s" }} cx="200" cy="374" r="5" />
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1s" }} cx="96" cy="270" r="5" />
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.05s" }} cx="304" cy="270" r="5" />
      </g>
      <g strokeWidth="1.2" filter="url(#cl-bp-chalk)">
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.1s" }} d="M182,128 q0,-16 14,-16 q9,0 9,9 l18,0 q7,0 7,7 l0,7 l-48,0 Z" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.15s" }} d="M196,112 l4,-9 l4,9" strokeWidth="0.9" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.2s" }} d="M64,330 q-12,22 3,38 q13,12 5,32" strokeWidth="1.3" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.25s" }} d="M66,326 l-6,-8 M72,328 l2,-10" strokeWidth="0.9" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.3s" }} d="M336,400 q15,-12 10,-30 q-4,-15 9,-21" strokeWidth="1.3" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.35s" }} d="M352,346 l7,-11 l5,13" strokeWidth="0.9" />
      </g>
      <g strokeWidth="0.7" strokeOpacity="0.85">
        <path className="cl-blueprint-sketch" style={{ animationDelay: "2s" }} d="M200,270 L292,205" markerEnd="url(#cl-bp-arr)" />
        <path className="cl-blueprint-sketch" style={{ animationDelay: "2.1s" }} d="M188,262 L106,142" strokeWidth="0.8" />
      </g>
      <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.2s" }} cx="88" cy="112" r="36" strokeWidth="1" />
      <g strokeWidth="1.1" filter="url(#cl-bp-chalk)">
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.3s" }} cx="88" cy="112" r="10" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.4s" }} d="M88,98 V84 M88,126 V140 M74,112 H60 M102,112 H116" strokeWidth="0.8" />
      </g>
      <g className="cl-blueprint-blink" style={{ animationDelay: "4.2s" }} fontFamily={MONO} fill={ink} stroke="none">
        <g className="cl-blueprint-sketch" style={{ animationDelay: "2.4s" }}>
          <text x="252" y="228" fontSize="8" textAnchor="middle" letterSpacing="1">R1.20</text>
          <text x="88" y="162" fontSize="7" textAnchor="middle" letterSpacing="0.5">DETAIL A — HUB</text>
        </g>
      </g>
      <text x="210" y="490" fontFamily={HAND} fontSize="13" fill={ink} stroke="none" opacity="0.9" transform="rotate(-2 210 490)">the hub holds, see note 10</text>
    </g>
  );
}

/** XIII — Death: skeletal rider, rose banner, sun between two towers. */
function deathScene(ink: string): ReactNode {
  return (
    <g fill="none" stroke={ink}>
      <path className="cl-blueprint-march-a" d="M200,70 V500" strokeOpacity="0.4" strokeWidth="0.7" strokeDasharray="14 4 2 4" />
      <circle className="cl-blueprint-march-b" style={{ animationDelay: "0.15s" }} cx="200" cy="300" r="185" strokeOpacity="0.3" strokeWidth="0.7" strokeDasharray="6 4" />
      <g filter="url(#cl-bp-chalk)">
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.4s" }} d="M90,78 V404" strokeWidth="1.6" />
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.45s" }} cx="90" cy="72" r="4" strokeWidth="1" />
        <rect className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.5s" }} x="90" y="80" width="84" height="56" strokeWidth="1.4" fill={ink} fillOpacity="0.18" />
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.6s" }} cx="132" cy="108" r="12" strokeWidth="1" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.65s" }} d="M132,96 V120 M120,108 H144 M124,100 L140,116 M140,100 L124,116" strokeWidth="0.8" />
      </g>
      <circle className="cl-blueprint-glow" cx="132" cy="108" r="9" fill="#ffffff" opacity="0.3" />
      <g filter="url(#cl-bp-chalk)">
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.8s" }} d="M138,342 q-8,-52 30,-66 q44,-14 78,4 q24,14 18,44" strokeWidth="1.6" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.9s" }} d="M258,282 q26,-12 32,10 q4,16 -10,22 l-22,5" strokeWidth="1.4" />
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.95s" }} cx="282" cy="296" r="2" strokeWidth="1" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1s" }} d="M148,344 L140,462 M172,348 L166,462 M236,346 L232,462 M260,340 L266,462" strokeWidth="1.4" />
      </g>
      <g filter="url(#cl-bp-chalk)">
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.7s" }} cx="182" cy="182" r="15" strokeWidth="1.5" />
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.75s" }} cx="177" cy="179" r="2" strokeWidth="1" />
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.78s" }} cx="187" cy="179" r="2" strokeWidth="1" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.85s" }} d="M182,198 L186,252" strokeWidth="1.2" />
        <path className="cl-blueprint-march-c" style={{ animationDelay: "0.9s" }} d="M176,210 q8,6 16,0 M175,222 q9,6 18,0 M176,234 q8,6 16,0" strokeWidth="0.9" strokeDasharray="4 3" strokeOpacity="0.8" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.95s" }} d="M178,212 L96,200" strokeWidth="1.2" />
      </g>
      <g strokeWidth="1.3" filter="url(#cl-bp-chalk)">
        <rect className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.1s" }} x="286" y="428" width="20" height="62" />
        <rect className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.15s" }} x="338" y="428" width="20" height="62" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.2s" }} d="M308,490 a14,14 0 0 1 28,0" strokeWidth="1.2" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.25s" }} d="M322,470 V462 M312,476 L306,470 M332,476 L338,470" strokeWidth="0.9" />
      </g>
      <path className="cl-blueprint-sketch" style={{ animationDelay: "1.3s" }} d="M52,490 H368" strokeWidth="1" strokeOpacity="0.8" />
      <g strokeWidth="0.7" strokeOpacity="0.85">
        <path className="cl-blueprint-march-b" style={{ animationDelay: "1.9s" }} d="M90,78 H66 M90,404 H66" strokeDasharray="3 3" />
        <path className="cl-blueprint-sketch" style={{ animationDelay: "2s" }} d="M60,78 V404" markerStart="url(#cl-bp-arr)" markerEnd="url(#cl-bp-arr)" />
        <path className="cl-blueprint-sketch" style={{ animationDelay: "2.1s" }} d="M146,112 L272,126" strokeWidth="0.8" />
      </g>
      <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.2s" }} cx="306" cy="130" r="38" strokeWidth="1" />
      <g strokeWidth="1.1" filter="url(#cl-bp-chalk)">
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.3s" }} cx="306" cy="130" r="13" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.4s" }} d="M306,117 V143 M293,130 H319 M297,121 L315,139 M315,121 L297,139" strokeWidth="0.9" />
      </g>
      <g className="cl-blueprint-blink" style={{ animationDelay: "4.2s" }} fontFamily={MONO} fill={ink} stroke="none">
        <g className="cl-blueprint-sketch" style={{ animationDelay: "2.4s" }}>
          <text x="52" y="241" fontSize="10" textAnchor="middle" transform="rotate(-90 52 241)" letterSpacing="1">2.10</text>
          <text x="306" y="182" fontSize="7" textAnchor="middle" letterSpacing="0.5">DETAIL A — ROSE</text>
        </g>
      </g>
      <text x="56" y="472" fontFamily={HAND} fontSize="13" fill={ink} stroke="none" opacity="0.9" transform="rotate(-3 56 472)">all lines end, see note 13</text>
    </g>
  );
}

/** XVII — The Star: kneeling figure with two jugs beneath eight stars. */
function starScene(ink: string): ReactNode {
  const small: [number, number][] = [[84, 84], [116, 46], [284, 46], [316, 84], [66, 158], [334, 158], [200, 186]];
  return (
    <g fill="none" stroke={ink}>
      <path className="cl-blueprint-march-a" d="M200,60 V500" strokeOpacity="0.4" strokeWidth="0.7" strokeDasharray="14 4 2 4" />
      <circle className="cl-blueprint-march-a" style={{ animationDelay: "0.15s" }} cx="200" cy="110" r="72" strokeOpacity="0.4" strokeWidth="0.6" strokeDasharray="5 3" />
      <g strokeWidth="1.4" filter="url(#cl-bp-chalk)">
        <polygon className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.4s" }} points="170,80 230,80 230,140 170,140" />
        <polygon className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.5s" }} points="200,72 238,110 200,148 162,110" />
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.55s" }} cx="200" cy="110" r="6" strokeWidth="1" />
      </g>
      <circle className="cl-blueprint-glow" cx="200" cy="110" r="12" fill="#ffffff" opacity="0.3" />
      <g strokeWidth="0.9" filter="url(#cl-bp-chalk)">
        {small.map(([x, y], i) => (
          <path key={i} className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: `${0.6 + i * 0.05}s` }} d={star4(x, y, 8)} />
        ))}
      </g>
      <g filter="url(#cl-bp-chalk)">
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.8s" }} cx="185" cy="262" r="16" strokeWidth="1.5" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.9s" }} d="M177,280 Q162,312 170,342 L212,346 Q218,314 202,284" strokeWidth="1.5" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1s" }} d="M170,344 L136,372 L180,372" strokeWidth="1.4" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.05s" }} d="M206,346 L238,374" strokeWidth="1.4" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.1s" }} d="M176,294 L142,308" strokeWidth="1.2" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.15s" }} d="M130,300 a9,9 0 0 0 16,6 l-4,-14 Z" strokeWidth="1.1" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.2s" }} d="M202,298 L234,318" strokeWidth="1.2" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.25s" }} d="M240,312 a9,9 0 0 1 4,16 l-14,-4 Z" strokeWidth="1.1" />
      </g>
      <path className="cl-blueprint-march-c" style={{ animationDelay: "1.3s" }} d="M134,314 q-6,26 -2,48" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.8" />
      <path className="cl-blueprint-march-c" style={{ animationDelay: "1.35s" }} d="M242,328 q4,24 0,44" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.8" />
      <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.4s" }} d="M96,384 a16,16 0 0 1 32,0" strokeWidth="1.1" filter="url(#cl-bp-chalk)" />
      <path className="cl-blueprint-sketch" style={{ animationDelay: "1.45s" }} d="M216,420 q14,-10 28,0 q14,10 28,0 q14,-10 28,0" strokeWidth="1" strokeOpacity="0.8" />
      <path className="cl-blueprint-sketch" style={{ animationDelay: "1.5s" }} d="M224,442 q14,-10 28,0 q14,10 28,0 q14,-10 28,0" strokeWidth="1" strokeOpacity="0.8" />
      <g strokeWidth="0.7" strokeOpacity="0.85">
        <path className="cl-blueprint-sketch" style={{ animationDelay: "2s" }} d="M252,72 V148" markerStart="url(#cl-bp-arr)" markerEnd="url(#cl-bp-arr)" />
        <path className="cl-blueprint-sketch" style={{ animationDelay: "2.1s" }} d="M138,304 L96,242" strokeWidth="0.8" />
      </g>
      <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.2s" }} cx="88" cy="220" r="36" strokeWidth="1" />
      <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.3s" }} d="M76,214 a12,12 0 0 0 22,8 l-5,-20 Z" strokeWidth="1.1" filter="url(#cl-bp-chalk)" />
      <g className="cl-blueprint-blink" style={{ animationDelay: "4.2s" }} fontFamily={MONO} fill={ink} stroke="none">
        <g className="cl-blueprint-sketch" style={{ animationDelay: "2.4s" }}>
          <text x="260" y="110" fontSize="8" textAnchor="middle" transform="rotate(-90 260 110)" letterSpacing="1">Ø0.50</text>
          <text x="88" y="270" fontSize="7" textAnchor="middle" letterSpacing="0.5">DETAIL A — JUG</text>
        </g>
      </g>
      <text x="64" y="470" fontFamily={HAND} fontSize="13" fill={ink} stroke="none" opacity="0.9" transform="rotate(-3 64 470)">pour slowly, see note 17</text>
    </g>
  );
}

/** XXII — The Fool: stepping toward the cliff edge, dog at heels, sun behind. */
function foolScene(ink: string): ReactNode {
  return (
    <g fill="none" stroke={ink}>
      <path className="cl-blueprint-march-a" d="M200,60 V500" strokeOpacity="0.35" strokeWidth="0.7" strokeDasharray="14 4 2 4" />
      <circle className="cl-blueprint-march-b" style={{ animationDelay: "0.15s" }} cx="230" cy="280" r="175" strokeOpacity="0.3" strokeWidth="0.7" strokeDasharray="6 4" />
      <g strokeWidth="1.4" filter="url(#cl-bp-chalk)">
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.4s" }} cx="310" cy="100" r="26" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.5s" }} d="M310,64 V54 M310,136 V146 M274,100 H264 M346,100 H356 M285,75 L278,68 M335,75 L342,68 M285,125 L278,132 M335,125 L342,132" strokeWidth="1.1" />
      </g>
      <circle className="cl-blueprint-glow" cx="310" cy="100" r="14" fill="#ffffff" opacity="0.3" />
      <g strokeWidth="1.6" filter="url(#cl-bp-chalk)">
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.6s" }} d="M52,470 H268 V500 H340" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.65s" }} d="M276,478 l10,-6 M276,490 l10,-6" strokeWidth="0.7" strokeOpacity="0.7" />
      </g>
      <g filter="url(#cl-bp-chalk)">
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.7s" }} cx="224" cy="196" r="15" strokeWidth="1.5" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.75s" }} d="M236,192 l6,-3" strokeWidth="1" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.8s" }} d="M216,212 L206,302 L246,304 L238,212" strokeWidth="1.5" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.9s" }} d="M212,302 L194,368 M194,368 l-8,2" strokeWidth="1.4" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1s" }} d="M240,304 L276,356 M276,356 l9,-1" strokeWidth="1.4" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.1s" }} d="M218,222 L188,200 M188,200 L158,132" strokeWidth="1.2" />
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.2s" }} cx="152" cy="124" r="12" strokeWidth="1.2" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.25s" }} d="M144,116 L160,132 M160,116 L144,132" strokeWidth="0.8" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.15s" }} d="M238,224 L262,206" strokeWidth="1.2" />
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.2s" }} cx="266" cy="202" r="5" strokeWidth="1" />
      </g>
      <g strokeWidth="1.2" filter="url(#cl-bp-chalk)">
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.3s" }} d="M140,438 q-2,-20 12,-22 q9,-1 10,8 l0,12 q0,9 -7,9 l-11,0 q-6,0 -4,-7 Z" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.35s" }} d="M146,414 l-2,-9 l7,7" strokeWidth="0.9" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.4s" }} d="M140,424 q-8,-2 -10,-10" strokeWidth="0.9" />
      </g>
      <g strokeWidth="0.7" strokeOpacity="0.85">
        <path className="cl-blueprint-march-b" style={{ animationDelay: "1.9s" }} d="M268,470 H296 M268,500 H296" strokeDasharray="3 3" />
        <path className="cl-blueprint-sketch" style={{ animationDelay: "2s" }} d="M292,470 V500" markerStart="url(#cl-bp-arr)" markerEnd="url(#cl-bp-arr)" />
        <path className="cl-blueprint-sketch" style={{ animationDelay: "2.1s" }} d="M146,122 L102,128" strokeWidth="0.8" />
      </g>
      <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.2s" }} cx="92" cy="130" r="36" strokeWidth="1" />
      <g strokeWidth="1.1" filter="url(#cl-bp-chalk)">
        <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.3s" }} cx="92" cy="130" r="13" />
        <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.4s" }} d="M83,121 L101,139 M101,121 L83,139" strokeWidth="0.9" />
      </g>
      <g className="cl-blueprint-blink" style={{ animationDelay: "4.2s" }} fontFamily={MONO} fill={ink} stroke="none">
        <g className="cl-blueprint-sketch" style={{ animationDelay: "2.4s" }}>
          <text x="300" y="485" fontSize="8" textAnchor="middle" transform="rotate(-90 300 485)" letterSpacing="1">0.40</text>
          <text x="92" y="180" fontSize="7" textAnchor="middle" letterSpacing="0.5">DETAIL A — BUNDLE</text>
        </g>
      </g>
      <text x="60" y="320" fontFamily={HAND} fontSize="13" fill={ink} stroke="none" opacity="0.9" transform="rotate(-4 60 320)">mind the edge, see note 22</text>
    </g>
  );
}

const SCENES: Record<number, (ink: string) => ReactNode> = {
  1: magicianScene,
  3: empressScene,
  7: chariotScene,
  10: wheelScene,
  13: deathScene,
  17: starScene,
  22: foolScene,
};
