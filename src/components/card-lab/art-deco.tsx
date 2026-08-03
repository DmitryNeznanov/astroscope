/**
 * Card Lab — ART DECO
 * The Hermit (IX) as 1920s Art Deco glamour (Erte / Chrysler Building):
 * strict vertical symmetry, a sleek elongated figure in a stepped chevron
 * robe, a faceted lantern radiating a precise gold sunburst of straight
 * rays, a stepped ziggurat mountain, fan/scallop corner ornaments, and a
 * thin gold double frame. Palette: black, gold, ivory, one deep emerald.
 */

const C = {
  black: "#0c0b09",
  band: "#14120e",
  gold: "#c9a227",
  goldLight: "#e8cf7a",
  goldDark: "#8a6d15",
  ivory: "#f3ead2",
  emerald: "#0e5b45",
} as const;

/* Gold sunburst: straight rays fanning upward from the lantern. */
const RAY_COUNT = 15;
const RAYS = Array.from({ length: RAY_COUNT }, (_, i) => {
  const t = i / (RAY_COUNT - 1);
  const angle = (-160 + t * 140) * (Math.PI / 180);
  const long = i % 2 === 0;
  const r = long ? 66 : 48;
  return {
    x2: 100 + Math.cos(angle) * r,
    y2: 108 + Math.sin(angle) * r,
    long,
  };
});

