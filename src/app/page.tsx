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

        <p className="mt-16 text-center text-xs text-neutral-600">
          Earlier explorations (playful styles) live in the{" "}
          <Link
            href="/reference/card-lab"
            className="underline underline-offset-4 transition hover:text-neutral-300"
          >
            reference archive
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
