"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { getArcana } from "@/lib/arcana";
import type { ArcanaCard } from "@/lib/arcana";

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                    */
/* ------------------------------------------------------------------ */

const rad = (deg: number) => (deg * Math.PI) / 180;
const polar = (cx: number, cy: number, r: number, deg: number) => ({
  x: Math.round((cx + r * Math.cos(rad(deg))) * 100) / 100,
  y: Math.round((cy + r * Math.sin(rad(deg))) * 100) / 100,
});

const ROMANS = [
  "0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
  "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI",
];
/** arcana.ts numbers run 1–21 + 22 = The Fool (0). */
const romanOf = (n: number) => (n === 22 ? ROMANS[0] : ROMANS[n]);

/* ------------------------------------------------------------------ */
/* Specimen data — first eight majors out of the cabinet               */
/* ------------------------------------------------------------------ */

type MarkKind = "fool" | "magician" | "priestess" | "empress" | "hermit" | "wheel" | "star" | "moon";

type Specimen = {
  num: number;
  roman: string;
  hue: string;
  glow: string;
  glyph: string; // planet/sign glyph + U+FE0E
  mark: MarkKind;
  card: ArcanaCard;
};

const SPEC_DEFS: { num: number; hue: string; glow: string; glyph: string; mark: MarkKind }[] = [
  { num: 22, hue: "#c47dff", glow: "rgba(165,92,255,.5)", glyph: "♅︎", mark: "fool" },
  { num: 1, hue: "#ff5c85", glow: "rgba(255,61,110,.5)", glyph: "☿︎", mark: "magician" },
  { num: 2, hue: "#c9a5ff", glow: "rgba(201,165,255,.45)", glyph: "☽︎", mark: "priestess" },
  { num: 3, hue: "#ff8aa8", glow: "rgba(255,138,168,.45)", glyph: "♀︎", mark: "empress" },
  { num: 9, hue: "#ffb15c", glow: "rgba(255,138,60,.5)", glyph: "♍︎", mark: "hermit" },
  { num: 10, hue: "#ff8a3c", glow: "rgba(255,138,60,.5)", glyph: "♃︎", mark: "wheel" },
  { num: 17, hue: "#a55cff", glow: "rgba(165,92,255,.5)", glyph: "♒︎", mark: "star" },
  { num: 18, hue: "#ff5c9a", glow: "rgba(255,92,154,.45)", glyph: "♓︎", mark: "moon" },
];

const SPECIMENS: Specimen[] = SPEC_DEFS.map((d) => ({
  ...d,
  roman: romanOf(d.num),
  card: getArcana(d.num),
}));

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

const FAQ: { id: string; q: string; a: string }[] = [
  {
    id: "NOTE 01",
    q: "Major versus Minor Arcana — what is the difference?",
    a: "The deck splits into 22 Major Arcana — the large life lessons and spiritual themes, the trumps — and 56 Minor Arcana, the everyday weather of a life. A reading weighs the trumps heavily; the minors supply the fine grain.",
  },
  {
    id: "NOTE 02",
    q: "What are the four suits?",
    a: "Wands burn (Fire), Cups pour (Water), Swords cut (Air), Pentacles weigh (Earth). Each suit runs Ace to Ten plus four court cards — fourteen specimens per chamber, fifty-six in all.",
  },
  {
    id: "NOTE 03",
    q: "Why are only eight specimens on display?",
    a: "The cabinet is catalogued one distillation at a time. These eight majors passed inspection first; the remaining seventy specimens are in preparation and join the shelves as they are sealed.",
  },
];

/* ------------------------------------------------------------------ */
/* Layout dirt — deterministic offsets, tilts, overlaps                */
/* ------------------------------------------------------------------ */

const SPEC_DIRT = [
  "translate(2px,6px) rotate(-1.1deg)",
  "translate(-3px,-4px) rotate(.8deg)",
  "translate(3px,3px) rotate(-.6deg)",
  "translate(-2px,7px) rotate(1.3deg)",
  "translate(4px,-5px) rotate(-1.5deg)",
  "translate(-4px,2px) rotate(.9deg)",
  "translate(2px,-3px) rotate(-.8deg)",
  "translate(-3px,5px) rotate(1.1deg)",
];

const FAQ_DIRT: CSSProperties[] = [
  { marginRight: 52, transform: "rotate(-.4deg)" },
  { marginLeft: 46, transform: "rotate(.5deg)" },
  { marginLeft: 18, marginRight: 30, transform: "rotate(-.3deg)" },
];

/* ------------------------------------------------------------------ */
/* Background fields — embers, star specks, giant faint glyphs         */
/* ------------------------------------------------------------------ */

const EMBERS: { l: number; s: number; c: string; dur: string; del: string }[] = [
  { l: 4, s: 3, c: "#ffb15c", dur: "34s", del: "-8s" },
  { l: 11, s: 2, c: "#ff5c85", dur: "46s", del: "-30s" },
  { l: 18, s: 4, c: "#ff8a3c", dur: "28s", del: "-17s" },
  { l: 26, s: 2, c: "#c47dff", dur: "52s", del: "-41s" },
  { l: 33, s: 3, c: "#ffb15c", dur: "38s", del: "-5s" },
  { l: 41, s: 2, c: "#ff5c9a", dur: "57s", del: "-49s" },
  { l: 49, s: 3, c: "#ff8a3c", dur: "31s", del: "-22s" },
  { l: 57, s: 2, c: "#c9a5ff", dur: "43s", del: "-12s" },
  { l: 64, s: 4, c: "#c47dff", dur: "26s", del: "-3s" },
  { l: 71, s: 2, c: "#ff5c85", dur: "49s", del: "-36s" },
  { l: 78, s: 3, c: "#ffb15c", dur: "36s", del: "-26s" },
  { l: 85, s: 2, c: "#ff8a3c", dur: "54s", del: "-15s" },
  { l: 91, s: 3, c: "#ff5c9a", dur: "41s", del: "-33s" },
  { l: 96, s: 2, c: "#c9a5ff", dur: "29s", del: "-9s" },
];

const SPECKS: { t: number; l: number; s: number; dur: string; del: string }[] = [
  { t: 6, l: 22, s: 1.6, dur: "7s", del: "-2s" },
  { t: 9, l: 71, s: 1.2, dur: "9s", del: "-5s" },
  { t: 14, l: 45, s: 1.8, dur: "6s", del: "-1s" },
  { t: 21, l: 88, s: 1.3, dur: "8s", del: "-6s" },
  { t: 27, l: 12, s: 1.5, dur: "10s", del: "-3s" },
  { t: 33, l: 58, s: 1.1, dur: "7s", del: "-4s" },
  { t: 39, l: 79, s: 1.7, dur: "9s", del: "-7s" },
  { t: 46, l: 30, s: 1.2, dur: "8s", del: "-2s" },
  { t: 52, l: 93, s: 1.5, dur: "6s", del: "-5s" },
  { t: 58, l: 8, s: 1.3, dur: "10s", del: "-8s" },
  { t: 64, l: 50, s: 1.8, dur: "7s", del: "-3s" },
  { t: 71, l: 68, s: 1.2, dur: "9s", del: "-6s" },
  { t: 77, l: 36, s: 1.5, dur: "8s", del: "-1s" },
  { t: 83, l: 84, s: 1.3, dur: "7s", del: "-4s" },
  { t: 89, l: 16, s: 1.6, dur: "10s", del: "-7s" },
  { t: 94, l: 61, s: 1.2, dur: "9s", del: "-2s" },
];

