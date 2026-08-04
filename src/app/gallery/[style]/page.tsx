import Link from "next/link";
import { notFound } from "next/navigation";
import type { JSX } from "react";
import { toRoman } from "@/lib/roman";
import Replayable from "@/components/card-lab/replayable";
import CardShell from "@/components/cards/card-shell";
import OrreryCard from "@/components/cards/orrery";
import NocturlabeCard from "@/components/cards/nocturlabe";
import LunarMansionsCard from "@/components/cards/lunar-mansions";
import VirgoChartCard from "@/components/cards/virgo-chart";
import PlanetaryHoursCard from "@/components/cards/planetary-hours";
import GoldMedallionCard from "@/components/cards/gold-medallion";
import VolvelleCard from "@/components/cards/volvelle";
import CelestialSextantCard from "@/components/cards/celestial-sextant";

const STYLES: Record<
  string,
  {
    name: string;
    component: (props: {
      number?: number;
      name?: string;
      variant?: number;
    }) => JSX.Element;
  }
> = {
  orrery: { name: "Orrery", component: OrreryCard },
  nocturlabe: { name: "Nocturlabe", component: NocturlabeCard },
  "lunar-mansions": { name: "Lunar Mansions", component: LunarMansionsCard },
  "virgo-chart": { name: "Virgo Chart", component: VirgoChartCard },
  "planetary-hours": { name: "Planetary Hours", component: PlanetaryHoursCard },
  "gold-medallion": { name: "Gold Medallion", component: GoldMedallionCard },
  volvelle: { name: "Volvelle", component: VolvelleCard },
  "celestial-sextant": {
    name: "Celestial Sextant",
    component: CelestialSextantCard,
  },
};

const GALLERY_CARDS = [
  { number: 9, name: "THE HERMIT", variant: 0 },
  { number: 1, name: "THE MAGICIAN", variant: 1 },
  { number: 3, name: "THE EMPRESS", variant: 2 },
  { number: 7, name: "THE CHARIOT", variant: 3 },
  { number: 10, name: "WHEEL OF FORTUNE", variant: 4 },
  { number: 13, name: "DEATH", variant: 5 },
  { number: 17, name: "THE STAR", variant: 6 },
  { number: 22, name: "THE FOOL", variant: 7 },
];

export function generateStaticParams() {
  return Object.keys(STYLES).map((style) => ({ style }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ style: string }>;
}) {
  const { style } = await params;
  const s = STYLES[style];
  return { title: s ? `${s.name} Deck — Astro Scope` : "Astro Scope" };
}

export default async function StyleGallery({
  params,
}: {
  params: Promise<{ style: string }>;
}) {
  const { style } = await params;
  const s = STYLES[style];
  if (!s) notFound();
  const Card = s.component;

  return (
    <main className="min-h-screen bg-[#0a0c14] px-6 py-16 font-sans text-neutral-300">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="text-sm text-neutral-500 transition hover:text-neutral-200"
        >
          ← Arcana Card Collection
        </Link>
        <h1 className="mt-3 font-serif text-4xl text-neutral-100">
          {s.name} — The Deck
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400">
          The {s.name} treatment across the Major Arcana — eight cards, one
          instrument.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {GALLERY_CARDS.map((c) => (
            <div key={c.number}>
              <Replayable>
                <CardShell>
                  <Card number={c.number} name={c.name} variant={c.variant} />
                </CardShell>
              </Replayable>
              <p className="mt-3 text-sm text-neutral-400">
                <span className="text-neutral-500">{toRoman(c.number)}</span>
                {" · "}
                {c.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
