// LANDING / VOLVELLE — a design exploration of the production landing in the
// "Layered Paper Instrument" language of src/components/cards/volvelle.tsx:
// aged parchment, sepia ink, brass brads, stacked paper discs with cut-out
// windows, everything pinned, threaded and folded like a medieval instrument
// spread on a writing desk. Fully self-contained: inline SVG, Tailwind for
// layout, one scoped <style> block (lvol- prefixed) for the rest.
// Server-component safe: no hooks, CSS animations only, statically prerendered.

import type { Metadata } from "next";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Astro Scope — Turn the wheel. The heavens answer.",
  description:
    "Free birth chart, daily horoscopes, synastry and tarot — paper instruments for reading the sky.",
};

const DEG = Math.PI / 180;

// the deck's paper palette (variant 0 of the volvelle cards)
const INK = "#3a2a1c";
const INK_DARK = "#2c1d12";
const RUBRIC = "#a32c1e";
const GOLD = "#c9a227";
const PAPER = "#f4ecd2";

// radial tick marks: n spokes from rIn to rOut around (cx, cy)
function ringTicks(cx: number, cy: number, rIn: number, rOut: number, n: number, offset = 0) {
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

// annular sector path between angles a0..a1 (0 = east, clockwise), the shape
// of a window cut through a paper disc
function sectorPath(cx: number, cy: number, rIn: number, rOut: number, a0: number, a1: number) {
  const p = (r: number, a: number) => [+(cx + r * Math.cos(a * DEG)).toFixed(2), +(cy + r * Math.sin(a * DEG)).toFixed(2)];
  const [x0, y0] = p(rOut, a0);
  const [x1, y1] = p(rOut, a1);
  const [x2, y2] = p(rIn, a1);
  const [x3, y3] = p(rIn, a0);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${x0} ${y0} A ${rOut} ${rOut} 0 ${large} 1 ${x1} ${y1} L ${x2} ${y2} A ${rIn} ${rIn} 0 ${large} 0 ${x3} ${y3} Z`;
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

function toRoman(n: number): string {
  let rest = Math.max(1, Math.round(n));
  let out = "";
  const table: Array<[number, string]> = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  for (const [v, s] of table) {
    while (rest >= v) {
      out += s;
      rest -= v;
    }
  }
  return out;
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
const PLANETS = ["☉︎", "☽︎", "☿︎", "♀︎", "♂︎", "♃︎", "♄︎"];
const ROMAN = ["I", "II", "III", "IIII", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
const GLYPH_FONT = "'DejaVu Sans', 'Segoe UI Symbol', Georgia, serif";

/* ============================== HERO VOLVELLE ============================= */

const HC = 240; // hero axis (viewBox 0 0 480 480)
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const HERO_WINDOW = sectorPath(HC, HC, 108, 124, -16, 16); // reveals the planet ring
const HERO_PEEP = { x: HC, y: HC - 46, r: 9 }; // small round peep window

function HeroVolvelle() {
  return (
    <svg
      viewBox="0 0 480 480"
      className="h-auto w-full"
      role="img"
      aria-label="A paper volvelle: two parchment discs pinned with a brass brad, the top disc turning to reveal scales through a cut-out window"
    >
      {/* soft desk shadow beneath the whole instrument */}
      <ellipse cx={HC + 4} cy="452" rx="192" ry="17" fill={INK_DARK} opacity="0.2" filter="url(#lvol-g-blur)" />

      {/* ============ fixed base disc ============ */}
      <g className="lvol-fade" style={{ "--d": ".15s" } as CSSProperties}>
        <circle cx={HC} cy={HC} r="205" fill="url(#lvol-g-paper)" stroke={INK} strokeWidth="1.8" />
        {/* outer scale: 24 hour marks + roman numerals */}
        <circle cx={HC} cy={HC} r="174" fill="none" stroke={INK} strokeWidth="0.9" />
        {HOURS.map((h) => (
          <g key={h} transform={`rotate(${h * 15} ${HC} ${HC})`}>
            <line
              x1={HC}
              y1={HC - 205}
              x2={HC}
              y2={HC - (h % 6 === 0 ? 190 : 198)}
              stroke={INK}
              strokeWidth={h % 6 === 0 ? 1.3 : 0.55}
            />
            <text
              x={HC}
              y={HC - 179}
              textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontSize="8.5"
              fill={INK}
            >
              {ROMAN[h % 12]}
            </text>
          </g>
        ))}
        {/* middle band: 12 zodiac panels */}
        <circle cx={HC} cy={HC} r="168" fill="none" stroke={INK} strokeWidth="1.1" />
        <circle cx={HC} cy={HC} r="146" fill="none" stroke={INK} strokeWidth="0.8" />
        {ZODIAC.map((g, i) => (
          <g key={g} transform={`rotate(${i * 30} ${HC} ${HC})`}>
            <line x1={HC} y1={HC - 168} x2={HC} y2={HC - 146} stroke={INK} strokeWidth="0.5" />
            <text
              x={HC}
              y={HC - 151}
              textAnchor="middle"
              fontFamily={GLYPH_FONT}
              fontSize="13"
              fill={i % 2 === 0 ? RUBRIC : INK}
              transform={`rotate(15 ${HC} ${HC})`}
            >
              {g}
            </text>
          </g>
        ))}
        {/* inner planetary scale — the ring the main window reveals */}
        <circle cx={HC} cy={HC} r="128" fill="none" stroke={INK} strokeWidth="0.6" />
        <circle cx={HC} cy={HC} r="104" fill="none" stroke={INK} strokeWidth="0.6" />
        {PLANETS.map((p, i) => (
          <g key={p} transform={`rotate(${i * (360 / 7) + 10} ${HC} ${HC})`}>
            <text x={HC} y={HC - 112} textAnchor="middle" fontFamily={GLYPH_FONT} fontSize="11" fill={i % 2 === 0 ? INK : RUBRIC}>
              {p}
            </text>
          </g>
        ))}
        {/* a gold leaf mark waiting under the window */}
        <path d={starN(HC + 116, HC, 4, 6, 2.2)} fill={GOLD} stroke={INK_DARK} strokeWidth="0.6" />
        {/* inner construction rings + the sun under the peep window */}
        <circle cx={HC} cy={HC} r="70" fill="none" stroke={INK} strokeWidth="0.5" opacity="0.6" />
        <circle cx={HC} cy={HC} r="34" fill="none" stroke={INK} strokeWidth="0.6" opacity="0.7" />
        {ringTicks(HC, HC, 56, 58, 12).map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={INK} strokeWidth="0.5" opacity="0.55" />
        ))}
        <text x={HERO_PEEP.x} y={HERO_PEEP.y + 4} textAnchor="middle" fontFamily={GLYPH_FONT} fontSize="11" fill={RUBRIC}>
          ☉︎
        </text>
      </g>

      {/* paper shadow cast by the top disc onto the base */}
      <circle cx={HC + 3} cy={HC + 5} r="140" fill={INK_DARK} opacity="0.22" filter="url(#lvol-g-blur)" />

      {/* ============ oscillating top disc ============ */}
      <g className="lvol-disc-in">
        <g className="lvol-turn" style={{ "--o": "240px 240px", "--t": "46s", "--a": "3.4deg" } as CSSProperties}>
          <mask id="lvol-hero-mask" maskUnits="userSpaceOnUse" x="90" y="90" width="300" height="300">
            <circle cx={HC} cy={HC} r="140" fill="#ffffff" />
            <path d={HERO_WINDOW} fill="#000000" />
            <circle cx={HERO_PEEP.x} cy={HERO_PEEP.y} r={HERO_PEEP.r} fill="#000000" />
          </mask>
          <g mask="url(#lvol-hero-mask)">
            <circle cx={HC} cy={HC} r="140" fill="url(#lvol-g-paper-hi)" />
            <circle cx={HC} cy={HC} r="96" fill="none" stroke={INK} strokeWidth="0.7" />
            <circle cx={HC} cy={HC} r="80" fill="none" stroke={INK} strokeWidth="0.5" strokeDasharray="1.5 3" opacity="0.8" />
            {ringTicks(HC, HC, 88, 88, 12).map((t, i) => (
              <circle key={i} cx={t.x1} cy={t.y1} r="1.1" fill={INK} opacity="0.75" />
            ))}
            <text
              x={HC}
              y={HC + 68}
              textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontStyle="italic"
              fontSize="8"
              letterSpacing="2"
              fill={INK}
              opacity="0.85"
            >
              · volvella ·
            </text>
          </g>
          {/* disc edge + cut edges of both windows */}
          <circle cx={HC} cy={HC} r="140" fill="none" stroke={INK} strokeWidth="1.5" />
          <path d={HERO_WINDOW} fill="none" stroke={INK} strokeWidth="0.9" />
          <circle cx={HERO_PEEP.x} cy={HERO_PEEP.y} r={HERO_PEEP.r} fill="none" stroke={INK} strokeWidth="0.9" />
          {/* pointer arm aimed at the top of the scale */}
          <path d={`M ${HC - 4} ${HC + 6} L ${HC} ${HC - 132} L ${HC + 4} ${HC + 6} Z`} fill={INK_DARK} opacity="0.85" />
          <path d={`M ${HC} ${HC - 132} L ${HC + 2.4} ${HC - 120} L ${HC - 2.4} ${HC - 120} Z`} fill={GOLD} stroke={INK_DARK} strokeWidth="0.6" />
          <line x1={HC} y1={HC + 6} x2={HC} y2={HC + 22} stroke={INK_DARK} strokeWidth="1.6" />
        </g>
      </g>

      {/* brass brad pinning both discs, with a travelling gleam */}
      <g>
        <circle cx={HC} cy={HC} r="9" fill="url(#lvol-g-brass)" stroke={INK_DARK} strokeWidth="0.9" />
        <line x1={HC - 5.5} y1={HC} x2={HC + 5.5} y2={HC} stroke={INK_DARK} strokeWidth="0.8" opacity="0.7" />
        <ellipse className="lvol-gleam" cx={HC - 2.6} cy={HC - 2.9} rx="2.4" ry="1.5" fill="#fff6d8" />
      </g>

      {/* a paper tag tied to the instrument, swaying on its thread */}
      <g className="lvol-fade" style={{ "--d": ".8s" } as CSSProperties}>
        <g className="lvol-sway" style={{ "--o": "438px 96px", "--t": "26s", "--a": "1.6deg" } as CSSProperties}>
          <line x1="438" y1="60" x2="438" y2="96" stroke={INK} strokeWidth="0.8" opacity="0.7" />
          <circle cx="438" cy="60" r="2.2" fill="none" stroke={INK} strokeWidth="0.8" />
          <g transform="rotate(6 438 116)">
            <rect x="412" y="96" width="52" height="40" rx="2.5" fill={PAPER} stroke={INK} strokeWidth="1" />
            <circle cx="438" cy="104" r="3" fill="none" stroke={INK} strokeWidth="0.8" />
            <text x="438" y="124" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontStyle="italic" fontSize="10" fill={RUBRIC}>
              fig. IX
            </text>
            <text x="438" y="132" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="5.5" letterSpacing="1.4" fill={INK} opacity="0.7">
              CAELI
            </text>
          </g>
        </g>
      </g>
    </svg>
  );
}

/* ======================== PANEL PAPER MECHANISMS ========================== */
// all 120×120, all ambient motion is CSS (classes from the lvol- block)

// BIRTH CHART — a miniature volvelle: top disc turning over a zodiac base
function MechBirthChart() {
  const win = sectorPath(60, 62, 17, 24, -22, 22);
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="A small paper volvelle with a turning top disc">
      <circle cx="60" cy="62" r="50" fill="url(#lvol-g-paper)" stroke={INK} strokeWidth="1.3" />
      <circle cx="60" cy="62" r="33" fill="none" stroke={INK} strokeWidth="0.6" />
      {ringTicks(60, 62, 44, 50, 12).map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={INK} strokeWidth="0.6" />
      ))}
      {ZODIAC.map((g, i) => {
        const t = (i * 30 - 90 + 15) * DEG;
        return (
          <text
            key={g}
            x={60 + 39 * Math.cos(t)}
            y={62 + 39 * Math.sin(t) + 2.2}
            textAnchor="middle"
            fontFamily={GLYPH_FONT}
            fontSize="6.5"
            fill={i % 2 === 0 ? RUBRIC : INK}
          >
            {g}
          </text>
        );
      })}
      {/* rubric moon seated under the window */}
      <text x="80.5" y="65" textAnchor="middle" fontFamily={GLYPH_FONT} fontSize="7" fill={RUBRIC}>
        ☽︎
      </text>
      <circle cx="63" cy="65" r="26" fill={INK_DARK} opacity="0.2" filter="url(#lvol-g-blur)" />
      <g className="lvol-turn" style={{ "--o": "60px 62px", "--t": "34s", "--a": "8deg" } as CSSProperties}>
        <mask id="lvol-mini-mask" maskUnits="userSpaceOnUse" x="30" y="32" width="60" height="60">
          <circle cx="60" cy="62" r="26" fill="#ffffff" />
          <path d={win} fill="#000000" />
        </mask>
        <g mask="url(#lvol-mini-mask)">
          <circle cx="60" cy="62" r="26" fill="url(#lvol-g-paper-hi)" />
          <circle cx="60" cy="62" r="14" fill="none" stroke={INK} strokeWidth="0.5" opacity="0.8" />
        </g>
        <circle cx="60" cy="62" r="26" fill="none" stroke={INK} strokeWidth="1.1" />
        <path d={win} fill="none" stroke={INK} strokeWidth="0.7" />
        <path d="M 58 63 L 60 40 L 62 63 Z" fill={INK_DARK} opacity="0.85" />
      </g>
      <circle cx="60" cy="62" r="4" fill="url(#lvol-g-brass)" stroke={INK_DARK} strokeWidth="0.7" />
      <ellipse className="lvol-gleam" cx="58.8" cy="60.8" rx="1.1" ry="0.7" fill="#fff6d8" />
    </svg>
  );
}

// DAILY HOROSCOPE — a sliding paper strip behind a slot in the frame
function MechHoroscope() {
  const stripGlyphs = ["☉︎", "☽︎", "☿︎", "♀︎", "♂︎", "♃︎", "♄︎", "☉︎", "☽︎"];
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="A paper frame with a sliding strip of day symbols behind a slot">
      <defs>
        <clipPath id="lvol-slot">
          <rect x="20" y="48" width="80" height="24" rx="2" />
        </clipPath>
      </defs>
      <rect x="10" y="30" width="100" height="62" rx="3" fill="url(#lvol-g-paper)" stroke={INK} strokeWidth="1.2" />
      {/* the sliding strip, visible only through the slot */}
      <g clipPath="url(#lvol-slot)">
        <g className="lvol-slide" style={{ "--t": "32s" } as CSSProperties}>
          <rect x="20" y="48" width="200" height="24" fill="#e9dcba" />
          {stripGlyphs.map((g, i) => (
            <g key={i}>
              <text x={34 + i * 22} y="64" textAnchor="middle" fontFamily={GLYPH_FONT} fontSize="10" fill={i % 2 === 0 ? RUBRIC : INK}>
                {g}
              </text>
              {i > 0 && <line x1={23 + i * 22} y1="50" x2={23 + i * 22} y2="70" stroke={INK} strokeWidth="0.4" opacity="0.5" />}
            </g>
          ))}
        </g>
      </g>
      <rect x="20" y="48" width="80" height="24" rx="2" fill="none" stroke={INK} strokeWidth="1" />
      {/* pointer + ruler ticks below the slot */}
      <path d="M 60 44 L 62.4 48 L 57.6 48 Z" fill={RUBRIC} stroke={INK_DARK} strokeWidth="0.5" />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={24 + i * 9} y1="82" x2={24 + i * 9} y2={i % 4 === 0 ? 78 : 80} stroke={INK} strokeWidth="0.5" opacity="0.7" />
      ))}
      <text x="60" y="41" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontStyle="italic" fontSize="6.5" letterSpacing="1.5" fill={INK} opacity="0.8">
        hodie
      </text>
      {/* two brass brads pinning the frame */}
      {[24, 96].map((x) => (
        <g key={x}>
          <circle cx={x} cy="38" r="3" fill="url(#lvol-g-brass)" stroke={INK_DARK} strokeWidth="0.6" />
          <ellipse className="lvol-gleam" cx={x - 0.8} cy="37" rx="0.8" ry="0.5" fill="#fff6d8" />
        </g>
      ))}
    </svg>
  );
}

// COMPATIBILITY — two paper discs lapped together, turning against each other
function MechCompatibility() {
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="Two overlapping paper discs pinned with one brad, turning in opposite directions">
      <circle cx="46" cy="65" r="25" fill={INK_DARK} opacity="0.16" filter="url(#lvol-g-blur)" />
      <circle cx="76" cy="68" r="25" fill={INK_DARK} opacity="0.2" filter="url(#lvol-g-blur)" />
      <g className="lvol-spin" style={{ "--o": "44px 62px", "--t": "66s" } as CSSProperties}>
        <circle cx="44" cy="62" r="25" fill="url(#lvol-g-paper)" stroke={INK} strokeWidth="1.1" />
        <circle cx="44" cy="62" r="18" fill="none" stroke={INK} strokeWidth="0.5" strokeDasharray="1.5 2.5" />
        {[0, 120, 240].map((a) => (
          <text
            key={a}
            x={44 + 21 * Math.cos((a - 90) * DEG)}
            y={62 + 21 * Math.sin((a - 90) * DEG) + 2.2}
            textAnchor="middle"
            fontFamily={GLYPH_FONT}
            fontSize="6.5"
            fill={INK}
          >
            ♀︎
          </text>
        ))}
        <circle cx="44" cy="62" r="2.4" fill="url(#lvol-g-brass)" stroke={INK_DARK} strokeWidth="0.6" />
      </g>
      <g className="lvol-spin-rev" style={{ "--o": "76px 62px", "--t": "54s" } as CSSProperties}>
        <circle cx="76" cy="62" r="25" fill="url(#lvol-g-paper-hi)" stroke={INK} strokeWidth="1.1" />
        <circle cx="76" cy="62" r="18" fill="none" stroke={INK} strokeWidth="0.5" strokeDasharray="1.5 2.5" />
        {[60, 180, 300].map((a) => (
          <text
            key={a}
            x={76 + 21 * Math.cos((a - 90) * DEG)}
            y={62 + 21 * Math.sin((a - 90) * DEG) + 2.2}
            textAnchor="middle"
            fontFamily={GLYPH_FONT}
            fontSize="6.5"
            fill={RUBRIC}
          >
            ♂︎
          </text>
        ))}
        <circle cx="76" cy="62" r="2.4" fill="url(#lvol-g-brass)" stroke={INK_DARK} strokeWidth="0.6" />
      </g>
      {/* the shared brad at the lap, plus a faint heart scored above it */}
      <circle cx="60" cy="62" r="3.6" fill="url(#lvol-g-brass)" stroke={INK_DARK} strokeWidth="0.7" />
      <ellipse className="lvol-gleam" cx="59" cy="61" rx="1" ry="0.6" fill="#fff6d8" />
      <path
        d="M 60 34 C 56 28 48 30 50 36 C 51.4 40 56 42.5 60 46 C 64 42.5 68.6 40 70 36 C 72 30 64 28 60 34 Z"
        fill="none"
        stroke={RUBRIC}
        strokeWidth="0.9"
        opacity="0.85"
      />
    </svg>
  );
}

// TAROT — a folded paper flap that slowly lifts to reveal the card beneath
function MechTarot() {
  return (
    <div className="lvol-flap-scene relative mx-auto h-[120px] w-[120px]" role="img" aria-label="A folded paper flap lifting to reveal a tarot card">
      {/* base sheet with the hidden card */}
      <div className="lvol-paper absolute inset-x-2 bottom-2 top-4 rounded-[3px]">
        <div className="absolute inset-x-5 bottom-3 top-6 flex flex-col items-center justify-center border border-[#3a2a1c]/70 bg-[#efe3c2]">
          <span className="text-[20px] leading-none text-[#a32c1e]">✶</span>
          <span className="mt-1.5 font-serif text-[7px] uppercase tracking-[0.3em] text-[#3a2a1c]/80">arcanum</span>
        </div>
      </div>
      {/* the hinged flap itself */}
      <div className="lvol-flap absolute inset-x-2 top-4 h-[58px] origin-top rounded-[3px]">
        <div className="flex h-full flex-col items-center justify-center border border-[#3a2a1c]/80 bg-[#f4ecd2] shadow-[0_10px_14px_-6px_rgba(44,29,18,.45)]">
          <span className="font-serif text-[8px] uppercase tracking-[0.34em] text-[#3a2a1c]/85">tabula</span>
          <span className="mt-1 text-[12px] leading-none text-[#c9a227]">✶</span>
          <span className="mt-1 h-px w-10 bg-[#3a2a1c]/40" />
        </div>
      </div>
      {/* hinge pins */}
      <span className="lvol-brad absolute left-[26px] top-[11px]" aria-hidden="true" />
      <span className="lvol-brad absolute right-[26px] top-[11px]" aria-hidden="true" />
    </div>
  );
}

// PSYCHOLOGY — a paper temperament gauge with an oscillating needle
function MechPsychology() {
  const angles = [-60, -30, 0, 30, 60];
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="A semicircular paper gauge with a slowly swinging needle">
      <path d="M 16 88 A 44 44 0 0 1 104 88 L 96 88 A 36 36 0 0 0 24 88 Z" fill="url(#lvol-g-paper)" stroke={INK} strokeWidth="1" />
      {angles.map((a, i) => {
        const t = (a - 90) * DEG;
        const x1 = 60 + 38 * Math.cos(t);
        const y1 = 88 + 38 * Math.sin(t);
        const x2 = 60 + 32 * Math.cos(t);
        const y2 = 88 + 32 * Math.sin(t);
        return (
          <g key={a}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={i === 2 ? 1 : 0.5} />
            <circle cx={60 + 27 * Math.cos(t)} cy={88 + 27 * Math.sin(t)} r={i === 2 ? 1.4 : 0.9} fill={i === 2 ? RUBRIC : INK} opacity="0.8" />
          </g>
        );
      })}
      <text x="60" y="102" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontStyle="italic" fontSize="6.5" letterSpacing="1.5" fill={INK} opacity="0.8">
        animus
      </text>
      <g className="lvol-needle" style={{ "--o": "60px 88px", "--t": "24s", "--a": "34deg" } as CSSProperties}>
        <path d="M 58.4 88 L 60 50 L 61.6 88 Z" fill={INK_DARK} opacity="0.9" />
        <path d="M 60 50 L 61.4 56 L 58.6 56 Z" fill={RUBRIC} />
      </g>
      <circle cx="60" cy="88" r="4.4" fill="url(#lvol-g-brass)" stroke={INK_DARK} strokeWidth="0.7" />
      <ellipse className="lvol-gleam" cx="58.7" cy="86.7" rx="1.2" ry="0.75" fill="#fff6d8" />
      <line x1="16" y1="88" x2="104" y2="88" stroke={INK} strokeWidth="1" />
    </svg>
  );
}

// COSMIC PASSPORT — a paper booklet with a slowly turning stamped seal
function MechPassport() {
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="A paper passport booklet with a rotating circular seal stamp">
      <defs>
        <path id="lvol-seal-circ" d="M 42 52 A 18 18 0 1 1 78 52 A 18 18 0 1 1 42 52" fill="none" />
      </defs>
      <rect x="20" y="26" width="80" height="72" rx="3" fill={INK_DARK} opacity="0.15" filter="url(#lvol-g-blur)" />
      <rect x="18" y="24" width="80" height="72" rx="3" fill="url(#lvol-g-paper)" stroke={INK} strokeWidth="1.2" />
      <rect x="22" y="28" width="72" height="64" rx="2" fill="none" stroke={INK} strokeWidth="0.45" opacity="0.7" />
      {/* the seal: inscription ring turning over 80s */}
      <circle cx="60" cy="52" r="23" fill="none" stroke={RUBRIC} strokeWidth="0.7" opacity="0.8" />
      <g className="lvol-spin" style={{ "--o": "60px 52px", "--t": "80s" } as CSSProperties}>
        <text fontFamily="Georgia, 'Times New Roman', serif" fontSize="5.5" letterSpacing="1.2" fill={RUBRIC} opacity="0.9">
          <textPath href="#lvol-seal-circ">ASTRO SCOPE · COSMIC PASSPORT · ONE SKY ·</textPath>
        </text>
      </g>
      <path d={starN(60, 52, 8, 9, 3.6)} fill="none" stroke={RUBRIC} strokeWidth="1" strokeLinejoin="round" opacity="0.9" />
      <circle cx="60" cy="52" r="1.4" fill={RUBRIC} />
      {/* engraved lines below the seal */}
      <line x1="38" y1="80" x2="82" y2="80" stroke={INK} strokeWidth="0.6" opacity="0.8" />
      <line x1="44" y1="85" x2="76" y2="85" stroke={INK} strokeWidth="0.45" opacity="0.6" />
      {[27, 89].map((x) => (
        <circle key={x} cx={x} cy="33" r="2" fill="url(#lvol-g-brass)" stroke={INK_DARK} strokeWidth="0.5" />
      ))}
    </svg>
  );
}

/* ====================== DESTINY MATRIX — PAPER OCTAGRAM =================== */

const OCT_C = 160;
const OCT_R = 118;
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

function DestinyVolvelle() {
  return (
    <svg
      viewBox="0 0 320 320"
      className="h-auto w-full"
      role="img"
      aria-label="A paper octagram volvelle of the Destiny Matrix with a slowly rotating pointer"
    >
      <ellipse cx={OCT_C + 3} cy="308" rx="132" ry="10" fill={INK_DARK} opacity="0.18" filter="url(#lvol-g-blur)" />
      {/* base paper disc */}
      <circle cx={OCT_C} cy={OCT_C} r="148" fill="url(#lvol-g-paper)" stroke={INK} strokeWidth="1.5" />
      <circle cx={OCT_C} cy={OCT_C} r="138" fill="none" stroke={INK} strokeWidth="0.5" opacity="0.7" />
      {ringTicks(OCT_C, OCT_C, 143, 148, 48).map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={INK} strokeWidth={i % 6 === 0 ? 0.9 : 0.4} opacity="0.8" />
      ))}
      {/* spokes from the heart to each vertex */}
      {OCT_PTS.map((p, i) => (
        <line key={i} x1={OCT_C} y1={OCT_C} x2={p.x} y2={p.y} stroke={INK} strokeWidth="0.45" opacity="0.6" />
      ))}
      {/* the octagram: two overlaid squares, one in rubric */}
      <polygon points={OCT_SQUARE_A.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={INK} strokeWidth="0.9" />
      <polygon points={OCT_SQUARE_B.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={RUBRIC} strokeWidth="0.9" opacity="0.9" />
      {/* vertex seals with arcana numbers */}
      {OCT_PTS.map((p, i) => {
        const t = (i * 45 - 90) * DEG;
        const lx = OCT_C + (OCT_R + 20) * Math.cos(t);
        const ly = OCT_C + (OCT_R + 20) * Math.sin(t);
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="8" fill={PAPER} stroke={INK} strokeWidth="0.9" />
            <text x={p.x} y={p.y + 2.4} textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="700" fontSize="7.5" fill={i % 2 === 0 ? INK_DARK : RUBRIC}>
              {OCT_NODES[i].n}
            </text>
            <text x={lx.toFixed(1)} y={(ly + 2.5).toFixed(1)} textAnchor="middle" fontSize="6.5" letterSpacing="1.4" fill={INK} opacity="0.85">
              {OCT_NODES[i].label}
            </text>
          </g>
        );
      })}
      {/* rotating paper pointer pinned at the heart */}
      <g className="lvol-spin" style={{ "--o": "160px 160px", "--t": "150s" } as CSSProperties}>
        <path d="M 157 162 L 160 44 L 163 162 Z" fill={INK_DARK} opacity="0.9" />
        <path d="M 160 44 L 162.6 56 L 157.4 56 Z" fill={GOLD} stroke={INK_DARK} strokeWidth="0.5" />
        <line x1="160" y1="162" x2="160" y2="178" stroke={INK_DARK} strokeWidth="1.4" />
      </g>
      <circle cx={OCT_C} cy={OCT_C} r="7.5" fill="url(#lvol-g-brass)" stroke={INK_DARK} strokeWidth="0.8" />
      <line x1={OCT_C - 4.6} y1={OCT_C} x2={OCT_C + 4.6} y2={OCT_C} stroke={INK_DARK} strokeWidth="0.7" opacity="0.7" />
      <ellipse className="lvol-gleam" cx={OCT_C - 2.2} cy={OCT_C - 2.4} rx="2" ry="1.2" fill="#fff6d8" />
    </svg>
  );
}

/* ================================ CONTENT ================================= */

const PANELS = [
  {
    tag: "FREE",
    title: "Birth Chart",
    desc: "Map your Sun, Moon, and Rising — the foundation of every reading.",
    href: "/birth-chart",
    mech: <MechBirthChart />,
    cls: "md:col-span-2 xl:col-span-5 xl:rotate-[-1.6deg] xl:z-10",
    featured: true,
  },
  {
    tag: "DAILY",
    title: "Daily Horoscope",
    desc: "Twelve signs, one sky. Clear forecasts without the fluff.",
    href: "/horoscope",
    mech: <MechHoroscope />,
    cls: "xl:col-span-4 xl:mt-12 xl:rotate-[1.3deg] xl:z-20",
    featured: false,
  },
  {
    tag: "SYNASTRY",
    title: "Compatibility",
    desc: "Zodiac match, Chinese pairs, and deep synastry for two charts.",
    href: "/compatibility",
    mech: <MechCompatibility />,
    cls: "xl:col-span-3 xl:mt-28 xl:-ml-3 xl:rotate-[-0.9deg] xl:z-30",
    featured: false,
  },
  {
    tag: "SPREADS",
    title: "Tarot",
    desc: "Daily card to Celtic Cross — pull, reflect, get a full reading.",
    href: "/tarot",
    mech: <MechTarot />,
    cls: "xl:col-span-4 xl:-mt-8 xl:ml-4 xl:rotate-[1.5deg] xl:z-40",
    featured: false,
  },
  {
    tag: "TESTS",
    title: "Psychology",
    desc: "MBTI, Big Five, empathy and more — meet yourself beyond the signs.",
    href: "/psychology",
    mech: <MechPsychology />,
    cls: "xl:col-span-4 xl:mt-6 xl:-ml-2 xl:rotate-[-1.2deg] xl:z-50",
    featured: false,
  },
  {
    tag: "YOU",
    title: "Cosmic Passport",
    desc: "Your Cosmic ID, people, journal, and Premium deep dives — one hub.",
    href: "/passport",
    mech: <MechPassport />,
    cls: "xl:col-span-4 xl:mt-16 xl:rotate-[1.1deg] xl:z-[60]",
    featured: false,
  },
];

const FAQS = [
  {
    q: "What can I do on Astro Scope for free?",
    a: "Cast a free birth chart, read daily horoscopes for all twelve signs, pull tarot spreads, run compatibility and psychology tests — no account.",
  },
  {
    q: "How do I get my free birth chart?",
    a: "Open the calculator, enter birth date, time and place, generate — your wheel in seconds.",
  },
  {
    q: "Where are daily horoscopes?",
    a: "Every sign from the homepage grid or the Horoscopes hub.",
  },
  {
    q: "What is the Destiny Matrix?",
    a: "Optional birth-date octagram mapping purpose, love, money and age themes.",
  },
];

/* ================================= PAGE ================================== */

export default function VolvelleLanding() {
  return (
    <div className="lvol-root relative isolate min-h-screen">
      <style>{`
        .lvol-root {
          background: #d3c193;
          color: #2c1d12;
          font-family: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
        }
        .lvol-root ::selection { background: rgba(163,44,30,.22); color: #2c1d12; }
        .lvol-serif { font-family: Georgia, 'Times New Roman', serif; }
        .lvol-rule { height: 1px; background: linear-gradient(90deg, transparent, rgba(58,42,28,.5), transparent); }

        /* buttons — waxed ink seal vs. pinned paper slip */
        .lvol-btn-primary {
          display: inline-block;
          background: linear-gradient(180deg, #42301c 0%, #2c1d12 70%);
          color: #f4ecd2;
          border: 1px solid #1c110a;
          box-shadow: inset 0 1px 0 rgba(244,236,210,.22), 0 3px 0 rgba(28,17,10,.55), 0 14px 26px -12px rgba(44,29,18,.55);
          transition: transform .3s ease, box-shadow .3s ease, filter .3s ease;
        }
        .lvol-btn-primary:hover { filter: brightness(1.12); transform: translateY(-1px); box-shadow: inset 0 1px 0 rgba(244,236,210,.22), 0 4px 0 rgba(28,17,10,.55), 0 18px 30px -12px rgba(44,29,18,.6); }
        .lvol-btn-ghost {
          display: inline-block;
          border: 1px solid rgba(58,42,28,.55);
          color: #3a2a1c;
          background: rgba(244,236,210,.4);
          box-shadow: 0 2px 6px -2px rgba(44,29,18,.25);
          transition: border-color .3s ease, background .3s ease, transform .3s ease;
        }
        .lvol-btn-ghost:hover { border-color: rgba(163,44,30,.7); background: rgba(244,236,210,.75); transform: translateY(-1px); }

        /* layered paper plates */
        .lvol-paper {
          background: linear-gradient(160deg, #f6eed6 0%, #f0e6cc 55%, #e6d7b0 100%);
          border: 1px solid rgba(58,42,28,.55);
          box-shadow: 0 1px 2px rgba(44,29,18,.16), 0 14px 26px -12px rgba(44,29,18,.38);
        }
        .lvol-panel { transition: transform .5s cubic-bezier(.22,.7,.3,1), box-shadow .5s ease; }
        .lvol-panel:hover { transform: translateY(-5px) rotate(0deg); box-shadow: 0 2px 3px rgba(44,29,18,.14), 0 26px 44px -16px rgba(44,29,18,.5); }
        .lvol-tag {
          display: inline-block;
          border: 1px solid rgba(58,42,28,.5);
          color: #a32c1e;
          background: rgba(244,236,210,.6);
          letter-spacing: .26em;
          box-shadow: 0 1px 2px rgba(44,29,18,.15);
        }
        .lvol-link { color: #a32c1e; transition: color .3s ease, letter-spacing .3s ease; }
        .lvol-panel:hover .lvol-link { color: #7e1f14; }
        .lvol-chip {
          display: inline-flex; align-items: center; gap: .5em;
          border: 1px solid rgba(58,42,28,.45);
          background: rgba(244,236,210,.65);
          color: #3a2a1c;
          letter-spacing: .1em;
          box-shadow: 0 1px 2px rgba(44,29,18,.14);
        }
        .lvol-field { border: 1px dashed rgba(58,42,28,.5); background: rgba(255,250,232,.5); }
        .lvol-brad {
          position: absolute; width: 8px; height: 8px; border-radius: 9999px;
          border: 1px solid rgba(44,29,18,.7);
          background: radial-gradient(circle at 35% 30%, #f3dc8e 0%, #c9a227 48%, #7c5f14 100%);
          box-shadow: 0 1px 2px rgba(44,29,18,.4);
        }

        /* sign tabs — punched paper labels strung on a hairline */
        .lvol-tab {
          position: relative;
          transform: rotate(var(--tr, 0deg));
          transform-origin: 50% 6px;
          animation: lvol-sway var(--t, 24s) ease-in-out infinite alternate;
          animation-delay: var(--d, 0s);
          transition: box-shadow .35s ease;
        }
        .lvol-tab:hover { animation-play-state: paused; }
        .lvol-tab-card { transition: box-shadow .35s ease, background .35s ease; }
        .lvol-tab:hover .lvol-tab-card { box-shadow: 0 2px 3px rgba(44,29,18,.16), 0 18px 30px -12px rgba(44,29,18,.5); background: #f8f0da; }

        /* folded faq notes with deckle edges */
        .lvol-note {
          clip-path: polygon(1.5% 0.5%, 30% 0%, 62% 1%, 98.5% 0%, 100% 4%, 99.2% 47%, 100% 96.5%, 97% 100%, 55% 99.2%, 22% 100%, 0.5% 99%, 0% 52%, 0.8% 8%);
          filter: drop-shadow(0 14px 18px rgba(44,29,18,.28));
          transition: transform .5s cubic-bezier(.22,.7,.3,1), filter .5s ease;
        }
        .lvol-note:hover { transform: translateY(-4px) rotate(0deg); filter: drop-shadow(0 22px 26px rgba(44,29,18,.34)); }
        .lvol-note-inner { background: linear-gradient(165deg, #f7efda 0%, #f0e6cc 60%, #e9dab4 100%); }
        .lvol-tape {
          background: linear-gradient(180deg, rgba(233,222,190,.85), rgba(214,198,158,.8));
          border-left: 1px dashed rgba(58,42,28,.3);
          border-right: 1px dashed rgba(58,42,28,.3);
          box-shadow: 0 2px 4px rgba(44,29,18,.2);
        }

        /* tarot flap scene — the only 3d trick on the page */
        .lvol-flap-scene { perspective: 520px; }
        .lvol-flap { transform-style: preserve-3d; animation: lvol-flap 36s ease-in-out infinite alternate; }
        @keyframes lvol-flap { 0%, 18% { transform: rotateX(0deg); } 82%, 100% { transform: rotateX(-52deg); } }

        /* load choreography: sheets settle onto the desk */
        .lvol-rise { animation: lvol-rise .9s cubic-bezier(.22,.7,.3,1) backwards; animation-delay: var(--d, 0s); }
        .lvol-fade { animation: lvol-fade-in 1s ease-out backwards; animation-delay: var(--d, 0s); }
        .lvol-disc-in {
          transform-box: view-box; transform-origin: 240px 240px;
          animation: lvol-disc-in 1.3s cubic-bezier(.3,.9,.35,1) .2s backwards;
        }
        @keyframes lvol-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes lvol-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lvol-disc-in {
          0% { opacity: 0; transform: rotate(-34deg); }
          30% { opacity: 1; }
          62% { transform: rotate(2deg); }
          82% { transform: rotate(-0.8deg); }
          100% { opacity: 1; transform: rotate(0deg); }
        }

        /* ambient motion — all slow, all restrained */
        .lvol-turn  { transform-box: view-box; transform-origin: var(--o, 60px 60px); animation: lvol-turn var(--t, 40s) ease-in-out infinite alternate; }
        .lvol-needle { transform-box: view-box; transform-origin: var(--o, 60px 88px); animation: lvol-turn var(--t, 24s) ease-in-out infinite alternate; }
        .lvol-sway { transform-box: view-box; transform-origin: var(--o, 50% 6px); animation: lvol-sway-svg var(--t, 26s) ease-in-out infinite alternate; }
        .lvol-spin { transform-box: view-box; transform-origin: var(--o, 60px 60px); animation: lvol-spin var(--t, 60s) linear infinite; }
        .lvol-spin-rev { transform-box: view-box; transform-origin: var(--o, 60px 60px); animation: lvol-spin-rev var(--t, 60s) linear infinite; }
        .lvol-slide { animation: lvol-slide var(--t, 32s) ease-in-out infinite alternate; }
        .lvol-gleam { animation: lvol-gleam 11s ease-in-out infinite; }
        .lvol-drift { animation: lvol-drift var(--t, 100s) ease-in-out infinite alternate; }

        @keyframes lvol-turn { from { transform: rotate(calc(var(--a, 3deg) * -1)); } to { transform: rotate(var(--a, 3deg)); } }
        @keyframes lvol-sway { from { transform: rotate(calc(var(--tr, 0deg) - 1.1deg)); } to { transform: rotate(calc(var(--tr, 0deg) + 1.1deg)); } }
        @keyframes lvol-sway-svg { from { transform: rotate(calc(var(--a, 1.5deg) * -1)); } to { transform: rotate(var(--a, 1.5deg)); } }
        @keyframes lvol-spin { to { transform: rotate(360deg); } }
        @keyframes lvol-spin-rev { to { transform: rotate(-360deg); } }
        @keyframes lvol-slide { from { transform: translateX(0); } to { transform: translateX(-72px); } }
        @keyframes lvol-gleam { 0%, 100% { opacity: .12; } 50% { opacity: .85; } }
        @keyframes lvol-drift { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(1.6%, -1.2%, 0); } }

        /* desk background */
        .lvol-bg {
          position: fixed; inset: 0; z-index: -1; overflow: hidden; pointer-events: none;
          background:
            radial-gradient(120% 85% at 50% -5%, #efe4c6 0%, #e0d1aa 52%, #c6b184 100%);
        }
        .lvol-bg::after {
          content: ""; position: absolute; inset: 0;
          background-image: repeating-linear-gradient(0deg, rgba(58,42,28,.045) 0 1px, transparent 1px 34px);
        }
        .lvol-stain { position: absolute; border-radius: 50%; filter: blur(30px); }

        @media (prefers-reduced-motion: reduce) {
          .lvol-rise, .lvol-fade, .lvol-disc-in, .lvol-turn, .lvol-needle,
          .lvol-sway, .lvol-spin, .lvol-spin-rev, .lvol-slide, .lvol-gleam,
          .lvol-drift, .lvol-flap, .lvol-tab {
            animation: none;
          }
        }
      `}</style>

      {/* desk background: parchment wash, faint ruled lines, drifting stains,
          and a giant faded chart stamp looming off the right edge */}
      <div className="lvol-bg" aria-hidden="true">
        <div className="lvol-stain lvol-drift" style={{ width: "42vmax", height: "30vmax", left: "-10vmax", top: "12%", background: "radial-gradient(circle, rgba(168,137,78,.20) 0%, transparent 65%)", "--t": "96s" } as CSSProperties} />
        <div className="lvol-stain lvol-drift" style={{ width: "36vmax", height: "26vmax", right: "-6vmax", top: "46%", background: "radial-gradient(circle, rgba(163,44,30,.08) 0%, transparent 65%)", "--t": "118s" } as CSSProperties} />
        <div className="lvol-stain lvol-drift" style={{ width: "50vmax", height: "34vmax", left: "30%", bottom: "-18vmax", background: "radial-gradient(circle, rgba(120,94,44,.16) 0%, transparent 65%)", "--t": "84s" } as CSSProperties} />
        <svg className="absolute -right-[24vmin] top-[8vmin] h-[110vmin] w-[110vmin] opacity-[.07]" viewBox="0 0 1000 1000">
          <g className="lvol-spin" style={{ "--o": "500px 500px", "--t": "150s" } as CSSProperties}>
            <circle cx="500" cy="500" r="470" fill="none" stroke={INK} strokeWidth="2" />
            <circle cx="500" cy="500" r="420" fill="none" stroke={INK} strokeWidth="1" />
            {ringTicks(500, 500, 448, 470, 72).map((t, i) => (
              <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={INK} strokeWidth={i % 6 === 0 ? 2 : 1} />
            ))}
            {ZODIAC.map((g, k) => {
              const t = (k * 30 - 90) * DEG;
              return (
                <text key={g} x={500 + 384 * Math.cos(t)} y={500 + 384 * Math.sin(t) + 18} textAnchor="middle" fontFamily={GLYPH_FONT} fontSize="52" fill={INK}>
                  {g}
                </text>
              );
            })}
          </g>
        </svg>
      </div>

      {/* shared defs: gradients + the paper-shadow blur, reused by every SVG */}
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="lvol-g-paper" cx="50%" cy="44%" r="68%">
            <stop offset="0%" stopColor="#f2e8ca" />
            <stop offset="75%" stopColor="#eadbb4" />
            <stop offset="100%" stopColor="#dcc99c" />
          </radialGradient>
          <radialGradient id="lvol-g-paper-hi" cx="50%" cy="44%" r="68%">
            <stop offset="0%" stopColor="#f8f0da" />
            <stop offset="80%" stopColor="#efe2bc" />
            <stop offset="100%" stopColor="#e2d0a2" />
          </radialGradient>
          <radialGradient id="lvol-g-brass" cx="38%" cy="34%" r="75%">
            <stop offset="0%" stopColor="#f3dc8e" />
            <stop offset="55%" stopColor="#c9a227" />
            <stop offset="100%" stopColor="#7c5f14" />
          </radialGradient>
          <filter id="lvol-g-blur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
      </svg>

      {/* ==================== TOP NAV ==================== */}
      <header>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="flex items-center gap-2.5">
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
              <circle cx="12" cy="12" r="9.4" fill={PAPER} stroke={INK} strokeWidth="1.1" />
              <g className="lvol-turn" style={{ "--o": "12px 12px", "--t": "30s", "--a": "10deg" } as CSSProperties}>
                <circle cx="12" cy="12" r="6" fill="none" stroke={INK} strokeWidth="0.9" />
                <path d="M 11 13 L 12 5.6 L 13 13 Z" fill={INK_DARK} />
              </g>
              <circle cx="12" cy="12" r="1.7" fill={GOLD} stroke={INK_DARK} strokeWidth="0.6" />
            </svg>
            <span className="lvol-serif text-[13px] tracking-[0.38em] text-[#2c1d12]">ASTRO&nbsp;SCOPE</span>
          </a>
          <nav className="flex items-center gap-7 text-[11px] uppercase tracking-[0.22em] text-[#3a2a1c]/70">
            <a href="/horoscope" className="lvol-nav-link hidden transition-colors hover:text-[#a32c1e] sm:inline">Horoscopes</a>
            <a href="/tarot" className="lvol-nav-link hidden transition-colors hover:text-[#a32c1e] sm:inline">Tarot</a>
            <a href="/compatibility" className="lvol-nav-link hidden transition-colors hover:text-[#a32c1e] md:inline">Compatibility</a>
            <a href="/sign-in" className="lvol-nav-link border border-[#3a2a1c]/50 bg-[#f4ecd2]/50 px-3.5 py-1.5 text-[#2c1d12] shadow-[0_1px_2px_rgba(44,29,18,.2)] transition-colors hover:border-[#a32c1e]/70">Sign&nbsp;In</a>
          </nav>
        </div>
        <div className="lvol-rule" />
      </header>

      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:py-24">
          <div>
            <p className="lvol-rise text-[11px] uppercase tracking-[0.34em] text-[#a32c1e]" style={{ "--d": ".1s" } as CSSProperties}>
              Birth Charts&nbsp;&nbsp;·&nbsp;&nbsp;Horoscopes&nbsp;&nbsp;·&nbsp;&nbsp;Tarot
            </p>
            <h1 className="lvol-rise lvol-serif mt-6 text-5xl leading-[1.08] text-[#2c1d12] sm:text-6xl" style={{ "--d": ".25s" } as CSSProperties}>
              Turn the wheel.
              <br />
              The heavens <em className="text-[#a32c1e]">answer.</em>
            </h1>
            <p className="lvol-rise mt-6 max-w-md text-[15px] leading-relaxed text-[#3a2a1c]/70" style={{ "--d": ".45s" } as CSSProperties}>
              Free birth chart, daily horoscopes, synastry and tarot — paper instruments for reading the sky.
            </p>
            <div className="lvol-rise mt-9 flex flex-wrap items-center gap-4" style={{ "--d": ".6s" } as CSSProperties}>
              <a href="/birth-chart" className="lvol-btn-primary lvol-serif px-7 py-3.5 text-[13px] font-bold uppercase tracking-[0.18em]">
                Cast your free birth chart
              </a>
              <a href="/horoscope" className="lvol-btn-ghost px-6 py-3.5 text-[12px] uppercase tracking-[0.2em]">
                Read today&rsquo;s horoscope&nbsp;&rarr;
              </a>
            </div>
            {/* a note in the margin, like a cataloguer's hand */}
            <p className="lvol-rise lvol-serif mt-10 max-w-xs text-[12.5px] italic leading-relaxed text-[#3a2a1c]/55" style={{ "--d": ".75s" } as CSSProperties}>
              &ldquo;Set the hour against the sign, and the little window will tell the rest.&rdquo;
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-[540px]">
            {/* faint ink construction circles behind the instrument */}
            <svg className="pointer-events-none absolute -inset-8 h-[calc(100%+4rem)] w-[calc(100%+4rem)]" viewBox="0 0 544 544" aria-hidden="true">
              <circle cx="272" cy="272" r="262" fill="none" stroke={INK} strokeWidth="0.6" opacity="0.16" strokeDasharray="2 7" />
              <circle cx="272" cy="272" r="238" fill="none" stroke={INK} strokeWidth="0.5" opacity="0.12" />
              <line x1="272" y1="4" x2="272" y2="30" stroke={INK} strokeWidth="0.7" opacity="0.2" />
              <line x1="272" y1="514" x2="272" y2="540" stroke={INK} strokeWidth="0.7" opacity="0.2" />
              <line x1="4" y1="272" x2="30" y2="272" stroke={INK} strokeWidth="0.7" opacity="0.2" />
              <line x1="514" y1="272" x2="540" y2="272" stroke={INK} strokeWidth="0.7" opacity="0.2" />
            </svg>
            <HeroVolvelle />
          </div>
        </div>
        <div className="lvol-rule" />
      </section>

      {/* ==================== SIGN BAND — PAPER INDEX ==================== */}
      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <p className="text-center text-[11px] uppercase tracking-[0.34em] text-[#a32c1e]">Daily Horoscope</p>
        <h2 className="lvol-serif mt-4 text-center text-3xl text-[#2c1d12] sm:text-4xl">Read your daily horoscope</h2>
        {/* twelve punched labels strung on a hairline thread; each tab hangs
            from its punched hole and sways almost imperceptibly */}
        <div className="mt-12 lg:mt-14">
          {[SIGNS.slice(0, 6), SIGNS.slice(6)].map((row, ri) => (
            <div key={ri} className={`relative ${ri === 1 ? "mt-6 lg:mt-10" : ""}`}>
              {/* the hairline the tabs are strung on */}
              <svg className="pointer-events-none absolute -top-2 left-0 hidden h-6 w-full lg:block" viewBox="0 0 1200 24" preserveAspectRatio="none" aria-hidden="true">
                <path d="M 10 6 Q 600 22 1190 6" fill="none" stroke={INK} strokeWidth="0.9" opacity="0.55" />
              </svg>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:flex lg:justify-center lg:gap-5">
                {row.map((s, i) => {
                  const rot = [-2.2, 1.4, -1.1, 2, -1.7, 1.2][i] * (ri === 0 ? 1 : -1);
                  return (
                    <a
                      key={s.n}
                      href={`/horoscope/${s.n.toLowerCase()}`}
                      className="lvol-tab block"
                      style={{ "--tr": `${rot}deg`, "--t": `${22 + ((i * 7 + ri * 5) % 9)}s`, "--d": `${-(i * 2.6 + ri * 1.4)}s` } as CSSProperties}
                    >
                      {/* thread from the hairline through the punched hole */}
                      <span className="mx-auto hidden h-3.5 w-px bg-[#3a2a1c]/60 lg:block" aria-hidden="true" />
                      <span className="lvol-tab-card lvol-paper mx-auto flex w-full max-w-[170px] flex-col items-center rounded-[3px] px-3 pb-4 pt-2.5 text-center lg:w-[150px]">
                        <span className="h-[9px] w-[9px] rounded-full border border-[#3a2a1c]/60 bg-[#d3c193] shadow-[inset_0_1px_2px_rgba(44,29,18,.5)]" aria-hidden="true" />
                        <span className="mt-2 text-2xl leading-none text-[#a32c1e]">{s.g}</span>
                        <span className="mt-2.5 text-[11px] uppercase tracking-[0.22em] text-[#2c1d12]/90">{s.n}</span>
                        <span className="mt-1 text-[9.5px] uppercase tracking-[0.12em] text-[#3a2a1c]/50">{s.d}</span>
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== PAPER INSTRUMENTS ON THE DESK ==================== */}
      <section className="relative mx-auto max-w-6xl px-6 py-10 lg:py-16">
        {/* a pair of faded ghost scales printed on the desk beneath the spread */}
        <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
          <svg className="absolute -left-16 top-24 h-72 w-72 opacity-[.09]" viewBox="0 0 200 200">
            <g className="lvol-spin" style={{ "--o": "100px 100px", "--t": "140s" } as CSSProperties}>
              <circle cx="100" cy="100" r="88" fill="none" stroke={INK} strokeWidth="1.4" />
              <circle cx="100" cy="100" r="70" fill="none" stroke={INK} strokeWidth="0.7" strokeDasharray="2 5" />
              {ringTicks(100, 100, 82, 88, 36).map((t, i) => (
                <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={INK} strokeWidth="1" />
              ))}
            </g>
          </svg>
          <svg className="absolute -right-20 bottom-4 h-80 w-80 opacity-[.08]" viewBox="0 0 200 200">
            <g className="lvol-spin-rev" style={{ "--o": "100px 100px", "--t": "120s" } as CSSProperties}>
              <circle cx="100" cy="100" r="90" fill="none" stroke={INK} strokeWidth="1.4" />
              <circle cx="100" cy="100" r="74" fill="none" stroke={INK} strokeWidth="0.7" strokeDasharray="2 5" />
              {ringTicks(100, 100, 84, 90, 48).map((t, i) => (
                <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={INK} strokeWidth="1" />
              ))}
            </g>
          </svg>
        </div>
        <p className="text-center text-[11px] uppercase tracking-[0.34em] text-[#a32c1e]">The Instrument Drawer</p>
        <h2 className="lvol-serif mt-4 text-center text-3xl text-[#2c1d12] sm:text-4xl">Everything the stars have to offer</h2>
        {/* the desk spread: paper plates laid over one another with deliberate
            tilts and overlaps, each carrying one small paper mechanism */}
        <div className="relative mt-14 grid gap-7 md:grid-cols-2 xl:grid-cols-12 xl:gap-x-5">
          {PANELS.map((p) => (
            <article key={p.title} className={`lvol-panel lvol-paper relative rounded-[3px] p-7 ${p.cls}`}>
              {/* brass brads pinning two corners of each plate */}
              <span className="lvol-brad left-2 top-2" aria-hidden="true" />
              <span className="lvol-brad right-2 top-2" aria-hidden="true" />
              <div className={p.featured ? "xl:flex xl:items-center xl:gap-8" : ""}>
                <div className={`mx-auto flex items-center justify-center ${p.featured ? "shrink-0 p-2 xl:mx-0" : ""}`}>
                  {p.mech}
                </div>
                <div className="mt-6 xl:mt-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className={`lvol-serif ${p.featured ? "text-2xl" : "text-xl"} text-[#2c1d12]`}>{p.title}</h3>
                    <span className="lvol-tag shrink-0 px-2 py-[3px] text-[9px] uppercase">{p.tag}</span>
                  </div>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-[#3a2a1c]/70">{p.desc}</p>
                  {p.featured && (
                    <>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {[
                          ["☉︎", "Sun — core self"],
                          ["☽︎", "Moon — inner tide"],
                          ["↑︎", "Rising — first mask"],
                        ].map(([g, label]) => (
                          <span key={label} className="lvol-chip px-2.5 py-1.5 text-[10px] uppercase">
                            <span className="text-[12px] leading-none text-[#a32c1e]">{g}</span>
                            {label}
                          </span>
                        ))}
                      </div>
                      <p className="mt-4 text-[10.5px] uppercase tracking-[0.18em] text-[#3a2a1c]/50">
                        Enter date, time, place&nbsp;&nbsp;&rarr;&nbsp;&nbsp;your wheel in seconds.
                      </p>
                      {/* teaser slip — purely visual, no JS */}
                      <div className="mt-3 flex flex-wrap items-stretch gap-2" aria-hidden="true">
                        {[
                          ["Date", "12 · 08 · 1992"],
                          ["Time", "14 : 35"],
                          ["Place", "Prague"],
                        ].map(([lbl, val]) => (
                          <div key={lbl} className="lvol-field min-w-[92px] flex-1 rounded-[2px] px-3 py-2">
                            <p className="text-[8.5px] uppercase tracking-[0.26em] text-[#a32c1e]">{lbl}</p>
                            <p className="mt-1 text-[12px] tracking-[0.08em] text-[#3a2a1c]/50">{val}</p>
                          </div>
                        ))}
                        <span className="lvol-btn-primary lvol-serif flex items-center rounded-[2px] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em]">
                          Cast&nbsp;&rarr;
                        </span>
                      </div>
                    </>
                  )}
                  <a href={p.href} className="lvol-link mt-5 inline-block text-[11px] uppercase tracking-[0.26em]">
                    Explore&nbsp;&rarr;
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ==================== DESTINY MATRIX ==================== */}
      <section className="relative mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative mx-auto w-full max-w-[420px] lg:rotate-[-1.2deg]">
            <DestinyVolvelle />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#a32c1e]">Birth-Date Octagram</p>
            <h2 className="lvol-serif mt-4 text-3xl text-[#2c1d12] sm:text-4xl">The Destiny Matrix</h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#3a2a1c]/70">
              An optional birth-date octagram tool. It maps purpose, love, money, and age themes from your birth date.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Purpose", "Love", "Money", "Age themes"].map((c) => (
                <span key={c} className="lvol-chip px-2.5 py-1.5 text-[10px] uppercase">
                  {c}
                </span>
              ))}
            </div>
            <a href="/destiny-matrix" className="lvol-btn-ghost mt-8 px-6 py-3 text-[12px] uppercase tracking-[0.2em]">
              Open Destiny Matrix&nbsp;&rarr;
            </a>
          </div>
        </div>
      </section>

      {/* ==================== FAQ — FOLDED NOTES ==================== */}
      <section className="mx-auto max-w-5xl px-6 py-16 lg:py-20">
        <p className="text-center text-[11px] uppercase tracking-[0.34em] text-[#a32c1e]">Inquiries</p>
        <h2 className="lvol-serif mt-4 text-center text-3xl text-[#2c1d12] sm:text-4xl">Questions, answered</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {FAQS.map((f, i) => (
            <article
              key={f.q}
              className="lvol-note relative"
              style={{ transform: `rotate(${[-1.1, 0.9, 1.3, -0.8][i]}deg)` }}
            >
              <div className="lvol-note-inner relative h-full px-8 pb-8 pt-9">
                {/* a strip of tape holding the note to the desk */}
                <span className="lvol-tape absolute -top-1 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-2deg]" aria-hidden="true" />
                {/* folded corner */}
                <svg className="absolute right-0 top-0 h-8 w-8" viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M 32 0 L 32 32 L 0 0 Z" fill="#dcc99c" stroke={INK} strokeWidth="0.7" opacity="0.9" />
                  <path d="M 32 0 L 0 0" stroke={INK} strokeWidth="0.7" opacity="0.5" />
                </svg>
                <h3 className="lvol-serif text-lg leading-snug text-[#2c1d12]">{f.q}</h3>
                <div className="mt-4 flex items-center gap-3" aria-hidden="true">
                  <span className="lvol-rule flex-1" />
                  <svg viewBox="0 0 14 14" className="h-2.5 w-2.5">
                    <path d="M 7 0 L 8.2 5.8 L 14 7 L 8.2 8.2 L 7 14 L 5.8 8.2 L 0 7 L 5.8 5.8 Z" fill="#c9a227" stroke={INK_DARK} strokeWidth="0.4" />
                  </svg>
                  <span className="lvol-rule flex-1" />
                </div>
                <p className="mt-4 text-[13.5px] leading-relaxed text-[#3a2a1c]/70">{f.a}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ==================== CTA BAND ==================== */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center lg:py-28">
        <div className="flex items-center justify-center gap-4">
          <span className="lvol-rule w-20 sm:w-28" />
          {/* a small seal that never stops turning */}
          <svg viewBox="0 0 28 28" className="h-6 w-6" aria-hidden="true">
            <g className="lvol-spin" style={{ "--o": "14px 14px", "--t": "60s" } as CSSProperties}>
              <circle cx="14" cy="14" r="11" fill="none" stroke={INK} strokeWidth="0.9" />
              {ringTicks(14, 14, 9, 11, 12).map((t, i) => (
                <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={INK} strokeWidth="0.8" />
              ))}
            </g>
            <circle cx="14" cy="14" r="2.4" fill={GOLD} stroke={INK_DARK} strokeWidth="0.6" />
          </svg>
          <span className="lvol-rule w-20 sm:w-28" />
        </div>
        <h2 className="lvol-serif mt-8 text-3xl leading-snug text-[#2c1d12] sm:text-4xl">
          Your chart is written in the stars.
          <br />
          Come read it.
        </h2>
        <a href="/sign-up" className="lvol-btn-primary lvol-serif mt-10 px-8 py-4 text-[13px] font-bold uppercase tracking-[0.18em]">
          Get started — it&rsquo;s free
        </a>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer>
        <div className="lvol-rule" />
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="lvol-serif text-[12px] tracking-[0.34em] text-[#2c1d12]">ASTRO&nbsp;SCOPE</p>
              <p className="mt-2 text-[12px] text-[#3a2a1c]/55">Astro Scope — your daily cosmic guidance.</p>
            </div>
            <nav className="flex flex-wrap gap-x-7 gap-y-2 text-[11px] uppercase tracking-[0.2em] text-[#3a2a1c]/65">
              <a href="/birth-chart" className="lvol-nav-link transition-colors hover:text-[#a32c1e]">Birth Chart</a>
              <a href="/horoscope" className="lvol-nav-link transition-colors hover:text-[#a32c1e]">Horoscopes</a>
              <a href="/tarot" className="lvol-nav-link transition-colors hover:text-[#a32c1e]">Tarot</a>
              <a href="/pricing" className="lvol-nav-link transition-colors hover:text-[#a32c1e]">Pricing</a>
            </nav>
          </div>
          <p className="mt-8 text-[10px] uppercase tracking-[0.18em] text-[#3a2a1c]/40">&copy; 2026 Astro Scope</p>
        </div>
      </footer>
    </div>
  );
}
