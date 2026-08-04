// CELESTIAL SEXTANT — The Hermit (IX)
// Engraved brass sextant on dark teal-black: the great degree arc (0-120°,
// fine ticks, numerals every 10°), radial frame arms, index arm with vernier
// swung to a 42.5° reading, telescope tube, shade discs on pivots. Above the
// arc the sighted star burns; below it the Hermit stands small, lantern
// raised, taking his sighting. Server-component safe: no hooks, no client
// directive; both animation tiers are CSS-only in the scoped style block.

const PIVOT_X = 150;
const PIVOT_Y = 96;
const R_OUT = 190;
const R_IN = 170;
// physical half-sweep of the arc; the scale doubles the angle (sextant
// principle), so 0-120° of scale is engraved across 96° of physical arc
const HALF_SWEEP = 48;

const pt = (r: number, scaleDeg: number) => {
  const a = ((HALF_SWEEP - scaleDeg * 0.8) * Math.PI) / 180;
  return {
    x: Math.round((PIVOT_X + r * Math.sin(a)) * 10) / 10,
    y: Math.round((PIVOT_Y + r * Math.cos(a)) * 10) / 10,
  };
};

const MAJORS = Array.from({ length: 13 }, (_, i) => i * 10);
const MINORS = Array.from({ length: 61 }, (_, i) => i * 2).filter(
  (s) => s % 10 !== 0,
);
const VERNIER = Array.from({ length: 13 }, (_, i) => 35 + i * 1.25);

const READING = 42.5; // the altitude the index arm has swept to

const BRASS = "#c39a3b";
const BRASS_HI = "#e8c66a";
const BRASS_DK = "#6d5316";
const ENGRAVE = "#2e230a";
const IVORY = "#eadfc0";

const o1 = pt(R_OUT, 0);
const o2 = pt(R_OUT, 120);
const i1 = pt(R_IN, 0);
const i2 = pt(R_IN, 120);
const g1 = pt(180, 0);
const g2 = pt(180, 120);

const BAND_PATH = `M ${o1.x} ${o1.y} A ${R_OUT} ${R_OUT} 0 0 1 ${o2.x} ${o2.y} L ${i2.x} ${i2.y} A ${R_IN} ${R_IN} 0 0 0 ${i1.x} ${i1.y} Z`;
const GLEAM_PATH = `M ${g1.x} ${g1.y} A 180 180 0 0 1 ${g2.x} ${g2.y}`;

const BG_STARS: ReadonlyArray<readonly [number, number, number]> = [
  [52, 66, 1.1],
  [86, 38, 0.8],
  [118, 62, 0.7],
  [196, 30, 0.9],
  [262, 96, 0.8],
  [272, 150, 0.6],
  [30, 130, 0.7],
  [44, 200, 0.6],
  [206, 78, 0.6],
  [96, 100, 0.5],
  [258, 210, 0.5],
  [24, 262, 0.5],
];

