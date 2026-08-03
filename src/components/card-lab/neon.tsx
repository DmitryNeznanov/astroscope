/**
 * NEON — tarot deck as neon tube signs on a dark bar wall.
 * Each arcana is drawn as its own scene of glowing neon tubes (wide colored
 * "gas" stroke + thin bright core, triple drop-shadow bloom per tube group).
 *
 * Reusable gallery component:
 *   <NeonHermitCard />                                  — the original Hermit (IX), unchanged
 *   <NeonHermitCard number={13} name="DEATH" variant={3} />
 *
 * number selects the scene (1 Magician, 3 Empress, 7 Chariot, 9 Hermit,
 * 10 Wheel, 13 Death, 17 Star, 22 Fool; anything else falls back to Hermit).
 * variant (0-7) = palette (variant % 4) + mirrored artwork (variant >= 4)
 * + alternate Hermit decor (variant % 4 >= 2). variant 0 + no props renders
 * exactly the original Hermit card.
 *
 * Effect mapping (all CSS-only, reduced-motion guarded): every scene reuses
 * the same tube groups, so the 14s power-outage relight, ballast buzz,
 * wall wash, frame breathing and hover dimmer work everywhere. The lantern
 * flicker + star glow map onto each scene's light source (wand-tip spark,
 * crown star, canopy star, wheel hub, banner rose, big star, sun); the
 * sputtering weak tube maps onto its staff analog (wand, scepter, reins,
 * wheel spokes, banner pole, water stream, bindle stick).
 */
import type { CSSProperties } from "react";
import { toRoman } from "@/lib/roman";

export interface NeonCardProps {
  /** Major Arcana number 1-22, rendered as a roman numeral. Default 9 (IX). */
  number?: number;
  /** Card name rendered in neon script at the bottom. Default "THE HERMIT". */
  name?: string;
  /** 0-7: picks palette, mirroring, and decor. 0 = original Hermit look. */
  variant?: number;
}

interface TubePaint {
  tube?: string;
  core?: string;
  elec?: string;
  text?: string;
  g1: string;
  g2: string;
  g3: string;
  h1: string;
  h2: string;
  h3: string;
}

interface NeonPalette {
  figure: TubePaint;
  staff: TubePaint;
  mountain: TubePaint;
  numeral: TubePaint;
  script: TubePaint;
  star: TubePaint;
  wash1: string;
  wash2: string;
}

/* Palette 0 is the original Hermit colorway; its values match the CSS
   variable defaults below exactly, so variant 0 renders identically. */
