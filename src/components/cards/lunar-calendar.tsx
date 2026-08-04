// Lunar Calendar — The Hermit (IX)
// A moon-phase calendar plate: midnight navy, silver-white ink.
// Large full moon over a ridge where the Hermit walks with his lantern;
// below, a 4x7 calendar grid of tiny moon-phase discs progressing
// new -> full -> new, one full-moon cell ringed in gold and marked IX.
// Weekday row in Latin abbreviations, tracked silver title, plenilunium
// note, thin silver frame with crescent corners.

const SERIF = "Georgia, 'Times New Roman', 'Palatino Linotype', serif";

const GRID_COLS = 7;
const GRID_ROWS = 4;
const CELL_W = 35;
const CELL_H = 38;
const GRID_X = 27.5;
const GRID_Y = 205;
const DISC_R = 9;

// The month is anchored so the exact full moon lands in a central cell.
const NEW_INDEX = 3;
const FULL_INDEX = 17; // row 2, col 3 — the marked plenilunium cell

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

type Cell = {
  i: number;
  cx: number;
  cy: number;
  // Illumination 0 (new) .. 1 (full).
  illum: number;
  // -1 waxing (lit right, shadow disc shifted left), 1 waning.
  dir: -1 | 1;
  isFull: boolean;
  delay: number;
};

const CELLS: Cell[] = Array.from({ length: GRID_COLS * GRID_ROWS }, (_, i) => {
  const col = i % GRID_COLS;
  const row = Math.floor(i / GRID_COLS);
  const angle = (2 * Math.PI * (i - FULL_INDEX)) / 28;
  const illum = (1 - Math.cos(angle)) / 2;
  const waxing = i > NEW_INDEX && i < FULL_INDEX;
  return {
    i,
    cx: GRID_X + col * CELL_W + CELL_W / 2,
    cy: GRID_Y + row * CELL_H + CELL_H / 2 + 3,
    illum,
    dir: waxing ? -1 : 1,
    isFull: i === FULL_INDEX,
    delay: 0.45 + i * 0.043,
  };
});

// Sparse dim stars around the big moon.
const STARS: Array<[number, number, number, number]> = [
  [42, 52, 1, 0.5],
  [72, 84, 0.7, 0.35],
  [98, 40, 0.8, 0.3],
  [206, 44, 0.9, 0.4],
  [238, 78, 0.7, 0.3],
  [262, 50, 1, 0.45],
  [34, 118, 0.7, 0.3],
  [268, 124, 0.8, 0.3],
  [56, 158, 0.6, 0.25],
  [248, 156, 0.6, 0.25],
];

// Lunar maria blotches on the big full moon (clipped to the disc).
const MARIA: Array<[number, number, number, number, number]> = [
  // cx, cy, rx, ry, opacity
  [138, 92, 13, 9, 0.16],
  [162, 104, 10, 13, 0.13],
  [146, 122, 8, 6, 0.15],
  [172, 86, 6, 5, 0.12],
  [128, 112, 6, 8, 0.12],
];

