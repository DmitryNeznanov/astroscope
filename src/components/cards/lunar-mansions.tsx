// LUNAR MANSIONS — The Hermit (IX)
// Medieval Arabic-astronomy plate: aged parchment, sepia ink, gold accents.
// The 28 Mansions of the Moon wheel — thin radial sectors numbered 1-28 in
// old-style serif, each with a tiny moon-phase icon showing the moon's age in
// that mansion; inner ring of the 7 planetary rulers (each ruling 4 mansions
// in sequence); at the hub the Hermit with his lantern standing inside a
// crescent moon. The 9th mansion is gilded. Kufic-esque interlace-square
// corner ornaments. Server-component safe: no hooks, no client directive.

const CX = 150;
const CY = 238;
const STEP = 360 / 28; // degrees per mansion

const SECTORS = Array.from({ length: 28 }, (_, i) => i + 1);
// the seven planetary rulers, in mansion sequence (U+FE0E after every glyph)
const RULERS = ["☉\uFE0E", "☽\uFE0E", "☿\uFE0E", "♀\uFE0E", "♂\uFE0E", "♃\uFE0E", "♄\uFE0E"];

const INK = "#4a3423";
const SEPIA = "#5c422a";
const GOLD = "#b8922e";
const GOLD_PALE = "#e9cf8a";
const RUBRIC = "#8f2f1c";

// Illuminated-region path of a moon disc of radius r at phase p (0 = new, .5 = full).
function moonLitPath(p: number, r: number): string {
  const f = (1 - Math.cos(2 * Math.PI * p)) / 2; // illuminated fraction
  const e = Math.abs(r * Math.cos(2 * Math.PI * p)); // terminator semi-axis
  const rr = r.toFixed(2);
  const ee = e.toFixed(2);
  if (p <= 0.5) {
    // waxing: light on the right
    return `M 0 ${-r} A ${rr} ${rr} 0 0 1 0 ${r} A ${ee} ${rr} 0 0 ${f > 0.5 ? 1 : 0} 0 ${-r} Z`;
  }
  // waning: light on the left
  return `M 0 ${-r} A ${rr} ${rr} 0 0 0 0 ${r} A ${ee} ${rr} 0 0 ${f > 0.5 ? 0 : 1} 0 ${-r} Z`;
}

// Annular sector path (mansion band between radii 77 and 103) for one step.
function mansionWedge(): string {
  const a = (STEP * Math.PI) / 180;
  const x1 = CX + 103 * Math.sin(a);
  const y1 = CY - 103 * Math.cos(a);
  const x2 = CX + 77 * Math.sin(a);
  const y2 = CY - 77 * Math.cos(a);
  return `M ${CX} ${CY - 103} A 103 103 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)} A 77 77 0 0 0 ${CX} ${CY - 77} Z`;
}

const WEDGE = mansionWedge();

