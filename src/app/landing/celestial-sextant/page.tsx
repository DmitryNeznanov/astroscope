// LANDING / CELESTIAL-SEXTANT — a design exploration of the production landing
// in the "Navigator's Obsession" language of src/components/cards/celestial-sextant.tsx:
// an engraved brass sextant on dark teal, its index arm sweeping to a reading,
// a bright sighted star burning above the arc. Sign band as a navigator's
// compass rose, instrument plates seated along a long engraved horizon rule,
// the Destiny Matrix sighted through crosshairs, FAQ as logbook entries.
// Fully self-contained: inline SVG, Tailwind for layout, one scoped <style>
// block (lsx- prefixed) for the rest. Server-component safe: no hooks, CSS
// animations only, statically prerendered.

import type { Metadata } from "next";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Astro Scope — Take your sight. Fix your position in the cosmos.",
  description:
    "Free birth chart, daily horoscopes, synastry and tarot — a navigator's instruments for reading the sky.",
};

const DEG = Math.PI / 180;

// the deck's brass-on-teal palette (from the celestial-sextant cards)
const TEAL_PLATE = "#0a2b33";
const BRASS = "#c39a3b";
const BRASS_HI = "#e8c66a";
const BRASS_DK = "#6d5316";
const IVORY = "#eadfc0";

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

// every glyph is written as a unicode escape with U+FE0E appended, so it can
// only render as monochrome text, never as an emoji
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

const GLYPH_FONT = "'DejaVu Sans', 'Segoe UI Symbol', Georgia, serif";
const SERIF_FONT = "Georgia, 'Times New Roman', serif";

/* ======================== COSMIC BACKGROUND DATA ======================== */

// fine starfield across a 1600×1000 field, deterministic so the prerender is stable
const FIELD_STARS = Array.from({ length: 130 }, (_, i) => ({
  x: +((i * 733.7 + 97) % 1600).toFixed(1),
  y: +((i * 449.3 + 53) % 1000).toFixed(1),
  r: +(0.4 + ((i * 11) % 10) / 16).toFixed(2),
  o: +(0.3 + ((i * 17) % 10) / 28).toFixed(2),
  g: i % 4, // twinkle group
  cool: i % 6 === 4, // a few blue-white stars among the warm ones
}));

// the giant hairline compass ring looming behind the viewport (1000×1000)
const MEGA_TICKS = ringTeeth(500, 500, 452, 470, 72);

/* ========================= HERO SEXTANT GEOMETRY ======================== */
// the same engraved instrument as the deck's cards: pivot near the top, the
// great arc (0–120° of scale across 96° of physical arc) swung below

const PIVOT_X = 150;
const PIVOT_Y = 96;
const R_OUT = 190;
const R_IN = 170;
const HALF_SWEEP = 48; // physical half-sweep; the scale doubles the angle

const pt = (r: number, scaleDeg: number) => {
  const a = (HALF_SWEEP - scaleDeg * 0.8) * DEG;
  return {
    x: +(PIVOT_X + r * Math.sin(a)).toFixed(1),
    y: +(PIVOT_Y + r * Math.cos(a)).toFixed(1),
  };
};

const MAJORS = Array.from({ length: 13 }, (_, i) => i * 10);
const MINORS = Array.from({ length: 61 }, (_, i) => i * 2).filter((s) => s % 10 !== 0);

// the fix this instrument settles on: 52.5° on the engraved scale
const READING = 52.5;
const SWEEP_FROM = -0.8 * READING; // the load sweep starts at the 0° end

const o1 = pt(R_OUT, 0);
const o2 = pt(R_OUT, 120);
const i1 = pt(R_IN, 0);
const i2 = pt(R_IN, 120);
const g1 = pt(180, 0);
const g2 = pt(180, 120);

const BAND_PATH = `M ${o1.x} ${o1.y} A ${R_OUT} ${R_OUT} 0 0 1 ${o2.x} ${o2.y} L ${i2.x} ${i2.y} A ${R_IN} ${R_IN} 0 0 0 ${i1.x} ${i1.y} Z`;
const GLEAM_PATH = `M ${g1.x} ${g1.y} A 180 180 0 0 1 ${g2.x} ${g2.y}`;

const ARM_TIP = pt(R_IN + 1, READING);
const ARM_INNER = pt(R_IN - 4, READING);
const TAIL_END = pt(-28, READING);
const TAIL_KNOB = pt(-30, READING);
const VERNIER = Array.from({ length: 13 }, (_, i) => READING - 7.5 + i * 1.25);

// engraved horizon rule below the instrument (viewBox 0 0 300 352)
const HORIZON_TICKS = Array.from({ length: 35 }, (_, i) => 16 + i * 8);

