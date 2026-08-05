"use client";

// TAROT / DAILY CARD — a TOOL page, not a landing: compact header with tarot
// cross-nav, the draw chamber immediately at the top of the viewport, and
// condensed explainer/FAQ below. Production palette (from lab/remix-v2):
// bg rgb(10,9,18), text #e9e6f2/#b7b1cc, gold #f3c77a/#e39a4c/#ffdd9c,
// deep gold #c9a227, violet #a25adf/#b794f6. Broken+magic structure kept:
// translucent panels over a fixed sky of counter-rotating wheels, star
// specks, hairline orbits, constellations and giant dim glyphs (U+FE0E).

import Link from "next/link";
import { useState } from "react";
import type { CSSProperties } from "react";

/* ------------------------------------------------------------------ */
/* Geometry + PRNG helpers                                             */
/* ------------------------------------------------------------------ */

const rad = (deg: number) => (deg * Math.PI) / 180;
const polar = (cx: number, cy: number, r: number, deg: number) => ({
  x: Math.round((cx + r * Math.cos(rad(deg))) * 100) / 100,
  y: Math.round((cy + r * Math.sin(rad(deg))) * 100) / 100,
});

// deterministic PRNG so the star field is stable between renders
function mulberry32(seed: number) {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (s >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ */
/* Palette                                                             */
/* ------------------------------------------------------------------ */

const GOLD = "#f3c77a";
const GOLD_DEEP = "#c9a227";
const GOLD_HOT = "#e39a4c";
const CREAM = "#ffdd9c";
const VIOLET = "#a25adf";
const VIOLET_SOFT = "#b794f6";
const TEXT_HI = "#e9e6f2";
const TEXT_LO = "#b7b1cc";

// glyphs carry U+FE0E so they render as text, never emoji
const FE = "︎";

/* ------------------------------------------------------------------ */
/* Data — the chamber's calibrated octant of the major arcana          */
/* ------------------------------------------------------------------ */

type Emblem = "fool" | "magician" | "priestess" | "chariot" | "wheel" | "temperance" | "star" | "world";

type Arcana = {
  numeral: string;
  name: string;
  hue: string;
  keywords: [string, string, string];
  guidance: string;
  emblem: Emblem;
};

const DECK: Arcana[] = [
  {
    numeral: "0",
    name: "THE FOOL",
    hue: CREAM,
    keywords: ["BEGINNINGS", "LEAP", "TRUST"],
    guidance: "Step before the plan is finished; the ground assembles under an honest foot.",
    emblem: "fool",
  },
  {
    numeral: "I",
    name: "THE MAGICIAN",
    hue: GOLD,
    keywords: ["WILL", "CRAFT", "FOCUS"],
    guidance: "Every tool you need is already on the bench; today, use exactly one of them well.",
    emblem: "magician",
  },
  {
    numeral: "II",
    name: "THE HIGH PRIESTESS",
    hue: VIOLET_SOFT,
    keywords: ["INTUITION", "SILENCE", "DEPTHS"],
    guidance: "The answer is behind the curtain, not in the noise; sit still until it surfaces.",
    emblem: "priestess",
  },
  {
    numeral: "VII",
    name: "THE CHARIOT",
    hue: GOLD_HOT,
    keywords: ["DRIVE", "DIRECTION", "CONTROL"],
    guidance: "Pick one heading and hold it; the horses pull hardest when the reins agree.",
    emblem: "chariot",
  },
  {
    numeral: "X",
    name: "WHEEL OF FORTUNE",
    hue: GOLD,
    keywords: ["CYCLES", "TURNING", "CHANCE"],
    guidance: "The wheel is mid-rotation; do not cling to the spoke that carried you up.",
    emblem: "wheel",
  },
  {
    numeral: "XIV",
    name: "TEMPERANCE",
    hue: VIOLET_SOFT,
    keywords: ["MEASURE", "BLEND", "PATIENCE"],
    guidance: "Pour slowly between the vessels; today’s work is dilution, not force.",
    emblem: "temperance",
  },
  {
    numeral: "XVII",
    name: "THE STAR",
    hue: CREAM,
    keywords: ["HOPE", "SIGNAL", "RENEWAL"],
    guidance: "One clear signal outlasts a sky of noise; follow the brightest, smallest point.",
    emblem: "star",
  },
  {
    numeral: "XXI",
    name: "THE WORLD",
    hue: GOLD_HOT,
    keywords: ["COMPLETION", "CIRCUIT", "ARRIVAL"],
    guidance: "Close the loop you opened weeks ago; the last seam is also the threshold.",
    emblem: "world",
  },
];

const NAV: { label: string; href: string; active?: boolean }[] = [
  { label: "TAROT HUB", href: "/tarot" },
  { label: "DAILY CARD", href: "/tarot/spreads/daily-card", active: true },
  { label: "YES / NO", href: "/tarot/spreads/yes-no" },
  { label: "PAST · PRESENT · FUTURE", href: "/tarot/spreads/past-present-future" },
  { label: "LOVE", href: "/tarot/spreads/love-three-card" },
  { label: "BIRTH ARCANA", href: "/tarot/birth-arcana" },
  { label: "ALL CARDS", href: "/tarot/cards" },
  { label: "MATRIX", href: "/tarot/destiny-matrix" },
];

// tab "dirt": slight rotations so the nav refuses to sit straight
const TAB_DIRT = [
  "rotate(-.7deg) translateY(1px)",
  "rotate(.4deg)",
  "rotate(-.3deg) translateY(-1px)",
  "rotate(.6deg) translateY(1px)",
  "rotate(-.5deg)",
  "rotate(.3deg) translateY(-1px)",
  "rotate(-.4deg) translateY(1px)",
];

const STEPS: { id: string; title: string; copy: string }[] = [
  {
    id: "01",
    title: "Draw at first light",
    copy: "Pull before mail, news, other people’s weather — the chamber reads an unshaped day best.",
  },
  {
    id: "02",
    title: "Name the theme",
    copy: "Reduce the card to one word and carry the word, not the image.",
  },
  {
    id: "03",
    title: "Test at midday",
    copy: "Hold the theme against the day by noon; note where it resisted.",
  },
  {
    id: "04",
    title: "Seal at night",
    copy: "Log one line. Thirty lines make a pattern no single card can.",
  },
];

const STEP_DIRT: CSSProperties[] = [
  { transform: "rotate(-.8deg)" },
  { transform: "rotate(.6deg) translateY(18px)" },
  { transform: "rotate(-.5deg) translateY(-6px)" },
  { transform: "rotate(.9deg) translateY(12px)" },
];

const FAQ: { id: string; q: string; a: string }[] = [
  {
    id: "NOTE 01",
    q: "Is the daily card a prediction?",
    a: "No — treat it as a lens, not a verdict. The card fixes a theme; you run the experiment. A day examined through one deliberate idea teaches more than a day passively forecast.",
  },
  {
    id: "NOTE 02",
    q: "Can I draw more than once?",
    a: "One draw per day holds the signal; a second pull usually just shops for a better answer. Re-draws in this chamber are unlogged, so practice freely here and keep the discipline in your own log.",
  },
  {
    id: "NOTE 03",
    q: "Why only eight cards in this chamber?",
    a: "This bay holds a calibrated octant of the major arcana — eight archetypes tuned for daily work. The full seventy-eight-card deck lives in the larger spreads, where more apparatus is warranted.",
  },
];

const FAQ_DIRT: CSSProperties[] = [
  { marginRight: 52, transform: "rotate(-.4deg)" },
  { marginLeft: 48, transform: "rotate(.5deg)" },
  { marginLeft: 20, marginRight: 30, transform: "rotate(-.3deg)" },
];

/* ------------------------------------------------------------------ */
/* Backdrop data — star field, generated once at module scope          */
/* ------------------------------------------------------------------ */

const STARS = (() => {
  const rnd = mulberry32(20260204);
  return Array.from({ length: 110 }, (_, i) => ({
    x: +(rnd() * 1600).toFixed(0),
    y: +(rnd() * 1000).toFixed(0),
    r: +(0.5 + rnd() * 1.1).toFixed(2),
    o: +(0.14 + rnd() * 0.4).toFixed(2),
    tw: i % 5 === 0,
    d: +(rnd() * 8).toFixed(1),
    key: i,
  }));
})();

/* ------------------------------------------------------------------ */
/* Scoped styles                                                       */
/* ------------------------------------------------------------------ */

const CSS = `
.ldc-root { background:rgb(10,9,18); color:${TEXT_LO}; font-family:Georgia,'Times New Roman',serif; position:relative; overflow-x:clip; }
.ldc-mono { font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace; }
.ldc-serif { font-family:'Playfair Display','Cormorant Garamond',Georgia,'Times New Roman',serif; }
.ldc-glyph { font-family:'Noto Sans Symbols','Noto Sans Symbols 2',Symbola,'Segoe UI Symbol',serif; font-style:normal; }
.ldc-caps { text-transform:uppercase; letter-spacing:.24em; }
.ldc-caps-sm { text-transform:uppercase; letter-spacing:.2em; font-size:9px; }
/* panels stay translucent so the sky machinery passes visibly BEHIND them */
.ldc-panel {
  background:linear-gradient(160deg, rgba(23,19,40,.62), rgba(12,10,22,.72));
  border:1px solid rgba(233,230,242,.10);
  backdrop-filter:blur(3px);
  position:relative;
}
.ldc-header { display:flex; align-items:center; gap:8px; border-bottom:1px solid rgba(243,199,122,.16); padding:7px 12px; }
.ldc-hdot { width:5px; height:5px; transform:rotate(45deg); background:${GOLD}; box-shadow:0 0 6px ${GOLD}; flex:none; }
.ldc-htext { font-size:10px; letter-spacing:.28em; color:${TEXT_HI}; text-transform:uppercase; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ldc-rule { height:1px; background:linear-gradient(90deg, rgba(243,199,122,.4), rgba(243,199,122,.04)); }
.ldc-ticks { background-image:repeating-linear-gradient(90deg, rgba(243,199,122,.32) 0 1px, transparent 1px 8px); height:5px; }
.ldc-ticks-v { background-image:repeating-linear-gradient(0deg, rgba(243,199,122,.36) 0 1px, transparent 1px 7px); width:5px; }
.ldc-engrave {
  text-transform:uppercase; letter-spacing:.4em; font-size:10px; color:rgba(243,199,122,.48);
  text-shadow:0 1px 0 rgba(0,0,0,.8), 0 -1px 0 rgba(255,221,156,.08);
}
.ldc-btn {
  display:inline-flex; align-items:center; gap:10px; cursor:pointer;
  background:linear-gradient(180deg, rgba(243,199,122,.24), rgba(201,162,39,.3));
  border:1px solid rgba(243,199,122,.62); color:${CREAM};
  text-transform:uppercase; letter-spacing:.26em; font-size:10px;
  padding:11px 22px; box-shadow:0 0 20px rgba(243,199,122,.28), inset 0 0 14px rgba(243,199,122,.2);
  transition:box-shadow .3s;
}
.ldc-btn:hover { box-shadow:0 0 32px rgba(243,199,122,.5), inset 0 0 18px rgba(243,199,122,.34); }
.ldc-btn[disabled] { opacity:.55; cursor:wait; }
.ldc-btn-ghost {
  display:inline-flex; align-items:center; gap:8px;
  border:1px solid rgba(183,148,246,.4); color:#d3c3f7;
  text-transform:uppercase; letter-spacing:.24em; font-size:10px;
  padding:11px 18px; background:rgba(162,90,223,.07);
  box-shadow:inset 0 0 12px rgba(162,90,223,.12);
  transition:box-shadow .3s, border-color .3s;
}
.ldc-btn-ghost:hover { border-color:rgba(183,148,246,.75); box-shadow:0 0 18px rgba(162,90,223,.3), inset 0 0 14px rgba(162,90,223,.2); }
.ldc-tab {
  display:inline-block; text-decoration:none;
  border:1px solid transparent; color:${TEXT_LO};
  text-transform:uppercase; letter-spacing:.18em; font-size:9px;
  padding:7px 11px; transition:color .25s, border-color .25s, background .25s, box-shadow .25s;
  white-space:nowrap;
}
.ldc-tab:hover { color:${CREAM}; border-color:rgba(243,199,122,.35); }
.ldc-tab-active {
  color:${CREAM}; border-color:rgba(243,199,122,.55);
  background:rgba(243,199,122,.09);
  box-shadow:0 0 14px rgba(243,199,122,.22), inset 0 0 10px rgba(243,199,122,.12);
  text-shadow:0 0 8px rgba(243,199,122,.6);
}
details.ldc-faq { border:1px solid rgba(233,230,242,.12); background:rgba(18,15,32,.6); backdrop-filter:blur(3px); position:relative; }
details.ldc-faq summary { cursor:pointer; list-style:none; display:flex; align-items:center; gap:12px; padding:13px 16px; }
details.ldc-faq summary::-webkit-details-marker { display:none; }
details.ldc-faq summary .ldc-faq-x { transition:transform .3s; }
details.ldc-faq[open] summary .ldc-faq-x { transform:rotate(45deg); }
details.ldc-faq[open] { border-color:rgba(243,199,122,.45); box-shadow:0 0 18px rgba(243,199,122,.14); }
.ldc-wheel-spin { animation:ldc-spin 260s linear infinite; }
.ldc-wheel-spin-rev { animation:ldc-spin 320s linear infinite reverse; }
.ldc-twinkle { animation:ldc-twinkle 7s ease-in-out infinite; }
.ldc-float-a { animation:ldc-floatA 34s ease-in-out infinite; }
.ldc-float-b { animation:ldc-floatB 42s ease-in-out infinite; }
.ldc-nebula { animation:ldc-floatA 60s ease-in-out infinite; }
.ldc-shoot {
  position:absolute; width:190px; height:1px;
  background:linear-gradient(90deg, rgba(255,221,156,.9), rgba(255,221,156,0));
  opacity:0; animation:ldc-shoot 17s linear infinite; animation-delay:4s;
}
.ldc-shoot-b { animation-duration:23s; animation-delay:12s; width:140px; }
.ldc-stage { perspective:1500px; }
.ldc-flip {
  position:relative; width:100%; height:100%;
  transform-style:preserve-3d;
  transition:transform 1.05s cubic-bezier(.22,.72,.24,1);
}
.ldc-flip.ldc-on { transform:rotateY(180deg); }
.ldc-face { position:absolute; inset:0; backface-visibility:hidden; -webkit-backface-visibility:hidden; }
.ldc-face-front { transform:rotateY(180deg); }
.ldc-flip.ldc-on .ldc-face-front > div { animation:ldc-reveal .9s cubic-bezier(.2,.7,.3,1) both; }
.ldc-charging .ldc-face-back > div { animation:ldc-shiver .34s linear infinite; }
.ldc-readout-swap { animation:ldc-reveal .7s ease-out both; }
@media (min-width:1024px) {
  .ldc-readout { transform:translateX(10%) rotate(.5deg); }
  .ldc-stage-shift { transform:translateX(-4%) rotate(-.6deg); }
}
.ldc-anim-spin { animation:ldc-spin linear infinite; }
.ldc-anim-spinr { animation:ldc-spinr linear infinite; }
.ldc-anim-bob { animation:ldc-bob ease-in-out infinite; }
.ldc-anim-pulse { animation:ldc-pulse ease-in-out infinite; }
.ldc-anim-flicker { animation:ldc-flicker linear infinite; }
.ldc-anim-flow { animation:ldc-flow linear infinite; }
@keyframes ldc-spin { to { transform:rotate(360deg); } }
@keyframes ldc-spinr { to { transform:rotate(-360deg); } }
@keyframes ldc-bob { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-9px); } }
@keyframes ldc-pulse { 0%,100% { opacity:.5; } 50% { opacity:1; } }
@keyframes ldc-flicker { 0%,100% { opacity:.85; } 8% { opacity:.58; } 12% { opacity:.95; } 46% { opacity:.7; } 52% { opacity:1; } 78% { opacity:.74; } }
@keyframes ldc-flow { to { stroke-dashoffset:-240; } }
@keyframes ldc-twinkle { 0%,100% { opacity:.12; } 50% { opacity:.75; } }
@keyframes ldc-floatA { 0%,100% { transform:translate(0,0) rotate(-2deg); } 50% { transform:translate(1.5vw,-2vh) rotate(1deg); } }
@keyframes ldc-floatB { 0%,100% { transform:translate(0,0) rotate(3deg); } 50% { transform:translate(-1.5vw,2vh) rotate(-1deg); } }
@keyframes ldc-shoot {
  0% { opacity:0; transform:translate3d(0,0,0) rotate(-26deg); }
  3% { opacity:.9; }
  11% { opacity:0; transform:translate3d(-58vw,30vh,0) rotate(-26deg); }
  100% { opacity:0; transform:translate3d(-58vw,30vh,0) rotate(-26deg); }
}
@keyframes ldc-reveal { 0% { transform:scale(.93); opacity:.35; } 100% { transform:scale(1); opacity:1; } }
@keyframes ldc-shiver { 0%,100% { transform:translate(0,0) rotate(0); } 25% { transform:translate(-1.5px,.5px) rotate(-.5deg); } 50% { transform:translate(1px,-1px) rotate(.4deg); } 75% { transform:translate(-.5px,1px) rotate(-.3deg); } }
@media (prefers-reduced-motion: reduce) {
  .ldc-root *, .ldc-root *::before, .ldc-root *::after { animation:none !important; transition:none !important; }
  .ldc-shoot, .ldc-shoot-b { display:none; }
}
`;

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function PanelHead({ title, right }: { title: string; right?: string }) {
  return (
    <div className="ldc-header">
      <span className="ldc-hdot" />
      <span className="ldc-htext">{title}</span>
      <span className="ldc-rule" style={{ flex: 1 }} />
      {right ? <span className="ldc-caps-sm ldc-mono" style={{ color: "rgba(243,199,122,.55)", whiteSpace: "nowrap" }}>{right}</span> : null}
    </div>
  );
}

function CornerTicks({ c = "rgba(243,199,122,.5)" }: { c?: string }) {
  const s: CSSProperties = { position: "absolute", width: 9, height: 9, borderColor: c, borderStyle: "solid", borderWidth: 0, pointerEvents: "none" };
  return (
    <>
      <span style={{ ...s, top: 3, left: 3, borderTopWidth: 1, borderLeftWidth: 1 }} />
      <span style={{ ...s, top: 3, right: 3, borderTopWidth: 1, borderRightWidth: 1 }} />
      <span style={{ ...s, bottom: 3, left: 3, borderBottomWidth: 1, borderLeftWidth: 1 }} />
      <span style={{ ...s, bottom: 3, right: 3, borderBottomWidth: 1, borderRightWidth: 1 }} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Card emblems — hand-drawn apparatus glyphs, one per arcana          */
/* ------------------------------------------------------------------ */

function CardEmblem({ kind, hue }: { kind: Emblem; hue: string }) {
  const st = { stroke: hue, strokeWidth: 1.3, fill: "none", strokeLinecap: "round" as const };
  const dim = { stroke: "rgba(183,148,246,.4)", strokeWidth: .7, fill: "none" };
  let body: React.ReactNode = null;
  if (kind === "fool") {
    body = (
      <>
        <path d="M6 44 H34" {...st} />
        <path d="M34 44 l4 -3 M34 44 l4 3" {...dim} />
        <circle cx="42" cy="37" r="3.4" {...st} className="ldc-anim-pulse" style={{ animationDuration: "6s" }} />
        <path d="M42 30 v-5 M47 33 l4 -3" {...dim} />
        <path d="M12 44 v5 M20 44 v5 M28 44 v5" {...dim} />
        <circle cx="14" cy="20" r="1.2" fill={hue} opacity=".8" />
        <circle cx="22" cy="14" r=".9" fill={hue} opacity=".6" />
      </>
    );
  } else if (kind === "magician") {
    body = (
      <>
        <path d="M18 32 C18 24 30 24 30 32 C30 40 42 40 42 32 C42 24 30 24 30 32 C30 40 18 40 18 32 Z" {...st} />
        <path d="M30 10 v8 M26 14 h8" {...dim} />
        <path d="M30 44 v6" {...st} />
        <circle cx="30" cy="32" r="2" fill={hue} className="ldc-anim-pulse" style={{ animationDuration: "5s" }} />
        <path d="M10 32 h4 M46 32 h4" {...dim} />
      </>
    );
  } else if (kind === "priestess") {
    body = (
      <>
        <path d="M34 12 A11 11 0 1 0 34 44 A8.5 8.5 0 1 1 34 12 Z" {...st} />
        <path d="M14 10 v40 M46 10 v40" {...dim} />
        <path d="M11 10 h6 M11 50 h6 M43 10 h6 M43 50 h6" {...dim} />
        <circle cx="38" cy="28" r="1.6" fill={hue} className="ldc-anim-pulse" style={{ animationDuration: "7s" }} />
      </>
    );
  } else if (kind === "chariot") {
    body = (
      <>
        <rect x="14" y="14" width="32" height="24" rx="2" {...st} />
        <path d="M14 26 h32" {...dim} />
        <circle cx="22" cy="44" r="5" {...st} />
        <circle cx="38" cy="44" r="5" {...st} />
        <path d="M22 44 h16" {...dim} />
        <path d="M50 26 h6 M53 22 l4 4 -4 4" stroke={hue} strokeWidth="1.3" fill="none" strokeLinecap="round" className="ldc-anim-pulse" style={{ animationDuration: "6s" }} />
      </>
    );
  } else if (kind === "wheel") {
    body = (
      <>
        <circle cx="30" cy="30" r="17" {...st} />
        <circle cx="30" cy="30" r="11" {...dim} />
        <circle cx="30" cy="30" r="21" {...dim} strokeDasharray="2 5" className="ldc-anim-spin" style={{ animationDuration: "60s", transformOrigin: "30px 30px" }} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
          const p1 = polar(30, 30, 4, a);
          const p2 = polar(30, 30, 17, a);
          return <line key={a} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} {...dim} />;
        })}
        <circle cx="30" cy="30" r="2.6" fill={hue} className="ldc-anim-pulse" style={{ animationDuration: "5s" }} />
      </>
    );
  } else if (kind === "temperance") {
    body = (
      <>
        <path d="M16 12 h12 l-2 10 v8 a4 4 0 0 1 -8 0 v-8 Z" {...st} />
        <path d="M34 30 h12 l-2 10 v8 a4 4 0 0 1 -8 0 v-8 Z" {...st} />
        <path d="M28 20 C36 20 34 28 40 30" stroke={hue} strokeWidth="1" fill="none" strokeDasharray="3 3" className="ldc-anim-flow" style={{ animationDuration: "20s" }} />
        <circle cx="34" cy="24" r="1.3" fill={hue} className="ldc-anim-pulse" style={{ animationDuration: "6s" }} />
        <path d="M12 54 h36" {...dim} />
      </>
    );
  } else if (kind === "star") {
    body = (
      <>
        <path d="M30 8 L34 24 L50 20 L38 30 L50 40 L34 36 L30 52 L26 36 L10 40 L22 30 L10 20 L26 24 Z" {...st} className="ldc-anim-pulse" style={{ animationDuration: "7s" }} />
        <circle cx="30" cy="30" r="3" fill={hue} opacity=".8" />
        <circle cx="12" cy="12" r="1" fill={hue} opacity=".7" />
        <circle cx="49" cy="13" r="1.2" fill={hue} opacity=".6" />
        <circle cx="50" cy="49" r=".9" fill={hue} opacity=".7" />
        <circle cx="11" cy="48" r="1.1" fill={hue} opacity=".55" />
      </>
    );
  } else {
    body = (
      <>
        <circle cx="30" cy="30" r="19" {...dim} strokeDasharray="4 4" className="ldc-anim-spin" style={{ animationDuration: "80s", transformOrigin: "30px 30px" }} />
        <circle cx="30" cy="30" r="14" {...st} />
        <path d="M30 20 L40 30 L30 40 L20 30 Z" {...st} />
        <path d="M30 4 v6 M30 50 v6 M4 30 h6 M50 30 h6" {...dim} />
        <circle cx="30" cy="30" r="2" fill={hue} className="ldc-anim-pulse" style={{ animationDuration: "5s" }} />
      </>
    );
  }
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" aria-hidden style={{ filter: `drop-shadow(0 0 7px ${hue})` }}>
      {body}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Card faces — back (sealed) and front (revealed)                     */
/* ------------------------------------------------------------------ */

function CardBack() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 300" style={{ width: "100%", height: "100%", display: "block" }} role="img" aria-label="Face-down tarot card">
        <defs>
          <pattern id="ldc-hatch" width="9" height="9" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <rect width="9" height="9" fill="rgba(20,17,38,.94)" />
            <line x1="0" y1="0" x2="0" y2="9" stroke="rgba(243,199,122,.2)" strokeWidth="1" />
          </pattern>
          <radialGradient id="ldc-backglow" cx="50%" cy="46%" r="55%">
            <stop offset="0%" stopColor="rgba(162,90,223,.28)" />
            <stop offset="100%" stopColor="rgba(10,9,18,0)" />
          </radialGradient>
        </defs>
        <rect x="1" y="1" width="198" height="298" rx="7" fill="url(#ldc-hatch)" stroke="rgba(243,199,122,.6)" strokeWidth="1.4" />
        <rect x="8" y="8" width="184" height="284" rx="4" fill="none" stroke="rgba(243,199,122,.3)" strokeWidth=".8" />
        <rect x="1" y="1" width="198" height="298" rx="7" fill="url(#ldc-backglow)" />
        {/* central seal */}
        <g className="ldc-anim-spin" style={{ animationDuration: "90s", transformOrigin: "100px 150px" }}>
          <circle cx="100" cy="150" r="52" fill="none" stroke="rgba(183,148,246,.5)" strokeWidth=".8" strokeDasharray="3 6" />
        </g>
        <circle cx="100" cy="150" r="42" fill="rgba(12,10,22,.72)" stroke="rgba(243,199,122,.5)" strokeWidth="1" />
        <path d="M100 116 L106 138 L128 132 L112 148 L128 162 L106 158 L100 184 L94 158 L72 162 L88 148 L72 132 L94 138 Z" fill="none" stroke={GOLD} strokeWidth="1.2" className="ldc-anim-pulse" style={{ animationDuration: "7s" }} />
        <circle cx="100" cy="150" r="5" fill={CREAM} opacity=".85" className="ldc-anim-flicker" style={{ animationDuration: "6s" }} />
        {/* side tick scales */}
        {Array.from({ length: 18 }, (_, i) => (
          <line key={`tl${i}`} x1="14" y1={24 + i * 14} x2={i % 3 === 0 ? 22 : 19} y2={24 + i * 14} stroke="rgba(243,199,122,.35)" strokeWidth=".7" />
        ))}
        {Array.from({ length: 18 }, (_, i) => (
          <line key={`tr${i}`} x1="186" y1={24 + i * 14} x2={i % 3 === 0 ? 178 : 181} y2={24 + i * 14} stroke="rgba(243,199,122,.35)" strokeWidth=".7" />
        ))}
        <text x="100" y="34" textAnchor="middle" fontSize="8" letterSpacing="4" fill="rgba(233,230,242,.5)">ARCANA LABORATORIUM</text>
        <text x="100" y="272" textAnchor="middle" fontSize="7" letterSpacing="3" fill="rgba(243,199,122,.45)">SPECIMEN · FACE DOWN</text>
      </svg>
    </div>
  );
}

