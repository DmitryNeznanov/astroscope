/**
 * Card Lab — WOODCUT
 * German expressionist woodcut / linocut Major Arcana deck.
 * Pure black ink on raw cream paper: heavy carved black masses, one carved-out
 * light source per scene, aggressive hatch bundles and gouge marks, crude
 * angular anatomy, thick wobbling border.
 * Server-component safe: no hooks, no client code.
 *
 * Reusable via optional props — with no props it renders THE HERMIT (IX),
 * variant 0, exactly the original gallery card. `number` selects a fully
 * different scene; unknown numbers fall back to the Hermit artwork.
 */

import { toRoman } from "@/lib/roman";

const SERIF = "Georgia, 'Times New Roman', 'Liberation Serif', serif";

/** Ink/paper schemes. Index 0 is the canonical black-on-cream print. */
const PALETTES = [
  { paper: "#f1e7d3", ink: "#161310" }, // 0 classic black ink on cream
  { paper: "#161310", ink: "#f1e7d3" }, // 1 inverse print — cream ink on black paper
  { paper: "#e9dab9", ink: "#3b2417" }, // 2 bistre brown on tan
  { paper: "#f2e4cd", ink: "#5a1810" }, // 3 oxblood red on cream
];

/** Default titles for the scenes this deck knows how to draw. */
const NAMES: Record<number, string> = {
  1: "THE MAGICIAN",
  3: "THE EMPRESS",
  7: "THE CHARIOT",
  9: "THE HERMIT",
  10: "WHEEL OF FORTUNE",
  13: "DEATH",
  17: "THE STAR",
  22: "THE FOOL",
};

/** Bundle of short parallel hatch strokes — the woodcut shading unit.
 *  Pass animIdx to make the bundle "alive": it wraps the strokes in a group
 *  whose flicker rhythm (duration/delay) is derived from the index, so every
 *  bundle shimmers on its own beat. */
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
  animIdx?: number,
) {
  const rad = (angleDeg * Math.PI) / 180;
  const dx = Math.cos(rad) * len;
  const dy = Math.sin(rad) * len;
  const lines = Array.from({ length: count }, (_, i) => {
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
  if (animIdx === undefined) return lines;
  // Each bundle gets its own rhythm: duration cycles 1.3s–2.65s, negative
  // delay staggers the phase so the bundles never pulse in sync.
  const dur = 1.3 + (animIdx % 4) * 0.45;
  const del = -((animIdx * 0.37) % 2.2);
  return (
    <g
      className="cl-wc-hatch"
      style={{ animationDuration: `${dur.toFixed(2)}s`, animationDelay: `${del.toFixed(2)}s` }}
    >
      {lines}
    </g>
  );
}

/** Jagged white gouge rays radiating from a light source, scaled to fit. */
function gougeRays(cx: number, cy: number, color: string, scale = 1) {
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
    const kink = len * 0.55 * scale;
    const midX = cx + Math.cos(rad) * kink + (i % 2 === 0 ? 1.5 : -1.5);
    const midY = cy + Math.sin(rad) * kink + (i % 3 === 0 ? 1.5 : -1);
    return (
      <polyline
        key={`ray-${i}`}
        points={`${cx},${cy} ${midX},${midY} ${cx + Math.cos(rad) * len * scale},${cy + Math.sin(rad) * len * scale}`}
        fill="none"
        stroke={color}
        strokeWidth={w}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
    );
  });
}

/** Regular star polygon path (4-point gouge star, 8-point great star, …). */
function starPath(cx: number, cy: number, r: number, points = 4, innerRatio = 0.34) {
  let d = "";
  for (let k = 0; k < points * 2; k++) {
    const ang = (Math.PI * k) / points - Math.PI / 2;
    const rad = k % 2 === 0 ? r : r * innerRatio;
    d += `${k === 0 ? "M" : "L"}${(cx + Math.cos(ang) * rad).toFixed(1)},${(cy + Math.sin(ang) * rad).toFixed(1)} `;
  }
  return d + "Z";
}

/** The scene's carved-out light source: flickering gouge rays + a bright core.
 *  Rays rotate slowly around (cx, cy) — inline origin overrides the CSS default. */
function glowSource(cx: number, cy: number, paper: string, scale: number, corePath: string) {
  return (
    <g className="cl-wc-flame">
      <g className="cl-wc-rays" style={{ transformOrigin: `${cx}px ${cy}px` }}>
        {gougeRays(cx, cy, paper, scale)}
      </g>
      <path d={corePath} fill={paper} />
    </g>
  );
}

