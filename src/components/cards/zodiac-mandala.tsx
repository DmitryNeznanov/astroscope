// ZODIAC MANDALA — The Hermit (IX)
// A great zodiac rose window: deep indigo card, gold + lapis. Concentric
// mandala rings — outer: 12 ornate zodiac sign panels (alternating indigo/
// lapis trapezoid sectors, gold dividers); middle: 12 small star medallions;
// inner: planetary glyphs on a thin band with the Virgo sector highlighted
// in gold; hub: the Hermit as a small gold-ink figure inside a 12-pointed
// star. Fine guilloche rings between bands. Server-component safe.

const CX = 150;
const CY = 222;

const INDIGO = "#141233";
const INDIGO_PANEL = "#1c1a4e";
const LAPIS_PANEL = "#24336e";
const LAPIS_DEEP = "#1a2450";
const GOLD = "#c9a227";
const GOLD_SOFT = "#e3c55c";
const GOLD_DIM = "#8a7426";

const GLYPH_FONT = "'Segoe UI Symbol','Noto Sans Symbols 2','Apple Symbols',Georgia,serif";
const TITLE_FONT = "Georgia,'Times New Roman',serif";

// Every astrological glyph is immediately followed by U+FE0E (text
// presentation selector) so it never renders as a colored emoji.
const ZODIAC = ["♈︎", "♉︎", "♊︎", "♋︎", "♌︎", "♍︎", "♎︎", "♏︎", "♐︎", "♑︎", "♒︎", "♓︎"];
const PLANETS = ["☉︎", "☽︎", "☿︎", "♀︎", "♂︎", "♃︎", "♄︎"];
const VIRGO = "♍︎";

const SECTOR_START = -105; // Aries sector centered at top (-90deg)
const VIRGO_INDEX = 5;

function polar(r: number, deg: number): readonly [number, number] {
  const a = (deg * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)] as const;
}

function pt(r: number, deg: number): string {
  const [x, y] = polar(r, deg);
  return `${x.toFixed(2)} ${y.toFixed(2)}`;
}

/** Annular sector path between radii r0..r1 and angles a0..a1 (clockwise). */
function sector(r0: number, r1: number, a0: number, a1: number): string {
  return `M${pt(r1, a0)} A${r1} ${r1} 0 0 1 ${pt(r1, a1)} L${pt(r0, a1)} A${r0} ${r0} 0 0 0 ${pt(r0, a0)} Z`;
}

/** Full annulus (ring) path between radii r0..r1 — use with fillRule="evenodd". */
function annulus(r0: number, r1: number): string {
  return `M${CX - r1} ${CY} a${r1} ${r1} 0 1 0 ${2 * r1} 0 a${r1} ${r1} 0 1 0 ${-2 * r1} 0 M${CX - r0} ${CY} a${r0} ${r0} 0 1 1 ${2 * r0} 0 a${r0} ${r0} 0 1 1 ${-2 * r0} 0 Z`;
}

