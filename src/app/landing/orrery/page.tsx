// LANDING / ORRERY — a design exploration of the production landing in the
// "Gold & Mechanism" language of src/components/cards/orrery.tsx: engraved
// brass instruments on near-black, slow counter-rotating gear rings, planet
// arms, breathing lantern light. Fully self-contained: inline SVG, Tailwind
// for layout, one scoped <style> block (lo- prefixed) for the rest.
// Server-component safe: no hooks, CSS animations only, statically prerendered.

import type { Metadata } from "next";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Astro Scope — Your fate is a mechanism",
  description:
    "Free birth chart, daily horoscopes, synastry and tarot — instruments for reading the sky.",
};

const DEG = Math.PI / 180;

// the deck's brass palette (variant 0 of the orrery cards)
const DIM = "#6b5228";
const MID = "#a07c3e";
const BRIGHT = "#e8c87a";
const PALE = "#f6e5b8";
const DARK = "#100b06";

// radial gear teeth: n spokes from rIn to rOut around (cx, cy)
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

/* ======================== COSMIC BACKGROUND DATA ======================== */

// fine starfield across a 1600×1000 field, deterministic so the prerender is stable
const FIELD_STARS = Array.from({ length: 140 }, (_, i) => ({
  x: +((i * 733.7 + 97) % 1600).toFixed(1),
  y: +((i * 449.3 + 53) % 1000).toFixed(1),
  r: +(0.4 + ((i * 11) % 10) / 16).toFixed(2),
  o: +(0.3 + ((i * 17) % 10) / 28).toFixed(2),
  g: i % 4, // twinkle group
  cool: i % 7 === 3, // a few blue-white stars among the warm ones
}));

// the giant hairline zodiac ring looming behind the viewport (1000×1000)
const MEGA_TICKS = ringTeeth(500, 500, 472, 488, 72);
const MEGA_GLYPHS = ZODIAC.map((g, k) => {
  const t = (k * 30 - 90) * DEG;
  return { g, x: +(500 + 424 * Math.cos(t)).toFixed(1), y: +(500 + 424 * Math.sin(t)).toFixed(1) };
});

/* ============================== HERO ORRERY ============================== */

const H = 230; // hero axis (viewBox 0 0 460 460)

// faint star dust, deterministic so the prerender is stable
const DUST = Array.from({ length: 56 }, (_, i) => ({
  x: +(((i * 197.3 + 41) % 460)).toFixed(1),
  y: +(((i * 121.7 + 23) % 460)).toFixed(1),
  r: +(0.5 + ((i * 7) % 10) / 22).toFixed(2),
  o: +(0.22 + ((i * 13) % 10) / 24).toFixed(2),
}));

const HERO_TEETH_OUT = ringTeeth(H, H, 196, 207, 40);
const HERO_TEETH_MID = ringTeeth(H, H, 158, 168, 30);
const HERO_RIVETS = ringTeeth(H, H, 222, 222, 12); // positions only
const PINION = {
  x: +(H + 180 * Math.cos(145 * DEG)).toFixed(1),
  y: +(H + 180 * Math.sin(145 * DEG)).toFixed(1),
};
const PINION_TEETH = ringTeeth(PINION.x, PINION.y, 12, 16.5, 10);

// planet arms: orbit radius, resting angle, planet radius, fill, period
const HERO_ARMS = [
  { r: 74, angle: -35, pr: 4, fill: "#d8c8a0", t: "46s" },
  { r: 104, angle: 40, pr: 5.4, fill: "#d8bc82", t: "72s" }, // ringed
  { r: 134, angle: 165, pr: 6.2, fill: MID, t: "110s" },
];

