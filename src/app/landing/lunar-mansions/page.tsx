// LANDING / LUNAR MANSIONS — a design exploration of the production landing
// in the medieval lunar-manuscript language of src/components/cards/lunar-mansions.tsx:
// aged parchment, sepia ink, gold leaf and rubric red. A grand procession of
// the twenty-eight moons arcs over a manuscript headline with a decorated
// initial cap; the signs are illuminated initials with vine corners; the six
// sections are rubricated leaves with small illuminated diagrams; the Destiny
// Matrix is a diagram plate with marginal glosses; the FAQ is scholastic Q&A.
// Fully self-contained: inline SVG, Tailwind for layout, one scoped <style>
// block (llm- prefixed). Server-component safe: no hooks, CSS animations only,
// statically prerendered.

import type { Metadata } from "next";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Astro Scope — The moon keeps twenty-eight houses",
  description:
    "Free birth chart, daily horoscopes, synastry and tarot — a manuscript of the moon's twenty-eight houses.",
};

const DEG = Math.PI / 180;

// the manuscript palette
const PARCH = "#efe6cd";
const PARCH_LIGHT = "#f6efdb";
const INK = "#3b2d1f";
const SEPIA = "#5c422a";
const GOLD = "#c9a227";
const GOLD_DEEP = "#8f6d1c";
const GOLD_PALE = "#e9cf8a";
const RUBRIC = "#8f2f1c";
const MOONLIT = "#f3e6bd";

const GLYPH_FONT = "'DejaVu Sans', 'Segoe UI Symbol', Georgia, serif";

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

/* ======================== MANUSCRIPT ORNAMENT DATA ====================== */

// Illuminated-region path of a moon disc of radius r at phase p (0 = new, .5 = full).
function moonLitPath(p: number, r: number): string {
  const f = (1 - Math.cos(2 * Math.PI * p)) / 2; // illuminated fraction
  const e = Math.abs(r * Math.cos(2 * Math.PI * p)); // terminator semi-axis
  const rr = r.toFixed(2);
  const ee = e.toFixed(2);
  if (p <= 0.5) {
    // waxing: light on the right
    return `M 0 ${-r} A ${rr} ${rr} 0 0 1 0 ${r} A ${ee} ${rr} 0 0 ${f > 0.5 ? 1 : 0} 0 ${-r} Z`;
  }
  // waning: light on the left
  return `M 0 ${-r} A ${rr} ${rr} 0 0 0 0 ${r} A ${ee} ${rr} 0 0 ${f > 0.5 ? 0 : 1} 0 ${-r} Z`;
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

// the procession of the twenty-eight moons along a shallow arc (viewBox 0 0 1600 250)
const MOONS = Array.from({ length: 28 }, (_, i) => {
  const t = i / 27;
  const x = 70 + t * 1460;
  const y = 190 - 118 * Math.sin(Math.PI * t);
  const r = 8 + 4 * Math.sin(Math.PI * t); // the full moon swells at the apex
  return {
    x: +x.toFixed(1),
    y: +y.toFixed(1),
    r: +r.toFixed(2),
    p: i / 28,
    d: `${(i * 3 - 84).toFixed(0)}s`, // the gilded house travels the arc once per 84s
  };
});
const MOON_ARC = MOONS.map((m, i) => `${i ? "L" : "M"} ${m.x} ${m.y}`).join(" ");

// faint ink specks on the parchment, deterministic so the prerender is stable
const SPECKS = Array.from({ length: 90 }, (_, i) => ({
  x: +((i * 391.7 + 61) % 1600).toFixed(1),
  y: +((i * 263.3 + 29) % 1000).toFixed(1),
  r: +(0.4 + ((i * 7) % 10) / 14).toFixed(2),
  o: +(0.05 + ((i * 13) % 10) / 90).toFixed(3),
}));

// point on a small diagram wheel (120×120), angle clockwise from the top
const wheelPt = (a: number, r: number): [number, number] => {
  const t = (a - 90) * DEG;
  return [+(60 + r * Math.cos(t)).toFixed(1), +(60 + r * Math.sin(t)).toFixed(1)];
};

/* ========================= DESTINY MATRIX DATA ========================== */

const OCT_C = 160;
const OCT_R = 124;
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

/* ========================== MANUSCRIPT ORNAMENTS ======================== */

// vine corner for the illuminated boxes: sepia stem, gold leaf, rubric berry
function Vine({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`pointer-events-none absolute h-5 w-5 ${className}`} aria-hidden="true">
      <path d="M 3 21 C 3 12 6 6 15 3" fill="none" stroke={SEPIA} strokeWidth="1.1" strokeLinecap="round" />
      <path d="M 8 12 q 4.5 -1 6.5 2.5 q -4.5 1 -6.5 -2.5 Z" fill={GOLD} opacity="0.85" />
      <circle cx="5.2" cy="17" r="1.6" fill={RUBRIC} />
      <circle cx="15" cy="3" r="1.2" fill={GOLD_DEEP} />
    </svg>
  );
}

// hairline rule with a center diamond — the manuscript divider
function Flourish({ red = false }: { red?: boolean }) {
  const c = red ? RUBRIC : SEPIA;
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <span className="llm-rule flex-1" />
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 shrink-0">
        <path d="M 6 0 L 10 6 L 6 12 L 2 6 Z" fill={c} opacity="0.85" />
      </svg>
      <span className="llm-rule flex-1" />
    </div>
  );
}

/* ========================= HERO MOON PROCESSION ========================= */

