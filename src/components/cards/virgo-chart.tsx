/**
 * Virgo Chart — engraved constellation-plate tarot deck (default: The Hermit IX)
 *
 * An engraved plate of the Virgo constellation, the Hermit's own sign:
 * deep midnight-blue ground, gold engraving, silver stars. The Maiden is
 * drawn in fine engraved gold lines around the actual star positions of
 * the constellation (α Spica at the wheat, γ Porrima at her waist...).
 * A faint Milky Way band washes behind; Coma Berenices glimmers as a
 * neighbor hint; the tiny Hermit raises his lantern from the corner.
 *
 * The component optionally renders a full deck in the same engraved-plate
 * style via props: `number` (1 Magician, 3 Empress, 7 Chariot, 9 Hermit,
 * 10 Wheel of Fortune, 13 Death, 17 Star, 22 Fool — anything else falls
 * back to the Hermit plate), `name` (caption in the foot cartouche) and
 * `variant` (0-7 palette/decor variations, 0 = classic gold-on-midnight).
 * Every plate draws its classical figure in engraved gold lines around a
 * fictional-but-plausible silver asterism with greek-letter labels, the
 * Hermit observer always watching from the corner.
 *
 * Server-component safe: no hooks, no event handlers. All motion is CSS in
 * the scoped <style> block (prefix `cz-virgo-`), guarded by
 * prefers-reduced-motion.
 */

const SERIF = "Georgia, 'Times New Roman', 'Palatino Linotype', serif";

/* ------------------------------------------------------------------ */
/* Palettes: variant 0 is the classic gold-on-midnight plate           */
/* ------------------------------------------------------------------ */

interface Palette {
  gold: string;
  goldBright: string;
  goldDim: string;
  silver: string;
  silverBright: string;
  ink: string;
  sky: [string, string, string];
}

const PALETTES: Palette[] = [
  { gold: "#d4af37", goldBright: "#f2d675", goldDim: "rgba(212, 175, 55, 0.55)", silver: "#c8d3e6", silverBright: "#f0f4fb", ink: "#0a1028", sky: ["#141d44", "#0d1430", "#060a1c"] },
  { gold: "#d9a068", goldBright: "#f6cf9f", goldDim: "rgba(217, 160, 104, 0.55)", silver: "#c8d3e6", silverBright: "#f0f4fb", ink: "#120e24", sky: ["#1d1738", "#120f2b", "#0a0819"] },
  { gold: "#c9bd8a", goldBright: "#eee6bc", goldDim: "rgba(201, 189, 138, 0.55)", silver: "#ccd5e2", silverBright: "#f2f5fa", ink: "#0c1128", sky: ["#182040", "#101634", "#070b1c"] },
  { gold: "#a9bd8f", goldBright: "#d8e6bd", goldDim: "rgba(169, 189, 143, 0.55)", silver: "#c2d4d8", silverBright: "#eef6f6", ink: "#0a1626", sky: ["#12263c", "#0c1a2c", "#050e18"] },
  { gold: "#c3c9d6", goldBright: "#eef1f8", goldDim: "rgba(195, 201, 214, 0.5)", silver: "#d8c98e", silverBright: "#f4ebc2", ink: "#0a0e20", sky: ["#161a38", "#0e1226", "#060814"] },
  { gold: "#d4af37", goldBright: "#f2d675", goldDim: "rgba(212, 175, 55, 0.55)", silver: "#c8d3e6", silverBright: "#f0f4fb", ink: "#0d0a26", sky: ["#1c1646", "#130f33", "#090620"] },
  { gold: "#cda15c", goldBright: "#f0d29a", goldDim: "rgba(205, 161, 92, 0.55)", silver: "#c8d3e6", silverBright: "#f0f4fb", ink: "#141020", sky: ["#241d2e", "#181220", "#0c0812"] },
  { gold: "#e3bc45", goldBright: "#ffe98f", goldDim: "rgba(227, 188, 69, 0.55)", silver: "#d0d9ea", silverBright: "#f6f9fd", ink: "#0a1028", sky: ["#182452", "#101a3e", "#080e24"] },
];

/* ------------------------------------------------------------------ */
/* Plate data model                                                    */
/* ------------------------------------------------------------------ */

interface Segment {
  d: string;
  /** load-reveal delay in seconds */
  t: number;
  w?: number;
  op?: number;
}

interface Star {
  x: number;
  y: number;
  r: number;
  /** load-reveal delay in seconds */
  t: number;
  label?: string;
  lx?: number;
  ly?: number;
  anchor?: "start" | "end" | "middle";
}

interface Glyph {
  x: number;
  y: number;
  text: string;
  size: number;
  t: number;
  anchor?: "start" | "end" | "middle";
}

interface Scene {
  /** full cartouche line, incl. glyphs (U+FE0E applied) */
  cartouche: string;
  /** index of the focal (brightest, pulsing) star */
  focal: number;
  segments: Segment[];
  stars: Star[];
  links: [number, number][];
  glyphs: Glyph[];
}

/* ------------------------------------------------------------------ */
/* IX — The Hermit: the Maiden of Virgo with the wheat (α Spica)       */
/* ------------------------------------------------------------------ */

