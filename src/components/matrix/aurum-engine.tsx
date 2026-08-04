/**
 * Destiny Matrix — AURUM ENGINE
 * Gold instrument-cluster treatment: nodes as gauge dials with needles,
 * double-stroke rails with rivet joints, calibrated age-scale ring,
 * glowing center output gauge, readout-chip header.
 * Server-component safe: no hooks, inline SVG, scoped CSS-only motion.
 */

const MONO =
  "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace";

const CX = 300;
const CY = 312;
const R_OUT = 200; // octagram vertex radius
const R_RING_IN = 252; // age scale band inner edge
const R_RING_OUT = 274; // age scale band outer edge
const R_AGE = 263; // age label radius

const pt = (deg: number, r: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
};

// Gauge sweep: -210deg .. +30deg (240deg arc, gap at the bottom).
const needleDeg = (v: number) => -210 + (v / 22) * 240;

type OuterNode = { id: string; deg: number; value: number; age: string };

const OUTER: OuterNode[] = [
  { id: "top", deg: -90, value: 7, age: "20y" },
  { id: "tr", deg: -45, value: 17, age: "30y" },
  { id: "right", deg: 0, value: 10, age: "40y" },
  { id: "br", deg: 45, value: 17, age: "50y" },
  { id: "bottom", deg: 90, value: 7, age: "60y" },
  { id: "bl", deg: 135, value: 15, age: "70y" },
  { id: "left", deg: 180, value: 8, age: "0y" },
  { id: "tl", deg: -135, value: 15, age: "10y" },
];

// 12 inner nodes: two on each cardinal spoke, one on each diagonal spoke.
const INNER: { deg: number; r: number; value: number }[] = [
  { deg: -90, r: 88, value: 19 },
  { deg: -90, r: 146, value: 12 },
  { deg: 0, r: 88, value: 8 },
  { deg: 0, r: 146, value: 20 },
  { deg: 90, r: 88, value: 13 },
  { deg: 90, r: 146, value: 21 },
  { deg: 180, r: 88, value: 22 },
  { deg: 180, r: 146, value: 12 },
  { deg: -45, r: 112, value: 20 },
  { deg: 45, r: 112, value: 8 },
  { deg: 135, r: 112, value: 19 },
  { deg: -135, r: 112, value: 6 },
];

const CHIPS: { label: string; value: string }[] = [
  { label: "DAY", value: "8" },
  { label: "MONTH", value: "7" },
  { label: "YEAR", value: "10" },
  { label: "BASE", value: "7" },
  { label: "CENTER", value: "5" },
];

// Diamond (cardinal square) + axis square (diagonal square) vertex chains.
const DIAMOND = [-90, 0, 90, 180].map((d) => pt(d, R_OUT));
const SQUARE = [-45, 45, 135, -135].map((d) => pt(d, R_OUT));

const chainPath = (pts: [number, number][]) =>
  `M ${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ")} Z`;

const midpoints = (pts: [number, number][]): [number, number][] =>
  pts.map((p, i) => {
    const q = pts[(i + 1) % pts.length];
    return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  });

const RIVETS = [...midpoints(DIAMOND), ...midpoints(SQUARE)];

// Dial tick marks: 9 ticks along the 240deg gauge sweep.
const dialTicks = (cx: number, cy: number, rIn: number, rOut: number) =>
  Array.from({ length: 9 }, (_, i) => {
    const a = ((-210 + i * 30) * Math.PI) / 180;
    return {
      x1: cx + rIn * Math.cos(a),
      y1: cy + rIn * Math.sin(a),
      x2: cx + rOut * Math.cos(a),
      y2: cy + rOut * Math.sin(a),
      i,
    };
  });

