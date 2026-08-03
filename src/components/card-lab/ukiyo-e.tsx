/**
 * Card Lab — UKIYO-E
 * Edo-period woodblock print take on the Major Arcana, in the manner of
 * Hokusai / Hiroshige. Flat unmodulated color blocks with crisp key-block
 * (sumi) outlines: gradient night sky with a bokashi band at top,
 * outline-only stylized clouds, a jagged peak, the wanderer in layered
 * robes, a glowing paper lantern with a small six-pointed star, a bamboo
 * staff, and pine-needle clusters. Vertical red hanko seal with the roman
 * numeral top-right; tall title cartouche with the card name set vertically
 * on the right edge. Cream washi ground, double keyline frame.
 *
 * Reusable: `{ number = 9, name = "THE HERMIT", variant = 0 }`.
 * With no props it renders THE HERMIT (IX) exactly as the original card.
 * `variant` (0-7) selects one of four color schemes, mirrored for 4-7.
 *
 * Signature effects (CSS-only, server-component safe, always on):
 *  - a shooting star streaks diagonally across the night sky every ~8s;
 *  - pine needle clusters rustle around their branch points, staggered;
 *  - outline cloud / mist bands drift sideways, alternating directions;
 *  - the paper lantern sways gently from its hang point;
 *  - on hover the bokashi sky band shimmers and the sparkles twinkle faster.
 * All motion is guarded by prefers-reduced-motion.
 */

import { toRoman } from "@/lib/roman";

const INK = "#16130f";
const CREAM = "#f4ecd8";
const OCHRE = "#e0a437";
const BAMBOO = "#c79a4e";
const VERMILION = "#b3342a";
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
  /** Major Arcana number 1-22, rendered as a roman numeral in the hanko seal. */
  number?: number;
  /** Card name, set vertically in the right-edge cartouche (auto-sized to fit). */
  name?: string;
  /** 0-7: palette = variant % 4, composition mirrored for variant >= 4. */
  variant?: number;
}

/** Fan of short needle strokes — a pine cluster that rustles on its branch. */
function pineCluster(cx: number, cy: number, scale: number, key: string, delay: string) {
  const angles = [-75, -45, -15, 15, 45, 75];
  return (
    <g
      key={key}
      className="cl-uke-pine"
      style={{ transformOrigin: `${cx}px ${cy}px`, animationDelay: delay }}
    >
      {angles.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const len = 7 * scale;
        return (
          <line
            key={`${key}-${deg}`}
            x1={cx}
            y1={cy}
            x2={cx + Math.sin(rad) * len}
            y2={cy - Math.cos(rad) * len}
            stroke={INK}
            strokeWidth={1.1 * scale}
            strokeLinecap="round"
          />
        );
      })}
      {/* Cluster core */}
      <circle cx={cx} cy={cy} r={1.4 * scale} fill={INK} />
    </g>
  );
}

/** Flat-bottomed stylized cloud, drawn outline-only (no fill). */
function outlineCloud(d: string, width: number, key: string, className: string) {
  return (
    <path
      key={key}
      className={className}
      d={d}
      fill="none"
      stroke={CREAM}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={0.9}
    />
  );
}

/** Tiny four-point sky sparkle; twinkle paced per-sparkle via delay. */
function sparkle(cx: number, cy: number, r: number, key: string, delay: string) {
  return (
    <path
      key={key}
      className="cl-uke-sparkle"
      style={{ animationDelay: delay }}
      d={`M${cx},${cy - r} L${cx + r * 0.28},${cy - r * 0.28} L${cx + r},${cy} L${cx + r * 0.28},${cy + r * 0.28} L${cx},${cy + r} L${cx - r * 0.28},${cy + r * 0.28} L${cx - r},${cy} L${cx - r * 0.28},${cy - r * 0.28} Z`}
      fill={CREAM}
      opacity={0.85}
    />
  );
}

