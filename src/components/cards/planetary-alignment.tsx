// Planetary Alignment — The Hermit (IX)
// A grand solar-system procession arcing over a tiny Hermit silhouette.
// All glyphs are followed by U+FE0E (text presentation) per project rule.

type Planet = {
  id: string;
  cx: number;
  cy: number;
  r: number;
  grad: string;
  glyph: string;
  label: string;
  labelDy: number;
  loadClass: string;
  driftClass: string;
};

const PLANETS: Planet[] = [
  { id: "mercury", cx: 118, cy: 196, r: 5,  grad: "url(#cz-align-mercury)", glyph: "☿\uFE0E", label: "MERCURY", labelDy: 18, loadClass: "cz-align-load-2", driftClass: "cz-align-drift-b" },
  { id: "venus",   cx: 172, cy: 158, r: 9,  grad: "url(#cz-align-venus)",   glyph: "♀\uFE0E", label: "VENUS",   labelDy: 22, loadClass: "cz-align-load-3", driftClass: "cz-align-drift-c" },
  { id: "mars",    cx: 228, cy: 132, r: 8,  grad: "url(#cz-align-mars)",    glyph: "♂\uFE0E", label: "MARS",    labelDy: 20, loadClass: "cz-align-load-4", driftClass: "cz-align-drift-a" },
  { id: "jupiter", cx: 286, cy: 116, r: 16, grad: "url(#cz-align-jupiter)", glyph: "♃\uFE0E", label: "JUPITER", labelDy: 28, loadClass: "cz-align-load-5", driftClass: "cz-align-drift-d" },
];

// Deterministic pseudo-random star field (no runtime deps).
const STARS = Array.from({ length: 64 }, (_, i) => {
  const x = (i * 137 + 41) % 400;
  const y = (i * 89 + 17) % 460;
  const r = 0.3 + ((i * 7) % 10) * 0.07;
  const o = 0.2 + ((i * 13) % 10) * 0.055;
  const tw = i % 9 === 0; // a few stars twinkle
  return { x, y, r, o, tw, key: i };
});