/** Crude hand-set wood type title. "THE HERMIT" uses the canonical hand-tuned
 *  sorts so variant 0 is pixel-faithful; any other name is composed
 *  deterministically — every glyph gets a pseudo-random size/baseline wobble —
 *  and is squeezed to the measure with textLength so long names still fit. */
function woodTypeTitle(name: string, ink: string) {
  if (name === "THE HERMIT") {
    return (
      <text x="100" y="282" textAnchor="middle" fontFamily={SERIF} fill={ink} letterSpacing="2.5">
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
    );
  }
  return (
    <text
      x="100"
      y="282"
      textAnchor="middle"
      fontFamily={SERIF}
      fill={ink}
      letterSpacing="2.5"
      textLength="148"
      lengthAdjust="spacingAndGlyphs"
    >
      {name.split("").map((ch, i) => {
        const code = ch.charCodeAt(0);
        const size = 14.5 + ((code * 7 + i * 13) % 4) * 0.5;
        const dy = (((code * 5 + i * 11) % 3) - 1) * 0.5;
        return (
          <tspan key={`t-${i}`} fontSize={size} fontWeight="bold" dy={dy}>
            {ch === " " ? "\u2002" : ch}
          </tspan>
        );
      })}
    </text>
  );
}

type Scene = (INK: string, CREAM: string) => React.ReactNode;

/* ── IX — THE HERMIT (canonical scene, unchanged) ─────────────────────── */
const hermitArtwork: Scene = (INK, CREAM) => (
  <>
    {/* Ink sky — one heavy black mass across the upper card */}
    <path d="M12,44 L188,42 L188,178 L12,176 Z" fill={INK} />

    {/* Gouged white streaks high in the sky (knife clearing the block) */}
    {hatchBundle(22, 58, 5, 14, -2, 9, -18, CREAM, 1.6, 1)}
    {hatchBundle(148, 54, 4, 12, 3, 8, 14, CREAM, 1.5, 2)}

    {/* Central crag — black pinnacle rising into the sky */}
    <path
      d="M74,252 L84,196 L90,182 L96,172 L104,172 L111,184 L118,198 L128,252 Z"
      fill={INK}
    />
    {/* White hatch carving the crag's faces */}
    {hatchBundle(88, 196, 5, 2, 11, 7, 100, CREAM, 1.3, 3)}
    {hatchBundle(106, 192, 4, 2.5, 12, 6, 78, CREAM, 1.2, 4)}

    {/* Flanking mountains on the cream lower field */}
    <path d="M12,252 L40,206 L58,228 L76,204 L92,252 Z" fill={INK} />
    <path d="M108,252 L126,210 L146,232 L164,202 L188,252 Z" fill={INK} />
    {hatchBundle(30, 224, 4, 8, 5, 8, -55, CREAM, 1.2, 5)}
    {hatchBundle(132, 226, 4, 9, 4, 8, -120, CREAM, 1.2, 6)}

    {/* Ground hatch — black strokes cut into cream below the peaks */}
    {hatchBundle(18, 258, 8, 9, 1, 6, 12, INK, 1.4, 7)}
    {hatchBundle(120, 260, 7, 9, -1, 6, -10, INK, 1.4, 8)}

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
    {hatchBundle(93, 152, 4, 4, 5, 5, 105, CREAM, 1, 9)}
    {hatchBundle(101, 150, 3, 3.5, 6, 4, 75, CREAM, 0.9, 10)}

    {/* Staff — wobbling vertical cut, left hand */}
    <path d="M84,132 L86,132 L87,196 L84,196 Z" fill={INK} />
    <line x1="85" y1="136" x2="85.6" y2="192" stroke={CREAM} strokeWidth="0.7" />
    {/* Staff base hatch */}
    {hatchBundle(78, 196, 4, 3, 2, 4, 30, INK, 1.1, 11)}

    {/* ── THE LANTERN — the single carved-out light source ── */}
    {glowSource(121, 114, CREAM, 1, "M121,104 L128,114 L121,124 L114,114 Z")}
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
    {hatchBundle(34, 120, 3, 11, 6, 5, -35, CREAM, 1.4, 12)}
    {hatchBundle(150, 130, 3, 10, -5, 5, 40, CREAM, 1.4, 13)}
  </>
);