export default function UkiyoECard({ number = 9, name = "THE HERMIT", variant = 0 }: UkiyoECardProps) {
  const v = ((variant % 8) + 8) % 8;
  const mirror = v >= 4;
  const pal = PALETTES[v % 4];
  // Deterministic per-variant scatter for the sky decorations (0 for variant 0).
  const shift = (v * 11) % 13;

  // Gradient ids must be unique per variant so gallery siblings don't share defs.
  const skyId = `cl-uke-sky-${v}`;
  const bokashiId = `cl-uke-bokashi-${v}`;
  const glowId = `cl-uke-glow-${v}`;

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
      style={{
        aspectRatio: "2/3",
        width: "100%",
        margin: 0,
        background: CREAM,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        .cl-uke-root svg { display: block; width: 100%; height: 100%; }
        .cl-uke-shimmer {
          position: absolute;
          left: 4.5%; right: 4.5%; top: 3%; height: 15.5%;
          background: linear-gradient(180deg, rgba(10,18,38,0.5), rgba(10,18,38,0));
          background-size: 100% 220%;
          background-position: 0% 0%;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: no-preference) {
          .cl-uke-glow { animation: cl-uke-breathe 3.8s ease-in-out infinite; }
          @keyframes cl-uke-breathe {
            0%, 100% { opacity: 0.85; }
            50% { opacity: 1; }
          }
          /* Shooting star: quick diagonal streak + fade, once per cycle */
          .cl-uke-shoot {
            animation: cl-uke-shoot 8s linear infinite;
            opacity: 0;
          }
          @keyframes cl-uke-shoot {
            0% { transform: translate(0, 0); opacity: 0; }
            2% { opacity: 1; }
            11% { transform: translate(-96px, 58px); opacity: 0; }
            100% { transform: translate(-96px, 58px); opacity: 0; }
          }
          /* Pine rustle: clusters rock around their branch points */
          .cl-uke-pine {
            transform-box: view-box;
            animation: cl-uke-rustle 2.7s ease-in-out infinite;
          }
          @keyframes cl-uke-rustle {
            0%, 100% { transform: rotate(-2.5deg); }
            50% { transform: rotate(2.5deg); }
          }
          /* Drifting mist: cloud bands slide sideways, alternating directions */
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
          /* Lantern swaying from its hang point */
          .cl-uke-sway {
            transform-box: view-box;
            transform-origin: 64px 150px;
            animation: cl-uke-sway 4s ease-in-out infinite;
          }
          @keyframes cl-uke-sway {
            0%, 100% { transform: rotate(-2deg); }
            50% { transform: rotate(2deg); }
          }
          /* Sparkle twinkle — speeds up on hover */
          .cl-uke-sparkle { animation: cl-uke-twinkle 4.5s ease-in-out infinite; }
          @keyframes cl-uke-twinkle {
            0%, 100% { opacity: 0.85; }
            50% { opacity: 0.25; }
          }
          .cl-uke-root:hover .cl-uke-sparkle { animation-duration: 1.1s; }
          /* Bokashi band shimmer on hover */
          .cl-uke-root:hover .cl-uke-shimmer { animation: cl-uke-shimmer 2.8s ease-in-out infinite; }
          @keyframes cl-uke-shimmer {
            0%, 100% { background-position: 0% 0%; }
            50% { background-position: 0% 100%; }
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cl-uke-glow,
          .cl-uke-shoot,
          .cl-uke-pine,
          .cl-uke-drift-a,
          .cl-uke-drift-b,
          .cl-uke-sway,
          .cl-uke-sparkle,
          .cl-uke-shimmer { animation: none; }
        }
      `}</style>

      <svg viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${name} tarot card in ukiyo-e woodblock print style`}>
        <defs>
          {/* Night sky: deep at the zenith, lifting toward the horizon */}
          <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={pal.sky[0]} />
            <stop offset="0.22" stopColor={pal.sky[1]} />
            <stop offset="0.6" stopColor={pal.sky[2]} />
            <stop offset="1" stopColor={pal.sky[3]} />
          </linearGradient>
          {/* Bokashi band: hand-wiped darker wash across the very top */}
          <linearGradient id={bokashiId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={pal.bokashi} stopOpacity="0.65" />
            <stop offset="1" stopColor={pal.bokashi} stopOpacity="0" />
          </linearGradient>
          <radialGradient id={glowId} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={pal.glow} stopOpacity="0.6" />
            <stop offset="0.55" stopColor={pal.glow} stopOpacity="0.22" />
            <stop offset="1" stopColor={pal.glow} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Washi paper ground ── */}
        <rect x="0" y="0" width="200" height="300" fill={CREAM} />
        {/* Faint paper fibres */}
        <g stroke="#e6dcc2" strokeWidth="0.5">
          <line x1="20" y1="262" x2="48" y2="259" />
          <line x1="120" y1="276" x2="152" y2="279" />
          <line x1="60" y1="286" x2="92" y2="284" />
        </g>

        {/* ── Scene (mirrored for variants 4-7) ── */}
        <g transform={mirror ? "translate(200,0) scale(-1,1)" : undefined}>
          {/* Night sky */}
          <rect x="9" y="9" width="182" height="192" fill={`url(#${skyId})`} />
          <rect x="9" y="9" width="182" height="46" fill={`url(#${bokashiId})`} />

          {/* Sky sparkles */}
          {sparkle(34 + shift, 34, 2.4, "s1", "0s")}
          {sparkle(140 - shift, 26, 1.9, "s2", "-1.6s")}
          {sparkle(112, 52 + shift * 0.4, 1.5, "s3", "-3.1s")}

          {/* Shooting star crossing the sky diagonally */}
          <g className="cl-uke-shoot">
            <line x1={150 + shift} y1="22" x2={168 + shift} y2="11" stroke={CREAM} strokeWidth="1.4" strokeLinecap="round" />
            <line x1={154 + shift} y1="19.5" x2={176 + shift} y2="6" stroke={CREAM} strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
            <circle cx={149 + shift} cy="23" r="1.3" fill="#fff6dd" />
          </g>

          {/* Outline-only stylized clouds (drifting) */}
          {outlineCloud("M16,64 h20 a7,7 0 0 1 12,-4 a9,9 0 0 1 16,1 a6,6 0 0 1 11,3 h16", 1.2, "c1", "cl-uke-drift-a")}
          {outlineCloud("M22,72 h14 a5,5 0 0 1 10,-2 a7,7 0 0 1 13,2 h18", 0.8, "c2", "cl-uke-drift-b")}
          {outlineCloud("M104,84 h16 a6,6 0 0 1 11,-3 a8,8 0 0 1 14,2 a5,5 0 0 1 9,2 h14", 1.1, "c3", "cl-uke-drift-a")}

          {/* Jagged mountain */}
          <path
            d="M9,235 L42,210 L58,222 L86,190 L100,206 L114,200 L136,222 L158,212 L182,226 L182,235 Z"
            fill={pal.mountain}
            stroke={INK}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Lit facet on the right slope — a separate flat color block */}
          <path
            d="M86,190 L100,206 L114,200 L136,222 L110,235 L92,214 Z"
            fill={pal.facet}
            stroke={INK}
            strokeWidth="0.7"
            strokeLinejoin="round"
          />

          {/* Mist band crossing the slopes, outline-only (drifting) */}
          {outlineCloud("M9,206 h24 a6,6 0 0 1 11,-3 a8,8 0 0 1 15,2 h30 a6,6 0 0 1 11,-2 h20", 1, "m1", "cl-uke-drift-b")}

          {/* Pine in the foreground (needles rustle) */}
          <path d="M30,256 C29,248 30,240 34,233" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
          {pineCluster(35, 232, 1, "p1", "0s")}
          {pineCluster(31, 242, 0.85, "p2", "-0.9s")}
          {v % 2 === 0 && pineCluster(28, 250, 0.7, "p3", "-1.8s")}

          {/* ── THE WANDERER on the peak ── */}
          {/* Raised left sleeve, arm lifting the lantern */}
          <path d="M78,156 L66,146 L62,152 L74,163 Z" fill={pal.robe} stroke={INK} strokeWidth="1" strokeLinejoin="round" />
          {/* Hand */}
          <circle cx="64" cy="148.5" r="1.9" fill="#e8c9a0" stroke={INK} strokeWidth="0.6" />

          {/* Hanging lantern assembly — sways gently from the hang point */}
          <g className="cl-uke-sway">
            {/* Lantern cord */}
            <line x1="64" y1="150" x2="64" y2="154" stroke={INK} strokeWidth="0.8" />
            {/* Lantern glow */}
            <circle className="cl-uke-glow" cx="64" cy="165" r="27" fill={`url(#${glowId})`} />
            {/* Paper lantern (chōchin): warm body, black key-block ribs */}
            <ellipse cx="64" cy="165" rx="9.5" ry="11" fill={pal.lantern} stroke={INK} strokeWidth="1.2" />
            <line x1="55.5" y1="160" x2="72.5" y2="160" stroke={INK} strokeWidth="0.7" />
            <line x1="54.5" y1="165" x2="73.5" y2="165" stroke={INK} strokeWidth="0.7" />
            <line x1="55.5" y1="170" x2="72.5" y2="170" stroke={INK} strokeWidth="0.7" />
            <rect x="61" y="152.5" width="6" height="2.6" fill={INK} />
            <rect x="61" y="175" width="6" height="2.6" fill={INK} />
            {/* Six-pointed star shining inside the lantern */}
            <g fill="#fff6dd">
              <path d="M64,160.6 L67.8,167 L60.2,167 Z" />
              <path d="M64,169.4 L60.2,163 L67.8,163 Z" />
            </g>
          </g>

          {/* Bamboo staff in the right hand */}
          <line x1="105" y1="146" x2="105" y2="196" stroke={INK} strokeWidth="3.1" strokeLinecap="round" />
          <line x1="105" y1="146" x2="105" y2="196" stroke={BAMBOO} strokeWidth="2" strokeLinecap="round" />
          <line x1="103.4" y1="162" x2="106.6" y2="162" stroke={INK} strokeWidth="0.8" />
          <line x1="103.4" y1="178" x2="106.6" y2="178" stroke={INK} strokeWidth="0.8" />

          {/* Right sleeve reaching the staff */}
          <path d="M96,156 L105,157.5 L104,164.5 L95,164 Z" fill={pal.robe} stroke={INK} strokeWidth="1" strokeLinejoin="round" />
          <circle cx="104.5" cy="161" r="1.7" fill="#e8c9a0" stroke={INK} strokeWidth="0.6" />

          {/* Outer robe: one flat bell-shaped block */}
          <path
            d="M86,140 C80,141 76,147 76,153 L74,166 L71,193 L101,193 L98,166 L96,153 C96,147 92,141 86,140 Z"
            fill={pal.robe}
            stroke={INK}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Inner robe: contrast layer showing at the front opening */}
          <path d="M82,159 L90,159 L94,193 L78,193 Z" fill={pal.inner} stroke={INK} strokeWidth="0.8" strokeLinejoin="round" />
          {/* Collar folds */}
          <path d="M82,159 L86,166 L90,159" fill="none" stroke={INK} strokeWidth="0.8" />

          {/* Hood shadow and face */}
          <path
            d="M80,152 C80,147 83,145 86,145 C89,145 92,147 92,152 C92,156 89,158.5 86,158.5 C83,158.5 80,156 80,152 Z"
            fill={INK}
          />
          <ellipse cx="86" cy="152.5" rx="2.4" ry="2.8" fill="#e8c9a0" />
          {/* Beard suggestion */}
          <path d="M84,155 L86,158 L88,155 Z" fill={CREAM} opacity="0.85" />
        </g>

        {/* ── Hanko seal: vertical red block, top-right, with the numeral ── */}
        <rect x="177" y="14" width="15" height={sealH} fill={VERMILION} />
        {numeral.split("").map((ch, i) => (
          <text
            key={`n-${i}`}
            x="184.5"
            y={23 + i * sealStep}
            textAnchor="middle"
            fontFamily={SERIF}
            fontWeight="bold"
            fontSize={sealFont}
            fill={CREAM}
          >
            {ch}
          </text>
        ))}

        {/* ── Title cartouche: tall narrow slip on the right edge ── */}
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
            <text
              key={`t-${i}`}
              x="184.5"
              y={y}
              textAnchor="middle"
              fontFamily={SERIF}
              fontWeight="bold"
              fontSize={titleFont}
              fill={INK}
            >
              {ch}
            </text>
          );
        })}

        {/* ── Thin double keyline frame ── */}
        <rect x="4" y="4" width="192" height="292" fill="none" stroke={INK} strokeWidth="1.6" />
        <rect x="8" y="8" width="184" height="284" fill="none" stroke={INK} strokeWidth="0.55" />
      </svg>

      {/* Bokashi shimmer overlay — sits over the top sky band, animates on hover */}
      <div className="cl-uke-shimmer" aria-hidden="true" />
    </figure>
  );
}
