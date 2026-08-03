/**
 * Card Lab — BLUEPRINT
 * The Hermit (IX) drafted as an architectural cyanotype: white chalk
 * construction geometry, dimension lines, detail callouts and a drafting
 * title block on blueprint blue with a fine grid.
 * Signature effects (CSS-only):
 *  - draw-on drafting of the chalk linework on mount (stroke-dashoffset)
 *  - softly pulsing corner registration crosshairs
 *  - hover: hidden NOTE 9 annotation slides in + grid brightens
 * Self-contained: inline SVG + scoped <style>, system fonts only.
 */

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
const HAND = '"Segoe Script", "Bradley Hand", "Comic Sans MS", cursive';
const CHALK = '#f2f7fd';

export default function BlueprintHermitCard() {
  return (
    <figure
      className="cl-blueprint-card"
      style={{ aspectRatio: "2/3", width: "100%", position: "relative", margin: 0, containerType: "inline-size" }}
      aria-label="The Hermit tarot card drawn as an architectural blueprint"
    >
      <style>{`
        .cl-blueprint-card svg { display: block; width: 100%; height: 100%; }

        /* lantern glow */
        .cl-blueprint-glow { animation: cl-blueprint-pulse 3.4s ease-in-out infinite; }
        @keyframes cl-blueprint-pulse {
          0%, 100% { opacity: 0.18; }
          50% { opacity: 0.8; }
        }

        /* (1) draw-on drafting: solid chalk lines draw via dashoffset (needs pathLength="1") */
        .cl-blueprint-draw {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: cl-blueprint-draft 1s cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }
        @keyframes cl-blueprint-draft {
          to { stroke-dashoffset: 0; }
        }
        /* dashed construction lines: dashes sweep into place while fading in */
        .cl-blueprint-sketch {
          opacity: 0;
          animation: cl-blueprint-sketch-in 1.2s ease-out forwards;
        }
        @keyframes cl-blueprint-sketch-in {
          from { opacity: 0; stroke-dashoffset: 240; }
          to { opacity: 1; stroke-dashoffset: 0; }
        }

        /* (2) registration crosshairs pulse on a loop */
        .cl-blueprint-reg { animation: cl-blueprint-reg-pulse 3s ease-in-out infinite; }
        @keyframes cl-blueprint-reg-pulse {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 1; }
        }

        /* (3) hover: grid brightens + hidden annotation slides in */
        .cl-blueprint-grid { transition: opacity 0.4s ease; }
        .cl-blueprint-grid-fine { opacity: 0.7; }
        .cl-blueprint-grid-major { opacity: 0.45; }
        .cl-blueprint-card:hover .cl-blueprint-grid-fine { opacity: 1; }
        .cl-blueprint-card:hover .cl-blueprint-grid-major { opacity: 0.95; }
        .cl-blueprint-note9 {
          position: absolute;
          left: 6%;
          bottom: 15%;
          margin: 0;
          padding: 0.4em 0.7em;
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 11px;
          font-size: 3.4cqw;
          letter-spacing: 0.06em;
          color: ${CHALK};
          background: rgba(29, 78, 126, 0.6);
          border: 1px dashed rgba(242, 247, 253, 0.8);
          transform: rotate(-3deg) translateY(10px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .cl-blueprint-card:hover .cl-blueprint-note9 {
          opacity: 1;
          transform: rotate(-3deg) translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .cl-blueprint-glow { animation: none; opacity: 0.45; }
          .cl-blueprint-draw { animation: none; stroke-dashoffset: 0; }
          .cl-blueprint-sketch { animation: none; opacity: 1; }
          .cl-blueprint-reg { animation: none; opacity: 0.8; }
          .cl-blueprint-grid, .cl-blueprint-note9 { transition: none; }
        }
      `}</style>

      <svg
        viewBox="0 0 400 600"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: "absolute", inset: 0 }}
        role="img"
      >
        <defs>
          <pattern id="cl-bp-grid-fine" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M10 0H0V10" fill="none" stroke="#ffffff" strokeOpacity="0.10" strokeWidth="0.4" />
          </pattern>
          <pattern id="cl-bp-grid-major" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M50 0H0V50" fill="none" stroke="#ffffff" strokeOpacity="0.20" strokeWidth="0.6" />
          </pattern>
          <filter id="cl-bp-chalk" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" seed="7" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" />
          </filter>
          <marker id="cl-bp-arr" markerWidth="8" markerHeight="8" refX="5" refY="2.5" orient="auto-start-reverse">
            <path d="M0,0 L5,2.5 L0,5" fill="none" stroke={CHALK} strokeWidth="0.8" />
          </marker>
        </defs>

        {/* paper */}
        <rect x="0" y="0" width="400" height="600" fill="#1d4e7e" />
        <rect className="cl-blueprint-grid cl-blueprint-grid-fine" x="0" y="0" width="400" height="600" fill="url(#cl-bp-grid-fine)" />
        <rect className="cl-blueprint-grid cl-blueprint-grid-major" x="0" y="0" width="400" height="600" fill="url(#cl-bp-grid-major)" />

        {/* slightly irregular paper edge / drawing frame */}
        <path
          d="M13.5,11.2 L386.4,10.1 L389.2,300.4 L387.8,588.6 L200.3,590.2 L11.6,587.9 L10.4,290.7 Z"
          fill="none"
          stroke={CHALK}
          strokeOpacity="0.55"
          strokeWidth="1.4"
        />
        <path
          d="M20,18 L380,17 L382,583 L18,582 Z"
          fill="none"
          stroke={CHALK}
          strokeOpacity="0.25"
          strokeWidth="0.6"
        />

        {/* corner registration crosshairs (pulsing) */}
        <g stroke={CHALK} strokeWidth="0.8" strokeOpacity="0.8" fill="none">
          <g className="cl-blueprint-reg" transform="translate(30 30)">
            <circle r="6" /><path d="M-10,0 H10 M0,-10 V10" />
          </g>
          <g className="cl-blueprint-reg" style={{ animationDelay: "0.7s" }} transform="translate(370 30)">
            <circle r="6" /><path d="M-10,0 H10 M0,-10 V10" />
          </g>
          <g className="cl-blueprint-reg" style={{ animationDelay: "1.4s" }} transform="translate(30 500)">
            <circle r="6" /><path d="M-10,0 H10 M0,-10 V10" />
          </g>
          <g className="cl-blueprint-reg" style={{ animationDelay: "2.1s" }} transform="translate(370 500)">
            <circle r="6" /><path d="M-10,0 H10 M0,-10 V10" />
          </g>
        </g>

        {/* construction geometry (dashed — sweeps in) */}
        <g fill="none" stroke={CHALK}>
          <circle className="cl-blueprint-sketch" cx="200" cy="300" r="150" strokeOpacity="0.35" strokeWidth="0.7" strokeDasharray="6 4" />
          <circle className="cl-blueprint-sketch" style={{ animationDelay: "0.15s" }} cx="200" cy="222" r="34" strokeOpacity="0.4" strokeWidth="0.6" strokeDasharray="3 3" />
          <path className="cl-blueprint-sketch" style={{ animationDelay: "0.3s" }} d="M200,58 V470" strokeOpacity="0.5" strokeWidth="0.7" strokeDasharray="14 4 2 4" />
          <path className="cl-blueprint-sketch" style={{ animationDelay: "0.45s" }} d="M50,300 H350" strokeOpacity="0.3" strokeWidth="0.6" strokeDasharray="14 4 2 4" />
          <path className="cl-blueprint-sketch" style={{ animationDelay: "0.55s" }} d="M60,508 H340" strokeOpacity="0.4" strokeWidth="0.6" strokeDasharray="5 4" />
        </g>

        {/* mountain peak (drawn) */}
        <g fill="none" stroke={CHALK} strokeWidth="1.2" filter="url(#cl-bp-chalk)">
          <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.5s" }} d="M96,508 L200,402 L304,508" />
          <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.65s" }} d="M200,402 L172,452 M200,402 L232,466" strokeWidth="0.7" strokeOpacity="0.7" />
          <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.8s" }} d="M150,470 l14,-10 M170,486 l14,-10 M228,482 l-14,-10" strokeWidth="0.6" strokeOpacity="0.6" />
        </g>

        {/* THE HERMIT — schematic figure (drawn) */}
        <g fill="none" stroke={CHALK} strokeWidth="1.6" filter="url(#cl-bp-chalk)">
          {/* hood + head */}
          <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.8s" }} cx="200" cy="222" r="16" />
          <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.9s" }} d="M178,236 A24,24 0 0 1 222,236" />
          {/* cloak */}
          <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "0.95s" }} d="M178,236 C170,252 162,320 158,398" />
          <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.05s" }} d="M222,236 C230,252 238,320 242,398" />
          <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.15s" }} d="M158,398 C180,406 220,406 242,398" />
          {/* inner folds, dashed */}
          <path className="cl-blueprint-sketch" style={{ animationDelay: "1.3s" }} d="M192,256 C188,310 186,360 186,396" strokeWidth="0.7" strokeDasharray="4 3" strokeOpacity="0.7" />
          <path className="cl-blueprint-sketch" style={{ animationDelay: "1.4s" }} d="M210,256 C214,310 216,360 216,396" strokeWidth="0.7" strokeDasharray="4 3" strokeOpacity="0.7" />
          {/* raised right arm + lantern */}
          <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.2s" }} d="M222,252 L246,220 L266,188" />
          <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.35s" }} cx="266" cy="134" r="3.5" strokeWidth="1" />
          <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.4s" }} d="M266,137 V142" strokeWidth="1" />
          <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.45s" }} d="M256,142 H276 L273,150 H259 Z" strokeWidth="1.1" />
          <rect className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.5s" }} x="257" y="150" width="18" height="26" strokeWidth="1.1" />
          <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.6s" }} d="M257,163 H276 M266,150 V176" strokeWidth="0.6" strokeOpacity="0.8" />
          <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.65s" }} d="M259,176 H273 L271,181 H261 Z" strokeWidth="1.1" />
          {/* star inside lantern */}
          <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.8s" }} d="M266,155 L268,161 L274,163 L268,165 L266,171 L264,165 L258,163 L264,161 Z" strokeWidth="0.9" />
          {/* left arm + staff */}
          <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.25s" }} d="M178,252 L154,268 L146,272" />
          <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.35s" }} d="M140,206 V452" strokeWidth="1.8" />
          <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "1.5s" }} cx="140" cy="201" r="4" strokeWidth="1" />
        </g>

        {/* lantern glow (animated) */}
        <circle className="cl-blueprint-glow" cx="266" cy="163" r="12" fill="#ffffff" opacity="0.3" />

        {/* dimensions + projection lines (sweep in) */}
        <g fill="none" stroke={CHALK} strokeWidth="0.7" strokeOpacity="0.85">
          <path className="cl-blueprint-sketch" style={{ animationDelay: "1.9s" }} d="M182,206 H60 M160,400 H60" strokeDasharray="3 3" />
          <path className="cl-blueprint-sketch" style={{ animationDelay: "2s" }} d="M66,206 V400" markerStart="url(#cl-bp-arr)" markerEnd="url(#cl-bp-arr)" />
          <path className="cl-blueprint-sketch" style={{ animationDelay: "2.05s" }} d="M158,404 V428 M242,404 V428" strokeDasharray="3 3" />
          <path className="cl-blueprint-sketch" style={{ animationDelay: "2.1s" }} d="M158,422 H242" markerStart="url(#cl-bp-arr)" markerEnd="url(#cl-bp-arr)" />
          <path className="cl-blueprint-sketch" style={{ animationDelay: "2.15s" }} d="M232,250 A36,36 0 0 1 258,222" strokeDasharray="2 2" />
          <path className="cl-blueprint-sketch" style={{ animationDelay: "2.2s" }} d="M278,158 L292,142" strokeWidth="0.8" />
          <path className="cl-blueprint-sketch" style={{ animationDelay: "2.25s" }} d="M140,452 V508" strokeDasharray="3 3" strokeOpacity="0.5" />
        </g>

        {/* DETAIL A — lantern callout */}
        <g fill="none" stroke={CHALK}>
          <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.1s" }} cx="326" cy="118" r="40" strokeWidth="1" />
          <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.2s" }} cx="326" cy="118" r="36.5" strokeWidth="0.5" strokeOpacity="0.6" />
          <g strokeWidth="1.1" filter="url(#cl-bp-chalk)">
            <circle className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.3s" }} cx="326" cy="96" r="3" strokeWidth="0.9" />
            <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.35s" }} d="M316,102 H336 L333,108 H319 Z" />
            <rect className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.4s" }} x="318" y="108" width="16" height="22" />
            <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.45s" }} d="M320,130 H332 L330,135 H322 Z" />
            <path className="cl-blueprint-draw" pathLength={1} style={{ animationDelay: "2.5s" }} d="M326,112 L327.6,116.4 L332,118 L327.6,119.6 L326,124 L324.4,119.6 L320,118 L324.4,116.4 Z" strokeWidth="0.8" />
          </g>
          <path className="cl-blueprint-sketch" style={{ animationDelay: "2.55s" }} d="M346,146 v6 m-8,-3 h16" strokeWidth="0.5" strokeOpacity="0.7" />
        </g>

        {/* text layer (fades in after drafting) */}
        <g className="cl-blueprint-sketch" style={{ animationDelay: "2.4s" }} fontFamily={MONO} fill={CHALK}>
          <text x="52" y="303" fontSize="10" textAnchor="middle" transform="rotate(-90 52 303)" letterSpacing="1">1.83</text>
          <text x="200" y="417" fontSize="8" textAnchor="middle" letterSpacing="1">0.92</text>
          <text x="254" y="212" fontSize="8" letterSpacing="0.5">45deg</text>
          <text x="326" y="172" fontSize="7" textAnchor="middle" letterSpacing="0.5">DETAIL A — LANTERN</text>
          <text x="326" y="146" fontSize="5.5" textAnchor="middle" opacity="0.8">Ø0.12</text>
          <text x="22" y="494" fontSize="6.5" opacity="0.75" letterSpacing="0.5">NOTE 9 — LIGHT CARRIED ALOFT, FOR OTHERS</text>
        </g>
        <text
          x="74"
          y="318"
          fontFamily={HAND}
          fontSize="13"
          fill={CHALK}
          opacity="0.9"
          transform="rotate(-5 74 318)"
        >
          solitude, see note 9
        </text>
        <path d="M96,312 C120,300 140,286 158,266" fill="none" stroke={CHALK} strokeWidth="0.6" strokeOpacity="0.7" markerEnd="url(#cl-bp-arr)" />

        {/* IX drafting box */}
        <g>
          <rect x="30" y="44" width="58" height="40" fill="none" stroke={CHALK} strokeWidth="1.2" />
          <rect x="33.5" y="47.5" width="51" height="33" fill="none" stroke={CHALK} strokeWidth="0.5" strokeOpacity="0.7" />
          <text x="59" y="72" fontFamily={MONO} fontSize="20" fill={CHALK} textAnchor="middle" letterSpacing="2">IX</text>
          <text x="206" y="34" fontFamily={MONO} fontSize="6" fill={CHALK} opacity="0.7" textAnchor="middle" letterSpacing="1.5">
            CYANOTYPE STUDY — FIG. 1: THE HERMIT
          </text>
        </g>

        {/* title block strip */}
        <g fontFamily={MONO}>
          <rect x="16" y="524" width="368" height="60" fill="#1d4e7e" fillOpacity="0.6" stroke={CHALK} strokeWidth="1.2" />
          <path d="M160,524 V584 M252,524 V584 M312,524 V584" stroke={CHALK} strokeWidth="0.8" fill="none" />
          <g fill={CHALK} opacity="0.65" fontSize="5.5" letterSpacing="1">
            <text x="22" y="537">TITLE</text>
            <text x="166" y="537">SUIT</text>
            <text x="258" y="537">SCALE</text>
            <text x="318" y="537">SHEET</text>
          </g>
          <g fill={CHALK}>
            <text x="88" y="566" fontSize="13" textAnchor="middle" letterSpacing="2">THE HERMIT</text>
            <text x="206" y="564" fontSize="8.5" textAnchor="middle" letterSpacing="1">MAJOR ARCANA</text>
            <text x="282" y="566" fontSize="12" textAnchor="middle">1:1</text>
            <text x="348" y="564" fontSize="9" textAnchor="middle" letterSpacing="0.5">IX/XXII</text>
          </g>
          <path d="M16,546 H160 M252,546 H384 M160,546 H252" stroke={CHALK} strokeWidth="0.4" strokeOpacity="0.5" fill="none" />
        </g>
      </svg>

      {/* (3) hidden annotation, revealed on hover */}
      <figcaption className="cl-blueprint-note9">NOTE 9: solitude is load-bearing</figcaption>
    </figure>
  );
}
