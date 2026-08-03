import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ARCANA, getArcana } from "@/lib/arcana";
import {
  ARCANA_ROUTES_BASE,
  BLUE,
  MiniRisoCard,
  PINK,
  RisoCard,
  STICKER_COLORS,
  Sticker,
  V4_BASE_STYLES,
  V4Footer,
  YELLOW,
} from "../shared";

/* ------------------------------------------------------------------ */
/* Static generation                                                   */
/* ------------------------------------------------------------------ */

export const dynamicParams = false;

export function generateStaticParams() {
  return ARCANA.map((card) => ({ arcana: String(card.number) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ arcana: string }>;
}): Promise<Metadata> {
  const { arcana } = await params;
  const n = Number(arcana);
  if (!Number.isInteger(n) || n < 1 || n > 22) {
    return { title: "Birth Arcana — Astro Scope" };
  }
  const card = getArcana(n);
  return { title: `${card.name} — Birth Arcana · Astro Scope` };
}

/* ------------------------------------------------------------------ */
/* Small block header                                                  */
/* ------------------------------------------------------------------ */

function BlockHeader({
  index,
  title,
  bg,
  textColor = "#000000",
}: {
  index: string;
  title: string;
  bg: string;
  textColor?: string;
}) {
  return (
    <div className="flex items-stretch border-b-4 border-black">
      <div
        className="flex items-center border-r-4 border-black px-4 py-3 font-black text-black"
        style={{ backgroundColor: YELLOW }}
      >
        <span className="text-2xl leading-none md:text-3xl">{index}</span>
      </div>
      <h2
        className="v4-heading flex flex-1 items-center px-4 py-3 text-2xl uppercase leading-none md:text-3xl"
        style={{ backgroundColor: bg, color: textColor }}
      >
        {title}
      </h2>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default async function ArcanaDetailPage({
  params,
}: {
  params: Promise<{ arcana: string }>;
}) {
  const { arcana } = await params;
  const n = /^\d+$/.test(arcana) ? Number(arcana) : NaN;
  if (!Number.isInteger(n) || n < 1 || n > 22) {
    notFound();
  }
  const card = getArcana(n);
  const kindred = card.compatibleArcanas.map((c) => getArcana(c));

  return (
    <main className="min-h-screen bg-white font-sans text-black">
      <style>{V4_BASE_STYLES}</style>

      {/* 1 — TOP STRIP + BACK LINK */}
      <header className="border-b-4 border-black bg-black text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link
            href={ARCANA_ROUTES_BASE}
            className="v4-heading text-sm uppercase tracking-widest md:text-base"
          >
            ← Back to calculator
          </Link>
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: YELLOW }}
          >
            Card {String(card.number).padStart(2, "0")} / 22
          </span>
        </div>
      </header>

      {/* 2 — RISO CARD CENTERPIECE on a contrasting block */}
      <section
        className="border-b-4 border-black"
        style={{ backgroundColor: BLUE }}
      >
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-[auto_1fr] md:py-20">
          <div className="flex justify-center pt-8 md:justify-start">
            <RisoCard card={card} />
          </div>
          <div className="text-center md:text-left">
            <p
              className="v4-heading text-sm uppercase tracking-[0.35em]"
              style={{ color: YELLOW }}
            >
              ★ Your birth arcana ★
            </p>
            <h1 className="v4-heading mt-3 text-5xl uppercase leading-[0.9] text-white md:text-7xl">
              {card.name}
            </h1>
            <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
              {card.keywords.map((k, i) => (
                <Sticker
                  key={k}
                  color={STICKER_COLORS[i % STICKER_COLORS.length]}
                  rotate={i % 2 === 0 ? -2 : 2}
                >
                  {k}
                </Sticker>
              ))}
            </div>
            <p className="mt-6 max-w-lg text-lg font-bold leading-snug text-white md:mx-0 md:text-xl">
              <span
                className="v4-heading mr-2 uppercase"
                style={{ color: PINK }}
              >
                Mission:
              </span>
              {card.mission}
            </p>
          </div>
        </div>
      </section>

      {/* 3 — THE READING in brutalist blocks */}
      <section className="border-b-4 border-black bg-white">
        <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 md:py-16">
          {/* upright / reversed */}
          <div className="grid gap-6 md:grid-cols-2">
            <div
              className="v4-shadow border-4 border-black"
              style={{ backgroundColor: YELLOW }}
            >
              <div className="v4-heading border-b-4 border-black bg-black px-4 py-2 text-lg uppercase text-white">
                ↑ Upright
              </div>
              <p className="px-4 py-4 font-bold leading-snug">{card.upright}</p>
            </div>
            <div className="v4-shadow border-4 border-black bg-white">
              <div
                className="v4-heading border-b-4 border-black px-4 py-2 text-lg uppercase text-black"
                style={{ backgroundColor: PINK }}
              >
                ↓ Reversed
              </div>
              <p className="px-4 py-4 font-bold leading-snug">{card.reversed}</p>
            </div>
          </div>

          {/* associations */}
          <div className="v4-shadow border-4 border-black bg-white">
            <BlockHeader index="01" title="Associations" bg="#000000" textColor="#ffffff" />
            <div className="grid md:grid-cols-3">
              {(
                [
                  ["Element", card.element],
                  ["Numerology", card.numerology],
                  ["Astrology", card.astrology],
                ] as const
              ).map(([label, value], i) => (
                <div
                  key={label}
                  className={`px-4 py-4 ${
                    i < 2 ? "border-b-4 border-black md:border-b-0 md:border-r-4" : ""
                  }`}
                >
                  <p
                    className="v4-heading text-xs uppercase tracking-[0.25em]"
                    style={{ color: BLUE }}
                  >
                    {label}
                  </p>
                  <p className="mt-2 font-bold leading-snug">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* strengths vs growth */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="v4-shadow border-4 border-black bg-white">
              <div
                className="v4-heading border-b-4 border-black px-4 py-2 text-lg uppercase"
                style={{ backgroundColor: YELLOW }}
              >
                ✔ Strengths
              </div>
              <ul className="divide-y-4 divide-black">
                {card.strengths.map((s) => (
                  <li key={s} className="px-4 py-3 font-bold leading-snug">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="v4-shadow border-4 border-black bg-white">
              <div
                className="v4-heading border-b-4 border-black px-4 py-2 text-lg uppercase"
                style={{ color: PINK }}
              >
                ✘ Growth areas
              </div>
              <ul className="divide-y-4 divide-black">
                {card.growthAreas.map((g) => (
                  <li key={g} className="px-4 py-3 font-bold leading-snug">
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* karmic lessons */}
          <div
            className="v4-shadow border-4 border-black"
            style={{ backgroundColor: PINK }}
          >
            <div className="v4-heading border-b-4 border-black bg-black px-4 py-2 text-lg uppercase text-white">
              Karmic lessons
            </div>
            <ol className="divide-y-4 divide-black">
              {card.karmicLessons.map((lesson, i) => (
                <li key={lesson} className="flex items-center gap-4 px-4 py-3">
                  <span className="v4-heading text-3xl">#{i + 1}</span>
                  <span className="font-bold leading-snug">{lesson}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* life purpose */}
          <div
            className="v4-shadow border-4 border-black bg-black px-6 py-8 md:px-10"
            style={{ boxShadow: `8px 8px 0 ${BLUE}` }}
          >
            <p
              className="v4-heading text-xs uppercase tracking-[0.35em]"
              style={{ color: PINK }}
            >
              Life purpose
            </p>
            <p className="v4-heading mt-4 text-xl uppercase leading-snug text-white md:text-3xl">
              &ldquo;{card.lifePurpose}&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* 4 — COMPATIBLE ARCANAS */}
      <section
        className="border-b-4 border-black"
        style={{ backgroundColor: YELLOW }}
      >
        <BlockHeader index="02" title="Compatible arcanas" bg={PINK} />
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="mx-auto grid max-w-2xl grid-cols-3 gap-5 md:gap-8">
            {kindred.map((c) => (
              <MiniRisoCard key={c.number} card={c} />
            ))}
          </div>
          <p className="mt-8 text-center font-bold">
            Same misprint, different destiny. Click one to read it.
          </p>
        </div>
      </section>

      {/* 5 — FOOTER */}
      <V4Footer />
    </main>
  );
}
