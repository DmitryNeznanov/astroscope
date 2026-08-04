// LANDING / GOLD-MEDALLION — a design exploration of the production landing
// in the numismatic language of src/components/cards/gold-medallion.tsx:
// struck gold coins on black velvet — a giant Hermit medallion that strikes
// on load with a flash, the twelve signs as small coins in a display tray,
// six section medals resting on museum shelf hairlines, a commemorative
// Destiny Matrix medal, FAQ as engraved plaques. Fully self-contained:
// inline SVG, Tailwind for layout, one scoped <style> block (lgm- prefixed).
// Server-component safe: no hooks, CSS animations only, statically prerendered.

import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";

export const metadata: Metadata = {
  title: "Astro Scope — Your fate, struck in gold",
  description:
    "Free birth chart, daily horoscopes, synastry and tarot — a treasury struck from the sky.",
};

const DEG = Math.PI / 180;

const SERIF = "Georgia, 'Times New Roman', serif";
const GLYPH_FONT = "'DejaVu Sans', 'Segoe UI Symbol', Georgia, serif";

// the medallion palette (from the gold-medallion cards)
const SHADOW = "#5e430d";
const RECESS = "#4a330a";
const BRIGHT = "#f1d47c";
const PALE = "#f6dd8d";

const GLEAM_STAR =
  "M0 -7 L1.6 -1.6 L7 0 L1.6 1.6 L0 7 L-1.6 1.6 L-7 0 L-1.6 -1.6 Z";

// every glyph carries U+FE0E so it renders as monochrome text, never emoji
const SIGNS = [
  { g: "♈︎", n: "Aries", d: "Mar 21 – Apr 19" },
  { g: "♉︎", n: "Taurus", d: "Apr 20 – May 20" },
  { g: "♊︎", n: "Gemini", d: "May 21 – Jun 20" },
  { g: "♋︎", n: "Cancer", d: "Jun 21 – Jul 22" },
  { g: "♌︎", n: "Leo", d: "Jul 23 – Aug 22" },
  { g: "♍︎", n: "Virgo", d: "Aug 23 – Sep 22" },
  { g: "♎︎", n: "Libra", d: "Sep 23 – Oct 22" },
  { g: "♏︎", n: "Scorpio", d: "Oct 23 – Nov 21" },
  { g: "♐︎", n: "Sagittarius", d: "Nov 22 – Dec 21" },
  { g: "♑︎", n: "Capricorn", d: "Dec 22 – Jan 19" },
  { g: "♒︎", n: "Aquarius", d: "Jan 20 – Feb 18" },
  { g: "♓︎", n: "Pisces", d: "Feb 19 – Mar 20" },
];

/* ========================== MEDAL GEOMETRY ========================== */

const MC = 60; // medal center x (viewBox 0 0 120 132)
const MCY = 62;

const MEDAL_REEDS = Array.from({ length: 72 }, (_, i) => i * 5);
const MEDAL_BEADS = Array.from({ length: 44 }, (_, i) => {
  const a = i * (360 / 44) * DEG;
  return {
    x: +(MC + 41.5 * Math.cos(a)).toFixed(2),
    y: +(MCY + 41.5 * Math.sin(a)).toFixed(2),
  };
});

const SIGN_REEDS = Array.from({ length: 48 }, (_, i) => i * 7.5);

// faint gold dust across a 1600×1000 field, deterministic for a stable prerender
const DUST = Array.from({ length: 90 }, (_, i) => ({
  x: +((i * 733.7 + 97) % 1600).toFixed(1),
  y: +((i * 449.3 + 53) % 1000).toFixed(1),
  r: +(0.4 + ((i * 11) % 10) / 18).toFixed(2),
  o: +(0.18 + ((i * 17) % 10) / 30).toFixed(2),
  g: i % 3,
}));

// watermark medallion looming behind the lower sections (1000×1000)
const MEGA_REEDS = Array.from({ length: 120 }, (_, i) => i * 3);

/* Relief pair: dark gold shadow copy offset down-right, gradient mass on
   top. `w` switches from filled path to stroked path (round caps). */
function Relief({ d, w }: { d: string; w?: number }) {
  return w ? (
    <>
      <path
        d={d}
        stroke={SHADOW}
        strokeWidth={w}
        strokeLinecap="round"
        fill="none"
        transform="translate(.9 1.3)"
      />
      <path
        d={d}
        stroke="url(#lgm-g-relief)"
        strokeWidth={w}
        strokeLinecap="round"
        fill="none"
      />
    </>
  ) : (
    <>
      <path d={d} fill={SHADOW} transform="translate(1 1.4)" />
      <path d={d} fill="url(#lgm-g-relief)" />
    </>
  );
}

/* ============================ THE MEDAL ============================= */
/* One reusable struck coin: reeded edge, gradient face, raised rim, beaded
   border, circular raised inscription, relief art (children), a slow gleam
   sweep and a one-shot strike flash clipped to the field. */

