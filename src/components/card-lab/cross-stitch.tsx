/**
 * Card Lab — CROSS-STITCH
 * Embroidered cross-stitch sampler tarot card, stitched on cream Aida cloth.
 * The whole card is a 28x42 logical grid: every motif is rendered as X-shaped
 * stitches (two diagonal strokes per cell), grouped by floss color into single
 * SVG paths. Classic sampler chrome: two-tone checker border with green corner
 * blocks, the roman numeral stitched top-center in a 5x7 alphabet, and the
 * card name in a 3x5 cross-stitch alphabet on bare cloth below the scene —
 * at most two stacked lines in the sampler convention, scaled in coordinate
 * space (never via transform) so any A-Z name stays fully inside the card.
 * The default render is THE HERMIT (IX): red robe, gold lantern, green hill,
 * navy sky.
 *
 * Props: { number = 9, name = "THE HERMIT", variant = 0 }.
 * variant 0-7: four floss palettes (classic / frost / autumn / berry) x
 * normal / mirrored composition (lantern and staff swap sides, stars mirror,
 * border checker phase flips). variant 0 is the original Hermit card exactly.
 *
 * Signature effects (CSS-only): on mount the border is "stitched" with a
 * quick stepped clip-path wipe, then the scene is stitched row by row over
 * ~2.8s in steps(20); the sky stars twinkle individually on staggered delays
 * like a starfield; the border checker's two floss colors slowly trade places
 * (steps swap on the paths, independent of the wipe on the group); on hover
 * the fabric warms as if held up to the light and the lantern twinkle speeds
 * up. Reduced motion = fully stitched, fully static.
 * Server-component safe: no hooks, no client code.
 */

import { toRoman } from "@/lib/roman";
import type { CSSProperties } from "react";

/* Logical stitch grid: 28 wide x 42 tall, one cell per cross-stitch. */
const GW = 28;
const GH = 42;
const CS = 10; // cell size in viewBox units

/** DMC-style floss palette. */
interface Palette {
  sky: string; // night sky
  red: string; // robe / border color A
  darkRed: string; // hood + robe shading
  gold: string; // lantern, numeral, border color B
  glow: string; // pale gold lantern glow
  green: string; // hill / border corners
  darkGreen: string; // hill crest outline
  face: string; // tan face
  beard: string; // ecru beard
  white: string; // stars + lantern light
  brown: string; // wooden staff
}

/**
 * Four floss schemes. Index 0 ("classic") is the original card, exact.
 * Shared flesh/ecru/white/brown tones keep the figure readable in every
 * scheme; sky, robe, gold and hill change.
 */
const PALETTES: readonly Palette[] = [
  {
    sky: "#25315e",
    red: "#a62c3a",
    darkRed: "#7d1f2e",
    gold: "#d9a441",
    glow: "#eed9a0",
    green: "#4a7a3d",
    darkGreen: "#33582b",
    face: "#e0b989",
    beard: "#ead9b8",
    white: "#faf7ec",
    brown: "#6f4a26",
  },
  {
    // frost: teal night, plum robe, spruce hill
    sky: "#1d3b4f",
    red: "#9c4160",
    darkRed: "#732f47",
    gold: "#cfa53a",
    glow: "#ecd9a8",
    green: "#4c7358",
    darkGreen: "#38573f",
    face: "#e0b989",
    beard: "#ead9b8",
    white: "#faf7ec",
    brown: "#6f4a26",
  },
  {
    // autumn: indigo night, rust robe, olive hill
    sky: "#2c2a4e",
    red: "#b85c28",
    darkRed: "#8d421c",
    gold: "#e0a32e",
    glow: "#f0d69a",
    green: "#6b6b2e",
    darkGreen: "#4d4d20",
    face: "#e0b989",
    beard: "#ead9b8",
    white: "#faf7ec",
    brown: "#6f4a26",
  },
  {
    // berry: violet night, poppy robe, moss hill
    sky: "#3a2547",
    red: "#c2483a",
    darkRed: "#93332b",
    gold: "#d9963b",
    glow: "#eed3a0",
    green: "#3f6b4a",
    darkGreen: "#2d4f36",
    face: "#e0b989",
    beard: "#ead9b8",
    white: "#faf7ec",
    brown: "#6f4a26",
  },
];

