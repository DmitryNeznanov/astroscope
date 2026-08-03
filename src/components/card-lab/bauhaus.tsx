/**
 * Card Lab — BAUHAUS
 * Geometric tarot deck in 1920s Bauhaus abstraction: every arcana drawn as
 * pure circle / semicircle / triangle / rectangle / bar compositions with
 * flat unmodulated fills — no gradients, no shadows, no ornament.
 * Defaults render The Hermit (IX); `number` selects a fully different scene.
 *
 * Signature effects (CSS-only, server-component safe):
 * 1. One-shot mount assembly — shapes fly in from different edges.
 * 2. Always-on permutation — shapes oscillate a few px on 5-9s loops.
 * 3. Color re-solve — every 8s the primaries rotate through the big shapes
 *    (and each scene's "light source" accent) in hard steps() swaps.
 * 4. Slow spin — Hermit's lantern star, the Wheel itself, the Star's star.
 * 5. Hover — Hermit shapes drift apart along the diagonal; card tilts.
 *
 * Layering: wrapper groups carry one-shot assembly transforms; the shapes
 * inside carry infinite drift/spin/fill loops, so the two never compete.
 * All rules/keyframes are scoped per-variant (cl-bauhaus-v0..v7) so a
 * gallery of variants on one page never shares colliding CSS. Generic
 * cl-bauhaus-a1..a8 / d1..d6 / accent / spin classes let every scene reuse
 * the effect system; the Hermit keeps its original bespoke rules untouched.
 */

import { toRoman } from "@/lib/roman";

const RED = "#e30613";
const YELLOW = "#f6c90e";
const BLUE = "#1e50a2";
const BLACK = "#111111";
const PAPER = "#f2ede0";

type Triple = [string, string, string];

type Palette = {
  bg: string; // card paper
  ink: string; // structural dark: grounds, frame, numeral, silhouettes
  onInk: string; // marks that sit on ink (caption, Venus, horse, water)
  star: string; // star accent — must read on red, yellow and blue
  cycle: { circle: Triple; triangle: Triple; robe: Triple };
};

const PALETTES: Palette[] = [
  // 0 — classic: red mountain, yellow light, blue robe on off-white
  {
    bg: PAPER,
    ink: BLACK,
    onInk: PAPER,
    star: BLACK,
    cycle: {
      circle: [YELLOW, RED, BLUE],
      triangle: [RED, BLUE, YELLOW],
      robe: [BLUE, YELLOW, RED],
    },
  },
  // 1 — primaries rotated: blue mountain, red light, yellow robe
  {
    bg: PAPER,
    ink: BLACK,
    onInk: PAPER,
    star: BLACK,
    cycle: {
      circle: [RED, BLUE, YELLOW],
      triangle: [BLUE, YELLOW, RED],
      robe: [YELLOW, RED, BLUE],
    },
  },
  // 2 — primaries rotated again: yellow mountain, blue light, red robe
  {
    bg: PAPER,
    ink: BLACK,
    onInk: PAPER,
    star: BLACK,
    cycle: {
      circle: [BLUE, YELLOW, RED],
      triangle: [YELLOW, RED, BLUE],
      robe: [RED, BLUE, YELLOW],
    },
  },
  // 3 — inverted paper: black ground, off-white structure, classic cycle
  {
    bg: BLACK,
    ink: PAPER,
    onInk: BLACK,
    star: BLACK,
    cycle: {
      circle: [YELLOW, RED, BLUE],
      triangle: [RED, BLUE, YELLOW],
      robe: [BLUE, YELLOW, RED],
    },
  },
];

export interface BauhausCardProps {
  number?: number;
  name?: string;
  variant?: number;
}

/** All CSS for one variant, scoped under .cl-bauhaus-v{n} so variants can
    share a page; keyframe names get the same suffix for the same reason. */
