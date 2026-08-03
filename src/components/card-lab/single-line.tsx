import type { CSSProperties } from "react";
import { toRoman } from "@/lib/roman";

/**
 * Card Lab — SINGLE LINE
 *
 * Each arcana is drawn as a continuous one-line illustration: the whole
 * scene is a single unbroken SVG path, dark ink on warm white paper.
 * The stroke doubles back on itself deliberately the way continuous-line
 * art does. The only second element on each card is a soft gold radial
 * glow at that scene's light source (the Hermit's lantern, the
 * Magician's wand tip, the Fool's sun, ...). Gallery-minimal chrome:
 * hairline frame, small serif numeral, letterspaced tiny caps.
 *
 * Props: { number, name, variant }. Called with no props it renders the
 * original Hermit card exactly. number selects the scene (1 Magician,
 * 3 Empress, 7 Chariot, 9 Hermit, 10 Wheel of Fortune, 13 Death,
 * 17 Star, 22 Fool; anything else falls back to the Hermit scene).
 * variant (0-7) picks one of four ink/paper palettes, with variants 4-7
 * mirroring the composition horizontally.
 */
export type SingleLineCardProps = {
  number?: number;
  name?: string;
  variant?: number;
};

type Palette = {
  ink: string;
  inkHover: string;
  paper: string;
  glow: string;
  spark: string;
};

const PALETTES: Palette[] = [
  // 0 — original: dark umber ink, warm white paper, gold light
  { ink: "#2b241c", inkHover: "#120e08", paper: "#faf5ec", glow: "#dcab4a", spark: "#e3b95c" },
  // 1 — sepia study: brown ink, aged paper, copper light
  { ink: "#4a3524", inkHover: "#2c1e11", paper: "#f6efe2", glow: "#c9893b", spark: "#dda452" },
  // 2 — blueprint-adjacent: blue-black ink, cool paper, amber light
  { ink: "#1f2733", inkHover: "#0c1119", paper: "#f3f4ef", glow: "#d9a441", spark: "#e7bd60" },
  // 3 — forest: deep green ink, pale moss paper, honey light
  { ink: "#243122", inkHover: "#101a0f", paper: "#f4f3e6", glow: "#cfa03f", spark: "#dfb354" },
];

type SceneDef = {
  /** default title when no name prop is given */
  title: string;
  /** measured path length in viewBox units (drives dash timing) */
  len: number;
  /** where this scene's light source sits — the gold glow accent */
  glow: { cx: number; cy: number; r: number };
  /** the whole scene as one unbroken stroke */
  d: string;
};

// IX — The Hermit: hooded figure on a peak, lantern raised, staff.
// Drawing order: staff cap loop → down staff → back up staff → left
// shoulder → hood (small inner face dip) → right arm → lantern handle →
// tight lantern cage loops → back along arm → right robe edge → wavy hem
// → left robe edge → inner robe fold → mountain ridge → ground → right
// ridge rising back toward the figure.
const HERMIT_D = [
  "M 124 206",
  "a 7 7 0 1 1 6 -8", // small loop capping the staff
  "C 121 290 118 380 117 466", // down the staff
  "C 122 380 126 292 132 220", // back up, slightly offset
  "C 142 236 156 246 169 251", // into the left shoulder
  "C 161 216 179 191 202 189", // hood, outer left up
  "C 214 200 215 216 206 227", // dip inside: face opening
  "C 218 215 228 224 231 251", // back out, hood right down
  "C 249 243 265 227 275 211", // right arm raised
  "C 281 192 284 172 290 166", // lantern handle up
  "C 297 173 299 183 296 191", // handle down to cage
  "a 14 14 0 1 1 -1 -1", // tight cage loop
  "a 9 9 0 1 1 -1 -1", // tighter inner loop
  "c 0 7 -3 11 -7 13", // small bottom knob
  "C 268 233 254 250 242 263", // back along the arm
  "C 255 333 259 412 250 477", // long confident right robe edge
  "C 219 487 188 487 157 477", // wavy hem
  "C 149 399 152 317 169 253", // long left robe edge, closing up
  "C 188 320 199 402 196 470", // inner robe fold flowing down
  "C 158 481 106 502 58 526", // mountain ridge, down to the left
  "C 140 519 250 519 344 527", // rolling ground line
  "C 300 505 258 491 224 482", // right ridge rising toward the hermit
].join(" ");

