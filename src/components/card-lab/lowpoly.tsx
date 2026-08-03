/**
 * Card Lab — LOWPOLY style.
 * Faceted, crystalline low-poly illustrations of the Major Arcana: each
 * supported `number` (1, 3, 7, 9, 10, 13, 17, 22) draws its own bespoke
 * scene of flat polygons; any other number falls back to the canonical
 * Hermit. All scenes share the six effect layers, so the shimmer waves,
 * facet flash, hover parallax, and glow/spin treatments apply uniformly.
 * Reusable via optional props: { number, name, variant } — with defaults it
 * renders the original Hermit card pixel-for-pixel. variant 0-7 selects one
 * of 4 hue-rotated palettes x 2 orientations (mirrored composition).
 * Self-contained: inline SVG + scoped <style> (prefix `cl-lowpoly-`).
 */
import { toRoman } from "@/lib/roman";
import type { ReactNode } from "react";

type Facet = {
  points: string;
  fill: string;
  opacity?: number;
  className?: string;
};

/* Sky — two triangulated strips grading deep indigo -> violet -> teal. */
const SKY: Facet[] = [
  { points: "0,0 66,0 62,84", fill: "#191340" },
  { points: "0,0 62,84 0,92", fill: "#151036" },
  { points: "66,0 133,0 138,94", fill: "#1e1752" },
  { points: "66,0 138,94 62,84", fill: "#1a1445" },
  { points: "133,0 200,0 200,86", fill: "#221a5a" },
  { points: "133,0 200,86 138,94", fill: "#1d1650" },
  { points: "0,92 62,84 75,172", fill: "#2a2166" },
  { points: "0,92 75,172 0,182", fill: "#241d5e" },
  { points: "62,84 138,94 140,182", fill: "#2e2a6b" },
  { points: "62,84 140,182 75,172", fill: "#282464" },
  { points: "138,94 200,86 200,174", fill: "#2a3c6e" },
  { points: "138,94 200,174 140,182", fill: "#263468" },
];

/* Tiny 4-point star facets in the sky. */
const STARS: Facet[] = [
  { points: "42,35 44,38 42,41 40,38", fill: "#e8e2f2", opacity: 0.85 },
  { points: "168,80 169.6,82 168,84 166.4,82", fill: "#e8e2f2", opacity: 0.7 },
];

/* Distant teal ridges behind the main peak. */
const RIDGES: Facet[] = [
  { points: "0,190 60,160 112,222", fill: "#12303f" },
  { points: "200,182 148,158 96,222", fill: "#0f2c3a" },
];

/* The mountain peak the Hermit stands on. Lantern side faces warmer. */
const PEAK: Facet[] = [
  { points: "45,235 100,183 100,235", fill: "#3a2f63" },
  { points: "100,183 155,235 100,235", fill: "#4a3364" },
  { points: "91,196 100,183 109,196", fill: "#7f6fb0" },
];

/* Foreground shards, darkest teal-indigo. */
const FOREGROUND: Facet[] = [
  { points: "0,244 70,222 0,300", fill: "#16243a" },
  { points: "70,222 80,300 0,300", fill: "#121c30" },
  { points: "70,222 140,240 80,300", fill: "#182a40" },
  { points: "140,240 200,228 200,300", fill: "#142033" },
  { points: "140,240 200,300 80,300", fill: "#0e1828" },
];

/* The Hermit: hood, cloak facets, raised right arm, staff in left hand. */
const FIGURE: Facet[] = [
  { points: "74.6,100 77.4,100 77.4,190 74.6,190", fill: "#4a3866" }, // staff
  { points: "76,93 73.5,100 78.5,100", fill: "#6b5590" }, // staff knob
  { points: "86,120 78,122 87,132", fill: "#241a42" }, // left arm to staff
  { points: "100,95 86,116 114,116", fill: "#251a48" }, // hood
  { points: "100,106 92.5,116 107.5,116", fill: "#0d0818" }, // hood shadow
  { points: "86,116 100,122 80,185", fill: "#1d1538" }, // cloak left
  { points: "100,122 100,185 80,185", fill: "#171030" },
  { points: "114,116 120,185 100,122", fill: "#31245c" }, // cloak right (lit)
  { points: "100,122 120,185 100,185", fill: "#241a48" },
  { points: "112,124 118,150 113,158", fill: "#8a5a3a" }, // lantern-warm rim
  { points: "110,116 126,96 116,124", fill: "#3b2b66" }, // raised arm
  { points: "126,96 131,100 116,124", fill: "#453271" },
  { points: "126,96 132,94 131,101", fill: "#c98f4a" }, // hand
];

