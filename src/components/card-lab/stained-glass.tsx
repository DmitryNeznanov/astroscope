/**
 * Card Lab — STAINED GLASS style
 * Gothic cathedral stained-glass window: a lancet (pointed-arch) panel of
 * jewel-toned segments separated by thick black lead cames. All artwork is
 * bespoke inline SVG; radial gradients give each segment a slight inner glow.
 *
 * Reusable via optional props: { number, name, variant }.
 * variant 0-7: four glass palettes (0 = original Hermit scheme), variants 4-7
 * replay them with a mirrored composition. The lantern light stays amber in
 * every scheme. All effects (rose spin, twin sun beams, traveling light,
 * hover flare) work for every variant.
 */

import { toRoman } from "@/lib/roman";

const LEAD = "#0b0912";

type Palette = {
  base: string; shards: [string, string, string, string, string];
  peak1: string; peak2: string;
  robe1: string; robe2a: string; robe2b: string; robe3: string; arm: string;
  hood1: string; hood2: string;
  roseA1: string; roseA2: string; roseB1: string; roseB2: string; roseCenter: string;
  ground1: string; ground2: string; accent: string;
};

const PALETTES: Palette[] = [
  { // 0 — original: indigo night, cobalt robe, ruby/amethyst rose
    base: "#241c46", shards: ["#4b3a75", "#372a5e", "#55408a", "#2a2150", "#43316e"],
    peak1: "#3d3566", peak2: "#2f2a52", robe1: "#1a3577", robe2a: "#3a63c8", robe2b: "#1a3577",
    robe3: "#16295e", arm: "#1d3f8f", hood1: "#2c4fa8", hood2: "#142a63",
    roseA1: "#d13a5c", roseA2: "#8f1230", roseB1: "#8b5cc4", roseB2: "#53297e", roseCenter: "#14204a",
    ground1: "#241d44", ground2: "#2e2552", accent: "#8b5cc4",
  },
  { // 1 — emerald chapel: green glass, teal robe, gold/green rose
    base: "#1b3524", shards: ["#2f5a3a", "#274e34", "#3a6a42", "#21452c", "#33522e"],
    peak1: "#2c4a34", peak2: "#234028", robe1: "#14524a", robe2a: "#2a8a72", robe2b: "#14524a",
    robe3: "#0e3e38", arm: "#1a6a58", hood1: "#22785f", hood2: "#0f4a3a",
    roseA1: "#e8b83c", roseA2: "#9a6d14", roseB1: "#4cae7a", roseB2: "#1f6a45", roseCenter: "#123a2c",
    ground1: "#1c3527", ground2: "#23402e", accent: "#4cae7a",
  },
  { // 2 — ruby dusk: wine-red glass, garnet robe, orange/magenta rose
    base: "#361a26", shards: ["#6b2740", "#57203a", "#7a3050", "#47182e", "#63243c"],
    peak1: "#522036", peak2: "#421a2c", robe1: "#6e1f2e", robe2a: "#a83246", robe2b: "#6e1f2e",
    robe3: "#521624", arm: "#8a2438", hood1: "#98283e", hood2: "#5c1626",
    roseA1: "#e08a3c", roseA2: "#9a4d14", roseB1: "#b04a7c", roseB2: "#6e2450", roseCenter: "#3a1420",
    ground1: "#331522", ground2: "#3e1a2a", accent: "#b04a7c",
  },
  { // 3 — glacier: steel-blue glass, cyan robe, ice/sapphire rose
    base: "#16263e", shards: ["#274a6e", "#1f3e5c", "#2f5a80", "#1a3450", "#2a4a66"],
    peak1: "#24425e", peak2: "#1c364c", robe1: "#123e52", robe2a: "#2a7a9e", robe2b: "#123e52",
    robe3: "#0d2e3e", arm: "#1a5a78", hood1: "#22708e", hood2: "#0f4458",
    roseA1: "#5cc8e0", roseA2: "#1f7a9a", roseB1: "#4a6ee0", roseB2: "#243e9a", roseCenter: "#10283e",
    ground1: "#152a3e", ground2: "#1a3248", accent: "#5cc8e0",
  },
];

/** Split a long name into two balanced lines at a word boundary. */
function splitName(n: string): [string, string] {
  const words = n.split(" ");
  let best = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const diff = Math.abs(
      words.slice(0, i).join(" ").length - words.slice(i).join(" ").length,
    );
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
}

export interface StainedGlassCardProps {
  number?: number;
  name?: string;
  variant?: number;
}

