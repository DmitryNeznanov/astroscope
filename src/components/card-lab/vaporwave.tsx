import type { ReactNode } from "react";
import { toRoman } from "@/lib/roman";

/**
 * VAPORWAVE — reusable tarot deck (default: The Hermit, IX)
 * 80s retro-futurism: chrome/marble figures on a glowing perspective grid
 * floor (pink/cyan) beneath a black sky with a huge striped retro sun
 * (magenta→orange). Chrome-gradient numeral, italic serif card name with a
 * vertical latin accent.
 *
 * Props (all optional — no props renders The Hermit exactly):
 *  - number: 1 Magician, 3 Empress, 7 Chariot, 9 Hermit, 10 Wheel of Fortune,
 *    13 Death, 17 Star, 22 Fool get bespoke scenes; any other number falls
 *    back to the Hermit scene with the correct numeral/name;
 *  - name: card name; long names are auto-fitted (smaller size/tracking);
 *  - variant (0-7): bit 0 mirrors the scene, bits 1-2 pick one of four
 *    hue-shifted palettes; the Hermit additionally swaps floating shapes in
 *    palettes 2-3. variant=0 is the canonical look.
 *
 * Signature effects (CSS-only, always on, work for every scene):
 * sun hue-shift + scrolling gap-stripes, grid scroll toward the viewer,
 * scanline drift, floating/spinning/pulsing decor, ~8s CRT glitch, hover
 * chrome sheen + rim intensify. Each scene's light source twinkles
 * (Hermit's lantern star, Magician's wand tip, Empress's crown star,
 * Chariot's canopy star, Wheel's hub, Death's banner rose, Star's big star).
 * All motion is disabled under prefers-reduced-motion.
 */
export interface VaporwaveCardProps {
  number?: number;
  name?: string;
  variant?: number;
}

/* ---- shared bits ------------------------------------------------------- */

/** 4-point sparkle star (light sources across the deck). */
function Star4({ x, y, r, className }: { x: number; y: number; r: number; className?: string }) {
  const k = Math.round(r * 0.3 * 10) / 10;
  return (
    <path
      className={className}
      d={`M ${x} ${y - r} L ${x + k} ${y - k} L ${x + r} ${y} L ${x + k} ${y + k} L ${x} ${y + r} L ${x - k} ${y + k} L ${x - r} ${y} L ${x - k} ${y - k} Z`}
      fill="#fff3d0"
    />
  );
}

/** Hover chrome sheen, clipped to each scene's main silhouette. */
function Sheen({ id, children }: { id: string; children: ReactNode }) {
  return (
    <>
      <defs>
        <clipPath id={id}>{children}</clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect className="cl-vapor-sheen" x="20" y="30" width="80" height="240" fill="url(#clVaporSheen)" />
      </g>
    </>
  );
}

const LATIN: Record<number, string> = {
  1: "MAGUS",
  3: "IMPERATRIX",
  7: "CURRUS",
  9: "EREMITA · MONTIS",
  10: "ROTA FORTUNAE",
  13: "MORS",
  17: "STELLA",
  22: "STULTUS",
};

/* ---- scenes ------------------------------------------------------------ */

