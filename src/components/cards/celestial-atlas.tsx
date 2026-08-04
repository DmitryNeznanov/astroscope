/**
 * Celestial Atlas — The Hermit (IX)
 *
 * A plate from a 1700s Uranometria: deep midnight-blue card, gold ink.
 * The Hermit is rendered as a constellation — bright star points joined by
 * hairline gold lines — with his lantern as the brightest star. Engraved
 * coordinate circles, meridian arcs, declination grid, labeled neighbor
 * stars, a zodiac band of twelve glyph plates, a compass-rose "IX"
 * medallion, and engraved serif "THE HERMIT".
 *
 * Server-component safe: no hooks, no event handlers. All motion is CSS in
 * the scoped <style> block (prefix `cz-atlas-`), guarded by
 * prefers-reduced-motion.
 */

const SERIF = "Georgia, 'Times New Roman', 'Palatino Linotype', serif";

const GOLD = "#d4af37";
const GOLD_BRIGHT = "#f2d675";
const GOLD_DIM = "rgba(212, 175, 55, 0.55)";
const INK = "#0b1026";

/* ------------------------------------------------------------------ */
/* Constellation geometry (viewBox 400 x 600)                          */
/* ------------------------------------------------------------------ */

interface Star {
  x: number;
  y: number;
  r: number;
  /** load-reveal delay in seconds */
  d: number;
  dim?: boolean;
  lantern?: boolean;
}

const STARS: Star[] = [
  { x: 200, y: 150, r: 2.6, d: 0.05 }, // 0 hood apex
  { x: 176, y: 172, r: 2.2, d: 0.12 }, // 1 hood left
  { x: 224, y: 172, r: 2.2, d: 0.12 }, // 2 hood right
  { x: 200, y: 188, r: 1.6, d: 0.2, dim: true }, // 3 veiled face
  { x: 170, y: 214, r: 2.4, d: 0.25 }, // 4 left shoulder
  { x: 232, y: 210, r: 2.4, d: 0.25 }, // 5 right shoulder
  { x: 146, y: 188, r: 2.0, d: 0.32 }, // 6 raised elbow
  { x: 132, y: 156, r: 2.0, d: 0.4 }, // 7 lantern hand
  { x: 126, y: 132, r: 4.0, d: 0.5, lantern: true }, // 8 LANTERN (brightest)
  { x: 252, y: 242, r: 1.9, d: 0.32 }, // 9 staff elbow
  { x: 260, y: 272, r: 2.0, d: 0.4 }, // 10 staff hand
  { x: 268, y: 176, r: 2.2, d: 0.48 }, // 11 staff top
  { x: 252, y: 372, r: 2.0, d: 0.55 }, // 12 staff foot
  { x: 200, y: 262, r: 2.2, d: 0.3 }, // 13 breast
  { x: 194, y: 320, r: 1.9, d: 0.38 }, // 14 mid robe
  { x: 162, y: 382, r: 2.3, d: 0.5 }, // 15 hem left
  { x: 200, y: 396, r: 1.8, d: 0.58 }, // 16 hem centre
  { x: 238, y: 382, r: 2.3, d: 0.5 }, // 17 hem right
  { x: 126, y: 117, r: 1.2, d: 0.62 }, // 18 lantern cage top
  { x: 140, y: 132, r: 1.2, d: 0.66 }, // 19 lantern cage right
  { x: 126, y: 147, r: 1.2, d: 0.7 }, // 20 lantern cage base
  { x: 112, y: 132, r: 1.2, d: 0.66 }, // 21 lantern cage left
];

/** Pairs of star indices joined by hairline gold lines. */
const LINKS: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [1, 4],
  [2, 5],
  [4, 13],
  [5, 13],
  [13, 14],
  [4, 6],
  [6, 7],
  [7, 8],
  [5, 9],
  [9, 10],
  [10, 11],
  [10, 12],
  [14, 15],
  [14, 17],
  [15, 16],
  [16, 17],
  [18, 19],
  [19, 20],
  [20, 21],
  [21, 18],
  [7, 20],
];

/** Faint named neighbor stars, in the manner of atlas plates. */
const NEIGHBORS = [
  { x: 84, y: 300, label: "α Erem", dx: 10, dy: 4 },
  { x: 318, y: 322, label: "ζ Mont", dx: -58, dy: 4 },
  { x: 304, y: 152, label: "β Sol", dx: 10, dy: 4 },
  { x: 96, y: 442, label: "η Cael", dx: 10, dy: 4 },
];