function Medal({
  id,
  inscription,
  ariaLabel,
  className,
  beads = true,
  gleam = "26s",
  gleamRot = 0,
  strikeDelay = "0s",
  children,
}: {
  id: string;
  inscription: string;
  ariaLabel: string;
  className?: string;
  beads?: boolean;
  gleam?: string;
  gleamRot?: number;
  strikeDelay?: string;
  children: ReactNode;
}) {
  return (
    <svg viewBox="0 0 120 132" className={className} role="img" aria-label={ariaLabel}>
      <defs>
        <clipPath id={`${id}-field`}>
          <circle cx={MC} cy={MCY} r={43.5} />
        </clipPath>
        <path
          id={`${id}-legend`}
          d={`M ${MC} ${MCY - 36.5} A 36.5 36.5 0 1 1 ${MC - 0.1} ${MCY - 36.5}`}
          fill="none"
        />
      </defs>

      {/* drop shadow pooling on the velvet */}
      <ellipse cx={MC} cy={121} rx={42} ry={5.5} fill="#000" opacity=".55" filter="url(#lgm-f-soft)" />

      <g className="lgm-strike" style={{ "--d": strikeDelay, "--o": `${MC}px ${MCY}px` } as CSSProperties}>
        {/* reeded edge */}
        <circle cx={MC} cy={MCY} r={53} fill="#8a6418" />
        {MEDAL_REEDS.map((a) => (
          <rect
            key={a}
            x={MC - 0.55}
            y={MCY - 53}
            width={1.1}
            height={3.4}
            fill={SHADOW}
            transform={`rotate(${a} ${MC} ${MCY})`}
          />
        ))}
        {/* struck face */}
        <circle cx={MC} cy={MCY} r={50} fill="url(#lgm-g-face)" />
        {/* raised rim: bright crest + inner recess */}
        <circle cx={MC} cy={MCY} r={46.2} fill="none" stroke="url(#lgm-g-rim)" strokeWidth={1.8} />
        <circle cx={MC} cy={MCY} r={44.3} fill="none" stroke="#6b4c10" strokeWidth={0.9} opacity={0.85} />
        {/* beading */}
        {beads &&
          MEDAL_BEADS.map((b, i) => (
            <g key={i}>
              <circle cx={b.x + 0.3} cy={b.y + 0.5} r={1} fill="#6b4c10" />
              <circle cx={b.x} cy={b.y} r={1} fill={BRIGHT} />
            </g>
          ))}
        {/* circular inscription, raised caps with star stops */}
        <text
          fontFamily={SERIF}
          fontSize={6.6}
          letterSpacing={2.2}
          fill={SHADOW}
          transform="translate(.45 .75)"
          textAnchor="middle"
        >
          <textPath href={`#${id}-legend`} startOffset="50%">
            {inscription}
          </textPath>
        </text>
        <text fontFamily={SERIF} fontSize={6.6} letterSpacing={2.2} fill={PALE} textAnchor="middle">
          <textPath href={`#${id}-legend`} startOffset="50%">
            {inscription}
          </textPath>
        </text>

        {/* -------- relief motif -------- */}
        {children}

        {/* ambient gleam sweep + one-shot strike flash, clipped to the field */}
        <g clipPath={`url(#${id}-field)`}>
          <g transform={`rotate(${gleamRot} ${MC} ${MCY})`}>
            <g className="lgm-gleam" style={{ "--t": gleam, "--o": `${MC}px ${MCY}px` } as CSSProperties}>
              <rect x={MC - 9} y={MCY - 70} width={18} height={140} fill="url(#lgm-g-gleam)" />
            </g>
          </g>
          <rect
            className="lgm-flash"
            style={{ "--d": strikeDelay } as CSSProperties}
            x={MC - 24}
            y={MCY - 70}
            width={48}
            height={140}
            fill="url(#lgm-g-flash)"
          />
        </g>
      </g>
    </svg>
  );
}

/* ========================== HERO — THE HERMIT ======================== */
/* The card's Hermit scene, scaled into the medal field. */

const HERMIT_BODY =
  "M150 137 C163 141 170 153 169 168 C176 182 181 210 184 250 " +
  "C172 256 128 256 116 250 C119 210 124 182 131 168 C130 153 137 141 150 137 Z";

function HermitRelief() {
  return (
    <g transform={`translate(${MC} ${MCY}) scale(.48) translate(-150 -196)`}>
      <Relief d={HERMIT_BODY} />
      <Relief d="M183 166 L179 256" w={3.4} />
      <circle cx="183" cy="164" r="3" fill={BRIGHT} />
      {/* hood recess — face lost in shadow */}
      <ellipse cx="150" cy="170" rx="11" ry="9" fill={RECESS} />
      <path d="M141 174 A 11 9 0 0 0 159 176" stroke="#8a6418" strokeWidth="1" fill="none" opacity=".7" />
      {/* robe fold highlights, light from the upper-left */}
      <path d="M136 178 C133 200 130 226 128 246" stroke={PALE} strokeWidth="1.1" fill="none" opacity=".55" />
      <path d="M147 180 C146 205 145 228 144 248" stroke={PALE} strokeWidth=".9" fill="none" opacity=".4" />
      {/* raised lantern, upper-left */}
      <g transform="translate(1 1.6)" fill={SHADOW}>
        <path d="M118 148 L131 148 L131 163 L118 163 Z" />
        <path d="M118 148 A 6.5 5 0 0 1 131 148 Z" />
      </g>
      <g>
        <path d="M118 148 L131 148 L131 163 L118 163 Z" fill="url(#lgm-g-relief)" />
        <path d="M118 148 A 6.5 5 0 0 1 131 148 Z" fill={BRIGHT} />
        <circle cx="124.5" cy="144" r="2.2" fill="none" stroke="#e8c96a" strokeWidth="1.2" />
        <rect x="122" y="151" width="5" height="9" fill="#fff3c4" opacity=".85" />
      </g>
      {/* the gleam in the lantern */}
      <g className="lgm-pulse" transform="translate(124.5 155.5)">
        <path d={GLEAM_STAR} fill="#fff8dd" />
      </g>
    </g>
  );
}

/* ====================== SECTION RELIEF MOTIFS ======================= */
/* All drawn inside the medal field (r ≈ 30 around 60, 62). */

// BIRTH CHART — the wheel of fortune: rim, hub, eight spokes
const WHEEL_SPOKES = Array.from({ length: 8 }, (_, k) => {
  const t = k * 45 * DEG;
  return {
    x1: +(MC + 12 * Math.cos(t)).toFixed(1),
    y1: +(MCY + 12 * Math.sin(t)).toFixed(1),
    x2: +(MC + 23 * Math.cos(t)).toFixed(1),
    y2: +(MCY + 23 * Math.sin(t)).toFixed(1),
  };
});

function MotifWheel() {
  return (
    <>
      <circle cx={MC + 0.9} cy={MCY + 1.2} r={26} fill="none" stroke={SHADOW} strokeWidth={4.5} />
      <circle cx={MC} cy={MCY} r={26} fill="none" stroke="url(#lgm-g-relief)" strokeWidth={4.5} />
      <circle cx={MC + 0.7} cy={MCY + 1} r={9} fill="none" stroke={SHADOW} strokeWidth={2.4} />
      <circle cx={MC} cy={MCY} r={9} fill="none" stroke="url(#lgm-g-relief)" strokeWidth={2.4} />
      {WHEEL_SPOKES.map((s, i) => (
        <Relief key={i} d={`M ${s.x1} ${s.y1} L ${s.x2} ${s.y2}`} w={1.8} />
      ))}
      {WHEEL_SPOKES.map((s, i) => (
        <circle
          key={i}
          cx={MC + 26 * Math.cos(i * 45 * DEG)}
          cy={MCY + 26 * Math.sin(i * 45 * DEG)}
          r={1.6}
          fill={BRIGHT}
        />
      ))}
      <circle cx={MC} cy={MCY} r={2.4} fill={SHADOW} transform="translate(.5 .8)" />
      <circle cx={MC} cy={MCY} r={2.4} fill={BRIGHT} />
    </>
  );
}

// DAILY HOROSCOPE — sun disc with rays, a thin crescent, two field stars
const SUN_RAYS = Array.from({ length: 8 }, (_, k) => {
  const t = (k * 45 + 22) * DEG;
  return {
    x1: +(46 + 12.5 * Math.cos(t)).toFixed(1),
    y1: +(60 + 12.5 * Math.sin(t)).toFixed(1),
    x2: +(46 + 18.5 * Math.cos(t)).toFixed(1),
    y2: +(60 + 18.5 * Math.sin(t)).toFixed(1),
  };
});

