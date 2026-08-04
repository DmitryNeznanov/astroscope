/**
 * Sacred Geometry — The Hermit (IX)
 *
 * Precision esoteric-print tarot card: matte black ground, hairline gold
 * construction geometry (1px). The Hermit's silhouette is inscribed in a
 * geometric construction — vesica piscis at the torso, halo circle at the
 * head, equilateral triangle from crown to feet, faint hexagram grid behind,
 * the lantern sitting on a construction node marked with a solid gold dot.
 *
 * Border: a designed geometric frame — double hairline rules with node dots
 * at the side midpoints, corner squares holding hexagram (top) and
 * seed-of-life (bottom) motifs.
 *
 * Astrology layer: a very faint zodiac ring (12 division ticks + tiny glyphs)
 * tangent to the inner rule, faint planetary glyphs at key construction
 * nodes (☿︎ crown, ☽︎ / ♄︎ at the vesica crossings, ♃︎ at the feet), and a
 * faint golden-ratio spiral unwinding from the lantern light.
 *
 * Load: the geometry constructs itself (stroke draw-on, staggered), then the
 * figure lines, then the lantern dot appears with a soft glow (~1.8s total).
 * Ambient: nearly none — only the lantern glow breathes very subtly.
 * All animation is CSS-only and guarded by prefers-reduced-motion.
 */

const GOLD = "#c9a24b";
const GOLD_BRIGHT = "#e8cf8f";
const INK = "#0b0a08";

const CX = 150;
const TORSO_Y = 229; // center of the vesica / construction circles
const PHI = 1.6180339887;
const SERIF = "Georgia, 'Times New Roman', serif";

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** Triangle path inscribed in a circle (for corner hexagrams). */
function triPath(cx: number, cy: number, r: number, rot: number) {
  const p = [0, 1, 2].map((k) => polar(cx, cy, r, rot + k * 120));
  return `M${p[0].x.toFixed(2)} ${p[0].y.toFixed(2)} L${p[1].x.toFixed(2)} ${p[1].y.toFixed(2)} L${p[2].x.toFixed(2)} ${p[2].y.toFixed(2)} Z`;
}

/** Small radial tick marks on the large construction circle (r=120). */
const RING_TICKS = [25, 65, 115, 155, 205, 245, 295, 335].map((deg) => {
  const a = polar(CX, TORSO_Y, 116.5, deg);
  const b = polar(CX, TORSO_Y, 123.5, deg);
  return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
});

/** Ticks where the vesica circles cross each other (r=55, centers 66 apart). */
const VESICA_TICK_X = Math.sqrt(55 * 55 - 33 * 33); // ≈ 44

/** Zodiac ring: 12 division ticks (r 119→126) and glyphs seated inside. */
const ZODIAC_GLYPHS = ["♈︎", "♉︎", "♊︎", "♋︎", "♌︎", "♍︎", "♎︎", "♏︎", "♐︎", "♑︎", "♒︎", "♓︎"];
const ZODIAC = ZODIAC_GLYPHS.map((glyph, i) => {
  const tickDeg = -90 + i * 30;
  const t1 = polar(CX, TORSO_Y, 119, tickDeg);
  const t2 = polar(CX, TORSO_Y, 126, tickDeg);
  const g = polar(CX, TORSO_Y, 108, tickDeg + 15);
  return { glyph, t1, t2, g };
});

/** Corner ornament squares; top pair hexagrams, bottom pair seed-of-life. */
const CORNERS = [
  { x: 10, y: 10, seed: false },
  { x: 268, y: 10, seed: false },
  { x: 10, y: 418, seed: true },
  { x: 268, y: 418, seed: true },
];

/** Node dots at the midpoints of both frame rules. */
const NODE_DOTS = [
  { x: 150, y: 10 }, { x: 150, y: 440 }, { x: 10, y: 225 }, { x: 290, y: 225 },
  { x: 150, y: 24 }, { x: 150, y: 426 }, { x: 24, y: 225 }, { x: 276, y: 225 },
];

