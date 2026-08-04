import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Astro Scope — The Emerald Codex",
  description:
    "An illuminated codex of the art: free birth chart, daily horoscopes, synastry, tarot and the destiny octagram. As above, so below — as within, so you.",
};

/* ------------------------------------------------------------------ */
/* Palette (emerald-gold codex)                                        */
/* ------------------------------------------------------------------ */
const GOLD = "#c9b037";
const GOLD_DIM = "#8f7f2a";
const VERDI = "#3fa37c";
const CREAM = "#e6e0c8";
const GROUND = "#06120c";
const PLATE = "#0a1a12";

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                    */
/* ------------------------------------------------------------------ */
const rad = (deg: number) => (deg * Math.PI) / 180;
const r2 = (n: number) => Math.round(n * 100) / 100;
const apt = (r: number, deg: number, cx: number, cy: number) => ({
  x: r2(cx + r * Math.cos(rad(deg))),
  y: r2(cy + r * Math.sin(rad(deg))),
});
const apoly = (r: number, n: number, start: number, cx: number, cy: number) =>
  Array.from({ length: n }, (_, i) => {
    const p = apt(r, start + (360 / n) * i, cx, cy);
    return `${p.x},${p.y}`;
  }).join(" ");

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */
const ZODIAC = [
  { name: "ARIES", glyph: "♈︎", dates: "Mar 21 – Apr 19" },
  { name: "TAURUS", glyph: "♉︎", dates: "Apr 20 – May 20" },
  { name: "GEMINI", glyph: "♊︎", dates: "May 21 – Jun 20" },
  { name: "CANCER", glyph: "♋︎", dates: "Jun 21 – Jul 22" },
  { name: "LEO", glyph: "♌︎", dates: "Jul 23 – Aug 22" },
  { name: "VIRGO", glyph: "♍︎", dates: "Aug 23 – Sep 22" },
  { name: "LIBRA", glyph: "♎︎", dates: "Sep 23 – Oct 22" },
  { name: "SCORPIO", glyph: "♏︎", dates: "Oct 23 – Nov 21" },
  { name: "SAGITTARIUS", glyph: "♐︎", dates: "Nov 22 – Dec 21" },
  { name: "CAPRICORN", glyph: "♑︎", dates: "Dec 22 – Jan 19" },
  { name: "AQUARIUS", glyph: "♒︎", dates: "Jan 20 – Feb 18" },
  { name: "PISCES", glyph: "♓︎", dates: "Feb 19 – Mar 20" },
];

const FOLIOS = [
  "fol. I",
  "fol. II",
  "fol. III",
  "fol. IV",
  "fol. V",
  "fol. VI",
  "fol. VII",
  "fol. VIII",
  "fol. IX",
  "fol. X",
  "fol. XI",
  "fol. XII",
];

const CHAPTERS = [
  {
    no: "I",
    kicker: "FREE",
    title: "Birth Chart",
    copy: "Map your Sun, Moon, and Rising — the foundation of every reading.",
    gloss: "hic incipit ars natalitia · scito te ipsum",
    glossNo: "nota · i",
    diagram: "wheel",
  },
  {
    no: "II",
    kicker: "DAILY",
    title: "Daily Horoscope",
    copy: "Twelve signs, one sky. Clear forecasts without the fluff.",
    gloss: "cursus diei · sub uno caelo",
    glossNo: "nota · ii",
    diagram: "sun",
  },
  {
    no: "III",
    kicker: "SYNASTRY",
    title: "Compatibility",
    copy: "Zodiac match, Chinese pairs, and deep synastry for two charts.",
    gloss: "duorum animae in speculo",
    glossNo: "nota · iii",
    diagram: "synastry",
  },
  {
    no: "IV",
    kicker: "SPREADS",
    title: "Tarot",
    copy: "Daily card to Celtic Cross — pull, reflect, get a full reading.",
    gloss: "arcana latentia revelantur",
    glossNo: "nota · iv",
    diagram: "card",
  },
  {
    no: "V",
    kicker: "TESTS",
    title: "Psychology",
    copy: "MBTI, Big Five, empathy and more — meet yourself beyond the signs.",
    gloss: "mens ipsa ultra signa",
    glossNo: "nota · v",
    diagram: "mind",
  },
  {
    no: "VI",
    kicker: "YOU",
    title: "Cosmic Passport",
    copy: "Your Cosmic ID, people, journal, and Premium deep dives — one hub.",
    gloss: "liber tui · omnia in uno",
    glossNo: "nota · vi",
    diagram: "passport",
  },
];

const FORMULAE = [
  {
    plate: "PLATE I — GENITVRA",
    formula: "D + H + L → HOROSCOPVS",
    note: "date · hour · place — the natal wheel unfolds",
  },
  {
    plate: "PLATE II — SYNODICVM",
    formula: "☉︎ − ☽︎ = 29.53 D",
    note: "the synodic month, tide of the silver moon",
  },
  {
    plate: "PLATE III — CONIVNCTIO",
    formula: "☉︎A × ☽︎B → △ ∨ □",
    note: "two charts conjoined; trine or square decides",
  },
  {
    plate: "PLATE IV — FATALIS",
    formula: "Σ DD·MM·YYYY → 22",
    note: "the birth-date sum, folded into the octagram",
  },
];

const FAQ = [
  {
    q: "Which features are free?",
    a: "The birth chart, the daily horoscope, tarot pulls and the psychology tests are free. Premium adds deeper reports, saved charts and the full synastry apparatus.",
  },
  {
    q: "How do I cast a chart?",
    a: "Enter your date, hour and place of birth. The wheel computes the houses, aspects and dignities itself — no knowledge of the art required.",
  },
  {
    q: "Where do I find the horoscopes?",
    a: "In the Daily section — twelve signs beneath one sky, refreshed each morning, written plainly and without the fluff.",
  },
  {
    q: "What is the Destiny Matrix?",
    a: "An optional birth-date octagram. It maps purpose, love, money and the themes of each age from the numbers of your birth date.",
  },
];

