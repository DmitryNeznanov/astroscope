/**
 * Card Lab — Art Nouveau (Alphonse Mucha). A mini-deck: `number` selects a
 * bespoke scene in flowing bezier silhouettes, ink outlines, gold halos and
 * whiplash vines. No props = The Hermit (IX), canonical. variant 0-7:
 * four muted jewel palettes × two orientations. Server-safe, prefix cl-an-.
 */

import type { JSX } from "react";
import { toRoman } from "@/lib/roman";

const INK = "#3d2f22";
const CREAM = "#f4ecda";
const PARCHMENT = "#efe3c8";
const GOLD = "#b8933f";
const GOLD_DEEP = "#a8863a";
const GOLD_PALE = "#dcbf7a";
const SAGE = "#7d8f6d";
const SAGE_DARK = "#5f7052";
const SAGE_PALE = "#a8b597";
const TERRACOTTA = "#b0623a";
const TERRACOTTA_DARK = "#8a4a2c";
const SKIN = "#eed9b8";
const HAIR = "#5a4632";
const WATER = "#a8c0c9";

export interface ArtNouveauCardProps {
  /** Major arcana number; 1,3,7,9,10,13,17,22 get bespoke scenes, else Hermit. */
  number?: number;
  /** Card name on the ribbon (auto-fitted); defaults to the scene's name. */
  name?: string;
  /** 0-7: 0-3 = four muted jewel palettes, 4-7 = same four, mirrored. */
  variant?: number;
}

interface NouveauPalette {
  robe: string;
  robeDark: string;
  robePale: string;
  ribbon: string;
  ribbonDark: string;
  sleeve: string;
  petal: string;
  leaf: string;
  stem: string;
}

/** Muted jewel schemes; [0] is the original sage/terracotta Hermit look. */
const PALETTES: NouveauPalette[] = [
  {
    robe: SAGE, robeDark: SAGE_DARK, robePale: SAGE_PALE,
    ribbon: TERRACOTTA, ribbonDark: TERRACOTTA_DARK,
    sleeve: TERRACOTTA, petal: TERRACOTTA, leaf: SAGE, stem: SAGE_DARK,
  },
  {
    robe: "#8a6f7d", robeDark: "#6b5462", robePale: "#b39aa8",
    ribbon: SAGE, ribbonDark: SAGE_DARK,
    sleeve: GOLD_DEEP, petal: "#8a6f7d", leaf: SAGE, stem: SAGE_DARK,
  },
  {
    robe: TERRACOTTA, robeDark: TERRACOTTA_DARK, robePale: "#cf9570",
    ribbon: SAGE_DARK, ribbonDark: "#46573d",
    sleeve: GOLD_PALE, petal: GOLD_PALE, leaf: SAGE, stem: SAGE_DARK,
  },
  {
    robe: "#5f7f78", robeDark: "#48655f", robePale: "#93aca3",
    ribbon: GOLD_DEEP, ribbonDark: "#7d6428",
    sleeve: TERRACOTTA, petal: "#5f7f78", leaf: "#93aca3", stem: "#48655f",
  },
];

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

type SceneProps = { pal: NouveauPalette };
type SceneFn = (props: SceneProps) => JSX.Element;

