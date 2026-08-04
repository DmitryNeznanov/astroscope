import type { Metadata } from "next";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Astro Scope — Arcana Laboratorium",
  description:
    "Free birth chart, daily horoscopes, synastry and tarot. The calculation chamber is warm. Your chart is written in the stars.",
};

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                    */
/* ------------------------------------------------------------------ */

const rad = (deg: number) => (deg * Math.PI) / 180;
const polar = (cx: number, cy: number, r: number, deg: number) => ({
  x: Math.round((cx + r * Math.cos(rad(deg))) * 100) / 100,
  y: Math.round((cy + r * Math.sin(rad(deg))) * 100) / 100,
});

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type Zodiac = { name: string; glyph: string; dates: string };

const ZODIAC: Zodiac[] = [
  { name: "ARIES", glyph: "\u2648\uFE0E", dates: "MAR 21 – APR 19" },
  { name: "TAURUS", glyph: "\u2649\uFE0E", dates: "APR 20 – MAY 20" },
  { name: "GEMINI", glyph: "\u264A\uFE0E", dates: "MAY 21 – JUN 20" },
  { name: "CANCER", glyph: "\u264B\uFE0E", dates: "JUN 21 – JUL 22" },
  { name: "LEO", glyph: "\u264C\uFE0E", dates: "JUL 23 – AUG 22" },
  { name: "VIRGO", glyph: "\u264D\uFE0E", dates: "AUG 23 – SEP 22" },
  { name: "LIBRA", glyph: "\u264E\uFE0E", dates: "SEP 23 – OCT 22" },
  { name: "SCORPIO", glyph: "\u264F\uFE0E", dates: "OCT 23 – NOV 21" },
  { name: "SAGITTARIUS", glyph: "\u2650\uFE0E", dates: "NOV 22 – DEC 21" },
  { name: "CAPRICORN", glyph: "\u2651\uFE0E", dates: "DEC 22 – JAN 19" },
  { name: "AQUARIUS", glyph: "\u2652\uFE0E", dates: "JAN 20 – FEB 18" },
  { name: "PISCES", glyph: "\u2653\uFE0E", dates: "FEB 19 – MAR 20" },
];

type Essence = { name: string; value: string; hue: string; glow: string; spark: string };

const ESSENCES: Essence[] = [
  { name: "SOLAR", value: "87.2", hue: "#ffb15c", glow: "rgba(255,138,60,.55)", spark: "M12 2 L14.5 9 L22 12 L14.5 15 L12 22 L9.5 15 L2 12 L9.5 9 Z" },
  { name: "IGNIS", value: "63.9", hue: "#ff5c4d", glow: "rgba(255,61,90,.5)", spark: "M12 2 L15 8 L12 12 L15 16 L12 22 L9 16 L12 12 L9 8 Z" },
  { name: "LUNAR", value: "71.4", hue: "#c9a5ff", glow: "rgba(165,92,255,.5)", spark: "M17 3 A10 10 0 1 0 17 21 A8 8 0 1 1 17 3 Z" },
  { name: "AETHER", value: "92.6", hue: "#a55cff", glow: "rgba(196,125,255,.55)", spark: "M12 1 L14 9 L22 7 L15 12 L22 17 L14 15 L12 23 L10 15 L2 17 L9 12 L2 7 L10 9 Z" },
  { name: "TERRA", value: "58.8", hue: "#e8a56b", glow: "rgba(232,165,107,.45)", spark: "M12 3 L21 12 L12 21 L3 12 Z M12 8 L16 12 L12 16 L8 12 Z" },
];

type Reagent = { mark: string; name: string; aspect: string; value: string; w: number };

const REAGENTS: Reagent[] = [
  { mark: "\u{1F71D}", name: "SULPHUR", aspect: "Ignition · Spirit", value: "0.713", w: 71 },
  { mark: "\u263F\uFE0E", name: "MERCURIUS", aspect: "Flux · Mind", value: "0.481", w: 48 },
  { mark: "\u{1F702}", name: "SAL AMMONIAC", aspect: "Purity · Essence", value: "0.256", w: 26 },
  { mark: "\u{1F764}", name: "NIGREDO ASH", aspect: "Shadow · Base", value: "0.131", w: 13 },
  { mark: "\u{1F71E}", name: "CINNABAR TRACE", aspect: "Catalyst · Rare", value: "0.097", w: 10 },
];

const RUNES: string[] = [
  "\u16A0", "\u16A2", "\u16A6", "\u16B1", "\u16B7", "\u16C3", "\u16C7", "\u16CF",
  "\u16D2", "\u16D6", "\u16DA", "\u16DE", "\u16A8", "\u16AB", "\u16B9", "\u16BB",
  "\u16C1", "\u16C9", "\u16D7", "\u16DF", "\u16A4", "\u16B4", "\u16BE", "\u16CA",
];

const RUNE_LIT: number[] = [2, 5, 8, 10, 13, 16, 19, 21];

type Vector = { name: string; value: string; w: number };

const VECTORS: Vector[] = [
  { name: "FATE", value: "0.67", w: 67 },
  { name: "WILL", value: "0.88", w: 88 },
  { name: "CHAOS", value: "0.53", w: 53 },
  { name: "ORDER", value: "0.74", w: 74 },
  { name: "TIME", value: "0.61", w: 61 },
  { name: "VOID", value: "0.39", w: 39 },
];

type Card = { numeral: string; name: string; hue: string; glow: string; motif: "star" | "orbit" | "eye" | "void" | "figure" };

const CARDS: Card[] = [
  { numeral: "I", name: "ARTISAN", hue: "#ff5c7a", glow: "rgba(255,61,90,.5)", motif: "star" },
  { numeral: "II", name: "SEEKER", hue: "#e8b06b", glow: "rgba(232,176,107,.45)", motif: "orbit" },
  { numeral: "X", name: "ORACLE", hue: "#ff8a3c", glow: "rgba(255,138,60,.5)", motif: "eye" },
  { numeral: "XIII", name: "THE VOID", hue: "#a55cff", glow: "rgba(165,92,255,.5)", motif: "void" },
  { numeral: "XIV", name: "THE TRANSMUTER", hue: "#c47dff", glow: "rgba(196,125,255,.55)", motif: "figure" },
];

type RailItem = { name: string; sigil: string; active?: boolean };

const RAIL: RailItem[] = [
  { name: "PRIMORDIA", sigil: "M16 3 L18.6 12 L28 14.5 L18.6 17 L16 26 L13.4 17 L4 14.5 L13.4 12 Z" },
  { name: "CALCULATE", sigil: "M16 4 L27 25 L5 25 Z M16 11 L21.5 22 L10.5 22 Z", active: true },
  { name: "ORBITS", sigil: "M16 16 m-11 0 a11 11 0 1 0 22 0 a11 11 0 1 0 -22 0 M16 16 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0" },
  { name: "RITUALS", sigil: "M8 6 L24 6 L20 26 L12 26 Z M12 12 L20 12" },
  { name: "INGREDIENTS", sigil: "M13 4 L19 4 L19 10 L24 24 A3 3 0 0 1 21 27 L11 27 A3 3 0 0 1 8 24 L13 10 Z" },
  { name: "GRIMOIRE", sigil: "M7 5 L25 5 L25 27 L7 27 Z M11 5 L11 27 M14 11 L22 11 M14 15 L22 15 M14 19 L20 19" },
  { name: "SEALS", sigil: "M16 4 L26 10 L26 22 L16 28 L6 22 L6 10 Z M16 10 L21 13 L21 19 L16 22 L11 19 L11 13 Z" },
  { name: "CHRONICLE", sigil: "M16 16 m-10 0 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0 M16 9 L16 16 L21 19" },
  { name: "CONFIGURE", sigil: "M16 16 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 M16 4 L16 9 M16 23 L16 28 M4 16 L9 16 M23 16 L28 16 M7.5 7.5 L11 11 M21 21 L24.5 24.5 M24.5 7.5 L21 11 M11 21 L7.5 24.5" },
];

type Section = { tag: string; title: string; copy: string; icon: string };

const SECTIONS: Section[] = [
  { tag: "FREE", title: "Birth Chart", copy: "Map your Sun, Moon, and Rising — the foundation of every reading.", icon: "M20 20 m-13 0 a13 13 0 1 0 26 0 a13 13 0 1 0 -26 0 M20 7 L20 33 M7 20 L33 20 M11 11 L29 29 M29 11 L11 29" },
  { tag: "DAILY", title: "Daily Horoscope", copy: "Twelve signs, one sky. Clear forecasts without the fluff.", icon: "M20 8 A12 12 0 1 0 20 32 A9.5 9.5 0 1 1 20 8 Z" },
  { tag: "SYNASTRY", title: "Compatibility", copy: "Zodiac match, Chinese pairs, and deep synastry for two charts.", icon: "M14 20 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 M26 20 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0" },
  { tag: "SPREADS", title: "Tarot", copy: "Daily card to Celtic Cross — pull, reflect, get a full reading.", icon: "M12 6 L28 6 L28 34 L12 34 Z M20 12 L23 18 L20 24 L17 18 Z M20 26 L20 30" },
  { tag: "TESTS", title: "Psychology", copy: "MBTI, Big Five, empathy and more — meet yourself beyond the signs.", icon: "M20 20 m-12 0 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0 M20 20 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 M20 8 L20 13 M20 27 L20 32 M8 20 L13 20 M27 20 L32 20" },
  { tag: "YOU", title: "Cosmic Passport", copy: "Your Cosmic ID, people, journal, and Premium deep dives — one hub.", icon: "M20 5 L24 16 L36 20 L24 24 L20 35 L16 24 L4 20 L16 16 Z" },
];

type Faq = { id: string; q: string; a: string };

const FAQ: Faq[] = [
  { id: "NOTE 01", q: "Which features are free?", a: "Birth chart, daily horoscope, tarot pulls and psychology tests are free. Premium adds deep dives and extended synastry." },
  { id: "NOTE 02", q: "How do I cast a chart?", a: "Enter birth date, time and city. The chamber computes Sun, Moon, Rising and house placements in seconds." },
  { id: "NOTE 03", q: "Where do horoscopes live?", a: "Under Daily Horoscope — all twelve signs refreshed each morning, calibrated to the current sky." },
  { id: "NOTE 04", q: "What is the Destiny Matrix?", a: "An optional birth-date octagram tool. It maps purpose, love, money, and age themes from your birth date." },
];

