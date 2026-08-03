/**
 * Card Lab — UKIYO-E
 * Edo-period woodblock print deck of the Major Arcana, in the manner of
 * Hokusai / Hiroshige. Flat unmodulated color blocks with crisp key-block
 * (sumi) outlines, gradient sky with a bokashi band at top, outline-only
 * clouds, cream washi ground, double keyline frame. Vertical red hanko seal
 * with the roman numeral top-right; tall title cartouche with the card name
 * set vertically on the right edge.
 *
 * Reusable: `{ number = 9, name = "THE HERMIT", variant = 0 }`.
 * `number` selects a bespoke scene (1, 3, 7, 9, 10, 13, 17, 22; anything
 * else falls back to the Hermit). With no props it renders THE HERMIT (IX)
 * exactly as the original card. `variant` (0-7) selects one of four color
 * schemes, mirrored for 4-7.
 *
 * Initial load (one-shot, ~1.5s): a woodblock printing sequence — blank
 * washi flash, then successive block presses (sky block → subject blocks →
 * detail/light blocks, hard steps), then the hanko seal and title cartouche
 * are stamped on with a tiny scale bounce.
 *
 * Signature effects (CSS-only, server-component safe, always on):
 * shooting star, twinkling sparkles, drifting outline clouds, breathing
 * glow on each scene's light source (lantern / wand tip / crown star /
 * canopy stars / wheel hub / banner rose / big star / sun), swaying
 * elements (lantern, pine, wheat, banner), spinning wheel, flowing water.
 * All motion is guarded by prefers-reduced-motion.
 */

import type { JSX } from "react";
import { toRoman } from "@/lib/roman";

const INK = "#16130f";
const CREAM = "#f4ecd8";
const SKIN = "#e8c9a0";
const OCHRE = "#e0a437";
const BAMBOO = "#c79a4e";
const VERMILION = "#b3342a";
const STARLIGHT = "#fff6dd";
const SERIF = "Georgia, 'Times New Roman', 'Hiragino Mincho ProN', serif";

interface Palette {
  /** Sky gradient stops, zenith → horizon */
  sky: [string, string, string, string];
  /** Bokashi wash color at the very top */
  bokashi: string;
  mountain: string;
  facet: string;
  robe: string;
  inner: string;
  lantern: string;
  glow: string;
}

/** Four color-block schemes; index 0 is the original night scene. */
const PALETTES: Palette[] = [
  {
    // 0 — classic indigo night (the original Hermit)
    sky: ["#101d38", "#1b2f55", "#2a4a7c", "#46689a"],
    bokashi: "#0a1226",
    mountain: "#1d3a5f",
    facet: "#2e5484",
    robe: "#27335f",
    inner: "#a94e2a",
    lantern: OCHRE,
    glow: "#f2c14e",
  },
  {
    // 1 — ember dusk: warm rust sky, rust robe over indigo
    sky: ["#2a1420", "#4a2230", "#7a3b2e", "#b06a3a"],
    bokashi: "#1c0d16",
    mountain: "#5e2a24",
    facet: "#7a3b2e",
    robe: "#a94e2a",
    inner: "#27335f",
    lantern: OCHRE,
    glow: "#f2c14e",
  },
  {
    // 2 — aizuri-e: the all-blue print, pale gold lantern accent
    sky: ["#0d1f3c", "#16324f", "#1d3a5f", "#3a5f86"],
    bokashi: "#081530",
    mountain: "#16324f",
    facet: "#274a6e",
    robe: "#1d3a5f",
    inner: "#5e87a8",
    lantern: "#e8c25a",
    glow: "#f2c14e",
  },
  {
    // 3 — plum dawn: violet sky, rust robe with ochre lining
    sky: ["#1c1230", "#33204e", "#573a6e", "#8a6a92"],
    bokashi: "#120b22",
    mountain: "#33204e",
    facet: "#4a3168",
    robe: "#a94e2a",
    inner: OCHRE,
    lantern: OCHRE,
    glow: "#f2c14e",
  },
];

export interface UkiyoECardProps {
  /** Major Arcana number 1-22; selects the scene and the seal numeral. */
  number?: number;
  /** Card name, set vertically in the right-edge cartouche (auto-sized to fit). */
  name?: string;
  /** 0-7: palette = variant % 4, composition mirrored for variant >= 4. */
  variant?: number;
}

interface GradientIds {
  sky: string;
  bokashi: string;
  glow: string;
}

interface SceneProps {
  pal: Palette;
  ids: GradientIds;
  shift: number;
  v: number;
}

type SceneComponent = (props: SceneProps) => JSX.Element;

/** Swaying element helper: rocks ±2.5° around an inline transform-origin. */
function rockStyle(x: number, y: number, delay: string) {
  return { transformOrigin: `${x}px ${y}px`, animationDelay: delay };
}

/** Fan of short needle strokes — a pine cluster that rustles on its branch. */
function pineCluster(cx: number, cy: number, scale: number, key: string, delay: string) {
  const angles = [-75, -45, -15, 15, 45, 75];
  return (
    <g key={key} className="cl-uke-rock" style={rockStyle(cx, cy, delay)}>
      {angles.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const len = 7 * scale;
        return (
          <line key={`${key}-${deg}`} x1={cx} y1={cy} x2={cx + Math.sin(rad) * len} y2={cy - Math.cos(rad) * len}
            stroke={INK} strokeWidth={1.1 * scale} strokeLinecap="round" />
        );
      })}
      <circle cx={cx} cy={cy} r={1.4 * scale} fill={INK} />
    </g>
  );
}

/** Wheat stalk with grain barbs, swaying from its base. */
function wheatStalk(x: number, y: number, key: string, delay: string) {
  return (
    <g key={key} className="cl-uke-rock" style={rockStyle(x, y, delay)}>
      <line x1={x} y1={y} x2={x} y2={y - 36} stroke={BAMBOO} strokeWidth="1.3" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} stroke={OCHRE} strokeWidth="1.1" strokeLinecap="round">
          <line x1={x} y1={y - 14 - i * 6} x2={x - 4} y2={y - 18 - i * 6} />
          <line x1={x} y1={y - 14 - i * 6} x2={x + 4} y2={y - 18 - i * 6} />
        </g>
      ))}
      <line x1={x} y1={y - 36} x2={x - 3} y2={y - 42} stroke={OCHRE} strokeWidth="1.1" strokeLinecap="round" />
      <line x1={x} y1={y - 36} x2={x + 3} y2={y - 42} stroke={OCHRE} strokeWidth="1.1" strokeLinecap="round" />
    </g>
  );
}

