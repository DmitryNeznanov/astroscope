/**
 * Card Lab — PAPERCUT
 * Layered paper-cut shadow box (papercraft diorama) renderings of the Major
 * Arcana. Each card is its own scene built from stacked card-stock silhouette
 * layers inside a recessed shadow-box frame; every layer casts a soft ~25%
 * black drop-shadow onto the layer below, and edges are slightly irregular to
 * read as hand-cut. Scene layer groups reuse the shared layer/float class
 * families, so the signature effects apply to every card:
 *  - hover: exploded shadow box — layers separate vertically, deepest moving
 *    most, shadows growing as layers lift;
 *  - idle: each layer floats on its own tiny infinite translateY loop so the
 *    diorama breathes; the Hermit's crescent moon drifts across the sky;
 *  - the scene's light source flickers like a candle (lantern, wand spark,
 *    crown star, canopy star, wheel hub, banner rose, big star, sun);
 *  - on mount: one-shot settle-in — layers drop into the box, back to front.
 * Idle transforms live on nested wrapper groups (cl-papercut-f*) so they never
 * fight the hover/settle transforms on the layer groups (cl-papercut-l*).
 * Chrome: roman numeral on a hanging paper tag, card name on a torn strip.
 * variant 0-7: four craft-paper palettes, the upper four mirrored.
 * Server-component safe: no hooks, no client code.
 */

import type { ReactNode } from "react";
import { toRoman } from "@/lib/roman";

const CREAM = "#f5e8cf";
const SERIF = "Georgia, 'Times New Roman', 'Liberation Serif', serif";

interface PapercutPalette {
  skyTop: string;
  skyMid: string;
  skyBottom: string;
  mountains: string;
  midHills: string;
  nearHill: string;
  hermit: string;
  foreground: string;
  frame: string;
  frameStroke: string;
  groove: string;
  recess: string;
  glow: string;
}

/** Craft-paper schemes; index 0 is the original dusk card. */
const PALETTES: PapercutPalette[] = [
  {
    // 0 — dusk (original): plum-to-peach sky, navy figure
    skyTop: "#7c4a68", skyMid: "#c97e6d", skyBottom: "#f4bd8e",
    mountains: "#7a4a66", midHills: "#c06a47", nearHill: "#472b4d",
    hermit: "#222c4b", foreground: "#1c2540",
    frame: "#c99a6b", frameStroke: "#a87b4f", groove: "#8a6242",
    recess: "#33203a", glow: "#ffd9a0",
  },
  {
    // 1 — morning: teal-to-sand sky, sea-green ranges, slate figure
    skyTop: "#2e5f6b", skyMid: "#7fb3a0", skyBottom: "#f2e3b3",
    mountains: "#3f7a70", midHills: "#d9a05b", nearHill: "#2c4a52",
    hermit: "#1f2f3a", foreground: "#17242c",
    frame: "#c9b184", frameStroke: "#a8916a", groove: "#8a744f",
    recess: "#1d3038", glow: "#ffe9b0",
  },
  {
    // 2 — rose dawn: mauve-to-apricot sky, rust hills, aubergine figure
    skyTop: "#5b3a5e", skyMid: "#c96f8a", skyBottom: "#f7d9b0",
    mountains: "#6e4468", midHills: "#d98a5f", nearHill: "#3f2545",
    hermit: "#2b1f3d", foreground: "#211830",
    frame: "#d0a37a", frameStroke: "#ad8560", groove: "#8f6a48",
    recess: "#2e1c33", glow: "#ffd0a0",
  },
  {
    // 3 — night: indigo-to-ember sky, deep blue ranges, near-black figure
    skyTop: "#1c2340", skyMid: "#4a4a72", skyBottom: "#c98d6b",
    mountains: "#2c3352", midHills: "#a06244", nearHill: "#241f3d",
    hermit: "#141b30", foreground: "#0f1524",
    frame: "#b08a5f", frameStroke: "#93714c", groove: "#77593a",
    recess: "#141a2e", glow: "#ffdf9e",
  },
];

type SceneProps = { pal: PapercutPalette };

/** One paper layer: outer group carries hover/settle, inner carries idle float. */
function L({ n, children }: { n: 1 | 2 | 3 | 4 | 5 | 6; children: ReactNode }) {
  return (
    <g className={`cl-papercut-l${n}`}>
      <g className={`cl-papercut-f${n}`}>{children}</g>
    </g>
  );
}

/** Plain sky sheet + a few pin-prick stars, shared by the non-Hermit scenes. */
function SkyBg({ pal }: SceneProps) {
  return (
    <>
      <rect x="20" y="20" width="360" height="560" fill="url(#cl-papercut-sky)" />
      <circle cx="90" cy="90" r="2" fill={CREAM} opacity="0.85" />
      <circle cx="150" cy="150" r="1.6" fill={CREAM} opacity="0.75" />
      <circle cx="310" cy="80" r="1.8" fill={CREAM} opacity="0.8" />
      <circle cx="342" cy="176" r="1.5" fill={CREAM} opacity="0.7" />
    </>
  );
}

