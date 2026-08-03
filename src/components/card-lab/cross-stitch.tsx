/**
 * Card Lab — CROSS-STITCH
 * Embroidered cross-stitch sampler take on THE HERMIT (IX), stitched on cream
 * Aida cloth. The whole card is a 28x42 logical grid: every motif is rendered
 * as X-shaped stitches (two diagonal strokes per cell), grouped by floss color
 * into single SVG paths. Classic sampler chrome: red/gold checker border with
 * green corner blocks, a gold "IX" stitched top-center, and "THE / HERMIT" in
 * a 3x5 cross-stitch alphabet on bare cloth below the scene. The lantern has
 * a white star inside and glow stitches that twinkle with a soft irregular
 * blink. Signature effects (CSS-only): on mount the border is "stitched" with
 * a quick stepped clip-path wipe, then the scene is stitched row by row over
 * ~2.8s in steps(20); the sky stars twinkle individually on staggered delays
 * like a starfield; the border checker's red and gold floss slowly trade
 * places (steps swap on the paths, independent of the wipe on the group);
 * on hover the fabric warms as if held up to the light and the lantern
 * twinkle speeds up. Reduced motion = fully stitched, fully static.
 * Server-component safe: no hooks, no client code.
 */

/* Logical stitch grid: 28 wide x 42 tall, one cell per cross-stitch. */
const GW = 28;
const GH = 42;
const CS = 10; // cell size in viewBox units

/** DMC-style floss palette. */
const FLOSS = {
  sky: "#25315e", // navy night sky
  red: "#a62c3a", // deep red robe / border
  darkRed: "#7d1f2e", // hood + robe shading
  gold: "#d9a441", // lantern, IX, border
  glow: "#eed9a0", // pale gold lantern glow
  green: "#4a7a3d", // forest green hill / border corners
  darkGreen: "#33582b", // hill crest outline
  face: "#e0b989", // tan face
  beard: "#ead9b8", // ecru beard
  white: "#faf7ec", // stars + lantern light
  brown: "#6f4a26", // wooden staff
} as const;

type CellMap = Map<string, string>;

/** 3x5 cross-stitch alphabet for the nameplate. */
const FONT3: Record<string, readonly string[]> = {
  T: ["###", ".#.", ".#.", ".#.", ".#."],
  H: ["#.#", "#.#", "###", "#.#", "#.#"],
  E: ["###", "#..", "##.", "#..", "###"],
  R: ["##.", "#.#", "##.", "#.#", "#.#"],
  M: ["#.#", "###", "#.#", "#.#", "#.#"],
  I: ["###", ".#.", ".#.", ".#.", "###"],
};

/** 5x7 capitals for the roman numeral. */
const FONT5: Record<string, readonly string[]> = {
  I: ["###", ".#.", ".#.", ".#.", ".#.", ".#.", "###"],
  X: ["#...#", ".#.#.", "..#..", "..#..", "..#..", ".#.#.", "#...#"],
};

/**
 * The hermit as a 9x13 stitch bitmap, drawn at grid offset (10, 9).
 * H hood, F face, E eye, B beard, R robe, D robe shadow.
 */
const HERMIT: readonly string[] = [
  "...HHH...",
  "..HHHHH..",
  "..HFFFH..",
  "..HFEFH..",
  "...BBB...",
  "..RRRRR..",
  ".RRRRRRR.",
  ".RRRRRRR.",
  "DRRRRRRRD",
  "DRRRRRRRD",
  "DRRRRRRRD",
  ".RRRRRRR.",
  "..RR.RR..",
];

const HERMIT_COLORS: Record<string, string> = {
  H: FLOSS.darkRed,
  F: FLOSS.face,
  E: FLOSS.sky,
  B: FLOSS.beard,
  R: FLOSS.red,
  D: FLOSS.darkRed,
};

/** White star stitches scattered across the night sky. */
const STARS: readonly (readonly [number, number])[] = [
  [4, 4], [3, 4], [5, 4], [4, 3], [4, 5], // bright north star (plus shape)
  [7, 6], [22, 3], [24, 7], [3, 10],
  [24, 13], [4, 16], [23, 17], [6, 20], [21, 20], [20, 16],
];

