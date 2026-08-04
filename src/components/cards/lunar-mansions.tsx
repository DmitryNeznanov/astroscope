// LUNAR MANSIONS — deck gallery (default: The Hermit IX)
// Medieval Arabic-astronomy plate: aged parchment, sepia ink, gold accents.
// The 28 Mansions of the Moon wheel — thin radial sectors numbered 1-28 in
// old-style serif, each with a tiny moon-phase icon showing the moon's age in
// that mansion; inner ring of the 7 planetary rulers (each ruling 4 mansions
// in sequence); at the hub the arcana's scene inside a crescent moon. The
// mansion matching the card's number is gilded. Kufic-esque interlace-square
// corner ornaments. Server-component safe: no hooks, no client directive.

const CX = 150;
const CY = 238;
const STEP = 360 / 28; // degrees per mansion

const SECTORS = Array.from({ length: 28 }, (_, i) => i + 1);
// the seven planetary rulers, in mansion sequence (U+FE0E after every glyph)
const RULERS = ["☉\uFE0E", "☽\uFE0E", "☿\uFE0E", "♀\uFE0E", "♂\uFE0E", "♃\uFE0E", "♄\uFE0E"];

// silhouette ink for hub figures, shadow for face openings
const FIG = "#3c2b1a";
const FACE = "#1d130a";
const PARCH_LIGHT = "#e8d9b0";
const MOONLIT = "#f3e6bd";

interface Palette {
  ink: string;
  sepia: string;
  gold: string;
  goldPale: string;
  rubric: string;
}

// variant 0 is the original look; 1-7 are small palette variations
const PALETTES: Palette[] = [
  { ink: "#4a3423", sepia: "#5c422a", gold: "#b8922e", goldPale: "#e9cf8a", rubric: "#8f2f1c" },
  { ink: "#33304e", sepia: "#46436b", gold: "#b89a3a", goldPale: "#e6d18e", rubric: "#7d3b4e" },
  { ink: "#452a20", sepia: "#63392a", gold: "#c09a2c", goldPale: "#eed28a", rubric: "#a02020" },
  { ink: "#3d3a26", sepia: "#57532f", gold: "#a88f2d", goldPale: "#e3d393", rubric: "#7a4620" },
  { ink: "#2e2016", sepia: "#4a3018", gold: "#a67c1b", goldPale: "#dfc178", rubric: "#7c2a16" },
  { ink: "#2f3348", sepia: "#4a4e6e", gold: "#b3a06a", goldPale: "#e8e0c0", rubric: "#5b3a6e" },
  { ink: "#4a2c2c", sepia: "#6b4040", gold: "#bd9433", goldPale: "#ecd294", rubric: "#a03040" },
  { ink: "#2c3a36", sepia: "#40584c", gold: "#b0902e", goldPale: "#e5cd8c", rubric: "#84502a" },
];

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

// Regular star path (points outer r1, inner r2, first point straight up).
function starPath(cx: number, cy: number, r1: number, r2: number, points: number): string {
  let d = "";
  for (let k = 0; k < points * 2; k++) {
    const r = k % 2 === 0 ? r1 : r2;
    const a = (Math.PI * k) / points - Math.PI / 2;
    d += `${k === 0 ? "M" : "L"} ${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)} `;
  }
  return `${d}Z`;
}

const WEDGE = mansionWedge();

// Roman numerals for the decorated number box (covers the major arcana range).
function toRoman(n: number): string {
  const table: Array<[number, string]> = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let rest = Math.max(0, Math.round(n));
  let out = "";
  for (const [v, s] of table) {
    while (rest >= v) {
      out += s;
      rest -= v;
    }
  }
  return out || "0";
}

// ---- hub scenes: each arcana drawn inside the crescent at the wheel's hub ----