function HermitScene({ altShapes }: { altShapes: boolean }) {
  return (
    <>
      {/* palm silhouette — left, fronds sway from the trunk top */}
      <g fill="#0e0218">
        <path d="M 30 196 C 29 184 30 172 34 160 L 37 161 C 34 172 33 184 34 196 Z" />
        <path
          className="cl-vapor-sway"
          d="M 35 161 C 28 154 20 152 12 154 C 19 148 29 149 35 155 Z
             M 35 160 C 30 150 22 145 14 145 C 22 140 32 145 36 154 Z
             M 36 159 C 36 149 32 141 26 137 C 34 138 39 147 38 157 Z
             M 37 159 C 42 150 50 146 58 147 C 51 142 41 147 37 156 Z
             M 37 161 C 44 155 52 154 60 157 C 53 151 43 153 37 158 Z"
        />
      </g>

      {/* broken Greek column — right */}
      <path
        d="M 168 206 L 170 148 L 172 142 L 174 147 L 177 140 L 180 146 L 182 143 L 184 206 Z"
        fill="#b9c0ce"
        stroke="#ff9ad2"
        strokeWidth="0.7"
        strokeOpacity="0.7"
      />
      <path d="M 172 152 L 171 204 M 176 152 L 175.6 204 M 180 152 L 180.4 204" stroke="#7b8296" strokeWidth="0.6" opacity="0.8" fill="none" />
      <path className="cl-vapor-float-alt" d="M 172 128 L 184 126 L 186 132 L 174 135 Z" fill="#cdd3de" stroke="#22e6ff" strokeWidth="0.6" />

      {/* floating wireframe shapes — spin/pulse; swapped in palettes 2-3 */}
      <g className="cl-vapor-float" fill="none" strokeLinejoin="round">
        <g className="cl-vapor-spin">
          {altShapes ? (
            <path className="cl-vapor-glow-cyan" d="M 30 52 L 45 67 L 30 82 L 15 67 Z" stroke="#22e6ff" strokeWidth="1" />
          ) : (
            <>
              <path className="cl-vapor-glow-cyan" d="M 30 52 L 46 82 L 14 82 Z" stroke="#22e6ff" strokeWidth="1" />
              <path d="M 30 52 L 30 82 M 30 52 L 22 82 M 30 52 L 38 82" stroke="#22e6ff" strokeWidth="0.4" opacity="0.6" />
            </>
          )}
        </g>
      </g>
      <g className="cl-vapor-float-alt cl-vapor-glow-pink">
        {altShapes ? (
          <rect className="cl-vapor-pulse" x="159" y="67" width="14" height="14" fill="none" stroke="#ff2e9a" strokeWidth="1.1" />
        ) : (
          <circle className="cl-vapor-pulse" cx="166" cy="74" r="9" fill="none" stroke="#ff2e9a" strokeWidth="1.1" />
        )}
      </g>
      <path className="cl-vapor-float" d="M 152 108 h 8 M 156 104 v 8" stroke="#7b2ff7" strokeWidth="1.2" fill="none" opacity="0.9" />

      {/* checker patch under the statue */}
      <path d="M 62 210 L 138 210 L 150 230 L 50 230 Z" fill="url(#clVaporCheck)" />

      {/* statue reflection on the floor */}
      <use href="#clVaporFig" transform="translate(0 420) scale(1 -1)" opacity="0.14" />

      {/* chrome statue Hermit */}
      <g id="clVaporFig">
        {/* staff in the left hand */}
        <path className="cl-vapor-glow-cyan" d="M 64 100 Q 60 155 64 210" fill="none" stroke="#dfe6ee" strokeWidth="2.6" strokeLinecap="round" />
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
        <path d="M 92 108 C 92 100 96 96 100 96 C 104 96 108 100 108 108 C 104 112 96 112 92 108 Z" fill="#140a26" />
        {/* marble veins / robe folds */}
        <path d="M 96 130 C 94 150 95 176 93 204 M 108 134 C 110 156 108 182 110 206" fill="none" stroke="#8f97a8" strokeWidth="0.7" opacity="0.55" />
        {/* arms */}
        <path d="M 80 124 C 74 126 69 130 67 136" fill="none" stroke="#c3c9d6" strokeWidth="4.6" strokeLinecap="round" />
        <path d="M 120 122 C 128 116 134 108 138 100" fill="none" stroke="#c3c9d6" strokeWidth="4.6" strokeLinecap="round" />
        {/* rim light — pink on the left, cyan on the right */}
        <g fill="none" strokeLinecap="round">
          <path className="cl-vapor-rim cl-vapor-glow-pink" stroke="#ff5cb4" strokeWidth="1.4" d="M 100 90 C 88 92 82 102 83 114 C 78 124 76 138 75 154 C 74 170 73 188 72 210" />
          <path className="cl-vapor-rim cl-vapor-glow-cyan" stroke="#5cecff" strokeWidth="1.4" d="M 100 90 C 112 92 118 102 117 114 C 122 124 124 138 125 154 C 126 170 127 188 128 210" />
        </g>
        {/* lantern raised in the right hand */}
        <g>
          <path d="M 134 86 Q 141 79 148 86" fill="none" stroke="#dfe6ee" strokeWidth="1.6" />
          <path d="M 133 88 L 149 88 L 151 106 L 131 106 Z" fill="url(#clVaporChrome)" stroke="#8f97a8" strokeWidth="0.7" />
          <path
            className="cl-vapor-glow-star cl-vapor-twinkle"
            d="M 141 92 L 142.3 95.7 L 146 96 L 142.3 96.3 L 141 100 L 139.7 96.3 L 136 96 L 139.7 95.7 Z"
            fill="#fff3d0"
          />
        </g>
      </g>

      {/* hover chrome sheen — diagonal band clipped to the statue, screen blend */}
      <g clipPath="url(#clVaporFigClip)">
        <rect className="cl-vapor-sheen" x="30" y="60" width="70" height="170" fill="url(#clVaporSheen)" />
      </g>
    </>
  );
}