/** IX — The Hermit (canonical scene; do not alter). */
function HermitScene({ pal }: SceneProps) {
  return (
    <>
      <L n={1}>
        <rect x="20" y="20" width="360" height="560" fill="url(#cl-papercut-sky)" />
        <circle cx="80" cy="70" r="2" fill={CREAM} opacity="0.9" />
        <circle cx="130" cy="122" r="1.6" fill={CREAM} opacity="0.8" />
        <circle cx="250" cy="58" r="1.5" fill={CREAM} opacity="0.85" />
        <circle cx="332" cy="152" r="1.8" fill={CREAM} opacity="0.8" />
        <circle cx="62" cy="164" r="1.4" fill={CREAM} opacity="0.75" />
        <path
          d="M 348 132 L 350 137 L 355 139 L 350 141 L 348 146 L 346 141 L 341 139 L 346 137 Z"
          fill={CREAM}
          opacity="0.9"
        />
        <g className="cl-papercut-moon">
          <circle cx="300" cy="96" r="16" fill={CREAM} mask="url(#cl-papercut-moon)" />
        </g>
      </L>
      <L n={2}>
        <path
          fill={pal.mountains}
          d="M 20 580 L 20 332 L 68 244 L 94 270 L 140 212 L 176 257 L 226 196 L 259 251 L 302 216 L 338 263 L 380 232 L 380 580 Z"
        />
      </L>
      <L n={3}>
        <path
          fill={pal.midHills}
          d="M 20 580 L 20 424 C 58 398 92 394 122 406 C 152 416 172 382 202 374 C 236 366 262 390 300 398 C 332 405 358 394 380 402 L 380 580 Z"
        />
      </L>
      <L n={4}>
        <path
          fill={pal.nearHill}
          d="M 20 580 L 20 494 C 52 476 74 468 102 452 C 132 437 166 415 200 405 C 234 399 262 421 296 439 C 330 457 356 463 380 475 L 380 580 Z"
        />
      </L>
      <L n={5}>
        {/* Warm halo bleeding through the lantern cut-out (behind the figure) */}
        <circle className="cl-papercut-glow" cx="241" cy="321" r="27" fill={pal.glow} opacity="0.6" />
        <line x1="176" y1="318" x2="168" y2="408" stroke={pal.hermit} strokeWidth="4" strokeLinecap="round" />
        <path
          fill={pal.hermit}
          d="M 197 292
             C 189 294 184 301 182 309
             L 178 328
             C 174 352 171 378 170 403
             L 232 403
             C 231 386 230 370 228 354
             L 227 341
             L 244 315
             L 237 308
             L 220 329
             C 219 318 215 304 207 296
             L 203 283
             Z"
        />
        <path d="M 240 312 C 240 307 248 307 248 312" fill="none" stroke={pal.hermit} strokeWidth="2.5" />
        <rect x="234" y="312" width="14" height="19" rx="2" fill={CREAM} />
        <rect x="233" y="310" width="16" height="3" rx="1.5" fill={pal.hermit} />
        <path d="M 241 316 L 243 321 L 241 327 L 239 321 Z" fill={pal.hermit} />
      </L>
      <L n={6}>
        <path
          fill={pal.foreground}
          d="M 20 580 L 20 522 L 28 508 L 34 520 L 44 504 L 52 520
             C 90 508 120 518 155 510
             C 190 502 215 508 245 516
             C 262 520 276 505 296 501
             C 320 497 336 512 350 516
             L 358 506 L 364 518 L 372 508 L 380 518 L 380 580 Z"
        />
      </L>
    </>
  );
}

/** I — The Magician: raised wand with spark, lemniscate, table of four tools. */
function MagicianScene({ pal }: SceneProps) {
  return (
    <>
      <L n={1}>
        <SkyBg pal={pal} />
        {/* lemniscate above the head */}
        <circle cx="186" cy="150" r="10" fill="none" stroke={CREAM} strokeWidth="4" />
        <circle cx="214" cy="150" r="10" fill="none" stroke={CREAM} strokeWidth="4" />
      </L>
      <L n={3}>
        <path fill={pal.midHills} d="M 20 580 L 20 470 C 90 448 150 460 210 452 C 270 444 330 456 380 448 L 380 580 Z" />
      </L>
      <L n={5}>
        {/* wand spark */}
        <circle className="cl-papercut-glow" cx="273" cy="162" r="18" fill={pal.glow} opacity="0.6" />
        <line x1="222" y1="278" x2="258" y2="196" stroke={pal.hermit} strokeWidth="9" strokeLinecap="round" />
        <line x1="258" y1="196" x2="272" y2="166" stroke={CREAM} strokeWidth="4" strokeLinecap="round" />
        <circle cx="200" cy="252" r="17" fill={pal.hermit} />
        <path fill={pal.hermit} d="M 186 272 L 172 460 L 228 460 L 214 272 Z" />
        <rect x="181" y="316" width="38" height="7" fill={CREAM} opacity="0.85" />
        <line x1="182" y1="276" x2="148" y2="332" stroke={pal.hermit} strokeWidth="9" strokeLinecap="round" />
      </L>
      <L n={6}>
        {/* table carrying cup, sword, pentacle and wand */}
        <rect x="80" y="400" width="240" height="16" rx="3" fill={pal.mountains} />
        <rect x="94" y="416" width="10" height="70" fill={pal.mountains} />
        <rect x="296" y="416" width="10" height="70" fill={pal.mountains} />
        <path d="M 118 400 A 11 11 0 0 0 140 400 Z" fill={CREAM} />
        <line x1="176" y1="372" x2="176" y2="400" stroke={CREAM} strokeWidth="3" />
        <line x1="168" y1="382" x2="184" y2="382" stroke={CREAM} strokeWidth="3" />
        <circle cx="224" cy="388" r="10" fill="none" stroke={CREAM} strokeWidth="3" />
        <path d="M 224 381 L 227 388 L 224 395 L 221 388 Z" fill={CREAM} />
        <line x1="256" y1="400" x2="278" y2="376" stroke={CREAM} strokeWidth="3" />
      </L>
    </>
  );
}

