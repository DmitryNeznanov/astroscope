/**
 * Destiny Matrix — NEON ORACLE
 * Neon tubes on deep space blue (#0a0e1c): nodes as glowing tube rings,
 * hairline circuit-light traces, dashed neon age ring, brightest tube star
 * at the center, one gently flickering node.
 * Server-component safe: no hooks, CSS-only scoped animations (mx-no-*).
 */

type Tone = "gold" | "violet";

interface OuterNode {
  x: number;
  y: number;
  value: number;
  age: string;
  tone: Tone;
  ax: number; // age label x
  ay: number; // age label y
}

interface InnerNode {
  x: number;
  y: number;
  value: number;
  tone: Tone;
}

const CX = 300;
const CY = 312;

// 8 outer nodes, clockwise from top. Cardinals gold, diagonals violet.
const OUTER: OuterNode[] = [
  { x: 300, y: 107, value: 7,  age: "20y", tone: "gold",   ax: 300,   ay: 74 },
  { x: 445, y: 167, value: 17, age: "30y", tone: "violet", ax: 468.3, ay: 143.7 },
  { x: 505, y: 312, value: 10, age: "40y", tone: "gold",   ax: 538,   ay: 312 },
  { x: 445, y: 457, value: 17, age: "50y", tone: "violet", ax: 468.3, ay: 480.3 },
  { x: 300, y: 517, value: 7,  age: "60y", tone: "gold",   ax: 300,   ay: 550 },
  { x: 155, y: 457, value: 15, age: "70y", tone: "violet", ax: 131.7, ay: 480.3 },
  { x: 95,  y: 312, value: 8,  age: "0y",  tone: "gold",   ax: 62,    ay: 312 },
  { x: 155, y: 167, value: 15, age: "10y", tone: "violet", ax: 131.7, ay: 143.7 },
];

// 12 inner nodes along the spokes, clockwise from the top spoke.
const INNER: InnerNode[] = [
  { x: 300,   y: 217,   value: 19, tone: "gold" },   // top spoke, outer
  { x: 300,   y: 162,   value: 12, tone: "gold" },   // top spoke, inner
  { x: 374.2, y: 237.8, value: 8,  tone: "violet" }, // top-right spoke
  { x: 395,   y: 312,   value: 20, tone: "gold" },   // right spoke, outer
  { x: 450,   y: 312,   value: 13, tone: "gold" },   // right spoke, inner
  { x: 374.2, y: 386.2, value: 21, tone: "violet" }, // bottom-right spoke
  { x: 300,   y: 407,   value: 22, tone: "gold" },   // bottom spoke, outer
  { x: 300,   y: 462,   value: 12, tone: "gold" },   // bottom spoke, inner
  { x: 225.8, y: 386.2, value: 20, tone: "violet" }, // bottom-left spoke
  { x: 205,   y: 312,   value: 8,  tone: "gold" },   // left spoke, outer
  { x: 150,   y: 312,   value: 19, tone: "gold" },   // left spoke, inner
  { x: 225.8, y: 237.8, value: 6,  tone: "violet" }, // top-left spoke
];

const GOLD = { core: "#ffedc2", tube: "#ffd76a", dim: "rgba(255, 199, 105, 0.35)" };
const VIOLET = { core: "#ece4ff", tube: "#b79cff", dim: "rgba(178, 148, 255, 0.35)" };

const toneOf = (t: Tone) => (t === "gold" ? GOLD : VIOLET);

