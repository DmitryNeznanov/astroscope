import Link from "next/link";
import Replayable from "@/components/card-lab/replayable";
import CardShell from "@/components/cards/card-shell";
import CelestialAtlasCard from "@/components/cards/celestial-atlas";
import MoonSilverCard from "@/components/cards/moon-silver";
import SacredGeometryCard from "@/components/cards/sacred-geometry";
import CinematicStillCard from "@/components/cards/cinematic-still";
import NebulaWatercolorCard from "@/components/cards/nebula-watercolor";
import GoldFoilCard from "@/components/cards/gold-foil";
import EtherealMistCard from "@/components/cards/ethereal-mist";
import AstrolabeCard from "@/components/cards/astrolabe";
import NatalChartCard from "@/components/cards/natal-chart";
import ZodiacMandalaCard from "@/components/cards/zodiac-mandala";
import PlanetaryAlignmentCard from "@/components/cards/planetary-alignment";
import EphemerisCard from "@/components/cards/ephemeris";
import ArmillarySphereCard from "@/components/cards/armillary-sphere";
import LunarCalendarCard from "@/components/cards/lunar-calendar";
import StarDomeCard from "@/components/cards/star-dome";
import AstronomicalClockCard from "@/components/cards/astronomical-clock";
import OrreryCard from "@/components/cards/orrery";
import NocturlabeCard from "@/components/cards/nocturlabe";
import LunarMansionsCard from "@/components/cards/lunar-mansions";
import VirgoChartCard from "@/components/cards/virgo-chart";
import PlanetaryHoursCard from "@/components/cards/planetary-hours";
import GoldMedallionCard from "@/components/cards/gold-medallion";
import VolvelleCard from "@/components/cards/volvelle";
import CelestialSextantCard from "@/components/cards/celestial-sextant";
import PixelCard from "@/components/card-lab/pixel";
import ArtNouveauCard from "@/components/card-lab/art-nouveau";
import BauhausCard from "@/components/card-lab/bauhaus";
import BlueprintCard from "@/components/card-lab/blueprint";
import StainedGlassCard from "@/components/card-lab/stained-glass";
import WoodcutCard from "@/components/card-lab/woodcut";
import NeonCard from "@/components/card-lab/neon";
import LowpolyCard from "@/components/card-lab/lowpoly";
import UkiyoECard from "@/components/card-lab/ukiyo-e";
import ArtDecoCard from "@/components/card-lab/art-deco";
import SingleLineCard from "@/components/card-lab/single-line";
import PapercutCard from "@/components/card-lab/papercut";
import PsychedelicCard from "@/components/card-lab/psychedelic";
import PopArtCard from "@/components/card-lab/pop-art";
import CrossStitchCard from "@/components/card-lab/cross-stitch";
import VaporwaveCard from "@/components/card-lab/vaporwave";

const LAB_STYLES = [
  { name: "Pixel / 8-bit", slug: "pixel", component: PixelCard },
  { name: "Art Nouveau", slug: "art-nouveau", component: ArtNouveauCard },
  { name: "Bauhaus", slug: "bauhaus", component: BauhausCard },
  { name: "Blueprint", slug: "blueprint", component: BlueprintCard },
  { name: "Stained Glass", slug: "stained-glass", component: StainedGlassCard },
  { name: "Woodcut", slug: "woodcut", component: WoodcutCard },
  { name: "Neon Sign", slug: "neon", component: NeonCard },
  { name: "Low Poly", slug: "lowpoly", component: LowpolyCard },
  { name: "Ukiyo-e", slug: "ukiyo-e", component: UkiyoECard },
  { name: "Art Deco", slug: "art-deco", component: ArtDecoCard },
  { name: "Single Line", slug: "single-line", component: SingleLineCard },
  { name: "Papercut", slug: "papercut", component: PapercutCard },
  { name: "Psychedelic", slug: "psychedelic", component: PsychedelicCard },
  { name: "Pop Art", slug: "pop-art", component: PopArtCard },
  { name: "Cross-Stitch", slug: "cross-stitch", component: CrossStitchCard },
  { name: "Vaporwave", slug: "vaporwave", component: VaporwaveCard },
];

