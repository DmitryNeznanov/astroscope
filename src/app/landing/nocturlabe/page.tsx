// LANDING / NOCTURLABE — a design exploration of the production landing in
// the "night observatory" language of src/components/cards/nocturlabe.tsx:
// deep navy lacquer, engraved silver, pale-gold starlight. The hero is a
// nocturnal (star clock): an outer date ring, an inner star dial carrying
// Ursa Major and Cassiopeia turning once every 150s, and a long regula
// pointer arm. The twelve signs sit on a true zodiac ring around Polaris,
// and the six feature sections hang as dial plates along one vertical axis.
// Fully self-contained: inline SVG, Tailwind for layout, one scoped <style>
// block (lnoc- prefixed). Server-component safe: no hooks, CSS animations
// only, statically prerendered.

import type { Metadata } from "next";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Astro Scope — The night keeps your hours",
  description:
    "Free birth chart, daily horoscopes, synastry and tarot — read by the light of a silver star clock.",
};

const DEG = Math.PI / 180;

// the deck's night palette (variant 0 of the nocturlabe cards)
const SILVER = "#c9d4e6";
const DIM = "#7e8ea6";
const FAINT = "#55647c";
const GOLD = "#d9c084";
const NIGHT = "#070b17";

// radial ticks: n spokes from rIn to rOut around (cx, cy)
function ringTeeth(cx: number, cy: number, rIn: number, rOut: number, n: number, offset = 0) {
  return Array.from({ length: n }, (_, k) => {
    const t = (offset + (360 / n) * k) * DEG;
    return {
      x1: +(cx + rIn * Math.cos(t)).toFixed(1),
      y1: +(cy + rIn * Math.sin(t)).toFixed(1),
      x2: +(cx + rOut * Math.cos(t)).toFixed(1),
      y2: +(cy + rOut * Math.sin(t)).toFixed(1),
    };
  });
}

// regular star path: n outer points alternating outer/inner radius
function starN(cx: number, cy: number, n: number, R: number, r: number): string {
  let d = "";
  for (let k = 0; k < n * 2; k++) {
    const rad = k % 2 ? r : R;
    const t = ((k * 180) / n - 90) * DEG;
    d += `${k ? "L" : "M"} ${(cx + rad * Math.cos(t)).toFixed(1)} ${(cy + rad * Math.sin(t)).toFixed(1)} `;
  }
  return d + "Z";
}

// every glyph carries U+FE0E so it renders as monochrome text, never emoji
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
const ZODIAC = SIGNS.map((s) => s.g);

const GLYPH_FONT = "'DejaVu Sans', 'Segoe UI Symbol', Georgia, serif";
const SERIF_FONT = "Georgia, 'Times New Roman', serif";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/* ======================== COSMIC BACKGROUND DATA ======================== */

// fine starfield across a 1600×1000 field, deterministic so the prerender is stable
const FIELD_STARS = Array.from({ length: 150 }, (_, i) => ({
  x: +((i * 733.7 + 97) % 1600).toFixed(1),
  y: +((i * 449.3 + 53) % 1000).toFixed(1),
  r: +(0.4 + ((i * 11) % 10) / 16).toFixed(2),
  o: +(0.28 + ((i * 17) % 10) / 28).toFixed(2),
  g: i % 4, // twinkle group
  warm: i % 6 === 2, // a few pale-gold stars among the silver ones
}));

// the giant hairline star dial looming behind the viewport (1000×1000)
const MEGA_TICKS = ringTeeth(500, 500, 470, 486, 60);
const MEGA_GLYPHS = ZODIAC.map((g, k) => {
  const t = (k * 30 - 90) * DEG;
  return { g, x: +(500 + 424 * Math.cos(t)).toFixed(1), y: +(500 + 424 * Math.sin(t)).toFixed(1) };
});

/* ========================= HERO STAR-CLOCK DATA ========================= */

const C = 280; // hero axis (viewBox 0 0 560 560)
const R_OUT = 214;

// star dust inside the dial face, deterministic so the prerender is stable
const DUST = Array.from({ length: 44 }, (_, i) => {
  const a = (i * 137.5) * DEG;
  const r = 24 + ((i * 53) % 160);
  return {
    x: +(C + r * Math.cos(a)).toFixed(1),
    y: +(C + r * Math.sin(a)).toFixed(1),
    r: +(0.5 + ((i * 7) % 10) / 22).toFixed(2),
    o: +(0.2 + ((i * 13) % 10) / 26).toFixed(2),
  };
});

// constellation figures relative to the pole, scaled up from the card deck
const S = 1.8;
const URSA: [number, number][] = [
  [-62, -14],
  [-60, 10],
  [-34, 14],
  [-32, -6],
  [-4, -16],
  [18, -24],
  [40, -28],
].map(([x, y]) => [+(x * S).toFixed(1), +(y * S).toFixed(1)]);
const URSA_LINES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [3, 4],
  [4, 5],
  [5, 6],
];
const CASSIOPEIA: [number, number][] = [
  [-14, 58],
  [2, 44],
  [20, 58],
  [38, 46],
  [54, 58],
].map(([x, y]) => [+(x * S).toFixed(1), +(y * S).toFixed(1)]);

// faint field stars engraved on the rotating dial (offset from the pole, radius)
const DIAL_STARS: [number, number, number][] = [
  [-78, -52, 1.6],
  [-40, -62, 1.3],
  [12, -68, 1.7],
  [52, -58, 1.3],
  [74, -30, 1.6],
  [84, 8, 1.2],
  [-86, 18, 1.5],
  [-70, 44, 1.2],
  [-44, 66, 1.6],
  [66, 70, 1.3],
  [86, 40, 1.5],
  [-20, -84, 1.2],
  [34, -84, 1.5],
  [-88, -22, 1.3],
].map(([x, y, r]) => [+(x * S).toFixed(1), +(y * S).toFixed(1), r]);

const HOUR_TEETH = Array.from({ length: 24 }, (_, i) => i * 15);
const MONTH_DIVIDERS = Array.from({ length: 12 }, (_, i) => i * 30 + 15);

