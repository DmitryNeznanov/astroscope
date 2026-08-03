import type { JSX } from "react";

/**
 * ArcanaArt — line-art / engraving-inspired illustrations of the 22 Major Arcana.
 *
 * Conventions:
 * - Single viewBox "0 0 240 360" (portrait tarot proportion).
 * - All artwork inherits stroke="currentColor" / fill="none" from the <svg>,
 *   so consumers control color via CSS `color`.
 * - Base strokeWidth is 3 units; fine detail uses 1.5.
 * - Rare accent fills use fill="currentColor" with fillOpacity only.
 */

type CardArt = () => JSX.Element;

// I — The Magician: raised wand arm, lemniscate overhead, table with the four tools.
const Magician: CardArt = () => (
  <g>
    <circle cx={112} cy={38} r={9} strokeWidth={1.5} />
    <circle cx={128} cy={38} r={9} strokeWidth={1.5} />
    <circle cx={120} cy={74} r={13} />
    <line x1={104} y1={92} x2={136} y2={92} />
    <path d="M104 92 L96 220 L144 220 L136 92" />
    <line x1={104} y1={118} x2={136} y2={118} strokeWidth={1.5} />
    <line x1={134} y1={96} x2={162} y2={58} />
    <line x1={162} y1={58} x2={172} y2={34} />
    <line x1={106} y1={96} x2={82} y2={142} />
    <rect x={48} y={252} width={144} height={14} />
    <line x1={60} y1={266} x2={60} y2={312} />
    <line x1={180} y1={266} x2={180} y2={312} />
    <path d="M66 252 a9 9 0 0 0 18 0" strokeWidth={1.5} />
    <line x1={100} y1={252} x2={100} y2={230} strokeWidth={1.5} />
    <line x1={93} y1={238} x2={107} y2={238} strokeWidth={1.5} />
    <circle cx={132} cy={241} r={9} strokeWidth={1.5} />
    <polygon points="132,235 136,241 132,247 128,241" strokeWidth={1.5} />
    <line x1={154} y1={252} x2={172} y2={232} strokeWidth={1.5} />
  </g>
);

// II — The High Priestess: seated between two pillars, veil, crescent at her feet.
const HighPriestess: CardArt = () => (
  <g>
    <rect x={42} y={92} width={22} height={216} />
    <rect x={176} y={92} width={22} height={216} />
    <line x1={36} y1={92} x2={70} y2={92} />
    <line x1={170} y1={92} x2={204} y2={92} />
    <path d="M64 108 Q120 84 176 108 L176 300 Q120 278 64 300 Z" strokeWidth={1.5} />
    <path d="M112 66 a12 12 0 1 0 16 0 a9 9 0 1 1 -16 0" strokeWidth={1.5} />
    <circle cx={120} cy={112} r={13} />
    <path d="M102 128 L92 292 L148 292 L138 128" />
    <line x1={120} y1={130} x2={120} y2={288} strokeWidth={1.5} />
    <rect x={104} y={196} width={32} height={16} strokeWidth={1.5} />
    <path d="M96 322 a16 16 0 1 0 48 0 a12 12 0 1 1 -48 0" />
  </g>
);

// III — The Empress: star crown, heart shield with Venus glyph, wheat below.
const Empress: CardArt = () => (
  <g>
    <polygon points="98,66 106,50 114,62 120,46 126,62 134,50 142,66" />
    <circle cx={120} cy={84} r={13} />
    <circle cx={104} cy={40} r={2.5} strokeWidth={1.5} />
    <circle cx={120} cy={34} r={2.5} strokeWidth={1.5} />
    <circle cx={136} cy={40} r={2.5} strokeWidth={1.5} />
    <path d="M100 100 Q80 150 74 260 L166 260 Q160 150 140 100" />
    <line x1={92} y1={132} x2={148} y2={132} strokeWidth={1.5} />
    <path d="M120 152 C120 144 132 144 132 152 C132 160 120 168 120 172 C120 168 108 160 108 152 C108 144 120 144 120 152 Z" />
    <circle cx={120} cy={156} r={3} strokeWidth={1.5} />
    <line x1={120} y1={159} x2={120} y2={166} strokeWidth={1.5} />
    <line x1={117} y1={163} x2={123} y2={163} strokeWidth={1.5} />
    <path d="M64 340 L64 296 M56 308 L64 302 M72 308 L64 302 M56 322 L64 316 M72 322 L64 316" strokeWidth={1.5} />
    <path d="M88 340 L88 292 M80 304 L88 298 M96 304 L88 298 M80 318 L88 312 M96 318 L88 312" strokeWidth={1.5} />
    <path d="M152 340 L152 292 M144 304 L152 298 M160 304 L152 298 M144 318 L152 312 M160 318 L152 312" strokeWidth={1.5} />
    <path d="M176 340 L176 296 M168 308 L176 302 M184 308 L176 302 M168 322 L176 316 M184 322 L176 316" strokeWidth={1.5} />
  </g>
);