/** I — The Magician: figure at a table, wand raised, infinity above, 4 suits. */
function MagicianScene() {
  const body =
    "M 100 96 C 90 98 85 108 86 122 L 84 202 L 116 202 L 114 122 C 115 108 110 98 100 96 Z";
  return (
    <>
      {/* lemniscate floating above the head */}
      <path className="cl-vapor-float cl-vapor-glow-pink" d="M 86 58 C 86 50 97 50 100 58 C 103 66 114 66 114 58 C 114 50 103 50 100 58 C 97 66 86 66 86 58 Z" fill="none" stroke="#ff5cb4" strokeWidth="1.6" />
      {/* figure — chrome statue */}
      <circle cx="100" cy="86" r="8" fill="url(#clVaporChrome)" />
      <path d={body} fill="url(#clVaporChrome)" />
      <g fill="none" strokeLinecap="round">
        <path className="cl-vapor-rim cl-vapor-glow-pink" d="M 100 96 C 90 98 85 108 86 122 L 84 202" stroke="#ff5cb4" strokeWidth="1.3" />
        <path className="cl-vapor-rim cl-vapor-glow-cyan" d="M 100 96 C 110 98 115 108 114 122 L 116 202" stroke="#5cecff" strokeWidth="1.3" />
      </g>
      {/* raised right arm + wand with sparking tip */}
      <path d="M 112 106 C 122 100 130 90 136 76" fill="none" stroke="#c3c9d6" strokeWidth="4.4" strokeLinecap="round" />
      <path className="cl-vapor-glow-cyan" d="M 136 76 L 150 46" fill="none" stroke="#dfe6ee" strokeWidth="2" strokeLinecap="round" />
      <Star4 x={151} y={42} r={5.5} className="cl-vapor-glow-star cl-vapor-twinkle" />
      {/* left arm pointing down */}
      <path d="M 88 106 C 82 114 78 124 76 134" fill="none" stroke="#c3c9d6" strokeWidth="4.4" strokeLinecap="round" />
      {/* table with the four suit symbols */}
      <rect x="44" y="204" width="112" height="7" rx="1.5" fill="url(#clVaporChrome)" stroke="#8f97a8" strokeWidth="0.5" />
      <rect x="50" y="211" width="4" height="28" fill="#9aa2b4" />
      <rect x="146" y="211" width="4" height="28" fill="#9aa2b4" />
      <g fill="none" strokeLinecap="round" strokeWidth="1.2">
        <path className="cl-vapor-glow-pink" d="M 55 199 A 5 5 0 0 0 65 199 M 60 199 L 60 203" stroke="#ff5cb4" />
        <path className="cl-vapor-glow-cyan" d="M 86 190 L 86 202 M 82 196 L 90 196" stroke="#5cecff" />
        <path className="cl-vapor-glow-pink" d="M 112 190 A 5 5 0 1 0 112 200 A 5 5 0 1 0 112 190 M 112 191 L 115.8 195 L 112 199 L 108.2 195 Z" stroke="#ff5cb4" />
        <path className="cl-vapor-glow-cyan" d="M 136 202 L 146 190" stroke="#5cecff" />
      </g>
      <Sheen id="clVaporShMag"><path d={body} /></Sheen>
    </>
  );
}

/** III — The Empress: star-crowned figure, Venus heart shield, wheat below. */
function EmpressScene() {
  const robe =
    "M 100 104 C 86 108 78 130 74 160 C 71 186 70 212 69 236 L 131 236 C 130 212 129 186 126 160 C 122 130 114 108 100 104 Z";
  return (
    <>
      {/* crown with a twinkling star */}
      <path d="M 88 84 L 92 70 L 97 80 L 100 68 L 103 80 L 108 70 L 112 84 Z" fill="url(#clVaporChrome)" stroke="#ff9ad2" strokeWidth="0.7" />
      <Star4 x={100} y={60} r={5} className="cl-vapor-glow-star cl-vapor-twinkle" />
      {/* crowned figure */}
      <circle cx="100" cy="94" r="9" fill="url(#clVaporChrome)" />
      <path d={robe} fill="url(#clVaporChrome)" />
      <g fill="none" strokeLinecap="round">
        <path className="cl-vapor-rim cl-vapor-glow-pink" d="M 100 104 C 86 108 78 130 74 160 C 71 186 70 212 69 236" stroke="#ff5cb4" strokeWidth="1.3" />
        <path className="cl-vapor-rim cl-vapor-glow-cyan" d="M 100 104 C 114 108 122 130 126 160 C 129 186 130 212 131 236" stroke="#5cecff" strokeWidth="1.3" />
      </g>
      {/* heart shield with Venus symbol */}
      <path className="cl-vapor-glow-pink" d="M 150 166 C 150 160 159 160 159 167 C 159 173 150 180 150 184 C 150 180 141 173 141 167 C 141 160 150 160 150 166 Z" fill="#ff5cb4" opacity="0.9" />
      <path d="M 150 169 m -3 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0 M 150 172 L 150 179 M 147 176 L 153 176" fill="none" stroke="#fff" strokeWidth="1" />
      {/* wheat — swaying */}
      <g className="cl-vapor-sway" style={{ transformOrigin: "46px 240px" }} stroke="#ffcf8a" strokeWidth="1.2" fill="none" strokeLinecap="round">
        <path d="M 40 242 L 40 208 M 34 216 L 40 210 M 46 216 L 40 210 M 34 226 L 40 220 M 46 226 L 40 220 M 54 242 L 54 204 M 48 212 L 54 206 M 60 212 L 54 206 M 48 222 L 54 216 M 60 222 L 54 216" />
      </g>
      <g className="cl-vapor-sway" style={{ transformOrigin: "154px 240px" }} stroke="#ffcf8a" strokeWidth="1.2" fill="none" strokeLinecap="round">
        <path d="M 148 242 L 148 208 M 142 216 L 148 210 M 154 216 L 148 210 M 142 226 L 148 220 M 154 226 L 148 220 M 162 242 L 162 204 M 156 212 L 162 206 M 168 212 L 162 206 M 156 222 L 162 216 M 168 222 L 162 216" />
      </g>
      {/* lush floating accents */}
      <circle className="cl-vapor-float-alt cl-vapor-glow-pink" cx="34" cy="70" r="7" fill="none" stroke="#ff2e9a" strokeWidth="1" />
      <path className="cl-vapor-float" d="M 162 66 h 8 M 166 62 v 8" stroke="#7b2ff7" strokeWidth="1.2" fill="none" opacity="0.9" />
      <Sheen id="clVaporShEmp"><path d={robe} /></Sheen>
    </>
  );
}

