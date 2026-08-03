"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ARCANA, calculateBirthArcana } from "@/lib/arcana";
import {
  ARCANA_ROUTES_BASE,
  Colophon,
  Corners,
  Divider,
  GREEN,
  MiniTarotCard,
  OXBLOOD,
  V3_BASE_STYLES,
} from "./shared";

/* ------------------------------------------------------------------ */
/* Styles specific to the tool page                                    */
/* ------------------------------------------------------------------ */

const V3_TOOL_STYLES = `
  .v3-nameplate {
    font-size: clamp(1.9rem, 5vw, 2.8rem);
    line-height: 1.05;
    letter-spacing: 0.04em;
    text-shadow: 0 1px 0 rgba(255, 250, 235, 0.7);
  }
`;

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

interface BirthDateInput {
  day: string;
  month: string;
  year: string;
}

export default function DesignsV3Page() {
  const router = useRouter();
  const [input, setInput] = useState<BirthDateInput>({
    day: "",
    month: "",
    year: "",
  });
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const d = Number(input.day);
    const m = Number(input.month);
    const y = Number(input.year);

    if (!/^\d{1,2}$/.test(input.day.trim()) || d < 1 || d > 31) {
      setError("The day (Dies) must be a number betwixt 1 and 31.");
      return;
    }
    if (!/^\d{1,2}$/.test(input.month.trim()) || m < 1 || m > 12) {
      setError("The month (Mensis) must be a number betwixt 1 and 12.");
      return;
    }
    if (!/^\d{4}$/.test(input.year.trim())) {
      setError("The year (Annus) must be written in full — four digits, as 1990.");
      return;
    }
    setError(null);
    router.push(`${ARCANA_ROUTES_BASE}/${calculateBirthArcana(d, m, y)}`);
  }

  return (
    <main className="v3-root min-h-screen px-4 py-8 md:px-8 md:py-12">
      <style>{V3_BASE_STYLES + V3_TOOL_STYLES}</style>

      <div className="mx-auto max-w-3xl">
        {/* ---------------------------------------------------------- */}
        {/* Slim masthead                                               */}
        {/* ---------------------------------------------------------- */}
        <header className="text-center">
          <div className="v3-rule-double" />
          <div className="v3-rule-thin mt-[3px]" />
          <h1 className="v3-nameplate mt-4 font-bold">
            <span aria-hidden className="mr-3 align-middle text-xl" style={{ color: OXBLOOD }}>❦</span>
            Astro&nbsp;Scope
            <span aria-hidden className="ml-3 align-middle text-xl" style={{ color: OXBLOOD }}>❧</span>
          </h1>
          <p className="v3-smallcaps mt-2 text-sm opacity-90">
            Birth Arcana Calculator · Vol. III · Vintage Grimoire
          </p>
          <p className="v3-rule-ornament mt-4 text-base" aria-hidden>
            <span style={{ color: OXBLOOD }}>✦</span>
          </p>
        </header>

        {/* ---------------------------------------------------------- */}
        {/* Hero-tool                                                   */}
        {/* ---------------------------------------------------------- */}
        <section className="mt-8 text-center">
          <h2 className="v3-chapter-title text-2xl md:text-3xl">
            Which arcana walketh beside thee?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm italic leading-relaxed opacity-80">
            Inscribe thy date of birth, good reader, and the deck shall name
            the Major Arcana that governeth thy path.
          </p>

          <div className="v3-frame mt-8">
            <Corners />
            <div className="v3-frame-inner px-6 py-8 md:px-10">
              <form onSubmit={handleSubmit} noValidate>
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
                      value={input.day}
                      onChange={(e) =>
                        setInput((s) => ({ ...s, day: e.target.value }))
                      }
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
                      value={input.month}
                      onChange={(e) =>
                        setInput((s) => ({ ...s, month: e.target.value }))
                      }
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
                      value={input.year}
                      onChange={(e) =>
                        setInput((s) => ({ ...s, year: e.target.value }))
                      }
                      aria-label="Year of birth"
                    />
                  </label>
                </div>

                {error && (
                  <p className="v3-notice mt-5 px-4 py-3 text-center text-sm italic" role="alert">
                    ☞&ensp;{error}
                  </p>
                )}

                <div className="mt-7">
                  <button type="submit" className="v3-button">
                    ✦&ensp;Divine thine Arcana&ensp;✦
                  </button>
                </div>
              </form>
            </div>
          </div>

          <aside className="v3-inset mx-auto mt-6 max-w-xl px-5 py-4 text-left">
            <p className="v3-smallcaps text-xs" style={{ color: GREEN }}>
              ❧&ensp;How it is calculated
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              The digits of thy birth date are summed and reduced until a
              number from 1 to 22 remaineth — and 22, signifying{" "}
              <em>The Fool</em>, is never reduced further.
            </p>
          </aside>
        </section>

        <Divider glyph="☾" />

        {/* ---------------------------------------------------------- */}
        {/* The Compendium — all 22 arcanas as mini plates              */}
        {/* ---------------------------------------------------------- */}
        <section className="text-center">
          <p className="v3-rule-ornament v3-smallcaps text-sm opacity-80">
            <span>❧</span>
            <span>Index</span>
            <span>☙</span>
          </p>
          <h2 className="v3-chapter-title mt-3 text-3xl md:text-4xl">
            The Compendium
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm italic leading-relaxed opacity-75">
            The twenty-two stations of the Major Arcana — touch any plate to
            read its chapter.
          </p>

          <div className="mx-auto mt-9 grid max-w-2xl grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:max-w-none lg:grid-cols-6">
            {ARCANA.map((card) => (
              <MiniTarotCard key={card.number} card={card} />
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