function buildStyle(v: number, p: Palette): string {
  const S = `.cl-bauhaus-v${v}`;
  const K = `cl-bauhaus-v${v}`;
  const [c0, c1, c2] = p.cycle.circle;
  const [t0, t1, t2] = p.cycle.triangle;
  const [r0, r1, r2] = p.cycle.robe;
  return `
        ${S} { display: block; line-height: 0; transition: transform 0.45s ease; }
        ${S} svg { display: block; width: 100%; height: 100%; }
        ${S} .cl-bauhaus-title {
          font-family: "Futura", "Century Gothic", "Avenir Next", Arial, Helvetica, sans-serif;
          font-weight: 900;
        }
        ${S}:hover { transform: rotate(1.5deg); }

        /* hover deconstruction: Hermit groups drift along the diagonal */
        ${S} svg * { transition: transform 0.5s ease; }
        ${S}:hover .cl-bauhaus-g-triangle { transform: translate(-5px, 4px); }
        ${S}:hover .cl-bauhaus-g-ground   { transform: translate(-4px, 2px); }
        ${S}:hover .cl-bauhaus-g-sun      { transform: translate(6px, -6px); }
        ${S}:hover .cl-bauhaus-g-star     { transform: translate(9px, -9px); }
        ${S}:hover .cl-bauhaus-g-robe     { transform: translate(2px, -2px); }
        ${S}:hover .cl-bauhaus-g-head     { transform: translate(4px, -5px); }
        ${S}:hover .cl-bauhaus-g-staff    { transform: translate(5px, 1px); }
        ${S}:hover .cl-bauhaus-g-arm      { transform: translate(5px, -4px); }

        /* assembly keyframes: only a "from" state, so hover transitions
           take over cleanly once the one-shot animation ends */
        @keyframes ${K}-in-bottom { from { transform: translate(0, 90px); opacity: 0; } }
        @keyframes ${K}-in-left   { from { transform: translate(-110px, 0); opacity: 0; } }
        @keyframes ${K}-in-right  { from { transform: translate(110px, 0); opacity: 0; } }
        @keyframes ${K}-in-top    { from { transform: translate(0, -70px); opacity: 0; } }
        @keyframes ${K}-in-tr     { from { transform: translate(80px, -80px); opacity: 0; } }
        @keyframes ${K}-in-arm    { from { transform: translate(-60px, 30px); opacity: 0; } }
        @keyframes ${K}-in-pop    { from { transform: scale(0); opacity: 0; } }
        @keyframes ${K}-in-fade   { from { opacity: 0; } }

        /* Hermit assembly (bespoke, unchanged) */
        ${S} .cl-bauhaus-g-triangle { animation: ${K}-in-bottom 0.6s ease-out 0s backwards; }
        ${S} .cl-bauhaus-g-ground   { animation: ${K}-in-left   0.6s ease-out 0.1s backwards; }
        ${S} .cl-bauhaus-g-sun      { animation: ${K}-in-tr     0.55s ease-out 0.25s backwards; }
        ${S} .cl-bauhaus-g-robe     { animation: ${K}-in-bottom 0.5s ease-out 0.4s backwards; }
        ${S} .cl-bauhaus-g-head     { animation: ${K}-in-top    0.5s ease-out 0.5s backwards; }
        ${S} .cl-bauhaus-g-staff    { animation: ${K}-in-right  0.5s ease-out 0.6s backwards; }
        ${S} .cl-bauhaus-g-arm      { animation: ${K}-in-arm    0.5s ease-out 0.65s backwards; }
        ${S} .cl-bauhaus-g-star     {
          transform-origin: 152px 66px;
          animation: ${K}-in-pop 0.45s ease-out 0.7s backwards;
        }
        ${S} .cl-bauhaus-s-numeral  { animation: ${K}-in-fade 0.6s ease-out 0.9s backwards; }
        ${S} .cl-bauhaus-s-caption  { animation: ${K}-in-fade 0.6s ease-out 1.05s backwards; }

        /* generic assembly roles for the other scenes (a1..a8) */
        ${S} .cl-bauhaus-a1 { animation: ${K}-in-bottom 0.6s ease-out 0s backwards; }
        ${S} .cl-bauhaus-a2 { animation: ${K}-in-left   0.6s ease-out 0.1s backwards; }
        ${S} .cl-bauhaus-a3 { animation: ${K}-in-tr     0.55s ease-out 0.25s backwards; }
        ${S} .cl-bauhaus-a4 { animation: ${K}-in-bottom 0.5s ease-out 0.4s backwards; }
        ${S} .cl-bauhaus-a5 { animation: ${K}-in-top    0.5s ease-out 0.5s backwards; }
        ${S} .cl-bauhaus-a6 { animation: ${K}-in-right  0.5s ease-out 0.6s backwards; }
        ${S} .cl-bauhaus-a7 { animation: ${K}-in-arm    0.5s ease-out 0.65s backwards; }
        ${S} .cl-bauhaus-a8 { animation: ${K}-in-pop    0.45s ease-out 0.7s backwards; }

        /* drift loops */
        @keyframes ${K}-drift-a { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(3px, -3px); } }
        @keyframes ${K}-drift-b { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-3px, 2px); } }
        @keyframes ${K}-drift-c { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(4px, -4px); } }
        @keyframes ${K}-drift-d { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-2px, 3px); } }
        @keyframes ${K}-drift-e { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(2px, -3px); } }
        @keyframes ${K}-drift-f { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(3px, 1px); } }
        @keyframes ${K}-drift-arm {
          0%, 100% { transform: translate(0, 0) rotate(-24deg); }
          50%      { transform: translate(2px, -2px) rotate(-24deg); }
        }

        /* generic drift roles (d1..d6) */
        ${S} .cl-bauhaus-d1 { animation: ${K}-drift-a 6.5s ease-in-out -2s infinite; }
        ${S} .cl-bauhaus-d2 { animation: ${K}-drift-b 7.5s ease-in-out -4s infinite; }
        ${S} .cl-bauhaus-d3 { animation: ${K}-drift-c 8s ease-in-out -1s infinite; }
        ${S} .cl-bauhaus-d4 { animation: ${K}-drift-d 5.5s ease-in-out -3s infinite; }
        ${S} .cl-bauhaus-d5 { animation: ${K}-drift-e 6s ease-in-out -2.5s infinite; }
        ${S} .cl-bauhaus-d6 { animation: ${K}-drift-f 9s ease-in-out -5s infinite; }

        /* Hermit drift + color re-solve (bespoke, unchanged) */
        ${S} .cl-bauhaus-s-ground { animation: ${K}-drift-b 7.5s ease-in-out -4s infinite; }
        ${S} .cl-bauhaus-s-head   { animation: ${K}-drift-e 6s ease-in-out -2.5s infinite; }
        ${S} .cl-bauhaus-s-staff  { animation: ${K}-drift-f 9s ease-in-out -5s infinite; }
        ${S} .cl-bauhaus-s-arm    {
          transform: rotate(-24deg);
          transform-origin: 103px 96px;
          animation: ${K}-drift-arm 7s ease-in-out -1.5s infinite;
        }
        @keyframes ${K}-cycle-circle {
          0% { fill: ${c0}; } 33.33% { fill: ${c1}; }
          66.66% { fill: ${c2}; } 100% { fill: ${c0}; }
        }
        @keyframes ${K}-cycle-triangle {
          0% { fill: ${t0}; } 33.33% { fill: ${t1}; }
          66.66% { fill: ${t2}; } 100% { fill: ${t0}; }
        }
        @keyframes ${K}-cycle-robe {
          0% { fill: ${r0}; } 33.33% { fill: ${r1}; }
          66.66% { fill: ${r2}; } 100% { fill: ${r0}; }
        }
        ${S} .cl-bauhaus-s-sun {
          animation:
            ${K}-drift-c 8s ease-in-out -1s infinite,
            ${K}-cycle-circle 24s steps(1, end) 1.2s backwards infinite;
        }
        ${S} .cl-bauhaus-s-triangle {
          animation:
            ${K}-drift-a 6.5s ease-in-out -2s infinite,
            ${K}-cycle-triangle 24s steps(1, end) 1.2s backwards infinite;
        }
        ${S} .cl-bauhaus-s-robe {
          animation:
            ${K}-drift-d 5.5s ease-in-out -3s infinite,
            ${K}-cycle-robe 24s steps(1, end) 1.2s backwards infinite;
        }

        /* generic accent: a scene's light source re-solves its color every
           8s and drifts gently, like the Hermit's lantern circle */
        @keyframes ${K}-cycle-generic {
          0% { fill: ${c0}; } 33.33% { fill: ${c1}; }
          66.66% { fill: ${c2}; } 100% { fill: ${c0}; }
        }
        ${S} .cl-bauhaus-accent {
          animation:
            ${K}-drift-c 8s ease-in-out -1s infinite,
            ${K}-cycle-generic 24s steps(1, end) 1.2s backwards infinite;
        }

        /* slow spins (transform-origin set inline per element) */
        @keyframes ${K}-spin { to { transform: rotate(360deg); } }
        ${S} .cl-bauhaus-spin { animation: ${K}-spin 14s linear infinite; }
        ${S} .cl-bauhaus-s-star {
          transform-origin: 152px 66px;
          animation: ${K}-spin 14s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          ${S}, ${S}:hover, ${S} svg * {
            animation: none !important;
            transition: none !important;
          }
          ${S}:hover { transform: none; }
          ${S}:hover svg * { transform: none; }
          /* keep the Hermit arm's static rotation even with motion off */
          ${S} .cl-bauhaus-s-arm { transform: rotate(-24deg); }
        }
      `;
}