/** VII — The Chariot: boxy chariot, starred canopy, two sphinxes, city wall. */
function ChariotScene() {
  return (
    <>
      {/* city wall along the horizon */}
      <path
        d="M 18 190 L 18 172 L 26 172 L 26 166 L 34 166 L 34 172 L 58 172 L 58 164 L 66 164 L 66 172 L 134 172 L 134 164 L 142 164 L 142 172 L 166 172 L 166 166 L 174 166 L 174 172 L 182 172 L 182 190 Z"
        fill="#0e0218" stroke="#5cecff" strokeWidth="0.4" opacity="0.95"
      />
      {/* starred canopy */}
      <path d="M 60 118 Q 100 94 140 118 L 140 126 L 60 126 Z" fill="url(#clVaporChrome)" stroke="#5cecff" strokeWidth="0.7" />
      <Star4 x={78} y={116} r={3} className="cl-vapor-glow-star" />
      <Star4 x={122} y={116} r={3} className="cl-vapor-glow-star" />
      <Star4 x={100} y={108} r={4.5} className="cl-vapor-glow-star cl-vapor-twinkle" />
      <path d="M 64 126 L 64 160 M 136 126 L 136 160" stroke="#9aa2b4" strokeWidth="1.4" fill="none" />
      {/* charioteer */}
      <circle cx="100" cy="140" r="8" fill="url(#clVaporChrome)" />
      <path d="M 86 152 L 114 152 L 118 170 L 82 170 Z" fill="url(#clVaporChrome)" />
      {/* boxy chariot */}
      <rect x="58" y="168" width="84" height="42" rx="2" fill="url(#clVaporChrome)" stroke="#8f97a8" strokeWidth="0.6" />
      <path d="M 58 180 H 142 M 78 168 V 210 M 100 168 V 210 M 122 168 V 210" stroke="#8f97a8" strokeWidth="0.6" fill="none" opacity="0.7" />
      <g fill="none" strokeLinecap="round">
        <path className="cl-vapor-rim cl-vapor-glow-pink" d="M 58 168 V 210" stroke="#ff5cb4" strokeWidth="1.3" />
        <path className="cl-vapor-rim cl-vapor-glow-cyan" d="M 142 168 V 210" stroke="#5cecff" strokeWidth="1.3" />
      </g>
      {/* two sphinxes — pink left, cyan right */}
      <g fill="#140a26" strokeWidth="1">
        <path className="cl-vapor-glow-pink" d="M 30 240 C 30 228 40 222 48 222 C 54 222 56 228 58 232 L 68 232 C 72 232 74 236 74 240 Z" stroke="#ff5cb4" />
        <circle className="cl-vapor-glow-pink" cx="44" cy="218" r="5" stroke="#ff5cb4" />
        <path className="cl-vapor-glow-cyan" d="M 170 240 C 170 228 160 222 152 222 C 146 222 144 228 142 232 L 132 232 C 128 232 126 236 126 240 Z" stroke="#5cecff" />
        <circle className="cl-vapor-glow-cyan" cx="156" cy="218" r="5" stroke="#5cecff" />
      </g>
      <Sheen id="clVaporShCha"><rect x="58" y="168" width="84" height="42" /></Sheen>
    </>
  );
}