// IV — The Emperor: angular throne, ankh scepter, ram armrests, mountains.
const Emperor: CardArt = () => (
  <g>
    <polyline points="24,306 66,264 102,296 142,256 182,296 216,262" strokeWidth={1.5} />
    <polygon points="78,88 162,88 170,230 70,230" />
    <line x1={78} y1={108} x2={162} y2={108} strokeWidth={1.5} />
    <rect x={106} y={96} width={28} height={14} strokeWidth={1.5} />
    <circle cx={120} cy={128} r={13} />
    <path d="M112 138 Q120 146 128 138" strokeWidth={1.5} />
    <path d="M100 146 L92 226 L148 226 L140 146" />
    <circle cx={58} cy={206} r={13} />
    <path d="M50 198 q-10 -6 -8 -16 M66 198 q10 -6 8 -16" strokeWidth={1.5} />
    <circle cx={182} cy={206} r={13} />
    <path d="M174 198 q-10 -6 -8 -16 M190 198 q10 -6 8 -16" strokeWidth={1.5} />
    <line x1={188} y1={140} x2={188} y2={226} />
    <circle cx={188} cy={128} r={10} />
    <line x1={80} y1={246} x2={80} y2={290} />
    <line x1={160} y1={246} x2={160} y2={290} />
  </g>
);

// V — The Hierophant: triple crown, blessing hand, two crossed keys.
const Hierophant: CardArt = () => (
  <g>
    <polygon points="104,80 136,80 132,64 108,64" />
    <polygon points="108,62 132,62 129,50 111,50" strokeWidth={1.5} />
    <polygon points="112,48 128,48 126,38 114,38" strokeWidth={1.5} />
    <circle cx={120} cy={102} r={13} />
    <path d="M100 120 L88 258 L152 258 L140 120" />
    <line x1={120} y1={124} x2={120} y2={252} strokeWidth={1.5} />
    <line x1={114} y1={124} x2={114} y2={252} strokeWidth={1.5} />
    <line x1={126} y1={124} x2={126} y2={252} strokeWidth={1.5} />
    <path d="M142 128 L164 104 M164 104 l6 -10 M164 104 l10 -4" />
    <path d="M168 92 l4 -8 M178 98 l6 -6" strokeWidth={1.5} />
    <path d="M96 296 L144 330 M144 296 L96 330" />
    <circle cx={91} cy={293} r={6} strokeWidth={1.5} />
    <circle cx={149} cy={293} r={6} strokeWidth={1.5} />
    <path d="M140 326 l6 6 M146 320 l6 6 M94 326 l-6 6 M100 320 l-6 6" strokeWidth={1.5} />
  </g>
);

// VI — The Lovers: radiant sun above, two figures facing one another.
const Lovers: CardArt = () => (
  <g>
    <circle cx={120} cy={66} r={18} />
    <path d="M120 36 L120 24 M120 96 L120 108 M90 66 L78 66 M150 66 L162 66 M99 45 L90 36 M141 45 L150 36 M99 87 L90 96 M141 87 L150 96" strokeWidth={1.5} />
    <path d="M96 120 q24 -14 48 0" strokeWidth={1.5} />
    <path d="M100 120 l-8 12 M140 120 l8 12" strokeWidth={1.5} />
    <circle cx={84} cy={158} r={11} />
    <path d="M72 172 L62 300 L104 300 L96 172" />
    <circle cx={156} cy={158} r={11} />
    <path d="M144 172 L136 300 L178 300 L168 172" />
    <line x1={96} y1={190} x2={128} y2={178} />
    <line x1={144} y1={190} x2={112} y2={178} />
    <polyline points="96,300 120,262 144,300" strokeWidth={1.5} />
  </g>
);