type ArtProps = { p: Palette };

/** IX — canonical scene: figure deconstructed into pure geometry. */
function HermitArt({ p }: ArtProps) {
  return (
    <>
      <rect x="0" y="0" width="200" height="300" fill={p.bg} />
      <g className="cl-bauhaus-g-triangle">
        <polygon className="cl-bauhaus-s-triangle" points="28,242 138,96 200,242" fill={p.cycle.triangle[0]} />
      </g>
      <g className="cl-bauhaus-g-ground">
        <path className="cl-bauhaus-s-ground" d="M 5 296 A 95 95 0 0 0 195 296 Z" fill={p.ink} />
      </g>
      <g className="cl-bauhaus-g-sun">
        <circle className="cl-bauhaus-s-sun" cx="152" cy="66" r="42" fill={p.cycle.circle[0]} />
      </g>
      <g className="cl-bauhaus-g-robe">
        <rect className="cl-bauhaus-s-robe" x="78" y="128" width="26" height="118" fill={p.cycle.robe[0]} />
      </g>
      <g className="cl-bauhaus-g-head">
        <circle className="cl-bauhaus-s-head" cx="91" cy="116" r="12" fill={p.ink} />
      </g>
      <g className="cl-bauhaus-g-staff">
        <rect className="cl-bauhaus-s-staff" x="120" y="104" width="5" height="140" fill={p.ink} />
      </g>
      <g className="cl-bauhaus-g-arm">
        <rect className="cl-bauhaus-s-arm" x="103" y="96" width="34" height="6" fill={RED} />
      </g>
      <g className="cl-bauhaus-g-star">
        <rect className="cl-bauhaus-s-star" x="147" y="61" width="10" height="10" fill={p.star} />
      </g>
    </>
  );
}

