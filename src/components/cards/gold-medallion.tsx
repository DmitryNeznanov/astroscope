// GOLD MEDALLION — struck gold coin on deep black velvet.
// Default (no props): The Hermit (IX). Optional props select other arcana,
// each struck in the same low numismatic relief: layered gold gradient
// masses lit from the upper-left, shadow copies down-right, no outlines.
// Reeded edge, beaded raised rim, circular Latin inscription in raised caps
// with star stops, one bright gleam accent per scene. Load: the coin strikes
// (press scale 1.04→1 with a flash sweeping the relief), legend fades in
// after. Ambient: a very slow gleam rotates across the relief, the accent
// gleam pulses gently. Server-component safe: no hooks, no client directive.

import type { ReactNode } from "react";

const CX = 150;
const CY = 196;
const COIN_R = 116;

const SHADOW = "#6b4c10";
const RECESS = "#4a330a";
const BRIGHT = "#f1d47c";
const BEAD = "#efd27a";

const REEDS = Array.from({ length: 100 }, (_, i) => i * 3.6);
const BEADS = Array.from({ length: 64 }, (_, i) => {
  const a = (i * (360 / 64) * Math.PI) / 180;
  return { x: CX + 97 * Math.cos(a), y: CY + 97 * Math.sin(a) };
});
const SPOKES = Array.from({ length: 8 }, (_, i) => {
  const a = (i * 45 * Math.PI) / 180;
  return {
    x1: CX + 16 * Math.cos(a),
    y1: CY + 16 * Math.sin(a),
    x2: CX + 42 * Math.cos(a),
    y2: CY + 42 * Math.sin(a),
  };
});

const GLEAM_STAR =
  "M0 -7 L1.6 -1.6 L7 0 L1.6 1.6 L0 7 L-1.6 1.6 L-7 0 L-1.6 -1.6 Z";

// Hermit silhouette — hood, shoulders, flared robe (low-relief mass).
const HERMIT_BODY =
  "M150 137 C163 141 170 153 169 168 C176 182 181 210 184 250 " +
  "C172 256 128 256 116 250 C119 210 124 182 131 168 C130 153 137 141 150 137 Z";
const HERMIT_STAFF = "M183 166 L179 256";

/* Relief pair: dark gold shadow copy offset down-right, gradient mass on
   top. `w` switches from filled path to stroked path (round caps). */
function Relief({ d, w }: { d: string; w?: number }) {
  return w ? (
    <>
      <path
        d={d}
        stroke={SHADOW}
        strokeWidth={w}
        strokeLinecap="round"
        fill="none"
        transform="translate(1.2 1.8)"
      />
      <path
        d={d}
        stroke="url(#czm-relief)"
        strokeWidth={w}
        strokeLinecap="round"
        fill="none"
      />
    </>
  ) : (
    <>
      <path d={d} fill={SHADOW} transform="translate(1.4 2)" />
      <path d={d} fill="url(#czm-relief)" />
    </>
  );
}

/* ------------------------- scene artwork ------------------------- */

