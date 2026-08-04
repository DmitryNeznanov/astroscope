// EPHEMERIS — The Hermit (IX)
// A page from a vintage astronomical ephemeris: aged paper, dense tabular
// typography (system serif + monospace), a SEPTEMBER · MMXXVI position table
// (DAY / ☉ ☽ ☿ ♀ ♂ ♃ ♄) with one ink-ruled row for the Hermit's day,
// retrograde ℞ marks, an ink vignette of the Hermit ("fig. IX — eremita"),
// and printed marginalia. Server-component safe: no hooks, no client directive.

const INK = "#33291d";
const INK_SOFT = "rgba(51,41,29,.62)";
const PAPER = "#efe8d6";

const SERIF = `Georgia, "Times New Roman", Times, serif`;
const MONO = `"Courier New", ui-monospace, Menlo, monospace`;

// Every astrological glyph carries the text-presentation selector U+FE0E.
const PLANETS = ["☉\uFE0E", "☽\uFE0E", "☿\uFE0E", "♀\uFE0E", "♂\uFE0E", "♃\uFE0E", "♄\uFE0E"];

// Seven days of September MMXXVI; day 17 (dies Iovis) is the Hermit's row.
const ROWS: { day: string; pos: string[] }[] = [
  { day: "14", pos: ["21°08′", "03°41′", "18°52′", "09°17′", "27°33′", "04°12′", "01°48′ ℞\uFE0E"] },
  { day: "15", pos: ["22°06′", "16°55′", "20°14′", "10°29′", "27°58′", "04°15′", "01°45′ ℞\uFE0E"] },
  { day: "16", pos: ["23°04′", "00°12′", "21°37′", "11°41′", "28°22′", "04°18′", "01°42′ ℞\uFE0E"] },
  { day: "17", pos: ["24°02′", "13°29′", "23°01′", "12°53′", "28°47′", "04°20′", "01°40′ ℞\uFE0E"] },
  { day: "18", pos: ["25°00′", "26°48′", "24°26′", "14°05′", "29°11′", "04°22′", "01°38′ ℞\uFE0E"] },
  { day: "19", pos: ["25°58′", "10°09′", "25°52′", "15°17′", "29°36′", "04°24′", "01°36′ ℞\uFE0E"] },
  { day: "20", pos: ["26°56′", "23°33′", "27°19′", "16°29′", "00°01′", "04°25′", "01°34′ ℞\uFE0E"] },
];

const HERMIT_ROW = 3; // index into ROWS — day 17, dies Iovis

function HermitVignette() {
  return (
    <svg viewBox="0 0 120 96" aria-hidden="true" style={{ display: "block", width: "100%" }}>
      <g stroke={INK} strokeWidth="1.1" fill="none" strokeLinecap="round">
        {/* ground with hatching */}
        <line x1="18" y1="79" x2="102" y2="79" />
        <line x1="28" y1="82" x2="36" y2="79" />
        <line x1="46" y1="83" x2="55" y2="79" />
        <line x1="66" y1="83" x2="75" y2="79" />
        <line x1="86" y1="82" x2="94" y2="79" />
        {/* staff */}
        <line x1="33" y1="26" x2="28" y2="79" />
        {/* lantern arm + lantern */}
        <line x1="66" y1="44" x2="84" y2="40" />
        <path d="M80 40 L88 40 L90 50 L84 57 L78 50 Z" />
        <line x1="84" y1="34" x2="84" y2="40" />
        {/* lantern rays */}
        <line x1="92" y1="38" x2="96" y2="35" />
        <line x1="94" y1="46" x2="99" y2="46" />
        <line x1="92" y1="54" x2="96" y2="57" />
        {/* stars */}
        <path d="M24 16 l0 6 M21 19 l6 0" strokeWidth="0.8" />
        <path d="M98 14 l0 5 M95.5 16.5 l5 0" strokeWidth="0.8" />
        <path d="M76 10 l0 4 M74 12 l4 0" strokeWidth="0.7" />
      </g>
      {/* hooded figure, iron-gall ink */}
      <path
        d="M54 20 C47 22 43 30 43 39 C43 51 39 63 36 79 L72 79 C69 63 65 51 65 39 C65 30 61 22 54 20 Z"
        fill={INK}
        stroke="none"
      />
      {/* hood opening — the face kept in shadow */}
      <ellipse cx="54" cy="41" rx="5.6" ry="7.6" fill={PAPER} />
      <ellipse cx="54" cy="43" rx="4.2" ry="5.8" fill={INK} />
      {/* lantern flame */}
      <circle cx="84" cy="48" r="2" fill={INK} />
    </svg>
  );
}