/** I — figure at a table, arm raised to a glowing wand tip, infinity above. */
function MagicianArt({ p }: ArtProps) {
  const c0 = p.cycle.circle[0];
  return (
    <>
      <rect x="0" y="0" width="200" height="300" fill={p.bg} />
      <g className="cl-bauhaus-a2"><rect className="cl-bauhaus-d2" x="4" y="258" width="192" height="38" fill={p.ink} /></g>
      {/* infinity = two ring circles */}
      <g className="cl-bauhaus-a3">
        <g className="cl-bauhaus-d3">
          <circle cx="88" cy="42" r="10" fill="none" stroke={p.ink} strokeWidth="3" />
          <circle cx="112" cy="42" r="10" fill="none" stroke={p.ink} strokeWidth="3" />
        </g>
      </g>
      <g className="cl-bauhaus-a1"><rect className="cl-bauhaus-d1" x="86" y="112" width="28" height="92" fill={BLUE} /></g>
      <g className="cl-bauhaus-a5"><circle className="cl-bauhaus-d5" cx="100" cy="98" r="12" fill={p.ink} /></g>
      {/* raised arm + wand */}
      <g className="cl-bauhaus-a7">
        <rect x="110" y="114" width="44" height="6" fill={RED} transform="rotate(-38 110 114)" />
        <rect x="148" y="62" width="4" height="30" fill={p.ink} />
        <rect x="58" y="124" width="30" height="6" fill={RED} transform="rotate(30 58 124)" />
      </g>
      {/* wand tip light — accent */}
      <g className="cl-bauhaus-a8" style={{ transformOrigin: "152px 56px" }}>
        <circle className="cl-bauhaus-accent" cx="152" cy="56" r="7" fill={c0} />
      </g>
      {/* table with four suit symbols: cup, sword, pentacle, wand */}
      <g className="cl-bauhaus-a4">
        <g className="cl-bauhaus-d4">
          <rect x="30" y="198" width="140" height="8" fill={p.ink} />
          <rect x="38" y="206" width="5" height="52" fill={p.ink} />
          <rect x="157" y="206" width="5" height="52" fill={p.ink} />
          <path d="M 42 188 A 8 8 0 0 1 58 188 Z" fill={BLUE} />
          <polygon points="76,196 84,180 92,196" fill={p.ink} />
          <circle cx="116" cy="188" r="8" fill={YELLOW} />
          <rect x="140" y="180" width="5" height="16" fill={RED} />
        </g>
      </g>
    </>
  );
}

