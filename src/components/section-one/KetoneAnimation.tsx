import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "../../utils/a11y";

interface KetoneAnimationProps {
  currentStep: number; // 3 = one ketone appears, 4 = pile builds up
}

const W = 400;
const H = 360;

// A single ketone "molecule" icon — small hexagon with C=O structure
function KetoneIcon({ cx, cy, size = 22, opacity = 1 }: { cx: number; cy: number; size?: number; opacity?: number }) {
  const s = size;
  return (
    <g opacity={opacity}>
      {/* Hexagonal body */}
      <polygon
        points={[
          [cx, cy - s],
          [cx + s * 0.87, cy - s * 0.5],
          [cx + s * 0.87, cy + s * 0.5],
          [cx, cy + s],
          [cx - s * 0.87, cy + s * 0.5],
          [cx - s * 0.87, cy - s * 0.5],
        ]
          .map(([x, y]) => `${x},${y}`)
          .join(" ")}
        fill="var(--color-danger)"
        opacity={0.85}
      />
      {/* C=O double bond indicator — two short lines above */}
      <line x1={cx - 5} y1={cy - s - 6} x2={cx + 5} y2={cy - s - 6} stroke="var(--color-danger)" strokeWidth="2" />
      <line x1={cx - 5} y1={cy - s - 10} x2={cx + 5} y2={cy - s - 10} stroke="var(--color-danger)" strokeWidth="2" />
      {/* "O" above */}
      <text x={cx} y={cy - s - 18} textAnchor="middle" fontSize="9" fill="var(--color-danger)" fontFamily="var(--font-mono)" fontWeight="bold">
        O
      </text>
      {/* "K" label inside */}
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize="11" fill="white" fontFamily="var(--font-mono)" fontWeight="bold">
        K
      </text>
    </g>
  );
}

// Pile positions — stacked bottom-up like a growing heap
const PILE: { x: number; y: number }[] = [
  // Row 1 (bottom)
  { x: 170, y: 310 },
  { x: 230, y: 310 },
  // Row 2
  { x: 140, y: 264 },
  { x: 200, y: 264 },
  { x: 260, y: 264 },
  // Row 3
  { x: 115, y: 218 },
  { x: 170, y: 218 },
  { x: 228, y: 218 },
  { x: 284, y: 218 },
  // Row 4
  { x: 140, y: 172 },
  { x: 200, y: 172 },
  { x: 260, y: 172 },
  // Row 5 (top)
  { x: 170, y: 126 },
  { x: 230, y: 126 },
];

export default function KetoneAnimation({ currentStep }: KetoneAnimationProps) {
  const reducedMotion = useReducedMotion();
  const groupRef = useRef<SVGGElement>(null);
  const pileRef = useRef<SVGGElement>(null);

  // Step 3: single ketone fades in
  useEffect(() => {
    if (currentStep !== 3 || !groupRef.current || reducedMotion) return;
    const el = groupRef.current;
    gsap.fromTo(el, { opacity: 0, scale: 0.5, transformOrigin: "200px 180px" }, { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.5)" });
    return () => {
      gsap.killTweensOf(el);
    };
  }, [currentStep, reducedMotion]);

  // Step 4: pile builds up with stagger
  useEffect(() => {
    if (currentStep !== 4 || !pileRef.current || reducedMotion) return;
    const icons = pileRef.current.querySelectorAll(".ketone-pile-icon");
    gsap.fromTo(icons, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.07, ease: "bounce.out" });
    return () => {
      gsap.killTweensOf(icons);
    };
  }, [currentStep, reducedMotion]);

  if (currentStep === 3) {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full max-w-sm" role="img" aria-label="A single ketone body produced as the body burns fat for fuel">
        {/* Fat droplet source */}
        <ellipse cx={90} cy={180} rx={40} ry={52} fill="#fde68a" stroke="#f59e0b" strokeWidth="2" opacity={0.9} />
        <text x={90} y={173} textAnchor="middle" fontSize="20" aria-hidden="true">
          💧
        </text>
        <text x={90} y={198} textAnchor="middle" fontSize="9" fill="#92400e" fontFamily="var(--font-body)" fontWeight="600">
          fat
        </text>

        {/* Arrow */}
        <line x1={140} y1={180} x2={210} y2={180} stroke="var(--color-text-muted)" strokeWidth="2" strokeDasharray="5 3" />
        <polygon points="210,175 220,180 210,185" fill="var(--color-text-muted)" />
        <text x={178} y={170} textAnchor="middle" fontSize="8" fill="var(--color-text-muted)" fontFamily="var(--font-body)">
          burned for fuel
        </text>

        {/* Single ketone */}
        <g ref={groupRef} opacity={reducedMotion ? 1 : 0}>
          <KetoneIcon cx={290} cy={180} size={30} />
          <text x={290} y={230} textAnchor="middle" fontSize="10" fill="var(--color-danger)" fontFamily="var(--font-body)" fontWeight="600">
            ketone body
          </text>
        </g>

        {/* Caption */}
        <text x={W / 2} y={H - 20} textAnchor="middle" fontSize="11" fill="var(--color-text-muted)" fontFamily="var(--font-body)">
          fat → ketone bodies (acidic byproduct)
        </text>
      </svg>
    );
  }

  // Step 4: pile
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full max-w-sm" role="img" aria-label="Ketone bodies piling up in the bloodstream, causing diabetic ketoacidosis">
      <g ref={pileRef}>
        {PILE.map((pos, i) => (
          <g key={i} className="ketone-pile-icon" opacity={reducedMotion ? 1 : 0}>
            <KetoneIcon cx={pos.x} cy={pos.y} size={18} />
          </g>
        ))}
      </g>

      {/* Danger overlay label */}
      <rect x={60} y={12} width={280} height={36} rx={8} fill="#fee2e2" opacity={0.92} />
      <text x={W / 2} y={28} textAnchor="middle" fontSize="11" fill="var(--color-danger)" fontFamily="var(--font-body)" fontWeight="700">
        ⚠ blood turning acidic
      </text>
      <text x={W / 2} y={42} textAnchor="middle" fontSize="9.5" fill="var(--color-danger)" fontFamily="var(--font-body)">
        diabetic ketoacidosis (DKA)
      </text>
    </svg>
  );
}