/** N-pointed star path around (cx, cy). */
function star(cx: number, cy: number, rOut: number, rIn: number, n: number, startDeg = -90): string {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? rOut : rIn;
    const a = ((startDeg + (i * 180) / n) * Math.PI) / 180;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join(" L")} Z`;
}

const ZODIAC_SECTORS = ZODIAC.map((glyph, i) => {
  const a0 = SECTOR_START + i * 30;
  const a1 = a0 + 30;
  const mid = a0 + 15;
  const [gx, gy] = polar(115, mid);
  return { glyph, d: sector(100, 130, a0, a1), gx, gy, fill: i % 2 === 0 ? INDIGO_PANEL : LAPIS_PANEL };
});

const MEDALLIONS = ZODIAC.map((_, i) => {
  const mid = SECTOR_START + i * 30 + 15;
  const [mx, my] = polar(86, mid);
  return { mx, my, star: star(mx, my, 5.2, 1.7, 4) };
});

const PLANET_POSITIONS = PLANETS.map((glyph, i) => {
  const deg = -90 + (i * 360) / PLANETS.length;
  const [px, py] = polar(63, deg);
  return { glyph, px, py };
});

const VIRGO_A0 = SECTOR_START + VIRGO_INDEX * 30;
const VIRGO_A1 = VIRGO_A0 + 30;
const VIRGO_MID = VIRGO_A0 + 15;
const VIRGO_SECTOR = sector(54, 72, VIRGO_A0, VIRGO_A1);
const [VIRGO_GX, VIRGO_GY] = polar(63, VIRGO_MID);

const HUB_STAR = star(CX, CY, 48, 30, 12);

// Small diamonds flanking the bottom title.
const DIAMOND = "M0 -4.2 L3 0 L0 4.2 L-3 0 Z";

export default function ZodiacMandalaHermitCard() {
  return (
    <figure
      className="cz-zm-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
    >
      <style>{`
        .cz-zm-card { position: relative; overflow: hidden; background: ${INDIGO}; }
        .cz-zm-card svg { display: block; width: 100%; height: 100%; }

        .cz-zm-zodiac, .cz-zm-medal, .cz-zm-planet-load, .cz-zm-hub, .cz-zm-fig {
          transform-box: fill-box;
          transform-origin: center;
          animation: cz-zm-in .55s cubic-bezier(.25,.7,.3,1) backwards;
        }
        .cz-zm-zodiac      { animation-delay: 0s; }
        .cz-zm-medal       { animation-delay: .3s; }
        .cz-zm-planet-load { animation-delay: .55s; }
        .cz-zm-hub         { animation-delay: .85s; }
        .cz-zm-fig         { animation-delay: 1.15s; }

        @keyframes cz-zm-in {
          from { opacity: 0; transform: scale(.94); }
          to   { opacity: 1; transform: scale(1); }
        }

        .cz-zm-spin {
          transform-box: view-box;
          transform-origin: 150px 222px;
          animation: cz-zm-rot 105s linear infinite;
        }
        @keyframes cz-zm-rot {
          to { transform: rotate(360deg); }
        }

        .cz-zm-virgo { animation: cz-zm-vglow 16s ease-in-out infinite; }
        @keyframes cz-zm-vglow {
          0%, 100% { opacity: .72; }
          50%      { opacity: 1; }
        }

        .cz-zm-lantern { animation: cz-zm-lamp 18s ease-in-out infinite; }
        @keyframes cz-zm-lamp {
          0%, 100% { opacity: .55; }
          50%      { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cz-zm-zodiac, .cz-zm-medal, .cz-zm-planet-load, .cz-zm-hub, .cz-zm-fig,
          .cz-zm-spin, .cz-zm-virgo, .cz-zm-lantern {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>

      <svg viewBox="0 0 300 450" preserveAspectRatio="xMidYMid slice" role="img" aria-label="The Hermit, ninth card of the tarot, set in a zodiac rose window">
        <defs>
          <radialGradient id="cz-zm-bg" cx="50%" cy="49%" r="72%">
            <stop offset="0%" stopColor="#232057" />
            <stop offset="55%" stopColor="#181644" />
            <stop offset="100%" stopColor={INDIGO} />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="300" height="450" fill="url(#cz-zm-bg)" />

        {/* guilloche hairlines between the bands */}
        <g fill="none" stroke={GOLD_DIM} strokeWidth=".5" opacity=".55">
          <circle cx={CX} cy={CY} r="98" strokeDasharray="2 2.6" />
          <circle cx={CX} cy={CY} r="96.2" strokeDasharray=".6 3.1" />
          <circle cx={CX} cy={CY} r="76" strokeDasharray="1 2.2" />
          <circle cx={CX} cy={CY} r="74" strokeDasharray="3 1.8" />
          <circle cx={CX} cy={CY} r="54" strokeDasharray="1 2.2" />
          <circle cx={CX} cy={CY} r="52" strokeDasharray=".6 3" />
        </g>

        {/* outermost ring: 12 zodiac sign panels */}
        <g className="cz-zm-zodiac">
          <circle cx={CX} cy={CY} r="130.6" fill="none" stroke={GOLD} strokeWidth="1.1" />
          <circle cx={CX} cy={CY} r="99.4" fill="none" stroke={GOLD} strokeWidth="1.1" />
          {ZODIAC_SECTORS.map((s) => (
            <g key={s.glyph}>
              <path d={s.d} fill={s.fill} stroke={GOLD} strokeWidth=".9" />
              <text
                x={s.gx.toFixed(2)}
                y={s.gy.toFixed(2)}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="16"
                fill={GOLD_SOFT}
                fontFamily={GLYPH_FONT}
              >
                {s.glyph}
              </text>
            </g>
          ))}
        </g>

        {/* middle ring: 12 small star medallions */}
        <g className="cz-zm-medal">
          {MEDALLIONS.map((m, i) => (
            <g key={i}>
              <circle cx={m.mx.toFixed(2)} cy={m.my.toFixed(2)} r="8.6" fill={LAPIS_DEEP} stroke={GOLD} strokeWidth=".8" />
              <path d={m.star} fill={GOLD_SOFT} />
            </g>
          ))}
        </g>

        {/* inner ring: planetary band (ambient slow rotation), Virgo sector in gold */}
        <g className="cz-zm-planet-load">
          <g className="cz-zm-spin">
            <path d={annulus(54, 72)} fillRule="evenodd" fill={INDIGO_PANEL} stroke={GOLD} strokeWidth=".8" />
            <g className="cz-zm-virgo">
              <path d={VIRGO_SECTOR} fill={GOLD} stroke={GOLD_SOFT} strokeWidth=".8" />
              <text
                x={VIRGO_GX.toFixed(2)}
                y={VIRGO_GY.toFixed(2)}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="13"
                fill={INDIGO}
                fontFamily={GLYPH_FONT}
                fontWeight="bold"
              >
                {VIRGO}
              </text>
            </g>
            {PLANET_POSITIONS.map((p) => (
              <text
                key={p.glyph}
                x={p.px.toFixed(2)}
                y={p.py.toFixed(2)}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="13"
                fill={GOLD_SOFT}
                fontFamily={GLYPH_FONT}
              >
                {p.glyph}
              </text>
            ))}
          </g>
        </g>

        {/* hub: 12-pointed star holding the Hermit */}
        <g className="cz-zm-hub">
          <path d={HUB_STAR} fill={LAPIS_DEEP} stroke={GOLD} strokeWidth="1" />
          <circle cx={CX} cy={CY} r="25" fill={INDIGO} stroke={GOLD} strokeWidth=".8" />
          <circle cx={CX} cy={CY} r="22.4" fill="none" stroke={GOLD_DIM} strokeWidth=".5" strokeDasharray="1.4 2.2" />
        </g>

        {/* the Hermit: hooded figure, lantern, staff — gold ink */}
        <g
          className="cz-zm-fig"
          stroke={GOLD_SOFT}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          {/* hooded robe */}
          <path d={`M${CX} 202.5 C146.4 203.4 144.6 206.4 144.6 209.4 L141.8 238.5 L158.2 238.5 L155.4 209.4 C155.4 206.4 153.6 203.4 ${CX} 202.5 Z`} fill="#1a1747" />
          {/* hood opening (face in shadow) */}
          <path d={`M147.4 207.2 C148 205.4 152 205.4 152.6 207.2 C152 209.6 148 209.6 147.4 207.2 Z`} fill={INDIGO} strokeWidth=".9" />
          {/* staff */}
          <path d="M160.6 205.5 L157.8 238.5" />
          {/* arm reaching out with the lantern */}
          <path d="M145.4 216.5 L138.6 220.5" strokeWidth="1.2" />
          {/* lantern */}
          <path d="M136.2 220.8 L141 220.8 L140.2 228.4 L137 228.4 Z" fill="#1a1747" strokeWidth="1.1" />
          <path d="M137.4 220.8 C137.4 218.6 139.8 218.6 139.8 220.8" strokeWidth=".9" />
          {/* lantern light */}
          <circle className="cz-zm-lantern" cx="138.6" cy="224.6" r="1.7" fill={GOLD_SOFT} stroke="none" />
          <circle className="cz-zm-lantern" cx="138.6" cy="224.6" r="3.6" fill="none" stroke={GOLD_SOFT} strokeWidth=".5" opacity=".5" />
        </g>

        {/* 'IX' tiny at top center */}
        <text
          x="150"
          y="34"
          textAnchor="middle"
          fontSize="15"
          letterSpacing="5"
          fill={GOLD}
          fontFamily={TITLE_FONT}
        >
          IX
        </text>
        <g fill={GOLD_DIM}>
          <path d={DIAMOND} transform="translate(121 29.5) scale(.62)" />
          <path d={DIAMOND} transform="translate(179 29.5) scale(.62)" />
        </g>

        {/* bottom title in gold tracked caps with diamond flanks */}
        <g>
          <line x1="64" y1="404" x2="132" y2="404" stroke={GOLD_DIM} strokeWidth=".6" />
          <line x1="168" y1="404" x2="236" y2="404" stroke={GOLD_DIM} strokeWidth=".6" />
          <path d={DIAMOND} transform="translate(150 404) scale(.7)" fill={GOLD} />
          <text
            x="150"
            y="426"
            textAnchor="middle"
            fontSize="13.5"
            letterSpacing="4.5"
            fill={GOLD}
            fontFamily={TITLE_FONT}
          >
            THE HERMIT
          </text>
          <path d={DIAMOND} transform="translate(73 421.5) scale(.72)" fill={GOLD} />
          <path d={DIAMOND} transform="translate(227 421.5) scale(.72)" fill={GOLD} />
        </g>

        {/* thin gold frame with circular corner medallions */}
        <g fill="none" stroke={GOLD}>
          <rect x="8" y="8" width="284" height="434" strokeWidth="1.1" />
          <rect x="13" y="13" width="274" height="424" strokeWidth=".5" opacity=".55" />
        </g>
        {[
          [8, 8],
          [292, 8],
          [8, 442],
          [292, 442],
        ].map(([cx, cy]) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r="6.4" fill={INDIGO} stroke={GOLD} strokeWidth=".9" />
            <path d={star(cx, cy, 3.4, 1.2, 4)} fill={GOLD_SOFT} />
          </g>
        ))}
      </svg>
    </figure>
  );
}
