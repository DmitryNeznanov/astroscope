import React from "react";

/**
 * CINEMATIC STILL — The Hermit (IX)
 * A letterboxed film still from an epic fantasy movie:
 * night mountain ridge, hooded silhouette, volumetric lantern light,
 * teal-shadow / warm-highlight blockbuster grade, film grain.
 * Server-component safe: no hooks, no handlers, CSS-only animation.
 */
export default function CinematicStillCard() {
  return (
    <figure
      className="cz-cinematic-still"
      style={{ aspectRatio: "2/3", width: "100%" }}
      aria-label="The Hermit, Major Arcana IX — cinematic film still tarot card"
    >
      <style>{`
        .cz-cinematic-still {
          position: relative;
          margin: 0;
          overflow: hidden;
          background: #000;
          border-radius: 2.5cqw;
          container-type: inline-size;
          box-shadow: 0 1.2cqw 4cqw rgba(0, 0, 0, 0.65);
          animation: cz-cs-fade-in 1.2s ease-out both;
          font-family: "Helvetica Neue", Helvetica, Arial, "Segoe UI", sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        .cz-cs-bar {
          position: absolute;
          left: 0;
          right: 0;
          background: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 3;
        }
        .cz-cs-bar-top {
          top: 0;
          height: 26%;
        }
        .cz-cs-bar-bottom {
          bottom: 0;
          height: 46%;
        }
        .cz-cs-numeral {
          color: rgba(255, 255, 255, 0.82);
          font-size: 4.2cqw;
          font-weight: 300;
          letter-spacing: 0.55em;
          text-indent: 0.55em;
          line-height: 1;
        }
        .cz-cs-title {
          color: rgba(255, 255, 255, 0.92);
          font-size: 6.4cqw;
          font-weight: 300;
          letter-spacing: 0.34em;
          text-indent: 0.34em;
          line-height: 1;
          text-align: center;
        }
        .cz-cs-subtitle {
          margin-top: 3.2cqw;
          color: rgba(255, 255, 255, 0.42);
          font-size: 2.5cqw;
          font-weight: 300;
          letter-spacing: 0.62em;
          text-indent: 0.62em;
          line-height: 1;
        }
        .cz-cs-rule {
          width: 16cqw;
          height: 1px;
          margin-top: 4.5cqw;
          background: linear-gradient(90deg, transparent, rgba(255, 179, 107, 0.5), transparent);
        }
        .cz-cs-scene-wrap {
          position: absolute;
          left: 0;
          right: 0;
          top: 26%;
          height: 28%;
          overflow: hidden;
          z-index: 1;
          background: #04080e;
        }
        .cz-cs-scene {
          width: 100%;
          height: 100%;
          transform-origin: 50% 55%;
          animation: cz-cs-kenburns 38s ease-in-out 1.4s infinite alternate;
          will-change: transform;
        }
        .cz-cs-scene svg {
          display: block;
          width: 100%;
          height: 100%;
        }
        .cz-cs-cone {
          opacity: 0.85;
          animation: cz-cs-cone-in 1.6s ease-out 1.1s both;
        }
        .cz-cs-lantern-glow {
          animation: cz-cs-lantern-in 1.4s ease-out 1.2s both,
                     cz-cs-lantern-breathe 14s ease-in-out 2.8s infinite alternate;
        }
        .cz-cs-rays {
          opacity: 0.28;
          animation: cz-cs-cone-in 1.6s ease-out 1.25s both,
                     cz-cs-rays-shimmer 9s ease-in-out 3s infinite alternate;
        }
        .cz-cs-twinkle-a { animation: cz-cs-twinkle 11s ease-in-out infinite alternate; }
        .cz-cs-twinkle-b { animation: cz-cs-twinkle 17s ease-in-out 4s infinite alternate; }

        @keyframes cz-cs-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cz-cs-kenburns {
          from { transform: scale(1) translateY(0); }
          to   { transform: scale(1.05) translateY(-0.6%); }
        }
        @keyframes cz-cs-cone-in {
          from { opacity: 0; }
        }
        @keyframes cz-cs-lantern-in {
          from { opacity: 0; }
        }
        @keyframes cz-cs-lantern-breathe {
          from { opacity: 0.9; }
          to   { opacity: 1; }
        }
        @keyframes cz-cs-rays-shimmer {
          from { opacity: 0.2; }
          to   { opacity: 0.34; }
        }
        @keyframes cz-cs-twinkle {
          from { opacity: 0.35; }
          to   { opacity: 0.95; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cz-cinematic-still,
          .cz-cs-scene,
          .cz-cs-cone,
          .cz-cs-lantern-glow,
          .cz-cs-rays,
          .cz-cs-twinkle-a,
          .cz-cs-twinkle-b {
            animation: none;
          }
          .cz-cs-cone { opacity: 0.85; }
          .cz-cs-rays { opacity: 0.28; }
          .cz-cs-lantern-glow { opacity: 1; }
        }
      `}</style>

      {/* Top letterbox bar */}
      <div className="cz-cs-bar cz-cs-bar-top">
        <span className="cz-cs-numeral">IX</span>
      </div>

      {/* Letterboxed scene (~2.39:1) */}
      <div className="cz-cs-scene-wrap">
        <div className="cz-cs-scene">
          <svg
            viewBox="0 0 239 100"
            preserveAspectRatio="xMidYMid slice"
            role="img"
            aria-hidden="true"
          >
            <defs>
              {/* Night sky gradient */}
              <linearGradient id="czcs-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#02060d" />
                <stop offset="0.55" stopColor="#071625" />
                <stop offset="1" stopColor="#0e2a38" />
              </linearGradient>
              {/* Snow slope gradient — cold teal */}
              <linearGradient id="czcs-snow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2c5468" />
                <stop offset="0.5" stopColor="#16303e" />
                <stop offset="1" stopColor="#0a1a24" />
              </linearGradient>
              {/* Volumetric light cone — warm core fading out */}
              <linearGradient id="czcs-cone" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0" stopColor="#ffb36b" stopOpacity="0.75" />
                <stop offset="0.45" stopColor="#ffb36b" stopOpacity="0.28" />
                <stop offset="1" stopColor="#ffb36b" stopOpacity="0" />
              </linearGradient>
              {/* Lantern core glow */}
              <radialGradient id="czcs-glow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#fff3dd" stopOpacity="1" />
                <stop offset="0.25" stopColor="#ffcf94" stopOpacity="0.85" />
                <stop offset="0.6" stopColor="#ffb36b" stopOpacity="0.32" />
                <stop offset="1" stopColor="#ffb36b" stopOpacity="0" />
              </radialGradient>
              {/* Warm pool where light meets snow */}
              <radialGradient id="czcs-pool" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#ffb36b" stopOpacity="0.34" />
                <stop offset="1" stopColor="#ffb36b" stopOpacity="0" />
              </radialGradient>
              {/* Horizon haze */}
              <radialGradient id="czcs-haze" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#7fb3c8" stopOpacity="0.16" />
                <stop offset="1" stopColor="#7fb3c8" stopOpacity="0" />
              </radialGradient>
              {/* Cinematic vignette / grade */}
              <radialGradient id="czcs-vignette" cx="0.5" cy="0.46" r="0.75">
                <stop offset="0" stopColor="#000000" stopOpacity="0" />
                <stop offset="0.7" stopColor="#02131c" stopOpacity="0.18" />
                <stop offset="1" stopColor="#00060a" stopOpacity="0.55" />
              </radialGradient>
              {/* Soft blur for light volumes */}
              <filter id="czcs-soft" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="1.6" />
              </filter>
              <filter id="czcs-softer" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="3.2" />
              </filter>
              {/* Film grain */}
              <filter id="czcs-grain" x="0" y="0" width="100%" height="100%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.9"
                  numOctaves="2"
                  stitchTiles="stitch"
                  seed="7"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.9  0 0 0 0 0.95  0 0 0 0 1  0 0 0 0.05 0"
                />
              </filter>
            </defs>

            {/* Sky */}
            <rect x="0" y="0" width="239" height="100" fill="url(#czcs-sky)" />

            {/* Stars */}
            <g fill="#e8f2f8">
              <circle cx="18" cy="12" r="0.45" opacity="0.7" />
              <circle cx="41" cy="26" r="0.3" opacity="0.5" />
              <circle cx="63" cy="9" r="0.55" opacity="0.8" className="cz-cs-twinkle-a" />
              <circle cx="86" cy="21" r="0.3" opacity="0.45" />
              <circle cx="112" cy="7" r="0.4" opacity="0.6" />
              <circle cx="134" cy="17" r="0.3" opacity="0.4" />
              <circle cx="158" cy="10" r="0.6" opacity="0.85" className="cz-cs-twinkle-b" />
              <circle cx="181" cy="24" r="0.35" opacity="0.5" />
              <circle cx="204" cy="8" r="0.45" opacity="0.7" />
              <circle cx="224" cy="20" r="0.3" opacity="0.45" />
              <circle cx="97" cy="33" r="0.25" opacity="0.35" />
              <circle cx="146" cy="30" r="0.25" opacity="0.35" />
              <circle cx="30" cy="38" r="0.25" opacity="0.3" />
              <circle cx="196" cy="35" r="0.25" opacity="0.3" />
            </g>

            {/* Horizon haze */}
            <ellipse cx="120" cy="62" rx="130" ry="18" fill="url(#czcs-haze)" />

            {/* Distant ridge */}
            <path
              d="M0 66 L26 52 L48 60 L74 46 L98 57 L124 44 L150 58 L176 48 L202 60 L239 50 L239 100 L0 100 Z"
              fill="#0a1a26"
            />

            {/* Warm pool on the snow where the lantern light lands */}
            <ellipse cx="70" cy="88" rx="42" ry="12" fill="url(#czcs-pool)" />

            {/* Foreground snow slope with the hermit's peak */}
            <path
              d="M0 100 L0 84 L30 80 L58 84 L84 76 L96 70 L104 76 L132 84 L168 80 L206 86 L239 82 L239 100 Z"
              fill="url(#czcs-snow)"
            />
            {/* Snow rim highlights, cold teal */}
            <path
              d="M0 84 L30 80 L58 84 L84 76 L96 70 L104 76 L132 84"
              fill="none"
              stroke="#4d8193"
              strokeWidth="0.5"
              opacity="0.55"
            />
            <path
              d="M132 84 L168 80 L206 86 L239 82"
              fill="none"
              stroke="#3a6878"
              strokeWidth="0.4"
              opacity="0.4"
            />

            {/* Volumetric light cone from the lantern */}
            <g className="cz-cs-cone" filter="url(#czcs-softer)">
              <path d="M84 38 L34 100 L142 100 Z" fill="url(#czcs-cone)" />
            </g>
            {/* Visible light rays through haze */}
            <g className="cz-cs-rays" filter="url(#czcs-soft)" fill="#ffd9a8">
              <path d="M83.4 39 L52 100 L60 100 Z" opacity="0.5" />
              <path d="M84.2 39 L80 100 L88 100 Z" opacity="0.65" />
              <path d="M84.8 39 L112 100 L120 100 Z" opacity="0.45" />
            </g>

            {/* The Hermit — hooded silhouette, from behind/side */}
            <g fill="#04070c">
              {/* Cloak and hood */}
              <path
                d="M92.5 84 L92 74 Q91.5 66 94.5 61 Q92.5 56 96.5 53.5
                   Q101 51 104.5 54.5 Q107.5 57.5 105.5 61.5
                   L108.5 66 L107.5 84 Z"
              />
              {/* Raised arm reaching up to the lantern */}
              <path d="M95.5 60.5 L87 44.5 L89.4 43.4 L97.6 58.6 Z" />
              {/* Staff held in the other hand, planted on the rock */}
              <rect x="110.6" y="52" width="1.1" height="33" rx="0.5" />
              <path d="M105.5 61 L110.8 63.5 L110.4 65.4 L104.8 63 Z" />
            </g>
            {/* Cold rim light on the figure's shadow side */}
            <path
              d="M104.5 54.5 Q107.5 57.5 105.5 61.5 L108.5 66 L107.5 84"
              fill="none"
              stroke="#3d7186"
              strokeWidth="0.45"
              opacity="0.5"
            />

            {/* Lantern */}
            <g className="cz-cs-lantern-glow">
              <circle cx="84" cy="40" r="13" fill="url(#czcs-glow)" />
            </g>
            <g>
              {/* Lantern body */}
              <path
                d="M81.4 37.2 L86.6 37.2 L87.4 43.4 L80.6 43.4 Z"
                fill="#0a0d10"
                stroke="#ffc98c"
                strokeWidth="0.35"
              />
              <rect x="82.6" y="35.4" width="2.8" height="1.9" rx="0.6" fill="#0a0d10" />
              {/* The small star inside */}
              <circle cx="84" cy="40.4" r="1.5" fill="#fff3dd" />
              <circle cx="84" cy="40.4" r="0.65" fill="#ffffff" />
            </g>

            {/* Grade + vignette */}
            <rect x="0" y="0" width="239" height="100" fill="url(#czcs-vignette)" />

            {/* Film grain */}
            <rect
              x="0"
              y="0"
              width="239"
              height="100"
              filter="url(#czcs-grain)"
              opacity="0.55"
            />
          </svg>
        </div>
      </div>

      {/* Bottom letterbox bar — film title */}
      <div className="cz-cs-bar cz-cs-bar-bottom">
        <span className="cz-cs-title">THE HERMIT</span>
        <span className="cz-cs-subtitle">MAJOR ARCANA</span>
        <span className="cz-cs-rule" />
      </div>
    </figure>
  );
}
