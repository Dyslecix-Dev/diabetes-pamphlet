import { useReducedMotion } from "../../utils/a11y";

interface DayInTheLifeProps {
  currentStep: number;
}

// Step 0: Food → digestive system (sugar being released)
// Step 1: Sugar floods bloodstream, pancreas releases insulin keys
// Step 2: Healthy — insulin keys unlock cells, glucose enters
// Step 3: Resistant — cells ignore insulin, glucose piles up dangerously

const STEP_LABELS = [
  "You eat a sugary meal — your body breaks it down into glucose",
  "Glucose floods your bloodstream. Your pancreas releases insulin to manage it.",
  "Healthy body: insulin unlocks cells, glucose enters, blood sugar drops",
  "Insulin resistance: cells ignore insulin. Glucose builds up in the blood.",
];

// ─── Layout constants ────────────────────────────────────────────────────────
const W = 340;
const H = 295;

// Zone 1 — top elements
const STOMACH_CX = 55;
const STOMACH_CY = 44;
const STOMACH_R = 26;

const PANCREAS_X = 246;
const PANCREAS_Y = 22;
const PANCREAS_W = 76;
const PANCREAS_H = 30;

// Zone 2 — bloodstream band  (y 105–127)
const BLOOD_Y1 = 105;
const BLOOD_Y2 = 127;
const BLOOD_MID = (BLOOD_Y1 + BLOOD_Y2) / 2;

// Zone 3 — insulin keys float here (y ~168–190)
const KEY_Y_HEALTHY = 168;
const KEY_Y_REJECTED = 170;

// Zone 4 — cells (y 245, r 27)
const CELL_R = 27;
const CELL_CY = 245;
const CELLS = [{ cx: 42 }, { cx: 122 }, { cx: 202 }, { cx: 282 }];

// Glucose dot x positions
const GLUCOSE_X_CLUSTERED = [68, 82, 96, 74, 88, 78];
const GLUCOSE_X_SPREAD = [48, 88, 128, 172, 212, 256];
const GLUCOSE_X_EXCESS = [38, 72, 106, 146, 182, 218, 256, 294];

// ─── Sub-components ──────────────────────────────────────────────────────────

function FlowArrow({ x, y1, y2, color = "var(--color-text-muted)" }: { x: number; y1: number; y2: number; color?: string }) {
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2 - 5} stroke={color} strokeWidth="1.2" strokeDasharray="3 2" opacity={0.5} />
      <polygon points={`${x - 4},${y2 - 5} ${x + 4},${y2 - 5} ${x},${y2}`} fill={color} opacity={0.5} />
    </g>
  );
}

function Stomach({ step, animated }: { step: number; animated: boolean }) {
  const active = step === 0;
  const faded = step > 1;
  return (
    <g opacity={faded ? 0.35 : 1} style={{ transition: animated ? "opacity 0.5s ease" : "none" }}>
      <ellipse
        cx={STOMACH_CX}
        cy={STOMACH_CY}
        rx={STOMACH_R}
        ry={STOMACH_R * 0.82}
        fill={active ? "var(--color-orange)" : "var(--color-cream)"}
        stroke="var(--color-orange)"
        strokeWidth="2"
        style={{ transition: animated ? "fill 0.5s ease" : "none" }}
      />
      <text x={STOMACH_CX} y={STOMACH_CY + 6} textAnchor="middle" fontSize="17" aria-hidden="true">
        🍔
      </text>
      <text x={STOMACH_CX} y={STOMACH_CY + STOMACH_R + 13} textAnchor="middle" fontSize="8.5" fill="var(--color-text-muted)" fontFamily="var(--font-body)">
        stomach
      </text>
      {/* Arrow from stomach toward bloodstream — starts below the "stomach" label */}
      <FlowArrow x={STOMACH_CX} y1={STOMACH_CY + STOMACH_R + 22} y2={BLOOD_Y1 - 2} color="var(--color-orange)" />
    </g>
  );
}

