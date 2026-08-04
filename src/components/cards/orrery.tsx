// ORRERY — The Hermit (IX)
// A Victorian brass orrery (planetarium machine) on black: concentric gear
// rings with visible teeth sweep the lower half, long brass arms radiate from
// the central axis, each carrying a planet sphere (grey Mercury, cream Venus,
// rust Mars, banded Jupiter, ringed Saturn). Where the Sun would sit burns
// the Hermit's lantern — a warm glowing sun-bulb — with the small hooded
// figure standing on an axis bracket beside it, staff in hand. Fine engraved
// orbit circles, a meshing pinion gear, crank handle at the edge, brass 'IX'
// plaque, engraved caps title, riveted metallic frame.
// Server-component safe: no hooks, no client directive.

import type { CSSProperties } from "react";

const CX = 150;
const CY = 185;
const DEG = Math.PI / 180;

const BRASS = "#a07c3e";
const BRASS_DIM = "#6b5228";
const BRASS_BRIGHT = "#e8c87a";
const BRASS_PALE = "#f6e5b8";
const DARK = "#100b06";

// planet arms: orbit radius, final angle (screen degrees, 0 = +x), styling
const ARMS = [
  { name: "Mercury", r: 30, angle: -35, pr: 3, fill: "#9a9a9a", glyph: "☿︎" },
  { name: "Venus", r: 48, angle: 32, pr: 4.4, fill: "#e8dcc0", glyph: "♀︎" },
  { name: "Mars", r: 68, angle: 152, pr: 3.8, fill: "#a5502e", glyph: "♂︎" },
  { name: "Jupiter", r: 92, angle: -122, pr: 7, fill: "#c8a06a", glyph: "♃︎" },
  { name: "Saturn", r: 118, angle: -68, pr: 5.6, fill: "#d8bc82", glyph: "♄︎" },
];

// big gear arcs: teeth around the lower half of two concentric rings
const GEAR_TEETH_OUT = Array.from({ length: 27 }, (_, k) => {
  const t = (12 + k * 6) * DEG;
  return {
    x1: CX + 132 * Math.cos(t),
    y1: CY + 132 * Math.sin(t),
    x2: CX + 141 * Math.cos(t),
    y2: CY + 141 * Math.sin(t),
  };
});
const GEAR_TEETH_IN = Array.from({ length: 23 }, (_, k) => {
  const t = (16 + k * 6.7) * DEG;
  return {
    x1: CX + 112 * Math.cos(t),
    y1: CY + 112 * Math.sin(t),
    x2: CX + 119 * Math.cos(t),
    y2: CY + 119 * Math.sin(t),
  };
});

// small pinion gear meshing with the big gear, lower right
const PINION = { x: 247.7, y: 301.4, r: 12 };
const PINION_TEETH = Array.from({ length: 12 }, (_, k) => {
  const t = k * 30 * DEG;
  return {
    x1: PINION.x + PINION.r * Math.cos(t),
    y1: PINION.y + PINION.r * Math.sin(t),
    x2: PINION.x + (PINION.r + 4.5) * Math.cos(t),
    y2: PINION.y + (PINION.r + 4.5) * Math.sin(t),
  };
});

// lower-half arc of a circle centered on the axis (for gear rims and gleam)
function lowerArc(r: number): string {
  const t0 = 8 * DEG;
  const t1 = 172 * DEG;
  return `M ${CX + r * Math.cos(t0)} ${CY + r * Math.sin(t0)} A ${r} ${r} 0 0 1 ${CX + r * Math.cos(t1)} ${CY + r * Math.sin(t1)}`;
}

