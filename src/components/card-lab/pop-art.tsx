/**
 * POP-ART — Major Arcana comic panels (default: The Hermit, IX)
 * Roy Lichtenstein comic panels. Bold black outlines, flat primary fills,
 * and Ben-Day dots (uniform SVG dot patterns) for ALL shading. Each arcana
 * is its OWN scene drawn in the same technique; `number` selects the scene,
 * `variant` (0-7) selects one of 4 palettes x normal/mirrored composition.
 * Comic chrome: jagged numeral caption box top-left, red name strip bottom.
 * Palette strictly primary: red, yellow, blue, black, white.
 *
 * Signature effects: panel-slam on mount, starburst POP (scale pulse) on the
 * scene's light source with stepped ray flicker, hover snap + rapid-fire pop,
 * and the Hermit's cycling "..." thought bubble. All CSS-only, reduced-motion
 * guarded. Defaults (no props) render the original Hermit card exactly.
 */
import type { ComponentType } from "react";
import { toRoman } from "@/lib/roman";

export interface PopArtCardProps {
  number?: number;
  name?: string;
  variant?: number;
}

interface PopArtScheme {
  skyBase: string;
  skyDot: string;
  robe: string;
  mtn: string;
  mtnDot: string;
  accent: string;
}

const SCHEMES: PopArtScheme[] = [
  // 0 — classic: red robe, blue mountain, blue-dotted day sky, yellow accent
  { skyBase: "#ffffff", skyDot: "#2b6fd6", robe: "#e32020", mtn: "#1e50c8", mtnDot: "#0a2a6e", accent: "#ffe719" },
  // 1 — inverted primaries: blue robe, red mountain, red-dotted sky
  { skyBase: "#ffffff", skyDot: "#e32020", robe: "#1e50c8", mtn: "#e32020", mtnDot: "#7a0d0d", accent: "#ffe719" },
  // 2 — swapped accent: yellow robe, red burst/lantern
  { skyBase: "#ffffff", skyDot: "#2b6fd6", robe: "#ffe719", mtn: "#1e50c8", mtnDot: "#0a2a6e", accent: "#e32020" },
  // 3 — night panel: black sky with white dots
  { skyBase: "#0a0a0a", skyDot: "#ffffff", robe: "#e32020", mtn: "#1e50c8", mtnDot: "#0a2a6e", accent: "#ffe719" },
];

type SceneProps = { s: PopArtScheme };

/* 12-spike starburst centered on (0,0), outer r 36 / inner r 21 */
const BURST_POINTS =
  "0.0,-36.0 5.4,-20.3 18.0,-31.2 14.8,-14.8 31.2,-18.0 20.3,-5.4 36.0,0.0 20.3,5.4 31.2,18.0 14.8,14.8 18.0,31.2 5.4,20.3 0.0,36.0 -5.4,20.3 -18.0,31.2 -14.8,14.8 -31.2,18.0 -20.3,5.4 -36.0,0.0 -20.3,-5.4 -31.2,-18.0 -14.8,-14.8 -18.0,-31.2 -5.4,-20.3";

/** Sky panel: flat base + uniform Ben-Day dots. */
function SceneSky({ s }: SceneProps) {
  return (
    <>
      <rect x="4" y="4" width="192" height="258" fill={s.skyBase} />
      <rect x="4" y="4" width="192" height="258" fill="url(#cl-popart-dots-sky)" />
    </>
  );
}