export default function LunarCalendarCard() {
  return (
    <figure
      className="cz-lc-card"
      style={{ aspectRatio: "2/3", width: "100%" }}
    >
      <style>{`
        .cz-lc-card {
          position: relative;
          margin: 0;
          overflow: hidden;
          border-radius: 12px;
          background: #070b1a;
        }
        .cz-lc-card svg { display: block; width: 100%; height: 100%; }

        @keyframes cz-lc-moon-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cz-lc-cell-pop {
          from { opacity: 0; transform: scale(0.3); }
          60%  { opacity: 1; }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes cz-lc-fade-up {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cz-lc-halo-breathe {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50%      { opacity: 0.85; transform: scale(1.07); }
        }
        @keyframes cz-lc-cell-glow {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 1; }
        }
        @keyframes cz-lc-lantern-flicker {
          0%, 100% { opacity: 0.75; }
          50%      { opacity: 1; }
        }

        .cz-lc-moon   { animation: cz-lc-moon-in 1.3s ease-out both; }
        .cz-lc-grid   { animation: cz-lc-fade-up 0.9s ease-out 0.25s both; }
        .cz-lc-title  { animation: cz-lc-fade-up 0.8s ease-out 1.35s both; }
        .cz-lc-frame  { animation: cz-lc-moon-in 0.8s ease-out both; }
        .cz-lc-cell {
          transform-box: fill-box;
          transform-origin: center;
          animation: cz-lc-cell-pop 0.5s ease-out both;
        }

        .cz-lc-halo {
          transform-box: fill-box;
          transform-origin: center;
          animation: cz-lc-halo-breathe 36s ease-in-out infinite;
        }
        .cz-lc-marked { animation: cz-lc-cell-glow 18s ease-in-out infinite; }
        .cz-lc-lantern { animation: cz-lc-lantern-flicker 24s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .cz-lc-moon, .cz-lc-grid, .cz-lc-title, .cz-lc-frame, .cz-lc-cell,
          .cz-lc-halo, .cz-lc-marked, .cz-lc-lantern {
            animation: none !important;
          }
        }
      `}</style>

      <svg
        viewBox="0 0 300 450"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="The Hermit tarot card as a lunar phase calendar"
      >
        <defs>
          <radialGradient id="cz-lc-bg" cx="50%" cy="26%" r="90%">
            <stop offset="0%" stopColor="#131c3d" />
            <stop offset="55%" stopColor="#0b1128" />
            <stop offset="100%" stopColor="#05081a" />
          </radialGradient>
          <radialGradient id="cz-lc-moon-g" cx="42%" cy="38%" r="70%">
            <stop offset="0%" stopColor="#fbfbf4" />
            <stop offset="55%" stopColor="#e9e9de" />
            <stop offset="100%" stopColor="#c6c9c2" />
          </radialGradient>
          <radialGradient id="cz-lc-halo-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#dfe6f5" stopOpacity="0.5" />
            <stop offset="45%" stopColor="#c3cde8" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#c3cde8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cz-lc-lant-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe9b8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffe9b8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cz-lc-vig" cx="50%" cy="44%" r="78%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0" />
            <stop offset="74%" stopColor="#000000" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#02040f" stopOpacity="0.6" />
          </radialGradient>
          <filter id="cz-lc-soft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
          <clipPath id="cz-lc-moonclip">
            <circle cx="150" cy="104" r="44" />
          </clipPath>
          {/* Small crescent ornament, horns pointing left; rotate per corner */}
          <path
            id="cz-lc-crescent"
            d="M0 -4.2 A4.2 4.2 0 1 1 0 4.2 A5 5 0 0 0 0 -4.2 Z"
          />
          {CELLS.map((c) => (
            <clipPath key={c.i} id={`cz-lc-dc${c.i}`}>
              <circle cx={c.cx} cy={c.cy} r={DISC_R} />
            </clipPath>
          ))}
        </defs>

        {/* Midnight navy ground */}
        <rect x="0" y="0" width="300" height="450" fill="url(#cz-lc-bg)" />

        {/* Quiet star field */}
        <g>
          {STARS.map(([cx, cy, r, o], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="#c9d2e8" opacity={o} />
          ))}
        </g>

        {/* Header */}
        <text
          x="150"
          y="36"
          textAnchor="middle"
          fontFamily={SERIF}
          fontSize="8.5"
          letterSpacing="4"
          fill="#93a0c4"
        >
          CALENDARIUM LUNAE
        </text>

        {/* Big full moon, ridge, and the Hermit — brightens in first */}
        <g className="cz-lc-moon">
          <g className="cz-lc-halo">
            <circle cx="150" cy="104" r="78" fill="url(#cz-lc-halo-g)" />
            <circle cx="150" cy="104" r="56" fill="url(#cz-lc-halo-g)" opacity="0.7" />
          </g>
          <circle cx="150" cy="104" r="44" fill="url(#cz-lc-moon-g)" />
          <g clipPath="url(#cz-lc-moonclip)" filter="url(#cz-lc-soft)">
            {MARIA.map(([cx, cy, rx, ry, o], i) => (
              <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="#8d94a8" opacity={o} />
            ))}
          </g>
          <circle
            cx="150"
            cy="104"
            r="44"
            fill="none"
            stroke="#f4f4ec"
            strokeOpacity="0.5"
            strokeWidth="0.7"
          />

          {/* Ridge line beneath the moon */}
          <path
            d="M30 168 L74 158 L118 165 L150 156 L196 163 L236 157 L270 166"
            fill="none"
            stroke="#aab4cf"
            strokeOpacity="0.55"
            strokeWidth="0.9"
          />
          <path
            d="M30 168 L74 158 L118 165 L150 156 L196 163 L236 157 L270 166 L270 172 L30 172 Z"
            fill="#0d1430"
            opacity="0.85"
          />

          {/* The Hermit — small and quiet, walking the ridge */}
          <g transform="translate(188 136)">
            {/* Cloak with hood */}
            <path
              d="M0 0 C-4 1 -6.5 5 -7.5 10 C-8.5 16 -9 21 -9.2 26 L7.2 26
                 C7 21 6.5 16 5.5 10 C4.5 5 3 1 0 0 Z"
              fill="#1c2547"
              stroke="#8d99bd"
              strokeOpacity="0.6"
              strokeWidth="0.5"
            />
            {/* Hood shadow */}
            <ellipse cx="-0.5" cy="6.5" rx="2.4" ry="3" fill="#060a1c" />
            {/* Staff */}
            <path d="M-10.5 -2 L-9.8 -2 L-11.5 27 L-12.2 27 Z" fill="#7f8bb0" />
            {/* Raised arm to the lantern */}
            <path d="M5 12 C8 10 10.5 8 12.5 5.5 L14 7 C12 10 9 12.5 6 14 Z" fill="#2a3560" />
            {/* Lantern */}
            <circle className="cz-lc-lantern" cx="14.5" cy="8" r="6" fill="url(#cz-lc-lant-g)" />
            <circle cx="14.5" cy="8" r="1.8" fill="#ffedc4" />
          </g>
        </g>

        {/* Calendar grid — hairlines, weekday row, phase cells */}
        <g className="cz-lc-grid">
          {/* Weekday letters (Latin abbreviations) */}
          {WEEKDAYS.map((d, col) => (
            <text
              key={col}
              x={GRID_X + col * CELL_W + CELL_W / 2}
              y={GRID_Y - 6}
              textAnchor="middle"
              fontFamily={SERIF}
              fontSize="7"
              letterSpacing="1"
              fill="#8f9cc2"
            >
              {d}
            </text>
          ))}

          {/* Hairlines */}
          {Array.from({ length: GRID_ROWS + 1 }, (_, r) => (
            <line
              key={`h${r}`}
              x1={GRID_X}
              y1={GRID_Y + r * CELL_H}
              x2={GRID_X + GRID_COLS * CELL_W}
              y2={GRID_Y + r * CELL_H}
              stroke="#5d6a94"
              strokeOpacity="0.35"
              strokeWidth="0.5"
            />
          ))}
          {Array.from({ length: GRID_COLS + 1 }, (_, c) => (
            <line
              key={`v${c}`}
              x1={GRID_X + c * CELL_W}
              y1={GRID_Y}
              x2={GRID_X + c * CELL_W}
              y2={GRID_Y + GRID_ROWS * CELL_H}
              stroke="#5d6a94"
              strokeOpacity="0.35"
              strokeWidth="0.5"
            />
          ))}

          {/* Phase cells — populate one by one, left-to-right, top-to-bottom */}
          {CELLS.map((c) => {
            const col = c.i % GRID_COLS;
            const row = Math.floor(c.i / GRID_COLS);
            const shadowOff = 2 * DISC_R * (1 - c.illum);
            const isNew = c.illum < 0.05;
            return (
              <g
                key={c.i}
                className="cz-lc-cell"
                style={{ animationDelay: `${c.delay}s` }}
              >
                {/* Day number */}
                <text
                  x={GRID_X + col * CELL_W + 3.5}
                  y={GRID_Y + row * CELL_H + 8}
                  fontFamily={SERIF}
                  fontSize="5.5"
                  fill="#6d7aa3"
                  opacity="0.9"
                >
                  {c.i + 1}
                </text>

                {c.isFull ? (
                  <>
                    {/* Gold ring marking the plenilunium cell */}
                    <circle
                      className="cz-lc-marked"
                      cx={c.cx}
                      cy={c.cy}
                      r={DISC_R + 3.2}
                      fill="none"
                      stroke="#d8b45e"
                      strokeWidth="1"
                    />
                    <circle cx={c.cx} cy={c.cy} r={DISC_R} fill="#f2ecd8" />
                    <text
                      x={c.cx}
                      y={c.cy + DISC_R + 10.5}
                      textAnchor="middle"
                      fontFamily={SERIF}
                      fontSize="6.5"
                      letterSpacing="1"
                      fill="#d8b45e"
                    >
                      IX
                    </text>
                  </>
                ) : isNew ? (
                  <circle
                    cx={c.cx}
                    cy={c.cy}
                    r={DISC_R - 0.7}
                    fill="none"
                    stroke="#aeb8d4"
                    strokeOpacity="0.4"
                    strokeWidth="0.7"
                  />
                ) : (
                  <>
                    <circle cx={c.cx} cy={c.cy} r={DISC_R} fill="#d6dcea" />
                    <g clipPath={`url(#cz-lc-dc${c.i})`}>
                      <circle
                        cx={c.cx + shadowOff * c.dir}
                        cy={c.cy}
                        r={DISC_R}
                        fill="#0b1128"
                      />
                    </g>
                  </>
                )}
              </g>
            );
          })}
        </g>

        {/* Title block */}
        <g className="cz-lc-title">
          <rect x="82" y="394.4" width="16" height="0.8" fill="#7d89ad" opacity="0.7" />
          <rect x="202" y="394.4" width="16" height="0.8" fill="#7d89ad" opacity="0.7" />
          <text
            x="150"
            y="399"
            textAnchor="middle"
            fontFamily={SERIF}
            fontSize="12"
            letterSpacing="5"
            fill="#c3cbde"
          >
            THE HERMIT
          </text>
          <text
            x="150"
            y="414"
            textAnchor="middle"
            fontFamily={SERIF}
            fontStyle="italic"
            fontSize="8"
            letterSpacing="2"
            fill="#8f9cc2"
          >
            plenilunium · luna plena
          </text>
        </g>

        {/* Thin silver frame with crescent corners */}
        <g className="cz-lc-frame">
          <rect
            x="8"
            y="8"
            width="284"
            height="434"
            rx="7"
            fill="none"
            stroke="#c6cede"
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
            stroke="#b6c0d8"
            strokeOpacity="0.2"
            strokeWidth="0.6"
          />
          <use href="#cz-lc-crescent" transform="translate(26 26) rotate(45)" fill="#c0c8dc" opacity="0.55" />
          <use href="#cz-lc-crescent" transform="translate(274 26) rotate(135)" fill="#c0c8dc" opacity="0.55" />
          <use href="#cz-lc-crescent" transform="translate(274 424) rotate(225)" fill="#c0c8dc" opacity="0.55" />
          <use href="#cz-lc-crescent" transform="translate(26 424) rotate(315)" fill="#c0c8dc" opacity="0.55" />
        </g>
        <rect x="0" y="0" width="300" height="450" fill="url(#cz-lc-vig)" />
      </svg>
    </figure>
  );
}
