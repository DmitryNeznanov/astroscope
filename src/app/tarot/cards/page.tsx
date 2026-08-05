"use client";

import Link from "next/link";
import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { getArcana } from "@/lib/arcana";
import type { ArcanaCard } from "@/lib/arcana";

/* ------------------------------------------------------------------ */
/* Production palette (from lab/remix-v2)                              */
/* ------------------------------------------------------------------ */

const INK = "#0a0912"; // rgb(10,9,18) — page background
const GOLD = "#f3c77a"; // accent primary
const GOLD_DEEP = "#c9a227"; // hairlines
const CREAM = "#ffdd9c"; // accent tertiary
const EMBER = "#e39a4c"; // warm secondary
const VIOLET = "#a25adf";
const VIOLET_SOFT = "#b794f6";
const TEXT_HI = "#e9e6f2";
const TEXT_LO = "#b7b1cc";

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
/* Cross-navigation — all seven tarot pages                            */
/* ------------------------------------------------------------------ */

const NAV: { href: string; label: string; active?: boolean }[] = [
  { href: "/tarot", label: "HUB" },
  { href: "/tarot/spreads/daily-card", label: "DAILY CARD" },
  { href: "/tarot/spreads/yes-no", label: "YES / NO" },
  { href: "/tarot/spreads/past-present-future", label: "P·P·F" },
  { href: "/tarot/spreads/love-three-card", label: "LOVE ×3" },
  { href: "/tarot/birth-arcana", label: "BIRTH ARCANA" },
  { href: "/tarot/cards", label: "CARDS", active: true },
  { href: "/tarot/destiny-matrix", label: "MATRIX" },
];