function HeroSextant() {
  return (
    <svg
      viewBox="0 0 300 352"
      className="h-auto w-full"
      role="img"
      aria-label="A grand brass sextant, its index arm sweeping to a reading beneath a bright sighted star, an engraved horizon and a small ship below"
    >
      {/* the engraved horizon: double rule, degree ticks, a distant ship */}
      <g className="lsx-fade" style={{ "--d": "1.25s" } as CSSProperties}>
        <ellipse cx="150" cy="292" rx="118" ry="5" fill="#000000" opacity="0.35" />
        <line x1="8" y1="306" x2="292" y2="306" stroke={BRASS_DK} strokeWidth="0.9" opacity="0.85" />
        <line x1="8" y1="309.5" x2="292" y2="309.5" stroke={BRASS_DK} strokeWidth="0.4" opacity="0.4" />
        {HORIZON_TICKS.map((x, k) => (
          <line
            key={x}
            x1={x}
            y1="306"
            x2={x}
            y2={k % 4 === 0 ? 313 : 310}
            stroke={BRASS_DK}
            strokeWidth={k % 4 === 0 ? 0.8 : 0.45}
            opacity="0.7"
          />
        ))}
        {[64, 148, 232].map((x, k) => (
          <text
            key={x}
            x={x}
            y="322"
            textAnchor="middle"
            fontFamily={SERIF_FONT}
            fontSize="5.5"
            letterSpacing="1"
            fill={IVORY}
            opacity="0.45"
          >
            {`0${k + 2}0`}
          </text>
        ))}
        {/* the sea: three thin swells breathing under the rule */}
        <g className="lsx-breathe" style={{ "--t": "18s" } as CSSProperties}>
          <path d="M 24 334 Q 60 330 96 334 T 168 334 T 240 334 T 312 334" fill="none" stroke={IVORY} strokeWidth="0.5" opacity="0.14" />
          <path d="M -12 341 Q 24 337 60 341 T 132 341 T 204 341 T 276 341" fill="none" stroke={IVORY} strokeWidth="0.5" opacity="0.09" />
        </g>
        {/* a distant ship, hull down on the horizon, gently bobbing */}
        <g className="lsx-bob" opacity="0.55">
          <path d="M 55 305 L 73 305 L 69.5 309 L 58.5 309 Z" fill="#08222a" stroke={IVORY} strokeWidth="0.7" strokeLinejoin="round" />
          <line x1="64" y1="305" x2="64" y2="295" stroke={IVORY} strokeWidth="0.7" />
          <path d="M 65 296 L 65 303 L 71 303 Z" fill="#08222a" stroke={IVORY} strokeWidth="0.6" strokeLinejoin="round" />
        </g>
      </g>

      {/* the sighted star + its sight line down to the index mirror */}
      <line x1="244" y1="52" x2="158" y2="100" stroke={IVORY} strokeWidth="0.6" strokeDasharray="2 4" opacity="0.25" />
      <g className="lsx-flash">
        <g className="lsx-twinkle" style={{ "--t": "17s" } as CSSProperties}>
          <circle cx="244" cy="46" r="24" fill="url(#lsx-g-starglow)" />
          <path
            d="M 244 26 L 247.5 42.5 L 264 46 L 247.5 49.5 L 244 66 L 240.5 49.5 L 224 46 L 240.5 42.5 Z"
            fill="#fff3cf"
            stroke={BRASS_HI}
            strokeWidth="0.5"
          />
          <circle cx="244" cy="46" r="2.2" fill="#ffffff" />
        </g>
      </g>
      {/* a smaller companion star, upper left */}
      <g className="lsx-fade" style={{ "--d": "1.6s" } as CSSProperties}>
        <g className="lsx-twinkle" style={{ "--t": "23s" } as CSSProperties}>
          <circle cx="54" cy="44" r="11" fill="url(#lsx-g-starglow)" opacity="0.7" />
          <path
            d="M 54 35 L 55.6 42.4 L 63 44 L 55.6 45.6 L 54 53 L 52.4 45.6 L 45 44 L 52.4 42.4 Z"
            fill="#fff3cf"
            opacity="0.9"
          />
        </g>
      </g>

      {/* sextant body */}
      <g className="lsx-fade" style={{ "--d": ".15s" } as CSSProperties}>
        {/* radial frame arms */}
        {[0, 60, 120].map((s) => {
          const e = pt(R_IN - 2, s);
          return (
            <g key={s}>
              <line x1={PIVOT_X} y1={PIVOT_Y} x2={e.x} y2={e.y} stroke={BRASS} strokeWidth="5" opacity="0.95" />
              <line x1={PIVOT_X} y1={PIVOT_Y} x2={e.x} y2={e.y} stroke="#2e230a" strokeWidth="1" opacity="0.55" />
            </g>
          );
        })}
        {/* the great arc: brass band + engraving hatch */}
        <path d={BAND_PATH} fill="url(#lsx-g-brass)" stroke="#2e230a" strokeWidth="1.1" />
        <path d={BAND_PATH} fill="url(#lsx-hatch)" opacity="0.5" />
        {[172.5, 187.5].map((r) => {
          const p1 = pt(r, 0);
          const p2 = pt(r, 120);
          return (
            <path
              key={r}
              d={`M ${p1.x} ${p1.y} A ${r} ${r} 0 0 1 ${p2.x} ${p2.y}`}
              fill="none"
              stroke="#2e230a"
              strokeWidth="0.6"
              opacity="0.6"
            />
          );
        })}
        {/* frame screws on the band */}
        {[0, 60, 120].map((s) => {
          const c = pt(180, s);
          return (
            <g key={s}>
              <circle cx={c.x} cy={c.y} r="2.5" fill={BRASS_HI} stroke="#2e230a" strokeWidth="0.7" />
              <line x1={c.x - 1.4} y1={c.y - 1.4} x2={c.x + 1.4} y2={c.y + 1.4} stroke="#2e230a" strokeWidth="0.6" />
            </g>
          );
        })}
        {/* telescope tube on its mount */}
        <line x1="114" y1="144" x2="110" y2="158" stroke={BRASS} strokeWidth="3" />
        <rect x="88" y="136" width="50" height="8.5" rx="2" fill="url(#lsx-g-brass)" stroke="#2e230a" strokeWidth="0.8" />
        <rect x="134" y="133.5" width="8" height="13.5" rx="1.5" fill="url(#lsx-g-brass)" stroke="#2e230a" strokeWidth="0.8" />
        <rect x="82" y="138" width="7" height="4.5" rx="1" fill={BRASS_DK} stroke="#2e230a" strokeWidth="0.7" />
        <line x1="96" y1="136" x2="96" y2="144.5" stroke="#2e230a" strokeWidth="0.6" opacity="0.6" />
        <line x1="126" y1="136" x2="126" y2="144.5" stroke="#2e230a" strokeWidth="0.6" opacity="0.6" />
        {/* shade discs on pivots below the mirror */}
        <g stroke="#2e230a" strokeWidth="0.7">
          <circle cx="124" cy="114" r="5.5" fill="#10302e" />
          <circle cx="113" cy="122" r="4.5" fill="#0d2624" />
          <circle cx="104" cy="129" r="3.8" fill="#0a1d1c" />
        </g>
        <g fill={BRASS_HI}>
          <circle cx="124" cy="114" r="1" />
          <circle cx="113" cy="122" r="0.9" />
          <circle cx="104" cy="129" r="0.8" />
        </g>
      </g>

      {/* engraved degree scale: ticks + numerals every 10° */}
      <g className="lsx-fade" style={{ "--d": ".5s" } as CSSProperties}>
        {MINORS.map((s) => {
          const a = pt(R_OUT - 1, s);
          const b = pt(R_OUT - 6.5, s);
          return <line key={s} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#2e230a" strokeWidth="0.55" />;
        })}
        {MAJORS.map((s) => {
          const a = pt(R_OUT - 1, s);
          const b = pt(R_OUT - 11, s);
          const n = pt(R_IN - 12, s);
          return (
            <g key={s}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#2e230a" strokeWidth="1" />
              <text
                x={n.x}
                y={n.y + 2.2}
                textAnchor="middle"
                fontFamily={SERIF_FONT}
                fontSize="7"
                fill={IVORY}
                opacity="0.92"
              >
                {s}
              </text>
            </g>
          );
        })}
      </g>

      {/* travelling gleam along the brass arc */}
      <path
        className="lsx-gleam"
        d={GLEAM_PATH}
        fill="none"
        stroke="#ffe9a8"
        strokeWidth="4"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray="7 93"
        opacity="0.45"
      />

      {/* index arm with vernier — sweeps to its reading on load */}
      <g className="lsx-arm" style={{ "--lsx-from": `${SWEEP_FROM}deg` } as CSSProperties}>
        {VERNIER.map((s, i) => {
          const a = pt(R_IN - 16, s);
          const b = pt(R_IN - (i % 4 === 0 ? 7 : 9.5), s);
          return <line key={s} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={BRASS_HI} strokeWidth="0.6" opacity="0.9" />;
        })}
        <line x1={PIVOT_X} y1={PIVOT_Y} x2={ARM_TIP.x} y2={ARM_TIP.y} stroke="url(#lsx-g-brass)" strokeWidth="6" strokeLinecap="round" />
        <line x1={PIVOT_X} y1={PIVOT_Y} x2={ARM_INNER.x} y2={ARM_INNER.y} stroke="#2e230a" strokeWidth="1" opacity="0.6" />
        {/* counterweight tail */}
        <line x1={PIVOT_X} y1={PIVOT_Y} x2={TAIL_END.x} y2={TAIL_END.y} stroke={BRASS} strokeWidth="3.5" strokeLinecap="round" />
        <circle cx={TAIL_KNOB.x} cy={TAIL_KNOB.y} r="3.5" fill="url(#lsx-g-hub)" stroke="#2e230a" strokeWidth="0.7" />
        {/* index mirror hub */}
        <circle cx={PIVOT_X} cy={PIVOT_Y} r="7.5" fill="url(#lsx-g-hub)" stroke="#2e230a" strokeWidth="1" />
        <circle cx={PIVOT_X} cy={PIVOT_Y} r="1.7" fill="#2e230a" />
      </g>
    </svg>
  );
}

/* ==================== SIGN BAND — NAVIGATOR'S COMPASS ROSE ============== */
// 680×680 rose: 12 plates orbit a fixed compass card. Major station ticks
// (every 30°, aligned with the plates) are static; the fine 5° tick ring and
// a dashed inner ring turn imperceptibly against them.

const ROSE_C = 340;
const ROSE_TICKS_FINE = ringTeeth(ROSE_C, ROSE_C, 288, 296, 72); // every 5°
const ROSE_TICKS_MAJOR = ringTeeth(ROSE_C, ROSE_C, 280, 296, 12); // every 30°
const ROSE_NUMERALS = [45, 135, 225, 315].map((a) => ({
  label: `${a}`.padStart(3, "0"),
  x: +(ROSE_C + 258 * Math.sin(a * DEG)).toFixed(1),
  y: +(ROSE_C - 258 * Math.cos(a * DEG)).toFixed(1),
}));
const CARDINALS = ["N", "E", "S", "W"].map((label, k) => ({
  label,
  x: +(ROSE_C + 322 * Math.sin(k * 90 * DEG)).toFixed(1),
  y: +(ROSE_C - 322 * Math.cos(k * 90 * DEG)).toFixed(1),
}));
const ORBIT_R = 232; // plate orbit radius, in px of the fixed 680px container

function CompassRose() {
  return (
    <div className="relative mx-auto hidden h-[680px] w-[680px] max-w-full lg:block">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 680 680" aria-hidden="true">
        {/* static card: rings, cardinal letters, sign-station ticks, spokes */}
        <circle cx={ROSE_C} cy={ROSE_C} r="298" fill="none" stroke={BRASS_DK} strokeWidth="0.9" opacity="0.85" />
        <circle cx={ROSE_C} cy={ROSE_C} r="292" fill="none" stroke={BRASS_DK} strokeWidth="0.4" opacity="0.5" />
        <circle cx={ROSE_C} cy={ROSE_C} r="204" fill="none" stroke={BRASS_DK} strokeWidth="0.5" strokeDasharray="1.5 4" opacity="0.3" />
        {ROSE_TICKS_MAJOR.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={BRASS} strokeWidth="1" opacity="0.75" />
        ))}
        {[0, 90].map((a) => (
          <line
            key={a}
            x1={ROSE_C - 296 * Math.sin(a * DEG)}
            y1={ROSE_C - 296 * Math.cos(a * DEG)}
            x2={ROSE_C + 296 * Math.sin(a * DEG)}
            y2={ROSE_C + 296 * Math.cos(a * DEG)}
            stroke={BRASS_DK}
            strokeWidth="0.6"
            opacity="0.5"
          />
        ))}
        {[45, 135].map((a) => (
          <line
            key={a}
            x1={ROSE_C - 296 * Math.sin(a * DEG)}
            y1={ROSE_C - 296 * Math.cos(a * DEG)}
            x2={ROSE_C + 296 * Math.sin(a * DEG)}
            y2={ROSE_C + 296 * Math.cos(a * DEG)}
            stroke={BRASS_DK}
            strokeWidth="0.4"
            opacity="0.25"
          />
        ))}
        {CARDINALS.map((c) => (
          <text
            key={c.label}
            x={c.x}
            y={c.y + 7}
            textAnchor="middle"
            fontFamily={SERIF_FONT}
            fontWeight="700"
            fontSize="22"
            fill={BRASS_HI}
          >
            {c.label}
          </text>
        ))}
        {ROSE_NUMERALS.map((n) => (
          <text
            key={n.label}
            x={n.x}
            y={n.y + 2.5}
            textAnchor="middle"
            fontFamily={SERIF_FONT}
            fontSize="9"
            letterSpacing="1.5"
            fill={IVORY}
            opacity="0.5"
          >
            {n.label}
          </text>
        ))}
        {/* the fine tick ring, turning once every six minutes */}
        <g className="lsx-cw" style={{ "--o": "340px 340px", "--t": "360s" } as CSSProperties}>
          <circle cx={ROSE_C} cy={ROSE_C} r="284" fill="none" stroke={BRASS_DK} strokeWidth="0.4" opacity="0.4" />
          {ROSE_TICKS_FINE.map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={BRASS_DK} strokeWidth={i % 6 === 0 ? 0.8 : 0.45} opacity="0.6" />
          ))}
        </g>
        {/* dashed counter-ring inside the orbit */}
        <g className="lsx-ccw" style={{ "--o": "340px 340px", "--t": "300s" } as CSSProperties}>
          <circle cx={ROSE_C} cy={ROSE_C} r="246" fill="none" stroke={BRASS_DK} strokeWidth="0.6" strokeDasharray="2 7" opacity="0.4" />
        </g>
        {/* the north-star medallion at the heart of the rose */}
        <circle className="lsx-breathe" style={{ "--t": "16s" } as CSSProperties} cx={ROSE_C} cy={ROSE_C} r="42" fill="url(#lsx-g-starglow)" />
        <path d={starN(ROSE_C, ROSE_C, 8, 30, 10)} fill="#08222a" stroke={BRASS_HI} strokeWidth="1.2" strokeLinejoin="round" />
        <circle cx={ROSE_C} cy={ROSE_C} r="4.5" fill="url(#lsx-g-hub)" stroke="#2e230a" strokeWidth="0.8" />
      </svg>
      {/* the twelve plates riding the orbit, upright, cardinals emphasized */}
      {SIGNS.map((s, i) => {
        const a = i * 30;
        const cardinal = i % 3 === 0;
        return (
          <a
            key={s.n}
            href={`/horoscope/${s.n.toLowerCase()}`}
            className={`lsx-plate group absolute left-1/2 top-1/2 flex w-[112px] flex-col items-center px-2 py-4 text-center ${
              cardinal ? "lsx-plate-cardinal" : ""
            }`}
            style={{ transform: `translate(-50%, -50%) rotate(${a}deg) translateY(-${ORBIT_R}px) rotate(${-a}deg)` }}
          >
            {cardinal && <span className="lsx-diamond mb-2" aria-hidden="true" />}
            <span className="text-[22px] leading-none text-[#e8c66a]">{s.g}</span>
            <span className="mt-2.5 text-[10px] uppercase tracking-[0.22em] text-[#eadfc0]/85">{s.n}</span>
            <span className="mt-1 text-[8.5px] uppercase tracking-[0.12em] text-[#eadfc0]/40">{s.d}</span>
          </a>
        );
      })}
    </div>
  );
}

