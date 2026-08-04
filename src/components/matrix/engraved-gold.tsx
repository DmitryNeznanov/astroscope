/**
 * Destiny Matrix — ENGRAVED GOLD
 * An engraved brass-instrument treatment: gold hairlines on near-black,
 * nodes as beveled plates with corner rivets, a ticked compass age band,
 * and a glowing brass medallion at the heart.
 * Self-contained: inline SVG + scoped CSS. Server-component safe.
 */

const C = 400;
const OUTER_R = 250;
const RING_OUT = 336;
const RING_IN = 304;
const AGE_R = 320;

type Pt = { x: number; y: number };

function polar(r: number, deg: number): Pt {
  const a = (deg * Math.PI) / 180;
  return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) };
}

function pathThrough(pts: Pt[], close = false): string {
  const d = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
  return close ? `${d} Z` : d;
}

/** Outer octagram nodes: cardinal + diagonal, clockwise from top. */
const OUTER_NODES: { deg: number; n: number; age: string }[] = [
  { deg: -90, n: 7, age: "20y" },
  { deg: -45, n: 17, age: "30y" },
  { deg: 0, n: 10, age: "40y" },
  { deg: 45, n: 17, age: "50y" },
  { deg: 90, n: 7, age: "60y" },
  { deg: 135, n: 15, age: "70y" },
  { deg: 180, n: 8, age: "0y" },
  { deg: -135, n: 15, age: "10y" },
];

/** Twelve inner nodes resting on the spokes, inside the octagram. */
const INNER_NODES: { deg: number; r: number; n: number }[] = [
  { deg: -90, r: 150, n: 19 },
  { deg: -90, r: 88, n: 12 },
  { deg: 0, r: 150, n: 8 },
  { deg: 0, r: 88, n: 20 },
  { deg: 90, r: 150, n: 13 },
  { deg: 90, r: 88, n: 21 },
  { deg: 180, r: 150, n: 22 },
  { deg: 180, r: 88, n: 12 },
  { deg: -45, r: 168, n: 20 },
  { deg: 45, r: 168, n: 8 },
  { deg: 135, r: 168, n: 19 },
  { deg: -135, r: 168, n: 6 },
];

function Plate({ x, y, n, delay }: { x: number; y: number; n: number; delay: string }) {
  const w = 74;
  const h = 46;
  const rivet = (dx: number, dy: number) => (
    <circle key={`${dx},${dy}`} cx={x + dx} cy={y + dy} r={1.8} className="mx-engraved-gold-rivet" />
  );
  return (
    <g className="mx-engraved-gold-stamp" style={{ animationDelay: delay }}>
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={4}
        className="mx-engraved-gold-plate"
      />
      <rect
        x={x - w / 2 + 3.5}
        y={y - h / 2 + 3.5}
        width={w - 7}
        height={h - 7}
        rx={2.5}
        className="mx-engraved-gold-bevel"
      />
      {rivet(-w / 2 + 7.5, -h / 2 + 7.5)}
      {rivet(w / 2 - 7.5, -h / 2 + 7.5)}
      {rivet(w / 2 - 7.5, h / 2 - 7.5)}
      {rivet(-w / 2 + 7.5, h / 2 - 7.5)}
      <text x={x} y={y + 1} className="mx-engraved-gold-num">
        {n}
      </text>
    </g>
  );
}

function InnerNode({ x, y, n, delay }: { x: number; y: number; n: number; delay: string }) {
  return (
    <g className="mx-engraved-gold-stamp" style={{ animationDelay: delay }}>
      <circle cx={x} cy={y} r={14} className="mx-engraved-gold-plate" />
      <circle cx={x} cy={y} r={11} className="mx-engraved-gold-bevel" />
      <text x={x} y={y + 0.5} className="mx-engraved-gold-num-inner">
        {n}
      </text>
    </g>
  );
}

