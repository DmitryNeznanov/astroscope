/**
 * Destiny Matrix — style variant: VOLVELLE PAPER
 * A layered paper instrument: aged parchment panel with deckle edges,
 * sepia-ink octagram printed on a base disc, a smaller rotating-looking
 * top disc, and a brass brad stamped with the center number.
 * Server-component safe: inline SVG + scoped CSS animations only.
 */

const CX = 400;
const CY = 400;
const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";

const rad = (deg: number) => (deg * Math.PI) / 180;
const pt = (angle: number, r: number): [number, number] => [
  Math.round((CX + r * Math.cos(rad(angle))) * 10) / 10,
  Math.round((CY + r * Math.sin(rad(angle))) * 10) / 10,
];

/* Outer octagram nodes, clockwise from top. */
const OUTER = [
  { angle: -90, value: 7, age: "20y" },
  { angle: -45, value: 17, age: "30y" },
  { angle: 0, value: 10, age: "40y" },
  { angle: 45, value: 17, age: "50y" },
  { angle: 90, value: 7, age: "60y" },
  { angle: 135, value: 15, age: "70y" },
  { angle: 180, value: 8, age: "0y" },
  { angle: -135, value: 15, age: "10y" },
];

/* Inner nodes: one on each spoke, plus a second ring on the diagonals. */
const INNER_SPOKE = [
  { angle: -90, value: 19 },
  { angle: -45, value: 12 },
  { angle: 0, value: 8 },
  { angle: 45, value: 20 },
  { angle: 90, value: 13 },
  { angle: 135, value: 21 },
  { angle: 180, value: 22 },
  { angle: -135, value: 12 },
];
const INNER_DIAG = [
  { angle: -45, value: 20 },
  { angle: 45, value: 8 },
  { angle: 135, value: 19 },
  { angle: -135, value: 6 },
];

const R_OUTER = 245;
const CARDINALS = [-90, 0, 90, 180];
const DIAGONALS = [-135, -45, 45, 135];

