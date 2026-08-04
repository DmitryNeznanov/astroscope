"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                    */
/* ------------------------------------------------------------------ */

const rad = (deg: number) => (deg * Math.PI) / 180;
const polar = (cx: number, cy: number, r: number, deg: number) => ({
  x: Math.round((cx + r * Math.cos(rad(deg))) * 100) / 100,
  y: Math.round((cy + r * Math.sin(rad(deg))) * 100) / 100,
});

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
    hue: "#ffb15c",
    keywords: ["BEGINNINGS", "LEAP", "TRUST"],
    guidance: "Step before the plan is finished; the ground assembles under an honest foot.",
    emblem: "fool",
  },
  {
    numeral: "I",
    name: "THE MAGICIAN",
    hue: "#ff5c85",
    keywords: ["WILL", "CRAFT", "FOCUS"],
    guidance: "Every tool you need is already on the bench; today, use exactly one of them well.",
    emblem: "magician",
  },
  {
    numeral: "II",
    name: "THE HIGH PRIESTESS",
    hue: "#c47dff",
    keywords: ["INTUITION", "SILENCE", "DEPTHS"],
    guidance: "The answer is behind the curtain, not in the noise; sit still until it surfaces.",
    emblem: "priestess",
  },
  {
    numeral: "VII",
    name: "THE CHARIOT",
    hue: "#ff8a3c",
    keywords: ["DRIVE", "DIRECTION", "CONTROL"],
    guidance: "Pick one heading and hold it; the horses pull hardest when the reins agree.",
    emblem: "chariot",
  },
  {
    numeral: "X",
    name: "WHEEL OF FORTUNE",
    hue: "#ffb15c",
    keywords: ["CYCLES", "TURNING", "CHANCE"],
    guidance: "The wheel is mid-rotation; do not cling to the spoke that carried you up.",
    emblem: "wheel",
  },
  {
    numeral: "XIV",
    name: "TEMPERANCE",
    hue: "#c47dff",
    keywords: ["MEASURE", "BLEND", "PATIENCE"],
    guidance: "Pour slowly between the vessels; today’s work is dilution, not force.",
    emblem: "temperance",
  },
  {
    numeral: "XVII",
    name: "THE STAR",
    hue: "#ff5c85",
    keywords: ["HOPE", "SIGNAL", "RENEWAL"],
    guidance: "One clear signal outlasts a sky of noise; follow the brightest, smallest point.",
    emblem: "star",
  },
  {
    numeral: "XXI",
    name: "THE WORLD",
    hue: "#ff8a3c",
    keywords: ["COMPLETION", "CIRCUIT", "ARRIVAL"],
    guidance: "Close the loop you opened weeks ago; the last seam is also the threshold.",
    emblem: "world",
  },
];

const STEPS: { id: string; title: string; copy: string; readout: string }[] = [
  {
    id: "STEP 01",
    title: "Draw at first light",
    copy: "Pull the card before the day's inputs reach you — before mail, news, other people's weather. The chamber reads an unshaped day best.",
    readout: "T-00:00 · PRE-INPUT",
  },
  {
    id: "STEP 02",
    title: "Name the theme",
    copy: "Reduce the card to one word. Carry the word, not the image — a word survives contact with the day; a picture only decorates it.",
    readout: "1 WORD · CARRIED",
  },
  {
    id: "STEP 03",
    title: "Test at midday",
    copy: "Hold the theme against what actually happened by noon. Note where it fit and, more useful, where it resisted.",
    readout: "CHECK · 12:00",
  },
  {
    id: "STEP 04",
    title: "Seal at night",
    copy: "Log a single line before sleep. The log, not the draw, is the instrument — thirty lines make a pattern no single card can.",
    readout: "LOG · 1 LINE",
  },
];

const FAQ: { id: string; q: string; a: string }[] = [
  {
    id: "NOTE 01",
    q: "Is the daily card a prediction?",
    a: "No. Treat it as a lens, not a verdict. The card fixes a theme; you run the experiment. A day examined through one deliberate idea teaches more than a day passively forecast.",
  },
  {
    id: "NOTE 02",
    q: "Can I draw more than once?",
    a: "One draw per day holds the signal — a second pull usually just shops for a better answer. Re-draws in this chamber are unlogged, so practice freely here and keep the discipline in your own log.",
  },
  {
    id: "NOTE 03",
    q: "Why only eight cards in this chamber?",
    a: "This bay holds a calibrated octant of the major arcana — eight archetypes tuned for daily work. The full seventy-eight-card deck lives in the larger spreads, where more apparatus is warranted.",
  },
];

/* ------------------------------------------------------------------ */
/* Layout dirt — deterministic offsets, tilts, overlaps                */
/* ------------------------------------------------------------------ */

const STEP_DIRT: CSSProperties[] = [
  { transform: "rotate(-.8deg)", marginTop: 0 },
  { transform: "rotate(.6deg) translateY(26px)" },
  { transform: "rotate(-.5deg) translateY(-10px)" },
  { transform: "rotate(.9deg) translateY(18px)" },
];

const FAQ_DIRT: CSSProperties[] = [
  { marginRight: 52, transform: "rotate(-.4deg)" },
  { marginLeft: 48, transform: "rotate(.5deg)" },
  { marginLeft: 20, marginRight: 30, transform: "rotate(-.3deg)" },
];

/* ------------------------------------------------------------------ */
/* Background layers — embers, numerals, faint zodiac ring             */
/* ------------------------------------------------------------------ */

const ZODIAC_RING = ["♈︎", "♉︎", "♊︎", "♋︎", "♌︎", "♍︎", "♎︎", "♏︎", "♐︎", "♑︎", "♒︎", "♓︎"];

const BG_NUMERALS: { ch: string; top: string; left?: string; right?: string; size: number; rot: number; c: string }[] = [
  { ch: "XVII", top: "6%", right: "3%", size: 230, rot: 7, c: "rgba(255,92,140,.05)" },
  { ch: "0", top: "26%", left: "1%", size: 300, rot: -9, c: "rgba(255,177,92,.045)" },
  { ch: "XIV", top: "46%", right: "8%", size: 240, rot: -5, c: "rgba(196,125,255,.05)" },
  { ch: "VII", top: "64%", left: "38%", size: 210, rot: 10, c: "rgba(255,92,140,.04)" },
  { ch: "XXI", top: "82%", right: "16%", size: 250, rot: -7, c: "rgba(255,177,92,.045)" },
];

const EMBERS: { l: number; s: number; c: string; dur: string; del: string }[] = [
  { l: 5, s: 3, c: "#ffb15c", dur: "36s", del: "-9s" },
  { l: 14, s: 2, c: "#ff5c85", dur: "48s", del: "-31s" },
  { l: 23, s: 4, c: "#ff8a3c", dur: "29s", del: "-18s" },
  { l: 37, s: 2, c: "#c47dff", dur: "53s", del: "-44s" },
  { l: 46, s: 3, c: "#ffb15c", dur: "39s", del: "-6s" },
  { l: 58, s: 2, c: "#ff5c85", dur: "56s", del: "-47s" },
  { l: 67, s: 3, c: "#ff8a3c", dur: "32s", del: "-21s" },
  { l: 76, s: 2, c: "#ffb15c", dur: "44s", del: "-13s" },
  { l: 84, s: 4, c: "#c47dff", dur: "27s", del: "-4s" },
  { l: 92, s: 2, c: "#ff5c85", dur: "50s", del: "-35s" },
];