/* ── I — THE MAGICIAN: raised wand, lemniscate, table of four tools ───── */
const magicianArtwork: Scene = (INK, CREAM) => (
  <>
    <path d="M12,44 L188,42 L188,120 L12,118 Z" fill={INK} />
    {hatchBundle(24, 56, 4, 13, -2, 8, -16, CREAM, 1.5, 1)}
    {hatchBundle(148, 52, 4, 11, 3, 7, 15, CREAM, 1.4, 2)}

    {/* Lemniscate — two interlocked rings gouged above the head */}
    <circle cx="91" cy="64" r="6.5" fill="none" stroke={CREAM} strokeWidth="2" />
    <circle cx="109" cy="64" r="6.5" fill="none" stroke={CREAM} strokeWidth="2" />

    {/* Figure: hood, face gouge, robe mass */}
    <g stroke={CREAM} strokeWidth="1" strokeLinejoin="miter">
      <path d="M90,140 L100,124 L110,140 L106,146 L94,146 Z" fill={INK} />
      <path d="M88,146 L112,146 L118,190 L82,190 Z" fill={INK} />
      {/* Right arm thrust upward with the wand */}
      <path d="M110,148 L126,114 L130,117 L115,152 Z" fill={INK} />
      {/* Left arm pointing down to earth */}
      <path d="M90,148 L82,172 L86,175 L94,152 Z" fill={INK} />
    </g>
    <circle cx="100" cy="137" r="4.5" fill={CREAM} />
    {hatchBundle(92, 154, 4, 4, 6, 5, 100, CREAM, 1, 6)}

    {/* Wand — its tip is the card's light source */}
    <line x1="127" y1="116" x2="131" y2="98" stroke={INK} strokeWidth="2.5" />
    {glowSource(131, 95, CREAM, 0.45, "M131,88 L136,95 L131,102 L126,95 Z")}

    {/* Table — black block bearing the four suit tools in cream */}
    <path d="M44,196 L156,196 L158,212 L42,212 Z" fill={INK} />
    <rect x="52" y="212" width="6" height="14" fill={INK} />
    <rect x="142" y="212" width="6" height="14" fill={INK} />
    {/* Cup */}
    <path d="M56,199 L68,199 L65,205 L59,205 Z M61,205 L63,205 L63,209 L61,209 Z M58,209 L66,209 L66,211 L58,211 Z" fill={CREAM} />
    {/* Sword */}
    <path d="M87,199 L88.2,194.5 L89.4,199 L89.4,208 L87,208 Z M83.5,203 L92.9,203 L92.9,204.8 L83.5,204.8 Z" fill={CREAM} />
    {/* Pentacle */}
    <circle cx="113" cy="203" r="4.6" fill={CREAM} />
    <circle cx="113" cy="203" r="2" fill={INK} />
    {/* Wand */}
    <rect x="137" y="196" width="2.6" height="12" fill={CREAM} transform="rotate(10 138 202)" />

    {hatchBundle(30, 232, 8, 9, 1, 6, 14, INK, 1.4, 7)}
    {hatchBundle(118, 234, 7, 9, -1, 6, -12, INK, 1.4, 8)}
    {hatchBundle(56, 218, 3, 8, 3, 5, 40, INK, 1.2, 9)}
  </>
);

/* ── III — THE EMPRESS: star crown, Venus heart shield, wheat ─────────── */
const empressArtwork: Scene = (INK, CREAM) => (
  <>
    <path d="M12,44 L188,42 L188,140 L12,138 Z" fill={INK} />
    {hatchBundle(22, 56, 5, 12, 2, 8, -20, CREAM, 1.5, 1)}
    {hatchBundle(140, 54, 5, 11, -2, 8, 18, CREAM, 1.5, 2)}
    {hatchBundle(30, 96, 3, 10, 4, 6, -40, CREAM, 1.3, 3)}

    {/* Crown star — the card's light source */}
    {glowSource(100, 62, CREAM, 0.45, starPath(100, 62, 8, 4))}

    {/* Crown with two small star gouges */}
    <g stroke={CREAM} strokeWidth="1" strokeLinejoin="miter">
      <path d="M80,96 L80,80 L90,88 L100,76 L110,88 L120,80 L120,96 Z" fill={INK} />
    </g>
    <path d={starPath(88, 91, 2.6, 4)} fill={CREAM} />
    <path d={starPath(112, 91, 2.6, 4)} fill={CREAM} />

    {/* Seated figure — broad fertile mass */}
    <circle cx="100" cy="104" r="5.5" fill={CREAM} />
    <g stroke={CREAM} strokeWidth="1" strokeLinejoin="miter">
      <path d="M78,112 L122,112 L138,196 L62,196 Z" fill={INK} />
    </g>
    {hatchBundle(72, 126, 4, 3, 12, 6, 100, CREAM, 1.2, 4)}
    {hatchBundle(122, 126, 4, 3, 12, 6, 80, CREAM, 1.2, 5)}

    {/* Heart shield with the Venus glyph cut in ink */}
    <path
      d="M100,142 C93,133 82,138 85,148 C87,157 96,161 100,166 C104,161 113,157 115,148 C118,138 107,133 100,142 Z"
      fill={CREAM}
    />
    <circle cx="100" cy="149" r="3.4" fill="none" stroke={INK} strokeWidth="1.6" />
    <line x1="100" y1="152.4" x2="100" y2="159" stroke={INK} strokeWidth="1.6" />
    <line x1="96.5" y1="155.5" x2="103.5" y2="155.5" stroke={INK} strokeWidth="1.6" />

    {/* Wheat — stalks with grain nicks below the figure */}
    {[34, 48, 62, 138, 152, 166].map((x) => (
      <line key={`stalk-${x}`} x1={x} y1="252" x2={x + 4} y2="222" stroke={INK} strokeWidth="1.5" />
    ))}
    {hatchBundle(28, 222, 6, 9, 0, 4, -60, INK, 1.3, 6)}
    {hatchBundle(132, 222, 6, 9, 0, 4, -120, INK, 1.3, 7)}
    {hatchBundle(84, 232, 6, 8, 1, 5, 20, INK, 1.3, 8)}
  </>
);

