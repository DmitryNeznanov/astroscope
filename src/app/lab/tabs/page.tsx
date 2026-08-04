"use client";

// LAB / TABS — "Tab Instruments": eight working tab-bar designs for the sign
// pages (period selector: Today / Tomorrow / Weekly / Monthly / 2026; two
// variants demo the 12-animal switcher instead). Each instrument is fully
// interactive (useState, buttons only — no navigation) and shows a sample
// reading plate that follows the active tab.
// Styling follows the production palette (see lab/remix-v2): deep space
// background, gold/violet accents, translucent plates, engraved caps labels,
// layered low-opacity apparatus behind everything. Broken layout: sections
// alternate offsets and slight rotations, chips straddle borders.
// Self-contained: inline SVG + Tailwind + one scoped <style> block (ltb-
// prefixed). All motion is CSS-only and guarded by prefers-reduced-motion.

import { useState } from "react";
import Link from "next/link";

const DEG = Math.PI / 180;

// production palette, lifted from the live stylesheets
const GOLD = "#f3c77a";
const GOLD_DEEP = "#c9a227";
const CREAM = "#ffdd9c";
const VIOLET = "#a25adf";
const VIOLET_SOFT = "#b794f6";
const TEXT_HI = "#e9e6f2";
const TEXT_LO = "#b7b1cc";

/* ================================ DATA ==================================== */

const FE = "︎"; // variation selector: glyphs render as text, never emoji

const PERIODS = ["Today", "Tomorrow", "Weekly", "Monthly", "2026"] as const;
type Period = (typeof PERIODS)[number];

const READINGS: Record<Period, string> = {
  Today:
    "A quiet aspect steadies the morning — finish one thing before you start three.",
  Tomorrow:
    "The Moon trades whispers with Mercury; say the thing you keep drafting.",
  Weekly:
    "Midweek tension resolves into momentum — spend Friday on what matters.",
  Monthly:
    "A slow transit re-draws the month’s map; the detour is the route.",
  "2026":
    "The year opens a long corridor: commit once, then let consistency compound.",
};

const ROMAN = ["I", "II", "III", "IV", "V"] as const;

const ANIMALS = [
  "Rat",
  "Ox",
  "Tiger",
  "Rabbit",
  "Dragon",
  "Snake",
  "Horse",
  "Goat",
  "Monkey",
  "Rooster",
  "Dog",
  "Pig",
] as const;

const ANIMAL_TRAITS: Record<(typeof ANIMALS)[number], string> = {
  Rat: "reads the room before the room reads it",
  Ox: "moves slowly and arrives exactly on time",
  Tiger: "spends courage first and counts the cost later",
  Rabbit: "wins the argument by leaving it early",
  Dragon: "turns weather into opportunity",
  Snake: "knows the answer and waits to be asked",
  Horse: "runs toward the open gate on principle",
  Goat: "finds the soft path over the hard wall",
  Monkey: "solves the lock by joking with it",
  Rooster: "announces the dawn it intends to cause",
  Dog: "keeps the perimeter and the promise",
  Pig: "enjoys the feast and funds the next one",
};

// deterministic PRNG so the star field is stable between renders
function mulberry32(seed: number) {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STARS = (() => {
  const rnd = mulberry32(20260804);
  return Array.from({ length: 90 }, (_, i) => ({
    x: +(rnd() * 1600).toFixed(0),
    y: +(rnd() * 1000).toFixed(0),
    r: +(0.5 + rnd() * 1.1).toFixed(2),
    o: +(0.12 + rnd() * 0.38).toFixed(2),
    tw: i % 6 === 0,
    d: +(rnd() * 9).toFixed(1),
    key: i,
  }));
})();

// point on a circle measured from the top, clockwise (degrees)
function fromTop(cx: number, cy: number, r: number, deg: number) {
  const t = deg * DEG;
  return { x: +(cx + r * Math.sin(t)).toFixed(1), y: +(cy - r * Math.cos(t)).toFixed(1) };
}

/* ============================ SHARED PIECES =============================== */

function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="ltb-nebula absolute -left-[18vw] top-[6vh] h-[64vmin] w-[64vmin] bg-[radial-gradient(circle,rgba(162,90,223,0.10),transparent_65%)]" />
      <div className="ltb-nebula absolute right-[-14vw] top-[58vh] h-[74vmin] w-[74vmin] bg-[radial-gradient(circle,rgba(243,199,122,0.07),transparent_65%)]" />

      <svg
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        {STARS.map((s) =>
          s.tw ? (
            <circle
              key={s.key}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill={CREAM}
              className="ltb-twinkle"
              style={{ animationDelay: `${s.d}s`, opacity: s.o }}
            />
          ) : (
            <circle key={s.key} cx={s.x} cy={s.y} r={s.r} fill={TEXT_LO} opacity={s.o} />
          ),
        )}

        {/* hairline apparatus: rings, construction lines, a calibration scale */}
        <circle cx={1640} cy={180} r={460} fill="none" stroke={GOLD_DEEP} strokeWidth={0.5} opacity={0.35} />
        <circle cx={1640} cy={180} r={600} fill="none" stroke={GOLD_DEEP} strokeWidth={0.4} opacity={0.2} strokeDasharray="2 7" />
        <circle cx={-120} cy={760} r={380} fill="none" stroke={VIOLET} strokeWidth={0.5} opacity={0.3} />
        <circle cx={-120} cy={760} r={520} fill="none" stroke={VIOLET} strokeWidth={0.4} opacity={0.18} strokeDasharray="2 8" />
        <line x1={-60} y1={140} x2={1660} y2={820} stroke={TEXT_LO} strokeWidth={0.4} opacity={0.15} />
        <line x1={-60} y1={900} x2={1640} y2={80} stroke={TEXT_LO} strokeWidth={0.4} opacity={0.11} />
        <line x1={220} y1={-40} x2={220} y2={1040} stroke={GOLD_DEEP} strokeWidth={0.4} opacity={0.16} strokeDasharray="1 6" />
        {[120, 300, 480, 660, 840].map((y) => (
          <line key={y} x1={212} y1={y} x2={228} y2={y} stroke={GOLD} strokeWidth={0.7} opacity={0.35} />
        ))}

        {/* constellation: a small hook, upper right */}
        <g opacity={0.5}>
          <polyline
            points="1180,150 1252,118 1330,158 1388,116 1436,176"
            fill="none"
            stroke={VIOLET_SOFT}
            strokeWidth={0.6}
            opacity={0.5}
          />
          {[
            [1180, 150],
            [1252, 118],
            [1330, 158],
            [1388, 116],
            [1436, 176],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={1.6} fill={TEXT_HI} opacity={0.75} />
          ))}
        </g>
      </svg>

      <span className="ltb-glyph ltb-float-a absolute right-[4vw] top-[30vh] text-[24vmin] leading-none text-[#b794f6] opacity-[0.05]">
        ☿{FE}
      </span>
      <span className="ltb-glyph ltb-float-b absolute left-[2vw] top-[142vh] text-[28vmin] leading-none text-[#f3c77a] opacity-[0.045]">
        ♃{FE}
      </span>
    </div>
  );
}