function HermitScene(P: Palette) {
  return (
    <>
      <line x1="141" y1="218" x2="143.5" y2="252" stroke={P.sepia} strokeWidth="1.3" strokeLinecap="round" />
      <path
        d="M 144 252 Q 142 232 145.5 223 Q 147.5 215.5 150.5 215 Q 153.5 215.5 155.5 223 Q 159 232 157 252 Z"
        fill={FIG}
        stroke={P.sepia}
        strokeWidth="0.7"
        strokeLinejoin="round"
      />
      <ellipse cx="150.5" cy="223.5" rx="2.6" ry="3.4" fill={FACE} />
      <line x1="156" y1="229" x2="159.5" y2="233" stroke={P.sepia} strokeWidth="0.8" />
      <circle cx="160.5" cy="236" r="4.5" fill={P.goldPale} opacity="0.35" />
      <path
        d="M 158 233.5 L 163 233.5 L 162.2 239.5 L 158.8 239.5 Z"
        fill={P.gold}
        stroke={P.sepia}
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      <circle cx="160.5" cy="236.5" r="0.9" fill="#fff6d8" />
    </>
  );
}

function MagicianScene(P: Palette) {
  return (
    <>
      {/* table with the four tools: cup, sword, pentacle, wand */}
      <line x1="136" y1="246" x2="164" y2="246" stroke={P.sepia} strokeWidth="1" />
      <line x1="139" y1="246" x2="139" y2="251" stroke={P.sepia} strokeWidth="0.7" />
      <line x1="161" y1="246" x2="161" y2="251" stroke={P.sepia} strokeWidth="0.7" />
      <path d={`M 139.5 241.5 L 142.5 241.5 A 1.5 1.5 0 0 1 139.5 241.5 Z`} fill={P.gold} stroke={P.sepia} strokeWidth="0.4" />
      <line x1="147" y1="239.5" x2="147" y2="245" stroke={P.ink} strokeWidth="0.7" />
      <line x1="145.8" y1="243.2" x2="148.2" y2="243.2" stroke={P.ink} strokeWidth="0.5" />
      <circle cx="153" cy="243" r="1.6" fill="none" stroke={P.gold} strokeWidth="0.6" />
      <circle cx="153" cy="243" r="0.4" fill={P.gold} />
      <line x1="158" y1="245" x2="160.5" y2="240" stroke={P.sepia} strokeWidth="0.8" strokeLinecap="round" />
      {/* figure, right arm raised with a wand, left arm pointing down */}
      <path d="M 146 246 Q 145 230 148 220 L 153 220 Q 156 230 155 246 Z" fill={FIG} stroke={P.sepia} strokeWidth="0.6" />
      <circle cx="150.5" cy="215.5" r="3" fill={FIG} />
      <path d="M 153 222 Q 157 216 159 210" fill="none" stroke={FIG} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="159" y1="210" x2="161.5" y2="201" stroke={P.sepia} strokeWidth="0.9" strokeLinecap="round" />
      <path d="M 148 222 Q 144 228 143 234" fill="none" stroke={FIG} strokeWidth="1.6" strokeLinecap="round" />
      {/* lemniscate above the head */}
      <g className="cz-lmans-amb-twinkle">
        <path
          d="M 150.5 204.5 c -1.8 -3 -6 -3 -6 0 c 0 3 4.2 3 6 0 c 1.8 -3 6 -3 6 0 c 0 3 -4.2 3 -6 0 Z"
          fill="none"
          stroke={P.gold}
          strokeWidth="0.9"
        />
      </g>
    </>
  );
}