const PALETTES: NeonPalette[] = [
  {
    // 0 — original: amber figure, cyan staff, violet mountain, red IX, pink script
    figure: { tube: "#e08a1e", core: "#ffe9c4", elec: "#8a5a1e", g1: "rgba(255, 190, 90, 0.9)", g2: "rgba(255, 160, 40, 0.75)", g3: "rgba(255, 140, 20, 0.45)", h1: "rgba(255, 200, 110, 1)", h2: "rgba(255, 170, 50, 0.95)", h3: "rgba(255, 150, 25, 0.65)" },
    staff: { tube: "#1e9ec4", core: "#d8f8ff", elec: "#2a7a94", g1: "rgba(120, 240, 255, 0.9)", g2: "rgba(40, 210, 255, 0.75)", g3: "rgba(0, 180, 255, 0.45)", h1: "rgba(140, 245, 255, 1)", h2: "rgba(50, 220, 255, 0.95)", h3: "rgba(0, 190, 255, 0.65)" },
    mountain: { tube: "#8a4fd0", core: "#e6ccff", elec: "#5a3d80", g1: "rgba(210, 150, 255, 0.85)", g2: "rgba(170, 90, 255, 0.7)", g3: "rgba(140, 60, 255, 0.4)", h1: "rgba(220, 165, 255, 1)", h2: "rgba(180, 100, 255, 0.9)", h3: "rgba(150, 70, 255, 0.6)" },
    numeral: { text: "#ffd9d9", g1: "rgba(255, 110, 110, 0.9)", g2: "rgba(255, 40, 40, 0.8)", g3: "rgba(255, 20, 20, 0.5)", h1: "rgba(255, 130, 130, 1)", h2: "rgba(255, 50, 50, 0.95)", h3: "rgba(255, 25, 25, 0.7)" },
    script: { text: "#ffd8ee", g1: "rgba(255, 160, 220, 0.9)", g2: "rgba(255, 90, 190, 0.75)", g3: "rgba(255, 60, 170, 0.45)", h1: "rgba(255, 175, 228, 1)", h2: "rgba(255, 100, 200, 0.95)", h3: "rgba(255, 70, 180, 0.65)" },
    star: { core: "#fff4d6", g1: "rgba(255, 235, 180, 1)", g2: "rgba(255, 200, 90, 0.9)", g3: "rgba(255, 170, 50, 0.6)", h1: "rgba(255, 240, 190, 1)", h2: "rgba(255, 210, 100, 1)", h3: "rgba(255, 180, 60, 0.8)" },
    wash1: "rgba(255, 170, 80, 0.16)",
    wash2: "rgba(160, 90, 255, 0.09)",
  },
  {
    // 1 — cool dive bar: icy cyan figure, amber staff, steel-blue mountain, green IX, sky script
    figure: { tube: "#1ea8e0", core: "#d8f4ff", elec: "#2a7a94", g1: "rgba(120, 220, 255, 0.9)", g2: "rgba(40, 190, 255, 0.75)", g3: "rgba(0, 150, 255, 0.45)", h1: "rgba(140, 230, 255, 1)", h2: "rgba(50, 200, 255, 0.95)", h3: "rgba(0, 160, 255, 0.65)" },
    staff: { tube: "#e08a1e", core: "#ffe9c4", elec: "#8a5a1e", g1: "rgba(255, 190, 90, 0.9)", g2: "rgba(255, 160, 40, 0.75)", g3: "rgba(255, 140, 20, 0.45)", h1: "rgba(255, 200, 110, 1)", h2: "rgba(255, 170, 50, 0.95)", h3: "rgba(255, 150, 25, 0.65)" },
    mountain: { tube: "#4f6fd0", core: "#ccd9ff", elec: "#3d4f80", g1: "rgba(150, 175, 255, 0.85)", g2: "rgba(90, 120, 255, 0.7)", g3: "rgba(60, 90, 255, 0.4)", h1: "rgba(165, 190, 255, 1)", h2: "rgba(100, 135, 255, 0.9)", h3: "rgba(70, 100, 255, 0.6)" },
    numeral: { text: "#d9ffe2", g1: "rgba(120, 255, 160, 0.9)", g2: "rgba(40, 255, 110, 0.8)", g3: "rgba(20, 230, 90, 0.5)", h1: "rgba(140, 255, 175, 1)", h2: "rgba(50, 255, 120, 0.95)", h3: "rgba(25, 240, 100, 0.7)" },
    script: { text: "#d8ecff", g1: "rgba(160, 215, 255, 0.9)", g2: "rgba(90, 180, 255, 0.75)", g3: "rgba(60, 150, 255, 0.45)", h1: "rgba(175, 225, 255, 1)", h2: "rgba(100, 190, 255, 0.95)", h3: "rgba(70, 160, 255, 0.65)" },
    star: { core: "#fff4d6", g1: "rgba(255, 235, 180, 1)", g2: "rgba(255, 200, 90, 0.9)", g3: "rgba(255, 170, 50, 0.6)", h1: "rgba(255, 240, 190, 1)", h2: "rgba(255, 210, 100, 1)", h3: "rgba(255, 180, 60, 0.8)" },
    wash1: "rgba(80, 190, 255, 0.16)",
    wash2: "rgba(90, 255, 170, 0.09)",
  },
  {
    // 2 — vaporwave: magenta figure, teal staff, purple mountain, orange IX, hot-pink script
    figure: { tube: "#e01e9c", core: "#ffd0ec", elec: "#8a1e6a", g1: "rgba(255, 110, 210, 0.9)", g2: "rgba(255, 40, 170, 0.75)", g3: "rgba(230, 20, 140, 0.45)", h1: "rgba(255, 130, 220, 1)", h2: "rgba(255, 50, 180, 0.95)", h3: "rgba(240, 25, 150, 0.65)" },
    staff: { tube: "#1ec4b0", core: "#d0fff6", elec: "#1e8a7a", g1: "rgba(120, 255, 235, 0.9)", g2: "rgba(40, 230, 205, 0.75)", g3: "rgba(20, 200, 180, 0.45)", h1: "rgba(140, 255, 240, 1)", h2: "rgba(50, 240, 215, 0.95)", h3: "rgba(25, 210, 190, 0.65)" },
    mountain: { tube: "#9a4fe0", core: "#e2ccff", elec: "#6a3d9a", g1: "rgba(215, 150, 255, 0.85)", g2: "rgba(175, 90, 255, 0.7)", g3: "rgba(145, 60, 240, 0.4)", h1: "rgba(225, 165, 255, 1)", h2: "rgba(185, 100, 255, 0.9)", h3: "rgba(155, 70, 250, 0.6)" },
    numeral: { text: "#ffe4cc", g1: "rgba(255, 175, 110, 0.9)", g2: "rgba(255, 130, 40, 0.8)", g3: "rgba(255, 100, 20, 0.5)", h1: "rgba(255, 190, 130, 1)", h2: "rgba(255, 145, 50, 0.95)", h3: "rgba(255, 115, 25, 0.7)" },
    script: { text: "#ffe0f0", g1: "rgba(255, 150, 215, 0.9)", g2: "rgba(255, 70, 175, 0.75)", g3: "rgba(255, 45, 150, 0.45)", h1: "rgba(255, 170, 225, 1)", h2: "rgba(255, 85, 190, 0.95)", h3: "rgba(255, 55, 165, 0.65)" },
    star: { core: "#fff4d6", g1: "rgba(255, 235, 180, 1)", g2: "rgba(255, 200, 90, 0.9)", g3: "rgba(255, 170, 50, 0.6)", h1: "rgba(255, 240, 190, 1)", h2: "rgba(255, 210, 100, 1)", h3: "rgba(255, 180, 60, 0.8)" },
    wash1: "rgba(255, 80, 190, 0.15)",
    wash2: "rgba(90, 240, 220, 0.09)",
  },
  {
    // 3 — acid: lime figure, violet staff, teal mountain, amber IX, green script
    figure: { tube: "#a5c81e", core: "#f0ffd0", elec: "#6a8a1e", g1: "rgba(215, 255, 110, 0.9)", g2: "rgba(180, 235, 40, 0.75)", g3: "rgba(150, 210, 20, 0.45)", h1: "rgba(225, 255, 130, 1)", h2: "rgba(190, 245, 50, 0.95)", h3: "rgba(160, 220, 25, 0.65)" },
    staff: { tube: "#8a4fd0", core: "#e6ccff", elec: "#5a3d80", g1: "rgba(210, 150, 255, 0.85)", g2: "rgba(170, 90, 255, 0.7)", g3: "rgba(140, 60, 255, 0.4)", h1: "rgba(220, 165, 255, 1)", h2: "rgba(180, 100, 255, 0.9)", h3: "rgba(150, 70, 255, 0.6)" },
    mountain: { tube: "#1ec4a8", core: "#d0fff2", elec: "#1e8a72", g1: "rgba(120, 255, 220, 0.85)", g2: "rgba(40, 225, 185, 0.7)", g3: "rgba(20, 195, 160, 0.4)", h1: "rgba(140, 255, 228, 1)", h2: "rgba(50, 235, 195, 0.9)", h3: "rgba(25, 205, 170, 0.6)" },
    numeral: { text: "#ffe9c4", g1: "rgba(255, 190, 90, 0.9)", g2: "rgba(255, 160, 40, 0.75)", g3: "rgba(255, 140, 20, 0.45)", h1: "rgba(255, 200, 110, 1)", h2: "rgba(255, 170, 50, 0.95)", h3: "rgba(255, 150, 25, 0.65)" },
    script: { text: "#d8ffd8", g1: "rgba(160, 255, 175, 0.9)", g2: "rgba(90, 235, 120, 0.75)", g3: "rgba(60, 210, 95, 0.45)", h1: "rgba(175, 255, 190, 1)", h2: "rgba(100, 245, 130, 0.95)", h3: "rgba(70, 220, 105, 0.65)" },
    star: { core: "#fff4d6", g1: "rgba(255, 235, 180, 1)", g2: "rgba(255, 200, 90, 0.9)", g3: "rgba(255, 170, 50, 0.6)", h1: "rgba(255, 240, 190, 1)", h2: "rgba(255, 210, 100, 1)", h3: "rgba(255, 180, 60, 0.8)" },
    wash1: "rgba(200, 255, 90, 0.14)",
    wash2: "rgba(150, 90, 255, 0.09)",
  },
];

/** One neon tube: a wide soft "gas" stroke under a thin bright core stroke. */
function Tube({ d, paint, w = 3.6 }: { d: string; paint: TubePaint; w?: number }) {
  return (
    <>
      <path d={d} stroke={paint.tube} strokeWidth={w} opacity="0.55" />
      <path d={d} stroke={paint.core} strokeWidth={Math.max(0.9, w * 0.36)} />
    </>
  );
}

const MOUNTAIN_D = "M 18 236 L 52 198 L 74 222 L 100 190 L 128 224 L 150 204 L 182 236";
const MOUNTAIN_ALT_D = "M 18 236 L 44 206 L 68 226 L 94 192 L 120 224 L 148 198 L 182 236";
const STAR_D = "M 140 91 L 141.4 94.6 L 145 95 L 141.4 95.4 L 140 99 L 138.6 95.4 L 135 95 L 138.6 94.6 Z";
const STAR_ALT_D = "M 140 89.5 L 141.8 93.2 L 146 95 L 141.8 96.8 L 140 100.5 L 138.2 96.8 L 134 95 L 138.2 93.2 Z";

