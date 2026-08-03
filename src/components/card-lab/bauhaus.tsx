/**
 * Card Lab — BAUHAUS
 * The Hermit (IX) deconstructed into 1920s Bauhaus geometric abstraction:
 * circle, semicircle, triangle, rectangles, bars — flat unmodulated fills,
 * asymmetric diagonal composition, no gradients, no shadows, no ornament.
 *
 * Signature effects (CSS-only, server-component safe):
 * 1. One-shot mount animation — every shape flies in from a different edge
 *    with staggered delays, so the composition assembles itself on stage.
 * 2. Hover — shapes drift a few px apart along the composition diagonal
 *    (deconstruct/reconstruct) while the whole card tilts ~1.5deg.
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

        /* --- hover deconstruction: shapes drift along the diagonal ---- */
        .cl-bauhaus-card svg * { transition: transform 0.5s ease; }
        .cl-bauhaus-card:hover .cl-bauhaus-s-triangle { transform: translate(-5px, 4px); }
        .cl-bauhaus-card:hover .cl-bauhaus-s-ground   { transform: translate(-4px, 2px); }
        .cl-bauhaus-card:hover .cl-bauhaus-s-sun      { transform: translate(6px, -6px); }
        .cl-bauhaus-card:hover .cl-bauhaus-s-star     { transform: translate(9px, -9px); }
        .cl-bauhaus-card:hover .cl-bauhaus-s-robe     { transform: translate(2px, -2px); }
        .cl-bauhaus-card:hover .cl-bauhaus-s-head     { transform: translate(4px, -5px); }
        .cl-bauhaus-card:hover .cl-bauhaus-s-staff    { transform: translate(5px, 1px); }
        .cl-bauhaus-card:hover .cl-bauhaus-s-arm      { transform: translate(5px, -4px) rotate(-24deg); }

        /* --- one-shot assembly on mount -------------------------------- */
        /* Keyframes define only the "from" state; the end state is each
           element's own style, so after the animation ends (fill-mode:
           backwards) the hover transitions above take over cleanly. */
        @keyframes cl-bauhaus-in-bottom { from { transform: translate(0, 90px); opacity: 0; } }
        @keyframes cl-bauhaus-in-left   { from { transform: translate(-110px, 0); opacity: 0; } }
        @keyframes cl-bauhaus-in-right  { from { transform: translate(110px, 0); opacity: 0; } }
        @keyframes cl-bauhaus-in-top    { from { transform: translate(0, -70px); opacity: 0; } }
        @keyframes cl-bauhaus-in-tr     { from { transform: translate(80px, -80px); opacity: 0; } }
        @keyframes cl-bauhaus-in-arm    { from { transform: translate(-60px, 30px) rotate(-24deg); opacity: 0; } }
        @keyframes cl-bauhaus-in-pop    { from { transform: scale(0); opacity: 0; } }
        @keyframes cl-bauhaus-in-fade   { from { opacity: 0; } }

        .cl-bauhaus-s-triangle { animation: cl-bauhaus-in-bottom 0.6s ease-out 0s backwards; }
        .cl-bauhaus-s-ground   { animation: cl-bauhaus-in-left   0.6s ease-out 0.1s backwards; }
        .cl-bauhaus-s-sun      { animation: cl-bauhaus-in-tr     0.55s ease-out 0.25s backwards; }
        .cl-bauhaus-s-robe     { animation: cl-bauhaus-in-bottom 0.5s ease-out 0.4s backwards; }
        .cl-bauhaus-s-head     { animation: cl-bauhaus-in-top    0.5s ease-out 0.5s backwards; }
        .cl-bauhaus-s-staff    { animation: cl-bauhaus-in-right  0.5s ease-out 0.6s backwards; }
        .cl-bauhaus-s-star     {
          transform-origin: 152px 66px;
          animation: cl-bauhaus-in-pop 0.45s ease-out 0.7s backwards;
        }
        .cl-bauhaus-s-arm      {
          transform: rotate(-24deg);
          transform-origin: 103px 96px;
          animation: cl-bauhaus-in-arm 0.5s ease-out 0.65s backwards;
        }
        .cl-bauhaus-s-numeral  { animation: cl-bauhaus-in-fade 0.6s ease-out 0.9s backwards; }
        .cl-bauhaus-s-caption  { animation: cl-bauhaus-in-fade 0.6s ease-out 1.05s backwards; }

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
        <polygon
          className="cl-bauhaus-s-triangle"
          points="28,242 138,96 200,242"
          fill={COLORS.red}
        />

        {/* Ground — black semicircle dome rising from the bottom edge */}
        <path
          className="cl-bauhaus-s-ground"
          d="M 5 296 A 95 95 0 0 0 195 296 Z"
          fill={COLORS.black}
        />

        {/* Lantern light / sun — large primary-yellow circle, top right */}
        <circle
          className="cl-bauhaus-s-sun"
          cx="152"
          cy="66"
          r="42"
          fill={COLORS.yellow}
        />

        {/* The Hermit — deconstructed figure standing on the semicircle */}
        {/* Robe: tall blue rectangle, slightly left of the diagonal axis */}
        <rect
          className="cl-bauhaus-s-robe"
          x="78"
          y="128"
          width="26"
          height="118"
          fill={COLORS.blue}
        />
        {/* Hood/head: small black circle resting on the robe */}
        <circle
          className="cl-bauhaus-s-head"
          cx="91"
          cy="116"
          r="12"
          fill={COLORS.black}
        />
        {/* Staff: thin black bar held at a strict vertical, right of body */}
        <rect
          className="cl-bauhaus-s-staff"
          x="120"
          y="104"
          width="5"
          height="140"
          fill={COLORS.black}
        />
        {/* Raised lantern arm: short red bar angling up toward the light
            (rotation lives in CSS so animations/hover can compose with it) */}
        <rect
          className="cl-bauhaus-s-arm"
          x="103"
          y="96"
          width="34"
          height="6"
          fill={COLORS.red}
        />
        {/* Star inside the lantern — tiny black square on the yellow circle */}
        <rect
          className="cl-bauhaus-s-star"
          x="147"
          y="61"
          width="10"
          height="10"
          fill={COLORS.black}
        />

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
