import { toRoman } from "@/lib/roman";

/**
 * Card Lab — SINGLE LINE
 *
 * The Hermit (IX) rendered as a continuous one-line drawing: the entire
 * scene (staff, hooded figure, lantern, mountain) is a single unbroken
 * SVG path, dark ink on warm white paper. The stroke doubles back on
 * itself deliberately (staff, robe edges) the way continuous-line art
 * does. The only second element is the lantern light: a soft gold
 * radial glow. Gallery-minimal chrome: hairline frame, small serif
 * numeral, letterspaced tiny caps.
 *
 * Reusable via optional props ({ number, name, variant }); called with
 * no props it renders the original Hermit card exactly. variant (0-7)
 * picks one of four ink/paper palettes, with variants 4-7 mirroring the
 * composition horizontally (a one-line drawing mirrors gracefully).
 */
export type SingleLineCardProps = {
  number?: number;
  name?: string;
  variant?: number;
};

type Palette = {
  ink: string;
  inkHover: string;
  paper: string;
  glow: string;
  spark: string;
};

const PALETTES: Palette[] = [
  // 0 — original: dark umber ink, warm white paper, gold light
  { ink: "#2b241c", inkHover: "#120e08", paper: "#faf5ec", glow: "#dcab4a", spark: "#e3b95c" },
  // 1 — sepia study: brown ink, aged paper, copper light
  { ink: "#4a3524", inkHover: "#2c1e11", paper: "#f6efe2", glow: "#c9893b", spark: "#dda452" },
  // 2 — blueprint-adjacent: blue-black ink, cool paper, amber light
  { ink: "#1f2733", inkHover: "#0c1119", paper: "#f3f4ef", glow: "#d9a441", spark: "#e7bd60" },
  // 3 — forest: deep green ink, pale moss paper, honey light
  { ink: "#243122", inkHover: "#101a0f", paper: "#f4f3e6", glow: "#cfa03f", spark: "#dfb354" },
];

