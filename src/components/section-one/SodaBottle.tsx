import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "../../utils/a11y";

interface SodaBottleProps {
  currentStep: number;
}

/**
 * An empty soda bottle that slowly fills up, representing rising blood sugar.
 * Used at step 2 of Section One (the "diabetes mellitus" definition).
 */
export default function SodaBottle({ currentStep }: SodaBottleProps) {
  const reducedMotion = useReducedMotion();
  const fillRef = useRef<SVGRectElement>(null);
  const bubblesRef = useRef<SVGGElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const fill = fillRef.current;
    const bubbles = bubblesRef.current;
    const label = labelRef.current;
    if (!fill || !bubbles || !label) return;

    const ctx = gsap.context(() => {
      // Fill the bottle from 0 to ~80% over 3 seconds
      gsap.fromTo(fill, { attr: { height: 0, y: 280 } }, { attr: { height: 180, y: 100 }, duration: 3, ease: "power2.inOut" });

      // Animate bubbles rising
      const dots = bubbles.querySelectorAll("circle");
      dots.forEach((dot, i) => {
        gsap.fromTo(
          dot,
          { attr: { cy: 270 - i * 8 }, opacity: 0 },
          {
            attr: { cy: 120 + i * 12 },
            opacity: 0.7,
            duration: 2.5,
            delay: 0.5 + i * 0.15,
            ease: "power1.out",
            repeat: -1,
            repeatDelay: 1,
          },
        );
      });

      // Label fades in
      gsap.fromTo(label, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 1.5, ease: "power2.out" });
    });

    return () => ctx.revert();
  }, [currentStep, reducedMotion]);

  // Fill height for reduced motion
  const staticFillH = 180;
  const staticFillY = 100;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 340" className="mx-auto w-full max-w-[280px]" role="img" aria-label="Soda bottle filling up, representing rising blood sugar levels">
        {/* Bottle outline */}
        {/* Cap */}
        <rect x={85} y={10} width={30} height={16} rx={4} fill="var(--color-text-muted)" opacity={0.5} />

        {/* Neck */}
        <path
          d="M 88 26 L 88 55 Q 88 65 78 70 L 55 82 Q 45 87 45 100 L 45 290 Q 45 305 60 305 L 140 305 Q 155 305 155 290 L 155 100 Q 155 87 145 82 L 122 70 Q 112 65 112 55 L 112 26"
          fill="none"
          stroke="var(--color-text-muted)"
          strokeWidth={2.5}
          opacity={0.6}
        />

        {/* Fill liquid — animated */}
        <clipPath id="bottle-clip">
          <path d="M 47 100 L 47 290 Q 47 303 60 303 L 140 303 Q 153 303 153 290 L 153 100 Q 153 89 145 84 L 122 72 Q 114 67 114 57 L 114 28 L 86 28 L 86 57 Q 86 67 78 72 L 55 84 Q 47 89 47 100 Z" />
        </clipPath>

        <rect ref={fillRef} x={45} y={reducedMotion ? staticFillY : 280} width={112} height={reducedMotion ? staticFillH : 0} fill="var(--color-danger)" opacity={0.35} clipPath="url(#bottle-clip)" />

        {/* Danger fill overlay — darker at top */}
        <rect x={45} y={reducedMotion ? staticFillY : 280} width={112} height={reducedMotion ? 40 : 0} fill="var(--color-danger)" opacity={0.2} clipPath="url(#bottle-clip)" className="fill-top" />

        {/* Bubbles */}
        <g ref={bubblesRef} clipPath="url(#bottle-clip)">
          {[75, 100, 125, 88, 112, 95, 108].map((cx, i) => (
            <circle key={i} cx={cx} cy={reducedMotion ? 150 + i * 15 : 270} r={2 + (i % 3)} fill="var(--color-danger)" opacity={reducedMotion ? 0.4 : 0} />
          ))}
        </g>

        {/* "Sugar" label on bottle */}
        <text x={100} y={210} textAnchor="middle" fontSize={13} fill="var(--color-danger)" fontFamily="var(--font-display)" fontWeight="bold" opacity={0.7}>
          SUGAR
        </text>

        {/* Blood sugar level indicator on the right */}
        <g>
          <line x1={165} y1={280} x2={165} y2={100} stroke="var(--color-text-muted)" strokeWidth={1.5} opacity={0.3} />
          <text x={172} y={285} fontSize={8} fill="var(--color-text-muted)" fontFamily="var(--font-mono)">
            normal
          </text>
          <text x={172} y={180} fontSize={8} fill="var(--color-orange)" fontFamily="var(--font-mono)">
            high
          </text>
          <text x={172} y={110} fontSize={8} fill="var(--color-danger)" fontFamily="var(--font-mono)" fontWeight="bold">
            danger
          </text>
          {/* Tick marks */}
          <line x1={162} y1={280} x2={168} y2={280} stroke="var(--color-text-muted)" strokeWidth={1} opacity={0.4} />
          <line x1={162} y1={190} x2={168} y2={190} stroke="var(--color-orange)" strokeWidth={1} opacity={0.5} />
          <line x1={162} y1={120} x2={168} y2={120} stroke="var(--color-danger)" strokeWidth={1} opacity={0.6} />
        </g>
      </svg>

      {/* Label */}
      <div ref={labelRef} className="mt-2 text-center" style={{ opacity: reducedMotion ? 1 : 0 }}>
        <p className="text-sm font-medium" style={{ color: "var(--color-danger)" }}>
          Blood sugar keeps rising...
        </p>
      </div>
    </div>
  );
}
