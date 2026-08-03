/**
 * Card Lab — ART DECO. 1920s Art Deco tarot cards (Erte / Chrysler Building
 * glamour): strict symmetry, stepped geometric silhouettes, gold sunbursts of
 * straight rays, fan ornaments, thin gold double frames.
 *
 * Props: { number = 9, name, variant = 0 }. `number` selects a fully different
 * scene in the deco technique (1 Magician, 3 Empress, 7 Chariot, 9 Hermit,
 * 10 Wheel, 13 Death, 17 Star, 22 Fool; anything else falls back to Hermit).
 * variant 0 = the original Hermit exactly; 1-7 cycle four lacquer palettes
 * x mirrored composition + ray-count variation.
 */

import type { JSX } from "react";
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

/** Fallback names when the caller only passes a number. */
const NAMES: Record<number, string> = {
  1: "THE MAGICIAN",
  3: "THE EMPRESS",
  7: "THE CHARIOT",
  9: "THE HERMIT",
  10: "WHEEL OF FORTUNE",
  13: "DEATH",
  17: "THE STAR",
  22: "THE FOOL",
};

type Ray = { x2: number; y2: number; long: boolean };

/** Hermit sunburst: straight rays fanning upward from the lantern hub (100,108). */
function buildRays(count: number): Ray[] {
  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const angle = (-160 + t * 140) * (Math.PI / 180);
    const long = i % 2 === 0;
    const r = long ? 66 : 48;
    return { x2: 100 + Math.cos(angle) * r, y2: 108 + Math.sin(angle) * r, long };
  });
}

/** Regular n-pointed star polygon points (outer/inner radius). */
function starPoints(cx: number, cy: number, rO: number, rI: number, n: number): string {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? rO : rI;
    const a = (Math.PI / n) * i - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
}

/**
 * Scene sunburst for the non-Hermit cards: the same rotating/pulsing/
 * hover-reactive ray stack as the Hermit, re-centred on each scene's own
 * light source via inline transform-origin (spread in degrees, 0 = east).
 */
