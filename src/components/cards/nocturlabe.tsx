// NOCTURLABE — The Hermit (IX)
// A nocturnal (star clock) instrument plate: dark navy-black lacquer, engraved
// silver with pale-gold highlights. Outer date ring with month abbreviations,
// hour-scale teeth on the rim, an inner rotating star dial carrying Ursa Major
// and Cassiopeia around a central Polaris (sighted through the center hole),
// and a long regula pointer arm for reading the hour by starlight. The Hermit
// stands small at the base, holding his lantern up to consult the dial.
// Server-component safe: no hooks, no client directive.

const CX = 150;
const CY = 190;
const R_OUT = 116;

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const HOUR_TEETH = Array.from({ length: 24 }, (_, i) => i * 15);
const MONTH_DIVIDERS = Array.from({ length: 12 }, (_, i) => i * 30 + 15);

// constellation figures, dial-local coordinates relative to Polaris (0,0)
const URSA: [number, number][] = [
  [-62, -14],
  [-60, 10],
  [-34, 14],
  [-32, -6],
  [-4, -16],
  [18, -24],
  [40, -28],
];
const URSA_LINES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [3, 4],
  [4, 5],
  [5, 6],
];
const CASSIOPEIA: [number, number][] = [
  [-14, 58],
  [2, 44],
  [20, 58],
  [38, 46],
  [54, 58],
];

// faint field stars engraved on the rotating dial (x, y offset, radius)
const FIELD_STARS: [number, number, number][] = [
  [-78, -52, 1.1],
  [-40, -62, 0.9],
  [12, -68, 1.2],
  [52, -58, 0.9],
  [74, -30, 1.1],
  [84, 8, 0.8],
  [-86, 18, 1.0],
  [-70, 44, 0.8],
  [-44, 66, 1.1],
  [66, 70, 0.9],
  [86, 40, 1.0],
  [-20, -84, 0.8],
  [34, -84, 1.0],
  [-88, -22, 0.9],
];

const SILVER = "#b9c6d8";
const SILVER_DIM = "#7e8ea6";
const SILVER_FAINT = "#55647c";
const GOLD = "#d9c084";
const GOLD_DEEP = "#a98f4e";
const BG_DEEP = "#070b17";

