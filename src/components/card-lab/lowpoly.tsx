/**
 * Card Lab — LOWPOLY style.
 * The Hermit (IX) rendered as a faceted, crystalline low-poly illustration:
 * ~44 flat polygons (no strokes) building a dusk-gradient sky, teal ridges,
 * a violet mountain peak, the hooded figure with staff, and a warm gold
 * lantern whose facets are brightest at the star-core and darken outward.
 * Reusable via optional props: { number, name, variant } — with defaults it
 * renders the original Hermit card pixel-for-pixel. variant 0-7 selects one
 * of 4 hue-rotated palettes x 2 orientations (mirrored composition).
 * Self-contained: inline SVG + scoped <style> (prefix `cl-lowpoly-`).
 */
import { toRoman } from "@/lib/roman";

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
  { points: "128.5,78 137.5,78 133,84.5", fill: "#ffe9a8", className: "cl-lowpoly-lf" },
  { points: "137.5,78 138,90 133,84.5", fill: "#f7c25c", className: "cl-lowpoly-lf cl-lowpoly-lf2" },
  { points: "138,90 128,90 133,84.5", fill: "#e09a35", className: "cl-lowpoly-lf cl-lowpoly-lf3" },
  { points: "128,90 128.5,78 133,84.5", fill: "#ffd97a", className: "cl-lowpoly-lf cl-lowpoly-lf4" },
  { points: "130,90 136,90 133,96", fill: "#6b4a26" },
];