function MotifSunMoon() {
  return (
    <>
      <circle cx={46.9} cy={61.2} r={9} fill={SHADOW} />
      <circle cx={46} cy={60} r={9} fill="url(#lgm-g-relief)" />
      {SUN_RAYS.map((s, i) => (
        <Relief key={i} d={`M ${s.x1} ${s.y1} L ${s.x2} ${s.y2}`} w={1.7} />
      ))}
      <circle cx={46} cy={60} r={3} fill={PALE} opacity=".8" />
      {/* crescent: convex outer edge, shallow inner curve */}
      <Relief d="M 74 55 A 12 12 0 0 0 74 77 A 30 30 0 0 0 74 55 Z" />
      <path d={GLEAM_STAR} transform="translate(78 44) scale(.8)" fill={BRIGHT} />
      <path d={GLEAM_STAR} transform="translate(38 79) scale(.55)" fill={BRIGHT} opacity=".8" />
    </>
  );
}

// COMPATIBILITY — two classical profiles, face to face
const FACE_PATH =
  "M 42 41 C 45.5 40.5 47.8 42.8 48.2 46.5 L 48.4 48.5 " +
  "C 49.8 49.6 51 51.2 51.4 52.8 L 48.2 53.8 " +
  "C 49.2 54.6 49.8 55.4 49.5 56.4 L 48.3 57 " +
  "C 49.2 57.7 49.4 58.8 48.8 60.2 " +
  "C 47.6 62.4 45.2 63.8 43.6 64.4 L 44.2 70 " +
  "C 47.4 71.4 50.4 73.4 52.4 76.5 L 30.5 76.5 " +
  "C 31.5 72.5 33.4 70.4 35 68.8 L 35.4 64.4 " +
  "C 31.8 60.4 30.4 54.4 31.4 48.6 " +
  "C 32.4 43.6 36.6 40.8 42 41 Z";

function MotifFaces() {
  return (
    <g transform={`translate(${MC} ${MCY}) scale(.86) translate(-${MC} -${MCY})`}>
      <Relief d={FACE_PATH} />
      <g transform="matrix(-1 0 0 1 120 0)">
        <Relief d={FACE_PATH} />
      </g>
      {/* the spark between them */}
      <g className="lgm-pulse" transform={`translate(${MC} 42)`}>
        <path d={GLEAM_STAR} fill={SHADOW} transform="translate(.5 .8)" />
        <path d={GLEAM_STAR} fill="#fff8dd" />
      </g>
      <circle cx={MC} cy={MCY + 17} r={1.4} fill={BRIGHT} />
    </g>
  );
}

// TAROT — two cards fanned, a four-point star on the face of the front one
function MotifCards() {
  return (
    <g transform={`translate(${MC} ${MCY}) scale(.85) translate(-${MC} -${MCY})`}>
      <g transform="rotate(-13 56 62)">
        <rect x={42.9} y={40.3} width={30} height={44} rx={2.5} fill={SHADOW} />
        <rect x={42} y={39} width={30} height={44} rx={2.5} fill="url(#lgm-g-relief)" />
        <rect x={45.5} y={42.5} width={23} height={37} rx={1.5} fill="none" stroke={SHADOW} strokeWidth={.9} opacity=".7" />
      </g>
      <g transform="rotate(9 66 64)">
        <rect x={52.9} y={42.3} width={30} height={44} rx={2.5} fill={SHADOW} />
        <rect x={52} y={41} width={30} height={44} rx={2.5} fill="url(#lgm-g-relief)" />
        <rect x={55.5} y={44.5} width={23} height={37} rx={1.5} fill="none" stroke={SHADOW} strokeWidth={.9} opacity=".7" />
        <path d={GLEAM_STAR} transform="translate(67.7 63.9) scale(2)" fill={SHADOW} />
        <g className="lgm-pulse" transform="translate(67 63)">
          <path d={GLEAM_STAR} transform="scale(2)" fill="#fff8dd" />
        </g>
        <circle cx={60} cy={49} r={1.1} fill={RECESS} />
        <circle cx={74} cy={77} r={1.1} fill={RECESS} />
      </g>
    </g>
  );
}

// PSYCHOLOGY — a profile head, small stars rising from the crown
function MotifHead() {
  return (
    <g transform={`translate(${MC} ${MCY + 2}) scale(.8) translate(-${MC} -${MCY})`}>
      <Relief d={FACE_PATH} />
      <path d={GLEAM_STAR} transform="translate(41 37) scale(.9)" fill={SHADOW} />
      <path d={GLEAM_STAR} transform="translate(40.4 36) scale(.9)" fill={BRIGHT} />
      <path d={GLEAM_STAR} transform="translate(49 30) scale(.65)" fill={SHADOW} />
      <path d={GLEAM_STAR} transform="translate(48.5 29.2) scale(.65)" fill={BRIGHT} />
      <path d={GLEAM_STAR} transform="translate(56 24) scale(.45)" fill={SHADOW} />
      <path d={GLEAM_STAR} transform="translate(55.6 23.3) scale(.45)" fill={BRIGHT} />
      {/* the eye — a single recessed point */}
      <circle cx={43.5} cy={49} r={1.2} fill={RECESS} />
    </g>
  );
}

// COSMIC PASSPORT — a plaque with a struck seal and engraved lines
function MotifPassport() {
  return (
    <g transform={`translate(${MC} ${MCY}) scale(.9) translate(-${MC} -${MCY})`}>
      <rect x={37.9} y={42.2} width={46} height={42} rx={3} fill={SHADOW} />
      <rect x={37} y={41} width={46} height={42} rx={3} fill="url(#lgm-g-relief)" />
      <rect x={40.5} y={44.5} width={39} height={35} rx={2} fill="none" stroke={SHADOW} strokeWidth={.9} opacity=".7" />
      {/* seal */}
      <circle cx={MC + 0.6} cy={MCY - 4.8} r={8} fill="none" stroke={SHADOW} strokeWidth={1.8} />
      <circle cx={MC} cy={MCY - 5.5} r={8} fill="none" stroke={PALE} strokeWidth={1.8} />
      <g className="lgm-pulse" transform={`translate(${MC} ${MCY - 5.5})`}>
        <path d={GLEAM_STAR} transform="translate(.6 .9) scale(1.1)" fill={RECESS} />
        <path d={GLEAM_STAR} transform="scale(1.1)" fill="#fff8dd" />
      </g>
      {/* engraved lines + corner studs */}
      <Relief d={`M 46 ${MCY + 10} L 74 ${MCY + 10}`} w={1.1} />
      <Relief d={`M 49 ${MCY + 14.5} L 71 ${MCY + 14.5}`} w={.9} />
      {[
        [43, 47],
        [77, 47],
        [43, 77],
        [77, 77],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={1} fill={RECESS} />
      ))}
    </g>
  );
}

/* ======================== DESTINY MATRIX DATA ======================= */

