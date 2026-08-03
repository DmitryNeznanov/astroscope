"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import {
  ARCANA,
  HERMIT,
  calculateBirthArcana,
  getArcana,
} from "@/lib/arcana";
import type { ArcanaCard } from "@/lib/arcana";

/* ------------------------------------------------------------------ */
/* Design tokens                                                       */
/* ------------------------------------------------------------------ */

const YELLOW = "#ffe600";
const PINK = "#ff5da2";
const BLUE = "#2b5bff";

/** Rotating accent palette for the "ALL 22 CARDS" tiles. */
const TILE_ACCENTS = [YELLOW, PINK, BLUE, "#ffffff"];

const STICKER_COLORS = [PINK, BLUE, YELLOW, "#ffffff"];

/* ------------------------------------------------------------------ */
/* Small building blocks                                             */
/* ------------------------------------------------------------------ */

function Sticker({
  children,
  color,
  rotate = -2,
}: {
  children: React.ReactNode;
  color: string;
  rotate?: number;
}) {
  return (
    <span
      className="v4-sticker"
      style={{
        backgroundColor: color,
        color: color === BLUE ? "#ffffff" : "#000000",
        transform: `rotate(${rotate}deg)`,
      }}
    >
      {children}
    </span>
  );
}

function SectionHeader({
  index,
  title,
  bg,
  textColor = "#000000",
}: {
  index: string;
  title: string;
  bg: string;
  textColor?: string;
}) {
  return (
    <div className="flex items-stretch border-b-4 border-black">
      <div
        className="flex items-center border-r-4 border-black px-4 py-3 font-black text-black"
        style={{ backgroundColor: YELLOW }}
      >
        <span className="text-2xl leading-none md:text-3xl">{index}</span>
      </div>
      <h2
        className="v4-heading flex flex-1 items-center px-4 py-3 text-2xl uppercase leading-none md:text-4xl"
        style={{ backgroundColor: bg, color: textColor }}
      >
        {title}
      </h2>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function DesignV4Page() {
  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ArcanaCard | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const d = Number(day);
    const m = Number(month);
    const y = Number(year);

    if (!day.trim() || !month.trim() || !year.trim()) {
      setError("ALL THREE FIELDS. NO EXCUSES.");
      setResult(null);
      return;
    }
    if (!Number.isInteger(d) || d < 1 || d > 31) {
      setError("DAY MUST BE 1–31. CHECK THE CALENDAR.");
      setResult(null);
      return;
    }
    if (!Number.isInteger(m) || m < 1 || m > 12) {
      setError("MONTH MUST BE 1–12. THERE ARE ONLY TWELVE.");
      setResult(null);
      return;
    }
    if (!/^\d{4}$/.test(year.trim())) {
      setError("YEAR MUST BE 4 DIGITS. LIKE 1994.");
      setResult(null);
      return;
    }

    setError(null);
    setResult(getArcana(calculateBirthArcana(d, m, y)));
  }

  function pickCard(card: ArcanaCard) {
    setError(null);
    setResult(card);
  }

  return (
    <main className="min-h-screen bg-white font-sans text-black">
      <style>{`
        .v4-heading {
          font-family: "Arial Black", "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-weight: 900;
          letter-spacing: -0.02em;
        }
        .v4-shadow {
          box-shadow: 6px 6px 0 #000;
        }
        .v4-shadow-sm {
          box-shadow: 4px 4px 0 #000;
        }
        .v4-sticker {
          display: inline-block;
          border: 3px solid #000;
          padding: 0.25rem 0.75rem;
          font-weight: 900;
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 0.05em;
          box-shadow: 3px 3px 0 #000;
          white-space: nowrap;
        }
        .v4-btn {
          transition: transform 80ms ease, box-shadow 80ms ease, background-color 120ms ease, color 120ms ease;
        }
        .v4-btn:hover {
          background-color: #000;
          color: ${YELLOW};
        }
        .v4-btn:active {
          transform: translate(6px, 6px);
          box-shadow: 0 0 0 #000;
        }
        .v4-btn-sm:active {
          transform: translate(4px, 4px);
          box-shadow: 0 0 0 #000;
        }
        .v4-tile {
          transition: transform 100ms ease, box-shadow 100ms ease, background-color 120ms ease, color 120ms ease;
          cursor: pointer;
        }
        .v4-tile:hover {
          background-color: #000 !important;
          color: ${YELLOW} !important;
          transform: translate(-2px, -2px);
          box-shadow: 8px 8px 0 #000;
        }
        .v4-tile:hover .v4-tile-num {
          color: ${PINK};
        }
        .v4-tile:active {
          transform: translate(4px, 4px);
          box-shadow: 0 0 0 #000;
        }
        .v4-input {
          border: 3px solid #000;
          background: #fff;
          padding: 0.75rem 1rem;
          font-size: 1.5rem;
          font-weight: 900;
          width: 100%;
          text-align: center;
          outline: none;
          border-radius: 0;
        }
        .v4-input:focus {
          background: ${YELLOW};
          box-shadow: 4px 4px 0 #000;
        }
        .v4-input::placeholder {
          color: #999;
        }
        .v4-marquee {
          overflow: hidden;
          white-space: nowrap;
        }
        .v4-marquee-track {
          display: inline-block;
          animation: v4-marquee 18s linear infinite;
        }
        @keyframes v4-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .v4-result-enter {
          animation: v4-pop 240ms cubic-bezier(0.2, 1.6, 0.4, 1);
        }
        @keyframes v4-pop {
          from { transform: scale(0.92) rotate(-1deg); opacity: 0; }
          to { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>

      {/* 1 — TOP BAR */}
      <header className="border-b-4 border-black bg-black text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <p className="v4-heading text-sm uppercase tracking-widest md:text-base">
            Astro Scope ★ Birth Arcana Calculator
          </p>
          <div style={{ transform: "rotate(6deg)" }}>
            <span
              className="v4-sticker"
              style={{ backgroundColor: YELLOW, color: "#000", boxShadow: "3px 3px 0 #fff" }}
            >
              100% Free
            </span>
          </div>
        </div>
        <div className="v4-marquee border-t-4 border-black py-1" style={{ backgroundColor: PINK }}>
          <div className="v4-marquee-track v4-heading text-xs uppercase tracking-[0.3em] text-black">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <span key={j} className="mx-4">
                    22 cards ★ one birth date ★ zero mercy ★ find your arcana ★
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* 2 — HERO + CALCULATOR */}
      <section className="border-b-4 border-black" style={{ backgroundColor: YELLOW }}>
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
          <h1 className="v4-heading text-5xl uppercase leading-[0.9] md:text-8xl">
            What&rsquo;s your
            <br />
            <span
              className="inline-block px-2 text-white"
              style={{ backgroundColor: BLUE }}
            >
              birth
            </span>{" "}
            <span
              className="inline-block px-2"
              style={{ backgroundColor: PINK }}
            >
              arcana?
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg font-bold md:text-xl">
            Your birth date hides one of the 22 Major Arcana. Punch in the
            numbers. Get the card. No sign-up, no incense required.
          </p>

          <form
            onSubmit={handleSubmit}
            className="v4-shadow mt-10 border-4 border-black bg-white"
          >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto]">
              {(
                [
                  { label: "Day", value: day, set: setDay, placeholder: "DD", max: "31", bg: "#ffffff" },
                  { label: "Month", value: month, set: setMonth, placeholder: "MM", max: "12", bg: PINK },
                  { label: "Year", value: year, set: setYear, placeholder: "YYYY", max: "9999", bg: "#ffffff" },
                ] as const
              ).map((field, i) => (
                <label
                  key={field.label}
                  className={`block border-black px-4 py-4 ${
                    i < 2 ? "border-b-4 md:border-b-0 md:border-r-4" : "border-b-4 md:border-b-0 md:border-r-4"
                  }`}
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
                    max={Number(field.max)}
                    value={field.value}
                    onChange={(e) => field.set(e.target.value)}
                  />
                </label>
              ))}
              <div className="flex items-stretch">
                <button
                  type="submit"
                  className="v4-btn v4-heading v4-shadow-sm m-4 w-full border-4 border-black px-8 py-4 text-2xl uppercase md:m-4"
                  style={{ backgroundColor: YELLOW }}
                >
                  Reveal →
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div
              className="v4-shadow v4-result-enter mt-6 flex items-center gap-4 border-4 border-black px-5 py-4"
              style={{ backgroundColor: PINK }}
              role="alert"
            >
              <span className="v4-heading text-3xl">⚠</span>
              <p className="v4-heading text-sm uppercase tracking-wider md:text-base">
                {error}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 3 — RESULT PANEL */}
      <section className="border-b-4 border-black bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          {result ? (
            <div key={result.number} className="v4-result-enter">
              <div className="v4-shadow border-4 border-black">
                <div className="flex flex-col md:flex-row">
                  <div
                    className="v4-heading flex items-center justify-center border-b-4 border-black px-8 py-10 text-8xl md:border-b-0 md:border-r-4 md:text-9xl"
                    style={{ backgroundColor: BLUE, color: "#ffffff" }}
                  >
                    #{result.number}
                  </div>
                  <div className="flex-1">
                    <div className="v4-heading border-b-4 border-black bg-black px-6 py-4 text-3xl uppercase text-white md:text-5xl">
                      {result.name}
                    </div>
                    <div className="flex flex-wrap gap-3 border-b-4 border-black px-6 py-5" style={{ backgroundColor: YELLOW }}>
                      {result.keywords.map((k, i) => (
                        <Sticker
                          key={k}
                          color={STICKER_COLORS[i % STICKER_COLORS.length]}
                          rotate={i % 2 === 0 ? -2 : 2}
                        >
                          {k}
                        </Sticker>
                      ))}
                    </div>
                    <p className="px-6 py-5 text-lg font-bold leading-snug md:text-xl">
                      <span className="v4-heading mr-2 uppercase" style={{ color: BLUE }}>
                        Mission:
                      </span>
                      {result.mission}
                    </p>
                    <div className="flex flex-wrap gap-3 border-t-4 border-black px-6 py-4">
                      <Sticker color="#ffffff" rotate={-1}>
                        ★ Element: {result.element}
                      </Sticker>
                      <Sticker color="#ffffff" rotate={1}>
                        ★ Astrology: {result.astrology}
                      </Sticker>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="v4-shadow border-4 border-dashed border-black px-8 py-14 text-center" style={{ backgroundColor: "#f2f2f2" }}>
              <p className="v4-heading text-2xl uppercase md:text-4xl">
                #?? — waiting for your date
              </p>
              <p className="mt-3 font-bold">
                Fill the form above, or click any card in the grid below.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 4 — WTF IS A BIRTH ARCANA? */}
      <section className="border-b-4 border-black" style={{ backgroundColor: PINK }}>
        <SectionHeader index="01" title="WTF is a birth arcana?" bg="#000000" textColor="#ffffff" />
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.4fr_1fr] md:py-16">
          <div className="space-y-5 text-lg font-bold leading-snug md:text-xl">
            <p>
              Tarot&rsquo;s Major Arcana are 22 archetypes — The Fool to The
              World — a map of every big lesson a human life can hold.
            </p>
            <p>
              Your birth arcana is the card your date of birth reduces to.
              Think of it as the archetype you were issued at the door: your
              default settings, your engine noise.
            </p>
            <p>
              It doesn&rsquo;t predict your future. It names your pattern —
              what you&rsquo;re here to practice, over and over, until you get
              good at it.
            </p>
          </div>
          <div className="v4-shadow h-fit border-4 border-black bg-white">
            <div className="v4-heading border-b-4 border-black bg-black px-4 py-3 text-xl uppercase" style={{ color: YELLOW }}>
              The math
            </div>
            <div className="px-4 py-4 font-bold">
              <p>
                Sum <u>every digit</u> of your birth date. Keep adding the
                digits of the result until it lands between 1 and 22.
              </p>
              <p className="mt-3 border-4 border-black px-3 py-2 font-mono text-sm" style={{ backgroundColor: YELLOW }}>
                14.07.1992 → 1+4+0+7+1+9+9+2 = 33 → 3+3 = <b>6 — The Lovers</b>
              </p>
              <p className="mt-3">
                Land on 22? That&rsquo;s <b>The Fool</b> — kept whole, never
                reduced to 4. Rules are rules, except this one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5 — ALL 22 CARDS GRID */}
      <section className="border-b-4 border-black bg-white">
        <SectionHeader index="02" title="All 22 cards — pick your fighter" bg={BLUE} textColor="#ffffff" />
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {ARCANA.map((card, i) => {
              const accent = TILE_ACCENTS[i % TILE_ACCENTS.length];
              const active = result?.number === card.number;
              return (
                <button
                  key={card.number}
                  type="button"
                  onClick={() => pickCard(card)}
                  className={`v4-tile v4-shadow-sm border-4 border-black p-4 text-left ${
                    active ? "ring-4 ring-black ring-offset-2" : ""
                  }`}
                  style={{ backgroundColor: active ? "#000000" : accent, color: active ? YELLOW : "#000000" }}
                >
                  <span
                    className="v4-tile-num v4-heading block text-4xl leading-none"
                    style={{ color: active ? PINK : "#000000" }}
                  >
                    Nº{String(card.number).padStart(2, "0")}
                  </span>
                  <span className="v4-heading mt-2 block text-sm uppercase leading-tight">
                    {card.name}
                  </span>
                  <span className="mt-2 block text-xs font-bold uppercase tracking-wide">
                    {card.keywords[0]}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-6 font-bold">
            ↑ Click a tile to load it into the result panel.
          </p>
        </div>
      </section>

      {/* 6 — HERMIT DEEP DIVE */}
      <section className="border-b-4 border-black" style={{ backgroundColor: YELLOW }}>
        <SectionHeader index="03" title="The Hermit #9 — deep dive" bg={PINK} />
        <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 md:py-16">
          {/* keywords */}
          <div className="flex flex-wrap gap-3">
            {HERMIT.keywords.map((k, i) => (
              <Sticker
                key={k}
                color={STICKER_COLORS[i % STICKER_COLORS.length]}
                rotate={i % 2 === 0 ? -3 : 2}
              >
                {k}
              </Sticker>
            ))}
          </div>

          {/* upright / reversed */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="v4-shadow border-4 border-black" style={{ backgroundColor: BLUE }}>
              <div className="v4-heading border-b-4 border-black bg-black px-4 py-2 text-lg uppercase text-white">
                ↑ Upright
              </div>
              <p className="px-4 py-4 font-bold leading-snug text-white">
                {HERMIT.upright}
              </p>
            </div>
            <div className="v4-shadow border-4 border-black bg-white">
              <div className="v4-heading border-b-4 border-black px-4 py-2 text-lg uppercase text-black" style={{ backgroundColor: PINK }}>
                ↓ Reversed
              </div>
              <p className="px-4 py-4 font-bold leading-snug">
                {HERMIT.reversed}
              </p>
            </div>
          </div>

          {/* associations */}
          <div className="v4-shadow border-4 border-black bg-white">
            <div className="v4-heading border-b-4 border-black bg-black px-4 py-2 text-lg uppercase text-white">
              Associations
            </div>
            <div className="grid md:grid-cols-3">
              {(
                [
                  ["Element", HERMIT.element],
                  ["Numerology", HERMIT.numerology],
                  ["Astrology", HERMIT.astrology],
                ] as const
              ).map(([label, value], i) => (
                <div
                  key={label}
                  className={`px-4 py-4 ${i < 2 ? "border-b-4 border-black md:border-b-0 md:border-r-4" : ""}`}
                >
                  <p className="v4-heading text-xs uppercase tracking-[0.25em]" style={{ color: BLUE }}>
                    {label}
                  </p>
                  <p className="mt-2 font-bold leading-snug">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* strengths vs growth */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="v4-shadow border-4 border-black bg-white">
              <div className="v4-heading border-b-4 border-black px-4 py-2 text-lg uppercase" style={{ backgroundColor: YELLOW }}>
                ✔ Strengths
              </div>
              <ul className="divide-y-4 divide-black">
                {HERMIT.strengths.map((s) => (
                  <li key={s} className="px-4 py-3 font-bold leading-snug">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="v4-shadow border-4 border-black bg-white">
              <div className="v4-heading border-b-4 border-black bg-black px-4 py-2 text-lg uppercase" style={{ color: PINK }}>
                ✘ Growth areas
              </div>
              <ul className="divide-y-4 divide-black">
                {HERMIT.growthAreas.map((g) => (
                  <li key={g} className="px-4 py-3 font-bold leading-snug">
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* karmic lessons */}
          <div className="v4-shadow border-4 border-black" style={{ backgroundColor: PINK }}>
            <div className="v4-heading border-b-4 border-black bg-black px-4 py-2 text-lg uppercase text-white">
              Karmic lessons
            </div>
            <ol className="divide-y-4 divide-black">
              {HERMIT.karmicLessons.map((lesson, i) => (
                <li key={lesson} className="flex items-center gap-4 px-4 py-3">
                  <span className="v4-heading text-3xl">#{i + 1}</span>
                  <span className="font-bold leading-snug">{lesson}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* life purpose */}
          <div className="v4-shadow border-4 border-black bg-black px-6 py-8 md:px-10" style={{ boxShadow: `8px 8px 0 ${BLUE}` }}>
            <p className="v4-heading text-xs uppercase tracking-[0.35em]" style={{ color: PINK }}>
              Life purpose
            </p>
            <p className="v4-heading mt-4 text-xl uppercase leading-snug text-white md:text-3xl">
              &ldquo;{HERMIT.lifePurpose}&rdquo;
            </p>
          </div>

          {/* compatible arcanas */}
          <div>
            <p className="v4-heading mb-4 text-lg uppercase">
              Compatible arcanas →
            </p>
            <div className="flex flex-wrap gap-3">
              {HERMIT.compatibleArcanas.map((n, i) => {
                const card = getArcana(n);
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => pickCard(card)}
                    className="v4-sticker v4-btn v4-btn-sm"
                    style={{
                      backgroundColor: STICKER_COLORS[(i + 1) % STICKER_COLORS.length],
                      color: STICKER_COLORS[(i + 1) % STICKER_COLORS.length] === BLUE ? "#fff" : "#000",
                      transform: `rotate(${i % 2 === 0 ? -2 : 3}deg)`,
                      cursor: "pointer",
                    }}
                  >
                    Nº{String(n).padStart(2, "0")} — {card.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 7 — FOOTER */}
      <footer className="bg-black text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-8 md:flex-row md:items-center">
          <p className="v4-heading text-sm uppercase tracking-widest">
            Astro Scope — Design variant V4 · Neo-Brutalist
          </p>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: YELLOW }}>
            22 cards ★ 1 birthday ★ 0 gradients
          </p>
        </div>
      </footer>
    </main>
  );
}
