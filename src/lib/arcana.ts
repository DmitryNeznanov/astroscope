export interface ArcanaCard {
  number: number;
  name: string;
  keywords: string[];
  mission: string;
  element: string;
  astrology: string;
  numerology: string;
  upright: string;
  reversed: string;
  strengths: string[];
  growthAreas: string[];
  karmicLessons: string[];
  lifePurpose: string;
  compatibleArcanas: number[];
}

export const ARCANA: ArcanaCard[] = [
  {
    number: 1,
    name: "The Magician",
    keywords: ["willpower", "creation", "skill"],
    mission: "Turn ideas into reality through focused will and resourcefulness.",
    element: "Air",
    astrology: "Mercury",
    numerology: "1 — initiative, individuality, the spark that begins every cycle.",
    upright:
      "Resourcefulness, concentrated will, inspired action. All four suits lie on the table — you already hold every tool you need. The Magician channels idea into form.",
    reversed:
      "Scattered energy, untapped talent, manipulation or trickery. The tools are there but the hand hesitates — or the gift is used to deceive rather than create.",
    strengths: [
      "Converts vision into tangible results fast",
      "Masterful communicator and improviser",
      "Sees connections others miss",
    ],
    growthAreas: [
      "Starts more than it finishes",
      "Charm can slide into manipulation",
      "Impatience with slower people",
    ],
    karmicLessons: [
      "Power without purpose becomes mere performance",
      "Finishing is a skill equal to beginning",
      "Influence carries responsibility",
    ],
    lifePurpose:
      "To be the conduit between idea and reality — proving by example that focused will, honestly applied, can reshape the material world.",
    compatibleArcanas: [2, 6, 10],
  },
  {
    number: 2,
    name: "The High Priestess",
    keywords: ["intuition", "mystery", "inner voice"],
    mission: "Trust inner knowing and guard the gate between conscious and unconscious.",
    element: "Water",
    astrology: "Moon",
    numerology: "2 — duality, receptivity, the quiet balance between opposites.",
    upright:
      "Intuition, sacred knowledge, the unspoken truth behind the veil. The Priestess does not chase answers — she sits still until they surface.",
    reversed:
      "Ignoring the inner voice, secrets kept too long, surface noise drowning instinct. The veil becomes a wall instead of a doorway.",
    strengths: [
      "Reads people and situations with uncanny accuracy",
      "Deep, calm presence that steadies others",
      "Comfortable with mystery and not-knowing",
    ],
    growthAreas: [
      "Can withdraw into passivity",
      "Overvalues intuition, undervalues action",
      "Keeps too much hidden, even from allies",
    ],
    karmicLessons: [
      "Stillness is a practice, not a hiding place",
      "Some truths must eventually be spoken",
      "Trust given wisely is not trust betrayed",
    ],
    lifePurpose:
      "To hold the space between worlds — listening where others talk, knowing where others guess, and guarding wisdom until it is ripe to share.",
    compatibleArcanas: [1, 9, 18],
  },
  {
    number: 3,
    name: "The Empress",
    keywords: ["abundance", "nurture", "sensuality"],
    mission: "Create and nurture — bring beauty, comfort and growth into the world.",
    element: "Earth",
    astrology: "Venus",
    numerology: "3 — creative expression, fertility, the joy of making things grow.",
    upright:
      "Fertility, abundance, nature, comfort. The Empress grows everything she touches — gardens, children, projects, people. Life responds to her care.",
    reversed:
      "Creative block, smothering instead of nurturing, neglect of self or body. The garden goes untended — or the gardener forgets she is also a flower.",
    strengths: [
      "Makes any environment flourish",
      "Warm, magnetic, generously giving",
      "Strong aesthetic and sensual intelligence",
    ],
    growthAreas: [
      "Gives until empty, then resents it",
      "Possessiveness disguised as care",
      "Avoids conflict to keep things pleasant",
    ],
    karmicLessons: [
      "Nurturing yourself is not selfishness",
      "Love held too tightly stops growing",
      "Abundance flows, it cannot be stored",
    ],
    lifePurpose:
      "To embody creative abundance — growing beauty, comfort and life wherever she is planted, and teaching others that receiving is as sacred as giving.",
    compatibleArcanas: [4, 9, 17],
  },
  {
    number: 4,
    name: "The Emperor",
    keywords: ["structure", "authority", "stability"],
    mission: "Build lasting order and lead with fairness and discipline.",
    element: "Fire",
    astrology: "Aries",
    numerology: "4 — foundations, order, the square that will not shake.",
    upright:
      "Authority, structure, protection, disciplined leadership. The Emperor builds the walls inside which life can safely flourish.",
    reversed:
      "Rigidity, control for its own sake, or its opposite — chaos from absent structure. The throne becomes a cage, or stands empty when it is needed.",
    strengths: [
      "Creates order out of chaos reliably",
      "Dependable — his word is a contract",
      "Strategic, long-view thinking",
    ],
    growthAreas: [
      "Confuses control with care",
      "Feelings treated as inefficiency",
      "Rest feels like failure",
    ],
    karmicLessons: [
      "True authority needs no shouting",
      "Flexibility is not weakness",
      "An empire of one is still loneliness",
    ],
    lifePurpose:
      "To build structures that outlast him — families, companies, codes of conduct — and to learn that the strongest foundation includes room for the human heart.",
    compatibleArcanas: [3, 5, 21],
  },
  {
    number: 5,
    name: "The Hierophant",
    keywords: ["tradition", "teaching", "belief"],
    mission: "Bridge sacred knowledge and everyday life; teach and preserve wisdom.",
    element: "Earth",
    astrology: "Taurus",
    numerology: "5 — the bridge between the human and the divine, teaching through form.",
    upright:
      "Tradition, mentorship, shared belief, rites of passage. The Hierophant keeps the keys — passing tested wisdom from one generation to the next.",
    reversed:
      "Dogma, hollow ritual, rebellion without understanding — or conformity without conviction. The keys are rattled, not turned.",
    strengths: [
      "Natural teacher who makes the complex venerable",
      "Builds community and belonging",
      "Deep respect for what time has proven",
    ],
    growthAreas: [
      "Mistakes tradition for truth",
      "Judges paths that differ from his own",
      "Can preach instead of listen",
    ],
    karmicLessons: [
      "The map is not the territory",
      "A tradition that cannot question itself is already dead",
      "Teach the student, not the syllabus",
    ],
    lifePurpose:
      "To keep the flame of accumulated wisdom alive — translating the sacred into the practical, and reminding a restless world that some things deserve reverence.",
    compatibleArcanas: [4, 6, 14],
  },
  {
    number: 6,
    name: "The Lovers",
    keywords: ["union", "choice", "harmony"],
    mission: "Learn the power of conscious choice and wholehearted connection.",
    element: "Air",
    astrology: "Gemini",
    numerology: "6 — harmony, responsibility, the beauty of balanced exchange.",
    upright:
      "Union, alignment, choices made from the heart. The Lovers is less about romance than about standing whole before another — and choosing, clearly.",
    reversed:
      "Misalignment, avoidance of choice, relationships built on convenience. The two figures face away — the decision is deferred and the deferral decides.",
    strengths: [
      "Builds deep, honest partnerships",
      "Decisive when values are clear",
      "Natural mediator of opposites",
    ],
    growthAreas: [
      "Loses self in the other",
      "Paralyzed when both options carry cost",
      "Confuses intensity with intimacy",
    ],
    karmicLessons: [
      "Every choice is a renunciation — accept it",
      "You cannot merge before you are whole",
      "Love is a decision renewed daily",
    ],
    lifePurpose:
      "To master the art of alignment — choosing people, work and values that form one coherent life, and showing others that true union begins in self-honesty.",
    compatibleArcanas: [1, 5, 17],
  },
  {
    number: 7,
    name: "The Chariot",
    keywords: ["drive", "victory", "direction"],
    mission: "Harness opposing forces and move forward with determination.",
    element: "Water",
    astrology: "Cancer",
    numerology: "7 — will in motion, mastery tested through action.",
    upright:
      "Willpower, momentum, hard-won victory. Two sphinxes pull in different directions; the charioteer does not choose between them — he steers both.",
    reversed:
      "Force without direction, stalled momentum, or aggression covering doubt. The wheels spin; the reins are lost or gripped too hard.",
    strengths: [
      "Relentless once a target is set",
      "Thrives under pressure and competition",
      "Unites conflicting drives into forward motion",
    ],
    growthAreas: [
      "Wins the battle, misses the point",
      "Rest interpreted as defeat",
      "Steamrolls quieter voices",
    ],
    karmicLessons: [
      "Direction matters more than speed",
      "Not every hill is worth taking",
      "The opponent within is the real campaign",
    ],
    lifePurpose:
      "To prove that disciplined will can move the world — and, in the proving, to learn which destinations were ever worth the charge.",
    compatibleArcanas: [8, 16, 19],
  },
  {
    number: 8,
    name: "Strength",
    keywords: ["courage", "patience", "soft power"],
    mission: "Master gentle strength — tame the inner beast with compassion.",
    element: "Fire",
    astrology: "Leo",
    numerology: "8 — power in balance, infinity made personal.",
    upright:
      "Inner strength, patience, compassionate courage. The woman closes the lion's jaws not with force but with calm — instinct met by gentleness.",
    reversed:
      "Self-doubt, raw emotion unchecked, or brute force dressed as confidence. The lion rules the woman, or is beaten rather than befriended.",
    strengths: [
      "Calm in crises that panic others",
      "Tames conflict instead of escalating it",
      "Quiet, durable self-belief",
    ],
    growthAreas: [
      "Endures too much, too silently",
      "Mistakes suppression for mastery",
      "Pride hidden under gentleness",
    ],
    karmicLessons: [
      "Gentleness is a skill of the strong, not the weak",
      "The beast denied becomes the beast unleashed",
      "Courage includes asking for help",
    ],
    lifePurpose:
      "To demonstrate that the softest touch moves the heaviest weight — befriending instinct rather than fighting it, and teaching others the same brave patience.",
    compatibleArcanas: [7, 9, 19],
  },
  {
    number: 9,
    name: "The Hermit",
    keywords: ["introspection", "wisdom", "truth-seeking"],
    mission: "Withdraw to find inner truth, then carry the lantern for others.",
    element: "Earth",
    astrology: "Virgo",
    numerology: "9 — completion, humanitarian wisdom, the end of a cycle before renewal.",
    upright:
      "Soul-searching, inner guidance, withdrawal from noise, contemplation, seeking deeper truth. The Hermit lights a lantern in the dark — wisdom earned through patient solitude.",
    reversed:
      "Isolation without purpose, withdrawal from connection, refusing guidance, or exile instead of chosen solitude. The lantern turned inward too long can lose the path back.",
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
    compatibleArcanas: [2, 8, 21],
  },
  {
    number: 10,
    name: "Wheel of Fortune",
    keywords: ["cycles", "fate", "turning points"],
    mission: "Flow with life's cycles and recognize the turning points of fate.",
    element: "Fire",
    astrology: "Jupiter",
    numerology: "10 — a cycle complete and instantly reborn; fortune in rotation.",
    upright:
      "Turning points, destiny, expansion, luck in motion. The wheel turns for everyone — the wise read its rhythm instead of cursing its motion.",
    reversed:
      "Resistance to change, a run of bad timing, or repeating a cycle you refuse to learn. The wheel still turns; only your grip breaks.",
    strengths: [
      "Adapts faster than circumstances change",
      "Senses timing — knows when to push and when to wait",
      "Optimism grounded in experience",
    ],
    growthAreas: [
      "Can drift into passivity, blaming fate",
      "Chases the next turn instead of the lesson",
      "Restlessness disguised as openness",
    ],
    karmicLessons: [
      "You cannot stop the wheel, only choose your seat",
      "Every downturn carries the seed of the rise",
      "Luck favors the prepared observer",
    ],
    lifePurpose:
      "To move with life's great cycles consciously — reading change as rhythm, not chaos, and showing others that fortune is a pattern, not an accident.",
    compatibleArcanas: [1, 13, 20],
  },
  {
    number: 11,
    name: "Justice",
    keywords: ["truth", "balance", "accountability"],
    mission: "Seek fairness, weigh choices honestly, and own their consequences.",
    element: "Air",
    astrology: "Libra",
    numerology: "11 — master number of insight, balanced between two worlds.",
    upright:
      "Truth, fairness, cause and effect. The scales do not lie and the sword does not hesitate — Justice sees things exactly as they are.",
    reversed:
      "Dishonesty with self, unfairness, refusal to face consequences. The scales are thumbed; the account eventually arrives anyway.",
    strengths: [
      "Cuts through emotion to the fact of the matter",
      "Fair even when it costs her",
      "Owns mistakes without theater",
    ],
    growthAreas: [
      "Cold where warmth was needed",
      "Weaponizes fairness",
      "Judges herself harsher than anyone",
    ],
    karmicLessons: [
      "Truth without mercy is cruelty in robes",
      "Balance is dynamic, not a fixed pose",
      "You cannot outsource your conscience",
    ],
    lifePurpose:
      "To stand as a living measure — weighing honestly, deciding cleanly, and proving that accountability is the foundation every freedom rests on.",
    compatibleArcanas: [2, 14, 22],
  },
  {
    number: 12,
    name: "The Hanged Man",
    keywords: ["surrender", "new perspective", "pause"],
    mission: "Find wisdom in stillness and see the world upside down.",
    element: "Water",
    astrology: "Neptune",
    numerology: "12 — sacrifice that illuminates; 1+2 = 3, creation through release.",
    upright:
      "Voluntary pause, surrender, a radical change of viewpoint. He hangs by choice and glows with it — what looks like defeat is a deliberate repositioning.",
    reversed:
      "Stalling without purpose, martyrdom, resistance to a necessary sacrifice. The pause has become a prison with the door unlocked.",
    strengths: [
      "Sees angles invisible to everyone else",
      "Comfortable waiting when others panic-act",
      "Lets go of what no longer serves",
    ],
    growthAreas: [
      "Sacrifice as an identity",
      "Indecision dressed as patience",
      "Detachment that becomes disappearance",
    ],
    karmicLessons: [
      "Surrender is an action, not an absence",
      "Not every cross is yours to hang from",
      "Perspective gained must eventually be used",
    ],
    lifePurpose:
      "To teach the power of the chosen pause — showing that the world looks different from stillness, and that some victories are only won by letting go.",
    compatibleArcanas: [4, 13, 18],
  },
  {
    number: 13,
    name: "Death",
    keywords: ["transformation", "endings", "rebirth"],
    mission: "Embrace endings as thresholds to profound renewal.",
    element: "Water",
    astrology: "Scorpio",
    numerology: "13 — 1+3 = 4, new foundations built on cleared ground.",
    upright:
      "Endings that fertilize beginnings, deep transformation, the necessary cut. The skeleton rides because something must die for anything to change.",
    reversed:
      "Clinging to the dead thing, fear of change, a transformation half-finished. The door is open but you keep rearranging the old room.",
    strengths: [
      "Cuts losses cleanly where others cling",
      "Unafraid of taboo and depth",
      "Regenerates after every ending",
    ],
    growthAreas: [
      "Burns bridges that needed repair",
      "Comfort with darkness can become residence",
      "Forces transformation on others",
    ],
    karmicLessons: [
      "Not everything old is dead",
      "Ending well is a form of mercy",
      "Rebirth requires patience with the cocoon",
    ],
    lifePurpose:
      "To be an agent of honest transformation — clearing what is finished with compassion, and standing proof that every ending is a door, not a wall.",
    compatibleArcanas: [10, 12, 15],
  },
  {
    number: 14,
    name: "Temperance",
    keywords: ["balance", "alchemy", "moderation"],
    mission: "Blend opposites into harmony; walk the middle path.",
    element: "Fire",
    astrology: "Sagittarius",
    numerology: "14 — 1+4 = 5, change stabilized into harmony.",
    upright:
      "Alchemy, moderation, patient blending. The angel pours water between cups without spilling a drop — opposites combined into something neither could be alone.",
    reversed:
      "Excess, imbalance, forced mixtures. Too much of one ingredient; the flow between the cups is spilled or stopped.",
    strengths: [
      "Synthesizes conflicting ideas elegantly",
      "Patient with long, slow processes",
      "Natural healer of divided rooms",
    ],
    growthAreas: [
      "Middle path can become no path",
      "Avoids necessary extremes",
      "Peacekeeping at the price of truth",
    ],
    karmicLessons: [
      "Balance is not blandness",
      "Some things should not be diluted",
      "Harmony includes dissonance resolved, not avoided",
    ],
    lifePurpose:
      "To be the alchemist of the everyday — mixing opposites into medicines, and proving that the middle path, walked deliberately, leads further than any extreme.",
    compatibleArcanas: [5, 11, 17],
  },
  {
    number: 15,
    name: "The Devil",
    keywords: ["shadow", "attachment", "desire"],
    mission: "Face the shadow, break chains of attachment, reclaim freedom.",
    element: "Earth",
    astrology: "Capricorn",
    numerology: "15 — 1+5 = 6, harmony tested by temptation.",
    upright:
      "Bondage to habit, desire, or fear — with loose chains. The Devil's power is permission you gave him; what binds you can be slipped off.",
    reversed:
      "Release, reclamation, the shadow faced and integrated. The chains come off — but only after you admit you were holding them.",
    strengths: [
      "Fearless honesty about human nature",
      "Magnetic, vital, unapologetically alive",
      "Spots hidden contracts everywhere",
    ],
    growthAreas: [
      "Knows the chain, wears it anyway",
      "Cynicism as armor",
      "Tests the loyalty of everyone close",
    ],
    karmicLessons: [
      "Most prisons have the key inside",
      "Desire mastered is power; desire obeyed is slavery",
      "The shadow integrated becomes strength",
    ],
    lifePurpose:
      "To walk into the dark corners others avoid — naming the chains, keeping the fire, and proving that freedom begins the moment bondage is seen clearly.",
    compatibleArcanas: [13, 16, 18],
  },
  {
    number: 16,
    name: "The Tower",
    keywords: ["upheaval", "revelation", "liberation"],
    mission: "Rebuild on truth after false structures collapse.",
    element: "Fire",
    astrology: "Mars",
    numerology: "16 — 1+6 = 7, spiritual insight bought by shock.",
    upright:
      "Sudden upheaval, the lightning flash of truth, structures built on lies coming down. Violent, yes — and the clearest sky you will ever see follows it.",
    reversed:
      "Disaster postponed, not prevented; fear of the necessary collapse, or slow internal revolution instead. The tower leans and everyone pretends not to hear the cracks.",
    strengths: [
      "Functions best exactly when things fall apart",
      "Rebuilds fast, on bedrock this time",
      "Truth-teller when silence is safer",
    ],
    growthAreas: [
      "Mistakes destruction for progress",
      "Addicted to crisis",
      "Warns others but skips own foundations",
    ],
    karmicLessons: [
      "You can leave the tower before the lightning",
      "Not everything broken was false",
      "Rebuild smaller, truer, slower",
    ],
    lifePurpose:
      "To survive the lightning and learn to read the weather — demolishing what is false, salvaging what is true, and building only on ground that has been tested.",
    compatibleArcanas: [7, 15, 17],
  },
  {
    number: 17,
    name: "The Star",
    keywords: ["hope", "renewal", "inspiration"],
    mission: "Be a beacon of hope and quiet healing after the storm.",
    element: "Air",
    astrology: "Aquarius",
    numerology: "17 — 1+7 = 8, infinite renewal pouring without end.",
    upright:
      "Hope, healing, calm renewal. After the Tower comes the Star — one foot on land, one in water, pouring life back into both. The storm is over; the sky kept its promise.",
    reversed:
      "Faith misplaced or exhausted, discouragement, disconnection from your own source. The star still shines; you have stopped looking up.",
    strengths: [
      "Restores hope in others effortlessly",
      "Calm, authentic, unarmored",
      "Long-range optimism that survives evidence",
    ],
    growthAreas: [
      "Heals others, neglects own wounds",
      "Hope used to avoid hard action",
      "Vulnerability performed, not lived",
    ],
    karmicLessons: [
      "You cannot pour from an empty cup",
      "Hope is a discipline, not a mood",
      "Being the light does not exempt you from the dark",
    ],
    lifePurpose:
      "To be proof that the sky clears — healing openly, hoping deliberately, and shining steadily enough that the lost can navigate by her.",
    compatibleArcanas: [3, 6, 14],
  },
  {
    number: 18,
    name: "The Moon",
    keywords: ["illusion", "dreams", "the unconscious"],
    mission: "Navigate uncertainty and illuminate what hides beneath the surface.",
    element: "Water",
    astrology: "Pisces",
    numerology: "18 — 1+8 = 9, deep wisdom reached through the dark.",
    upright:
      "Dreams, intuition, the tidal unconscious. The path between the towers is lit only by moonlight — things are not what they seem, and that is the point.",
    reversed:
      "Confusion lifting, or deepening into anxiety; illusion exposed, or fear preferred to fact. The crayfish crawls back into the water, or finally onto land.",
    strengths: [
      "Reads undercurrents others cannot feel",
      "Rich creative and dream life",
      "Unafraid of ambiguity",
    ],
    growthAreas: [
      "Anxiety fills the gaps knowledge leaves",
      "Projection mistaken for intuition",
      "Prefers mystery to resolution",
    ],
    karmicLessons: [
      "Not every shadow hides a monster",
      "Feelings are data, not verdicts",
      "The moon also waxes — wait for more light before deciding",
    ],
    lifePurpose:
      "To be a guide through the uncertain hours — fluent in dream and symbol, unafraid of the dark, and able to walk others through it without lying about the terrain.",
    compatibleArcanas: [2, 12, 15],
  },
  {
    number: 19,
    name: "The Sun",
    keywords: ["joy", "vitality", "clarity"],
    mission: "Radiate warmth, optimism and uncomplicated truth.",
    element: "Fire",
    astrology: "Sun",
    numerology: "19 — 1+9 = 10, completion crowned with joy.",
    upright:
      "Joy, success, vitality, plain truth. The child on the white horse hides nothing — the Sun is happiness without an asterisk, clarity without shadows.",
    reversed:
      "Dimmed joy, optimism forced, success that fails to warm. The sun is still there — behind a cloud of your own making.",
    strengths: [
      "Genuinely lifts every room",
      "Honest without cruelty",
      "Resilient, solar confidence",
    ],
    growthAreas: [
      "Discomfort with others' darkness",
      "Positivity used as avoidance",
      "Burnout from always shining",
    ],
    karmicLessons: [
      "Shadows are not failures",
      "Joy shared must also be joy received",
      "Even the sun sets — rest is part of the cycle",
    ],
    lifePurpose:
      "To be uncomplicated light — succeeding openly, warming generously, and reminding a complicated world that simple happiness is a legitimate achievement.",
    compatibleArcanas: [7, 8, 20],
  },
  {
    number: 20,
    name: "Judgement",
    keywords: ["awakening", "calling", "reckoning"],
    mission: "Answer the higher calling and rise renewed from honest self-review.",
    element: "Fire",
    astrology: "Pluto",
    numerology: "20 — 2+0 = 2, the awakened self meeting its reflection.",
    upright:
      "Awakening, absolution, the trumpet call to a larger life. The figures rise from their coffins — the past reviewed, forgiven, and finally answered.",
    reversed:
      "The calling heard and ignored, self-judgment without mercy, or a reckoning postponed. The trumpet sounds; you pretend it is traffic.",
    strengths: [
      "Reinvents life decisively when called",
      "Forgives — self most of all",
      "Sees the verdict of a whole life clearly",
    ],
    growthAreas: [
      "Harsh audits of self and others",
      "All-or-nothing reinventions",
      "Confuses restlessness with calling",
    ],
    karmicLessons: [
      "Absolution must include yourself",
      "Not every trumpet is yours to answer",
      "The reckoning repeated becomes rut, not renewal",
    ],
    lifePurpose:
      "To rise — and to help others rise — by telling the truth about the past, forgiving it, and answering the call that only comes to those who have done both.",
    compatibleArcanas: [10, 19, 21],
  },
  {
    number: 21,
    name: "The World",
    keywords: ["completion", "integration", "fulfillment"],
    mission: "Integrate all lessons into wholeness and celebrate completion.",
    element: "Earth",
    astrology: "Saturn",
    numerology: "21 — 2+1 = 3, creation fulfilled; the dance inside the wreath.",
    upright:
      "Completion, integration, arrival. The dancer turns inside the laurel wreath — every lesson learned, every corner of the self invited to the celebration.",
    reversed:
      "The last step delayed, a cycle refusing to close, or completion without satisfaction. The wreath is woven; you keep looking for one more leaf.",
    strengths: [
      "Finishes — truly finishes — what she starts",
      "Integrates opposites into a working whole",
      "Big-picture mastery",
    ],
    growthAreas: [
      "Perfectionism delays the finish line",
      "Attachment to being the completer",
      "Emptiness after the wreath is won",
    ],
    karmicLessons: [
      "Done is sacred too",
      "Wholeness includes the parts you dislike",
      "Every world ends so a new one can begin",
    ],
    lifePurpose:
      "To complete — gathering every scattered lesson into one integrated, dancing whole, and proving that fulfillment is a practice of inclusion, not achievement.",
    compatibleArcanas: [4, 9, 20],
  },
  {
    number: 22,
    name: "The Fool",
    keywords: ["beginnings", "freedom", "leap of faith"],
    mission: "Begin again with open-hearted trust in the journey.",
    element: "Air",
    astrology: "Uranus",
    numerology: "22 — the master number outside the count; zero wearing a number.",
    upright:
      "New beginnings, spontaneity, holy trust. The Fool steps toward the cliff edge with a rose and a small dog — not blind to the drop, but loyal to the journey.",
    reversed:
      "Recklessness, naivety exploited, or the leap refused out of fear. The dog barks at the cliff; the Fool either flies too carelessly or never jumps.",
    strengths: [
      "Starts without needing guarantees",
      "Light where others are heavy",
      "Trusts life in a way that opens doors",
    ],
    growthAreas: [
      "Learns some cliffs the hard way",
      "Commitment feels like a cage",
      "Mistakes novelty for meaning",
    ],
    karmicLessons: [
      "Faith and foolishness differ by one look at the map",
      "Freedom includes the freedom to stay",
      "Every master was once the Fool who jumped",
    ],
    lifePurpose:
      "To begin — again and again, without cynicism — proving that trust is the beginning of every road, and that the leap is where the flying lessons happen.",
    compatibleArcanas: [11, 16, 19],
  },
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

/** @deprecated use getArcana(9) — kept for compatibility with earlier design variants. */
export const HERMIT: ArcanaCard = getArcana(9);