/** Cell keys of the sky stars, so each can twinkle on its own delay. */
const STAR_KEYS = new Set(STARS.map(([x, y]) => `${x},${y}`));

/** Where the green hill crest starts for each column (scene rows 2..27). */
function hillTop(x: number): number {
  return Math.min(27, 21 + Math.round(Math.abs(x - 14) * 0.55));
}

function drawText(
  set: (x: number, y: number, c: string) => void,
  text: string,
  font: Record<string, readonly string[]>,
  x0: number,
  y0: number,
  color: string,
  gap: number,
): void {
  let cx = x0;
  for (const ch of text) {
    const glyph = font[ch];
    if (!glyph) {
      cx += gap + 1;
      continue;
    }
    glyph.forEach((row, dy) => {
      for (let dx = 0; dx < row.length; dx++) {
        if (row[dx] === "#") set(cx + dx, y0 + dy, color);
      }
    });
    cx += glyph[0].length + gap;
  }
}

/** Compose the full 28x42 stitch map: cell key "x,y" -> floss color.
 *  Border stitches are kept in their own map so the border can be revealed
 *  with its own (quicker) stitching wipe before the scene is stitched. */
function buildStitches(): { border: CellMap; scene: CellMap } {
  const border: CellMap = new Map();
  const cells: CellMap = new Map();
  const set = (x: number, y: number, color: string) => {
    if (x < 0 || x >= GW || y < 0 || y >= GH) return;
    cells.set(`${x},${y}`, color);
  };
  const setBorder = (x: number, y: number, color: string) => {
    if (x < 0 || x >= GW || y < 0 || y >= GH) return;
    border.set(`${x},${y}`, color);
  };

  // 1) Sampler border: red/gold checker, forest-green corner blocks.
  for (let y = 0; y < GH; y++) {
    for (let x = 0; x < GW; x++) {
      const onBorder = x < 2 || x >= GW - 2 || y < 2 || y >= GH - 2;
      if (!onBorder) continue;
      const corner = (x < 2 || x >= GW - 2) && (y < 2 || y >= GH - 2);
      setBorder(x, y, corner ? FLOSS.green : (x + y) % 2 ? FLOSS.red : FLOSS.gold);
    }
  }

  // 2) Scene fill: navy sky above, green hill below the crest (rows 2..27).
  for (let x = 2; x < GW - 2; x++) {
    const top = hillTop(x);
    for (let y = 2; y <= 27; y++) {
      if (y >= top) set(x, y, y === top ? FLOSS.darkGreen : FLOSS.green);
      else set(x, y, FLOSS.sky);
    }
  }

  // 3) Star stitches.
  for (const [sx, sy] of STARS) set(sx, sy, FLOSS.white);

  // 4) "IX" in gold, top center (3 + 2 gap + 5 = 10 cells wide).
  drawText(set, "IX", FONT5, 9, 2, FLOSS.gold, 2);

  // 5) Staff (left hand side), gold knob on top.
  set(8, 9, FLOSS.gold);
  for (let y = 10; y <= 23; y++) set(8, y, FLOSS.brown);
  set(9, 15, FLOSS.red); // arm reaching the staff
  set(10, 15, FLOSS.red);

  // 6) Raised right arm + lantern with a white star light inside.
  set(17, 13, FLOSS.red);
  set(18, 12, FLOSS.red);
  set(19, 11, FLOSS.red);
  set(20, 8, FLOSS.gold); // hanger
  set(19, 9, FLOSS.gold);
  set(20, 9, FLOSS.white);
  set(21, 9, FLOSS.gold);
  set(19, 10, FLOSS.gold);
  set(20, 10, FLOSS.white);
  set(21, 10, FLOSS.gold);
  set(20, 11, FLOSS.gold); // base
  // Pale-gold glow stitches around the lantern (these twinkle).
  set(22, 9, FLOSS.glow);
  set(22, 10, FLOSS.glow);
  set(21, 12, FLOSS.glow);

  // 7) The hermit himself.
  HERMIT.forEach((row, dy) => {
    for (let dx = 0; dx < row.length; dx++) {
      const color = HERMIT_COLORS[row[dx]];
      if (color) set(10 + dx, 9 + dy, color);
    }
  });

  // 8) Nameplate on bare cloth: "THE" / "HERMIT" in deep red floss.
  drawText(set, "THE", FONT3, 8, 29, FLOSS.red, 1); // 11 wide, centered
  drawText(set, "HERMIT", FONT3, 2, 35, FLOSS.red, 1); // 23 wide, centered

  return { border, scene: cells };
}