type CellMap = Map<string, string>;
const NO_STARS = new Set<string>();

/** 3x5 cross-stitch alphabet for the nameplate (A-Z; space = blank cells). */
const FONT3: Record<string, readonly string[]> = {
  A: [".#.", "#.#", "###", "#.#", "#.#"],
  B: ["##.", "#.#", "##.", "#.#", "##."],
  C: [".##", "#..", "#..", "#..", ".##"],
  D: ["##.", "#.#", "#.#", "#.#", "##."],
  E: ["###", "#..", "##.", "#..", "###"],
  F: ["###", "#..", "##.", "#..", "#.."],
  G: [".##", "#..", "#.#", "#.#", ".##"],
  H: ["#.#", "#.#", "###", "#.#", "#.#"],
  I: ["###", ".#.", ".#.", ".#.", "###"],
  J: ["..#", "..#", "..#", "#.#", ".#."],
  K: ["#.#", "#.#", "##.", "#.#", "#.#"],
  L: ["#..", "#..", "#..", "#..", "###"],
  M: ["#.#", "###", "#.#", "#.#", "#.#"],
  N: ["##.", "#.#", "#.#", "#.#", "#.#"],
  O: [".#.", "#.#", "#.#", "#.#", ".#."],
  P: ["##.", "#.#", "##.", "#..", "#.."],
  Q: [".#.", "#.#", "#.#", "##.", ".##"],
  R: ["##.", "#.#", "##.", "#.#", "#.#"],
  S: [".##", "#..", ".#.", "..#", "##."],
  T: ["###", ".#.", ".#.", ".#.", ".#."],
  U: ["#.#", "#.#", "#.#", "#.#", "###"],
  V: ["#.#", "#.#", "#.#", "#.#", ".#."],
  W: ["#.#", "#.#", "#.#", "###", "#.#"],
  X: ["#.#", "#.#", ".#.", "#.#", "#.#"],
  Y: ["#.#", "#.#", ".#.", ".#.", ".#."],
  Z: ["###", "..#", ".#.", "#..", "###"],
};

