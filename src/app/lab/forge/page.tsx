import type { Metadata } from "next";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Astro Scope — The Forge",
  description:
    "Free birth chart, daily horoscopes, synastry and tarot. We distill the sky into answers. Your chart is written in the stars.",
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
  { name: "ARIES", glyph: "♈︎", dates: "MAR 21 – APR 19" },
  { name: "TAURUS", glyph: "♉︎", dates: "APR 20 – MAY 20" },
  { name: "GEMINI", glyph: "♊︎", dates: "MAY 21 – JUN 20" },
  { name: "CANCER", glyph: "♋︎", dates: "JUN 21 – JUL 22" },
  { name: "LEO", glyph: "♌︎", dates: "JUL 23 – AUG 22" },
  { name: "VIRGO", glyph: "♍︎", dates: "AUG 23 – SEP 22" },
  { name: "LIBRA", glyph: "♎︎", dates: "SEP 23 – OCT 22" },
  { name: "SCORPIO", glyph: "♏︎", dates: "OCT 23 – NOV 21" },
  { name: "SAGITTARIUS", glyph: "♐︎", dates: "NOV 22 – DEC 21" },
  { name: "CAPRICORN", glyph: "♑︎", dates: "DEC 22 – JAN 19" },
  { name: "AQUARIUS", glyph: "♒︎", dates: "JAN 20 – FEB 18" },
  { name: "PISCES", glyph: "♓︎", dates: "FEB 19 – MAR 20" },
];

type Essence = { name: string; value: string; hue: string; glow: string; spark: string };

const ESSENCES: Essence[] = [
  { name: "SOLAR", value: "87.2", hue: "#ffb15c", glow: "rgba(255,138,60,.55)", spark: "M12 2 L14.5 9 L22 12 L14.5 15 L12 22 L9.5 15 L2 12 L9.5 9 Z" },
  { name: "IGNIS", value: "63.9", hue: "#ff5c4d", glow: "rgba(255,61,90,.5)", spark: "M12 2 L15 8 L12 12 L15 16 L12 22 L9 16 L12 12 L9 8 Z" },
  { name: "LUNAR", value: "71.4", hue: "#c9a5ff", glow: "rgba(165,92,255,.5)", spark: "M17 3 A10 10 0 1 0 17 21 A8 8 0 1 1 17 3 Z" },
  { name: "AETHER", value: "92.6", hue: "#a55cff", glow: "rgba(196,125,255,.55)", spark: "M12 1 L14 9 L22 7 L15 12 L22 17 L14 15 L12 23 L10 15 L2 17 L9 12 L2 7 L10 9 Z" },
  { name: "TERRA", value: "58.8", hue: "#e8a56b", glow: "rgba(232,165,107,.45)", spark: "M12 3 L21 12 L12 21 L3 12 Z M12 8 L16 12 L12 16 L8 12 Z" },
];

type Apparatus = {
  tag: string;
  title: string;
  copy: string;
  hue: string;
  instrument: "chart" | "flask" | "vessels" | "chamber" | "coils" | "seal";
  readout: string;
};

const SECTIONS: Apparatus[] = [
  { tag: "FREE", title: "Birth Chart", copy: "Map your Sun, Moon, and Rising — the foundation of every reading.", hue: "#ff5c9a", instrument: "chart", readout: "AXIAL 12H · 12S" },
  { tag: "DAILY", title: "Daily Horoscope", copy: "Twelve signs, one sky. Clear forecasts without the fluff.", hue: "#ffb15c", instrument: "flask", readout: "REFRESH 06:00" },
  { tag: "SYNASTRY", title: "Compatibility", copy: "Zodiac match, Chinese pairs, and deep synastry for two charts.", hue: "#c47dff", instrument: "vessels", readout: "DUAL CHART SYNC" },
  { tag: "SPREADS", title: "Tarot", copy: "Daily card to Celtic Cross — pull, reflect, get a full reading.", hue: "#ff8a3c", instrument: "chamber", readout: "78 CARDS · 10 ARC" },
  { tag: "TESTS", title: "Psychology", copy: "MBTI, Big Five, empathy and more — meet yourself beyond the signs.", hue: "#a55cff", instrument: "coils", readout: "5 SCALES · CALIB." },
  { tag: "YOU", title: "Cosmic Passport", copy: "Your Cosmic ID, people, journal, and Premium deep dives — one hub.", hue: "#ff5c9a", instrument: "seal", readout: "ID ACTIVE · HUB" },
];

type Faq = { id: string; q: string; a: string };

const FAQ: Faq[] = [
  { id: "NOTE 01", q: "Which features are free?", a: "Birth chart, daily horoscope, tarot pulls and psychology tests are free. Premium adds deep dives and extended synastry." },
  { id: "NOTE 02", q: "How do I cast a chart?", a: "Enter birth date, time and city. The chamber computes Sun, Moon, Rising and house placements in seconds." },
  { id: "NOTE 03", q: "Where do horoscopes live?", a: "Under Daily Horoscope — all twelve signs refreshed each morning, calibrated to the current sky." },
  { id: "NOTE 04", q: "What is the Destiny Matrix?", a: "An optional birth-date octagram tool. It maps purpose, love, money, and age themes from your birth date." },
];

const TODAY: { label: string; value: string; sub: string; hue: string }[] = [
  { label: "MOON TODAY", value: "WAXING GIBBOUS", sub: "ILLUM. 78.4%", hue: "#c9a5ff" },
  { label: "SIGN OF THE DAY", value: "LEO ♌︎", sub: "FIXED · FIRE", hue: "#ffb15c" },
  { label: "CARD OF THE DAY", value: "X — ORACLE", sub: "WHEEL TURNS", hue: "#ff5c9a" },
];

/* ------------------------------------------------------------------ */
/* Layout dirt — deterministic offsets, tilts, overlaps                */
/* ------------------------------------------------------------------ */

const ORB_DIRT = [
  "translateY(-14px) rotate(-2.2deg)",
  "translateY(6px) rotate(1.4deg)",
  "translateY(-18px) rotate(-1deg)",
  "translateY(8px) rotate(2deg)",
  "translateY(-10px) rotate(-1.6deg)",
];

const SIGN_DIRT = [
  "translate(3px,5px) rotate(-1.6deg)", "translate(-4px,-3px) rotate(1.1deg)",
  "translate(2px,8px) rotate(-.7deg)", "translate(-3px,2px) rotate(1.8deg)",
  "translate(5px,-4px) rotate(-1.2deg)", "translate(-2px,6px) rotate(.9deg)",
  "translate(4px,3px) rotate(-2deg)", "translate(-5px,-2px) rotate(1.4deg)",
  "translate(2px,7px) rotate(-.8deg)", "translate(-3px,-5px) rotate(1.6deg)",
  "translate(4px,4px) rotate(-1.3deg)", "translate(-2px,-3px) rotate(.8deg)",
];

const TILE_DIRT: string[] = [
  "rotate(-.9deg)",
  "rotate(1.1deg) translateY(14px)",
  "rotate(-.6deg) translateY(-4px)",
  "rotate(.8deg) translateY(-12px)",
  "rotate(-1.2deg) translateY(10px)",
  "rotate(.7deg) translateY(-6px)",
];

const FAQ_DIRT: CSSProperties[] = [
  { marginRight: 48, transform: "rotate(-.4deg)" },
  { marginLeft: 44, transform: "rotate(.5deg)" },
  { marginLeft: 16, marginRight: 28, transform: "rotate(-.3deg)" },
  { marginLeft: 60, transform: "rotate(.4deg)" },
];

const TODAY_DIRT = [
  "translateY(-7px) rotate(-.8deg)",
  "translateY(5px) rotate(.5deg)",
  "translateY(-3px) rotate(.9deg)",
];

/* ------------------------------------------------------------------ */
/* Background layers — runes, embers                                   */
/* ------------------------------------------------------------------ */

