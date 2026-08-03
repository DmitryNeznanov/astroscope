/**
 * Card Lab — PIXEL
 * 8-bit pixel-art take on THE HERMIT (IX): a tarot card pulled from a 1992
 * handheld RPG. The scene is a 24x36 logical-pixel bitmap drawn as crisp-edged
 * SVG <rect> blocks on a cartridge-purple card, with a stepped pixel-corner
 * frame, blocky rect-drawn "IX", a pixel-bordered nameplate, and checkerboard
 * dithering around the lantern's amber glow.
 * Server-component safe: no hooks, no client code.
 */

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
  // Rasterize the bitmap into crisp rects (slight overdraw avoids hairlines).
  const cells = ROWS.flatMap((raw, y) => {
    const row = raw.padEnd(GRID_W, ".").slice(0, GRID_W);
    return [...row].map((ch, x) => {
      const fill = PALETTE[ch];
      if (!fill) return null;
      const glow = ch === "l" || ch === "L" || ch === "o" || ch === "g";
      return (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={1.02}
          height={1.02}
          fill={fill}
          className={glow ? "cl-pixel-glow" : undefined}
        />
      );
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
        @media (prefers-reduced-motion: reduce) {
          .cl-pixel-glow { animation: none; }
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
        {cells}
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
    </figure>
  );
}