function EmpressScene(P: Palette) {
  return (
    <>
      {/* wheat stalks flanking the figure */}
      <g stroke={P.gold} strokeWidth="0.7" fill="none">
        <path d="M 137 252 L 137 232" />
        <path d="M 137 236 l -2.5 -2 M 137 236 l 2.5 -2 M 137 241 l -2.5 -2 M 137 241 l 2.5 -2 M 137 246 l -2.5 -2 M 137 246 l 2.5 -2" />
        <path d="M 163 252 L 163 232" />
        <path d="M 163 236 l -2.5 -2 M 163 236 l 2.5 -2 M 163 241 l -2.5 -2 M 163 241 l 2.5 -2 M 163 246 l -2.5 -2 M 163 246 l 2.5 -2" />
      </g>
      {/* robe and head */}
      <path d="M 142 252 Q 140 228 146 220 L 154 220 Q 160 228 158 252 Z" fill={FIG} stroke={P.sepia} strokeWidth="0.6" />
      <circle cx="150" cy="215.5" r="3" fill={FIG} />
      {/* crown of stars */}
      <g fill={P.gold} className="cz-lmans-amb-twinkle">
        <path d={starPath(150, 208, 2.6, 1.1, 4)} />
        <path d={starPath(144.5, 209.5, 2.2, 0.9, 4)} />
        <path d={starPath(155.5, 209.5, 2.2, 0.9, 4)} />
      </g>
      {/* heart shield bearing the Venus glyph */}
      <path
        d="M 159 237.5 C 157 234.5 153.5 235.5 153.5 238 C 153.5 240.5 157 242.5 159 244.5 C 161 242.5 164.5 240.5 164.5 238 C 164.5 235.5 161 234.5 159 237.5 Z"
        fill={P.rubric}
        stroke={P.sepia}
        strokeWidth="0.5"
      />
      <text
        x="159"
        y="241.5"
        textAnchor="middle"
        fontFamily="Georgia, 'DejaVu Sans', 'Segoe UI Symbol', serif"
        fontSize="5"
        fill={MOONLIT}
      >
        {"♀\uFE0E"}
      </text>
    </>
  );
}

function ChariotScene(P: Palette) {
  return (
    <>
      {/* city wall behind */}
      <g fill={PARCH_LIGHT} stroke={P.ink} strokeWidth="0.6">
        <rect x="129" y="214" width="6.5" height="9" />
        <rect x="164.5" y="214" width="6.5" height="9" />
        <path d="M 135.5 218 h 29 v 5 h -29 Z" />
        <path d="M 129 214 v -2 h 2 v 2 M 131.5 214 v -2 h 2 v 2 M 164.5 214 v -2 h 2 v 2 M 167 214 v -2 h 2 v 2" fill={PARCH_LIGHT} />
      </g>
      {/* starry canopy over the chariot */}
      <path d="M 138 233 Q 150 219 162 233" fill="none" stroke={P.gold} strokeWidth="1" />
      <line x1="138" y1="233" x2="138" y2="240" stroke={P.gold} strokeWidth="0.7" />
      <line x1="162" y1="233" x2="162" y2="240" stroke={P.gold} strokeWidth="0.7" />
      <g fill={P.gold}>
        <circle cx="145" cy="228.5" r="0.7" />
        <circle cx="150" cy="226.5" r="0.7" />
        <circle cx="155" cy="228.5" r="0.7" />
      </g>
      {/* charioteer bust + chariot box + wheels */}
      <circle cx="150" cy="232" r="2.2" fill={FIG} />
      <path d="M 146.5 235 q 3.5 -2.5 7 0 l 1 3 h -9 Z" fill={FIG} />
      <rect x="141" y="237" width="18" height="8" fill={PARCH_LIGHT} stroke={P.sepia} strokeWidth="0.7" />
      <circle cx="144.5" cy="247" r="2.2" fill="none" stroke={P.ink} strokeWidth="0.7" />
      <circle cx="155.5" cy="247" r="2.2" fill="none" stroke={P.ink} strokeWidth="0.7" />
      {/* two sphinxes, dark and light, crouched before the chariot */}
      <path d="M 128 252 q -0.5 -5 3.5 -5 q 3.5 0 4 3.5 l 0 1.5 Z" fill={P.sepia} />
      <circle cx="134" cy="246" r="1.7" fill={P.sepia} />
      <path d="M 172 252 q 0.5 -5 -3.5 -5 q -3.5 0 -4 3.5 l 0 1.5 Z" fill="#8a6a44" />
      <circle cx="166" cy="246" r="1.7" fill="#8a6a44" />
    </>
  );
}

