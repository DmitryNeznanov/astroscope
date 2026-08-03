/**
 * VAPORWAVE — The Hermit (IX)
 * 80s retro-futurism: a chrome/marble statue Hermit standing on a glowing
 * perspective grid floor (pink/cyan) beneath a black sky with a huge striped
 * retro sun (magenta→orange). Palm silhouette and a broken Greek column flank
 * the scene; wireframe shapes float overhead. IX in chrome gradient,
 * THE HERMIT in italic serif with a vertical latin accent.
 *
 * Signature effects (CSS-only):
 *  - the sun's gap-stripes scroll downward on a seamless loop;
 *  - the floor grid scrolls toward the viewer (seamless wrap, horizon fade);
 *  - scanlines drift slowly;
 *  - on hover a chrome sheen sweeps the statue (screen blend) and the
 *    pink/cyan rim lights intensify.
 * All motion is disabled under prefers-reduced-motion.
 */
export default function VaporwaveHermitCard() {
  return (
    <figure
      className="cl-vapor-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
      aria-label="The Hermit tarot card in vaporwave retro-futurism style"
    >
      <style>{`
        .cl-vapor-card {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          background: linear-gradient(180deg, #0d0218 0%, #1a0430 52%, #2b0a4e 70%, #12031f 100%);
          box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.8);
        }
        .cl-vapor-card svg { display: block; width: 100%; height: 100%; }

        /* ---- glow stacks ---- */
        .cl-vapor-glow-pink {
          filter:
            drop-shadow(0 0 2px rgba(255, 120, 200, 0.9))
            drop-shadow(0 0 7px rgba(255, 46, 154, 0.65))
            drop-shadow(0 0 16px rgba(255, 46, 154, 0.35));
        }
        .cl-vapor-glow-cyan {
          filter:
            drop-shadow(0 0 2px rgba(160, 245, 255, 0.9))
            drop-shadow(0 0 7px rgba(34, 230, 255, 0.6))
            drop-shadow(0 0 16px rgba(34, 230, 255, 0.3));
        }
        .cl-vapor-glow-sun {
          filter:
            drop-shadow(0 0 6px rgba(255, 120, 120, 0.5))
            drop-shadow(0 0 22px rgba(255, 60, 140, 0.4));
        }
        .cl-vapor-glow-star {
          filter:
            drop-shadow(0 0 2px rgba(255, 240, 200, 1))
            drop-shadow(0 0 8px rgba(255, 200, 120, 0.85))
            drop-shadow(0 0 18px rgba(255, 150, 60, 0.5));
        }
        .cl-vapor-glow-ix {
          filter:
            drop-shadow(0 0 3px rgba(255, 140, 210, 0.6))
            drop-shadow(0 0 10px rgba(123, 47, 247, 0.5));
        }

        /* ---- signature: sun gap-stripes scroll downward (period 13px) ---- */
        @keyframes cl-vapor-sunscroll {
          from { transform: translateY(0); }
          to { transform: translateY(13px); }
        }
        .cl-vapor-sunscroll { animation: cl-vapor-sunscroll 8s linear infinite; }

        /* ---- signature: floor grid scrolls toward the viewer (period 22px) ---- */
        @keyframes cl-vapor-gridscroll {
          from { transform: translateY(0); }
          to { transform: translateY(22px); }
        }
        .cl-vapor-gridscroll { animation: cl-vapor-gridscroll 4.5s linear infinite; }

        /* ---- signature: scanline drift (period 4px) ---- */
        @keyframes cl-vapor-scandrift {
          from { transform: translateY(0); }
          to { transform: translateY(4px); }
        }
        .cl-vapor-scandrift { animation: cl-vapor-scandrift 9s linear infinite; }

        /* ---- signature: hover chrome sheen sweep across the statue ---- */
        .cl-vapor-sheen { opacity: 0; mix-blend-mode: screen; }
        @keyframes cl-vapor-sweep {
          0% { transform: translateX(-90px); opacity: 0; }
          25% { opacity: 0.65; }
          75% { opacity: 0.65; }
          100% { transform: translateX(150px); opacity: 0; }
        }
        .cl-vapor-card:hover .cl-vapor-sheen { animation: cl-vapor-sweep 1s ease-in-out; }

        /* ---- signature: hover rim lights intensify ---- */
        .cl-vapor-rim { transition: filter 0.4s ease, stroke-width 0.4s ease; }
        .cl-vapor-card:hover .cl-vapor-rim {
          stroke-width: 2.3;
          filter:
            drop-shadow(0 0 3px rgba(255, 255, 255, 0.95))
            drop-shadow(0 0 10px rgba(255, 90, 200, 0.85))
            drop-shadow(0 0 22px rgba(90, 236, 255, 0.7));
        }

        /* ---- ambient motion ---- */
        @keyframes cl-vapor-drift {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .cl-vapor-float { animation: cl-vapor-drift 5.5s ease-in-out infinite; }
        .cl-vapor-float-alt { animation: cl-vapor-drift 7s ease-in-out infinite reverse; }
        @keyframes cl-vapor-twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
        .cl-vapor-twinkle { animation: cl-vapor-twinkle 3.2s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .cl-vapor-sunscroll,
          .cl-vapor-gridscroll,
          .cl-vapor-scandrift,
          .cl-vapor-float,
          .cl-vapor-float-alt,
          .cl-vapor-twinkle { animation: none; }
          .cl-vapor-card:hover .cl-vapor-sheen { animation: none; }
          .cl-vapor-rim { transition: none; }
        }
      `}</style>

      <svg viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" role="img">
        <defs>
          {/* retro sun gradient — magenta to orange */}
          <linearGradient id="clVaporSun" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff2d95" />
            <stop offset="0.55" stopColor="#ff5c6e" />
            <stop offset="1" stopColor="#ff9a3d" />
          </linearGradient>
          {/* chrome / marble statue gradient */}
          <linearGradient id="clVaporChrome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f7f9fc" />
            <stop offset="0.35" stopColor="#c3c9d6" />
            <stop offset="0.55" stopColor="#eef1f6" />
            <stop offset="0.8" stopColor="#9aa2b4" />
            <stop offset="1" stopColor="#d8dde7" />
          </linearGradient>
          {/* chrome banding for the IX numeral */}
          <linearGradient id="clVaporChromeTx" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.4" stopColor="#c8ccd8" />
            <stop offset="0.5" stopColor="#5f6675" />
            <stop offset="0.58" stopColor="#e9edf5" />
            <stop offset="0.78" stopColor="#98a0b2" />
            <stop offset="1" stopColor="#f2f4f9" />
          </linearGradient>
          {/* floor gradient */}
          <linearGradient id="clVaporFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2d0a52" />
            <stop offset="1" stopColor="#10031c" />
          </linearGradient>
          {/* horizon fade for the scrolling grid lines */}
          <linearGradient
            id="clVaporGridFade"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="190"
            x2="0"
            y2="214"
          >
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#fff" stopOpacity="1" />
          </linearGradient>
          {/* diagonal chrome sheen band */}
          <linearGradient id="clVaporSheen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.95" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          {/* subtle checker for the statue's floor patch */}
          <pattern id="clVaporCheck" width="7" height="7" patternUnits="userSpaceOnUse">
            <rect width="7" height="7" fill="#ff2e9a" opacity="0.35" />
            <rect width="3.5" height="3.5" fill="#22e6ff" opacity="0.35" />
            <rect x="3.5" y="3.5" width="3.5" height="3.5" fill="#22e6ff" opacity="0.35" />
          </pattern>
          {/* scanline overlay */}
          <pattern id="clVaporScan" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="1.2" fill="#000" opacity="0.16" />
          </pattern>
          {/* sun disc clip + lower-half clip so stripes slide in from mid-sun */}
          <clipPath id="clVaporSunClip">
            <circle cx="100" cy="168" r="56" />
          </clipPath>
          <clipPath id="clVaporStripeClip">
            <rect x="30" y="150" width="140" height="90" />
          </clipPath>
          {/* statue silhouette clip for the sheen sweep */}
          <clipPath id="clVaporFigClip">
            <path
              d="M 100 90
                 C 88 92 82 102 83 114
                 C 78 124 76 138 75 154
                 C 74 170 73 188 72 210
                 L 128 210
                 C 127 188 126 170 125 154
                 C 124 138 122 124 117 114
                 C 118 102 112 92 100 90 Z"
            />
          </clipPath>
          {/* grid lines fade in from the horizon while scrolling */}
          <mask id="clVaporGridMask">
            <rect x="0" y="188" width="200" height="116" fill="url(#clVaporGridFade)" />
          </mask>
        </defs>

        {/* sky stars */}
        <g fill="#e8dcff" opacity="0.8">
          <circle cx="24" cy="30" r="0.9" />
          <circle cx="58" cy="18" r="0.7" />
          <circle cx="146" cy="26" r="0.9" />
          <circle cx="178" cy="48" r="0.7" />
          <circle cx="16" cy="86" r="0.7" />
          <circle cx="186" cy="98" r="0.8" />
        </g>

        {/* striped retro sun — stripes scroll downward, seamless (period 13px) */}
        <g className="cl-vapor-glow-sun">
          <g clipPath="url(#clVaporSunClip)">
            <circle cx="100" cy="168" r="56" fill="url(#clVaporSun)" />
            <g clipPath="url(#clVaporStripeClip)">
              <g className="cl-vapor-sunscroll" fill="#160328" opacity="0.88">
                <rect x="30" y="137" width="140" height="5" />
                <rect x="30" y="150" width="140" height="5" />
                <rect x="30" y="163" width="140" height="5" />
                <rect x="30" y="176" width="140" height="5" />
                <rect x="30" y="189" width="140" height="5" />
                <rect x="30" y="202" width="140" height="5" />
                <rect x="30" y="215" width="140" height="5" />
              </g>
            </g>
          </g>
        </g>

        {/* grid floor */}
        <rect x="0" y="190" width="200" height="110" fill="url(#clVaporFloor)" />
        <g className="cl-vapor-glow-pink" stroke="#ff2e9a" strokeWidth="0.8" opacity="0.9">
          {/* converging verticals — static */}
          <path d="M 100 190 L -45 300" fill="none" />
          <path d="M 100 190 L -12 300" fill="none" />
          <path d="M 100 190 L 22 300" fill="none" />
          <path d="M 100 190 L 56 300" fill="none" />
          <path d="M 100 190 L 100 300" fill="none" stroke="#22e6ff" />
          <path d="M 100 190 L 144 300" fill="none" />
          <path d="M 100 190 L 178 300" fill="none" />
          <path d="M 100 190 L 212 300" fill="none" />
          <path d="M 100 190 L 245 300" fill="none" />
        </g>
        {/* scrolling horizontals — period 22px, faded in from the horizon */}
        <g mask="url(#clVaporGridMask)">
          <g
            className="cl-vapor-gridscroll cl-vapor-glow-pink"
            stroke="#ff2e9a"
            strokeWidth="0.9"
            opacity="0.9"
          >
            <path d="M 0 168 H 200" fill="none" />
            <path d="M 0 190 H 200" fill="none" />
            <path d="M 0 212 H 200" fill="none" />
            <path d="M 0 234 H 200" fill="none" />
            <path d="M 0 256 H 200" fill="none" />
            <path d="M 0 278 H 200" fill="none" />
            <path d="M 0 300 H 200" fill="none" />
          </g>
        </g>
        {/* horizon line */}
        <path
          className="cl-vapor-glow-cyan"
          d="M 0 190 H 200"
          stroke="#7df3ff"
          strokeWidth="1"
          fill="none"
        />

        {/* palm silhouette — left, by the horizon */}
        <g fill="#0e0218">
          <path d="M 30 196 C 29 184 30 172 34 160 L 37 161 C 34 172 33 184 34 196 Z" />
          <path d="M 35 161 C 28 154 20 152 12 154 C 19 148 29 149 35 155 Z" />
          <path d="M 35 160 C 30 150 22 145 14 145 C 22 140 32 145 36 154 Z" />
          <path d="M 36 159 C 36 149 32 141 26 137 C 34 138 39 147 38 157 Z" />
          <path d="M 37 159 C 42 150 50 146 58 147 C 51 142 41 147 37 156 Z" />
          <path d="M 37 161 C 44 155 52 154 60 157 C 53 151 43 153 37 158 Z" />
        </g>

        {/* broken Greek column — right */}
        <g>
          <path
            d="M 168 206 L 170 148 L 172 142 L 174 147 L 177 140 L 180 146 L 182 143 L 184 206 Z"
            fill="#b9c0ce"
          />
          <path
            d="M 168 206 L 170 148 L 172 142 L 174 147 L 177 140 L 180 146 L 182 143 L 184 206 Z"
            fill="none"
            stroke="#ff9ad2"
            strokeWidth="0.7"
            opacity="0.7"
          />
          {/* fluting */}
          <g stroke="#7b8296" strokeWidth="0.6" opacity="0.8">
            <path d="M 172 152 L 171 204" />
            <path d="M 176 152 L 175.6 204" />
            <path d="M 180 152 L 180.4 204" />
          </g>
          {/* fallen capital fragment */}
          <path
            className="cl-vapor-float-alt"
            d="M 172 128 L 184 126 L 186 132 L 174 135 Z"
            fill="#cdd3de"
            stroke="#22e6ff"
            strokeWidth="0.6"
          />
        </g>

        {/* floating wireframe shapes */}
        <g className="cl-vapor-float" fill="none" strokeLinejoin="round">
          <path
            className="cl-vapor-glow-cyan"
            d="M 30 52 L 46 82 L 14 82 Z"
            stroke="#22e6ff"
            strokeWidth="1"
          />
          <path d="M 30 52 L 30 82 M 30 52 L 22 82 M 30 52 L 38 82" stroke="#22e6ff" strokeWidth="0.4" opacity="0.6" />
        </g>
        <circle
          className="cl-vapor-float-alt cl-vapor-glow-pink"
          cx="166"
          cy="74"
          r="9"
          fill="none"
          stroke="#ff2e9a"
          strokeWidth="1.1"
        />
        <path
          className="cl-vapor-float"
          d="M 152 108 h 8 M 156 104 v 8"
          stroke="#7b2ff7"
          strokeWidth="1.2"
          fill="none"
          opacity="0.9"
        />

        {/* checker patch under the statue */}
        <path d="M 62 210 L 138 210 L 150 230 L 50 230 Z" fill="url(#clVaporCheck)" />

        {/* statue reflection on the floor */}
        <use href="#clVaporFig" transform="translate(0 420) scale(1 -1)" opacity="0.14" />

        {/* chrome statue Hermit */}
        <g id="clVaporFig">
          {/* staff in the left hand */}
          <path
            className="cl-vapor-glow-cyan"
            d="M 64 100 Q 60 155 64 210"
            fill="none"
            stroke="#dfe6ee"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          {/* robe / hood body */}
          <path
            d="M 100 90
               C 88 92 82 102 83 114
               C 78 124 76 138 75 154
               C 74 170 73 188 72 210
               L 128 210
               C 127 188 126 170 125 154
               C 124 138 122 124 117 114
               C 118 102 112 92 100 90 Z"
            fill="url(#clVaporChrome)"
          />
          {/* hood opening */}
          <path
            d="M 92 108 C 92 100 96 96 100 96 C 104 96 108 100 108 108 C 104 112 96 112 92 108 Z"
            fill="#140a26"
          />
          {/* marble veins / robe folds */}
          <g fill="none" stroke="#8f97a8" strokeWidth="0.7" opacity="0.55">
            <path d="M 96 130 C 94 150 95 176 93 204" />
            <path d="M 108 134 C 110 156 108 182 110 206" />
          </g>
          {/* arms */}
          <path d="M 80 124 C 74 126 69 130 67 136" fill="none" stroke="#c3c9d6" strokeWidth="4.6" strokeLinecap="round" />
          <path d="M 120 122 C 128 116 134 108 138 100" fill="none" stroke="#c3c9d6" strokeWidth="4.6" strokeLinecap="round" />
          {/* rim light — pink on the left, cyan on the right */}
          <g fill="none" strokeLinecap="round">
            <path
              className="cl-vapor-rim cl-vapor-glow-pink"
              d="M 100 90 C 88 92 82 102 83 114 C 78 124 76 138 75 154 C 74 170 73 188 72 210"
              stroke="#ff5cb4"
              strokeWidth="1.4"
            />
            <path
              className="cl-vapor-rim cl-vapor-glow-cyan"
              d="M 100 90 C 112 92 118 102 117 114 C 122 124 124 138 125 154 C 126 170 127 188 128 210"
              stroke="#5cecff"
              strokeWidth="1.4"
            />
          </g>
          {/* lantern raised in the right hand */}
          <g>
            <path d="M 134 86 Q 141 79 148 86" fill="none" stroke="#dfe6ee" strokeWidth="1.6" />
            <path
              d="M 133 88 L 149 88 L 151 106 L 131 106 Z"
              fill="url(#clVaporChrome)"
              stroke="#8f97a8"
              strokeWidth="0.7"
            />
            <path
              className="cl-vapor-glow-star cl-vapor-twinkle"
              d="M 141 92 L 142.3 95.7 L 146 96 L 142.3 96.3 L 141 100 L 139.7 96.3 L 136 96 L 139.7 95.7 Z"
              fill="#fff3d0"
            />
          </g>
        </g>

        {/* hover chrome sheen — diagonal band clipped to the statue, screen blend */}
        <g clipPath="url(#clVaporFigClip)">
          <rect
            className="cl-vapor-sheen"
            x="30"
            y="60"
            width="70"
            height="170"
            fill="url(#clVaporSheen)"
          />
        </g>

        {/* IX — chrome gradient numeral, top center */}
        <text
          className="cl-vapor-glow-ix"
          x="100"
          y="40"
          textAnchor="middle"
          fontFamily="'Arial Black', Arial, Helvetica, sans-serif"
          fontWeight="900"
          fontSize="21"
          letterSpacing="7"
          fill="url(#clVaporChromeTx)"
          stroke="#2a0a44"
          strokeWidth="0.5"
        >
          IX
        </text>

        {/* THE HERMIT — italic serif with vertical latin accent */}
        <text
          className="cl-vapor-glow-pink"
          x="98"
          y="272"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontStyle="italic"
          fontSize="16"
          letterSpacing="3"
          fill="#ffd7f0"
        >
          THE HERMIT
        </text>
        <text
          x="182"
          y="252"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="6.5"
          letterSpacing="2"
          fill="#5cecff"
          opacity="0.9"
          transform="rotate(-90 182 252)"
        >
          EREMITA · MONTIS
        </text>
        {/* chrome underline */}
        <path
          className="cl-vapor-glow-cyan"
          d="M 46 282 H 150"
          stroke="url(#clVaporChromeTx)"
          strokeWidth="1.2"
          fill="none"
        />

        {/* scanlines — drifting slowly (period 4px) */}
        <rect
          className="cl-vapor-scandrift"
          x="0"
          y="-4"
          width="200"
          height="308"
          fill="url(#clVaporScan)"
        />
      </svg>
    </figure>
  );
}