/* Corner fan/scallop ornament: concentric quarter arcs + spokes. */
function CornerFan({ flip }: { flip: boolean }) {
  const cx = flip ? 186 : 14;
  const spokes = [15, 45, 75].map((deg) => {
    const a = deg * (Math.PI / 180);
    const x = cx + (flip ? -1 : 1) * Math.cos(a) * 17;
    const y = 14 + Math.sin(a) * 17;
    return `M ${cx} 14 L ${x.toFixed(1)} ${y.toFixed(1)}`;
  });
  return (
    <g stroke={C.gold} strokeWidth="1" fill="none" opacity="0.9">
      {[7, 12, 17].map((r) => (
        <path
          key={r}
          d={`M ${cx + (flip ? -r : r)} 14 A ${r} ${r} 0 0 ${flip ? 1 : 0} ${cx} ${14 + r}`}
        />
      ))}
      {spokes.map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
  );
}

export default function ArtDecoHermitCard() {
  return (
    <figure
      className="cl-artdeco-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
    >
      <style>{`
        .cl-artdeco-card { display: block; line-height: 0; }
        .cl-artdeco-card svg { display: block; width: 100%; height: 100%; }
        .cl-artdeco-type {
          font-family: "Futura", "Century Gothic", "Avenir Next", "Trebuchet MS", Arial, sans-serif;
          font-weight: 700;
        }
        @keyframes cl-artdeco-glow {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
        .cl-artdeco-star { animation: cl-artdeco-glow 3.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .cl-artdeco-star { animation: none; }
        }
      `}</style>

      <svg
        viewBox="0 0 200 300"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Art Deco tarot card: The Hermit, number nine"
      >
        {/* Black lacquer ground */}
        <rect x="0" y="0" width="200" height="300" fill={C.black} />

        {/* Sunburst — precise straight gold rays from the lantern */}
        <g stroke={C.gold} strokeWidth="1.1" opacity="0.85">
          {RAYS.map((r, i) => (
            <line
              key={i}
              x1="100"
              y1="108"
              x2={r.x2.toFixed(1)}
              y2={r.y2.toFixed(1)}
              strokeWidth={r.long ? 1.3 : 0.8}
            />
          ))}
        </g>
        {/* Sunburst outer arc */}
        <path
          d="M 41.6 85.4 A 66 66 0 0 1 158.4 85.4"
          fill="none"
          stroke={C.gold}
          strokeWidth="1"
          opacity="0.7"
        />

        {/* Stepped ziggurat mountain */}
        <g fill={C.band} stroke={C.gold} strokeWidth="1">
          <rect x="30" y="222" width="140" height="10" />
          <rect x="44" y="212" width="112" height="10" />
          <rect x="58" y="202" width="84" height="10" />
          <rect x="72" y="192" width="56" height="10" />
        </g>
        {/* Ziggurat summit cap */}
        <polygon points="86,192 114,192 100,182" fill={C.emerald} stroke={C.gold} strokeWidth="1" />

        {/* THE HERMIT — sleek elongated figure, strictly symmetric */}
        {/* Robe: stepped silhouette, wider toward the hem */}
        <g stroke={C.gold} strokeWidth="1">
          <polygon
            points="100,132 88,140 88,152 82,152 82,166 76,166 76,192 124,192 124,166 118,166 118,152 112,152 112,140"
            fill={C.band}
          />
          {/* Emerald inner panel */}
          <polygon
            points="100,142 92,148 92,192 108,192 108,148"
            fill={C.emerald}
          />
        </g>
        {/* Chevron motifs across the robe */}
        <g stroke={C.gold} strokeWidth="1.2" fill="none">
          <path d="M 84 162 L 100 172 L 116 162" />
          <path d="M 80 176 L 100 187 L 120 176" />
          <path d="M 94 154 L 100 159 L 106 154" stroke={C.goldLight} />
        </g>
        {/* Hood: elongated teardrop with ivory face slit */}
        <path
          d="M 100 112 C 93 118 91 126 91 134 L 109 134 C 109 126 107 118 100 112 Z"
          fill={C.black}
          stroke={C.gold}
          strokeWidth="1.2"
        />
        <path
          d="M 100 121 C 97 124 96 128 96 132 L 104 132 C 104 128 103 124 100 121 Z"
          fill={C.ivory}
        />
        {/* Shoulder fan epaulettes */}
        <path d="M 91 138 L 78 146 L 91 148 Z" fill={C.gold} opacity="0.85" />
        <path d="M 109 138 L 122 146 L 109 148 Z" fill={C.gold} opacity="0.85" />

        {/* Raised arm + faceted lantern (sunburst hub) */}
        <polygon points="104,140 112,120 116,122 108,142" fill={C.goldDark} />
        <g stroke={C.gold} strokeWidth="1">
          <polygon
            points="100,98 109,105 106,116 94,116 91,105"
            fill={C.goldLight}
          />
          <line x1="100" y1="98" x2="100" y2="116" stroke={C.goldDark} />
          <line x1="91" y1="105" x2="109" y2="105" stroke={C.goldDark} />
          <rect x="96" y="94" width="8" height="4" fill={C.gold} />
          <polygon points="96,116 104,116 100,121" fill={C.gold} />
        </g>
        {/* Star of light inside the lantern */}
        <polygon
          className="cl-artdeco-star"
          points="100,103 101.6,106.4 105,107 101.6,109.6 100,113 98.4,109.6 95,107 98.4,106.4"
          fill={C.ivory}
        />

        {/* Staff in the other hand — slim gold rod with finial */}
        <g stroke={C.gold} strokeWidth="1.2">
          <line x1="76" y1="128" x2="76" y2="192" />
        </g>
        <circle cx="76" cy="124" r="2.6" fill={C.goldLight} stroke={C.gold} strokeWidth="0.8" />
        <polygon points="88,146 96,150 94,154 86,150" fill={C.goldDark} />

        {/* Upper corner fan/scallop ornaments */}
        <CornerFan flip={false} />
        <CornerFan flip={true} />

        {/* IX in a gold diamond at top center */}
        <g>
          <polygon
            points="100,12 116,28 100,44 84,28"
            fill={C.black}
            stroke={C.gold}
            strokeWidth="1.4"
          />
          <polygon
            points="100,17 111,28 100,39 89,28"
            fill="none"
            stroke={C.gold}
            strokeWidth="0.7"
            opacity="0.8"
          />
          <text
            x="100"
            y="33"
            textAnchor="middle"
            className="cl-artdeco-type"
            fontSize="13"
            fill={C.gold}
            letterSpacing="1"
          >
            IX
          </text>
        </g>

        {/* Title band — black band with gold rules and fan ornaments */}
        <rect x="12" y="242" width="176" height="30" fill={C.band} />
        <line x1="12" y1="244" x2="188" y2="244" stroke={C.gold} strokeWidth="1.2" />
        <line x1="12" y1="270" x2="188" y2="270" stroke={C.gold} strokeWidth="1.2" />
        <line x1="12" y1="247" x2="188" y2="247" stroke={C.gold} strokeWidth="0.5" opacity="0.6" />
        <line x1="12" y1="267" x2="188" y2="267" stroke={C.gold} strokeWidth="0.5" opacity="0.6" />
        {/* Fan ornaments flanking the title */}
        {[30, 170].map((cx) => (
          <g key={cx} stroke={C.gold} strokeWidth="0.9" fill="none">
            {[3.5, 6.5, 9.5].map((r) => (
              <path key={r} d={`M ${cx - r} 260 A ${r} ${r} 0 0 1 ${cx + r} 260`} />
            ))}
            {[-40, 0, 40].map((deg) => {
              const a = ((deg - 90) * Math.PI) / 180;
              return (
                <line
                  key={deg}
                  x1={cx}
                  y1={260}
                  x2={(cx + Math.cos(a) * 9.5).toFixed(1)}
                  y2={(260 + Math.sin(a) * 9.5).toFixed(1)}
                />
              );
            })}
          </g>
        ))}
        <text
          x="100"
          y="262"
          textAnchor="middle"
          className="cl-artdeco-type"
          fontSize="12"
          fill={C.gold}
          letterSpacing="4"
        >
          THE HERMIT
        </text>

        {/* Thin gold double frame with stepped corner motifs */}
        <rect x="5" y="5" width="190" height="290" fill="none" stroke={C.gold} strokeWidth="1" />
        <rect x="9" y="9" width="182" height="282" fill="none" stroke={C.gold} strokeWidth="0.5" />
        <g stroke={C.gold} strokeWidth="1" fill="none">
          <path d="M 5 24 L 5 5 L 24 5 M 5 17 L 17 5" opacity="0.9" />
          <path d="M 195 24 L 195 5 L 176 5 M 195 17 L 183 5" opacity="0.9" />
          <path d="M 5 276 L 5 295 L 24 295 M 5 283 L 17 295" opacity="0.9" />
          <path d="M 195 276 L 195 295 L 176 295 M 195 283 L 183 295" opacity="0.9" />
        </g>
      </svg>
    </figure>
  );
}