/** X — Wheel of Fortune: spoked wheel slowly turning, sphinx atop, snake/beast. */
function WheelScene() {
  return (
    <>
      {/* sphinx seated on top */}
      <path className="cl-vapor-glow-pink" d="M 88 96 C 88 88 96 84 100 84 C 106 84 108 90 108 94 L 114 94 C 117 94 118 97 118 99 L 118 101 L 88 101 Z" fill="#140a26" stroke="#ff5cb4" strokeWidth="0.8" />
      {/* the wheel — rotates slowly */}
      <g className="cl-vapor-spin" style={{ transformOrigin: "100px 150px", transformBox: "view-box" }}>
        <circle cx="100" cy="150" r="46" fill="none" stroke="url(#clVaporChrome)" strokeWidth="3" />
        <circle cx="100" cy="150" r="32" fill="none" stroke="#9aa2b4" strokeWidth="1.2" />
        <path d="M 100 104 V 196 M 54 150 H 146 M 68 118 L 132 182 M 132 118 L 68 182" stroke="#c3c9d6" strokeWidth="1.4" fill="none" />
        {/* rim glyphs */}
        <g fill="none" stroke="#ff5cb4" strokeWidth="1.1">
          <path d="M 96 112 L 104 112 L 100 105 Z" />
          <circle cx="138" cy="150" r="4" />
          <rect x="96" y="186" width="8" height="8" />
          <path d="M 58 146 V 154 M 54 150 H 62" />
        </g>
        <circle cx="100" cy="150" r="5" fill="url(#clVaporChrome)" />
        <Star4 x={100} y={150} r={3.5} className="cl-vapor-glow-star cl-vapor-twinkle" />
      </g>
      {/* snake descending the left */}
      <path className="cl-vapor-glow-pink" d="M 30 214 C 24 200 36 194 30 180 C 24 166 36 160 30 146" fill="none" stroke="#ff5cb4" strokeWidth="2" strokeLinecap="round" />
      <path d="M 30 146 L 26 138 L 34 138 Z" fill="#ff5cb4" />
      {/* jackal creature rising on the right */}
      <path className="cl-vapor-glow-cyan" d="M 170 214 C 176 200 164 194 170 180 L 172 172" fill="none" stroke="#5cecff" strokeWidth="2" strokeLinecap="round" />
      <path d="M 172 172 L 164 162 L 168 160 L 172 166 L 176 158 L 180 160 L 176 172 Z" fill="#140a26" stroke="#5cecff" strokeWidth="0.8" />
      <Sheen id="clVaporShWhe"><circle cx="100" cy="150" r="48" /></Sheen>
    </>
  );
}

/** XIII — Death: skeletal rider, dark banner with white rose, two towers. */
function DeathScene() {
  const horse =
    "M 66 210 C 66 192 84 182 104 184 C 122 186 134 190 138 200 L 156 178 C 162 172 170 174 168 182 L 162 196 L 142 210 L 140 218 L 70 218 Z";
  return (
    <>
      {/* two towers framing the rising sun */}
      <rect x="52" y="154" width="13" height="36" fill="#0e0218" stroke="#5cecff" strokeWidth="0.5" />
      <rect x="135" y="154" width="13" height="36" fill="#0e0218" stroke="#5cecff" strokeWidth="0.5" />
      {/* horse */}
      <path d={horse} fill="#140a26" stroke="#ff5cb4" strokeWidth="0.8" />
      <path d="M 78 216 L 74 246 M 94 218 L 92 246 M 122 218 L 124 246 M 136 214 L 140 246" stroke="#140a26" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      {/* skeletal rider */}
      <circle cx="104" cy="150" r="7" fill="#e8ecf4" />
      <circle cx="101" cy="149" r="1.4" fill="#140a26" />
      <circle cx="107" cy="149" r="1.4" fill="#140a26" />
      <path d="M 104 157 L 106 186" stroke="#e8ecf4" strokeWidth="1.6" fill="none" />
      <path d="M 98 166 Q 105 170 112 166 M 98 173 Q 105 177 113 173 M 99 180 Q 106 184 112 180 M 102 162 C 94 158 86 152 80 146" fill="none" stroke="#e8ecf4" strokeWidth="1.1" />
      {/* banner pole + fluttering dark banner with the white rose */}
      <path d="M 76 118 L 78 208" stroke="#dfe6ee" strokeWidth="1.8" fill="none" />
      <g className="cl-vapor-sway" style={{ transformOrigin: "76px 120px" }}>
        <path d="M 76 96 L 44 92 L 44 120 L 76 124 Z" fill="#140a26" stroke="#ff5cb4" strokeWidth="0.8" />
        <g className="cl-vapor-glow-star cl-vapor-twinkle">
          <circle cx="60" cy="108" r="6" fill="#fff" />
          <path d="M 60 103 V 113 M 55 106 L 65 110 M 65 106 L 55 110" stroke="#ffd7f0" strokeWidth="0.8" fill="none" />
        </g>
      </g>
      <Sheen id="clVaporShDea"><path d={horse} /></Sheen>
    </>
  );
}

