// ORRERY — full deck gallery in one style.
// A Victorian brass orrery (planetarium machine) on black: concentric gear
// rings with visible teeth sweep the lower half, long brass arms radiate from
// the central axis, and each arcana is rebuilt at the machine's heart — its
// focal element burning where the Sun would be. Optional props:
//   number  — 1 Magician, 3 Empress, 7 Chariot, 9 Hermit (default), 10 Wheel,
//             13 Death, 17 Star, 22 Fool; anything else falls back to Hermit.
//   name    — engraved title (defaults per number); long names shrink to fit.
//   variant — 0-7 metal palette (0 = original brass).
// Server-component safe: no hooks, no client directive.

import type { CSSProperties } from "react";

const CX = 150;
const CY = 185;
const DEG = Math.PI / 180;

const DARK = "#100b06";

// metal palettes per variant: dim / mid / bright / pale / lantern glow
const PALETTES = [
  { dim: "#6b5228", mid: "#a07c3e", bright: "#e8c87a", pale: "#f6e5b8", glow: "#e8b45a" }, // 0 brass
  { dim: "#6b3a22", mid: "#b06a3a", bright: "#e8a06a", pale: "#f8d8b8", glow: "#e89a5a" }, // 1 copper
  { dim: "#55575c", mid: "#8f939a", bright: "#cfd4da", pale: "#eef1f4", glow: "#e8d8a8" }, // 2 nickel
  { dim: "#4a3a1e", mid: "#7a5c2c", bright: "#b8985a", pale: "#dcc898", glow: "#c89848" }, // 3 antique bronze
  { dim: "#7a4a3a", mid: "#b8766a", bright: "#e8a898", pale: "#f8d8cc", glow: "#e8a87a" }, // 4 rose gold
  { dim: "#3a5248", mid: "#6a7a58", bright: "#c8b87a", pale: "#ece4c0", glow: "#d8b85a" }, // 5 verdigris
  { dim: "#3a3a40", mid: "#5c5c66", bright: "#a8a8b4", pale: "#d8d8e0", glow: "#d8c88a" }, // 6 gunmetal
  { dim: "#8a7a4a", mid: "#c0a860", bright: "#f0e0a8", pale: "#fff8d8", glow: "#f0cc6a" }, // 7 pale gold
];

const ROMAN: Record<number, string> = {
  1: "I",
  3: "III",
  7: "VII",
  9: "IX",
  10: "X",
  13: "XIII",
  17: "XVII",
  22: "0",
};
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

// planet arms (default machine): orbit radius, final angle, styling
const ARMS = [
  { name: "Mercury", r: 30, angle: -35, pr: 3, fill: "#9a9a9a", glyph: "☿︎" },
  { name: "Venus", r: 48, angle: 32, pr: 4.4, fill: "#e8dcc0", glyph: "♀︎" },
  { name: "Mars", r: 68, angle: 152, pr: 3.8, fill: "#a5502e", glyph: "♂︎" },
  { name: "Jupiter", r: 92, angle: -122, pr: 7, fill: "#c8a06a", glyph: "♃︎" },
  { name: "Saturn", r: 118, angle: -68, pr: 5.6, fill: "#d8bc82", glyph: "♄︎" },
];

// Magician arms: the four suit implements replace the planets
const MAGIC_ARMS = [
  { kind: "cup", r: 38, angle: -35 },
  { kind: "sword", r: 58, angle: 32 },
  { kind: "pentacle", r: 80, angle: 152 },
  { kind: "wand", r: 104, angle: -118 },
];

// gear teeth around the lower half of two concentric rings
const GEAR_TEETH_OUT = Array.from({ length: 27 }, (_, k) => {
  const t = (12 + k * 6) * DEG;
  return { x1: CX + 132 * Math.cos(t), y1: CY + 132 * Math.sin(t), x2: CX + 141 * Math.cos(t), y2: CY + 141 * Math.sin(t) };
});
const GEAR_TEETH_IN = Array.from({ length: 23 }, (_, k) => {
  const t = (16 + k * 6.7) * DEG;
  return { x1: CX + 112 * Math.cos(t), y1: CY + 112 * Math.sin(t), x2: CX + 119 * Math.cos(t), y2: CY + 119 * Math.sin(t) };
});

// small pinion gear meshing with the big gear, lower right
const PINION = { x: 247.7, y: 301.4, r: 12 };
const PINION_TEETH = Array.from({ length: 12 }, (_, k) => {
  const t = k * 30 * DEG;
  return {
    x1: PINION.x + PINION.r * Math.cos(t),
    y1: PINION.y + PINION.r * Math.sin(t),
    x2: PINION.x + (PINION.r + 4.5) * Math.cos(t),
    y2: PINION.y + (PINION.r + 4.5) * Math.sin(t),
  };
});

// the Star's seven small companions, seated on an orbit circle
const SEVEN_STARS = Array.from({ length: 7 }, (_, k) => {
  const t = (k * 51.4 - 78) * DEG;
  return { x: CX + 70 * Math.cos(t), y: CY + 70 * Math.sin(t) };
});

// lower-half arc of a circle centered on the axis (gear rims and gleam)
function lowerArc(r: number): string {
  const t0 = 8 * DEG;
  const t1 = 172 * DEG;
  return `M ${CX + r * Math.cos(t0)} ${CY + r * Math.sin(t0)} A ${r} ${r} 0 0 1 ${CX + r * Math.cos(t1)} ${CY + r * Math.sin(t1)}`;
}

// regular star path: n outer points alternating outer/inner radius
function starN(cx: number, cy: number, n: number, R: number, r: number): string {
  let d = "";
  for (let k = 0; k < n * 2; k++) {
    const rad = k % 2 ? r : R;
    const t = ((k * 180) / n - 90) * DEG;
    d += `${k ? "L" : "M"} ${(cx + rad * Math.cos(t)).toFixed(1)} ${(cy + rad * Math.sin(t)).toFixed(1)} `;
  }
  return d + "Z";
}

