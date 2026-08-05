/**
 * Destiny Matrix — Style Lab variant: SACRED GEOMETRY
 * Precision construction drawing: hairline gold on matte black. The octagram
 * (two overlaid squares) is embedded in its construction geometry — circumscribed
 * and inscribed circles, vesica piscis, faint rotating hexagram grid. Nodes are
 * circle/dot junctions with registration ticks; ages ride a graduated outer ring.
 * Server-safe: CSS-only motion scoped under `mx-sg-`, static under reduced motion.
 */

const CX = 300;
const CY = 300;

const R_NODES = 192; // circumscribed circle through the 8 outer nodes
const RING_IN = 224; // inner edge of the age ring
const RING_OUT = 258; // outer edge of the age ring
const R_AGE = 241; // age label baseline radius
const R_INNER = 112; // inner ring of secondary nodes (on the spokes)
const R_CORE = 70; // innermost diagonal nodes
const R_INSCRIBED = 135.76; // circle inscribed in both squares (R_NODES / sqrt(2))

const GOLD = "#d4af37";
const GOLD_BRIGHT = "#ecd27a";
const GOLD_DIM = "#8a6d2f";
const INK = "#0b0a09";

const FONT =
  "'Avenir Next','Futura','Century Gothic','Helvetica Neue',Arial,sans-serif";

const rad = (deg: number) => (deg * Math.PI) / 180;
const fx = (v: number) => Math.round(v * 100) / 100;

/** Point on the diagram: deg 0 = top, clockwise. */
const pt = (deg: number, r: number) => ({
  x: fx(CX + r * Math.sin(rad(deg))),
  y: fx(CY - r * Math.cos(rad(deg))),
});

const pathFrom = (pts: Array<{ x: number; y: number }>) =>
  pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ") + " Z";

/** The 8 outer nodes, clockwise from top, with their age labels. */
const OUTER = [
  { deg: 0, value: 7, age: 20 },
  { deg: 45, value: 17, age: 30 },
  { deg: 90, value: 10, age: 40 },
  { deg: 135, value: 17, age: 50 },
  { deg: 180, value: 7, age: 60 },
  { deg: 225, value: 15, age: 70 },
  { deg: 270, value: 8, age: 0 },
  { deg: 315, value: 15, age: 10 },
];

/** 8 secondary nodes on the spokes. */
const INNER_RING = [
  { deg: 0, value: 19 },
  { deg: 45, value: 12 },
  { deg: 90, value: 8 },
  { deg: 135, value: 20 },
  { deg: 180, value: 13 },
  { deg: 225, value: 21 },
  { deg: 270, value: 22 },
  { deg: 315, value: 12 },
];

/** 4 innermost nodes on the diagonal spokes. */
const INNER_CORE = [
  { deg: 45, value: 20 },
  { deg: 135, value: 8 },
  { deg: 225, value: 19 },
  { deg: 315, value: 6 },
];

/** Graduation ticks on the age ring: one every 5 degrees, majors at 45. */
const TICKS = Array.from({ length: 72 }, (_, i) => ({
  deg: i * 5,
  major: (i * 5) % 45 === 0,
}));