function WheelScene(P: Palette) {
  return (
    <>
      {/* snake descending on the left */}
      <path d="M 133 222 q -3 4 0 8 q 3 4 0 8 q -3 4 0 8" fill="none" stroke={P.sepia} strokeWidth="0.9" />
      {/* sphinx resting on top of the wheel */}
      <path d="M 145 216 q 0 -3 3 -3 h 4 q 3 0 3 3 l 0 2 h -10 Z" fill={P.sepia} />
      <circle cx="150" cy="210" r="1.8" fill={P.sepia} />
      {/* the spoked wheel, turning imperceptibly */}
      <g className="cz-lmans-amb-turn">
        <circle cx="150" cy="238" r="13" fill="none" stroke={P.ink} strokeWidth="1.1" />
        <circle cx="150" cy="238" r="3.2" fill="none" stroke={P.ink} strokeWidth="0.8" />
        {[0, 45, 90, 135].map((a) => (
          <g key={a} transform={`rotate(${a} 150 238)`}>
            <line x1="150" y1="226.5" x2="150" y2="249.5" stroke={P.ink} strokeWidth="0.7" />
          </g>
        ))}
        <circle cx="150" cy="238" r="1" fill={P.gold} />
      </g>
    </>
  );
}

function DeathScene(P: Palette) {
  return (
    <>
      {/* the sun rising between two towers */}
      <rect x="126" y="212" width="7" height="16" fill={PARCH_LIGHT} stroke={P.ink} strokeWidth="0.6" />
      <rect x="167" y="212" width="7" height="16" fill={PARCH_LIGHT} stroke={P.ink} strokeWidth="0.6" />
      <g className="cz-lmans-amb-twinkle">
        <circle cx="150" cy="220" r="4" fill={P.goldPale} stroke={P.gold} strokeWidth="0.7" />
        <path
          d="M 150 214 v -2.5 M 150 226 v 2.5 M 144 220 h -2.5 M 156 220 h 2.5 M 145.8 215.8 l -1.8 -1.8 M 154.2 224.2 l 1.8 1.8 M 154.2 215.8 l 1.8 -1.8 M 145.8 224.2 l -1.8 1.8"
          stroke={P.gold}
          strokeWidth="0.6"
        />
      </g>
      {/* horse, composed silhouette */}
      <g fill={FIG} stroke={P.sepia} strokeWidth="0.4">
        <ellipse cx="149" cy="243.5" rx="10" ry="4.2" />
        <path d="M 155 241 Q 160 236 162 230.5 L 166.5 232 Q 163.5 238 158.5 242 Z" />
        <path d="M 141 246.5 l -1 6.5 h 2 l 1 -6.5 Z M 146 247.5 l -0.5 5.5 h 2 l 0.5 -5.5 Z M 152 247.5 l 0.5 5.5 h 2 l -0.5 -5.5 Z M 157 246 l 1 6.5 h 2 l -1 -6.5 Z" />
      </g>
      {/* skeleton rider */}
      <circle cx="149" cy="228.5" r="2.4" fill={MOONLIT} stroke={P.sepia} strokeWidth="0.5" />
      <circle cx="148.2" cy="228" r="0.4" fill={FACE} />
      <circle cx="149.8" cy="228" r="0.4" fill={FACE} />
      <path d="M 149 231.5 v 6 M 149 233 h 3 M 149 235 h 3.2 M 149 237 h 3" stroke={MOONLIT} strokeWidth="0.8" />
      {/* rose banner */}
      <line x1="153" y1="232" x2="158" y2="228" stroke={MOONLIT} strokeWidth="0.8" />
      <line x1="158.5" y1="212" x2="158.5" y2="238" stroke={P.sepia} strokeWidth="0.8" />
      <path d="M 158.5 213 h 9 v 6.5 h -9 Z" fill={P.rubric} stroke={P.sepia} strokeWidth="0.5" />
      <circle cx="163" cy="216.2" r="1.6" fill="none" stroke={MOONLIT} strokeWidth="0.6" />
      <circle cx="163" cy="216.2" r="0.5" fill={MOONLIT} />
    </>
  );
}