export default function MatrixVolvellePaper() {
  const diamond = CARDINALS.map((a) => pt(a, R_OUTER).join(",")).join(" ");
  const square = DIAGONALS.map((a) => pt(a, R_OUTER).join(",")).join(" ");

  return (
    <figure
      style={{ aspectRatio: "1/1", width: "100%", margin: 0 }}
      aria-label="Destiny Matrix diagram, volvelle paper style"
    >
      <style>{`
        .mx-volvelle-draw-sq, .mx-volvelle-draw-sp, .mx-volvelle-draw-ring {
          animation: mx-volvelle-draw 1.2s cubic-bezier(.4,0,.2,1) both;
        }
        .mx-volvelle-draw-sq { stroke-dasharray: 1400; --mx-volvelle-dash: 1400; }
        .mx-volvelle-draw-sp { stroke-dasharray: 280; --mx-volvelle-dash: 280; }
        .mx-volvelle-draw-ring { stroke-dasharray: 2250; --mx-volvelle-dash: 2250; animation-duration: 1.4s; }
        .mx-volvelle-stamp {
          transform-box: fill-box; transform-origin: center;
          animation: mx-volvelle-stamp-in .45s cubic-bezier(.2,1.4,.4,1) both;
        }
        .mx-volvelle-fade { animation: mx-volvelle-fade-in .8s ease-out both; }
        .mx-volvelle-brad {
          transform-box: fill-box; transform-origin: center;
          animation: mx-volvelle-brad-in .6s cubic-bezier(.2,1.5,.4,1) both;
        }
        .mx-volvelle-spin {
          transform-box: fill-box; transform-origin: center;
          animation: mx-volvelle-rotate 120s linear infinite;
        }
        .mx-volvelle-sheen { animation: mx-volvelle-sheen 20s ease-in-out infinite alternate; }
        @keyframes mx-volvelle-draw { from { stroke-dashoffset: var(--mx-volvelle-dash); } to { stroke-dashoffset: 0; } }
        @keyframes mx-volvelle-stamp-in {
          from { opacity: 0; transform: scale(1.3) rotate(-5deg); }
          to { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes mx-volvelle-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes mx-volvelle-brad-in {
          from { opacity: 0; transform: scale(1.5); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes mx-volvelle-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes mx-volvelle-sheen { from { opacity: .12; } to { opacity: .42; } }
        @media (prefers-reduced-motion: reduce) {
          .mx-volvelle-draw-sq, .mx-volvelle-draw-sp, .mx-volvelle-draw-ring,
          .mx-volvelle-stamp, .mx-volvelle-fade, .mx-volvelle-brad,
          .mx-volvelle-spin, .mx-volvelle-sheen { animation: none !important; }
        }
      `}</style>

      <svg
        viewBox="0 0 800 800"
        width="100%"
        height="100%"
        role="img"
        aria-label="Destiny Matrix: octagram with eight outer nodes, twelve inner nodes and center 5"
        style={{ display: "block" }}
      >
        <defs>
          <radialGradient id="mx-volvelle-paper" cx="50%" cy="42%" r="75%">
            <stop offset="0%" stopColor="#f7edd4" />
            <stop offset="55%" stopColor="#efdfba" />
            <stop offset="100%" stopColor="#dfc494" />
          </radialGradient>
          <radialGradient id="mx-volvelle-backing" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#d9bf8e" />
            <stop offset="100%" stopColor="#b99a66" />
          </radialGradient>
          <radialGradient id="mx-volvelle-disc" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#f3e6c4" />
            <stop offset="100%" stopColor="#e0c99c" />
          </radialGradient>
          <radialGradient id="mx-volvelle-brass" cx="38%" cy="32%" r="80%">
            <stop offset="0%" stopColor="#f2d88c" />
            <stop offset="55%" stopColor="#c69d4c" />
            <stop offset="100%" stopColor="#86662c" />
          </radialGradient>
          <radialGradient id="mx-volvelle-vignette" cx="50%" cy="50%" r="72%">
            <stop offset="70%" stopColor="#5a4020" stopOpacity="0" />
            <stop offset="100%" stopColor="#5a4020" stopOpacity="0.22" />
          </radialGradient>
          <filter id="mx-volvelle-deckle" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves="4" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="15" />
          </filter>
          <filter id="mx-volvelle-shadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#4a3826" floodOpacity="0.35" />
          </filter>
          <filter id="mx-volvelle-shadow-lg" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#4a3826" floodOpacity="0.4" />
          </filter>
          <filter id="mx-volvelle-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.14  0 0 0 0.05 0"
            />
          </filter>
        </defs>

        {/* Layered backing sheet + parchment panel with deckle edges */}
        <rect x="14" y="18" width="776" height="776" rx="8" fill="url(#mx-volvelle-backing)" filter="url(#mx-volvelle-deckle)" />
        <rect x="8" y="8" width="784" height="784" rx="8" fill="url(#mx-volvelle-paper)" filter="url(#mx-volvelle-deckle)" />

        {/* Age stains */}
        <ellipse cx="180" cy="620" rx="90" ry="55" fill="#c2a166" opacity="0.14" />
        <ellipse cx="640" cy="180" rx="70" ry="45" fill="#c2a166" opacity="0.12" />
        <ellipse cx="620" cy="660" rx="55" ry="38" fill="#b28b52" opacity="0.1" />

        {/* Header, letterpress style */}
        <text
          x="400"
          y="44"
          textAnchor="middle"
          fontFamily={SERIF}
          fontSize="19"
          letterSpacing="3"
          fill="#5b4632"
          className="mx-volvelle-fade"
          style={{ animationDelay: "0.1s" }}
        >
          Day 8 · Month 7 · Year 10 · Base 7 · Center 5
        </text>
        <line x1="200" y1="60" x2="600" y2="60" stroke="#8a6f4c" strokeWidth="1" opacity="0.6" className="mx-volvelle-fade" style={{ animationDelay: "0.15s" }} />

        {/* Printed scale ring with ticks */}
        <circle cx="400" cy="400" r="300" fill="none" stroke="#7a5f42" strokeWidth="1.4" className="mx-volvelle-draw-ring" style={{ animationDelay: "0.1s" }} />
        <circle cx="400" cy="400" r="350" fill="none" stroke="#7a5f42" strokeWidth="1.4" className="mx-volvelle-draw-ring" style={{ animationDelay: "0.2s" }} />
        {Array.from({ length: 72 }, (_, i) => {
          const a = i * 5;
          const major = a % 45 === 0;
          const [x1, y1] = pt(a, 300);
          const [x2, y2] = pt(a, major ? 322 : 311);
          return (
            <line
              key={`tick-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#7a5f42"
              strokeWidth={major ? 2.2 : 1}
              opacity={major ? 0.9 : 0.65}
              className="mx-volvelle-fade"
              style={{ animationDelay: "0.5s" }}
            />
          );
        })}

        {/* Age labels on the ring */}
        {OUTER.map((n, i) => {
          const [x, y] = pt(n.angle, 337);
          return (
            <text
              key={`age-${i}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={SERIF}
              fontSize="18"
              fill="#6b5238"
              className="mx-volvelle-fade"
              style={{ animationDelay: `${1 + i * 0.04}s` }}
            >
              {n.age}
            </text>
          );
        })}

        {/* Octagram: the two squares */}
        <polygon points={diamond} fill="none" stroke="#6b5238" strokeWidth="2.4" className="mx-volvelle-draw-sq" />
        <polygon points={square} fill="none" stroke="#6b5238" strokeWidth="2.4" className="mx-volvelle-draw-sq" style={{ animationDelay: "0.15s" }} />

        {/* Spokes (run beneath the top disc) */}
        {OUTER.map((n, i) => {
          const [x, y] = pt(n.angle, R_OUTER);
          return (
            <line
              key={`spoke-${i}`}
              x1={CX}
              y1={CY}
              x2={x}
              y2={y}
              stroke="#8a6f4c"
              strokeWidth="1.6"
              opacity="0.85"
              className="mx-volvelle-draw-sp"
              style={{ animationDelay: `${0.25 + i * 0.05}s` }}
            />
          );
        })}

        {/* Top disc: smaller rotating-looking volvelle wheel */}
        <g className="mx-volvelle-fade" style={{ animationDelay: "0.7s" }}>
          <circle cx="400" cy="400" r="106" fill="url(#mx-volvelle-disc)" stroke="#a5865a" strokeWidth="1.6" filter="url(#mx-volvelle-shadow-lg)" />
          <g className="mx-volvelle-spin">
            {Array.from({ length: 24 }, (_, i) => {
              const a = i * 15;
              const [x1, y1] = pt(a, 92);
              const [x2, y2] = pt(a, i % 6 === 0 ? 78 : 85);
              return (
                <line key={`dt-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#7a5f42" strokeWidth={i % 6 === 0 ? 2 : 1} opacity="0.8" />
              );
            })}
            <line x1="400" y1="452" x2="400" y2="316" stroke="#5b4632" strokeWidth="3" />
            <polygon points="400,300 391,318 409,318" fill="#5b4632" />
            <circle cx="400" cy="400" r="70" fill="none" stroke="#a5865a" strokeWidth="1" strokeDasharray="3 5" opacity="0.8" />
          </g>
        </g>

        {/* Inner nodes: small punched labels */}
        {INNER_SPOKE.map((n, i) => {
          const [x, y] = pt(n.angle, 186);
          return (
            <g key={`in-s-${i}`} className="mx-volvelle-stamp" style={{ animationDelay: `${0.9 + i * 0.04}s` }}>
              <circle cx={x} cy={y} r="16" fill="#f6ecd2" stroke="#c2a87e" strokeWidth="1.2" filter="url(#mx-volvelle-shadow)" />
              <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontFamily={SERIF} fontSize="19" fill="#4a3826">
                {n.value}
              </text>
            </g>
          );
        })}
        {INNER_DIAG.map((n, i) => {
          const [x, y] = pt(n.angle, 134);
          return (
            <g key={`in-d-${i}`} className="mx-volvelle-stamp" style={{ animationDelay: `${1.15 + i * 0.04}s` }}>
              <circle cx={x} cy={y} r="14" fill="#f6ecd2" stroke="#c2a87e" strokeWidth="1.2" filter="url(#mx-volvelle-shadow)" />
              <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontFamily={SERIF} fontSize="16" fill="#4a3826">
                {n.value}
              </text>
            </g>
          );
        })}

        {/* Outer nodes: punched paper labels */}
        {OUTER.map((n, i) => {
          const [x, y] = pt(n.angle, R_OUTER);
          return (
            <g key={`out-${i}`} className="mx-volvelle-stamp" style={{ animationDelay: `${0.35 + i * 0.08}s` }}>
              <circle cx={x} cy={y} r="31" fill="#faf1da" stroke="#b89a6e" strokeWidth="1.8" filter="url(#mx-volvelle-shadow)" />
              <circle cx={x} cy={y} r="25" fill="none" stroke="#c9ad84" strokeWidth="1" strokeDasharray="2 4" />
              <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="central" fontFamily={SERIF} fontSize="26" fontWeight="bold" fill="#4a3826">
                {n.value}
              </text>
            </g>
          );
        })}

        {/* Brass brad at the heart, stamped with the center number */}
        <g className="mx-volvelle-brad" style={{ animationDelay: "1.3s" }}>
          <circle cx="400" cy="400" r="34" fill="url(#mx-volvelle-brass)" stroke="#6d5222" strokeWidth="2" filter="url(#mx-volvelle-shadow-lg)" />
          <circle cx="400" cy="400" r="27" fill="none" stroke="#8a6a2f" strokeWidth="1" opacity="0.7" />
          <ellipse cx="389" cy="387" rx="11" ry="6" fill="#fff7dd" className="mx-volvelle-sheen" />
          <text x="400" y="401" textAnchor="middle" dominantBaseline="central" fontFamily={SERIF} fontSize="30" fontWeight="bold" fill="#3d2c16">
            5
          </text>
        </g>

        {/* Vignette + paper grain */}
        <rect x="0" y="0" width="800" height="800" fill="url(#mx-volvelle-vignette)" pointerEvents="none" />
        <rect x="0" y="0" width="800" height="800" filter="url(#mx-volvelle-grain)" pointerEvents="none" />
      </svg>
    </figure>
  );
}