const CSS = `
.mx-no-scope { margin: 0; background: #0a0e1c; border-radius: 18px; overflow: hidden; }
.mx-no-scope svg { display: block; width: 100%; height: 100%; }

.mx-no-glow-gold {
  filter: drop-shadow(0 0 2px rgba(255, 226, 150, 0.85))
          drop-shadow(0 0 7px rgba(255, 190, 80, 0.5))
          drop-shadow(0 0 16px rgba(255, 160, 50, 0.3));
}
.mx-no-glow-violet {
  filter: drop-shadow(0 0 2px rgba(216, 196, 255, 0.85))
          drop-shadow(0 0 7px rgba(166, 126, 255, 0.5))
          drop-shadow(0 0 16px rgba(140, 100, 255, 0.3));
}
.mx-no-glow-core {
  filter: drop-shadow(0 0 3px rgba(255, 238, 190, 0.95))
          drop-shadow(0 0 10px rgba(255, 202, 92, 0.65))
          drop-shadow(0 0 26px rgba(255, 170, 60, 0.45));
}

/* 1) One-shot load reveal: traces draw on, nodes stamp in, text fades. */
.mx-no-wire {
  stroke-dasharray: 1;
  stroke-dashoffset: 0;
  animation: mx-no-draw 0.8s cubic-bezier(0.45, 0, 0.2, 1) both;
}
@keyframes mx-no-draw {
  from { stroke-dashoffset: 1; }
  to   { stroke-dashoffset: 0; }
}
.mx-no-stamp {
  transform-box: fill-box;
  transform-origin: center;
  animation: mx-no-stamp 0.55s cubic-bezier(0.2, 0.9, 0.3, 1.25) both;
}
@keyframes mx-no-stamp {
  0%   { transform: scale(0.2); opacity: 0; }
  55%  { opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
.mx-no-fade { animation: mx-no-fade 0.6s ease-out both; }
@keyframes mx-no-fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* 2) Very slow ambient motion. */
.mx-no-spin {
  transform-box: fill-box;
  transform-origin: center;
  animation: mx-no-spin 120s linear infinite;
}
@keyframes mx-no-spin {
  to { transform: rotate(360deg); }
}
.mx-no-breathe { animation: mx-no-breathe 16s ease-in-out infinite; }
@keyframes mx-no-breathe {
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 1; }
}
/* Subtle flicker on a single node (top-left, 15 / 10y). */
.mx-no-flicker { animation: mx-no-flicker 20s linear infinite; }
@keyframes mx-no-flicker {
  0%, 60.5%, 65.5%, 100% { opacity: 1; }
  61.5% { opacity: 0.35; }
  63%   { opacity: 0.85; }
  64%   { opacity: 0.5; }
}

@media (prefers-reduced-motion: reduce) {
  .mx-no-scope .mx-no-wire,
  .mx-no-scope .mx-no-stamp,
  .mx-no-scope .mx-no-fade,
  .mx-no-scope .mx-no-spin,
  .mx-no-scope .mx-no-breathe,
  .mx-no-scope .mx-no-flicker {
    animation: none !important;
  }
}
`;