export default function NocturlabeHermitCard() {
  return (
    <figure
      className="cz-noct-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
    >
      <style>{`
        .cz-noct-card { position: relative; overflow: hidden; background: ${BG_DEEP}; }
        .cz-noct-card svg { display: block; width: 100%; height: 100%; }

        .cz-noct-frame {
          animation: cz-noct-fade 0.9s ease-out backwards;
        }
        .cz-noct-dial-load {
          transform-box: view-box;
          transform-origin: ${CX}px ${CY}px;
          animation: cz-noct-cal 1.5s cubic-bezier(.25,.85,.3,1) backwards;
        }
        .cz-noct-drift {
          transform-box: view-box;
          transform-origin: ${CX}px ${CY}px;
          animation: cz-noct-drift 150s linear infinite;
        }
        .cz-noct-arm {
          transform-box: view-box;
          transform-origin: ${CX}px ${CY}px;
          transform: rotate(-15deg);
          animation: cz-noct-arm-in 1.2s cubic-bezier(.3,.9,.3,1) .45s backwards;
        }
        .cz-noct-hermit {
          animation: cz-noct-fade 1s ease-out .9s backwards;
        }
        .cz-noct-polaris {
          transform-box: fill-box;
          transform-origin: center;
          animation: cz-noct-twinkle 6s ease-in-out infinite;
        }
        .cz-noct-glow {
          animation: cz-noct-glow-pulse 7s ease-in-out infinite;
        }

        @keyframes cz-noct-cal {
          from { opacity: 0.35; transform: rotate(-30deg); }
          to   { opacity: 1;    transform: rotate(0deg); }
        }
        @keyframes cz-noct-arm-in {
          from { opacity: 0; transform: rotate(-70deg); }
          to   { opacity: 1; transform: rotate(-15deg); }
        }
        @keyframes cz-noct-drift {
          to { transform: rotate(360deg); }
        }
        @keyframes cz-noct-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cz-noct-twinkle {
          0%, 100% { opacity: 1;    transform: scale(1); }
          50%      { opacity: 0.55; transform: scale(0.82); }
        }
        @keyframes cz-noct-glow-pulse {
          0%, 100% { opacity: 0.45; }
          50%      { opacity: 0.8; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cz-noct-frame,
          .cz-noct-dial-load,
          .cz-noct-drift,
          .cz-noct-arm,
          .cz-noct-hermit,
          .cz-noct-polaris,
          .cz-noct-glow {
            animation: none;
          }
        }
      `}</style>

      <svg
        viewBox="0 0 300 450"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="The Hermit, tarot card nine, engraved as a nocturnal star-clock instrument"
      >
        <defs>
          <radialGradient id="cz-noct-bg" cx="50%" cy="40%" r="80%">
            <stop offset="0%" stopColor="#101a30" />
            <stop offset="60%" stopColor="#0b1224" />
            <stop offset="100%" stopColor={BG_DEEP} />
          </radialGradient>
          <radialGradient id="cz-noct-face" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#0e1830" />
            <stop offset="80%" stopColor="#0a1122" />
            <stop offset="100%" stopColor="#080d1b" />
          </radialGradient>
          <radialGradient id="cz-noct-lantern-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f4e3ae" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#e3c87e" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#e3c87e" stopOpacity="0" />
          </radialGradient>
          {/* engraved four-point corner star */}
          <g id="cz-noct-corner-star">
            <path d="M 0 -6 L 1.4 -1.4 L 6 0 L 1.4 1.4 L 0 6 L -1.4 1.4 L -6 0 L -1.4 -1.4 Z" fill={GOLD} />
            <circle cx="0" cy="0" r="0.9" fill="#f4e3ae" />
          </g>
        </defs>

        {/* night lacquer ground */}
        <rect x="0" y="0" width="300" height="450" fill="url(#cz-noct-bg)" />

        {/* faint static stars in the margins */}
        <g fill={SILVER_FAINT}>
          <circle cx="38" cy="96" r="1" />
          <circle cx="262" cy="72" r="1.2" />
          <circle cx="272" cy="268" r="0.9" />
          <circle cx="30" cy="240" r="1.1" />
          <circle cx="52" cy="392" r="0.9" />
          <circle cx="250" cy="388" r="1" />
          <circle cx="44" cy="180" r="0.8" />
          <circle cx="258" cy="160" r="0.8" />
        </g>

        {/* engraved frame: double silver rules + corner stars */}
        <g className="cz-noct-frame">
          <rect x="10" y="10" width="280" height="430" fill="none" stroke={SILVER} strokeWidth="1.2" opacity="0.8" />
          <rect x="15" y="15" width="270" height="420" fill="none" stroke={SILVER_DIM} strokeWidth="0.5" opacity="0.6" />
          <use href="#cz-noct-corner-star" x="26" y="26" />
          <use href="#cz-noct-corner-star" x="274" y="26" />
          <use href="#cz-noct-corner-star" x="26" y="424" />
          <use href="#cz-noct-corner-star" x="274" y="424" />
        </g>

        {/* ==================== the instrument ==================== */}
        {/* dial face */}
        <circle cx={CX} cy={CY} r={R_OUT} fill="url(#cz-noct-face)" stroke={SILVER} strokeWidth="1.6" />
        <circle cx={CX} cy={CY} r={R_OUT - 4} fill="none" stroke={SILVER_FAINT} strokeWidth="0.5" opacity="0.7" />

        {/* hour-scale teeth around the rim */}
        {HOUR_TEETH.map((a) => {
          const major = a % 90 === 0;
          return (
            <g key={a} transform={`rotate(${a} ${CX} ${CY})`}>
              <line
                x1={CX}
                y1={CY - R_OUT}
                x2={CX}
                y2={CY - R_OUT - (major ? 7 : 4)}
                stroke={major ? GOLD : SILVER_DIM}
                strokeWidth={major ? 1.5 : 0.7}
              />
            </g>
          );
        })}

        {/* outer date ring */}
        <circle cx={CX} cy={CY} r="100" fill="none" stroke={SILVER_DIM} strokeWidth="0.8" />
        {MONTH_DIVIDERS.map((a) => (
          <g key={a} transform={`rotate(${a} ${CX} ${CY})`}>
            <line x1={CX} y1={CY - 100} x2={CX} y2={CY - 116} stroke={SILVER_FAINT} strokeWidth="0.6" />
          </g>
        ))}
        {MONTHS.map((m, i) => (
          <g key={m} transform={`rotate(${i * 30} ${CX} ${CY})`}>
            <text
              x={CX}
              y={CY - 105}
              textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontSize="7"
              letterSpacing="1.2"
              fill={SILVER}
            >
              {m}
            </text>
          </g>
        ))}

        {/* inner rotating star dial: load calibration wrapper + 150s ambient drift */}
        <g className="cz-noct-dial-load">
          <g className="cz-noct-drift">
            <circle cx={CX} cy={CY} r="96" fill="none" stroke={SILVER_DIM} strokeWidth="0.9" />
            <circle cx={CX} cy={CY} r="88" fill="none" stroke={SILVER_FAINT} strokeWidth="0.4" opacity="0.6" />

            {/* faint field stars */}
            <g fill={SILVER_FAINT}>
              {FIELD_STARS.map(([dx, dy, r], i) => (
                <circle key={i} cx={CX + dx} cy={CY + dy} r={r} />
              ))}
            </g>

            {/* Ursa Major stick figure */}
            <g stroke={SILVER} strokeWidth="0.7" opacity="0.9">
              {URSA_LINES.map(([a, b]) => (
                <line
                  key={`${a}-${b}`}
                  x1={CX + URSA[a][0]}
                  y1={CY + URSA[a][1]}
                  x2={CX + URSA[b][0]}
                  y2={CY + URSA[b][1]}
                />
              ))}
            </g>
            <g fill={SILVER}>
              {URSA.map(([dx, dy], i) => (
                <circle key={i} cx={CX + dx} cy={CY + dy} r={i === 0 || i === 6 ? 1.9 : 1.5} />
              ))}
            </g>

            {/* Cassiopeia's W */}
            <polyline
              points={CASSIOPEIA.map(([dx, dy]) => `${CX + dx},${CY + dy}`).join(" ")}
              fill="none"
              stroke={SILVER}
              strokeWidth="0.7"
              opacity="0.9"
            />
            <g fill={SILVER}>
              {CASSIOPEIA.map(([dx, dy], i) => (
                <circle key={i} cx={CX + dx} cy={CY + dy} r="1.5" />
              ))}
            </g>

            {/* engraved reticle cross around the pole */}
            <g stroke={SILVER_FAINT} strokeWidth="0.5" opacity="0.8">
              <line x1={CX - 26} y1={CY} x2={CX - 10} y2={CY} />
              <line x1={CX + 10} y1={CY} x2={CX + 26} y2={CY} />
              <line x1={CX} y1={CY - 26} x2={CX} y2={CY - 10} />
              <line x1={CX} y1={CY + 10} x2={CX} y2={CY + 26} />
            </g>

            {/* Polaris at the pole, twinkling gently */}
            <g className="cz-noct-polaris">
              <path
                d={`M ${CX} ${CY - 9} L ${CX + 2} ${CY - 2} L ${CX + 9} ${CY} L ${CX + 2} ${CY + 2} L ${CX} ${CY + 9} L ${CX - 2} ${CY + 2} L ${CX - 9} ${CY} L ${CX - 2} ${CY - 2} Z`}
                fill={GOLD}
              />
              <circle cx={CX} cy={CY} r="2.4" fill="#f4e3ae" />
            </g>
          </g>
        </g>

        {/* sighting hole at the very center */}
        <circle cx={CX} cy={CY} r="3.2" fill={BG_DEEP} stroke={SILVER} strokeWidth="0.8" />

        {/* regula: the long pointer arm, swings to its mark on load */}
        <g className="cz-noct-arm">
          <path
            d={`M ${CX - 2.6} ${CY - 26} L ${CX} ${CY - 124} L ${CX + 2.6} ${CY - 26} L ${CX + 1.6} ${CY - 4} L ${CX - 1.6} ${CY - 4} Z`}
            fill={SILVER}
            fillOpacity="0.28"
            stroke={SILVER}
            strokeWidth="0.9"
            strokeLinejoin="round"
          />
          <line x1={CX} y1={CY - 116} x2={CX} y2={CY - 10} stroke={SILVER} strokeWidth="0.5" opacity="0.8" />
          {/* counterweight tail */}
          <path
            d={`M ${CX - 3} ${CY + 6} L ${CX} ${CY + 26} L ${CX + 3} ${CY + 6} Z`}
            fill={SILVER}
            fillOpacity="0.28"
            stroke={SILVER}
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
          <circle cx={CX} cy={CY} r="5" fill="none" stroke={SILVER} strokeWidth="0.9" />
        </g>

        {/* IX engraved small on the dial face */}
        <text
          x={CX}
          y={CY + 74}
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="11"
          letterSpacing="3"
          fill={GOLD}
          opacity="0.9"
        >
          IX
        </text>

        {/* ==================== the Hermit at the base ==================== */}
        <g className="cz-noct-hermit">
          {/* lantern glow cast up onto the dial */}
          <circle className="cz-noct-glow" cx="182" cy="302" r="26" fill="url(#cz-noct-lantern-glow)" />

          {/* staff in the left hand */}
          <line x1="127" y1="314" x2="134" y2="366" stroke={SILVER} strokeWidth="1.4" strokeLinecap="round" />

          {/* hooded robe */}
          <path
            d="M 138 332 Q 133 350 135 368 L 165 368 Q 167 350 162 332"
            fill="#0d1526"
            stroke={SILVER}
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          {/* hood */}
          <path
            d="M 138 334 Q 137 314 150 311 Q 163 314 162 334"
            fill="#0d1526"
            stroke={SILVER}
            strokeWidth="1.3"
          />
          {/* shadowed face opening */}
          <ellipse cx="150" cy="324" rx="4.6" ry="5.6" fill="#04060d" stroke={SILVER_FAINT} strokeWidth="0.4" />

          {/* robe fold engraving */}
          <path d="M 141 340 Q 139 354 140 364" fill="none" stroke={SILVER_DIM} strokeWidth="0.7" opacity="0.8" />
          <path d="M 159 340 Q 161 354 160 364" fill="none" stroke={SILVER_DIM} strokeWidth="0.7" opacity="0.8" />

          {/* raised right arm, lifting the lantern to the dial */}
          <path d="M 160 338 Q 170 326 177 312" fill="none" stroke={SILVER} strokeWidth="1.3" strokeLinecap="round" />

          {/* pale-gold lantern held up to the dial */}
          <line x1="182" y1="292" x2="182" y2="296" stroke={SILVER} strokeWidth="0.8" />
          <path
            d="M 176 296 L 188 296 L 186 308 L 178 308 Z"
            fill={GOLD}
            stroke={GOLD_DEEP}
            strokeWidth="0.9"
            strokeLinejoin="round"
          />
          <path d="M 178 296 L 180 292 L 184 292 L 186 296" fill="none" stroke={SILVER} strokeWidth="0.8" />
          <path d="M 182 299 L 183.4 302 L 182 305 L 180.6 302 Z" fill="#fff6d8" />
        </g>

        {/* ==================== title plate ==================== */}
        <g>
          <line x1="46" y1="398" x2="108" y2="398" stroke={GOLD_DEEP} strokeWidth="0.8" />
          <line x1="192" y1="398" x2="254" y2="398" stroke={GOLD_DEEP} strokeWidth="0.8" />
          <path d="M 40 398 L 44 395 L 48 398 L 44 401 Z" fill={GOLD} />
          <path d="M 252 398 L 256 395 L 260 398 L 256 401 Z" fill={GOLD} />
          <text
            x="150"
            y="414"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="700"
            fontSize="16"
            letterSpacing="5"
            fill={SILVER}
          >
            THE HERMIT
          </text>
          <text
            x="150"
            y="430"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fontSize="8.5"
            letterSpacing="2.5"
            fill={SILVER_DIM}
          >
            · horologium noctis ·
          </text>
        </g>
      </svg>
    </figure>
  );
}
