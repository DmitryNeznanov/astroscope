/**
 * Card Lab — BAUHAUS
 * The Hermit (IX) deconstructed into 1920s Bauhaus geometric abstraction:
 * circle, semicircle, triangle, rectangles, bars — flat unmodulated fills,
 * asymmetric diagonal composition, no gradients, no shadows, no ornament.
 *
 * Signature effects (CSS-only, server-component safe):
 * 1. One-shot mount animation — every shape flies in from a different edge
 *    with staggered delays, so the composition assembles itself on stage.
 * 2. Always-on permutation — each shape oscillates a few px on its own
 *    staggered 5-9s loop; low amplitude so the composition holds.
 * 3. Color re-solve — every 8s the three primaries rotate between the big
 *    shapes (circle -> red, triangle -> blue, robe -> yellow) in hard
 *    steps() swaps, driven by CSS `fill` (overrides the SVG attribute).
 * 4. The little black star square spins slowly, forever.
 * 5. Hover — shapes drift apart along the composition diagonal while the
 *    card tilts ~1.5deg.
 *
 * Layering: wrapper <g class="cl-bauhaus-g-*"> carries the one-shot
 * assembly + hover transforms; the shape itself (cl-bauhaus-s-*) carries
 * the infinite drift/spin/fill loops, so the two never compete for the
 * same animated property on the same element.
 */

const COLORS = {
  bg: "#f2ede0",
  red: "#e30613",
  yellow: "#f6c90e",
  blue: "#1e50a2",
  black: "#111111",
} as const;