function HeroNocturlabe() {
  return (
    <svg
      viewBox="0 0 560 560"
      className="h-auto w-full"
      role="img"
      aria-label="A silver nocturnal star clock: an outer date ring, an inner star dial with Ursa Major and Cassiopeia turning slowly around Polaris, and a long pointer arm"
    >
      {/* engraved star dust on the lacquer */}
      <g className="lnoc-fade" style={{ "--d": ".1s" } as CSSProperties}>
        {DUST.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={SILVER} opacity={s.o} />
        ))}
      </g>

      {/* dial face */}
      <g className="lnoc-fade" style={{ "--d": ".2s" } as CSSProperties}>
        <circle cx={C} cy={C} r={R_OUT} fill="url(#lnoc-g-face)" stroke={SILVER} strokeWidth="1.6" />
        <circle cx={C} cy={C} r={R_OUT - 5} fill="none" stroke={FAINT} strokeWidth="0.5" opacity="0.7" />
      </g>

      {/* hour-scale teeth around the rim */}
      <g className="lnoc-fade" style={{ "--d": ".3s" } as CSSProperties}>
        {HOUR_TEETH.map((a) => {
          const major = a % 90 === 0;
          return (
            <g key={a} transform={`rotate(${a} ${C} ${C})`}>
              <line
                x1={C}
                y1={C - R_OUT}
                x2={C}
                y2={C - R_OUT - (major ? 8 : 4.5)}
                stroke={major ? GOLD : DIM}
                strokeWidth={major ? 1.5 : 0.7}
              />
            </g>
          );
        })}
      </g>

      {/* outer date ring */}
      <g className="lnoc-fade" style={{ "--d": ".4s" } as CSSProperties}>
        <circle cx={C} cy={C} r="185" fill="none" stroke={DIM} strokeWidth="0.8" />
        {MONTH_DIVIDERS.map((a) => (
          <g key={a} transform={`rotate(${a} ${C} ${C})`}>
            <line x1={C} y1={C - 185} x2={C} y2={C - 214} stroke={FAINT} strokeWidth="0.6" />
          </g>
        ))}
        {MONTHS.map((m, i) => (
          <g key={m} transform={`rotate(${i * 30} ${C} ${C})`}>
            <text
              x={C}
              y={C - 192}
              textAnchor="middle"
              fontFamily={SERIF_FONT}
              fontSize="11"
              letterSpacing="2"
              fill={SILVER}
              opacity="0.9"
            >
              {m}
            </text>
          </g>
        ))}
      </g>

      {/* inner rotating star dial: load calibration wrapper + 150s ambient drift */}
      <g className="lnoc-dial-load">
        <g className="lnoc-drift">
          <circle cx={C} cy={C} r="178" fill="none" stroke={DIM} strokeWidth="0.9" />
          <circle cx={C} cy={C} r="163" fill="none" stroke={FAINT} strokeWidth="0.4" opacity="0.6" />

          {/* faint engraved field stars */}
          <g fill={FAINT}>
            {DIAL_STARS.map(([dx, dy, r], i) => (
              <circle key={i} cx={C + dx} cy={C + dy} r={r} />
            ))}
          </g>

          {/* Ursa Major stick figure */}
          <g stroke={SILVER} strokeWidth="1" opacity="0.9">
            {URSA_LINES.map(([a, b]) => (
              <line
                key={`${a}-${b}`}
                x1={C + URSA[a][0]}
                y1={C + URSA[a][1]}
                x2={C + URSA[b][0]}
                y2={C + URSA[b][1]}
              />
            ))}
          </g>
          <g fill={SILVER}>
            {URSA.map(([dx, dy], i) => (
              <circle key={i} cx={C + dx} cy={C + dy} r={i === 0 || i === 6 ? 2.7 : 2.1} />
            ))}
          </g>

          {/* Cassiopeia's W */}
          <polyline
            points={CASSIOPEIA.map(([dx, dy]) => `${C + dx},${C + dy}`).join(" ")}
            fill="none"
            stroke={SILVER}
            strokeWidth="1"
            opacity="0.9"
          />
          <g fill={SILVER}>
            {CASSIOPEIA.map(([dx, dy], i) => (
              <circle key={i} cx={C + dx} cy={C + dy} r="2.1" />
            ))}
          </g>

          {/* engraved reticle cross around the pole */}
          <g stroke={FAINT} strokeWidth="0.7" opacity="0.8">
            <line x1={C - 44} y1={C} x2={C - 17} y2={C} />
            <line x1={C + 17} y1={C} x2={C + 44} y2={C} />
            <line x1={C} y1={C - 44} x2={C} y2={C - 17} />
            <line x1={C} y1={C + 17} x2={C} y2={C + 44} />
          </g>

          {/* Polaris at the pole, twinkling gently */}
          <g className="lnoc-polaris">
            <path d={starN(C, C, 4, 15, 3.4)} fill={GOLD} />
            <circle cx={C} cy={C} r="4" fill="#f4e3ae" />
          </g>
        </g>
      </g>

      {/* sighting hole at the very center */}
      <circle cx={C} cy={C} r="5.5" fill={NIGHT} stroke={SILVER} strokeWidth="0.9" />

      {/* regula: the long pointer arm, swings to its mark on load */}
      <g className="lnoc-arm">
        <path
          d={`M ${C - 4.5} ${C - 46} L ${C} ${C - 228} L ${C + 4.5} ${C - 46} L ${C + 2.8} ${C - 8} L ${C - 2.8} ${C - 8} Z`}
          fill={SILVER}
          fillOpacity="0.24"
          stroke={SILVER}
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <line x1={C} y1={C - 214} x2={C} y2={C - 18} stroke={SILVER} strokeWidth="0.6" opacity="0.8" />
        {/* counterweight tail */}
        <path
          d={`M ${C - 5} ${C + 10} L ${C} ${C + 46} L ${C + 5} ${C + 10} Z`}
          fill={SILVER}
          fillOpacity="0.24"
          stroke={SILVER}
          strokeWidth="0.9"
          strokeLinejoin="round"
        />
        <circle cx={C} cy={C} r="8.5" fill="none" stroke={SILVER} strokeWidth="1" />
      </g>
    </svg>
  );
}

/* ======================== PANEL MINI-INSTRUMENTS ======================== */
// all are 140×140, all ambient motion is CSS (classes from the lnoc- block)

// point on a small wheel (140×140, center 70), angle clockwise from the top
const wheelPt = (a: number, r: number): [number, number] => {
  const t = (a - 90) * DEG;
  return [+(70 + r * Math.cos(t)).toFixed(1), +(70 + r * Math.sin(t)).toFixed(1)];
};

// seven wanderers seated at their degrees — every glyph carries U+FE0E
const PLANETS = [
  { g: "☉︎", a: 12 },
  { g: "☽︎", a: 84 },
  { g: "☿︎", a: 38 },
  { g: "♀︎", a: 155 },
  { g: "♂︎", a: 200 },
  { g: "♃︎", a: 262 },
  { g: "♄︎", a: 318 },
];
const ASPECTS = [
  [0, 4],
  [1, 5],
  [2, 6],
  [0, 3],
].map(([i, j]) => {
  const [x1, y1] = wheelPt(PLANETS[i].a, 27);
  const [x2, y2] = wheelPt(PLANETS[j].a, 27);
  return { x1, y1, x2, y2 };
});

// BIRTH CHART — a natal wheel: silver zodiac band turning slowly around house spokes
function MechBirthChart() {
  const spokes = ringTeeth(70, 70, 16, 40, 12);
  const dividers = ringTeeth(70, 70, 48, 55, 12);
  return (
    <svg viewBox="0 0 140 140" className="h-[140px] w-[140px]" role="img" aria-label="A small silver natal wheel with a slowly turning zodiac ring">
      <circle cx="70" cy="70" r="64" fill="none" stroke="url(#lnoc-g-frame)" strokeWidth="1.4" />
      <circle cx="70" cy="70" r="48" fill="none" stroke={FAINT} strokeWidth="0.6" />
      {spokes.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={DIM} strokeWidth="0.8" opacity="0.9" />
      ))}
      <circle cx="70" cy="70" r="16" fill="none" stroke={SILVER} strokeWidth="0.9" />
      <circle cx="70" cy="70" r="2.2" fill="#f4e3ae" />
      {/* aspect lines across the hub, pulsing slowly in turn */}
      {ASPECTS.map((l, i) => (
        <line
          key={i}
          className="lnoc-shimmer"
          style={{ "--t": "18s", "--d": `${i * 4.5}s` } as CSSProperties}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="rgba(217,192,132,.45)"
          strokeWidth="0.7"
        />
      ))}
      {/* planet glyphs seated at their degrees */}
      {PLANETS.map((p) => {
        const [x, y] = wheelPt(p.a, 27);
        const [dx, dy] = wheelPt(p.a, 35);
        return (
          <g key={p.a}>
            <circle cx={dx} cy={dy} r="1" fill={GOLD} opacity="0.9" />
            <text x={x} y={y + 3.2} textAnchor="middle" fontFamily={GLYPH_FONT} fontSize="9" fill={SILVER}>
              {p.g}
            </text>
          </g>
        );
      })}
      <g className="lnoc-cw" style={{ "--o": "70px 70px", "--t": "150s" } as CSSProperties}>
        {dividers.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={FAINT} strokeWidth="0.7" />
        ))}
        {ZODIAC.map((g, k) => {
          const t = (k * 30 - 75) * DEG;
          return (
            <text
              key={g}
              x={70 + 51.5 * Math.cos(t)}
              y={70 + 51.5 * Math.sin(t) + 2.6}
              textAnchor="middle"
              fontFamily={GLYPH_FONT}
              fontSize="8"
              fill={GOLD}
            >
              {g}
            </text>
          );
        })}
      </g>
    </svg>
  );
}