/* ── VII — THE CHARIOT: starred canopy, box chariot, two sphinxes ─────── */
const chariotArtwork: Scene = (INK, CREAM) => (
  <>
    <path d="M12,44 L188,42 L188,130 L12,128 Z" fill={INK} />
    {hatchBundle(24, 54, 4, 12, 2, 7, -18, CREAM, 1.4, 1)}

    {/* City wall behind — merlons and a solid band */}
    {Array.from({ length: 9 }, (_, i) => (
      <rect key={`merlon-${i}`} x={18 + i * 19} y="128" width="9" height="9" fill={INK} />
    ))}
    <rect x="12" y="137" width="176" height="16" fill={INK} />
    {hatchBundle(20, 142, 6, 26, 0, 7, 90, CREAM, 1.2, 2)}

    {/* Canopy posts */}
    <line x1="58" y1="92" x2="58" y2="140" stroke={INK} strokeWidth="2.5" />
    <line x1="142" y1="92" x2="142" y2="140" stroke={INK} strokeWidth="2.5" />

    {/* Starred canopy — its center star is the light source */}
    <path d="M48,78 Q100,56 152,78 L152,92 L48,92 Z" fill={INK} />
    <path d={starPath(66, 81, 3.4, 4)} fill={CREAM} />
    <path d={starPath(134, 81, 3.4, 4)} fill={CREAM} />
    {glowSource(100, 74, CREAM, 0.4, starPath(100, 74, 7, 4))}

    {/* Charioteer — torso and crowned head above the box */}
    <g stroke={CREAM} strokeWidth="1" strokeLinejoin="miter">
      <path d="M86,110 L114,110 L118,140 L82,140 Z" fill={INK} />
    </g>
    <circle cx="100" cy="102" r="5" fill={CREAM} />
    <path d="M92,98 L92,90 L97,94 L100,88 L103,94 L108,90 L108,98 Z" fill={INK} />
    {hatchBundle(90, 118, 3, 5, 6, 5, 100, CREAM, 1, 7)}

    {/* Chariot box — heavy black block */}
    <path d="M54,140 L146,140 L150,182 L50,182 Z" fill={INK} />
    <line x1="54" y1="148" x2="146" y2="148" stroke={CREAM} strokeWidth="1.2" />
    {hatchBundle(62, 156, 6, 8, 1, 9, 90, CREAM, 1.3, 3)}
    {hatchBundle(112, 156, 5, 8, -1, 9, 90, CREAM, 1.3, 4)}

    {/* Two sphinxes — one black, one carved white */}
    <g stroke={CREAM} strokeWidth="1" strokeLinejoin="miter">
      <path d="M40,228 L94,228 L94,214 L80,200 L64,198 L52,208 L40,220 Z" fill={INK} />
      <path d="M58,200 L62,190 L72,192 L70,202 Z" fill={INK} />
    </g>
    <g stroke={INK} strokeWidth="1.5" strokeLinejoin="miter">
      <path d="M160,228 L106,228 L106,214 L120,200 L136,198 L148,208 L160,220 Z" fill={CREAM} />
      <path d="M142,200 L138,190 L128,192 L130,202 Z" fill={CREAM} />
    </g>

    {hatchBundle(24, 238, 7, 9, 1, 6, 12, INK, 1.4, 5)}
    {hatchBundle(118, 240, 7, 9, -1, 6, -12, INK, 1.4, 6)}
  </>
);