/** III — The Empress: star crown, heart shield with Venus glyph, wheat. */
function EmpressScene({ pal }: SceneProps) {
  return (
    <>
      <L n={1}><SkyBg pal={pal} /></L>
      <L n={2}>
        <path fill={pal.mountains} d="M 20 580 L 20 430 C 80 410 140 424 200 414 C 260 404 320 420 380 410 L 380 580 Z" />
      </L>
      <L n={5}>
        {/* crown star */}
        <circle className="cl-papercut-glow" cx="200" cy="210" r="20" fill={pal.glow} opacity="0.6" />
        <polygon fill={CREAM} points="176,246 182,222 192,238 200,214 208,238 218,222 224,246" />
        <circle cx="182" cy="218" r="3" fill={CREAM} />
        <circle cx="200" cy="210" r="3.5" fill={CREAM} />
        <circle cx="218" cy="218" r="3" fill={CREAM} />
        <circle cx="200" cy="262" r="16" fill={pal.hermit} />
        <path fill={pal.hermit} d="M 186 282 C 168 320 158 380 152 470 L 248 470 C 242 380 232 320 214 282 Z" />
        {/* heart shield with Venus symbol */}
        <path fill={CREAM} d="M 200 330 C 200 320 214 320 214 332 C 214 342 200 352 200 358 C 200 352 186 342 186 332 C 186 320 200 320 200 330 Z" />
        <circle cx="200" cy="336" r="4" fill="none" stroke={pal.hermit} strokeWidth="2" />
        <line x1="200" y1="340" x2="200" y2="349" stroke={pal.hermit} strokeWidth="2" />
        <line x1="196" y1="345" x2="204" y2="345" stroke={pal.hermit} strokeWidth="2" />
      </L>
      <L n={6}>
        {/* wheat stalks leaning in the foreground */}
        {[66, 94, 306, 334].map((x, i) => {
          const lean = i % 2 === 0 ? 8 : -8;
          const top = 500 + (i % 3) * 8;
          return (
            <g key={x} stroke={CREAM} strokeWidth="3" strokeLinecap="round">
              <line x1={x} y1="580" x2={x + lean} y2={top} />
              <line x1={x + lean} y1={top + 10} x2={x + lean - 8} y2={top + 2} />
              <line x1={x + lean} y1={top + 10} x2={x + lean + 8} y2={top + 2} />
              <line x1={x + lean} y1={top + 22} x2={x + lean - 8} y2={top + 14} />
              <line x1={x + lean} y1={top + 22} x2={x + lean + 8} y2={top + 14} />
            </g>
          );
        })}
      </L>
    </>
  );
}

/** VII — The Chariot: starred canopy, boxy chariot, two sphinxes, city wall. */
function ChariotScene({ pal }: SceneProps) {
  return (
    <>
      <L n={1}><SkyBg pal={pal} /></L>
      <L n={2}>
        {/* city wall with merlons */}
        <rect x="20" y="404" width="360" height="176" fill={pal.mountains} />
        {[36, 76, 116, 244, 284, 324].map((x) => (
          <rect key={x} x={x} y="388" width="20" height="16" fill={pal.mountains} />
        ))}
      </L>
      <L n={5}>
        {/* canopy star */}
        <circle className="cl-papercut-glow" cx="200" cy="146" r="18" fill={pal.glow} opacity="0.6" />
        <path fill={pal.midHills} d="M 116 168 C 130 126 270 126 284 168 L 284 184 L 116 184 Z" />
        <path d="M 200 134 L 204 146 L 200 158 L 196 146 Z" fill={CREAM} />
        <path d="M 156 148 L 159 156 L 156 164 L 153 156 Z" fill={CREAM} />
        <path d="M 244 148 L 247 156 L 244 164 L 241 156 Z" fill={CREAM} />
        <line x1="128" y1="184" x2="128" y2="292" stroke={pal.midHills} strokeWidth="6" />
        <line x1="272" y1="184" x2="272" y2="292" stroke={pal.midHills} strokeWidth="6" />
        {/* charioteer */}
        <polygon fill={CREAM} points="188,216 194,204 200,212 206,204 212,216" />
        <circle cx="200" cy="232" r="14" fill={pal.hermit} />
        <rect x="182" y="248" width="36" height="46" rx="4" fill={pal.hermit} />
        {/* chariot box */}
        <rect x="140" y="292" width="120" height="78" rx="4" fill={pal.midHills} />
        <rect x="140" y="312" width="120" height="6" fill={CREAM} opacity="0.7" />
      </L>
      <L n={6}>
        {/* two sphinxes, one dark, one light */}
        <path fill={pal.hermit} d="M 52 536 L 52 522 C 52 494 74 478 92 478 C 104 478 110 488 110 500 L 142 500 C 156 500 162 510 162 520 L 162 536 Z" />
        <circle cx="88" cy="470" r="13" fill={pal.hermit} />
        <path fill={CREAM} d="M 238 536 L 238 522 C 238 494 260 478 278 478 C 290 478 296 488 296 500 L 328 500 C 342 500 348 510 348 520 L 348 536 Z" />
        <circle cx="274" cy="470" r="13" fill={CREAM} />
      </L>
    </>
  );
}