export default function SingleLineCard({
  number = 9,
  name = "THE HERMIT",
  variant = 0,
}: SingleLineCardProps) {
  const v = ((Math.round(variant) % 8) + 8) % 8;
  const palette = PALETTES[v % 4];
  const mirrored = v >= 4;
  const scope = `cl-sline-v${v}`;
  const gradientId = `cl-sline-gold-${v}`;

  // Shrink the tiny-caps title for long arcana names so it always fits
  // inside the frame ("THE HERMIT" at 13px / 7px tracking is the base).
  const baseChars = 10;
  const titleScale = Math.min(1, baseChars / Math.max(name.length, 1));
  const titleSize = Math.max(8, 13 * titleScale);
  const titleTracking = Math.max(3.5, 7 * titleScale);

  // One unbroken stroke. Drawing order:
  //   staff cap loop → down staff → back up staff (sketchy double line)
  //   → left shoulder → hood (with a small inner face dip)
  //   → right arm → lantern handle → tight lantern cage loops
  //   → back along arm → right robe edge → wavy hem → left robe edge
  //   → inner robe fold down → left mountain ridge → ground line
  //   → right ridge rising back toward the figure.
  const d = [
    "M 124 206",
    "a 7 7 0 1 1 6 -8", // small loop capping the staff
    "C 121 290 118 380 117 466", // down the staff
    "C 122 380 126 292 132 220", // back up, slightly offset
    "C 142 236 156 246 169 251", // into the left shoulder
    "C 161 216 179 191 202 189", // hood, outer left up
    "C 214 200 215 216 206 227", // dip inside: face opening
    "C 218 215 228 224 231 251", // back out, hood right down
    "C 249 243 265 227 275 211", // right arm raised
    "C 281 192 284 172 290 166", // lantern handle up
    "C 297 173 299 183 296 191", // handle down to cage
    "a 14 14 0 1 1 -1 -1", // tight cage loop
    "a 9 9 0 1 1 -1 -1", // tighter inner loop
    "c 0 7 -3 11 -7 13", // small bottom knob
    "C 268 233 254 250 242 263", // back along the arm
    "C 255 333 259 412 250 477", // long confident right robe edge
    "C 219 487 188 487 157 477", // wavy hem
    "C 149 399 152 317 169 253", // long left robe edge, closing up
    "C 188 320 199 402 196 470", // inner robe fold flowing down
    "C 158 481 106 502 58 526", // mountain ridge, down to the left
    "C 140 519 250 519 344 527", // rolling ground line
    "C 300 505 258 491 224 482", // right ridge rising toward the hermit
  ].join(" ");

  return (
    <figure
      className={`cl-sline ${scope}`}
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
      aria-label={`${name} tarot card drawn as one continuous line`}
    >
      <style>{`
        /* signature effect: the single stroke draws itself on mount.
           Measured path length ~2452 units; dasharray 2500 covers it.
           Rules are scoped per-variant (${scope}) so several variants
           can share one gallery page without CSS collisions. */
        .${scope} .cl-sline-ink {
          stroke-dasharray: 2500;
          stroke-dashoffset: 2500;
          animation: cl-sline-draw 3s ease-in-out forwards;
          transition: stroke 0.4s ease;
        }
        @keyframes cl-sline-draw {
          to { stroke-dashoffset: 0; }
        }
        /* lantern light fades in only after the stroke completes */
        .${scope} .cl-sline-glowfade {
          opacity: 0;
          animation: cl-sline-glowin 0.9s ease 3.05s forwards;
        }
        @keyframes cl-sline-glowin {
          to { opacity: 1; }
        }
        .${scope} .cl-sline-glow {
          transform-box: fill-box;
          transform-origin: center;
          animation: cl-sline-flicker 7s ease-in-out infinite;
        }
        @keyframes cl-sline-flicker {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
        /* signature idle effect: a bright spark perpetually re-traces
           the drawn line. A second copy of the path shows only a short
           60-unit dash; animating dashoffset through the full period
           (2460) carries it along the whole stroke. */
        .${scope} .cl-sline-spark {
          opacity: 0;
          stroke-dasharray: 60 2400;
          stroke-dashoffset: 0;
          filter: drop-shadow(0 0 4px ${palette.spark});
          animation: cl-sline-sparktravel 7s linear 3.05s infinite backwards;
        }
        @keyframes cl-sline-sparktravel {
          0% { stroke-dashoffset: 0; opacity: 0; }
          4% { opacity: 1; }
          96% { opacity: 1; }
          100% { stroke-dashoffset: -2460; opacity: 0; }
        }
        /* hover: ink deepens, lantern breathes */
        .${scope}:hover .cl-sline-ink {
          stroke: ${palette.inkHover};
        }
        .${scope}:hover .cl-sline-glow {
          animation: cl-sline-breathe 2.2s ease-in-out infinite;
        }
        @keyframes cl-sline-breathe {
          0%, 100% { opacity: 0.75; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @media (prefers-reduced-motion: reduce) {
          .${scope} .cl-sline-ink {
            animation: none;
            stroke-dasharray: none;
            stroke-dashoffset: 0;
          }
          .${scope} .cl-sline-glowfade {
            animation: none;
            opacity: 1;
          }
          .${scope} .cl-sline-glow,
          .${scope}:hover .cl-sline-glow {
            animation: none;
          }
          .${scope} .cl-sline-spark {
            animation: none;
            opacity: 0;
          }
        }
      `}</style>
      <svg
        viewBox="0 0 400 600"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-hidden="true"
        style={{ display: "block", width: "100%", height: "100%" }}
      >
        <defs>
          <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={palette.glow} stopOpacity="0.65" />
            <stop offset="45%" stopColor={palette.glow} stopOpacity="0.28" />
            <stop offset="100%" stopColor={palette.glow} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* paper */}
        <rect x="0" y="0" width="400" height="600" fill={palette.paper} />

        {/* hairline gallery frame */}
        <rect
          x="18"
          y="18"
          width="364"
          height="564"
          fill="none"
          stroke={palette.ink}
          strokeWidth="1"
          opacity="0.8"
        />

        {/* numeral */}
        <text
          x="200"
          y="54"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="21"
          letterSpacing="4"
          fill={palette.ink}
        >
          {toRoman(number)}
        </text>

        {/* artwork — mirrored horizontally for variants 4-7 */}
        <g transform={mirrored ? "translate(400 0) scale(-1 1)" : undefined}>
          {/* the lantern light — the only second element on the card;
              fades in only after the stroke has finished drawing */}
          <g className="cl-sline-glowfade">
            <circle
              className="cl-sline-glow"
              cx="290"
              cy="192"
              r="46"
              fill={`url(#${gradientId})`}
            />
          </g>

          {/* the entire scene as one unbroken ink stroke */}
          <path
            className="cl-sline-ink"
            d={d}
            fill="none"
            stroke={palette.ink}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.92"
          />

          {/* spark: a short bright segment of the same stroke that
              perpetually travels the drawn line after the draw-on */}
          <path
            className="cl-sline-spark"
            d={d}
            fill="none"
            stroke={palette.spark}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            pointerEvents="none"
          />
        </g>

        {/* title */}
        <text
          x="200"
          y="564"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize={titleSize}
          letterSpacing={titleTracking}
          fill={palette.ink}
        >
          {name}
        </text>
      </svg>
    </figure>
  );
}
