/**
 * Card Lab — STAINED GLASS style
 * Gothic cathedral stained-glass window: a lancet (pointed-arch) panel of
 * jewel-toned segments separated by thick black lead cames. All artwork is
 * bespoke inline SVG; radial gradients give each segment a slight inner glow.
 *
 * Reusable via optional props: { number, name, variant }.
 * `number` selects a fully different leaded-glass scene (1, 3, 7, 9, 10, 13,
 * 17, 22; anything else falls back to the Hermit scene with the right
 * numeral/name). variant 0-7: four glass palettes (0 = original Hermit
 * scheme), variants 4-7 replay them mirrored. The light source of every
 * scene (Hermit's lantern, Magician's wand tip, Empress's crown star,
 * Chariot's canopy star, Wheel's hub, Death's banner rose, the big Star,
 * Fool's sun) stays amber and carries the glow/pulse/hover-flare effects.
 */

import { toRoman } from "@/lib/roman";

const LEAD = "#0b0912";
const SKIN = "#e0b87a";

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

type SP = { p: Palette };

/* Shared leaded background: purple/indigo shard field behind every scene. */
const ShardBg = ({ p }: SP) => (
  <>
    <rect x="0" y="0" width="200" height="300" fill={p.base} />
    <g className="cl-sg-br1" stroke={LEAD} strokeWidth="3.5" strokeLinejoin="round">
      <polygon points="22,132 22,58 74,38 100,92 58,140" fill={p.shards[0]} />
      <polygon points="178,132 178,58 126,38 100,92 142,140" fill={p.shards[1]} />
      <polygon points="22,132 58,140 54,214 22,222" fill={p.shards[2]} />
      <polygon points="178,132 142,140 148,214 178,222" fill={p.shards[3]} />
      <polygon points="58,140 100,92 142,140 118,176 84,176" fill={p.shards[4]} />
    </g>
  </>
);

/* Shared foreground ground shards. */
const Ground = ({ p }: SP) => (
  <g className="cl-sg-br4" stroke={LEAD} strokeWidth="3.5" strokeLinejoin="round">
    <polygon points="22,246 64,232 100,246 66,254 22,254" fill={p.ground1} />
    <polygon points="100,246 140,230 178,246 178,254 66,254" fill={p.ground2} />
  </g>
);

/* IX — The Hermit: hooded figure, lantern, staff, peaks (canonical scene). */
const HermitScene = ({ p }: SP) => (
  <>
    <ShardBg p={p} />
    <g className="cl-sg-br2" stroke={LEAD} strokeWidth="3.5" strokeLinejoin="round">
      <polygon points="22,238 70,150 104,182 96,238" fill={p.peak1} />
      <polygon points="96,238 104,182 132,144 178,238" fill={p.peak2} />
    </g>
    {/* lantern light rays + glow */}
    <g className="cl-sg-rays" stroke={LEAD} strokeWidth="3" strokeLinejoin="round">
      <polygon points="148,92 172,78 154,100" fill="#f2b43a" />
      <polygon points="150,104 176,110 148,114" fill="#e8a02a" />
      <polygon points="144,114 156,138 136,118" fill="#f2b43a" />
      <polygon points="126,92 112,74 132,88" fill="#e8a02a" />
    </g>
    <circle className="cl-sg-glow" cx="138" cy="102" r="34" fill="url(#cl-sg-glowgrad)" />
    {/* staff (leaded: dark underlay + wood core) */}
    <line x1="60" y1="130" x2="60" y2="246" stroke={LEAD} strokeWidth="8" strokeLinecap="round" />
    <line x1="60" y1="130" x2="60" y2="246" stroke="#8a5a2a" strokeWidth="4" strokeLinecap="round" />
    <circle cx="60" cy="126" r="5.5" fill="#c98a2e" stroke={LEAD} strokeWidth="3" />
    {/* hooded figure, robe in three leaded segments */}
    <g className="cl-sg-br3" stroke={LEAD} strokeWidth="3.5" strokeLinejoin="round">
      <polygon points="102,152 126,116 136,124 114,160" fill={p.arm} />
      <polygon points="80,146 92,146 86,240 66,236" fill={p.robe1} />
      <polygon points="92,146 102,146 102,244 86,240" fill="url(#cl-sg-robe)" />
      <polygon points="102,146 106,146 118,236 102,244" fill={p.robe3} />
      <path d="M 78 130 Q 92 106 106 130 L 103 148 L 81 148 Z" fill="url(#cl-sg-hood)" />
    </g>
    <ellipse cx="92" cy="136" rx="7.5" ry="6.5" fill="#100c1e" />
    <circle cx="66" cy="168" r="5" fill="#c98a2e" stroke={LEAD} strokeWidth="3" />
    {/* the lantern: brightest amber segment + star of light */}
    <g className="cl-sg-lantern" stroke={LEAD} strokeWidth="3.5" strokeLinejoin="round">
      <polygon points="132,84 144,84 140,78 136,78" fill="#3a2c14" />
      <polygon points="138,86 150,94 150,108 138,116 126,108 126,94" fill="url(#cl-sg-amber)" />
    </g>
    <path
      d="M 138 94 L 140.5 99.5 L 146 101 L 140.5 102.5 L 138 108 L 135.5 102.5 L 130 101 L 135.5 99.5 Z"
      fill="#fff8dd"
    />
    <Ground p={p} />
  </>
);

