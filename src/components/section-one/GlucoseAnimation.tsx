import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "../../utils/a11y";

interface GlucoseAnimationProps {
  currentStep: number;
}

// Hexagonal glucose molecule (C6H12O6) simplified as a ring with branches
const RING_POINTS = [
  { x: 200, y: 100 }, // top
  { x: 280, y: 140 }, // top-right
  { x: 280, y: 220 }, // bottom-right
  { x: 200, y: 260 }, // bottom
  { x: 120, y: 220 }, // bottom-left
  { x: 120, y: 140 }, // top-left
];

const BRANCHES = [
  { from: 0, dx: 0, dy: -40, label: "OH" },
  { from: 1, dx: 40, dy: -20, label: "H" },
  { from: 2, dx: 40, dy: 20, label: "OH" },
  { from: 3, dx: 0, dy: 40, label: "CH₂OH" },
  { from: 4, dx: -40, dy: 20, label: "OH" },
  { from: 5, dx: -40, dy: -20, label: "H" },
];

export default function GlucoseAnimation({ currentStep }: GlucoseAnimationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!svgRef.current || reducedMotion) return;

    const svg = svgRef.current;
    const bonds = svg.querySelectorAll(".bond");
    const atoms = svg.querySelectorAll(".atom");
    const branches = svg.querySelectorAll(".branch");
    const labels = svg.querySelectorAll(".atom-label");

    if (currentStep === 0) {
      // Assemble: animate in
      gsap.fromTo(bonds, { strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" });
      gsap.fromTo(atoms, { scale: 0, transformOrigin: "center" }, { scale: 1, duration: 0.4, stagger: 0.06, delay: 0.3, ease: "back.out(2)" });
      gsap.fromTo(branches, { opacity: 0, scale: 0, transformOrigin: "center" }, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, delay: 0.6, ease: "back.out(1.5)" });
      gsap.fromTo(labels, { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.05, delay: 0.8 });
    } else if (currentStep === 1) {
      // Glitching/fragmenting
      atoms.forEach((atom) => {
        gsap.to(atom, {
          x: () => gsap.utils.random(-8, 8),
          y: () => gsap.utils.random(-8, 8),
          duration: 0.3,
          repeat: -1,
          yoyo: true,
          ease: "rough({ strength: 3, points: 10 })",
        });
      });
      gsap.to(bonds, { opacity: 0.4, duration: 0.5 });
    } else if (currentStep >= 2 && currentStep <= 3) {
      // Locked out / ketone state — molecule faded, red tint
      gsap.killTweensOf([...atoms, ...bonds, ...branches]);
      gsap.to(atoms, { x: 0, y: 0, duration: 0.3 });
      gsap.to(svg, { opacity: currentStep === 3 ? 0.5 : 0.7, duration: 0.4 });
    } else if (currentStep === 4) {
      // Danger state — red
      gsap.killTweensOf([...atoms, ...bonds, ...branches]);
      gsap.to(atoms, { x: 0, y: 0, fill: "var(--color-danger)", duration: 0.5 });
      gsap.to(bonds, { stroke: "var(--color-danger)", opacity: 1, duration: 0.5 });
      gsap.to(svg, { opacity: 1, duration: 0.3 });
    } else {
      // Steps 5-7: reset to normal
      gsap.killTweensOf([...atoms, ...bonds, ...branches]);
      gsap.to(atoms, { x: 0, y: 0, fill: "var(--color-green-mid)", scale: 1, duration: 0.4 });
      gsap.to(bonds, { stroke: "var(--color-green-dark)", opacity: 1, duration: 0.4 });
      gsap.to(branches, { opacity: 1, scale: 1, duration: 0.3 });
      gsap.to(labels, { opacity: 1, duration: 0.3 });
      gsap.to(svg, { opacity: 1, duration: 0.3 });
    }

    return () => {
      gsap.killTweensOf([...atoms, ...bonds, ...branches, ...labels, svg]);
    };
  }, [currentStep, reducedMotion]);

  const ringPath = RING_POINTS.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <svg ref={svgRef} viewBox="0 0 400 360" className="mx-auto w-full max-w-md" role="img" aria-label={`Glucose molecule illustration — ${getAriaDescription(currentStep)}`}>
      {/* Ring bonds */}
      {RING_POINTS.map((point, i) => {
        const next = RING_POINTS[(i + 1) % RING_POINTS.length];
        return (
          <line
            key={`bond-${i}`}
            className="bond"
            x1={point.x}
            y1={point.y}
            x2={next.x}
            y2={next.y}
            stroke="var(--color-green-dark)"
            strokeWidth={3}
            strokeDasharray={100}
            strokeDashoffset={reducedMotion ? 0 : undefined}
          />
        );
      })}

      {/* Branch lines and labels */}
      {BRANCHES.map((branch, i) => {
        const origin = RING_POINTS[branch.from];
        return (
          <g key={`branch-${i}`} className="branch">
            <line x1={origin.x} y1={origin.y} x2={origin.x + branch.dx} y2={origin.y + branch.dy} stroke="var(--color-green-dark)" strokeWidth={2} />
            <text
              className="atom-label"
              x={origin.x + branch.dx * 1.5}
              y={origin.y + branch.dy * 1.5}
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--color-text-muted)"
              fontSize={12}
              fontFamily="var(--font-mono)"
            >
              {branch.label}
            </text>
          </g>
        );
      })}

      {/* Ring atoms (carbon nodes) */}
      {RING_POINTS.map((point, i) => (
        <circle key={`atom-${i}`} className="atom" cx={point.x} cy={point.y} r={8} fill="var(--color-green-mid)" />
      ))}

      {/* Center label */}
      <text x={200} y={180} textAnchor="middle" dominantBaseline="central" fill="var(--color-green-dark)" fontSize={14} fontFamily="var(--font-display)" fontWeight="bold">
        C₆H₁₂O₆
      </text>
    </svg>
  );
}

function getAriaDescription(step: number): string {
  switch (step) {
    case 0:
      return "molecule assembling, showing the hexagonal ring structure of glucose";
    case 1:
      return "molecule fragmenting, representing a broken fuel system";
    case 2:
      return "glucose locked out of cells due to insulin dysfunction";
    case 3:
      return "ketone bodies building up as the body burns fat instead";
    case 4:
      return "danger state — diabetic ketoacidosis, molecule shown in red";
    default:
      return "glucose molecule";
  }
}