/* Lantern: bronze cap/handle, four gold body facets around a star core. */
const LANTERN: Facet[] = [
  { points: "133,72.5 129.5,76 136.5,76", fill: "#8a5f30" },
  { points: "129.5,76 136.5,76 137.5,78 128.5,78", fill: "#6b4a26" },
  { points: "128.5,78 137.5,78 133,84.5", fill: "#ffe9a8", className: "cl-lowpoly-lf" },
  { points: "137.5,78 138,90 133,84.5", fill: "#f7c25c", className: "cl-lowpoly-lf cl-lowpoly-lf2" },
  { points: "138,90 128,90 133,84.5", fill: "#e09a35", className: "cl-lowpoly-lf cl-lowpoly-lf3" },
  { points: "128,90 128.5,78 133,84.5", fill: "#ffd97a", className: "cl-lowpoly-lf cl-lowpoly-lf4" },
  { points: "130,90 136,90 133,96", fill: "#6b4a26" },
];

const STAR_CORE: Facet = {
  points:
    "133,80.2 134.3,83.2 137.8,84.5 134.3,85.8 133,88.8 131.7,85.8 128.2,84.5 131.7,83.2",
  fill: "#fff8e2",
  className: "cl-lowpoly-core",
};

/* ------------------------------------------------------------------ *
 * Scenes — one bespoke low-poly illustration per arcana. Every scene
 * fills the same six effect layers (sky/stars/ridge/peak/figure/fore)
 * so the shimmer waves, facet flash, hover parallax, and mount fade
 * behave identically; `glow`+`core` mark the scene's light source and
 * inherit the lantern's flicker/spin/hover-swell treatment.
 * ------------------------------------------------------------------ */
type Scene = {
  stars?: Facet[];
  ridge?: Facet[];
  peak?: Facet[];
  figure: Facet[];
  fore: Facet[];
  glow?: { cx: number; cy: number; rx: number; ry: number };
  core?: Facet;
  extra?: ReactNode; // drawn inside the figure layer, before the core
};

/* Simple low ground used by scenes without bespoke terrain. */
const GROUND: Facet[] = [
  { points: "0,246 100,238 100,300 0,300", fill: "#141c30" },
  { points: "100,238 200,246 200,300 100,300", fill: "#101828" },
  { points: "0,246 100,238 200,246 100,256", fill: "#182238" },
];

/* IX — The Hermit (canonical scene, unchanged). */
const HERMIT: Scene = {
  stars: STARS,
  ridge: RIDGES,
  peak: PEAK,
  figure: FIGURE,
  fore: FOREGROUND,
  glow: { cx: 133, cy: 84.5, rx: 32, ry: 29 },
  core: STAR_CORE,
  extra: <Facets facets={LANTERN} />,
};

/* I — The Magician: wand arm raised, lemniscate overhead, table of tools. */
const MAGICIAN: Scene = {
  stars: STARS,
  ridge: RIDGES,
  figure: [
    { points: "100,114 87,124 84,198 100,198", fill: "#a03040" }, // robe
    { points: "100,114 113,124 116,198 100,198", fill: "#b03848" },
    { points: "100,114 95,124 105,124", fill: "#e8e2f2" }, // white under-robe
    { points: "95,102 105,102 106,114 94,114", fill: "#d9a06b" }, // head
    { points: "95,102 105,102 104,96 96,96", fill: "#4a3626" }, // hair
    { points: "90,120 78,94 84,91 96,116", fill: "#a03040" }, // raised arm
    { points: "78,94 80,88 84,91", fill: "#d9a06b" }, // hand
    { points: "79,70 82,70 81,90 78,90", fill: "#e8c36a", className: "cl-lowpoly-lf" }, // wand
    { points: "110,120 122,148 116,152 104,126", fill: "#8a2838" }, // lowered arm
    { points: "118,150 124,152 119,158", fill: "#d9a06b" },
    { points: "28,198 100,198 100,230 22,230", fill: "#6b4a26" }, // table
    { points: "100,198 172,198 178,230 100,230", fill: "#7a5530" },
    { points: "28,198 172,198 170,204 30,204", fill: "#8a5f30" },
    { points: "44,208 56,208 52,218 48,218", fill: "#d9d9e8" }, // cup
    { points: "46,218 54,218 54,221 46,221", fill: "#b8b8cc" },
    { points: "84,206 81,222 87,222", fill: "#cfd4e8" }, // sword
    { points: "79,222 89,222 89,224.5 79,224.5", fill: "#e8c36a" },
    { points: "116,207 121.8,211.2 119.6,218.8 112.4,218.8 110.2,211.2", fill: "#e8c36a" }, // pentacle
    { points: "146,207 149,207 148,224 145,224", fill: "#c98f4a" }, // table wand
  ],
  fore: GROUND,
  glow: { cx: 80.5, cy: 68, rx: 18, ry: 16 },
  core: {
    points: "80.5,63 82,66.5 85.5,68 82,69.5 80.5,73 79,69.5 75.5,68 79,66.5",
    fill: "#fff8e2",
    className: "cl-lowpoly-core",
  },
  extra: (
    <path
      d="M91,88 C91,82.5 97.5,82.5 100,88 C102.5,93.5 109,93.5 109,88 C109,82.5 102.5,82.5 100,88 C97.5,93.5 91,93.5 91,88 Z"
      fill="none"
      stroke="#ffd97a"
      strokeWidth="1.8"
      opacity="0.9"
    />
  ),
};