/* ------------------------------------------------------------------ */
/* Scoped styles (lcx- prefix)                                         */
/* ------------------------------------------------------------------ */
const LCX_STYLES = `
  .lcx-rot-90   { animation: lcx-spin 90s  linear infinite; }
  .lcx-rot-120r { animation: lcx-spin-rev 120s linear infinite; }
  .lcx-rot-180  { animation: lcx-spin 180s linear infinite; }
  .lcx-pulse    { animation: lcx-pulse 9s ease-in-out infinite; }
  .lcx-pulse-2  { animation: lcx-pulse 15s ease-in-out infinite; }
  .lcx-flicker  { animation: lcx-flicker 11s ease-in-out infinite; }
  @keyframes lcx-spin     { to { transform: rotate(360deg); } }
  @keyframes lcx-spin-rev { to { transform: rotate(-360deg); } }
  @keyframes lcx-pulse    { 0%,100% { opacity: .4; } 50% { opacity: 1; } }
  @keyframes lcx-flicker  { 0%,100% { opacity: .9; } 47% { opacity: .5; } 53% { opacity: .8; } }
  @media (prefers-reduced-motion: reduce) {
    .lcx-rot-90, .lcx-rot-120r, .lcx-rot-180,
    .lcx-pulse, .lcx-pulse-2, .lcx-flicker { animation: none !important; }
  }
`;

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */
function Corners() {
  const base = "pointer-events-none absolute h-2.5 w-2.5 border-[#c9b037]/60";
  return (
    <>
      <span aria-hidden className={`${base} left-0 top-0 border-l border-t`} />
      <span aria-hidden className={`${base} right-0 top-0 border-r border-t`} />
      <span aria-hidden className={`${base} bottom-0 left-0 border-b border-l`} />
      <span aria-hidden className={`${base} bottom-0 right-0 border-b border-r`} />
    </>
  );
}