const VARIABLES: { sym: string; def: string }[] = [
  { sym: "m\u1D62", def: "Mass Arcanum" },
  { sym: "v\u1D62", def: "Velocity of Intent" },
  { sym: "\u03A6", def: "Arcane Potential" },
  { sym: "\u03A8", def: "Psi Coherence" },
  { sym: "\u03A9", def: "Omega Resonance" },
  { sym: "\u03BB", def: "Attunement Factor" },
  { sym: "\u03B7", def: "Planar Constant" },
];

/* ------------------------------------------------------------------ */
/* Scoped styles                                                       */
/* ------------------------------------------------------------------ */

const CSS = `
.llb-root { background:#12060c; color:#d9a8b8; font-family:Georgia,'Times New Roman',serif; }
.llb-mono { font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace; }
.llb-caps { text-transform:uppercase; letter-spacing:.22em; }
.llb-caps-sm { text-transform:uppercase; letter-spacing:.18em; font-size:9px; }
.llb-panel {
  background:linear-gradient(160deg, rgba(46,14,28,.85), rgba(24,8,18,.92));
  isolation:isolate;
  border:1px solid rgba(214,90,130,.22);
  box-shadow:inset 0 0 0 1px rgba(0,0,0,.55), inset 0 0 32px rgba(90,10,40,.25), 0 0 24px rgba(0,0,0,.5);
  position:relative;
}
.llb-panel::before {
  content:""; position:absolute; inset:4px; pointer-events:none;
  border:1px solid rgba(214,90,130,.10);
}
.llb-notch { clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px); }
.llb-header {
  display:flex; align-items:center; gap:8px;
  border-bottom:1px solid rgba(214,90,130,.18);
  padding:7px 12px;
}
.llb-hdot { width:5px; height:5px; transform:rotate(45deg); background:#ff3d8a; box-shadow:0 0 6px #ff3d8a; flex:none; }
.llb-htext { font-size:10px; letter-spacing:.26em; color:#e8b7c6; text-transform:uppercase; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.llb-rule { height:1px; background:linear-gradient(90deg, rgba(214,90,130,.4), rgba(214,90,130,.05)); }
.llb-ticks { background-image:repeating-linear-gradient(90deg, rgba(214,90,130,.35) 0 1px, transparent 1px 8px); height:5px; }
.llb-ticks-v { background-image:repeating-linear-gradient(0deg, rgba(214,90,130,.4) 0 1px, transparent 1px 7px); width:5px; }
.llb-glow-m { color:#ff5c9a; text-shadow:0 0 8px rgba(255,61,138,.8); }
.llb-glow-o { color:#ffb15c; text-shadow:0 0 8px rgba(255,138,60,.8); }
.llb-glow-p { color:#c47dff; text-shadow:0 0 8px rgba(165,92,255,.8); }
.llb-btn {
  display:inline-flex; align-items:center; gap:8px;
  background:linear-gradient(180deg, rgba(255,61,138,.28), rgba(120,16,60,.45));
  border:1px solid rgba(255,92,154,.6); color:#ffd7e4;
  text-transform:uppercase; letter-spacing:.24em; font-size:10px;
  padding:9px 18px; box-shadow:0 0 18px rgba(255,61,138,.35), inset 0 0 12px rgba(255,61,138,.25);
  transition:box-shadow .3s;
}
.llb-btn:hover { box-shadow:0 0 28px rgba(255,61,138,.6), inset 0 0 16px rgba(255,61,138,.4); }
.llb-bar { background:rgba(214,90,130,.12); height:4px; position:relative; overflow:hidden; }
.llb-bar > i { display:block; height:100%; background:linear-gradient(90deg,#7a1436,#ff3d8a,#ffb15c); box-shadow:0 0 8px rgba(255,61,138,.7); }
.llb-anim-spin { animation:llb-spin linear infinite; }
.llb-anim-spinr { animation:llb-spinr linear infinite; }
.llb-anim-bob { animation:llb-bob ease-in-out infinite; }
.llb-anim-pulse { animation:llb-pulse ease-in-out infinite; }
.llb-anim-flicker { animation:llb-flicker linear infinite; }
.llb-anim-flow { animation:llb-flow linear infinite; }
@keyframes llb-spin { to { transform:rotate(360deg); } }
@keyframes llb-spinr { to { transform:rotate(-360deg); } }
@keyframes llb-bob { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-7px); } }
@keyframes llb-pulse { 0%,100% { opacity:.55; } 50% { opacity:1; } }
@keyframes llb-flicker { 0%,100% { opacity:.85; } 8% { opacity:.6; } 12% { opacity:.95; } 46% { opacity:.7; } 52% { opacity:1; } 78% { opacity:.75; } }
@keyframes llb-flow { to { stroke-dashoffset:-220; } }
@media (prefers-reduced-motion: reduce) {
  .llb-root *, .llb-root *::before, .llb-root *::after { animation:none !important; transition:none !important; }
}
.llb-hide-m { }
@media (max-width: 1100px) {
  .llb-rail { display:none; }
  .llb-grid3 { grid-template-columns:1fr !important; }
  .llb-hide-m { display:none; }
}
/* --- lab grime layer --- */
.llb-grime { position:absolute; inset:0; pointer-events:none; overflow:hidden; z-index:-1; }
.llb-stain { position:absolute; filter:blur(7px); }
.llb-speck { position:absolute; border-radius:50%; }
.llb-scratch { position:absolute; height:1px; }
.llb-scorch {
  position:absolute; border-radius:50%; filter:blur(12px); pointer-events:none; z-index:-1;
  background:radial-gradient(closest-side, rgba(4,1,3,.62), rgba(12,4,9,.28) 55%, transparent 72%);
}
.llb-smoke {
  position:absolute; border-radius:50%; filter:blur(16px); pointer-events:none; z-index:-1;
  background:radial-gradient(closest-side, rgba(150,110,170,.28), rgba(90,60,110,.12) 60%, transparent 75%);
  animation:llb-smoke linear infinite;
}
@keyframes llb-smoke {
  0% { transform:translate(0,0) scale(1); opacity:0; }
  18% { opacity:.42; }
  55% { opacity:.22; }
  100% { transform:translate(14px,-110px) scale(1.7); opacity:0; }
}
.llb-noise {
  position:fixed; inset:0; pointer-events:none; z-index:60; opacity:.05;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E");
}
/* --- background apparatus + layout dirt --- */
.llb-bg { position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
.llb-rune-giant { position:absolute; line-height:1; user-select:none; }
.llb-hair { position:absolute; height:1px; background:rgba(214,90,130,.13); }
.llb-hair-v { position:absolute; width:1px; background:rgba(214,90,130,.11); }
.llb-ember { position:absolute; border-radius:50%; opacity:0; }
.llb-ember-a { animation:llb-ember-a linear infinite; }
.llb-ember-b { animation:llb-ember-b linear infinite; }
.llb-ember-c { animation:llb-ember-c linear infinite; }
@keyframes llb-ember-a { 0% { transform:translate(0,0); opacity:0; } 12% { opacity:.85; } 80% { opacity:.3; } 100% { transform:translate(26px,-150px); opacity:0; } }
@keyframes llb-ember-b { 0% { transform:translate(0,0); opacity:0; } 15% { opacity:.7; } 100% { transform:translate(-20px,-180px); opacity:0; } }
@keyframes llb-ember-c { 0% { transform:translate(0,0) scale(.7); opacity:0; } 10% { opacity:.9; } 100% { transform:translate(42px,-120px) scale(1.1); opacity:0; } }
.llb-tag {
  position:absolute; z-index:5; pointer-events:none; white-space:nowrap;
  font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace; font-size:8px; letter-spacing:.2em; text-transform:uppercase;
  color:#ffb15c; background:rgba(24,7,16,.92); border:1px solid rgba(255,138,60,.45);
  padding:2px 7px; box-shadow:0 0 10px rgba(0,0,0,.6);
}
.llb-annot {
  position:absolute; z-index:5; pointer-events:none; white-space:nowrap;
  font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace; font-size:8px; letter-spacing:.26em; text-transform:uppercase;
  color:rgba(214,120,150,.75);
}
.llb-xspeck { position:absolute; z-index:6; pointer-events:none; border-radius:50%; }
.llb-seam { position:relative; height:0; z-index:5; margin-top:-12px; pointer-events:none; }
`;

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function PanelHead({ title, right }: { title: string; right?: string }) {
  return (
    <div className="llb-header">
      <span className="llb-hdot" />
      <span className="llb-htext">{title}</span>
      <span className="llb-rule" style={{ flex: 1 }} />
      {right ? <span className="llb-caps-sm llb-mono" style={{ color: "#9a5a70", whiteSpace: "nowrap" }}>{right}</span> : null}
    </div>
  );
}

function CornerTicks() {
  const c = "rgba(255,92,154,.55)";
  const s: CSSProperties = { position: "absolute", width: 8, height: 8, borderColor: c, borderStyle: "solid", borderWidth: 0, pointerEvents: "none" };
  return (
    <>
      <span style={{ ...s, top: 2, left: 2, borderTopWidth: 1, borderLeftWidth: 1 }} />
      <span style={{ ...s, top: 2, right: 2, borderTopWidth: 1, borderRightWidth: 1 }} />
      <span style={{ ...s, bottom: 2, left: 2, borderBottomWidth: 1, borderLeftWidth: 1 }} />
      <span style={{ ...s, bottom: 2, right: 2, borderBottomWidth: 1, borderRightWidth: 1 }} />
    </>
  );
}