function DecoRays({
  p,
  cx,
  cy,
  count,
  start,
  end,
  rLong,
  rShort,
  rIn = 0,
}: {
  p: Palette;
  cx: number;
  cy: number;
  count: number;
  start: number;
  end: number;
  rLong: number;
  rShort: number;
  rIn?: number;
}) {
  const o = `${cx}px ${cy}px`;
  const full = end - start >= 360;
  const lines = Array.from({ length: count }, (_, i) => {
    const t = full ? i / count : i / (count - 1);
    const a = ((start + t * (end - start)) * Math.PI) / 180;
    const long = i % 2 === 0;
    const r = long ? rLong : rShort;
    return {
      x1: cx + Math.cos(a) * rIn,
      y1: cy + Math.sin(a) * rIn,
      x2: cx + Math.cos(a) * r,
      y2: cy + Math.sin(a) * r,
      long,
    };
  });
  return (
    <g className="cl-artdeco-rays" style={{ transformOrigin: o }}>
      <g className="cl-artdeco-rays-pulse" style={{ transformOrigin: o }}>
        <g className="cl-artdeco-rays-inner" style={{ transformOrigin: o }} opacity="0.85">
          <g stroke={p.gold} strokeWidth="1.1">
            {lines.map((l, i) => (
              <line
                key={i}
                x1={l.x1.toFixed(1)}
                y1={l.y1.toFixed(1)}
                x2={l.x2.toFixed(1)}
                y2={l.y2.toFixed(1)}
                strokeWidth={l.long ? 1.3 : 0.8}
              />
            ))}
          </g>
        </g>
      </g>
    </g>
  );
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

/* Scenes — one bespoke deco illustration per card, viewBox 200x300. */

function HermitScene({ p, rays }: { p: Palette; rays: Ray[] }) {
  return (
    <>
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
      <g stroke={p.gold} strokeWidth="1">
        <polygon
          points="100,132 88,140 88,152 82,152 82,166 76,166 76,192 124,192 124,166 118,166 118,152 112,152 112,140"
          fill={p.band}
        />
        <polygon points="100,142 92,148 92,192 108,192 108,148" fill={p.accent} />
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
        <polygon points="100,98 109,105 106,116 94,116 91,105" fill={p.goldLight} />
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

    </>
  );
}

function MagicianScene({ p }: { p: Palette }) {
  return (
    <>
      {/* Sunburst from the raised wand tip */}
      <DecoRays p={p} cx={130} cy={56} count={9} start={-170} end={-40} rLong={30} rShort={22} />
      {/* Wand + glowing tip star */}
      <line x1="112" y1="94" x2="130" y2="58" stroke={p.gold} strokeWidth="1.5" />
      <polygon className="cl-artdeco-star" points={starPoints(130, 54, 6, 2.4, 4)} fill={p.ink} />
      {/* Infinity lemniscate above the head */}
      <g stroke={p.gold} strokeWidth="1.2" fill="none">
        <circle cx="78" cy="52" r="5.5" />
        <circle cx="90" cy="52" r="5.5" />
      </g>
      {/* Figure behind the table */}
      <circle cx="100" cy="78" r="10" fill={p.band} stroke={p.gold} strokeWidth="1.2" />
      <polygon points="86,92 114,92 118,150 82,150" fill={p.band} stroke={p.gold} strokeWidth="1" />
      <polygon points="96,96 104,96 106,150 94,150" fill={p.accent} />
      <line x1="86" y1="110" x2="114" y2="110" stroke={p.gold} strokeWidth="0.8" />
      {/* Free arm angled down toward the table */}
      <line x1="88" y1="98" x2="72" y2="132" stroke={p.gold} strokeWidth="1.5" />
      {/* Table — stepped deco console */}
      <g fill={p.band} stroke={p.gold} strokeWidth="1">
        <rect x="36" y="196" width="128" height="12" />
        <rect x="46" y="208" width="9" height="26" />
        <rect x="145" y="208" width="9" height="26" />
      </g>
      <line x1="36" y1="200" x2="164" y2="200" stroke={p.gold} strokeWidth="0.5" opacity="0.6" />
      {/* Four suit symbols on the table — lit in a cascade */}
      <g stroke={p.gold} strokeWidth="1.2" fill="none">
        <path className="cl-artdeco-chevron cl-artdeco-chevron--1" d="M 54 186 A 7 7 0 0 0 68 186" />
        <g className="cl-artdeco-chevron cl-artdeco-chevron--2">
          <line x1="90" y1="172" x2="90" y2="194" />
          <line x1="84" y1="180" x2="96" y2="180" />
        </g>
        <g className="cl-artdeco-chevron cl-artdeco-chevron--3">
          <circle cx="118" cy="184" r="7" />
          <polygon points="118,180 122,184 118,188 114,184" />
        </g>
        <line x1="140" y1="194" x2="156" y2="172" />
      </g>
    </>
  );
}

function EmpressScene({ p }: { p: Palette }) {
  return (
    <>
      {/* Sunburst from the crown's center star */}
      <DecoRays p={p} cx={100} cy={60} count={11} start={-165} end={-15} rLong={40} rShort={30} />
      {/* Star crown — zigzag band with three star points */}
      <polygon points="84,70 90,54 97,66 103,52 109,66 116,54 116,70" fill={p.band} stroke={p.gold} strokeWidth="1" />
      <polygon points={starPoints(88, 50, 4, 1.6, 4)} fill={p.gold} />
      <polygon className="cl-artdeco-star" points={starPoints(103, 46, 5, 2, 4)} fill={p.ink} />
      <polygon points={starPoints(114, 52, 4, 1.6, 4)} fill={p.gold} />
      {/* Head and bell gown with fan pleats */}
      <circle cx="100" cy="86" r="11" fill={p.band} stroke={p.gold} strokeWidth="1.2" />
      <path d="M 84 102 L 116 102 L 134 196 L 66 196 Z" fill={p.band} stroke={p.gold} strokeWidth="1" />
      <g stroke={p.gold} strokeWidth="0.7" opacity="0.8">
        <line x1="88" y1="112" x2="80" y2="192" />
        <line x1="100" y1="112" x2="100" y2="192" />
        <line x1="112" y1="112" x2="120" y2="192" />
      </g>
      {/* Heart shield with Venus symbol */}
      <path
        d="M 100 142 C 100 136 111 136 111 144 C 111 150 100 157 100 161 C 100 157 89 150 89 144 C 89 136 100 136 100 142 Z"
        fill={p.accent}
        stroke={p.gold}
        strokeWidth="1.2"
      />
      <g stroke={p.ink} strokeWidth="1.2" fill="none">
        <circle cx="100" cy="146" r="3.4" />
        <line x1="100" y1="149.4" x2="100" y2="156" />
        <line x1="97" y1="153" x2="103" y2="153" />
      </g>
      {/* Wheat below — geometric stalks, lit in a cascade */}
      <g stroke={p.gold} strokeWidth="1.1" fill="none">
        {[
          { x: 52, c: "cl-artdeco-chevron--1" },
          { x: 68, c: "cl-artdeco-chevron--2" },
          { x: 132, c: "cl-artdeco-chevron--3" },
          { x: 148, c: "" },
        ].map(({ x, c }) => (
          <g key={x} className={`cl-artdeco-chevron ${c}`}>
            <line x1={x} y1="236" x2={x} y2="206" />
            <path d={`M ${x - 5} 214 L ${x} 209 L ${x + 5} 214`} />
            <path d={`M ${x - 5} 223 L ${x} 218 L ${x + 5} 223`} />
          </g>
        ))}
      </g>
    </>
  );
}

function ChariotScene({ p }: { p: Palette }) {
  return (
    <>
      {/* Sunburst from the canopy's center star */}
      <DecoRays p={p} cx={100} cy={64} count={11} start={-165} end={-15} rLong={38} rShort={28} />
      {/* Starred canopy arch */}
      <path d="M 56 84 Q 100 54 144 84 L 144 92 L 56 92 Z" fill={p.band} stroke={p.gold} strokeWidth="1" />
      <polygon className="cl-artdeco-chevron cl-artdeco-chevron--1" points={starPoints(76, 76, 4.5, 1.8, 4)} fill={p.gold} stroke={p.gold} strokeWidth="0.6" />
      <polygon className="cl-artdeco-star" points={starPoints(100, 66, 5.5, 2.2, 4)} fill={p.ink} />
      <polygon className="cl-artdeco-chevron cl-artdeco-chevron--2" points={starPoints(124, 76, 4.5, 1.8, 4)} fill={p.gold} stroke={p.gold} strokeWidth="0.6" />
      <line x1="62" y1="92" x2="62" y2="122" stroke={p.gold} strokeWidth="1" />
      <line x1="138" y1="92" x2="138" y2="122" stroke={p.gold} strokeWidth="1" />
      {/* City wall behind — stepped crenellation */}
      <polyline
        points="24,146 24,134 34,134 34,140 44,140 44,134 54,134 54,146 M 146,146 146,134 156,134 156,140 166,140 166,134 176,134 176,146"
        fill="none"
        stroke={p.gold}
        strokeWidth="1"
      />
      {/* Charioteer torso */}
      <circle cx="100" cy="110" r="9" fill={p.band} stroke={p.gold} strokeWidth="1.2" />
      <polygon points="88,122 112,122 116,146 84,146" fill={p.accent} stroke={p.gold} strokeWidth="1" />
      {/* Boxy chariot with deco front panel */}
      <rect x="64" y="146" width="72" height="48" fill={p.band} stroke={p.gold} strokeWidth="1.2" />
      <g className="cl-artdeco-chevron cl-artdeco-chevron--3" stroke={p.gold} strokeWidth="0.9" fill="none">
        <rect x="76" y="156" width="48" height="28" />
        <line x1="100" y1="156" x2="100" y2="184" />
        <line x1="76" y1="170" x2="124" y2="170" />
      </g>
      {/* Two sphinx-like shapes in front — symmetric stepped guardians */}
      <g fill={p.band} stroke={p.gold} strokeWidth="1">
        <rect x="40" y="214" width="36" height="14" />
        <circle cx="50" cy="206" r="6" />
        <rect x="124" y="214" width="36" height="14" />
        <circle cx="150" cy="206" r="6" />
      </g>
      <line x1="40" y1="224" x2="76" y2="224" stroke={p.gold} strokeWidth="0.6" />
      <line x1="124" y1="224" x2="160" y2="224" stroke={p.gold} strokeWidth="0.6" />
    </>
  );
}

function WheelScene({ p }: { p: Palette }) {
  const rim = [45, 135, 225].map((deg, i) => {
    const a = (deg * Math.PI) / 180;
    return {
      x: 100 + Math.cos(a) * 53,
      y: 140 + Math.sin(a) * 53,
      c: `cl-artdeco-chevron--${i + 1}`,
    };
  });
  return (
    <>
      {/* Sunburst radiating full-circle from the wheel hub */}
      <DecoRays p={p} cx={100} cy={140} count={16} start={0} end={360} rLong={82} rShort={74} rIn={66} />
      {/* Spoked wheel */}
      <circle cx="100" cy="140" r="62" fill="none" stroke={p.gold} strokeWidth="1.5" />
      <circle cx="100" cy="140" r="44" fill="none" stroke={p.gold} strokeWidth="1" />
      <g stroke={p.gold} strokeWidth="1">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const a = (deg * Math.PI) / 180;
          return (
            <line
              key={deg}
              x1={(100 + Math.cos(a) * 10).toFixed(1)}
              y1={(140 + Math.sin(a) * 10).toFixed(1)}
              x2={(100 + Math.cos(a) * 60).toFixed(1)}
              y2={(140 + Math.sin(a) * 60).toFixed(1)}
            />
          );
        })}
      </g>
      {/* Hub — the glowing heart of the wheel */}
      <circle cx="100" cy="140" r="9" fill={p.band} stroke={p.gold} strokeWidth="1.2" />
      <polygon className="cl-artdeco-star" points={starPoints(100, 140, 5, 2, 4)} fill={p.ink} />
      {/* Symbols on the rim — lit in a cascade */}
      {rim.map(({ x, y, c }) => (
        <polygon
          key={c}
          className={`cl-artdeco-chevron ${c}`}
          points={starPoints(x, y, 5, 2, 4)}
          fill={p.band}
          stroke={p.gold}
          strokeWidth="1"
        />
      ))}
      {/* Small sphinx atop the wheel */}
      <rect x="86" y="64" width="28" height="10" fill={p.band} stroke={p.gold} strokeWidth="1" />
      <circle cx="100" cy="57" r="5.5" fill={p.band} stroke={p.gold} strokeWidth="1" />
      {/* Snake on the left, horned creature on the right */}
      <polyline points="26,104 34,116 24,130 34,144 24,158" fill="none" stroke={p.gold} strokeWidth="1.2" />
      <g stroke={p.gold} strokeWidth="1" fill={p.band}>
        <polygon points="170,150 182,150 186,168 166,168" />
        <line x1="172" y1="150" x2="170" y2="142" />
        <line x1="180" y1="150" x2="182" y2="142" />
      </g>
    </>
  );
}