/* ── X — WHEEL OF FORTUNE: spoked wheel, sphinx, snake and creature ───── */
const wheelArtwork: Scene = (INK, CREAM) => (
  <>
    <path d="M12,44 L188,42 L188,82 L12,80 Z" fill={INK} />
    <path d="M12,218 L188,216 L188,252 L12,252 Z" fill={INK} />
    {hatchBundle(24, 56, 5, 13, 0, 8, -14, CREAM, 1.5, 1)}
    {hatchBundle(30, 232, 6, 12, 2, 7, 60, CREAM, 1.4, 2)}

    {/* The wheel — outer and inner rings with eight spokes */}
    <circle cx="100" cy="150" r="60" fill="none" stroke={INK} strokeWidth="9" />
    <circle cx="100" cy="150" r="47" fill="none" stroke={INK} strokeWidth="2.5" />
    {Array.from({ length: 8 }, (_, i) => {
      const a = (Math.PI * i) / 4;
      return (
        <line
          key={`spoke-${i}`}
          x1={100 + Math.cos(a) * 12}
          y1={150 + Math.sin(a) * 12}
          x2={100 + Math.cos(a) * 47}
          y2={150 + Math.sin(a) * 47}
          stroke={INK}
          strokeWidth="4"
        />
      );
    })}

    {/* Rim glyphs at the four diagonals */}
    {[[55, 105], [145, 105], [55, 195], [145, 195]].map(([x, y]) => (
      <polyline
        key={`glyph-${x}`}
        points={`${x - 4},${y} ${x},${y - 4} ${x + 4},${y} ${x},${y + 4}`}
        fill="none"
        stroke={INK}
        strokeWidth="1.8"
      />
    ))}

    {/* Hub — black medallion carrying the wheel's light source */}
    <circle cx="100" cy="150" r="24" fill={INK} />
    {glowSource(100, 150, CREAM, 0.45, starPath(100, 150, 9, 8))}

    {/* Sphinx squatting on the wheel's crown */}
    <g stroke={CREAM} strokeWidth="1" strokeLinejoin="miter">
      <path d="M84,86 L116,86 L112,73 L96,71 L86,77 Z" fill={INK} />
      <path d="M100,71 L104,61 L112,63 L110,73 Z" fill={INK} />
    </g>

    {/* Snake descending on the left */}
    <polyline
      points="36,96 30,118 38,140 29,162 36,184 30,206"
      fill="none"
      stroke={INK}
      strokeWidth="5"
      strokeLinecap="butt"
    />
    <path d="M36,96 L31,87 L41,87 Z" fill={INK} />
    <circle cx="35" cy="91" r="1.2" fill={CREAM} />

    {/* Jackal-headed creature rising on the right */}
    <path d="M160,206 L178,206 L172,156 L164,156 Z" fill={INK} />
    <path d="M162,156 L176,156 L178,140 L171,146 L168,134 L163,146 Z" fill={INK} />
    {hatchBundle(163, 170, 3, 3, 8, 5, 100, CREAM, 1, 3)}

    {hatchBundle(60, 228, 3, 8, 4, 5, -30, CREAM, 1.3, 4)}
  </>
);