export default function NeonOracleMatrix() {
  return (
    <figure
      className="mx-no-scope"
      style={{ aspectRatio: "1/1", width: "100%" }}
    >
      <style>{CSS}</style>
      <svg
        viewBox="0 0 600 600"
        role="img"
        aria-label="Destiny Matrix, neon oracle style: Day 8, Month 7, Year 10, Base 7, Center 5"
        style={{
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <defs>
          <radialGradient id="mxNoBg" cx="50%" cy="52%" r="72%">
            <stop offset="0%" stopColor="#121a36" />
            <stop offset="55%" stopColor="#0d1226" />
            <stop offset="100%" stopColor="#0a0e1c" />
          </radialGradient>
          <radialGradient id="mxNoHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 208, 110, 0.4)" />
            <stop offset="55%" stopColor="rgba(255, 180, 80, 0.12)" />
            <stop offset="100%" stopColor="rgba(255, 170, 60, 0)" />
          </radialGradient>
        </defs>

        <rect width="600" height="600" fill="url(#mxNoBg)" />

        {/* Header */}
        <text
          x={CX}
          y={36}
          textAnchor="middle"
          fontSize={13}
          letterSpacing={3.2}
          fill="#b9a8ff"
          opacity={0.92}
          className="mx-no-fade"
          style={{ animationDelay: "1.2s" }}
        >
          {"Day 8 · Month 7 · Year 10 · Base 7 · Center 5"}
        </text>

        {/* Center halo (slow ambient breath) */}
        <circle
          cx={CX}
          cy={CY}
          r={72}
          fill="url(#mxNoHalo)"
          className="mx-no-breathe"
        />

        {/* Hairline structural circle */}
        <circle
          cx={CX}
          cy={CY}
          r={228}
          fill="none"
          stroke="rgba(150, 140, 220, 0.14)"
          strokeWidth={1}
        />

        {/* Outer age ring: dashed neon arc, ultra-slow rotation */}
        <g className="mx-no-fade" style={{ animationDelay: "0.15s" }}>
          <circle
            cx={CX}
            cy={CY}
            r={252}
            fill="none"
            stroke="#8f7bff"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeDasharray="2.5 10"
            pathLength={1}
            className="mx-no-glow-violet"
            opacity={0.85}
          />
          <g className="mx-no-spin">
            <circle
              cx={CX}
              cy={CY}
              r={252}
              fill="none"
              stroke="#cdbcff"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeDasharray="2.5 10"
              opacity={0.5}
            />
          </g>
        </g>

        {/* Connecting traces: rotated square (cardinals), axis square (diagonals), 8 spokes */}
        <g
          strokeLinecap="round"
          fill="none"
          className="mx-no-glow-gold"
          stroke="#ffd76a"
          strokeWidth={1.1}
          opacity={0.75}
        >
          <polygon
            points="300,107 505,312 300,517 95,312"
            pathLength={1}
            className="mx-no-wire"
            style={{ animationDelay: "0.25s" }}
          />
        </g>
        <g
          strokeLinecap="round"
          fill="none"
          className="mx-no-glow-violet"
          stroke="#b79cff"
          strokeWidth={1.1}
          opacity={0.75}
        >
          <polygon
            points="155,167 445,167 445,457 155,457"
            pathLength={1}
            className="mx-no-wire"
            style={{ animationDelay: "0.4s" }}
          />
        </g>
        <g strokeLinecap="round" fill="none" strokeWidth={0.9} opacity={0.6}>
          {OUTER.map((n, i) => (
            <line
              key={`spoke-${i}`}
              x1={CX}
              y1={CY}
              x2={n.x}
              y2={n.y}
              stroke={toneOf(n.tone).tube}
              pathLength={1}
              className={`mx-no-wire mx-no-glow-${n.tone}`}
              style={{ animationDelay: `${0.08 * i}s` }}
            />
          ))}
        </g>

        {/* Age labels on the ring */}
        {OUTER.map((n, i) => (
          <text
            key={`age-${i}`}
            x={n.ax}
            y={n.ay}
            dy="0.35em"
            textAnchor="middle"
            fontSize={12}
            letterSpacing={2}
            fill={toneOf(n.tone).tube}
            opacity={0.9}
            className="mx-no-fade"
            style={{ animationDelay: "1.05s" }}
          >
            {n.age}
          </text>
        ))}

        {/* Inner nodes: small tube rings along the spokes */}
        {INNER.map((n, i) => {
          const t = toneOf(n.tone);
          return (
            <g
              key={`inner-${i}`}
              className={`mx-no-stamp mx-no-glow-${n.tone}`}
              style={{ animationDelay: `${0.95 + 0.03 * i}s` }}
            >
              <circle
                cx={n.x}
                cy={n.y}
                r={12}
                fill="#0d1226"
                stroke={t.tube}
                strokeWidth={1.6}
              />
              <circle
                cx={n.x}
                cy={n.y}
                r={8}
                fill="none"
                stroke={t.dim}
                strokeWidth={0.8}
              />
              <text
                x={n.x}
                y={n.y}
                dy="0.35em"
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
                fill={t.core}
              >
                {n.value}
              </text>
            </g>
          );
        })}

        {/* Outer nodes: glowing tube rings */}
        {OUTER.map((n, i) => {
          const t = toneOf(n.tone);
          const flicker = i === 7 ? " mx-no-flicker" : "";
          return (
            <g
              key={`outer-${i}`}
              className={`mx-no-stamp mx-no-glow-${n.tone}${flicker}`}
              style={{ animationDelay: `${0.55 + 0.06 * i}s` }}
            >
              <circle
                cx={n.x}
                cy={n.y}
                r={23}
                fill="none"
                stroke={t.dim}
                strokeWidth={6}
              />
              <circle
                cx={n.x}
                cy={n.y}
                r={23}
                fill="#0d1226"
                stroke={t.tube}
                strokeWidth={2.4}
              />
              <circle
                cx={n.x}
                cy={n.y}
                r={17}
                fill="none"
                stroke={t.dim}
                strokeWidth={0.9}
              />
              <text
                x={n.x}
                y={n.y}
                dy="0.35em"
                textAnchor="middle"
                fontSize={19}
                fontWeight={700}
                fill={t.core}
              >
                {n.value}
              </text>
            </g>
          );
        })}

        {/* Center: the brightest tube star */}
        <g
          className="mx-no-stamp mx-no-glow-core"
          style={{ animationDelay: "0.45s" }}
        >
          <g
            stroke={GOLD.tube}
            strokeWidth={1.4}
            strokeLinecap="round"
            opacity={0.9}
          >
            {OUTER.map((n, i) => {
              const dx = n.x - CX;
              const dy = n.y - CY;
              const len = Math.hypot(dx, dy);
              const ux = dx / len;
              const uy = dy / len;
              return (
                <line
                  key={`ray-${i}`}
                  x1={CX + ux * 44}
                  y1={CY + uy * 44}
                  x2={CX + ux * 56}
                  y2={CY + uy * 56}
                />
              );
            })}
          </g>
          <circle
            cx={CX}
            cy={CY}
            r={40}
            fill="none"
            stroke={GOLD.dim}
            strokeWidth={9}
          />
          <circle
            cx={CX}
            cy={CY}
            r={40}
            fill="#0d1226"
            stroke={GOLD.tube}
            strokeWidth={3}
          />
          <circle
            cx={CX}
            cy={CY}
            r={31}
            fill="none"
            stroke={GOLD.dim}
            strokeWidth={1}
          />
          <text
            x={CX}
            y={CY}
            dy="0.35em"
            textAnchor="middle"
            fontSize={32}
            fontWeight={700}
            fill={GOLD.core}
          >
            5
          </text>
        </g>
      </svg>
    </figure>
  );
}