const HERMIT: Scene = {
  cartouche: "♍︎ VIRGO · DOMUS MERCURII ☿︎",
  focal: 8,
  segments: [
    { t: 0.15, d: "M 238 123 C 246 123 251 130 251 139 C 251 148 245 154 238 154 C 230 154 225 148 225 139 C 225 130 230 123 238 123 Z" },
    { t: 0.3, d: "M 225 137 C 227 129 234 124 243 125 C 252 126 257 132 255 139 C 253 145 246 146 243 141" },
    { t: 0.45, d: "M 232 154 C 227 172 216 188 211 206 C 206 238 204 268 205 298" },
    { t: 0.55, d: "M 244 154 C 250 178 246 212 232 250 C 225 272 214 288 205 298" },
    { t: 0.65, d: "M 246 212 C 232 240 218 268 204 292" },
    { t: 0.7, w: 0.45, op: 0.5, d: "M 252 220 C 238 246 224 272 212 294" },
    { t: 0.8, d: "M 238 192 C 266 158 294 148 316 152 C 320 153 322 156 320 160 C 306 178 280 194 250 204" },
    { t: 0.95, w: 0.5, op: 0.7, d: "M 246 200 C 268 184 290 172 306 168" },
    { t: 1.0, w: 0.45, op: 0.55, d: "M 252 206 C 270 194 286 186 298 182" },
    { t: 0.85, d: "M 228 190 C 190 156 138 150 100 176 C 94 181 91 190 94 200 C 130 208 180 210 224 206" },
    { t: 1.0, w: 0.5, op: 0.7, d: "M 222 212 C 190 226 164 240 150 252" },
    { t: 1.05, w: 0.45, op: 0.55, d: "M 224 218 C 200 232 180 244 168 254" },
    { t: 1.1, d: "M 212 208 C 188 244 158 292 142 330 C 134 356 138 382 152 402 C 158 412 164 421 167 428" },
    { t: 1.2, w: 0.5, op: 0.7, d: "M 224 216 C 202 250 174 296 158 332 C 150 356 152 380 162 398" },
    { t: 1.3, d: "M 167 428 C 171 431 173 435 171 439 C 167 441 163 438 164 434" },
    { t: 1.35, d: "M 167 430 C 166 427 166 424 167 421" },
    { t: 1.4, w: 0.6, d: "M 168 421 L 160 410 M 168 421 L 168 406 M 168 421 L 176 410 M 166 415 L 161 408 M 170 415 L 175 408" },
    { t: 1.42, w: 0.5, op: 0.7, d: "M 167 428 C 158 426 152 420 150 412 C 158 414 164 420 167 428 Z" },
    { t: 1.2, d: "M 205 298 C 196 350 190 400 196 448" },
    { t: 1.3, d: "M 218 302 C 236 352 252 402 268 452" },
    { t: 1.4, d: "M 196 448 C 218 456 246 458 268 452" },
    { t: 1.45, w: 0.5, op: 0.6, d: "M 210 312 C 206 360 204 406 210 446" },
    { t: 1.5, w: 0.5, op: 0.6, d: "M 224 314 C 227 362 233 410 240 448" },
    { t: 1.55, w: 0.5, op: 0.6, d: "M 238 318 C 246 364 255 408 258 446" },
    { t: 1.35, d: "M 246 210 C 272 250 290 296 300 340 C 304 364 300 384 288 396" },
    { t: 1.45, w: 0.45, op: 0.5, d: "M 252 216 C 276 254 292 296 300 336" },
  ],
  stars: [
    { x: 300, y: 190, r: 2.2, t: 1.3, label: "ε Vindemiatrix", lx: 308, ly: 186, anchor: "start" },
    { x: 90, y: 210, r: 1.8, t: 1.35, label: "β Zavijava", lx: 96, ly: 226, anchor: "start" },
    { x: 150, y: 250, r: 1.6, t: 1.4, label: "η Zaniah", lx: 116, ly: 246, anchor: "end" },
    { x: 205, y: 300, r: 2.4, t: 1.25, label: "γ Porrima", lx: 214, ly: 292, anchor: "start" },
    { x: 140, y: 330, r: 1.7, t: 1.45, label: "δ Auva", lx: 132, ly: 322, anchor: "end" },
    { x: 300, y: 340, r: 1.5, t: 1.5, label: "μ Rijl al Awwa", lx: 308, ly: 336, anchor: "start" },
    { x: 246, y: 382, r: 1.6, t: 1.5, label: "ι Syrma", lx: 254, ly: 376, anchor: "start" },
    { x: 150, y: 395, r: 1.7, t: 1.5, label: "ζ Heze", lx: 142, ly: 388, anchor: "end" },
    { x: 168, y: 420, r: 3.2, t: 1.45, label: "α Spica", lx: 150, ly: 438, anchor: "end" },
  ],
  links: [[8, 7], [7, 4], [4, 3], [3, 2], [2, 1], [3, 0], [3, 8], [8, 6], [6, 5]],
  glyphs: [],
};

/* ------------------------------------------------------------------ */
/* I — The Magician: raised wand, table with the four suit tools       */
/* ------------------------------------------------------------------ */

const MAGICIAN: Scene = {
  cartouche: "☿︎ MAGVS · DOMUS MERCURII",
  focal: 0,
  segments: [
    { t: 0.15, d: "M 170 112 C 168 104 180 102 188 110 C 196 118 208 120 210 112 C 212 104 200 102 192 110 C 184 118 172 120 170 112 Z" },
    { t: 0.25, d: "M 200 136 C 207 136 212 141 212 148 C 212 155 207 160 200 160 C 193 160 188 155 188 148 C 188 141 193 136 200 136 Z" },
    { t: 0.35, d: "M 194 160 C 190 185 188 210 190 240" },
    { t: 0.4, d: "M 206 160 C 210 185 212 210 210 240" },
    { t: 0.5, w: 0.6, d: "M 189 240 C 196 244 204 244 211 240" },
    { t: 0.5, d: "M 206 164 C 222 152 240 148 250 158" },
    { t: 0.6, w: 0.9, d: "M 252 156 L 268 128" },
    { t: 0.55, d: "M 194 166 C 182 190 168 216 158 240" },
    { t: 0.65, w: 0.5, op: 0.7, d: "M 158 240 L 154 252" },
    { t: 0.6, d: "M 190 240 C 184 300 178 370 176 426" },
    { t: 0.65, d: "M 210 240 C 218 300 224 370 226 426" },
    { t: 0.7, d: "M 176 426 C 192 432 210 432 226 426" },
    { t: 0.75, w: 0.5, op: 0.6, d: "M 197 250 C 194 310 192 370 194 424" },
    { t: 0.78, w: 0.5, op: 0.6, d: "M 205 250 C 208 310 210 370 208 424" },
    { t: 0.85, w: 1, d: "M 132 322 L 268 322" },
    { t: 0.9, w: 0.5, op: 0.6, d: "M 136 330 L 264 330" },
    { t: 0.95, d: "M 142 330 L 142 392 M 258 330 L 258 392" },
    { t: 1.0, w: 0.5, op: 0.7, d: "M 136 392 L 150 392 M 252 392 L 266 392" },
    { t: 1.05, w: 0.7, d: "M 150 316 L 162 300" },
    { t: 1.1, w: 0.6, d: "M 184 306 C 184 314 194 314 194 306 Z" },
    { t: 1.12, w: 0.6, d: "M 218 316 L 228 300 M 215 310 L 223 314" },
    { t: 1.15, w: 0.6, d: "M 242 308 C 242 304 245 302 248 302 C 251 302 254 304 254 308 C 254 312 251 314 248 314 C 245 314 242 312 242 308 Z M 248 304 L 248 312 M 244 308 L 252 308" },
  ],
  stars: [
    { x: 270, y: 124, r: 2.6, t: 1.3, label: "α Baculi", lx: 278, ly: 120, anchor: "start" },
    { x: 250, y: 158, r: 1.8, t: 1.2, label: "β Dexter", lx: 258, ly: 152, anchor: "start" },
    { x: 200, y: 146, r: 2, t: 1.25, label: "γ Vertex", lx: 214, ly: 138, anchor: "start" },
    { x: 158, y: 242, r: 1.8, t: 1.35, label: "δ Sinister", lx: 148, ly: 236, anchor: "end" },
    { x: 140, y: 322, r: 1.7, t: 1.45, label: "ε Mensae", lx: 130, ly: 314, anchor: "end" },
    { x: 262, y: 322, r: 1.7, t: 1.45, label: "ζ Orbis", lx: 270, ly: 316, anchor: "start" },
    { x: 176, y: 428, r: 1.6, t: 1.5, label: "η Imus", lx: 166, ly: 444, anchor: "end" },
    { x: 226, y: 428, r: 1.6, t: 1.5, label: "θ Imus", lx: 234, ly: 444, anchor: "start" },
  ],
  links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 1], [4, 6], [5, 7], [6, 7]],
  glyphs: [],
};

/* ------------------------------------------------------------------ */
/* III — The Empress: crowned, Venus heart-shield, wheat at her feet   */
/* ------------------------------------------------------------------ */