/* ==================== INSTRUMENT PLATES — MINI INSTRUMENTS ============== */
// all are 120×120, all ambient motion is CSS (classes from the lsx- block)

// BIRTH CHART — an astrolabe: rete with star pointers turning over the plate
function InstAstrolabe() {
  const ticks = ringTeeth(60, 60, 48, 52, 24);
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="A small brass astrolabe, its rete turning slowly over the engraved plate">
      <circle cx="60" cy="60" r="52" fill="none" stroke="url(#lsx-g-brass)" strokeWidth="1.4" />
      <circle cx="60" cy="60" r="44" fill="none" stroke={BRASS_DK} strokeWidth="0.6" opacity="0.8" />
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={BRASS_DK} strokeWidth="0.5" opacity="0.8" />
      ))}
      {/* engraved plate: altitude arcs */}
      <path d="M 24 76 A 40 40 0 0 1 96 76" fill="none" stroke={BRASS_DK} strokeWidth="0.5" opacity="0.6" />
      <path d="M 30 88 A 34 34 0 0 1 90 88" fill="none" stroke={BRASS_DK} strokeWidth="0.5" opacity="0.45" />
      <line x1="60" y1="16" x2="60" y2="104" stroke={BRASS_DK} strokeWidth="0.4" opacity="0.4" />
      {/* the rete: three curved arms tipped with stars, turning over 110s */}
      <g className="lsx-cw" style={{ "--o": "60px 60px", "--t": "110s" } as CSSProperties}>
        {[20, 140, 260].map((a) => {
          const tipX = 60 + 36 * Math.sin(a * DEG);
          const tipY = 60 - 36 * Math.cos(a * DEG);
          const midX = 60 + 22 * Math.sin((a + 14) * DEG);
          const midY = 60 - 22 * Math.cos((a + 14) * DEG);
          return (
            <g key={a}>
              <path d={`M 60 60 Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${tipX.toFixed(1)} ${tipY.toFixed(1)}`} fill="none" stroke={BRASS} strokeWidth="1.2" />
              <path d={starN(+tipX.toFixed(1), +tipY.toFixed(1), 4, 4.6, 1.7)} fill={BRASS_HI} stroke="#2e230a" strokeWidth="0.4" />
            </g>
          );
        })}
        <circle cx="60" cy="60" r="26" fill="none" stroke={BRASS} strokeWidth="0.7" opacity="0.7" />
      </g>
      {/* the rule on the back, creeping counter-wise */}
      <g className="lsx-ccw" style={{ "--o": "60px 60px", "--t": "150s" } as CSSProperties}>
        <line x1="18" y1="60" x2="102" y2="60" stroke={BRASS_HI} strokeWidth="1" opacity="0.8" />
        <circle cx="18" cy="60" r="2" fill={BRASS_HI} />
        <circle cx="102" cy="60" r="2" fill={BRASS_HI} />
      </g>
      <circle cx="60" cy="60" r="3" fill="url(#lsx-g-hub)" stroke="#2e230a" strokeWidth="0.6" />
      {/* suspension ring */}
      <circle cx="60" cy="9" r="4" fill="none" stroke="url(#lsx-g-brass)" strokeWidth="1.2" />
      <line x1="60" y1="13" x2="60" y2="8" stroke="url(#lsx-g-brass)" strokeWidth="1.4" />
    </svg>
  );
}

// DAILY HOROSCOPE — a ship's chronometer: sun and moon hands, phasing disc
function InstChronometer() {
  const ticks = ringTeeth(60, 62, 40, 46, 12);
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="A brass ship's chronometer with a sun hand, a moon hand, and a cycling moon-phase disc">
      <defs>
        <clipPath id="lsx-moonclip">
          <circle cx="60" cy="62" r="9" />
        </clipPath>
      </defs>
      {/* gimbal ring */}
      <circle cx="60" cy="62" r="50" fill="none" stroke={BRASS_DK} strokeWidth="0.7" opacity="0.7" />
      <circle cx="60" cy="12" r="2.4" fill="none" stroke={BRASS} strokeWidth="1" />
      <circle cx="60" cy="112" r="2.4" fill="none" stroke={BRASS} strokeWidth="1" />
      <circle cx="60" cy="62" r="46" fill="none" stroke="url(#lsx-g-brass)" strokeWidth="1.4" />
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={i % 3 === 0 ? BRASS_HI : BRASS_DK} strokeWidth={i % 3 === 0 ? 0.9 : 0.45} opacity="0.9" />
      ))}
      {/* sun hand, clockwise over 70s */}
      <g className="lsx-cw" style={{ "--o": "60px 62px", "--t": "70s" } as CSSProperties}>
        <line x1="60" y1="62" x2="60" y2="28" stroke={BRASS_HI} strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="60" cy="27" r="3.2" fill="url(#lsx-g-hub)" stroke={BRASS_HI} strokeWidth="0.8" />
      </g>
      {/* moon hand, counter-clockwise over 110s */}
      <g className="lsx-ccw" style={{ "--o": "60px 62px", "--t": "110s" } as CSSProperties}>
        <line x1="60" y1="62" x2="60" y2="38" stroke={BRASS} strokeWidth="1.1" strokeLinecap="round" />
        <circle cx="60" cy="37" r="2.2" fill="#08222a" stroke={IVORY} strokeWidth="0.8" />
      </g>
      {/* moon-phase disc: a shadow sweeps a gilt disc, endlessly */}
      <circle cx="60" cy="62" r="9" fill="url(#lsx-g-hub)" />
      <g clipPath="url(#lsx-moonclip)">
        <circle className="lsx-phase" cx="60" cy="62" r="9" fill="#062028" opacity="0.92" />
      </g>
      <circle cx="60" cy="62" r="9" fill="none" stroke={BRASS_HI} strokeWidth="1" />
      <circle cx="60" cy="62" r="1.4" fill="#08222a" stroke={IVORY} strokeWidth="0.7" />
    </svg>
  );
}

