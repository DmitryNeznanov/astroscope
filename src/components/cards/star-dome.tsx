// STAR DOME — The Hermit (IX)
// A planetarium dome projection: near-black blue dome interior, cool
// white/cyan projection light. A great dome arc spans the card with a faint
// altitude/azimuth graticule; classical constellation figures (Virgo, Lyra,
// Corvus) are projected in faint glowing line work while the HERMIT
// constellation burns brightest, his lantern the brightest projected point,
// gently pulsing like a projector highlight. Horizon line with silhouetted
// hills at the bottom. Load: dome powers on — graticule fades in,
// constellations flicker on one by one like a warming projector lamp.
// Ambient: slow projector shimmer, occasional shooting star.
// Server-component safe: no hooks, no client directive.

const PROJECTION = "#bfe3f7";
const PROJECTION_BRIGHT = "#eaf7ff";
const INK = "#0b1424";

// background star field (fixed, hand-scattered so it feels like a real sky)
const STARS: Array<[number, number, number]> = [
  [38, 88, 0.9], [72, 62, 0.6], [112, 96, 0.8], [196, 78, 0.7],
  [236, 96, 1.0], [262, 64, 0.6], [52, 178, 0.7], [96, 142, 0.5],
  [132, 66, 0.9], [168, 110, 0.5], [212, 132, 0.8], [254, 176, 0.6],
  [30, 246, 0.8], [64, 288, 0.5], [104, 262, 0.7], [200, 250, 0.6],
  [244, 296, 0.8], [272, 246, 0.5], [142, 336, 0.6], [88, 330, 0.7],
  [206, 330, 0.5], [266, 128, 0.7], [26, 140, 0.5], [176, 46, 0.8],
  [120, 34, 0.5], [222, 40, 0.6], [44, 336, 0.6], [258, 336, 0.7],
];

// altitude circles of the graticule (radii about the dome center)
const ALT_RADII = [80, 140, 200];

// azimuth curves converging at the zenith
const AZIMUTHS: Array<[number, number]> = [
  [40, 60], [90, 110], [210, 190], [260, 240],
];

