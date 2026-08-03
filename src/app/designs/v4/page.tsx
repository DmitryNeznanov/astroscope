"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ARCANA, calculateBirthArcana } from "@/lib/arcana";
import {
  ARCANA_ROUTES_BASE,
  BLUE,
  Marquee,
  MiniRisoCard,
  PINK,
  V4_BASE_STYLES,
  V4Footer,
  YELLOW,
} from "./shared";

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function DesignsV4Page() {
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
      setError("ALL THREE FIELDS. NO EXCUSES.");
      return;
    }
    if (!Number.isInteger(d) || d < 1 || d > 31) {
      setError("DAY MUST BE 1–31. CHECK THE CALENDAR.");
      return;
    }
    if (!Number.isInteger(m) || m < 1 || m > 12) {
      setError("MONTH MUST BE 1–12. THERE ARE ONLY TWELVE.");
      return;
    }
    if (!/^\d{4}$/.test(year.trim())) {
      setError("YEAR MUST BE 4 DIGITS. LIKE 1994.");
      return;
    }

    setError(null);
    router.push(`${ARCANA_ROUTES_BASE}/${calculateBirthArcana(d, m, y)}`);
  }

  return (
    <main className="min-h-screen bg-white font-sans text-black">
      <style>{V4_BASE_STYLES}</style>

      {/* 1 — TOP BAR + MARQUEE */}
      <header className="border-b-4 border-black bg-black text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <p className="v4-heading text-sm uppercase tracking-widest md:text-base">
            Astro Scope ★ Birth Arcana Calculator
          </p>
          <div style={{ transform: "rotate(6deg)" }}>
            <span
              className="v4-sticker"
              style={{
                backgroundColor: YELLOW,
                color: "#000",
                boxShadow: "3px 3px 0 #fff",
              }}
            >
              100% Free
            </span>
          </div>
        </div>
        <Marquee text="22 cards ★ one birth date ★ zero mercy ★ find your arcana ★" />
      </header>

      {/* 2 — HERO + CALCULATOR */}
      <section
        className="border-b-4 border-black"
        style={{ backgroundColor: YELLOW }}
      >
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <h1 className="v4-heading text-5xl uppercase leading-[0.9] md:text-7xl">
            What&rsquo;s your
            <br />
            <span
              className="inline-block px-2 text-white"
              style={{ backgroundColor: BLUE }}
            >
              birth
            </span>{" "}
            <span className="inline-block px-2" style={{ backgroundColor: PINK }}>
              arcana?
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg font-bold md:text-xl">
            Your birth date hides one of the 22 Major Arcana. Punch in the
            numbers. Get the card. No sign-up, no incense required.
          </p>

          <form
            onSubmit={handleSubmit}
            className="v4-shadow mt-8 border-4 border-black bg-white"
          >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto]">
              {(
                [
                  { label: "Day", value: day, set: setDay, placeholder: "DD", max: 31, bg: "#ffffff" },
                  { label: "Month", value: month, set: setMonth, placeholder: "MM", max: 12, bg: PINK },
                  { label: "Year", value: year, set: setYear, placeholder: "YYYY", max: 9999, bg: "#ffffff" },
                ] as const
              ).map((field) => (
                <label
                  key={field.label}
                  className="block border-b-4 border-black px-4 py-4 md:border-b-0 md:border-r-4"
                  style={{ backgroundColor: field.bg }}
                >
                  <span className="v4-heading mb-2 block text-xs uppercase tracking-[0.25em]">
                    {field.label}
                  </span>
                  <input
                    className="v4-input"
                    type="number"
                    inputMode="numeric"
                    placeholder={field.placeholder}
                    min={1}
                    max={field.max}
                    value={field.value}
                    onChange={(e) => field.set(e.target.value)}
                    aria-label={`Birth ${field.label.toLowerCase()}`}
                  />
                </label>
              ))}
              <div className="flex items-stretch">
                <button
                  type="submit"
                  className="v4-btn v4-heading v4-shadow-sm m-4 w-full border-4 border-black px-8 py-4 text-2xl uppercase"
                  style={{ backgroundColor: YELLOW }}
                >
                  Reveal →
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div
              className="v4-shadow v4-pop mt-6 flex items-center gap-4 border-4 border-black px-5 py-4"
              style={{ backgroundColor: PINK }}
              role="alert"
            >
              <span className="v4-heading text-3xl">⚠</span>
              <p className="v4-heading text-sm uppercase tracking-wider md:text-base">
                {error}
              </p>
            </div>
          )}

          {/* THE MATH — one line */}
          <p className="mt-8 max-w-2xl border-4 border-black bg-white px-4 py-3 font-mono text-sm font-bold">
            THE MATH: sum every digit of your birth date, reduce until it lands
            on 1–22. Land on 22? That&rsquo;s The Fool — never reduced.
          </p>
        </div>
      </section>

      {/* 3 — ALL 22 CARDS */}
      <section className="border-b-4 border-black bg-white">
        <div className="flex items-stretch border-b-4 border-black">
          <div
            className="flex items-center border-r-4 border-black px-4 py-3 font-black text-black"
            style={{ backgroundColor: YELLOW }}
          >
            <span className="text-2xl leading-none md:text-3xl">01</span>
          </div>
          <h2
            className="v4-heading flex flex-1 items-center px-4 py-3 text-2xl uppercase leading-none md:text-4xl"
            style={{ backgroundColor: BLUE, color: "#ffffff" }}
          >
            All 22 cards — pick your fighter
          </h2>
        </div>
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {ARCANA.map((card) => (
              <MiniRisoCard key={card.number} card={card} />
            ))}
          </div>
          <p className="mt-8 font-bold">
            ↑ Every card is a misregistered 2-color riso print. Click one to
            read it.
          </p>
        </div>
      </section>

      {/* 4 — FOOTER */}
      <V4Footer />
    </main>
  );
}