// COMPATIBILITY — two sextants aligned on a single star
function InstAlignedSextants() {
  // two small arcs: left centred on (40,50) spanning 20°–80°, right mirrored
  const arcL = { c: 40, from: 20, to: 80 };
  const arcR = { c: 80, from: 100, to: 160 };
  const arcPath = (c: number, a0: number, a1: number) =>
    `M ${(c + 30 * Math.cos(a0 * DEG)).toFixed(1)} ${(50 + 30 * Math.sin(a0 * DEG)).toFixed(1)} A 30 30 0 0 1 ${(c + 30 * Math.cos(a1 * DEG)).toFixed(1)} ${(50 + 30 * Math.sin(a1 * DEG)).toFixed(1)}`;
  const arcTicks = (c: number, a0: number) =>
    Array.from({ length: 7 }, (_, i) => {
      const a = (a0 + i * 10) * DEG;
      return {
        x1: +(c + 26.5 * Math.cos(a)).toFixed(1),
        y1: +(50 + 26.5 * Math.sin(a)).toFixed(1),
        x2: +(c + 30.5 * Math.cos(a)).toFixed(1),
        y2: +(50 + 30.5 * Math.sin(a)).toFixed(1),
      };
    });
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="Two small brass sextants, their index arms aligned on one shared star">
      {/* the shared star both instruments are sighting */}
      <line x1="40" y1="50" x2="58" y2="20" stroke={IVORY} strokeWidth="0.5" strokeDasharray="1.5 3" opacity="0.3" />
      <line x1="80" y1="50" x2="62" y2="20" stroke={IVORY} strokeWidth="0.5" strokeDasharray="1.5 3" opacity="0.3" />
      <g className="lsx-twinkle" style={{ "--t": "13s" } as CSSProperties}>
        <circle cx="60" cy="14" r="10" fill="url(#lsx-g-starglow)" />
        <path d="M 60 6 L 61.6 12.4 L 68 14 L 61.6 15.6 L 60 22 L 58.4 15.6 L 52 14 L 58.4 12.4 Z" fill="#fff3cf" stroke={BRASS_HI} strokeWidth="0.4" />
      </g>
      {/* left sextant */}
      <path d={arcPath(arcL.c, arcL.from, arcL.to)} fill="none" stroke="url(#lsx-g-brass)" strokeWidth="5" />
      {arcTicks(arcL.c, arcL.from).map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#2e230a" strokeWidth="0.5" />
      ))}
      <line x1="40" y1="50" x2={40 + 28 * Math.cos(32 * DEG)} y2={50 + 28 * Math.sin(32 * DEG)} stroke={BRASS} strokeWidth="2" opacity="0.9" />
      <g className="lsx-swing" style={{ "--o": "40px 50px", "--t": "17s", "--a": "3deg" } as CSSProperties}>
        <line x1="40" y1="50" x2="56" y2="22" stroke="url(#lsx-g-brass)" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="40" cy="50" r="3.4" fill="url(#lsx-g-hub)" stroke="#2e230a" strokeWidth="0.6" />
      </g>
      {/* right sextant, mirrored */}
      <path d={arcPath(arcR.c, arcR.from, arcR.to)} fill="none" stroke="url(#lsx-g-brass)" strokeWidth="5" />
      {arcTicks(arcR.c, arcR.from).map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#2e230a" strokeWidth="0.5" />
      ))}
      <line x1="80" y1="50" x2={80 + 28 * Math.cos(148 * DEG)} y2={50 + 28 * Math.sin(148 * DEG)} stroke={BRASS} strokeWidth="2" opacity="0.9" />
      <g className="lsx-swing" style={{ "--o": "80px 50px", "--t": "21s", "--a": "-3deg" } as CSSProperties}>
        <line x1="80" y1="50" x2="64" y2="22" stroke="url(#lsx-g-brass)" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="80" cy="50" r="3.4" fill="url(#lsx-g-hub)" stroke="#2e230a" strokeWidth="0.6" />
      </g>
      {/* the two readings agree: a pulsing tie-line between the mirrors */}
      <line className="lsx-shimmer" style={{ "--t": "11s" } as CSSProperties} x1="43.5" y1="50" x2="76.5" y2="50" stroke={BRASS_HI} strokeWidth="0.7" strokeDasharray="2 3" />
      {/* shared stand */}
      <line x1="26" y1="92" x2="94" y2="92" stroke={BRASS_DK} strokeWidth="1" opacity="0.8" />
      <line x1="40" y1="80" x2="40" y2="92" stroke={BRASS_DK} strokeWidth="0.9" />
      <line x1="80" y1="80" x2="80" y2="92" stroke={BRASS_DK} strokeWidth="0.9" />
    </svg>
  );
}

// TAROT — a signal lamp, blinking its slow message across the dark
function InstSignalLamp() {
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="A brass signal lamp on its post, blinking a slow message">
      {/* post + base */}
      <line x1="60" y1="84" x2="60" y2="100" stroke={BRASS} strokeWidth="3" />
      <path d="M 48 104 L 72 104 L 68 99 L 52 99 Z" fill="url(#lsx-g-brass)" stroke="#2e230a" strokeWidth="0.7" strokeLinejoin="round" />
      {/* handle */}
      <path d="M 54 44 Q 60 36 66 44" fill="none" stroke={BRASS} strokeWidth="1.4" />
      {/* the light: glow + lens + rays blinking in a slow two-flash code */}
      <circle className="lsx-blink" cx="60" cy="62" r="20" fill="url(#lsx-g-lamp)" />
      <g className="lsx-blink" style={{ "--d": ".35s" } as CSSProperties}>
        <line x1="34" y1="62" x2="42" y2="62" stroke={BRASS_HI} strokeWidth="1" strokeLinecap="round" />
        <line x1="78" y1="62" x2="86" y2="62" stroke={BRASS_HI} strokeWidth="1" strokeLinecap="round" />
        <line x1="38" y1="48" x2="44" y2="53" stroke={BRASS_HI} strokeWidth="0.8" strokeLinecap="round" />
        <line x1="82" y1="48" x2="76" y2="53" stroke={BRASS_HI} strokeWidth="0.8" strokeLinecap="round" />
        <line x1="38" y1="76" x2="44" y2="71" stroke={BRASS_HI} strokeWidth="0.8" strokeLinecap="round" />
        <line x1="82" y1="76" x2="76" y2="71" stroke={BRASS_HI} strokeWidth="0.8" strokeLinecap="round" />
      </g>
      {/* lamp housing */}
      <rect x="47" y="44" width="26" height="38" rx="4" fill="#0d2e33" stroke="url(#lsx-g-brass)" strokeWidth="1.4" />
      <rect x="44" y="40" width="32" height="6" rx="2" fill="url(#lsx-g-brass)" stroke="#2e230a" strokeWidth="0.7" />
      <circle cx="60" cy="62" r="9.5" fill="#08222a" stroke={BRASS_HI} strokeWidth="1" />
      <circle className="lsx-blink" style={{ "--d": ".1s" } as CSSProperties} cx="60" cy="62" r="5.5" fill="#ffe9a8" />
      <circle cx="60" cy="62" r="2" fill="#fff6d8" />
      {/* shutter louvres */}
      <line x1="50" y1="50" x2="56" y2="50" stroke={BRASS_DK} strokeWidth="0.8" />
      <line x1="64" y1="50" x2="70" y2="50" stroke={BRASS_DK} strokeWidth="0.8" />
      <line x1="50" y1="76" x2="56" y2="76" stroke={BRASS_DK} strokeWidth="0.8" />
      <line x1="64" y1="76" x2="70" y2="76" stroke={BRASS_DK} strokeWidth="0.8" />
    </svg>
  );
}

// PSYCHOLOGY — an inclinometer: the needle of the inner sea, never quite still
function InstInclinometer() {
  const ticks = Array.from({ length: 13 }, (_, i) => {
    const a = (180 + i * 15) * DEG;
    return {
      x1: +(60 + 35 * Math.cos(a)).toFixed(1),
      y1: +(78 + 35 * Math.sin(a)).toFixed(1),
      x2: +(60 + 40 * Math.cos(a)).toFixed(1),
      y2: +(78 + 40 * Math.sin(a)).toFixed(1),
      major: i % 3 === 0,
    };
  });
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="A brass inclinometer, its needle swaying gently over the engraved scale">
      {/* the half-scale band */}
      <path d="M 18 78 A 42 42 0 0 1 102 78" fill="none" stroke="url(#lsx-g-brass)" strokeWidth="6" />
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#2e230a" strokeWidth={t.major ? 0.9 : 0.5} />
      ))}
      {/* housing */}
      <line x1="14" y1="78" x2="106" y2="78" stroke={BRASS} strokeWidth="1.6" />
      <line x1="20" y1="84" x2="100" y2="84" stroke={BRASS_DK} strokeWidth="0.7" opacity="0.8" />
      <circle cx="18" cy="78" r="1.6" fill={BRASS_HI} />
      <circle cx="102" cy="78" r="1.6" fill={BRASS_HI} />
      {/* the needle, swaying ±7° over 14s, weighted at the tip */}
      <g className="lsx-swing" style={{ "--o": "60px 78px", "--t": "14s", "--a": "7deg" } as CSSProperties}>
        <line x1="60" y1="78" x2="60" y2="40" stroke="url(#lsx-g-brass)" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="60" y1="78" x2="60" y2="86" stroke={BRASS} strokeWidth="2" strokeLinecap="round" />
        <circle cx="60" cy="38" r="3.2" fill="url(#lsx-g-hub)" stroke="#2e230a" strokeWidth="0.6" />
        <circle cx="60" cy="78" r="3.6" fill="url(#lsx-g-hub)" stroke="#2e230a" strokeWidth="0.7" />
        <circle cx="60" cy="78" r="1" fill="#2e230a" />
      </g>
      {/* the inner sea, engraved beneath */}
      <path d="M 34 96 Q 44 93 54 96 T 74 96 T 94 96" fill="none" stroke={IVORY} strokeWidth="0.5" opacity="0.25" />
    </svg>
  );
}

// COSMIC PASSPORT — the ship's papers: a sealed plaque in the logbook chest
function InstLogbook() {
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="An engraved brass-bound logbook plate with a slowly turning seal">
      <defs>
        <path id="lsx-seal-circ" d="M 40 52 A 20 20 0 1 1 80 52 A 20 20 0 1 1 40 52" fill="none" />
      </defs>
      <rect x="18" y="20" width="84" height="80" rx="3" fill="#08222a" stroke="url(#lsx-g-brass)" strokeWidth="1.3" />
      <rect x="22" y="24" width="76" height="72" rx="2" fill="none" stroke={BRASS_DK} strokeWidth="0.5" opacity="0.8" />
      {[27, 93].map((x) =>
        [29, 91].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.1" fill={BRASS_HI} opacity="0.85" />)
      )}
      {/* seal: fixed rim + ticks, inscription ring turning over 55s */}
      <circle cx="60" cy="52" r="24.5" fill="none" stroke={BRASS_DK} strokeWidth="0.6" />
      {ringTeeth(60, 52, 23, 24.5, 24).map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={BRASS_DK} strokeWidth="0.5" />
      ))}
      <g className="lsx-cw" style={{ "--o": "60px 52px", "--t": "55s" } as CSSProperties}>
        <text fontFamily={SERIF_FONT} fontSize="6" letterSpacing="1.1" fill={BRASS_HI}>
          <textPath href="#lsx-seal-circ">ASTRO SCOPE · NAVIGATOR · ONE SKY ·</textPath>
        </text>
      </g>
      <path d={starN(60, 52, 8, 8, 3.2)} fill="#08222a" stroke={IVORY} strokeWidth="0.9" strokeLinejoin="round" />
      <circle cx="60" cy="52" r="1.2" fill={IVORY} />
      {/* engraved entries below the seal */}
      <line x1="38" y1="82" x2="82" y2="82" stroke={BRASS_DK} strokeWidth="0.6" />
      <line x1="45" y1="86" x2="75" y2="86" stroke={BRASS_DK} strokeWidth="0.45" />
      <line x1="50" y1="90" x2="70" y2="90" stroke={BRASS_DK} strokeWidth="0.35" opacity="0.7" />
    </svg>
  );
}

