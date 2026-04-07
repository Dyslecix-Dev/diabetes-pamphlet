import ScrollySection, { type ScrollStep } from "../ScrollySection";
import FiberMeter from "./FiberMeter";
import PlateBuilder from "./PlateBuilder";
import TreatmentTimeline from "./TreatmentTimeline";

const steps: ScrollStep[] = [
  {
    content: (
      <>
        <h2 className="font-display mb-4 text-3xl" style={{ color: "var(--color-green-dark)" }}>
          Treatments for Diabetes
        </h2>
        <p>
          The central goal of diabetes management is <strong>blood glucose control</strong>. Everything revolves around this.
        </p>
      </>
    ),
  },
  {
    content: (
      <p>
        And the most powerful tool? <strong>Your plate.</strong>
      </p>
    ),
  },
  {
    content: (
      <p>
        A well-balanced diet includes <strong>high-fiber carbs</strong> from whole grains, fruits, and vegetables.
      </p>
    ),
  },
  {
    content: (
      <p>
        <strong>Low-fat milk</strong> for calcium. <strong>Lean proteins</strong> like chicken, fish, and legumes.
      </p>
    ),
  },
  {
    content: (
      <p>
        <strong>Unsaturated fats</strong> — olive oil, nuts, avocado.
      </p>
    ),
  },
  {
    content: (
      <p>
        Why fiber matters: it slows digestion and glucose absorption, <strong>preventing blood sugar spikes</strong>.
      </p>
    ),
  },
  {
    content: (
      <p>
        <strong>Physical exercise</strong> is just as important — it helps cells use insulin more effectively.
      </p>
    ),
  },
  {
    content: (
      <p>
        Depending on the type and progression, <strong>insulin injections or medication</strong> may be required.
      </p>
    ),
  },
];

function SectionFourVisual({ currentStep }: { currentStep: number }) {
  // Steps 0: intro text visual
  // Steps 1-4: PlateBuilder interactive
  // Step 5: FiberMeter glucose curves
  // Steps 6-7: TreatmentTimeline
  if (currentStep === 0) {
    return (
      <div className="text-center">
        <div className="font-display text-6xl font-bold" style={{ color: "var(--color-green-mid)" }}>
          🎯
        </div>
        <p className="font-body mt-3 text-lg" style={{ color: "var(--color-text-muted)" }}>
          Blood glucose control is the central goal
        </p>
      </div>
    );
  }

  if (currentStep >= 1 && currentStep <= 4) {
    return <PlateBuilder />;
  }

  if (currentStep === 5) {
    return <FiberMeter isActive />;
  }

  // Steps 6-7: treatment timeline
  // Step 6 shows lifestyle stages (0-1), step 7 shows all stages (0-3)
  const activeStage = currentStep === 6 ? 1 : 3;
  return <TreatmentTimeline activeStage={activeStage} />;
}

export default function SectionFour() {
  return <ScrollySection id="section-4" steps={steps} visualComponent={(currentStep) => <SectionFourVisual currentStep={currentStep} />} />;
}
