/**
 * Virgo Chart — The Hermit (IX)
 *
 * An engraved plate of the Virgo constellation, the Hermit's own sign:
 * deep midnight-blue ground, gold engraving, silver stars. The Maiden is
 * drawn in fine engraved gold lines — flowing robes, spread wings, a wheat
 * stalk in her outstretched hand — her figure formed around the actual star
 * positions of the constellation (α Spica at the wheat, γ Porrima at her
 * waist, ε Vindemiatrix at her right wing tip...), each star a bright
 * silver node with a small greek-letter label. A faint Milky Way band
 * washes behind her; Coma Berenices glimmers as a small neighbor hint.
 * In the bottom corner the tiny Hermit raises his lantern toward her, its
 * glow echoing Spica's brilliance. Engraved plate frame with corner
 * rosettes, a 'VIRGO · DOMUS MERCURII' cartouche, a small 'IX' at top and
 * 'THE HERMIT' in engraved caps at the foot.
 *
 * Server-component safe: no hooks, no event handlers. All motion is CSS in
 * the scoped <style> block (prefix `cz-virgo-`), guarded by
 * prefers-reduced-motion.
 */

const SERIF = "Georgia, 'Times New Roman', 'Palatino Linotype', serif";

const GOLD = "#d4af37";
const GOLD_BRIGHT = "#f2d675";
const GOLD_DIM = "rgba(212, 175, 55, 0.55)";
const SILVER = "#c8d3e6";
const SILVER_BRIGHT = "#f0f4fb";
const INK = "#0a1028";

/* ------------------------------------------------------------------ */
/* The Maiden: engraved gold path segments, drawn on in order          */
/* ------------------------------------------------------------------ */

interface Segment {
  d: string;
  /** load-reveal delay in seconds */
  t: number;
  w?: number;
  op?: number;
}

const SEGMENTS: Segment[] = [
  // head + hair
  { t: 0.15, d: "M 238 123 C 246 123 251 130 251 139 C 251 148 245 154 238 154 C 230 154 225 148 225 139 C 225 130 230 123 238 123 Z" },
  { t: 0.3, d: "M 225 137 C 227 129 234 124 243 125 C 252 126 257 132 255 139 C 253 145 246 146 243 141" },
  // torso
  { t: 0.45, d: "M 232 154 C 227 172 216 188 211 206 C 206 238 204 268 205 298" },
  { t: 0.55, d: "M 244 154 C 250 178 246 212 232 250 C 225 272 214 288 205 298" },
  // draped sash
  { t: 0.65, d: "M 246 212 C 232 240 218 268 204 292" },
  { t: 0.7, w: 0.45, op: 0.5, d: "M 252 220 C 238 246 224 272 212 294" },
  // right wing (tip at ε Vindemiatrix)
  { t: 0.8, d: "M 238 192 C 266 158 294 148 316 152 C 320 153 322 156 320 160 C 306 178 280 194 250 204" },
  { t: 0.95, w: 0.5, op: 0.7, d: "M 246 200 C 268 184 290 172 306 168" },
  { t: 1.0, w: 0.45, op: 0.55, d: "M 252 206 C 270 194 286 186 298 182" },
  // left wing (tip toward β Zavijava, lower feather through η Zaniah)
  { t: 0.85, d: "M 228 190 C 190 156 138 150 100 176 C 94 181 91 190 94 200 C 130 208 180 210 224 206" },
  { t: 1.0, w: 0.5, op: 0.7, d: "M 222 212 C 190 226 164 240 150 252" },
  { t: 1.05, w: 0.45, op: 0.55, d: "M 224 218 C 200 232 180 244 168 254" },
  // outstretched arm through δ Auva and ζ Heze to the wheat
  { t: 1.1, d: "M 212 208 C 188 244 158 292 142 330 C 134 356 138 382 152 402 C 158 412 164 421 167 428" },
  { t: 1.2, w: 0.5, op: 0.7, d: "M 224 216 C 202 250 174 296 158 332 C 150 356 152 380 162 398" },
  // hand, wheat stem, grain ears, leaf — α Spica crowns the wheat
  { t: 1.3, d: "M 167 428 C 171 431 173 435 171 439 C 167 441 163 438 164 434" },
  { t: 1.35, d: "M 167 430 C 166 427 166 424 167 421" },
  { t: 1.4, w: 0.6, d: "M 168 421 L 160 410 M 168 421 L 168 406 M 168 421 L 176 410 M 166 415 L 161 408 M 170 415 L 175 408" },
  { t: 1.42, w: 0.5, op: 0.7, d: "M 167 428 C 158 426 152 420 150 412 C 158 414 164 420 167 428 Z" },
  // robe bell + hem
  { t: 1.2, d: "M 205 298 C 196 350 190 400 196 448" },
  { t: 1.3, d: "M 218 302 C 236 352 252 402 268 452" },
  { t: 1.4, d: "M 196 448 C 218 456 246 458 268 452" },
  // drapery folds
  { t: 1.45, w: 0.5, op: 0.6, d: "M 210 312 C 206 360 204 406 210 446" },
  { t: 1.5, w: 0.5, op: 0.6, d: "M 224 314 C 227 362 233 410 240 448" },
  { t: 1.55, w: 0.5, op: 0.6, d: "M 238 318 C 246 364 255 408 258 446" },
  // trailing scarf through μ Rijl al Awwa
  { t: 1.35, d: "M 246 210 C 272 250 290 296 300 340 C 304 364 300 384 288 396" },
  { t: 1.45, w: 0.45, op: 0.5, d: "M 252 216 C 276 254 292 296 300 336" },
];

