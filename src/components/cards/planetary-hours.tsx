// Planetary Hours — The Hermit (IX)
// An occult timetable plate on cream parchment, ink with one red accent.
// A large heptagram (Star of the Magi) inscribed in a circle; planet glyphs
// in roundels at the seven points, arranged clockwise Sun..Mars so that
// following the star's continuous line yields the Chaldean hour sequence.
// Outer ring of day/night hour ticks with the seven day names in manuscript
// caps; dies Saturni washed in red. Small Hermit with lantern at the center.

const SERIF = "Georgia, 'Times New Roman', 'Palatino Linotype', serif";

const INK = "#3b2c1c";
const RED = "#9e2b25";

const CX = 150;
const CY = 215;
const STAR_R = 64; // heptagram vertices
const ROUNDEL_R = 77.5; // glyph roundel centers
const RING_IN = 92; // tick band inner edge
const RING_OUT = 106.5; // ring outer edge
const LABEL_R = 99.5; // day-name baseline radius
const MARK_R = 112; // tiny day/night glyph radius

// Clockwise from top: Sun, Venus, Mercury, Moon, Saturn, Jupiter, Mars.
// prettier-ignore — each glyph must stay glued to its U+FE0E selector
const GLYPHS = ["☉︎", "♀︎", "☿︎", "☽︎", "♄︎", "♃︎", "♂︎"];
const DAYS = [
  "DIES SOLIS", "DIES VENERIS", "DIES MERCURII", "DIES LUNAE",
  "DIES SATURNI", "DIES IOVIS", "DIES MARTIS",
];
const SATURN_K = 4;

type Pt = { x: number; y: number; deg: number };

const DEG = Math.PI / 180;
const STEP = 360 / 7;

const PTS: Pt[] = Array.from({ length: 7 }, (_, k) => {
  const deg = -90 + k * STEP;
  return {
    x: CX + STAR_R * Math.cos(deg * DEG),
    y: CY + STAR_R * Math.sin(deg * DEG),
    deg,
  };
});

// Step-3 path order — one continuous line, the planetary hour sequence.
const SEQ = [0, 3, 6, 2, 5, 1, 4];
const STAR_D =
  SEQ.map((k, i) => `${i === 0 ? "M" : "L"}${PTS[k].x.toFixed(2)} ${PTS[k].y.toFixed(2)}`).join(" ") +
  " Z";

// Direction arrows at the midpoint of each star edge, in travel order.
const ARROWS = SEQ.map((from, i) => {
  const a = PTS[from];
  const b = PTS[SEQ[(i + 1) % 7]];
  const t = 0.55;
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    rot: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI,
  };
});

// 24 hour ticks per day-sector: 12 long day ticks, 12 short night ticks.
const TICKS = PTS.flatMap((p, k) => {
  const base = p.deg - STEP / 2;
  return Array.from({ length: 23 }, (_, i) => {
    const h = i + 1;
    const a = (base + (h * STEP) / 24) * DEG;
    const len = h <= 12 ? 5 : 3;
    return {
      key: `${k}-${h}`,
      x1: CX + RING_IN * Math.cos(a),
      y1: CY + RING_IN * Math.sin(a),
      x2: CX + (RING_IN + len) * Math.cos(a),
      y2: CY + (RING_IN + len) * Math.sin(a),
      night: h > 12,
    };
  });
});

// Sector boundary lines, one pair per day.
const BOUNDS = PTS.map((p) => {
  const a = (p.deg - STEP / 2) * DEG;
  return {
    x1: CX + RING_IN * Math.cos(a),
    y1: CY + RING_IN * Math.sin(a),
    x2: CX + RING_OUT * Math.cos(a),
    y2: CY + RING_OUT * Math.sin(a),
  };
});

// Annular wedge (the red dies Saturni wash).
function wedge(rIn: number, rOut: number, degC: number): string {
  const a0 = (degC - STEP / 2) * DEG;
  const a1 = (degC + STEP / 2) * DEG;
  const p = (r: number, a: number) => `${(CX + r * Math.cos(a)).toFixed(2)} ${(CY + r * Math.sin(a)).toFixed(2)}`;
  return `M${p(rOut, a0)} A${rOut} ${rOut} 0 0 1 ${p(rOut, a1)} L${p(rIn, a1)} A${rIn} ${rIn} 0 0 0 ${p(rIn, a0)} Z`;
}
const SATURN_WEDGE = wedge(RING_IN, RING_OUT, PTS[SATURN_K].deg);