function Hairline({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-[#c9b037]/30" />
      <span aria-hidden className="text-[8px] text-[#c9b037]">
        ✦
      </span>
      <span className="font-mono text-[7px] tracking-[0.35em] text-[#e6e0c8]/40">{label}</span>
      <span aria-hidden className="text-[8px] text-[#c9b037]">
        ✦
      </span>
      <span className="h-px flex-1 bg-[#c9b037]/30" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero plate — the wide engraved arch of the zodiac                   */
/* ------------------------------------------------------------------ */
function HeroPlate() {
  const cx = 600;
  const cy = 640;

  const ticks = Array.from({ length: 91 }, (_, i) => {
    const a = 180 + i * 2;
    const major = i % 15 === 0;
    const mid = i % 5 === 0;
    const r1 = major ? 492 : mid ? 500 : 508;
    const p1 = apt(r1, a, cx, cy);
    const p2 = apt(520, a, cx, cy);
    return { key: i, p1, p2, major, mid };
  });

  const degLabels = Array.from({ length: 6 }, (_, i) => {
    const a = 195 + i * 30;
    const p = apt(442, a, cx, cy);
    return { key: i, p, label: `${(i + 1) * 30}°` };
  });

  const stars = Array.from({ length: 80 }, (_, i) => {
    const a = 180 + ((i * 137.508) % 180);
    const r = 120 + ((i * 83) % 400);
    const p = apt(r, a, cx, cy);
    return { key: i, p, o: 0.15 + ((i * 7) % 10) / 22, rr: 0.5 + ((i * 13) % 5) / 4 };
  });

  return (
    <svg
      viewBox="0 0 1200 560"
      className="mx-auto w-full max-w-[1240px]"
      role="img"
      aria-label="Engraved arch of the zodiac — codex plate"
    >
      <defs>
        <path
          id="lcx-arch-arc"
          d="M 190 640 A 410 410 0 0 1 1010 640"
          fill="none"
        />
        <radialGradient id="lcx-arch-glow" cx="50%" cy="100%" r="80%">
          <stop offset="0%" stopColor={VERDI} stopOpacity="0.10" />
          <stop offset="55%" stopColor={GOLD} stopOpacity="0.05" />
          <stop offset="100%" stopColor={GROUND} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* arch ground */}
      <path d="M 60 640 A 540 540 0 0 1 1140 640 Z" fill="url(#lcx-arch-glow)" />
      <path
        d="M 60 640 A 540 540 0 0 1 1140 640"
        fill="none"
        stroke={GOLD}
        strokeOpacity="0.5"
        strokeWidth="1"
      />
      <path
        d="M 78 640 A 522 522 0 0 1 1122 640"
        fill="none"
        stroke={GOLD}
        strokeOpacity="0.2"
        strokeWidth="0.5"
      />

      {/* star field */}
      {stars.map((s) => (
        <circle key={s.key} cx={s.p.x} cy={s.p.y} r={s.rr} fill={CREAM} opacity={s.o} />
      ))}

      {/* degree ticks */}
      {ticks.map((t) => (
        <line
          key={t.key}
          x1={t.p1.x}
          y1={t.p1.y}
          x2={t.p2.x}
          y2={t.p2.y}
          stroke={t.major ? GOLD : t.mid ? VERDI : GOLD}
          strokeOpacity={t.major ? 0.8 : t.mid ? 0.5 : 0.25}
          strokeWidth={t.major ? 1 : 0.5}
        />
      ))}
      {degLabels.map((d) => (
        <text
          key={d.key}
          x={d.p.x}
          y={d.p.y + 2}
          textAnchor="middle"
          fontSize="9"
          letterSpacing="1"
          fill={VERDI}
          opacity="0.8"
          fontFamily="ui-monospace, monospace"
        >
          {d.label}
        </text>
      ))}

      {/* zodiac medallions along the arch */}
      <path
        d="M 130 640 A 470 470 0 0 1 1070 640"
        fill="none"
        stroke={GOLD}
        strokeOpacity="0.35"
        strokeWidth="0.6"
      />
      <g
        className="lcx-rot-180"
        style={{ transformOrigin: "600px 640px", transformBox: "view-box" }}
      >
        {ZODIAC.map((z, i) => {
          const a = 187.5 + i * 15;
          const p = apt(470, a, cx, cy);
          return (
            <g key={z.name}>
              <circle cx={p.x} cy={p.y} r="15" fill={PLATE} stroke={GOLD} strokeOpacity="0.7" strokeWidth="0.8" />
              <circle cx={p.x} cy={p.y} r="11.5" fill="none" stroke={VERDI} strokeOpacity="0.35" strokeWidth="0.5" />
              <text x={p.x} y={p.y + 4.5} textAnchor="middle" fontSize="12" fill={GOLD}>
                {z.glyph}
              </text>
            </g>
          );
        })}
      </g>

      {/* rotating ring inscription */}
      <g
        className="lcx-rot-120r"
        style={{ transformOrigin: "600px 640px", transformBox: "view-box" }}
      >
        <text fontSize="9" letterSpacing="4" fill={GOLD_DIM} fontFamily="ui-monospace, monospace">
          <textPath href="#lcx-arch-arc">
            · SICVT SVPRA · SICVT INFRA · SICVT INTVS · SICVT TV · STELLAE FIXAE · SEPTEM ERRANTES ·
          </textPath>
        </text>
      </g>

      {/* inner orbit arcs + wanderers */}
      {[360, 300].map((r) => (
        <path
          key={r}
          d={`M ${cx - r} 640 A ${r} ${r} 0 0 1 ${cx + r} 640`}
          fill="none"
          stroke={VERDI}
          strokeOpacity="0.3"
          strokeWidth="0.5"
          strokeDasharray="1 4"
        />
      ))}
      <g
        className="lcx-rot-90"
        style={{ transformOrigin: "600px 640px", transformBox: "view-box" }}
      >
        {[
          { glyph: "☿︎", angle: 205, r: 300, name: "mercury" },
          { glyph: "♀︎", angle: 300, r: 300, name: "venus" },
          { glyph: "♂︎", angle: 250, r: 360, name: "mars" },
          { glyph: "♃︎", angle: 340, r: 360, name: "jupiter" },
        ].map((pl) => {
          const p = apt(pl.r, pl.angle, cx, cy);
          return (
            <g key={pl.name}>
              <circle cx={p.x} cy={p.y} r="10" fill="#0d241a" stroke={GOLD} strokeWidth="0.8" />
              <text x={p.x} y={p.y + 3.5} textAnchor="middle" fontSize="10" fill={GOLD}>
                {pl.glyph}
              </text>
            </g>
          );
        })}
      </g>

      {/* aspect chords */}
      <polygon points={apoly(250, 3, 200, cx, cy)} fill="none" stroke={VERDI} strokeOpacity="0.16" strokeWidth="0.6" />
      <polygon points={apoly(250, 3, 320, cx, cy)} fill="none" stroke={VERDI} strokeOpacity="0.16" strokeWidth="0.6" />

      {/* zenith sun */}
      <g className="lcx-pulse-2">
        <circle cx={cx} cy={250} r="26" fill="none" stroke={GOLD} strokeOpacity="0.6" strokeWidth="0.8" />
        <circle cx={cx} cy={250} r="19" fill="#0a1c12" stroke={GOLD} strokeOpacity="0.7" strokeWidth="0.7" />
        <text x={cx} y={256} textAnchor="middle" fontSize="17" fill={GOLD}>
          ☉︎
        </text>
        {Array.from({ length: 12 }, (_, i) => {
          const p1 = apt(30, i * 30, cx, 250);
          const p2 = apt(i % 3 === 0 ? 40 : 35, i * 30, cx, 250);
          return (
            <line
              key={i}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={GOLD}
              strokeOpacity="0.55"
              strokeWidth="0.7"
            />
          );
        })}
      </g>

      {/* flanking crescents */}
      {[215, 345].map((a, i) => {
        const p = apt(410, a, cx, cy);
        return (
          <g key={a} className="lcx-pulse" style={{ animationDelay: `${i * 3}s` }}>
            <circle cx={p.x} cy={p.y} r="9" fill={GOLD} opacity="0.8" />
            <circle cx={p.x + (i === 0 ? 4 : -4)} cy={p.y - 2} r="8.3" fill="#08160e" />
            <circle cx={p.x} cy={p.y} r="9" fill="none" stroke={GOLD} strokeOpacity="0.4" strokeWidth="0.5" />
          </g>
        );
      })}

      {/* plate captions */}
      <text
        x="120"
        y="556"
        textAnchor="start"
        fontSize="8"
        letterSpacing="3"
        fill={GOLD_DIM}
        fontFamily="ui-monospace, monospace"
      >
        TAB. I — ARCVS ZODIACI
      </text>
      <text
        x="1080"
        y="556"
        textAnchor="end"
        fontSize="8"
        letterSpacing="3"
        fill={GOLD_DIM}
        fontFamily="ui-monospace, monospace"
      >
        MERIDIES · EPOCH J2000.0
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Chapter diagrams (tiny engraved figures)                            */
/* ------------------------------------------------------------------ */
function ChapterDiagram({ kind }: { kind: string }) {
  const s = { stroke: GOLD, strokeWidth: 0.8, fill: "none" } as const;
  const c = 48;
  return (
    <svg viewBox="0 0 96 96" className="h-20 w-20 shrink-0 sm:h-24 sm:w-24" aria-hidden>
      <rect x="4" y="4" width="88" height="88" fill={PLATE} stroke={GOLD} strokeOpacity="0.4" strokeWidth="0.6" />
      <rect x="8" y="8" width="80" height="80" fill="none" stroke={GOLD} strokeOpacity="0.15" strokeWidth="0.5" />

      {kind === "wheel" && (
        <g>
          <circle cx={c} cy={c} r="30" {...s} />
          <circle cx={c} cy={c} r="22" {...s} strokeOpacity="0.4" strokeDasharray="2 3" />
          {Array.from({ length: 12 }, (_, i) => {
            const p1 = apt(22, i * 30, c, c);
            const p2 = apt(30, i * 30, c, c);
            return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={VERDI} strokeOpacity="0.5" strokeWidth="0.6" />;
          })}
          <line x1={c - 34} y1={c} x2={c + 34} y2={c} stroke={GOLD} strokeOpacity="0.8" strokeWidth="0.8" />
          <circle cx={c} cy={c} r="4" fill={GOLD} />
          <text x={c - 38} y={c - 34} fontSize="7" fill={VERDI} fontFamily="ui-monospace, monospace">ASC</text>
        </g>
      )}

      {kind === "sun" && (
        <g>
          <circle cx={c} cy={c} r="13" {...s} />
          <circle cx={c} cy={c} r="7" fill={GOLD} fillOpacity="0.25" stroke={GOLD} strokeWidth="0.7" />
          {Array.from({ length: 16 }, (_, i) => {
            const p1 = apt(17, i * 22.5, c, c);
            const p2 = apt(i % 2 === 0 ? 28 : 23, i * 22.5, c, c);
            return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={GOLD} strokeOpacity="0.7" strokeWidth="0.7" />;
          })}
          <path d={`M ${c - 36} ${c + 24} A 40 40 0 0 1 ${c + 36} ${c + 24}`} fill="none" stroke={VERDI} strokeOpacity="0.4" strokeWidth="0.6" strokeDasharray="2 3" />
        </g>
      )}

      {kind === "synastry" && (
        <g>
          <circle cx={c - 12} cy={c} r="19" {...s} />
          <circle cx={c + 12} cy={c} r="19" {...s} />
          <text x={c} y={c + 5} textAnchor="middle" fontSize="14" fill={GOLD}>✦</text>
          <text x={c - 12} y={c - 24} textAnchor="middle" fontSize="10" fill={VERDI}>☉︎</text>
          <text x={c + 12} y={c - 24} textAnchor="middle" fontSize="10" fill={VERDI}>☽︎</text>
          <line x1={c - 30} y1={c + 28} x2={c + 30} y2={c + 28} stroke={GOLD} strokeOpacity="0.3" strokeWidth="0.5" strokeDasharray="1 3" />
        </g>
      )}

      {kind === "card" && (
        <g>
          <rect x={c - 14} y={c - 24} width="28" height="48" {...s} />
          <rect x={c - 11} y={c - 21} width="22" height="42" fill="none" stroke={GOLD} strokeOpacity="0.35" strokeWidth="0.5" />
          <text x={c} y={c + 5} textAnchor="middle" fontSize="15" fill={GOLD}>✶</text>
          <text x={c} y={c - 14} textAnchor="middle" fontSize="6" fill={VERDI} fontFamily="ui-monospace, monospace">XVII</text>
          <text x={c} y={c + 18} textAnchor="middle" fontSize="5" letterSpacing="1" fill={GOLD_DIM} fontFamily="ui-monospace, monospace">STELLA</text>
        </g>
      )}

      {kind === "mind" && (
        <g>
          <circle cx={c} cy={c} r="28" {...s} strokeOpacity="0.4" />
          <circle cx={c} cy={c} r="19" {...s} strokeOpacity="0.55" />
          <polygon points={apoly(12, 3, -90, c, c)} fill="none" stroke={VERDI} strokeOpacity="0.7" strokeWidth="0.7" />
          <polygon points={apoly(12, 3, 90, c, c)} fill="none" stroke={VERDI} strokeOpacity="0.7" strokeWidth="0.7" />
          <circle cx={c} cy={c} r="2.5" fill={GOLD} />
          {Array.from({ length: 24 }, (_, i) => {
            const p1 = apt(31, i * 15, c, c);
            const p2 = apt(34, i * 15, c, c);
            return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={GOLD} strokeOpacity="0.3" strokeWidth="0.5" />;
          })}
        </g>
      )}

      {kind === "passport" && (
        <g>
          <circle cx={c} cy={c} r="27" {...s} />
          <circle cx={c} cy={c} r="21" fill="none" stroke={VERDI} strokeOpacity="0.4" strokeWidth="0.5" strokeDasharray="2 3" />
          <polygon points={apoly(15, 4, -90, c, c)} {...s} strokeOpacity="0.7" />
          <polygon points={apoly(15, 4, -45, c, c)} {...s} strokeOpacity="0.7" />
          <text x={c} y={c + 4} textAnchor="middle" fontSize="11" fill={GOLD}>✦</text>
          <text x={c} y={c + 38} textAnchor="middle" fontSize="5" letterSpacing="1.5" fill={GOLD_DIM} fontFamily="ui-monospace, monospace">SIGILLVM</text>
        </g>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Figura VIII — illuminated octagram plate                            */
/* ------------------------------------------------------------------ */
function FiguraOctagram() {
  const c = 150;
  const labels = ["PURPOSE", "LOVE", "MONEY", "AGE", "KARMA", "TALENT", "PATH", "FATE"];
  return (
    <svg
      viewBox="0 0 300 300"
      className="w-full max-w-[300px]"
      role="img"
      aria-label="Figura VIII — the destiny octagram"
    >
      <defs>
        <radialGradient id="lcx-fig-glow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.16" />
          <stop offset="70%" stopColor={VERDI} stopOpacity="0.05" />
          <stop offset="100%" stopColor={GROUND} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={c} cy={c} r="146" fill="url(#lcx-fig-glow)" />
      <circle cx={c} cy={c} r="140" fill="#0a1a12" stroke={GOLD} strokeOpacity="0.6" strokeWidth="0.9" />
      <circle cx={c} cy={c} r="133" fill="none" stroke={VERDI} strokeOpacity="0.3" strokeWidth="0.5" strokeDasharray="2 3" />

      {/* tick ring */}
      {Array.from({ length: 64 }, (_, i) => {
        const p1 = apt(136, i * 5.625, c, c);
        const p2 = apt(i % 8 === 0 ? 128 : 132, i * 5.625, c, c);
        return (
          <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={GOLD} strokeOpacity="0.35" strokeWidth="0.5" />
        );
      })}

      {/* the octagram */}
      <polygon points={apoly(112, 4, -90, c, c)} fill="none" stroke={GOLD} strokeOpacity="0.75" strokeWidth="0.9" />
      <polygon points={apoly(112, 4, -45, c, c)} fill="none" stroke={GOLD} strokeOpacity="0.75" strokeWidth="0.9" />
      <polygon points={apoly(52, 8, -90, c, c)} fill="none" stroke={VERDI} strokeOpacity="0.45" strokeWidth="0.6" />

      {/* vertex medallions + labels */}
      {labels.map((l, i) => {
        const a = -90 + i * 45;
        const p = apt(112, a, c, c);
        const tp = apt(88, a + 22.5, c, c);
        return (
          <g key={l}>
            <circle cx={p.x} cy={p.y} r="9" fill={PLATE} stroke={GOLD} strokeWidth="0.8" />
            <text x={p.x} y={p.y + 3} textAnchor="middle" fontSize="8.5" fill={GOLD} fontFamily="ui-monospace, monospace">
              {i + 1}
            </text>
            <text x={tp.x} y={tp.y + 2} textAnchor="middle" fontSize="6" letterSpacing="0.5" fill={VERDI} fontFamily="ui-monospace, monospace">
              {l}
            </text>
          </g>
        );
      })}

      {/* heart of the figure */}
      <circle cx={c} cy={c} r="22" fill="none" stroke={GOLD} strokeWidth="0.9" />
      <circle cx={c} cy={c} r="17" fill="none" stroke={GOLD} strokeOpacity="0.35" strokeWidth="0.5" />
      <text x={c} y={c + 5} textAnchor="middle" fontSize="15" fill={GOLD} fontFamily="ui-monospace, monospace">
        22
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Wax seal                                                            */
/* ------------------------------------------------------------------ */
function WaxSeal() {
  const c = 60;
  return (
    <svg viewBox="0 0 120 120" className="h-16 w-16" role="img" aria-label="Wax seal">
      <defs>
        <path id="lcx-seal-ring" d="M 60 60 m -42 0 a 42 42 0 1 1 84 0 a 42 42 0 1 1 -84 0" />
      </defs>
      <circle cx={c} cy={c} r="56" fill={PLATE} stroke={GOLD} strokeOpacity="0.7" strokeWidth="1" />
      <circle cx={c} cy={c} r="51" fill="none" stroke={GOLD} strokeOpacity="0.35" strokeWidth="0.5" />
      {Array.from({ length: 36 }, (_, i) => {
        const p1 = apt(47, i * 10, c, c);
        const p2 = apt(51, i * 10, c, c);
        return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={GOLD} strokeOpacity="0.3" strokeWidth="0.5" />;
      })}
      <g className="lcx-rot-90" style={{ transformOrigin: "60px 60px", transformBox: "view-box" }}>
        <text fontSize="7" letterSpacing="2.2" fill={GOLD} fontFamily="ui-monospace, monospace" opacity="0.9">
          <textPath href="#lcx-seal-ring">SIGILLVM · ASTRO SCOPE · MMXXVI ·</textPath>
        </text>
      </g>
      <circle cx={c} cy={c} r="30" fill="none" stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.7" />
      <text x={c} y={c + 7} textAnchor="middle" fontSize="20" fill={GOLD}>✦</text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Section heading block                                               */
/* ------------------------------------------------------------------ */
function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mb-8 text-center">
      <div className="flex items-center justify-center gap-3 font-mono text-[8px] tracking-[0.4em] text-[#3fa37c]/80">
        <span className="h-px w-8 bg-[#3fa37c]/40 sm:w-20" />
        {eyebrow}
        <span className="h-px w-8 bg-[#3fa37c]/40 sm:w-20" />
      </div>
      <h2 className="mt-3 font-serif text-2xl tracking-[0.14em] text-[#c9b037] sm:text-4xl">{title}</h2>
      {sub ? (
        <p className="mt-2 font-mono text-[8px] tracking-[0.3em] text-[#e6e0c8]/40 sm:text-[9px]">{sub}</p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function CodexPage() {
  return (
    <main
      className="min-h-screen bg-[#06120c] text-[#e6e0c8] antialiased"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 50% 0%, rgba(63,163,124,0.07), transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(201,176,55,0.05), transparent 50%)",
      }}
    >
      <style>{LCX_STYLES}</style>

      {/* ======================= 1 · CODEX HEADER BAR ======================= */}
      <header className="border-b border-[#c9b037]/25">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
          <div className="flex items-center gap-4 py-3">
            <a href="#lcx-top" className="flex items-baseline gap-2">
              <span aria-hidden className="text-[11px] text-[#c9b037]">✦</span>
              <span className="font-serif text-sm font-bold tracking-[0.3em] text-[#c9b037]">
                ASTRO SCOPE
              </span>
              <span className="hidden font-mono text-[7px] tracking-[0.25em] text-[#3fa37c]/70 sm:inline">
                CODEX SMARAGDINVS
              </span>
            </a>
            <span className="hidden font-mono text-[7px] tracking-[0.2em] text-[#e6e0c8]/30 lg:inline">
              ED. II · FOL. 112 · MMXXVI
            </span>
            <nav className="ml-auto flex items-center gap-4 font-mono text-[9px] tracking-[0.25em] sm:gap-6">
              <a href="#lcx-chapters" className="hidden text-[#e6e0c8]/60 transition-colors hover:text-[#c9b037] sm:inline">
                HOROSCOPES
              </a>
              <a href="#lcx-chapters" className="hidden text-[#e6e0c8]/60 transition-colors hover:text-[#c9b037] sm:inline">
                TAROT
              </a>
              <a href="#lcx-chapters" className="hidden text-[#e6e0c8]/60 transition-colors hover:text-[#c9b037] md:inline">
                COMPATIBILITY
              </a>
              <a
                href="#lcx-colophon"
                className="border border-[#c9b037]/50 px-3 py-1.5 text-[#c9b037] transition-colors hover:bg-[#c9b037] hover:text-[#06120c]"
              >
                SIGN IN
              </a>
            </nav>
          </div>
          {/* engraved double rule */}
          <div aria-hidden className="pb-2">
            <div className="h-px bg-[#c9b037]/40" />
            <div className="mt-[3px] flex items-center gap-2">
              <span className="h-px flex-1 bg-[#c9b037]/15" />
              <span className="font-mono text-[6px] tracking-[0.4em] text-[#e6e0c8]/25">
                INCIPIT LIBER PRIMVS · DE SIGNIS ET FATO
              </span>
              <span className="h-px flex-1 bg-[#c9b037]/15" />
            </div>
          </div>
        </div>
      </header>

      {/* ======================= 2 · HERO — CHAPTER OPENING ======================= */}
      <section id="lcx-top" className="relative overflow-hidden border-b border-[#c9b037]/25">
        {/* marginal scales */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-16 left-3 hidden w-px lg:block"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(201,176,55,0.4) 0 1px, transparent 1px 18px)",
            width: "8px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-16 right-3 hidden lg:block"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(63,163,124,0.4) 0 1px, transparent 1px 18px)",
            width: "8px",
          }}
        />
        <span aria-hidden className="absolute left-5 top-24 hidden -rotate-90 font-mono text-[6px] tracking-[0.3em] text-[#e6e0c8]/25 lg:inline">
          SCALA · GRADVVM
        </span>
        <span aria-hidden className="absolute right-5 top-24 hidden rotate-90 font-mono text-[6px] tracking-[0.3em] text-[#e6e0c8]/25 lg:inline">
          ALTITVDO · SOLIS
        </span>

        <div className="relative mx-auto max-w-[1240px] px-4 pb-10 pt-10 sm:px-6 sm:pt-14">
          {/* eyebrow */}
          <div className="relative z-10 mb-6 flex items-center justify-center gap-3 font-mono text-[8px] tracking-[0.45em] text-[#3fa37c] sm:text-[9px]">
            <span className="h-px w-10 bg-[#3fa37c]/40 sm:w-28" />
            LIBER PRIMUS · CAPVT PRIMVM
            <span className="h-px w-10 bg-[#3fa37c]/40 sm:w-28" />
          </div>

          {/* the wide engraved plate */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-x-0 -top-6 opacity-70 sm:-top-10">
              <HeroPlate />
            </div>

            {/* headline block over the plate */}
            <div className="relative z-10 mx-auto max-w-3xl pt-[34vw] text-center sm:pt-[30vw] lg:pt-[360px]">
              <h1 className="font-serif text-3xl leading-tight tracking-[0.04em] text-[#e6e0c8] sm:text-5xl sm:leading-[1.15]">
                As above, so below.
                <br />
                <span className="text-[#c9b037]">As within, so you.</span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-[13px] leading-relaxed text-[#e6e0c8]/60 sm:text-sm">
                A codex of the living sky — your birth chart, the daily word of the heavens,
                the mirror of two hearts, and the cards that answer. Written for you, computed
                to the minute, opened for free.
              </p>

              {/* wax-seal CTAs */}
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="#lcx-colophon"
                  className="inline-flex items-center gap-3 border border-[#e3cd5a]/60 bg-[#c9b037] px-7 py-3 font-mono text-[10px] font-bold tracking-[0.22em] text-[#06120c] shadow-[0_0_24px_rgba(201,176,55,0.25)] transition-colors hover:bg-[#e3cd5a]"
                >
                  <span aria-hidden className="flex h-4 w-4 items-center justify-center rounded-full border border-[#06120c]/50 text-[8px]">✦</span>
                  CAST YOUR FREE BIRTH CHART
                </a>
                <a
                  href="#lcx-today"
                  className="inline-flex items-center gap-2 border border-[#c9b037]/40 px-6 py-3 font-mono text-[10px] tracking-[0.22em] text-[#c9b037] transition-colors hover:bg-[#c9b037]/10"
                >
                  READ TODAY&rsquo;S HOROSCOPE <span aria-hidden>→</span>
                </a>
              </div>

              {/* hero readout strip */}
              <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-2 border-t border-[#c9b037]/20 pt-4 font-mono text-[7px] tracking-[0.25em] text-[#e6e0c8]/35">
                <span>SIDEREAL 13:42:07</span>
                <span className="lcx-flicker text-[#3fa37c]">● SKY LIVE</span>
                <span>☽︎ WAX. GIB. 83%</span>
                <span>EPHEMERIS J2000.0</span>
                <span>NO COIN REQUIRED · $0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= 3 · TABLE OF CONTENTS — INDEX SIGNORVM ======================= */}
      <section className="border-b border-[#c9b037]/25 bg-[#08160e]/70">
        <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6">
          <SectionHead
            eyebrow="TABVLA CAPITVM"
            title="INDEX SIGNORVM"
            sub="THE TWELVE HOUSES OF THE YEAR · FOL. I – XII"
          />
          <div className="grid gap-x-12 gap-y-0 sm:grid-cols-2">
            {ZODIAC.map((z, i) => (
              <div
                key={z.name}
                className="group flex items-baseline gap-3 border-b border-[#c9b037]/10 py-2.5"
              >
                <span className="w-6 shrink-0 text-center text-[15px] leading-none text-[#c9b037]">
                  {z.glyph}
                </span>
                <span className="font-serif text-[13px] tracking-[0.18em] text-[#e6e0c8]/85 transition-colors group-hover:text-[#c9b037]">
                  {z.name}
                </span>
                <span
                  aria-hidden
                  className="mx-1 flex-1 border-b border-dotted border-[#c9b037]/30"
                />
                <span className="shrink-0 font-mono text-[8px] tracking-[0.12em] text-[#e6e0c8]/45">
                  {z.dates}
                </span>
                <span className="w-14 shrink-0 text-right font-mono text-[8px] tracking-[0.2em] text-[#3fa37c]">
                  {FOLIOS[i]}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Hairline label="QVIDQVID AGIS · PRVDENTER AGAS · ET RESPICE FINEM" />
          </div>
        </div>
      </section>

      {/* ======================= 4 · SIX CHAPTERS — MANUSCRIPT LIST ======================= */}
      <section id="lcx-chapters" className="border-b border-[#c9b037]/25">
        <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6">
          <SectionHead
            eyebrow="CAPITVLA · I – VI"
            title="THE SIX WORKS OF THE ART"
            sub="EACH CHAPTER OPENS FREELY · NO KEEPER AT THE DOOR"
          />

          <div>
            {CHAPTERS.map((ch, i) => (
              <article
                key={ch.no}
                className={`grid gap-4 py-8 lg:grid-cols-[170px_110px_minmax(0,1fr)_130px] lg:gap-8 ${
                  i > 0 ? "border-t border-[#c9b037]/15" : ""
                }`}
              >
                {/* marginal gloss (gutter) */}
                <aside className="hidden flex-col justify-between border-r border-[#c9b037]/15 pr-4 lg:flex">
                  <span className="font-mono text-[6px] tracking-[0.3em] text-[#3fa37c]/60">
                    {ch.glossNo}
                  </span>
                  <p className="font-serif text-[11px] italic leading-relaxed text-[#e6e0c8]/35">
                    {ch.gloss}
                  </p>
                  <span aria-hidden className="text-[8px] text-[#c9b037]/40">
                    ❧
                  </span>
                </aside>

                {/* big roman numeral */}
                <div className="flex items-start gap-4 lg:block">
                  <div className="font-serif text-6xl leading-none text-[#c9b037]/85 sm:text-7xl">
                    {ch.no}
                  </div>
                  <div className="mt-1 hidden font-mono text-[7px] tracking-[0.3em] text-[#e6e0c8]/30 lg:block">
                    CAPVT {ch.no} · {ch.kicker}
                  </div>
                </div>

                {/* body */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-serif text-2xl tracking-[0.06em] text-[#e6e0c8] sm:text-3xl">
                      {ch.title}
                    </h3>
                    <span className="border border-[#c9b037]/40 px-1.5 py-0.5 font-mono text-[7px] tracking-[0.25em] text-[#c9b037]">
                      {ch.kicker}
                    </span>
                  </div>
                  <div className="my-3 flex items-center gap-2">
                    <span className="h-px w-14 bg-[#c9b037]/50" />
                    <span aria-hidden className="text-[7px] text-[#c9b037]/70">◆</span>
                    <span className="h-px w-24 bg-[#c9b037]/20" />
                  </div>
                  <p className="max-w-lg text-[12px] leading-relaxed text-[#e6e0c8]/55 sm:text-[13px]">
                    {ch.copy}
                  </p>
                  <a
                    href="#lcx-colophon"
                    className="mt-4 inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.25em] text-[#c9b037] transition-colors hover:text-[#e3cd5a]"
                  >
                    EXPLORE <span aria-hidden>→</span>
                  </a>
                </div>

                {/* tiny diagram */}
                <div className="hidden items-center justify-center lg:flex">
                  <ChapterDiagram kind={ch.diagram} />
                </div>
              </article>
            ))}
          </div>

          <Hairline label="EXPLICIT CAPITVLA · SEQVITVR FIGVRA" />
        </div>
      </section>

      {/* ======================= 5 · FIGURA VIII — DESTINY MATRIX ======================= */}
      <section className="border-b border-[#c9b037]/25 bg-[#08160e]/70">
        <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6">
          <SectionHead
            eyebrow="OPVS OPTIVVM"
            title="DESTINY MATRIX"
            sub="THE OCTAGRAM OF THE BIRTH DATE"
          />
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:justify-center lg:gap-16">
            {/* illuminated plate */}
            <figure className="relative border border-[#c9b037]/30 bg-[#0a1a12]/80 p-5">
              <span aria-hidden className="pointer-events-none absolute inset-[4px] border border-[#c9b037]/15" />
              <Corners />
              <figcaption className="mb-3 text-center font-mono text-[8px] tracking-[0.4em] text-[#3fa37c]">
                FIGURA VIII — OCTAGRAMMA FATALIS
              </figcaption>
              <FiguraOctagram />
              <div className="mt-3 flex justify-between font-mono text-[6px] tracking-[0.2em] text-[#e6e0c8]/30">
                <span>NVLLA DIES SINE LINEA</span>
                <span>SCALA 1 : 22</span>
              </div>
            </figure>

            {/* copy */}
            <div className="max-w-md text-center lg:text-left">
              <p className="text-[13px] leading-relaxed text-[#e6e0c8]/60">
                An optional birth-date octagram tool. It maps purpose, love, money, and age
                themes from your birth date.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2 text-left">
                {["PURPOSE", "LOVE", "MONEY", "AGE THEMES"].map((t, i) => (
                  <div key={t} className="border border-[#c9b037]/15 bg-[#0a1a12]/50 px-3 py-2">
                    <span className="block font-mono text-[6px] tracking-[0.3em] text-[#3fa37c]">
                      ARCANA {["I", "VI", "X", "XXII"][i]}
                    </span>
                    <span className="font-mono text-[8px] tracking-[0.2em] text-[#e6e0c8]/70">{t}</span>
                  </div>
                ))}
              </div>
              <a
                href="#lcx-colophon"
                className="mt-6 inline-flex items-center gap-2 border border-[#c9b037]/50 px-6 py-3 font-mono text-[10px] tracking-[0.25em] text-[#c9b037] transition-colors hover:bg-[#c9b037] hover:text-[#06120c]"
              >
                OPEN DESTINY MATRIX <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= 6 · FORMULA STRIP ======================= */}
      <section className="border-b border-[#c9b037]/25">
        <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6">
          <SectionHead eyebrow="ARITHMETICA" title="FORMVLAE" sub="PLATES OF THE ART · VERIFIED BY OBSERVATION" />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {FORMULAE.map((f) => (
              <div key={f.plate} className="relative border border-[#c9b037]/25 bg-[#0a1a12]/70 p-4 text-center">
                <span aria-hidden className="pointer-events-none absolute inset-[3px] border border-[#c9b037]/10" />
                <Corners />
                <div className="font-mono text-[7px] tracking-[0.3em] text-[#3fa37c]">{f.plate}</div>
                <div className="my-3 font-mono text-base tracking-[0.1em] text-[#c9b037]">{f.formula}</div>
                <div className="text-[9px] italic leading-snug text-[#e6e0c8]/45">{f.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= 7 · TODAY — HODIE ======================= */}
      <section id="lcx-today" className="border-b border-[#c9b037]/25 bg-[#08160e]/70">
        <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6">
          <SectionHead eyebrow="HODIE" title="THE PRESENT SKY" sub="REFRESHED EACH MORNING · SVB VNO CAELO" />
          <div className="grid gap-3 md:grid-cols-3">
            {/* Moon today */}
            <div className="relative border border-[#c9b037]/25 bg-[#0a1a12]/70 p-4 text-center">
              <Corners />
              <div className="font-mono text-[7px] tracking-[0.35em] text-[#3fa37c]">LVNA HODIE</div>
              <div className="my-3 flex items-center justify-center gap-3">
                <svg viewBox="0 0 24 24" className="h-9 w-9" aria-hidden>
                  <circle cx="12" cy="12" r="8.5" fill={GOLD} opacity="0.9" />
                  <circle cx="7.5" cy="12" r="8" fill={PLATE} opacity="0.97" />
                  <circle cx="12" cy="12" r="8.5" fill="none" stroke={GOLD} strokeOpacity="0.4" strokeWidth="0.6" />
                </svg>
                <div className="text-left">
                  <div className="font-serif text-lg tracking-[0.08em] text-[#e6e0c8]">Moon today</div>
                  <div className="font-mono text-[8px] tracking-[0.2em] text-[#e6e0c8]/45">
                    WAXING GIBBOUS · 83%
                  </div>
                </div>
              </div>
              <div className="font-mono text-[7px] tracking-[0.25em] text-[#e6e0c8]/35">
                SYNODIC 29.53 D · TIDE RISING
              </div>
            </div>

            {/* Sign of the day */}
            <div className="relative border border-[#c9b037]/25 bg-[#0a1a12]/70 p-4 text-center">
              <Corners />
              <div className="font-mono text-[7px] tracking-[0.35em] text-[#3fa37c]">SIGNVM DIEI</div>
              <div className="my-3 flex items-center justify-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c9b037]/60 text-[22px] text-[#c9b037]">
                  ♏︎
                </span>
                <div className="text-left">
                  <div className="font-serif text-lg tracking-[0.08em] text-[#e6e0c8]">Sign of the day</div>
                  <div className="font-mono text-[8px] tracking-[0.2em] text-[#e6e0c8]/45">
                    SCORPIO · OCT 23 – NOV 21
                  </div>
                </div>
              </div>
              <div className="font-mono text-[7px] tracking-[0.25em] text-[#e6e0c8]/35">
                WATER · FIXED · Ruled by ♄︎&rsquo;s iron heir
              </div>
            </div>

            {/* Card of the day */}
            <div className="relative border border-[#c9b037]/25 bg-[#0a1a12]/70 p-4 text-center">
              <Corners />
              <div className="font-mono text-[7px] tracking-[0.35em] text-[#3fa37c]">CHARTA DIEI</div>
              <div className="my-3 flex items-center justify-center gap-3">
                <span className="flex h-12 w-9 flex-col items-center justify-center border border-[#c9b037]/60 bg-[#06120c]/60">
                  <span className="font-mono text-[6px] text-[#3fa37c]">XVII</span>
                  <span className="text-[13px] text-[#c9b037]">✶</span>
                </span>
                <div className="text-left">
                  <div className="font-serif text-lg tracking-[0.08em] text-[#e6e0c8]">Card of the day</div>
                  <div className="font-mono text-[8px] tracking-[0.2em] text-[#e6e0c8]/45">
                    XVII · THE STAR
                  </div>
                </div>
              </div>
              <div className="font-mono text-[7px] tracking-[0.25em] text-[#e6e0c8]/35">
                HOPE · THE GUIDING LIGHT
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= 8 · QVAESTIONES ======================= */}
      <section className="border-b border-[#c9b037]/25">
        <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6">
          <SectionHead
            eyebrow="DVBIA · ET RESPONSA"
            title="QUAESTIONES"
            sub="GATHERED FROM THE MARGINS OF THE MANUSCRIPT"
          />
          <dl className="mx-auto max-w-3xl">
            {FAQ.map((f, i) => (
              <div key={f.q} className={`py-6 ${i > 0 ? "border-t border-[#c9b037]/15" : ""}`}>
                <dt className="flex items-baseline gap-4">
                  <span className="shrink-0 font-serif text-2xl text-[#c9b037]">
                    {["Q. I", "Q. II", "Q. III", "Q. IV"][i]}
                  </span>
                  <span className="font-serif text-lg tracking-[0.03em] text-[#e6e0c8] sm:text-xl">
                    {f.q}
                  </span>
                </dt>
                <dd className="mt-3 flex items-start gap-4 pl-2 sm:pl-14">
                  <span className="mt-0.5 shrink-0 font-serif text-base italic text-[#3fa37c]">R.</span>
                  <p className="border-l-2 border-[#c9b037]/25 pl-4 text-[12px] leading-relaxed text-[#e6e0c8]/55 sm:text-[13px]">
                    {f.a}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ======================= 9 · FINAL CTA ======================= */}
      <section id="lcx-colophon" className="relative overflow-hidden border-b border-[#c9b037]/25 bg-[#08160e]/70">
        <div className="mx-auto max-w-[1240px] px-4 py-16 text-center sm:px-6">
          <div className="mx-auto mb-6 flex justify-center">
            <WaxSeal />
          </div>
          <div className="mb-3 font-mono text-[8px] tracking-[0.4em] text-[#3fa37c]/80">
            VLTIMA CHARTA · THE LAST LEAF
          </div>
          <h2 className="mx-auto max-w-2xl font-serif text-3xl leading-tight tracking-[0.04em] text-[#e6e0c8] sm:text-5xl sm:leading-[1.15]">
            Your chart is written in the stars.{" "}
            <span className="text-[#c9b037]">Come read it.</span>
          </h2>
          <a
            href="#lcx-top"
            className="mt-8 inline-flex items-center gap-3 border border-[#e3cd5a]/60 bg-[#c9b037] px-8 py-3.5 font-mono text-[11px] font-bold tracking-[0.25em] text-[#06120c] shadow-[0_0_24px_rgba(201,176,55,0.25)] transition-colors hover:bg-[#e3cd5a]"
          >
            GET STARTED — IT&rsquo;S FREE <span aria-hidden>→</span>
          </a>
          <div className="mt-5 font-mono text-[8px] tracking-[0.3em] text-[#e6e0c8]/35">
            CHART · HOROSCOPE · TAROT · TESTS — $0
          </div>
          <div className="mx-auto mt-10 max-w-xl">
            <Hairline label="OMNIA VANITAS · PRAETER ASTRA" />
          </div>
        </div>
      </section>

      {/* ======================= 10 · COLOPHON FOOTER ======================= */}
      <footer>
        <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6">
          <div className="flex flex-col items-center gap-5 md:flex-row md:justify-between">
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-sm font-bold tracking-[0.3em] text-[#c9b037]">ASTRO SCOPE</span>
              <span className="font-mono text-[7px] tracking-[0.25em] text-[#e6e0c8]/30">
                CODEX SMARAGDINVS · ED. II
              </span>
            </div>
            <nav className="flex gap-6 font-mono text-[8px] tracking-[0.25em] text-[#e6e0c8]/40">
              <a href="#lcx-chapters" className="transition-colors hover:text-[#c9b037]">HOROSCOPES</a>
              <a href="#lcx-chapters" className="transition-colors hover:text-[#c9b037]">TAROT</a>
              <a href="#lcx-chapters" className="transition-colors hover:text-[#c9b037]">COMPATIBILITY</a>
              <a href="#lcx-top" className="transition-colors hover:text-[#c9b037]">SIGN IN</a>
            </nav>
            <span className="font-mono text-[8px] tracking-[0.25em] text-[#e6e0c8]/25">
              © MMXXVI · AS ABOVE · SO BELOW
            </span>
          </div>
          <div className="mt-6 border-t border-[#c9b037]/15 pt-4 text-center">
            <p className="font-mono text-[6px] leading-relaxed tracking-[0.3em] text-[#e6e0c8]/25">
              EXPLICIT LIBER PRIMVS · SCRIPTVM ET ILLVMINATVM IN ANNO MMXXVI ·
              FELICITER · FELICITER · FELICITER
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