/* III — The Empress: star crown, heart shield with Venus glyph, wheat. */
const EMPRESS: Scene = {
  stars: STARS,
  ridge: [
    { points: "0,196 64,164 116,224", fill: "#173a2c" }, // lush hills
    { points: "200,188 144,162 92,224", fill: "#123226" },
  ],
  figure: [
    { points: "100,112 84,124 70,196 100,196", fill: "#356a44" }, // gown
    { points: "100,112 116,124 130,196 100,196", fill: "#3f7a4e" },
    { points: "84,124 70,196 100,196 100,150", fill: "#2e5c3a" },
    { points: "116,124 130,196 100,196 100,150", fill: "#4a8a5a" },
    { points: "95,100 105,100 106,112 94,112", fill: "#d9a06b" }, // head
    { points: "93,100 107,100 106,95 94,95", fill: "#c9a03a" }, // hair band
    { points: "93,96 96,89 98.5,94 100,87 101.5,94 104,89 107,96", fill: "#e8c36a", className: "cl-lowpoly-lf" }, // crown
    { points: "136,138 148,138 154,146 136,166", fill: "#c03848" }, // heart shield
    { points: "136,138 124,138 118,146 136,166", fill: "#a83040" },
  ],
  fore: [
    { points: "0,246 100,238 100,300 0,300", fill: "#1a2a20" }, // field
    { points: "100,238 200,246 200,300 100,300", fill: "#16241c" },
    { points: "30,232 31.5,232 31,258 29.5,258", fill: "#d9b04a" }, // wheat
    { points: "27,232 34,232 30.5,226", fill: "#e8c36a" },
    { points: "60,228 61.5,228 61,256 59.5,256", fill: "#c9a03a" },
    { points: "57,228 64,228 60.5,222", fill: "#d9b04a" },
    { points: "140,234 141.5,234 141,258 139.5,258", fill: "#c9a03a" },
    { points: "137,234 144,234 140.5,228", fill: "#d9b04a" },
    { points: "168,230 169.5,230 169,258 167.5,258", fill: "#d9b04a" },
    { points: "165,230 172,230 168.5,224", fill: "#e8c36a" },
  ],
  glow: { cx: 100, cy: 91, rx: 15, ry: 13 },
  core: {
    points: "100,85.5 101.3,89.2 105,90.5 101.3,91.8 100,95.5 98.7,91.8 95,90.5 98.7,89.2",
    fill: "#fff8e2",
    className: "cl-lowpoly-core",
  },
  extra: (
    <path
      d="M136,145.5 a4.5,4.5 0 1,0 0.01,0 M136,150 L136,157 M132.5,154 L139.5,154"
      fill="none"
      stroke="#f2e8f0"
      strokeWidth="1.5"
    />
  ),
};

/* VII — The Chariot: starred canopy, boxy chariot, sphinxes, city wall. */
const CHARIOT: Scene = {
  stars: STARS,
  ridge: [
    { points: "0,150 70,150 70,176 0,176", fill: "#3a4460" }, // city wall
    { points: "70,150 140,150 140,176 70,176", fill: "#424c68" },
    { points: "140,150 200,150 200,176 140,176", fill: "#38425c" },
    { points: "8,142 22,142 22,150 8,150", fill: "#424c68" }, // merlons
    { points: "56,142 70,142 70,150 56,150", fill: "#3a4460" },
    { points: "120,142 134,142 134,150 120,150", fill: "#4a5470" },
    { points: "172,142 186,142 186,150 172,150", fill: "#424c68" },
  ],
  figure: [
    { points: "64,96 136,96 140,110 60,110", fill: "#2a2f5e" }, // canopy
    { points: "64,96 136,96 133,91 67,91", fill: "#343a6e" },
    { points: "82,100 84,103 82,106 80,103", fill: "#e8e2f2", opacity: 0.9 }, // canopy stars
    { points: "118,100 120,103 118,106 116,103", fill: "#e8e2f2", opacity: 0.9 },
    { points: "63,110 66,110 66,160 63,160", fill: "#4a3866" }, // poles
    { points: "134,110 137,110 137,160 134,160", fill: "#4a3866" },
    { points: "96,118 104,118 105,130 95,130", fill: "#d9a06b" }, // head
    { points: "95,118 105,118 104,113 96,113", fill: "#2a2448" }, // helm
    { points: "88,132 100,132 100,160 86,160", fill: "#7a80a8" }, // armor
    { points: "100,132 112,132 114,160 100,160", fill: "#9aa0c8" },
    { points: "68,162 100,162 100,208 62,208", fill: "#6a5a8a" }, // chariot box
    { points: "100,162 132,162 138,208 100,208", fill: "#7a6a9a" },
    { points: "68,162 132,162 131,169 69,169", fill: "#c9a03a", className: "cl-lowpoly-lf" }, // gold trim
    { points: "78,206 85,212 85,220 78,226 71,220 71,212", fill: "#2a2448" }, // wheels
    { points: "122,206 129,212 129,220 122,226 115,220 115,212", fill: "#2a2448" },
    { points: "78,213 80.4,215 78,217 75.6,215", fill: "#c9a03a" }, // hubs
    { points: "122,213 124.4,215 122,217 119.6,215", fill: "#c9a03a" },
  ],
  fore: [
    { points: "0,240 100,234 100,300 0,300", fill: "#141c30" },
    { points: "100,234 200,240 200,300 100,300", fill: "#101828" },
    { points: "18,238 52,238 56,214 26,210", fill: "#232040" }, // left sphinx
    { points: "36,202 47,202 45,214 34,214", fill: "#232040" },
    { points: "182,238 148,238 144,214 174,210", fill: "#3a3458" }, // right sphinx
    { points: "164,202 153,202 155,214 166,214", fill: "#3a3458" },
  ],
  glow: { cx: 100, cy: 103, rx: 14, ry: 12 },
  core: {
    points: "100,97.5 101.3,101 105,103 101.3,105 100,108.5 98.7,105 95,103 98.7,101",
    fill: "#fff8e2",
    className: "cl-lowpoly-core",
  },
};