/** Flat-bottomed stylized cloud, drawn outline-only (no fill). */
function outlineCloud(d: string, width: number, key: string, className: string) {
  return (
    <path key={key} className={className} d={d} fill="none" stroke={CREAM} strokeWidth={width}
      strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />
  );
}

/** Tiny four-point sky sparkle; twinkle paced per-sparkle via delay. */
function sparkle(cx: number, cy: number, r: number, key: string, delay: string) {
  return (
    <path key={key} className="cl-uke-sparkle" style={{ animationDelay: delay }}
      d={`M${cx},${cy - r} L${cx + r * 0.28},${cy - r * 0.28} L${cx + r},${cy} L${cx + r * 0.28},${cy + r * 0.28} L${cx},${cy + r} L${cx - r * 0.28},${cy + r * 0.28} L${cx - r},${cy} L${cx - r * 0.28},${cy - r * 0.28} Z`}
      fill={CREAM} opacity={0.85} />
  );
}

/** Shared sky for the new scenes: gradient + bokashi + sparkles + shooting star + drifting clouds. */
function SkyBackdrop({ ids, shift, h, cloudYs }: { ids: GradientIds; shift: number; h: number; cloudYs: number[] }) {
  return (
    <>
      <rect x="9" y="9" width="182" height={h} fill={`url(#${ids.sky})`} />
      <rect x="9" y="9" width="182" height={Math.min(46, h)} fill={`url(#${ids.bokashi})`} />
      {sparkle(34 + shift, 26, 2.1, "s1", "0s")}
      {sparkle(140 - shift, 20, 1.7, "s2", "-1.6s")}
      <g className="cl-uke-shoot">
        <line x1={150 + shift} y1="22" x2={168 + shift} y2="11" stroke={CREAM} strokeWidth="1.4" strokeLinecap="round" />
        <line x1={154 + shift} y1="19.5" x2={176 + shift} y2="6" stroke={CREAM} strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
        <circle cx={149 + shift} cy="23" r="1.3" fill={STARLIGHT} />
      </g>
      {cloudYs.map((y, i) =>
        outlineCloud(`M14,${y} h22 a7,7 0 0 1 12,-4 a9,9 0 0 1 16,1 a6,6 0 0 1 11,3 h18`, 1.1, `c${i}`, i % 2 === 0 ? "cl-uke-drift-a" : "cl-uke-drift-b"),
      )}
    </>
  );
}

/** Pouring stream of water — dashed line with animated flow. */
function waterStream(x1: number, y1: number, x2: number, y2: number, key: string) {
  return (
    <line key={key} className="cl-uke-flow" x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={CREAM} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 8" />
  );
}

/** Breathing radial glow behind a scene's light source. */
function glowCircle(ids: GradientIds, cx: number, cy: number, r: number, key: string) {
  return <circle key={key} className="cl-uke-glow" cx={cx} cy={cy} r={r} fill={`url(#${ids.glow})`} />;
}

// ── I — The Magician: raised wand, lemniscate, table with the four tools ──
const MagicianScene: SceneComponent = ({ pal, ids, shift }) => (
  <>
    <g className="cl-uke-press-1">
      <SkyBackdrop ids={ids} shift={shift} h={120} cloudYs={[30]} />
      {outlineCloud("M9,138 h24 a6,6 0 0 1 11,-3 a8,8 0 0 1 15,2 h30", 1, "m1", "cl-uke-drift-b")}
    </g>
    {/* Lemniscate above the head */}
    <g className="cl-uke-press-3">
      <path d="M64,58 C56,50 46,54 46,59 C46,64 56,67 64,58 C72,50 82,54 82,59 C82,64 72,67 64,58 Z" fill="none" stroke={OCHRE} strokeWidth="1.6" />
    </g>
    {/* Raised arm + wand with glowing tip */}
    <g className="cl-uke-press-2">
      <path d="M74,94 L100,66 L104,71 L80,100 Z" fill={pal.robe} stroke={INK} strokeWidth="1" strokeLinejoin="round" />
    </g>
    <g className="cl-uke-press-3">
      <circle cx="102" cy="68" r="2" fill={SKIN} stroke={INK} strokeWidth="0.6" />
      <line x1="104" y1="66" x2="116" y2="46" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      <line x1="104" y1="66" x2="116" y2="46" stroke={BAMBOO} strokeWidth="1.6" strokeLinecap="round" />
      {glowCircle(ids, 117, 45, 13, "g1")}
      {sparkle(117, 45, 2.2, "s3", "-0.8s")}
    </g>
    {/* Lowered arm — as above, so below */}
    <g className="cl-uke-press-2">
      <path d="M54,96 L42,124 L46,128 L58,102 Z" fill={pal.robe} stroke={INK} strokeWidth="1" strokeLinejoin="round" />
    </g>
    <g className="cl-uke-press-3">
      <circle cx="44" cy="127" r="1.8" fill={SKIN} stroke={INK} strokeWidth="0.6" />
    </g>
    {/* Robe + head */}
    <g className="cl-uke-press-2">
      <path d="M64,88 C58,89 54,94 53,100 L48,168 L80,168 L76,100 C75,94 71,89 64,88 Z" fill={pal.robe} stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
      <line x1="53" y1="120" x2="76" y2="120" stroke={INK} strokeWidth="0.7" />
      <circle cx="64" cy="80" r="6.5" fill={SKIN} stroke={INK} strokeWidth="1" />
      {/* Table */}
      <rect x="100" y="150" width="66" height="5" fill={pal.mountain} stroke={INK} strokeWidth="1" />
      <line x1="106" y1="155" x2="106" y2="188" stroke={INK} strokeWidth="2" />
      <line x1="160" y1="155" x2="160" y2="188" stroke={INK} strokeWidth="2" />
    </g>
    {/* The four suit tools + ground hatch */}
    <g className="cl-uke-press-3">
      <path d="M109,140 a5,4 0 0 0 10,0 Z" fill={OCHRE} stroke={INK} strokeWidth="0.8" />
      <line x1="114" y1="144" x2="114" y2="149" stroke={INK} strokeWidth="1" />
      <line x1="110" y1="149" x2="118" y2="149" stroke={INK} strokeWidth="1" />
      <circle cx="130" cy="141" r="4.5" fill={OCHRE} stroke={INK} strokeWidth="0.8" />
      <circle cx="130" cy="141" r="1.8" fill="none" stroke={INK} strokeWidth="0.5" />
      <line x1="142" y1="148" x2="152" y2="134" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="140" y1="142" x2="146" y2="146" stroke={INK} strokeWidth="1.2" />
      <line x1="155" y1="148" x2="165" y2="137" stroke={BAMBOO} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="20" y1="200" x2="40" y2="198" stroke={INK} strokeWidth="0.8" />
      <line x1="120" y1="206" x2="146" y2="208" stroke={INK} strokeWidth="0.8" />
    </g>
  </>
);

