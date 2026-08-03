/**
 * Card Lab — PIXEL
 * 8-bit pixel-art tarot deck: cards pulled from a 1992 handheld RPG. Every
 * scene is a hand-drawn 24x36 logical-pixel bitmap rendered as crisp-edged
 * SVG <rect> blocks on a dark cartridge card, with a stepped pixel-corner
 * frame, blocky rect-drawn roman numeral, a pixel-bordered nameplate, and
 * checkerboard dithering around the scene's light source.
 *
 * Reusable via optional props { number, name, variant }; with no props it
 * renders THE HERMIT (IX) in the original purple scheme. `number` selects a
 * bespoke scene (1, 3, 7, 9, 10, 13, 17, 22; anything else falls back to the
 * Hermit). `variant` (0-7) selects one of four console-inspired palettes, and
 * variants 4-7 also mirror the scene and shuffle the starfield.
 * Server-component safe: no hooks, no client code.
 */

import type { ReactNode } from "react";
import { toRoman } from "@/lib/roman";

/** Full per-scheme look: scene palette + chrome colors. */
type Scheme = {
  sky: string; // card background
  frame: string; // stepped outer frame + nameplate border
  frameInner: string; // inner hairline frame
  plate: string; // nameplate fill
  accent: string; // nameplate corner studs
  ink: string; // numeral + name text
  pal: Record<string, string>;
};

/**
 * Bitmap palette chars: s/d stars, g/o/L/l glow ramp (the scene's light
 * source), W darkest outline, H/R/r figure tones, f near-black, b off-white,
 * m/M/n terrain & stone.
 */
const SCHEMES: Scheme[] = [
  // 0 — original cartridge purple (variant 0 must equal the first card).
  {
    sky: "#1b1032",
    frame: "#8f76c9",
    frameInner: "#4a3580",
    plate: "#241847",
    accent: "#ffb52e",
    ink: "#f4ecd8",
    pal: {
      s: "#f4ecd8", d: "#7a68ad", g: "#c07f24", o: "#e09a2e",
      L: "#ffb52e", l: "#ffe9a8", W: "#2d1d55", H: "#5a4394",
      R: "#4a3580", r: "#2e1f52", f: "#120a24", b: "#e8dfc8",
      m: "#2a1c4e", M: "#453278", n: "#cfc4e8",
    },
  },
  // 1 — DMG Game Boy greens, four-shade handheld classic.
  {
    sky: "#0f380f",
    frame: "#8bac0f",
    frameInner: "#306230",
    plate: "#0f380f",
    accent: "#9bbc0f",
    ink: "#9bbc0f",
    pal: {
      s: "#9bbc0f", d: "#306230", g: "#306230", o: "#8bac0f",
      L: "#8bac0f", l: "#9bbc0f", W: "#306230", H: "#8bac0f",
      R: "#306230", r: "#0f380f", f: "#081f08", b: "#9bbc0f",
      m: "#0f380f", M: "#306230", n: "#9bbc0f",
    },
  },
  // 2 — NES midnight blue, warm amber lantern kept for contrast.
  {
    sky: "#0b1030",
    frame: "#4aa8e0",
    frameInner: "#1c3a6e",
    plate: "#101d42",
    accent: "#ffd75e",
    ink: "#e8f2ff",
    pal: {
      s: "#e8f2ff", d: "#5a78b8", g: "#b8912a", o: "#e0b23e",
      L: "#ffd75e", l: "#fff3c0", W: "#1c2c55", H: "#3a6ea8",
      R: "#2a4f80", r: "#16264e", f: "#080e24", b: "#dce8f8",
      m: "#14204a", M: "#284a8a", n: "#bcd0f0",
    },
  },
  // 3 — Virtual Boy red-on-black.
  {
    sky: "#100000",
    frame: "#c03028",
    frameInner: "#580c08",
    plate: "#1a0505",
    accent: "#ff4030",
    ink: "#ffb0a0",
    pal: {
      s: "#ffd8c8", d: "#883028", g: "#982818", o: "#d03820",
      L: "#ff5038", l: "#ffd0b8", W: "#400c08", H: "#a02820",
      R: "#781810", r: "#380a06", f: "#0c0000", b: "#ffc8b8",
      m: "#280606", M: "#581410", n: "#f0a898",
    },
  },
];