function HeroOrrery() {
  return (
    <svg
      viewBox="0 0 460 460"
      className="h-auto w-full"
      role="img"
      aria-label="A brass orrery: toothed gear rings turning around a glowing lantern sun with three planet arms"
    >
      {/* star dust */}
      <g className="lo-fade" style={{ "--d": ".05s" } as CSSProperties}>
        {DUST.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={PALE} opacity={s.o} />
        ))}
      </g>

      {/* outer engraved double rule with rivets */}
      <g className="lo-fade" style={{ "--d": ".15s" } as CSSProperties}>
        <circle cx={H} cy={H} r="222" fill="none" stroke={DIM} strokeWidth="0.9" opacity="0.85" />
        <circle cx={H} cy={H} r="216" fill="none" stroke={DIM} strokeWidth="0.45" opacity="0.6" />
        {HERO_RIVETS.map((p, i) => (
          <circle key={i} cx={p.x1} cy={p.y1} r="1.6" fill={BRIGHT} opacity="0.8" />
        ))}
      </g>

      {/* engraved orbit circles */}
      <g className="lo-fade" style={{ "--d": ".25s" } as CSSProperties}>
        {HERO_ARMS.map((a) => (
          <circle key={a.r} cx={H} cy={H} r={a.r} fill="none" stroke={DIM} strokeWidth="0.5" strokeDasharray="1.5 3.5" opacity="0.8" />
        ))}
      </g>

      {/* outer gear ring — engages first, turns clockwise over 80s */}
      <g className="lo-engage" style={{ "--d": ".15s", "--r": "10deg" } as CSSProperties}>
        <g className="lo-cw" style={{ "--o": "230px 230px", "--t": "80s" } as CSSProperties}>
          <circle cx={H} cy={H} r="196" fill="none" stroke="url(#lo-g-metal)" strokeWidth="2.4" />
          <circle cx={H} cy={H} r="188" fill="none" stroke={DIM} strokeWidth="0.8" opacity="0.85" />
          {HERO_TEETH_OUT.map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={MID} strokeWidth="2.2" />
          ))}
        </g>
      </g>

      {/* middle gear ring — counter-rotates over 60s */}
      <g className="lo-engage" style={{ "--d": ".35s", "--r": "-8deg" } as CSSProperties}>
        <g className="lo-ccw" style={{ "--o": "230px 230px", "--t": "60s" } as CSSProperties}>
          <circle cx={H} cy={H} r="158" fill="none" stroke="url(#lo-g-metal)" strokeWidth="1.8" />
          <circle cx={H} cy={H} r="150" fill="none" stroke={DIM} strokeWidth="0.6" opacity="0.8" />
          {HERO_TEETH_MID.map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={MID} strokeWidth="1.8" />
          ))}
        </g>
      </g>

      {/* pinion meshing with the middle ring, lower left */}
      <g className="lo-engage" style={{ "--d": ".55s", "--r": "14deg", "--o": `${PINION.x}px ${PINION.y}px` } as CSSProperties}>
        <g className="lo-cw" style={{ "--o": `${PINION.x}px ${PINION.y}px`, "--t": "30s" } as CSSProperties}>
          <circle cx={PINION.x} cy={PINION.y} r="12" fill={DARK} stroke="url(#lo-g-metal)" strokeWidth="1.5" />
          {PINION_TEETH.map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={MID} strokeWidth="1.7" />
          ))}
          <circle cx={PINION.x} cy={PINION.y} r="2.6" fill={DARK} stroke={BRIGHT} strokeWidth="0.8" />
        </g>
      </g>

      {/* planet arms — swing out of the folded position, then orbit forever */}
      {HERO_ARMS.map((a, i) => (
        <g
          key={a.r}
          className="lo-engage"
          style={{ "--d": `${0.7 + i * 0.2}s`, "--r": `${-90 - a.angle}deg` } as CSSProperties}
        >
          <g className="lo-cw" style={{ "--o": "230px 230px", "--t": a.t } as CSSProperties}>
            <g transform={`rotate(${a.angle} ${H} ${H})`}>
              <line x1={H} y1={H - 14} x2={H} y2={H - a.r} stroke="url(#lo-g-metal)" strokeWidth="2.2" />
              <circle cx={H} cy={H - a.r * 0.55} r="1.2" fill={BRIGHT} />
              {i === 1 ? (
                <g transform={`translate(${H} ${H - a.r})`}>
                  <ellipse rx="10.5" ry="3.2" fill="none" stroke={BRIGHT} strokeWidth="1" transform="rotate(-18)" />
                  <circle r={a.pr} fill={a.fill} stroke={DIM} strokeWidth="0.7" />
                </g>
              ) : (
                <circle cx={H} cy={H - a.r} r={a.pr} fill={a.fill} stroke={DIM} strokeWidth="0.7" />
              )}
            </g>
          </g>
        </g>
      ))}

      {/* spindle dropping from the hub */}
      <g className="lo-fade" style={{ "--d": "1.1s" } as CSSProperties}>
        <line x1={H} y1={H + 10} x2={H} y2={H + 34} stroke="url(#lo-g-metal)" strokeWidth="2.6" />
        <rect x={H - 4.5} y={H + 20} width="9" height="3.6" rx="1.4" fill={DARK} stroke={MID} strokeWidth="0.8" />
      </g>

      {/* the lantern sun at the heart — breathing glow */}
      <g className="lo-fade" style={{ "--d": "1.25s" } as CSSProperties}>
        <circle className="lo-breathe" style={{ "--t": "14s" } as CSSProperties} cx={H} cy={H} r="42" fill="url(#lo-g-lantern)" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <line
            key={a}
            x1={H + 12.5 * Math.cos(a * DEG)}
            y1={H + 12.5 * Math.sin(a * DEG)}
            x2={H + 16.5 * Math.cos(a * DEG)}
            y2={H + 16.5 * Math.sin(a * DEG)}
            stroke={BRIGHT}
            strokeWidth="0.9"
          />
        ))}
        <circle cx={H} cy={H} r="9.5" fill="url(#lo-g-bulb)" stroke={BRIGHT} strokeWidth="1.1" />
        <circle cx={H} cy={H} r="3.4" fill={DARK} stroke={BRIGHT} strokeWidth="0.9" />
      </g>
    </svg>
  );
}

/* ========================== PANEL MINI-MECHANISMS ========================= */
// all are 120×120, all ambient motion is CSS (classes from the lo- block)

// BIRTH CHART — a natal wheel: zodiac band turning slowly around house spokes
function MechBirthChart() {
  const spokes = ringTeeth(60, 60, 20, 44, 12);
  const dividers = ringTeeth(60, 60, 44, 52, 12);
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="A small brass natal wheel with a slowly turning zodiac ring">
      <circle cx="60" cy="60" r="52" fill="none" stroke="url(#lo-g-frame)" strokeWidth="1.4" />
      <circle cx="60" cy="60" r="44" fill="none" stroke={DIM} strokeWidth="0.6" />
      {spokes.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={MID} strokeWidth="0.8" opacity="0.9" />
      ))}
      <circle cx="60" cy="60" r="20" fill="none" stroke="url(#lo-g-metal)" strokeWidth="1.1" />
      <circle cx="60" cy="60" r="2.6" fill={PALE} />
      <g className="lo-cw" style={{ "--t": "60s" } as CSSProperties}>
        {dividers.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={DIM} strokeWidth="0.7" />
        ))}
        {ZODIAC.map((g, k) => {
          const t = (k * 30 - 75) * DEG;
          return (
            <text
              key={g}
              x={60 + 48 * Math.cos(t)}
              y={60 + 48 * Math.sin(t) + 2.4}
              textAnchor="middle"
              fontFamily={GLYPH_FONT}
              fontSize="7"
              fill={BRIGHT}
            >
              {g}
            </text>
          );
        })}
      </g>
    </svg>
  );
}