/** III — crowned figure, Venus shield, wheat on a lush dome. */
function EmpressArt({ p }: ArtProps) {
  const c0 = p.cycle.circle[0];
  return (
    <>
      <rect x="0" y="0" width="200" height="300" fill={p.bg} />
      <g className="cl-bauhaus-a2"><path className="cl-bauhaus-d2" d="M 5 296 A 95 95 0 0 0 195 296 Z" fill={p.ink} /></g>
      <g className="cl-bauhaus-a1"><polygon className="cl-bauhaus-d1" points="72,118 128,118 152,252 48,252" fill={BLUE} /></g>
      <g className="cl-bauhaus-a5"><circle className="cl-bauhaus-d5" cx="100" cy="102" r="12" fill={p.ink} /></g>
      {/* zigzag crown */}
      <g className="cl-bauhaus-a3"><polygon points="84,94 90,80 96,92 100,78 104,92 110,80 116,94" fill={YELLOW} /></g>
      {/* crown star — accent */}
      <g className="cl-bauhaus-a8" style={{ transformOrigin: "100px 66px" }}>
        <g className="cl-bauhaus-accent" fill={c0}>
          <rect x="94" y="60" width="12" height="12" />
          <rect x="94" y="60" width="12" height="12" transform="rotate(45 100 66)" />
        </g>
      </g>
      {/* round shield with Venus symbol */}
      <g className="cl-bauhaus-a6">
        <g className="cl-bauhaus-d6">
          <circle cx="52" cy="172" r="22" fill={RED} />
          <circle cx="52" cy="166" r="8" fill="none" stroke={p.onInk} strokeWidth="3" />
          <rect x="50.5" y="176" width="3" height="12" fill={p.onInk} />
          <rect x="46" y="180" width="12" height="3" fill={p.onInk} />
        </g>
      </g>
      {/* wheat: tilted bars with triangle ears */}
      <g className="cl-bauhaus-a7">
        {[38, 58, 142, 162].map((x, i) => (
          <g key={x} transform={`rotate(${i % 2 ? 14 : -14} ${x} 244)`}>
            <rect x={x - 2} y="224" width="4" height="26" fill={YELLOW} />
            <polygon points={`${x - 5},224 ${x + 5},224 ${x},214`} fill={YELLOW} />
          </g>
        ))}
      </g>
    </>
  );
}

/** VII — boxy chariot under a starred canopy, two sphinxes, city wall. */
function ChariotArt({ p }: ArtProps) {
  const c0 = p.cycle.circle[0];
  return (
    <>
      <rect x="0" y="0" width="200" height="300" fill={p.bg} />
      {/* city wall with crenellations */}
      <g className="cl-bauhaus-a3">
        <rect x="20" y="62" width="160" height="10" fill={p.ink} />
        {[28, 60, 92, 124, 156].map((x) => (
          <rect key={x} x={x} y="52" width="10" height="10" fill={p.ink} />
        ))}
      </g>
      {/* canopy on posts */}
      <g className="cl-bauhaus-a5">
        <rect x="55" y="90" width="90" height="12" fill={BLUE} />
        <rect x="60" y="102" width="4" height="42" fill={p.ink} />
        <rect x="136" y="102" width="4" height="42" fill={p.ink} />
      </g>
      {/* canopy star — accent */}
      <g className="cl-bauhaus-a8" style={{ transformOrigin: "100px 96px" }}>
        <g className="cl-bauhaus-accent" fill={c0}>
          <rect x="94" y="90" width="12" height="12" transform="rotate(45 100 96)" />
        </g>
      </g>
      {/* charioteer */}
      <g className="cl-bauhaus-a4">
        <circle cx="100" cy="112" r="10" fill={p.ink} />
        <rect x="88" y="124" width="24" height="22" fill={BLUE} />
      </g>
      <g className="cl-bauhaus-a1"><rect className="cl-bauhaus-d1" x="58" y="144" width="84" height="54" fill={RED} /></g>
      <g className="cl-bauhaus-a2"><rect className="cl-bauhaus-d2" x="4" y="222" width="192" height="74" fill={p.ink} /></g>
      <g className="cl-bauhaus-a6">
        <circle cx="80" cy="210" r="12" fill={p.ink} />
        <circle cx="120" cy="210" r="12" fill={p.ink} />
      </g>
      {/* two sphinxes facing outward */}
      <g className="cl-bauhaus-a7">
        <polygon points="26,232 54,232 54,208" fill={BLUE} />
        <circle cx="54" cy="204" r="6" fill={YELLOW} />
        <polygon points="174,232 146,232 146,208" fill={YELLOW} />
        <circle cx="146" cy="204" r="6" fill={BLUE} />
      </g>
    </>
  );
}