/* ── XIII — DEATH: skeletal rider, rose banner, sun between towers ────── */
const deathArtwork: Scene = (INK, CREAM) => (
  <>
    <path d="M12,44 L188,42 L188,150 L12,148 Z" fill={INK} />
    {hatchBundle(22, 58, 4, 13, -2, 8, -16, CREAM, 1.5, 1)}

    {/* Sun rising on the horizon between the towers */}
    <path d="M80,150 A20,20 0 0,1 120,150 Z" fill={CREAM} />
    {hatchBundle(86, 130, 5, 7, -2.5, 7, -78, CREAM, 1.6, 2)}

    {/* Two towers flanking the sun */}
    <rect x="36" y="116" width="13" height="34" fill={INK} />
    <rect x="36" y="110" width="5" height="6" fill={INK} />
    <rect x="44" y="110" width="5" height="6" fill={INK} />
    <rect x="151" y="116" width="13" height="34" fill={INK} />
    <rect x="151" y="110" width="5" height="6" fill={INK} />
    <rect x="159" y="110" width="5" height="6" fill={INK} />

    {/* Horse — angular black mass facing left */}
    <path d="M68,166 L128,164 L136,188 L124,196 L120,180 L90,182 L86,198 L72,194 Z" fill={INK} />
    <path d="M68,166 L54,142 L44,148 L60,174 Z" fill={INK} />
    <path d="M54,142 L52,134 L58,138 Z" fill={INK} />
    <circle cx="52" cy="150" r="1.2" fill={CREAM} />
    <path d="M136,170 L148,182 L144,196 L134,182 Z" fill={INK} />
    <rect x="78" y="194" width="5" height="34" fill={INK} />
    <rect x="96" y="196" width="5" height="32" fill={INK} />
    <rect x="114" y="194" width="5" height="34" fill={INK} />
    <rect x="128" y="190" width="5" height="36" fill={INK} />
    {hatchBundle(80, 172, 5, 8, 2, 6, 100, CREAM, 1.2, 3)}

    {/* Skeletal rider — skull, spine and rib gouges */}
    <g stroke={CREAM} strokeWidth="1" strokeLinejoin="miter">
      <path d="M98,130 L116,132 L122,166 L94,164 Z" fill={INK} />
      <path d="M114,136 L132,122 L135,126 L118,142 Z" fill={INK} />
    </g>
    <circle cx="106" cy="122" r="6" fill={CREAM} />
    <circle cx="103" cy="121" r="1.3" fill={INK} />
    <circle cx="109" cy="121" r="1.3" fill={INK} />
    <line x1="106" y1="128" x2="106" y2="148" stroke={CREAM} strokeWidth="1.5" />
    {hatchBundle(100, 134, 3, 1, 5, 8, 0, CREAM, 1, 4)}

    {/* Banner pole and black flag — the white rose is the light source */}
    <line x1="134" y1="90" x2="134" y2="166" stroke={INK} strokeWidth="2.5" />
    <g stroke={CREAM} strokeWidth="1" strokeLinejoin="miter">
      <path d="M134,92 L170,97 L168,123 L134,118 Z" fill={INK} />
    </g>
    {glowSource(
      152, 107, CREAM, 0.35,
      `${starPath(152, 107, 3, 8, 0.55)} ${[0, 1, 2, 3, 4]
        .map((k) => {
          const a = (Math.PI * 2 * k) / 5 - Math.PI / 2;
          return starPath(152 + Math.cos(a) * 5, 107 + Math.sin(a) * 5, 1.8, 4, 0.5);
        })
        .join(" ")}`,
    )}

    {/* Ground — hatch and a fallen crown */}
    {hatchBundle(24, 234, 8, 9, 1, 6, 14, INK, 1.4, 5)}
    {hatchBundle(118, 236, 7, 9, -1, 6, -12, INK, 1.4, 6)}
    <path d="M50,247 L50,239 L56,243 L61,237 L66,243 L72,239 L72,247 Z" fill={INK} />
  </>
);

/* ── XVII — THE STAR: kneeling figure, two jugs, eight stars ──────────── */
const starArtwork: Scene = (INK, CREAM) => (
  <>
    <path d="M12,44 L188,42 L188,162 L12,160 Z" fill={INK} />

    {/* The great eight-pointed star — the card's light source */}
    {glowSource(100, 86, CREAM, 0.55, starPath(100, 86, 14, 8))}

    {/* Seven small companion stars */}
    {[[36, 60], [64, 52], [138, 52], [166, 64], [44, 112], [154, 116], [122, 140]].map(([x, y]) => (
      <path key={`star-${x}-${y}`} d={starPath(x, y, 4, 4)} fill={CREAM} />
    ))}
    {hatchBundle(24, 130, 3, 10, 5, 5, -30, CREAM, 1.3, 1)}

    {/* Kneeling figure — one knee on land, one leg toward the pool */}
    <g stroke={CREAM} strokeWidth="1" strokeLinejoin="miter">
      <path d="M88,152 L102,152 L105,178 L86,178 Z" fill={INK} />
      <path d="M86,178 L76,198 L90,200 L97,181 Z" fill={INK} />
      <path d="M101,178 L124,192 L121,198 L99,186 Z" fill={INK} />
      {/* Arms bearing the jugs */}
      <path d="M88,156 L72,170 L75,174 L91,162 Z" fill={INK} />
      <path d="M102,156 L118,168 L115,173 L99,162 Z" fill={INK} />
    </g>
    <circle cx="95" cy="146" r="4.5" fill={CREAM} />

    {/* Two jugs with cream pour streams — one to land, one to the pool */}
    <path d="M66,176 L76,176 L74,186 L68,186 Z" fill={INK} />
    <polyline points="71,186 68,196 72,206 69,214" fill="none" stroke={CREAM} strokeWidth="2" strokeLinecap="butt" />
    <path d="M114,174 L124,174 L122,184 L116,184 Z" fill={INK} />
    <polyline points="119,184 124,194 121,204 126,212" fill="none" stroke={CREAM} strokeWidth="2" strokeLinecap="butt" />

    {/* Land mass and pool, split by a cream shore */}
    <path d="M12,214 L104,208 L108,252 L12,252 Z" fill={INK} />
    <path d="M124,210 L188,206 L188,252 L120,252 Z" fill={INK} />
    {hatchBundle(22, 224, 5, 8, 4, 6, 55, CREAM, 1.2, 2)}
    {hatchBundle(130, 220, 4, 12, 5, 9, 8, CREAM, 1.3, 3)}
    {hatchBundle(132, 238, 4, 12, 3, 9, -6, CREAM, 1.3, 4)}
  </>
);

