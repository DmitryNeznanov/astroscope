import Link from "next/link";

const variants = [
  {
    id: "v1",
    name: "Midnight Mystic",
    desc: "Dark cosmic palette, glowing gold accents, serif display type, starfield atmosphere.",
  },
  {
    id: "v2",
    name: "Paper Minimal",
    desc: "Light, typography-first, generous whitespace, quiet editorial layout.",
  },
  {
    id: "v3",
    name: "Vintage Grimoire",
    desc: "Parchment textures, ornamental borders, old-world engraving mood.",
  },
  {
    id: "v4",
    name: "Neo-Brutalist",
    desc: "Hard borders, flat loud color, raw grid, unapologetic blocks.",
  },
  {
    id: "v5",
    name: "Aurora Glass",
    desc: "Gradient mesh background, frosted glass panels, soft neon glow.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-16 font-sans">
      <p className="text-sm uppercase tracking-widest text-neutral-500">
        Astro Scope — design exploration
      </p>
      <h1 className="mt-2 text-4xl font-bold">Birth Arcana Calculator</h1>
      <p className="mt-4 text-neutral-600 dark:text-neutral-400">
        Five independent visual directions for the same calculator. Each is a
        full standalone page — pick what resonates.
      </p>
      <ul className="mt-10 space-y-4">
        {variants.map((v) => (
          <li key={v.id}>
            <Link
              href={`/designs/${v.id}`}
              className="block rounded-xl border border-neutral-200 p-5 transition hover:border-neutral-900 dark:border-neutral-800 dark:hover:border-neutral-100"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-semibold">{v.name}</span>
                <span className="text-xs uppercase tracking-wider text-neutral-400">
                  /designs/{v.id}
                </span>
              </div>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                {v.desc}
              </p>
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/card-lab"
            className="block rounded-xl border border-dashed border-neutral-300 p-5 transition hover:border-neutral-900 dark:border-neutral-700 dark:hover:border-neutral-100"
          >
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-semibold">Card Style Lab</span>
              <span className="text-xs uppercase tracking-wider text-neutral-400">
                /card-lab
              </span>
            </div>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              The Hermit drawn 8 completely different ways — pixel art, art
              nouveau, bauhaus, blueprint, stained glass, woodcut, neon, low
              poly.
            </p>
          </Link>
        </li>
      </ul>
    </main>
  );
}