/* X — Wheel of Fortune: spoked wheel, sphinx above, snake and creature. */
const WHEEL: Scene = {
  stars: STARS,
  ridge: RIDGES,
  figure: [
    { points: "88,96 112,96 107,86 93,86", fill: "#3a3458" }, // sphinx body
    { points: "100,76 94,86 106,86", fill: "#4a4470" }, // sphinx head
    { points: "38,116 46,124 42,136 34,128", fill: "#3f7a4e" }, // snake
    { points: "42,136 50,144 44,158 36,150", fill: "#356a44" },
    { points: "44,158 52,166 46,180 38,172", fill: "#3f7a4e" },
    { points: "158,150 172,144 174,156 162,162", fill: "#8a2838" }, // creature
    { points: "168,140 176,138 174,146 168,146", fill: "#7a2434" },
    { points: "100,92 103,98 100,104 97,98", fill: "#ffd97a", className: "cl-lowpoly-lf" }, // rim glyphs
    { points: "100,196 103,202 100,208 97,202", fill: "#e8c36a" },
    { points: "42,150 48,147 48,153", fill: "#e8c36a" },
    { points: "158,150 152,147 152,153", fill: "#e8c36a" },
  ],
  fore: GROUND,
  glow: { cx: 100, cy: 150, rx: 20, ry: 20 },
  core: {
    points:
      "100,143 101.8,148.2 107,150 101.8,151.8 100,157 98.2,151.8 93,150 98.2,148.2",
    fill: "#fff8e2",
    className: "cl-lowpoly-core",
  },
  extra: (
    <>
      <circle cx="100" cy="150" r="52" fill="none" stroke="#c98f4a" strokeWidth="5" />
      <circle cx="100" cy="150" r="40" fill="none" stroke="#a06828" strokeWidth="2" opacity="0.75" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        return (
          <line
            key={i}
            x1={100 + 11 * Math.cos(a)}
            y1={150 + 11 * Math.sin(a)}
            x2={100 + 38 * Math.cos(a)}
            y2={150 + 38 * Math.sin(a)}
            stroke="#c98f4a"
            strokeWidth="2.5"
          />
        );
      })}
      <circle cx="100" cy="150" r="9" fill="#8a5f30" />
    </>
  ),
};