const TAB_DIRT = [
  "rotate(-.6deg)",
  "translateY(1px) rotate(.4deg)",
  "rotate(-.3deg)",
  "translateY(-1px) rotate(.5deg)",
  "rotate(-.5deg)",
  "translateY(1px) rotate(.3deg)",
  "rotate(-.4deg)",
];

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
  { num: 22, hue: VIOLET_SOFT, glow: "rgba(162,90,223,.5)", glyph: "♅︎", mark: "fool" },
  { num: 1, hue: GOLD, glow: "rgba(243,199,122,.5)", glyph: "☿︎", mark: "magician" },
  { num: 2, hue: VIOLET, glow: "rgba(162,90,223,.45)", glyph: "☽︎", mark: "priestess" },
  { num: 3, hue: EMBER, glow: "rgba(227,154,76,.45)", glyph: "♀︎", mark: "empress" },
  { num: 9, hue: CREAM, glow: "rgba(255,221,156,.4)", glyph: "♍︎", mark: "hermit" },
  { num: 10, hue: GOLD_DEEP, glow: "rgba(243,199,122,.45)", glyph: "♃︎", mark: "wheel" },
  { num: 17, hue: VIOLET_SOFT, glow: "rgba(183,148,246,.5)", glyph: "♒︎", mark: "star" },
  { num: 18, hue: VIOLET, glow: "rgba(162,90,223,.45)", glyph: "♓︎", mark: "moon" },
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
  { l: 4, s: 3, c: GOLD, dur: "34s", del: "-8s" },
  { l: 11, s: 2, c: VIOLET_SOFT, dur: "46s", del: "-30s" },
  { l: 18, s: 4, c: EMBER, dur: "28s", del: "-17s" },
  { l: 26, s: 2, c: VIOLET, dur: "52s", del: "-41s" },
  { l: 33, s: 3, c: GOLD, dur: "38s", del: "-5s" },
  { l: 41, s: 2, c: CREAM, dur: "57s", del: "-49s" },
  { l: 49, s: 3, c: EMBER, dur: "31s", del: "-22s" },
  { l: 57, s: 2, c: VIOLET_SOFT, dur: "43s", del: "-12s" },
  { l: 64, s: 4, c: VIOLET, dur: "26s", del: "-3s" },
  { l: 71, s: 2, c: GOLD, dur: "49s", del: "-36s" },
  { l: 78, s: 3, c: CREAM, dur: "36s", del: "-26s" },
  { l: 85, s: 2, c: EMBER, dur: "54s", del: "-15s" },
  { l: 91, s: 3, c: VIOLET_SOFT, dur: "41s", del: "-33s" },
  { l: 96, s: 2, c: GOLD, dur: "29s", del: "-9s" },
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
  { ch: "☿︎", top: "6%", left: "55%", size: 240, rot: -8, c: "rgba(183,148,246,.05)" },
  { ch: "♃︎", top: "22%", left: "1%", size: 210, rot: 6, c: "rgba(243,199,122,.045)" },
  { ch: "☽︎", top: "40%", right: "2%", size: 280, rot: -5, c: "rgba(162,90,223,.05)" },
  { ch: "♅︎", top: "57%", left: "42%", size: 230, rot: 9, c: "rgba(243,199,122,.04)" },
  { ch: "♀︎", top: "73%", right: "13%", size: 200, rot: -11, c: "rgba(227,154,76,.045)" },
  { ch: "♓︎", top: "88%", left: "6%", size: 240, rot: 4, c: "rgba(183,148,246,.045)" },
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
      { cx: 4, cy: 88, rx: 14, ry: 10, c: "rgba(4,3,9,.46)" },
      { cx: 7, cy: 86, rx: 8, ry: 5, c: "rgba(80,58,140,.15)" },
      { cx: 96, cy: 12, rx: 10, ry: 7, c: "rgba(40,28,80,.4)" },
      { cx: 94, cy: 90, rx: 12, ry: 8, c: "rgba(150,110,30,.12)" },
    ],
    drips: [
      { x: 92, y: 2, len: 16, c: "rgba(160,120,40,.26)" },
      { x: 96.5, y: 1, len: 9, c: "rgba(90,60,160,.3)" },
      { x: 6, y: 70, len: 12, c: "rgba(160,120,40,.2)" },
    ],
    specks: [
      { x: 14, y: 22, r: 0.5, c: "rgba(0,0,0,.5)" },
      { x: 21, y: 64, r: 0.35, c: "rgba(243,199,122,.2)" },
      { x: 34, y: 12, r: 0.45, c: "rgba(0,0,0,.42)" },
      { x: 47, y: 88, r: 0.3, c: "rgba(183,148,246,.16)" },
      { x: 58, y: 30, r: 0.5, c: "rgba(0,0,0,.45)" },
      { x: 66, y: 74, r: 0.35, c: "rgba(0,0,0,.4)" },
      { x: 78, y: 18, r: 0.4, c: "rgba(243,199,122,.18)" },
      { x: 86, y: 52, r: 0.5, c: "rgba(0,0,0,.48)" },
      { x: 30, y: 46, r: 0.3, c: "rgba(0,0,0,.38)" },
      { x: 71, y: 93, r: 0.4, c: "rgba(243,199,122,.15)" },
      { x: 9, y: 41, r: 0.35, c: "rgba(0,0,0,.4)" },
      { x: 90, y: 77, r: 0.3, c: "rgba(0,0,0,.36)" },
    ],
  },
  {
    stains: [
      { cx: 92, cy: 86, rx: 13, ry: 9, c: "rgba(4,3,9,.44)" },
      { cx: 89, cy: 84, rx: 7, ry: 4, c: "rgba(80,58,140,.16)" },
      { cx: 6, cy: 14, rx: 9, ry: 6, c: "rgba(40,28,80,.38)" },
      { cx: 50, cy: 97, rx: 16, ry: 5, c: "rgba(4,3,9,.32)" },
    ],
    drips: [
      { x: 8, y: 3, len: 13, c: "rgba(90,60,160,.28)" },
      { x: 88, y: 68, len: 14, c: "rgba(160,120,40,.24)" },
      { x: 46, y: 84, len: 8, c: "rgba(160,120,40,.18)" },
    ],
    specks: [
      { x: 12, y: 58, r: 0.45, c: "rgba(0,0,0,.46)" },
      { x: 26, y: 26, r: 0.3, c: "rgba(243,199,122,.18)" },
      { x: 38, y: 71, r: 0.5, c: "rgba(0,0,0,.42)" },
      { x: 52, y: 16, r: 0.35, c: "rgba(0,0,0,.44)" },
      { x: 63, y: 49, r: 0.4, c: "rgba(183,148,246,.16)" },
      { x: 74, y: 82, r: 0.3, c: "rgba(0,0,0,.4)" },
      { x: 83, y: 34, r: 0.5, c: "rgba(0,0,0,.45)" },
      { x: 19, y: 87, r: 0.35, c: "rgba(243,199,122,.15)" },
      { x: 43, y: 39, r: 0.3, c: "rgba(0,0,0,.36)" },
      { x: 94, y: 61, r: 0.4, c: "rgba(0,0,0,.4)" },
      { x: 68, y: 8, r: 0.3, c: "rgba(243,199,122,.17)" },
      { x: 31, y: 93, r: 0.35, c: "rgba(0,0,0,.38)" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Scoped styles                                                       */
/* ------------------------------------------------------------------ */

const CSS = `
.lcd-root { background:${INK}; color:${TEXT_LO}; font-family:Georgia,'Times New Roman',serif; position:relative; overflow-x:clip; }
.lcd-mono { font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace; }
.lcd-caps { text-transform:uppercase; letter-spacing:.24em; }
.lcd-caps-sm { text-transform:uppercase; letter-spacing:.2em; font-size:9px; }
.lcd-bg { position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
.lcd-bg-page { position:absolute; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
.lcd-panel {
  background:linear-gradient(160deg, rgba(26,20,48,.88), rgba(13,10,24,.95));
  border:1px solid rgba(201,162,39,.2);
  box-shadow:inset 0 0 0 1px rgba(0,0,0,.55), inset 0 0 36px rgba(70,45,140,.22), 0 0 26px rgba(0,0,0,.5);
  position:relative;
}
.lcd-panel::before {
  content:""; position:absolute; inset:4px; pointer-events:none;
  border:1px solid rgba(201,162,39,.09);
}
.lcd-header {
  display:flex; align-items:center; gap:8px;
  border-bottom:1px solid rgba(201,162,39,.16);
  padding:7px 12px;
}
.lcd-hdot { width:5px; height:5px; transform:rotate(45deg); background:${GOLD}; box-shadow:0 0 6px ${GOLD}; flex:none; }
.lcd-htext { font-size:10px; letter-spacing:.28em; color:${TEXT_HI}; text-transform:uppercase; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.lcd-rule { height:1px; background:linear-gradient(90deg, rgba(201,162,39,.42), rgba(201,162,39,.05)); }
.lcd-ticks { background-image:repeating-linear-gradient(90deg, rgba(201,162,39,.36) 0 1px, transparent 1px 8px); height:5px; }
.lcd-ticks-v { background-image:repeating-linear-gradient(0deg, rgba(201,162,39,.4) 0 1px, transparent 1px 7px); width:5px; }
.lcd-engrave {
  text-transform:uppercase; letter-spacing:.4em; font-size:10px; color:#6f6a8c;
  text-shadow:0 1px 0 rgba(0,0,0,.8), 0 -1px 0 rgba(243,199,122,.08);
}
.lcd-btn {
  display:inline-flex; align-items:center; gap:10px;
  background:linear-gradient(180deg, rgba(243,199,122,.24), rgba(150,105,25,.42));
  border:1px solid rgba(243,199,122,.62); color:${CREAM};
  text-transform:uppercase; letter-spacing:.26em; font-size:10px;
  padding:11px 22px; box-shadow:0 0 20px rgba(243,199,122,.3), inset 0 0 14px rgba(243,199,122,.2);
  transition:box-shadow .3s;
}
.lcd-btn:hover { box-shadow:0 0 32px rgba(243,199,122,.55), inset 0 0 18px rgba(243,199,122,.34); }
.lcd-btn-ghost {
  display:inline-flex; align-items:center; gap:8px;
  border:1px solid rgba(162,90,223,.42); color:#d3befc;
  text-transform:uppercase; letter-spacing:.24em; font-size:10px;
  padding:11px 18px; background:rgba(162,90,223,.07);
  box-shadow:inset 0 0 12px rgba(162,90,223,.12);
  transition:box-shadow .3s, border-color .3s;
}
.lcd-btn-ghost:hover { border-color:rgba(183,148,246,.75); box-shadow:0 0 18px rgba(162,90,223,.3), inset 0 0 14px rgba(162,90,223,.2); }
.lcd-tab {
  display:inline-flex; align-items:center;
  border:1px solid rgba(201,162,39,.2); background:rgba(18,14,32,.72);
  color:#a39dc4; text-transform:uppercase; letter-spacing:.16em; font-size:9px;
  padding:6px 11px; text-decoration:none; white-space:nowrap;
  transition:border-color .3s, color .3s, box-shadow .3s;
}
.lcd-tab:hover { border-color:rgba(243,199,122,.55); color:${CREAM}; box-shadow:0 0 12px rgba(243,199,122,.16); }
.lcd-tab-active, .lcd-tab-active:hover {
  border-color:rgba(243,199,122,.8); color:${CREAM};
  background:rgba(243,199,122,.1);
  box-shadow:0 0 14px rgba(243,199,122,.28), inset 0 0 10px rgba(243,199,122,.16);
}
.lcd-bar { background:rgba(201,162,39,.12); height:5px; position:relative; overflow:hidden; }
.lcd-bar > i { display:block; height:100%; background:linear-gradient(90deg,#6a5210,${GOLD_DEEP},${GOLD}); box-shadow:0 0 10px rgba(243,199,122,.7); }
.lcd-bar > i::after {
  content:""; position:absolute; inset:0;
  background-image:repeating-linear-gradient(90deg, rgba(255,255,255,.22) 0 1px, transparent 1px 12px);
}
.lcd-spec {
  position:relative; display:block; width:100%; text-align:left; cursor:pointer;
  border:1px solid rgba(183,148,246,.18); background:rgba(15,12,27,.86);
  font:inherit; color:inherit; padding:0;
  transition:opacity .45s, filter .45s, border-color .3s, box-shadow .3s, transform .35s;
}
.lcd-spec:hover { border-color:rgba(243,199,122,.55); box-shadow:0 0 18px rgba(243,199,122,.2), inset 0 0 16px rgba(243,199,122,.08); z-index:2; }
.lcd-spec:focus-visible { outline:1px solid rgba(243,199,122,.7); outline-offset:2px; }
.lcd-dim { opacity:.3; filter:saturate(.35) brightness(.62); }
.lcd-dim:hover { opacity:.55; }
.lcd-open {
  border-color:rgba(243,199,122,.6);
  box-shadow:0 0 30px rgba(243,199,122,.2), inset 0 0 30px rgba(70,45,140,.4);
  z-index:3;
}
.lcd-plate { display:grid; grid-template-rows:0fr; transition:grid-template-rows .55s cubic-bezier(.22,.8,.3,1); }
.lcd-plate > span { display:block; overflow:hidden; min-height:0; }
.lcd-plate.lcd-plate-open { grid-template-rows:1fr; }
.lcd-kw {
  display:inline-flex; align-items:center; gap:6px;
  border:1px solid rgba(183,148,246,.22); background:rgba(15,12,27,.6);
  padding:4px 9px;
}
.lcd-drawer-cell { transition:fill .3s; }
details.lcd-faq { border:1px solid rgba(201,162,39,.18); background:rgba(15,12,27,.84); position:relative; }
details.lcd-faq summary { cursor:pointer; list-style:none; display:flex; align-items:center; gap:12px; padding:11px 15px; }
details.lcd-faq summary::-webkit-details-marker { display:none; }
details.lcd-faq summary .lcd-faq-x { transition:transform .3s; }
details.lcd-faq[open] summary .lcd-faq-x { transform:rotate(45deg); }
details.lcd-faq[open] { border-color:rgba(243,199,122,.45); box-shadow:0 0 18px rgba(243,199,122,.14); }
.lcd-grime-noise {
  position:fixed; inset:0; z-index:40; pointer-events:none; opacity:.06;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}
.lcd-scratches {
  position:fixed; inset:0; z-index:41; pointer-events:none; opacity:.55;
  background-image:
    repeating-linear-gradient(101deg, rgba(233,230,242,.024) 0 1px, transparent 1px 340px),
    repeating-linear-gradient(77deg, rgba(0,0,0,.16) 0 1px, transparent 1px 250px),
    repeating-linear-gradient(14deg, rgba(183,148,246,.018) 0 1px, transparent 1px 540px);
}
.lcd-ember { position:absolute; bottom:-12px; border-radius:50%; opacity:0; animation:lcd-ember linear infinite; }
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
      {right ? <span className="lcd-caps-sm lcd-mono" style={{ color: "#7d76a0", whiteSpace: "nowrap" }}>{right}</span> : null}
    </div>
  );
}

function CornerTicks({ c = "rgba(243,199,122,.55)" }: { c?: string }) {
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
  const dim = { stroke: "rgba(201,162,39,.4)", strokeWidth: .7, fill: "none" as const };
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
          <stop offset="100%" stopColor="rgba(15,12,27,0)" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="56" height="80" fill="rgba(15,12,27,.7)" stroke={s.hue} strokeWidth="1" opacity=".95" />
      <rect x="5.5" y="5.5" width="49" height="73" fill="none" stroke="rgba(201,162,39,.28)" strokeWidth=".7" />
      {/* corner ticks */}
      <path d="M2 10 V2 H10 M50 2 H58 V10 M58 74 V82 H50 M10 82 H2 V74" fill="none" stroke={s.hue} strokeWidth="1" opacity=".8" />
      {/* glow field */}
      <ellipse cx="30" cy="44" rx="17" ry="19" fill={`url(#lcd-cg-${s.num})`} className="lcd-anim-pulse" style={{ animationDuration: "8s" }} />
      {/* numeral */}
      <text x="30" y="16.5" textAnchor="middle" fontSize="8.5" letterSpacing="2.5" fill={s.hue} style={{ fontFamily: "ui-monospace,Menlo,Consolas,monospace" }}>
        {s.roman}
      </text>
      <line x1="18" y1="20" x2="42" y2="20" stroke="rgba(201,162,39,.35)" strokeWidth=".6" />
      {/* emblem */}
      <Mark kind={s.mark} hue={s.hue} />
      {/* bottom tick scale */}
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={16 + i * 3.5} y1="74" x2={16 + i * 3.5} y2={i % 4 === 0 ? 70.5 : 72.5} stroke="rgba(201,162,39,.42)" strokeWidth=".6" />
      ))}
      <text x="30" y="80.5" textAnchor="middle" fontSize="4.6" letterSpacing="1.6" fill="#6f6a8c" style={{ fontFamily: "ui-monospace,Menlo,Consolas,monospace" }}>
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
    return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={long ? "rgba(243,199,122,.7)" : "rgba(162,90,223,.5)"} strokeWidth={long ? 1.4 : .8} />;
  });
  return (
    <svg viewBox="0 0 800 800" style={{ position: "absolute", left: -330, top: "3%", width: 780, height: 780, opacity: .13 }} aria-hidden>
      <g className="lcd-anim-spin" style={{ animationDuration: "180s", transformOrigin: "400px 400px" }}>
        <circle cx={C} cy={C} r="384" fill="none" stroke="rgba(201,162,39,.55)" strokeWidth="1" />
        {ticks}
        <circle cx={C} cy={C} r="330" fill="none" stroke="rgba(243,199,122,.5)" strokeWidth=".8" strokeDasharray="3 7" />
        {ROMANS.map((r, i) => {
          const p = polar(C, C, 300, i * (360 / 22) - 90);
          return (
            <text key={r} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="15" fill={i % 2 === 0 ? "rgba(243,199,122,.85)" : "rgba(183,148,246,.8)"} style={{ fontFamily: "ui-monospace,Menlo,Consolas,monospace" }}>
              {r}
            </text>
          );
        })}
        <ellipse cx={C} cy={C} rx="360" ry="120" transform={`rotate(-18 ${C} ${C})`} fill="none" stroke="rgba(162,90,223,.55)" strokeWidth=".9" strokeDasharray="6 9" />
        <circle cx={C} cy={C} r="210" fill="none" stroke="rgba(201,162,39,.4)" strokeWidth=".7" />
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
        <circle cx={C} cy={C} r="308" fill="none" stroke="rgba(201,162,39,.5)" strokeWidth="1" />
        <circle cx={C} cy={C} r="270" fill="none" stroke="rgba(243,199,122,.5)" strokeWidth=".8" strokeDasharray="2 6" />
        <polygon points={poly(sq1)} fill="none" stroke="rgba(243,199,122,.6)" strokeWidth="1.2" />
        <polygon points={poly(sq2)} fill="none" stroke="rgba(162,90,223,.6)" strokeWidth="1.2" />
        <circle cx={C} cy={C} r="120" fill="none" stroke="rgba(201,162,39,.4)" strokeWidth=".8" />
        {pts8.map((p, i) => (
          <g key={i}>
            <line x1={p.x} y1={p.y} x2={C} y2={C} stroke="rgba(162,90,223,.3)" strokeWidth=".6" />
            <circle cx={p.x} cy={p.y} r="5" fill="none" stroke="rgba(243,199,122,.7)" strokeWidth="1" />
          </g>
        ))}
        {seals.map((g, i) => {
          const p = polar(C, C, 292, i * 45 - 90);
          return (
            <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="19" fill="rgba(243,199,122,.7)">
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
      <g key={`c${y}`} stroke="rgba(243,199,122,.35)" strokeWidth=".8">
        <path d={`M68 ${y} h8 M72 ${y - 4} v8`} />
        <path d={`M1364 ${y + 120} h8 M1368 ${y + 116} v8`} />
      </g>,
    );
  }
  return (
    <svg viewBox="0 0 1440 3200" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .55 }} aria-hidden>
      {[72, 420, 1020, 1368].map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="3200" stroke="rgba(201,162,39,.12)" strokeWidth="1" />
      ))}
      {[600, 1060, 1520, 2000, 2500, 2980].map((y, i) => (
        <g key={`h${y}`}>
          <line x1="0" y1={y} x2="1440" y2={y} stroke="rgba(201,162,39,.1)" strokeWidth="1" />
          <text x={i % 2 === 0 ? 90 : 1180} y={y - 8} fontSize="9" letterSpacing="3" fill="rgba(150,140,190,.45)" style={{ fontFamily: "ui-monospace,Menlo,Consolas,monospace" }}>
            {`SHELF ${("0" + (i + 1)).slice(-2)} · ARCANA REF ${(i * 41 + 7) % 78}`}
          </text>
        </g>
      ))}
      <line x1="0" y1="680" x2="1440" y2="1160" stroke="rgba(162,90,223,.08)" strokeWidth="1" />
      <line x1="1440" y1="2040" x2="0" y2="2560" stroke="rgba(162,90,223,.08)" strokeWidth="1" />
      <line x1="0" y1="2820" x2="1440" y2="3120" stroke="rgba(243,199,122,.07)" strokeWidth="1" />
      <circle cx="-90" cy="920" r="300" fill="none" stroke="rgba(201,162,39,.15)" strokeWidth="1" />
      <circle cx="-90" cy="920" r="238" fill="none" stroke="rgba(243,199,122,.11)" strokeWidth=".8" strokeDasharray="3 6" />
      <circle cx="1530" cy="2380" r="360" fill="none" stroke="rgba(162,90,223,.14)" strokeWidth="1" />
      <circle cx="1530" cy="2380" r="292" fill="none" stroke="rgba(183,148,246,.11)" strokeWidth=".8" strokeDasharray="2 6" />
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
              background: "#e9e6f2",
              boxShadow: "0 0 6px rgba(233,230,242,.8)",
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
/* Catalogue wheel — compact apparatus beside the tool header          */
/* ------------------------------------------------------------------ */