const GRID_W = 24;
const GRID_H = 36;

/** IX — hooded figure, raised lantern, staff, snowy peak (canonical). */
const HERMIT_ROWS: string[] = [
  "........................",
  "...s....................",
  "............d.......s...",
  "......s.................",
  ".................d......",
  "..d........s............",
  "..............o.g.o.....",
  "....b........g.LLL.g....",
  "....W.........LlL.......",
  "....W.....HHH...........",
  "....W....HHHHHgRg.......",
  "....W...HHfffHH.RR.g....",
  "....W...HfffffHRR.......",
  "....W...HffbbH..........",
  "....W..RRRbbbRR.........",
  "....W.RRRRbbbRRR........",
  "....W.RRRRRbRRRR........",
  "....WRRRRRRRRRRR........",
  "....WRRrRRRRRRrRR..d....",
  "....WRRrRRRRRRrRR.......",
  "....WRRrRRRRRRrRR.......",
  "....WRRrRRRRRRrRRR......",
  "....WRRrRRRRRRrRRRR.....",
  "....WRRrRRRRRRrRRRR.....",
  "....WRRrRRRRRRRRrRR.....",
  "....WRRRRRRRRRRRRR......",
  "....W..mmmnnnnmmm.......",
  "......mnnMMMMMMnnm......",
  ".....mmMMMMMMMMMMmm.....",
  "....mmmMMMMMmmMMMMmmm...",
  "...mmmmMMmmmmmMMmmmmm...",
  "..mmmmmmmmmMMmmmmmmmm...",
  ".mmmmmmMmmmmmmmMmmmmmm..",
  "mmmmmMmmmmmmmmmmMmmmmmmm",
  "mmmmMmmmmmmmmmmmmMmmmmmm",
  "mmmmmmmmmmmmmmmmmmmmmmmm",
];

/** I — raised wand arm, lemniscate overhead, table with the four tools. */
const MAGICIAN_ROWS: string[] = [
  "........................",
  ".................glg....",
  "...s..............W.....",
  "..........LL.LL...W.....",
  ".........L..L..L..W.....",
  ".....d....LL.LL...W.....",
  "..................W.....",
  "..........WWWW...b......",
  "........s..WbbW..R......",
  "..........WbbW.R........",
  ".........RRWWRR.........",
  "........RRRRRRRR........",
  "........RRrRRrRR........",
  "........RRrRRrRR........",
  ".......RRRrRRrRRR.......",
  ".......RRrRRRRrRR.......",
  ".......RRrRRRRrRR.......",
  "......b.RRrRRRRrR.......",
  ".......RRrRRRRrRR.......",
  ".......RRRRRRRRRR.......",
  "......n...b...nnn..W....",
  ".....nnn..b...nnn.W.....",
  "......n..WWW...n...W....",
  "....MMMMMMMMMMMMMMMM....",
  "....MmmmmmmmmmmmmmmM....",
  "....MmmWWmmmmmmWWmmM....",
  "....MmmmmmmmmmmmmmmM....",
  "....MmmmmmmmmmmmmmmM....",
  "....WWWWWWWWWWWWWWWW....",
  "mmmmmmmmmmmmmmmmmmmmmmmm",
  "mmmmMmmmmmmmmmmmmMmmmmmm",
  "mmmmmmmmmmmmmmmmmmmmmmmm",
  "mmMmmmmmmmmmmmmmmMmmmmmm",
  "mmmmmmmmmmmmmmmmmmmmmmmm",
  "mmmmMmmmmmmmmmmmmMmmmmmm",
  "mmmmmmmmmmmmmmmmmmmmmmmm",
];

