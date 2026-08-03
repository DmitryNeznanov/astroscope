/**
 * Card Lab — WOODCUT
 * German expressionist woodcut / linocut take on THE HERMIT (IX).
 * Pure black ink on raw cream paper: heavy carved black masses, the lantern
 * as the single carved-out white light source, aggressive hatch bundles and
 * gouge marks, crude angular anatomy, thick wobbling border.
 * Server-component safe: no hooks, no client code.
 */

const CREAM = "#f1e7d3";
const INK = "#161310";
const SERIF = "Georgia, 'Times New Roman', 'Liberation Serif', serif";

/** Bundle of short parallel hatch strokes — the woodcut shading unit. */
function hatchBundle(
  x: number,
  y: number,
  count: number,
  stepX: number,
  stepY: number,
  len: number,
  angleDeg: number,
  color: string,
  width: number,
) {
  const rad = (angleDeg * Math.PI) / 180;
  const dx = Math.cos(rad) * len;
  const dy = Math.sin(rad) * len;
  return Array.from({ length: count }, (_, i) => {
    const px = x + i * stepX;
    const py = y + i * stepY;
    // Slight per-stroke jitter so the bundle reads as hand-cut, not machined.
    const jx = ((i * 7) % 3) - 1;
    const jy = ((i * 5) % 3) - 1;
    return (
      <line
        key={`h-${x}-${y}-${i}`}
        x1={px + jx}
        y1={py + jy}
        x2={px + jx + dx}
        y2={py + jy + dy}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="butt"
      />
    );
  });
}

/** Jagged white gouge rays radiating from the lantern. */
function lanternRays(cx: number, cy: number) {
  const rays: Array<[number, number, number]> = [
    [-162, 34, 2.6],
    [-140, 42, 2.2],
    [-118, 48, 2.6],
    [-95, 52, 2.0],
    [-70, 46, 2.4],
    [-45, 38, 2.0],
    [30, 40, 2.4],
    [55, 46, 2.2],
    [80, 50, 2.6],
    [105, 44, 2.0],
    [130, 38, 2.4],
    [158, 30, 2.2],
  ];
  return rays.map(([deg, len, w], i) => {
    const rad = (deg * Math.PI) / 180;
    const kink = len * 0.55;
    const midX = cx + Math.cos(rad) * kink + (i % 2 === 0 ? 1.5 : -1.5);
    const midY = cy + Math.sin(rad) * kink + (i % 3 === 0 ? 1.5 : -1);
    return (
      <polyline
        key={`ray-${i}`}
        points={`${cx},${cy} ${midX},${midY} ${cx + Math.cos(rad) * len},${cy + Math.sin(rad) * len}`}
        fill="none"
        stroke={CREAM}
        strokeWidth={w}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
    );
  });
}