/* I — The Magician: raised wand (light source), lemniscate, table of tools. */
const MagicianScene = ({ p }: SP) => (
  <>
    <ShardBg p={p} />
    {/* lemniscate above the head */}
    <path d="M 100 97 C 94 89 82 89 82 97 C 82 105 94 105 100 97 C 106 105 118 105 118 97 C 118 89 106 89 100 97 Z" fill="none" stroke={LEAD} strokeWidth="6.5" />
    <path d="M 100 97 C 94 89 82 89 82 97 C 82 105 94 105 100 97 C 106 105 118 105 118 97 C 118 89 106 89 100 97 Z" fill="none" stroke="#e8b83c" strokeWidth="3" />
    {/* wand with flaring tip */}
    <circle className="cl-sg-glow" cx="148" cy="76" r="20" fill="url(#cl-sg-glowgrad)" />
    <g className="cl-sg-rays" stroke={LEAD} strokeWidth="2.5" strokeLinejoin="round">
      <polygon points="155,68 167,60 159,75" fill="#f2b43a" />
      <polygon points="157,81 169,86 155,89" fill="#e8a02a" />
    </g>
    <line x1="132" y1="102" x2="146" y2="80" stroke={LEAD} strokeWidth="7" strokeLinecap="round" />
    <line x1="132" y1="102" x2="146" y2="80" stroke="#8a5a2a" strokeWidth="3.5" strokeLinecap="round" />
    <g className="cl-sg-lantern" stroke={LEAD} strokeWidth="2.5" strokeLinejoin="round">
      <path d="M 146 67 L 148.7 74 L 156 76 L 148.7 78 L 146 85 L 143.3 78 L 136 76 L 143.3 74 Z" fill="url(#cl-sg-amber)" />
    </g>
    {/* figure */}
    <g className="cl-sg-br3" stroke={LEAD} strokeWidth="3.5" strokeLinejoin="round">
      <polygon points="108,132 130,104 138,110 116,140" fill={p.arm} />
      <polygon points="92,132 70,168 78,174 98,142" fill={p.arm} />
      <polygon points="88,130 96,128 100,133 104,128 112,130 118,206 82,206" fill="url(#cl-sg-robe)" />
      <circle cx="100" cy="120" r="9" fill={SKIN} />
    </g>
    {/* table with the four suit tools */}
    <g className="cl-sg-br4" stroke={LEAD} strokeWidth="3" strokeLinejoin="round">
      <polygon points="36,206 164,206 156,228 44,228" fill="#6b4a26" />
      <line x1="52" y1="228" x2="52" y2="250" stroke={LEAD} strokeWidth="5" />
      <line x1="148" y1="228" x2="148" y2="250" stroke={LEAD} strokeWidth="5" />
      {/* cup */}
      <path d="M 56 210 L 68 210 L 65 218 L 65 222 L 59 222 L 59 218 Z" fill="#e8b83c" strokeWidth="2" />
      {/* sword */}
      <polygon points="91,208 94,220 88,220" fill="#d8d4ca" strokeWidth="2" />
      <line x1="86" y1="220" x2="96" y2="220" stroke="#e8b83c" strokeWidth="2.5" />
      {/* pentacle */}
      <circle cx="116" cy="215" r="5" fill="none" stroke="#e8b83c" strokeWidth="2" />
      <circle cx="116" cy="215" r="1.6" fill="#e8b83c" stroke="none" />
      {/* wand */}
      <line x1="138" y1="221" x2="150" y2="210" stroke="#e8b83c" strokeWidth="2.5" />
    </g>
  </>
);