const DM_PTS = Array.from({ length: 8 }, (_, k) => {
  const t = (k * 45 - 90) * DEG;
  return {
    x: +(MC + 23 * Math.cos(t)).toFixed(1),
    y: +(MCY + 23 * Math.sin(t)).toFixed(1),
  };
});
const DM_SQUARE_A = [0, 2, 4, 6].map((k) => DM_PTS[k]);
const DM_SQUARE_B = [1, 3, 5, 7].map((k) => DM_PTS[k]);

function MotifOctagram() {
  return (
    <>
      {DM_PTS.map((p, i) => (
        <Relief key={i} d={`M ${MC} ${MCY} L ${p.x} ${p.y}`} w={0.9} />
      ))}
      <Relief
        d={`M ${DM_SQUARE_A.map((p) => `${p.x} ${p.y}`).join(" L ")} Z`}
        w={1.5}
      />
      <Relief
        d={`M ${DM_SQUARE_B.map((p) => `${p.x} ${p.y}`).join(" L ")} Z`}
        w={1.5}
      />
      {DM_PTS.map((p, i) => (
        <g key={i}>
          <circle cx={p.x + 0.5} cy={p.y + 0.8} r={2.6} fill={SHADOW} />
          <circle cx={p.x} cy={p.y} r={2.6} fill="url(#lgm-g-relief)" />
        </g>
      ))}
      <circle cx={MC + 0.8} cy={MCY + 1.1} r={6.5} fill={SHADOW} />
      <circle cx={MC} cy={MCY} r={6.5} fill="url(#lgm-g-relief)" />
      <g className="lgm-pulse" transform={`translate(${MC} ${MCY})`}>
        <path d={GLEAM_STAR} transform="scale(.9)" fill="#fff8dd" />
      </g>
    </>
  );
}

/* ============================ SIGN COIN ============================= */

function SignCoin({ g, n, d, delay }: { g: string; n: string; d: string; delay: string }) {
  const uid = n.toLowerCase();
  return (
    <svg viewBox="0 0 100 104" className="h-auto w-full" role="img" aria-label={`${n}, ${d}`}>
      <defs>
        <path id={`lgm-sa-${uid}`} d="M 20.5 48 A 29.5 29.5 0 0 1 79.5 48" fill="none" />
        <path id={`lgm-sb-${uid}`} d="M 20.5 48 A 29.5 29.5 0 0 0 79.5 48" fill="none" />
      </defs>
      <ellipse cx={50} cy={98} rx={32} ry={4} fill="#000" opacity=".5" filter="url(#lgm-f-soft)" />
      <g className="lgm-strike" style={{ "--d": delay, "--o": "50px 48px" } as CSSProperties}>
        <circle cx={50} cy={48} r={42} fill="#8a6418" />
        {SIGN_REEDS.map((a) => (
          <rect
            key={a}
            x={49.6}
            y={6}
            width={0.8}
            height={2.6}
            fill={SHADOW}
            transform={`rotate(${a} 50 48)`}
          />
        ))}
        <circle cx={50} cy={48} r={39.5} fill="url(#lgm-g-face)" />
        <circle cx={50} cy={48} r={36} fill="none" stroke="url(#lgm-g-rim)" strokeWidth={1.4} />
        <circle cx={50} cy={48} r={34.5} fill="none" stroke="#6b4c10" strokeWidth={0.7} opacity={0.85} />
        {/* name on the upper rim arc */}
        <text fontFamily={SERIF} fontSize={6.8} letterSpacing={1.5} fill={SHADOW} transform="translate(.4 .65)" textAnchor="middle">
          <textPath href={`#lgm-sa-${uid}`} startOffset="50%">
            {n.toUpperCase()}
          </textPath>
        </text>
        <text fontFamily={SERIF} fontSize={6.8} letterSpacing={1.5} fill={PALE} textAnchor="middle">
          <textPath href={`#lgm-sa-${uid}`} startOffset="50%">
            {n.toUpperCase()}
          </textPath>
        </text>
        {/* dates on the lower rim arc */}
        <text fontFamily={SERIF} fontSize={5} letterSpacing={1.1} fill={SHADOW} transform="translate(.35 .6)" textAnchor="middle">
          <textPath href={`#lgm-sb-${uid}`} startOffset="50%">
            {d.toUpperCase()}
          </textPath>
        </text>
        <text fontFamily={SERIF} fontSize={5} letterSpacing={1.1} fill={PALE} textAnchor="middle">
          <textPath href={`#lgm-sb-${uid}`} startOffset="50%">
            {d.toUpperCase()}
          </textPath>
        </text>
        {/* relief glyph at the heart of the coin */}
        <text x={50.6} y={61} textAnchor="middle" fontFamily={GLYPH_FONT} fontSize={23} fill={SHADOW}>
          {g}
        </text>
        <text x={50} y={60} textAnchor="middle" fontFamily={GLYPH_FONT} fontSize={23} fill="url(#lgm-g-relief)">
          {g}
        </text>
      </g>
    </svg>
  );
}

/* ============================== CONTENT ============================= */

const SECTIONS = [
  {
    no: "I",
    tag: "FREE",
    title: "Birth Chart",
    desc: "Map your Sun, Moon, and Rising — the foundation of every reading.",
    href: "/birth-chart",
    inscription: "★ SOL ★ LVNA ★ ASCENDENS ★",
    motif: <MotifWheel />,
    size: 210,
    gleam: "24s",
    rot: 0,
    label: "A wheel of fortune struck with eight spokes and studded rim",
  },
  {
    no: "II",
    tag: "DAILY",
    title: "Daily Horoscope",
    desc: "Twelve signs, one sky. Clear forecasts without the fluff.",
    href: "/horoscope",
    inscription: "★ DIES ★ CAELVM ★ SIGNA ★",
    motif: <MotifSunMoon />,
    size: 168,
    gleam: "31s",
    rot: 40,
    label: "A sun disc with rays beside a thin crescent moon",
  },
  {
    no: "III",
    tag: "SYNASTRY",
    title: "Compatibility",
    desc: "Zodiac match, Chinese pairs, and deep synastry for two charts.",
    href: "/compatibility",
    inscription: "★ DVAE ★ ANIMAE ★ VNVM ★",
    motif: <MotifFaces />,
    size: 190,
    gleam: "27s",
    rot: 80,
    label: "Two classical profiles struck face to face",
  },
  {
    no: "IV",
    tag: "SPREADS",
    title: "Tarot",
    desc: "Daily card to Celtic Cross — pull, reflect, get a full reading.",
    href: "/tarot",
    inscription: "★ ARCANA ★ SORTES ★ VERITAS ★",
    motif: <MotifCards />,
    size: 172,
    gleam: "35s",
    rot: 15,
    label: "Two tarot cards fanned, a star on the face of the front one",
  },
  {
    no: "V",
    tag: "TESTS",
    title: "Psychology",
    desc: "MBTI, Big Five, empathy and more — meet yourself beyond the signs.",
    href: "/psychology",
    inscription: "★ NOSCE ★ TE ★ IPSVM ★",
    motif: <MotifHead />,
    size: 200,
    gleam: "29s",
    rot: 55,
    label: "A profile head with small stars rising from the crown",
  },
  {
    no: "VI",
    tag: "YOU",
    title: "Cosmic Passport",
    desc: "Your Cosmic ID, people, journal, and Premium deep dives — one hub.",
    href: "/passport",
    inscription: "★ VNA ★ DOMVS ★ ASTRORVM ★",
    motif: <MotifPassport />,
    size: 160,
    gleam: "33s",
    rot: 100,
    label: "A passport plaque with a struck seal and engraved lines",
  },
];