const BG_GLYPHS: { ch: string; top: string; left?: string; right?: string; size: number; rot: number; c: string }[] = [
  { ch: "☿︎", top: "6%", left: "55%", size: 240, rot: -8, c: "rgba(255,92,140,.05)" },
  { ch: "♃︎", top: "22%", left: "1%", size: 210, rot: 6, c: "rgba(255,177,92,.045)" },
  { ch: "☽︎", top: "40%", right: "2%", size: 280, rot: -5, c: "rgba(196,125,255,.05)" },
  { ch: "♅︎", top: "57%", left: "42%", size: 230, rot: 9, c: "rgba(255,92,140,.04)" },
  { ch: "♀︎", top: "73%", right: "13%", size: 200, rot: -11, c: "rgba(255,177,92,.045)" },
  { ch: "♓︎", top: "88%", left: "6%", size: 240, rot: 4, c: "rgba(196,125,255,.045)" },
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
      { cx: 4, cy: 88, rx: 14, ry: 10, c: "rgba(6,2,3,.42)" },
      { cx: 7, cy: 86, rx: 8, ry: 5, c: "rgba(122,60,16,.14)" },
      { cx: 96, cy: 12, rx: 10, ry: 7, c: "rgba(70,16,40,.38)" },
      { cx: 94, cy: 90, rx: 12, ry: 8, c: "rgba(140,70,20,.12)" },
    ],
    drips: [
      { x: 92, y: 2, len: 16, c: "rgba(140,70,20,.26)" },
      { x: 96.5, y: 1, len: 9, c: "rgba(96,40,60,.3)" },
      { x: 6, y: 70, len: 12, c: "rgba(140,70,20,.2)" },
    ],
    specks: [
      { x: 14, y: 22, r: 0.5, c: "rgba(0,0,0,.5)" },
      { x: 21, y: 64, r: 0.35, c: "rgba(255,150,90,.2)" },
      { x: 34, y: 12, r: 0.45, c: "rgba(0,0,0,.42)" },
      { x: 47, y: 88, r: 0.3, c: "rgba(255,150,90,.16)" },
      { x: 58, y: 30, r: 0.5, c: "rgba(0,0,0,.45)" },
      { x: 66, y: 74, r: 0.35, c: "rgba(0,0,0,.4)" },
      { x: 78, y: 18, r: 0.4, c: "rgba(255,150,90,.18)" },
      { x: 86, y: 52, r: 0.5, c: "rgba(0,0,0,.48)" },
      { x: 30, y: 46, r: 0.3, c: "rgba(0,0,0,.38)" },
      { x: 71, y: 93, r: 0.4, c: "rgba(255,150,90,.15)" },
      { x: 9, y: 41, r: 0.35, c: "rgba(0,0,0,.4)" },
      { x: 90, y: 77, r: 0.3, c: "rgba(0,0,0,.36)" },
    ],
  },
  {
    stains: [
      { cx: 92, cy: 86, rx: 13, ry: 9, c: "rgba(6,2,3,.4)" },
      { cx: 89, cy: 84, rx: 7, ry: 4, c: "rgba(122,60,16,.15)" },
      { cx: 6, cy: 14, rx: 9, ry: 6, c: "rgba(70,16,40,.36)" },
      { cx: 50, cy: 97, rx: 16, ry: 5, c: "rgba(6,2,3,.3)" },
    ],
    drips: [
      { x: 8, y: 3, len: 13, c: "rgba(96,40,60,.28)" },
      { x: 88, y: 68, len: 14, c: "rgba(140,70,20,.24)" },
      { x: 46, y: 84, len: 8, c: "rgba(140,70,20,.18)" },
    ],
    specks: [
      { x: 12, y: 58, r: 0.45, c: "rgba(0,0,0,.46)" },
      { x: 26, y: 26, r: 0.3, c: "rgba(255,150,90,.18)" },
      { x: 38, y: 71, r: 0.5, c: "rgba(0,0,0,.42)" },
      { x: 52, y: 16, r: 0.35, c: "rgba(0,0,0,.44)" },
      { x: 63, y: 49, r: 0.4, c: "rgba(255,150,90,.16)" },
      { x: 74, y: 82, r: 0.3, c: "rgba(0,0,0,.4)" },
      { x: 83, y: 34, r: 0.5, c: "rgba(0,0,0,.45)" },
      { x: 19, y: 87, r: 0.35, c: "rgba(255,150,90,.15)" },
      { x: 43, y: 39, r: 0.3, c: "rgba(0,0,0,.36)" },
      { x: 94, y: 61, r: 0.4, c: "rgba(0,0,0,.4)" },
      { x: 68, y: 8, r: 0.3, c: "rgba(255,150,90,.17)" },
      { x: 31, y: 93, r: 0.35, c: "rgba(0,0,0,.38)" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Scoped styles                                                       */
/* ------------------------------------------------------------------ */

const CSS = `
.lcd-root { background:#160509; color:#e0aebe; font-family:Georgia,'Times New Roman',serif; position:relative; overflow-x:clip; }
.lcd-mono { font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace; }
.lcd-caps { text-transform:uppercase; letter-spacing:.24em; }
.lcd-caps-sm { text-transform:uppercase; letter-spacing:.2em; font-size:9px; }
.lcd-bg { position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
.lcd-bg-page { position:absolute; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
.lcd-panel {
  background:linear-gradient(160deg, rgba(52,12,26,.85), rgba(26,6,16,.94));
  border:1px solid rgba(226,92,128,.22);
  box-shadow:inset 0 0 0 1px rgba(0,0,0,.55), inset 0 0 36px rgba(96,10,42,.28), 0 0 26px rgba(0,0,0,.5);
  position:relative;
}
.lcd-panel::before {
  content:""; position:absolute; inset:4px; pointer-events:none;
  border:1px solid rgba(226,92,128,.1);
}
.lcd-header {
  display:flex; align-items:center; gap:8px;
  border-bottom:1px solid rgba(226,92,128,.18);
  padding:7px 12px;
}
.lcd-hdot { width:5px; height:5px; transform:rotate(45deg); background:#ff3d6e; box-shadow:0 0 6px #ff3d6e; flex:none; }
.lcd-htext { font-size:10px; letter-spacing:.28em; color:#eebcc9; text-transform:uppercase; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.lcd-rule { height:1px; background:linear-gradient(90deg, rgba(226,92,128,.42), rgba(226,92,128,.05)); }
.lcd-ticks { background-image:repeating-linear-gradient(90deg, rgba(226,92,128,.38) 0 1px, transparent 1px 8px); height:5px; }
.lcd-ticks-v { background-image:repeating-linear-gradient(0deg, rgba(226,92,128,.42) 0 1px, transparent 1px 7px); width:5px; }
.lcd-engrave {
  text-transform:uppercase; letter-spacing:.4em; font-size:10px; color:#8f4559;
  text-shadow:0 1px 0 rgba(0,0,0,.8), 0 -1px 0 rgba(255,150,180,.08);
}
.lcd-btn {
  display:inline-flex; align-items:center; gap:10px;
  background:linear-gradient(180deg, rgba(255,61,110,.3), rgba(122,14,52,.5));
  border:1px solid rgba(255,92,140,.62); color:#ffd9e2;
  text-transform:uppercase; letter-spacing:.26em; font-size:10px;
  padding:11px 22px; box-shadow:0 0 20px rgba(255,61,110,.38), inset 0 0 14px rgba(255,61,110,.26);
  transition:box-shadow .3s;
}
.lcd-btn:hover { box-shadow:0 0 32px rgba(255,61,110,.65), inset 0 0 18px rgba(255,61,110,.42); }
.lcd-btn-ghost {
  display:inline-flex; align-items:center; gap:8px;
  border:1px solid rgba(255,177,92,.4); color:#ffcf9a;
  text-transform:uppercase; letter-spacing:.24em; font-size:10px;
  padding:11px 18px; background:rgba(255,138,60,.06);
  box-shadow:inset 0 0 12px rgba(255,138,60,.1);
  transition:box-shadow .3s, border-color .3s;
}
.lcd-btn-ghost:hover { border-color:rgba(255,177,92,.75); box-shadow:0 0 18px rgba(255,138,60,.3), inset 0 0 14px rgba(255,138,60,.2); }
.lcd-bar { background:rgba(226,92,128,.12); height:5px; position:relative; overflow:hidden; }
.lcd-bar > i { display:block; height:100%; background:linear-gradient(90deg,#7a1030,#ff3d6e,#ffb15c); box-shadow:0 0 10px rgba(255,61,110,.75); }
.lcd-bar > i::after {
  content:""; position:absolute; inset:0;
  background-image:repeating-linear-gradient(90deg, rgba(255,255,255,.22) 0 1px, transparent 1px 12px);
}
.lcd-spec {
  position:relative; display:block; width:100%; text-align:left; cursor:pointer;
  border:1px solid rgba(226,92,128,.2); background:rgba(26,6,16,.84);
  font:inherit; color:inherit; padding:0;
  transition:opacity .45s, filter .45s, border-color .3s, box-shadow .3s, transform .35s;
}
.lcd-spec:hover { border-color:rgba(255,92,140,.55); box-shadow:0 0 18px rgba(255,61,110,.25), inset 0 0 16px rgba(255,61,110,.1); z-index:2; }
.lcd-spec:focus-visible { outline:1px solid rgba(255,177,92,.7); outline-offset:2px; }
.lcd-dim { opacity:.3; filter:saturate(.35) brightness(.62); }
.lcd-dim:hover { opacity:.55; }
.lcd-open {
  border-color:rgba(255,177,92,.6);
  box-shadow:0 0 30px rgba(255,138,60,.22), inset 0 0 30px rgba(96,10,42,.42);
  z-index:3;
}
.lcd-plate { display:grid; grid-template-rows:0fr; transition:grid-template-rows .55s cubic-bezier(.22,.8,.3,1); }
.lcd-plate > span { display:block; overflow:hidden; min-height:0; }
.lcd-plate.lcd-plate-open { grid-template-rows:1fr; }
.lcd-kw {
  display:inline-flex; align-items:center; gap:6px;
  border:1px solid rgba(226,92,128,.24); background:rgba(22,5,13,.6);
  padding:4px 9px;
}
.lcd-drawer-cell { transition:fill .3s; }
details.lcd-faq { border:1px solid rgba(226,92,128,.2); background:rgba(26,6,16,.82); position:relative; }
details.lcd-faq summary { cursor:pointer; list-style:none; display:flex; align-items:center; gap:12px; padding:13px 16px; }
details.lcd-faq summary::-webkit-details-marker { display:none; }
details.lcd-faq summary .lcd-faq-x { transition:transform .3s; }
details.lcd-faq[open] summary .lcd-faq-x { transform:rotate(45deg); }
details.lcd-faq[open] { border-color:rgba(255,92,140,.45); box-shadow:0 0 18px rgba(255,61,110,.18); }
.lcd-grime-noise {
  position:fixed; inset:0; z-index:40; pointer-events:none; opacity:.06;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}
.lcd-scratches {
  position:fixed; inset:0; z-index:41; pointer-events:none; opacity:.55;
  background-image:
    repeating-linear-gradient(101deg, rgba(255,214,224,.028) 0 1px, transparent 1px 340px),
    repeating-linear-gradient(77deg, rgba(0,0,0,.16) 0 1px, transparent 1px 250px),
    repeating-linear-gradient(14deg, rgba(255,190,200,.02) 0 1px, transparent 1px 540px);
}
.lcd-ember { position:absolute; bottom:-12px; border-radius:50%; opacity:0; animation:lcd-ember linear infinite; }
.lcd-hero-bleed { position:relative; }
@media (min-width:1024px) {
  .lcd-hero-bleed { transform:translateX(14%) scale(1.1); }
}
.lcd-anim-spin { animation:lcd-spin linear infinite; }
.lcd-anim-spinr { animation:lcd-spinr linear infinite; }
.lcd-anim-bob { animation:lcd-bob ease-in-out infinite; }
.lcd-anim-pulse { animation:lcd-pulse ease-in-out infinite; }
.lcd-anim-flicker { animation:lcd-flicker linear infinite; }
.lcd-anim-flow { animation:lcd-flow linear infinite; }
@keyframes lcd-spin { to { transform:rotate(360deg); } }
@keyframes lcd-spinr { to { transform:rotate(-360deg); } }
@keyframes lcd-bob { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-9px); } }
@keyframes lcd-pulse { 0%,100% { opacity:.5; } 50% { opacity:1; } }
@keyframes lcd-flicker { 0%,100% { opacity:.85; } 8% { opacity:.58; } 12% { opacity:.95; } 46% { opacity:.7; } 52% { opacity:1; } 78% { opacity:.74; } }
@keyframes lcd-flow { to { stroke-dashoffset:-240; } }
@keyframes lcd-ember { 0% { transform:translate(0,0); opacity:0; } 10% { opacity:.75; } 80% { opacity:.4; } 100% { transform:translate(34px,-108vh); opacity:0; } }
@media (prefers-reduced-motion: reduce) {
  .lcd-root *, .lcd-root *::before, .lcd-root *::after { animation:none !important; transition:none !important; }
}
`;

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function PanelHead({ title, right }: { title: string; right?: string }) {
  return (
    <div className="lcd-header">
      <span className="lcd-hdot" />
      <span className="lcd-htext">{title}</span>
      <span className="lcd-rule" style={{ flex: 1 }} />
      {right ? <span className="lcd-caps-sm lcd-mono" style={{ color: "#a0586e", whiteSpace: "nowrap" }}>{right}</span> : null}
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
/* Card face — the mini specimen graphic (viewBox 0 0 60 84)           */
/* ------------------------------------------------------------------ */

function Mark({ kind, hue }: { kind: MarkKind; hue: string }) {
  const stroke = { stroke: hue, strokeWidth: 1.1, fill: "none" as const };
  const dim = { stroke: "rgba(226,92,128,.4)", strokeWidth: .7, fill: "none" as const };
  let body: ReactNode = null;

  if (kind === "fool") {
    body = (
      <>
        <path d="M14 60 H38 L33 68 H14 Z" {...stroke} />
        <path d="M42 56 l4.5 4.5" {...dim} />
        <path d="M30 26 L31.8 31.2 L37 33 L31.8 34.8 L30 40 L28.2 34.8 L23 33 L28.2 31.2 Z" fill={hue} opacity=".5" className="lcd-anim-pulse" style={{ animationDuration: "6s" }} />
        <circle cx="44" cy="27" r="1.2" fill={hue} opacity=".8" />
      </>
    );
  } else if (kind === "magician") {
    body = (
      <>
        <path d="M18 44 C18 38 26 38 30 44 C34 50 42 50 42 44 C42 38 34 38 30 44 C26 50 18 50 18 44 Z" {...stroke} />
        <path d="M30 27 V36" {...stroke} />
        <circle cx="30" cy="25" r="1.1" fill={hue} className="lcd-anim-pulse" style={{ animationDuration: "5s" }} />
        <path d="M16 58 H44" {...dim} />
      </>
    );
  } else if (kind === "priestess") {
    body = (
      <>
        <path d="M20 30 V58 M40 30 V58 M17 30 H23 M37 30 H43 M17 58 H23 M37 58 H43" {...stroke} />
        <path d="M32.5 36 A7 7 0 1 0 32.5 50 A5.6 5.6 0 1 1 32.5 36 Z" fill={hue} opacity=".5" className="lcd-anim-pulse" style={{ animationDuration: "7s" }} />
        <path d="M20 33.5 C26 37.5 34 37.5 40 33.5" {...dim} strokeDasharray="2 2.5" />
      </>
    );
  } else if (kind === "empress") {
    body = (
      <>
        <circle cx="30" cy="42" r="5" {...stroke} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = polar(30, 42, 6, i * 30);
          const b = polar(30, 42, 11, i * 30);
          return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={hue} strokeWidth=".9" opacity={i % 3 === 0 ? .95 : .55} />;
        })}
        <circle cx="30" cy="42" r="1.5" fill={hue} className="lcd-anim-pulse" style={{ animationDuration: "6s" }} />
        <path d="M30 53 L33 57 L30 61 L27 57 Z" {...dim} />
      </>
    );
  } else if (kind === "hermit") {
    body = (
      <>
        <path d="M22 28 V60" {...stroke} />
        <rect x="27" y="34" width="10" height="14" {...stroke} />
        <path d="M29.5 34 A2.5 2.5 0 0 1 34.5 34" {...stroke} />
        <path d="M32 38.5 L35 41 L32 43.5 L29 41 Z" fill={hue} opacity=".7" className="lcd-anim-pulse" style={{ animationDuration: "5s" }} />
        <path d="M18 62 H42" {...dim} />
      </>
    );
  } else if (kind === "wheel") {
    body = (
      <>
        <circle cx="30" cy="44" r="14" {...dim} strokeDasharray="2 3.5" />
        <g className="lcd-anim-spin" style={{ animationDuration: "70s", transformOrigin: "30px 44px" }}>
          <circle cx="30" cy="44" r="11" {...stroke} />
          {Array.from({ length: 8 }, (_, i) => {
            const p = polar(30, 44, 11, i * 45);
            return <line key={i} x1="30" y1="44" x2={p.x} y2={p.y} stroke={hue} strokeWidth=".8" opacity=".8" />;
          })}
          <circle cx="30" cy="44" r="3.5" {...stroke} />
        </g>
        <circle cx="30" cy="44" r="1.3" fill={hue} className="lcd-anim-pulse" style={{ animationDuration: "6s" }} />
      </>
    );
  } else if (kind === "star") {
    const sq = (off: number) =>
      [0, 1, 2, 3]
        .map((i) => polar(30, 42, 10, off + i * 90))
        .map((p) => `${p.x},${p.y}`)
        .join(" ");
    body = (
      <>
        <polygon points={sq(-90)} {...stroke} />
        <polygon points={sq(-45)} {...stroke} opacity=".6" />
        <circle cx="30" cy="42" r="1.6" fill={hue} className="lcd-anim-pulse" style={{ animationDuration: "5s" }} />
        <circle cx="19" cy="29" r=".9" fill={hue} opacity=".7" />
        <circle cx="43" cy="33" r=".7" fill={hue} opacity=".6" />
        <circle cx="40" cy="56" r=".9" fill={hue} opacity=".7" />
        <path d="M18 62 H42" {...dim} strokeDasharray="1.5 3" />
      </>
    );
  } else {
    body = (
      <>
        <rect x="16" y="44" width="5" height="16" {...dim} />
        <rect x="39" y="40" width="5" height="20" {...dim} />
        <path d="M33 25 A7 7 0 1 0 33 39 A5.6 5.6 0 1 1 33 25 Z" fill={hue} opacity=".5" className="lcd-anim-pulse" style={{ animationDuration: "7s" }} />
        <path d="M15 64 q3.5 -2.5 7 0 t7 0 t7 0 t7 0" {...dim} />
        <path d="M19 69 q3.5 -2.5 7 0 t7 0 t7 0" {...dim} opacity=".6" />
      </>
    );
  }
  return <>{body}</>;
}

function CardFace({ s }: { s: Specimen }) {
  return (
    <>
      <defs>
        <radialGradient id={`lcd-cg-${s.num}`} cx="50%" cy="52%" r="55%">
          <stop offset="0%" stopColor={s.glow} />
          <stop offset="100%" stopColor="rgba(22,5,13,0)" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="56" height="80" fill="rgba(22,5,13,.66)" stroke={s.hue} strokeWidth="1" opacity=".95" />
      <rect x="5.5" y="5.5" width="49" height="73" fill="none" stroke="rgba(226,92,128,.3)" strokeWidth=".7" />
      {/* corner ticks */}
      <path d="M2 10 V2 H10 M50 2 H58 V10 M58 74 V82 H50 M10 82 H2 V74" fill="none" stroke={s.hue} strokeWidth="1" opacity=".8" />
      {/* glow field */}
      <ellipse cx="30" cy="44" rx="17" ry="19" fill={`url(#lcd-cg-${s.num})`} className="lcd-anim-pulse" style={{ animationDuration: "8s" }} />
      {/* numeral */}
      <text x="30" y="16.5" textAnchor="middle" fontSize="8.5" letterSpacing="2.5" fill={s.hue} style={{ fontFamily: "ui-monospace,Menlo,Consolas,monospace" }}>
        {s.roman}
      </text>
      <line x1="18" y1="20" x2="42" y2="20" stroke="rgba(226,92,128,.35)" strokeWidth=".6" />
      {/* emblem */}
      <Mark kind={s.mark} hue={s.hue} />
      {/* bottom tick scale */}
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={16 + i * 3.5} y1="74" x2={16 + i * 3.5} y2={i % 4 === 0 ? 70.5 : 72.5} stroke="rgba(226,92,128,.45)" strokeWidth=".6" />
      ))}
      <text x="30" y="80.5" textAnchor="middle" fontSize="4.6" letterSpacing="1.6" fill="#8f4559" style={{ fontFamily: "ui-monospace,Menlo,Consolas,monospace" }}>
        MAJOR ARCANA
      </text>
    </>
  );
}