/** III — star crown, heart shield with Venus glyph, wheat below. */
const EMPRESS_ROWS: string[] = [
  "........................",
  "....................s...",
  "....d...................",
  "............l...........",
  "........s..glg..........",
  "............g...........",
  ".........n.n.n.n........",
  ".........nnnnnnn........",
  ".........WWbbbWW........",
  "........WWWbbbWWW.......",
  "........WW.bbb.WW.......",
  "........RRRbbbRRR.......",
  ".......RRRRRRRRRRR......",
  "......RRRrRRRRRRR.bb.bb.",
  "......RRrRRRRrR..bbbbbb.",
  ".....RRRrRRRRrR..bbfbbb.",
  ".....RRrRRRRrR...bfbfb..",
  ".....RRrRRRRrR....bfb...",
  ".....RRRrRRRRR...fff....",
  ".....RRRrRRRRR....f.....",
  "....RRRRrRRRRRR.........",
  "....RRRrRRRRrRR.........",
  "....RRrRRRRRRrRR........",
  "...RRRrRRRRRRrRRR.......",
  "...RRRRRRRRRRRRR........",
  "..b...b...b...b...b...b.",
  ".bbb.bbb.bbb.bbb.bbb.bb.",
  "..b...b...b...b...b...b.",
  "..n...n...n...n...n...n.",
  "..n...n...n...n...n...n.",
  "..n...n...n...n...n...n.",
  "mmnmmnmmnmmnmmnmmnmmnmmm",
  "mmmmmmmmmmmmmmmmmmmmmmmm",
  "mmmmMmmmmmmmmmmmmMmmmmmm",
  "mmmmmmmmmmmmmmmmmmmmmmmm",
  "mmMmmmmmmmmmmmmmmMmmmmmm",
];

/** VII — starred canopy, boxy chariot, two sphinxes, city wall behind. */
const CHARIOT_ROWS: string[] = [
  "........................",
  "..s..................d..",
  "...........s............",
  ".....MMMMMMMMMMMMMM.....",
  ".....MmmmmmmmmmmmmM.....",
  ".....MmmmmLlLmmmmmM.....",
  ".....MmmmmmmmmmmmmM.....",
  "......W..........W......",
  "......W..nnnn..W........",
  "......W..WbbW..W........",
  "......W.HHbbHH.W........",
  ".m.m.m.W.HHHHHH.W.m.m.m.",
  ".mmmmm.W.HrHHrH.W.mmmmm.",
  ".m.m.m...HHHHHH...m.m.m.",
  "......RRRRRRRRRRRR......",
  "......WRRRRRRRRRRW......",
  "......WRrRRRRRRrRW......",
  "......WRRRbbbRRRRW......",
  "......WRRRb.bRRRRW......",
  "......WRRRbbbRRRRW......",
  "......WRrRRRRRRrRW......",
  "......WRRRRRRRRRRW......",
  "......RRRRRRRRRRRR......",
  ".......WW......WW.......",
  "..bbb...........bbb.....",
  ".bbbbb......bbbbb.......",
  ".bbfbbb....bbfbbb.......",
  ".bbbbbb....bbbbbb.......",
  "mmmmmmmmmmmmmmmmmmmmmmmm",
  "mmmmmmmmmmmmmmmmmmmmmmmm",
  "mmmmMmmmmmmmmmmmmMmmmmmm",
  "mmmmmmmmmmmmmmmmmmmmmmmm",
  "mmMmmmmmmmmmmmmmmMmmmmmm",
  "mmmmmmmmmmmmmmmmmmmmmmmm",
  "mmmmMmmmmmmmmmmmmMmmmmmm",
  "mmmmmmmmmmmmmmmmmmmmmmmm",
];