// engraved section shell: caps label, one-line note, straddling chip
function SectionShell(props: {
  index: number;
  name: string;
  note: string;
  frame: string;
  chip?: string;
  children: React.ReactNode;
}) {
  const num = String(props.index).padStart(2, "0");
  return (
    <section className={`relative ${props.frame}`}>
      <div className="ltb-panel relative px-5 py-7 md:px-9 md:py-9">
        <span className="ltb-chip absolute -top-3 left-6 rotate-[0.5deg]">
          {props.chip ?? "period selector"}
        </span>
        <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="ltb-label">
            Instrument {num} — {props.name}
          </h2>
          <span className="hidden h-px flex-1 bg-gradient-to-r from-[#c9a227]/40 to-transparent sm:block" />
        </header>
        <p className="mt-2 max-w-2xl text-[12.5px] leading-relaxed text-[#b7b1cc]/85">
          {props.note}
        </p>
        <div className="mt-7">{props.children}</div>
      </div>
    </section>
  );
}

// the sample content plate every instrument drives
function ReadingPlate(props: { kicker: string; line: string }) {
  return (
    <div className="ltb-plate relative mt-6 px-5 py-4">
      <span className="ltb-caps block text-[9px] text-[#b7b1cc]/70">{props.kicker}</span>
      <p className="ltb-serif mt-1.5 text-[15.5px] leading-relaxed text-[#e9e6f2]">
        {props.line}
      </p>
    </div>
  );
}

function usePeriod(): [Period, (p: Period) => void] {
  const [active, setActive] = useState<Period>("Today");
  return [active, setActive];
}

function useAnimal(): [(typeof ANIMALS)[number], (a: (typeof ANIMALS)[number]) => void] {
  const [active, setActive] = useState<(typeof ANIMALS)[number]>("Tiger");
  return [active, setActive];
}

/* ====================== 01 · BRASS REGISTER =============================== */

function BrassRegister() {
  const [active, setActive] = usePeriod();
  return (
    <div>
      <div className="ltb-brass-bed relative flex flex-wrap">
        {PERIODS.map((p, i) => {
          const on = p === active;
          return (
            <button
              key={p}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(p)}
              className={`ltb-brass-tab ${on ? "ltb-brass-on" : ""} ${i > 0 ? "border-l-0" : ""}`}
            >
              <span className="ltb-rivet left-1.5 top-1.5" />
              <span className="ltb-rivet right-1.5 top-1.5" />
              <span className="ltb-caps relative text-[10px]">{p}</span>
              <span className="ltb-rivet bottom-1.5 left-1.5" />
              <span className="ltb-rivet bottom-1.5 right-1.5" />
            </button>
          );
        })}
      </div>
      <ReadingPlate kicker={`Register reading · ${active}`} line={READINGS[active]} />
    </div>
  );
}

/* ========================= 02 · ORBIT DIAL ================================ */

const ORBIT_ANGLES = [-40, -20, 0, 20, 40]; // degrees from vertical
const ORBIT_CX = 300;
const ORBIT_CY = 340;
const ORBIT_R = 270;