/** X — spoked wheel spinning forever, sphinx on top, creatures on sides. */
function WheelArt({ p }: ArtProps) {
  const c0 = p.cycle.circle[0];
  return (
    <>
      <rect x="0" y="0" width="200" height="300" fill={p.bg} />
      <g className="cl-bauhaus-a2"><path className="cl-bauhaus-d2" d="M 5 296 A 95 95 0 0 0 195 296 Z" fill={p.ink} /></g>
      {/* sphinx on top */}
      <g className="cl-bauhaus-a3">
        <polygon points="86,72 114,72 100,52" fill={p.ink} />
        <circle cx="100" cy="48" r="6" fill={RED} />
      </g>
      {/* the wheel: rim, cross spokes, four rim diamonds; hub is the accent */}
      <g className="cl-bauhaus-a8" style={{ transformOrigin: "100px 150px" }}>
        <g className="cl-bauhaus-spin" style={{ transformOrigin: "100px 150px" }}>
          <circle cx="100" cy="150" r="62" fill="none" stroke={p.ink} strokeWidth="6" />
          <rect x="96" y="92" width="8" height="116" fill={p.ink} />
          <rect x="42" y="146" width="116" height="8" fill={p.ink} />
          {[0, 90, 180, 270].map((a, i) => (
            <rect
              key={a}
              x="94"
              y="82"
              width="12"
              height="12"
              fill={[YELLOW, RED, BLUE, p.onInk][i]}
              transform={`rotate(${a} 100 150) rotate(45 100 88)`}
            />
          ))}
        </g>
        <circle className="cl-bauhaus-accent" cx="100" cy="150" r="10" fill={c0} />
      </g>
      {/* snake left, creature right */}
      <g className="cl-bauhaus-a6">
        <polyline points="28,108 20,128 32,148 22,168" fill="none" stroke={RED} strokeWidth="5" />
        <circle cx="22" cy="174" r="5" fill={RED} />
      </g>
      <g className="cl-bauhaus-a7">
        <polyline points="172,108 180,128 168,148 178,168" fill="none" stroke={BLUE} strokeWidth="5" />
        <circle cx="178" cy="174" r="5" fill={BLUE} />
      </g>
    </>
  );
}

