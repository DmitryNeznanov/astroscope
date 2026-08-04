/**
 * Gold Foil — The Hermit (IX)
 *
 * Luxury matte-black card with hot-stamped gold foil. Minimal confident
 * line art (figure, lantern, staff, a few stars) framed by a small zodiac
 * wheel. A clipped shine layer sweeps a slow diagonal sheen across ONLY the
 * gold elements. On load the foil "stamps" on with a brief bright flash
 * sweeping left-to-right. All motion is CSS-only and guarded by
 * prefers-reduced-motion.
 */
export default function GoldFoilHermitCard() {
  return (
    <figure
      className="cz-gold-card"
      style={{ aspectRatio: "2/3", width: "100%" }}
    >
      <style>{`
        .cz-gold-card {
          position: relative;
          margin: 0;
          overflow: hidden;
          border-radius: 18px;
          background:
            radial-gradient(130% 100% at 50% -10%, rgba(233, 214, 160, 0.05), rgba(233, 214, 160, 0) 55%),
            repeating-linear-gradient(115deg, rgba(255, 255, 255, 0.014) 0 1px, rgba(255, 255, 255, 0) 1px 4px),
            #0d0d0f;
          box-shadow:
            inset 0 0 0 1px rgba(212, 175, 55, 0.08),
            inset 0 40px 90px rgba(0, 0, 0, 0.35),
            inset 0 -60px 120px rgba(0, 0, 0, 0.55);
        }
        .cz-gold-card svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
        }

        /* ---- Tier 1: load — the foil stamps on with a left-to-right flash ---- */
        .cz-gold-art {
          clip-path: inset(0 100% 0 0);
          animation: cz-gold-stamp 1.6s cubic-bezier(0.55, 0.06, 0.35, 1) 0.15s both;
        }
        @keyframes cz-gold-stamp {
          0%   { clip-path: inset(0 100% 0 0); filter: brightness(2.6) saturate(1.15); }
          55%  { filter: brightness(1.7); }
          100% { clip-path: inset(0 0 0 0); filter: brightness(1); }
        }

        /* ---- Tier 2: ambient — slow diagonal sheen across the gold only ---- */
        .cz-gold-shine {
          animation: cz-gold-sweep 12s linear 0.2s infinite;
        }
        @keyframes cz-gold-sweep {
          0%   { transform: translateX(0); }
          14%  { transform: translateX(780px); }
          100% { transform: translateX(780px); }
        }

        /* ---- Ambient: faint breathing of the lantern star ---- */
        .cz-gold-lantern-star {
          animation: cz-gold-star 8s ease-in-out infinite;
        }
        @keyframes cz-gold-star {
          0%, 100% { opacity: 0.7; }
          50%      { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cz-gold-art {
            animation: none;
            clip-path: none;
            filter: none;
          }
          .cz-gold-shine {
            animation: none;
            opacity: 0;
          }
          .cz-gold-lantern-star {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>

      <svg
        viewBox="0 0 400 600"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="The Hermit tarot card, gold foil line art on matte black"
      >
        <defs>
          {/* Soft metallic gold for strokes, diagonal across the card */}
          <linearGradient
            id="cz-gold-grad"
            gradientUnits="userSpaceOnUse"
            x1="60"
            y1="40"
            x2="340"
            y2="560"
          >
            <stop offset="0" stopColor="#9a7a34" />
            <stop offset="0.35" stopColor="#d9b867" />
            <stop offset="0.5" stopColor="#eed9a0" />
            <stop offset="0.65" stopColor="#caa14e" />
            <stop offset="1" stopColor="#8a6d2f" />
          </linearGradient>

          {/* Gold for type */}
          <linearGradient id="cz-gold-text-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a5853d" />
            <stop offset="0.5" stopColor="#f4e3ac" />
            <stop offset="1" stopColor="#b08a3e" />
          </linearGradient>

          {/* Bright band for the sheen sweep */}
          <linearGradient id="cz-gold-shine-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff4d2" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff6da" stopOpacity="0.95" />
            <stop offset="1" stopColor="#fff4d2" stopOpacity="0" />
          </linearGradient>

          {/* Sheen is clipped to the gold artwork only */}
          <clipPath id="cz-gold-clip">
            <use href="#cz-gold-art" />
          </clipPath>
        </defs>

        {/* Blind-emboss second frame: faint impression, stamps with the foil,
            deliberately outside #cz-gold-art so the sheen never flashes on it */}
        <path
          className="cz-gold-art"
          d="M64 25 H336 M64 575 H336 M25 64 V536 M375 64 V536"
          fill="none"
          stroke="rgba(233, 214, 160, 0.12)"
          strokeWidth="1"
        />

        {/* ============ Gold artwork (stamps on at load) ============ */}
        <g
          id="cz-gold-art"
          className="cz-gold-art"
          fill="none"
          stroke="url(#cz-gold-grad)"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Luxury frame: outer thick-thin rule pair */}
          <rect x="13" y="13" width="374" height="574" strokeWidth="2" opacity="0.9" />
          <rect x="20" y="20" width="360" height="560" strokeWidth="0.6" opacity="0.7" />

          {/* Ornate corner flourishes: foil fan arcs + diamond pivot */}
          <g id="cz-gold-corner" strokeWidth="1">
            <path d="M30 40 A10 10 0 0 0 40 30" />
            <path d="M30 46 A16 16 0 0 0 46 30" opacity="0.8" />
            <path d="M30 52 A22 22 0 0 0 52 30" opacity="0.55" />
            <path
              d="M30 26.5 L33.5 30 L30 33.5 L26.5 30 Z"
              fill="url(#cz-gold-grad)"
              stroke="none"
            />
          </g>
          <use href="#cz-gold-corner" transform="translate(400 0) scale(-1 1)" />
          <use href="#cz-gold-corner" transform="translate(0 600) scale(1 -1)" />
          <use href="#cz-gold-corner" transform="translate(400 600) scale(-1 -1)" />

          {/* IX — small foil caps, top center, flanked by hairline rules */}
          <path d="M118 70 H168 M232 70 H282" strokeWidth="0.8" opacity="0.8" />
          <text
            x="200"
            y="78"
            textAnchor="middle"
            fill="url(#cz-gold-text-grad)"
            stroke="none"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontSize="26"
            letterSpacing="5"
          >
            IX
          </text>

          {/* Zodiac wheel: thin ring + hairline inner ring + 12 tiny glyphs */}
          <circle cx="200" cy="300" r="130" strokeWidth="1" opacity="0.9" />
          <circle cx="200" cy="300" r="124" strokeWidth="0.5" opacity="0.45" />
          {/* Inner planet ring */}
          <circle cx="200" cy="300" r="112" strokeWidth="0.5" opacity="0.4" />
          <g
            fill="url(#cz-gold-text-grad)"
            stroke="none"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontSize="12"
            textAnchor="middle"
          >
            <text x="200" y="170" dominantBaseline="central">♈︎</text>
            <text x="265" y="187.4" dominantBaseline="central">♉︎</text>
            <text x="312.6" y="235" dominantBaseline="central">♊︎</text>
            <text x="330" y="300" dominantBaseline="central">♋︎</text>
            <text x="312.6" y="365" dominantBaseline="central">♌︎</text>
            <text x="265" y="412.6" dominantBaseline="central">♍︎</text>
            <text x="200" y="430" dominantBaseline="central">♎︎</text>
            <text x="135" y="412.6" dominantBaseline="central">♏︎</text>
            <text x="87.4" y="365" dominantBaseline="central">♐︎</text>
            <text x="70" y="300" dominantBaseline="central">♑︎</text>
            <text x="87.4" y="235" dominantBaseline="central">♒︎</text>
            <text x="135" y="187.4" dominantBaseline="central">♓︎</text>
          </g>

          {/* 7 classical planets on the inner ring (Sun at the top) */}
          <g
            fill="url(#cz-gold-text-grad)"
            stroke="none"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontSize="11"
            textAnchor="middle"
          >
            <text x="200" y="188" dominantBaseline="central">☉︎</text>
            <text x="287.6" y="230.2" dominantBaseline="central">☽︎</text>
            <text x="309.2" y="324.9" dominantBaseline="central">☿︎</text>
            <text x="248.6" y="400.9" dominantBaseline="central">♀︎</text>
            <text x="151.4" y="400.9" dominantBaseline="central">♂︎</text>
            <text x="90.8" y="324.9" dominantBaseline="central">♃︎</text>
            <text x="112.4" y="230.2" dominantBaseline="central">♄︎</text>
          </g>

          {/* Mountain peak */}
          <path d="M116 404 L200 340 L284 404" strokeWidth="1.6" />
          <path d="M168 404 L200 372 L232 404" strokeWidth="1.1" opacity="0.55" />

          {/* The Hermit — minimal confident lines */}
          <g strokeWidth="1.7">
            {/* hood */}
            <path d="M180 252 Q181 220 200 214 Q219 220 220 252" />
            {/* face shadow */}
            <path d="M190 250 Q200 240 210 250" strokeWidth="1.3" opacity="0.7" />
            {/* cloak */}
            <path d="M180 252 Q175 296 171 338" />
            <path d="M220 252 Q225 296 229 338" />
            {/* hem */}
            <path d="M171 338 Q200 349 229 338" />
            {/* center fold */}
            <path d="M200 262 Q198 300 200 336" strokeWidth="1" opacity="0.5" />
            {/* raised arm with lantern */}
            <path d="M218 254 Q232 234 242 206" />
            <path d="M224 263 Q236 244 246 214" strokeWidth="1.3" opacity="0.75" />
            {/* arm to staff */}
            <path d="M182 254 Q170 252 160 246" strokeWidth="1.4" />
          </g>

          {/* Staff */}
          <path d="M161 222 L152 346" strokeWidth="1.6" />
          <circle cx="161" cy="220" r="2.2" strokeWidth="1.3" />

          {/* Lantern */}
          <g strokeWidth="1.5">
            <path d="M240 204 Q246 194 252 204" />
            <path d="M237 204 H255" />
            <path d="M239 204 V226 M253 204 V226 M239 226 H253" />
          </g>
          {/* star inside the lantern */}
          <g className="cz-gold-lantern-star">
            <circle cx="246" cy="215" r="9" strokeWidth="0.7" opacity="0.45" />
            <path
              d="M246 209 L247.4 213.6 L252 215 L247.4 216.4 L246 221 L244.6 216.4 L240 215 L244.6 213.6 Z"
              fill="url(#cz-gold-grad)"
              stroke="none"
            />
          </g>

          {/* A few quiet stars */}
          <g fill="url(#cz-gold-grad)" stroke="none" opacity="0.9">
            <path d="M148 219 L149.2 222.8 L153 224 L149.2 225.2 L148 229 L146.8 225.2 L143 224 L146.8 222.8 Z" />
            <path d="M286 256 L287 259 L290 260 L287 261 L286 264 L285 261 L282 260 L285 259 Z" />
            <path d="M224 193.5 L225 196.9 L228.5 198 L225 199.1 L224 202.5 L223 199.1 L219.5 198 L223 196.9 Z" />
          </g>

          {/* Tiny constellation accents in the matte field */}
          <g strokeWidth="0.6" opacity="0.5">
            <path d="M62 148 L80 132 L98 142 L88 162" />
            <path d="M52 452 L70 442 L86 456 L74 476" />
            <path d="M312 458 L332 448 L348 464 L334 484" />
          </g>
          <g fill="url(#cz-gold-grad)" stroke="none" opacity="0.8">
            <circle cx="62" cy="148" r="1.2" />
            <circle cx="80" cy="132" r="1.5" />
            <circle cx="98" cy="142" r="1.1" />
            <circle cx="88" cy="162" r="1.3" />
            <circle cx="52" cy="452" r="1.2" />
            <circle cx="70" cy="442" r="1.5" />
            <circle cx="86" cy="456" r="1.1" />
            <circle cx="74" cy="476" r="1.3" />
            <circle cx="312" cy="458" r="1.2" />
            <circle cx="332" cy="448" r="1.5" />
            <circle cx="348" cy="464" r="1.1" />
            <circle cx="334" cy="484" r="1.3" />
          </g>

          {/* Title block: hairline rules + wide-tracked serif caps */}
          <path d="M100 524 H188 M212 524 H300" strokeWidth="0.8" opacity="0.8" />
          <path
            d="M200 521 L202.4 524 L200 527 L197.6 524 Z"
            fill="url(#cz-gold-grad)"
            stroke="none"
          />
          <text
            x="203"
            y="556"
            textAnchor="middle"
            fill="url(#cz-gold-text-grad)"
            stroke="none"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontSize="20"
            letterSpacing="7"
          >
            THE HERMIT
          </text>
          <path d="M100 576 H300" strokeWidth="0.8" opacity="0.8" />
        </g>

        {/* ============ Sheen layer (clipped to the gold only) ============ */}
        <g clipPath="url(#cz-gold-clip)" aria-hidden="true">
          <g transform="rotate(18 200 300)">
            <rect
              className="cz-gold-shine"
              x="-260"
              y="-200"
              width="150"
              height="1000"
              fill="url(#cz-gold-shine-grad)"
            />
          </g>
        </g>
      </svg>
    </figure>
  );
}
