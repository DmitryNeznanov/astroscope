/**
 * Card Lab — BAUHAUS
 * The Hermit (IX) deconstructed into 1920s Bauhaus geometric abstraction:
 * circle, semicircle, triangle, rectangles, bars — flat unmodulated fills,
 * asymmetric diagonal composition, no gradients, no shadows, no ornament.
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
        @media (prefers-reduced-motion: reduce) {
          .cl-bauhaus-card svg { transform: none; }
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
        <polygon points="28,242 138,96 200,242" fill={COLORS.red} />

        {/* Ground — black semicircle dome rising from the bottom edge */}
        <path d="M 5 296 A 95 95 0 0 0 195 296 Z" fill={COLORS.black} />

        {/* Lantern light / sun — large primary-yellow circle, top right */}
        <circle cx="152" cy="66" r="42" fill={COLORS.yellow} />

        {/* The Hermit — deconstructed figure standing on the semicircle */}
        {/* Robe: tall blue rectangle, slightly left of the diagonal axis */}
        <rect x="78" y="128" width="26" height="118" fill={COLORS.blue} />
        {/* Hood/head: small black circle resting on the robe */}
        <circle cx="91" cy="116" r="12" fill={COLORS.black} />
        {/* Staff: thin black bar held at a strict vertical, right of body */}
        <rect x="120" y="104" width="5" height="140" fill={COLORS.black} />
        {/* Raised lantern arm: short red bar angling up toward the light */}
        <rect
          x="103"
          y="96"
          width="34"
          height="6"
          fill={COLORS.red}
          transform="rotate(-24 103 96)"
        />
        {/* Star inside the lantern — tiny black square on the yellow circle */}
        <rect x="147" y="61" width="10" height="10" fill={COLORS.black} />

        {/* Numeral IX — bold black numeral inside a black-ringed circle */}
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

        {/* Title — heavy letterspaced caps in off-white on the black ground */}
        <text
          x="100"
          y="286"
          textAnchor="middle"
          className="cl-bauhaus-title cl-bauhaus-title--invert"
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
