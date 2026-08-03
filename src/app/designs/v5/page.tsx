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
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const pad = (n: number): string => String(n).padStart(2, "0");

function GradientText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`v5-gradient-text ${className}`}>{children}</span>
  );
}

/* ------------------------------------------------------------------ */
/* Small glass building blocks                                         */
/* ------------------------------------------------------------------ */

function Chip({ label, accent = "rgba(255,255,255,0.55)" }: { label: string; accent?: string }) {
  return (
    <span className="v5-chip" style={{ color: accent }}>
      {label}
    </span>
  );
}

function KeywordPill({ label }: { label: string }) {
  return <span className="v5-pill">{label}</span>;
}

function SectionHeading({ kicker, title }: { kicker: string; title: React.ReactNode }) {
  return (
    <div className="mb-8 text-center">
      <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.35em] text-teal-200/70">
        {kicker}
      </p>
      <h2 className="text-3xl font-light tracking-tight text-white/90 sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Aurora background                                                   */
/* ------------------------------------------------------------------ */

function AuroraBackdrop() {
  return (
    <div className="v5-aurora" aria-hidden="true">
      <div className="v5-blob v5-blob-violet" />
      <div className="v5-blob v5-blob-teal" />
      <div className="v5-blob v5-blob-magenta" />
      <div className="v5-stars" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Result panel                                                        */
/* ------------------------------------------------------------------ */

function ResultPanel({ card, animKey }: { card: ArcanaCard | null; animKey: number }) {
  if (!card) {
    return (
      <section className="v5-glass v5-rise mx-auto w-full max-w-3xl px-8 py-14 text-center sm:px-14">
        <div className="v5-orb v5-orb-empty mx-auto mb-6">
          <span className="v5-orb-number text-white/30">?</span>
        </div>
        <p className="text-lg font-light text-white/50">
          The sky is quiet. Enter your birth date above and the stars
          will answer.
        </p>
      </section>
    );
  }

  return (
    <section
      key={animKey}
      className="v5-glass v5-rise mx-auto w-full max-w-3xl px-8 py-14 text-center sm:px-14"
    >
      <div className="v5-orb mx-auto mb-6">
        <span className="v5-orb-number">{pad(card.number)}</span>
      </div>
      <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.35em] text-white/40">
        Your birth arcana
      </p>
      <h3 className="mb-6 text-4xl font-light tracking-tight sm:text-5xl">
        <GradientText>{card.name}</GradientText>
      </h3>
      <div className="mb-7 flex flex-wrap items-center justify-center gap-2">
        {card.keywords.map((k) => (
          <KeywordPill key={k} label={k} />
        ))}
      </div>
      <p className="mx-auto mb-7 max-w-xl text-base font-light leading-relaxed text-white/70">
        {card.mission}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Chip label={`Element · ${card.element}`} accent="rgba(153,246,228,0.9)" />
        <Chip label={`Astrology · ${card.astrology}`} accent="rgba(196,181,253,0.9)" />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function BirthArcanaV5() {
  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ArcanaCard | null>(null);
  const [animKey, setAnimKey] = useState<number>(0);

  const reveal = (n: number) => {
    setResult(getArcana(n));
    setAnimKey((k) => k + 1);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = Number(day);
    const m = Number(month);
    const y = Number(year);

    if (!day || !month || !year) {
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
    if (!Number.isInteger(y) || y < 1000 || y > 9999) {
      setError("Year must be a full four-digit year.");
      return;
    }
    setError(null);
    reveal(calculateBirthArcana(d, m, y));
  };

  const selectFromGrid = (n: number) => {
    setError(null);
    reveal(n);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const compatible = HERMIT.compatibleArcanas.map((n) => getArcana(n));

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#070b1a] font-sans text-white antialiased selection:bg-fuchsia-400/30">
      <AuroraBackdrop />

      {/* Scoped styles — every class prefixed v5- */}
      <style>{`
        .v5-aurora {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .v5-blob {
          position: absolute;
          border-radius: 9999px;
          filter: blur(90px);
          opacity: 0.55;
          will-change: transform;
        }
        .v5-blob-violet {
          width: 55vmax; height: 55vmax;
          top: -18vmax; left: -12vmax;
          background: radial-gradient(circle at 35% 35%, rgba(139,92,246,0.55), transparent 65%);
          animation: v5-drift-a 26s ease-in-out infinite alternate;
        }
        .v5-blob-teal {
          width: 48vmax; height: 48vmax;
          top: 30%; right: -16vmax;
          background: radial-gradient(circle at 60% 40%, rgba(45,212,191,0.42), transparent 65%);
          animation: v5-drift-b 32s ease-in-out infinite alternate;
        }
        .v5-blob-magenta {
          width: 42vmax; height: 42vmax;
          bottom: -14vmax; left: 22%;
          background: radial-gradient(circle at 50% 50%, rgba(217,70,239,0.38), transparent 65%);
          animation: v5-drift-c 38s ease-in-out infinite alternate;
        }
        @keyframes v5-drift-a {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(9vmax, 6vmax) scale(1.12); }
          100% { transform: translate(-4vmax, 12vmax) scale(0.94); }
        }
        @keyframes v5-drift-b {
          0%   { transform: translate(0, 0) scale(1.05); }
          50%  { transform: translate(-10vmax, -7vmax) scale(0.92); }
          100% { transform: translate(-5vmax, 8vmax) scale(1.15); }
        }
        @keyframes v5-drift-c {
          0%   { transform: translate(0, 0) scale(0.95); }
          50%  { transform: translate(8vmax, -9vmax) scale(1.1); }
          100% { transform: translate(-7vmax, -3vmax) scale(1); }
        }
        .v5-stars {
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(1px 1px at 12% 22%, rgba(255,255,255,0.7) 50%, transparent 51%),
            radial-gradient(1px 1px at 38% 8%, rgba(255,255,255,0.45) 50%, transparent 51%),
            radial-gradient(1.5px 1.5px at 67% 18%, rgba(255,255,255,0.6) 50%, transparent 51%),
            radial-gradient(1px 1px at 84% 34%, rgba(255,255,255,0.4) 50%, transparent 51%),
            radial-gradient(1px 1px at 24% 58%, rgba(255,255,255,0.5) 50%, transparent 51%),
            radial-gradient(1.5px 1.5px at 55% 72%, rgba(255,255,255,0.35) 50%, transparent 51%),
            radial-gradient(1px 1px at 78% 84%, rgba(255,255,255,0.55) 50%, transparent 51%),
            radial-gradient(1px 1px at 8% 88%, rgba(255,255,255,0.35) 50%, transparent 51%),
            radial-gradient(1px 1px at 92% 62%, rgba(255,255,255,0.45) 50%, transparent 51%);
          animation: v5-twinkle 7s ease-in-out infinite alternate;
        }
        @keyframes v5-twinkle {
          from { opacity: 0.5; }
          to   { opacity: 1; }
        }

        .v5-glass {
          position: relative;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 24px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.14),
            inset 0 0 60px rgba(139,92,246,0.06),
            0 24px 60px rgba(0,0,0,0.45);
        }

        .v5-gradient-text {
          background: linear-gradient(100deg, #a5b4fc 0%, #e9d5ff 35%, #f0abfc 60%, #99f6e4 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .v5-orb {
          width: 132px;
          height: 132px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(circle at 32% 28%, rgba(255,255,255,0.22), rgba(255,255,255,0.04) 55%),
            rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.18);
          box-shadow:
            0 0 0 6px rgba(139,92,246,0.10),
            0 0 0 14px rgba(45,212,191,0.05),
            0 0 52px rgba(139,92,246,0.45),
            inset 0 0 28px rgba(217,70,239,0.18);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .v5-orb-empty {
          box-shadow:
            0 0 0 6px rgba(255,255,255,0.04),
            inset 0 0 24px rgba(255,255,255,0.05);
        }
        .v5-orb-number {
          font-size: 2.9rem;
          font-weight: 200;
          letter-spacing: 0.08em;
          color: #f5f3ff;
          text-shadow:
            0 0 14px rgba(196,181,253,0.9),
            0 0 42px rgba(217,70,239,0.55);
        }

        .v5-pill {
          display: inline-flex;
          align-items: center;
          padding: 0.35rem 0.95rem;
          border-radius: 9999px;
          font-size: 0.78rem;
          font-weight: 400;
          letter-spacing: 0.06em;
          color: rgba(240,171,252,0.92);
          background: rgba(217,70,239,0.10);
          border: 1px solid rgba(217,70,239,0.28);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .v5-chip {
          display: inline-flex;
          align-items: center;
          padding: 0.45rem 1.05rem;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 400;
          letter-spacing: 0.05em;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.14);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .v5-input {
          width: 100%;
          border-radius: 16px;
          padding: 0.85rem 1rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.14);
          color: #fff;
          font-size: 1.05rem;
          font-weight: 300;
          text-align: center;
          letter-spacing: 0.12em;
          outline: none;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }
        .v5-input::placeholder {
          color: rgba(255,255,255,0.28);
          letter-spacing: 0.06em;
        }
        .v5-input:focus {
          border-color: rgba(167,139,250,0.65);
          background: rgba(255,255,255,0.08);
          box-shadow: 0 0 0 4px rgba(139,92,246,0.16), 0 0 26px rgba(139,92,246,0.25);
        }
        .v5-input::-webkit-outer-spin-button,
        .v5-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .v5-input[type="number"] {
          -moz-appearance: textfield;
          appearance: textfield;
        }

        .v5-cta {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          border-radius: 9999px;
          padding: 0.95rem 2.4rem;
          font-size: 0.95rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: #0b0722;
          background: linear-gradient(100deg, #a5b4fc, #e9d5ff 40%, #f0abfc 70%, #99f6e4);
          border: none;
          cursor: pointer;
          box-shadow:
            0 0 30px rgba(139,92,246,0.45),
            0 8px 28px rgba(217,70,239,0.30),
            inset 0 1px 0 rgba(255,255,255,0.55);
          transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
        }
        .v5-cta:hover {
          transform: translateY(-2px);
          filter: brightness(1.08);
          box-shadow:
            0 0 44px rgba(139,92,246,0.6),
            0 14px 36px rgba(217,70,239,0.4),
            inset 0 1px 0 rgba(255,255,255,0.6);
        }
        .v5-cta:active {
          transform: translateY(0);
        }

        .v5-tile {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.35rem;
          border-radius: 20px;
          padding: 1.1rem 1.2rem;
          text-align: left;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.10);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
                      border-color 0.3s ease,
                      box-shadow 0.3s ease,
                      background 0.3s ease;
        }
        .v5-tile:hover {
          transform: translateY(-5px);
          background: rgba(255,255,255,0.08);
          border-color: rgba(167,139,250,0.45);
          box-shadow:
            0 0 28px rgba(139,92,246,0.28),
            0 16px 34px rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(255,255,255,0.16);
        }
        .v5-tile-number {
          font-size: 1.35rem;
          font-weight: 200;
          letter-spacing: 0.1em;
          color: #ddd6fe;
          text-shadow: 0 0 12px rgba(167,139,250,0.7);
        }

        .v5-compat {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 1.2rem;
          border-radius: 9999px;
          font-size: 0.85rem;
          letter-spacing: 0.04em;
          color: rgba(153,246,228,0.95);
          background: rgba(45,212,191,0.08);
          border: 1px solid rgba(45,212,191,0.30);
          cursor: pointer;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .v5-compat:hover {
          transform: translateY(-2px);
          border-color: rgba(45,212,191,0.6);
          box-shadow: 0 0 24px rgba(45,212,191,0.35);
        }

        .v5-rise {
          animation: v5-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes v5-rise {
          from { opacity: 0; transform: translateY(26px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .v5-nav-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.55rem 1.25rem;
          border-radius: 9999px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.14);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 10px 30px rgba(0,0,0,0.35);
        }

        .v5-list-item {
          position: relative;
          padding-left: 1.4rem;
          font-weight: 300;
          line-height: 1.65;
          color: rgba(255,255,255,0.72);
        }
        .v5-list-item::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.72em;
          width: 7px;
          height: 7px;
          border-radius: 9999px;
          background: linear-gradient(135deg, #a78bfa, #5eead4);
          box-shadow: 0 0 8px rgba(167,139,250,0.7);
        }

        @media (prefers-reduced-motion: reduce) {
          .v5-blob,
          .v5-stars,
          .v5-rise {
            animation: none !important;
          }
          .v5-tile,
          .v5-cta,
          .v5-compat,
          .v5-input {
            transition: none !important;
          }
          .v5-tile:hover,
          .v5-cta:hover,
          .v5-compat:hover {
            transform: none !important;
          }
        }
      `}</style>

      {/* ---------------------------------------------------------- */}
      {/* 1 · Nav                                                     */}
      {/* ---------------------------------------------------------- */}
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
        {/* -------------------------------------------------------- */}
        {/* 2 · Hero + calculator                                     */}
        {/* -------------------------------------------------------- */}
        <section className="pt-20 pb-14 text-center">
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
              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/40">
                  Day
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="14"
                  min={1}
                  max={31}
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="v5-input"
                  aria-label="Birth day"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/40">
                  Month
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="07"
                  min={1}
                  max={12}
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="v5-input"
                  aria-label="Birth month"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/40">
                  Year
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="1990"
                  min={1000}
                  max={9999}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="v5-input"
                  aria-label="Birth year"
                />
              </label>
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
        </section>

        {/* -------------------------------------------------------- */}
        {/* 3 · Result                                                */}
        {/* -------------------------------------------------------- */}
        <div className="pb-24">
          <ResultPanel card={result} animKey={animKey} />
        </div>

        {/* -------------------------------------------------------- */}
        {/* 4 · What is Birth Arcana?                                 */}
        {/* -------------------------------------------------------- */}
        <section className="pb-24">
          <SectionHeading
            kicker="The method"
            title={<>What is <GradientText>Birth Arcana?</GradientText></>}
          />
          <div className="v5-glass v5-rise mx-auto max-w-3xl px-8 py-10 sm:px-12">
            <div className="space-y-5 text-base font-light leading-relaxed text-white/70">
              <p>
                Birth Arcana is a numerological bridge between your birth
                date and the twenty-two Major Arcana of the tarot. The idea
                is simple: the moment you arrived carries a signature, and
                that signature maps to one archetypal card.
              </p>
              <p>
                Unlike zodiac signs, which follow the position of the sun,
                your birth arcana is derived purely from the numbers of
                your date — a personal constant that never changes. It is
                read as a lens on your temperament, your recurring lessons,
                and the role you tend to play in other people&apos;s stories.
              </p>
            </div>
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md">
              <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[0.3em] text-teal-200/80">
                How it&apos;s calculated
              </h3>
              <p className="text-sm font-light leading-relaxed text-white/65">
                Write your full birth date — day, month, year — and add
                every digit together. If the total is greater than 22, add
                its digits again, and repeat until the number falls between
                1 and 22. That number is your arcana: 1 is The Magician,
                9 is The Hermit, and 22 is kept whole as The Fool — the
                soul at the very beginning of the journey.
              </p>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/* 5 · All 22 arcanas                                        */}
        {/* -------------------------------------------------------- */}
        <section className="pb-24">
          <SectionHeading
            kicker="The full deck"
            title={<>All <GradientText>22 Arcanas</GradientText></>}
          />
          <p className="mx-auto -mt-4 mb-8 max-w-md text-center text-sm font-light text-white/45">
            Tap any card to read it in the observatory above.
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {ARCANA.map((card) => (
              <button
                key={card.number}
                type="button"
                onClick={() => selectFromGrid(card.number)}
                className="v5-tile"
              >
                <span className="v5-tile-number">{pad(card.number)}</span>
                <span className="text-sm font-normal text-white/85">
                  {card.name}
                </span>
                <span className="text-xs font-light italic text-white/40">
                  {card.keywords[0]}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/* 6 · The Hermit deep-dive                                  */}
        {/* -------------------------------------------------------- */}
        <section className="pb-24">
          <SectionHeading
            kicker="Deep dive"
            title={<>The Hermit · <GradientText>09</GradientText></>}
          />

          <div className="mx-auto max-w-4xl space-y-6">
            {/* Keywords + associations */}
            <div className="v5-glass v5-rise px-8 py-9 sm:px-12">
              <div className="mb-6 flex flex-wrap justify-center gap-2">
                {HERMIT.keywords.map((k) => (
                  <KeywordPill key={k} label={k} />
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Chip label={`Element · ${HERMIT.element}`} accent="rgba(153,246,228,0.9)" />
                <Chip label={`Numerology · ${HERMIT.numerology}`} accent="rgba(196,181,253,0.9)" />
                <Chip label={`Astrology · ${HERMIT.astrology}`} accent="rgba(240,171,252,0.9)" />
              </div>
            </div>

            {/* Upright / Reversed */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="v5-glass v5-rise px-7 py-8">
                <h3 className="mb-3 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.25em] text-teal-200/85">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-300 shadow-[0_0_8px_rgba(94,234,212,0.9)]" />
                  Upright
                </h3>
                <p className="text-sm font-light leading-relaxed text-white/70">
                  {HERMIT.upright}
                </p>
              </div>
              <div className="v5-glass v5-rise px-7 py-8">
                <h3 className="mb-3 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.25em] text-fuchsia-300/85">
                  <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_8px_rgba(240,171,252,0.9)]" />
                  Reversed
                </h3>
                <p className="text-sm font-light leading-relaxed text-white/70">
                  {HERMIT.reversed}
                </p>
              </div>
            </div>

            {/* Strengths / Growth */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="v5-glass v5-rise px-7 py-8">
                <h3 className="mb-5 text-sm font-medium uppercase tracking-[0.25em] text-violet-300/85">
                  Strengths
                </h3>
                <ul className="space-y-3 text-sm">
                  {HERMIT.strengths.map((s) => (
                    <li key={s} className="v5-list-item">{s}</li>
                  ))}
                </ul>
              </div>
              <div className="v5-glass v5-rise px-7 py-8">
                <h3 className="mb-5 text-sm font-medium uppercase tracking-[0.25em] text-violet-300/85">
                  Growth areas
                </h3>
                <ul className="space-y-3 text-sm">
                  {HERMIT.growthAreas.map((g) => (
                    <li key={g} className="v5-list-item">{g}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Karmic lessons */}
            <div className="v5-glass v5-rise px-8 py-9 sm:px-12">
              <h3 className="mb-5 text-sm font-medium uppercase tracking-[0.25em] text-violet-300/85">
                Karmic lessons
              </h3>
              <ul className="space-y-3 text-sm">
                {HERMIT.karmicLessons.map((k) => (
                  <li key={k} className="v5-list-item">{k}</li>
                ))}
              </ul>
            </div>

            {/* Life purpose — highlighted */}
            <div className="v5-glass v5-rise relative overflow-hidden px-8 py-10 text-center sm:px-14">
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.22), transparent 60%)",
                }}
                aria-hidden="true"
              />
              <h3 className="relative mb-4 text-[11px] font-medium uppercase tracking-[0.35em] text-white/50">
                Life purpose
              </h3>
              <p className="relative mx-auto max-w-2xl text-lg font-light leading-relaxed text-white/85">
                {HERMIT.lifePurpose}
              </p>
            </div>

            {/* Compatible arcanas */}
            <div className="v5-glass v5-rise px-8 py-9 text-center sm:px-12">
              <h3 className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-teal-200/85">
                Compatible arcanas
              </h3>
              <p className="mb-6 text-xs font-light text-white/40">
                Cards whose frequency harmonises with the Hermit&apos;s lantern.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {compatible.map((c) => (
                  <button
                    key={c.number}
                    type="button"
                    onClick={() => selectFromGrid(c.number)}
                    className="v5-compat"
                  >
                    <span className="font-extralight tracking-[0.1em]">
                      {pad(c.number)}
                    </span>
                    <span aria-hidden="true" className="text-white/30">·</span>
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---------------------------------------------------------- */}
      {/* 7 · Footer                                                  */}
      {/* ---------------------------------------------------------- */}
      <footer className="relative z-10 border-t border-white/[0.07] py-10 text-center">
        <p className="text-[11px] font-light uppercase tracking-[0.3em] text-white/35">
          Astro Scope — design variant v5 · Aurora Glass
        </p>
      </footer>
    </div>
  );
}
