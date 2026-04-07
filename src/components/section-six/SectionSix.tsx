import ScrollySection, { type ScrollStep } from "../ScrollySection";
import ClosingCTA from "./ClosingCTA";
import DailyTimeline from "./DailyTimeline";

const steps: ScrollStep[] = [
  {
    content: (
      <>
        <h2 className="font-display mb-4 text-3xl" style={{ color: "var(--color-green-dark)" }}>
          Living with Diabetes
        </h2>
        <p>
          Living with diabetes isn't about deprivation — it's about <strong>balance</strong>.
        </p>
      </>
    ),
  },
  {
    content: (
      <p>
        Eat regularly to balance the effects of insulin or medication and <strong>avoid hypoglycemia</strong>. Consistent meal timing keeps your glucose stable throughout the day.
      </p>
    ),
  },
  {
    content: (
      <p>
        Focus on <strong>high-fiber carbs, lean proteins, unsaturated fats, and low-fat milk</strong>. You already know what a good plate looks like.
      </p>
    ),
  },
  {
    content: (
      <p>
        Stay physically active — it's one of the most effective tools for <strong>glucose control</strong>. Even a short walk after a meal makes a measurable difference.
      </p>
    ),
  },
  {
    content: (
      <p>
        Monitor blood glucose consistently. <strong>Control is the central goal.</strong> Try toggling the scenarios above to see how daily choices shift your glucose curve.
      </p>
    ),
  },
  {
    content: (
      <p>
        You now know more about diabetes than most people. <strong>Share what you've learned.</strong>
      </p>
    ),
  },
];

function SectionSixVisual({ currentStep }: { currentStep: number }) {
  // Steps 0-4: DailyTimeline interactive
  // Step 5: ClosingCTA
  if (currentStep <= 4) {
    return <DailyTimeline isActive />;
  }

  return <ClosingCTA />;
}

function sectionSixGroup(step: number) {
  if (step <= 4) return "timeline";
  return "cta";
}

export default function SectionSix() {
  return <ScrollySection id="section-6" steps={steps} visualComponent={(currentStep) => <SectionSixVisual currentStep={currentStep} />} visualGroup={sectionSixGroup} trailingSpacer={false} />;
}