function DeathScene({ p }: { p: Palette }) {
  return (
    <>
      {/* Sunburst from the white rose on the dark banner */}
      <DecoRays p={p} cx={66} cy={74} count={7} start={-150} end={-30} rLong={26} rShort={19} />
      {/* Banner pole + dark flag */}
      <line x1="44" y1="52" x2="44" y2="214" stroke={p.gold} strokeWidth="1.5" />
      <rect x="44" y="56" width="44" height="36" fill={p.hood} stroke={p.gold} strokeWidth="1" />
      {/* White rose — five diamond petals around a glowing heart */}
      <g fill={p.ink} stroke={p.gold} strokeWidth="0.5">
        {[0, 72, 144, 216, 288].map((deg) => {
          const a = (deg * Math.PI) / 180;
          return (
            <polygon
              key={deg}
              points={starPoints(66 + Math.cos(a) * 7, 74 + Math.sin(a) * 7, 4.5, 1.8, 4)}
            />
          );
        })}
      </g>
      <polygon className="cl-artdeco-star" points={starPoints(66, 74, 3.5, 1.4, 4)} fill={p.ink} />
      {/* Horse — geometric profile facing right */}
      <g fill={p.band} stroke={p.gold} strokeWidth="1">
        <rect x="86" y="150" width="62" height="26" />
        <polygon points="146,150 162,116 176,122 160,154" />
        <polygon points="162,116 186,124 183,137 158,131" />
        <rect x="92" y="176" width="5" height="38" />
        <rect x="110" y="176" width="5" height="38" />
        <rect x="136" y="176" width="5" height="38" />
        <rect x="154" y="176" width="5" height="38" />
      </g>
      <circle cx="176" cy="126" r="1.4" fill={p.gold} />
      <polyline points="86,154 78,166 82,180" fill="none" stroke={p.gold} strokeWidth="1.2" />
      {/* Skeletal rider */}
      <circle cx="106" cy="108" r="9" fill={p.band} stroke={p.gold} strokeWidth="1.2" />
      <circle cx="103" cy="106" r="1.5" fill={p.gold} />
      <circle cx="110" cy="106" r="1.5" fill={p.gold} />
      <line x1="106" y1="117" x2="106" y2="148" stroke={p.gold} strokeWidth="1.2" />
      <g stroke={p.gold} strokeWidth="0.9" fill="none">
        <path d="M 98 124 Q 106 129 114 124" />
        <path d="M 98 132 Q 106 137 114 132" />
        <path d="M 99 140 Q 106 145 113 140" />
      </g>
      <line x1="100" y1="126" x2="46" y2="96" stroke={p.gold} strokeWidth="1.2" />
      {/* Sun rising between two towers on the horizon */}
      <g fill={p.band} stroke={p.gold} strokeWidth="1">
        <rect x="116" y="206" width="18" height="28" />
        <rect x="170" y="206" width="18" height="28" />
      </g>
      <path d="M 138 234 A 14 14 0 0 1 166 234 Z" fill={p.goldLight} stroke={p.gold} strokeWidth="1" />
      <g stroke={p.gold} strokeWidth="1">
        <line className="cl-artdeco-chevron cl-artdeco-chevron--1" x1="152" y1="212" x2="152" y2="204" />
        <line className="cl-artdeco-chevron cl-artdeco-chevron--2" x1="140" y1="218" x2="134" y2="212" />
        <line className="cl-artdeco-chevron cl-artdeco-chevron--3" x1="164" y1="218" x2="170" y2="212" />
      </g>
      <line x1="20" y1="234" x2="196" y2="234" stroke={p.gold} strokeWidth="1" />
    </>
  );
}