function hermitScene(v: number) {
  return {
    art: (
      <>
        <Relief d={HERMIT_BODY} />
        <Relief d={HERMIT_STAFF} w={3.4} />
        <circle cx="183" cy="164" r="3" fill={BRIGHT} />
        {/* hood recess — face lost in shadow */}
        <ellipse cx="150" cy="170" rx="11" ry="9" fill={RECESS} />
        <path
          d="M141 174 A 11 9 0 0 0 159 176"
          stroke="#8a6418"
          strokeWidth="1"
          fill="none"
          opacity=".7"
        />
        {/* robe fold highlights (light from upper-left) */}
        <path
          d="M136 178 C133 200 130 226 128 246"
          stroke="#f6dd8d"
          strokeWidth="1.1"
          fill="none"
          opacity=".55"
        />
        <path
          d="M147 180 C146 205 145 228 144 248"
          stroke="#f6dd8d"
          strokeWidth=".9"
          fill="none"
          opacity=".4"
        />
        {/* raised lantern, upper-left */}
        <g transform="translate(1 1.6)" fill={SHADOW}>
          <path d="M118 148 L131 148 L131 163 L118 163 Z" />
          <path d="M118 148 A 6.5 5 0 0 1 131 148 Z" />
        </g>
        <g>
          <path d="M118 148 L131 148 L131 163 L118 163 Z" fill="url(#czm-relief)" />
          <path d="M118 148 A 6.5 5 0 0 1 131 148 Z" fill={BRIGHT} />
          <circle cx="124.5" cy="144" r="2.2" fill="none" stroke="#e8c96a" strokeWidth="1.2" />
          <rect x="122" y="151" width="5" height="9" fill="#fff3c4" opacity=".85" />
        </g>
      </>
    ),
    accent: (
      <g
        className="cz-medal-lantern"
        style={{ animationDuration: `${15 + v * 0.5}s` }}
        transform="translate(124.5 155.5)"
      >
        <path d={GLEAM_STAR} fill="#fff8dd" />
      </g>
    ),
  };
}

function magicianScene(v: number) {
  const loopA = "M146 148 m-5.5 0 a5.5 5.5 0 1 0 11 0 a5.5 5.5 0 1 0 -11 0";
  const loopB = "M159 148 m-5.5 0 a5.5 5.5 0 1 0 11 0 a5.5 5.5 0 1 0 -11 0";
  return {
    art: (
      <>
        {/* standing figure, arm raised with wand */}
        <Relief d="M150 156 C158 158 161 166 160 174 L163 250 C154 254 146 254 137 250 L140 174 C139 166 142 158 150 156 Z" />
        <ellipse cx="150" cy="167" rx="7" ry="6" fill={RECESS} />
        <Relief d="M158 178 C164 170 168 160 170 150" w={3} />
        <Relief d="M169 152 L176 133" w={2} />
        <circle cx="176" cy="132" r="1.8" fill={BRIGHT} />
        {/* table with tools */}
        <Relief d="M116 216 L184 216" w={4} />
        <Relief d="M124 218 L124 232 M176 218 L176 232" w={2} />
        <Relief d="M128 212 A 4 3 0 0 0 136 212 Z" />
        <circle cx="150" cy="210" r="3" fill="none" stroke={SHADOW} strokeWidth="1.4" transform="translate(.8 1.1)" />
        <circle cx="150" cy="210" r="3" fill="none" stroke={BRIGHT} strokeWidth="1.4" />
        <Relief d="M164 212 L173 207" w={1.6} />
      </>
    ),
    accent: (
      <g className="cz-medal-lantern" style={{ animationDuration: `${15 + v * 0.5}s` }}>
        <path d={loopA} stroke="#fff8dd" strokeWidth="1.6" fill="none" />
        <path d={loopB} stroke="#fff8dd" strokeWidth="1.6" fill="none" />
      </g>
    ),
  };
}

function empressScene(v: number) {
  return {
    art: (
      <>
        {/* crown */}
        <Relief d="M138 158 L142 147 L146.5 154 L150 145 L153.5 154 L158 147 L162 158 Z" />
        {/* seated gown */}
        <Relief d="M150 156 C160 159 163 168 161 178 C172 200 178 228 180 250 C160 257 140 257 120 250 C122 228 128 200 139 178 C137 168 140 159 150 156 Z" />
        <ellipse cx="150" cy="168" rx="7.5" ry="6.5" fill={RECESS} />
        {/* wheat stalks, lower-left */}
        <Relief d="M124 252 C121 240 118 230 119 218" w={1.4} />
        <Relief d="M130 252 C128 242 126 234 127 224" w={1.4} />
        <Relief d="M136 252 C135 244 134 238 135 230" w={1.4} />
        <circle cx="119" cy="216" r="1.5" fill={BRIGHT} />
        <circle cx="127" cy="222" r="1.5" fill={BRIGHT} />
        <circle cx="135" cy="228" r="1.5" fill={BRIGHT} />
      </>
    ),
    accent: (
      <g
        className="cz-medal-lantern"
        style={{ animationDuration: `${15 + v * 0.5}s` }}
      >
        {/* heart */}
        <path
          d="M170 204 C168 200 162 200 162 205 C162 210 170 215 170 215 C170 215 178 210 178 205 C178 200 172 200 170 204 Z"
          fill={SHADOW}
          transform="translate(1 1.4)"
        />
        <path
          d="M170 204 C168 200 162 200 162 205 C162 210 170 215 170 215 C170 215 178 210 178 205 C178 200 172 200 170 204 Z"
          fill="#fff8dd"
        />
      </g>
    ),
  };
}

