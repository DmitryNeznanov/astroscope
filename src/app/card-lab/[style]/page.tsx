import Link from "next/link";
import { notFound } from "next/navigation";
import type { JSX } from "react";
import { toRoman } from "@/lib/roman";
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

const STYLES: Record<
  string,
  { name: string; component: (props: { number?: number; name?: string; variant?: number }) => JSX.Element }
> = {
  pixel: { name: "Pixel / 8-bit", component: PixelCard },
  "art-nouveau": { name: "Art Nouveau", component: ArtNouveauCard },
  bauhaus: { name: "Bauhaus", component: BauhausCard },
  blueprint: { name: "Blueprint", component: BlueprintCard },
  "stained-glass": { name: "Stained Glass", component: StainedGlassCard },
  woodcut: { name: "Woodcut", component: WoodcutCard },
  neon: { name: "Neon Sign", component: NeonCard },
  lowpoly: { name: "Low Poly", component: LowpolyCard },
  "ukiyo-e": { name: "Ukiyo-e", component: UkiyoECard },
  "art-deco": { name: "Art Deco", component: ArtDecoCard },
  "single-line": { name: "Single Line", component: SingleLineCard },
  papercut: { name: "Papercut", component: PapercutCard },
  psychedelic: { name: "Psychedelic", component: PsychedelicCard },
  "pop-art": { name: "Pop Art", component: PopArtCard },
  "cross-stitch": { name: "Cross-Stitch", component: CrossStitchCard },
  vaporwave: { name: "Vaporwave", component: VaporwaveCard },
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
  return { title: s ? `${s.name} — Card Style Lab` : "Card Style Lab" };
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
    <main className="min-h-screen bg-[#101014] px-6 py-14 font-sans text-neutral-200">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/card-lab"
          className="text-sm text-neutral-500 transition hover:text-neutral-200"
        >
          ← Card Style Lab
        </Link>
        <h1 className="mt-3 text-4xl font-bold text-neutral-100">{s.name}</h1>
        <p className="mt-3 max-w-2xl text-neutral-400">
          The {s.name} treatment applied across the Major Arcana — one style,
          eight cards.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {GALLERY_CARDS.map((c) => (
            <div key={c.number}>
              <div className="overflow-hidden rounded-lg shadow-2xl shadow-black/60">
                <Card number={c.number} name={c.name} variant={c.variant} />
              </div>
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
