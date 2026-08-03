/**
 * Card Lab — PAPERCUT
 * Layered paper-cut shadow box (papercraft diorama) take on the Major Arcana.
 * Six stacked card-stock silhouettes inside a recessed shadow-box frame:
 * dusk sky gradient, far mountains, mid hills, near hill, the hermit with a
 * warm cream lantern cut-out, and a grassy foreground. Every layer casts a
 * soft ~25% black drop-shadow onto the layer below; edges are slightly
 * irregular to read as hand-cut.
 * Signature effects (CSS-only):
 *  - hover: exploded shadow box — layers separate vertically, deepest moving
 *    most, shadows growing as layers lift;
 *  - idle: each layer floats on its own tiny infinite translateY loop so the
 *    diorama breathes; the crescent moon drifts slowly across the sky;
 *  - lantern halo flickers like a candle (irregular keyframes);
 *  - on mount: one-shot settle-in — layers drop into the box, back to front.
 * Idle transforms live on nested wrapper groups (cl-papercut-f*) so they never
 * fight the hover/settle transforms on the layer groups (cl-papercut-l*).
 * Chrome: roman numeral on a hanging paper tag, card name on a torn strip.
 * variant 0-7: four craft-paper palettes, the upper four mirrored.
 * Server-component safe: no hooks, no client code.
 */

import { toRoman } from "@/lib/roman";

const CREAM = "#f5e8cf";
const SERIF = "Georgia, 'Times New Roman', 'Liberation Serif', serif";

interface PapercutPalette {
  skyTop: string;
  skyMid: string;
  skyBottom: string;
  mountains: string;
  midHills: string;
  nearHill: string;
  hermit: string;
  foreground: string;
  frame: string;
  frameStroke: string;
  groove: string;
  recess: string;
  glow: string;
}

/** Craft-paper schemes; index 0 is the original dusk card. */
const PALETTES: PapercutPalette[] = [
  {
    // 0 — dusk (original): plum-to-peach sky, navy figure
    skyTop: "#7c4a68", skyMid: "#c97e6d", skyBottom: "#f4bd8e",
    mountains: "#7a4a66", midHills: "#c06a47", nearHill: "#472b4d",
    hermit: "#222c4b", foreground: "#1c2540",
    frame: "#c99a6b", frameStroke: "#a87b4f", groove: "#8a6242",
    recess: "#33203a", glow: "#ffd9a0",
  },
  {
    // 1 — morning: teal-to-sand sky, sea-green ranges, slate figure
    skyTop: "#2e5f6b", skyMid: "#7fb3a0", skyBottom: "#f2e3b3",
    mountains: "#3f7a70", midHills: "#d9a05b", nearHill: "#2c4a52",
    hermit: "#1f2f3a", foreground: "#17242c",
    frame: "#c9b184", frameStroke: "#a8916a", groove: "#8a744f",
    recess: "#1d3038", glow: "#ffe9b0",
  },
  {
    // 2 — rose dawn: mauve-to-apricot sky, rust hills, aubergine figure
    skyTop: "#5b3a5e", skyMid: "#c96f8a", skyBottom: "#f7d9b0",
    mountains: "#6e4468", midHills: "#d98a5f", nearHill: "#3f2545",
    hermit: "#2b1f3d", foreground: "#211830",
    frame: "#d0a37a", frameStroke: "#ad8560", groove: "#8f6a48",
    recess: "#2e1c33", glow: "#ffd0a0",
  },
  {
    // 3 — night: indigo-to-ember sky, deep blue ranges, near-black figure
    skyTop: "#1c2340", skyMid: "#4a4a72", skyBottom: "#c98d6b",
    mountains: "#2c3352", midHills: "#a06244", nearHill: "#241f3d",
    hermit: "#141b30", foreground: "#0f1524",
    frame: "#b08a5f", frameStroke: "#93714c", groove: "#77593a",
    recess: "#141a2e", glow: "#ffdf9e",
  },
];

export interface PapercutCardProps {
  /** Major Arcana number 1-22; rendered as a roman numeral on the tag. */
  number?: number;
  /** Card name on the torn strip; long names are compressed to fit. */
  name?: string;
  /** 0-7: palette index (0-3), plus 4 to mirror the composition. */
  variant?: number;
}