/** X — spoked wheel, glowing hub, sphinx above, snake and beast at sides. */
const WHEEL_ROWS: string[] = [
  "...................d....",
  "..........bbbb..........",
  ".........bbbbbb.........",
  ".........bfbbfb.........",
  "..........bbbb..........",
  "...........bb...........",
  "...........RR...........",
  ".........RRRRRR.........",
  "..M....RR..HH..RR.......",
  "...M.RbR..HH..RbR.......",
  "...M.R....HH....R.......",
  "..M.RR....HH....RR......",
  "..M.R.....HH.....R..m...",
  ".M..R.....HH.....R.mmm..",
  ".M..RRHHHHHllHHHHHRR.m..",
  ".M..R.....HH.....R.m.m..",
  "..M.R.....HH.....R..m...",
  "..M.RR....HH....RR......",
  "...M.R....HH....R.......",
  ".....RbR..HH..RbR.......",
  ".......RR..HH..RR.......",
  ".........RRRRRR.........",
  "...........RR...........",
  "......s.................",
  "mmmmmmmmmmmmmmmmmmmmmmmm",
  "mmmmMmmmmmmmmmmmmMmmmmmm",
  "mmmmmmmmmmmmmmmmmmmmmmmm",
  "mmMmmmmmmmmmmmmmmMmmmmmm",
  "mmmmmmmmmmmmmmmmmmmmmmmm",
  "mmmmMmmmmmmmmmmmmMmmmmmm",
  "mmmmmmmmmmmmmmmmmmmmmmmm",
  "mmMmmmmmmmmmmmmmmMmmmmmm",
  "mmmmmmmmmmmmmmmmmmmmmmmm",
  "mmmmMmmmmmmmmmmmmMmmmmmm",
  "mmmmmmmmmmmmmmmmmmmmmmmm",
  "mmMmmmmmmmmmmmmmmMmmmmmm",
];

/** XIII — skeletal rider on a pale horse, rose banner, sun by the towers. */
const DEATH_ROWS: string[] = [
  "........................",
  ".....d..................",
  "........................",
  "...............W........",
  "...............W........",
  "...............W........",
  "...............WRRRRRR..",
  ".........bbb...WRRRRRR..",
  ".........bfb...WRRLRRR..",
  ".........bbb...WRLlLRR..",
  ".........b....WRRLRRR...",
  "M.......bbbbb..WRRRRRR.M",
  "m.......b.b.b..W.......m",
  "m.......bbbbb.bW.......m",
  "m...HH...b.b...W..LLL..m",
  "m..HHHH..bbb...W.LLLLL.m",
  "m..HHfH...b....W..LLL..m",
  "m...HHHHHHHHHHHH.......m",
  "m..HHHHHHHHHHHHHHH.....m",
  "m..HRHHHHHHHHHHRH......m",
  "m..HHHHHHHHHHHHHHH.....m",
  "m..HHHHHHHHHHHHHHH.....m",
  "m...HH..HH..HH..HH.....m",
  "m...HH..HH..HH..HH.....m",
  "m...HH..HH..HH..HH.....m",
  "m...HH..HH..HH..HH.....m",
  "mmmmmmmmmmmmmmmmmmmmmmmm",
  "mmmmmmmmmmmmmmmmmmmmmmmm",
  "mmmmMmmmmmmmmmmmmMmmmmmm",
  "mmmmmmmmmmmmmmmmmmmmmmmm",
  "mmMmmmmmmmmmmmmmmMmmmmmm",
  "mmmmmmmmmmmmmmmmmmmmmmmm",
  "mmmmMmmmmmmmmmmmmMmmmmmm",
  "mmmmmmmmmmmmmmmmmmmmmmmm",
  "mmMmmmmmmmmmmmmmmMmmmmmm",
  "mmmmmmmmmmmmmmmmmmmmmmmm",
];

/** XVII — kneeling figure with two jugs, one big star, seven small stars. */
const STAR_ROWS: string[] = [
  "........................",
  "........................",
  "...s.......g........s...",
  "............L...........",
  "......s..g..L..g..s.....",
  "..........gLLLg.........",
  "..s......LLLlLLL.....s..",
  "..........gLLLg.........",
  ".....s...g..L..g........",
  "............g...........",
  "....................d...",
  "........................",
  "..........WWW...........",
  "..........WbW...........",
  "..........bbb...........",
  ".........RbRbR..........",
  "........RRRRRRR.........",
  ".......nn.RRRR..........",
  ".......n.nRRRRRnn.......",
  "........n.RRRRRn.n......",
  "........M..RRRR...M.....",
  "........M..RRR....M.....",
  "........M..RRR....M.....",
  "........M..RRR....M.....",
  "........M..RRRRR.M......",
  ".........RRRRRRR........",
  ".........RRRRRRR........",
  "..MMMMMMMM..mmmmmmmmmmmm",
  "..MMnMMMMnM.mmmmmmmmmmmm",
  "m.MMMMMMMM.mmmmmmmmmmmmm",
  "mm.MMMMMM.mmmmmmmmmmmmmm",
  "mmm..mmmmmmmmmmmmmmmmmmm",
  "mmmmmmmmmmmmmmmmmmmmmmmm",
  "mmmmMmmmmmmmmmmMmmmmmmmm",
  "mmmmmmmmmmmmmmmmmmmmmmmm",
  "mmMmmmmmmmmmmmmmmMmmmmmm",
];

