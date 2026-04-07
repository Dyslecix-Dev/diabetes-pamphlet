import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
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
  visualGroup?: (step: number) => string | number;
  className?: string;
  trailingSpacer?: boolean;
}

const EXIT_MS = 500;

export default function ScrollySection({ id, steps, visualComponent, visualGroup, className = "", trailingSpacer = true }: ScrollySectionProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [exitingStep, setExitingStep] = useState<number | null>(null);
  const [didTransition, setDidTransition] = useState(false);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getGroup = visualGroup ?? ((s: number) => s);

  const handleStepEnter = useCallback(
    ({ data }: { data: number }) => {
      if (data === currentStep) return;

      const oldGroup = getGroup(currentStep);
      const newGroup = getGroup(data);

      // Same visual group — no transition animation
      if (oldGroup === newGroup) {
        setCurrentStep(data);
        return;
      }

      // Different group — run exit, then show enter after exit completes
      setExitingStep(currentStep);
      setCurrentStep(data);
      setDidTransition(true);

      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);

      exitTimerRef.current = setTimeout(() => {
        setExitingStep(null);
      }, EXIT_MS);
    },
    [currentStep, getGroup],
  );

  useEffect(() => {
    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, []);

  const isTransitioning = exitingStep !== null;

  return (
    <section id={id} className={`relative ${className}`} aria-labelledby={`${id}-heading`}>
      {/* Screen reader announcement for step changes */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {`Step ${currentStep + 1} of ${steps.length}`}
      </div>

      <div className="lg:flex">
        <StickyVisual>
          <div className="relative">
            {/* Exiting visual — stays in flow to preserve container height, animates out */}
            {isTransitioning && (
              <div key={`exit-${exitingStep}`} className="visual-swipe-exit">
                {visualComponent(exitingStep)}
              </div>
            )}

            {/* Entering visual — hidden until exit clears, then animates in */}
            {!isTransitioning && (
              <div key={`enter-${getGroup(currentStep)}`} className={didTransition ? "visual-swipe-enter" : ""}>
                {visualComponent(currentStep)}
              </div>
            )}
          </div>
        </StickyVisual>

        <div className="lg:w-1/2">
          <Scrollama onStepEnter={handleStepEnter} offset={0.5}>
            {steps.map((step, i) => (
              <Step data={i} key={i}>
                <div>
                  <NarrativeStep isActive={currentStep === i}>{step.content}</NarrativeStep>
                </div>
              </Step>
            ))}
          </Scrollama>
          {/* Extra space so the last visual stays pinned longer */}
          {trailingSpacer && <div className="h-[40vh]" />}
        </div>
      </div>
    </section>
  );
}