function chariotScene(v: number) {
  const sphinx =
    "M112 252 L112 244 C112 238 117 235 122 237 L124 231 L130 231 L130 240 C136 241 140 246 140 252 Z";
  return {
    art: (
      <>
        {/* canopy */}
        <Relief d="M114 174 A 42 36 0 0 1 186 174" w={3} />
        <Relief d="M118 174 L118 212 M182 174 L182 212" w={2.5} />
        {/* charioteer */}
        <Relief d="M150 178 C157 179 160 186 159 194 L158 214 L142 214 L141 194 C140 186 143 179 150 178 Z" />
        <circle cx="151.2" cy="171.4" r="6" fill={SHADOW} />
        <circle cx="150" cy="170" r="6" fill="url(#czm-relief)" />
        {/* chariot box + wheel */}
        <Relief d="M130 214 L170 214 L166 236 L134 236 Z" />
        <circle cx="151.1" cy="241.2" r="8" fill="none" stroke={SHADOW} strokeWidth="2.5" />
        <circle cx="150" cy="240" r="8" fill="none" stroke="url(#czm-relief)" strokeWidth="2.5" />
        <circle cx="150" cy="240" r="2" fill={BRIGHT} />
        {/* sphinxes */}
        <Relief d={sphinx} />
        <g transform="matrix(-1 0 0 1 300 0)">
          <Relief d={sphinx} />
        </g>
      </>
    ),
    accent: (
      <g
        className="cz-medal-lantern"
        style={{ animationDuration: `${15 + v * 0.5}s` }}
        transform="translate(150 139)"
      >
        <path d={GLEAM_STAR} fill="#fff8dd" />
      </g>
    ),
  };
}

function wheelScene(v: number) {
  return {
    art: (
      <>
        {/* rim + inner ring */}
        <circle cx={CX + 1.2} cy={CY + 1.6} r="46" fill="none" stroke={SHADOW} strokeWidth="7" />
        <circle cx={CX} cy={CY} r="46" fill="none" stroke="url(#czm-relief)" strokeWidth="7" />
        <circle cx={CX + 1} cy={CY + 1.4} r="18" fill="none" stroke={SHADOW} strokeWidth="4" />
        <circle cx={CX} cy={CY} r="18" fill="none" stroke="url(#czm-relief)" strokeWidth="4" />
        {/* spokes */}
        {SPOKES.map((s, i) => (
          <g key={i}>
            <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={SHADOW} strokeWidth="2.5" transform="translate(1 1.4)" />
            <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="url(#czm-relief)" strokeWidth="2.5" />
          </g>
        ))}
        {/* rim studs */}
        {SPOKES.map((s, i) => (
          <circle key={i} cx={CX + 46 * Math.cos((i * 45 * Math.PI) / 180)} cy={CY + 46 * Math.sin((i * 45 * Math.PI) / 180)} r="2" fill={BRIGHT} />
        ))}
      </>
    ),
    accent: (
      <g
        className="cz-medal-lantern"
        style={{ animationDuration: `${15 + v * 0.5}s` }}
        transform="translate(150 196)"
      >
        <circle r="6" fill={SHADOW} transform="translate(.9 1.2)" />
        <circle r="6" fill={BRIGHT} />
        <path d={GLEAM_STAR} transform="scale(.7)" fill="#fff8dd" />
      </g>
    ),
  };
}