/* ================== DESTINY MATRIX — SIGHTED OCTAGRAM =================== */

const OCT_C = 160;
const OCT_R = 104;
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
const OCT_RING_TICKS = ringTeeth(OCT_C, OCT_C, 142, 150, 36);
// reticle ticks marching along the crosshair axes, skipping the heart
const CROSS_TICKS = Array.from({ length: 11 }, (_, i) => 20 + i * 26).filter((v) => Math.abs(v - OCT_C) > 24);

function DestinyCrosshair() {
  return (
    <svg
      viewBox="0 0 320 320"
      className="h-auto w-full"
      role="img"
      aria-label="The Destiny Matrix octagram sighted through the crosshairs of a navigational reticle"
    >
      {/* reticle ring, turning imperceptibly */}
      <g className="lsx-cw" style={{ "--o": "160px 160px", "--t": "140s" } as CSSProperties}>
        <circle cx="160" cy="160" r="146" fill="none" stroke={BRASS_DK} strokeWidth="0.6" opacity="0.7" />
        {OCT_RING_TICKS.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={BRASS_DK} strokeWidth={i % 9 === 0 ? 1 : 0.45} opacity="0.7" />
        ))}
      </g>
      {/* crosshairs */}
      <line x1="10" y1="160" x2="310" y2="160" stroke={BRASS_DK} strokeWidth="0.6" opacity="0.7" />
      <line x1="160" y1="10" x2="160" y2="310" stroke={BRASS_DK} strokeWidth="0.6" opacity="0.7" />
      {CROSS_TICKS.map((v) => (
        <g key={v}>
          <line x1={v} y1="157" x2={v} y2="163" stroke={BRASS_DK} strokeWidth="0.5" opacity="0.6" />
          <line x1="157" y1={v} x2="163" y2={v} stroke={BRASS_DK} strokeWidth="0.5" opacity="0.6" />
        </g>
      ))}
      {/* a gleam travelling the horizontal hair */}
      <line
        className="lsx-gleam"
        x1="10"
        y1="160"
        x2="310"
        y2="160"
        stroke="#ffe9a8"
        strokeWidth="1.6"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray="6 94"
        opacity="0.4"
      />
      {/* spokes from the heart to each vertex */}
      {OCT_PTS.map((p, i) => (
        <line key={i} x1="160" y1="160" x2={p.x} y2={p.y} stroke={BRASS_DK} strokeWidth="0.5" opacity="0.7" />
      ))}
      {/* the octagram: two overlaid squares, held in the sight */}
      <polygon points={OCT_SQUARE_A.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={BRASS} strokeWidth="1" />
      <polygon points={OCT_SQUARE_B.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={BRASS} strokeWidth="1" opacity="0.85" />
      {/* the fix at the heart of the reticle */}
      <circle className="lsx-breathe" style={{ "--t": "12s" } as CSSProperties} cx="160" cy="160" r="20" fill="url(#lsx-g-lamp)" />
      <circle cx="160" cy="160" r="7" fill="none" stroke={BRASS_HI} strokeWidth="0.8" opacity="0.9" />
      <circle cx="160" cy="160" r="4.5" fill="url(#lsx-g-hub)" stroke={BRASS_HI} strokeWidth="0.9" />
      {/* vertex seals with arcana numbers, lighting up in sequence */}
      {OCT_PTS.map((p, i) => {
        const t = (i * 45 - 90) * DEG;
        const lx = 160 + (OCT_R + 22) * Math.cos(t);
        const ly = 160 + (OCT_R + 22) * Math.sin(t);
        return (
          <g key={i} className="lsx-node" style={{ "--d": `${i * 1.15}s` } as CSSProperties}>
            <circle cx={p.x} cy={p.y} r="9" fill="#08222a" stroke="url(#lsx-g-brass)" strokeWidth="1.2" />
            <text x={p.x} y={p.y + 2.6} textAnchor="middle" fontFamily={SERIF_FONT} fontWeight="700" fontSize="8" fill={BRASS_HI}>
              {OCT_NODES[i].n}
            </text>
            <text x={lx.toFixed(1)} y={(ly + 2.5).toFixed(1)} textAnchor="middle" fontSize="7.5" letterSpacing="1.5" fill={IVORY} opacity="0.9">
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
    a: "Every sign from the homepage grid, or open the Horoscopes hub — all twelve signs, every day.",
  },
  {
    n: "IV",
    q: "What is the Destiny Matrix?",
    a: "An optional birth-date octagram mapping purpose, love, money and age themes — a numerological companion to the natal chart.",
  },
];

/* ============================== PAGE DATA ============================== */

const PANELS = [
  {
    tag: "FREE",
    title: "Birth Chart",
    desc: "Map your Sun, Moon, and Rising — the foundation of every reading.",
    href: "/birth-chart",
    mech: <InstAstrolabe />,
    depth: "xl:-translate-y-8",
    mechScale: 1.12,
    featured: true,
  },
  {
    tag: "DAILY",
    title: "Daily Horoscope",
    desc: "Twelve signs, one sky. Clear forecasts without the fluff.",
    href: "/horoscope",
    mech: <InstChronometer />,
    depth: "xl:-translate-y-2",
    mechScale: 1.0,
    featured: false,
  },
  {
    tag: "SYNASTRY",
    title: "Compatibility",
    desc: "Zodiac match, Chinese pairs, and deep synastry for two charts.",
    href: "/compatibility",
    mech: <InstAlignedSextants />,
    depth: "xl:-translate-y-12",
    mechScale: 1.05,
    featured: false,
  },
  {
    tag: "SPREADS",
    title: "Tarot",
    desc: "Daily card to Celtic Cross — pull, reflect, get a full reading.",
    href: "/tarot",
    mech: <InstSignalLamp />,
    depth: "xl:translate-y-10",
    mechScale: 1.0,
    featured: false,
  },
  {
    tag: "TESTS",
    title: "Psychology",
    desc: "MBTI, Big Five, empathy and more — meet yourself beyond the signs.",
    href: "/psychology",
    mech: <InstInclinometer />,
    depth: "xl:translate-y-3",
    mechScale: 1.0,
    featured: false,
  },
  {
    tag: "YOU",
    title: "Cosmic Passport",
    desc: "Your Cosmic ID, people, journal, and Premium deep dives — one hub.",
    href: "/passport",
    mech: <InstLogbook />,
    depth: "xl:translate-y-6",
    mechScale: 1.05,
    featured: false,
  },
];

const RIVET_POS = ["left-2 top-2", "right-2 top-2", "left-2 bottom-2", "right-2 bottom-2"];

// horizon-rule ticks for the instrument rail (viewBox 0 0 1200 60)
const RAIL_TICKS = Array.from({ length: 50 }, (_, i) => 12 + i * 24);

export default function CelestialSextantLanding() {
  return (
    <div className="lsx-root relative isolate min-h-screen">
      <style>{`
        .lsx-root { background: #06202a; color: #eadfc0; font-family: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif; }
        .lsx-root ::selection { background: rgba(195,154,59,.3); color: #fff3cf; }
        .lsx-serif { font-family: Georgia, 'Times New Roman', serif; }
        .lsx-rule { height: 1px; background: linear-gradient(90deg, transparent, rgba(195,154,59,.55), transparent); }

        /* buttons */
        .lsx-btn-primary { display: inline-block; background: linear-gradient(180deg, #f0d17e 0%, #d3a94a 48%, #a87f24 100%); color: #241a06; border: 1px solid #6d5316; box-shadow: inset 0 1px 0 rgba(255,246,216,.75), inset 0 -1px 0 rgba(70,52,16,.65), 0 12px 28px -14px rgba(195,154,59,.45); transition: filter .35s ease, box-shadow .35s ease; }
        .lsx-btn-primary:hover { filter: brightness(1.07); box-shadow: inset 0 1px 0 rgba(255,246,216,.75), inset 0 -1px 0 rgba(70,52,16,.65), 0 16px 34px -12px rgba(195,154,59,.6); }
        .lsx-btn-ghost { display: inline-block; border: 1px solid rgba(195,154,59,.45); color: #e8c66a; transition: border-color .35s ease, background .35s ease; }
        .lsx-btn-ghost:hover { border-color: rgba(232,198,106,.85); background: rgba(195,154,59,.07); }

        /* instrument plates along the horizon rail */
        .lsx-panel { background: #0a2b33; border: 1px solid rgba(195,154,59,.38); box-shadow: inset 0 0 0 3px #0a2b33, inset 0 0 0 4px rgba(195,154,59,.26), 0 18px 40px -22px rgba(0,0,0,.8); transition: transform .5s cubic-bezier(.22,.7,.3,1), border-color .5s ease, box-shadow .5s ease; }
        .lsx-panel:hover { transform: translateY(-4px); border-color: rgba(232,198,106,.6); box-shadow: 0 22px 46px -20px rgba(0,0,0,.85), 0 0 34px -8px rgba(195,154,59,.18), inset 0 0 0 3px #0a2b33, inset 0 0 0 4px rgba(232,198,106,.35); }
        .lsx-mech { transition: filter .5s ease; }
        .lsx-panel:hover .lsx-mech { filter: drop-shadow(0 0 12px rgba(232,198,106,.3)); }
        .lsx-rivet { position: absolute; width: 7px; height: 7px; border-radius: 9999px; border: 1px solid rgba(232,198,106,.5); background: radial-gradient(circle at 35% 30%, #f0d17e 0%, #a07c2e 48%, #3a2c0e 100%); }
        .lsx-tag { display: inline-block; border: 1px solid rgba(195,154,59,.55); color: #e8c66a; background: rgba(195,154,59,.06); box-shadow: inset 0 1px 2px rgba(0,0,0,.6); letter-spacing: .28em; }
        .lsx-link { color: #e8c66a; transition: color .3s ease; }
        .lsx-panel:hover .lsx-link { color: #fff3cf; }
        .lsx-chip { display: inline-flex; align-items: center; gap: .5em; border: 1px solid rgba(195,154,59,.5); background: rgba(195,154,59,.06); color: #e8c66a; box-shadow: inset 0 1px 2px rgba(0,0,0,.6); letter-spacing: .12em; }
        .lsx-field { border: 1px solid rgba(195,154,59,.4); background: #062028; box-shadow: inset 0 2px 6px rgba(0,0,0,.7); }

        /* compass-rose plates */
        .lsx-plate { background: linear-gradient(180deg, #0c3038 0%, #082430 100%); border: 1px solid rgba(195,154,59,.4); box-shadow: inset 0 0 0 2px #082430, inset 0 0 0 3px rgba(195,154,59,.2), 0 10px 24px -12px rgba(0,0,0,.8); transition: border-color .4s ease, box-shadow .4s ease, filter .4s ease; }
        .lsx-plate:hover { border-color: rgba(232,198,106,.75); box-shadow: 0 0 26px -6px rgba(195,154,59,.35), inset 0 0 0 2px #082430, inset 0 0 0 3px rgba(232,198,106,.35); }
        .lsx-plate-cardinal { border-color: rgba(232,198,106,.6); }
        .lsx-diamond { width: 5px; height: 5px; transform: rotate(45deg); background: #e8c66a; box-shadow: 0 0 6px rgba(232,198,106,.7); }

        .lsx-nav-link { transition: color .3s ease; }
        .lsx-nav-link:hover { color: #e8c66a; }

        /* load: text rises, the instrument fades in, the arm sweeps, the star flashes */
        .lsx-rise { animation: lsx-rise .9s cubic-bezier(.22,.7,.3,1) backwards; animation-delay: var(--d, 0s); }
        .lsx-fade { animation: lsx-fade-in 1s ease-out backwards; animation-delay: var(--d, 0s); }
        .lsx-flash { transform-box: fill-box; transform-origin: center; animation: lsx-flash 1.1s ease-out 1.5s backwards; }
        .lsx-arm { transform-box: view-box; transform-origin: 150px 96px; animation: lsx-sweep 1.4s cubic-bezier(.23,.9,.3,1) .6s backwards; }

        /* ambient motion — all slow, all restrained */
        .lsx-cw  { transform-box: view-box; transform-origin: var(--o, 60px 60px); animation: lsx-spin var(--t, 60s) linear infinite; }
        .lsx-ccw { transform-box: view-box; transform-origin: var(--o, 60px 60px); animation: lsx-spin-rev var(--t, 60s) linear infinite; }
        .lsx-breathe { animation: lsx-breathe var(--t, 16s) ease-in-out infinite; }
        .lsx-twinkle { transform-box: fill-box; transform-origin: center; animation: lsx-twinkle var(--t, 16s) ease-in-out infinite alternate; }
        .lsx-gleam { animation: lsx-gleam-of 26s linear infinite; }
        .lsx-swing { transform-box: view-box; transform-origin: var(--o, 60px 60px); animation: lsx-sway var(--t, 14s) ease-in-out infinite alternate; }
        .lsx-blink { animation: lsx-blink 10s linear infinite; animation-delay: var(--d, 0s); }
        .lsx-phase { transform-box: view-box; animation: lsx-phase 32s ease-in-out infinite alternate; }
        .lsx-shimmer { animation: lsx-shimmer var(--t, 10s) ease-in-out infinite; animation-delay: var(--d, 0s); }
        .lsx-node { animation: lsx-nodepulse 9.2s ease-in-out infinite; animation-delay: var(--d, 0s); }
        .lsx-bob { animation: lsx-bob 9s ease-in-out infinite alternate; }

        @keyframes lsx-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes lsx-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lsx-flash { 0% { opacity: 0; transform: scale(.6); } 45% { opacity: 1; transform: scale(1.25); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes lsx-sweep { from { opacity: .35; transform: rotate(var(--lsx-from, -42deg)); } to { opacity: 1; transform: rotate(0deg); } }
        @keyframes lsx-spin { to { transform: rotate(360deg); } }
        @keyframes lsx-spin-rev { to { transform: rotate(-360deg); } }
        @keyframes lsx-breathe { 0%, 100% { opacity: .65; } 50% { opacity: 1; } }
        @keyframes lsx-twinkle { from { opacity: .7; transform: scale(.95); } to { opacity: 1; transform: scale(1.06); } }
        @keyframes lsx-gleam-of { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -100; } }
        @keyframes lsx-sway { from { transform: rotate(calc(var(--a, 5deg) * -1)); } to { transform: rotate(var(--a, 5deg)); } }
        @keyframes lsx-blink { 0% { opacity: .15; } 6%, 12% { opacity: 1; } 18% { opacity: .15; } 25%, 31% { opacity: .9; } 38%, 100% { opacity: .15; } }
        @keyframes lsx-phase { from { transform: translateX(-15px); } to { transform: translateX(15px); } }
        @keyframes lsx-shimmer { 0%, 100% { opacity: .3; } 50% { opacity: .95; } }
        @keyframes lsx-nodepulse { 0%, 100% { opacity: .5; } 8% { opacity: 1; } 22% { opacity: .5; } }
        @keyframes lsx-bob { from { transform: translateY(0); } to { transform: translateY(-1.4px); } }

        /* ---------- cosmic background ---------- */
        .lsx-bg { position: fixed; inset: 0; z-index: -1; overflow: hidden; pointer-events: none; background: radial-gradient(130% 80% at 50% -10%, #0a2f3a 0%, #06202a 55%, #04151c 100%); }
        .lsx-neb { position: absolute; border-radius: 50%; filter: blur(38px); animation: lsx-drift var(--t, 90s) ease-in-out infinite alternate; }
        .lsx-tw1 { animation: lsx-twinkle-bg 8s ease-in-out infinite; }
        .lsx-tw2 { animation: lsx-twinkle-bg 12s ease-in-out infinite 2.4s; }
        .lsx-tw3 { animation: lsx-twinkle-bg 15s ease-in-out infinite 4.3s; }
        .lsx-tw4 { animation: lsx-twinkle-bg 10s ease-in-out infinite 1.4s; }
        .lsx-mega { position: absolute; }
        @keyframes lsx-twinkle-bg { 0%, 100% { opacity: .12; } 50% { opacity: .75; } }
        @keyframes lsx-drift { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(2.5%, -2%, 0); } }

        @media (prefers-reduced-motion: reduce) {
          .lsx-rise, .lsx-fade, .lsx-flash, .lsx-arm, .lsx-cw, .lsx-ccw,
          .lsx-breathe, .lsx-twinkle, .lsx-gleam, .lsx-swing, .lsx-blink,
          .lsx-phase, .lsx-shimmer, .lsx-node, .lsx-bob, .lsx-neb,
          .lsx-tw1, .lsx-tw2, .lsx-tw3, .lsx-tw4 {
            animation: none;
          }
        }
      `}</style>

      {/* cosmic background: fixed behind all content — deep teal water-sky,
          a twinkling starfield, and a giant hairline compass ring */}
      <div className="lsx-bg" aria-hidden="true">
        <div
          className="lsx-neb"
          style={{ width: "55vmax", height: "55vmax", left: "-12vmax", top: "-14vmax", background: "radial-gradient(circle, rgba(38,104,120,.2) 0%, transparent 65%)", "--t": "95s" } as CSSProperties}
        />
        <div
          className="lsx-neb"
          style={{ width: "48vmax", height: "48vmax", right: "-10vmax", top: "26%", background: "radial-gradient(circle, rgba(30,86,108,.16) 0%, transparent 65%)", "--t": "112s" } as CSSProperties}
        />
        <div
          className="lsx-neb"
          style={{ width: "60vmax", height: "60vmax", left: "24%", bottom: "-28vmax", background: "radial-gradient(circle, rgba(22,64,84,.2) 0%, transparent 65%)", "--t": "84s" } as CSSProperties}
        />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
          {FIELD_STARS.map((s, i) => (
            <circle key={i} className={`lsx-tw${s.g + 1}`} cx={s.x} cy={s.y} r={s.r} fill={s.cool ? "#cfe4ea" : "#f6ecd0"} opacity={s.o} />
          ))}
        </svg>
        <svg className="lsx-mega" style={{ width: "150vmin", height: "150vmin", left: "56%", top: "-44vmin" } as CSSProperties} viewBox="0 0 1000 1000">
          <circle cx="500" cy="500" r="497" fill="none" stroke="rgba(195,154,59,.1)" strokeWidth="1" />
          <g className="lsx-cw" style={{ "--o": "500px 500px", "--t": "320s" } as CSSProperties}>
            <circle cx="500" cy="500" r="470" fill="none" stroke="rgba(195,154,59,.15)" strokeWidth="1" />
            <circle cx="500" cy="500" r="382" fill="none" stroke="rgba(195,154,59,.1)" strokeWidth="0.7" strokeDasharray="2 6" />
            {MEGA_TICKS.map((t, i) => (
              <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="rgba(195,154,59,.15)" strokeWidth={i % 6 === 0 ? 1 : 0.5} />
            ))}
          </g>
        </svg>
      </div>

      {/* shared defs: objectBoundingBox gradients are reusable across every SVG on the page */}
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="lsx-g-brass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e2bd5e" />
            <stop offset="45%" stopColor="#b98f2e" />
            <stop offset="100%" stopColor="#7d601a" />
          </linearGradient>
          <radialGradient id="lsx-g-hub" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#f0d17e" />
            <stop offset="60%" stopColor="#b98f2e" />
            <stop offset="100%" stopColor="#6d5316" />
          </radialGradient>
          <radialGradient id="lsx-g-starglow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff3cf" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#e8c66a" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#e8c66a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="lsx-g-lamp" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe9a8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#e8c66a" stopOpacity="0" />
          </radialGradient>
          {/* engraving crosshatch for brass bands */}
          <pattern id="lsx-hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="4" stroke="#2e230a" strokeWidth="0.55" opacity="0.4" />
          </pattern>
        </defs>
      </svg>

      {/* ==================== TOP NAV ==================== */}
      <header>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="flex items-center gap-2.5">
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
              <path d="M 4.5 19.5 A 15 15 0 0 1 19.5 4.5" fill="none" stroke={BRASS_HI} strokeWidth="1.4" />
              {[30, 55, 80].map((a) => (
                <line
                  key={a}
                  x1={18 + 13 * Math.cos((180 + a) * DEG)}
                  y1={6 + 13 * Math.sin((180 + a) * DEG)}
                  x2={18 + 15.5 * Math.cos((180 + a) * DEG)}
                  y2={6 + 15.5 * Math.sin((180 + a) * DEG)}
                  stroke={BRASS_HI}
                  strokeWidth="0.9"
                />
              ))}
              <line x1="18" y1="6" x2="9" y2="15" stroke={BRASS_HI} strokeWidth="1.3" strokeLinecap="round" />
              <circle cx="18" cy="6" r="1.4" fill={BRASS_HI} />
              <path d="M 5.5 2 L 6.2 4.3 L 8.5 5 L 6.2 5.7 L 5.5 8 L 4.8 5.7 L 2.5 5 L 4.8 4.3 Z" fill="#fff3cf" />
            </svg>
            <span className="lsx-serif text-[13px] tracking-[0.38em] text-[#e8c66a]">ASTRO&nbsp;SCOPE</span>
          </a>
          <nav className="flex items-center gap-7 text-[11px] uppercase tracking-[0.22em] text-[#eadfc0]/65">
            <a href="/horoscope" className="lsx-nav-link hidden sm:inline">Horoscopes</a>
            <a href="/tarot" className="lsx-nav-link hidden sm:inline">Tarot</a>
            <a href="/compatibility" className="lsx-nav-link hidden md:inline">Compatibility</a>
            <a href="/sign-in" className="lsx-nav-link border border-[#6d5316]/60 px-3.5 py-1.5 text-[#e8c66a] hover:border-[#e8c66a]/70">Sign&nbsp;In</a>
          </nav>
        </div>
        <div className="lsx-rule" />
      </header>

      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden">
        {/* cool moonlight wash behind the headline */}
        <div
          className="lsx-breathe pointer-events-none absolute -left-24 top-4 h-[430px] w-[560px] rounded-full blur-2xl"
          style={{ "--t": "22s", background: "radial-gradient(closest-side, rgba(64,138,156,.14), transparent 70%)" } as CSSProperties}
          aria-hidden="true"
        />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <p className="lsx-rise text-[11px] uppercase tracking-[0.34em] text-[#c39a3b]" style={{ "--d": ".1s" } as CSSProperties}>
              Birth Charts&nbsp;&nbsp;·&nbsp;&nbsp;Horoscopes&nbsp;&nbsp;·&nbsp;&nbsp;Tarot
            </p>
            <h1 className="lsx-rise lsx-serif mt-6 text-5xl leading-[1.1] text-[#eadfc0] sm:text-6xl" style={{ "--d": ".25s" } as CSSProperties}>
              Take your sight.
              <br />
              Fix your position
              <br />
              <em className="text-[#e8c66a]">in the cosmos.</em>
            </h1>
            <p className="lsx-rise mt-6 max-w-md text-[15px] leading-relaxed text-[#eadfc0]/60" style={{ "--d": ".45s" } as CSSProperties}>
              Free birth chart, daily horoscopes, synastry and tarot — your position, read from the stars.
            </p>
            <div className="lsx-rise mt-9 flex flex-wrap items-center gap-4" style={{ "--d": ".6s" } as CSSProperties}>
              <a href="/birth-chart" className="lsx-btn-primary lsx-serif px-7 py-3.5 text-[13px] font-bold uppercase tracking-[0.18em]">
                Cast your free birth chart
              </a>
              <a href="/horoscope" className="lsx-btn-ghost px-6 py-3.5 text-[12px] uppercase tracking-[0.2em]">
                Read today&rsquo;s horoscope&nbsp;&rarr;
              </a>
            </div>
            <p className="lsx-rise mt-7 text-[10.5px] uppercase tracking-[0.24em] text-[#eadfc0]/35" style={{ "--d": ".75s" } as CSSProperties}>
              No account&nbsp;&nbsp;·&nbsp;&nbsp;no glass between you and the sky
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-[480px]">
            {/* faint constellation sight-lines woven behind the instrument */}
            <svg className="pointer-events-none absolute -inset-10 h-[calc(100%+5rem)] w-[calc(100%+5rem)]" viewBox="0 0 600 600" aria-hidden="true">
              <g>
                <polyline points="66,190 128,146 204,182 264,136" fill="none" stroke="rgba(207,228,234,.22)" strokeWidth="0.7" />
                {[[66, 190, 1.3], [128, 146, 1.9], [204, 182, 1.4], [264, 136, 2.1]].map(([x, y, r]) => (
                  <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="rgba(246,236,208,.55)" />
                ))}
              </g>
              <g className="lsx-shimmer" style={{ "--t": "13s" } as CSSProperties}>
                <polyline points="474,84 520,128 564,106 548,172 502,162" fill="none" stroke="rgba(207,228,234,.18)" strokeWidth="0.7" />
                {[[474, 84, 1.2], [520, 128, 1.8], [564, 106, 1.3], [548, 172, 1.9], [502, 162, 1.3]].map(([x, y, r]) => (
                  <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="rgba(246,236,208,.5)" />
                ))}
              </g>
            </svg>
            <HeroSextant />
          </div>
        </div>
        <div className="lsx-rule" />
      </section>

      {/* ==================== SIGN BAND — THE COMPASS ROSE ==================== */}
      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <p className="text-center text-[11px] uppercase tracking-[0.34em] text-[#c39a3b]">The Navigator&rsquo;s Compass</p>
        <h2 className="lsx-serif mt-4 text-center text-3xl text-[#eadfc0] sm:text-4xl">Twelve signs on the rose</h2>
        <p className="mx-auto mt-4 max-w-md text-center text-[13.5px] leading-relaxed text-[#eadfc0]/50">
          Every sign is a bearing. Pick yours and read today&rsquo;s horizon.
        </p>
        <div className="mt-12 lg:mt-14">
          <CompassRose />
          {/* compact grid below lg, where the rose would overflow */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:hidden">
            {SIGNS.map((s) => (
              <a
                key={s.n}
                href={`/horoscope/${s.n.toLowerCase()}`}
                className="lsx-plate group relative flex flex-col items-center px-3 py-5 text-center"
              >
                <span className="text-2xl leading-none text-[#e8c66a]">{s.g}</span>
                <span className="mt-3 text-[11px] uppercase tracking-[0.24em] text-[#eadfc0]/85">{s.n}</span>
                <span className="mt-1.5 text-[9.5px] uppercase tracking-[0.14em] text-[#eadfc0]/40">{s.d}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== INSTRUMENTS ON THE HORIZON RAIL ==================== */}
      <section className="relative mx-auto max-w-6xl px-6 py-16 lg:py-24">
        {/* ghost machinery: two faint rings turning far behind the rail */}
        <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
          <svg className="absolute -left-20 top-10 h-64 w-64" viewBox="0 0 200 200" opacity="0.14">
            <g className="lsx-cw" style={{ "--o": "100px 100px", "--t": "190s" } as CSSProperties}>
              <circle cx="100" cy="100" r="86" fill="none" stroke={BRASS_DK} strokeWidth="1" />
              <circle cx="100" cy="100" r="70" fill="none" stroke={BRASS_DK} strokeWidth="0.5" strokeDasharray="2 5" />
              {ringTeeth(100, 100, 86, 94, 36).map((t, i) => (
                <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={BRASS_DK} strokeWidth="0.9" />
              ))}
            </g>
          </svg>
          <svg className="absolute -right-24 bottom-4 h-80 w-80" viewBox="0 0 200 200" opacity="0.12">
            <g className="lsx-ccw" style={{ "--o": "100px 100px", "--t": "230s" } as CSSProperties}>
              <circle cx="100" cy="100" r="88" fill="none" stroke={BRASS_DK} strokeWidth="1" />
              <circle cx="100" cy="100" r="72" fill="none" stroke={BRASS_DK} strokeWidth="0.5" strokeDasharray="2 5" />
              {ringTeeth(100, 100, 88, 96, 48).map((t, i) => (
                <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={BRASS_DK} strokeWidth="0.8" />
              ))}
            </g>
          </svg>
        </div>
        <p className="text-center text-[11px] uppercase tracking-[0.34em] text-[#c39a3b]">The Instrument Rail</p>
        <h2 className="lsx-serif mt-4 text-center text-3xl text-[#eadfc0] sm:text-4xl">Instruments for every crossing</h2>
        {/* the long engraved horizon rule: stations I–VI, panels seated on the
            line at varying depths — three riding above it, three hanging below */}
        <div className="relative mt-16">
          <div className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 xl:block" aria-hidden="true">
            <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="h-[60px] w-full">
              <line x1="0" y1="30" x2="1200" y2="30" stroke={BRASS} strokeWidth="1" opacity="0.55" />
              <line x1="0" y1="26" x2="1200" y2="26" stroke={BRASS_DK} strokeWidth="0.4" opacity="0.35" />
              <line x1="0" y1="34" x2="1200" y2="34" stroke={BRASS_DK} strokeWidth="0.4" opacity="0.35" />
              {RAIL_TICKS.map((x, k) => (
                <line
                  key={x}
                  x1={x}
                  y1="30"
                  x2={x}
                  y2={k % 5 === 0 ? 42 : 36}
                  stroke={BRASS_DK}
                  strokeWidth={k % 5 === 0 ? 0.9 : 0.5}
                  opacity="0.6"
                />
              ))}
              {["I", "II", "III"].map((r, k) => (
                <text key={r} x={200 + k * 400} y="16" textAnchor="middle" fontFamily={SERIF_FONT} fontSize="9" letterSpacing="2" fill={IVORY} opacity="0.55">
                  {`STN · ${r}`}
                </text>
              ))}
              {["IV", "V", "VI"].map((r, k) => (
                <text key={r} x={200 + k * 400} y="52" textAnchor="middle" fontFamily={SERIF_FONT} fontSize="9" letterSpacing="2" fill={IVORY} opacity="0.55">
                  {`STN · ${r}`}
                </text>
              ))}
            </svg>
          </div>
          <div className="relative grid gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-x-6 xl:gap-y-24">
            {PANELS.map((p) => (
              <article key={p.title} className={`lsx-panel relative p-7 ${p.depth}`}>
                {RIVET_POS.map((pos) => (
                  <span key={pos} className={`lsx-rivet ${pos}`} aria-hidden="true" />
                ))}
                <div className="lsx-mech mx-auto flex items-center justify-center" style={{ transform: `scale(${p.mechScale})` }}>
                  {p.mech}
                </div>
                <div className="mt-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="lsx-serif text-xl text-[#eadfc0]">{p.title}</h3>
                    <span className="lsx-tag shrink-0 px-2 py-[3px] text-[9px] uppercase">{p.tag}</span>
                  </div>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-[#eadfc0]/60">{p.desc}</p>
                  {p.featured && (
                    <>
                      {/* the three pillars, as engraved chips */}
                      <div className="mt-5 flex flex-wrap gap-2">
                        {[
                          ["☉︎", "Sun — core self"],
                          ["☽︎", "Moon — inner tide"],
                          ["↑︎", "Rising — first mask"],
                        ].map(([g, label]) => (
                          <span key={label} className="lsx-chip px-2.5 py-1.5 text-[10px] uppercase">
                            <span className="text-[12px] leading-none">{g}</span>
                            {label}
                          </span>
                        ))}
                      </div>
                      <p className="mt-4 text-[10.5px] uppercase tracking-[0.18em] text-[#eadfc0]/45">
                        Enter date, time, place&nbsp;&nbsp;&rarr;&nbsp;&nbsp;your wheel in seconds.
                      </p>
                      {/* sighting console — purely visual, no JS */}
                      <div className="mt-3 flex flex-wrap items-stretch gap-2" aria-hidden="true">
                        {[
                          ["Date", "12 · 08 · 1992"],
                          ["Time", "14 : 35"],
                          ["Place", "Prague"],
                        ].map(([lbl, val]) => (
                          <div key={lbl} className="lsx-field min-w-[92px] flex-1 px-3 py-2">
                            <p className="text-[8.5px] uppercase tracking-[0.26em] text-[#c39a3b]">{lbl}</p>
                            <p className="mt-1 text-[12px] tracking-[0.08em] text-[#eadfc0]/40">{val}</p>
                          </div>
                        ))}
                        <span className="lsx-btn-primary lsx-serif flex items-center px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em]">
                          Cast&nbsp;&rarr;
                        </span>
                      </div>
                    </>
                  )}
                  <a href={p.href} className="lsx-link mt-5 inline-block text-[11px] uppercase tracking-[0.26em]">
                    Explore&nbsp;&rarr;
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== DESTINY MATRIX ==================== */}
      <section className="relative mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative mx-auto w-full max-w-[400px]">
            <DestinyCrosshair />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#c39a3b]">Birth-Date Octagram</p>
            <h2 className="lsx-serif mt-4 text-3xl text-[#eadfc0] sm:text-4xl">The Destiny Matrix, sighted</h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#eadfc0]/60">
              An optional birth-date octagram tool. It maps purpose, love, money, and age themes from your birth date.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Purpose", "Love", "Money", "Age themes"].map((c) => (
                <span key={c} className="lsx-chip px-2.5 py-1.5 text-[10px] uppercase">
                  {c}
                </span>
              ))}
            </div>
            <a href="/destiny-matrix" className="lsx-btn-ghost mt-8 px-6 py-3 text-[12px] uppercase tracking-[0.2em]">
              Open Destiny Matrix&nbsp;&rarr;
            </a>
          </div>
        </div>
      </section>

      {/* ==================== FAQ — THE SHIP'S LOG ==================== */}
      <section className="mx-auto max-w-3xl px-6 py-16 lg:py-20">
        <p className="text-center text-[11px] uppercase tracking-[0.34em] text-[#c39a3b]">The Ship&rsquo;s Log</p>
        <h2 className="lsx-serif mt-4 text-center text-3xl text-[#eadfc0] sm:text-4xl">Questions, entered in the log</h2>
        <div className="relative mt-12">
          {/* the rail the entries are pinned to */}
          <div className="absolute bottom-5 left-0 top-2 w-px bg-gradient-to-b from-[#c39a3b]/50 via-[#c39a3b]/25 to-transparent" aria-hidden="true" />
          {FAQS.map((f) => (
            <article key={f.n} className="relative py-7 pl-10 first:pt-1 last:pb-0">
              <span
                className="lsx-rivet absolute -left-[3.5px] top-9"
                style={{ position: "absolute" }}
                aria-hidden="true"
              />
              <h3 className="lsx-serif text-lg leading-snug text-[#eadfc0]">
                <span className="mr-2 text-[12px] uppercase tracking-[0.3em] text-[#e8c66a]">Entry&nbsp;{f.n}</span>
                <span className="text-[#c39a3b]">—&nbsp;</span>
                {f.q}
              </h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-[#eadfc0]/60">{f.a}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ==================== CTA BAND ==================== */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center lg:py-28">
        {/* the horizon, with one bright star worth steering by */}
        <svg viewBox="0 0 520 130" className="mx-auto h-auto w-full max-w-[420px]" aria-hidden="true">
          <line x1="40" y1="88" x2="480" y2="88" stroke={BRASS} strokeWidth="0.8" opacity="0.6" />
          {Array.from({ length: 23 }, (_, i) => 50 + i * 19).map((x, k) => (
            <line key={x} x1={x} y1="88" x2={x} y2={k % 4 === 0 ? 95 : 91.5} stroke={BRASS_DK} strokeWidth="0.5" opacity="0.55" />
          ))}
          <line x1="260" y1="48" x2="206" y2="88" stroke={IVORY} strokeWidth="0.5" strokeDasharray="2 4" opacity="0.25" />
          <line x1="260" y1="48" x2="314" y2="88" stroke={IVORY} strokeWidth="0.5" strokeDasharray="2 4" opacity="0.25" />
          <g className="lsx-twinkle" style={{ "--t": "15s" } as CSSProperties}>
            <circle cx="260" cy="42" r="22" fill="url(#lsx-g-starglow)" />
            <path d="M 260 24 L 263.3 38.7 L 278 42 L 263.3 45.3 L 260 60 L 256.7 45.3 L 242 42 L 256.7 38.7 Z" fill="#fff3cf" stroke={BRASS_HI} strokeWidth="0.5" />
            <circle cx="260" cy="42" r="2" fill="#ffffff" />
          </g>
          <path d="M 120 106 Q 170 102 220 106 T 320 106 T 420 106" fill="none" stroke={IVORY} strokeWidth="0.5" opacity="0.14" />
        </svg>
        <h2 className="lsx-serif mt-8 text-3xl leading-snug text-[#eadfc0] sm:text-4xl">
          Your chart is written in the stars.
          <br />
          Come read it.
        </h2>
        <a href="/sign-up" className="lsx-btn-primary lsx-serif mt-10 px-8 py-4 text-[13px] font-bold uppercase tracking-[0.18em]">
          Get started — it&rsquo;s free
        </a>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer>
        <div className="lsx-rule" />
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="lsx-serif text-[12px] tracking-[0.34em] text-[#e8c66a]">ASTRO&nbsp;SCOPE</p>
              <p className="mt-2 text-[12px] text-[#eadfc0]/45">Astro Scope — your daily cosmic guidance.</p>
            </div>
            <nav className="flex flex-wrap gap-x-7 gap-y-2 text-[11px] uppercase tracking-[0.2em] text-[#eadfc0]/60">
              <a href="/birth-chart" className="lsx-nav-link">Birth Chart</a>
              <a href="/horoscope" className="lsx-nav-link">Horoscopes</a>
              <a href="/tarot" className="lsx-nav-link">Tarot</a>
              <a href="/pricing" className="lsx-nav-link">Pricing</a>
            </nav>
          </div>
          <p className="mt-8 text-[10px] uppercase tracking-[0.18em] text-[#eadfc0]/30">&copy; 2026 Astro Scope</p>
        </div>
      </footer>
    </div>
  );
}
