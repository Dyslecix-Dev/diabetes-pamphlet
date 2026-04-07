import { useMemo } from "react";
import { useReducedMotion } from "../../utils/a11y";

interface PopulationSplitProps {
  currentStep: number;
}

// Simple human figure SVG path
const PERSON_PATH = "M12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-4 9a2 2 0 0 0-2 2v1a1 1 0 0 0 1 1h1l1 7h6l1-7h1a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H8Z";

const COLS = 10;
const ROWS = 10;
const CELL = 28;
const PADDING = 4;
const ICON_SIZE = 24;
const SVG_W = COLS * CELL;
const SVG_H = ROWS * CELL;

// T1D = indices 0-6 (7 figures = ~5-10%), T2D = indices 7-99
const T1D_COUNT = 7;

// 33 figures spread evenly across the grid to represent "1 in 3 adults has prediabetes"
const PREDIABETES_INDICES = new Set(Array.from({ length: 33 }, (_, i) => i * 3 + 1));

function getFigureColor(index: number, currentStep: number): string {
  const showT1 = currentStep >= 3;
  const showT2 = currentStep >= 5;

  if (index < T1D_COUNT && showT1) return "var(--color-orange)";
  if (index >= T1D_COUNT && showT2) return "var(--color-green-mid)";
  return "var(--color-cream)";
}

export default function PopulationSplit({ currentStep }: PopulationSplitProps) {
  const reducedMotion = useReducedMotion();
  const showPrediabetes = currentStep >= 9;

  const figures = useMemo(() => {
    const items = [];
    for (let i = 0; i < 100; i++) {
      const row = Math.floor(i / COLS);
      const col = i % COLS;
      items.push({ index: i, x: col * CELL + PADDING, y: row * CELL + PADDING });
    }
    return items;
  }, []);

  const showT1 = currentStep >= 3;
  const showT2 = currentStep >= 5;

  return (
    <div>
      {!reducedMotion && showPrediabetes && (
        <style>{`
          @keyframes prediabetes-pulse {
            0%, 100% { opacity: 0.3; r: 13; }
            50% { opacity: 1; r: 14.5; }
          }
          .prediabetes-ring {
            animation: prediabetes-pulse 2s ease-in-out infinite;
          }
        `}</style>
      )}

      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full"
        role="img"
        aria-label={
          showT2
            ? `100 human figures: ${T1D_COUNT} highlighted for Type 1 diabetes (5-10%), ${100 - T1D_COUNT} for Type 2 (90-95%)${showPrediabetes ? "; 33 figures outlined to represent the 1-in-3 adults with prediabetes" : ""}`
            : showT1
              ? `100 human figures: ${T1D_COUNT} highlighted for Type 1 diabetes (5-10%)`
              : "100 human figures representing the diabetes population"
        }
      >
        {figures.map(({ index, x, y }) => {
          const color = getFigureColor(index, currentStep);
          const isPrediabetes = showPrediabetes && PREDIABETES_INDICES.has(index);
          return (
            <g
              key={index}
              transform={`translate(${x}, ${y}) scale(${ICON_SIZE / 24})`}
              style={{
                transition: reducedMotion ? "none" : "fill 0.4s ease",
              }}
            >
              {isPrediabetes && <circle cx={12} cy={12} r={13} fill="none" stroke="var(--color-danger)" strokeWidth="1.5" className={reducedMotion ? undefined : "prediabetes-ring"} />}
              <path d={PERSON_PATH} fill={color} />
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-4 text-sm" style={{ color: "var(--color-text-muted)" }}>
        {showT1 && (
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ background: "var(--color-orange)" }} />
            Type 1 (5–10%)
          </span>
        )}
        {showT2 && (
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ background: "var(--color-green-mid)" }} />
            Type 2 (90–95%)
          </span>
        )}
        {showPrediabetes && (
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm border" style={{ background: "transparent", borderColor: "var(--color-danger)" }} />
            Prediabetes risk (1 in 3)
          </span>
        )}
      </div>

      {/* Prediabetes callout */}
      {showPrediabetes && (
        <p className="mt-2 rounded-md px-3 py-2 text-sm font-medium" style={{ background: "var(--color-danger-15)", color: "var(--color-danger)" }}>
          1 in 3 US adults has prediabetes — most don't know it.
        </p>
      )}
    </div>
  );
}