function CatalogueWheel() {
  const CX = 300;
  const CY = 290;
  const ticks = Array.from({ length: 110 }, (_, i) => {
    const long = i % 11 === 0;
    const p1 = polar(CX, CY, 268, i * (360 / 110));
    const p2 = polar(CX, CY, long ? 254 : 261, i * (360 / 110));
    return <line key={`t${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={long ? "rgba(243,199,122,.5)" : "rgba(162,90,223,.28)"} strokeWidth={long ? 1.1 : 0.6} />;
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
        fill={i % 3 === 0 ? GOLD : "#8f84b8"}
        style={{ fontFamily: "ui-monospace,Menlo,Consolas,monospace" }}
      >
        {r}
      </text>
    );
  });
  const diamonds = Array.from({ length: 8 }, (_, i) => {
    const p = polar(CX, CY, 176, i * 45 + 22);
    return <rect key={`d${i}`} x={p.x - 3} y={p.y - 3} width="6" height="6" transform={`rotate(45 ${p.x} ${p.y})`} fill="none" stroke="rgba(183,148,246,.6)" strokeWidth=".8" />;
  });
  const hermit = SPECIMENS[4];
  return (
    <svg viewBox="0 0 600 580" className="w-full h-auto" role="img" aria-label="Catalogue wheel of the twenty-two major arcana">
      <defs>
        <radialGradient id="lcd-hbg" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="rgba(90,60,160,.4)" />
          <stop offset="55%" stopColor="rgba(45,30,90,.18)" />
          <stop offset="100%" stopColor="rgba(15,12,27,0)" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="600" height="580" fill="url(#lcd-hbg)" />

      {/* tilted orbit ellipse */}
      <ellipse cx={CX} cy={CY} rx="272" ry="88" transform={`rotate(-12 ${CX} ${CY})`} fill="none" stroke="rgba(183,148,246,.3)" strokeWidth=".8" strokeDasharray="4 7" className="lcd-anim-flow" style={{ animationDuration: "48s" }} />
      {[0.08, 0.3, 0.55, 0.82].map((t, i) => {
        const a = t * 360;
        const x = CX + 272 * Math.cos(rad(a));
        const y = CY + 88 * Math.sin(rad(a));
        const hues = [GOLD, EMBER, VIOLET, CREAM];
        return (
          <g key={`o${i}`} transform={`rotate(-12 ${CX} ${CY})`}>
            <circle cx={x} cy={y} r="9" fill={hues[i]} opacity=".18" className="lcd-anim-pulse" style={{ animationDuration: `${7 + i * 3}s` }} />
            <circle cx={x} cy={y} r="4" fill={hues[i]} opacity=".9" />
            <circle cx={x} cy={y} r="1.4" fill="#f4f2fa" />
          </g>
        );
      })}

      {/* static tick ring */}
      <circle cx={CX} cy={CY} r="268" fill="none" stroke="rgba(201,162,39,.25)" strokeWidth=".8" />
      {ticks}
      <text x={CX} y={CY - 248} textAnchor="middle" fontSize="8" letterSpacing="4" fill="#7d76a0" style={{ fontFamily: "ui-monospace,Menlo,Consolas,monospace" }}>
        CATALOGUE FIELD · 22 TRUMPS
      </text>

      {/* rotating numeral ring */}
      <g className="lcd-anim-spin" style={{ animationDuration: "175s", transformOrigin: "300px 290px" }}>
        <circle cx={CX} cy={CY} r="228" fill="none" stroke="rgba(243,199,122,.3)" strokeWidth=".7" strokeDasharray="2 5" />
        {numeralRing}
      </g>

      {/* counter-rotating diamond ring */}
      <g className="lcd-anim-spinr" style={{ animationDuration: "115s", transformOrigin: "300px 290px" }}>
        <circle cx={CX} cy={CY} r="176" fill="none" stroke="rgba(162,90,223,.35)" strokeWidth=".7" strokeDasharray="10 6" />
        {diamonds}
      </g>

      <circle cx={CX} cy={CY} r="138" fill="none" stroke="rgba(201,162,39,.28)" strokeWidth=".6" />
      <circle cx={CX} cy={CY} r="112" fill="none" stroke="rgba(243,199,122,.22)" strokeWidth=".6" strokeDasharray="1 4" className="lcd-anim-spin" style={{ animationDuration: "95s", transformOrigin: "300px 290px" }} />

      {/* floating specimen — The Hermit, specimen IX */}
      <g className="lcd-anim-bob" style={{ animationDuration: "11s" }}>
        <svg x="252" y="212" width="96" height="134" viewBox="0 0 60 84" style={{ overflow: "visible" }}>
          <CardFace s={hermit} />
        </svg>
        <ellipse cx="300" cy="372" rx="46" ry="8" fill="rgba(243,199,122,.13)" stroke="rgba(243,199,122,.4)" strokeWidth=".7" className="lcd-anim-pulse" style={{ animationDuration: "9s" }} />
      </g>

      {/* crosshair markers */}
      <g stroke="rgba(243,199,122,.55)" strokeWidth=".8" fill="none">
        <path d="M300 22 v14 M293 29 h14" />
        <path d="M300 544 v14 M293 551 h14" />
        <path d="M20 290 h14 M27 283 v14" />
        <path d="M566 290 h14 M573 283 v14" />
      </g>
      <text x="52" y="282" fontSize="8" letterSpacing="3" fill="#6f6a8c" style={{ fontFamily: "ui-monospace,Menlo,Consolas,monospace" }}>SPEC. IX</text>
      <text x="52" y="308" fontSize="8" letterSpacing="3" fill="#6f6a8c" style={{ fontFamily: "ui-monospace,Menlo,Consolas,monospace" }}>LANTERN · LIT</text>
      <text x="508" y="52" fontSize="8" letterSpacing="2" fill="#6f6a8c" style={{ fontFamily: "ui-monospace,Menlo,Consolas,monospace" }}>22 / 78</text>
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
      <CornerTicks c={open ? "rgba(243,199,122,.65)" : "rgba(183,148,246,.4)"} />
      {/* cell head */}
      <span className="flex items-center justify-between gap-2 px-3 pt-2.5">
        <span className="lcd-caps-sm lcd-mono" style={{ color: "#6f6a8c", fontSize: 7.5 }}>
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
            <span className="lcd-caps mt-2 block" style={{ fontSize: 17, color: TEXT_HI, marginTop: 8 }}>
              {s.card.name}
            </span>
            <span className="lcd-mono mt-1.5 block" style={{ fontSize: 10.5, color: s.hue, textShadow: `0 0 9px ${s.glow}`, marginTop: 6 }}>
              {s.card.astrology} {s.glyph} · {s.card.element}
            </span>
          </span>
        ) : (
          <>
            <span className="lcd-caps" style={{ fontSize: 10.5, color: TEXT_HI, letterSpacing: ".18em" }}>
              {s.card.name}
            </span>
            <span className="lcd-caps-sm lcd-mono" style={{ color: "#565170", fontSize: 7 }}>
              {s.card.keywords.join(" · ")}
            </span>
          </>
        )}
      </span>
      {/* detail plate — unfolds in place */}
      <span className={`lcd-plate ${open ? "lcd-plate-open" : ""}`}>
        <span>
          <span className="block px-4 pb-4 pt-1 sm:px-5" style={{ borderTop: open ? "1px solid rgba(201,162,39,.15)" : "none" }}>
            <span className="mt-3 flex flex-wrap gap-1.5" style={{ marginTop: 12 }}>
              {s.card.keywords.map((k) => (
                <span key={k} className="lcd-kw">
                  <span className="lcd-hdot" style={{ width: 3, height: 3, background: s.hue, boxShadow: `0 0 4px ${s.hue}` }} />
                  <span className="lcd-caps-sm lcd-mono" style={{ color: "#a39dc4", fontSize: 8 }}>{k}</span>
                </span>
              ))}
            </span>
            <span className="lcd-engrave mt-4 block" style={{ marginTop: 14 }}>Upright reading</span>
            <span className="mt-2 block" style={{ fontSize: 13.5, lineHeight: 1.75, color: TEXT_LO, maxWidth: 560, marginTop: 8 }}>
              {s.card.upright}
            </span>
            <span className="mt-2 block" style={{ fontSize: 12, lineHeight: 1.7, color: "#8d87ab", fontStyle: "italic", maxWidth: 520, marginTop: 8 }}>
              Mission: {s.card.mission}
            </span>
            <span className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2" style={{ borderTop: "1px solid rgba(201,162,39,.13)", paddingTop: 10, marginTop: 14 }}>
              {[
                { k: "ARCANA NO", v: s.roman },
                { k: "ELEMENT", v: s.card.element.toUpperCase() },
                { k: "RULER", v: `${s.card.astrology.toUpperCase()} ${s.glyph}` },
                { k: "CHAMBER", v: "MAJOR · 22" },
              ].map((r) => (
                <span key={r.k} className="flex items-center gap-2">
                  <span className="lcd-caps-sm lcd-mono" style={{ color: "#565170", fontSize: 7.5 }}>{r.k}</span>
                  <span className="lcd-mono" style={{ fontSize: 10, color: s.hue, textShadow: `0 0 7px ${s.glow}` }}>{r.v}</span>
                </span>
              ))}
              <span className="lcd-rule" style={{ flex: 1, minWidth: 24 }} />
              <span className="lcd-caps-sm lcd-mono" style={{ color: "#6f6a8c", fontSize: 7.5 }}>CLICK TO RESEAL</span>
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
        const hue = lit ? SPECIMENS[i].hue : "rgba(201,162,39,.28)";
        return (
          <g key={i}>
            <rect
              className="lcd-drawer-cell"
              x={x}
              y={y}
              width={cw}
              height={ch}
              fill={lit ? "rgba(15,12,27,.88)" : "rgba(15,12,27,.42)"}
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
              <line x1={x + cw / 2} y1={y + ch / 2 - 2.5} x2={x + cw / 2} y2={y + ch / 2 + 2.5} stroke="rgba(201,162,39,.2)" strokeWidth=".6" />
            )}
          </g>
        );
      })}
      <text x={gap} y={rows * (ch + gap) + gap + 11} fontSize="8" letterSpacing="3" fill="#6f6a8c" style={{ fontFamily: "ui-monospace,Menlo,Consolas,monospace" }}>
        DRAWER MAP · 78 CELLS
      </text>
      <text x={cols * (cw + gap) + gap} y={rows * (ch + gap) + gap + 11} textAnchor="end" fontSize="8" letterSpacing="2" fill={GOLD} style={{ fontFamily: "ui-monospace,Menlo,Consolas,monospace" }}>
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
        {/* 1 · TOP BAR — compact, full bleed                             */}
        {/* ============================================================ */}
        <header className="lcd-panel" style={{ borderLeft: "none", borderRight: "none", borderTop: "none" }}>
          <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-2 sm:px-6">
            <span className="lcd-hdot" />
            <Link href="/tarot" className="lcd-caps lcd-mono" style={{ fontSize: 11, color: TEXT_HI, textShadow: "0 0 10px rgba(243,199,122,.5)", textDecoration: "none" }}>
              ASTRO SCOPE
            </Link>
            <span className="lcd-caps-sm lcd-mono hidden md:inline" style={{ color: "#6f6a8c" }}>TAROT DIVISION · CARD CATALOGUE</span>
            <span className="lcd-rule" style={{ flex: 1 }} />
            <span className="lcd-caps-sm lcd-mono" style={{ color: "#a39dc4" }}>UNIT 78 · SHELF A</span>
          </div>
          <div className="lcd-ticks" />
        </header>

        {/* ============================================================ */}
        {/* 2 · CROSS-NAV — seven tarot pages, CARDS active               */}
        {/* ============================================================ */}
        <nav aria-label="Tarot tools" className="lcd-panel" style={{ borderLeft: "none", borderRight: "none", borderTop: "none" }}>
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-1.5 px-4 py-2.5 sm:px-6">
            <span className="lcd-caps-sm lcd-mono" style={{ color: "#565170", marginRight: 6 }}>TAROT /</span>
            {NAV.map((t, i) => (
              <Link
                key={t.href}
                href={t.href}
                aria-current={t.active ? "page" : undefined}
                className={`lcd-tab lcd-mono ${t.active ? "lcd-tab-active" : ""}`}
                style={{ transform: TAB_DIRT[i] }}
              >
                {t.label}
              </Link>
            ))}
            <span className="lcd-rule hidden sm:block" style={{ flex: 1, minWidth: 20 }} />
            <span className="lcd-caps-sm lcd-mono hidden lg:inline" style={{ color: "#565170", fontSize: 7.5 }}>7 TOOLS · ONE DECK</span>
          </div>
        </nav>

        {/* ============================================================ */}
        {/* 3 · TOOL HEADER — compact title + small wheel off the edge    */}
        {/* ============================================================ */}
        <section className="relative">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 px-4 pb-4 pt-8 sm:px-6 lg:grid-cols-[1.2fr_.8fr] lg:pt-10">
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="lcd-hdot" />
                <span className="lcd-caps lcd-mono" style={{ fontSize: 10, color: GOLD, textShadow: "0 0 10px rgba(243,199,122,.6)" }}>
                  SPECIMEN CATALOGUE
                </span>
                <span className="lcd-rule" style={{ width: 60 }} />
                <span className="lcd-caps-sm lcd-mono" style={{ color: "#6f6a8c" }}>FIRST DISTILLATION</span>
              </div>

              <h1 className="mt-4" style={{ fontSize: "clamp(26px, 3.6vw, 42px)", lineHeight: 1.12, color: TEXT_HI, fontWeight: 400, transform: "rotate(-.5deg)", transformOrigin: "left center" }}>
                The cabinet of seventy-eight —{" "}
                <em style={{ color: GOLD, textShadow: "0 0 22px rgba(243,199,122,.6)", fontStyle: "italic" }}>
                  first specimens.
                </em>
              </h1>

              <p className="mt-4 max-w-lg" style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_LO }}>
                Twenty-two trumps for the grand lessons, fifty-six minors for the everyday weather. Eight specimens are lit
                below — click one to unseal its plate; the rest are still in the retorts.
              </p>

              {/* inline micro-readouts — tilted strip, wider than the column */}
              <div
                className="lcd-panel mt-6 grid grid-cols-3 divide-x"
                style={{ borderColor: "rgba(201,162,39,.2)", transform: "rotate(.5deg)", width: "calc(100% + 40px)", marginLeft: -10 }}
              >
                <PanelGrime v={0} />
                {[
                  { k: "SPECIMENS LIT", v: "8 / 78", h: GOLD },
                  { k: "MAJOR ARCANA", v: "22 TRUMPS", h: VIOLET_SOFT },
                  { k: "CABINET FIELD", v: "STABLE", h: EMBER },
                ].map((r) => (
                  <div key={r.k} className="px-3 py-2" style={{ borderColor: "rgba(201,162,39,.15)" }}>
                    <div className="lcd-caps-sm" style={{ color: "#6f6a8c" }}>{r.k}</div>
                    <div className="lcd-mono mt-0.5" style={{ fontSize: 13.5, color: r.h, textShadow: `0 0 9px ${r.h}` }}>{r.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* compact catalogue wheel bleeding off the right edge */}
            <div className="pointer-events-none relative mx-auto -mb-10 hidden w-full max-w-[300px] select-none lg:block" style={{ transform: "translateX(26%) scale(1.05)" }} aria-hidden>
              <CatalogueWheel />
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4 · THE CABINET — the tool itself, immediately usable         */}
        {/* ============================================================ */}
        <section id="lcd-cabinet" className="mx-auto max-w-6xl scroll-mt-6 px-4 pb-16 sm:px-6">
          <div className="lcd-panel" style={{ margin: "0 -24px", transform: "rotate(-.35deg)" }}>
            <PanelHead title="Specimen Cabinet" right="MAJOR ARCANA · 8 / 22 CATALOGUED" />
            <PanelGrime v={1} />

            {/* wax seal straddling the cabinet's top-right corner */}
            <div className="pointer-events-none absolute" style={{ top: -38, right: 22, transform: "rotate(9deg)", zIndex: 4 }} aria-hidden>
              <svg width="92" height="92" viewBox="0 0 92 92" className="lcd-anim-spin" style={{ animationDuration: "120s", transformOrigin: "46px 46px" }}>
                <defs>
                  <path id="lcd-sealp" d="M46 46 m-31 0 a31 31 0 1 1 62 0 a31 31 0 1 1 -62 0" />
                </defs>
                <circle cx="46" cy="46" r="42" fill="rgba(13,10,24,.94)" stroke="rgba(243,199,122,.55)" strokeWidth="1" />
                <circle cx="46" cy="46" r="38" fill="none" stroke="rgba(183,148,246,.35)" strokeWidth=".7" strokeDasharray="2 4" />
                <text fontSize="7" letterSpacing="2.2" fill={VIOLET_SOFT} style={{ fontFamily: "ui-monospace,Menlo,Consolas,monospace" }}>
                  <textPath href="#lcd-sealp">FIRST DISTILLATION · HANDLE WITH CARE ·</textPath>
                </text>
                <text x="46" y="51" textAnchor="middle" fontSize="13" letterSpacing="1" fill={GOLD} style={{ fontFamily: "ui-monospace,Menlo,Consolas,monospace" }}>VIII</text>
              </svg>
            </div>

            {/* shelf label straddling the panel's left border */}
            <span
              className="lcd-engrave absolute hidden sm:block"
              style={{ top: "50%", left: -9, transform: "rotate(-90deg) translateX(50%)", transformOrigin: "left center", background: "#0d0a18", padding: "2px 10px", zIndex: 3 }}
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
              <span className="lcd-caps-sm lcd-mono" style={{ color: "#6f6a8c" }}>CATALOGUING</span>
              <div className="lcd-bar" style={{ flex: 1 }}>
                <i className="lcd-anim-pulse" style={{ width: "10.3%", animationDuration: "9s" }} />
              </div>
              <span className="lcd-mono" style={{ fontSize: 11, color: GOLD, textShadow: "0 0 8px rgba(243,199,122,.7)" }}>10.3%</span>
            </div>
            <div className="lcd-ticks mx-4 mb-3 sm:mx-6" style={{ opacity: .45 }} />
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5 · NOTE — full cabinet in preparation, condensed full bleed  */}
        {/* ============================================================ */}
        <section className="lcd-panel" style={{ borderLeft: "none", borderRight: "none" }}>
          <PanelGrime v={0} />
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-9 sm:px-6 lg:grid-cols-[1.15fr_.85fr]">
            <div style={{ transform: "rotate(-.3deg)" }}>
              <div className="flex items-center gap-3">
                <span className="lcd-hdot" style={{ background: EMBER, boxShadow: `0 0 6px ${EMBER}` }} />
                <span className="lcd-caps lcd-mono" style={{ fontSize: 10, color: EMBER, textShadow: "0 0 10px rgba(227,154,76,.6)" }}>
                  LABORATORY NOTE
                </span>
                <span className="lcd-rule" style={{ width: 48 }} />
                <span className="lcd-caps-sm lcd-mono" style={{ color: "#6f6a8c" }}>ENTRY 04 / ONGOING</span>
              </div>
              <h2 className="mt-3" style={{ fontSize: "clamp(20px, 2.6vw, 30px)", lineHeight: 1.18, color: TEXT_HI, fontWeight: 400, margin: 0, marginTop: 12 }}>
                The full cabinet is in preparation.
              </h2>
              <p className="mt-3 max-w-lg" style={{ fontSize: 13.5, lineHeight: 1.7, color: TEXT_LO }}>
                Seventy cells remain unlit. Every card — trump, pip and court — is weighed, annotated and sealed one
                distillation at a time, upright and reversed. The drawer map tracks the work.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["22 MAJOR", "56 MINOR", "4 SUITS", "UPRIGHT + REVERSED"].map((t) => (
                  <span key={t} className="flex items-center gap-2" style={{ border: "1px solid rgba(201,162,39,.16)", padding: "4px 9px", background: "rgba(15,12,27,.5)" }}>
                    <span className="lcd-hdot" style={{ width: 3, height: 3 }} />
                    <span className="lcd-caps-sm lcd-mono" style={{ color: "#a39dc4", fontSize: 7.5 }}>{t}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-xs" style={{ transform: "translateX(6%) rotate(1.2deg)" }}>
              <CornerTicks c="rgba(243,199,122,.5)" />
              <DrawerMap />
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 6 · FAQ — condensed catalogue notes, staggered off-center     */}
        {/* ============================================================ */}
        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:ml-[8%]">
          <div className="mb-4 flex items-center gap-4">
            <span className="lcd-hdot" />
            <h2 className="lcd-caps" style={{ fontSize: 12, color: TEXT_HI, margin: 0 }}>Catalogue Notes</h2>
            <span className="lcd-rule" style={{ flex: 1 }} />
            <span className="lcd-caps-sm lcd-mono" style={{ color: "#6f6a8c" }}>3 ENTRIES</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {FAQ.map((f, i) => (
              <details key={f.id} className="lcd-faq" style={FAQ_DIRT[i]}>
                <summary>
                  <span className="lcd-caps-sm lcd-mono" style={{ color: "#6f6a8c", whiteSpace: "nowrap" }}>{f.id}</span>
                  <span style={{ fontSize: 14, color: TEXT_HI, flex: 1 }}>{f.q}</span>
                  <span className="lcd-faq-x lcd-mono" style={{ color: GOLD, fontSize: 14, textShadow: "0 0 8px rgba(243,199,122,.6)" }}>+</span>
                </summary>
                <div style={{ borderTop: "1px solid rgba(201,162,39,.14)", padding: "10px 15px 12px 15px" }}>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_LO, margin: 0 }}>{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 7 · CTA — slim full-bleed strip                               */}
        {/* ============================================================ */}
        <section className="lcd-panel" style={{ borderLeft: "none", borderRight: "none" }}>
          <PanelGrime v={1} />
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-4 px-4 py-8 sm:px-6">
            <div className="min-w-[240px] flex-1">
              <h2 style={{ fontSize: "clamp(18px, 2.2vw, 26px)", lineHeight: 1.25, color: TEXT_HI, fontWeight: 400, margin: 0, transform: "rotate(-.3deg)" }}>
                The deck is warm.{" "}
                <em style={{ color: GOLD, textShadow: "0 0 18px rgba(243,199,122,.6)" }}>One card a day is enough to start.</em>
              </h2>
              <p className="mt-2" style={{ fontSize: 12.5, lineHeight: 1.6, color: TEXT_LO, margin: "8px 0 0" }}>
                Every draw is weighed, recorded and read back plainly.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/tarot/spreads/daily-card" className="lcd-btn" style={{ textDecoration: "none", fontSize: 10, padding: "11px 22px" }}>
                <span className="lcd-hdot" style={{ background: CREAM, boxShadow: `0 0 6px ${CREAM}` }} />
                PULL YOUR DAILY CARD
              </Link>
              <Link href="/tarot" className="lcd-btn-ghost" style={{ textDecoration: "none" }}>
                TAROT HUB →
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 8 · FOOTER — lab status strip juts wider than the column      */}
        {/* ============================================================ */}
        <footer className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="lcd-panel" style={{ margin: "0 -22px", transform: "rotate(.3deg)" }}>
            <PanelGrime v={0} />
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5">
              {[
                { k: "CABINET", v: "SEALED", h: GOLD },
                { k: "SPECIMENS", v: "8/78", h: VIOLET_SOFT },
                { k: "SUITS", v: "4 CALIBRATED", h: EMBER },
                { k: "FIELD", v: "STABLE", h: CREAM },
                { k: "DISTILLATION", v: "10.3%", h: VIOLET },
              ].map((s) => (
                <span key={s.k} className="flex items-center gap-2">
                  <span className="lcd-hdot lcd-anim-pulse" style={{ width: 4, height: 4, background: s.h, boxShadow: `0 0 5px ${s.h}`, animationDuration: "6s" }} />
                  <span className="lcd-caps-sm lcd-mono" style={{ color: "#6f6a8c", fontSize: 8 }}>{s.k}</span>
                  <span className="lcd-mono" style={{ fontSize: 10, color: s.h, textShadow: `0 0 7px ${s.h}` }}>{s.v}</span>
                </span>
              ))}
              <span className="lcd-rule" style={{ flex: 1, minWidth: 30 }} />
              <span className="lcd-caps-sm lcd-mono lcd-anim-flicker" style={{ color: "#8d87ab", animationDuration: "9s", fontSize: 8 }}>
                LAB STATUS · CATALOGUING IN PROGRESS
              </span>
            </div>
          </div>
          <div className="lcd-ticks mt-1" style={{ opacity: .4 }} />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="lcd-caps-sm lcd-mono" style={{ color: "#565170", fontSize: 8 }}>© ASTRO SCOPE · TAROT DIVISION</span>
            <span className="lcd-caps-sm lcd-mono" style={{ color: "#565170", fontSize: 8 }}>CATALOGUE LOG · SHELF A · VOL. I</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