/** Golden-ratio spiral unwinding from the lantern node (208,145). */
const SPIRAL_D = (() => {
  const start = (-55 * Math.PI) / 180;
  let d = "";
  for (let i = 0; i <= 160; i++) {
    const t = (i / 160) * 8 * Math.PI; // 4 turns
    const r = 1.05 * Math.pow(PHI, t / (Math.PI / 2));
    const x = 208 + r * Math.cos(start + t);
    const y = 145 + r * Math.sin(start + t);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d;
})();

export default function SacredGeometryHermit() {
  return (
    <figure className="cz-sg-card" style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}>
      <style>{`
        .cz-sg-card { position: relative; overflow: hidden; background: ${INK}; }

        /* ---------- load reveal: geometry constructs itself ---------- */
        .cz-sg-draw {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: cz-sg-draw-in 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes cz-sg-draw-in {
          to { stroke-dashoffset: 0; }
        }

        .cz-sg-appear {
          opacity: 0;
          animation: cz-sg-appear-in 0.6s ease-out forwards;
        }
        @keyframes cz-sg-appear-in {
          to { opacity: 1; }
        }

        .cz-sg-lantern {
          opacity: 0;
          transform-box: fill-box;
          transform-origin: center;
          animation: cz-sg-lantern-in 0.55s ease-out 1.45s forwards;
        }
        @keyframes cz-sg-lantern-in {
          0%   { opacity: 0; transform: scale(0.3); }
          60%  { opacity: 1; transform: scale(1.35); }
          100% { opacity: 1; transform: scale(1); }
        }

        /* ---------- ambient: only the lantern glow breathes ---------- */
        .cz-sg-glow {
          animation: cz-sg-glow-breathe 18s ease-in-out 2.2s infinite;
        }
        @keyframes cz-sg-glow-breathe {
          0%, 100% { opacity: 0.45; }
          50%      { opacity: 0.8; }
        }

        /* ---------- reduced motion: fully visible, static ---------- */
        @media (prefers-reduced-motion: reduce) {
          .cz-sg-draw,
          .cz-sg-appear,
          .cz-sg-lantern,
          .cz-sg-glow {
            animation: none;
          }
          .cz-sg-draw    { stroke-dashoffset: 0; }
          .cz-sg-appear,
          .cz-sg-lantern { opacity: 1; transform: none; }
        }
      `}</style>

      <svg
        viewBox="0 0 300 450"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        role="img"
        aria-label="The Hermit tarot card drawn as sacred geometry"
      >
        <defs>
          <radialGradient id="cz-sg-lantern-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={GOLD_BRIGHT} stopOpacity="0.9" />
            <stop offset="35%" stopColor={GOLD} stopOpacity="0.35" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cz-sg-vignette" cx="50%" cy="42%" r="75%">
            <stop offset="0%" stopColor="#14110c" stopOpacity="0.9" />
            <stop offset="60%" stopColor={INK} stopOpacity="0.4" />
            <stop offset="100%" stopColor="#060504" stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* matte black ground with a faint center lift */}
        <rect x="0" y="0" width="300" height="450" fill="url(#cz-sg-vignette)" />

        {/* ===== zodiac ring: deepest layer, tangent to the inner rule ===== */}
        <circle pathLength={1} cx={CX} cy={TORSO_Y} r="126" fill="none" stroke={GOLD}
          strokeWidth="0.5" opacity="0.16" className="cz-sg-draw" style={{ animationDelay: "0.02s" }} />
        <g className="cz-sg-appear" style={{ animationDelay: "0.5s" }}>
          {ZODIAC.map((z, i) => (
            <g key={i}>
              <line x1={z.t1.x} y1={z.t1.y} x2={z.t2.x} y2={z.t2.y}
                stroke={GOLD} strokeWidth="0.5" opacity="0.3" />
              <text x={z.g.x} y={z.g.y} textAnchor="middle" dominantBaseline="central"
                fill={GOLD} opacity="0.3" fontSize="7.5" fontFamily={SERIF}>
                {z.glyph}
              </text>
            </g>
          ))}
        </g>

        {/* ===== faint hexagram grid behind everything ===== */}
        <g stroke={GOLD} strokeWidth="0.5" fill="none" opacity="0.08"
          className="cz-sg-draw" style={{ animationDelay: "0.05s" }}>
          <path pathLength={1} d="M150 104 L258.4 291.5 L41.6 291.5 Z" />
          <path pathLength={1} d="M150 354 L258.4 166.5 L41.6 166.5 Z" />
          <circle pathLength={1} cx="150" cy="229" r="108" />
        </g>

        {/* ===== large construction circles (extend beyond the figure) ===== */}
        <g stroke={GOLD} strokeWidth="0.75" fill="none" opacity="0.55">
          <circle pathLength={1} cx={CX} cy={TORSO_Y} r="120" className="cz-sg-draw"
            style={{ animationDelay: "0.15s" }} />
          <circle pathLength={1} cx={CX} cy={TORSO_Y} r="90" className="cz-sg-draw"
            style={{ animationDelay: "0.28s" }} />
          {/* circle through crown and feet, centered mid-figure */}
          <circle pathLength={1} cx={CX} cy="229" r="111" className="cz-sg-draw"
            style={{ animationDelay: "0.4s" }} opacity="0.6" />
        </g>

        {/* ===== golden-ratio spiral unwinding from the lantern ===== */}
        <path pathLength={1} d={SPIRAL_D} fill="none" stroke={GOLD} strokeWidth="0.6"
          opacity="0.18" className="cz-sg-draw" style={{ animationDelay: "0.35s" }} />

        {/* ===== vesica piscis at the torso ===== */}
        <g stroke={GOLD} strokeWidth="0.9" fill="none" opacity="0.85">
          <circle pathLength={1} cx={CX} cy="196" r="55" className="cz-sg-draw"
            style={{ animationDelay: "0.52s" }} />
          <circle pathLength={1} cx={CX} cy="262" r="55" className="cz-sg-draw"
            style={{ animationDelay: "0.62s" }} />
        </g>

        {/* ===== halo circles at the head ===== */}
        <circle pathLength={1} cx={CX} cy="150" r="36" fill="none" stroke={GOLD}
          strokeWidth="1" className="cz-sg-draw" style={{ animationDelay: "0.72s" }} />
        <circle pathLength={1} cx={CX} cy="150" r="30" fill="none" stroke={GOLD}
          strokeWidth="0.5" opacity="0.6" className="cz-sg-draw" style={{ animationDelay: "0.8s" }} />

        {/* ===== equilateral triangle: crown to feet ===== */}
        <path pathLength={1} d="M150 118 L278.2 340 L21.8 340 Z" fill="none" stroke={GOLD}
          strokeWidth="1" className="cz-sg-draw" style={{ animationDelay: "0.9s" }} />

        {/* ===== tick marks at construction intersections ===== */}
        <g stroke={GOLD} strokeWidth="0.9" opacity="0.8" className="cz-sg-appear"
          style={{ animationDelay: "1.05s" }}>
          {RING_TICKS.map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} />
          ))}
          {/* vesica crossing points */}
          <line x1={CX - VESICA_TICK_X} y1={TORSO_Y - 4} x2={CX - VESICA_TICK_X} y2={TORSO_Y + 4} />
          <line x1={CX + VESICA_TICK_X} y1={TORSO_Y - 4} x2={CX + VESICA_TICK_X} y2={TORSO_Y + 4} />
          {/* crown / feet nodes on the vertical axis */}
          <line x1="146" y1="118" x2="154" y2="118" />
          <line x1="144" y1="340" x2="156" y2="340" />
        </g>

        {/* ===== faint planetary glyphs at key geometric nodes ===== */}
        <g fill={GOLD} opacity="0.4" fontSize="9" fontFamily={SERIF} textAnchor="middle"
          className="cz-sg-appear" style={{ animationDelay: "1s" }}>
          <text x="150" y="104">☿︎</text>
          <text x="92" y="236">☽︎</text>
          <text x="208" y="236">♄︎</text>
          <text x="150" y="364">♃︎</text>
        </g>

        {/* ===== the Hermit: silhouette inscribed in the construction ===== */}
        <g stroke={GOLD_BRIGHT} strokeWidth="1.1" fill="none" strokeLinecap="round">
          {/* hood: pointed arc over the head */}
          <path pathLength={1} d="M136 156 Q134 128 150 120 Q166 128 164 156"
            className="cz-sg-draw" style={{ animationDelay: "1.05s" }} />
          {/* face shadow line inside the hood */}
          <path pathLength={1} d="M141 152 Q150 158 159 152" strokeWidth="0.7" opacity="0.75"
            className="cz-sg-draw" style={{ animationDelay: "1.15s" }} />
          {/* robe lines: shoulders to hem, then the hem itself */}
          <path pathLength={1} d="M136 156 Q128 172 126 196 L118 340"
            className="cz-sg-draw" style={{ animationDelay: "1.2s" }} />
          <path pathLength={1} d="M164 156 Q172 172 174 196 L182 340"
            className="cz-sg-draw" style={{ animationDelay: "1.28s" }} />
          <path pathLength={1} d="M118 340 Q150 348 182 340"
            className="cz-sg-draw" style={{ animationDelay: "1.34s" }} />
          {/* inner robe fold following the vesica axis */}
          <path pathLength={1} d="M150 170 L150 336" strokeWidth="0.6" opacity="0.6"
            className="cz-sg-draw" style={{ animationDelay: "1.38s" }} />
          {/* staff: held low in the left hand, planted past the hem */}
          <path pathLength={1} d="M112 178 L106 352"
            className="cz-sg-draw" style={{ animationDelay: "1.3s" }} />
          <circle pathLength={1} cx="112.6" cy="172" r="4" strokeWidth="0.8"
            className="cz-sg-draw" style={{ animationDelay: "1.4s" }} />
          {/* raised arm to the lantern node */}
          <path pathLength={1} d="M166 168 Q186 158 204 146"
            className="cz-sg-draw" style={{ animationDelay: "1.32s" }} />
          {/* lantern cage around the node */}
          <path pathLength={1} d="M208 128 L218 138 L218 152 L208 162 L198 152 L198 138 Z"
            strokeWidth="0.9" className="cz-sg-draw" style={{ animationDelay: "1.42s" }} />
          <line x1="208" y1="122" x2="208" y2="128" strokeWidth="0.8"
            className="cz-sg-draw" style={{ animationDelay: "1.45s" }} />
        </g>

        {/* ===== the lantern light: solid gold node with soft glow ===== */}
        <g className="cz-sg-lantern">
          <circle cx="208" cy="145" r="26" fill="url(#cz-sg-lantern-glow)" className="cz-sg-glow" />
          {/* tiny eight-point star inside the lantern */}
          <path
            d="M208 138.5 L209.2 143 L213.5 145 L209.2 147 L208 151.5 L206.8 147 L202.5 145 L206.8 143 Z"
            fill={GOLD_BRIGHT}
          />
          <circle cx="208" cy="145" r="3" fill={GOLD_BRIGHT} />
        </g>

        {/* ===== designed geometric border ===== */}
        <g fill="none" stroke={GOLD}>
          <rect pathLength={1} x="10" y="10" width="280" height="430" strokeWidth="1"
            className="cz-sg-draw" style={{ animationDelay: "0s" }} />
          <rect pathLength={1} x="24" y="24" width="252" height="402" strokeWidth="0.5" opacity="0.8"
            className="cz-sg-draw" style={{ animationDelay: "0.1s" }} />
          {/* corner ornaments: squares with hexagram / seed-of-life motifs */}
          {CORNERS.map((c, i) => {
            const cx = c.x + 11;
            const cy = c.y + 11;
            return (
              <g key={i}>
                <rect pathLength={1} x={c.x} y={c.y} width="22" height="22" strokeWidth="0.9"
                  className="cz-sg-draw" style={{ animationDelay: "0.12s" }} />
                {c.seed ? (
                  <g strokeWidth="0.5" opacity="0.9" className="cz-sg-draw"
                    style={{ animationDelay: "0.3s" }}>
                    <circle pathLength={1} cx={cx} cy={cy} r="4" />
                    {[0, 60, 120, 180, 240, 300].map((a) => {
                      const p = polar(cx, cy, 4, a);
                      return <circle pathLength={1} key={a} cx={p.x} cy={p.y} r="4" />;
                    })}
                  </g>
                ) : (
                  <g strokeWidth="0.6" className="cz-sg-draw" style={{ animationDelay: "0.3s" }}>
                    <path pathLength={1} d={triPath(cx, cy, 7, -90)} />
                    <path pathLength={1} d={triPath(cx, cy, 7, 90)} />
                  </g>
                )}
              </g>
            );
          })}
        </g>
        {/* node dots at the midpoints of both rules */}
        <g fill={GOLD} className="cz-sg-appear" style={{ animationDelay: "0.9s" }}>
          {NODE_DOTS.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="1.4" />
          ))}
        </g>

        {/* ===== IX in a small gold circle at top ===== */}
        <g className="cz-sg-appear" style={{ animationDelay: "0.55s" }}>
          <circle pathLength={1} cx="150" cy="46" r="15" fill="none" stroke={GOLD}
            strokeWidth="0.9" className="cz-sg-draw" style={{ animationDelay: "0.55s" }} />
          <text x="150" y="50.5" textAnchor="middle" fill={GOLD_BRIGHT} fontSize="12"
            fontFamily={SERIF} letterSpacing="1.5">
            IX
          </text>
        </g>

        {/* ===== THE HERMIT: precise geometric caps with diamond marks ===== */}
        <g className="cz-sg-appear" style={{ animationDelay: "1.1s" }}>
          <path d="M62 402 L66 406 L62 410 L58 406 Z" fill={GOLD} />
          <path d="M238 402 L242 406 L238 410 L234 406 Z" fill={GOLD} />
          <text x="150" y="410.5" textAnchor="middle" fill={GOLD_BRIGHT} fontSize="12.5"
            fontFamily="'Avenir Next', Futura, 'Century Gothic', 'Helvetica Neue', sans-serif"
            letterSpacing="5">
            THE HERMIT
          </text>
          <line x1="96" y1="420" x2="204" y2="420" stroke={GOLD} strokeWidth="0.5" opacity="0.6" />
        </g>
      </svg>
    </figure>
  );
}
