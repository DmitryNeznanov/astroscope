// ASTROLABE — The Hermit (IX)
// Medieval astronomical manuscript page: aged parchment, the Hermit scene
// enclosed in an astrolabe construction (mater ring with degree scale, rete
// arcs, alidade rule bar), figure drawn in iron-gall ink with lapis + gold
// accents. Server-component safe: no hooks, no client directive.

const CENTER_X = 150;
const CENTER_Y = 225;

const TICKS = Array.from({ length: 72 }, (_, i) => i * 5);
const DEGREE_NUMBERS = Array.from({ length: 12 }, (_, i) => i * 30);

const INK = "#3a2a1c";
const INK_DARK = "#2c1d12";
const LAPIS = "#274690";
const GOLD = "#c9a227";
const RUBRIC = "#a32c1e";

export default function AstrolabeHermitCard() {
  return (
    <figure
      className="cz-astro-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
    >
      <style>{`
        .cz-astro-card { position: relative; overflow: hidden; }
        .cz-astro-card svg { display: block; width: 100%; height: 100%; }

        .cz-astro-ring-a,
        .cz-astro-ring-b,
        .cz-astro-rete-load,
        .cz-astro-alidade {
          transform-box: fill-box;
          transform-origin: center;
          transform: rotate(var(--cz-final, 0deg));
          animation: cz-astro-ring-in 1.1s cubic-bezier(.22,.8,.3,1) backwards;
        }
        .cz-astro-ring-a     { --cz-ra: -16deg; animation-delay: 0s; }
        .cz-astro-ring-b     { --cz-ra: 13deg;  animation-delay: .3s; }
        .cz-astro-rete-load  { --cz-ra: -9deg;  animation-delay: .6s; }
        .cz-astro-alidade    { --cz-ra: 11deg; --cz-final: -15deg; animation-delay: .8s; }

        .cz-astro-figure {
          animation: cz-astro-ink-in 1s ease-out 1.15s backwards;
        }
        .cz-astro-rete-drift {
          transform-box: view-box;
          transform-origin: 150px 225px;
          animation: cz-astro-drift 120s linear infinite;
        }

        @keyframes cz-astro-ring-in {
          from { opacity: 0; transform: rotate(calc(var(--cz-final, 0deg) + var(--cz-ra, 12deg))) scale(.985); }
          to   { opacity: 1; transform: rotate(var(--cz-final, 0deg)) scale(1); }
        }
        @keyframes cz-astro-ink-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cz-astro-drift {
          to { transform: rotate(360deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .cz-astro-ring-a,
          .cz-astro-ring-b,
          .cz-astro-rete-load,
          .cz-astro-alidade,
          .cz-astro-figure,
          .cz-astro-rete-drift {
            animation: none;
          }
        }
      `}</style>

      <svg
        viewBox="0 0 300 450"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="The Hermit, tarot card nine, drawn as a medieval astrolabe manuscript"
      >
        <defs>
          <radialGradient id="cz-astro-parchment" cx="50%" cy="42%" r="75%">
            <stop offset="0%" stopColor="#f4ebd2" />
            <stop offset="70%" stopColor="#f0e6cc" />
            <stop offset="100%" stopColor="#e0d0a8" />
          </radialGradient>
        </defs>

        {/* aged parchment ground */}
        <rect x="0" y="0" width="300" height="450" fill="url(#cz-astro-parchment)" />
        {/* subtle stains */}
        <ellipse cx="58" cy="382" rx="46" ry="26" fill="#b89b5e" opacity="0.09" />
        <ellipse cx="252" cy="72" rx="38" ry="22" fill="#b89b5e" opacity="0.07" />
        <ellipse cx="238" cy="330" rx="30" ry="44" fill="#a8894e" opacity="0.06" />
        <ellipse cx="70" cy="120" rx="26" ry="18" fill="#a8894e" opacity="0.06" />

        {/* double manuscript frame */}
        <rect x="10" y="10" width="280" height="430" fill="none" stroke={INK} strokeWidth="1.6" opacity="0.85" />
        <rect x="15" y="15" width="270" height="420" fill="none" stroke={INK} strokeWidth="0.6" opacity="0.6" />

        {/* decorated initial box: IX in lapis + gold */}
        <g>
          <rect x="112" y="22" width="76" height="46" fill="#24407c" stroke={GOLD} strokeWidth="2" />
          <rect x="116" y="26" width="68" height="38" fill="none" stroke={GOLD} strokeWidth="0.7" opacity="0.8" />
          <circle cx="121" cy="31" r="1.4" fill={GOLD} />
          <circle cx="179" cy="31" r="1.4" fill={GOLD} />
          <circle cx="121" cy="59" r="1.4" fill={GOLD} />
          <circle cx="179" cy="59" r="1.4" fill={GOLD} />
          <text
            x="150"
            y="55"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="700"
            fontSize="26"
            fill="#e8c76a"
          >
            IX
          </text>
        </g>

        {/* ring A: mater with degree scale */}
        <g className="cz-astro-ring-a">
          <circle cx={CENTER_X} cy={CENTER_Y} r="115" fill="none" stroke={INK} strokeWidth="2.2" />
          <circle cx={CENTER_X} cy={CENTER_Y} r="104" fill="none" stroke={INK} strokeWidth="0.9" />
          {TICKS.map((a) => {
            const major = a % 30 === 0;
            const inner = major ? 100 : 106;
            return (
              <g key={a} transform={`rotate(${a} ${CENTER_X} ${CENTER_Y})`}>
                <line
                  x1={CENTER_X}
                  y1={CENTER_Y - 104}
                  x2={CENTER_X}
                  y2={CENTER_Y - inner}
                  stroke={INK}
                  strokeWidth={major ? 1.1 : 0.5}
                />
              </g>
            );
          })}
          {DEGREE_NUMBERS.map((a) => (
            <g key={a} transform={`rotate(${a} ${CENTER_X} ${CENTER_Y})`}>
              <text
                x={CENTER_X}
                y={CENTER_Y - 92}
                textAnchor="middle"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontSize="6.5"
                fill={INK}
              >
                {a}
              </text>
            </g>
          ))}
        </g>

        {/* ring B: tympan climate circles */}
        <g className="cz-astro-ring-b">
          <circle cx={CENTER_X} cy={CENTER_Y} r="86" fill="none" stroke={INK} strokeWidth="1" />
          <circle cx={CENTER_X} cy={CENTER_Y} r="74" fill="none" stroke={INK} strokeWidth="0.7" />
          <circle cx={CENTER_X} cy={CENTER_Y} r="63" fill="none" stroke={INK} strokeWidth="0.5" opacity="0.7" />
        </g>

        {/* rete: load wrapper + extremely slow ambient drift */}
        <g className="cz-astro-rete-load">
          <g className="cz-astro-rete-drift">
            {/* vesica arcs */}
            <path
              d={`M ${CENTER_X - 66} ${CENTER_Y} A 86 86 0 0 1 ${CENTER_X + 66} ${CENTER_Y}`}
              fill="none"
              stroke={INK}
              strokeWidth="0.9"
            />
            <path
              d={`M ${CENTER_X - 66} ${CENTER_Y} A 86 86 0 0 0 ${CENTER_X + 66} ${CENTER_Y}`}
              fill="none"
              stroke={INK}
              strokeWidth="0.9"
            />
            {/* offset ecliptic circle */}
            <circle cx={CENTER_X} cy={CENTER_Y - 14} r="40" fill="none" stroke={INK} strokeWidth="0.8" />
            {/* star pointers on the rete */}
            <g stroke={INK} strokeWidth="0.8" fill="none">
              <path d={`M ${CENTER_X} ${CENTER_Y - 62} l 2.2 4.5 l -2.2 4.5 l -2.2 -4.5 Z`} fill={INK} />
              <path d={`M ${CENTER_X - 52} ${CENTER_Y + 38} l 2.2 4.5 l -2.2 4.5 l -2.2 -4.5 Z`} fill={INK} />
              <path d={`M ${CENTER_X + 52} ${CENTER_Y + 38} l 2.2 4.5 l -2.2 4.5 l -2.2 -4.5 Z`} fill={INK} />
            </g>
          </g>
        </g>

        {/* the Hermit, inked in iron-gall with lapis + gold accents */}
        <g className="cz-astro-figure">
          {/* mountain peak */}
          <path
            d={`M ${CENTER_X} 284 L 116 304 L 184 304 Z`}
            fill="none"
            stroke={INK_DARK}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M 138 296 L 132 304 M 150 292 L 150 304 M 162 296 L 168 304" stroke={INK_DARK} strokeWidth="0.7" opacity="0.7" />

          {/* staff in the left hand */}
          <line x1="125" y1="216" x2="133" y2="290" stroke={INK_DARK} strokeWidth="1.8" strokeLinecap="round" />

          {/* hooded robe silhouette */}
          <path
            d="M 138 236 Q 132 260 134 288 L 166 288 Q 168 260 162 236"
            fill="#f0e6cc"
            stroke={INK_DARK}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* hood */}
          <path
            d="M 138 238 Q 137 216 150 213 Q 163 216 162 238"
            fill="#f0e6cc"
            stroke={INK_DARK}
            strokeWidth="1.8"
          />
          {/* shadowed face opening */}
          <ellipse cx="150" cy="228" rx="5.4" ry="6.6" fill={INK_DARK} opacity="0.9" />

          {/* lapis robe shading */}
          <path d="M 141 244 Q 139 264 140 284" fill="none" stroke={LAPIS} strokeWidth="1.2" opacity="0.85" />
          <path d="M 147 248 Q 146 266 146 284" fill="none" stroke={LAPIS} strokeWidth="0.9" opacity="0.7" />

          {/* raised right arm */}
          <path d="M 160 244 Q 170 234 177 222" fill="none" stroke={INK_DARK} strokeWidth="1.8" strokeLinecap="round" />

          {/* gold-leaf lantern with a small star inside */}
          <line x1="182" y1="202" x2="182" y2="205" stroke={INK_DARK} strokeWidth="1" />
          <path
            d="M 176 205 L 188 205 L 186 218 L 178 218 Z"
            fill={GOLD}
            stroke={INK_DARK}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path d="M 178 205 L 180 201 L 184 201 L 186 205" fill="none" stroke={INK_DARK} strokeWidth="1" />
          <path d="M 182 208.5 L 183.6 212 L 182 215.5 L 180.4 212 Z" fill="#fff6d8" />
        </g>

        {/* alidade rule bar across the instrument */}
        <g className="cz-astro-alidade">
          <path
            d={`M 45 ${CENTER_Y} L 72 ${CENTER_Y - 3.5} L 228 ${CENTER_Y - 3.5} L 255 ${CENTER_Y} L 228 ${CENTER_Y + 3.5} L 72 ${CENTER_Y + 3.5} Z`}
            fill="#f0e6cc"
            fillOpacity="0.55"
            stroke={INK}
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <line x1="150" y1={CENTER_Y - 3.5} x2="150" y2={CENTER_Y + 3.5} stroke={INK} strokeWidth="0.6" />
        </g>

        {/* marginal stars */}
        <g fill={INK} opacity="0.85">
          <path d="M 42 116 L 44 121 L 42 126 L 40 121 Z" />
          <path d="M 260 140 L 262 145 L 260 150 L 258 145 Z" />
          <path d="M 48 330 L 50 335 L 48 340 L 46 335 Z" />
        </g>
        <path d="M 254 312 L 256.4 318 L 254 324 L 251.6 318 Z" fill={RUBRIC} opacity="0.9" />

        {/* latin-ish marginal annotation */}
        <text
          x="150"
          y="366"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontStyle="italic"
          fontSize="11"
          letterSpacing="2"
          fill={INK}
          opacity="0.9"
        >
          · eremita in monte ·
        </text>

        {/* rubrication rules + blackletter-feel title */}
        <g>
          <line x1="58" y1="390" x2="242" y2="390" stroke={RUBRIC} strokeWidth="1.4" />
          <path d="M 50 390 L 54 386.5 L 58 390 L 54 393.5 Z" fill={RUBRIC} />
          <path d="M 242 390 L 246 386.5 L 250 390 L 246 393.5 Z" fill={RUBRIC} />
          <text
            x="150"
            y="416"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="700"
            fontSize="19"
            letterSpacing="5"
            fill={INK_DARK}
          >
            THE HERMIT
          </text>
          <line x1="58" y1="428" x2="242" y2="428" stroke={RUBRIC} strokeWidth="1.4" />
          <path d="M 50 428 L 54 424.5 L 58 428 L 54 431.5 Z" fill={RUBRIC} />
          <path d="M 242 428 L 246 424.5 L 250 428 L 246 431.5 Z" fill={RUBRIC} />
        </g>
      </svg>
    </figure>
  );
}
