// ASTRONOMICAL CLOCK — The Hermit (IX)
// Prague-Orloj-inspired astronomical clock face: dark teal dial plate with a
// brass zodiac ring (12 glyph sectors), an old-style 24-hour Roman numeral
// ring, a rotating star-field sky disc, gold sun + silver moon hand-pointers,
// and a tiny Hermit with lantern standing on the central pivot boss. Brass
// frame with fluted side columns and small red jewel accents. Server-component
// safe: no hooks, no client directive.

const CX = 150;
const CY = 228;

const ROMAN_24 = [
  "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII",
  "XIII", "XIIII", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI", "XXII", "XXIII", "XXIIII",
];

const ZODIAC = [
  "♈︎", "♉︎", "♊︎", "♋︎", "♌︎", "♍︎",
  "♎︎", "♏︎", "♐︎", "♑︎", "♒︎", "♓︎",
];

const TICKS_24 = Array.from({ length: 24 }, (_, i) => i * 15);
const TICKS_96 = Array.from({ length: 96 }, (_, i) => i * 3.75);
const SECTOR_12 = Array.from({ length: 12 }, (_, i) => i * 30);
const CAL_TICKS = Array.from({ length: 12 }, (_, i) => i * 30);

// star field on the rotating sky disc, offsets from dial center
const SKY_STARS: Array<[number, number, number]> = [
  [-40, -30, 0.9], [-20, -45, 0.7], [5, -50, 1], [30, -42, 0.7],
  [48, -22, 0.9], [52, 5, 0.7], [40, 30, 1], [18, 44, 0.7],
  [-8, 50, 0.9], [-35, 38, 0.7], [-50, 12, 0.9], [-52, -12, 0.7],
  [10, -28, 1.1], [-15, -8, 0.7], [22, -12, 0.9], [28, 15, 0.7],
  [0, 28, 1], [-28, 18, 0.7], [38, -8, 1], [-5, -38, 0.8],
  [15, 32, 0.7], [-42, -2, 1], [46, -38, 0.7], [8, 10, 0.8],
];

const BG_STARS: Array<[number, number, number]> = [
  [30, 60, 0.8], [270, 84, 0.7], [24, 180, 0.7], [276, 168, 0.8],
  [36, 300, 0.7], [264, 330, 0.7], [52, 372, 0.8], [248, 384, 0.7],
  [70, 34, 0.7], [228, 40, 0.8], [22, 410, 0.7], [278, 250, 0.7],
];

const BRASS = "#c9a24a";
const BRASS_DARK = "#8a6b28";
const GOLD = "#e3c268";
const SILVER = "#c8ccd4";
const RED = "#b23a2a";
const TEAL_DEEP = "#062522";
const INK = "#041614";