// DAILY HOROSCOPE — a sun/moon dial: two hands creeping, moon disc phasing
function MechHoroscope() {
  const ticks = ringTeeth(60, 62, 38, 44, 24);
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="A brass dial with a sun hand, a moon hand, and a cycling moon-phase disc">
      <defs>
        <clipPath id="lo-moonclip">
          <circle cx="60" cy="62" r="9" />
        </clipPath>
      </defs>
      <circle cx="60" cy="62" r="44" fill="none" stroke="url(#lo-g-frame)" strokeWidth="1.4" />
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={i % 6 === 0 ? BRIGHT : DIM} strokeWidth={i % 6 === 0 ? 0.9 : 0.45} opacity="0.9" />
      ))}
      {/* sun hand, clockwise over 52s */}
      <g className="lo-cw" style={{ "--o": "60px 62px", "--t": "52s" } as CSSProperties}>
        <line x1="60" y1="62" x2="60" y2="30" stroke={BRIGHT} strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="60" cy="29" r="3" fill="url(#lo-g-bulb)" stroke={BRIGHT} strokeWidth="0.8" />
      </g>
      {/* moon hand, counter-clockwise over 90s */}
      <g className="lo-ccw" style={{ "--o": "60px 62px", "--t": "90s" } as CSSProperties}>
        <line x1="60" y1="62" x2="60" y2="40" stroke={MID} strokeWidth="1.1" strokeLinecap="round" />
        <circle cx="60" cy="39" r="2.2" fill={DARK} stroke={PALE} strokeWidth="0.8" />
      </g>
      {/* moon-phase disc: a shadow sweeps across a gilt disc, endlessly */}
      <circle cx="60" cy="62" r="9" fill="url(#lo-g-bulb)" />
      <g clipPath="url(#lo-moonclip)">
        <circle className="lo-phase" cx="60" cy="62" r="9" fill="#0d0a06" opacity="0.92" />
      </g>
      <circle cx="60" cy="62" r="9" fill="none" stroke={BRIGHT} strokeWidth="1" />
      <circle cx="60" cy="62" r="1.4" fill={DARK} stroke={PALE} strokeWidth="0.7" />
    </svg>
  );
}

// COMPATIBILITY — two gears locked in mesh, turning against each other
function MechCompatibility() {
  const teethA = ringTeeth(40, 60, 22, 27, 16);
  const teethB = ringTeeth(80, 60, 15.5, 19.5, 12, 15); // half-step offset so teeth interleave
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="Two brass gears meshing and turning in opposite directions">
      <g className="lo-cw" style={{ "--t": "32s" } as CSSProperties}>
        <circle cx="40" cy="60" r="22" fill={DARK} stroke="url(#lo-g-metal)" strokeWidth="1.6" />
        <circle cx="40" cy="60" r="15" fill="none" stroke={DIM} strokeWidth="0.7" />
        {[0, 90].map((a) => (
          <line
            key={a}
            x1={40 - 20 * Math.cos(a * DEG)}
            y1={60 - 20 * Math.sin(a * DEG)}
            x2={40 + 20 * Math.cos(a * DEG)}
            y2={60 + 20 * Math.sin(a * DEG)}
            stroke={MID}
            strokeWidth="1"
          />
        ))}
        {teethA.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={MID} strokeWidth="2" />
        ))}
        <circle cx="40" cy="60" r="3" fill={DARK} stroke={BRIGHT} strokeWidth="0.9" />
      </g>
      <g className="lo-ccw" style={{ "--t": "24s" } as CSSProperties}>
        <circle cx="80" cy="60" r="15.5" fill={DARK} stroke="url(#lo-g-metal)" strokeWidth="1.4" />
        <circle cx="80" cy="60" r="10" fill="none" stroke={DIM} strokeWidth="0.6" />
        {[0, 60, 120].map((a) => (
          <line
            key={a}
            x1={80 - 14 * Math.cos(a * DEG)}
            y1={60 - 14 * Math.sin(a * DEG)}
            x2={80 + 14 * Math.cos(a * DEG)}
            y2={60 + 14 * Math.sin(a * DEG)}
            stroke={MID}
            strokeWidth="0.9"
          />
        ))}
        {teethB.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={MID} strokeWidth="1.8" />
        ))}
        <circle cx="80" cy="60" r="2.4" fill={DARK} stroke={BRIGHT} strokeWidth="0.8" />
      </g>
      {/* fixed axle caps above the turning hubs */}
      <circle cx="40" cy="60" r="1.3" fill={PALE} />
      <circle cx="80" cy="60" r="1.1" fill={PALE} />
    </svg>
  );
}

// TAROT — the Hermit's lantern, swinging gently on its chain
function MechTarot() {
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="A small brass lantern swinging on a chain">
      <circle cx="60" cy="14" r="3" fill={DARK} stroke="url(#lo-g-frame)" strokeWidth="1.2" />
      <g className="lo-swing">
        <line x1="60" y1="14" x2="60" y2="45" stroke={MID} strokeWidth="1" />
        {[22, 30, 38].map((y) => (
          <circle key={y} cx="60" cy={y} r="1.6" fill="none" stroke={DIM} strokeWidth="0.7" />
        ))}
        <circle className="lo-breathe" style={{ "--t": "9s" } as CSSProperties} cx="60" cy="60" r="17" fill="url(#lo-g-lantern)" />
        {/* cap + body of the lantern */}
        <path d="M 54 51 L 56.5 45.5 L 63.5 45.5 L 66 51" fill="none" stroke={BRIGHT} strokeWidth="0.9" />
        <path d="M 52 51 L 68 51 L 65 69 L 55 69 Z" fill="#2a1d0c" stroke={BRIGHT} strokeWidth="1.1" strokeLinejoin="round" />
        <path d="M 60 55 L 61.8 60 L 60 65 L 58.2 60 Z" fill="#fff6d8" />
        <line x1="53.5" y1="72" x2="66.5" y2="72" stroke={MID} strokeWidth="1" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// PSYCHOLOGY — a prism splitting one beam into a quiet gold spectrum
function MechPsychology() {
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="A beam of light splitting through a brass-framed prism">
      {/* incoming beam */}
      <line className="lo-shimmer" style={{ "--t": "8s" } as CSSProperties} x1="8" y1="66" x2="46" y2="58" stroke={PALE} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="46" cy="58" r="2" fill="url(#lo-g-bulb)" />
      {/* prism */}
      <path d="M 60 36 L 41 76 L 79 76 Z" fill="rgba(232,200,122,0.05)" stroke={BRIGHT} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M 60 44 L 48 71 L 72 71 Z" fill="none" stroke={DIM} strokeWidth="0.6" opacity="0.9" />
      {/* the split spectrum, in three grades of gold */}
      <line className="lo-shimmer" style={{ "--t": "8s", "--d": ".7s" } as CSSProperties} x1="68" y1="56" x2="112" y2="42" stroke={PALE} strokeWidth="1.6" strokeLinecap="round" />
      <line className="lo-shimmer" style={{ "--t": "8s", "--d": "1.4s" } as CSSProperties} x1="70" y1="60" x2="112" y2="58" stroke={BRIGHT} strokeWidth="2" strokeLinecap="round" />
      <line className="lo-shimmer" style={{ "--t": "8s", "--d": "2.1s" } as CSSProperties} x1="68" y1="64" x2="112" y2="74" stroke={MID} strokeWidth="1.6" strokeLinecap="round" />
      {/* instrument stand */}
      <line x1="46" y1="84" x2="74" y2="84" stroke={DIM} strokeWidth="0.9" />
      <line x1="60" y1="76" x2="60" y2="84" stroke={DIM} strokeWidth="0.9" />
    </svg>
  );
}

