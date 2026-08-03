/**
 * Card Lab — UKIYO-E
 * Edo-period woodblock print take on THE HERMIT (IX), in the manner of
 * Hokusai / Hiroshige. Flat unmodulated color blocks with crisp key-block
 * (sumi) outlines: indigo night sky with a bokashi gradient band at top,
 * outline-only stylized clouds, a jagged Prussian-blue peak, the hermit in
 * layered indigo + rust robes, a glowing ochre paper lantern with a small
 * six-pointed star, a bamboo staff, and pine-needle clusters. Vertical red
 * hanko seal with "IX" top-right; tall title cartouche with "THE HERMIT"
 * set vertically on the right edge. Cream washi ground, double keyline frame.
 *
 * Signature effects (CSS-only, server-component safe):
 *  - outline cloud / mist bands drift sideways, alternating directions;
 *  - the paper lantern sways gently from its hang point;
 *  - on hover the bokashi sky band shimmers and the sparkles twinkle faster.
 * All motion is guarded by prefers-reduced-motion.
 */

const INK = "#16130f";
const CREAM = "#f4ecd8";
const PRUSSIAN = "#1d3a5f";
const PRUSSIAN_LIGHT = "#2e5484";
const INDIGO = "#27335f";
const RUST = "#a94e2a";
const OCHRE = "#e0a437";
const BAMBOO = "#c79a4e";
const VERMILION = "#b3342a";
const SERIF = "Georgia, 'Times New Roman', 'Hiragino Mincho ProN', serif";