// VII — The Chariot: starred canopy, boxy chariot, two sphinxes, city wall.
const Chariot: CardArt = () => (
  <g>
    <path d="M56 78 Q120 44 184 78 L184 92 L56 92 Z" />
    <circle cx={86} cy={74} r={2.5} strokeWidth={1.5} />
    <circle cx={120} cy={64} r={2.5} strokeWidth={1.5} />
    <circle cx={154} cy={74} r={2.5} strokeWidth={1.5} />
    <line x1={62} y1={92} x2={62} y2={150} strokeWidth={1.5} />
    <line x1={178} y1={92} x2={178} y2={150} strokeWidth={1.5} />
    <polygon points="108,106 132,106 128,96 112,96" strokeWidth={1.5} />
    <circle cx={120} cy={122} r={12} />
    <path d="M104 138 L136 138 L136 166 L104 166 Z" />
    <rect x={66} y={164} width={108} height={56} />
    <line x1={66} y1={180} x2={174} y2={180} strokeWidth={1.5} />
    <polyline points="40,244 40,228 52,228 52,236 64,236 64,228 76,228 76,244" strokeWidth={1.5} />
    <polyline points="164,244 164,228 176,228 176,236 188,236 188,228 200,228 200,244" strokeWidth={1.5} />
    <path d="M52 268 q0 -18 16 -18 q10 0 10 10 l22 0 q8 0 8 8 l0 8 l-56 0 Z" />
    <circle cx={62} cy={256} r={7} strokeWidth={1.5} />
    <path d="M188 268 q0 -18 -16 -18 q-10 0 -10 10 l-22 0 q-8 0 -8 8 l0 8 l56 0 Z" />
    <circle cx={178} cy={256} r={7} strokeWidth={1.5} />
    <line x1={32} y1={292} x2={208} y2={292} strokeWidth={1.5} />
  </g>
);

// VIII — Strength: robed figure closing a lion's jaws, lemniscate above.
const Strength: CardArt = () => (
  <g>
    <circle cx={90} cy={50} r={8} strokeWidth={1.5} />
    <circle cx={106} cy={50} r={8} strokeWidth={1.5} />
    <circle cx={98} cy={86} r={12} />
    <path d="M84 100 L70 300 L126 300 L112 100" />
    <path d="M84 104 q-14 40 -6 96" strokeWidth={1.5} />
    <line x1={110} y1={118} x2={146} y2={158} />
    <line x1={108} y1={140} x2={144} y2={176} />
    <circle cx={164} cy={168} r={22} />
    <circle cx={164} cy={168} r={12} strokeWidth={1.5} />
    <path d="M152 178 q12 10 24 0" strokeWidth={1.5} />
    <path d="M146 160 L144 150 M182 160 L184 150" strokeWidth={1.5} />
    <path d="M182 186 q26 10 22 44 q-2 24 -20 30" />
    <path d="M186 260 q10 4 16 -2" strokeWidth={1.5} />
    <line x1={184} y1={262} x2={184} y2={300} />
    <line x1={200} y1={254} x2={204} y2={300} />
  </g>
);

// IX — The Hermit: hooded figure on a peak, lantern with six-pointed star, staff.
const Hermit: CardArt = () => (
  <g>
    <polyline points="28,336 96,252 128,300 164,244 212,336" strokeWidth={1.5} />
    <path d="M104 96 Q120 72 136 96 L134 116 L106 116 Z" />
    <circle cx={120} cy={104} r={8} strokeWidth={1.5} />
    <path d="M104 116 L92 250 L148 250 L136 116" />
    <line x1={134} y1={124} x2={164} y2={96} />
    <rect x={156} y={66} width={22} height={28} />
    <polygon points="167,72 173,84 161,84" strokeWidth={1.5} />
    <polygon points="167,88 161,76 173,76" strokeWidth={1.5} />
    <line x1={100} y1={128} x2={82} y2={116} />
    <line x1={78} y1={88} x2={78} y2={250} />
    <line x1={108} y1={250} x2={108} y2={286} />
    <line x1={132} y1={250} x2={132} y2={286} />
  </g>
);

// X — Wheel of Fortune: spoked wheel, sphinx above, snake and creature at sides.
const WheelOfFortune: CardArt = () => (
  <g>
    <circle cx={120} cy={190} r={82} />
    <circle cx={120} cy={190} r={58} strokeWidth={1.5} />
    <circle cx={120} cy={190} r={10} />
    <line x1={120} y1={108} x2={120} y2={272} strokeWidth={1.5} />
    <line x1={38} y1={190} x2={202} y2={190} strokeWidth={1.5} />
    <line x1={62} y1={132} x2={178} y2={248} strokeWidth={1.5} />
    <line x1={178} y1={132} x2={62} y2={248} strokeWidth={1.5} />
    <circle cx={120} cy={124} r={3} strokeWidth={1.5} />
    <circle cx={120} cy={256} r={3} strokeWidth={1.5} />
    <circle cx={54} cy={190} r={3} strokeWidth={1.5} />
    <circle cx={186} cy={190} r={3} strokeWidth={1.5} />
    <path d="M100 92 q0 -14 12 -14 q8 0 8 8 l16 0 q6 0 6 6 l0 6 l-42 0 Z" />
    <path d="M112 76 l4 -8 l4 8" strokeWidth={1.5} />
    <path d="M34 250 q-10 22 4 36 q12 12 4 30" strokeWidth={1.5} />
    <path d="M206 300 q14 -10 10 -26 q-4 -14 8 -20" />
    <path d="M216 254 l6 -10 l4 12" strokeWidth={1.5} />
  </g>
);

