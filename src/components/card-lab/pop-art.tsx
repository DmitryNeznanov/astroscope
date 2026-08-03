/**
 * POP-ART — The Hermit (IX)
 * Roy Lichtenstein comic panel. Bold black outlines, flat primary fills
 * (red robe, yellow lantern, blue sky/mountain), and Ben-Day dots (uniform
 * SVG dot patterns) for ALL shading — sky, robe shadow, mountain, skin.
 * Yellow starburst with black outline rays behind the lantern. Comic chrome:
 * jagged yellow "IX." caption box top-left, red "THE HERMIT" strip bottom.
 * Palette strictly primary: red, yellow, blue, black, white.
 */
export default function PopArtHermitCard() {
  return (
    <figure
      className="cl-popart-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
      aria-label="The Hermit tarot card in Roy Lichtenstein pop-art comic style"
    >
      <style>{`
        .cl-popart-card {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          background: #ffffff;
        }
        .cl-popart-card svg { display: block; width: 100%; height: 100%; }
        .cl-popart-text {
          font-family: "Arial Black", Arial, Helvetica, sans-serif;
          font-weight: 900;
        }
        /* gentle pulse on the star inside the lantern */
        @keyframes cl-popart-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .cl-popart-star { animation: cl-popart-glow 2.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .cl-popart-star { animation: none; }
        }
      `}</style>

      <svg
        viewBox="0 0 200 300"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-hidden="true"
      >
        <defs>
          {/* Ben-Day dot patterns — uniform dots, all shading is dots */}
          <pattern
            id="cl-popart-dots-sky"
            width="7"
            height="7"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="3.5" cy="3.5" r="1.7" fill="#2b6fd6" />
          </pattern>
          <pattern
            id="cl-popart-dots-mountain"
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="3" cy="3" r="1.6" fill="#0a2a6e" />
          </pattern>
          <pattern
            id="cl-popart-dots-shade"
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="3" cy="3" r="1.5" fill="#0a0a0a" />
          </pattern>
          <pattern
            id="cl-popart-dots-skin"
            width="4"
            height="4"
            patternUnits="userSpaceOnUse"
          >
            <rect width="4" height="4" fill="#ffffff" />
            <circle cx="2" cy="2" r="1" fill="#e32020" />
          </pattern>
        </defs>

        {/* ---- panel frame ---- */}
        <rect x="0" y="0" width="200" height="300" fill="#ffffff" />

        {/* ---- sky: white + blue Ben-Day dots ---- */}
        <rect x="4" y="4" width="192" height="258" fill="#ffffff" />
        <rect x="4" y="4" width="192" height="258" fill="url(#cl-popart-dots-sky)" />

        {/* ---- lantern starburst: yellow explosion + black outline rays ---- */}
        <g strokeLinejoin="round">
          <line x1="76" y1="52" x2="76" y2="42" stroke="#0a0a0a" strokeWidth="3.5" />
          <line x1="110" y1="62" x2="117" y2="55" stroke="#0a0a0a" strokeWidth="3.5" />
          <line x1="120" y1="96" x2="131" y2="96" stroke="#0a0a0a" strokeWidth="3.5" />
          <line x1="42" y1="62" x2="35" y2="55" stroke="#0a0a0a" strokeWidth="3.5" />
          <line x1="32" y1="96" x2="21" y2="96" stroke="#0a0a0a" strokeWidth="3.5" />
          <polygon
            points="76.0,60.0 81.4,75.7 94.0,64.8 90.8,81.2 107.2,78.0 96.3,90.6 112.0,96.0 96.3,101.4 107.2,114.0 90.8,110.8 94.0,127.2 81.4,116.3 76.0,132.0 70.6,116.3 58.0,127.2 61.2,110.8 44.8,114.0 55.7,101.4 40.0,96.0 55.7,90.6 44.8,78.0 61.2,81.2 58.0,64.8 70.6,75.7"
            fill="#ffe719"
            stroke="#0a0a0a"
            strokeWidth="3.5"
          />
        </g>

        {/* ---- mountains: flat blue + dark blue Ben-Day dots ---- */}
        <g strokeLinejoin="round">
          <polygon
            points="4,222 35,170 60,206 85,158 110,206 140,164 170,202 196,174 196,262 4,262"
            fill="#1e50c8"
            stroke="#0a0a0a"
            strokeWidth="3.5"
          />
          <polygon
            points="4,222 35,170 60,206 85,158 110,206 140,164 170,202 196,174 196,262 4,262"
            fill="url(#cl-popart-dots-mountain)"
          />
          {/* snow cap on the tallest peak, white with black outline */}
          <polygon
            points="73,178 85,158 97,178 90,172 85,180 80,172"
            fill="#ffffff"
            stroke="#0a0a0a"
            strokeWidth="2.5"
          />
        </g>

        {/* ---- the hermit ---- */}
        <g strokeLinejoin="round" strokeLinecap="round">
          {/* staff in right hand */}
          <line x1="146" y1="128" x2="157" y2="252" stroke="#0a0a0a" strokeWidth="4.5" />
          <circle cx="146" cy="126" r="4" fill="#ffe719" stroke="#0a0a0a" strokeWidth="2.5" />

          {/* raised left sleeve holding the lantern */}
          <polygon
            points="104,142 84,104 98,95 117,131"
            fill="#e32020"
            stroke="#0a0a0a"
            strokeWidth="3.5"
          />

          {/* lantern: yellow, black outline, star inside */}
          <g>
            <path
              d="M84,88 Q91,78 98,88"
              fill="none"
              stroke="#0a0a0a"
              strokeWidth="2.5"
            />
            <rect
              x="82"
              y="88"
              width="18"
              height="20"
              rx="2"
              fill="#ffe719"
              stroke="#0a0a0a"
              strokeWidth="3"
            />
            <line x1="82" y1="98" x2="100" y2="98" stroke="#0a0a0a" strokeWidth="1.5" />
            <polygon
              className="cl-popart-star"
              points="91,90 92.5,94 96.5,94 93.2,96.5 94.4,100.5 91,98 87.6,100.5 88.8,96.5 85.5,94 89.5,94"
              fill="#ffffff"
              stroke="#0a0a0a"
              strokeWidth="1.2"
            />
          </g>

          {/* robe: flat red, thick outline */}
          <path
            d="M122,110
               C110,114 104,124 102,138
               C99,156 97,186 95,214
               L93,250 L153,250 L151,212
               C149,184 147,156 143,138
               C141,124 134,114 122,110 Z"
            fill="#e32020"
            stroke="#0a0a0a"
            strokeWidth="4"
          />
          {/* robe shading: black Ben-Day dots only */}
          <path
            d="M133,118
               C143,132 147,170 149,250
               L134,250 C136,196 135,150 129,122 Z"
            fill="url(#cl-popart-dots-shade)"
          />
          {/* robe fold lines */}
          <path d="M108,160 C106,190 105,220 104,246" fill="none" stroke="#0a0a0a" strokeWidth="2.5" />
          <path d="M118,170 C117,200 116,225 116,246" fill="none" stroke="#0a0a0a" strokeWidth="2" />

          {/* hood opening + face (skin = red Ben-Day dots on white) */}
          <path
            d="M122,116 C113,120 110,129 111,138 C117,133 127,133 133,138 C134,129 131,120 122,116 Z"
            fill="#0a0a0a"
          />
          <ellipse
            cx="122"
            cy="133"
            rx="6"
            ry="7"
            fill="url(#cl-popart-dots-skin)"
            stroke="#0a0a0a"
            strokeWidth="2"
          />
          <circle cx="119.5" cy="132" r="1" fill="#0a0a0a" />
          <circle cx="124.5" cy="132" r="1" fill="#0a0a0a" />
        </g>

        {/* ---- thought bubble with '...' ---- */}
        <g>
          <circle cx="152" cy="112" r="2" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1.8" />
          <circle cx="160" cy="103" r="3" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1.8" />
          <ellipse
            cx="176"
            cy="90"
            rx="17"
            ry="11"
            fill="#ffffff"
            stroke="#0a0a0a"
            strokeWidth="2.5"
          />
          <text
            x="176"
            y="94"
            textAnchor="middle"
            className="cl-popart-text"
            fontSize="11"
            fill="#0a0a0a"
          >
            ...
          </text>
        </g>

        {/* ---- jagged 'IX.' caption box, top-left ---- */}
        <g strokeLinejoin="round">
          <polygon
            points="6,14 12,8 20,12 28,7 36,12 44,8 52,12 62,9 66,16 61,22 66,28 60,34 64,40 54,38 46,43 38,38 28,42 20,37 10,40 13,32 6,27 12,21"
            fill="#ffe719"
            stroke="#0a0a0a"
            strokeWidth="3"
          />
          <text
            x="35"
            y="32"
            textAnchor="middle"
            className="cl-popart-text"
            fontSize="19"
            fill="#0a0a0a"
          >
            IX.
          </text>
        </g>

        {/* ---- bottom caption strip: white bold caps on red ---- */}
        <rect
          x="4"
          y="262"
          width="192"
          height="30"
          fill="#e32020"
          stroke="#0a0a0a"
          strokeWidth="4"
        />
        <text
          x="100"
          y="283"
          textAnchor="middle"
          className="cl-popart-text"
          fontSize="15"
          letterSpacing="2.5"
          fill="#ffffff"
        >
          THE HERMIT
        </text>

        {/* ---- thick panel border ---- */}
        <rect
          x="3"
          y="3"
          width="194"
          height="294"
          fill="none"
          stroke="#0a0a0a"
          strokeWidth="6"
        />
      </svg>
    </figure>
  );
}