export default function BauhausHermitCard() {
  return (
    <figure
      className="cl-bauhaus-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
    >
      <style>{`
        .cl-bauhaus-card { display: block; line-height: 0; }
        .cl-bauhaus-card svg { display: block; width: 100%; height: 100%; }
        .cl-bauhaus-title {
          font-family: "Futura", "Century Gothic", "Avenir Next", Arial, Helvetica, sans-serif;
          font-weight: 900;
          fill: ${COLORS.black};
        }
        .cl-bauhaus-title--invert { fill: ${COLORS.bg}; }

        /* --- card tilt on hover -------------------------------------- */
        .cl-bauhaus-card { transition: transform 0.45s ease; }
        .cl-bauhaus-card:hover { transform: rotate(1.5deg); }

        /* --- hover deconstruction: groups drift along the diagonal ---- */
        .cl-bauhaus-card svg * { transition: transform 0.5s ease; }
        .cl-bauhaus-card:hover .cl-bauhaus-g-triangle { transform: translate(-5px, 4px); }
        .cl-bauhaus-card:hover .cl-bauhaus-g-ground   { transform: translate(-4px, 2px); }
        .cl-bauhaus-card:hover .cl-bauhaus-g-sun      { transform: translate(6px, -6px); }
        .cl-bauhaus-card:hover .cl-bauhaus-g-star     { transform: translate(9px, -9px); }
        .cl-bauhaus-card:hover .cl-bauhaus-g-robe     { transform: translate(2px, -2px); }
        .cl-bauhaus-card:hover .cl-bauhaus-g-head     { transform: translate(4px, -5px); }
        .cl-bauhaus-card:hover .cl-bauhaus-g-staff    { transform: translate(5px, 1px); }
        .cl-bauhaus-card:hover .cl-bauhaus-g-arm      { transform: translate(5px, -4px); }

        /* --- one-shot assembly on mount (on the wrapper groups) ------- */
        /* Keyframes define only the "from" state; the end state is each
           element's own style, so after the animation ends (fill-mode:
           backwards) the hover transitions above take over cleanly. */
        @keyframes cl-bauhaus-in-bottom { from { transform: translate(0, 90px); opacity: 0; } }
        @keyframes cl-bauhaus-in-left   { from { transform: translate(-110px, 0); opacity: 0; } }
        @keyframes cl-bauhaus-in-right  { from { transform: translate(110px, 0); opacity: 0; } }
        @keyframes cl-bauhaus-in-top    { from { transform: translate(0, -70px); opacity: 0; } }
        @keyframes cl-bauhaus-in-tr     { from { transform: translate(80px, -80px); opacity: 0; } }
        @keyframes cl-bauhaus-in-arm    { from { transform: translate(-60px, 30px); opacity: 0; } }
        @keyframes cl-bauhaus-in-pop    { from { transform: scale(0); opacity: 0; } }
        @keyframes cl-bauhaus-in-fade   { from { opacity: 0; } }

        .cl-bauhaus-g-triangle { animation: cl-bauhaus-in-bottom 0.6s ease-out 0s backwards; }
        .cl-bauhaus-g-ground   { animation: cl-bauhaus-in-left   0.6s ease-out 0.1s backwards; }
        .cl-bauhaus-g-sun      { animation: cl-bauhaus-in-tr     0.55s ease-out 0.25s backwards; }
        .cl-bauhaus-g-robe     { animation: cl-bauhaus-in-bottom 0.5s ease-out 0.4s backwards; }
        .cl-bauhaus-g-head     { animation: cl-bauhaus-in-top    0.5s ease-out 0.5s backwards; }
        .cl-bauhaus-g-staff    { animation: cl-bauhaus-in-right  0.5s ease-out 0.6s backwards; }
        .cl-bauhaus-g-arm      { animation: cl-bauhaus-in-arm    0.5s ease-out 0.65s backwards; }
        .cl-bauhaus-g-star     {
          transform-origin: 152px 66px;
          animation: cl-bauhaus-in-pop 0.45s ease-out 0.7s backwards;
        }
        .cl-bauhaus-s-numeral  { animation: cl-bauhaus-in-fade 0.6s ease-out 0.9s backwards; }
        .cl-bauhaus-s-caption  { animation: cl-bauhaus-in-fade 0.6s ease-out 1.05s backwards; }

        /* --- always-on permutation: gentle drift loops (on the shapes)  */
        @keyframes cl-bauhaus-drift-a { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(3px, -3px); } }
        @keyframes cl-bauhaus-drift-b { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-3px, 2px); } }
        @keyframes cl-bauhaus-drift-c { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(4px, -4px); } }
        @keyframes cl-bauhaus-drift-d { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-2px, 3px); } }
        @keyframes cl-bauhaus-drift-e { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(2px, -3px); } }
        @keyframes cl-bauhaus-drift-f { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(3px, 1px); } }
        @keyframes cl-bauhaus-drift-arm {
          0%, 100% { transform: translate(0, 0) rotate(-24deg); }
          50%      { transform: translate(2px, -2px) rotate(-24deg); }
        }

        .cl-bauhaus-s-ground   { animation: cl-bauhaus-drift-b 7.5s ease-in-out -4s infinite; }
        .cl-bauhaus-s-head     { animation: cl-bauhaus-drift-e 6s ease-in-out -2.5s infinite; }
        .cl-bauhaus-s-staff    { animation: cl-bauhaus-drift-f 9s ease-in-out -5s infinite; }
        .cl-bauhaus-s-arm      {
          transform: rotate(-24deg);
          transform-origin: 103px 96px;
          animation: cl-bauhaus-drift-arm 7s ease-in-out -1.5s infinite;
        }

        /* --- color re-solve: primaries rotate every 8s (hard swaps) --- */
        @keyframes cl-bauhaus-cycle-circle {
          0% { fill: ${COLORS.yellow}; } 33.33% { fill: ${COLORS.red}; }
          66.66% { fill: ${COLORS.blue}; } 100% { fill: ${COLORS.yellow}; }
        }
        @keyframes cl-bauhaus-cycle-triangle {
          0% { fill: ${COLORS.red}; } 33.33% { fill: ${COLORS.blue}; }
          66.66% { fill: ${COLORS.yellow}; } 100% { fill: ${COLORS.red}; }
        }
        @keyframes cl-bauhaus-cycle-robe {
          0% { fill: ${COLORS.blue}; } 33.33% { fill: ${COLORS.yellow}; }
          66.66% { fill: ${COLORS.red}; } 100% { fill: ${COLORS.blue}; }
        }

        /* fill lives in a separate animation from transform, so the color
           swaps never fight the drift loops; 1.2s delay lets the assembly
           finish in the original palette first. */
        .cl-bauhaus-s-sun {
          animation:
            cl-bauhaus-drift-c 8s ease-in-out -1s infinite,
            cl-bauhaus-cycle-circle 24s steps(1, end) 1.2s backwards infinite;
        }
        .cl-bauhaus-s-triangle {
          animation:
            cl-bauhaus-drift-a 6.5s ease-in-out -2s infinite,
            cl-bauhaus-cycle-triangle 24s steps(1, end) 1.2s backwards infinite;
        }
        .cl-bauhaus-s-robe {
          animation:
            cl-bauhaus-drift-d 5.5s ease-in-out -3s infinite,
            cl-bauhaus-cycle-robe 24s steps(1, end) 1.2s backwards infinite;
        }

        /* --- the star square spins slowly, forever -------------------- */
        @keyframes cl-bauhaus-spin { to { transform: rotate(360deg); } }
        .cl-bauhaus-s-star {
          transform-origin: 152px 66px;
          animation: cl-bauhaus-spin 14s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .cl-bauhaus-card,
          .cl-bauhaus-card:hover,
          .cl-bauhaus-card svg * {
            animation: none !important;
            transition: none !important;
          }
          .cl-bauhaus-card:hover { transform: none; }
          .cl-bauhaus-card:hover svg * { transform: none; }
          /* keep the arm's static rotation even with motion off */
          .cl-bauhaus-card .cl-bauhaus-s-arm { transform: rotate(-24deg); }
        }
      `}</style>

      <svg
        viewBox="0 0 200 300"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Bauhaus geometric tarot card: The Hermit, number nine"
      >
        {/* Off-white ground */}
        <rect x="0" y="0" width="200" height="300" fill={COLORS.bg} />

        {/*
          Composition runs along a rising diagonal (bottom-left -> top-right):
          a black semicircle dome grounds the scene, the red mountain triangle
          climbs toward the right, the big yellow lantern-circle dominates
          top-right, the hermit is a blue rectangle with a black hood-circle.
        */}

        {/* Mountain — red triangle, peak pushed right of center */}
        <g className="cl-bauhaus-g-triangle">
          <polygon
            className="cl-bauhaus-s-triangle"
            points="28,242 138,96 200,242"
            fill={COLORS.red}
          />
        </g>

        {/* Ground — black semicircle dome rising from the bottom edge */}
        <g className="cl-bauhaus-g-ground">
          <path
            className="cl-bauhaus-s-ground"
            d="M 5 296 A 95 95 0 0 0 195 296 Z"
            fill={COLORS.black}
          />
        </g>

        {/* Lantern light / sun — large primary-yellow circle, top right */}
        <g className="cl-bauhaus-g-sun">
          <circle
            className="cl-bauhaus-s-sun"
            cx="152"
            cy="66"
            r="42"
            fill={COLORS.yellow}
          />
        </g>

        {/* The Hermit — deconstructed figure standing on the semicircle */}
        {/* Robe: tall blue rectangle, slightly left of the diagonal axis */}
        <g className="cl-bauhaus-g-robe">
          <rect
            className="cl-bauhaus-s-robe"
            x="78"
            y="128"
            width="26"
            height="118"
            fill={COLORS.blue}
          />
        </g>
        {/* Hood/head: small black circle resting on the robe */}
        <g className="cl-bauhaus-g-head">
          <circle
            className="cl-bauhaus-s-head"
            cx="91"
            cy="116"
            r="12"
            fill={COLORS.black}
          />
        </g>
        {/* Staff: thin black bar held at a strict vertical, right of body */}
        <g className="cl-bauhaus-g-staff">
          <rect
            className="cl-bauhaus-s-staff"
            x="120"
            y="104"
            width="5"
            height="140"
            fill={COLORS.black}
          />
        </g>
        {/* Raised lantern arm: short red bar angling up toward the light
            (rotation lives in CSS so the drift loop can compose with it) */}
        <g className="cl-bauhaus-g-arm">
          <rect
            className="cl-bauhaus-s-arm"
            x="103"
            y="96"
            width="34"
            height="6"
            fill={COLORS.red}
          />
        </g>
        {/* Star inside the lantern — tiny black square on the yellow circle */}
        <g className="cl-bauhaus-g-star">
          <rect
            className="cl-bauhaus-s-star"
            x="147"
            y="61"
            width="10"
            height="10"
            fill={COLORS.black}
          />
        </g>

        {/* Numeral IX — bold black numeral inside a black-ringed circle */}
        <g className="cl-bauhaus-s-numeral">
          <circle
            cx="34"
            cy="40"
            r="22"
            fill="none"
            stroke={COLORS.black}
            strokeWidth="3"
          />
          <text
            x="34"
            y="49"
            textAnchor="middle"
            className="cl-bauhaus-title"
            fontSize="24"
          >
            IX
          </text>
        </g>

        {/* Title — heavy letterspaced caps in off-white on the black ground */}
        <text
          x="100"
          y="286"
          textAnchor="middle"
          className="cl-bauhaus-title cl-bauhaus-title--invert cl-bauhaus-s-caption"
          fontSize="15"
          letterSpacing="6"
        >
          THE HERMIT
        </text>

        {/* Thin black frame */}
        <rect
          x="4"
          y="4"
          width="192"
          height="292"
          fill="none"
          stroke={COLORS.black}
          strokeWidth="2"
        />
      </svg>
    </figure>
  );
}
