// Planetary Hours — full deck (default: The Hermit IX)
// An occult timetable plate on cream parchment, ink with one red accent.
// A large heptagram (Star of the Magi) inscribed in a circle; planet glyphs
// in roundels at the seven points, arranged clockwise Sun..Mars so that
// following the star's continuous line yields the Chaldean hour sequence.
// Outer ring of day/night hour ticks with the seven day names in manuscript
// caps; the sector of the card's ruling planet is washed in red. The center
// medallion carries a per-card ink vignette (Magician, Empress, Chariot,
// Hermit, Wheel, Death, Star, Fool).

const SERIF = "Georgia, 'Times New Roman', 'Palatino Linotype', serif";

const INK = "#3b2c1c";
const RED = "#9e2b25";
const PAPER = "#efe3c8";

const CX = 150;
const CY = 215;
const STAR_R = 64; // heptagram vertices
const ROUNDEL_R = 77.5; // glyph roundel centers
const RING_IN = 92; // tick band inner edge
const RING_OUT = 106.5; // ring outer edge
const LABEL_R = 99.5; // day-name baseline radius
const MARK_R = 112; // tiny day/night glyph radius

// Clockwise from top: Sun, Venus, Mercury, Moon, Saturn, Jupiter, Mars.
// prettier-ignore — each glyph must stay glued to its U+FE0E selector
const GLYPHS = ["☉︎", "♀︎", "☿︎", "☽︎", "♄︎", "♃︎", "♂︎"];
const DAYS = [
  "DIES SOLIS", "DIES VENERIS", "DIES MERCURII", "DIES LUNAE",
  "DIES SATURNI", "DIES IOVIS", "DIES MARTIS",
];

// Card number -> index of its ruling planet in the ring order above:
// Magician Mercury, Empress Venus, Chariot Moon, Hermit Saturn,
// Wheel Jupiter, Death Mars, Star Jupiter, Fool Mercury.
const RULER: Record<number, number> = {
  1: 2, 3: 1, 7: 3, 9: 4, 10: 5, 13: 6, 17: 5, 22: 2,
};
const ROMAN: Record<number, string> = {
  1: "I", 3: "III", 7: "VII", 9: "IX", 10: "X", 13: "XIII", 17: "XVII", 22: "XXII",
};

type Pt = { x: number; y: number; deg: number };

const DEG = Math.PI / 180;
const STEP = 360 / 7;

const PTS: Pt[] = Array.from({ length: 7 }, (_, k) => {
  const deg = -90 + k * STEP;
  return {
    x: CX + STAR_R * Math.cos(deg * DEG),
    y: CY + STAR_R * Math.sin(deg * DEG),
    deg,
  };
});

// Step-3 path order — one continuous line, the planetary hour sequence.
const SEQ = [0, 3, 6, 2, 5, 1, 4];
const STAR_D =
  SEQ.map((k, i) => `${i === 0 ? "M" : "L"}${PTS[k].x.toFixed(2)} ${PTS[k].y.toFixed(2)}`).join(" ") +
  " Z";

// Direction arrows at the midpoint of each star edge, in travel order.
const ARROWS = SEQ.map((from, i) => {
  const a = PTS[from];
  const b = PTS[SEQ[(i + 1) % 7]];
  const t = 0.55;
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    rot: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI,
  };
});

// 24 hour ticks per day-sector: 12 long day ticks, 12 short night ticks.
const TICKS = PTS.flatMap((p, k) => {
  const base = p.deg - STEP / 2;
  return Array.from({ length: 23 }, (_, i) => {
    const h = i + 1;
    const a = (base + (h * STEP) / 24) * DEG;
    const len = h <= 12 ? 5 : 3;
    return {
      key: `${k}-${h}`,
      x1: CX + RING_IN * Math.cos(a),
      y1: CY + RING_IN * Math.sin(a),
      x2: CX + (RING_IN + len) * Math.cos(a),
      y2: CY + (RING_IN + len) * Math.sin(a),
      night: h > 12,
    };
  });
});