// ── III — The Empress: star crown, heart shield with Venus glyph, wheat ──
const EmpressScene: SceneComponent = ({ pal, ids, shift }) => (
  <>
    <g className="cl-uke-press-1">
      <SkyBackdrop ids={ids} shift={shift} h={115} cloudYs={[28]} />
      {outlineCloud("M9,128 h24 a6,6 0 0 1 11,-3 a8,8 0 0 1 15,2 h30", 1, "m1", "cl-uke-drift-a")}
    </g>
    <g className="cl-uke-press-3">{glowCircle(ids, 96, 44, 12, "g1")}</g>
    {/* Crown */}
    <g className="cl-uke-press-2">
      <path d="M80,56 L86,44 L92,54 L96,42 L100,54 L106,44 L112,56 Z" fill={OCHRE} stroke={INK} strokeWidth="1" strokeLinejoin="round" />
    </g>
    <g className="cl-uke-press-3">
      {sparkle(86, 42, 1.4, "cs1", "0s")}
      {sparkle(96, 39, 1.6, "cs2", "-1.5s")}
      {sparkle(106, 42, 1.4, "cs3", "-3s")}
    </g>
    {/* Head, hair, seated robe, arm */}
    <g className="cl-uke-press-2">
      <circle cx="96" cy="70" r="7" fill={SKIN} stroke={INK} strokeWidth="1" />
      <path d="M89,66 q-4,10 0,18" fill="none" stroke={INK} strokeWidth="1.1" />
      <path d="M103,66 q4,10 0,18" fill="none" stroke={INK} strokeWidth="1.1" />
      <path d="M96,78 C85,80 79,92 77,106 L70,196 L126,196 L119,106 C117,92 109,80 96,78 Z" fill={pal.robe} stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M89,98 L103,98 L108,196 L84,196 Z" fill={pal.inner} stroke={INK} strokeWidth="0.8" strokeLinejoin="round" />
      <path d="M116,104 L132,128 L128,133 L112,112 Z" fill={pal.robe} stroke={INK} strokeWidth="0.9" strokeLinejoin="round" />
      {/* Heart shield */}
      <path d="M142,162 C142,156 152,156 152,163 C152,170 142,177 142,180 C142,177 132,170 132,163 C132,156 142,156 142,162 Z" fill={pal.inner} stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
    </g>
    <g className="cl-uke-press-3">
      <circle cx="130" cy="132" r="1.8" fill={SKIN} stroke={INK} strokeWidth="0.6" />
      {/* Venus glyph */}
      <circle cx="142" cy="167" r="3" fill="none" stroke={CREAM} strokeWidth="1.1" />
      <line x1="142" y1="170" x2="142" y2="176" stroke={CREAM} strokeWidth="1.1" />
      <line x1="139.5" y1="173.5" x2="144.5" y2="173.5" stroke={CREAM} strokeWidth="1.1" />
      {/* Wheat below — swaying */}
      {wheatStalk(26, 226, "w1", "0s")}
      {wheatStalk(40, 228, "w2", "-0.7s")}
      {wheatStalk(54, 225, "w3", "-1.4s")}
      {wheatStalk(154, 226, "w4", "-0.4s")}
      {wheatStalk(166, 228, "w5", "-1.1s")}
    </g>
  </>
);

// ── VII — The Chariot: starred canopy, boxy chariot, two sphinxes, city wall ──
const ChariotScene: SceneComponent = ({ pal, ids, shift }) => (
  <>
    <g className="cl-uke-press-1">
      <SkyBackdrop ids={ids} shift={shift} h={104} cloudYs={[26]} />
    </g>
    <g className="cl-uke-press-2">
      {/* City wall with battlements */}
      <rect x="12" y="112" width="162" height="16" fill={pal.mountain} stroke={INK} strokeWidth="1" />
      {[16, 34, 52, 70, 88, 106, 124, 142, 160].map((x) => (
        <rect key={x} x={x} y="106" width="9" height="6" fill={pal.mountain} stroke={INK} strokeWidth="0.7" />
      ))}
      {/* Canopy on two posts */}
      <path d="M48,62 Q100,36 152,62 L152,76 L48,76 Z" fill={pal.inner} stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
      <line x1="54" y1="76" x2="54" y2="112" stroke={INK} strokeWidth="1.6" />
      <line x1="146" y1="76" x2="146" y2="112" stroke={INK} strokeWidth="1.6" />
      {/* Charioteer */}
      <path d="M93,84 L100,74 L107,84 Z" fill={OCHRE} stroke={INK} strokeWidth="0.8" strokeLinejoin="round" />
      <circle cx="100" cy="90" r="6" fill={SKIN} stroke={INK} strokeWidth="1" />
      <path d="M88,98 L112,98 L114,124 L86,124 Z" fill={pal.robe} stroke={INK} strokeWidth="1" strokeLinejoin="round" />
      {/* Chariot box + wheels */}
      <rect x="64" y="124" width="72" height="38" fill={pal.robe} stroke={INK} strokeWidth="1.4" />
      <line x1="64" y1="132" x2="136" y2="132" stroke={INK} strokeWidth="0.7" />
      <circle cx="76" cy="168" r="7" fill={CREAM} stroke={INK} strokeWidth="1.3" />
      <circle cx="124" cy="168" r="7" fill={CREAM} stroke={INK} strokeWidth="1.3" />
      {/* Two sphinxes — one dark, one light */}
      <path d="M34,201 L34,192 Q34,184 44,184 L50,184 Q58,184 58,192 L72,192 Q80,192 80,198 L80,201 Z" fill={pal.mountain} stroke={INK} strokeWidth="1" strokeLinejoin="round" />
      <circle cx="44" cy="178" r="5" fill={pal.mountain} stroke={INK} strokeWidth="1" />
      <path d="M166,201 L166,192 Q166,184 156,184 L150,184 Q142,184 142,192 L128,192 Q120,192 120,198 L120,201 Z" fill={CREAM} stroke={INK} strokeWidth="1" strokeLinejoin="round" />
      <circle cx="156" cy="178" r="5" fill={CREAM} stroke={INK} strokeWidth="1" />
    </g>
    <g className="cl-uke-press-3">
      {sparkle(70, 58, 1.6, "cs1", "0s")}
      {sparkle(100, 50, 1.8, "cs2", "-1.5s")}
      {sparkle(130, 58, 1.6, "cs3", "-3s")}
      <circle cx="100" cy="144" r="4.5" fill={OCHRE} stroke={INK} strokeWidth="0.8" />
      <circle cx="76" cy="168" r="1.5" fill={INK} />
      <circle cx="124" cy="168" r="1.5" fill={INK} />
      <line x1="14" y1="208" x2="172" y2="208" stroke={INK} strokeWidth="1" />
    </g>
  </>
);

