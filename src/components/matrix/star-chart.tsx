/**
 * Destiny Matrix — STAR CHART variant.
 * Constellation atlas treatment: glowing star nodes, hairline chart lines,
 * dashed celestial coordinate ring with degree labels, diffraction-spiked
 * center star, faint starfield + one background constellation.
 * Server-component safe: no hooks, CSS-only animations (prefix mx-star-chart-).
 */
export default function StarChartMatrix() {
  const mono = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  const serif = "Georgia, 'Times New Roman', serif";

  return (
    <figure style={{ aspectRatio: "1/1", width: "100%", margin: 0 }}>
      <style>{`
        .mx-star-chart-line{stroke-dasharray:1;stroke-dashoffset:0;animation:mx-star-chart-draw 1.1s ease-out both}
        .mx-star-chart-pop{transform-box:fill-box;transform-origin:center;animation:mx-star-chart-pop .8s cubic-bezier(.25,.7,.3,1.35) both}
        .mx-star-chart-fade{animation:mx-star-chart-fade 1.2s ease-out both}
        .mx-star-chart-twinkle-a{animation:mx-star-chart-twinkle 19s ease-in-out infinite alternate}
        .mx-star-chart-twinkle-b{animation:mx-star-chart-twinkle 27s ease-in-out infinite alternate}
        .mx-star-chart-twinkle-c{animation:mx-star-chart-twinkle 36s ease-in-out infinite alternate}
        .mx-star-chart-spin{transform-origin:200px 200px;animation:mx-star-chart-spin 140s linear infinite}
        .mx-star-chart-breathe{transform-box:fill-box;transform-origin:center;animation:mx-star-chart-breathe 22s ease-in-out infinite alternate}
        @keyframes mx-star-chart-draw{from{stroke-dashoffset:1}}
        @keyframes mx-star-chart-pop{from{opacity:0;transform:scale(.15)}}
        @keyframes mx-star-chart-fade{from{opacity:0}}
        @keyframes mx-star-chart-twinkle{from{opacity:.45}to{opacity:1}}
        @keyframes mx-star-chart-spin{to{transform:rotate(360deg)}}
        @keyframes mx-star-chart-breathe{from{opacity:.75;transform:scale(.96)}to{opacity:1;transform:scale(1.05)}}
        @media (prefers-reduced-motion:reduce){
          .mx-star-chart-line,.mx-star-chart-pop,.mx-star-chart-fade,.mx-star-chart-twinkle-a,.mx-star-chart-twinkle-b,.mx-star-chart-twinkle-c,.mx-star-chart-spin,.mx-star-chart-breathe{animation:none}
        }
      `}</style>

      <svg
        viewBox="0 0 400 400"
        width="100%"
        height="100%"
        role="img"
        aria-label="Destiny Matrix rendered as a constellation star chart"
      >
        <defs>
          <radialGradient id="mxsc-glow">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#a9c6ff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#a9c6ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="mxsc-glow-center">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="25%" stopColor="#cfe2ff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#8fb0ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* night-sky backdrop */}
        <rect x="0" y="0" width="400" height="400" fill="#070b1a" />

        {/* starfield (three twinkle groups) */}
        <g className="mx-star-chart-twinkle-a" fill="#dbe6ff">
          <circle cx="22" cy="60" r="0.8" opacity="0.3" />
          <circle cx="58" cy="24" r="0.6" opacity="0.25" />
          <circle cx="90" cy="52" r="1" opacity="0.35" />
          <circle cx="140" cy="18" r="0.7" opacity="0.3" />
          <circle cx="188" cy="30" r="0.5" opacity="0.25" />
          <circle cx="244" cy="16" r="0.9" opacity="0.3" />
          <circle cx="286" cy="52" r="0.6" opacity="0.25" />
          <circle cx="336" cy="22" r="0.8" opacity="0.3" />
          <circle cx="372" cy="96" r="0.6" opacity="0.25" />
          <circle cx="24" cy="150" r="0.7" opacity="0.3" />
          <circle cx="52" cy="196" r="0.5" opacity="0.22" />
          <circle cx="30" cy="250" r="0.9" opacity="0.3" />
        </g>
        <g className="mx-star-chart-twinkle-b" fill="#c3d4f8">
          <circle cx="378" cy="180" r="0.7" opacity="0.28" />
          <circle cx="368" cy="238" r="0.5" opacity="0.22" />
          <circle cx="384" cy="300" r="0.8" opacity="0.3" />
          <circle cx="352" cy="352" r="0.6" opacity="0.25" />
          <circle cx="300" cy="384" r="0.9" opacity="0.3" />
          <circle cx="244" cy="372" r="0.5" opacity="0.22" />
          <circle cx="190" cy="386" r="0.7" opacity="0.28" />
          <circle cx="136" cy="374" r="0.6" opacity="0.25" />
          <circle cx="84" cy="384" r="0.8" opacity="0.3" />
          <circle cx="36" cy="344" r="0.6" opacity="0.25" />
          <circle cx="16" cy="300" r="0.5" opacity="0.22" />
          <circle cx="60" cy="120" r="0.6" opacity="0.25" />
        </g>
        <g className="mx-star-chart-twinkle-c" fill="#aebfee">
          <circle cx="110" cy="80" r="0.5" opacity="0.2" />
          <circle cx="160" cy="60" r="0.6" opacity="0.22" />
          <circle cx="250" cy="80" r="0.5" opacity="0.2" />
          <circle cx="330" cy="140" r="0.6" opacity="0.22" />
          <circle cx="330" cy="260" r="0.5" opacity="0.2" />
          <circle cx="260" cy="330" r="0.6" opacity="0.22" />
          <circle cx="150" cy="340" r="0.5" opacity="0.2" />
          <circle cx="70" cy="270" r="0.6" opacity="0.22" />
          <circle cx="100" cy="180" r="0.45" opacity="0.18" />
          <circle cx="300" cy="200" r="0.45" opacity="0.18" />
          <circle cx="200" cy="110" r="0.4" opacity="0.16" />
          <circle cx="210" cy="300" r="0.4" opacity="0.16" />
        </g>

        {/* faint background constellation, upper-right sky */}
        <g className="mx-star-chart-fade" style={{ animationDelay: "1.3s" }}>
          <polyline
            points="306,34 330,52 354,42 372,64 352,84"
            fill="none"
            stroke="#93a8d8"
            strokeWidth="0.6"
            opacity="0.2"
          />
          <g fill="#cdd9f6" opacity="0.4">
            <circle cx="306" cy="34" r="1.2" />
            <circle cx="330" cy="52" r="1" />
            <circle cx="354" cy="42" r="1.2" />
            <circle cx="372" cy="64" r="1" />
            <circle cx="352" cy="84" r="1.1" />
          </g>
        </g>

        {/* celestial coordinate ring: dashed circle + ticks, ultra-slow rotation */}
        <g className="mx-star-chart-spin">
          <circle
            cx="200"
            cy="200"
            r="170"
            fill="none"
            stroke="#3a4a72"
            strokeWidth="0.8"
            strokeDasharray="2 5"
            opacity="0.9"
          />
          <g stroke="#4a5c8a" strokeWidth="0.9" opacity="0.8">
            <line x1="200" y1="35" x2="200" y2="25" />
            <line x1="365" y1="200" x2="375" y2="200" />
            <line x1="200" y1="365" x2="200" y2="375" />
            <line x1="35" y1="200" x2="25" y2="200" />
            <line x1="316.7" y1="83.3" x2="323.7" y2="76.3" />
            <line x1="316.7" y1="316.7" x2="323.7" y2="323.7" />
            <line x1="83.3" y1="316.7" x2="76.3" y2="323.7" />
            <line x1="83.3" y1="83.3" x2="76.3" y2="76.3" />
          </g>
        </g>

        {/* degree labels at the inter-cardinal bearings */}
        <g
          className="mx-star-chart-fade"
          style={{ animationDelay: "1.05s" }}
          fontFamily={mono}
          fontSize="8"
          fill="#55648a"
          textAnchor="middle"
        >
          <text x="270.6" y="32.9">0°</text>
          <text x="370.3" y="132.5">45°</text>
          <text x="370.3" y="273.5">90°</text>
          <text x="270.6" y="373.1">135°</text>
          <text x="129.4" y="373.1">180°</text>
          <text x="29.7" y="273.5">225°</text>
          <text x="29.7" y="132.5">270°</text>
          <text x="129.4" y="32.9">315°</text>
        </g>

        {/* octagram: axis square + diamond square + 4 cardinal spokes */}
        <g fill="none" strokeLinecap="round">
          <polygon
            className="mx-star-chart-line"
            style={{ animationDelay: "0.05s" }}
            pathLength={1}
            points="110.9,110.9 289.1,110.9 289.1,289.1 110.9,289.1"
            stroke="#7f97c9"
            strokeWidth="0.8"
            opacity="0.45"
          />
          <polygon
            className="mx-star-chart-line"
            style={{ animationDelay: "0.15s" }}
            pathLength={1}
            points="200,74 326,200 200,326 74,200"
            stroke="#7f97c9"
            strokeWidth="0.8"
            opacity="0.45"
          />
          <g stroke="#6c83b8" strokeWidth="0.7" opacity="0.35">
            <line className="mx-star-chart-line" style={{ animationDelay: "0.28s" }} pathLength={1} x1="200" y1="200" x2="200" y2="74" />
            <line className="mx-star-chart-line" style={{ animationDelay: "0.34s" }} pathLength={1} x1="200" y1="200" x2="326" y2="200" />
            <line className="mx-star-chart-line" style={{ animationDelay: "0.4s" }} pathLength={1} x1="200" y1="200" x2="200" y2="326" />
            <line className="mx-star-chart-line" style={{ animationDelay: "0.46s" }} pathLength={1} x1="200" y1="200" x2="74" y2="200" />
          </g>
        </g>

        {/* age labels on the ring */}
        <g
          className="mx-star-chart-fade"
          style={{ animationDelay: "0.95s" }}
          fontFamily={mono}
          fontSize="9"
          fill="#7d8fb3"
          textAnchor="middle"
          dominantBaseline="central"
        >
          <text x="54" y="200">0y</text>
          <text x="96.8" y="96.8">10y</text>
          <text x="200" y="54">20y</text>
          <text x="303.2" y="96.8">30y</text>
          <text x="346" y="200">40y</text>
          <text x="303.2" y="303.2">50y</text>
          <text x="200" y="346">60y</text>
          <text x="96.8" y="303.2">70y</text>
        </g>

        {/* 12 inner stars along the spokes / square edges */}
        <g fontFamily={mono} fontSize="9" fill="#93a9d6">
          <g className="mx-star-chart-pop" style={{ animationDelay: "1s" }}>
            <circle cx="200" cy="138" r="6" fill="url(#mxsc-glow)" opacity="0.55" />
            <circle cx="200" cy="138" r="1.2" fill="#e8efff" />
            <text x="208" y="134">19</text>
          </g>
          <g className="mx-star-chart-pop" style={{ animationDelay: "1.05s" }}>
            <circle cx="243.8" cy="156.2" r="6" fill="url(#mxsc-glow)" opacity="0.55" />
            <circle cx="243.8" cy="156.2" r="1.2" fill="#e8efff" />
            <text x="251.8" y="152.2">12</text>
          </g>
          <g className="mx-star-chart-pop" style={{ animationDelay: "1.1s" }}>
            <circle cx="262" cy="200" r="6" fill="url(#mxsc-glow)" opacity="0.55" />
            <circle cx="262" cy="200" r="1.2" fill="#e8efff" />
            <text x="270" y="196">8</text>
          </g>
          <g className="mx-star-chart-pop" style={{ animationDelay: "1.15s" }}>
            <circle cx="243.8" cy="243.8" r="6" fill="url(#mxsc-glow)" opacity="0.55" />
            <circle cx="243.8" cy="243.8" r="1.2" fill="#e8efff" />
            <text x="251.8" y="239.8">20</text>
          </g>
          <g className="mx-star-chart-pop" style={{ animationDelay: "1.2s" }}>
            <circle cx="200" cy="262" r="6" fill="url(#mxsc-glow)" opacity="0.55" />
            <circle cx="200" cy="262" r="1.2" fill="#e8efff" />
            <text x="208" y="258">13</text>
          </g>
          <g className="mx-star-chart-pop" style={{ animationDelay: "1.25s" }}>
            <circle cx="156.2" cy="243.8" r="6" fill="url(#mxsc-glow)" opacity="0.55" />
            <circle cx="156.2" cy="243.8" r="1.2" fill="#e8efff" />
            <text x="164.2" y="239.8">21</text>
          </g>
          <g className="mx-star-chart-pop" style={{ animationDelay: "1.3s" }}>
            <circle cx="138" cy="200" r="6" fill="url(#mxsc-glow)" opacity="0.55" />
            <circle cx="138" cy="200" r="1.2" fill="#e8efff" />
            <text x="146" y="196">22</text>
          </g>
          <g className="mx-star-chart-pop" style={{ animationDelay: "1.35s" }}>
            <circle cx="156.2" cy="156.2" r="6" fill="url(#mxsc-glow)" opacity="0.55" />
            <circle cx="156.2" cy="156.2" r="1.2" fill="#e8efff" />
            <text x="164.2" y="152.2">12</text>
          </g>
          <g className="mx-star-chart-pop" style={{ animationDelay: "1.4s" }}>
            <circle cx="263" cy="137" r="6" fill="url(#mxsc-glow)" opacity="0.55" />
            <circle cx="263" cy="137" r="1.2" fill="#e8efff" />
            <text x="271" y="133">20</text>
          </g>
          <g className="mx-star-chart-pop" style={{ animationDelay: "1.42s" }}>
            <circle cx="263" cy="263" r="6" fill="url(#mxsc-glow)" opacity="0.55" />
            <circle cx="263" cy="263" r="1.2" fill="#e8efff" />
            <text x="271" y="259">8</text>
          </g>
          <g className="mx-star-chart-pop" style={{ animationDelay: "1.44s" }}>
            <circle cx="137" cy="263" r="6" fill="url(#mxsc-glow)" opacity="0.55" />
            <circle cx="137" cy="263" r="1.2" fill="#e8efff" />
            <text x="145" y="259">19</text>
          </g>
          <g className="mx-star-chart-pop" style={{ animationDelay: "1.46s" }}>
            <circle cx="137" cy="137" r="6" fill="url(#mxsc-glow)" opacity="0.55" />
            <circle cx="137" cy="137" r="1.2" fill="#e8efff" />
            <text x="145" y="133">6</text>
          </g>
        </g>

        {/* 8 outer stars: cardinals + diagonals */}
        <g fontFamily={mono} fontWeight="600" fill="#f4f8ff" textAnchor="middle" dominantBaseline="central">
          <g className="mx-star-chart-pop" style={{ animationDelay: "0.55s" }} fontSize="13">
            <circle cx="200" cy="74" r="13" fill="url(#mxsc-glow)" />
            <circle cx="200" cy="74" r="1.8" fill="#ffffff" />
            <text x="200" y="74">7</text>
          </g>
          <g className="mx-star-chart-pop" style={{ animationDelay: "0.65s" }} fontSize="12">
            <circle cx="326" cy="200" r="13" fill="url(#mxsc-glow)" />
            <circle cx="326" cy="200" r="1.8" fill="#ffffff" />
            <text x="326" y="200">10</text>
          </g>
          <g className="mx-star-chart-pop" style={{ animationDelay: "0.75s" }} fontSize="13">
            <circle cx="200" cy="326" r="13" fill="url(#mxsc-glow)" />
            <circle cx="200" cy="326" r="1.8" fill="#ffffff" />
            <text x="200" y="326">7</text>
          </g>
          <g className="mx-star-chart-pop" style={{ animationDelay: "0.85s" }} fontSize="13">
            <circle cx="74" cy="200" r="13" fill="url(#mxsc-glow)" />
            <circle cx="74" cy="200" r="1.8" fill="#ffffff" />
            <text x="74" y="200">8</text>
          </g>
          <g className="mx-star-chart-pop" style={{ animationDelay: "0.6s" }} fontSize="12">
            <circle cx="110.9" cy="110.9" r="13" fill="url(#mxsc-glow)" />
            <circle cx="110.9" cy="110.9" r="1.8" fill="#ffffff" />
            <text x="110.9" y="110.9">15</text>
          </g>
          <g className="mx-star-chart-pop" style={{ animationDelay: "0.7s" }} fontSize="12">
            <circle cx="289.1" cy="110.9" r="13" fill="url(#mxsc-glow)" />
            <circle cx="289.1" cy="110.9" r="1.8" fill="#ffffff" />
            <text x="289.1" y="110.9">17</text>
          </g>
          <g className="mx-star-chart-pop" style={{ animationDelay: "0.8s" }} fontSize="12">
            <circle cx="289.1" cy="289.1" r="13" fill="url(#mxsc-glow)" />
            <circle cx="289.1" cy="289.1" r="1.8" fill="#ffffff" />
            <text x="289.1" y="289.1">17</text>
          </g>
          <g className="mx-star-chart-pop" style={{ animationDelay: "0.9s" }} fontSize="12">
            <circle cx="110.9" cy="289.1" r="13" fill="url(#mxsc-glow)" />
            <circle cx="110.9" cy="289.1" r="1.8" fill="#ffffff" />
            <text x="110.9" y="289.1">15</text>
          </g>
        </g>

        {/* center: brightest star with diffraction spikes */}
        <g className="mx-star-chart-pop" style={{ animationDelay: "0.45s" }}>
          <g className="mx-star-chart-breathe">
            <g stroke="#dceaff" strokeLinecap="round">
              <line x1="200" y1="158" x2="200" y2="242" strokeWidth="1.2" opacity="0.75" />
              <line x1="158" y1="200" x2="242" y2="200" strokeWidth="1.2" opacity="0.75" />
              <line x1="186" y1="186" x2="214" y2="214" strokeWidth="0.7" opacity="0.4" />
              <line x1="214" y1="186" x2="186" y2="214" strokeWidth="0.7" opacity="0.4" />
            </g>
            <circle cx="200" cy="200" r="30" fill="url(#mxsc-glow-center)" />
            <circle cx="200" cy="200" r="10" fill="#f8fbff" />
            <text
              x="200"
              y="200"
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={mono}
              fontWeight="700"
              fontSize="14"
              fill="#101b3a"
            >
              5
            </text>
          </g>
        </g>

        {/* header */}
        <text
          className="mx-star-chart-fade"
          style={{ animationDelay: "0.2s" }}
          x="200"
          y="15"
          textAnchor="middle"
          fontFamily={serif}
          fontSize="10.5"
          letterSpacing="2.5"
          fill="#b8c6e8"
        >
          Day 8 · Month 7 · Year 10 · Base 7 · Center 5
        </text>
      </svg>
    </figure>
  );
}