/* III — The Empress: star crown (light source), Venus heart shield, wheat. */
const EmpressScene = ({ p }: SP) => (
  <>
    <ShardBg p={p} />
    <circle className="cl-sg-glow" cx="100" cy="86" r="18" fill="url(#cl-sg-glowgrad)" />
    <g className="cl-sg-lantern" stroke={LEAD} strokeWidth="2.5" strokeLinejoin="round">
      <path d="M 100 78 L 102.2 83.8 L 108 86 L 102.2 88.2 L 100 94 L 97.8 88.2 L 92 86 L 97.8 83.8 Z" fill="url(#cl-sg-amber)" />
    </g>
    {/* crowned seated figure */}
    <g className="cl-sg-br3" stroke={LEAD} strokeWidth="3.5" strokeLinejoin="round">
      <polygon points="86,108 88,96 94,104 100,94 106,104 112,96 114,108" fill="#e8b83c" />
      <circle cx="100" cy="118" r="9" fill={SKIN} />
      <polygon points="86,128 114,128 130,238 70,238" fill="url(#cl-sg-robe)" />
      <polygon points="112,134 134,154 128,162 106,142" fill={p.arm} />
    </g>
    {/* heart shield with Venus symbol */}
    <g className="cl-sg-br2" stroke={LEAD} strokeWidth="3" strokeLinejoin="round">
      <path d="M 142 156 C 134 146 120 152 124 164 C 127 173 142 182 142 182 C 142 182 157 173 160 164 C 164 152 150 146 142 156 Z" fill="url(#cl-sg-rosea)" />
    </g>
    <circle cx="142" cy="162" r="4.5" fill="none" stroke="#f0e2b0" strokeWidth="2" />
    <line x1="142" y1="166.5" x2="142" y2="175" stroke="#f0e2b0" strokeWidth="2" />
    <line x1="138" y1="171" x2="146" y2="171" stroke="#f0e2b0" strokeWidth="2" />
    {/* wheat */}
    <Ground p={p} />
    <g className="cl-sg-br4" stroke={LEAD} strokeWidth="2" strokeLinecap="round">
      {[64, 100, 136].map((x) => (
        <g key={x}>
          <line x1={x} y1="254" x2={x - 4} y2="232" stroke="#c98a2e" strokeWidth="2.5" />
          <circle cx={x - 6} cy="234" r="2.4" fill="#e8b83c" />
          <circle cx={x - 1} cy="239" r="2.4" fill="#e8b83c" />
          <circle cx={x - 7} cy="243" r="2.4" fill="#e8b83c" />
        </g>
      ))}
    </g>
  </>
);