/** XXII — stepping toward the cliff edge, head up, dog, bundle, sun behind. */
const FOOL_ROWS: string[] = [
  "........................",
  "...............d........",
  ".....g..................",
  "....oLLo.........d......",
  "...gLLlLg...............",
  "....oLLo................",
  ".....g..................",
  "......bb...bb...........",
  ".......W...bb...........",
  "........W.RRR...........",
  ".........WRRR...........",
  "..........RRRR..........",
  "..........RRrR..........",
  "..........RRrR..........",
  "..........RRRR..........",
  "..........RRRR..........",
  "..........RR..R.........",
  "......bb..RR...R........",
  ".....bbfb.RR...R........",
  "......bb..RR...RR.......",
  ".........MMMMMMMMMMMMMMM",
  "................mmmmmmmm",
  "...............mMmmmmmmm",
  "...............mmmmmmmmm",
  "...............mmmmMmmmm",
  "...............mmmmmmmmm",
  "...............Mmmmmmmmm",
  "...............mmmmmmmmm",
  "...............mmmmmmMmm",
  "...............mmmmmmmmm",
  "...............mmmmmmmmm",
  "mmmmmmm........mmmmmmmmm",
  "mmmmmmmm.......mmmmMmmmm",
  "mmmmMmmm......mmmmmmmmmm",
  "mmmmmmmm.......mmmmmmmmm",
  "mmmmmmmmm......mmmmmmmmm",
];

type SceneDef = {
  rows: string[];
  /** Which bitmap cells join the animated motion group (bob or spin). */
  sprite: (ch: string, x: number, y: number) => boolean;
  /** Spin the motion group (Wheel) instead of bobbing it. */
  spin?: boolean;
  /** Top of the glitch tear band, in grid rows. */
  bandY?: number;
};

const SCENES: Record<number, SceneDef> = {
  1: {
    rows: MAGICIAN_ROWS,
    // Figure, wand and lemniscate bob; the table and its tools stay put.
    sprite: (ch, _x, y) => y <= 18 && "WHRrfbLlgo".includes(ch),
    bandY: 11,
  },
  3: {
    rows: EMPRESS_ROWS,
    // Empress, crown and heart shield bob; wheat and ground stay put.
    sprite: (ch, _x, y) => y <= 24 && "WHRrbnLlgo".includes(ch),
    bandY: 12,
  },
  7: {
    rows: CHARIOT_ROWS,
    // Canopy, charioteer, chariot and sphinxes bob; walls and ground stay.
    sprite: (ch, _x, y) => y <= 27 && "WHRMnfbLl".includes(ch),
    bandY: 17,
  },
  9: {
    rows: HERMIT_ROWS,
    sprite: (ch) => "WHRrfbLlgo".includes(ch),
    bandY: 13,
  },
  10: {
    rows: WHEEL_ROWS,
    // The wheel itself spins in 90-degree clicks; sphinx/snake/beast stay.
    sprite: (ch, x, y) =>
      x >= 4 && x <= 19 && y >= 6 && y <= 22 && "RHlb".includes(ch),
    spin: true,
    bandY: 10,
  },
  13: {
    rows: DEATH_ROWS,
    // Skeleton, pale horse, pole, banner and rose bob; towers and sun stay.
    sprite: (ch, _x, y) =>
      (y <= 25 && "bHW".includes(ch)) || (y <= 11 && "RLl".includes(ch)),
    bandY: 21,
  },
  17: {
    rows: STAR_ROWS,
    // Kneeling figure and jugs bob; stars, water and pool stay.
    sprite: (ch, x, y) =>
      y >= 12 && y <= 26 && x >= 7 && x <= 19 && "RWrbn".includes(ch),
    bandY: 16,
  },
  22: {
    rows: FOOL_ROWS,
    // Fool, bundle stick and dog bob; sun and cliff stay.
    sprite: (ch, x, y) =>
      y >= 7 && y <= 19 && x >= 5 && x <= 15 && "RrWb".includes(ch),
    bandY: 11,
  },
};