function CardFront({ card }: { card: Arcana }) {
  const gid = `ldc-cg-${card.numeral}`;
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 300" style={{ width: "100%", height: "100%", display: "block" }} role="img" aria-label={`${card.name} tarot card`}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(35,28,60,.97)" />
            <stop offset="55%" stopColor="rgba(18,15,34,.98)" />
            <stop offset="100%" stopColor="rgba(12,10,22,1)" />
          </linearGradient>
          <radialGradient id={`${gid}-halo`} cx="50%" cy="46%" r="50%">
            <stop offset="0%" stopColor={card.hue} stopOpacity=".28" />
            <stop offset="100%" stopColor={card.hue} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="1" y="1" width="198" height="298" rx="7" fill={`url(#${gid})`} stroke={card.hue} strokeOpacity=".7" strokeWidth="1.4" />
        <rect x="8" y="8" width="184" height="284" rx="4" fill="none" stroke={card.hue} strokeOpacity=".35" strokeWidth=".8" />
        <circle cx="100" cy="146" r="62" fill={`url(#${gid}-halo)`} />
        {/* numeral plate */}
        <text x="100" y="48" textAnchor="middle" fontSize="26" fill={card.hue} style={{ fontFamily: "Georgia, serif" }}>
          {card.numeral}
        </text>
        <line x1="52" y1="60" x2="148" y2="60" stroke={card.hue} strokeOpacity=".4" strokeWidth=".7" />
        <line x1="64" y1="64" x2="136" y2="64" stroke={card.hue} strokeOpacity=".2" strokeWidth=".5" />
        {/* emblem */}
        <g transform="translate(53 99) scale(1.566)">
          <CardEmblem kind={card.emblem} hue={card.hue} />
        </g>
        {/* orbit ring around emblem */}
        <g className="ldc-anim-spinr" style={{ animationDuration: "70s", transformOrigin: "100px 146px" }}>
          <circle cx="100" cy="146" r="52" fill="none" stroke={card.hue} strokeOpacity=".35" strokeWidth=".7" strokeDasharray="2 7" />
        </g>
        <circle cx="100" cy="146" r="58" fill="none" stroke="rgba(183,148,246,.2)" strokeWidth=".6" />
        {/* name plate */}
        <line x1="52" y1="228" x2="148" y2="228" stroke={card.hue} strokeOpacity=".4" strokeWidth=".7" />
        <text x="100" y="252" textAnchor="middle" fontSize="12" letterSpacing="2.5" fill={TEXT_HI} style={{ fontFamily: "Georgia, serif" }}>
          {card.name}
        </text>
        <text x="100" y="274" textAnchor="middle" fontSize="6.5" letterSpacing="3" fill="rgba(243,199,122,.45)">
          MAJOR ARCANA · LAB SEAL {card.numeral}
        </text>
        {/* corner ornaments */}
        {[
          "M14 22 v-8 h8",
          "M186 22 v-8 h-8",
          "M14 278 v8 h8",
          "M186 278 v8 h-8",
        ].map((d, i) => (
          <path key={i} d={d} fill="none" stroke={card.hue} strokeOpacity=".55" strokeWidth="1" />
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Backdrop — production magic sky                                     */
/* ------------------------------------------------------------------ */

function WheelSvg() {
  const C = 500;
  const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  return (
    <svg viewBox="0 0 1000 1000" className="h-full w-full">
      <circle cx={C} cy={C} r={486} fill="none" stroke={GOLD} strokeWidth={1} />
      <circle cx={C} cy={C} r={430} fill="none" stroke={GOLD} strokeWidth={0.6} />
      <circle cx={C} cy={C} r={330} fill="none" stroke={VIOLET_SOFT} strokeWidth={0.6} />
      <circle cx={C} cy={C} r={150} fill="none" stroke={GOLD} strokeWidth={0.5} />
      {Array.from({ length: 120 }, (_, k) => {
        const a = k * 3;
        const p1 = polar(C, C, 430, a);
        const p2 = polar(C, C, 486, a);
        return <line key={k} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={GOLD} strokeWidth={k % 10 === 0 ? 1.4 : 0.5} />;
      })}
      {ROMAN.map((n, i) => {
        const p = polar(C, C, 458, i * 30 + 15);
        const a = polar(C, C, 330, i * 30);
        const b = polar(C, C, 486, i * 30);
        return (
          <g key={n}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={GOLD} strokeWidth={0.5} />
            <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize={22} letterSpacing={2} fill={CREAM} style={{ fontFamily: "Georgia, serif" }}>
              {n}
            </text>
          </g>
        );
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const p = polar(C, C, 330, i * 30 + 15);
        return <line key={i} x1={C} y1={C} x2={p.x} y2={p.y} stroke={VIOLET_SOFT} strokeWidth={0.35} />;
      })}
      {[0, 90, 45, 135, 60, 150].map((a, i) => {
        const p1 = polar(C, C, 150, a);
        const p2 = polar(C, C, 150, a + 120);
        return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={GOLD} strokeWidth={0.45} />;
      })}
    </svg>
  );
}

// two huge wheels hang half off-screen and counter-rotate behind everything
function BackdropWheels() {
  return (
    <>
      <div aria-hidden className="ldc-wheel-spin pointer-events-none fixed -top-[42vmin] -right-[48vmin] z-0 h-[155vmin] w-[155vmin] opacity-[0.07]">
        <WheelSvg />
      </div>
      <div aria-hidden className="ldc-wheel-spin-rev pointer-events-none fixed -bottom-[46vmin] -left-[44vmin] z-0 h-[135vmin] w-[135vmin] opacity-[0.055]">
        <WheelSvg />
      </div>
    </>
  );
}

function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* nebula washes */}
      <div className="ldc-nebula absolute -left-[20vw] top-[8vh] h-[70vmin] w-[70vmin] bg-[radial-gradient(circle,rgba(162,90,223,0.11),transparent_65%)]" />
      <div className="ldc-nebula absolute right-[-12vw] top-[52vh] h-[80vmin] w-[80vmin] bg-[radial-gradient(circle,rgba(243,199,122,0.08),transparent_65%)]" />
      <div className="ldc-nebula absolute left-[24vw] bottom-[-18vh] h-[60vmin] w-[60vmin] bg-[radial-gradient(circle,rgba(183,148,246,0.07),transparent_65%)]" />

      <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        {/* star specks */}
        {STARS.map((s) =>
          s.tw ? (
            <circle key={s.key} cx={s.x} cy={s.y} r={s.r} fill={CREAM} className="ldc-twinkle" style={{ animationDelay: `${s.d}s`, opacity: s.o }} />
          ) : (
            <circle key={s.key} cx={s.x} cy={s.y} r={s.r} fill={TEXT_LO} opacity={s.o} />
          ),
        )}

        {/* hairline orbit circles, centers pushed off-canvas */}
        <circle cx={1730} cy={240} r={520} fill="none" stroke={GOLD_DEEP} strokeWidth={0.5} opacity={0.4} />
        <circle cx={1730} cy={240} r={700} fill="none" stroke={GOLD_DEEP} strokeWidth={0.4} opacity={0.26} strokeDasharray="2 7" />
        <circle cx={-160} cy={880} r={420} fill="none" stroke={VIOLET} strokeWidth={0.5} opacity={0.34} />
        <circle cx={-160} cy={880} r={560} fill="none" stroke={VIOLET} strokeWidth={0.4} opacity={0.2} strokeDasharray="2 8" />
        <circle cx={820} cy={1180} r={640} fill="none" stroke={GOLD_DEEP} strokeWidth={0.4} opacity={0.2} />

        {/* construction lines crossing the whole page */}
        <line x1={-80} y1={180} x2={1700} y2={760} stroke={TEXT_LO} strokeWidth={0.4} opacity={0.18} />
        <line x1={-80} y1={940} x2={1680} y2={120} stroke={TEXT_LO} strokeWidth={0.4} opacity={0.13} />
        <line x1={1240} y1={-60} x2={1240} y2={1060} stroke={GOLD_DEEP} strokeWidth={0.4} opacity={0.18} strokeDasharray="1 6" />
        <line x1={-60} y1={620} x2={1660} y2={620} stroke={GOLD_DEEP} strokeWidth={0.4} opacity={0.13} strokeDasharray="1 6" />
        {[160, 380, 620, 860].map((y) => (
          <line key={y} x1={1232} y1={y} x2={1248} y2={y} stroke={GOLD} strokeWidth={0.7} opacity={0.4} />
        ))}

        {/* constellation: Lyra-ish */}
        <g opacity={0.55}>
          <polyline points="180,160 258,208 344,182 402,252 318,286 236,258" fill="none" stroke={VIOLET_SOFT} strokeWidth={0.6} opacity={0.5} />
          {[
            [180, 160],
            [258, 208],
            [344, 182],
            [402, 252],
            [318, 286],
            [236, 258],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={1.7} fill={TEXT_HI} opacity={0.8} />
          ))}
        </g>
        {/* constellation: Cygnus-ish, lower right */}
        <g opacity={0.5}>
          <polyline points="1150,760 1228,700 1306,748 1352,684 1430,712" fill="none" stroke={GOLD} strokeWidth={0.6} opacity={0.45} />
          <line x1="1228" y1="700" x2="1268" y2="806" stroke={GOLD} strokeWidth={0.6} opacity={0.45} />
          {[
            [1150, 760],
            [1228, 700],
            [1306, 748],
            [1352, 684],
            [1430, 712],
            [1268, 806],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={1.7} fill={CREAM} opacity={0.75} />
          ))}
        </g>
      </svg>

      {/* giant dim glyphs drifting behind sections */}
      <span className="ldc-glyph ldc-float-a absolute left-[3vw] top-[70vh] text-[24vmin] leading-none text-[#b794f6] opacity-[0.055]">
        ☽{FE}
      </span>
      <span className="ldc-glyph ldc-float-b absolute right-[6vw] top-[150vh] text-[28vmin] leading-none text-[#f3c77a] opacity-[0.05]">
        ♄{FE}
      </span>
      <span className="ldc-glyph ldc-float-a absolute left-[38vw] top-[240vh] text-[22vmin] leading-none text-[#e9e6f2] opacity-[0.04]">
        ☉{FE}
      </span>

      {/* occasional shooting stars */}
      <span className="ldc-shoot" style={{ top: "14vh", right: "-12vw" }} />
      <span className="ldc-shoot ldc-shoot-b" style={{ top: "46vh", right: "-18vw" }} />
    </div>
  );
}

