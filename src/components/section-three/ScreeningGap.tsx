import { useEffect, useState } from "react";
import screeningData from "../../data/screening-rates.json";
import { useReducedMotion } from "../../utils/a11y";

interface ScreeningGapProps {
  currentStep: number;
}

const strictRate = screeningData.findings.strict_testing_rate_3yr_pct;
const broadRate = screeningData.findings.broad_testing_rate_3yr_pct;
const timeline = screeningData.findings.uspstf_timeline;

// Steps mapped to this component:
// 6 (step 7): Screening gap bars
// 7 (step 8): "1 in 4 untested" callout
// 8 (step 9): USPSTF timeline
// 9 (step 10): Awareness effect / hopeful close

export default function ScreeningGap({ currentStep }: ScreeningGapProps) {
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Delay so the component renders once at 0% width before animating
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const barTransition = reducedMotion ? "none" : "width 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
  const slideUp = (delay: string) => (reducedMotion ? "none" : `opacity 0.6s ease ${delay}, transform 0.6s ease ${delay}`);

  const showBars = currentStep >= 6 && mounted;
  const showUntested = currentStep >= 7;
  const showTimeline = currentStep >= 8;
  const showHope = currentStep >= 9;

  return (
    <div role="figure" aria-label={`Diabetes screening rates: ${strictRate}% strict testing, ${broadRate}% broad testing`}>
      {/* Bar chart: screening rates */}
      <h3 className="font-display mb-3 text-center text-xl" style={{ color: "var(--color-green-dark)" }}>
        Blood Glucose Testing Rates
      </h3>

      <div className="mx-auto max-w-md space-y-3">
        {/* Strict testing bar */}
        <div>
          <div className="mb-1 flex justify-between" style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
            <span>Strict testing (3-year window)</span>
            <span className="font-bold" style={{ color: "var(--color-danger)" }}>
              {strictRate}%
            </span>
          </div>
          <div className="h-7 overflow-hidden rounded-md" style={{ background: "var(--color-cream)" }}>
            <div
              className="h-full rounded-md"
              style={{
                width: showBars ? `${strictRate}%` : "0%",
                background: "var(--color-danger)",
                transition: barTransition,
              }}
            />
          </div>
        </div>

        {/* Broad testing bar */}
        <div>
          <div className="mb-1 flex justify-between" style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
            <span>Broad testing (incl. random glucose)</span>
            <span className="font-bold" style={{ color: "var(--color-green-mid)" }}>
              {broadRate}%
            </span>
          </div>
          <div className="h-7 overflow-hidden rounded-md" style={{ background: "var(--color-cream)" }}>
            <div
              className="h-full rounded-md"
              style={{
                width: showBars ? `${broadRate}%` : "0%",
                background: "var(--color-green-mid)",
                transition: barTransition,
                transitionDelay: reducedMotion ? "0s" : "0.3s",
              }}
            />
          </div>
        </div>

        {/* 1 in 4 callout — slides up */}
        <div
          className="rounded-lg px-4 py-3 text-center"
          style={{
            background: "var(--color-danger-15)",
            opacity: showUntested ? 1 : 0,
            transform: showUntested ? "translateY(0)" : "translateY(20px)",
            transition: slideUp("0s"),
          }}
        >
          <span className="font-display text-3xl font-bold" style={{ color: "var(--color-danger)" }}>
            1 in 4
          </span>
          <p className="mt-1" style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
            overweight or obese adults went untested in 3 years
          </p>
        </div>

        {/* USPSTF Timeline — slides up */}
        <div
          className="mt-3"
          style={{
            opacity: showTimeline ? 1 : 0,
            transform: showTimeline ? "translateY(0)" : "translateY(20px)",
            transition: slideUp("0s"),
          }}
        >
          <h4 className="mb-2 text-center font-bold" style={{ color: "var(--color-green-dark)", fontSize: "0.85rem" }}>
            USPSTF Screening Guidelines
          </h4>
          <div className="relative ml-4 border-l-2 pl-5" style={{ borderColor: "var(--color-green-mid)" }}>
            {timeline.map((item, i) => (
              <div
                key={item.year}
                className="relative mb-3 last:mb-0"
                style={{
                  opacity: showTimeline ? 1 : 0,
                  transform: showTimeline ? "translateY(0)" : "translateY(16px)",
                  transition: slideUp(`${i * 0.15}s`),
                }}
              >
                {/* Dot on timeline */}
                <span
                  className="absolute top-1 -left-7.75 inline-block h-3 w-3 rounded-full border-2"
                  style={{
                    background: "var(--color-bg)",
                    borderColor: "var(--color-green-mid)",
                  }}
                />
                <span className="font-display text-base font-bold" style={{ color: "var(--color-green-dark)" }}>
                  {item.year}
                </span>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.8rem", lineHeight: "1.3" }}>{item.recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hopeful closing — slides up */}
        <div
          className="mt-3 rounded-lg px-4 py-3 text-center"
          style={{
            background: "var(--color-green-dark-10)",
            opacity: showHope ? 1 : 0,
            transform: showHope ? "translateY(0)" : "translateY(20px)",
            transition: slideUp("0s"),
          }}
        >
          <p className="font-medium" style={{ color: "var(--color-green-dark)", fontSize: "0.95rem" }}>
            Adults aware of having prediabetes were <strong>more than twice as likely</strong> to pursue lifestyle changes.
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
            Screening saves lives.
          </p>
        </div>
      </div>

      {/* Accessible data table */}
      <table className="sr-only">
        <caption>Blood glucose testing rates among eligible US adults (2016-2019)</caption>
        <thead>
          <tr>
            <th>Testing type</th>
            <th>Rate (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Strict blood glucose testing (3-year window)</td>
            <td>{strictRate}</td>
          </tr>
          <tr>
            <td>Broad testing (including random plasma glucose)</td>
            <td>{broadRate}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