function MoonProcession() {
  return (
    <svg
      viewBox="0 0 1600 250"
      className="h-auto w-full"
      role="img"
      aria-label="A procession of the twenty-eight mansions of the moon, from new moon to full and back"
    >
      {/* the dashed path the moon walks */}
      <path d={MOON_ARC} fill="none" stroke={SEPIA} strokeWidth="0.8" strokeDasharray="2 6" opacity="0.45" />
      <path d={MOON_ARC} fill="none" stroke={GOLD} strokeWidth="0.5" strokeDasharray="1 9" opacity="0.4" />

      {MOONS.map((m, i) => (
        <g key={i}>
          {/* the traveling gilded house — one moon glows at a time */}
          <circle
            className="llm-moonglow"
            style={{ "--d": m.d } as CSSProperties}
            cx={m.x}
            cy={m.y}
            r={m.r + 7}
            fill="url(#llm-g-halo)"
            opacity="0"
          />
          <g transform={`translate(${m.x} ${m.y})`}>
            <circle r={m.r} fill="#4a3826" fillOpacity="0.5" stroke={INK} strokeWidth="0.7" />
            <path d={moonLitPath(m.p, m.r)} fill={MOONLIT} />
          </g>
          <text
            x={m.x}
            y={m.y + m.r + 13}
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontSize="8"
            fill={SEPIA}
            opacity="0.8"
          >
            {i + 1}
          </text>
        </g>
      ))}

      {/* rubric captions: the new moon at the first house, the full at the fifteenth */}
      <text
        x={MOONS[0].x + 4}
        y={MOONS[0].y + MOONS[0].r + 30}
        fontFamily="Georgia, 'Times New Roman', serif"
        fontStyle="italic"
        fontSize="11"
        fill={RUBRIC}
      >
        i · novilunium
      </text>
      <text
        x={MOONS[14].x}
        y={MOONS[14].y + MOONS[14].r + 30}
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontStyle="italic"
        fontSize="11"
        fill={RUBRIC}
      >
        xv · plenilunium
      </text>
    </svg>
  );
}

/* ====================== ILLUMINATED PLATE DIAGRAMS ====================== */
// all are 120×120, all ambient motion is CSS (classes from the llm- block)

// BIRTH CHART — a natal wheel: zodiac band turning imperceptibly over house spokes
function FigWheel() {
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="An illuminated natal wheel with the twelve signs">
      <circle cx="60" cy="60" r="52" fill="none" stroke={INK} strokeWidth="1.3" />
      <circle cx="60" cy="60" r="48.5" fill="none" stroke={GOLD} strokeWidth="0.7" />
      <circle cx="60" cy="60" r="30" fill="none" stroke={INK} strokeWidth="0.8" />
      {/* house spokes */}
      {Array.from({ length: 12 }, (_, k) => {
        const [x1, y1] = wheelPt(k * 30, 16);
        const [x2, y2] = wheelPt(k * 30, 30);
        return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke={SEPIA} strokeWidth="0.6" opacity="0.8" />;
      })}
      {/* aspect lines across the hub, breathing slowly in turn */}
      {[
        [10, 130],
        [55, 235],
        [100, 280],
      ].map(([a, b], i) => {
        const [x1, y1] = wheelPt(a, 26);
        const [x2, y2] = wheelPt(b, 26);
        return (
          <line
            key={i}
            className="llm-breathe"
            style={{ "--t": "18s", "--d": `${i * 6}s` } as CSSProperties}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={GOLD}
            strokeWidth="0.7"
            opacity="0.7"
          />
        );
      })}
      <circle cx="60" cy="60" r="15" fill={PARCH_LIGHT} stroke={GOLD_DEEP} strokeWidth="0.9" />
      <path d={starN(60, 60, 4, 6, 2.4)} fill={GOLD} stroke={GOLD_DEEP} strokeWidth="0.5" />
      {/* the zodiac band, turning once in two and a half minutes */}
      <g className="llm-turn" style={{ "--o": "60px 60px", "--t": "150s" } as CSSProperties}>
        {Array.from({ length: 12 }, (_, k) => {
          const [x1, y1] = wheelPt(k * 30, 48.5);
          const [x2, y2] = wheelPt(k * 30, 52);
          return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke={SEPIA} strokeWidth="0.6" />;
        })}
        {ZODIAC.map((g, k) => {
          const [x, y] = wheelPt(k * 30 + 15, 39.5);
          return (
            <text key={g} x={x} y={y + 2.6} textAnchor="middle" fontFamily={GLYPH_FONT} fontSize="8" fill={SEPIA}>
              {g}
            </text>
          );
        })}
      </g>
    </svg>
  );
}

// DAILY HOROSCOPE — the sun climbing over the horizon, the moon attending
function FigSky() {
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="An illuminated sun rising over a ruled horizon with a crescent moon">
      {/* ruled sky lines, like the staves of a manuscript */}
      {[34, 46, 58, 70].map((y) => (
        <line key={y} x1="16" y1={y} x2="104" y2={y} stroke={SEPIA} strokeWidth="0.4" opacity="0.35" />
      ))}
      {/* sun half-disc with rays */}
      <g>
        <path d="M 26 78 A 16 16 0 0 1 58 78 Z" fill={GOLD} stroke={GOLD_DEEP} strokeWidth="0.8" />
        {[205, 232.5, 260, 287.5, 315, 342.5].map((a, i) => {
          const t = a * DEG;
          return (
            <line
              key={a}
              className="llm-breathe"
              style={{ "--t": "14s", "--d": `${i * 2.3}s` } as CSSProperties}
              x1={42 + 19 * Math.cos(t)}
              y1={78 + 19 * Math.sin(t)}
              x2={42 + 25 * Math.cos(t)}
              y2={78 + 25 * Math.sin(t)}
              stroke={GOLD_DEEP}
              strokeWidth="1"
              strokeLinecap="round"
            />
          );
        })}
      </g>
      {/* the crescent moon, attending at a distance */}
      <g transform="translate(86 44)" className="llm-breathe" style={{ "--t": "20s" } as CSSProperties}>
        <circle r="9.5" fill="#4a3826" fillOpacity="0.45" stroke={INK} strokeWidth="0.7" />
        <path d={moonLitPath(0.3, 9.5)} fill={MOONLIT} />
      </g>
      {/* three morning stars */}
      <g fill={GOLD_DEEP}>
        <circle cx="70" cy="26" r="1" />
        <circle cx="98" cy="66" r="1" />
        <circle cx="60" cy="18" r="0.8" />
      </g>
      {/* the horizon */}
      <line x1="14" y1="78" x2="106" y2="78" stroke={INK} strokeWidth="1.2" />
      <line x1="22" y1="84" x2="98" y2="84" stroke={SEPIA} strokeWidth="0.5" opacity="0.6" />
    </svg>
  );
}