export default function WoodcutHermitCard() {
  return (
    <figure
      className="cl-wc-root"
      style={{
        aspectRatio: "2/3",
        width: "100%",
        margin: 0,
        background: CREAM,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        .cl-wc-press { width: 100%; height: 100%; }
        .cl-wc-print { display: block; width: 100%; height: 100%; transition: filter 0.12s steps(2, end); }
        .cl-wc-root:hover .cl-wc-print { filter: contrast(1.16); }
        @media (prefers-reduced-motion: no-preference) {
          /* One-shot printing-press reveal: ink wipes in top-to-bottom in 8 chunky steps */
          .cl-wc-press { animation: cl-wc-press 1s steps(8, end) both; }
          @keyframes cl-wc-press {
            from { clip-path: inset(0 0 100% 0); }
            to { clip-path: inset(0 0 0 0); }
          }
          /* Lantern rays: aggressive stepped jitter, flame seen through gouges */
          .cl-wc-flame { animation: cl-wc-flicker 1.1s steps(3, end) infinite; transform-origin: center; }
          @keyframes cl-wc-flicker {
            0%, 100% { opacity: 1; }
            30% { opacity: 0.55; }
            55% { opacity: 0.92; }
            80% { opacity: 0.68; }
          }
          /* Hover: faint ink-jitter across the whole print */
          .cl-wc-root:hover .cl-wc-print { animation: cl-wc-jitter 0.45s steps(2, end) infinite; }
          @keyframes cl-wc-jitter {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(0.5px, -0.5px); }
            50% { transform: translate(-0.5px, 0.5px); }
            75% { transform: translate(0.5px, 0); }
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cl-wc-flame, .cl-wc-press, .cl-wc-root:hover .cl-wc-print { animation: none; }
        }
      `}</style>

      <div className="cl-wc-press">
      <svg className="cl-wc-print" viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="The Hermit tarot card in woodcut style">
        {/* Raw paper */}
        <rect x="0" y="0" width="200" height="300" fill={CREAM} />

        {/* Ink sky — one heavy black mass across the upper card */}
        <path d="M12,44 L188,42 L188,178 L12,176 Z" fill={INK} />

        {/* Gouged white streaks high in the sky (knife clearing the block) */}
        {hatchBundle(22, 58, 5, 14, -2, 9, -18, CREAM, 1.6)}
        {hatchBundle(148, 54, 4, 12, 3, 8, 14, CREAM, 1.5)}

        {/* Central crag — black pinnacle rising into the sky */}
        <path
          d="M74,252 L84,196 L90,182 L96,172 L104,172 L111,184 L118,198 L128,252 Z"
          fill={INK}
        />
        {/* White hatch carving the crag's faces */}
        {hatchBundle(88, 196, 5, 2, 11, 7, 100, CREAM, 1.3)}
        {hatchBundle(106, 192, 4, 2.5, 12, 6, 78, CREAM, 1.2)}

        {/* Flanking mountains on the cream lower field */}
        <path d="M12,252 L40,206 L58,228 L76,204 L92,252 Z" fill={INK} />
        <path d="M108,252 L126,210 L146,232 L164,202 L188,252 Z" fill={INK} />
        {hatchBundle(30, 224, 4, 8, 5, 8, -55, CREAM, 1.2)}
        {hatchBundle(132, 226, 4, 9, 4, 8, -120, CREAM, 1.2)}

        {/* Ground hatch — black strokes cut into cream below the peaks */}
        {hatchBundle(18, 258, 8, 9, 1, 6, 12, INK, 1.4)}
        {hatchBundle(120, 260, 7, 9, -1, 6, -10, INK, 1.4)}

        {/* ── THE HERMIT — crude angular black silhouette on the crag ── */}
        <g stroke={CREAM} strokeWidth="1" strokeLinejoin="miter">
          {/* Cloak: heavy trapezoid mass */}
          <path d="M93,140 L107,140 L111,158 L113,173 L87,173 L89,157 Z" fill={INK} />
          {/* Hood */}
          <path d="M92,141 L100,127 L108,141 L105,147 L95,147 Z" fill={INK} />
          {/* Raised right arm holding the lantern */}
          <path d="M106,143 L117,124 L121,127 L111,148 Z" fill={INK} />
          {/* Left arm dropping to the staff */}
          <path d="M94,144 L87,158 L90,161 L97,148 Z" fill={INK} />
        </g>

        {/* Face: single white gouge under the hood */}
        <path d="M97,139 L100,134 L103,139 L100,143 Z" fill={CREAM} />

        {/* Cloak shading — white hatch cuts on the black mass */}
        {hatchBundle(93, 152, 4, 4, 5, 5, 105, CREAM, 1)}
        {hatchBundle(101, 150, 3, 3.5, 6, 4, 75, CREAM, 0.9)}

        {/* Staff — wobbling vertical cut, left hand */}
        <path d="M84,132 L86,132 L87,196 L84,196 Z" fill={INK} />
        <line x1="85" y1="136" x2="85.6" y2="192" stroke={CREAM} strokeWidth="0.7" />
        {/* Staff base hatch */}
        {hatchBundle(78, 196, 4, 3, 2, 4, 30, INK, 1.1)}

        {/* ── THE LANTERN — the single carved-out light source ── */}
        <g className="cl-wc-flame">
          {lanternRays(121, 114)}
          {/* Radiant white core */}
          <path d="M121,104 L128,114 L121,124 L114,114 Z" fill={CREAM} />
        </g>
        {/* Lantern frame — black cage over the light */}
        <path
          d="M121,103 L129,114 L121,125 L113,114 Z M121,107 L125.5,114 L121,121 L116.5,114 Z"
          fill={INK}
          fillRule="evenodd"
        />
        <path d="M118,103 L121,99 L124,103 Z" fill={INK} />
        <line x1="121" y1="125" x2="121" y2="128" stroke={INK} strokeWidth="2" />
        {/* Star inside the lantern */}
        <path d="M121,110 L122.2,113 L125,113.4 L122.8,115.2 L123.4,118 L121,116.4 L118.6,118 L119.2,115.2 L117,113.4 L119.8,113 Z" fill={CREAM} />

        {/* Scattered knife nicks in the sky around the figure */}
        {hatchBundle(34, 120, 3, 11, 6, 5, -35, CREAM, 1.4)}
        {hatchBundle(150, 130, 3, 10, -5, 5, 40, CREAM, 1.4)}

        {/* ── Top cartouche: IX carved white-on-black ── */}
        <g transform="rotate(-1.2 100 27)">
          <path d="M73,15 L127,14 L128,40 L72,41 Z" fill={INK} />
          <text
            x="100"
            y="34"
            textAnchor="middle"
            fontFamily={SERIF}
            fontWeight="bold"
            fontSize="17"
            letterSpacing="3"
            fill={CREAM}
          >
            IX
          </text>
        </g>

        {/* ── Bottom title: crude hand-set wood type ── */}
        <text x="100" y="282" textAnchor="middle" fontFamily={SERIF} fill={INK} letterSpacing="2.5">
          <tspan fontSize="15" fontWeight="bold">T</tspan>
          <tspan fontSize="16" fontWeight="bold" dy="-0.6">H</tspan>
          <tspan fontSize="14.5" fontWeight="bold" dy="0.5">E</tspan>
          <tspan fontSize="15" dy="0">&#8194;</tspan>
          <tspan fontSize="16" fontWeight="bold" dy="-0.5">H</tspan>
          <tspan fontSize="14.5" fontWeight="bold" dy="0.4">E</tspan>
          <tspan fontSize="15.5" fontWeight="bold" dy="-0.3">R</tspan>
          <tspan fontSize="15" fontWeight="bold" dy="0.5">M</tspan>
          <tspan fontSize="16" fontWeight="bold" dy="-0.6">I</tspan>
          <tspan fontSize="15" fontWeight="bold" dy="0.4">T</tspan>
        </text>
        {/* Wood-type quoin marks flanking the title */}
        <rect x="30" y="274" width="4" height="4" fill={INK} transform="rotate(3 32 276)" />
        <rect x="166" y="273" width="4" height="4" fill={INK} transform="rotate(-4 168 275)" />

        {/* ── Thick wobbling carved border ── */}
        <path
          d="M9,11 L101,8.5 L191,10 L189.5,150 L191.5,290 L98,291.5 L10.5,289 L9,148 Z"
          fill="none"
          stroke={INK}
          strokeWidth="5.5"
          strokeLinejoin="miter"
        />
        <path
          d="M16,17 L100,15 L184,16.5 L183,150 L184.5,283 L99,284.5 L17,282.5 L15.5,146 Z"
          fill="none"
          stroke={INK}
          strokeWidth="1.4"
        />
      </svg>
      </div>
    </figure>
  );
}