// Sector boundary lines, one pair per day.
const BOUNDS = PTS.map((p) => {
  const a = (p.deg - STEP / 2) * DEG;
  return {
    x1: CX + RING_IN * Math.cos(a),
    y1: CY + RING_IN * Math.sin(a),
    x2: CX + RING_OUT * Math.cos(a),
    y2: CY + RING_OUT * Math.sin(a),
  };
});

// Annular wedge (the red ruling-planet wash).
function wedge(rIn: number, rOut: number, degC: number): string {
  const a0 = (degC - STEP / 2) * DEG;
  const a1 = (degC + STEP / 2) * DEG;
  const p = (r: number, a: number) => `${(CX + r * Math.cos(a)).toFixed(2)} ${(CY + r * Math.sin(a)).toFixed(2)}`;
  return `M${p(rOut, a0)} A${rOut} ${rOut} 0 0 1 ${p(rOut, a1)} L${p(rIn, a1)} A${rIn} ${rIn} 0 0 0 ${p(rIn, a0)} Z`;
}

function labelRot(deg: number): number {
  const n = ((deg % 360) + 360) % 360;
  return n > 0 && n < 180 ? deg - 90 : deg + 90;
}

// Center-medallion ink vignettes. Each returns content in a local frame of
// roughly x -18..14, y -20..36; the caller wraps it in translate+scale so it
// fits inside the r=21 medallion.
function medallionScene(n: number) {
  switch (n) {
    case 1: // The Magician — wand raised, table bearing the four tools, lemniscate
      return (
        <g transform="translate(0 -12)">
          <path
            d="M0 -3 C2 -6.5 6.5 -6.5 6.5 -3 C6.5 0.5 2 0.5 0 -3 C-2 -6.5 -6.5 -6.5 -6.5 -3 C-6.5 0.5 -2 0.5 0 -3 Z"
            fill="none"
            stroke={INK}
            strokeWidth="0.8"
          />
          <path
            d="M0 2 C-4 3 -6 7 -7 13 C-8 19 -8 24 -8.2 28 L8.2 28 C8 24 8 19 7 13 C6 7 4 3 0 2 Z"
            fill={INK}
          />
          <ellipse cx="-0.5" cy="8" rx="2.2" ry="2.8" fill={PAPER} opacity="0.9" />
          <path d="M5 12 C8 8 10 4 11.5 -1 L13 0 C11.5 5 9 9.5 6 13.5 Z" fill={INK} />
          <line x1="12" y1="-1" x2="14.5" y2="-7" stroke={INK} strokeWidth="1" />
          <rect x="-13" y="31" width="26" height="1.6" fill={INK} />
          <rect x="-11.5" y="32.6" width="1.2" height="3" fill={INK} />
          <rect x="10.3" y="32.6" width="1.2" height="3" fill={INK} />
          <circle cx="-8" cy="29.6" r="1.2" fill="none" stroke={INK} strokeWidth="0.6" />
          <path d="M-3 30.6 L-1 27.6 L1 30.6 Z" fill="none" stroke={INK} strokeWidth="0.6" />
          <line x1="4" y1="30.6" x2="7" y2="27.8" stroke={INK} strokeWidth="0.7" />
          <path d="M9 27.8 h2.4 M10.2 27 v3.6" stroke={INK} strokeWidth="0.6" fill="none" />
        </g>
      );
    case 3: // The Empress — crowned, scepter, Venus shield, wheat at the hem
      return (
        <g transform="translate(0 -12)">
          <path d="M0 4 C-6 4 -9.5 12 -10.5 30 L10.5 30 C9.5 12 6 4 0 4 Z" fill={INK} />
          <circle cx="0" cy="0" r="2.7" fill={INK} />
          <path d="M-3.2 -2.2 L-3.2 -5.6 L-1.6 -4 L0 -6.8 L1.6 -4 L3.2 -5.6 L3.2 -2.2 Z" fill={INK} />
          <line x1="8" y1="14" x2="11" y2="-2" stroke={INK} strokeWidth="0.9" />
          <circle cx="11" cy="-2.5" r="1.3" fill={INK} />
          <circle cx="-8" cy="16" r="3.4" fill={PAPER} stroke={INK} strokeWidth="0.7" />
          <text x="-8" y="16.8" textAnchor="middle" fontFamily={SERIF} fontSize="5" fill={INK}>
            {"♀︎"}
          </text>
          <path d="M-5 30 l-1.5 -4 M0 30 l0 -4.5 M5 30 l1.5 -4" stroke={PAPER} strokeWidth="0.6" fill="none" />
        </g>
      );
    case 7: // The Chariot — starred canopy, cubicle, driver, two wheels
      return (
        <g transform="translate(0 -14)">
          <path d="M-12 2 Q0 -5 12 2 L12 4 L-12 4 Z" fill={INK} />
          <circle cx="-5" cy="1" r="0.5" fill={PAPER} />
          <circle cx="0" cy="0.2" r="0.5" fill={PAPER} />
          <circle cx="5" cy="1" r="0.5" fill={PAPER} />
          <rect x="-11" y="4" width="0.9" height="12" fill={INK} />
          <rect x="-4" y="4" width="0.9" height="12" fill={INK} />
          <rect x="3.1" y="4" width="0.9" height="12" fill={INK} />
          <rect x="10.1" y="4" width="0.9" height="12" fill={INK} />
          <circle cx="0" cy="9" r="2" fill={INK} />
          <path d="M-4 16 C-3 11 3 11 4 16 Z" fill={INK} />
          <rect x="-9" y="16" width="18" height="9" fill="none" stroke={INK} strokeWidth="0.9" />
          <line x1="-9" y1="20.5" x2="9" y2="20.5" stroke={INK} strokeWidth="0.5" />
          <circle cx="-6.5" cy="27.5" r="3.6" fill="none" stroke={INK} strokeWidth="1" />
          <circle cx="6.5" cy="27.5" r="3.6" fill="none" stroke={INK} strokeWidth="1" />
          <circle cx="-6.5" cy="27.5" r="0.7" fill={INK} />
          <circle cx="6.5" cy="27.5" r="0.7" fill={INK} />
        </g>
      );
    case 10: // Wheel of Fortune — spoked wheel, crest figure, riser and faller
      return (
        <g transform="translate(0 0)">
          <circle cx="0" cy="0" r="13.5" fill="none" stroke={INK} strokeWidth="1.1" />
          <circle cx="0" cy="0" r="3" fill="none" stroke={INK} strokeWidth="0.8" />
          {[0, 45, 90, 135].map((a) => (
            <line key={a} x1="0" y1="-13.5" x2="0" y2="-3" stroke={INK} strokeWidth="0.7" transform={`rotate(${a})`} />
          ))}
          <circle cx="0" cy="0" r="0.8" fill={INK} />
          <path d="M-2.6 -14.9 h5.2 v1.5 h-5.2 Z" fill={INK} />
          <circle cx="0" cy="-16.6" r="1.8" fill={INK} />
          <g transform="translate(14.8 5) rotate(45)">
            <circle cx="0" cy="0" r="1.4" fill={INK} />
            <path d="M-1.4 1.1 h2.8 v3.2 h-2.8 Z" fill={INK} />
          </g>
          <g transform="translate(-14.8 5) rotate(-45)">
            <circle cx="0" cy="0" r="1.4" fill={INK} />
            <path d="M-1.4 1.1 h2.8 v3.2 h-2.8 Z" fill={INK} />
          </g>
        </g>
      );
    case 13: // Death — skeletal rider, walking horse, rose banner
      return (
        <g transform="translate(0 -13)">
          <line x1="-9" y1="-2" x2="-9" y2="24" stroke={INK} strokeWidth="0.9" />
          <path d="M-17 -2 h8 v5.5 h-8 Z" fill={INK} />
          <circle cx="-13" cy="0.7" r="1.4" fill={PAPER} />
          <circle cx="-13" cy="0.7" r="0.4" fill={INK} />
          <ellipse cx="-1" cy="20" rx="9" ry="4.2" fill={INK} />
          <path d="M5 18 C7 13 9 11 11 10.5 L12.5 12 C10.5 13 9 15 8 19 Z" fill={INK} />
          <circle cx="12" cy="11" r="1.6" fill={INK} />
          <path d="M-8 23 l-1 6 M-4 23.5 l-0.5 5.5 M2 23.5 l0.5 5.5 M6 23 l1 6" stroke={INK} strokeWidth="1.1" fill="none" />
          <path d="M-3 18 L-2 8 L2 8 L3 18 Z" fill={INK} />
          <path d="M-2.2 11 h4.4 M-2.4 13.5 h4.8" stroke={PAPER} strokeWidth="0.6" fill="none" />
          <circle cx="0" cy="5" r="2.4" fill={PAPER} stroke={INK} strokeWidth="0.7" />
          <circle cx="-0.8" cy="4.8" r="0.4" fill={INK} />
          <circle cx="0.8" cy="4.8" r="0.4" fill={INK} />
        </g>
      );
    case 17: // The Star — eight-point star, kneeling figure with two jugs
      return (
        <g transform="translate(0 -12)">
          <circle className="cz-ph-lant" cx="0" cy="0" r="9" fill="url(#cz-ph-lant-g)" />
          <use href="#cz-ph-star4" transform="scale(1.4)" fill={INK} />
          <use href="#cz-ph-star4" transform="rotate(45) scale(1.4)" fill={INK} />
          <circle cx="-10" cy="-3" r="0.7" fill={INK} />
          <circle cx="10" cy="-3" r="0.7" fill={INK} />
          <circle cx="-7" cy="-7" r="0.6" fill={INK} />
          <circle cx="7" cy="-7" r="0.6" fill={INK} />
          <path d="M-9 30 C-9 20 -5 15 0 15 C2.5 15 4 17.5 4 21 L4 30 Z" fill={INK} />
          <circle cx="-5.5" cy="12.5" r="2.2" fill={INK} />
          <circle cx="6.5" cy="19" r="2.2" fill={INK} />
          <rect x="5.9" y="15.8" width="1.2" height="1.8" fill={INK} />
          <circle cx="11" cy="24.5" r="1.8" fill={INK} />
          <rect x="10.5" y="21.9" width="1" height="1.5" fill={INK} />
          <path d="M7.5 21.5 q1 3 0 6 M12 26.5 q0.8 2.5 0 5" stroke={INK} strokeWidth="0.6" fill="none" />
        </g>
      );
    case 22: // The Fool — stepping off the cliff, bindle staff, little dog, sun
      return (
        <g transform="translate(0 -12)">
          <circle className="cz-ph-lant" cx="10" cy="-2" r="5" fill="url(#cz-ph-lant-g)" />
          <circle cx="10" cy="-2" r="2" fill={INK} />
          <path d="M-14 32 L-14 14 L-10 17 L-7 12 L-3 16 L-3 32 Z" fill={INK} />
          <circle cx="3" cy="6" r="2.1" fill={INK} />
          <path d="M3 8.5 L3 17" stroke={INK} strokeWidth="1.6" />
          <path d="M3 17 L6.5 23 M3 17 L0.5 22" stroke={INK} strokeWidth="1.2" fill="none" />
          <path d="M3 10 L-2 14" stroke={INK} strokeWidth="1" />
          <line x1="-4" y1="16" x2="9" y2="4" stroke={INK} strokeWidth="0.9" />
          <circle cx="-4.5" cy="16.5" r="1.9" fill={INK} />
          <path d="M-4.5 14.8 q1.9 1.7 0 3.4" stroke={PAPER} strokeWidth="0.5" fill="none" />
          <ellipse cx="-9" cy="12.5" rx="2.2" ry="1.3" fill={INK} />
          <circle cx="-7" cy="11.3" r="1" fill={INK} />
          <path d="M-10 13.6 l-0.4 2.6 M-8 13.8 l0.2 2.4" stroke={INK} strokeWidth="0.6" />
        </g>
      );
    default: // 9 — The Hermit — hooded, staff and raised lantern
      return (
        <g transform="translate(0 -11)">
          <circle className="cz-ph-lant" cx="12.5" cy="17" r="7" fill="url(#cz-ph-lant-g)" />
          <path
            d="M0 0 C-4 1 -6.5 5 -7.5 10 C-8.5 16 -9 21 -9.2 27 L7.2 27
               C7 21 6.5 16 5.5 10 C4.5 5 3 1 0 0 Z"
            fill={INK}
          />
          <ellipse cx="-0.6" cy="6.6" rx="2.3" ry="2.9" fill={PAPER} opacity="0.9" />
          <path d="M-10.6 -1 L-10 -1 L-11.6 28 L-12.2 28 Z" fill={INK} />
          <path d="M4.8 12 C7.6 10 10 8 12.2 5.6 L13.6 7 C11.6 10 8.8 12.4 5.8 14 Z" fill={INK} />
          <circle cx="12.5" cy="17" r="1.9" fill="#f2c96e" stroke={INK} strokeWidth="0.6" />
        </g>
      );
  }
}

