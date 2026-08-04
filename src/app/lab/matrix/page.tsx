import Link from "next/link";
import EngravedGold from "@/components/matrix/engraved-gold";
import CodexManuscript from "@/components/matrix/codex-manuscript";
import LunarSilver from "@/components/matrix/lunar-silver";
import StarChart from "@/components/matrix/star-chart";
import SacredGeometry from "@/components/matrix/sacred-geometry";
import NeonOracle from "@/components/matrix/neon-oracle";
import VolvellePaper from "@/components/matrix/volvelle-paper";
import AurumEngine from "@/components/matrix/aurum-engine";

const VARIANTS = [
  {
    name: "Engraved Gold",
    component: EngravedGold,
    note: "Brass instrument: beveled node plates, rivets, compass-ticked age ring.",
  },
  {
    name: "Codex Manuscript",
    component: CodexManuscript,
    note: "Illuminated diagram on emerald vellum with rubric accents and Latin labels.",
  },
  {
    name: "Lunar Silver",
    component: LunarSilver,
    note: "Moon-phase node discs, tide-gauge age ring, drifting mist.",
  },
  {
    name: "Star Chart",
    component: StarChart,
    note: "Nodes as glowing stars on a celestial coordinate ring.",
  },
  {
    name: "Sacred Geometry",
    component: SacredGeometry,
    note: "Precision construction — vesica, hexagram grid, graduated scale ring.",
  },
  {
    name: "Neon Oracle",
    component: NeonOracle,
    note: "Glowing tube rings and light traces on dark glass.",
  },
  {
    name: "Volvelle Paper",
    component: VolvellePaper,
    note: "Layered parchment discs, punched labels, brass brad, deckle edges.",
  },
  {
    name: "Aurum Engine",
    component: AurumEngine,
    note: "Instrument dials with needles, riveted rails, calibrated scale band.",
  },
];

export const metadata = {
  title: "Destiny Matrix — Design Lab — Astro Scope",
};

export default function MatrixLab() {
  return (
    <main className="min-h-screen bg-[#0a0912] px-6 py-16 font-sans text-neutral-300">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="text-sm text-neutral-500 transition hover:text-neutral-200"
        >
          ← Index
        </Link>
        <h1 className="mt-3 text-center font-serif text-4xl text-neutral-100">
          Destiny Matrix — Design Lab
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-neutral-400">
          One matrix — Day 8 · Month 7 · Year 10 · Base 7 · Center 5 — drawn
          eight ways. Every variant is bespoke inline SVG with its own
          construction, load reveal and ambient motion.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-3">
          {VARIANTS.map((v) => {
            const M = v.component;
            return (
              <div key={v.name}>
                <div className="overflow-hidden rounded-xl shadow-2xl shadow-black/60">
                  <M />
                </div>
                <h2 className="mt-4 font-serif text-lg text-neutral-100">
                  {v.name}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                  {v.note}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
