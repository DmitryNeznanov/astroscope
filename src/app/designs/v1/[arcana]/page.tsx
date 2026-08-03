import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ARCANA, getArcana } from "@/lib/arcana";
import { ArcanaArt } from "@/components/arcana-art";
import {
  Chip,
  Divider,
  Eyebrow,
  MiniTarotCard,
  V1_BASE_STYLES,
  toRoman,
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
/* Styles specific to the detail page                                  */
/* ------------------------------------------------------------------ */

const V1_DETAIL_STYLES = `
  /* The tarot card centerpiece */
  .v1-tarot-card {
    position: relative;
    width: min(360px, 88vw);
    aspect-ratio: 2 / 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5.5% 7% 5%;
    border: 1px solid rgba(201, 162, 39, 0.65);
    border-radius: 6px;
    background:
      radial-gradient(85% 50% at 50% 38%, rgba(201, 162, 39, 0.12), transparent 68%),
      radial-gradient(120% 70% at 50% 110%, rgba(88, 70, 160, 0.14), transparent 60%),
      linear-gradient(180deg, #171530 0%, #0e0d1b 55%, #0a0913 100%);
    box-shadow:
      0 0 42px rgba(201, 162, 39, 0.2),
      0 0 130px rgba(201, 162, 39, 0.09),
      0 34px 70px rgba(0, 0, 0, 0.55);
    animation: v1-float 7s ease-in-out infinite;
  }
  .v1-tarot-card::before {
    content: "";
    position: absolute;
    inset: 9px;
    border: 1px solid rgba(201, 162, 39, 0.32);
    border-radius: 3px;
    pointer-events: none;
  }
  /* Gentle shine sweep across the card face */
  .v1-tarot-card::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 6px;
    overflow: hidden;
    pointer-events: none;
    background: linear-gradient(
      115deg,
      transparent 30%,
      rgba(255, 240, 200, 0.055) 46%,
      rgba(255, 240, 200, 0.11) 50%,
      rgba(255, 240, 200, 0.055) 54%,
      transparent 70%
    );
    background-size: 280% 100%;
    background-position: 120% 0;
    animation: v1-shine 6.5s ease-in-out infinite;
  }
  @keyframes v1-float {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-9px); }
  }
  @keyframes v1-shine {
    0%, 55%  { background-position: 120% 0; }
    85%, 100% { background-position: -60% 0; }
  }

  .v1-tarot-corner {
    position: absolute;
    width: 26px;
    height: 26px;
    border-color: rgba(201, 162, 39, 0.85);
    border-style: solid;
    pointer-events: none;
  }
  .v1-tarot-corner-tl { top: 4px; left: 4px; border-width: 1px 0 0 1px; }
  .v1-tarot-corner-tr { top: 4px; right: 4px; border-width: 1px 1px 0 0; }
  .v1-tarot-corner-bl { bottom: 4px; left: 4px; border-width: 0 0 1px 1px; }
  .v1-tarot-corner-br { bottom: 4px; right: 4px; border-width: 0 1px 1px 0; }

  .v1-tarot-art {
    position: relative;
    flex: 1;
    width: 100%;
    min-height: 0;
    margin: 4% 0;
    color: #d9b64a;
    filter: drop-shadow(0 0 8px rgba(201, 162, 39, 0.35));
  }
  /* Radial glow behind the illustration */
  .v1-tarot-art::before {
    content: "";
    position: absolute;
    inset: 8% 4%;
    background: radial-gradient(50% 45% at 50% 46%, rgba(201, 162, 39, 0.2), transparent 70%);
    pointer-events: none;
  }

  .v1-tarot-banner {
    width: 100%;
    border-top: 1px solid rgba(201, 162, 39, 0.4);
    border-bottom: 1px solid rgba(201, 162, 39, 0.4);
    padding: 3.2% 4%;
    background: linear-gradient(180deg, rgba(201, 162, 39, 0.07), rgba(201, 162, 39, 0.03));
    text-shadow: 0 0 18px rgba(201, 162, 39, 0.35);
  }

  .v1-back-link {
    color: #9b97ab;
    transition: color 140ms ease;
  }
  .v1-back-link:hover { color: #e3c964; }

  @media (prefers-reduced-motion: reduce) {
    .v1-tarot-card,
    .v1-tarot-card::after {
      animation: none;
    }
  }
`;

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

  return (
    <div className="v1-root v1-sans relative min-h-screen overflow-hidden">
      <style>{V1_BASE_STYLES + V1_DETAIL_STYLES}</style>

      {/* Starfield layers */}
      <div className="v1-stars" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8">
        {/* ---------------------------------------------------------- */}
        {/* Slim header + back link                                     */}
        {/* ---------------------------------------------------------- */}
        <header className="flex items-center justify-between gap-4 border-b border-[rgba(201,162,39,0.18)] py-5">
          <Link href="/designs/v1" className="v1-back-link v1-sans text-sm tracking-[0.12em]">
            ← Calculator
          </Link>
          <span className="v1-chip v1-sans rounded-full px-3 py-1 text-[10px] uppercase">
            Variant v1 · Midnight Mystic
          </span>
        </header>

        {/* ---------------------------------------------------------- */}
        {/* Card + reading                                              */}
        {/* ---------------------------------------------------------- */}
        <main className="grid items-start gap-12 pt-12 lg:grid-cols-[minmax(0,400px)_1fr] lg:gap-14">
          {/* The card */}
          <div className="flex flex-col items-center lg:sticky lg:top-10">
            <div className="v1-tarot-card">
              <span className="v1-tarot-corner v1-tarot-corner-tl" />
              <span className="v1-tarot-corner v1-tarot-corner-tr" />
              <span className="v1-tarot-corner v1-tarot-corner-bl" />
              <span className="v1-tarot-corner v1-tarot-corner-br" />

              {/* Roman numeral at top center, flanked by hairlines */}
              <div className="flex w-full items-center justify-center gap-4">
                <span className="h-px flex-1 bg-[linear-gradient(90deg,transparent,rgba(201,162,39,0.5))]" />
                <span className="v1-serif v1-gold-soft text-3xl leading-none [text-shadow:0_0_22px_rgba(201,162,39,0.45)]">
                  {toRoman(card.number)}
                </span>
                <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(201,162,39,0.5),transparent)]" />
              </div>

              {/* Illustration */}
              <div className="v1-tarot-art" aria-hidden="true">
                <ArcanaArt number={card.number} />
              </div>

              {/* Name banner */}
              <div className="v1-tarot-banner text-center">
                <span className="v1-serif v1-ivory block text-lg tracking-[0.22em] uppercase">
                  {card.name}
                </span>
              </div>
            </div>

            <p className="v1-sans v1-muted mt-7 text-[11px] uppercase tracking-[0.35em]">
              Birth Arcana · {toRoman(card.number)} of XXII
            </p>
          </div>

          {/* The reading */}
          <div>
            <Eyebrow>Your Birth Arcana</Eyebrow>
            <h1 className="v1-serif v1-ivory mt-3 text-4xl leading-tight sm:text-5xl">
              {card.name}{" "}
              <span className="v1-gold-soft">({toRoman(card.number)})</span>
            </h1>

            <div className="mt-5 flex flex-wrap gap-2">
              {card.keywords.map((kw) => (
                <Chip key={kw}>{kw}</Chip>
              ))}
            </div>

            <div className="v1-hairline v1-glow-gold mt-8 rounded-sm bg-[rgba(201,162,39,0.05)] px-6 py-5 sm:px-8">
              <p className="v1-gold v1-sans text-[10px] uppercase tracking-[0.35em]">
                Your mission
              </p>
              <p className="v1-serif v1-ivory mt-3 text-lg italic leading-relaxed">
                “{card.mission}”
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {/* Upright */}
              <article className="v1-panel v1-hairline-faint rounded-sm p-6">
                <h2 className="v1-serif v1-gold-soft text-xl">
                  Upright <span className="v1-muted text-sm">☉</span>
                </h2>
                <p className="v1-muted mt-3 text-sm leading-relaxed">
                  {card.upright}
                </p>
              </article>

              {/* Reversed */}
              <article className="v1-panel v1-hairline-faint rounded-sm p-6">
                <h2 className="v1-serif v1-gold-soft text-xl">
                  Reversed <span className="v1-muted text-sm">☽</span>
                </h2>
                <p className="v1-muted mt-3 text-sm leading-relaxed">
                  {card.reversed}
                </p>
              </article>

              {/* Associations */}
              <article className="v1-panel v1-hairline-faint rounded-sm p-6 sm:col-span-2">
                <h2 className="v1-serif v1-gold-soft text-xl">Associations</h2>
                <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  <div className="flex items-baseline justify-between gap-4 border-b border-[rgba(201,162,39,0.14)] pb-3">
                    <dt className="v1-sans v1-gold text-[10px] uppercase tracking-[0.28em]">
                      Element
                    </dt>
                    <dd className="v1-ivory text-sm">{card.element}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-[rgba(201,162,39,0.14)] pb-3">
                    <dt className="v1-sans v1-gold text-[10px] uppercase tracking-[0.28em]">
                      Astrology
                    </dt>
                    <dd className="v1-ivory text-sm">{card.astrology}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-[rgba(201,162,39,0.14)] pb-3">
                    <dt className="v1-sans v1-gold text-[10px] uppercase tracking-[0.28em]">
                      Number
                    </dt>
                    <dd className="v1-ivory text-sm">
                      {card.number} · {toRoman(card.number)}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-[rgba(201,162,39,0.14)] pb-3">
                    <dt className="v1-sans v1-gold text-[10px] uppercase tracking-[0.28em]">
                      Numerology
                    </dt>
                    <dd className="v1-ivory text-right text-sm">
                      {card.numerology}
                    </dd>
                  </div>
                </dl>
              </article>

              {/* Strengths */}
              <article className="v1-panel v1-hairline-faint rounded-sm p-6">
                <h2 className="v1-serif v1-gold-soft text-xl">Strengths</h2>
                <ul className="mt-4 space-y-3">
                  {card.strengths.map((s) => (
                    <li key={s} className="v1-muted flex gap-3 text-sm leading-relaxed">
                      <span className="v1-gold" aria-hidden="true">✦</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </article>

              {/* Growth areas */}
              <article className="v1-panel v1-hairline-faint rounded-sm p-6">
                <h2 className="v1-serif v1-gold-soft text-xl">Growth Areas</h2>
                <ul className="mt-4 space-y-3">
                  {card.growthAreas.map((s) => (
                    <li key={s} className="v1-muted flex gap-3 text-sm leading-relaxed">
                      <span className="v1-gold" aria-hidden="true">✧</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </article>

              {/* Karmic lessons */}
              <article className="v1-panel v1-hairline-faint rounded-sm p-6 sm:col-span-2">
                <h2 className="v1-serif v1-gold-soft text-xl">Karmic Lessons</h2>
                <ol className="mt-5 grid gap-4 sm:grid-cols-3">
                  {card.karmicLessons.map((lesson, i) => (
                    <li
                      key={lesson}
                      className="v1-hairline-faint rounded-sm bg-[rgba(201,162,39,0.04)] p-5 text-center"
                    >
                      <span className="v1-serif v1-gold-soft block text-xl">
                        {toRoman(i + 1)}
                      </span>
                      <span className="v1-muted mt-2 block text-sm leading-relaxed">
                        {lesson}
                      </span>
                    </li>
                  ))}
                </ol>
              </article>

              {/* Life purpose */}
              <article className="v1-card-frame v1-glow-gold relative rounded-sm p-8 text-center sm:col-span-2">
                <span className="v1-corner v1-corner-tl" />
                <span className="v1-corner v1-corner-tr" />
                <span className="v1-corner v1-corner-bl" />
                <span className="v1-corner v1-corner-br" />
                <h2
                  className="v1-sans v1-gold text-[10px] uppercase tracking-[0.4em]"
                  style={{ textIndent: "0.4em" }}
                >
                  Life Purpose
                </h2>
                <p className="v1-serif v1-ivory mx-auto mt-4 max-w-2xl text-lg italic leading-relaxed">
                  “{card.lifePurpose}”
                </p>
              </article>
            </div>
          </div>
        </main>

        <Divider glyph="☾" />

        {/* ---------------------------------------------------------- */}
        {/* Compatible arcanas                                          */}
        {/* ---------------------------------------------------------- */}
        <section className="text-center">
          <Eyebrow>Kindred Cards</Eyebrow>
          <h2 className="v1-serif v1-ivory mt-3 text-3xl sm:text-4xl">
            Compatible Arcanas
          </h2>
          <div className="mx-auto mt-9 grid max-w-lg grid-cols-3 gap-4">
            {card.compatibleArcanas.map((c) => (
              <MiniTarotCard key={c} card={getArcana(c)} />
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Footer                                                      */}
        {/* ---------------------------------------------------------- */}
        <footer className="mt-16 text-center">
          <p className="v1-sans v1-muted text-xs tracking-[0.2em]">
            Astro Scope — design variant v1 ·{" "}
            <span className="v1-gold">Midnight Mystic</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