/** X — Wheel of Fortune: spoked wheel, sphinx above, snake and creature. */
function WheelScene({ pal }: SceneProps) {
  const pt = (r: number, deg: number): [number, number] => {
    const rad = (deg * Math.PI) / 180;
    return [200 + r * Math.cos(rad), 300 + r * Math.sin(rad)];
  };
  return (
    <>
      <L n={1}><SkyBg pal={pal} /></L>
      <L n={4}>
        {/* snake descending on the left, creature climbing on the right */}
        <path d="M 64 280 C 48 310 80 332 62 362 C 48 386 74 404 60 432" fill="none" stroke={pal.hermit} strokeWidth="7" strokeLinecap="round" />
        <path d="M 336 260 C 352 288 326 308 342 336 C 354 358 334 378 344 402" fill="none" stroke={pal.nearHill} strokeWidth="7" strokeLinecap="round" />
      </L>
      <L n={5}>
        {/* hub glow */}
        <circle className="cl-papercut-glow" cx="200" cy="300" r="22" fill={pal.glow} opacity="0.6" />
        <circle cx="200" cy="300" r="118" fill="none" stroke={pal.midHills} strokeWidth="16" />
        <circle cx="200" cy="300" r="82" fill="none" stroke={pal.midHills} strokeWidth="5" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const [x1, y1] = pt(18, deg);
          const [x2, y2] = pt(100, deg);
          return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={pal.midHills} strokeWidth="6" />;
        })}
        <circle cx="200" cy="300" r="16" fill={pal.midHills} />
        {/* symbols on the rim */}
        {[0, 90, 180, 270].map((deg) => {
          const [x, y] = pt(118, deg);
          return <path key={deg} d={`M ${x} ${y - 6} L ${x + 6} ${y} L ${x} ${y + 6} L ${x - 6} ${y} Z`} fill={CREAM} />;
        })}
        {/* small sphinx riding the top of the wheel */}
        <path fill={pal.hermit} d="M 172 182 L 172 172 C 172 154 188 142 202 142 C 212 142 218 150 218 160 L 230 160 C 236 160 240 166 240 172 L 240 182 Z" />
        <circle cx="198" cy="136" r="9" fill={pal.hermit} />
      </L>
      <L n={6}>
        <path fill={pal.foreground} d="M 20 580 L 20 524 C 100 508 300 508 380 524 L 380 580 Z" />
      </L>
    </>
  );
}