// COMPATIBILITY — two rings interlaced, a gilded vesica between them
function FigRings() {
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="Two interlaced rings, one gold and one red">
      <circle cx="46" cy="60" r="22" fill="none" stroke={GOLD_DEEP} strokeWidth="1.6" />
      <circle cx="74" cy="60" r="22" fill="none" stroke={RUBRIC} strokeWidth="1.6" />
      {/* the lens they share, breathing gently */}
      <path d="M 60 43 A 22 22 0 0 1 60 77 A 22 22 0 0 1 60 43 Z" fill={GOLD} opacity="0.22" className="llm-breathe" style={{ "--t": "13s" } as CSSProperties} />
      {/* a bead walking each ring */}
      <g className="llm-turn" style={{ "--o": "46px 60px", "--t": "44s" } as CSSProperties}>
        <circle cx="46" cy="38" r="2.4" fill={GOLD} stroke={GOLD_DEEP} strokeWidth="0.7" />
      </g>
      <g className="llm-turn-rev" style={{ "--o": "74px 60px", "--t": "58s" } as CSSProperties}>
        <circle cx="74" cy="82" r="2.4" fill={RUBRIC} stroke={INK} strokeWidth="0.5" />
      </g>
      {/* binding knot at the heart */}
      <path d={starN(60, 60, 4, 5, 2)} fill={GOLD_PALE} stroke={GOLD_DEEP} strokeWidth="0.6" />
    </svg>
  );
}

// TAROT — three cards of a spread, the middle one bearing the moon
function FigCards() {
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="Three tarot cards in a spread, the middle card bearing a crescent moon">
      {/* left card */}
      <g transform="rotate(-11 47 74)">
        <rect x="34" y="46" width="26" height="42" rx="1.5" fill={PARCH_LIGHT} stroke={INK} strokeWidth="0.9" />
        <rect x="37" y="49" width="20" height="36" rx="1" fill="none" stroke={GOLD_DEEP} strokeWidth="0.5" />
        <path d="M 40 60 L 54 74 M 54 60 L 40 74" stroke={SEPIA} strokeWidth="0.5" opacity="0.7" />
      </g>
      {/* right card */}
      <g transform="rotate(11 73 74)">
        <rect x="60" y="46" width="26" height="42" rx="1.5" fill={PARCH_LIGHT} stroke={INK} strokeWidth="0.9" />
        <rect x="63" y="49" width="20" height="36" rx="1" fill="none" stroke={GOLD_DEEP} strokeWidth="0.5" />
        <path d="M 66 60 L 80 74 M 80 60 L 66 74" stroke={SEPIA} strokeWidth="0.5" opacity="0.7" />
      </g>
      {/* the middle card, revealed: the moon between two stars */}
      <rect x="47" y="36" width="26" height="44" rx="1.5" fill={MOONLIT} stroke={INK} strokeWidth="1" />
      <rect x="50" y="39" width="20" height="38" rx="1" fill="none" stroke={GOLD} strokeWidth="0.6" />
      <g transform="translate(60 55)">
        <circle r="6.5" fill="#4a3826" fillOpacity="0.5" stroke={INK} strokeWidth="0.6" />
        <path d={moonLitPath(0.38, 6.5)} fill={PARCH_LIGHT} />
      </g>
      <path d={starN(60, 70.5, 4, 3, 1.2)} fill={GOLD} className="llm-breathe" style={{ "--t": "11s" } as CSSProperties} />
      <path d="M 54 44.5 h 12" stroke={RUBRIC} strokeWidth="0.8" />
    </svg>
  );
}

// PSYCHOLOGY — the medieval diagram of the three cells of the mind
function FigHead() {
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="A head in profile containing the three cells of the mind">
      {/* the head: circle and neck, after the medieval fashion */}
      <circle cx="58" cy="56" r="30" fill="none" stroke={INK} strokeWidth="1.2" />
      <path d="M 44 82 L 42 98 M 72 82 L 74 98" stroke={INK} strokeWidth="1" />
      <path d="M 36 98 h 44" stroke={INK} strokeWidth="1.1" />
      {/* brow and nose hinted */}
      <path d="M 28 52 q -4 3 0 8" fill="none" stroke={INK} strokeWidth="0.9" />
      {/* the three cells: sense, thought, memory */}
      {([
        [42, 46, "sensus"],
        [62, 40, "ratio"],
        [66, 64, "memoria"],
      ] as Array<[number, number, string]>).map(([x, y, l], i) => (
        <g key={l}>
          <circle cx={x} cy={y} r="10" fill={PARCH_LIGHT} stroke={SEPIA} strokeWidth="0.8" />
          <path
            d={starN(x, y, 4, 3.4, 1.4)}
            fill={GOLD}
            className="llm-breathe"
            style={{ "--t": "15s", "--d": `${i * 5}s` } as CSSProperties}
          />
          <text
            x={x}
            y={y + 17}
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fontSize="6.5"
            fill={RUBRIC}
          >
            {l}
          </text>
        </g>
      ))}
      {/* channels between the cells */}
      <path d="M 50 42 L 54 41 M 54 52 L 60 56" stroke={SEPIA} strokeWidth="0.5" strokeDasharray="1.5 2" />
    </svg>
  );
}