/* XIII — Death: skeletal rider, rose banner, sun between two towers. */
const DEATH: Scene = {
  stars: STARS,
  ridge: [
    { points: "40,148 58,148 58,200 40,200", fill: "#241f40" }, // towers
    { points: "38,142 60,142 60,148 38,148", fill: "#2e2850" },
    { points: "142,148 160,148 160,200 142,200", fill: "#241f40" },
    { points: "140,142 162,142 162,148 140,148", fill: "#2e2850" },
    { points: "84,200 90,180 100,174 100,200", fill: "#ffd97a", className: "cl-lowpoly-lf" }, // rising sun
    { points: "100,174 110,180 116,200 100,200", fill: "#e8a83a", className: "cl-lowpoly-lf cl-lowpoly-lf2" },
  ],
  figure: [
    { points: "66,168 116,162 124,184 74,192", fill: "#d8d4e0" }, // horse body
    { points: "74,192 124,184 120,196 80,200", fill: "#c0bccf" },
    { points: "112,164 128,142 136,148 122,172", fill: "#c8c4d4" }, // neck
    { points: "128,140 143,147 134,157", fill: "#d8d4e0" }, // head
    { points: "77,190 82,190 81,230 76,230", fill: "#c0bccf" }, // legs
    { points: "91,189 96,189 97,229 92,229", fill: "#b0acc0" },
    { points: "106,187 111,187 114,227 109,227", fill: "#c0bccf" },
    { points: "118,185 123,185 128,224 123,225", fill: "#b0acc0" },
    { points: "84,128 98,128 101,164 87,166", fill: "#e8e4ee" }, // rider torso
    { points: "84,128 91,128 89,166 87,166", fill: "#d0ccd8" },
    { points: "88,112 97,112 98,127 87,127", fill: "#f2eef6" }, // skull
    { points: "90,118 92,118 92,121 90,121", fill: "#14102e" }, // eyes
    { points: "95,118 97,118 97,121 95,121", fill: "#14102e" },
    { points: "97,132 120,124 122,130 100,140", fill: "#e8e4ee" }, // arm to pole
    { points: "120,104 123,104 123,168 120,168", fill: "#4a3866" }, // banner pole
    { points: "123,106 158,110 156,136 123,132", fill: "#14101e" }, // banner
    { points: "123,106 140,108 139,134 123,132", fill: "#1c1730" },
  ],
  fore: GROUND,
  glow: { cx: 140, cy: 121, rx: 13, ry: 12 },
  core: {
    points:
      "140,114.5 141.8,119 146.5,121 141.8,123 140,127.5 138.2,123 133.5,121 138.2,119",
    fill: "#f2eef6",
    className: "cl-lowpoly-core",
  },
};

/* XVII — The Star: kneeling figure, two jugs, big star + seven small. */
const STAR_CARD: Scene = {
  stars: [
    { points: "40,42 41.5,45 40,48 38.5,45", fill: "#e8e2f2", opacity: 0.85 },
    { points: "160,38 161.5,41 160,44 158.5,41", fill: "#e8e2f2", opacity: 0.8 },
    { points: "58,86 59.4,89 58,92 56.6,89", fill: "#e8e2f2", opacity: 0.75 },
    { points: "142,82 143.4,85 142,88 140.6,85", fill: "#e8e2f2", opacity: 0.75 },
    { points: "28,116 29.2,119 28,122 26.8,119", fill: "#e8e2f2", opacity: 0.7 },
    { points: "172,112 173.2,115 172,118 170.8,115", fill: "#e8e2f2", opacity: 0.7 },
    { points: "100,18 101.4,21 100,24 98.6,21", fill: "#e8e2f2", opacity: 0.8 },
  ],
  ridge: [
    { points: "0,200 70,178 120,226", fill: "#173a2c" }, // low hills
    { points: "200,196 140,176 90,226", fill: "#123226" },
  ],
  figure: [
    { points: "72,146 81,146 82,155 71,155", fill: "#d9a06b" }, // head
    { points: "71,146 82,146 81,141 73,141", fill: "#3a2c1e" }, // hair
    { points: "76,155 62,176 82,183 89,162", fill: "#d9a06b" }, // torso
    { points: "76,155 62,176 70,180 80,160", fill: "#c98f5a" },
    { points: "66,182 58,204 86,204 86,190", fill: "#c98f5a" }, // kneeling legs
    { points: "86,190 86,204 96,202 92,188", fill: "#d9a06b" },
    { points: "86,160 108,152 111,158 90,168", fill: "#d9a06b" }, // right arm
    { points: "106,148 117,148 116,161 107,161", fill: "#7a5530" }, // right jug
    { points: "110,161 114,161 118,208 112,208", fill: "#9ac8e8", opacity: 0.75 }, // stream to pool
    { points: "68,162 48,170 50,176 70,170", fill: "#c98f5a" }, // left arm
    { points: "42,166 53,166 52,179 43,179", fill: "#6b4a26" }, // left jug
    { points: "46,179 50,179 49,210 44,210", fill: "#9ac8e8", opacity: 0.75 }, // stream to land
  ],
  fore: [
    { points: "0,244 80,236 90,300 0,300", fill: "#1a2a20" }, // land
    { points: "92,224 168,218 190,246 96,252", fill: "#2a6a8a" }, // pool
    { points: "96,252 190,246 200,300 90,300", fill: "#1e4a68" },
    { points: "92,224 168,218 160,228 100,232", fill: "#3a82a8", className: "cl-lowpoly-lf" }, // pool glint
  ],
  glow: { cx: 100, cy: 60, rx: 26, ry: 24 },
  core: {
    points:
      "116,60 106.9,62.7 111.3,71.3 103.4,68.5 100,76 96.6,68.5 88.7,71.3 93.1,62.7 84,60 93.1,57.3 88.7,48.7 96.6,51.5 100,44 103.4,51.5 111.3,48.7 106.9,57.3",
    fill: "#ffe9a8",
    className: "cl-lowpoly-core",
  },
};