function StarScene(P: Palette) {
  return (
    <>
      {/* seven small stars around the great one */}
      <g fill={P.gold}>
        <path d={starPath(128, 226, 1.8, 0.75, 4)} />
        <path d={starPath(134, 212, 1.8, 0.75, 4)} />
        <path d={starPath(166, 212, 1.8, 0.75, 4)} />
        <path d={starPath(172, 226, 1.8, 0.75, 4)} />
        <path d={starPath(131, 240, 1.8, 0.75, 4)} />
        <path d={starPath(169, 240, 1.8, 0.75, 4)} />
        <path d={starPath(150, 199, 1.8, 0.75, 4)} />
      </g>
      {/* the great eight-pointed star, softly twinkling */}
      <g className="cz-lmans-amb-twinkle">
        <path d={starPath(150, 212, 7, 2.8, 8)} fill={P.gold} stroke={P.sepia} strokeWidth="0.5" />
      </g>
      {/* kneeling figure pouring two jugs */}
      <circle cx="150.5" cy="230" r="2.6" fill={FIG} />
      <path d="M 147 248 q -1 -9 1.5 -15 l 4 -1 q 2.5 6 2 10 l 4 2 q 1 2 0 4 h -11.5 Z" fill={FIG} stroke={P.sepia} strokeWidth="0.5" />
      {/* jugs at the hands */}
      <path d="M 141 239 q -1.6 0 -1.6 2 q 0 1.6 1.6 1.6 q 1.6 0 1.6 -1.6 q 0 -2 -1.6 -2 Z M 140.4 237.5 l 1.2 -1.8" fill={PARCH_LIGHT} stroke={P.sepia} strokeWidth="0.5" />
      <path d="M 160 239 q -1.6 0 -1.6 2 q 0 1.6 1.6 1.6 q 1.6 0 1.6 -1.6 q 0 -2 -1.6 -2 Z M 159.4 237.5 l 1.2 -1.8" fill={PARCH_LIGHT} stroke={P.sepia} strokeWidth="0.5" />
      {/* two streams of water */}
      <path d="M 141 243 q -1.5 4 0 9" fill="none" stroke={P.ink} strokeWidth="0.6" opacity="0.75" />
      <path d="M 160 243 q 1.5 4 0 9" fill="none" stroke={P.ink} strokeWidth="0.6" opacity="0.75" />
    </>
  );
}