export default function StainedGlassHermit({
  number = 9,
  name = "THE HERMIT",
  variant = 0,
}: StainedGlassCardProps) {
  const v = ((variant % 8) + 8) % 8;
  const p = PALETTES[v % 4];
  const mirror = v >= 4;
  const flip = mirror ? "matrix(-1 0 0 1 200 0)" : undefined;

  const numeral = toRoman(number);
  const numeralSize = numeral.length <= 2 ? 11 : numeral.length <= 4 ? 10 : 8.5;

  const title = name.toUpperCase();
  const oneLine = title.length <= 12;
  const lines: string[] = oneLine ? [title] : splitName(title);

  return (
    <figure
      className="cl-sg-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
    >
      <style>{`
        .cl-sg-card { display: block; line-height: 0; }
        .cl-sg-card svg { display: block; width: 100%; height: 100%; }

        /* lantern glow pulse */
        .cl-sg-glow { animation: cl-sg-pulse 5s ease-in-out infinite; }
        @keyframes cl-sg-pulse {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.7; }
        }

        /* (1) rose window petals slowly rotate around their center */
        .cl-sg-rose {
          transform-box: view-box;
          transform-origin: 100px 54px;
          animation: cl-sg-spin 40s linear infinite;
        }
        @keyframes cl-sg-spin {
          to { transform: rotate(360deg); }
        }

        /* (2) two sun beams crossing the window at different angles/speeds */
        .cl-sg-beam {
          opacity: 0.65;
          mix-blend-mode: screen;
          animation: cl-sg-sweep 5s linear infinite;
          transition: opacity 0.6s ease;
        }
        .cl-sg-beam2 {
          opacity: 0.35;
          animation-duration: 11s;
          animation-direction: reverse;
        }
        @keyframes cl-sg-sweep {
          from { transform: translateX(0); }
          to { transform: translateX(340px); }
        }

        /* (3) traveling light: brightness waves roll down through the window */
        .cl-sg-br1, .cl-sg-br2, .cl-sg-br3, .cl-sg-br4 {
          animation: cl-sg-breathe 6s ease-in-out infinite;
        }
        .cl-sg-br2 { animation-delay: -1.5s; }
        .cl-sg-br3 { animation-delay: -3s; }
        .cl-sg-br4 { animation-delay: -4.5s; }
        @keyframes cl-sg-breathe {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.18); }
        }

        /* (4) hover: lantern shards flare, beams intensify */
        .cl-sg-lantern, .cl-sg-rays { transition: filter 0.4s ease; }
        .cl-sg-card:hover .cl-sg-lantern,
        .cl-sg-card:hover .cl-sg-rays {
          filter: brightness(1.45) saturate(1.25);
        }
        .cl-sg-card:hover .cl-sg-beam { opacity: 0.95; animation-duration: 2.5s; }
        .cl-sg-card:hover .cl-sg-beam2 { opacity: 0.7; }

        @media (prefers-reduced-motion: reduce) {
          .cl-sg-glow { animation: none; opacity: 0.5; }
          .cl-sg-rose { animation: none; }
          .cl-sg-beam, .cl-sg-beam2 { animation: none; opacity: 0; }
          .cl-sg-br1, .cl-sg-br2, .cl-sg-br3, .cl-sg-br4 { animation: none; }
          .cl-sg-lantern, .cl-sg-rays, .cl-sg-beam { transition: none; }
        }
      `}</style>

      <svg
        viewBox="0 0 200 300"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`${title} (${numeral}) tarot card rendered as a gothic stained-glass window`}
      >
        <defs>
          <clipPath id="cl-sg-arch">
            <path d="M 22 298 L 22 132 C 22 72 56 34 100 10 C 144 34 178 72 178 132 L 178 298 Z" />
          </clipPath>
          <radialGradient id="cl-sg-amber" cx="0.5" cy="0.45" r="0.7">
            <stop offset="0" stopColor="#fff6cc" />
            <stop offset="0.45" stopColor="#ffce54" />
            <stop offset="1" stopColor="#d97f14" />
          </radialGradient>
          <radialGradient id="cl-sg-glowgrad" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffd873" stopOpacity="0.8" />
            <stop offset="1" stopColor="#ffd873" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cl-sg-robe" cx="0.5" cy="0.35" r="0.9">
            <stop offset="0" stopColor={p.robe2a} />
            <stop offset="1" stopColor={p.robe2b} />
          </radialGradient>
          <radialGradient id="cl-sg-hood" cx="0.5" cy="0.4" r="0.8">
            <stop offset="0" stopColor={p.hood1} />
            <stop offset="1" stopColor={p.hood2} />
          </radialGradient>
          <radialGradient id="cl-sg-rosea" cx="0.5" cy="0.4" r="0.8">
            <stop offset="0" stopColor={p.roseA1} />
            <stop offset="1" stopColor={p.roseA2} />
          </radialGradient>
          <radialGradient id="cl-sg-roseb" cx="0.5" cy="0.4" r="0.8">
            <stop offset="0" stopColor={p.roseB1} />
            <stop offset="1" stopColor={p.roseB2} />
          </radialGradient>
          <linearGradient id="cl-sg-beamgrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffedbe" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff6dd" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ffedbe" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* window silhouette background so the arch reads on any page bg */}
        <path
          d="M 22 298 L 22 132 C 22 72 56 34 100 10 C 144 34 178 72 178 132 L 178 298 Z"
          fill="#17122b"
        />

        <g clipPath="url(#cl-sg-arch)">
          <g transform={flip}>
            {/* ---- background: jewel-toned shards ---- */}
            <rect x="0" y="0" width="200" height="300" fill={p.base} />
            <g className="cl-sg-br1" stroke={LEAD} strokeWidth="3.5" strokeLinejoin="round">
              <polygon points="22,132 22,58 74,38 100,92 58,140" fill={p.shards[0]} />
              <polygon points="178,132 178,58 126,38 100,92 142,140" fill={p.shards[1]} />
              <polygon points="22,132 58,140 54,214 22,222" fill={p.shards[2]} />
              <polygon points="178,132 142,140 148,214 178,222" fill={p.shards[3]} />
              <polygon points="58,140 100,92 142,140 118,176 84,176" fill={p.shards[4]} />
            </g>

            {/* ---- distant mountain peaks ---- */}
            <g className="cl-sg-br2" stroke={LEAD} strokeWidth="3.5" strokeLinejoin="round">
              <polygon points="22,238 70,150 104,182 96,238" fill={p.peak1} />
              <polygon points="96,238 104,182 132,144 178,238" fill={p.peak2} />
            </g>

            {/* ---- lantern light rays (amber shards radiating outward) ---- */}
            <g className="cl-sg-rays" stroke={LEAD} strokeWidth="3" strokeLinejoin="round">
              <polygon points="148,92 172,78 154,100" fill="#f2b43a" />
              <polygon points="150,104 176,110 148,114" fill="#e8a02a" />
              <polygon points="144,114 156,138 136,118" fill="#f2b43a" />
              <polygon points="126,92 112,74 132,88" fill="#e8a02a" />
            </g>
            <circle className="cl-sg-glow" cx="138" cy="102" r="34" fill="url(#cl-sg-glowgrad)" />

            {/* ---- staff (leaded: dark underlay + wood core) ---- */}
            <line x1="60" y1="130" x2="60" y2="246" stroke={LEAD} strokeWidth="8" strokeLinecap="round" />
            <line x1="60" y1="130" x2="60" y2="246" stroke="#8a5a2a" strokeWidth="4" strokeLinecap="round" />
            <circle cx="60" cy="126" r="5.5" fill="#c98a2e" stroke={LEAD} strokeWidth="3" />

            {/* ---- the figure: hooded, robe in three leaded segments ---- */}
            <g className="cl-sg-br3" stroke={LEAD} strokeWidth="3.5" strokeLinejoin="round">
              {/* raised right arm */}
              <polygon points="102,152 126,116 136,124 114,160" fill={p.arm} />
              {/* robe, three leaded segments */}
              <polygon points="80,146 92,146 86,240 66,236" fill={p.robe1} />
              <polygon points="92,146 102,146 102,244 86,240" fill="url(#cl-sg-robe)" />
              <polygon points="102,146 106,146 118,236 102,244" fill={p.robe3} />
              {/* hood */}
              <path d="M 78 130 Q 92 106 106 130 L 103 148 L 81 148 Z" fill="url(#cl-sg-hood)" />
            </g>
            {/* face shadow inside the hood */}
            <ellipse cx="92" cy="136" rx="7.5" ry="6.5" fill="#100c1e" />
            {/* left hand gripping the staff */}
            <circle cx="66" cy="168" r="5" fill="#c98a2e" stroke={LEAD} strokeWidth="3" />

            {/* ---- the lantern: brightest amber segment ---- */}
            <g className="cl-sg-lantern" stroke={LEAD} strokeWidth="3.5" strokeLinejoin="round">
              <polygon points="132,84 144,84 140,78 136,78" fill="#3a2c14" />
              <polygon points="138,86 150,94 150,108 138,116 126,108 126,94" fill="url(#cl-sg-amber)" />
            </g>
            {/* star of light inside the lantern */}
            <path
              d="M 138 94 L 140.5 99.5 L 146 101 L 140.5 102.5 L 138 108 L 135.5 102.5 L 130 101 L 135.5 99.5 Z"
              fill="#fff8dd"
            />

            {/* ---- foreground ground shards ---- */}
            <g className="cl-sg-br4" stroke={LEAD} strokeWidth="3.5" strokeLinejoin="round">
              <polygon points="22,246 64,232 100,246 66,254 22,254" fill={p.ground1} />
              <polygon points="100,246 140,230 178,246 178,254 66,254" fill={p.ground2} />
            </g>

            {/* ---- rose window with the card number ---- */}
            <circle cx="100" cy="54" r="27" fill="#141026" stroke={LEAD} strokeWidth="4" />
            <g className="cl-sg-rose cl-sg-br2" stroke={LEAD} strokeWidth="2.5" strokeLinejoin="round">
              <path d="M 100 54 L 100 32 A 22 22 0 0 1 115.6 38.4 Z" fill="url(#cl-sg-rosea)" />
              <path d="M 100 54 L 115.6 38.4 A 22 22 0 0 1 122 54 Z" fill="url(#cl-sg-roseb)" />
              <path d="M 100 54 L 122 54 A 22 22 0 0 1 115.6 69.6 Z" fill="url(#cl-sg-rosea)" />
              <path d="M 100 54 L 115.6 69.6 A 22 22 0 0 1 100 76 Z" fill="url(#cl-sg-roseb)" />
              <path d="M 100 54 L 100 76 A 22 22 0 0 1 84.4 69.6 Z" fill="url(#cl-sg-rosea)" />
              <path d="M 100 54 L 84.4 69.6 A 22 22 0 0 1 78 54 Z" fill="url(#cl-sg-roseb)" />
              <path d="M 100 54 L 78 54 A 22 22 0 0 1 84.4 38.4 Z" fill="url(#cl-sg-rosea)" />
              <path d="M 100 54 L 84.4 38.4 A 22 22 0 0 1 100 32 Z" fill="url(#cl-sg-roseb)" />
            </g>
            <circle cx="100" cy="54" r="12" fill={p.roseCenter} stroke={LEAD} strokeWidth="3" />
            <text
              x="100"
              y="58.5"
              textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontSize={numeralSize}
              fontWeight="bold"
              letterSpacing="1"
              fill="#f0e2b0"
              transform={flip}
              textLength={numeral.length > 2 ? 20 : undefined}
              lengthAdjust="spacingAndGlyphs"
            >
              {numeral}
            </text>

            {/* ---- leaded name panel ---- */}
            <rect x="22" y="256" width="156" height="42" fill="#131024" stroke={LEAD} strokeWidth="4" />
            <line x1="58" y1="256" x2="58" y2="298" stroke={LEAD} strokeWidth="3" />
            <line x1="142" y1="256" x2="142" y2="298" stroke={LEAD} strokeWidth="3" />
            <polygon points="40,270 46,277 40,284 34,277" fill={p.accent} stroke={LEAD} strokeWidth="2.5" />
            <polygon points="160,270 166,277 160,284 154,277" fill={p.accent} stroke={LEAD} strokeWidth="2.5" />
            {lines.map((line, i) => (
              <text
                key={i}
                x="100"
                y={oneLine ? 282 : i === 0 ? 272.5 : 287.5}
                textAnchor="middle"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontSize={oneLine ? 12.5 : 10}
                letterSpacing={oneLine ? 2.5 : 1.5}
                fill="#ecdfae"
                transform={flip}
                textLength={line.length * (oneLine ? 7.3 : 6.2) > 80 ? 80 : undefined}
                lengthAdjust="spacingAndGlyphs"
              >
                {line}
              </text>
            ))}

            {/* ---- sun beams sweeping across the window (screen blend) ---- */}
            <g transform="rotate(18 100 150)">
              <rect className="cl-sg-beam" x="-130" y="-80" width="110" height="460" fill="url(#cl-sg-beamgrad)" />
            </g>
            <g transform="rotate(-26 100 150)">
              <rect className="cl-sg-beam cl-sg-beam2" x="-320" y="-80" width="70" height="460" fill="url(#cl-sg-beamgrad)" />
            </g>
          </g>
        </g>

        {/* outer lead frame of the lancet window */}
        <path
          d="M 22 298 L 22 132 C 22 72 56 34 100 10 C 144 34 178 72 178 132 L 178 298 Z"
          fill="none"
          stroke={LEAD}
          strokeWidth="7"
          strokeLinejoin="round"
        />
      </svg>
    </figure>
  );
}
