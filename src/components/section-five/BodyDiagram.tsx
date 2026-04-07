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
  neutral: "var(--color-cream)",
  highlight: "var(--color-orange)",
  danger: "var(--color-danger)",
  healthy: "var(--color-success)",
};

function getOrganFill(organ: string, currentStep: number, reducedMotion: boolean) {
  if (currentStep === 10) return organColors.healthy;
  if (currentStep === 8) return organColors.danger;

  const activeOrgans = stepToOrgans[currentStep] || [];
  if (activeOrgans.includes(organ)) return organColors.highlight;
  return organColors.neutral;
}

function getTransition(reducedMotion: boolean) {
  return reducedMotion ? "none" : "fill 0.6s ease, opacity 0.6s ease";
}

// Simplified body outline with individually targetable organ regions
// Positioned to overlay meaningful areas of a human body silhouette
export default function BodyDiagram({ currentStep }: BodyDiagramProps) {
  const reducedMotion = useReducedMotion();
  const transition = getTransition(reducedMotion);

  const activeOrgans =
    currentStep === 8 ? ["nerves", "legs", "eyes", "mouth", "kidneys", "heart"] : currentStep === 10 ? ["nerves", "legs", "eyes", "mouth", "kidneys", "heart"] : stepToOrgans[currentStep] || [];

  // Find the complication label for an organ
  const getLabel = (organ: string) => {
    const item = complicationsData.complications_list.find((c) => c.organ === organ);
    return item ? item.label : organ;
  };

  return (
    <div className="flex w-full flex-col items-center" role="img" aria-label="Human body diagram showing diabetes complications">
      {/* Active complication label */}
      <div className="mb-4 min-h-8 text-center" aria-live="polite">
        {currentStep >= 1 && currentStep <= 7 && activeOrgans.length > 0 && (
          <p className="font-body text-lg font-semibold" style={{ color: currentStep === 8 ? "var(--color-danger)" : "var(--color-orange)" }}>
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

      <svg viewBox="0 0 300 520" width="100%" height="100%" className="max-w-70 lg:max-w-[320px]" aria-hidden="true">
        {/* Body silhouette */}
        <g id="body-outline" fill="none" stroke="var(--color-text-primary)" strokeWidth="1.5" opacity="0.3">
          {/* Head */}
          <ellipse cx="150" cy="52" rx="35" ry="42" />
          {/* Neck */}
          <rect x="138" y="90" width="24" height="20" rx="4" />
          {/* Torso */}
          <path d="M100,110 Q90,110 85,130 L75,240 Q72,260 90,270 L120,280 L150,285 L180,280 L210,270 Q228,260 225,240 L215,130 Q210,110 200,110 Z" />
          {/* Left arm */}
          <path d="M85,130 Q60,140 45,190 L35,250 Q30,270 40,275" />
          {/* Right arm */}
          <path d="M215,130 Q240,140 255,190 L265,250 Q270,270 260,275" />
          {/* Left leg */}
          <path d="M110,280 L100,370 L95,440 L90,510" />
          <path d="M140,285 L130,370 L125,440 L120,510" />
          {/* Right leg */}
          <path d="M160,285 L170,370 L175,440 L180,510" />
          <path d="M190,280 L200,370 L205,440 L210,510" />
        </g>

        {/* === Targetable organ regions === */}

        {/* Eyes */}
        <g id="eyes-path" role="img" aria-label={getLabel("eyes")}>
          <ellipse cx="136" cy="45" rx="9" ry="6" fill={getOrganFill("eyes", currentStep, reducedMotion)} opacity={activeOrgans.includes("eyes") ? 0.85 : 0.2} style={{ transition }} />
          <ellipse cx="164" cy="45" rx="9" ry="6" fill={getOrganFill("eyes", currentStep, reducedMotion)} opacity={activeOrgans.includes("eyes") ? 0.85 : 0.2} style={{ transition }} />
        </g>

        {/* Mouth */}
        <g id="mouth-path" role="img" aria-label={getLabel("mouth")}>
          <ellipse cx="150" cy="70" rx="14" ry="7" fill={getOrganFill("mouth", currentStep, reducedMotion)} opacity={activeOrgans.includes("mouth") ? 0.85 : 0.2} style={{ transition }} />
        </g>

        {/* Heart */}
        <g id="heart-path" role="img" aria-label={getLabel("heart")}>
          <path
            d="M160,155 C160,140 145,135 140,145 C135,135 120,140 120,155 C120,175 140,185 140,185 C140,185 160,175 160,155 Z"
            fill={getOrganFill("heart", currentStep, reducedMotion)}
            opacity={activeOrgans.includes("heart") ? 0.85 : 0.2}
            style={{ transition }}
          />
        </g>

        {/* Kidneys */}
        <g id="kidneys-path" role="img" aria-label={getLabel("kidneys")}>
          <ellipse cx="120" cy="210" rx="16" ry="22" fill={getOrganFill("kidneys", currentStep, reducedMotion)} opacity={activeOrgans.includes("kidneys") ? 0.85 : 0.2} style={{ transition }} />
          <ellipse cx="180" cy="210" rx="16" ry="22" fill={getOrganFill("kidneys", currentStep, reducedMotion)} opacity={activeOrgans.includes("kidneys") ? 0.85 : 0.2} style={{ transition }} />
        </g>

        {/* Nerves — shown as dots along extremities */}
        <g id="nerves-path" role="img" aria-label={getLabel("nerves")}>
          {[
            [40, 270],
            [260, 270], // hands
            [55, 230],
            [245, 230], // forearms
            [95, 500],
            [120, 500],
            [180, 500],
            [205, 500], // feet
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="6" fill={getOrganFill("nerves", currentStep, reducedMotion)} opacity={activeOrgans.includes("nerves") ? 0.85 : 0.15} style={{ transition }} />
          ))}
        </g>

        {/* Legs */}
        <g id="legs-path" role="img" aria-label={getLabel("legs")}>
          <rect x="92" y="290" width="42" height="180" rx="15" fill={getOrganFill("legs", currentStep, reducedMotion)} opacity={activeOrgans.includes("legs") ? 0.7 : 0.1} style={{ transition }} />
          <rect x="166" y="290" width="42" height="180" rx="15" fill={getOrganFill("legs", currentStep, reducedMotion)} opacity={activeOrgans.includes("legs") ? 0.7 : 0.1} style={{ transition }} />
        </g>
      </svg>

      {/* Screen reader description of current state */}
      <div className="sr-only" aria-live="polite">
        {currentStep === 0 && "Body diagram showing a neutral human figure. Scroll to see how diabetes affects different organs."}
        {currentStep >= 1 && currentStep <= 7 && `Highlighted: ${activeOrgans.map(getLabel).join(", ")}`}
        {currentStep === 8 && "All organs highlighted in red, showing diabetic ketoacidosis affecting the entire body."}
        {currentStep === 10 && "All organs highlighted in green, showing a healthy body after prevention measures."}
      </div>
    </div>
  );
}