// COSMIC PASSPORT — an engraved plaque with a slowly rotating seal ring
function MechPassport() {
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="An engraved brass plaque with a rotating circular seal">
      <defs>
        <path id="lo-seal-circ" d="M 40 54 A 20 20 0 1 1 80 54 A 20 20 0 1 1 40 54" fill="none" />
      </defs>
      <rect x="16" y="22" width="88" height="76" rx="3" fill="#0d0a06" stroke="url(#lo-g-frame)" strokeWidth="1.3" />
      <rect x="20" y="26" width="80" height="68" rx="2" fill="none" stroke={DIM} strokeWidth="0.5" />
      {[26, 94].map((x) =>
        [31, 89].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.1" fill={BRIGHT} opacity="0.85" />)
      )}
      {/* seal: fixed rim + ticks, inscription ring turning over 44s */}
      <circle cx="60" cy="54" r="24.5" fill="none" stroke={DIM} strokeWidth="0.6" />
      {ringTeeth(60, 54, 23, 24.5, 24).map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={DIM} strokeWidth="0.5" />
      ))}
      <g className="lo-cw" style={{ "--t": "44s" } as CSSProperties}>
        <text fontFamily="Georgia, 'Times New Roman', serif" fontSize="6" letterSpacing="1.1" fill={BRIGHT}>
          <textPath href="#lo-seal-circ">ASTRO SCOPE · COSMIC PASSPORT · ONE SKY ·</textPath>
        </text>
      </g>
      <path d={starN(60, 54, 8, 8, 3.2)} fill={DARK} stroke={PALE} strokeWidth="0.9" strokeLinejoin="round" />
      <circle cx="60" cy="54" r="1.2" fill={PALE} />
      {/* engraved lines below the seal */}
      <line x1="40" y1="84" x2="80" y2="84" stroke={DIM} strokeWidth="0.6" />
      <line x1="47" y1="88" x2="73" y2="88" stroke={DIM} strokeWidth="0.45" />
    </svg>
  );
}

/* ================================= PAGE ================================== */

const PANELS = [
  {
    tag: "FREE",
    title: "Birth Chart",
    desc: "Map your Sun, Moon, and Rising — the foundation of every reading.",
    href: "/birth-chart",
    mech: <MechBirthChart />,
    cls: "md:col-span-2 xl:col-span-3 xl:row-span-2",
    mechScale: 1.58,
    featured: true,
  },
  {
    tag: "DAILY",
    title: "Daily Horoscope",
    desc: "Twelve signs, one sky. Clear forecasts without the fluff.",
    href: "/horoscope",
    mech: <MechHoroscope />,
    cls: "xl:col-span-3",
    mechScale: 1.03,
    featured: false,
  },
  {
    tag: "SYNASTRY",
    title: "Compatibility",
    desc: "Zodiac match, Chinese pairs, and deep synastry for two charts.",
    href: "/compatibility",
    mech: <MechCompatibility />,
    cls: "xl:col-span-3 xl:mt-3",
    mechScale: 1.1,
    featured: false,
  },
  {
    tag: "SPREADS",
    title: "Tarot",
    desc: "Daily card to Celtic Cross — pull, reflect, get a full reading.",
    href: "/tarot",
    mech: <MechTarot />,
    cls: "xl:col-span-2",
    mechScale: 1.0,
    featured: false,
  },
  {
    tag: "TESTS",
    title: "Psychology",
    desc: "MBTI, Big Five, empathy and more — meet yourself beyond the signs.",
    href: "/psychology",
    mech: <MechPsychology />,
    cls: "xl:col-span-2 xl:mt-9",
    mechScale: 0.97,
    featured: false,
  },
  {
    tag: "YOU",
    title: "Cosmic Passport",
    desc: "Your Cosmic ID, people, journal, and Premium deep dives — one hub.",
    href: "/passport",
    mech: <MechPassport />,
    cls: "xl:col-span-2 xl:mt-4",
    mechScale: 1.07,
    featured: false,
  },
];

const RIVET_POS = ["left-2 top-2", "right-2 top-2", "left-2 bottom-2", "right-2 bottom-2"];

