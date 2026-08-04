// GOLD MEDALLION — The Hermit (IX)
// A struck gold coin on deep black velvet: reeded edge, beaded raised rim,
// circular Latin inscription in raised caps ("EREMITA · LVCEM · FERT" with
// star stops), and the Hermit rendered in low numismatic relief — layered
// gold gradient shapes lit from the upper-left, no outlines. The lantern
// carries a tiny bright gleam. Load: the coin strikes (press scale 1.04→1
// with a bright flash sweeping the relief), legend fades in after. Ambient:
// a very slow gleam rotates across the relief, lantern gleam pulses gently.
// Server-component safe: no hooks, no client directive.

const CX = 150;
const CY = 196;
const COIN_R = 116;

const REEDS = Array.from({ length: 100 }, (_, i) => i * 3.6);
const BEADS = Array.from({ length: 64 }, (_, i) => {
  const a = (i * (360 / 64) * Math.PI) / 180;
  return { x: CX + 97 * Math.cos(a), y: CY + 97 * Math.sin(a) };
});

// Hermit silhouette — hood, shoulders, flared robe (low-relief mass).
const HERMIT_BODY =
  "M150 137 C163 141 170 153 169 168 C176 182 181 210 184 250 " +
  "C172 256 128 256 116 250 C119 210 124 182 131 168 C130 153 137 141 150 137 Z";
const STAFF = "M183 166 L179 256";
const GLEAM_STAR =
  "M0 -7 L1.6 -1.6 L7 0 L1.6 1.6 L0 7 L-1.6 1.6 L-7 0 L-1.6 -1.6 Z";

