export interface ArcanaCard {
  number: number;
  name: string;
  keywords: string[];
  mission: string;
  element: string;
  astrology: string;
}

export const ARCANA: ArcanaCard[] = [
  { number: 1, name: "The Magician", keywords: ["willpower", "creation", "skill"], mission: "Turn ideas into reality through focused will and resourcefulness.", element: "Air", astrology: "Mercury" },
  { number: 2, name: "The High Priestess", keywords: ["intuition", "mystery", "inner voice"], mission: "Trust inner knowing and guard the gate between conscious and unconscious.", element: "Water", astrology: "Moon" },
  { number: 3, name: "The Empress", keywords: ["abundance", "nurture", "sensuality"], mission: "Create and nurture — bring beauty, comfort and growth into the world.", element: "Earth", astrology: "Venus" },
  { number: 4, name: "The Emperor", keywords: ["structure", "authority", "stability"], mission: "Build lasting order and lead with fairness and discipline.", element: "Fire", astrology: "Aries" },
  { number: 5, name: "The Hierophant", keywords: ["tradition", "teaching", "belief"], mission: "Bridge sacred knowledge and everyday life; teach and preserve wisdom.", element: "Earth", astrology: "Taurus" },
  { number: 6, name: "The Lovers", keywords: ["union", "choice", "harmony"], mission: "Learn the power of conscious choice and wholehearted connection.", element: "Air", astrology: "Gemini" },
  { number: 7, name: "The Chariot", keywords: ["drive", "victory", "direction"], mission: "Harness opposing forces and move forward with determination.", element: "Water", astrology: "Cancer" },
  { number: 8, name: "Strength", keywords: ["courage", "patience", "soft power"], mission: "Master gentle strength — tame the inner beast with compassion.", element: "Fire", astrology: "Leo" },
  { number: 9, name: "The Hermit", keywords: ["introspection", "wisdom", "truth-seeking"], mission: "Withdraw to find inner truth, then carry the lantern for others.", element: "Earth", astrology: "Virgo" },
  { number: 10, name: "Wheel of Fortune", keywords: ["cycles", "fate", "turning points"], mission: "Flow with life's cycles and recognize the turning points of fate.", element: "Fire", astrology: "Jupiter" },
  { number: 11, name: "Justice", keywords: ["truth", "balance", "accountability"], mission: "Seek fairness, weigh choices honestly, and own their consequences.", element: "Air", astrology: "Libra" },
  { number: 12, name: "The Hanged Man", keywords: ["surrender", "new perspective", "pause"], mission: "Find wisdom in stillness and see the world upside down.", element: "Water", astrology: "Neptune" },
  { number: 13, name: "Death", keywords: ["transformation", "endings", "rebirth"], mission: "Embrace endings as thresholds to profound renewal.", element: "Water", astrology: "Scorpio" },
  { number: 14, name: "Temperance", keywords: ["balance", "alchemy", "moderation"], mission: "Blend opposites into harmony; walk the middle path.", element: "Fire", astrology: "Sagittarius" },
  { number: 15, name: "The Devil", keywords: ["shadow", "attachment", "desire"], mission: "Face the shadow, break chains of attachment, reclaim freedom.", element: "Earth", astrology: "Capricorn" },
  { number: 16, name: "The Tower", keywords: ["upheaval", "revelation", "liberation"], mission: "Rebuild on truth after false structures collapse.", element: "Fire", astrology: "Mars" },
  { number: 17, name: "The Star", keywords: ["hope", "renewal", "inspiration"], mission: "Be a beacon of hope and quiet healing after the storm.", element: "Air", astrology: "Aquarius" },
  { number: 18, name: "The Moon", keywords: ["illusion", "dreams", "the unconscious"], mission: "Navigate uncertainty and illuminate what hides beneath the surface.", element: "Water", astrology: "Pisces" },
  { number: 19, name: "The Sun", keywords: ["joy", "vitality", "clarity"], mission: "Radiate warmth, optimism and uncomplicated truth.", element: "Fire", astrology: "Sun" },
  { number: 20, name: "Judgement", keywords: ["awakening", "calling", "reckoning"], mission: "Answer the higher calling and rise renewed from honest self-review.", element: "Fire", astrology: "Pluto" },
  { number: 21, name: "The World", keywords: ["completion", "integration", "fulfillment"], mission: "Integrate all lessons into wholeness and celebrate completion.", element: "Earth", astrology: "Saturn" },
  { number: 22, name: "The Fool", keywords: ["beginnings", "freedom", "leap of faith"], mission: "Begin again with open-hearted trust in the journey.", element: "Air", astrology: "Uranus" },
];

/**
 * Birth Arcana calculation (tarot numerology):
 * sum every digit of the birth date (DD MM YYYY), then reduce until
 * the result is between 1 and 22. 22 is kept as The Fool.
 */
export function calculateBirthArcana(day: number, month: number, year: number): number {
  const digits = `${day}${month}${year}`
    .split("")
    .map((d) => parseInt(d, 10));
  let total = digits.reduce((a, b) => a + b, 0);
  while (total > 22) {
    total = `${total}`
      .split("")
      .reduce((a, b) => a + parseInt(b, 10), 0);
  }
  return total === 0 ? 22 : total;
}

export function getArcana(n: number): ArcanaCard {
  return ARCANA.find((c) => c.number === n) ?? ARCANA[21];
}

export interface HermitDeepReading {
  number: 9;
  name: "The Hermit";
  keywords: string[];
  upright: string;
  reversed: string;
  element: string;
  numerology: string;
  astrology: string;
  compatibleArcanas: number[];
  strengths: string[];
  growthAreas: string[];
  karmicLessons: string[];
  lifePurpose: string;
}

export const HERMIT: HermitDeepReading = {
  number: 9,
  name: "The Hermit",
  keywords: ["introspection", "wisdom", "solitude", "guidance", "truth-seeking"],
  upright:
    "Soul-searching, inner guidance, withdrawal from noise, contemplation, seeking deeper truth. The Hermit lights a lantern in the dark — wisdom earned through patient solitude.",
  reversed:
    "Isolation without purpose, withdrawal from connection, refusing guidance, or exile instead of chosen solitude. The lantern turned inward too long can lose the path back.",
  element: "Earth",
  numerology: "9 — completion, humanitarian wisdom, the end of a cycle before renewal.",
  astrology: "Virgo",
  compatibleArcanas: [3, 17, 21],
  strengths: [
    "Deep self-knowledge and emotional independence",
    "Patient, methodical pursuit of truth",
    "Natural mentor — guides others by example, not noise",
    "Discernment: separates signal from noise effortlessly",
  ],
  growthAreas: [
    "Solitude can harden into isolation",
    "Over-analysis delays action",
    "Asking for help feels like weakness",
    "Perfectionism toward self and others",
  ],
  karmicLessons: [
    "Wisdom is meant to be shared, not hoarded",
    "Connection is not the enemy of depth",
    "The journey inward must eventually turn outward",
  ],
  lifePurpose:
    "To walk the inner path honestly, distill experience into wisdom, and then hold the lantern for those still searching — a quiet teacher whose depth becomes other people's light.",
};