export default function EphemerisHermitCard() {
  return (
    <figure
      className="cz-eph-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
    >
      <style>{`
        .cz-eph-card {
          position: relative;
          overflow: hidden;
          container-type: inline-size;
          background:
            radial-gradient(60% 40% at 22% 12%, rgba(122,96,54,.07), transparent 70%),
            radial-gradient(50% 35% at 82% 30%, rgba(122,96,54,.06), transparent 70%),
            radial-gradient(70% 50% at 50% 88%, rgba(96,72,40,.09), transparent 72%),
            radial-gradient(30% 22% at 68% 66%, rgba(122,96,54,.05), transparent 70%),
            ${PAPER};
          color: ${INK};
          font-family: ${SERIF};
        }
        .cz-eph-card::after {
          content: "";
          position: absolute; inset: 0;
          box-shadow: inset 0 0 9cqw rgba(80,58,30,.18);
          pointer-events: none;
        }

        /* ---- printed double frame + crop marks ---- */
        .cz-eph-frame {
          position: absolute; inset: 3.2%;
          border: 0.35cqw solid ${INK};
          outline: 0.12cqw solid ${INK};
          outline-offset: 0.9cqw;
          pointer-events: none;
        }
        .cz-eph-crop {
          position: absolute;
          width: 3.4cqw; height: 3.4cqw;
          font-family: ${MONO};
          font-size: 3cqw; line-height: 3.4cqw;
          text-align: center;
          color: ${INK_SOFT};
        }

        /* ---- load: the page composes, then the table prints row by row ---- */
        .cz-eph-load { animation: cz-eph-settle .7s cubic-bezier(.2,.7,.25,1) backwards; }
        .cz-eph-row  { animation: cz-eph-print .5s cubic-bezier(.2,.7,.25,1) backwards; }

        @keyframes cz-eph-settle {
          from { opacity: 0; transform: translateY(1.2cqw); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes cz-eph-print {
          from { opacity: 0; transform: translateY(1cqw); }
          to   { opacity: 1; transform: none; }
        }

        /* ---- ambient: the Hermit's row breathes, barely (15s) ---- */
        .cz-eph-hl > div { animation: cz-eph-blink 15s ease-in-out infinite; }
        @keyframes cz-eph-blink {
          0%, 100% { background-color: rgba(51,41,29,.045); }
          50%      { background-color: rgba(51,41,29,.115); }
        }

        @media (prefers-reduced-motion: reduce) {
          .cz-eph-load, .cz-eph-row, .cz-eph-hl > div { animation: none; }
        }
      `}</style>

      {/* crop marks at the frame corners */}
      <span className="cz-eph-crop" style={{ top: "1.1%", left: "1.4%" }}>+</span>
      <span className="cz-eph-crop" style={{ top: "1.1%", right: "1.4%" }}>+</span>
      <span className="cz-eph-crop" style={{ bottom: "1.1%", left: "1.4%" }}>+</span>
      <span className="cz-eph-crop" style={{ bottom: "1.1%", right: "1.4%" }}>+</span>
      <div className="cz-eph-frame" />

      <div
        style={{
          position: "absolute",
          inset: "6.5% 8%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* ---- page header ---- */}
        <div className="cz-eph-load" style={{ textAlign: "center", animationDelay: "0s" }}>
          <div
            style={{
              fontSize: "2.7cqw",
              letterSpacing: ".42em",
              textIndent: ".42em",
              color: INK_SOFT,
            }}
          >
            EPHEMERIS · ASTRONOMICA
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "3cqw",
              marginTop: "2.2cqw",
            }}
          >
            <span style={{ flex: 1, height: "0.12cqw", background: INK_SOFT }} />
            <span style={{ fontSize: "7.6cqw", letterSpacing: ".26em", textIndent: ".26em" }}>
              SEPTEMBER
            </span>
            <span style={{ flex: 1, height: "0.12cqw", background: INK_SOFT }} />
          </div>
          <div
            style={{
              fontSize: "3cqw",
              letterSpacing: ".5em",
              textIndent: ".5em",
              marginTop: "1.4cqw",
              color: INK_SOFT,
            }}
          >
            · ANNO MMXXVI ·
          </div>
        </div>

        {/* ---- fig. IX: the Hermit ink vignette ---- */}
        <div
          className="cz-eph-load"
          style={{ marginTop: "4.5cqw", width: "58%", textAlign: "center", animationDelay: ".18s" }}
        >
          <div
            style={{
              border: "0.14cqw solid rgba(51,41,29,.7)",
              padding: "2.4cqw 3cqw 1.6cqw",
            }}
          >
            <HermitVignette />
          </div>
          <div
            style={{
              fontSize: "2.9cqw",
              fontStyle: "italic",
              marginTop: "1.6cqw",
              color: INK_SOFT,
            }}
          >
            fig. IX — eremita, cum lucerna
          </div>
        </div>

        {/* ---- the position table ---- */}
        <div style={{ position: "relative", width: "100%", marginTop: "4.5cqw" }}>
          {/* marginalia */}
          <span
            className="cz-eph-load"
            style={{
              position: "absolute",
              left: "-5.5%",
              top: "46%",
              transform: "rotate(-90deg)",
              transformOrigin: "left top",
              fontSize: "2.5cqw",
              fontStyle: "italic",
              letterSpacing: ".12em",
              color: INK_SOFT,
              whiteSpace: "nowrap",
              animationDelay: "1.42s",
            }}
          >
            dies Iovis
          </span>
          <span
            className="cz-eph-load"
            style={{
              position: "absolute",
              right: "-5.5%",
              top: "46%",
              transform: "rotate(90deg)",
              transformOrigin: "right top",
              fontSize: "2.5cqw",
              fontStyle: "italic",
              letterSpacing: ".12em",
              color: INK_SOFT,
              whiteSpace: "nowrap",
              animationDelay: "1.48s",
            }}
          >
            coniunctio ☽︎ ♄︎
          </span>

          {/* header row: IX + planet glyphs */}
          <div
            className="cz-eph-row"
            style={{
              display: "grid",
              gridTemplateColumns: "0.9fr repeat(7, 1fr)",
              alignItems: "end",
              textAlign: "center",
              borderTop: `0.22cqw solid ${INK}`,
              borderBottom: `0.14cqw solid ${INK}`,
              padding: "1.2cqw 0 1cqw",
              animationDelay: ".55s",
            }}
          >
            <div style={{ fontSize: "5.2cqw", letterSpacing: ".08em", lineHeight: 1 }}>IX</div>
            {PLANETS.map((g) => (
              <div key={g} style={{ fontSize: "3.7cqw", lineHeight: 1.3 }}>
                {g}
              </div>
            ))}
          </div>

          {/* data rows */}
          {ROWS.map((row, i) => {
            const hl = i === HERMIT_ROW;
            return (
              <div
                key={row.day}
                className={`cz-eph-row${hl ? " cz-eph-hl" : ""}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "0.9fr repeat(7, 1fr)",
                  textAlign: "center",
                  fontFamily: MONO,
                  fontSize: "3cqw",
                  padding: "0.9cqw 0",
                  borderTop: hl ? `0.22cqw solid ${INK}` : undefined,
                  borderBottom: hl
                    ? `0.22cqw solid ${INK}`
                    : "0.1cqw solid rgba(51,41,29,.28)",
                  animationDelay: `${0.68 + i * 0.09}s`,
                }}
              >
                <div style={{ fontWeight: hl ? 700 : 400 }}>{row.day}</div>
                {row.pos.map((p, j) => (
                  <div
                    key={j}
                    style={{
                      fontWeight: hl ? 700 : 400,
                      fontSize: "2.8cqw",
                      letterSpacing: "-.02em",
                      paddingTop: "0.3cqw",
                    }}
                  >
                    {p}
                  </div>
                ))}
              </div>
            );
          })}

          {/* footnote row: the card's name */}
          <div
            className="cz-eph-row"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2.6cqw",
              marginTop: "2.4cqw",
              animationDelay: "1.34s",
            }}
          >
            <span style={{ flex: 1, height: "0.1cqw", background: INK_SOFT }} />
            <span
              style={{
                fontSize: "3.3cqw",
                letterSpacing: ".44em",
                textIndent: ".44em",
                whiteSpace: "nowrap",
              }}
            >
              THE HERMIT
            </span>
            <span style={{ flex: 1, height: "0.1cqw", background: INK_SOFT }} />
          </div>
        </div>

        {/* ---- colophon ---- */}
        <div
          className="cz-eph-load"
          style={{
            marginTop: "auto",
            fontSize: "2.4cqw",
            fontStyle: "italic",
            letterSpacing: ".14em",
            color: INK_SOFT,
            animationDelay: "1.5s",
          }}
        >
          sol in ♍︎ virgine · gradus ad medium coelum
        </div>
      </div>
    </figure>
  );
}
