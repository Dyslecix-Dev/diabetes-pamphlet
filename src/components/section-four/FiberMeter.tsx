import { useEffect, useRef } from "react";
import { useReducedMotion } from "../../utils/a11y";

/**
 * Two glucose curves: with fiber (smooth) vs without (spiky).
 * Rendered as an SVG with animated path drawing.
 */

const W = 360;
const H = 200;
const PAD = { top: 30, right: 20, bottom: 40, left: 45 };

// Time in minutes after eating (0–180)
// Blood glucose response WITHOUT fiber — sharp spike then crash
const WITHOUT_FIBER = [
  [0, 90],
  [15, 110],
  [30, 160],
  [45, 185],
  [60, 170],
  [75, 140],
  [90, 100],
  [105, 75],
  [120, 70],
  [150, 80],
  [180, 88],
];

// Blood glucose response WITH fiber — gentle rise, gentle fall
const WITH_FIBER = [
  [0, 90],
  [15, 95],
  [30, 110],
  [45, 125],
  [60, 130],
  [75, 128],
  [90, 120],
  [105, 110],
  [120, 100],
  [150, 93],
  [180, 90],
];

function toPath(points: number[][]): string {
  const xScale = (v: number) => PAD.left + (v / 180) * (W - PAD.left - PAD.right);
  const yScale = (v: number) => PAD.top + (1 - (v - 50) / 160) * (H - PAD.top - PAD.bottom);

  return points.map((p, i) => `${i === 0 ? "M" : "L"}${xScale(p[0]).toFixed(1)},${yScale(p[1]).toFixed(1)}`).join(" ");
}

export default function FiberMeter({ isActive }: { isActive: boolean }) {
  const withoutRef = useRef<SVGPathElement>(null);
  const withRef = useRef<SVGPathElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const paths = [withoutRef.current, withRef.current];
    paths.forEach((path) => {
      if (!path) return;
      const len = path.getTotalLength();
      if (!isActive || reducedMotion) {
        path.style.strokeDasharray = "none";
        path.style.strokeDashoffset = "0";
        return;
      }
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;
      // Trigger reflow then animate
      path.getBoundingClientRect();
      path.style.transition = "stroke-dashoffset 1.5s ease-out";
      path.style.strokeDashoffset = "0";
    });
  }, [isActive, reducedMotion]);

  const xScale = (v: number) => PAD.left + (v / 180) * (W - PAD.left - PAD.right);
  const yScale = (v: number) => PAD.top + (1 - (v - 50) / 160) * (H - PAD.top - PAD.bottom);

  // Danger zone (above 140 mg/dL)
  const dangerY = yScale(140);

  return (
    <div className="mx-auto w-full max-w-sm">
      <h3 className="font-display mb-2 text-center text-xl" style={{ color: "var(--color-green-dark)" }}>
        Fiber's Effect on Blood Sugar
      </h3>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Chart comparing blood glucose response with and without fiber. Without fiber shows a sharp spike to 185 mg/dL. With fiber shows a gentle rise to 130 mg/dL."
      >
        {/* Danger zone shading */}
        <rect x={PAD.left} y={dangerY} width={W - PAD.left - PAD.right} height={yScale(50) - dangerY} fill="var(--color-danger)" opacity={0} />
        <rect x={PAD.left} y={PAD.top} width={W - PAD.left - PAD.right} height={dangerY - PAD.top} fill="var(--color-danger)" opacity={0.04} />

        {/* Normal range line */}
        <line x1={PAD.left} x2={W - PAD.right} y1={dangerY} y2={dangerY} stroke="var(--color-danger)" strokeWidth={1} strokeDasharray="4 3" opacity={0.4} />
        <text x={W - PAD.right - 2} y={dangerY - 4} textAnchor="end" className="font-body" fontSize={9} fill="var(--color-danger)" opacity={0.7}>
          140 mg/dL
        </text>

        {/* X axis */}
        <line x1={PAD.left} x2={W - PAD.right} y1={H - PAD.bottom} y2={H - PAD.bottom} stroke="var(--color-text-muted)" strokeWidth={1} opacity={0.3} />
        {[0, 30, 60, 90, 120, 150, 180].map((t) => (
          <text key={t} x={xScale(t)} y={H - PAD.bottom + 14} textAnchor="middle" className="font-body" fontSize={9} fill="var(--color-text-muted)">
            {t}m
          </text>
        ))}
        <text x={W / 2} y={H - 4} textAnchor="middle" className="font-body" fontSize={10} fill="var(--color-text-muted)">
          Time after eating
        </text>

        {/* Y axis labels */}
        {[70, 100, 140, 185].map((v) => (
          <text key={v} x={PAD.left - 5} y={yScale(v) + 3} textAnchor="end" className="font-body" fontSize={9} fill="var(--color-text-muted)">
            {v}
          </text>
        ))}

        {/* Without fiber path (spiky) */}
        <path ref={withoutRef} d={toPath(WITHOUT_FIBER)} fill="none" stroke="var(--color-danger)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

        {/* With fiber path (smooth) */}
        <path ref={withRef} d={toPath(WITH_FIBER)} fill="none" stroke="var(--color-success)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {/* Legend */}
      <div className="font-body mt-2 flex justify-center gap-6 text-sm">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-5 rounded" style={{ backgroundColor: "var(--color-danger)" }} aria-hidden="true" />
          Without fiber
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-5 rounded" style={{ backgroundColor: "var(--color-success)" }} aria-hidden="true" />
          With fiber
        </span>
      </div>

      {/* Hidden data table for accessibility */}
      <table className="sr-only">
        <caption>Blood glucose levels over time with and without fiber</caption>
        <thead>
          <tr>
            <th>Time (min)</th>
            <th>Without Fiber (mg/dL)</th>
            <th>With Fiber (mg/dL)</th>
          </tr>
        </thead>
        <tbody>
          {WITHOUT_FIBER.map((p, i) => (
            <tr key={i}>
              <td>{p[0]}</td>
              <td>{p[1]}</td>
              <td>{WITH_FIBER[i][1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
