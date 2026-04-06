import { useState, type ReactNode } from "react";
import { Scrollama, Step } from "react-scrollama";
import NarrativeStep from "./NarrativeStep";
import StickyVisual from "./StickyVisual";

export interface ScrollStep {
  content: ReactNode;
}

interface ScrollySectionProps {
  id: string;
  steps: ScrollStep[];
  visualComponent: (currentStep: number) => ReactNode;
  className?: string;
}

export default function ScrollySection({ id, steps, visualComponent, className = "" }: ScrollySectionProps) {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <section id={id} className={`relative ${className}`}>
      <div className="lg:flex">
        <StickyVisual>{visualComponent(currentStep)}</StickyVisual>

        <div className="lg:w-1/2">
          <Scrollama onStepEnter={({ data }: { data: number }) => setCurrentStep(data)} offset={0.5}>
            {steps.map((step, i) => (
              <Step data={i} key={i}>
                <div>
                  <NarrativeStep isActive={currentStep === i}>{step.content}</NarrativeStep>
                </div>
              </Step>
            ))}
          </Scrollama>
        </div>
      </div>
    </section>
  );
}