const BG_RUNES: { ch: string; top: string; left?: string; right?: string; size: number; rot: number; c: string }[] = [
  { ch: "ᚠ", top: "7%", left: "58%", size: 260, rot: -8, c: "rgba(255,92,140,.05)" },
  { ch: "ᚱ", top: "24%", left: "1%", size: 220, rot: 6, c: "rgba(255,177,92,.045)" },
  { ch: "ᛇ", top: "41%", right: "2%", size: 300, rot: -5, c: "rgba(196,125,255,.05)" },
  { ch: "ᛞ", top: "58%", left: "44%", size: 240, rot: 9, c: "rgba(255,92,140,.04)" },
  { ch: "ᛚ", top: "74%", right: "14%", size: 210, rot: -11, c: "rgba(255,177,92,.045)" },
  { ch: "ᛟ", top: "88%", left: "6%", size: 250, rot: 4, c: "rgba(196,125,255,.045)" },
];

const EMBERS: { l: number; s: number; c: string; dur: string; del: string }[] = [
  { l: 4, s: 3, c: "#ffb15c", dur: "34s", del: "-8s" },
  { l: 11, s: 2, c: "#ff5c85", dur: "46s", del: "-30s" },
  { l: 18, s: 4, c: "#ff8a3c", dur: "28s", del: "-17s" },
  { l: 26, s: 2, c: "#c47dff", dur: "52s", del: "-41s" },
  { l: 33, s: 3, c: "#ffb15c", dur: "38s", del: "-5s" },
  { l: 41, s: 2, c: "#ff5c85", dur: "57s", del: "-49s" },
  { l: 49, s: 3, c: "#ff8a3c", dur: "31s", del: "-22s" },
  { l: 57, s: 2, c: "#ffb15c", dur: "43s", del: "-12s" },
  { l: 64, s: 4, c: "#c47dff", dur: "26s", del: "-3s" },
  { l: 71, s: 2, c: "#ff5c85", dur: "49s", del: "-36s" },
  { l: 78, s: 3, c: "#ffb15c", dur: "36s", del: "-26s" },
  { l: 85, s: 2, c: "#ff8a3c", dur: "54s", del: "-15s" },
  { l: 91, s: 3, c: "#ff5c85", dur: "41s", del: "-33s" },
  { l: 96, s: 2, c: "#ffb15c", dur: "29s", del: "-9s" },
];