/** XIII — Death: skeletal rider, rose banner, sun rising between two towers. */
function DeathScene({ pal }: SceneProps) {
  return (
    <>
      <L n={1}>
        <SkyBg pal={pal} />
        {/* sun rising between the towers */}
        <path d="M 158 404 A 42 42 0 0 1 242 404 Z" fill={CREAM} />
      </L>
      <L n={2}>
        {/* two towers on the horizon */}
        <rect x="104" y="332" width="34" height="76" fill={pal.mountains} />
        <polygon fill={pal.mountains} points="104,332 121,312 138,332" />
        <rect x="262" y="332" width="34" height="76" fill={pal.mountains} />
        <polygon fill={pal.mountains} points="262,332 279,312 296,332" />
      </L>
      <L n={4}>
        <path fill={pal.nearHill} d="M 20 580 L 20 410 L 380 410 L 380 580 Z" />
      </L>
      <L n={5}>
        {/* banner: dark flag, white rose */}
        <line x1="112" y1="182" x2="112" y2="424" stroke={pal.hermit} strokeWidth="5" />
        <circle className="cl-papercut-glow" cx="82" cy="222" r="18" fill={pal.glow} opacity="0.6" />
        <rect x="52" y="196" width="60" height="52" rx="3" fill={pal.foreground} />
        <circle cx="82" cy="222" r="11" fill={CREAM} />
        <path d="M 82 214 L 85 222 L 82 230 L 79 222 Z" fill={pal.foreground} />
        <path d="M 74 222 L 82 219 L 90 222 L 82 225 Z" fill={pal.foreground} />
        {/* horse */}
        <path
          fill={pal.hermit}
          d="M 140 424
             C 136 390 152 368 186 364
             L 244 364
             C 260 364 270 352 280 338
             L 298 314
             C 306 304 318 306 316 318
             L 310 334
             C 304 344 294 346 286 342
             C 276 354 270 368 268 382
             L 266 424
             Z"
        />
        <rect x="154" y="420" width="9" height="66" fill={pal.hermit} />
        <rect x="186" y="420" width="9" height="66" fill={pal.hermit} />
        <rect x="230" y="420" width="9" height="66" fill={pal.hermit} />
        <rect x="256" y="420" width="9" height="66" fill={pal.hermit} />
        {/* skeletal rider */}
        <line x1="196" y1="300" x2="200" y2="364" stroke={CREAM} strokeWidth="5" strokeLinecap="round" />
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M 196 ${312 + i * 12} q 10 6 20 2`} fill="none" stroke={CREAM} strokeWidth="3" />
        ))}
        <circle cx="194" cy="288" r="12" fill={CREAM} />
        <circle cx="190" cy="286" r="2.5" fill={pal.foreground} />
        <circle cx="199" cy="286" r="2.5" fill={pal.foreground} />
        <line x1="196" y1="316" x2="150" y2="300" stroke={CREAM} strokeWidth="4" strokeLinecap="round" />
        <line x1="150" y1="300" x2="114" y2="292" stroke={CREAM} strokeWidth="4" strokeLinecap="round" />
      </L>
      <L n={6}>
        <path fill={pal.foreground} d="M 20 580 L 20 520 L 30 508 L 38 520 C 100 508 180 516 260 510 C 320 505 360 514 380 510 L 380 580 Z" />
      </L>
    </>
  );
}

/** XVII — The Star: kneeling figure with two jugs beneath eight stars. */
function StarScene({ pal }: SceneProps) {
  const small: Array<[number, number]> = [
    [96, 70], [140, 44], [260, 44], [304, 70], [80, 140], [320, 140], [200, 196],
  ];
  return (
    <>
      <L n={1}>
        <SkyBg pal={pal} />
        {/* one large eight-pointed star, seven small */}
        <circle className="cl-papercut-glow" cx="200" cy="128" r="34" fill={pal.glow} opacity="0.6" />
        <rect x="170" y="98" width="60" height="60" fill={CREAM} />
        <rect x="170" y="98" width="60" height="60" fill={CREAM} transform="rotate(45 200 128)" />
        {small.map(([x, y]) => (
          <path key={`${x}-${y}`} d={`M ${x} ${y - 9} L ${x + 4} ${y} L ${x} ${y + 9} L ${x - 4} ${y} Z`} fill={CREAM} />
        ))}
      </L>
      <L n={4}>
        {/* land with a still pool */}
        <path fill={pal.nearHill} d="M 20 580 L 20 468 C 90 450 160 462 230 454 C 290 448 340 458 380 452 L 380 580 Z" />
        <ellipse cx="296" cy="526" rx="66" ry="24" fill={pal.skyBottom} />
      </L>
      <L n={5}>
        {/* kneeling figure pouring from two jugs */}
        <circle cx="168" cy="392" r="13" fill={pal.hermit} />
        <path fill={pal.hermit} d="M 158 406 C 148 428 146 448 152 462 L 196 466 C 200 446 196 424 184 408 Z" />
        <path fill={pal.hermit} d="M 152 462 L 124 496 L 158 500 L 176 470 Z" />
        <line x1="180" y1="470" x2="212" y2="502" stroke={pal.hermit} strokeWidth="8" strokeLinecap="round" />
        <line x1="160" y1="416" x2="130" y2="436" stroke={pal.hermit} strokeWidth="7" strokeLinecap="round" />
        <path fill={CREAM} d="M 112 430 a 10 10 0 0 0 18 8 l -6 -16 Z" />
        <path d="M 116 448 C 110 466 108 482 110 496" fill="none" stroke={CREAM} strokeWidth="3" />
        <line x1="184" y1="420" x2="218" y2="442" stroke={pal.hermit} strokeWidth="7" strokeLinecap="round" />
        <path fill={CREAM} d="M 220 434 a 10 10 0 0 1 6 18 l -16 -6 Z" />
        <path d="M 230 452 C 240 470 250 486 264 500" fill="none" stroke={CREAM} strokeWidth="3" />
      </L>
      <L n={6}>
        <path fill={pal.foreground} d="M 20 580 L 20 540 C 90 528 160 536 240 530 C 300 526 350 534 380 530 L 380 580 Z" />
      </L>
    </>
  );
}

/** XXII — The Fool: profile figure stepping to a cliff edge, dog, sun. */
function FoolScene({ pal }: SceneProps) {
  return (
    <>
      <L n={1}>
        <SkyBg pal={pal} />
        {/* sun */}
        <circle className="cl-papercut-glow" cx="304" cy="112" r="30" fill={pal.glow} opacity="0.6" />
        <circle cx="304" cy="112" r="26" fill={CREAM} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <line
              key={deg}
              x1={304 + 34 * Math.cos(rad)}
              y1={112 + 34 * Math.sin(rad)}
              x2={304 + 46 * Math.cos(rad)}
              y2={112 + 46 * Math.sin(rad)}
              stroke={CREAM}
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        })}
      </L>
      <L n={3}>
        <path fill={pal.midHills} d="M 20 580 L 20 452 C 90 434 160 446 230 438 C 290 432 340 442 380 436 L 380 580 Z" />
      </L>
      <L n={5}>
        {/* figure in profile, head tilted up, bundle on a stick */}
        <circle cx="160" cy="230" r="11" fill={pal.midHills} />
        <line x1="178" y1="282" x2="164" y2="240" stroke={pal.hermit} strokeWidth="4" strokeLinecap="round" />
        <circle cx="212" cy="272" r="13" fill={pal.hermit} />
        <path fill={pal.hermit} d="M 204 288 L 196 372 L 232 374 L 226 288 Z" />
        <line x1="206" y1="300" x2="178" y2="284" stroke={pal.hermit} strokeWidth="7" strokeLinecap="round" />
        <line x1="222" y1="298" x2="246" y2="278" stroke={pal.hermit} strokeWidth="7" strokeLinecap="round" />
        <line x1="204" y1="372" x2="188" y2="466" stroke={pal.hermit} strokeWidth="8" strokeLinecap="round" />
        <line x1="226" y1="374" x2="254" y2="462" stroke={pal.hermit} strokeWidth="8" strokeLinecap="round" />
      </L>
      <L n={6}>
        {/* cliff plateau with a sheer drop on the right; small dog at the heels */}
        <path
          fill={pal.foreground}
          d="M 20 580 L 20 486 L 236 482 C 254 480 266 470 272 450 L 280 450 L 284 580 Z"
        />
        <path fill={pal.hermit} d="M 118 468 C 116 452 128 444 138 446 L 144 436 L 151 442 C 157 447 157 455 153 461 L 155 472 L 120 472 Z" />
        <line x1="118" y1="458" x2="108" y2="448" stroke={pal.hermit} strokeWidth="4" strokeLinecap="round" />
      </L>
    </>
  );
}

function renderScene(number: number, pal: PapercutPalette) {
  switch (number) {
    case 1: return <MagicianScene pal={pal} />;
    case 3: return <EmpressScene pal={pal} />;
    case 7: return <ChariotScene pal={pal} />;
    case 10: return <WheelScene pal={pal} />;
    case 13: return <DeathScene pal={pal} />;
    case 17: return <StarScene pal={pal} />;
    case 22: return <FoolScene pal={pal} />;
    default: return <HermitScene pal={pal} />;
  }
}

export interface PapercutCardProps {
  /** Major Arcana number 1-22; selects the scene and the tag numeral. */
  number?: number;
  /** Card name on the torn strip; long names are compressed to fit. */
  name?: string;
  /** 0-7: palette index (0-3), plus 4 to mirror the composition. */
  variant?: number;
}

export default function PapercutCard({
  number = 9,
  name = "THE HERMIT",
  variant = 0,
}: PapercutCardProps) {
  const v = Math.max(0, Math.min(7, Math.floor(variant)));
  const pal = PALETTES[v % 4];
  const mirrored = v >= 4;

  // Numeral tag: widen the tag and shrink the type for longer numerals,
  // keeping the exact original geometry for the default "IX".
  const numeral = toRoman(number);
  const tagFontSize = numeral.length <= 2 ? 19 : numeral.length <= 3 ? 16 : 13;
  const tagWidth = numeral.length <= 2 ? 46 : numeral.length * 12 + 12;

  // Torn strip: compress over-long names with textLength so they stay inside.
  const stripFontSize = 14;
  const stripLetterSpacing = 4;
  const estimatedNameWidth = name.length * (stripFontSize * 0.6 + stripLetterSpacing);
  const stripTextWidth = 240;
  const nameCompressed = estimatedNameWidth > stripTextWidth;

  return (
    <figure
      className="cl-papercut-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
    >
      <style>{`
        .cl-papercut-card { line-height: 0; }

        /* ---- Paper layers: base drop-shadow + hover/settle transitions ---- */
        .cl-papercut-l1, .cl-papercut-l2, .cl-papercut-l3,
        .cl-papercut-l4, .cl-papercut-l5, .cl-papercut-l6,
        .cl-papercut-tag, .cl-papercut-strip {
          transition: transform 0.5s cubic-bezier(0.22, 0.9, 0.3, 1.1),
                      filter 0.5s ease;
        }
        .cl-papercut-l2, .cl-papercut-l3, .cl-papercut-l4,
        .cl-papercut-l5, .cl-papercut-l6,
        .cl-papercut-tag, .cl-papercut-strip {
          filter: drop-shadow(0 3px 2px rgba(0, 0, 0, 0.25));
        }

        /* ---- Hover: exploded shadow box, deepest layers move most ---- */
        .cl-papercut-card:hover .cl-papercut-l1 { transform: translateY(14px); }
        .cl-papercut-card:hover .cl-papercut-l2 { transform: translateY(9.5px); }
        .cl-papercut-card:hover .cl-papercut-l3 { transform: translateY(5.5px); }
        .cl-papercut-card:hover .cl-papercut-l4 { transform: translateY(1.5px); }
        .cl-papercut-card:hover .cl-papercut-l5 { transform: translateY(-2.5px); }
        .cl-papercut-card:hover .cl-papercut-l6 { transform: translateY(-6px); }
        .cl-papercut-card:hover .cl-papercut-tag { transform: translateY(-4px); }
        .cl-papercut-card:hover .cl-papercut-strip { transform: translateY(4px); }
        /* Shadows grow as the layers lift apart. */
        .cl-papercut-card:hover .cl-papercut-l2,
        .cl-papercut-card:hover .cl-papercut-l3,
        .cl-papercut-card:hover .cl-papercut-l4,
        .cl-papercut-card:hover .cl-papercut-l5,
        .cl-papercut-card:hover .cl-papercut-l6,
        .cl-papercut-card:hover .cl-papercut-tag,
        .cl-papercut-card:hover .cl-papercut-strip {
          filter: drop-shadow(0 8px 7px rgba(0, 0, 0, 0.32));
        }

        /* ---- Mount: one-shot settle-in, back layer lands first ---- */
        .cl-papercut-l1, .cl-papercut-l2, .cl-papercut-l3,
        .cl-papercut-l4, .cl-papercut-l5, .cl-papercut-l6,
        .cl-papercut-tag, .cl-papercut-strip {
          animation: cl-papercut-settle 0.35s cubic-bezier(0.3, 1.25, 0.5, 1) backwards;
        }
        .cl-papercut-l1 { --cl-papercut-drop: -16px; animation-delay: 0s; }
        .cl-papercut-l2 { --cl-papercut-drop: -14px; animation-delay: 0.035s; }
        .cl-papercut-l3 { --cl-papercut-drop: -12px; animation-delay: 0.07s; }
        .cl-papercut-l4 { --cl-papercut-drop: -10px; animation-delay: 0.105s; }
        .cl-papercut-l5 { --cl-papercut-drop: -9px;  animation-delay: 0.14s; }
        .cl-papercut-l6 { --cl-papercut-drop: -8px;  animation-delay: 0.175s; }
        .cl-papercut-tag { --cl-papercut-drop: -12px; animation-delay: 0.21s; }
        .cl-papercut-strip { --cl-papercut-drop: 12px; animation-delay: 0.25s; }
        @keyframes cl-papercut-settle {
          from { transform: translateY(var(--cl-papercut-drop, -10px)); }
          to { transform: translateY(0); }
        }

        /* ---- Idle: layers breathe on independent infinite float loops ----
           Front layers float a touch more than back ones (parallax depth);
           negative delays desynchronise the loops from first paint. */
        .cl-papercut-f1, .cl-papercut-f2, .cl-papercut-f3,
        .cl-papercut-f4, .cl-papercut-f5, .cl-papercut-f6 {
          animation: cl-papercut-breathe 6s ease-in-out infinite alternate;
        }
        .cl-papercut-f1 { --cl-papercut-float: 1px;   animation-duration: 7s;   animation-delay: -2.1s; }
        .cl-papercut-f2 { --cl-papercut-float: 1.4px; animation-duration: 6.4s; animation-delay: -4.5s; }
        .cl-papercut-f3 { --cl-papercut-float: 1.8px; animation-duration: 5.7s; animation-delay: -1.2s; }
        .cl-papercut-f4 { --cl-papercut-float: 2.2px; animation-duration: 5.1s; animation-delay: -3.4s; }
        .cl-papercut-f5 { --cl-papercut-float: 2.6px; animation-duration: 4.5s; animation-delay: -0.7s; }
        .cl-papercut-f6 { --cl-papercut-float: 3px;   animation-duration: 4s;   animation-delay: -2.8s; }
        @keyframes cl-papercut-breathe {
          from { transform: translateY(0); }
          to { transform: translateY(var(--cl-papercut-float, 2px)); }
        }

        /* ---- Idle: crescent moon drifts slowly across the Hermit's sky ---- */
        .cl-papercut-moon {
          animation: cl-papercut-moon-drift 38s ease-in-out infinite alternate;
        }
        @keyframes cl-papercut-moon-drift {
          from { transform: translateX(-14px); }
          to { transform: translateX(16px); }
        }

        /* ---- Light source: irregular candle flicker, not a sine wave ---- */
        .cl-papercut-glow {
          transform-box: fill-box;
          transform-origin: center;
          animation: cl-papercut-flicker 2.7s linear infinite;
        }
        @keyframes cl-papercut-flicker {
          0%   { opacity: 0.55; transform: scale(1); }
          6%   { opacity: 0.82; transform: scale(1.06); }
          11%  { opacity: 0.48; transform: scale(0.98); }
          19%  { opacity: 0.9;  transform: scale(1.1); }
          27%  { opacity: 0.6;  transform: scale(1.01); }
          36%  { opacity: 0.86; transform: scale(1.08); }
          44%  { opacity: 0.52; transform: scale(0.99); }
          55%  { opacity: 0.94; transform: scale(1.11); }
          63%  { opacity: 0.58; transform: scale(1); }
          74%  { opacity: 0.8;  transform: scale(1.05); }
          83%  { opacity: 0.5;  transform: scale(0.97); }
          92%  { opacity: 0.76; transform: scale(1.04); }
          100% { opacity: 0.55; transform: scale(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .cl-papercut-l1, .cl-papercut-l2, .cl-papercut-l3,
          .cl-papercut-l4, .cl-papercut-l5, .cl-papercut-l6,
          .cl-papercut-tag, .cl-papercut-strip {
            animation: none;
            transition: none;
          }
          .cl-papercut-f1, .cl-papercut-f2, .cl-papercut-f3,
          .cl-papercut-f4, .cl-papercut-f5, .cl-papercut-f6,
          .cl-papercut-moon {
            animation: none;
          }
          .cl-papercut-card:hover .cl-papercut-l1,
          .cl-papercut-card:hover .cl-papercut-l2,
          .cl-papercut-card:hover .cl-papercut-l3,
          .cl-papercut-card:hover .cl-papercut-l4,
          .cl-papercut-card:hover .cl-papercut-l5,
          .cl-papercut-card:hover .cl-papercut-l6,
          .cl-papercut-card:hover .cl-papercut-tag,
          .cl-papercut-card:hover .cl-papercut-strip {
            transform: none;
          }
          .cl-papercut-glow { animation: none; opacity: 0.65; }
        }
      `}</style>
      <svg
        viewBox="0 0 400 600"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`${name} tarot card rendered as a layered paper-cut shadow box`}
      >
        <defs>
          {/* Sky: gradient, darker overhead fading warm at the horizon. */}
          <linearGradient id="cl-papercut-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={pal.skyTop} />
            <stop offset="0.45" stopColor={pal.skyMid} />
            <stop offset="1" stopColor={pal.skyBottom} />
          </linearGradient>
          {/* Recess shade: darkens the top of the window so it reads as inset. */}
          <linearGradient id="cl-papercut-recess" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000000" stopOpacity="0.5" />
            <stop offset="1" stopColor="#000000" stopOpacity="0" />
          </linearGradient>
          <clipPath id="cl-papercut-window">
            <rect x="20" y="20" width="360" height="560" rx="6" />
          </clipPath>
          {/* Crescent moon: cream disc with an offset disc knocked out. */}
          <mask id="cl-papercut-moon">
            <circle cx="300" cy="96" r="16" fill="#ffffff" />
            <circle cx="307" cy="91" r="14" fill="#000000" />
          </mask>
        </defs>

        {/* Shadow-box frame: kraft card front with a routed inner groove. */}
        <rect x="0" y="0" width="400" height="600" rx="10" fill={pal.frame} />
        <rect x="0" y="0" width="400" height="600" rx="10" fill="none" stroke={pal.frameStroke} strokeWidth="2" />
        <rect x="14" y="14" width="372" height="572" rx="9" fill="none" stroke={pal.groove} strokeWidth="3" />
        <rect x="20" y="20" width="360" height="560" rx="6" fill={pal.recess} />

        {/* === Scene layers, clipped to the window (mirrored on variants 4-7) === */}
        <g transform={mirrored ? "translate(400 0) scale(-1 1)" : undefined}>
          <g clipPath="url(#cl-papercut-window)">
            {renderScene(number, pal)}
            {/* Recess shading: top gradient + inner edge darkening (not a layer) */}
            <rect x="20" y="20" width="360" height="80" fill="url(#cl-papercut-recess)" />
            <rect x="20" y="20" width="360" height="560" rx="6" fill="none" stroke="#000000" strokeOpacity="0.35" strokeWidth="3" />
          </g>
        </g>

        {/* Chrome — numeral on a small hanging paper tag */}
        <g className="cl-papercut-tag">
          <line x1="200" y1="22" x2="200" y2="38" stroke={pal.groove} strokeWidth="2" />
          <g transform={`rotate(${mirrored ? 2 : -2} 200 52)`}>
            <rect x={200 - tagWidth / 2} y="36" width={tagWidth} height="32" rx="3" fill={CREAM} />
            <circle cx="200" cy="42" r="2.2" fill={pal.frame} />
            <text
              x="200"
              y={tagFontSize <= 13 ? 60 : 62}
              textAnchor="middle"
              fontFamily={SERIF}
              fontSize={tagFontSize}
              letterSpacing={numeral.length <= 2 ? 2 : 1}
              fill={pal.hermit}
            >
              {numeral}
            </text>
          </g>
        </g>

        {/* Chrome — card name on a torn paper strip */}
        <g className="cl-papercut-strip">
          <polygon
            fill={CREAM}
            points="58,540 76,534 122,538 192,533 262,537 330,532 343,539 338,563 300,567 220,562 140,567 82,563 56,557"
          />
          <text
            x="200"
            y="554"
            textAnchor="middle"
            fontFamily={SERIF}
            fontSize={stripFontSize}
            letterSpacing={nameCompressed ? 1 : stripLetterSpacing}
            textLength={nameCompressed ? stripTextWidth : undefined}
            lengthAdjust={nameCompressed ? "spacingAndGlyphs" : undefined}
            fill={pal.hermit}
          >
            {name}
          </text>
        </g>
      </svg>
    </figure>
  );
}
