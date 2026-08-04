// LANDING / PLANETARY-HOURS — a design exploration of the production landing
// in the "Occult Diagram Manuscript" language of
// src/components/cards/planetary-hours.tsx: cream parchment, sepia ink, one
// red accent, ruled construction lines, and the heptagram (Star of the Magi)
// whose continuous line yields the Chaldean order of planetary hours.
// Fully self-contained: inline SVG, Tailwind for layout, one scoped <style>
// block (lph- prefixed) for the rest. Server-component safe: no hooks,
// CSS animations only, statically prerendered.

import type { Metadata } from "next";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Astro Scope — Seven rulers. Seven days. One order of hours.",
  description:
    "Free birth chart, daily horoscopes, synastry and tarot — an occult diagram manuscript for reading the sky.",
};

const DEG = Math.PI / 180;

// the deck's manuscript palette
const INK = "#3b2c1c";
const RED = "#9e2b25";
const PAPER = "#f3e9d2";
const PLATE = "#f8f0dc";

const SERIF = "Georgia, 'Times New Roman', 'Palatino Linotype', serif";
const GLYPH_FONT = "'DejaVu Sans', 'Segoe UI Symbol', Georgia, serif";

// every glyph is written as an escape so U+FE0E (text presentation, never
// emoji) cannot be lost between editors
const SIGNS = [
  { g: "♈︎", n: "Aries", d: "Mar 21 – Apr 19" },
  { g: "♉︎", n: "Taurus", d: "Apr 20 – May 20" },
  { g: "♊︎", n: "Gemini", d: "May 21 – Jun 20" },
  { g: "♋︎", n: "Cancer", d: "Jun 21 – Jul 22" },
  { g: "♌︎", n: "Leo", d: "Jul 23 – Aug 22" },
  { g: "♍︎", n: "Virgo", d: "Aug 23 – Sep 22" },
  { g: "♎︎", n: "Libra", d: "Sep 23 – Oct 22" },
  { g: "♏︎", n: "Scorpio", d: "Oct 23 – Nov 21" },
  { g: "♐︎", n: "Sagittarius", d: "Nov 22 – Dec 21" },
  { g: "♑︎", n: "Capricorn", d: "Dec 22 – Jan 19" },
  { g: "♒︎", n: "Aquarius", d: "Jan 20 – Feb 18" },
  { g: "♓︎", n: "Pisces", d: "Feb 19 – Mar 20" },
];

// clockwise from the top: Sun, Venus, Mercury, Moon, Saturn, Jupiter, Mars
const PLANET_GLYPHS = ["☉︎", "♀︎", "☿︎", "☽︎", "♄︎", "♃︎", "♂︎"];
const SUN_GLYPH = "☉︎";
const MOON_GLYPH = "☽︎";
const VENUS_GLYPH = "♀︎";
const MARS_GLYPH = "♂︎";
const DAYS = [
  "DIES SOLIS", "DIES VENERIS", "DIES MERCURII", "DIES LUNAE",
  "DIES SATURNI", "DIES IOVIS", "DIES MARTIS",
];

// step-3 order — following the star's single line walks the Chaldean sequence
const SEQ = [0, 3, 6, 2, 5, 1, 4];
const STEP7 = 360 / 7;

// a {7/3} heptagram path at any center/radius, drawn in hour order
function heptaD(cx: number, cy: number, r: number): string {
  const pts = Array.from({ length: 7 }, (_, k) => {
    const t = (-90 + k * STEP7) * DEG;
    return { x: cx + r * Math.cos(t), y: cy + r * Math.sin(t) };
  });
  return SEQ.map((k, i) => `${i ? "L" : "M"} ${pts[k].x.toFixed(1)} ${pts[k].y.toFixed(1)}`).join(" ") + " Z";
}

// tangential rotation for labels seated around a ring
function labelRot(deg: number): number {
  const n = ((deg % 360) + 360) % 360;
  return n > 0 && n < 180 ? deg - 90 : deg + 90;
}

/* ========================= HERO HEPTAGRAM DATA ========================== */
// viewBox 0 0 460 460 — the timetable plate, scaled up from the deck card

const HC = 230;
const STAR_R = 116; // heptagram vertices
const ROUNDEL_R = 139; // glyph roundel centers
const RING_IN = 166; // hour-tick band inner edge
const RING_OUT = 186; // hour-tick band outer edge
const LABEL_R = 176; // day-name baseline radius
const MARK_R = 197; // tiny day/night glyph radius

const HPTS = Array.from({ length: 7 }, (_, k) => {
  const deg = -90 + k * STEP7;
  return { x: HC + STAR_R * Math.cos(deg * DEG), y: HC + STAR_R * Math.sin(deg * DEG), deg };
});

const STAR_D = heptaD(HC, HC, STAR_R);

// direction arrowheads at the midpoint of each star edge, in travel order
const ARROWS = SEQ.map((from, i) => {
  const a = HPTS[from];
  const b = HPTS[SEQ[(i + 1) % 7]];
  const t = 0.55;
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    rot: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI,
  };
});

// 24 hour ticks per day-sector: 12 long day ticks, 12 short night ticks
const HOUR_TICKS = HPTS.flatMap((p, k) => {
  const base = p.deg - STEP7 / 2;
  return Array.from({ length: 23 }, (_, i) => {
    const h = i + 1;
    const a = (base + (h * STEP7) / 24) * DEG;
    const len = h <= 12 ? 5 : 3;
    return {
      key: `${k}-${h}`,
      x1: +(HC + RING_IN * Math.cos(a)).toFixed(1),
      y1: +(HC + RING_IN * Math.sin(a)).toFixed(1),
      x2: +(HC + (RING_IN + len) * Math.cos(a)).toFixed(1),
      y2: +(HC + (RING_IN + len) * Math.sin(a)).toFixed(1),
      night: h > 12,
    };
  });
});

// sector boundary lines, one per day
const BOUNDS = HPTS.map((p) => {
  const a = (p.deg - STEP7 / 2) * DEG;
  return {
    x1: +(HC + RING_IN * Math.cos(a)).toFixed(1),
    y1: +(HC + RING_IN * Math.sin(a)).toFixed(1),
    x2: +(HC + RING_OUT * Math.cos(a)).toFixed(1),
    y2: +(HC + RING_OUT * Math.sin(a)).toFixed(1),
  };
});

// annular wedge — the red wash on the Sun's sector
function wedge(rIn: number, rOut: number, degC: number): string {
  const a0 = (degC - STEP7 / 2) * DEG;
  const a1 = (degC + STEP7 / 2) * DEG;
  const p = (r: number, a: number) => `${(HC + r * Math.cos(a)).toFixed(1)} ${(HC + r * Math.sin(a)).toFixed(1)}`;
  return `M${p(rOut, a0)} A${rOut} ${rOut} 0 0 1 ${p(rOut, a1)} L${p(rIn, a1)} A${rIn} ${rIn} 0 0 0 ${p(rIn, a0)} Z`;
}
const SUN_WEDGE = wedge(RING_IN, RING_OUT, HPTS[0].deg);

/* ========================= ZODIAC CIRCLE DATA =========================== */
// viewBox 0 0 600 600 — the twelve signs seated on a ring, Aries at the
// left (the equinoctial point), running counter-clockwise as the sky does

const ZC = 300;
const Z_IN = 184; // glyph band inner edge
const Z_OUT = 212; // glyph band outer edge
const Z_GLYPH = 198; // glyph seat radius
const Z_LABEL = 252; // label baseline radius

const signDeg = (k: number) => 180 - 30 * k; // center angle of sign k