const EMPRESS: Scene = {
  cartouche: "♀︎ IMPERATRIX · DOMUS VENERIS",
  focal: 0,
  segments: [
    { t: 0.15, d: "M 176 142 L 182 122 L 194 136 L 200 116 L 206 136 L 218 122 L 224 142 Z" },
    { t: 0.25, w: 0.6, d: "M 178 148 L 222 148" },
    { t: 0.3, d: "M 200 152 C 208 152 213 158 213 166 C 213 174 208 180 200 180 C 192 180 187 174 187 166 C 187 158 192 152 200 152 Z" },
    { t: 0.4, w: 0.6, op: 0.7, d: "M 188 158 C 182 176 182 194 188 208 M 212 158 C 218 176 218 194 212 208" },
    { t: 0.5, d: "M 184 214 C 172 260 162 340 158 410" },
    { t: 0.55, d: "M 216 214 C 228 260 238 340 242 410" },
    { t: 0.6, d: "M 158 410 C 184 420 216 420 242 410" },
    { t: 0.65, w: 0.5, op: 0.6, d: "M 192 230 C 186 290 180 350 178 408" },
    { t: 0.68, w: 0.5, op: 0.6, d: "M 208 230 C 214 290 220 350 222 408" },
    { t: 0.7, w: 0.4, op: 0.45, d: "M 200 232 L 200 406" },
    { t: 0.6, d: "M 184 218 C 174 244 168 268 166 292" },
    { t: 0.75, d: "M 166 288 C 158 280 148 284 150 294 C 152 304 162 310 166 316 C 170 310 180 304 182 294 C 184 284 174 280 166 288 Z" },
    { t: 0.62, d: "M 216 216 C 228 200 238 190 244 182" },
    { t: 0.7, w: 0.6, d: "M 240 178 C 240 174 244 172 246 174 C 248 176 247 180 244 181 C 242 182 240 181 240 178 Z" },
    { t: 0.8, d: "M 150 410 C 148 396 148 384 150 372" },
    { t: 0.85, w: 0.6, d: "M 150 374 L 144 364 M 150 374 L 150 360 M 150 374 L 156 364" },
    { t: 0.9, w: 0.6, op: 0.8, d: "M 136 412 C 134 400 134 390 136 380 M 136 382 L 131 373 M 136 382 L 141 373" },
  ],
  stars: [
    { x: 200, y: 120, r: 2.6, t: 1.3, label: "α Coronae", lx: 208, ly: 114, anchor: "start" },
    { x: 176, y: 140, r: 1.8, t: 1.2, label: "β Coronae", lx: 168, ly: 132, anchor: "end" },
    { x: 224, y: 140, r: 1.8, t: 1.2, label: "γ Coronae", lx: 232, ly: 132, anchor: "start" },
    { x: 182, y: 214, r: 1.7, t: 1.35, label: "δ Humeri", lx: 172, ly: 208, anchor: "end" },
    { x: 218, y: 214, r: 1.7, t: 1.35, label: "ε Humeri", lx: 228, ly: 208, anchor: "start" },
    { x: 166, y: 296, r: 2.2, t: 1.45, label: "ζ Cordis", lx: 142, ly: 280, anchor: "end" },
    { x: 158, y: 412, r: 1.7, t: 1.5, label: "η Vestis", lx: 148, ly: 430, anchor: "end" },
    { x: 242, y: 412, r: 1.7, t: 1.5, label: "θ Vestis", lx: 250, ly: 426, anchor: "start" },
    { x: 244, y: 180, r: 1.5, t: 1.4, label: "ι Sceptri", lx: 252, ly: 176, anchor: "start" },
  ],
  links: [[0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [3, 6], [4, 7], [6, 7], [4, 8], [2, 8]],
  glyphs: [{ x: 166, y: 302, text: "♀︎", size: 8, t: 1.2, anchor: "middle" }],
};

/* ------------------------------------------------------------------ */
/* VII — The Chariot: starry canopy, two sphinxes, the wall behind     */
/* ------------------------------------------------------------------ */

const CHARIOT: Scene = {
  cartouche: "☽︎ CVRRVS · DOMUS LUNAE",
  focal: 0,
  segments: [
    { t: 0.15, d: "M 126 154 C 140 116 260 116 274 154" },
    { t: 0.25, w: 0.6, d: "M 126 154 C 138 162 150 162 162 154 C 174 162 186 162 200 154 C 214 162 226 162 238 154 C 250 162 262 162 274 154" },
    { t: 0.35, w: 0.7, d: "M 134 154 L 134 260 M 266 154 L 266 260" },
    { t: 0.4, d: "M 200 172 C 207 172 211 177 211 184 C 211 191 207 196 200 196 C 193 196 189 191 189 184 C 189 177 193 172 200 172 Z" },
    { t: 0.48, w: 0.6, d: "M 190 174 L 196 164 L 200 172 L 204 164 L 210 174" },
    { t: 0.5, w: 0.6, d: "M 186 204 C 194 198 206 198 214 204" },
    { t: 0.55, d: "M 192 196 C 188 214 186 234 188 254 M 208 196 C 212 214 214 234 212 254" },
    { t: 0.65, w: 0.7, d: "M 190 208 C 178 222 168 238 162 256 M 210 208 C 222 222 232 238 238 256" },
    { t: 0.75, w: 1, d: "M 150 254 L 250 254 L 244 308 L 156 308 Z" },
    { t: 0.85, w: 0.5, op: 0.6, d: "M 160 264 L 240 264 L 236 300 L 164 300 Z" },
    { t: 0.9, w: 0.5, op: 0.6, d: "M 162 256 C 150 300 138 350 130 388 M 238 256 C 250 300 262 350 270 388" },
    { t: 0.95, w: 0.6, op: 0.5, d: "M 88 360 L 88 342 L 100 342 L 100 350 L 114 350 L 114 342 L 128 342 L 128 360 M 272 360 L 272 342 L 286 342 L 286 350 L 300 350 L 300 342 L 312 342 L 312 360" },
    { t: 1.0, d: "M 96 418 C 100 406 114 398 132 398 C 150 398 162 406 166 418 Z" },
    { t: 1.05, d: "M 104 392 C 104 384 110 378 116 378 C 122 378 126 384 125 390 C 124 396 118 399 112 398 C 107 397 104 395 104 392 Z" },
    { t: 1.1, w: 0.5, op: 0.7, d: "M 106 380 C 102 388 102 394 106 398 M 124 382 C 127 388 127 394 123 398" },
    { t: 1.15, w: 0.6, d: "M 92 424 L 172 424" },
    { t: 1.05, op: 0.65, d: "M 234 418 C 238 406 252 398 270 398 C 288 398 300 406 304 418 Z" },
    { t: 1.1, op: 0.65, d: "M 296 392 C 296 384 290 378 284 378 C 278 378 274 384 275 390 C 276 396 282 399 288 398 C 293 397 296 395 296 392 Z" },
    { t: 1.15, w: 0.6, op: 0.65, d: "M 228 424 L 308 424" },
  ],
  stars: [
    { x: 200, y: 118, r: 2.6, t: 1.3, label: "α Canopi", lx: 210, ly: 112, anchor: "start" },
    { x: 134, y: 152, r: 1.8, t: 1.2, label: "β Tegminis", lx: 124, ly: 144, anchor: "end" },
    { x: 266, y: 152, r: 1.8, t: 1.2, label: "γ Tegminis", lx: 276, ly: 144, anchor: "start" },
    { x: 200, y: 212, r: 2, t: 1.35, label: "δ Pectoris", lx: 216, ly: 224, anchor: "start" },
    { x: 128, y: 398, r: 1.7, t: 1.5, label: "ε Sphingis", lx: 104, ly: 372, anchor: "end" },
    { x: 272, y: 398, r: 1.7, t: 1.5, label: "ζ Sphingis", lx: 284, ly: 390, anchor: "start" },
    { x: 160, y: 300, r: 1.5, t: 1.45, label: "η Rhedae", lx: 148, ly: 292, anchor: "end" },
    { x: 240, y: 300, r: 1.5, t: 1.45, label: "θ Rhedae", lx: 250, ly: 294, anchor: "start" },
  ],
  links: [[0, 1], [0, 2], [1, 3], [2, 3], [3, 6], [3, 7], [6, 4], [7, 5], [1, 6], [2, 7]],
  glyphs: [{ x: 200, y: 289, text: "☽︎", size: 10, t: 1.25, anchor: "middle" }],
};

/* ------------------------------------------------------------------ */
/* X — Wheel of Fortune: spoked wheel, sphinx above, snake descending  */
/* ------------------------------------------------------------------ */

const WHEEL: Scene = {
  cartouche: "♃︎ ROTA FORTVNAE · DOMUS IOVIS",
  focal: 0,
  segments: [
    { t: 0.15, d: "M 112 286 C 112 237 151 198 200 198 C 249 198 288 237 288 286 C 288 335 249 374 200 374 C 151 374 112 335 112 286 Z" },
    { t: 0.3, d: "M 136 286 C 136 251 165 222 200 222 C 235 222 264 251 264 286 C 264 321 235 350 200 350 C 165 350 136 321 136 286 Z" },
    { t: 0.4, d: "M 186 286 C 186 278 192 272 200 272 C 208 272 214 278 214 286 C 214 294 208 300 200 300 C 192 300 186 294 186 286 Z" },
    { t: 0.5, w: 0.7, d: "M 200 198 L 200 272 M 200 300 L 200 374" },
    { t: 0.55, w: 0.7, d: "M 112 286 L 186 286 M 214 286 L 288 286" },
    { t: 0.6, w: 0.6, d: "M 138 224 L 190 276 M 210 296 L 262 348 M 262 224 L 210 276 M 190 296 L 138 348" },
    { t: 0.7, d: "M 188 196 C 186 186 188 176 194 170 C 196 168 204 168 206 170 C 212 176 214 186 212 196 Z" },
    { t: 0.78, d: "M 200 158 C 205 158 208 162 208 166 C 208 170 205 173 200 173 C 195 173 192 170 192 166 C 192 162 195 158 200 158 Z" },
    { t: 0.85, w: 0.6, d: "M 193 160 L 200 150 L 207 160" },
    { t: 0.88, w: 0.7, d: "M 214 168 L 228 150 M 220 166 L 226 162" },
    { t: 0.95, w: 0.8, d: "M 96 200 C 84 224 90 250 82 272 C 76 290 82 312 74 332 C 70 344 74 356 70 366" },
    { t: 1.0, w: 0.7, d: "M 70 366 C 66 370 66 376 71 378 C 76 379 79 374 76 370" },
    { t: 1.0, w: 0.7, op: 0.7, d: "M 310 340 C 318 322 316 300 324 282 C 328 272 326 260 332 250" },
    { t: 1.05, w: 0.6, op: 0.7, d: "M 332 250 L 328 238 M 332 250 L 338 240" },
  ],
  stars: [
    { x: 200, y: 120, r: 2.6, t: 1.3, label: "α Sphingis", lx: 210, ly: 114, anchor: "start" },
    { x: 200, y: 198, r: 1.9, t: 1.2, label: "β Rotae", lx: 216, ly: 190, anchor: "start" },
    { x: 262, y: 224, r: 1.6, t: 1.35, label: "γ Rotae", lx: 270, ly: 218, anchor: "start" },
    { x: 288, y: 286, r: 1.6, t: 1.35, label: "δ Rotae", lx: 296, ly: 290, anchor: "start" },
    { x: 262, y: 348, r: 1.6, t: 1.4, label: "ε Rotae", lx: 270, ly: 356, anchor: "start" },
    { x: 200, y: 374, r: 1.9, t: 1.45, label: "ζ Rotae", lx: 208, ly: 384, anchor: "start" },
    { x: 138, y: 348, r: 1.6, t: 1.4, label: "η Rotae", lx: 130, ly: 358, anchor: "end" },
    { x: 112, y: 286, r: 1.6, t: 1.35, label: "θ Rotae", lx: 104, ly: 290, anchor: "end" },
    { x: 138, y: 224, r: 1.6, t: 1.35, label: "ι Rotae", lx: 130, ly: 218, anchor: "end" },
    { x: 200, y: 286, r: 1.8, t: 1.5, label: "κ Axis", lx: 216, ly: 306, anchor: "start" },
  ],
  links: [[1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 1], [1, 9], [3, 9], [5, 9], [7, 9], [0, 1]],
  glyphs: [
    { x: 200, y: 215, text: "T", size: 9, t: 1.2, anchor: "middle" },
    { x: 281, y: 290, text: "A", size: 9, t: 1.25, anchor: "middle" },
    { x: 200, y: 364, text: "R", size: 9, t: 1.3, anchor: "middle" },
    { x: 124, y: 290, text: "O", size: 9, t: 1.35, anchor: "middle" },
  ],
};

/* ------------------------------------------------------------------ */
/* XIII — Death: skeleton rider, rose banner, towers and setting sun   */
/* ------------------------------------------------------------------ */

const DEATH: Scene = {
  cartouche: "♇︎ MORS · DOMUS PLUTONIS",
  focal: 0,
  segments: [
    { t: 0.15, w: 0.9, d: "M 118 118 L 118 300" },
    { t: 0.25, d: "M 118 122 L 168 130 L 164 158 L 118 150 Z" },
    { t: 0.35, w: 0.4, op: 0.5, d: "M 130 124 L 128 152 M 144 126 L 142 154" },
    { t: 0.4, w: 0.6, d: "M 136 134 C 136 131 139 129 142 129 C 145 129 147 131 147 134 C 147 137 145 140 142 140 C 139 140 136 137 136 134 Z" },
    { t: 0.48, w: 0.5, d: "M 142 126 L 142 122 M 148 130 L 152 128 M 150 138 L 153 141 M 134 138 L 131 141 M 136 130 L 132 128" },
    { t: 0.35, d: "M 196 154 C 204 154 209 160 209 168 C 209 174 206 178 202 180 L 202 186 L 192 186 L 192 180 C 188 178 185 174 185 168 C 185 160 190 154 196 154 Z" },
    { t: 0.45, w: 0.5, op: 0.7, d: "M 191 168 L 195 168 M 199 168 L 203 168 M 196 173 L 196 177" },
    { t: 0.5, d: "M 197 186 C 196 200 196 216 197 232" },
    { t: 0.6, w: 0.6, d: "M 197 196 C 186 194 178 198 176 206 M 197 196 C 208 194 216 198 218 206 M 197 208 C 188 206 181 210 180 216 M 197 208 C 206 206 213 210 214 216 M 197 220 C 190 219 185 222 184 227 M 197 220 C 204 219 209 222 210 227" },
    { t: 0.7, w: 0.7, d: "M 190 192 C 170 196 150 210 138 230 C 132 240 126 250 121 258" },
    { t: 0.75, w: 0.6, d: "M 190 232 C 196 236 204 236 210 232" },
    { t: 0.8, w: 0.6, op: 0.8, d: "M 208 234 C 216 254 220 276 218 300" },
    { t: 0.6, d: "M 240 240 C 252 232 262 236 266 248 C 269 258 264 268 256 272" },
    { t: 0.68, d: "M 256 272 C 250 278 242 280 236 276" },
    { t: 0.72, w: 0.5, d: "M 242 238 L 244 230 M 248 236 L 252 229" },
    { t: 0.78, d: "M 236 262 C 214 258 192 260 176 270 C 164 278 156 290 154 304" },
    { t: 0.85, d: "M 232 272 C 234 300 236 330 236 358 C 236 380 238 408 240 434" },
    { t: 0.9, d: "M 160 302 C 156 340 152 390 150 428" },
    { t: 0.95, w: 0.6, d: "M 232 434 L 248 434 M 142 428 L 158 428" },
    { t: 0.85, w: 0.7, op: 0.7, d: "M 306 210 L 306 160 L 312 152 L 318 160 L 318 210" },
    { t: 0.9, w: 0.7, op: 0.7, d: "M 344 214 L 344 162 L 350 154 L 356 162 L 356 214" },
    { t: 0.95, w: 0.7, op: 0.8, d: "M 316 210 C 320 196 344 196 348 210" },
    { t: 1.0, w: 0.5, op: 0.7, d: "M 332 196 L 332 188 M 324 200 L 318 194 M 340 200 L 346 194" },
  ],
  stars: [
    { x: 142, y: 134, r: 2.4, t: 1.3, label: "α Rosae", lx: 152, ly: 126, anchor: "start" },
    { x: 168, y: 130, r: 1.6, t: 1.2, label: "β Vexilli", lx: 176, ly: 122, anchor: "start" },
    { x: 196, y: 168, r: 2, t: 1.35, label: "γ Cranii", lx: 212, ly: 160, anchor: "start" },
    { x: 262, y: 252, r: 1.8, t: 1.4, label: "δ Equi", lx: 272, ly: 246, anchor: "start" },
    { x: 312, y: 158, r: 1.6, t: 1.45, label: "ε Turris", lx: 302, ly: 148, anchor: "end" },
    { x: 350, y: 160, r: 1.6, t: 1.45, label: "ζ Turris", lx: 358, ly: 152, anchor: "start" },
    { x: 332, y: 204, r: 1.8, t: 1.5, label: "η Solis", lx: 336, ly: 224, anchor: "start" },
    { x: 150, y: 430, r: 1.5, t: 1.55, label: "θ Ungulae", lx: 140, ly: 446, anchor: "end" },
    { x: 240, y: 436, r: 1.5, t: 1.55, label: "ι Ungulae", lx: 250, ly: 444, anchor: "start" },
  ],
  links: [[0, 1], [1, 2], [2, 3], [3, 8], [2, 7], [7, 8], [4, 6], [5, 6], [4, 5]],
  glyphs: [],
};

/* ------------------------------------------------------------------ */
/* XVII — The Star: kneeling figure, two jugs, big star + seven small  */
/* ------------------------------------------------------------------ */

const STAR: Scene = {
  cartouche: "♒︎ STELLA · DOMUS AQUARII",
  focal: 0,
  segments: [
    { t: 0.15, d: "M 200 86 L 205.7 102.3 L 222 108 L 205.7 113.7 L 200 130 L 194.3 113.7 L 178 108 L 194.3 102.3 Z" },
    { t: 0.25, w: 0.7, op: 0.85, d: "M 215.7 92.3 L 208 108 L 215.7 123.7 L 200 116 L 184.3 123.7 L 192 108 L 184.3 92.3 L 200 100 Z" },
    { t: 0.3, w: 0.5, d: "M 196 108 C 196 106 198 104 200 104 C 202 104 204 106 204 108 C 204 110 202 112 200 112 C 198 112 196 110 196 108 Z" },
    { t: 0.35, d: "M 196 236 C 202 236 206 240 206 246 C 206 252 202 256 196 256 C 190 256 186 252 186 246 C 186 240 190 236 196 236 Z" },
    { t: 0.42, w: 0.6, op: 0.7, d: "M 188 240 C 184 252 184 264 188 274" },
    { t: 0.5, d: "M 194 256 C 188 280 184 306 184 330" },
    { t: 0.55, d: "M 204 258 C 206 282 206 306 202 328" },
    { t: 0.65, d: "M 184 330 C 176 360 172 392 176 424" },
    { t: 0.68, d: "M 202 328 C 210 352 214 384 210 414" },
    { t: 0.75, d: "M 210 414 C 226 420 244 420 258 414" },
    { t: 0.78, w: 0.6, d: "M 168 424 L 212 424" },
    { t: 0.7, d: "M 190 262 C 178 280 168 300 162 320" },
    { t: 0.8, w: 0.7, d: "M 152 322 C 150 332 154 340 162 340 C 170 340 174 332 172 322 C 168 318 156 318 152 322 Z" },
    { t: 0.9, w: 0.5, op: 0.7, d: "M 158 342 C 156 356 158 372 156 386 C 155 394 157 402 156 408" },
    { t: 0.72, d: "M 204 264 C 216 282 226 302 232 322" },
    { t: 0.82, w: 0.7, d: "M 224 324 C 222 334 226 342 234 342 C 242 342 246 334 244 324 C 240 320 228 320 224 324 Z" },
    { t: 0.92, w: 0.5, op: 0.7, d: "M 230 344 C 228 358 230 374 228 388 C 227 396 229 404 228 412" },
    { t: 1.0, w: 0.6, op: 0.6, d: "M 250 424 C 268 418 292 418 310 424" },
    { t: 1.05, w: 0.5, op: 0.5, d: "M 258 434 C 272 429 290 429 302 434" },
    { t: 1.08, w: 0.4, op: 0.5, d: "M 220 420 C 226 418 234 418 240 420" },
    { t: 0.95, w: 0.6, op: 0.6, d: "M 140 424 L 166 424" },
  ],
  stars: [
    { x: 200, y: 108, r: 3.2, t: 1.3, label: "α Magna", lx: 228, ly: 104, anchor: "start" },
    { x: 120, y: 150, r: 1.5, t: 1.4, label: "β Spei", lx: 112, ly: 144, anchor: "end" },
    { x: 280, y: 150, r: 1.5, t: 1.4, label: "γ Aurorae", lx: 288, ly: 146, anchor: "start" },
    { x: 90, y: 220, r: 1.4, t: 1.45, label: "δ Fontis", lx: 82, ly: 214, anchor: "end" },
    { x: 310, y: 220, r: 1.4, t: 1.45, label: "ε Undae", lx: 318, ly: 216, anchor: "start" },
    { x: 140, y: 250, r: 1.4, t: 1.5, label: "ζ Terrae", lx: 130, ly: 244, anchor: "end" },
    { x: 260, y: 250, r: 1.4, t: 1.5, label: "η Aquae", lx: 270, ly: 244, anchor: "start" },
    { x: 200, y: 180, r: 1.5, t: 1.45, label: "θ Media", lx: 210, ly: 176, anchor: "start" },
  ],
  links: [[0, 7], [0, 1], [0, 2], [1, 3], [2, 4], [1, 5], [2, 6], [7, 5], [7, 6]],
  glyphs: [],
};

/* ------------------------------------------------------------------ */
/* XXII — The Fool: cliff edge, the dog, the sun                       */
/* ------------------------------------------------------------------ */

const FOOL: Scene = {
  cartouche: "♅︎ STULTVS · DOMUS VRANI",
  focal: 0,
  segments: [
    { t: 0.15, d: "M 300 116 C 300 107 307 100 316 100 C 325 100 332 107 332 116 C 332 125 325 132 316 132 C 307 132 300 125 300 116 Z" },
    { t: 0.25, w: 0.7, d: "M 336 116 L 344 116 M 296 116 L 288 116 M 316 96 L 316 88 M 316 136 L 316 144 M 330.1 101.9 L 335.8 96.2 M 301.9 101.9 L 296.2 96.2 M 330.1 130.1 L 335.8 135.8 M 301.9 130.1 L 296.2 135.8" },
    { t: 0.3, d: "M 206 158 C 212 158 216 163 216 169 C 216 175 212 179 206 179 C 200 179 196 175 196 169 C 196 163 200 158 206 158 Z" },
    { t: 0.38, w: 0.6, op: 0.8, d: "M 200 160 C 194 152 186 148 178 148 C 184 154 190 158 196 161" },
    { t: 0.45, d: "M 200 179 C 194 200 190 226 192 252" },
    { t: 0.5, d: "M 212 180 C 214 202 214 228 210 254" },
    { t: 0.55, w: 0.6, d: "M 191 252 C 197 256 205 257 211 254" },
    { t: 0.65, d: "M 192 254 C 186 280 184 306 186 330 M 210 254 C 214 278 216 304 214 328" },
    { t: 0.7, d: "M 186 330 C 195 336 205 336 214 328" },
    { t: 0.75, d: "M 192 330 C 188 352 184 376 180 400" },
    { t: 0.8, w: 0.7, d: "M 180 400 L 168 408" },
    { t: 0.8, d: "M 208 330 C 218 342 228 350 238 356" },
    { t: 0.85, w: 0.6, d: "M 238 356 C 244 358 248 362 248 366" },
    { t: 0.6, d: "M 198 184 C 188 200 180 218 176 236" },
    { t: 0.68, w: 0.8, d: "M 172 240 L 148 184" },
    { t: 0.75, w: 0.7, d: "M 142 180 C 140 172 146 166 152 168 C 158 170 159 178 154 182 C 150 185 144 184 142 180 Z" },
    { t: 0.62, d: "M 212 186 C 224 176 238 168 252 162" },
    { t: 0.7, w: 0.5, d: "M 252 162 L 258 158" },
    { t: 0.85, w: 0.9, d: "M 56 430 C 76 424 96 422 116 420 C 132 418 148 414 162 410 L 172 406 C 174 420 172 436 174 452 C 175 462 173 472 174 480" },
    { t: 0.92, w: 0.5, op: 0.5, d: "M 60 442 C 84 436 108 434 132 431" },
    { t: 0.95, w: 0.5, op: 0.45, d: "M 66 454 C 88 449 110 447 134 444" },
    { t: 1.0, w: 0.4, op: 0.5, d: "M 172 420 L 182 424 M 173 438 L 184 441 M 174 456 L 183 459" },
    { t: 0.9, w: 0.7, d: "M 96 400 C 100 392 112 388 122 390 C 130 392 134 398 132 404 C 124 408 108 408 96 400 Z" },
    { t: 0.95, w: 0.6, d: "M 126 390 C 128 382 134 378 138 381 C 141 384 139 390 134 392" },
    { t: 0.98, w: 0.5, d: "M 130 382 L 128 376" },
    { t: 1.0, w: 0.5, d: "M 104 404 L 104 414 M 116 406 L 116 415 M 126 404 L 126 413" },
    { t: 1.02, w: 0.6, d: "M 96 400 C 90 396 86 390 86 384" },
  ],
  stars: [
    { x: 316, y: 116, r: 2.8, t: 1.3, label: "α Solis", lx: 316, ly: 82, anchor: "middle" },
    { x: 206, y: 169, r: 1.8, t: 1.25, label: "β Verticis", lx: 218, ly: 162, anchor: "start" },
    { x: 196, y: 220, r: 1.6, t: 1.35, label: "γ Humeri", lx: 218, ly: 226, anchor: "start" },
    { x: 150, y: 186, r: 1.6, t: 1.3, label: "δ Baculi", lx: 140, ly: 178, anchor: "end" },
    { x: 178, y: 238, r: 1.4, t: 1.4, label: "ε Manus", lx: 168, ly: 248, anchor: "end" },
    { x: 238, y: 356, r: 1.7, t: 1.45, label: "ζ Pedis", lx: 250, ly: 350, anchor: "start" },
    { x: 164, y: 410, r: 1.7, t: 1.5, label: "η Rupis", lx: 152, ly: 398, anchor: "end" },
    { x: 114, y: 396, r: 1.6, t: 1.5, label: "θ Canis", lx: 96, ly: 380, anchor: "end" },
    { x: 86, y: 386, r: 1.4, t: 1.55 },
  ],
  links: [[0, 1], [1, 3], [3, 4], [1, 2], [2, 4], [2, 5], [2, 6], [6, 7], [7, 8], [6, 5]],
  glyphs: [],
};

const SCENES: Record<number, Scene> = {
  1: MAGICIAN,
  3: EMPRESS,
  7: CHARIOT,
  9: HERMIT,
  10: WHEEL,
  13: DEATH,
  17: STAR,
  22: FOOL,
};

/* ------------------------------------------------------------------ */
/* Shared sky decor (identical across all plates)                      */
/* ------------------------------------------------------------------ */

/** Coma Berenices: faint neighbor-constellation hint, upper right. */
const COMA = {
  stars: [
    [318, 108],
    [334, 96],
    [348, 112],
    [330, 124],
  ] as [number, number][],
  links: [
    [0, 1],
    [1, 2],
    [0, 3],
  ] as [number, number][],
};

/** Deterministic faint silver field stars. */
const FIELD = Array.from({ length: 30 }, (_, i) => ({
  x: 30 + ((i * 83 + 47) % 340),
  y: 100 + ((i * 61 + 29) % 390),
  r: 0.35 + ((i * 11) % 8) / 14,
  twinkle: i % 10 === 3,
  dur: 18 + ((i * 9) % 26),
  delay: -((i * 3.1) % 14),
}));

/** Frame corners that carry star-rosette ornaments. */
const CORNERS: [number, number][] = [
  [26, 26],
  [374, 26],
  [26, 566],
  [374, 566],
];

/** Engraver's hatching between the outer and inner frame rules. */
const HATCH: [number, number, number, number][] = [];
for (let x = 48; x <= 352; x += 16) {
  HATCH.push([x, 10, x, 16], [x, 584, x, 590]);
}
for (let y = 48; y <= 544; y += 16) {
  HATCH.push([10, y, 16, y], [384, y, 390, y]);
}

/** Roman numerals for the major arcana (1-22; anything else → "·"). */
function toRoman(n: number): string {
  if (!Number.isInteger(n) || n < 1 || n > 22) return "·";
  let rem = n;
  let out = "";
  for (const [v, s] of [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]] as [number, string][]) {
    while (rem >= v) {
      out += s;
      rem -= v;
    }
  }
  return out;
}

