// VOLVELLE — deck gallery in the medieval paper volvelle style.
// A fixed base disc (24 hour ring with roman numerals, 12 zodiac panels)
// and a smaller top disc pinned by a brass brad, carrying a pointer arm and
// an arched cut-out window that reveals a per-arcana marker beneath. The
// bottom margin carries a manuscript-ink drawing of each arcana's motif.
// Server-component safe: no hooks, no client directive.

const CX = 150;
const CY = 190;

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const ROMAN = ["I", "II", "III", "IIII", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
const ZODIAC = ["♈︎", "♉︎", "♊︎", "♋︎", "♌︎", "♍︎", "♎︎", "♏︎", "♐︎", "♑︎", "♒︎", "♓︎"];
const PLANETS = ["☉︎", "☽︎", "☿︎", "♀︎", "♂︎", "♃︎", "♄︎"];
const DOTS = Array.from({ length: 12 }, (_, i) => i * 30);

// variant flavour: top-disc label words, load spin start, ambient amplitude
const DISC_WORDS = ["horae", "signa", "stellae", "motus", "astra", "cursus", "tempora", "viae"];

// latin ordinals for the subtitle note
const ORDINALS: Record<number, string> = {
  1: "prima",
  3: "tertia",
  7: "septima",
  9: "nona",
  10: "decima",
  13: "tertia decima",
  17: "septima decima",
  22: "ultima",
};

// arched window aperture: annular sector r 46–66, ±16° around east, round caps
const WINDOW_PATH =
  "M 194.16 177.32 A 10 10 0 0 1 213.35 171.81 " +
  "A 66 66 0 0 1 213.35 208.19 A 10 10 0 0 1 194.16 202.68 " +
  "A 46 46 0 0 0 194.16 177.32 Z";

const INK = "#3a2a1c";
const INK_DARK = "#2c1d12";
const GOLD = "#c9a227";
const RUBRIC = "#a32c1e";
const PAPER = "#f0e6cc";

function toRoman(n: number): string {
  const rest0 = Math.max(1, Math.round(n));
  if (rest0 >= 40) return String(n);
  let rest = rest0;
  let out = "";
  const table: Array<[number, string]> = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  for (const [v, s] of table) {
    while (rest >= v) {
      out += s;
      rest -= v;
    }
  }
  return out;
}

// marker revealed through the window (drawn on the base disc at r=56, 0° east)
function WindowMarker({ arcana }: { arcana: number }) {
  switch (arcana) {
    case 1: // The Magician — lemniscate
      return (
        <g fill="none" stroke={RUBRIC} strokeWidth="1.2">
          <circle cx="202.2" cy={CY} r="3.4" />
          <circle cx="209.8" cy={CY} r="3.4" />
        </g>
      );
    case 3: // The Empress — Venus
      return (
        <text
          x="206"
          y={CY + 3.5}
          textAnchor="middle"
          fontFamily="Georgia, 'DejaVu Sans', 'Segoe UI Symbol', serif"
          fontSize="10"
          fill={RUBRIC}
        >
          ♀︎
        </text>
      );
    case 7: // The Chariot — four-point star
      return (
        <g fill={GOLD} stroke={INK} strokeWidth="0.5">
          <path d={`M 206 ${CY - 7} L 207.8 ${CY - 1.8} L 206 ${CY + 3} L 204.2 ${CY - 1.8} Z`} />
          <path d={`M 200 ${CY - 1.8} L 206 ${CY - 3.4} L 212 ${CY - 1.8} L 206 ${CY - 0.2} Z`} />
        </g>
      );
    case 10: // Wheel of Fortune — spoked wheel
      return (
        <g>
          <g fill="none" stroke={INK} strokeWidth="1.1">
            <circle cx="206" cy={CY} r="4.6" />
            <path d={`M 206 ${CY - 4.6} L 206 ${CY + 4.6} M 201.4 ${CY} L 210.6 ${CY}`} />
          </g>
          <circle cx="206" cy={CY} r="1" fill={INK} />
        </g>
      );
    case 13: // Death — scythe
      return (
        <g fill="none" stroke={INK} strokeWidth="1.1" strokeLinecap="round">
          <path d={`M 203 ${CY + 7} L 209 ${CY - 10}`} />
          <path d={`M 209 ${CY - 10} Q 215 ${CY - 5} 212 ${CY + 3}`} />
        </g>
      );
    case 17: // The Star — gold star
      return (
        <path
          d={`M 206 ${CY - 6.5} L 207.8 ${CY - 1.4} L 206 ${CY + 3.5} L 204.2 ${CY - 1.4} Z`}
          fill={GOLD}
          stroke={INK}
          strokeWidth="0.5"
        />
      );
    case 22: // The Fool — the zero ring
      return <circle cx="206" cy={CY} r="4" fill="none" stroke={INK} strokeWidth="1.2" />;
    default: // The Hermit (9) — the sun of the planet ring sits here already
      return null;
  }
}

// shared marginal ground line + hatching
function Ground() {
  return (
    <g>
      <path d="M 116 392 L 186 392" stroke={INK_DARK} strokeWidth="1" opacity="0.7" />
      <path
        d="M 126 395 L 132 392 M 150 396 L 156 392 M 170 395 L 176 392"
        stroke={INK_DARK}
        strokeWidth="0.6"
        opacity="0.5"
      />
    </g>
  );
}

// manuscript-ink margin figure per arcana
function MarginFigure({ arcana }: { arcana: number }) {
  switch (arcana) {
    case 1: // THE MAGICIAN — table + tools, wand raised
      return (
        <g>
          <path d="M 160 346 Q 170 332 177 318" fill="none" stroke={INK_DARK} strokeWidth="1.7" strokeLinecap="round" />
          <line x1="177" y1="300" x2="177" y2="318" stroke={INK_DARK} strokeWidth="1.4" />
          <circle cx="177" cy="299" r="1.8" fill={GOLD} stroke={INK_DARK} strokeWidth="0.5" />
          <path d="M 138 340 Q 133 354 135 368 L 165 368 Q 167 354 162 340" fill={PAPER} stroke={INK_DARK} strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M 138 342 Q 137 322 150 319 Q 163 322 162 342" fill={PAPER} stroke={INK_DARK} strokeWidth="1.7" />
          <ellipse cx="150" cy="331" rx="5.2" ry="6.2" fill={INK_DARK} opacity="0.9" />
          <path d="M 140 346 Q 134 356 133 364" fill="none" stroke={INK_DARK} strokeWidth="1.7" strokeLinecap="round" />
          {/* the table */}
          <line x1="114" y1="370" x2="186" y2="370" stroke={INK_DARK} strokeWidth="1.8" />
          <path d="M 122 370 L 120 392 M 178 370 L 180 392" stroke={INK_DARK} strokeWidth="1.5" />
          <line x1="121" y1="384" x2="179" y2="384" stroke={INK_DARK} strokeWidth="0.7" opacity="0.7" />
          {/* cup, coin, sword */}
          <path d="M 130 358 L 138 358 L 136 366 L 132 366 Z" fill={PAPER} stroke={INK_DARK} strokeWidth="1" />
          <line x1="134" y1="366" x2="134" y2="370" stroke={INK_DARK} strokeWidth="1" />
          <circle cx="152" cy="362" r="3.2" fill="none" stroke={INK_DARK} strokeWidth="1" />
          <circle cx="152" cy="362" r="0.8" fill={INK_DARK} />
          <line x1="166" y1="368" x2="178" y2="356" stroke={INK_DARK} strokeWidth="1.2" />
          <line x1="173" y1="362" x2="179" y2="365" stroke={INK_DARK} strokeWidth="1" />
        </g>
      );
    case 3: // THE EMPRESS — crowned figure + wheat
      return (
        <g>
          <g fill="none" stroke={INK_DARK}>
            <path d="M 120 392 Q 115 370 114 350" strokeWidth="1.2" />
            <path d="M 128 392 Q 126 372 126 356" strokeWidth="1" />
            <path d="M 114 350 l -4 -5 M 114 350 l 4 -6 M 115 356 l -5 -4 M 115 356 l 5 -5 M 116 363 l -5 -3 M 116 363 l 5 -4" strokeWidth="0.8" />
            <path d="M 126 356 l -4 -5 M 126 356 l 4 -5 M 127 362 l -5 -3 M 127 362 l 5 -4" strokeWidth="0.8" />
          </g>
          <path d="M 136 354 Q 128 372 131 390 L 170 390 Q 173 372 164 354" fill={PAPER} stroke={INK_DARK} strokeWidth="1.7" strokeLinejoin="round" />
          <circle cx="150" cy="338" r="6.5" fill={PAPER} stroke={INK_DARK} strokeWidth="1.6" />
          <path d="M 143.5 336 Q 142 346 144 352 M 156.5 336 Q 158 346 156 352" fill="none" stroke={INK_DARK} strokeWidth="0.9" />
          <path d="M 143 333 L 144 324 L 147 330 L 150 322 L 153 330 L 156 324 L 157 333 Z" fill={GOLD} stroke={INK_DARK} strokeWidth="0.8" strokeLinejoin="round" />
          <path d="M 162 358 Q 170 350 176 340" fill="none" stroke={INK_DARK} strokeWidth="1.6" strokeLinecap="round" />
          <line x1="176" y1="340" x2="182" y2="326" stroke={INK_DARK} strokeWidth="1.3" />
          <path d="M 182 320 L 183.8 325 L 182 330 L 180.2 325 Z" fill={GOLD} stroke={INK_DARK} strokeWidth="0.5" />
          <path d="M 143 362 Q 141 374 142 386 M 151 364 Q 150 376 150 386" fill="none" stroke={INK} strokeWidth="0.7" opacity="0.55" />
        </g>
      );
    case 7: // THE CHARIOT — canopied cart, wheel, horse
      return (
        <g>
          <path d="M 166 348 Q 182 342 186 328" fill="none" stroke={INK_DARK} strokeWidth="1.6" />
          <path d="M 186 328 L 196 331 L 194 339 L 184 338 Z" fill={PAPER} stroke={INK_DARK} strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M 187 327 l 1 -4 M 190 328 l 2 -4" stroke={INK_DARK} strokeWidth="0.9" />
          <circle cx="191" cy="333" r="0.8" fill={INK_DARK} />
          <path d="M 150 336 Q 172 342 188 336" fill="none" stroke={INK_DARK} strokeWidth="0.8" />
          <path d="M 114 344 Q 138 320 162 344" fill={PAPER} stroke={INK_DARK} strokeWidth="1.5" />
          <path d="M 114 344 L 162 344 L 158 374 L 118 374 Z" fill={PAPER} stroke={INK_DARK} strokeWidth="1.7" strokeLinejoin="round" />
          <line x1="116" y1="356" x2="160" y2="356" stroke={INK_DARK} strokeWidth="0.6" opacity="0.6" />
          <circle cx="138" cy="381" r="9" fill={PAPER} stroke={INK_DARK} strokeWidth="1.6" />
          <path d="M 138 372 L 138 390 M 129 381 L 147 381 M 131.6 374.6 L 144.4 387.4 M 144.4 374.6 L 131.6 387.4" stroke={INK_DARK} strokeWidth="0.7" />
          <circle cx="138" cy="381" r="1.6" fill={INK_DARK} />
          <path d="M 132 344 L 134 326 Q 138 320 142 326 L 144 344" fill={PAPER} stroke={INK_DARK} strokeWidth="1.5" />
          <circle cx="138" cy="318" r="4.6" fill={PAPER} stroke={INK_DARK} strokeWidth="1.4" />
          <line x1="133.5" y1="314.5" x2="142.5" y2="314.5" stroke={INK_DARK} strokeWidth="1" />
          <path d="M 133 329 L 134.3 332 L 133 335 L 131.7 332 Z" fill={GOLD} />
          <path d="M 143 329 L 144.3 332 L 143 335 L 141.7 332 Z" fill={GOLD} />
        </g>
      );
    case 10: // WHEEL OF FORTUNE — spoked wheel on a stand
      return (
        <g>
          <circle cx="150" cy="356" r="26" fill={PAPER} stroke={INK_DARK} strokeWidth="1.8" />
          <circle cx="150" cy="356" r="19" fill="none" stroke={INK_DARK} strokeWidth="0.7" />
          <path d="M 150 330 L 150 382 M 127.4 343 L 172.6 369 M 172.6 343 L 127.4 369" stroke={INK_DARK} strokeWidth="0.9" />
          <circle cx="150" cy="356" r="3" fill={PAPER} stroke={INK_DARK} strokeWidth="1.2" />
          <path d="M 132 392 L 150 372 L 168 392" fill="none" stroke={INK_DARK} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M 176 356 L 184 356 L 184 361" fill="none" stroke={INK_DARK} strokeWidth="1.2" />
          {/* three small beasts: rising, cresting, falling */}
          <circle cx="150" cy="327" r="3" fill={PAPER} stroke={INK_DARK} strokeWidth="1" />
          <path d="M 147.5 325 l -1.5 -2.5 M 152.5 325 l 1.5 -2.5" stroke={INK_DARK} strokeWidth="0.8" />
          <circle cx="173" cy="362" r="2.6" fill={PAPER} stroke={INK_DARK} strokeWidth="1" />
          <path d="M 175.5 363.5 q 3 1 4 3" fill="none" stroke={INK_DARK} strokeWidth="0.8" />
          <circle cx="127" cy="362" r="2.6" fill={PAPER} stroke={INK_DARK} strokeWidth="1" />
          <path d="M 124.5 363.5 q -3 1 -4 3" fill="none" stroke={INK_DARK} strokeWidth="0.8" />
        </g>
      );
    case 13: // DEATH — skeletal rider with black banner
      return (
        <g>
          <line x1="156" y1="332" x2="162" y2="304" stroke={INK_DARK} strokeWidth="1.3" />
          <path d="M 162 304 L 182 309 L 162 316 Z" fill={INK_DARK} />
          <path d="M 116 364 Q 118 350 134 348 L 158 348 Q 174 350 174 360 Q 174 368 164 369 L 128 369 Q 116 369 116 364 Z" fill={PAPER} stroke={INK_DARK} strokeWidth="1.6" />
          <path d="M 124 369 L 122 392 M 132 369 L 132 392 M 158 369 L 156 392 M 166 369 L 168 392" stroke={INK_DARK} strokeWidth="1.5" />
          <path d="M 168 350 Q 180 344 182 332" fill="none" stroke={INK_DARK} strokeWidth="1.6" />
          <path d="M 182 332 L 192 335 L 190 342 L 180 341 Z" fill={PAPER} stroke={INK_DARK} strokeWidth="1.3" strokeLinejoin="round" />
          <circle cx="187" cy="337" r="0.8" fill={INK_DARK} />
          <path d="M 116 356 Q 108 362 110 372" fill="none" stroke={INK_DARK} strokeWidth="1.3" />
          <line x1="148" y1="348" x2="148" y2="328" stroke={INK_DARK} strokeWidth="1.5" />
          <circle cx="148" cy="322" r="4.6" fill={PAPER} stroke={INK_DARK} strokeWidth="1.4" />
          <circle cx="146.2" cy="321" r="0.9" fill={INK_DARK} />
          <circle cx="149.8" cy="321" r="0.9" fill={INK_DARK} />
          <path d="M 144 332 Q 148 335 152 332 M 144 337 Q 148 340 152 337" fill="none" stroke={INK_DARK} strokeWidth="0.9" />
          <path d="M 150 334 Q 154 333 157 331" fill="none" stroke={INK_DARK} strokeWidth="1.2" strokeLinecap="round" />
        </g>
      );
    case 17: // THE STAR — kneeling figure pouring two jugs
      return (
        <g>
          <path d="M 150 296 L 153.4 306.6 L 150 317 L 146.6 306.6 Z" fill={GOLD} stroke={INK} strokeWidth="0.5" />
          <path d="M 126 306 L 127.6 311 L 126 316 L 124.4 311 Z" fill={INK} />
          <path d="M 174 306 L 175.6 311 L 174 316 L 172.4 311 Z" fill={INK} />
          <path d="M 140 344 Q 132 366 137 386 L 158 386 L 162 376 Q 160 358 157 344" fill={PAPER} stroke={INK_DARK} strokeWidth="1.7" strokeLinejoin="round" />
          <circle cx="149" cy="334" r="5.4" fill={PAPER} stroke={INK_DARK} strokeWidth="1.5" />
          <path d="M 144 331 Q 143 338 145 343" fill="none" stroke={INK_DARK} strokeWidth="0.9" />
          {/* right jug pouring into a pool */}
          <path d="M 156 352 Q 166 354 173 352" fill="none" stroke={INK_DARK} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 171 346 L 181 346 L 179 358 L 173 358 Z" fill={PAPER} stroke={INK_DARK} strokeWidth="1.1" strokeLinejoin="round" />
          <path d="M 181 348 q 4 1 3 5" fill="none" stroke={INK_DARK} strokeWidth="0.9" />
          <path d="M 175 359 Q 178 374 184 388 M 179 359 Q 182 374 188 388" fill="none" stroke={INK_DARK} strokeWidth="0.8" opacity="0.7" />
          <path d="M 176 391 q 6 2 12 0 M 180 394 q 4 1.5 8 0" fill="none" stroke={INK_DARK} strokeWidth="0.7" opacity="0.6" />
          {/* left jug pouring onto the ground */}
          <path d="M 141 352 Q 133 356 127 354" fill="none" stroke={INK_DARK} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 119 348 L 129 348 L 127 360 L 121 360 Z" fill={PAPER} stroke={INK_DARK} strokeWidth="1.1" strokeLinejoin="round" />
          <path d="M 123 361 Q 120 376 116 390" fill="none" stroke={INK_DARK} strokeWidth="0.8" opacity="0.7" />
        </g>
      );
    case 22: // THE FOOL — cliff edge, bundle, dog
      return (
        <g>
          <path d="M 158 392 L 151 403" fill="none" stroke={INK_DARK} strokeWidth="1.5" />
          <path d="M 150 396 l 4 -4 M 143 399 l 4 -4" stroke={INK_DARK} strokeWidth="0.7" opacity="0.6" />
          <path d="M 134 346 Q 128 368 131 390 L 157 390 Q 159 368 153 346" fill={PAPER} stroke={INK_DARK} strokeWidth="1.7" strokeLinejoin="round" />
          <circle cx="145" cy="335" r="5.4" fill={PAPER} stroke={INK_DARK} strokeWidth="1.5" />
          <path d="M 149 330 Q 155 323 162 322" fill="none" stroke={INK_DARK} strokeWidth="1" />
          <line x1="152" y1="350" x2="174" y2="324" stroke={INK_DARK} strokeWidth="1.3" />
          <circle cx="177" cy="321" r="4.6" fill={PAPER} stroke={INK_DARK} strokeWidth="1.2" />
          <path d="M 173 318 q 4 3 8 2 M 174 324 q 3 2 7 1" fill="none" stroke={INK_DARK} strokeWidth="0.7" />
          <path d="M 152 352 Q 158 344 163 338" fill="none" stroke={INK_DARK} strokeWidth="1.5" strokeLinecap="round" />
          {/* the little dog */}
          <ellipse cx="118" cy="378" rx="8" ry="5" fill={PAPER} stroke={INK_DARK} strokeWidth="1.3" />
          <circle cx="108" cy="371" r="4" fill={PAPER} stroke={INK_DARK} strokeWidth="1.2" />
          <path d="M 106 368 l -2 -3" stroke={INK_DARK} strokeWidth="1" />
          <circle cx="107" cy="371" r="0.7" fill={INK_DARK} />
          <path d="M 126 375 Q 132 372 132 366" fill="none" stroke={INK_DARK} strokeWidth="1.1" />
          <path d="M 112 382 L 112 390 M 123 382 L 123 390" stroke={INK_DARK} strokeWidth="1.2" />
        </g>
      );
    case 9: // THE HERMIT — hooded figure, lantern raised toward the discs
    default:
      return (
        <g>
          {/* staff in the left hand */}
          <line x1="126" y1="330" x2="135" y2="390" stroke={INK_DARK} strokeWidth="1.7" strokeLinecap="round" />
          {/* hooded robe */}
          <path
            d="M 140 352 Q 134 370 136 390 L 166 390 Q 168 370 162 352"
            fill={PAPER}
            stroke={INK_DARK}
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M 140 354 Q 139 333 151 330 Q 163 333 162 354"
            fill={PAPER}
            stroke={INK_DARK}
            strokeWidth="1.7"
          />
          <ellipse cx="151" cy="343" rx="5.2" ry="6.4" fill={INK_DARK} opacity="0.9" />
          {/* robe fold shading */}
          <path d="M 143 360 Q 141 374 142 386" fill="none" stroke={INK} strokeWidth="0.8" opacity="0.6" />
          <path d="M 149 364 Q 148 376 148 386" fill="none" stroke={INK} strokeWidth="0.6" opacity="0.5" />
          {/* right arm raised toward the instrument */}
          <path d="M 160 358 Q 170 344 177 330" fill="none" stroke={INK_DARK} strokeWidth="1.7" strokeLinecap="round" />
          {/* lantern, gold leaf, held up toward the discs */}
          <line x1="181" y1="312" x2="181" y2="315" stroke={INK_DARK} strokeWidth="1" />
          <path
            d="M 175 315 L 187 315 L 185 328 L 177 328 Z"
            fill={GOLD}
            stroke={INK_DARK}
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <path d="M 177 315 L 179 311 L 183 311 L 185 315" fill="none" stroke={INK_DARK} strokeWidth="0.9" />
          <path d="M 181 318.5 L 182.6 322 L 181 325.5 L 179.4 322 Z" fill="#fff6d8" />
          {/* faint glow rays */}
          <g stroke={GOLD} strokeWidth="0.7" opacity="0.45">
            <path d="M 171 318 L 166 316" />
            <path d="M 191 318 L 196 316" />
            <path d="M 181 306 L 181 301" />
          </g>
        </g>
      );
  }
}

export interface VolvelleCardProps {
  number?: number;
  name?: string;
  variant?: number;
}

export default function VolvelleArcanaCard({
  number = 9,
  name = "THE HERMIT",
  variant = 0,
}: VolvelleCardProps) {
  const v = Math.min(7, Math.max(0, Math.round(variant)));
  // for the Hermit the planet ring already places ☉︎ under the window;
  // other arcana shift it clear so their own marker is revealed
  const planetOffset = (number === 9 ? 0 : 26) + v * 5;
  const titleLong = name.length > 12;
  const spinStyle = { "--cz-spin": `${-40 - v * 3}deg` } as React.CSSProperties;
  const ampStyle = { "--cz-amp": `${3 + v * 0.5}deg` } as React.CSSProperties;

  return (
    <figure
      className="cz-volv-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
    >
      <style>{`
        .cz-volv-card { position: relative; overflow: hidden; }
        .cz-volv-card svg { display: block; width: 100%; height: 100%; }

        .cz-volv-base {
          animation: cz-volv-ink-in 1s ease-out backwards;
        }
        .cz-volv-figure {
          animation: cz-volv-ink-in .9s ease-out .85s backwards;
        }
        .cz-volv-disc-load {
          transform-box: view-box;
          transform-origin: ${CX}px ${CY}px;
          animation: cz-volv-spin-in 1.4s cubic-bezier(.3,.9,.35,1) .15s backwards;
        }
        .cz-volv-disc-ambient {
          transform-box: view-box;
          transform-origin: ${CX}px ${CY}px;
          animation: cz-volv-nudge 40s ease-in-out infinite alternate;
        }
        .cz-volv-gleam {
          animation: cz-volv-brad-gleam 8s ease-in-out infinite;
        }

        @keyframes cz-volv-spin-in {
          0%   { opacity: 0; transform: rotate(var(--cz-spin, -40deg)); }
          30%  { opacity: 1; }
          62%  { transform: rotate(2.5deg); }
          80%  { transform: rotate(-1deg); }
          100% { opacity: 1; transform: rotate(0deg); }
        }
        @keyframes cz-volv-ink-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cz-volv-nudge {
          from { transform: rotate(calc(var(--cz-amp, 3deg) * -1)); }
          to   { transform: rotate(var(--cz-amp, 3deg)); }
        }
        @keyframes cz-volv-brad-gleam {
          0%, 100% { opacity: .12; }
          50%      { opacity: .85; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cz-volv-base,
          .cz-volv-figure,
          .cz-volv-disc-load,
          .cz-volv-disc-ambient,
          .cz-volv-gleam {
            animation: none;
          }
        }
      `}</style>

      <svg
        viewBox="0 0 300 450"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={`Tarot card ${number}, ${name}, drawn as a medieval paper volvelle instrument`}
      >
        <defs>
          <radialGradient id="cz-volv-parchment" cx="50%" cy="42%" r="75%">
            <stop offset="0%" stopColor="#f4ebd2" />
            <stop offset="70%" stopColor="#f0e6cc" />
            <stop offset="100%" stopColor="#e0d0a8" />
          </radialGradient>
          <radialGradient id="cz-volv-basegrad" cx="50%" cy="46%" r="60%">
            <stop offset="0%" stopColor="#eee2c2" />
            <stop offset="80%" stopColor="#e6d7b0" />
            <stop offset="100%" stopColor="#d9c795" />
          </radialGradient>
          <radialGradient id="cz-volv-topgrad" cx="50%" cy="46%" r="60%">
            <stop offset="0%" stopColor="#f6eed6" />
            <stop offset="85%" stopColor="#eee0ba" />
            <stop offset="100%" stopColor="#e2d0a2" />
          </radialGradient>
          <radialGradient id="cz-volv-brass" cx="38%" cy="34%" r="75%">
            <stop offset="0%" stopColor="#f3dc8e" />
            <stop offset="55%" stopColor="#c9a227" />
            <stop offset="100%" stopColor="#7c5f14" />
          </radialGradient>
          <filter id="cz-volv-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.4" />
          </filter>
          {/* window punched out of the top disc */}
          <mask
            id="cz-volv-winmask"
            maskUnits="userSpaceOnUse"
            x="70"
            y="110"
            width="160"
            height="160"
          >
            <circle cx={CX} cy={CY} r="68" fill="#ffffff" />
            <path d={WINDOW_PATH} fill="#000000" />
          </mask>
        </defs>

        {/* aged parchment ground + stains */}
        <rect x="0" y="0" width="300" height="450" fill="url(#cz-volv-parchment)" />
        <g transform={`translate(${v * 3} ${v * 2})`}>
          <ellipse cx="52" cy="86" rx="40" ry="22" fill="#b89b5e" opacity="0.09" />
          <ellipse cx="256" cy="352" rx="34" ry="26" fill="#b89b5e" opacity="0.08" />
          <ellipse cx="66" cy="330" rx="24" ry="36" fill="#a8894e" opacity="0.07" />
          <ellipse cx="240" cy="70" rx="26" ry="16" fill="#a8894e" opacity="0.07" />
        </g>

        {/* deckle hint along the sheet edges */}
        <g fill="none" stroke="#a8894e" strokeWidth="1" opacity="0.3">
          <path d="M 4 24 Q 7 130 3 230 Q 6 340 4 426" />
          <path d="M 296 20 Q 293 140 297 240 Q 294 350 296 428" />
          <path d="M 22 4 Q 130 7 228 3 Q 262 5 282 4" />
          <path d="M 24 446 Q 140 443 236 447 Q 266 445 280 446" />
        </g>

        {/* thin ink frame with corner crosses */}
        <rect x="10" y="10" width="280" height="430" fill="none" stroke={INK} strokeWidth="1.3" opacity="0.85" />
        <g stroke={INK} strokeWidth="1.2" opacity="0.9">
          <path d="M 5 10 h 10 M 10 5 v 10" />
          <path d="M 285 10 h 10 M 290 5 v 10" />
          <path d="M 5 440 h 10 M 10 435 v 10" />
          <path d="M 285 440 h 10 M 290 435 v 10" />
        </g>

        {/* roman numeral at the top, flanked by stars */}
        <text
          x="150"
          y="40"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontWeight="700"
          fontSize="17"
          letterSpacing="4"
          fill={INK_DARK}
        >
          {toRoman(number)}
        </text>
        <g fill={INK} opacity="0.8">
          <path d="M 118 31 L 119.6 35 L 118 39 L 116.4 35 Z" />
          <path d="M 182 31 L 183.6 35 L 182 39 L 180.4 35 Z" />
        </g>

        {/* ============ fixed base disc ============ */}
        <g className="cz-volv-base">
          <circle cx={CX} cy={CY} r="112" fill="url(#cz-volv-basegrad)" stroke={INK} strokeWidth="1.8" />

          {/* outer scale: 24 hour marks + roman numerals */}
          <circle cx={CX} cy={CY} r="96" fill="none" stroke={INK} strokeWidth="0.9" />
          {HOURS.map((h) => {
            const major = h % 6 === 0;
            return (
              <g key={h} transform={`rotate(${h * 15} ${CX} ${CY})`}>
                <line
                  x1={CX}
                  y1={CY - 112}
                  x2={CX}
                  y2={CY - (major ? 104 : 108)}
                  stroke={INK}
                  strokeWidth={major ? 1.2 : 0.55}
                />
                <text
                  x={CX}
                  y={CY - 98.5}
                  textAnchor="middle"
                  fontFamily="Georgia, 'Times New Roman', serif"
                  fontSize="6"
                  fill={INK}
                >
                  {ROMAN[h % 12]}
                </text>
              </g>
            );
          })}

          {/* middle scale: 12 zodiac panels */}
          <circle cx={CX} cy={CY} r="88" fill="none" stroke={INK} strokeWidth="1.1" />
          <circle cx={CX} cy={CY} r="70" fill="none" stroke={INK} strokeWidth="0.8" />
          {ZODIAC.map((g, i) => (
            <g key={g} transform={`rotate(${i * 30} ${CX} ${CY})`}>
              <line
                x1={CX}
                y1={CY - 88}
                x2={CX}
                y2={CY - 70}
                stroke={INK}
                strokeWidth="0.5"
              />
              <text
                x={CX}
                y={CY - 75}
                textAnchor="middle"
                fontFamily="Georgia, 'DejaVu Sans', 'Segoe UI Symbol', serif"
                fontSize="9.5"
                fill={i % 2 === 0 ? RUBRIC : INK}
                transform={`rotate(15 ${CX} ${CY})`}
              >
                {g}
              </text>
            </g>
          ))}

          {/* inner planetary scale, revealed through the window */}
          <circle cx={CX} cy={CY} r="64" fill="none" stroke={INK} strokeWidth="0.6" />
          <circle cx={CX} cy={CY} r="47" fill="none" stroke={INK} strokeWidth="0.6" />
          {PLANETS.map((p, i) => (
            <g key={p} transform={`rotate(${i * (360 / 7) + planetOffset} ${CX} ${CY})`}>
              <text
                x={CX}
                y={CY - 52}
                textAnchor="middle"
                fontFamily="Georgia, 'DejaVu Sans', 'Segoe UI Symbol', serif"
                fontSize="8"
                fill={i % 2 === 0 ? INK : RUBRIC}
              >
                {p}
              </text>
            </g>
          ))}
          {/* per-arcana marker sitting under the window */}
          <WindowMarker arcana={number} />
          {/* faint construction circles at the hub */}
          <circle cx={CX} cy={CY} r="34" fill="none" stroke={INK} strokeWidth="0.5" opacity="0.6" />
          <circle cx={CX} cy={CY} r="12" fill="none" stroke={INK} strokeWidth="0.6" opacity="0.7" />
        </g>

        {/* paper shadow under the top disc */}
        <circle
          cx={CX + 2}
          cy={CY + 3.5}
          r="68"
          fill={INK_DARK}
          opacity="0.22"
          filter="url(#cz-volv-blur)"
        />

        {/* ============ rotating top disc ============ */}
        <g className="cz-volv-disc-load" style={spinStyle}>
          <g className="cz-volv-disc-ambient" style={ampStyle}>
            {/* paper + markings, window punched through */}
            <g mask="url(#cz-volv-winmask)">
              <circle cx={CX} cy={CY} r="68" fill="url(#cz-volv-topgrad)" />
              <circle cx={CX} cy={CY} r="58" fill="none" stroke={INK} strokeWidth="0.7" />
              <circle cx={CX} cy={CY} r="40" fill="none" stroke={INK} strokeWidth="0.5" opacity="0.7" />
              {DOTS.map((a) => (
                <g key={a} transform={`rotate(${a} ${CX} ${CY})`}>
                  <circle cx={CX} cy={CY - 49} r="1" fill={INK} opacity="0.75" />
                </g>
              ))}
              <text
                x={CX}
                y={CY + 47}
                textAnchor="middle"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontStyle="italic"
                fontSize="6"
                letterSpacing="1.5"
                fill={INK}
                opacity="0.85"
              >
                {`· ${DISC_WORDS[v]} ·`}
              </text>
            </g>
            {/* disc edge + cut edge of the window */}
            <circle cx={CX} cy={CY} r="68" fill="none" stroke={INK} strokeWidth="1.5" />
            <path d={WINDOW_PATH} fill="none" stroke={INK} strokeWidth="0.9" />

            {/* pointer / indicator arm, aimed at the top of the scale */}
            <path
              d={`M ${CX - 3} ${CY + 4} L ${CX} ${CY - 64} L ${CX + 3} ${CY + 4} Z`}
              fill={INK_DARK}
              opacity="0.85"
            />
            <path
              d={`M ${CX} ${CY - 64} L ${CX + 1.8} ${CY - 58} L ${CX - 1.8} ${CY - 58} Z`}
              fill={v % 2 === 0 ? GOLD : INK_DARK}
              stroke={INK_DARK}
              strokeWidth="0.5"
            />
            <line x1={CX} y1={CY + 4} x2={CX} y2={CY + 16} stroke={INK_DARK} strokeWidth="1.4" />
          </g>
        </g>

        {/* brass brad pinning both discs */}
        <g>
          <circle cx={CX} cy={CY} r="5.6" fill="url(#cz-volv-brass)" stroke={INK_DARK} strokeWidth="0.8" />
          <line x1={CX - 3.4} y1={CY} x2={CX + 3.4} y2={CY} stroke={INK_DARK} strokeWidth="0.7" opacity="0.7" />
          <ellipse className="cz-volv-gleam" cx={CX - 1.6} cy={CY - 1.8} rx="1.6" ry="1" fill="#fff6d8" />
        </g>

        {/* ============ margin figure, per arcana ============ */}
        <g className="cz-volv-figure">
          <Ground />
          <MarginFigure arcana={number} />
        </g>

        {/* marginal crosses flanking the title (short titles only) */}
        {name.length <= 10 && (
          <g stroke={RUBRIC} strokeWidth="1.1" opacity="0.9">
            <path d="M 58 412 h 8 M 62 408 v 8" />
            <path d="M 234 412 h 8 M 238 408 v 8" />
          </g>
        )}

        {/* title + note */}
        <text
          x="150"
          y="419"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontWeight="700"
          fontSize={titleLong ? 13 : 16}
          letterSpacing={titleLong ? 3 : 5}
          fill={INK_DARK}
        >
          {name}
        </text>
        <text
          x="150"
          y="432"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontStyle="italic"
          fontSize="8.5"
          letterSpacing="1.5"
          fill={INK}
          opacity="0.8"
        >
          {`volvella · ${ORDINALS[number] ?? "arcanum"}`}
        </text>
      </svg>
    </figure>
  );
}