/** XVII — The Star: kneeling figure pouring two jugs, 8-point star + 7 small. */
function StarScene() {
  const figure =
    "M 88 152 C 82 158 80 172 84 186 L 80 212 L 92 216 L 98 194 L 108 198 L 128 214 L 134 208 L 112 188 L 100 182 C 102 168 98 156 88 152 Z";
  return (
    <>
      {/* big 8-pointed star + seven small stars */}
      <path className="cl-vapor-glow-star cl-vapor-twinkle" d="M 100 46 L 104 58 L 114 52 L 110 64 L 122 68 L 110 72 L 114 84 L 104 78 L 100 90 L 96 78 L 86 84 L 90 72 L 78 68 L 90 64 L 86 52 L 96 58 Z" fill="#fff3d0" />
      <g fill="#e8dcff" opacity="0.9">
        <path className="cl-vapor-float" d="M 40 98 L 42.5 104 L 40 110 L 37.5 104 Z" />
        <path d="M 56 58 L 58.5 64 L 56 70 L 53.5 64 Z" />
        <path className="cl-vapor-float-alt" d="M 74 34 L 76.5 40 L 74 46 L 71.5 40 Z" />
        <path d="M 126 34 L 128.5 40 L 126 46 L 123.5 40 Z" />
        <path className="cl-vapor-float" d="M 144 58 L 146.5 64 L 144 70 L 141.5 64 Z" />
        <path d="M 160 98 L 162.5 104 L 160 110 L 157.5 104 Z" />
        <path className="cl-vapor-float-alt" d="M 100 108 L 102.5 114 L 100 120 L 97.5 114 Z" />
      </g>
      {/* kneeling figure */}
      <circle cx="86" cy="144" r="7" fill="url(#clVaporChrome)" />
      <path d={figure} fill="url(#clVaporChrome)" />
      <path className="cl-vapor-rim cl-vapor-glow-pink" d="M 88 152 C 82 158 80 172 84 186 L 80 212" fill="none" stroke="#ff5cb4" strokeWidth="1.3" strokeLinecap="round" />
      {/* jugs + glowing water streams */}
      <path d="M 62 164 A 7 7 0 0 0 74 168 L 70 158 Z" fill="url(#clVaporChrome)" stroke="#8f97a8" strokeWidth="0.5" />
      <path className="cl-vapor-glow-cyan" d="M 62 172 C 56 190 54 206 54 224" fill="none" stroke="#5cecff" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 118 166 A 7 7 0 0 1 130 172 L 124 160 Z" fill="url(#clVaporChrome)" stroke="#8f97a8" strokeWidth="0.5" />
      <path className="cl-vapor-glow-cyan" d="M 124 176 C 132 192 140 208 146 222" fill="none" stroke="#5cecff" strokeWidth="1.5" strokeLinecap="round" />
      {/* pool */}
      <ellipse className="cl-vapor-glow-cyan" cx="152" cy="234" rx="26" ry="7" fill="#0a2a3a" stroke="#5cecff" strokeWidth="0.9" />
      <path d="M 134 234 Q 143 230 152 234 Q 161 238 170 234" fill="none" stroke="#5cecff" strokeWidth="0.7" opacity="0.8" />
      <Sheen id="clVaporShSta"><path d={figure} /></Sheen>
    </>
  );
}

/** XXII — The Fool: profile figure stepping toward a cliff, dog at heels. */
function FoolScene() {
  const body =
    "M 122 122 C 116 130 114 144 115 160 L 128 160 C 129 146 128 132 122 122 Z";
  return (
    <>
      {/* cliff edge at the right */}
      <path d="M 130 252 L 130 210 L 148 202 L 158 210 L 160 252 Z" fill="#0e0218" stroke="#ff9ad2" strokeWidth="0.5" />
      {/* figure in profile, head tilted up */}
      <circle cx="122" cy="114" r="7" fill="url(#clVaporChrome)" />
      <path d="M 124 108 Q 128 106 130 109" fill="none" stroke="#8f97a8" strokeWidth="0.8" />
      <path d={body} fill="url(#clVaporChrome)" />
      <path className="cl-vapor-rim cl-vapor-glow-pink" d="M 122 122 C 116 130 114 144 115 160" fill="none" stroke="#ff5cb4" strokeWidth="1.3" strokeLinecap="round" />
      {/* stepping legs — front foot over the edge */}
      <path d="M 118 160 L 128 186 L 142 198" fill="none" stroke="#c3c9d6" strokeWidth="4" strokeLinecap="round" />
      <path d="M 116 160 L 108 188 L 104 206" fill="none" stroke="#c3c9d6" strokeWidth="4" strokeLinecap="round" />
      {/* bundle on a stick over the back shoulder */}
      <path d="M 116 136 L 92 100" stroke="#dfe6ee" strokeWidth="1.8" fill="none" className="cl-vapor-glow-cyan" />
      <circle cx="89" cy="94" r="6.5" fill="url(#clVaporChrome)" stroke="#8f97a8" strokeWidth="0.6" />
      <path d="M 84 90 L 94 98 M 94 90 L 84 98" stroke="#8f97a8" strokeWidth="0.7" fill="none" />
      {/* small dog at his heels */}
      <path className="cl-vapor-glow-cyan" d="M 78 218 C 78 211 86 208 91 211 L 95 215 L 95 219 L 78 219 Z" fill="#140a26" stroke="#5cecff" strokeWidth="0.8" />
      <path d="M 79 212 Q 74 206 77 202" fill="none" stroke="#5cecff" strokeWidth="1" />
      <Sheen id="clVaporShFoo"><path d={body} /></Sheen>
    </>
  );
}

/* ---- card --------------------------------------------------------------- */

export default function VaporwaveHermitCard({
  number = 9,
  name = "THE HERMIT",
  variant = 0,
}: VaporwaveCardProps) {
  const v = Math.max(0, Math.min(7, Math.floor(variant)));
  const palette = (v >> 1) & 3; // 0-3: hue-rotate palette scheme
  const mirrored = (v & 1) === 1; // bit 0: mirror the scene
  const altShapes = palette >= 2; // Hermit: palettes 2-3 swap floating shapes
  const sceneClass = palette > 0 ? `cl-vapor-pal-${palette}` : undefined;

  // Fit long card names (e.g. WHEEL OF FORTUNE) without changing THE HERMIT.
  const nameSize = name.length <= 10 ? 16 : name.length <= 15 ? 13 : 11;
  const nameTracking = name.length <= 10 ? 3 : 1.5;

  const scene =
    number === 1 ? <MagicianScene /> :
    number === 3 ? <EmpressScene /> :
    number === 7 ? <ChariotScene /> :
    number === 10 ? <WheelScene /> :
    number === 13 ? <DeathScene /> :
    number === 17 ? <StarScene /> :
    number === 22 ? <FoolScene /> :
    <HermitScene altShapes={altShapes} />;

  return (
    <figure
      className="cl-vapor-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
      aria-label={`${name} tarot card in vaporwave retro-futurism style`}
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

        /* ---- variant palettes (hue-rotate the whole scene) ---- */
        .cl-vapor-pal-1 { filter: hue-rotate(130deg); }
        .cl-vapor-pal-2 { filter: hue-rotate(210deg); }
        .cl-vapor-pal-3 { filter: hue-rotate(300deg); }

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

        /* ---- signature: sun hue-shift, magenta-orange -> cyan-purple ---- */
        @keyframes cl-vapor-hueshift {
          0%, 100% {
            filter:
              hue-rotate(0deg)
              drop-shadow(0 0 6px rgba(255, 120, 120, 0.5))
              drop-shadow(0 0 22px rgba(255, 60, 140, 0.4));
          }
          50% {
            filter:
              hue-rotate(200deg)
              drop-shadow(0 0 6px rgba(120, 225, 255, 0.55))
              drop-shadow(0 0 22px rgba(123, 47, 247, 0.45));
          }
        }
        .cl-vapor-hueshift { animation: cl-vapor-hueshift 20s ease-in-out infinite; }

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

        /* ---- signature: whole-card CRT glitch, 2 frames every ~8s ---- */
        @keyframes cl-vapor-glitch {
          0%, 92.4% { transform: translateX(0); filter: none; }
          92.5% { transform: translateX(-3px); filter: hue-rotate(90deg) saturate(2.2); }
          93.4% { transform: translateX(2.5px); filter: hue-rotate(-70deg) saturate(1.7) contrast(1.2); }
          94.3%, 100% { transform: translateX(0); filter: none; }
        }
        .cl-vapor-glitch { animation: cl-vapor-glitch 8s steps(1, end) infinite; }

        /* ---- signature: floating shape slow rotation ---- */
        @keyframes cl-vapor-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .cl-vapor-spin {
          animation: cl-vapor-spin 24s linear infinite;
          transform-box: fill-box;
          transform-origin: center;
        }

        /* ---- signature: ring scale pulse ---- */
        @keyframes cl-vapor-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.22); }
        }
        .cl-vapor-pulse {
          animation: cl-vapor-pulse 3.4s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: center;
        }

        /* ---- signature: palm fronds sway from the trunk top ---- */
        @keyframes cl-vapor-sway {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        .cl-vapor-sway {
          animation: cl-vapor-sway 6s ease-in-out infinite;
          transform-box: view-box;
          transform-origin: 35px 160px;
        }

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
          .cl-vapor-hueshift,
          .cl-vapor-sunscroll,
          .cl-vapor-gridscroll,
          .cl-vapor-scandrift,
          .cl-vapor-glitch,
          .cl-vapor-spin,
          .cl-vapor-pulse,
          .cl-vapor-sway,
          .cl-vapor-float,
          .cl-vapor-float-alt,
          .cl-vapor-twinkle { animation: none; }
          .cl-vapor-card:hover .cl-vapor-sheen { animation: none; }
          .cl-vapor-rim { transition: none; }
        }
      `}</style>

      <svg className="cl-vapor-glitch" viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" role="img">
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
          {/* chrome banding for the numeral */}
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
          <linearGradient id="clVaporGridFade" gradientUnits="userSpaceOnUse" x1="0" y1="190" x2="0" y2="214">
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
          <clipPath id="clVaporSunClip"><circle cx="100" cy="168" r="56" /></clipPath>
          <clipPath id="clVaporStripeClip"><rect x="30" y="150" width="140" height="90" /></clipPath>
          {/* statue silhouette clip for the sheen sweep */}
          <clipPath id="clVaporFigClip">
            <path d="M 100 90 C 88 92 82 102 83 114 C 78 124 76 138 75 154 C 74 170 73 188 72 210 L 128 210 C 127 188 126 170 125 154 C 124 138 122 124 117 114 C 118 102 112 92 100 90 Z" />
          </clipPath>
          {/* grid lines fade in from the horizon while scrolling */}
          <mask id="clVaporGridMask">
            <rect x="0" y="188" width="200" height="116" fill="url(#clVaporGridFade)" />
          </mask>
        </defs>

        {/* scene — palette hue-shift + optional mirror apply here; texts stay put */}
        <g className={sceneClass} transform={mirrored ? "translate(200 0) scale(-1 1)" : undefined}>
          {/* sky stars */}
          <path
            d="M 24 30 m -0.9 0 a 0.9 0.9 0 1 0 1.8 0 a 0.9 0.9 0 1 0 -1.8 0 M 58 18 m -0.7 0 a 0.7 0.7 0 1 0 1.4 0 a 0.7 0.7 0 1 0 -1.4 0
               M 146 26 m -0.9 0 a 0.9 0.9 0 1 0 1.8 0 a 0.9 0.9 0 1 0 -1.8 0 M 178 48 m -0.7 0 a 0.7 0.7 0 1 0 1.4 0 a 0.7 0.7 0 1 0 -1.4 0
               M 16 86 m -0.7 0 a 0.7 0.7 0 1 0 1.4 0 a 0.7 0.7 0 1 0 -1.4 0 M 186 98 m -0.8 0 a 0.8 0.8 0 1 0 1.6 0 a 0.8 0.8 0 1 0 -1.6 0"
            fill="#e8dcff" opacity="0.8"
          />

          {/* striped retro sun — hue-shifts slowly, stripes scroll down seamlessly */}
          <g className="cl-vapor-hueshift">
            <g clipPath="url(#clVaporSunClip)">
              <circle cx="100" cy="168" r="56" fill="url(#clVaporSun)" />
              <g clipPath="url(#clVaporStripeClip)">
                <path
                  className="cl-vapor-sunscroll"
                  d="M 30 137 h 140 v 5 h -140 Z M 30 150 h 140 v 5 h -140 Z M 30 163 h 140 v 5 h -140 Z M 30 176 h 140 v 5 h -140 Z M 30 189 h 140 v 5 h -140 Z M 30 202 h 140 v 5 h -140 Z M 30 215 h 140 v 5 h -140 Z"
                  fill="#160328" opacity="0.88"
                />
              </g>
            </g>
          </g>

          {/* grid floor */}
          <rect x="0" y="190" width="200" height="110" fill="url(#clVaporFloor)" />
          <g className="cl-vapor-glow-pink" stroke="#ff2e9a" strokeWidth="0.8" opacity="0.9" fill="none">
            {/* converging verticals — static */}
            <path d="M 100 190 L -45 300 M 100 190 L -12 300 M 100 190 L 22 300 M 100 190 L 56 300 M 100 190 L 144 300 M 100 190 L 178 300 M 100 190 L 212 300 M 100 190 L 245 300" />
            <path d="M 100 190 L 100 300" stroke="#22e6ff" />
          </g>
          {/* scrolling horizontals — period 22px, faded in from the horizon */}
          <g mask="url(#clVaporGridMask)">
            <path
              className="cl-vapor-gridscroll cl-vapor-glow-pink"
              d="M 0 168 H 200 M 0 190 H 200 M 0 212 H 200 M 0 234 H 200 M 0 256 H 200 M 0 278 H 200 M 0 300 H 200"
              stroke="#ff2e9a" strokeWidth="0.9" opacity="0.9" fill="none"
            />
          </g>
          {/* horizon line */}
          <path className="cl-vapor-glow-cyan" d="M 0 190 H 200" stroke="#7df3ff" strokeWidth="1" fill="none" />

          {scene}
        </g>

        {/* numeral — chrome gradient, top center (unmirrored) */}
        <text
          className="cl-vapor-glow-ix"
          x="100" y="40" textAnchor="middle"
          fontFamily="'Arial Black', Arial, Helvetica, sans-serif"
          fontWeight="900" fontSize="21" letterSpacing="7"
          fill="url(#clVaporChromeTx)" stroke="#2a0a44" strokeWidth="0.5"
        >
          {toRoman(number)}
        </text>

        {/* card name — italic serif with vertical latin accent (unmirrored) */}
        <text
          className="cl-vapor-glow-pink"
          x="98" y="272" textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontStyle="italic" fontSize={nameSize} letterSpacing={nameTracking}
          fill="#ffd7f0"
        >
          {name}
        </text>
        <text
          x="182" y="252" textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="6.5" letterSpacing="2"
          fill="#5cecff" opacity="0.9"
          transform="rotate(-90 182 252)"
        >
          {LATIN[number] ?? "EREMITA · MONTIS"}
        </text>
        {/* chrome underline */}
        <path className="cl-vapor-glow-cyan" d="M 46 282 H 150" stroke="url(#clVaporChromeTx)" strokeWidth="1.2" fill="none" />

        {/* scanlines — drifting slowly (period 4px) */}
        <rect className="cl-vapor-scandrift" x="0" y="-4" width="200" height="308" fill="url(#clVaporScan)" />
      </svg>
    </figure>
  );
}
