// ARMILLARY SPHERE — The Hermit (IX)
// A Renaissance armillary sphere in dark bronze on black: the Hermit stands
// small at the center of the instrument while nested rings (horizon band with
// engraved ticks, tilted meridian, equator, tropics, ecliptic band carrying
// the zodiac glyphs) close around him — back arcs behind the figure, front
// arcs occluding him. Axis tilted ~23.5°. Finial at the north pole, bracket
// stand below, 'IX' on a small hanging plaque, engraved caps title.
// Server-component safe: no hooks, no client directive.

import type { CSSProperties } from "react";

const CX = 150;
const CY = 200;
const DEG = Math.PI / 180;

// horizon band geometry
const H_RX = 118;
const H_RY = 24;
const H_IN_RX = 110;
const H_IN_RY = 17;

// ecliptic band geometry (tilted +23.5° against the equator)
const E_RX = 110;
const E_RY = 34;
const E_TILT = 23.5;

const ZODIAC = [
  "♈︎",
  "♉︎",
  "♊︎",
  "♋︎",
  "♌︎",
  "♍︎",
  "♎︎",
  "♏︎",
  "♐︎",
  "♑︎",
  "♒︎",
  "♓︎",
];

// glyph seats: along the ecliptic band, pushed slightly outward, pre-rotated
const GLYPHS = ZODIAC.map((g, k) => {
  const t = (k * 30 - 90) * DEG;
  const lx = E_RX * 1.16 * Math.cos(t);
  const ly = E_RY * 1.16 * Math.sin(t);
  const a = E_TILT * DEG;
  return {
    g,
    x: CX + lx * Math.cos(a) - ly * Math.sin(a),
    y: CY + lx * Math.sin(a) + ly * Math.cos(a),
  };
});

// engraved tick marks across the horizon band, split into back/front halves
const TICKS = Array.from({ length: 36 }, (_, k) => {
  const t = k * 10 * DEG;
  const major = k % 3 === 0;
  return {
    major,
    back: Math.sin(t) < 0,
    x1: CX + (H_RX - 1) * Math.cos(t),
    y1: CY + (H_RY - 0.8) * Math.sin(t),
    x2: CX + (H_IN_RX + (major ? 0.5 : 1.5)) * Math.cos(t),
    y2: CY + (H_IN_RY + (major ? 1 : 2)) * Math.sin(t),
  };
});

const BRONZE = "#a07c3e";
const BRONZE_DIM = "#6b5228";
const BRONZE_BRIGHT = "#e8c87a";
const BRONZE_PALE = "#f6e5b8";
const DARK = "#120d08";

// half-arc path of an axis-aligned ellipse centered on (CX, CY)
// upper = back (far) half, lower = front (near) half
function halfArc(rx: number, ry: number, upper: boolean): string {
  return `M ${CX - rx} ${CY} A ${rx} ${ry} 0 0 ${upper ? 1 : 0} ${CX + rx} ${CY}`;
}