function MiniCard({ s, w = 58 }: { s: Specimen; w?: number }) {
  return (
    <svg
      viewBox="0 0 60 84"
      aria-hidden
      style={{ width: w, height: "auto", flex: "none", filter: `drop-shadow(0 0 8px ${s.glow})`, transition: "width .4s" }}
    >
      <CardFace s={s} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Background layers                                                   */
/* ------------------------------------------------------------------ */

function BgWheel() {
  const C = 400;
  const ticks = Array.from({ length: 88 }, (_, i) => {
    const long = i % 11 === 0;
    const p1 = polar(C, C, 384, i * (360 / 88));
    const p2 = polar(C, C, long ? 364 : 374, i * (360 / 88));
    return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={long ? "rgba(255,177,92,.7)" : "rgba(226,92,128,.5)"} strokeWidth={long ? 1.4 : .8} />;
  });
  return (
    <svg viewBox="0 0 800 800" style={{ position: "absolute", left: -330, top: "3%", width: 780, height: 780, opacity: .13 }} aria-hidden>
      <g className="lcd-anim-spin" style={{ animationDuration: "180s", transformOrigin: "400px 400px" }}>
        <circle cx={C} cy={C} r="384" fill="none" stroke="rgba(226,92,128,.6)" strokeWidth="1" />
        {ticks}
        <circle cx={C} cy={C} r="330" fill="none" stroke="rgba(255,177,92,.5)" strokeWidth=".8" strokeDasharray="3 7" />
        {ROMANS.map((r, i) => {
          const p = polar(C, C, 300, i * (360 / 22) - 90);
          return (
            <text key={r} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="15" fill={i % 2 === 0 ? "rgba(255,138,60,.85)" : "rgba(196,125,255,.8)"} style={{ fontFamily: "ui-monospace,Menlo,Consolas,monospace" }}>
              {r}
            </text>
          );
        })}
        <ellipse cx={C} cy={C} rx="360" ry="120" transform={`rotate(-18 ${C} ${C})`} fill="none" stroke="rgba(196,125,255,.55)" strokeWidth=".9" strokeDasharray="6 9" />
        <circle cx={C} cy={C} r="210" fill="none" stroke="rgba(226,92,128,.45)" strokeWidth=".7" />
      </g>
    </svg>
  );
}

function BgSeal() {
  const C = 320;
  const pts8 = Array.from({ length: 8 }, (_, i) => polar(C, C, 270, i * 45 - 90));
  const sq1 = [0, 2, 4, 6].map((i) => pts8[i]);
  const sq2 = [1, 3, 5, 7].map((i) => pts8[i]);
  const poly = (pp: { x: number; y: number }[]) => pp.map((p) => `${p.x},${p.y}`).join(" ");
  const seals = ["☿︎", "♀︎", "☽︎", "♃︎", "♅︎", "♍︎", "♒︎", "♓︎"];
  return (
    <svg viewBox="0 0 640 640" style={{ position: "absolute", right: -280, top: "30%", width: 680, height: 680, opacity: .15 }} aria-hidden>
      <g className="lcd-anim-spinr" style={{ animationDuration: "160s", transformOrigin: "320px 320px" }}>
        <circle cx={C} cy={C} r="308" fill="none" stroke="rgba(226,92,128,.55)" strokeWidth="1" />
        <circle cx={C} cy={C} r="270" fill="none" stroke="rgba(255,177,92,.5)" strokeWidth=".8" strokeDasharray="2 6" />
        <polygon points={poly(sq1)} fill="none" stroke="rgba(255,92,140,.7)" strokeWidth="1.2" />
        <polygon points={poly(sq2)} fill="none" stroke="rgba(196,125,255,.65)" strokeWidth="1.2" />
        <circle cx={C} cy={C} r="120" fill="none" stroke="rgba(226,92,128,.45)" strokeWidth=".8" />
        {pts8.map((p, i) => (
          <g key={i}>
            <line x1={p.x} y1={p.y} x2={C} y2={C} stroke="rgba(226,92,128,.3)" strokeWidth=".6" />
            <circle cx={p.x} cy={p.y} r="5" fill="none" stroke="rgba(255,138,60,.7)" strokeWidth="1" />
          </g>
        ))}
        {seals.map((g, i) => {
          const p = polar(C, C, 292, i * 45 - 90);
          return (
            <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="19" fill="rgba(255,177,92,.7)">
              {g}
            </text>
          );
        })}
      </g>
    </svg>
  );
}

function BgConstruction() {
  const crosses: ReactNode[] = [];
  for (let y = 180; y < 3200; y += 260) {
    crosses.push(
      <g key={`c${y}`} stroke="rgba(255,177,92,.35)" strokeWidth=".8">
        <path d={`M68 ${y} h8 M72 ${y - 4} v8`} />
        <path d={`M1364 ${y + 120} h8 M1368 ${y + 116} v8`} />
      </g>,
    );
  }
  return (
    <svg viewBox="0 0 1440 3200" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .55 }} aria-hidden>
      {[72, 420, 1020, 1368].map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="3200" stroke="rgba(226,92,128,.13)" strokeWidth="1" />
      ))}
      {[600, 1060, 1520, 2000, 2500, 2980].map((y, i) => (
        <g key={`h${y}`}>
          <line x1="0" y1={y} x2="1440" y2={y} stroke="rgba(226,92,128,.11)" strokeWidth="1" />
          <text x={i % 2 === 0 ? 90 : 1180} y={y - 8} fontSize="9" letterSpacing="3" fill="rgba(160,88,110,.5)" style={{ fontFamily: "ui-monospace,Menlo,Consolas,monospace" }}>
            {`SHELF ${("0" + (i + 1)).slice(-2)} · ARCANA REF ${(i * 41 + 7) % 78}`}
          </text>
        </g>
      ))}
      <line x1="0" y1="680" x2="1440" y2="1160" stroke="rgba(196,125,255,.08)" strokeWidth="1" />
      <line x1="1440" y1="2040" x2="0" y2="2560" stroke="rgba(196,125,255,.08)" strokeWidth="1" />
      <line x1="0" y1="2820" x2="1440" y2="3120" stroke="rgba(255,177,92,.07)" strokeWidth="1" />
      <circle cx="-90" cy="920" r="300" fill="none" stroke="rgba(226,92,128,.16)" strokeWidth="1" />
      <circle cx="-90" cy="920" r="238" fill="none" stroke="rgba(255,177,92,.12)" strokeWidth=".8" strokeDasharray="3 6" />
      <circle cx="1530" cy="2380" r="360" fill="none" stroke="rgba(226,92,128,.15)" strokeWidth="1" />
      <circle cx="1530" cy="2380" r="292" fill="none" stroke="rgba(196,125,255,.12)" strokeWidth=".8" strokeDasharray="2 6" />
      {crosses}
    </svg>
  );
}

