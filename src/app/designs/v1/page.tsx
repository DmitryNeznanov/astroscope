"use client";

import { FormEvent, useState } from "react";
import {
  ARCANA,
  HERMIT,
  ArcanaCard,
  calculateBirthArcana,
  getArcana,
} from "@/lib/arcana";

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

const SERIF = 'Georgia, "Times New Roman", "Nimbus Roman", serif';
const SANS =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif';

/* ------------------------------------------------------------------ */
/* Scoped styles (all class names prefixed "v1-")                      */
/* ------------------------------------------------------------------ */

const V1_STYLES = `
  .v1-root {
    background:
      radial-gradient(1200px 700px at 50% -10%, rgba(88, 70, 160, 0.16), transparent 65%),
      radial-gradient(900px 600px at 85% 110%, rgba(201, 162, 39, 0.06), transparent 60%),
      linear-gradient(180deg, #0a0a12 0%, #0d0c18 45%, #090911 100%);
  }

  /* Pure-CSS starfield: two layers of box-shadow stars, gently twinkling */
  .v1-stars,
  .v1-stars::before,
  .v1-stars::after {
    position: absolute;
    inset: 0;
    content: "";
    pointer-events: none;
    background-repeat: repeat;
  }
  .v1-stars {
    background-image:
      radial-gradient(1.4px 1.4px at 22px 34px, rgba(255, 244, 214, 0.85), transparent 60%),
      radial-gradient(1px 1px at 120px 90px, rgba(214, 222, 255, 0.7), transparent 60%),
      radial-gradient(1.2px 1.2px at 190px 160px, rgba(255, 244, 214, 0.55), transparent 60%),
      radial-gradient(0.9px 0.9px at 70px 200px, rgba(214, 222, 255, 0.6), transparent 60%),
      radial-gradient(1px 1px at 240px 60px, rgba(255, 244, 214, 0.5), transparent 60%);
    background-size: 280px 260px;
    animation: v1-twinkle 7s ease-in-out infinite alternate;
  }
  .v1-stars::before {
    background-image:
      radial-gradient(1.6px 1.6px at 60px 140px, rgba(255, 240, 200, 0.9), transparent 60%),
      radial-gradient(1.1px 1.1px at 210px 40px, rgba(220, 226, 255, 0.75), transparent 60%),
      radial-gradient(0.9px 0.9px at 150px 220px, rgba(255, 240, 200, 0.6), transparent 60%),
      radial-gradient(1.2px 1.2px at 30px 260px, rgba(220, 226, 255, 0.55), transparent 60%);
    background-size: 340px 320px;
    opacity: 0.7;
    animation: v1-twinkle 9s ease-in-out infinite alternate-reverse;
  }
  .v1-stars::after {
    background-image:
      radial-gradient(2px 2px at 100px 80px, rgba(255, 236, 190, 0.95), transparent 60%),
      radial-gradient(1.3px 1.3px at 260px 180px, rgba(226, 232, 255, 0.7), transparent 60%);
    background-size: 460px 420px;
    opacity: 0.55;
    animation: v1-twinkle 11s ease-in-out infinite alternate;
  }
  @keyframes v1-twinkle {
    from { opacity: 0.45; }
    to   { opacity: 1; }
  }

  .v1-serif { font-family: ${SERIF}; }
  .v1-sans { font-family: ${SANS}; }

  .v1-gold { color: #c9a227; }
  .v1-gold-soft { color: #e3c964; }
  .v1-ivory { color: #efe9dc; }
  .v1-muted { color: #9b97ab; }

  .v1-hairline { border: 1px solid rgba(201, 162, 39, 0.35); }
  .v1-hairline-faint { border: 1px solid rgba(201, 162, 39, 0.18); }

  .v1-glow-gold {
    box-shadow:
      0 0 24px rgba(201, 162, 39, 0.14),
      0 0 80px rgba(201, 162, 39, 0.06);
  }

  /* Ornate double border for the tarot card panel */
  .v1-card-frame {
    position: relative;
    border: 1px solid rgba(201, 162, 39, 0.55);
    background:
      radial-gradient(600px 300px at 50% 0%, rgba(201, 162, 39, 0.08), transparent 70%),
      linear-gradient(180deg, rgba(20, 18, 34, 0.92), rgba(12, 11, 22, 0.96));
  }
  .v1-card-frame::before {
    content: "";
    position: absolute;
    inset: 7px;
    border: 1px solid rgba(201, 162, 39, 0.28);
    pointer-events: none;
  }
  .v1-card-frame::after {
    content: "✦";
    position: absolute;
    top: -11px;
    left: 50%;
    transform: translateX(-50%);
    padding: 0 14px;
    background: #0b0a14;
    color: #c9a227;
    font-size: 15px;
    letter-spacing: 0.4em;
    text-indent: 0.4em;
  }

  .v1-corner {
    position: absolute;
    width: 18px;
    height: 18px;
    border-color: rgba(201, 162, 39, 0.75);
    border-style: solid;
    pointer-events: none;
  }
  .v1-corner-tl { top: 3px; left: 3px; border-width: 1px 0 0 1px; }
  .v1-corner-tr { top: 3px; right: 3px; border-width: 1px 1px 0 0; }
  .v1-corner-bl { bottom: 3px; left: 3px; border-width: 0 0 1px 1px; }
  .v1-corner-br { bottom: 3px; right: 3px; border-width: 0 1px 1px 0; }

  .v1-chip {
    border: 1px solid rgba(201, 162, 39, 0.4);
    color: #e3c964;
    background: rgba(201, 162, 39, 0.07);
    letter-spacing: 0.14em;
  }

  .v1-input {
    background: rgba(14, 13, 26, 0.85);
    border: 1px solid rgba(201, 162, 39, 0.3);
    color: #efe9dc;
    transition: border-color 160ms ease, box-shadow 160ms ease;
  }
  .v1-input::placeholder { color: #6d6a80; }
  .v1-input:focus {
    outline: none;
    border-color: rgba(201, 162, 39, 0.8);
    box-shadow: 0 0 0 1px rgba(201, 162, 39, 0.4), 0 0 22px rgba(201, 162, 39, 0.15);
  }
  .v1-input::-webkit-outer-spin-button,
  .v1-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .v1-input { -moz-appearance: textfield; appearance: textfield; }

  .v1-btn {
    font-family: ${SERIF};
    color: #100e1c;
    background: linear-gradient(180deg, #e3c964 0%, #c9a227 55%, #a8861d 100%);
    border: 1px solid rgba(255, 232, 160, 0.55);
    box-shadow:
      inset 0 1px 0 rgba(255, 245, 210, 0.5),
      0 6px 24px rgba(201, 162, 39, 0.28);
    letter-spacing: 0.16em;
    transition: transform 140ms ease, box-shadow 140ms ease, filter 140ms ease;
  }
  .v1-btn:hover {
    filter: brightness(1.08);
    box-shadow:
      inset 0 1px 0 rgba(255, 245, 210, 0.6),
      0 8px 32px rgba(201, 162, 39, 0.4);
    transform: translateY(-1px);
  }
  .v1-btn:active { transform: translateY(0); }

  .v1-divider {
    display: flex;
    align-items: center;
    gap: 14px;
    color: rgba(201, 162, 39, 0.7);
  }
  .v1-divider::before,
  .v1-divider::after {
    content: "";
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201, 162, 39, 0.45), transparent);
  }

  .v1-arcana-tile {
    background: linear-gradient(180deg, rgba(22, 20, 38, 0.85), rgba(13, 12, 24, 0.9));
    border: 1px solid rgba(201, 162, 39, 0.2);
    transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
  }
  .v1-arcana-tile:hover {
    border-color: rgba(201, 162, 39, 0.65);
    box-shadow: 0 0 26px rgba(201, 162, 39, 0.14);
    transform: translateY(-2px);
  }
  .v1-arcana-tile-active {
    border-color: rgba(201, 162, 39, 0.85);
    box-shadow: 0 0 30px rgba(201, 162, 39, 0.22);
  }

  .v1-fade-in {
    animation: v1-fade-in 480ms ease both;
  }
  @keyframes v1-fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .v1-roman-numeral {
    text-shadow: 0 0 26px rgba(201, 162, 39, 0.4);
  }

  .v1-hermit-panel {
    background: linear-gradient(180deg, rgba(21, 19, 36, 0.8), rgba(12, 11, 22, 0.9));
  }
`;

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                         */
/* ------------------------------------------------------------------ */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="v1-sans v1-gold text-[11px] uppercase tracking-[0.42em]"
      style={{ textIndent: "0.42em" }}
    >
      {children}
    </p>
  );
}