function Pancreas({ step, animated }: { step: number; animated: boolean }) {
  const active = step >= 1;
  const cx = PANCREAS_X + PANCREAS_W / 2;
  return (
    <g opacity={step === 0 ? 0.3 : 1} style={{ transition: animated ? "opacity 0.5s ease" : "none" }}>
      <rect
        x={PANCREAS_X}
        y={PANCREAS_Y}
        width={PANCREAS_W}
        height={PANCREAS_H}
        rx={12}
        fill={active ? "var(--color-green-mid)" : "var(--color-cream)"}
        stroke="var(--color-green-dark)"
        strokeWidth="1.5"
        style={{ transition: animated ? "fill 0.5s ease" : "none" }}
      />
      <text
        x={cx}
        y={PANCREAS_Y + PANCREAS_H / 2 + 4}
        textAnchor="middle"
        fontSize="8.5"
        fill={active ? "white" : "var(--color-text-muted)"}
        fontFamily="var(--font-body)"
        fontWeight="600"
        style={{ transition: animated ? "fill 0.5s ease" : "none" }}
      >
        pancreas
      </text>
      <text x={cx} y={PANCREAS_Y + PANCREAS_H + 13} textAnchor="middle" fontSize="7.5" fill="var(--color-text-muted)" fontFamily="var(--font-body)">
        {active ? "releases insulin" : "not active yet"}
      </text>
      {/* Arrow from pancreas toward bloodstream — starts below the "releases insulin" label */}
      {active && <FlowArrow x={cx} y1={PANCREAS_Y + PANCREAS_H + 24} y2={BLOOD_Y1 - 2} color="var(--color-green-mid)" />}
    </g>
  );
}

function Bloodstream({ step }: { step: number }) {
  const danger = step === 3;
  return (
    <g>
      {/* Label above the band */}
      <text x={10} y={BLOOD_Y1 - 6} fontSize="8" fill={danger ? "var(--color-danger)" : "var(--color-orange)"} fontFamily="var(--font-body)" fontWeight="600">
        bloodstream
      </text>
      <rect x={0} y={BLOOD_Y1} width={W} height={BLOOD_Y2 - BLOOD_Y1} fill={danger ? "#fde8e8" : "#fde8c0"} opacity={0.65} rx={4} />
    </g>
  );
}

function GlucoseDots({ step, animated }: { step: number; animated: boolean }) {
  let xPositions: number[];
  let color: string;
  let showPileLabel: boolean;

  if (step === 0) {
    xPositions = GLUCOSE_X_CLUSTERED;
    color = "var(--color-orange)";
    showPileLabel = false;
  } else if (step === 1) {
    xPositions = GLUCOSE_X_SPREAD;
    color = "var(--color-orange)";
    showPileLabel = false;
  } else if (step === 2) {
    xPositions = GLUCOSE_X_SPREAD.slice(0, 2);
    color = "var(--color-orange)";
    showPileLabel = false;
  } else {
    xPositions = GLUCOSE_X_EXCESS;
    color = "var(--color-danger)";
    showPileLabel = true;
  }

  return (
    <g>
      {xPositions.map((x, i) => (
        <g key={i} style={{ transition: animated ? "cx 0.6s ease, fill 0.4s ease" : "none" }}>
          <circle cx={x} cy={BLOOD_MID} r={6} fill={color} opacity={0.88} />
          {i === 0 && (
            <text x={x} y={BLOOD_MID + 4} textAnchor="middle" fontSize="6" fill="white" fontWeight="bold" aria-hidden="true">
              G
            </text>
          )}
        </g>
      ))}
      {showPileLabel && (
        <text x={W / 2} y={BLOOD_Y2 + 16} textAnchor="middle" fontSize="8.5" fill="var(--color-danger)" fontFamily="var(--font-body)" fontWeight="700">
          ↑ glucose piling up — can't get into cells
        </text>
      )}
    </g>
  );
}