export default function CelestialSextantHermitCard() {
  return (
    <figure
      className="cz-sext-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
    >
      <style>{`
        .cz-sext-card { position: relative; overflow: hidden; }
        .cz-sext-card svg { display: block; width: 100%; height: 100%; }

        .cz-sext-frame-load  { animation: cz-sext-fade .9s ease-out backwards; }
        .cz-sext-scale-load  { animation: cz-sext-fade 1s ease-out .35s backwards; }
        .cz-sext-hermit-load { animation: cz-sext-rise 1s ease-out .9s backwards; }
        .cz-sext-arm {
          transform-box: view-box;
          transform-origin: 150px 96px;
          animation: cz-sext-sweep 1.25s cubic-bezier(.23,.9,.3,1) .55s backwards;
        }
        .cz-sext-star-load {
          transform-box: fill-box;
          transform-origin: center;
          animation: cz-sext-flash 1s ease-out 1.35s backwards;
        }
        .cz-sext-twinkle {
          transform-box: fill-box;
          transform-origin: center;
          animation: cz-sext-twinkle 16s ease-in-out infinite alternate;
        }
        .cz-sext-gleam { animation: cz-sext-gleam 25s linear infinite; }

        @keyframes cz-sext-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cz-sext-rise {
          from { opacity: 0; transform: translateY(7px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cz-sext-sweep {
          from { opacity: .35; transform: rotate(-34deg); }
          to   { opacity: 1;   transform: rotate(0deg); }
        }
        @keyframes cz-sext-flash {
          0%   { opacity: 0; transform: scale(.6); }
          45%  { opacity: 1; transform: scale(1.28); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes cz-sext-twinkle {
          from { opacity: .72; transform: scale(.96); }
          to   { opacity: 1;   transform: scale(1.05); }
        }
        @keyframes cz-sext-gleam {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -100; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cz-sext-frame-load,
          .cz-sext-scale-load,
          .cz-sext-hermit-load,
          .cz-sext-arm,
          .cz-sext-star-load,
          .cz-sext-twinkle,
          .cz-sext-gleam {
            animation: none;
          }
        }
      `}</style>

      <svg
        viewBox="0 0 300 450"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="The Hermit, tarot card nine, drawn as an engraved brass sextant reading a star"
      >
        <defs>
          <linearGradient id="cz-sext-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0c1d20" />
            <stop offset="55%" stopColor="#081416" />
            <stop offset="100%" stopColor="#040a0c" />
          </linearGradient>
          <linearGradient id="cz-sext-brass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e2bd5e" />
            <stop offset="45%" stopColor="#b98f2e" />
            <stop offset="100%" stopColor="#7d601a" />
          </linearGradient>
          <radialGradient id="cz-sext-hub" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#f0d17e" />
            <stop offset="60%" stopColor="#b98f2e" />
            <stop offset="100%" stopColor="#6d5316" />
          </radialGradient>
          <radialGradient id="cz-sext-starglow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff3cf" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#e8c66a" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#e8c66a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cz-sext-lamp" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe9a8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#e8c66a" stopOpacity="0" />
          </radialGradient>
          {/* engraving crosshatch for the brass band */}
          <pattern id="cz-sext-hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="4" stroke={ENGRAVE} strokeWidth="0.55" opacity="0.4" />
          </pattern>
        </defs>

        {/* dark teal-black ground + faint field stars */}
        <rect x="0" y="0" width="300" height="450" fill="url(#cz-sext-bg)" />
        <g fill="#cfe4dd">
          {BG_STARS.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} opacity={0.28 + (i % 3) * 0.12} />
          ))}
        </g>

        {/* metallic frame with rivet corners */}
        <g className="cz-sext-frame-load">
          <rect x="8" y="8" width="284" height="434" fill="none" stroke={BRASS} strokeWidth="1.3" opacity="0.9" />
          <rect x="13" y="13" width="274" height="424" fill="none" stroke={BRASS} strokeWidth="0.5" opacity="0.45" />
          {[
            [12, 12],
            [288, 12],
            [12, 438],
            [288, 438],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <circle cx={x} cy={y} r="3.1" fill="url(#cz-sext-hub)" stroke={ENGRAVE} strokeWidth="0.6" />
              <circle cx={x} cy={y} r="0.9" fill={ENGRAVE} />
            </g>
          ))}
        </g>

        {/* engraved IX plaque, screwed to the plate */}
        <g className="cz-sext-frame-load">
          <rect x="30" y="28" width="54" height="30" rx="2" fill="url(#cz-sext-brass)" stroke={ENGRAVE} strokeWidth="1" />
          <rect x="33.5" y="31.5" width="47" height="23" rx="1" fill="none" stroke={ENGRAVE} strokeWidth="0.5" opacity="0.7" />
          <circle cx="36" cy="34" r="1.2" fill={ENGRAVE} />
          <circle cx="78" cy="34" r="1.2" fill={ENGRAVE} />
          <circle cx="36" cy="52" r="1.2" fill={ENGRAVE} />
          <circle cx="78" cy="52" r="1.2" fill={ENGRAVE} />
          <text
            x="57"
            y="49"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="700"
            fontSize="15"
            fill={ENGRAVE}
          >
            IX
          </text>
        </g>

        {/* the sighted star + its sight line down to the index mirror */}
        <line x1="228" y1="61" x2="164" y2="104" stroke={IVORY} strokeWidth="0.6" strokeDasharray="2 4" opacity="0.25" />
        <g className="cz-sext-star-load">
          <g className="cz-sext-twinkle">
            <circle cx="236" cy="54" r="17" fill="url(#cz-sext-starglow)" />
            <path
              d="M 236 39 L 239.2 50.8 L 251 54 L 239.2 57.2 L 236 69 L 232.8 57.2 L 221 54 L 232.8 50.8 Z"
              fill="#fff3cf"
              stroke={BRASS_HI}
              strokeWidth="0.5"
            />
            <circle cx="236" cy="54" r="2" fill="#ffffff" />
          </g>
        </g>

        {/* sextant body */}
        <g className="cz-sext-frame-load">
          {/* radial frame arms */}
          {[0, 60, 120].map((s) => {
            const e = pt(R_IN - 2, s);
            return (
              <g key={s}>
                <line x1={PIVOT_X} y1={PIVOT_Y} x2={e.x} y2={e.y} stroke={BRASS} strokeWidth="5" opacity="0.95" />
                <line x1={PIVOT_X} y1={PIVOT_Y} x2={e.x} y2={e.y} stroke={ENGRAVE} strokeWidth="1" opacity="0.55" />
              </g>
            );
          })}

          {/* the great arc: brass band + engraving hatch */}
          <path d={BAND_PATH} fill="url(#cz-sext-brass)" stroke={ENGRAVE} strokeWidth="1.1" />
          <path d={BAND_PATH} fill="url(#cz-sext-hatch)" opacity="0.5" />
          {[172.5, 187.5].map((r) => {
            const p1 = pt(r, 0);
            const p2 = pt(r, 120);
            return (
              <path
                key={r}
                d={`M ${p1.x} ${p1.y} A ${r} ${r} 0 0 1 ${p2.x} ${p2.y}`}
                fill="none"
                stroke={ENGRAVE}
                strokeWidth="0.6"
                opacity="0.6"
              />
            );
          })}

          {/* frame screws on the band */}
          {[0, 60, 120].map((s) => {
            const c = pt(180, s);
            return (
              <g key={s}>
                <circle cx={c.x} cy={c.y} r="2.5" fill={BRASS_HI} stroke={ENGRAVE} strokeWidth="0.7" />
                <line x1={c.x - 1.4} y1={c.y - 1.4} x2={c.x + 1.4} y2={c.y + 1.4} stroke={ENGRAVE} strokeWidth="0.6" />
              </g>
            );
          })}

          {/* telescope tube on its mount */}
          <line x1="114" y1="144" x2="110" y2="158" stroke={BRASS} strokeWidth="3" />
          <rect x="88" y="136" width="50" height="8.5" rx="2" fill="url(#cz-sext-brass)" stroke={ENGRAVE} strokeWidth="0.8" />
          <rect x="134" y="133.5" width="8" height="13.5" rx="1.5" fill="url(#cz-sext-brass)" stroke={ENGRAVE} strokeWidth="0.8" />
          <rect x="82" y="138" width="7" height="4.5" rx="1" fill={BRASS_DK} stroke={ENGRAVE} strokeWidth="0.7" />
          <line x1="96" y1="136" x2="96" y2="144.5" stroke={ENGRAVE} strokeWidth="0.6" opacity="0.6" />
          <line x1="126" y1="136" x2="126" y2="144.5" stroke={ENGRAVE} strokeWidth="0.6" opacity="0.6" />

          {/* shade discs on pivots below the mirror */}
          <g stroke={ENGRAVE} strokeWidth="0.7">
            <circle cx="124" cy="114" r="5.5" fill="#10302e" />
            <circle cx="113" cy="122" r="4.5" fill="#0d2624" />
            <circle cx="104" cy="129" r="3.8" fill="#0a1d1c" />
          </g>
          <g fill={BRASS_HI}>
            <circle cx="124" cy="114" r="1" />
            <circle cx="113" cy="122" r="0.9" />
            <circle cx="104" cy="129" r="0.8" />
          </g>
        </g>

        {/* engraved degree scale: ticks + numerals every 10° */}
        <g className="cz-sext-scale-load">
          {MINORS.map((s) => {
            const a = pt(R_OUT - 1, s);
            const b = pt(R_OUT - 6.5, s);
            return <line key={s} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={ENGRAVE} strokeWidth="0.55" />;
          })}
          {MAJORS.map((s) => {
            const a = pt(R_OUT - 1, s);
            const b = pt(R_OUT - 11, s);
            const n = pt(R_IN - 12, s);
            return (
              <g key={s}>
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={ENGRAVE} strokeWidth="1" />
                <text
                  x={n.x}
                  y={n.y + 2.2}
                  textAnchor="middle"
                  fontFamily="Georgia, 'Times New Roman', serif"
                  fontSize="7"
                  fill={IVORY}
                  opacity="0.92"
                >
                  {s}
                </text>
              </g>
            );
          })}
        </g>

        {/* travelling gleam along the brass arc */}
        <path
          className="cz-sext-gleam"
          d={GLEAM_PATH}
          fill="none"
          stroke="#ffe9a8"
          strokeWidth="4"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="7 93"
          opacity="0.45"
        />

        {/* index arm with vernier, swung to the 42.5° reading */}
        <g className="cz-sext-arm">
          {VERNIER.map((s, i) => {
            const a = pt(R_IN - 16, s);
            const b = pt(R_IN - (i % 4 === 0 ? 7 : 9.5), s);
            return <line key={s} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={BRASS_HI} strokeWidth="0.6" opacity="0.9" />;
          })}
          <line
            x1={PIVOT_X}
            y1={PIVOT_Y}
            x2={pt(R_IN + 1, READING).x}
            y2={pt(R_IN + 1, READING).y}
            stroke="url(#cz-sext-brass)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <line
            x1={PIVOT_X}
            y1={PIVOT_Y}
            x2={pt(R_IN - 4, READING).x}
            y2={pt(R_IN - 4, READING).y}
            stroke={ENGRAVE}
            strokeWidth="1"
            opacity="0.6"
          />
          {/* counterweight tail */}
          <line x1={PIVOT_X} y1={PIVOT_Y} x2={pt(-28, READING).x} y2={pt(-28, READING).y} stroke={BRASS} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx={pt(-30, READING).x} cy={pt(-30, READING).y} r="3.5" fill="url(#cz-sext-hub)" stroke={ENGRAVE} strokeWidth="0.7" />
          {/* index mirror hub */}
          <circle cx={PIVOT_X} cy={PIVOT_Y} r="7.5" fill="url(#cz-sext-hub)" stroke={ENGRAVE} strokeWidth="1" />
          <circle cx={PIVOT_X} cy={PIVOT_Y} r="1.7" fill={ENGRAVE} />
        </g>

        {/* the Hermit below the instrument, lantern raised to the star */}
        <g className="cz-sext-hermit-load">
          <ellipse cx="151" cy="373" rx="26" ry="3.5" fill="#000000" opacity="0.35" />
          {/* staff */}
          <line x1="129" y1="316" x2="135" y2="371" stroke={BRASS_DK} strokeWidth="2" strokeLinecap="round" />
          {/* hooded robe */}
          <path
            d="M 140 332 Q 135 350 137 370 L 165 370 Q 167 350 162 332"
            fill="#102a29"
            stroke={IVORY}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path d="M 140 334 Q 139 318 151 315 Q 163 318 162 334" fill="#102a29" stroke={IVORY} strokeWidth="1.2" />
          <ellipse cx="151" cy="326" rx="4.6" ry="5.6" fill="#030809" />
          {/* robe fold engraving */}
          <path d="M 144 340 Q 143 354 144 368 M 150 342 Q 150 356 150 368" fill="none" stroke={BRASS} strokeWidth="0.6" opacity="0.5" />
          {/* raised arm + gold lantern */}
          <path d="M 161 338 Q 168 330 172 322" fill="none" stroke={IVORY} strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="175" cy="312" r="11" fill="url(#cz-sext-lamp)" />
          <line x1="175" y1="306" x2="175" y2="309" stroke={BRASS_DK} strokeWidth="0.9" />
          <path d="M 170 309 L 180 309 L 178.5 320 L 171.5 320 Z" fill={BRASS} stroke={ENGRAVE} strokeWidth="0.8" strokeLinejoin="round" />
          <path d="M 175 311.5 L 176.4 314.5 L 175 317.5 L 173.6 314.5 Z" fill="#fff6d8" />
        </g>

        {/* title plate */}
        <g>
          <line x1="58" y1="392" x2="126" y2="392" stroke={BRASS} strokeWidth="0.8" opacity="0.8" />
          <line x1="174" y1="392" x2="242" y2="392" stroke={BRASS} strokeWidth="0.8" opacity="0.8" />
          <path d="M 150 387 L 153.5 392 L 150 397 L 146.5 392 Z" fill={BRASS} />
          <text
            x="150"
            y="417"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="700"
            fontSize="17"
            letterSpacing="5"
            fill={IVORY}
          >
            THE HERMIT
          </text>
          <text
            x="150"
            y="432"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fontSize="8.5"
            letterSpacing="2.5"
            fill={BRASS}
            opacity="0.95"
          >
            sextans · astronomicus
          </text>
        </g>
      </svg>
    </figure>
  );
}