/** XIII — skeletal rider with a dark banner, sun rising between towers. */
function DeathArt({ p }: ArtProps) {
  const c0 = p.cycle.circle[0];
  return (
    <>
      <rect x="0" y="0" width="200" height="300" fill={p.bg} />
      <g className="cl-bauhaus-a2"><rect className="cl-bauhaus-d2" x="4" y="214" width="192" height="82" fill={p.ink} /></g>
      {/* two towers on the horizon */}
      <g className="cl-bauhaus-a3">
        <rect x="56" y="150" width="18" height="64" fill={p.ink} />
        <rect x="126" y="150" width="18" height="64" fill={p.ink} />
      </g>
      {/* sun rising between them — accent */}
      <g className="cl-bauhaus-a8" style={{ transformOrigin: "100px 214px" }}>
        <path className="cl-bauhaus-accent" d="M 76 214 A 24 24 0 0 0 124 214 Z" fill={c0} />
      </g>
      {/* horse (light on dark ground) + skeletal rider (dark bones) */}
      <g className="cl-bauhaus-a6">
        <g className="cl-bauhaus-d6">
          <rect x="52" y="222" width="64" height="18" fill={p.onInk} />
          <rect x="42" y="206" width="9" height="24" fill={p.onInk} />
          <rect x="34" y="200" width="18" height="9" fill={p.onInk} />
          {[58, 72, 92, 106].map((x) => (
            <rect key={x} x={x} y="240" width="5" height="24" fill={p.onInk} />
          ))}
          <polygon points="116,222 130,214 118,234" fill={p.onInk} />
          <circle cx="96" cy="176" r="9" fill={p.ink} />
          <rect x="90" y="186" width="12" height="36" fill={p.ink} />
          <rect x="90" y="192" width="12" height="2.5" fill={p.onInk} />
          <rect x="90" y="200" width="12" height="2.5" fill={p.onInk} />
        </g>
      </g>
      {/* dark banner with a pale rose; rose heart is the accent */}
      <g className="cl-bauhaus-a7">
        <rect x="136" y="150" width="4" height="76" fill={p.ink} />
        <rect x="140" y="150" width="42" height="28" fill={p.ink} />
        <circle cx="161" cy="164" r="8" fill={p.onInk} />
      </g>
      <g className="cl-bauhaus-a8" style={{ transformOrigin: "161px 164px" }}>
        <circle className="cl-bauhaus-accent" cx="161" cy="164" r="3.5" fill={c0} />
      </g>
    </>
  );
}

/** XVII — kneeling figure pouring from two jugs under a spinning star. */
function StarArt({ p }: ArtProps) {
  const c0 = p.cycle.circle[0];
  return (
    <>
      <rect x="0" y="0" width="200" height="300" fill={p.bg} />
      <g className="cl-bauhaus-a2"><rect className="cl-bauhaus-d2" x="4" y="238" width="192" height="58" fill={p.ink} /></g>
      <ellipse cx="152" cy="240" rx="30" ry="9" fill={BLUE} />
      {/* seven small stars */}
      <g className="cl-bauhaus-a3" fill={YELLOW}>
        {[[40, 42], [162, 38], [52, 92], [152, 96], [28, 134], [174, 132], [100, 18]].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x - 3} y={y - 3} width="6" height="6" />
        ))}
      </g>
      {/* the big 8-point star — spins forever */}
      <g className="cl-bauhaus-a8" style={{ transformOrigin: "100px 64px" }}>
        <g className="cl-bauhaus-spin" style={{ transformOrigin: "100px 64px" }} fill={c0}>
          <rect x="86" y="50" width="28" height="28" />
          <rect x="86" y="50" width="28" height="28" transform="rotate(45 100 64)" />
        </g>
      </g>
      {/* kneeling figure */}
      <g className="cl-bauhaus-a1">
        <g className="cl-bauhaus-d1">
          <circle cx="86" cy="150" r="10" fill={p.ink} />
          <rect x="78" y="160" width="18" height="46" fill={BLUE} transform="rotate(-14 87 183)" />
          <rect x="70" y="200" width="14" height="14" fill={BLUE} />
          <rect x="86" y="206" width="28" height="9" fill={BLUE} />
        </g>
      </g>
      {/* two jugs, two water streams: one to land, one to the pool */}
      <g className="cl-bauhaus-a7">
        <circle cx="66" cy="184" r="7" fill={RED} />
        <rect x="61" y="190" width="4" height="44" fill={BLUE} transform="rotate(7 63 212)" />
        <circle cx="112" cy="180" r="7" fill={YELLOW} />
        <rect x="114" y="186" width="4" height="48" fill={BLUE} transform="rotate(-14 116 210)" />
      </g>
    </>
  );
}