function InsulinKeys({ step, animated }: { step: number; animated: boolean }) {
  if (step === 0) return null;

  const rejected = step === 3;
  const keyColor = rejected ? "var(--color-danger)" : "var(--color-green-mid)";
  const keyY = rejected ? KEY_Y_REJECTED : KEY_Y_HEALTHY;
  const keyXPositions = [CELLS[0].cx, CELLS[1].cx, CELLS[2].cx];

  return (
    <g>
      {keyXPositions.map((kx, i) => (
        <g key={i} transform={`translate(${kx}, ${keyY})`} style={{ transition: animated ? "all 0.6s ease" : "none" }}>
          {/* Key head */}
          <circle cx={0} cy={0} r={7} fill={keyColor} opacity={0.9} />
          <text x={0} y={4} textAnchor="middle" fontSize="7.5" fill="white" fontWeight="bold" aria-hidden="true">
            I
          </text>
          {/* Key shaft */}
          <rect x={6} y={-2.5} width={12} height={5} rx={1.5} fill={keyColor} opacity={0.9} />
          {/* Rejection X, offset to the right of shaft */}
          {rejected && (
            <text x={26} y={5} fontSize="13" fill="var(--color-danger)" fontWeight="bold" aria-hidden="true">
              ✕
            </text>
          )}
        </g>
      ))}

      {/* Single legend line, centered, below the keys */}
      <text
        x={W / 2}
        y={keyY + 22}
        textAnchor="middle"
        fontSize="8"
        fill={rejected ? "var(--color-danger)" : "var(--color-green-mid)"}
        fontFamily="var(--font-body)"
        fontWeight={rejected ? "700" : "500"}
      >
        {rejected ? "insulin blocked — cells won't open" : 'insulin = "key" that opens cells'}
      </text>
    </g>
  );
}

function Cells({ step, animated }: { step: number; animated: boolean }) {
  const healthy = step === 2;
  const resistant = step === 3;
  const dimmed = step === 0;

  let fill: string;
  let strokeColor: string;
  if (healthy) {
    fill = "#d1fae5";
    strokeColor = "var(--color-green-mid)";
  } else if (resistant) {
    fill = "#fee2e2";
    strokeColor = "var(--color-danger)";
  } else {
    fill = "var(--color-cream)";
    strokeColor = "var(--color-green-dark)";
  }

  const lockIcon = healthy ? "🔓" : "🔒";
  const cellLabel = healthy ? "cells absorbing glucose ✓" : resistant ? "cells closed — glucose can't enter" : "body cells";

  return (
    <g opacity={dimmed ? 0.28 : 1} style={{ transition: animated ? "opacity 0.5s ease" : "none" }}>
      {CELLS.map((cell, i) => (
        <g key={i}>
          {/* Lock icon centred above the cell */}
          <text x={cell.cx} y={CELL_CY - CELL_R - 6} textAnchor="middle" fontSize="13" aria-hidden="true">
            {lockIcon}
          </text>
          <circle cx={cell.cx} cy={CELL_CY} r={CELL_R} fill={fill} stroke={strokeColor} strokeWidth="2" style={{ transition: animated ? "fill 0.5s ease, stroke 0.5s ease" : "none" }} />
          {/* Glucose dot absorbed inside cell */}
          {healthy && <circle cx={cell.cx} cy={CELL_CY} r={6} fill="var(--color-orange)" opacity={0.8} />}
        </g>
      ))}

      {/* Status label below cells */}
      <text
        x={W / 2}
        y={CELL_CY + CELL_R + 16}
        textAnchor="middle"
        fontSize="8.5"
        fill={healthy ? "var(--color-green-mid)" : resistant ? "var(--color-danger)" : "var(--color-text-muted)"}
        fontFamily="var(--font-body)"
        fontWeight={healthy || resistant ? "600" : "400"}
        style={{ transition: animated ? "fill 0.4s ease" : "none" }}
      >
        {cellLabel}
      </text>
    </g>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function DayInTheLife({ currentStep }: DayInTheLifeProps) {
  const reducedMotion = useReducedMotion();
  const step = Math.min(currentStep, 3);
  const animated = !reducedMotion;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={STEP_LABELS[step]}>
        <Bloodstream step={step} />
        <Stomach step={step} animated={animated} />
        <Pancreas step={step} animated={animated} />
        <GlucoseDots step={step} animated={animated} />
        <InsulinKeys step={step} animated={animated} />
        <Cells step={step} animated={animated} />
      </svg>

      {/* Step caption */}
      <p className="mt-3 text-center text-sm font-medium" style={{ color: step === 3 ? "var(--color-danger)" : "var(--color-green-dark)" }}>
        {STEP_LABELS[step]}
      </p>

      {/* Progress dots */}
      <div className="mt-2 flex justify-center gap-2">
        {STEP_LABELS.map((_, i) => (
          <span
            key={i}
            className="inline-block h-2 w-2 rounded-full"
            style={{
              background: i <= step ? "var(--color-green-mid)" : "var(--color-cream)",
              transition: animated ? "background 0.3s ease" : "none",
            }}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