export default function ArmillarySphereHermitCard() {
  return (
    <figure
      className="cz-arm-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
    >
      <style>{`
        .cz-arm-card { position: relative; overflow: hidden; background: #070503; }
        .cz-arm-card svg { display: block; width: 100%; height: 100%; }

        /* load: rings swing into place one by one around the figure */
        .cz-arm-in {
          transform-box: view-box;
          transform-origin: 150px 200px;
          animation: cz-arm-ring-in 1.6s cubic-bezier(.25,.75,.25,1) backwards;
          animation-delay: var(--d, 0s);
        }
        .cz-arm-figure { animation: cz-arm-ink-in .9s ease-out 1.05s backwards; }
        .cz-arm-fade   { animation: cz-arm-ink-in .9s ease-out var(--d, 1.3s) backwards; }

        /* ambient: ecliptic ring turns imperceptibly slowly */
        .cz-arm-ecl-spin {
          transform-box: view-box;
          transform-origin: 150px 200px;
          animation: cz-arm-spin 120s linear infinite;
        }
        /* ambient: a soft gleam travels the horizon band */
        .cz-arm-gleam {
          stroke-dasharray: 26 900;
          animation: cz-arm-gleam 90s linear infinite;
        }
        /* ambient: lantern breathes */
        .cz-arm-glow { animation: cz-arm-breathe 16s ease-in-out infinite; }

        @keyframes cz-arm-ring-in {
          from { opacity: 0; transform: rotate(var(--r, 14deg)); }
          to   { opacity: 1; transform: rotate(0deg); }
        }
        @keyframes cz-arm-ink-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cz-arm-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes cz-arm-gleam {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -926; }
        }
        @keyframes cz-arm-breathe {
          0%, 100% { opacity: .75; }
          50%      { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cz-arm-in, .cz-arm-figure, .cz-arm-fade,
          .cz-arm-ecl-spin, .cz-arm-gleam, .cz-arm-glow {
            animation: none;
          }
        }
      `}</style>

      <svg
        viewBox="0 0 300 450"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="The Hermit, tarot card nine, standing inside a bronze Renaissance armillary sphere"
      >
        <defs>
          <radialGradient id="cz-arm-bg" cx="50%" cy="44%" r="78%">
            <stop offset="0%" stopColor="#1d1509" />
            <stop offset="55%" stopColor="#100b06" />
            <stop offset="100%" stopColor="#050403" />
          </radialGradient>
          {/* vertical metallic sheen shared by every ring stroke */}
          <linearGradient
            id="cz-arm-metal"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="80"
            x2="0"
            y2="330"
          >
            <stop offset="0%" stopColor="#4a3517" />
            <stop offset="30%" stopColor="#a07c3e" />
            <stop offset="46%" stopColor="#f0d999" />
            <stop offset="58%" stopColor="#8a6a34" />
            <stop offset="100%" stopColor="#3a2a12" />
          </linearGradient>
          <linearGradient id="cz-arm-frame" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8a6a34" />
            <stop offset="50%" stopColor="#e0bd72" />
            <stop offset="100%" stopColor="#5a421e" />
          </linearGradient>
          <radialGradient id="cz-arm-lantern" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffedbb" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#e8b45a" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#e8b45a" stopOpacity="0" />
          </radialGradient>
          {/* corner rivet: domed screw head with a slot */}
          <g id="cz-arm-rivet">
            <circle r="3.6" fill="none" stroke="url(#cz-arm-frame)" strokeWidth="1.2" />
            <circle r="1.3" fill="#0a0704" stroke={BRONZE_BRIGHT} strokeWidth="0.5" />
            <line x1="-2.4" y1="0" x2="2.4" y2="0" stroke={BRONZE_BRIGHT} strokeWidth="0.7" />
          </g>
        </defs>

        {/* blackened oak ground */}
        <rect x="0" y="0" width="300" height="450" fill="url(#cz-arm-bg)" />
        {/* faint star dust */}
        <g fill={BRONZE_PALE} opacity="0.5">
          <circle cx="48" cy="96" r="0.8" />
          <circle cx="252" cy="74" r="0.7" />
          <circle cx="266" cy="150" r="0.9" />
          <circle cx="38" cy="288" r="0.7" />
          <circle cx="258" cy="316" r="0.8" />
          <circle cx="70" cy="352" r="0.6" />
          <circle cx="232" cy="370" r="0.7" />
        </g>

        {/* thin metallic frame with riveted corners */}
        <rect x="12" y="12" width="276" height="426" fill="none" stroke="url(#cz-arm-frame)" strokeWidth="1.6" />
        <rect x="18" y="18" width="264" height="414" fill="none" stroke={BRONZE_DIM} strokeWidth="0.5" opacity="0.7" />
        <use href="#cz-arm-rivet" x="24" y="24" />
        <use href="#cz-arm-rivet" x="276" y="24" />
        <use href="#cz-arm-rivet" x="24" y="426" />
        <use href="#cz-arm-rivet" x="276" y="426" />

        {/* bracket stand below the sphere */}
        <g className="cz-arm-in" style={{ "--d": "1s", "--r": "6deg" } as CSSProperties}>
          <path
            d="M 118 232 Q 112 262 128 280 L 172 280 Q 188 262 182 232"
            fill="none"
            stroke="url(#cz-arm-metal)"
            strokeWidth="3"
          />
          <rect x="104" y="280" width="92" height="7" rx="2.5" fill={DARK} stroke="url(#cz-arm-metal)" strokeWidth="1.4" />
          <rect x="118" y="289" width="64" height="5" rx="2" fill={DARK} stroke={BRONZE_DIM} strokeWidth="0.9" />
          <circle cx="118" cy="283.5" r="1.2" fill={BRONZE_BRIGHT} />
          <circle cx="182" cy="283.5" r="1.2" fill={BRONZE_BRIGHT} />
        </g>

        {/* ======== BACK HALVES (behind the Hermit) ======== */}

        {/* horizon band, far half + its engraved ticks */}
        <g className="cz-arm-in" style={{ "--d": "0s", "--r": "-12deg" } as CSSProperties}>
          <path d={halfArc(H_RX, H_RY, true)} fill="none" stroke="url(#cz-arm-metal)" strokeWidth="2.4" />
          <path d={halfArc(H_IN_RX, H_IN_RY, true)} fill="none" stroke="url(#cz-arm-metal)" strokeWidth="1.2" />
          {TICKS.filter((t) => t.back).map((t, i) => (
            <line
              key={i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={BRONZE_BRIGHT}
              strokeWidth={t.major ? 0.9 : 0.45}
              opacity="0.85"
            />
          ))}
        </g>

        {/* meridian ring, far half — axis tilted ~23.5° */}
        <g className="cz-arm-in" style={{ "--d": ".2s", "--r": "16deg" } as CSSProperties}>
          <g transform={`rotate(-23.5 ${CX} ${CY})`}>
            <path d={halfArc(30, 112, true)} fill="none" stroke="url(#cz-arm-metal)" strokeWidth="2" />
            <path d={halfArc(25, 108, true)} fill="none" stroke={BRONZE_DIM} strokeWidth="0.7" opacity="0.8" />
          </g>
        </g>

        {/* equator + tropics, far halves */}
        <g className="cz-arm-in" style={{ "--d": ".45s", "--r": "-18deg" } as CSSProperties}>
          <g transform={`rotate(-23.5 ${CX} ${CY})`}>
            <path d={halfArc(100, 28, true)} fill="none" stroke="url(#cz-arm-metal)" strokeWidth="1.5" />
            <path d={halfArc(97, 25, true)} fill="none" stroke={BRONZE_DIM} strokeWidth="0.5" opacity="0.7" />
          </g>
          {/* arctic + antarctic circles, offset along the tilted axis */}
          <g transform={`translate(-16.7 -38.5) rotate(-23.5 ${CX} ${CY})`}>
            <ellipse cx={CX} cy={CY} rx="80" ry="21" fill="none" stroke={BRONZE_DIM} strokeWidth="0.9" />
          </g>
          <g transform={`translate(16.7 38.5) rotate(-23.5 ${CX} ${CY})`}>
            <ellipse cx={CX} cy={CY} rx="80" ry="21" fill="none" stroke={BRONZE_DIM} strokeWidth="0.9" />
          </g>
        </g>

        {/* ecliptic band, far half — turns on its own, forever */}
        <g className="cz-arm-in" style={{ "--d": ".7s", "--r": "20deg" } as CSSProperties}>
          <g className="cz-arm-ecl-spin">
            <g transform={`rotate(${E_TILT} ${CX} ${CY})`}>
              <path d={halfArc(E_RX, E_RY, true)} fill="none" stroke="url(#cz-arm-metal)" strokeWidth="2.6" />
              <path d={halfArc(E_RX - 6, E_RY - 4, true)} fill="none" stroke={BRONZE_DIM} strokeWidth="0.8" opacity="0.8" />
            </g>
            {/* zodiac glyphs engraved along the band */}
            {GLYPHS.map(({ g, x, y }) => (
              <text
                key={g}
                x={x}
                y={y + 2.6}
                textAnchor="middle"
                fontFamily="'DejaVu Sans', 'Segoe UI Symbol', Georgia, serif"
                fontSize="8.5"
                fill={BRONZE_BRIGHT}
                opacity="0.95"
              >
                {g}
              </text>
            ))}
          </g>
        </g>

        {/* axis pole finial, north end */}
        <g className="cz-arm-in" style={{ "--d": ".9s", "--r": "-8deg" } as CSSProperties}>
          <line x1="108" y1="102" x2="102.6" y2="90" stroke="url(#cz-arm-metal)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="102" cy="88" r="3" fill={DARK} stroke={BRONZE_BRIGHT} strokeWidth="1.1" />
          <path d="M 102 84 L 102 78" stroke={BRONZE_BRIGHT} strokeWidth="1" strokeLinecap="round" />
          <circle cx="102" cy="76.5" r="1.3" fill={BRONZE_BRIGHT} />
        </g>

        {/* ======== THE HERMIT, small at the center of the instrument ======== */}
        <g className="cz-arm-figure">
          {/* hooded robe silhouette */}
          <path
            d="M 138 176 Q 133 202 135 236 L 165 236 Q 167 202 162 176"
            fill={DARK}
            stroke={BRONZE}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          {/* hood */}
          <path
            d="M 138 178 Q 137 156 150 153 Q 163 156 162 178"
            fill={DARK}
            stroke={BRONZE}
            strokeWidth="1.6"
          />
          {/* shadowed face opening */}
          <ellipse cx="150" cy="168" rx="5.2" ry="6.4" fill="#050302" />
          {/* robe fold engraving */}
          <path d="M 142 186 Q 140 210 141 232" fill="none" stroke={BRONZE_DIM} strokeWidth="0.8" opacity="0.8" />
          <path d="M 158 186 Q 160 210 159 232" fill="none" stroke={BRONZE_DIM} strokeWidth="0.8" opacity="0.8" />

          {/* staff in the left hand */}
          <line x1="128" y1="158" x2="134" y2="238" stroke={BRONZE} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="128" cy="156" r="1.6" fill={BRONZE_BRIGHT} />

          {/* raised right arm holding the lantern */}
          <path d="M 160 186 Q 170 176 176 166" fill="none" stroke={BRONZE} strokeWidth="1.7" strokeLinecap="round" />

          {/* lantern glow */}
          <circle className="cz-arm-glow" cx="181" cy="156" r="17" fill="url(#cz-arm-lantern)" />
          {/* lantern */}
          <line x1="181" y1="146" x2="181" y2="149" stroke={BRONZE} strokeWidth="0.9" />
          <path
            d="M 175 149 L 187 149 L 185 162 L 177 162 Z"
            fill="#2a1d0c"
            stroke={BRONZE_BRIGHT}
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <path d="M 177 149 L 179 145 L 183 145 L 185 149" fill="none" stroke={BRONZE_BRIGHT} strokeWidth="0.9" />
          {/* six-pointed star of light inside */}
          <path d="M 181 151.5 L 182.6 155.5 L 181 159.5 L 179.4 155.5 Z" fill={BRONZE_PALE} />
        </g>

        {/* ======== FRONT HALVES (occluding the Hermit) ======== */}

        {/* equator + tropics, near halves */}
        <g className="cz-arm-in" style={{ "--d": ".45s", "--r": "-18deg" } as CSSProperties}>
          <g transform={`rotate(-23.5 ${CX} ${CY})`}>
            <path d={halfArc(100, 28, false)} fill="none" stroke="url(#cz-arm-metal)" strokeWidth="1.5" />
            <path d={halfArc(97, 25, false)} fill="none" stroke={BRONZE_DIM} strokeWidth="0.5" opacity="0.7" />
          </g>
        </g>

        {/* ecliptic band, near half (spins in step with its far half) */}
        <g className="cz-arm-in" style={{ "--d": ".7s", "--r": "20deg" } as CSSProperties}>
          <g className="cz-arm-ecl-spin">
            <g transform={`rotate(${E_TILT} ${CX} ${CY})`}>
              <path d={halfArc(E_RX, E_RY, false)} fill="none" stroke="url(#cz-arm-metal)" strokeWidth="2.6" />
              <path d={halfArc(E_RX - 6, E_RY - 4, false)} fill="none" stroke={BRONZE_DIM} strokeWidth="0.8" opacity="0.8" />
            </g>
          </g>
        </g>

        {/* meridian ring, near half — crosses in front of the figure */}
        <g className="cz-arm-in" style={{ "--d": ".2s", "--r": "16deg" } as CSSProperties}>
          <g transform={`rotate(-23.5 ${CX} ${CY})`}>
            <path d={halfArc(30, 112, false)} fill="none" stroke="url(#cz-arm-metal)" strokeWidth="2" />
            <path d={halfArc(25, 108, false)} fill="none" stroke={BRONZE_DIM} strokeWidth="0.7" opacity="0.8" />
          </g>
        </g>

        {/* horizon band, near half + ticks + traveling gleam */}
        <g className="cz-arm-in" style={{ "--d": "0s", "--r": "-12deg" } as CSSProperties}>
          <path d={halfArc(H_RX, H_RY, false)} fill="none" stroke="url(#cz-arm-metal)" strokeWidth="2.4" />
          <path d={halfArc(H_IN_RX, H_IN_RY, false)} fill="none" stroke="url(#cz-arm-metal)" strokeWidth="1.2" />
          {TICKS.filter((t) => !t.back).map((t, i) => (
            <line
              key={i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={BRONZE_BRIGHT}
              strokeWidth={t.major ? 0.9 : 0.45}
              opacity="0.85"
            />
          ))}
          <path
            className="cz-arm-gleam"
            d={halfArc(114, 20.5, false)}
            fill="none"
            stroke={BRONZE_PALE}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.55"
          />
        </g>

        {/* small plaque hanging from the horizon band: IX */}
        <g className="cz-arm-fade" style={{ "--d": "1.25s" } as CSSProperties}>
          <line x1="150" y1="224" x2="150" y2="229" stroke={BRONZE_DIM} strokeWidth="0.8" />
          <rect x="136" y="229" width="28" height="16" rx="2" fill={DARK} stroke="url(#cz-arm-frame)" strokeWidth="1.1" />
          <text
            x="150"
            y="241"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="700"
            fontSize="10"
            fill={BRONZE_BRIGHT}
          >
            IX
          </text>
        </g>

        {/* engraved title */}
        <g className="cz-arm-fade" style={{ "--d": "1.35s" } as CSSProperties}>
          <line x1="58" y1="392" x2="242" y2="392" stroke={BRONZE_DIM} strokeWidth="0.8" />
          <path d="M 50 392 L 54 388.5 L 58 392 L 54 395.5 Z" fill={BRONZE} />
          <path d="M 242 392 L 246 388.5 L 250 392 L 246 395.5 Z" fill={BRONZE} />
          <text
            x="150"
            y="417"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="700"
            fontSize="17"
            letterSpacing="5"
            fill={BRONZE_BRIGHT}
          >
            THE HERMIT
          </text>
          <line x1="58" y1="426" x2="242" y2="426" stroke={BRONZE_DIM} strokeWidth="0.8" />
        </g>
      </svg>
    </figure>
  );
}