// XI — Justice: seated between pillars, upright sword and balanced scales.
const Justice: CardArt = () => (
  <g>
    <rect x={40} y={96} width={20} height={208} />
    <rect x={180} y={96} width={20} height={208} />
    <line x1={34} y1={96} x2={66} y2={96} />
    <line x1={174} y1={96} x2={206} y2={96} />
    <polygon points="106,84 134,84 130,70 110,70" />
    <circle cx={120} cy={104} r={13} />
    <path d="M100 122 L88 292 L152 292 L140 122" />
    <line x1={120} y1={126} x2={120} y2={288} strokeWidth={1.5} />
    <line x1={162} y1={128} x2={176} y2={112} />
    <line x1={176} y1={64} x2={176} y2={160} />
    <polygon points="176,50 171,64 181,64" />
    <line x1={164} y1={152} x2={188} y2={152} strokeWidth={1.5} />
    <line x1={78} y1={128} x2={66} y2={142} />
    <line x1={66} y1={118} x2={66} y2={142} strokeWidth={1.5} />
    <line x1={50} y1={126} x2={82} y2={126} strokeWidth={1.5} />
    <path d="M50 126 L44 146 L56 146 Z" strokeWidth={1.5} />
    <path d="M82 126 L76 146 L88 146 Z" strokeWidth={1.5} />
    <rect x={96} y={292} width={48} height={16} strokeWidth={1.5} />
  </g>
);

// XII — The Hanged Man: upside-down from a tau gallows, haloed.
const HangedMan: CardArt = () => (
  <g>
    <line x1={150} y1={44} x2={150} y2={330} />
    <line x1={62} y1={82} x2={186} y2={82} />
    <path d="M150 60 l10 -12 M150 120 l12 -10 M150 180 l-12 -10" strokeWidth={1.5} />
    <line x1={104} y1={82} x2={104} y2={112} strokeWidth={1.5} />
    <line x1={104} y1={112} x2={110} y2={150} />
    <line x1={110} y1={150} x2={140} y2={120} />
    <path d="M110 150 L92 238 L136 238 L128 152" />
    <path d="M100 168 L118 196 L132 168" strokeWidth={1.5} />
    <circle cx={114} cy={258} r={12} />
    <circle cx={114} cy={258} r={20} strokeWidth={1.5} />
    <line x1={96} y1={330} x2={204} y2={330} strokeWidth={1.5} />
  </g>
);

// XIII — Death: skeletal rider, rose banner, sun between two towers.
const Death: CardArt = () => (
  <g>
    <rect x={52} y={52} width={56} height={48} fill="currentColor" fillOpacity={0.2} stroke="none" />
    <rect x={52} y={52} width={56} height={48} />
    <circle cx={80} cy={76} r={9} strokeWidth={1.5} />
    <path d="M80 67 v18 M71 76 h18 M74 70 l12 12 M86 70 l-12 12" strokeWidth={1.5} />
    <line x1={52} y1={52} x2={52} y2={248} />
    <path d="M96 214 q-6 -40 24 -52 q34 -12 60 4 q18 12 14 34" />
    <path d="M180 166 q20 -10 26 6 q4 14 -8 20 l-18 4" />
    <circle cx={198} cy={176} r={2} strokeWidth={1.5} />
    <line x1={104} y1={210} x2={96} y2={292} />
    <line x1={124} y1={214} x2={118} y2={292} />
    <line x1={168} y1={212} x2={164} y2={292} />
    <line x1={188} y1={206} x2={192} y2={292} />
    <circle cx={128} cy={118} r={11} />
    <circle cx={124} cy={116} r={2} strokeWidth={1.5} />
    <circle cx={133} cy={116} r={2} strokeWidth={1.5} />
    <line x1={128} y1={130} x2={130} y2={168} strokeWidth={1.5} />
    <path d="M122 140 q7 5 14 0 M121 150 q8 5 16 0 M122 160 q7 5 14 0" strokeWidth={1.5} />
    <line x1={126} y1={138} x2={76} y2={128} />
    <rect x={150} y={286} width={16} height={30} strokeWidth={1.5} />
    <rect x={204} y={286} width={16} height={30} strokeWidth={1.5} />
    <path d="M166 316 a19 19 0 0 1 38 0" />
    <line x1={185} y1={290} x2={185} y2={280} strokeWidth={1.5} />
    <line x1={172} y1={296} x2={164} y2={290} strokeWidth={1.5} />
    <line x1={198} y1={296} x2={206} y2={290} strokeWidth={1.5} />
    <line x1={24} y1={316} x2={230} y2={316} strokeWidth={1.5} />
  </g>
);