export default function PapercutCard({
  number = 9,
  name = "THE HERMIT",
  variant = 0,
}: PapercutCardProps) {
  const v = Math.max(0, Math.min(7, Math.floor(variant)));
  const pal = PALETTES[v % 4];
  const mirrored = v >= 4;

  // Numeral tag: widen the tag and shrink the type for longer numerals,
  // keeping the exact original geometry for the default "IX".
  const numeral = toRoman(number);
  const tagFontSize = numeral.length <= 2 ? 19 : numeral.length <= 3 ? 16 : 13;
  const tagWidth = numeral.length <= 2 ? 46 : numeral.length * 12 + 12;

  // Torn strip: compress over-long names with textLength so they stay inside.
  const stripFontSize = 14;
  const stripLetterSpacing = 4;
  const estimatedNameWidth = name.length * (stripFontSize * 0.6 + stripLetterSpacing);
  const stripTextWidth = 240;
  const nameCompressed = estimatedNameWidth > stripTextWidth;

  return (
    <figure
      className="cl-papercut-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
    >
      <style>{`
        .cl-papercut-card { line-height: 0; }

        /* ---- Paper layers: base drop-shadow + hover/settle transitions ---- */
        .cl-papercut-l1, .cl-papercut-l2, .cl-papercut-l3,
        .cl-papercut-l4, .cl-papercut-l5, .cl-papercut-l6,
        .cl-papercut-tag, .cl-papercut-strip {
          transition: transform 0.5s cubic-bezier(0.22, 0.9, 0.3, 1.1),
                      filter 0.5s ease;
        }
        .cl-papercut-l2, .cl-papercut-l3, .cl-papercut-l4,
        .cl-papercut-l5, .cl-papercut-l6,
        .cl-papercut-tag, .cl-papercut-strip {
          filter: drop-shadow(0 3px 2px rgba(0, 0, 0, 0.25));
        }

        /* ---- Hover: exploded shadow box, deepest layers move most ---- */
        .cl-papercut-card:hover .cl-papercut-l1 { transform: translateY(14px); }
        .cl-papercut-card:hover .cl-papercut-l2 { transform: translateY(9.5px); }
        .cl-papercut-card:hover .cl-papercut-l3 { transform: translateY(5.5px); }
        .cl-papercut-card:hover .cl-papercut-l4 { transform: translateY(1.5px); }
        .cl-papercut-card:hover .cl-papercut-l5 { transform: translateY(-2.5px); }
        .cl-papercut-card:hover .cl-papercut-l6 { transform: translateY(-6px); }
        .cl-papercut-card:hover .cl-papercut-tag { transform: translateY(-4px); }
        .cl-papercut-card:hover .cl-papercut-strip { transform: translateY(4px); }
        /* Shadows grow as the layers lift apart. */
        .cl-papercut-card:hover .cl-papercut-l2,
        .cl-papercut-card:hover .cl-papercut-l3,
        .cl-papercut-card:hover .cl-papercut-l4,
        .cl-papercut-card:hover .cl-papercut-l5,
        .cl-papercut-card:hover .cl-papercut-l6,
        .cl-papercut-card:hover .cl-papercut-tag,
        .cl-papercut-card:hover .cl-papercut-strip {
          filter: drop-shadow(0 8px 7px rgba(0, 0, 0, 0.32));
        }

        /* ---- Mount: one-shot settle-in, back layer lands first ---- */
        .cl-papercut-l1, .cl-papercut-l2, .cl-papercut-l3,
        .cl-papercut-l4, .cl-papercut-l5, .cl-papercut-l6,
        .cl-papercut-tag, .cl-papercut-strip {
          animation: cl-papercut-settle 0.35s cubic-bezier(0.3, 1.25, 0.5, 1) backwards;
        }
        .cl-papercut-l1 { --cl-papercut-drop: -16px; animation-delay: 0s; }
        .cl-papercut-l2 { --cl-papercut-drop: -14px; animation-delay: 0.035s; }
        .cl-papercut-l3 { --cl-papercut-drop: -12px; animation-delay: 0.07s; }
        .cl-papercut-l4 { --cl-papercut-drop: -10px; animation-delay: 0.105s; }
        .cl-papercut-l5 { --cl-papercut-drop: -9px;  animation-delay: 0.14s; }
        .cl-papercut-l6 { --cl-papercut-drop: -8px;  animation-delay: 0.175s; }
        .cl-papercut-tag { --cl-papercut-drop: -12px; animation-delay: 0.21s; }
        .cl-papercut-strip { --cl-papercut-drop: 12px; animation-delay: 0.25s; }
        @keyframes cl-papercut-settle {
          from { transform: translateY(var(--cl-papercut-drop, -10px)); }
          to { transform: translateY(0); }
        }

        /* ---- Idle: layers breathe on independent infinite float loops ----
           Front layers float a touch more than back ones (parallax depth);
           negative delays desynchronise the loops from first paint. */
        .cl-papercut-f1, .cl-papercut-f2, .cl-papercut-f3,
        .cl-papercut-f4, .cl-papercut-f5, .cl-papercut-f6 {
          animation: cl-papercut-breathe 6s ease-in-out infinite alternate;
        }
        .cl-papercut-f1 { --cl-papercut-float: 1px;   animation-duration: 7s;   animation-delay: -2.1s; }
        .cl-papercut-f2 { --cl-papercut-float: 1.4px; animation-duration: 6.4s; animation-delay: -4.5s; }
        .cl-papercut-f3 { --cl-papercut-float: 1.8px; animation-duration: 5.7s; animation-delay: -1.2s; }
        .cl-papercut-f4 { --cl-papercut-float: 2.2px; animation-duration: 5.1s; animation-delay: -3.4s; }
        .cl-papercut-f5 { --cl-papercut-float: 2.6px; animation-duration: 4.5s; animation-delay: -0.7s; }
        .cl-papercut-f6 { --cl-papercut-float: 3px;   animation-duration: 4s;   animation-delay: -2.8s; }
        @keyframes cl-papercut-breathe {
          from { transform: translateY(0); }
          to { transform: translateY(var(--cl-papercut-float, 2px)); }
        }

        /* ---- Idle: crescent moon drifts slowly across the sky ---- */
        .cl-papercut-moon {
          animation: cl-papercut-moon-drift 38s ease-in-out infinite alternate;
        }
        @keyframes cl-papercut-moon-drift {
          from { transform: translateX(-14px); }
          to { transform: translateX(16px); }
        }

        /* ---- Lantern halo: irregular candle flicker, not a sine wave ---- */
        .cl-papercut-glow {
          transform-box: fill-box;
          transform-origin: center;
          animation: cl-papercut-flicker 2.7s linear infinite;
        }
        @keyframes cl-papercut-flicker {
          0%   { opacity: 0.55; transform: scale(1); }
          6%   { opacity: 0.82; transform: scale(1.06); }
          11%  { opacity: 0.48; transform: scale(0.98); }
          19%  { opacity: 0.9;  transform: scale(1.1); }
          27%  { opacity: 0.6;  transform: scale(1.01); }
          36%  { opacity: 0.86; transform: scale(1.08); }
          44%  { opacity: 0.52; transform: scale(0.99); }
          55%  { opacity: 0.94; transform: scale(1.11); }
          63%  { opacity: 0.58; transform: scale(1); }
          74%  { opacity: 0.8;  transform: scale(1.05); }
          83%  { opacity: 0.5;  transform: scale(0.97); }
          92%  { opacity: 0.76; transform: scale(1.04); }
          100% { opacity: 0.55; transform: scale(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .cl-papercut-l1, .cl-papercut-l2, .cl-papercut-l3,
          .cl-papercut-l4, .cl-papercut-l5, .cl-papercut-l6,
          .cl-papercut-tag, .cl-papercut-strip {
            animation: none;
            transition: none;
          }
          .cl-papercut-f1, .cl-papercut-f2, .cl-papercut-f3,
          .cl-papercut-f4, .cl-papercut-f5, .cl-papercut-f6,
          .cl-papercut-moon {
            animation: none;
          }
          .cl-papercut-card:hover .cl-papercut-l1,
          .cl-papercut-card:hover .cl-papercut-l2,
          .cl-papercut-card:hover .cl-papercut-l3,
          .cl-papercut-card:hover .cl-papercut-l4,
          .cl-papercut-card:hover .cl-papercut-l5,
          .cl-papercut-card:hover .cl-papercut-l6,
          .cl-papercut-card:hover .cl-papercut-tag,
          .cl-papercut-card:hover .cl-papercut-strip {
            transform: none;
          }
          .cl-papercut-glow { animation: none; opacity: 0.65; }
        }
      `}</style>
      <svg
        viewBox="0 0 400 600"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`${name} tarot card rendered as a layered paper-cut shadow box`}
      >
        <defs>
          {/* Sky: gradient, darker overhead fading warm at the horizon. */}
          <linearGradient id="cl-papercut-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={pal.skyTop} />
            <stop offset="0.45" stopColor={pal.skyMid} />
            <stop offset="1" stopColor={pal.skyBottom} />
          </linearGradient>
          {/* Recess shade: darkens the top of the window so it reads as inset. */}
          <linearGradient id="cl-papercut-recess" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000000" stopOpacity="0.5" />
            <stop offset="1" stopColor="#000000" stopOpacity="0" />
          </linearGradient>
          <clipPath id="cl-papercut-window">
            <rect x="20" y="20" width="360" height="560" rx="6" />
          </clipPath>
          {/* Crescent moon: cream disc with an offset disc knocked out. */}
          <mask id="cl-papercut-moon">
            <circle cx="300" cy="96" r="16" fill="#ffffff" />
            <circle cx="307" cy="91" r="14" fill="#000000" />
          </mask>
        </defs>

        {/* Shadow-box frame: kraft card front with a routed inner groove. */}
        <rect x="0" y="0" width="400" height="600" rx="10" fill={pal.frame} />
        <rect x="0" y="0" width="400" height="600" rx="10" fill="none" stroke={pal.frameStroke} strokeWidth="2" />
        <rect x="14" y="14" width="372" height="572" rx="9" fill="none" stroke={pal.groove} strokeWidth="3" />
        <rect x="20" y="20" width="360" height="560" rx="6" fill={pal.recess} />

        {/* === Layers, clipped to the recessed window (mirrored on variants 4-7) === */}
        <g transform={mirrored ? "translate(400 0) scale(-1 1)" : undefined}>
          <g clipPath="url(#cl-papercut-window)">
            {/* Layer 1 — sky */}
            <g className="cl-papercut-l1">
              <g className="cl-papercut-f1">
                <rect x="20" y="20" width="360" height="560" fill="url(#cl-papercut-sky)" />
                <circle cx="80" cy="70" r="2" fill={CREAM} opacity="0.9" />
                <circle cx="130" cy="122" r="1.6" fill={CREAM} opacity="0.8" />
                <circle cx="250" cy="58" r="1.5" fill={CREAM} opacity="0.85" />
                <circle cx="332" cy="152" r="1.8" fill={CREAM} opacity="0.8" />
                <circle cx="62" cy="164" r="1.4" fill={CREAM} opacity="0.75" />
                <path
                  d="M 348 132 L 350 137 L 355 139 L 350 141 L 348 146 L 346 141 L 341 139 L 346 137 Z"
                  fill={CREAM}
                  opacity="0.9"
                />
                <g className="cl-papercut-moon">
                  <circle cx="300" cy="96" r="16" fill={CREAM} mask="url(#cl-papercut-moon)" />
                </g>
              </g>
            </g>

            {/* Layer 2 — far mountains */}
            <g className="cl-papercut-l2">
              <g className="cl-papercut-f2">
                <path
                  fill={pal.mountains}
                  d="M 20 580 L 20 332 L 68 244 L 94 270 L 140 212 L 176 257 L 226 196 L 259 251 L 302 216 L 338 263 L 380 232 L 380 580 Z"
                />
              </g>
            </g>

            {/* Layer 3 — mid hills */}
            <g className="cl-papercut-l3">
              <g className="cl-papercut-f3">
                <path
                  fill={pal.midHills}
                  d="M 20 580 L 20 424 C 58 398 92 394 122 406 C 152 416 172 382 202 374 C 236 366 262 390 300 398 C 332 405 358 394 380 402 L 380 580 Z"
                />
              </g>
            </g>

            {/* Layer 4 — near hill, crest carries the hermit */}
            <g className="cl-papercut-l4">
              <g className="cl-papercut-f4">
                <path
                  fill={pal.nearHill}
                  d="M 20 580 L 20 494 C 52 476 74 468 102 452 C 132 437 166 415 200 405 C 234 399 262 421 296 439 C 330 457 356 463 380 475 L 380 580 Z"
                />
              </g>
            </g>

            {/* Layer 5 — the hermit with cream lantern cut-out */}
            <g className="cl-papercut-l5">
              <g className="cl-papercut-f5">
                {/* Warm halo bleeding through the lantern cut-out (behind the figure) */}
                <circle className="cl-papercut-glow" cx="241" cy="321" r="27" fill={pal.glow} opacity="0.6" />
                {/* Staff in the left hand */}
                <line x1="176" y1="318" x2="168" y2="408" stroke={pal.hermit} strokeWidth="4" strokeLinecap="round" />
                {/* Hooded cloak silhouette, right arm raised */}
                <path
                  fill={pal.hermit}
                  d="M 197 292
                     C 189 294 184 301 182 309
                     L 178 328
                     C 174 352 171 378 170 403
                     L 232 403
                     C 231 386 230 370 228 354
                     L 227 341
                     L 244 315
                     L 237 308
                     L 220 329
                     C 219 318 215 304 207 296
                     L 203 283
                     Z"
                />
                {/* Lantern hanging from the raised hand */}
                <path
                  d="M 240 312 C 240 307 248 307 248 312"
                  fill="none"
                  stroke={pal.hermit}
                  strokeWidth="2.5"
                />
                <rect x="234" y="312" width="14" height="19" rx="2" fill={CREAM} />
                <rect x="233" y="310" width="16" height="3" rx="1.5" fill={pal.hermit} />
                {/* Star cut into the lantern paper */}
                <path d="M 241 316 L 243 321 L 241 327 L 239 321 Z" fill={pal.hermit} />
              </g>
            </g>

            {/* Layer 6 — foreground grass and rock */}
            <g className="cl-papercut-l6">
              <g className="cl-papercut-f6">
                <path
                  fill={pal.foreground}
                  d="M 20 580 L 20 522 L 28 508 L 34 520 L 44 504 L 52 520
                     C 90 508 120 518 155 510
                     C 190 502 215 508 245 516
                     C 262 520 276 505 296 501
                     C 320 497 336 512 350 516
                     L 358 506 L 364 518 L 372 508 L 380 518 L 380 580 Z"
                />
              </g>
            </g>

            {/* Recess shading: top gradient + inner edge darkening (not a layer) */}
            <rect x="20" y="20" width="360" height="80" fill="url(#cl-papercut-recess)" />
            <rect x="20" y="20" width="360" height="560" rx="6" fill="none" stroke="#000000" strokeOpacity="0.35" strokeWidth="3" />
          </g>
        </g>

        {/* Chrome — numeral on a small hanging paper tag */}
        <g className="cl-papercut-tag">
          <line x1="200" y1="22" x2="200" y2="38" stroke={pal.groove} strokeWidth="2" />
          <g transform={`rotate(${mirrored ? 2 : -2} 200 52)`}>
            <rect x={200 - tagWidth / 2} y="36" width={tagWidth} height="32" rx="3" fill={CREAM} />
            <circle cx="200" cy="42" r="2.2" fill={pal.frame} />
            <text
              x="200"
              y={tagFontSize <= 13 ? 60 : 62}
              textAnchor="middle"
              fontFamily={SERIF}
              fontSize={tagFontSize}
              letterSpacing={numeral.length <= 2 ? 2 : 1}
              fill={pal.hermit}
            >
              {numeral}
            </text>
          </g>
        </g>

        {/* Chrome — card name on a torn paper strip */}
        <g className="cl-papercut-strip">
          <polygon
            fill={CREAM}
            points="58,540 76,534 122,538 192,533 262,537 330,532 343,539 338,563 300,567 220,562 140,567 82,563 56,557"
          />
          <text
            x="200"
            y="554"
            textAnchor="middle"
            fontFamily={SERIF}
            fontSize={stripFontSize}
            letterSpacing={nameCompressed ? 1 : stripLetterSpacing}
            textLength={nameCompressed ? stripTextWidth : undefined}
            lengthAdjust={nameCompressed ? "spacingAndGlyphs" : undefined}
            fill={pal.hermit}
          >
            {name}
          </text>
        </g>
      </svg>
    </figure>
  );
}