const STAR_CORE: Facet = {
  points:
    "133,80.2 134.3,83.2 137.8,84.5 134.3,85.8 133,88.8 131.7,85.8 128.2,84.5 131.7,83.2",
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

type LowpolyHermitCardProps = {
  /** Major Arcana number 1-22, rendered as a roman numeral. */
  number?: number;
  /** Card name on the bottom band; long names are squeezed to fit. */
  name?: string;
  /** 0-7: 4 hue-rotated palettes x 2 orientations. 0 = original artwork. */
  variant?: number;
};

/** Artwork hue rotation (deg) per variant scheme; 0 keeps the original palette. */
const SCHEME_HUES = [0, -30, 45, -60] as const;

export default function LowpolyHermitCard({
  number = 9,
  name = "THE HERMIT",
  variant = 0,
}: LowpolyHermitCardProps) {
  const v = ((Math.round(variant) % 8) + 8) % 8;
  const scheme = v % 4; // palette scheme
  const mirrored = v >= 4; // upper four variants flip the composition
  const hue = SCHEME_HUES[scheme];
  const hueStyle = hue === 0 ? undefined : { filter: `hue-rotate(${hue}deg)` };
  const starShift = scheme * 5; // decorative stars drift per scheme
  const numeral = toRoman(number);
  const title = name.toUpperCase();
  const longName = title.length >= 14;

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

        /* one-shot staggered layer fade-in on mount */
        .cl-lowpoly-mount { animation: cl-lowpoly-in 0.7s ease both; }
        .cl-lowpoly-m2 { animation-delay: 0.08s; }
        .cl-lowpoly-m3 { animation-delay: 0.16s; }
        .cl-lowpoly-m4 { animation-delay: 0.24s; }
        .cl-lowpoly-m5 { animation-delay: 0.32s; }
        .cl-lowpoly-m6 { animation-delay: 0.4s; }
        @keyframes cl-lowpoly-in {
          from { opacity: 0; }
        }

        /* light waves — bold opacity swing rolling down through the layers in sequence */
        .cl-lowpoly-sh-sky { animation: cl-lowpoly-shimmer 8s ease-in-out 0s infinite, cl-lowpoly-flash 18s linear 0s infinite; }
        .cl-lowpoly-sh-ridge { animation: cl-lowpoly-shimmer 8s ease-in-out -1.2s infinite; }
        .cl-lowpoly-sh-peak { animation: cl-lowpoly-shimmer 8s ease-in-out -2.4s infinite, cl-lowpoly-flash 18s linear -6s infinite; }
        .cl-lowpoly-sh-figure { animation: cl-lowpoly-shimmer 8s ease-in-out -3.6s infinite, cl-lowpoly-flash 18s linear -12s infinite; }
        .cl-lowpoly-sh-fore { animation: cl-lowpoly-shimmer 8s ease-in-out -4.8s infinite; }
        @keyframes cl-lowpoly-shimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        /* facet flash — one group catches light hard, roughly every 6s, rotating groups */
        @keyframes cl-lowpoly-flash {
          0%, 1% { filter: brightness(1); }
          2% { filter: brightness(1.75); }
          3% { filter: brightness(1.1); }
          4% { filter: brightness(1.45); }
          5.5%, 100% { filter: brightness(1); }
        }

        /* stars twinkle on their own quicker beat */
        .cl-lowpoly-stars { animation: cl-lowpoly-twinkle 5s ease-in-out -1.5s infinite; }
        @keyframes cl-lowpoly-twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }

        /* lantern flame flicker; glow can swell on hover (scale, not opacity) */
        .cl-lowpoly-glow {
          animation: cl-lowpoly-flicker 3.8s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: center;
          transition: transform 0.6s ease;
        }
        .cl-lowpoly-core {
          animation: cl-lowpoly-flicker 3.8s ease-in-out infinite, cl-lowpoly-spin 20s linear infinite;
          transform-box: fill-box;
          transform-origin: center;
        }
        @keyframes cl-lowpoly-flicker {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 0.95; }
        }
        @keyframes cl-lowpoly-spin {
          to { transform: rotate(360deg); }
        }

        /* lantern gold facets — brightness ripple cycling outward around the core */
        .cl-lowpoly-lf { animation: cl-lowpoly-ripple 2.4s ease-in-out infinite; }
        .cl-lowpoly-lf2 { animation-delay: -0.6s; }
        .cl-lowpoly-lf3 { animation-delay: -1.2s; }
        .cl-lowpoly-lf4 { animation-delay: -1.8s; }
        @keyframes cl-lowpoly-ripple {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.45); }
        }

        /* hover faux-parallax — layers drift in opposing directions */
        .cl-lowpoly-l-sky, .cl-lowpoly-l-stars, .cl-lowpoly-l-ridge,
        .cl-lowpoly-l-peak, .cl-lowpoly-l-figure, .cl-lowpoly-l-fore {
          transition: transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .cl-lowpoly-card:hover .cl-lowpoly-l-sky { transform: translate(-2px, -3px); }
        .cl-lowpoly-card:hover .cl-lowpoly-l-stars { transform: translate(-3px, -4px); }
        .cl-lowpoly-card:hover .cl-lowpoly-l-ridge { transform: translate(1.5px, -1.5px); }
        .cl-lowpoly-card:hover .cl-lowpoly-l-peak { transform: translate(2px, 1.5px); }
        .cl-lowpoly-card:hover .cl-lowpoly-l-figure { transform: translate(2px, 1.5px); }
        .cl-lowpoly-card:hover .cl-lowpoly-l-fore { transform: translate(3.5px, 3px); }
        .cl-lowpoly-card:hover .cl-lowpoly-glow { transform: scale(1.3); }

        @media (prefers-reduced-motion: reduce) {
          .cl-lowpoly-mount, .cl-lowpoly-sh-sky, .cl-lowpoly-sh-ridge,
          .cl-lowpoly-sh-peak, .cl-lowpoly-sh-figure, .cl-lowpoly-sh-fore,
          .cl-lowpoly-stars, .cl-lowpoly-glow, .cl-lowpoly-core,
          .cl-lowpoly-lf {
            animation: none;
          }
          .cl-lowpoly-l-sky, .cl-lowpoly-l-stars, .cl-lowpoly-l-ridge,
          .cl-lowpoly-l-peak, .cl-lowpoly-l-figure, .cl-lowpoly-l-fore,
          .cl-lowpoly-glow {
            transition: none;
          }
          .cl-lowpoly-card:hover .cl-lowpoly-l-sky,
          .cl-lowpoly-card:hover .cl-lowpoly-l-stars,
          .cl-lowpoly-card:hover .cl-lowpoly-l-ridge,
          .cl-lowpoly-card:hover .cl-lowpoly-l-peak,
          .cl-lowpoly-card:hover .cl-lowpoly-l-figure,
          .cl-lowpoly-card:hover .cl-lowpoly-l-fore,
          .cl-lowpoly-card:hover .cl-lowpoly-glow {
            transform: none;
          }
        }
      `}</style>

      <svg
        className="cl-lowpoly-svg"
        viewBox="0 0 200 300"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={`${title} tarot card in low-poly style`}
      >
        <defs>
          <radialGradient id="cl-lowpoly-gold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd882" stopOpacity="0.6" />
            <stop offset="55%" stopColor="#f0aa46" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#f0aa46" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="200" height="300" fill="#14102e" />

        {/* artwork: palette hue lives on the mount groups (they only animate
            opacity, so it never fights the shimmer/flash filter animations);
            variants >= 4 mirror the whole composition, chrome stays put */}
        <g transform={mirrored ? "translate(200 0) scale(-1 1)" : undefined}>
          <g className="cl-lowpoly-mount" style={hueStyle}>
            <g className="cl-lowpoly-l-sky cl-lowpoly-sh-sky">
              <Facets facets={SKY} />
            </g>
          </g>
          <g
            className="cl-lowpoly-mount cl-lowpoly-m2"
            style={hueStyle}
            transform={starShift ? `translate(${starShift} ${-scheme * 3})` : undefined}
          >
            <g className="cl-lowpoly-l-stars cl-lowpoly-stars">
              <Facets facets={STARS} />
            </g>
          </g>
          <g className="cl-lowpoly-mount cl-lowpoly-m3" style={hueStyle}>
            <g className="cl-lowpoly-l-ridge cl-lowpoly-sh-ridge">
              <Facets facets={RIDGES} />
            </g>
          </g>
          <g className="cl-lowpoly-mount cl-lowpoly-m4" style={hueStyle}>
            <g className="cl-lowpoly-l-peak cl-lowpoly-sh-peak">
              <Facets facets={PEAK} />
            </g>
          </g>

          <g className="cl-lowpoly-mount cl-lowpoly-m5" style={hueStyle}>
            <g className="cl-lowpoly-l-figure cl-lowpoly-sh-figure">
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
            </g>
          </g>

          <g className="cl-lowpoly-mount cl-lowpoly-m6" style={hueStyle}>
            <g className="cl-lowpoly-l-fore cl-lowpoly-sh-fore">
              <Facets facets={FOREGROUND} />
            </g>
          </g>
        </g>

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
          {numeral}
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
          {...(longName ? { textLength: 150, lengthAdjust: "spacingAndGlyphs" } : {})}
        >
          {title}
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
