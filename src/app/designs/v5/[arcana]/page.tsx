import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ARCANA, getArcana } from "@/lib/arcana";
import { HoloCard } from "../holo-card";
import {
  ARCANA_ROUTES_BASE,
  AuroraBackdrop,
  Chip,
  GradientText,
  KeywordPill,
  MiniHoloCard,
  V5_BASE_STYLES,
  V5Footer,
  toRoman,
} from "../shared";

/* ------------------------------------------------------------------ */
/* Static generation                                                    */
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
  const n = /^\d+$/.test(arcana) ? Number(arcana) : NaN;
  if (!Number.isInteger(n) || n < 1 || n > 22) {
    return { title: "Birth Arcana — Astro Scope" };
  }
  const card = getArcana(n);
  return { title: `${card.name} — Birth Arcana · Astro Scope` };
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
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
    <div className="relative min-h-screen overflow-x-clip bg-[#070b1a] font-sans text-white antialiased selection:bg-fuchsia-400/30">
      <AuroraBackdrop />
      <style>{V5_BASE_STYLES}</style>

      {/* 1 · Nav / back link */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-8">
        <Link
          href={ARCANA_ROUTES_BASE}
          className="v5-nav-pill text-sm font-light tracking-[0.18em] text-white/85 transition-colors hover:text-white"
        >
          <span aria-hidden="true">←</span> Calculator
        </Link>
        <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-white/40">
          Card {toRoman(card.number)} · {String(card.number).padStart(2, "0")} / 22
        </span>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24">
        {/* 2 · The 3D holo card centerpiece */}
        <section className="grid items-center gap-12 pb-20 pt-14 md:grid-cols-[auto_1fr] md:pt-20">
          <div className="flex justify-center md:justify-start">
            <HoloCard card={card} />
          </div>
          <div className="text-center md:text-left">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.4em] text-violet-300/70">
              Your birth arcana
            </p>
            <h1 className="mb-6 text-5xl font-extralight leading-[1.05] tracking-tight sm:text-6xl">
              <GradientText>{card.name}</GradientText>
            </h1>
            <div className="mb-7 flex flex-wrap justify-center gap-2 md:justify-start">
              {card.keywords.map((k) => (
                <KeywordPill key={k} label={k} />
              ))}
            </div>
            <p className="mx-auto max-w-lg text-base font-light leading-relaxed text-white/70 md:mx-0 md:text-lg">
              <span className="mr-2 text-[11px] font-medium uppercase tracking-[0.3em] text-teal-200/80">
                Mission
              </span>
              {card.mission}
            </p>
          </div>
        </section>

        {/* 3 · The reading */}
        <section className="mx-auto max-w-4xl space-y-6 pb-20">
          {/* Upright / Reversed */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="v5-glass v5-rise px-7 py-8">
              <h2 className="mb-3 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.25em] text-teal-200/85">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-300 shadow-[0_0_8px_rgba(94,234,212,0.9)]" />
                Upright
              </h2>
              <p className="text-sm font-light leading-relaxed text-white/70">
                {card.upright}
              </p>
            </div>
            <div className="v5-glass v5-rise px-7 py-8">
              <h2 className="mb-3 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.25em] text-fuchsia-300/85">
                <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_8px_rgba(240,171,252,0.9)]" />
                Reversed
              </h2>
              <p className="text-sm font-light leading-relaxed text-white/70">
                {card.reversed}
              </p>
            </div>
          </div>

          {/* Associations */}
          <div className="v5-glass v5-rise px-8 py-9 sm:px-12">
            <h2 className="mb-6 text-center text-sm font-medium uppercase tracking-[0.25em] text-violet-300/85">
              Associations
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Chip label={`Element · ${card.element}`} accent="rgba(153,246,228,0.9)" />
              <Chip label={`Numerology · ${card.numerology}`} accent="rgba(196,181,253,0.9)" />
              <Chip label={`Astrology · ${card.astrology}`} accent="rgba(240,171,252,0.9)" />
            </div>
          </div>

          {/* Strengths / Growth */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="v5-glass v5-rise px-7 py-8">
              <h2 className="mb-5 text-sm font-medium uppercase tracking-[0.25em] text-violet-300/85">
                Strengths
              </h2>
              <ul className="space-y-3 text-sm">
                {card.strengths.map((s) => (
                  <li key={s} className="v5-list-item">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="v5-glass v5-rise px-7 py-8">
              <h2 className="mb-5 text-sm font-medium uppercase tracking-[0.25em] text-violet-300/85">
                Growth areas
              </h2>
              <ul className="space-y-3 text-sm">
                {card.growthAreas.map((g) => (
                  <li key={g} className="v5-list-item">
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Karmic lessons */}
          <div className="v5-glass v5-rise px-8 py-9 sm:px-12">
            <h2 className="mb-5 text-sm font-medium uppercase tracking-[0.25em] text-violet-300/85">
              Karmic lessons
            </h2>
            <ul className="space-y-3 text-sm">
              {card.karmicLessons.map((k) => (
                <li key={k} className="v5-list-item">
                  {k}
                </li>
              ))}
            </ul>
          </div>

          {/* Life purpose — highlighted */}
          <div className="v5-glass v5-rise relative overflow-hidden px-8 py-10 text-center sm:px-14">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.22), transparent 60%)",
              }}
              aria-hidden="true"
            />
            <h2 className="relative mb-4 text-[11px] font-medium uppercase tracking-[0.35em] text-white/50">
              Life purpose
            </h2>
            <p className="relative mx-auto max-w-2xl text-lg font-light leading-relaxed text-white/85">
              {card.lifePurpose}
            </p>
          </div>
        </section>

        {/* 4 · Compatible arcanas */}
        <section className="pb-8">
          <div className="mb-8 text-center">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.35em] text-teal-200/70">
              Resonant frequencies
            </p>
            <h2 className="text-3xl font-light tracking-tight text-white/90 sm:text-4xl">
              Compatible <GradientText>arcanas</GradientText>
            </h2>
          </div>
          <div className="mx-auto grid max-w-2xl grid-cols-3 gap-4 sm:gap-6">
            {kindred.map((c) => (
              <MiniHoloCard key={c.number} card={c} />
            ))}
          </div>
        </section>
      </main>

      <V5Footer />
    </div>
  );
}