/** Deterministic field of tiny background stars. */
const FIELD = Array.from({ length: 44 }, (_, i) => ({
  x: 20 + ((i * 97 + 31) % 360),
  y: 26 + ((i * 57 + 89) % 430),
  r: 0.5 + ((i * 13) % 10) / 16,
  dur: 15 + ((i * 7) % 35), // 15–49s twinkle cycles
  delay: -((i * 2.7) % 12),
}));

/** Degree ticks around the great coordinate circle. */
const TICKS = Array.from({ length: 72 }, (_, i) => {
  const a = (i * 5 * Math.PI) / 180;
  const major = i % 6 === 0;
  const r1 = 168;
  const r2 = major ? 178 : 173;
  return {
    x1: 200 + r1 * Math.cos(a),
    y1: 268 + r1 * Math.sin(a),
    x2: 200 + r2 * Math.cos(a),
    y2: 268 + r2 * Math.sin(a),
    major,
  };
});

const ZODIAC = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

const COMPASS_SPOKES = Array.from({ length: 8 }, (_, i) => {
  const a = (i * 45 * Math.PI) / 180;
  const len = i % 2 === 0 ? 24 : 15;
  return {
    x2: 200 + len * Math.cos(a),
    y2: 64 + len * Math.sin(a),
    long: i % 2 === 0,
  };
});