/** Starburst POP + stepped rays, placed at a scene's light source. */
function PopBurst({ s, x, y, k }: SceneProps & { x: number; y: number; k: number }) {
  const sw = 3.5 / k;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`} strokeLinejoin="round">
      <g className="cl-popart-rays">
        <line x1="0" y1="-44" x2="0" y2="-54" stroke="#0a0a0a" strokeWidth={sw} />
        <line x1="38" y1="-30" x2="48" y2="-38" stroke="#0a0a0a" strokeWidth={sw} />
        <line x1="44" y1="0" x2="56" y2="0" stroke="#0a0a0a" strokeWidth={sw} />
        <line x1="-38" y1="-30" x2="-48" y2="-38" stroke="#0a0a0a" strokeWidth={sw} />
        <line x1="-44" y1="0" x2="-56" y2="0" stroke="#0a0a0a" strokeWidth={sw} />
      </g>
      <polygon
        className="cl-popart-burst"
        points={BURST_POINTS}
        fill={s.accent}
        stroke="#0a0a0a"
        strokeWidth={sw}
      />
    </g>
  );
}

/* ================= I — THE MAGICIAN ================= */
function MagicianScene({ s }: SceneProps) {
  return (
    <>
      <SceneSky s={s} />
      <PopBurst s={s} x={161} y={32} k={0.5} />
      <g strokeLinejoin="round" strokeLinecap="round">
        {/* infinity symbol above the head */}
        <circle cx="91" cy="34" r="8" fill="none" stroke="#0a0a0a" strokeWidth="3" />
        <circle cx="109" cy="34" r="8" fill="none" stroke="#0a0a0a" strokeWidth="3" />
        {/* head (skin = red Ben-Day dots) */}
        <circle cx="100" cy="64" r="12" fill="url(#cl-popart-dots-skin)" stroke="#0a0a0a" strokeWidth="3" />
        {/* robe + shading dots */}
        <path d="M86,82 C80,120 78,158 76,192 L124,192 C122,158 120,120 114,82 Z" fill={s.robe} stroke="#0a0a0a" strokeWidth="4" />
        <path d="M106,84 C112,122 114,158 116,192 L104,192 C106,156 104,120 100,86 Z" fill="url(#cl-popart-dots-shade)" />
        <line x1="80" y1="118" x2="120" y2="118" stroke="#0a0a0a" strokeWidth="2.5" />
        {/* raised arm + wand with glowing tip */}
        <polygon points="112,88 146,56 154,64 120,96" fill={s.robe} stroke="#0a0a0a" strokeWidth="3" />
        <line x1="148" y1="60" x2="160" y2="36" stroke="#0a0a0a" strokeWidth="4" />
        <circle className="cl-popart-star" cx="161" cy="32" r="4.5" fill={s.accent} stroke="#0a0a0a" strokeWidth="2" />
        {/* lowered arm */}
        <polygon points="88,88 72,128 80,132 96,96" fill={s.robe} stroke="#0a0a0a" strokeWidth="3" />
        {/* table with the four suit symbols */}
        <rect x="16" y="196" width="168" height="14" fill={s.accent} stroke="#0a0a0a" strokeWidth="4" />
        <rect x="28" y="210" width="8" height="30" fill="#0a0a0a" />
        <rect x="164" y="210" width="8" height="30" fill="#0a0a0a" />
        {/* cup */}
        <path d="M36,182 L52,182 A8,8 0 0 1 36,182 Z" fill="#ffffff" stroke="#0a0a0a" strokeWidth="2.5" />
        <line x1="44" y1="190" x2="44" y2="196" stroke="#0a0a0a" strokeWidth="2.5" />
        {/* sword */}
        <line x1="78" y1="168" x2="78" y2="196" stroke="#0a0a0a" strokeWidth="3" />
        <line x1="71" y1="178" x2="85" y2="178" stroke="#0a0a0a" strokeWidth="2.5" />
        {/* pentacle */}
        <circle cx="112" cy="184" r="9" fill="#ffffff" stroke="#0a0a0a" strokeWidth="2.5" />
        <polygon points="112,177 117,184 112,191 107,184" fill="none" stroke="#0a0a0a" strokeWidth="2" />
        {/* wand */}
        <line x1="140" y1="196" x2="156" y2="172" stroke="#0a0a0a" strokeWidth="3" />
      </g>
    </>
  );
}

/* ================= III — THE EMPRESS ================= */
function EmpressScene({ s }: SceneProps) {
  return (
    <>
      <SceneSky s={s} />
      <PopBurst s={s} x={100} y={40} k={0.5} />
      <g strokeLinejoin="round" strokeLinecap="round">
        {/* star crown */}
        <polygon points="78,62 86,46 94,58 100,42 106,58 114,46 122,62" fill={s.accent} stroke="#0a0a0a" strokeWidth="3" />
        <polygon className="cl-popart-star" points="100,32 102,37 107,38 102,39 100,44 98,39 93,38 98,37" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1.5" />
        <circle cx="86" cy="42" r="2.5" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1.5" />
        <circle cx="114" cy="42" r="2.5" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1.5" />
        {/* head */}
        <circle cx="100" cy="80" r="13" fill="url(#cl-popart-dots-skin)" stroke="#0a0a0a" strokeWidth="3" />
        {/* flowing gown + shading dots */}
        <path d="M88,96 C72,140 66,190 62,232 L138,232 C134,190 128,140 112,96 Z" fill={s.robe} stroke="#0a0a0a" strokeWidth="4" />
        <path d="M104,98 C118,142 124,190 128,232 L114,232 C112,188 106,142 98,100 Z" fill="url(#cl-popart-dots-shade)" />
        {/* heart shield with Venus symbol */}
        <path d="M100,158 C100,148 114,146 114,156 C114,164 104,170 100,176 C96,170 86,164 86,156 C86,146 100,148 100,158 Z" fill={s.accent} stroke="#0a0a0a" strokeWidth="3" />
        <circle cx="100" cy="158" r="4" fill="none" stroke="#ffffff" strokeWidth="2" />
        <line x1="100" y1="162" x2="100" y2="170" stroke="#ffffff" strokeWidth="2" />
        <line x1="96.5" y1="166" x2="103.5" y2="166" stroke="#ffffff" strokeWidth="2" />
        {/* wheat below (always ripe yellow) */}
        <path d="M20,258 L20,228 M14,236 L20,242 M26,236 L20,242 M14,248 L20,254 M26,248 L20,254" fill="none" stroke="#ffe719" strokeWidth="2.5" />
        <path d="M40,258 L40,228 M34,236 L40,242 M46,236 L40,242 M34,248 L40,254 M46,248 L40,254" fill="none" stroke="#ffe719" strokeWidth="2.5" />
        <path d="M160,258 L160,228 M154,236 L160,242 M166,236 L160,242 M154,248 L160,254 M166,248 L160,254" fill="none" stroke="#ffe719" strokeWidth="2.5" />
        <path d="M180,258 L180,228 M174,236 L180,242 M186,236 L180,242 M174,248 L180,254 M186,248 L180,254" fill="none" stroke="#ffe719" strokeWidth="2.5" />
      </g>
    </>
  );
}

/* ================= VII — THE CHARIOT ================= */
function ChariotScene({ s }: SceneProps) {
  const wall =
    "M4,126 L4,86 L14,86 L14,74 L30,74 L30,86 L54,86 L54,74 L70,74 L70,86 L94,86 L94,74 L110,74 L110,86 L134,86 L134,74 L150,74 L150,86 L174,86 L174,74 L190,74 L190,86 L196,86 L196,126 Z";
  return (
    <>
      <SceneSky s={s} />
      <g strokeLinejoin="round" strokeLinecap="round">
        {/* city wall behind */}
        <path d={wall} fill={s.mtn} stroke="#0a0a0a" strokeWidth="3.5" />
        <path d={wall} fill="url(#cl-popart-dots-mountain)" stroke="none" />
        {/* starred canopy (light source: center star) */}
        <PopBurst s={s} x={100} y={50} k={0.5} />
        <path d="M44,64 C70,40 130,40 156,64 L156,76 L44,76 Z" fill={s.mtn} stroke="#0a0a0a" strokeWidth="4" />
        <polygon className="cl-popart-star" points="100,48 102,53 107,54 102,55 100,60 98,55 93,54 98,53" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1.5" />
        <circle cx="72" cy="62" r="2.5" fill="#ffffff" />
        <circle cx="128" cy="62" r="2.5" fill="#ffffff" />
        <line x1="52" y1="76" x2="52" y2="150" stroke="#0a0a0a" strokeWidth="4" />
        <line x1="148" y1="76" x2="148" y2="150" stroke="#0a0a0a" strokeWidth="4" />
        {/* charioteer */}
        <circle cx="100" cy="112" r="11" fill="url(#cl-popart-dots-skin)" stroke="#0a0a0a" strokeWidth="3" />
        <polygon points="92,102 96,94 100,100 104,94 108,102" fill={s.accent} stroke="#0a0a0a" strokeWidth="2" />
        <rect x="86" y="126" width="28" height="34" fill={s.robe} stroke="#0a0a0a" strokeWidth="3.5" />
        {/* boxy chariot */}
        <rect x="56" y="160" width="88" height="44" fill={s.accent} stroke="#0a0a0a" strokeWidth="4" />
        <line x1="56" y1="178" x2="144" y2="178" stroke="#0a0a0a" strokeWidth="2.5" />
        {/* two sphinx-like shapes in front */}
        <path d="M30,254 q0,-18 16,-18 q10,0 10,10 l20,0 q8,0 8,8 l0,8 l-54,0 Z" fill={s.mtn} stroke="#0a0a0a" strokeWidth="3" />
        <circle cx="40" cy="240" r="7" fill="url(#cl-popart-dots-skin)" stroke="#0a0a0a" strokeWidth="2.5" />
        <path d="M170,254 q0,-18 -16,-18 q-10,0 -10,10 l-20,0 q-8,0 -8,8 l0,8 l54,0 Z" fill={s.mtn} stroke="#0a0a0a" strokeWidth="3" />
        <circle cx="160" cy="240" r="7" fill="url(#cl-popart-dots-skin)" stroke="#0a0a0a" strokeWidth="2.5" />
      </g>
    </>
  );
}

/* ================= IX — THE HERMIT (canonical scene) ================= */
function HermitScene({ s }: SceneProps) {
  return (
    <>
      <SceneSky s={s} />
      {/* lantern starburst: yellow explosion + black outline rays */}
      <g strokeLinejoin="round">
        <g className="cl-popart-rays">
          <line x1="76" y1="52" x2="76" y2="42" stroke="#0a0a0a" strokeWidth="3.5" />
          <line x1="110" y1="62" x2="117" y2="55" stroke="#0a0a0a" strokeWidth="3.5" />
          <line x1="120" y1="96" x2="131" y2="96" stroke="#0a0a0a" strokeWidth="3.5" />
          <line x1="42" y1="62" x2="35" y2="55" stroke="#0a0a0a" strokeWidth="3.5" />
          <line x1="32" y1="96" x2="21" y2="96" stroke="#0a0a0a" strokeWidth="3.5" />
        </g>
        <polygon
          className="cl-popart-burst"
          points="76.0,60.0 81.4,75.7 94.0,64.8 90.8,81.2 107.2,78.0 96.3,90.6 112.0,96.0 96.3,101.4 107.2,114.0 90.8,110.8 94.0,127.2 81.4,116.3 76.0,132.0 70.6,116.3 58.0,127.2 61.2,110.8 44.8,114.0 55.7,101.4 40.0,96.0 55.7,90.6 44.8,78.0 61.2,81.2 58.0,64.8 70.6,75.7"
          fill={s.accent}
          stroke="#0a0a0a"
          strokeWidth="3.5"
        />
      </g>
      {/* mountains: flat fill + Ben-Day dots */}
      <g strokeLinejoin="round">
        <polygon
          points="4,222 35,170 60,206 85,158 110,206 140,164 170,202 196,174 196,262 4,262"
          fill={s.mtn}
          stroke="#0a0a0a"
          strokeWidth="3.5"
        />
        <polygon
          points="4,222 35,170 60,206 85,158 110,206 140,164 170,202 196,174 196,262 4,262"
          fill="url(#cl-popart-dots-mountain)"
        />
        <polygon
          points="73,178 85,158 97,178 90,172 85,180 80,172"
          fill="#ffffff"
          stroke="#0a0a0a"
          strokeWidth="2.5"
        />
      </g>
      {/* the hermit */}
      <g strokeLinejoin="round" strokeLinecap="round">
        <line x1="146" y1="128" x2="157" y2="252" stroke="#0a0a0a" strokeWidth="4.5" />
        <circle cx="146" cy="126" r="4" fill={s.accent} stroke="#0a0a0a" strokeWidth="2.5" />
        <polygon
          points="104,142 84,104 98,95 117,131"
          fill={s.robe}
          stroke="#0a0a0a"
          strokeWidth="3.5"
        />
        <g>
          <path d="M84,88 Q91,78 98,88" fill="none" stroke="#0a0a0a" strokeWidth="2.5" />
          <rect x="82" y="88" width="18" height="20" rx="2" fill={s.accent} stroke="#0a0a0a" strokeWidth="3" />
          <line x1="82" y1="98" x2="100" y2="98" stroke="#0a0a0a" strokeWidth="1.5" />
          <polygon
            className="cl-popart-star"
            points="91,90 92.5,94 96.5,94 93.2,96.5 94.4,100.5 91,98 87.6,100.5 88.8,96.5 85.5,94 89.5,94"
            fill="#ffffff"
            stroke="#0a0a0a"
            strokeWidth="1.2"
          />
        </g>
        <path
          d="M122,110
             C110,114 104,124 102,138
             C99,156 97,186 95,214
             L93,250 L153,250 L151,212
             C149,184 147,156 143,138
             C141,124 134,114 122,110 Z"
          fill={s.robe}
          stroke="#0a0a0a"
          strokeWidth="4"
        />
        <path
          d="M133,118
             C143,132 147,170 149,250
             L134,250 C136,196 135,150 129,122 Z"
          fill="url(#cl-popart-dots-shade)"
        />
        <path d="M108,160 C106,190 105,220 104,246" fill="none" stroke="#0a0a0a" strokeWidth="2.5" />
        <path d="M118,170 C117,200 116,225 116,246" fill="none" stroke="#0a0a0a" strokeWidth="2" />
        <path
          d="M122,116 C113,120 110,129 111,138 C117,133 127,133 133,138 C134,129 131,120 122,116 Z"
          fill="#0a0a0a"
        />
        <ellipse cx="122" cy="133" rx="6" ry="7" fill="url(#cl-popart-dots-skin)" stroke="#0a0a0a" strokeWidth="2" />
        <circle cx="119.5" cy="132" r="1" fill="#0a0a0a" />
        <circle cx="124.5" cy="132" r="1" fill="#0a0a0a" />
      </g>
      {/* thought bubble with '...' (dots cycle continuously) */}
      <g className="cl-popart-bubble">
        <circle cx="152" cy="112" r="2" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1.8" />
        <circle cx="160" cy="103" r="3" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1.8" />
        <ellipse cx="176" cy="90" rx="17" ry="11" fill="#ffffff" stroke="#0a0a0a" strokeWidth="2.5" />
        <text x="176" y="94" textAnchor="middle" className="cl-popart-text" fontSize="11" fill="#0a0a0a">
          <tspan className="cl-popart-td cl-popart-td-1">.</tspan>
          <tspan className="cl-popart-td cl-popart-td-2">.</tspan>
          <tspan className="cl-popart-td cl-popart-td-3">.</tspan>
        </text>
      </g>
    </>
  );
}

/* ================= X — WHEEL OF FORTUNE ================= */
function WheelScene({ s }: SceneProps) {
  return (
    <>
      <SceneSky s={s} />
      <g strokeLinejoin="round" strokeLinecap="round">
        {/* sphinx perched on top of the wheel */}
        <path d="M82,66 q0,-14 12,-14 q8,0 8,8 l14,0 q6,0 6,6 l0,6 l-40,0 Z" fill={s.mtn} stroke="#0a0a0a" strokeWidth="2.5" />
        <circle cx="92" cy="50" r="6" fill="url(#cl-popart-dots-skin)" stroke="#0a0a0a" strokeWidth="2.5" />
        {/* snake down the left, creature up the right */}
        <path d="M22,206 q-10,18 2,32 q10,12 3,26" fill="none" stroke={s.robe} strokeWidth="4" />
        <path d="M184,234 q14,-8 10,-24 q-3,-12 8,-18" fill="none" stroke={s.mtn} strokeWidth="4" />
        {/* the wheel */}
        <circle cx="100" cy="150" r="74" fill={s.accent} stroke="#0a0a0a" strokeWidth="5" />
        <circle cx="100" cy="150" r="50" fill={s.skyBase} stroke="#0a0a0a" strokeWidth="3.5" />
        <circle cx="100" cy="150" r="50" fill="url(#cl-popart-dots-sky)" stroke="none" />
        <line x1="100" y1="100" x2="100" y2="200" stroke="#0a0a0a" strokeWidth="3.5" />
        <line x1="50" y1="150" x2="150" y2="150" stroke="#0a0a0a" strokeWidth="3.5" />
        <line x1="65" y1="115" x2="135" y2="185" stroke="#0a0a0a" strokeWidth="3.5" />
        <line x1="135" y1="115" x2="65" y2="185" stroke="#0a0a0a" strokeWidth="3.5" />
        {/* symbols on the rim */}
        <circle cx="100" cy="76" r="5" fill={s.robe} stroke="#0a0a0a" strokeWidth="2.5" />
        <circle cx="100" cy="224" r="5" fill={s.robe} stroke="#0a0a0a" strokeWidth="2.5" />
        <circle cx="26" cy="150" r="5" fill={s.robe} stroke="#0a0a0a" strokeWidth="2.5" />
        <circle cx="174" cy="150" r="5" fill={s.robe} stroke="#0a0a0a" strokeWidth="2.5" />
        {/* hub = light source */}
        <PopBurst s={s} x={100} y={150} k={0.45} />
        <circle cx="100" cy="150" r="11" fill={s.robe} stroke="#0a0a0a" strokeWidth="3.5" />
        <polygon className="cl-popart-star" points="100,144 102,149 107,150 102,151 100,156 98,151 93,150 98,149" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1.2" />
      </g>
    </>
  );
}

/* ================= XIII — DEATH ================= */
function DeathScene({ s }: SceneProps) {
  return (
    <>
      <SceneSky s={s} />
      <g strokeLinejoin="round" strokeLinecap="round">
        {/* ground + sun rising between two towers */}
        <rect x="4" y="232" width="192" height="30" fill={s.mtn} stroke="none" />
        <rect x="4" y="232" width="192" height="30" fill="url(#cl-popart-dots-mountain)" stroke="none" />
        <line x1="4" y1="232" x2="196" y2="232" stroke="#0a0a0a" strokeWidth="3.5" />
        <rect x="128" y="200" width="14" height="32" fill={s.mtn} stroke="#0a0a0a" strokeWidth="3" />
        <rect x="168" y="200" width="14" height="32" fill={s.mtn} stroke="#0a0a0a" strokeWidth="3" />
        <path d="M146,232 a14,14 0 0 1 28,0 Z" fill={s.accent} stroke="#0a0a0a" strokeWidth="3" />
        <line x1="160" y1="210" x2="160" y2="202" stroke="#0a0a0a" strokeWidth="2.5" />
        <line x1="150" y1="216" x2="144" y2="210" stroke="#0a0a0a" strokeWidth="2.5" />
        <line x1="170" y1="216" x2="176" y2="210" stroke="#0a0a0a" strokeWidth="2.5" />
        {/* dark banner with white rose (light source) */}
        <line x1="44" y1="48" x2="44" y2="220" stroke="#0a0a0a" strokeWidth="4.5" />
        <rect x="44" y="48" width="56" height="48" fill="#0a0a0a" stroke="#0a0a0a" strokeWidth="4" />
        <PopBurst s={s} x={72} y={72} k={0.42} />
        <circle className="cl-popart-star" cx="72" cy="72" r="9" fill="#ffffff" stroke="#0a0a0a" strokeWidth="2" />
        <path d="M72,63 v18 M63,72 h18 M66,66 l12,12 M78,66 l-12,12" stroke="#0a0a0a" strokeWidth="1.5" />
        {/* horse */}
        <path d="M90,214 q-6,-40 24,-52 q34,-12 58,4 q18,12 14,34" fill="#ffffff" stroke="#0a0a0a" strokeWidth="4" />
        <path d="M176,166 q20,-10 26,6 q4,14 -8,20 l-18,4" fill="#ffffff" stroke="#0a0a0a" strokeWidth="4" />
        <circle cx="194" cy="176" r="2" fill="#0a0a0a" />
        <line x1="100" y1="208" x2="96" y2="232" stroke="#0a0a0a" strokeWidth="4" />
        <line x1="120" y1="212" x2="116" y2="232" stroke="#0a0a0a" strokeWidth="4" />
        <line x1="160" y1="210" x2="158" y2="232" stroke="#0a0a0a" strokeWidth="4" />
        <line x1="180" y1="204" x2="184" y2="232" stroke="#0a0a0a" strokeWidth="4" />
        {/* skeletal rider */}
        <circle cx="124" cy="112" r="10" fill="#ffffff" stroke="#0a0a0a" strokeWidth="3.5" />
        <circle cx="120" cy="110" r="1.8" fill="#0a0a0a" />
        <circle cx="128" cy="110" r="1.8" fill="#0a0a0a" />
        <line x1="124" y1="122" x2="126" y2="160" stroke="#0a0a0a" strokeWidth="3" />
        <path d="M118,134 q7,5 14,0 M117,144 q8,5 16,0 M118,154 q7,5 14,0" fill="none" stroke="#0a0a0a" strokeWidth="2" />
        <line x1="120" y1="136" x2="60" y2="126" stroke="#0a0a0a" strokeWidth="3" />
      </g>
    </>
  );
}

/* ================= XVII — THE STAR ================= */
function StarScene({ s }: SceneProps) {
  const small = (x: number, y: number) =>
    `${x},${y - 7} ${x + 3},${y} ${x},${y + 7} ${x - 3},${y}`;
  return (
    <>
      <SceneSky s={s} />
      <g strokeLinejoin="round" strokeLinecap="round">
        {/* big 8-pointed star = light source (it IS the burst) */}
        <g className="cl-popart-rays">
          <line x1="100" y1="18" x2="100" y2="10" stroke="#0a0a0a" strokeWidth="3" />
          <line x1="138" y1="56" x2="148" y2="56" stroke="#0a0a0a" strokeWidth="3" />
          <line x1="62" y1="56" x2="52" y2="56" stroke="#0a0a0a" strokeWidth="3" />
        </g>
        <polygon
          className="cl-popart-burst"
          points="100.0,26.0 105.0,44.0 121.2,34.8 112.0,51.0 130.0,56.0 112.0,61.0 121.2,77.2 105.0,68.0 100.0,86.0 95.0,68.0 78.8,77.2 88.0,61.0 70.0,56.0 88.0,51.0 78.8,34.8 95.0,44.0"
          fill={s.accent}
          stroke="#0a0a0a"
          strokeWidth="3.5"
        />
        <circle className="cl-popart-star" cx="100" cy="56" r="6" fill="#ffffff" stroke="#0a0a0a" strokeWidth="2" />
        {/* seven small stars */}
        <polygon points={small(48, 40)} fill="#ffffff" stroke="#0a0a0a" strokeWidth="2" />
        <polygon points={small(76, 20)} fill="#ffffff" stroke="#0a0a0a" strokeWidth="2" />
        <polygon points={small(124, 18)} fill="#ffffff" stroke="#0a0a0a" strokeWidth="2" />
        <polygon points={small(152, 36)} fill="#ffffff" stroke="#0a0a0a" strokeWidth="2" />
        <polygon points={small(40, 80)} fill="#ffffff" stroke="#0a0a0a" strokeWidth="2" />
        <polygon points={small(160, 84)} fill="#ffffff" stroke="#0a0a0a" strokeWidth="2" />
        <polygon points={small(100, 108)} fill="#ffffff" stroke="#0a0a0a" strokeWidth="2" />
        {/* kneeling figure */}
        <circle cx="92" cy="150" r="10" fill="url(#cl-popart-dots-skin)" stroke="#0a0a0a" strokeWidth="3" />
        <path d="M86,162 C76,186 78,210 88,224 L116,226 C120,206 114,182 104,162 Z" fill={s.robe} stroke="#0a0a0a" strokeWidth="4" />
        <path d="M100,164 C108,186 110,208 108,226 L100,226 C102,206 100,184 96,166 Z" fill="url(#cl-popart-dots-shade)" />
        <path d="M88,224 L64,244 L98,244 Z" fill={s.robe} stroke="#0a0a0a" strokeWidth="3" />
        {/* two jugs, two water streams (one to land, one to the pool) */}
        <line x1="88" y1="172" x2="62" y2="186" stroke="#0a0a0a" strokeWidth="3.5" />
        <path d="M54,182 a7,7 0 0 0 12,5 l-3,-11 Z" fill={s.accent} stroke="#0a0a0a" strokeWidth="2.5" />
        <path d="M58,192 q-6,18 -2,38" fill="none" stroke="#1e50c8" strokeWidth="3" />
        <line x1="104" y1="174" x2="128" y2="190" stroke="#0a0a0a" strokeWidth="3.5" />
        <path d="M128,184 a7,7 0 0 1 4,12 l-10,-4 Z" fill={s.accent} stroke="#0a0a0a" strokeWidth="2.5" />
        <path d="M134,196 q5,16 2,34" fill="none" stroke="#1e50c8" strokeWidth="3" />
        {/* pool */}
        <path d="M110,248 q10,-8 20,0 q10,8 20,0 q10,-8 20,0" fill="none" stroke="#1e50c8" strokeWidth="2.5" />
        <path d="M120,256 q10,-8 20,0 q10,8 20,0" fill="none" stroke="#1e50c8" strokeWidth="2.5" />
      </g>
    </>
  );
}

/* ================= XXII — THE FOOL ================= */
function FoolScene({ s }: SceneProps) {
  return (
    <>
      <SceneSky s={s} />
      <g strokeLinejoin="round" strokeLinecap="round">
        {/* sun = light source */}
        <g transform="translate(162 48)">
          <g className="cl-popart-rays">
            <line x1="0" y1="-24" x2="0" y2="-32" stroke="#0a0a0a" strokeWidth="3" />
            <line x1="24" y1="0" x2="32" y2="0" stroke="#0a0a0a" strokeWidth="3" />
            <line x1="17" y1="-17" x2="23" y2="-23" stroke="#0a0a0a" strokeWidth="3" />
            <line x1="-17" y1="-17" x2="-23" y2="-23" stroke="#0a0a0a" strokeWidth="3" />
          </g>
          <circle className="cl-popart-burst" cx="0" cy="0" r="16" fill={s.accent} stroke="#0a0a0a" strokeWidth="4" />
          <circle className="cl-popart-star" cx="0" cy="0" r="5" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1.5" />
        </g>
        {/* cliff edge under his stepping foot */}
        <polygon points="4,232 140,232 140,262 4,262" fill={s.mtn} stroke="#0a0a0a" strokeWidth="3.5" />
        <polygon points="4,232 140,232 140,262 4,262" fill="url(#cl-popart-dots-mountain)" stroke="none" />
        {/* figure in profile, head tilted up */}
        <circle cx="112" cy="96" r="10" fill="url(#cl-popart-dots-skin)" stroke="#0a0a0a" strokeWidth="3" />
        <circle cx="115" cy="93" r="1.2" fill="#0a0a0a" />
        <path d="M104,90 q6,-10 16,-6" fill="none" stroke="#0a0a0a" strokeWidth="3" />
        <line x1="118" y1="84" x2="128" y2="76" stroke="#0a0a0a" strokeWidth="2.5" />
        <path d="M106,108 L96,172 L128,174 L120,108 Z" fill={s.robe} stroke="#0a0a0a" strokeWidth="4" />
        <path d="M115,110 L110,173 L120,173 L117,110 Z" fill="url(#cl-popart-dots-shade)" />
        {/* bundle on a stick over the shoulder */}
        <line x1="108" y1="118" x2="84" y2="100" stroke="#0a0a0a" strokeWidth="3.5" />
        <line x1="84" y1="100" x2="66" y2="60" stroke="#0a0a0a" strokeWidth="3" />
        <circle cx="63" cy="54" r="9" fill={s.accent} stroke="#0a0a0a" strokeWidth="3" />
        {/* striding legs, front foot at the cliff edge */}
        <line x1="122" y1="172" x2="142" y2="212" stroke="#0a0a0a" strokeWidth="4" />
        <line x1="142" y1="212" x2="150" y2="210" stroke="#0a0a0a" strokeWidth="3.5" />
        <line x1="104" y1="170" x2="88" y2="216" stroke="#0a0a0a" strokeWidth="4" />
        {/* small dog at his heels */}
        <path d="M52,222 q-2,-14 10,-15 q7,-1 8,6 l0,10 q0,7 -5,7 l-8,0 q-5,0 -5,-8 Z" fill="#ffffff" stroke="#0a0a0a" strokeWidth="2.5" />
        <path d="M56,206 l-2,-8 l6,6" fill="none" stroke="#0a0a0a" strokeWidth="2" />
        <path d="M70,214 q7,-3 8,-9" fill="none" stroke="#0a0a0a" strokeWidth="2.5" />
      </g>
    </>
  );
}

const SCENES: Record<number, ComponentType<SceneProps>> = {
  1: MagicianScene,
  3: EmpressScene,
  7: ChariotScene,
  9: HermitScene,
  10: WheelScene,
  13: DeathScene,
  17: StarScene,
  22: FoolScene,
};

export default function PopArtHermitCard({
  number = 9,
  name = "THE HERMIT",
  variant = 0,
}: PopArtCardProps) {
  const v = ((Math.round(variant) % 8) + 8) % 8;
  const scheme = SCHEMES[v % 4];
  const mirror = v >= 4;
  const mirrorXf = mirror ? "translate(200 0) scale(-1 1)" : undefined;
  const Scene = SCENES[Math.round(number)] ?? HermitScene;

  // numeral caption: shrink if the numeral runs long (e.g. "XVIII.")
  const numeral = `${toRoman(number)}.`;
  const numeralFs = numeral.length > 3 ? 13 : 19;

  // name strip: fit any length into the 176px inner width (Arial Black ~0.78em caps)
  const upperName = name.toUpperCase();
  const nameLs = upperName.length > 10 ? 1 : 2.5;
  const nameFs = Math.max(
    7,
    Math.min(15, Math.floor((176 / upperName.length - nameLs) / 0.78)),
  );

  return (
    <figure
      className="cl-popart-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
      aria-label={`${name} tarot card in Roy Lichtenstein pop-art comic style`}
    >
      <style>{`
        .cl-popart-card {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          background: #ffffff;
          /* one-shot panel-slam on mount: 1.15 -> 1, hard ease-out */
          animation: cl-popart-slam 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes cl-popart-slam {
          from { transform: scale(1.15); }
          to { transform: scale(1); }
        }
        .cl-popart-card svg {
          display: block;
          width: 100%;
          height: 100%;
          transform-origin: 50% 50%;
          /* hover snap: fast overshoot transition */
          transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .cl-popart-card:hover svg { transform: scale(1.03); }
        .cl-popart-text {
          font-family: "Arial Black", Arial, Helvetica, sans-serif;
          font-weight: 900;
        }

        /* light-source core: barely-there slow pulse, texture not glow */
        @keyframes cl-popart-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.82; }
        }
        .cl-popart-star { animation: cl-popart-glow 4.8s ease-in-out infinite; }

        /* starburst POP: scale pulse once every 4s, snappy overshoot */
        .cl-popart-burst {
          transform-box: fill-box;
          transform-origin: center;
          animation: cl-popart-burst 4s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
        }
        @keyframes cl-popart-burst {
          0%, 100% { transform: scale(1); }
          5% { transform: scale(1.08); }
          10% { transform: scale(1); }
        }
        /* detached rays flick on/off in hard steps, synced with the pop */
        .cl-popart-rays {
          animation: cl-popart-rays 4s steps(1, end) infinite;
        }
        @keyframes cl-popart-rays {
          0% { opacity: 0; }
          5% { opacity: 1; }
          7% { opacity: 0; }
          9% { opacity: 1; }
          14%, 100% { opacity: 1; }
        }
        /* hover: the pop goes rapid-fire */
        .cl-popart-card:hover .cl-popart-burst,
        .cl-popart-card:hover .cl-popart-rays { animation-duration: 1.5s; }

        /* thought bubble: alive by default — dots cycle 1, 2, 3 on a 2s steps loop */
        .cl-popart-td {
          opacity: 0;
          animation: cl-popart-think 2s steps(1, end) infinite;
        }
        @keyframes cl-popart-think {
          0% { opacity: 0; }
          10%, 70% { opacity: 1; }
          80%, 100% { opacity: 0; }
        }
        .cl-popart-td-2 { animation-delay: 0.3s; }
        .cl-popart-td-3 { animation-delay: 0.6s; }

        @media (prefers-reduced-motion: reduce) {
          .cl-popart-card { animation: none; }
          .cl-popart-card svg { transition: none; }
          .cl-popart-star,
          .cl-popart-burst,
          .cl-popart-rays,
          .cl-popart-td { animation: none; }
          /* static card still shows the full '...' */
          .cl-popart-td { opacity: 1; }
        }
      `}</style>

      <svg
        viewBox="0 0 200 300"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-hidden="true"
      >
        <defs>
          {/* Ben-Day dot patterns — uniform dots, all shading is dots */}
          <pattern id="cl-popart-dots-sky" width="7" height="7" patternUnits="userSpaceOnUse">
            <circle cx="3.5" cy="3.5" r="1.7" fill={scheme.skyDot} />
          </pattern>
          <pattern id="cl-popart-dots-mountain" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.6" fill={scheme.mtnDot} />
          </pattern>
          <pattern id="cl-popart-dots-shade" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.5" fill="#0a0a0a" />
          </pattern>
          <pattern id="cl-popart-dots-skin" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill="#ffffff" />
            <circle cx="2" cy="2" r="1" fill="#e32020" />
          </pattern>
        </defs>

        {/* ---- panel frame ---- */}
        <rect x="0" y="0" width="200" height="300" fill="#ffffff" />

        {/* ---- scene (mirrored for variants 4-7) ---- */}
        <g transform={mirrorXf}>
          <Scene s={scheme} />
        </g>

        {/* ---- jagged numeral caption box, top-left (top-right when mirrored) ---- */}
        <g strokeLinejoin="round">
          <g transform={mirrorXf}>
            <polygon
              points="6,14 12,8 20,12 28,7 36,12 44,8 52,12 62,9 66,16 61,22 66,28 60,34 64,40 54,38 46,43 38,38 28,42 20,37 10,40 13,32 6,27 12,21"
              fill={scheme.accent}
              stroke="#0a0a0a"
              strokeWidth="3"
            />
          </g>
          <text
            x={mirror ? 165 : 35}
            y={numeralFs === 19 ? 32 : 31}
            textAnchor="middle"
            className="cl-popart-text"
            fontSize={numeralFs}
            fill="#0a0a0a"
          >
            {numeral}
          </text>
        </g>

        {/* ---- bottom caption strip: white bold caps on red ---- */}
        <rect x="4" y="262" width="192" height="30" fill="#e32020" stroke="#0a0a0a" strokeWidth="4" />
        <text
          x="100"
          y="283"
          textAnchor="middle"
          className="cl-popart-text"
          fontSize={nameFs}
          letterSpacing={nameLs}
          fill="#ffffff"
        >
          {upperName}
        </text>

        {/* ---- thick panel border ---- */}
        <rect x="3" y="3" width="194" height="294" fill="none" stroke="#0a0a0a" strokeWidth="6" />
      </svg>
    </figure>
  );
}