interface OrreryProps {
  number?: number;
  name?: string;
  variant?: number;
}

export default function OrreryHermitCard({ number = 9, name, variant = 0 }: OrreryProps) {
  const V = Number.isInteger(variant) && variant >= 0 && variant < PALETTES.length ? variant : 0;
  const P = PALETTES[V];
  const S = number in ROMAN ? number : 9;
  const title = (name ?? NAMES[S]).toUpperCase();
  const roman = ROMAN[S];
  const isMagic = S === 1;

  // title and plaque shrink to fit long names / numerals
  const tSize = title.length <= 11 ? 17 : title.length <= 14 ? 14.5 : 12;
  const tLs = title.length <= 11 ? 5 : title.length <= 14 ? 3 : 1.5;
  const plqW = roman.length <= 2 ? 44 : roman.length === 3 ? 50 : 58;

  const gid = (s: string) => `cz-orr-${s}-${V}`;

  // one suit implement at the end of a Magician arm (drawn pointing up)
  const implement = (kind: string, r: number) => {
    const y = CY - r;
    switch (kind) {
      case "cup":
        return (
          <g>
            <path d={`M ${CX - 4} ${y - 5} L ${CX + 4} ${y - 5} Q ${CX + 4} ${y + 1} ${CX} ${y + 1} Q ${CX - 4} ${y + 1} ${CX - 4} ${y - 5} Z`} fill={DARK} stroke={P.bright} strokeWidth="1" />
            <line x1={CX} y1={y + 1} x2={CX} y2={y + 5} stroke={P.bright} strokeWidth="0.9" />
            <line x1={CX - 3} y1={y + 5} x2={CX + 3} y2={y + 5} stroke={P.bright} strokeWidth="0.9" />
          </g>
        );
      case "sword":
        return (
          <g>
            <line x1={CX} y1={y - 7} x2={CX} y2={y + 4} stroke={P.pale} strokeWidth="1.4" />
            <path d={`M ${CX} ${y - 10} L ${CX + 1.8} ${y - 6} L ${CX - 1.8} ${y - 6} Z`} fill={P.pale} />
            <line x1={CX - 4} y1={y + 4} x2={CX + 4} y2={y + 4} stroke={P.bright} strokeWidth="1.2" />
            <circle cx={CX} cy={y + 6.5} r="1.2" fill={P.bright} />
          </g>
        );
      case "pentacle":
        return (
          <g>
            <circle cx={CX} cy={y} r="6" fill={DARK} stroke={P.bright} strokeWidth="1.1" />
            <path d={starN(CX, y, 5, 4.2, 1.7)} fill="none" stroke={P.bright} strokeWidth="0.7" />
          </g>
        );
      default: // wand
        return (
          <g>
            <line x1={CX} y1={y - 6} x2={CX} y2={y + 7} stroke={P.mid} strokeWidth="1.6" strokeLinecap="round" />
            <circle cx={CX} cy={y - 7.5} r="1.6" fill={P.pale} />
            <circle cx={CX} cy={y + 8.5} r="1.2" fill={P.bright} />
          </g>
        );
    }
  };

  // the arcana rebuilt at the machine's heart (focal element = light source)
  const heart = () => {
    switch (S) {
      case 1: // THE MAGICIAN — raised wand, infinity over the hub light
        return (
          <g className="cz-orr-fade" style={{ "--d": "1.15s" } as CSSProperties}>
            <path d="M 122 217 L 148 217 L 144 221 L 126 221 Z" fill={DARK} stroke={P.mid} strokeWidth="0.9" />
            {/* robed figure, one arm raised to the light, one pointing down */}
            <path d="M 128 193 Q 124 206 126 217 L 144 217 Q 146 206 142 193" fill={DARK} stroke={P.mid} strokeWidth="1.3" strokeLinejoin="round" />
            <path d="M 129 195 Q 129 180 135 178 Q 141 180 141 195" fill={DARK} stroke={P.mid} strokeWidth="1.3" />
            <circle cx="135" cy="187" r="3.2" fill={DARK} stroke={P.mid} strokeWidth="0.9" />
            <path d="M 131 199 Q 130 208 131 215 M 139 199 Q 140 208 139 215" fill="none" stroke={P.dim} strokeWidth="0.7" opacity="0.8" />
            <path d="M 141 200 Q 147 194 149 190" fill="none" stroke={P.mid} strokeWidth="1.3" strokeLinecap="round" />
            <path d="M 129 200 Q 124 206 123 212" fill="none" stroke={P.mid} strokeWidth="1.3" strokeLinecap="round" />
            {/* infinity hovering in the glow above the hub */}
            <circle className="cz-orr-glow" cx={CX} cy={CY} r="24" fill={`url(#${gid("lantern")})`} />
            <text x={CX} y={CY + 4.5} textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="15" fill={P.pale}>∞</text>
            <text x={CX + 15} y={CY + 14} fontFamily="'DejaVu Sans', 'Segoe UI Symbol', Georgia, serif" fontSize="7.5" fill={P.bright} opacity="0.85">☿︎</text>
            <circle cx={CX} cy={CY + 8} r="3.2" fill={DARK} stroke={P.bright} strokeWidth="1" />
          </g>
        );
      case 3: // THE EMPRESS — Venus heart shield, star crown, wheat
        return (
          <g className="cz-orr-fade" style={{ "--d": "1.15s" } as CSSProperties}>
            {/* wheat sheaves rising from the foot */}
            {[130, 150, 170].map((x, i) => (
              <g key={i}>
                <path d={`M ${x} 296 Q ${x + (i - 1) * 4} 268 ${x + (i - 1) * 6} 248`} fill="none" stroke={P.mid} strokeWidth="1" />
                {[0, 1, 2, 3].map((k) => (
                  <path key={k} d={`M ${x + (i - 1) * (2 + k)} ${276 - k * 7} q 2.5 -2 2 2 q -2.5 2 -2 -2 Z`} fill={P.bright} opacity="0.9" />
                ))}
              </g>
            ))}
            {/* heart shield with Venus glyph, burning at the hub */}
            <circle className="cz-orr-glow" cx={CX} cy={CY + 4} r="24" fill={`url(#${gid("lantern")})`} />
            <path d={`M ${CX} ${CY - 2} C ${CX - 4} ${CY - 9} ${CX - 12} ${CY - 8} ${CX - 12} ${CY - 1} C ${CX - 12} ${CY + 5} ${CX - 5} ${CY + 9} ${CX} ${CY + 13} C ${CX + 5} ${CY + 9} ${CX + 12} ${CY + 5} ${CX + 12} ${CY - 1} C ${CX + 12} ${CY - 8} ${CX + 4} ${CY - 9} ${CX} ${CY - 2} Z`} fill={DARK} stroke={P.bright} strokeWidth="1.2" />
            <text x={CX} y={CY + 5} textAnchor="middle" fontFamily="'DejaVu Sans', 'Segoe UI Symbol', Georgia, serif" fontSize="8" fill={P.pale}>♀︎</text>
            {/* crown of stars above the shield */}
            {[-2, -1, 0, 1, 2].map((k) => (
              <path key={k} d={starN(CX + k * 8, CY - 20 + Math.abs(k) * 2.5, 4, 2.6, 1)} fill={P.pale} />
            ))}
            {/* small crowned figure beside the axis, scepter in hand */}
            <path d="M 128 195 Q 124 207 126 217 L 144 217 Q 146 207 142 195" fill={DARK} stroke={P.mid} strokeWidth="1.3" strokeLinejoin="round" />
            <circle cx="135" cy="188" r="3.6" fill={DARK} stroke={P.mid} strokeWidth="1" />
            <path d={starN(135, 181.5, 4, 2.4, 0.9)} fill={P.bright} />
            <path d="M 131 199 Q 130 208 131 215 M 139 199 Q 140 208 139 215" fill="none" stroke={P.dim} strokeWidth="0.7" opacity="0.8" />
            <line x1="123" y1="184" x2="126" y2="219" stroke={P.mid} strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="123" cy="182.5" r="1.5" fill={P.pale} />
          </g>
        );
      case 7: // THE CHARIOT — canopied chariot hub, sphinxes, city wall
        return (
          <g className="cz-orr-fade" style={{ "--d": "1.15s" } as CSSProperties}>
            {/* city wall silhouette behind the gears */}
            <path d="M 46 336 h28 v-7 h7 v7 h18 v-7 h7 v7 h20 v-7 h7 v7 h18 v-7 h7 v7 h20 v-7 h7 v7 h18 v-7 h7 v7 h28" fill="none" stroke={P.dim} strokeWidth="1.2" opacity="0.6" />
            {/* canopy with star-studded vault over the hub */}
            <path d={`M ${CX - 24} ${CY - 8} Q ${CX} ${CY - 38} ${CX + 24} ${CY - 8}`} fill="none" stroke={P.bright} strokeWidth="1.6" />
            <path d={`M ${CX - 20} ${CY - 9} Q ${CX} ${CY - 32} ${CX + 20} ${CY - 9}`} fill="none" stroke={P.dim} strokeWidth="0.7" opacity="0.8" />
            {[-14, 0, 14].map((dx, i) => (
              <path key={i} d={starN(CX + dx, CY - 21 - (dx === 0 ? 4 : 0), 4, 2, 0.8)} fill={P.pale} />
            ))}
            <line x1={CX - 24} y1={CY - 8} x2={CX - 24} y2={CY + 2} stroke={P.mid} strokeWidth="1.2" />
            <line x1={CX + 24} y1={CY - 8} x2={CX + 24} y2={CY + 2} stroke={P.mid} strokeWidth="1.2" />
            {/* lamp burning at the canopy crown */}
            <circle className="cz-orr-glow" cx={CX} cy={CY - 24} r="15" fill={`url(#${gid("lantern")})`} />
            <circle cx={CX} cy={CY - 24} r="3" fill={P.pale} stroke={P.bright} strokeWidth="0.8" />
            {/* chariot box at the hub */}
            <rect x={CX - 15} y={CY - 4} width="30" height="16" rx="2" fill={DARK} stroke={P.bright} strokeWidth="1.3" />
            <line x1={CX - 15} y1={CY + 4} x2={CX + 15} y2={CY + 4} stroke={P.dim} strokeWidth="0.7" />
            <text x={CX} y={CY + 8.5} textAnchor="middle" fontFamily="'DejaVu Sans', 'Segoe UI Symbol', Georgia, serif" fontSize="6.5" fill={P.bright} opacity="0.9">☽︎</text>
            {/* spoked chariot wheel on the axis */}
            <circle cx={CX} cy={CY + 34} r="14" fill="none" stroke={P.bright} strokeWidth="1.6" />
            {[0, 45, 90, 135].map((a) => (
              <line key={a} x1={CX - 13 * Math.cos(a * DEG)} y1={CY + 34 - 13 * Math.sin(a * DEG)} x2={CX + 13 * Math.cos(a * DEG)} y2={CY + 34 + 13 * Math.sin(a * DEG)} stroke={P.mid} strokeWidth="0.9" />
            ))}
            <circle cx={CX} cy={CY + 34} r="2.4" fill={DARK} stroke={P.bright} strokeWidth="0.9" />
            {/* two sphinxes flanking the foot, one dark, one bright */}
            {([[-1, DARK, P.mid], [1, P.mid, DARK]] as const).map(([side, fill, stroke], i) => (
              <g key={i} transform={`translate(${CX + side * 44} 296) scale(${side} 1)`}>
                <path d="M -14 0 L -14 -8 Q -14 -12 -8 -12 L 2 -12 Q 8 -12 8 -7 L 8 0 Z" fill={fill} stroke={stroke} strokeWidth="1" />
                <circle cx="6" cy="-14" r="3.4" fill={fill} stroke={stroke} strokeWidth="0.9" />
                <path d="M 3 -16 L 9 -16 M 4 -18 L 8 -18" stroke={stroke} strokeWidth="0.8" />
                <line x1="-10" y1="0" x2="-10" y2="3" stroke={stroke} strokeWidth="1" />
                <line x1="4" y1="0" x2="4" y2="3" stroke={stroke} strokeWidth="1" />
              </g>
            ))}
          </g>
        );
      case 10: // WHEEL OF FORTUNE — the hub becomes the spoked wheel itself
        return (
          <g>
            <g className="cz-orr-in" style={{ "--d": ".9s", "--r": "24deg" } as CSSProperties}>
              <g className="cz-orr-creep">
                <circle cx={CX} cy={CY} r="62" fill="none" stroke={P.bright} strokeWidth="2" />
                <circle cx={CX} cy={CY} r="56" fill="none" stroke={P.dim} strokeWidth="0.8" opacity="0.8" />
                {[0, 45, 90, 135].map((a) => (
                  <line key={a} x1={CX - 61 * Math.cos(a * DEG)} y1={CY - 61 * Math.sin(a * DEG)} x2={CX + 61 * Math.cos(a * DEG)} y2={CY + 61 * Math.sin(a * DEG)} stroke={P.mid} strokeWidth="1.2" />
                ))}
                {/* alchemical glyphs seated on the rim */}
                {["☿︎", "♄︎", "♃︎", "♂︎"].map((g, k) => {
                  const t = (k * 90 - 45) * DEG;
                  return (
                    <text key={g} x={CX + 49 * Math.cos(t)} y={CY + 49 * Math.sin(t) + 2.5} textAnchor="middle" fontFamily="'DejaVu Sans', 'Segoe UI Symbol', Georgia, serif" fontSize="7.5" fill={P.pale}>
                      {g}
                    </text>
                  );
                })}
              </g>
            </g>
            <g className="cz-orr-fade" style={{ "--d": "1.3s" } as CSSProperties}>
              {/* glowing hub */}
              <circle className="cz-orr-glow" cx={CX} cy={CY} r="20" fill={`url(#${gid("lantern")})`} />
              <circle cx={CX} cy={CY} r="5" fill={`url(#${gid("bulb")})`} stroke={P.bright} strokeWidth="1.1" />
              {/* sphinx cresting the wheel */}
              <g transform={`translate(${CX} ${CY - 66})`}>
                <path d="M -8 0 L -8 -4 Q -8 -7 -3 -7 L 3 -7 Q 7 -7 7 -3 L 7 0 Z" fill={DARK} stroke={P.bright} strokeWidth="0.9" />
                <circle cx="4" cy="-9" r="2.6" fill={DARK} stroke={P.bright} strokeWidth="0.8" />
              </g>
              {/* serpent descending the left flank */}
              <path d={`M ${CX - 56} ${CY - 30} q -8 8 -2 16 q 6 8 -2 16 q -6 7 -1 14`} fill="none" stroke={P.mid} strokeWidth="1.4" strokeLinecap="round" />
              <circle cx={CX - 57} cy={CY - 32} r="1.6" fill={P.mid} />
            </g>
          </g>
        );
      case 13: // DEATH — skeleton rider, rose banner, sun between two towers
        return (
          <g className="cz-orr-fade" style={{ "--d": "1.15s" } as CSSProperties}>
            {/* two towers flanking the hub sun */}
            {[-1, 1].map((side) => (
              <g key={side}>
                <rect x={CX + side * 52 - 7} y={CY - 26} width="14" height="42" fill={DARK} stroke={P.dim} strokeWidth="1" />
                <path d={`M ${CX + side * 52 - 7} ${CY - 26} v-5 h4 v5 h2 v-5 h4 v5 h2 v-5 h4 v5`} fill="none" stroke={P.dim} strokeWidth="1" />
              </g>
            ))}
            {/* the pale sun rising between them */}
            <circle className="cz-orr-glow" cx={CX} cy={CY} r="24" fill={`url(#${gid("lantern")})`} />
            <circle cx={CX} cy={CY} r="8" fill={`url(#${gid("bulb")})`} stroke={P.bright} strokeWidth="1" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <line key={a} x1={CX + 10 * Math.cos(a * DEG)} y1={CY + 10 * Math.sin(a * DEG)} x2={CX + 13.5 * Math.cos(a * DEG)} y2={CY + 13.5 * Math.sin(a * DEG)} stroke={P.bright} strokeWidth="0.8" />
            ))}
            {/* skeleton horse and rider crossing the foot */}
            <g transform="translate(128 290)">
              <ellipse cx="0" cy="0" rx="10" ry="4.5" fill="none" stroke={P.pale} strokeWidth="1" />
              {[-5, 0, 5].map((dx) => (
                <path key={dx} d={`M ${dx} -3.5 Q ${dx + 1.5} 0 ${dx} 3.5`} fill="none" stroke={P.pale} strokeWidth="0.6" />
              ))}
              <path d="M -9 -2 L -15 -8 M -15 -8 L -13 -10" fill="none" stroke={P.pale} strokeWidth="1" strokeLinecap="round" />
              <circle cx="-12" cy="-9.5" r="2" fill="none" stroke={P.pale} strokeWidth="0.8" />
              {[-7, -2, 3, 8].map((dx) => (
                <line key={dx} x1={dx} y1="4" x2={dx - 1} y2="12" stroke={P.pale} strokeWidth="0.9" />
              ))}
              {/* rider: spine, skull, arm to the banner pole */}
              <line x1="2" y1="-4" x2="4" y2="-13" stroke={P.pale} strokeWidth="1" />
              <circle cx="4.5" cy="-15.5" r="2.2" fill="none" stroke={P.pale} strokeWidth="0.8" />
              <line x1="3" y1="-10" x2="-4" y2="-16" stroke={P.pale} strokeWidth="0.9" />
              {/* banner pole with the white rose */}
              <line x1="-4" y1="8" x2="-4" y2="-34" stroke={P.mid} strokeWidth="1.2" />
              <rect x="-4" y="-34" width="18" height="12" fill={DARK} stroke={P.bright} strokeWidth="0.9" />
              <circle cx="5" cy="-28" r="3" fill="none" stroke={P.pale} strokeWidth="0.8" />
              <path d={starN(5, -28, 5, 2.6, 1)} fill="none" stroke={P.pale} strokeWidth="0.6" />
            </g>
            <text x={CX + 15} y={CY + 16} fontFamily="'DejaVu Sans', 'Segoe UI Symbol', Georgia, serif" fontSize="7.5" fill={P.bright} opacity="0.85">♏︎</text>
          </g>
        );
      case 17: // THE STAR — great 8-pointed star at the hub, 7 small, two jugs
        return (
          <g className="cz-orr-fade" style={{ "--d": "1.15s" } as CSSProperties}>
            {/* seven small stars on their orbit */}
            {SEVEN_STARS.map((s, i) => (
              <path key={i} d={starN(s.x, s.y, 8, 3.2, 1.3)} fill={P.bright} opacity="0.9" />
            ))}
            {/* the great star burning where the Sun would be */}
            <circle className="cz-orr-glow" cx={CX} cy={CY} r="26" fill={`url(#${gid("lantern")})`} />
            <path d={starN(CX, CY, 8, 15, 6)} fill={DARK} stroke={P.pale} strokeWidth="1.3" strokeLinejoin="round" />
            <circle cx={CX} cy={CY} r="2.2" fill={P.pale} />
            <text x={CX + 18} y={CY + 16} fontFamily="'DejaVu Sans', 'Segoe UI Symbol', Georgia, serif" fontSize="7.5" fill={P.bright} opacity="0.85">♒︎</text>
            {/* kneeling figure pouring two jugs at the foot */}
            <g transform="translate(150 292)">
              <path d="M -6 -16 Q -9 -6 -8 0 L -2 0 Q -3 -6 -1 -10 L 6 -6 L 8 0 L 3 0 L 1 -4 L -6 -16 Z" fill={DARK} stroke={P.mid} strokeWidth="1" strokeLinejoin="round" />
              <circle cx="-7" cy="-19" r="2.6" fill={DARK} stroke={P.mid} strokeWidth="0.9" />
              {/* jugs tilted in each hand, streams falling */}
              <line x1="-5" y1="-12" x2="-13" y2="-8" stroke={P.mid} strokeWidth="0.9" />
              <circle cx="-14" cy="-7" r="2.2" fill={DARK} stroke={P.bright} strokeWidth="0.8" />
              <path d="M -15 -5 q -1 6 0 11" fill="none" stroke={P.pale} strokeWidth="0.7" opacity="0.9" />
              <line x1="4" y1="-8" x2="12" y2="-6" stroke={P.mid} strokeWidth="0.9" />
              <circle cx="13" cy="-5" r="2.2" fill={DARK} stroke={P.bright} strokeWidth="0.8" />
              <path d="M 14 -3 q 1 5 0 9" fill="none" stroke={P.pale} strokeWidth="0.7" opacity="0.9" />
            </g>
          </g>
        );
      case 22: // THE FOOL — cliff edge at the foot, dog at his heels, sun hub
        return (
          <g className="cz-orr-fade" style={{ "--d": "1.15s" } as CSSProperties}>
            {/* the sun burning at the hub, rayed */}
            <circle className="cz-orr-glow" cx={CX} cy={CY} r="26" fill={`url(#${gid("lantern")})`} />
            <circle cx={CX} cy={CY} r="8.5" fill={`url(#${gid("bulb")})`} stroke={P.bright} strokeWidth="1.2" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <line key={a} x1={CX + 11 * Math.cos(a * DEG)} y1={CY + 11 * Math.sin(a * DEG)} x2={CX + 15 * Math.cos(a * DEG)} y2={CY + 15 * Math.sin(a * DEG)} stroke={P.bright} strokeWidth="0.9" />
            ))}
            <text x={CX + 17} y={CY + 16} fontFamily="'DejaVu Sans', 'Segoe UI Symbol', Georgia, serif" fontSize="7.5" fill={P.bright} opacity="0.85">♅︎</text>
            {/* jagged cliff ledge jutting right from the foot */}
            <path d="M 150 301 L 196 301 L 202 295 L 210 299 L 219 294 L 226 298 L 226 306 L 150 306 Z" fill={DARK} stroke={P.bright} strokeWidth="1.1" strokeLinejoin="round" />
            <path d="M 200 301 l 2 4 M 212 300 l 1 5" stroke={P.dim} strokeWidth="0.6" />
            {/* the Fool stepping off, bundle on a stick over his shoulder */}
            <g transform="translate(196 296)">
              <path d="M -2 -16 Q -4 -8 -3 0 L 1 0 Q 2 -8 3 -14" fill={DARK} stroke={P.mid} strokeWidth="1.1" />
              <circle cx="2" cy="-18.5" r="2.4" fill={DARK} stroke={P.mid} strokeWidth="0.9" />
              <path d="M 0 -20.5 q 2 -2 4 0" fill="none" stroke={P.bright} strokeWidth="0.7" />
              <line x1="0" y1="-13" x2="8" y2="-22" stroke={P.mid} strokeWidth="0.9" />
              <circle cx="9" cy="-23" r="2" fill={DARK} stroke={P.bright} strokeWidth="0.8" />
              <line x1="-1" y1="0" x2="-4" y2="5" stroke={P.mid} strokeWidth="0.9" />
              <line x1="1" y1="0" x2="5" y2="4" stroke={P.mid} strokeWidth="0.9" />
            </g>
            {/* little dog at his heels */}
            <g transform="translate(178 299)">
              <ellipse cx="0" cy="-2" rx="3.4" ry="1.8" fill={DARK} stroke={P.bright} strokeWidth="0.7" />
              <circle cx="3.4" cy="-3.4" r="1.3" fill={DARK} stroke={P.bright} strokeWidth="0.6" />
              <path d="M -3.4 -2.5 q -2 -2 -1 -3.5" fill="none" stroke={P.bright} strokeWidth="0.6" />
              <line x1="-2" y1="0" x2="-2" y2="2" stroke={P.bright} strokeWidth="0.6" />
              <line x1="2" y1="0" x2="2" y2="2" stroke={P.bright} strokeWidth="0.6" />
            </g>
          </g>
        );
      default: // 9 — THE HERMIT — lantern sun-bulb, hooded figure, staff
        return (
          <g>
            <g className="cz-orr-fade" style={{ "--d": "1.15s" } as CSSProperties}>
              <path d="M 122 217 L 148 217 L 144 221 L 126 221 Z" fill={DARK} stroke={P.mid} strokeWidth="0.9" />
              <path d="M 128 193 Q 124 206 126 217 L 144 217 Q 146 206 142 193" fill={DARK} stroke={P.mid} strokeWidth="1.3" strokeLinejoin="round" />
              <path d="M 128 195 Q 127 178 135 176 Q 143 178 142 195" fill={DARK} stroke={P.mid} strokeWidth="1.3" />
              <ellipse cx="135" cy="187" rx="3.6" ry="4.6" fill="#040302" />
              <path d="M 131 199 Q 130 208 131 215 M 139 199 Q 140 208 139 215" fill="none" stroke={P.dim} strokeWidth="0.7" opacity="0.8" />
              <line x1="122" y1="182" x2="126" y2="219" stroke={P.mid} strokeWidth="1.4" strokeLinecap="round" />
              <circle cx="122" cy="180.5" r="1.3" fill={P.bright} />
              <path d="M 141 200 Q 147 194 149 190" fill="none" stroke={P.mid} strokeWidth="1.3" strokeLinecap="round" />
            </g>
            <g className="cz-orr-fade" style={{ "--d": "1.35s" } as CSSProperties}>
              <circle className="cz-orr-glow" cx={CX} cy={CY} r="26" fill={`url(#${gid("lantern")})`} />
              <circle cx={CX} cy={CY} r="8.5" fill={`url(#${gid("bulb")})`} stroke={P.bright} strokeWidth="1.2" />
              <path d="M 143.5 185 A 8.5 8.5 0 0 1 156.5 185" fill="none" stroke={P.dim} strokeWidth="0.7" opacity="0.8" />
              <path d="M 146 177.5 L 146 179.5 M 154 177.5 L 154 179.5" stroke={P.bright} strokeWidth="0.8" />
              <path d="M 147 177.5 Q 150 174 153 177.5" fill="none" stroke={P.bright} strokeWidth="0.9" />
              <path d="M 150 181.5 L 151.8 185 L 150 188.5 L 148.2 185 Z" fill="#fff6d8" />
              <text x={CX + 13} y={CY + 14} fontFamily="'DejaVu Sans', 'Segoe UI Symbol', Georgia, serif" fontSize="7.5" fill={P.bright} opacity="0.85">☉︎</text>
              <circle cx={CX} cy={CY + 8} r="3.2" fill={DARK} stroke={P.bright} strokeWidth="1" />
            </g>
          </g>
        );
    }
  };

  return (
    <figure
      className="cz-orr-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
    >
      <style>{`
        .cz-orr-card { position: relative; overflow: hidden; background: #060402; }
        .cz-orr-card svg { display: block; width: 100%; height: 100%; }

        /* load: each arm swings from folded-up to its orbit angle, staggered */
        .cz-orr-arm {
          transform-box: view-box;
          transform-origin: 150px 185px;
          animation: cz-orr-arm-in .7s cubic-bezier(.3,.8,.3,1) backwards;
          animation-delay: var(--d, 0s);
        }
        .cz-orr-in {
          transform-box: view-box;
          transform-origin: 150px 185px;
          animation: cz-orr-arm-in .9s cubic-bezier(.3,.8,.3,1) backwards;
          animation-delay: var(--d, 0s);
        }
        .cz-orr-fade { animation: cz-orr-ink-in .9s ease-out var(--d, 1.5s) backwards; }

        /* ambient: one arm (or the wheel) creeps through an endless revolution */
        .cz-orr-creep {
          transform-box: view-box;
          transform-origin: 150px 185px;
          animation: cz-orr-spin 140s linear infinite;
        }
        /* ambient: a gleam travels slowly along the big gear teeth */
        .cz-orr-gleam {
          stroke-dasharray: 30 780;
          animation: cz-orr-gleam 90s linear infinite;
        }
        /* ambient: the focal light breathes */
        .cz-orr-glow { animation: cz-orr-breathe 18s ease-in-out infinite; }

        @keyframes cz-orr-arm-in {
          from { opacity: 0; transform: rotate(var(--r, 0deg)); }
          to   { opacity: 1; transform: rotate(0deg); }
        }
        @keyframes cz-orr-ink-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cz-orr-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes cz-orr-gleam {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -810; }
        }
        @keyframes cz-orr-breathe {
          0%, 100% { opacity: .72; }
          50%      { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cz-orr-arm, .cz-orr-in, .cz-orr-fade,
          .cz-orr-creep, .cz-orr-gleam, .cz-orr-glow {
            animation: none;
          }
        }
      `}</style>

      <svg
        viewBox="0 0 300 450"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={`${title}, tarot card ${roman}, reimagined as a brass orrery planetarium machine`}
      >
        <defs>
          <radialGradient id={gid("bg")} cx="50%" cy="42%" r="80%">
            <stop offset="0%" stopColor="#1c1409" />
            <stop offset="55%" stopColor="#0f0a05" />
            <stop offset="100%" stopColor="#040302" />
          </radialGradient>
          {/* vertical metallic sheen for arms, gears and frame */}
          <linearGradient id={gid("metal")} gradientUnits="userSpaceOnUse" x1="0" y1="40" x2="0" y2="340">
            <stop offset="0%" stopColor={P.dim} />
            <stop offset="30%" stopColor={P.mid} />
            <stop offset="46%" stopColor={P.pale} />
            <stop offset="58%" stopColor={P.mid} />
            <stop offset="100%" stopColor={P.dim} />
          </linearGradient>
          <linearGradient id={gid("frame")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={P.mid} />
            <stop offset="50%" stopColor={P.bright} />
            <stop offset="100%" stopColor={P.dim} />
          </linearGradient>
          <radialGradient id={gid("lantern")} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffedbb" stopOpacity="0.95" />
            <stop offset="45%" stopColor={P.glow} stopOpacity="0.38" />
            <stop offset="100%" stopColor={P.glow} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={gid("bulb")} cx="42%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#fff6d8" />
            <stop offset="55%" stopColor={P.glow} />
            <stop offset="100%" stopColor={P.dim} />
          </radialGradient>
          {/* corner rivet: domed screw head with a slot */}
          <g id={gid("rivet")}>
            <circle r="3.6" fill="none" stroke={`url(#${gid("frame")})`} strokeWidth="1.2" />
            <circle r="1.3" fill="#0a0704" stroke={P.bright} strokeWidth="0.5" />
            <line x1="-2.4" y1="0" x2="2.4" y2="0" stroke={P.bright} strokeWidth="0.7" />
          </g>
          <clipPath id={gid("jup")}>
            <circle r="7" />
          </clipPath>
        </defs>

        {/* blackened ground + faint star dust */}
        <rect x="0" y="0" width="300" height="450" fill={`url(#${gid("bg")})`} />
        <g fill={P.pale} opacity="0.5">
          <circle cx="44" cy="88" r="0.8" />
          <circle cx="256" cy="66" r="0.7" />
          <circle cx="268" cy="140" r="0.9" />
          <circle cx="36" cy="206" r="0.7" />
          <circle cx="262" cy="216" r="0.8" />
          <circle cx="52" cy="300" r="0.6" />
          <circle cx="72" cy="352" r="0.7" />
          <circle cx="228" cy="360" r="0.6" />
        </g>

        {/* thin metallic frame with riveted corners */}
        <rect x="12" y="12" width="276" height="426" fill="none" stroke={`url(#${gid("frame")})`} strokeWidth="1.6" />
        <rect x="18" y="18" width="264" height="414" fill="none" stroke={P.dim} strokeWidth="0.5" opacity="0.7" />
        <use href={`#${gid("rivet")}`} x="24" y="24" />
        <use href={`#${gid("rivet")}`} x="276" y="24" />
        <use href={`#${gid("rivet")}`} x="24" y="426" />
        <use href={`#${gid("rivet")}`} x="276" y="426" />

        {/* fine engraved orbit circles */}
        <g className="cz-orr-fade" style={{ "--d": ".1s" } as CSSProperties}>
          {(isMagic ? MAGIC_ARMS : ARMS).map((a) => (
            <circle key={a.r} cx={CX} cy={CY} r={a.r} fill="none" stroke={P.dim} strokeWidth="0.5" strokeDasharray="1.5 3.5" opacity="0.8" />
          ))}
        </g>

        {/* ======== GEAR RINGS, lower half ======== */}
        <g className="cz-orr-in" style={{ "--d": ".15s", "--r": "10deg" } as CSSProperties}>
          <path d={lowerArc(136.5)} fill="none" stroke={`url(#${gid("metal")})`} strokeWidth="2.6" />
          <path d={lowerArc(128)} fill="none" stroke={P.dim} strokeWidth="0.8" opacity="0.85" />
          {GEAR_TEETH_OUT.map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={P.mid} strokeWidth="2.2" />
          ))}
          <path className="cz-orr-gleam" d={lowerArc(136.5)} fill="none" stroke={P.pale} strokeWidth="2" strokeLinecap="round" opacity="0.55" />
        </g>
        <g className="cz-orr-in" style={{ "--d": ".3s", "--r": "-8deg" } as CSSProperties}>
          <path d={lowerArc(115.5)} fill="none" stroke={`url(#${gid("metal")})`} strokeWidth="1.8" />
          {GEAR_TEETH_IN.map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={P.mid} strokeWidth="1.7" />
          ))}
        </g>

        {/* meshing pinion gear, lower right */}
        <g className="cz-orr-in" style={{ "--d": ".45s", "--r": "14deg" } as CSSProperties}>
          <circle cx={PINION.x} cy={PINION.y} r={PINION.r} fill={DARK} stroke={`url(#${gid("metal")})`} strokeWidth="1.6" />
          <circle cx={PINION.x} cy={PINION.y} r="3" fill={DARK} stroke={P.bright} strokeWidth="0.9" />
          {PINION_TEETH.map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={P.mid} strokeWidth="1.8" />
          ))}
        </g>

        {/* crank handle at the right edge */}
        <g className="cz-orr-fade" style={{ "--d": ".6s" } as CSSProperties}>
          <circle cx="272" cy="252" r="5" fill={DARK} stroke={`url(#${gid("metal")})`} strokeWidth="1.4" />
          <line x1="272" y1="252" x2="258" y2="264" stroke={P.mid} strokeWidth="2" strokeLinecap="round" />
          <circle cx="256" cy="266" r="2.6" fill={P.bright} stroke={P.dim} strokeWidth="0.6" />
          <circle cx="272" cy="252" r="1.2" fill={P.bright} />
        </g>

        {/* ======== ARMS (planets, or the Magician's four implements) ======== */}
        {isMagic
          ? MAGIC_ARMS.map((a, i) => {
              const armG = (
                <g transform={`rotate(${a.angle} ${CX} ${CY})`}>
                  <line x1={CX} y1={CY - 12} x2={CX} y2={CY - a.r} stroke={`url(#${gid("metal")})`} strokeWidth="2.2" />
                  <circle cx={CX} cy={CY - a.r * 0.55} r="1.1" fill={P.bright} />
                  {implement(a.kind, a.r)}
                </g>
              );
              const loadG = (
                <g key={a.kind} className="cz-orr-arm" style={{ "--d": `${0.25 + i * 0.24}s`, "--r": `${-90 - a.angle}deg` } as CSSProperties}>
                  {armG}
                </g>
              );
              return a.kind === "wand" ? (
                <g key={a.kind} className="cz-orr-creep">{loadG}</g>
              ) : (
                loadG
              );
            })
          : ARMS.map((a, i) => {
              const armG = (
                <g transform={`rotate(${a.angle} ${CX} ${CY})`}>
                  <line x1={CX} y1={CY - 12} x2={CX} y2={CY - a.r} stroke={`url(#${gid("metal")})`} strokeWidth="2.2" />
                  <circle cx={CX} cy={CY - a.r * 0.55} r="1.1" fill={P.bright} />
                  {a.name === "Jupiter" ? (
                    <g transform={`translate(${CX} ${CY - a.r})`}>
                      <circle r={a.pr} fill={a.fill} stroke={P.dim} strokeWidth="0.7" />
                      <g clipPath={`url(#${gid("jup")})`}>
                        <rect x="-7" y="-2.8" width="14" height="1.8" fill="#8a5a34" opacity="0.85" />
                        <rect x="-7" y="1.2" width="14" height="1.4" fill="#e8d0a0" opacity="0.9" />
                        <rect x="-7" y="3.8" width="14" height="1.2" fill="#8a5a34" opacity="0.7" />
                      </g>
                    </g>
                  ) : a.name === "Saturn" ? (
                    <g transform={`translate(${CX} ${CY - a.r})`}>
                      <ellipse rx="11" ry="3.4" fill="none" stroke={P.bright} strokeWidth="1.1" transform="rotate(-18)" />
                      <circle r={a.pr} fill={a.fill} stroke={P.dim} strokeWidth="0.7" />
                      <path d="M -4.9 2.6 A 5.6 5.6 0 0 0 4.9 2.6" fill="none" stroke={P.dim} strokeWidth="0.6" opacity="0.8" />
                    </g>
                  ) : (
                    <circle cx={CX} cy={CY - a.r} r={a.pr} fill={a.fill} stroke={P.dim} strokeWidth="0.7" />
                  )}
                  <text
                    x={CX + a.pr + 6}
                    y={CY - a.r + 2.5}
                    fontFamily="'DejaVu Sans', 'Segoe UI Symbol', Georgia, serif"
                    fontSize="7.5"
                    fill={P.bright}
                    opacity="0.9"
                    transform={`rotate(${-a.angle} ${CX + a.pr + 6} ${CY - a.r + 2.5})`}
                  >
                    {a.glyph}
                  </text>
                </g>
              );
              const loadG = (
                <g key={a.name} className="cz-orr-arm" style={{ "--d": `${0.25 + i * 0.24}s`, "--r": `${-90 - a.angle}deg` } as CSSProperties}>
                  {armG}
                </g>
              );
              return a.name === "Saturn" ? (
                <g key={a.name} className="cz-orr-creep">{loadG}</g>
              ) : (
                loadG
              );
            })}

        {/* ======== CENTRAL AXIS AND FOOT ======== */}
        <g className="cz-orr-fade" style={{ "--d": "1.3s" } as CSSProperties}>
          <line x1={CX} y1={CY + 8} x2={CX} y2={CY + 112} stroke={`url(#${gid("metal")})`} strokeWidth="3" />
          <rect x={CX - 5} y={CY + 40} width="10" height="4" rx="1.5" fill={DARK} stroke={P.mid} strokeWidth="0.9" />
          <rect x={CX - 5} y={CY + 76} width="10" height="4" rx="1.5" fill={DARK} stroke={P.mid} strokeWidth="0.9" />
          <path d="M 128 301 L 172 301 L 166 291 L 134 291 Z" fill={DARK} stroke={`url(#${gid("metal")})`} strokeWidth="1.3" strokeLinejoin="round" />
          <circle cx="138" cy="296" r="1.1" fill={P.bright} />
          <circle cx="162" cy="296" r="1.1" fill={P.bright} />
        </g>

        {/* ======== THE ARCANA AT THE MACHINE'S HEART ======== */}
        {heart()}

        {/* brass plaque with the card's numeral, hanging from the top frame */}
        <g className="cz-orr-fade" style={{ "--d": "1.5s" } as CSSProperties}>
          <line x1="150" y1="12" x2="150" y2="28" stroke={P.dim} strokeWidth="0.9" />
          <rect x={150 - plqW / 2} y="28" width={plqW} height="22" rx="2.5" fill={DARK} stroke={`url(#${gid("frame")})`} strokeWidth="1.2" />
          <circle cx={150 - plqW / 2 + 6} cy="39" r="1.1" fill={P.bright} />
          <circle cx={150 + plqW / 2 - 6} cy="39" r="1.1" fill={P.bright} />
          <text x="150" y="43.5" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="700" fontSize="12" fill={P.bright}>
            {roman}
          </text>
        </g>

        {/* engraved title, shrunk to fit long names */}
        <g className="cz-orr-fade" style={{ "--d": "1.6s" } as CSSProperties}>
          <line x1="58" y1="392" x2="242" y2="392" stroke={P.dim} strokeWidth="0.8" />
          <path d="M 50 392 L 54 388.5 L 58 392 L 54 395.5 Z" fill={P.mid} />
          <path d="M 242 392 L 246 388.5 L 250 392 L 246 395.5 Z" fill={P.mid} />
          <text x="150" y="417" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="700" fontSize={tSize} letterSpacing={tLs} fill={P.bright}>
            {title}
          </text>
          <line x1="58" y1="426" x2="242" y2="426" stroke={P.dim} strokeWidth="0.8" />
        </g>
      </svg>
    </figure>
  );
}