export default function CelestialAtlasCard() {
  return (
    <figure
      className="cz-atlas-root"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
      role="img"
      aria-label="The Hermit tarot card rendered as an antique celestial star atlas"
    >
      <style>{`
        .cz-atlas-root { position: relative; overflow: hidden; border-radius: 10px; background: ${INK}; }
        .cz-atlas-root svg { display: block; width: 100%; height: 100%; }

        /* ---- load reveal: constellation draws itself star by star ---- */
        .cz-atlas-star {
          transform-box: fill-box;
          transform-origin: center;
          animation: cz-atlas-star-pop 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .cz-atlas-link {
          stroke-dasharray: 1;
          animation: cz-atlas-link-draw 0.5s ease-out both;
        }
        .cz-atlas-fade { animation: cz-atlas-fade-in 0.9s ease-out both; }

        @keyframes cz-atlas-star-pop {
          from { opacity: 0; transform: scale(0.2); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes cz-atlas-link-draw {
          from { opacity: 0; stroke-dashoffset: 1; }
          to { opacity: 1; stroke-dashoffset: 0; }
        }
        @keyframes cz-atlas-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* ---- ambient: very slow, low amplitude ---- */
        .cz-atlas-twinkle { animation: cz-atlas-twinkle 20s ease-in-out infinite; }
        @keyframes cz-atlas-twinkle {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.85; }
        }
        .cz-atlas-lantern-glow { animation: cz-atlas-lantern 22s ease-in-out infinite; }
        @keyframes cz-atlas-lantern {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.62; }
        }
        .cz-atlas-ring-breathe { animation: cz-atlas-breathe 46s ease-in-out infinite; }
        @keyframes cz-atlas-breathe {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.72; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cz-atlas-root *, .cz-atlas-root *::before, .cz-atlas-root *::after {
            animation: none !important;
          }
        }
      `}</style>

      <svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <radialGradient id="cz-atlas-sky" cx="50%" cy="38%" r="80%">
            <stop offset="0%" stopColor="#16204a" />
            <stop offset="45%" stopColor="#0e1533" />
            <stop offset="100%" stopColor="#070b1d" />
          </radialGradient>
          <radialGradient id="cz-atlas-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={GOLD_BRIGHT} stopOpacity="0.9" />
            <stop offset="35%" stopColor={GOLD} stopOpacity="0.35" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </radialGradient>
          <filter id="cz-atlas-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.83  0 0 0 0 0.68  0 0 0 0 0.38  0 0 0 0.05 0" />
          </filter>
        </defs>

        {/* sky + paper grain */}
        <rect x="0" y="0" width="400" height="600" fill="url(#cz-atlas-sky)" />
        <rect x="0" y="0" width="400" height="600" filter="url(#cz-atlas-grain)" />

        {/* double engraved frame */}
        <g className="cz-atlas-fade" style={{ animationDelay: "0.1s" }}>
          <rect x="12" y="12" width="376" height="576" fill="none" stroke={GOLD_DIM} strokeWidth="1.4" />
          <rect x="18" y="18" width="364" height="564" fill="none" stroke={GOLD_DIM} strokeWidth="0.5" />
        </g>

        {/* engraved coordinate system: great circle, ticks, ecliptic, declinations */}
        <g className="cz-atlas-fade" style={{ animationDelay: "0.35s" }}>
          <circle cx="200" cy="268" r="170" fill="none" stroke={GOLD} strokeOpacity="0.16" strokeWidth="0.7" />
          <circle cx="200" cy="268" r="178" fill="none" stroke={GOLD} strokeOpacity="0.1" strokeWidth="0.4" />
          {TICKS.map((t, i) => (
            <line
              key={i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={GOLD}
              strokeOpacity={t.major ? 0.4 : 0.2}
              strokeWidth={t.major ? 0.7 : 0.4}
            />
          ))}
          <g className="cz-atlas-ring-breathe">
            <ellipse
              cx="200"
              cy="268"
              rx="196"
              ry="58"
              fill="none"
              stroke={GOLD}
              strokeOpacity="0.22"
              strokeWidth="0.6"
              strokeDasharray="5 4"
              transform="rotate(-18 200 268)"
            />
            <ellipse
              cx="200"
              cy="268"
              rx="170"
              ry="170"
              fill="none"
              stroke={GOLD}
              strokeOpacity="0.12"
              strokeWidth="0.5"
              transform="rotate(32 200 268) scale(1 0.32) translate(0 570)"
            />
          </g>
          {/* declination grid */}
          {[170, 230, 306, 366, 426].map((y) => (
            <line
              key={y}
              x1="52"
              y1={y}
              x2="348"
              y2={y}
              stroke={GOLD}
              strokeOpacity="0.08"
              strokeWidth="0.5"
              strokeDasharray="2 5"
            />
          ))}
          <line x1="200" y1="70" x2="200" y2="470" stroke={GOLD} strokeOpacity="0.1" strokeWidth="0.5" strokeDasharray="2 5" />
        </g>

        {/* mountain ridge beneath the figure — the peak of the plate */}
        <g className="cz-atlas-fade" style={{ animationDelay: "1.15s" }}>
          <polyline
            points="70,452 132,410 168,436 205,402 244,432 282,406 330,452"
            fill="none"
            stroke={GOLD}
            strokeOpacity="0.28"
            strokeWidth="0.7"
          />
          <polyline
            points="96,452 150,420 205,452"
            fill="none"
            stroke={GOLD}
            strokeOpacity="0.14"
            strokeWidth="0.5"
          />
        </g>

        {/* background star field — twinkles very slowly, at varied rates */}
        <g className="cz-atlas-fade" style={{ animationDelay: "0.55s" }}>
          {FIELD.map((s, i) => (
            <circle
              key={i}
              className="cz-atlas-twinkle"
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill={GOLD_BRIGHT}
              style={{ animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }}
            />
          ))}
        </g>

        {/* labeled neighbor stars */}
        <g className="cz-atlas-fade" style={{ animationDelay: "1.25s" }}>
          {NEIGHBORS.map((n) => (
            <g key={n.label}>
              <circle cx={n.x} cy={n.y} r="1.6" fill={GOLD} fillOpacity="0.8" />
              <circle cx={n.x} cy={n.y} r="4.5" fill="none" stroke={GOLD} strokeOpacity="0.35" strokeWidth="0.4" />
              <text
                x={n.x + n.dx}
                y={n.y + n.dy}
                fill={GOLD}
                fillOpacity="0.75"
                fontSize="9"
                fontFamily={SERIF}
                fontStyle="italic"
                letterSpacing="0.5"
              >
                {n.label}
              </text>
            </g>
          ))}
        </g>

        {/* connecting hairlines, drawn in sequence */}
        <g>
          {LINKS.map(([a, b], i) => {
            const delay = Math.max(STARS[a].d, STARS[b].d) + 0.1;
            return (
              <line
                key={i}
                className="cz-atlas-link"
                pathLength={1}
                x1={STARS[a].x}
                y1={STARS[a].y}
                x2={STARS[b].x}
                y2={STARS[b].y}
                stroke={GOLD}
                strokeOpacity="0.55"
                strokeWidth="0.55"
                style={{ animationDelay: `${delay}s` }}
              />
            );
          })}
        </g>

        {/* the lantern's halo — appears with its star, then breathes slowly */}
        <circle
          className="cz-atlas-star"
          cx="126"
          cy="132"
          r="26"
          fill="url(#cz-atlas-glow)"
          style={{ animationDelay: "0.5s" }}
        />
        <circle className="cz-atlas-lantern-glow" cx="126" cy="132" r="26" fill="url(#cz-atlas-glow)" />

        {/* constellation star points, popping in one by one */}
        <g>
          {STARS.map((s, i) => (
            <g key={i}>
              <circle
                className="cz-atlas-star"
                cx={s.x}
                cy={s.y}
                r={s.r}
                fill={s.lantern ? GOLD_BRIGHT : s.dim ? GOLD_DIM : GOLD}
                style={{ animationDelay: `${s.d}s` }}
              />
              {!s.dim && !s.lantern && (
                <circle
                  className="cz-atlas-star"
                  cx={s.x}
                  cy={s.y}
                  r={s.r + 2.4}
                  fill="none"
                  stroke={GOLD}
                  strokeOpacity="0.28"
                  strokeWidth="0.4"
                  style={{ animationDelay: `${s.d}s` }}
                />
              )}
            </g>
          ))}
          {/* four-point sparkle on the lantern star */}
          <g className="cz-atlas-fade" style={{ animationDelay: "0.75s" }}>
            <line x1="126" y1="120" x2="126" y2="144" stroke={GOLD_BRIGHT} strokeOpacity="0.85" strokeWidth="0.6" />
            <line x1="114" y1="132" x2="138" y2="132" stroke={GOLD_BRIGHT} strokeOpacity="0.85" strokeWidth="0.6" />
          </g>
        </g>

        {/* compass-rose medallion with IX */}
        <g className="cz-atlas-fade" style={{ animationDelay: "1.35s" }}>
          <circle cx="200" cy="64" r="30" fill={INK} fillOpacity="0.65" stroke={GOLD} strokeOpacity="0.7" strokeWidth="0.9" />
          <circle cx="200" cy="64" r="25" fill="none" stroke={GOLD} strokeOpacity="0.4" strokeWidth="0.5" />
          {COMPASS_SPOKES.map((s, i) => (
            <line
              key={i}
              x1="200"
              y1="64"
              x2={s.x2}
              y2={s.y2}
              stroke={GOLD}
              strokeOpacity={s.long ? 0.7 : 0.4}
              strokeWidth={s.long ? 0.8 : 0.5}
            />
          ))}
          <circle cx="200" cy="64" r="16" fill={INK} stroke={GOLD} strokeOpacity="0.8" strokeWidth="0.7" />
          <text
            x="200"
            y="69"
            textAnchor="middle"
            fill={GOLD_BRIGHT}
            fontSize="13"
            fontFamily={SERIF}
            letterSpacing="1"
          >
            IX
          </text>
        </g>

        {/* engraved title with flanking rules */}
        <g className="cz-atlas-fade" style={{ animationDelay: "1.5s" }}>
          <line x1="60" y1="528" x2="106" y2="528" stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.6" />
          <line x1="294" y1="528" x2="340" y2="528" stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.6" />
          <text
            x="200"
            y="532"
            textAnchor="middle"
            fill={GOLD_BRIGHT}
            fontSize="17"
            fontFamily={SERIF}
            letterSpacing="6"
          >
            THE HERMIT
          </text>
        </g>

        {/* zodiac band: twelve engraved glyph plates */}
        <g className="cz-atlas-fade" style={{ animationDelay: "1.6s" }}>
          <rect x="18" y="546" width="364" height="30" fill={GOLD} fillOpacity="0.05" stroke={GOLD_DIM} strokeWidth="0.7" />
          {ZODIAC.map((glyph, i) => {
            const cellW = 364 / 12;
            const cx = 18 + cellW * i + cellW / 2;
            return (
              <g key={glyph}>
                {i > 0 && (
                  <line
                    x1={18 + cellW * i}
                    y1="546"
                    x2={18 + cellW * i}
                    y2="576"
                    stroke={GOLD}
                    strokeOpacity="0.3"
                    strokeWidth="0.5"
                  />
                )}
                <text
                  x={cx}
                  y="567"
                  textAnchor="middle"
                  fill={GOLD}
                  fillOpacity="0.9"
                  fontSize="14"
                  fontFamily={SERIF}
                >
                  {glyph}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </figure>
  );
}