function StarScene({ p }: { p: Palette }) {
  const small: [number, number, string][] = [
    [52, 52, "cl-artdeco-chevron--1"],
    [148, 52, "cl-artdeco-chevron--2"],
    [36, 96, ""],
    [164, 96, ""],
    [62, 122, ""],
    [138, 122, ""],
    [100, 122, "cl-artdeco-chevron--3"],
  ];
  return (
    <>
      {/* Sunburst from the great eight-pointed star */}
      <DecoRays p={p} cx={100} cy={72} count={11} start={-165} end={-15} rLong={44} rShort={34} />
      <polygon points={starPoints(100, 72, 18, 7, 8)} fill={p.goldLight} stroke={p.gold} strokeWidth="1" />
      <polygon className="cl-artdeco-star" points={starPoints(100, 72, 6, 2.4, 4)} fill={p.ink} />
      {/* Seven small stars */}
      {small.map(([x, y, c]) => (
        <polygon
          key={`${x}-${y}`}
          className={`cl-artdeco-chevron ${c}`}
          points={starPoints(x, y, 4.5, 1.8, 4)}
          fill={p.band}
          stroke={p.gold}
          strokeWidth="1"
        />
      ))}
      {/* Kneeling figure */}
      <circle cx="84" cy="150" r="9" fill={p.band} stroke={p.gold} strokeWidth="1.2" />
      <polygon points="76,160 96,156 102,192 80,194" fill={p.band} stroke={p.gold} strokeWidth="1" />
      <polygon points="72,194 106,194 110,212 70,212" fill={p.band} stroke={p.gold} strokeWidth="1" />
      <rect x="70" y="212" width="40" height="8" fill={p.accent} stroke={p.gold} strokeWidth="1" />
      {/* Two jugs — one pours to land, one to the pool */}
      <line x1="78" y1="168" x2="56" y2="186" stroke={p.gold} strokeWidth="1.2" />
      <polygon points="48,184 58,184 56,194 50,194" fill={p.band} stroke={p.gold} strokeWidth="1" />
      <g stroke={p.gold} strokeWidth="0.8" opacity="0.9">
        <line x1="52" y1="196" x2="50" y2="224" />
        <line x1="55" y1="196" x2="55" y2="224" />
      </g>
      <line x1="96" y1="164" x2="124" y2="182" stroke={p.gold} strokeWidth="1.2" />
      <polygon points="124,180 134,180 132,190 126,190" fill={p.band} stroke={p.gold} strokeWidth="1" />
      <g stroke={p.gold} strokeWidth="0.8" opacity="0.9">
        <line x1="130" y1="192" x2="136" y2="220" />
        <line x1="133" y1="192" x2="140" y2="220" />
      </g>
      {/* Pool — scalloped deco waves */}
      <g stroke={p.gold} strokeWidth="1" fill="none">
        <path d="M 118 226 q 6 -6 12 0 q 6 6 12 0 q 6 -6 12 0 q 6 6 12 0 q 6 -6 12 0" />
        <path d="M 126 236 q 6 -6 12 0 q 6 6 12 0 q 6 -6 12 0 q 6 6 12 0" />
      </g>
    </>
  );
}