// XIV — Temperance: winged angel pouring between cups, foot on land and in water.
const Temperance: CardArt = () => (
  <g>
    <circle cx={120} cy={70} r={12} />
    <path d="M112 58 a10 10 0 0 1 16 0" strokeWidth={1.5} />
    <path d="M104 92 Q64 78 46 104 Q72 104 96 116" />
    <path d="M136 92 Q176 78 194 104 Q168 104 144 116" />
    <path d="M106 88 L94 250 L146 250 L134 88" />
    <line x1={108} y1={110} x2={90} y2={150} />
    <line x1={132} y1={110} x2={152} y2={158} />
    <path d="M82 150 a9 9 0 0 0 18 0 l-3 -14 l-12 0 Z" strokeWidth={1.5} />
    <path d="M146 162 a9 9 0 0 0 18 0 l-3 -14 l-12 0 Z" strokeWidth={1.5} />
    <path d="M96 142 q16 6 30 12 q14 6 24 4" strokeWidth={1.5} />
    <line x1={106} y1={250} x2={102} y2={286} />
    <line x1={134} y1={250} x2={140} y2={282} />
    <line x1={76} y1={288} x2={120} y2={288} strokeWidth={1.5} />
    <path d="M124 292 q10 -8 20 0 q10 8 20 0 q10 -8 20 0" strokeWidth={1.5} />
    <path d="M128 306 q10 -8 20 0 q10 8 20 0 q10 -8 20 0" strokeWidth={1.5} />
    <path d="M60 262 a12 12 0 0 1 24 0" strokeWidth={1.5} />
    <polygon points="66,262 78,262 75,252 69,252" strokeWidth={1.5} />
    <path d="M40 250 q4 -12 0 -20 M48 252 q8 -8 8 -18 M32 252 q-8 -8 -8 -18" strokeWidth={1.5} />
  </g>
);

// XV — The Devil: horned bat-winged figure, inverted pentagram, chained pair.
const Devil: CardArt = () => (
  <g>
    <polygon points="120,58 130.6,25.4 102.9,45.6 137.1,45.6 109.4,25.4" strokeWidth={1.5} />
    <path d="M104 96 q-14 -16 -10 -30 M136 96 q14 -16 10 -30" />
    <circle cx={120} cy={108} r={14} />
    <path d="M104 122 Q60 112 44 142 L72 146 L60 168 L92 158" />
    <path d="M136 122 Q180 112 196 142 L168 146 L180 168 L148 158" />
    <path d="M104 124 L98 198 L142 198 L136 124" />
    <path d="M108 198 L100 232 M132 198 L140 232" />
    <rect x={88} y={232} width={64} height={56} />
    <line x1={88} y1={248} x2={152} y2={248} strokeWidth={1.5} />
    <circle cx={64} cy={286} r={9} />
    <path d="M58 280 l-4 -8 M70 280 l4 -8" strokeWidth={1.5} />
    <path d="M56 296 L52 330 L76 330 L72 296" strokeWidth={1.5} />
    <circle cx={176} cy={286} r={9} />
    <path d="M170 280 l-4 -8 M182 280 l4 -8" strokeWidth={1.5} />
    <path d="M168 296 L164 330 L188 330 L184 296" strokeWidth={1.5} />
    <path d="M73 292 q15 14 15 -4 M167 292 q-15 14 -15 -4" strokeWidth={1.5} />
  </g>
);

// XVI — The Tower: lightning strike, crown blasted off, flames, falling figures.
const Tower: CardArt = () => (
  <g>
    <polyline points="36,28 72,58 56,64 96,92 82,98 116,118" />
    <polygon points="98,108 142,108 148,316 92,316" />
    <rect x={112} y={140} width={16} height={22} strokeWidth={1.5} />
    <rect x={114} y={190} width={14} height={20} strokeWidth={1.5} />
    <path d="M120 256 q-8 12 0 20 q8 -8 0 -20" strokeWidth={1.5} />
    <polygon points="146,84 178,96 172,108 162,100 154,110 148,98 140,92" />
    <path d="M100 130 q-10 -4 -12 -14 M138 126 q10 -6 10 -16 M126 118 q0 -10 8 -14" strokeWidth={1.5} />
    <circle cx={64} cy={196} r={8} />
    <path d="M60 204 l-8 22 M68 204 l6 20 M58 212 l-10 6 M70 212 l10 8" strokeWidth={1.5} />
    <circle cx={184} cy={238} r={8} />
    <path d="M180 246 l-8 22 M188 246 l6 20 M178 254 l-10 6 M190 254 l10 8" strokeWidth={1.5} />
    <path d="M40 320 q6 -14 0 -22 M60 322 q8 -10 4 -22 M196 316 q6 -12 2 -22" strokeWidth={1.5} />
    <line x1={28} y1={330} x2={212} y2={330} strokeWidth={1.5} />
  </g>
);

