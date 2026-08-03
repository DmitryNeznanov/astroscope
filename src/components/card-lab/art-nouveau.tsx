/**
 * Card Lab — Art Nouveau (Alphonse Mucha)
 * The Hermit (IX): robed figure in profile on a mountain peak, lantern aloft,
 * staff in hand. Flowing bezier line work, halo disk with radiating pattern,
 * whiplash curves, botanical border, medallion numeral, ribbon title.
 * Self-contained: inline SVG + scoped <style> (prefix cl-an-). Server-safe.
 */

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

function HaloRays() {
  return (
    <g className="cl-an-rays">
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = i * 15;
        const long = i % 2 === 0;
        return (
          <line
            key={i}
            x1={200}
            y1={185 - 60}
            x2={200}
            y2={185 - (long ? 92 : 79)}
            transform={`rotate(${angle} 200 185)`}
            stroke={GOLD_DEEP}
            strokeWidth={long ? 2 : 1.1}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
}

function HaloDots() {
  return (
    <g>
      {Array.from({ length: 36 }).map((_, i) => {
        const a = (i * 10 * Math.PI) / 180;
        return (
          <circle
            key={i}
            cx={200 + 106 * Math.cos(a)}
            cy={185 + 106 * Math.sin(a)}
            r={1.6}
            fill={GOLD}
            opacity={0.8}
          />
        );
      })}
    </g>
  );
}

/** Stylized iris sprig, drawn pointing up from (0,0); reused at the four corners. */
function IrisDef() {
  return (
    <g id="cl-an-iris">
      <path d="M0 0 C-6 -10 -6 -24 0 -34 C6 -24 6 -10 0 0 Z" fill={TERRACOTTA} stroke={INK} strokeWidth={1.2} />
      <path d="M-1 -4 C-11 -8 -17 -17 -17 -27 C-8 -24 -2 -15 -1 -4 Z" fill={GOLD_PALE} stroke={INK} strokeWidth={1} />
      <path d="M1 -4 C11 -8 17 -17 17 -27 C8 -24 2 -15 1 -4 Z" fill={GOLD_PALE} stroke={INK} strokeWidth={1} />
      <path d="M0 0 C-1 12 -1 24 0 36" fill="none" stroke={SAGE_DARK} strokeWidth={2.4} strokeLinecap="round" />
      <path d="M0 30 C-9 26 -16 18 -18 8 C-9 12 -2 20 0 30 Z" fill={SAGE} stroke={INK} strokeWidth={0.8} />
      <path d="M0 34 C9 30 16 22 18 12 C9 16 2 24 0 34 Z" fill={SAGE} stroke={INK} strokeWidth={0.8} />
    </g>
  );
}

export default function ArtNouveauHermitCard() {
  return (
    <figure
      className="cl-an-card"
      role="img"
      aria-label="The Hermit tarot card in Art Nouveau style"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0, position: "relative" }}
    >
      <style>{`
        .cl-an-card {
          overflow: hidden;
          transition: transform .35s ease, box-shadow .35s ease;
        }
        .cl-an-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 28px rgba(61, 47, 34, .28), 0 4px 10px rgba(61, 47, 34, .18);
        }
        .cl-an-halo-glow { opacity: 0; transition: opacity .4s ease; }
        .cl-an-card:hover .cl-an-halo-glow { opacity: .45; }
        .cl-an-glow { animation: cl-an-pulse 4.5s ease-in-out infinite; }
        @keyframes cl-an-pulse { 0%, 100% { opacity: .35; } 50% { opacity: .8; } }
        .cl-an-rays {
          transform-box: fill-box;
          transform-origin: center;
          animation: cl-an-spin 75s linear infinite;
        }
        @keyframes cl-an-spin { to { transform: rotate(360deg); } }
        .cl-an-shine {
          position: absolute;
          top: -25%;
          bottom: -25%;
          left: 0;
          width: 45%;
          pointer-events: none;
          background: linear-gradient(105deg,
            rgba(220, 191, 122, 0) 0%,
            rgba(220, 191, 122, .38) 42%,
            rgba(244, 236, 218, .5) 50%,
            rgba(220, 191, 122, .38) 58%,
            rgba(220, 191, 122, 0) 100%);
          transform: translateX(-160%) skewX(-12deg);
          animation: cl-an-sweep 7s ease-in-out infinite;
        }
        @keyframes cl-an-sweep {
          0% { transform: translateX(-160%) skewX(-12deg); }
          28% { transform: translateX(320%) skewX(-12deg); }
          100% { transform: translateX(320%) skewX(-12deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cl-an-glow, .cl-an-rays, .cl-an-shine { animation: none; }
          .cl-an-shine { display: none; }
          .cl-an-card, .cl-an-halo-glow { transition: none; }
        }
      `}</style>
      <svg
        viewBox="0 0 400 600"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block", width: "100%", height: "100%" }}
      >
        <defs>
          <IrisDef />
        </defs>

        {/* ————— Ground ————— */}
        <rect x={0} y={0} width={400} height={600} fill={CREAM} />
        <rect x={24} y={24} width={352} height={552} fill={PARCHMENT} />

        {/* ————— Halo disk with radiating pattern ————— */}
        <circle cx={200} cy={185} r={96} fill={GOLD_PALE} stroke={INK} strokeWidth={1.6} />
        <HaloRays />
        <circle cx={200} cy={185} r={58} fill="none" stroke={GOLD_DEEP} strokeWidth={1.4} />
        <circle cx={200} cy={185} r={96} fill="none" stroke={INK} strokeWidth={1.6} />
        <HaloDots />
        <circle className="cl-an-halo-glow" cx={200} cy={185} r={96} fill={GOLD_PALE} opacity={0} />

        {/* ————— Distant peaks (soft, Mucha-like contours) ————— */}
        <path
          d="M 24 478 C 80 430 122 418 160 436 C 192 398 232 392 262 414 C 302 392 350 420 376 462 L 376 492 L 24 492 Z"
          fill={SAGE_PALE}
          stroke={INK}
          strokeWidth={1.4}
        />
        <path d="M 120 448 C 150 432 190 430 220 442" fill="none" stroke={SAGE_DARK} strokeWidth={1.1} opacity={0.6} />
        <path d="M 250 440 C 285 428 330 436 358 458" fill="none" stroke={SAGE_DARK} strokeWidth={1.1} opacity={0.6} />

        {/* ————— Whiplash curves framing the scene ————— */}
        <g fill="none" stroke={GOLD} strokeWidth={2.4} strokeLinecap="round">
          <path d="M 70 502 C 40 420 88 380 58 300 C 38 240 78 200 60 140 C 52 112 60 92 76 84" />
          <path d="M 58 300 C 82 290 94 270 90 250" strokeWidth={1.8} />
          <path d="M 330 502 C 360 420 312 380 342 300 C 362 240 322 200 340 140 C 348 112 340 92 324 84" />
          <path d="M 342 300 C 318 290 306 270 310 250" strokeWidth={1.8} />
        </g>
        <g fill={SAGE} stroke={INK} strokeWidth={0.8}>
          <path d="M 66 396 C 56 388 52 376 54 366 C 62 374 66 384 66 396 Z" />
          <path d="M 64 210 C 54 202 50 190 52 180 C 60 188 64 198 64 210 Z" />
          <path d="M 334 396 C 344 388 348 376 346 366 C 338 374 334 384 334 396 Z" />
          <path d="M 336 210 C 346 202 350 190 348 180 C 340 188 336 198 336 210 Z" />
        </g>

        {/* ————— Scattered stars ————— */}
        <g fill={GOLD_DEEP}>
          <path d="M 96 118 L 98.5 125 L 106 127.5 L 98.5 130 L 96 137 L 93.5 130 L 86 127.5 L 93.5 125 Z" />
          <path d="M 312 108 L 314 113.5 L 320 116 L 314 118.5 L 312 124 L 310 118.5 L 304 116 L 310 113.5 Z" />
          <path d="M 330 250 L 331.7 254.5 L 336.5 256.2 L 331.7 257.9 L 330 262.5 L 328.3 257.9 L 323.5 256.2 L 328.3 254.5 Z" />
        </g>

        {/* ————— The Hermit ————— */}
        <g strokeLinejoin="round">
          {/* robe silhouette */}
          <path
            d="M 206 152
               C 222 146 240 152 248 168
               C 256 184 256 200 254 214
               C 262 252 268 302 274 352
               C 279 396 286 430 292 452
               C 260 462 224 462 196 452
               C 200 420 202 380 202 340
               C 202 300 198 250 196 216
               C 194 196 196 168 206 152 Z"
            fill={SAGE}
            stroke={INK}
            strokeWidth={2}
          />
          {/* robe fold lines — long flowing strokes */}
          <g fill="none" stroke={SAGE_DARK} strokeWidth={1.5} opacity={0.75}>
            <path d="M 214 250 C 218 305 220 370 216 438" />
            <path d="M 238 252 C 245 315 251 382 256 440" />
            <path d="M 205 268 C 205 325 207 385 210 432" />
            <path d="M 252 236 C 258 290 264 350 270 420" />
          </g>
          {/* face in profile, facing left */}
          <path
            d="M 226 172 C 216 170 206 174 202 182 C 200 186 199 189 197 192
               L 201 194 C 200 196 200 198 201 200 C 200 202 201 204 203 206
               C 207 210 214 212 220 211 C 226 210 230 206 231 200
               C 232 190 231 178 226 172 Z"
            fill={SKIN}
            stroke={INK}
            strokeWidth={1.2}
          />
          {/* hood — band framing the face opening */}
          <path
            d="M 206 152 C 222 144 243 150 251 167 C 255 177 255 190 251 200
               C 248 208 242 214 234 217 C 240 207 242 196 239 186
               C 236 175 226 168 215 169 C 208 170 202 174 199 180
               C 196 170 199 158 206 152 Z"
            fill={SAGE_DARK}
            stroke={INK}
            strokeWidth={1.6}
          />
          {/* closed eye */}
          <path d="M 206 187 C 208 186 211 186 213 187" fill="none" stroke={INK} strokeWidth={1} />
          {/* flowing beard strands */}
          <path
            d="M 204 204 C 197 216 194 232 197 250 C 200 242 203 236 206 230
               C 205 240 206 248 209 256 C 212 246 214 236 214 226
               C 216 218 218 212 220 208 C 214 210 208 208 204 204 Z"
            fill="#e8dcc4"
            stroke={INK}
            strokeWidth={1.1}
          />
          {/* raised arm: draped sleeve sweeping up-left */}
          <path
            d="M 214 224 C 196 210 176 192 160 168 L 146 180
               C 160 206 182 228 206 244 C 210 238 212 231 214 224 Z"
            fill={SAGE}
            stroke={INK}
            strokeWidth={1.8}
          />
          <path d="M 206 236 C 190 224 172 206 158 184" fill="none" stroke={TERRACOTTA} strokeWidth={1.6} />
          {/* hand */}
          <path
            d="M 158 160 C 152 156 145 159 143 165 C 141 172 146 178 152 178 C 159 178 162 168 158 160 Z"
            fill={SKIN}
            stroke={INK}
            strokeWidth={1.2}
          />
          {/* lowered arm: sleeve draping to the staff hand */}
          <path
            d="M 250 218 C 262 226 274 234 284 242 L 276 254
               C 264 246 252 238 244 230 C 246 225 248 221 250 218 Z"
            fill={SAGE}
            stroke={INK}
            strokeWidth={1.6}
          />
          {/* staff with curled top, held clear of the robe */}
          <path
            d="M 283 244 C 288 310 292 390 296 456"
            fill="none"
            stroke="#5a4632"
            strokeWidth={5}
            strokeLinecap="round"
          />
          <path
            d="M 283 244 C 276 236 278 225 287 223 C 294 221 298 228 293 234"
            fill="none"
            stroke="#5a4632"
            strokeWidth={4}
            strokeLinecap="round"
          />
          <path
            d="M 279 234 C 285 230 292 233 293 240 C 294 247 288 252 282 250 C 276 248 275 238 279 234 Z"
            fill={SKIN}
            stroke={INK}
            strokeWidth={1.2}
          />
        </g>

        {/* ————— Lantern, aloft ————— */}
        <circle className="cl-an-glow" cx={140} cy={141} r={30} fill={GOLD_PALE} />
        <g stroke={INK} strokeWidth={1.5}>
          <circle cx={140} cy={114} r={4.5} fill="none" />
          <path d="M 140 118 L 140 122" fill="none" />
          <path d="M 130 128 C 132 119 148 119 150 128 Z" fill={TERRACOTTA} />
          <path
            d="M 128 130 C 128 124 152 124 152 130 L 154 152 C 154 161 126 161 126 152 Z"
            fill="#f7efdb"
            fillOpacity={0.9}
          />
          <path
            d="M 140 132 L 142.2 138.4 L 149 138.6 L 143.8 142.8 L 145.6 149.4 L 140 145.6 L 134.4 149.4 L 136.2 142.8 L 131 138.6 L 137.8 138.4 Z"
            fill={GOLD}
            strokeWidth={0.8}
          />
          <path d="M 128 156 C 134 159 146 159 152 156" fill="none" strokeWidth={1} />
        </g>

        {/* ————— Foreground hill ————— */}
        <path
          d="M 24 494 C 90 462 150 456 200 470 C 260 452 330 462 376 486 L 376 508 L 24 508 Z"
          fill={SAGE}
          stroke={INK}
          strokeWidth={1.4}
        />
        <path d="M 90 482 C 130 470 180 470 220 480" fill="none" stroke={SAGE_DARK} strokeWidth={1.1} opacity={0.7} />

        {/* ————— Ornate border with corner irises ————— */}
        <rect x={10} y={10} width={380} height={580} fill="none" stroke={INK} strokeWidth={2.5} />
        <rect x={22} y={22} width={356} height={556} fill="none" stroke={INK} strokeWidth={1} />
        <use href="#cl-an-iris" transform="translate(52 82)" />
        <use href="#cl-an-iris" transform="translate(348 82) scale(-1 1)" />
        <use href="#cl-an-iris" transform="translate(52 520) scale(1 -1)" />
        <use href="#cl-an-iris" transform="translate(348 520) scale(-1 -1)" />

        {/* ————— IX medallion, top center ————— */}
        <circle cx={200} cy={32} r={21} fill={CREAM} stroke={INK} strokeWidth={2} />
        <circle cx={200} cy={32} r={15.5} fill="none" stroke={GOLD} strokeWidth={1.2} />
        <text
          x={200}
          y={38.5}
          textAnchor="middle"
          fontFamily="Georgia, 'Iowan Old Style', 'Times New Roman', serif"
          fontSize={17}
          fontWeight={700}
          fill={INK}
        >
          IX
        </text>
        <path d="M 168 32 C 160 28 154 22 152 14 C 160 18 166 24 168 32 Z" fill={SAGE} stroke={INK} strokeWidth={0.8} />
        <path d="M 232 32 C 240 28 246 22 248 14 C 240 18 234 24 232 32 Z" fill={SAGE} stroke={INK} strokeWidth={0.8} />

        {/* ————— Ribbon banner with title ————— */}
        <path d="M 56 514 L 36 505 L 45 531 L 36 557 L 56 548 Z" fill={TERRACOTTA_DARK} stroke={INK} strokeWidth={1.4} />
        <path d="M 344 514 L 364 505 L 355 531 L 364 557 L 344 548 Z" fill={TERRACOTTA_DARK} stroke={INK} strokeWidth={1.4} />
        <path
          d="M 56 514 C 120 502 280 502 344 514 L 344 548 C 280 536 120 536 56 548 Z"
          fill={TERRACOTTA}
          stroke={INK}
          strokeWidth={1.8}
        />
        <text
          x={200}
          y={536}
          textAnchor="middle"
          fontFamily="Georgia, 'Iowan Old Style', 'Times New Roman', serif"
          fontSize={17}
          letterSpacing={4}
          fill={CREAM}
        >
          THE HERMIT
        </text>
      </svg>
      <div className="cl-an-shine" aria-hidden="true" />
    </figure>
  );
}
