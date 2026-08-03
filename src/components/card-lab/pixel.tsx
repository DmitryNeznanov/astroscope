/**
 * Card Lab — PIXEL
 * 8-bit pixel-art take on THE HERMIT (IX): a tarot card pulled from a 1992
 * handheld RPG. The scene is a 24x36 logical-pixel bitmap drawn as crisp-edged
 * SVG <rect> blocks on a cartridge-purple card, with a stepped pixel-corner
 * frame, blocky rect-drawn "IX", a pixel-bordered nameplate, and checkerboard
 * dithering around the lantern's amber glow.
 * Server-component safe: no hooks, no client code.
 */

import type { ReactNode } from "react";

/** Logical-pixel palette: deep purples, one warm amber ramp, off-white. */
const PALETTE: Record<string, string> = {
  s: "#f4ecd8", // star off-white
  d: "#7a68ad", // dim star / distant sparkle
  g: "#c07f24", // glow dither, dim amber
  o: "#e09a2e", // glow dither, mid amber
  L: "#ffb52e", // lantern amber
  l: "#ffe9a8", // lantern core (the star inside)
  W: "#2d1d55", // staff
  H: "#5a4394", // hood highlight
  R: "#4a3580", // robe
  r: "#2e1f52", // robe shadow
  f: "#120a24", // face void under the hood
  b: "#e8dfc8", // beard off-white
  m: "#2a1c4e", // mountain dark
  M: "#453278", // mountain lit face
  n: "#cfc4e8", // snowcap
};

/**
 * The whole scene as a 24x36 bitmap, one char per pixel, top row first.
 * "." is transparent (shows the card's sky-purple background).
 */
const ROWS: string[] = [
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

const GRID_W = 24;
const GRID_H = 36;

/** 3x5 blocky pixel glyphs (only what the chrome needs). */
const GLYPHS: Record<string, string[]> = {
  I: ["111", "010", "010", "010", "111"],
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

export default function PixelHermitCard() {
  // Chars that belong to the hermit sprite (staff, hood, robe, face, beard,
  // lantern and its glow dither); everything else is sky/mountain background.
  const isSprite = (ch: string) => "WHRrfbLlgo".includes(ch);

  // Rasterize the bitmap into crisp rects (slight overdraw avoids hairlines),
  // split into a background layer and a sprite layer so the sprite can bob.
  const bgCells: ReactNode[] = [];
  const spriteCells: ReactNode[] = [];
  ROWS.forEach((raw, y) => {
    const row = raw.padEnd(GRID_W, ".").slice(0, GRID_W);
    [...row].forEach((ch, x) => {
      const fill = PALETTE[ch];
      if (!fill) return;
      const glow = ch === "l" || ch === "L" || ch === "o" || ch === "g";
      const star = ch === "s" || ch === "d";
      const cell = (
        <rect
          key={`${x}-${y}`}
          x={x}
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
      (isSprite(ch) ? spriteCells : bgCells).push(cell);
    });
  });

  return (
    <figure
      className="cl-pixel-card"
      style={{
        aspectRatio: "2/3",
        width: "100%",
        margin: 0,
        position: "relative",
        overflow: "hidden",
        background: "#1b1032",
      }}
    >
      <style>{`
        .cl-pixel-card { image-rendering: pixelated; }
        .cl-pixel-glow { animation: cl-pixel-flick 1.8s steps(2, end) infinite; }
        @keyframes cl-pixel-flick {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }

        /* Hover: the lantern sparkles — faster stutter + brightness boost. */
        .cl-pixel-card:hover .cl-pixel-glow {
          animation-duration: 0.45s;
          filter: brightness(1.45) saturate(1.2);
        }

        /* Idle bob: the sprite hops one logical pixel, chunky hard steps. */
        .cl-pixel-sprite { animation: cl-pixel-bob 1.5s linear infinite; }
        @keyframes cl-pixel-bob {
          0%, 49.9% { transform: translateY(0); }
          50%, 100% { transform: translateY(1px); }
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
          {/* Horizontal band (torso height) used by the screen-glitch tear. */}
          <clipPath id="cl-pixel-band">
            <rect x={0} y={13} width={GRID_W} height={6} />
          </clipPath>
        </defs>

        {/* Sky + mountain. */}
        {bgCells}

        {/* The hermit sprite: bobs like a game idle animation. */}
        <g className="cl-pixel-sprite">{spriteCells}</g>

        {/* Screen glitch: a shifted copy of the whole scene, clipped to one
            horizontal band, flashed for a split second every few seconds. */}
        <g className="cl-pixel-glitch" clipPath="url(#cl-pixel-band)">
          {bgCells}
          {spriteCells}
        </g>
      </svg>

      {/* Chrome: stepped pixel-corner frame, IX, nameplate, corner stars. */}
      <svg
        viewBox="0 0 200 300"
        preserveAspectRatio="none"
        shapeRendering="crispEdges"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        role="img"
        aria-label="The Hermit, tarot card nine, rendered in 8-bit pixel art"
      >
        {/* Stepped-corner frame (two evenodd paths = thick pixel border). */}
        <path
          fillRule="evenodd"
          fill="#8f76c9"
          d="M16,0 H184 V8 H192 V16 H200 V284 H192 V292 H184 V300 H16 V292 H8 V284 H0 V16 H8 V8 H16 Z
             M24,8 H176 V16 H184 V24 H192 V276 H184 V284 H176 V292 H24 V284 H16 V276 H8 V24 H16 V16 H24 Z"
        />
        {/* Inner hairline frame for the classic RPG double border. */}
        <path
          fillRule="evenodd"
          fill="#4a3580"
          d="M28,12 H172 V20 H180 V28 H188 V272 H180 V280 H172 V288 H28 V280 H20 V272 H12 V28 H20 V20 H28 Z
             M31,15 H169 V23 H177 V31 H185 V269 H177 V277 H169 V285 H31 V277 H23 V269 H15 V31 H23 V23 H31 Z"
        />

        {/* IX in blocky pixel caps, centered top. */}
        <PixelGlyph ch="I" x={86} y={18} px={4} fill="#f4ecd8" />
        <PixelGlyph ch="X" x={102} y={18} px={4} fill="#f4ecd8" />

        {/* Tiny pixel stars flanking the numeral. */}
        <rect x={62} y={26} width={4} height={4} fill="#7a68ad" />
        <rect x={134} y={22} width={4} height={4} fill="#f4ecd8" />

        {/* Nameplate: pixel-bordered cartridge label. */}
        <rect x={28} y={252} width={144} height={30} fill="#241847" />
        <path
          fillRule="evenodd"
          fill="#8f76c9"
          d="M28,252 H172 V282 H28 Z M32,256 H168 V278 H32 Z"
        />
        <rect x={36} y={260} width={4} height={4} fill="#ffb52e" />
        <rect x={160} y={260} width={4} height={4} fill="#ffb52e" />
        <rect x={36} y={270} width={4} height={4} fill="#ffb52e" />
        <rect x={160} y={270} width={4} height={4} fill="#ffb52e" />
        <text
          x={100}
          y={272}
          textAnchor="middle"
          fontFamily="'Courier New', Courier, monospace"
          fontWeight="bold"
          fontSize={13}
          letterSpacing={3}
          fill="#f4ecd8"
        >
          THE HERMIT
        </text>
      </svg>

      {/* CRT overlays: persistent scanlines + traveling refresh band. */}
      <div className="cl-pixel-scanlines" aria-hidden="true" />
      <div className="cl-pixel-sweep" aria-hidden="true" />
    </figure>
  );
}