// ── X — Wheel of Fortune: spoked wheel, sphinx above, snake and creature ──
const WheelScene: SceneComponent = ({ pal, ids, shift }) => (
  <>
    <g className="cl-uke-press-1">
      <SkyBackdrop ids={ids} shift={shift} h={192} cloudYs={[30]} />
      {outlineCloud("M9,216 h24 a6,6 0 0 1 11,-3 a8,8 0 0 1 15,2 h30 a6,6 0 0 1 11,-2 h20", 1, "m1", "cl-uke-drift-b")}
    </g>
    {/* Sphinx atop, snake descending left, creature rising right */}
    <g className="cl-uke-press-2">
      <path d="M78,90 q0,-10 10,-10 q6,0 6,6 l12,0 q5,0 5,5 l0,3 l-33,0 Z" fill={pal.inner} stroke={INK} strokeWidth="0.9" strokeLinejoin="round" />
      <circle cx="88" cy="75" r="4" fill={pal.inner} stroke={INK} strokeWidth="0.9" />
      <path d="M84,71 L88,65 L92,71" fill="none" stroke={INK} strokeWidth="0.8" />
      <path d="M34,196 q-9,14 1,24 q9,9 2,22" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M34,196 L29,190 L37,189 Z" fill={INK} />
      <path d="M152,212 q11,-7 8,-19 q-3,-11 6,-16" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M166,177 l3,-7 l3,8" fill="none" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />
    </g>
    <g className="cl-uke-press-3">{glowCircle(ids, 92, 140, 14, "g1")}</g>
    {/* The wheel itself — slowly turning */}
    <g className="cl-uke-press-2">
      <g className="cl-uke-spin" style={rockStyle(92, 140, "0s")}>
        <circle cx="92" cy="140" r="48" fill={CREAM} stroke={INK} strokeWidth="2.6" />
        <circle cx="92" cy="140" r="33" fill="none" stroke={INK} strokeWidth="1" />
        <line x1="92" y1="92" x2="92" y2="188" stroke={INK} strokeWidth="1.1" />
        <line x1="44" y1="140" x2="140" y2="140" stroke={INK} strokeWidth="1.1" />
        <line x1="58.1" y1="106.1" x2="125.9" y2="173.9" stroke={INK} strokeWidth="1.1" />
        <line x1="125.9" y1="106.1" x2="58.1" y2="173.9" stroke={INK} strokeWidth="1.1" />
        <circle cx="120.6" cy="111.4" r="2" fill={pal.inner} stroke={INK} strokeWidth="0.5" />
        <circle cx="63.4" cy="111.4" r="2" fill={pal.inner} stroke={INK} strokeWidth="0.5" />
        <circle cx="120.6" cy="168.6" r="2" fill={pal.inner} stroke={INK} strokeWidth="0.5" />
        <circle cx="63.4" cy="168.6" r="2" fill={pal.inner} stroke={INK} strokeWidth="0.5" />
        <circle cx="92" cy="140" r="6.5" fill={OCHRE} stroke={INK} strokeWidth="1" />
      </g>
    </g>
  </>
);

// ── XIII — Death: skeletal rider, rose banner, sun between two towers ──
const DeathScene: SceneComponent = ({ pal, ids, shift }) => (
  <>
    <g className="cl-uke-press-1">
      <SkyBackdrop ids={ids} shift={shift} h={140} cloudYs={[34]} />
      {outlineCloud("M9,158 h24 a6,6 0 0 1 11,-3 a8,8 0 0 1 15,2 h30", 1, "m1", "cl-uke-drift-a")}
    </g>
    {/* Sun rising between the two towers */}
    <g className="cl-uke-press-3">{glowCircle(ids, 60, 140, 20, "g1")}</g>
    <g className="cl-uke-press-2">
      <circle cx="60" cy="140" r="12" fill={OCHRE} stroke={INK} strokeWidth="1" />
      <rect x="38" y="120" width="11" height="20" fill={pal.mountain} stroke={INK} strokeWidth="1" />
      <rect x="38" y="116" width="11" height="4" fill={pal.mountain} stroke={INK} strokeWidth="0.7" />
      <rect x="71" y="120" width="11" height="20" fill={pal.mountain} stroke={INK} strokeWidth="1" />
      <rect x="71" y="116" width="11" height="4" fill={pal.mountain} stroke={INK} strokeWidth="0.7" />
    </g>
    <g className="cl-uke-press-3">
      <line x1="60" y1="124" x2="60" y2="118" stroke={OCHRE} strokeWidth="1.2" />
      <line x1="48" y1="128" x2="44" y2="123" stroke={OCHRE} strokeWidth="1.2" />
      <line x1="72" y1="128" x2="76" y2="123" stroke={OCHRE} strokeWidth="1.2" />
    </g>
    {/* Horse + skeletal rider */}
    <g className="cl-uke-press-2">
      <path d="M108,186 q-3,-20 17,-27 q24,-8 42,3 q11,8 8,20 l-4,6 l-58,2 Z" fill={CREAM} stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M162,164 q15,-9 19,3 q3,10 -5,14 l-13,4 l-6,-8 Z" fill={CREAM} stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M108,178 q-8,4 -6,14" fill="none" stroke={INK} strokeWidth="1.4" />
      {[[114, 190, 110, 215], [126, 191, 124, 215], [152, 190, 150, 215], [164, 186, 168, 212]].map(([a, b, c, d], i) => (
        <g key={i}>
          <line x1={a} y1={b} x2={c} y2={d} stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
          <line x1={a} y1={b} x2={c} y2={d} stroke={CREAM} strokeWidth="1.8" strokeLinecap="round" />
        </g>
      ))}
      <circle cx="128" cy="124" r="6" fill={CREAM} stroke={INK} strokeWidth="1.1" />
      <line x1="128" y1="130" x2="131" y2="162" stroke={INK} strokeWidth="1.6" />
      <path d="M122,138 q7,4 15,1 M121,146 q8,4 17,1 M123,154 q7,4 15,1" fill="none" stroke={INK} strokeWidth="1" />
      <line x1="127" y1="140" x2="99" y2="132" stroke={INK} strokeWidth="1.6" />
      {/* Banner pole */}
      <line x1="98" y1="110" x2="98" y2="170" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
    </g>
    <g className="cl-uke-press-3">
      <circle cx="172" cy="168" r="1" fill={INK} />
      <circle cx="125.5" cy="122.5" r="1" fill={INK} />
      <circle cx="130.5" cy="122.5" r="1" fill={INK} />
      {/* Dark banner with the white rose — swaying on its pole */}
      <g className="cl-uke-rock" style={rockStyle(98, 112, "-0.6s")}>
        <path d="M98,112 L134,117 L131,139 L98,135 Z" fill={INK} strokeLinejoin="round" />
        {glowCircle(ids, 114, 125, 9, "g2")}
        <circle cx="114" cy="125" r="4.6" fill={CREAM} />
        <circle cx="114" cy="125" r="2.4" fill="none" stroke={INK} strokeWidth="0.6" />
        <circle cx="114" cy="125" r="0.8" fill={INK} />
      </g>
      <line x1="20" y1="230" x2="44" y2="228" stroke={INK} strokeWidth="0.8" />
      <line x1="120" y1="240" x2="150" y2="242" stroke={INK} strokeWidth="0.8" />
    </g>
  </>
);