/** 3x5 blocky pixel glyphs — everything a roman numeral (1-39) needs. */
const GLYPHS: Record<string, string[]> = {
  I: ["111", "010", "010", "010", "111"],
  V: ["101", "101", "101", "101", "010"],
  X: ["101", "101", "010", "101", "101"],
};

/** One glyph rendered as rects; `px` is the pixel size in overlay units. */
function PixelGlyph({
  ch,
  x,
  y,
  px,
  fill,
}: {
  ch: string;
  x: number;
  y: number;
  px: number;
  fill: string;
}) {
  const rows = GLYPHS[ch] ?? [];
  return (
    <g>
      {rows.flatMap((row, gy) =>
        [...row].map((bit, gx) =>
          bit === "1" ? (
            <rect
              key={`${ch}-${gx}-${gy}`}
              x={x + gx * px}
              y={y + gy * px}
              width={px}
              height={px}
              fill={fill}
            />
          ) : null,
        ),
      )}
    </g>
  );
}

export type PixelCardProps = {
  /** Major arcana number, 1-22 (selects the scene + pixel numeral). */
  number?: number;
  /** Card name for the nameplate; long names are squished to fit. */
  name?: string;
  /** 0-7: palette = variant % 4, variants 4-7 mirror + reshuffle stars. */
  variant?: number;
};

