import { Activity, Apple, Pill, Syringe } from "lucide-react";

interface Stage {
  icon: typeof Apple;
  label: string;
  description: string;
  color: string;
}

const STAGES: Stage[] = [
  {
    icon: Apple,
    label: "Diet & Nutrition",
    description: "Balanced meals, high fiber, low glycemic foods",
    color: "var(--color-success)",
  },
  {
    icon: Activity,
    label: "Physical Activity",
    description: "Regular exercise improves insulin sensitivity",
    color: "var(--color-green-mid)",
  },
  {
    icon: Pill,
    label: "Oral Medication",
    description: "Metformin and other drugs to manage blood sugar",
    color: "var(--color-orange)",
  },
  {
    icon: Syringe,
    label: "Insulin Therapy",
    description: "Injections when the body can't produce enough insulin",
    color: "var(--color-danger)",
  },
];

const STAGE_ROW_HEIGHT = 72; // h-12 icon + mb-6 gap ≈ 72px

export default function TreatmentTimeline({ activeStage }: { activeStage: number }) {
  const visibleCount = Math.min(activeStage, 3) + 1;
  // Line spans from center of first circle to center of last visible circle
  const lineHeight = (visibleCount - 1) * STAGE_ROW_HEIGHT;

  return (
    <div className="mx-auto w-full">
      <h3 className="font-display mb-4 text-center text-xl" style={{ color: "var(--color-green-dark)" }}>
        Treatment Spectrum
      </h3>

      <div className="relative" role="list" aria-label="Treatment progression from lifestyle changes to insulin therapy">
        {/* Connecting line — grows as stages reveal */}
        <div
          className="absolute left-6 w-0.5"
          style={{
            backgroundColor: "var(--color-cream)",
            top: "1.5rem",
            height: `${lineHeight}px`,
            transition: "height 0.5s ease",
          }}
          aria-hidden="true"
        />

        {STAGES.map((stage, i) => {
          const Icon = stage.icon;
          const isActive = i <= activeStage;
          const isMedication = i >= 2;
          const shouldHide = isMedication && !isActive;
          return (
            <div
              key={stage.label}
              className="relative mb-6 flex items-start gap-4 last:mb-0"
              role="listitem"
              aria-current={i === activeStage ? "step" : undefined}
              style={{
                opacity: shouldHide ? 0 : 1,
                transform: shouldHide ? "translateY(12px)" : "translateY(0)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
                pointerEvents: shouldHide ? "none" : "auto",
              }}
              aria-hidden={shouldHide}
            >
              {/* Icon circle */}
              <div
                className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-all duration-500"
                style={{
                  backgroundColor: isActive ? stage.color : "var(--color-bg)",
                  border: `2px solid ${isActive ? stage.color : "var(--color-cream)"}`,
                }}
              >
                <Icon size={22} style={{ color: isActive ? "#fff" : "var(--color-text-muted)" }} aria-hidden="true" />
              </div>

              {/* Text */}
              <div className="pt-1">
                <p className="font-body text-base font-semibold transition-colors duration-500" style={{ color: isActive ? stage.color : "var(--color-text-muted)" }}>
                  {stage.label}
                </p>
                <p
                  className="font-body mt-0.5 text-sm transition-opacity duration-500"
                  style={{
                    color: "var(--color-text-muted)",
                    opacity: isActive ? 1 : 0.5,
                  }}
                >
                  {stage.description}
                </p>
              </div>

              {/* "Progression depends" label — follows last visible stage */}
              {i === activeStage && (
                <div
                  className="font-body absolute -bottom-5 left-0 w-full text-center text-xs"
                  style={{
                    color: "var(--color-text-muted)",
                    transition: "opacity 0.3s ease",
                  }}
                >
                  Progression depends on type and severity
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