const SCENES: Record<number, SceneDef> = {
  // I — The Magician: table with the four suit tools, robe behind it,
  // one arm raised with wand (glow at the wand tip), lemniscate overhead.
  1: {
    title: "THE MAGICIAN",
    len: 2043,
    glow: { cx: 245, cy: 122, r: 30 },
    d: "M 116 520 C 114 488 114 458 117 430 C 160 424 244 424 284 430 C 286 458 286 488 284 520 C 244 418 168 418 122 428 C 152 402 166 372 174 330 C 168 344 166 356 170 368 C 176 348 182 318 186 292 C 189 274 193 264 199 258 C 192 244 186 232 185 220 a 16 16 0 1 1 31 4 C 212 190 206 168 200 156 C 186 146 172 150 175 161 C 178 171 194 169 201 157 C 208 147 222 147 225 156 C 228 166 212 168 201 157 C 210 178 218 196 222 214 C 230 200 238 182 243 166 C 246 152 246 138 245 126 a 5 5 0 1 1 5 -6 C 250 144 251 162 247 180 C 242 204 234 232 228 258 C 236 314 240 372 234 424 C 210 418 186 418 164 424 C 150 416 138 414 128 412 C 132 402 146 402 148 410 C 149 417 139 419 134 413 C 150 410 164 408 176 406 C 184 398 190 394 196 390 C 190 402 184 408 178 412 C 196 410 210 408 222 406 C 228 396 232 390 236 384 C 231 392 226 398 222 404 C 230 408 238 408 244 406 C 250 404 258 404 264 406 a 7 7 0 1 1 8 -6 C 270 410 276 414 282 416",
  },
  // III — The Empress: flowing gown, three-point star crown (glow at the
  // crown's tallest point), heart shield with Venus glyph, wheat below.
  3: {
    title: "THE EMPRESS",
    len: 1800,
    glow: { cx: 216, cy: 100, r: 28 },
    d: "M 128 484 C 120 420 132 350 158 290 C 168 262 180 240 192 228 C 186 210 182 196 184 184 a 15 15 0 1 1 29 4 C 214 172 210 158 204 148 C 196 138 188 132 182 128 C 186 118 190 110 196 104 C 198 116 200 124 202 130 C 206 118 210 108 216 102 C 218 114 220 124 222 132 C 228 122 234 116 240 112 C 238 122 236 132 232 140 C 226 148 220 156 216 164 C 226 190 234 216 240 244 C 252 280 262 316 266 352 C 254 340 246 332 240 326 C 250 318 252 308 258 302 C 250 294 240 298 242 308 C 244 318 252 328 258 334 C 264 328 272 318 274 308 C 276 298 266 294 258 302 a 6 6 0 1 1 -1 0 C 258 318 258 322 258 326 C 254 322 262 322 262 322 C 264 340 270 400 272 470 C 230 484 180 486 140 480 C 130 476 122 472 116 468 C 114 446 112 424 114 402 C 108 396 106 388 108 382 C 114 388 116 396 114 402 C 120 396 122 388 120 382 C 122 420 126 444 126 468 C 132 440 134 416 136 396 C 130 390 128 384 130 378 C 136 384 138 390 136 396 C 140 420 142 448 140 472",
  },
  // VII — The Chariot: crenellated city wall behind, starred canopy
  // (glow at the canopy star), charioteer in a boxy chariot, two
  // sphinx-like shapes in front.
  7: {
    title: "THE CHARIOT",
    len: 1980,
    glow: { cx: 200, cy: 124, r: 26 },
    d: "M 64 266 C 74 256 84 256 94 266 C 104 256 114 256 124 266 C 134 256 144 256 154 266 C 164 256 174 256 184 266 C 194 256 204 256 214 266 C 224 256 234 256 244 266 C 254 256 264 256 274 266 C 284 256 294 256 304 266 C 314 256 324 256 334 266 C 300 250 270 236 246 224 C 242 200 241 175 242 152 C 230 143 214 139 202 138 L 200 114 C 202 122 204 123 212 124 C 204 125 202 126 200 136 C 198 126 196 125 188 124 C 196 123 198 122 200 112 C 198 122 192 132 184 138 C 172 141 162 145 156 152 C 156 176 157 202 158 226 C 170 218 184 212 196 208 C 192 198 189 190 190 182 a 12 12 0 1 1 23 3 C 214 196 214 206 212 214 C 224 224 234 238 240 254 C 244 300 246 360 244 420 C 214 428 186 428 156 420 C 154 360 154 300 158 252 C 170 246 184 242 196 240 C 180 252 168 266 158 280 C 150 430 140 440 134 452 C 124 470 130 488 148 492 C 166 494 180 488 184 476 C 186 462 182 452 174 448 C 168 456 166 466 168 476 C 180 486 194 490 206 490 C 214 480 222 470 232 466 C 248 462 262 470 264 484 C 264 494 250 500 234 498 C 222 496 214 492 210 486",
  },
  // IX — The Hermit (canonical scene, unchanged).
  9: {
    title: "THE HERMIT",
    len: 2452,
    glow: { cx: 290, cy: 192, r: 46 },
    d: HERMIT_D,
  },
  // X — Wheel of Fortune: large wheel with hub (glow) and spokes, rim
  // glyphs, small sphinx on top, snake descending the left side.
  10: {
    title: "WHEEL OF FORTUNE",
    len: 2693,
    glow: { cx: 200, cy: 290, r: 32 },
    d: "M 200 185 a 105 105 0 1 1 -1 0 C 200 225 200 250 200 278 a 12 12 0 1 1 -1 0 C 200 320 200 355 200 395 a 105 105 0 0 1 105 -105 C 250 288 160 288 95 290 a 105 105 0 0 1 105 -105 a 105 105 0 0 1 74 179 C 220 320 170 260 126 216 a 8 8 0 1 1 -1 0 C 170 200 230 200 274 216 a 8 8 0 1 1 -1 0 C 270 190 240 160 216 150 C 208 142 218 140 224 146 C 228 154 224 162 216 164 C 208 166 200 164 196 158 C 192 150 192 142 198 138 C 204 142 206 150 204 156 C 196 162 192 168 194 174 C 160 190 120 210 96 240 C 84 262 96 278 86 296 C 78 312 92 326 84 342 C 78 356 90 368 86 380 C 82 390 90 396 96 392",
  },
  // XIII — Death: skeletal rider on horseback carrying a banner with a
  // rose (glow at the rose), sun rising between two towers behind.
  13: {
    title: "DEATH",
    len: 2290,
    glow: { cx: 196, cy: 251, r: 26 },
    d: "M 288 380 C 290 420 290 460 290 500 C 296 502 306 502 312 500 C 312 460 312 420 312 382 C 306 378 296 378 292 382 C 270 396 240 408 218 418 C 212 400 188 400 182 418 L 200 390 L 200 382 L 196 396 C 176 402 160 408 144 414 C 140 390 138 370 140 350 C 134 346 126 346 122 350 C 118 380 118 420 120 460 C 126 464 134 464 138 460 C 140 440 140 428 142 416 C 150 404 158 394 166 386 C 156 374 152 362 156 352 C 164 346 174 348 178 356 C 180 346 184 340 188 338 C 196 356 206 372 218 384 C 240 392 266 396 288 394 C 300 392 308 398 308 408 C 308 434 306 464 304 492 C 298 496 292 496 288 492 C 288 470 288 450 286 434 C 264 442 240 444 220 440 C 218 458 216 476 216 494 C 210 498 204 498 200 494 C 198 472 198 452 200 436 C 190 420 184 404 180 392 C 192 380 202 366 210 352 C 214 330 216 310 214 292 C 222 296 230 296 236 292 C 228 302 220 304 214 302 C 208 282 206 270 212 262 a 10 10 0 1 1 12 0 C 206 280 194 292 184 306 C 178 280 172 250 168 224 C 192 216 218 212 242 218 C 240 236 238 254 240 272 C 216 266 190 266 166 272 C 182 250 188 242 196 244 C 202 246 204 254 198 258 C 192 260 186 256 188 250 C 164 300 162 330 164 360 C 166 374 170 386 176 396",
  },
  // XVII — The Star: big 8-pointed star (glow) + seven small stars
  // above, kneeling figure pouring water from two jugs — one stream to
  // land, one to a pool.
  17: {
    title: "THE STAR",
    len: 2578,
    glow: { cx: 200, cy: 140, r: 40 },
    d: "M 200 96 L 207 123 L 231 109 L 217 133 L 244 140 L 217 147 L 231 171 L 207 157 L 200 184 L 193 157 L 169 171 L 183 147 L 156 140 L 183 133 L 169 109 L 193 123 L 200 96 L 97 176 C 101.9 173.9 101.9 173.9 104 169 C 106.1 173.9 106.1 173.9 111 176 C 106.1 178.1 106.1 178.1 104 183 C 101.9 178.1 101.9 178.1 97 176 L 117 116 C 121.9 113.9 121.9 113.9 124 109 C 126.1 113.9 126.1 113.9 131 116 C 126.1 118.1 126.1 118.1 124 123 C 121.9 118.1 121.9 118.1 117 116 L 145 82 C 149.9 79.9 149.9 79.9 152 75 C 154.1 79.9 154.1 79.9 159 82 C 154.1 84.1 154.1 84.1 152 89 C 149.9 84.1 149.9 84.1 145 82 L 241 82 C 245.9 79.9 245.9 79.9 248 75 C 250.1 79.9 250.1 79.9 255 82 C 250.1 84.1 250.1 84.1 248 89 C 245.9 84.1 245.9 84.1 241 82 L 269 116 C 273.9 113.9 273.9 113.9 276 109 C 278.1 113.9 278.1 113.9 283 116 C 278.1 118.1 278.1 118.1 276 123 C 273.9 118.1 273.9 118.1 269 116 L 289 176 C 293.9 173.9 293.9 173.9 296 169 C 298.1 173.9 298.1 173.9 303 176 C 298.1 178.1 298.1 178.1 296 183 C 293.9 178.1 293.9 178.1 289 176 L 193 222 C 197.9 219.9 197.9 219.9 200 215 C 202.1 219.9 202.1 219.9 207 222 C 202.1 224.1 202.1 224.1 200 229 C 197.9 224.1 197.9 224.1 193 222 C 196 240 190 256 184 270 C 182 262 180 268 178 275 a 13 13 0 1 1 -1 0 C 168 306 158 336 156 366 C 150 396 152 426 160 448 C 176 460 194 464 212 460 C 206 438 202 418 204 402 C 210 370 214 340 212 312 C 224 330 238 348 250 362 C 258 356 268 356 272 364 C 274 372 268 380 258 378 C 262 392 264 408 262 424 C 260 438 258 448 256 456 C 272 462 296 458 318 466 C 340 474 346 486 330 492 C 306 498 272 496 254 486 C 244 478 250 468 264 464 C 220 420 190 400 164 384 C 150 376 138 370 128 366 C 120 360 112 362 110 370 C 110 378 118 382 126 378 C 118 392 116 406 118 420 C 120 436 126 450 134 460 C 116 476 100 490 88 502",
  },
  // XXII — The Fool: profile figure stepping toward a cliff edge, head
  // tilted up, small dog at the heels, bundle on a stick over the
  // shoulder, sun behind (glow at the sun).
  22: {
    title: "THE FOOL",
    len: 1810,
    glow: { cx: 110, cy: 150, r: 34 },
    d: "M 60 500 C 120 492 180 488 240 486 C 262 486 278 488 290 492 C 296 510 298 530 298 548 C 290 552 282 550 278 544 C 276 528 276 510 278 496 C 240 480 200 476 168 472 C 152 462 144 452 142 442 C 150 436 160 436 166 442 C 174 446 178 454 176 462 C 172 470 164 472 158 470 C 156 480 154 488 154 496 C 150 496 148 494 148 490 C 176 478 188 474 200 468 C 206 440 212 400 216 360 C 216 340 220 324 228 314 C 236 306 246 306 250 312 C 254 318 250 326 242 328 C 240 342 240 354 242 366 C 248 400 252 440 252 470 C 260 478 272 482 284 484 C 278 490 268 492 260 490 C 252 460 248 430 246 402 C 238 382 230 370 222 360 C 206 342 192 324 180 308 a 12 12 0 1 1 -1 0 C 168 294 164 288 162 282 C 146 256 128 220 116 186 C 114 182 112 177 110 172 a 22 22 0 1 1 -1 0 L 136 132 L 126 140 L 88 124 L 96 132 C 92 146 90 160 92 174",
  },
};