export default function PlanetaryAlignmentCard() {
  return (
    <figure
      className="cz-align-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0, position: "relative", overflow: "hidden" }}
      aria-label="The Hermit tarot card, planetary alignment style"
    >
      <style>{`
        .cz-align-card { background: #04081a; }
        .cz-align-svg { display: block; width: 100%; height: 100%; }

        /* ---- LOAD reveal: one-shot, staggered along the arc ---- */
        @keyframes cz-align-in {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cz-align-in-still {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .cz-align-load-1 { animation: cz-align-in 1s cubic-bezier(.22,.8,.3,1) 0.05s both; }
        .cz-align-load-2 { animation: cz-align-in 1s cubic-bezier(.22,.8,.3,1) 0.25s both; }
        .cz-align-load-3 { animation: cz-align-in 1s cubic-bezier(.22,.8,.3,1) 0.45s both; }
        .cz-align-load-4 { animation: cz-align-in 1s cubic-bezier(.22,.8,.3,1) 0.65s both; }
        .cz-align-load-5 { animation: cz-align-in 1s cubic-bezier(.22,.8,.3,1) 0.85s both; }
        .cz-align-load-6 { animation: cz-align-in 1s cubic-bezier(.22,.8,.3,1) 1.05s both; }
        .cz-align-load-7 { animation: cz-align-in 1s cubic-bezier(.22,.8,.3,1) 1.2s both; }
        .cz-align-load-hermit { animation: cz-align-in-still 1.2s ease-out 1.45s both; }
        .cz-align-load-frame { animation: cz-align-in-still 1.6s ease-out 0s both; }

        /* ---- AMBIENT: very slow drift, each planet its own phase ---- */
        @keyframes cz-align-drift-a { 0%,100% { transform: translate(0,0); } 50% { transform: translate(2.5px,-2px); } }
        @keyframes cz-align-drift-b { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-2px,2.5px); } }
        @keyframes cz-align-drift-c { 0%,100% { transform: translate(0,0); } 50% { transform: translate(2px,2px); } }
        @keyframes cz-align-drift-d { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-2.5px,-1.5px); } }
        .cz-align-drift-a { animation: cz-align-drift-a 44s ease-in-out -8s infinite; }
        .cz-align-drift-b { animation: cz-align-drift-b 52s ease-in-out -21s infinite; }
        .cz-align-drift-c { animation: cz-align-drift-c 47s ease-in-out -33s infinite; }
        .cz-align-drift-d { animation: cz-align-drift-d 59s ease-in-out -14s infinite; }

        /* Saturn ring sheen — slow catch of light */
        @keyframes cz-align-sheen {
          0%, 100% { opacity: 0.08; }
          50%      { opacity: 0.55; }
        }
        .cz-align-sheen { animation: cz-align-sheen 26s ease-in-out -6s infinite; }

        /* Sun corona breathing, barely perceptible */
        @keyframes cz-align-corona {
          0%, 100% { opacity: 0.75; }
          50%      { opacity: 1; }
        }
        .cz-align-corona { animation: cz-align-corona 34s ease-in-out infinite; }

        /* Sparse star twinkle */
        @keyframes cz-align-twinkle {
          0%, 100% { opacity: 0.25; }
          50%      { opacity: 0.9; }
        }
        .cz-align-twinkle { animation: cz-align-twinkle 17s ease-in-out infinite; }
        .cz-align-twinkle:nth-of-type(3n) { animation-duration: 23s; animation-delay: -9s; }
        .cz-align-twinkle:nth-of-type(4n) { animation-duration: 29s; animation-delay: -15s; }

        /* Lantern flame flicker, very gentle */
        @keyframes cz-align-flame {
          0%, 100% { opacity: 0.85; }
          50%      { opacity: 1; }
        }
        .cz-align-flame { animation: cz-align-flame 9s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .cz-align-card * { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      <svg
        className="cz-align-svg"
        viewBox="0 0 400 600"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="cz-align-bg" cx="50%" cy="30%" r="90%">
            <stop offset="0%" stopColor="#0b1533" />
            <stop offset="55%" stopColor="#070d24" />
            <stop offset="100%" stopColor="#03060f" />
          </radialGradient>

          <radialGradient id="cz-align-sun" cx="42%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#fff7dd" />
            <stop offset="35%" stopColor="#ffdf94" />
            <stop offset="75%" stopColor="#e8a13c" />
            <stop offset="100%" stopColor="#b06a1e" />
          </radialGradient>
          <radialGradient id="cz-align-sunglow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd98a" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#e8a13c" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#e8a13c" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="cz-align-mercury" cx="38%" cy="34%" r="70%">
            <stop offset="0%" stopColor="#c9c9d4" />
            <stop offset="60%" stopColor="#8a8a96" />
            <stop offset="100%" stopColor="#4c4c58" />
          </radialGradient>
          <radialGradient id="cz-align-venus" cx="38%" cy="34%" r="70%">
            <stop offset="0%" stopColor="#fff6e0" />
            <stop offset="55%" stopColor="#f0d9a0" />
            <stop offset="100%" stopColor="#a8863f" />
          </radialGradient>
          <radialGradient id="cz-align-mars" cx="38%" cy="34%" r="70%">
            <stop offset="0%" stopColor="#f2a075" />
            <stop offset="55%" stopColor="#c15a33" />
            <stop offset="100%" stopColor="#6e2a15" />
          </radialGradient>
          <radialGradient id="cz-align-jupiter" cx="40%" cy="32%" r="72%">
            <stop offset="0%" stopColor="#f4e3c2" />
            <stop offset="45%" stopColor="#d8b283" />
            <stop offset="80%" stopColor="#9a6f45" />
            <stop offset="100%" stopColor="#5e3f24" />
          </radialGradient>
          <radialGradient id="cz-align-saturn" cx="40%" cy="34%" r="70%">
            <stop offset="0%" stopColor="#f2e2b8" />
            <stop offset="55%" stopColor="#cfb26f" />
            <stop offset="100%" stopColor="#7d6335" />
          </radialGradient>
          <radialGradient id="cz-align-moon" cx="38%" cy="34%" r="70%">
            <stop offset="0%" stopColor="#f4f4f8" />
            <stop offset="60%" stopColor="#b9bcc9" />
            <stop offset="100%" stopColor="#5f6372" />
          </radialGradient>

          <linearGradient id="cz-align-ring" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e8d5a2" stopOpacity="0.1" />
            <stop offset="30%" stopColor="#efe0b4" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#c9ad6d" stopOpacity="0.45" />
            <stop offset="80%" stopColor="#efe0b4" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#e8d5a2" stopOpacity="0.12" />
          </linearGradient>

          <radialGradient id="cz-align-lantern" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe9b0" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#f2b95c" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f2b95c" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="cz-align-horizon" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0a1128" stopOpacity="0" />
            <stop offset="100%" stopColor="#02040c" />
          </linearGradient>
        </defs>

        {/* deep space */}
        <rect x="0" y="0" width="400" height="600" fill="url(#cz-align-bg)" />

        {/* star field */}
        <g>
          {STARS.map((s) => (
            <circle
              key={s.key}
              className={s.tw ? "cz-align-twinkle" : undefined}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill="#dfe6ff"
              opacity={s.o}
            />
          ))}
        </g>

        {/* hairline alignment arc the planets procession follows */}
        <path
          d="M 40 262 Q 210 60 372 148"
          fill="none"
          stroke="#8fa3d8"
          strokeOpacity="0.18"
          strokeWidth="0.6"
          strokeDasharray="1 4"
        />
        {/* second faint ecliptic hairline */}
        <path
          d="M 24 300 Q 220 96 390 196"
          fill="none"
          stroke="#8fa3d8"
          strokeOpacity="0.1"
          strokeWidth="0.5"
        />

        {/* SUN — one end of the alignment */}
        <g className="cz-align-load-1">
          <g className="cz-align-drift-a">
            <circle className="cz-align-corona" cx="52" cy="252" r="52" fill="url(#cz-align-sunglow)" />
            <circle cx="52" cy="252" r="20" fill="url(#cz-align-sun)" />
            <circle cx="52" cy="252" r="30" fill="none" stroke="#e8c98a" strokeOpacity="0.14" strokeWidth="0.6" />
            <text x="52" y="292" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="8.5" letterSpacing="1.5" fill="#c9b98a" opacity="0.85">
              {"☉\uFE0E SUN"}
            </text>
          </g>
        </g>

        {/* procession of planets along the arc */}
        {PLANETS.map((p) => (
          <g key={p.id} className={p.loadClass}>
            <g className={p.driftClass}>
              {/* local hairline orbit ellipse */}
              <ellipse
                cx={p.cx}
                cy={p.cy}
                rx={p.r + 9}
                ry={(p.r + 9) * 0.42}
                fill="none"
                stroke="#9db1e0"
                strokeOpacity="0.16"
                strokeWidth="0.5"
                transform={`rotate(-14 ${p.cx} ${p.cy})`}
              />
              <circle cx={p.cx} cy={p.cy} r={p.r} fill={p.grad} />
              {/* terminator shadow for volume */}
              <circle cx={p.cx} cy={p.cy} r={p.r} fill="none" stroke="#000" strokeOpacity="0.25" strokeWidth="0.4" />
              {p.id === "jupiter" && (
                <g stroke="#7a5426" strokeOpacity="0.35" strokeWidth="1.1" fill="none">
                  <path d={`M ${p.cx - 13} ${p.cy - 4} Q ${p.cx} ${p.cy - 1} ${p.cx + 13} ${p.cy - 4}`} />
                  <path d={`M ${p.cx - 14} ${p.cy + 2} Q ${p.cx} ${p.cy + 5} ${p.cx + 14} ${p.cy + 2}`} />
                  <path d={`M ${p.cx - 11} ${p.cy + 8} Q ${p.cx} ${p.cy + 10} ${p.cx + 11} ${p.cy + 8}`} />
                </g>
              )}
              <text
                x={p.cx}
                y={p.cy + p.labelDy}
                textAnchor="middle"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontSize="8.5"
                letterSpacing="1.5"
                fill="#c9b98a"
                opacity="0.85"
              >
                {`${p.glyph} ${p.label}`}
              </text>
            </g>
          </g>
        ))}

        {/* SATURN — ringed, prominent; ruler of Virgo's solitary house */}
        <g className="cz-align-load-6">
          <g className="cz-align-drift-b">
            <g transform="rotate(-18 348 122)">
              <ellipse cx="348" cy="122" rx="34" ry="10" fill="none" stroke="url(#cz-align-ring)" strokeWidth="4.5" />
              <ellipse className="cz-align-sheen" cx="348" cy="122" rx="34" ry="10" fill="none" stroke="#fff3d0" strokeWidth="1.2" strokeDasharray="30 180" />
              <ellipse cx="348" cy="122" rx="27" ry="7.6" fill="none" stroke="#e8d5a2" strokeOpacity="0.3" strokeWidth="0.7" />
            </g>
            <circle cx="348" cy="122" r="13" fill="url(#cz-align-saturn)" />
            <path d="M 337 119 Q 348 122 359 119" stroke="#8a6c38" strokeOpacity="0.5" strokeWidth="1" fill="none" />
            <text x="348" y="150" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="8.5" letterSpacing="1.5" fill="#d8c48a" opacity="0.95">
              {"♄\uFE0E SATURN"}
            </text>
          </g>
        </g>

        {/* MOON — far end of the arc */}
        <g className="cz-align-load-7">
          <g className="cz-align-drift-c">
            <circle cx="386" cy="196" r="5.5" fill="url(#cz-align-moon)" />
            <circle cx="384.5" cy="194.5" r="1" fill="#8b8f9e" opacity="0.6" />
            <text x="380" y="214" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="8" letterSpacing="1.5" fill="#c9b98a" opacity="0.8">
              {"☽\uFE0E MOON"}
            </text>
          </g>
        </g>

        {/* horizon — dark earth under the alignment */}
        <rect x="0" y="452" width="400" height="148" fill="url(#cz-align-horizon)" />
        <path d="M 0 470 Q 100 462 200 468 Q 300 474 400 466" fill="none" stroke="#1a2440" strokeWidth="1" />
        <path d="M 0 470 Q 100 462 200 468 Q 300 474 400 466" fill="none" stroke="#d8c48a" strokeOpacity="0.12" strokeWidth="0.4" />

        {/* THE HERMIT — tiny silhouette, lantern raised, gazing up */}
        <g className="cz-align-load-hermit">
          {/* lantern glow on the ground */}
          <ellipse cx="222" cy="468" rx="26" ry="5" fill="#f2b95c" opacity="0.08" />
          <circle className="cz-align-flame" cx="221" cy="436" r="16" fill="url(#cz-align-lantern)" />
          <g fill="#0d1330" stroke="#2a3560" strokeWidth="0.5">
            {/* hooded cloak */}
            <path d="M 200 468 L 203 444 Q 204 432 210 428 Q 216 432 217 444 L 220 468 Z" />
            {/* hood shadow face tilted up */}
            <path d="M 205 438 Q 210 430 215 436 Q 212 434 210 436 Q 207 438 205 438 Z" fill="#060a1c" stroke="none" />
          </g>
          {/* staff */}
          <line x1="198" y1="430" x2="196" y2="468" stroke="#3a466e" strokeWidth="1.1" />
          {/* lantern arm + lantern */}
          <line x1="214" y1="440" x2="221" y2="436" stroke="#3a466e" strokeWidth="1" />
          <rect x="219" y="434" width="4" height="5" rx="0.8" fill="#f7cf7d" className="cz-align-flame" />
          {/* faint rim light on the hood from above */}
          <path d="M 204 434 Q 210 427 216 433" fill="none" stroke="#d8c48a" strokeOpacity="0.35" strokeWidth="0.6" />
        </g>

        {/* ===== frame, titles ===== */}
        <g className="cz-align-load-frame">
          {/* outer + inner hairline frame */}
          <rect x="12" y="12" width="376" height="576" fill="none" stroke="#d8c48a" strokeOpacity="0.55" strokeWidth="1" />
          <rect x="18" y="18" width="364" height="564" fill="none" stroke="#d8c48a" strokeOpacity="0.22" strokeWidth="0.5" />
          {/* corner stars */}
          <g fill="#d8c48a" opacity="0.8">
            <path d="M 12 4 L 13.4 10.6 L 20 12 L 13.4 13.4 L 12 20 L 10.6 13.4 L 4 12 L 10.6 10.6 Z" transform="translate(6 6) scale(0.6)" />
            <path d="M 12 4 L 13.4 10.6 L 20 12 L 13.4 13.4 L 12 20 L 10.6 13.4 L 4 12 L 10.6 10.6 Z" transform="translate(370 6) scale(0.6)" />
            <path d="M 12 4 L 13.4 10.6 L 20 12 L 13.4 13.4 L 12 20 L 10.6 13.4 L 4 12 L 10.6 10.6 Z" transform="translate(6 576) scale(0.6)" />
            <path d="M 12 4 L 13.4 10.6 L 20 12 L 13.4 13.4 L 12 20 L 10.6 13.4 L 4 12 L 10.6 10.6 Z" transform="translate(370 576) scale(0.6)" />
          </g>

          {/* IX — small, top center */}
          <text x="200" y="42" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="15" letterSpacing="4" fill="#d8c48a">
            IX
          </text>
          <g stroke="#d8c48a" strokeOpacity="0.5" strokeWidth="0.6">
            <line x1="150" y1="38" x2="176" y2="38" />
            <line x1="224" y1="38" x2="250" y2="38" />
          </g>
          <circle cx="143" cy="38" r="1.2" fill="#d8c48a" opacity="0.6" />
          <circle cx="257" cy="38" r="1.2" fill="#d8c48a" opacity="0.6" />

          {/* title — thin tracked caps */}
          <text x="200" y="560" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="14" letterSpacing="7" fill="#e2d3a0">
            THE HERMIT
          </text>
          <text x="200" y="574" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="6.5" letterSpacing="2.5" fill="#8b95b8" opacity="0.8">
            {"♄\uFE0E · THE GREAT CONJUNCTION OF THE SOLITARY · ♄\uFE0E"}
          </text>
        </g>
      </svg>
    </figure>
  );
}