export default function GoldMedallionHermitCard() {
  return (
    <figure
      className="cz-medal-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
    >
      <style>{`
        .cz-medal-card { position: relative; overflow: hidden; background: #060504; }
        .cz-medal-card svg { display: block; width: 100%; height: 100%; }

        /* ---- load: the strike ---- */
        .cz-medal-strike {
          transform-box: fill-box;
          transform-origin: center;
          animation: cz-medal-press .8s cubic-bezier(.3,.9,.3,1) backwards;
        }
        .cz-medal-flash {
          animation: cz-medal-flash-sweep .8s ease-out .12s backwards;
        }
        .cz-medal-frame {
          stroke-dasharray: 1;
          animation: cz-medal-frame-draw 1.3s ease-out backwards;
        }
        .cz-medal-legend {
          animation: cz-medal-fade-in .7s ease-out .85s backwards;
        }
        @keyframes cz-medal-press {
          0%   { opacity: 0; transform: scale(1.06); }
          45%  { opacity: 1; transform: scale(1.04); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes cz-medal-flash-sweep {
          0%   { opacity: 0; transform: translateX(-190px); }
          25%  { opacity: .9; }
          100% { opacity: 0; transform: translateX(190px); }
        }
        @keyframes cz-medal-frame-draw {
          from { stroke-dashoffset: 1; opacity: .4; }
          to   { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes cz-medal-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ---- ambient ---- */
        .cz-medal-gleam {
          transform-box: view-box;
          transform-origin: 150px 196px;
          animation: cz-medal-gleam-rot 18s linear infinite;
        }
        .cz-medal-lantern {
          transform-box: fill-box;
          transform-origin: center;
          animation: cz-medal-lantern-pulse 15s ease-in-out infinite;
        }
        @keyframes cz-medal-gleam-rot {
          to { transform: rotate(360deg); }
        }
        @keyframes cz-medal-lantern-pulse {
          0%, 100% { opacity: .55; transform: scale(.85); }
          50%      { opacity: 1;   transform: scale(1.12); }
        }

        @media (prefers-reduced-motion: reduce) {
          .cz-medal-strike,
          .cz-medal-flash,
          .cz-medal-frame,
          .cz-medal-legend,
          .cz-medal-gleam,
          .cz-medal-lantern {
            animation: none;
          }
          .cz-medal-flash { opacity: 0; }
        }
      `}</style>

      <svg
        viewBox="0 0 300 450"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="The Hermit, gold medallion"
      >
        <defs>
          <radialGradient id="czm-velvet" cx="50%" cy="42%" r="75%">
            <stop offset="0%" stopColor="#1a1410" />
            <stop offset="55%" stopColor="#0d0a07" />
            <stop offset="100%" stopColor="#040302" />
          </radialGradient>
          <radialGradient id="czm-face" cx="38%" cy="32%" r="85%">
            <stop offset="0%" stopColor="#f7e08e" />
            <stop offset="45%" stopColor="#d9b64a" />
            <stop offset="80%" stopColor="#a67c1c" />
            <stop offset="100%" stopColor="#7c5a12" />
          </radialGradient>
          <linearGradient id="czm-relief" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fbeaa6" />
            <stop offset="50%" stopColor="#cfa62f" />
            <stop offset="100%" stopColor="#7c5a12" />
          </linearGradient>
          <linearGradient id="czm-rim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffecae" />
            <stop offset="55%" stopColor="#c9a227" />
            <stop offset="100%" stopColor="#6b4c10" />
          </linearGradient>
          <linearGradient id="czm-gleam-band" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#fff6d8" stopOpacity=".28" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="czm-flash-band" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#fffdf0" stopOpacity=".85" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id="czm-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <filter id="czm-soft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <clipPath id="czm-coin-clip">
            <circle cx={CX} cy={CY} r={104} />
          </clipPath>
          <path
            id="czm-text-circle"
            d="M 150 112 A 84 84 0 1 1 149.9 112"
            fill="none"
          />
        </defs>

        {/* velvet ground + grain */}
        <rect width="300" height="450" fill="url(#czm-velvet)" />
        <rect
          width="300"
          height="450"
          filter="url(#czm-grain)"
          opacity="0.05"
        />

        {/* hairline gold frame */}
        <rect
          className="cz-medal-frame"
          x="9"
          y="9"
          width="282"
          height="432"
          fill="none"
          stroke="#c9a227"
          strokeWidth="1"
          opacity=".7"
          pathLength={1}
        />
        <rect
          x="14"
          y="14"
          width="272"
          height="422"
          fill="none"
          stroke="#c9a227"
          strokeWidth=".5"
          opacity=".35"
        />

        {/* drop shadow under coin */}
        <ellipse
          cx={CX}
          cy={CY + 10}
          rx={COIN_R}
          ry={COIN_R - 4}
          fill="#000"
          opacity=".6"
          filter="url(#czm-soft)"
        />

        {/* ======================= THE COIN ======================= */}
        <g className="cz-medal-strike">
          {/* reeded edge */}
          <circle cx={CX} cy={CY} r={COIN_R} fill="#8a6418" />
          {REEDS.map((a) => (
            <rect
              key={a}
              x={CX - 0.6}
              y={CY - COIN_R}
              width="1.2"
              height="5"
              fill="#5e430d"
              transform={`rotate(${a} ${CX} ${CY})`}
            />
          ))}
          {/* struck face */}
          <circle cx={CX} cy={CY} r={110} fill="url(#czm-face)" />

          {/* raised rim: bright crest + inner recess shadow */}
          <circle
            cx={CX}
            cy={CY}
            r={104}
            fill="none"
            stroke="url(#czm-rim)"
            strokeWidth="3"
          />
          <circle
            cx={CX}
            cy={CY}
            r={101}
            fill="none"
            stroke="#6b4c10"
            strokeWidth="1.4"
            opacity=".8"
          />

          {/* beading */}
          {BEADS.map((b, i) => (
            <g key={i}>
              <circle cx={b.x + 0.4} cy={b.y + 0.6} r="1.3" fill="#6b4c10" />
              <circle cx={b.x} cy={b.y} r="1.3" fill="#efd27a" />
            </g>
          ))}

          {/* circular inscription, raised caps with star stops */}
          <text
            fontFamily="Georgia, 'Times New Roman', serif"
            fontSize="13"
            letterSpacing="7"
            fill="#5e430d"
            transform="translate(0.8 1.3)"
          >
            <textPath href="#czm-text-circle" startOffset="50%" textAnchor="middle">
              ★ EREMITA ★ LVCEM ★ FERT ★
            </textPath>
          </text>
          <text
            fontFamily="Georgia, 'Times New Roman', serif"
            fontSize="13"
            letterSpacing="7"
            fill="#f6dd8d"
          >
            <textPath href="#czm-text-circle" startOffset="50%" textAnchor="middle">
              ★ EREMITA ★ LVCEM ★ FERT ★
            </textPath>
          </text>

          {/* -------- the Hermit in low relief -------- */}
          {/* recess shadow copies (down-right) */}
          <path d={HERMIT_BODY} fill="#6b4c10" transform="translate(1.4 2)" />
          <path
            d={STAFF}
            stroke="#6b4c10"
            strokeWidth="3.4"
            strokeLinecap="round"
            fill="none"
            transform="translate(1.2 1.8)"
          />
          {/* raised masses */}
          <path d={HERMIT_BODY} fill="url(#czm-relief)" />
          <path
            d={STAFF}
            stroke="url(#czm-relief)"
            strokeWidth="3.4"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="183" cy="164" r="3" fill="#f1d47c" />
          {/* hood recess — face lost in shadow */}
          <ellipse cx="150" cy="170" rx="11" ry="9" fill="#4a330a" />
          <path
            d="M141 174 A 11 9 0 0 0 159 176"
            stroke="#8a6418"
            strokeWidth="1"
            fill="none"
            opacity=".7"
          />
          {/* robe fold highlights (light from upper-left) */}
          <path
            d="M136 178 C133 200 130 226 128 246"
            stroke="#f6dd8d"
            strokeWidth="1.1"
            fill="none"
            opacity=".55"
          />
          <path
            d="M147 180 C146 205 145 228 144 248"
            stroke="#f6dd8d"
            strokeWidth=".9"
            fill="none"
            opacity=".4"
          />

          {/* raised lantern, upper-left */}
          <g transform="translate(1 1.6)" fill="#6b4c10">
            <path d="M118 148 L131 148 L131 163 L118 163 Z" />
            <path d="M118 148 A 6.5 5 0 0 1 131 148 Z" />
          </g>
          <g>
            <path d="M118 148 L131 148 L131 163 L118 163 Z" fill="url(#czm-relief)" />
            <path d="M118 148 A 6.5 5 0 0 1 131 148 Z" fill="#f1d47c" />
            <circle cx="124.5" cy="144" r="2.2" fill="none" stroke="#e8c96a" strokeWidth="1.2" />
            <rect x="122" y="151" width="5" height="9" fill="#fff3c4" opacity=".85" />
          </g>

          {/* ambient gleam sweep, clipped to the field */}
          <g clipPath="url(#czm-coin-clip)">
            <g className="cz-medal-gleam">
              <rect
                x={CX - 18}
                y={CY - 160}
                width="36"
                height="320"
                fill="url(#czm-gleam-band)"
              />
            </g>
            {/* one-shot strike flash */}
            <rect
              className="cz-medal-flash"
              x={CX - 45}
              y={CY - 160}
              width="90"
              height="320"
              fill="url(#czm-flash-band)"
            />
          </g>

          {/* lantern gleam */}
          <g className="cz-medal-lantern" transform="translate(124.5 155.5)">
            <path d={GLEAM_STAR} fill="#fff8dd" />
          </g>
        </g>

        {/* ======================= legend below ======================= */}
        <g
          className="cz-medal-legend"
          fontFamily="Georgia, 'Times New Roman', serif"
          textAnchor="middle"
        >
          <text x="150" y="356" fontSize="15" letterSpacing="3" fill="#c9a227">
            IX
          </text>
          <text x="150" y="384" fontSize="17" letterSpacing="6" fill="#ecd27e">
            THE HERMIT
          </text>
          <text x="150" y="404" fontSize="9.5" letterSpacing="3" fill="#8f7a3a">
            avrum · mmxxvi
          </text>
        </g>
      </svg>
    </figure>
  );
}
