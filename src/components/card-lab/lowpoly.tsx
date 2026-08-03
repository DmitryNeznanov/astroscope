/**
 * Card Lab — LOWPOLY style.
 * The Hermit (IX) rendered as a faceted, crystalline low-poly illustration:
 * ~44 flat polygons (no strokes) building a dusk-gradient sky, teal ridges,
 * a violet mountain peak, the hooded figure with staff, and a warm gold
 * lantern whose facets are brightest at the star-core and darken outward.
 * Self-contained: inline SVG + scoped <style> (prefix `cl-lowpoly-`).
 */

type Facet = {
  points: string;
  fill: string;
  opacity?: number;
  className?: string;
};

/* Sky — two triangulated strips grading deep indigo -> violet -> teal. */
const SKY: Facet[] = [
  { points: "0,0 66,0 62,84", fill: "#191340" },
  { points: "0,0 62,84 0,92", fill: "#151036" },
  { points: "66,0 133,0 138,94", fill: "#1e1752" },
  { points: "66,0 138,94 62,84", fill: "#1a1445" },
  { points: "133,0 200,0 200,86", fill: "#221a5a" },
  { points: "133,0 200,86 138,94", fill: "#1d1650" },
  { points: "0,92 62,84 75,172", fill: "#2a2166" },
  { points: "0,92 75,172 0,182", fill: "#241d5e" },
  { points: "62,84 138,94 140,182", fill: "#2e2a6b" },
  { points: "62,84 140,182 75,172", fill: "#282464" },
  { points: "138,94 200,86 200,174", fill: "#2a3c6e" },
  { points: "138,94 200,174 140,182", fill: "#263468" },
];

/* Tiny 4-point star facets in the sky. */
const STARS: Facet[] = [
  { points: "42,35 44,38 42,41 40,38", fill: "#e8e2f2", opacity: 0.85 },
  { points: "168,80 169.6,82 168,84 166.4,82", fill: "#e8e2f2", opacity: 0.7 },
];

/* Distant teal ridges behind the main peak. */
const RIDGES: Facet[] = [
  { points: "0,190 60,160 112,222", fill: "#12303f" },
  { points: "200,182 148,158 96,222", fill: "#0f2c3a" },
];

/* The mountain peak the Hermit stands on. Lantern side faces warmer. */
const PEAK: Facet[] = [
  { points: "45,235 100,183 100,235", fill: "#3a2f63" },
  { points: "100,183 155,235 100,235", fill: "#4a3364" },
  { points: "91,196 100,183 109,196", fill: "#7f6fb0" },
];

/* Foreground shards, darkest teal-indigo. */
const FOREGROUND: Facet[] = [
  { points: "0,244 70,222 0,300", fill: "#16243a" },
  { points: "70,222 80,300 0,300", fill: "#121c30" },
  { points: "70,222 140,240 80,300", fill: "#182a40" },
  { points: "140,240 200,228 200,300", fill: "#142033" },
  { points: "140,240 200,300 80,300", fill: "#0e1828" },
];

/* The Hermit: hood, cloak facets, raised right arm, staff in left hand. */
const FIGURE: Facet[] = [
  { points: "74.6,100 77.4,100 77.4,190 74.6,190", fill: "#4a3866" }, // staff
  { points: "76,93 73.5,100 78.5,100", fill: "#6b5590" }, // staff knob
  { points: "86,120 78,122 87,132", fill: "#241a42" }, // left arm to staff
  { points: "100,95 86,116 114,116", fill: "#251a48" }, // hood
  { points: "100,106 92.5,116 107.5,116", fill: "#0d0818" }, // hood shadow
  { points: "86,116 100,122 80,185", fill: "#1d1538" }, // cloak left
  { points: "100,122 100,185 80,185", fill: "#171030" },
  { points: "114,116 120,185 100,122", fill: "#31245c" }, // cloak right (lit)
  { points: "100,122 120,185 100,185", fill: "#241a48" },
  { points: "112,124 118,150 113,158", fill: "#8a5a3a" }, // lantern-warm rim
  { points: "110,116 126,96 116,124", fill: "#3b2b66" }, // raised arm
  { points: "126,96 131,100 116,124", fill: "#453271" },
  { points: "126,96 132,94 131,101", fill: "#c98f4a" }, // hand
];