export default function StarDomeHermitCard() {
  return (
    <figure
      className="cz-dome-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
    >
      <style>{`
        .cz-dome-card { position: relative; overflow: hidden; background: #04070f; }
        .cz-dome-card svg { display: block; width: 100%; height: 100%; }

        /* ---- LOAD: dome powers on ---- */
        .cz-dome-load-grat { animation: cz-dome-fade .9s ease-out backwards; }
        .cz-dome-load-stars { animation: cz-dome-fade 1s ease-out .1s backwards; }
        .cz-dome-load-virgo { animation: cz-dome-flicker .55s linear .45s backwards; }
        .cz-dome-load-lyra  { animation: cz-dome-flicker .55s linear .7s backwards; }
        .cz-dome-load-corvus { animation: cz-dome-flicker .55s linear .95s backwards; }
        .cz-dome-load-hermit { animation: cz-dome-flicker .6s linear 1.2s backwards; }
        .cz-dome-load-text { animation: cz-dome-fade .7s ease-out 1.35s backwards; }
        .cz-dome-load-horizon { animation: cz-dome-fade .8s ease-out .25s backwards; }

        @keyframes cz-dome-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cz-dome-flicker {
          0%   { opacity: 0; }
          25%  { opacity: .75; }
          40%  { opacity: .2; }
          58%  { opacity: .95; }
          74%  { opacity: .45; }
          100% { opacity: 1; }
        }

        /* ---- AMBIENT: projector shimmer + lantern pulse + shooting star ---- */
        .cz-dome-shimmer { animation: cz-dome-shimmer 26s ease-in-out infinite; }
        .cz-dome-shimmer-b { animation: cz-dome-shimmer 31s ease-in-out -12s infinite; }
        .cz-dome-lantern { animation: cz-dome-lantern 15s ease-in-out infinite; }
        .cz-dome-meteor {
          transform-box: view-box;
          animation: cz-dome-meteor 18s linear infinite;
        }

        @keyframes cz-dome-shimmer {
          0%, 100% { opacity: 1; }
          50%      { opacity: .82; }
        }
        @keyframes cz-dome-lantern {
          0%, 100% { opacity: .55; }
          50%      { opacity: 1; }
        }
        @keyframes cz-dome-meteor {
          0%    { opacity: 0; transform: translate(0, 0); }
          2%    { opacity: .9; }
          7%    { opacity: 0; transform: translate(150px, 74px); }
          100%  { opacity: 0; transform: translate(150px, 74px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .cz-dome-load-grat,
          .cz-dome-load-stars,
          .cz-dome-load-virgo,
          .cz-dome-load-lyra,
          .cz-dome-load-corvus,
          .cz-dome-load-hermit,
          .cz-dome-load-text,
          .cz-dome-load-horizon,
          .cz-dome-shimmer,
          .cz-dome-shimmer-b,
          .cz-dome-lantern,
          .cz-dome-meteor {
            animation: none;
          }
          .cz-dome-meteor { opacity: 0; }
        }
      `}</style>

      <svg
        viewBox="0 0 300 450"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="The Hermit, tarot card nine, projected as constellations inside a planetarium star dome"
      >
        <defs>
          <radialGradient id="cz-dome-sky" cx="50%" cy="38%" r="85%">
            <stop offset="0%" stopColor="#0d1830" />
            <stop offset="55%" stopColor="#081120" />
            <stop offset="100%" stopColor="#04070f" />
          </radialGradient>
          <radialGradient id="cz-dome-lantern-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#eaf7ff" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#bfe3f7" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#bfe3f7" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cz-dome-meteor-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#eaf7ff" stopOpacity="0" />
            <stop offset="100%" stopColor="#eaf7ff" stopOpacity="0.9" />
          </linearGradient>
          {/* soft projection glow bleeding from the card edges */}
          <radialGradient id="cz-dome-edge" cx="50%" cy="50%" r="72%">
            <stop offset="78%" stopColor="#04070f" stopOpacity="0" />
            <stop offset="100%" stopColor="#02040a" stopOpacity="0.85" />
          </radialGradient>
          <filter id="cz-dome-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="cz-dome-glow-strong" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* dome interior sky */}
        <rect x="0" y="0" width="300" height="450" fill="url(#cz-dome-sky)" />

        {/* faint background star field */}
        <g className="cz-dome-load-stars" fill={PROJECTION}>
          {STARS.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r * 0.7} opacity={0.28 + r * 0.25} />
          ))}
        </g>

        {/* coordinate graticule: great dome arc, altitude circles, azimuth curves */}
        <g
          className="cz-dome-load-grat"
          fill="none"
          stroke={PROJECTION}
          strokeWidth="0.5"
          opacity="0.32"
        >
          <path d="M 20 372 A 260 260 0 0 1 280 372" strokeWidth="0.8" opacity="0.9" />
          {ALT_RADII.map((r) => (
            <path key={r} d={`M ${150 - r} 372 A ${r} ${r} 0 0 1 ${150 + r} 372`} />
          ))}
          {AZIMUTHS.map(([hx, cx]) => (
            <path key={hx} d={`M ${hx} 372 Q ${cx} 240 150 112`} />
          ))}
          {/* zenith marker */}
          <line x1="146" y1="112" x2="154" y2="112" strokeWidth="0.7" />
          <line x1="150" y1="108" x2="150" y2="116" strokeWidth="0.7" />
        </g>

        {/* shooting star, crosses the upper dome every 18s */}
        <g className="cz-dome-meteor" opacity="0">
          <line
            x1="36"
            y1="96"
            x2="78"
            y2="117"
            stroke="url(#cz-dome-meteor-grad)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </g>

        {/* VIRGO — the maiden, faint projection, upper left */}
        <g className="cz-dome-load-virgo">
          <g
            className="cz-dome-shimmer"
            filter="url(#cz-dome-glow)"
            stroke={PROJECTION}
            strokeWidth="0.7"
            fill="none"
            opacity="0.55"
          >
            <path d="M 70 130 L 82 148 L 76 190 L 62 225" />
            <path d="M 82 148 L 48 150" />
            <path d="M 76 190 L 92 222" />
            <path d="M 76 190 L 105 185 L 82 148" />
            <g fill={PROJECTION} stroke="none">
              <circle cx="70" cy="130" r="1.5" />
              <circle cx="82" cy="148" r="1.3" />
              <circle cx="48" cy="150" r="1.2" />
              <circle cx="76" cy="190" r="1.4" />
              <circle cx="62" cy="225" r="1.1" />
              <circle cx="92" cy="222" r="1.1" />
              <circle cx="105" cy="185" r="1.3" />
            </g>
          </g>
          <text
            x="42"
            y="240"
            fontFamily="'Helvetica Neue', Arial, sans-serif"
            fontSize="6"
            letterSpacing="1.6"
            fill={PROJECTION}
            opacity="0.45"
          >
            {"♍\uFE0E VIRGO"}
          </text>
        </g>

        {/* LYRA — the lyre, faint projection, lower right */}
        <g className="cz-dome-load-lyra">
          <g
            className="cz-dome-shimmer-b"
            filter="url(#cz-dome-glow)"
            stroke={PROJECTION}
            strokeWidth="0.7"
            fill="none"
            opacity="0.55"
          >
            <path d="M 232 255 L 225 272 L 240 278 L 246 268 L 232 262 L 225 272" />
            <path d="M 246 268 L 254 276" />
            <g fill={PROJECTION} stroke="none">
              <circle cx="232" cy="255" r="2" fill={PROJECTION_BRIGHT} />
              <circle cx="225" cy="272" r="1.2" />
              <circle cx="240" cy="278" r="1.1" />
              <circle cx="246" cy="268" r="1.2" />
              <circle cx="232" cy="262" r="1.1" />
              <circle cx="254" cy="276" r="1" />
            </g>
          </g>
          <text
            x="238"
            y="292"
            fontFamily="'Helvetica Neue', Arial, sans-serif"
            fontSize="6"
            letterSpacing="1.6"
            fill={PROJECTION}
            opacity="0.45"
          >
            LYRA
          </text>
        </g>

        {/* CORVUS — the crow, faint projection, upper right */}
        <g className="cz-dome-load-corvus">
          <g
            className="cz-dome-shimmer"
            filter="url(#cz-dome-glow)"
            stroke={PROJECTION}
            strokeWidth="0.7"
            fill="none"
            opacity="0.55"
          >
            <path d="M 225 150 L 248 138 L 262 158 L 240 172 Z" />
            <path d="M 240 172 L 268 180" />
            <g fill={PROJECTION} stroke="none">
              <circle cx="225" cy="150" r="1.3" />
              <circle cx="248" cy="138" r="1.5" />
              <circle cx="262" cy="158" r="1.3" />
              <circle cx="240" cy="172" r="1.4" />
              <circle cx="268" cy="180" r="1" />
            </g>
          </g>
          <text
            x="228"
            y="128"
            fontFamily="'Helvetica Neue', Arial, sans-serif"
            fontSize="6"
            letterSpacing="1.6"
            fill={PROJECTION}
            opacity="0.45"
          >
            CORVUS
          </text>
        </g>

        {/* THE HERMIT — the brightest constellation on the dome */}
        <g className="cz-dome-load-hermit">
          <g
            className="cz-dome-shimmer-b"
            filter="url(#cz-dome-glow-strong)"
            stroke={PROJECTION_BRIGHT}
            strokeWidth="1"
            fill="none"
            opacity="0.95"
          >
            {/* hooded robe: hood peak, shoulders, robe hem */}
            <path d="M 150 205 L 138 235 L 133 300" />
            <path d="M 150 205 L 162 235 L 167 300" />
            <path d="M 133 300 L 167 300" />
            <path d="M 138 235 L 162 235" />
            {/* raised right arm to the lantern */}
            <path d="M 162 235 L 180 210 L 188 196" />
            {/* staff in the left hand */}
            <path d="M 138 235 L 122 215" />
            <path d="M 122 215 L 127 295" />
            <g fill={PROJECTION_BRIGHT} stroke="none">
              <circle cx="150" cy="205" r="1.9" />
              <circle cx="138" cy="235" r="1.6" />
              <circle cx="162" cy="235" r="1.6" />
              <circle cx="133" cy="300" r="1.4" />
              <circle cx="167" cy="300" r="1.4" />
              <circle cx="180" cy="210" r="1.5" />
              <circle cx="122" cy="215" r="1.4" />
              <circle cx="127" cy="295" r="1.2" />
            </g>
          </g>
          {/* the lantern: brightest projected point, gently pulsing halo */}
          <g className="cz-dome-lantern">
            <circle cx="188" cy="196" r="14" fill="url(#cz-dome-lantern-glow)" />
          </g>
          <circle cx="188" cy="196" r="2.6" fill="#ffffff" filter="url(#cz-dome-glow-strong)" />
          {/* tiny label */}
          <text
            x="150"
            y="318"
            textAnchor="middle"
            fontFamily="'Helvetica Neue', Arial, sans-serif"
            fontSize="6"
            letterSpacing="2"
            fill={PROJECTION}
            opacity="0.55"
          >
            EREMITA
          </text>
        </g>

        {/* dome horizon: thin line + tiny silhouetted hills */}
        <g className="cz-dome-load-horizon">
          <line x1="14" y1="372" x2="286" y2="372" stroke={PROJECTION} strokeWidth="0.6" opacity="0.5" />
          <path
            d="M 14 372 L 14 366 Q 34 358 52 366 Q 66 371 84 367 Q 104 360 126 367 Q 142 371 160 368 Q 182 361 204 367 Q 222 372 240 366 Q 262 359 286 367 L 286 372 Z"
            fill="#060b16"
            stroke={PROJECTION}
            strokeWidth="0.4"
            strokeOpacity="0.35"
          />
          {/* a couple of tiny pine silhouettes on the hills */}
          <path d="M 56 366 l 2.4 -7 l 2.4 7 Z" fill="#060b16" stroke={PROJECTION} strokeWidth="0.3" strokeOpacity="0.3" />
          <path d="M 228 368 l 2.2 -6 l 2.2 6 Z" fill="#060b16" stroke={PROJECTION} strokeWidth="0.3" strokeOpacity="0.3" />
        </g>

        {/* projected texts */}
        <g className="cz-dome-load-text">
          {/* IX projected at the top like a slide header, with registration ticks */}
          <text
            x="150"
            y="62"
            textAnchor="middle"
            fontFamily="'Helvetica Neue', Arial, sans-serif"
            fontWeight="300"
            fontSize="22"
            letterSpacing="8"
            fill={PROJECTION_BRIGHT}
            opacity="0.9"
          >
            IX
          </text>
          <g stroke={PROJECTION} strokeWidth="0.5" opacity="0.5">
            <line x1="104" y1="54" x2="112" y2="54" />
            <line x1="188" y1="54" x2="196" y2="54" />
          </g>

          {/* title block at the bottom */}
          <text
            x="150"
            y="408"
            textAnchor="middle"
            fontFamily="'Helvetica Neue', Arial, sans-serif"
            fontWeight="300"
            fontSize="16"
            letterSpacing="6"
            fill={PROJECTION_BRIGHT}
          >
            THE HERMIT
          </text>
          <text
            x="150"
            y="426"
            textAnchor="middle"
            fontFamily="'Helvetica Neue', Arial, sans-serif"
            fontSize="7"
            letterSpacing="3"
            fill={PROJECTION}
            opacity="0.6"
          >
            planetarium · domus IX
          </text>
        </g>

        {/* edge projection glow / vignette */}
        <rect x="0" y="0" width="300" height="450" fill="url(#cz-dome-edge)" pointerEvents="none" />

        {/* interior frame: thin dark rules with small corner registration marks */}
        <rect x="10" y="10" width="280" height="430" fill="none" stroke={INK} strokeWidth="1.4" />
        <rect x="13" y="13" width="274" height="424" fill="none" stroke={PROJECTION} strokeWidth="0.4" opacity="0.28" />
        <g stroke={PROJECTION} strokeWidth="0.7" opacity="0.5" fill="none">
          <path d="M 10 22 L 10 10 L 22 10" />
          <path d="M 278 10 L 290 10 L 290 22" />
          <path d="M 290 428 L 290 440 L 278 440" />
          <path d="M 22 440 L 10 440 L 10 428" />
        </g>
      </svg>
    </figure>
  );
}
