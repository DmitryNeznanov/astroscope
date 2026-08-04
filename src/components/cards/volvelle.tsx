// VOLVELLE — The Hermit (IX)
// A medieval paper volvelle (rotating wheel chart) on aged parchment:
// a fixed base disc (24 hour ring with roman numerals, 12 zodiac panels)
// and a smaller top disc pinned by a brass brad, carrying a pointer arm and
// an arched cut-out window that reveals a planetary scale beneath. The
// Hermit is inked in the bottom margin, lantern raised toward the
// instrument. Server-component safe: no hooks, no client directive.

const CX = 150;
const CY = 190;

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const ROMAN = ["I", "II", "III", "IIII", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
const ZODIAC = ["♈︎", "♉︎", "♊︎", "♋︎", "♌︎", "♍︎", "♎︎", "♏︎", "♐︎", "♑︎", "♒︎", "♓︎"];
const PLANETS = ["☉︎", "☽︎", "☿︎", "♀︎", "♂︎", "♃︎", "♄︎"];
const DOTS = Array.from({ length: 12 }, (_, i) => i * 30);

// arched window aperture: annular sector r 46–66, ±16° around east, round caps
const WINDOW_PATH =
  "M 194.16 177.32 A 10 10 0 0 1 213.35 171.81 " +
  "A 66 66 0 0 1 213.35 208.19 A 10 10 0 0 1 194.16 202.68 " +
  "A 46 46 0 0 0 194.16 177.32 Z";

const INK = "#3a2a1c";
const INK_DARK = "#2c1d12";
const GOLD = "#c9a227";
const RUBRIC = "#a32c1e";
const PAPER = "#f0e6cc";

export default function VolvelleHermitCard() {
  return (
    <figure
      className="cz-volv-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
    >
      <style>{`
        .cz-volv-card { position: relative; overflow: hidden; }
        .cz-volv-card svg { display: block; width: 100%; height: 100%; }

        .cz-volv-base {
          animation: cz-volv-ink-in 1s ease-out backwards;
        }
        .cz-volv-figure {
          animation: cz-volv-ink-in .9s ease-out .85s backwards;
        }
        .cz-volv-disc-load {
          transform-box: view-box;
          transform-origin: ${CX}px ${CY}px;
          animation: cz-volv-spin-in 1.4s cubic-bezier(.3,.9,.35,1) .15s backwards;
        }
        .cz-volv-disc-ambient {
          transform-box: view-box;
          transform-origin: ${CX}px ${CY}px;
          animation: cz-volv-nudge 40s ease-in-out infinite alternate;
        }
        .cz-volv-gleam {
          animation: cz-volv-brad-gleam 8s ease-in-out infinite;
        }

        @keyframes cz-volv-spin-in {
          0%   { opacity: 0; transform: rotate(-40deg); }
          30%  { opacity: 1; }
          62%  { transform: rotate(2.5deg); }
          80%  { transform: rotate(-1deg); }
          100% { opacity: 1; transform: rotate(0deg); }
        }
        @keyframes cz-volv-ink-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cz-volv-nudge {
          from { transform: rotate(-3deg); }
          to   { transform: rotate(3deg); }
        }
        @keyframes cz-volv-brad-gleam {
          0%, 100% { opacity: .12; }
          50%      { opacity: .85; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cz-volv-base,
          .cz-volv-figure,
          .cz-volv-disc-load,
          .cz-volv-disc-ambient,
          .cz-volv-gleam {
            animation: none;
          }
        }
      `}</style>

      <svg
        viewBox="0 0 300 450"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="The Hermit, tarot card nine, drawn as a medieval paper volvelle instrument"
      >
        <defs>
          <radialGradient id="cz-volv-parchment" cx="50%" cy="42%" r="75%">
            <stop offset="0%" stopColor="#f4ebd2" />
            <stop offset="70%" stopColor="#f0e6cc" />
            <stop offset="100%" stopColor="#e0d0a8" />
          </radialGradient>
          <radialGradient id="cz-volv-basegrad" cx="50%" cy="46%" r="60%">
            <stop offset="0%" stopColor="#eee2c2" />
            <stop offset="80%" stopColor="#e6d7b0" />
            <stop offset="100%" stopColor="#d9c795" />
          </radialGradient>
          <radialGradient id="cz-volv-topgrad" cx="50%" cy="46%" r="60%">
            <stop offset="0%" stopColor="#f6eed6" />
            <stop offset="85%" stopColor="#eee0ba" />
            <stop offset="100%" stopColor="#e2d0a2" />
          </radialGradient>
          <radialGradient id="cz-volv-brass" cx="38%" cy="34%" r="75%">
            <stop offset="0%" stopColor="#f3dc8e" />
            <stop offset="55%" stopColor="#c9a227" />
            <stop offset="100%" stopColor="#7c5f14" />
          </radialGradient>
          <filter id="cz-volv-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.4" />
          </filter>
          {/* window punched out of the top disc */}
          <mask
            id="cz-volv-winmask"
            maskUnits="userSpaceOnUse"
            x="70"
            y="110"
            width="160"
            height="160"
          >
            <circle cx={CX} cy={CY} r="68" fill="#ffffff" />
            <path d={WINDOW_PATH} fill="#000000" />
          </mask>
        </defs>

        {/* aged parchment ground + stains */}
        <rect x="0" y="0" width="300" height="450" fill="url(#cz-volv-parchment)" />
        <ellipse cx="52" cy="86" rx="40" ry="22" fill="#b89b5e" opacity="0.09" />
        <ellipse cx="256" cy="352" rx="34" ry="26" fill="#b89b5e" opacity="0.08" />
        <ellipse cx="66" cy="330" rx="24" ry="36" fill="#a8894e" opacity="0.07" />
        <ellipse cx="240" cy="70" rx="26" ry="16" fill="#a8894e" opacity="0.07" />

        {/* deckle hint along the sheet edges */}
        <g fill="none" stroke="#a8894e" strokeWidth="1" opacity="0.3">
          <path d="M 4 24 Q 7 130 3 230 Q 6 340 4 426" />
          <path d="M 296 20 Q 293 140 297 240 Q 294 350 296 428" />
          <path d="M 22 4 Q 130 7 228 3 Q 262 5 282 4" />
          <path d="M 24 446 Q 140 443 236 447 Q 266 445 280 446" />
        </g>

        {/* thin ink frame with corner crosses */}
        <rect x="10" y="10" width="280" height="430" fill="none" stroke={INK} strokeWidth="1.3" opacity="0.85" />
        <g stroke={INK} strokeWidth="1.2" opacity="0.9">
          <path d="M 5 10 h 10 M 10 5 v 10" />
          <path d="M 285 10 h 10 M 290 5 v 10" />
          <path d="M 5 440 h 10 M 10 435 v 10" />
          <path d="M 285 440 h 10 M 290 435 v 10" />
        </g>

        {/* small roman numeral at the top, flanked by stars */}
        <text
          x="150"
          y="40"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontWeight="700"
          fontSize="17"
          letterSpacing="4"
          fill={INK_DARK}
        >
          IX
        </text>
        <g fill={INK} opacity="0.8">
          <path d="M 118 31 L 119.6 35 L 118 39 L 116.4 35 Z" />
          <path d="M 182 31 L 183.6 35 L 182 39 L 180.4 35 Z" />
        </g>

        {/* ============ fixed base disc ============ */}
        <g className="cz-volv-base">
          <circle cx={CX} cy={CY} r="112" fill="url(#cz-volv-basegrad)" stroke={INK} strokeWidth="1.8" />

          {/* outer scale: 24 hour marks + roman numerals */}
          <circle cx={CX} cy={CY} r="96" fill="none" stroke={INK} strokeWidth="0.9" />
          {HOURS.map((h) => {
            const major = h % 6 === 0;
            return (
              <g key={h} transform={`rotate(${h * 15} ${CX} ${CY})`}>
                <line
                  x1={CX}
                  y1={CY - 112}
                  x2={CX}
                  y2={CY - (major ? 104 : 108)}
                  stroke={INK}
                  strokeWidth={major ? 1.2 : 0.55}
                />
                <text
                  x={CX}
                  y={CY - 98.5}
                  textAnchor="middle"
                  fontFamily="Georgia, 'Times New Roman', serif"
                  fontSize="6"
                  fill={INK}
                >
                  {ROMAN[h % 12]}
                </text>
              </g>
            );
          })}

          {/* middle scale: 12 zodiac panels */}
          <circle cx={CX} cy={CY} r="88" fill="none" stroke={INK} strokeWidth="1.1" />
          <circle cx={CX} cy={CY} r="70" fill="none" stroke={INK} strokeWidth="0.8" />
          {ZODIAC.map((g, i) => (
            <g key={g} transform={`rotate(${i * 30} ${CX} ${CY})`}>
              <line
                x1={CX}
                y1={CY - 88}
                x2={CX}
                y2={CY - 70}
                stroke={INK}
                strokeWidth="0.5"
              />
              <text
                x={CX}
                y={CY - 75}
                textAnchor="middle"
                fontFamily="Georgia, 'DejaVu Sans', 'Segoe UI Symbol', serif"
                fontSize="9.5"
                fill={i % 2 === 0 ? RUBRIC : INK}
                transform={`rotate(15 ${CX} ${CY})`}
              >
                {g}
              </text>
            </g>
          ))}

          {/* inner planetary scale, revealed through the window */}
          <circle cx={CX} cy={CY} r="64" fill="none" stroke={INK} strokeWidth="0.6" />
          <circle cx={CX} cy={CY} r="47" fill="none" stroke={INK} strokeWidth="0.6" />
          {PLANETS.map((p, i) => (
            <g key={p} transform={`rotate(${i * (360 / 7)} ${CX} ${CY})`}>
              <text
                x={CX}
                y={CY - 52}
                textAnchor="middle"
                fontFamily="Georgia, 'DejaVu Sans', 'Segoe UI Symbol', serif"
                fontSize="8"
                fill={i % 2 === 0 ? INK : RUBRIC}
              >
                {p}
              </text>
            </g>
          ))}
          {/* faint construction circles at the hub */}
          <circle cx={CX} cy={CY} r="34" fill="none" stroke={INK} strokeWidth="0.5" opacity="0.6" />
          <circle cx={CX} cy={CY} r="12" fill="none" stroke={INK} strokeWidth="0.6" opacity="0.7" />
        </g>

        {/* paper shadow under the top disc */}
        <circle
          cx={CX + 2}
          cy={CY + 3.5}
          r="68"
          fill={INK_DARK}
          opacity="0.22"
          filter="url(#cz-volv-blur)"
        />

        {/* ============ rotating top disc ============ */}
        <g className="cz-volv-disc-load">
          <g className="cz-volv-disc-ambient">
            {/* paper + markings, window punched through */}
            <g mask="url(#cz-volv-winmask)">
              <circle cx={CX} cy={CY} r="68" fill="url(#cz-volv-topgrad)" />
              <circle cx={CX} cy={CY} r="58" fill="none" stroke={INK} strokeWidth="0.7" />
              <circle cx={CX} cy={CY} r="40" fill="none" stroke={INK} strokeWidth="0.5" opacity="0.7" />
              {DOTS.map((a) => (
                <g key={a} transform={`rotate(${a} ${CX} ${CY})`}>
                  <circle cx={CX} cy={CY - 49} r="1" fill={INK} opacity="0.75" />
                </g>
              ))}
              <text
                x={CX}
                y={CY + 47}
                textAnchor="middle"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontStyle="italic"
                fontSize="6"
                letterSpacing="1.5"
                fill={INK}
                opacity="0.85"
              >
                · horae ·
              </text>
            </g>
            {/* disc edge + cut edge of the window */}
            <circle cx={CX} cy={CY} r="68" fill="none" stroke={INK} strokeWidth="1.5" />
            <path d={WINDOW_PATH} fill="none" stroke={INK} strokeWidth="0.9" />

            {/* pointer / indicator arm, aimed at the top of the scale */}
            <path
              d={`M ${CX - 3} ${CY + 4} L ${CX} ${CY - 64} L ${CX + 3} ${CY + 4} Z`}
              fill={INK_DARK}
              opacity="0.85"
            />
            <path
              d={`M ${CX} ${CY - 64} L ${CX + 1.8} ${CY - 58} L ${CX - 1.8} ${CY - 58} Z`}
              fill={GOLD}
              stroke={INK_DARK}
              strokeWidth="0.5"
            />
            <line x1={CX} y1={CY + 4} x2={CX} y2={CY + 16} stroke={INK_DARK} strokeWidth="1.4" />
          </g>
        </g>

        {/* brass brad pinning both discs */}
        <g>
          <circle cx={CX} cy={CY} r="5.6" fill="url(#cz-volv-brass)" stroke={INK_DARK} strokeWidth="0.8" />
          <line x1={CX - 3.4} y1={CY} x2={CX + 3.4} y2={CY} stroke={INK_DARK} strokeWidth="0.7" opacity="0.7" />
          <ellipse className="cz-volv-gleam" cx={CX - 1.6} cy={CY - 1.8} rx="1.6" ry="1" fill="#fff6d8" />
        </g>

        {/* ============ the Hermit, manuscript ink, bottom margin ============ */}
        <g className="cz-volv-figure">
          {/* ground hatch */}
          <path d="M 116 392 L 186 392" stroke={INK_DARK} strokeWidth="1" opacity="0.7" />
          <path d="M 126 395 L 132 392 M 150 396 L 156 392 M 170 395 L 176 392" stroke={INK_DARK} strokeWidth="0.6" opacity="0.5" />

          {/* staff in the left hand */}
          <line x1="126" y1="330" x2="135" y2="390" stroke={INK_DARK} strokeWidth="1.7" strokeLinecap="round" />

          {/* hooded robe */}
          <path
            d="M 140 352 Q 134 370 136 390 L 166 390 Q 168 370 162 352"
            fill={PAPER}
            stroke={INK_DARK}
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M 140 354 Q 139 333 151 330 Q 163 333 162 354"
            fill={PAPER}
            stroke={INK_DARK}
            strokeWidth="1.7"
          />
          <ellipse cx="151" cy="343" rx="5.2" ry="6.4" fill={INK_DARK} opacity="0.9" />
          {/* robe fold shading */}
          <path d="M 143 360 Q 141 374 142 386" fill="none" stroke={INK} strokeWidth="0.8" opacity="0.6" />
          <path d="M 149 364 Q 148 376 148 386" fill="none" stroke={INK} strokeWidth="0.6" opacity="0.5" />

          {/* right arm raised toward the instrument */}
          <path d="M 160 358 Q 170 344 177 330" fill="none" stroke={INK_DARK} strokeWidth="1.7" strokeLinecap="round" />

          {/* lantern, gold leaf, held up toward the discs */}
          <line x1="181" y1="312" x2="181" y2="315" stroke={INK_DARK} strokeWidth="1" />
          <path
            d="M 175 315 L 187 315 L 185 328 L 177 328 Z"
            fill={GOLD}
            stroke={INK_DARK}
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <path d="M 177 315 L 179 311 L 183 311 L 185 315" fill="none" stroke={INK_DARK} strokeWidth="0.9" />
          <path d="M 181 318.5 L 182.6 322 L 181 325.5 L 179.4 322 Z" fill="#fff6d8" />
          {/* faint glow rays */}
          <g stroke={GOLD} strokeWidth="0.7" opacity="0.45">
            <path d="M 171 318 L 166 316" />
            <path d="M 191 318 L 196 316" />
            <path d="M 181 306 L 181 301" />
          </g>
        </g>

        {/* marginal crosses flanking the title */}
        <g stroke={RUBRIC} strokeWidth="1.1" opacity="0.9">
          <path d="M 58 412 h 8 M 62 408 v 8" />
          <path d="M 234 412 h 8 M 238 408 v 8" />
        </g>

        {/* title + note */}
        <text
          x="150"
          y="419"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontWeight="700"
          fontSize="16"
          letterSpacing="5"
          fill={INK_DARK}
        >
          THE HERMIT
        </text>
        <text
          x="150"
          y="432"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontStyle="italic"
          fontSize="8.5"
          letterSpacing="1.5"
          fill={INK}
          opacity="0.8"
        >
          volvella · nona
        </text>
      </svg>
    </figure>
  );
}
