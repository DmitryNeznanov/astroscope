/**
 * Card Lab — ART DECO
 * 1920s Art Deco tarot card (Erte / Chrysler Building glamour): strict
 * vertical symmetry, a sleek elongated figure in a stepped chevron robe,
 * a faceted lantern radiating a precise gold sunburst of straight rays,
 * a stepped ziggurat mountain, fan/scallop corner ornaments, and a thin
 * gold double frame.
 *
 * Reusable via optional props: { number = 9, name = "THE HERMIT", variant = 0 }.
 * variant 0 renders the original Hermit card exactly; variants 1-7 cycle
 * four lacquer palettes x mirrored composition + changed sunburst ray counts.
 */

import { toRoman } from "@/lib/roman";

type Palette = {
  bg: string;
  band: string;
  gold: string;
  goldLight: string;
  goldDark: string;
  ink: string;
  accent: string;
  hood: string;
  face: string;
  shadow: string;
};

/** Four deco lacquer schemes. Index 0 is the original black/gold/emerald. */
const PALETTES: Palette[] = [
  {
    bg: "#0c0b09",
    band: "#14120e",
    gold: "#c9a227",
    goldLight: "#e8cf7a",
    goldDark: "#8a6d15",
    ink: "#f3ead2",
    accent: "#0e5b45",
    hood: "#0c0b09",
    face: "#f3ead2",
    shadow: "rgba(201, 162, 39, 0.9)",
  },
  {
    // Ivory ground, darkened gold, oxblood accent.
    bg: "#f3ead2",
    band: "#e7dab6",
    gold: "#8a6d15",
    goldLight: "#c9a227",
    goldDark: "#5c4a0e",
    ink: "#14120e",
    accent: "#7a1f1f",
    hood: "#14120e",
    face: "#f3ead2",
    shadow: "rgba(138, 109, 21, 0.9)",
  },
  {
    // Emerald lacquer ground, gold, black accent.
    bg: "#0e5b45",
    band: "#0a4636",
    gold: "#c9a227",
    goldLight: "#e8cf7a",
    goldDark: "#8a6d15",
    ink: "#f3ead2",
    accent: "#0c0b09",
    hood: "#0c0b09",
    face: "#f3ead2",
    shadow: "rgba(201, 162, 39, 0.9)",
  },
  {
    // Deep oxblood ground, gold, steel-blue accent.
    bg: "#1a0e14",
    band: "#26121b",
    gold: "#c9a227",
    goldLight: "#e8cf7a",
    goldDark: "#8a6d15",
    ink: "#f3ead2",
    accent: "#10384e",
    hood: "#0c0b09",
    face: "#f3ead2",
    shadow: "rgba(201, 162, 39, 0.9)",
  },
];

/** Gold sunburst: straight rays fanning upward from the lantern hub (100,108). */
function buildRays(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const angle = (-160 + t * 140) * (Math.PI / 180);
    const long = i % 2 === 0;
    const r = long ? 66 : 48;
    return {
      x2: 100 + Math.cos(angle) * r,
      y2: 108 + Math.sin(angle) * r,
      long,
    };
  });
}