function FoolScene({ p }: { p: Palette }) {
  return (
    <>
      {/* Sunburst radiating from the sun behind the Fool */}
      <DecoRays p={p} cx={148} cy={66} count={12} start={0} end={360} rLong={30} rShort={24} rIn={18} />
      <circle cx="148" cy="66" r="15" fill={p.band} stroke={p.gold} strokeWidth="1.2" />
      <polygon className="cl-artdeco-star" points={starPoints(148, 66, 5, 2, 4)} fill={p.ink} />
      {/* Figure in profile, head tilted up, mid-step toward the edge */}
      <circle cx="96" cy="106" r="9" fill={p.band} stroke={p.gold} strokeWidth="1.2" />
      <polygon points="103,102 108,104 103,107" fill={p.gold} />
      <polygon points="86,118 106,118 110,162 82,162" fill={p.band} stroke={p.gold} strokeWidth="1" />
      <line x1="86" y1="126" x2="106" y2="122" stroke={p.gold} strokeWidth="0.8" />
      <polygon points="90,162 104,162 126,182 118,188" fill={p.band} stroke={p.gold} strokeWidth="1" />
      <polygon points="84,162 94,162 82,200 74,198" fill={p.band} stroke={p.gold} strokeWidth="1" />
      {/* Bundle on a stick over the shoulder */}
      <line x1="90" y1="124" x2="64" y2="84" stroke={p.gold} strokeWidth="1.2" />
      <polygon
        className="cl-artdeco-chevron cl-artdeco-chevron--1"
        points={starPoints(60, 78, 8, 4, 4)}
        fill={p.accent}
        stroke={p.gold}
        strokeWidth="1"
      />
      {/* Small dog at his heels */}
      <g className="cl-artdeco-chevron cl-artdeco-chevron--2" fill={p.band} stroke={p.gold} strokeWidth="1">
        <rect x="48" y="196" width="20" height="10" />
        <circle cx="70" cy="191" r="5" />
        <line x1="48" y1="197" x2="42" y2="186" />
      </g>
      {/* Cliff — ground gives way in stepped ledges to the right */}
      <polyline
        className="cl-artdeco-chevron cl-artdeco-chevron--3"
        points="20,210 128,210 128,221 148,221 148,232 168,232 168,240"
        fill="none"
        stroke={p.gold}
        strokeWidth="1.4"
      />
    </>
  );
}

