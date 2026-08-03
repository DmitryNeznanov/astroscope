import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ARCANA, getArcana } from "@/lib/arcana";
import { ArcanaArt } from "@/components/arcana-art";
import {
  ARCANA_ROUTES_BASE,
  ChapterHeading,
  Colophon,
  Corners,
  Divider,
  GREEN,
  INK,
  MiniTarotCard,
  OXBLOOD,
  PARCHMENT,
  V3_BASE_STYLES,
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

const V3_DETAIL_STYLES = `
  /* The antique copperplate engraving print --------------------------- */
  .v3-print-card {
    position: relative;
    width: min(350px, 88vw);
    aspect-ratio: 2 / 3;
    display: flex;
    flex-direction: column;
    padding: 5.5% 6.5% 5%;
    border: 1px solid rgba(59, 45, 31, 0.85);
    /* slightly uneven, deckle-like edge */
    border-radius: 3px 6px 4px 7px / 6px 3px 7px 4px;
    background-color: ${PARCHMENT};
    /* aged laid paper + foxing spots */
    background-image:
      radial-gradient(circle 30px at 15% 11%, rgba(146, 104, 52, 0.13), transparent 70%),
      radial-gradient(circle 20px at 86% 20%, rgba(122, 84, 40, 0.1), transparent 70%),
      radial-gradient(circle 38px at 80% 90%, rgba(146, 104, 52, 0.11), transparent 70%),
      radial-gradient(circle 15px at 24% 84%, rgba(122, 84, 40, 0.09), transparent 70%),
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
    box-shadow:
      0 1px 0 rgba(255, 250, 235, 0.55),
      0 22px 44px -18px rgba(59, 45, 31, 0.6);
  }
  /* thick-thin double frame just inside the edge */
  .v3-print-card::before {
    content: "";
    position: absolute;
    inset: 8px;
    border: 1px solid ${INK};
    outline: 3px double rgba(59, 45, 31, 0.8);
    outline-offset: 2px;
    pointer-events: none;
  }

  /* The plate-mark area holding the engraving */
  .v3-print-plate {
    position: relative;
    flex: 1;
    width: 100%;
    min-height: 0;
    padding: 7% 8%;
    /* faint radial age-darkening vignette behind the illustration */
    background-image: radial-gradient(ellipse at 50% 46%, transparent 52%, rgba(59, 45, 31, 0.13) 100%);
    overflow: hidden;
  }
  .v3-print-art {
    position: relative;
    width: 100%;
    height: 100%;
    color: ${INK};
  }

  /* Plate caption typeset below the plate mark, as on antique prints */
  .v3-print-caption {
    margin-top: 6%;
    text-align: center;
  }
  .v3-print-caption-roman {
    color: ${OXBLOOD};
    font-size: 1.15rem;
    letter-spacing: 0.12em;
    line-height: 1;
  }
  .v3-print-caption-name {
    font-variant: small-caps;
    letter-spacing: 0.16em;
    font-size: 1.3rem;
    line-height: 1.2;
    color: ${INK};
  }
  .v3-print-caption-rule {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin: 4% 8% 3%;
    color: ${OXBLOOD};
    font-size: 0.75rem;
  }
  .v3-print-caption-rule::before,
  .v3-print-caption-rule::after {
    content: "";
    flex: 1 1 0%;
    border-top: 1px solid rgba(107, 31, 31, 0.5);
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
  const kindred = card.compatibleArcanas.map((c) => getArcana(c));

  return (
    <main className="v3-root min-h-screen px-4 py-8 md:px-8 md:py-12">
      <style>{V3_BASE_STYLES + V3_DETAIL_STYLES}</style>

      <div className="mx-auto max-w-5xl">
        {/* ---------------------------------------------------------- */}
        {/* Slim masthead + back link                                   */}
        {/* ---------------------------------------------------------- */}
        <header>
          <div className="v3-rule-double" />
          <div className="v3-rule-thin mt-[3px]" />
          <div className="mt-4 flex items-center justify-between gap-4">
            <Link
              href={ARCANA_ROUTES_BASE}
              className="v3-back-link v3-smallcaps text-sm"
            >
              ☜&ensp;Return to the Calculator
            </Link>
            <span className="v3-smallcaps text-xs opacity-70">
              Birth Arcana · Vol. III
            </span>
          </div>
        </header>

        {/* ---------------------------------------------------------- */}
        {/* Card + reading                                              */}
        {/* ---------------------------------------------------------- */}
        <div className="grid items-start gap-12 pt-12 lg:grid-cols-[minmax(0,400px)_1fr] lg:gap-14">
          {/* The engraved print */}
          <div className="flex flex-col items-center lg:sticky lg:top-10">
            <div className="v3-print-card">
              <Corners />

              {/* Plate mark + engraving */}
              <div className="v3-print-plate v3-plate-mark">
                <div className="v3-print-art v3-hatch" aria-hidden="true">
                  <ArcanaArt number={card.number} />
                </div>
              </div>

              {/* Plate caption */}
              <div className="v3-print-caption">
                <p className="v3-print-caption-rule" aria-hidden>
                  <span>✦</span>
                </p>
                <p className="v3-print-caption-roman">{toRoman(card.number)}.</p>
                <p className="v3-print-caption-name mt-1">
                  <span aria-hidden className="mr-2 text-base" style={{ color: OXBLOOD }}>❧</span>
                  {card.name}.
                  <span aria-hidden className="ml-2 text-base" style={{ color: OXBLOOD }}>☙</span>
                </p>
              </div>
            </div>

            <p className="v3-smallcaps mt-7 text-[11px] tracking-[0.3em] opacity-70">
              Birth Arcana · {toRoman(card.number)} of XXII
            </p>
          </div>

          {/* The reading */}
          <div>
            <p className="v3-smallcaps text-center text-sm opacity-80 lg:text-left">
              ❧&ensp;Thy birth arcana is revealed&ensp;☙
            </p>
            <h1 className="v3-chapter-title mt-3 text-center text-4xl leading-tight lg:text-left">
              {card.name}{" "}
              <span style={{ color: OXBLOOD }}>({toRoman(card.number)})</span>
            </h1>

            <div className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
              {card.keywords.map((kw) => (
                <span key={kw} className="v3-chip text-xs">
                  {kw}
                </span>
              ))}
            </div>

            <div className="v3-inset mt-8 px-6 py-5">
              <p className="v3-smallcaps text-sm" style={{ color: GREEN }}>
                ❧&ensp;Thy mission
              </p>
              <p className="v3-dropcap mt-3 leading-relaxed">
                {card.mission}
              </p>
            </div>

            {/* Upright / Reversed annotated plates */}
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <article className="v3-annotated">
                <h2 className="v3-annotated-heading v3-smallcaps px-5 py-3 text-base" style={{ color: GREEN }}>
                  ❧&ensp;Upright
                </h2>
                <p className="px-5 py-4 text-sm leading-relaxed">{card.upright}</p>
              </article>
              <article className="v3-annotated">
                <h2 className="v3-annotated-heading v3-smallcaps px-5 py-3 text-base" style={{ color: OXBLOOD }}>
                  ☙&ensp;Reversed
                </h2>
                <p className="px-5 py-4 text-sm leading-relaxed">{card.reversed}</p>
              </article>
            </div>

            {/* Associations inset */}
            <div className="v3-inset mt-8 px-6 py-5">
              <p className="v3-smallcaps text-sm" style={{ color: GREEN }}>
                ❧&ensp;Associations
              </p>
              <dl className="mt-3 space-y-2 text-sm leading-relaxed">
                <div className="flex gap-3">
                  <dt className="v3-smallcaps w-28 shrink-0 opacity-75">Element</dt>
                  <dd>{card.element}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="v3-smallcaps w-28 shrink-0 opacity-75">Numerology</dt>
                  <dd>{card.numerology}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="v3-smallcaps w-28 shrink-0 opacity-75">Star</dt>
                  <dd>{card.astrology}</dd>
                </div>
              </dl>
            </div>

            {/* Strengths / Growth areas */}
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="v3-chapter-title text-xl" style={{ color: GREEN }}>
                  Strengths
                </h2>
                <div className="v3-rule-thin mt-2" />
                <ul className="mt-4 space-y-3 text-sm leading-relaxed">
                  {card.strengths.map((s) => (
                    <li key={s} className="flex gap-3">
                      <span aria-hidden className="v3-list-marker">✦</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="v3-chapter-title text-xl" style={{ color: OXBLOOD }}>
                  Growth areas
                </h2>
                <div className="v3-rule-thin mt-2" />
                <ul className="mt-4 space-y-3 text-sm leading-relaxed">
                  {card.growthAreas.map((g) => (
                    <li key={g} className="flex gap-3">
                      <span aria-hidden className="v3-list-marker">❧</span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Karmic lessons */}
            <div className="mt-10">
              <h2 className="v3-chapter-title text-center text-xl">Karmic lessons</h2>
              <p aria-hidden className="mt-2 text-center text-xs" style={{ color: OXBLOOD }}>
                ✦&ensp;✦&ensp;✦
              </p>
              <ol className="mx-auto mt-5 max-w-xl space-y-3">
                {card.karmicLessons.map((lesson, i) => (
                  <li key={lesson} className="flex items-baseline gap-4 text-sm leading-relaxed">
                    <span className="shrink-0 font-bold" style={{ color: OXBLOOD }}>
                      {toRoman(i + 1)}.
                    </span>
                    <span>{lesson}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Life purpose */}
            <div className="v3-frame mt-10">
              <Corners />
              <div className="v3-frame-inner px-6 py-7 md:px-10">
                <h2 className="v3-smallcaps text-center text-sm" style={{ color: GREEN }}>
                  ❧&ensp;Life purpose&ensp;☙
                </h2>
                <p className="v3-dropcap mt-4 leading-relaxed">
                  {card.lifePurpose}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Divider glyph="☾" />

        {/* ---------------------------------------------------------- */}
        {/* Compatible arcanas                                          */}
        {/* ---------------------------------------------------------- */}
        <section className="text-center">
          <ChapterHeading numeral={toRoman(card.number)} title="Compatible Arcanas" />
          <p className="-mt-4 mb-8 text-sm italic opacity-75">
            Those cards whose temper walketh well beside thine own.
          </p>
          <div className="mx-auto grid max-w-md grid-cols-3 gap-4 sm:gap-5">
            {kindred.map((c) => (
              <MiniTarotCard key={c.number} card={c} />
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Colophon                                                    */}
        {/* ---------------------------------------------------------- */}
        <Colophon />
      </div>
    </main>
  );
}
