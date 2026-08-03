"use client";

import { FormEvent, useRef, useState } from "react";
import {
  ARCANA,
  HERMIT,
  ArcanaCard,
  calculateBirthArcana,
  getArcana,
} from "@/lib/arcana";

/* ------------------------------------------------------------------ */
/* Design tokens (system font stacks only)                             */
/* ------------------------------------------------------------------ */

const SERIF = 'Georgia, "Times New Roman", "Nimbus Roman", serif';
const SANS =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif';

const PAPER = "#faf9f6";
const INK = "#1a1714";
const ACCENT = "#b3402a";
const RULE = "rgba(26, 23, 20, 0.16)";

/* ------------------------------------------------------------------ */
/* Scoped styles (all class names prefixed "v2-")                      */
/* ------------------------------------------------------------------ */

const V2_STYLES = `
  .v2-root {
    background: ${PAPER};
    color: ${INK};
    font-family: ${SANS};
    -webkit-font-smoothing: antialiased;
  }
  .v2-serif { font-family: ${SERIF}; }

  .v2-arcana-row {
    transition: background-color 160ms ease;
  }
  .v2-arcana-row:hover { background: rgba(179, 64, 42, 0.05); }
  .v2-arcana-row:hover .v2-arcana-name { color: ${ACCENT}; }
  .v2-arcana-row .v2-arcana-name { transition: color 160ms ease; }

  .v2-field {
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(26, 23, 20, 0.55);
    border-radius: 0;
    font-family: ${SERIF};
    color: ${INK};
    outline: none;
    padding: 0 0 6px;
    caret-color: ${ACCENT};
    transition: border-color 160ms ease;
  }
  .v2-field::placeholder { color: rgba(26, 23, 20, 0.32); }
  .v2-field:focus { border-bottom-color: ${ACCENT}; }
  .v2-field::-webkit-outer-spin-button,
  .v2-field::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .v2-field[type="number"] { -moz-appearance: textfield; appearance: textfield; }

  .v2-calc-btn {
    transition: background-color 160ms ease, color 160ms ease;
  }
  .v2-calc-btn:hover {
    background: ${ACCENT};
    border-color: ${ACCENT};
  }

  .v2-select-btn {
    border-bottom: 1px solid rgba(26, 23, 20, 0.4);
    transition: color 160ms ease, border-color 160ms ease;
  }
  .v2-select-btn:hover {
    color: ${ACCENT};
    border-bottom-color: ${ACCENT};
  }

  @media (prefers-reduced-motion: reduce) {
    .v2-root * { transition: none !important; }
  }
`;

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                         */
/* ------------------------------------------------------------------ */

