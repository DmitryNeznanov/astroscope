// NATAL CHART — The Hermit (IX)
// An astrologer's worksheet: the card IS a hand-inked birth chart wheel on
// cream paper — outer zodiac ring with 12 sign glyphs, 12 house divisions
// with numbers, ten planet glyphs with degree annotations, and aspect lines
// (opposition / trine / square / sextile, varied weights + dashes) crossing
// the hub, where a small ink Hermit with lantern stands. ASC arrow on the
// left horizon, MC mark at the top, "IX" in a serif box, "THE HERMIT" below.
// Server-component safe: no hooks, no client directive, CSS-only animation.

const INK = "#223052";
const INK_SOFT = "#47587f";
const SERIF = "Georgia, 'Times New Roman', 'Nimbus Roman No9 L', serif";

const CX = 400;
const CY = 570;
const R_OUTER = 290;
const R_INNER = 245;
const R_TICK = 238;
const R_GLYPH = 267.5;
const R_PLANET = 195;
const R_NOTE = 158;
const R_ASPECT = 170;
const R_HUB = 55;
const R_NUM = 90;

// Math angle (degrees, CCW from +x axis) -> SVG point on the wheel.
function pt(r: number, deg: number): readonly [number, number] {
  const t = (deg * Math.PI) / 180;
  return [
    Math.round((CX + r * Math.cos(t)) * 10) / 10,
    Math.round((CY - r * Math.sin(t)) * 10) / 10,
  ] as const;
}

// Every astrological glyph is followed by U+FE0E (text presentation).
const SIGNS = [
  "♈︎", "♉︎", "♊︎", "♋︎", "♌︎", "♍︎",
  "♎︎", "♏︎", "♐︎", "♑︎", "♒︎", "♓︎",
];

const PLANETS = [
  { g: "☉︎", deg: 200, note: "☉︎ 2°♍︎" },
  { g: "☽︎", deg: 140, note: "☽︎ 27°♋︎" },
  { g: "☿︎", deg: 172, note: "☿︎ 14°♌︎" },
  { g: "♀︎", deg: 232, note: "♀︎ 9°♎︎" },
  { g: "♂︎", deg: 302, note: "♂︎ 21°♑︎" },
  { g: "♃︎", deg: 58, note: "♃︎ 5°♈︎" },
  { g: "♄︎", deg: 258, note: "♄︎ 14°♍︎" },
  { g: "♅︎", deg: 332, note: "♅︎ 23°♉︎ ℞︎" },
  { g: "♆︎", deg: 18, note: "♆︎ 11°♓︎" },
  { g: "♇︎", deg: 102, note: "♇︎ 28°♑︎ ℞︎" },
];

// Aspect lines between planets (indices into PLANETS). cy/cd = ambient
// opacity cycle duration / start delay.
const ASPECTS: { a: number; b: number; w: number; dash?: string; cy: string; cd: string }[] = [
  { a: 0, b: 8, w: 1.8, cy: "26s", cd: "2.6s" }, // Sun-Neptune opposition
  { a: 1, b: 7, w: 1.3, cy: "30s", cd: "2.9s" }, // Moon-Uranus wide opposition
  { a: 5, b: 4, w: 1.2, dash: "7 5", cy: "34s", cd: "3.2s" }, // Jupiter-Mars trine
  { a: 6, b: 8, w: 1.1, dash: "7 5", cy: "24s", cd: "3.4s" }, // Saturn-Neptune trine
  { a: 7, b: 5, w: 0.8, cy: "22s", cd: "2.3s" }, // Uranus-Jupiter square
  { a: 2, b: 9, w: 0.8, dash: "3 4", cy: "38s", cd: "3.7s" }, // Mercury-Pluto sextile
];

// 12 house cusps, clockwise starting just under the ascendant horizon.
const CUSPS = Array.from({ length: 12 }, (_, i) => 195 - i * 30);