type Props = {
  number?: number;
  name?: string;
  variant?: number;
};

export default function PlanetaryHoursCard({
  number = 9,
  name = "THE HERMIT",
  variant = 0,
}: Props) {
  const accentK = RULER[number] ?? 4;
  const roman = ROMAN[number] ?? "IX";
  const v = ((Math.round(variant) % 8) + 8) % 8;

  const accentWedge = wedge(RING_IN, RING_OUT, PTS[accentK].deg);

  // Title metrics — shrink and re-space for long names like WHEEL OF FORTUNE.
  const longTitle = name.length > 10;
  const titleSize = name.length > 12 ? 9.5 : longTitle ? 10.5 : 12;
  const titleLs = name.length > 12 ? 3 : 5;
  const titleHalf = (name.length * (titleSize * 0.62 + titleLs)) / 2 + 6;
  const rule1X = longTitle ? 150 - titleHalf - 26 : 74;
  const rule2X = longTitle ? 150 + titleHalf + 6 : 206;

  // Header metrics for longer numerals (XIII, XVII, XXII).
  const headLong = roman.length > 2;
  const headHalf = (roman.length * (12 * 0.7 + 4)) / 2;
  const hRule1X = headLong ? 150 - headHalf - 24 : 112;
  const hRule2X = headLong ? 150 + headHalf + 6 : 170;

  // Variant flavour: corner ornament, marker phase/direction/period, hairlines.
  // New scenes are drawn in a wider local frame and scaled down to fit the
  // medallion; the Hermit keeps its original exact placement (scale 1).
  const sceneScale = number === 9 || !(number in RULER) ? "" : " scale(0.72)";
  const corner = v % 2 === 1 ? "#cz-ph-dia" : "#cz-ph-star4";
  const markerClass = v % 2 === 1 ? "cz-ph-marker-rev" : "cz-ph-marker";
  const markerStyle = {
    animationDuration: `${75 + v * 4}s`,
    animationDelay: `${-v * 9}s`,
  };

  return (
    <figure
      className="cz-ph-card"
      style={{ aspectRatio: "2/3", width: "100%" }}
    >
      <style>{`
        .cz-ph-card {
          position: relative;
          margin: 0;
          overflow: hidden;
          border-radius: 12px;
          background: ${PAPER};
        }
        .cz-ph-card svg { display: block; width: 100%; height: 100%; }

        @keyframes cz-ph-draw {
          from { stroke-dashoffset: 1000; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes cz-ph-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cz-ph-fade-up {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cz-ph-pop {
          from { opacity: 0; transform: scale(0.2); }
          60%  { opacity: 1; }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes cz-ph-travel {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -1000; }
        }
        @keyframes cz-ph-travel-rev {
          from { stroke-dashoffset: -1000; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes cz-ph-lant {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 0.95; }
        }

        .cz-ph-frame  { animation: cz-ph-fade 0.9s ease-out both; }
        .cz-ph-head   { animation: cz-ph-fade-up 0.7s ease-out 0.25s both; }
        .cz-ph-lines  { animation: cz-ph-fade 1.2s ease-out 0.4s both; }
        .cz-ph-ring   { animation: cz-ph-fade 1s ease-out 0.5s both; }
        .cz-ph-draw {
          stroke-dasharray: 1000;
          stroke-dashoffset: 0;
          animation: cz-ph-draw 1.8s ease-in-out 0.15s both;
        }
        .cz-ph-roundel {
          transform-box: fill-box;
          transform-origin: center;
          animation: cz-ph-pop 0.5s ease-out both;
        }
        .cz-ph-names  { animation: cz-ph-fade 0.9s ease-out 1.55s both; }
        .cz-ph-arrows { animation: cz-ph-fade 0.8s ease-out 1.75s both; }
        .cz-ph-center {
          transform-box: fill-box;
          transform-origin: center;
          animation: cz-ph-pop 0.7s ease-out 1.15s both;
        }
        .cz-ph-title  { animation: cz-ph-fade-up 0.8s ease-out 1.9s both; }

        .cz-ph-marker, .cz-ph-marker-rev {
          stroke-dasharray: 1 999;
          stroke-dashoffset: 0;
        }
        .cz-ph-marker     { animation: cz-ph-travel 75s linear infinite; }
        .cz-ph-marker-rev { animation: cz-ph-travel-rev 75s linear infinite; }
        .cz-ph-lant { animation: cz-ph-lant 22s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .cz-ph-frame, .cz-ph-head, .cz-ph-lines, .cz-ph-ring, .cz-ph-draw,
          .cz-ph-roundel, .cz-ph-names, .cz-ph-arrows, .cz-ph-center,
          .cz-ph-title, .cz-ph-marker, .cz-ph-marker-rev, .cz-ph-lant {
            animation: none !important;
          }
          .cz-ph-draw { stroke-dashoffset: 0; }
          .cz-ph-marker, .cz-ph-marker-rev { opacity: 0; }
        }
      `}</style>

      <svg
        viewBox="0 0 300 450"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={`${name} tarot card as a planetary hours heptagram plate`}
      >
        <defs>
          <radialGradient id="cz-ph-bg" cx="50%" cy="44%" r="85%">
            <stop offset="0%" stopColor="#f6edda" />
            <stop offset="60%" stopColor="#eee1c4" />
            <stop offset="100%" stopColor="#ddcbA3" />
          </radialGradient>
          <radialGradient id="cz-ph-lant-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f2c96e" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#f2c96e" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cz-ph-vig" cx="50%" cy="46%" r="80%">
            <stop offset="0%" stopColor="#5a4526" stopOpacity="0" />
            <stop offset="82%" stopColor="#5a4526" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#4a371c" stopOpacity="0.22" />
          </radialGradient>
          <path
            id="cz-ph-star4"
            d="M0 -5 L1.3 -1.3 L5 0 L1.3 1.3 L0 5 L-1.3 1.3 L-5 0 L-1.3 -1.3 Z"
          />
          <path id="cz-ph-dia" d="M0 -4 L4 0 L0 4 L-4 0 Z" />
        </defs>

        {/* Parchment ground */}
        <rect x="0" y="0" width="300" height="450" fill="url(#cz-ph-bg)" />

        {/* Header — roman numeral with flanking rules */}
        <g className="cz-ph-head">
          <rect x={hRule1X} y="33.6" width="18" height="0.7" fill={INK} opacity="0.6" />
          <rect x={hRule2X} y="33.6" width="18" height="0.7" fill={INK} opacity="0.6" />
          <text
            x="150"
            y="38.5"
            textAnchor="middle"
            fontFamily={SERIF}
            fontSize="12"
            letterSpacing="4"
            fill={INK}
          >
            {roman}
          </text>
        </g>

        {/* Fine ruled construction lines */}
        <g className="cz-ph-lines" stroke={INK} opacity={v >= 4 ? 0.09 : 0.14}>
          <line x1="30" y1={CY} x2="270" y2={CY} strokeWidth="0.5" />
          <line x1={CX} y1="99" x2={CX} y2="331" strokeWidth="0.5" />
          <line x1="68" y1="133" x2="232" y2="297" strokeWidth="0.4" />
          <line x1="232" y1="133" x2="68" y2="297" strokeWidth="0.4" />
          <circle
            cx={CX}
            cy={CY}
            r={ROUNDEL_R}
            fill="none"
            strokeWidth="0.5"
            strokeDasharray={v >= 4 ? "1 2.5" : "2 3.5"}
          />
        </g>

        {/* Outer ring: boundaries, hour ticks, red ruling-planet wash */}
        <g className="cz-ph-ring">
          <path d={accentWedge} fill={RED} opacity="0.09" />
          <circle cx={CX} cy={CY} r={RING_OUT} fill="none" stroke={INK} strokeWidth="0.9" opacity="0.85" />
          <circle cx={CX} cy={CY} r={RING_IN} fill="none" stroke={INK} strokeWidth="0.9" opacity="0.85" />
          {BOUNDS.map((b, i) => (
            <line
              key={i}
              x1={b.x1}
              y1={b.y1}
              x2={b.x2}
              y2={b.y2}
              stroke={INK}
              strokeWidth="0.7"
              opacity="0.7"
            />
          ))}
          {TICKS.map((t) => (
            <line
              key={t.key}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={INK}
              strokeWidth="0.5"
              opacity={t.night ? 0.4 : 0.65}
            />
          ))}
        </g>

        {/* Day names in manuscript caps + tiny day/night marks */}
        <g className="cz-ph-names">
          {PTS.map((p, k) => {
            const a = p.deg * DEG;
            return (
              <g key={k}>
                <g transform={`translate(${(CX + LABEL_R * Math.cos(a)).toFixed(2)} ${(CY + LABEL_R * Math.sin(a)).toFixed(2)}) rotate(${labelRot(p.deg).toFixed(2)})`}>
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily={SERIF}
                    fontSize="5.8"
                    letterSpacing="1.1"
                    fill={k === accentK ? RED : INK}
                    opacity={k === accentK ? 1 : 0.9}
                  >
                    {DAYS[k]}
                  </text>
                </g>
                {/* tiny sun / moon marks for the day and night halves */}
                {[-1, 1].map((s) => {
                  const ma = (p.deg + s * STEP / 4) * DEG;
                  return (
                    <text
                      key={s}
                      x={(CX + MARK_R * Math.cos(ma)).toFixed(2)}
                      y={(CY + MARK_R * Math.sin(ma)).toFixed(2)}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontFamily={SERIF}
                      fontSize="4.4"
                      fill={INK}
                      opacity="0.55"
                    >
                      {s < 0 ? "☉︎" : "☽︎"}
                    </text>
                  );
                })}
              </g>
            );
          })}
        </g>

        {/* Circumscribed circle */}
        <circle
          cx={CX}
          cy={CY}
          r={STAR_R}
          fill="none"
          stroke={INK}
          strokeWidth="0.6"
          opacity="0.5"
          className="cz-ph-ring"
        />

        {/* The heptagram — draws itself as one continuous stroke */}
        <path
          className="cz-ph-draw"
          d={STAR_D}
          pathLength={1000}
          fill="none"
          stroke={INK}
          strokeWidth="1.15"
          strokeLinejoin="round"
        />

        {/* Ambient marker dot traveling the star, very slowly */}
        <path
          className={markerClass}
          style={markerStyle}
          d={STAR_D}
          pathLength={1000}
          fill="none"
          stroke={RED}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Hour-sequence arrows along the star's path */}
        <g className="cz-ph-arrows">
          {ARROWS.map((a, i) => (
            <path
              key={i}
              d="M3.4 0 L-2.3 2.1 L-2.3 -2.1 Z"
              transform={`translate(${a.x.toFixed(2)} ${a.y.toFixed(2)}) rotate(${a.rot.toFixed(1)})`}
              fill={INK}
              opacity="0.85"
            />
          ))}
        </g>

        {/* Planet roundels — pop in along the hour sequence */}
        {SEQ.map((k, i) => {
          const a = PTS[k].deg * DEG;
          const x = CX + ROUNDEL_R * Math.cos(a);
          const y = CY + ROUNDEL_R * Math.sin(a);
          const acc = k === accentK;
          return (
            <g
              key={k}
              className="cz-ph-roundel"
              style={{ animationDelay: `${(0.85 + i * 0.11).toFixed(2)}s` }}
            >
              <circle
                cx={x}
                cy={y}
                r="10.5"
                fill="#f4ead2"
                stroke={acc ? RED : INK}
                strokeWidth={acc ? 1.1 : 0.9}
              />
              <circle
                cx={x}
                cy={y}
                r="8.2"
                fill="none"
                stroke={acc ? RED : INK}
                strokeWidth="0.4"
                opacity="0.5"
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                dy="0.5"
                fontFamily={SERIF}
                fontSize="9.5"
                fill={acc ? RED : INK}
              >
                {GLYPHS[k]}
              </text>
            </g>
          );
        })}

        {/* Center medallion: the card's ink vignette */}
        <g className="cz-ph-center">
          <circle cx={CX} cy={CY} r="21" fill="#f4ead2" stroke={INK} strokeWidth="0.9" />
          <circle cx={CX} cy={CY} r="18.5" fill="none" stroke={INK} strokeWidth="0.4" opacity="0.5" />
          <g transform={`translate(${CX} ${CY})${sceneScale}`}>{medallionScene(number)}</g>
        </g>

        {/* Title block */}
        <g className="cz-ph-title">
          <rect x={rule1X} y="393" width="20" height="0.8" fill={INK} opacity="0.6" />
          <rect x={rule2X} y="393" width="20" height="0.8" fill={INK} opacity="0.6" />
          <text
            x="150"
            y="398"
            textAnchor="middle"
            fontFamily={SERIF}
            fontSize={titleSize}
            letterSpacing={titleLs}
            fill={INK}
          >
            {name}
          </text>
          <text
            x="150"
            y="413"
            textAnchor="middle"
            fontFamily={SERIF}
            fontStyle="italic"
            fontSize="8"
            letterSpacing="2"
            fill={INK}
            opacity="0.75"
          >
            horae planetarum
          </text>
        </g>

        {/* Thin ink frame with small star corners */}
        <g className="cz-ph-frame">
          <rect
            x="8"
            y="8"
            width="284"
            height="434"
            rx="7"
            fill="none"
            stroke={INK}
            strokeOpacity="0.5"
            strokeWidth="1"
          />
          <rect
            x="13.5"
            y="13.5"
            width="273"
            height="423"
            rx="4"
            fill="none"
            stroke={INK}
            strokeOpacity="0.25"
            strokeWidth="0.6"
          />
          <use href={corner} transform="translate(26 26)" fill={INK} opacity="0.6" />
          <use href={corner} transform="translate(274 26)" fill={INK} opacity="0.6" />
          <use href={corner} transform="translate(274 424)" fill={INK} opacity="0.6" />
          <use href={corner} transform="translate(26 424)" fill={INK} opacity="0.6" />
        </g>

        {/* Parchment vignette */}
        <rect x="0" y="0" width="300" height="450" fill="url(#cz-ph-vig)" />
      </svg>
    </figure>
  );
}
