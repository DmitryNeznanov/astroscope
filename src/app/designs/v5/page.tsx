"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ARCANA, calculateBirthArcana } from "@/lib/arcana";
import {
  ARCANA_ROUTES_BASE,
  AuroraBackdrop,
  GradientText,
  MiniHoloCard,
  SectionHeading,
  V5_BASE_STYLES,
  V5Footer,
} from "./shared";

/* ------------------------------------------------------------------ */
/* Tool page — calculator first, result lives on /designs/v5/[arcana]   */
/* ------------------------------------------------------------------ */

export default function DesignsV5Page() {
  const router = useRouter();
  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = Number(day);
    const m = Number(month);
    const y = Number(year);

    if (!day.trim() || !month.trim() || !year.trim()) {
      setError("All three fields are needed — the stars insist on precision.");
      return;
    }
    if (!Number.isInteger(d) || d < 1 || d > 31) {
      setError("Day must be a number between 1 and 31.");
      return;
    }
    if (!Number.isInteger(m) || m < 1 || m > 12) {
      setError("Month must be a number between 1 and 12.");
      return;
    }
    if (!/^\d{4}$/.test(year.trim())) {
      setError("Year must be a full four-digit year.");
      return;
    }

    setError(null);
    router.push(`${ARCANA_ROUTES_BASE}/${calculateBirthArcana(d, m, y)}`);
  }

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#070b1a] font-sans text-white antialiased selection:bg-fuchsia-400/30">
      <AuroraBackdrop />
      <style>{V5_BASE_STYLES}</style>

      {/* 1 · Nav */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-8">
        <span className="v5-nav-pill">
          <span className="h-2 w-2 rounded-full bg-gradient-to-br from-violet-400 to-teal-300 shadow-[0_0_10px_rgba(167,139,250,0.9)]" />
          <span className="text-sm font-light tracking-[0.22em] text-white/85">
            ASTRO SCOPE
          </span>
        </span>
        <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-white/40">
          Birth Arcana · v5
        </span>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24">
        {/* 2 · Hero + calculator */}
        <section className="pb-16 pt-16 text-center sm:pt-20">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.4em] text-violet-300/70">
            A celestial observatory of the self
          </p>
          <h1 className="mx-auto mb-5 max-w-3xl text-5xl font-extralight leading-[1.08] tracking-tight sm:text-6xl md:text-7xl">
            <GradientText>Birth Arcana Calculator</GradientText>
          </h1>
          <p className="mx-auto mb-12 max-w-xl text-base font-light leading-relaxed text-white/55">
            Your date of birth holds a single card of the Major Arcana.
            Three numbers in, one archetype out — no telescope required.
          </p>

          <form
            onSubmit={handleSubmit}
            className="v5-glass v5-rise mx-auto max-w-2xl px-6 py-8 sm:px-10"
            noValidate
          >
            <div className="grid grid-cols-3 gap-3 sm:gap-5">
              {(
                [
                  { label: "Day", value: day, set: setDay, placeholder: "14", min: 1, max: 31 },
                  { label: "Month", value: month, set: setMonth, placeholder: "07", min: 1, max: 12 },
                  { label: "Year", value: year, set: setYear, placeholder: "1990", min: 1000, max: 9999 },
                ] as const
              ).map((field) => (
                <label key={field.label} className="flex flex-col gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/40">
                    {field.label}
                  </span>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder={field.placeholder}
                    min={field.min}
                    max={field.max}
                    value={field.value}
                    onChange={(e) => field.set(e.target.value)}
                    className="v5-input"
                    aria-label={`Birth ${field.label.toLowerCase()}`}
                  />
                </label>
              ))}
            </div>

            {error && (
              <p
                role="alert"
                className="mt-5 rounded-xl border border-rose-300/25 bg-rose-400/10 px-4 py-2.5 text-sm font-light text-rose-200/90"
              >
                {error}
              </p>
            )}

            <button type="submit" className="v5-cta mt-7">
              Reveal my arcana
              <span aria-hidden="true">✦</span>
            </button>
          </form>

          <p className="mx-auto mt-8 max-w-xl text-sm font-light leading-relaxed text-white/40">
            How it works: every digit of your birth date is summed and
            reduced until it lands between 1 and 22 — that number is your
            arcana.
          </p>
        </section>

        {/* 3 · All 22 arcanas */}
        <section>
          <SectionHeading
            kicker="The full deck"
            title={
              <>
                All <GradientText>22 Arcanas</GradientText>
              </>
            }
          />
          <p className="mx-auto -mt-4 mb-8 max-w-md text-center text-sm font-light text-white/45">
            Or skip the math — pick a card and read it straight away.
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {ARCANA.map((card) => (
              <MiniHoloCard key={card.number} card={card} />
            ))}
          </div>
        </section>
      </main>

      <V5Footer />
    </div>
  );
}