// XVII — The Star: kneeling figure with two jugs, eight stars, bird in a tree.
const Star: CardArt = () => (
  <g>
    <polygon points="96,36 144,36 144,84 96,84" />
    <polygon points="120,26 154,60 120,94 86,60" />
    <circle cx={120} cy={60} r={6} strokeWidth={1.5} />
    <polygon points="52,42 56,50 52,58 48,50" strokeWidth={1.5} />
    <polygon points="82,20 86,28 82,36 78,28" strokeWidth={1.5} />
    <polygon points="158,20 162,28 158,36 154,28" strokeWidth={1.5} />
    <polygon points="188,42 192,50 188,58 184,50" strokeWidth={1.5} />
    <polygon points="44,86 48,94 44,102 40,94" strokeWidth={1.5} />
    <polygon points="196,86 200,94 196,102 192,94" strokeWidth={1.5} />
    <polygon points="120,118 124,126 120,134 116,126" strokeWidth={1.5} />
    <circle cx={108} cy={170} r={11} />
    <path d="M100 182 Q88 210 96 236 L132 240 Q136 214 122 184" />
    <path d="M98 238 L72 262 L104 262" />
    <line x1={118} y1={240} x2={142} y2={264} />
    <line x1={104} y1={194} x2={76} y2={208} />
    <path d="M68 204 a8 8 0 0 0 14 6 l-4 -12 Z" strokeWidth={1.5} />
    <path d="M70 214 q-8 22 -4 40" strokeWidth={1.5} />
    <line x1={122} y1={196} x2={150} y2={214} />
    <path d="M150 208 a8 8 0 0 1 4 14 l-12 -4 Z" strokeWidth={1.5} />
    <path d="M156 222 q6 20 2 38" strokeWidth={1.5} />
    <path d="M56 272 q12 -10 24 0 q12 10 24 0" strokeWidth={1.5} />
    <path d="M132 292 q12 -10 24 0 q12 10 24 0 q12 -10 24 0" strokeWidth={1.5} />
    <path d="M136 306 q12 -10 24 0 q12 10 24 0 q12 -10 24 0" strokeWidth={1.5} />
    <line x1={204} y1={190} x2={204} y2={248} strokeWidth={1.5} />
    <path d="M204 206 l-14 -10 M204 216 l14 -12 M204 196 l10 -6" strokeWidth={1.5} />
    <path d="M192 176 q6 -8 12 0 q6 -6 10 -2" strokeWidth={1.5} />
  </g>
);

// XVIII — The Moon: faced moon between towers, dog and wolf, crayfish, winding path.
const Moon: CardArt = () => (
  <g>
    <circle cx={120} cy={72} r={30} />
    <path d="M120 42 a30 30 0 0 1 0 60 a22 22 0 0 0 0 -60" strokeWidth={1.5} />
    <circle cx={128} cy={64} r={2.5} strokeWidth={1.5} />
    <path d="M132 84 q6 3 10 -1" strokeWidth={1.5} />
    <path d="M120 30 L120 20 M84 46 L76 40 M156 46 L164 40 M82 98 L74 104 M158 98 L166 104" strokeWidth={1.5} />
    <path d="M104 108 l-4 8 M120 114 l0 9 M136 108 l4 8" strokeWidth={1.5} />
    <rect x={36} y={128} width={24} height={96} />
    <polyline points="36,128 36,118 44,118 44,124 52,124 52,118 60,118 60,128" strokeWidth={1.5} />
    <rect x={180} y={128} width={24} height={96} />
    <polyline points="180,128 180,118 188,118 188,124 196,124 196,118 204,118 204,128" strokeWidth={1.5} />
    <path d="M96 322 q6 -30 -2 -52 q-6 -18 8 -34 q10 -12 18 -12" strokeWidth={1.5} />
    <path d="M144 322 q-6 -30 2 -52 q6 -18 -8 -34 q-10 -12 -18 -12" strokeWidth={1.5} />
    <path d="M64 252 q-2 -20 12 -24 q10 -3 12 8 l0 22 q0 10 -8 10 l-12 0 q-6 0 -4 -16 Z" />
    <path d="M74 226 l-2 -12 l8 8" strokeWidth={1.5} />
    <path d="M176 252 q2 -20 -12 -24 q-10 -3 -12 8 l0 22 q0 10 8 10 l12 0 q6 0 4 -16 Z" />
    <path d="M166 226 l2 -12 l-8 8" strokeWidth={1.5} />
    <ellipse cx={120} cy={332} rx={14} ry={8} strokeWidth={1.5} />
    <path d="M108 328 l-12 -8 M108 336 l-12 8 M132 328 l12 -8 M132 336 l12 8" strokeWidth={1.5} />
    <path d="M104 324 l-6 -6 M136 324 l6 -6" strokeWidth={1.5} />
    <path d="M60 344 q20 -10 40 0 q20 10 40 0 q20 -10 40 0" strokeWidth={1.5} />
  </g>
);