// DAILY HOROSCOPE — a 24-hour night dial: creeping hand, moon-phase disc cycling
function MechHoroscope() {
  const ticks = ringTeeth(70, 72, 44, 50, 24);
  return (
    <svg viewBox="0 0 140 140" className="h-[140px] w-[140px]" role="img" aria-label="A silver night dial with a creeping hour hand and a cycling moon-phase disc">
      <defs>
        <clipPath id="lnoc-moonclip">
          <circle cx="70" cy="72" r="10" />
        </clipPath>
      </defs>
      <circle cx="70" cy="72" r="52" fill="none" stroke="url(#lnoc-g-frame)" strokeWidth="1.4" />
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={i % 6 === 0 ? GOLD : FAINT} strokeWidth={i % 6 === 0 ? 0.9 : 0.45} opacity="0.9" />
      ))}
      {/* hour hand, clockwise over 110s, tipped with a small star */}
      <g className="lnoc-cw" style={{ "--o": "70px 72px", "--t": "110s" } as CSSProperties}>
        <line x1="70" y1="72" x2="70" y2="36" stroke={SILVER} strokeWidth="1.4" strokeLinecap="round" />
        <path d={starN(70, 34, 4, 4.4, 1.7)} fill={GOLD} />
      </g>
      {/* moon-phase disc: a shadow sweeps a silver disc, endlessly */}
      <circle cx="70" cy="72" r="10" fill="url(#lnoc-g-moon)" />
      <g clipPath="url(#lnoc-moonclip)">
        <circle className="lnoc-phase" cx="70" cy="72" r="10" fill="#0a1122" opacity="0.94" />
      </g>
      <circle cx="70" cy="72" r="10" fill="none" stroke={SILVER} strokeWidth="1" />
      <circle cx="70" cy="72" r="1.5" fill={NIGHT} stroke={SILVER} strokeWidth="0.7" />
      {/* engraved crescent below the dial */}
      <text x="70" y="118" textAnchor="middle" fontFamily={GLYPH_FONT} fontSize="11" fill={FAINT}>
        ☽︎
      </text>
    </svg>
  );
}

// COMPATIBILITY — two moon dials overlapping; the shared lens breathes
function MechCompatibility() {
  const ticksA = ringTeeth(50, 70, 26, 30, 18);
  const ticksB = ringTeeth(90, 70, 26, 30, 18, 10);
  return (
    <svg viewBox="0 0 140 140" className="h-[140px] w-[140px]" role="img" aria-label="Two overlapping silver moon dials whose shared lens glows softly">
      {/* the shared lens where the two charts overlap */}
      <circle className="lnoc-breathe" style={{ "--t": "16s" } as CSSProperties} cx="70" cy="70" r="13" fill="url(#lnoc-g-lens)" />
      {/* left dial */}
      <circle cx="50" cy="70" r="30" fill="#0a1122" fillOpacity="0.55" stroke={SILVER} strokeWidth="1.2" />
      <g className="lnoc-cw" style={{ "--o": "50px 70px", "--t": "120s" } as CSSProperties}>
        {ticksA.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={DIM} strokeWidth="0.6" />
        ))}
      </g>
      {/* left moon: half-lit */}
      <path d="M 50 58 A 12 12 0 1 0 50 82 A 8 12 0 1 1 50 58 Z" fill={SILVER} opacity="0.85" />
      <text x="50" y="105" textAnchor="middle" fontFamily={GLYPH_FONT} fontSize="9" fill={GOLD}>
        ♀︎
      </text>
      {/* right dial */}
      <circle cx="90" cy="70" r="30" fill="#0a1122" fillOpacity="0.55" stroke={SILVER} strokeWidth="1.2" />
      <g className="lnoc-ccw" style={{ "--o": "90px 70px", "--t": "140s" } as CSSProperties}>
        {ticksB.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={DIM} strokeWidth="0.6" />
        ))}
      </g>
      {/* right moon: half-lit the other way */}
      <path d="M 90 58 A 12 12 0 1 1 90 82 A 8 12 0 1 0 90 58 Z" fill={SILVER} opacity="0.85" />
      <text x="90" y="105" textAnchor="middle" fontFamily={GLYPH_FONT} fontSize="9" fill={GOLD}>
        ♂︎
      </text>
    </svg>
  );
}

// TAROT — a pendulum swinging over an engraved arc scale
function MechTarot() {
  const arcTicks = ringTeeth(70, 22, 74, 80, 9, 150);
  return (
    <svg viewBox="0 0 140 140" className="h-[140px] w-[140px]" role="img" aria-label="A silver pendulum swinging slowly over an engraved arc scale">
      {/* arc scale */}
      <path d="M 14 96 A 78 78 0 0 1 126 96" fill="none" stroke={FAINT} strokeWidth="0.6" />
      {arcTicks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={i === 4 ? GOLD : DIM} strokeWidth={i === 4 ? 0.9 : 0.5} />
      ))}
      {/* pivot */}
      <circle cx="70" cy="22" r="3.4" fill={NIGHT} stroke="url(#lnoc-g-frame)" strokeWidth="1.2" />
      {/* the pendulum */}
      <g className="lnoc-swing">
        <line x1="70" y1="22" x2="70" y2="86" stroke={SILVER} strokeWidth="1.1" />
        {[38, 52, 66].map((y) => (
          <circle key={y} cx="70" cy={y} r="1.4" fill="none" stroke={FAINT} strokeWidth="0.6" />
        ))}
        <circle className="lnoc-breathe" style={{ "--t": "13s" } as CSSProperties} cx="70" cy="94" r="14" fill="url(#lnoc-g-lens)" />
        <circle cx="70" cy="94" r="8" fill={NIGHT} stroke={SILVER} strokeWidth="1.1" />
        <path d={starN(70, 94, 8, 5.4, 2.2)} fill={GOLD} />
        <circle cx="70" cy="94" r="1.2" fill="#f4e3ae" />
      </g>
    </svg>
  );
}

// PSYCHOLOGY — a prism splitting one silver beam into a quiet night spectrum
function MechPsychology() {
  return (
    <svg viewBox="0 0 140 140" className="h-[140px] w-[140px]" role="img" aria-label="A beam of starlight splitting through a silver-framed prism into a cool spectrum">
      {/* incoming beam */}
      <line className="lnoc-shimmer" style={{ "--t": "10s" } as CSSProperties} x1="10" y1="76" x2="54" y2="67" stroke={SILVER} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="54" cy="67" r="2" fill="#f4e3ae" />
      {/* prism */}
      <path d="M 70 40 L 48 88 L 92 88 Z" fill="rgba(201,212,230,0.05)" stroke={SILVER} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M 70 49 L 55 82 L 85 82 Z" fill="none" stroke={FAINT} strokeWidth="0.6" opacity="0.9" />
      {/* the split spectrum: silver, ice blue, pale gold */}
      <line className="lnoc-shimmer" style={{ "--t": "10s", "--d": ".8s" } as CSSProperties} x1="79" y1="65" x2="128" y2="50" stroke={SILVER} strokeWidth="1.6" strokeLinecap="round" />
      <line className="lnoc-shimmer" style={{ "--t": "10s", "--d": "1.6s" } as CSSProperties} x1="81" y1="70" x2="128" y2="68" stroke="#9db4e0" strokeWidth="2" strokeLinecap="round" />
      <line className="lnoc-shimmer" style={{ "--t": "10s", "--d": "2.4s" } as CSSProperties} x1="79" y1="75" x2="128" y2="86" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" />
      {/* instrument stand */}
      <line x1="54" y1="97" x2="86" y2="97" stroke={FAINT} strokeWidth="0.9" />
      <line x1="70" y1="88" x2="70" y2="97" stroke={FAINT} strokeWidth="0.9" />
    </svg>
  );
}