/** n-point star path (alternating outer/inner radius, pointing up). */
function starPath(cx: number, cy: number, rO: number, rI: number, points: number): string {
  const seg: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? rO : rI;
    const a = (Math.PI * i) / points - Math.PI / 2;
    seg.push(`${i === 0 ? "M" : "L"} ${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return seg.join(" ") + " Z";
}

/** Small four-point sparkle. */
function Spark({ x, y, s, fill = GOLD_DEEP }: { x: number; y: number; s: number; fill?: string }) {
  const k = s * 0.28;
  return (
    <path
      d={`M ${x} ${y - s} L ${x + k} ${y - k} L ${x + s} ${y} L ${x + k} ${y + k} L ${x} ${y + s} L ${x - k} ${y + k} L ${x - s} ${y} L ${x - k} ${y - k} Z`}
      fill={fill}
    />
  );
}

/** Radiating spokes around a center — slowly rotating (cl-an-rays). */
function HaloRays({ cx = 200, cy = 185, r = 60, long = 92, short = 79 }: {
  cx?: number; cy?: number; r?: number; long?: number; short?: number;
}) {
  return (
    <g className="cl-an-rays">
      {Array.from({ length: 24 }).map((_, i) => {
        const isLong = i % 2 === 0;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy - r}
            x2={cx}
            y2={cy - (isLong ? long : short)}
            transform={`rotate(${i * 15} ${cx} ${cy})`}
            stroke={GOLD_DEEP}
            strokeWidth={isLong ? 2 : 1.1}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
}

function HaloDots({ cx = 200, cy = 185, r = 106 }: { cx?: number; cy?: number; r?: number }) {
  return (
    <g>
      {Array.from({ length: 36 }).map((_, i) => {
        const a = (i * 10 * Math.PI) / 180;
        return <circle key={i} cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a)} r={1.6} fill={GOLD} opacity={0.8} />;
      })}
    </g>
  );
}

/** Mucha halo: gold disk + spinning rays + inner ring + dotted orbit + breathing glow. */
function HaloDisk({ cx = 200, cy = 185, r = 96 }: { cx?: number; cy?: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={GOLD_PALE} stroke={INK} strokeWidth={1.6} />
      <HaloRays cx={cx} cy={cy} r={r * 0.625} long={r * 0.958} short={r * 0.823} />
      <circle cx={cx} cy={cy} r={r * 0.604} fill="none" stroke={GOLD_DEEP} strokeWidth={1.4} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={INK} strokeWidth={1.6} />
      <HaloDots cx={cx} cy={cy} r={r + 10} />
      <circle className="cl-an-halo-glow" cx={cx} cy={cy} r={r} fill={GOLD_PALE} opacity={0} />
    </g>
  );
}

/** Sinuous whiplash vines framing the scene (swaying). */
function Vines({ pal }: SceneProps) {
  return (
    <g>
      <g className="cl-an-vine-l">
        <g fill="none" stroke={GOLD} strokeWidth={2.4} strokeLinecap="round">
          <path d="M 70 502 C 40 420 88 380 58 300 C 38 240 78 200 60 140 C 52 112 60 92 76 84" />
          <path d="M 58 300 C 82 290 94 270 90 250" strokeWidth={1.8} />
        </g>
        <g fill={pal.leaf} stroke={INK} strokeWidth={0.8}>
          <path d="M 66 396 C 56 388 52 376 54 366 C 62 374 66 384 66 396 Z" />
          <path d="M 64 210 C 54 202 50 190 52 180 C 60 188 64 198 64 210 Z" />
        </g>
      </g>
      <g className="cl-an-vine-r">
        <g fill="none" stroke={GOLD} strokeWidth={2.4} strokeLinecap="round">
          <path d="M 330 502 C 360 420 312 380 342 300 C 362 240 322 200 340 140 C 348 112 340 92 324 84" />
          <path d="M 342 300 C 318 290 306 270 310 250" strokeWidth={1.8} />
        </g>
        <g fill={pal.leaf} stroke={INK} strokeWidth={0.8}>
          <path d="M 334 396 C 344 388 348 376 346 366 C 338 374 334 384 334 396 Z" />
          <path d="M 336 210 C 346 202 350 190 348 180 C 340 188 336 198 336 210 Z" />
        </g>
      </g>
    </g>
  );
}

/** Wheat stalk growing upward from (0,0). */
function Wheat({ pal, transform }: SceneProps & { transform: string }) {
  return (
    <g transform={transform}>
      <path d="M0 0 C-2 -30 2 -60 0 -88" fill="none" stroke={pal.stem} strokeWidth={2.4} strokeLinecap="round" />
      {[18, 36, 54, 72].map((y) => (
        <g key={y}>
          <path d={`M0 ${-y} C-8 ${-y - 4} -12 ${-y - 10} -12 ${-y - 16} C-4 ${-y - 14} 0 ${-y - 8} 0 ${-y} Z`} fill={GOLD} stroke={INK} strokeWidth={0.7} />
          <path d={`M0 ${-y} C8 ${-y - 4} 12 ${-y - 10} 12 ${-y - 16} C4 ${-y - 14} 0 ${-y - 8} 0 ${-y} Z`} fill={GOLD} stroke={INK} strokeWidth={0.7} />
        </g>
      ))}
      <path d="M0 -88 C-4 -97 -3 -106 0 -114 C3 -106 4 -97 0 -88 Z" fill={GOLD} stroke={INK} strokeWidth={0.7} />
    </g>
  );
}

/** Stylized iris sprig, drawn pointing up from (0,0); reused at the four corners. */
function IrisDef({ pal }: SceneProps) {
  return (
    <g id="cl-an-iris">
      <path d="M0 0 C-6 -10 -6 -24 0 -34 C6 -24 6 -10 0 0 Z" fill={pal.petal} stroke={INK} strokeWidth={1.2} />
      <path d="M-1 -4 C-11 -8 -17 -17 -17 -27 C-8 -24 -2 -15 -1 -4 Z" fill={GOLD_PALE} stroke={INK} strokeWidth={1} />
      <path d="M1 -4 C11 -8 17 -17 17 -27 C8 -24 2 -15 1 -4 Z" fill={GOLD_PALE} stroke={INK} strokeWidth={1} />
      <path d="M0 0 C-1 12 -1 24 0 36" fill="none" stroke={pal.stem} strokeWidth={2.4} strokeLinecap="round" />
      <path d="M0 30 C-9 26 -16 18 -18 8 C-9 12 -2 20 0 30 Z" fill={pal.leaf} stroke={INK} strokeWidth={0.8} />
      <path d="M0 34 C9 30 16 22 18 12 C9 16 2 24 0 34 Z" fill={pal.leaf} stroke={INK} strokeWidth={0.8} />
    </g>
  );
}

/* ——————————————————————————— SCENES ——————————————————————————— */

/** IX — The Hermit (canonical, unchanged). */
function HermitScene({ pal }: SceneProps) {
  return (
    <g>
      <HaloDisk />
      <path
        d="M 24 478 C 80 430 122 418 160 436 C 192 398 232 392 262 414 C 302 392 350 420 376 462 L 376 492 L 24 492 Z"
        fill={pal.robePale} stroke={INK} strokeWidth={1.4}
      />
      <path d="M 120 448 C 150 432 190 430 220 442" fill="none" stroke={pal.robeDark} strokeWidth={1.1} opacity={0.6} />
      <path d="M 250 440 C 285 428 330 436 358 458" fill="none" stroke={pal.robeDark} strokeWidth={1.1} opacity={0.6} />
      <Vines pal={pal} />
      <g fill={GOLD_DEEP}>
        <Spark x={96} y={127} s={10} />
        <Spark x={312} y={116} s={8} />
        <Spark x={330} y={256} s={6.5} />
      </g>
      <g strokeLinejoin="round">
        {/* robe silhouette + flowing folds */}
        <path
          d="M 206 152 C 222 146 240 152 248 168 C 256 184 256 200 254 214 C 262 252 268 302 274 352
             C 279 396 286 430 292 452 C 260 462 224 462 196 452 C 200 420 202 380 202 340
             C 202 300 198 250 196 216 C 194 196 196 168 206 152 Z"
          fill={pal.robe} stroke={INK} strokeWidth={2}
        />
        <g fill="none" stroke={pal.robeDark} strokeWidth={1.5} opacity={0.75}>
          <path d="M 214 250 C 218 305 220 370 216 438" />
          <path d="M 238 252 C 245 315 251 382 256 440" />
          <path d="M 205 268 C 205 325 207 385 210 432" />
          <path d="M 252 236 C 258 290 264 350 270 420" />
        </g>
        {/* face in profile + hood band + beard */}
        <path
          d="M 226 172 C 216 170 206 174 202 182 C 200 186 199 189 197 192 L 201 194 C 200 196 200 198 201 200
             C 200 202 201 204 203 206 C 207 210 214 212 220 211 C 226 210 230 206 231 200 C 232 190 231 178 226 172 Z"
          fill={SKIN} stroke={INK} strokeWidth={1.2}
        />
        <path
          d="M 206 152 C 222 144 243 150 251 167 C 255 177 255 190 251 200 C 248 208 242 214 234 217
             C 240 207 242 196 239 186 C 236 175 226 168 215 169 C 208 170 202 174 199 180 C 196 170 199 158 206 152 Z"
          fill={pal.robeDark} stroke={INK} strokeWidth={1.6}
        />
        <path d="M 206 187 C 208 186 211 186 213 187" fill="none" stroke={INK} strokeWidth={1} />
        <path
          d="M 204 204 C 197 216 194 232 197 250 C 200 242 203 236 206 230 C 205 240 206 248 209 256
             C 212 246 214 236 214 226 C 216 218 218 212 220 208 C 214 210 208 208 204 204 Z"
          fill="#e8dcc4" stroke={INK} strokeWidth={1.1}
        />
        {/* raised arm + draped sleeve + hand */}
        <path
          d="M 214 224 C 196 210 176 192 160 168 L 146 180 C 160 206 182 228 206 244 C 210 238 212 231 214 224 Z"
          fill={pal.robe} stroke={INK} strokeWidth={1.8}
        />
        <path d="M 206 236 C 190 224 172 206 158 184" fill="none" stroke={pal.sleeve} strokeWidth={1.6} />
        <path
          d="M 158 160 C 152 156 145 159 143 165 C 141 172 146 178 152 178 C 159 178 162 168 158 160 Z"
          fill={SKIN} stroke={INK} strokeWidth={1.2}
        />
        {/* lowered sleeve + curled staff + hand */}
        <path
          d="M 250 218 C 262 226 274 234 284 242 L 276 254 C 264 246 252 238 244 230 C 246 225 248 221 250 218 Z"
          fill={pal.robe} stroke={INK} strokeWidth={1.6}
        />
        <path d="M 283 244 C 288 310 292 390 296 456" fill="none" stroke={HAIR} strokeWidth={5} strokeLinecap="round" />
        <path d="M 283 244 C 276 236 278 225 287 223 C 294 221 298 228 293 234" fill="none" stroke={HAIR} strokeWidth={4} strokeLinecap="round" />
        <path
          d="M 279 234 C 285 230 292 233 293 240 C 294 247 288 252 282 250 C 276 248 275 238 279 234 Z"
          fill={SKIN} stroke={INK} strokeWidth={1.2}
        />
      </g>
      {/* lantern, aloft */}
      <circle className="cl-an-glow" cx={140} cy={141} r={30} fill={GOLD_PALE} />
      <g stroke={INK} strokeWidth={1.5}>
        <circle cx={140} cy={114} r={4.5} fill="none" />
        <path d="M 140 118 L 140 122" fill="none" />
        <path d="M 130 128 C 132 119 148 119 150 128 Z" fill={pal.ribbon} />
        <path d="M 128 130 C 128 124 152 124 152 130 L 154 152 C 154 161 126 161 126 152 Z" fill="#f7efdb" fillOpacity={0.9} />
        <path d={starPath(140, 141, 9.5, 4, 5)} fill={GOLD} strokeWidth={0.8} />
        <path d="M 128 156 C 134 159 146 159 152 156" fill="none" strokeWidth={1} />
      </g>
      {/* foreground hill */}
      <path
        d="M 24 494 C 90 462 150 456 200 470 C 260 452 330 462 376 486 L 376 508 L 24 508 Z"
        fill={pal.robe} stroke={INK} strokeWidth={1.4}
      />
      <path d="M 90 482 C 130 470 180 470 220 480" fill="none" stroke={pal.robeDark} strokeWidth={1.1} opacity={0.7} />
    </g>
  );
}

/** I — The Magician: raised wand, lemniscate, table with the four tools. */
function MagicianScene({ pal }: SceneProps) {
  return (
    <g strokeLinejoin="round">
      <HaloDisk cx={200} cy={185} r={80} />
      <Vines pal={pal} />
      {/* lemniscate above the head */}
      <path
        d="M 200 76 C 188 64 170 64 170 76 C 170 88 188 88 200 76 C 212 64 230 64 230 76 C 230 88 212 88 200 76 Z"
        fill="none" stroke={GOLD_DEEP} strokeWidth={3.5}
      />
      {/* flowing hair + face */}
      <path
        d="M 182 150 C 180 130 190 118 200 118 C 210 118 220 130 218 150 C 224 162 226 176 224 190
           C 218 178 214 166 212 156 C 208 164 192 164 188 156 C 186 166 182 178 176 190 C 174 176 176 162 182 150 Z"
        fill={HAIR} stroke={INK} strokeWidth={1.2}
      />
      <ellipse cx={200} cy={158} rx={16} ry={19} fill={SKIN} stroke={INK} strokeWidth={1.2} />
      <path d="M 191 155 C 193 154 195 154 197 155 M 203 155 C 205 154 207 154 209 155" fill="none" stroke={INK} strokeWidth={1} />
      {/* robe with belt and folds */}
      <path
        d="M 170 196 C 158 202 152 214 154 228 C 148 280 146 350 150 430 L 250 430
           C 254 350 252 280 246 228 C 248 214 242 202 230 196 C 214 188 186 188 170 196 Z"
        fill={pal.robe} stroke={INK} strokeWidth={2}
      />
      <path d="M 154 300 C 184 308 216 308 246 300" fill="none" stroke={GOLD} strokeWidth={4} />
      <g fill="none" stroke={pal.robeDark} strokeWidth={1.5} opacity={0.75}>
        <path d="M 184 316 C 182 352 182 392 184 426" />
        <path d="M 216 316 C 218 352 218 392 216 426" />
      </g>
      <path d="M 186 196 C 192 214 196 232 200 248 C 204 232 208 214 214 196 C 206 192 194 192 186 196 Z" fill={CREAM} stroke={INK} strokeWidth={1} />
      {/* raised arm with wand (glowing tip) */}
      <path
        d="M 174 202 C 156 188 138 162 126 132 L 110 142 C 120 174 140 202 164 220 C 168 214 171 208 174 202 Z"
        fill={pal.robe} stroke={INK} strokeWidth={1.8}
      />
      <circle cx={116} cy={128} r={8} fill={SKIN} stroke={INK} strokeWidth={1.2} />
      <path d="M 110 122 L 96 68" fill="none" stroke={HAIR} strokeWidth={4} strokeLinecap="round" />
      <circle className="cl-an-glow" cx={95} cy={62} r={15} fill={GOLD_PALE} />
      <Spark x={95} y={62} s={8} fill={GOLD} />
      {/* lowered arm pointing down */}
      <path
        d="M 226 202 C 240 222 248 252 250 284 L 234 290 C 230 260 222 232 214 214 C 218 210 222 206 226 202 Z"
        fill={pal.robe} stroke={INK} strokeWidth={1.8}
      />
      <path d="M 240 288 C 246 284 252 288 252 296 L 253 312 L 247 312 L 245 300 C 241 300 238 294 240 288 Z" fill={SKIN} stroke={INK} strokeWidth={1.1} />
      {/* table with the four suit tools */}
      <path d="M 92 434 C 140 424 260 424 308 434 L 308 444 C 260 434 140 434 92 444 Z" fill={pal.ribbonDark} stroke={INK} strokeWidth={1.4} />
      <path d="M 92 444 L 92 478 C 140 486 260 486 308 478 L 308 444 C 260 434 140 434 92 444 Z" fill={pal.robePale} stroke={INK} strokeWidth={1.4} />
      <g fill="none" stroke={pal.robeDark} strokeWidth={1.2} opacity={0.7}>
        <path d="M 150 442 C 148 454 148 468 150 480" />
        <path d="M 250 442 C 252 454 252 468 250 480" />
      </g>
      <g stroke={INK} strokeWidth={1.2}>
        <path d="M 118 396 C 118 410 124 416 130 416 C 136 416 142 410 142 396 Z M 130 416 L 130 423 M 122 428 C 126 423 134 423 138 428" fill={GOLD} />
        <path d="M 178 392 L 181.5 402 L 181.5 420 L 174.5 420 L 174.5 402 Z" fill="#d8d2c4" />
        <path d="M 169 420 L 187 420 M 178 420 L 178 428" fill="none" strokeWidth={2.2} />
        <circle cx={226} cy={410} r={13} fill={GOLD} />
        <path d={starPath(226, 410, 9, 4, 5)} fill="none" strokeWidth={1.2} />
        <path d="M 260 428 L 284 398" fill="none" stroke={HAIR} strokeWidth={4} strokeLinecap="round" />
        <Spark x={280} y={404} s={5} fill={pal.leaf} />
      </g>
      <path d="M 24 492 C 140 484 260 484 376 492 L 376 508 L 24 508 Z" fill={pal.robePale} stroke={INK} strokeWidth={1.2} />
    </g>
  );
}

/** III — The Empress: star crown, Venus heart shield, wheat, lush throne. */
function EmpressScene({ pal }: SceneProps) {
  return (
    <g strokeLinejoin="round">
      {/* arched throne back */}
      <path d="M 132 470 C 128 340 150 220 200 160 C 250 220 272 340 268 470 Z" fill={pal.robePale} stroke={INK} strokeWidth={1.4} />
      <path d="M 150 470 C 148 350 166 240 200 190 C 234 240 252 350 250 470" fill="none" stroke={pal.robeDark} strokeWidth={1.2} opacity={0.7} />
      <HaloDisk cx={200} cy={172} r={86} />
      <Vines pal={pal} />
      {/* hair + face */}
      <path
        d="M 180 162 C 176 138 188 124 200 124 C 212 124 224 138 220 162 C 228 180 232 204 228 230
           C 220 212 216 194 214 180 C 208 188 192 188 186 180 C 184 194 180 212 172 230 C 168 204 172 180 180 162 Z"
        fill={HAIR} stroke={INK} strokeWidth={1.2}
      />
      <ellipse cx={200} cy={162} rx={15} ry={18} fill={SKIN} stroke={INK} strokeWidth={1.2} />
      <path d="M 192 159 C 194 158 196 158 198 159 M 202 159 C 204 158 206 158 208 159" fill="none" stroke={INK} strokeWidth={1} />
      {/* star crown — center star glows */}
      <path d="M 182 128 L 218 128 L 216 141 L 184 141 Z" fill={GOLD} stroke={INK} strokeWidth={1.2} />
      <path d="M 182 128 L 188 112 L 194 126 L 200 108 L 206 126 L 212 112 L 218 128 Z" fill={GOLD} stroke={INK} strokeWidth={1.2} />
      <circle className="cl-an-glow" cx={200} cy={101} r={11} fill={GOLD_PALE} />
      <Spark x={200} y={101} s={7} fill={GOLD} />
      <Spark x={188} y={107} s={4.5} />
      <Spark x={212} y={107} s={4.5} />
      {/* gown with radiating folds */}
      <path
        d="M 168 214 C 156 224 150 240 152 258 C 142 320 134 390 132 468 L 268 468
           C 266 390 258 320 248 258 C 250 240 244 224 232 214 C 214 204 186 204 168 214 Z"
        fill={pal.robe} stroke={INK} strokeWidth={2}
      />
      <g fill="none" stroke={pal.robeDark} strokeWidth={1.5} opacity={0.75}>
        <path d="M 200 300 C 186 340 172 400 162 462" />
        <path d="M 200 300 C 200 350 200 410 200 464" />
        <path d="M 200 300 C 214 340 228 400 238 462" />
      </g>
      <path d="M 186 216 C 193 222 207 222 214 216" fill="none" stroke={GOLD} strokeWidth={2.5} />
      {/* sleeves; right hand rests on the heart shield */}
      <path d="M 234 222 C 248 244 256 272 258 300 L 244 306 C 240 280 232 254 224 236 Z" fill={pal.robe} stroke={INK} strokeWidth={1.6} />
      <circle cx={253} cy={312} r={7} fill={SKIN} stroke={INK} strokeWidth={1.1} />
      <path d="M 166 222 C 156 244 150 272 150 300 L 164 304 C 166 278 172 252 178 236 Z" fill={pal.robe} stroke={INK} strokeWidth={1.6} />
      <circle cx={156} cy={308} r={7} fill={SKIN} stroke={INK} strokeWidth={1.1} />
      {/* heart shield with Venus symbol */}
      <path
        d="M 282 356 C 262 340 252 328 252 318 C 252 309 260 304 268 306 C 274 308 279 312 282 318
           C 285 312 290 308 296 306 C 304 304 312 309 312 318 C 312 328 302 340 282 356 Z"
        fill={pal.ribbon} stroke={INK} strokeWidth={1.8}
      />
      <circle cx={282} cy={326} r={7} fill="none" stroke={CREAM} strokeWidth={2.5} />
      <path d="M 282 333 L 282 345 M 275 339 L 289 339" fill="none" stroke={CREAM} strokeWidth={2.5} />
      {/* wheat below */}
      <Wheat pal={pal} transform="translate(76 494)" />
      <Wheat pal={pal} transform="translate(104 498) rotate(7)" />
      <Wheat pal={pal} transform="translate(322 494) scale(-1 1)" />
      <Wheat pal={pal} transform="translate(296 498) rotate(-7)" />
    </g>
  );
}

/** VII — The Chariot: starred canopy, boxy chariot, sphinx pair, city wall. */
function ChariotSphinx({ fill, transform }: { fill: string; transform?: string }) {
  return (
    <g transform={transform} strokeLinejoin="round">
      {/* recumbent body, rump to the right */}
      <path d="M 64 486 C 60 460 76 446 104 444 C 136 442 158 452 164 470 L 166 486 Z" fill={fill} stroke={INK} strokeWidth={1.5} />
      {/* upright chest + front paw reaching forward */}
      <path d="M 84 486 C 80 466 82 450 90 440 L 104 444 C 100 456 100 472 102 486 Z" fill={fill} stroke={INK} strokeWidth={1.5} />
      <path d="M 92 470 C 80 472 70 478 66 486 L 118 486 C 116 476 106 470 92 470 Z" fill={fill} stroke={INK} strokeWidth={1.5} />
      {/* profile head facing outward, nemes headdress */}
      <circle cx={88} cy={430} r={12} fill={fill} stroke={INK} strokeWidth={1.5} />
      <path d="M 78 432 L 69 437 L 78 441 Z" fill={fill} stroke={INK} strokeWidth={1.2} />
      <path d="M 77 422 C 80 411 93 405 103 411 C 111 416 113 427 109 435 C 102 425 88 420 77 422 Z" fill={GOLD} stroke={INK} strokeWidth={1} />
      <circle cx={84} cy={428} r={1.6} fill={INK} />
    </g>
  );
}

function ChariotScene({ pal }: SceneProps) {
  return (
    <g strokeLinejoin="round">
      {/* city wall with battlements */}
      <rect x={24} y={306} width={352} height={30} fill={pal.robePale} stroke={INK} strokeWidth={1.4} />
      {Array.from({ length: 13 }).map((_, i) => (
        <rect key={i} x={28 + i * 28} y={292} width={16} height={14} fill={pal.robePale} stroke={INK} strokeWidth={1.2} />
      ))}
      <Vines pal={pal} />
      {/* starred canopy on posts */}
      <path d="M 104 182 L 104 308 M 296 182 L 296 308" fill="none" stroke={GOLD_DEEP} strokeWidth={4} />
      <path d="M 96 168 C 120 116 280 116 304 168 L 304 182 C 280 132 120 132 96 182 Z" fill={pal.ribbon} stroke={INK} strokeWidth={1.8} />
      <circle className="cl-an-glow" cx={200} cy={145} r={13} fill={GOLD_PALE} />
      <Spark x={200} y={145} s={8} fill={GOLD} />
      <Spark x={142} y={158} s={5.5} />
      <Spark x={258} y={158} s={5.5} />
      {/* charioteer */}
      <path d="M 188 196 L 192 182 L 197 193 L 200 180 L 203 193 L 208 182 L 212 196 Z" fill={GOLD} stroke={INK} strokeWidth={1.1} />
      <ellipse cx={200} cy={212} rx={14} ry={16} fill={SKIN} stroke={INK} strokeWidth={1.2} />
      <path d="M 193 209 C 195 208 197 208 199 209 M 201 209 C 203 208 205 208 207 209" fill="none" stroke={INK} strokeWidth={1} />
      <path d="M 172 244 C 180 232 220 232 228 244 L 232 302 L 168 302 Z" fill={pal.robe} stroke={INK} strokeWidth={1.6} />
      <path d="M 176 250 C 168 266 164 282 164 296 L 178 300 C 180 284 184 268 190 256 Z" fill={pal.robe} stroke={INK} strokeWidth={1.4} />
      <path d="M 224 250 C 232 266 236 282 236 296 L 222 300 C 220 284 216 268 210 256 Z" fill={pal.robe} stroke={INK} strokeWidth={1.4} />
      {/* reins to the sphinxes */}
      <path d="M 170 300 C 148 332 122 380 96 418 M 230 300 C 252 332 278 380 304 418" fill="none" stroke={HAIR} strokeWidth={2} />
      {/* wheel half-hidden behind the chariot box */}
      <circle cx={200} cy={398} r={24} fill={PARCHMENT} stroke={INK} strokeWidth={3} />
      <path d="M 200 374 L 200 422 M 176 398 L 224 398" fill="none" stroke={INK} strokeWidth={2} />
      {/* chariot box + emblem + wheel */}
      <path
        d="M 148 300 L 252 300 C 260 300 264 306 264 314 L 264 376 C 264 390 256 398 242 398
           L 158 398 C 144 398 136 390 136 376 L 136 314 C 136 306 140 300 148 300 Z"
        fill={pal.robe} stroke={INK} strokeWidth={2}
      />
      <path d="M 162 388 C 164 350 178 330 200 330 C 222 330 236 350 238 388" fill="none" stroke={pal.robeDark} strokeWidth={1.5} />
      <circle cx={200} cy={356} r={10} fill={GOLD} stroke={INK} strokeWidth={1.4} />
      {/* sphinx pair, one dark one light */}
      <ChariotSphinx fill={pal.robeDark} />
      <ChariotSphinx fill={pal.robePale} transform="translate(400 0) scale(-1 1)" />
      <path d="M 24 492 C 140 486 260 486 376 492" fill="none" stroke={INK} strokeWidth={1.5} />
    </g>
  );
}

/** X — Wheel of Fortune: spoked wheel, sphinx atop, snake and creature. */
function WheelScene({ pal }: SceneProps) {
  return (
    <g strokeLinejoin="round">
      <Vines pal={pal} />
      <g fill={GOLD_DEEP}>
        <Spark x={80} y={120} s={7} />
        <Spark x={330} y={140} s={6} />
      </g>
      {/* static outer rim */}
      <circle cx={200} cy={275} r={122} fill={GOLD_PALE} fillOpacity={0.25} stroke={INK} strokeWidth={3} />
      {/* rotor: spokes, inner rim, alternating rim glyphs, hub */}
      <g className="cl-an-wheel">
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i} x1={200} y1={275 - 16} x2={200} y2={275 - 92} transform={`rotate(${i * 45} 200 275)`} stroke={GOLD_DEEP} strokeWidth={3} />
        ))}
        <circle cx={200} cy={275} r={92} fill="none" stroke={GOLD_DEEP} strokeWidth={2} />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = ((i * 45 + 22.5) * Math.PI) / 180 - Math.PI / 2;
          const x = 200 + 107 * Math.cos(a);
          const y = 275 + 107 * Math.sin(a);
          return i % 2 === 0
            ? <circle key={i} cx={x} cy={y} r={5.5} fill="none" stroke={GOLD_DEEP} strokeWidth={2} />
            : <Spark key={i} x={x} y={y} s={7} />;
        })}
        <circle cx={200} cy={275} r={14} fill={GOLD} stroke={INK} strokeWidth={1.5} />
      </g>
      <circle className="cl-an-glow" cx={200} cy={275} r={22} fill={GOLD_PALE} />
      {/* sphinx atop the wheel, sword in paw */}
      <path
        d="M 178 156 C 176 140 188 130 202 130 C 200 122 206 114 216 114 C 226 114 232 122 230 132 C 240 136 244 148 240 156 Z"
        fill={pal.robeDark} stroke={INK} strokeWidth={1.5}
      />
      <path d="M 208 118 C 210 110 222 108 228 116 C 222 114 214 114 208 118 Z" fill={GOLD} stroke={INK} strokeWidth={0.9} />
      <path d="M 234 128 L 252 108 M 248 116 L 256 120" fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
      {/* snake descending at left */}
      <path d="M 104 400 C 92 368 100 340 88 312 C 80 292 86 266 76 246" fill="none" stroke={pal.stem} strokeWidth={7} strokeLinecap="round" />
      <path d="M 70 238 C 74 230 84 230 88 238 C 84 244 74 244 70 238 Z" fill={pal.stem} stroke={INK} strokeWidth={1} />
      <path d="M 78 240 L 74 250 M 78 240 L 82 250" fill="none" stroke={INK} strokeWidth={1.2} />
      {/* creature rising at right */}
      <path d="M 298 402 C 312 372 304 344 318 316 C 326 296 320 268 332 248" fill="none" stroke={pal.robe} strokeWidth={11} strokeLinecap="round" />
      <path d="M 332 248 C 326 236 330 224 340 220 L 346 210 L 350 222 C 358 226 360 238 352 246 C 346 252 336 254 332 248 Z" fill={pal.robe} stroke={INK} strokeWidth={1.4} />
      <circle cx={344} cy={234} r={1.8} fill={INK} />
      <path d="M 24 496 C 140 488 260 488 376 496 L 376 508 L 24 508 Z" fill={pal.robePale} stroke={INK} strokeWidth={1.2} />
    </g>
  );
}

/** XIII — Death: skeletal rider, rose banner, sun between two towers. */
function DeathScene({ pal }: SceneProps) {
  return (
    <g strokeLinejoin="round">
      {/* sun rising between two towers */}
      <g fill={pal.robePale} stroke={INK} strokeWidth={1.4}>
        <rect x={268} y={252} width={26} height={80} />
        <rect x={326} y={242} width={26} height={90} />
        <rect x={264} y={242} width={10} height={12} />
        <rect x={280} y={242} width={10} height={12} />
        <rect x={322} y={232} width={10} height={12} />
        <rect x={338} y={232} width={10} height={12} />
      </g>
      <path d="M 283 332 A 28 28 0 0 1 339 332 Z" fill={GOLD_PALE} stroke={INK} strokeWidth={1.4} />
      {[-60, -30, 0, 30, 60].map((a) => (
        <line key={a} x1={311} y1={297} x2={311} y2={289} transform={`rotate(${a} 311 332)`} stroke={GOLD_DEEP} strokeWidth={2.4} strokeLinecap="round" />
      ))}
      <path d="M 24 486 C 120 472 280 472 376 484 L 376 508 L 24 508 Z" fill={pal.robePale} stroke={INK} strokeWidth={1.4} />
      <Vines pal={pal} />
      {/* horse legs (behind body), one foreleg raised */}
      <g fill="none" stroke={pal.robePale} strokeWidth={8} strokeLinecap="round">
        <path d="M 170 412 C 168 434 168 456 170 476" />
        <path d="M 236 412 C 238 434 237 456 236 476" />
        <path d="M 256 408 C 260 432 260 454 258 476" />
        <path d="M 150 404 C 136 414 130 430 136 444 C 140 452 148 454 154 450" />
      </g>
      {/* horse body, neck, head, mane, tail */}
      <path
        d="M 148 386 C 142 356 166 336 204 332 C 240 328 268 340 276 362 C 281 376 279 390 272 400
           C 258 412 236 418 210 418 L 178 418 C 160 418 150 406 148 386 Z"
        fill={pal.robePale} stroke={INK} strokeWidth={1.8}
      />
      <path
        d="M 120 282 C 112 292 104 302 99 312 C 97 316 99 320 104 320 C 112 321 122 322 130 326
           C 142 336 154 350 164 362 L 176 352 C 168 336 158 318 148 302 C 140 290 130 282 120 282 Z"
        fill={pal.robePale} stroke={INK} strokeWidth={1.8}
      />
      <path d="M 118 284 L 112 270 L 127 278 Z" fill={pal.robePale} stroke={INK} strokeWidth={1.2} />
      <circle cx={110} cy={300} r={1.8} fill={INK} />
      <g fill="none" stroke={pal.robeDark} strokeWidth={2.5} strokeLinecap="round">
        <path d="M 128 288 C 140 306 152 326 162 346" />
        <path d="M 136 284 C 150 302 162 322 172 342" />
        <path d="M 274 368 C 290 382 298 406 296 432 C 294 444 290 452 286 458" />
      </g>
      {/* skeletal rider — ink-outlined bones so they read on any ground */}
      <g fill="none" strokeLinecap="round">
        {[
          { d: "M 206 330 C 204 300 204 276 206 254", w: 5 },
          { d: "M 206 266 C 196 268 190 275 190 283 M 206 266 C 216 268 222 275 222 283", w: 2.5 },
          { d: "M 206 280 C 197 282 192 288 192 295 M 206 280 C 215 282 220 288 220 295", w: 2.5 },
          { d: "M 206 294 C 198 296 194 301 194 307 M 206 294 C 214 296 218 301 218 307", w: 2.5 },
          { d: "M 206 328 C 196 336 188 344 186 354 M 186 354 C 188 366 189 376 190 386", w: 4 },
          { d: "M 206 256 C 192 260 180 262 172 260 M 172 260 C 166 248 164 236 164 224", w: 4 },
        ].map((b, i) => (
          <g key={i}>
            <path d={b.d} stroke={INK} strokeWidth={b.w + 2.2} />
            <path d={b.d} stroke={CREAM} strokeWidth={b.w} />
          </g>
        ))}
      </g>
      <circle cx={206} cy={232} r={14} fill={CREAM} stroke={INK} strokeWidth={1.5} />
      <circle cx={201} cy={230} r={2} fill={INK} />
      <circle cx={211} cy={230} r={2} fill={INK} />
      <path d="M 200 242 L 212 242" fill="none" stroke={INK} strokeWidth={1.2} />
      <circle cx={164} cy={220} r={4.5} fill={CREAM} stroke={INK} strokeWidth={1.1} />
      {/* dark banner with white rose (rose glows) */}
      <path d="M 164 240 L 164 116" fill="none" stroke={HAIR} strokeWidth={4.5} strokeLinecap="round" />
      <path d="M 164 118 C 136 110 108 116 88 110 L 88 164 C 110 158 136 166 164 158 Z" fill="#2e2620" stroke={INK} strokeWidth={1.5} />
      <circle className="cl-an-glow" cx={126} cy={138} r={17} fill={CREAM} />
      <circle cx={126} cy={138} r={11} fill={CREAM} stroke={INK} strokeWidth={1.2} />
      <path d="M 126 130 C 131 132 132 138 128 141 M 120 134 C 122 130 128 129 131 133 M 121 143 C 125 146 131 144 132 140" fill="none" stroke={INK} strokeWidth={1} />
    </g>
  );
}

/** XVII — The Star: kneeling figure, two jugs, one great star + seven small. */
function StarScene({ pal }: SceneProps) {
  return (
    <g strokeLinejoin="round">
      {/* the great eight-pointed star with spinning rays + glow */}
      <HaloRays cx={200} cy={112} r={46} long={78} short={65} />
      <circle className="cl-an-glow" cx={200} cy={112} r={50} fill={GOLD_PALE} />
      <path d={starPath(200, 112, 44, 20, 8)} fill={GOLD} stroke={INK} strokeWidth={1.5} />
      {/* seven small stars */}
      <g fill={GOLD_DEEP}>
        <Spark x={96} y={90} s={6.5} />
        <Spark x={128} y={56} s={6.5} />
        <Spark x={168} y={40} s={6.5} />
        <Spark x={232} y={40} s={6.5} />
        <Spark x={272} y={56} s={6.5} />
        <Spark x={304} y={90} s={6.5} />
        <Spark x={200} y={182} s={6.5} />
      </g>
      <Vines pal={pal} />
      {/* land mound + pool */}
      <path d="M 24 470 C 90 442 160 436 220 446 C 250 452 268 462 276 470 L 276 508 L 24 508 Z" fill={pal.robe} stroke={INK} strokeWidth={1.4} />
      <ellipse cx={292} cy={482} rx={64} ry={16} fill={pal.robePale} stroke={INK} strokeWidth={1.4} />
      <path d="M 252 480 C 270 475 314 475 332 480 M 262 488 C 278 484 306 484 322 488" fill="none" stroke={pal.robeDark} strokeWidth={1.1} opacity={0.7} />
      {/* kneeling figure, facing right */}
      <path
        d="M 196 288 C 184 296 178 312 180 330 C 176 346 170 358 160 368 C 174 366 186 358 192 346 C 196 334 200 318 202 304 Z"
        fill={HAIR} stroke={INK} strokeWidth={1.1}
      />
      {/* neck, then profile head facing right */}
      <path d="M 206 312 C 205 318 204 322 203 327 L 215 327 C 213 321 212 317 212 314 Z" fill={SKIN} stroke={INK} strokeWidth={1} />
      <path
        d="M 206 284 C 214 282 222 286 225 293 C 227 296 228 299 230 302 L 226 304 C 227 306 227 308 226 310
           C 223 315 217 317 212 316 C 206 315 201 310 200 304 C 199 296 200 287 206 284 Z"
        fill={SKIN} stroke={INK} strokeWidth={1.2}
      />
      <path
        d="M 196 322 C 188 336 184 354 186 372 C 178 392 168 416 158 442 C 180 452 214 454 240 448
           C 238 420 234 392 226 368 C 222 348 214 330 206 320 Z"
        fill={pal.robe} stroke={INK} strokeWidth={1.8}
      />
      <g fill="none" stroke={pal.robeDark} strokeWidth={1.3} opacity={0.75}>
        <path d="M 196 340 C 192 370 184 406 172 436" />
        <path d="M 210 344 C 214 376 220 410 226 442" />
      </g>
      {/* arms with tilted jugs; two water streams */}
      <path d="M 196 330 C 178 338 158 348 138 356 L 132 344 C 150 334 172 326 190 320 Z" fill={pal.robe} stroke={INK} strokeWidth={1.4} />
      <path d="M 210 332 C 224 344 238 356 250 368 L 242 378 C 230 366 218 354 206 344 Z" fill={pal.robe} stroke={INK} strokeWidth={1.4} />
      <g transform="translate(126 354) rotate(-32)">
        <path d="M0 0 C-11 2 -15 13 -11 24 C-7 32 7 32 11 24 C15 13 11 2 0 0 Z" fill={pal.ribbon} stroke={INK} strokeWidth={1.3} />
        <path d="M-4 0 C-4 -6 4 -6 4 0" fill="none" stroke={INK} strokeWidth={1.2} />
      </g>
      <circle cx={136} cy={348} r={5.5} fill={SKIN} stroke={INK} strokeWidth={1.1} />
      <g transform="translate(254 374) rotate(35)">
        <path d="M0 0 C-11 2 -15 13 -11 24 C-7 32 7 32 11 24 C15 13 11 2 0 0 Z" fill={pal.ribbon} stroke={INK} strokeWidth={1.3} />
        <path d="M-4 0 C-4 -6 4 -6 4 0" fill="none" stroke={INK} strokeWidth={1.2} />
      </g>
      <circle cx={246} cy={368} r={5.5} fill={SKIN} stroke={INK} strokeWidth={1.1} />
      <g fill="none" stroke={WATER} strokeWidth={2.6} strokeLinecap="round">
        <path d="M 114 372 C 106 396 108 426 116 454" />
        <path d="M 122 376 C 116 400 118 428 126 456" />
        <path d="M 268 394 C 276 418 280 444 282 466" />
        <path d="M 260 398 C 266 420 270 444 272 464" />
      </g>
      <Spark x={108} y={456} s={5} fill={pal.petal} />
      <Spark x={132} y={464} s={4.5} fill={pal.petal} />
    </g>
  );
}

/** XXII — The Fool: stepping toward the cliff edge, dog at heels, sun behind. */
function FoolScene({ pal }: SceneProps) {
  return (
    <g strokeLinejoin="round">
      {/* sun with spinning rays + glow */}
      <circle className="cl-an-glow" cx={280} cy={120} r={54} fill={GOLD_PALE} />
      <circle cx={280} cy={120} r={46} fill={GOLD_PALE} stroke={INK} strokeWidth={1.6} />
      <HaloRays cx={280} cy={120} r={50} long={74} short={63} />
      <circle cx={280} cy={120} r={46} fill="none" stroke={INK} strokeWidth={1.6} />
      {/* distant birds */}
      <path d="M 88 132 C 92 127 97 127 99 132 C 101 127 106 127 110 132 M 126 106 C 129 102 133 102 135 106 C 137 102 141 102 144 106" fill="none" stroke={INK} strokeWidth={1.4} />
      <Vines pal={pal} />
      {/* cliff: plateau ending in a drop */}
      <path
        d="M 24 474 C 80 452 150 442 214 434 C 248 430 276 424 296 426 C 300 452 306 482 310 508 L 24 508 Z"
        fill={pal.robe} stroke={INK} strokeWidth={1.6}
      />
      <path d="M 60 466 C 120 452 190 444 250 436" fill="none" stroke={pal.robeDark} strokeWidth={1.2} opacity={0.7} />
      {/* small dog looking up */}
      <path d="M 168 428 C 166 414 178 406 192 408 L 206 412 C 214 414 218 422 216 430 L 214 436 L 172 436 Z" fill={CREAM} stroke={INK} strokeWidth={1.2} />
      <circle cx={209} cy={402} r={8} fill={CREAM} stroke={INK} strokeWidth={1.2} />
      <path d="M 204 396 L 202 387 L 211 393 Z" fill={CREAM} stroke={INK} strokeWidth={1.1} />
      <path d="M 214 402 L 219 404" fill="none" stroke={INK} strokeWidth={1.2} />
      <path d="M 170 414 C 162 408 158 400 160 392" fill="none" stroke={CREAM} strokeWidth={3} strokeLinecap="round" />
      <path d="M 178 436 L 178 444 M 206 436 L 206 444" fill="none" stroke={CREAM} strokeWidth={3} strokeLinecap="round" />
      {/* the fool — legs mid-stride, front foot past the edge */}
      <g fill="none" stroke={pal.robeDark} strokeWidth={9} strokeLinecap="round">
        <path d="M 250 384 C 248 398 248 412 250 426" />
        <path d="M 262 382 C 272 390 284 398 294 405 C 300 409 306 412 312 414" />
      </g>
      <path d="M 244 428 L 258 428 L 256 436 L 246 436 Z" fill={HAIR} stroke={INK} strokeWidth={1.1} />
      <path d="M 308 410 L 320 416 L 314 423 L 304 418 Z" fill={HAIR} stroke={INK} strokeWidth={1.1} />
      {/* tunic with scalloped hem */}
      <path
        d="M 238 312 C 232 340 230 362 234 384 C 246 392 262 392 272 384 C 276 360 274 336 266 314 C 256 308 246 308 238 312 Z"
        fill={pal.robe} stroke={INK} strokeWidth={1.8}
      />
      <path d="M 236 382 C 242 376 248 376 252 382 C 256 376 262 376 268 381" fill="none" stroke={pal.sleeve} strokeWidth={1.6} />
      <path d="M 240 346 C 250 350 260 350 268 346" fill="none" stroke={GOLD} strokeWidth={2.5} />
      {/* neck, then head tilted up, hair flowing back */}
      <path d="M 252 292 C 251 300 250 306 249 313 L 261 313 C 259 305 258 298 258 293 Z" fill={SKIN} stroke={INK} strokeWidth={1} />
      <path
        d="M 252 264 C 242 268 236 278 236 290 C 232 300 226 308 218 314 C 230 314 240 308 246 298 C 250 288 254 276 256 270 Z"
        fill={HAIR} stroke={INK} strokeWidth={1.1}
      />
      <path
        d="M 254 268 C 262 262 272 264 277 272 C 279 275 281 277 284 279 L 280 282 C 281 285 280 288 278 290
           C 272 296 262 296 256 290 C 250 284 249 274 254 268 Z"
        fill={SKIN} stroke={INK} strokeWidth={1.2}
      />
      <path d="M 262 273 C 264 272 266 272 268 273" fill="none" stroke={INK} strokeWidth={1} />
      {/* staff over the shoulder with bundle */}
      <path d="M 228 356 L 206 238" fill="none" stroke={HAIR} strokeWidth={4.5} strokeLinecap="round" />
      <path d="M 206 238 C 194 234 184 240 182 252 C 180 262 188 270 198 268 C 208 266 212 256 210 246 Z" fill={pal.ribbon} stroke={INK} strokeWidth={1.4} />
      <path d="M 204 244 C 200 248 196 252 192 258" fill="none" stroke={INK} strokeWidth={1} />
      {/* arms */}
      <path d="M 242 318 C 236 330 231 342 228 354 L 238 360 C 242 348 246 336 250 326 Z" fill={pal.robe} stroke={INK} strokeWidth={1.4} />
      <circle cx={230} cy={356} r={6} fill={SKIN} stroke={INK} strokeWidth={1.1} />
      <path d="M 264 318 C 272 326 280 332 288 336 L 284 346 C 274 342 266 336 258 328 Z" fill={pal.robe} stroke={INK} strokeWidth={1.4} />
      <circle cx={289} cy={340} r={6} fill={SKIN} stroke={INK} strokeWidth={1.1} />
    </g>
  );
}

const SCENES: Record<number, SceneFn> = {
  1: MagicianScene,
  3: EmpressScene,
  7: ChariotScene,
  10: WheelScene,
  13: DeathScene,
  17: StarScene,
  22: FoolScene,
};

/* ——————————————————————————— CARD ——————————————————————————— */

export default function ArtNouveauHermitCard({
  number = 9,
  name,
  variant = 0,
}: ArtNouveauCardProps) {
  const n = Math.round(number);
  const Scene = SCENES[n] ?? HermitScene;
  const title = name ?? NAMES[n] ?? "THE HERMIT";
  const v = ((Math.round(variant) % 8) + 8) % 8;
  const pal = PALETTES[v % 4];
  const mirror = v >= 4;

  const numeral = toRoman(number);
  const numeralSize =
    numeral.length <= 2 ? 17 : numeral.length === 3 ? 15 : numeral.length === 4 ? 13 : 11;

  // Ribbon band spans x 56..344; names longer than ~11 chars get tightened
  // type plus SVG textLength so even 'WHEEL OF FORTUNE' fits the banner.
  const longName = title.length > 11;
  const nameSize = longName ? 14 : 17;
  const nameSpacing = longName ? 2 : 4;

  return (
    <figure
      className="cl-an-card"
      role="img"
      aria-label={`${title} tarot card in Art Nouveau style`}
      style={{ aspectRatio: "2/3", width: "100%", margin: 0, position: "relative" }}
    >
      <style>{`
        .cl-an-card { overflow: hidden; transition: transform .35s ease, box-shadow .35s ease; }
        .cl-an-card:hover { transform: translateY(-4px); box-shadow: 0 14px 28px rgba(61,47,34,.28), 0 4px 10px rgba(61,47,34,.18); }
        .cl-an-halo-glow { animation: cl-an-breathe 5s ease-in-out infinite; }
        @keyframes cl-an-breathe { 0%, 100% { opacity: .12; } 50% { opacity: .6; } }
        .cl-an-glow { animation: cl-an-pulse 4.5s ease-in-out infinite; }
        @keyframes cl-an-pulse { 0%, 100% { opacity: .35; } 50% { opacity: .8; } }
        .cl-an-rays, .cl-an-wheel { transform-box: fill-box; transform-origin: center; animation: cl-an-spin 27s linear infinite; }
        .cl-an-wheel { animation-duration: 44s; }
        @keyframes cl-an-spin { to { transform: rotate(360deg); } }
        .cl-an-vine-l, .cl-an-vine-r { transform-box: fill-box; transform-origin: 50% 100%; }
        .cl-an-vine-l { animation: cl-an-sway-l 5.6s ease-in-out infinite; }
        .cl-an-vine-r { animation: cl-an-sway-r 6.7s ease-in-out -2.2s infinite; }
        @keyframes cl-an-sway-l { 0%, 100% { transform: rotate(-1.8deg); } 50% { transform: rotate(1.8deg); } }
        @keyframes cl-an-sway-r { 0%, 100% { transform: rotate(1.5deg); } 50% { transform: rotate(-1.5deg); } }
        .cl-an-ribbon { transform-box: fill-box; transform-origin: center; animation: cl-an-wave 6.2s ease-in-out infinite; }
        @keyframes cl-an-wave { 0%, 100% { transform: translateY(0) skewX(0deg); } 30% { transform: translateY(-1.6px) skewX(-1deg); } 65% { transform: translateY(1.2px) skewX(.8deg); } }
        .cl-an-shine {
          position: absolute; top: -25%; bottom: -25%; left: 0; width: 45%; pointer-events: none;
          background: linear-gradient(105deg, rgba(220,191,122,0) 0%, rgba(220,191,122,.38) 42%, rgba(244,236,218,.5) 50%, rgba(220,191,122,.38) 58%, rgba(220,191,122,0) 100%);
          transform: translateX(-160%) skewX(-12deg);
          animation: cl-an-sweep 7s ease-in-out infinite;
        }
        @keyframes cl-an-sweep { 0% { transform: translateX(-160%) skewX(-12deg); } 28%, 100% { transform: translateX(320%) skewX(-12deg); } }
        @media (prefers-reduced-motion: reduce) {
          .cl-an-glow, .cl-an-halo-glow, .cl-an-rays, .cl-an-wheel, .cl-an-vine-l, .cl-an-vine-r, .cl-an-ribbon, .cl-an-shine { animation: none; }
          .cl-an-shine { display: none; }
          .cl-an-card { transition: none; }
        }
      `}</style>
      <svg
        viewBox="0 0 400 600"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block", width: "100%", height: "100%" }}
      >
        <defs>
          <IrisDef pal={pal} />
        </defs>

        {/* ————— Ground ————— */}
        <rect x={0} y={0} width={400} height={600} fill={CREAM} />
        <rect x={24} y={24} width={352} height={552} fill={PARCHMENT} />

        {/* ————— Scene (mirrored for variants 4-7) ————— */}
        <g transform={mirror ? "translate(400 0) scale(-1 1)" : undefined}>
          <Scene pal={pal} />
        </g>

        {/* ————— Ornate border with corner irises ————— */}
        <rect x={10} y={10} width={380} height={580} fill="none" stroke={INK} strokeWidth={2.5} />
        <rect x={22} y={22} width={356} height={556} fill="none" stroke={INK} strokeWidth={1} />
        <use href="#cl-an-iris" transform="translate(52 82)" />
        <use href="#cl-an-iris" transform="translate(348 82) scale(-1 1)" />
        <use href="#cl-an-iris" transform="translate(52 520) scale(1 -1)" />
        <use href="#cl-an-iris" transform="translate(348 520) scale(-1 -1)" />

        {/* ————— Numeral medallion, top center ————— */}
        <circle cx={200} cy={32} r={21} fill={CREAM} stroke={INK} strokeWidth={2} />
        <circle cx={200} cy={32} r={15.5} fill="none" stroke={GOLD} strokeWidth={1.2} />
        <text
          x={200}
          y={32 + numeralSize * 0.38}
          textAnchor="middle"
          fontFamily="Georgia, 'Iowan Old Style', 'Times New Roman', serif"
          fontSize={numeralSize}
          fontWeight={700}
          fill={INK}
        >
          {numeral}
        </text>
        <path d="M 168 32 C 160 28 154 22 152 14 C 160 18 166 24 168 32 Z" fill={pal.leaf} stroke={INK} strokeWidth={0.8} />
        <path d="M 232 32 C 240 28 246 22 248 14 C 240 18 234 24 232 32 Z" fill={pal.leaf} stroke={INK} strokeWidth={0.8} />

        {/* ————— Ribbon banner with title (undulating) ————— */}
        <g className="cl-an-ribbon">
          <path d="M 56 514 L 36 505 L 45 531 L 36 557 L 56 548 Z" fill={pal.ribbonDark} stroke={INK} strokeWidth={1.4} />
          <path d="M 344 514 L 364 505 L 355 531 L 364 557 L 344 548 Z" fill={pal.ribbonDark} stroke={INK} strokeWidth={1.4} />
          <path
            d="M 56 514 C 120 502 280 502 344 514 L 344 548 C 280 536 120 536 56 548 Z"
            fill={pal.ribbon}
            stroke={INK}
            strokeWidth={1.8}
          />
          <text
            x={200}
            y={536}
            textAnchor="middle"
            fontFamily="Georgia, 'Iowan Old Style', 'Times New Roman', serif"
            fontSize={nameSize}
            letterSpacing={nameSpacing}
            fill={CREAM}
            textLength={longName ? 272 : undefined}
            lengthAdjust={longName ? "spacingAndGlyphs" : undefined}
          >
            {title}
          </text>
        </g>
      </svg>
      <div className="cl-an-shine" aria-hidden="true" />
    </figure>
  );
}