export default function SacredGeometryMatrix() {
  // The two squares of the octagram.
  const diagonalSquare = pathFrom(
    [315, 45, 135, 225].map((d) => pt(d, R_NODES)),
  );
  const cardinalSquare = pathFrom(
    [0, 90, 180, 270].map((d) => pt(d, R_NODES)),
  );

  // Hexagram grid (two equilateral triangles inscribed in the same circle).
  const triUp = pathFrom([0, 120, 240].map((d) => pt(d, R_NODES)));
  const triDown = pathFrom([60, 180, 300].map((d) => pt(d, R_NODES)));

  return (
    <figure
      style={{ aspectRatio: "1/1", width: "100%", margin: 0 }}
      aria-label="Destiny matrix diagram, sacred geometry construction"
    >
      <style>{`
        .mx-sg-draw {
          stroke-dasharray: 1000;
          stroke-dashoffset: 0;
          animation: mx-sg-draw-on 1.4s cubic-bezier(.4,0,.2,1) both;
        }
        .mx-sg-draw-slow {
          stroke-dasharray: 1000;
          stroke-dashoffset: 0;
          animation: mx-sg-draw-on 1.5s cubic-bezier(.4,0,.2,1) both;
        }
        .mx-sg-fade {
          animation: mx-sg-fade-in .9s ease-out both;
        }
        .mx-sg-stamp {
          transform-box: fill-box;
          transform-origin: center;
          animation: mx-sg-stamp-in 1.1s cubic-bezier(.2,.9,.3,1.2) both;
        }
        .mx-sg-spin {
          transform-box: fill-box;
          transform-origin: center;
          animation: mx-sg-rotate 140s linear infinite;
        }
        .mx-sg-breathe {
          opacity: .85;
          animation: mx-sg-breathe 18s ease-in-out infinite;
        }
        @keyframes mx-sg-draw-on {
          from { stroke-dashoffset: 1000; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes mx-sg-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes mx-sg-stamp-in {
          from { opacity: 0; transform: scale(1.35); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes mx-sg-rotate {
          to { transform: rotate(360deg); }
        }
        @keyframes mx-sg-breathe {
          0%, 100% { opacity: .55; }
          50%      { opacity: .95; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mx-sg-draw, .mx-sg-draw-slow, .mx-sg-fade,
          .mx-sg-stamp, .mx-sg-spin, .mx-sg-breathe {
            animation: none !important;
          }
          .mx-sg-breathe { opacity: .85; }
        }
      `}</style>

      <svg
        viewBox="0 0 600 600"
        width="100%"
        height="100%"
        role="img"
        aria-hidden="true"
        style={{ display: "block", background: INK }}
      >
        {/* matte black ground */}
        <rect x="0" y="0" width="600" height="600" fill={INK} />

        {/* header */}
        <text
          x={CX}
          y={30}
          textAnchor="middle"
          fill={GOLD}
          fontSize={14}
          letterSpacing={2.5}
          fontFamily={FONT}
          className="mx-sg-fade"
        >
          DAY 8 · MONTH 7 · YEAR 10 · BASE 7 · CENTER 5
        </text>

        {/* ---------- faint construction geometry ---------- */}
        <g
          stroke={GOLD_DIM}
          strokeWidth={0.5}
          fill="none"
          opacity={0.35}
          className="mx-sg-fade"
          style={{ animationDelay: "1.1s" }}
        >
          {/* axis hairlines */}
          <line x1={CX} y1={CY - RING_OUT} x2={CX} y2={CY + RING_OUT} />
          <line x1={CX - RING_OUT} y1={CY} x2={CX + RING_OUT} y2={CY} />
          {/* vesica piscis — circles through each other's centres */}
          <circle cx={CX} cy={CY - R_NODES} r={R_NODES} />
          <circle cx={CX} cy={CY + R_NODES} r={R_NODES} />
          {/* inscribed circle touching all eight square edges */}
          <circle cx={CX} cy={CY} r={R_INSCRIBED} />
          {/* half-radius circle */}
          <circle cx={CX} cy={CY} r={R_NODES / 2} />
        </g>

        {/* hexagram grid — the only slowly rotating element */}
        <g
          stroke={GOLD_DIM}
          strokeWidth={0.5}
          fill="none"
          opacity={0.22}
          className="mx-sg-spin"
        >
          <path d={triUp} />
          <path d={triDown} />
        </g>

        {/* ---------- circumscribed circle + spokes ---------- */}
        <g
          stroke={GOLD}
          strokeWidth={0.8}
          fill="none"
          opacity={0.8}
          className="mx-sg-draw-slow"
          style={{ animationDelay: "0.1s" }}
        >
          <circle cx={CX} cy={CY} r={R_NODES} pathLength={1000} />
        </g>
        <g stroke={GOLD} strokeWidth={0.7} opacity={0.75}>
          {OUTER.map(({ deg }) => {
            const a = pt(deg, 0);
            const b = pt(deg, RING_IN);
            return (
              <line
                key={`spoke-${deg}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                pathLength={1000}
                className="mx-sg-draw"
                style={{ animationDelay: "0.35s" }}
              />
            );
          })}
        </g>

        {/* ---------- the octagram: two squares ---------- */}
        <g stroke={GOLD} strokeWidth={1} fill="none">
          <path
            d={diagonalSquare}
            pathLength={1000}
            className="mx-sg-draw"
            style={{ animationDelay: "0.55s" }}
          />
          <path
            d={cardinalSquare}
            pathLength={1000}
            className="mx-sg-draw"
            style={{ animationDelay: "0.7s" }}
          />
        </g>

        {/* ---------- age ring ---------- */}
        <g className="mx-sg-breathe">
          <g
            stroke={GOLD}
            strokeWidth={0.8}
            fill="none"
            className="mx-sg-draw-slow"
            style={{ animationDelay: "0.85s" }}
          >
            <circle cx={CX} cy={CY} r={RING_IN} pathLength={1000} />
            <circle cx={CX} cy={CY} r={RING_OUT} pathLength={1000} />
          </g>
          <g stroke={GOLD} strokeWidth={0.6} opacity={0.8}>
            {TICKS.map(({ deg, major }) => {
              const a = pt(deg, RING_IN);
              const b = pt(deg, RING_IN + (major ? 10 : 5));
              return (
                <line
                  key={`tick-${deg}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  strokeWidth={major ? 1 : 0.5}
                />
              );
            })}
          </g>
          <g
            fill={GOLD}
            fontFamily={FONT}
            fontSize={13}
            letterSpacing={1}
            className="mx-sg-fade"
            style={{ animationDelay: "1s" }}
          >
            {OUTER.map(({ deg, age }) => {
              const p = pt(deg, R_AGE);
              return (
                <text
                  key={`age-${deg}`}
                  x={p.x}
                  y={p.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {age}y
                </text>
              );
            })}
          </g>
        </g>

        {/* ---------- junction ticks: node -> ring ---------- */}
        <g
          stroke={GOLD}
          strokeWidth={1}
          className="mx-sg-fade"
          style={{ animationDelay: "1.05s" }}
        >
          {OUTER.map(({ deg }) => {
            const a = pt(deg, R_NODES + 18);
            const b = pt(deg, RING_IN);
            return (
              <line
                key={`jt-${deg}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
              />
            );
          })}
        </g>

        {/* ---------- inner nodes ---------- */}
        <g
          className="mx-sg-fade"
          style={{ animationDelay: "1.15s" }}
          fontFamily={FONT}
        >
          {INNER_RING.map(({ deg, value }) => {
            const p = pt(deg, R_INNER);
            return (
              <g key={`in-${deg}`}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={12}
                  fill={INK}
                  stroke={GOLD}
                  strokeWidth={0.8}
                />
                <circle cx={p.x} cy={p.y} r={1.2} fill={GOLD} opacity={0.9} />
                <text
                  x={p.x}
                  y={p.y - 15}
                  textAnchor="middle"
                  fill={GOLD}
                  fontSize={11}
                  letterSpacing={0.5}
                >
                  {value}
                </text>
              </g>
            );
          })}
          {INNER_CORE.map(({ deg, value }) => {
            const p = pt(deg, R_CORE);
            return (
              <g key={`core-${deg}`}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={11}
                  fill={INK}
                  stroke={GOLD_DIM}
                  strokeWidth={0.8}
                />
                <text
                  x={p.x}
                  y={p.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={GOLD}
                  fontSize={10.5}
                  letterSpacing={0.5}
                >
                  {value}
                </text>
              </g>
            );
          })}
        </g>

        {/* ---------- outer nodes ---------- */}
        <g
          className="mx-sg-fade"
          style={{ animationDelay: "0.95s" }}
          fontFamily={FONT}
        >
          {OUTER.map(({ deg, value }) => {
            const p = pt(deg, R_NODES);
            return (
              <g key={`node-${deg}`}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={17}
                  fill={INK}
                  stroke={GOLD}
                  strokeWidth={1.2}
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={13.5}
                  fill="none"
                  stroke={GOLD_DIM}
                  strokeWidth={0.5}
                />
                <text
                  x={p.x}
                  y={p.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={GOLD_BRIGHT}
                  fontSize={16}
                  letterSpacing={1}
                >
                  {value}
                </text>
              </g>
            );
          })}
        </g>

        {/* ---------- center ---------- */}
        <g
          className="mx-sg-stamp"
          style={{ animationDelay: "1.25s" }}
          fontFamily={FONT}
        >
          <circle
            cx={CX}
            cy={CY}
            r={44}
            fill="none"
            stroke={GOLD_DIM}
            strokeWidth={0.6}
            strokeDasharray="2 5"
          />
          <circle
            cx={CX}
            cy={CY}
            r={38}
            fill={INK}
            stroke={GOLD}
            strokeWidth={1.4}
          />
          <circle
            cx={CX}
            cy={CY}
            r={31}
            fill="none"
            stroke={GOLD}
            strokeWidth={0.6}
          />
          {/* crosshair registration ticks */}
          <line x1={CX - 46} y1={CY} x2={CX - 40} y2={CY} stroke={GOLD} strokeWidth={1} />
          <line x1={CX + 40} y1={CY} x2={CX + 46} y2={CY} stroke={GOLD} strokeWidth={1} />
          <line x1={CX} y1={CY - 46} x2={CX} y2={CY - 40} stroke={GOLD} strokeWidth={1} />
          <line x1={CX} y1={CY + 40} x2={CX} y2={CY + 46} stroke={GOLD} strokeWidth={1} />
          <text
            x={CX}
            y={CY}
            textAnchor="middle"
            dominantBaseline="central"
            fill={GOLD_BRIGHT}
            fontSize={28}
            letterSpacing={1}
          >
            5
          </text>
        </g>

        {/* footer plate */}
        <text
          x={CX}
          y={580}
          textAnchor="middle"
          fill={GOLD_DIM}
          fontSize={9}
          letterSpacing={3}
          fontFamily={FONT}
          className="mx-sg-fade"
          style={{ animationDelay: "1.4s" }}
        >
          OCTAGRAM · STAR OF LAKSHMI · CONSTRUCTION No. I
        </text>
      </svg>
    </figure>
  );
}