/** XXII — figure stepping toward a cliff edge, dog at heels, sun behind. */
function FoolArt({ p }: ArtProps) {
  const c0 = p.cycle.circle[0];
  return (
    <>
      <rect x="0" y="0" width="200" height="300" fill={p.bg} />
      {/* cliff: plateau, then the edge falls away */}
      <g className="cl-bauhaus-a2"><polygon className="cl-bauhaus-d2" points="4,236 146,236 196,296 4,296" fill={p.ink} /></g>
      {/* sun behind — accent */}
      <g className="cl-bauhaus-a3">
        <circle className="cl-bauhaus-accent" cx="142" cy="68" r="38" fill={c0} />
      </g>
      {/* figure in profile, head up, one leg over the edge */}
      <g className="cl-bauhaus-a1">
        <g className="cl-bauhaus-d1">
          <rect x="104" y="148" width="22" height="82" fill={BLUE} transform="rotate(4 115 189)" />
          <circle cx="118" cy="134" r="11" fill={p.ink} />
          <rect x="120" y="224" width="28" height="8" fill={BLUE} transform="rotate(-10 120 228)" />
          <rect x="96" y="226" width="20" height="8" fill={BLUE} />
        </g>
      </g>
      {/* bundle on a stick over the shoulder */}
      <g className="cl-bauhaus-a7">
        <rect x="84" y="116" width="4" height="52" fill={p.ink} transform="rotate(28 86 142)" />
        <circle cx="98" cy="118" r="9" fill={YELLOW} />
      </g>
      {/* small dog at the heels */}
      <g className="cl-bauhaus-a6">
        <g className="cl-bauhaus-d6">
          <rect x="64" y="222" width="18" height="9" fill={RED} />
          <circle cx="86" cy="220" r="5" fill={RED} />
          <rect x="60" y="216" width="3" height="10" fill={RED} transform="rotate(-25 61 226)" />
        </g>
      </g>
    </>
  );
}

function artworkFor(n: number, p: Palette) {
  switch (n) {
    case 1:
      return <MagicianArt p={p} />;
    case 3:
      return <EmpressArt p={p} />;
    case 7:
      return <ChariotArt p={p} />;
    case 10:
      return <WheelArt p={p} />;
    case 13:
      return <DeathArt p={p} />;
    case 17:
      return <StarArt p={p} />;
    case 22:
      return <FoolArt p={p} />;
    default:
      return <HermitArt p={p} />;
  }
}

export default function BauhausCard({
  number = 9,
  name = "THE HERMIT",
  variant = 0,
}: BauhausCardProps) {
  const v = ((Math.round(variant) % 8) + 8) % 8;
  const mirror = v % 2 === 1;
  const p = PALETTES[v >> 1];
  const numeral = toRoman(number);

  // Long captions are squeezed to the ground's width; the default caption
  // keeps its natural letterspaced rendering untouched. Long numerals
  // (e.g. XVIII) are squeezed into the ring.
  const captionFit =
    name.length > 10
      ? { textLength: 164, lengthAdjust: "spacingAndGlyphs" as const }
      : {};
  const numeralFit =
    numeral.length > 2
      ? { textLength: 34, lengthAdjust: "spacingAndGlyphs" as const }
      : {};

  return (
    <figure
      className={`cl-bauhaus-card cl-bauhaus-v${v}`}
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
    >
      <style>{buildStyle(v, p)}</style>

      <svg
        viewBox="0 0 200 300"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={`Bauhaus geometric tarot card: ${name}, number ${number}`}
      >
        {/* Artwork (mirrored horizontally for odd variants) */}
        <g transform={mirror ? "translate(200 0) scale(-1 1)" : undefined}>
          {artworkFor(number, p)}
        </g>

        {/* Numeral — bold numeral inside a ring (flips corner when mirrored) */}
        <g className="cl-bauhaus-s-numeral">
          <circle
            cx={mirror ? 166 : 34}
            cy="40"
            r="22"
            fill="none"
            stroke={p.ink}
            strokeWidth="3"
          />
          <text
            x={mirror ? 166 : 34}
            y="49"
            textAnchor="middle"
            className="cl-bauhaus-title"
            fontSize="24"
            fill={p.ink}
            {...numeralFit}
          >
            {numeral}
          </text>
        </g>

        {/* Caption — heavy letterspaced caps on the dark ground */}
        <text
          x="100"
          y="286"
          textAnchor="middle"
          className="cl-bauhaus-title cl-bauhaus-s-caption"
          fontSize="15"
          letterSpacing="6"
          fill={p.onInk}
          {...captionFit}
        >
          {name}
        </text>

        {/* Thin frame */}
        <rect
          x="4"
          y="4"
          width="192"
          height="292"
          fill="none"
          stroke={p.ink}
          strokeWidth="2"
        />
      </svg>
    </figure>
  );
}
