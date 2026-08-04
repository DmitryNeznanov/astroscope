/**
 * Destiny Matrix — style variant: CODEX MANUSCRIPT
 * Emerald-gold medieval codex: dark emerald ground, gold ink, verdigris,
 * rubric-red accents. The octagram rendered as an illuminated diagram:
 * nodes as decorated roundels, latin micro-labels, vellum grain.
 * Self-contained: inline SVG + scoped CSS. Server-component safe.
 */

const C = 500; // svg center (viewBox 1000x1000)

const COLORS = {
  bg: "#06120c",
  panel: "#0a1c12",
  gold: "#c9b037",
  goldLight: "#e8d98a",
  verdigris: "#3fa37c",
  rubric: "#b03a2e",
};

type OuterNode = { x: number; y: number; n: number; age: string };

// 4 cardinal nodes (top/right/bottom/left), r = 330
const CARDINALS: OuterNode[] = [
  { x: 500, y: 170, n: 7, age: "20y" },
  { x: 830, y: 500, n: 10, age: "40y" },
  { x: 500, y: 830, n: 7, age: "60y" },
  { x: 170, y: 500, n: 8, age: "0y" },
];

// 4 diagonal nodes (TL/TR/BR/BL), r = 330 / on the same circle
const D = 500 - 330 / Math.SQRT2; // 266.65
const DIAGONALS: OuterNode[] = [
  { x: D, y: D, n: 15, age: "10y" },
  { x: 1000 - D, y: D, n: 17, age: "30y" },
  { x: 1000 - D, y: 1000 - D, n: 17, age: "50y" },
  { x: D, y: 1000 - D, n: 15, age: "70y" },
];

// 12 inner nodes along the spokes / inside the squares
const INNER: { x: number; y: number; n: number }[] = [
  { x: 500, y: 351.5, n: 19 }, // top spoke
  { x: 500, y: 290, n: 12 },
  { x: 648.5, y: 500, n: 8 }, // right spoke
  { x: 710, y: 500, n: 20 },
  { x: 500, y: 648.5, n: 13 }, // bottom spoke
  { x: 500, y: 710, n: 21 },
  { x: 351.5, y: 500, n: 22 }, // left spoke
  { x: 290, y: 500, n: 12 },
  { x: 358.6, y: 358.6, n: 20 }, // diagonals
  { x: 641.4, y: 358.6, n: 8 },
  { x: 641.4, y: 641.4, n: 19 },
  { x: 358.6, y: 641.4, n: 6 },
];

// age labels on the outer ring (between nodes r=330 and ring r=415)
const AGES: { x: number; y: number; age: string }[] = [
  { x: 500, y: 118, age: "20y" },
  { x: 772, y: 232, age: "30y" },
  { x: 888, y: 504, age: "40y" },
  { x: 772, y: 776, age: "50y" },
  { x: 500, y: 892, age: "60y" },
  { x: 228, y: 776, age: "70y" },
  { x: 112, y: 504, age: "0y" },
  { x: 228, y: 232, age: "10y" },
];

const SERIF = "Georgia, 'Times New Roman', serif";

