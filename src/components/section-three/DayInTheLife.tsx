import { useReducedMotion } from "../../utils/a11y";

interface DayInTheLifeProps {
  currentStep: number;
}

// Physiological animation stages driven by scroll step
// Step 0: Food entering digestive system
// Step 1: Sugar hits bloodstream, pancreas releases insulin
// Step 2: Healthy process — glucose enters cells
// Step 3: Insulin resistance — cells rejecting insulin

const STAGES = [
  { label: "Food enters your digestive system", phase: "digest" },
  { label: "Sugar hits bloodstream, pancreas releases insulin", phase: "insulin" },
  { label: "Glucose enters cells — blood sugar normalizes", phase: "healthy" },
  { label: "Cells start ignoring insulin — glucose blocked", phase: "resistant" },
] as const;

type Phase = (typeof STAGES)[number]["phase"];

function FoodIcon({ animated }: { animated: boolean }) {
  return (
    <g transform="translate(140, 20)">
      {/* Simple plate/food icon */}
      <circle cx="20" cy="20" r="18" fill="var(--color-cream)" stroke="var(--color-green-mid)" strokeWidth="2" />
      <rect x="12" y="14" width="16" height="4" rx="2" fill="var(--color-orange)" opacity={animated ? 1 : 0.4} />
      <rect x="10" y="20" width="20" height="4" rx="2" fill="var(--color-green-mid)" opacity={animated ? 1 : 0.4} />
    </g>
  );
}

function GlucoseDots({ phase, animated }: { phase: Phase; animated: boolean }) {
  const dots = [];
  const baseY = 80;
  const transition = animated ? "all 0.6s ease" : "none";

  for (let i = 0; i < 8; i++) {
    const x = 60 + i * 30;
    let y = baseY;
    let color = "var(--color-orange)";
    let opacity = 0.3;

    if (phase === "digest") {
      // Dots clustered at top (stomach area)
      y = 60 + Math.sin(i) * 10;
      opacity = i < 3 ? 0.8 : 0.2;
    } else if (phase === "insulin") {
      // Dots spreading into bloodstream
      y = baseY + Math.sin(i * 0.8) * 15;
      opacity = 0.9;
    } else if (phase === "healthy") {
      // Dots entering cells (moving down)
      y = baseY + 40 + i * 5;
      opacity = 0.6;
      color = "var(--color-success)";
    } else if (phase === "resistant") {
      // Dots stuck, building up
      y = baseY + Math.random() * 5;
      opacity = 1;
      color = "var(--color-danger)";
    }

    dots.push(<circle key={i} cx={x} cy={y} r={5} fill={color} opacity={opacity} style={{ transition }} />);
  }
  return <>{dots}</>;
}

function InsulinKeys({ phase, animated }: { phase: Phase; animated: boolean }) {
  if (phase === "digest") return null;
  const transition = animated ? "all 0.6s ease" : "none";

  return (
    <>
      {[0, 1, 2].map((i) => {
        const x = 100 + i * 60;
        const baseY = 110;
        const rejected = phase === "resistant";

        return (
          <g key={i} style={{ transition }}>
            {/* Insulin "key" */}
            <rect
              x={x}
              y={rejected ? baseY - 20 : baseY}
              width={10}
              height={20}
              rx={3}
              fill={rejected ? "var(--color-danger-light)" : "var(--color-green-mid)"}
              opacity={phase === "insulin" || phase === "healthy" || phase === "resistant" ? 0.9 : 0}
              style={{ transition }}
            />
            {/* Rejection X mark */}
            {rejected && (
              <text x={x + 5} y={baseY - 25} textAnchor="middle" fontSize="14" fill="var(--color-danger)" fontWeight="bold">
                ✕
              </text>
            )}
          </g>
        );
      })}
    </>
  );
}

function CellRow({ phase, animated }: { phase: Phase; animated: boolean }) {
  const transition = animated ? "all 0.6s ease" : "none";

  return (
    <>
      {[0, 1, 2, 3].map((i) => {
        const x = 50 + i * 70;
        const y = 150;
        const healthy = phase === "healthy";
        const resistant = phase === "resistant";

        return (
          <g key={i}>
            {/* Cell body */}
            <rect
              x={x}
              y={y}
              width={50}
              height={35}
              rx={8}
              fill={healthy ? "var(--color-success)" : resistant ? "var(--color-danger-light)" : "var(--color-cream)"}
              stroke={resistant ? "var(--color-danger)" : "var(--color-green-dark)"}
              strokeWidth={1.5}
              opacity={phase === "digest" ? 0.3 : 0.8}
              style={{ transition }}
            />
            {/* Cell receptor slot */}
            <rect
              x={x + 20}
              y={y - 6}
              width={10}
              height={8}
              rx={2}
              fill={healthy ? "var(--color-green-mid)" : resistant ? "var(--color-danger)" : "var(--color-text-muted)"}
              opacity={phase === "digest" ? 0.2 : 0.7}
              style={{ transition }}
            />
          </g>
        );
      })}
    </>
  );
}

export default function DayInTheLife({ currentStep }: DayInTheLifeProps) {
  const reducedMotion = useReducedMotion();
  const stageIndex = Math.min(currentStep, STAGES.length - 1);
  const stage = STAGES[stageIndex];

  return (
    <div>
      <svg viewBox="0 0 340 210" className="w-full" role="img" aria-label={stage.label}>
        {/* Background bloodstream line */}
        <line x1="30" y1="80" x2="310" y2="80" stroke="var(--color-danger-light)" strokeWidth="2" strokeDasharray="6 4" opacity={stage.phase === "digest" ? 0.2 : 0.5} />

        <FoodIcon animated={!reducedMotion} />
        <GlucoseDots phase={stage.phase} animated={!reducedMotion} />
        <InsulinKeys phase={stage.phase} animated={!reducedMotion} />
        <CellRow phase={stage.phase} animated={!reducedMotion} />

        {/* Labels */}
        <text x="170" y="75" textAnchor="middle" fontSize="9" fill="var(--color-text-muted)" fontFamily="var(--font-body)">
          bloodstream
        </text>
        <text x="170" y="200" textAnchor="middle" fontSize="9" fill="var(--color-text-muted)" fontFamily="var(--font-body)">
          cells
        </text>
      </svg>

      {/* Phase indicator */}
      <div className="mt-3 flex justify-center gap-2">
        {STAGES.map((s, i) => (
          <span
            key={s.phase}
            className="inline-block h-2 w-2 rounded-full"
            style={{
              background: i <= stageIndex ? "var(--color-green-mid)" : "var(--color-cream)",
              transition: reducedMotion ? "none" : "background 0.3s ease",
            }}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
