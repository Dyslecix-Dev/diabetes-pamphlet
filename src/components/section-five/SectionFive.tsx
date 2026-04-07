import ScrollySection, { type ScrollStep } from "../ScrollySection";
import AmputationStats from "./AmputationStats";
import BodyDiagram from "./BodyDiagram";
import GlucoseSlider from "./GlucoseSlider";

const steps: ScrollStep[] = [
  {
    content: (
      <>
        <h2 className="font-display mb-4 text-3xl" style={{ color: "var(--color-green-dark)" }}>
          Risks & Prevention
        </h2>
        <p>
          High blood glucose doesn't just make you feel bad. Over time, it <strong>destroys your body</strong>.
        </p>
      </>
    ),
  },
  {
    content: (
      <p>
        <strong>Nerve damage and numbness</strong> — especially in your hands and feet. It's called neuropathy, and it's one of the most common complications.
      </p>
    ),
  },
  {
    content: (
      <p>
        Poor circulation leading to infections, and in severe cases, <strong>amputation</strong>.
      </p>
    ),
  },
  {
    content: (
      <p>
        Globally, there are about <strong>95 major</strong> and <strong>140 minor</strong> diabetes-related amputations per 100,000 patients annually. Men are disproportionately affected — roughly{" "}
        <strong>2x the rate</strong> of women.
      </p>
    ),
  },
  {
    content: (
      <p>
        <strong>Eye damage and blindness.</strong> Diabetic retinopathy damages the blood vessels in your retina — and it can happen without any early symptoms.
      </p>
    ),
  },
  {
    content: (
      <p>
        <strong>Tooth and gum problems.</strong> High blood sugar feeds bacteria in your mouth, leading to periodontal disease and tooth loss.
      </p>
    ),
  },
  {
    content: (
      <p>
        <strong>Kidney damage</strong> — diabetes is the <strong>leading cause of kidney failure</strong> in the United States.
      </p>
    ),
  },
  {
    content: (
      <p>
        <strong>Increased risk of heart disease.</strong> People with diabetes are twice as likely to have heart disease or a stroke.
      </p>
    ),
  },
  {
    content: (
      <p>
        And <strong>diabetic ketoacidosis</strong> — when it all spirals out of control. Your body can't use glucose, so it breaks down fat, flooding your blood with toxic ketones.
      </p>
    ),
  },
  {
    content: (
      <p>
        Low blood sugar is dangerous too. Below <strong>70 mg/dL</strong>: hunger, shakiness, dizziness. It can cause fainting or coma. Try the slider to explore the zones.
      </p>
    ),
  },
  {
    content: (
      <p>
        But type 2 diabetes is <strong>preventable</strong>. Lose excess weight. Exercise more. Limit sugary drinks. Eat a heart-healthy, plant-based diet. <strong>Your choices matter.</strong>
      </p>
    ),
  },
];

function SectionFiveVisual({ currentStep }: { currentStep: number }) {
  // Steps 0-2: Body diagram (neutral → nerves → legs)
  // Step 3: Amputation stats
  // Steps 4-8: Body diagram (eyes → mouth → kidneys → heart → all danger)
  // Step 9: Glucose slider
  // Step 10: Body diagram (healthy/green)
  if (currentStep === 3) {
    return <AmputationStats isActive />;
  }

  if (currentStep === 9) {
    return <GlucoseSlider />;
  }

  return <BodyDiagram currentStep={currentStep} />;
}

export default function SectionFive() {
  return <ScrollySection id="section-5" steps={steps} visualComponent={(currentStep) => <SectionFiveVisual currentStep={currentStep} />} />;
}