// ── XVII — The Star: kneeling figure, two jugs, eight stars ──
const StarScene: SceneComponent = ({ pal, ids, shift }) => (
  <>
    <g className="cl-uke-press-1">
      <SkyBackdrop ids={ids} shift={shift} h={190} cloudYs={[]} />
    </g>
    {/* The great eight-pointed star + seven small stars */}
    <g className="cl-uke-press-3">
      {glowCircle(ids, 78, 50, 22, "g1")}
      <path d="M62,34 L94,34 L94,66 L62,66 Z" fill={STARLIGHT} stroke={OCHRE} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M78,27 L101,50 L78,73 L55,50 Z" fill={STARLIGHT} stroke={OCHRE} strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="78" cy="50" r="2" fill={OCHRE} />
      {sparkle(28, 26, 1.6, "st1", "0s")}
      {sparkle(122, 22, 1.4, "st2", "-0.6s")}
      {sparkle(152, 44, 1.6, "st3", "-1.2s")}
      {sparkle(146, 88, 1.3, "st4", "-1.8s")}
      {sparkle(30, 92, 1.4, "st5", "-2.4s")}
      {sparkle(116, 104, 1.3, "st6", "-3s")}
      {sparkle(52, 120, 1.2, "st7", "-3.6s")}
    </g>
    {/* Land mound + pool + kneeling figure */}
    <g className="cl-uke-press-2">
      <path d="M9,246 L9,232 Q48,214 92,230 L104,246 Z" fill={pal.mountain} stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
      <ellipse cx="132" cy="242" rx="38" ry="11" fill={pal.facet} stroke={INK} strokeWidth="1.1" />
      <path d="M68,172 C60,178 56,192 58,206 L54,226 L72,226 L74,206 Q80,192 76,178 Z" fill={SKIN} stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M58,226 L84,232 L82,238 L54,232 Z" fill={SKIN} stroke={INK} strokeWidth="0.9" strokeLinejoin="round" />
      <circle cx="68" cy="166" r="5.5" fill={SKIN} stroke={INK} strokeWidth="1" />
      <path d="M63,162 q-4,12 0,20" fill="none" stroke={INK} strokeWidth="1.1" />
      <line x1="62" y1="182" x2="46" y2="194" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="74" y1="184" x2="94" y2="198" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M39,192 a5,5 0 0 0 9,3 l-2,-9 Z" fill={OCHRE} stroke={INK} strokeWidth="0.9" strokeLinejoin="round" />
      <path d="M91,196 a5,5 0 0 1 3,9 l-8,-3 Z" fill={OCHRE} stroke={INK} strokeWidth="0.9" strokeLinejoin="round" />
    </g>
    <g className="cl-uke-press-3">
      <path d="M112,240 q8,-4 16,0 M132,246 q8,-4 16,0" fill="none" stroke={CREAM} strokeWidth="0.8" />
      {waterStream(42, 201, 38, 234, "ws1")}
      {waterStream(99, 206, 108, 234, "ws2")}
    </g>
  </>
);