interface SceneProps {
  palette: NeonPalette;
}

/* IX — The Hermit: the canonical scene, byte-for-byte the original artwork. */
function HermitArt({ palette, altDecor }: SceneProps & { altDecor: boolean }) {
  const mountainD = altDecor ? MOUNTAIN_ALT_D : MOUNTAIN_D;
  const starD = altDecor ? STAR_ALT_D : STAR_D;
  return (
    <>
      {/* mountain — violet tubes */}
      <g className="cl-neon-violet cl-neon-on-violet" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={mountainD} stroke={palette.mountain.tube} strokeWidth="4.4" opacity="0.55" />
        <path d={mountainD} stroke={palette.mountain.core} strokeWidth="1.6" />
        <circle cx="18" cy="236" r="2.2" fill="#1a1424" stroke={palette.mountain.elec} strokeWidth="0.8" />
        <circle cx="182" cy="236" r="2.2" fill="#1a1424" stroke={palette.mountain.elec} strokeWidth="0.8" />
      </g>
      {/* staff — cyan tube, the sign's weak tube */}
      <g className="cl-neon-cyan cl-neon-on-cyan" fill="none" strokeLinecap="round">
        <g className="cl-neon-weak">
          <path d="M 66 96 Q 62 146 66 206" stroke={palette.staff.tube} strokeWidth="4" opacity="0.55" />
          <path d="M 66 96 Q 62 146 66 206" stroke={palette.staff.core} strokeWidth="1.5" />
          <circle cx="66" cy="96" r="2" fill="#0e1a20" stroke={palette.staff.elec} strokeWidth="0.8" />
          <circle cx="66" cy="206" r="2" fill="#0e1a20" stroke={palette.staff.elec} strokeWidth="0.8" />
        </g>
      </g>
      {/* hooded figure — amber tubes */}
      <g className="cl-neon-amber cl-neon-on-amber" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M 100 88 C 88 90 82 100 83 112 C 78 122 76 136 75 152 C 74 168 73 184 72 198 L 128 198 C 127 184 126 168 125 152 C 124 136 122 122 117 112 C 118 100 112 90 100 88 Z"
          stroke={palette.figure.tube} strokeWidth="4.6" opacity="0.55"
        />
        <path
          d="M 100 88 C 88 90 82 100 83 112 C 78 122 76 136 75 152 C 74 168 73 184 72 198 L 128 198 C 127 184 126 168 125 152 C 124 136 122 122 117 112 C 118 100 112 90 100 88 Z"
          stroke={palette.figure.core} strokeWidth="1.7"
        />
        <path d="M 92 106 C 92 98 96 94 100 94 C 104 94 108 98 108 106 C 104 110 96 110 92 106 Z" stroke={palette.figure.tube} strokeWidth="3" opacity="0.5" />
        <path d="M 92 106 C 92 98 96 94 100 94 C 104 94 108 98 108 106 C 104 110 96 110 92 106 Z" stroke={palette.figure.core} strokeWidth="1.1" />
        <path d="M 80 122 C 74 124 69 128 67 134" stroke={palette.figure.tube} strokeWidth="3.6" opacity="0.55" />
        <path d="M 80 122 C 74 124 69 128 67 134" stroke={palette.figure.core} strokeWidth="1.3" />
        <path d="M 120 120 C 128 114 134 106 138 98" stroke={palette.figure.tube} strokeWidth="3.6" opacity="0.55" />
        <path d="M 120 120 C 128 114 134 106 138 98" stroke={palette.figure.core} strokeWidth="1.3" />
        <path d="M 100 128 L 100 196" stroke={palette.figure.tube} strokeWidth="2.6" opacity="0.4" />
        <path d="M 100 128 L 100 196" stroke={palette.figure.core} strokeWidth="0.9" opacity="0.85" />
        <circle cx="72" cy="198" r="2" fill="#241a10" stroke={palette.figure.elec} strokeWidth="0.8" />
        <circle cx="128" cy="198" r="2" fill="#241a10" stroke={palette.figure.elec} strokeWidth="0.8" />
      </g>
      {/* lantern — amber tubes, flickering, star inside */}
      <g className="cl-neon-flicker">
        <g className="cl-neon-amber cl-neon-on-amber" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 134 84 Q 140 78 146 84" stroke={palette.figure.tube} strokeWidth="2.8" opacity="0.55" />
          <path d="M 134 84 Q 140 78 146 84" stroke={palette.figure.core} strokeWidth="1" />
          <path d="M 132 86 L 148 86 L 150 104 L 130 104 Z" stroke={palette.figure.tube} strokeWidth="3.6" opacity="0.55" />
          <path d="M 132 86 L 148 86 L 150 104 L 130 104 Z" stroke={palette.figure.core} strokeWidth="1.3" />
          <circle cx="130" cy="104" r="1.8" fill="#241a10" stroke={palette.figure.elec} strokeWidth="0.7" />
          <circle cx="150" cy="104" r="1.8" fill="#241a10" stroke={palette.figure.elec} strokeWidth="0.7" />
        </g>
        <path className="cl-neon-star cl-neon-on-star" d={starD} fill={palette.star.core} />
      </g>
      {/* ground glow pooling under the sign */}
      <ellipse cx="100" cy="242" rx="70" ry="6" fill="#12071c" opacity="0.7" />
    </>
  );
}

/* I — The Magician: raised wand arm, lemniscate overhead, table with the four tools. */
function MagicianArt({ palette }: SceneProps) {
  return (
    <>
      <g className="cl-neon-violet cl-neon-on-violet" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* lemniscate above the head */}
        <Tube d="M 91 58 C 91 52 100 52 100 58 C 100 64 109 64 109 58 C 109 52 100 52 100 58 C 100 64 91 64 91 58 Z" paint={palette.mountain} w={2.6} />
        {/* table */}
        <Tube d="M 56 172 L 144 172 M 64 172 L 64 208 M 136 172 L 136 208" paint={palette.mountain} w={3.4} />
        {/* four suit symbols on the table: cup, sword, pentacle, wand */}
        <Tube d="M 68 158 L 78 158 C 78 164 75 166 73 166 L 73 169 M 70 169 L 76 169" paint={palette.mountain} w={2.2} />
        <Tube d="M 92 152 L 92 168 M 87 161 L 97 161" paint={palette.mountain} w={2.2} />
        <Tube d="M 107 160 A 5 5 0 1 0 117 160 A 5 5 0 1 0 107 160 Z" paint={palette.mountain} w={2.2} />
        <Tube d="M 126 166 L 134 154" paint={palette.mountain} w={2.2} />
      </g>
      {/* wand — cyan weak tube */}
      <g className="cl-neon-cyan cl-neon-on-cyan" fill="none" strokeLinecap="round">
        <g className="cl-neon-weak">
          <Tube d="M 128 76 L 146 56" paint={palette.staff} w={3} />
          <circle cx="128" cy="76" r="1.8" fill="#0e1a20" stroke={palette.staff.elec} strokeWidth="0.8" />
        </g>
      </g>
      {/* figure — amber tubes */}
      <g className="cl-neon-amber cl-neon-on-amber" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <Tube d="M 91 84 A 9 9 0 1 0 109 84 A 9 9 0 1 0 91 84 Z" paint={palette.figure} w={3.2} />
        <Tube d="M 88 96 C 84 118 82 144 82 168 L 118 168 C 118 144 116 118 112 96" paint={palette.figure} w={4.4} />
        <Tube d="M 112 100 C 120 92 125 84 130 74 M 88 100 C 84 116 84 132 87 146" paint={palette.figure} w={3.4} />
        <circle cx="82" cy="168" r="2" fill="#241a10" stroke={palette.figure.elec} strokeWidth="0.8" />
        <circle cx="118" cy="168" r="2" fill="#241a10" stroke={palette.figure.elec} strokeWidth="0.8" />
      </g>
      {/* wand-tip spark — the scene's light source */}
      <g className="cl-neon-flicker">
        <path className="cl-neon-star cl-neon-on-star" d="M 148 48 L 149.4 52.6 L 154 54 L 149.4 55.4 L 148 60 L 146.6 55.4 L 142 54 L 146.6 52.6 Z" fill={palette.star.core} />
      </g>
    </>
  );
}