export default function EngravedGoldMatrix() {
  const outerPts = OUTER_NODES.map((o) => polar(OUTER_R, o.deg));

  // Diamond (cardinal square) and axis-aligned square (diagonal square).
  const diamond = [outerPts[0], outerPts[2], outerPts[4], outerPts[6]];
  const square = [outerPts[1], outerPts[3], outerPts[5], outerPts[7]];

  // Compass band ticks: minor every 4°, major every 20°.
  const ticks = [];
  for (let d = 0; d < 360; d += 4) {
    const major = d % 20 === 0;
    const p1 = polar(RING_OUT, d);
    const p2 = polar(major ? RING_OUT - 16 : RING_OUT - 7, d);
    ticks.push(
      <line
        key={d}
        x1={p1.x}
        y1={p1.y}
        x2={p2.x}
        y2={p2.y}
        className={major ? "mx-engraved-gold-tick-major" : "mx-engraved-gold-tick-minor"}
      />,
    );
  }

  // Medallion rivets.
  const rivets = [];
  for (let d = 0; d < 360; d += 45) {
    const p = polar(49, d);
    rivets.push(<circle key={d} cx={p.x} cy={p.y} r={1.7} className="mx-engraved-gold-rivet" />);
  }

  return (
    <figure
      className="mx-engraved-gold"
      style={{ aspectRatio: "1/1", width: "100%", margin: 0 }}
    >
      <style>{`
        .mx-engraved-gold {
          background: radial-gradient(120% 120% at 50% 42%, #14110a 0%, #0a0906 55%, #050403 100%);
          border-radius: 6px;
          overflow: hidden;
        }
        .mx-engraved-gold svg { display: block; width: 100%; height: 100%; }
        .mx-engraved-gold text {
          font-family: Georgia, "Times New Roman", serif;
          text-anchor: middle;
          dominant-baseline: central;
          fill: #e8cd7e;
        }
        .mx-engraved-gold-hair  { fill: none; stroke: #6e5826; stroke-width: 0.7; }
        .mx-engraved-gold-line  { fill: none; stroke: #c9a227; stroke-width: 1.3; }
        .mx-engraved-gold-spoke { fill: none; stroke: #a3842f; stroke-width: 0.9; }
        .mx-engraved-gold-ring  { fill: none; stroke: #c9a227; stroke-width: 1.2; }
        .mx-engraved-gold-plate { fill: #171307; stroke: #c9a227; stroke-width: 1.4; }
        .mx-engraved-gold-bevel { fill: none; stroke: #f0d98c; stroke-width: 0.8; opacity: 0.85; }
        .mx-engraved-gold-rivet { fill: #f0d98c; stroke: #7a5f1e; stroke-width: 0.5; }
        .mx-engraved-gold-tick-minor { stroke: #8a6d2f; stroke-width: 0.7; }
        .mx-engraved-gold-tick-major { stroke: #d4af37; stroke-width: 1.2; }
        .mx-engraved-gold-cartouche { fill: #0a0906; stroke: #8a6d2f; stroke-width: 0.6; }
        .mx-engraved-gold-num {
          font-size: 25px; fill: #f0d98c;
          paint-order: stroke; stroke: #050403; stroke-width: 2.5px;
        }
        .mx-engraved-gold-num-inner {
          font-size: 15px; fill: #e8cd7e;
          paint-order: stroke; stroke: #050403; stroke-width: 2px;
        }
        .mx-engraved-gold-age  { font-size: 15px; letter-spacing: 1.5px; fill: #d4af37; }
        .mx-engraved-gold-head { font-size: 21px; letter-spacing: 4px; fill: #e8cd7e; }
        .mx-engraved-gold-micro{ font-size: 11px; letter-spacing: 3px; fill: #8a6d2f; }
        .mx-engraved-gold-center-num {
          font-size: 46px; fill: #2a1f08;
          paint-order: stroke; stroke: #f5e3a8; stroke-width: 1px;
        }
        /* --- Load reveal (one-shot, ~1.5s): draw-on, stamp, fade --- */
        .mx-engraved-gold-draw {
          stroke-dasharray: 1;
          stroke-dashoffset: 0;
          animation: mx-engraved-gold-draw 1.1s ease-out both;
        }
        .mx-engraved-gold-stamp {
          transform-box: fill-box;
          transform-origin: center;
          animation: mx-engraved-gold-stamp 0.55s cubic-bezier(0.2, 0.9, 0.3, 1.15) both;
        }
        .mx-engraved-gold-fade { animation: mx-engraved-gold-fade 0.9s ease-out both; }
        @keyframes mx-engraved-gold-draw {
          from { stroke-dashoffset: 1; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes mx-engraved-gold-stamp {
          from { opacity: 0; transform: scale(1.18); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes mx-engraved-gold-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        /* --- Ambient: slow medallion glow (22s) + idle dashed halo spin (90s) --- */
        .mx-engraved-gold-glow { animation: mx-engraved-gold-glow 22s ease-in-out infinite; }
        @keyframes mx-engraved-gold-glow {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 0.9; }
        }
        .mx-engraved-gold-spin {
          transform-origin: 400px 400px;
          animation: mx-engraved-gold-spin 90s linear infinite;
        }
        @keyframes mx-engraved-gold-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .mx-engraved-gold-draw,
          .mx-engraved-gold-stamp,
          .mx-engraved-gold-fade,
          .mx-engraved-gold-glow,
          .mx-engraved-gold-spin { animation: none !important; }
        }
      `}</style>

      <svg viewBox="0 0 800 800" role="img" aria-label="Destiny Matrix engraved gold diagram">
        <defs>
          <radialGradient id="mx-engraved-gold-halo">
            <stop offset="0%" stopColor="#f0d98c" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#c9a227" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#c9a227" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="mx-engraved-gold-brass" cx="42%" cy="38%" r="75%">
            <stop offset="0%" stopColor="#f5e3a8" />
            <stop offset="55%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#8a6d2f" />
          </radialGradient>
        </defs>

        {/* Engraved plate frame */}
        <rect x={16} y={16} width={768} height={768} className="mx-engraved-gold-hair" />
        <rect x={24} y={24} width={752} height={752} className="mx-engraved-gold-hair" />

        {/* Header */}
        <g className="mx-engraved-gold-fade" style={{ animationDelay: "0.1s" }}>
          <line x1={96} y1={54} x2={150} y2={54} className="mx-engraved-gold-hair" />
          <line x1={650} y1={54} x2={704} y2={54} className="mx-engraved-gold-hair" />
          <text x={C} y={54} className="mx-engraved-gold-head">
            Day 8 · Month 7 · Year 10 · Base 7 · Center 5
          </text>
        </g>

        {/* Compass age band */}
        <circle cx={C} cy={C} r={RING_OUT} pathLength={1} className="mx-engraved-gold-ring mx-engraved-gold-draw" style={{ animationDelay: "0.15s" }} />
        <circle cx={C} cy={C} r={RING_IN} pathLength={1} className="mx-engraved-gold-hair mx-engraved-gold-draw" style={{ animationDelay: "0.25s" }} />
        <g className="mx-engraved-gold-fade" style={{ animationDelay: "0.5s" }}>{ticks}</g>

        {/* Age labels in engraved cartouches on the band */}
        {OUTER_NODES.map((o, i) => {
          const p = polar(AGE_R, o.deg);
          return (
            <g key={o.age} className="mx-engraved-gold-fade" style={{ animationDelay: `${0.9 + i * 0.05}s` }}>
              <rect x={p.x - 19} y={p.y - 11} width={38} height={22} rx={2} className="mx-engraved-gold-cartouche" />
              <text x={p.x} y={p.y + 0.5} className="mx-engraved-gold-age">
                {o.age}
              </text>
            </g>
          );
        })}

        {/* Construction circles */}
        <circle cx={C} cy={C} r={OUTER_R} pathLength={1} className="mx-engraved-gold-hair mx-engraved-gold-draw" style={{ animationDelay: "0.3s" }} />
        <circle cx={C} cy={C} r={150} pathLength={1} className="mx-engraved-gold-hair mx-engraved-gold-draw" style={{ animationDelay: "0.35s" }} />
        <circle cx={C} cy={C} r={88} pathLength={1} className="mx-engraved-gold-hair mx-engraved-gold-draw" style={{ animationDelay: "0.4s" }} />

        {/* The octagram: two overlaid squares */}
        <path d={pathThrough(diamond, true)} pathLength={1} className="mx-engraved-gold-line mx-engraved-gold-draw" style={{ animationDelay: "0.35s" }} />
        <path d={pathThrough(square, true)} pathLength={1} className="mx-engraved-gold-line mx-engraved-gold-draw" style={{ animationDelay: "0.45s" }} />

        {/* Spokes from the heart to each outer node */}
        {outerPts.map((p, i) => (
          <path
            key={i}
            d={`M${C} ${C} L${p.x.toFixed(2)} ${p.y.toFixed(2)}`}
            pathLength={1}
            className="mx-engraved-gold-spoke mx-engraved-gold-draw"
            style={{ animationDelay: `${0.55 + i * 0.03}s` }}
          />
        ))}

        {/* Outer node plates */}
        {OUTER_NODES.map((o, i) => {
          const p = polar(OUTER_R, o.deg);
          return <Plate key={o.deg} x={p.x} y={p.y} n={o.n} delay={`${0.65 + i * 0.06}s`} />;
        })}

        {/* Inner nodes along the spokes */}
        {INNER_NODES.map((o, i) => {
          const p = polar(o.r, o.deg);
          return <InnerNode key={i} x={p.x} y={p.y} n={o.n} delay={`${1.0 + i * 0.03}s`} />;
        })}

        {/* Center brass medallion */}
        <circle cx={C} cy={C} r={66} fill="url(#mx-engraved-gold-halo)" className="mx-engraved-gold-glow" />
        <g className="mx-engraved-gold-stamp" style={{ animationDelay: "1.15s" }}>
          <circle cx={C} cy={C} r={52} className="mx-engraved-gold-plate" />
          <circle cx={C} cy={C} r={46.5} className="mx-engraved-gold-bevel" />
          <circle cx={C} cy={C} r={40} fill="url(#mx-engraved-gold-brass)" stroke="#f0d98c" strokeWidth={0.8} />
          {rivets}
          <text x={C} y={C + 2} className="mx-engraved-gold-center-num">
            5
          </text>
        </g>
        <circle
          cx={C}
          cy={C}
          r={59}
          fill="none"
          stroke="#8a6d2f"
          strokeWidth={0.7}
          strokeDasharray="2 6"
          className="mx-engraved-gold-spin"
          opacity={0.7}
        />

        {/* Engraved micro-captions */}
        <g className="mx-engraved-gold-fade" style={{ animationDelay: "1.35s" }}>
          <line x1={300} y1={752} x2={500} y2={752} className="mx-engraved-gold-hair" />
          <text x={C} y={736} className="mx-engraved-gold-micro">
            FIG. I — THE OCTAGRAM OF YEARS
          </text>
          <text x={C} y={770} className="mx-engraved-gold-micro">
            ENGRAVED PLATE · No 5
          </text>
        </g>
      </svg>
    </figure>
  );
}
