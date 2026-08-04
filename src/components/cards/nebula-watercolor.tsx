// Nebula Watercolor — The Hermit (IX)
// Deep-space hand-painted watercolor: indigo/violet/teal nebula washes with
// turbulence-displaced organic edges, salt-star specks, ink-wash hermit
// silhouette, warm gold wet-on-wet lantern bloom, paper grain.
// Server-component safe: no hooks, no handlers. All animation CSS-only.

const NS = "cz-nw-";

const stars: Array<{ cx: number; cy: number; r: number; o: number; tw?: boolean }> = [
  { cx: 22, cy: 30, r: 0.9, o: 0.8, tw: true },
  { cx: 48, cy: 18, r: 0.6, o: 0.55 },
  { cx: 70, cy: 26, r: 1.0, o: 0.85, tw: true },
  { cx: 92, cy: 14, r: 0.5, o: 0.5 },
  { cx: 118, cy: 34, r: 0.8, o: 0.7 },
  { cx: 142, cy: 20, r: 1.1, o: 0.9, tw: true },
  { cx: 168, cy: 38, r: 0.6, o: 0.55 },
  { cx: 186, cy: 18, r: 0.9, o: 0.8, tw: true },
  { cx: 34, cy: 64, r: 0.5, o: 0.45 },
  { cx: 58, cy: 52, r: 0.7, o: 0.6, tw: true },
  { cx: 96, cy: 60, r: 0.5, o: 0.5 },
  { cx: 150, cy: 56, r: 0.7, o: 0.65, tw: true },
  { cx: 176, cy: 70, r: 0.5, o: 0.45 },
  { cx: 14, cy: 96, r: 0.8, o: 0.7, tw: true },
  { cx: 40, cy: 108, r: 0.5, o: 0.5 },
  { cx: 76, cy: 92, r: 0.6, o: 0.55 },
  { cx: 132, cy: 88, r: 0.5, o: 0.5, tw: true },
  { cx: 190, cy: 100, r: 0.8, o: 0.7 },
  { cx: 26, cy: 140, r: 0.5, o: 0.4 },
  { cx: 52, cy: 150, r: 0.7, o: 0.55, tw: true },
  { cx: 84, cy: 132, r: 0.5, o: 0.4 },
  { cx: 116, cy: 146, r: 0.6, o: 0.5 },
  { cx: 152, cy: 132, r: 0.5, o: 0.45, tw: true },
  { cx: 180, cy: 148, r: 0.7, o: 0.55 },
  { cx: 62, cy: 74, r: 0.4, o: 0.4 },
  { cx: 108, cy: 76, r: 0.4, o: 0.38, tw: true },
  { cx: 162, cy: 96, r: 0.4, o: 0.4 },
  { cx: 88, cy: 44, r: 0.5, o: 0.42 },
];

