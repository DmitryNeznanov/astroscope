/**
 * Ethereal Mist — The Hermit (IX)
 * Cinematic fog minimalism: a soft dark silhouette half-dissolved into
 * layered mist, one distant amber lantern glow, huge negative space.
 * Server-component safe: no hooks, no client directives, CSS-only motion.
 */
export default function EtherealMistHermit() {
  return (
    <figure
      className="cz-emist-card"
      style={{ aspectRatio: "2/3", width: "100%" }}
      role="img"
      aria-label="The Hermit tarot card: a hooded figure dissolving into mountain fog, holding a faint amber lantern"
    >
      <style>{`
        .cz-emist-card {
          position: relative;
          margin: 0;
          overflow: hidden;
          border-radius: 10px;
          background: #5a6b7d;
          box-shadow: 0 18px 50px -18px rgba(20, 28, 38, 0.55);
        }
        .cz-emist-card svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
        }

        /* ---- Load reveal: fog parts, figure fades in (~2s, very slow ease) ---- */
        .cz-emist-figure {
          opacity: 0.92;
          animation: cz-emist-figure-in 2.1s cubic-bezier(0.22, 0.61, 0.21, 1) 0.25s both;
        }
        .cz-emist-part-l {
          animation: cz-emist-part-l 2.4s cubic-bezier(0.25, 0.6, 0.2, 1) both;
        }
        .cz-emist-part-r {
          animation: cz-emist-part-r 2.4s cubic-bezier(0.25, 0.6, 0.2, 1) both;
        }
        .cz-emist-glow {
          animation: cz-emist-glow-in 2.6s cubic-bezier(0.3, 0.6, 0.2, 1) 0.7s both;
        }
        .cz-emist-title {
          animation: cz-emist-fade-in 2s ease-out 1s both;
        }

        @keyframes cz-emist-figure-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 0.92; transform: translateY(0); }
        }
        @keyframes cz-emist-part-l {
          from { transform: translateX(-26px); }
          to   { transform: translateX(0); }
        }
        @keyframes cz-emist-part-r {
          from { transform: translateX(26px); }
          to   { transform: translateX(0); }
        }
        @keyframes cz-emist-glow-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cz-emist-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ---- Ambient: only the fog bands drift, very slowly, a few px ---- */
        .cz-emist-drift-a { animation: cz-emist-drift-l 44s ease-in-out infinite alternate; }
        .cz-emist-drift-b { animation: cz-emist-drift-r 36s ease-in-out infinite alternate; }
        .cz-emist-drift-c { animation: cz-emist-drift-l 52s ease-in-out infinite alternate; }
        .cz-emist-drift-d { animation: cz-emist-drift-r 47s ease-in-out infinite alternate; }
        .cz-emist-drift-e { animation: cz-emist-drift-l 31s ease-in-out infinite alternate; }

        @keyframes cz-emist-drift-l {
          from { transform: translateX(5px); }
          to   { transform: translateX(-5px); }
        }
        @keyframes cz-emist-drift-r {
          from { transform: translateX(-6px); }
          to   { transform: translateX(6px); }
        }

        .cz-emist-text {
          font-family: Didot, "Bodoni MT", "Times New Roman", Georgia, serif;
          font-weight: 400;
          fill: #e8edf2;
        }

        @media (prefers-reduced-motion: reduce) {
          .cz-emist-card *,
          .cz-emist-card *::before,
          .cz-emist-card *::after {
            animation: none !important;
          }
          .cz-emist-figure { opacity: 0.92; }
        }
      `}</style>

      <svg viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          {/* Sky / atmosphere */}
          <linearGradient id="cz-emist-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4b5a6b" />
            <stop offset="0.42" stopColor="#7d8fa2" />
            <stop offset="0.72" stopColor="#8fa3b8" />
            <stop offset="1" stopColor="#6e7f92" />
          </linearGradient>

          {/* Ground mist rising over the lower third */}
          <linearGradient id="cz-emist-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#cfd9e4" stopOpacity="0" />
            <stop offset="0.55" stopColor="#cfd9e4" stopOpacity="0.28" />
            <stop offset="1" stopColor="#dde5ec" stopOpacity="0.6" />
          </linearGradient>

          {/* Soft vertical haze so the whole scene sits inside fog */}
          <radialGradient id="cz-emist-haze" cx="0.5" cy="0.46" r="0.75">
            <stop offset="0" stopColor="#e8edf2" stopOpacity="0.16" />
            <stop offset="0.6" stopColor="#e8edf2" stopOpacity="0.05" />
            <stop offset="1" stopColor="#2f3a47" stopOpacity="0.22" />
          </radialGradient>

          {/* Lantern: large soft halo, very dim warm core */}
          <radialGradient id="cz-emist-halo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#f2c47c" stopOpacity="0.5" />
            <stop offset="0.25" stopColor="#eeb96e" stopOpacity="0.22" />
            <stop offset="0.6" stopColor="#e0a95f" stopOpacity="0.08" />
            <stop offset="1" stopColor="#e0a95f" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cz-emist-core" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffe9c4" stopOpacity="0.95" />
            <stop offset="0.5" stopColor="#f5c87e" stopOpacity="0.55" />
            <stop offset="1" stopColor="#f5c87e" stopOpacity="0" />
          </radialGradient>

          {/* Dissolve mask: sharp at the top, gone below the waist */}
          <linearGradient
            id="cz-emist-dissolve"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="80"
            x2="0"
            y2="246"
          >
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.42" stopColor="#ffffff" />
            <stop offset="0.72" stopColor="#5a5a5a" />
            <stop offset="1" stopColor="#000000" />
          </linearGradient>
          <mask id="cz-emist-figure-mask">
            <rect x="0" y="0" width="200" height="300" fill="url(#cz-emist-dissolve)" />
          </mask>

          {/* Soft blur used by every fog band */}
          <filter id="cz-emist-soft" x="-40%" y="-120%" width="180%" height="340%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <filter id="cz-emist-softer" x="-60%" y="-200%" width="220%" height="500%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>

        {/* Atmosphere */}
        <rect x="0" y="0" width="200" height="300" fill="url(#cz-emist-sky)" />
        <rect x="0" y="0" width="200" height="300" fill="url(#cz-emist-haze)" />

        {/* Ghosted roman numeral */}
        <text
          className="cz-emist-text cz-emist-title"
          x="100"
          y="42"
          textAnchor="middle"
          fontSize="14"
          letterSpacing="7"
          opacity="0.3"
        >
          IX
        </text>

        {/* Faint distant ridgeline, barely there */}
        <path
          d="M0 196 Q 30 178 62 190 T 128 186 T 200 194 L 200 300 L 0 300 Z"
          fill="#55656f"
          opacity="0.22"
        />

        {/* Deep background fog band */}
        <g className="cz-emist-part-l">
          <g className="cz-emist-drift-c" filter="url(#cz-emist-softer)">
            <rect x="-40" y="168" width="280" height="20" rx="10" fill="#c9d4e0" opacity="0.2" />
          </g>
        </g>

        {/* Lantern glow — the only warm point, behind the silhouette's hand */}
        <g className="cz-emist-glow">
          <circle cx="141" cy="112" r="46" fill="url(#cz-emist-halo)" />
          <circle cx="141" cy="112" r="10" fill="url(#cz-emist-core)" />
        </g>

        {/* The Hermit: silhouette half-dissolved into fog */}
        <g className="cz-emist-figure" mask="url(#cz-emist-figure-mask)">
          <g fill="#2c3540">
            {/* Cloak and hood */}
            <path
              d="M100 84
                 C 93 86 89 93 88 102
                 C 86 114 83 122 80 132
                 C 74 158 70 190 68 246
                 L 132 246
                 C 130 190 126 158 120 132
                 C 117 122 114 114 112 102
                 C 111 93 107 86 100 84 Z"
            />
            {/* Hood shadow opening */}
            <path d="M93 104 C 94 96 106 96 107 104 C 106 112 94 112 93 104 Z" fill="#20272f" />
            {/* Raised arm toward the lantern */}
            <path
              d="M112 122 C 120 117 129 112 136 107 L 140 113 C 133 119 124 125 116 130 Z"
            />
            {/* Lantern: tiny dark frame against the glow */}
            <rect x="136.5" y="104" width="9" height="12" rx="1.5" fill="#232b34" opacity="0.85" />
            <rect x="139" y="101.5" width="4" height="3" rx="1.2" fill="#232b34" opacity="0.85" />
          </g>
          {/* Small star of light inside the lantern */}
          <circle cx="141" cy="110.5" r="1.7" fill="#ffe9c4" opacity="0.9" />
          {/* Staff in the other hand */}
          <path
            d="M64 122 C 65.5 158 67.5 200 68.5 244"
            stroke="#2c3540"
            strokeWidth="3.4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Hand resting on the staff */}
          <circle cx="66" cy="140" r="4.6" fill="#2c3540" />
        </g>

        {/* Layered horizontal fog bands, drifting in opposite directions */}
        <g className="cz-emist-part-r">
          <g className="cz-emist-drift-a" filter="url(#cz-emist-soft)">
            <rect x="-40" y="186" width="280" height="15" rx="7.5" fill="#dbe3ec" opacity="0.34" />
          </g>
        </g>
        <g className="cz-emist-part-l">
          <g className="cz-emist-drift-b" filter="url(#cz-emist-soft)">
            <rect x="-40" y="205" width="280" height="18" rx="9" fill="#c3cfdb" opacity="0.42" />
          </g>
        </g>
        <g className="cz-emist-part-r">
          <g className="cz-emist-drift-d" filter="url(#cz-emist-softer)">
            <rect x="-40" y="226" width="280" height="22" rx="11" fill="#dde5ec" opacity="0.5" />
          </g>
        </g>
        <g className="cz-emist-part-l">
          <g className="cz-emist-drift-e" filter="url(#cz-emist-soft)">
            <rect x="-40" y="248" width="280" height="26" rx="13" fill="#e4eaf0" opacity="0.55" />
          </g>
        </g>

        {/* Rising ground mist */}
        <rect x="0" y="180" width="200" height="120" fill="url(#cz-emist-ground)" />

        {/* Title: ultra-thin tracked caps, semi-transparent */}
        <text
          className="cz-emist-text cz-emist-title"
          x="100"
          y="283"
          textAnchor="middle"
          fontSize="9"
          letterSpacing="5.5"
          opacity="0.55"
        >
          THE HERMIT
        </text>
      </svg>
    </figure>
  );
}