// COSMIC PASSPORT — an engraved plate with a slowly rotating seal ring
function MechPassport() {
  return (
    <svg viewBox="0 0 140 140" className="h-[140px] w-[140px]" role="img" aria-label="An engraved silver plate with a rotating circular seal">
      <defs>
        <path id="lnoc-seal-circ" d="M 47 62 A 23 23 0 1 1 93 62 A 23 23 0 1 1 47 62" fill="none" />
      </defs>
      <rect x="20" y="24" width="100" height="92" rx="3" fill="#0a1122" stroke="url(#lnoc-g-frame)" strokeWidth="1.3" />
      <rect x="25" y="29" width="90" height="82" rx="2" fill="none" stroke={FAINT} strokeWidth="0.5" />
      {[32, 108].map((x) =>
        [36, 108].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.1" fill={GOLD} opacity="0.85" />)
      )}
      {/* seal: fixed rim + ticks, inscription ring turning over 70s */}
      <circle cx="70" cy="62" r="28" fill="none" stroke={FAINT} strokeWidth="0.6" />
      {ringTeeth(70, 62, 26.5, 28, 24).map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={FAINT} strokeWidth="0.5" />
      ))}
      <g className="lnoc-cw" style={{ "--o": "70px 62px", "--t": "70s" } as CSSProperties}>
        <text fontFamily={SERIF_FONT} fontSize="6.6" letterSpacing="1.1" fill={SILVER}>
          <textPath href="#lnoc-seal-circ">ASTRO SCOPE · COSMIC PASSPORT · ONE SKY ·</textPath>
        </text>
      </g>
      <path d={starN(70, 62, 4, 9, 3.4)} fill={NIGHT} stroke={GOLD} strokeWidth="0.9" strokeLinejoin="round" />
      <circle cx="70" cy="62" r="1.3" fill="#f4e3ae" />
      {/* engraved lines below the seal */}
      <line x1="46" y1="97" x2="94" y2="97" stroke={FAINT} strokeWidth="0.6" />
      <line x1="54" y1="102" x2="86" y2="102" stroke={FAINT} strokeWidth="0.45" />
    </svg>
  );
}

/* ====================== DESTINY MATRIX OCTAGRAM ======================== */

const OCT_C = 160;
const OCT_R = 122;
const OCT_PTS = Array.from({ length: 8 }, (_, k) => {
  const t = (k * 45 - 90) * DEG;
  return { x: +(OCT_C + OCT_R * Math.cos(t)).toFixed(1), y: +(OCT_C + OCT_R * Math.sin(t)).toFixed(1) };
});
const OCT_SQUARE_A = [0, 2, 4, 6].map((k) => OCT_PTS[k]);
const OCT_SQUARE_B = [1, 3, 5, 7].map((k) => OCT_PTS[k]);
const OCT_NODES = [
  { label: "DESTINY", n: "22" },
  { label: "PURPOSE", n: "7" },
  { label: "LOVE", n: "15" },
  { label: "MONEY", n: "9" },
  { label: "TALENT", n: "13" },
  { label: "KARMA", n: "4" },
  { label: "HEALTH", n: "18" },
  { label: "SPIRIT", n: "11" },
];