/* Corner fan/scallop ornament: concentric quarter arcs + spokes. */
function CornerFan({ flip, gold }: { flip: boolean; gold: string }) {
  const cx = flip ? 186 : 14;
  const spokes = [15, 45, 75].map((deg) => {
    const a = deg * (Math.PI / 180);
    const x = cx + (flip ? -1 : 1) * Math.cos(a) * 17;
    const y = 14 + Math.sin(a) * 17;
    return `M ${cx} 14 L ${x.toFixed(1)} ${y.toFixed(1)}`;
  });
  return (
    <g
      className={`cl-artdeco-fan ${flip ? "cl-artdeco-fan--right" : "cl-artdeco-fan--left"}`}
      stroke={gold}
      strokeWidth="1"
      fill="none"
      opacity="0.9"
    >
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

export type ArtDecoCardProps = {
  /** Major Arcana number, 1-22. Rendered as a roman numeral. */
  number?: number;
  /** Card name in the bottom band; long names are compressed to fit. */
  name?: string;
  /** 0-7: palette (4 schemes) x mirrored composition + ray-count variation. 0 = original. */
  variant?: number;
};

export default function ArtDecoHermitCard({
  number = 9,
  name = "THE HERMIT",
  variant = 0,
}: ArtDecoCardProps) {
  const v = ((Math.round(variant) % 8) + 8) % 8;
  const p = PALETTES[v % 4];
  const mirrored = v >= 4;
  const scope = `cl-artdeco-v${v}`;

  const numeral = toRoman(number);
  const rays = buildRays([15, 13, 17, 19][v % 4] + (mirrored ? 2 : 0));
  const longName = name.length > 10;

  return (
    <figure
      className={`cl-artdeco-card ${scope}`}
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
    >
      <style>{`
        .cl-artdeco-card { display: block; line-height: 0; position: relative; overflow: hidden; }
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

        /* (1a) Sunburst rays rotate very slowly around the lantern hub. */
        @keyframes cl-artdeco-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .cl-artdeco-rays {
          transform-box: view-box;
          transform-origin: 100px 108px;
          animation: cl-artdeco-spin 75s linear infinite;
        }

        /* (1b) Sunburst rays pulse rhythmically from the hub (~3s loop).
           Separate nested group so the pulse scale and slow rotation
           transforms never fight. */
        @keyframes cl-artdeco-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        .cl-artdeco-rays-pulse {
          transform-box: view-box;
          transform-origin: 100px 108px;
          animation: cl-artdeco-pulse 3s ease-in-out infinite;
        }

        /* (2) Light cascade down the robe chevrons, top to bottom.
           Keyframes are per-variant (palette colors), scoped to avoid
           collisions when several variants render on one gallery page. */
        @keyframes cl-artdeco-cascade-${v} {
          0%, 100% { opacity: 0.45; stroke: ${p.gold}; }
          25% { opacity: 1; stroke: ${p.goldLight}; }
        }
        .${scope} .cl-artdeco-chevron { animation: cl-artdeco-cascade-${v} 2.4s ease-in-out infinite; }
        .${scope} .cl-artdeco-chevron--1 { animation-delay: 0s; }
        .${scope} .cl-artdeco-chevron--2 { animation-delay: 0.4s; }
        .${scope} .cl-artdeco-chevron--3 { animation-delay: 0.8s; }

        /* (3) Corner fan ornaments shimmer alternately (left/right, ~4s). */
        @keyframes cl-artdeco-shimmer {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 1; }
        }
        .cl-artdeco-fan { animation: cl-artdeco-shimmer 4s ease-in-out infinite; }
        .cl-artdeco-fan--right { animation-delay: 2s; }

        /* (4a) Hover: rays subtly lengthen/brighten from the hub. */
        .cl-artdeco-rays-inner {
          transform-box: view-box;
          transform-origin: 100px 108px;
          transition: transform 0.6s ease, opacity 0.6s ease;
        }
        .cl-artdeco-card:hover .cl-artdeco-rays-inner {
          transform: scale(1.08);
          opacity: 1;
        }

        /* (4b) Hover: gold frame catches light. */
        .cl-artdeco-frame {
          transition: stroke 0.6s ease, filter 0.6s ease;
        }
        .${scope}:hover .cl-artdeco-frame {
          stroke: ${p.goldLight};
          filter: drop-shadow(0 0 3px ${p.shadow});
        }

        /* (5) Luxe shine sweep: diagonal gold-white band crosses the card. */
        @keyframes cl-artdeco-sweep {
          0% { transform: translateX(-160%) skewX(-18deg); }
          55% { transform: translateX(160%) skewX(-18deg); }
          100% { transform: translateX(160%) skewX(-18deg); }
        }
        .cl-artdeco-shine {
          position: absolute;
          top: -20%;
          bottom: -20%;
          left: 0;
          width: 45%;
          pointer-events: none;
          mix-blend-mode: screen;
          opacity: 0.14;
          animation: cl-artdeco-sweep 8s ease-in-out infinite;
        }
        .${scope} .cl-artdeco-shine {
          background: linear-gradient(90deg, transparent 0%, ${p.goldLight} 45%, #ffffff 55%, transparent 100%);
        }

        @media (prefers-reduced-motion: reduce) {
          .cl-artdeco-star,
          .cl-artdeco-rays,
          .cl-artdeco-rays-pulse,
          .cl-artdeco-chevron,
          .cl-artdeco-fan,
          .cl-artdeco-shine { animation: none; }
          .cl-artdeco-shine { display: none; }
          .cl-artdeco-rays-inner,
          .cl-artdeco-frame { transition: none; }
        }
      `}</style>

      <div className="cl-artdeco-shine" aria-hidden="true" />

      <svg
        viewBox="0 0 200 300"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={`Art Deco tarot card: ${name}, number ${numeral}`}
      >
        {/* Lacquer ground */}
        <rect x="0" y="0" width="200" height="300" fill={p.bg} />

        {/* Scene — mirrored as a whole for variants 4-7 (frame/title stay put) */}
        <g transform={mirrored ? "translate(200 0) scale(-1 1)" : undefined}>
          {/* Sunburst — precise straight gold rays from the lantern.
              Outer group rotates slowly; middle pulses; inner handles hover. */}
          <g className="cl-artdeco-rays">
            <g className="cl-artdeco-rays-pulse">
              <g className="cl-artdeco-rays-inner" opacity="0.85">
                <g stroke={p.gold} strokeWidth="1.1">
                  {rays.map((r, i) => (
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
                  stroke={p.gold}
                  strokeWidth="1"
                  opacity="0.8"
                />
              </g>
            </g>
          </g>

          {/* Stepped ziggurat mountain */}
          <g fill={p.band} stroke={p.gold} strokeWidth="1">
            <rect x="30" y="222" width="140" height="10" />
            <rect x="44" y="212" width="112" height="10" />
            <rect x="58" y="202" width="84" height="10" />
            <rect x="72" y="192" width="56" height="10" />
          </g>
          {/* Ziggurat summit cap */}
          <polygon points="86,192 114,192 100,182" fill={p.accent} stroke={p.gold} strokeWidth="1" />

          {/* THE HERMIT — sleek elongated figure, strictly symmetric */}
          {/* Robe: stepped silhouette, wider toward the hem */}
          <g stroke={p.gold} strokeWidth="1">
            <polygon
              points="100,132 88,140 88,152 82,152 82,166 76,166 76,192 124,192 124,166 118,166 118,152 112,152 112,140"
              fill={p.band}
            />
            {/* Accent inner panel */}
            <polygon
              points="100,142 92,148 92,192 108,192 108,148"
              fill={p.accent}
            />
          </g>
          {/* Chevron motifs across the robe — lit in a top-to-bottom cascade */}
          <g stroke={p.gold} strokeWidth="1.2" fill="none">
            <path className="cl-artdeco-chevron cl-artdeco-chevron--1" d="M 94 154 L 100 159 L 106 154" stroke={p.goldLight} />
            <path className="cl-artdeco-chevron cl-artdeco-chevron--2" d="M 84 162 L 100 172 L 116 162" />
            <path className="cl-artdeco-chevron cl-artdeco-chevron--3" d="M 80 176 L 100 187 L 120 176" />
          </g>
          {/* Hood: elongated teardrop with light face slit */}
          <path
            d="M 100 112 C 93 118 91 126 91 134 L 109 134 C 109 126 107 118 100 112 Z"
            fill={p.hood}
            stroke={p.gold}
            strokeWidth="1.2"
          />
          <path
            d="M 100 121 C 97 124 96 128 96 132 L 104 132 C 104 128 103 124 100 121 Z"
            fill={p.face}
          />
          {/* Shoulder fan epaulettes */}
          <path d="M 91 138 L 78 146 L 91 148 Z" fill={p.gold} opacity="0.85" />
          <path d="M 109 138 L 122 146 L 109 148 Z" fill={p.gold} opacity="0.85" />

          {/* Raised arm + faceted lantern (sunburst hub) */}
          <polygon points="104,140 112,120 116,122 108,142" fill={p.goldDark} />
          <g stroke={p.gold} strokeWidth="1">
            <polygon
              points="100,98 109,105 106,116 94,116 91,105"
              fill={p.goldLight}
            />
            <line x1="100" y1="98" x2="100" y2="116" stroke={p.goldDark} />
            <line x1="91" y1="105" x2="109" y2="105" stroke={p.goldDark} />
            <rect x="96" y="94" width="8" height="4" fill={p.gold} />
            <polygon points="96,116 104,116 100,121" fill={p.gold} />
          </g>
          {/* Star of light inside the lantern */}
          <polygon
            className="cl-artdeco-star"
            points="100,103 101.6,106.4 105,107 101.6,109.6 100,113 98.4,109.6 95,107 98.4,106.4"
            fill={p.ink}
          />

          {/* Staff in the other hand — slim gold rod with finial */}
          <g stroke={p.gold} strokeWidth="1.2">
            <line x1="76" y1="128" x2="76" y2="192" />
          </g>
          <circle cx="76" cy="124" r="2.6" fill={p.goldLight} stroke={p.gold} strokeWidth="0.8" />
          <polygon points="88,146 96,150 94,154 86,150" fill={p.goldDark} />

          {/* Upper corner fan/scallop ornaments */}
          <CornerFan flip={false} gold={p.gold} />
          <CornerFan flip={true} gold={p.gold} />
        </g>

        {/* Numeral in a gold diamond at top center */}
        <g>
          <polygon
            points="100,12 116,28 100,44 84,28"
            fill={p.bg}
            stroke={p.gold}
            strokeWidth="1.4"
          />
          <polygon
            points="100,17 111,28 100,39 89,28"
            fill="none"
            stroke={p.gold}
            strokeWidth="0.7"
            opacity="0.8"
          />
          <text
            x="100"
            y="33"
            textAnchor="middle"
            className="cl-artdeco-type"
            fontSize={numeral.length > 2 ? 10 : 13}
            fill={p.gold}
            letterSpacing="1"
          >
            {numeral}
          </text>
        </g>

        {/* Title band — dark band with gold rules and fan ornaments */}
        <rect x="12" y="242" width="176" height="30" fill={p.band} />
        <line x1="12" y1="244" x2="188" y2="244" stroke={p.gold} strokeWidth="1.2" />
        <line x1="12" y1="270" x2="188" y2="270" stroke={p.gold} strokeWidth="1.2" />
        <line x1="12" y1="247" x2="188" y2="247" stroke={p.gold} strokeWidth="0.5" opacity="0.6" />
        <line x1="12" y1="267" x2="188" y2="267" stroke={p.gold} strokeWidth="0.5" opacity="0.6" />
        {/* Fan ornaments flanking the title */}
        {[30, 170].map((cx) => (
          <g key={cx} stroke={p.gold} strokeWidth="0.9" fill="none">
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
          fontSize={longName ? 11 : 12}
          fill={p.gold}
          letterSpacing={longName ? 2 : 4}
          textLength={longName ? 112 : undefined}
          lengthAdjust={longName ? "spacingAndGlyphs" : undefined}
        >
          {name}
        </text>

        {/* Thin gold double frame with stepped corner motifs */}
        <g className="cl-artdeco-frame">
          <rect x="5" y="5" width="190" height="290" fill="none" stroke={p.gold} strokeWidth="1" />
          <rect x="9" y="9" width="182" height="282" fill="none" stroke={p.gold} strokeWidth="0.5" />
          <g stroke={p.gold} strokeWidth="1" fill="none">
            <path d="M 5 24 L 5 5 L 24 5 M 5 17 L 17 5" opacity="0.9" />
            <path d="M 195 24 L 195 5 L 176 5 M 195 17 L 183 5" opacity="0.9" />
            <path d="M 5 276 L 5 295 L 24 295 M 5 283 L 17 295" opacity="0.9" />
            <path d="M 195 276 L 195 295 L 176 295 M 195 283 L 183 295" opacity="0.9" />
          </g>
        </g>
      </svg>
    </figure>
  );
}
