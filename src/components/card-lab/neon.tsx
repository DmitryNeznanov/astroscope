/**
 * NEON — The Hermit (IX)
 * Neon tube sign on a dark bar wall. The Hermit outline is drawn as glowing
 * neon tubes: hooded figure + lantern in warm amber, staff in cyan, mountain
 * in violet. Layered glow via duplicated strokes + stacked drop-shadows.
 * Signature effects (all CSS-only, disabled for reduced motion): lantern
 * flicker, a whole-sign ballast buzz every ~8s, the cyan staff runs as a
 * sputtering weak tube, the frame tube breathes slowly, and :hover turns the
 * dimmer up so every glow stack intensifies.
 */
export default function NeonHermitCard() {
  return (
    <figure
      className="cl-neon-card"
      style={{ aspectRatio: "2/3", width: "100%", margin: 0 }}
      aria-label="The Hermit tarot card in neon tube sign style"
    >
      <style>{`
        .cl-neon-card {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          background:
            repeating-linear-gradient(
              0deg,
              transparent 0px, transparent 26px,
              rgba(255, 255, 255, 0.025) 26px, rgba(255, 255, 255, 0.025) 27px,
              transparent 27px, transparent 28px
            ),
            repeating-linear-gradient(
              90deg,
              transparent 0px, transparent 38px,
              rgba(255, 255, 255, 0.02) 38px, rgba(255, 255, 255, 0.02) 39px,
              transparent 39px, transparent 76px
            ),
            radial-gradient(ellipse at 50% 38%, #14111c 0%, #0a0810 55%, #050408 100%);
          box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.85);
        }
        .cl-neon-card svg { display: block; width: 100%; height: 100%; }

        /* ---- tube glow stacks ---- */
        .cl-neon-amber {
          filter:
            drop-shadow(0 0 1.5px rgba(255, 190, 90, 0.9))
            drop-shadow(0 0 5px rgba(255, 160, 40, 0.75))
            drop-shadow(0 0 14px rgba(255, 140, 20, 0.45));
        }
        .cl-neon-cyan {
          filter:
            drop-shadow(0 0 1.5px rgba(120, 240, 255, 0.9))
            drop-shadow(0 0 5px rgba(40, 210, 255, 0.75))
            drop-shadow(0 0 14px rgba(0, 180, 255, 0.45));
        }
        .cl-neon-violet {
          filter:
            drop-shadow(0 0 1.5px rgba(210, 150, 255, 0.85))
            drop-shadow(0 0 6px rgba(170, 90, 255, 0.7))
            drop-shadow(0 0 16px rgba(140, 60, 255, 0.4));
        }
        .cl-neon-red {
          filter:
            drop-shadow(0 0 1.5px rgba(255, 110, 110, 0.9))
            drop-shadow(0 0 5px rgba(255, 40, 40, 0.8))
            drop-shadow(0 0 12px rgba(255, 20, 20, 0.5));
        }
        .cl-neon-pink {
          filter:
            drop-shadow(0 0 1.5px rgba(255, 160, 220, 0.9))
            drop-shadow(0 0 6px rgba(255, 90, 190, 0.75))
            drop-shadow(0 0 16px rgba(255, 60, 170, 0.45));
        }
        .cl-neon-frame {
          filter: drop-shadow(0 0 3px rgba(150, 160, 200, 0.35));
          animation: cl-neon-breathe 11s ease-in-out infinite;
        }
        .cl-neon-amber, .cl-neon-cyan, .cl-neon-violet,
        .cl-neon-red, .cl-neon-pink, .cl-neon-star {
          transition: filter 0.35s ease;
        }
        .cl-neon-star {
          filter:
            drop-shadow(0 0 2px rgba(255, 235, 180, 1))
            drop-shadow(0 0 7px rgba(255, 200, 90, 0.9))
            drop-shadow(0 0 18px rgba(255, 170, 50, 0.6));
        }

        /* ---- flicker on the lantern tube ---- */
        @keyframes cl-neon-flicker {
          0%, 100% { opacity: 1; }
          3% { opacity: 0.55; }
          5% { opacity: 1; }
          42% { opacity: 1; }
          44% { opacity: 0.4; }
          46% { opacity: 0.95; }
          48% { opacity: 0.65; }
          50% { opacity: 1; }
        }
        .cl-neon-flicker { animation: cl-neon-flicker 4.2s linear infinite; }

        /* ---- whole-sign ballast buzz: quick stutter every ~8s ---- */
        @keyframes cl-neon-buzz {
          0%, 100% { opacity: 1; filter: none; }
          1.2% { opacity: 0.72; filter: brightness(0.82); }
          2.1% { opacity: 1; filter: none; }
          2.8% { opacity: 0.85; filter: brightness(0.9); }
          3.6% { opacity: 1; filter: none; }
        }
        .cl-neon-buzz { animation: cl-neon-buzz 8.3s linear infinite; }

        /* ---- weak tube: the cyan staff sputters on its own rhythm ---- */
        @keyframes cl-neon-weak {
          0%, 100% { opacity: 1; }
          11% { opacity: 0.5; }
          13% { opacity: 0.9; }
          15% { opacity: 0.35; }
          18% { opacity: 1; }
          57% { opacity: 1; }
          59% { opacity: 0.6; }
          61.5% { opacity: 1; }
        }
        .cl-neon-weak { animation: cl-neon-weak 6.7s linear infinite; }

        /* ---- very slow breathing on the frame tube ---- */
        @keyframes cl-neon-breathe {
          0%, 100% { filter: drop-shadow(0 0 2px rgba(150, 160, 200, 0.22)); opacity: 0.75; }
          50% { filter: drop-shadow(0 0 5px rgba(170, 180, 220, 0.5)); opacity: 1; }
        }

        /* ---- hover: dimmer turned up, all tubes brighten ---- */
        .cl-neon-card:hover .cl-neon-amber {
          filter:
            brightness(1.25)
            drop-shadow(0 0 2px rgba(255, 200, 110, 1))
            drop-shadow(0 0 8px rgba(255, 170, 50, 0.95))
            drop-shadow(0 0 22px rgba(255, 150, 25, 0.65));
        }
        .cl-neon-card:hover .cl-neon-cyan {
          filter:
            brightness(1.25)
            drop-shadow(0 0 2px rgba(140, 245, 255, 1))
            drop-shadow(0 0 8px rgba(50, 220, 255, 0.95))
            drop-shadow(0 0 22px rgba(0, 190, 255, 0.65));
        }
        .cl-neon-card:hover .cl-neon-violet {
          filter:
            brightness(1.25)
            drop-shadow(0 0 2px rgba(220, 165, 255, 1))
            drop-shadow(0 0 9px rgba(180, 100, 255, 0.9))
            drop-shadow(0 0 24px rgba(150, 70, 255, 0.6));
        }
        .cl-neon-card:hover .cl-neon-red {
          filter:
            brightness(1.25)
            drop-shadow(0 0 2px rgba(255, 130, 130, 1))
            drop-shadow(0 0 8px rgba(255, 50, 50, 0.95))
            drop-shadow(0 0 18px rgba(255, 25, 25, 0.7));
        }
        .cl-neon-card:hover .cl-neon-pink {
          filter:
            brightness(1.25)
            drop-shadow(0 0 2px rgba(255, 175, 228, 1))
            drop-shadow(0 0 9px rgba(255, 100, 200, 0.95))
            drop-shadow(0 0 24px rgba(255, 70, 180, 0.65));
        }
        .cl-neon-card:hover .cl-neon-star {
          filter:
            brightness(1.3)
            drop-shadow(0 0 3px rgba(255, 240, 190, 1))
            drop-shadow(0 0 10px rgba(255, 210, 100, 1))
            drop-shadow(0 0 26px rgba(255, 180, 60, 0.8));
        }

        @media (prefers-reduced-motion: reduce) {
          .cl-neon-flicker,
          .cl-neon-buzz,
          .cl-neon-weak,
          .cl-neon-frame { animation: none; }
        }
      `}</style>

      <svg className="cl-neon-buzz" viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" role="img">
        {/* thin dim tube frame */}
        <rect
          className="cl-neon-frame"
          x="7"
          y="7"
          width="186"
          height="286"
          rx="9"
          fill="none"
          stroke="#3d4358"
          strokeWidth="1.6"
        />

        {/* IX — small red neon numeral, top center */}
        <text
          className="cl-neon-red"
          x="100"
          y="36"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="700"
          fontSize="17"
          letterSpacing="4"
          fill="#ffd9d9"
        >
          IX
        </text>

        {/* mountain — violet tubes */}
        <g className="cl-neon-violet" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M 18 236 L 52 198 L 74 222 L 100 190 L 128 224 L 150 204 L 182 236"
            stroke="#8a4fd0"
            strokeWidth="4.4"
            opacity="0.55"
          />
          <path
            d="M 18 236 L 52 198 L 74 222 L 100 190 L 128 224 L 150 204 L 182 236"
            stroke="#e6ccff"
            strokeWidth="1.6"
          />
          {/* electrode gaps at tube ends */}
          <circle cx="18" cy="236" r="2.2" fill="#1a1424" stroke="#5a3d80" strokeWidth="0.8" />
          <circle cx="182" cy="236" r="2.2" fill="#1a1424" stroke="#5a3d80" strokeWidth="0.8" />
        </g>

        {/* staff — cyan tube in the left hand, runs as the sign's weak tube */}
        <g className="cl-neon-cyan cl-neon-weak" fill="none" strokeLinecap="round">
          <path d="M 66 96 Q 62 146 66 206" stroke="#1e9ec4" strokeWidth="4" opacity="0.55" />
          <path d="M 66 96 Q 62 146 66 206" stroke="#d8f8ff" strokeWidth="1.5" />
          <circle cx="66" cy="96" r="2" fill="#0e1a20" stroke="#2a7a94" strokeWidth="0.8" />
          <circle cx="66" cy="206" r="2" fill="#0e1a20" stroke="#2a7a94" strokeWidth="0.8" />
        </g>

        {/* hooded figure — amber tubes */}
        <g className="cl-neon-amber" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* hood + robe outline */}
          <path
            d="M 100 88
               C 88 90 82 100 83 112
               C 78 122 76 136 75 152
               C 74 168 73 184 72 198
               L 128 198
               C 127 184 126 168 125 152
               C 124 136 122 122 117 112
               C 118 100 112 90 100 88 Z"
            stroke="#e08a1e"
            strokeWidth="4.6"
            opacity="0.55"
          />
          <path
            d="M 100 88
               C 88 90 82 100 83 112
               C 78 122 76 136 75 152
               C 74 168 73 184 72 198
               L 128 198
               C 127 184 126 168 125 152
               C 124 136 122 122 117 112
               C 118 100 112 90 100 88 Z"
            stroke="#ffe9c4"
            strokeWidth="1.7"
          />
          {/* hood opening */}
          <path
            d="M 92 106 C 92 98 96 94 100 94 C 104 94 108 98 108 106 C 104 110 96 110 92 106 Z"
            stroke="#e08a1e"
            strokeWidth="3"
            opacity="0.5"
          />
          <path
            d="M 92 106 C 92 98 96 94 100 94 C 104 94 108 98 108 106 C 104 110 96 110 92 106 Z"
            stroke="#ffe9c4"
            strokeWidth="1.1"
          />
          {/* left arm reaching to the staff */}
          <path d="M 80 122 C 74 124 69 128 67 134" stroke="#e08a1e" strokeWidth="3.6" opacity="0.55" />
          <path d="M 80 122 C 74 124 69 128 67 134" stroke="#ffe9c4" strokeWidth="1.3" />
          {/* right arm raised toward the lantern */}
          <path d="M 120 120 C 128 114 134 106 138 98" stroke="#e08a1e" strokeWidth="3.6" opacity="0.55" />
          <path d="M 120 120 C 128 114 134 106 138 98" stroke="#ffe9c4" strokeWidth="1.3" />
          {/* robe fold */}
          <path d="M 100 128 L 100 196" stroke="#e08a1e" strokeWidth="2.6" opacity="0.4" />
          <path d="M 100 128 L 100 196" stroke="#ffdfae" strokeWidth="0.9" opacity="0.85" />
          {/* electrode gaps at robe hem */}
          <circle cx="72" cy="198" r="2" fill="#241a10" stroke="#8a5a1e" strokeWidth="0.8" />
          <circle cx="128" cy="198" r="2" fill="#241a10" stroke="#8a5a1e" strokeWidth="0.8" />
        </g>

        {/* lantern — amber tubes, flickering, star inside */}
        <g className="cl-neon-flicker">
          <g className="cl-neon-amber" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* handle */}
            <path d="M 134 84 Q 140 78 146 84" stroke="#e08a1e" strokeWidth="2.8" opacity="0.55" />
            <path d="M 134 84 Q 140 78 146 84" stroke="#ffe9c4" strokeWidth="1" />
            {/* lantern body */}
            <path
              d="M 132 86 L 148 86 L 150 104 L 130 104 Z"
              stroke="#e08a1e"
              strokeWidth="3.6"
              opacity="0.55"
            />
            <path
              d="M 132 86 L 148 86 L 150 104 L 130 104 Z"
              stroke="#ffe9c4"
              strokeWidth="1.3"
            />
            <circle cx="130" cy="104" r="1.8" fill="#241a10" stroke="#8a5a1e" strokeWidth="0.7" />
            <circle cx="150" cy="104" r="1.8" fill="#241a10" stroke="#8a5a1e" strokeWidth="0.7" />
          </g>
          {/* small star light inside the lantern */}
          <path
            className="cl-neon-star"
            d="M 140 91 L 141.4 94.6 L 145 95 L 141.4 95.4 L 140 99 L 138.6 95.4 L 135 95 L 138.6 94.6 Z"
            fill="#fff4d6"
          />
        </g>

        {/* ground glow pooling under the sign */}
        <ellipse cx="100" cy="242" rx="70" ry="6" fill="#12071c" opacity="0.7" />

        {/* THE HERMIT — neon script at bottom */}
        <text
          className="cl-neon-pink"
          x="100"
          y="274"
          textAnchor="middle"
          fontFamily="'Brush Script MT', 'Segoe Script', 'Lucida Handwriting', cursive"
          fontStyle="italic"
          fontSize="21"
          letterSpacing="1.5"
          fill="#ffd8ee"
        >
          THE HERMIT
        </text>
      </svg>
    </figure>
  );
}
