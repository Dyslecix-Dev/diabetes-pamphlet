import ScrollySection from "./ScrollySection";

const COLORS = ["var(--color-cream)", "var(--color-green-mid)", "var(--color-orange)"];

const steps = [
  {
    content: (
      <p>
        Step 1 — The panel should be <strong>cream</strong>.
      </p>
    ),
  },
  {
    content: (
      <p>
        Step 2 — The panel should be <strong>green</strong>.
      </p>
    ),
  },
  {
    content: (
      <p>
        Step 3 — The panel should be <strong>orange</strong>.
      </p>
    ),
  },
];

export default function ScrollyDemo() {
  return (
    <ScrollySection
      id="section-demo"
      steps={steps}
      visualComponent={(currentStep) => (
        <div
          className="font-display flex aspect-square w-full items-center justify-center rounded-2xl text-2xl text-white"
          style={{
            backgroundColor: COLORS[currentStep] ?? COLORS[0],
            transition: "background-color 0.4s ease",
          }}
        >
          Step {currentStep + 1}
        </div>
      )}
    />
  );
}