/** Fan of short needle strokes — a pine cluster, ukiyo-e style. */
function pineCluster(cx: number, cy: number, scale: number, key: string) {
  const angles = [-75, -45, -15, 15, 45, 75];
  return (
    <g key={key}>
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

export default function UkiyoEHermitCard() {
  const titleLetters = "THE HERMIT".split("");
  let titleY = 60;

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
          /* Drifting mist: cloud bands slide sideways, alternating directions */
          .cl-uke-drift-a { animation: cl-uke-drift-a 26s ease-in-out infinite; }
          .cl-uke-drift-b { animation: cl-uke-drift-b 34s ease-in-out infinite; }
          @keyframes cl-uke-drift-a {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(7px); }
          }
          @keyframes cl-uke-drift-b {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(-8px); }
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
          .cl-uke-drift-a,
          .cl-uke-drift-b,
          .cl-uke-sway,
          .cl-uke-sparkle,
          .cl-uke-shimmer { animation: none; }
        }
      `}</style>

      <svg viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="The Hermit tarot card in ukiyo-e woodblock print style">
        <defs>
          {/* Night sky: deep indigo at the zenith, lifting toward the horizon */}
          <linearGradient id="cl-uke-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#101d38" />
            <stop offset="0.22" stopColor="#1b2f55" />
            <stop offset="0.6" stopColor="#2a4a7c" />
            <stop offset="1" stopColor="#46689a" />
          </linearGradient>
          {/* Bokashi band: hand-wiped darker wash across the very top */}
          <linearGradient id="cl-uke-bokashi" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0a1226" stopOpacity="0.65" />
            <stop offset="1" stopColor="#0a1226" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="cl-uke-lantern-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#f2c14e" stopOpacity="0.6" />
            <stop offset="0.55" stopColor="#f2c14e" stopOpacity="0.22" />
            <stop offset="1" stopColor="#f2c14e" stopOpacity="0" />
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

        {/* ── Indigo night sky ── */}
        <rect x="9" y="9" width="182" height="192" fill="url(#cl-uke-sky)" />
        <rect x="9" y="9" width="182" height="46" fill="url(#cl-uke-bokashi)" />

        {/* Sky sparkles */}
        {sparkle(34, 34, 2.4, "s1", "0s")}
        {sparkle(140, 26, 1.9, "s2", "-1.6s")}
        {sparkle(112, 52, 1.5, "s3", "-3.1s")}

        {/* ── Outline-only stylized clouds (drifting) ── */}
        {outlineCloud("M16,64 h20 a7,7 0 0 1 12,-4 a9,9 0 0 1 16,1 a6,6 0 0 1 11,3 h16", 1.2, "c1", "cl-uke-drift-a")}
        {outlineCloud("M22,72 h14 a5,5 0 0 1 10,-2 a7,7 0 0 1 13,2 h18", 0.8, "c2", "cl-uke-drift-b")}
        {outlineCloud("M104,84 h16 a6,6 0 0 1 11,-3 a8,8 0 0 1 14,2 a5,5 0 0 1 9,2 h14", 1.1, "c3", "cl-uke-drift-a")}

        {/* ── Jagged Prussian-blue mountain ── */}
        <path
          d="M9,235 L42,210 L58,222 L86,190 L100,206 L114,200 L136,222 L158,212 L182,226 L182,235 Z"
          fill={PRUSSIAN}
          stroke={INK}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Lit facet on the right slope — a separate flat color block */}
        <path
          d="M86,190 L100,206 L114,200 L136,222 L110,235 L92,214 Z"
          fill={PRUSSIAN_LIGHT}
          stroke={INK}
          strokeWidth="0.7"
          strokeLinejoin="round"
        />

        {/* Mist band crossing the slopes, outline-only (drifting) */}
        {outlineCloud("M9,206 h24 a6,6 0 0 1 11,-3 a8,8 0 0 1 15,2 h30 a6,6 0 0 1 11,-2 h20", 1, "m1", "cl-uke-drift-b")}

        {/* ── Pine in the foreground ── */}
        <path d="M30,256 C29,248 30,240 34,233" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
        {pineCluster(35, 232, 1, "p1")}
        {pineCluster(31, 242, 0.85, "p2")}
        {pineCluster(28, 250, 0.7, "p3")}

        {/* ── THE HERMIT on the peak ── */}
        {/* Raised left sleeve (indigo), arm lifting the lantern */}
        <path d="M78,156 L66,146 L62,152 L74,163 Z" fill={INDIGO} stroke={INK} strokeWidth="1" strokeLinejoin="round" />
        {/* Hand */}
        <circle cx="64" cy="148.5" r="1.9" fill="#e8c9a0" stroke={INK} strokeWidth="0.6" />

        {/* Hanging lantern assembly — sways gently from the hang point */}
        <g className="cl-uke-sway">
          {/* Lantern cord */}
          <line x1="64" y1="150" x2="64" y2="154" stroke={INK} strokeWidth="0.8" />
          {/* Lantern glow */}
          <circle className="cl-uke-glow" cx="64" cy="165" r="27" fill="url(#cl-uke-lantern-glow)" />
          {/* Paper lantern (chōchin): warm ochre body, black key-block ribs */}
          <ellipse cx="64" cy="165" rx="9.5" ry="11" fill={OCHRE} stroke={INK} strokeWidth="1.2" />
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
        <path d="M96,156 L105,157.5 L104,164.5 L95,164 Z" fill={INDIGO} stroke={INK} strokeWidth="1" strokeLinejoin="round" />
        <circle cx="104.5" cy="161" r="1.7" fill="#e8c9a0" stroke={INK} strokeWidth="0.6" />

        {/* Outer robe: deep indigo, one flat bell-shaped block */}
        <path
          d="M86,140 C80,141 76,147 76,153 L74,166 L71,193 L101,193 L98,166 L96,153 C96,147 92,141 86,140 Z"
          fill={INDIGO}
          stroke={INK}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Inner robe: rust layer showing at the front opening */}
        <path d="M82,159 L90,159 L94,193 L78,193 Z" fill={RUST} stroke={INK} strokeWidth="0.8" strokeLinejoin="round" />
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

        {/* ── Hanko seal: vertical red block, top-right, with IX ── */}
        <rect x="177" y="14" width="15" height="23" fill={VERMILION} />
        <text
          x="184.5"
          y="23"
          textAnchor="middle"
          fontFamily={SERIF}
          fontWeight="bold"
          fontSize="8.5"
          fill={CREAM}
        >
          I
        </text>
        <text
          x="184.5"
          y="32.5"
          textAnchor="middle"
          fontFamily={SERIF}
          fontWeight="bold"
          fontSize="8.5"
          fill={CREAM}
        >
          X
        </text>

        {/* ── Title cartouche: tall narrow slip on the right edge ── */}
        <rect x="177" y="44" width="15" height="214" fill="#f6eeda" stroke={INK} strokeWidth="1" />
        <rect x="179.5" y="46.5" width="10" height="209" fill="none" stroke={INK} strokeWidth="0.45" />
        {titleLetters.map((ch, i) => {
          if (ch === " ") {
            titleY += 8;
            return null;
          }
          const y = titleY;
          titleY += 20;
          return (
            <text
              key={`t-${i}`}
              x="184.5"
              y={y}
              textAnchor="middle"
              fontFamily={SERIF}
              fontWeight="bold"
              fontSize="12"
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
