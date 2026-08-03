"use client";

import { useEffect, useRef } from "react";
import type { PointerEvent } from "react";
import { ArcanaArt } from "@/components/arcana-art";
import { toRoman } from "./shared";
import type { ArcanaCard } from "./shared";

/* ------------------------------------------------------------------ */
/* 3D holographic foil card                                             */
/*                                                                      */
/* Pure CSS + pointer events. The pointer position is written to CSS   */
/* custom properties on the card element:                              */
/*   --v5-rx / --v5-ry  3D tilt (rotateX / rotateY)                    */
/*   --v5-mx / --v5-my  pointer position in %, drives the holo layers  */
/*   --v5-holo-a        pointer angle, rotates the rainbow gradients   */
/*   --v5-holo-o        0 idle / 1 hovering, boosts foil opacity       */
/* The layers themselves (sheen / sweep / sparkle / foil border) are   */
/* styled in shared.tsx so the CSS stays in one place.                 */
/* ------------------------------------------------------------------ */

const MAX_TILT_X = 12; // degrees
const MAX_TILT_Y = 14; // degrees

export function HoloCard({ card }: { card: ArcanaCard }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reducedMotionRef = useRef<boolean>(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mq.matches;
    const onChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
      if (e.matches) resetTilt();
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function setVar(name: string, value: string) {
    cardRef.current?.style.setProperty(name, value);
  }

  function resetTilt() {
    setVar("--v5-rx", "0deg");
    setVar("--v5-ry", "0deg");
    setVar("--v5-holo-o", "0");
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (reducedMotionRef.current) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    const rx = (0.5 - py) * 2 * MAX_TILT_X;
    const ry = (px - 0.5) * 2 * MAX_TILT_Y;
    const angle = (Math.atan2(py - 0.5, px - 0.5) * 180) / Math.PI + 180;
    setVar("--v5-rx", `${rx.toFixed(2)}deg`);
    setVar("--v5-ry", `${ry.toFixed(2)}deg`);
    setVar("--v5-mx", `${(px * 100).toFixed(1)}%`);
    setVar("--v5-my", `${(py * 100).toFixed(1)}%`);
    setVar("--v5-holo-a", `${angle.toFixed(1)}deg`);
    setVar("--v5-holo-o", "1");
  }

  return (
    <div className="v5-holo-wrap">
      <span className="v5-holo-halo" aria-hidden="true" />
      <div
        className="v5-holo-scene"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
      >
        <div className="v5-holo-flip">
          <div className="v5-holo-card" ref={cardRef}>
            {/* Foil layers (under the art) */}
            <span className="v5-holo-sheen" aria-hidden="true" />
            <span className="v5-holo-sweep" aria-hidden="true" />
            <span className="v5-holo-sparkle" aria-hidden="true" />
            {/* Iridescent line art above the foil */}
            <div className="v5-holo-inner">
              <p className="v5-holo-numeral">{toRoman(card.number)}</p>
              <div className="v5-holo-art">
                <ArcanaArt number={card.number} />
              </div>
            </div>
            <p className="v5-holo-name">{card.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