export default function CodexManuscriptMatrix() {
  return (
    <figure
      className="mx-codex-figure"
      style={{ aspectRatio: "1/1", width: "100%" }}
    >
      <style>{`
        .mx-codex-figure {
          margin: 0;
          display: flex;
          flex-direction: column;
          background: ${COLORS.bg};
          border: 1px solid rgba(201,176,55,0.35);
          box-shadow: inset 0 0 0 4px ${COLORS.bg}, inset 0 0 0 5px rgba(201,176,55,0.2);
          overflow: hidden;
          font-family: ${SERIF};
        }
        .mx-codex-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4em;
          padding: 0.55em 0.5em 0.35em;
          color: ${COLORS.goldLight};
          font-size: clamp(9px, 2.6vw, 13px);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          white-space: nowrap;
          border-bottom: 1px solid rgba(201,176,55,0.25);
        }
        .mx-codex-dropcap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.9em;
          height: 1.9em;
          font-size: 1.35em;
          line-height: 1;
          color: ${COLORS.goldLight};
          background: ${COLORS.panel};
          border: 1px solid ${COLORS.gold};
          box-shadow: inset 0 0 0 2px ${COLORS.bg}, inset 0 0 0 3px rgba(201,176,55,0.5);
          text-transform: none;
        }
        .mx-codex-sep { color: ${COLORS.rubric}; font-style: normal; }
        .mx-codex-svg { flex: 1 1 auto; min-height: 0; width: 100%; height: 100%; display: block; }

        @media (prefers-reduced-motion: no-preference) {
          /* LOAD: elegant draw-on of the diagram lines */
          .mx-codex-draw {
            stroke-dasharray: 1;
            stroke-dashoffset: 1;
            animation: mx-codex-draw 1.1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          /* LOAD: roundels stamp in like seals */
          .mx-codex-stamp {
            transform-box: fill-box;
            transform-origin: center;
            animation: mx-codex-stamp 0.55s cubic-bezier(0.2, 1.4, 0.4, 1) backwards;
          }
          /* LOAD: labels fade */
          .mx-codex-fade { animation: mx-codex-fadein 0.9s ease-out backwards; }
          /* AMBIENT: very slow halo breathing + ring drift */
          .mx-codex-halo { animation: mx-codex-breathe 18s ease-in-out infinite; }
          .mx-codex-drift {
            transform-box: fill-box;
            transform-origin: center;
            animation: mx-codex-drift 110s linear infinite;
          }
        }
        @keyframes mx-codex-draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes mx-codex-stamp {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes mx-codex-fadein {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes mx-codex-breathe {
          0%, 100% { opacity: 0.12; }
          50% { opacity: 0.3; }
        }
        @keyframes mx-codex-drift {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <figcaption
        className="mx-codex-header mx-codex-fade"
        aria-label="Day 8 · Month 7 · Year 10 · Base 7 · Center 5"
      >
        <span className="mx-codex-dropcap" aria-hidden="true">
          D
        </span>
        <span aria-hidden="true">
          ay 8 <i className="mx-codex-sep">·</i> Month 7{" "}
          <i className="mx-codex-sep">·</i> Year 10 <i className="mx-codex-sep">
            ·
          </i>{" "}
          Base 7 <i className="mx-codex-sep">·</i> Center 5
        </span>
      </figcaption>

      <svg
        className="mx-codex-svg"
        viewBox="0 0 1000 1000"
        role="img"
        aria-label="Destiny matrix octagram: center 5, cardinals 7 10 7 8, diagonals 15 17 17 15"
      >
        <defs>
          <radialGradient id="mx-codex-vignette" cx="50%" cy="46%" r="72%">
            <stop offset="0%" stopColor="#0c2317" />
            <stop offset="55%" stopColor={COLORS.bg} />
            <stop offset="100%" stopColor="#030b07" />
          </radialGradient>
          <filter id="mx-codex-vellum" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              seed="7"
              result="n"
            />
            <feColorMatrix
              in="n"
              type="matrix"
              values="0 0 0 0 0.79  0 0 0 0 0.69  0 0 0 0 0.22  0 0 0 0.05 0"
            />
          </filter>
          {/* arcs for latin micro-labels on the ring */}
          <path
            id="mx-codex-arc-top"
            d="M 196 196 A 432 432 0 0 1 804 196"
            fill="none"
          />
          <path
            id="mx-codex-arc-bottom"
            d="M 196 804 A 432 432 0 0 0 804 804"
            fill="none"
          />
        </defs>

        {/* ground + vellum grain */}
        <rect width="1000" height="1000" fill="url(#mx-codex-vignette)" />
        <rect width="1000" height="1000" filter="url(#mx-codex-vellum)" />

        {/* codex frame */}
        <rect
          x="14"
          y="14"
          width="972"
          height="972"
          fill="none"
          stroke={COLORS.gold}
          strokeOpacity="0.55"
          strokeWidth="2"
        />
        <rect
          x="24"
          y="24"
          width="952"
          height="952"
          fill="none"
          stroke={COLORS.gold}
          strokeOpacity="0.3"
          strokeWidth="1"
        />

        {/* ambient drifting dotted halo */}
        <circle
          className="mx-codex-drift"
          cx={C}
          cy={C}
          r="462"
          fill="none"
          stroke={COLORS.gold}
          strokeOpacity="0.35"
          strokeWidth="3"
          strokeDasharray="1 15"
          strokeLinecap="round"
        />

        {/* outer age ring + tick marks */}
        <circle
          className="mx-codex-draw"
          pathLength={1}
          cx={C}
          cy={C}
          r="415"
          fill="none"
          stroke={COLORS.gold}
          strokeWidth="2"
          style={{ animationDelay: "0.05s" }}
        />
        <circle
          className="mx-codex-fade"
          cx={C}
          cy={C}
          r="415"
          fill="none"
          stroke={COLORS.gold}
          strokeWidth="12"
          strokeDasharray="3 322.94"
          strokeDashoffset="-1.5"
          style={{ animationDelay: "0.7s" }}
        />

        {/* rubric diamonds at cardinal points of the ring */}
        {[0, 90, 180, 270].map((a) => (
          <rect
            key={a}
            className="mx-codex-fade"
            x="-6"
            y="-6"
            width="12"
            height="12"
            fill={COLORS.rubric}
            transform={`translate(${C} ${C - 415}) rotate(45) rotate(${a} 0 415)`}
            style={{ animationDelay: "1.1s" }}
          />
        ))}

        {/* latin micro-labels on the ring */}
        <text
          className="mx-codex-fade"
          fontFamily={SERIF}
          fontSize="15"
          letterSpacing="8"
          fill={COLORS.rubric}
          style={{ animationDelay: "1.2s" }}
        >
          <textPath href="#mx-codex-arc-top" startOffset="50%" textAnchor="middle">
            FATVM
          </textPath>
        </text>
        <text
          className="mx-codex-fade"
          fontFamily={SERIF}
          fontSize="15"
          letterSpacing="8"
          fill={COLORS.rubric}
          style={{ animationDelay: "1.25s" }}
        >
          <textPath
            href="#mx-codex-arc-bottom"
            startOffset="50%"
            textAnchor="middle"
          >
            AETAS
          </textPath>
        </text>

        {/* square through the diagonals (verdigris) */}
        <path
          className="mx-codex-draw"
          pathLength={1}
          d={`M ${D} ${D} L ${1000 - D} ${D} L ${1000 - D} ${1000 - D} L ${D} ${1000 - D} Z`}
          fill="none"
          stroke={COLORS.verdigris}
          strokeWidth="2"
          strokeOpacity="0.9"
          style={{ animationDelay: "0.25s" }}
        />
        {/* square through the cardinals (gold) */}
        <path
          className="mx-codex-draw"
          pathLength={1}
          d="M 500 170 L 830 500 L 500 830 L 170 500 Z"
          fill="none"
          stroke={COLORS.gold}
          strokeWidth="2"
          style={{ animationDelay: "0.35s" }}
        />

        {/* the four spokes */}
        {CARDINALS.map((p, i) => (
          <path
            key={i}
            className="mx-codex-draw"
            pathLength={1}
            d={`M ${C} ${C} L ${p.x} ${p.y}`}
            fill="none"
            stroke={COLORS.gold}
            strokeWidth="1.4"
            strokeOpacity="0.8"
            style={{ animationDelay: `${0.45 + i * 0.08}s` }}
          />
        ))}

        {/* inner nodes: small verdigris roundels */}
        {INNER.map((p, i) => (
          <g
            key={i}
            className="mx-codex-stamp"
            style={{ animationDelay: `${0.55 + i * 0.05}s` }}
          >
            <circle
              cx={p.x}
              cy={p.y}
              r="14"
              fill={COLORS.panel}
              stroke={COLORS.verdigris}
              strokeWidth="1.5"
            />
            <circle
              cx={p.x}
              cy={p.y}
              r="10.5"
              fill="none"
              stroke={COLORS.verdigris}
              strokeOpacity="0.4"
              strokeWidth="0.75"
            />
            <text
              x={p.x}
              y={p.y + 5}
              textAnchor="middle"
              fontFamily={SERIF}
              fontSize="15"
              fill={COLORS.goldLight}
            >
              {p.n}
            </text>
          </g>
        ))}

        {/* diagonal outer nodes */}
        {DIAGONALS.map((p, i) => (
          <g
            key={i}
            className="mx-codex-stamp"
            style={{ animationDelay: `${0.8 + i * 0.07}s` }}
          >
            <circle
              cx={p.x}
              cy={p.y}
              r="21"
              fill={COLORS.panel}
              stroke={COLORS.gold}
              strokeWidth="2"
            />
            <circle
              cx={p.x}
              cy={p.y}
              r="16.5"
              fill="none"
              stroke={COLORS.gold}
              strokeOpacity="0.45"
              strokeWidth="1"
            />
            <text
              x={p.x}
              y={p.y + 7}
              textAnchor="middle"
              fontFamily={SERIF}
              fontSize="21"
              fill={COLORS.goldLight}
            >
              {p.n}
            </text>
          </g>
        ))}

        {/* cardinal outer nodes: larger decorated roundels */}
        {CARDINALS.map((p, i) => (
          <g
            key={i}
            className="mx-codex-stamp"
            style={{ animationDelay: `${0.95 + i * 0.08}s` }}
          >
            <circle
              cx={p.x}
              cy={p.y}
              r="27"
              fill={COLORS.panel}
              stroke={COLORS.gold}
              strokeWidth="2.5"
            />
            <circle
              cx={p.x}
              cy={p.y}
              r="21.5"
              fill="none"
              stroke={COLORS.gold}
              strokeOpacity="0.5"
              strokeWidth="1"
            />
            {/* petal ticks */}
            {[0, 90, 180, 270].map((a) => (
              <line
                key={a}
                x1={p.x}
                y1={p.y - 31}
                x2={p.x}
                y2={p.y - 27}
                stroke={COLORS.verdigris}
                strokeWidth="2"
                transform={`rotate(${a} ${p.x} ${p.y})`}
              />
            ))}
            <text
              x={p.x}
              y={p.y + 8}
              textAnchor="middle"
              fontFamily={SERIF}
              fontSize="24"
              fill={COLORS.goldLight}
            >
              {p.n}
            </text>
          </g>
        ))}

        {/* age labels */}
        {AGES.map((p, i) => (
          <text
            key={i}
            className="mx-codex-fade"
            x={p.x}
            y={p.y}
            textAnchor="middle"
            fontFamily={SERIF}
            fontSize="19"
            letterSpacing="1.5"
            fill={COLORS.gold}
            style={{ animationDelay: `${1.05 + i * 0.05}s` }}
          >
            {p.age}
          </text>
        ))}

        {/* center: the heart (COR) */}
        <circle
          className="mx-codex-halo"
          cx={C}
          cy={C}
          r="66"
          fill={COLORS.gold}
          opacity="0.15"
        />
        <g className="mx-codex-stamp" style={{ animationDelay: "0.35s" }}>
          <circle
            cx={C}
            cy={C}
            r="47"
            fill={COLORS.panel}
            stroke={COLORS.gold}
            strokeWidth="3"
          />
          <circle
            cx={C}
            cy={C}
            r="39"
            fill="none"
            stroke={COLORS.verdigris}
            strokeWidth="1.2"
            strokeOpacity="0.8"
          />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line
              key={a}
              x1={C}
              y1={C - 52}
              x2={C}
              y2={C - 47}
              stroke={COLORS.gold}
              strokeWidth="2"
              transform={`rotate(${a} ${C} ${C})`}
            />
          ))}
          <text
            x={C}
            y={C + 13}
            textAnchor="middle"
            fontFamily={SERIF}
            fontSize="42"
            fill={COLORS.goldLight}
          >
            5
          </text>
        </g>
        <text
          className="mx-codex-fade"
          x={C}
          y={C + 76}
          textAnchor="middle"
          fontFamily={SERIF}
          fontSize="14"
          letterSpacing="5"
          fill={COLORS.rubric}
          style={{ animationDelay: "1.35s" }}
        >
          COR
        </text>
      </svg>
    </figure>
  );
}