const SCENES: Record<number, (props: { p: Palette }) => JSX.Element> = {
  1: MagicianScene,
  3: EmpressScene,
  7: ChariotScene,
  10: WheelScene,
  13: DeathScene,
  17: StarScene,
  22: FoolScene,
};

export type ArtDecoCardProps = {
  /** Major Arcana number, 1-22. Selects the scene; rendered as a roman numeral. */
  number?: number;
  /** Card name in the bottom band; long names are compressed to fit. */
  name?: string;
  /** 0-7: palette (4 schemes) x mirrored composition + ray-count variation. 0 = original. */
  variant?: number;
};

export default function ArtDecoHermitCard({
  number = 9,
  name,
  variant = 0,
}: ArtDecoCardProps) {
  const v = ((Math.round(variant) % 8) + 8) % 8;
  const p = PALETTES[v % 4];
  const mirrored = v >= 4;
  const scope = `cl-artdeco-v${v}`;

  const numeral = toRoman(number);
  const title = name ?? NAMES[number] ?? "THE HERMIT";
  const longName = title.length > 10;
  const Scene = SCENES[number];

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

        /* Sunburst rays rotate very slowly around their light source. */
        @keyframes cl-artdeco-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .cl-artdeco-rays {
          transform-box: view-box;
          transform-origin: 100px 108px;
          animation: cl-artdeco-spin 75s linear infinite;
        }

        /* Sunburst rays pulse rhythmically from the hub (~3s loop).
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

        /* Light cascade across tagged ornaments (chevrons, stars, wheat...).
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

        /* Corner fan ornaments shimmer alternately (left/right, ~4s). */
        @keyframes cl-artdeco-shimmer {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 1; }
        }
        .cl-artdeco-fan { animation: cl-artdeco-shimmer 4s ease-in-out infinite; }
        .cl-artdeco-fan--right { animation-delay: 2s; }

        /* Hover: rays subtly lengthen/brighten from the hub. */
        .cl-artdeco-rays-inner {
          transform-box: view-box;
          transform-origin: 100px 108px;
          transition: transform 0.6s ease, opacity 0.6s ease;
        }
        .cl-artdeco-card:hover .cl-artdeco-rays-inner {
          transform: scale(1.08);
          opacity: 1;
        }

        /* Hover: gold frame catches light. */
        .cl-artdeco-frame {
          transition: stroke 0.6s ease, filter 0.6s ease;
        }
        .${scope}:hover .cl-artdeco-frame {
          stroke: ${p.goldLight};
          filter: drop-shadow(0 0 3px ${p.shadow});
        }

        /* Luxe shine sweep: diagonal gold-white band crosses the card. */
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
        aria-label={`Art Deco tarot card: ${title}, number ${numeral}`}
      >
        {/* Lacquer ground */}
        <rect x="0" y="0" width="200" height="300" fill={p.bg} />

        {/* Scene — mirrored as a whole for variants 4-7 (frame/title stay put) */}
        <g transform={mirrored ? "translate(200 0) scale(-1 1)" : undefined}>
          {Scene ? (
            <Scene p={p} />
          ) : (
            <HermitScene p={p} rays={buildRays([15, 13, 17, 19][v % 4] + (mirrored ? 2 : 0))} />
          )}
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
          {title}
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