function deathScene(v: number) {
  return {
    art: (
      <>
        {/* horse */}
        <ellipse cx="147.2" cy="225.6" rx="27" ry="12" fill={SHADOW} />
        <ellipse cx="146" cy="224" rx="27" ry="12" fill="url(#czm-relief)" />
        <Relief d="M164 216 C172 206 178 196 184 186 L191 189 C186 200 181 211 174 221 Z" />
        <Relief d="M128 232 L124 252 M140 234 L138 252 M156 234 L158 252 M168 230 L174 250" w={2.5} />
        {/* rider */}
        <Relief d="M146 196 C152 197 154 202 153 208 L152 218 L140 218 L139 208 C138 202 140 197 146 196 Z" />
        <circle cx="146.9" cy="190" r="4.5" fill={SHADOW} />
        <circle cx="146" cy="189" r="4.5" fill={BRIGHT} />
        <circle cx="144.2" cy="188.2" r=".9" fill={RECESS} />
        <circle cx="147.8" cy="188.2" r=".9" fill={RECESS} />
        {/* banner on pole */}
        <Relief d="M156 214 L156 150" w={2} />
        <Relief d="M156 150 L180 150 L180 168 L156 168 Z" />
      </>
    ),
    accent: (
      <g
        className="cz-medal-lantern"
        style={{ animationDuration: `${15 + v * 0.5}s` }}
        transform="translate(168 159) scale(.9)"
      >
        <path d={GLEAM_STAR} fill="#fff8dd" />
      </g>
    ),
  };
}

function starScene(v: number) {
  return {
    art: (
      <>
        {/* kneeling figure */}
        <Relief d="M150 192 C157 194 159 201 157 208 C162 218 166 234 168 250 C156 255 138 255 126 250 C130 238 136 226 142 216 C140 206 142 196 150 192 Z" />
        <circle cx="149" cy="187.2" r="5.5" fill={SHADOW} />
        <circle cx="148" cy="186" r="5.5" fill="url(#czm-relief)" />
        {/* two jugs */}
        <g transform="translate(126 224)">
          <path d="M-5 4 A 5.5 5.5 0 1 1 5 4 L2.5 -3 L-2.5 -3 Z" fill={SHADOW} transform="translate(.9 1.3)" />
          <path d="M-5 4 A 5.5 5.5 0 1 1 5 4 L2.5 -3 L-2.5 -3 Z" fill="url(#czm-relief)" />
        </g>
        <g transform="translate(174 224) scale(-1 1)">
          <path d="M-5 4 A 5.5 5.5 0 1 1 5 4 L2.5 -3 L-2.5 -3 Z" fill={SHADOW} transform="translate(.9 1.3)" />
          <path d="M-5 4 A 5.5 5.5 0 1 1 5 4 L2.5 -3 L-2.5 -3 Z" fill="url(#czm-relief)" />
        </g>
        {/* poured streams */}
        <Relief d="M120 226 C116 232 114 240 114 248" w={1.2} />
        <Relief d="M180 226 C184 232 186 240 186 248" w={1.2} />
      </>
    ),
    accent: (
      <g
        className="cz-medal-lantern"
        style={{ animationDuration: `${15 + v * 0.5}s` }}
        transform="translate(150 146)"
      >
        <g transform="translate(1.2 1.7)" fill={SHADOW}>
          <path d={GLEAM_STAR} transform="scale(2.4)" />
          <path d={GLEAM_STAR} transform="rotate(45) scale(1.5)" />
        </g>
        <g fill="#fff8dd">
          <path d={GLEAM_STAR} transform="scale(2.4)" />
          <path d={GLEAM_STAR} transform="rotate(45) scale(1.5)" />
        </g>
      </g>
    ),
  };
}