const INSTRUMENT_STYLES = [
  {
    name: "Orrery",
    slug: "orrery",
    component: OrreryCard,
    note: "A brass planetarium machine — geared rings, planet arms, the lantern burning where the Sun should be.",
  },
  {
    name: "Nocturlabe",
    slug: "nocturlabe",
    component: NocturlabeCard,
    note: "Telling time by starlight: Polaris at the pivot, Ursa Major on the dial, the pointer arm swung to the hour.",
  },
  {
    name: "Lunar Mansions",
    slug: "lunar-mansions",
    component: LunarMansionsCard,
    note: "The 28 mansions of the Moon in a medieval wheel, the ninth mansion gilded.",
  },
  {
    name: "Virgo Chart",
    slug: "virgo-chart",
    component: VirgoChartCard,
    note: "The Maiden engraved around her true stars — Spica on the wheat, the Hermit gazing up.",
  },
  {
    name: "Planetary Hours",
    slug: "planetary-hours",
    component: PlanetaryHoursCard,
    note: "The Star of the Magi — a heptagram of planetary rulers with dies Saturni marked in red.",
  },
  {
    name: "Gold Medallion",
    slug: "gold-medallion",
    component: GoldMedallionCard,
    note: "A struck coin: low-relief Hermit, rim inscription, reeded edge on black velvet.",
  },
  {
    name: "Volvelle",
    slug: "volvelle",
    component: VolvelleCard,
    note: "A medieval paper computer — rotating disc, cut-out window, brass brad.",
  },
  {
    name: "Celestial Sextant",
    slug: "celestial-sextant",
    component: CelestialSextantCard,
    note: "Engraved brass arc with vernier, the index arm swung to its reading under a sighted star.",
  },
];

const ASTRO_STYLES = [
  {
    name: "Natal Chart",
    component: NatalChartCard,
    note: "A full birth-chart wheel — houses, planets at their degrees, aspect lines, the Hermit at the hub.",
  },
  {
    name: "Zodiac Mandala",
    component: ZodiacMandalaCard,
    note: "A rose window of sign panels and planet bands, Virgo highlighted in gold.",
  },
  {
    name: "Planetary Alignment",
    component: PlanetaryAlignmentCard,
    note: "The great procession of spheres over one small figure — cosmic scale, human smallness.",
  },
  {
    name: "Ephemeris",
    component: EphemerisCard,
    note: "A page from the almanac: degree tables, retrograde marks, the Hermit's day ruled in ink.",
  },
  {
    name: "Armillary Sphere",
    component: ArmillarySphereCard,
    note: "Renaissance instrument of rings — the seeker standing at the center of the cosmos.",
  },
  {
    name: "Lunar Calendar",
    component: LunarCalendarCard,
    note: "A month of moon phases in a silver grid, the full moon of the ninth day ringed in gold.",
  },
  {
    name: "Star Dome",
    component: StarDomeCard,
    note: "Planetarium projection — classical figures in faint light, the Hermit burning brightest.",
  },
  {
    name: "Astronomical Clock",
    component: AstronomicalClockCard,
    note: "An Orloj-inspired dial with sun and moon hands, the Hermit standing on the pivot.",
  },
];