function EssenceOrb({ e }: { e: Essence }) {
  return (
    <div className="flex flex-col items-center gap-1 py-2 px-1" style={{ border: "1px solid rgba(214,90,130,.16)", background: "rgba(20,6,14,.5)" }}>
      <svg width="34" height="46" viewBox="0 0 24 32" aria-hidden>
        <defs>
          <radialGradient id={`llb-og-${e.name}`} cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor="#fff3ec" />
            <stop offset="35%" stopColor={e.hue} />
            <stop offset="100%" stopColor="rgba(40,8,20,0)" />
          </radialGradient>
        </defs>
        <circle cx="12" cy="12" r="11" fill={e.glow} className="llb-anim-pulse" style={{ animationDuration: "6s" }} />
        <circle cx="12" cy="12" r="8.5" fill={`url(#llb-og-${e.name})`} />
        <path d={e.spark} fill="none" stroke="#2a0a18" strokeWidth="1" opacity=".8" transform="translate(0 0) scale(.62) translate(7.4 7.4)" />
        <line x1="12" y1="22" x2="12" y2="28" stroke={e.hue} strokeWidth=".8" opacity=".7" />
        <path d="M12 28 l-2.5 3 M12 28 l2.5 3" stroke={e.hue} strokeWidth=".8" fill="none" opacity=".7" />
      </svg>
      <span className="llb-caps-sm" style={{ color: "#c98ba0" }}>{e.name}</span>
      <span className="llb-mono" style={{ fontSize: 13, color: e.hue, textShadow: `0 0 8px ${e.glow}` }}>{e.value}</span>
    </div>
  );
}

function VGauge({ label, sym, value, pct, hue, marks }: { label: string; sym: string; value: string; pct: number; hue: string; marks: string[] }) {
  return (
    <div className="flex flex-col items-center gap-1" style={{ width: 56 }}>
      <span className="llb-caps-sm text-center" style={{ color: "#c98ba0", lineHeight: 1.5 }}>{label}</span>
      <span className="llb-mono" style={{ fontSize: 12, color: hue, textShadow: `0 0 8px ${hue}` }}>{sym} {value}</span>
      <div className="flex items-stretch gap-1" style={{ height: 210 }}>
        <div style={{ width: 6, background: "rgba(214,90,130,.1)", border: "1px solid rgba(214,90,130,.2)", position: "relative" }}>
          <div
            className="llb-anim-pulse"
            style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: `${pct}%`,
              background: `linear-gradient(0deg, #5c0f2c, ${hue})`,
              boxShadow: `0 0 10px ${hue}`, animationDuration: "9s",
            }}
          />
        </div>
        <div className="llb-ticks-v" />
        <div className="flex flex-col justify-between llb-mono" style={{ fontSize: 7, color: "#8a4a5e" }}>
          {marks.map((m) => <span key={m}>{m}</span>)}
        </div>
      </div>
      <span className="llb-caps-sm" style={{ color: "#6e3a4a", fontSize: 7 }}>FLOW REG.</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The Calculation Chamber                                             */
/* ------------------------------------------------------------------ */

