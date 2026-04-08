import ScrollySection, { type ScrollStep } from "../ScrollySection";
import PopulationSplit from "./PopulationSplit";
import TypeComparison from "./TypeComparison";
import YouthIncidence from "./YouthIncidence";

const steps: ScrollStep[] = [
  {
    content: (
      <>
        <h2 className="font-display mb-4 text-3xl" style={{ color: "var(--color-green-dark)" }}>
          Type I vs. Type II
        </h2>
        <p>Not all diabetes is the same. There are two main types — and they work very differently.</p>
      </>
    ),
  },
  {
    content: (
      <p>
        Type 1 is an <strong>autoimmune disease</strong>. Your immune system attacks the insulin-producing beta cells in your pancreas.
      </p>
    ),
  },
  {
    content: (
      <p>
        It usually begins in childhood or early adult years. Peak age of diagnosis: <strong>10 years old</strong> for Type 1.
      </p>
    ),
  },
  {
    content: (
      <p>
        Type 1 accounts for only <strong>5–10%</strong> of all cases. But these patients need insulin injections for life.
      </p>
    ),
  },
  {
    content: (
      <p>
        Type 2 is different. Your cells become <strong>resistant to insulin</strong> — they stop responding to it.
      </p>
    ),
  },
  {
    content: (
      <p>
        It accounts for <strong>90–95%</strong> of all diabetes cases.
      </p>
    ),
  },
  {
    content: (
      <p>
        Eventually, the insulin-producing cells get <strong>exhausted</strong>.
      </p>
    ),
  },
  {
    content: (
      <p>
        Both types are rising in youth. Type 1 incidence increased <strong>2% annually</strong>, Type 2 by <strong>5.3% annually</strong> among 10–19 year olds.
      </p>
    ),
  },
  {
    content: (
      <p>
        The increases are highest among racial and ethnic minority youth — <strong>Asian/Pacific Islander, Hispanic, and non-Hispanic Black</strong> children.
      </p>
    ),
  },
  {
    content: (
      <p>
        There's also <strong>prediabetes</strong> — blood glucose higher than normal but not yet diabetes. It's a warning sign that heart disease and other complications can already begin.
      </p>
    ),
  },
];

function SectionTwoVisual({ currentStep }: { currentStep: number }) {
  // Steps 0-2: Type comparison cards (T1 info)
  // Step 3: Population split showing T1
  // Steps 4-6: Population split showing T2 + comparison cards
  // Steps 7-8: Youth incidence chart
  // Step 9: Population split with prediabetes overlay
  if (currentStep <= 2) {
    return <TypeComparison currentStep={currentStep} />;
  }

  if (currentStep >= 7 && currentStep <= 8) {
    return <YouthIncidence isActive={currentStep >= 7} />;
  }

  return <PopulationSplit currentStep={currentStep} />;
}

function sectionTwoGroup(step: number) {
  if (step <= 2) return "comparison";
  if (step >= 7 && step <= 8) return "youth";
  return "population";
}

export default function SectionTwo() {
  return <ScrollySection id="section-2" steps={steps} visualComponent={(currentStep) => <SectionTwoVisual currentStep={currentStep} />} visualGroup={sectionTwoGroup} />;
}