/* VII — The Chariot: starred canopy (light source), box chariot, sphinxes. */
const ChariotScene = ({ p }: SP) => (
  <>
    <ShardBg p={p} />
    {/* city wall */}
    <g className="cl-sg-br2" stroke={LEAD} strokeWidth="3" strokeLinejoin="round">
      <polygon points="22,180 22,152 32,152 32,144 42,144 42,152 54,152 54,144 64,144 64,152 74,152 74,180" fill={p.peak1} />
      <polygon points="126,180 126,152 136,152 136,144 146,144 146,152 158,152 158,144 168,144 168,152 178,152 178,180" fill={p.peak2} />
    </g>
    {/* starred canopy */}
    <circle className="cl-sg-glow" cx="100" cy="97" r="16" fill="url(#cl-sg-glowgrad)" />
    <g className="cl-sg-br2" stroke={LEAD} strokeWidth="3" strokeLinejoin="round">
      <polygon points="62,110 138,110 130,86 70,86" fill="#1a2a5e" />
      <circle cx="82" cy="98" r="2.5" fill="#e8b83c" stroke="none" />
      <circle cx="118" cy="98" r="2.5" fill="#e8b83c" stroke="none" />
      <line x1="66" y1="110" x2="66" y2="150" stroke={LEAD} strokeWidth="4" />
      <line x1="134" y1="110" x2="134" y2="150" stroke={LEAD} strokeWidth="4" />
    </g>
    <g className="cl-sg-lantern" stroke={LEAD} strokeWidth="2.5" strokeLinejoin="round">
      <path d="M 100 90 L 102 95.5 L 108 98 L 102 100.5 L 100 106 L 98 100.5 L 92 98 L 98 95.5 Z" fill="url(#cl-sg-amber)" />
    </g>
    {/* charioteer */}
    <g className="cl-sg-br3" stroke={LEAD} strokeWidth="3.5" strokeLinejoin="round">
      <polygon points="92,118 100,110 108,118" fill="#e8b83c" />
      <circle cx="100" cy="126" r="8" fill={SKIN} />
      <polygon points="86,136 114,136 118,164 82,164" fill="url(#cl-sg-robe)" />
      {/* chariot box + wheels */}
      <polygon points="68,164 132,164 132,208 68,208" fill={p.robe1} />
      <line x1="100" y1="164" x2="100" y2="208" stroke={LEAD} strokeWidth="3" />
      <circle cx="84" cy="215" r="10" fill={p.peak2} />
      <circle cx="116" cy="215" r="10" fill={p.peak2} />
      <circle cx="84" cy="215" r="2.5" fill="#e8b83c" stroke="none" />
      <circle cx="116" cy="215" r="2.5" fill="#e8b83c" stroke="none" />
    </g>
    <Ground p={p} />
    {/* two sphinxes, one dark one light */}
    <g className="cl-sg-br4" stroke={LEAD} strokeWidth="3" strokeLinejoin="round">
      <ellipse cx="52" cy="240" rx="17" ry="8" fill="#1c1633" />
      <circle cx="64" cy="229" r="6" fill="#1c1633" />
      <ellipse cx="148" cy="240" rx="17" ry="8" fill="#d8c8a8" />
      <circle cx="136" cy="229" r="6" fill="#d8c8a8" />
    </g>
  </>
);

