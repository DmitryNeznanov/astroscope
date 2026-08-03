import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ARCANA, getArcana } from "@/lib/arcana";
import { ArcanaArt } from "@/components/arcana-art";
import {
  MiniTarotCard,
  V2_BASE_STYLES,
  ACCENT,
  INK,
  PAPER,
  RULE,
  pad,
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

const V2_DETAIL_STYLES = `
  /* The tarot card centerpiece — paper body, crisp double hairline frame */
  .v2-tarot-stack {
    position: relative;
    width: min(340px, 84vw);
    aspect-ratio: 2 / 3;
  }
  /* Faint deck-shadow stack behind — the single concession to depth */
  .v2-tarot-stack::before,
  .v2-tarot-stack::after {
    content: "";
    position: absolute;
    inset: 0;
    border: 1px solid rgba(26, 23, 20, 0.18);
    background: ${PAPER};
    pointer-events: none;
  }
  .v2-tarot-stack::before { transform: translate(7px, 7px); }
  .v2-tarot-stack::after  { transform: translate(3.5px, 3.5px); border-color: rgba(26, 23, 20, 0.28); }

  .v2-tarot-card {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5.5% 7% 5%;
    border: 1px solid ${INK};
    background: ${PAPER};
  }
  /* Inner hairline — the double frame */
  .v2-tarot-card::before {
    content: "";
    position: absolute;
    inset: 8px;
    border: 1px solid rgba(26, 23, 20, 0.3);
    pointer-events: none;
  }

  .v2-tarot-no {
    font-size: 11px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    text-indent: 0.4em;
    color: rgba(26, 23, 20, 0.65);
  }
  .v2-tarot-no::before,
  .v2-tarot-no::after {
    content: "";
    display: inline-block;
    vertical-align: middle;
    width: 34px;
    height: 1px;
    margin: 0 14px 2px;
    background: rgba(26, 23, 20, 0.35);
  }

  .v2-tarot-art {
    flex: 1;
    width: 100%;
    min-height: 0;
    margin: 4% 0;
    color: ${INK};
  }

  .v2-tarot-name {
    width: 100%;
    border-top: 1px solid rgba(26, 23, 20, 0.55);
    border-bottom: 1px solid rgba(26, 23, 20, 0.22);
    padding: 3.4% 4%;
    text-align: center;
  }
`;

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                         */
/* ------------------------------------------------------------------ */

function Section({
  index,
  title,
  children,
  className = "",
}: {
  index: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`border-t pt-5 ${className}`} style={{ borderColor: RULE }}>
      <h2 className="mb-4 flex items-baseline gap-4">
        <span
          className="text-[10px] uppercase tracking-[0.25em]"
          style={{ color: "rgba(26,23,20,0.45)" }}
        >
          {index}
        </span>
        <span
          className="text-[11px] uppercase tracking-[0.25em]"
          style={{ color: ACCENT }}
        >
          {title}
        </span>
      </h2>
      {children}
    </section>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt
        className="mb-1 text-[10px] uppercase tracking-[0.22em]"
        style={{ color: "rgba(26,23,20,0.5)" }}
      >
        {label}
      </dt>
      <dd className="v2-serif text-base">{value}</dd>
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

  const body = "rgba(26,23,20,0.78)";
  const muted = "rgba(26,23,20,0.55)";

  return (
    <main className="v2-root min-h-screen">
      <style>{V2_BASE_STYLES + V2_DETAIL_STYLES}</style>

      <div className="mx-auto max-w-6xl px-6 md:px-10">
        {/* ---------- Header + back link ---------- */}
        <header
          className="flex items-baseline justify-between border-b py-6"
          style={{ borderColor: RULE }}
        >
          <Link href="/designs/v2" className="v2-back-link text-sm tracking-[0.08em]">
            ← Calculator
          </Link>
          <span
            className="text-[11px] uppercase tracking-[0.22em]"
            style={{ color: "rgba(26,23,20,0.5)" }}
          >
            Birth Arcana Calculator — v2
          </span>
        </header>

        {/* ---------- Card + reading ---------- */}
        <div className="grid items-start gap-14 pt-14 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-20">
          {/* The card */}
          <div className="flex flex-col items-center lg:sticky lg:top-10">
            <div className="v2-tarot-stack">
              <div className="v2-tarot-card">
                <span className="v2-tarot-no">No. {card.number}</span>
                <div className="v2-tarot-art" aria-hidden="true">
                  <ArcanaArt number={card.number} />
                </div>
                <div className="v2-tarot-name">
                  <span className="v2-serif text-lg uppercase tracking-[0.18em]">
                    {card.name}
                  </span>
                </div>
              </div>
            </div>
            <p
              className="mt-8 text-[11px] uppercase tracking-[0.35em]"
              style={{ color: muted }}
            >
              {pad(card.number)} / XXII
            </p>
          </div>

          {/* The reading */}
          <div>
            <p
              className="text-[11px] uppercase tracking-[0.3em]"
              style={{ color: ACCENT }}
            >
              Your birth arcana
            </p>
            <h1 className="v2-serif mt-3 text-4xl font-normal leading-tight tracking-tight sm:text-5xl">
              {card.name}
            </h1>
            <p className="mt-4 text-sm tracking-wide" style={{ color: muted }}>
              {card.keywords.join(" · ")}
            </p>
            <p className="v2-serif mt-8 max-w-xl text-xl leading-relaxed md:text-2xl">
              {card.mission}
            </p>

            <div className="mt-10 space-y-10">
              {/* Upright / Reversed */}
              <div className="grid gap-10 md:grid-cols-2">
                <Section index="01" title="Upright">
                  <p className="text-[15px] leading-relaxed" style={{ color: body }}>
                    {card.upright}
                  </p>
                </Section>
                <Section index="02" title="Reversed">
                  <p className="text-[15px] leading-relaxed" style={{ color: body }}>
                    {card.reversed}
                  </p>
                </Section>
              </div>

              {/* Associations */}
              <Section index="03" title="Associations">
                <dl className="grid gap-8 sm:grid-cols-3">
                  <MetaItem label="Element" value={card.element} />
                  <MetaItem label="Numerology" value={card.numerology} />
                  <MetaItem label="Astrology" value={card.astrology} />
                </dl>
              </Section>

              {/* Strengths / Growth areas */}
              <div className="grid gap-10 md:grid-cols-2">
                <Section index="04" title="Strengths">
                  <ul className="space-y-3">
                    {card.strengths.map((s) => (
                      <li
                        key={s}
                        className="flex gap-3 text-[15px] leading-relaxed"
                        style={{ color: body }}
                      >
                        <span style={{ color: ACCENT }}>—</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </Section>
                <Section index="05" title="Growth areas">
                  <ul className="space-y-3">
                    {card.growthAreas.map((s) => (
                      <li
                        key={s}
                        className="flex gap-3 text-[15px] leading-relaxed"
                        style={{ color: body }}
                      >
                        <span style={{ color: ACCENT }}>—</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </Section>
              </div>

              {/* Karmic lessons */}
              <Section index="06" title="Karmic lessons">
                <ol className="space-y-3">
                  {card.karmicLessons.map((lesson, i) => (
                    <li
                      key={lesson}
                      className="flex gap-4 text-[15px] leading-relaxed"
                      style={{ color: body }}
                    >
                      <span
                        className="pt-0.5 text-xs tracking-[0.2em]"
                        style={{ color: muted }}
                      >
                        {pad(i + 1)}
                      </span>
                      {lesson}
                    </li>
                  ))}
                </ol>
              </Section>

              {/* Life purpose — pull-quote */}
              <div className="border-y py-8" style={{ borderColor: RULE }}>
                <p
                  className="text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: ACCENT }}
                >
                  Life purpose
                </p>
                <blockquote className="v2-serif mt-4 max-w-2xl text-xl italic leading-relaxed md:text-2xl">
                  “{card.lifePurpose}”
                </blockquote>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Compatible arcanas ---------- */}
        <section className="mt-16 pb-16 md:mt-20">
          <div
            className="flex items-baseline gap-6 border-b pb-5"
            style={{ borderColor: RULE }}
          >
            <span
              className="text-xs uppercase tracking-[0.25em]"
              style={{ color: ACCENT }}
            >
              07
            </span>
            <h2 className="v2-serif text-2xl font-normal tracking-tight md:text-3xl">
              Compatible Arcanas
            </h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-4">
            {card.compatibleArcanas.map((c) => (
              <MiniTarotCard key={c} card={getArcana(c)} />
            ))}
          </div>
        </section>

        {/* ---------- Footer ---------- */}
        <footer
          className="flex items-baseline justify-between border-t py-6"
          style={{ borderColor: RULE }}
        >
          <span className="v2-serif text-sm">Astro Scope</span>
          <span
            className="text-[11px] uppercase tracking-[0.22em]"
            style={{ color: "rgba(26,23,20,0.5)" }}
          >
            design variant v2 · Paper Minimal
          </span>
        </footer>
      </div>
    </main>
  );
}