export default function LunarMansionsHermitCard() {
  return (
    <figure
      className="cz-lmans-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
    >
      <style>{`
        .cz-lmans-card { position: relative; overflow: hidden; }
        .cz-lmans-card svg { display: block; width: 100%; height: 100%; }

        /* load: 28 sectors reveal in quick sequence around the wheel (~1.6s) */
        .cz-lmans-sector {
          transform-box: view-box;
          transform-origin: 150px 238px;
          animation: cz-lmans-sector-in .32s cubic-bezier(.3,.7,.4,1) backwards;
        }
        .cz-lmans-gilt {
          animation: cz-lmans-fade-in .6s ease-out .55s backwards;
        }
        .cz-lmans-hub {
          animation: cz-lmans-fade-in .8s ease-out 1.45s backwards;
        }

        /* ambient: the whole wheel breathes, the gilded mansion glows softly */
        .cz-lmans-breath {
          transform-box: view-box;
          transform-origin: 150px 238px;
          animation: cz-lmans-breathe 30s ease-in-out infinite alternate;
        }
        .cz-lmans-glow {
          animation: cz-lmans-glow 12s ease-in-out infinite alternate;
        }

        @keyframes cz-lmans-sector-in {
          from { opacity: 0; transform: scale(.965); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes cz-lmans-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cz-lmans-breathe {
          from { transform: scale(1); }
          to   { transform: scale(1.005); }
        }
        @keyframes cz-lmans-glow {
          from { opacity: .18; }
          to   { opacity: .5; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cz-lmans-sector,
          .cz-lmans-gilt,
          .cz-lmans-hub,
          .cz-lmans-breath,
          .cz-lmans-glow {
            animation: none;
          }
        }
      `}</style>

      <svg
        viewBox="0 0 300 450"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="The Hermit, tarot card nine, drawn as a medieval wheel of the twenty-eight mansions of the moon"
      >
        <defs>
          <radialGradient id="cz-lmans-parch" cx="50%" cy="44%" r="78%">
            <stop offset="0%" stopColor="#f2e8cd" />
            <stop offset="70%" stopColor="#eee2c2" />
            <stop offset="100%" stopColor="#dcc79c" />
          </radialGradient>
          <linearGradient id="cz-lmans-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d9b45c" />
            <stop offset="55%" stopColor="#b8922e" />
            <stop offset="100%" stopColor="#8f6d1c" />
          </linearGradient>
          {/* crescent: full disc minus an offset disc */}
          <mask id="cz-lmans-cmask">
            <circle cx={CX} cy={CY} r="30" fill="#fff" />
            <circle cx={CX} cy={CY - 12} r="26" fill="#000" />
          </mask>
          {/* kufic-esque corner ornament: interlaced squares */}
          <g id="cz-lmans-knot" fill="none">
            <rect x="-9" y="-9" width="18" height="18" stroke={INK} strokeWidth="0.9" />
            <rect x="-9" y="-9" width="18" height="18" transform="rotate(45)" stroke={INK} strokeWidth="0.9" />
            <rect x="-3.5" y="-3.5" width="7" height="7" stroke={GOLD} strokeWidth="0.8" />
          </g>
        </defs>

        {/* aged parchment ground + faint stains */}
        <rect x="0" y="0" width="300" height="450" fill="url(#cz-lmans-parch)" />
        <ellipse cx="52" cy="388" rx="42" ry="24" fill="#a8894e" opacity="0.08" />
        <ellipse cx="256" cy="86" rx="34" ry="20" fill="#a8894e" opacity="0.07" />
        <ellipse cx="246" cy="352" rx="28" ry="38" fill="#9a7c44" opacity="0.06" />

        {/* thin double frame */}
        <rect x="8" y="8" width="284" height="434" fill="none" stroke={INK} strokeWidth="1.4" opacity="0.85" />
        <rect x="13" y="13" width="274" height="424" fill="none" stroke={INK} strokeWidth="0.55" opacity="0.6" />

        {/* interlace-square corner ornaments */}
        <use href="#cz-lmans-knot" transform="translate(30 30)" />
        <use href="#cz-lmans-knot" transform="translate(270 30)" />
        <use href="#cz-lmans-knot" transform="translate(30 420)" />
        <use href="#cz-lmans-knot" transform="translate(270 420)" />

        {/* decorated box with the card number */}
        <g>
          <rect x="118" y="24" width="64" height="34" fill="#efe3c2" stroke={GOLD} strokeWidth="1.6" />
          <rect x="122" y="28" width="56" height="26" fill="none" stroke={GOLD} strokeWidth="0.6" opacity="0.8" />
          <circle cx="126.5" cy="32.5" r="1.1" fill={GOLD} />
          <circle cx="173.5" cy="32.5" r="1.1" fill={GOLD} />
          <circle cx="126.5" cy="49.5" r="1.1" fill={GOLD} />
          <circle cx="173.5" cy="49.5" r="1.1" fill={GOLD} />
          <text
            x="150"
            y="47"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="700"
            fontSize="19"
            fill={SEPIA}
          >
            IX
          </text>
          {/* small diamonds flanking the box */}
          <path d="M 98 41 L 101 37.5 L 104 41 L 101 44.5 Z" fill={GOLD} />
          <path d="M 196 41 L 199 37.5 L 202 41 L 199 44.5 Z" fill={GOLD} />
        </g>

        {/* the mansions wheel, breathing very slowly */}
        <g className="cz-lmans-breath">
          {/* base rings of the plate */}
          <circle cx={CX} cy={CY} r="103" fill="none" stroke={INK} strokeWidth="1.8" />
          <circle cx={CX} cy={CY} r="99.5" fill="none" stroke={INK} strokeWidth="0.5" opacity="0.6" />
          <circle cx={CX} cy={CY} r="77" fill="none" stroke={INK} strokeWidth="1.1" />
          <circle cx={CX} cy={CY} r="74" fill="none" stroke={GOLD} strokeWidth="0.6" opacity="0.8" />
          <circle cx={CX} cy={CY} r="52" fill="none" stroke={INK} strokeWidth="1" />
          <circle cx={CX} cy={CY} r="43" fill="none" stroke={INK} strokeWidth="0.5" opacity="0.6" />

          {/* boundary ticks between each ruler's four-mansion span */}
          {SECTORS.map((i) => (
            <g key={`tk${i}`} transform={`rotate(${(i - 1) * STEP} ${CX} ${CY})`}>
              <line x1={CX} y1={CY - 74} x2={CX} y2={CY - 52} stroke={INK} strokeWidth="0.4" opacity="0.5" />
            </g>
          ))}

          {/* the gilded 9th mansion, beneath the sector ink */}
          <g transform={`rotate(${8 * STEP} ${CX} ${CY})`}>
            <g className="cz-lmans-gilt">
              <path d={WEDGE} fill="url(#cz-lmans-gold)" opacity="0.55" stroke={GOLD} strokeWidth="0.9" />
            </g>
            <path d={WEDGE} fill={GOLD_PALE} className="cz-lmans-glow" />
          </g>

          {/* 28 sectors: divider line, old-style numeral, moon-age icon */}
          {SECTORS.map((i) => {
            const mid = (i - 0.5) * STEP;
            const flip = mid > 90 && mid < 270;
            const numY = CY - 90;
            return (
              <g key={i} transform={`rotate(${(i - 1) * STEP} ${CX} ${CY})`}>
                <g
                  className="cz-lmans-sector"
                  style={{ animationDelay: `${((i - 1) * 0.048).toFixed(3)}s` }}
                >
                  <line x1={CX} y1={CY - 103} x2={CX} y2={CY - 77} stroke={INK} strokeWidth="0.55" />
                  <g transform={`rotate(${STEP / 2} ${CX} ${CY})`}>
                    <g transform={flip ? `rotate(180 ${CX} ${numY})` : undefined}>
                      <text
                        x={CX}
                        y={numY + 2}
                        textAnchor="middle"
                        fontFamily="Georgia, 'Times New Roman', serif"
                        fontSize="6.4"
                        fill={i === 9 ? "#6b4d10" : SEPIA}
                        fontWeight={i === 9 ? "700" : "400"}
                      >
                        {i}
                      </text>
                    </g>
                    {/* tiny moon showing the moon's age in this mansion */}
                    <g transform={`translate(${CX} ${CY - 81.5})`}>
                      <circle r="4.1" fill="#4a3826" fillOpacity="0.5" stroke={INK} strokeWidth="0.55" />
                      <path d={moonLitPath((i - 1) / 28, 4.1)} fill="#f3e6bd" />
                    </g>
                  </g>
                </g>
              </g>
            );
          })}

          {/* inner ring: the seven planetary rulers in sequence */}
          {RULERS.map((g, k) => {
            const a = (4 * k + 2) * STEP; // mid of this ruler's four mansions
            const flip = a > 90 && a < 270;
            return (
              <g key={k} transform={`rotate(${a} ${CX} ${CY})`}>
                <g transform={flip ? `rotate(180 ${CX} ${CY - 63})` : undefined}>
                  <text
                    x={CX}
                    y={CY - 63 + 3}
                    textAnchor="middle"
                    fontFamily="Georgia, 'DejaVu Sans', 'Segoe UI Symbol', serif"
                    fontSize="9.5"
                    fill={INK}
                  >
                    {g}
                  </text>
                </g>
              </g>
            );
          })}

          {/* hub: the Hermit with his lantern inside a crescent moon */}
          <g className="cz-lmans-hub">
            <circle cx={CX} cy={CY} r="40" fill="#f0e4c4" stroke={GOLD} strokeWidth="1.1" />
            <circle cx={CX} cy={CY} r="36.5" fill="none" stroke={INK} strokeWidth="0.45" opacity="0.55" />
            {/* gilded crescent, horns upward */}
            <circle cx={CX} cy={CY} r="30" fill="url(#cz-lmans-gold)" mask="url(#cz-lmans-cmask)" opacity="0.9" />
            {/* staff in the left hand */}
            <line x1="141" y1="218" x2="143.5" y2="252" stroke={SEPIA} strokeWidth="1.3" strokeLinecap="round" />
            {/* hooded robe */}
            <path
              d="M 144 252 Q 142 232 145.5 223 Q 147.5 215.5 150.5 215 Q 153.5 215.5 155.5 223 Q 159 232 157 252 Z"
              fill="#3c2b1a"
              stroke={SEPIA}
              strokeWidth="0.7"
              strokeLinejoin="round"
            />
            {/* shadowed face opening */}
            <ellipse cx="150.5" cy="223.5" rx="2.6" ry="3.4" fill="#1d130a" />
            {/* lantern, a small gold light */}
            <line x1="156" y1="229" x2="159.5" y2="233" stroke={SEPIA} strokeWidth="0.8" />
            <circle cx="160.5" cy="236" r="4.5" fill={GOLD_PALE} opacity="0.35" />
            <path
              d="M 158 233.5 L 163 233.5 L 162.2 239.5 L 158.8 239.5 Z"
              fill={GOLD}
              stroke={SEPIA}
              strokeWidth="0.6"
              strokeLinejoin="round"
            />
            <circle cx="160.5" cy="236.5" r="0.9" fill="#fff6d8" />
          </g>
        </g>

        {/* rubrication + title */}
        <g>
          <line x1="64" y1="368" x2="236" y2="368" stroke={RUBRIC} strokeWidth="1.1" />
          <path d="M 56 368 L 60 364.8 L 64 368 L 60 371.2 Z" fill={RUBRIC} />
          <path d="M 236 368 L 240 364.8 L 244 368 L 240 371.2 Z" fill={RUBRIC} />
          <text
            x="150"
            y="394"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="700"
            fontSize="18"
            letterSpacing="5"
            fill="#2f2013"
          >
            THE HERMIT
          </text>
          <text
            x="150"
            y="412"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fontSize="10"
            letterSpacing="2.5"
            fill={SEPIA}
            opacity="0.95"
          >
            · mansiones lunae ·
          </text>
          <line x1="64" y1="424" x2="236" y2="424" stroke={RUBRIC} strokeWidth="1.1" />
          <path d="M 56 424 L 60 420.8 L 64 424 L 60 427.2 Z" fill={RUBRIC} />
          <path d="M 236 424 L 240 420.8 L 244 424 L 240 427.2 Z" fill={RUBRIC} />
        </g>
      </svg>
    </figure>
  );
}