export default function AurumEngineMatrix() {
  // Header chip geometry, centered row.
  const chipWidths = CHIPS.map((c) => 28 + (c.label.length + c.value.length + 1) * 7.2);
  const chipGap = 10;
  const chipsTotal =
    chipWidths.reduce((a, b) => a + b, 0) + chipGap * (CHIPS.length - 1);
  let chipX = CX - chipsTotal / 2;
  const chipLayout = CHIPS.map((c, i) => {
    const x = chipX;
    chipX += chipWidths[i] + chipGap;
    return { ...c, x, w: chipWidths[i] };
  });

  const ringTicks = Array.from({ length: 72 }, (_, i) => {
    const deg = i * 5;
    const major = deg % 45 === 0;
    const r1 = major ? R_RING_IN + 3 : R_RING_IN + 7;
    const [x1, y1] = pt(deg, r1);
    const [x2, y2] = pt(deg, R_RING_OUT - 3);
    return { x1, y1, x2, y2, major, i };
  });

  return (
    <figure
      style={{ aspectRatio: "1/1", width: "100%", margin: 0 }}
      aria-label="Destiny Matrix diagram, Aurum Engine style"
    >
      <style>{`
        .mx-aurum-draw { stroke-dasharray: 1; stroke-dashoffset: 1;
          animation: mx-aurum-draw-in 1.1s cubic-bezier(.4,0,.2,1) forwards; }
        @keyframes mx-aurum-draw-in { to { stroke-dashoffset: 0; } }
        .mx-aurum-node { opacity: 0; transform-box: fill-box; transform-origin: center;
          animation: mx-aurum-stamp .5s cubic-bezier(.2,.9,.3,1.25) forwards; }
        @keyframes mx-aurum-stamp {
          from { opacity: 0; transform: scale(1.55); }
          55% { opacity: 1; }
          to { opacity: 1; transform: scale(1); } }
        .mx-aurum-fade { opacity: 0; animation: mx-aurum-fade-in .8s ease-out forwards; }
        @keyframes mx-aurum-fade-in { to { opacity: 1; } }
        .mx-aurum-pulse { animation: mx-aurum-pulse 18s ease-in-out infinite; }
        @keyframes mx-aurum-pulse { 0%,100% { opacity: .5; } 50% { opacity: 1; } }
        .mx-aurum-spin { transform-box: fill-box; transform-origin: center;
          animation: mx-aurum-spin 120s linear infinite; }
        @keyframes mx-aurum-spin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          .mx-aurum-draw { animation: none; stroke-dashoffset: 0; }
          .mx-aurum-node, .mx-aurum-fade { animation: none; opacity: 1; transform: none; }
          .mx-aurum-pulse, .mx-aurum-spin { animation: none; }
        }
      `}</style>

      <svg
        viewBox="0 0 600 600"
        width="100%"
        height="100%"
        role="img"
        aria-hidden="true"
        style={{ display: "block" }}
      >
        <defs>
          <radialGradient id="mx-aurum-bg" cx="50%" cy="52%" r="72%">
            <stop offset="0%" stopColor="#14110a" />
            <stop offset="60%" stopColor="#0a0906" />
            <stop offset="100%" stopColor="#050403" />
          </radialGradient>
          <radialGradient id="mx-aurum-dial" cx="50%" cy="42%" r="65%">
            <stop offset="0%" stopColor="#1d1810" />
            <stop offset="100%" stopColor="#0b0906" />
          </radialGradient>
          <radialGradient id="mx-aurum-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f0d98c" stopOpacity="0.32" />
            <stop offset="55%" stopColor="#d4af37" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="mx-aurum-rail" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8a6d2f" />
            <stop offset="50%" stopColor="#f0d98c" />
            <stop offset="100%" stopColor="#8a6d2f" />
          </linearGradient>
        </defs>

        <rect width="600" height="600" fill="url(#mx-aurum-bg)" />

        {/* slow-rotating decorative dashed orbit */}
        <circle
          cx={CX}
          cy={CY}
          r={236}
          fill="none"
          stroke="#6e5a2a"
          strokeWidth="1"
          strokeDasharray="2 12"
          opacity="0.5"
          className="mx-aurum-spin"
        />

        {/* age scale band */}
        <g className="mx-aurum-fade" style={{ animationDelay: "0.05s" }}>
          <circle cx={CX} cy={CY} r={R_RING_IN} fill="none" stroke="#6e5a2a" strokeWidth="1" />
          <circle
            cx={CX}
            cy={CY}
            r={R_RING_OUT}
            fill="none"
            stroke="#d4af37"
            strokeWidth="1.6"
            pathLength={1}
            className="mx-aurum-draw"
          />
          {ringTicks.map((t) => (
            <line
              key={t.i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={t.major ? "#f0d98c" : "#6e5a2a"}
              strokeWidth={t.major ? 1.8 : 0.8}
              opacity={t.major ? 0.95 : 0.6}
            />
          ))}
          {OUTER.map((n) => {
            const [x, y] = pt(n.deg, R_AGE);
            return (
              <text
                key={n.id}
                x={x}
                y={y + 3.5}
                textAnchor="middle"
                fontFamily={MONO}
                fontSize="11"
                letterSpacing="1"
                fill="#e8cf8a"
              >
                {n.age}
              </text>
            );
          })}
        </g>

        {/* rail underlays (soft gold bed) */}
        <g stroke="#d4af37" strokeWidth="6" opacity="0.1" fill="none">
          <path d={chainPath(DIAMOND)} />
          <path d={chainPath(SQUARE)} />
        </g>

        {/* octagram rails, drawn on */}
        <g fill="none" stroke="url(#mx-aurum-rail)" strokeWidth="2">
          <path
            d={chainPath(DIAMOND)}
            pathLength={1}
            className="mx-aurum-draw"
            style={{ animationDelay: "0.2s" }}
          />
          <path
            d={chainPath(SQUARE)}
            pathLength={1}
            className="mx-aurum-draw"
            style={{ animationDelay: "0.3s" }}
          />
          {OUTER.map((n, i) => {
            const [x1, y1] = pt(n.deg, 52);
            const [x2, y2] = pt(n.deg, R_OUT - 28);
            return (
              <line
                key={n.id}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                strokeWidth="1.4"
                opacity="0.85"
                pathLength={1}
                className="mx-aurum-draw"
                style={{ animationDelay: `${0.35 + i * 0.02}s` }}
              />
            );
          })}
        </g>

        {/* rivet joints at rail midpoints */}
        <g className="mx-aurum-fade" style={{ animationDelay: "0.55s" }}>
          {RIVETS.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="3.2" fill="#0c0a06" stroke="#d4af37" strokeWidth="1.2" />
              <circle cx={x} cy={y} r="1" fill="#f0d98c" />
            </g>
          ))}
        </g>

        {/* inner rivet-dials along the spokes */}
        {INNER.map((n, i) => {
          const [x, y] = pt(n.deg, n.r);
          const a = (needleDeg(n.value) * Math.PI) / 180;
          return (
            <g
              key={i}
              className="mx-aurum-node"
              style={{ animationDelay: `${0.5 + i * 0.035}s` }}
            >
              <circle cx={x} cy={y} r="14" fill="url(#mx-aurum-dial)" stroke="#6e5a2a" strokeWidth="1.2" />
              <line
                x1={x + 12.5 * Math.cos(a)}
                y1={y + 12.5 * Math.sin(a)}
                x2={x + 8.5 * Math.cos(a)}
                y2={y + 8.5 * Math.sin(a)}
                stroke="#f0d98c"
                strokeWidth="1.4"
              />
              <text
                x={x}
                y={y + 3.5}
                textAnchor="middle"
                fontFamily={MONO}
                fontSize="11"
                fontWeight="700"
                fill="#e8cf8a"
              >
                {n.value}
              </text>
            </g>
          );
        })}

        {/* outer instrument dials */}
        {OUTER.map((n, i) => {
          const [x, y] = pt(n.deg, R_OUT);
          const a = (needleDeg(n.value) * Math.PI) / 180;
          const hotTick = Math.round((n.value / 22) * 8);
          return (
            <g
              key={n.id}
              className="mx-aurum-node"
              style={{ animationDelay: `${0.6 + i * 0.05}s` }}
            >
              <circle cx={x} cy={y} r="27" fill="url(#mx-aurum-dial)" stroke="#8a6d2f" strokeWidth="1.6" />
              <circle cx={x} cy={y} r="22.5" fill="none" stroke="#3a2f18" strokeWidth="0.8" />
              {dialTicks(x, y, 18.5, 22.5).map((t) => (
                <line
                  key={t.i}
                  x1={t.x1}
                  y1={t.y1}
                  x2={t.x2}
                  y2={t.y2}
                  stroke={t.i === hotTick ? "#f0d98c" : "#6e5a2a"}
                  strokeWidth={t.i === hotTick ? 1.8 : 1}
                />
              ))}
              <line
                x1={x + 24 * Math.cos(a)}
                y1={y + 24 * Math.sin(a)}
                x2={x + 14 * Math.cos(a)}
                y2={y + 14 * Math.sin(a)}
                stroke="#f5e3ae"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <text
                x={x}
                y={y + 5.5}
                textAnchor="middle"
                fontFamily={MONO}
                fontSize="16"
                fontWeight="700"
                fill="#f0d98c"
              >
                {n.value}
              </text>
            </g>
          );
        })}

        {/* center output gauge */}
        <g className="mx-aurum-node" style={{ animationDelay: "0.45s" }}>
          <circle cx={CX} cy={CY} r="78" fill="url(#mx-aurum-glow)" className="mx-aurum-pulse" />
          <circle cx={CX} cy={CY} r="46" fill="url(#mx-aurum-dial)" stroke="#d4af37" strokeWidth="2.2" />
          <circle cx={CX} cy={CY} r="40" fill="none" stroke="#3a2f18" strokeWidth="0.8" />
          {dialTicks(CX, CY, 34, 39).map((t) => (
            <line
              key={t.i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={t.i === Math.round((5 / 22) * 8) ? "#f0d98c" : "#6e5a2a"}
              strokeWidth="1.2"
            />
          ))}
          {(() => {
            const a = (needleDeg(5) * Math.PI) / 180;
            return (
              <line
                x1={CX + 42 * Math.cos(a)}
                y1={CY + 42 * Math.sin(a)}
                x2={CX + 27 * Math.cos(a)}
                y2={CY + 27 * Math.sin(a)}
                stroke="#f5e3ae"
                strokeWidth="3"
                strokeLinecap="round"
              />
            );
          })()}
          <text
            x={CX}
            y={CY + 11}
            textAnchor="middle"
            fontFamily={MONO}
            fontSize="32"
            fontWeight="700"
            fill="#f5e3ae"
          >
            5
          </text>
          <text
            x={CX}
            y={CY + 62}
            textAnchor="middle"
            fontFamily={MONO}
            fontSize="9"
            letterSpacing="4"
            fill="#8a6d2f"
          >
            CENTER
          </text>
        </g>

        {/* header readout chips: Day 8 · Month 7 · Year 10 · Base 7 · Center 5 */}
        <g className="mx-aurum-fade" style={{ animationDelay: "0.1s" }}>
          {chipLayout.map((c) => (
            <g key={c.label}>
              <rect
                x={c.x}
                y="8"
                width={c.w}
                height="24"
                rx="4"
                fill="#0e0c08"
                stroke="#6e5a2a"
                strokeWidth="1"
              />
              <text
                x={c.x + c.w / 2}
                y="24"
                textAnchor="middle"
                fontFamily={MONO}
                fontSize="11"
                letterSpacing="1"
              >
                <tspan fill="#8a6d2f">{c.label} </tspan>
                <tspan fill="#f0d98c" fontWeight="700">
                  {c.value}
                </tspan>
              </text>
            </g>
          ))}
        </g>
      </svg>
    </figure>
  );
}
