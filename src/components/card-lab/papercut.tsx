/**
 * Card Lab — PAPERCUT
 * Layered paper-cut shadow box (papercraft diorama) take on THE HERMIT (IX).
 * Six stacked card-stock silhouettes inside a recessed shadow-box frame:
 * dusk sky (plum-to-peach gradient), far mountains, terracotta mid hills,
 * deep-plum near hill, navy hermit with a warm cream lantern cut-out, and a
 * grassy foreground. Every layer casts a soft ~25% black drop-shadow onto the
 * layer below; edges are slightly irregular to read as hand-cut. Chrome: 'IX'
 * on a hanging paper tag, 'THE HERMIT' on a torn paper strip.
 * Server-component safe: no hooks, no client code.
 */

const NAVY = "#222c4b";
const INK = "#1c2540";
const PLUM = "#472b4d";
const CREAM = "#f5e8cf";
const SERIF = "Georgia, 'Times New Roman', 'Liberation Serif', serif";

export default function PapercutHermitCard() {
  return (
    <figure
      className="cl-papercut-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
    >
      <style>{`
        .cl-papercut-card { line-height: 0; }
        .cl-papercut-glow {
          transform-box: fill-box;
          transform-origin: center;
          animation: cl-papercut-flicker 3.4s ease-in-out infinite;
        }
        @keyframes cl-papercut-flicker {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          45% { opacity: 0.85; transform: scale(1.09); }
          60% { opacity: 0.65; transform: scale(1.03); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cl-papercut-glow { animation: none; opacity: 0.65; }
        }
      `}</style>
      <svg
        viewBox="0 0 400 600"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="The Hermit tarot card rendered as a layered paper-cut shadow box"
      >
        <defs>
          {/* Sky: dusk gradient, plum overhead fading to peach at the horizon. */}
          <linearGradient id="cl-papercut-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7c4a68" />
            <stop offset="0.45" stopColor="#c97e6d" />
            <stop offset="1" stopColor="#f4bd8e" />
          </linearGradient>
          {/* Recess shade: darkens the top of the window so it reads as inset. */}
          <linearGradient id="cl-papercut-recess" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000000" stopOpacity="0.5" />
            <stop offset="1" stopColor="#000000" stopOpacity="0" />
          </linearGradient>
          {/* Soft paper drop-shadow cast by each layer onto the one below. */}
          <filter id="cl-papercut-ds" x="-15%" y="-15%" width="130%" height="140%">
            <feDropShadow
              dx="0"
              dy="3"
              stdDeviation="2"
              floodColor="#000000"
              floodOpacity="0.25"
            />
          </filter>
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
        <rect x="0" y="0" width="400" height="600" rx="10" fill="#c99a6b" />
        <rect x="0" y="0" width="400" height="600" rx="10" fill="none" stroke="#a87b4f" strokeWidth="2" />
        <rect x="14" y="14" width="372" height="572" rx="9" fill="none" stroke="#8a6242" strokeWidth="3" />
        <rect x="20" y="20" width="360" height="560" rx="6" fill="#33203a" />

        {/* === Layers, clipped to the recessed window === */}
        <g clipPath="url(#cl-papercut-window)">
          {/* Layer 1 — dusk sky */}
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
          <circle cx="300" cy="96" r="16" fill={CREAM} mask="url(#cl-papercut-moon)" />

          {/* Layer 2 — far mountains (light plum) */}
          <path
            filter="url(#cl-papercut-ds)"
            fill="#7a4a66"
            d="M 20 580 L 20 332 L 68 244 L 94 270 L 140 212 L 176 257 L 226 196 L 259 251 L 302 216 L 338 263 L 380 232 L 380 580 Z"
          />

          {/* Layer 3 — mid hills (terracotta) */}
          <path
            filter="url(#cl-papercut-ds)"
            fill="#c06a47"
            d="M 20 580 L 20 424 C 58 398 92 394 122 406 C 152 416 172 382 202 374 C 236 366 262 390 300 398 C 332 405 358 394 380 402 L 380 580 Z"
          />

          {/* Layer 4 — near hill (deep plum), crest carries the hermit */}
          <path
            filter="url(#cl-papercut-ds)"
            fill={PLUM}
            d="M 20 580 L 20 494 C 52 476 74 468 102 452 C 132 437 166 415 200 405 C 234 399 262 421 296 439 C 330 457 356 463 380 475 L 380 580 Z"
          />

          {/* Warm halo bleeding through the lantern cut-out (behind the hermit layer) */}
          <circle className="cl-papercut-glow" cx="241" cy="321" r="27" fill="#ffd9a0" opacity="0.6" />

          {/* Layer 5 — the hermit (deep navy) with cream lantern cut-out */}
          <g filter="url(#cl-papercut-ds)">
            {/* Staff in the left hand */}
            <line x1="176" y1="318" x2="168" y2="408" stroke={NAVY} strokeWidth="4" strokeLinecap="round" />
            {/* Hooded cloak silhouette, right arm raised */}
            <path
              fill={NAVY}
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
            {/* Lantern hanging from the raised hand */}
            <path
              d="M 240 312 C 240 307 248 307 248 312"
              fill="none"
              stroke={NAVY}
              strokeWidth="2.5"
            />
            <rect x="234" y="312" width="14" height="19" rx="2" fill={CREAM} />
            <rect x="233" y="310" width="16" height="3" rx="1.5" fill={NAVY} />
            {/* Star cut into the lantern paper */}
            <path d="M 241 316 L 243 321 L 241 327 L 239 321 Z" fill={NAVY} />
          </g>

          {/* Layer 6 — foreground grass and rock (darkest navy) */}
          <path
            filter="url(#cl-papercut-ds)"
            fill={INK}
            d="M 20 580 L 20 522 L 28 508 L 34 520 L 44 504 L 52 520
               C 90 508 120 518 155 510
               C 190 502 215 508 245 516
               C 262 520 276 505 296 501
               C 320 497 336 512 350 516
               L 358 506 L 364 518 L 372 508 L 380 518 L 380 580 Z"
          />

          {/* Recess shading: top gradient + inner edge darkening */}
          <rect x="20" y="20" width="360" height="80" fill="url(#cl-papercut-recess)" />
          <rect x="20" y="20" width="360" height="560" rx="6" fill="none" stroke="#000000" strokeOpacity="0.35" strokeWidth="3" />
        </g>

        {/* Chrome — 'IX' on a small hanging paper tag */}
        <g filter="url(#cl-papercut-ds)">
          <line x1="200" y1="22" x2="200" y2="38" stroke="#8a6242" strokeWidth="2" />
          <g transform="rotate(-2 200 52)">
            <rect x="177" y="36" width="46" height="32" rx="3" fill={CREAM} />
            <circle cx="200" cy="42" r="2.2" fill="#c99a6b" />
            <text
              x="200"
              y="62"
              textAnchor="middle"
              fontFamily={SERIF}
              fontSize="19"
              letterSpacing="2"
              fill={NAVY}
            >
              IX
            </text>
          </g>
        </g>

        {/* Chrome — 'THE HERMIT' on a torn paper strip */}
        <g filter="url(#cl-papercut-ds)">
          <polygon
            fill={CREAM}
            points="58,540 76,534 122,538 192,533 262,537 330,532 343,539 338,563 300,567 220,562 140,567 82,563 56,557"
          />
          <text
            x="200"
            y="554"
            textAnchor="middle"
            fontFamily={SERIF}
            fontSize="14"
            letterSpacing="4"
            fill={NAVY}
          >
            THE HERMIT
          </text>
        </g>
      </svg>
    </figure>
  );
}