// XIX — The Sun: faced sun with straight and wavy rays, child on horse, wall, sunflowers.
const Sun: CardArt = () => (
  <g>
    <circle cx={120} cy={86} r={32} />
    <circle cx={108} cy={80} r={2.5} strokeWidth={1.5} />
    <circle cx={132} cy={80} r={2.5} strokeWidth={1.5} />
    <path d="M106 98 q14 10 28 0" strokeWidth={1.5} />
    <path d="M120 42 L120 26 M120 130 L120 146 M76 86 L60 86 M164 86 L180 86" strokeWidth={1.5} />
    <path d="M89 55 L78 44 M151 55 L162 44 M89 117 L78 128 M151 117 L162 128" strokeWidth={1.5} />
    <path d="M96 46 q4 -10 0 -16 M144 46 q-4 -10 0 -16 M96 126 q4 10 0 16 M144 126 q-4 10 0 -16" strokeWidth={1.5} />
    <path d="M70 64 q-10 -4 -16 0 M170 64 q10 -4 16 0 M70 108 q-10 4 -16 0 M170 108 q10 4 16 0" strokeWidth={1.5} />
    <polyline points="28,206 28,190 40,190 40,198 52,198 52,190 64,190 64,198 76,198 76,190 88,190 88,198 100,198 100,190 112,190 112,198 124,198 124,190 136,190 136,198 148,198 148,190 160,190 160,198 172,198 172,190 184,190 184,198 196,198 196,190 208,190 208,206" strokeWidth={1.5} />
    <line x1={28} y1={206} x2={208} y2={206} />
    <circle cx={46} cy={174} r={8} strokeWidth={1.5} />
    <circle cx={46} cy={174} r={3} strokeWidth={1.5} />
    <circle cx={80} cy={170} r={8} strokeWidth={1.5} />
    <circle cx={80} cy={170} r={3} strokeWidth={1.5} />
    <path d="M96 300 q-4 -34 22 -44 q30 -10 52 4 q14 10 10 26" />
    <path d="M170 258 q18 -12 24 4 q4 14 -8 18 l-16 4" />
    <line x1={104} y1={296} x2={98} y2={330} />
    <line x1={124} y1={300} x2={120} y2={330} />
    <line x1={162} y1={298} x2={160} y2={330} />
    <line x1={180} y1={292} x2={186} y2={330} />
    <circle cx={128} cy={222} r={10} />
    <path d="M118 232 L112 258 L138 258 L134 232" />
    <line x1={122} y1={238} x2={100} y2={252} strokeWidth={1.5} />
    <line x1={146} y1={196} x2={146} y2={250} strokeWidth={1.5} />
    <rect x={146} y={196} width={36} height={24} fill="currentColor" fillOpacity={0.2} stroke="none" />
    <rect x={146} y={196} width={36} height={24} strokeWidth={1.5} />
  </g>
);

// XX — Judgement: angel with trumpet and flag in clouds, figures rising from coffins.
const Judgement: CardArt = () => (
  <g>
    <path d="M44 96 q10 -18 30 -12 q8 -16 28 -10 q14 -12 30 -4 q16 -10 30 0 q18 -6 26 8 q16 4 10 18" strokeWidth={1.5} />
    <path d="M108 84 Q84 62 62 70 Q84 78 96 96" />
    <path d="M132 84 Q156 62 178 70 Q156 78 144 96" />
    <circle cx={120} cy={96} r={11} />
    <path d="M108 108 L102 152 L138 152 L132 108" />
    <line x1={132} y1={114} x2={168} y2={104} />
    <polygon points="168,104 204,92 206,100 172,110" />
    <line x1={204} y1={92} x2={204} y2={140} strokeWidth={1.5} />
    <rect x={204} y={96} width={26} height={20} strokeWidth={1.5} />
    <path d="M210 106 h14 M217 100 v12" strokeWidth={1.5} />
    <rect x={32} y={292} width={56} height={34} />
    <rect x={96} y={300} width={56} height={30} />
    <rect x={160} y={292} width={52} height={34} />
    <circle cx={60} cy={266} r={8} strokeWidth={1.5} />
    <path d="M54 274 L52 292 M66 274 L68 292 M54 278 L42 264 M66 278 L78 264" strokeWidth={1.5} />
    <circle cx={124} cy={272} r={8} strokeWidth={1.5} />
    <path d="M118 280 L116 300 M130 280 L132 300 M118 284 L106 270 M130 284 L142 270" strokeWidth={1.5} />
    <circle cx={186} cy={266} r={8} strokeWidth={1.5} />
    <path d="M180 274 L178 292 M192 274 L194 292 M180 278 L168 264 M192 278 L204 264" strokeWidth={1.5} />
  </g>
);