/** Group stitches by floss color into one SVG path per color — except the
 *  lantern-glow stitches and the sky-star stitches, which each get their own
 *  path so they can twinkle on staggered delays (glowIndex / starIndex =
 *  delay slot). */
type StitchPath = { color: string; d: string; glowIndex?: number; starIndex?: number };

function groupPaths(cells: CellMap): StitchPath[] {
  const groups = new Map<string, string[]>();
  const glowSegs: string[] = [];
  const starSegs: string[] = [];
  for (const [key, color] of cells) {
    const [x, y] = key.split(",").map(Number);
    const x0 = x * CS + 1.3;
    const y0 = y * CS + 1.3;
    const x1 = (x + 1) * CS - 1.3;
    const y1 = (y + 1) * CS - 1.3;
    // One cross-stitch: two short diagonal strokes per cell.
    const seg = `M${x0} ${y0}L${x1} ${y1}M${x1} ${y0}L${x0} ${y1}`;
    if (color === FLOSS.glow) {
      glowSegs.push(seg);
      continue;
    }
    if (STAR_KEYS.has(key)) {
      starSegs.push(seg);
      continue;
    }
    const arr = groups.get(color);
    if (arr) arr.push(seg);
    else groups.set(color, [seg]);
  }
  const out: StitchPath[] = Array.from(groups, ([color, segs]) => ({
    color,
    d: segs.join(""),
  }));
  glowSegs.forEach((d, i) => out.push({ color: FLOSS.glow, d, glowIndex: i }));
  starSegs.forEach((d, i) => out.push({ color: FLOSS.white, d, starIndex: i }));
  return out;
}

const STITCHES = buildStitches();
const BORDER_PATHS = groupPaths(STITCHES.border);
const SCENE_PATHS = groupPaths(STITCHES.scene);