/* ── XXII — THE FOOL: profile figure stepping off a cliff, dog, sun ───── */
const foolArtwork: Scene = (INK, CREAM) => (
  <>
    <path d="M12,44 L188,42 L188,140 L12,138 Z" fill={INK} />
    {hatchBundle(20, 58, 4, 12, 2, 7, -18, CREAM, 1.4, 1)}

    {/* Sun — the card's light source, high right */}
    {glowSource(148, 74, CREAM, 0.55, starPath(148, 74, 12, 16, 0.82))}

    {/* Cliff — black mass ending in a sheer edge */}
    <path d="M12,252 L12,192 L64,178 L96,188 L94,252 Z" fill={INK} />
    {hatchBundle(22, 200, 5, 4, 10, 6, 100, CREAM, 1.3, 2)}
    {hatchBundle(56, 196, 4, 5, 11, 6, 78, CREAM, 1.2, 3)}

    {/* The Fool — profile, head tilted skyward, one foot over the edge */}
    <g stroke={CREAM} strokeWidth="1" strokeLinejoin="miter">
      <path d="M72,126 L84,126 L87,162 L70,162 Z" fill={INK} />
      {/* Head tilted up, nose pointing at the sky */}
      <path d="M74,126 L70,114 L78,107 L87,112 L85,126 Z" fill={INK} />
      <path d="M87,112 L91,114 L86,117 Z" fill={INK} />
      {/* Arm reaching back to the bundle stick */}
      <path d="M72,130 L62,118 L65,114 L76,126 Z" fill={INK} />
      {/* Stepping leg swinging over the drop */}
      <path d="M82,162 L97,168 L95,175 L80,169 Z" fill={INK} />
    </g>
    <rect x="76" y="162" width="5" height="14" fill={INK} />
    {hatchBundle(74, 134, 3, 3, 7, 4, 100, CREAM, 0.9, 7)}

    {/* Bundle on a stick over the shoulder */}
    <line x1="66" y1="120" x2="56" y2="104" stroke={INK} strokeWidth="2" />
    <circle cx="54" cy="101" r="5.5" fill={INK} />
    <line x1="50" y1="98" x2="58" y2="104" stroke={CREAM} strokeWidth="0.8" />
    <line x1="50" y1="104" x2="58" y2="98" stroke={CREAM} strokeWidth="0.8" />

    {/* Small dog leaping at his heels */}
    <g stroke={CREAM} strokeWidth="0.8" strokeLinejoin="miter">
      <path d="M50,166 L62,166 L60,175 L52,175 Z" fill={INK} />
      <path d="M60,162 L67,159 L67,166 Z" fill={INK} />
      <path d="M50,166 L46,160 L48,159 L52,165 Z" fill={INK} />
    </g>
    <rect x="52" y="175" width="2.5" height="5" fill={INK} />
    <rect x="58" y="175" width="2.5" height="5" fill={INK} />

    {/* The abyss — falling hatch and two distant peaks */}
    {hatchBundle(112, 190, 5, 6, 9, 5, 75, INK, 1.2, 4)}
    {hatchBundle(140, 186, 4, 7, 10, 5, 105, INK, 1.2, 5)}
    <path d="M120,244 L136,220 L152,244 Z" fill={INK} />
    <path d="M150,248 L164,228 L178,248 Z" fill={INK} />
    {hatchBundle(104, 244, 5, 8, 1, 5, 20, INK, 1.3, 6)}
  </>
);

const ARTWORK: Record<number, Scene> = {
  1: magicianArtwork,
  3: empressArtwork,
  7: chariotArtwork,
  9: hermitArtwork,
  10: wheelArtwork,
  13: deathArtwork,
  17: starArtwork,
  22: foolArtwork,
};

export interface WoodcutCardProps {
  /** Major Arcana number; selects the scene. Unknown numbers draw the Hermit. */
  number?: number;
  /** Card name set in crude wood type along the bottom. */
  name?: string;
  /** 0-7: low 2 bits pick the ink/paper scheme, bit 3 mirrors the block. */
  variant?: number;
}