interface PlateProps {
  number?: number;
  name?: string;
  variant?: number;
}

export default function VirgoChartCard({ number = 9, name = "THE HERMIT", variant = 0 }: PlateProps) {
  const scene = SCENES[number] ?? HERMIT;
  const pal = PALETTES[Math.min(7, Math.max(0, Math.round(variant) || 0))];
  const numeral = toRoman(number);
  const focal = scene.stars[scene.focal];
  const caption = name.toUpperCase();
  const nameSize = caption.length > 13 ? 10.5 : caption.length > 10 ? 12 : 14;
  const nameSpacing = caption.length > 13 ? 2.5 : caption.length > 10 ? 3.5 : 5;
  const { gold: GOLD, goldBright: GOLD_BRIGHT, goldDim: GOLD_DIM, silver: SILVER, silverBright: SILVER_BRIGHT, ink: INK } = pal;

  return (
    <figure
      className="cz-virgo-root"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0, background: INK }}
      role="img"
      aria-label={`${caption} tarot card rendered as an engraved constellation plate`}
    >
      <style>{`
        .cz-virgo-root { position: relative; overflow: hidden; border-radius: 10px; }
        .cz-virgo-root svg { display: block; width: 100%; height: 100%; }

        /* ---- load reveal: the figure engraves itself, stars pop in ---- */
        .cz-virgo-draw {
          stroke-dasharray: 1;
          animation: cz-virgo-draw 0.5s ease-out both;
        }
        .cz-virgo-star {
          transform-box: fill-box;
          transform-origin: center;
          animation: cz-virgo-star-pop 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .cz-virgo-fade { animation: cz-virgo-fade-in 0.8s ease-out both; }

        @keyframes cz-virgo-draw {
          from { opacity: 0; stroke-dashoffset: 1; }
          to { opacity: 1; stroke-dashoffset: 0; }
        }
        @keyframes cz-virgo-star-pop {
          from { opacity: 0; transform: scale(0.2); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes cz-virgo-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* ---- ambient: very slow, low amplitude ---- */
        .cz-virgo-spica { animation: cz-virgo-spica 38s ease-in-out infinite; }
        @keyframes cz-virgo-spica {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 0.85; }
        }
        .cz-virgo-milky { animation: cz-virgo-milky 52s ease-in-out infinite; }
        @keyframes cz-virgo-milky {
          0%, 100% { opacity: 0.07; }
          50% { opacity: 0.13; }
        }
        .cz-virgo-lantern { animation: cz-virgo-lantern 24s ease-in-out infinite; }
        @keyframes cz-virgo-lantern {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.6; }
        }
        .cz-virgo-twinkle { animation: cz-virgo-twinkle 22s ease-in-out infinite; }
        @keyframes cz-virgo-twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.75; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cz-virgo-root *, .cz-virgo-root *::before, .cz-virgo-root *::after {
            animation: none !important;
          }
        }
      `}</style>

      <svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <radialGradient id="cz-virgo-sky" cx="50%" cy="42%" r="80%">
            <stop offset="0%" stopColor={pal.sky[0]} />
            <stop offset="50%" stopColor={pal.sky[1]} />
            <stop offset="100%" stopColor={pal.sky[2]} />
          </radialGradient>
          <radialGradient id="cz-virgo-silverglow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={SILVER_BRIGHT} stopOpacity="0.95" />
            <stop offset="35%" stopColor={SILVER} stopOpacity="0.35" />
            <stop offset="100%" stopColor={SILVER} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cz-virgo-goldglow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={GOLD_BRIGHT} stopOpacity="0.9" />
            <stop offset="40%" stopColor={GOLD} stopOpacity="0.3" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cz-virgo-band" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={SILVER} stopOpacity="0" />
            <stop offset="50%" stopColor={SILVER} stopOpacity="0.55" />
            <stop offset="100%" stopColor={SILVER} stopOpacity="0" />
          </linearGradient>
          <filter id="cz-virgo-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
          <filter id="cz-virgo-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.83  0 0 0 0 0.68  0 0 0 0 0.38  0 0 0 0.05 0" />
          </filter>
        </defs>

        {/* sky + paper grain */}
        <rect x="0" y="0" width="400" height="600" fill="url(#cz-virgo-sky)" />
        <rect x="0" y="0" width="400" height="600" filter="url(#cz-virgo-grain)" />

        {/* Milky Way band behind the figure — soft silver wash, shimmering */}
        <ellipse
          className="cz-virgo-milky"
          cx="200"
          cy="290"
          rx="270"
          ry="46"
          fill="url(#cz-virgo-band)"
          filter="url(#cz-virgo-blur)"
          transform="rotate(-28 200 290)"
        />
        <text className="cz-virgo-fade" style={{ animationDelay: "1.7s" }} x="66" y="168" transform="rotate(-28 66 168)" fill={SILVER} fillOpacity="0.5" fontSize="5.5" fontFamily={SERIF} fontStyle="italic" letterSpacing="2">
          VIA LACTEA
        </text>

        {/* engraved plate frame: hatched double rule + star-rosette corners */}
        <g className="cz-virgo-fade" style={{ animationDelay: "0.1s" }}>
          <rect x="10" y="10" width="380" height="580" fill="none" stroke={GOLD_DIM} strokeWidth="1.4" />
          <rect x="16" y="16" width="368" height="568" fill="none" stroke={GOLD_DIM} strokeWidth="0.5" />
          {HATCH.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={GOLD} strokeOpacity="0.22" strokeWidth="0.4" />
          ))}
          {CORNERS.map(([cx, cy], ci) => (
            <g key={ci}>
              <circle cx={cx} cy={cy} r="12" fill={INK} fillOpacity="0.7" stroke={GOLD} strokeOpacity="0.6" strokeWidth="0.8" />
              <circle cx={cx} cy={cy} r="8.5" fill="none" stroke={GOLD} strokeOpacity="0.35" strokeWidth="0.4" />
              {Array.from({ length: 8 }, (_, k) => {
                const a = (k * 45 * Math.PI) / 180;
                const len = k % 2 === 0 ? 7.5 : 4.5;
                return (
                  <line
                    key={k}
                    x1={cx}
                    y1={cy}
                    x2={cx + len * Math.cos(a)}
                    y2={cy + len * Math.sin(a)}
                    stroke={GOLD}
                    strokeOpacity="0.7"
                    strokeWidth="0.55"
                  />
                );
              })}
              <circle cx={cx} cy={cy} r="1.3" fill={GOLD_BRIGHT} />
            </g>
          ))}
        </g>

        {/* background field stars */}
        <g className="cz-virgo-fade" style={{ animationDelay: "0.5s" }}>
          {FIELD.map((s, i) => (
            <circle
              key={i}
              className={s.twinkle ? "cz-virgo-twinkle" : undefined}
              style={s.twinkle ? { animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` } : undefined}
              cx={s.x} cy={s.y} r={s.r} fill={SILVER} fillOpacity={s.twinkle ? 1 : 0.55}
            />
          ))}
        </g>

        {/* faint dashed ecliptic arc crossing the plate */}
        <g className="cz-virgo-fade" style={{ animationDelay: "0.8s" }}>
          <ellipse
            cx="200"
            cy="300"
            rx="230"
            ry="64"
            fill="none"
            stroke={GOLD}
            strokeOpacity="0.14"
            strokeWidth="0.6"
            strokeDasharray="5 4"
            transform="rotate(-24 200 300)"
          />
          <text x="298" y="430" transform="rotate(-24 298 430)" fill={GOLD} fillOpacity="0.4" fontSize="5.5" fontFamily={SERIF} letterSpacing="2">
            ECLIPTICA
          </text>
        </g>

        {/* Coma Berenices: faint neighbor hint */}
        <g className="cz-virgo-fade" style={{ animationDelay: "1.1s" }}>
          {COMA.links.map(([a, b], li) => (
            <line
              key={li}
              x1={COMA.stars[a][0]}
              y1={COMA.stars[a][1]}
              x2={COMA.stars[b][0]}
              y2={COMA.stars[b][1]}
              stroke={SILVER}
              strokeOpacity="0.2"
              strokeWidth="0.45"
              strokeDasharray="2 3"
            />
          ))}
          {COMA.stars.map(([sx, sy], si) => (
            <circle key={si} cx={sx} cy={sy} r={si === 1 ? 1.5 : 1.1} fill={SILVER} fillOpacity="0.5" />
          ))}
          <text x="312" y="88" fill={SILVER} fillOpacity="0.45" fontSize="6" fontFamily={SERIF} fontStyle="italic" letterSpacing="1.5">
            COMA BERENICES
          </text>
        </g>

        {/* chart hairlines between the asterism's stars */}
        <g className="cz-virgo-fade" style={{ animationDelay: "1.55s" }}>
          {scene.links.map(([a, b], i) => (
            <line
              key={i}
              x1={scene.stars[a].x}
              y1={scene.stars[a].y}
              x2={scene.stars[b].x}
              y2={scene.stars[b].y}
              stroke={SILVER}
              strokeOpacity="0.28"
              strokeWidth="0.5"
            />
          ))}
        </g>

        {/* the figure, engraved segment by segment */}
        <g fill="none" stroke={GOLD} strokeLinecap="round" strokeLinejoin="round">
          {scene.segments.map((s, i) => (
            <path
              key={i}
              className="cz-virgo-draw"
              pathLength={1}
              d={s.d}
              strokeWidth={s.w ?? 0.8}
              strokeOpacity={s.op ?? 0.9}
              style={{ animationDelay: `${s.t}s` }}
            />
          ))}
        </g>

        {/* scene glyphs (suit signs, T·A·R·O letters, moon on the chariot) */}
        {scene.glyphs.map((g, i) => (
          <text
            key={i}
            className="cz-virgo-fade"
            style={{ animationDelay: `${g.t}s` }}
            x={g.x} y={g.y} textAnchor={g.anchor ?? "middle"} fill={GOLD} fillOpacity="0.9"
            fontSize={g.size} fontFamily={SERIF}
          >
            {g.text}
          </text>
        ))}

        {/* the asterism: silver nodes, halos, greek-letter labels */}
        <g>
          {scene.stars.map((s, i) => (
            <g key={i}>
              <circle
                className="cz-virgo-star"
                style={{ animationDelay: `${s.t}s` }}
                cx={s.x} cy={s.y} r={s.r + 2.6} fill="none" stroke={SILVER} strokeOpacity="0.3" strokeWidth="0.4"
              />
              <circle
                className="cz-virgo-star"
                style={{ animationDelay: `${s.t}s` }}
                cx={s.x} cy={s.y} r={s.r} fill={i === scene.focal ? SILVER_BRIGHT : SILVER}
              />
              {s.label && (
                <text
                  className="cz-virgo-fade"
                  style={{ animationDelay: `${s.t + 0.15}s` }}
                  x={s.lx} y={s.ly} textAnchor={s.anchor ?? "start"} fill={SILVER} fillOpacity="0.8"
                  fontSize="6.5" fontFamily={SERIF} fontStyle="italic" letterSpacing="0.5"
                >
                  {s.label}
                </text>
              )}
            </g>
          ))}
          {/* focal star: slow-pulsing glow + four-point sparkle */}
          <circle className="cz-virgo-spica" cx={focal.x} cy={focal.y} r={focal.r + 14} fill="url(#cz-virgo-silverglow)" />
          <g className="cz-virgo-fade" style={{ animationDelay: "1.6s" }}>
            <line x1={focal.x} y1={focal.y - 10} x2={focal.x} y2={focal.y + 10} stroke={SILVER_BRIGHT} strokeOpacity="0.9" strokeWidth="0.6" />
            <line x1={focal.x - 10} y1={focal.y} x2={focal.x + 10} y2={focal.y} stroke={SILVER_BRIGHT} strokeOpacity="0.9" strokeWidth="0.6" />
          </g>
        </g>

        {/* the little Hermit in the bottom corner, lantern raised, gazing up */}
        <g className="cz-virgo-fade" style={{ animationDelay: "1.6s" }}>
          <line x1="44" y1="514" x2="106" y2="514" stroke={GOLD} strokeOpacity="0.35" strokeWidth="0.6" />
          {[52, 66, 80, 94].map((x) => (
            <line key={x} x1={x} y1={514} x2={x - 3} y2={519} stroke={GOLD} strokeOpacity="0.2" strokeWidth="0.4" />
          ))}
          <line x1="87" y1="472" x2="87" y2="514" stroke={GOLD} strokeOpacity="0.85" strokeWidth="0.9" />
          <path
            d="M 72 466 C 64 473 60 486 60 512 L 84 512 C 84 492 81 476 72 466 Z"
            fill={INK} fillOpacity="0.55" stroke={GOLD} strokeOpacity="0.9" strokeWidth="0.8" strokeLinejoin="round"
          />
          <path
            d="M 72 472 C 68 476 67 482 69 486 C 72 484 76 484 78 486 C 79 481 76 475 72 472 Z"
            fill="#04060f" stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.4"
          />
          <path d="M 64 486 C 59 484 55 480 53 476" fill="none" stroke={GOLD} strokeOpacity="0.85" strokeWidth="0.7" strokeLinecap="round" />
          {/* lantern cage */}
          <g stroke={GOLD} strokeOpacity="0.9" strokeWidth="0.6" fill="none">
            <path d="M 49 466 L 57 466 L 56 476 L 50 476 Z" strokeLinejoin="round" />
            <line x1="51" y1="463" x2="55" y2="463" />
            <line x1="53" y1="463" x2="53" y2="466" />
            <line x1="53" y1="466" x2="53" y2="476" />
          </g>
          <circle cx="53" cy="471" r="2" fill={GOLD_BRIGHT} />
        </g>
        {/* lantern glow — breathing, echoing the focal star */}
        <circle className="cz-virgo-lantern" cx="53" cy="471" r="13" fill="url(#cz-virgo-goldglow)" />
        <g className="cz-virgo-fade" style={{ animationDelay: "1.75s" }}>
          <line x1="53" y1="463" x2="53" y2="479" stroke={GOLD_BRIGHT} strokeOpacity="0.8" strokeWidth="0.5" />
          <line x1="45" y1="471" x2="61" y2="471" stroke={GOLD_BRIGHT} strokeOpacity="0.8" strokeWidth="0.5" />
        </g>

        {/* roman numeral at the head of the plate */}
        <g className="cz-virgo-fade" style={{ animationDelay: "1.65s" }}>
          <line x1="152" y1="37" x2="176" y2="37" stroke={GOLD} strokeOpacity="0.4" strokeWidth="0.5" />
          <line x1="224" y1="37" x2="248" y2="37" stroke={GOLD} strokeOpacity="0.4" strokeWidth="0.5" />
          <text x="200" y="42" textAnchor="middle" fill={GOLD_BRIGHT} fontSize="12" fontFamily={SERIF} letterSpacing="2">
            {numeral}
          </text>
        </g>

        {/* title cartouche */}
        <g className="cz-virgo-fade" style={{ animationDelay: "1.5s" }}>
          <rect x="86" y="52" width="228" height="26" fill={INK} fillOpacity="0.8" stroke={GOLD} strokeOpacity="0.55" strokeWidth="0.8" />
          <rect x="90" y="56" width="220" height="18" fill="none" stroke={GOLD} strokeOpacity="0.3" strokeWidth="0.4" />
          <path d="M 80 65 L 86 59 L 86 71 Z" fill={INK} stroke={GOLD} strokeOpacity="0.45" strokeWidth="0.6" />
          <path d="M 320 65 L 314 59 L 314 71 Z" fill={INK} stroke={GOLD} strokeOpacity="0.45" strokeWidth="0.6" />
          <text x="200" y="69" textAnchor="middle" fill={GOLD_BRIGHT} fontSize="8.5" fontFamily={SERIF} letterSpacing="1.5">
            {scene.cartouche}
          </text>
        </g>

        {/* card name in engraved caps at the foot */}
        <g className="cz-virgo-fade" style={{ animationDelay: "1.8s" }}>
          <line x1="62" y1="548" x2="112" y2="548" stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.6" />
          <line x1="288" y1="548" x2="338" y2="548" stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.6" />
          <path d="M 52 548 L 56 544 L 60 548 L 56 552 Z" fill={GOLD} fillOpacity="0.6" />
          <path d="M 340 548 L 344 544 L 348 548 L 344 552 Z" fill={GOLD} fillOpacity="0.6" />
          <text x="200" y="553" textAnchor="middle" fill={GOLD_BRIGHT} fontSize={nameSize} fontFamily={SERIF} letterSpacing={nameSpacing}>
            {caption}
          </text>
        </g>
      </svg>
    </figure>
  );
}