const Z_BOUNDS = Array.from({ length: 12 }, (_, k) => {
  const a = (195 - 30 * k) * DEG;
  return {
    x1: +(ZC + Z_IN * Math.cos(a)).toFixed(1),
    y1: +(ZC + Z_IN * Math.sin(a)).toFixed(1),
    x2: +(ZC + Z_OUT * Math.cos(a)).toFixed(1),
    y2: +(ZC + Z_OUT * Math.sin(a)).toFixed(1),
    equinox: k === 0, // the 0° Aries hairline, in red
  };
});

// five hairline divisions per sign, 6° apart, outside the glyph band
const Z_TICKS = Array.from({ length: 12 }, (_, k) =>
  Array.from({ length: 5 }, (_, j) => {
    const a = (195 - 30 * k - 6 * (j + 1)) * DEG;
    return {
      key: `${k}-${j}`,
      x1: +(ZC + Z_OUT * Math.cos(a)).toFixed(1),
      y1: +(ZC + Z_OUT * Math.sin(a)).toFixed(1),
      x2: +(ZC + (Z_OUT + 6) * Math.cos(a)).toFixed(1),
      y2: +(ZC + (Z_OUT + 6) * Math.sin(a)).toFixed(1),
    };
  })
).flat();

/* ======================== DESTINY OCTAGRAM DATA ========================= */

const OCT_C = 160;
const OCT_R = 116;
const OCT_PTS = Array.from({ length: 8 }, (_, k) => {
  const t = (k * 45 - 90) * DEG;
  return { x: +(OCT_C + OCT_R * Math.cos(t)).toFixed(1), y: +(OCT_C + OCT_R * Math.sin(t)).toFixed(1) };
});
const OCT_SQUARE_A = [0, 2, 4, 6].map((k) => OCT_PTS[k]);
const OCT_SQUARE_B = [1, 3, 5, 7].map((k) => OCT_PTS[k]);
const OCT_NODES = [
  { label: "PURPOSE", n: "7" },
  { label: "LOVE", n: "15" },
  { label: "MONEY", n: "9" },
  { label: "AGE", n: "22" },
  { label: "TALENT", n: "13" },
  { label: "KARMA", n: "4" },
  { label: "HEALTH", n: "18" },
  { label: "SPIRIT", n: "11" },
];

// red accent sector: from the top vertex (PURPOSE) one step clockwise
const OCT_SECTOR = (() => {
  const a = (r: number, deg: number) => {
    const t = deg * DEG;
    return `${(OCT_C + r * Math.cos(t)).toFixed(1)} ${(OCT_C + r * Math.sin(t)).toFixed(1)}`;
  };
  return `M${OCT_C} ${OCT_C} L${a(OCT_R + 14, -90)} A${OCT_R + 14} ${OCT_R + 14} 0 0 1 ${a(OCT_R + 14, -45)} Z`;
})();

/* ================================ FAQ =================================== */

const FAQS = [
  {
    n: "I",
    q: "What can I do on Astro Scope for free?",
    a: "Cast a free birth chart, read daily horoscopes for all twelve signs, pull tarot spreads, run compatibility and psychology tests — no account.",
  },
  {
    n: "II",
    q: "How do I get my free birth chart?",
    a: "Open the calculator, enter birth date, time and place, generate — your wheel in seconds.",
  },
  {
    n: "III",
    q: "Where are daily horoscopes?",
    a: "Every sign from the homepage grid or the Horoscopes hub.",
  },
  {
    n: "IV",
    q: "What is the Destiny Matrix?",
    a: "Optional birth-date octagram mapping purpose, love, money and age themes.",
  },
];

/* ============================ HERO HEPTAGRAM ============================ */