const STYLES = [
  {
    name: "Celestial Atlas",
    component: CelestialAtlasCard,
    note: "The Hermit as a constellation — connected star points, coordinate circles, zodiac band.",
  },
  {
    name: "Moon Silver",
    component: MoonSilverCard,
    note: "Silverpoint nocturne: moon-phase ring, soft lunar tones, drifting valley mist.",
  },
  {
    name: "Sacred Geometry",
    component: SacredGeometryCard,
    note: "The figure inscribed in vesica piscis and construction circles, hairline gold on black.",
  },
  {
    name: "Cinematic Still",
    component: CinematicStillCard,
    note: "A letterboxed film frame — volumetric lantern light, orange-teal grade, Ken Burns zoom.",
  },
  {
    name: "Nebula Watercolor",
    component: NebulaWatercolorCard,
    note: "Hand-painted cosmic washes with organic edges, salt-star specks, ink-wash silhouette.",
  },
  {
    name: "Gold Foil",
    component: GoldFoilCard,
    note: "Hot-stamped gold on matte black — minimal line art, zodiac wheel, occasional sheen.",
  },
  {
    name: "Ethereal Mist",
    component: EtherealMistCard,
    note: "A silhouette half-dissolved in fog, one distant amber light, arthouse restraint.",
  },
  {
    name: "Astrolabe",
    component: AstrolabeCard,
    note: "Medieval manuscript page — instrument rings, iron-gall ink, lapis and gold leaf.",
  },
];

