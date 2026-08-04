// NOCTURLABE — major arcana as a nocturnal (star clock) instrument plate.
// Dark navy-black lacquer, engraved silver with pale-gold highlights. Outer
// date ring with month abbreviations, hour-scale teeth on the rim, an inner
// rotating star dial carrying Ursa Major and Cassiopeia around a central
// Polaris (sighted through the center hole), and a long regula pointer arm.
// Each arcana is integrated into the instrument: its figure/motif consults or
// inhabits the dial, and its own light source becomes the focal star.
// Props: number (1,3,7,9,10,13,17,22; anything else falls back to 9 Hermit),
// name (rendered dynamically), variant (0-7 palette variations, 0 = original).
// Server-component safe: no hooks, no client directive.

const CX = 150;
const CY = 190;
const R_OUT = 116;

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const HOUR_TEETH = Array.from({ length: 24 }, (_, i) => i * 15);
const MONTH_DIVIDERS = Array.from({ length: 12 }, (_, i) => i * 30 + 15);

// constellation figures, dial-local coordinates relative to Polaris (0,0)
const URSA: [number, number][] = [
  [-62, -14],
  [-60, 10],
  [-34, 14],
  [-32, -6],
  [-4, -16],
  [18, -24],
  [40, -28],
];
const URSA_LINES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [3, 4],
  [4, 5],
  [5, 6],
];
const CASSIOPEIA: [number, number][] = [
  [-14, 58],
  [2, 44],
  [20, 58],
  [38, 46],
  [54, 58],
];

// faint field stars engraved on the rotating dial (x, y offset, radius)
const FIELD_STARS: [number, number, number][] = [
  [-78, -52, 1.1],
  [-40, -62, 0.9],
  [12, -68, 1.2],
  [52, -58, 0.9],
  [74, -30, 1.1],
  [84, 8, 0.8],
  [-86, 18, 1.0],
  [-70, 44, 0.8],
  [-44, 66, 1.1],
  [66, 70, 0.9],
  [86, 40, 1.0],
  [-20, -84, 0.8],
  [34, -84, 1.0],
  [-88, -22, 0.9],
];

// The Star (XVII): seven small stars circling the great one
const SEVEN_STARS: [number, number][] = Array.from({ length: 7 }, (_, i) => {
  const a = ((-90 + i * (360 / 7)) * Math.PI) / 180;
  return [CX + 44 * Math.cos(a), CY + 44 * Math.sin(a)];
});

const BG_DEEP = "#070b17";

interface Palette {
  silver: string;
  dim: string;
  faint: string;
  gold: string;
  deep: string;
}

// variant 0 is the original plate; the rest are small palette variations
const PALETTES: Palette[] = [
  { silver: "#b9c6d8", dim: "#7e8ea6", faint: "#55647c", gold: "#d9c084", deep: "#a98f4e" },
  { silver: "#c3cbd6", dim: "#8a93a4", faint: "#5a6274", gold: "#e6c97a", deep: "#b3924a" },
  { silver: "#aebfd6", dim: "#7288a8", faint: "#4c5e7c", gold: "#cfd6e2", deep: "#8e9aae" },
  { silver: "#c8c2b2", dim: "#948c78", faint: "#665f4e", gold: "#e0b46a", deep: "#a8803c" },
  { silver: "#b4c8c8", dim: "#789494", faint: "#4e6666", gold: "#d4c88e", deep: "#9a8f56" },
  { silver: "#c2b8cc", dim: "#8a8098", faint: "#5c5468", gold: "#dcc490", deep: "#a38f58" },
  { silver: "#bcccd8", dim: "#7e96aa", faint: "#52687c", gold: "#e2d3a2", deep: "#ab9660" },
  { silver: "#c6ccd4", dim: "#8b95a1", faint: "#59636f", gold: "#c9a86a", deep: "#96783f" },
];

const SCENE_NUMBERS: readonly number[] = [1, 3, 7, 9, 10, 13, 17, 22];
const NUM_WORDS: Record<number, string> = {
  1: "one",
  3: "three",
  7: "seven",
  9: "nine",
  10: "ten",
  13: "thirteen",
  17: "seventeen",
  22: "twenty-two",
};

function toRoman(n: number): string {
  const table: [number, string][] = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let v = Math.max(1, Math.min(39, Math.floor(n)));
  let s = "";
  for (const [val, sym] of table) {
    while (v >= val) {
      s += sym;
      v -= val;
    }
  }
  return s;
}