function DestinyOctagram() {
  return (
    <svg
      viewBox="0 0 320 320"
      className="h-auto w-full"
      role="img"
      aria-label="A night calculation plate: a silver octagram of the Destiny Matrix with eight labeled nodes and degree ticks"
    >
      {/* degree ticks of the calculation ring */}
      {ringTeeth(OCT_C, OCT_C, 146, 152, 48).map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={i % 6 === 0 ? DIM : FAINT} strokeWidth={i % 6 === 0 ? 0.8 : 0.4} />
      ))}
      <circle cx={OCT_C} cy={OCT_C} r="146" fill="none" stroke={FAINT} strokeWidth="0.5" opacity="0.8" />
      {/* slow gleam traveling the outer halo */}
      <g className="lnoc-cw" style={{ "--o": "160px 160px", "--t": "100s" } as CSSProperties}>
        <circle cx={OCT_C} cy={OCT_C} r="139" fill="none" stroke="rgba(201,212,230,.3)" strokeWidth="1" strokeDasharray="22 851" strokeLinecap="round" />
      </g>
      {/* crosshair reticle of the night calculation */}
      <g stroke={FAINT} strokeWidth="0.45" opacity="0.7">
        <line x1="160" y1="14" x2="160" y2="34" />
        <line x1="160" y1="286" x2="160" y2="306" />
        <line x1="14" y1="160" x2="34" y2="160" />
        <line x1="286" y1="160" x2="306" y2="160" />
      </g>
      {/* spokes from the heart to each vertex */}
      {OCT_PTS.map((p, i) => (
        <line key={i} x1="160" y1="160" x2={p.x} y2={p.y} stroke={FAINT} strokeWidth="0.5" opacity="0.75" />
      ))}
      {/* the octagram itself: two overlaid squares in silver */}
      <polygon points={OCT_SQUARE_A.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={SILVER} strokeWidth="1" opacity="0.95" />
      <polygon points={OCT_SQUARE_B.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={SILVER} strokeWidth="1" opacity="0.7" />
      {/* glowing heart of the matrix */}
      <circle className="lnoc-breathe" style={{ "--t": "14s" } as CSSProperties} cx="160" cy="160" r="18" fill="url(#lnoc-g-lens)" />
      <circle cx="160" cy="160" r="4" fill="url(#lnoc-g-moon)" stroke={GOLD} strokeWidth="0.9" />
      {/* vertex seals with arcana numbers, lighting up in sequence */}
      {OCT_PTS.map((p, i) => {
        const t = (i * 45 - 90) * DEG;
        const lx = 160 + (OCT_R + 24) * Math.cos(t);
        const ly = 160 + (OCT_R + 24) * Math.sin(t);
        return (
          <g key={i} className="lnoc-node" style={{ "--d": `${i * 1.4}s` } as CSSProperties}>
            <circle cx={p.x} cy={p.y} r="9" fill="#0a1122" stroke="url(#lnoc-g-frame)" strokeWidth="1.2" />
            <text x={p.x} y={p.y + 2.6} textAnchor="middle" fontFamily={SERIF_FONT} fontWeight="700" fontSize="8" fill={SILVER}>
              {OCT_NODES[i].n}
            </text>
            <text x={lx.toFixed(1)} y={(ly + 2.5).toFixed(1)} textAnchor="middle" fontSize="7.5" letterSpacing="1.5" fill={GOLD} opacity="0.9">
              {OCT_NODES[i].label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ================================ FAQ ================================== */

const FAQS = [
  {
    n: "I",
    q: "What can I do on Astro Scope for free?",
    a: "Cast a free birth chart, read daily horoscopes for all twelve signs, pull tarot spreads, run compatibility and psychology tests — no account required.",
  },
  {
    n: "II",
    q: "How do I get my free birth chart?",
    a: "Open the calculator, enter your birth date, time and place, and generate — your wheel appears in seconds.",
  },
  {
    n: "III",
    q: "Where are daily horoscopes?",
    a: "Every sign from the homepage grid or the Horoscopes hub — the whole sky, every day.",
  },
  {
    n: "IV",
    q: "What is the Destiny Matrix?",
    a: "An optional birth-date octagram mapping purpose, love, money and age themes — a numerological companion to the natal chart.",
  },
];

/* ============================== PANEL DATA ============================= */

const PANELS = [
  {
    tag: "FREE",
    title: "Birth Chart",
    desc: "Map your Sun, Moon, and Rising — the foundation of every reading.",
    href: "/birth-chart",
    mech: <MechBirthChart />,
    num: "I",
  },
  {
    tag: "DAILY",
    title: "Daily Horoscope",
    desc: "Twelve signs, one sky. Clear forecasts without the fluff.",
    href: "/horoscope",
    mech: <MechHoroscope />,
    num: "II",
  },
  {
    tag: "SYNASTRY",
    title: "Compatibility",
    desc: "Zodiac match, Chinese pairs, and deep synastry for two charts.",
    href: "/compatibility",
    mech: <MechCompatibility />,
    num: "III",
  },
  {
    tag: "SPREADS",
    title: "Tarot",
    desc: "Daily card to Celtic Cross — pull, reflect, get a full reading.",
    href: "/tarot",
    mech: <MechTarot />,
    num: "IV",
  },
  {
    tag: "TESTS",
    title: "Psychology",
    desc: "MBTI, Big Five, empathy and more — meet yourself beyond the signs.",
    href: "/psychology",
    mech: <MechPsychology />,
    num: "V",
  },
  {
    tag: "YOU",
    title: "Cosmic Passport",
    desc: "Your Cosmic ID, people, journal, and Premium deep dives — one hub.",
    href: "/passport",
    mech: <MechPassport />,
    num: "VI",
  },
];

// zodiac ring geometry: plates at 41% radius of the square stage
const RING_POS = SIGNS.map((s, k) => {
  const t = (k * 30 - 90) * DEG;
  return {
    ...s,
    x: +(50 + 41 * Math.cos(t)).toFixed(2),
    y: +(50 + 41 * Math.sin(t)).toFixed(2),
  };
});
const RING_TICKS = ringTeeth(340, 340, 322, 328, 60);

/* ================================= PAGE ================================== */

export default function NocturlabeLanding() {
  return (
    <div className="lnoc-root relative isolate min-h-screen">
      <style>{`
        .lnoc-root { background: ${NIGHT}; color: #dde5f2; font-family: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif; }
        .lnoc-root ::selection { background: rgba(157,180,224,.25); color: #f4e3ae; }
        .lnoc-serif { font-family: Georgia, 'Times New Roman', serif; }
        .lnoc-rule { height: 1px; background: linear-gradient(90deg, transparent, rgba(126,142,166,.5), transparent); }

        /* buttons */
        .lnoc-btn-primary { display: inline-block; background: linear-gradient(180deg, #efe2b6 0%, #d9c084 52%, #b09554 100%); color: #131a2c; border: 1px solid #8a7847; box-shadow: inset 0 1px 0 rgba(255,248,224,.8), inset 0 -1px 0 rgba(90,76,40,.6), 0 12px 30px -14px rgba(217,192,132,.4); transition: filter .35s ease, box-shadow .35s ease; }
        .lnoc-btn-primary:hover { filter: brightness(1.07); box-shadow: inset 0 1px 0 rgba(255,248,224,.8), inset 0 -1px 0 rgba(90,76,40,.6), 0 16px 36px -12px rgba(217,192,132,.55); }
        .lnoc-btn-ghost { display: inline-block; border: 1px solid rgba(126,142,166,.5); color: #c9d4e6; transition: border-color .35s ease, background .35s ease, color .35s ease; }
        .lnoc-btn-ghost:hover { border-color: rgba(217,192,132,.7); background: rgba(157,180,224,.06); color: #f4e3ae; }

        /* engraved plates (panels, FAQ, zodiac plates) */
        .lnoc-panel { background: #0a1122; border: 1px solid rgba(126,142,166,.35); box-shadow: inset 0 0 0 3px #0a1122, inset 0 0 0 4px rgba(126,142,166,.2); transition: transform .5s cubic-bezier(.22,.7,.3,1), border-color .5s ease, box-shadow .5s ease; }
        .lnoc-panel:hover { transform: translateY(-4px); border-color: rgba(201,212,230,.55); box-shadow: 0 20px 44px -20px rgba(0,0,0,.9), 0 0 34px -8px rgba(157,180,224,.18), inset 0 0 0 3px #0a1122, inset 0 0 0 4px rgba(201,212,230,.3); }
        .lnoc-mech { transition: filter .5s ease; }
        .lnoc-panel:hover .lnoc-mech { filter: drop-shadow(0 0 12px rgba(201,212,230,.25)); }
        .lnoc-corner { position: absolute; width: 7px; height: 7px; }
        .lnoc-tag { display: inline-block; border: 1px solid rgba(169,143,78,.55); color: #d9c084; background: rgba(217,192,132,.05); box-shadow: inset 0 1px 2px rgba(0,0,0,.6); letter-spacing: .28em; }
        .lnoc-link { color: #c9d4e6; transition: color .3s ease; }
        .lnoc-panel:hover .lnoc-link { color: #f4e3ae; }
        .lnoc-num { position: absolute; top: 10px; right: 12px; font-family: Georgia, 'Times New Roman', serif; font-size: 10px; letter-spacing: 2px; color: rgba(126,142,166,.55); }

        /* zodiac ring plates */
        .lnoc-zplate { background: #0a1122; border: 1px solid rgba(126,142,166,.35); box-shadow: inset 0 0 0 2px #0a1122, inset 0 0 0 3px rgba(126,142,166,.18); transition: border-color .4s ease, box-shadow .4s ease, transform .4s ease; }
        .lnoc-zplate:hover { border-color: rgba(217,192,132,.65); box-shadow: 0 0 24px -6px rgba(157,180,224,.3), inset 0 0 0 2px #0a1122, inset 0 0 0 3px rgba(217,192,132,.3); }
        .lnoc-zabs { position: absolute; transform: translate(-50%, -50%); }
        .lnoc-zabs:hover { transform: translate(-50%, calc(-50% - 3px)); }

        .lnoc-nav-link { transition: color .3s ease; }
        .lnoc-nav-link:hover { color: #d9c084; }

        /* the silver axis threading hero, ring and instruments */
        .lnoc-axis { position: absolute; top: 0; bottom: 0; left: 50%; width: 1px; background: linear-gradient(180deg, transparent, rgba(126,142,166,.35) 12%, rgba(126,142,166,.35) 88%, transparent); pointer-events: none; }
        .lnoc-axis-node { position: absolute; left: 50%; top: 50%; width: 9px; height: 9px; transform: translate(-50%, -50%) rotate(45deg); background: #0a1122; border: 1px solid rgba(201,212,230,.6); }
        .lnoc-axis-node::after { content: ""; position: absolute; inset: 2.5px; background: #d9c084; }

        /* load: text rises, the dial calibrates, the arm swings to its mark */
        .lnoc-rise { animation: lnoc-rise .9s cubic-bezier(.22,.7,.3,1) backwards; animation-delay: var(--d, 0s); }
        .lnoc-fade { animation: lnoc-fade-in 1s ease-out backwards; animation-delay: var(--d, 0s); }
        .lnoc-dial-load { transform-box: view-box; transform-origin: 280px 280px; animation: lnoc-cal 1.6s cubic-bezier(.25,.85,.3,1) backwards; }
        .lnoc-arm { transform-box: view-box; transform-origin: 280px 280px; transform: rotate(-18deg); animation: lnoc-arm-in 1.4s cubic-bezier(.3,.9,.3,1) .5s backwards; }

        /* ambient motion — all slow, all restrained */
        .lnoc-drift { transform-box: view-box; transform-origin: 280px 280px; animation: lnoc-spin 150s linear infinite; }
        .lnoc-cw  { transform-box: view-box; transform-origin: var(--o, 70px 70px); animation: lnoc-spin var(--t, 120s) linear infinite; }
        .lnoc-ccw { transform-box: view-box; transform-origin: var(--o, 70px 70px); animation: lnoc-spin-rev var(--t, 120s) linear infinite; }
        .lnoc-breathe { animation: lnoc-breathe var(--t, 16s) ease-in-out infinite; }
        .lnoc-swing { transform-box: view-box; transform-origin: 70px 22px; animation: lnoc-swing 13s ease-in-out infinite alternate; }
        .lnoc-shimmer { animation: lnoc-shimmer var(--t, 10s) ease-in-out infinite; animation-delay: var(--d, 0s); }
        .lnoc-phase { transform-box: view-box; animation: lnoc-phase 32s ease-in-out infinite alternate; }
        .lnoc-polaris { transform-box: fill-box; transform-origin: center; animation: lnoc-twinkle 7s ease-in-out infinite; }
        .lnoc-node { animation: lnoc-nodepulse 11.2s ease-in-out infinite; animation-delay: var(--d, 0s); }

        @keyframes lnoc-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes lnoc-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lnoc-cal { from { opacity: .3; transform: rotate(-28deg); } to { opacity: 1; transform: rotate(0deg); } }
        @keyframes lnoc-arm-in { from { opacity: 0; transform: rotate(-75deg); } to { opacity: 1; transform: rotate(-18deg); } }
        @keyframes lnoc-spin { to { transform: rotate(360deg); } }
        @keyframes lnoc-spin-rev { to { transform: rotate(-360deg); } }
        @keyframes lnoc-breathe { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }
        @keyframes lnoc-swing { from { transform: rotate(-4.5deg); } to { transform: rotate(4.5deg); } }
        @keyframes lnoc-shimmer { 0%, 100% { opacity: .35; } 50% { opacity: .95; } }
        @keyframes lnoc-phase { from { transform: translateX(-17px); } to { transform: translateX(17px); } }
        @keyframes lnoc-twinkle { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .55; transform: scale(.84); } }
        @keyframes lnoc-nodepulse { 0%, 100% { opacity: .45; } 6% { opacity: 1; } 18% { opacity: .45; } }

        /* ---------- cosmic background ---------- */
        .lnoc-bg { position: fixed; inset: 0; z-index: -1; overflow: hidden; pointer-events: none; background: radial-gradient(120% 70% at 50% -12%, #0d1730 0%, #070b17 58%); }
        .lnoc-neb { position: absolute; border-radius: 50%; filter: blur(40px); animation: lnoc-nebdrift var(--t, 100s) ease-in-out infinite alternate; }
        .lnoc-tw1 { animation: lnoc-star 8s ease-in-out infinite; }
        .lnoc-tw2 { animation: lnoc-star 12s ease-in-out infinite 2.4s; }
        .lnoc-tw3 { animation: lnoc-star 15s ease-in-out infinite 4.3s; }
        .lnoc-tw4 { animation: lnoc-star 10s ease-in-out infinite 1.4s; }
        .lnoc-mega { position: absolute; }
        .lnoc-meteor { position: absolute; width: 120px; height: 1px; border-radius: 1px; background: linear-gradient(90deg, rgba(221,229,242,.9), rgba(221,229,242,0)); opacity: 0; pointer-events: none; animation: lnoc-meteor 17s linear infinite; }
        .lnoc-meteor-late { animation-duration: 23s; animation-delay: 9s; }

        @keyframes lnoc-star { 0%, 100% { opacity: .12; } 50% { opacity: .75; } }
        @keyframes lnoc-nebdrift { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(2.5%, -2%, 0); } }
        @keyframes lnoc-meteor {
          0%   { opacity: 0; transform: translate3d(0, 0, 0) rotate(-24deg); }
          2%   { opacity: .8; }
          8%   { opacity: 0; transform: translate3d(-260px, 116px, 0) rotate(-24deg); }
          100% { opacity: 0; transform: translate3d(-260px, 116px, 0) rotate(-24deg); }
        }

        .lnoc-chip { display: inline-flex; align-items: center; gap: .5em; border: 1px solid rgba(126,142,166,.45); background: rgba(157,180,224,.05); color: #c9d4e6; box-shadow: inset 0 1px 2px rgba(0,0,0,.6); letter-spacing: .14em; }

        /* FAQ numeral diamond */
        .lnoc-diamond { display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; flex-shrink: 0; border: 1px solid rgba(169,143,78,.6); background: rgba(217,192,132,.05); transform: rotate(45deg); box-shadow: inset 0 1px 2px rgba(0,0,0,.6); }
        .lnoc-diamond > span { transform: rotate(-45deg); }

        @media (prefers-reduced-motion: reduce) {
          .lnoc-rise, .lnoc-fade, .lnoc-dial-load, .lnoc-arm, .lnoc-drift,
          .lnoc-cw, .lnoc-ccw, .lnoc-breathe, .lnoc-swing, .lnoc-shimmer,
          .lnoc-phase, .lnoc-polaris, .lnoc-node,
          .lnoc-tw1, .lnoc-tw2, .lnoc-tw3, .lnoc-tw4, .lnoc-neb, .lnoc-meteor {
            animation: none;
          }
          .lnoc-arm { transform: rotate(-18deg); }
        }
      `}</style>

      {/* cosmic background: fixed behind all content — moonlit washes, a slow
          twinkling starfield, and a giant hairline star dial looming below */}
      <div className="lnoc-bg" aria-hidden="true">
        <div
          className="lnoc-neb"
          style={{ width: "52vmax", height: "52vmax", left: "-14vmax", top: "-12vmax", background: "radial-gradient(circle, rgba(88,110,180,.14) 0%, transparent 65%)", "--t": "105s" } as CSSProperties}
        />
        <div
          className="lnoc-neb"
          style={{ width: "46vmax", height: "46vmax", right: "-12vmax", top: "26%", background: "radial-gradient(circle, rgba(96,88,170,.10) 0%, transparent 65%)", "--t": "120s" } as CSSProperties}
        />
        <div
          className="lnoc-neb"
          style={{ width: "58vmax", height: "58vmax", left: "28%", bottom: "-28vmax", background: "radial-gradient(circle, rgba(64,86,150,.11) 0%, transparent 65%)", "--t": "92s" } as CSSProperties}
        />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
          {FIELD_STARS.map((s, i) => (
            <circle key={i} className={`lnoc-tw${s.g + 1}`} cx={s.x} cy={s.y} r={s.r} fill={s.warm ? GOLD : SILVER} opacity={s.o} />
          ))}
        </svg>
        <svg className="lnoc-mega" style={{ width: "150vmin", height: "150vmin", right: "52%", top: "34vmin" } as CSSProperties} viewBox="0 0 1000 1000">
          <circle cx="500" cy="500" r="497" fill="none" stroke="rgba(126,142,166,.1)" strokeWidth="1" />
          <g className="lnoc-ccw" style={{ "--o": "500px 500px", "--t": "320s" } as CSSProperties}>
            <circle cx="500" cy="500" r="468" fill="none" stroke="rgba(126,142,166,.16)" strokeWidth="1" />
            <circle cx="500" cy="500" r="380" fill="none" stroke="rgba(126,142,166,.1)" strokeWidth="0.7" strokeDasharray="2 6" />
            {MEGA_TICKS.map((t, i) => (
              <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="rgba(126,142,166,.16)" strokeWidth={i % 5 === 0 ? 1 : 0.5} />
            ))}
            {MEGA_GLYPHS.map((m) => (
              <text key={m.g} x={m.x} y={m.y + 10} textAnchor="middle" fontFamily={GLYPH_FONT} fontSize="30" fill="rgba(201,212,230,.09)">
                {m.g}
              </text>
            ))}
          </g>
        </svg>
      </div>

      {/* shared defs: objectBoundingBox gradients are reusable across every SVG on the page */}
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="lnoc-g-face" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#0e1830" />
            <stop offset="80%" stopColor="#0a1122" />
            <stop offset="100%" stopColor="#080d1b" />
          </radialGradient>
          <linearGradient id="lnoc-g-frame" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7e8ea6" />
            <stop offset="50%" stopColor="#e2e9f4" />
            <stop offset="100%" stopColor="#55647c" />
          </linearGradient>
          <radialGradient id="lnoc-g-lens" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f4e3ae" stopOpacity="0.8" />
            <stop offset="45%" stopColor="#d9c084" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#d9c084" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="lnoc-g-moon" cx="42%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#f2f5fb" />
            <stop offset="55%" stopColor="#c9d4e6" />
            <stop offset="100%" stopColor="#7e8ea6" />
          </radialGradient>
        </defs>
      </svg>

      {/* ==================== TOP NAV ==================== */}
      <header>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="flex items-center gap-2.5">
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
              <circle cx="12" cy="12" r="9" fill="none" stroke={DIM} strokeWidth="0.8" />
              <g className="lnoc-cw" style={{ "--o": "12px 12px", "--t": "90s" } as CSSProperties}>
                <circle cx="12" cy="12" r="6.4" fill="none" stroke={SILVER} strokeWidth="0.9" />
                {ringTeeth(12, 12, 5, 6.4, 8).map((t, i) => (
                  <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={SILVER} strokeWidth="0.7" />
                ))}
              </g>
              <line x1="12" y1="12" x2="12" y2="4.4" stroke={GOLD} strokeWidth="0.9" />
              <path d={starN(12, 12, 4, 2.6, 1)} fill={GOLD} />
            </svg>
            <span className="lnoc-serif text-[13px] tracking-[0.38em] text-[#c9d4e6]">ASTRO&nbsp;SCOPE</span>
          </a>
          <nav className="flex items-center gap-7 text-[11px] uppercase tracking-[0.22em] text-[#dde5f2]/60">
            <a href="/horoscope" className="lnoc-nav-link hidden sm:inline">Horoscopes</a>
            <a href="/tarot" className="lnoc-nav-link hidden sm:inline">Tarot</a>
            <a href="/compatibility" className="lnoc-nav-link hidden md:inline">Compatibility</a>
            <a href="/sign-in" className="lnoc-nav-link border border-[#55647c]/70 px-3.5 py-1.5 text-[#c9d4e6] hover:border-[#d9c084]/70">Sign&nbsp;In</a>
          </nav>
        </div>
        <div className="lnoc-rule" />
      </header>

      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden">
        <div className="lnoc-axis hidden md:block" aria-hidden="true" />
        {/* moonlit pool behind the headline + occasional shooting stars */}
        <div
          className="lnoc-breathe pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full blur-3xl"
          style={{ "--t": "24s", background: "radial-gradient(closest-side, rgba(157,180,224,.13), transparent 70%)" } as CSSProperties}
          aria-hidden="true"
        />
        <span className="lnoc-meteor left-[62%] top-[12%]" aria-hidden="true" />
        <span className="lnoc-meteor lnoc-meteor-late left-[84%] top-[38%]" aria-hidden="true" />

        <div className="relative mx-auto max-w-4xl px-6 pb-10 pt-16 text-center lg:pt-24">
          <p className="lnoc-rise text-[11px] uppercase tracking-[0.34em] text-[#7e8ea6]" style={{ "--d": ".1s" } as CSSProperties}>
            The Night Observatory
          </p>
          <h1 className="lnoc-rise lnoc-serif mt-6 text-4xl leading-[1.12] text-[#dde5f2] sm:text-6xl" style={{ "--d": ".25s" } as CSSProperties}>
            The night keeps your hours.
            <br />
            <em className="text-[#d9c084]">Learn to read them.</em>
          </h1>
          <p className="lnoc-rise mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-[#dde5f2]/60" style={{ "--d": ".45s" } as CSSProperties}>
            Free birth chart, daily horoscopes, synastry and tarot — set your date against the stars and see what the dark has been keeping for you.
          </p>
          <div className="lnoc-rise mt-9 flex flex-wrap items-center justify-center gap-4" style={{ "--d": ".6s" } as CSSProperties}>
            <a href="/birth-chart" className="lnoc-btn-primary lnoc-serif px-7 py-3.5 text-[13px] font-bold uppercase tracking-[0.18em]">
              Cast your free birth chart
            </a>
            <a href="/horoscope" className="lnoc-btn-ghost px-6 py-3.5 text-[12px] uppercase tracking-[0.2em]">
              Read today&rsquo;s horoscope&nbsp;&rarr;
            </a>
          </div>
        </div>

        {/* the star clock itself, seated on the axis */}
        <div className="relative mx-auto w-full max-w-[560px] px-6 pb-16 lg:pb-20">
          {/* faint constellation polylines woven beside the instrument */}
          <svg className="pointer-events-none absolute -inset-8 h-[calc(100%+4rem)] w-[calc(100%+4rem)]" viewBox="0 0 620 620" aria-hidden="true">
            <g className="lnoc-shimmer" style={{ "--t": "14s" } as CSSProperties}>
              <polyline points="52,190 96,150 152,172 198,128" fill="none" stroke="rgba(157,180,224,.25)" strokeWidth="0.7" />
              {[[52, 190, 1.3], [96, 150, 1.9], [152, 172, 1.4], [198, 128, 2.1]].map(([x, y, r]) => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="rgba(221,229,242,.55)" />
              ))}
            </g>
            <g className="lnoc-shimmer" style={{ "--t": "18s", "--d": "3s" } as CSSProperties}>
              <polyline points="520,500 556,452 596,472 584,528 542,522" fill="none" stroke="rgba(157,180,224,.2)" strokeWidth="0.7" />
              {[[520, 500, 1.2], [556, 452, 1.8], [596, 472, 1.3], [584, 528, 1.9], [542, 522, 1.3]].map(([x, y, r]) => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="rgba(221,229,242,.5)" />
              ))}
            </g>
          </svg>
          <HeroNocturlabe />
          <p className="lnoc-fade mt-2 text-center text-[9.5px] uppercase tracking-[0.4em] text-[#55647c]" style={{ "--d": "1.2s" } as CSSProperties}>
            · horologium noctis ·
          </p>
        </div>
        <div className="lnoc-rule" />
      </section>

      {/* ==================== ZODIAC RING ==================== */}
      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <p className="text-center text-[11px] uppercase tracking-[0.34em] text-[#7e8ea6]">Daily Horoscope</p>
        <h2 className="lnoc-serif mt-4 text-center text-3xl text-[#dde5f2] sm:text-4xl">Twelve plates on one turning ring</h2>
        <p className="mx-auto mt-4 max-w-md text-center text-[13.5px] leading-relaxed text-[#dde5f2]/50">
          Find your sign on the wheel and read what tonight holds.
        </p>

        {/* wide screens: the twelve sign plates seated on a true circle,
            Polaris burning at the hub */}
        <div className="relative mx-auto mt-14 hidden aspect-square max-w-[680px] lg:block">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 680 680" aria-hidden="true">
            <circle cx="340" cy="340" r="326" fill="none" stroke={FAINT} strokeWidth="0.6" opacity="0.7" />
            <circle cx="340" cy="340" r="279" fill="none" stroke={DIM} strokeWidth="0.7" opacity="0.6" />
            <circle cx="340" cy="340" r="240" fill="none" stroke={FAINT} strokeWidth="0.4" strokeDasharray="2 6" opacity="0.5" />
            <g className="lnoc-cw" style={{ "--o": "340px 340px", "--t": "280s" } as CSSProperties}>
              {RING_TICKS.map((t, i) => (
                <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={i % 5 === 0 ? DIM : FAINT} strokeWidth={i % 5 === 0 ? 0.9 : 0.45} opacity="0.8" />
              ))}
            </g>
            {/* the "tonight" marker at the top of the ring */}
            <path d="M 340 6 L 344.5 14 L 340 22 L 335.5 14 Z" fill={GOLD} />
            {/* Polaris at the hub */}
            <circle className="lnoc-breathe" style={{ "--t": "12s" } as CSSProperties} cx="340" cy="340" r="46" fill="url(#lnoc-g-lens)" />
            <g className="lnoc-polaris">
              <path d={starN(340, 340, 8, 20, 7)} fill={GOLD} />
              <circle cx="340" cy="340" r="5" fill="#f4e3ae" />
            </g>
            <text x="340" y="392" textAnchor="middle" fontSize="8" letterSpacing="3.5" fill={DIM}>
              THE SKY TONIGHT
            </text>
          </svg>
          {RING_POS.map((s) => (
            <a
              key={s.n}
              href={`/horoscope/${s.n.toLowerCase()}`}
              className="lnoc-zplate lnoc-zabs flex w-[112px] flex-col items-center px-2 py-3.5 text-center"
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
            >
              <span className="text-xl leading-none text-[#d9c084]">{s.g}</span>
              <span className="mt-2 text-[10px] uppercase tracking-[0.22em] text-[#dde5f2]/85">{s.n}</span>
              <span className="mt-1 text-[8.5px] uppercase tracking-[0.1em] text-[#dde5f2]/40">{s.d}</span>
            </a>
          ))}
        </div>

        {/* small screens: the same plates as a plain grid */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:hidden">
          {SIGNS.map((s) => (
            <a
              key={s.n}
              href={`/horoscope/${s.n.toLowerCase()}`}
              className="lnoc-zplate flex flex-col items-center px-3 py-5 text-center"
            >
              <span className="text-2xl leading-none text-[#d9c084]">{s.g}</span>
              <span className="mt-3 text-[11px] uppercase tracking-[0.24em] text-[#dde5f2]/85">{s.n}</span>
              <span className="mt-1.5 text-[9.5px] uppercase tracking-[0.14em] text-[#dde5f2]/40">{s.d}</span>
            </a>
          ))}
        </div>
      </section>

      {/* ==================== SIX DIALS ON ONE AXIS ==================== */}
      <section className="relative mx-auto max-w-6xl px-6 py-10 lg:py-16">
        <div className="lnoc-axis hidden lg:block" aria-hidden="true" />
        <p className="text-center text-[11px] uppercase tracking-[0.34em] text-[#7e8ea6]">The Instrument Panel</p>
        <h2 className="lnoc-serif mt-4 text-center text-3xl text-[#dde5f2] sm:text-4xl">Six dials on one axis</h2>
        <p className="mx-auto mt-4 max-w-md text-center text-[13.5px] leading-relaxed text-[#dde5f2]/50">
          Every instrument on this bench reads the same sky. Take your pick.
        </p>

        <div className="mt-14 space-y-8 lg:mt-20 lg:space-y-14">
          {PANELS.map((p, pi) => {
            const leftSide = pi % 2 === 0;
            return (
              <div key={p.title} className={`relative lg:flex ${leftSide ? "lg:justify-start" : "lg:justify-end"}`}>
                {/* node where the plate meets the axis + connector hairline */}
                <span className="lnoc-axis-node hidden lg:block" aria-hidden="true" />
                <span
                  className="pointer-events-none absolute top-1/2 hidden h-px lg:block"
                  style={{
                    [leftSide ? "left" : "right"]: "50%",
                    width: "6%",
                    background: "linear-gradient(90deg, rgba(126,142,166,.5), rgba(126,142,166,.15))",
                  }}
                  aria-hidden="true"
                />
                <article className="lnoc-panel relative w-full p-7 lg:w-[44%]">
                  <span className="lnoc-num" aria-hidden="true">{p.num}</span>
                  <div className={`flex flex-col items-center gap-6 sm:flex-row ${leftSide ? "" : "sm:flex-row-reverse"}`}>
                    <div className="lnoc-mech shrink-0">{p.mech}</div>
                    <div className={leftSide ? "" : "sm:text-right"}>
                      <div className={`flex items-baseline gap-3 ${leftSide ? "justify-between" : "justify-between sm:flex-row-reverse"}`}>
                        <h3 className="lnoc-serif text-xl text-[#dde5f2]">{p.title}</h3>
                        <span className="lnoc-tag shrink-0 px-2 py-[3px] text-[9px] uppercase">{p.tag}</span>
                      </div>
                      <p className="mt-3 text-[13.5px] leading-relaxed text-[#dde5f2]/60">{p.desc}</p>
                      <a href={p.href} className="lnoc-link mt-5 inline-block text-[11px] uppercase tracking-[0.26em]">
                        Explore&nbsp;&rarr;
                      </a>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================== DESTINY MATRIX ==================== */}
      <section className="relative mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="lnoc-panel relative mx-auto w-full max-w-[420px] p-6">
            <span className="lnoc-num" aria-hidden="true">VII</span>
            <DestinyOctagram />
            <p className="mt-2 text-center text-[9px] uppercase tracking-[0.34em] text-[#55647c]">
              night calculation · birth-date octagram
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#7e8ea6]">Night Calculation</p>
            <h2 className="lnoc-serif mt-4 text-3xl text-[#dde5f2] sm:text-4xl">The Destiny Matrix</h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#dde5f2]/60">
              An optional birth-date octagram tool. It maps purpose, love, money, and age themes from your birth date.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Purpose", "Love", "Money", "Age themes"].map((c) => (
                <span key={c} className="lnoc-chip px-2.5 py-1.5 text-[10px] uppercase">
                  {c}
                </span>
              ))}
            </div>
            <a href="/destiny-matrix" className="lnoc-btn-ghost mt-8 px-6 py-3 text-[12px] uppercase tracking-[0.2em]">
              Open Destiny Matrix&nbsp;&rarr;
            </a>
          </div>
        </div>
      </section>

      {/* ==================== FAQ — ENGRAVED SILVER PLATES ==================== */}
      <section className="mx-auto max-w-5xl px-6 py-16 lg:py-20">
        <p className="text-center text-[11px] uppercase tracking-[0.34em] text-[#7e8ea6]">Inquiries</p>
        <h2 className="lnoc-serif mt-4 text-center text-3xl text-[#dde5f2] sm:text-4xl">Asked after dark, answered in silver</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {FAQS.map((f) => (
            <article key={f.n} className="lnoc-panel relative p-7">
              <div className="flex items-center gap-4">
                <span className="lnoc-diamond">
                  <span className="lnoc-serif text-[12px] font-bold text-[#d9c084]">{f.n}</span>
                </span>
                <h3 className="lnoc-serif text-lg leading-snug text-[#dde5f2]">{f.q}</h3>
              </div>
              <div className="mt-4 flex items-center gap-3" aria-hidden="true">
                <span className="lnoc-rule flex-1" />
                <svg viewBox="0 0 14 14" className="h-2.5 w-2.5">
                  <path d="M 7 0 L 8.2 5.8 L 14 7 L 8.2 8.2 L 7 14 L 5.8 8.2 L 0 7 L 5.8 5.8 Z" fill={SILVER} />
                </svg>
                <span className="lnoc-rule flex-1" />
              </div>
              <p className="mt-4 text-[13.5px] leading-relaxed text-[#dde5f2]/60">{f.a}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ==================== CTA BAND ==================== */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center lg:py-28">
        <div className="flex items-center justify-center gap-4">
          <span className="lnoc-rule w-20 sm:w-28" />
          <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" aria-hidden="true">
            <path d="M 7 0 L 8.2 5.8 L 14 7 L 8.2 8.2 L 7 14 L 5.8 8.2 L 0 7 L 5.8 5.8 Z" fill={GOLD} />
          </svg>
          <span className="lnoc-rule w-20 sm:w-28" />
        </div>
        <h2 className="lnoc-serif mt-8 text-3xl leading-snug text-[#dde5f2] sm:text-4xl">
          Your chart is written in the stars.
          <br />
          Come read it.
        </h2>
        <a href="/sign-up" className="lnoc-btn-primary lnoc-serif mt-10 px-8 py-4 text-[13px] font-bold uppercase tracking-[0.18em]">
          Get started — it&rsquo;s free
        </a>
        <p className="mt-6 text-[10.5px] uppercase tracking-[0.24em] text-[#55647c]">
          No account needed&nbsp;&nbsp;·&nbsp;&nbsp;the sky keeps no ledger
        </p>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer>
        <div className="lnoc-rule" />
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="lnoc-serif text-[12px] tracking-[0.34em] text-[#c9d4e6]">ASTRO&nbsp;SCOPE</p>
              <p className="mt-2 text-[12px] text-[#dde5f2]/45">Astro Scope — your daily cosmic guidance.</p>
            </div>
            <nav className="flex flex-wrap gap-x-7 gap-y-2 text-[11px] uppercase tracking-[0.2em] text-[#dde5f2]/60">
              <a href="/birth-chart" className="lnoc-nav-link">Birth Chart</a>
              <a href="/horoscope" className="lnoc-nav-link">Horoscopes</a>
              <a href="/tarot" className="lnoc-nav-link">Tarot</a>
              <a href="/pricing" className="lnoc-nav-link">Pricing</a>
            </nav>
          </div>
          <p className="mt-8 text-[10px] uppercase tracking-[0.18em] text-[#dde5f2]/30">&copy; 2026 Astro Scope</p>
        </div>
      </footer>
    </div>
  );
}
