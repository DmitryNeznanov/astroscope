/**
 * Destiny Matrix — Lunar Silver
 * Silver-blue nocturne on navy #060a12. Moon-phase discs, silver hairlines,
 * tide-gauge age ring with wave ticks, full-moon center with soft halo,
 * drifting mist washes. Server-component safe, self-contained.
 */

const CX = 200;
const CY = 200;
const OUTER_R = 112; // octagram circumradius (both squares share it)
const RING_IN = 140; // tide-gauge band inner edge
const RING_OUT = 152; // tide-gauge band outer edge
const LABEL_R = 168; // age labels

type OuterNode = {
  angle: number; // degrees, 0 = top, clockwise
  value: number;
  age: string;
  phase: number; // 0 = full moon, 1 = new (sliver)
  cardinal: boolean;
};

const OUTER_NODES: OuterNode[] = [
  { angle: 0, value: 7, age: "20y", phase: 0.05, cardinal: true },
  { angle: 45, value: 17, age: "30y", phase: 0.45, cardinal: false },
  { angle: 90, value: 10, age: "40y", phase: 0.75, cardinal: true },
  { angle: 135, value: 17, age: "50y", phase: 0.3, cardinal: false },
  { angle: 180, value: 7, age: "60y", phase: 0.6, cardinal: true },
  { angle: 225, value: 15, age: "70y", phase: 0.9, cardinal: false },
  { angle: 270, value: 8, age: "0y", phase: 0.2, cardinal: true },
  { angle: 315, value: 15, age: "10y", phase: 0.5, cardinal: false },
];

// 12 inner nodes along the spokes, between center and outer ring.
const INNER_NODES: { angle: number; r: number; value: number }[] = [
  { angle: 0, r: 46, value: 19 },
  { angle: 0, r: 80, value: 12 },
  { angle: 45, r: 58, value: 8 },
  { angle: 90, r: 46, value: 20 },
  { angle: 90, r: 80, value: 13 },
  { angle: 135, r: 58, value: 21 },
  { angle: 180, r: 46, value: 22 },
  { angle: 180, r: 80, value: 12 },
  { angle: 225, r: 58, value: 20 },
  { angle: 270, r: 46, value: 8 },
  { angle: 270, r: 80, value: 19 },
  { angle: 315, r: 58, value: 6 },
];

function polar(angleDeg: number, r: number): { x: number; y: number } {
  const a = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.sin(a), y: CY - r * Math.cos(a) };
}

function pt(angleDeg: number, r: number): string {
  const { x, y } = polar(angleDeg, r);
  return `${x.toFixed(2)},${y.toFixed(2)}`;
}