// ── XXII — The Fool: stepping toward the cliff, dog, bundle, sun ──
const FoolScene: SceneComponent = ({ pal, ids, shift }) => (
  <>
    <g className="cl-uke-press-1">
      <SkyBackdrop ids={ids} shift={shift} h={160} cloudYs={[96, 108]} />
    </g>
    {/* Sun */}
    <g className="cl-uke-press-3">{glowCircle(ids, 46, 52, 24, "g1")}</g>
    <g className="cl-uke-press-2">
      <circle cx="46" cy="52" r="14" fill={OCHRE} stroke={INK} strokeWidth="1.2" />
      {/* Cliff with lit facet */}
      <path d="M9,262 L9,222 L116,222 L134,262 Z" fill={pal.mountain} stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M116,222 L134,262 L104,262 L96,236 Z" fill={pal.facet} stroke={INK} strokeWidth="0.7" strokeLinejoin="round" />
      {/* Fool in profile, head tilted up, stepping toward the edge */}
      <path d="M96,172 q4,-6 11,-3" fill="none" stroke={INK} strokeWidth="1" />
      <circle cx="102" cy="176" r="5.5" fill={SKIN} stroke={INK} strokeWidth="1" />
      <path d="M102,183 L94,216 L110,216 L108,184 Z" fill={pal.robe} stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
      <line x1="104" y1="216" x2="118" y2="228" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <line x1="104" y1="216" x2="118" y2="228" stroke={pal.inner} strokeWidth="1.7" strokeLinecap="round" />
      <line x1="98" y1="216" x2="92" y2="232" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <line x1="98" y1="216" x2="92" y2="232" stroke={pal.inner} strokeWidth="1.7" strokeLinecap="round" />
      <line x1="108" y1="188" x2="118" y2="176" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
      {/* Bundle on a stick over the shoulder */}
      <line x1="96" y1="190" x2="76" y2="164" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="96" y1="190" x2="76" y2="164" stroke={BAMBOO} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="72" cy="158" r="5.5" fill={pal.inner} stroke={INK} strokeWidth="1" />
      {/* Small dog at his heels */}
      <path d="M64,228 q-1,-8 7,-8 q5,0 6,5 l6,0 q4,0 4,4 l0,3 l-23,0 Z" fill={CREAM} stroke={INK} strokeWidth="1" strokeLinejoin="round" />
      <circle cx="79" cy="217" r="3.6" fill={CREAM} stroke={INK} strokeWidth="1" />
    </g>
    <g className="cl-uke-press-3">
      {[[46, 32, 46, 26], [46, 72, 46, 78], [26, 52, 20, 52], [66, 52, 72, 52], [32, 38, 27, 33], [60, 38, 65, 33]].map(([a, b, c, d], i) => (
        <line key={i} x1={a} y1={b} x2={c} y2={d} stroke={INK} strokeWidth="1" strokeLinecap="round" />
      ))}
      <line x1="107" y1="169" x2="112" y2="162" stroke={OCHRE} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M68,155 q4,3 8,0 M70,162 q3,2 6,1" fill="none" stroke={INK} strokeWidth="0.6" />
      <line x1="78" y1="214" x2="76" y2="209" stroke={INK} strokeWidth="1" strokeLinecap="round" />
      <path d="M64,222 q-5,-2 -5,-8" fill="none" stroke={INK} strokeWidth="1.1" strokeLinecap="round" />
      <path d="M30,222 l-2,-6 M34,222 l1,-7 M38,222 l3,-6" stroke={INK} strokeWidth="0.9" strokeLinecap="round" />
    </g>
  </>
);

// ── IX — The Hermit (canonical; fallback for any other number) ──
const HermitScene: SceneComponent = ({ pal, ids, shift, v }) => (
  <>
    <g className="cl-uke-press-1">
      {/* Indigo night sky */}
      <rect x="9" y="9" width="182" height="192" fill={`url(#${ids.sky})`} />
      <rect x="9" y="9" width="182" height="46" fill={`url(#${ids.bokashi})`} />
    </g>
    <g className="cl-uke-press-3">
      {/* Sky sparkles */}
      {sparkle(34 + shift, 34, 2.4, "s1", "0s")}
      {sparkle(140 - shift, 26, 1.9, "s2", "-1.6s")}
      {sparkle(112, 52 + shift * 0.4, 1.5, "s3", "-3.1s")}
      {/* Shooting star crossing the sky diagonally */}
      <g className="cl-uke-shoot">
        <line x1={150 + shift} y1="22" x2={168 + shift} y2="11" stroke={CREAM} strokeWidth="1.4" strokeLinecap="round" />
        <line x1={154 + shift} y1="19.5" x2={176 + shift} y2="6" stroke={CREAM} strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
        <circle cx={149 + shift} cy="23" r="1.3" fill={STARLIGHT} />
      </g>
    </g>
    <g className="cl-uke-press-1">
      {/* Outline-only stylized clouds (drifting) */}
      {outlineCloud("M16,64 h20 a7,7 0 0 1 12,-4 a9,9 0 0 1 16,1 a6,6 0 0 1 11,3 h16", 1.2, "c1", "cl-uke-drift-a")}
      {outlineCloud("M22,72 h14 a5,5 0 0 1 10,-2 a7,7 0 0 1 13,2 h18", 0.8, "c2", "cl-uke-drift-b")}
      {outlineCloud("M104,84 h16 a6,6 0 0 1 11,-3 a8,8 0 0 1 14,2 a5,5 0 0 1 9,2 h14", 1.1, "c3", "cl-uke-drift-a")}
    </g>
    <g className="cl-uke-press-2">
      {/* Jagged Prussian-blue mountain */}
      <path d="M9,235 L42,210 L58,222 L86,190 L100,206 L114,200 L136,222 L158,212 L182,226 L182,235 Z" fill={pal.mountain} stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M86,190 L100,206 L114,200 L136,222 L110,235 L92,214 Z" fill={pal.facet} stroke={INK} strokeWidth="0.7" strokeLinejoin="round" />
    </g>
    <g className="cl-uke-press-1">
      {/* Mist band crossing the slopes, outline-only (drifting) */}
      {outlineCloud("M9,206 h24 a6,6 0 0 1 11,-3 a8,8 0 0 1 15,2 h30 a6,6 0 0 1 11,-2 h20", 1, "m1", "cl-uke-drift-b")}
    </g>
    <g className="cl-uke-press-2">
      {/* Pine in the foreground (needles rustle) */}
      <path d="M30,256 C29,248 30,240 34,233" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
      {pineCluster(35, 232, 1, "p1", "0s")}
      {pineCluster(31, 242, 0.85, "p2", "-0.9s")}
      {v % 2 === 0 && pineCluster(28, 250, 0.7, "p3", "-1.8s")}
      {/* Raised left sleeve, arm lifting the lantern */}
      <path d="M78,156 L66,146 L62,152 L74,163 Z" fill={pal.robe} stroke={INK} strokeWidth="1" strokeLinejoin="round" />
    </g>
    <g className="cl-uke-press-3">
      <circle cx="64" cy="148.5" r="1.9" fill={SKIN} stroke={INK} strokeWidth="0.6" />
      {/* Hanging lantern assembly — sways gently from the hang point */}
      <g className="cl-uke-sway">
        <line x1="64" y1="150" x2="64" y2="154" stroke={INK} strokeWidth="0.8" />
        <circle className="cl-uke-glow" cx="64" cy="165" r="27" fill={`url(#${ids.glow})`} />
        <ellipse cx="64" cy="165" rx="9.5" ry="11" fill={pal.lantern} stroke={INK} strokeWidth="1.2" />
        <line x1="55.5" y1="160" x2="72.5" y2="160" stroke={INK} strokeWidth="0.7" />
        <line x1="54.5" y1="165" x2="73.5" y2="165" stroke={INK} strokeWidth="0.7" />
        <line x1="55.5" y1="170" x2="72.5" y2="170" stroke={INK} strokeWidth="0.7" />
        <rect x="61" y="152.5" width="6" height="2.6" fill={INK} />
        <rect x="61" y="175" width="6" height="2.6" fill={INK} />
        <g fill={STARLIGHT}>
          <path d="M64,160.6 L67.8,167 L60.2,167 Z" />
          <path d="M64,169.4 L60.2,163 L67.8,163 Z" />
        </g>
      </g>
    </g>
    <g className="cl-uke-press-2">
      {/* Bamboo staff in the right hand */}
      <line x1="105" y1="146" x2="105" y2="196" stroke={INK} strokeWidth="3.1" strokeLinecap="round" />
      <line x1="105" y1="146" x2="105" y2="196" stroke={BAMBOO} strokeWidth="2" strokeLinecap="round" />
      <line x1="103.4" y1="162" x2="106.6" y2="162" stroke={INK} strokeWidth="0.8" />
      <line x1="103.4" y1="178" x2="106.6" y2="178" stroke={INK} strokeWidth="0.8" />
      {/* Right sleeve reaching the staff */}
      <path d="M96,156 L105,157.5 L104,164.5 L95,164 Z" fill={pal.robe} stroke={INK} strokeWidth="1" strokeLinejoin="round" />
    </g>
    <g className="cl-uke-press-3">
      <circle cx="104.5" cy="161" r="1.7" fill={SKIN} stroke={INK} strokeWidth="0.6" />
    </g>
    <g className="cl-uke-press-2">
      {/* Outer robe: deep indigo, one flat bell-shaped block */}
      <path d="M86,140 C80,141 76,147 76,153 L74,166 L71,193 L101,193 L98,166 L96,153 C96,147 92,141 86,140 Z" fill={pal.robe} stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M82,159 L90,159 L94,193 L78,193 Z" fill={pal.inner} stroke={INK} strokeWidth="0.8" strokeLinejoin="round" />
      <path d="M82,159 L86,166 L90,159" fill="none" stroke={INK} strokeWidth="0.8" />
      {/* Hood shadow and face */}
      <path d="M80,152 C80,147 83,145 86,145 C89,145 92,147 92,152 C92,156 89,158.5 86,158.5 C83,158.5 80,156 80,152 Z" fill={INK} />
      <ellipse cx="86" cy="152.5" rx="2.4" ry="2.8" fill={SKIN} />
    </g>
    <g className="cl-uke-press-3">
      <path d="M84,155 L86,158 L88,155 Z" fill={CREAM} opacity="0.85" />
    </g>
  </>
);

