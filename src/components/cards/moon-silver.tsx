// Moon Silver — The Hermit (IX)
// Lunar silverpoint: charcoal-black card, silver/grey ink only.
// Hooded figure on a moonlit ridge, lantern as a small white moon-disc,
// a ring of eight moon phases arcing across the top, misty valley below.
// Framed as a real tarot card: silver double rule, corner crescents,
// constellation lines, and a manuscript "luna IX" moon-age colophon.

type MoonPhase = {
  x: number;
  y: number;
  // Horizontal offset (px) of the shadow disc inside the moon circle.
  // null = full moon (no shadow), 0 = new moon (fully covered).
  shadow: number | null;
  // -1 waxing (lit on the right), 1 waning (lit on the left), 0 symmetric.
  dir: -1 | 0 | 1;
};

const MOON_R = 7;

// Eight phases arcing across the top: new -> crescent -> quarter -> gibbous
// -> full -> gibbous -> quarter -> crescent, along a shallow rainbow arc.
const PHASES: MoonPhase[] = [
  { x: 42, y: 63.5, shadow: 0, dir: -1 },
  { x: 74, y: 51.4, shadow: 3.2, dir: -1 },
  { x: 104, y: 44.1, shadow: 5.6, dir: -1 },
  { x: 132, y: 40.6, shadow: 9.4, dir: -1 },
  { x: 168, y: 40.6, shadow: null, dir: 0 },
  { x: 196, y: 44.1, shadow: 9.4, dir: 1 },
  { x: 226, y: 51.4, shadow: 5.6, dir: 1 },
  { x: 258, y: 63.5, shadow: 3.2, dir: 1 },
];

// Sparse, dim field stars above the ridge — static, deliberately quiet.
const STARS: Array<[number, number, number, number]> = [
  [34, 108, 1.1, 0.5],
  [68, 88, 0.8, 0.35],
  [102, 122, 0.9, 0.3],
  [128, 96, 0.7, 0.4],
  [176, 100, 0.9, 0.35],
  [208, 86, 1.1, 0.5],
  [238, 116, 0.8, 0.3],
  [266, 96, 0.9, 0.4],
  [52, 152, 0.7, 0.25],
  [254, 158, 0.7, 0.25],
  [90, 172, 0.8, 0.2],
  [214, 176, 0.8, 0.2],
];

// Faint constellation figures in the sky — open polylines, star-map style.
const CONSTELLATIONS: Array<Array<[number, number]>> = [
  [[38, 128], [58, 112], [82, 124], [72, 150], [48, 158]],
  [[222, 132], [244, 114], [264, 134], [248, 156], [228, 150]],
];

// A tiny star-map dot cluster (Pleiades-like) in the upper-left sky.
const CLUSTER: Array<[number, number, number]> = [
  [60, 92, 1.2],
  [54, 88, 0.8],
  [66, 86, 0.9],
  [57, 97, 0.7],
  [65, 95, 0.8],
  [50, 94, 0.6],
  [70, 91, 0.6],
];

// Delicate lunar-cycle strip above the title: new -> full -> new in miniature.
const STRIP_R = 2.2;
const STRIP: MoonPhase[] = [
  { x: 118, y: 397, shadow: 0, dir: -1 },
  { x: 126, y: 397, shadow: 1.1, dir: -1 },
  { x: 134, y: 397, shadow: 1.8, dir: -1 },
  { x: 142, y: 397, shadow: 3, dir: -1 },
  { x: 150, y: 397, shadow: null, dir: 0 },
  { x: 158, y: 397, shadow: 3, dir: 1 },
  { x: 166, y: 397, shadow: 1.8, dir: 1 },
  { x: 174, y: 397, shadow: 1.1, dir: 1 },
  { x: 182, y: 397, shadow: 0, dir: 1 },
];

const SERIF = "Georgia, 'Times New Roman', 'Palatino Linotype', serif";

