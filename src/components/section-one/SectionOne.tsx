import ScrollySection, { type ScrollStep } from "../ScrollySection";
import DiagnosisCounter from "./DiagnosisCounter";
import GlucoseAnimation from "./GlucoseAnimation";
import KetoneAnimation from "./KetoneAnimation";
import PrevalenceChart from "./PrevalenceChart";

const steps: ScrollStep[] = [
  {
    content: (
      <>
        <h2 className="font-display mb-4 text-3xl" style={{ color: "var(--color-green-dark)" }}>
          What Is Diabetes?
        </h2>
        <p>Your body runs on glucose. It's the fuel that keeps every cell alive.</p>
      </>
    ),
  },
  {
    content: <p>But for millions of people, that fuel system is broken.</p>,
  },
  {
    content: (
      <p>
        <strong>Diabetes mellitus</strong> — a condition where blood glucose levels stay dangerously high because insulin isn't doing its job.
      </p>
    ),
  },
  {
    content: (
      <p>
        Without glucose entering cells, the body starts burning fat for fuel instead — producing acidic <strong>ketone bodies</strong>.
      </p>
    ),
  },
  {
    content: (
      <p>
        If untreated, this leads to <strong>diabetic ketoacidosis</strong> — which can cause coma or death.
      </p>
    ),
  },
  {
    content: (
      <p>
        Diabetes is the <strong>7th leading cause of death</strong> in the United States.
      </p>
    ),
  },
  {
    content: (
      <p>
        Adult cases have <strong>more than doubled</strong> since the 1980s.
      </p>
    ),
  },
  {
    content: <p>Since you started reading, this many people were diagnosed with diabetes:</p>,
  },
];

function SectionOneVisual({ currentStep }: { currentStep: number }) {
  // Steps 0-4: Glucose molecule animation
  // Step 5: death ranking stat (text-based)
  // Step 6: Prevalence chart
  // Step 7: Live counter
  if (currentStep <= 2) {
    return <GlucoseAnimation currentStep={currentStep} />;
  }

  if (currentStep === 3 || currentStep === 4) {
    return <KetoneAnimation currentStep={currentStep} />;
  }

  if (currentStep === 5) {
    return (
      <div className="text-center">
        <div className="font-display text-7xl font-bold" style={{ color: "var(--color-danger)" }}>
          #7
        </div>
        <p className="mt-3 text-lg" style={{ color: "var(--color-text-muted)" }}>
          leading cause of death in the US
        </p>
      </div>
    );
  }

  if (currentStep === 6) {
    return <PrevalenceChart isActive={currentStep === 6} />;
  }

  return <DiagnosisCounter />;
}

export default function SectionOne() {
  return <ScrollySection id="section-1" steps={steps} visualComponent={(currentStep) => <SectionOneVisual currentStep={currentStep} />} />;
}