export default function LunarSilverMatrix() {
  const cardinals = OUTER_NODES.filter((n) => n.cardinal);
  const diagonals = OUTER_NODES.filter((n) => !n.cardinal);

  // Tide-gauge ticks: fine every 5°, longer every 15°.
  const ticks: { d: string; major: boolean }[] = [];
  for (let deg = 0; deg < 360; deg += 5) {
    const major = deg % 15 === 0;
    const r1 = major ? RING_IN - 5 : RING_IN - 2.5;
    ticks.push({ d: `M${pt(deg, r1)} L${pt(deg, RING_IN)}`, major });
  }
  // Wave ticks: small sine-like glyphs riding the outer edge, every 15°.
  const waves: string[] = [];
  for (let deg = 7.5; deg < 360; deg += 15) {
    const p1 = polar(deg - 3, RING_OUT + 4);
    const c = polar(deg, RING_OUT + 7.5);
    const p2 = polar(deg + 3, RING_OUT + 4);
    waves.push(
      `M${p1.x.toFixed(2)},${p1.y.toFixed(2)} Q${c.x.toFixed(2)},${c.y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`,
    );
  }

  return (
    <figure
      className="mx-lunar-silver"
      style={{ aspectRatio: "1/1", width: "100%" }}
    >
      <style>{`
        .mx-lunar-silver {
          margin: 0;
          position: relative;
          overflow: hidden;
          border-radius: 14px;
          background:
            radial-gradient(120% 120% at 50% 30%, #0b1424 0%, #060a12 62%, #04070d 100%);
          font-family: ui-serif, Georgia, "Times New Roman", serif;
        }
        .mx-lunar-silver svg { display: block; width: 100%; height: 100%; }

        .mx-lunar-silver-hair { stroke: #8fa3bd; stroke-width: 0.6; fill: none; opacity: 0.55; }
        .mx-lunar-silver-spoke { stroke: #6d7f99; stroke-width: 0.5; opacity: 0.4; }
        .mx-lunar-silver-ring { stroke: #9db1c9; fill: none; opacity: 0.6; }
        .mx-lunar-silver-tick { stroke: #7e93ad; stroke-width: 0.55; opacity: 0.5; }
        .mx-lunar-silver-tick-major { stroke: #aebfd4; stroke-width: 0.8; opacity: 0.75; }
        .mx-lunar-silver-wave { stroke: #8fa3bd; stroke-width: 0.6; fill: none; opacity: 0.5; }
        .mx-lunar-silver-num { fill: #e8eef7; font-size: 12.5px; font-weight: 600; text-anchor: middle; dominant-baseline: central; }
        .mx-lunar-silver-num-inner { fill: #b8c6da; font-size: 7.5px; text-anchor: middle; dominant-baseline: central; }
        .mx-lunar-silver-age { fill: #93a7c0; font-size: 9px; letter-spacing: 0.08em; text-anchor: middle; dominant-baseline: central; }
        .mx-lunar-silver-center-num { fill: #0a1220; font-size: 24px; font-weight: 700; text-anchor: middle; dominant-baseline: central; }

        /* ---- Load reveal: draw-on hairlines, moon discs rise with the tide ---- */
        .mx-lunar-silver-draw {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: mx-lunar-silver-draw 1.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .mx-lunar-silver-node {
          opacity: 0;
          transform: scale(0.4);
          transform-box: fill-box;
          transform-origin: center;
          animation: mx-lunar-silver-rise 0.7s cubic-bezier(0.2, 0.7, 0.3, 1.2) forwards;
        }
        .mx-lunar-silver-fade {
          opacity: 0;
          animation: mx-lunar-silver-fadein 1.1s ease-out forwards;
        }
        @keyframes mx-lunar-silver-draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes mx-lunar-silver-rise {
          0% { opacity: 0; transform: scale(0.4); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes mx-lunar-silver-fadein {
          to { opacity: 1; }
        }

        /* ---- Ambient: halo breath, mist drift, tide shimmer ---- */
        .mx-lunar-silver-halo {
          transform-box: fill-box;
          transform-origin: center;
          animation: mx-lunar-silver-halo 18s ease-in-out infinite;
        }
        @keyframes mx-lunar-silver-halo {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.08); }
        }
        .mx-lunar-silver-mist-a { animation: mx-lunar-silver-mist-a 72s ease-in-out infinite alternate; }
        .mx-lunar-silver-mist-b { animation: mx-lunar-silver-mist-b 96s ease-in-out infinite alternate; }
        @keyframes mx-lunar-silver-mist-a {
          from { transform: translate(-14px, 6px); }
          to { transform: translate(16px, -8px); }
        }
        @keyframes mx-lunar-silver-mist-b {
          from { transform: translate(12px, -6px); }
          to { transform: translate(-16px, 10px); }
        }
        .mx-lunar-silver-tide { animation: mx-lunar-silver-tide 34s ease-in-out infinite; }
        @keyframes mx-lunar-silver-tide {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 0.8; }
        }

        @media (prefers-reduced-motion: reduce) {
          .mx-lunar-silver-draw,
          .mx-lunar-silver-node,
          .mx-lunar-silver-fade,
          .mx-lunar-silver-halo,
          .mx-lunar-silver-mist-a,
          .mx-lunar-silver-mist-b,
          .mx-lunar-silver-tide {
            animation: none;
          }
          .mx-lunar-silver-draw { stroke-dashoffset: 0; }
          .mx-lunar-silver-node { opacity: 1; transform: none; }
          .mx-lunar-silver-fade { opacity: 1; }
          .mx-lunar-silver-halo { opacity: 0.65; transform: none; }
        }
      `}</style>

      <svg viewBox="0 0 400 400" role="img" aria-label="Destiny Matrix diagram, Lunar Silver style">
        <defs>
          <radialGradient id="mx-ls-moon" cx="42%" cy="38%" r="70%">
            <stop offset="0%" stopColor="#f4f8ff" />
            <stop offset="55%" stopColor="#cdd9ea" />
            <stop offset="100%" stopColor="#93a7c0" />
          </radialGradient>
          <radialGradient id="mx-ls-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#cfe0f5" stopOpacity="0.5" />
            <stop offset="55%" stopColor="#a9c0dc" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#a9c0dc" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="mx-ls-mist" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#5f7ba3" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#5f7ba3" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="mx-ls-band" cx="50%" cy="50%" r="50%">
            <stop offset="86%" stopColor="#0d1828" stopOpacity="0" />
            <stop offset="92%" stopColor="#122036" stopOpacity="0.65" />
            <stop offset="98%" stopColor="#0d1828" stopOpacity="0" />
          </radialGradient>
          {OUTER_NODES.map((n) => {
            const { x, y } = polar(n.angle, OUTER_R);
            return (
              <clipPath key={`clip-${n.angle}`} id={`mx-ls-clip-${n.angle}`}>
                <circle cx={x} cy={y} r={12.4} />
              </clipPath>
            );
          })}
        </defs>

        {/* mist washes */}
        <g className="mx-lunar-silver-fade" style={{ animationDelay: "0.9s" }}>
          <ellipse className="mx-lunar-silver-mist-a" cx={140} cy={130} rx={150} ry={90} fill="url(#mx-ls-mist)" />
          <ellipse className="mx-lunar-silver-mist-b" cx={265} cy={280} rx={160} ry={95} fill="url(#mx-ls-mist)" />
        </g>

        {/* tide-gauge band */}
        <g className="mx-lunar-silver-fade" style={{ animationDelay: "0.55s" }}>
          <circle cx={CX} cy={CY} r={146} fill="url(#mx-ls-band)" />
          <circle className="mx-lunar-silver-ring mx-lunar-silver-tide" cx={CX} cy={CY} r={RING_IN} strokeWidth={0.7} />
          <circle className="mx-lunar-silver-ring" cx={CX} cy={CY} r={RING_OUT} strokeWidth={0.5} />
          {ticks.map((t, i) => (
            <path
              key={`t-${i}`}
              d={t.d}
              className={t.major ? "mx-lunar-silver-tick-major" : "mx-lunar-silver-tick"}
            />
          ))}
          {waves.map((d, i) => (
            <path key={`w-${i}`} d={d} className="mx-lunar-silver-wave" />
          ))}
        </g>

        {/* spokes */}
        <g>
          {OUTER_NODES.map((n, i) => {
            const { x, y } = polar(n.angle, OUTER_R);
            return (
              <line
                key={`s-${n.angle}`}
                x1={CX}
                y1={CY}
                x2={x}
                y2={y}
                pathLength={1}
                className="mx-lunar-silver-hair mx-lunar-silver-spoke mx-lunar-silver-draw"
                style={{ animationDelay: `${0.25 + i * 0.06}s` }}
              />
            );
          })}
        </g>

        {/* the two overlaid squares (octagram) */}
        <polygon
          points={cardinals.map((n) => pt(n.angle, OUTER_R)).join(" ")}
          pathLength={1}
          className="mx-lunar-silver-hair mx-lunar-silver-draw"
          style={{ animationDelay: "0.35s" }}
        />
        <polygon
          points={diagonals.map((n) => pt(n.angle, OUTER_R)).join(" ")}
          pathLength={1}
          className="mx-lunar-silver-hair mx-lunar-silver-draw"
          style={{ animationDelay: "0.45s" }}
        />

        {/* inner nodes */}
        <g>
          {INNER_NODES.map((n, i) => {
            const { x, y } = polar(n.angle, n.r);
            return (
              <g
                key={`in-${i}`}
                className="mx-lunar-silver-node"
                style={{ animationDelay: `${0.8 + i * 0.05}s` }}
              >
                <circle cx={x} cy={y} r={6.2} fill="#0c1524" stroke="#7e93ad" strokeWidth={0.6} opacity={0.95} />
                <text className="mx-lunar-silver-num-inner" x={x} y={y + 0.3}>
                  {n.value}
                </text>
              </g>
            );
          })}
        </g>

        {/* outer moon-phase nodes */}
        <g>
          {OUTER_NODES.map((n, i) => {
            const { x, y } = polar(n.angle, OUTER_R);
            const shadowOffset = n.phase * 22 - 11; // -11 full .. +11 new
            return (
              <g
                key={`n-${n.angle}`}
                className="mx-lunar-silver-node"
                style={{ animationDelay: `${0.55 + i * 0.07}s` }}
              >
                <circle cx={x} cy={y} r={13.2} fill="none" stroke="#aebfd4" strokeWidth={0.8} opacity={0.9} />
                <g clipPath={`url(#mx-ls-clip-${n.angle})`}>
                  <circle cx={x} cy={y} r={12.4} fill="url(#mx-ls-moon)" />
                  <circle
                    cx={x + shadowOffset}
                    cy={y}
                    r={11.4}
                    fill="#0a1322"
                    opacity={Math.min(0.94, 0.35 + n.phase * 0.6)}
                  />
                </g>
                <text className="mx-lunar-silver-num" x={x} y={y + 0.5}>
                  {n.value}
                </text>
              </g>
            );
          })}
        </g>

        {/* age labels riding the ring */}
        <g className="mx-lunar-silver-fade" style={{ animationDelay: "1.05s" }}>
          {OUTER_NODES.map((n) => {
            const { x, y } = polar(n.angle, LABEL_R);
            return (
              <text key={`a-${n.angle}`} className="mx-lunar-silver-age" x={x} y={y}>
                {n.age}
              </text>
            );
          })}
        </g>

        {/* center: full moon with halo */}
        <g className="mx-lunar-silver-node" style={{ animationDelay: "1.1s" }}>
          <circle className="mx-lunar-silver-halo" cx={CX} cy={CY} r={44} fill="url(#mx-ls-halo)" />
          <circle cx={CX} cy={CY} r={25} fill="url(#mx-ls-moon)" stroke="#dbe6f4" strokeWidth={0.9} />
          <circle cx={CX - 6} cy={CY - 5} r={3.2} fill="#a9bcd4" opacity={0.5} />
          <circle cx={CX + 7} cy={CY + 4} r={2.2} fill="#a9bcd4" opacity={0.4} />
          <circle cx={CX + 2} cy={CY - 9} r={1.6} fill="#a9bcd4" opacity={0.35} />
          <text className="mx-lunar-silver-center-num" x={CX} y={CY + 1}>
            5
          </text>
        </g>
      </svg>

      <figcaption
        className="mx-lunar-silver-fade"
        style={{
          animationDelay: "1.2s",
          position: "absolute",
          top: "3.2%",
          left: 0,
          right: 0,
          textAlign: "center",
          color: "#a9bcd4",
          fontSize: "clamp(10px, 2.6vw, 13px)",
          letterSpacing: "0.14em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        Day 8 · Month 7 · Year 10 · Base 7 · Center 5
      </figcaption>
    </figure>
  );
}