export default function MoonSilverCard() {
  return (
    <figure
      className="cz-ms-card"
      style={{ aspectRatio: "2/3", width: "100%" }}
    >
      <style>{`
        .cz-ms-card {
          position: relative;
          margin: 0;
          overflow: hidden;
          border-radius: 12px;
          background: #07080a;
        }
        .cz-ms-card svg { display: block; width: 100%; height: 100%; }

        @keyframes cz-ms-phase-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cz-ms-rise {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cz-ms-breathe {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50%      { opacity: 0.9;  transform: scale(1.08); }
        }
        @keyframes cz-ms-drift-a {
          0%, 100% { transform: translateX(-7px); }
          50%      { transform: translateX(7px); }
        }
        @keyframes cz-ms-drift-b {
          0%, 100% { transform: translateX(6px); }
          50%      { transform: translateX(-6px); }
        }

        .cz-ms-phases { animation: cz-ms-phase-in 0.7s ease-out both; }
        .cz-ms-sky    { animation: cz-ms-phase-in 0.9s ease-out 0.35s both; }
        .cz-ms-scene  { animation: cz-ms-rise 1s ease-out 0.5s both; }
        .cz-ms-title  { animation: cz-ms-phase-in 0.8s ease-out 0.9s both; }
        .cz-ms-frame  { animation: cz-ms-phase-in 0.7s ease-out both; }

        .cz-ms-halo {
          transform-box: fill-box;
          transform-origin: center;
          animation: cz-ms-breathe 22s ease-in-out infinite;
        }
        .cz-ms-mist-a { animation: cz-ms-drift-a 48s ease-in-out infinite; }
        .cz-ms-mist-b { animation: cz-ms-drift-b 60s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .cz-ms-phases, .cz-ms-sky, .cz-ms-scene, .cz-ms-title, .cz-ms-frame,
          .cz-ms-halo, .cz-ms-mist-a, .cz-ms-mist-b {
            animation: none !important;
          }
        }
      `}</style>

      <svg
        viewBox="0 0 300 450"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="The Hermit tarot card in lunar silverpoint style"
      >
        <defs>
          <radialGradient id="cz-ms-bg" cx="50%" cy="34%" r="85%">
            <stop offset="0%" stopColor="#14161b" />
            <stop offset="55%" stopColor="#0b0c10" />
            <stop offset="100%" stopColor="#050608" />
          </radialGradient>
          <radialGradient id="cz-ms-skyglow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9aa2b0" stopOpacity="0.22" />
            <stop offset="60%" stopColor="#9aa2b0" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#9aa2b0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cz-ms-halo-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f2f4f8" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#d9dde6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#d9dde6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cz-ms-vig" cx="50%" cy="46%" r="75%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0" />
            <stop offset="72%" stopColor="#000000" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
          </radialGradient>
          <linearGradient id="cz-ms-ridge-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3c4048" />
            <stop offset="100%" stopColor="#191b20" />
          </linearGradient>
          <linearGradient id="cz-ms-ridge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#565b66" />
            <stop offset="28%" stopColor="#33363e" />
            <stop offset="100%" stopColor="#121318" />
          </linearGradient>
          <linearGradient id="cz-ms-figure" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6d727d" />
            <stop offset="45%" stopColor="#43464f" />
            <stop offset="100%" stopColor="#23252b" />
          </linearGradient>
          <linearGradient id="cz-ms-figure-lit" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8b909b" stopOpacity="0" />
            <stop offset="100%" stopColor="#a8adb8" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="cz-ms-mist-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#b9bfca" stopOpacity="0" />
            <stop offset="50%" stopColor="#b9bfca" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#b9bfca" stopOpacity="0" />
          </linearGradient>
          <filter id="cz-ms-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="0.9" />
          </filter>
          <filter id="cz-ms-mistblur" x="-30%" y="-60%" width="160%" height="220%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          {/* Small crescent ornament, horns pointing left; rotate per corner */}
          <path
            id="cz-ms-crescent"
            d="M0 -4.2 A4.2 4.2 0 1 1 0 4.2 A5 5 0 0 0 0 -4.2 Z"
          />
          {PHASES.map((p, i) => (
            <clipPath key={i} id={`cz-ms-mc${i}`}>
              <circle cx={p.x} cy={p.y} r={MOON_R} />
            </clipPath>
          ))}
        </defs>

        {/* Charcoal ground */}
        <rect x="0" y="0" width="300" height="450" fill="url(#cz-ms-bg)" />

        {/* Quiet star field */}
        <g>
          {STARS.map(([cx, cy, r, o], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="#c4c9d3" opacity={o} />
          ))}
        </g>

        {/* Constellation figures + star-map cluster — fade in before the land */}
        <g className="cz-ms-sky">
          {CONSTELLATIONS.map((pts, i) => (
            <g key={i}>
              <polyline
                points={pts.map(([x, y]) => `${x},${y}`).join(" ")}
                fill="none"
                stroke="#c4c9d3"
                strokeOpacity="0.16"
                strokeWidth="0.6"
              />
              {pts.map(([x, y], j) => (
                <circle key={j} cx={x} cy={y} r="1" fill="#cdd2db" opacity="0.55" />
              ))}
            </g>
          ))}
          {CLUSTER.map(([cx, cy, r], i) => (
            <circle key={`cl${i}`} cx={cx} cy={cy} r={r} fill="#d4d9e1" opacity="0.5" />
          ))}
        </g>

        {/* Phase ring + numeral — fades in first on load */}
        <g className="cz-ms-phases">
          <circle cx={168} cy={40.6} r={18} fill="url(#cz-ms-halo-g)" opacity="0.35" />
          {PHASES.map((p, i) => (
            <g key={i}>
              {p.shadow === 0 ? (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={MOON_R - 0.6}
                  fill="none"
                  stroke="#c8ccd6"
                  strokeOpacity="0.28"
                  strokeWidth="0.8"
                />
              ) : (
                <circle cx={p.x} cy={p.y} r={MOON_R} fill="#d3d7df" />
              )}
              {p.shadow !== null && p.shadow > 0 && (
                <g clipPath={`url(#cz-ms-mc${i})`}>
                  <circle
                    cx={p.x + p.shadow * p.dir}
                    cy={p.y}
                    r={MOON_R}
                    fill="#0a0b0e"
                  />
                </g>
              )}
            </g>
          ))}
          <text
            x="150"
            y="72"
            textAnchor="middle"
            fontFamily={SERIF}
            fontSize="14"
            letterSpacing="4"
            fill="#c2c7d1"
          >
            IX
          </text>
        </g>

        {/* Landscape — rises from darkness like moonrise */}
        <g className="cz-ms-scene">
          {/* Moonlit haze above the horizon */}
          <ellipse cx="150" cy="300" rx="170" ry="90" fill="url(#cz-ms-skyglow)" />

          {/* Far ridge, soft and dim */}
          <path
            d="M0 336 L70 316 L140 328 L215 310 L300 330 L300 450 L0 450 Z"
            fill="url(#cz-ms-ridge-far)"
            filter="url(#cz-ms-soft)"
            opacity="0.85"
          />

          {/* Mist band in the valley behind the figure */}
          <g className="cz-ms-mist-a" filter="url(#cz-ms-mistblur)">
            <rect x="-20" y="312" width="340" height="14" fill="url(#cz-ms-mist-g)" />
            <rect x="-30" y="330" width="360" height="10" fill="url(#cz-ms-mist-g)" opacity="0.7" />
          </g>

          {/* Main ridge with the central peak */}
          <path
            d="M0 348 L52 328 L104 310 L150 296 L196 308 L248 324 L300 340 L300 450 L0 450 Z"
            fill="url(#cz-ms-ridge)"
          />
          {/* Silver highlight along the crest */}
          <path
            d="M0 348 L52 328 L104 310 L150 296 L196 308 L248 324 L300 340"
            fill="none"
            stroke="#aeb4c0"
            strokeOpacity="0.5"
            strokeWidth="1.1"
            filter="url(#cz-ms-soft)"
          />

          {/* The Hermit — layered silver-grey tones, no hard outlines */}
          <g filter="url(#cz-ms-soft)">
            {/* Cloak */}
            <path
              d="M150 210 C138 214 131 228 127 248 C123 268 120 283 119 297
                 L181 297 C180 283 177 268 173 248 C169 228 162 214 150 210 Z"
              fill="url(#cz-ms-figure)"
            />
            {/* Lantern-side rim light on the cloak */}
            <path
              d="M150 210 C162 214 169 228 173 248 C177 268 180 283 181 297
                 L164 297 C165 280 163 260 159 242 C156 228 153 217 150 210 Z"
              fill="url(#cz-ms-figure-lit)"
            />
            {/* Hood shadow — the unseen face */}
            <ellipse cx="150" cy="231" rx="9.5" ry="12" fill="#101216" />
            <path
              d="M150 214 C143 217 139 224 139 232 C144 227 156 227 161 232 C161 224 157 217 150 214 Z"
              fill="#7d828d"
              opacity="0.8"
            />
            {/* Raised arm holding the lantern */}
            <path
              d="M163 240 C172 231 180 220 186 209 L193 213 C187 225 178 237 169 246 Z"
              fill="#9ba0ab"
            />
            {/* Staff in the other hand */}
            <path
              d="M126 214 L129.5 214 L122 300 L118.5 300 Z"
              fill="#8f949f"
            />
            <circle cx="127.7" cy="212" r="2.6" fill="#aeb3be" />
          </g>

          {/* Lantern — a small white moon-disc with a breathing halo */}
          <g className="cz-ms-halo">
            <circle cx="192" cy="204" r="26" fill="url(#cz-ms-halo-g)" />
            <circle cx="192" cy="204" r="40" fill="url(#cz-ms-halo-g)" opacity="0.4" />
          </g>
          <circle cx="192" cy="204" r="7" fill="#eef1f6" />
          <path
            d="M192 200.4 L193 203 L195.6 204 L193 205 L192 207.6 L191 205 L188.4 204 L191 203 Z"
            fill="#ffffff"
          />

          {/* Foreground mist drifting through the valley */}
          <g className="cz-ms-mist-b" filter="url(#cz-ms-mistblur)">
            <rect x="-30" y="352" width="360" height="12" fill="url(#cz-ms-mist-g)" />
            <rect x="-20" y="372" width="340" height="9" fill="url(#cz-ms-mist-g)" opacity="0.65" />
          </g>
        </g>

        {/* Title — thin tracked silver caps, lunar strip, manuscript colophon */}
        <g className="cz-ms-title">
          {/* Miniature lunar-cycle strip; shadow spill is invisible on the
              near-black ridge, so no clips needed at this size */}
          {STRIP.map((m, i) => (
            <g key={i}>
              {m.shadow === 0 ? (
                <circle
                  cx={m.x}
                  cy={m.y}
                  r={STRIP_R - 0.5}
                  fill="none"
                  stroke="#c8ccd6"
                  strokeOpacity="0.3"
                  strokeWidth="0.5"
                />
              ) : (
                <circle cx={m.x} cy={m.y} r={STRIP_R} fill="#c9cdd6" opacity="0.8" />
              )}
              {m.shadow !== null && m.shadow > 0 && (
                <circle cx={m.x + m.shadow * m.dir} cy={m.y} r={STRIP_R} fill="#101216" />
              )}
            </g>
          ))}
          <rect x="86" y="413.4" width="14" height="0.8" fill="#9aa0ab" opacity="0.7" />
          <rect x="200" y="413.4" width="14" height="0.8" fill="#9aa0ab" opacity="0.7" />
          <text
            x="150"
            y="418"
            textAnchor="middle"
            fontFamily={SERIF}
            fontSize="12"
            letterSpacing="5"
            fill="#bcc1cb"
          >
            THE HERMIT
          </text>
          <text
            x="150"
            y="431.5"
            textAnchor="middle"
            fontFamily={SERIF}
            fontStyle="italic"
            fontSize="8"
            letterSpacing="2"
            fill="#8f949e"
          >
            luna IX
          </text>
        </g>

        {/* Designed tarot frame: silver double rule + corner crescents */}
        <g className="cz-ms-frame">
          <rect
            x="8"
            y="8"
            width="284"
            height="434"
            rx="7"
            fill="none"
            stroke="#c6cbd5"
            strokeOpacity="0.4"
            strokeWidth="1"
          />
          <rect
            x="13.5"
            y="13.5"
            width="273"
            height="423"
            rx="4"
            fill="none"
            stroke="#b9bfca"
            strokeOpacity="0.22"
            strokeWidth="0.6"
          />
          <use href="#cz-ms-crescent" transform="translate(26 26) rotate(45)" fill="#c0c5cf" opacity="0.55" />
          <use href="#cz-ms-crescent" transform="translate(274 26) rotate(135)" fill="#c0c5cf" opacity="0.55" />
          <use href="#cz-ms-crescent" transform="translate(274 424) rotate(225)" fill="#c0c5cf" opacity="0.55" />
          <use href="#cz-ms-crescent" transform="translate(26 424) rotate(315)" fill="#c0c5cf" opacity="0.55" />
        </g>
        <rect x="0" y="0" width="300" height="450" fill="url(#cz-ms-vig)" />
      </svg>
    </figure>
  );
}