function OrbitDial() {
  const [active, setActive] = usePeriod();
  const idx = PERIODS.indexOf(active);
  const arcStart = fromTop(ORBIT_CX, ORBIT_CY, ORBIT_R, -52);
  const arcEnd = fromTop(ORBIT_CX, ORBIT_CY, ORBIT_R, 52);
  return (
    <div>
      <div className="relative mx-auto max-w-[560px]">
        <div className="aspect-[600/230]">
          <svg viewBox="0 0 600 230" className="absolute inset-0 h-full w-full">
            {/* the orbit rail the tabs sit on */}
            <path
              d={`M ${arcStart.x} ${arcStart.y} A ${ORBIT_R} ${ORBIT_R} 0 0 1 ${arcEnd.x} ${arcEnd.y}`}
              fill="none"
              stroke={GOLD_DEEP}
              strokeWidth={1}
              opacity={0.7}
            />
            <path
              d={`M ${arcStart.x} ${arcStart.y} A ${ORBIT_R} ${ORBIT_R} 0 0 1 ${arcEnd.x} ${arcEnd.y}`}
              fill="none"
              stroke={GOLD}
              strokeWidth={3}
              opacity={0.12}
            />
            {/* tick marks between stations */}
            {[-50, -30, -10, 10, 30, 50].map((a) => {
              const p1 = fromTop(ORBIT_CX, ORBIT_CY, ORBIT_R - 7, a);
              const p2 = fromTop(ORBIT_CX, ORBIT_CY, ORBIT_R + 7, a);
              return (
                <line
                  key={a}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={GOLD}
                  strokeWidth={0.7}
                  opacity={0.5}
                />
              );
            })}
            {/* the pointer, pivoting below the frame */}
            <g
              className="ltb-needle"
              style={{ transform: `rotate(${ORBIT_ANGLES[idx]}deg)` }}
            >
              <line
                x1={ORBIT_CX}
                y1={ORBIT_CY}
                x2={ORBIT_CX}
                y2={ORBIT_CY - ORBIT_R - 26}
                stroke={CREAM}
                strokeWidth={1.2}
                opacity={0.9}
              />
              <circle cx={ORBIT_CX} cy={ORBIT_CY - ORBIT_R - 30} r={3.2} fill={CREAM} />
            </g>
          </svg>
          {PERIODS.map((p, i) => {
            const pos = fromTop(ORBIT_CX, ORBIT_CY, ORBIT_R, ORBIT_ANGLES[i]);
            const on = p === active;
            return (
              <button
                key={p}
                type="button"
                aria-pressed={on}
                onClick={() => setActive(p)}
                className={`ltb-orbit-tab ${on ? "ltb-orbit-on" : ""}`}
                style={{
                  left: `${(pos.x / 600) * 100}%`,
                  top: `${(pos.y / 230) * 100}%`,
                }}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>
      <ReadingPlate kicker={`Dial position ${ORBIT_ANGLES[idx]}° · ${active}`} line={READINGS[active]} />
    </div>
  );
}

/* ========================= 03 · CODEX INDEX =============================== */

function CodexIndex() {
  const [active, setActive] = usePeriod();
  const idx = PERIODS.indexOf(active);
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
      <div className="ltb-codex-col relative shrink-0">
        {/* rubric marker slides to the active chapter */}
        <span
          aria-hidden
          className="ltb-codex-marker"
          style={{ top: `calc(${idx} * 3rem + 1.5rem)` }}
        >
          ◆
        </span>
        {PERIODS.map((p, i) => {
          const on = p === active;
          return (
            <button
              key={p}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(p)}
              className={`ltb-codex-tab ${on ? "ltb-codex-on" : ""}`}
            >
              <span className="ltb-serif w-7 text-[15px] italic">{ROMAN[i]}.</span>
              <span className="ltb-caps text-[10px]">{p}</span>
            </button>
          );
        })}
      </div>
      <div className="min-w-0 flex-1">
        <div className="ltb-plate relative h-full px-5 py-5">
          <span className="ltb-caps block text-[9px] text-[#b7b1cc]/70">
            Capitulum {ROMAN[idx]} · {active}
          </span>
          <p className="ltb-serif mt-3 text-[17px] leading-[1.8] text-[#e9e6f2]">
            <span className="ltb-codex-drop">{READINGS[active].slice(0, 1)}</span>
            {READINGS[active].slice(1)}
          </p>
          <span className="mt-4 block h-px w-24 bg-gradient-to-r from-[#c9a227]/60 to-transparent" />
          <span className="ltb-caps mt-2 block text-[8.5px] text-[#b7b1cc]/50">
            fol. {idx + 1} / v · lectio brevis
          </span>
        </div>
      </div>
    </div>
  );
}

/* ===================== 04 · CONSTELLATION NODES =========================== */

// node stations, in a 100x30 design space (container keeps aspect-[10/3])
const NODES = [
  { x: 8, y: 19 },
  { x: 28.5, y: 8 },
  { x: 50, y: 16 },
  { x: 71.5, y: 7 },
  { x: 92, y: 18 },
];

function ConstellationNodes() {
  const [active, setActive] = usePeriod();
  const idx = PERIODS.indexOf(active);
  return (
    <div>
      <div className="relative mx-auto max-w-[640px]">
        <div className="aspect-[10/3]">
          <svg viewBox="0 0 100 30" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
            {NODES.slice(0, -1).map((n, i) => {
              const m = NODES[i + 1];
              const lit = i === idx || i + 1 === idx;
              return (
                <line
                  key={i}
                  x1={n.x}
                  y1={n.y}
                  x2={m.x}
                  y2={m.y}
                  stroke={lit ? GOLD : VIOLET_SOFT}
                  strokeWidth={lit ? 0.45 : 0.25}
                  opacity={lit ? 0.95 : 0.4}
                  className="ltb-link"
                  vectorEffect="non-scaling-stroke"
                  style={{ strokeWidth: lit ? 1.4 : 0.7 }}
                />
              );
            })}
          </svg>
          {NODES.map((n, i) => {
            const on = i === idx;
            return (
              <button
                key={PERIODS[i]}
                type="button"
                aria-pressed={on}
                onClick={() => setActive(PERIODS[i])}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${n.x}%`, top: `${(n.y / 30) * 100}%` }}
              >
                <span className={`ltb-star-node ${on ? "ltb-star-on" : ""}`}>✦</span>
                <span
                  className={`ltb-caps mt-1 block text-[8.5px] transition-colors ${
                    on ? "text-[#ffdd9c]" : "text-[#b7b1cc]/70 group-hover:text-[#b7b1cc]"
                  }`}
                >
                  {PERIODS[i]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <ReadingPlate kicker={`Node ${idx + 1} of 5 · ${active}`} line={READINGS[active]} />
    </div>
  );
}

/* ========================== 05 · TIDE GAUGE =============================== */

function TideGauge() {
  const [active, setActive] = usePeriod();
  const idx = PERIODS.indexOf(active);
  const level = ((idx + 1) / PERIODS.length) * 100;
  return (
    <div>
      <div className="ltb-tide relative overflow-hidden">
        {/* water rising to the active mark */}
        <div
          aria-hidden
          className="ltb-water absolute inset-x-0 bottom-0"
          style={{ height: `${level}%` }}
        />
        {/* tick scale along the right edge */}
        <div aria-hidden className="absolute bottom-1 right-1.5 top-1 flex w-6 flex-col justify-between">
          {Array.from({ length: 21 }, (_, i) => (
            <span
              key={i}
              className={`h-px ${i % 5 === 0 ? "w-4 bg-[#f3c77a]/60" : "w-2 bg-[#b7b1cc]/30"}`}
            />
          ))}
        </div>
        <div className="relative z-10 flex h-40 items-stretch">
          {PERIODS.map((p, i) => {
            const on = p === active;
            return (
              <button
                key={p}
                type="button"
                aria-pressed={on}
                onClick={() => setActive(p)}
                className={`ltb-tide-tab ${on ? "ltb-tide-on" : ""}`}
              >
                <span className="ltb-caps text-[9.5px]">{p}</span>
                <span className="ltb-serif text-[13px] italic text-[#b7b1cc]/60">
                  mk.{i + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <ReadingPlate
        kicker={`Water level ${level.toFixed(0)}% · mark ${idx + 1} — ${active}`}
        line={READINGS[active]}
      />
    </div>
  );
}

/* ========================== 06 · PUNCH CARDS ============================== */

const CARD_POSE = [
  "rotate-[-2.2deg]",
  "rotate-[-1.1deg]",
  "rotate-[0.4deg]",
  "rotate-[1.3deg]",
  "rotate-[2.1deg]",
];

function PunchCards() {
  const [active, setActive] = usePeriod();
  return (
    <div>
      <div className="flex flex-wrap justify-center sm:flex-nowrap">
        {PERIODS.map((p, i) => {
          const on = p === active;
          return (
            <button
              key={p}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(p)}
              className={`ltb-card ${CARD_POSE[i]} ${on ? "ltb-card-on" : ""} ${
                i > 0 ? "sm:-ml-9" : ""
              } mt-3 sm:mt-0`}
              style={{ zIndex: on ? 40 : 10 + i }}
            >
              <span className="ltb-caps block text-[10px]">{p}</span>
              <span className="mt-2 block h-px w-full bg-[#e9e6f2]/15" />
              <span className="mt-2 grid grid-cols-6 gap-1">
                {Array.from({ length: 12 }, (_, k) => (
                  <span
                    key={k}
                    className={`h-1.5 w-1.5 rounded-full ${
                      on && (k + i) % 3 === 0 ? "bg-[#0a0912]" : "bg-[#e9e6f2]/20"
                    }`}
                  />
                ))}
              </span>
              <span className="ltb-caps mt-2 block text-[7.5px] text-[#b7b1cc]/50">
                № {String(i + 1).padStart(3, "0")}
              </span>
            </button>
          );
        })}
      </div>
      <ReadingPlate kicker={`Card drawn · ${active}`} line={READINGS[active]} />
    </div>
  );
}

/* ========================= 07 · CIRCUIT BUS =============================== */

// serpentine trace through 12 stations, in a 100x40 design space
const BUS_X = [8, 24.8, 41.6, 58.4, 75.2, 92];
const BUS_POINTS: Array<[number, number]> = [
  ...BUS_X.map((x): [number, number] => [x, 10]),
  [92, 30],
  ...BUS_X.slice(0, -1)
    .reverse()
    .map((x): [number, number] => [x, 30]),
];
const BUS_PATH = `M ${BUS_POINTS.map(([x, y]) => `${x} ${y}`).join(" L ")} Z`;

// where each animal sits: row 1 left→right, row 2 right→left
function busPos(i: number): [number, number] {
  return i < 6 ? [BUS_X[i], 10] : [BUS_X[11 - i], 30];
}

function CircuitBus() {
  const [active, setActive] = useAnimal();
  return (
    <div>
      <div className="ltb-bus relative mx-auto max-w-[760px]">
        <div className="aspect-[5/2]">
          <svg viewBox="0 0 100 40" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
            <path
              d={BUS_PATH}
              fill="none"
              stroke={GOLD_DEEP}
              strokeWidth={0.5}
              opacity={0.55}
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={BUS_PATH}
              fill="none"
              stroke={VIOLET}
              strokeWidth={0.25}
              opacity={0.3}
              strokeDasharray="1.5 2.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {/* traveler dot running the trace, pure CSS keyframes in % */}
          <span aria-hidden className="ltb-traveler" />
          {ANIMALS.map((a, i) => {
            const [x, y] = busPos(i);
            const on = a === active;
            return (
              <button
                key={a}
                type="button"
                aria-pressed={on}
                onClick={() => setActive(a)}
                className={`ltb-bus-chip ${on ? "ltb-bus-on" : ""}`}
                style={{ left: `${x}%`, top: `${(y / 40) * 100}%` }}
              >
                <span className={`ltb-led ${on ? "ltb-led-on" : ""}`} />
                {a}
              </button>
            );
          })}
        </div>
      </div>
      <ReadingPlate
        kicker={`Signal locked · ${active}`}
        line={`The ${active} ${ANIMAL_TRAITS[active]}.`}
      />
    </div>
  );
}

/* ========================= 08 · CELESTIAL RING ============================ */

function CelestialRing() {
  const [active, setActive] = useAnimal();
  const idx = ANIMALS.indexOf(active);
  const ringRot = -idx * 30; // bring the active animal to the top marker
  const R = 128; // ring radius in px (ring box is 320px)
  return (
    <div>
      <div className="relative mx-auto h-[320px] w-[320px]">
        {/* dial furniture: outer hairline + tick ring (static) */}
        <svg viewBox="0 0 320 320" className="absolute inset-0 h-full w-full">
          <circle cx={160} cy={160} r={150} fill="none" stroke={GOLD_DEEP} strokeWidth={0.6} opacity={0.5} />
          <circle cx={160} cy={160} r={104} fill="none" stroke={VIOLET_SOFT} strokeWidth={0.5} opacity={0.35} strokeDasharray="2 5" />
          {Array.from({ length: 60 }, (_, k) => {
            const p1 = fromTop(160, 160, 144, k * 6);
            const p2 = fromTop(160, 160, 150, k * 6);
            return (
              <line
                key={k}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={GOLD}
                strokeWidth={k % 5 === 0 ? 1 : 0.4}
                opacity={k % 5 === 0 ? 0.7 : 0.35}
              />
            );
          })}
        </svg>
        {/* top marker */}
        <span aria-hidden className="ltb-marker absolute left-1/2 top-[-4px] -translate-x-1/2">
          ▼
        </span>
        {/* the rotating ring of animals */}
        <div
          className="ltb-ring absolute inset-0"
          style={{ transform: `rotate(${ringRot}deg)` }}
        >
          {ANIMALS.map((a, i) => {
            const on = a === active;
            return (
              <div
                key={a}
                className="absolute left-1/2 top-1/2"
                style={{ transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-${R}px)` }}
              >
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setActive(a)}
                  className={`ltb-ring-chip ${on ? "ltb-ring-on" : ""}`}
                  style={{ transform: `rotate(${(idx - i) * 30}deg)` }}
                >
                  {a}
                </button>
              </div>
            );
          })}
        </div>
        {/* hub readout */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <span className="ltb-caps block text-[8px] text-[#b7b1cc]/60">cycle</span>
          <span className="ltb-serif block text-[19px] text-[#ffdd9c]">{active}</span>
          <span className="ltb-caps block text-[8px] text-[#b7b1cc]/60">
            {String(idx + 1).padStart(2, "0")} / 12
          </span>
        </div>
      </div>
      <ReadingPlate
        kicker={`Ring aligned · ${active} at the zenith`}
        line={`The ${active} ${ANIMAL_TRAITS[active]}.`}
      />
    </div>
  );
}

