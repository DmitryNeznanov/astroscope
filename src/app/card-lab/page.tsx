import Link from "next/link";
import Replayable from "@/components/card-lab/replayable";
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

const STYLE_SLUGS = [
  "pixel",
  "art-nouveau",
  "bauhaus",
  "blueprint",
  "stained-glass",
  "woodcut",
  "neon",
  "lowpoly",
  "ukiyo-e",
  "art-deco",
  "single-line",
  "papercut",
  "psychedelic",
  "pop-art",
  "cross-stitch",
  "vaporwave",
];

const STYLES = [
  {
    name: "Pixel / 8-bit",
    component: PixelCard,
    note: "Hand-authored 24×36 bitmap rasterized to crisp SVG rects, dithered lantern glow, stepped RPG frame.",
    tags: ["SVG rects", "dithering", "retro palette"],
  },
  {
    name: "Art Nouveau",
    component: ArtNouveauCard,
    note: "Mucha-style flowing beziers, halo disk, whiplash curves, botanical border, ribbon banner.",
    tags: ["bezier line work", "ornament", "muted jewels"],
  },
  {
    name: "Bauhaus",
    component: BauhausCard,
    note: "The scene deconstructed into ~8 flat geometric shapes — circle, triangle, semicircle, bars.",
    tags: ["pure geometry", "flat primaries", "asymmetry"],
  },
  {
    name: "Blueprint",
    component: BlueprintCard,
    note: "Cyanotype schematic: chalk linework, dimension arrows, detail callouts, drafting title block.",
    tags: ["technical drawing", "monospace", "grid"],
  },
  {
    name: "Stained Glass",
    component: StainedGlassCard,
    note: "Lancet arch silhouette, jewel-tone leaded segments, rose window, glowing amber lantern shard.",
    tags: ["lead cames", "jewel fills", "arch"],
  },
  {
    name: "Woodcut",
    component: WoodcutCard,
    note: "German expressionist black-on-cream carving, gouge hatch bundles, lantern as the only light.",
    tags: ["2-color", "hatching", "raw contrast"],
  },
  {
    name: "Neon Sign",
    component: NeonCard,
    note: "Glowing tube paths with layered drop-shadow bloom on a dark brick wall, flickering lantern.",
    tags: ["tube glow", "brick wall", "flicker"],
  },
  {
    name: "Low Poly",
    component: LowpolyCard,
    note: "~46 flat facets forming figure and landscape, dusk gradient palette, no strokes.",
    tags: ["facets", "game-art", "gradient palette"],
  },
  {
    name: "Ukiyo-e",
    component: UkiyoECard,
    note: "Edo woodblock print: flat color blocks, bokashi sky, hanko seal, vertical title cartouche.",
    tags: ["flat fills", "prussian blue", "cartouche"],
  },
  {
    name: "Art Deco",
    component: ArtDecoCard,
    note: "Symmetric 1920s glamour: gold sunburst, ziggurat mountain, chevron robe, fan ornaments.",
    tags: ["gold on black", "symmetry", "sunburst"],
  },
  {
    name: "Single Line",
    component: SingleLineCard,
    note: "The whole scene as one unbroken ink stroke; the lantern glow is the only second element.",
    tags: ["one path", "minimal", "gallery"],
  },
  {
    name: "Papercut",
    component: PapercutCard,
    note: "Six stacked card-stock layers with real drop shadows — a shadow-box diorama in SVG.",
    tags: ["layers", "drop shadows", "craft tones"],
  },
  {
    name: "Psychedelic",
    component: PsychedelicCard,
    note: "1967 Fillmore poster: wavy contour rings, paisley flourishes, vibrating color pairs.",
    tags: ["wavy rings", "saturated", "bubble border"],
  },
  {
    name: "Pop Art",
    component: PopArtCard,
    note: "Lichtenstein comic panel: Ben-Day dots, starburst lantern, jagged caption boxes.",
    tags: ["ben-day dots", "primaries", "thick outlines"],
  },
  {
    name: "Cross-Stitch",
    component: CrossStitchCard,
    note: "Embroidered sampler: every pixel is an X-stitch on Aida cloth, floss palette, stitched alphabet.",
    tags: ["X stitches", "floss colors", "sampler"],
  },
  {
    name: "Vaporwave",
    component: VaporwaveCard,
    note: "Chrome statue hermit on a perspective grid, striped retro sun, palm and broken column.",
    tags: ["chrome", "retro sun", "pink/cyan"],
  },
];

export const metadata = {
  title: "Tarot Card Style Lab — Astro Scope",
};

export default function CardLab() {
  return (
    <main className="min-h-screen bg-[#101014] px-6 py-14 font-sans text-neutral-200">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
          Astro Scope — design exploration
        </p>
        <h1 className="mt-2 text-4xl font-bold text-neutral-100">
          Tarot Card Style Lab
        </h1>
        <p className="mt-3 max-w-2xl text-neutral-400">
          One subject — The Hermit (IX) — drawn sixteen completely different
          ways. Every card is bespoke inline SVG/CSS: no shared art, no
          images, no fonts.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STYLES.map((s, i) => {
            const Card = s.component;
            return (
              <div key={s.name}>
                <div className="overflow-hidden rounded-lg shadow-2xl shadow-black/60">
                  <Replayable>
                    <Card />
                  </Replayable>
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-2">
                  <h2 className="text-lg font-semibold text-neutral-100">
                    {s.name}
                  </h2>
                  <Link
                    href={`/card-lab/${STYLE_SLUGS[i]}`}
                    className="shrink-0 rounded-full border border-neutral-600 px-3 py-1 text-xs text-neutral-300 transition hover:border-neutral-300 hover:text-white"
                  >
                    Gallery →
                  </Link>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                  {s.note}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-neutral-700 px-2 py-0.5 text-[11px] text-neutral-500"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