const FAQS = [
  {
    n: "I",
    q: "What can I do on Astro Scope for free?",
    a: "Cast a free birth chart, read daily horoscopes for all twelve signs, pull tarot spreads, run compatibility and psychology tests — no account.",
  },
  {
    n: "II",
    q: "How do I get my free birth chart?",
    a: "Open the calculator, enter birth date, time and place, generate — your wheel in seconds.",
  },
  {
    n: "III",
    q: "Where are daily horoscopes?",
    a: "Every sign from the homepage grid or the Horoscopes hub.",
  },
  {
    n: "IV",
    q: "What is the Destiny Matrix?",
    a: "Optional birth-date octagram mapping purpose, love, money and age themes.",
  },
];

const SCREW_POS = ["left-2 top-2", "right-2 top-2", "left-2 bottom-2", "right-2 bottom-2"];

/* ================================ PAGE ============================== */

export default function GoldMedallionLanding() {
  return (
    <div className="lgm-root relative isolate min-h-screen">
      <style>{`
        .lgm-root { background: #0a0806; color: #f0e9d8; font-family: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif; }
        .lgm-root ::selection { background: rgba(201,162,39,.3); color: #f6e5b8; }
        .lgm-serif { font-family: Georgia, 'Times New Roman', serif; }
        .lgm-rule { height: 1px; background: linear-gradient(90deg, transparent, rgba(201,162,39,.5), transparent); }

        /* buttons */
        .lgm-btn-primary { display: inline-block; background: linear-gradient(180deg, #f7e08e 0%, #d9b64a 48%, #a67c1c 100%); color: #241a06; border: 1px solid #8a6418; border-radius: 9999px; box-shadow: inset 0 1px 0 rgba(255,246,216,.8), inset 0 -2px 0 rgba(90,66,30,.6), 0 14px 30px -14px rgba(217,182,74,.55); transition: filter .35s ease, box-shadow .35s ease; }
        .lgm-btn-primary:hover { filter: brightness(1.08); box-shadow: inset 0 1px 0 rgba(255,246,216,.8), inset 0 -2px 0 rgba(90,66,30,.6), 0 18px 36px -12px rgba(217,182,74,.7); }
        .lgm-btn-ghost { display: inline-block; border: 1px solid rgba(201,162,39,.45); border-radius: 9999px; color: #ecd27e; transition: border-color .35s ease, background .35s ease; }
        .lgm-btn-ghost:hover { border-color: rgba(241,212,124,.85); background: rgba(201,162,39,.07); }

        /* the velvet display tray for the sign coins */
        .lgm-tray { position: relative; background: radial-gradient(130% 150% at 50% 0%, #17110a 0%, #0d0a07 55%, #070504 100%); border: 1px solid rgba(201,162,39,.28); border-radius: 6px; box-shadow: inset 0 1px 0 rgba(246,221,141,.07), inset 0 16px 48px rgba(0,0,0,.78), inset 0 0 0 1px rgba(0,0,0,.55), 0 34px 64px -32px rgba(0,0,0,.9); }
        .lgm-tray-edge { position: absolute; inset: 7px; border: 1px solid rgba(201,162,39,.14); border-radius: 3px; pointer-events: none; }

        /* sign coins lift out of the tray on hover */
        .lgm-coin { display: block; transition: transform .5s cubic-bezier(.22,.7,.3,1); }
        .lgm-coin:hover { transform: translateY(-4px); }
        .lgm-coin svg { transition: filter .5s ease; }
        .lgm-coin:hover svg { filter: brightness(1.12) drop-shadow(0 12px 18px rgba(0,0,0,.65)); }

        /* museum shelf: a hairline with a shadow bleeding down the velvet */
        .lgm-shelf { height: 2px; background: linear-gradient(90deg, transparent 1%, rgba(246,221,141,.4) 18%, rgba(160,124,62,.55) 50%, rgba(246,221,141,.4) 82%, transparent 99%); box-shadow: 0 1px 0 rgba(0,0,0,.8), 0 16px 24px -8px rgba(0,0,0,.8); }
        .lgm-medalwrap { transition: transform .6s cubic-bezier(.22,.7,.3,1); }
        .lgm-exhibit:hover .lgm-medalwrap { transform: translateY(-6px); }
        .lgm-exhibit:hover .lgm-link { color: #f6dd8d; }
        .lgm-link { color: #ecd27e; transition: color .3s ease; }

        /* engraved plaques */
        .lgm-plaque { background: linear-gradient(180deg, #15100a 0%, #0d0a06 100%); border: 1px solid rgba(201,162,39,.32); box-shadow: inset 0 1px 0 rgba(246,221,141,.06), inset 0 0 0 3px #0d0a06, inset 0 0 0 4px rgba(201,162,39,.16), 0 22px 44px -22px rgba(0,0,0,.85); transition: border-color .4s ease, transform .4s ease; }
        .lgm-plaque:hover { border-color: rgba(241,212,124,.55); transform: translateY(-2px); }
        .lgm-screw { position: absolute; width: 6px; height: 6px; border-radius: 9999px; background: radial-gradient(circle at 35% 30%, #f6dd8d 0%, #a67c1c 52%, #4a330a 100%); box-shadow: inset 0 -1px 1px rgba(0,0,0,.7); }
        .lgm-engraved { text-shadow: 0 -1px 0 rgba(0,0,0,.85), 0 1px 0 rgba(246,221,141,.1); }
        .lgm-seal { display: flex; align-items: center; justify-content: center; border-radius: 9999px; background: radial-gradient(circle at 38% 30%, #f7e08e 0%, #d9b64a 48%, #a67c1c 82%, #7c5a12 100%); color: #241a06; box-shadow: inset 0 1px 0 rgba(255,246,216,.7), inset 0 -1px 0 rgba(90,66,30,.6), 0 6px 14px -6px rgba(0,0,0,.8); }

        /* nav */
        .lgm-nav-link { transition: color .3s ease; }
        .lgm-nav-link:hover { color: #ecd27e; }

        /* ------- load: the strike ------- */
        .lgm-strike { transform-box: view-box; transform-origin: var(--o, 60px 62px); animation: lgm-press .8s cubic-bezier(.3,.9,.3,1) backwards; animation-delay: var(--d, 0s); }
        .lgm-flash { animation: lgm-flash-sweep .9s ease-out backwards; animation-delay: calc(var(--d, 0s) + .14s); }
        .lgm-rise { animation: lgm-rise .9s cubic-bezier(.22,.7,.3,1) backwards; animation-delay: var(--d, 0s); }
        .lgm-fade { animation: lgm-fade-in 1s ease-out backwards; animation-delay: var(--d, 0s); }

        /* ------- ambient: slow, restrained ------- */
        .lgm-gleam { transform-box: view-box; transform-origin: var(--o, 60px 62px); animation: lgm-spin var(--t, 28s) linear infinite; }
        .lgm-pulse { transform-box: fill-box; transform-origin: center; animation: lgm-pulse 15s ease-in-out infinite; }
        .lgm-breathe { animation: lgm-breathe var(--t, 22s) ease-in-out infinite; }
        .lgm-tw1 { animation: lgm-twinkle 15s ease-in-out infinite; }
        .lgm-tw2 { animation: lgm-twinkle 19s ease-in-out infinite 3.2s; }
        .lgm-tw3 { animation: lgm-twinkle 24s ease-in-out infinite 5.6s; }
        .lgm-drift { animation: lgm-drift var(--t, 120s) ease-in-out infinite alternate; }
        .lgm-sweep { position: absolute; top: -60vh; bottom: -60vh; left: 0; width: 34vw; background: linear-gradient(90deg, transparent, rgba(255,240,200,.05), transparent); animation: lgm-sweep 130s linear infinite; }
        .lgm-mega-rot { transform-box: view-box; transform-origin: 500px 500px; animation: lgm-spin 150s linear infinite; }

        @keyframes lgm-press { 0% { opacity: 0; transform: scale(1.07); } 45% { opacity: 1; transform: scale(1.035); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes lgm-flash-sweep { 0% { opacity: 0; transform: translateX(-110px); } 25% { opacity: .85; } 100% { opacity: 0; transform: translateX(110px); } }
        @keyframes lgm-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes lgm-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lgm-spin { to { transform: rotate(360deg); } }
        @keyframes lgm-pulse { 0%, 100% { opacity: .55; transform: scale(.85); } 50% { opacity: 1; transform: scale(1.12); } }
        @keyframes lgm-breathe { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }
        @keyframes lgm-twinkle { 0%, 100% { opacity: .1; } 50% { opacity: .75; } }
        @keyframes lgm-drift { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(-2.5%, 2%, 0); } }
        @keyframes lgm-sweep { from { transform: translateX(-50vw) rotate(16deg); } to { transform: translateX(190vw) rotate(16deg); } }

        @media (prefers-reduced-motion: reduce) {
          .lgm-strike, .lgm-flash, .lgm-rise, .lgm-fade,
          .lgm-gleam, .lgm-pulse, .lgm-breathe,
          .lgm-tw1, .lgm-tw2, .lgm-tw3, .lgm-drift, .lgm-sweep, .lgm-mega-rot {
            animation: none;
          }
          .lgm-flash { opacity: 0; }
        }
      `}</style>

      {/* velvet ground: deep vignette, drifting warmth, gold dust, a very slow
          diagonal light sweep, and a giant watermark medallion down below */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-[radial-gradient(140%_100%_at_50%_-20%,#1a1209_0%,#0a0806_50%,#050403_100%)]" aria-hidden="true">
        <div
          className="lgm-drift absolute -left-[10vmax] -top-[16vmax] h-[55vmax] w-[55vmax] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(201,162,39,.08) 0%, transparent 65%)", "--t": "115s" } as CSSProperties}
        />
        <div
          className="lgm-drift absolute -bottom-[22vmax] right-[-8vmax] h-[60vmax] w-[60vmax] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(140,96,30,.07) 0%, transparent 65%)", "--t": "140s" } as CSSProperties}
        />
        <div className="lgm-sweep" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
          <rect width="1600" height="1000" filter="url(#lgm-f-grain)" opacity="0.05" />
          {DUST.map((s, i) => (
            <circle key={i} className={`lgm-tw${s.g + 1}`} cx={s.x} cy={s.y} r={s.r} fill={PALE} opacity={s.o} />
          ))}
        </svg>
        <svg
          className="absolute opacity-[.05]"
          style={{ width: "135vmin", height: "135vmin", right: "-38vmin", top: "52vh" }}
          viewBox="0 0 1000 1000"
        >
          <g className="lgm-mega-rot">
            <circle cx="500" cy="500" r="492" fill="none" stroke="#d9b64a" strokeWidth="2" />
            {MEGA_REEDS.map((a) => (
              <rect key={a} x="498.5" y="6" width="3" height="16" fill="#d9b64a" transform={`rotate(${a} 500 500)`} />
            ))}
            <circle cx="500" cy="500" r="440" fill="none" stroke="#d9b64a" strokeWidth="3" />
            <circle cx="500" cy="500" r="424" fill="none" stroke="#d9b64a" strokeWidth="1" />
            <circle cx="500" cy="500" r="300" fill="none" stroke="#d9b64a" strokeWidth="1" strokeDasharray="3 9" />
          </g>
        </svg>
      </div>

      {/* shared defs: objectBoundingBox gradients are reusable across every SVG on the page */}
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="lgm-g-face" cx="38%" cy="32%" r="85%">
            <stop offset="0%" stopColor="#f7e08e" />
            <stop offset="45%" stopColor="#d9b64a" />
            <stop offset="80%" stopColor="#a67c1c" />
            <stop offset="100%" stopColor="#7c5a12" />
          </radialGradient>
          <linearGradient id="lgm-g-relief" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fbeaa6" />
            <stop offset="50%" stopColor="#cfa62f" />
            <stop offset="100%" stopColor="#7c5a12" />
          </linearGradient>
          <linearGradient id="lgm-g-rim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffecae" />
            <stop offset="55%" stopColor="#c9a227" />
            <stop offset="100%" stopColor="#6b4c10" />
          </linearGradient>
          <linearGradient id="lgm-g-gleam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#fff6d8" stopOpacity=".26" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lgm-g-flash" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#fffdf0" stopOpacity=".8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id="lgm-f-soft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <filter id="lgm-f-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
      </svg>

      {/* ==================== TOP NAV ==================== */}
      <header>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="flex items-center gap-2.5">
            <svg viewBox="0 0 24 24" className="h-[20px] w-[20px]" aria-hidden="true">
              <circle cx="12" cy="12" r="10.4" fill="#8a6418" />
              {Array.from({ length: 24 }, (_, i) => (
                <rect key={i} x="11.75" y="1.6" width=".5" height="1.6" fill="#5e430d" transform={`rotate(${i * 15} 12 12)`} />
              ))}
              <circle cx="12" cy="12" r="8.6" fill="url(#lgm-g-face)" />
              <circle cx="12" cy="12" r="7" fill="none" stroke="url(#lgm-g-rim)" strokeWidth=".8" />
              <g className="lgm-pulse" transform="translate(12 12) scale(.72)">
                <path d={GLEAM_STAR} fill="#fff8dd" />
              </g>
            </svg>
            <span className="lgm-serif text-[13px] tracking-[0.38em] text-[#ecd27e]">ASTRO&nbsp;SCOPE</span>
          </a>
          <nav className="flex items-center gap-7 text-[11px] uppercase tracking-[0.22em] text-[#f0e9d8]/65">
            <a href="/horoscope" className="lgm-nav-link hidden sm:inline">Horoscopes</a>
            <a href="/tarot" className="lgm-nav-link hidden sm:inline">Tarot</a>
            <a href="/compatibility" className="lgm-nav-link hidden md:inline">Compatibility</a>
            <a href="/sign-in" className="lgm-nav-link rounded-full border border-[#8a6418]/60 px-3.5 py-1.5 text-[#ecd27e] hover:border-[#ecd27e]/70">Sign&nbsp;In</a>
          </nav>
        </div>
        <div className="lgm-rule" />
      </header>

      {/* ==================== HERO — THE STRIKE ==================== */}
      <section className="relative overflow-hidden">
        <div
          className="lgm-breathe pointer-events-none absolute -right-24 top-10 h-[520px] w-[620px] rounded-full blur-2xl"
          style={{ "--t": "26s", background: "radial-gradient(closest-side, rgba(217,182,74,.13), transparent 70%)" } as CSSProperties}
          aria-hidden="true"
        />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:py-24">
          <div>
            <p className="lgm-rise text-[11px] uppercase tracking-[0.34em] text-[#a67c1c]" style={{ "--d": ".1s" } as CSSProperties}>
              Struck for those who seek
            </p>
            <h1 className="lgm-rise lgm-serif mt-6 text-5xl leading-[1.08] text-[#f0e9d8] sm:text-6xl" style={{ "--d": ".25s" } as CSSProperties}>
              Your fate,
              <br />
              <em className="text-[#ecd27e]">struck in gold.</em>
            </h1>
            <p className="lgm-rise mt-6 max-w-md text-[15px] leading-relaxed text-[#f0e9d8]/60" style={{ "--d": ".45s" } as CSSProperties}>
              Free birth chart, daily horoscopes, synastry and tarot — a treasury struck from the sky.
            </p>
            <div className="lgm-rise mt-9 flex flex-wrap items-center gap-4" style={{ "--d": ".6s" } as CSSProperties}>
              <a href="/birth-chart" className="lgm-btn-primary lgm-serif px-7 py-3.5 text-[13px] font-bold uppercase tracking-[0.18em]">
                Cast your free birth chart
              </a>
              <a href="/horoscope" className="lgm-btn-ghost px-6 py-3.5 text-[12px] uppercase tracking-[0.2em]">
                Read today&rsquo;s horoscope&nbsp;&rarr;
              </a>
            </div>
            {/* assay marks */}
            <div className="lgm-rise mt-8 flex flex-wrap gap-2.5" style={{ "--d": ".75s" } as CSSProperties} aria-hidden="true">
              {[
                ["☉︎", "999 fine"],
                ["★", "no account"],
                ["☽︎", "struck in seconds"],
              ].map(([g, label]) => (
                <span
                  key={label}
                  className="flex items-center gap-2 rounded-full border border-[#8a6418]/50 bg-[rgba(201,162,39,.05)] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-[#ecd27e]/90 shadow-[inset_0_1px_2px_rgba(0,0,0,.6)]"
                >
                  <span className="text-[12px] leading-none" style={{ fontFamily: GLYPH_FONT }}>{g}</span>
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[540px]">
            <Medal
              id="lgm-hero"
              inscription="★ EREMITA ★ LVCEM ★ FERT ★"
              ariaLabel="A giant gold medallion struck with the relief of the Hermit carrying his lantern"
              className="h-auto w-full"
              gleam="30s"
              strikeDelay=".15s"
            >
              <HermitRelief />
            </Medal>
            {/* the collector's legend */}
            <div className="lgm-fade mt-2 text-center" style={{ "--d": "1s" } as CSSProperties}>
              <p className="lgm-serif text-[13px] tracking-[0.34em] text-[#c9a227]">IX&nbsp;&nbsp;·&nbsp;&nbsp;THE HERMIT</p>
              <p className="mt-1.5 text-[9.5px] uppercase tracking-[0.3em] text-[#8f7a3a]">avrum · 999 fine · mmxxvi</p>
            </div>
          </div>
        </div>
        <div className="lgm-rule" />
      </section>

      {/* ==================== SIGN TRAY — TWELVE COINS ==================== */}
      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <p className="text-center text-[11px] uppercase tracking-[0.34em] text-[#a67c1c]">Daily Horoscope</p>
        <h2 className="lgm-serif mt-4 text-center text-3xl text-[#f0e9d8] sm:text-4xl">Your sign, struck in gold</h2>
        <p className="mx-auto mt-4 max-w-md text-center text-[13.5px] leading-relaxed text-[#f0e9d8]/50">
          Twelve coins in the tray, struck one by one as you watch. Take yours — the forecast is read daily.
        </p>
        <div className="lgm-tray mt-12 px-5 py-8 sm:px-8 lg:mt-14 lg:px-12 lg:py-10">
          <span className="lgm-tray-edge" aria-hidden="true" />
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
            {SIGNS.map((s, i) => (
              <a key={s.n} href={`/horoscope/${s.n.toLowerCase()}`} className="lgm-coin" aria-label={`${s.n} horoscope, ${s.d}`}>
                <SignCoin g={s.g} n={s.n} d={s.d} delay={`${(0.2 + i * 0.08).toFixed(2)}s`} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== THE CABINET — SIX MEDALS ON SHELVES ==================== */}
      <section className="mx-auto max-w-6xl px-6 py-10 lg:py-16">
        <p className="text-center text-[11px] uppercase tracking-[0.34em] text-[#a67c1c]">The Cabinet</p>
        <h2 className="lgm-serif mt-4 text-center text-3xl text-[#f0e9d8] sm:text-4xl">Six medals, six doors into the sky</h2>
        <p className="mx-auto mt-4 max-w-lg text-center text-[13.5px] leading-relaxed text-[#f0e9d8]/50">
          A museum of instruments, each struck in low relief and set on velvet. Read the plaque beneath each medal.
        </p>
        {[SECTIONS.slice(0, 3), SECTIONS.slice(3)].map((row, ri) => (
          <div key={ri} className={`grid gap-y-14 sm:grid-cols-2 lg:grid-cols-3 ${ri === 0 ? "mt-14" : "mt-16"}`}>
            {row.map((s, si) => (
              <article key={s.title} className="lgm-exhibit flex flex-col items-center">
                <div className="flex w-full flex-col items-center">
                  <div className="flex h-[248px] items-end justify-center">
                    <div className="lgm-medalwrap" style={{ width: s.size }}>
                      <Medal
                        id={`lgm-ex-${s.no}`}
                        inscription={s.inscription}
                        ariaLabel={s.label}
                        className="h-auto w-full"
                        gleam={s.gleam}
                        gleamRot={s.rot}
                        strikeDelay={`${(0.15 + (ri * 3 + si) * 0.09).toFixed(2)}s`}
                      >
                        {s.motif}
                      </Medal>
                    </div>
                  </div>
                  <div className="lgm-shelf w-full" aria-hidden="true" />
                </div>
                <div className="mt-6 max-w-[280px] text-center">
                  <p className="text-[9.5px] uppercase tracking-[0.3em] text-[#8f7a3a]">
                    Exhibit&nbsp;Nº&nbsp;{s.no}&nbsp;&nbsp;·&nbsp;&nbsp;{s.tag}
                  </p>
                  <h3 className="lgm-serif mt-2.5 text-xl text-[#f0e9d8]">{s.title}</h3>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#f0e9d8]/60">{s.desc}</p>
                  <a href={s.href} className="lgm-link mt-4 inline-block text-[11px] uppercase tracking-[0.26em]">
                    Explore&nbsp;&rarr;
                  </a>
                </div>
              </article>
            ))}
          </div>
        ))}
      </section>

      {/* ==================== DESTINY MATRIX — COMMEMORATIVE ISSUE ==================== */}
      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative mx-auto w-full max-w-[400px]">
            <Medal
              id="lgm-destiny"
              inscription="★ MATRIX ★ FATI ★ OCTAGRAMMA ★"
              ariaLabel="A large commemorative medal struck with the octagram of the Destiny Matrix"
              className="h-auto w-full"
              gleam="38s"
              gleamRot={25}
              strikeDelay=".2s"
            >
              <MotifOctagram />
            </Medal>
            <div className="lgm-fade mt-2 text-center" style={{ "--d": ".9s" } as CSSProperties}>
              <p className="lgm-serif text-[12px] tracking-[0.32em] text-[#c9a227]">COMMEMORATIVE ISSUE</p>
              <p className="mt-1.5 text-[9.5px] uppercase tracking-[0.3em] text-[#8f7a3a]">octogramma · mmxxvi</p>
            </div>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#a67c1c]">Birth-Date Octagram</p>
            <h2 className="lgm-serif mt-4 text-3xl text-[#f0e9d8] sm:text-4xl">The Destiny Matrix</h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#f0e9d8]/60">
              An optional birth-date octagram tool. It maps purpose, love, money, and age themes from your birth date.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Purpose", "Love", "Money", "Age themes"].map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-[#8a6418]/50 bg-[rgba(201,162,39,.05)] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-[#ecd27e]/90 shadow-[inset_0_1px_2px_rgba(0,0,0,.6)]"
                >
                  {c}
                </span>
              ))}
            </div>
            <a href="/destiny-matrix" className="lgm-btn-ghost mt-8 px-6 py-3 text-[12px] uppercase tracking-[0.2em]">
              Open Destiny Matrix&nbsp;&rarr;
            </a>
          </div>
        </div>
      </section>

      {/* ==================== FAQ — ENGRAVED PLAQUES ==================== */}
      <section className="mx-auto max-w-5xl px-6 py-16 lg:py-20">
        <p className="text-center text-[11px] uppercase tracking-[0.34em] text-[#a67c1c]">Inquiries</p>
        <h2 className="lgm-serif mt-4 text-center text-3xl text-[#f0e9d8] sm:text-4xl">Questions, engraved and answered</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {FAQS.map((f) => (
            <article key={f.n} className="lgm-plaque relative p-7">
              {SCREW_POS.map((pos) => (
                <span key={pos} className={`lgm-screw ${pos}`} aria-hidden="true" />
              ))}
              <div className="flex items-center gap-4">
                <span className="lgm-seal lgm-serif h-9 w-9 shrink-0 text-[13px] font-bold">{f.n}</span>
                <h3 className="lgm-serif lgm-engraved text-lg leading-snug text-[#ecd27e]">{f.q}</h3>
              </div>
              <div className="mt-4 flex items-center gap-3" aria-hidden="true">
                <span className="lgm-rule flex-1" />
                <svg viewBox="0 0 14 14" className="h-2.5 w-2.5">
                  <path d={GLEAM_STAR} transform="translate(7 7) scale(.9)" fill="#c9a227" />
                </svg>
                <span className="lgm-rule flex-1" />
              </div>
              <p className="mt-4 text-[13.5px] leading-relaxed text-[#f0e9d8]/60">{f.a}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ==================== CTA BAND ==================== */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center lg:py-28">
        <div className="flex items-center justify-center gap-4">
          <span className="lgm-rule w-20 sm:w-28" />
          <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" aria-hidden="true">
            <g className="lgm-pulse">
              <path d={GLEAM_STAR} transform="translate(7 7)" fill="#ecd27e" />
            </g>
          </svg>
          <span className="lgm-rule w-20 sm:w-28" />
        </div>
        <h2 className="lgm-serif mt-8 text-3xl leading-snug text-[#f0e9d8] sm:text-4xl">
          Your chart is written in the stars.
          <br />
          Come read it.
        </h2>
        <a href="/sign-up" className="lgm-btn-primary lgm-serif mt-10 px-8 py-4 text-[13px] font-bold uppercase tracking-[0.18em]">
          Get started — it&rsquo;s free
        </a>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer>
        <div className="lgm-rule" />
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="lgm-serif text-[12px] tracking-[0.34em] text-[#ecd27e]">ASTRO&nbsp;SCOPE</p>
              <p className="mt-2 text-[12px] text-[#f0e9d8]/45">Astro Scope — your daily cosmic guidance.</p>
            </div>
            <nav className="flex flex-wrap gap-x-7 gap-y-2 text-[11px] uppercase tracking-[0.2em] text-[#f0e9d8]/60">
              <a href="/birth-chart" className="lgm-nav-link">Birth Chart</a>
              <a href="/horoscope" className="lgm-nav-link">Horoscopes</a>
              <a href="/tarot" className="lgm-nav-link">Tarot</a>
              <a href="/pricing" className="lgm-nav-link">Pricing</a>
            </nav>
          </div>
          <p className="mt-8 text-[10px] uppercase tracking-[0.18em] text-[#f0e9d8]/30">&copy; 2026 Astro Scope</p>
        </div>
      </footer>
    </div>
  );
}