/* XXII — The Fool: stepping toward the cliff, dog at heels, sun behind. */
const FOOL: Scene = {
  stars: STARS,
  ridge: [
    { points: "0,196 64,168 116,226", fill: "#173a4e" },
    { points: "200,192 146,166 96,226", fill: "#143448" },
  ],
  figure: [
    { points: "48,24 62,30 68,44 48,44", fill: "#ffe9a8", className: "cl-lowpoly-lf" }, // sun
    { points: "68,44 62,58 48,64 48,44", fill: "#f7c25c", className: "cl-lowpoly-lf cl-lowpoly-lf2" },
    { points: "48,64 34,58 28,44 48,44", fill: "#e8a83a" },
    { points: "28,44 34,30 48,24 48,44", fill: "#ffd97a", className: "cl-lowpoly-lf cl-lowpoly-lf4" },
    { points: "126,138 135,136 137,145 128,147", fill: "#d9a06b" }, // head, tilted up
    { points: "126,138 135,136 133,131 127,132", fill: "#3a2c1e" }, // hair
    { points: "123,147 138,145 142,176 127,178", fill: "#3f7a9a" }, // tunic
    { points: "123,147 130,146 131,178 127,178", fill: "#356a86" },
    { points: "136,176 142,176 147,204 141,205", fill: "#2a5a78" }, // front leg
    { points: "127,177 133,177 129,201 123,199", fill: "#24485f" }, // back leg
    { points: "124,150 108,132 112,128 128,146", fill: "#3f7a9a" }, // arm to stick
    { points: "103,124 106,121 130,146 127,149", fill: "#7a5530" }, // bundle stick
    { points: "96,116 109,120 102,131", fill: "#c03848" }, // bundle
    { points: "96,192 111,192 109,201 98,201", fill: "#f2eef6" }, // dog body
    { points: "109,186 116,189 113,196 107,195", fill: "#e8e4ee" }, // dog head
    { points: "99,201 102,201 102,207 99,207", fill: "#e8e4ee" }, // dog legs
    { points: "106,201 109,201 109,207 106,207", fill: "#e0dcf0" },
  ],
  fore: [
    { points: "0,214 152,206 152,300 0,300", fill: "#182238" }, // plateau
    { points: "0,214 152,206 100,222 0,230", fill: "#1e2a42" },
    { points: "152,206 172,214 170,300 152,300", fill: "#0e1424" }, // cliff face
  ],
  glow: { cx: 48, cy: 44, rx: 28, ry: 26 },
  core: {
    points: "48,38.5 49.5,42.5 53.5,44 49.5,45.5 48,49.5 46.5,45.5 42.5,44 46.5,42.5",
    fill: "#fff8e2",
    className: "cl-lowpoly-core",
  },
};

function getScene(number: number): Scene {
  switch (number) {
    case 1:
      return MAGICIAN;
    case 3:
      return EMPRESS;
    case 7:
      return CHARIOT;
    case 10:
      return WHEEL;
    case 13:
      return DEATH;
    case 17:
      return STAR_CARD;
    case 22:
      return FOOL;
    default:
      return HERMIT;
  }
}

function Facets({ facets }: { facets: Facet[] }) {
  return (
    <>
      {facets.map((f, i) => (
        <polygon
          key={i}
          points={f.points}
          fill={f.fill}
          opacity={f.opacity}
          className={f.className}
        />
      ))}
    </>
  );
}

type LowpolyHermitCardProps = {
  /** Major Arcana number 1-22, rendered as a roman numeral. */
  number?: number;
  /** Card name on the bottom band; long names are squeezed to fit. */
  name?: string;
  /** 0-7: 4 hue-rotated palettes x 2 orientations. 0 = original artwork. */
  variant?: number;
};

/** Artwork hue rotation (deg) per variant scheme; 0 keeps the original palette. */
const SCHEME_HUES = [0, -30, 45, -60] as const;