const SCENES: Record<number, SceneComponent> = {
  1: MagicianScene,
  3: EmpressScene,
  7: ChariotScene,
  9: HermitScene,
  10: WheelScene,
  13: DeathScene,
  17: StarScene,
  22: FoolScene,
};

export default function UkiyoECard({ number = 9, name = "THE HERMIT", variant = 0 }: UkiyoECardProps) {
  const v = ((variant % 8) + 8) % 8;
  const mirror = v >= 4;
  const pal = PALETTES[v % 4];
  // Deterministic per-variant scatter for the sky decorations (0 for variant 0).
  const shift = (v * 11) % 13;

  // Gradient ids must be unique per variant so gallery siblings don't share defs.
  const ids: GradientIds = { sky: `cl-uke-sky-${v}`, bokashi: `cl-uke-bokashi-${v}`, glow: `cl-uke-glow-${v}` };

  const Scene = SCENES[number] ?? HermitScene;

  // ── Hanko seal: numeral stacked vertically, growing downward if long ──
  const numeral = toRoman(number);
  const n = numeral.length;
  const sealFont = n <= 3 ? 8.5 : 6;
  const sealStep = n <= 2 ? 9.5 : 7;
  const sealH = n <= 2 ? 23 : 13.5 + (n - 1) * sealStep;
  const sealBottom = 14 + sealH;

  // ── Title cartouche: letters stacked vertically, font scaled to fit ──
  const cartTop = sealBottom + 7;
  const cartBottom = 258;
  const chars = name.split("");
  const letterCount = chars.filter((c) => c !== " ").length;
  const spaceCount = chars.length - letterCount;
  const avail = cartBottom - cartTop - 24;
  const step = Math.max(5, Math.min(20, avail / (letterCount + spaceCount * 0.4)));
  const titleFont = Math.min(12, step * 0.62);
  let titleY = cartTop + 16;

  return (
    <figure
      className="cl-uke-root"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0, background: CREAM, overflow: "hidden", position: "relative" }}
    >
      <style>{`
        .cl-uke-root svg { display: block; width: 100%; height: 100%; }
        .cl-uke-flash {
          position: absolute; inset: 0;
          background: #faf5e8;
          opacity: 0;
          pointer-events: none;
        }
        .cl-uke-shimmer {
          position: absolute;
          left: 4.5%; right: 4.5%; top: 3%; height: 15.5%;
          background: linear-gradient(180deg, rgba(10,18,38,0.5), rgba(10,18,38,0));
          background-size: 100% 220%;
          background-position: 0% 0%;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: no-preference) {
          /* Initial load: woodblock printing sequence (~1.5s, one-shot) */
          .cl-uke-flash { animation: cl-uke-flash 1.5s steps(1, end) both; }
          @keyframes cl-uke-flash {
            0% { opacity: 1; }
            12% { opacity: 0; }
          }
          .cl-uke-press-1 { animation: cl-uke-press-1 1.5s steps(1, end) both; }
          @keyframes cl-uke-press-1 {
            0% { opacity: 0; }
            18% { opacity: 1; }
          }
          .cl-uke-press-2 { animation: cl-uke-press-2 1.5s steps(1, end) both; }
          @keyframes cl-uke-press-2 {
            0% { opacity: 0; }
            45% { opacity: 1; }
          }
          .cl-uke-press-3 { animation: cl-uke-press-3 1.5s steps(1, end) both; }
          @keyframes cl-uke-press-3 {
            0% { opacity: 0; }
            70% { opacity: 1; }
          }
          .cl-uke-stamp { transform-box: view-box; animation: cl-uke-stamp 1.5s ease-out both; }
          @keyframes cl-uke-stamp {
            0%, 82% { opacity: 0; transform: scale(1.3); }
            89% { opacity: 1; transform: scale(0.95); }
            95% { transform: scale(1.04); }
            100% { opacity: 1; transform: scale(1); }
          }
          .cl-uke-glow { animation: cl-uke-breathe 3.8s ease-in-out infinite; }
          @keyframes cl-uke-breathe {
            0%, 100% { opacity: 0.85; }
            50% { opacity: 1; }
          }
          .cl-uke-shoot { animation: cl-uke-shoot 8s linear infinite; opacity: 0; }
          @keyframes cl-uke-shoot {
            0% { transform: translate(0, 0); opacity: 0; }
            2% { opacity: 1; }
            11% { transform: translate(-96px, 58px); opacity: 0; }
            100% { transform: translate(-96px, 58px); opacity: 0; }
          }
          .cl-uke-rock { transform-box: view-box; animation: cl-uke-rock 2.7s ease-in-out infinite; }
          @keyframes cl-uke-rock {
            0%, 100% { transform: rotate(-2.5deg); }
            50% { transform: rotate(2.5deg); }
          }
          .cl-uke-spin { transform-box: view-box; animation: cl-uke-spin 40s linear infinite; }
          @keyframes cl-uke-spin { to { transform: rotate(360deg); } }
          .cl-uke-flow { animation: cl-uke-flow 1.4s linear infinite; }
          @keyframes cl-uke-flow { to { stroke-dashoffset: -12; } }
          .cl-uke-drift-a { animation: cl-uke-drift-a 26s ease-in-out infinite; }
          .cl-uke-drift-b { animation: cl-uke-drift-b 34s ease-in-out infinite; }
          @keyframes cl-uke-drift-a {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(14px); }
          }
          @keyframes cl-uke-drift-b {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(-13px); }
          }
          .cl-uke-sway {
            transform-box: view-box;
            transform-origin: 64px 150px;
            animation: cl-uke-sway 4s ease-in-out infinite;
          }
          @keyframes cl-uke-sway {
            0%, 100% { transform: rotate(-2deg); }
            50% { transform: rotate(2deg); }
          }
          .cl-uke-sparkle { animation: cl-uke-twinkle 4.5s ease-in-out infinite; }
          @keyframes cl-uke-twinkle {
            0%, 100% { opacity: 0.85; }
            50% { opacity: 0.25; }
          }
          .cl-uke-root:hover .cl-uke-sparkle { animation-duration: 1.1s; }
          .cl-uke-root:hover .cl-uke-shimmer { animation: cl-uke-shimmer 2.8s ease-in-out infinite; }
          @keyframes cl-uke-shimmer {
            0%, 100% { background-position: 0% 0%; }
            50% { background-position: 0% 100%; }
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cl-uke-glow,
          .cl-uke-shoot,
          .cl-uke-rock,
          .cl-uke-spin,
          .cl-uke-flow,
          .cl-uke-drift-a,
          .cl-uke-drift-b,
          .cl-uke-sway,
          .cl-uke-sparkle,
          .cl-uke-shimmer,
          .cl-uke-press-1,
          .cl-uke-press-2,
          .cl-uke-press-3,
          .cl-uke-stamp { animation: none; }
        }
      `}</style>

      <svg viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${name} tarot card in ukiyo-e woodblock print style`}>
        <defs>
          <linearGradient id={ids.sky} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={pal.sky[0]} />
            <stop offset="0.22" stopColor={pal.sky[1]} />
            <stop offset="0.6" stopColor={pal.sky[2]} />
            <stop offset="1" stopColor={pal.sky[3]} />
          </linearGradient>
          <linearGradient id={ids.bokashi} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={pal.bokashi} stopOpacity="0.65" />
            <stop offset="1" stopColor={pal.bokashi} stopOpacity="0" />
          </linearGradient>
          <radialGradient id={ids.glow} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={pal.glow} stopOpacity="0.6" />
            <stop offset="0.55" stopColor={pal.glow} stopOpacity="0.22" />
            <stop offset="1" stopColor={pal.glow} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Washi paper ground ── */}
        <rect x="0" y="0" width="200" height="300" fill={CREAM} />
        <g stroke="#e6dcc2" strokeWidth="0.5">
          <line x1="20" y1="262" x2="48" y2="259" />
          <line x1="120" y1="276" x2="152" y2="279" />
          <line x1="60" y1="286" x2="92" y2="284" />
        </g>

        {/* ── Scene (mirrored for variants 4-7) ── */}
        <g transform={mirror ? "translate(200,0) scale(-1,1)" : undefined}>
          <Scene pal={pal} ids={ids} shift={shift} v={v} />
        </g>

        {/* ── Hanko seal: vertical red block, top-right, stamped last ── */}
        <g className="cl-uke-stamp" style={{ transformOrigin: "184.5px 26px" }}>
          <rect x="177" y="14" width="15" height={sealH} fill={VERMILION} />
          {numeral.split("").map((ch, i) => (
            <text key={`n-${i}`} x="184.5" y={23 + i * sealStep} textAnchor="middle"
              fontFamily={SERIF} fontWeight="bold" fontSize={sealFont} fill={CREAM}>
              {ch}
            </text>
          ))}
        </g>

        {/* ── Title cartouche: tall narrow slip on the right edge, stamped last ── */}
        <g className="cl-uke-stamp" style={{ transformOrigin: "184.5px 150px" }}>
          <rect x="177" y={cartTop} width="15" height={cartBottom - cartTop} fill="#f6eeda" stroke={INK} strokeWidth="1" />
          <rect x="179.5" y={cartTop + 2.5} width="10" height={cartBottom - cartTop - 5} fill="none" stroke={INK} strokeWidth="0.45" />
          {chars.map((ch, i) => {
            if (ch === " ") {
              titleY += step * 0.4;
              return null;
            }
            const y = titleY;
            titleY += step;
            return (
              <text key={`t-${i}`} x="184.5" y={y} textAnchor="middle"
                fontFamily={SERIF} fontWeight="bold" fontSize={titleFont} fill={INK}>
                {ch}
              </text>
            );
          })}
        </g>

        {/* ── Thin double keyline frame ── */}
        <rect x="4" y="4" width="192" height="292" fill="none" stroke={INK} strokeWidth="1.6" />
        <rect x="8" y="8" width="184" height="284" fill="none" stroke={INK} strokeWidth="0.55" />
      </svg>

      {/* Blank-paper flash that opens the printing sequence */}
      <div className="cl-uke-flash" aria-hidden="true" />
      {/* Bokashi shimmer overlay — sits over the top sky band, animates on hover */}
      <div className="cl-uke-shimmer" aria-hidden="true" />
    </figure>
  );
}
