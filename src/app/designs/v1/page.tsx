"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ARCANA, calculateBirthArcana } from "@/lib/arcana";
import {
  Divider,
  Eyebrow,
  MiniTarotCard,
  V1_BASE_STYLES,
  SERIF,
} from "./shared";

/* ------------------------------------------------------------------ */
/* Styles specific to the tool page                                    */
/* ------------------------------------------------------------------ */

const V1_TOOL_STYLES = `
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
`;

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

interface BirthDateInput {
  day: string;
  month: string;
  year: string;
}

export default function DesignsV1Page() {
  const router = useRouter();
  const [input, setInput] = useState<BirthDateInput>({
    day: "",
    month: "",
    year: "",
  });
  const [error, setError] = useState<string | null>(null);

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
    router.push(`/designs/v1/${calculateBirthArcana(day, month, year)}`);
  }

  return (
    <div className="v1-root v1-sans relative min-h-screen overflow-hidden">
      <style>{V1_BASE_STYLES + V1_TOOL_STYLES}</style>

      {/* Starfield layers */}
      <div className="v1-stars" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-16 sm:px-8">
        {/* ---------------------------------------------------------- */}
        {/* Slim header                                                 */}
        {/* ---------------------------------------------------------- */}
        <header className="flex items-center justify-between gap-4 border-b border-[rgba(201,162,39,0.18)] py-5">
          <span className="v1-serif v1-ivory text-lg tracking-wide">
            Astro Scope <span className="v1-gold">— Tarot</span>
          </span>
          <span className="v1-chip v1-sans rounded-full px-3 py-1 text-[10px] uppercase">
            Variant v1 · Midnight Mystic
          </span>
        </header>

        {/* ---------------------------------------------------------- */}
        {/* Hero-tool                                                   */}
        {/* ---------------------------------------------------------- */}
        <section className="pt-14 text-center sm:pt-16">
          <Eyebrow>Birth Arcana</Eyebrow>
          <h1 className="v1-serif v1-ivory mt-4 text-4xl leading-tight sm:text-5xl">
            Which arcana walks <span className="v1-gold-soft italic">beside you?</span>
          </h1>
          <p className="v1-muted mx-auto mt-4 max-w-lg text-[15px] leading-relaxed">
            Enter your date of birth — the deck will name the Major Arcana that
            governs your path.
          </p>

          <form
            onSubmit={handleSubmit}
            className="v1-hairline-faint v1-glow-gold mx-auto mt-10 max-w-2xl rounded-sm bg-[rgba(13,12,24,0.7)] px-6 py-8 sm:px-10"
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

          <p className="v1-muted mx-auto mt-6 max-w-md text-xs leading-relaxed">
            How it works: the digits of your birth date are summed and reduced
            until they fall between 1 and 22 —{" "}
            <span className="v1-gold-soft">22 is kept as The Fool</span>.
          </p>
        </section>

        <Divider />

        {/* ---------------------------------------------------------- */}
        {/* All 22 arcanas — visual card grid                           */}
        {/* ---------------------------------------------------------- */}
        <section>
          <div className="text-center">
            <Eyebrow>The Full Deck</Eyebrow>
            <h2 className="v1-serif v1-ivory mt-3 text-3xl sm:text-4xl">
              All 22 Arcanas
            </h2>
            <p className="v1-muted mx-auto mt-3 max-w-md text-sm leading-relaxed">
              The twenty-two stations of the Major Arcana — touch a card to
              read its meaning.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:max-w-none lg:grid-cols-6">
            {ARCANA.map((card) => (
              <MiniTarotCard key={card.number} card={card} />
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
