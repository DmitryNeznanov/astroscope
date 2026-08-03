/**
 * NEON — tarot card in neon tube sign style (default: The Hermit, IX).
 * Neon tube sign on a dark bar wall. The figure outline is drawn as glowing
 * neon tubes; layered glow via duplicated strokes + stacked drop-shadows.
 *
 * Reusable gallery component:
 *   <NeonHermitCard />                       — the original Hermit card, unchanged
 *   <NeonHermitCard number={10} name="WHEEL OF FORTUNE" variant={3} />
 *
 * variant (0-7) = palette (variant % 4) + mirrored composition (variant >= 4)
 * + alternate mountain/star decor (variant % 4 >= 2). variant 0 is the
 * original look exactly.
 *
 * Signature effects (all CSS-only, disabled for reduced motion): a 14s
 * POWER-OUTAGE cycle — the whole sign drops dark, then relights tube-by-tube
 * (figure, star, staff, mountain, numeral, script, frame last) with hard
 * startup stutters while a glow wash blooms on the brick wall; plus a smaller
 * whole-sign ballast buzz, a sputtering weak tube (the staff), lantern
 * flicker, a breathing frame tube, and :hover dimmer-up brightening.
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

const MOUNTAIN_D =
  "M 18 236 L 52 198 L 74 222 L 100 190 L 128 224 L 150 204 L 182 236";
const MOUNTAIN_ALT_D =
  "M 18 236 L 44 206 L 68 226 L 94 192 L 120 224 L 148 198 L 182 236";
const STAR_D =
  "M 140 91 L 141.4 94.6 L 145 95 L 141.4 95.4 L 140 99 L 138.6 95.4 L 135 95 L 138.6 94.6 Z";
const STAR_ALT_D =
  "M 140 89.5 L 141.8 93.2 L 146 95 L 141.8 96.8 L 140 100.5 L 138.2 96.8 L 134 95 L 138.2 93.2 Z";

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

        /* ---- flicker on the lantern tube ---- */
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

        /* ---- weak tube: the staff sputters on its own rhythm ---- */
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
        {/* mountain — violet tubes */}
        <g className="cl-neon-violet cl-neon-on-violet" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d={altDecor ? MOUNTAIN_ALT_D : MOUNTAIN_D} stroke={palette.mountain.tube} strokeWidth="4.4" opacity="0.55" />
          <path d={altDecor ? MOUNTAIN_ALT_D : MOUNTAIN_D} stroke={palette.mountain.core} strokeWidth="1.6" />
          {/* electrode gaps at tube ends */}
          <circle cx="18" cy="236" r="2.2" fill="#1a1424" stroke={palette.mountain.elec} strokeWidth="0.8" />
          <circle cx="182" cy="236" r="2.2" fill="#1a1424" stroke={palette.mountain.elec} strokeWidth="0.8" />
        </g>

        {/* staff — cyan tube in the left hand, runs as the sign's weak tube;
            weak-tube sputter sits on an inner group so it multiplies with the
            outage cycle on the outer group instead of overriding it */}
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
          {/* hood + robe outline */}
          <path
            d="M 100 88 C 88 90 82 100 83 112 C 78 122 76 136 75 152 C 74 168 73 184 72 198 L 128 198 C 127 184 126 168 125 152 C 124 136 122 122 117 112 C 118 100 112 90 100 88 Z"
            stroke={palette.figure.tube} strokeWidth="4.6" opacity="0.55"
          />
          <path
            d="M 100 88 C 88 90 82 100 83 112 C 78 122 76 136 75 152 C 74 168 73 184 72 198 L 128 198 C 127 184 126 168 125 152 C 124 136 122 122 117 112 C 118 100 112 90 100 88 Z"
            stroke={palette.figure.core} strokeWidth="1.7"
          />
          {/* hood opening */}
          <path
            d="M 92 106 C 92 98 96 94 100 94 C 104 94 108 98 108 106 C 104 110 96 110 92 106 Z"
            stroke={palette.figure.tube} strokeWidth="3" opacity="0.5"
          />
          <path
            d="M 92 106 C 92 98 96 94 100 94 C 104 94 108 98 108 106 C 104 110 96 110 92 106 Z"
            stroke={palette.figure.core} strokeWidth="1.1"
          />
          {/* left arm reaching to the staff */}
          <path d="M 80 122 C 74 124 69 128 67 134" stroke={palette.figure.tube} strokeWidth="3.6" opacity="0.55" />
          <path d="M 80 122 C 74 124 69 128 67 134" stroke={palette.figure.core} strokeWidth="1.3" />
          {/* right arm raised toward the lantern */}
          <path d="M 120 120 C 128 114 134 106 138 98" stroke={palette.figure.tube} strokeWidth="3.6" opacity="0.55" />
          <path d="M 120 120 C 128 114 134 106 138 98" stroke={palette.figure.core} strokeWidth="1.3" />
          {/* robe fold */}
          <path d="M 100 128 L 100 196" stroke={palette.figure.tube} strokeWidth="2.6" opacity="0.4" />
          <path d="M 100 128 L 100 196" stroke={palette.figure.core} strokeWidth="0.9" opacity="0.85" />
          {/* electrode gaps at robe hem */}
          <circle cx="72" cy="198" r="2" fill="#241a10" stroke={palette.figure.elec} strokeWidth="0.8" />
          <circle cx="128" cy="198" r="2" fill="#241a10" stroke={palette.figure.elec} strokeWidth="0.8" />
        </g>

        {/* lantern — amber tubes, flickering, star inside */}
        <g className="cl-neon-flicker">
          <g className="cl-neon-amber cl-neon-on-amber" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* handle */}
            <path d="M 134 84 Q 140 78 146 84" stroke={palette.figure.tube} strokeWidth="2.8" opacity="0.55" />
            <path d="M 134 84 Q 140 78 146 84" stroke={palette.figure.core} strokeWidth="1" />
            {/* lantern body */}
            <path d="M 132 86 L 148 86 L 150 104 L 130 104 Z" stroke={palette.figure.tube} strokeWidth="3.6" opacity="0.55" />
            <path d="M 132 86 L 148 86 L 150 104 L 130 104 Z" stroke={palette.figure.core} strokeWidth="1.3" />
            <circle cx="130" cy="104" r="1.8" fill="#241a10" stroke={palette.figure.elec} strokeWidth="0.7" />
            <circle cx="150" cy="104" r="1.8" fill="#241a10" stroke={palette.figure.elec} strokeWidth="0.7" />
          </g>
          {/* small star light inside the lantern */}
          <path
            className="cl-neon-star cl-neon-on-star"
            d={altDecor ? STAR_ALT_D : STAR_D}
            fill={palette.star.core}
          />
        </g>

        {/* ground glow pooling under the sign */}
        <ellipse cx="100" cy="242" rx="70" ry="6" fill="#12071c" opacity="0.7" />
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