/* III — The Empress: star crown, heart shield with Venus glyph, wheat below. */
function EmpressArt({ palette }: SceneProps) {
  return (
    <>
      <g className="cl-neon-violet cl-neon-on-violet" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* heart shield with Venus symbol */}
        <Tube d="M 140 154 C 136 146 126 148 128 157 C 129 163 136 168 140 172 C 144 168 151 163 152 157 C 154 148 144 146 140 154 Z" paint={palette.mountain} w={3} />
        <Tube d="M 135 184 A 5 5 0 1 0 145 184 A 5 5 0 1 0 135 184 Z M 140 189 L 140 197 M 136 193 L 144 193" paint={palette.mountain} w={2.4} />
        {/* wheat stalks below */}
        <Tube d="M 46 234 C 48 222 50 212 54 204 M 54 204 L 50 208 M 54 204 L 57 209 M 53 211 L 49 215 M 53 211 L 57 215" paint={palette.mountain} w={2.2} />
        <Tube d="M 62 234 C 64 224 66 216 70 208 M 70 208 L 66 212 M 70 208 L 73 213" paint={palette.mountain} w={2.2} />
      </g>
      {/* scepter — cyan weak tube with an orb top */}
      <g className="cl-neon-cyan cl-neon-on-cyan" fill="none" strokeLinecap="round">
        <g className="cl-neon-weak">
          <Tube d="M 76 120 L 72 192" paint={palette.staff} w={3} />
          <Tube d="M 73 114 A 4 4 0 1 0 81 114 A 4 4 0 1 0 73 114 Z" paint={palette.staff} w={2.4} />
          <circle cx="72" cy="192" r="1.8" fill="#0e1a20" stroke={palette.staff.elec} strokeWidth="0.8" />
        </g>
      </g>
      {/* crowned figure — amber tubes */}
      <g className="cl-neon-amber cl-neon-on-amber" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <Tube d="M 90 84 L 92 73 L 96.5 79 L 100 71 L 103.5 79 L 108 73 L 110 84 Z" paint={palette.figure} w={3} />
        <Tube d="M 92 94 A 8 8 0 1 0 108 94 A 8 8 0 1 0 92 94 Z" paint={palette.figure} w={3.2} />
        <Tube d="M 84 106 C 78 140 74 180 70 212 L 130 212 C 126 180 122 140 116 106 C 110 113 90 113 84 106 Z" paint={palette.figure} w={4.4} />
        <Tube d="M 116 112 C 124 124 130 138 134 150" paint={palette.figure} w={3.2} />
        <circle cx="70" cy="212" r="2" fill="#241a10" stroke={palette.figure.elec} strokeWidth="0.8" />
        <circle cx="130" cy="212" r="2" fill="#241a10" stroke={palette.figure.elec} strokeWidth="0.8" />
      </g>
      {/* crown star — the scene's light source */}
      <g className="cl-neon-flicker">
        <path className="cl-neon-star cl-neon-on-star" d="M 100 57 L 101.3 61.7 L 106 63 L 101.3 64.3 L 100 69 L 98.7 64.3 L 94 63 L 98.7 61.7 Z" fill={palette.star.core} />
      </g>
    </>
  );
}

/* VII — The Chariot: starred canopy, boxy chariot, two sphinxes, city wall. */
function ChariotArt({ palette }: SceneProps) {
  return (
    <>
      <g className="cl-neon-violet cl-neon-on-violet" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* city wall behind */}
        <Tube d="M 20 152 L 20 140 L 30 140 L 30 146 L 40 146 L 40 140 L 50 140 L 50 152 M 150 152 L 150 140 L 160 140 L 160 146 L 170 146 L 170 140 L 180 140 L 180 152" paint={palette.mountain} w={2.6} />
        {/* canopy */}
        <Tube d="M 60 104 L 140 104 M 68 104 L 68 150 M 132 104 L 132 150" paint={palette.mountain} w={3} />
        {/* two sphinxes in front */}
        <Tube d="M 52 238 L 52 226 C 52 219 58 215 63 219 L 70 224 L 90 224 L 90 238 Z" paint={palette.mountain} w={3} />
        <Tube d="M 148 238 L 148 226 C 148 219 142 215 137 219 L 130 224 L 110 224 L 110 238 Z" paint={palette.mountain} w={3} />
      </g>
      {/* reins — cyan weak tube */}
      <g className="cl-neon-cyan cl-neon-on-cyan" fill="none" strokeLinecap="round">
        <g className="cl-neon-weak">
          <Tube d="M 82 158 C 78 178 74 198 72 218 M 118 158 C 122 178 126 198 128 218" paint={palette.staff} w={2.6} />
        </g>
      </g>
      {/* charioteer + chariot — amber tubes */}
      <g className="cl-neon-amber cl-neon-on-amber" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <Tube d="M 92 124 A 8 8 0 1 0 108 124 A 8 8 0 1 0 92 124 Z" paint={palette.figure} w={3.2} />
        <Tube d="M 89 134 L 89 162 L 111 162 L 111 134 M 90 140 L 80 156 M 110 140 L 120 156" paint={palette.figure} w={3.4} />
        <Tube d="M 62 162 L 138 162 L 138 212 L 62 212 Z M 62 176 L 138 176" paint={palette.figure} w={4.2} />
        <circle cx="62" cy="212" r="2" fill="#241a10" stroke={palette.figure.elec} strokeWidth="0.8" />
        <circle cx="138" cy="212" r="2" fill="#241a10" stroke={palette.figure.elec} strokeWidth="0.8" />
      </g>
      {/* canopy star — the scene's light source */}
      <g className="cl-neon-flicker">
        <path className="cl-neon-star cl-neon-on-star" d="M 100 86 L 101.3 90.7 L 106 92 L 101.3 93.3 L 100 98 L 98.7 93.3 L 94 92 L 98.7 90.7 Z" fill={palette.star.core} />
      </g>
    </>
  );
}