export default function OrreryHermitCard() {
  return (
    <figure
      className="cz-orr-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
    >
      <style>{`
        .cz-orr-card { position: relative; overflow: hidden; background: #060402; }
        .cz-orr-card svg { display: block; width: 100%; height: 100%; }

        /* load: each arm swings from folded-up to its orbit angle, staggered */
        .cz-orr-arm {
          transform-box: view-box;
          transform-origin: 150px 185px;
          animation: cz-orr-arm-in .7s cubic-bezier(.3,.8,.3,1) backwards;
          animation-delay: var(--d, 0s);
        }
        .cz-orr-in {
          transform-box: view-box;
          transform-origin: 150px 185px;
          animation: cz-orr-arm-in .9s cubic-bezier(.3,.8,.3,1) backwards;
          animation-delay: var(--d, 0s);
        }
        .cz-orr-fade { animation: cz-orr-ink-in .9s ease-out var(--d, 1.5s) backwards; }

        /* ambient: Saturn's arm creeps through one full, endless revolution */
        .cz-orr-creep {
          transform-box: view-box;
          transform-origin: 150px 185px;
          animation: cz-orr-spin 140s linear infinite;
        }
        /* ambient: a gleam travels slowly along the big gear teeth */
        .cz-orr-gleam {
          stroke-dasharray: 30 780;
          animation: cz-orr-gleam 90s linear infinite;
        }
        /* ambient: the lantern sun-bulb breathes */
        .cz-orr-glow { animation: cz-orr-breathe 18s ease-in-out infinite; }

        @keyframes cz-orr-arm-in {
          from { opacity: 0; transform: rotate(var(--r, 0deg)); }
          to   { opacity: 1; transform: rotate(0deg); }
        }
        @keyframes cz-orr-ink-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cz-orr-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes cz-orr-gleam {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -810; }
        }
        @keyframes cz-orr-breathe {
          0%, 100% { opacity: .72; }
          50%      { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cz-orr-arm, .cz-orr-in, .cz-orr-fade,
          .cz-orr-creep, .cz-orr-gleam, .cz-orr-glow {
            animation: none;
          }
        }
      `}</style>

      <svg
        viewBox="0 0 300 450"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="The Hermit, tarot card nine, as a brass orrery: the hermit's lantern burns at the center where the sun would be, planet arms radiating around him"
      >
        <defs>
          <radialGradient id="cz-orr-bg" cx="50%" cy="42%" r="80%">
            <stop offset="0%" stopColor="#1c1409" />
            <stop offset="55%" stopColor="#0f0a05" />
            <stop offset="100%" stopColor="#040302" />
          </radialGradient>
          {/* vertical metallic sheen for arms, gears and frame */}
          <linearGradient
            id="cz-orr-metal"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="40"
            x2="0"
            y2="340"
          >
            <stop offset="0%" stopColor="#4a3517" />
            <stop offset="30%" stopColor="#a07c3e" />
            <stop offset="46%" stopColor="#f0d999" />
            <stop offset="58%" stopColor="#8a6a34" />
            <stop offset="100%" stopColor="#3a2a12" />
          </linearGradient>
          <linearGradient id="cz-orr-frame" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8a6a34" />
            <stop offset="50%" stopColor="#e0bd72" />
            <stop offset="100%" stopColor="#5a421e" />
          </linearGradient>
          <radialGradient id="cz-orr-lantern" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffedbb" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#e8b45a" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#e8b45a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cz-orr-bulb" cx="42%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#fff6d8" />
            <stop offset="55%" stopColor="#f0c169" />
            <stop offset="100%" stopColor="#9a6a28" />
          </radialGradient>
          {/* corner rivet: domed screw head with a slot */}
          <g id="cz-orr-rivet">
            <circle r="3.6" fill="none" stroke="url(#cz-orr-frame)" strokeWidth="1.2" />
            <circle r="1.3" fill="#0a0704" stroke={BRASS_BRIGHT} strokeWidth="0.5" />
            <line x1="-2.4" y1="0" x2="2.4" y2="0" stroke={BRASS_BRIGHT} strokeWidth="0.7" />
          </g>
          <clipPath id="cz-orr-jup">
            <circle r="7" />
          </clipPath>
        </defs>

        {/* blackened ground */}
        <rect x="0" y="0" width="300" height="450" fill="url(#cz-orr-bg)" />
        {/* faint star dust */}
        <g fill={BRASS_PALE} opacity="0.5">
          <circle cx="44" cy="88" r="0.8" />
          <circle cx="256" cy="66" r="0.7" />
          <circle cx="268" cy="140" r="0.9" />
          <circle cx="36" cy="206" r="0.7" />
          <circle cx="262" cy="216" r="0.8" />
          <circle cx="52" cy="300" r="0.6" />
          <circle cx="72" cy="352" r="0.7" />
          <circle cx="228" cy="360" r="0.6" />
        </g>

        {/* thin metallic frame with riveted corners */}
        <rect x="12" y="12" width="276" height="426" fill="none" stroke="url(#cz-orr-frame)" strokeWidth="1.6" />
        <rect x="18" y="18" width="264" height="414" fill="none" stroke={BRASS_DIM} strokeWidth="0.5" opacity="0.7" />
        <use href="#cz-orr-rivet" x="24" y="24" />
        <use href="#cz-orr-rivet" x="276" y="24" />
        <use href="#cz-orr-rivet" x="24" y="426" />
        <use href="#cz-orr-rivet" x="276" y="426" />

        {/* fine engraved orbit circles */}
        <g className="cz-orr-fade" style={{ "--d": ".1s" } as CSSProperties}>
          {ARMS.map((a) => (
            <circle
              key={a.name}
              cx={CX}
              cy={CY}
              r={a.r}
              fill="none"
              stroke={BRASS_DIM}
              strokeWidth="0.5"
              strokeDasharray="1.5 3.5"
              opacity="0.8"
            />
          ))}
        </g>

        {/* ======== GEAR RINGS, lower half ======== */}
        <g className="cz-orr-in" style={{ "--d": ".15s", "--r": "10deg" } as CSSProperties}>
          {/* outer gear rim + teeth */}
          <path d={lowerArc(136.5)} fill="none" stroke="url(#cz-orr-metal)" strokeWidth="2.6" />
          <path d={lowerArc(128)} fill="none" stroke={BRASS_DIM} strokeWidth="0.8" opacity="0.85" />
          {GEAR_TEETH_OUT.map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={BRASS} strokeWidth="2.2" />
          ))}
          {/* traveling gleam catching the teeth */}
          <path
            className="cz-orr-gleam"
            d={lowerArc(136.5)}
            fill="none"
            stroke={BRASS_PALE}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.55"
          />
        </g>
        <g className="cz-orr-in" style={{ "--d": ".3s", "--r": "-8deg" } as CSSProperties}>
          {/* inner gear rim + teeth */}
          <path d={lowerArc(115.5)} fill="none" stroke="url(#cz-orr-metal)" strokeWidth="1.8" />
          {GEAR_TEETH_IN.map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={BRASS} strokeWidth="1.7" />
          ))}
        </g>

        {/* meshing pinion gear, lower right */}
        <g className="cz-orr-in" style={{ "--d": ".45s", "--r": "14deg" } as CSSProperties}>
          <circle cx={PINION.x} cy={PINION.y} r={PINION.r} fill={DARK} stroke="url(#cz-orr-metal)" strokeWidth="1.6" />
          <circle cx={PINION.x} cy={PINION.y} r="3" fill={DARK} stroke={BRASS_BRIGHT} strokeWidth="0.9" />
          {PINION_TEETH.map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={BRASS} strokeWidth="1.8" />
          ))}
        </g>

        {/* crank handle at the right edge */}
        <g className="cz-orr-fade" style={{ "--d": ".6s" } as CSSProperties}>
          <circle cx="272" cy="252" r="5" fill={DARK} stroke="url(#cz-orr-metal)" strokeWidth="1.4" />
          <line x1="272" y1="252" x2="258" y2="264" stroke={BRASS} strokeWidth="2" strokeLinecap="round" />
          <circle cx="256" cy="266" r="2.6" fill={BRASS_BRIGHT} stroke={BRASS_DIM} strokeWidth="0.6" />
          <circle cx="272" cy="252" r="1.2" fill={BRASS_BRIGHT} />
        </g>

        {/* ======== PLANET ARMS (drawn folded up, rotated to final angle) ======== */}
        {ARMS.map((a, i) => {
          const arm = (
            <g transform={`rotate(${a.angle} ${CX} ${CY})`}>
              {/* brass arm from the axis to the orbit */}
              <line x1={CX} y1={CY - 12} x2={CX} y2={CY - a.r} stroke="url(#cz-orr-metal)" strokeWidth="2.2" />
              {/* collar rivet on the arm */}
              <circle cx={CX} cy={CY - a.r * 0.55} r="1.1" fill={BRASS_BRIGHT} />
              {/* planet sphere */}
              {a.name === "Jupiter" ? (
                <g transform={`translate(${CX} ${CY - a.r})`}>
                  <circle r={a.pr} fill={a.fill} stroke={BRASS_DIM} strokeWidth="0.7" />
                  <g clipPath="url(#cz-orr-jup)">
                    <rect x="-7" y="-2.8" width="14" height="1.8" fill="#8a5a34" opacity="0.85" />
                    <rect x="-7" y="1.2" width="14" height="1.4" fill="#e8d0a0" opacity="0.9" />
                    <rect x="-7" y="3.8" width="14" height="1.2" fill="#8a5a34" opacity="0.7" />
                  </g>
                </g>
              ) : a.name === "Saturn" ? (
                <g transform={`translate(${CX} ${CY - a.r})`}>
                  <ellipse rx="11" ry="3.4" fill="none" stroke={BRASS_BRIGHT} strokeWidth="1.1" transform="rotate(-18)" />
                  <circle r={a.pr} fill={a.fill} stroke={BRASS_DIM} strokeWidth="0.7" />
                  <path d="M -4.9 2.6 A 5.6 5.6 0 0 0 4.9 2.6" fill="none" stroke={BRASS_DIM} strokeWidth="0.6" opacity="0.8" />
                </g>
              ) : (
                <circle cx={CX} cy={CY - a.r} r={a.pr} fill={a.fill} stroke={BRASS_DIM} strokeWidth="0.7" />
              )}
              {/* engraved planet glyph tag beside the sphere */}
              <text
                x={CX + a.pr + 6}
                y={CY - a.r + 2.5}
                fontFamily="'DejaVu Sans', 'Segoe UI Symbol', Georgia, serif"
                fontSize="7.5"
                fill={BRASS_BRIGHT}
                opacity="0.9"
                transform={`rotate(${-a.angle} ${CX + a.pr + 6} ${CY - a.r + 2.5})`}
              >
                {a.glyph}
              </text>
            </g>
          );
          const load = (
            <g
              key={a.name}
              className="cz-orr-arm"
              style={{ "--d": `${0.25 + i * 0.24}s`, "--r": `${-90 - a.angle}deg` } as CSSProperties}
            >
              {arm}
            </g>
          );
          // Saturn's arm also creeps forever on its slow revolution
          return a.name === "Saturn" ? (
            <g key={a.name} className="cz-orr-creep">
              {load}
            </g>
          ) : (
            load
          );
        })}

        {/* ======== CENTRAL AXIS, PEDESTAL AND THE HERMIT ======== */}
        <g className="cz-orr-fade" style={{ "--d": "1.3s" } as CSSProperties}>
          {/* axis rod descending from the sun to its foot */}
          <line x1={CX} y1={CY + 8} x2={CX} y2={CY + 112} stroke="url(#cz-orr-metal)" strokeWidth="3" />
          <rect x={CX - 5} y={CY + 40} width="10" height="4" rx="1.5" fill={DARK} stroke={BRASS} strokeWidth="0.9" />
          <rect x={CX - 5} y={CY + 76} width="10" height="4" rx="1.5" fill={DARK} stroke={BRASS} strokeWidth="0.9" />
          {/* bracket foot */}
          <path d="M 128 301 L 172 301 L 166 291 L 134 291 Z" fill={DARK} stroke="url(#cz-orr-metal)" strokeWidth="1.3" strokeLinejoin="round" />
          <circle cx="138" cy="296" r="1.1" fill={BRASS_BRIGHT} />
          <circle cx="162" cy="296" r="1.1" fill={BRASS_BRIGHT} />
        </g>

        {/* the Hermit: small hooded figure on an axis bracket, staff in hand */}
        <g className="cz-orr-fade" style={{ "--d": "1.15s" } as CSSProperties}>
          {/* little bracket he stands on */}
          <path d="M 122 217 L 148 217 L 144 221 L 126 221 Z" fill={DARK} stroke={BRASS} strokeWidth="0.9" />
          {/* hooded robe */}
          <path
            d="M 128 193 Q 124 206 126 217 L 144 217 Q 146 206 142 193"
            fill={DARK}
            stroke={BRASS}
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          {/* hood */}
          <path d="M 128 195 Q 127 178 135 176 Q 143 178 142 195" fill={DARK} stroke={BRASS} strokeWidth="1.3" />
          {/* shadowed face opening */}
          <ellipse cx="135" cy="187" rx="3.6" ry="4.6" fill="#040302" />
          {/* robe fold engraving */}
          <path d="M 131 199 Q 130 208 131 215" fill="none" stroke={BRASS_DIM} strokeWidth="0.7" opacity="0.8" />
          <path d="M 139 199 Q 140 208 139 215" fill="none" stroke={BRASS_DIM} strokeWidth="0.7" opacity="0.8" />
          {/* staff in the left hand */}
          <line x1="122" y1="182" x2="126" y2="219" stroke={BRASS} strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="122" cy="180.5" r="1.3" fill={BRASS_BRIGHT} />
          {/* raised right arm reaching to the lantern */}
          <path d="M 141 200 Q 147 194 149 190" fill="none" stroke={BRASS} strokeWidth="1.3" strokeLinecap="round" />
        </g>

        {/* the lantern sun-bulb burning where the Sun would be */}
        <g className="cz-orr-fade" style={{ "--d": "1.35s" } as CSSProperties}>
          <circle className="cz-orr-glow" cx={CX} cy={CY} r="26" fill="url(#cz-orr-lantern)" />
          {/* lantern cage */}
          <circle cx={CX} cy={CY} r="8.5" fill="url(#cz-orr-bulb)" stroke={BRASS_BRIGHT} strokeWidth="1.2" />
          <path d="M 143.5 185 A 8.5 8.5 0 0 1 156.5 185" fill="none" stroke={BRASS_DIM} strokeWidth="0.7" opacity="0.8" />
          <path d="M 146 177.5 L 146 179.5 M 154 177.5 L 154 179.5" stroke={BRASS_BRIGHT} strokeWidth="0.8" />
          <path d="M 147 177.5 Q 150 174 153 177.5" fill="none" stroke={BRASS_BRIGHT} strokeWidth="0.9" />
          {/* six-pointed star of light inside */}
          <path d="M 150 181.5 L 151.8 185 L 150 188.5 L 148.2 185 Z" fill="#fff6d8" />
          {/* sun glyph engraved below the hub */}
          <text
            x={CX + 13}
            y={CY + 14}
            fontFamily="'DejaVu Sans', 'Segoe UI Symbol', Georgia, serif"
            fontSize="7.5"
            fill={BRASS_BRIGHT}
            opacity="0.85"
          >
            ☉︎
          </text>
          {/* hub cap over the arm roots */}
          <circle cx={CX} cy={CY + 8} r="3.2" fill={DARK} stroke={BRASS_BRIGHT} strokeWidth="1" />
        </g>

        {/* brass plaque: IX, hanging from the top frame */}
        <g className="cz-orr-fade" style={{ "--d": "1.5s" } as CSSProperties}>
          <line x1="150" y1="12" x2="150" y2="28" stroke={BRASS_DIM} strokeWidth="0.9" />
          <rect x="128" y="28" width="44" height="22" rx="2.5" fill={DARK} stroke="url(#cz-orr-frame)" strokeWidth="1.2" />
          <circle cx="134" cy="39" r="1.1" fill={BRASS_BRIGHT} />
          <circle cx="166" cy="39" r="1.1" fill={BRASS_BRIGHT} />
          <text
            x="150"
            y="43.5"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="700"
            fontSize="12"
            fill={BRASS_BRIGHT}
          >
            IX
          </text>
        </g>

        {/* engraved title */}
        <g className="cz-orr-fade" style={{ "--d": "1.6s" } as CSSProperties}>
          <line x1="58" y1="392" x2="242" y2="392" stroke={BRASS_DIM} strokeWidth="0.8" />
          <path d="M 50 392 L 54 388.5 L 58 392 L 54 395.5 Z" fill={BRASS} />
          <path d="M 242 392 L 246 388.5 L 250 392 L 246 395.5 Z" fill={BRASS} />
          <text
            x="150"
            y="417"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="700"
            fontSize="17"
            letterSpacing="5"
            fill={BRASS_BRIGHT}
          >
            THE HERMIT
          </text>
          <line x1="58" y1="426" x2="242" y2="426" stroke={BRASS_DIM} strokeWidth="0.8" />
        </g>
      </svg>
    </figure>
  );
}
