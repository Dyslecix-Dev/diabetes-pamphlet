import ScrollySection, { type ScrollStep } from "../ScrollySection";
import DayInTheLife from "./DayInTheLife";
import RiskFactorViz from "./RiskFactorViz";
import ScreeningGap from "./ScreeningGap";

const steps: ScrollStep[] = [
  {
    content: (
      <>
        <h2 className="font-display mb-4 text-3xl" style={{ color: "var(--color-green-dark)" }}>
          How Diabetes Develops
        </h2>
        <p>Let's follow what happens in your body when you eat a meal heavy in added sugar.</p>
      </>
    ),
  },
  {
    content: (
      <p>
        Sugar hits your bloodstream. Your pancreas releases <strong>insulin</strong> to help cells absorb glucose.
      </p>
    ),
  },
  {
    content: <p>In a healthy body, this works smoothly. Glucose enters cells, blood sugar normalizes.</p>,
  },
  {
    content: (
      <p>
        But when you regularly eat too much sugar, are physically inactive, or carry excess weight — cells start <strong>ignoring insulin</strong>.
      </p>
    ),
  },
  {
    content: (
      <p>
        Obesity and overweight are strong risk factors. US overweight prevalence: <strong>31.1%</strong>. Obesity: <strong>42.5%</strong>.
      </p>
    ),
  },
  {
    content: (
      <p>
        People <strong>45 and older</strong>, or those with risk factors, should be tested regularly.
      </p>
    ),
  },
  {
    content: (
      <p>
        But testing rates are low. Only about <strong>33%</strong> of eligible adults received proper blood glucose testing within 3 years.
      </p>
    ),
  },
  {
    content: (
      <p>
        Even with broader test definitions, at least <strong>1 in 4</strong> adults with overweight or obesity went untested.
      </p>
    ),
  },
  {
    content: (
      <p>
        The USPSTF has been expanding screening guidelines — lowering the recommended starting age from 40 to <strong>35</strong> in 2021.
      </p>
    ),
  },
  {
    content: (
      <p>
        Adults aware of having prediabetes were <strong>more than twice as likely</strong> to pursue lifestyle changes. Screening saves lives.
      </p>
    ),
  },
];

function SectionThreeVisual({ currentStep }: { currentStep: number }) {
  // Steps 0-3: DayInTheLife physiological animation
  // Steps 4-5: RiskFactorViz (obesity/overweight stats)
  // Steps 6-9: ScreeningGap (bars, 1-in-4 callout, USPSTF timeline, hope)
  if (currentStep <= 3) {
    return <DayInTheLife currentStep={currentStep} />;
  }

  if (currentStep <= 5) {
    return <RiskFactorViz isActive />;
  }

  return <ScreeningGap currentStep={currentStep} />;
}

export default function SectionThree() {
  return <ScrollySection id="section-3" steps={steps} visualComponent={(currentStep) => <SectionThreeVisual currentStep={currentStep} />} />;
}