// polygonal star path: `spikes` points, alternating outer/inner radius
function starPath(cx: number, cy: number, spikes: number, rOuter: number, rInner: number): string {
  const pts: string[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = ((-90 + (i * 180) / spikes) * Math.PI) / 180;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return `M ${pts.join(" L ")} Z`;
}

interface SceneProps {
  scene: number;
  pal: Palette;
}

// focal point of the dial: Polaris by default, reimagined per arcana
function FocalStar({ scene, pal }: SceneProps) {
  if (scene === 13) {
    // Death: the sun setting/rising between the towers, at the pole
    return (
      <g className="cz-noct-polaris">
        <path d={starPath(CX, CY, 12, 11, 4.5)} fill={pal.gold} />
        <circle cx={CX} cy={CY} r="2.4" fill="#f4e3ae" />
      </g>
    );
  }
  if (scene === 17) {
    // The Star: the great eight-pointed star
    return (
      <g className="cz-noct-polaris">
        <path d={starPath(CX, CY, 8, 13, 5.5)} fill={pal.gold} />
        <circle cx={CX} cy={CY} r="2.6" fill="#f4e3ae" />
      </g>
    );
  }
  return (
    <g className="cz-noct-polaris">
      <path
        d={`M ${CX} ${CY - 9} L ${CX + 2} ${CY - 2} L ${CX + 9} ${CY} L ${CX + 2} ${CY + 2} L ${CX} ${CY + 9} L ${CX - 2} ${CY + 2} L ${CX - 9} ${CY} L ${CX - 2} ${CY - 2} Z`}
        fill={pal.gold}
      />
      <circle cx={CX} cy={CY} r="2.4" fill="#f4e3ae" />
    </g>
  );
}

// additions engraved on the rotating star dial, per arcana
function DialExtras({ scene, pal }: SceneProps) {
  if (scene === 10) {
    // Wheel of Fortune: the star dial itself becomes the spoked wheel
    return (
      <g>
        <circle cx={CX} cy={CY} r="10" fill="none" stroke={pal.dim} strokeWidth="0.8" />
        {Array.from({ length: 8 }, (_, i) => i * 45 + 22.5).map((a) => (
          <g key={a} transform={`rotate(${a} ${CX} ${CY})`}>
            <line x1={CX} y1={CY - 10} x2={CX} y2={CY - 86} stroke={pal.dim} strokeWidth="0.8" />
          </g>
        ))}
        {["T", "A", "R", "O"].map((ch, i) => (
          <g key={ch} transform={`rotate(${i * 90 + 45} ${CX} ${CY})`}>
            <text
              x={CX}
              y={CY - 55}
              textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontSize="8.5"
              letterSpacing="1"
              fill={pal.gold}
            >
              {ch}
            </text>
          </g>
        ))}
      </g>
    );
  }
  if (scene === 17) {
    // The Star: seven small stars around the great one
    return (
      <g fill={pal.silver} opacity="0.9">
        {SEVEN_STARS.map(([x, y], i) => (
          <path key={i} d={starPath(x, y, 4, 3.2, 1.3)} />
        ))}
      </g>
    );
  }
  if (scene === 22) {
    // The Fool: the polar star burns as his sun, rayed
    return (
      <g stroke={pal.gold} strokeWidth="0.6" opacity="0.7">
        {Array.from({ length: 8 }, (_, i) => i * 45).map((a) => (
          <g key={a} transform={`rotate(${a} ${CX} ${CY})`}>
            <line x1={CX} y1={CY - 12} x2={CX} y2={CY - 17} />
          </g>
        ))}
      </g>
    );
  }
  return null;
}

// the arcana scene at the base of the instrument (fades in on load)
function SceneFigure({ scene, pal }: SceneProps) {
  if (scene === 1) {
    // The Magician: wand raised to the dial, the four suits on his table
    return (
      <g className="cz-noct-hermit">
        <circle className="cz-noct-glow" cx="184" cy="290" r="18" fill="url(#cz-noct-lantern-glow)" />
        {/* lemniscate above the head */}
        <path
          d="M 150 306 C 145 300 136 301 137 306 C 138 311 146 311 150 306 C 154 311 162 311 163 306 C 164 301 155 300 150 306 Z"
          fill="none"
          stroke={pal.gold}
          strokeWidth="1"
        />
        <circle cx="150" cy="319" r="5" fill="#0d1526" stroke={pal.silver} strokeWidth="1.2" />
        <line x1="145" y1="316" x2="155" y2="316" stroke={pal.gold} strokeWidth="0.9" />
        <path d="M 140 330 Q 135 350 137 368 L 163 368 Q 165 350 160 330" fill="#0d1526" stroke={pal.silver} strokeWidth="1.3" />
        <path d="M 159 334 Q 170 320 178 304" fill="none" stroke={pal.silver} strokeWidth="1.3" strokeLinecap="round" />
        <line x1="178" y1="304" x2="186" y2="288" stroke={pal.gold} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M 141 334 Q 134 344 131 354" fill="none" stroke={pal.silver} strokeWidth="1.3" strokeLinecap="round" />
        {/* table with cup, sword, pentacle, wand */}
        <line x1="92" y1="344" x2="126" y2="344" stroke={pal.silver} strokeWidth="1.1" />
        <line x1="95" y1="344" x2="95" y2="366" stroke={pal.silver} strokeWidth="0.8" />
        <line x1="123" y1="344" x2="123" y2="366" stroke={pal.silver} strokeWidth="0.8" />
        <path d="M 98 336 L 104 336 L 103 341 Q 101 343 99 341 Z" fill="none" stroke={pal.silver} strokeWidth="0.8" />
        <line x1="107" y1="334" x2="112" y2="343" stroke={pal.silver} strokeWidth="0.8" />
        <line x1="106" y1="338" x2="110" y2="336" stroke={pal.silver} strokeWidth="0.7" />
        <circle cx="117" cy="339" r="2.6" fill="none" stroke={pal.gold} strokeWidth="0.8" />
        <circle cx="117" cy="339" r="0.6" fill={pal.gold} />
        <line x1="121" y1="335" x2="125" y2="342" stroke={pal.silver} strokeWidth="0.8" />
      </g>
    );
  }
  if (scene === 3) {
    // The Empress: star crown, Venus heart shield held to the dial, wheat
    return (
      <g className="cz-noct-hermit">
        <circle className="cz-noct-glow" cx="182" cy="300" r="20" fill="url(#cz-noct-lantern-glow)" />
        {/* wheat sheaves flanking her */}
        {[116, 123, 170, 177].map((x) => (
          <g key={x} stroke={pal.gold} strokeWidth="0.7" fill="none">
            <line x1={x} y1="368" x2={x} y2="351" />
            <path d={`M ${x} 351 l -2.5 -3 M ${x} 351 l 2.5 -3 M ${x} 355 l -2.5 -3 M ${x} 355 l 2.5 -3`} />
          </g>
        ))}
        {/* crown of stars */}
        <path d="M 143 313 L 145 308 L 147.5 312 L 150 307 L 152.5 312 L 155 308 L 157 313 Z" fill="none" stroke={pal.gold} strokeWidth="0.9" />
        <circle cx="145" cy="307" r="0.8" fill={pal.gold} />
        <circle cx="150" cy="305.5" r="0.8" fill={pal.gold} />
        <circle cx="155" cy="307" r="0.8" fill={pal.gold} />
        <circle cx="150" cy="321" r="5" fill="#0d1526" stroke={pal.silver} strokeWidth="1.2" />
        <path d="M 138 332 Q 131 352 134 368 L 166 368 Q 169 352 162 332" fill="#0d1526" stroke={pal.silver} strokeWidth="1.3" />
        <path d="M 161 336 Q 172 324 179 310" fill="none" stroke={pal.silver} strokeWidth="1.3" strokeLinecap="round" />
        {/* Venus heart shield, sign engraved in strokes */}
        <path
          d="M 182 296 C 180 292 174 292 174 297 C 174 301 179 305 182 307 C 185 305 190 301 190 297 C 190 292 184 292 182 296 Z"
          fill={pal.gold}
          stroke={pal.deep}
          strokeWidth="0.8"
        />
        <circle cx="182" cy="298.6" r="1.9" fill="none" stroke={pal.deep} strokeWidth="0.7" />
        <line x1="182" y1="300.5" x2="182" y2="304" stroke={pal.deep} strokeWidth="0.7" />
        <line x1="180.4" y1="302.6" x2="183.6" y2="302.6" stroke={pal.deep} strokeWidth="0.7" />
      </g>
    );
  }
  if (scene === 7) {
    // The Chariot: star-canopied chariot, dark + light sphinxes, city wall
    return (
      <g className="cz-noct-hermit">
        <circle className="cz-noct-glow" cx="150" cy="348" r="22" fill="url(#cz-noct-lantern-glow)" />
        {/* city wall behind */}
        <path
          d="M 104 326 L 104 318 L 110 318 L 110 314 L 116 314 L 116 318 L 126 318 L 126 314 L 132 314 L 132 318 L 150 318 L 150 314 L 156 314 L 156 318 L 168 318 L 168 314 L 174 314 L 174 318 L 184 318 L 184 314 L 190 314 L 190 318 L 196 318 L 196 326"
          fill="none"
          stroke={pal.faint}
          strokeWidth="0.8"
        />
        {/* canopy with stars */}
        <path d="M 130 330 Q 150 318 170 330" fill="none" stroke={pal.silver} strokeWidth="1.1" />
        <line x1="132" y1="329" x2="132" y2="342" stroke={pal.silver} strokeWidth="0.8" />
        <line x1="168" y1="329" x2="168" y2="342" stroke={pal.silver} strokeWidth="0.8" />
        <circle cx="140" cy="325" r="0.8" fill={pal.gold} />
        <circle cx="150" cy="322.5" r="0.8" fill={pal.gold} />
        <circle cx="160" cy="325" r="0.8" fill={pal.gold} />
        {/* chariot box with star emblem */}
        <path d="M 134 342 L 166 342 L 163 360 L 137 360 Z" fill="#0d1526" stroke={pal.silver} strokeWidth="1.2" />
        <path d={starPath(150, 350, 4, 4.5, 1.8)} fill={pal.gold} />
        <circle cx="150" cy="364" r="4.5" fill="none" stroke={pal.silver} strokeWidth="0.9" />
        <line x1="146" y1="364" x2="154" y2="364" stroke={pal.silver} strokeWidth="0.5" />
        <line x1="150" y1="360" x2="150" y2="368" stroke={pal.silver} strokeWidth="0.5" />
        {/* dark sphinx, left */}
        <path d="M 94 362 L 94 354 Q 94 348 102 348 L 112 348 L 112 362 Z" fill="#04060d" stroke={pal.dim} strokeWidth="0.7" />
        <circle cx="114" cy="344" r="3.4" fill="#04060d" stroke={pal.dim} strokeWidth="0.7" />
        <line x1="94" y1="362" x2="122" y2="362" stroke={pal.dim} strokeWidth="0.7" />
        {/* light sphinx, right */}
        <path d="M 206 362 L 206 354 Q 206 348 198 348 L 188 348 L 188 362 Z" fill="none" stroke={pal.silver} strokeWidth="0.9" />
        <circle cx="186" cy="344" r="3.4" fill="none" stroke={pal.silver} strokeWidth="0.9" />
        <line x1="178" y1="362" x2="206" y2="362" stroke={pal.silver} strokeWidth="0.9" />
      </g>
    );
  }
  if (scene === 10) {
    // Wheel of Fortune: sphinx enthroned above the wheel, snake descending
    return (
      <g className="cz-noct-hermit">
        <circle className="cz-noct-glow" cx="150" cy="190" r="34" fill="url(#cz-noct-lantern-glow)" />
        <path d="M 142 66 L 142 60 Q 142 54 150 54 Q 158 54 158 60 L 158 66 Z" fill="#0d1526" stroke={pal.silver} strokeWidth="0.9" />
        <circle cx="150" cy="50" r="3.6" fill="#0d1526" stroke={pal.silver} strokeWidth="0.9" />
        <line x1="160" y1="48" x2="164" y2="66" stroke={pal.gold} strokeWidth="0.8" />
        <line x1="138" y1="66" x2="162" y2="66" stroke={pal.silver} strokeWidth="0.8" />
        <path d="M 66 108 Q 56 130 64 150 Q 72 170 60 190 Q 50 208 58 228" fill="none" stroke={pal.deep} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 58 228 L 54 236 L 62 234 Z" fill={pal.deep} />
      </g>
    );
  }
  if (scene === 13) {
    // Death: skeleton rider with rose banner, sun between two towers
    return (
      <g className="cz-noct-hermit">
        <circle className="cz-noct-glow" cx="150" cy="190" r="30" fill="url(#cz-noct-lantern-glow)" />
        {/* two towers */}
        <path d="M 88 368 L 88 336 L 92 336 L 92 331 L 96 331 L 96 336 L 101 336 L 101 331 L 105 331 L 105 336 L 109 336 L 109 368" fill="none" stroke={pal.dim} strokeWidth="0.9" />
        <path d="M 191 368 L 191 336 L 195 336 L 195 331 L 199 331 L 199 336 L 204 336 L 204 331 L 208 331 L 208 336 L 212 336 L 212 368" fill="none" stroke={pal.dim} strokeWidth="0.9" />
        {/* horse */}
        <path d="M 118 352 Q 118 344 130 344 L 150 344 Q 158 344 160 350 L 166 340 L 172 342 L 168 352 Q 166 358 158 358 L 126 358 Q 118 358 118 352 Z" fill="#0d1526" stroke={pal.silver} strokeWidth="1" />
        <line x1="124" y1="358" x2="124" y2="368" stroke={pal.silver} strokeWidth="0.9" />
        <line x1="132" y1="358" x2="132" y2="368" stroke={pal.silver} strokeWidth="0.9" />
        <line x1="148" y1="358" x2="148" y2="368" stroke={pal.silver} strokeWidth="0.9" />
        <line x1="156" y1="358" x2="156" y2="368" stroke={pal.silver} strokeWidth="0.9" />
        {/* skeleton rider */}
        <circle cx="140" cy="330" r="4" fill="#0d1526" stroke={pal.silver} strokeWidth="0.9" />
        <circle cx="141.5" cy="329.5" r="0.7" fill={pal.silver} />
        <line x1="140" y1="334" x2="140" y2="346" stroke={pal.silver} strokeWidth="0.8" />
        <path d="M 136 338 Q 140 340 144 338 M 136 342 Q 140 344 144 342" fill="none" stroke={pal.silver} strokeWidth="0.6" />
        <path d="M 142 338 Q 152 330 160 318" fill="none" stroke={pal.silver} strokeWidth="1" strokeLinecap="round" />
        {/* black banner with the mystic rose */}
        <line x1="160" y1="318" x2="166" y2="290" stroke={pal.silver} strokeWidth="0.9" />
        <path d="M 166 290 L 186 293 L 184 305 L 166 302 Z" fill="#04060d" stroke={pal.dim} strokeWidth="0.7" />
        <circle cx="175.5" cy="297" r="2.8" fill="none" stroke={pal.silver} strokeWidth="0.6" />
        <circle cx="175.5" cy="297" r="0.7" fill={pal.silver} />
      </g>
    );
  }
  if (scene === 17) {
    // The Star: kneeling figure pouring two jugs, to land and to the pool
    return (
      <g className="cz-noct-hermit">
        <circle className="cz-noct-glow" cx="150" cy="190" r="34" fill="url(#cz-noct-lantern-glow)" />
        <circle cx="136" cy="322" r="4.5" fill="#0d1526" stroke={pal.silver} strokeWidth="1.1" />
        <path d="M 136 327 Q 130 340 128 350" fill="none" stroke={pal.silver} strokeWidth="1.2" />
        <path d="M 128 350 Q 126 358 122 364 L 132 364" fill="none" stroke={pal.silver} strokeWidth="1.1" />
        <path d="M 128 350 Q 140 352 148 360 L 154 360" fill="none" stroke={pal.silver} strokeWidth="1.1" />
        {/* left jug, poured onto the land */}
        <path d="M 132 334 Q 122 338 114 344" fill="none" stroke={pal.silver} strokeWidth="1" strokeLinecap="round" />
        <path d="M 108 342 Q 106 348 110 350 L 114 348 Q 115 344 112 341 Z" fill="#0d1526" stroke={pal.silver} strokeWidth="0.8" />
        <path d="M 108 348 Q 104 354 104 362" fill="none" stroke={pal.dim} strokeWidth="0.7" />
        {/* right jug, poured into the pool */}
        <path d="M 134 336 Q 148 338 158 342" fill="none" stroke={pal.silver} strokeWidth="1" strokeLinecap="round" />
        <path d="M 160 340 Q 158 346 162 348 L 166 346 Q 167 342 164 339 Z" fill="#0d1526" stroke={pal.silver} strokeWidth="0.8" />
        <path d="M 166 346 Q 172 352 178 358" fill="none" stroke={pal.dim} strokeWidth="0.7" />
        <ellipse cx="188" cy="362" rx="12" ry="3" fill="none" stroke={pal.dim} strokeWidth="0.7" />
        <ellipse cx="188" cy="362" rx="7" ry="1.8" fill="none" stroke={pal.dim} strokeWidth="0.5" />
      </g>
    );
  }
  if (scene === 22) {
    // The Fool: stepping off the cliff edge, dog at his heels, staff + bundle
    return (
      <g className="cz-noct-hermit">
        <circle className="cz-noct-glow" cx="150" cy="190" r="28" fill="url(#cz-noct-lantern-glow)" />
        {/* cliff edge */}
        <path d="M 84 368 L 84 362 L 168 362 L 172 368" fill="none" stroke={pal.silver} strokeWidth="0.9" />
        <path d="M 100 362 L 96 368 M 118 362 L 114 368" stroke={pal.faint} strokeWidth="0.6" />
        {/* the dog */}
        <path d="M 128 362 L 128 356 Q 128 351 134 351 L 140 351 Q 145 351 145 356 L 145 362" fill="none" stroke={pal.silver} strokeWidth="0.8" />
        <circle cx="146" cy="349" r="2.2" fill="none" stroke={pal.silver} strokeWidth="0.8" />
        <path d="M 128 353 Q 124 350 123 346" fill="none" stroke={pal.silver} strokeWidth="0.7" />
        {/* the Fool at the edge */}
        <circle cx="158" cy="318" r="4.5" fill="#0d1526" stroke={pal.silver} strokeWidth="1.1" />
        <path d="M 156 314 Q 152 308 148 306" fill="none" stroke={pal.gold} strokeWidth="0.8" />
        <path d="M 152 336 L 164 336 L 162 348 L 154 348 Z" fill="#0d1526" stroke={pal.silver} strokeWidth="0.9" />
        <line x1="158" y1="323" x2="156" y2="336" stroke={pal.silver} strokeWidth="1.2" />
        <line x1="156" y1="348" x2="154" y2="362" stroke={pal.silver} strokeWidth="1" />
        <path d="M 160 348 Q 166 352 170 356" fill="none" stroke={pal.silver} strokeWidth="1" />
        <path d="M 158 328 Q 150 326 144 322" fill="none" stroke={pal.silver} strokeWidth="1" strokeLinecap="round" />
        <line x1="140" y1="318" x2="166" y2="338" stroke={pal.silver} strokeWidth="0.9" />
        <circle cx="140" cy="317" r="2.6" fill="none" stroke={pal.gold} strokeWidth="0.8" />
      </g>
    );
  }
  // The Hermit (default): lantern held up to consult the dial
  return (
    <g className="cz-noct-hermit">
      {/* lantern glow cast up onto the dial */}
      <circle className="cz-noct-glow" cx="182" cy="302" r="26" fill="url(#cz-noct-lantern-glow)" />

      {/* staff in the left hand */}
      <line x1="127" y1="314" x2="134" y2="366" stroke={pal.silver} strokeWidth="1.4" strokeLinecap="round" />

      {/* hooded robe */}
      <path
        d="M 138 332 Q 133 350 135 368 L 165 368 Q 167 350 162 332"
        fill="#0d1526"
        stroke={pal.silver}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      {/* hood */}
      <path
        d="M 138 334 Q 137 314 150 311 Q 163 314 162 334"
        fill="#0d1526"
        stroke={pal.silver}
        strokeWidth="1.3"
      />
      {/* shadowed face opening */}
      <ellipse cx="150" cy="324" rx="4.6" ry="5.6" fill="#04060d" stroke={pal.faint} strokeWidth="0.4" />

      {/* robe fold engraving */}
      <path d="M 141 340 Q 139 354 140 364" fill="none" stroke={pal.dim} strokeWidth="0.7" opacity="0.8" />
      <path d="M 159 340 Q 161 354 160 364" fill="none" stroke={pal.dim} strokeWidth="0.7" opacity="0.8" />

      {/* raised right arm, lifting the lantern to the dial */}
      <path d="M 160 338 Q 170 326 177 312" fill="none" stroke={pal.silver} strokeWidth="1.3" strokeLinecap="round" />

      {/* pale-gold lantern held up to the dial */}
      <line x1="182" y1="292" x2="182" y2="296" stroke={pal.silver} strokeWidth="0.8" />
      <path
        d="M 176 296 L 188 296 L 186 308 L 178 308 Z"
        fill={pal.gold}
        stroke={pal.deep}
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      <path d="M 178 296 L 180 292 L 184 292 L 186 296" fill="none" stroke={pal.silver} strokeWidth="0.8" />
      <path d="M 182 299 L 183.4 302 L 182 305 L 180.6 302 Z" fill="#fff6d8" />
    </g>
  );
}

interface NocturlabeProps {
  number?: number;
  name?: string;
  variant?: number;
}

export default function NocturlabeHermitCard({
  number = 9,
  name = "THE HERMIT",
  variant = 0,
}: NocturlabeProps) {
  const scene = SCENE_NUMBERS.includes(number) ? number : 9;
  const pal = PALETTES[((Math.floor(variant) % 8) + 8) % 8];
  const title = (name || "THE HERMIT").toUpperCase();
  const tLen = title.length;
  const tSize = tLen > 14 ? 11 : tLen > 10 ? 13 : 16;
  const tSpacing = tLen > 14 ? 2 : tLen > 10 ? 3 : 5;
  const titleName = title.toLowerCase().replace(/(^|\s)\w/g, (c) => c.toUpperCase());

  return (
    <figure
      className="cz-noct-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
    >
      <style>{`
        .cz-noct-card { position: relative; overflow: hidden; background: ${BG_DEEP}; }
        .cz-noct-card svg { display: block; width: 100%; height: 100%; }

        .cz-noct-frame {
          animation: cz-noct-fade 0.9s ease-out backwards;
        }
        .cz-noct-dial-load {
          transform-box: view-box;
          transform-origin: ${CX}px ${CY}px;
          animation: cz-noct-cal 1.5s cubic-bezier(.25,.85,.3,1) backwards;
        }
        .cz-noct-drift {
          transform-box: view-box;
          transform-origin: ${CX}px ${CY}px;
          animation: cz-noct-drift 150s linear infinite;
        }
        .cz-noct-arm {
          transform-box: view-box;
          transform-origin: ${CX}px ${CY}px;
          transform: rotate(-15deg);
          animation: cz-noct-arm-in 1.2s cubic-bezier(.3,.9,.3,1) .45s backwards;
        }
        .cz-noct-hermit {
          animation: cz-noct-fade 1s ease-out .9s backwards;
        }
        .cz-noct-polaris {
          transform-box: fill-box;
          transform-origin: center;
          animation: cz-noct-twinkle 6s ease-in-out infinite;
        }
        .cz-noct-glow {
          animation: cz-noct-glow-pulse 7s ease-in-out infinite;
        }

        @keyframes cz-noct-cal {
          from { opacity: 0.35; transform: rotate(-30deg); }
          to   { opacity: 1;    transform: rotate(0deg); }
        }
        @keyframes cz-noct-arm-in {
          from { opacity: 0; transform: rotate(-70deg); }
          to   { opacity: 1; transform: rotate(-15deg); }
        }
        @keyframes cz-noct-drift {
          to { transform: rotate(360deg); }
        }
        @keyframes cz-noct-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cz-noct-twinkle {
          0%, 100% { opacity: 1;    transform: scale(1); }
          50%      { opacity: 0.55; transform: scale(0.82); }
        }
        @keyframes cz-noct-glow-pulse {
          0%, 100% { opacity: 0.45; }
          50%      { opacity: 0.8; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cz-noct-frame,
          .cz-noct-dial-load,
          .cz-noct-drift,
          .cz-noct-arm,
          .cz-noct-hermit,
          .cz-noct-polaris,
          .cz-noct-glow {
            animation: none;
          }
        }
      `}</style>

      <svg
        viewBox="0 0 300 450"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={`${titleName}, tarot card ${NUM_WORDS[scene]}, engraved as a nocturnal star-clock instrument`}
      >
        <defs>
          <radialGradient id="cz-noct-bg" cx="50%" cy="40%" r="80%">
            <stop offset="0%" stopColor="#101a30" />
            <stop offset="60%" stopColor="#0b1224" />
            <stop offset="100%" stopColor={BG_DEEP} />
          </radialGradient>
          <radialGradient id="cz-noct-face" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#0e1830" />
            <stop offset="80%" stopColor="#0a1122" />
            <stop offset="100%" stopColor="#080d1b" />
          </radialGradient>
          <radialGradient id="cz-noct-lantern-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f4e3ae" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#e3c87e" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#e3c87e" stopOpacity="0" />
          </radialGradient>
          {/* engraved four-point corner star */}
          <g id="cz-noct-corner-star">
            <path d="M 0 -6 L 1.4 -1.4 L 6 0 L 1.4 1.4 L 0 6 L -1.4 1.4 L -6 0 L -1.4 -1.4 Z" fill={pal.gold} />
            <circle cx="0" cy="0" r="0.9" fill="#f4e3ae" />
          </g>
        </defs>

        {/* night lacquer ground */}
        <rect x="0" y="0" width="300" height="450" fill="url(#cz-noct-bg)" />

        {/* faint static stars in the margins */}
        <g fill={pal.faint}>
          <circle cx="38" cy="96" r="1" />
          <circle cx="262" cy="72" r="1.2" />
          <circle cx="272" cy="268" r="0.9" />
          <circle cx="30" cy="240" r="1.1" />
          <circle cx="52" cy="392" r="0.9" />
          <circle cx="250" cy="388" r="1" />
          <circle cx="44" cy="180" r="0.8" />
          <circle cx="258" cy="160" r="0.8" />
        </g>

        {/* engraved frame: double silver rules + corner stars */}
        <g className="cz-noct-frame">
          <rect x="10" y="10" width="280" height="430" fill="none" stroke={pal.silver} strokeWidth="1.2" opacity="0.8" />
          <rect x="15" y="15" width="270" height="420" fill="none" stroke={pal.dim} strokeWidth="0.5" opacity="0.6" />
          <use href="#cz-noct-corner-star" x="26" y="26" />
          <use href="#cz-noct-corner-star" x="274" y="26" />
          <use href="#cz-noct-corner-star" x="26" y="424" />
          <use href="#cz-noct-corner-star" x="274" y="424" />
        </g>

        {/* ==================== the instrument ==================== */}
        {/* dial face */}
        <circle cx={CX} cy={CY} r={R_OUT} fill="url(#cz-noct-face)" stroke={pal.silver} strokeWidth="1.6" />
        <circle cx={CX} cy={CY} r={R_OUT - 4} fill="none" stroke={pal.faint} strokeWidth="0.5" opacity="0.7" />

        {/* hour-scale teeth around the rim */}
        {HOUR_TEETH.map((a) => {
          const major = a % 90 === 0;
          return (
            <g key={a} transform={`rotate(${a} ${CX} ${CY})`}>
              <line
                x1={CX}
                y1={CY - R_OUT}
                x2={CX}
                y2={CY - R_OUT - (major ? 7 : 4)}
                stroke={major ? pal.gold : pal.dim}
                strokeWidth={major ? 1.5 : 0.7}
              />
            </g>
          );
        })}

        {/* outer date ring */}
        <circle cx={CX} cy={CY} r="100" fill="none" stroke={pal.dim} strokeWidth="0.8" />
        {MONTH_DIVIDERS.map((a) => (
          <g key={a} transform={`rotate(${a} ${CX} ${CY})`}>
            <line x1={CX} y1={CY - 100} x2={CX} y2={CY - 116} stroke={pal.faint} strokeWidth="0.6" />
          </g>
        ))}
        {MONTHS.map((m, i) => (
          <g key={m} transform={`rotate(${i * 30} ${CX} ${CY})`}>
            <text
              x={CX}
              y={CY - 105}
              textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontSize="7"
              letterSpacing="1.2"
              fill={pal.silver}
            >
              {m}
            </text>
          </g>
        ))}

        {/* inner rotating star dial: load calibration wrapper + 150s ambient drift */}
        <g className="cz-noct-dial-load">
          <g className="cz-noct-drift">
            <circle cx={CX} cy={CY} r="96" fill="none" stroke={pal.dim} strokeWidth="0.9" />
            <circle cx={CX} cy={CY} r="88" fill="none" stroke={pal.faint} strokeWidth="0.4" opacity="0.6" />

            {/* faint field stars */}
            <g fill={pal.faint}>
              {FIELD_STARS.map(([dx, dy, r], i) => (
                <circle key={i} cx={CX + dx} cy={CY + dy} r={r} />
              ))}
            </g>

            {/* Ursa Major stick figure */}
            <g stroke={pal.silver} strokeWidth="0.7" opacity="0.9">
              {URSA_LINES.map(([a, b]) => (
                <line
                  key={`${a}-${b}`}
                  x1={CX + URSA[a][0]}
                  y1={CY + URSA[a][1]}
                  x2={CX + URSA[b][0]}
                  y2={CY + URSA[b][1]}
                />
              ))}
            </g>
            <g fill={pal.silver}>
              {URSA.map(([dx, dy], i) => (
                <circle key={i} cx={CX + dx} cy={CY + dy} r={i === 0 || i === 6 ? 1.9 : 1.5} />
              ))}
            </g>

            {/* Cassiopeia's W */}
            <polyline
              points={CASSIOPEIA.map(([dx, dy]) => `${CX + dx},${CY + dy}`).join(" ")}
              fill="none"
              stroke={pal.silver}
              strokeWidth="0.7"
              opacity="0.9"
            />
            <g fill={pal.silver}>
              {CASSIOPEIA.map(([dx, dy], i) => (
                <circle key={i} cx={CX + dx} cy={CY + dy} r="1.5" />
              ))}
            </g>

            {/* arcana-specific engraving on the rotating dial */}
            <DialExtras scene={scene} pal={pal} />

            {/* engraved reticle cross around the pole */}
            <g stroke={pal.faint} strokeWidth="0.5" opacity="0.8">
              <line x1={CX - 26} y1={CY} x2={CX - 10} y2={CY} />
              <line x1={CX + 10} y1={CY} x2={CX + 26} y2={CY} />
              <line x1={CX} y1={CY - 26} x2={CX} y2={CY - 10} />
              <line x1={CX} y1={CY + 10} x2={CX} y2={CY + 26} />
            </g>

            {/* the focal star at the pole, twinkling gently */}
            <FocalStar scene={scene} pal={pal} />
          </g>
        </g>

        {/* sighting hole at the very center */}
        <circle cx={CX} cy={CY} r="3.2" fill={BG_DEEP} stroke={pal.silver} strokeWidth="0.8" />

        {/* regula: the long pointer arm, swings to its mark on load */}
        <g className="cz-noct-arm">
          <path
            d={`M ${CX - 2.6} ${CY - 26} L ${CX} ${CY - 124} L ${CX + 2.6} ${CY - 26} L ${CX + 1.6} ${CY - 4} L ${CX - 1.6} ${CY - 4} Z`}
            fill={pal.silver}
            fillOpacity="0.28"
            stroke={pal.silver}
            strokeWidth="0.9"
            strokeLinejoin="round"
          />
          <line x1={CX} y1={CY - 116} x2={CX} y2={CY - 10} stroke={pal.silver} strokeWidth="0.5" opacity="0.8" />
          {/* counterweight tail */}
          <path
            d={`M ${CX - 3} ${CY + 6} L ${CX} ${CY + 26} L ${CX + 3} ${CY + 6} Z`}
            fill={pal.silver}
            fillOpacity="0.28"
            stroke={pal.silver}
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
          <circle cx={CX} cy={CY} r="5" fill="none" stroke={pal.silver} strokeWidth="0.9" />
        </g>

        {/* arcana number engraved small on the dial face */}
        <text
          x={CX}
          y={CY + 74}
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="11"
          letterSpacing="3"
          fill={pal.gold}
          opacity="0.9"
        >
          {toRoman(scene)}
        </text>

        {/* ==================== the arcana at the base ==================== */}
        <SceneFigure scene={scene} pal={pal} />

        {/* ==================== title plate ==================== */}
        <g>
          <line x1="46" y1="398" x2="108" y2="398" stroke={pal.deep} strokeWidth="0.8" />
          <line x1="192" y1="398" x2="254" y2="398" stroke={pal.deep} strokeWidth="0.8" />
          <path d="M 40 398 L 44 395 L 48 398 L 44 401 Z" fill={pal.gold} />
          <path d="M 252 398 L 256 395 L 260 398 L 256 401 Z" fill={pal.gold} />
          <text
            x="150"
            y="414"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="700"
            fontSize={tSize}
            letterSpacing={tSpacing}
            fill={pal.silver}
          >
            {title}
          </text>
          <text
            x="150"
            y="430"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fontSize="8.5"
            letterSpacing="2.5"
            fill={pal.dim}
          >
            · horologium noctis ·
          </text>
        </g>
      </svg>
    </figure>
  );
}