export const metadata = {
  title: "Astro Scope — Arcana Card Collection",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0c14] px-6 py-16 font-sans text-neutral-300">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-xs uppercase tracking-[0.35em] text-neutral-500">
          Astro Scope
        </p>
        <h1 className="mt-3 text-center font-serif text-4xl text-neutral-100">
          Arcana Card Collection
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-neutral-400">
          The Hermit — the seeker who carries light into the dark — drawn
          eight ways, for those who came looking for magic. Slow light, deep
          sky, quiet motion.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STYLES.map((s) => {
            const Card = s.component;
            return (
              <div key={s.name}>
                <Replayable>
                  <CardShell>
                    <Card />
                  </CardShell>
                </Replayable>
                <h2 className="mt-4 font-serif text-lg text-neutral-100">
                  {s.name}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                  {s.note}
                </p>
              </div>
            );
          })}
        </div>

        <h2 className="mt-24 text-center font-serif text-3xl text-neutral-100">
          Astrology Series
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-neutral-400">
          Charts, wheels and instruments — the Hermit read through the
          machinery of the heavens.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {ASTRO_STYLES.map((s) => {
            const Card = s.component;
            return (
              <div key={s.name}>
                <Replayable>
                  <CardShell>
                    <Card />
                  </CardShell>
                </Replayable>
                <h2 className="mt-4 font-serif text-lg text-neutral-100">
                  {s.name}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                  {s.note}
                </p>
              </div>
            );
          })}
        </div>

        <h2 className="mt-24 text-center font-serif text-3xl text-neutral-100">
          Gold &amp; Mechanism
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-neutral-400">
          Brass, gold leaf and engraved scales — the Hermit among the
          instruments of the old astronomers.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {INSTRUMENT_STYLES.map((s) => {
            const Card = s.component;
            return (
              <div key={s.name}>
                <Replayable>
                  <CardShell>
                    <Card />
                  </CardShell>
                </Replayable>
                <div className="mt-4 flex items-baseline justify-between gap-2">
                  <h2 className="font-serif text-lg text-neutral-100">
                    {s.name}
                  </h2>
                  <span className="flex shrink-0 gap-2">
                    <Link
                      href={`/landing/${s.slug}`}
                      className="rounded-full border border-amber-700/60 px-3 py-1 text-xs text-amber-300/90 transition hover:border-amber-500 hover:text-amber-200"
                    >
                      Landing →
                    </Link>
                    <Link
                      href={`/gallery/${s.slug}`}
                      className="rounded-full border border-neutral-600 px-3 py-1 text-xs text-neutral-300 transition hover:border-neutral-300 hover:text-white"
                    >
                      Deck →
                    </Link>
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                  {s.note}
                </p>
              </div>
            );
          })}
        </div>

        <h2 className="mt-24 text-center font-serif text-3xl text-neutral-100">
          Tarot Card Style Lab
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-neutral-400">
          Earlier explorations — the Hermit drawn sixteen playful ways. Each
          style has a full deck in the archive.
        </p>

        <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-8">
          {LAB_STYLES.map((s) => {
            const Card = s.component;
            return (
              <div key={s.name}>
                <div className="overflow-hidden rounded-lg shadow-xl shadow-black/50">
                  <Replayable>
                    <Card />
                  </Replayable>
                </div>
                <div className="mt-2 flex items-baseline justify-between gap-1">
                  <span className="text-xs text-neutral-400">{s.name}</span>
                  <Link
                    href={`/reference/card-lab/${s.slug}`}
                    className="shrink-0 text-[11px] text-neutral-500 underline underline-offset-2 transition hover:text-neutral-200"
                  >
                    Deck →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <nav className="mt-24 border-t border-neutral-800 pt-14">
          <h2 className="text-center font-serif text-2xl text-neutral-100">
            Explore the work
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
            <div>
              <h3 className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                Tarot
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  ["/tarot", "Tarot hub"],
                  ["/tarot/spreads/daily-card", "Daily Card"],
                  ["/tarot/spreads/yes-no", "Yes / No"],
                  ["/tarot/spreads/past-present-future", "Past · Present · Future"],
                  ["/tarot/spreads/love-three-card", "Love Three-Card"],
                  ["/tarot/birth-arcana", "Birth Arcana"],
                  ["/tarot/cards", "Cards cabinet"],
                ].map(([href, label]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-neutral-400 transition hover:text-amber-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                Card decks
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  ["orrery", "Orrery"],
                  ["nocturlabe", "Nocturlabe"],
                  ["lunar-mansions", "Lunar Mansions"],
                  ["virgo-chart", "Virgo Chart"],
                  ["planetary-hours", "Planetary Hours"],
                  ["gold-medallion", "Gold Medallion"],
                  ["volvelle", "Volvelle"],
                  ["celestial-sextant", "Celestial Sextant"],
                ].map(([slug, label]) => (
                  <li key={slug}>
                    <Link
                      href={`/gallery/${slug}`}
                      className="text-neutral-400 transition hover:text-amber-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                Style landings
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  ["orrery", "Orrery"],
                  ["nocturlabe", "Nocturlabe"],
                  ["lunar-mansions", "Lunar Mansions"],
                  ["virgo-chart", "Virgo Chart"],
                  ["planetary-hours", "Planetary Hours"],
                  ["gold-medallion", "Gold Medallion"],
                  ["volvelle", "Volvelle"],
                  ["celestial-sextant", "Celestial Sextant"],
                ].map(([slug, label]) => (
                  <li key={slug}>
                    <Link
                      href={`/landing/${slug}`}
                      className="text-neutral-400 transition hover:text-amber-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                Concept lab
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  ["astra-console", "Astra Console"],
                  ["solar-path", "Solar Path"],
                  ["arcana-wheel", "Arcana Wheel"],
                  ["circuit-arcana", "Circuit Arcana"],
                  ["arcana-engine", "Arcana Engine"],
                  ["living-cosmos", "Living Cosmos"],
                  ["laboratorium", "Laboratorium"],
                  ["silver-depths", "Silver Depths"],
                  ["tabs", "Tab Instruments"],
                ].map(([slug, label]) => (
                  <li key={slug}>
                    <Link
                      href={`/lab/${slug}`}
                      className="text-neutral-400 transition hover:text-amber-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                Lab landings
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  ["aurum", "Aurum"],
                  ["codex", "Codex"],
                  ["selene", "Selene"],
                  ["forge", "Forge"],
                  ["remix-v1", "Production Remix v1"],
                  ["remix-v2", "Production Remix v2"],
                ].map(([slug, label]) => (
                  <li key={slug}>
                    <Link
                      href={`/lab/${slug}`}
                      className="text-neutral-400 transition hover:text-amber-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                Archive
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link
                    href="/reference/card-lab"
                    className="text-neutral-400 transition hover:text-amber-200"
                  >
                    Tarot Card Style Lab
                  </Link>
                </li>
                <li>
                  <Link
                    href="/reference/card-lab/pixel"
                    className="text-neutral-400 transition hover:text-amber-200"
                  >
                    Playful decks
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <p className="mt-14 text-center text-xs text-neutral-600">
          Astro Scope — design explorations for the Birth Arcana Calculator.
        </p>
      </div>
    </main>
  );
}