/* ================================= PAGE =================================== */

const FRAMES = [
  "md:mr-[12%] md:ml-[1%] -rotate-[0.35deg]",
  "md:ml-[11%] md:mr-[2%] rotate-[0.4deg]",
  "md:ml-[3%] md:mr-[8%] -rotate-[0.3deg]",
  "md:ml-[15%] rotate-[0.35deg]",
  "md:mr-[13%] md:ml-[2%] rotate-[0.3deg]",
  "md:ml-[8%] md:mr-[4%] -rotate-[0.4deg]",
  "md:ml-[2%] md:mr-[9%] rotate-[0.3deg]",
  "md:ml-[12%] md:mr-[1%] -rotate-[0.3deg]",
];

export default function TabInstrumentsPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#0a0912] font-sans text-[#e9e6f2] antialiased selection:bg-[#f3c77a]/25">
      <style>{`
        .ltb-serif { font-family: "Playfair Display", "Cormorant Garamond", Georgia, "Times New Roman", serif; }
        .ltb-glyph { font-family: "Noto Sans Symbols", "Noto Sans Symbols 2", Symbola, "Segoe UI Symbol", serif; font-style: normal; }
        .ltb-caps { text-transform: uppercase; letter-spacing: 0.22em; }
        .ltb-label {
          text-transform: uppercase; letter-spacing: 0.26em; font-size: 11px;
          color: #f3c77a; text-shadow: 0 1px 0 rgba(0,0,0,0.8), 0 0 14px rgba(243,199,122,0.25);
        }
        .ltb-panel {
          background: linear-gradient(160deg, rgba(23,19,40,0.62), rgba(12,10,22,0.72));
          border: 1px solid rgba(233,230,242,0.10);
          backdrop-filter: blur(3px);
        }
        .ltb-plate {
          background: linear-gradient(165deg, rgba(28,23,48,0.55), rgba(14,11,26,0.65));
          border: 1px solid rgba(201,162,39,0.28);
          box-shadow: inset 0 1px 0 rgba(233,230,242,0.05);
        }
        .ltb-chip {
          display: inline-block; border: 1px solid rgba(243,199,122,0.35);
          background: rgba(10,9,18,0.88); padding: 4px 10px; font-size: 9.5px;
          letter-spacing: 0.2em; text-transform: uppercase; color: #f3c77a;
        }

        /* ---- 01 · brass register ---- */
        .ltb-brass-bed {
          border: 1px solid rgba(201,162,39,0.5);
          background: linear-gradient(180deg, rgba(20,17,34,0.9), rgba(12,10,22,0.95));
          box-shadow: inset 0 1px 0 rgba(255,221,156,0.12), inset 0 -6px 14px rgba(0,0,0,0.55), 0 10px 28px rgba(0,0,0,0.45);
          width: fit-content; max-width: 100%;
        }
        .ltb-brass-tab {
          position: relative; padding: 18px 22px; color: #b7b1cc; cursor: pointer;
          background: linear-gradient(180deg, rgba(46,38,66,0.55), rgba(24,20,40,0.6));
          border: 1px solid rgba(201,162,39,0.28); border-top-color: rgba(255,221,156,0.28);
          box-shadow: 0 3px 0 rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,221,156,0.14);
          transition: transform 0.18s ease, box-shadow 0.25s ease, color 0.2s ease, background 0.25s ease;
        }
        .ltb-brass-tab:hover { color: #e9e6f2; }
        .ltb-brass-on {
          transform: translateY(3px); color: #ffdd9c;
          background: linear-gradient(180deg, rgba(16,13,28,0.9), rgba(30,24,44,0.85));
          box-shadow: 0 0 0 rgba(0,0,0,0), inset 0 3px 10px rgba(0,0,0,0.75),
            inset 0 -1px 0 rgba(243,199,122,0.35), 0 0 22px rgba(243,199,122,0.28);
          text-shadow: 0 0 12px rgba(243,199,122,0.55);
        }
        .ltb-rivet {
          position: absolute; width: 5px; height: 5px; border-radius: 9999px;
          background: radial-gradient(circle at 35% 30%, #ffdd9c 0%, #c9a227 45%, #4a3a12 100%);
          box-shadow: 0 1px 1px rgba(0,0,0,0.8); opacity: 0.75;
        }

        /* ---- 02 · orbit dial ---- */
        .ltb-needle {
          transform-origin: 300px 340px;
          transition: transform 0.7s cubic-bezier(0.34, 1.4, 0.44, 1);
        }
        .ltb-orbit-tab {
          position: absolute; transform: translate(-50%, -50%);
          border: 1px solid rgba(183,148,246,0.4); background: rgba(16,13,30,0.85);
          padding: 6px 13px; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
          color: #b7b1cc; cursor: pointer; white-space: nowrap;
          box-shadow: 0 4px 14px rgba(0,0,0,0.5);
          transition: border-color 0.25s ease, color 0.25s ease, box-shadow 0.3s ease, background 0.25s ease;
        }
        .ltb-orbit-tab:hover { color: #e9e6f2; border-color: rgba(183,148,246,0.75); }
        .ltb-orbit-on {
          color: #ffdd9c; border-color: #f3c77a; background: rgba(38,29,52,0.95);
          box-shadow: 0 0 20px rgba(243,199,122,0.4), 0 4px 14px rgba(0,0,0,0.5);
        }

        /* ---- 03 · codex index ---- */
        .ltb-codex-col { border-right: 1px solid rgba(201,162,39,0.4); padding-right: 18px; }
        .ltb-codex-marker {
          position: absolute; left: -7px; transform: translateY(-50%);
          color: #f3c77a; font-size: 12px; text-shadow: 0 0 10px rgba(243,199,122,0.7);
          transition: top 0.5s cubic-bezier(0.3, 1.2, 0.4, 1);
        }
        .ltb-codex-tab {
          display: flex; align-items: baseline; gap: 10px; height: 3rem; width: 100%;
          color: #b7b1cc; cursor: pointer; text-align: left;
          transition: color 0.25s ease, transform 0.25s ease;
        }
        .ltb-codex-tab:hover { color: #e9e6f2; }
        .ltb-codex-on { color: #ffdd9c; transform: translateX(6px); }
        .ltb-codex-on .ltb-serif { color: #f3c77a; }
        .ltb-codex-drop {
          float: left; font-size: 44px; line-height: 0.85; padding-right: 8px;
          color: #f3c77a; text-shadow: 0 0 16px rgba(243,199,122,0.35);
        }

        /* ---- 04 · constellation nodes ---- */
        .ltb-link { transition: stroke 0.35s ease, opacity 0.35s ease; }
        .ltb-star-node {
          display: block; font-size: 17px; color: #b7b1cc;
          font-family: "Noto Sans Symbols", "Noto Sans Symbols 2", Symbola, serif;
          transition: color 0.3s ease, text-shadow 0.3s ease, transform 0.3s ease;
        }
        .ltb-star-node:hover { color: #e9e6f2; }
        .ltb-star-on {
          color: #ffdd9c; transform: scale(1.5);
          text-shadow: 0 0 12px rgba(243,199,122,0.9), 0 0 34px rgba(243,199,122,0.5);
        }

        /* ---- 05 · tide gauge ---- */
        .ltb-tide {
          border: 1px solid rgba(183,148,246,0.35);
          background:
            repeating-linear-gradient(to bottom, rgba(233,230,242,0.05) 0 1px, transparent 1px 20%),
            linear-gradient(180deg, rgba(16,13,30,0.9), rgba(11,9,20,0.95));
        }
        .ltb-water {
          background: linear-gradient(180deg, rgba(183,148,246,0.34), rgba(162,90,223,0.20) 55%, rgba(243,199,122,0.16));
          border-top: 1px solid rgba(183,148,246,0.85);
          box-shadow: 0 -6px 22px rgba(162,90,223,0.35);
          transition: height 0.9s cubic-bezier(0.3, 0.9, 0.3, 1);
        }
        .ltb-tide-tab {
          flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-start;
          gap: 5px; padding-top: 16px; color: #b7b1cc; cursor: pointer;
          border-right: 1px dashed rgba(233,230,242,0.12);
          transition: color 0.25s ease, background 0.3s ease;
        }
        .ltb-tide-tab:last-child { border-right: 0; }
        .ltb-tide-tab:hover { color: #e9e6f2; background: rgba(233,230,242,0.03); }
        .ltb-tide-on { color: #ffdd9c; background: rgba(243,199,122,0.06); }
        .ltb-tide-on .ltb-serif { color: #f3c77a; }

        /* ---- 06 · punch cards ---- */
        .ltb-card {
          position: relative; width: 128px; padding: 14px 14px 12px; text-align: left;
          color: #b7b1cc; cursor: pointer;
          background: linear-gradient(175deg, #221d38, #151126 70%);
          border: 1px solid rgba(233,230,242,0.16); border-top: 3px solid rgba(183,148,246,0.5);
          box-shadow: 0 8px 20px rgba(0,0,0,0.55);
          transition: transform 0.3s cubic-bezier(0.3, 1.1, 0.4, 1), box-shadow 0.3s ease,
            border-color 0.3s ease, color 0.25s ease;
        }
        .ltb-card:hover { color: #e9e6f2; border-color: rgba(233,230,242,0.3); }
        .ltb-card-on {
          transform: translateY(-14px) rotate(0deg) scale(1.04);
          color: #ffdd9c; border-color: rgba(243,199,122,0.7); border-top-color: #f3c77a;
          box-shadow: 0 20px 40px rgba(0,0,0,0.65), 0 0 26px rgba(243,199,122,0.25);
        }

        /* ---- 07 · circuit bus ---- */
        .ltb-bus-chip {
          position: absolute; transform: translate(-50%, -50%);
          display: inline-flex; align-items: center; gap: 6px;
          border: 1px solid rgba(201,162,39,0.45); background: rgba(13,11,24,0.92);
          padding: 5px 10px; font-size: 9.5px; letter-spacing: 0.16em; text-transform: uppercase;
          color: #b7b1cc; cursor: pointer; white-space: nowrap;
          transition: border-color 0.25s ease, color 0.25s ease, box-shadow 0.3s ease;
        }
        .ltb-bus-chip:hover { color: #e9e6f2; border-color: rgba(243,199,122,0.8); }
        .ltb-bus-on {
          color: #ffdd9c; border-color: #f3c77a;
          box-shadow: 0 0 18px rgba(243,199,122,0.45);
        }
        .ltb-led {
          width: 6px; height: 6px; border-radius: 9999px;
          background: #3a3350; box-shadow: inset 0 1px 1px rgba(0,0,0,0.7);
          transition: background 0.25s ease, box-shadow 0.25s ease;
        }
        .ltb-led-on {
          background: #ffdd9c;
          box-shadow: 0 0 8px rgba(255,221,156,0.95), 0 0 16px rgba(243,199,122,0.6);
        }
        .ltb-traveler {
          position: absolute; width: 7px; height: 7px; border-radius: 9999px;
          background: #b794f6; box-shadow: 0 0 10px rgba(183,148,246,0.9), 0 0 22px rgba(162,90,223,0.5);
          transform: translate(-50%, -50%);
          animation: ltb-travel 16s linear infinite;
        }
        @keyframes ltb-travel {
          0%     { left: 8%;    top: 25%; }
          7.69%  { left: 24.8%; top: 25%; }
          15.38% { left: 41.6%; top: 25%; }
          23.08% { left: 58.4%; top: 25%; }
          30.77% { left: 75.2%; top: 25%; }
          38.46% { left: 92%;   top: 25%; }
          46.15% { left: 92%;   top: 75%; }
          53.85% { left: 75.2%; top: 75%; }
          61.54% { left: 58.4%; top: 75%; }
          69.23% { left: 41.6%; top: 75%; }
          76.92% { left: 24.8%; top: 75%; }
          84.62% { left: 8%;    top: 75%; }
          92.31% { left: 8%;    top: 25%; }
          100%   { left: 8%;    top: 25%; }
        }

        /* ---- 08 · celestial ring ---- */
        .ltb-ring { transition: transform 0.8s cubic-bezier(0.3, 1.05, 0.4, 1); }
        .ltb-ring-chip {
          display: block; border: 1px solid rgba(183,148,246,0.4);
          background: rgba(14,11,26,0.92); padding: 5px 11px;
          font-size: 9.5px; letter-spacing: 0.16em; text-transform: uppercase;
          color: #b7b1cc; cursor: pointer; white-space: nowrap;
          transition: transform 0.8s cubic-bezier(0.3, 1.05, 0.4, 1), border-color 0.25s ease,
            color 0.25s ease, box-shadow 0.3s ease;
        }
        .ltb-ring-chip:hover { color: #e9e6f2; border-color: rgba(183,148,246,0.8); }
        .ltb-ring-on {
          color: #0a0912; background: #f3c77a; border-color: #ffdd9c;
          box-shadow: 0 0 22px rgba(243,199,122,0.55);
        }
        .ltb-marker {
          color: #f3c77a; font-size: 12px;
          text-shadow: 0 0 12px rgba(243,199,122,0.8); z-index: 10;
        }

        /* ---- background motion (slow, guarded below) ---- */
        @keyframes ltb-twinkle { 0%,100% { opacity: 0.1; } 50% { opacity: 0.7; } }
        @keyframes ltb-floatA { 0%,100% { transform: translate(0,0) rotate(-2deg); } 50% { transform: translate(1.4vw,-2vh) rotate(1deg); } }
        @keyframes ltb-floatB { 0%,100% { transform: translate(0,0) rotate(3deg); } 50% { transform: translate(-1.4vw,2vh) rotate(-1deg); } }
        .ltb-twinkle { animation: ltb-twinkle 8s ease-in-out infinite; }
        .ltb-float-a { animation: ltb-floatA 38s ease-in-out infinite; }
        .ltb-float-b { animation: ltb-floatB 46s ease-in-out infinite; }
        .ltb-nebula  { animation: ltb-floatA 64s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .ltb-twinkle, .ltb-float-a, .ltb-float-b, .ltb-nebula, .ltb-traveler {
            animation: none !important;
          }
          .ltb-traveler { display: none; }
          .ltb-needle, .ltb-codex-marker, .ltb-ring, .ltb-ring-chip, .ltb-water,
          .ltb-card, .ltb-brass-tab, .ltb-star-node, .ltb-link {
            transition: none !important;
          }
        }
      `}</style>

      <Backdrop />

      <div className="relative z-10">
        {/* header */}
        <header className="border-b border-white/[0.07]">
          <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-4 md:px-8">
            <Link
              href="/"
              className="text-[12px] text-[#b7b1cc] underline decoration-[#b7b1cc]/40 underline-offset-4 transition-colors hover:text-[#f3c77a]"
            >
              ← Index
            </Link>
            <span className="h-3 w-px bg-white/15" aria-hidden />
            <h1 className="ltb-caps text-[11px] text-[#e9e6f2]">
              Tab Instruments — period &amp; sign selectors
            </h1>
          </div>
        </header>

        {/* intro */}
        <div className="mx-auto max-w-5xl px-5 pt-12 md:px-8 md:pt-16">
          <p className="ltb-chip -rotate-[0.5deg]">design lab · eight studies</p>
          <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-[#b7b1cc]">
            Working tab-bar designs for the sign pages — five periods per
            instrument, two instruments for the twelve animals. Every selector
            is live; the reading plate below each one follows the active tab.
          </p>
        </div>

        {/* instruments */}
        <div className="mx-auto flex max-w-5xl flex-col gap-16 px-5 py-16 md:gap-20 md:px-8 md:py-24">
          <SectionShell
            index={1}
            name="Brass Register"
            note="Engraved instrument plates with rivets; the active key is pressed down into the bed on an inset shadow with a gold glow."
            frame={FRAMES[0]}
          >
            <BrassRegister />
          </SectionShell>

          <SectionShell
            index={2}
            name="Orbit Dial"
            note="Tabs seated on a shallow orbit rail; a pointer pivoting below the frame swings to the active station."
            frame={FRAMES[1]}
          >
            <OrbitDial />
          </SectionShell>

          <SectionShell
            index={3}
            name="Codex Index"
            note="A manuscript chapter index: roman numerals down the margin, a rubric diamond sliding to the active chapter."
            frame={FRAMES[2]}
          >
            <CodexIndex />
          </SectionShell>

          <SectionShell
            index={4}
            name="Constellation Nodes"
            note="Tabs as stars on a polyline; the active node flares and its two links brighten."
            frame={FRAMES[3]}
          >
            <ConstellationNodes />
          </SectionShell>

          <SectionShell
            index={5}
            name="Tide Gauge"
            note="A tidal ruler in five marks; the water level rises to the active segment."
            frame={FRAMES[4]}
          >
            <TideGauge />
          </SectionShell>

          <SectionShell
            index={6}
            name="Punch Cards"
            note="A card catalog of overlapping punched plates; the active card pulls up and forward out of the stack."
            frame={FRAMES[5]}
          >
            <PunchCards />
          </SectionShell>

          <SectionShell
            index={7}
            name="Circuit Bus"
            chip="animal switcher"
            note="Twelve animals as chips on a serpentine trace; the active chip lights like an LED while a traveler dot runs the bus."
            frame={FRAMES[6]}
          >
            <CircuitBus />
          </SectionShell>

          <SectionShell
            index={8}
            name="Celestial Ring"
            chip="animal switcher"
            note="A zodiac ring of twelve animals; the ring rotates to set the active animal under the zenith marker."
            frame={FRAMES[7]}
          >
            <CelestialRing />
          </SectionShell>
        </div>

        <footer className="relative border-t border-white/[0.06]">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-8 md:px-8">
            <span className="ltb-caps text-[9px] text-[#b7b1cc]/50">
              lab / tabs · instruments i–viii
            </span>
            <Link
              href="/"
              className="text-[12px] text-[#b7b1cc] underline decoration-[#b7b1cc]/40 underline-offset-4 transition-colors hover:text-[#f3c77a]"
            >
              ← Back to index
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