export default function CrossStitchHermitCard() {
  return (
    <figure
      className="cl-cs-card"
      role="img"
      aria-label="Cross-stitch sampler of The Hermit tarot card, IX"
      style={{
        aspectRatio: "2/3",
        width: "100%",
        position: "relative",
        margin: 0,
        overflow: "hidden",
        boxSizing: "border-box",
        borderRadius: 10,
        border: "8px solid #503a22",
        boxShadow:
          "inset 0 0 0 2px #2f2114, 0 10px 24px rgba(20, 12, 4, 0.35)",
        background: "#f2e9d5",
      }}
    >
      <style>{`
        .cl-cs-card .cl-cs-aida {
          position: absolute;
          inset: 0;
          background-color: #f2e9d5;
          background-image:
            repeating-linear-gradient(0deg, rgba(133, 109, 66, 0.10) 0 1px, transparent 1px 4px),
            repeating-linear-gradient(90deg, rgba(133, 109, 66, 0.10) 0 1px, transparent 1px 4px),
            radial-gradient(ellipse at center, transparent 55%, rgba(101, 78, 42, 0.18) 100%);
          transition: filter 0.5s ease;
        }
        .cl-cs-card svg {
          transition: filter 0.5s ease;
        }
        /* Stitching reveal: border is stitched first (quick wipe), then the
           scene is stitched row by row, top to bottom, in stepped passes. */
        .cl-cs-card .cl-cs-border-wipe {
          animation: cl-cs-wipe 0.9s steps(6) both;
        }
        .cl-cs-card .cl-cs-scene-wipe {
          animation: cl-cs-wipe 2.8s steps(20) 0.7s both;
        }
        @keyframes cl-cs-wipe {
          from { clip-path: inset(0 0 100% 0); }
          to { clip-path: inset(0 0 0 0); }
        }
        /* Lantern glow: soft irregular blink, staggered per stitch. */
        .cl-cs-card .cl-cs-glow {
          animation: cl-cs-twinkle 2.6s ease-in-out infinite;
        }
        @keyframes cl-cs-twinkle {
          0%, 100% { opacity: 0.5; }
          17% { opacity: 0.95; }
          31% { opacity: 0.6; }
          54% { opacity: 1; }
          68% { opacity: 0.45; }
          84% { opacity: 0.8; }
        }
        /* Starfield: each star stitch blinks on its own delay/duration. */
        .cl-cs-card .cl-cs-star {
          animation: cl-cs-starblink 3s ease-in-out infinite;
        }
        @keyframes cl-cs-starblink {
          0%, 100% { opacity: 1; }
          6% { opacity: 0.25; }
          12% { opacity: 1; }
          61% { opacity: 1; }
          64% { opacity: 0.5; }
          67% { opacity: 1; }
        }
        /* Border checker: the two floss colors slowly trade places. The swap
           lives on the paths (stroke), the wipe on the parent <g> (clip-path),
           so the two never fight. */
        .cl-cs-card .cl-cs-swap-red {
          animation: cl-cs-swap-red 5s steps(1) 1.2s infinite;
        }
        .cl-cs-card .cl-cs-swap-gold {
          animation: cl-cs-swap-gold 5s steps(1) 1.2s infinite;
        }
        @keyframes cl-cs-swap-red {
          0%, 100% { stroke: #a62c3a; }
          50% { stroke: #d9a441; }
        }
        @keyframes cl-cs-swap-gold {
          0%, 100% { stroke: #d9a441; }
          50% { stroke: #a62c3a; }
        }
        /* Held up to the light: warm brightness shift, livelier lantern. */
        .cl-cs-card:hover .cl-cs-aida {
          filter: brightness(1.09) sepia(0.22) saturate(1.12);
        }
        .cl-cs-card:hover svg {
          filter: brightness(1.05);
        }
        .cl-cs-card:hover .cl-cs-glow {
          animation-duration: 0.9s;
        }
        @media (prefers-reduced-motion: reduce) {
          .cl-cs-card .cl-cs-border-wipe,
          .cl-cs-card .cl-cs-scene-wipe,
          .cl-cs-card .cl-cs-glow,
          .cl-cs-card .cl-cs-star,
          .cl-cs-card .cl-cs-swap-red,
          .cl-cs-card .cl-cs-swap-gold {
            animation: none;
          }
          .cl-cs-card .cl-cs-aida,
          .cl-cs-card svg {
            transition: none;
          }
        }
      `}</style>
      <div className="cl-cs-aida" />
      <svg
        viewBox={`0 0 ${GW * CS} ${GH * CS}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <g className="cl-cs-border-wipe">
          {BORDER_PATHS.map(({ color, d }) => (
            <path
              key={color}
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={2.3}
              strokeLinecap="round"
              className={
                color === FLOSS.red
                  ? "cl-cs-swap-red"
                  : color === FLOSS.gold
                    ? "cl-cs-swap-gold"
                    : undefined
              }
            />
          ))}
        </g>
        <g className="cl-cs-scene-wipe">
          {SCENE_PATHS.map(({ color, d, glowIndex, starIndex }) => (
            <path
              key={
                glowIndex !== undefined
                  ? `glow-${glowIndex}`
                  : starIndex !== undefined
                    ? `star-${starIndex}`
                    : color
              }
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={glowIndex !== undefined ? 3.2 : 2.3}
              strokeLinecap="round"
              className={
                glowIndex !== undefined
                  ? "cl-cs-glow"
                  : starIndex !== undefined
                    ? "cl-cs-star"
                    : undefined
              }
              style={
                glowIndex !== undefined
                  ? { animationDelay: `${glowIndex * 0.7}s` }
                  : starIndex !== undefined
                    ? {
                        animationDelay: `${((starIndex * 0.7) % 4.2).toFixed(2)}s`,
                        animationDuration: `${2.6 + (starIndex % 3) * 0.9}s`,
                      }
                    : undefined
              }
            />
          ))}
        </g>
      </svg>
    </figure>
  );
}