/* X — Wheel of Fortune: spoked wheel, sphinx above, snake and creature at sides. */
function WheelArt({ palette }: SceneProps) {
  return (
    <>
      <g className="cl-neon-violet cl-neon-on-violet" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* rim glyphs: T, circle, X, wave */}
        <Tube d="M 95 114 L 105 114 M 100 114 L 100 122 M 143 156 A 3 3 0 1 0 149 156 A 3 3 0 1 0 143 156 Z M 95 194 L 105 202 M 105 194 L 95 202 M 50 156 Q 54 151 58 156 Q 62 161 66 156" paint={palette.mountain} w={2.2} />
        {/* sphinx on top */}
        <Tube d="M 90 96 L 90 84 C 90 78 96 76 100 80 C 104 76 110 78 110 84 L 110 96 Z M 100 80 L 100 74" paint={palette.mountain} w={2.6} />
        {/* snake descending on the left, creature rising on the right */}
        <Tube d="M 38 108 C 28 126 44 142 34 160 C 26 176 40 190 34 204" paint={palette.mountain} w={2.8} />
        <Tube d="M 162 204 C 168 186 158 168 166 150 M 166 150 L 160 138 M 166 150 L 172 140" paint={palette.mountain} w={2.8} />
      </g>
      {/* diagonal spokes — cyan weak tube */}
      <g className="cl-neon-cyan cl-neon-on-cyan" fill="none" strokeLinecap="round">
        <g className="cl-neon-weak">
          <Tube d="M 65 121 L 135 191 M 135 121 L 65 191" paint={palette.staff} w={2.6} />
        </g>
      </g>
      {/* the wheel — amber tubes */}
      <g className="cl-neon-amber cl-neon-on-amber" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <Tube d="M 50 156 A 50 50 0 1 0 150 156 A 50 50 0 1 0 50 156 Z" paint={palette.figure} w={4.4} />
        <Tube d="M 74 156 A 26 26 0 1 0 126 156 A 26 26 0 1 0 74 156 Z" paint={palette.figure} w={3} />
        <Tube d="M 100 106 L 100 206 M 50 156 L 150 156" paint={palette.figure} w={2.8} />
      </g>
      {/* hub star — the scene's light source */}
      <g className="cl-neon-flicker">
        <path className="cl-neon-star cl-neon-on-star" d="M 100 149 L 101.4 153.6 L 106 155 L 101.4 156.4 L 100 161 L 98.6 156.4 L 94 155 L 98.6 153.6 Z" fill={palette.star.core} />
      </g>
    </>
  );
}

/* XIII — Death: skeletal rider, rose banner, sun between two towers. */
function DeathArt({ palette }: SceneProps) {
  return (
    <>
      <g className="cl-neon-violet cl-neon-on-violet" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* dark banner outline */}
        <Tube d="M 128 106 L 164 112 L 164 138 L 128 132 Z" paint={palette.mountain} w={2.8} />
        {/* horizon, two towers, sun rising between them */}
        <Tube d="M 18 228 L 182 228" paint={palette.mountain} w={2.4} />
        <Tube d="M 146 228 L 146 206 L 156 206 L 156 228 M 174 228 L 174 206 L 184 206 L 184 228 M 158 228 A 7 7 0 0 1 172 228" paint={palette.mountain} w={2.6} />
      </g>
      {/* banner pole — cyan weak tube */}
      <g className="cl-neon-cyan cl-neon-on-cyan" fill="none" strokeLinecap="round">
        <g className="cl-neon-weak">
          <Tube d="M 128 104 L 128 174" paint={palette.staff} w={3} />
          <circle cx="128" cy="104" r="1.8" fill="#0e1a20" stroke={palette.staff.elec} strokeWidth="0.8" />
        </g>
      </g>
      {/* skeletal rider on horseback — amber tubes */}
      <g className="cl-neon-amber cl-neon-on-amber" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <Tube d="M 84 178 C 84 166 96 160 112 160 C 128 160 138 166 138 178 L 138 192 L 84 192 Z" paint={palette.figure} w={4.2} />
        <Tube d="M 90 164 C 82 156 76 150 72 140 M 72 140 L 62 146 L 70 150 M 138 170 C 146 172 148 180 146 188" paint={palette.figure} w={3.2} />
        <Tube d="M 90 192 L 88 224 M 102 192 L 100 224 M 124 192 L 126 224 M 136 192 L 138 224" paint={palette.figure} w={3} />
        <Tube d="M 110 160 L 108 130 M 102 140 Q 108 144 114 140 M 102 148 Q 108 152 114 148 M 112 134 C 118 138 122 142 126 146" paint={palette.figure} w={2.8} />
        <Tube d="M 101 121 A 7 7 0 1 0 115 121 A 7 7 0 1 0 101 121 Z" paint={palette.figure} w={3.2} />
        <circle cx="88" cy="224" r="2" fill="#241a10" stroke={palette.figure.elec} strokeWidth="0.8" />
        <circle cx="138" cy="224" r="2" fill="#241a10" stroke={palette.figure.elec} strokeWidth="0.8" />
      </g>
      {/* white rose on the banner — the scene's light source */}
      <g className="cl-neon-flicker">
        <path className="cl-neon-star cl-neon-on-star" d="M 142 122 A 4 4 0 1 0 150 122 A 4 4 0 1 0 142 122 Z" fill={palette.star.core} />
        <path d="M 146 119.5 C 148.5 119.5 148.5 124 146 124 C 144 124 143.5 122 145 121.5" fill="none" stroke="#1a1424" strokeWidth="0.8" />
      </g>
    </>
  );
}