// COSMIC PASSPORT — a sealed letter with a rubric wax seal
function FigSeal() {
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="A sealed letter bearing a red wax seal with a gold star">
      {/* the letter */}
      <rect x="30" y="24" width="60" height="74" rx="1.5" fill={PARCH_LIGHT} stroke={INK} strokeWidth="1" />
      <rect x="34" y="28" width="52" height="66" rx="1" fill="none" stroke={GOLD_DEEP} strokeWidth="0.5" />
      {/* script lines */}
      {[38, 44, 50, 56].map((y, i) => (
        <line key={y} x1="40" y1={y} x2={80 - (i % 2) * 8} y2={y} stroke={SEPIA} strokeWidth="0.9" opacity="0.55" />
      ))}
      <text x="60" y="68" textAnchor="middle" fontFamily={GLYPH_FONT} fontSize="7" fill={SEPIA}>
        {"☉︎ ☽︎ ♀︎"}
      </text>
      {/* ribbon */}
      <path d="M 52 78 L 46 96 M 68 78 L 74 96" stroke={RUBRIC} strokeWidth="1.6" opacity="0.85" />
      {/* the wax seal, breathing softly */}
      <g className="llm-breathe" style={{ "--t": "19s" } as CSSProperties}>
        <circle cx="60" cy="80" r="12" fill={RUBRIC} stroke={INK} strokeWidth="0.7" />
        <circle cx="60" cy="80" r="9" fill="none" stroke={GOLD_PALE} strokeWidth="0.6" opacity="0.8" />
        <path d={starN(60, 80, 4, 5, 2)} fill={GOLD_PALE} />
      </g>
    </svg>
  );
}

/* ====================== DESTINY MATRIX DIAGRAM PLATE ==================== */