function SectionHeading({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-baseline gap-6 border-b pb-5" style={{ borderColor: RULE }}>
      <span
        className="text-xs tracking-[0.25em] uppercase"
        style={{ color: ACCENT }}
      >
        {index}
      </span>
      <h2 className="v2-serif text-2xl md:text-3xl font-normal tracking-tight">
        {title}
      </h2>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.22em] mb-1" style={{ color: "rgba(26,23,20,0.5)" }}>
        {label}
      </dt>
      <dd className="v2-serif text-base">{value}</dd>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function DesignsV2Page() {
  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<ArcanaCard | null>(null);

  const resultRef = useRef<HTMLDivElement | null>(null);

  function reveal(card: ArcanaCard) {
    setResult(card);
    requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleCalculate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    if (!day || !month || !year) {
      setError("Please fill in all three fields — day, month and year.");
      return;
    }
    if (Number.isNaN(d) || d < 1 || d > 31) {
      setError("Day must be a number between 1 and 31.");
      return;
    }
    if (Number.isNaN(m) || m < 1 || m > 12) {
      setError("Month must be a number between 1 and 12.");
      return;
    }
    if (Number.isNaN(y) || year.length !== 4) {
      setError("Year must be a four-digit number, e.g. 1990.");
      return;
    }

    setError("");
    reveal(getArcana(calculateBirthArcana(d, m, y)));
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <main className="v2-root min-h-screen">
      <style>{V2_STYLES}</style>

      <div className="mx-auto max-w-5xl px-6 md:px-10">
        {/* ---------- 1. Header ---------- */}
        <header
          className="flex items-baseline justify-between py-6 border-b"
          style={{ borderColor: RULE }}
        >
          <span className="v2-serif text-lg tracking-tight">Astro Scope</span>
          <span
            className="text-[11px] uppercase tracking-[0.22em]"
            style={{ color: "rgba(26,23,20,0.5)" }}
          >
            Birth Arcana Calculator — v2
          </span>
        </header>

        {/* ---------- 2. Hero + calculator ---------- */}
        <section className="pt-16 md:pt-24 pb-16">
          <p
            className="text-[11px] uppercase tracking-[0.3em] mb-8"
            style={{ color: ACCENT }}
          >
            Tarot numerology
          </p>
          <h1 className="v2-serif font-normal tracking-tight leading-[0.95] text-[13vw] md:text-[7.5rem]">
            Birth Arcana
            <br />
            Calculator
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed" style={{ color: "rgba(26,23,20,0.72)" }}>
            Your birth date reduces to one of the twenty-two Major Arcana — a
            card that describes the theme your life keeps returning to.
          </p>

          <form onSubmit={handleCalculate} className="mt-14 max-w-2xl">
            <div className="flex items-end gap-6 md:gap-10">
              <label className="flex flex-col gap-2 flex-1">
                <span className="text-[10px] uppercase tracking-[0.22em]" style={{ color: "rgba(26,23,20,0.5)" }}>
                  Day
                </span>
                <input
                  className="v2-field w-full text-3xl md:text-4xl"
                  type="number"
                  inputMode="numeric"
                  placeholder="14"
                  min={1}
                  max={31}
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-2 flex-1">
                <span className="text-[10px] uppercase tracking-[0.22em]" style={{ color: "rgba(26,23,20,0.5)" }}>
                  Month
                </span>
                <input
                  className="v2-field w-full text-3xl md:text-4xl"
                  type="number"
                  inputMode="numeric"
                  placeholder="09"
                  min={1}
                  max={12}
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-2 flex-1">
                <span className="text-[10px] uppercase tracking-[0.22em]" style={{ color: "rgba(26,23,20,0.5)" }}>
                  Year
                </span>
                <input
                  className="v2-field w-full text-3xl md:text-4xl"
                  type="number"
                  inputMode="numeric"
                  placeholder="1990"
                  min={1000}
                  max={9999}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </label>
              <button
                type="submit"
                className="v2-calc-btn shrink-0 border px-6 py-3 text-[11px] uppercase tracking-[0.25em]"
                style={{ borderColor: INK, background: INK, color: PAPER }}
              >
                Calculate
              </button>
            </div>
            {error ? (
              <p className="mt-4 text-sm" style={{ color: ACCENT }} role="alert">
                {error}
              </p>
            ) : (
              <p className="mt-4 text-xs" style={{ color: "rgba(26,23,20,0.4)" }}>
                Calculated in your browser — nothing is stored or sent anywhere.
              </p>
            )}
          </form>
        </section>

        {/* ---------- 3. Result ---------- */}
        <section
          ref={resultRef}
          className="border-t border-b py-12 md:py-16 scroll-mt-6"
          style={{ borderColor: RULE }}
          aria-live="polite"
        >
          {result ? (
            <div className="grid md:grid-cols-[auto_1fr] gap-10 md:gap-16 items-start">
              <div>
                <div className="text-[11px] uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
                  No. {result.number}
                </div>
                <div className="v2-serif font-normal leading-none text-[6.5rem] md:text-[10rem] tracking-tight mt-2">
                  {pad(result.number)}
                  <span className="text-[2rem] md:text-[3rem] align-top" style={{ color: "rgba(26,23,20,0.35)" }}>
                    {" "}/ XXII
                  </span>
                </div>
              </div>
              <div className="md:pt-10">
                <h3 className="v2-serif text-4xl md:text-6xl font-normal tracking-tight leading-none">
                  {result.name}
                </h3>
                <p className="mt-4 text-sm tracking-wide" style={{ color: "rgba(26,23,20,0.6)" }}>
                  {result.keywords.join(" · ")}
                </p>
                <p className="v2-serif mt-8 text-xl md:text-2xl leading-relaxed max-w-xl">
                  {result.mission}
                </p>
                <dl className="mt-10 flex gap-12 border-t pt-6" style={{ borderColor: RULE }}>
                  <MetaItem label="Element" value={result.element} />
                  <MetaItem label="Astrology" value={result.astrology} />
                  <MetaItem label="Arcana" value={`${pad(result.number)} / 22`} />
                </dl>
              </div>
            </div>
          ) : (
            <p className="text-sm" style={{ color: "rgba(26,23,20,0.45)" }}>
              Your arcana will appear here once you enter a birth date above —
              or pick a card from the index in section 02.
            </p>
          )}
        </section>

        {/* ---------- 4. What is Birth Arcana? (01) ---------- */}
        <section className="py-16 md:py-24">
          <SectionHeading index="01" title="What is Birth Arcana?" />
          <div className="mt-10 grid md:grid-cols-2 gap-10 md:gap-16">
            <div className="space-y-5 text-[15px] leading-relaxed" style={{ color: "rgba(26,23,20,0.78)" }}>
              <p>
                Birth Arcana comes from tarot numerology: every birth date
                reduces to a single Major Arcana card, and that card is read as
                the central theme of a life — the lesson you keep meeting in
                different disguises.
              </p>
              <p>
                The Major Arcana are the twenty-two archetypal cards of the
                tarot, from The Magician to The Fool. Where a horoscope looks
                at the sky at the moment of birth, Birth Arcana looks only at
                the numbers of the date itself.
              </p>
              <p>
                It is not a prediction. It is a lens: a concise description of
                your default strengths, your recurring blind spots, and the
                direction your growth tends to point.
              </p>
            </div>
            <div>
              <div className="border-t pt-6" style={{ borderColor: RULE }}>
                <h3 className="text-[11px] uppercase tracking-[0.25em] mb-4" style={{ color: ACCENT }}>
                  How it&rsquo;s calculated
                </h3>
                <p className="text-[15px] leading-relaxed" style={{ color: "rgba(26,23,20,0.78)" }}>
                  Sum every digit of the full birth date — day, month and year.
                  If the total is greater than 22, sum its digits again, and
                  repeat until the result falls between 1 and 22.
                </p>
                <p className="v2-serif mt-6 text-lg leading-relaxed">
                  14 · 09 · 1990 → 1+4+0+9+1+9+9+0 = 33 → 3+3 = 6 — The Lovers.
                  A final total of 22 is kept as The Fool.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- 5. Explore all 22 (02) ---------- */}
        <section className="pb-16 md:pb-24">
          <SectionHeading index="02" title="Explore All Birth Arcanas" />
          <ol className="mt-2">
            {ARCANA.map((card) => (
              <li key={card.number}>
                <button
                  type="button"
                  onClick={() => reveal(card)}
                  className="v2-arcana-row w-full flex items-baseline gap-6 md:gap-10 py-4 border-b text-left px-2 -mx-2"
                  style={{ borderColor: RULE }}
                >
                  <span
                    className="w-12 shrink-0 text-xs tracking-[0.2em]"
                    style={{
                      color:
                        result?.number === card.number
                          ? ACCENT
                          : "rgba(26,23,20,0.45)",
                    }}
                  >
                    {pad(card.number)}
                  </span>
                  <span className="v2-arcana-name v2-serif text-xl md:text-2xl font-normal tracking-tight">
                    {card.name}
                  </span>
                  <span
                    className="ml-auto text-xs md:text-sm"
                    style={{ color: "rgba(26,23,20,0.5)" }}
                  >
                    {card.keywords[0]}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs" style={{ color: "rgba(26,23,20,0.4)" }}>
            Select a card to display it in the result panel above.
          </p>
        </section>

        {/* ---------- 6. The Hermit deep-dive (03) ---------- */}
        <section className="pb-16 md:pb-24">
          <SectionHeading index="03" title="In Focus — The Hermit" />

          <div className="mt-12 grid md:grid-cols-[auto_1fr] gap-10 md:gap-16">
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
                No. {HERMIT.number}
              </div>
              <div className="v2-serif font-normal leading-none text-[5.5rem] md:text-[8rem] tracking-tight mt-2">
                {pad(HERMIT.number)}
              </div>
              <p className="mt-6 max-w-[16rem] text-sm tracking-wide" style={{ color: "rgba(26,23,20,0.6)" }}>
                {HERMIT.keywords.join(" · ")}
              </p>
            </div>

            <div className="space-y-12">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="border-t pt-5" style={{ borderColor: RULE }}>
                  <h3 className="text-[11px] uppercase tracking-[0.25em] mb-3" style={{ color: ACCENT }}>
                    Upright
                  </h3>
                  <p className="text-[15px] leading-relaxed" style={{ color: "rgba(26,23,20,0.78)" }}>
                    {HERMIT.upright}
                  </p>
                </div>
                <div className="border-t pt-5" style={{ borderColor: RULE }}>
                  <h3 className="text-[11px] uppercase tracking-[0.25em] mb-3" style={{ color: ACCENT }}>
                    Reversed
                  </h3>
                  <p className="text-[15px] leading-relaxed" style={{ color: "rgba(26,23,20,0.78)" }}>
                    {HERMIT.reversed}
                  </p>
                </div>
              </div>

              <div className="border-t pt-5" style={{ borderColor: RULE }}>
                <h3 className="text-[11px] uppercase tracking-[0.25em] mb-4" style={{ color: ACCENT }}>
                  Associations
                </h3>
                <dl className="grid sm:grid-cols-3 gap-8">
                  <MetaItem label="Element" value={HERMIT.element} />
                  <MetaItem label="Numerology" value={HERMIT.numerology} />
                  <MetaItem label="Astrology" value={HERMIT.astrology} />
                </dl>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="border-t pt-5" style={{ borderColor: RULE }}>
                  <h3 className="text-[11px] uppercase tracking-[0.25em] mb-4" style={{ color: ACCENT }}>
                    Strengths
                  </h3>
                  <ul className="space-y-3">
                    {HERMIT.strengths.map((s) => (
                      <li key={s} className="flex gap-3 text-[15px] leading-relaxed" style={{ color: "rgba(26,23,20,0.78)" }}>
                        <span style={{ color: ACCENT }}>—</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t pt-5" style={{ borderColor: RULE }}>
                  <h3 className="text-[11px] uppercase tracking-[0.25em] mb-4" style={{ color: ACCENT }}>
                    Growth areas
                  </h3>
                  <ul className="space-y-3">
                    {HERMIT.growthAreas.map((s) => (
                      <li key={s} className="flex gap-3 text-[15px] leading-relaxed" style={{ color: "rgba(26,23,20,0.78)" }}>
                        <span style={{ color: ACCENT }}>—</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t pt-5" style={{ borderColor: RULE }}>
                <h3 className="text-[11px] uppercase tracking-[0.25em] mb-4" style={{ color: ACCENT }}>
                  Karmic lessons
                </h3>
                <ol className="space-y-3">
                  {HERMIT.karmicLessons.map((lesson, i) => (
                    <li key={lesson} className="flex gap-4 text-[15px] leading-relaxed" style={{ color: "rgba(26,23,20,0.78)" }}>
                      <span className="text-xs tracking-[0.2em] pt-0.5" style={{ color: "rgba(26,23,20,0.45)" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {lesson}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="border-t pt-5" style={{ borderColor: RULE }}>
                <h3 className="text-[11px] uppercase tracking-[0.25em] mb-4" style={{ color: ACCENT }}>
                  Life purpose
                </h3>
                <p className="v2-serif text-xl md:text-2xl leading-relaxed max-w-2xl">
                  {HERMIT.lifePurpose}
                </p>
              </div>

              <div className="border-t pt-5" style={{ borderColor: RULE }}>
                <h3 className="text-[11px] uppercase tracking-[0.25em] mb-4" style={{ color: ACCENT }}>
                  Compatible arcanas
                </h3>
                <div className="flex flex-wrap gap-x-10 gap-y-4">
                  {HERMIT.compatibleArcanas.map((n) => {
                    const card = getArcana(n);
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => reveal(card)}
                        className="v2-select-btn text-left pb-1"
                      >
                        <span className="text-xs tracking-[0.2em] mr-3" style={{ color: "rgba(26,23,20,0.45)" }}>
                          {pad(n)}
                        </span>
                        <span className="v2-serif text-lg">{card.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- 7. Footer ---------- */}
        <footer
          className="flex items-baseline justify-between py-6 border-t"
          style={{ borderColor: RULE }}
        >
          <span className="v2-serif text-sm">Astro Scope</span>
          <span className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "rgba(26,23,20,0.5)" }}>
            design variant v2 · Paper Minimal
          </span>
        </footer>
      </div>
    </main>
  );
}