function FoolScene(P: Palette) {
  return (
    <>
      {/* the sun, high at the cliff side */}
      <g className="cz-lmans-amb-twinkle">
        <circle cx="165" cy="212" r="3.5" fill={P.goldPale} stroke={P.gold} strokeWidth="0.7" />
        <path d="M 165 206 v -2 M 165 218 v 2 M 159 212 h -2 M 171 212 h 2 M 160.8 207.8 l -1.5 -1.5 M 169.2 216.2 l 1.5 1.5 M 169.2 207.8 l 1.5 -1.5 M 160.8 216.2 l -1.5 1.5" stroke={P.gold} strokeWidth="0.6" />
      </g>
      {/* cliff edge under his forward foot */}
      <path d="M 122 250 L 156 250 L 150 257" fill="none" stroke={P.ink} strokeWidth="0.9" />
      <path d="M 153 252.5 l -1.5 1.8 M 148 253.5 l -1.2 1.5" stroke={P.ink} strokeWidth="0.5" opacity="0.7" />
      {/* the little dog at his heels */}
      <path d="M 131 249 q 0 -3.2 3 -3.2 q 2.6 0 3.2 2 l 2.2 -1.6 l 0.6 1.1 l -2.2 1.6 q 0 1.1 -1.4 1.1 h -3.4 q -2 0 -2 -1 Z" fill={P.sepia} />
      {/* figure stepping toward the edge, bundle on a stick over the shoulder */}
      <path d="M 145 249 Q 144 235 147.5 228 L 152 228 Q 154.5 235 153 249 Z" fill={FIG} stroke={P.sepia} strokeWidth="0.5" />
      <circle cx="149.5" cy="224.5" r="2.6" fill={FIG} />
      <path d="M 152 246 l 5.5 3" stroke={FIG} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="147.5" y1="230" x2="140" y2="220" stroke={P.sepia} strokeWidth="0.8" />
      <circle cx="138.8" cy="218.8" r="2.2" fill={P.rubric} stroke={P.sepia} strokeWidth="0.5" />
      <path d="M 147 221.5 l -2 -2.5" stroke={P.gold} strokeWidth="0.7" strokeLinecap="round" />
    </>
  );
}

function hubScene(num: number, P: Palette) {
  switch (num) {
    case 1:
      return MagicianScene(P);
    case 3:
      return EmpressScene(P);
    case 7:
      return ChariotScene(P);
    case 10:
      return WheelScene(P);
    case 13:
      return DeathScene(P);
    case 17:
      return StarScene(P);
    case 22:
      return FoolScene(P);
    case 9:
    default:
      return HermitScene(P);
  }
}

interface LunarMansionsProps {
  number?: number;
  name?: string;
  variant?: number;
}