function foolScene(v: number) {
  return {
    art: (
      <>
        {/* cliff edge */}
        <Relief d="M128 252 L198 252 L198 232 L186 236 L178 226 L166 238 L150 246 L136 248 Z" />
        {/* figure stepping off */}
        <Relief d="M136 174 C143 176 145 182 144 189 L147 214 L142 246 L133 246 L135 214 L129 192 C128 183 130 176 136 174 Z" />
        <circle cx="136.9" cy="168.2" r="5.5" fill={SHADOW} />
        <circle cx="136" cy="167" r="5.5" fill="url(#czm-relief)" />
        {/* staff over shoulder with bundle */}
        <Relief d="M124 196 L152 166" w={2} />
        <circle cx="155" cy="165" r="4.5" fill={SHADOW} />
        <circle cx="154" cy="164" r="4.5" fill={BRIGHT} />
        {/* little dog */}
        <Relief d="M104 250 L104 242 L120 242 L120 250 L116 250 L116 245 L108 245 L108 250 Z" />
        <circle cx="121.8" cy="238.9" r="3" fill={SHADOW} />
        <circle cx="121" cy="238" r="3" fill="url(#czm-relief)" />
        <Relief d="M104 243 L100 237" w={1.5} />
      </>
    ),
    accent: (
      <g
        className="cz-medal-lantern"
        style={{ animationDuration: `${15 + v * 0.5}s` }}
        transform="translate(166 150) scale(1.3)"
      >
        <path d={GLEAM_STAR} fill={SHADOW} transform="translate(.9 1.3)" />
        <path d={GLEAM_STAR} fill="#fff8dd" />
      </g>
    ),
  };
}

/* ------------------------- scene registry ------------------------- */

type SceneFn = (v: number) => { art: ReactNode; accent: ReactNode };

const SCENES: Record<number, { numeral: string; inscription: string; scene: SceneFn }> = {
  1: { numeral: "I", inscription: "★ MAGVS ★ VOLVNTAS ★", scene: magicianScene },
  3: { numeral: "III", inscription: "★ IMPERATRIX ★ AMOR ★", scene: empressScene },
  7: { numeral: "VII", inscription: "★ CVRRVS ★ VICTORIA ★", scene: chariotScene },
  9: { numeral: "IX", inscription: "★ EREMITA ★ LVCEM ★ FERT ★", scene: hermitScene },
  10: { numeral: "X", inscription: "★ FORTVNA ★ ROTA ★", scene: wheelScene },
  13: { numeral: "XIII", inscription: "★ MORS ★ TRANSITVS ★", scene: deathScene },
  17: { numeral: "XVII", inscription: "★ STELLA ★ SPES ★", scene: starScene },
  22: { numeral: "XXII", inscription: "★ FATVVS ★ VIA ★", scene: foolScene },
};
const FALLBACK = SCENES[9]!;