/* XVII — The Star: kneeling figure with two jugs, big 8-pointed star + seven small ones. */
function StarArt({ palette }: SceneProps) {
  const small = (x: number, y: number) => `M ${x} ${y - 3} L ${x + 3} ${y} L ${x} ${y + 3} L ${x - 3} ${y} Z`;
  return (
    <>
      <g className="cl-neon-violet cl-neon-on-violet" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* seven small stars */}
        <Tube d={[small(48, 62), small(70, 46), small(130, 46), small(152, 62), small(38, 92), small(162, 92), small(100, 104)].join(" ")} paint={palette.mountain} w={2} />
        {/* ground and pool */}
        <Tube d="M 24 208 L 92 208" paint={palette.mountain} w={2.4} />
        <Tube d="M 104 216 Q 112 212 120 216 T 136 216 T 152 216 M 108 224 Q 116 220 124 224 T 140 224 T 156 224 M 116 232 Q 124 228 132 232 T 148 232" paint={palette.mountain} w={2.4} />
      </g>
      {/* pouring water — cyan weak tube: one stream to land, one to the pool */}
      <g className="cl-neon-cyan cl-neon-on-cyan" fill="none" strokeLinecap="round">
        <g className="cl-neon-weak">
          <Tube d="M 59 180 C 57 188 57 196 59 204 M 108 178 C 112 188 118 198 124 206" paint={palette.staff} w={2.6} />
        </g>
      </g>
      {/* kneeling figure with two jugs — amber tubes */}
      <g className="cl-neon-amber cl-neon-on-amber" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <Tube d="M 75 138 A 7 7 0 1 0 89 138 A 7 7 0 1 0 75 138 Z" paint={palette.figure} w={3.2} />
        <Tube d="M 76 148 C 70 162 68 176 70 192 M 70 192 L 58 204 L 80 204 M 70 192 C 78 190 86 186 90 178" paint={palette.figure} w={4} />
        <Tube d="M 78 154 C 72 160 66 164 60 168 M 82 154 C 90 158 98 162 106 166" paint={palette.figure} w={3} />
        <Tube d="M 54 166 L 64 166 L 62 178 L 56 178 Z M 102 164 L 112 164 L 110 176 L 104 176 Z" paint={palette.figure} w={2.8} />
        <circle cx="58" cy="204" r="2" fill="#241a10" stroke={palette.figure.elec} strokeWidth="0.8" />
      </g>
      {/* the big 8-pointed star — the scene's light source */}
      <g className="cl-neon-flicker">
        <path className="cl-neon-star cl-neon-on-star" d="M 100 58 L 104.2 67.8 L 114 72 L 104.2 76.2 L 100 86 L 95.8 76.2 L 86 72 L 95.8 67.8 Z" fill={palette.star.core} />
      </g>
    </>
  );
}

/* XXII — The Fool: profile figure at a cliff edge, bindle stick, dog, sun. */
function FoolArt({ palette }: SceneProps) {
  return (
    <>
      <g className="cl-neon-violet cl-neon-on-violet" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* cliff edge with crumbling face */}
        <Tube d="M 20 216 L 126 216 M 126 216 L 122 228 L 126 240" paint={palette.mountain} w={2.8} />
        {/* small dog at his heels */}
        <Tube d="M 50 206 L 64 206 M 52 206 L 52 212 M 61 206 L 61 212 M 50 206 C 46 202 45 198 48 195 M 64 206 C 67 203 68 200 66 198" paint={palette.mountain} w={2.4} />
      </g>
      {/* bindle stick + bundle — cyan weak tube */}
      <g className="cl-neon-cyan cl-neon-on-cyan" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g className="cl-neon-weak">
          <Tube d="M 92 140 L 64 110" paint={palette.staff} w={3} />
          <Tube d="M 54 98 C 50 106 54 112 61 112 C 68 112 71 105 67 99 C 64 94 57 94 54 98 Z" paint={palette.staff} w={2.6} />
        </g>
      </g>
      {/* figure in profile, mid-stride, head tilted up — amber tubes */}
      <g className="cl-neon-amber cl-neon-on-amber" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <Tube d="M 91 124 A 7 7 0 1 0 105 124 A 7 7 0 1 0 91 124 Z M 104 120 L 107 122" paint={palette.figure} w={3.2} />
        <Tube d="M 94 134 C 90 152 90 168 94 184 M 94 184 L 110 198 L 116 212 M 94 184 L 84 200 L 76 212" paint={palette.figure} w={4} />
        <Tube d="M 94 142 C 88 138 84 134 80 128" paint={palette.figure} w={3} />
        <circle cx="116" cy="212" r="2" fill="#241a10" stroke={palette.figure.elec} strokeWidth="0.8" />
      </g>
      {/* sun behind — the scene's light source */}
      <g className="cl-neon-flicker">
        <path className="cl-neon-star cl-neon-on-star" d="M 140 72 A 12 12 0 1 0 164 72 A 12 12 0 1 0 140 72 Z" fill={palette.star.core} />
      </g>
    </>
  );
}

function SceneArt({ number, palette, altDecor }: SceneProps & { number: number; altDecor: boolean }) {
  switch (number) {
    case 1: return <MagicianArt palette={palette} />;
    case 3: return <EmpressArt palette={palette} />;
    case 7: return <ChariotArt palette={palette} />;
    case 10: return <WheelArt palette={palette} />;
    case 13: return <DeathArt palette={palette} />;
    case 17: return <StarArt palette={palette} />;
    case 22: return <FoolArt palette={palette} />;
    default: return <HermitArt palette={palette} altDecor={altDecor} />;
  }
}

