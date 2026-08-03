"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  ARCANA,
  HERMIT,
  calculateBirthArcana,
  getArcana,
} from "@/lib/arcana";
import type { ArcanaCard } from "@/lib/arcana";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const ROMAN_TABLE: Array<[number, string]> = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

function toRoman(n: number): string {
  let rest = n;
  let out = "";
  for (const [value, numeral] of ROMAN_TABLE) {
    while (rest >= value) {
      out += numeral;
      rest -= value;
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Scoped styles — every class prefixed "v3-"                          */
/* ------------------------------------------------------------------ */

const INK = "#3b2d1f";
const PARCHMENT = "#f3e9d2";
const PARCHMENT_DEEP = "#e8d9b5";
const OXBLOOD = "#6b1f1f";
const GREEN = "#2f4a33";

const V3_STYLES = `
  .v3-root {
    background-color: ${PARCHMENT};
    color: ${INK};
    font-family: "Palatino Linotype", Palatino, "Book Antiqua", Georgia, "Times New Roman", serif;
    background-image:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E"),
      radial-gradient(ellipse at 18% 8%, rgba(59, 45, 31, 0.07), transparent 55%),
      radial-gradient(ellipse at 85% 92%, rgba(107, 31, 31, 0.05), transparent 55%),
      radial-gradient(ellipse at 90% 10%, rgba(47, 74, 51, 0.04), transparent 50%),
      repeating-linear-gradient(0deg, rgba(59, 45, 31, 0.022) 0px, rgba(59, 45, 31, 0.022) 1px, transparent 1px, transparent 4px),
      repeating-linear-gradient(90deg, rgba(59, 45, 31, 0.018) 0px, rgba(59, 45, 31, 0.018) 1px, transparent 1px, transparent 5px);
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  .v3-smallcaps {
    font-variant: small-caps;
    letter-spacing: 0.14em;
  }

  /* Ornamental rules ------------------------------------------------ */
  .v3-rule-double {
    border-top: 3px double ${INK};
  }
  .v3-rule-thin {
    border-top: 1px solid rgba(59, 45, 31, 0.45);
  }
  .v3-rule-ornament {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .v3-rule-ornament::before,
  .v3-rule-ornament::after {
    content: "";
    flex: 1 1 0%;
    border-top: 1px solid rgba(59, 45, 31, 0.55);
  }

  /* Ornate manuscript frame ----------------------------------------- */
  .v3-frame {
    position: relative;
    border: 1px solid ${INK};
    padding: 7px;
    background: rgba(232, 217, 181, 0.55);
    box-shadow: 0 1px 0 rgba(255, 250, 235, 0.6), 0 14px 30px -18px rgba(59, 45, 31, 0.55);
  }
  .v3-frame-inner {
    border: 3px double ${INK};
    background:
      radial-gradient(ellipse at 50% 0%, rgba(255, 250, 235, 0.65), transparent 70%),
      rgba(243, 233, 210, 0.6);
  }
  .v3-corner {
    position: absolute;
    width: 1.35rem;
    height: 1.35rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    line-height: 1;
    color: ${OXBLOOD};
    background: ${PARCHMENT};
    pointer-events: none;
  }
  .v3-corner-tl { top: -0.62rem; left: -0.62rem; }
  .v3-corner-tr { top: -0.62rem; right: -0.62rem; }
  .v3-corner-bl { bottom: -0.62rem; left: -0.62rem; }
  .v3-corner-br { bottom: -0.62rem; right: -0.62rem; }

  /* Typography flourishes ------------------------------------------- */
  .v3-nameplate {
    font-size: clamp(2.6rem, 7vw, 4.5rem);
    line-height: 1.05;
    letter-spacing: 0.04em;
    text-shadow: 0 1px 0 rgba(255, 250, 235, 0.7);
  }
  .v3-chapter-title {
    font-variant: small-caps;
    letter-spacing: 0.1em;
  }
  .v3-dropcap::first-letter {
    float: left;
    font-size: 3.4em;
    line-height: 0.82;
    padding: 0.06em 0.14em 0 0;
    color: ${OXBLOOD};
    font-weight: 700;
  }
  .v3-initial {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 3.4rem;
    height: 3.4rem;
    border: 3px double ${OXBLOOD};
    color: ${OXBLOOD};
    font-size: 1.6rem;
    font-weight: 700;
    background: rgba(107, 31, 31, 0.06);
  }

  /* Form elements ---------------------------------------------------- */
  .v3-field-label {
    font-variant: small-caps;
    letter-spacing: 0.18em;
    font-size: 0.85rem;
  }
  .v3-input {
    width: 100%;
    background: rgba(255, 250, 235, 0.55);
    border: 1px solid ${INK};
    box-shadow: inset 0 0 0 1px ${PARCHMENT}, inset 0 2px 6px rgba(59, 45, 31, 0.18);
    color: ${INK};
    font-family: inherit;
    font-size: 1.15rem;
    text-align: center;
    padding: 0.55rem 0.5rem;
    border-radius: 0;
    outline: none;
    appearance: textfield;
    -moz-appearance: textfield;
  }
  .v3-input::-webkit-outer-spin-button,
  .v3-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .v3-input:focus {
    border-color: ${OXBLOOD};
    box-shadow: inset 0 0 0 1px ${PARCHMENT}, inset 0 2px 6px rgba(59, 45, 31, 0.18), 0 0 0 2px rgba(107, 31, 31, 0.28);
  }
  .v3-input::placeholder {
    color: rgba(59, 45, 31, 0.4);
    font-style: italic;
  }

  .v3-button {
    display: inline-block;
    background: ${INK};
    color: ${PARCHMENT};
    font-variant: small-caps;
    letter-spacing: 0.16em;
    font-size: 1.05rem;
    padding: 0.7rem 2.2rem;
    border: 1px solid ${INK};
    box-shadow: inset 0 0 0 1px ${PARCHMENT}, inset 0 0 0 3px ${INK};
    cursor: pointer;
    transition: background-color 180ms ease, color 180ms ease, box-shadow 180ms ease;
  }
  .v3-button:hover {
    background: ${OXBLOOD};
    border-color: ${OXBLOOD};
    box-shadow: inset 0 0 0 1px ${PARCHMENT}, inset 0 0 0 3px ${OXBLOOD};
  }
  .v3-button:active {
    transform: translateY(1px);
  }

  .v3-notice {
    border: 1px solid ${OXBLOOD};
    background: rgba(107, 31, 31, 0.08);
    color: ${OXBLOOD};
    box-shadow: inset 0 0 0 1px rgba(243, 233, 210, 0.8);
  }

  /* Bordered inset note ---------------------------------------------- */
  .v3-inset {
    border: 1px solid rgba(59, 45, 31, 0.65);
    box-shadow: inset 0 0 0 1px ${PARCHMENT}, inset 0 0 0 4px rgba(59, 45, 31, 0.28);
    background: rgba(232, 217, 181, 0.5);
  }

  /* Tarot plate ------------------------------------------------------- */
  .v3-plate {
    border: 1px solid ${INK};
    box-shadow: inset 0 0 0 1px ${PARCHMENT}, inset 0 0 0 5px ${INK}, inset 0 0 0 6px ${PARCHMENT};
    background:
      radial-gradient(ellipse at 50% 0%, rgba(255, 250, 235, 0.7), transparent 65%),
      ${PARCHMENT_DEEP};
  }
  .v3-plate-roman {
    font-size: clamp(2.4rem, 6vw, 3.4rem);
    color: ${OXBLOOD};
    line-height: 1;
  }

  /* Compendium index --------------------------------------------------- */
  .v3-index-row {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    width: 100%;
    text-align: left;
    padding: 0.55rem 0.35rem;
    border-bottom: 1px solid rgba(59, 45, 31, 0.3);
    background: transparent;
    cursor: pointer;
    color: inherit;
    font-family: inherit;
    transition: background-color 150ms ease, padding-left 150ms ease;
  }
  .v3-index-row:hover {
    background: rgba(107, 31, 31, 0.07);
    padding-left: 0.75rem;
  }
  .v3-index-row:focus-visible {
    outline: 2px solid ${OXBLOOD};
    outline-offset: -2px;
  }

  /* Annotated plates (upright / reversed) ------------------------------ */
  .v3-annotated {
    border: 1px solid rgba(59, 45, 31, 0.7);
    background: rgba(255, 250, 235, 0.4);
    box-shadow: inset 0 0 0 1px ${PARCHMENT}, inset 0 0 0 4px rgba(59, 45, 31, 0.22);
  }
  .v3-annotated-heading {
    border-bottom: 1px solid rgba(59, 45, 31, 0.5);
  }

  .v3-chip {
    display: inline-block;
    border: 1px solid ${GREEN};
    color: ${GREEN};
    padding: 0.2rem 0.8rem;
    font-variant: small-caps;
    letter-spacing: 0.1em;
    box-shadow: inset 0 0 0 1px ${PARCHMENT}, inset 0 0 0 3px rgba(47, 74, 51, 0.35);
  }

  .v3-list-marker {
    color: ${OXBLOOD};
  }
`;

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                         */
/* ------------------------------------------------------------------ */

function Corners() {
  return (
    <>
      <span aria-hidden className="v3-corner v3-corner-tl">✦</span>
      <span aria-hidden className="v3-corner v3-corner-tr">✦</span>
      <span aria-hidden className="v3-corner v3-corner-bl">✦</span>
      <span aria-hidden className="v3-corner v3-corner-br">✦</span>
    </>
  );
}

function ChapterHeading({ numeral, title }: { numeral: string; title: string }) {
  return (
    <div className="mb-8 text-center">
      <p className="v3-rule-ornament v3-smallcaps text-sm opacity-80">
        <span>❧</span>
        <span>Caput {numeral}</span>
        <span>☙</span>
      </p>
      <h2 className="v3-chapter-title mt-3 text-3xl md:text-4xl">{title}</h2>
      <p aria-hidden className="mt-3 text-sm" style={{ color: OXBLOOD }}>
        ✦&ensp;✦&ensp;✦
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function DesignsV3Page() {
  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ArcanaCard | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  function reveal(card: ArcanaCard) {
    setResult(card);
    requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const d = Number(day);
    const m = Number(month);
    const y = Number(year);

    if (!/^\d{1,2}$/.test(day.trim()) || d < 1 || d > 31) {
      setError("The day (Dies) must be a number betwixt 1 and 31.");
      return;
    }
    if (!/^\d{1,2}$/.test(month.trim()) || m < 1 || m > 12) {
      setError("The month (Mensis) must be a number betwixt 1 and 12.");
      return;
    }
    if (!/^\d{4}$/.test(year.trim())) {
      setError("The year (Annus) must be written in full — four digits, as 1990.");
      return;
    }
    setError(null);
    reveal(getArcana(calculateBirthArcana(d, m, y)));
  }

  const compatible = HERMIT.compatibleArcanas.map((n) => getArcana(n));

  return (
    <main className="v3-root min-h-screen px-4 py-10 md:px-8 md:py-14">
      <style>{V3_STYLES}</style>

      <div className="mx-auto max-w-3xl">
        {/* ---------------------------------------------------------- */}
        {/* 1. Masthead                                                 */}
        {/* ---------------------------------------------------------- */}
        <header className="text-center">
          <div className="v3-rule-double" />
          <div className="v3-rule-thin mt-[3px]" />
          <p className="v3-smallcaps mt-5 text-xs opacity-75">
            Being a faithful instrument of tarot numerology · Anno MMXXVI
          </p>
          <h1 className="v3-nameplate mt-3 font-bold">
            <span aria-hidden className="mr-4 align-middle text-2xl" style={{ color: OXBLOOD }}>❦</span>
            Astro&nbsp;Scope
            <span aria-hidden className="ml-4 align-middle text-2xl" style={{ color: OXBLOOD }}>❧</span>
          </h1>
          <p className="v3-smallcaps mt-3 text-base opacity-90">
            Birth Arcana Calculator · Vol. III
          </p>
          <p className="v3-rule-ornament mt-6 text-lg" aria-hidden>
            <span style={{ color: OXBLOOD }}>✦</span>
          </p>
        </header>

        {/* ---------------------------------------------------------- */}
        {/* 2. Calculator panel                                         */}
        {/* ---------------------------------------------------------- */}
        <section className="mt-10">
          <div className="v3-frame">
            <Corners />
            <div className="v3-frame-inner px-6 py-8 md:px-10">
              <p className="v3-smallcaps text-center text-sm opacity-80">
                Inscribe thy date of birth, good reader
              </p>
              <form onSubmit={handleSubmit} className="mt-6" noValidate>
                <div className="grid grid-cols-3 gap-3 md:gap-5">
                  <label className="block text-center">
                    <span className="v3-field-label block">Dies</span>
                    <span className="block text-xs italic opacity-60">day</span>
                    <input
                      className="v3-input mt-2"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={31}
                      placeholder="14"
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      aria-label="Day of birth"
                    />
                  </label>
                  <label className="block text-center">
                    <span className="v3-field-label block">Mensis</span>
                    <span className="block text-xs italic opacity-60">month</span>
                    <input
                      className="v3-input mt-2"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={12}
                      placeholder="7"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      aria-label="Month of birth"
                    />
                  </label>
                  <label className="block text-center">
                    <span className="v3-field-label block">Annus</span>
                    <span className="block text-xs italic opacity-60">year</span>
                    <input
                      className="v3-input mt-2"
                      type="number"
                      inputMode="numeric"
                      min={1000}
                      max={9999}
                      placeholder="1990"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      aria-label="Year of birth"
                    />
                  </label>
                </div>

                {error && (
                  <p className="v3-notice mt-5 px-4 py-3 text-center text-sm italic" role="alert">
                    ☞&ensp;{error}
                  </p>
                )}

                <div className="mt-7 text-center">
                  <button type="submit" className="v3-button">
                    ✦&ensp;Divine thine Arcana&ensp;✦
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* 3. Result panel                                             */}
        {/* ---------------------------------------------------------- */}
        <section ref={resultRef} className="mt-12 scroll-mt-8">
          {result === null ? (
            <div className="v3-inset px-6 py-10 text-center">
              <p aria-hidden className="text-2xl" style={{ color: OXBLOOD }}>☾</p>
              <p className="v3-smallcaps mt-3 text-sm opacity-75">
                Awaiting the stars…
              </p>
              <p className="mt-2 text-sm italic opacity-70">
                The plate below remaineth blank until thy numbers are divined above.
              </p>
            </div>
          ) : (
            <div className="v3-frame">
              <Corners />
              <div className="v3-plate px-6 py-10 text-center md:px-12">
                <p className="v3-smallcaps text-xs opacity-70">Thy birth arcana is revealed</p>
                <p className="v3-plate-roman mt-4 font-bold">{toRoman(result.number)}</p>
                <p aria-hidden className="mt-2 text-sm" style={{ color: OXBLOOD }}>✦</p>
                <h2 className="v3-chapter-title mt-3 text-3xl md:text-4xl">{result.name}</h2>
                <p className="mt-4 text-sm italic opacity-85">
                  {result.keywords.map((k) => k).join("  ·  ")}
                </p>
                <div className="v3-rule-ornament mx-auto mt-6 max-w-xs text-xs" aria-hidden>
                  <span style={{ color: OXBLOOD }}>❧</span>
                </div>
                <p className="v3-dropcap mx-auto mt-6 max-w-xl text-left leading-relaxed">
                  {result.mission}
                </p>
                <p className="v3-smallcaps mt-7 text-sm">
                  <span style={{ color: GREEN }}>Element — {result.element}</span>
                  <span aria-hidden className="mx-3 opacity-50">·</span>
                  <span style={{ color: OXBLOOD }}>Star — {result.astrology}</span>
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ---------------------------------------------------------- */}
        {/* 4. What is Birth Arcana?                                    */}
        {/* ---------------------------------------------------------- */}
        <section className="mt-16">
          <ChapterHeading numeral="I" title="What is Birth Arcana?" />
          <div className="space-y-5 leading-relaxed">
            <p className="v3-dropcap">
              Among the twenty-two trump cards of the tarot — the Major Arcana, as the
              old cartomancers named them — each soul is said to carry one as its natal
              card, fixed at the very hour of birth. This birth arcana is no fortune
              told and withdrawn; it is a companion for the whole of life, a lantern
              held over one&rsquo;s talents, trials, and peculiar way of walking the world.
            </p>
            <p>
              Where the astrologer looks to the wandering planets, the numerologist of
              the tarot looks to the date itself. The digits of the day, the month, and
              the year are gathered together and distilled, as an alchemist reduces a
              tincture, until a single number between one and twenty-two remains. That
              number names the arcana under whose aspect thou wert born.
            </p>
            <p>
              To know thine arcana is to hold a small mirror of polished brass: it
              shews the mission thy nature inclines toward, the element that feeds thy
              fire, and the star whose temper colours thy days.
            </p>
          </div>
          <aside className="v3-inset mt-8 px-6 py-5">
            <p className="v3-smallcaps text-sm" style={{ color: GREEN }}>
              ❧&ensp;How it is calculated
            </p>
            <p className="mt-3 text-sm leading-relaxed">
              Sum every digit of the birth date — day, month, and year alike. If the
              tally exceedeth twenty-two, sum its digits again, and again, until a
              number from 1 to 22 remaineth. The number 22 is never reduced further:
              it is kept whole, and signifieth <em>The Fool</em>, the soul at the
              threshold of every beginning.
            </p>
          </aside>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* 5. The Compendium                                           */}
        {/* ---------------------------------------------------------- */}
        <section className="mt-16">
          <ChapterHeading numeral="II" title="The Compendium" />
          <p className="mb-6 text-center text-sm italic opacity-75">
            An index of the twenty-two major arcana. Touch any entry, and its plate
            shall be shewn above.
          </p>
          <div className="v3-frame">
            <Corners />
            <div className="v3-frame-inner px-5 py-4 md:px-8">
              <ol>
                {ARCANA.map((card) => (
                  <li key={card.number}>
                    <button
                      type="button"
                      className="v3-index-row"
                      onClick={() => reveal(card)}
                    >
                      <span
                        className="w-10 shrink-0 text-right font-bold"
                        style={{ color: OXBLOOD }}
                      >
                        {toRoman(card.number)}
                      </span>
                      <span className="v3-smallcaps flex-1 text-base md:text-lg">
                        {card.name}
                      </span>
                      <span className="text-sm italic opacity-65">
                        {card.keywords[0]}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* 6. The Hermit deep-dive                                     */}
        {/* ---------------------------------------------------------- */}
        <section className="mt-16">
          <ChapterHeading numeral="III" title={`The Hermit · ${toRoman(HERMIT.number)}`} />

          <div className="text-center">
            <span className="v3-initial">{toRoman(HERMIT.number)}</span>
            <p className="mt-4 text-sm italic opacity-85">
              {HERMIT.keywords.join("  ·  ")}
            </p>
          </div>

          <p className="v3-dropcap mt-8 leading-relaxed">
            {HERMIT.lifePurpose}
          </p>

          {/* Upright / Reversed annotated plates */}
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <article className="v3-annotated">
              <h3 className="v3-annotated-heading v3-smallcaps px-5 py-3 text-base" style={{ color: GREEN }}>
                ❧&ensp;Upright
              </h3>
              <p className="px-5 py-4 text-sm leading-relaxed">{HERMIT.upright}</p>
            </article>
            <article className="v3-annotated">
              <h3 className="v3-annotated-heading v3-smallcaps px-5 py-3 text-base" style={{ color: OXBLOOD }}>
                ☙&ensp;Reversed
              </h3>
              <p className="px-5 py-4 text-sm leading-relaxed">{HERMIT.reversed}</p>
            </article>
          </div>

          {/* Associations */}
          <div className="v3-inset mt-8 px-6 py-5">
            <p className="v3-smallcaps text-sm" style={{ color: GREEN }}>
              ❧&ensp;Associations
            </p>
            <dl className="mt-3 space-y-2 text-sm leading-relaxed">
              <div className="flex gap-3">
                <dt className="v3-smallcaps w-28 shrink-0 opacity-75">Element</dt>
                <dd>{HERMIT.element}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="v3-smallcaps w-28 shrink-0 opacity-75">Numerology</dt>
                <dd>{HERMIT.numerology}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="v3-smallcaps w-28 shrink-0 opacity-75">Star</dt>
                <dd>{HERMIT.astrology}</dd>
              </div>
            </dl>
          </div>

          {/* Strengths / Growth areas */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="v3-chapter-title text-xl" style={{ color: GREEN }}>
                Strengths
              </h3>
              <div className="v3-rule-thin mt-2" />
              <ul className="mt-4 space-y-3 text-sm leading-relaxed">
                {HERMIT.strengths.map((s) => (
                  <li key={s} className="flex gap-3">
                    <span aria-hidden className="v3-list-marker">✦</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="v3-chapter-title text-xl" style={{ color: OXBLOOD }}>
                Growth areas
              </h3>
              <div className="v3-rule-thin mt-2" />
              <ul className="mt-4 space-y-3 text-sm leading-relaxed">
                {HERMIT.growthAreas.map((g) => (
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
            <h3 className="v3-chapter-title text-center text-xl">Karmic lessons</h3>
            <p aria-hidden className="mt-2 text-center text-xs" style={{ color: OXBLOOD }}>
              ✦&ensp;✦&ensp;✦
            </p>
            <ol className="mx-auto mt-5 max-w-xl space-y-3">
              {HERMIT.karmicLessons.map((lesson, i) => (
                <li key={lesson} className="flex items-baseline gap-4 text-sm leading-relaxed">
                  <span className="shrink-0 font-bold" style={{ color: OXBLOOD }}>
                    {toRoman(i + 1)}.
                  </span>
                  <span>{lesson}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Compatible arcanas */}
          <div className="mt-10 text-center">
            <h3 className="v3-chapter-title text-xl">Compatible arcanas</h3>
            <p className="mt-2 text-sm italic opacity-70">
              Those cards whose temper walketh well beside the Hermit&rsquo;s lantern.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              {compatible.map((card) => (
                <button
                  key={card.number}
                  type="button"
                  className="v3-chip cursor-pointer bg-transparent font-[inherit] text-sm"
                  onClick={() => reveal(card)}
                >
                  {toRoman(card.number)} · {card.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* 7. Colophon                                                 */}
        {/* ---------------------------------------------------------- */}
        <footer className="mt-20 text-center">
          <p className="v3-rule-ornament text-sm" aria-hidden>
            <span style={{ color: OXBLOOD }}>❦</span>
          </p>
          <p aria-hidden className="mt-6 text-lg tracking-[0.5em]" style={{ color: OXBLOOD }}>
            ✦&ensp;❧&ensp;✦
          </p>
          <p className="v3-smallcaps mt-5 text-sm opacity-80">
            Astro Scope — design variant v3 · Vintage Grimoire
          </p>
          <p className="mt-2 text-xs italic opacity-60">
            Set in old-style serif upon aged parchment · Finis coronat opus
          </p>
          <div className="v3-rule-thin mt-6" />
          <div className="v3-rule-double mt-[3px]" />
        </footer>
      </div>
    </main>
  );
}