/* Lantern: bronze cap/handle, four gold body facets around a star core. */
const LANTERN: Facet[] = [
  { points: "133,72.5 129.5,76 136.5,76", fill: "#8a5f30" },
  { points: "129.5,76 136.5,76 137.5,78 128.5,78", fill: "#6b4a26" },
  { points: "128.5,78 137.5,78 133,84.5", fill: "#ffe9a8" },
  { points: "137.5,78 138,90 133,84.5", fill: "#f7c25c" },
  { points: "138,90 128,90 133,84.5", fill: "#e09a35" },
  { points: "128,90 128.5,78 133,84.5", fill: "#ffd97a" },
  { points: "130,90 136,90 133,96", fill: "#6b4a26" },
];

const STAR_CORE: Facet = {
  points: "133,81.6 135.6,84.5 133,87.4 130.4,84.5",
  fill: "#fff8e2",
  className: "cl-lowpoly-core",
};

function Facets({ facets }: { facets: Facet[] }) {
  return (
    <>
      {facets.map((f, i) => (
        <polygon
          key={i}
          points={f.points}
          fill={f.fill}
          opacity={f.opacity}
          className={f.className}
        />
      ))}
    </>
  );
}

export default function LowpolyHermitCard() {
  return (
    <figure
      className="cl-lowpoly-card"
      style={{ aspectRatio: "2/3", width: "100%" }}
    >
      <style>{`
        .cl-lowpoly-card {
          position: relative;
          margin: 0;
          overflow: hidden;
          border-radius: 14px;
          background: #14102e;
          box-shadow: 0 10px 30px rgba(8, 6, 24, 0.45);
        }
        .cl-lowpoly-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
        }
        .cl-lowpoly-glow {
          animation: cl-lowpoly-flicker 3.8s ease-in-out infinite;
        }
        .cl-lowpoly-core {
          animation: cl-lowpoly-flicker 3.8s ease-in-out infinite;
        }
        @keyframes cl-lowpoly-flicker {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 0.95; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cl-lowpoly-glow, .cl-lowpoly-core { animation: none; }
        }
      `}</style>

      <svg
        className="cl-lowpoly-svg"
        viewBox="0 0 200 300"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="The Hermit tarot card in low-poly style"
      >
        <defs>
          <radialGradient id="cl-lowpoly-gold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd882" stopOpacity="0.6" />
            <stop offset="55%" stopColor="#f0aa46" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#f0aa46" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="200" height="300" fill="#14102e" />

        <Facets facets={SKY} />
        <Facets facets={STARS} />
        <Facets facets={RIDGES} />
        <Facets facets={PEAK} />

        {/* lantern glow behind the figure */}
        <ellipse
          className="cl-lowpoly-glow"
          cx="133"
          cy="84.5"
          rx="32"
          ry="29"
          fill="url(#cl-lowpoly-gold)"
        />

        <Facets facets={FIGURE} />
        <Facets facets={LANTERN} />
        <polygon
          points={STAR_CORE.points}
          fill={STAR_CORE.fill}
          className={STAR_CORE.className}
        />

        <Facets facets={FOREGROUND} />

        {/* chrome: numeral */}
        <line x1="58" y1="27" x2="86" y2="27" stroke="#d8cfee" strokeOpacity="0.35" strokeWidth="0.75" />
        <line x1="114" y1="27" x2="142" y2="27" stroke="#d8cfee" strokeOpacity="0.35" strokeWidth="0.75" />
        <text
          x="100"
          y="33"
          textAnchor="middle"
          fontFamily='Futura, "Avenir Next", "Century Gothic", system-ui, sans-serif'
          fontWeight="300"
          fontSize="16"
          letterSpacing="2.5"
          fill="#cfc6ea"
        >
          IX
        </text>

        {/* chrome: name band */}
        <rect x="0" y="256" width="200" height="44" fill="#0a0616" opacity="0.55" />
        <text
          x="100"
          y="283"
          textAnchor="middle"
          fontFamily='Futura, "Avenir Next", "Century Gothic", system-ui, sans-serif'
          fontWeight="300"
          fontSize="10"
          letterSpacing="3.6"
          fill="#e6dff4"
          opacity="0.92"
        >
          THE HERMIT
        </text>

        {/* hairline inner frame */}
        <rect
          x="5"
          y="5"
          width="190"
          height="290"
          rx="9"
          fill="none"
          stroke="#e6dff4"
          strokeOpacity="0.12"
          strokeWidth="1"
        />
      </svg>
    </figure>
  );
}