export default function SingleLineCard({
  number = 9,
  name,
  variant = 0,
}: SingleLineCardProps) {
  const v = ((Math.round(variant) % 8) + 8) % 8;
  const palette = PALETTES[v % 4];
  const mirrored = v >= 4;
  const scope = `cl-sline-v${v}`;
  const gradientId = `cl-sline-gold-${v}`;
  const scene = SCENES[number] ?? SCENES[9];
  const title = name ?? scene.title;

  // Dash lengths are per-scene so the draw-on and the traveling spark
  // track the actual stroke length. +48 of headroom; for the Hermit
  // this lands on the original 2500 exactly.
  const drawLen = Math.ceil(scene.len) + 48;
  const inkStyle: CSSProperties = {
    strokeDasharray: drawLen,
    strokeDashoffset: drawLen,
  };
  const sparkStyle = {
    strokeDasharray: `60 ${drawLen - 60}`,
    strokeDashoffset: 0,
    "--cl-sline-travel": `${-drawLen}`,
  } as CSSProperties;

  // Shrink the tiny-caps title for long arcana names so it always fits
  // inside the frame ("THE HERMIT" at 13px / 7px tracking is the base).
  const baseChars = 10;
  const titleScale = Math.min(1, baseChars / Math.max(title.length, 1));
  const titleSize = Math.max(8, 13 * titleScale);
  const titleTracking = Math.max(3.5, 7 * titleScale);

  return (
    <figure
      className={`cl-sline ${scope}`}
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
      aria-label={`${title} tarot card drawn as one continuous line`}
    >
      <style>{`
        /* signature effect: the single stroke draws itself on mount.
           Dash lengths come from inline per-scene styles; the class only
           runs the animation. Rules are scoped per-variant (${scope}) so
           several variants can share one gallery page without CSS
           collisions. */
        .${scope} .cl-sline-ink {
          animation: cl-sline-draw 3s ease-in-out forwards;
          transition: stroke 0.4s ease;
        }
        @keyframes cl-sline-draw {
          to { stroke-dashoffset: 0; }
        }
        /* the scene's light source fades in only after the stroke
           completes */
        .${scope} .cl-sline-glowfade {
          opacity: 0;
          animation: cl-sline-glowin 0.9s ease 3.05s forwards;
        }
        @keyframes cl-sline-glowin {
          to { opacity: 1; }
        }
        .${scope} .cl-sline-glow {
          transform-box: fill-box;
          transform-origin: center;
          animation: cl-sline-flicker 7s ease-in-out infinite;
        }
        @keyframes cl-sline-flicker {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
        /* signature idle effect: a bright spark perpetually re-traces
           the drawn line. A second copy of the path shows only a short
           60-unit dash; animating dashoffset through the dash period
           carries it along the whole stroke. */
        .${scope} .cl-sline-spark {
          opacity: 0;
          filter: drop-shadow(0 0 4px ${palette.spark});
          animation: cl-sline-sparktravel 7s linear 3.05s infinite backwards;
        }
        @keyframes cl-sline-sparktravel {
          0% { stroke-dashoffset: 0; opacity: 0; }
          4% { opacity: 1; }
          96% { opacity: 1; }
          100% { stroke-dashoffset: var(--cl-sline-travel, -2500); opacity: 0; }
        }
        /* hover: ink deepens, light source breathes */
        .${scope}:hover .cl-sline-ink {
          stroke: ${palette.inkHover};
        }
        .${scope}:hover .cl-sline-glow {
          animation: cl-sline-breathe 2.2s ease-in-out infinite;
        }
        @keyframes cl-sline-breathe {
          0%, 100% { opacity: 0.75; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @media (prefers-reduced-motion: reduce) {
          .${scope} .cl-sline-ink {
            animation: none;
            stroke-dasharray: none !important;
            stroke-dashoffset: 0 !important;
          }
          .${scope} .cl-sline-glowfade {
            animation: none;
            opacity: 1;
          }
          .${scope} .cl-sline-glow,
          .${scope}:hover .cl-sline-glow {
            animation: none;
          }
          .${scope} .cl-sline-spark {
            animation: none;
            opacity: 0;
          }
        }
      `}</style>
      <svg
        viewBox="0 0 400 600"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-hidden="true"
        style={{ display: "block", width: "100%", height: "100%" }}
      >
        <defs>
          <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={palette.glow} stopOpacity="0.65" />
            <stop offset="45%" stopColor={palette.glow} stopOpacity="0.28" />
            <stop offset="100%" stopColor={palette.glow} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* paper */}
        <rect x="0" y="0" width="400" height="600" fill={palette.paper} />

        {/* hairline gallery frame */}
        <rect
          x="18"
          y="18"
          width="364"
          height="564"
          fill="none"
          stroke={palette.ink}
          strokeWidth="1"
          opacity="0.8"
        />

        {/* numeral */}
        <text
          x="200"
          y="54"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="21"
          letterSpacing="4"
          fill={palette.ink}
        >
          {toRoman(number)}
        </text>

        {/* artwork — mirrored horizontally for variants 4-7 */}
        <g transform={mirrored ? "translate(400 0) scale(-1 1)" : undefined}>
          {/* this scene's light source — the only second element on the
              card; fades in only after the stroke has finished drawing */}
          <g className="cl-sline-glowfade">
            <circle
              className="cl-sline-glow"
              cx={scene.glow.cx}
              cy={scene.glow.cy}
              r={scene.glow.r}
              fill={`url(#${gradientId})`}
            />
          </g>

          {/* the entire scene as one unbroken ink stroke */}
          <path
            className="cl-sline-ink"
            style={inkStyle}
            d={scene.d}
            fill="none"
            stroke={palette.ink}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.92"
          />

          {/* spark: a short bright segment of the same stroke that
              perpetually travels the drawn line after the draw-on */}
          <path
            className="cl-sline-spark"
            style={sparkStyle}
            d={scene.d}
            fill="none"
            stroke={palette.spark}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            pointerEvents="none"
          />
        </g>

        {/* title */}
        <text
          x="200"
          y="564"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize={titleSize}
          letterSpacing={titleTracking}
          fill={palette.ink}
        >
          {title}
        </text>
      </svg>
    </figure>
  );
}