function labelRot(deg: number): number {
  const n = ((deg % 360) + 360) % 360;
  return n > 0 && n < 180 ? deg - 90 : deg + 90;
}

export default function PlanetaryHoursCard() {
  return (
    <figure
      className="cz-ph-card"
      style={{ aspectRatio: "2/3", width: "100%" }}
    >
      <style>{`
        .cz-ph-card {
          position: relative;
          margin: 0;
          overflow: hidden;
          border-radius: 12px;
          background: #efe3c8;
        }
        .cz-ph-card svg { display: block; width: 100%; height: 100%; }

        @keyframes cz-ph-draw {
          from { stroke-dashoffset: 1000; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes cz-ph-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cz-ph-fade-up {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cz-ph-pop {
          from { opacity: 0; transform: scale(0.2); }
          60%  { opacity: 1; }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes cz-ph-travel {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -1000; }
        }
        @keyframes cz-ph-lant {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 0.95; }
        }

        .cz-ph-frame  { animation: cz-ph-fade 0.9s ease-out both; }
        .cz-ph-head   { animation: cz-ph-fade-up 0.7s ease-out 0.25s both; }
        .cz-ph-lines  { animation: cz-ph-fade 1.2s ease-out 0.4s both; }
        .cz-ph-ring   { animation: cz-ph-fade 1s ease-out 0.5s both; }
        .cz-ph-draw {
          stroke-dasharray: 1000;
          stroke-dashoffset: 0;
          animation: cz-ph-draw 1.8s ease-in-out 0.15s both;
        }
        .cz-ph-roundel {
          transform-box: fill-box;
          transform-origin: center;
          animation: cz-ph-pop 0.5s ease-out both;
        }
        .cz-ph-names  { animation: cz-ph-fade 0.9s ease-out 1.55s both; }
        .cz-ph-arrows { animation: cz-ph-fade 0.8s ease-out 1.75s both; }
        .cz-ph-center {
          transform-box: fill-box;
          transform-origin: center;
          animation: cz-ph-pop 0.7s ease-out 1.15s both;
        }
        .cz-ph-title  { animation: cz-ph-fade-up 0.8s ease-out 1.9s both; }

        .cz-ph-marker {
          stroke-dasharray: 1 999;
          stroke-dashoffset: 0;
          animation: cz-ph-travel 75s linear infinite;
        }
        .cz-ph-lant { animation: cz-ph-lant 22s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .cz-ph-frame, .cz-ph-head, .cz-ph-lines, .cz-ph-ring, .cz-ph-draw,
          .cz-ph-roundel, .cz-ph-names, .cz-ph-arrows, .cz-ph-center,
          .cz-ph-title, .cz-ph-marker, .cz-ph-lant {
            animation: none !important;
          }
          .cz-ph-draw { stroke-dashoffset: 0; }
          .cz-ph-marker { opacity: 0; }
        }
      `}</style>

      <svg
        viewBox="0 0 300 450"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="The Hermit tarot card as a planetary hours heptagram plate"
      >
        <defs>
          <radialGradient id="cz-ph-bg" cx="50%" cy="44%" r="85%">
            <stop offset="0%" stopColor="#f6edda" />
            <stop offset="60%" stopColor="#eee1c4" />
            <stop offset="100%" stopColor="#ddcbA3" />
          </radialGradient>
          <radialGradient id="cz-ph-lant-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f2c96e" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#f2c96e" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cz-ph-vig" cx="50%" cy="46%" r="80%">
            <stop offset="0%" stopColor="#5a4526" stopOpacity="0" />
            <stop offset="82%" stopColor="#5a4526" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#4a371c" stopOpacity="0.22" />
          </radialGradient>
          <path
            id="cz-ph-star4"
            d="M0 -5 L1.3 -1.3 L5 0 L1.3 1.3 L0 5 L-1.3 1.3 L-5 0 L-1.3 -1.3 Z"
          />
        </defs>

        {/* Parchment ground */}
        <rect x="0" y="0" width="300" height="450" fill="url(#cz-ph-bg)" />

        {/* Header — IX with flanking rules */}
        <g className="cz-ph-head">
          <rect x="112" y="33.6" width="18" height="0.7" fill={INK} opacity="0.6" />
          <rect x="170" y="33.6" width="18" height="0.7" fill={INK} opacity="0.6" />
          <text
            x="150"
            y="38.5"
            textAnchor="middle"
            fontFamily={SERIF}
            fontSize="12"
            letterSpacing="4"
            fill={INK}
          >
            IX
          </text>
        </g>

        {/* Fine ruled construction lines */}
        <g className="cz-ph-lines" stroke={INK} opacity="0.14">
          <line x1="30" y1={CY} x2="270" y2={CY} strokeWidth="0.5" />
          <line x1={CX} y1="99" x2={CX} y2="331" strokeWidth="0.5" />
          <line x1="68" y1="133" x2="232" y2="297" strokeWidth="0.4" />
          <line x1="232" y1="133" x2="68" y2="297" strokeWidth="0.4" />
          <circle cx={CX} cy={CY} r={ROUNDEL_R} fill="none" strokeWidth="0.5" strokeDasharray="2 3.5" />
        </g>

        {/* Outer ring: boundaries, hour ticks, red Saturni wash */}
        <g className="cz-ph-ring">
          <path d={SATURN_WEDGE} fill={RED} opacity="0.09" />
          <circle cx={CX} cy={CY} r={RING_OUT} fill="none" stroke={INK} strokeWidth="0.9" opacity="0.85" />
          <circle cx={CX} cy={CY} r={RING_IN} fill="none" stroke={INK} strokeWidth="0.9" opacity="0.85" />
          {BOUNDS.map((b, i) => (
            <line
              key={i}
              x1={b.x1}
              y1={b.y1}
              x2={b.x2}
              y2={b.y2}
              stroke={INK}
              strokeWidth="0.7"
              opacity="0.7"
            />
          ))}
          {TICKS.map((t) => (
            <line
              key={t.key}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={INK}
              strokeWidth="0.5"
              opacity={t.night ? 0.4 : 0.65}
            />
          ))}
        </g>

        {/* Day names in manuscript caps + tiny day/night marks */}
        <g className="cz-ph-names">
          {PTS.map((p, k) => {
            const a = p.deg * DEG;
            return (
              <g key={k}>
                <g transform={`translate(${(CX + LABEL_R * Math.cos(a)).toFixed(2)} ${(CY + LABEL_R * Math.sin(a)).toFixed(2)}) rotate(${labelRot(p.deg).toFixed(2)})`}>
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily={SERIF}
                    fontSize="5.8"
                    letterSpacing="1.1"
                    fill={k === SATURN_K ? RED : INK}
                    opacity={k === SATURN_K ? 1 : 0.9}
                  >
                    {DAYS[k]}
                  </text>
                </g>
                {/* tiny sun / moon marks for the day and night halves */}
                {[-1, 1].map((s) => {
                  const ma = (p.deg + s * STEP / 4) * DEG;
                  return (
                    <text
                      key={s}
                      x={(CX + MARK_R * Math.cos(ma)).toFixed(2)}
                      y={(CY + MARK_R * Math.sin(ma)).toFixed(2)}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontFamily={SERIF}
                      fontSize="4.4"
                      fill={INK}
                      opacity="0.55"
                    >
                      {s < 0 ? "☉︎" : "☽︎"}
                    </text>
                  );
                })}
              </g>
            );
          })}
        </g>

        {/* Circumscribed circle */}
        <circle
          cx={CX}
          cy={CY}
          r={STAR_R}
          fill="none"
          stroke={INK}
          strokeWidth="0.6"
          opacity="0.5"
          className="cz-ph-ring"
        />

        {/* The heptagram — draws itself as one continuous stroke */}
        <path
          className="cz-ph-draw"
          d={STAR_D}
          pathLength={1000}
          fill="none"
          stroke={INK}
          strokeWidth="1.15"
          strokeLinejoin="round"
        />

        {/* Ambient marker dot traveling the star, very slowly */}
        <path
          className="cz-ph-marker"
          d={STAR_D}
          pathLength={1000}
          fill="none"
          stroke={RED}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Hour-sequence arrows along the star's path */}
        <g className="cz-ph-arrows">
          {ARROWS.map((a, i) => (
            <path
              key={i}
              d="M3.4 0 L-2.3 2.1 L-2.3 -2.1 Z"
              transform={`translate(${a.x.toFixed(2)} ${a.y.toFixed(2)}) rotate(${a.rot.toFixed(1)})`}
              fill={INK}
              opacity="0.85"
            />
          ))}
        </g>

        {/* Planet roundels — pop in along the hour sequence */}
        {SEQ.map((k, i) => {
          const a = PTS[k].deg * DEG;
          const x = CX + ROUNDEL_R * Math.cos(a);
          const y = CY + ROUNDEL_R * Math.sin(a);
          const sat = k === SATURN_K;
          return (
            <g
              key={k}
              className="cz-ph-roundel"
              style={{ animationDelay: `${(0.85 + i * 0.11).toFixed(2)}s` }}
            >
              <circle
                cx={x}
                cy={y}
                r="10.5"
                fill="#f4ead2"
                stroke={sat ? RED : INK}
                strokeWidth={sat ? 1.1 : 0.9}
              />
              <circle
                cx={x}
                cy={y}
                r="8.2"
                fill="none"
                stroke={sat ? RED : INK}
                strokeWidth="0.4"
                opacity="0.5"
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                dy="0.5"
                fontFamily={SERIF}
                fontSize="9.5"
                fill={sat ? RED : INK}
              >
                {GLYPHS[k]}
              </text>
            </g>
          );
        })}

        {/* Center medallion: the small Hermit with his lantern */}
        <g className="cz-ph-center">
          <circle cx={CX} cy={CY} r="21" fill="#f4ead2" stroke={INK} strokeWidth="0.9" />
          <circle cx={CX} cy={CY} r="18.5" fill="none" stroke={INK} strokeWidth="0.4" opacity="0.5" />
          <g transform={`translate(${CX} ${CY - 11})`}>
            <circle className="cz-ph-lant" cx="12.5" cy="17" r="7" fill="url(#cz-ph-lant-g)" />
            {/* Cloak with hood */}
            <path
              d="M0 0 C-4 1 -6.5 5 -7.5 10 C-8.5 16 -9 21 -9.2 27 L7.2 27
                 C7 21 6.5 16 5.5 10 C4.5 5 3 1 0 0 Z"
              fill={INK}
            />
            {/* Hood shadow */}
            <ellipse cx="-0.6" cy="6.6" rx="2.3" ry="2.9" fill="#efe3c8" opacity="0.9" />
            {/* Staff */}
            <path d="M-10.6 -1 L-10 -1 L-11.6 28 L-12.2 28 Z" fill={INK} />
            {/* Raised arm to the lantern */}
            <path d="M4.8 12 C7.6 10 10 8 12.2 5.6 L13.6 7 C11.6 10 8.8 12.4 5.8 14 Z" fill={INK} />
            {/* Lantern */}
            <circle cx="12.5" cy="17" r="1.9" fill="#f2c96e" stroke={INK} strokeWidth="0.6" />
          </g>
        </g>

        {/* Title block */}
        <g className="cz-ph-title">
          <rect x="74" y="393" width="20" height="0.8" fill={INK} opacity="0.6" />
          <rect x="206" y="393" width="20" height="0.8" fill={INK} opacity="0.6" />
          <text
            x="150"
            y="398"
            textAnchor="middle"
            fontFamily={SERIF}
            fontSize="12"
            letterSpacing="5"
            fill={INK}
          >
            THE HERMIT
          </text>
          <text
            x="150"
            y="413"
            textAnchor="middle"
            fontFamily={SERIF}
            fontStyle="italic"
            fontSize="8"
            letterSpacing="2"
            fill={INK}
            opacity="0.75"
          >
            horae planetarum
          </text>
        </g>

        {/* Thin ink frame with small star corners */}
        <g className="cz-ph-frame">
          <rect
            x="8"
            y="8"
            width="284"
            height="434"
            rx="7"
            fill="none"
            stroke={INK}
            strokeOpacity="0.5"
            strokeWidth="1"
          />
          <rect
            x="13.5"
            y="13.5"
            width="273"
            height="423"
            rx="4"
            fill="none"
            stroke={INK}
            strokeOpacity="0.25"
            strokeWidth="0.6"
          />
          <use href="#cz-ph-star4" transform="translate(26 26)" fill={INK} opacity="0.6" />
          <use href="#cz-ph-star4" transform="translate(274 26)" fill={INK} opacity="0.6" />
          <use href="#cz-ph-star4" transform="translate(274 424)" fill={INK} opacity="0.6" />
          <use href="#cz-ph-star4" transform="translate(26 424)" fill={INK} opacity="0.6" />
        </g>

        {/* Parchment vignette */}
        <rect x="0" y="0" width="300" height="450" fill="url(#cz-ph-vig)" />
      </svg>
    </figure>
  );
}