function HeroHeptagram() {
  return (
    <svg
      viewBox="0 0 460 460"
      className="h-auto w-full"
      role="img"
      aria-label="A manuscript heptagram plate: the Star of the Magi with planet roundels at its seven points inside a ring of day names and hour ticks"
    >
      <defs>
        <radialGradient id="lph-g-plate" cx="50%" cy="46%" r="72%">
          <stop offset="0%" stopColor="#faf3e2" />
          <stop offset="62%" stopColor="#f3e9d2" />
          <stop offset="100%" stopColor="#e7d8b8" />
        </radialGradient>
        <radialGradient id="lph-g-vig" cx="50%" cy="46%" r="78%">
          <stop offset="0%" stopColor="#5a4526" stopOpacity="0" />
          <stop offset="84%" stopColor="#5a4526" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#4a371c" stopOpacity="0.16" />
        </radialGradient>
      </defs>

      {/* parchment ground */}
      <rect x="0" y="0" width="460" height="460" fill="url(#lph-g-plate)" />

      {/* ruled construction lines — the geometer's scaffolding */}
      <g className="lph-fade" style={{ "--d": ".2s" } as CSSProperties} stroke={INK} opacity="0.13">
        <line x1="14" y1={HC} x2="446" y2={HC} strokeWidth="0.5" />
        <line x1={HC} y1="14" x2={HC} y2="446" strokeWidth="0.5" />
        <line x1="77" y1="77" x2="383" y2="383" strokeWidth="0.4" />
        <line x1="383" y1="77" x2="77" y2="383" strokeWidth="0.4" />
        <circle cx={HC} cy={HC} r={ROUNDEL_R} fill="none" strokeWidth="0.5" strokeDasharray="2 3.5" />
        <circle cx={HC} cy={HC} r="208" fill="none" strokeWidth="0.4" strokeDasharray="1 3" />
        <rect x="34" y="34" width="392" height="392" fill="none" strokeWidth="0.4" strokeDasharray="3 4" />
      </g>

      {/* outer timetable ring: red Sun wash, boundaries, hour ticks */}
      <g className="lph-fade" style={{ "--d": ".45s" } as CSSProperties}>
        <path d={SUN_WEDGE} fill={RED} opacity="0.09" />
        <circle cx={HC} cy={HC} r={RING_OUT} fill="none" stroke={INK} strokeWidth="0.9" opacity="0.85" />
        <circle cx={HC} cy={HC} r={RING_IN} fill="none" stroke={INK} strokeWidth="0.9" opacity="0.85" />
        {BOUNDS.map((b, i) => (
          <line key={i} x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2} stroke={i === 6 ? RED : INK} strokeWidth="0.7" opacity="0.7" />
        ))}
        {HOUR_TICKS.map((t) => (
          <line key={t.key} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={INK} strokeWidth="0.5" opacity={t.night ? 0.38 : 0.62} />
        ))}
      </g>

      {/* day names in manuscript caps + tiny day/night marks */}
      <g className="lph-fade" style={{ "--d": "2.3s" } as CSSProperties}>
        {HPTS.map((p, k) => {
          const a = p.deg * DEG;
          return (
            <g key={k}>
              <g transform={`translate(${(HC + LABEL_R * Math.cos(a)).toFixed(1)} ${(HC + LABEL_R * Math.sin(a)).toFixed(1)}) rotate(${labelRot(p.deg).toFixed(1)})`}>
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily={SERIF}
                  fontSize="7"
                  letterSpacing="1.4"
                  fill={k === 0 ? RED : INK}
                  opacity={k === 0 ? 1 : 0.9}
                >
                  {DAYS[k]}
                </text>
              </g>
              {[-1, 1].map((s) => {
                const ma = (p.deg + (s * STEP7) / 4) * DEG;
                return (
                  <text
                    key={s}
                    x={(HC + MARK_R * Math.cos(ma)).toFixed(1)}
                    y={(HC + MARK_R * Math.sin(ma)).toFixed(1)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily={GLYPH_FONT}
                    fontSize="5.5"
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

      {/* circumscribed circle */}
      <circle cx={HC} cy={HC} r={STAR_R} fill="none" stroke={INK} strokeWidth="0.6" opacity="0.5" className="lph-fade" style={{ "--d": ".6s" } as CSSProperties} />

      {/* the heptagram itself — one continuous stroke, self-drawing on load */}
      <path
        className="lph-draw"
        d={STAR_D}
        pathLength={1000}
        fill="none"
        stroke={INK}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* the red hour-marker, traveling the star forever, very slowly */}
      <path
        className="lph-marker"
        d={STAR_D}
        pathLength={1000}
        fill="none"
        stroke={RED}
        strokeWidth="3.2"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* hour-sequence arrows along the star's path */}
      <g className="lph-fade" style={{ "--d": "2.6s" } as CSSProperties}>
        {ARROWS.map((a, i) => (
          <path
            key={i}
            d="M3.6 0 L-2.4 2.2 L-2.4 -2.2 Z"
            transform={`translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${a.rot.toFixed(1)})`}
            fill={INK}
            opacity="0.8"
          />
        ))}
      </g>

      {/* planet roundels — popping in along the hour sequence */}
      {SEQ.map((k, i) => {
        const a = HPTS[k].deg * DEG;
        const x = +(HC + ROUNDEL_R * Math.cos(a)).toFixed(1);
        const y = +(HC + ROUNDEL_R * Math.sin(a)).toFixed(1);
        const acc = k === 0;
        return (
          <g key={k} className="lph-pop" style={{ "--d": `${(1.15 + i * 0.13).toFixed(2)}s` } as CSSProperties}>
            <circle cx={x} cy={y} r="12" fill="#f6eed8" stroke={acc ? RED : INK} strokeWidth={acc ? 1.1 : 0.9} />
            <circle cx={x} cy={y} r="9.4" fill="none" stroke={acc ? RED : INK} strokeWidth="0.4" opacity="0.5" />
            <text x={x} y={y} textAnchor="middle" dominantBaseline="central" dy="0.5" fontFamily={GLYPH_FONT} fontSize="11" fill={acc ? RED : INK}>
              {PLANET_GLYPHS[k]}
            </text>
          </g>
        );
      })}

      {/* center medallion: a miniature of the same star */}
      <g className="lph-pop" style={{ "--d": "1.9s" } as CSSProperties}>
        <circle cx={HC} cy={HC} r="30" fill="#f6eed8" stroke={INK} strokeWidth="0.9" />
        <circle cx={HC} cy={HC} r="26" fill="none" stroke={INK} strokeWidth="0.4" opacity="0.5" />
        <path d={heptaD(HC, HC, 17)} fill="none" stroke={INK} strokeWidth="0.8" strokeLinejoin="round" opacity="0.85" />
        <circle cx={HC} cy={HC} r="2.2" fill={RED} />
      </g>

      {/* plate caption */}
      <g className="lph-fade" style={{ "--d": "2.9s" } as CSSProperties}>
        <text x={HC} y="433" textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize="9" letterSpacing="2.5" fill={INK} opacity="0.7">
          horae planetarum · tabula prima
        </text>
        <rect x="96" y="427" width="52" height="0.7" fill={INK} opacity="0.5" />
        <rect x="312" y="427" width="52" height="0.7" fill={INK} opacity="0.5" />
      </g>

      {/* parchment vignette */}
      <rect x="0" y="0" width="460" height="460" fill="url(#lph-g-vig)" pointerEvents="none" />
    </svg>
  );
}

/* ============================ ZODIAC CIRCLE ============================= */
// the sign band, drawn as a figure in the workbook: twelve signs seated on
// a ring of hairline divisions, names and dates lettered outside, and a
// single red index hand sweeping the ecliptic over 150 seconds

function ZodiacCircle() {
  return (
    <svg
      viewBox="0 0 600 600"
      className="h-auto w-full"
      role="img"
      aria-label="A manuscript diagram of the zodiac circle with the twelve signs on a ring and their names and dates lettered outside"
    >
      {/* construction scaffolding */}
      <g stroke={INK} opacity="0.12">
        <line x1="40" y1={ZC} x2="560" y2={ZC} strokeWidth="0.5" />
        <line x1={ZC} y1="40" x2={ZC} y2="560" strokeWidth="0.5" />
        <circle cx={ZC} cy={ZC} r="150" fill="none" strokeWidth="0.5" strokeDasharray="2 3.5" />
        <circle cx={ZC} cy={ZC} r="232" fill="none" strokeWidth="0.4" strokeDasharray="1 3" />
        <circle cx={ZC} cy={ZC} r="278" fill="none" strokeWidth="0.4" />
      </g>

      {/* spokes from the heart to each sign's seat */}
      {SIGNS.map((s, k) => {
        const a = signDeg(k) * DEG;
        return (
          <line
            key={s.n}
            x1={ZC + 24 * Math.cos(a)}
            y1={ZC + 24 * Math.sin(a)}
            x2={ZC + 150 * Math.cos(a)}
            y2={ZC + 150 * Math.sin(a)}
            stroke={INK}
            strokeWidth="0.4"
            opacity="0.3"
          />
        );
      })}

      {/* the glyph band */}
      <circle cx={ZC} cy={ZC} r={Z_OUT} fill="none" stroke={INK} strokeWidth="0.9" opacity="0.85" />
      <circle cx={ZC} cy={ZC} r={Z_IN} fill="none" stroke={INK} strokeWidth="0.9" opacity="0.85" />
      {Z_BOUNDS.map((b, i) => (
        <line key={i} x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2} stroke={b.equinox ? RED : INK} strokeWidth={b.equinox ? 1 : 0.6} opacity={b.equinox ? 0.9 : 0.65} />
      ))}
      {Z_TICKS.map((t) => (
        <line key={t.key} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={INK} strokeWidth="0.45" opacity="0.5" />
      ))}

      {/* the twelve signs: glyph on the ring, name and dates outside */}
      {SIGNS.map((s, k) => {
        const deg = signDeg(k);
        const a = deg * DEG;
        const gx = +(ZC + Z_GLYPH * Math.cos(a)).toFixed(1);
        const gy = +(ZC + Z_GLYPH * Math.sin(a)).toFixed(1);
        const lx = +(ZC + Z_LABEL * Math.cos(a)).toFixed(1);
        const ly = +(ZC + Z_LABEL * Math.sin(a)).toFixed(1);
        return (
          <a key={s.n} href={`/horoscope/${s.n.toLowerCase()}`} className="lph-sign">
            <text x={gx} y={gy} textAnchor="middle" dominantBaseline="central" dy="1" fontFamily={GLYPH_FONT} fontSize="17" fill={INK}>
              {s.g}
            </text>
            <g transform={`translate(${lx} ${ly}) rotate(${labelRot(deg).toFixed(1)})`}>
              <text y="-7" textAnchor="middle" dominantBaseline="central" fontFamily={SERIF} fontSize="10.5" letterSpacing="1.8" fill={INK}>
                {s.n.toUpperCase()}
              </text>
              <text y="8" textAnchor="middle" dominantBaseline="central" fontFamily={SERIF} fontStyle="italic" fontSize="8.5" letterSpacing="0.6" fill={INK} opacity="0.65">
                {s.d}
              </text>
            </g>
          </a>
        );
      })}

      {/* the red index hand — today's point on the ecliptic, sweeping slowly */}
      <g className="lph-spin" style={{ "--o": "300px 300px", "--t": "150s" } as CSSProperties}>
        <line x1={ZC} y1={ZC} x2={ZC} y2={ZC - Z_OUT} stroke={RED} strokeWidth="0.9" opacity="0.75" />
        <line x1={ZC} y1={ZC} x2={ZC} y2={ZC + 26} stroke={RED} strokeWidth="0.9" opacity="0.4" />
        <circle cx={ZC} cy={ZC - Z_OUT} r="2.6" fill={RED} />
      </g>

      {/* heart of the circle */}
      <circle cx={ZC} cy={ZC} r="22" fill={PLATE} stroke={INK} strokeWidth="0.8" />
      <circle cx={ZC} cy={ZC} r="18" fill="none" stroke={INK} strokeWidth="0.4" opacity="0.5" />
      <text x={ZC} y={ZC} textAnchor="middle" dominantBaseline="central" dy="1" fontFamily={GLYPH_FONT} fontSize="14" fill={RED}>
        {SUN_GLYPH}
      </text>

      {/* figure caption */}
      <text x={ZC} y="592" textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize="8.5" letterSpacing="2" fill={INK} opacity="0.65">
        circulus zodiacus · duodecim signa
      </text>
    </svg>
  );
}

/* ===================== WORKBOOK PLATE DIAGRAMS ========================= */
// each 120×120 — a small geometric figure in ink, one red touch apiece

// BIRTH CHART — the wheel: twelve houses, a dashed turning zodiac ring
function FigBirthChart() {
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="A small ink diagram of a natal wheel">
      <g className="lph-spin" style={{ "--o": "60px 60px", "--t": "130s" } as CSSProperties}>
        <circle cx="60" cy="60" r="54" fill="none" stroke={INK} strokeWidth="0.5" strokeDasharray="2 3.5" opacity="0.6" />
        {Array.from({ length: 12 }, (_, k) => {
          const t = (k * 30) * DEG;
          return (
            <text
              key={k}
              x={60 + 48 * Math.cos(t)}
              y={60 + 48 * Math.sin(t)}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={GLYPH_FONT}
              fontSize="6.5"
              fill={INK}
              opacity="0.75"
            >
              {SIGNS[k].g}
            </text>
          );
        })}
      </g>
      <circle cx="60" cy="60" r="38" fill="none" stroke={INK} strokeWidth="0.9" />
      <circle cx="60" cy="60" r="30" fill="none" stroke={INK} strokeWidth="0.4" opacity="0.5" />
      {Array.from({ length: 12 }, (_, k) => {
        const t = (k * 30 + 15) * DEG;
        return (
          <line
            key={k}
            x1={60 + 12 * Math.cos(t)}
            y1={60 + 12 * Math.sin(t)}
            x2={60 + 38 * Math.cos(t)}
            y2={60 + 38 * Math.sin(t)}
            stroke={INK}
            strokeWidth="0.5"
            opacity="0.7"
          />
        );
      })}
      {/* aspect chords across the hub */}
      <line x1="42" y1="44" x2="78" y2="70" stroke={RED} strokeWidth="0.6" opacity="0.8" />
      <line x1="48" y1="76" x2="76" y2="40" stroke={INK} strokeWidth="0.5" opacity="0.55" />
      <circle cx="60" cy="60" r="12" fill="none" stroke={INK} strokeWidth="0.7" />
      <circle cx="42" cy="44" r="1.6" fill={INK} />
      <circle cx="76" cy="40" r="1.6" fill={INK} />
      <circle cx="48" cy="76" r="1.6" fill={INK} />
      <circle cx="78" cy="70" r="1.6" fill={RED} />
      <circle cx="60" cy="60" r="1.8" fill={INK} />
    </svg>
  );
}

// DAILY HOROSCOPE — the sun's course: an arc over a ruled horizon
function FigHoroscope() {
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="A small ink diagram of the sun's daily arc over a horizon line">
      <path d="M 12 78 A 48 48 0 0 1 108 78" fill="none" stroke={INK} strokeWidth="0.6" strokeDasharray="2.5 3.5" opacity="0.7" />
      <line x1="8" y1="78" x2="112" y2="78" stroke={INK} strokeWidth="0.9" />
      <line x1="8" y1="84" x2="112" y2="84" stroke={INK} strokeWidth="0.4" opacity="0.4" />
      {/* hour ticks along the horizon */}
      {Array.from({ length: 11 }, (_, k) => (
        <line key={k} x1={16 + k * 8.8} y1="78" x2={16 + k * 8.8} y2={k % 5 === 0 ? 71 : 73.5} stroke={INK} strokeWidth="0.5" opacity="0.6" />
      ))}
      {/* the sun, breathing gently on its arc */}
      <g className="lph-breathe" style={{ "--t": "18s" } as CSSProperties}>
        <circle cx="66" cy="46" r="9" fill="none" stroke={RED} strokeWidth="1" />
        <circle cx="66" cy="46" r="2.4" fill={RED} />
        {Array.from({ length: 8 }, (_, k) => {
          const t = (k * 45 - 90) * DEG;
          return (
            <line
              key={k}
              x1={66 + 12.5 * Math.cos(t)}
              y1={46 + 12.5 * Math.sin(t)}
              x2={66 + 16.5 * Math.cos(t)}
              y2={46 + 16.5 * Math.sin(t)}
              stroke={INK}
              strokeWidth="0.7"
            />
          );
        })}
      </g>
      {/* the moon, due tonight */}
      <text x="26" y="44" textAnchor="middle" fontFamily={GLYPH_FONT} fontSize="10" fill={INK} opacity="0.7">
        {MOON_GLYPH}
      </text>
      {/* shadow of the night below the horizon */}
      {Array.from({ length: 9 }, (_, k) => (
        <line key={k} x1={20 + k * 9.5} y1="90" x2={26 + k * 9.5} y2="100" stroke={INK} strokeWidth="0.4" opacity="0.3" />
      ))}
    </svg>
  );
}

// COMPATIBILITY — the hexagram: two charts interlaced, Venus and Mars seated
function FigCompatibility() {
  const up = [-90, 30, 150].map((d) => {
    const t = d * DEG;
    return `${(60 + 44 * Math.cos(t)).toFixed(1)},${(60 + 44 * Math.sin(t)).toFixed(1)}`;
  });
  const down = [90, 210, 330].map((d) => {
    const t = d * DEG;
    return `${(60 + 44 * Math.cos(t)).toFixed(1)},${(60 + 44 * Math.sin(t)).toFixed(1)}`;
  });
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="A small ink diagram of a hexagram with Venus and Mars glyphs">
      <circle cx="60" cy="60" r="52" fill="none" stroke={INK} strokeWidth="0.5" strokeDasharray="2 3.5" opacity="0.6" />
      <circle cx="60" cy="60" r="44" fill="none" stroke={INK} strokeWidth="0.4" opacity="0.4" />
      <polygon points={up.join(" ")} fill="none" stroke={INK} strokeWidth="0.9" strokeLinejoin="round" />
      <polygon points={down.join(" ")} fill="none" stroke={INK} strokeWidth="0.9" strokeLinejoin="round" opacity="0.8" />
      {/* the two natives */}
      <circle cx="16" cy="60" r="7.5" fill={PLATE} stroke={INK} strokeWidth="0.8" />
      <text x="16" y="60" textAnchor="middle" dominantBaseline="central" dy="0.5" fontFamily={GLYPH_FONT} fontSize="8.5" fill={RED}>
        {VENUS_GLYPH}
      </text>
      <circle cx="104" cy="60" r="7.5" fill={PLATE} stroke={INK} strokeWidth="0.8" />
      <text x="104" y="60" textAnchor="middle" dominantBaseline="central" dy="0.5" fontFamily={GLYPH_FONT} fontSize="8.5" fill={INK}>
        {MARS_GLYPH}
      </text>
      <circle cx="60" cy="60" r="3.5" fill="none" stroke={RED} strokeWidth="0.8" />
      <circle cx="60" cy="60" r="1" fill={RED} />
    </svg>
  );
}

// TAROT — three cards fanned on the reading cloth, the middle one signed
function FigTarot() {
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="A small ink diagram of three tarot cards fanned on a cloth">
      <circle cx="60" cy="62" r="50" fill="none" stroke={INK} strokeWidth="0.4" strokeDasharray="1 3" opacity="0.5" />
      <line x1="14" y1="100" x2="106" y2="100" stroke={INK} strokeWidth="0.6" opacity="0.5" />
      <g transform="translate(38 88) rotate(-14)">
        <rect x="-15" y="-44" width="30" height="48" rx="2" fill={PLATE} stroke={INK} strokeWidth="0.9" />
        <rect x="-11.5" y="-40.5" width="23" height="41" rx="1" fill="none" stroke={INK} strokeWidth="0.4" opacity="0.6" />
      </g>
      <g transform="translate(82 88) rotate(14)">
        <rect x="-15" y="-44" width="30" height="48" rx="2" fill={PLATE} stroke={INK} strokeWidth="0.9" />
        <rect x="-11.5" y="-40.5" width="23" height="41" rx="1" fill="none" stroke={INK} strokeWidth="0.4" opacity="0.6" />
      </g>
      <g transform="translate(60 86)">
        <rect x="-16" y="-50" width="32" height="54" rx="2" fill={PLATE} stroke={INK} strokeWidth="1" />
        <rect x="-12.5" y="-46.5" width="25" height="47" rx="1" fill="none" stroke={INK} strokeWidth="0.4" opacity="0.6" />
        <path d="M 0 -36 L 2.6 -27.4 L 12 -27.4 L 4.4 -21.6 L 7 -13 L 0 -18.6 L -7 -13 L -4.4 -21.6 L -12 -27.4 L -2.6 -27.4 Z" fill="none" stroke={RED} strokeWidth="0.9" strokeLinejoin="round" />
        <circle cx="0" cy="-22.5" r="1" fill={RED} />
        <line x1="-7" y1="-8" x2="7" y2="-8" stroke={INK} strokeWidth="0.4" opacity="0.6" />
        <line x1="-5" y1="-4.5" x2="5" y2="-4.5" stroke={INK} strokeWidth="0.4" opacity="0.45" />
      </g>
    </svg>
  );
}

// PSYCHOLOGY — the prism: one beam in, the spectrum of the self out
function FigPsychology() {
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="A small ink diagram of a prism splitting one beam into three">
      <line className="lph-breathe" style={{ "--t": "15s" } as CSSProperties} x1="8" y1="68" x2="46" y2="60" stroke={INK} strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="46" cy="60" r="1.6" fill={INK} />
      <path d="M 60 32 L 40 80 L 80 80 Z" fill="none" stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M 60 41 L 48 74 L 72 74 Z" fill="none" stroke={INK} strokeWidth="0.45" opacity="0.6" />
      <line x1="68" y1="57" x2="110" y2="42" stroke={INK} strokeWidth="0.8" strokeLinecap="round" opacity="0.65" />
      <line className="lph-breathe" style={{ "--t": "15s", "--d": "3s" } as CSSProperties} x1="70" y1="61" x2="112" y2="59" stroke={RED} strokeWidth="1.1" strokeLinecap="round" />
      <line x1="68" y1="65" x2="110" y2="76" stroke={INK} strokeWidth="0.8" strokeLinecap="round" opacity="0.65" />
      <line x1="46" y1="88" x2="74" y2="88" stroke={INK} strokeWidth="0.7" />
      <line x1="60" y1="80" x2="60" y2="88" stroke={INK} strokeWidth="0.7" />
      {/* ruled scale under the spectrum */}
      {Array.from({ length: 5 }, (_, k) => (
        <line key={k} x1={94 + k * 4.5} y1="34" x2={94 + k * 4.5} y2="38" stroke={INK} strokeWidth="0.45" opacity="0.5" />
      ))}
    </svg>
  );
}

// COSMIC PASSPORT — the seal: an inscription ring turning around a star
function FigPassport() {
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="A small ink diagram of a circular passport seal with a turning inscription">
      <defs>
        <path id="lph-seal-circ" d="M 24 60 A 36 36 0 1 1 96 60 A 36 36 0 1 1 24 60" fill="none" />
      </defs>
      <circle cx="60" cy="60" r="45" fill="none" stroke={INK} strokeWidth="0.9" />
      <circle cx="60" cy="60" r="27" fill="none" stroke={INK} strokeWidth="0.7" />
      {Array.from({ length: 24 }, (_, k) => {
        const t = (k * 15) * DEG;
        return (
          <line
            key={k}
            x1={60 + 43 * Math.cos(t)}
            y1={60 + 43 * Math.sin(t)}
            x2={60 + 45 * Math.cos(t)}
            y2={60 + 45 * Math.sin(t)}
            stroke={INK}
            strokeWidth="0.5"
            opacity="0.6"
          />
        );
      })}
      <g className="lph-spin" style={{ "--o": "60px 60px", "--t": "96s" } as CSSProperties}>
        <text fontFamily={SERIF} fontSize="6.2" letterSpacing="1.4" fill={INK} opacity="0.85">
          <textPath href="#lph-seal-circ">ASTRO SCOPE · COSMIC PASSPORT · ONE SKY ·</textPath>
        </text>
      </g>
      <path d="M 60 44 L 63.5 56.5 L 76 60 L 63.5 63.5 L 60 76 L 56.5 63.5 L 44 60 L 56.5 56.5 Z" fill="none" stroke={INK} strokeWidth="0.9" strokeLinejoin="round" />
      <circle cx="60" cy="60" r="2" fill={RED} />
    </svg>
  );
}