function Divider({ glyph = "✦" }: { glyph?: string }) {
  return (
    <div className="v1-divider my-14 text-sm" aria-hidden="true">
      <span className="v1-serif">{glyph}</span>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="v1-chip v1-sans inline-block rounded-full px-3.5 py-1 text-[11px] uppercase">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Result panel (tarot card)                                           */
/* ------------------------------------------------------------------ */

function ResultPanel({ card }: { card: ArcanaCard | null }) {
  if (!card) {
    return (
      <div className="v1-card-frame v1-glow-gold relative mx-auto mt-14 w-full max-w-xl px-8 py-14 text-center sm:px-14">
        <span className="v1-corner v1-corner-tl" />
        <span className="v1-corner v1-corner-tr" />
        <span className="v1-corner v1-corner-bl" />
        <span className="v1-corner v1-corner-br" />
        <p className="v1-serif v1-muted text-lg italic">
          The cards are waiting.
        </p>
        <p className="v1-sans v1-muted mx-auto mt-3 max-w-sm text-sm leading-relaxed">
          Enter your date of birth above and the arcana that governs your path
          will reveal itself here.
        </p>
      </div>
    );
  }

  return (
    <div
      key={card.number}
      className="v1-card-frame v1-glow-gold v1-fade-in relative mx-auto mt-14 w-full max-w-xl px-8 py-12 text-center sm:px-14"
    >
      <span className="v1-corner v1-corner-tl" />
      <span className="v1-corner v1-corner-tr" />
      <span className="v1-corner v1-corner-bl" />
      <span className="v1-corner v1-corner-br" />

      <p className="v1-sans v1-gold text-[10px] uppercase tracking-[0.5em]" style={{ textIndent: "0.5em" }}>
        Your Birth Arcana
      </p>

      <p className="v1-serif v1-roman-numeral v1-gold-soft mt-6 text-6xl sm:text-7xl">
        {toRoman(card.number)}
      </p>

      <h2 className="v1-serif v1-ivory mt-3 text-3xl sm:text-4xl">
        {card.name}
      </h2>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {card.keywords.map((kw) => (
          <Chip key={kw}>{kw}</Chip>
        ))}
      </div>

      <p className="v1-serif v1-ivory mx-auto mt-7 max-w-md text-lg italic leading-relaxed">
        “{card.mission}”
      </p>

      <div className="v1-sans mt-8 flex items-center justify-center gap-6 text-sm">
        <span className="v1-muted">
          Element · <span className="v1-gold-soft">{card.element}</span>
        </span>
        <span className="v1-gold" aria-hidden="true">
          ✦
        </span>
        <span className="v1-muted">
          Ruled by · <span className="v1-gold-soft">{card.astrology}</span>
        </span>
      </div>

      <p className="v1-sans v1-muted mx-auto mt-8 max-w-md border-t border-[rgba(201,162,39,0.18)] pt-6 text-xs leading-relaxed">
        This is the Major Arcana whose number matches the numerological sum of
        your birth date — a lens on the lessons and gifts your life keeps
        returning to.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

interface BirthDateInput {
  day: string;
  month: string;
  year: string;
}

export default function DesignsV1Page() {
  const [input, setInput] = useState<BirthDateInput>({
    day: "",
    month: "",
    year: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ArcanaCard | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const day = Number(input.day);
    const month = Number(input.month);
    const year = Number(input.year);

    if (!input.day || !input.month || !input.year) {
      setError("Please fill in day, month and year.");
      return;
    }
    if (!Number.isInteger(day) || day < 1 || day > 31) {
      setError("Day must be a number between 1 and 31.");
      return;
    }
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      setError("Month must be a number between 1 and 12.");
      return;
    }
    if (!Number.isInteger(year) || year < 1000 || year > 9999) {
      setError("Year must be a four-digit number.");
      return;
    }

    setError(null);
    setResult(getArcana(calculateBirthArcana(day, month, year)));
  }

  const hermitCard = getArcana(HERMIT.number);

  return (
    <div className="v1-root v1-sans relative min-h-screen overflow-hidden">
      <style>{V1_STYLES}</style>

      {/* Starfield layers */}
      <div className="v1-stars" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-24 pt-16 sm:px-8 sm:pt-24">
        {/* ---------------------------------------------------------- */}
        {/* 1 · Hero + calculator                                       */}
        {/* ---------------------------------------------------------- */}
        <header className="text-center">
          <Eyebrow>Astro Scope — Tarot</Eyebrow>
          <h1 className="v1-serif v1-ivory mt-5 text-5xl leading-tight sm:text-6xl">
            Birth Arcana{" "}
            <span className="v1-gold-soft italic">Calculator</span>
          </h1>
          <p className="v1-muted mx-auto mt-5 max-w-xl text-base leading-relaxed">
            Every birth date distills into one of the twenty-two Major Arcana.
            Discover which card has been quietly walking beside you since your
            first breath.
          </p>

          <form
            onSubmit={handleSubmit}
            className="v1-hairline-faint v1-glow-gold mx-auto mt-12 max-w-2xl rounded-sm bg-[rgba(13,12,24,0.7)] px-6 py-8 sm:px-10"
          >
            <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-end">
              <label className="flex-1 text-left">
                <span className="v1-gold v1-sans mb-2 block text-[10px] uppercase tracking-[0.3em]">
                  Day
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={31}
                  placeholder="DD"
                  value={input.day}
                  onChange={(e) =>
                    setInput((s) => ({ ...s, day: e.target.value }))
                  }
                  className="v1-input v1-serif w-full rounded-sm px-4 py-3 text-center text-xl"
                />
              </label>
              <label className="flex-1 text-left">
                <span className="v1-gold v1-sans mb-2 block text-[10px] uppercase tracking-[0.3em]">
                  Month
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={12}
                  placeholder="MM"
                  value={input.month}
                  onChange={(e) =>
                    setInput((s) => ({ ...s, month: e.target.value }))
                  }
                  className="v1-input v1-serif w-full rounded-sm px-4 py-3 text-center text-xl"
                />
              </label>
              <label className="flex-1 text-left">
                <span className="v1-gold v1-sans mb-2 block text-[10px] uppercase tracking-[0.3em]">
                  Year
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1000}
                  max={9999}
                  placeholder="YYYY"
                  value={input.year}
                  onChange={(e) =>
                    setInput((s) => ({ ...s, year: e.target.value }))
                  }
                  className="v1-input v1-serif w-full rounded-sm px-4 py-3 text-center text-xl"
                />
              </label>
            </div>

            {error && (
              <p className="v1-sans mt-4 text-sm text-[#e08585]" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="v1-btn mt-7 w-full cursor-pointer rounded-sm px-8 py-3.5 text-sm uppercase sm:w-auto"
            >
              Reveal my arcana
            </button>
          </form>

          {/* 2 · Result panel */}
          <ResultPanel card={result} />
        </header>

        <Divider />

        {/* ---------------------------------------------------------- */}
        {/* 3 · What is Birth Arcana?                                   */}
        {/* ---------------------------------------------------------- */}
        <section className="mx-auto max-w-3xl text-center">
          <Eyebrow>The Method</Eyebrow>
          <h2 className="v1-serif v1-ivory mt-4 text-3xl sm:text-4xl">
            What is Birth Arcana?
          </h2>
          <div className="v1-muted mt-7 space-y-5 text-left text-[15px] leading-relaxed sm:text-justify">
            <p>
              In tarot numerology, the twenty-two Major Arcana are more than
              cards in a deck — they are archetypes, stations on a journey the
              mystics called the Fool&apos;s Path. Your Birth Arcana is the
              single archetype your date of birth resolves to: a quiet
              signature said to colour your temperament, your recurring
              lessons, and the kind of wisdom you are here to earn.
            </p>
            <p>
              Unlike a zodiac sign, which follows the Sun&apos;s position, the
              Birth Arcana is derived purely from number. It does not change
              with the seasons or the hour you were born. It is constant — a
              fixed point of reference you can return to whenever life asks
              the same old question in a new disguise.
            </p>
          </div>

          <div className="v1-hairline v1-glow-gold mt-9 rounded-sm bg-[rgba(201,162,39,0.05)] px-6 py-6 text-left sm:px-9">
            <p className="v1-gold v1-sans text-[10px] uppercase tracking-[0.35em]">
              How it&apos;s calculated
            </p>
            <p className="v1-muted mt-3 text-sm leading-relaxed">
              Add together every digit of the full birth date — day, month and
              year. If the sum is greater than 22, add its digits together
              again, and repeat, until the result falls between 1 and 22. That
              number is your Birth Arcana;{" "}
              <span className="v1-gold-soft">22 is kept as The Fool</span>,
              the unnumbered wanderer of the deck.
            </p>
            <p className="v1-serif v1-gold-soft mt-4 text-sm italic">
              e.g. 14 · 09 · 1992 → 1+4+0+9+1+9+9+2 = 35 → 3+5 = 8 · Strength
            </p>
          </div>
        </section>

        <Divider glyph="☾" />

        {/* ---------------------------------------------------------- */}
        {/* 4 · Explore all 22 arcanas                                  */}
        {/* ---------------------------------------------------------- */}
        <section>
          <div className="text-center">
            <Eyebrow>The Full Deck</Eyebrow>
            <h2 className="v1-serif v1-ivory mt-4 text-3xl sm:text-4xl">
              Explore All Birth Arcanas
            </h2>
            <p className="v1-muted mx-auto mt-4 max-w-lg text-sm leading-relaxed">
              The twenty-two stations of the Major Arcana. Touch a card to see
              it revealed above.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {ARCANA.map((card) => {
              const isActive = result?.number === card.number;
              return (
                <button
                  key={card.number}
                  type="button"
                  onClick={() => {
                    setResult(card);
                    setError(null);
                  }}
                  className={`v1-arcana-tile ${
                    isActive ? "v1-arcana-tile-active" : ""
                  } cursor-pointer rounded-sm px-4 py-6 text-center`}
                >
                  <span className="v1-serif v1-gold-soft block text-2xl">
                    {toRoman(card.number)}
                  </span>
                  <span className="v1-serif v1-ivory mt-2 block text-base leading-snug">
                    {card.name}
                  </span>
                  <span className="v1-sans v1-muted mt-2 block text-[11px] uppercase tracking-[0.18em]">
                    {card.keywords[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <Divider glyph="🕯" />

        {/* ---------------------------------------------------------- */}
        {/* 5 · Deep dive · The Hermit (IX)                             */}
        {/* ---------------------------------------------------------- */}
        <section>
          <div className="text-center">
            <Eyebrow>Deep Dive</Eyebrow>
            <h2 className="v1-serif v1-ivory mt-4 text-3xl sm:text-4xl">
              {HERMIT.name}{" "}
              <span className="v1-gold-soft">
                ({toRoman(HERMIT.number)})
              </span>
            </h2>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {HERMIT.keywords.map((kw) => (
                <Chip key={kw}>{kw}</Chip>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {/* Upright */}
            <article className="v1-hermit-panel v1-hairline-faint rounded-sm p-7">
              <h3 className="v1-serif v1-gold-soft text-xl">
                Upright <span className="v1-muted text-sm">☉</span>
              </h3>
              <p className="v1-muted mt-4 text-sm leading-relaxed">
                {HERMIT.upright}
              </p>
            </article>

            {/* Reversed */}
            <article className="v1-hermit-panel v1-hairline-faint rounded-sm p-7">
              <h3 className="v1-serif v1-gold-soft text-xl">
                Reversed <span className="v1-muted text-sm">☽</span>
              </h3>
              <p className="v1-muted mt-4 text-sm leading-relaxed">
                {HERMIT.reversed}
              </p>
            </article>

            {/* Associations */}
            <article className="v1-hermit-panel v1-hairline-faint rounded-sm p-7 sm:col-span-2">
              <h3 className="v1-serif v1-gold-soft text-xl">Associations</h3>
              <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                <div className="flex items-baseline justify-between gap-4 border-b border-[rgba(201,162,39,0.14)] pb-3">
                  <dt className="v1-sans v1-gold text-[10px] uppercase tracking-[0.28em]">
                    Element
                  </dt>
                  <dd className="v1-ivory text-sm">{HERMIT.element}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-[rgba(201,162,39,0.14)] pb-3">
                  <dt className="v1-sans v1-gold text-[10px] uppercase tracking-[0.28em]">
                    Number
                  </dt>
                  <dd className="v1-ivory text-sm">
                    {HERMIT.number} · {toRoman(HERMIT.number)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-[rgba(201,162,39,0.14)] pb-3">
                  <dt className="v1-sans v1-gold text-[10px] uppercase tracking-[0.28em]">
                    Astrology
                  </dt>
                  <dd className="v1-ivory text-sm">{HERMIT.astrology}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-[rgba(201,162,39,0.14)] pb-3">
                  <dt className="v1-sans v1-gold text-[10px] uppercase tracking-[0.28em]">
                    Numerology
                  </dt>
                  <dd className="v1-ivory text-right text-sm">
                    {HERMIT.numerology}
                  </dd>
                </div>
              </dl>
            </article>

            {/* Strengths */}
            <article className="v1-hermit-panel v1-hairline-faint rounded-sm p-7">
              <h3 className="v1-serif v1-gold-soft text-xl">Strengths</h3>
              <ul className="mt-4 space-y-3">
                {HERMIT.strengths.map((s) => (
                  <li key={s} className="v1-muted flex gap-3 text-sm leading-relaxed">
                    <span className="v1-gold" aria-hidden="true">✦</span>
                    {s}
                  </li>
                ))}
              </ul>
            </article>

            {/* Growth areas */}
            <article className="v1-hermit-panel v1-hairline-faint rounded-sm p-7">
              <h3 className="v1-serif v1-gold-soft text-xl">Growth Areas</h3>
              <ul className="mt-4 space-y-3">
                {HERMIT.growthAreas.map((s) => (
                  <li key={s} className="v1-muted flex gap-3 text-sm leading-relaxed">
                    <span className="v1-gold" aria-hidden="true">✧</span>
                    {s}
                  </li>
                ))}
              </ul>
            </article>

            {/* Karmic lessons */}
            <article className="v1-hermit-panel v1-hairline-faint rounded-sm p-7 sm:col-span-2">
              <h3 className="v1-serif v1-gold-soft text-xl">Karmic Lessons</h3>
              <ol className="mt-5 grid gap-4 sm:grid-cols-3">
                {HERMIT.karmicLessons.map((lesson, i) => (
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
            <article className="v1-card-frame v1-glow-gold relative rounded-sm p-9 text-center sm:col-span-2">
              <span className="v1-corner v1-corner-tl" />
              <span className="v1-corner v1-corner-tr" />
              <span className="v1-corner v1-corner-bl" />
              <span className="v1-corner v1-corner-br" />
              <h3 className="v1-sans v1-gold text-[10px] uppercase tracking-[0.4em]" style={{ textIndent: "0.4em" }}>
                Life Purpose
              </h3>
              <p className="v1-serif v1-ivory mx-auto mt-5 max-w-2xl text-lg italic leading-relaxed">
                “{HERMIT.lifePurpose}”
              </p>
            </article>

            {/* Compatible arcanas */}
            <article className="v1-hermit-panel v1-hairline-faint rounded-sm p-7 sm:col-span-2">
              <h3 className="v1-serif v1-gold-soft text-xl text-center">
                Compatible Arcanas
              </h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {HERMIT.compatibleArcanas.map((n) => {
                  const c = getArcana(n);
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        setResult(c);
                        setError(null);
                      }}
                      className="v1-arcana-tile cursor-pointer rounded-sm px-4 py-5 text-center"
                    >
                      <span className="v1-serif v1-gold-soft block text-xl">
                        {toRoman(c.number)}
                      </span>
                      <span className="v1-serif v1-ivory mt-1.5 block text-sm">
                        {c.name}
                      </span>
                      <span className="v1-sans v1-muted mt-1.5 block text-[10px] uppercase tracking-[0.18em]">
                        {c.keywords[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="v1-muted mt-5 text-center text-xs leading-relaxed">
                The Hermit walks well beside {hermitCard.astrology}&apos;s
                quiet kin — cards that honour depth over noise.
              </p>
            </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* 6 · Footer                                                  */}
        {/* ---------------------------------------------------------- */}
        <footer className="mt-20 text-center">
          <div className="v1-divider mb-8 text-xs" aria-hidden="true">
            <span className="v1-serif">✦ ✦ ✦</span>
          </div>
          <p className="v1-sans v1-muted text-xs tracking-[0.2em]">
            Astro Scope — design variant v1 ·{" "}
            <span className="v1-gold">Midnight Mystic</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