/* X — Wheel of Fortune: spoked wheel (hub light), sphinx, snake, creature. */
const WheelScene = ({ p }: SP) => {
  const rim = ["100,122", "138.2,137.8", "154,176", "138.2,214.2", "100,230", "61.8,214.2", "46,176", "61.8,137.8"];
  return (
    <>
      <ShardBg p={p} />
      <Ground p={p} />
      {/* snake and side creature */}
      <path d="M 38 150 C 30 170 46 190 38 214" fill="none" stroke={LEAD} strokeWidth="7" strokeLinecap="round" />
      <path d="M 38 150 C 30 170 46 190 38 214" fill="none" stroke="#3a6a42" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="38" cy="146" r="4" fill="#3a6a42" stroke={LEAD} strokeWidth="2.5" />
      <g className="cl-sg-br2" stroke={LEAD} strokeWidth="3" strokeLinejoin="round">
        <ellipse cx="162" cy="184" rx="7" ry="13" fill="#8a4a2a" />
        <circle cx="162" cy="166" r="5.5" fill="#8a4a2a" />
      </g>
      {/* the wheel: 8 jewel wedges, lead spokes, amber hub */}
      <g className="cl-sg-br3" stroke={LEAD} strokeLinejoin="round">
        <circle cx="100" cy="176" r="54" fill={p.peak2} strokeWidth="5" />
        {rim.map((to, i) => (
          <path
            key={i}
            d={`M 100 176 L ${rim[i].replace(",", " ")} A 54 54 0 0 1 ${rim[(i + 1) % 8].replace(",", " ")} Z`}
            fill={i % 2 === 0 ? "url(#cl-sg-rosea)" : "url(#cl-sg-roseb)"}
            strokeWidth="2.5"
          />
        ))}
        <circle cx="100" cy="176" r="34" fill={p.base} strokeWidth="3.5" />
        {["100,148", "100,204", "72,176", "128,176"].map((pt) => {
          const [x, y] = pt.split(",").map(Number);
          return <polygon key={pt} points={`${x},${y - 4} ${x + 4},${y} ${x},${y + 4} ${x - 4},${y}`} fill="#f0e2b0" strokeWidth="2" />;
        })}
      </g>
      <circle className="cl-sg-glow" cx="100" cy="176" r="24" fill="url(#cl-sg-glowgrad)" />
      <g className="cl-sg-lantern" stroke={LEAD} strokeWidth="3.5">
        <circle cx="100" cy="176" r="12" fill="url(#cl-sg-amber)" />
      </g>
      <path d="M 100 170 L 101.8 174.2 L 106 176 L 101.8 177.8 L 100 182 L 98.2 177.8 L 94 176 L 98.2 174.2 Z" fill="#fff8dd" />
      {/* sphinx atop the wheel */}
      <g className="cl-sg-br2" stroke={LEAD} strokeWidth="3" strokeLinejoin="round">
        <ellipse cx="100" cy="110" rx="13" ry="5.5" fill="#d8c8a8" />
        <circle cx="109" cy="102" r="5" fill="#d8c8a8" />
      </g>
    </>
  );
};

/* XIII — Death: skeletal rider, white-rose banner (light), sun and towers. */
const DeathScene = ({ p }: SP) => (
  <>
    <ShardBg p={p} />
    {/* sun rising between two towers */}
    <circle className="cl-sg-glow" cx="100" cy="190" r="20" fill="url(#cl-sg-glowgrad)" />
    <g stroke={LEAD} strokeWidth="3">
      <circle cx="100" cy="190" r="10" fill="url(#cl-sg-amber)" />
    </g>
    <g className="cl-sg-br2" stroke={LEAD} strokeWidth="3" strokeLinejoin="round">
      <polygon points="50,232 50,196 58,196 58,190 66,190 66,196 74,196 74,232" fill={p.peak1} />
      <polygon points="126,232 126,196 134,196 134,190 142,190 142,196 150,196 150,232" fill={p.peak2} />
    </g>
    <Ground p={p} />
    {/* pale horse */}
    <g className="cl-sg-br3" stroke={LEAD} strokeWidth="3.5" strokeLinejoin="round">
      <polygon points="80,226 87,226 85,250 77,250" fill="#d8d4ca" />
      <polygon points="94,228 101,228 99,252 91,252" fill="#c8c4ba" />
      <polygon points="114,228 121,228 123,252 115,252" fill="#c8c4ba" />
      <polygon points="128,226 135,226 139,250 131,250" fill="#d8d4ca" />
      <ellipse cx="104" cy="219" rx="30" ry="10" fill="#e8e4da" />
      <polygon points="124,214 142,172 155,179 137,218" fill="#e8e4da" />
      <circle cx="149" cy="171" r="6" fill="#e8e4da" />
      <polygon points="152,166 163,171 153,177" fill="#e8e4da" />
      <polygon points="74,213 62,204 68,220" fill="#e8e4da" />
    </g>
    {/* skeletal rider */}
    <g className="cl-sg-br3" stroke={LEAD} strokeWidth="3" strokeLinejoin="round">
      <polygon points="94,170 108,170 106,206 92,206" fill="#e8e4da" />
      <line x1="94" y1="178" x2="107" y2="178" strokeWidth="2" />
      <line x1="93.5" y1="185" x2="106.5" y2="185" strokeWidth="2" />
      <line x1="93" y1="192" x2="106" y2="192" strokeWidth="2" />
      <circle cx="101" cy="160" r="7" fill="#e8e4da" />
      <polygon points="96,174 78,182 81,189 99,181" fill="#e8e4da" />
    </g>
    <circle cx="98.5" cy="159" r="1.2" fill="#100c1e" />
    <circle cx="103.5" cy="159" r="1.2" fill="#100c1e" />
    {/* dark banner with white rose (the scene's light) */}
    <line x1="72" y1="116" x2="72" y2="196" stroke={LEAD} strokeWidth="6" />
    <line x1="72" y1="116" x2="72" y2="196" stroke="#4a3a2a" strokeWidth="3" />
    <circle className="cl-sg-glow" cx="54" cy="134" r="14" fill="url(#cl-sg-glowgrad)" />
    <g stroke={LEAD} strokeWidth="3" strokeLinejoin="round">
      <polygon points="72,118 38,124 42,152 72,146" fill="#141026" />
    </g>
    <g className="cl-sg-lantern" stroke={LEAD} strokeWidth="1.8">
      <circle cx="54" cy="129.5" r="2.8" fill="#f4f0e6" />
      <circle cx="58.3" cy="132.6" r="2.8" fill="#f4f0e6" />
      <circle cx="56.7" cy="137.7" r="2.8" fill="#f4f0e6" />
      <circle cx="51.3" cy="137.7" r="2.8" fill="#f4f0e6" />
      <circle cx="49.7" cy="132.6" r="2.8" fill="#f4f0e6" />
      <circle cx="54" cy="134" r="2.2" fill="#e8b83c" stroke="none" />
    </g>
  </>
);