// a large wheel fragment bleeding off the left edge, directly behind the chamber
function ChamberWheel() {
  const C = 400;
  const ROMAN = ["0", "I", "II", "V", "VII", "X", "XIV", "XVII", "XXI", "IX", "XIII", "XX"];
  return (
    <svg viewBox="0 0 800 800" className="pointer-events-none absolute hidden lg:block" style={{ left: "-34%", top: "-16%", width: "88%", opacity: 0.09 }} aria-hidden>
      <g className="ldc-anim-spin" style={{ animationDuration: "220s", transformOrigin: "400px 400px" }}>
        <circle cx={C} cy={C} r={384} fill="none" stroke={GOLD} strokeWidth={1} />
        <circle cx={C} cy={C} r={330} fill="none" stroke={VIOLET_SOFT} strokeWidth={0.7} strokeDasharray="3 7" />
        {Array.from({ length: 96 }, (_, i) => {
          const long = i % 8 === 0;
          const p1 = polar(C, C, 384, i * 3.75);
          const p2 = polar(C, C, long ? 366 : 374, i * 3.75);
          return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={long ? CREAM : GOLD} strokeWidth={long ? 1.4 : 0.7} />;
        })}
        {ROMAN.map((n, i) => {
          const p = polar(C, C, 300, i * 30 - 90);
          return (
            <text key={`${n}-${i}`} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize={20} letterSpacing={2} fill={CREAM} style={{ fontFamily: "Georgia, serif" }}>
              {n}
            </text>
          );
        })}
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* The draw chamber — interactive centerpiece                          */
/* ------------------------------------------------------------------ */

function DrawChamber() {
  const [cardIdx, setCardIdx] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [busy, setBusy] = useState(false);
  const [draws, setDraws] = useState(0);

  const card = cardIdx === null ? null : DECK[cardIdx];
  const idx = cardIdx ?? 0;

  const draw = () => {
    if (busy) return;
    setBusy(true);
    const wait = flipped ? 620 : 260; // let a revealed card flip back before resealing a new one
    if (flipped) setFlipped(false);
    window.setTimeout(() => {
      setCardIdx((prev) => {
        let n = Math.floor(Math.random() * DECK.length);
        while (DECK.length > 1 && n === prev) n = Math.floor(Math.random() * DECK.length);
        return n;
      });
      setDraws((d) => d + 1);
      setFlipped(true);
      window.setTimeout(() => setBusy(false), 500);
    }, wait);
  };

  return (
    <div className="ldc-panel" style={{ transform: "rotate(-.5deg)", margin: "0 -10px", boxShadow: "0 24px 60px rgba(0,0,0,.5), 0 0 40px rgba(162,90,223,.08)" }}>
      <PanelHead title="Daily Draw Chamber" right="SPECIMEN BAY 01 · COLD" />
      <div className="grid grid-cols-1 gap-8 p-5 pt-7 sm:p-7 lg:grid-cols-[1fr_.94fr] lg:gap-3">
        {/* stage — holder ring + flip card */}
        <div className="ldc-stage-shift relative flex flex-col items-center">
          <div className="relative" style={{ width: "min(272px, 72vw)" }}>
            {/* holder ring behind the card */}
            <svg viewBox="0 0 400 400" className="pointer-events-none absolute" style={{ inset: "-19% -12%", width: "124%", height: "138%", opacity: .85 }} aria-hidden>
              <g className="ldc-anim-spin" style={{ animationDuration: "120s", transformOrigin: "200px 200px" }}>
                <circle cx="200" cy="200" r="188" fill="none" stroke="rgba(243,199,122,.3)" strokeWidth=".8" />
                {Array.from({ length: 60 }, (_, i) => {
                  const p1 = polar(200, 200, 188, i * 6);
                  const p2 = polar(200, 200, i % 5 === 0 ? 178 : 183, i * 6);
                  return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={i % 5 === 0 ? "rgba(255,221,156,.55)" : "rgba(243,199,122,.32)"} strokeWidth={i % 5 === 0 ? 1 : .6} />;
                })}
              </g>
              <g className="ldc-anim-spinr" style={{ animationDuration: "85s", transformOrigin: "200px 200px" }}>
                <circle cx="200" cy="200" r="164" fill="none" stroke="rgba(183,148,246,.4)" strokeWidth=".7" strokeDasharray="8 8" />
              </g>
              <ellipse cx="200" cy="200" rx="196" ry="70" transform="rotate(-16 200 200)" fill="none" stroke="rgba(243,199,122,.22)" strokeWidth=".7" strokeDasharray="3 8" className="ldc-anim-flow" style={{ animationDuration: "40s" }} />
            </svg>

            {/* the flip stage */}
            <div className={`ldc-stage${busy ? " ldc-charging" : ""}`} style={{ width: "100%", aspectRatio: "2 / 3" }}>
              <div className={`ldc-flip${flipped ? " ldc-on" : ""}`}>
                <div className="ldc-face ldc-face-back">
                  <CardBack />
                </div>
                <div className="ldc-face ldc-face-front">
                  <div key={cardIdx ?? "none"} style={{ width: "100%", height: "100%" }}>
                    {card ? <CardFront card={card} /> : <CardBack />}
                  </div>
                </div>
              </div>
            </div>

            <CornerTicks />
          </div>

          {/* controls */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <button type="button" className="ldc-btn" onClick={draw} disabled={busy}>
              <span className="ldc-hdot" style={{ background: CREAM, boxShadow: `0 0 6px ${CREAM}` }} />
              {busy ? "CALIBRATING…" : card ? "RESEAL · DRAW AGAIN" : "DRAW YOUR CARD"}
            </button>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            <span className="ldc-caps-sm ldc-mono" style={{ color: "rgba(183,148,246,.6)" }}>
              DECK 8/8 MAJOR
            </span>
            <span className="ldc-caps-sm ldc-mono" style={{ color: "rgba(183,148,246,.6)" }}>
              DRAW NO. <span style={{ color: GOLD, textShadow: `0 0 8px rgba(243,199,122,.7)` }}>{String(draws).padStart(3, "0")}</span>
            </span>
            <span className="ldc-caps-sm ldc-mono ldc-anim-flicker" style={{ color: "rgba(243,199,122,.55)", animationDuration: "9s" }}>
              {busy ? "FLUX RISING" : flipped ? "SEAL BROKEN" : "SEAL INTACT"}
            </span>
          </div>
          <div className="ldc-ticks mt-3" style={{ width: "72%", opacity: .5 }} />
        </div>

        {/* readout — overlaps the chamber's right edge on wide screens */}
        <div className="relative flex items-center">
          <div className="ldc-readout ldc-panel relative w-full" style={{ zIndex: 3, boxShadow: "0 18px 44px rgba(0,0,0,.55), 0 0 30px rgba(243,199,122,.1)" }}>
            <CornerTicks />
            {card ? (
              <div key={`${cardIdx}-${draws}`} className="ldc-readout-swap p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="ldc-hdot ldc-anim-pulse" style={{ background: card.hue, boxShadow: `0 0 6px ${card.hue}`, animationDuration: "5s" }} />
                  <span className="ldc-caps-sm ldc-mono" style={{ color: "rgba(183,148,246,.6)" }}>
                    SPECIMEN NO. {String(draws).padStart(3, "0")} · MAJOR ARCANA
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-4">
                  <span style={{ fontSize: 40, lineHeight: 1, color: card.hue, textShadow: `0 0 18px ${card.hue}`, fontFamily: "Georgia, serif" }}>
                    {card.numeral}
                  </span>
                  <h2 className="ldc-caps ldc-serif" style={{ fontSize: "clamp(17px, 2.2vw, 23px)", color: TEXT_HI, margin: 0 }}>
                    {card.name}
                  </h2>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {card.keywords.map((k) => (
                    <span
                      key={k}
                      className="ldc-caps-sm ldc-mono"
                      style={{
                        color: card.hue,
                        border: `1px solid ${card.hue}55`,
                        padding: "3px 9px",
                        textShadow: `0 0 8px ${card.hue}`,
                        background: "rgba(10,9,18,.6)",
                      }}
                    >
                      {k}
                    </span>
                  ))}
                </div>
                <div className="ldc-rule mt-4" style={{ opacity: .7 }} />
                <p className="mt-3" style={{ fontSize: 14.5, lineHeight: 1.8, color: TEXT_LO, margin: 0 }}>{card.guidance}</p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { k: "ELEMENT", v: ["FIRE", "AETHER", "WATER", "EARTH"][idx % 4] },
                    { k: "POLARITY", v: idx % 2 === 0 ? "ACTIVE" : "RECEPTIVE" },
                    { k: "WINDOW", v: "24 HOURS" },
                  ].map((r) => (
                    <div key={r.k} style={{ border: "1px solid rgba(243,199,122,.16)", background: "rgba(10,9,18,.5)", padding: "6px 9px" }}>
                      <div className="ldc-caps-sm" style={{ color: "rgba(183,148,246,.5)", fontSize: 7 }}>{r.k}</div>
                      <div className="ldc-mono mt-1" style={{ fontSize: 10, color: TEXT_HI }}>{r.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="ldc-hdot" style={{ background: "rgba(183,148,246,.6)", boxShadow: "0 0 6px rgba(183,148,246,.6)" }} />
                  <span className="ldc-caps-sm ldc-mono" style={{ color: "rgba(183,148,246,.6)" }}>READOUT · AWAITING SPECIMEN</span>
                </div>
                <h2 className="mt-3" style={{ fontSize: "clamp(19px, 2.4vw, 25px)", lineHeight: 1.3, color: TEXT_HI, fontWeight: 400, margin: 0 }}>
                  The card is sealed face down.
                  <br />
                  <em style={{ color: GOLD, textShadow: "0 0 16px rgba(243,199,122,.6)" }}>Break the seal.</em>
                </h2>
                <div className="ldc-rule mt-4" style={{ opacity: .7 }} />
                <p className="mt-3" style={{ fontSize: 14, lineHeight: 1.8, color: TEXT_LO, margin: 0 }}>
                  One card per day, drawn cold from a chamber of eight major arcana. Press the draw — the apparatus
                  calibrates, reseals the deck, and turns your specimen face up.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div style={{ flex: 1, background: "rgba(243,199,122,.12)", height: 5, position: "relative", overflow: "hidden" }}>
                    <i className="ldc-anim-pulse" style={{ display: "block", height: "100%", width: "12%", background: `linear-gradient(90deg,${GOLD_DEEP},${GOLD})`, boxShadow: "0 0 10px rgba(243,199,122,.75)", animationDuration: "8s" }} />
                  </div>
                  <span className="ldc-mono" style={{ fontSize: 11, color: GOLD, textShadow: "0 0 9px rgba(243,199,122,.8)" }}>IDLE</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function DailyCardPage() {
  return (
    <main className="ldc-root min-h-screen">
      <style>{CSS}</style>

      {/* production magic sky: wheels, stars, orbits, glyphs */}
      <BackdropWheels />
      <Backdrop />

      <div className="relative" style={{ zIndex: 1 }}>
        {/* ============================================================ */}
        {/* 1 · COMPACT HEADER + TAROT CROSS-NAV — full bleed, slim       */}
        {/* ============================================================ */}
        <header className="ldc-panel" style={{ borderLeft: "none", borderRight: "none", borderTop: "none" }}>
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 pt-3 sm:px-6">
            <span className="ldc-hdot" />
            <Link href="/tarot" className="ldc-caps ldc-mono" style={{ fontSize: 11, color: CREAM, textShadow: "0 0 10px rgba(243,199,122,.55)", textDecoration: "none" }}>
              ASTRO SCOPE
            </Link>
            <span className="ldc-caps-sm ldc-mono hidden md:inline" style={{ color: "rgba(183,148,246,.6)" }}>TAROT · SPREAD 01</span>
            <span className="ldc-rule" style={{ flex: 1 }} />
            <span className="ldc-caps-sm ldc-mono ldc-anim-flicker hidden sm:inline" style={{ color: "rgba(243,199,122,.55)", animationDuration: "9s" }}>
              ☿{FE} DIRECT · SEALS NOMINAL
            </span>
          </div>
          <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-1.5 px-4 pb-3 pt-2.5 sm:px-6" aria-label="Tarot pages">
            {NAV.map((n, i) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={n.active ? "page" : undefined}
                className={`ldc-tab ldc-mono${n.active ? " ldc-tab-active" : ""}`}
                style={{ transform: TAB_DIRT[i] }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ldc-ticks" />
        </header>

        {/* ============================================================ */}
        {/* 2 · THE DRAW CHAMBER — the tool IS the page, top of viewport  */}
        {/* ============================================================ */}
        <section id="ldc-draw" className="relative mx-auto max-w-6xl scroll-mt-6 px-4 pb-16 pt-7 sm:px-6 lg:pt-9">
          <ChamberWheel />
          {/* vertical tick ruler straddling the section's left edge */}
          <div className="ldc-ticks-v pointer-events-none absolute hidden lg:block" style={{ left: -16, top: 90, height: "64%", opacity: .45 }} aria-hidden />

          <div className="relative mb-5 flex flex-wrap items-end gap-x-5 gap-y-2" style={{ transform: "rotate(-.3deg)" }}>
            <div>
              <div className="flex items-center gap-3">
                <span className="ldc-hdot" />
                <span className="ldc-caps ldc-mono" style={{ fontSize: 10, color: GOLD, textShadow: "0 0 10px rgba(243,199,122,.6)" }}>
                  DAILY CARD · SINGLE-CARD SPREAD
                </span>
              </div>
              <h1 className="ldc-serif mt-2" style={{ fontSize: "clamp(26px, 3.6vw, 40px)", lineHeight: 1.1, color: TEXT_HI, fontWeight: 400, margin: 0 }}>
                One card, one day —{" "}
                <em style={{ color: GOLD, textShadow: "0 0 20px rgba(243,199,122,.6)" }}>drawn cold.</em>
              </h1>
            </div>
            <span className="ldc-rule hidden sm:block" style={{ flex: 1, minWidth: 40, marginBottom: 10 }} />
            <span className="ldc-caps-sm ldc-mono" style={{ color: "rgba(183,148,246,.6)", marginBottom: 6 }}>
              1 SPECIMEN / DAY · UNLOGGED HERE
            </span>
          </div>

          <DrawChamber />
        </section>

        {/* ============================================================ */}
        {/* 3 · HOW TO READ — condensed protocol, staggered plates        */}
        {/* ============================================================ */}
        <section className="relative mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="mb-6 flex items-center gap-4">
            <span className="ldc-engrave">Reading Protocol</span>
            <span className="ldc-rule" style={{ flex: 1 }} />
            <span className="ldc-caps-sm ldc-mono" style={{ color: "rgba(183,148,246,.6)" }}>4 OPERATIONS · 24 H CYCLE</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3.5">
            {STEPS.map((s, i) => (
              <article key={s.id} className="ldc-panel p-4" style={STEP_DIRT[i]}>
                <CornerTicks c="rgba(243,199,122,.3)" />
                <div className="flex items-center justify-between gap-3">
                  <span
                    style={{
                      fontSize: 30,
                      lineHeight: 1,
                      color: "transparent",
                      WebkitTextStroke: "1px rgba(243,199,122,.55)",
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    {s.id}
                  </span>
                  <span className="ldc-caps-sm ldc-mono" style={{ color: "rgba(183,148,246,.55)", fontSize: 7 }}>
                    STEP {s.id}
                  </span>
                </div>
                <h3 className="ldc-caps" style={{ fontSize: 12, color: TEXT_HI, margin: 0, marginTop: 12 }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 12.5, lineHeight: 1.7, color: TEXT_LO, margin: 0, marginTop: 8 }}>{s.copy}</p>
              </article>
            ))}
          </div>
          <div className="ldc-rule mt-7 hidden lg:block" style={{ width: "64%", marginLeft: "18%", transform: "rotate(-.4deg)", opacity: .6 }} />
        </section>

        {/* ============================================================ */}
        {/* 4 · FAQ — CHAMBER NOTES, staggered off-center                 */}
        {/* ============================================================ */}
        <section className="mx-auto max-w-4xl px-4 pb-14 sm:px-6 lg:ml-[9%]">
          <div className="mb-5 flex items-center gap-4">
            <span className="ldc-hdot" />
            <h2 className="ldc-caps" style={{ fontSize: 13, color: TEXT_HI, margin: 0 }}>Chamber Notes</h2>
            <span className="ldc-rule" style={{ flex: 1 }} />
            <span className="ldc-caps-sm ldc-mono" style={{ color: "rgba(183,148,246,.6)" }}>3 ENTRIES</span>
          </div>
          <div className="flex flex-col gap-3">
            {FAQ.map((f, i) => (
              <details key={f.id} className="ldc-faq" style={FAQ_DIRT[i]}>
                <summary>
                  <span className="ldc-caps-sm ldc-mono" style={{ color: "rgba(243,199,122,.55)", whiteSpace: "nowrap" }}>{f.id}</span>
                  <span style={{ fontSize: 15, color: TEXT_HI, flex: 1 }}>{f.q}</span>
                  <span className="ldc-faq-x ldc-mono" style={{ color: GOLD, fontSize: 14, textShadow: "0 0 8px rgba(243,199,122,.7)" }}>+</span>
                </summary>
                <div style={{ borderTop: "1px solid rgba(243,199,122,.14)", padding: "12px 16px 14px 16px" }}>
                  <p style={{ fontSize: 13.5, lineHeight: 1.75, color: TEXT_LO, margin: 0 }}>{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5 · CTA — slim full-bleed band back to the tool               */}
        {/* ============================================================ */}
        <section className="ldc-panel" style={{ borderLeft: "none", borderRight: "none" }}>
          <div className="relative mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-5 px-4 py-10 text-center sm:px-6">
            <CornerTicks />
            <h2 className="ldc-serif" style={{ fontSize: "clamp(20px, 2.8vw, 30px)", lineHeight: 1.25, color: TEXT_HI, fontWeight: 400, margin: 0, transform: "rotate(-.4deg)" }}>
              The deck is warmed.{" "}
              <em style={{ color: GOLD, textShadow: "0 0 18px rgba(243,199,122,.65)" }}>The seal is yours to break.</em>
            </h2>
            <a href="#ldc-draw" className="ldc-btn" style={{ textDecoration: "none", fontSize: 10 }}>
              <span className="ldc-hdot" style={{ background: CREAM, boxShadow: `0 0 6px ${CREAM}` }} />
              DRAW YOUR DAILY CARD
            </a>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 6 · FOOTER — lab status strip juts wider than the column      */}
        {/* ============================================================ */}
        <footer className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="ldc-panel" style={{ margin: "0 -20px", transform: "rotate(.3deg)" }}>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5">
              {[
                { k: "CHAMBER", v: "SEALED", h: GOLD },
                { k: "DECK", v: "8/8 MAJOR", h: CREAM },
                { k: "MERCURY", v: `☿${FE} DIRECT`, h: VIOLET_SOFT },
                { k: "DRAW WINDOW", v: "24 H", h: GOLD_HOT },
                { k: "LOG", v: "AWAITING LINE", h: GOLD },
              ].map((s) => (
                <span key={s.k} className="flex items-center gap-2">
                  <span className="ldc-hdot ldc-anim-pulse" style={{ width: 4, height: 4, background: s.h, boxShadow: `0 0 5px ${s.h}`, animationDuration: "6s" }} />
                  <span className="ldc-caps-sm ldc-mono" style={{ color: "rgba(183,148,246,.55)", fontSize: 8 }}>{s.k}</span>
                  <span className="ldc-mono ldc-glyph" style={{ fontSize: 10, color: s.h, textShadow: `0 0 7px ${s.h}` }}>{s.v}</span>
                </span>
              ))}
              <span className="ldc-rule" style={{ flex: 1, minWidth: 30 }} />
              <span className="ldc-caps-sm ldc-mono ldc-anim-flicker" style={{ color: "rgba(243,199,122,.5)", animationDuration: "9s", fontSize: 8 }}>
                BAY STATUS · ALL SEALS NOMINAL
              </span>
            </div>
          </div>
          <div className="ldc-ticks mt-1" style={{ opacity: .4 }} />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="ldc-caps-sm ldc-mono" style={{ color: "rgba(183,148,246,.4)", fontSize: 8 }}>© ASTRO SCOPE · TAROT LABORATORIUM</span>
            <span className="ldc-caps-sm ldc-mono" style={{ color: "rgba(183,148,246,.4)", fontSize: 8 }}>DAILY CARD · SPREAD 01</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