function Background() {
  return (
    <>
      <div className="lcd-bg" aria-hidden>
        <BgWheel />
        <BgSeal />
        {EMBERS.map((e, i) => (
          <span
            key={i}
            className="lcd-ember"
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
      <div className="lcd-bg-page" aria-hidden>
        <BgConstruction />
        {BG_GLYPHS.map((r, i) => (
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
        {SPECKS.map((s, i) => (
          <span
            key={`sp${i}`}
            className="lcd-anim-pulse"
            style={{
              position: "absolute",
              top: `${s.t}%`,
              left: `${s.l}%`,
              width: s.s,
              height: s.s,
              borderRadius: "50%",
              background: "#ffd9e2",
              boxShadow: "0 0 6px rgba(255,217,226,.8)",
              animationDuration: s.dur,
              animationDelay: s.del,
            }}
          />
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Hero apparatus — the great catalogue wheel with a floating specimen */
/* ------------------------------------------------------------------ */

function HeroWheel() {
  const CX = 300;
  const CY = 290;
  const ticks = Array.from({ length: 110 }, (_, i) => {
    const long = i % 11 === 0;
    const p1 = polar(CX, CY, 268, i * (360 / 110));
    const p2 = polar(CX, CY, long ? 254 : 261, i * (360 / 110));
    return <line key={`t${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={long ? "rgba(255,177,92,.5)" : "rgba(226,92,128,.28)"} strokeWidth={long ? 1.1 : 0.6} />;
  });
  const numeralRing = ROMANS.map((r, i) => {
    const p = polar(CX, CY, 228, i * (360 / 22) - 90);
    return (
      <text
        key={r}
        x={p.x}
        y={p.y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={r.length > 2 ? 10 : 13}
        fill={i % 3 === 0 ? "#ffb15c" : "#b06a82"}
        style={{ fontFamily: "ui-monospace,Menlo,Consolas,monospace" }}
      >
        {r}
      </text>
    );
  });
  const diamonds = Array.from({ length: 8 }, (_, i) => {
    const p = polar(CX, CY, 176, i * 45 + 22);
    return <rect key={`d${i}`} x={p.x - 3} y={p.y - 3} width="6" height="6" transform={`rotate(45 ${p.x} ${p.y})`} fill="none" stroke="rgba(255,92,140,.6)" strokeWidth=".8" />;
  });
  const hermit = SPECIMENS[4];
  return (
    <svg viewBox="0 0 600 580" className="w-full h-auto" role="img" aria-label="Catalogue wheel of the twenty-two major arcana">
      <defs>
        <radialGradient id="lcd-hbg" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="rgba(130,20,64,.42)" />
          <stop offset="55%" stopColor="rgba(64,10,36,.18)" />
          <stop offset="100%" stopColor="rgba(22,5,13,0)" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="600" height="580" fill="url(#lcd-hbg)" />

      {/* tilted orbit ellipse */}
      <ellipse cx={CX} cy={CY} rx="272" ry="88" transform={`rotate(-12 ${CX} ${CY})`} fill="none" stroke="rgba(255,92,140,.3)" strokeWidth=".8" strokeDasharray="4 7" className="lcd-anim-flow" style={{ animationDuration: "48s" }} />
      {[0.08, 0.3, 0.55, 0.82].map((t, i) => {
        const a = t * 360;
        const x = CX + 272 * Math.cos(rad(a));
        const y = CY + 88 * Math.sin(rad(a));
        const hues = ["#ff3d6e", "#ffb15c", "#a55cff", "#ff8a3c"];
        return (
          <g key={`o${i}`} transform={`rotate(-12 ${CX} ${CY})`}>
            <circle cx={x} cy={y} r="9" fill={hues[i]} opacity=".18" className="lcd-anim-pulse" style={{ animationDuration: `${7 + i * 3}s` }} />
            <circle cx={x} cy={y} r="4" fill={hues[i]} opacity=".9" />
            <circle cx={x} cy={y} r="1.4" fill="#fff0f2" />
          </g>
        );
      })}

      {/* static tick ring */}
      <circle cx={CX} cy={CY} r="268" fill="none" stroke="rgba(226,92,128,.25)" strokeWidth=".8" />
      {ticks}
      <text x={CX} y={CY - 248} textAnchor="middle" fontSize="8" letterSpacing="4" fill="#a0586e" style={{ fontFamily: "ui-monospace,Menlo,Consolas,monospace" }}>
        CATALOGUE FIELD · 22 TRUMPS
      </text>

      {/* rotating numeral ring */}
      <g className="lcd-anim-spin" style={{ animationDuration: "175s", transformOrigin: "300px 290px" }}>
        <circle cx={CX} cy={CY} r="228" fill="none" stroke="rgba(255,177,92,.3)" strokeWidth=".7" strokeDasharray="2 5" />
        {numeralRing}
      </g>

      {/* counter-rotating diamond ring */}
      <g className="lcd-anim-spinr" style={{ animationDuration: "115s", transformOrigin: "300px 290px" }}>
        <circle cx={CX} cy={CY} r="176" fill="none" stroke="rgba(165,92,255,.35)" strokeWidth=".7" strokeDasharray="10 6" />
        {diamonds}
      </g>

      <circle cx={CX} cy={CY} r="138" fill="none" stroke="rgba(226,92,128,.3)" strokeWidth=".6" />
      <circle cx={CX} cy={CY} r="112" fill="none" stroke="rgba(255,177,92,.22)" strokeWidth=".6" strokeDasharray="1 4" className="lcd-anim-spin" style={{ animationDuration: "95s", transformOrigin: "300px 290px" }} />

      {/* floating specimen — The Hermit, specimen IX */}
      <g className="lcd-anim-bob" style={{ animationDuration: "11s" }}>
        <svg x="252" y="212" width="96" height="134" viewBox="0 0 60 84" style={{ overflow: "visible" }}>
          <CardFace s={hermit} />
        </svg>
        <ellipse cx="300" cy="372" rx="46" ry="8" fill="rgba(255,138,60,.14)" stroke="rgba(255,138,60,.4)" strokeWidth=".7" className="lcd-anim-pulse" style={{ animationDuration: "9s" }} />
      </g>

      {/* crosshair markers */}
      <g stroke="rgba(255,177,92,.55)" strokeWidth=".8" fill="none">
        <path d="M300 22 v14 M293 29 h14" />
        <path d="M300 544 v14 M293 551 h14" />
        <path d="M20 290 h14 M27 283 v14" />
        <path d="M566 290 h14 M573 283 v14" />
      </g>
      <text x="52" y="282" fontSize="8" letterSpacing="3" fill="#8f4559" style={{ fontFamily: "ui-monospace,Menlo,Consolas,monospace" }}>SPEC. IX</text>
      <text x="52" y="308" fontSize="8" letterSpacing="3" fill="#8f4559" style={{ fontFamily: "ui-monospace,Menlo,Consolas,monospace" }}>LANTERN · LIT</text>
      <text x="508" y="52" fontSize="8" letterSpacing="2" fill="#8f4559" style={{ fontFamily: "ui-monospace,Menlo,Consolas,monospace" }}>22 / 78</text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Specimen — expandable cabinet cell                                  */
/* ------------------------------------------------------------------ */

function SpecimenCell({ s, dirt, open, anyOpen, onToggle }: { s: Specimen; dirt: string; open: boolean; anyOpen: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className={`lcd-spec ${open ? "lcd-open" : ""} ${anyOpen && !open ? "lcd-dim" : ""}`}
      style={{ transform: open ? "none" : dirt, gridColumn: open ? "1 / -1" : undefined }}
      onClick={onToggle}
      aria-expanded={open}
    >
      <CornerTicks c={open ? "rgba(255,177,92,.65)" : "rgba(255,92,140,.4)"} />
      {/* cell head */}
      <span className="flex items-center justify-between gap-2 px-3 pt-2.5">
        <span className="lcd-caps-sm lcd-mono" style={{ color: "#8f4559", fontSize: 7.5 }}>
          SPEC. {s.roman} · MAJOR
        </span>
        <span className="flex items-center gap-1.5">
          <span className="lcd-hdot lcd-anim-pulse" style={{ width: 4, height: 4, background: s.hue, boxShadow: `0 0 5px ${s.hue}`, animationDuration: "5s" }} />
          <span className="lcd-mono" style={{ fontSize: 11, color: s.hue, textShadow: `0 0 8px ${s.glow}`, transition: "transform .3s", transform: open ? "rotate(45deg)" : "none" }}>
            +
          </span>
        </span>
      </span>
      {/* specimen body */}
      <span className={open ? "flex items-start gap-5 px-4 pt-3 sm:px-5" : "flex flex-col items-center gap-2 px-3 pb-3 pt-2"}>
        <MiniCard s={s} w={open ? 84 : 58} />
        {open ? (
          <span className="block pt-1">
            <span className="lcd-engrave block" style={{ fontSize: 8 }}>SPECIMEN {s.roman} — UNSEALED</span>
            <span className="lcd-caps mt-2 block" style={{ fontSize: 17, color: "#ffeef2", marginTop: 8 }}>
              {s.card.name}
            </span>
            <span className="lcd-mono mt-1.5 block" style={{ fontSize: 10.5, color: s.hue, textShadow: `0 0 9px ${s.glow}`, marginTop: 6 }}>
              {s.card.astrology} {s.glyph} · {s.card.element}
            </span>
          </span>
        ) : (
          <>
            <span className="lcd-caps" style={{ fontSize: 10.5, color: "#f3d3dc", letterSpacing: ".18em" }}>
              {s.card.name}
            </span>
            <span className="lcd-caps-sm lcd-mono" style={{ color: "#6e3a4a", fontSize: 7 }}>
              {s.card.keywords.join(" · ")}
            </span>
          </>
        )}
      </span>
      {/* detail plate — unfolds in place */}
      <span className={`lcd-plate ${open ? "lcd-plate-open" : ""}`}>
        <span>
          <span className="block px-4 pb-4 pt-1 sm:px-5" style={{ borderTop: open ? "1px solid rgba(226,92,128,.16)" : "none" }}>
            <span className="mt-3 flex flex-wrap gap-1.5" style={{ marginTop: 12 }}>
              {s.card.keywords.map((k) => (
                <span key={k} className="lcd-kw">
                  <span className="lcd-hdot" style={{ width: 3, height: 3, background: s.hue, boxShadow: `0 0 4px ${s.hue}` }} />
                  <span className="lcd-caps-sm lcd-mono" style={{ color: "#cf93a6", fontSize: 8 }}>{k}</span>
                </span>
              ))}
            </span>
            <span className="lcd-engrave mt-4 block" style={{ marginTop: 14 }}>Upright reading</span>
            <span className="mt-2 block" style={{ fontSize: 13.5, lineHeight: 1.75, color: "#d5a0b0", maxWidth: 560, marginTop: 8 }}>
              {s.card.upright}
            </span>
            <span className="mt-2 block" style={{ fontSize: 12, lineHeight: 1.7, color: "#a06a7c", fontStyle: "italic", maxWidth: 520, marginTop: 8 }}>
              Mission: {s.card.mission}
            </span>
            <span className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2" style={{ borderTop: "1px solid rgba(226,92,128,.14)", paddingTop: 10, marginTop: 14 }}>
              {[
                { k: "ARCANA NO", v: s.roman },
                { k: "ELEMENT", v: s.card.element.toUpperCase() },
                { k: "RULER", v: `${s.card.astrology.toUpperCase()} ${s.glyph}` },
                { k: "CHAMBER", v: "MAJOR · 22" },
              ].map((r) => (
                <span key={r.k} className="flex items-center gap-2">
                  <span className="lcd-caps-sm lcd-mono" style={{ color: "#6e3a4a", fontSize: 7.5 }}>{r.k}</span>
                  <span className="lcd-mono" style={{ fontSize: 10, color: s.hue, textShadow: `0 0 7px ${s.glow}` }}>{r.v}</span>
                </span>
              ))}
              <span className="lcd-rule" style={{ flex: 1, minWidth: 24 }} />
              <span className="lcd-caps-sm lcd-mono" style={{ color: "#8f4559", fontSize: 7.5 }}>CLICK TO RESEAL</span>
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Cabinet drawer map — 78 cells, 8 catalogued                         */
/* ------------------------------------------------------------------ */

function DrawerMap() {
  const cols = 13;
  const rows = 6;
  const cw = 20;
  const ch = 26;
  const gap = 4;
  return (
    <svg viewBox={`0 0 ${cols * (cw + gap) + gap} ${rows * (ch + gap) + gap + 18}`} className="w-full h-auto" role="img" aria-label="Cabinet drawer map: eight of seventy-eight cells catalogued">
      {Array.from({ length: rows * cols }, (_, i) => {
        const x = gap + (i % cols) * (cw + gap);
        const y = gap + Math.floor(i / cols) * (ch + gap);
        const lit = i < 8;
        const hue = lit ? SPECIMENS[i].hue : "rgba(226,92,128,.3)";
        return (
          <g key={i}>
            <rect
              className="lcd-drawer-cell"
              x={x}
              y={y}
              width={cw}
              height={ch}
              fill={lit ? "rgba(22,5,13,.85)" : "rgba(22,5,13,.4)"}
              stroke={hue}
              strokeWidth={lit ? 1 : 0.6}
            />
            {lit ? (
              <>
                <rect x={x + 3.5} y={y + 3.5} width={cw - 7} height={ch - 7} fill="none" stroke={hue} strokeWidth=".5" opacity=".6" />
                <circle cx={x + cw / 2} cy={y + ch / 2} r="2" fill={hue} className="lcd-anim-pulse" style={{ animationDuration: `${5 + i}s` }} />
                <text x={x + cw / 2} y={y + 10} textAnchor="middle" fontSize="5" fill={hue} style={{ fontFamily: "ui-monospace,Menlo,Consolas,monospace" }}>
                  {SPECIMENS[i].roman}
                </text>
              </>
            ) : (
              <line x1={x + cw / 2} y1={y + ch / 2 - 2.5} x2={x + cw / 2} y2={y + ch / 2 + 2.5} stroke="rgba(226,92,128,.22)" strokeWidth=".6" />
            )}
          </g>
        );
      })}
      <text x={gap} y={rows * (ch + gap) + gap + 11} fontSize="8" letterSpacing="3" fill="#8f4559" style={{ fontFamily: "ui-monospace,Menlo,Consolas,monospace" }}>
        DRAWER MAP · 78 CELLS
      </text>
      <text x={cols * (cw + gap) + gap} y={rows * (ch + gap) + gap + 11} textAnchor="end" fontSize="8" letterSpacing="2" fill="#ffb15c" style={{ fontFamily: "ui-monospace,Menlo,Consolas,monospace" }}>
        8 LIT
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function TarotCardsPage() {
  const [openNum, setOpenNum] = useState<number | null>(null);

  return (
    <main className="lcd-root min-h-screen">
      <style>{CSS}</style>

      {/* deep background: wheels, seals, construction lines, embers, specks */}
      <Background />

      {/* dust-noise + fine-scratch overlays, fixed above the whole page */}
      <div className="lcd-grime-noise" aria-hidden />
      <div className="lcd-scratches" aria-hidden />

      <div className="relative" style={{ zIndex: 1 }}>
        {/* ============================================================ */}
        {/* 1 · TOP BAR — full bleed                                      */}
        {/* ============================================================ */}
        <header className="lcd-panel" style={{ borderLeft: "none", borderRight: "none", borderTop: "none" }}>
          <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
            <span className="lcd-hdot" />
            <a href="#" className="lcd-caps lcd-mono" style={{ fontSize: 12, color: "#ffd9e2", textShadow: "0 0 10px rgba(255,61,110,.6)", textDecoration: "none" }}>
              ASTRO SCOPE
            </a>
            <span className="lcd-caps-sm lcd-mono hidden md:inline" style={{ color: "#8f4559" }}>TAROT DIVISION · UNIT 78</span>
            <span className="lcd-rule" style={{ flex: 1 }} />
            <nav className="flex items-center gap-4 sm:gap-6">
              {["DECK", "SPREADS", "DAILY CARD"].map((n) => (
                <a key={n} href="#" className="lcd-caps-sm lcd-mono hidden sm:inline" style={{ color: "#cf93a6", textDecoration: "none" }}>
                  {n}
                </a>
              ))}
              <a href="#" className="lcd-btn-ghost" style={{ padding: "7px 14px" }}>
                SIGN IN
              </a>
            </nav>
          </div>
          <div className="lcd-ticks" />
        </header>

        {/* ============================================================ */}
        {/* 2 · HERO — catalogue wheel bleeds off the right edge          */}
        {/* ============================================================ */}
        <section className="relative">
          <div className="pointer-events-none absolute hidden lg:block" style={{ left: "50%", top: 40, bottom: 40, width: 1, background: "rgba(226,92,128,.14)" }} aria-hidden />
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:pt-20">
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="lcd-hdot" />
                <span className="lcd-caps lcd-mono" style={{ fontSize: 11, color: "#ff8aa8", textShadow: "0 0 10px rgba(255,61,110,.7)" }}>
                  SPECIMEN CATALOGUE
                </span>
                <span className="lcd-rule" style={{ width: 60 }} />
                <span className="lcd-caps-sm lcd-mono" style={{ color: "#8f4559" }}>FIRST DISTILLATION</span>
              </div>

              <h1 className="mt-7" style={{ fontSize: "clamp(34px, 5vw, 58px)", lineHeight: 1.08, color: "#ffeef2", fontWeight: 400, transform: "rotate(-.5deg)", transformOrigin: "left center" }}>
                The cabinet of seventy-eight —{" "}
                <em style={{ color: "#ff5c85", textShadow: "0 0 22px rgba(255,61,110,.75)", fontStyle: "italic" }}>
                  first specimens.
                </em>
              </h1>

              <p className="mt-6 max-w-md" style={{ fontSize: 16, lineHeight: 1.75, color: "#d5a0b0" }}>
                Seventy-eight cards make the full deck: twenty-two trumps for the grand lessons, fifty-six minors for the
                everyday weather. Eight specimens have passed inspection and glow on the shelf. The rest are still in the retorts.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a href="#lcd-cabinet" className="lcd-btn" style={{ textDecoration: "none" }}>
                  <span className="lcd-hdot" style={{ background: "#ffd9e2", boxShadow: "0 0 6px #ffd9e2" }} />
                  OPEN THE CABINET ↓
                </a>
                <a href="#" className="lcd-btn-ghost" style={{ textDecoration: "none" }}>
                  PULL A DAILY CARD →
                </a>
              </div>

              {/* hero micro-readouts — tilted, wider than the column */}
              <div
                className="lcd-panel mt-11 grid grid-cols-3 divide-x"
                style={{ borderColor: "rgba(226,92,128,.2)", transform: "rotate(.5deg)", width: "calc(100% + 56px)", marginLeft: -14 }}
              >
                <PanelGrime v={0} />
                {[
                  { k: "SPECIMENS LIT", v: "8 / 78", h: "#ff5c85" },
                  { k: "MAJOR ARCANA", v: "22 TRUMPS", h: "#ffb15c" },
                  { k: "CABINET FIELD", v: "STABLE", h: "#c47dff" },
                ].map((r) => (
                  <div key={r.k} className="px-4 py-3" style={{ borderColor: "rgba(226,92,128,.16)" }}>
                    <div className="lcd-caps-sm" style={{ color: "#8f4559" }}>{r.k}</div>
                    <div className="lcd-mono mt-1" style={{ fontSize: 15, color: r.h, textShadow: `0 0 9px ${r.h}` }}>{r.v}</div>
                  </div>
                ))}
              </div>
              <div className="lcd-ticks mt-1" style={{ opacity: .5, width: "80%" }} />
            </div>

            <div className="lcd-hero-bleed">
              <CornerTicks />
              <HeroWheel />
              <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2">
                <span className="lcd-hdot lcd-anim-pulse" style={{ animationDuration: "4s" }} />
                <span className="lcd-caps-sm lcd-mono" style={{ color: "#a0586e" }}>CATALOGUE WHEEL · TURNING</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3 · THE CABINET — jutting panel, cells cross the borders      */}
        {/* ============================================================ */}
        <section id="lcd-cabinet" className="mx-auto max-w-6xl scroll-mt-8 px-4 pb-20 sm:px-6">
          <div className="lcd-panel" style={{ margin: "0 -24px", transform: "rotate(-.35deg)" }}>
            <PanelHead title="Specimen Cabinet" right="MAJOR ARCANA · 8 / 22 CATALOGUED" />
            <PanelGrime v={1} />

            {/* wax seal straddling the cabinet's top-right corner */}
            <div className="pointer-events-none absolute" style={{ top: -38, right: 22, transform: "rotate(9deg)", zIndex: 4 }} aria-hidden>
              <svg width="92" height="92" viewBox="0 0 92 92" className="lcd-anim-spin" style={{ animationDuration: "120s", transformOrigin: "46px 46px" }}>
                <defs>
                  <path id="lcd-sealp" d="M46 46 m-31 0 a31 31 0 1 1 62 0 a31 31 0 1 1 -62 0" />
                </defs>
                <circle cx="46" cy="46" r="42" fill="rgba(22,5,13,.92)" stroke="rgba(255,92,140,.55)" strokeWidth="1" />
                <circle cx="46" cy="46" r="38" fill="none" stroke="rgba(255,177,92,.35)" strokeWidth=".7" strokeDasharray="2 4" />
                <text fontSize="7" letterSpacing="2.2" fill="#ff8aa8" style={{ fontFamily: "ui-monospace,Menlo,Consolas,monospace" }}>
                  <textPath href="#lcd-sealp">FIRST DISTILLATION · HANDLE WITH CARE ·</textPath>
                </text>
                <text x="46" y="51" textAnchor="middle" fontSize="13" letterSpacing="1" fill="#ffb15c" style={{ fontFamily: "ui-monospace,Menlo,Consolas,monospace" }}>VIII</text>
              </svg>
            </div>

            {/* shelf label straddling the panel's left border */}
            <span
              className="lcd-engrave absolute hidden sm:block"
              style={{ top: "50%", left: -9, transform: "rotate(-90deg) translateX(50%)", transformOrigin: "left center", background: "#1a0710", padding: "2px 10px", zIndex: 3 }}
            >
              SHELF A · TRUMPS
            </span>

            <div className="relative grid grid-cols-2 gap-3 p-4 pt-6 sm:grid-cols-4 sm:p-6 sm:pt-7" style={{ marginTop: -26, zIndex: 2 }}>
              {SPECIMENS.map((s, i) => (
                <SpecimenCell
                  key={s.num}
                  s={s}
                  dirt={SPEC_DIRT[i]}
                  open={openNum === s.num}
                  anyOpen={openNum !== null}
                  onToggle={() => setOpenNum(openNum === s.num ? null : s.num)}
                />
              ))}
            </div>

            <div className="flex items-center gap-3 px-4 pb-3 sm:px-6">
              <span className="lcd-caps-sm lcd-mono" style={{ color: "#8f4559" }}>CATALOGUING</span>
              <div className="lcd-bar" style={{ flex: 1 }}>
                <i className="lcd-anim-pulse" style={{ width: "10.3%", animationDuration: "9s" }} />
              </div>
              <span className="lcd-mono" style={{ fontSize: 11, color: "#ffb15c", textShadow: "0 0 8px rgba(255,138,60,.7)" }}>10.3%</span>
            </div>
            <div className="lcd-ticks mx-4 mb-3 sm:mx-6" style={{ opacity: .45 }} />
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4 · NOTE — full cabinet in preparation, full bleed            */}
        {/* ============================================================ */}
        <section className="lcd-panel" style={{ borderLeft: "none", borderRight: "none" }}>
          <PanelGrime v={0} />
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_.95fr]">
            <div style={{ transform: "rotate(-.3deg)" }}>
              <div className="flex items-center gap-3">
                <span className="lcd-hdot" style={{ background: "#ffb15c", boxShadow: "0 0 6px #ffb15c" }} />
                <span className="lcd-caps lcd-mono" style={{ fontSize: 11, color: "#ffb15c", textShadow: "0 0 10px rgba(255,138,60,.7)" }}>
                  LABORATORY NOTE
                </span>
                <span className="lcd-rule" style={{ width: 48 }} />
                <span className="lcd-caps-sm lcd-mono" style={{ color: "#8f4559" }}>ENTRY 04 / ONGOING</span>
              </div>
              <h2 className="mt-5" style={{ fontSize: "clamp(24px, 3.2vw, 38px)", lineHeight: 1.15, color: "#ffeef2", fontWeight: 400, margin: 0, marginTop: 18 }}>
                The full cabinet is in preparation.
              </h2>
              <p className="mt-4 max-w-lg" style={{ fontSize: 15, lineHeight: 1.75, color: "#d5a0b0" }}>
                Seventy cells remain unlit. Every card — trump, pip and court — is being weighed, annotated and sealed one
                distillation at a time. When the last drawer closes, all seventy-eight will open for browsing, upright and reversed.
              </p>
              <div className="mt-5 grid max-w-md grid-cols-2 gap-2">
                {["22 MAJOR TRUMPS", "56 MINOR PIPS + COURT", "4 SUITS · 4 ELEMENTS", "UPRIGHT + REVERSED"].map((t) => (
                  <div key={t} className="flex items-center gap-2" style={{ border: "1px solid rgba(226,92,128,.16)", padding: "6px 10px", background: "rgba(22,5,13,.5)" }}>
                    <span className="lcd-hdot" style={{ width: 4, height: 4 }} />
                    <span className="lcd-caps-sm lcd-mono" style={{ color: "#cf93a6", fontSize: 8 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-md" style={{ transform: "translateX(6%) rotate(1.2deg)" }}>
              <CornerTicks c="rgba(255,177,92,.5)" />
              <DrawerMap />
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5 · FAQ — CATALOGUE NOTES, staggered off-center               */}
        {/* ============================================================ */}
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:ml-[8%]">
          <div className="mb-6 flex items-center gap-4">
            <span className="lcd-hdot" />
            <h2 className="lcd-caps" style={{ fontSize: 14, color: "#ffeef2", margin: 0 }}>Catalogue Notes</h2>
            <span className="lcd-rule" style={{ flex: 1 }} />
            <span className="lcd-caps-sm lcd-mono" style={{ color: "#8f4559" }}>3 ENTRIES</span>
          </div>
          <div className="flex flex-col gap-3">
            {FAQ.map((f, i) => (
              <details key={f.id} className="lcd-faq" style={FAQ_DIRT[i]}>
                <summary>
                  <span className="lcd-caps-sm lcd-mono" style={{ color: "#8f4559", whiteSpace: "nowrap" }}>{f.id}</span>
                  <span style={{ fontSize: 15, color: "#f3d3dc", flex: 1 }}>{f.q}</span>
                  <span className="lcd-faq-x lcd-mono" style={{ color: "#ff5c85", fontSize: 14, textShadow: "0 0 8px rgba(255,61,110,.7)" }}>+</span>
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
        <section className="lcd-panel" style={{ borderLeft: "none", borderRight: "none" }}>
          <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
            <CornerTicks />
            <PanelGrime v={1} />
            <div className="lcd-ticks mx-auto mb-8" style={{ width: 180, opacity: .6 }} />
            <h2 style={{ fontSize: "clamp(26px, 4vw, 44px)", lineHeight: 1.2, color: "#ffeef2", fontWeight: 400, margin: 0 }}>
              The deck is warm.
              <br />
              <em style={{ color: "#ffb15c", textShadow: "0 0 20px rgba(255,138,60,.7)" }}>One card a day is enough to start.</em>
            </h2>
            <p className="mx-auto mt-5 max-w-md" style={{ fontSize: 14.5, lineHeight: 1.75, color: "#d5a0b0" }}>
              Pull a daily card while the cabinet fills — every draw is weighed, recorded and read back to you plainly.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <a href="#" className="lcd-btn" style={{ textDecoration: "none", fontSize: 11, padding: "13px 30px" }}>
                <span className="lcd-hdot" style={{ background: "#ffd9e2", boxShadow: "0 0 6px #ffd9e2" }} />
                PULL YOUR DAILY CARD
              </a>
              <a href="#" className="lcd-btn-ghost" style={{ textDecoration: "none" }}>
                BROWSE TAROT SPREADS →
              </a>
            </div>
            <div className="lcd-ticks mx-auto mt-8" style={{ width: 180, opacity: .6 }} />
          </div>
        </section>

        {/* ============================================================ */}
        {/* 7 · FOOTER — lab status strip juts wider than the column      */}
        {/* ============================================================ */}
        <footer className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="lcd-panel" style={{ margin: "0 -22px", transform: "rotate(.3deg)" }}>
            <PanelGrime v={0} />
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5">
              {[
                { k: "CABINET", v: "SEALED", h: "#ff5c85" },
                { k: "SPECIMENS", v: "8/78", h: "#ffb15c" },
                { k: "SUITS", v: "4 CALIBRATED", h: "#c47dff" },
                { k: "FIELD", v: "STABLE", h: "#ff8a3c" },
                { k: "DISTILLATION", v: "10.3%", h: "#ff8aa8" },
              ].map((s) => (
                <span key={s.k} className="flex items-center gap-2">
                  <span className="lcd-hdot lcd-anim-pulse" style={{ width: 4, height: 4, background: s.h, boxShadow: `0 0 5px ${s.h}`, animationDuration: "6s" }} />
                  <span className="lcd-caps-sm lcd-mono" style={{ color: "#8f4559", fontSize: 8 }}>{s.k}</span>
                  <span className="lcd-mono" style={{ fontSize: 10, color: s.h, textShadow: `0 0 7px ${s.h}` }}>{s.v}</span>
                </span>
              ))}
              <span className="lcd-rule" style={{ flex: 1, minWidth: 30 }} />
              <span className="lcd-caps-sm lcd-mono lcd-anim-flicker" style={{ color: "#a0586e", animationDuration: "9s", fontSize: 8 }}>
                LAB STATUS · CATALOGUING IN PROGRESS
              </span>
            </div>
          </div>
          <div className="lcd-ticks mt-1" style={{ opacity: .4 }} />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="lcd-caps-sm lcd-mono" style={{ color: "#6e3a4a", fontSize: 8 }}>© ASTRO SCOPE · TAROT DIVISION</span>
            <span className="lcd-caps-sm lcd-mono" style={{ color: "#6e3a4a", fontSize: 8 }}>CATALOGUE LOG · SHELF A · VOL. I</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