/* ------------------------------------------------------------------ */
/* Grime presets — deterministic stains, drips, splatter               */
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
  {
    stains: [
      { cx: 50, cy: 4, rx: 18, ry: 6, c: "rgba(6,2,3,.36)" },
      { cx: 10, cy: 92, rx: 12, ry: 8, c: "rgba(122,60,16,.13)" },
      { cx: 94, cy: 40, rx: 7, ry: 12, c: "rgba(70,16,40,.34)" },
      { cx: 91, cy: 43, rx: 4, ry: 7, c: "rgba(6,2,3,.4)" },
    ],
    drips: [
      { x: 44, y: 1, len: 11, c: "rgba(140,70,20,.24)" },
      { x: 57, y: 2, len: 7, c: "rgba(96,40,60,.26)" },
      { x: 93, y: 30, len: 15, c: "rgba(140,70,20,.22)" },
    ],
    specks: [
      { x: 8, y: 34, r: 0.4, c: "rgba(0,0,0,.44)" },
      { x: 17, y: 71, r: 0.3, c: "rgba(255,150,90,.17)" },
      { x: 29, y: 18, r: 0.5, c: "rgba(0,0,0,.42)" },
      { x: 41, y: 56, r: 0.35, c: "rgba(0,0,0,.4)" },
      { x: 55, y: 84, r: 0.45, c: "rgba(255,150,90,.15)" },
      { x: 69, y: 27, r: 0.3, c: "rgba(0,0,0,.42)" },
      { x: 80, y: 66, r: 0.4, c: "rgba(0,0,0,.46)" },
      { x: 88, y: 90, r: 0.3, c: "rgba(255,150,90,.16)" },
      { x: 36, y: 78, r: 0.35, c: "rgba(0,0,0,.38)" },
      { x: 62, y: 12, r: 0.3, c: "rgba(0,0,0,.4)" },
      { x: 23, y: 49, r: 0.4, c: "rgba(0,0,0,.36)" },
      { x: 75, y: 95, r: 0.35, c: "rgba(255,150,90,.14)" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Scoped styles                                                       */
/* ------------------------------------------------------------------ */

const CSS = `
.lfg-root { background:#160509; color:#e0aebe; font-family:Georgia,'Times New Roman',serif; position:relative; overflow-x:clip; }
.lfg-mono { font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace; }
.lfg-caps { text-transform:uppercase; letter-spacing:.24em; }
.lfg-caps-sm { text-transform:uppercase; letter-spacing:.2em; font-size:9px; }
.lfg-bg { position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
.lfg-bg-page { position:absolute; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
.lfg-panel {
  background:linear-gradient(160deg, rgba(52,12,26,.85), rgba(26,6,16,.94));
  border:1px solid rgba(226,92,128,.22);
  box-shadow:inset 0 0 0 1px rgba(0,0,0,.55), inset 0 0 36px rgba(96,10,42,.28), 0 0 26px rgba(0,0,0,.5);
  position:relative;
}
.lfg-panel::before {
  content:""; position:absolute; inset:4px; pointer-events:none;
  border:1px solid rgba(226,92,128,.1);
}
.lfg-header {
  display:flex; align-items:center; gap:8px;
  border-bottom:1px solid rgba(226,92,128,.18);
  padding:7px 12px;
}
.lfg-hdot { width:5px; height:5px; transform:rotate(45deg); background:#ff3d6e; box-shadow:0 0 6px #ff3d6e; flex:none; }
.lfg-htext { font-size:10px; letter-spacing:.28em; color:#eebcc9; text-transform:uppercase; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.lfg-rule { height:1px; background:linear-gradient(90deg, rgba(226,92,128,.42), rgba(226,92,128,.05)); }
.lfg-rule-r { height:1px; background:linear-gradient(270deg, rgba(226,92,128,.42), rgba(226,92,128,.05)); }
.lfg-ticks { background-image:repeating-linear-gradient(90deg, rgba(226,92,128,.38) 0 1px, transparent 1px 8px); height:5px; }
.lfg-ticks-v { background-image:repeating-linear-gradient(0deg, rgba(226,92,128,.42) 0 1px, transparent 1px 7px); width:5px; }
.lfg-engrave {
  text-transform:uppercase; letter-spacing:.4em; font-size:10px; color:#8f4559;
  text-shadow:0 1px 0 rgba(0,0,0,.8), 0 -1px 0 rgba(255,150,180,.08);
}
.lfg-btn {
  display:inline-flex; align-items:center; gap:10px;
  background:linear-gradient(180deg, rgba(255,61,110,.3), rgba(122,14,52,.5));
  border:1px solid rgba(255,92,140,.62); color:#ffd9e2;
  text-transform:uppercase; letter-spacing:.26em; font-size:10px;
  padding:11px 22px; box-shadow:0 0 20px rgba(255,61,110,.38), inset 0 0 14px rgba(255,61,110,.26);
  transition:box-shadow .3s;
}
.lfg-btn:hover { box-shadow:0 0 32px rgba(255,61,110,.65), inset 0 0 18px rgba(255,61,110,.42); }
.lfg-btn-ghost {
  display:inline-flex; align-items:center; gap:8px;
  border:1px solid rgba(255,177,92,.4); color:#ffcf9a;
  text-transform:uppercase; letter-spacing:.24em; font-size:10px;
  padding:11px 18px; background:rgba(255,138,60,.06);
  box-shadow:inset 0 0 12px rgba(255,138,60,.1);
  transition:box-shadow .3s, border-color .3s;
}
.lfg-btn-ghost:hover { border-color:rgba(255,177,92,.75); box-shadow:0 0 18px rgba(255,138,60,.3), inset 0 0 14px rgba(255,138,60,.2); }
.lfg-bar { background:rgba(226,92,128,.12); height:5px; position:relative; overflow:hidden; }
.lfg-bar > i { display:block; height:100%; background:linear-gradient(90deg,#7a1030,#ff3d6e,#ffb15c); box-shadow:0 0 10px rgba(255,61,110,.75); }
.lfg-bar > i::after {
  content:""; position:absolute; inset:0;
  background-image:repeating-linear-gradient(90deg, rgba(255,255,255,.22) 0 1px, transparent 1px 12px);
}
.lfg-sign {
  position:relative; display:flex; flex-direction:column; align-items:center; gap:5px;
  padding:12px 4px 10px; background:rgba(26,6,16,.78);
  border:1px solid rgba(226,92,128,.18);
  transition:border-color .3s, box-shadow .3s;
}
.lfg-sign:hover { border-color:rgba(255,92,140,.55); box-shadow:0 0 16px rgba(255,61,110,.25), inset 0 0 14px rgba(255,61,110,.12); z-index:2; }
.lfg-sign::after {
  content:""; position:absolute; top:0; left:12%; right:12%; height:1px;
  background:linear-gradient(90deg, transparent, rgba(255,177,92,.5), transparent);
}
.lfg-tile { position:relative; transition:border-color .3s, box-shadow .3s; }
.lfg-tile:hover { border-color:rgba(255,92,140,.5); box-shadow:0 0 26px rgba(255,61,110,.28), inset 0 0 36px rgba(96,10,42,.4); z-index:2; }
details.lfg-faq { border:1px solid rgba(226,92,128,.2); background:rgba(26,6,16,.82); position:relative; }
details.lfg-faq summary { cursor:pointer; list-style:none; display:flex; align-items:center; gap:12px; padding:13px 16px; }
details.lfg-faq summary::-webkit-details-marker { display:none; }
details.lfg-faq summary .lfg-faq-x { transition:transform .3s; }
details.lfg-faq[open] summary .lfg-faq-x { transform:rotate(45deg); }
details.lfg-faq[open] { border-color:rgba(255,92,140,.45); box-shadow:0 0 18px rgba(255,61,110,.18); }
.lfg-grime-noise {
  position:fixed; inset:0; z-index:40; pointer-events:none; opacity:.06;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}
.lfg-scratches {
  position:fixed; inset:0; z-index:41; pointer-events:none; opacity:.55;
  background-image:
    repeating-linear-gradient(101deg, rgba(255,214,224,.028) 0 1px, transparent 1px 340px),
    repeating-linear-gradient(77deg, rgba(0,0,0,.16) 0 1px, transparent 1px 250px),
    repeating-linear-gradient(14deg, rgba(255,190,200,.02) 0 1px, transparent 1px 540px);
}
.lfg-smoke {
  position:absolute; width:92px; height:92px; border-radius:50%; pointer-events:none;
  background:radial-gradient(closest-side, rgba(206,130,156,.16), rgba(120,60,92,.07) 55%, transparent 75%);
  filter:blur(13px); animation:lfg-smoke ease-in-out infinite;
}
.lfg-ember {
  position:absolute; bottom:-12px; border-radius:50%; opacity:0;
  animation:lfg-ember linear infinite;
}
.lfg-hero-bleed { position:relative; }
@media (min-width:1024px) {
  .lfg-hero-bleed { transform:translateX(13%) scale(1.12); }
}
.lfg-anim-spin { animation:lfg-spin linear infinite; }
.lfg-anim-spinr { animation:lfg-spinr linear infinite; }
.lfg-anim-bob { animation:lfg-bob ease-in-out infinite; }
.lfg-anim-pulse { animation:lfg-pulse ease-in-out infinite; }
.lfg-anim-flicker { animation:lfg-flicker linear infinite; }
.lfg-anim-flow { animation:lfg-flow linear infinite; }
@keyframes lfg-spin { to { transform:rotate(360deg); } }
@keyframes lfg-spinr { to { transform:rotate(-360deg); } }
@keyframes lfg-bob { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-9px); } }
@keyframes lfg-pulse { 0%,100% { opacity:.5; } 50% { opacity:1; } }
@keyframes lfg-flicker { 0%,100% { opacity:.85; } 8% { opacity:.58; } 12% { opacity:.95; } 46% { opacity:.7; } 52% { opacity:1; } 78% { opacity:.74; } }
@keyframes lfg-flow { to { stroke-dashoffset:-240; } }
@keyframes lfg-smoke { 0% { transform:translate(0,0) scale(.65); opacity:0; } 18% { opacity:.5; } 55% { opacity:.28; } 100% { transform:translate(24px,-180px) scale(1.6); opacity:0; } }
@keyframes lfg-ember { 0% { transform:translate(0,0); opacity:0; } 10% { opacity:.75; } 80% { opacity:.4; } 100% { transform:translate(34px,-108vh); opacity:0; } }
@media (prefers-reduced-motion: reduce) {
  .lfg-root *, .lfg-root *::before, .lfg-root *::after { animation:none !important; transition:none !important; }
}
`;

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function PanelHead({ title, right }: { title: string; right?: string }) {
  return (
    <div className="lfg-header">
      <span className="lfg-hdot" />
      <span className="lfg-htext">{title}</span>
      <span className="lfg-rule" style={{ flex: 1 }} />
      {right ? <span className="lfg-caps-sm lfg-mono" style={{ color: "#a0586e", whiteSpace: "nowrap" }}>{right}</span> : null}
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

function EssenceOrb({ e, dirt }: { e: Essence; dirt: string }) {
  return (
    <div
      className="flex flex-col items-center gap-1.5 py-4 px-1"
      style={{ border: "1px solid rgba(226,92,128,.16)", background: "rgba(22,5,13,.72)", transform: dirt, boxShadow: "0 6px 18px rgba(0,0,0,.45)" }}
    >
      <svg width="38" height="52" viewBox="0 0 24 32" aria-hidden>
        <defs>
          <radialGradient id={`lfg-og-${e.name}`} cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor="#fff3ec" />
            <stop offset="35%" stopColor={e.hue} />
            <stop offset="100%" stopColor="rgba(40,8,20,0)" />
          </radialGradient>
        </defs>
        <circle cx="12" cy="12" r="11" fill={e.glow} className="lfg-anim-pulse" style={{ animationDuration: "7s" }} />
        <circle cx="12" cy="12" r="8.5" fill={`url(#lfg-og-${e.name})`} />
        <path d={e.spark} fill="none" stroke="#2a0a18" strokeWidth="1" opacity=".8" transform="scale(.62) translate(7.4 7.4)" />
        <line x1="12" y1="22" x2="12" y2="28" stroke={e.hue} strokeWidth=".8" opacity=".7" />
        <path d="M12 28 l-2.5 3 M12 28 l2.5 3" stroke={e.hue} strokeWidth=".8" fill="none" opacity=".7" />
      </svg>
      <span className="lfg-caps-sm" style={{ color: "#cf93a6" }}>{e.name}</span>
      <span className="lfg-mono" style={{ fontSize: 14, color: e.hue, textShadow: `0 0 10px ${e.glow}` }}>{e.value}</span>
      <span className="lfg-caps-sm" style={{ color: "#6e3a4a", fontSize: 7 }}>ESS. LEVEL</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Background layers                                                   */
/* ------------------------------------------------------------------ */

function BgRing() {
  const C = 400;
  const ticks = Array.from({ length: 96 }, (_, i) => {
    const long = i % 8 === 0;
    const p1 = polar(C, C, 384, i * 3.75);
    const p2 = polar(C, C, long ? 366 : 374, i * 3.75);
    return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={long ? "rgba(255,177,92,.7)" : "rgba(226,92,128,.5)"} strokeWidth={long ? 1.4 : .8} />;
  });
  return (
    <svg viewBox="0 0 800 800" style={{ position: "absolute", left: -330, top: "4%", width: 780, height: 780, opacity: .13 }}>
      <g className="lfg-anim-spin" style={{ animationDuration: "180s", transformOrigin: "400px 400px" }}>
        <circle cx={C} cy={C} r="384" fill="none" stroke="rgba(226,92,128,.6)" strokeWidth="1" />
        {ticks}
        <circle cx={C} cy={C} r="330" fill="none" stroke="rgba(255,177,92,.5)" strokeWidth=".8" strokeDasharray="3 7" />
        {ZODIAC.map((z, i) => {
          const p = polar(C, C, 300, i * 30 - 90);
          return (
            <text key={z.name} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="26" fill="rgba(255,138,60,.8)">
              {z.glyph}
            </text>
          );
        })}
        <ellipse cx={C} cy={C} rx="360" ry="120" transform={`rotate(-18 ${C} ${C})`} fill="none" stroke="rgba(196,125,255,.55)" strokeWidth=".9" strokeDasharray="6 9" />
        <circle cx={C} cy={C} r="210" fill="none" stroke="rgba(226,92,128,.45)" strokeWidth=".7" />
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
    <svg viewBox="0 0 640 640" style={{ position: "absolute", right: -270, top: "34%", width: 660, height: 660, opacity: .16 }}>
      <g className="lfg-anim-spinr" style={{ animationDuration: "150s", transformOrigin: "320px 320px" }}>
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
        {ZODIAC.slice(0, 8).map((z, i) => {
          const p = polar(C, C, 292, i * 45 - 90);
          return (
            <text key={z.name} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="20" fill="rgba(255,177,92,.7)">
              {z.glyph}
            </text>
          );
        })}
      </g>
    </svg>
  );
}

function BgConstruction() {
  const crosses: React.ReactNode[] = [];
  for (let y = 180; y < 3400; y += 260) {
    crosses.push(
      <g key={`c${y}`} stroke="rgba(255,177,92,.35)" strokeWidth=".8">
        <path d={`M68 ${y} h8 M72 ${y - 4} v8`} />
        <path d={`M1364 ${y + 120} h8 M1368 ${y + 116} v8`} />
      </g>,
    );
  }
  return (
    <svg viewBox="0 0 1440 3400" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .55 }} aria-hidden>
      {/* vertical hairlines */}
      {[72, 420, 1020, 1368].map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="3400" stroke="rgba(226,92,128,.13)" strokeWidth="1" />
      ))}
      {/* horizontal section boundaries */}
      {[620, 1080, 1560, 2050, 2560, 3060].map((y, i) => (
        <g key={`h${y}`}>
          <line x1="0" y1={y} x2="1440" y2={y} stroke="rgba(226,92,128,.11)" strokeWidth="1" />
          <text x={i % 2 === 0 ? 90 : 1180} y={y - 8} fontSize="9" letterSpacing="3" fill="rgba(160,88,110,.5)" className="lfg-mono">
            {`SECT. ${("0" + (i + 2)).slice(-2)} · ECLIPTIC REF ${(i * 37 + 12) % 360}°`}
          </text>
        </g>
      ))}
      {/* diagonals crossing sections */}
      <line x1="0" y1="700" x2="1440" y2="1180" stroke="rgba(196,125,255,.08)" strokeWidth="1" />
      <line x1="1440" y1="2100" x2="0" y2="2620" stroke="rgba(196,125,255,.08)" strokeWidth="1" />
      <line x1="0" y1="2900" x2="1440" y2="3230" stroke="rgba(255,177,92,.07)" strokeWidth="1" />
      {/* huge circles bleeding off the left/right edges */}
      <circle cx="-90" cy="950" r="300" fill="none" stroke="rgba(226,92,128,.16)" strokeWidth="1" />
      <circle cx="-90" cy="950" r="238" fill="none" stroke="rgba(255,177,92,.12)" strokeWidth=".8" strokeDasharray="3 6" />
      <circle cx="1530" cy="2450" r="360" fill="none" stroke="rgba(226,92,128,.15)" strokeWidth="1" />
      <circle cx="1530" cy="2450" r="292" fill="none" stroke="rgba(196,125,255,.12)" strokeWidth=".8" strokeDasharray="2 6" />
      {crosses}
    </svg>
  );
}

function Background() {
  return (
    <>
      <div className="lfg-bg" aria-hidden>
        <BgRing />
        <BgDiagram />
        {EMBERS.map((e, i) => (
          <span
            key={i}
            className="lfg-ember"
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
      <div className="lfg-bg-page" aria-hidden>
        <BgConstruction />
        {BG_RUNES.map((r, i) => (
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
/* Hero apparatus — floating crystal in a ring                         */
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
  const zodiacRing = ZODIAC.map((z, i) => {
    const p = polar(CX, CY, 232, i * 30 - 90);
    return (
      <text key={z.name} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="14" fill={i % 3 === 0 ? "#ffb15c" : "#b06a82"}>
        {z.glyph}
      </text>
    );
  });
  const diamonds = Array.from({ length: 8 }, (_, i) => {
    const p = polar(CX, CY, 178, i * 45 + 22);
    return <rect key={`d${i}`} x={p.x - 3} y={p.y - 3} width="6" height="6" transform={`rotate(45 ${p.x} ${p.y})`} fill="none" stroke="rgba(255,92,140,.6)" strokeWidth=".8" />;
  });
  return (
    <svg viewBox="0 0 600 580" className="w-full h-auto" role="img" aria-label="Apparatus ring with floating crystal">
      <defs>
        <radialGradient id="lfg-hbg" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="rgba(130,20,64,.42)" />
          <stop offset="55%" stopColor="rgba(64,10,36,.18)" />
          <stop offset="100%" stopColor="rgba(22,5,13,0)" />
        </radialGradient>
        <radialGradient id="lfg-scorchg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(5,1,2,.85)" />
          <stop offset="45%" stopColor="rgba(16,5,6,.5)" />
          <stop offset="75%" stopColor="rgba(30,10,8,.18)" />
          <stop offset="100%" stopColor="rgba(30,10,8,0)" />
        </radialGradient>
        <linearGradient id="lfg-cr1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd7e4" />
          <stop offset="45%" stopColor="#ff3d6e" />
          <stop offset="100%" stopColor="#7a1038" />
        </linearGradient>
        <linearGradient id="lfg-cr2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e6c2ff" />
          <stop offset="55%" stopColor="#a55cff" />
          <stop offset="100%" stopColor="#3d1160" />
        </linearGradient>
        <linearGradient id="lfg-cr3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe2b8" />
          <stop offset="100%" stopColor="#c45a1a" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="600" height="580" fill="url(#lfg-hbg)" />

      {/* tilted orbit ellipse */}
      <ellipse cx={CX} cy={CY} rx="272" ry="88" transform={`rotate(-12 ${CX} ${CY})`} fill="none" stroke="rgba(255,92,140,.3)" strokeWidth=".8" strokeDasharray="4 7" className="lfg-anim-flow" style={{ animationDuration: "48s" }} />
      {[0.08, 0.3, 0.55, 0.82].map((t, i) => {
        const a = t * 360;
        const x = CX + 272 * Math.cos(rad(a));
        const y = CY + 88 * Math.sin(rad(a));
        const hues = ["#ff3d6e", "#ffb15c", "#a55cff", "#ff8a3c"];
        return (
          <g key={`o${i}`} transform={`rotate(-12 ${CX} ${CY})`}>
            <circle cx={x} cy={y} r="9" fill={hues[i]} opacity=".18" className="lfg-anim-pulse" style={{ animationDuration: `${7 + i * 3}s` }} />
            <circle cx={x} cy={y} r="4" fill={hues[i]} opacity=".9" />
            <circle cx={x} cy={y} r="1.4" fill="#fff0f2" />
          </g>
        );
      })}

      {/* static tick ring */}
      <circle cx={CX} cy={CY} r="268" fill="none" stroke="rgba(226,92,128,.25)" strokeWidth=".8" />
      {ticks}
      <text x={CX} y={CY - 248} textAnchor="middle" fontSize="8" letterSpacing="4" fill="#a0586e">DISTILLATION FIELD · STABLE</text>

      {/* rotating zodiac ring */}
      <g className="lfg-anim-spin" style={{ animationDuration: "170s", transformOrigin: "300px 290px" }}>
        <circle cx={CX} cy={CY} r="232" fill="none" stroke="rgba(255,177,92,.3)" strokeWidth=".7" strokeDasharray="2 5" />
        {zodiacRing}
      </g>

      {/* counter-rotating diamond ring */}
      <g className="lfg-anim-spinr" style={{ animationDuration: "110s", transformOrigin: "300px 290px" }}>
        <circle cx={CX} cy={CY} r="178" fill="none" stroke="rgba(165,92,255,.35)" strokeWidth=".7" strokeDasharray="10 6" />
        {diamonds}
      </g>

      <circle cx={CX} cy={CY} r="140" fill="none" stroke="rgba(226,92,128,.3)" strokeWidth=".6" />
      <circle cx={CX} cy={CY} r="112" fill="none" stroke="rgba(255,177,92,.22)" strokeWidth=".6" strokeDasharray="1 4" className="lfg-anim-spin" style={{ animationDuration: "90s", transformOrigin: "300px 290px" }} />

      {/* floating crystal */}
      <g className="lfg-anim-bob" style={{ animationDuration: "10s" }}>
        <polygon points="300,150 344,278 300,418 256,278" fill="rgba(255,61,110,.16)" className="lfg-anim-pulse" style={{ animationDuration: "7s" }} />
        <polygon points="300,164 333,280 300,404 267,280" fill="url(#lfg-cr2)" opacity=".85" />
        <polygon points="300,164 317,280 300,390 283,280" fill="url(#lfg-cr1)" opacity=".92" />
        <polygon points="300,178 309,280 300,362 291,280" fill="#ffe9ee" opacity=".85" className="lfg-anim-flicker" style={{ animationDuration: "5s" }} />
        <line x1="300" y1="164" x2="300" y2="404" stroke="rgba(255,255,255,.4)" strokeWidth=".6" />
        <line x1="267" y1="280" x2="333" y2="280" stroke="rgba(255,255,255,.3)" strokeWidth=".6" />
        {/* pedestal */}
        <ellipse cx="300" cy="432" rx="58" ry="11" fill="rgba(255,138,60,.16)" stroke="rgba(255,138,60,.5)" strokeWidth=".8" />
        <ellipse cx="300" cy="432" rx="32" ry="6" fill="url(#lfg-cr3)" opacity=".7" className="lfg-anim-pulse" style={{ animationDuration: "8s" }} />
      </g>

      {/* scorch marks burned into the floor of the apparatus */}
      <g aria-hidden>
        <ellipse cx="300" cy="442" rx="98" ry="20" fill="url(#lfg-scorchg)" opacity=".8" />
        <ellipse cx="300" cy="440" rx="50" ry="10" fill="url(#lfg-scorchg)" opacity=".9" />
        <ellipse cx="118" cy="216" rx="36" ry="9" fill="url(#lfg-scorchg)" opacity=".55" />
        <ellipse cx="492" cy="460" rx="32" ry="8" fill="url(#lfg-scorchg)" opacity=".5" />
        <ellipse cx="150" cy="470" rx="22" ry="6" fill="url(#lfg-scorchg)" opacity=".35" />
      </g>

      {/* satellite crystals */}
      <g className="lfg-anim-bob" style={{ animationDuration: "13s", animationDelay: "-5s" }}>
        <polygon points="118,140 133,174 118,208 103,174" fill="url(#lfg-cr2)" opacity=".8" />
        <polygon points="118,148 126,174 118,200 110,174" fill="url(#lfg-cr1)" opacity=".85" />
        <line x1="88" y1="174" x2="103" y2="174" stroke="rgba(165,92,255,.4)" strokeWidth=".6" strokeDasharray="2 3" />
      </g>
      <g className="lfg-anim-bob" style={{ animationDuration: "12s", animationDelay: "-8s" }}>
        <polygon points="492,392 505,422 492,452 479,422" fill="url(#lfg-cr2)" opacity=".75" />
        <polygon points="492,400 499,422 492,444 485,422" fill="url(#lfg-cr1)" opacity=".8" />
      </g>

      {/* crosshair markers */}
      <g stroke="rgba(255,177,92,.55)" strokeWidth=".8" fill="none">
        <path d="M300 22 v14 M293 29 h14" />
        <path d="M300 544 v14 M293 551 h14" />
        <path d="M20 290 h14 M27 283 v14" />
        <path d="M566 290 h14 M573 283 v14" />
      </g>
      <text x="52" y="282" fontSize="8" letterSpacing="3" fill="#8f4559">PURE 96.1</text>
      <text x="52" y="308" fontSize="8" letterSpacing="3" fill="#8f4559">FLUX · LOW</text>
      <text x="508" y="52" fontSize="8" letterSpacing="2" fill="#8f4559">Ω 8.31</text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Apparatus tile instruments                                          */
/* ------------------------------------------------------------------ */

function Instrument({ kind, hue }: { kind: Apparatus["instrument"]; hue: string }) {
  const stroke = { stroke: hue, strokeWidth: 1.1, fill: "none" };
  const dim = { stroke: "rgba(226,92,128,.35)", strokeWidth: .7, fill: "none" };
  let body: React.ReactNode = null;
  if (kind === "chart") {
    body = (
      <>
        <circle cx="24" cy="26" r="15" {...stroke} />
        <circle cx="24" cy="26" r="9" {...dim} />
        <path d="M24 11 L24 41 M9 26 L39 26 M13.5 15.5 L34.5 36.5 M34.5 15.5 L13.5 36.5" {...dim} />
        <circle cx="24" cy="26" r="2.4" fill={hue} className="lfg-anim-pulse" style={{ animationDuration: "6s" }} />
        <path d="M24 6 v5 M24 41 v5" {...stroke} />
      </>
    );
  } else if (kind === "flask") {
    body = (
      <>
        <ellipse cx="24" cy="46.5" rx="15" ry="3" fill="rgba(5,1,2,.6)" />
        <ellipse cx="24" cy="46.2" rx="8" ry="1.6" fill="rgba(20,7,4,.55)" />
        <path d="M21 6 L27 6 L27 16 L36 38 A3.5 3.5 0 0 1 33 43 L15 43 A3.5 3.5 0 0 1 12 38 L21 16 Z" {...stroke} />
        <path d="M16.5 30 L31.5 30" {...dim} />
        <path d="M15 36 A9 4 0 0 0 33 36" fill={hue} opacity=".28" className="lfg-anim-pulse" style={{ animationDuration: "8s" }} />
        <circle cx="21" cy="35" r="1.4" fill={hue} opacity=".8" className="lfg-anim-pulse" style={{ animationDuration: "5s" }} />
        <circle cx="27" cy="37" r="1" fill={hue} opacity=".7" className="lfg-anim-pulse" style={{ animationDuration: "7s" }} />
        {/* reagent drip down the flask's flank */}
        <path d="M33.2 32 C33.8 36 33.6 40 33.2 43" stroke="rgba(150,75,20,.45)" strokeWidth=".8" fill="none" strokeLinecap="round" />
        <circle cx="33.2" cy="43.6" r="1.1" fill="rgba(150,75,20,.45)" />
      </>
    );
  } else if (kind === "vessels") {
    body = (
      <>
        <circle cx="15" cy="24" r="9" {...stroke} />
        <circle cx="33" cy="24" r="9" {...stroke} />
        <path d="M15 15 C15 9 33 9 33 15" {...dim} />
        <path d="M15 33 L15 43 M33 33 L33 43 M11 43 L19 43 M29 43 L37 43" {...dim} />
        <circle cx="24" cy="24" r="2.2" fill={hue} className="lfg-anim-pulse" style={{ animationDuration: "6s" }} />
      </>
    );
  } else if (kind === "chamber") {
    body = (
      <>
        <rect x="11" y="8" width="26" height="34" rx="3" {...stroke} />
        <rect x="15" y="12" width="18" height="26" rx="2" {...dim} />
        <path d="M24 16 L27.5 22 L24 28 L20.5 22 Z" fill={hue} opacity=".55" className="lfg-anim-pulse" style={{ animationDuration: "7s" }} />
        <path d="M24 30 L24 34 M20 34 L28 34" {...stroke} />
      </>
    );
  } else if (kind === "coils") {
    body = (
      <>
        <path d="M14 8 C20 12 28 12 34 8 M14 16 C20 20 28 20 34 16 M14 24 C20 28 28 28 34 24 M14 32 C20 36 28 36 34 32 M14 40 C20 44 28 44 34 40" {...stroke} />
        <path d="M24 4 L24 8 M24 40 L24 46" {...dim} />
        <circle cx="24" cy="24" r="2.4" fill={hue} className="lfg-anim-pulse" style={{ animationDuration: "5s" }} />
      </>
    );
  } else {
    body = (
      <>
        <path d="M24 5 L39 13 L39 33 L24 43 L9 33 L9 13 Z" {...stroke} />
        <path d="M24 12 L33 17 L33 29 L24 34 L15 29 L15 17 Z" {...dim} />
        <path d="M24 17 L26.5 22 L32 24 L26.5 26 L24 31 L21.5 26 L16 24 L21.5 22 Z" fill={hue} opacity=".6" className="lfg-anim-pulse" style={{ animationDuration: "6s" }} />
      </>
    );
  }
  return (
    <svg width="48" height="50" viewBox="0 0 48 50" aria-hidden style={{ filter: `drop-shadow(0 0 6px ${hue})` }}>
      {body}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Destiny Matrix octagram                                             */
/* ------------------------------------------------------------------ */

function Octagram() {
  const C = 130;
  const pts8 = Array.from({ length: 8 }, (_, i) => polar(C, C, 108, i * 45 - 90));
  const inner = Array.from({ length: 8 }, (_, i) => polar(C, C, 46, i * 45 - 90));
  const labels = ["PURPOSE", "LOVE", "MONEY", "AGE", "KARMA", "TALENT", "UNION", "PATH"];
  const sq1 = [0, 2, 4, 6].map((i) => pts8[i]);
  const sq2 = [1, 3, 5, 7].map((i) => pts8[i]);
  const poly = (pp: { x: number; y: number }[]) => pp.map((p) => `${p.x},${p.y}`).join(" ");
  return (
    <svg viewBox="0 0 260 260" className="w-full h-auto" role="img" aria-label="Destiny Matrix octagram">
      <circle cx={C} cy={C} r="122" fill="none" stroke="rgba(226,92,128,.3)" strokeWidth=".7" />
      <circle cx={C} cy={C} r="108" fill="none" stroke="rgba(255,177,92,.3)" strokeWidth=".6" strokeDasharray="2 4" />
      {Array.from({ length: 48 }, (_, i) => {
        const p1 = polar(C, C, 122, i * 7.5);
        const p2 = polar(C, C, i % 6 === 0 ? 114 : 118, i * 7.5);
        return <line key={`tk${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(226,92,128,.3)" strokeWidth=".6" />;
      })}
      <g className="lfg-anim-spin" style={{ animationDuration: "160s", transformOrigin: "130px 130px" }}>
        <polygon points={poly(sq1)} fill="none" stroke="rgba(255,92,140,.6)" strokeWidth="1" />
        <polygon points={poly(sq2)} fill="none" stroke="rgba(196,125,255,.55)" strokeWidth="1" />
      </g>
      {pts8.map((p, i) => <line key={i} x1={p.x} y1={p.y} x2={inner[i].x} y2={inner[i].y} stroke="rgba(226,92,128,.35)" strokeWidth=".6" />)}
      <circle cx={C} cy={C} r="46" fill="rgba(32,7,20,.88)" stroke="rgba(255,92,140,.5)" strokeWidth=".8" />
      <text x={C} y={C - 4} textAnchor="middle" fontSize="10" letterSpacing="2.5" fill="#eebcc9">DESTINY</text>
      <text x={C} y={C + 11} textAnchor="middle" fontSize="10" letterSpacing="2.5" fill="#ff5c85">MATRIX</text>
      {pts8.map((p, i) => (
        <g key={`n${i}`}>
          <circle cx={p.x} cy={p.y} r="5" fill="rgba(255,61,110,.25)" className="lfg-anim-pulse" style={{ animationDuration: `${6 + i}s` }} />
          <circle cx={p.x} cy={p.y} r="2.2" fill={i % 2 === 0 ? "#ff5c85" : "#c47dff"} />
          <text x={p.x} y={p.y - 13} textAnchor="middle" fontSize="7" letterSpacing="1.5" fill="#a0586e">{labels[i]}</text>
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ForgePage() {
  return (
    <main className="lfg-root min-h-screen">
      <style>{CSS}</style>

      {/* deep background: rings, runes, construction lines, embers */}
      <Background />

      {/* dust-noise + fine-scratch overlays, fixed above the whole page */}
      <div className="lfg-grime-noise" aria-hidden />
      <div className="lfg-scratches" aria-hidden />

      <div className="relative" style={{ zIndex: 1 }}>
        {/* ============================================================ */}
        {/* 1 · TOP BAR — full bleed                                      */}
        {/* ============================================================ */}
        <header className="lfg-panel" style={{ borderLeft: "none", borderRight: "none", borderTop: "none" }}>
          <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
            <span className="lfg-hdot" />
            <a href="#" className="lfg-caps lfg-mono" style={{ fontSize: 12, color: "#ffd9e2", textShadow: "0 0 10px rgba(255,61,110,.6)", textDecoration: "none" }}>
              ASTRO SCOPE
            </a>
            <span className="lfg-caps-sm lfg-mono hidden md:inline" style={{ color: "#8f4559" }}>LAB. UNIT 07</span>
            <span className="lfg-rule" style={{ flex: 1 }} />
            <nav className="flex items-center gap-4 sm:gap-6">
              {["HOROSCOPES", "TAROT", "COMPATIBILITY"].map((n) => (
                <a key={n} href="#" className="lfg-caps-sm lfg-mono hidden sm:inline" style={{ color: "#cf93a6", textDecoration: "none" }}>
                  {n}
                </a>
              ))}
              <a href="#" className="lfg-btn-ghost" style={{ padding: "7px 14px" }}>
                SIGN IN
              </a>
            </nav>
          </div>
          <div className="lfg-ticks" />
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
                <span className="lfg-hdot" />
                <span className="lfg-caps lfg-mono" style={{ fontSize: 11, color: "#ff8aa8", textShadow: "0 0 10px rgba(255,61,110,.7)" }}>
                  ARCANA LABORATORIUM
                </span>
                <span className="lfg-rule" style={{ width: 60 }} />
                <span className="lfg-caps-sm lfg-mono" style={{ color: "#8f4559" }}>EST. FORGE 01</span>
              </div>

              <h1 className="mt-7" style={{ fontSize: "clamp(38px, 5.6vw, 64px)", lineHeight: 1.06, color: "#ffeef2", fontWeight: 400, transform: "rotate(-.5deg)", transformOrigin: "left center" }}>
                We distill the sky
                <br />
                into{" "}
                <em style={{ color: "#ff5c85", textShadow: "0 0 22px rgba(255,61,110,.75)", fontStyle: "italic" }}>
                  answers.
                </em>
              </h1>

              <p className="mt-6 max-w-md" style={{ fontSize: 16, lineHeight: 1.75, color: "#d5a0b0" }}>
                Birth charts cast to the arc-minute. Horoscopes drawn fresh each morning. Tarot, synastry and the Destiny
                Matrix — every reading measured, weighed and sealed in the forge.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a href="#" className="lfg-btn" style={{ textDecoration: "none" }}>
                  <span className="lfg-hdot" style={{ background: "#ffd9e2", boxShadow: "0 0 6px #ffd9e2" }} />
                  CAST YOUR FREE BIRTH CHART
                </a>
                <a href="#" className="lfg-btn-ghost" style={{ textDecoration: "none" }}>
                  READ TODAY&rsquo;S HOROSCOPE →
                </a>
              </div>

              {/* hero micro-readouts — tilted, wider than the column */}
              <div
                className="lfg-panel mt-11 grid grid-cols-3 divide-x"
                style={{ borderColor: "rgba(226,92,128,.2)", transform: "rotate(.5deg)", width: "calc(100% + 56px)", marginLeft: -14 }}
              >
                <PanelGrime v={2} />
                {[
                  { k: "CHARTS CAST", v: "2,418,733", h: "#ff5c85" },
                  { k: "PRECISION", v: "0.004°", h: "#ffb15c" },
                  { k: "FIELD STATE", v: "STABLE", h: "#c47dff" },
                ].map((r) => (
                  <div key={r.k} className="px-4 py-3" style={{ borderColor: "rgba(226,92,128,.16)" }}>
                    <div className="lfg-caps-sm" style={{ color: "#8f4559" }}>{r.k}</div>
                    <div className="lfg-mono mt-1" style={{ fontSize: 15, color: r.h, textShadow: `0 0 9px ${r.h}` }}>{r.v}</div>
                  </div>
                ))}
              </div>
              <div className="lfg-ticks mt-1" style={{ opacity: .5, width: "80%" }} />
            </div>

            <div className="lfg-hero-bleed">
              <CornerTicks />
              <HeroApparatus />
              <div className="lfg-smoke" style={{ left: "41%", bottom: "15%", animationDuration: "44s" }} aria-hidden />
              <div className="lfg-smoke" style={{ left: "55%", bottom: "12%", width: 64, height: 64, animationDuration: "58s", animationDelay: "-26s" }} aria-hidden />
              <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2">
                <span className="lfg-hdot lfg-anim-pulse" style={{ animationDuration: "4s" }} />
                <span className="lfg-caps-sm lfg-mono" style={{ color: "#a0586e" }}>APPARATUS RING · ONLINE</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3 · ESSENCE STRIP — wider than the column, orbs cross borders */}
        {/* ============================================================ */}
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="lfg-panel" style={{ margin: "0 -26px", transform: "rotate(-.3deg)" }}>
            <PanelHead title="Distilled Essences" right="5 PHASES · LIVE" />
            <PanelGrime v={0} />
            <div className="relative grid grid-cols-2 gap-3 p-4 pt-6 sm:grid-cols-3 lg:grid-cols-5" style={{ marginTop: -34, zIndex: 2 }}>
              {ESSENCES.map((e, i) => (
                <EssenceOrb key={e.name} e={e} dirt={ORB_DIRT[i]} />
              ))}
            </div>
            <div className="flex items-center gap-3 px-4 pb-3">
              <span className="lfg-caps-sm lfg-mono" style={{ color: "#8f4559" }}>CONDENSATE FLOW</span>
              <div className="lfg-bar" style={{ flex: 1 }}>
                <i className="lfg-anim-pulse" style={{ width: "78%", animationDuration: "9s" }} />
              </div>
              <span className="lfg-mono" style={{ fontSize: 11, color: "#ffb15c", textShadow: "0 0 8px rgba(255,138,60,.7)" }}>78.0%</span>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4 · SIGN BAND — jostled, overlapping cells                    */}
        {/* ============================================================ */}
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="mb-5 flex items-center gap-4">
            <span className="lfg-engrave">The Twelve Chambers</span>
            <span className="lfg-rule" style={{ flex: 1 }} />
            <span className="lfg-caps-sm lfg-mono" style={{ color: "#8f4559" }}>ECLIPTIC 360° / 12</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {ZODIAC.map((z, i) => (
              <a key={z.name} href="#" className="lfg-sign" style={{ textDecoration: "none", transform: SIGN_DIRT[i] }}>
                <span className="lfg-caps-sm lfg-mono" style={{ color: "#6e3a4a", fontSize: 7 }}>
                  CH.{String(i + 1).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontSize: 24,
                    lineHeight: 1.2,
                    color: i % 3 === 0 ? "#ffb15c" : i % 3 === 1 ? "#ff8aa8" : "#c47dff",
                    textShadow: `0 0 12px ${i % 3 === 0 ? "rgba(255,138,60,.7)" : i % 3 === 1 ? "rgba(255,61,110,.7)" : "rgba(165,92,255,.7)"}`,
                  }}
                >
                  {z.glyph}
                </span>
                <span className="lfg-caps-sm" style={{ color: "#eebcc9", fontSize: 10 }}>{z.name}</span>
                <span className="lfg-mono" style={{ fontSize: 8, color: "#8f4559", letterSpacing: ".08em" }}>{z.dates}</span>
              </a>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5 · SIX APPARATUS SECTIONS — wide strip, tilted overlap       */}
        {/* ============================================================ */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6" style={{ paddingBottom: 84 }}>
          <div className="mb-6 flex items-center gap-4">
            <span className="lfg-hdot" />
            <h2 className="lfg-caps" style={{ fontSize: 14, color: "#ffeef2", margin: 0 }}>Instruments of the Forge</h2>
            <span className="lfg-rule" style={{ flex: 1 }} />
            <span className="lfg-caps-sm lfg-mono" style={{ color: "#8f4559" }}>6 UNITS · CALIBRATED</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((s, i) => (
              <article key={s.title} className="lfg-panel lfg-tile flex flex-col" style={{ transform: TILE_DIRT[i] }}>
                <CornerTicks />
                {i % 2 === 1 ? <PanelGrime v={i} /> : null}
                <div className="flex items-start justify-between gap-3 px-5 pt-5">
                  <Instrument kind={s.instrument} hue={s.hue} />
                  <span
                    className="lfg-caps-sm lfg-mono"
                    style={{
                      color: s.hue,
                      border: `1px solid ${s.hue}55`,
                      padding: "3px 8px",
                      textShadow: `0 0 8px ${s.hue}`,
                      background: "rgba(22,5,13,.6)",
                    }}
                  >
                    {s.tag}
                  </span>
                </div>
                <h3 className="lfg-caps mt-4 px-5" style={{ fontSize: 15, color: "#ffeef2", margin: 0, marginTop: 16, paddingLeft: 20, paddingRight: 20 }}>
                  {s.title}
                </h3>
                <p className="mt-2 px-5" style={{ fontSize: 13.5, lineHeight: 1.7, color: "#cf9dad", margin: 0, marginTop: 8, paddingLeft: 20, paddingRight: 20, flex: 1 }}>
                  {s.copy}
                </p>
                <div className="mx-5 mt-4 flex items-center justify-between gap-3" style={{ borderTop: "1px solid rgba(226,92,128,.16)", paddingTop: 10, paddingBottom: 14 }}>
                  <span className="lfg-caps-sm lfg-mono" style={{ color: "#8f4559", fontSize: 7 }}>{s.readout}</span>
                  <a href="#" className="lfg-caps-sm lfg-mono" style={{ color: s.hue, textDecoration: "none", textShadow: `0 0 8px ${s.hue}`, fontSize: 10 }}>
                    EXPLORE →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 6 · DESTINY MATRIX BAND — full bleed, octagram off the edge   */}
        {/* ============================================================ */}
        <section className="lfg-panel" style={{ borderLeft: "none", borderRight: "none" }}>
          <PanelGrime v={1} />
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[.9fr_1.1fr]">
            <div className="relative mx-auto w-full max-w-xs" style={{ transform: "translateX(-16%) rotate(-7deg)" }}>
              <CornerTicks c="rgba(196,125,255,.5)" />
              <Octagram />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="lfg-hdot" style={{ background: "#c47dff", boxShadow: "0 0 6px #c47dff" }} />
                <span className="lfg-caps lfg-mono" style={{ fontSize: 11, color: "#c47dff", textShadow: "0 0 10px rgba(165,92,255,.7)" }}>
                  OPTIONAL INSTRUMENT
                </span>
                <span className="lfg-rule" style={{ width: 48 }} />
              </div>
              <h2 className="mt-5" style={{ fontSize: "clamp(26px, 3.4vw, 40px)", lineHeight: 1.15, color: "#ffeef2", fontWeight: 400, margin: 0, marginTop: 20 }}>
                The Destiny Matrix
              </h2>
              <p className="mt-4 max-w-lg" style={{ fontSize: 15, lineHeight: 1.75, color: "#d5a0b0" }}>
                An optional birth-date octagram tool. It maps purpose, love, money, and age themes from your birth date.
              </p>
              <div className="mt-5 grid max-w-md grid-cols-2 gap-2">
                {["8 ARCANA NODES", "22 PATH WEIGHTS", "AGE CYCLES · 10Y", "DUAL SQUARE SEAL"].map((t) => (
                  <div key={t} className="flex items-center gap-2" style={{ border: "1px solid rgba(226,92,128,.16)", padding: "6px 10px", background: "rgba(22,5,13,.5)" }}>
                    <span className="lfg-hdot" style={{ width: 4, height: 4 }} />
                    <span className="lfg-caps-sm lfg-mono" style={{ color: "#cf93a6", fontSize: 8 }}>{t}</span>
                  </div>
                ))}
              </div>
              <a href="#" className="lfg-btn-ghost mt-7 inline-flex" style={{ textDecoration: "none", borderColor: "rgba(196,125,255,.45)", color: "#d8b3ff" }}>
                OPEN DESTINY MATRIX →
              </a>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 7 · ACTIVE RITUAL + TODAY — tilted wide panel                 */}
        {/* ============================================================ */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="lfg-panel" style={{ transform: "rotate(-.5deg)", margin: "0 -10px" }}>
            <PanelHead title="Active Ritual" right="CYCLE 03 / 07" />
            <PanelGrime v={2} />
            <div className="px-5 pt-5">
              <div className="flex items-center gap-3">
                <span className="lfg-caps-sm lfg-mono" style={{ color: "#cf93a6", whiteSpace: "nowrap" }}>MORNING DISTILLATION</span>
                <div className="lfg-bar" style={{ flex: 1 }}>
                  <i className="lfg-anim-pulse" style={{ width: "64%", animationDuration: "8s" }} />
                </div>
                <span className="lfg-mono" style={{ fontSize: 13, color: "#ff5c85", textShadow: "0 0 9px rgba(255,61,110,.8)" }}>64.0%</span>
                <span className="lfg-caps-sm lfg-mono hidden sm:inline" style={{ color: "#8f4559" }}>ETA 02:14:38</span>
              </div>
              <div className="lfg-ticks mt-2" style={{ opacity: .45 }} />
            </div>
            <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-3">
              {TODAY.map((t, i) => (
                <div key={t.label} className="relative px-4 py-3" style={{ border: "1px solid rgba(226,92,128,.18)", background: "rgba(22,5,13,.55)", transform: TODAY_DIRT[i] }}>
                  <CornerTicks c="rgba(226,92,128,.3)" />
                  <div className="flex items-center gap-2">
                    <span className="lfg-hdot lfg-anim-pulse" style={{ width: 4, height: 4, background: t.hue, boxShadow: `0 0 6px ${t.hue}`, animationDuration: "5s" }} />
                    <span className="lfg-caps-sm" style={{ color: "#8f4559" }}>{t.label}</span>
                  </div>
                  <div className="lfg-mono mt-2" style={{ fontSize: 15, color: t.hue, textShadow: `0 0 10px ${t.hue}` }}>{t.value}</div>
                  <div className="lfg-caps-sm lfg-mono mt-1" style={{ color: "#6e3a4a", fontSize: 8 }}>{t.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 8 · FAQ — EXPERIMENT NOTES, staggered off-center              */}
        {/* ============================================================ */}
        <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:ml-[8%]">
          <div className="mb-6 flex items-center gap-4">
            <span className="lfg-hdot" />
            <h2 className="lfg-caps" style={{ fontSize: 14, color: "#ffeef2", margin: 0 }}>Experiment Notes</h2>
            <span className="lfg-rule" style={{ flex: 1 }} />
            <span className="lfg-caps-sm lfg-mono" style={{ color: "#8f4559" }}>4 ENTRIES</span>
          </div>
          <div className="flex flex-col gap-3">
            {FAQ.map((f, i) => (
              <details key={f.id} className="lfg-faq" style={FAQ_DIRT[i]}>
                <summary>
                  <span className="lfg-caps-sm lfg-mono" style={{ color: "#8f4559", whiteSpace: "nowrap" }}>{f.id}</span>
                  <span style={{ fontSize: 15, color: "#f3d3dc", flex: 1 }}>{f.q}</span>
                  <span className="lfg-faq-x lfg-mono" style={{ color: "#ff5c85", fontSize: 14, textShadow: "0 0 8px rgba(255,61,110,.7)" }}>+</span>
                </summary>
                <div style={{ borderTop: "1px solid rgba(226,92,128,.16)", padding: "12px 16px 14px 16px" }}>
                  <p style={{ fontSize: 13.5, lineHeight: 1.75, color: "#cf9dad", margin: 0 }}>{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 9 · CTA — full bleed                                          */}
        {/* ============================================================ */}
        <section className="lfg-panel" style={{ borderLeft: "none", borderRight: "none" }}>
          <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
            <CornerTicks />
            <PanelGrime v={0} />
            <div className="lfg-ticks mx-auto mb-8" style={{ width: 180, opacity: .6 }} />
            <h2 style={{ fontSize: "clamp(26px, 4vw, 44px)", lineHeight: 1.2, color: "#ffeef2", fontWeight: 400, margin: 0 }}>
              Your chart is written in the stars.
              <br />
              <em style={{ color: "#ffb15c", textShadow: "0 0 20px rgba(255,138,60,.7)" }}>Come read it.</em>
            </h2>
            <p className="mx-auto mt-5 max-w-md" style={{ fontSize: 14.5, lineHeight: 1.75, color: "#d5a0b0" }}>
              The forge is warm, the instruments are tuned. Casting takes less than a minute.
            </p>
            <a href="#" className="lfg-btn mt-9 inline-flex" style={{ textDecoration: "none", fontSize: 11, padding: "13px 30px" }}>
              <span className="lfg-hdot" style={{ background: "#ffd9e2", boxShadow: "0 0 6px #ffd9e2" }} />
              GET STARTED — IT&rsquo;S FREE
            </a>
            <div className="lfg-ticks mx-auto mt-8" style={{ width: 180, opacity: .6 }} />
          </div>
        </section>

        {/* ============================================================ */}
        {/* 10 · FOOTER                                                   */}
        {/* ============================================================ */}
        <footer className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="lfg-hdot" />
                <span className="lfg-caps lfg-mono" style={{ fontSize: 11, color: "#ffd9e2" }}>ASTRO SCOPE</span>
              </div>
              <p className="mt-3" style={{ fontSize: 12.5, lineHeight: 1.7, color: "#a06a7c" }}>
                Arcana Laboratorium — charts, horoscopes, tarot and synastry, distilled nightly.
              </p>
            </div>
            <div>
              <span className="lfg-engrave">Instruments</span>
              <ul className="mt-3 flex flex-col gap-2" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {["Birth Chart", "Daily Horoscope", "Compatibility", "Tarot", "Destiny Matrix"].map((n) => (
                  <li key={n}>
                    <a href="#" className="lfg-caps-sm lfg-mono" style={{ color: "#cf93a6", textDecoration: "none", fontSize: 10 }}>
                      {n}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="lfg-engrave">Laboratory</span>
              <ul className="mt-3 flex flex-col gap-2" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {["Cosmic Passport", "Psychology Tests", "Premium", "Sign In"].map((n) => (
                  <li key={n}>
                    <a href="#" className="lfg-caps-sm lfg-mono" style={{ color: "#cf93a6", textDecoration: "none", fontSize: 10 }}>
                      {n}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* lab-status strip — juts wider than the footer column */}
          <div className="lfg-panel mt-10" style={{ margin: "40px -22px 0", transform: "rotate(.3deg)" }}>
            <PanelGrime v={1} />
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5">
              {[
                { k: "FORGE", v: "WARM", h: "#ff5c85" },
                { k: "RETORTS", v: "12/12", h: "#ffb15c" },
                { k: "AETHER", v: "92.6", h: "#c47dff" },
                { k: "RITUAL", v: "64.0%", h: "#ff8a3c" },
                { k: "SEAL", v: "INTACT", h: "#ff5c85" },
              ].map((s) => (
                <span key={s.k} className="flex items-center gap-2">
                  <span className="lfg-hdot lfg-anim-pulse" style={{ width: 4, height: 4, background: s.h, boxShadow: `0 0 5px ${s.h}`, animationDuration: "6s" }} />
                  <span className="lfg-caps-sm lfg-mono" style={{ color: "#8f4559", fontSize: 8 }}>{s.k}</span>
                  <span className="lfg-mono" style={{ fontSize: 10, color: s.h, textShadow: `0 0 7px ${s.h}` }}>{s.v}</span>
                </span>
              ))}
              <span className="lfg-rule" style={{ flex: 1, minWidth: 30 }} />
              <span className="lfg-caps-sm lfg-mono lfg-anim-flicker" style={{ color: "#a0586e", animationDuration: "9s", fontSize: 8 }}>
                LAB STATUS · ALL SYSTEMS NOMINAL
              </span>
            </div>
          </div>
          <div className="lfg-ticks mt-1" style={{ opacity: .4 }} />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="lfg-caps-sm lfg-mono" style={{ color: "#6e3a4a", fontSize: 8 }}>© ASTRO SCOPE · ARCANA LABORATORIUM</span>
            <span className="lfg-caps-sm lfg-mono" style={{ color: "#6e3a4a", fontSize: 8 }}>DISTILLATION LOG · VOL. VII</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