export default function NeonHermitCard({
  number = 9,
  name = "THE HERMIT",
  variant = 0,
}: NeonCardProps) {
  const v = ((Math.round(variant) % 8) + 8) % 8;
  const palette = PALETTES[v % 4];
  const mirrored = v >= 4;
  const altDecor = v % 4 >= 2;

  const numeral = toRoman(number);
  /* Long names: shrink the script, then pin the width with textLength so
     names like "WHEEL OF FORTUNE" still fit the sign. Short names keep the
     original typesetting untouched. */
  const longName = name.length > 10;
  const titleSize = longName
    ? Math.max(11, Math.min(21, 155 / (0.55 * name.length)))
    : 21;

  const cssVars: Record<string, string> = {
    "--cl-neon-a1": palette.figure.g1, "--cl-neon-a2": palette.figure.g2, "--cl-neon-a3": palette.figure.g3,
    "--cl-neon-a1h": palette.figure.h1, "--cl-neon-a2h": palette.figure.h2, "--cl-neon-a3h": palette.figure.h3,
    "--cl-neon-c1": palette.staff.g1, "--cl-neon-c2": palette.staff.g2, "--cl-neon-c3": palette.staff.g3,
    "--cl-neon-c1h": palette.staff.h1, "--cl-neon-c2h": palette.staff.h2, "--cl-neon-c3h": palette.staff.h3,
    "--cl-neon-v1": palette.mountain.g1, "--cl-neon-v2": palette.mountain.g2, "--cl-neon-v3": palette.mountain.g3,
    "--cl-neon-v1h": palette.mountain.h1, "--cl-neon-v2h": palette.mountain.h2, "--cl-neon-v3h": palette.mountain.h3,
    "--cl-neon-r1": palette.numeral.g1, "--cl-neon-r2": palette.numeral.g2, "--cl-neon-r3": palette.numeral.g3,
    "--cl-neon-r1h": palette.numeral.h1, "--cl-neon-r2h": palette.numeral.h2, "--cl-neon-r3h": palette.numeral.h3,
    "--cl-neon-p1": palette.script.g1, "--cl-neon-p2": palette.script.g2, "--cl-neon-p3": palette.script.g3,
    "--cl-neon-p1h": palette.script.h1, "--cl-neon-p2h": palette.script.h2, "--cl-neon-p3h": palette.script.h3,
    "--cl-neon-s1": palette.star.g1, "--cl-neon-s2": palette.star.g2, "--cl-neon-s3": palette.star.g3,
    "--cl-neon-s1h": palette.star.h1, "--cl-neon-s2h": palette.star.h2, "--cl-neon-s3h": palette.star.h3,
    "--cl-neon-wash1": palette.wash1,
    "--cl-neon-wash2": palette.wash2,
  };

  return (
    <figure
      className="cl-neon-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0, ...cssVars } as CSSProperties}
      aria-label={`${name} tarot card in neon tube sign style`}
    >
      <style>{`
        .cl-neon-card {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          background:
            repeating-linear-gradient(
              0deg,
              transparent 0px, transparent 26px,
              rgba(255, 255, 255, 0.025) 26px, rgba(255, 255, 255, 0.025) 27px,
              transparent 27px, transparent 28px
            ),
            repeating-linear-gradient(
              90deg,
              transparent 0px, transparent 38px,
              rgba(255, 255, 255, 0.02) 38px, rgba(255, 255, 255, 0.02) 39px,
              transparent 39px, transparent 76px
            ),
            radial-gradient(ellipse at 50% 38%, #14111c 0%, #0a0810 55%, #050408 100%);
          box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.85);
        }
        .cl-neon-card::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: 12px;
          background: radial-gradient(ellipse at 50% 40%,
            var(--cl-neon-wash1, rgba(255, 170, 80, 0.16)) 0%,
            var(--cl-neon-wash2, rgba(160, 90, 255, 0.09)) 45%, transparent 72%);
          opacity: 0;
          animation: cl-neon-wash 14s linear infinite;
        }
        .cl-neon-card svg { display: block; width: 100%; height: 100%; }

        /* ---- tube glow stacks (colors come from per-variant CSS vars) ---- */
        .cl-neon-amber {
          filter:
            drop-shadow(0 0 1.5px var(--cl-neon-a1, rgba(255, 190, 90, 0.9)))
            drop-shadow(0 0 5px var(--cl-neon-a2, rgba(255, 160, 40, 0.75)))
            drop-shadow(0 0 14px var(--cl-neon-a3, rgba(255, 140, 20, 0.45)));
        }
        .cl-neon-cyan {
          filter:
            drop-shadow(0 0 1.5px var(--cl-neon-c1, rgba(120, 240, 255, 0.9)))
            drop-shadow(0 0 5px var(--cl-neon-c2, rgba(40, 210, 255, 0.75)))
            drop-shadow(0 0 14px var(--cl-neon-c3, rgba(0, 180, 255, 0.45)));
        }
        .cl-neon-violet {
          filter:
            drop-shadow(0 0 1.5px var(--cl-neon-v1, rgba(210, 150, 255, 0.85)))
            drop-shadow(0 0 6px var(--cl-neon-v2, rgba(170, 90, 255, 0.7)))
            drop-shadow(0 0 16px var(--cl-neon-v3, rgba(140, 60, 255, 0.4)));
        }
        .cl-neon-red {
          filter:
            drop-shadow(0 0 1.5px var(--cl-neon-r1, rgba(255, 110, 110, 0.9)))
            drop-shadow(0 0 5px var(--cl-neon-r2, rgba(255, 40, 40, 0.8)))
            drop-shadow(0 0 12px var(--cl-neon-r3, rgba(255, 20, 20, 0.5)));
        }
        .cl-neon-pink {
          filter:
            drop-shadow(0 0 1.5px var(--cl-neon-p1, rgba(255, 160, 220, 0.9)))
            drop-shadow(0 0 6px var(--cl-neon-p2, rgba(255, 90, 190, 0.75)))
            drop-shadow(0 0 16px var(--cl-neon-p3, rgba(255, 60, 170, 0.45)));
        }
        .cl-neon-frame {
          filter: drop-shadow(0 0 3px rgba(150, 160, 200, 0.35));
          animation: cl-neon-frame-cycle 14s linear infinite;
        }
        .cl-neon-amber, .cl-neon-cyan, .cl-neon-violet,
        .cl-neon-red, .cl-neon-pink, .cl-neon-star {
          transition: filter 0.35s ease;
        }
        .cl-neon-star {
          filter:
            drop-shadow(0 0 2px var(--cl-neon-s1, rgba(255, 235, 180, 1)))
            drop-shadow(0 0 7px var(--cl-neon-s2, rgba(255, 200, 90, 0.9)))
            drop-shadow(0 0 18px var(--cl-neon-s3, rgba(255, 170, 50, 0.6)));
        }

        /* ---- flicker on the scene's light source ---- */
        @keyframes cl-neon-flicker {
          0%, 100% { opacity: 1; }
          3% { opacity: 0.55; }
          5% { opacity: 1; }
          42% { opacity: 1; }
          44% { opacity: 0.4; }
          46% { opacity: 0.95; }
          48% { opacity: 0.65; }
          50% { opacity: 1; }
        }
        .cl-neon-flicker { animation: cl-neon-flicker 4.2s linear infinite; }

        /* ---- whole-sign ballast buzz: quick stutter every ~8s; sits on the
           svg parent so its opacity multiplies with the outage keyframes —
           a buzzing parent can never relight a tube mid-outage ---- */
        @keyframes cl-neon-buzz {
          0%, 100% { opacity: 1; filter: none; }
          1.2% { opacity: 0.8; filter: brightness(0.85); }
          2.1% { opacity: 1; filter: none; }
          2.8% { opacity: 0.88; filter: brightness(0.92); }
          3.6% { opacity: 1; filter: none; }
        }
        .cl-neon-buzz { animation: cl-neon-buzz 8.3s linear infinite; }

        /* ---- weak tube: the staff-analog sputters on its own rhythm ---- */
        @keyframes cl-neon-weak {
          0%, 100% { opacity: 1; }
          11% { opacity: 0.5; }
          13% { opacity: 0.9; }
          15% { opacity: 0.35; }
          18% { opacity: 1; }
          57% { opacity: 1; }
          59% { opacity: 0.6; }
          61.5% { opacity: 1; }
        }
        .cl-neon-weak { animation: cl-neon-weak 6.7s linear infinite; }

        /* ---- POWER OUTAGE: one shared 14s cycle, staggered tube-by-tube relight ---- */
        /* figure tubes strike first, then star, staff, mountain, numeral,
           script; frame relights last */
        @keyframes cl-neon-on-amber {
          0%, 3% { opacity: 0; } 3.6% { opacity: 0.9; } 4.3% { opacity: 0.15; }
          5% { opacity: 1; } 5.6% { opacity: 0.4; } 6.4%, 100% { opacity: 1; }
        }
        @keyframes cl-neon-on-star {
          0%, 4% { opacity: 0; } 4.6% { opacity: 1; } 5.3% { opacity: 0.3; }
          6.1% { opacity: 1; } 6.9% { opacity: 0.45; } 7.7%, 100% { opacity: 1; }
        }
        @keyframes cl-neon-on-cyan {
          0%, 5.5% { opacity: 0; } 6.1% { opacity: 0.8; } 6.7% { opacity: 0.2; }
          7.3% { opacity: 0.95; } 7.9% { opacity: 0.5; } 8.7%, 100% { opacity: 1; }
        }
        @keyframes cl-neon-on-violet {
          0%, 7.5% { opacity: 0; } 8.1% { opacity: 0.85; } 8.8% { opacity: 0.25; }
          9.5% { opacity: 1; } 10.1% { opacity: 0.55; } 10.9%, 100% { opacity: 1; }
        }
        @keyframes cl-neon-on-red {
          0%, 9.5% { opacity: 0; } 10.1% { opacity: 0.9; }
          10.7% { opacity: 0.3; } 11.5%, 100% { opacity: 1; }
        }
        @keyframes cl-neon-on-pink {
          0%, 11.5% { opacity: 0; } 12.1% { opacity: 0.85; } 12.8% { opacity: 0.2; }
          13.5% { opacity: 0.95; } 14.1% { opacity: 0.5; } 14.9%, 100% { opacity: 1; }
        }
        .cl-neon-on-amber { animation: cl-neon-on-amber 14s linear infinite; }
        .cl-neon-on-star { animation: cl-neon-on-star 14s linear infinite; }
        .cl-neon-on-cyan { animation: cl-neon-on-cyan 14s linear infinite; }
        .cl-neon-on-violet { animation: cl-neon-on-violet 14s linear infinite; }
        .cl-neon-on-red { animation: cl-neon-on-red 14s linear infinite; }
        .cl-neon-on-pink { animation: cl-neon-on-pink 14s linear infinite; }

        /* frame tube: dark during the outage, relights last, then breathes */
        @keyframes cl-neon-frame-cycle {
          0%, 13% { opacity: 0.12; filter: drop-shadow(0 0 1.5px rgba(150, 160, 200, 0.15)); }
          17%, 85% { opacity: 1; filter: drop-shadow(0 0 5px rgba(170, 180, 220, 0.5)); }
          55% { opacity: 0.75; filter: drop-shadow(0 0 2.5px rgba(150, 160, 200, 0.28)); }
          100% { opacity: 0.12; filter: drop-shadow(0 0 1.5px rgba(150, 160, 200, 0.15)); }
        }

        /* brick-wall glow wash, blooming as the tubes relight */
        @keyframes cl-neon-wash {
          0%, 3% { opacity: 0; } 8% { opacity: 0.55; }
          16% { opacity: 0.3; } 28%, 100% { opacity: 0; }
        }

        /* ---- hover: dimmer turned up, all tubes brighten ---- */
        .cl-neon-card:hover .cl-neon-amber {
          filter:
            brightness(1.25)
            drop-shadow(0 0 2px var(--cl-neon-a1h, rgba(255, 200, 110, 1)))
            drop-shadow(0 0 8px var(--cl-neon-a2h, rgba(255, 170, 50, 0.95)))
            drop-shadow(0 0 22px var(--cl-neon-a3h, rgba(255, 150, 25, 0.65)));
        }
        .cl-neon-card:hover .cl-neon-cyan {
          filter:
            brightness(1.25)
            drop-shadow(0 0 2px var(--cl-neon-c1h, rgba(140, 245, 255, 1)))
            drop-shadow(0 0 8px var(--cl-neon-c2h, rgba(50, 220, 255, 0.95)))
            drop-shadow(0 0 22px var(--cl-neon-c3h, rgba(0, 190, 255, 0.65)));
        }
        .cl-neon-card:hover .cl-neon-violet {
          filter:
            brightness(1.25)
            drop-shadow(0 0 2px var(--cl-neon-v1h, rgba(220, 165, 255, 1)))
            drop-shadow(0 0 9px var(--cl-neon-v2h, rgba(180, 100, 255, 0.9)))
            drop-shadow(0 0 24px var(--cl-neon-v3h, rgba(150, 70, 255, 0.6)));
        }
        .cl-neon-card:hover .cl-neon-red {
          filter:
            brightness(1.25)
            drop-shadow(0 0 2px var(--cl-neon-r1h, rgba(255, 130, 130, 1)))
            drop-shadow(0 0 8px var(--cl-neon-r2h, rgba(255, 50, 50, 0.95)))
            drop-shadow(0 0 18px var(--cl-neon-r3h, rgba(255, 25, 25, 0.7)));
        }
        .cl-neon-card:hover .cl-neon-pink {
          filter:
            brightness(1.25)
            drop-shadow(0 0 2px var(--cl-neon-p1h, rgba(255, 175, 228, 1)))
            drop-shadow(0 0 9px var(--cl-neon-p2h, rgba(255, 100, 200, 0.95)))
            drop-shadow(0 0 24px var(--cl-neon-p3h, rgba(255, 70, 180, 0.65)));
        }
        .cl-neon-card:hover .cl-neon-star {
          filter:
            brightness(1.3)
            drop-shadow(0 0 3px var(--cl-neon-s1h, rgba(255, 240, 190, 1)))
            drop-shadow(0 0 10px var(--cl-neon-s2h, rgba(255, 210, 100, 1)))
            drop-shadow(0 0 26px var(--cl-neon-s3h, rgba(255, 180, 60, 0.8)));
        }

        @media (prefers-reduced-motion: reduce) {
          .cl-neon-flicker,
          .cl-neon-buzz,
          .cl-neon-weak,
          .cl-neon-frame,
          .cl-neon-on-amber,
          .cl-neon-on-star,
          .cl-neon-on-cyan,
          .cl-neon-on-violet,
          .cl-neon-on-red,
          .cl-neon-on-pink { animation: none; }
          .cl-neon-card::after { animation: none; opacity: 0; }
        }
      `}</style>

      <svg className="cl-neon-buzz" viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" role="img">
        {/* thin dim tube frame */}
        <rect
          className="cl-neon-frame"
          x="7"
          y="7"
          width="186"
          height="286"
          rx="9"
          fill="none"
          stroke="#3d4358"
          strokeWidth="1.6"
        />

        {/* numeral — small neon tube text, top center */}
        <text
          className="cl-neon-red cl-neon-on-red"
          x="100"
          y="36"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="700"
          fontSize="17"
          letterSpacing="4"
          fill={palette.numeral.text}
        >
          {numeral}
        </text>

        {/* artwork group — mirrored as a whole for odd gallery variants;
            texts stay outside so they never flip */}
        <g transform={mirrored ? "translate(200 0) scale(-1 1)" : undefined}>
          <SceneArt number={number} palette={palette} altDecor={altDecor} />
        </g>

        {/* card name — neon script at bottom; long names shrink and pin width */}
        <text
          className="cl-neon-pink cl-neon-on-pink"
          x="100"
          y="274"
          textAnchor="middle"
          fontFamily="'Brush Script MT', 'Segoe Script', 'Lucida Handwriting', cursive"
          fontStyle="italic"
          fontSize={titleSize}
          letterSpacing="1.5"
          fill={palette.script.text}
          {...(longName ? { textLength: 156, lengthAdjust: "spacingAndGlyphs" } : {})}
        >
          {name}
        </text>
      </svg>
    </figure>
  );
}
