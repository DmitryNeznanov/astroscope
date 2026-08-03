/**
 * Card Lab — SINGLE LINE
 *
 * The Hermit (IX) rendered as a continuous one-line drawing: the entire
 * scene (staff, hooded figure, lantern, mountain) is a single unbroken
 * SVG path, dark ink on warm white paper. The stroke doubles back on
 * itself deliberately (staff, robe edges) the way continuous-line art
 * does. The only second element is the lantern light: a soft gold
 * radial glow. Gallery-minimal chrome: hairline frame, small serif IX,
 * letterspaced tiny caps.
 */
export default function SingleLineCard() {
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
      className="cl-sline"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
      aria-label="The Hermit tarot card drawn as one continuous line"
    >
      <style>{`
        /* signature effect: the single stroke draws itself on mount.
           Measured path length ~2452 units; dasharray 2500 covers it. */
        .cl-sline .cl-sline-ink {
          stroke-dasharray: 2500;
          stroke-dashoffset: 2500;
          animation: cl-sline-draw 3s ease-in-out forwards;
          transition: stroke 0.4s ease;
        }
        @keyframes cl-sline-draw {
          to { stroke-dashoffset: 0; }
        }
        /* lantern light fades in only after the stroke completes */
        .cl-sline .cl-sline-glowfade {
          opacity: 0;
          animation: cl-sline-glowin 0.9s ease 3.05s forwards;
        }
        @keyframes cl-sline-glowin {
          to { opacity: 1; }
        }
        .cl-sline .cl-sline-glow {
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
           60-unit gold dash; animating dashoffset through the full
           period (2460) carries it along the whole stroke. */
        .cl-sline .cl-sline-spark {
          opacity: 0;
          stroke-dasharray: 60 2400;
          stroke-dashoffset: 0;
          filter: drop-shadow(0 0 4px rgba(220, 171, 74, 0.9));
          animation: cl-sline-sparktravel 7s linear 3.05s infinite backwards;
        }
        @keyframes cl-sline-sparktravel {
          0% { stroke-dashoffset: 0; opacity: 0; }
          4% { opacity: 1; }
          96% { opacity: 1; }
          100% { stroke-dashoffset: -2460; opacity: 0; }
        }
        /* hover: ink deepens, lantern breathes */
        .cl-sline:hover .cl-sline-ink {
          stroke: #120e08;
        }
        .cl-sline:hover .cl-sline-glow {
          animation: cl-sline-breathe 2.2s ease-in-out infinite;
        }
        @keyframes cl-sline-breathe {
          0%, 100% { opacity: 0.75; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cl-sline .cl-sline-ink {
            animation: none;
            stroke-dasharray: none;
            stroke-dashoffset: 0;
          }
          .cl-sline .cl-sline-glowfade {
            animation: none;
            opacity: 1;
          }
          .cl-sline .cl-sline-glow,
          .cl-sline:hover .cl-sline-glow {
            animation: none;
          }
          .cl-sline .cl-sline-spark {
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
          <radialGradient id="cl-sline-gold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#dcab4a" stopOpacity="0.65" />
            <stop offset="45%" stopColor="#dcab4a" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#dcab4a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* warm white paper */}
        <rect x="0" y="0" width="400" height="600" fill="#faf5ec" />

        {/* hairline gallery frame */}
        <rect
          x="18"
          y="18"
          width="364"
          height="564"
          fill="none"
          stroke="#2b241c"
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
          fill="#2b241c"
        >
          IX
        </text>

        {/* the lantern light — the only second element on the card;
            fades in only after the stroke has finished drawing */}
        <g className="cl-sline-glowfade">
          <circle
            className="cl-sline-glow"
            cx="290"
            cy="192"
            r="46"
            fill="url(#cl-sline-gold)"
          />
        </g>

        {/* the entire scene as one unbroken ink stroke */}
        <path
          className="cl-sline-ink"
          d={d}
          fill="none"
          stroke="#2b241c"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.92"
        />

        {/* spark: a short gold segment of the same stroke that
            perpetually travels the drawn line after the draw-on */}
        <path
          className="cl-sline-spark"
          d={d}
          fill="none"
          stroke="#e3b95c"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          pointerEvents="none"
        />

        {/* title */}
        <text
          x="200"
          y="564"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="13"
          letterSpacing="7"
          fill="#2b241c"
        >
          THE HERMIT
        </text>
      </svg>
    </figure>
  );
}
