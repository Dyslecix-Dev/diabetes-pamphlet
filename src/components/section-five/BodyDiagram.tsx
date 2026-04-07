import complicationsData from "../../data/complications.json";
import { useReducedMotion } from "../../utils/a11y";

interface BodyDiagramProps {
  currentStep: number;
}

/**
 * Maps scroll steps to which organs are highlighted:
 * 0: neutral, 1: nerves, 2-3: legs, 4: eyes, 5: mouth,
 * 6: kidneys, 7: heart, 8: all danger, 10: all healthy
 */
const stepToOrgans: Record<number, string[]> = {
  1: ["nerves"],
  2: ["legs"],
  3: ["legs"],
  4: ["eyes"],
  5: ["mouth"],
  6: ["kidneys"],
  7: ["heart"],
  8: ["nerves", "legs", "eyes", "mouth", "kidneys", "heart"],
};

const organColors = {
  neutral: "transparent",
  highlight: "var(--color-orange)",
  danger: "var(--color-danger)",
  healthy: "var(--color-success)",
};

function getOrganColor(organ: string, currentStep: number) {
  if (currentStep === 10) return organColors.healthy;
  if (currentStep === 8) return organColors.danger;
  const activeOrgans = stepToOrgans[currentStep] || [];
  if (activeOrgans.includes(organ)) return organColors.highlight;
  return organColors.neutral;
}

/**
 * Organ overlay regions — positioned as percentages of the image (1024x1820).
 * Each region is a box: [top%, left%, width%, height%]
 */
const organRegions: Record<string, { top: number; left: number; width: number; height: number; borderRadius?: string }[]> = {
  eyes: [
    { top: 6, left: 43, width: 6, height: 3, borderRadius: "50%" },
    { top: 6, left: 50, width: 6, height: 3, borderRadius: "50%" },
  ],
  mouth: [{ top: 11, left: 44, width: 10, height: 3.5, borderRadius: "50%" }],
  heart: [{ top: 22, left: 38, width: 24, height: 12, borderRadius: "30%" }],
  kidneys: [
    { top: 42, left: 34, width: 14, height: 8, borderRadius: "40%" },
    { top: 42, left: 51, width: 14, height: 8, borderRadius: "40%" },
  ],
  legs: [
    { top: 55, left: 34, width: 11, height: 40, borderRadius: "8px" },
    { top: 55, left: 54, width: 11, height: 40, borderRadius: "8px" },
  ],
  nerves: [
    // Hands
    { top: 51, left: 14, width: 10, height: 5, borderRadius: "50%" },
    { top: 51, left: 76, width: 10, height: 5, borderRadius: "50%" },
    // Spine region
    { top: 14, left: 44, width: 12, height: 30, borderRadius: "8px" },
    // Feet
    { top: 88, left: 28, width: 16, height: 8, borderRadius: "50%" },
    { top: 88, left: 56, width: 16, height: 8, borderRadius: "50%" },
  ],
};

export default function BodyDiagram({ currentStep }: BodyDiagramProps) {
  const reducedMotion = useReducedMotion();
  const transition = reducedMotion ? "none" : "background-color 0.6s ease, opacity 0.6s ease, box-shadow 0.6s ease";

  const activeOrgans = currentStep === 8 || currentStep === 10 ? ["nerves", "legs", "eyes", "mouth", "kidneys", "heart"] : stepToOrgans[currentStep] || [];

  const getLabel = (organ: string) => {
    const item = complicationsData.complications_list.find((c) => c.organ === organ);
    return item ? item.label : organ;
  };

  return (
    <div className="flex w-full flex-col items-center" role="img" aria-label="Human body diagram showing diabetes complications">
      {/* Pulse animation for active organ highlights */}
      {!reducedMotion && (
        <style>{`
          @keyframes organ-pulse {
            0%, 100% { opacity: 0.55; }
            50% { opacity: 0.8; }
          }
          .organ-active {
            animation: organ-pulse 1.8s ease-in-out infinite;
          }
        `}</style>
      )}

      {/* Active complication label */}
      <div className="mb-4 min-h-8 text-center" aria-live="polite">
        {currentStep >= 1 && currentStep <= 7 && activeOrgans.length > 0 && (
          <p className="font-body text-lg font-semibold" style={{ color: "var(--color-warning)" }}>
            {activeOrgans.map(getLabel).join(" · ")}
          </p>
        )}
        {currentStep === 8 && (
          <p className="font-body text-lg font-semibold" style={{ color: "var(--color-danger)" }}>
            Diabetic ketoacidosis — full-body crisis
          </p>
        )}
        {currentStep === 10 && (
          <p className="font-body text-lg font-semibold" style={{ color: "var(--color-success)" }}>
            Prevention works — a healthier future
          </p>
        )}
      </div>

      {/* Body diagram with overlay highlights */}
      <div className="relative w-full max-w-56 lg:max-w-65" style={{ aspectRatio: "1024 / 1820" }}>
        <img src="/images/body-diagram.png" alt="" aria-hidden="true" className="block h-full w-full object-contain" draggable={false} />

        {/* Organ highlight overlays */}
        {Object.entries(organRegions).map(([organ, regions]) => {
          const color = getOrganColor(organ, currentStep);
          const isActive = activeOrgans.includes(organ);

          return regions.map((region, i) => (
            <div
              key={`${organ}-${i}`}
              className={isActive && !reducedMotion ? "organ-active" : undefined}
              style={{
                position: "absolute",
                top: `${region.top}%`,
                left: `${region.left}%`,
                width: `${region.width}%`,
                height: `${region.height}%`,
                borderRadius: region.borderRadius || "50%",
                backgroundColor: color,
                opacity: isActive ? 0.65 : 0,
                pointerEvents: "none",
                transition,
                boxShadow: isActive ? `0 0 28px ${color}, 0 0 12px ${color}` : "none",
              }}
            />
          ));
        })}
      </div>

      {/* Screen reader description */}
      <div className="sr-only" aria-live="polite">
        {currentStep === 0 && "Body diagram showing a neutral human figure. Scroll to see how diabetes affects different organs."}
        {currentStep >= 1 && currentStep <= 7 && `Highlighted: ${activeOrgans.map(getLabel).join(", ")}`}
        {currentStep === 8 && "All organs highlighted in red, showing diabetic ketoacidosis affecting the entire body."}
        {currentStep === 10 && "All organs highlighted in green, showing a healthy body after prevention measures."}
      </div>
    </div>
  );
}