/* XVII — The Star: big 8-point star (light), 7 small stars, two jugs, pool. */
const StarScene = ({ p }: SP) => (
  <>
    <ShardBg p={p} />
    <circle className="cl-sg-glow" cx="100" cy="104" r="24" fill="url(#cl-sg-glowgrad)" />
    <g className="cl-sg-rays" stroke={LEAD} strokeWidth="2.5" strokeLinejoin="round">
      <polygon points="118,94 130,86 122,100" fill="#f2b43a" />
      <polygon points="82,94 70,86 78,100" fill="#f2b43a" />
    </g>
    <g className="cl-sg-lantern" stroke={LEAD} strokeWidth="3" strokeLinejoin="round">
      <path d="M 100 90 L 102.5 98 L 109.9 94.1 L 106 101.5 L 114 104 L 106 106.5 L 109.9 113.9 L 102.5 110 L 100 118 L 97.5 110 L 90.1 113.9 L 94 106.5 L 86 104 L 94 101.5 L 90.1 94.1 L 97.5 98 Z" fill="url(#cl-sg-amber)" />
    </g>
    {/* seven small stars */}
    <g stroke={LEAD} strokeWidth="1.5" strokeLinejoin="round">
      {[[56, 108], [144, 106], [44, 142], [156, 140], [62, 166], [138, 166], [100, 140]].map(([x, y]) => (
        <polygon key={`${x},${y}`} points={`${x},${y - 4} ${x + 2.5},${y} ${x},${y + 4} ${x - 2.5},${y}`} fill="#f0e2b0" />
      ))}
    </g>
    {/* kneeling figure pouring from two jugs */}
    <g className="cl-sg-br3" stroke={LEAD} strokeWidth="3.5" strokeLinejoin="round">
      <polygon points="88,172 114,180 111,188 86,180" fill={p.arm} />
      <polygon points="80,174 58,186 62,193 84,182" fill={p.arm} />
      <polygon points="78,168 92,166 96,198 80,200" fill="url(#cl-sg-robe)" />
      <polygon points="80,200 102,198 106,216 74,216" fill={p.robe1} />
      <polygon points="100,198 118,204 116,216 100,214" fill={p.robe3} />
      <circle cx="84" cy="160" r="7" fill={SKIN} />
      <circle cx="118" cy="184" r="6" fill="#c98a2e" />
      <circle cx="56" cy="190" r="6" fill="#c98a2e" />
    </g>
    {/* water streams */}
    <line x1="118" y1="190" x2="126" y2="238" stroke="#7ab8e0" strokeWidth="2.5" />
    <line x1="56" y1="196" x2="50" y2="228" stroke="#7ab8e0" strokeWidth="2.5" />
    <Ground p={p} />
    <ellipse cx="128" cy="244" rx="26" ry="8" fill="#2a6a9e" stroke={LEAD} strokeWidth="3" />
  </>
);