export default function LowpolyHermitCard({
  number = 9,
  name = "THE HERMIT",
  variant = 0,
}: LowpolyHermitCardProps) {
  const v = ((Math.round(variant) % 8) + 8) % 8;
  const scheme = v % 4; // palette scheme
  const mirrored = v >= 4; // upper four variants flip the composition
  const hue = SCHEME_HUES[scheme];
  const hueStyle = hue === 0 ? undefined : { filter: `hue-rotate(${hue}deg)` };
  const starShift = scheme * 5; // decorative stars drift per scheme
  const numeral = toRoman(number);
  const title = name.toUpperCase();
  const longName = title.length >= 14;
  const scene = getScene(number);

  return (
    <figure
      className="cl-lowpoly-card"
      style={{ aspectRatio: "2/3", width: "100%" }}
    >
      <style>{`
        .cl-lowpoly-card {
          position: relative;
          margin: 0;
          overflow: hidden;
          border-radius: 14px;
          background: #14102e;
          box-shadow: 0 10px 30px rgba(8, 6, 24, 0.45);
        }
        .cl-lowpoly-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
        }

        /* one-shot staggered layer fade-in on mount */
        .cl-lowpoly-mount { animation: cl-lowpoly-in 0.7s ease both; }
        .cl-lowpoly-m2 { animation-delay: 0.08s; }
        .cl-lowpoly-m3 { animation-delay: 0.16s; }
        .cl-lowpoly-m4 { animation-delay: 0.24s; }
        .cl-lowpoly-m5 { animation-delay: 0.32s; }
        .cl-lowpoly-m6 { animation-delay: 0.4s; }
        @keyframes cl-lowpoly-in {
          from { opacity: 0; }
        }

        /* light waves — bold opacity swing rolling down through the layers in sequence */
        .cl-lowpoly-sh-sky { animation: cl-lowpoly-shimmer 8s ease-in-out 0s infinite, cl-lowpoly-flash 18s linear 0s infinite; }
        .cl-lowpoly-sh-ridge { animation: cl-lowpoly-shimmer 8s ease-in-out -1.2s infinite; }
        .cl-lowpoly-sh-peak { animation: cl-lowpoly-shimmer 8s ease-in-out -2.4s infinite, cl-lowpoly-flash 18s linear -6s infinite; }
        .cl-lowpoly-sh-figure { animation: cl-lowpoly-shimmer 8s ease-in-out -3.6s infinite, cl-lowpoly-flash 18s linear -12s infinite; }
        .cl-lowpoly-sh-fore { animation: cl-lowpoly-shimmer 8s ease-in-out -4.8s infinite; }
        @keyframes cl-lowpoly-shimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        /* facet flash — one group catches light hard, roughly every 6s, rotating groups */
        @keyframes cl-lowpoly-flash {
          0%, 1% { filter: brightness(1); }
          2% { filter: brightness(1.75); }
          3% { filter: brightness(1.1); }
          4% { filter: brightness(1.45); }
          5.5%, 100% { filter: brightness(1); }
        }

        /* stars twinkle on their own quicker beat */
        .cl-lowpoly-stars { animation: cl-lowpoly-twinkle 5s ease-in-out -1.5s infinite; }
        @keyframes cl-lowpoly-twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }

        /* lantern flame flicker; glow can swell on hover (scale, not opacity) */
        .cl-lowpoly-glow {
          animation: cl-lowpoly-flicker 3.8s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: center;
          transition: transform 0.6s ease;
        }
        .cl-lowpoly-core {
          animation: cl-lowpoly-flicker 3.8s ease-in-out infinite, cl-lowpoly-spin 20s linear infinite;
          transform-box: fill-box;
          transform-origin: center;
        }
        @keyframes cl-lowpoly-flicker {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 0.95; }
        }
        @keyframes cl-lowpoly-spin {
          to { transform: rotate(360deg); }
        }

        /* lantern gold facets — brightness ripple cycling outward around the core */
        .cl-lowpoly-lf { animation: cl-lowpoly-ripple 2.4s ease-in-out infinite; }
        .cl-lowpoly-lf2 { animation-delay: -0.6s; }
        .cl-lowpoly-lf3 { animation-delay: -1.2s; }
        .cl-lowpoly-lf4 { animation-delay: -1.8s; }
        @keyframes cl-lowpoly-ripple {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.45); }
        }

        /* hover faux-parallax — layers drift in opposing directions */
        .cl-lowpoly-l-sky, .cl-lowpoly-l-stars, .cl-lowpoly-l-ridge,
        .cl-lowpoly-l-peak, .cl-lowpoly-l-figure, .cl-lowpoly-l-fore {
          transition: transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .cl-lowpoly-card:hover .cl-lowpoly-l-sky { transform: translate(-2px, -3px); }
        .cl-lowpoly-card:hover .cl-lowpoly-l-stars { transform: translate(-3px, -4px); }
        .cl-lowpoly-card:hover .cl-lowpoly-l-ridge { transform: translate(1.5px, -1.5px); }
        .cl-lowpoly-card:hover .cl-lowpoly-l-peak { transform: translate(2px, 1.5px); }
        .cl-lowpoly-card:hover .cl-lowpoly-l-figure { transform: translate(2px, 1.5px); }
        .cl-lowpoly-card:hover .cl-lowpoly-l-fore { transform: translate(3.5px, 3px); }
        .cl-lowpoly-card:hover .cl-lowpoly-glow { transform: scale(1.3); }

        @media (prefers-reduced-motion: reduce) {
          .cl-lowpoly-mount, .cl-lowpoly-sh-sky, .cl-lowpoly-sh-ridge,
          .cl-lowpoly-sh-peak, .cl-lowpoly-sh-figure, .cl-lowpoly-sh-fore,
          .cl-lowpoly-stars, .cl-lowpoly-glow, .cl-lowpoly-core,
          .cl-lowpoly-lf {
            animation: none;
          }
          .cl-lowpoly-l-sky, .cl-lowpoly-l-stars, .cl-lowpoly-l-ridge,
          .cl-lowpoly-l-peak, .cl-lowpoly-l-figure, .cl-lowpoly-l-fore,
          .cl-lowpoly-glow {
            transition: none;
          }
          .cl-lowpoly-card:hover .cl-lowpoly-l-sky,
          .cl-lowpoly-card:hover .cl-lowpoly-l-stars,
          .cl-lowpoly-card:hover .cl-lowpoly-l-ridge,
          .cl-lowpoly-card:hover .cl-lowpoly-l-peak,
          .cl-lowpoly-card:hover .cl-lowpoly-l-figure,
          .cl-lowpoly-card:hover .cl-lowpoly-l-fore,
          .cl-lowpoly-card:hover .cl-lowpoly-glow {
            transform: none;
          }
        }
      `}</style>

      <svg
        className="cl-lowpoly-svg"
        viewBox="0 0 200 300"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={`${title} tarot card in low-poly style`}
      >
        <defs>
          <radialGradient id="cl-lowpoly-gold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd882" stopOpacity="0.6" />
            <stop offset="55%" stopColor="#f0aa46" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#f0aa46" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="200" height="300" fill="#14102e" />

        {/* artwork: palette hue lives on the mount groups (they only animate
            opacity, so it never fights the shimmer/flash filter animations);
            variants >= 4 mirror the whole composition, chrome stays put */}
        <g transform={mirrored ? "translate(200 0) scale(-1 1)" : undefined}>
          <g className="cl-lowpoly-mount" style={hueStyle}>
            <g className="cl-lowpoly-l-sky cl-lowpoly-sh-sky">
              <Facets facets={SKY} />
            </g>
          </g>
          {scene.stars && (
            <g
              className="cl-lowpoly-mount cl-lowpoly-m2"
              style={hueStyle}
              transform={starShift ? `translate(${starShift} ${-scheme * 3})` : undefined}
            >
              <g className="cl-lowpoly-l-stars cl-lowpoly-stars">
                <Facets facets={scene.stars} />
              </g>
            </g>
          )}
          {scene.ridge && (
            <g className="cl-lowpoly-mount cl-lowpoly-m3" style={hueStyle}>
              <g className="cl-lowpoly-l-ridge cl-lowpoly-sh-ridge">
                <Facets facets={scene.ridge} />
              </g>
            </g>
          )}
          {scene.peak && (
            <g className="cl-lowpoly-mount cl-lowpoly-m4" style={hueStyle}>
              <g className="cl-lowpoly-l-peak cl-lowpoly-sh-peak">
                <Facets facets={scene.peak} />
              </g>
            </g>
          )}

          <g className="cl-lowpoly-mount cl-lowpoly-m5" style={hueStyle}>
            <g className="cl-lowpoly-l-figure cl-lowpoly-sh-figure">
              {/* glow of the scene's light source, behind the subject */}
              {scene.glow && (
                <ellipse
                  className="cl-lowpoly-glow"
                  cx={scene.glow.cx}
                  cy={scene.glow.cy}
                  rx={scene.glow.rx}
                  ry={scene.glow.ry}
                  fill="url(#cl-lowpoly-gold)"
                />
              )}
              <Facets facets={scene.figure} />
              {scene.extra}
              {scene.core && (
                <polygon
                  points={scene.core.points}
                  fill={scene.core.fill}
                  className={scene.core.className}
                />
              )}
            </g>
          </g>

          <g className="cl-lowpoly-mount cl-lowpoly-m6" style={hueStyle}>
            <g className="cl-lowpoly-l-fore cl-lowpoly-sh-fore">
              <Facets facets={scene.fore} />
            </g>
          </g>
        </g>

        {/* chrome: numeral */}
        <line x1="58" y1="27" x2="86" y2="27" stroke="#d8cfee" strokeOpacity="0.35" strokeWidth="0.75" />
        <line x1="114" y1="27" x2="142" y2="27" stroke="#d8cfee" strokeOpacity="0.35" strokeWidth="0.75" />
        <text
          x="100"
          y="33"
          textAnchor="middle"
          fontFamily='Futura, "Avenir Next", "Century Gothic", system-ui, sans-serif'
          fontWeight="300"
          fontSize="16"
          letterSpacing="2.5"
          fill="#cfc6ea"
        >
          {numeral}
        </text>

        {/* chrome: name band */}
        <rect x="0" y="256" width="200" height="44" fill="#0a0616" opacity="0.55" />
        <text
          x="100"
          y="283"
          textAnchor="middle"
          fontFamily='Futura, "Avenir Next", "Century Gothic", system-ui, sans-serif'
          fontWeight="300"
          fontSize="10"
          letterSpacing="3.6"
          fill="#e6dff4"
          opacity="0.92"
          {...(longName ? { textLength: 150, lengthAdjust: "spacingAndGlyphs" } : {})}
        >
          {title}
        </text>

        {/* hairline inner frame */}
        <rect
          x="5"
          y="5"
          width="190"
          height="290"
          rx="9"
          fill="none"
          stroke="#e6dff4"
          strokeOpacity="0.12"
          strokeWidth="1"
        />
      </svg>
    </figure>
  );
}