export default function PixelTarotCard({
  number = 9,
  name = "THE HERMIT",
  variant = 0,
}: PixelCardProps) {
  const v = ((Math.round(variant) % 8) + 8) % 8;
  const scheme = SCHEMES[v % 4];
  const mirrored = v >= 4;
  const starShift = (v * 5) % GRID_W;
  const pal = scheme.pal;
  const scene = SCENES[number] ?? SCENES[9];
  const bandY = scene.bandY ?? 13;

  // Rasterize the bitmap into crisp rects (slight overdraw avoids hairlines),
  // split into a background layer and a motion layer (the scene's actor).
  const bgCells: ReactNode[] = [];
  const motionCells: ReactNode[] = [];
  scene.rows.forEach((raw, y) => {
    const row = raw.padEnd(GRID_W, ".").slice(0, GRID_W);
    [...row].forEach((ch, x) => {
      const fill = pal[ch];
      if (!fill) return;
      const glow = ch === "l" || ch === "L" || ch === "o" || ch === "g";
      const star = ch === "s" || ch === "d";
      // Variants reshuffle the starfield horizontally (variant 0: no shift).
      const cx = star ? (x + starShift) % GRID_W : x;
      const cell = (
        <rect
          key={`${x}-${y}`}
          x={cx}
          y={y}
          width={1.02}
          height={1.02}
          fill={fill}
          className={glow ? "cl-pixel-glow" : star ? "cl-pixel-star" : undefined}
          style={
            star
              ? { animationDelay: `${(((x * 7 + y * 13) % 10) / 10) * 2.4}s` }
              : undefined
          }
        />
      );
      (scene.sprite(ch, x, y) ? motionCells : bgCells).push(cell);
    });
  });

  // Pixel-glyph roman numeral, centered as one block (4px grid, 1px gaps).
  const numeral = toRoman(number);
  const numeralWidth = (numeral.length * 4 - 1) * 4;
  const numeralX = (200 - numeralWidth) / 2;

  // Long names are compressed onto the nameplate with SVG textLength.
  const longName = name.length > 10;

  return (
    <figure
      className="cl-pixel-card"
      style={{
        aspectRatio: "2/3",
        width: "100%",
        margin: 0,
        position: "relative",
        overflow: "hidden",
        background: scheme.sky,
      }}
    >
      <style>{`
        .cl-pixel-card { image-rendering: pixelated; }
        .cl-pixel-glow { animation: cl-pixel-flick 1.8s steps(2, end) infinite; }
        @keyframes cl-pixel-flick {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }

        /* Hover: the light source sparkles — faster stutter + brightness. */
        .cl-pixel-card:hover .cl-pixel-glow {
          animation-duration: 0.45s;
          filter: brightness(1.45) saturate(1.2);
        }

        /* Idle bob: the actor hops one logical pixel, chunky hard steps. */
        .cl-pixel-sprite { animation: cl-pixel-bob 1.5s linear infinite; }
        @keyframes cl-pixel-bob {
          0%, 49.9% { transform: translateY(0); }
          50%, 100% { transform: translateY(1px); }
        }

        /* The Wheel turns in 90-degree clicks so pixels stay aligned. */
        .cl-pixel-wheel {
          transform-box: fill-box;
          transform-origin: center;
          animation: cl-pixel-spin 8s steps(4) infinite;
        }
        @keyframes cl-pixel-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Screen glitch: a torn horizontal band, flashed every ~7s. */
        .cl-pixel-glitch {
          opacity: 0;
          animation: cl-pixel-glitch 7s linear infinite;
        }
        @keyframes cl-pixel-glitch {
          0%, 91.9% { opacity: 0; transform: translateX(0); }
          92%, 93.4% { opacity: 1; transform: translateX(2px); }
          93.5%, 94.9% { opacity: 1; transform: translateX(-2px); }
          95%, 95.9% { opacity: 1; transform: translateX(1px); }
          96%, 100% { opacity: 0; transform: translateX(0); }
        }

        /* Stars blink individually (delay staggered per star, inline). */
        .cl-pixel-star { animation: cl-pixel-twinkle 2.4s linear infinite; }
        @keyframes cl-pixel-twinkle {
          0%, 69.9% { opacity: 1; }
          70%, 89.9% { opacity: 0.15; }
          90%, 100% { opacity: 1; }
        }

        /* One-shot CRT power-on stutter when the card mounts. */
        .cl-pixel-card {
          animation: cl-pixel-power 0.6s linear 1 both;
        }
        @keyframes cl-pixel-power {
          0% { opacity: 0; transform: translate(0, 0); }
          12% { opacity: 0; transform: translate(0, 0); }
          13% { opacity: 1; transform: translate(1px, -1px); }
          28% { opacity: 1; transform: translate(1px, -1px); }
          29% { opacity: 0.15; transform: translate(0, 0); }
          45% { opacity: 0.15; transform: translate(0, 0); }
          46% { opacity: 1; transform: translate(-1px, 1px); }
          58% { opacity: 1; transform: translate(-1px, 1px); }
          59% { opacity: 0.35; transform: translate(1px, 0); }
          72% { opacity: 0.35; transform: translate(1px, 0); }
          73% { opacity: 1; transform: translate(0, 0); }
          100% { opacity: 1; transform: translate(0, 0); }
        }

        /* Persistent scanlines: faint dark 1px lines every 3px. */
        .cl-pixel-scanlines {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: repeating-linear-gradient(
            0deg,
            rgba(10, 5, 25, 0.28) 0,
            rgba(10, 5, 25, 0.28) 1px,
            transparent 1px,
            transparent 3px
          );
        }

        /* CRT refresh sweep: a thin light band traveling down the card. */
        .cl-pixel-sweep {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 12%;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(244, 236, 216, 0.05) 30%,
            rgba(244, 236, 216, 0.16) 55%,
            rgba(255, 233, 168, 0.22) 70%,
            transparent 100%
          );
          animation: cl-pixel-sweep 4.5s linear infinite;
        }
        @keyframes cl-pixel-sweep {
          0% { transform: translateY(-110%); opacity: 0; }
          6% { opacity: 1; }
          88% { opacity: 1; }
          100% { transform: translateY(950%); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cl-pixel-glow { animation: none; }
          .cl-pixel-card { animation: none; }
          .cl-pixel-sweep { animation: none; display: none; }
          .cl-pixel-card:hover .cl-pixel-glow { animation: none; }
          .cl-pixel-sprite { animation: none; }
          .cl-pixel-wheel { animation: none; }
          .cl-pixel-glitch { animation: none; display: none; }
          .cl-pixel-star { animation: none; }
        }
      `}</style>

      {/* Scene: the 24x36 bitmap, stretched to fill (card is exactly 2:3). */}
      <svg
        viewBox={`0 0 ${GRID_W} ${GRID_H}`}
        preserveAspectRatio="none"
        shapeRendering="crispEdges"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        aria-hidden="true"
      >
        <defs>
          {/* Horizontal band used by the screen-glitch tear. */}
          <clipPath id="cl-pixel-band">
            <rect x={0} y={bandY} width={GRID_W} height={6} />
          </clipPath>
        </defs>

        <g transform={mirrored ? `translate(${GRID_W} 0) scale(-1 1)` : undefined}>
          {/* Sky, terrain, static props. */}
          {bgCells}

          {/* The scene's actor: bobs (or spins, for the Wheel). */}
          <g className={scene.spin ? "cl-pixel-wheel" : "cl-pixel-sprite"}>
            {motionCells}
          </g>

          {/* Screen glitch: a shifted copy of the whole scene, clipped to one
              horizontal band, flashed for a split second every few seconds. */}
          <g className="cl-pixel-glitch" clipPath="url(#cl-pixel-band)">
            {bgCells}
            {motionCells}
          </g>
        </g>
      </svg>

      {/* Chrome: stepped pixel-corner frame, numeral, nameplate, stars. */}
      <svg
        viewBox="0 0 200 300"
        preserveAspectRatio="none"
        shapeRendering="crispEdges"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        role="img"
        aria-label={`${name}, tarot card ${numeral}, rendered in 8-bit pixel art`}
      >
        {/* Stepped-corner frame (two evenodd paths = thick pixel border). */}
        <path
          fillRule="evenodd"
          fill={scheme.frame}
          d="M16,0 H184 V8 H192 V16 H200 V284 H192 V292 H184 V300 H16 V292 H8 V284 H0 V16 H8 V8 H16 Z
             M24,8 H176 V16 H184 V24 H192 V276 H184 V284 H176 V292 H24 V284 H16 V276 H8 V24 H16 V16 H24 Z"
        />
        {/* Inner hairline frame for the classic RPG double border. */}
        <path
          fillRule="evenodd"
          fill={scheme.frameInner}
          d="M28,12 H172 V20 H180 V28 H188 V272 H180 V280 H172 V288 H28 V280 H20 V272 H12 V28 H20 V20 H28 Z
             M31,15 H169 V23 H177 V31 H185 V269 H177 V277 H169 V285 H31 V277 H23 V269 H15 V31 H23 V23 H31 Z"
        />

        {/* Roman numeral in blocky pixel caps, centered top. */}
        {[...numeral].map((ch, i) => (
          <PixelGlyph
            key={`${ch}-${i}`}
            ch={ch}
            x={numeralX + i * 16}
            y={18}
            px={4}
            fill={scheme.ink}
          />
        ))}

        {/* Tiny pixel stars flanking the numeral. */}
        <rect x={62} y={26} width={4} height={4} fill={pal.d} />
        <rect x={134} y={22} width={4} height={4} fill={scheme.ink} />

        {/* Nameplate: pixel-bordered cartridge label. */}
        <rect x={28} y={252} width={144} height={30} fill={scheme.plate} />
        <path
          fillRule="evenodd"
          fill={scheme.frame}
          d="M28,252 H172 V282 H28 Z M32,256 H168 V278 H32 Z"
        />
        <rect x={36} y={260} width={4} height={4} fill={scheme.accent} />
        <rect x={160} y={260} width={4} height={4} fill={scheme.accent} />
        <rect x={36} y={270} width={4} height={4} fill={scheme.accent} />
        <rect x={160} y={270} width={4} height={4} fill={scheme.accent} />
        <text
          x={100}
          y={272}
          textAnchor="middle"
          fontFamily="'Courier New', Courier, monospace"
          fontWeight="bold"
          fontSize={13}
          letterSpacing={longName ? 1 : 3}
          textLength={longName ? 132 : undefined}
          lengthAdjust={longName ? "spacingAndGlyphs" : undefined}
          fill={scheme.ink}
        >
          {name}
        </text>
      </svg>

      {/* CRT overlays: persistent scanlines + traveling refresh band. */}
      <div className="cl-pixel-scanlines" aria-hidden="true" />
      <div className="cl-pixel-sweep" aria-hidden="true" />
    </figure>
  );
}