/* XXII — The Fool: stepping to the cliff edge, dog, bundle, sun (light). */
const FoolScene = ({ p }: SP) => (
  <>
    <ShardBg p={p} />
    {/* sun behind */}
    <circle className="cl-sg-glow" cx="54" cy="104" r="24" fill="url(#cl-sg-glowgrad)" />
    <g className="cl-sg-rays" stroke={LEAD} strokeWidth="2.5" strokeLinejoin="round">
      <polygon points="70,96 82,88 74,102" fill="#f2b43a" />
      <polygon points="40,90 34,78 48,86" fill="#e8a02a" />
      <polygon points="68,116 78,124 64,122" fill="#e8a02a" />
    </g>
    <g className="cl-sg-lantern" stroke={LEAD} strokeWidth="3.5">
      <circle cx="54" cy="104" r="13" fill="url(#cl-sg-amber)" />
    </g>
    {/* cliff edge */}
    <g className="cl-sg-br4" stroke={LEAD} strokeWidth="3.5" strokeLinejoin="round">
      <polygon points="22,232 118,232 130,242 122,254 22,254" fill={p.ground1} />
      <polygon points="118,232 130,242 122,254 132,254 140,240" fill={p.ground2} />
    </g>
    {/* figure in profile, head tilted up */}
    <g className="cl-sg-br3" stroke={LEAD} strokeWidth="3.5" strokeLinejoin="round">
      <polygon points="98,194 108,194 100,230 92,230" fill={p.robe3} />
      <polygon points="110,194 120,194 126,230 118,230" fill={p.robe1} />
      <polygon points="98,142 116,142 120,196 96,196" fill="url(#cl-sg-robe)" />
      <polygon points="100,148 86,160 90,166 104,154" fill={p.arm} />
      <circle cx="110" cy="132" r="8" fill={SKIN} />
    </g>
    {/* bundle on a stick over the shoulder */}
    <line x1="90" y1="158" x2="76" y2="128" stroke={LEAD} strokeWidth="5.5" strokeLinecap="round" />
    <line x1="90" y1="158" x2="76" y2="128" stroke="#8a5a2a" strokeWidth="2.8" strokeLinecap="round" />
    <circle cx="74" cy="123" r="5.5" fill="url(#cl-sg-rosea)" stroke={LEAD} strokeWidth="2.5" />
    {/* small dog at his heels */}
    <g className="cl-sg-br4" stroke={LEAD} strokeWidth="2.5" strokeLinejoin="round">
      <ellipse cx="76" cy="226" rx="10" ry="5.5" fill="#e8e4da" />
      <circle cx="87" cy="218" r="4.5" fill="#e8e4da" />
      <polygon points="86,214 89,209 91,215" fill="#e8e4da" />
      <polygon points="66,223 60,214 64,220" fill="#e8e4da" />
    </g>
  </>
);

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

  const scene = (() => {
    switch (number) {
      case 1: return <MagicianScene p={p} />;
      case 3: return <EmpressScene p={p} />;
      case 7: return <ChariotScene p={p} />;
      case 10: return <WheelScene p={p} />;
      case 13: return <DeathScene p={p} />;
      case 17: return <StarScene p={p} />;
      case 22: return <FoolScene p={p} />;
      default: return <HermitScene p={p} />;
    }
  })();

  return (
    <figure
      className="cl-sg-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
    >
      <style>{`
        .cl-sg-card { display: block; line-height: 0; }
        .cl-sg-card svg { display: block; width: 100%; height: 100%; }

        /* light-source glow pulse */
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

        /* (4) hover: light source flares, beams intensify */
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
            {scene}

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