export default function LunarMansionsHermitCard({
  number = 9,
  name = "THE HERMIT",
  variant = 0,
}: LunarMansionsProps) {
  const P = PALETTES[variant] ?? PALETTES[0];
  // gilded mansion follows the card number where the wheel can hold it
  const gilt = number >= 1 && number <= 28 ? number - 1 : 8;
  // long titles shrink to fit the plate
  const nLen = name.length;
  const nameSize = nLen <= 11 ? 18 : nLen <= 16 ? 14.5 : 12;
  const nameTrack = nLen <= 11 ? 5 : nLen <= 16 ? 3 : 1.8;

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
        /* scene-specific ambient: slow wheel turn, soft star/sun twinkle */
        .cz-lmans-amb-turn {
          transform-box: fill-box;
          transform-origin: center;
          animation: cz-lmans-turn 160s linear infinite;
        }
        .cz-lmans-amb-twinkle {
          animation: cz-lmans-twinkle 9s ease-in-out infinite alternate;
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
        @keyframes cz-lmans-turn {
          to { transform: rotate(360deg); }
        }
        @keyframes cz-lmans-twinkle {
          from { opacity: .45; }
          to   { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cz-lmans-sector,
          .cz-lmans-gilt,
          .cz-lmans-hub,
          .cz-lmans-breath,
          .cz-lmans-glow,
          .cz-lmans-amb-turn,
          .cz-lmans-amb-twinkle {
            animation: none;
          }
        }
      `}</style>

      <svg
        viewBox="0 0 300 450"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={`${name}, tarot trump ${number}, drawn as a medieval wheel of the twenty-eight mansions of the moon`}
      >
        <defs>
          <radialGradient id="cz-lmans-parch" cx="50%" cy="44%" r="78%">
            <stop offset="0%" stopColor="#f2e8cd" />
            <stop offset="70%" stopColor="#eee2c2" />
            <stop offset="100%" stopColor="#dcc79c" />
          </radialGradient>
          <linearGradient id="cz-lmans-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d9b45c" />
            <stop offset="55%" stopColor={P.gold} />
            <stop offset="100%" stopColor="#8f6d1c" />
          </linearGradient>
          {/* crescent: full disc minus an offset disc */}
          <mask id="cz-lmans-cmask">
            <circle cx={CX} cy={CY} r="30" fill="#fff" />
            <circle cx={CX} cy={CY - 12} r="26" fill="#000" />
          </mask>
          {/* kufic-esque corner ornament: interlaced squares */}
          <g id="cz-lmans-knot" fill="none">
            <rect x="-9" y="-9" width="18" height="18" stroke={P.ink} strokeWidth="0.9" />
            <rect x="-9" y="-9" width="18" height="18" transform="rotate(45)" stroke={P.ink} strokeWidth="0.9" />
            <rect x="-3.5" y="-3.5" width="7" height="7" stroke={P.gold} strokeWidth="0.8" />
          </g>
        </defs>

        {/* aged parchment ground + faint stains */}
        <rect x="0" y="0" width="300" height="450" fill="url(#cz-lmans-parch)" />
        <ellipse cx="52" cy="388" rx="42" ry="24" fill="#a8894e" opacity="0.08" />
        <ellipse cx="256" cy="86" rx="34" ry="20" fill="#a8894e" opacity="0.07" />
        <ellipse cx="246" cy="352" rx="28" ry="38" fill="#9a7c44" opacity="0.06" />

        {/* thin double frame */}
        <rect x="8" y="8" width="284" height="434" fill="none" stroke={P.ink} strokeWidth="1.4" opacity="0.85" />
        <rect x="13" y="13" width="274" height="424" fill="none" stroke={P.ink} strokeWidth="0.55" opacity="0.6" />

        {/* interlace-square corner ornaments */}
        <use href="#cz-lmans-knot" transform="translate(30 30)" />
        <use href="#cz-lmans-knot" transform="translate(270 30)" />
        <use href="#cz-lmans-knot" transform="translate(30 420)" />
        <use href="#cz-lmans-knot" transform="translate(270 420)" />

        {/* decorated box with the card number */}
        <g>
          <rect x="118" y="24" width="64" height="34" fill="#efe3c2" stroke={P.gold} strokeWidth="1.6" />
          <rect x="122" y="28" width="56" height="26" fill="none" stroke={P.gold} strokeWidth="0.6" opacity="0.8" />
          <circle cx="126.5" cy="32.5" r="1.1" fill={P.gold} />
          <circle cx="173.5" cy="32.5" r="1.1" fill={P.gold} />
          <circle cx="126.5" cy="49.5" r="1.1" fill={P.gold} />
          <circle cx="173.5" cy="49.5" r="1.1" fill={P.gold} />
          <text
            x="150"
            y="47"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="700"
            fontSize="19"
            fill={P.sepia}
          >
            {toRoman(number)}
          </text>
          {/* small diamonds flanking the box */}
          <path d="M 98 41 L 101 37.5 L 104 41 L 101 44.5 Z" fill={P.gold} />
          <path d="M 196 41 L 199 37.5 L 202 41 L 199 44.5 Z" fill={P.gold} />
        </g>

        {/* the mansions wheel, breathing very slowly */}
        <g className="cz-lmans-breath">
          {/* base rings of the plate */}
          <circle cx={CX} cy={CY} r="103" fill="none" stroke={P.ink} strokeWidth="1.8" />
          <circle cx={CX} cy={CY} r="99.5" fill="none" stroke={P.ink} strokeWidth="0.5" opacity="0.6" />
          <circle cx={CX} cy={CY} r="77" fill="none" stroke={P.ink} strokeWidth="1.1" />
          <circle cx={CX} cy={CY} r="74" fill="none" stroke={P.gold} strokeWidth="0.6" opacity="0.8" />
          <circle cx={CX} cy={CY} r="52" fill="none" stroke={P.ink} strokeWidth="1" />
          <circle cx={CX} cy={CY} r="43" fill="none" stroke={P.ink} strokeWidth="0.5" opacity="0.6" />

          {/* boundary ticks between each ruler's four-mansion span */}
          {SECTORS.map((i) => (
            <g key={`tk${i}`} transform={`rotate(${(i - 1) * STEP} ${CX} ${CY})`}>
              <line x1={CX} y1={CY - 74} x2={CX} y2={CY - 52} stroke={P.ink} strokeWidth="0.4" opacity="0.5" />
            </g>
          ))}

          {/* the gilded mansion, beneath the sector ink */}
          <g transform={`rotate(${gilt * STEP} ${CX} ${CY})`}>
            <g className="cz-lmans-gilt">
              <path d={WEDGE} fill="url(#cz-lmans-gold)" opacity="0.55" stroke={P.gold} strokeWidth="0.9" />
            </g>
            <path d={WEDGE} fill={P.goldPale} className="cz-lmans-glow" />
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
                  <line x1={CX} y1={CY - 103} x2={CX} y2={CY - 77} stroke={P.ink} strokeWidth="0.55" />
                  <g transform={`rotate(${STEP / 2} ${CX} ${CY})`}>
                    <g transform={flip ? `rotate(180 ${CX} ${numY})` : undefined}>
                      <text
                        x={CX}
                        y={numY + 2}
                        textAnchor="middle"
                        fontFamily="Georgia, 'Times New Roman', serif"
                        fontSize="6.4"
                        fill={i === gilt + 1 ? "#6b4d10" : P.sepia}
                        fontWeight={i === gilt + 1 ? "700" : "400"}
                      >
                        {i}
                      </text>
                    </g>
                    {/* tiny moon showing the moon's age in this mansion */}
                    <g transform={`translate(${CX} ${CY - 81.5})`}>
                      <circle r="4.1" fill="#4a3826" fillOpacity="0.5" stroke={P.ink} strokeWidth="0.55" />
                      <path d={moonLitPath((i - 1) / 28, 4.1)} fill={MOONLIT} />
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
                    fill={P.ink}
                  >
                    {g}
                  </text>
                </g>
              </g>
            );
          })}

          {/* hub: the arcana's scene inside a crescent moon */}
          <g className="cz-lmans-hub">
            <circle cx={CX} cy={CY} r="40" fill="#f0e4c4" stroke={P.gold} strokeWidth="1.1" />
            <circle cx={CX} cy={CY} r="36.5" fill="none" stroke={P.ink} strokeWidth="0.45" opacity="0.55" />
            {/* gilded crescent, horns upward */}
            <circle cx={CX} cy={CY} r="30" fill="url(#cz-lmans-gold)" mask="url(#cz-lmans-cmask)" opacity="0.9" />
            {hubScene(number, P)}
          </g>
        </g>

        {/* rubrication + title */}
        <g>
          <line x1="64" y1="368" x2="236" y2="368" stroke={P.rubric} strokeWidth="1.1" />
          <path d="M 56 368 L 60 364.8 L 64 368 L 60 371.2 Z" fill={P.rubric} />
          <path d="M 236 368 L 240 364.8 L 244 368 L 240 371.2 Z" fill={P.rubric} />
          <text
            x="150"
            y="394"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="700"
            fontSize={nameSize}
            letterSpacing={nameTrack}
            fill="#2f2013"
          >
            {name}
          </text>
          <text
            x="150"
            y="412"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fontSize="10"
            letterSpacing="2.5"
            fill={P.sepia}
            opacity="0.95"
          >
            · mansiones lunae ·
          </text>
          <line x1="64" y1="424" x2="236" y2="424" stroke={P.rubric} strokeWidth="1.1" />
          <path d="M 56 424 L 60 420.8 L 64 424 L 60 427.2 Z" fill={P.rubric} />
          <path d="M 236 424 L 240 420.8 L 244 424 L 240 427.2 Z" fill={P.rubric} />
        </g>
      </svg>
    </figure>
  );
}