function Chamber() {
  const CXc = 320;
  const CYc = 300;
  const ticks = Array.from({ length: 120 }, (_, i) => {
    const long = i % 10 === 0;
    const a = i * 3;
    const p1 = polar(CXc, CYc, 282, a);
    const p2 = polar(CXc, CYc, long ? 268 : 275, a);
    return <line key={`t${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={long ? "rgba(255,138,60,.5)" : "rgba(214,90,130,.28)"} strokeWidth={long ? 1.1 : 0.6} />;
  });
  const zodiacRing = ZODIAC.map((z, i) => {
    const p = polar(CXc, CYc, 246, i * 30 - 90);
    return (
      <text key={z.name} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="15" fill={i % 3 === 0 ? "#ffb15c" : "#b06a82"} style={{ textShadow: "0 0 6px rgba(255,138,60,.6)" }}>
        {z.glyph}
      </text>
    );
  });
  const runeNodes = RUNES.slice(0, 10).map((r, i) => {
    const p = polar(CXc, CYc, 198, i * 36 - 90);
    return (
      <g key={`rn${i}`}>
        <circle cx={p.x} cy={p.y} r="11" fill="rgba(30,8,20,.9)" stroke="rgba(196,125,255,.5)" strokeWidth=".8" />
        <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#c47dff" style={{ textShadow: "0 0 7px rgba(165,92,255,.9)" }}>{r}</text>
      </g>
    );
  });
  const diamonds = Array.from({ length: 8 }, (_, i) => {
    const p = polar(CXc, CYc, 152, i * 45 + 22);
    return <rect key={`d${i}`} x={p.x - 3} y={p.y - 3} width="6" height="6" transform={`rotate(45 ${p.x} ${p.y})`} fill="none" stroke="rgba(255,92,154,.6)" strokeWidth=".8" />;
  });
  const orbitPts = [0.06, 0.24, 0.42, 0.63, 0.86].map((t, i) => {
    const a = t * 360;
    const x = CXc + 288 * Math.cos(rad(a));
    const y = CYc + 96 * Math.sin(rad(a));
    const hues = ["#ff3d8a", "#ffb15c", "#a55cff", "#ff8a3c", "#c47dff"];
    return (
      <g key={`o${i}`} transform={`rotate(-14 ${CXc} ${CYc})`}>
        <circle cx={x} cy={y} r="10" fill={hues[i]} opacity=".18" className="llb-anim-pulse" style={{ animationDuration: `${7 + i * 2}s` }} />
        <circle cx={x} cy={y} r="4.5" fill={hues[i]} opacity=".9" />
        <circle cx={x} cy={y} r="1.6" fill="#fff0f5" />
      </g>
    );
  });
  return (
    <svg viewBox="0 0 640 600" className="w-full h-auto" role="img" aria-label="The Calculation Chamber">
      <defs>
        <radialGradient id="llb-chbg" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="rgba(120,20,60,.4)" />
          <stop offset="55%" stopColor="rgba(60,10,34,.18)" />
          <stop offset="100%" stopColor="rgba(18,6,12,0)" />
        </radialGradient>
        <linearGradient id="llb-cr1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd7e8" />
          <stop offset="45%" stopColor="#ff3d8a" />
          <stop offset="100%" stopColor="#7a1440" />
        </linearGradient>
        <linearGradient id="llb-cr2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e6c2ff" />
          <stop offset="55%" stopColor="#a55cff" />
          <stop offset="100%" stopColor="#3d1160" />
        </linearGradient>
        <linearGradient id="llb-cr3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe2b8" />
          <stop offset="100%" stopColor="#c45a1a" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="640" height="600" fill="url(#llb-chbg)" />

      {/* tilted orbit ellipse */}
      <ellipse cx={CXc} cy={CYc} rx="288" ry="96" transform={`rotate(-14 ${CXc} ${CYc})`} fill="none" stroke="rgba(255,92,154,.3)" strokeWidth=".8" strokeDasharray="4 7" className="llb-anim-flow" style={{ animationDuration: "44s" }} />
      {orbitPts}

      {/* static tick ring */}
      <circle cx={CXc} cy={CYc} r="282" fill="none" stroke="rgba(214,90,130,.25)" strokeWidth=".8" />
      {ticks}
      <text x={CXc} y={CYc - 262} textAnchor="middle" fontSize="8" letterSpacing="4" fill="#9a5a70">COHERENCE 83% · STABLE FIELD</text>

      {/* rotating zodiac ring */}
      <g className="llb-anim-spin" style={{ animationDuration: "160s", transformOrigin: "320px 300px" }}>
        <circle cx={CXc} cy={CYc} r="246" fill="none" stroke="rgba(255,138,60,.3)" strokeWidth=".7" strokeDasharray="2 5" />
        {zodiacRing}
      </g>

      {/* counter-rotating rune ring */}
      <g className="llb-anim-spinr" style={{ animationDuration: "120s", transformOrigin: "320px 300px" }}>
        <circle cx={CXc} cy={CYc} r="198" fill="none" stroke="rgba(165,92,255,.35)" strokeWidth=".7" />
        {runeNodes}
      </g>

      {/* inner dashed ring with diamonds */}
      <g className="llb-anim-spin" style={{ animationDuration: "80s", transformOrigin: "320px 300px" }}>
        <circle cx={CXc} cy={CYc} r="152" fill="none" stroke="rgba(255,92,154,.4)" strokeWidth=".8" strokeDasharray="10 6" />
        {diamonds}
      </g>

      <circle cx={CXc} cy={CYc} r="118" fill="none" stroke="rgba(214,90,130,.3)" strokeWidth=".6" />
      <circle cx={CXc} cy={CYc} r="96" fill="none" stroke="rgba(255,138,60,.22)" strokeWidth=".6" strokeDasharray="1 4" />

      {/* crystal */}
      <g className="llb-anim-bob" style={{ animationDuration: "9s" }}>
        <polygon points="320,168 366,288 320,432 274,288" fill="rgba(255,61,138,.14)" className="llb-anim-pulse" style={{ animationDuration: "7s" }} />
        <polygon points="320,182 354,290 320,418 286,290" fill="url(#llb-cr2)" opacity=".85" />
        <polygon points="320,182 338,290 320,404 302,290" fill="url(#llb-cr1)" opacity=".92" />
        <polygon points="320,196 330,290 320,372 310,290" fill="#ffe9f2" opacity=".85" className="llb-anim-flicker" style={{ animationDuration: "5s" }} />
        <line x1="320" y1="182" x2="320" y2="418" stroke="rgba(255,255,255,.4)" strokeWidth=".6" />
        <line x1="286" y1="290" x2="354" y2="290" stroke="rgba(255,255,255,.3)" strokeWidth=".6" />
        {/* base pedestal */}
        <ellipse cx="320" cy="446" rx="60" ry="12" fill="rgba(255,138,60,.16)" stroke="rgba(255,138,60,.5)" strokeWidth=".8" />
        <ellipse cx="320" cy="446" rx="34" ry="6.5" fill="url(#llb-cr3)" opacity=".7" className="llb-anim-pulse" style={{ animationDuration: "8s" }} />
      </g>

      {/* satellite crystal */}
      <g className="llb-anim-bob" style={{ animationDuration: "12s", animationDelay: "-4s" }}>
        <polygon points="132,150 148,186 132,222 116,186" fill="url(#llb-cr2)" opacity=".8" />
        <polygon points="132,158 141,186 132,214 123,186" fill="url(#llb-cr1)" opacity=".85" />
        <line x1="100" y1="186" x2="116" y2="186" stroke="rgba(165,92,255,.4)" strokeWidth=".6" strokeDasharray="2 3" />
      </g>
      <g className="llb-anim-bob" style={{ animationDuration: "11s", animationDelay: "-7s" }}>
        <polygon points="516,402 530,434 516,466 502,434" fill="url(#llb-cr2)" opacity=".75" />
        <polygon points="516,410 524,434 516,458 508,434" fill="url(#llb-cr1)" opacity=".8" />
      </g>

      {/* crosshair markers */}
      <g stroke="rgba(255,177,92,.55)" strokeWidth=".8" fill="none">
        <path d="M320 30 v14 M313 37 h14" />
        <path d="M320 556 v14 M313 563 h14" />
        <path d="M28 300 h14 M35 293 v14" />
        <path d="M598 300 h14 M605 293 v14" />
      </g>
      <text x="60" y="292" fontSize="8" letterSpacing="3" fill="#8a4a5e">STABLE</text>
      <text x="60" y="318" fontSize="8" letterSpacing="3" fill="#8a4a5e">LOW · 7.1</text>
      <text x="540" y="60" fontSize="8" letterSpacing="2" fill="#8a4a5e">FIELD Ω 8.31</text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Planar orbits                                                       */
/* ------------------------------------------------------------------ */

function PlanarOrbits() {
  const ellipses = [
    { rx: 176, ry: 42, rot: -8, o: ".5" },
    { rx: 150, ry: 58, rot: 14, o: ".4" },
    { rx: 118, ry: 34, rot: -24, o: ".45" },
    { rx: 86, ry: 46, rot: 30, o: ".35" },
    { rx: 54, ry: 22, rot: -4, o: ".5" },
  ];
  const bodies = [
    { rx: 176, ry: 42, rot: -8, a: 20, c: "#a55cff", r: 6 },
    { rx: 150, ry: 58, rot: 14, a: 130, c: "#ffb15c", r: 5 },
    { rx: 118, ry: 34, rot: -24, a: 250, c: "#ff3d8a", r: 5.5 },
    { rx: 86, ry: 46, rot: 30, a: 70, c: "#c47dff", r: 4 },
    { rx: 54, ry: 22, rot: -4, a: 300, c: "#ff8a3c", r: 3.5 },
    { rx: 176, ry: 42, rot: -8, a: 205, c: "#7a3cff", r: 4 },
  ];
  const CC = { x: 200, y: 105 };
  return (
    <svg viewBox="0 0 400 210" className="w-full h-auto" role="img" aria-label="Planar orbits">
      {ellipses.map((e, i) => (
        <ellipse key={i} cx={CC.x} cy={CC.y} rx={e.rx} ry={e.ry} transform={`rotate(${e.rot} ${CC.x} ${CC.y})`} fill="none" stroke={`rgba(214,90,130,${e.o})`} strokeWidth=".7" strokeDasharray={i % 2 ? "3 5" : "none"} />
      ))}
      <circle cx={CC.x} cy={CC.y} r="9" fill="rgba(255,61,138,.2)" className="llb-anim-pulse" style={{ animationDuration: "6s" }} />
      <circle cx={CC.x} cy={CC.y} r="4" fill="#ff3d8a" />
      <circle cx={CC.x} cy={CC.y} r="1.4" fill="#fff0f5" />
      {bodies.map((b, i) => {
        const lx = b.rx * Math.cos(rad(b.a));
        const ly = b.ry * Math.sin(rad(b.a));
        const rr = rad(b.rot);
        const x = CC.x + lx * Math.cos(rr) - ly * Math.sin(rr);
        const y = CC.y + lx * Math.sin(rr) + ly * Math.cos(rr);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={b.r * 2.1} fill={b.c} opacity=".18" className="llb-anim-pulse" style={{ animationDuration: `${8 + i * 3}s` }} />
            <circle cx={x} cy={y} r={b.r} fill={b.c} opacity=".85" />
            <circle cx={x} cy={y} r={b.r * 0.4} fill="#ffeef4" />
          </g>
        );
      })}
      <g fontSize="9" fill="#b06a82">
        {ZODIAC.map((z, i) => {
          const p = polar(CC.x, CC.y, 192, i * 30 - 90);
          return <text key={z.name} x={Math.min(388, Math.max(8, p.x))} y={Math.min(204, Math.max(10, p.y))} textAnchor="middle">{z.glyph}</text>;
        })}
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Destiny Matrix octagram                                             */
/* ------------------------------------------------------------------ */

function Octagram() {
  const C = 110;
  const pts8 = Array.from({ length: 8 }, (_, i) => polar(C, C, 92, i * 45 - 90));
  const inner = Array.from({ length: 8 }, (_, i) => polar(C, C, 40, i * 45 - 90));
  const labels = ["PURPOSE", "LOVE", "MONEY", "AGE", "KARMA", "TALENT", "UNION", "PATH"];
  const sq1 = [0, 2, 4, 6].map((i) => pts8[i]);
  const sq2 = [1, 3, 5, 7].map((i) => pts8[i]);
  const poly = (pp: { x: number; y: number }[]) => pp.map((p) => `${p.x},${p.y}`).join(" ");
  return (
    <svg viewBox="0 0 220 220" className="w-full h-auto" role="img" aria-label="Destiny Matrix octagram">
      <circle cx={C} cy={C} r="104" fill="none" stroke="rgba(214,90,130,.3)" strokeWidth=".7" />
      <circle cx={C} cy={C} r="92" fill="none" stroke="rgba(255,138,60,.3)" strokeWidth=".6" strokeDasharray="2 4" />
      <g className="llb-anim-spin" style={{ animationDuration: "150s", transformOrigin: "110px 110px" }}>
        <polygon points={poly(sq1)} fill="none" stroke="rgba(255,92,154,.55)" strokeWidth=".9" />
        <polygon points={poly(sq2)} fill="none" stroke="rgba(196,125,255,.5)" strokeWidth=".9" />
      </g>
      {pts8.map((p, i) => <line key={i} x1={p.x} y1={p.y} x2={inner[i].x} y2={inner[i].y} stroke="rgba(214,90,130,.35)" strokeWidth=".6" />)}
      <circle cx={C} cy={C} r="40" fill="rgba(30,8,20,.85)" stroke="rgba(255,92,154,.5)" strokeWidth=".8" />
      <text x={C} y={C - 4} textAnchor="middle" fontSize="9" letterSpacing="2" fill="#e8b7c6">DESTINY</text>
      <text x={C} y={C + 9} textAnchor="middle" fontSize="9" letterSpacing="2" fill="#ff5c9a">MATRIX</text>
      {pts8.map((p, i) => (
        <g key={`n${i}`}>
          <circle cx={p.x} cy={p.y} r="4.5" fill="rgba(255,61,138,.25)" className="llb-anim-pulse" style={{ animationDuration: `${6 + i}s` }} />
          <circle cx={p.x} cy={p.y} r="2" fill={i % 2 ? "#c47dff" : "#ffb15c"} />
        </g>
      ))}
      {labels.map((l, i) => {
        const p = polar(C, C, 116, i * 45 - 90);
        return <text key={l} x={Math.min(212, Math.max(8, p.x))} y={Math.min(216, Math.max(8, p.y))} textAnchor="middle" fontSize="6.5" letterSpacing="1.5" fill="#9a5a70">{l}</text>;
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Arcana card motif                                                   */
/* ------------------------------------------------------------------ */

function CardMotif({ motif, hue }: { motif: Card["motif"]; hue: string }) {
  const common = { fill: "none", stroke: hue, strokeWidth: 1 };
  if (motif === "star") {
    return (
      <g {...common}>
        <circle cx="30" cy="34" r="16" opacity=".5" />
        <path d="M30 18 L33 31 L46 34 L33 37 L30 50 L27 37 L14 34 L27 31 Z" fill={hue} opacity=".85" className="llb-anim-flicker" style={{ animationDuration: "6s" }} />
        <circle cx="30" cy="34" r="4" fill="#fff0f5" stroke="none" />
      </g>
    );
  }
  if (motif === "orbit") {
    return (
      <g {...common}>
        <circle cx="30" cy="34" r="15" opacity=".6" />
        <ellipse cx="30" cy="34" rx="19" ry="8" transform="rotate(-24 30 34)" opacity=".7" />
        <circle cx="44" cy="27" r="2.5" fill={hue} stroke="none" />
        <path d="M30 22 L34 34 L30 46 L26 34 Z" fill={hue} opacity=".8" />
      </g>
    );
  }
  if (motif === "eye") {
    return (
      <g {...common}>
        <path d="M12 34 Q30 18 48 34 Q30 50 12 34 Z" opacity=".8" />
        <circle cx="30" cy="34" r="6.5" fill={hue} opacity=".75" className="llb-anim-pulse" style={{ animationDuration: "7s" }} />
        <circle cx="30" cy="34" r="2.2" fill="#1a0a12" stroke="none" />
        <path d="M30 12 v6 M30 50 v6" opacity=".6" />
      </g>
    );
  }
  if (motif === "void") {
    return (
      <g {...common}>
        <circle cx="30" cy="34" r="15" opacity=".5" strokeDasharray="3 4" />
        <circle cx="30" cy="34" r="9" fill="#0c040a" stroke={hue} opacity=".9" />
        <path d="M30 27 L32.4 33.2 L39 34 L32.4 34.8 L30 41 L27.6 34.8 L21 34 L27.6 33.2 Z" fill={hue} className="llb-anim-pulse" style={{ animationDuration: "5s" }} />
      </g>
    );
  }
  return (
    <g {...common}>
      <path d="M30 16 a5 5 0 1 0 .01 0 Z M24 30 Q30 22 36 30 L38 48 L22 48 Z" opacity=".85" />
      <circle cx="30" cy="34" r="17" opacity=".35" strokeDasharray="2 5" />
      <path d="M14 52 L46 52" opacity=".5" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Lab grime — stains, specks, scratches, scorch, smoke (deterministic) */
/* ------------------------------------------------------------------ */

function det(seed: number, i: number): number {
  const x = Math.sin(seed * 127.1 + i * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const STAIN_COLORS = ["rgba(52,22,58,.5)", "rgba(64,36,20,.45)", "rgba(38,16,44,.55)"];
const SPECK_COLORS = ["rgba(28,12,24,.8)", "rgba(96,58,28,.55)", "rgba(150,60,90,.38)", "rgba(18,8,16,.9)"];

function Grime({ seed, stains = 2, specks = 10, scratches = 2 }: { seed: number; stains?: number; specks?: number; scratches?: number }) {
  return (
    <div className="llb-grime" aria-hidden>
      {Array.from({ length: stains }, (_, i) => {
        const w = 60 + det(seed, i) * 130;
        const rx = 40 + det(seed, i + 3) * 25;
        const ry = 45 + det(seed, i + 7) * 20;
        return (
          <span
            key={`st${i}`}
            className="llb-stain"
            style={{
              left: `${det(seed, i + 11) * 78}%`,
              top: `${det(seed, i + 23) * 80}%`,
              width: w,
              height: w * (0.6 + det(seed, i + 31) * 0.7),
              background: STAIN_COLORS[Math.floor(det(seed, i + 41) * STAIN_COLORS.length)],
              borderRadius: `${rx}% ${100 - rx}% ${ry}% ${100 - ry}% / ${ry}% ${rx}% ${100 - rx}% ${100 - ry}%`,
              transform: `rotate(${det(seed, i + 51) * 70 - 35}deg)`,
            }}
          />
        );
      })}
      {Array.from({ length: specks }, (_, i) => {
        const s = 1 + det(seed, i + 61) * 2.2;
        return (
          <span
            key={`sp${i}`}
            className="llb-speck"
            style={{
              left: `${det(seed, i + 67) * 98}%`,
              top: `${det(seed, i + 73) * 96}%`,
              width: s,
              height: s,
              background: SPECK_COLORS[Math.floor(det(seed, i + 79) * SPECK_COLORS.length)],
            }}
          />
        );
      })}
      {Array.from({ length: scratches }, (_, i) => (
        <span
          key={`sc${i}`}
          className="llb-scratch"
          style={{
            left: `${det(seed, i + 83) * 85}%`,
            top: `${det(seed, i + 89) * 90}%`,
            width: 30 + det(seed, i + 97) * 70,
            background: "rgba(235,200,210,.06)",
            transform: `rotate(${det(seed, i + 101) * 40 - 20}deg)`,
          }}
        />
      ))}
    </div>
  );
}

function Scorch({ style }: { style: CSSProperties }) {
  return <span className="llb-scorch" aria-hidden style={style} />;
}

function Smoke({ style, duration, delay = "0s" }: { style: CSSProperties; duration: string; delay?: string }) {
  return <span className="llb-smoke" aria-hidden style={{ animationDuration: duration, animationDelay: delay, ...style }} />;
}

/* ------------------------------------------------------------------ */
/* Background apparatus layers — behind everything                     */
/* ------------------------------------------------------------------ */

function BgLayers() {
  const ticks = Array.from({ length: 96 }, (_, i) => {
    const a = i * 3.75;
    const long = i % 8 === 0;
    const p1 = polar(410, 410, 396, a);
    const p2 = polar(410, 410, long ? 376 : 386, a);
    return <line key={`bt${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={long ? "rgba(255,138,60,.5)" : "rgba(214,90,130,.35)"} strokeWidth={long ? 1.4 : 0.8} />;
  });
  const ringRunes = RUNES.slice(0, 12).map((r, i) => {
    const p = polar(410, 410, 330, i * 30);
    return <text key={`br${i}`} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="26" fill="rgba(196,125,255,.6)">{r}</text>;
  });
  const embers = Array.from({ length: 14 }, (_, i) => {
    const hue = ["#ffb15c", "#ff3d8a", "#c47dff"][i % 3];
    const s = 2 + det(311, i) * 2.5;
    return (
      <span
        key={`em${i}`}
        className={`llb-ember llb-ember-${"abc"[i % 3]}`}
        style={{
          left: `${det(311, i + 10) * 96}%`,
          top: `${20 + det(311, i + 20) * 80}%`,
          width: s,
          height: s,
          background: hue,
          boxShadow: `0 0 ${4 + s * 2}px ${hue}`,
          animationDuration: `${26 + det(311, i + 30) * 42}s`,
          animationDelay: `${-det(311, i + 40) * 60}s`,
        }}
      />
    );
  });
  return (
    <div className="llb-bg" aria-hidden>
      {/* huge ring diagram bleeding off the right viewport edge */}
      <div className="llb-anim-spin" style={{ position: "absolute", right: -270, top: "4%", width: 820, height: 820, opacity: 0.16, animationDuration: "180s" }}>
        <svg viewBox="0 0 820 820" width="820" height="820">
          <circle cx="410" cy="410" r="396" fill="none" stroke="rgba(214,90,130,.5)" strokeWidth="1" />
          {ticks}
          <circle cx="410" cy="410" r="330" fill="none" stroke="rgba(165,92,255,.4)" strokeWidth=".8" strokeDasharray="3 6" />
          {ringRunes}
          <circle cx="410" cy="410" r="250" fill="none" stroke="rgba(255,92,154,.35)" strokeWidth=".8" strokeDasharray="14 8" />
          <circle cx="410" cy="410" r="150" fill="none" stroke="rgba(255,138,60,.3)" strokeWidth=".7" />
          <polygon points="410,160 627,535 193,535" fill="none" stroke="rgba(255,138,60,.35)" strokeWidth=".8" />
          <polygon points="410,660 193,285 627,285" fill="none" stroke="rgba(196,125,255,.3)" strokeWidth=".8" />
        </svg>
      </div>
      {/* faint orbit fan, top-left off-screen */}
      <div className="llb-anim-spinr" style={{ position: "absolute", left: -240, top: -180, width: 620, height: 620, opacity: 0.12, animationDuration: "150s" }}>
        <svg viewBox="0 0 620 620" width="620" height="620">
          {[280, 220, 160, 100].map((r, i) => (
            <ellipse key={i} cx="310" cy="310" rx={r} ry={r * 0.62} transform={`rotate(${i * 22} 310 310)`} fill="none" stroke="rgba(214,90,130,.6)" strokeWidth=".9" strokeDasharray={i % 2 ? "4 7" : "none"} />
          ))}
          <circle cx="310" cy="310" r="6" fill="rgba(255,61,138,.7)" />
        </svg>
      </div>
      {/* giant rune ghosts */}
      <span className="llb-rune-giant" style={{ fontSize: 300, left: "2%", top: "34%", color: "rgba(165,92,255,.05)" }}>{RUNES[4]}</span>
      <span className="llb-rune-giant" style={{ fontSize: 240, left: "44%", top: "64%", color: "rgba(255,61,138,.045)", transform: "rotate(8deg)" }}>{RUNES[11]}</span>
      <span className="llb-rune-giant" style={{ fontSize: 260, right: "1%", top: "48%", color: "rgba(255,138,60,.05)", transform: "rotate(-6deg)" }}>{RUNES[18]}</span>
      <span className="llb-rune-giant" style={{ fontSize: 180, left: "30%", top: "8%", color: "rgba(214,90,130,.05)" }}>{RUNES[21]}</span>
      {/* hairline construction lines */}
      <div className="llb-hair" style={{ left: 0, right: 0, top: "21%" }} />
      <div className="llb-hair" style={{ left: 0, right: 0, top: "73%" }} />
      <div className="llb-hair-v" style={{ top: 0, bottom: 0, left: "33%" }} />
      <div className="llb-hair-v" style={{ top: 0, bottom: 0, right: "24%" }} />
      <div className="llb-hair" style={{ left: "-10%", right: "-10%", top: "50%", transform: "rotate(-7deg)" }} />
      <span className="llb-mono" style={{ position: "absolute", left: "33.4%", top: "19.6%", fontSize: 8, color: "rgba(214,120,150,.4)", letterSpacing: ".2em" }}>AX-33 / 0.218</span>
      <span className="llb-mono" style={{ position: "absolute", right: "24.6%", top: "71.6%", fontSize: 8, color: "rgba(214,120,150,.4)", letterSpacing: ".2em" }}>MERIDIAN Ω</span>
      {embers}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function LaboratoriumPage() {
  return (
    <div className="llb-root min-h-screen relative overflow-x-clip" style={{ backgroundImage: "radial-gradient(1200px 600px at 50% -10%, rgba(122,20,64,.28), transparent), radial-gradient(900px 500px at 90% 110%, rgba(61,17,96,.22), transparent)" }}>
      <style>{CSS}</style>
      <BgLayers />

      {/* ======================= TOP BAR ======================= */}
      <header className="relative z-[1] flex items-stretch border-b" style={{ borderColor: "rgba(214,90,130,.25)", background: "linear-gradient(180deg, rgba(40,10,24,.9), rgba(24,7,16,.9))" }}>
        <div className="flex items-center gap-3 px-4 py-2.5 border-r" style={{ borderColor: "rgba(214,90,130,.25)" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="none" stroke="#ff3d8a" strokeWidth="1.1" />
            <circle cx="12" cy="12" r="3.4" fill="none" stroke="#ffb15c" strokeWidth=".9" />
          </svg>
          <span className="llb-caps" style={{ fontSize: 13, color: "#f3d3dd", textShadow: "0 0 10px rgba(255,61,138,.4)" }}>Arcana Laboratorium</span>
        </div>
        <div className="hidden md:flex items-center px-4 border-r llb-caps-sm" style={{ borderColor: "rgba(214,90,130,.25)", color: "#ffb15c", background: "rgba(122,20,64,.25)" }}>
          Calculation Workbench
        </div>
        <nav className="hidden lg:flex items-center gap-5 px-5 llb-caps-sm" style={{ color: "#b07a8d" }} aria-label="Primary">
          <span style={{ color: "#e8b7c6" }}>ASTRO SCOPE</span>
          <a href="#llb-sections" className="hover:text-[#ffd7e4]" style={{ color: "inherit" }}>Horoscopes</a>
          <a href="#llb-sections" className="hover:text-[#ffd7e4]" style={{ color: "inherit" }}>Tarot</a>
          <a href="#llb-sections" className="hover:text-[#ffd7e4]" style={{ color: "inherit" }}>Compatibility</a>
          <a href="#llb-cta" className="hover:text-[#ffd7e4]" style={{ color: "inherit" }}>Sign In</a>
        </nav>
        <div className="flex-1" />
        <div className="hidden md:flex items-center gap-2 px-4 llb-caps-sm" style={{ color: "#9a5a70" }}>
          <span>Celestial Alignment</span>
          {ZODIAC.slice(0, 6).map((z) => (
            <span key={z.name} style={{ color: "#c47dff", fontSize: 11 }}>{z.glyph}</span>
          ))}
        </div>
        <div className="hidden sm:flex flex-col justify-center px-4 border-l llb-mono" style={{ borderColor: "rgba(214,90,130,.25)", fontSize: 9, color: "#9a5a70", lineHeight: 1.6 }}>
          <span className="llb-caps-sm">Current Seed</span>
          <span className="llb-glow-o" style={{ fontSize: 11, letterSpacing: ".12em" }}>XIX-Ω-721</span>
        </div>
        <div className="flex items-center gap-3 px-4 border-l" style={{ borderColor: "rgba(214,90,130,.25)" }} aria-label="Experiment log">
          <span className="llb-caps-sm" style={{ color: "#9a5a70" }}>Exp. Log</span>
          {["M12 3 a9 9 0 1 0 .01 0 Z M12 7 L12 12 L16 14", "M5 12 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0 M12 9 v6 M9 12 h6", "M6 5 L18 5 L18 19 L6 19 Z M9 9 L15 9 M9 12 L15 12 M9 15 L13 15"].map((d, i) => (
            <svg key={i} width="18" height="18" viewBox="0 0 24 24" aria-hidden>
              <path d={d} fill="none" stroke={i === 1 ? "#ffb15c" : "#b06a82"} strokeWidth="1.1" />
            </svg>
          ))}
          <span className="llb-mono" style={{ fontSize: 9, color: "#ffb15c" }}>(3)</span>
        </div>
        <div className="flex items-center px-4 border-l" style={{ borderColor: "rgba(214,90,130,.25)" }}>
          <a href="#llb-cta" className="llb-btn llb-notch" style={{ padding: "8px 14px" }}>Cast your free birth chart</a>
        </div>
      </header>

      <div className="flex relative z-[1]">
        {/* ======================= LEFT RAIL ======================= */}
        <nav className="llb-rail flex flex-col items-center border-r py-3 gap-1" style={{ borderColor: "rgba(214,90,130,.25)", width: 86, background: "rgba(20,6,14,.6)" }} aria-label="Laboratory modules">
          {RAIL.map((r) => (
            <div key={r.name} className="flex flex-col items-center gap-1 py-2 w-full" style={r.active ? { background: "rgba(122,20,64,.3)", boxShadow: "inset 2px 0 0 #ff3d8a" } : undefined}>
              <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden>
                <path d={r.sigil} fill="none" stroke={r.active ? "#ff5c9a" : "#8a4a5e"} strokeWidth="1.2" style={r.active ? { filter: "drop-shadow(0 0 4px rgba(255,61,138,.8))" } : undefined} />
              </svg>
              <span className="llb-caps-sm" style={{ fontSize: 7, color: r.active ? "#ffb7cf" : "#7a4456" }}>{r.name}</span>
            </div>
          ))}
        </nav>

        {/* ======================= MAIN ======================= */}
        <main className="flex-1 min-w-0 p-2 md:p-3 flex flex-col gap-3 relative">
          <div className="llb-grid3 grid gap-3" style={{ gridTemplateColumns: "300px minmax(0,1fr) 320px" }}>

            {/* ---------- LEFT COLUMN ---------- */}
            <div className="flex flex-col gap-3 min-w-0 relative" style={{ marginTop: -6 }}>
              <span className="llb-annot llb-hide-m" style={{ right: -8, top: 92, transform: "rotate(90deg)", transformOrigin: "top right", zIndex: 6 }}>Distillate Grade AA</span>
              {/* Essence compendium */}
              <section className="llb-panel llb-notch" style={{ transform: "rotate(-0.7deg)", marginLeft: -4 }}>
                <CornerTicks />
                <Grime seed={11} />
                <Scorch style={{ left: "12%", top: "4%", width: 130, height: 130 }} />
                <Scorch style={{ left: "62%", top: "10%", width: 110, height: 110 }} />
                <PanelHead title="Essence Compendium" right="DIST. V.4" />
                <div className="grid grid-cols-5 gap-1 p-2">
                  {ESSENCES.map((e) => <EssenceOrb key={e.name} e={e} />)}
                </div>
                <div className="flex justify-between px-3 pb-2 llb-mono" style={{ fontSize: 8, color: "#7a4456" }}>
                  <span>Σ ESSENCE 373.9</span>
                  <span>PURITY 96.2%</span>
                  <span className="llb-anim-flicker" style={{ animationDuration: "7s", color: "#ffb15c" }}>REFINING…</span>
                </div>
              </section>

              {/* Alchemical formula */}
              <section className="llb-panel llb-notch" style={{ transform: "rotate(0.35deg)", marginRight: -6 }}>
                <CornerTicks />
                <Grime seed={23} stains={3} />
                <PanelHead title="Alchemical Formula" right="EQ-114" />
                <div className="px-3 pt-2">
                  <div className="llb-caps-sm" style={{ color: "#9a5a70" }}>Active Formula</div>
                  <div className="llb-glow-o" style={{ fontSize: 17, letterSpacing: ".14em" }}>{"VITAE \u2697\uFE0E LUX \u00D7 MOTUS"}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="llb-caps-sm" style={{ color: "#9a5a70" }}>Balance</span>
                    <div className="llb-bar flex-1"><i style={{ width: "78%" }} /></div>
                    <span className="llb-mono llb-glow-m" style={{ fontSize: 11 }}>78%</span>
                  </div>
                </div>
                <div className="p-2 flex flex-col gap-1">
                  {REAGENTS.map((r) => (
                    <div key={r.name} className="flex items-center gap-2 px-2 py-1" style={{ border: "1px solid rgba(214,90,130,.12)", background: "rgba(20,6,14,.5)" }}>
                      <span style={{ color: "#c47dff", fontSize: 13, width: 16, textAlign: "center" }}>{r.mark}</span>
                      <span className="llb-caps-sm" style={{ color: "#d9a8b8", width: 86 }}>{r.name}</span>
                      <span style={{ fontSize: 9, color: "#7a4456", fontStyle: "italic", flex: 1 }}>{r.aspect}</span>
                      <div className="llb-bar llb-hide-m" style={{ width: 40 }}><i style={{ width: `${r.w}%` }} /></div>
                      <span className="llb-mono" style={{ fontSize: 10, color: "#ffb15c" }}>{r.value}</span>
                    </div>
                  ))}
                </div>
                <div className="llb-ticks mx-3 mb-2" />
              </section>

              {/* Rune matrix */}
              <div className="llb-seam"><span className="llb-tag" style={{ top: -6, left: "18%" }}>Array Active — Do Not Cross</span></div>
              <section className="llb-panel llb-notch" style={{ transform: "rotate(0.9deg)", marginLeft: 6 }}>
                <CornerTicks />
                <Grime seed={37} />
                <PanelHead title="Rune Matrix" right="8×3 ARRAY" />
                <div className="grid grid-cols-8 gap-1 p-2">
                  {RUNES.map((r, i) => {
                    const lit = RUNE_LIT.includes(i);
                    return (
                      <div
                        key={i}
                        className={`flex items-center justify-center ${lit ? "llb-anim-pulse" : ""}`}
                        style={{
                          aspectRatio: "1", fontSize: 15,
                          border: `1px solid ${lit ? "rgba(255,61,138,.5)" : "rgba(214,90,130,.14)"}`,
                          background: lit ? "rgba(122,20,64,.35)" : "rgba(20,6,14,.4)",
                          color: lit ? "#ff5c9a" : "#5c3040",
                          textShadow: lit ? "0 0 9px rgba(255,61,138,.9)" : "none",
                          animationDuration: `${5 + (i % 5)}s`,
                        }}
                      >
                        {r}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2 px-3 pb-2.5">
                  <span className="llb-caps-sm" style={{ color: "#9a5a70" }}>Matrix Resonance</span>
                  <div className="llb-bar flex-1"><i style={{ width: "64.2%" }} /></div>
                  <span className="llb-mono llb-glow-p" style={{ fontSize: 11 }}>64.2%</span>
                </div>
              </section>
            </div>

            {/* ---------- CENTER COLUMN ---------- */}
            <div className="flex flex-col gap-3 min-w-0 relative">
              <div className="llb-seam"><span className="llb-tag" style={{ top: -6, left: "38%" }}>Specimen λ-9 · Live</span></div>
              <section className="llb-panel llb-notch" style={{ transform: "rotate(0.25deg)" }}>
                <CornerTicks />
                <Grime seed={41} stains={3} specks={12} />
                <Scorch style={{ left: "50%", top: "52%", width: 340, height: 340, transform: "translate(-50%,-50%)" }} />
                <Smoke duration="52s" style={{ right: "8%", bottom: "14%", width: 70, height: 70 }} />
                <Smoke duration="38s" delay="-19s" style={{ right: "16%", bottom: "22%", width: 45, height: 45 }} />
                <PanelHead title="The Calculation Chamber" right="SEED XIX-Ω-721 · RUN 0884" />
                <div className="flex items-stretch">
                  <div className="hidden sm:flex flex-col justify-center pl-2">
                    <VGauge label="Energy Flow" sym="Ψ" value="9.72" pct={72} hue="#ff3d8a" marks={["100", "80", "60", "40", "20", "0"]} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Chamber />
                  </div>
                  <div className="hidden sm:flex flex-col justify-center pr-2">
                    <VGauge label="Magic Resonance" sym="Ω" value="8.31" pct={64} hue="#a55cff" marks={["MAX", "HI", "NOM", "LO", "MIN"]} />
                  </div>
                </div>
                <div className="flex justify-between px-3 pb-2 llb-mono" style={{ fontSize: 8, color: "#7a4456" }}>
                  <span>ORBIT SYNC 91.4%</span>
                  <span className="llb-anim-flicker" style={{ animationDuration: "9s", color: "#c47dff" }}>CRYSTAL HARMONIC · 432.8 Hz</span>
                  <span>FIELD DRIFT +0.003</span>
                </div>
              </section>

              {/* Equation scribe */}
              <section className="llb-panel llb-notch" style={{ transform: "rotate(-0.55deg)", marginLeft: 12, marginRight: -4 }}>
                <CornerTicks />
                <Grime seed={53} specks={14} scratches={3} />
                <PanelHead title="Equation Scribe" right="AUTOGRAPH III" />
                <div className="grid md:grid-cols-[1fr_150px_150px] gap-0">
                  <div className="p-3 border-r" style={{ borderColor: "rgba(214,90,130,.15)" }}>
                    <div className="llb-mono flex flex-col gap-2.5" style={{ fontSize: 12.5, color: "#f0c9d6", fontStyle: "italic" }}>
                      <div>ΔE = ( Σ<sub>i</sub> m<sub>i</sub> · v<sub>i</sub><sup>2</sup> ) / 2 + Φ<sub>arcane</sub> − λ( Ψ · Ω )</div>
                      <div style={{ color: "#c47dff" }}>R<sub>total</sub> = Π( 1 + α<sub>i</sub>·e<sup>−βt</sup> ) + ∫<sub>0</sub><sup>t</sup> Λ(s) ds</div>
                      <div style={{ color: "#ffb15c" }}>S = k<sub>B</sub> ln( W ) + η · ∇<sub>astral</sub> − A</div>
                    </div>
                    <div className="llb-ticks mt-3" />
                    <div className="flex justify-between mt-1.5 llb-mono" style={{ fontSize: 8, color: "#7a4456" }}>
                      <span>CONVERGENCE 10⁻⁶</span>
                      <span>ITER 14,207</span>
                      <span className="llb-anim-pulse" style={{ animationDuration: "4s", color: "#ff5c9a" }}>SCRIBING</span>
                    </div>
                  </div>
                  <div className="p-3 border-r llb-hide-m" style={{ borderColor: "rgba(214,90,130,.15)" }}>
                    <div className="llb-caps-sm mb-1.5" style={{ color: "#9a5a70" }}>Variables</div>
                    {VARIABLES.map((v) => (
                      <div key={v.sym} className="flex gap-2 items-baseline" style={{ fontSize: 9, lineHeight: 1.9 }}>
                        <span className="llb-mono" style={{ color: "#ff5c9a", width: 14 }}>{v.sym}</span>
                        <span style={{ color: "#8a5566", fontStyle: "italic" }}>{v.def}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 flex flex-col items-center gap-2 justify-center">
                    <div className="llb-caps-sm" style={{ color: "#9a5a70" }}>Solve Controls</div>
                    <svg width="70" height="70" viewBox="0 0 80 80" aria-hidden className="llb-anim-spin" style={{ animationDuration: "60s" }}>
                      <polygon points="40,8 68,56 12,56" fill="none" stroke="rgba(196,125,255,.6)" strokeWidth=".9" />
                      <circle cx="40" cy="44" r="18" fill="none" stroke="rgba(255,92,154,.5)" strokeWidth=".8" strokeDasharray="3 4" />
                      <circle cx="40" cy="44" r="4" fill="#ff3d8a" opacity=".8" />
                    </svg>
                    <button type="button" className="llb-btn llb-notch llb-anim-pulse" style={{ animationDuration: "6s", width: "100%", justifyContent: "center" }}>Solve</button>
                    <button type="button" className="llb-caps-sm" style={{ color: "#8a4a5e", border: "1px solid rgba(214,90,130,.25)", padding: "5px 0", width: "100%" }}>Reset ⟲</button>
                  </div>
                </div>
              </section>
            </div>

            {/* ---------- RIGHT COLUMN ---------- */}
            <div className="flex flex-col gap-3 min-w-0 relative" style={{ marginTop: 18 }}>
              <section className="llb-panel llb-notch" style={{ transform: "rotate(0.6deg)" }}>
                <CornerTicks />
                <Grime seed={67} />
                <PanelHead title="Planar Orbits" right="HELIOSYNC" />
                <PlanarOrbits />
                <div className="flex justify-between px-3 pb-2 llb-mono" style={{ fontSize: 8, color: "#7a4456" }}>
                  <span>INCL −14.2°</span><span>PERIOD 365.25 d</span><span className="llb-glow-o">{"\u263F\uFE0E RETROGRADE"}</span>
                </div>
              </section>

              <div className="llb-seam"><span className="llb-tag" style={{ top: -6, right: "12%" }}>ψ-Surge Logged</span></div>
              <section className="llb-panel llb-notch" style={{ transform: "rotate(-0.45deg)", marginRight: -6 }}>
                <CornerTicks />
                <Grime seed={71} stains={1} specks={8} />
                <PanelHead title="Destiny Vectors" right="6-AXIS" />
                <div className="p-3 flex flex-col gap-2">
                  {VECTORS.map((v) => (
                    <div key={v.name} className="flex items-center gap-2">
                      <span className="llb-caps-sm" style={{ color: "#c98ba0", width: 44 }}>{v.name}</span>
                      <div className="llb-bar flex-1"><i style={{ width: `${v.w}%` }} /></div>
                      <span className="llb-mono" style={{ fontSize: 10, color: "#e8b7c6", width: 32, textAlign: "right" }}>{v.value}</span>
                    </div>
                  ))}
                </div>
                <div className="llb-ticks mx-3 mb-2" />
                <div className="flex justify-between px-3 pb-2 llb-mono" style={{ fontSize: 8, color: "#7a4456" }}>
                  <span>DOMINANT: WILL</span><span>Σ 3.82 / 6.00</span>
                </div>
              </section>

              <section className="llb-panel llb-notch" style={{ transform: "rotate(0.8deg)", marginTop: -14, position: "relative", zIndex: 2 }}>
                <CornerTicks />
                <Grime seed={83} specks={8} />
                <Smoke duration="44s" delay="-11s" style={{ left: "4%", bottom: "8%", width: 55, height: 55 }} />
                <PanelHead title="Arcana Cards" right="Deck Alignment: 72%" />
                <div className="grid grid-cols-5 gap-1.5 p-2">
                  {CARDS.map((c) => (
                    <div key={c.name} className="flex flex-col items-center" style={{ border: `1px solid ${c.hue}55`, background: "linear-gradient(180deg, rgba(30,8,20,.9), rgba(16,5,12,.95))", boxShadow: `0 0 12px ${c.glow} inset` }}>
                      <span className="llb-mono pt-1" style={{ fontSize: 8, color: "#9a5a70" }}>{c.numeral}</span>
                      <svg width="100%" height="64" viewBox="0 0 60 68" aria-hidden>
                        <rect x="4" y="3" width="52" height="62" fill="none" stroke={`${c.hue}44`} strokeWidth=".7" />
                        <CardMotif motif={c.motif} hue={c.hue} />
                      </svg>
                      <span className="llb-caps-sm text-center pb-1.5" style={{ fontSize: 6.5, color: c.hue, lineHeight: 1.5 }}>{c.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* ---------- ZODIAC BAND ---------- */}
          <div className="llb-seam"><span className="llb-tag" style={{ top: -6, right: "10%" }}>Ephemeris Locked</span></div>
          <section className="llb-panel llb-notch" style={{ transform: "rotate(-0.3deg)", marginTop: -18, marginLeft: -6, marginRight: -6, position: "relative", zIndex: 3 }}>
            <CornerTicks />
            <Grime seed={89} stains={1} specks={8} />
            <PanelHead title="Zodiac Register — Twelve Signs of the Wheel" right="EPHEMERIS 2026" />
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12">
              {ZODIAC.map((z, i) => (
                <div key={z.name} className="flex flex-col items-center gap-0.5 py-2 px-1" style={{ borderLeft: i ? "1px solid rgba(214,90,130,.12)" : undefined }}>
                  <span className="llb-anim-pulse" style={{ fontSize: 19, color: i % 2 ? "#c47dff" : "#ffb15c", textShadow: "0 0 9px rgba(255,138,60,.5)", animationDuration: `${8 + i}s` }}>{z.glyph}</span>
                  <span className="llb-caps-sm" style={{ fontSize: 7.5, color: "#d9a8b8" }}>{z.name}</span>
                  <span className="llb-mono" style={{ fontSize: 7, color: "#7a4456" }}>{z.dates}</span>
                </div>
              ))}
            </div>
            <div className="llb-ticks mx-3 mb-2" />
          </section>

          {/* ---------- SIX APPARATUS TILES ---------- */}
          <section id="llb-sections" className="llb-panel llb-notch" style={{ transform: "rotate(0.25deg)", marginLeft: 8 }}>
            <CornerTicks />
            <Grime seed={97} stains={3} specks={12} scratches={3} />
            <PanelHead title="Instrument Registry — Six Working Apparatus" right="ALL MODULES NOMINAL" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3">
              {SECTIONS.map((s, i) => (
                <div key={s.title} className="flex gap-3 p-3" style={{ borderTop: i > 2 ? "1px solid rgba(214,90,130,.12)" : undefined, borderLeft: i % 3 ? "1px solid rgba(214,90,130,.12)" : undefined }}>
                  <div className="flex flex-col items-center gap-1" style={{ flex: "none" }}>
                    <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden>
                      <rect x="2" y="2" width="36" height="36" fill="none" stroke="rgba(255,138,60,.35)" strokeWidth=".8" transform="rotate(45 20 20)" />
                      <path d={s.icon} fill="none" stroke={i % 2 ? "#c47dff" : "#ff5c9a"} strokeWidth="1.1" />
                    </svg>
                    <span className="llb-mono" style={{ fontSize: 7, color: "#ffb15c", border: "1px solid rgba(255,138,60,.4)", padding: "1px 4px" }}>{s.tag}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="llb-caps" style={{ fontSize: 11, color: "#f0d3dd" }}>{s.title}</div>
                    <p style={{ fontSize: 10.5, lineHeight: 1.55, color: "#a06b7c", margin: "3px 0 5px" }}>{s.copy}</p>
                    <span className="llb-caps-sm" style={{ color: "#ff5c9a", fontSize: 8 }}>Explore →</span>
                  </div>
                  <span className="llb-mono llb-hide-m" style={{ fontSize: 8, color: "#5c3040", marginLeft: "auto" }}>APP-0{i + 1}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ---------- DESTINY MATRIX + FAQ ---------- */}
          <div className="grid lg:grid-cols-[340px_1fr] gap-3">
            <section className="llb-panel llb-notch" style={{ transform: "rotate(-0.8deg)", marginTop: 8 }}>
              <CornerTicks />
              <Grime seed={101} stains={2} specks={9} />
              <PanelHead title="Destiny Matrix" right="OPTIONAL MODULE" />
              <div className="p-2"><Octagram /></div>
              <p className="px-3" style={{ fontSize: 10.5, lineHeight: 1.6, color: "#a06b7c" }}>
                An optional birth-date octagram tool. It maps purpose, love, money, and age themes from your birth date.
              </p>
              <div className="flex items-center justify-between px-3 py-2.5">
                <span className="llb-caps-sm" style={{ color: "#ff5c9a" }}>Open Destiny Matrix →</span>
                <span className="llb-mono" style={{ fontSize: 8, color: "#7a4456" }}>OCT-8 · 22 PATHS</span>
              </div>
            </section>

            <section className="llb-panel llb-notch" style={{ transform: "rotate(0.45deg)", marginLeft: -14, position: "relative", zIndex: 2 }}>
              <CornerTicks />
              <Grime seed={103} stains={2} specks={9} scratches={3} />
              <PanelHead title="Experiment Notes — Frequently Consulted Entries" right="ARCHIVE 4/128" />
              <div className="grid sm:grid-cols-2">
                {FAQ.map((f, i) => (
                  <div key={f.id} className="p-3" style={{ borderTop: i > 1 ? "1px solid rgba(214,90,130,.12)" : undefined, borderLeft: i % 2 ? "1px solid rgba(214,90,130,.12)" : undefined }}>
                    <div className="flex items-baseline gap-2">
                      <span className="llb-mono" style={{ fontSize: 8, color: "#ffb15c" }}>{f.id}</span>
                      <span className="llb-caps-sm" style={{ color: "#e8b7c6", fontSize: 9 }}>{f.q}</span>
                    </div>
                    <p style={{ fontSize: 10, lineHeight: 1.6, color: "#8a5566", marginTop: 4, fontStyle: "italic" }}>{f.a}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between px-3 pb-2 llb-mono" style={{ fontSize: 8, color: "#5c3040" }}>
                <span>TRANSCRIBED FROM THE GRIMOIRE</span>
                <span>REV. 7 — VERIFIED AGAINST SKY</span>
              </div>
            </section>
          </div>

          {/* ---------- CTA ---------- */}
          <div className="llb-seam"><span className="llb-tag" style={{ top: -6, left: "8%" }}>Final Seal — Approach Unarmed</span></div>
          <section id="llb-cta" className="llb-panel llb-notch" style={{ background: "linear-gradient(120deg, rgba(90,14,48,.9), rgba(40,8,26,.92) 55%, rgba(61,17,96,.7))", transform: "rotate(-0.35deg)", marginLeft: -16, marginRight: -16, position: "relative", zIndex: 2 }}>
            <CornerTicks />
            <Grime seed={107} stains={1} specks={6} scratches={1} />
            <div className="flex flex-col md:flex-row items-center gap-4 px-5 py-5">
              <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden className="llb-anim-spin" style={{ animationDuration: "90s", flex: "none" }}>
                <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,138,60,.5)" strokeWidth=".9" strokeDasharray="4 5" />
                <path d="M26 8 L29 23 L44 26 L29 29 L26 44 L23 29 L8 26 L23 23 Z" fill="none" stroke="#ff5c9a" strokeWidth="1.1" />
                <circle cx="26" cy="26" r="4" fill="#ffb15c" opacity=".85" />
              </svg>
              <div className="flex-1 text-center md:text-left">
                <div className="llb-caps" style={{ fontSize: 16, color: "#ffe3ec", textShadow: "0 0 14px rgba(255,61,138,.55)" }}>
                  Your chart is written in the stars. Come read it.
                </div>
                <div className="llb-mono mt-1" style={{ fontSize: 9, color: "#9a5a70", letterSpacing: ".14em" }}>
                  NO COST · NO INCANTATION REQUIRED · RESULTS IN ~3 SECONDS
                </div>
              </div>
              <div className="flex flex-col gap-2 items-stretch" style={{ flex: "none" }}>
                <a href="#llb-cta" className="llb-btn llb-notch justify-center">Get started — it&apos;s free</a>
                <a href="#llb-cta" className="llb-caps-sm text-center" style={{ color: "#c98ba0", border: "1px solid rgba(214,90,130,.3)", padding: "7px 14px" }}>Cast your free birth chart</a>
              </div>
            </div>
            <div className="llb-ticks mx-4 mb-3" />
          </section>

          {/* ---------- FOOTER ---------- */}
          <footer className="flex flex-wrap items-center gap-x-5 gap-y-1 px-3 py-2 llb-caps-sm" style={{ border: "1px solid rgba(214,90,130,.18)", color: "#7a4456", background: "rgba(20,6,14,.6)", fontSize: 8 }}>
            <span style={{ color: "#b07a8d" }}>ASTRO SCOPE · ARCANA LABORATORIUM</span>
            <span>Horoscopes</span><span>Tarot</span><span>Compatibility</span><span>Birth Chart</span><span>Destiny Matrix</span>
            <span className="flex-1" />
            <span className="llb-mono">SEED XIX-Ω-721</span>
            <span className="llb-mono">© 2026 — ALL ORBITS RESERVED</span>
          </footer>

          {/* stray annotations + border-crossing specks + edge-bleed rune */}
          <span className="llb-annot llb-hide-m" style={{ left: 318, top: "13%", transform: "rotate(90deg)", transformOrigin: "left top" }}>Field Sample 07 — Unsterile</span>
          <span className="llb-annot llb-hide-m" style={{ right: 330, top: "40%", transform: "rotate(-90deg)", transformOrigin: "right top" }}>Containment Seam B</span>
          <span className="llb-xspeck" style={{ left: 313, top: "26%", width: 3, height: 3, background: "#ff3d8a", boxShadow: "0 0 6px #ff3d8a" }} />
          <span className="llb-xspeck" style={{ left: 309, top: "calc(26% + 8px)", width: 2, height: 2, background: "rgba(150,60,90,.7)" }} />
          <span className="llb-xspeck" style={{ right: 321, top: "58%", width: 3, height: 3, background: "#ffb15c", boxShadow: "0 0 6px #ffb15c" }} />
          <span className="llb-xspeck" style={{ right: 317, top: "calc(58% + 9px)", width: 2, height: 2, background: "rgba(96,58,28,.8)" }} />
          <span className="llb-rune-giant llb-hide-m" style={{ fontSize: 210, right: -52, top: "56%", color: "rgba(196,125,255,.08)", transform: "rotate(90deg)", zIndex: 0 }}>{RUNES[7]}</span>
        </main>
      </div>

      {/* ======================= BOTTOM STATUS STRIP ======================= */}
      <div className="sticky bottom-0 z-30 flex flex-wrap items-stretch border-t llb-mono" style={{ borderColor: "rgba(214,90,130,.3)", background: "rgba(16,5,11,.96)", fontSize: 9 }}>
        <div className="flex items-center gap-4 px-4 py-2 border-r" style={{ borderColor: "rgba(214,90,130,.2)" }}>
          <span className="llb-caps-sm" style={{ color: "#9a5a70" }}>Lab Status</span>
          <span className="llb-glow-m llb-anim-pulse" style={{ animationDuration: "5s" }}>OPERATIONAL</span>
          <span style={{ color: "#ffb15c" }}>36.7°C</span>
          <span style={{ color: "#c47dff" }}>STABLE</span>
          <span style={{ color: "#8ad0a0" }}>ONLINE</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 flex-1 min-w-[240px]">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className="llb-anim-spin" style={{ animationDuration: "24s" }}>
            <circle cx="8" cy="8" r="6" fill="none" stroke="#ff3d8a" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="8" cy="8" r="2" fill="#ffb15c" />
          </svg>
          <span className="llb-caps-sm" style={{ color: "#9a5a70" }}>Active Ritual</span>
          <span className="llb-caps" style={{ fontSize: 10, color: "#ffd7e4", textShadow: "0 0 8px rgba(255,61,138,.5)" }}>Circulus Infinitas</span>
          <div className="llb-bar flex-1" style={{ height: 5 }}><i className="llb-anim-pulse" style={{ width: "67%", animationDuration: "6s" }} /></div>
          <span style={{ color: "#ff5c9a" }}>67%</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 border-l" style={{ borderColor: "rgba(214,90,130,.2)" }}>
          <span className="llb-caps-sm" style={{ color: "#9a5a70" }}>Est. Time</span>
          <span className="llb-glow-o llb-anim-flicker" style={{ fontSize: 13, letterSpacing: ".14em", animationDuration: "8s" }}>02:17:53</span>
        </div>
        <div className="hidden md:flex items-center gap-4 px-4 py-2 border-l llb-caps-sm" style={{ borderColor: "rgba(214,90,130,.2)", color: "#7a4456" }}>
          <span>{"\u26A0\uFE0E"} 7</span><span>{"\u2709\uFE0E"} 12</span><span style={{ color: "#ff5c9a" }}>✦ 3</span>
        </div>
      </div>

      {/* viewport-corner smoke + dust noise */}
      <Smoke duration="60s" style={{ position: "fixed", left: 14, bottom: 60, width: 90, height: 90, zIndex: 40 }} />
      <Smoke duration="46s" delay="-23s" style={{ position: "fixed", left: 60, bottom: 44, width: 56, height: 56, zIndex: 40 }} />
      <div className="llb-noise" aria-hidden />
    </div>
  );
}