// XXI — The World: dancer with two wands in a laurel oval, four corner creatures.
const World: CardArt = () => (
  <g>
    <ellipse cx={120} cy={186} rx={72} ry={108} />
    <ellipse cx={120} cy={186} rx={62} ry={98} strokeWidth={1.5} />
    <path d="M112 82 l8 -8 l8 8 M112 290 l8 8 l8 -8" strokeWidth={1.5} />
    <circle cx={120} cy={136} r={11} />
    <path d="M120 148 Q106 170 116 196 Q126 218 112 244" />
    <path d="M118 158 L92 176 M120 160 L148 144" />
    <line x1={84} y1={166} x2={98} y2={184} strokeWidth={1.5} />
    <line x1={142} y1={136} x2={154} y2={152} strokeWidth={1.5} />
    <path d="M116 196 L96 230 M112 244 L128 262" />
    <path d="M132 138 q12 4 10 18" strokeWidth={1.5} />
    <circle cx={36} cy={46} r={13} strokeWidth={1.5} />
    <path d="M24 40 q-8 -6 -6 -14 M48 40 q8 -6 6 -14" strokeWidth={1.5} />
    <circle cx={204} cy={46} r={13} strokeWidth={1.5} />
    <polygon points="204,44 214,48 204,52" strokeWidth={1.5} />
    <circle cx={36} cy={326} r={13} strokeWidth={1.5} />
    <circle cx={36} cy={326} r={19} strokeWidth={1.5} />
    <circle cx={204} cy={326} r={13} strokeWidth={1.5} />
    <path d="M194 318 q-8 -8 -4 -16 M214 318 q8 -8 4 -16" strokeWidth={1.5} />
  </g>
);

// XXII — The Fool: stepping off a cliff, rose in hand, bundle on a stick, dog, sun.
const Fool: CardArt = () => (
  <g>
    <circle cx={186} cy={52} r={20} strokeWidth={1.5} />
    <path d="M186 24 L186 14 M186 80 L186 90 M158 52 L148 52 M214 52 L224 52 M166 32 L159 25 M206 32 L213 25 M166 72 L159 79 M206 72 L213 79" strokeWidth={1.5} />
    <circle cx={118} cy={104} r={11} />
    <path d="M112 96 q6 -8 14 -4" strokeWidth={1.5} />
    <path d="M114 116 L104 196 L136 198 L128 116" />
    <line x1={112} y1={126} x2={86} y2={108} />
    <line x1={86} y1={108} x2={70} y2={64} strokeWidth={1.5} />
    <circle cx={66} cy={56} r={9} strokeWidth={1.5} />
    <line x1={126} y1={124} x2={152} y2={104} />
    <circle cx={158} cy={98} r={5} strokeWidth={1.5} />
    <path d="M158 92 m-3 -4 q3 -4 6 0" strokeWidth={1.5} />
    <path d="M108 196 L88 244 M130 198 L156 232" />
    <line x1={88} y1={244} x2={84} y2={248} strokeWidth={1.5} />
    <line x1={156} y1={232} x2={162} y2={230} strokeWidth={1.5} />
    <polyline points="28,330 168,330 196,264 212,264 212,330" />
    <path d="M60 306 q-2 -16 10 -18 q8 -1 9 7 l0 14 q0 8 -6 8 l-9 0 q-5 0 -4 -11 Z" strokeWidth={1.5} />
    <path d="M66 286 l-1 -9 l6 6" strokeWidth={1.5} />
    <path d="M79 300 q8 -4 10 4" strokeWidth={1.5} />
  </g>
);

const ART: Record<number, CardArt> = {
  1: Magician,
  2: HighPriestess,
  3: Empress,
  4: Emperor,
  5: Hierophant,
  6: Lovers,
  7: Chariot,
  8: Strength,
  9: Hermit,
  10: WheelOfFortune,
  11: Justice,
  12: HangedMan,
  13: Death,
  14: Temperance,
  15: Devil,
  16: Tower,
  17: Star,
  18: Moon,
  19: Sun,
  20: Judgement,
  21: World,
  22: Fool,
};

export function ArcanaArt(props: {
  number: number;
  className?: string;
}): JSX.Element {
  const Art = ART[props.number] ?? Fool;
  return (
    <svg
      viewBox="0 0 240 360"
      width="100%"
      height="100%"
      aria-hidden="true"
      className={props.className}
      stroke="currentColor"
      fill="none"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Art />
    </svg>
  );
}