export default function NatalChartHermitCard() {
  return (
    <figure
      className="cz-natal-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0, position: "relative" }}
    >
      <style>{`
        .cz-natal-card { position: relative; overflow: hidden; }
        .cz-natal-card svg { display: block; width: 100%; height: 100%; }
        .cz-natal-card text { user-select: none; }

        .cz-natal-draw {
          stroke-dasharray: 1;
          animation: cz-natal-kf-draw 1s cubic-bezier(.45,0,.15,1) both;
        }
        .cz-natal-fade { animation: cz-natal-kf-fade .7s ease both; }
        .cz-natal-pop {
          transform-box: fill-box;
          transform-origin: center;
          animation: cz-natal-kf-pop .55s cubic-bezier(.3,1.4,.5,1) both;
        }
        .cz-natal-aspect {
          animation:
            cz-natal-kf-fade .8s ease 1.25s both,
            cz-natal-kf-breathe var(--cy, 28s) ease-in-out var(--cd, 2.5s) infinite;
        }
        .cz-natal-glow {
          animation:
            cz-natal-kf-fade .8s ease 1.5s both,
            cz-natal-kf-lantern 19s ease-in-out 2.4s infinite;
        }

        @keyframes cz-natal-kf-draw {
          from { stroke-dashoffset: 1; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes cz-natal-kf-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cz-natal-kf-pop {
          0%   { opacity: 0; transform: scale(.35); }
          60%  { opacity: 1; transform: scale(1.12); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes cz-natal-kf-breathe {
          0%, 100% { opacity: 1; }
          50%      { opacity: .14; }
        }
        @keyframes cz-natal-kf-lantern {
          0%, 100% { opacity: .95; }
          50%      { opacity: .4; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cz-natal-card * { animation: none !important; }
        }
      `}</style>

      <svg
        viewBox="0 0 800 1200"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="The Hermit, depicted as a hand-drawn astrological natal chart wheel"
        style={{ position: "absolute", inset: 0, fontFamily: SERIF }}
      >
        <defs>
          <radialGradient id="cz-natal-paper" cx="50%" cy="44%" r="75%">
            <stop offset="0%" stopColor="#faf5e9" />
            <stop offset="70%" stopColor="#f4edda" />
            <stop offset="100%" stopColor="#ece1c8" />
          </radialGradient>
        </defs>

        {/* paper */}
        <rect x="0" y="0" width="800" height="1200" fill="url(#cz-natal-paper)" />

        {/* ink frame with corner ticks */}
        <g stroke={INK} fill="none">
          <rect x="22" y="22" width="756" height="1156" strokeWidth="1.6" />
          <rect x="32" y="32" width="736" height="1136" strokeWidth="0.7" />
          {([
            [22, 22], [778, 22], [22, 1178], [778, 1178],
          ] as const).map(([x, y]) => (
            <path
              key={`${x}-${y}`}
              d={`M ${x} ${y - 6} L ${x + 6} ${y} L ${x} ${y + 6} L ${x - 6} ${y} Z`}
              strokeWidth="0.9"
              fill={INK}
              transform={`translate(${x === 22 ? 6 : -6} ${y === 22 ? 6 : -6})`}
            />
          ))}
        </g>

        {/* IX in a serif box, flanked by rules */}
        <g className="cz-natal-fade" style={{ animationDelay: ".15s" }}>
          <rect x="366" y="56" width="68" height="42" fill="none" stroke={INK} strokeWidth="1.1" />
          <line x1="292" y1="77" x2="352" y2="77" stroke={INK} strokeWidth="0.8" />
          <line x1="448" y1="77" x2="508" y2="77" stroke={INK} strokeWidth="0.8" />
          <text
            x="400" y="78"
            textAnchor="middle" dominantBaseline="central"
            fontSize="23" letterSpacing="4" fill={INK}
          >
            IX
          </text>
        </g>

        {/* MC mark at the top of the wheel */}
        <text
          className="cz-natal-fade" style={{ animationDelay: ".9s" }}
          x="400" y="272" textAnchor="middle"
          fontSize="12" letterSpacing="2.5" fill={INK_SOFT}
        >
          MC
        </text>

        {/* ASC arrow on the left horizon */}
        <g className="cz-natal-fade" style={{ animationDelay: ".9s" }} stroke={INK} fill="none">
          <line x1="56" y1="570" x2="102" y2="570" strokeWidth="1.4" />
          <path d="M 102 570 L 93 564.5 M 102 570 L 93 575.5" strokeWidth="1.4" />
          <text
            x="79" y="554" textAnchor="middle"
            fontSize="13" letterSpacing="2" fill={INK} stroke="none"
          >
            ASC
          </text>
        </g>

        {/* ===== the chart wheel ===== */}

        {/* outer + inner zodiac rings, drawn on */}
        <circle
          className="cz-natal-draw" style={{ animationDelay: ".1s" }}
          cx={CX} cy={CY} r={R_OUTER} pathLength={1}
          fill="none" stroke={INK} strokeWidth="2"
        />
        <circle
          className="cz-natal-draw" style={{ animationDelay: ".3s", animationDuration: ".9s" }}
          cx={CX} cy={CY} r={R_INNER} pathLength={1}
          fill="none" stroke={INK} strokeWidth="1.3"
        />

        {/* 5° tick ring (dashed circle reads as degree ticks) */}
        <circle
          className="cz-natal-fade" style={{ animationDelay: ".6s" }}
          cx={CX} cy={CY} r={R_TICK}
          fill="none" stroke={INK} strokeWidth="9" strokeDasharray="2 18.77" opacity="0.55"
        />

        {/* zodiac band divisions */}
        {CUSPS.map((deg, i) => {
          const [x1, y1] = pt(R_INNER, deg);
          const [x2, y2] = pt(R_OUTER, deg);
          return (
            <line
              key={`zd-${i}`}
              className="cz-natal-fade" style={{ animationDelay: `${0.45 + i * 0.04}s` }}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={INK} strokeWidth="1"
            />
          );
        })}

        {/* zodiac sign glyphs */}
        {SIGNS.map((s, i) => {
          const [x, y] = pt(R_GLYPH, 180 - i * 30);
          return (
            <text
              key={`sg-${i}`}
              className="cz-natal-fade" style={{ animationDelay: `${0.35 + i * 0.045}s` }}
              x={x} y={y}
              textAnchor="middle" dominantBaseline="central"
              fontSize="24" fill={INK}
            >
              {s}
            </text>
          );
        })}

        {/* house division lines, sweeping in clockwise */}
        {CUSPS.map((deg, i) => {
          const [x1, y1] = pt(R_HUB, deg);
          const [x2, y2] = pt(R_INNER, deg);
          return (
            <line
              key={`hs-${i}`}
              className="cz-natal-fade" style={{ animationDelay: `${0.55 + i * 0.05}s` }}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={INK} strokeWidth="0.9"
            />
          );
        })}

        {/* house numbers */}
        {Array.from({ length: 12 }, (_, i) => {
          const [x, y] = pt(R_NUM, 180 - i * 30);
          return (
            <text
              key={`hn-${i}`}
              className="cz-natal-fade" style={{ animationDelay: `${1.0 + i * 0.03}s` }}
              x={x} y={y}
              textAnchor="middle" dominantBaseline="central"
              fontSize="13" fill={INK_SOFT}
            >
              {i + 1}
            </text>
          );
        })}

        {/* aspect lines across the hub — slow ambient breathing, each its own cycle */}
        {ASPECTS.map((asp, i) => {
          const [x1, y1] = pt(R_ASPECT, PLANETS[asp.a].deg);
          const [x2, y2] = pt(R_ASPECT, PLANETS[asp.b].deg);
          return (
            <line
              key={`as-${i}`}
              className="cz-natal-aspect"
              style={{ "--cy": asp.cy, "--cd": asp.cd } as React.CSSProperties}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={INK} strokeWidth={asp.w}
              strokeDasharray={asp.dash}
              opacity="0.85"
            />
          );
        })}

        {/* hub rings */}
        <circle
          className="cz-natal-draw" style={{ animationDelay: "1.15s", animationDuration: ".5s" }}
          cx={CX} cy={CY} r={R_HUB} pathLength={1}
          fill="none" stroke={INK} strokeWidth="1.4"
        />
        <circle
          className="cz-natal-fade" style={{ animationDelay: "1.25s" }}
          cx={CX} cy={CY} r={R_HUB - 6}
          fill="none" stroke={INK} strokeWidth="0.5"
        />

        {/* the Hermit at the hub: hooded figure, lantern, staff */}
        <g
          className="cz-natal-fade" style={{ animationDelay: "1.3s" }}
          stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none"
        >
          {/* hood */}
          <path d="M 388 572 Q 387 551 400 549 Q 413 551 412 572" />
          {/* face in shadow */}
          <ellipse cx="400" cy="561" rx="4.5" ry="5.5" fill={INK} stroke="none" />
          {/* robe */}
          <path d="M 384 606 L 390 572 Q 400 566 410 572 L 416 606 Z" />
          {/* staff */}
          <line x1="421" y1="556" x2="424" y2="608" />
          {/* arm to lantern */}
          <line x1="391" y1="580" x2="380" y2="588" />
          {/* lantern */}
          <path d="M 375 588 Q 379 582 383 588" strokeWidth="1.4" />
          <rect x="372" y="588" width="14" height="16" rx="2" strokeWidth="1.6" />
          <circle cx="379" cy="596" r="2.6" fill={INK} stroke="none" />
        </g>
        {/* lantern glow: dashed halo with a very slow pulse */}
        <circle
          className="cz-natal-glow"
          cx="379" cy="596" r="10"
          fill="none" stroke={INK} strokeWidth="1" strokeDasharray="1.5 4"
        />

        {/* planets: glyph pops, then degree annotation fades in */}
        {PLANETS.map((p, i) => {
          const [gx, gy] = pt(R_PLANET, p.deg);
          const [nx, ny] = pt(R_NOTE, p.deg);
          return (
            <g key={`pl-${i}`}>
              <text
                className="cz-natal-pop" style={{ animationDelay: `${0.95 + i * 0.06}s` }}
                x={gx} y={gy}
                textAnchor="middle" dominantBaseline="central"
                fontSize="25" fill={INK}
              >
                {p.g}
              </text>
              <text
                className="cz-natal-fade" style={{ animationDelay: `${1.2 + i * 0.06}s` }}
                x={nx} y={ny}
                textAnchor="middle" dominantBaseline="central"
                fontSize="12" fill={INK_SOFT}
              >
                {p.note}
              </text>
            </g>
          );
        })}

        {/* center dot */}
        <circle
          className="cz-natal-fade" style={{ animationDelay: "1.35s" }}
          cx={CX} cy={CY} r="2" fill={INK}
        />

        {/* ===== title block ===== */}
        <g className="cz-natal-fade" style={{ animationDelay: ".5s" }} stroke={INK} fill="none">
          <line x1="296" y1="1052" x2="382" y2="1052" strokeWidth="0.9" />
          <line x1="418" y1="1052" x2="504" y2="1052" strokeWidth="0.9" />
          <path d="M 400 1046 L 406 1052 L 400 1058 L 394 1052 Z" fill={INK} stroke="none" />
        </g>
        <text
          className="cz-natal-fade" style={{ animationDelay: ".35s" }}
          x="404" y="1092" textAnchor="middle"
          fontSize="30" letterSpacing="7" fill={INK}
        >
          THE HERMIT
        </text>
        <text
          className="cz-natal-fade" style={{ animationDelay: ".55s" }}
          x="400" y="1124" textAnchor="middle"
          fontSize="15" fontStyle="italic" letterSpacing="3" fill={INK_SOFT}
        >
          natalis · virgo
        </text>
      </svg>
    </figure>
  );
}