export default function NebulaWatercolorHermit() {
  return (
    <figure
      className={`${NS}card`}
      style={{ aspectRatio: "2/3", width: "100%" }}
      role="img"
      aria-label="The Hermit tarot card: a hooded figure on a rocky peak raising a glowing lantern beneath a nebula-painted sky"
    >
      <style>{`
        .${NS}card {
          position: relative;
          margin: 0;
          overflow: hidden;
          border-radius: 14px;
          background: #0d0b1e;
          box-shadow: 0 10px 34px rgba(9, 6, 28, 0.55), inset 0 0 0 1px rgba(214, 200, 255, 0.10);
          font-family: Georgia, "Times New Roman", serif;
        }
        .${NS}svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }

        /* ---- LOAD: washes bleed in from their centers, one after another ---- */
        .${NS}wash {
          transform-box: fill-box;
          transform-origin: center;
          animation: ${NS}bleed 1.6s cubic-bezier(0.22, 0.61, 0.21, 1) both;
        }
        .${NS}wash-1 { animation-delay: 0s; }
        .${NS}wash-2 { animation-delay: 0.28s; }
        .${NS}wash-3 { animation-delay: 0.56s; }
        .${NS}wash-4 { animation-delay: 0.84s; }
        @keyframes ${NS}bleed {
          0%   { opacity: 0; transform: scale(0.55); filter: blur(10px); }
          60%  { opacity: 0.95; filter: blur(3px); }
          100% { opacity: 1; transform: scale(1); filter: blur(0px); }
        }
        .${NS}reveal {
          animation: ${NS}rise 1.5s ease-out 0.7s both;
        }
        @keyframes ${NS}rise {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .${NS}lantern {
          transform-box: fill-box;
          transform-origin: center;
          animation: ${NS}bloom 1.8s ease-out 1.05s both;
        }
        @keyframes ${NS}bloom {
          from { opacity: 0; transform: scale(0.3); filter: blur(8px); }
          to   { opacity: 1; transform: scale(1); filter: blur(0px); }
        }
        .${NS}title { animation: ${NS}rise 1.4s ease-out 1.15s both; }
        .${NS}frame { animation: ${NS}rise 1.6s ease-out 1s both; }
        .${NS}moon { animation: ${NS}rise 1.4s ease-out 0.9s both; }
        .${NS}stamp { animation: ${NS}rise 1.4s ease-out 1.25s both; }
        .${NS}const {
          animation: ${NS}rise 1.5s ease-out 1s both, ${NS}constPulse 26s ease-in-out 3s infinite alternate;
        }
        @keyframes ${NS}constPulse {
          from { opacity: 0.55; }
          to   { opacity: 0.85; }
        }

        /* ---- AMBIENT: very slow nebula drift + gentle star twinkle ---- */
        .${NS}wash-1 { animation: ${NS}bleed 1.6s cubic-bezier(0.22,0.61,0.21,1) both, ${NS}driftA 34s ease-in-out 2s infinite alternate; }
        .${NS}wash-2 { animation: ${NS}bleed 1.6s cubic-bezier(0.22,0.61,0.21,1) 0.28s both, ${NS}driftB 41s ease-in-out 2.5s infinite alternate; }
        .${NS}wash-3 { animation: ${NS}bleed 1.6s cubic-bezier(0.22,0.61,0.21,1) 0.56s both, ${NS}driftC 37s ease-in-out 3s infinite alternate; }
        .${NS}wash-4 { animation: ${NS}bleed 1.6s cubic-bezier(0.22,0.61,0.21,1) 0.84s both, ${NS}driftA 46s ease-in-out 3.5s infinite alternate-reverse; }
        @keyframes ${NS}driftA {
          from { filter: hue-rotate(0deg) brightness(1); opacity: 1; }
          to   { filter: hue-rotate(9deg) brightness(1.05); opacity: 0.9; }
        }
        @keyframes ${NS}driftB {
          from { filter: hue-rotate(0deg); opacity: 1; }
          to   { filter: hue-rotate(-11deg); opacity: 0.92; }
        }
        @keyframes ${NS}driftC {
          from { filter: hue-rotate(0deg) saturate(1); opacity: 1; }
          to   { filter: hue-rotate(7deg) saturate(1.08); opacity: 0.94; }
        }
        .${NS}lantern { animation: ${NS}bloom 1.8s ease-out 1.05s both, ${NS}glow 8s ease-in-out 3s infinite alternate; }
        @keyframes ${NS}glow {
          from { filter: brightness(1); }
          to   { filter: brightness(1.12); }
        }
        .${NS}tw { animation: ${NS}twinkle 6s ease-in-out infinite; }
        @keyframes ${NS}twinkle {
          0%, 100% { opacity: 0.25; }
          50%      { opacity: 0.95; }
        }

        @media (prefers-reduced-motion: reduce) {
          .${NS}wash, .${NS}wash-1, .${NS}wash-2, .${NS}wash-3, .${NS}wash-4,
          .${NS}reveal, .${NS}lantern, .${NS}title, .${NS}tw,
          .${NS}frame, .${NS}moon, .${NS}stamp, .${NS}const {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>

      <svg
        className={`${NS}svg`}
        viewBox="0 0 200 300"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          {/* organic edge displacement for watercolor blobs */}
          <filter id={`${NS}edgeA`} x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.017" numOctaves="3" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="34" />
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
          <filter id={`${NS}edgeB`} x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.016 0.011" numOctaves="3" seed="19" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="42" />
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
          <filter id={`${NS}edgeC`} x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.014" numOctaves="4" seed="31" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="26" />
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
          {/* soft ink edges for the hermit silhouette */}
          <filter id={`${NS}ink`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="5" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="4" />
            <feGaussianBlur stdDeviation="0.7" />
          </filter>
          {/* uneven hairline for the hand-painted ink frame */}
          <filter id={`${NS}rough`} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.045 0.06" numOctaves="3" seed="11" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" />
            <feGaussianBlur stdDeviation="0.45" />
          </filter>
          {/* wet-on-wet bleed for the lantern bloom */}
          <filter id={`${NS}wet`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          {/* fine paper grain */}
          <filter id={`${NS}grain`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="42" result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.06 0" />
          </filter>

          <radialGradient id={`${NS}indigo`} cx="45%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#3b2f8f" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#2a2070" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#1c1650" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${NS}violet`} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#7a4fb5" stopOpacity="0.7" />
            <stop offset="55%" stopColor="#5a3590" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#40255f" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${NS}teal`} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#2f8f95" stopOpacity="0.6" />
            <stop offset="55%" stopColor="#1f6a75" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#144a55" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${NS}rose`} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#a05a9a" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#7a3f7a" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#552a55" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${NS}gold`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe9b8" stopOpacity="1" />
            <stop offset="30%" stopColor="#f5c46a" stopOpacity="0.85" />
            <stop offset="65%" stopColor="#c98f3e" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#8a5a20" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${NS}rock`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#171334" />
            <stop offset="100%" stopColor="#0a0820" />
          </linearGradient>
          <radialGradient id={`${NS}vignette`} cx="50%" cy="42%" r="75%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0" />
            <stop offset="72%" stopColor="#060418" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#05030f" stopOpacity="0.5" />
          </radialGradient>
        </defs>

        {/* deep-space ground */}
        <rect width="200" height="300" fill="#0d0b1e" />

        {/* nebula washes — bleed in on load, drift slowly after */}
        <g className={`${NS}wash ${NS}wash-1`}>
          <ellipse cx="78" cy="88" rx="86" ry="70" fill={`url(#${NS}indigo)`} filter={`url(#${NS}edgeA)`} />
        </g>
        <g className={`${NS}wash ${NS}wash-2`}>
          <ellipse cx="148" cy="66" rx="70" ry="58" fill={`url(#${NS}violet)`} filter={`url(#${NS}edgeB)`} />
        </g>
        <g className={`${NS}wash ${NS}wash-3`}>
          <ellipse cx="52" cy="158" rx="74" ry="60" fill={`url(#${NS}teal)`} filter={`url(#${NS}edgeB)`} />
        </g>
        <g className={`${NS}wash ${NS}wash-4`}>
          <ellipse cx="156" cy="168" rx="66" ry="54" fill={`url(#${NS}rose)`} filter={`url(#${NS}edgeC)`} />
        </g>

        {/* salt-star specks */}
        <g fill="#fdfaff">
          {stars.map((s, i) => (
            <circle
              key={i}
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              opacity={s.o}
              className={s.tw ? `${NS}tw` : undefined}
              style={s.tw ? { animationDelay: `${(i % 7) * 0.9}s`, animationDuration: `${5 + (i % 4)}s` } : undefined}
            />
          ))}
        </g>

        {/* faint constellation within the indigo wash — connected star points */}
        <g className={`${NS}const`} opacity="0.7">
          <polyline
            points="46,62 62,50 80,58 74,78 54,86 46,62"
            fill="none"
            stroke="#cfc4f2"
            strokeOpacity="0.35"
            strokeWidth="0.6"
          />
          <g fill="#e6ddfa">
            <circle cx="46" cy="62" r="1.1" opacity="0.8" />
            <circle cx="62" cy="50" r="1.4" opacity="0.9" />
            <circle cx="80" cy="58" r="1" opacity="0.75" />
            <circle cx="74" cy="78" r="1.3" opacity="0.85" />
            <circle cx="54" cy="86" r="0.9" opacity="0.7" />
          </g>
        </g>

        {/* crescent moon painted into the upper-right corner */}
        <g className={`${NS}moon`}>
          <circle cx="172" cy="34" r="8.5" fill="#ecdcae" opacity="0.85" filter={`url(#${NS}wet)`} />
          <circle cx="175.5" cy="31" r="7" fill="#0d0b1e" opacity="0.92" filter={`url(#${NS}wet)`} />
          <circle cx="170.5" cy="35.5" r="3.4" fill="#f4e8c4" opacity="0.35" filter={`url(#${NS}wet)`} />
        </g>

        {/* Virgo glyph — soft rubber-stamp impression */}
        <text
          className={`${NS}stamp`}
          x="40"
          y="212"
          transform="rotate(-9 40 212)"
          fontFamily='Georgia, "Palatino Linotype", serif'
          fontSize="17"
          fill="#9d86d8"
          opacity="0.5"
          filter={`url(#${NS}rough)`}
        >
          ♍︎
        </text>

        {/* rocky outcrop */}
        <g className={`${NS}reveal`}>
          <path
            d="M 62 236 L 84 214 L 104 208 L 126 218 L 140 236 L 146 300 L 56 300 Z"
            fill={`url(#${NS}rock)`}
            filter={`url(#${NS}ink)`}
          />
          <path
            d="M 84 214 L 104 208 L 126 218"
            fill="none"
            stroke="#4a3f8a"
            strokeOpacity="0.35"
            strokeWidth="0.8"
          />
        </g>

        {/* hermit — quiet ink-wash silhouette */}
        <g className={`${NS}reveal`} filter={`url(#${NS}ink)`} fill="#120e2c">
          {/* cloak / hooded body */}
          <path d="M 100 148 C 94 150 90 158 89 168 L 86 208 C 86 214 90 217 96 218 L 108 218 C 114 217 117 213 116 207 L 113 166 C 112 156 107 148 100 148 Z" />
          {/* hood point */}
          <path d="M 100 148 C 96 149 93 152 92 156 C 95 153 98 152 100 152 C 103 152 106 154 108 157 C 107 152 104 149 100 148 Z" fill="#0b0820" />
          {/* staff in left hand */}
          <path d="M 84 158 L 82 214" stroke="#120e2c" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          {/* right arm raised toward lantern */}
          <path d="M 110 164 C 118 158 124 150 128 142 L 132 144 C 128 154 121 162 113 169 Z" />
        </g>

        {/* lantern — warm gold wet-on-wet bloom */}
        <g className={`${NS}lantern`}>
          <circle cx="131" cy="132" r="20" fill={`url(#${NS}gold)`} filter={`url(#${NS}wet)`} />
          <circle cx="131" cy="132" r="9" fill="#f7cf7d" opacity="0.9" filter={`url(#${NS}wet)`} />
          {/* lantern frame */}
          <g stroke="#241a08" strokeWidth="1.1" fill="none" opacity="0.85">
            <rect x="126.5" y="126.5" width="9" height="11" rx="1.5" />
            <path d="M 128 126.5 C 128 123.5 134 123.5 134 126.5" />
            <path d="M 131 137.5 L 131 140" strokeLinecap="round" />
          </g>
          {/* the star inside */}
          <path
            d="M 131 128.2 L 132.1 131 L 135 132 L 132.1 133 L 131 135.8 L 129.9 133 L 127 132 L 129.9 131 Z"
            fill="#fff6dc"
          />
          {/* faint gold bleed into the blue around it */}
          <circle cx="131" cy="132" r="30" fill="none" stroke="#e8b45f" strokeOpacity="0.14" strokeWidth="6" filter={`url(#${NS}wet)`} />
        </g>

        {/* vignette + paper grain */}
        <rect width="200" height="300" fill={`url(#${NS}vignette)`} />
        <rect width="200" height="300" filter={`url(#${NS}grain)`} opacity="0.5" />

        {/* hand-painted ink frame — taped-off watercolor border, uneven hairline */}
        <g className={`${NS}frame`}>
          <rect
            x="8" y="8" width="184" height="284" rx="7"
            fill="none" stroke="#b9a8e8" strokeOpacity="0.14" strokeWidth="5"
            filter={`url(#${NS}rough)`}
          />
          <rect
            x="8" y="8" width="184" height="284" rx="7"
            fill="none" stroke="#d8cdf5" strokeOpacity="0.55" strokeWidth="1.1"
            filter={`url(#${NS}rough)`}
          />
          {/* tiny corner star dabs */}
          <g fill="#f0e6c8" filter={`url(#${NS}rough)`}>
            <path d="M 16 12.6 L 16.9 15.1 L 19.4 16 L 16.9 16.9 L 16 19.4 L 15.1 16.9 L 12.6 16 L 15.1 15.1 Z" opacity="0.85" />
            <path d="M 184 12.6 L 184.9 15.1 L 187.4 16 L 184.9 16.9 L 184 19.4 L 183.1 16.9 L 180.6 16 L 183.1 15.1 Z" opacity="0.85" />
            <path d="M 16 280.6 L 16.9 283.1 L 19.4 284 L 16.9 284.9 L 16 287.4 L 15.1 284.9 L 12.6 284 L 15.1 283.1 Z" opacity="0.85" />
            <path d="M 184 280.6 L 184.9 283.1 L 187.4 284 L 184.9 284.9 L 184 287.4 L 183.1 284.9 L 180.6 284 L 183.1 283.1 Z" opacity="0.85" />
          </g>
        </g>
      </svg>

      {/* typesetting */}
      <span className={`${NS}title`} style={{ position: "absolute", top: "4.5%", left: 0, right: 0, textAlign: "center" }}>
        <span
          style={{
            fontFamily: 'Georgia, "Palatino Linotype", "Book Antiqua", serif',
            fontStyle: "italic",
            fontSize: "clamp(11px, 4.5cqw, 15px)",
            letterSpacing: "0.35em",
            textIndent: "0.35em",
            color: "rgba(226, 214, 250, 0.85)",
            textShadow: "0 0 8px rgba(140, 110, 220, 0.5)",
          }}
        >
          IX
        </span>
      </span>
      <span className={`${NS}title`} style={{ position: "absolute", bottom: "4.5%", left: 0, right: 0, textAlign: "center" }}>
        <span
          style={{
            fontFamily: 'Georgia, "Palatino Linotype", "Book Antiqua", serif',
            fontSize: "clamp(10px, 4cqw, 13px)",
            letterSpacing: "0.42em",
            textIndent: "0.42em",
            color: "rgba(232, 224, 248, 0.88)",
            textShadow: "0 1px 6px rgba(8, 5, 24, 0.9), 0 0 10px rgba(120, 90, 200, 0.35)",
          }}
        >
          THE HERMIT
        </span>
      </span>
    </figure>
  );
}