export default function OrreryLanding() {
  return (
    <div className="lo-root relative isolate min-h-screen">
      <style>{`
        .lo-root { background: #050403; color: #f0e9d8; font-family: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif; }
        .lo-root ::selection { background: rgba(201,162,39,.28); color: #f6e5b8; }
        .lo-serif { font-family: Georgia, 'Times New Roman', serif; }
        .lo-rule { height: 1px; background: linear-gradient(90deg, transparent, rgba(160,124,62,.55), transparent); }

        /* buttons */
        .lo-btn-primary { display: inline-block; background: linear-gradient(180deg, #f0dda0 0%, #d9b95c 48%, #b98f22 100%); color: #241a06; border: 1px solid #8a6a34; box-shadow: inset 0 1px 0 rgba(255,246,216,.75), inset 0 -1px 0 rgba(90,66,30,.65), 0 12px 28px -14px rgba(201,162,39,.5); transition: filter .35s ease, box-shadow .35s ease; }
        .lo-btn-primary:hover { filter: brightness(1.07); box-shadow: inset 0 1px 0 rgba(255,246,216,.75), inset 0 -1px 0 rgba(90,66,30,.65), 0 16px 34px -12px rgba(201,162,39,.65); }
        .lo-btn-ghost { display: inline-block; border: 1px solid rgba(160,124,62,.5); color: #e8c87a; transition: border-color .35s ease, background .35s ease; }
        .lo-btn-ghost:hover { border-color: rgba(232,200,122,.85); background: rgba(201,162,39,.07); }

        /* instrument panels */
        .lo-panel { background: #0d0a06; border: 1px solid rgba(160,124,62,.4); box-shadow: inset 0 0 0 3px #0d0a06, inset 0 0 0 4px rgba(160,124,62,.28); transition: transform .5s cubic-bezier(.22,.7,.3,1), border-color .5s ease, box-shadow .5s ease; }
        .lo-panel:hover { transform: translateY(-4px); border-color: rgba(232,200,122,.6); box-shadow: 0 20px 44px -20px rgba(0,0,0,.85), 0 0 34px -8px rgba(201,162,39,.16), inset 0 0 0 3px #0d0a06, inset 0 0 0 4px rgba(232,200,122,.35); }
        .lo-mech { transition: filter .5s ease; }
        .lo-panel:hover .lo-mech { filter: drop-shadow(0 0 12px rgba(232,180,90,.28)); }
        .lo-rivet { position: absolute; width: 7px; height: 7px; border-radius: 9999px; border: 1px solid rgba(232,200,122,.5); background: radial-gradient(circle at 35% 30%, #f6e5b8 0%, #a07c3e 48%, #3a2a12 100%); }
        .lo-tag { display: inline-block; border: 1px solid rgba(160,124,62,.55); color: #e8c87a; background: rgba(201,162,39,.05); box-shadow: inset 0 1px 2px rgba(0,0,0,.6); letter-spacing: .28em; }
        .lo-link { color: #e8c87a; transition: color .3s ease; }
        .lo-panel:hover .lo-link { color: #f6e5b8; }

        /* zodiac plates */
        .lo-plate { background: #0d0a06; border: 1px solid rgba(160,124,62,.35); box-shadow: inset 0 0 0 2px #0d0a06, inset 0 0 0 3px rgba(160,124,62,.18); transition: border-color .4s ease, box-shadow .4s ease, transform .4s ease; }
        .lo-plate:hover { border-color: rgba(232,200,122,.7); box-shadow: 0 0 24px -6px rgba(201,162,39,.3), inset 0 0 0 2px #0d0a06, inset 0 0 0 3px rgba(232,200,122,.3); }

        .lo-nav-link { transition: color .3s ease; }
        .lo-nav-link:hover { color: #e8c87a; }

        /* load: text rises, gears engage one by one */
        .lo-rise { animation: lo-rise .9s cubic-bezier(.22,.7,.3,1) backwards; animation-delay: var(--d, 0s); }
        .lo-fade { animation: lo-fade-in 1s ease-out backwards; animation-delay: var(--d, 0s); }
        .lo-engage { transform-box: view-box; transform-origin: var(--o, 230px 230px); animation: lo-engage 1.1s cubic-bezier(.25,.75,.25,1) backwards; animation-delay: var(--d, 0s); }

        /* ambient motion — all slow, all restrained */
        .lo-cw  { transform-box: view-box; transform-origin: var(--o, 60px 60px); animation: lo-spin var(--t, 60s) linear infinite; }
        .lo-ccw { transform-box: view-box; transform-origin: var(--o, 60px 60px); animation: lo-spin-rev var(--t, 60s) linear infinite; }
        .lo-breathe { animation: lo-breathe var(--t, 16s) ease-in-out infinite; }
        .lo-swing { transform-box: view-box; transform-origin: 60px 14px; animation: lo-swing 7s ease-in-out infinite alternate; }
        .lo-shimmer { animation: lo-shimmer var(--t, 8s) ease-in-out infinite; animation-delay: var(--d, 0s); }
        .lo-phase { transform-box: view-box; animation: lo-phase 26s ease-in-out infinite alternate; }

        @keyframes lo-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes lo-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lo-engage { from { opacity: 0; transform: rotate(var(--r, 12deg)); } to { opacity: 1; transform: rotate(0deg); } }
        @keyframes lo-spin { to { transform: rotate(360deg); } }
        @keyframes lo-spin-rev { to { transform: rotate(-360deg); } }
        @keyframes lo-breathe { 0%, 100% { opacity: .7; } 50% { opacity: 1; } }
        @keyframes lo-swing { from { transform: rotate(-4deg); } to { transform: rotate(4deg); } }
        @keyframes lo-shimmer { 0%, 100% { opacity: .35; } 50% { opacity: .95; } }
        @keyframes lo-phase { from { transform: translateX(-15px); } to { transform: translateX(15px); } }

        /* ---------- cosmic background ---------- */
        .lo-bg { position: fixed; inset: 0; z-index: -1; overflow: hidden; pointer-events: none; background: radial-gradient(130% 80% at 50% -10%, #0b0714 0%, #050403 55%); }
        .lo-neb { position: absolute; border-radius: 50%; filter: blur(36px); animation: lo-drift var(--t, 90s) ease-in-out infinite alternate; }
        .lo-tw1 { animation: lo-twinkle 7s ease-in-out infinite; }
        .lo-tw2 { animation: lo-twinkle 11s ease-in-out infinite 2.2s; }
        .lo-tw3 { animation: lo-twinkle 14s ease-in-out infinite 4.1s; }
        .lo-tw4 { animation: lo-twinkle 9.5s ease-in-out infinite 1.3s; }
        .lo-mega { position: absolute; }
        .lo-meteor { position: absolute; width: 110px; height: 1px; border-radius: 1px; background: linear-gradient(90deg, rgba(246,229,184,.9), rgba(246,229,184,0)); opacity: 0; pointer-events: none; animation: lo-meteor 13s linear infinite; }
        .lo-meteor-late { animation-duration: 19s; animation-delay: 7.5s; }

        /* zodiac band: plates follow a shallow arc on wide screens */
        @media (min-width: 1024px) {
          .lo-plate { transform: translateY(var(--ay, 0px)) rotate(var(--ar, 0deg)); }
          .lo-plate:hover { transform: translateY(calc(var(--ay, 0px) - 3px)) rotate(var(--ar, 0deg)); }
        }
        @media (max-width: 1023.98px) {
          .lo-plate:hover { transform: translateY(-2px); }
        }

        @keyframes lo-twinkle { 0%, 100% { opacity: .12; } 50% { opacity: .8; } }
        @keyframes lo-drift { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(2.5%, -2%, 0); } }
        @keyframes lo-meteor {
          0%   { opacity: 0; transform: translate3d(0, 0, 0) rotate(-26deg); }
          2.5% { opacity: .85; }
          9%   { opacity: 0; transform: translate3d(-240px, 118px, 0) rotate(-26deg); }
          100% { opacity: 0; transform: translate3d(-240px, 118px, 0) rotate(-26deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .lo-rise, .lo-fade, .lo-engage, .lo-cw, .lo-ccw,
          .lo-breathe, .lo-swing, .lo-shimmer, .lo-phase,
          .lo-tw1, .lo-tw2, .lo-tw3, .lo-tw4, .lo-neb, .lo-meteor {
            animation: none;
          }
        }
      `}</style>

      {/* cosmic background: fixed behind all content, above the root ground color —
          nebula washes, a twinkling starfield, and a giant hairline zodiac ring */}
      <div className="lo-bg" aria-hidden="true">
        <div
          className="lo-neb"
          style={{ width: "55vmax", height: "55vmax", left: "-12vmax", top: "-14vmax", background: "radial-gradient(circle, rgba(88,66,158,.14) 0%, transparent 65%)", "--t": "95s" } as CSSProperties}
        />
        <div
          className="lo-neb"
          style={{ width: "48vmax", height: "48vmax", right: "-10vmax", top: "24%", background: "radial-gradient(circle, rgba(122,74,150,.10) 0%, transparent 65%)", "--t": "112s" } as CSSProperties}
        />
        <div
          className="lo-neb"
          style={{ width: "60vmax", height: "60vmax", left: "26%", bottom: "-26vmax", background: "radial-gradient(circle, rgba(58,72,140,.11) 0%, transparent 65%)", "--t": "84s" } as CSSProperties}
        />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
          {FIELD_STARS.map((s, i) => (
            <circle key={i} className={`lo-tw${s.g + 1}`} cx={s.x} cy={s.y} r={s.r} fill={s.cool ? "#d8dcff" : PALE} opacity={s.o} />
          ))}
        </svg>
        <svg className="lo-mega" style={{ width: "150vmin", height: "150vmin", left: "58%", top: "-42vmin" } as CSSProperties} viewBox="0 0 1000 1000">
          <circle cx="500" cy="500" r="497" fill="none" stroke="rgba(160,124,62,.10)" strokeWidth="1" />
          <g className="lo-cw" style={{ "--o": "500px 500px", "--t": "280s" } as CSSProperties}>
            <circle cx="500" cy="500" r="470" fill="none" stroke="rgba(160,124,62,.16)" strokeWidth="1" />
            <circle cx="500" cy="500" r="382" fill="none" stroke="rgba(160,124,62,.10)" strokeWidth="0.7" strokeDasharray="2 6" />
            {MEGA_TICKS.map((t, i) => (
              <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="rgba(160,124,62,.16)" strokeWidth={i % 6 === 0 ? 1 : 0.5} />
            ))}
            {MEGA_GLYPHS.map((m) => (
              <text key={m.g} x={m.x} y={m.y + 10} textAnchor="middle" fontFamily={GLYPH_FONT} fontSize="30" fill="rgba(232,200,122,.10)">
                {m.g}
              </text>
            ))}
          </g>
        </svg>
      </div>

      {/* shared defs: objectBoundingBox gradients are reusable across every SVG on the page */}
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="lo-g-metal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a3517" />
            <stop offset="30%" stopColor={MID} />
            <stop offset="46%" stopColor="#f0d999" />
            <stop offset="58%" stopColor="#8a6a34" />
            <stop offset="100%" stopColor="#3a2a12" />
          </linearGradient>
          <linearGradient id="lo-g-frame" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8a6a34" />
            <stop offset="50%" stopColor="#e0bd72" />
            <stop offset="100%" stopColor="#5a421e" />
          </linearGradient>
          <radialGradient id="lo-g-lantern" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffedbb" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#e8b45a" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#e8b45a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="lo-g-bulb" cx="42%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#fff6d8" />
            <stop offset="55%" stopColor="#e8b45a" />
            <stop offset="100%" stopColor={DIM} />
          </radialGradient>
        </defs>
      </svg>

      {/* ==================== TOP NAV ==================== */}
      <header>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="flex items-center gap-2.5">
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
              <g className="lo-cw" style={{ "--o": "12px 12px", "--t": "70s" } as CSSProperties}>
                <circle cx="12" cy="12" r="5.2" fill="none" stroke={BRIGHT} strokeWidth="1.4" />
                {ringTeeth(12, 12, 5.2, 8.6, 8).map((t, i) => (
                  <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={BRIGHT} strokeWidth="1.3" />
                ))}
                <circle cx="12" cy="12" r="1.3" fill={BRIGHT} />
              </g>
            </svg>
            <span className="lo-serif text-[13px] tracking-[0.38em] text-[#e8c87a]">ASTRO&nbsp;SCOPE</span>
          </a>
          <nav className="flex items-center gap-7 text-[11px] uppercase tracking-[0.22em] text-[#f0e9d8]/65">
            <a href="/horoscope" className="lo-nav-link hidden sm:inline">Horoscopes</a>
            <a href="/tarot" className="lo-nav-link hidden sm:inline">Tarot</a>
            <a href="/compatibility" className="lo-nav-link hidden md:inline">Compatibility</a>
            <a href="/sign-in" className="lo-nav-link border border-[#6b5228]/60 px-3.5 py-1.5 text-[#e8c87a] hover:border-[#e8c87a]/70">Sign&nbsp;In</a>
          </nav>
        </div>
        <div className="lo-rule" />
      </header>

      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden">
        {/* warm atmosphere behind the headline + occasional shooting stars */}
        <div
          className="lo-breathe pointer-events-none absolute -left-24 top-4 h-[430px] w-[560px] rounded-full blur-2xl"
          style={{ "--t": "22s", background: "radial-gradient(closest-side, rgba(232,180,90,.12), transparent 70%)" } as CSSProperties}
          aria-hidden="true"
        />
        <span className="lo-meteor left-[54%] top-[15%]" aria-hidden="true" />
        <span className="lo-meteor lo-meteor-late left-[80%] top-[42%]" aria-hidden="true" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <p className="lo-rise text-[11px] uppercase tracking-[0.34em] text-[#a07c3e]" style={{ "--d": ".1s" } as CSSProperties}>
              Birth Charts&nbsp;&nbsp;·&nbsp;&nbsp;Horoscopes&nbsp;&nbsp;·&nbsp;&nbsp;Tarot
            </p>
            <h1 className="lo-rise lo-serif mt-6 text-5xl leading-[1.08] text-[#f0e9d8] sm:text-6xl" style={{ "--d": ".25s" } as CSSProperties}>
              Your fate is a <em className="text-[#e8c87a]">mechanism.</em>
              <br />
              We read its gears.
            </h1>
            <p className="lo-rise mt-6 max-w-md text-[15px] leading-relaxed text-[#f0e9d8]/60" style={{ "--d": ".45s" } as CSSProperties}>
              Free birth chart, daily horoscopes, synastry and tarot — instruments for reading the sky.
            </p>
            <div className="lo-rise mt-9 flex flex-wrap items-center gap-4" style={{ "--d": ".6s" } as CSSProperties}>
              <a href="/birth-chart" className="lo-btn-primary lo-serif px-7 py-3.5 text-[13px] font-bold uppercase tracking-[0.18em]">
                Cast your free birth chart
              </a>
              <a href="/horoscope" className="lo-btn-ghost px-6 py-3.5 text-[12px] uppercase tracking-[0.2em]">
                Read today&rsquo;s horoscope&nbsp;&rarr;
              </a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[520px]">
            {/* faint constellation polylines woven behind the machine */}
            <svg className="pointer-events-none absolute -inset-10 h-[calc(100%+5rem)] w-[calc(100%+5rem)]" viewBox="0 0 600 600" aria-hidden="true">
              <g>
                <polyline points="70,150 132,106 206,142 268,96" fill="none" stroke="rgba(216,220,255,.22)" strokeWidth="0.7" />
                {[[70, 150, 1.3], [132, 106, 1.9], [206, 142, 1.4], [268, 96, 2.1]].map(([x, y, r]) => (
                  <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="rgba(246,229,184,.55)" />
                ))}
              </g>
              <g className="lo-shimmer" style={{ "--t": "13s" } as CSSProperties}>
                <polyline points="468,64 516,108 560,86 544,152 498,142" fill="none" stroke="rgba(216,220,255,.18)" strokeWidth="0.7" />
                {[[468, 64, 1.2], [516, 108, 1.8], [560, 86, 1.3], [544, 152, 1.9], [498, 142, 1.3]].map(([x, y, r]) => (
                  <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="rgba(246,229,184,.5)" />
                ))}
              </g>
            </svg>
            <HeroOrrery />
          </div>
        </div>
        <div className="lo-rule" />
      </section>

      {/* ==================== SIGN STRIP ==================== */}
      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <p className="text-center text-[11px] uppercase tracking-[0.34em] text-[#a07c3e]">Daily Horoscope</p>
        <h2 className="lo-serif mt-4 text-center text-3xl text-[#f0e9d8] sm:text-4xl">Read your daily horoscope</h2>
        {/* the twelve plates seated along a shallow zodiac band: two mirrored
            arcs (∩ over ∪) with hairline engraving behind them */}
        <div className="mt-12 lg:mt-14">
          {[SIGNS.slice(0, 6), SIGNS.slice(6)].map((row, ri) => (
            <div
              key={ri}
              className={`relative grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:justify-center ${
                ri === 1 ? "mt-3 lg:-mt-1 lg:translate-x-10" : ""
              }`}
            >
              <svg className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" viewBox="0 0 1200 110" preserveAspectRatio="none" aria-hidden="true">
                <path d={ri === 0 ? "M 40 88 Q 600 4 1160 88" : "M 40 22 Q 600 106 1160 22"} fill="none" stroke={DIM} strokeWidth="0.8" opacity="0.5" />
                <path d={ri === 0 ? "M 40 96 Q 600 14 1160 96" : "M 40 14 Q 600 96 1160 14"} fill="none" stroke={DIM} strokeWidth="0.5" opacity="0.25" />
              </svg>
              {row.map((s, i) => {
                const t = (i - 2.5) / 2.5; // -1 … 1 across the row
                const y = ri === 0 ? 20 * t * t : 16 - 16 * t * t;
                const rot = (ri === 0 ? 1 : -1) * 2.4 * t;
                return (
                  <a
                    key={s.n}
                    href={`/horoscope/${s.n.toLowerCase()}`}
                    className="lo-plate group relative flex flex-col items-center px-3 py-5 text-center lg:w-[148px] lg:shrink-0"
                    style={{ "--ay": `${y.toFixed(1)}px`, "--ar": `${rot.toFixed(2)}deg` } as CSSProperties}
                  >
                    <span className="text-2xl leading-none text-[#e8c87a]">{s.g}</span>
                    <span className="mt-3 text-[11px] uppercase tracking-[0.24em] text-[#f0e9d8]/85">{s.n}</span>
                    <span className="mt-1.5 text-[9.5px] uppercase tracking-[0.14em] text-[#f0e9d8]/40">{s.d}</span>
                  </a>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      {/* ==================== INSTRUMENT PANELS ==================== */}
      <section className="relative mx-auto max-w-6xl px-6 py-10 lg:py-16">
        {/* connective tissue: two ghost gears turning behind the workbench */}
        <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
          <svg className="absolute -left-20 top-16 h-64 w-64" viewBox="0 0 200 200" opacity="0.16">
            <g className="lo-cw" style={{ "--o": "100px 100px", "--t": "170s" } as CSSProperties}>
              <circle cx="100" cy="100" r="86" fill="none" stroke={DIM} strokeWidth="1" />
              <circle cx="100" cy="100" r="70" fill="none" stroke={DIM} strokeWidth="0.5" strokeDasharray="2 5" />
              {ringTeeth(100, 100, 86, 95, 26).map((t, i) => (
                <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={DIM} strokeWidth="1.6" />
              ))}
            </g>
          </svg>
          <svg className="absolute -right-24 bottom-6 h-80 w-80" viewBox="0 0 200 200" opacity="0.13">
            <g className="lo-ccw" style={{ "--o": "100px 100px", "--t": "210s" } as CSSProperties}>
              <circle cx="100" cy="100" r="88" fill="none" stroke={DIM} strokeWidth="1" />
              <circle cx="100" cy="100" r="72" fill="none" stroke={DIM} strokeWidth="0.5" strokeDasharray="2 5" />
              {ringTeeth(100, 100, 88, 97, 34).map((t, i) => (
                <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={DIM} strokeWidth="1.5" />
              ))}
            </g>
          </svg>
        </div>
        <p className="text-center text-[11px] uppercase tracking-[0.34em] text-[#a07c3e]">The Instrument Panel</p>
        <h2 className="lo-serif mt-4 text-center text-3xl text-[#f0e9d8] sm:text-4xl">Everything the stars have to offer</h2>
        {/* asymmetric editorial grid: Birth Chart featured 3×2, the rest in
            varied spans with a staggered vertical rhythm */}
        <div className="relative mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-6">
          {PANELS.map((p) => (
            <article key={p.title} className={`lo-panel relative p-7 ${p.cls}`}>
              {RIVET_POS.map((pos) => (
                <span key={pos} className={`lo-rivet ${pos}`} aria-hidden="true" />
              ))}
              <div className={p.featured ? "xl:flex xl:items-center xl:gap-8" : ""}>
                <div
                  className={`lo-mech mx-auto flex items-center justify-center ${p.featured ? "shrink-0 p-3 xl:mx-0" : ""}`}
                  style={{ transform: `scale(${p.mechScale})` }}
                >
                  {p.mech}
                </div>
                <div className={p.featured ? "mt-6 xl:mt-0" : "mt-6"}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className={`lo-serif ${p.featured ? "text-2xl" : "text-xl"} text-[#f0e9d8]`}>{p.title}</h3>
                    <span className="lo-tag shrink-0 px-2 py-[3px] text-[9px] uppercase">{p.tag}</span>
                  </div>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-[#f0e9d8]/60">{p.desc}</p>
                  <a href={p.href} className="lo-link mt-5 inline-block text-[11px] uppercase tracking-[0.26em]">
                    Explore&nbsp;&rarr;
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ==================== CTA BAND ==================== */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center lg:py-28">
        <div className="flex items-center justify-center gap-4">
          <span className="lo-rule w-20 sm:w-28" />
          <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" aria-hidden="true">
            <path d="M 7 0 L 8.2 5.8 L 14 7 L 8.2 8.2 L 7 14 L 5.8 8.2 L 0 7 L 5.8 5.8 Z" fill="#c9a227" />
          </svg>
          <span className="lo-rule w-20 sm:w-28" />
        </div>
        <h2 className="lo-serif mt-8 text-3xl leading-snug text-[#f0e9d8] sm:text-4xl">
          Your chart is written in the stars.
          <br />
          Come read it.
        </h2>
        <a href="/sign-up" className="lo-btn-primary lo-serif mt-10 px-8 py-4 text-[13px] font-bold uppercase tracking-[0.18em]">
          Get started — it&rsquo;s free
        </a>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer>
        <div className="lo-rule" />
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="lo-serif text-[12px] tracking-[0.34em] text-[#e8c87a]">ASTRO&nbsp;SCOPE</p>
              <p className="mt-2 text-[12px] text-[#f0e9d8]/45">Astro Scope — your daily cosmic guidance.</p>
            </div>
            <nav className="flex flex-wrap gap-x-7 gap-y-2 text-[11px] uppercase tracking-[0.2em] text-[#f0e9d8]/60">
              <a href="/birth-chart" className="lo-nav-link">Birth Chart</a>
              <a href="/horoscope" className="lo-nav-link">Horoscopes</a>
              <a href="/tarot" className="lo-nav-link">Tarot</a>
              <a href="/pricing" className="lo-nav-link">Pricing</a>
            </nav>
          </div>
          <p className="mt-8 text-[10px] uppercase tracking-[0.18em] text-[#f0e9d8]/30">&copy; 2026 Astro Scope</p>
        </div>
      </footer>
    </div>
  );
}