export default function AstronomicalClockCard() {
  return (
    <figure
      className="cz-clock-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
    >
      <style>{`
        .cz-clock-card { position: relative; overflow: hidden; }
        .cz-clock-card svg { display: block; width: 100%; height: 100%; }

        /* ---- load reveal ---- */
        .cz-clock-ring-in {
          transform-box: fill-box;
          transform-origin: center;
          animation: cz-clock-ring-in 1s cubic-bezier(.22,.8,.3,1) backwards;
        }
        .cz-clock-ring-a { animation-delay: .05s; }
        .cz-clock-ring-b { animation-delay: .25s; }
        .cz-clock-sky-load { animation: cz-clock-fade-in 1.1s ease-out .45s backwards; }

        .cz-clock-hand-load {
          transform-box: view-box;
          transform-origin: 150px 228px;
          transform: rotate(var(--fin));
          animation: cz-clock-hand-swing 1.1s cubic-bezier(.25,.9,.3,1) backwards;
        }
        .cz-clock-sun-load  { --fin: 42deg;  animation-delay: .55s; }
        .cz-clock-moon-load { --fin: 204deg; animation-delay: .75s; }

        .cz-clock-hermit {
          transform-box: fill-box;
          transform-origin: center bottom;
          animation: cz-clock-hermit-in .6s ease-out 1.5s backwards;
        }
        .cz-clock-caption { animation: cz-clock-fade-in .9s ease-out 1.2s backwards; }

        @keyframes cz-clock-ring-in {
          from { opacity: 0; transform: scale(.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes cz-clock-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cz-clock-hand-swing {
          from { opacity: 0; transform: rotate(0deg); }
          25%  { opacity: 1; }
          to   { opacity: 1; transform: rotate(var(--fin)); }
        }
        @keyframes cz-clock-hermit-in {
          from { opacity: 0; transform: scale(.6); }
          to   { opacity: 1; transform: scale(1); }
        }

        /* ---- ambient motion ---- */
        .cz-clock-sky-spin {
          transform-box: view-box;
          transform-origin: 150px 228px;
          animation: cz-clock-spin 150s linear infinite;
        }
        .cz-clock-sun-creep {
          transform-box: view-box;
          transform-origin: 150px 228px;
          animation: cz-clock-spin 1200s linear infinite;
        }
        .cz-clock-lantern-glow {
          animation: cz-clock-glow 9s ease-in-out infinite;
        }
        @keyframes cz-clock-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes cz-clock-glow {
          0%, 100% { opacity: .55; }
          50%      { opacity: .95; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cz-clock-ring-in,
          .cz-clock-sky-load,
          .cz-clock-hand-load,
          .cz-clock-hermit,
          .cz-clock-caption,
          .cz-clock-sky-spin,
          .cz-clock-sun-creep,
          .cz-clock-lantern-glow {
            animation: none;
          }
        }
      `}</style>

      <svg
        viewBox="0 0 300 450"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="The Hermit, tarot card nine, as a medieval astronomical clock with zodiac ring and sun and moon hands"
      >
        <defs>
          <radialGradient id="cz-clock-plate" cx="50%" cy="46%" r="72%">
            <stop offset="0%" stopColor="#0d3a35" />
            <stop offset="60%" stopColor="#082b28" />
            <stop offset="100%" stopColor={TEAL_DEEP} />
          </radialGradient>
          <radialGradient id="cz-clock-sky" cx="50%" cy="42%" r="70%">
            <stop offset="0%" stopColor="#123f4a" />
            <stop offset="70%" stopColor="#0a2630" />
            <stop offset="100%" stopColor="#05161c" />
          </radialGradient>
          <linearGradient id="cz-clock-brass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e0bd66" />
            <stop offset="50%" stopColor={BRASS} />
            <stop offset="100%" stopColor="#96742c" />
          </linearGradient>
          <radialGradient id="cz-clock-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe9a8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffe9a8" stopOpacity="0" />
          </radialGradient>
          {/* fluted side column with an arch capital */}
          <g id="cz-clock-column">
            <path d="M -7 0 Q 0 -12 7 0" fill="none" stroke={BRASS} strokeWidth="1.4" />
            <rect x="-6" y="0" width="12" height="4" fill="url(#cz-clock-brass)" />
            <rect x="-4" y="4" width="8" height="120" fill="#0a302c" stroke={BRASS_DARK} strokeWidth="1" />
            <line x1="-1.5" y1="8" x2="-1.5" y2="120" stroke={BRASS_DARK} strokeWidth="0.7" opacity="0.8" />
            <line x1="1.5" y1="8" x2="1.5" y2="120" stroke={BRASS_DARK} strokeWidth="0.7" opacity="0.8" />
            <rect x="-6" y="124" width="12" height="4" fill="url(#cz-clock-brass)" />
            <circle cx="0" cy="-5" r="1.6" fill={RED} />
          </g>
          {/* four-point star */}
          <g id="cz-clock-star4">
            <path d="M 0 -4 L 1.1 -1.1 L 4 0 L 1.1 1.1 L 0 4 L -1.1 1.1 L -4 0 L -1.1 -1.1 Z" />
          </g>
        </defs>

        {/* teal plate ground */}
        <rect x="0" y="0" width="300" height="450" fill="url(#cz-clock-plate)" />
        <g fill="#cfe4dd">
          {BG_STARS.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} opacity={i % 3 === 0 ? 0.55 : 0.3} />
          ))}
        </g>

        {/* interior border: brass double frame, corner bosses, red jewels */}
        <rect x="9" y="9" width="282" height="432" fill="none" stroke={BRASS} strokeWidth="2" />
        <rect x="14" y="14" width="272" height="422" fill="none" stroke={BRASS_DARK} strokeWidth="0.8" opacity="0.8" />
        <g fill="url(#cz-clock-brass)" stroke={BRASS_DARK} strokeWidth="0.7">
          <circle cx="9" cy="9" r="4" />
          <circle cx="291" cy="9" r="4" />
          <circle cx="9" cy="441" r="4" />
          <circle cx="291" cy="441" r="4" />
        </g>
        <g fill={RED}>
          <circle cx="150" cy="9" r="2" />
          <circle cx="150" cy="441" r="2" />
        </g>

        {/* side columns echoing the clock tower architecture */}
        <use href="#cz-clock-column" transform="translate(26 158)" />
        <use href="#cz-clock-column" transform="translate(274 158)" />

        {/* IX numeral plaque */}
        <g>
          <rect x="126" y="24" width="48" height="26" fill="#0a302c" stroke={BRASS} strokeWidth="1.2" />
          <text
            x="150"
            y="42"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="700"
            fontSize="15"
            letterSpacing="2"
            fill={GOLD}
          >
            IX
          </text>
          <circle cx="131" cy="29" r="1.1" fill={RED} />
          <circle cx="169" cy="29" r="1.1" fill={RED} />
        </g>

        {/* ======== the clock dial ======== */}

        {/* outer zodiac ring on brass sectors */}
        <g className="cz-clock-ring-in cz-clock-ring-a">
          <circle cx={CX} cy={CY} r="118" fill="url(#cz-clock-brass)" stroke={BRASS_DARK} strokeWidth="1.5" />
          <circle cx={CX} cy={CY} r="97" fill={TEAL_DEEP} stroke={BRASS_DARK} strokeWidth="1.2" />
          {SECTOR_12.map((a) => (
            <g key={a} transform={`rotate(${a} ${CX} ${CY})`}>
              <line x1={CX} y1={CY - 118} x2={CX} y2={CY - 97} stroke={BRASS_DARK} strokeWidth="1" />
            </g>
          ))}
          {ZODIAC.map((g, i) => (
            <g key={i} transform={`rotate(${i * 30 + 15} ${CX} ${CY})`}>
              <text
                x={CX}
                y={CY - 103}
                textAnchor="middle"
                fontFamily="Georgia, 'DejaVu Sans', 'Segoe UI Symbol', serif"
                fontSize="10.5"
                fill={INK}
              >
                {g}
              </text>
            </g>
          ))}
          {/* red jewel at the top of the zodiac ring */}
          <circle cx={CX} cy={CY - 107.5} r="1.8" fill={RED} stroke={BRASS_DARK} strokeWidth="0.5" />
        </g>

        {/* middle ring: 24-hour old-style Roman numerals */}
        <g className="cz-clock-ring-in cz-clock-ring-b">
          <circle cx={CX} cy={CY} r="95" fill="#0b332f" stroke={BRASS} strokeWidth="1" />
          <circle cx={CX} cy={CY} r="76" fill="#082b28" stroke={BRASS_DARK} strokeWidth="0.9" />
          {TICKS_96.map((a) => {
            const major = a % 15 === 0;
            return (
              <g key={a} transform={`rotate(${a} ${CX} ${CY})`}>
                <line
                  x1={CX}
                  y1={CY - 95}
                  x2={CX}
                  y2={CY - (major ? 89 : 92)}
                  stroke={BRASS}
                  strokeWidth={major ? 1 : 0.5}
                  opacity={major ? 0.95 : 0.6}
                />
              </g>
            );
          })}
          {TICKS_24.map((a, i) => (
            <g key={a} transform={`rotate(${a + 7.5} ${CX} ${CY})`}>
              <text
                x={CX}
                y={CY - 79.5}
                textAnchor="middle"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontSize="6.8"
                fill={GOLD}
              >
                {ROMAN_24[i]}
              </text>
            </g>
          ))}
        </g>

        {/* inner sky disc: load fade + extremely slow ambient rotation */}
        <g className="cz-clock-sky-load">
          <circle cx={CX} cy={CY} r="74" fill="url(#cz-clock-sky)" stroke={BRASS_DARK} strokeWidth="1" />
          <g className="cz-clock-sky-spin">
            <g fill="#e8f2ee">
              {SKY_STARS.map(([dx, dy, r], i) => (
                <circle key={i} cx={CX + dx} cy={CY + dy} r={r} opacity={i % 2 === 0 ? 0.85 : 0.5} />
              ))}
            </g>
            <g fill="#e8f2ee" opacity="0.9">
              <use href="#cz-clock-star4" transform={`translate(${CX - 24} ${CY - 34}) scale(0.8)`} />
              <use href="#cz-clock-star4" transform={`translate(${CX + 34} ${CY + 24}) scale(0.7)`} />
              <use href="#cz-clock-star4" transform={`translate(${CX + 12} ${CY - 18}) scale(0.55)`} />
            </g>
            {/* ecliptic arc traced on the sky */}
            <path
              d={`M ${CX - 58} ${CY + 22} A 62 62 0 0 1 ${CX + 58} ${CY - 22}`}
              fill="none"
              stroke={BRASS}
              strokeWidth="0.7"
              strokeDasharray="2 3"
              opacity="0.6"
            />
          </g>

          {/* tiny calendar sub-dial at the bottom of the sky disc */}
          <g>
            <circle cx={CX} cy={CY + 52} r="15" fill="#0a2c28" stroke={BRASS} strokeWidth="0.9" />
            {CAL_TICKS.map((a) => (
              <g key={a} transform={`rotate(${a} ${CX} ${CY + 52})`}>
                <line x1={CX} y1={CY + 38.5} x2={CX} y2={CY + 41.5} stroke={BRASS} strokeWidth="0.6" opacity="0.8" />
              </g>
            ))}
            <path d={`M ${CX} ${CY + 43} L ${CX - 2.2} ${CY + 50} L ${CX + 2.2} ${CY + 50} Z`} fill={RED} />
            <text
              x={CX}
              y={CY + 58.5}
              textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontSize="5.5"
              fill={GOLD}
            >
              SEP
            </text>
          </g>
        </g>

        {/* moon hand: silver crescent pointer, swings to 204deg */}
        <g className="cz-clock-hand-load cz-clock-moon-load">
          <line x1={CX} y1={CY + 12} x2={CX} y2={CY - 62} stroke={SILVER} strokeWidth="1.6" />
          <circle cx={CX} cy={CY + 12} r="4.5" fill="#0a2c28" stroke={SILVER} strokeWidth="1.2" />
          <g transform={`translate(${CX} ${CY - 62})`}>
            <circle cx="0" cy="0" r="6.5" fill={SILVER} />
            <circle cx="2.6" cy="-0.8" r="5.4" fill="#0a2630" />
          </g>
        </g>

        {/* sun hand: gold rayed pointer, swings to 42deg + near-imperceptible creep */}
        <g className="cz-clock-hand-load cz-clock-sun-load">
          <g className="cz-clock-sun-creep">
            <line x1={CX} y1={CY + 10} x2={CX} y2={CY - 60} stroke={GOLD} strokeWidth="1.8" />
            <circle cx={CX} cy={CY + 10} r="5" fill="#0a2c28" stroke={GOLD} strokeWidth="1.3" />
            <g transform={`translate(${CX} ${CY - 60})`}>
              <g stroke={GOLD} strokeWidth="1.2">
                {SECTOR_12.map((a) => (
                  <line key={a} x1="0" y1="-7" x2="0" y2="-9.5" transform={`rotate(${a})`} />
                ))}
              </g>
              <circle cx="0" cy="0" r="5.5" fill={GOLD} stroke={BRASS_DARK} strokeWidth="0.7" />
              <circle cx="0" cy="0" r="2" fill="#fff3cf" />
            </g>
          </g>
        </g>

        {/* central boss with the tiny Hermit standing on the axis, lantern raised */}
        <g className="cz-clock-hermit">
          <circle cx={CX} cy={CY + 6} r="7" fill="url(#cz-clock-brass)" stroke={BRASS_DARK} strokeWidth="1" />
          <circle cx={CX} cy={CY + 6} r="2.2" fill={BRASS_DARK} />
          {/* lantern glow */}
          <circle
            className="cz-clock-lantern-glow"
            cx={CX + 9.5}
            cy={CY - 20}
            r="7.5"
            fill="url(#cz-clock-glow)"
          />
          {/* staff */}
          <line x1={CX - 7} y1={CY - 22} x2={CX - 5.5} y2={CY + 4} stroke={BRASS_DARK} strokeWidth="1.3" strokeLinecap="round" />
          {/* hooded robe */}
          <path
            d={`M ${CX - 5} ${CY - 12} Q ${CX - 6.5} ${CY - 2} ${CX - 5.5} ${CY + 4} L ${CX + 5.5} ${CY + 4} Q ${CX + 6.5} ${CY - 2} ${CX + 5} ${CY - 12}`}
            fill="#0f3d38"
            stroke={GOLD}
            strokeWidth="0.9"
            strokeLinejoin="round"
          />
          {/* hood */}
          <path
            d={`M ${CX - 5} ${CY - 11} Q ${CX - 5.5} ${CY - 22} ${CX} ${CY - 23.5} Q ${CX + 5.5} ${CY - 22} ${CX + 5} ${CY - 11}`}
            fill="#0f3d38"
            stroke={GOLD}
            strokeWidth="0.9"
          />
          {/* shadowed face */}
          <ellipse cx={CX} cy={CY - 17} rx="2.2" ry="2.8" fill={INK} />
          {/* raised arm to lantern */}
          <path d={`M ${CX + 4} ${CY - 10} Q ${CX + 7.5} ${CY - 13} ${CX + 9} ${CY - 16.5}`} fill="none" stroke={GOLD} strokeWidth="0.9" strokeLinecap="round" />
          {/* lantern */}
          <line x1={CX + 9.5} y1={CY - 23} x2={CX + 9.5} y2={CY - 21.5} stroke={GOLD} strokeWidth="0.7" />
          <path
            d={`M ${CX + 6.8} ${CY - 21.5} L ${CX + 12.2} ${CY - 21.5} L ${CX + 11.2} ${CY - 16} L ${CX + 7.8} ${CY - 16} Z`}
            fill={GOLD}
            stroke={BRASS_DARK}
            strokeWidth="0.6"
            strokeLinejoin="round"
          />
          <path d={`M ${CX + 9.5} ${CY - 20.3} L ${CX + 10.4} ${CY - 18.6} L ${CX + 9.5} ${CY - 17.2} L ${CX + 8.6} ${CY - 18.6} Z`} fill="#fff6d8" />
        </g>

        {/* caption block: engraved caps + latin note */}
        <g className="cz-clock-caption">
          <line x1="70" y1="382" x2="230" y2="382" stroke={BRASS} strokeWidth="1" />
          <path d="M 62 382 L 66 378.5 L 70 382 L 66 385.5 Z" fill={RED} />
          <path d="M 230 382 L 234 378.5 L 238 382 L 234 385.5 Z" fill={RED} />
          {/* engraved effect: brass highlight beneath dark letters */}
          <text
            x="150"
            y="405.8"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="700"
            fontSize="19"
            letterSpacing="4"
            fill={BRASS}
            opacity="0.55"
          >
            THE HERMIT
          </text>
          <text
            x="150"
            y="405"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="700"
            fontSize="19"
            letterSpacing="4"
            fill={GOLD}
          >
            THE HERMIT
          </text>
          <text
            x="150"
            y="424"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fontSize="9"
            letterSpacing="1.5"
            fill="#9db8ae"
          >
            · horologium astronomicum ·
          </text>
        </g>
      </svg>
    </figure>
  );
}