/* ------------------------------------------------------------------ */
/* Virgo's stars: silver nodes with greek-letter labels                */
/* ------------------------------------------------------------------ */

interface Star {
  x: number;
  y: number;
  r: number;
  /** load-reveal delay in seconds */
  t: number;
  label: string;
  lx: number;
  ly: number;
  anchor: "start" | "end";
  spica?: boolean;
}

const STARS: Star[] = [
  { x: 300, y: 190, r: 2.2, t: 1.3, label: "ε Vindemiatrix", lx: 308, ly: 186, anchor: "start" },
  { x: 90, y: 210, r: 1.8, t: 1.35, label: "β Zavijava", lx: 96, ly: 226, anchor: "start" },
  { x: 150, y: 250, r: 1.6, t: 1.4, label: "η Zaniah", lx: 116, ly: 246, anchor: "end" },
  { x: 205, y: 300, r: 2.4, t: 1.25, label: "γ Porrima", lx: 214, ly: 292, anchor: "start" },
  { x: 140, y: 330, r: 1.7, t: 1.45, label: "δ Auva", lx: 132, ly: 322, anchor: "end" },
  { x: 300, y: 340, r: 1.5, t: 1.5, label: "μ Rijl al Awwa", lx: 308, ly: 336, anchor: "start" },
  { x: 246, y: 382, r: 1.6, t: 1.5, label: "ι Syrma", lx: 254, ly: 376, anchor: "start" },
  { x: 150, y: 395, r: 1.7, t: 1.5, label: "ζ Heze", lx: 142, ly: 388, anchor: "end" },
  { x: 168, y: 420, r: 3.2, t: 1.45, label: "α Spica", lx: 150, ly: 438, anchor: "end", spica: true },
];

/** Chart hairlines joining the stars (pairs of STARS indices). */
const LINKS: [number, number][] = [
  [8, 7],
  [7, 4],
  [4, 3],
  [3, 2],
  [2, 1],
  [3, 0],
  [3, 8],
  [8, 6],
  [6, 5],
];

/** Coma Berenices: faint neighbor-constellation hint, upper right. */
const COMA = {
  stars: [
    [318, 108],
    [334, 96],
    [348, 112],
    [330, 124],
  ] as [number, number][],
  links: [
    [0, 1],
    [1, 2],
    [0, 3],
  ] as [number, number][],
};