export default function GoldMedallionHermitCard({
  number = 9,
  name = "THE HERMIT",
  variant = 0,
}: {
  number?: number;
  name?: string;
  variant?: number;
} = {}) {
  const v = Math.min(7, Math.max(0, Math.round(variant)));
  const { numeral, inscription, scene } = SCENES[number] ?? FALLBACK;
  const { art, accent } = scene(v);
  const isDefault = number === 9 && name === "THE HERMIT" && v === 0;

  const title = name.toUpperCase();
  const nameSize = title.length > 14 ? 12.5 : title.length > 10 ? 14.5 : 17;
  const nameTrack = title.length > 14 ? 3 : title.length > 10 ? 4.5 : 6;
  const beadFill = (i: number) =>
    v % 2 === 1 ? (i % 2 ? "#f3d884" : "#dfc06a") : BEAD;

  return (
    <figure
      className="cz-medal-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
    >
      <style>{`
        .cz-medal-card { position: relative; overflow: hidden; background: #060504; }
        .cz-medal-card svg { display: block; width: 100%; height: 100%; }

        /* ---- load: the strike ---- */
        .cz-medal-strike {
          transform-box: fill-box;
          transform-origin: center;
          animation: cz-medal-press .8s cubic-bezier(.3,.9,.3,1) backwards;
        }
        .cz-medal-flash {
          animation: cz-medal-flash-sweep .8s ease-out .12s backwards;
        }
        .cz-medal-frame {
          stroke-dasharray: 1;
          animation: cz-medal-frame-draw 1.3s ease-out backwards;
        }
        .cz-medal-legend {
          animation: cz-medal-fade-in .7s ease-out .85s backwards;
        }
        @keyframes cz-medal-press {
          0%   { opacity: 0; transform: scale(1.06); }
          45%  { opacity: 1; transform: scale(1.04); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes cz-medal-flash-sweep {
          0%   { opacity: 0; transform: translateX(-190px); }
          25%  { opacity: .9; }
          100% { opacity: 0; transform: translateX(190px); }
        }
        @keyframes cz-medal-frame-draw {
          from { stroke-dashoffset: 1; opacity: .4; }
          to   { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes cz-medal-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ---- ambient ---- */
        .cz-medal-gleam {
          transform-box: view-box;
          transform-origin: 150px 196px;
          animation: cz-medal-gleam-rot 18s linear infinite;
        }
        .cz-medal-lantern {
          transform-box: fill-box;
          transform-origin: center;
          animation: cz-medal-lantern-pulse 15s ease-in-out infinite;
        }
        @keyframes cz-medal-gleam-rot {
          to { transform: rotate(360deg); }
        }
        @keyframes cz-medal-lantern-pulse {
          0%, 100% { opacity: .55; transform: scale(.85); }
          50%      { opacity: 1;   transform: scale(1.12); }
        }

        @media (prefers-reduced-motion: reduce) {
          .cz-medal-strike,
          .cz-medal-flash,
          .cz-medal-frame,
          .cz-medal-legend,
          .cz-medal-gleam,
          .cz-medal-lantern {
            animation: none;
          }
          .cz-medal-flash { opacity: 0; }
        }
      `}</style>

      <svg
        viewBox="0 0 300 450"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={isDefault ? "The Hermit, gold medallion" : `${name}, gold medallion`}
      >
        <defs>
          <radialGradient id="czm-velvet" cx="50%" cy="42%" r="75%">
            <stop offset="0%" stopColor="#1a1410" />
            <stop offset="55%" stopColor="#0d0a07" />
            <stop offset="100%" stopColor="#040302" />
          </radialGradient>
          <radialGradient id="czm-face" cx="38%" cy="32%" r="85%">
            <stop offset="0%" stopColor="#f7e08e" />
            <stop offset="45%" stopColor="#d9b64a" />
            <stop offset="80%" stopColor="#a67c1c" />
            <stop offset="100%" stopColor="#7c5a12" />
          </radialGradient>
          <linearGradient id="czm-relief" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fbeaa6" />
            <stop offset="50%" stopColor="#cfa62f" />
            <stop offset="100%" stopColor="#7c5a12" />
          </linearGradient>
          <linearGradient id="czm-rim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffecae" />
            <stop offset="55%" stopColor="#c9a227" />
            <stop offset="100%" stopColor="#6b4c10" />
          </linearGradient>
          <linearGradient id="czm-gleam-band" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#fff6d8" stopOpacity=".28" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="czm-flash-band" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#fffdf0" stopOpacity=".85" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id="czm-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <filter id="czm-soft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <clipPath id="czm-coin-clip">
            <circle cx={CX} cy={CY} r={104} />
          </clipPath>
          <path
            id="czm-text-circle"
            d="M 150 112 A 84 84 0 1 1 149.9 112"
            fill="none"
          />
        </defs>

        {/* velvet ground + grain */}
        <rect width="300" height="450" fill="url(#czm-velvet)" />
        <rect
          width="300"
          height="450"
          filter="url(#czm-grain)"
          opacity="0.05"
        />

        {/* hairline gold frame */}
        <rect
          className="cz-medal-frame"
          x="9"
          y="9"
          width="282"
          height="432"
          fill="none"
          stroke="#c9a227"
          strokeWidth="1"
          opacity=".7"
          pathLength={1}
        />
        <rect
          x="14"
          y="14"
          width="272"
          height="422"
          fill="none"
          stroke="#c9a227"
          strokeWidth=".5"
          opacity=".35"
        />

        {/* drop shadow under coin */}
        <ellipse
          cx={CX}
          cy={CY + 10}
          rx={COIN_R}
          ry={COIN_R - 4}
          fill="#000"
          opacity=".6"
          filter="url(#czm-soft)"
        />

        {/* ======================= THE COIN ======================= */}
        <g className="cz-medal-strike">
          {/* reeded edge */}
          <circle cx={CX} cy={CY} r={COIN_R} fill="#8a6418" />
          {REEDS.map((a) => (
            <rect
              key={a}
              x={CX - 0.6}
              y={CY - COIN_R}
              width="1.2"
              height="5"
              fill="#5e430d"
              transform={`rotate(${a} ${CX} ${CY})`}
            />
          ))}
          {/* struck face */}
          <circle cx={CX} cy={CY} r={110} fill="url(#czm-face)" />

          {/* raised rim: bright crest + inner recess shadow */}
          <circle
            cx={CX}
            cy={CY}
            r={104}
            fill="none"
            stroke="url(#czm-rim)"
            strokeWidth="3"
          />
          <circle
            cx={CX}
            cy={CY}
            r={101}
            fill="none"
            stroke="#6b4c10"
            strokeWidth="1.4"
            opacity=".8"
          />

          {/* beading */}
          {BEADS.map((b, i) => (
            <g key={i}>
              <circle cx={b.x + 0.4} cy={b.y + 0.6} r="1.3" fill="#6b4c10" />
              <circle cx={b.x} cy={b.y} r="1.3" fill={beadFill(i)} />
            </g>
          ))}

          {/* circular inscription, raised caps with star stops */}
          <text
            fontFamily="Georgia, 'Times New Roman', serif"
            fontSize="13"
            letterSpacing="7"
            fill="#5e430d"
            transform="translate(0.8 1.3)"
          >
            <textPath href="#czm-text-circle" startOffset="50%" textAnchor="middle">
              {inscription}
            </textPath>
          </text>
          <text
            fontFamily="Georgia, 'Times New Roman', serif"
            fontSize="13"
            letterSpacing="7"
            fill="#f6dd8d"
          >
            <textPath href="#czm-text-circle" startOffset="50%" textAnchor="middle">
              {inscription}
            </textPath>
          </text>

          {/* -------- arcana in low relief -------- */}
          {art}

          {/* ambient gleam sweep, clipped to the field */}
          <g clipPath="url(#czm-coin-clip)">
            <g transform={`rotate(${v * 15} ${CX} ${CY})`}>
              <g
                className="cz-medal-gleam"
                style={{ animationDuration: `${18 + v * 0.75}s` }}
              >
                <rect
                  x={CX - 18}
                  y={CY - 160}
                  width="36"
                  height="320"
                  fill="url(#czm-gleam-band)"
                />
              </g>
            </g>
            {/* one-shot strike flash */}
            <rect
              className="cz-medal-flash"
              x={CX - 45}
              y={CY - 160}
              width="90"
              height="320"
              fill="url(#czm-flash-band)"
            />
          </g>

          {/* scene gleam accent */}
          {accent}
        </g>

        {/* ======================= legend below ======================= */}
        <g
          className="cz-medal-legend"
          fontFamily="Georgia, 'Times New Roman', serif"
          textAnchor="middle"
        >
          <text x="150" y="356" fontSize="15" letterSpacing="3" fill="#c9a227">
            {numeral}
          </text>
          <text x="150" y="384" fontSize={nameSize} letterSpacing={nameTrack} fill="#ecd27e">
            {title}
          </text>
          <text x="150" y="404" fontSize="9.5" letterSpacing="3" fill="#8f7a3a">
            avrum · mmxxvi
          </text>
        </g>
      </svg>
    </figure>
  );
}