function DestinyOctagram() {
  return (
    <svg
      viewBox="0 0 320 320"
      className="h-auto w-full"
      role="img"
      aria-label="An octagram diagram of the Destiny Matrix with eight labeled points"
    >
      {/* slow gilded gleam walking the outer halo */}
      <g className="llm-turn" style={{ "--o": "160px 160px", "--t": "130s" } as CSSProperties}>
        <circle cx="160" cy="160" r="148" fill="none" stroke={GOLD} strokeWidth="1" strokeDasharray="24 905" strokeLinecap="round" opacity="0.8" />
      </g>
      <circle cx="160" cy="160" r="148" fill="none" stroke={SEPIA} strokeWidth="0.5" strokeDasharray="1 5" opacity="0.6" />
      <circle cx="160" cy="160" r="138" fill="none" stroke={INK} strokeWidth="0.8" opacity="0.8" />
      {/* spokes from the heart to each vertex */}
      {OCT_PTS.map((p, i) => (
        <line key={i} x1="160" y1="160" x2={p.x} y2={p.y} stroke={SEPIA} strokeWidth="0.5" opacity="0.65" />
      ))}
      {/* the octagram itself: two overlaid squares, one ink, one gold */}
      <polygon points={OCT_SQUARE_A.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={INK} strokeWidth="1.1" />
      <polygon points={OCT_SQUARE_B.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={GOLD_DEEP} strokeWidth="1.1" opacity="0.9" />
      {/* the heart of the figure */}
      <circle className="llm-breathe" style={{ "--t": "14s" } as CSSProperties} cx="160" cy="160" r="18" fill="url(#llm-g-halo)" />
      <circle cx="160" cy="160" r="11" fill={PARCH_LIGHT} stroke={GOLD_DEEP} strokeWidth="0.9" />
      <path d={starN(160, 160, 8, 7, 2.8)} fill={GOLD} stroke={GOLD_DEEP} strokeWidth="0.5" />
      {/* vertex roundels with their numbers, kindling in sequence */}
      {OCT_PTS.map((p, i) => {
        const t = (i * 45 - 90) * DEG;
        const lx = 160 + (OCT_R + 22) * Math.cos(t);
        const ly = 160 + (OCT_R + 22) * Math.sin(t);
        return (
          <g key={i} className="llm-node" style={{ "--d": `${i * 1.6}s` } as CSSProperties}>
            <circle cx={p.x} cy={p.y} r="9.5" fill={PARCH_LIGHT} stroke={i % 2 ? GOLD_DEEP : INK} strokeWidth="1" />
            <text x={p.x} y={p.y + 2.8} textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="700" fontSize="8.5" fill={SEPIA}>
              {OCT_NODES[i].n}
            </text>
            <text x={lx.toFixed(1)} y={(ly + 2.5).toFixed(1)} textAnchor="middle" fontSize="7.5" letterSpacing="1.4" fill={i % 2 ? RUBRIC : SEPIA}>
              {OCT_NODES[i].label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ================================= PAGE ================================= */

const PLATES = [
  {
    rn: "I",
    tag: "FREE",
    title: "Birth Chart",
    desc: "Map your Sun, Moon, and Rising — the foundation of every reading.",
    href: "/birth-chart",
    fig: <FigWheel />,
    wide: true,
    flip: false,
    rot: "-0.5deg",
  },
  {
    rn: "II",
    tag: "DAILY",
    title: "Daily Horoscope",
    desc: "Twelve signs, one sky. Clear forecasts without the fluff.",
    href: "/horoscope",
    fig: <FigSky />,
    wide: false,
    flip: false,
    rot: "0.6deg",
  },
  {
    rn: "III",
    tag: "SYNASTRY",
    title: "Compatibility",
    desc: "Zodiac match, Chinese pairs, and deep synastry for two charts.",
    href: "/compatibility",
    fig: <FigRings />,
    wide: false,
    flip: false,
    rot: "-0.7deg",
  },
  {
    rn: "IV",
    tag: "SPREADS",
    title: "Tarot",
    desc: "Daily card to Celtic Cross — pull, reflect, get a full reading.",
    href: "/tarot",
    fig: <FigCards />,
    wide: false,
    flip: false,
    rot: "0.5deg",
  },
  {
    rn: "V",
    tag: "TESTS",
    title: "Psychology",
    desc: "MBTI, Big Five, empathy and more — meet yourself beyond the signs.",
    href: "/psychology",
    fig: <FigHead />,
    wide: false,
    flip: false,
    rot: "-0.4deg",
  },
  {
    rn: "VI",
    tag: "YOU",
    title: "Cosmic Passport",
    desc: "Your Cosmic ID, people, journal, and Premium deep dives — one hub.",
    href: "/passport",
    fig: <FigSeal />,
    wide: true,
    flip: true,
    rot: "0.4deg",
  },
];

export default function LunarMansionsLanding() {
  return (
    <div className="llm-root relative isolate min-h-screen">
      <style>{`
        .llm-root { background: ${PARCH}; color: ${INK}; font-family: Georgia, 'Times New Roman', serif; }
        .llm-root ::selection { background: rgba(201,162,39,.35); color: ${INK}; }
        .llm-rule { height: 1px; background: linear-gradient(90deg, transparent, rgba(92,66,42,.55), transparent); }
        .llm-rubric { color: ${RUBRIC}; font-variant-caps: small-caps; letter-spacing: .16em; }

        /* deckle edges of the great sheet */
        .llm-deckle { position: absolute; top: 0; bottom: 0; width: 14px; pointer-events: none; opacity: .85;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='160'%3E%3Cpath d='M14 0 L3 0 L6 13 L1 27 L7 41 L2 55 L8 70 L3 84 L9 99 L2 113 L7 128 L1 143 L5 160 L14 160 Z' fill='%23dcc79c'/%3E%3C/svg%3E") repeat-y; }
        .llm-deckle-r { transform: scaleX(-1); }

        /* buttons */
        .llm-btn-primary { display: inline-block; background: linear-gradient(180deg, #e6c766 0%, ${GOLD} 55%, #a07c1e 100%); color: #2c1f10; border: 1px solid ${GOLD_DEEP}; box-shadow: inset 0 1px 0 rgba(255,246,216,.85), inset 0 -1px 0 rgba(90,66,30,.4), 0 12px 26px -14px rgba(143,109,28,.8); transition: filter .35s ease, box-shadow .35s ease; }
        .llm-btn-primary:hover { filter: brightness(1.06); box-shadow: inset 0 1px 0 rgba(255,246,216,.85), inset 0 -1px 0 rgba(90,66,30,.4), 0 16px 32px -12px rgba(143,109,28,.9); }
        .llm-btn-ghost { display: inline-block; border: 1px solid rgba(92,66,42,.55); color: ${SEPIA}; transition: border-color .35s ease, background .35s ease, color .35s ease; }
        .llm-btn-ghost:hover { border-color: ${GOLD_DEEP}; background: rgba(201,162,39,.12); color: ${INK}; }

        /* manuscript leaves: parchment, deckled corners, double-ruled inset */
        .llm-leaf { position: relative; background: linear-gradient(160deg, #f4ecd4 0%, #eee2c4 58%, #e8d8b1 100%); border: 1px solid rgba(92,66,42,.5); border-radius: 4px 9px 5px 10px / 8px 4px 9px 5px; box-shadow: inset 0 0 0 3px rgba(246,239,219,.9), inset 0 0 0 4px rgba(92,66,42,.22), 0 18px 36px -22px rgba(59,45,31,.55); transform: rotate(var(--rot, 0deg)); transition: transform .5s cubic-bezier(.22,.7,.3,1), box-shadow .5s ease; }
        .llm-leaf:hover { transform: rotate(var(--rot, 0deg)) translateY(-4px); box-shadow: inset 0 0 0 3px rgba(246,239,219,.9), inset 0 0 0 4px rgba(143,109,28,.4), 0 26px 44px -20px rgba(59,45,31,.6); }
        .llm-stain { position: absolute; border-radius: 50%; background: radial-gradient(closest-side, rgba(146,110,58,.18), transparent 72%); filter: blur(2px); pointer-events: none; }

        .llm-tag { display: inline-block; border: 1px solid rgba(143,47,28,.55); color: ${RUBRIC}; background: rgba(143,47,28,.05); letter-spacing: .26em; }
        .llm-link { color: ${RUBRIC}; border-bottom: 1px solid transparent; transition: color .3s ease, border-color .3s ease; }
        .llm-leaf:hover .llm-link, .llm-link:hover { color: #6e2113; border-bottom-color: rgba(143,47,28,.5); }
        .llm-nav-link { transition: color .3s ease; }
        .llm-nav-link:hover { color: ${RUBRIC}; }

        /* illuminated initials: gilded ground, slow candle-shine sweep */
        .llm-gilt { position: relative; overflow: hidden; background: linear-gradient(150deg, #e9cf8a 0%, ${GOLD} 55%, #b8922e 100%); border: 1px solid ${GOLD_DEEP}; box-shadow: inset 0 0 0 2px rgba(246,239,219,.55), inset 0 1px 0 rgba(255,246,216,.7), 0 6px 14px -8px rgba(143,109,28,.7); }
        .llm-gilt::after { content: ""; position: absolute; inset: 0; background: linear-gradient(115deg, transparent 32%, rgba(255,250,224,.65) 50%, transparent 68%); background-size: 280% 100%; background-position: 140% 0; animation: llm-shine var(--t, 18s) ease-in-out infinite; animation-delay: var(--d, 0s); }

        /* the great decorated initial of the hero */
        .llm-cap { float: left; margin: .06em .16em 0 0; padding: .14em .22em; font-size: 2.6em; line-height: .82; color: #2c1f10; font-weight: 700; }

        .llm-plate { transition: transform .4s ease, box-shadow .4s ease; }
        .llm-plate:hover { transform: translateY(-3px); }

        /* load: text rises, plates settle */
        .llm-rise { animation: llm-rise .9s cubic-bezier(.22,.7,.3,1) backwards; animation-delay: var(--d, 0s); }
        .llm-fade { animation: llm-fade-in 1.1s ease-out backwards; animation-delay: var(--d, 0s); }

        /* ambient motion — all slow, all restrained */
        .llm-turn { transform-box: view-box; transform-origin: var(--o, 60px 60px); animation: llm-spin var(--t, 120s) linear infinite; }
        .llm-turn-rev { transform-box: view-box; transform-origin: var(--o, 60px 60px); animation: llm-spin-rev var(--t, 120s) linear infinite; }
        .llm-breathe { animation: llm-breathe var(--t, 16s) ease-in-out infinite; animation-delay: var(--d, 0s); }
        .llm-moonglow { animation: llm-moonglow 84s linear infinite; animation-delay: var(--d, 0s); }
        .llm-node { animation: llm-nodepulse 12.8s ease-in-out infinite; animation-delay: var(--d, 0s); }

        @keyframes llm-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes llm-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes llm-spin { to { transform: rotate(360deg); } }
        @keyframes llm-spin-rev { to { transform: rotate(-360deg); } }
        @keyframes llm-breathe { 0%, 100% { opacity: .62; } 50% { opacity: 1; } }
        @keyframes llm-shine { 0%, 55% { background-position: 140% 0; } 85%, 100% { background-position: -40% 0; } }
        @keyframes llm-moonglow { 0% { opacity: .55; } 4% { opacity: 0; } 100% { opacity: 0; } }
        @keyframes llm-nodepulse { 0%, 100% { opacity: .55; } 6% { opacity: 1; } 18% { opacity: .55; } }

        @media (prefers-reduced-motion: reduce) {
          .llm-rise, .llm-fade, .llm-turn, .llm-turn-rev, .llm-breathe,
          .llm-moonglow, .llm-node, .llm-gilt::after {
            animation: none;
          }
        }
      `}</style>

      {/* parchment atmosphere: edge vignette, age stains, ink specks */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 160px rgba(90,66,30,.28)" }} />
        <div className="llm-stain h-[420px] w-[520px]" style={{ left: "-8%", top: "6%" }} />
        <div className="llm-stain h-[360px] w-[440px]" style={{ right: "-6%", top: "38%" }} />
        <div className="llm-stain h-[460px] w-[560px]" style={{ left: "22%", bottom: "-12%" }} />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
          {SPECKS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={SEPIA} opacity={s.o} />
          ))}
        </svg>
      </div>
      <span className="llm-deckle left-0" aria-hidden="true" />
      <span className="llm-deckle llm-deckle-r right-0" aria-hidden="true" />

      {/* shared defs: objectBoundingBox gradients are reusable across every SVG on the page */}
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="llm-g-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe9a8" stopOpacity="0.95" />
            <stop offset="45%" stopColor={GOLD} stopOpacity="0.45" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* ==================== TOP NAV ==================== */}
      <header className="relative">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="flex items-center gap-2.5">
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
              <path d="M 12 2.5 A 9.5 9.5 0 1 0 12 21.5 A 11.5 11.5 0 0 1 12 2.5 Z" fill={GOLD} stroke={GOLD_DEEP} strokeWidth="0.8" />
              <circle cx="7" cy="12" r="1.1" fill={RUBRIC} />
            </svg>
            <span className="text-[13px] font-bold tracking-[0.38em] text-[#3b2d1f]">ASTRO&nbsp;SCOPE</span>
          </a>
          <nav className="flex items-center gap-7 text-[11px] uppercase tracking-[0.22em] text-[#5c422a]/85">
            <a href="/horoscope" className="llm-nav-link hidden sm:inline">Horoscopes</a>
            <a href="/tarot" className="llm-nav-link hidden sm:inline">Tarot</a>
            <a href="/compatibility" className="llm-nav-link hidden md:inline">Compatibility</a>
            <a href="/sign-in" className="llm-nav-link border border-[#5c422a]/50 px-3.5 py-1.5 text-[#8f2f1c] hover:border-[#8f2f1c]/70">Sign&nbsp;In</a>
          </nav>
        </div>
        {/* the rubricated double rule of the manuscript header */}
        <div className="mx-auto max-w-6xl px-6" aria-hidden="true">
          <div className="h-[2px] bg-[#8f2f1c]/70" />
          <div className="mt-[3px] h-px bg-[#5c422a]/40" />
        </div>
      </header>

      {/* ==================== HERO ==================== */}
      <section className="relative">
        {/* the procession of the twenty-eight moons across the top of the page */}
        <div className="llm-fade mx-auto max-w-[1500px] px-2 pt-6 sm:px-6" style={{ "--d": ".15s" } as CSSProperties}>
          <MoonProcession />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-4 lg:pb-24">
          {/* ghost show-through from the verso of the sheet */}
          <p className="pointer-events-none absolute right-2 top-16 hidden max-w-[240px] rotate-6 select-none text-justify text-[13px] italic leading-relaxed text-[#5c422a] opacity-[0.07] lg:block" aria-hidden="true">
            Luna per xxviii mansiones transit, et unaquaeque mansio suam habet virtutem: alia ad iter, alia ad nuptias, alia ad thesaurum inveniendum…
          </p>

          {/* marginalia, after the fashion of a glossed codex */}
          <div className="pointer-events-none absolute left-0 top-24 hidden w-[150px] -rotate-2 lg:block" aria-hidden="true">
            <p className="text-[11.5px] italic leading-relaxed text-[#5c422a]/80">
              <span className="llm-rubric not-italic">¶</span>&nbsp;&nbsp;The moon passeth through xxviii houses in xxvii days and viii hours.
            </p>
          </div>
          <div className="pointer-events-none absolute bottom-16 right-0 hidden w-[150px] rotate-1 lg:block" aria-hidden="true">
            <p className="text-[11.5px] italic leading-relaxed text-[#5c422a]/80">
              <span className="llm-rubric not-italic">nota:</span>&nbsp;&nbsp;the first house beginneth with the new moon.
            </p>
          </div>

          <div className="mx-auto max-w-2xl">
            <p className="llm-rise llm-rubric text-center text-[12px]" style={{ "--d": ".1s" } as CSSProperties}>
              Mansiones Lunae · Liber Primus
            </p>
            <h1 className="llm-rise mt-7 text-[2.6rem] leading-[1.14] text-[#2c1f10] sm:text-6xl" style={{ "--d": ".28s" } as CSSProperties}>
              <span className="llm-cap llm-gilt">T</span>
              he moon keeps twenty-eight houses. <em className="text-[#8f2f1c]">Find yours.</em>
            </h1>
            <p className="llm-rise mt-6 max-w-md text-[15px] leading-relaxed text-[#5c422a]" style={{ "--d": ".48s" } as CSSProperties}>
              Free birth chart, daily horoscopes, synastry and tarot.
            </p>
            <div className="llm-rise mt-9 flex flex-wrap items-center gap-4" style={{ "--d": ".62s" } as CSSProperties}>
              <a href="/birth-chart" className="llm-btn-primary px-7 py-3.5 text-[13px] uppercase tracking-[0.18em]">
                Cast your free birth chart
              </a>
              <a href="/horoscope" className="llm-btn-ghost px-6 py-3.5 text-[12px] uppercase tracking-[0.2em]">
                Read today&rsquo;s horoscope&nbsp;&rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SIGN BAND — ILLUMINATED INITIALS ==================== */}
      <section className="relative mx-auto max-w-6xl px-6 py-14 lg:py-18">
        <p className="llm-rubric text-center text-[11px] uppercase">Kalendarium</p>
        <h2 className="mt-3 text-center text-3xl text-[#2c1f10] sm:text-4xl">Read your daily horoscope</h2>
        <div className="mx-auto mt-5 max-w-md">
          <Flourish red />
        </div>
        {/* twelve illuminated initials in vine-cornered boxes, staggered like
            miniatures pasted along the margin of a psalter */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {SIGNS.map((s, i) => (
            <a
              key={s.n}
              href={`/horoscope/${s.n.toLowerCase()}`}
              className={`llm-leaf llm-plate group relative flex flex-col items-center px-2 py-6 text-center ${
                i % 2 ? "lg:translate-y-5" : ""
              }`}
              style={{ "--rot": `${(((i % 3) - 1) * 0.5).toFixed(1)}deg` } as CSSProperties}
            >
              <Vine className="left-1 top-1" />
              <Vine className="right-1 top-1 -scale-x-100" />
              <Vine className="bottom-1 left-1 -scale-y-100" />
              <Vine className="bottom-1 right-1 -scale-x-100 -scale-y-100" />
              <span
                className="llm-gilt flex h-11 w-11 items-center justify-center"
                style={{ "--t": "22s", "--d": `${(i * 1.9).toFixed(1)}s` } as CSSProperties}
              >
                <span className="text-[22px] leading-none text-[#2c1f10]">{s.g}</span>
              </span>
              <span className="mt-3.5 text-[11px] uppercase tracking-[0.22em] text-[#3b2d1f]">{s.n}</span>
              <span className="mt-1.5 text-[9.5px] uppercase tracking-[0.12em] text-[#5c422a]/75">{s.d}</span>
            </a>
          ))}
        </div>
      </section>

      {/* ==================== THE SIX TREATISES ==================== */}
      <section className="relative mx-auto max-w-6xl px-6 py-10 lg:py-16">
        <p className="llm-rubric text-center text-[11px] uppercase">Capitula</p>
        <h2 className="mt-3 text-center text-3xl text-[#2c1f10] sm:text-4xl">Everything the stars have to offer</h2>
        <div className="mx-auto mt-5 max-w-md">
          <Flourish />
        </div>
        {/* a gathering of leaves: two wide folios, four small plates between,
            each leaf slightly askew like loose parchment */}
        <div className="mt-12 grid gap-7 md:grid-cols-2">
          {PLATES.map((p) => (
            <article
              key={p.title}
              className={`llm-leaf p-7 sm:p-9 ${p.wide ? "md:col-span-2" : ""}`}
              style={{ "--rot": p.rot } as CSSProperties}
            >
              <div className="llm-stain h-40 w-52" style={{ right: "6%", top: "10%" }} aria-hidden="true" />
              {/* rubricated head of the chapter */}
              <div className="flex items-baseline gap-3">
                <span className="llm-rubric text-[13px] font-bold">·&nbsp;{p.rn}&nbsp;·</span>
                <span className="llm-rule flex-1" />
                <span className="llm-tag shrink-0 px-2 py-[3px] text-[9px] uppercase">{p.tag}</span>
              </div>
              <div
                className={`mt-7 ${
                  p.wide
                    ? `md:flex md:items-center md:gap-12 ${p.flip ? "md:flex-row-reverse" : ""}`
                    : ""
                }`}
              >
                <div className={`mx-auto flex shrink-0 items-center justify-center ${p.wide ? "md:mx-0 md:scale-125" : ""}`}>
                  {p.fig}
                </div>
                <div className={`mt-7 ${p.wide ? "md:mt-0" : ""}`}>
                  <h3 className={`${p.wide ? "text-2xl" : "text-xl"} text-[#2c1f10]`}>{p.title}</h3>
                  <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-[#5c422a]/90">{p.desc}</p>
                  {p.rn === "I" && (
                    <p className="mt-4 text-[10.5px] uppercase tracking-[0.18em] text-[#5c422a]/70">
                      Enter date, time, place&nbsp;&nbsp;&rarr;&nbsp;&nbsp;your wheel in seconds.
                    </p>
                  )}
                  <a href={p.href} className="llm-link mt-5 inline-block text-[11px] uppercase tracking-[0.26em]">
                    Explore&nbsp;&rarr;
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ==================== DESTINY MATRIX — DIAGRAM PLATE ==================== */}
      <section className="relative mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="llm-rubric text-[11px] uppercase">Tractatus</p>
            <h2 className="mt-4 text-3xl text-[#2c1f10] sm:text-4xl">The Destiny Matrix</h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#5c422a]">
              An optional birth-date octagram tool. It maps purpose, love, money, and age themes from your birth date.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Purpose", "Love", "Money", "Age themes"].map((c) => (
                <span key={c} className="llm-tag px-2.5 py-1.5 text-[10px] uppercase">
                  {c}
                </span>
              ))}
            </div>
            <a href="/destiny-matrix" className="llm-btn-ghost mt-8 px-6 py-3 text-[12px] uppercase tracking-[0.2em]">
              Open Destiny Matrix&nbsp;&rarr;
            </a>
          </div>
          <div className="relative mx-auto w-full max-w-[430px]">
            <figure className="llm-leaf relative p-6 sm:p-8" style={{ "--rot": "0.6deg" } as CSSProperties}>
              <p className="llm-rubric mb-4 text-center text-[11px]">Figura Octogrammaton</p>
              <DestinyOctagram />
              {/* marginal glosses in red, as the copyist left them */}
              <p className="pointer-events-none absolute left-4 top-16 hidden w-[92px] -rotate-3 text-[10.5px] italic leading-snug text-[#8f2f1c]/90 sm:block" aria-hidden="true">
                nota bene: the two squares are fate and labor.
              </p>
              <p className="pointer-events-none absolute bottom-14 right-4 hidden w-[88px] rotate-2 text-right text-[10.5px] italic leading-snug text-[#8f2f1c]/90 sm:block" aria-hidden="true">
                hic the heart holdeth the sum of the day.
              </p>
            </figure>
          </div>
        </div>
      </section>

      {/* ==================== FAQ — SCHOLASTIC QUAESTIONES ==================== */}
      <section className="mx-auto max-w-3xl px-6 py-16 lg:py-20">
        <p className="llm-rubric text-center text-[11px] uppercase">Quaestiones</p>
        <h2 className="mt-3 text-center text-3xl text-[#2c1f10] sm:text-4xl">Questions, answered</h2>
        <div className="mx-auto mt-5 max-w-md">
          <Flourish red />
        </div>
        {/* the disputation: rubric Q. and A. hanging in the margin */}
        <div className="mt-12 space-y-10">
          {FAQS.map((f) => (
            <article key={f.n}>
              <div className="grid grid-cols-[2.4rem_1fr] gap-x-2">
                <span className="llm-rubric pt-[3px] text-right text-[15px] font-bold">Q.</span>
                <h3 className="text-lg leading-snug text-[#2c1f10]">{f.q}</h3>
                <span className="llm-rubric pt-[3px] text-right text-[15px] font-bold">A.</span>
                <p className="text-[13.5px] leading-relaxed text-[#5c422a]">{f.a}</p>
              </div>
              <div className="mt-8">
                <Flourish />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ==================== CTA BAND ==================== */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center lg:py-28">
        <div className="flex items-center justify-center gap-4" aria-hidden="true">
          <span className="llm-rule w-20 sm:w-28" />
          <svg viewBox="0 0 14 14" className="h-3.5 w-3.5">
            <path d={starN(7, 7, 4, 7, 2.8)} fill={GOLD} stroke={GOLD_DEEP} strokeWidth="0.5" />
          </svg>
          <span className="llm-rule w-20 sm:w-28" />
        </div>
        <h2 className="mt-8 text-3xl leading-snug text-[#2c1f10] sm:text-4xl">
          Your chart is written in the stars.
          <br />
          <em className="text-[#8f2f1c]">Come read it.</em>
        </h2>
        <a href="/sign-up" className="llm-btn-primary mt-10 px-8 py-4 text-[13px] uppercase tracking-[0.18em]">
          Get started — it&rsquo;s free
        </a>
      </section>

      {/* ==================== FOOTER / COLOPHON ==================== */}
      <footer className="relative">
        <div className="mx-auto max-w-6xl px-6" aria-hidden="true">
          <div className="h-px bg-[#5c422a]/40" />
          <div className="mt-[3px] h-[2px] bg-[#8f2f1c]/70" />
        </div>
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[12px] font-bold tracking-[0.34em] text-[#3b2d1f]">ASTRO&nbsp;SCOPE</p>
              <p className="mt-2 text-[12px] italic text-[#5c422a]/80">Astro Scope — your daily cosmic guidance.</p>
            </div>
            <nav className="flex flex-wrap gap-x-7 gap-y-2 text-[11px] uppercase tracking-[0.2em] text-[#5c422a]/85">
              <a href="/birth-chart" className="llm-nav-link">Birth Chart</a>
              <a href="/horoscope" className="llm-nav-link">Horoscopes</a>
              <a href="/tarot" className="llm-nav-link">Tarot</a>
              <a href="/pricing" className="llm-nav-link">Pricing</a>
            </nav>
          </div>
          <p className="mt-8 text-center text-[10px] uppercase tracking-[0.22em] text-[#5c422a]/50">
            Scriptum et illuminatum&nbsp;&nbsp;·&nbsp;&nbsp;&copy; 2026 Astro Scope
          </p>
        </div>
      </footer>
    </div>
  );
}