/* ------------------------------------------------------------------ */
/* Grime presets — deterministic stains, drips, specks                 */
/* ------------------------------------------------------------------ */

type GrimePreset = {
  stains: { cx: number; cy: number; rx: number; ry: number; c: string }[];
  drips: { x: number; y: number; len: number; c: string }[];
  specks: { x: number; y: number; r: number; c: string }[];
};

const GRIME: GrimePreset[] = [
  {
    stains: [
      { cx: 5, cy: 90, rx: 14, ry: 9, c: "rgba(6,2,3,.42)" },
      { cx: 94, cy: 10, rx: 11, ry: 7, c: "rgba(70,16,40,.36)" },
      { cx: 92, cy: 88, rx: 9, ry: 6, c: "rgba(140,70,20,.13)" },
    ],
    drips: [
      { x: 90, y: 2, len: 15, c: "rgba(140,70,20,.25)" },
      { x: 7, y: 64, len: 11, c: "rgba(96,40,60,.28)" },
    ],
    specks: [
      { x: 16, y: 24, r: 0.5, c: "rgba(0,0,0,.5)" },
      { x: 28, y: 68, r: 0.35, c: "rgba(255,150,90,.2)" },
      { x: 44, y: 14, r: 0.45, c: "rgba(0,0,0,.42)" },
      { x: 61, y: 82, r: 0.4, c: "rgba(0,0,0,.45)" },
      { x: 74, y: 36, r: 0.3, c: "rgba(255,150,90,.16)" },
      { x: 86, y: 58, r: 0.5, c: "rgba(0,0,0,.48)" },
      { x: 35, y: 48, r: 0.35, c: "rgba(0,0,0,.38)" },
      { x: 9, y: 44, r: 0.3, c: "rgba(0,0,0,.4)" },
    ],
  },
  {
    stains: [
      { cx: 90, cy: 84, rx: 13, ry: 9, c: "rgba(6,2,3,.4)" },
      { cx: 8, cy: 12, rx: 9, ry: 6, c: "rgba(70,16,40,.36)" },
      { cx: 52, cy: 96, rx: 15, ry: 5, c: "rgba(6,2,3,.3)" },
    ],
    drips: [
      { x: 9, y: 3, len: 13, c: "rgba(96,40,60,.27)" },
      { x: 86, y: 66, len: 14, c: "rgba(140,70,20,.24)" },
    ],
    specks: [
      { x: 12, y: 56, r: 0.45, c: "rgba(0,0,0,.46)" },
      { x: 27, y: 24, r: 0.3, c: "rgba(255,150,90,.18)" },
      { x: 39, y: 72, r: 0.5, c: "rgba(0,0,0,.42)" },
      { x: 55, y: 18, r: 0.35, c: "rgba(0,0,0,.44)" },
      { x: 68, y: 50, r: 0.4, c: "rgba(255,150,90,.16)" },
      { x: 81, y: 80, r: 0.3, c: "rgba(0,0,0,.4)" },
      { x: 93, y: 38, r: 0.45, c: "rgba(0,0,0,.45)" },
      { x: 47, y: 90, r: 0.35, c: "rgba(0,0,0,.38)" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Scoped styles                                                       */
/* ------------------------------------------------------------------ */

const CSS = `
.ldc-root { background:#160509; color:#e0aebe; font-family:Georgia,'Times New Roman',serif; position:relative; overflow-x:clip; }
.ldc-mono { font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace; }
.ldc-caps { text-transform:uppercase; letter-spacing:.24em; }
.ldc-caps-sm { text-transform:uppercase; letter-spacing:.2em; font-size:9px; }
.ldc-bg { position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
.ldc-bg-page { position:absolute; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
.ldc-panel {
  background:linear-gradient(160deg, rgba(52,12,26,.85), rgba(26,6,16,.94));
  border:1px solid rgba(226,92,128,.22);
  box-shadow:inset 0 0 0 1px rgba(0,0,0,.55), inset 0 0 36px rgba(96,10,42,.28), 0 0 26px rgba(0,0,0,.5);
  position:relative;
}
.ldc-panel::before {
  content:""; position:absolute; inset:4px; pointer-events:none;
  border:1px solid rgba(226,92,128,.1);
}
.ldc-header {
  display:flex; align-items:center; gap:8px;
  border-bottom:1px solid rgba(226,92,128,.18);
  padding:7px 12px;
}
.ldc-hdot { width:5px; height:5px; transform:rotate(45deg); background:#ff3d6e; box-shadow:0 0 6px #ff3d6e; flex:none; }
.ldc-htext { font-size:10px; letter-spacing:.28em; color:#eebcc9; text-transform:uppercase; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ldc-rule { height:1px; background:linear-gradient(90deg, rgba(226,92,128,.42), rgba(226,92,128,.05)); }
.ldc-rule-r { height:1px; background:linear-gradient(270deg, rgba(226,92,128,.42), rgba(226,92,128,.05)); }
.ldc-ticks { background-image:repeating-linear-gradient(90deg, rgba(226,92,128,.38) 0 1px, transparent 1px 8px); height:5px; }
.ldc-ticks-v { background-image:repeating-linear-gradient(0deg, rgba(226,92,128,.42) 0 1px, transparent 1px 7px); width:5px; }
.ldc-engrave {
  text-transform:uppercase; letter-spacing:.4em; font-size:10px; color:#8f4559;
  text-shadow:0 1px 0 rgba(0,0,0,.8), 0 -1px 0 rgba(255,150,180,.08);
}
.ldc-btn {
  display:inline-flex; align-items:center; gap:10px; cursor:pointer;
  background:linear-gradient(180deg, rgba(255,61,110,.3), rgba(122,14,52,.5));
  border:1px solid rgba(255,92,140,.62); color:#ffd9e2;
  text-transform:uppercase; letter-spacing:.26em; font-size:10px;
  padding:11px 22px; box-shadow:0 0 20px rgba(255,61,110,.38), inset 0 0 14px rgba(255,61,110,.26);
  transition:box-shadow .3s;
}
.ldc-btn:hover { box-shadow:0 0 32px rgba(255,61,110,.65), inset 0 0 18px rgba(255,61,110,.42); }
.ldc-btn[disabled] { opacity:.55; cursor:wait; }
.ldc-btn-ghost {
  display:inline-flex; align-items:center; gap:8px;
  border:1px solid rgba(255,177,92,.4); color:#ffcf9a;
  text-transform:uppercase; letter-spacing:.24em; font-size:10px;
  padding:11px 18px; background:rgba(255,138,60,.06);
  box-shadow:inset 0 0 12px rgba(255,138,60,.1);
  transition:box-shadow .3s, border-color .3s;
}
.ldc-btn-ghost:hover { border-color:rgba(255,177,92,.75); box-shadow:0 0 18px rgba(255,138,60,.3), inset 0 0 14px rgba(255,138,60,.2); }
details.ldc-faq { border:1px solid rgba(226,92,128,.2); background:rgba(26,6,16,.82); position:relative; }
details.ldc-faq summary { cursor:pointer; list-style:none; display:flex; align-items:center; gap:12px; padding:13px 16px; }
details.ldc-faq summary::-webkit-details-marker { display:none; }
details.ldc-faq summary .ldc-faq-x { transition:transform .3s; }
details.ldc-faq[open] summary .ldc-faq-x { transform:rotate(45deg); }
details.ldc-faq[open] { border-color:rgba(255,92,140,.45); box-shadow:0 0 18px rgba(255,61,110,.18); }
.ldc-grime-noise {
  position:fixed; inset:0; z-index:40; pointer-events:none; opacity:.06;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}
.ldc-scratches {
  position:fixed; inset:0; z-index:41; pointer-events:none; opacity:.55;
  background-image:
    repeating-linear-gradient(101deg, rgba(255,214,224,.028) 0 1px, transparent 1px 340px),
    repeating-linear-gradient(77deg, rgba(0,0,0,.16) 0 1px, transparent 1px 250px),
    repeating-linear-gradient(14deg, rgba(255,190,200,.02) 0 1px, transparent 1px 540px);
}
.ldc-ember {
  position:absolute; bottom:-12px; border-radius:50%; opacity:0;
  animation:ldc-ember linear infinite;
}
.ldc-hero-bleed { position:relative; }
@media (min-width:1024px) {
  .ldc-hero-bleed { transform:translateX(15%) scale(1.14); }
  .ldc-readout { transform:translateX(11%) rotate(.5deg); }
  .ldc-stage-shift { transform:translateX(-4%) rotate(-.6deg); }
}
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
@keyframes ldc-ember { 0% { transform:translate(0,0); opacity:0; } 10% { opacity:.75; } 80% { opacity:.4; } 100% { transform:translate(34px,-108vh); opacity:0; } }
@keyframes ldc-reveal { 0% { transform:scale(.93); opacity:.35; } 100% { transform:scale(1); opacity:1; } }
@keyframes ldc-shiver { 0%,100% { transform:translate(0,0) rotate(0); } 25% { transform:translate(-1.5px,.5px) rotate(-.5deg); } 50% { transform:translate(1px,-1px) rotate(.4deg); } 75% { transform:translate(-.5px,1px) rotate(-.3deg); } }
@media (prefers-reduced-motion: reduce) {
  .ldc-root *, .ldc-root *::before, .ldc-root *::after { animation:none !important; transition:none !important; }
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
      {right ? <span className="ldc-caps-sm ldc-mono" style={{ color: "#a0586e", whiteSpace: "nowrap" }}>{right}</span> : null}
    </div>
  );
}

function CornerTicks({ c = "rgba(255,92,140,.55)" }: { c?: string }) {
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

function PanelGrime({ v }: { v: number }) {
  const p = GRIME[((v % GRIME.length) + GRIME.length) % GRIME.length];
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
      {p.stains.map((s, i) => (
        <ellipse key={`s${i}`} cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} fill={s.c} />
      ))}
      {p.drips.map((d, i) => (
        <g key={`d${i}`}>
          <path
            d={`M${d.x} ${d.y} C${d.x + 0.8} ${d.y + d.len * 0.4} ${d.x - 0.8} ${d.y + d.len * 0.7} ${d.x} ${d.y + d.len}`}
            stroke={d.c}
            strokeWidth=".5"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx={d.x} cy={d.y + d.len} r=".9" fill={d.c} />
        </g>
      ))}
      {p.specks.map((s, i) => (
        <circle key={`p${i}`} cx={s.x} cy={s.y} r={s.r} fill={s.c} />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Card emblems — hand-drawn apparatus glyphs, one per arcana          */
/* ------------------------------------------------------------------ */

function CardEmblem({ kind, hue }: { kind: Emblem; hue: string }) {
  const st = { stroke: hue, strokeWidth: 1.3, fill: "none", strokeLinecap: "round" as const };
  const dim = { stroke: "rgba(226,92,128,.4)", strokeWidth: .7, fill: "none" };
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
            <rect width="9" height="9" fill="rgba(30,8,18,.9)" />
            <line x1="0" y1="0" x2="0" y2="9" stroke="rgba(226,92,128,.22)" strokeWidth="1" />
          </pattern>
          <radialGradient id="ldc-backglow" cx="50%" cy="46%" r="55%">
            <stop offset="0%" stopColor="rgba(130,20,64,.5)" />
            <stop offset="100%" stopColor="rgba(22,5,13,0)" />
          </radialGradient>
        </defs>
        <rect x="1" y="1" width="198" height="298" rx="7" fill="url(#ldc-hatch)" stroke="rgba(255,92,140,.55)" strokeWidth="1.4" />
        <rect x="8" y="8" width="184" height="284" rx="4" fill="none" stroke="rgba(226,92,128,.35)" strokeWidth=".8" />
        <rect x="1" y="1" width="198" height="298" rx="7" fill="url(#ldc-backglow)" />
        {/* central seal */}
        <g className="ldc-anim-spin" style={{ animationDuration: "90s", transformOrigin: "100px 150px" }}>
          <circle cx="100" cy="150" r="52" fill="none" stroke="rgba(255,177,92,.5)" strokeWidth=".8" strokeDasharray="3 6" />
        </g>
        <circle cx="100" cy="150" r="42" fill="rgba(22,5,13,.7)" stroke="rgba(226,92,128,.5)" strokeWidth="1" />
        <path d="M100 116 L106 138 L128 132 L112 148 L128 162 L106 158 L100 184 L94 158 L72 162 L88 148 L72 132 L94 138 Z" fill="none" stroke="#ff5c85" strokeWidth="1.2" className="ldc-anim-pulse" style={{ animationDuration: "7s" }} />
        <circle cx="100" cy="150" r="5" fill="#ff3d6e" opacity=".85" className="ldc-anim-flicker" style={{ animationDuration: "6s" }} />
        {/* side tick scales */}
        {Array.from({ length: 18 }, (_, i) => (
          <line key={`tl${i}`} x1="14" y1={24 + i * 14} x2={i % 3 === 0 ? 22 : 19} y2={24 + i * 14} stroke="rgba(226,92,128,.4)" strokeWidth=".7" />
        ))}
        {Array.from({ length: 18 }, (_, i) => (
          <line key={`tr${i}`} x1="186" y1={24 + i * 14} x2={i % 3 === 0 ? 178 : 181} y2={24 + i * 14} stroke="rgba(226,92,128,.4)" strokeWidth=".7" />
        ))}
        <text x="100" y="34" textAnchor="middle" fontSize="8" letterSpacing="4" fill="#a0586e">ARCANA LABORATORIUM</text>
        <text x="100" y="272" textAnchor="middle" fontSize="7" letterSpacing="3" fill="#8f4559">SPECIMEN · FACE DOWN</text>
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
            <stop offset="0%" stopColor="rgba(64,12,34,.96)" />
            <stop offset="55%" stopColor="rgba(30,7,18,.98)" />
            <stop offset="100%" stopColor="rgba(20,4,12,1)" />
          </linearGradient>
          <radialGradient id={`${gid}-halo`} cx="50%" cy="46%" r="50%">
            <stop offset="0%" stopColor={card.hue} stopOpacity=".3" />
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
        <circle cx="100" cy="146" r="58" fill="none" stroke="rgba(226,92,128,.2)" strokeWidth=".6" />
        {/* name plate */}
        <line x1="52" y1="228" x2="148" y2="228" stroke={card.hue} strokeOpacity=".4" strokeWidth=".7" />
        <text x="100" y="252" textAnchor="middle" fontSize="12" letterSpacing="2.5" fill="#ffeef2" style={{ fontFamily: "Georgia, serif" }}>
          {card.name}
        </text>
        <text x="100" y="274" textAnchor="middle" fontSize="6.5" letterSpacing="3" fill="#8f4559">
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
/* Background layers                                                   */
/* ------------------------------------------------------------------ */

function BgRing() {
  const C = 400;
  const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  const ticks = Array.from({ length: 96 }, (_, i) => {
    const long = i % 8 === 0;
    const p1 = polar(C, C, 384, i * 3.75);
    const p2 = polar(C, C, long ? 366 : 374, i * 3.75);
    return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={long ? "rgba(255,177,92,.7)" : "rgba(226,92,128,.5)"} strokeWidth={long ? 1.4 : .8} />;
  });
  return (
    <svg viewBox="0 0 800 800" style={{ position: "absolute", left: -340, top: "6%", width: 790, height: 790, opacity: .13 }} aria-hidden>
      <g className="ldc-anim-spin" style={{ animationDuration: "180s", transformOrigin: "400px 400px" }}>
        <circle cx={C} cy={C} r="384" fill="none" stroke="rgba(226,92,128,.6)" strokeWidth="1" />
        {ticks}
        <circle cx={C} cy={C} r="330" fill="none" stroke="rgba(255,177,92,.5)" strokeWidth=".8" strokeDasharray="3 7" />
        {ROMAN.map((n, i) => {
          const p = polar(C, C, 302, i * 30 - 90);
          return (
            <text key={n} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="20" letterSpacing="2" fill="rgba(255,138,60,.8)" style={{ fontFamily: "Georgia, serif" }}>
              {n}
            </text>
          );
        })}
        <circle cx={C} cy={C} r="240" fill="none" stroke="rgba(226,92,128,.45)" strokeWidth=".7" />
      </g>
    </svg>
  );
}

function BgDiagram() {
  const C = 320;
  const pts8 = Array.from({ length: 8 }, (_, i) => polar(C, C, 270, i * 45 - 90));
  const sq1 = [0, 2, 4, 6].map((i) => pts8[i]);
  const sq2 = [1, 3, 5, 7].map((i) => pts8[i]);
  const poly = (pp: { x: number; y: number }[]) => pp.map((p) => `${p.x},${p.y}`).join(" ");
  return (
    <svg viewBox="0 0 640 640" style={{ position: "absolute", right: -280, top: "38%", width: 680, height: 680, opacity: .15 }} aria-hidden>
      <g className="ldc-anim-spinr" style={{ animationDuration: "150s", transformOrigin: "320px 320px" }}>
        <circle cx={C} cy={C} r="308" fill="none" stroke="rgba(226,92,128,.55)" strokeWidth="1" />
        <circle cx={C} cy={C} r="270" fill="none" stroke="rgba(255,177,92,.5)" strokeWidth=".8" strokeDasharray="2 6" />
        <polygon points={poly(sq1)} fill="none" stroke="rgba(255,92,140,.7)" strokeWidth="1.2" />
        <polygon points={poly(sq2)} fill="none" stroke="rgba(196,125,255,.65)" strokeWidth="1.2" />
        {pts8.map((p, i) => (
          <g key={i}>
            <line x1={p.x} y1={p.y} x2={C} y2={C} stroke="rgba(226,92,128,.3)" strokeWidth=".6" />
            <circle cx={p.x} cy={p.y} r="5" fill="none" stroke="rgba(255,138,60,.7)" strokeWidth="1" />
          </g>
        ))}
        {ZODIAC_RING.map((g, i) => {
          const p = polar(C, C, 292, i * 30 - 90);
          return (
            <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="18" fill="rgba(255,177,92,.65)">
              {g}
            </text>
          );
        })}
      </g>
    </svg>
  );
}

function BgConstruction() {
  const crosses: React.ReactNode[] = [];
  for (let y = 200; y < 3600; y += 280) {
    crosses.push(
      <g key={`c${y}`} stroke="rgba(255,177,92,.35)" strokeWidth=".8">
        <path d={`M68 ${y} h8 M72 ${y - 4} v8`} />
        <path d={`M1364 ${y + 130} h8 M1368 ${y + 126} v8`} />
      </g>,
    );
  }
  return (
    <svg viewBox="0 0 1440 3600" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .55 }} aria-hidden>
      {[72, 420, 1020, 1368].map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="3600" stroke="rgba(226,92,128,.13)" strokeWidth="1" />
      ))}
      {[700, 1240, 1800, 2380, 2960, 3380].map((y, i) => (
        <g key={`h${y}`}>
          <line x1="0" y1={y} x2="1440" y2={y} stroke="rgba(226,92,128,.11)" strokeWidth="1" />
          <text x={i % 2 === 0 ? 90 : 1150} y={y - 8} fontSize="9" letterSpacing="3" fill="rgba(160,88,110,.5)" className="ldc-mono">
            {`SECT. ${("0" + (i + 2)).slice(-2)} · ARCANA REF ${["XVII", "0", "XIV", "VII", "XXI", "I"][i]}`}
          </text>
        </g>
      ))}
      <line x1="0" y1="820" x2="1440" y2="1300" stroke="rgba(196,125,255,.08)" strokeWidth="1" />
      <line x1="1440" y1="2260" x2="0" y2="2780" stroke="rgba(196,125,255,.08)" strokeWidth="1" />
      <circle cx="-100" cy="1050" r="310" fill="none" stroke="rgba(226,92,128,.16)" strokeWidth="1" />
      <circle cx="-100" cy="1050" r="246" fill="none" stroke="rgba(255,177,92,.12)" strokeWidth=".8" strokeDasharray="3 6" />
      <circle cx="1540" cy="2600" r="370" fill="none" stroke="rgba(226,92,128,.15)" strokeWidth="1" />
      <circle cx="1540" cy="2600" r="298" fill="none" stroke="rgba(196,125,255,.12)" strokeWidth=".8" strokeDasharray="2 6" />
      {crosses}
    </svg>
  );
}

function Background() {
  return (
    <>
      <div className="ldc-bg" aria-hidden>
        <BgRing />
        <BgDiagram />
        {EMBERS.map((e, i) => (
          <span
            key={i}
            className="ldc-ember"
            style={{
              left: `${e.l}%`,
              width: e.s,
              height: e.s,
              background: e.c,
              boxShadow: `0 0 7px ${e.c}`,
              animationDuration: e.dur,
              animationDelay: e.del,
            }}
          />
        ))}
      </div>
      <div className="ldc-bg-page" aria-hidden>
        <BgConstruction />
        {BG_NUMERALS.map((r, i) => (
          <span
            key={i}
            aria-hidden
            style={{
              position: "absolute",
              top: r.top,
              left: r.left,
              right: r.right,
              fontSize: r.size,
              lineHeight: 1,
              color: r.c,
              textShadow: `0 0 60px ${r.c}`,
              transform: `rotate(${r.rot}deg)`,
              fontFamily: "Georgia, serif",
              userSelect: "none",
            }}
          >
            {r.ch}
          </span>
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Hero apparatus — face-down card suspended in a measurement ring     */
/* ------------------------------------------------------------------ */

function HeroApparatus() {
  const CX = 300;
  const CY = 290;
  const ticks = Array.from({ length: 120 }, (_, i) => {
    const long = i % 10 === 0;
    const p1 = polar(CX, CY, 268, i * 3);
    const p2 = polar(CX, CY, long ? 254 : 261, i * 3);
    return <line key={`t${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={long ? "rgba(255,177,92,.5)" : "rgba(226,92,128,.28)"} strokeWidth={long ? 1.1 : 0.6} />;
  });
  const romanRing = ["0", "I", "II", "V", "VII", "X", "XIV", "XVII", "XXI", "IX", "XIII", "XX"].map((n, i) => {
    const p = polar(CX, CY, 232, i * 30 - 90);
    return (
      <text key={`${n}-${i}`} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="13" letterSpacing="2" fill={i % 3 === 0 ? "#ffb15c" : "#b06a82"} style={{ fontFamily: "Georgia, serif" }}>
        {n}
      </text>
    );
  });
  const diamonds = Array.from({ length: 8 }, (_, i) => {
    const p = polar(CX, CY, 178, i * 45 + 22);
    return <rect key={`d${i}`} x={p.x - 3} y={p.y - 3} width="6" height="6" transform={`rotate(45 ${p.x} ${p.y})`} fill="none" stroke="rgba(255,92,140,.6)" strokeWidth=".8" />;
  });
  return (
    <svg viewBox="0 0 600 580" className="w-full h-auto" role="img" aria-label="Face-down tarot card suspended in an apparatus ring">
      <defs>
        <radialGradient id="ldc-hbg" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="rgba(130,20,64,.42)" />
          <stop offset="55%" stopColor="rgba(64,10,36,.18)" />
          <stop offset="100%" stopColor="rgba(22,5,13,0)" />
        </radialGradient>
        <radialGradient id="ldc-scorch" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(5,1,2,.85)" />
          <stop offset="60%" stopColor="rgba(20,7,6,.4)" />
          <stop offset="100%" stopColor="rgba(30,10,8,0)" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="600" height="580" fill="url(#ldc-hbg)" />

      {/* tilted orbit ellipse with satellite sparks */}
      <ellipse cx={CX} cy={CY} rx="272" ry="88" transform={`rotate(-12 ${CX} ${CY})`} fill="none" stroke="rgba(255,92,140,.3)" strokeWidth=".8" strokeDasharray="4 7" className="ldc-anim-flow" style={{ animationDuration: "48s" }} />
      {[0.12, 0.42, 0.68, 0.9].map((t, i) => {
        const a = t * 360;
        const x = CX + 272 * Math.cos(rad(a));
        const y = CY + 88 * Math.sin(rad(a));
        const hues = ["#ff3d6e", "#ffb15c", "#a55cff", "#ff8a3c"];
        return (
          <g key={`o${i}`} transform={`rotate(-12 ${CX} ${CY})`}>
            <circle cx={x} cy={y} r="8" fill={hues[i]} opacity=".18" className="ldc-anim-pulse" style={{ animationDuration: `${7 + i * 3}s` }} />
            <circle cx={x} cy={y} r="3.4" fill={hues[i]} opacity=".9" />
          </g>
        );
      })}

      {/* static tick ring */}
      <circle cx={CX} cy={CY} r="268" fill="none" stroke="rgba(226,92,128,.25)" strokeWidth=".8" />
      {ticks}
      <text x={CX} y={CY - 248} textAnchor="middle" fontSize="8" letterSpacing="4" fill="#a0586e">DRAW FIELD · SEALED</text>

      {/* rotating roman-numeral ring */}
      <g className="ldc-anim-spin" style={{ animationDuration: "170s", transformOrigin: "300px 290px" }}>
        <circle cx={CX} cy={CY} r="232" fill="none" stroke="rgba(255,177,92,.3)" strokeWidth=".7" strokeDasharray="2 5" />
        {romanRing}
      </g>

      {/* counter-rotating diamond ring */}
      <g className="ldc-anim-spinr" style={{ animationDuration: "110s", transformOrigin: "300px 290px" }}>
        <circle cx={CX} cy={CY} r="178" fill="none" stroke="rgba(165,92,255,.35)" strokeWidth=".7" strokeDasharray="10 6" />
        {diamonds}
      </g>

      {/* suspended face-down card */}
      <g className="ldc-anim-bob" style={{ animationDuration: "11s" }}>
        <g transform="rotate(-6 300 285)">
          <rect x="238" y="203" width="124" height="168" rx="6" fill="rgba(26,6,16,.92)" stroke="rgba(255,92,140,.65)" strokeWidth="1.2" />
          <rect x="245" y="210" width="110" height="154" rx="3" fill="none" stroke="rgba(226,92,128,.35)" strokeWidth=".7" />
          <path d="M300 236 L305 260 L324 256 L310 272 L324 286 L305 282 L300 308 L295 282 L276 286 L290 272 L276 256 L295 260 Z" fill="none" stroke="#ff5c85" strokeWidth="1.1" className="ldc-anim-pulse" style={{ animationDuration: "6s" }} />
          <circle cx="300" cy="272" r="4" fill="#ff3d6e" opacity=".85" className="ldc-anim-flicker" style={{ animationDuration: "5s" }} />
          <text x="300" y="336" textAnchor="middle" fontSize="7" letterSpacing="3" fill="#8f4559">FACE DOWN</text>
          {/* calibration clamps */}
          <path d="M226 240 h14 M226 334 h14" stroke="rgba(255,177,92,.55)" strokeWidth="1.2" />
          <path d="M374 240 h-14 M374 334 h-14" stroke="rgba(255,177,92,.55)" strokeWidth="1.2" />
        </g>
        {/* pedestal */}
        <ellipse cx="300" cy="436" rx="60" ry="11" fill="rgba(255,138,60,.14)" stroke="rgba(255,138,60,.5)" strokeWidth=".8" />
      </g>

      {/* scorch marks */}
      <ellipse cx="300" cy="444" rx="96" ry="19" fill="url(#ldc-scorch)" opacity=".8" />
      <ellipse cx="130" cy="220" rx="34" ry="9" fill="url(#ldc-scorch)" opacity=".5" />
      <ellipse cx="486" cy="462" rx="30" ry="8" fill="url(#ldc-scorch)" opacity=".45" />

      {/* crosshair markers + micro readouts */}
      <g stroke="rgba(255,177,92,.55)" strokeWidth=".8" fill="none">
        <path d="M300 22 v14 M293 29 h14" />
        <path d="M300 544 v14 M293 551 h14" />
        <path d="M20 290 h14 M27 283 v14" />
        <path d="M566 290 h14 M573 283 v14" />
      </g>
      <text x="52" y="282" fontSize="8" letterSpacing="3" fill="#8f4559">DECK 8/8</text>
      <text x="52" y="308" fontSize="8" letterSpacing="3" fill="#8f4559">FLUX · LOW</text>
      <text x="500" y="52" fontSize="8" letterSpacing="2" fill="#8f4559">☿︎ DIRECT</text>
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
    <div className="ldc-panel" style={{ transform: "rotate(-.7deg)", margin: "0 -14px" }}>
      <PanelHead title="Daily Draw Chamber" right="SPECIMEN BAY 01 · COLD" />
      <PanelGrime v={0} />
      <div className="grid grid-cols-1 gap-10 p-6 pt-9 sm:p-9 lg:grid-cols-[1fr_.92fr] lg:gap-4">
        {/* stage — holder ring + flip card */}
        <div className="ldc-stage-shift relative flex flex-col items-center">
          <div className="relative" style={{ width: "min(320px, 78vw)" }}>
            {/* holder ring behind the card */}
            <svg viewBox="0 0 400 400" className="pointer-events-none absolute" style={{ inset: "-19% -12%", width: "124%", height: "138%", opacity: .8 }} aria-hidden>
              <g className="ldc-anim-spin" style={{ animationDuration: "120s", transformOrigin: "200px 200px" }}>
                <circle cx="200" cy="200" r="188" fill="none" stroke="rgba(226,92,128,.3)" strokeWidth=".8" />
                {Array.from({ length: 60 }, (_, i) => {
                  const p1 = polar(200, 200, 188, i * 6);
                  const p2 = polar(200, 200, i % 5 === 0 ? 178 : 183, i * 6);
                  return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={i % 5 === 0 ? "rgba(255,177,92,.55)" : "rgba(226,92,128,.35)"} strokeWidth={i % 5 === 0 ? 1 : .6} />;
                })}
              </g>
              <g className="ldc-anim-spinr" style={{ animationDuration: "85s", transformOrigin: "200px 200px" }}>
                <circle cx="200" cy="200" r="164" fill="none" stroke="rgba(165,92,255,.35)" strokeWidth=".7" strokeDasharray="8 8" />
              </g>
              <ellipse cx="200" cy="200" rx="196" ry="70" transform="rotate(-16 200 200)" fill="none" stroke="rgba(255,92,140,.22)" strokeWidth=".7" strokeDasharray="3 8" className="ldc-anim-flow" style={{ animationDuration: "40s" }} />
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
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button type="button" className="ldc-btn" onClick={draw} disabled={busy}>
              <span className="ldc-hdot" style={{ background: "#ffd9e2", boxShadow: "0 0 6px #ffd9e2" }} />
              {busy ? "CALIBRATING…" : card ? "RESEAL · DRAW AGAIN" : "DRAW YOUR CARD"}
            </button>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            <span className="ldc-caps-sm ldc-mono" style={{ color: "#8f4559" }}>
              DECK 8/8 MAJOR
            </span>
            <span className="ldc-caps-sm ldc-mono" style={{ color: "#8f4559" }}>
              DRAW NO. <span style={{ color: "#ffb15c", textShadow: "0 0 8px rgba(255,138,60,.7)" }}>{String(draws).padStart(3, "0")}</span>
            </span>
            <span className="ldc-caps-sm ldc-mono ldc-anim-flicker" style={{ color: "#a0586e", animationDuration: "9s" }}>
              {busy ? "FLUX RISING" : flipped ? "SEAL BROKEN" : "SEAL INTACT"}
            </span>
          </div>
          <div className="ldc-ticks mt-3" style={{ width: "72%", opacity: .5 }} />
        </div>

        {/* readout — overlaps the chamber's right edge on wide screens */}
        <div className="relative flex items-center">
          <div className="ldc-readout ldc-panel relative w-full" style={{ zIndex: 3, boxShadow: "inset 0 0 0 1px rgba(0,0,0,.55), inset 0 0 36px rgba(96,10,42,.28), 0 18px 44px rgba(0,0,0,.6), 0 0 30px rgba(255,61,110,.14)" }}>
            <CornerTicks />
            <PanelGrime v={1} />
            {card ? (
              <div key={`${cardIdx}-${draws}`} className="ldc-readout-swap p-6">
                <div className="flex items-center gap-3">
                  <span className="ldc-hdot ldc-anim-pulse" style={{ background: card.hue, boxShadow: `0 0 6px ${card.hue}`, animationDuration: "5s" }} />
                  <span className="ldc-caps-sm ldc-mono" style={{ color: "#8f4559" }}>
                    SPECIMEN NO. {String(draws).padStart(3, "0")} · MAJOR ARCANA
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-4">
                  <span style={{ fontSize: 44, lineHeight: 1, color: card.hue, textShadow: `0 0 18px ${card.hue}`, fontFamily: "Georgia, serif" }}>
                    {card.numeral}
                  </span>
                  <h3 className="ldc-caps" style={{ fontSize: "clamp(17px, 2.2vw, 24px)", color: "#ffeef2", margin: 0 }}>
                    {card.name}
                  </h3>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {card.keywords.map((k) => (
                    <span
                      key={k}
                      className="ldc-caps-sm ldc-mono"
                      style={{
                        color: card.hue,
                        border: `1px solid ${card.hue}55`,
                        padding: "3px 9px",
                        textShadow: `0 0 8px ${card.hue}`,
                        background: "rgba(22,5,13,.6)",
                      }}
                    >
                      {k}
                    </span>
                  ))}
                </div>
                <div className="ldc-rule mt-5" style={{ opacity: .7 }} />
                <p className="mt-4" style={{ fontSize: 14.5, lineHeight: 1.8, color: "#d5a0b0", margin: 0 }}>{card.guidance}</p>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {[
                    { k: "ELEMENT", v: ["FIRE", "AETHER", "WATER", "EARTH"][idx % 4] },
                    { k: "POLARITY", v: idx % 2 === 0 ? "ACTIVE" : "RECEPTIVE" },
                    { k: "WINDOW", v: "24 HOURS" },
                  ].map((r) => (
                    <div key={r.k} style={{ border: "1px solid rgba(226,92,128,.16)", background: "rgba(22,5,13,.5)", padding: "6px 9px" }}>
                      <div className="ldc-caps-sm" style={{ color: "#6e3a4a", fontSize: 7 }}>{r.k}</div>
                      <div className="ldc-mono mt-1" style={{ fontSize: 10, color: "#cf93a6" }}>{r.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <span className="ldc-hdot" style={{ background: "#8f4559", boxShadow: "0 0 6px #8f4559" }} />
                  <span className="ldc-caps-sm ldc-mono" style={{ color: "#8f4559" }}>READOUT · AWAITING SPECIMEN</span>
                </div>
                <h3 className="mt-4" style={{ fontSize: "clamp(19px, 2.4vw, 26px)", lineHeight: 1.3, color: "#f3d3dc", fontWeight: 400, margin: 0 }}>
                  The card is sealed face down.
                  <br />
                  <em style={{ color: "#ffb15c", textShadow: "0 0 16px rgba(255,138,60,.6)" }}>Break the seal.</em>
                </h3>
                <div className="ldc-rule mt-5" style={{ opacity: .7 }} />
                <p className="mt-4" style={{ fontSize: 14, lineHeight: 1.8, color: "#cf9dad", margin: 0 }}>
                  One card per day, drawn cold from a chamber of eight major arcana. Press the draw — the apparatus
                  calibrates, reseals the deck, and turns your specimen face up.
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div style={{ flex: 1, background: "rgba(226,92,128,.12)", height: 5, position: "relative", overflow: "hidden" }}>
                    <i className="ldc-anim-pulse" style={{ display: "block", height: "100%", width: "12%", background: "linear-gradient(90deg,#7a1030,#ff3d6e)", boxShadow: "0 0 10px rgba(255,61,110,.75)", animationDuration: "8s" }} />
                  </div>
                  <span className="ldc-mono" style={{ fontSize: 11, color: "#ff5c85", textShadow: "0 0 9px rgba(255,61,110,.8)" }}>IDLE</span>
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

      {/* deep background: numeral wheels, construction lines, embers */}
      <Background />

      {/* dust-noise + fine-scratch overlays, fixed above the whole page */}
      <div className="ldc-grime-noise" aria-hidden />
      <div className="ldc-scratches" aria-hidden />

      <div className="relative" style={{ zIndex: 1 }}>
        {/* ============================================================ */}
        {/* 1 · TOP BAR — full bleed                                      */}
        {/* ============================================================ */}
        <header className="ldc-panel" style={{ borderLeft: "none", borderRight: "none", borderTop: "none" }}>
          <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
            <span className="ldc-hdot" />
            <a href="#" className="ldc-caps ldc-mono" style={{ fontSize: 12, color: "#ffd9e2", textShadow: "0 0 10px rgba(255,61,110,.6)", textDecoration: "none" }}>
              ASTRO SCOPE
            </a>
            <span className="ldc-caps-sm ldc-mono hidden md:inline" style={{ color: "#8f4559" }}>TAROT · SPREADS</span>
            <span className="ldc-rule" style={{ flex: 1 }} />
            <nav className="flex items-center gap-4 sm:gap-6">
              {["ALL SPREADS", "ALL CARDS", "HOROSCOPES"].map((n) => (
                <a key={n} href="#" className="ldc-caps-sm ldc-mono hidden sm:inline" style={{ color: "#cf93a6", textDecoration: "none" }}>
                  {n}
                </a>
              ))}
              <a href="#ldc-draw" className="ldc-btn-ghost" style={{ padding: "7px 14px", textDecoration: "none" }}>
                TO THE CHAMBER
              </a>
            </nav>
          </div>
          <div className="ldc-ticks" />
        </header>

        {/* ============================================================ */}
        {/* 2 · HERO — apparatus bleeds off the right edge                */}
        {/* ============================================================ */}
        <section className="relative">
          {/* hairline construction rule crossing the hero */}
          <div className="pointer-events-none absolute hidden lg:block" style={{ left: "50%", top: 40, bottom: 40, width: 1, background: "rgba(226,92,128,.14)" }} aria-hidden />
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:pt-20">
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="ldc-hdot" />
                <span className="ldc-caps ldc-mono" style={{ fontSize: 11, color: "#ff8aa8", textShadow: "0 0 10px rgba(255,61,110,.7)" }}>
                  DAILY CARD · SPREAD 01
                </span>
                <span className="ldc-rule" style={{ width: 60 }} />
                <span className="ldc-caps-sm ldc-mono" style={{ color: "#8f4559" }}>BAY SEALED</span>
              </div>

              <h1 className="mt-7" style={{ fontSize: "clamp(38px, 5.6vw, 64px)", lineHeight: 1.06, color: "#ffeef2", fontWeight: 400, transform: "rotate(-.6deg)", transformOrigin: "left center" }}>
                One card.
                <br />
                One day.{" "}
                <em style={{ color: "#ff5c85", textShadow: "0 0 22px rgba(255,61,110,.75)", fontStyle: "italic" }}>
                  Drawn cold.
                </em>
              </h1>

              <p className="mt-6 max-w-md" style={{ fontSize: 16, lineHeight: 1.75, color: "#d5a0b0" }}>
                The oldest spread is also the smallest: a single card, pulled before the day has a shape. No positions,
                no cross — just one archetype weighed against twenty-four hours.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a href="#ldc-draw" className="ldc-btn" style={{ textDecoration: "none" }}>
                  <span className="ldc-hdot" style={{ background: "#ffd9e2", boxShadow: "0 0 6px #ffd9e2" }} />
                  DRAW YOUR CARD
                </a>
                <a href="#ldc-method" className="ldc-btn-ghost" style={{ textDecoration: "none" }}>
                  HOW TO READ IT ↓
                </a>
              </div>

              {/* hero micro-readouts — tilted, wider than the column */}
              <div
                className="ldc-panel mt-11 grid grid-cols-3 divide-x"
                style={{ borderColor: "rgba(226,92,128,.2)", transform: "rotate(.5deg)", width: "calc(100% + 56px)", marginLeft: -14 }}
              >
                <PanelGrime v={1} />
                {[
                  { k: "CARDS IN BAY", v: "8 MAJOR", h: "#ff5c85" },
                  { k: "DRAW COST", v: "0 — FREE", h: "#ffb15c" },
                  { k: "VALIDITY", v: "24 H", h: "#c47dff" },
                ].map((r) => (
                  <div key={r.k} className="px-4 py-3" style={{ borderColor: "rgba(226,92,128,.16)" }}>
                    <div className="ldc-caps-sm" style={{ color: "#8f4559" }}>{r.k}</div>
                    <div className="ldc-mono mt-1" style={{ fontSize: 15, color: r.h, textShadow: `0 0 9px ${r.h}` }}>{r.v}</div>
                  </div>
                ))}
              </div>
              <div className="ldc-ticks mt-1" style={{ opacity: .5, width: "80%" }} />
            </div>

            <div className="ldc-hero-bleed">
              <CornerTicks />
              <HeroApparatus />
              <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2">
                <span className="ldc-hdot ldc-anim-pulse" style={{ animationDuration: "4s" }} />
                <span className="ldc-caps-sm ldc-mono" style={{ color: "#a0586e" }}>SUSPENSION RING · ONLINE</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3 · THE DRAW CHAMBER — centerpiece, tilted, juts wide         */}
        {/* ============================================================ */}
        <section id="ldc-draw" className="relative mx-auto max-w-7xl scroll-mt-8 px-4 pb-24 sm:px-6">
          {/* vertical tick ruler straddling the section's left edge */}
          <div className="ldc-ticks-v pointer-events-none absolute hidden lg:block" style={{ left: -18, top: 60, height: "72%", opacity: .5 }} aria-hidden />
          <div className="mb-6 flex items-center gap-4" style={{ transform: "rotate(.3deg)" }}>
            <span className="ldc-hdot" />
            <h2 className="ldc-caps" style={{ fontSize: 14, color: "#ffeef2", margin: 0 }}>The Draw Chamber</h2>
            <span className="ldc-rule" style={{ flex: 1 }} />
            <span className="ldc-caps-sm ldc-mono" style={{ color: "#8f4559" }}>1 SPECIMEN / DAY · UNLOGGED HERE</span>
          </div>
          <DrawChamber />
        </section>

        {/* ============================================================ */}
        {/* 4 · HOW TO READ — staggered, overlapping protocol plates      */}
        {/* ============================================================ */}
        <section id="ldc-method" className="mx-auto max-w-6xl scroll-mt-8 px-4 pb-24 sm:px-6">
          <div className="mb-8 flex items-center gap-4">
            <span className="ldc-engrave">Reading Protocol</span>
            <span className="ldc-rule" style={{ flex: 1 }} />
            <span className="ldc-caps-sm ldc-mono" style={{ color: "#8f4559" }}>4 OPERATIONS · 24 H CYCLE</span>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {STEPS.map((s, i) => (
              <article key={s.id} className="ldc-panel p-5" style={STEP_DIRT[i]}>
                <CornerTicks c="rgba(226,92,128,.35)" />
                <div className="flex items-center justify-between gap-3">
                  <span
                    style={{
                      fontSize: 34,
                      lineHeight: 1,
                      color: "transparent",
                      WebkitTextStroke: "1px rgba(255,92,140,.55)",
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    {("0" + (i + 1)).slice(-2)}
                  </span>
                  <span className="ldc-caps-sm ldc-mono" style={{ color: "#8f4559", fontSize: 7 }}>{s.id}</span>
                </div>
                <h3 className="ldc-caps mt-4" style={{ fontSize: 13, color: "#ffeef2", margin: 0, marginTop: 16 }}>
                  {s.title}
                </h3>
                <p className="mt-3" style={{ fontSize: 13, lineHeight: 1.75, color: "#cf9dad", margin: 0, marginTop: 12 }}>
                  {s.copy}
                </p>
                <div className="mt-4 flex items-center gap-2" style={{ borderTop: "1px solid rgba(226,92,128,.16)", paddingTop: 10 }}>
                  <span className="ldc-hdot ldc-anim-pulse" style={{ width: 4, height: 4, animationDuration: `${5 + i}s` }} />
                  <span className="ldc-caps-sm ldc-mono" style={{ color: "#a0586e", fontSize: 8 }}>{s.readout}</span>
                </div>
              </article>
            ))}
          </div>
          {/* connector hairline under the staggered plates */}
          <div className="ldc-rule mt-8 hidden lg:block" style={{ width: "64%", marginLeft: "18%", transform: "rotate(-.4deg)", opacity: .6 }} />
        </section>

        {/* ============================================================ */}
        {/* 5 · FAQ — CHAMBER NOTES, staggered off-center                 */}
        {/* ============================================================ */}
        <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:ml-[9%]">
          <div className="mb-6 flex items-center gap-4">
            <span className="ldc-hdot" />
            <h2 className="ldc-caps" style={{ fontSize: 14, color: "#ffeef2", margin: 0 }}>Chamber Notes</h2>
            <span className="ldc-rule" style={{ flex: 1 }} />
            <span className="ldc-caps-sm ldc-mono" style={{ color: "#8f4559" }}>3 ENTRIES</span>
          </div>
          <div className="flex flex-col gap-3">
            {FAQ.map((f, i) => (
              <details key={f.id} className="ldc-faq" style={FAQ_DIRT[i]}>
                <summary>
                  <span className="ldc-caps-sm ldc-mono" style={{ color: "#8f4559", whiteSpace: "nowrap" }}>{f.id}</span>
                  <span style={{ fontSize: 15, color: "#f3d3dc", flex: 1 }}>{f.q}</span>
                  <span className="ldc-faq-x ldc-mono" style={{ color: "#ff5c85", fontSize: 14, textShadow: "0 0 8px rgba(255,61,110,.7)" }}>+</span>
                </summary>
                <div style={{ borderTop: "1px solid rgba(226,92,128,.16)", padding: "12px 16px 14px 16px" }}>
                  <p style={{ fontSize: 13.5, lineHeight: 1.75, color: "#cf9dad", margin: 0 }}>{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 6 · CTA — full bleed                                          */}
        {/* ============================================================ */}
        <section className="ldc-panel" style={{ borderLeft: "none", borderRight: "none" }}>
          <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
            <CornerTicks />
            <PanelGrime v={0} />
            <div className="ldc-ticks mx-auto mb-8" style={{ width: 180, opacity: .6 }} />
            <h2 style={{ fontSize: "clamp(26px, 4vw, 44px)", lineHeight: 1.2, color: "#ffeef2", fontWeight: 400, margin: 0, transform: "rotate(-.4deg)" }}>
              The deck is warmed.
              <br />
              <em style={{ color: "#ffb15c", textShadow: "0 0 20px rgba(255,138,60,.7)" }}>The seal is yours to break.</em>
            </h2>
            <p className="mx-auto mt-5 max-w-md" style={{ fontSize: 14.5, lineHeight: 1.75, color: "#d5a0b0" }}>
              One draw, one theme, one line in the log tonight. The chamber takes less than a minute of your morning.
            </p>
            <a href="#ldc-draw" className="ldc-btn mt-9 inline-flex" style={{ textDecoration: "none", fontSize: 11, padding: "13px 30px" }}>
              <span className="ldc-hdot" style={{ background: "#ffd9e2", boxShadow: "0 0 6px #ffd9e2" }} />
              DRAW YOUR DAILY CARD
            </a>
            <div className="ldc-ticks mx-auto mt-8" style={{ width: 180, opacity: .6 }} />
          </div>
        </section>

        {/* ============================================================ */}
        {/* 7 · FOOTER — lab status strip juts wider than the column      */}
        {/* ============================================================ */}
        <footer className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="ldc-panel" style={{ margin: "0 -22px", transform: "rotate(.3deg)" }}>
            <PanelGrime v={1} />
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5">
              {[
                { k: "CHAMBER", v: "SEALED", h: "#ff5c85" },
                { k: "DECK", v: "8/8 MAJOR", h: "#ffb15c" },
                { k: "MERCURY", v: "☿︎ DIRECT", h: "#c47dff" },
                { k: "DRAW WINDOW", v: "24 H", h: "#ff8a3c" },
                { k: "LOG", v: "AWAITING LINE", h: "#ff5c85" },
              ].map((s) => (
                <span key={s.k} className="flex items-center gap-2">
                  <span className="ldc-hdot ldc-anim-pulse" style={{ width: 4, height: 4, background: s.h, boxShadow: `0 0 5px ${s.h}`, animationDuration: "6s" }} />
                  <span className="ldc-caps-sm ldc-mono" style={{ color: "#8f4559", fontSize: 8 }}>{s.k}</span>
                  <span className="ldc-mono" style={{ fontSize: 10, color: s.h, textShadow: `0 0 7px ${s.h}` }}>{s.v}</span>
                </span>
              ))}
              <span className="ldc-rule" style={{ flex: 1, minWidth: 30 }} />
              <span className="ldc-caps-sm ldc-mono ldc-anim-flicker" style={{ color: "#a0586e", animationDuration: "9s", fontSize: 8 }}>
                BAY STATUS · ALL SEALS NOMINAL
              </span>
            </div>
          </div>
          <div className="ldc-ticks mt-1" style={{ opacity: .4 }} />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="ldc-caps-sm ldc-mono" style={{ color: "#6e3a4a", fontSize: 8 }}>© ASTRO SCOPE · ARCANA LABORATORIUM</span>
            <span className="ldc-caps-sm ldc-mono" style={{ color: "#6e3a4a", fontSize: 8 }}>DAILY CARD · SPREAD 01 · VOL. VII</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