/* ======================== DESTINY OCTAGRAM ============================== */

function DestinyOctagram() {
  return (
    <svg
      viewBox="0 0 320 320"
      className="h-auto w-full"
      role="img"
      aria-label="An ink diagram of the Destiny Matrix octagram with a red sector on the purpose vertex"
    >
      {/* construction scaffolding */}
      <g stroke={INK} opacity="0.12">
        <line x1="10" y1={OCT_C} x2="310" y2={OCT_C} strokeWidth="0.5" />
        <line x1={OCT_C} y1="10" x2={OCT_C} y2="310" strokeWidth="0.5" />
        <circle cx={OCT_C} cy={OCT_C} r="96" fill="none" strokeWidth="0.4" strokeDasharray="2 3.5" />
      </g>

      {/* the red sector on PURPOSE */}
      <path className="lph-breathe" style={{ "--t": "24s" } as CSSProperties} d={OCT_SECTOR} fill={RED} opacity="0.09" />

      <circle cx={OCT_C} cy={OCT_C} r={OCT_R + 14} fill="none" stroke={INK} strokeWidth="0.8" opacity="0.8" />
      <circle cx={OCT_C} cy={OCT_C} r={OCT_R} fill="none" stroke={INK} strokeWidth="0.4" opacity="0.4" />

      {/* spokes from the heart to each vertex */}
      {OCT_PTS.map((p, i) => (
        <line key={i} x1={OCT_C} y1={OCT_C} x2={p.x} y2={p.y} stroke={i === 0 ? RED : INK} strokeWidth="0.5" opacity={i === 0 ? 0.8 : 0.55} />
      ))}

      {/* the octagram: two overlaid squares */}
      <polygon points={OCT_SQUARE_A.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={INK} strokeWidth="1" />
      <polygon points={OCT_SQUARE_B.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={INK} strokeWidth="0.8" opacity="0.75" />

      {/* the heart */}
      <path d={`M ${OCT_C} ${OCT_C - 7} L ${OCT_C + 7} ${OCT_C} L ${OCT_C} ${OCT_C + 7} L ${OCT_C - 7} ${OCT_C} Z`} fill="none" stroke={INK} strokeWidth="0.8" />
      <circle cx={OCT_C} cy={OCT_C} r="1.8" fill={RED} />

      {/* vertex seals with arcana numbers and labels */}
      {OCT_PTS.map((p, i) => {
        const t = (i * 45 - 90) * DEG;
        const lx = OCT_C + (OCT_R + 26) * Math.cos(t);
        const ly = OCT_C + (OCT_R + 26) * Math.sin(t);
        const acc = i === 0;
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="9" fill={PLATE} stroke={acc ? RED : INK} strokeWidth={acc ? 1.1 : 0.9} />
            <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" dy="0.5" fontFamily={SERIF} fontWeight="700" fontSize="8" fill={acc ? RED : INK}>
              {OCT_NODES[i].n}
            </text>
            <text x={lx.toFixed(1)} y={(ly + 3).toFixed(1)} textAnchor="middle" fontFamily={SERIF} fontSize="7" letterSpacing="1.4" fill={acc ? RED : INK} opacity={acc ? 1 : 0.85}>
              {OCT_NODES[i].label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ================================ PAGE ================================== */

// the Chaldean order, hour by hour: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon
const CHALDEAN = ["♄︎", "♃︎", "♂︎", "☉︎", "♀︎", "☿︎", "☽︎"];

const PLATES = [
  {
    tag: "FREE",
    roman: "I",
    title: "Birth Chart",
    desc: "Map your Sun, Moon, and Rising — the foundation of every reading.",
    href: "/birth-chart",
    fig: <FigBirthChart />,
    figLabel: "fig. 1 · rota natalis",
  },
  {
    tag: "DAILY",
    roman: "II",
    title: "Daily Horoscope",
    desc: "Twelve signs, one sky. Clear forecasts without the fluff.",
    href: "/horoscope",
    fig: <FigHoroscope />,
    figLabel: "fig. 2 · cursus solis",
  },
  {
    tag: "SYNASTRY",
    roman: "III",
    title: "Compatibility",
    desc: "Zodiac match, Chinese pairs, and deep synastry for two charts.",
    href: "/compatibility",
    fig: <FigCompatibility />,
    figLabel: "fig. 3 · hexagramma",
  },
  {
    tag: "SPREADS",
    roman: "IV",
    title: "Tarot",
    desc: "Daily card to Celtic Cross — pull, reflect, get a full reading.",
    href: "/tarot",
    fig: <FigTarot />,
    figLabel: "fig. 4 · tres chartae",
  },
  {
    tag: "TESTS",
    roman: "V",
    title: "Psychology",
    desc: "MBTI, Big Five, empathy and more — meet yourself beyond the signs.",
    href: "/psychology",
    fig: <FigPsychology />,
    figLabel: "fig. 5 · prisma",
  },
  {
    tag: "YOU",
    roman: "VI",
    title: "Cosmic Passport",
    desc: "Your Cosmic ID, people, journal, and Premium deep dives — one hub.",
    href: "/passport",
    fig: <FigPassport />,
    figLabel: "fig. 6 · sigillum",
  },
];

// staggered rhythm along the construction line (large screens only)
const STAGGER = ["lg:mt-0", "lg:mt-16", "lg:mt-8", "lg:mt-24", "lg:mt-10", "lg:mt-28"];

export default function PlanetaryHoursLanding() {
  return (
    <div className="lph-root relative isolate min-h-screen">
      <style>{`
        .lph-root { background: #f3e9d2; color: #3b2c1c; font-family: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif; }
        .lph-root ::selection { background: rgba(158,43,37,.22); color: #3b2c1c; }
        .lph-serif { font-family: Georgia, 'Times New Roman', 'Palatino Linotype', serif; }
        .lph-rule { height: 1px; background: linear-gradient(90deg, transparent, rgba(59,44,28,.45), transparent); }

        /* buttons — an ink plaque and a ruled ghost */
        .lph-btn-primary { display: inline-block; background: #3b2c1c; color: #f3e9d2; border: 1px solid #2b1f12; box-shadow: inset 0 0 0 3px #3b2c1c, inset 0 0 0 4px rgba(243,233,210,.4), 0 12px 24px -16px rgba(59,44,28,.6); transition: background .35s ease, box-shadow .35s ease; }
        .lph-btn-primary:hover { background: #9e2b25; box-shadow: inset 0 0 0 3px #9e2b25, inset 0 0 0 4px rgba(243,233,210,.45), 0 14px 28px -14px rgba(158,43,37,.5); }
        .lph-btn-ghost { display: inline-block; border: 1px solid rgba(59,44,28,.45); color: #3b2c1c; transition: border-color .35s ease, color .35s ease, background .35s ease; }
        .lph-btn-ghost:hover { border-color: #9e2b25; color: #9e2b25; background: rgba(158,43,37,.05); }

        /* manuscript plates */
        .lph-plate { background: #f8f0dc; border: 1px solid rgba(59,44,28,.42); box-shadow: inset 0 0 0 4px #f8f0dc, inset 0 0 0 5px rgba(59,44,28,.26); transition: transform .5s cubic-bezier(.22,.7,.3,1), border-color .5s ease, box-shadow .5s ease; }
        .lph-plate:hover { transform: translateY(-4px); border-color: rgba(158,43,37,.55); box-shadow: 0 18px 34px -22px rgba(59,44,28,.5), inset 0 0 0 4px #f8f0dc, inset 0 0 0 5px rgba(158,43,37,.32); }
        .lph-tag { display: inline-block; border: 1px solid rgba(59,44,28,.4); color: #3b2c1c; background: rgba(59,44,28,.04); letter-spacing: .28em; }
        .lph-link { color: #9e2b25; transition: letter-spacing .35s ease, color .35s ease; }
        .lph-link:hover { letter-spacing: .34em; }
        .lph-nav-link { transition: color .3s ease; }
        .lph-nav-link:hover { color: #9e2b25; }

        /* the red Q marker of the inquiry plates */
        .lph-q { display: flex; align-items: center; justify-content: center; background: #9e2b25; color: #f3e9d2; box-shadow: inset 0 0 0 2px #9e2b25, inset 0 0 0 3px rgba(243,233,210,.5); }

        /* zodiac circle: signs flush red under the reader's hand */
        .lph-sign text { transition: fill .35s ease; }
        .lph-sign:hover text { fill: #9e2b25; }

        /* load: the page is copied out — text rises, ink fades in, the star draws */
        .lph-rise { animation: lph-rise .9s cubic-bezier(.22,.7,.3,1) backwards; animation-delay: var(--d, 0s); }
        .lph-fade { animation: lph-fade 1s ease-out backwards; animation-delay: var(--d, 0s); }
        .lph-pop { transform-box: fill-box; transform-origin: center; animation: lph-pop .55s ease-out backwards; animation-delay: var(--d, 0s); }
        .lph-draw { stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: lph-draw 2.4s ease-in-out .5s forwards; }

        /* ambient motion — all slow, all restrained */
        .lph-marker { stroke-dasharray: 1 999; stroke-dashoffset: 0; animation: lph-travel 84s linear infinite; }
        .lph-spin { transform-box: view-box; transform-origin: var(--o, 60px 60px); animation: lph-spin var(--t, 120s) linear infinite; }
        .lph-breathe { animation: lph-breathe var(--t, 20s) ease-in-out infinite; animation-delay: var(--d, 0s); }

        @keyframes lph-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes lph-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lph-pop { from { opacity: 0; transform: scale(.2); } 60% { opacity: 1; } to { opacity: 1; transform: scale(1); } }
        @keyframes lph-draw { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }
        @keyframes lph-travel { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -1000; } }
        @keyframes lph-spin { to { transform: rotate(360deg); } }
        @keyframes lph-breathe { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }

        /* manuscript ground: faint horizontal ruling + double margin rules */
        .lph-bg { position: fixed; inset: 0; z-index: -1; overflow: hidden; pointer-events: none; background: radial-gradient(120% 90% at 50% 0%, #f7efdd 0%, #f3e9d2 55%, #ecdfc2 100%); }
        .lph-ruled { position: absolute; inset: 0; background: repeating-linear-gradient(180deg, transparent 0 55px, rgba(59,44,28,.05) 55px 56px); }
        .lph-margin { position: absolute; top: 0; bottom: 0; border-left: 1px solid rgba(59,44,28,.14); }
        .lph-margin-red { position: absolute; top: 0; bottom: 0; border-left: 1px solid rgba(158,43,37,.22); }

        @media (prefers-reduced-motion: reduce) {
          .lph-rise, .lph-fade, .lph-pop, .lph-draw, .lph-marker, .lph-spin, .lph-breathe { animation: none !important; }
          .lph-draw { stroke-dashoffset: 0; }
          .lph-marker { opacity: 0; }
        }
      `}</style>

      {/* manuscript ground: parchment wash, faint ruling, margin rules, and a
          ghost heptagram turning imperceptibly off the lower right corner */}
      <div className="lph-bg" aria-hidden="true">
        <div className="lph-ruled" />
        <span className="lph-margin hidden lg:block" style={{ left: "44px" }} />
        <span className="lph-margin-red hidden lg:block" style={{ left: "52px" }} />
        <span className="lph-margin hidden lg:block" style={{ right: "44px" }} />
        <span className="lph-margin-red hidden lg:block" style={{ right: "52px" }} />
        <svg className="absolute -bottom-[28vmin] -right-[22vmin] h-[85vmin] w-[85vmin] opacity-[0.05]" viewBox="0 0 100 100">
          <g className="lph-spin" style={{ "--o": "50px 50px", "--t": "150s" } as CSSProperties}>
            <circle cx="50" cy="50" r="44" fill="none" stroke={INK} strokeWidth="0.6" />
            <path d={heptaD(50, 50, 44)} fill="none" stroke={INK} strokeWidth="0.8" />
            <circle cx="50" cy="50" r="30" fill="none" stroke={INK} strokeWidth="0.4" strokeDasharray="2 3" />
          </g>
        </svg>
      </div>

      {/* ==================== TOP NAV ==================== */}
      <header>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="flex items-center gap-2.5">
            <svg viewBox="0 0 20 20" className="h-[19px] w-[19px]" aria-hidden="true">
              <circle cx="10" cy="10" r="8.6" fill="none" stroke={INK} strokeWidth="0.7" />
              <path d={heptaD(10, 10, 6.4)} fill="none" stroke={INK} strokeWidth="0.7" strokeLinejoin="round" />
              <circle cx="10" cy="10" r="1.2" fill={RED} />
            </svg>
            <span className="lph-serif text-[13px] tracking-[0.38em] text-[#3b2c1c]">ASTRO&nbsp;SCOPE</span>
          </a>
          <nav className="flex items-center gap-7 text-[11px] uppercase tracking-[0.22em] text-[#3b2c1c]/65">
            <a href="/horoscope" className="lph-nav-link hidden sm:inline">Horoscopes</a>
            <a href="/tarot" className="lph-nav-link hidden sm:inline">Tarot</a>
            <a href="/compatibility" className="lph-nav-link hidden md:inline">Compatibility</a>
            <a href="/sign-in" className="lph-nav-link border border-[#3b2c1c]/40 px-3.5 py-1.5 text-[#3b2c1c] hover:border-[#9e2b25] hover:text-[#9e2b25]">Sign&nbsp;In</a>
          </nav>
        </div>
        <div className="lph-rule" />
      </header>

      {/* ==================== HERO ==================== */}
      <section>
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-14 lg:grid-cols-[1.02fr_0.98fr] lg:py-20">
          <div>
            <p className="lph-rise text-[11px] uppercase tracking-[0.34em] text-[#9e2b25]" style={{ "--d": ".1s" } as CSSProperties}>
              Horae Planetarum&nbsp;&nbsp;·&nbsp;&nbsp;An Occult Timetable
            </p>
            <h1 className="lph-rise lph-serif mt-6 text-5xl leading-[1.1] text-[#3b2c1c] sm:text-6xl" style={{ "--d": ".25s" } as CSSProperties}>
              Seven rulers. Seven days.
              <br />
              <em className="text-[#9e2b25]">One order of hours.</em>
            </h1>
            <p className="lph-rise mt-6 max-w-md text-[15px] leading-relaxed text-[#3b2c1c]/65" style={{ "--d": ".45s" } as CSSProperties}>
              Free birth chart, daily horoscopes, synastry and tarot — every reading copied into one workbook.
            </p>
            <div className="lph-rise mt-9 flex flex-wrap items-center gap-4" style={{ "--d": ".6s" } as CSSProperties}>
              <a href="/birth-chart" className="lph-btn-primary lph-serif px-7 py-3.5 text-[13px] font-bold uppercase tracking-[0.18em]">
                Cast your free birth chart
              </a>
              <a href="/horoscope" className="lph-btn-ghost px-6 py-3.5 text-[12px] uppercase tracking-[0.2em]">
                Read today&rsquo;s horoscope&nbsp;&rarr;
              </a>
            </div>
            <p className="lph-rise mt-10 text-[13px] tracking-[0.34em] text-[#3b2c1c]/55" style={{ "--d": ".75s" } as CSSProperties}>
              {CHALDEAN.join("\u2002")}
            </p>
            <p className="lph-rise lph-serif mt-2 text-[11px] italic tracking-[0.08em] text-[#3b2c1c]/45" style={{ "--d": ".85s" } as CSSProperties}>
              the Chaldean order — Saturn to Moon — ruling the hours, the days, the week
            </p>
          </div>
          <div className="lph-fade relative mx-auto w-full max-w-[540px]" style={{ "--d": ".35s" } as CSSProperties}>
            <HeroHeptagram />
          </div>
        </div>
        <div className="lph-rule" />
      </section>

      {/* ==================== ZODIAC CIRCLE ==================== */}
      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <p className="text-center text-[11px] uppercase tracking-[0.34em] text-[#9e2b25]">Circulus Zodiacus&nbsp;&nbsp;·&nbsp;&nbsp;Fig. II</p>
        <h2 className="lph-serif mt-4 text-center text-3xl text-[#3b2c1c] sm:text-4xl">The twelve, seated on one ring</h2>
        <p className="lph-serif mx-auto mt-4 max-w-md text-center text-[13px] italic leading-relaxed text-[#3b2c1c]/55">
          Choose your sign — the red index marks today&rsquo;s point on the ecliptic.
        </p>
        <div className="mx-auto mt-10 w-full max-w-[640px]">
          <ZodiacCircle />
        </div>
      </section>

      {/* ==================== WORKBOOK PLATES ==================== */}
      <section className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
        <p className="text-center text-[11px] uppercase tracking-[0.34em] text-[#9e2b25]">Sex Tabulae&nbsp;&nbsp;·&nbsp;&nbsp;The Workbook</p>
        <h2 className="lph-serif mt-4 text-center text-3xl text-[#3b2c1c] sm:text-4xl">Six diagrams, one workbook</h2>
        <p className="lph-serif mx-auto mt-4 max-w-md text-center text-[13px] italic leading-relaxed text-[#3b2c1c]/55">
          Each instrument drawn once, in ink, along a single construction line.
        </p>

        <div className="relative mt-16 flex flex-col gap-10 lg:gap-2">
          {/* the ruled construction line threading the workbook, with ticks */}
          <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-[13px] -translate-x-1/2 lg:block" aria-hidden="true">
            <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[rgba(59,44,28,.28)]" />
            <div
              className="absolute inset-y-0 w-full"
              style={{ background: "repeating-linear-gradient(180deg, transparent 0 47px, rgba(59,44,28,.45) 47px 48px)" }}
            />
          </div>

          {PLATES.map((p, i) => {
            const left = i % 2 === 0;
            return (
              <article key={p.title} className={`lph-plate relative p-7 sm:p-8 lg:w-[calc(50%-3rem)] ${left ? "lg:self-start" : "lg:self-end"} ${STAGGER[i]}`}>
                {/* connector: a hairline from the plate to the construction line, with a node */}
                <span className={`absolute top-1/2 hidden h-px w-12 bg-[rgba(59,44,28,.4)] lg:block ${left ? "-right-12" : "-left-12"}`} aria-hidden="true">
                  <span className={`absolute -top-[4.5px] h-[9px] w-[9px] rounded-full border border-[rgba(158,43,37,.6)] bg-[#f3e9d2] ${left ? "-right-[5px]" : "-left-[5px]"}`} />
                </span>
                {/* plate number, set on the construction line side */}
                <span className={`lph-serif absolute top-4 text-[10px] uppercase tracking-[0.3em] text-[#9e2b25]/80 ${left ? "right-5" : "left-5"}`}>
                  Tab.&nbsp;{p.roman}
                </span>
                <div className={`flex flex-col items-center gap-7 sm:flex-row ${left ? "" : "sm:flex-row-reverse"}`}>
                  <div className="shrink-0">
                    {p.fig}
                    <p className="lph-serif mt-2 text-center text-[10px] italic tracking-[0.06em] text-[#3b2c1c]/50">{p.figLabel}</p>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className={`flex items-center justify-center gap-3 sm:justify-start ${left ? "" : "sm:flex-row-reverse"}`}>
                      <h3 className="lph-serif text-2xl text-[#3b2c1c]">{p.title}</h3>
                      <span className="lph-tag shrink-0 px-2 py-[3px] text-[9px] uppercase">{p.tag}</span>
                    </div>
                    <p className="mt-3 max-w-sm text-[13.5px] leading-relaxed text-[#3b2c1c]/65">{p.desc}</p>
                    <a href={p.href} className="lph-link mt-5 inline-block text-[11px] uppercase tracking-[0.26em]">
                      Explore&nbsp;&rarr;
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ==================== DESTINY MATRIX ==================== */}
      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative mx-auto w-full max-w-[400px]">
            <DestinyOctagram />
            <p className="lph-serif mt-3 text-center text-[10px] italic tracking-[0.08em] text-[#3b2c1c]/50">fig. 7 · octagramma fatorum</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#9e2b25]">Octagramma&nbsp;&nbsp;·&nbsp;&nbsp;An Optional Plate</p>
            <h2 className="lph-serif mt-4 text-3xl text-[#3b2c1c] sm:text-4xl">The Destiny Matrix</h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#3b2c1c]/65">
              An optional birth-date octagram tool. It maps purpose, love, money, and age themes from your birth date.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Purpose", "Love", "Money", "Age themes"].map((c) => (
                <span key={c} className="lph-tag px-2.5 py-1.5 text-[10px] uppercase">
                  {c}
                </span>
              ))}
            </div>
            <a href="/destiny-matrix" className="lph-btn-ghost mt-8 px-6 py-3 text-[12px] uppercase tracking-[0.2em]">
              Open Destiny Matrix&nbsp;&rarr;
            </a>
          </div>
        </div>
      </section>

      {/* ==================== FAQ — PLATES OF INQUIRY ==================== */}
      <section className="mx-auto max-w-5xl px-6 py-16 lg:py-20">
        <p className="text-center text-[11px] uppercase tracking-[0.34em] text-[#9e2b25]">Quaestiones</p>
        <h2 className="lph-serif mt-4 text-center text-3xl text-[#3b2c1c] sm:text-4xl">Questions, answered in the margin</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {FAQS.map((f) => (
            <article key={f.n} className="lph-plate relative p-7">
              <span className="lph-serif absolute right-5 top-4 text-[11px] tracking-[0.28em] text-[#3b2c1c]/35">{f.n}</span>
              <div className="flex items-center gap-4">
                <span className="lph-q lph-serif h-9 w-9 shrink-0 text-[15px] font-bold">Q</span>
                <h3 className="lph-serif text-lg leading-snug text-[#3b2c1c]">{f.q}</h3>
              </div>
              <div className="mt-4 flex items-center gap-3" aria-hidden="true">
                <span className="lph-rule flex-1" />
                <svg viewBox="0 0 20 20" className="h-3 w-3">
                  <path d={heptaD(10, 10, 8)} fill="none" stroke="#9e2b25" strokeWidth="1.1" strokeLinejoin="round" />
                </svg>
                <span className="lph-rule flex-1" />
              </div>
              <p className="mt-4 text-[13.5px] leading-relaxed text-[#3b2c1c]/65">{f.a}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ==================== CTA BAND ==================== */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center lg:py-24">
        <div className="flex items-center justify-center gap-4">
          <span className="lph-rule w-20 sm:w-28" />
          <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
            <circle cx="16" cy="16" r="14" fill="none" stroke={INK} strokeWidth="0.7" opacity="0.6" />
            <path d={heptaD(16, 16, 10.5)} fill="none" stroke={INK} strokeWidth="0.8" strokeLinejoin="round" />
            <circle cx="16" cy="16" r="1.6" fill={RED} />
          </svg>
          <span className="lph-rule w-20 sm:w-28" />
        </div>
        <h2 className="lph-serif mt-8 text-3xl leading-snug text-[#3b2c1c] sm:text-4xl">
          Your chart is written in the stars.
          <br />
          Come read it.
        </h2>
        <a href="/sign-up" className="lph-btn-primary lph-serif mt-10 px-8 py-4 text-[13px] font-bold uppercase tracking-[0.18em]">
          Get started — it&rsquo;s free
        </a>
        <p className="lph-serif mt-5 text-[12px] italic text-[#3b2c1c]/50">no account required for the daily reading</p>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer>
        <div className="lph-rule" />
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="lph-serif text-[12px] tracking-[0.34em] text-[#3b2c1c]">ASTRO&nbsp;SCOPE</p>
              <p className="mt-2 text-[12px] text-[#3b2c1c]/50">Astro Scope — your daily cosmic guidance.</p>
            </div>
            <nav className="flex flex-wrap gap-x-7 gap-y-2 text-[11px] uppercase tracking-[0.2em] text-[#3b2c1c]/60">
              <a href="/birth-chart" className="lph-nav-link">Birth Chart</a>
              <a href="/horoscope" className="lph-nav-link">Horoscopes</a>
              <a href="/tarot" className="lph-nav-link">Tarot</a>
              <a href="/pricing" className="lph-nav-link">Pricing</a>
            </nav>
          </div>
          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#3b2c1c]/35">&copy; 2026 Astro Scope</p>
            <p className="lph-serif text-[10px] italic tracking-[0.14em] text-[#3b2c1c]/35">horae planetarum · septem rectores, septem dies</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
