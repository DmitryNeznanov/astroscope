"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ARCANA, calculateBirthArcana } from "@/lib/arcana";
import {
  MiniTarotCard,
  V2_BASE_STYLES,
  ACCENT,
  INK,
  PAPER,
  RULE,
} from "./shared";

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

interface BirthDateInput {
  day: string;
  month: string;
  year: string;
}

export default function DesignsV2Page() {
  const router = useRouter();
  const [input, setInput] = useState<BirthDateInput>({
    day: "",
    month: "",
    year: "",
  });
  const [error, setError] = useState<string>("");

  function handleCalculate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const day = Number(input.day);
    const month = Number(input.month);
    const year = Number(input.year);

    if (!input.day || !input.month || !input.year) {
      setError("Please fill in all three fields — day, month and year.");
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
      setError("Year must be a four-digit number, e.g. 1990.");
      return;
    }

    setError("");
    router.push(`/designs/v2/${calculateBirthArcana(day, month, year)}`);
  }

  return (
    <main className="v2-root min-h-screen">
      <style>{V2_BASE_STYLES}</style>

      <div className="mx-auto max-w-5xl px-6 md:px-10">
        {/* ---------- Header ---------- */}
        <header
          className="flex items-baseline justify-between border-b py-6"
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

        {/* ---------- Hero-tool ---------- */}
        <section className="pb-14 pt-14 text-center md:pt-20">
          <p
            className="mb-8 text-[11px] uppercase tracking-[0.3em]"
            style={{ color: ACCENT }}
          >
            Tarot numerology
          </p>
          <h1 className="v2-serif text-5xl font-normal leading-[1.02] tracking-tight md:text-7xl">
            Birth Arcana
            <br />
            Calculator
          </h1>
          <p
            className="mx-auto mt-6 max-w-md text-base leading-relaxed"
            style={{ color: "rgba(26,23,20,0.72)" }}
          >
            Your birth date reduces to one of the twenty-two Major Arcana —
            enter it below to meet your card.
          </p>

          <form onSubmit={handleCalculate} className="mx-auto mt-12 max-w-2xl">
            <div className="flex items-end gap-6 md:gap-10">
              <label className="flex flex-1 flex-col gap-2 text-left">
                <span
                  className="text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: "rgba(26,23,20,0.5)" }}
                >
                  Day
                </span>
                <input
                  className="v2-field w-full text-center text-3xl md:text-4xl"
                  type="number"
                  inputMode="numeric"
                  placeholder="14"
                  min={1}
                  max={31}
                  value={input.day}
                  onChange={(e) =>
                    setInput((s) => ({ ...s, day: e.target.value }))
                  }
                />
              </label>
              <label className="flex flex-1 flex-col gap-2 text-left">
                <span
                  className="text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: "rgba(26,23,20,0.5)" }}
                >
                  Month
                </span>
                <input
                  className="v2-field w-full text-center text-3xl md:text-4xl"
                  type="number"
                  inputMode="numeric"
                  placeholder="09"
                  min={1}
                  max={12}
                  value={input.month}
                  onChange={(e) =>
                    setInput((s) => ({ ...s, month: e.target.value }))
                  }
                />
              </label>
              <label className="flex flex-1 flex-col gap-2 text-left">
                <span
                  className="text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: "rgba(26,23,20,0.5)" }}
                >
                  Year
                </span>
                <input
                  className="v2-field w-full text-center text-3xl md:text-4xl"
                  type="number"
                  inputMode="numeric"
                  placeholder="1990"
                  min={1000}
                  max={9999}
                  value={input.year}
                  onChange={(e) =>
                    setInput((s) => ({ ...s, year: e.target.value }))
                  }
                />
              </label>
              <button
                type="submit"
                className="v2-calc-btn shrink-0 cursor-pointer border px-6 py-3 text-[11px] uppercase tracking-[0.25em]"
                style={{ borderColor: INK, background: INK, color: PAPER }}
              >
                Calculate
              </button>
            </div>
            {error && (
              <p className="mt-4 text-sm" style={{ color: ACCENT }} role="alert">
                {error}
              </p>
            )}
          </form>

          {/* The math, in one hairline-delimited line */}
          <p
            className="mx-auto mt-12 max-w-xl border-y py-4 text-sm leading-relaxed"
            style={{ borderColor: RULE, color: "rgba(26,23,20,0.6)" }}
          >
            The digits of your birth date are summed and reduced until they
            fall between 1 and 22 —{" "}
            <span className="v2-serif">a final 22 is kept as The Fool.</span>
          </p>
        </section>

        {/* ---------- The Index ---------- */}
        <section className="pb-16 md:pb-20">
          <div
            className="flex items-baseline gap-6 border-b pb-5"
            style={{ borderColor: RULE }}
          >
            <span
              className="text-xs uppercase tracking-[0.25em]"
              style={{ color: ACCENT }}
            >
              01
            </span>
            <h2 className="v2-serif text-2xl font-normal tracking-tight md:text-3xl">
              The Index
            </h2>
            <span
              className="ml-auto text-[11px] uppercase tracking-[0.22em]"
              style={{ color: "rgba(26,23,20,0.5)" }}
            >
              01 / 22 cards
            </span>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6">
            {ARCANA.map((card) => (
              <MiniTarotCard key={card.number} card={card} />
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