/** Deterministic faint silver field stars. */
const FIELD = Array.from({ length: 30 }, (_, i) => ({
  x: 30 + ((i * 83 + 47) % 340),
  y: 100 + ((i * 61 + 29) % 390),
  r: 0.35 + ((i * 11) % 8) / 14,
  twinkle: i % 10 === 3,
  dur: 18 + ((i * 9) % 26),
  delay: -((i * 3.1) % 14),
}));

/** Frame corners that carry star-rosette ornaments. */
const CORNERS: [number, number][] = [
  [26, 26],
  [374, 26],
  [26, 566],
  [374, 566],
];

/** Engraver's hatching between the outer and inner frame rules. */
const HATCH: [number, number, number, number][] = [];
for (let x = 48; x <= 352; x += 16) {
  HATCH.push([x, 10, x, 16], [x, 584, x, 590]);
}
for (let y = 48; y <= 544; y += 16) {
  HATCH.push([10, y, 16, y], [384, y, 390, y]);
}

export default function VirgoChartCard() {
  return (
    <figure
      className="cz-virgo-root"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
      role="img"
      aria-label="The Hermit tarot card rendered as an engraved plate of the Virgo constellation"
    >
      <style>{`
        .cz-virgo-root { position: relative; overflow: hidden; border-radius: 10px; background: ${INK}; }
        .cz-virgo-root svg { display: block; width: 100%; height: 100%; }

        /* ---- load reveal: the Maiden engraves herself, stars pop in ---- */
        .cz-virgo-draw {
          stroke-dasharray: 1;
          animation: cz-virgo-draw 0.5s ease-out both;
        }
        .cz-virgo-star {
          transform-box: fill-box;
          transform-origin: center;
          animation: cz-virgo-star-pop 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .cz-virgo-fade { animation: cz-virgo-fade-in 0.8s ease-out both; }

        @keyframes cz-virgo-draw {
          from { opacity: 0; stroke-dashoffset: 1; }
          to { opacity: 1; stroke-dashoffset: 0; }
        }
        @keyframes cz-virgo-star-pop {
          from { opacity: 0; transform: scale(0.2); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes cz-virgo-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* ---- ambient: very slow, low amplitude ---- */
        .cz-virgo-spica { animation: cz-virgo-spica 38s ease-in-out infinite; }
        @keyframes cz-virgo-spica {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 0.85; }
        }
        .cz-virgo-milky { animation: cz-virgo-milky 52s ease-in-out infinite; }
        @keyframes cz-virgo-milky {
          0%, 100% { opacity: 0.07; }
          50% { opacity: 0.13; }
        }
        .cz-virgo-lantern { animation: cz-virgo-lantern 24s ease-in-out infinite; }
        @keyframes cz-virgo-lantern {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.6; }
        }
        .cz-virgo-twinkle { animation: cz-virgo-twinkle 22s ease-in-out infinite; }
        @keyframes cz-virgo-twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.75; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cz-virgo-root *, .cz-virgo-root *::before, .cz-virgo-root *::after {
            animation: none !important;
          }
        }
      `}</style>

      <svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <radialGradient id="cz-virgo-sky" cx="50%" cy="42%" r="80%">
            <stop offset="0%" stopColor="#141d44" />
            <stop offset="50%" stopColor="#0d1430" />
            <stop offset="100%" stopColor="#060a1c" />
          </radialGradient>
          <radialGradient id="cz-virgo-silverglow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={SILVER_BRIGHT} stopOpacity="0.95" />
            <stop offset="35%" stopColor={SILVER} stopOpacity="0.35" />
            <stop offset="100%" stopColor={SILVER} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cz-virgo-goldglow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={GOLD_BRIGHT} stopOpacity="0.9" />
            <stop offset="40%" stopColor={GOLD} stopOpacity="0.3" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cz-virgo-band" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={SILVER} stopOpacity="0" />
            <stop offset="50%" stopColor={SILVER} stopOpacity="0.55" />
            <stop offset="100%" stopColor={SILVER} stopOpacity="0" />
          </linearGradient>
          <filter id="cz-virgo-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
          <filter id="cz-virgo-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.83  0 0 0 0 0.68  0 0 0 0 0.38  0 0 0 0.05 0" />
          </filter>
        </defs>

        {/* sky + paper grain */}
        <rect x="0" y="0" width="400" height="600" fill="url(#cz-virgo-sky)" />
        <rect x="0" y="0" width="400" height="600" filter="url(#cz-virgo-grain)" />

        {/* Milky Way band behind the figure — soft silver wash, shimmering */}
        <ellipse
          className="cz-virgo-milky"
          cx="200"
          cy="290"
          rx="270"
          ry="46"
          fill="url(#cz-virgo-band)"
          filter="url(#cz-virgo-blur)"
          transform="rotate(-28 200 290)"
        />
        <text className="cz-virgo-fade" style={{ animationDelay: "1.7s" }} x="66" y="168" transform="rotate(-28 66 168)" fill={SILVER} fillOpacity="0.5" fontSize="5.5" fontFamily={SERIF} fontStyle="italic" letterSpacing="2">
          VIA LACTEA
        </text>

        {/* engraved plate frame: hatched double rule + star-rosette corners */}
        <g className="cz-virgo-fade" style={{ animationDelay: "0.1s" }}>
          <rect x="10" y="10" width="380" height="580" fill="none" stroke={GOLD_DIM} strokeWidth="1.4" />
          <rect x="16" y="16" width="368" height="568" fill="none" stroke={GOLD_DIM} strokeWidth="0.5" />
          {HATCH.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={GOLD} strokeOpacity="0.22" strokeWidth="0.4" />
          ))}
          {CORNERS.map(([cx, cy], ci) => (
            <g key={ci}>
              <circle cx={cx} cy={cy} r="12" fill={INK} fillOpacity="0.7" stroke={GOLD} strokeOpacity="0.6" strokeWidth="0.8" />
              <circle cx={cx} cy={cy} r="8.5" fill="none" stroke={GOLD} strokeOpacity="0.35" strokeWidth="0.4" />
              {Array.from({ length: 8 }, (_, k) => {
                const a = (k * 45 * Math.PI) / 180;
                const len = k % 2 === 0 ? 7.5 : 4.5;
                return (
                  <line
                    key={k}
                    x1={cx}
                    y1={cy}
                    x2={cx + len * Math.cos(a)}
                    y2={cy + len * Math.sin(a)}
                    stroke={GOLD}
                    strokeOpacity="0.7"
                    strokeWidth="0.55"
                  />
                );
              })}
              <circle cx={cx} cy={cy} r="1.3" fill={GOLD_BRIGHT} />
            </g>
          ))}
        </g>

        {/* background field stars */}
        <g className="cz-virgo-fade" style={{ animationDelay: "0.5s" }}>
          {FIELD.map((s, i) => (
            <circle
              key={i}
              className={s.twinkle ? "cz-virgo-twinkle" : undefined}
              style={s.twinkle ? { animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` } : undefined}
              cx={s.x} cy={s.y} r={s.r} fill={SILVER} fillOpacity={s.twinkle ? 1 : 0.55}
            />
          ))}
        </g>

        {/* faint dashed ecliptic arc crossing the plate */}
        <g className="cz-virgo-fade" style={{ animationDelay: "0.8s" }}>
          <ellipse
            cx="200"
            cy="300"
            rx="230"
            ry="64"
            fill="none"
            stroke={GOLD}
            strokeOpacity="0.14"
            strokeWidth="0.6"
            strokeDasharray="5 4"
            transform="rotate(-24 200 300)"
          />
          <text x="298" y="430" transform="rotate(-24 298 430)" fill={GOLD} fillOpacity="0.4" fontSize="5.5" fontFamily={SERIF} letterSpacing="2">
            ECLIPTICA
          </text>
        </g>

        {/* Coma Berenices: faint neighbor hint */}
        <g className="cz-virgo-fade" style={{ animationDelay: "1.1s" }}>
          {COMA.links.map(([a, b], li) => (
            <line
              key={li}
              x1={COMA.stars[a][0]}
              y1={COMA.stars[a][1]}
              x2={COMA.stars[b][0]}
              y2={COMA.stars[b][1]}
              stroke={SILVER}
              strokeOpacity="0.2"
              strokeWidth="0.45"
              strokeDasharray="2 3"
            />
          ))}
          {COMA.stars.map(([sx, sy], si) => (
            <circle key={si} cx={sx} cy={sy} r={si === 1 ? 1.5 : 1.1} fill={SILVER} fillOpacity="0.5" />
          ))}
          <text x="312" y="88" fill={SILVER} fillOpacity="0.45" fontSize="6" fontFamily={SERIF} fontStyle="italic" letterSpacing="1.5">
            COMA BERENICES
          </text>
        </g>

        {/* chart hairlines between Virgo's stars */}
        <g className="cz-virgo-fade" style={{ animationDelay: "1.55s" }}>
          {LINKS.map(([a, b], i) => (
            <line
              key={i}
              x1={STARS[a].x}
              y1={STARS[a].y}
              x2={STARS[b].x}
              y2={STARS[b].y}
              stroke={SILVER}
              strokeOpacity="0.28"
              strokeWidth="0.5"
            />
          ))}
        </g>

        {/* the Maiden, engraved segment by segment */}
        <g fill="none" stroke={GOLD} strokeLinecap="round" strokeLinejoin="round">
          {SEGMENTS.map((s, i) => (
            <path
              key={i}
              className="cz-virgo-draw"
              pathLength={1}
              d={s.d}
              strokeWidth={s.w ?? 0.8}
              strokeOpacity={s.op ?? 0.9}
              style={{ animationDelay: `${s.t}s` }}
            />
          ))}
        </g>

        {/* Virgo's stars: silver nodes, halos, greek-letter labels */}
        <g>
          {STARS.map((s, i) => (
            <g key={i}>
              <circle
                className="cz-virgo-star"
                style={{ animationDelay: `${s.t}s` }}
                cx={s.x} cy={s.y} r={s.r + 2.6} fill="none" stroke={SILVER} strokeOpacity="0.3" strokeWidth="0.4"
              />
              <circle
                className="cz-virgo-star"
                style={{ animationDelay: `${s.t}s` }}
                cx={s.x} cy={s.y} r={s.r} fill={s.spica ? SILVER_BRIGHT : SILVER}
              />
              <text
                className="cz-virgo-fade"
                style={{ animationDelay: `${s.t + 0.15}s` }}
                x={s.lx} y={s.ly} textAnchor={s.anchor} fill={SILVER} fillOpacity="0.8"
                fontSize="6.5" fontFamily={SERIF} fontStyle="italic" letterSpacing="0.5"
              >
                {s.label}
              </text>
            </g>
          ))}
          {/* Spica: slow-pulsing glow + four-point sparkle */}
          <circle className="cz-virgo-spica" cx="168" cy="420" r="17" fill="url(#cz-virgo-silverglow)" />
          <g className="cz-virgo-fade" style={{ animationDelay: "1.6s" }}>
            <line x1="168" y1="410" x2="168" y2="430" stroke={SILVER_BRIGHT} strokeOpacity="0.9" strokeWidth="0.6" />
            <line x1="158" y1="420" x2="178" y2="420" stroke={SILVER_BRIGHT} strokeOpacity="0.9" strokeWidth="0.6" />
          </g>
        </g>

        {/* the little Hermit in the bottom corner, lantern raised toward her */}
        <g className="cz-virgo-fade" style={{ animationDelay: "1.6s" }}>
          <line x1="44" y1="514" x2="106" y2="514" stroke={GOLD} strokeOpacity="0.35" strokeWidth="0.6" />
          {[52, 66, 80, 94].map((x) => (
            <line key={x} x1={x} y1={514} x2={x - 3} y2={519} stroke={GOLD} strokeOpacity="0.2" strokeWidth="0.4" />
          ))}
          <line x1="87" y1="472" x2="87" y2="514" stroke={GOLD} strokeOpacity="0.85" strokeWidth="0.9" />
          <path
            d="M 72 466 C 64 473 60 486 60 512 L 84 512 C 84 492 81 476 72 466 Z"
            fill={INK} fillOpacity="0.55" stroke={GOLD} strokeOpacity="0.9" strokeWidth="0.8" strokeLinejoin="round"
          />
          <path
            d="M 72 472 C 68 476 67 482 69 486 C 72 484 76 484 78 486 C 79 481 76 475 72 472 Z"
            fill="#04060f" stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.4"
          />
          <path d="M 64 486 C 59 484 55 480 53 476" fill="none" stroke={GOLD} strokeOpacity="0.85" strokeWidth="0.7" strokeLinecap="round" />
          {/* lantern cage */}
          <g stroke={GOLD} strokeOpacity="0.9" strokeWidth="0.6" fill="none">
            <path d="M 49 466 L 57 466 L 56 476 L 50 476 Z" strokeLinejoin="round" />
            <line x1="51" y1="463" x2="55" y2="463" />
            <line x1="53" y1="463" x2="53" y2="466" />
            <line x1="53" y1="466" x2="53" y2="476" />
          </g>
          <circle cx="53" cy="471" r="2" fill={GOLD_BRIGHT} />
        </g>
        {/* lantern glow — breathing, echoing Spica */}
        <circle className="cz-virgo-lantern" cx="53" cy="471" r="13" fill="url(#cz-virgo-goldglow)" />
        <g className="cz-virgo-fade" style={{ animationDelay: "1.75s" }}>
          <line x1="53" y1="463" x2="53" y2="479" stroke={GOLD_BRIGHT} strokeOpacity="0.8" strokeWidth="0.5" />
          <line x1="45" y1="471" x2="61" y2="471" stroke={GOLD_BRIGHT} strokeOpacity="0.8" strokeWidth="0.5" />
        </g>

        {/* small IX at the head of the plate */}
        <g className="cz-virgo-fade" style={{ animationDelay: "1.65s" }}>
          <line x1="152" y1="37" x2="176" y2="37" stroke={GOLD} strokeOpacity="0.4" strokeWidth="0.5" />
          <line x1="224" y1="37" x2="248" y2="37" stroke={GOLD} strokeOpacity="0.4" strokeWidth="0.5" />
          <text x="200" y="42" textAnchor="middle" fill={GOLD_BRIGHT} fontSize="12" fontFamily={SERIF} letterSpacing="2">
            IX
          </text>
        </g>

        {/* title cartouche: VIRGO · DOMUS MERCURII */}
        <g className="cz-virgo-fade" style={{ animationDelay: "1.5s" }}>
          <rect x="86" y="52" width="228" height="26" fill={INK} fillOpacity="0.8" stroke={GOLD} strokeOpacity="0.55" strokeWidth="0.8" />
          <rect x="90" y="56" width="220" height="18" fill="none" stroke={GOLD} strokeOpacity="0.3" strokeWidth="0.4" />
          <path d="M 80 65 L 86 59 L 86 71 Z" fill={INK} stroke={GOLD} strokeOpacity="0.45" strokeWidth="0.6" />
          <path d="M 320 65 L 314 59 L 314 71 Z" fill={INK} stroke={GOLD} strokeOpacity="0.45" strokeWidth="0.6" />
          <text x="200" y="69" textAnchor="middle" fill={GOLD_BRIGHT} fontSize="8.5" fontFamily={SERIF} letterSpacing="1.5">
            ♍︎ VIRGO · DOMUS MERCURII ☿︎
          </text>
        </g>

        {/* THE HERMIT in engraved caps at the foot */}
        <g className="cz-virgo-fade" style={{ animationDelay: "1.8s" }}>
          <line x1="62" y1="548" x2="112" y2="548" stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.6" />
          <line x1="288" y1="548" x2="338" y2="548" stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.6" />
          <path d="M 52 548 L 56 544 L 60 548 L 56 552 Z" fill={GOLD} fillOpacity="0.6" />
          <path d="M 340 548 L 344 544 L 348 548 L 344 552 Z" fill={GOLD} fillOpacity="0.6" />
          <text x="200" y="553" textAnchor="middle" fill={GOLD_BRIGHT} fontSize="14" fontFamily={SERIF} letterSpacing="5">
            THE HERMIT
          </text>
        </g>
      </svg>
    </figure>
  );
}