/** 5x7 capitals for the roman numeral (toRoman only emits I, V, X). */
const FONT5: Record<string, readonly string[]> = {
  I: ["###", ".#.", ".#.", ".#.", ".#.", ".#.", "###"],
  V: ["#...#", "#...#", ".#.#.", ".#.#.", "..#..", "..#..", "..#.."],
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

function hermitColors(p: Palette): Record<string, string> {
  return {
    H: p.darkRed,
    F: p.face,
    E: p.sky,
    B: p.beard,
    R: p.red,
    D: p.darkRed,
  };
}

/** White star stitches scattered across the night sky. */
const STARS: readonly (readonly [number, number])[] = [
  [4, 4], [3, 4], [5, 4], [4, 3], [4, 5], // bright north star (plus shape)
  [7, 6], [22, 3], [24, 7], [3, 10],
  [24, 13], [4, 16], [23, 17], [6, 20], [21, 20], [20, 16],
];

/** Where the green hill crest starts for each column (scene rows 2..27). */
function hillTop(x: number): number {
  return Math.min(27, 21 + Math.round(Math.abs(x - 14) * 0.55));
}

/** Width of a text line in grid cells for a given font + letter gap. */
function measureCells(
  text: string,
  font: Record<string, readonly string[]>,
  gap: number,
): number {
  let w = 0;
  for (const ch of text) {
    const glyph = font[ch];
    w += glyph ? glyph[0].length + gap : gap + 1;
  }
  return w > 0 ? w - gap : 0;
}

/** Round to 3 decimals so scaled stitch coordinates serialize cleanly. */
const r3 = (n: number) => Math.round(n * 1000) / 1000;

/**
 * Render one line of stitched text as SVG path data, horizontally centered on
 * the card. Lines wider than the 24-cell interior are scaled down IN
 * COORDINATE SPACE (never via SVG transform), so every stitch always lands
 * inside the viewBox. At scale 1 the math reduces to integer cells and the
 * output is byte-identical to unscaled rendering.
 */
function textLinePath(
  text: string,
  font: Record<string, readonly string[]>,
  y0: number,
  gap: number,
): string {
  const w = measureCells(text, font, gap);
  if (w <= 0) return "";
  const s = Math.min(1, 24 / w);
  const startX = s === 1 ? Math.floor((GW - w) / 2) : (GW - w * s) / 2;
  const segs: string[] = [];
  let cx = 0; // running cell offset of the current glyph
  for (const ch of text) {
    const glyph = font[ch];
    if (!glyph) {
      cx += gap + 1;
      continue;
    }
    glyph.forEach((row, dy) => {
      for (let dx = 0; dx < row.length; dx++) {
        if (row[dx] !== "#") continue;
        const x0 = r3((startX + (cx + dx) * s) * CS + 1.3);
        const yTop = r3((y0 + dy * s) * CS + 1.3);
        const x1 = r3((startX + (cx + dx + 1) * s) * CS - 1.3);
        const y1 = r3((y0 + (dy + 1) * s) * CS - 1.3);
        segs.push(`M${x0} ${yTop}L${x1} ${y1}M${x1} ${yTop}L${x0} ${y1}`);
      }
    });
    cx += glyph[0].length + gap;
  }
  return segs.join("");
}

/**
 * Split a card name into at most two stitched lines (sampler convention).
 * The split minimizes the wider line, so both lines stay as large — and as
 * legible — as possible. Single-word names get one centered line.
 */
function layoutNameLines(name: string): string[] {
  const words = name.toUpperCase().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return words;
  let best: string[] = [words.join(" ")];
  let bestW = measureCells(best[0], FONT3, 1);
  for (let i = 1; i < words.length; i++) {
    const lines = [words.slice(0, i).join(" "), words.slice(i).join(" ")];
    const w = Math.max(...lines.map((l) => measureCells(l, FONT3, 1)));
    if (w < bestW) {
      best = lines;
      bestW = w;
    }
  }
  return best;
}

interface StitchBuild {
  border: CellMap;
  scene: CellMap;
  starKeys: Set<string>;
  palette: Palette;
  numeralD: string;
  nameD: string;
}

/** Compose the full stitch maps: cell key "x,y" -> floss color. Border and
 *  scene are cell maps; numeral and name are pre-rendered path data (their
 *  coordinates are baked, never transformed, and always inside the viewBox). */
function buildStitches(number: number, name: string, variant: number): StitchBuild {
  const v = ((Math.round(variant) % 8) + 8) % 8;
  const palette = PALETTES[v % 4];
  const mirrored = v >= 4;
  const mx = (x: number) => (mirrored ? GW - 1 - x : x);

  const border: CellMap = new Map();
  const scene: CellMap = new Map();
  const numeral: CellMap = new Map();
  const starKeys = new Set<string>();
  const set = (x: number, y: number, color: string) => {
    if (x < 0 || x >= GW || y < 0 || y >= GH) return;
    scene.set(`${x},${y}`, color);
  };

  // 1) Sampler border: two-tone checker (phase flips when mirrored),
  //    green corner blocks.
  const phase = mirrored ? 1 : 0;
  for (let y = 0; y < GH; y++) {
    for (let x = 0; x < GW; x++) {
      const onBorder = x < 2 || x >= GW - 2 || y < 2 || y >= GH - 2;
      if (!onBorder) continue;
      const corner = (x < 2 || x >= GW - 2) && (y < 2 || y >= GH - 2);
      border.set(
        `${x},${y}`,
        corner
          ? palette.green
          : (x + y + phase) % 2
            ? palette.red
            : palette.gold,
      );
    }
  }

  // 2) Scene fill: sky above, hill below the crest (rows 2..27).
  for (let x = 2; x < GW - 2; x++) {
    const top = hillTop(x);
    for (let y = 2; y <= 27; y++) {
      if (y >= top) set(x, y, y === top ? palette.darkGreen : palette.green);
      else set(x, y, palette.sky);
    }
  }

  // 3) Roman numeral in gold, top center, as baked path data (never in the
  //    scene map, so it never mirrors). Sky stitches under it are cleared.
  const numeralText = toRoman(number);
  const numeralGap = measureCells(numeralText, FONT5, 2) <= 24 ? 2 : 1;
  const numeralD = textLinePath(numeralText, FONT5, 2, numeralGap);
  const numeralKeys = new Set<string>();
  {
    const w = measureCells(numeralText, FONT5, numeralGap);
    const s = Math.min(1, 24 / w);
    if (s === 1) {
      // Clear exactly the glyph cells (keeps sky stitches between letters).
      let cx = Math.floor((GW - w) / 2);
      for (const ch of numeralText) {
        const glyph = FONT5[ch];
        if (!glyph) {
          cx += numeralGap + 1;
          continue;
        }
        glyph.forEach((row, dy) => {
          for (let dx = 0; dx < row.length; dx++) {
            if (row[dx] === "#") numeralKeys.add(`${cx + dx},${2 + dy}`);
          }
        });
        cx += glyph[0].length + numeralGap;
      }
    } else {
      // Scaled numeral (beyond the 1-22 contract): clear its bounding box.
      const x0 = (GW - w * s) / 2;
      const from = Math.max(2, Math.floor(x0));
      const to = Math.min(GW - 3, Math.ceil(x0 + w * s) - 1);
      for (let x = from; x <= to; x++) {
        for (let y = 2; y <= 8; y++) numeralKeys.add(`${x},${y}`);
      }
    }
  }
  for (const key of numeralKeys) scene.delete(key);

  // 4) Star stitches (skip any cell already claimed by the numeral).
  for (const [sx, sy] of STARS) {
    const x = mx(sx);
    const key = `${x},${sy}`;
    if (numeralKeys.has(key)) continue;
    set(x, sy, palette.white);
    starKeys.add(key);
  }

  // 5) Staff (one hand), gold knob on top.
  set(mx(8), 9, palette.gold);
  for (let y = 10; y <= 23; y++) set(mx(8), y, palette.brown);
  set(mx(9), 15, palette.red); // arm reaching the staff
  set(mx(10), 15, palette.red);

  // 6) Raised other arm + lantern with a white star light inside.
  set(mx(17), 13, palette.red);
  set(mx(18), 12, palette.red);
  set(mx(19), 11, palette.red);
  set(mx(20), 8, palette.gold); // hanger
  set(mx(19), 9, palette.gold);
  set(mx(20), 9, palette.white);
  set(mx(21), 9, palette.gold);
  set(mx(19), 10, palette.gold);
  set(mx(20), 10, palette.white);
  set(mx(21), 10, palette.gold);
  set(mx(20), 11, palette.gold); // base
  // Pale-gold glow stitches around the lantern (these twinkle).
  set(mx(22), 9, palette.glow);
  set(mx(22), 10, palette.glow);
  set(mx(21), 12, palette.glow);

  // 7) The hermit himself (mx() alone performs the horizontal mirror).
  const hc = hermitColors(palette);
  HERMIT.forEach((row, dy) => {
    for (let dx = 0; dx < row.length; dx++) {
      const color = hc[row[dx]];
      if (color) set(mx(10 + dx), 9 + dy, color);
    }
  });

  // 8) Nameplate on bare cloth: at most two stacked stitched lines in deep
  //    red floss. One-word names are centered vertically in the nameplate;
  //    two-line names keep the classic 29/35 rows. Scaling is baked into the
  //    path coordinates, so every stitch stays inside the viewBox.
  const nameLines = layoutNameLines(name);
  const nameD = nameLines
    .map((line, li) =>
      textLinePath(line, FONT3, nameLines.length === 1 ? 32 : 29 + li * 6, 1),
    )
    .join("");

  return { border, scene, starKeys, palette, numeralD, nameD };
}

/** Group stitches by floss color into one SVG path per color — except the
 *  sky-star stitches (listed in starKeys), which each get their own path so
 *  they can twinkle on staggered delays (starIndex = delay slot). */
type StitchPath = {
  color: string;
  d: string;
  starIndex?: number;
};

function groupPaths(cells: CellMap, starKeys: Set<string>): StitchPath[] {
  const groups = new Map<string, string[]>();
  const starSegs: { color: string; d: string }[] = [];
  for (const [key, color] of cells) {
    const [x, y] = key.split(",").map(Number);
    const x0 = x * CS + 1.3;
    const y0 = y * CS + 1.3;
    const x1 = (x + 1) * CS - 1.3;
    const y1 = (y + 1) * CS - 1.3;
    // One cross-stitch: two short diagonal strokes per cell.
    const seg = `M${x0} ${y0}L${x1} ${y1}M${x1} ${y0}L${x0} ${y1}`;
    if (starKeys.has(key)) {
      starSegs.push({ color, d: seg });
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
  starSegs.forEach(({ color, d }, i) => out.push({ color, d, starIndex: i }));
  return out;
}

export interface CrossStitchCardProps {
  /** Major Arcana number, 1-22 (rendered as a stitched roman numeral). */
  number?: number;
  /** Card name stitched on the nameplate; long names wrap + scale to fit. */
  name?: string;
  /** 0-7: four floss palettes x normal/mirrored composition. 0 = original. */
  variant?: number;
}

export default function CrossStitchTarotCard({
  number = 9,
  name = "THE HERMIT",
  variant = 0,
}: CrossStitchCardProps) {
  const build = buildStitches(number, name, variant);
  const { palette } = build;
  const borderPaths = groupPaths(build.border, NO_STARS);

  // Split glow stitches out of the scene map so each twinkles on its own
  // delay (they are the only cells using the palette's glow tone).
  const glowCells: CellMap = new Map();
  const sceneCells: CellMap = new Map();
  for (const [key, color] of build.scene) {
    if (color === palette.glow) glowCells.set(key, color);
    else sceneCells.set(key, color);
  }
  const scenePaths = groupPaths(sceneCells, build.starKeys);
  // One path per glow stitch so each twinkles on its own delay.
  const glowPaths = Array.from(glowCells, ([key, color]) => {
    const [x, y] = key.split(",").map(Number);
    const x0 = x * CS + 1.3;
    const y0 = y * CS + 1.3;
    const x1 = (x + 1) * CS - 1.3;
    const y1 = (y + 1) * CS - 1.3;
    return { color, d: `M${x0} ${y0}L${x1} ${y1}M${x1} ${y0}L${x0} ${y1}` };
  });

  return (
    <figure
      className="cl-cs-card"
      role="img"
      aria-label={`Cross-stitch sampler of ${name} tarot card, ${toRoman(number)}`}
      style={
        {
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
          "--cl-cs-red": palette.red,
          "--cl-cs-gold": palette.gold,
        } as CSSProperties
      }
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
           so the two never fight. Colors come from per-card CSS variables so
           every palette variant swaps its own pair. */
        .cl-cs-card .cl-cs-swap-red {
          animation: cl-cs-swap-red 5s steps(1) 1.2s infinite;
        }
        .cl-cs-card .cl-cs-swap-gold {
          animation: cl-cs-swap-gold 5s steps(1) 1.2s infinite;
        }
        @keyframes cl-cs-swap-red {
          0%, 100% { stroke: var(--cl-cs-red); }
          50% { stroke: var(--cl-cs-gold); }
        }
        @keyframes cl-cs-swap-gold {
          0%, 100% { stroke: var(--cl-cs-gold); }
          50% { stroke: var(--cl-cs-red); }
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
          {borderPaths.map(({ color, d }) => (
            <path
              key={color}
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={2.3}
              strokeLinecap="round"
              className={
                color === palette.red
                  ? "cl-cs-swap-red"
                  : color === palette.gold
                    ? "cl-cs-swap-gold"
                    : undefined
              }
            />
          ))}
        </g>
        <g className="cl-cs-scene-wipe">
          <path
            d={build.numeralD}
            fill="none"
            stroke={palette.gold}
            strokeWidth={2.3}
            strokeLinecap="round"
          />
          {scenePaths.map(({ color, d, starIndex }) => (
            <path
              key={starIndex !== undefined ? `star-${starIndex}` : color}
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={2.3}
              strokeLinecap="round"
              className={starIndex !== undefined ? "cl-cs-star" : undefined}
              style={
                starIndex !== undefined
                  ? {
                      animationDelay: `${((starIndex * 0.7) % 4.2).toFixed(2)}s`,
                      animationDuration: `${2.6 + (starIndex % 3) * 0.9}s`,
                    }
                  : undefined
              }
            />
          ))}
          {glowPaths.map(({ color, d }, i) => (
            <path
              key={`glow-${i}`}
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={3.2}
              strokeLinecap="round"
              className="cl-cs-glow"
              style={{ animationDelay: `${i * 0.7}s` }}
            />
          ))}
          <path
            d={build.nameD}
            fill="none"
            stroke={palette.red}
            strokeWidth={2.3}
            strokeLinecap="round"
          />
        </g>
      </svg>
    </figure>
  );
}