export default function WoodcutHermitCard({
  number = 9,
  name,
  variant = 0,
}: WoodcutCardProps) {
  const { paper: CREAM, ink: INK } = PALETTES[variant % PALETTES.length];
  const mirror = variant >= 4;
  const roman = toRoman(number);
  const title = name ?? NAMES[number] ?? "THE HERMIT";
  const artwork = (ARTWORK[number] ?? hermitArtwork)(INK, CREAM);
  // Cartouche widens only when the numeral outgrows the canonical block.
  const wide = roman.length > 2;
  const cw = 30 + roman.length * 12;
  const cartouchePath = wide
    ? `M${100 - cw / 2},15 L${100 + cw / 2},14 L${100 + cw / 2 + 1},40 L${100 - cw / 2 - 1},41 Z`
    : "M73,15 L127,14 L128,40 L72,41 Z";

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
        .cl-wc-repress, .cl-wc-press { width: 100%; height: 100%; }
        .cl-wc-print { display: block; width: 100%; height: 100%; transition: filter 0.12s steps(2, end); }
        .cl-wc-root:hover .cl-wc-print { filter: contrast(1.16); }
        @media (prefers-reduced-motion: no-preference) {
          /* One-shot printing-press reveal: ink wipes in top-to-bottom in 8 chunky steps */
          .cl-wc-press { animation: cl-wc-press 1s steps(8, end) both; }
          @keyframes cl-wc-press {
            from { clip-path: inset(0 0 100% 0); }
            to { clip-path: inset(0 0 0 0); }
          }
          /* Re-press: every 10s the block is stamped again — hard 2-step vertical shudder */
          .cl-wc-repress { animation: cl-wc-repress 10s steps(1, end) infinite; }
          @keyframes cl-wc-repress {
            0%, 91.9% { clip-path: inset(0 0 0 0); }
            92%, 93.9% { clip-path: inset(0 0 5% 0); }
            94%, 95.9% { clip-path: inset(5% 0 0 0); }
            96%, 100% { clip-path: inset(0 0 0 0); }
          }
          /* Living hatch work: hard opacity steps, per-bundle rhythm set inline */
          .cl-wc-hatch { animation-name: cl-wc-hatch-flick; animation-iteration-count: infinite; animation-timing-function: steps(2, end); }
          @keyframes cl-wc-hatch-flick {
            0%, 100% { opacity: 1; }
            38% { opacity: 0.45; }
            64% { opacity: 0.85; }
            82% { opacity: 0.6; }
          }
          /* Light source: aggressive stepped jitter, flame seen through gouges */
          .cl-wc-flame { animation: cl-wc-flicker 1.1s steps(3, end) infinite; transform-origin: center; }
          @keyframes cl-wc-flicker {
            0%, 100% { opacity: 1; }
            30% { opacity: 0.55; }
            55% { opacity: 0.92; }
            80% { opacity: 0.68; }
          }
          /* Rays also rotate very slowly in hard 30° jumps around the source */
          .cl-wc-rays { transform-origin: 121px 114px; animation: cl-wc-rays-turn 18s steps(12, end) infinite; }
          @keyframes cl-wc-rays-turn {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
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
          .cl-wc-flame, .cl-wc-rays, .cl-wc-hatch, .cl-wc-press, .cl-wc-repress,
          .cl-wc-root:hover .cl-wc-print { animation: none; }
        }
      `}</style>

      <div className="cl-wc-repress">
      <div className="cl-wc-press">
      <svg className="cl-wc-print" viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${title} tarot card in woodcut style`}>
        {/* Raw paper */}
        <rect x="0" y="0" width="200" height="300" fill={CREAM} />

        {/* Artwork block — mirrored for variants 4-7 (text stays unmirrored) */}
        <g transform={mirror ? "translate(200 0) scale(-1 1)" : undefined}>
        {artwork}
        </g>

        {/* ── Top cartouche: numeral carved white-on-black ── */}
        <g transform="rotate(-1.2 100 27)">
          <path d={cartouchePath} fill={INK} />
          <text
            x="100"
            y="34"
            textAnchor="middle"
            fontFamily={SERIF}
            fontWeight="bold"
            fontSize={wide ? 15 : 17}
            letterSpacing={wide ? 2 : 3}
            fill={CREAM}
          >
            {roman}
          </text>
        </g>

        {/* ── Bottom title: crude hand-set wood type ── */}
        {woodTypeTitle(title, INK)}
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
      </div>
    </figure>
  );
}
