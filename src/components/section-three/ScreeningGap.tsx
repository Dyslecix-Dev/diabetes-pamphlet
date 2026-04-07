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
  const transition = reducedMotion ? "none" : "width 0.8s ease";
  const showBars = currentStep >= 6;
  const showUntested = currentStep >= 7;
  const showTimeline = currentStep >= 8;
  const showHope = currentStep >= 9;

  return (
    <div role="figure" aria-label={`Diabetes screening rates: ${strictRate}% strict testing, ${broadRate}% broad testing`}>
      {/* Bar chart: screening rates */}
      <h3 className="font-display mb-4 text-center text-xl" style={{ color: "var(--color-green-dark)" }}>
        Blood Glucose Testing Rates
      </h3>

      <div className="mx-auto max-w-sm space-y-4">
        {/* Strict testing bar */}
        <div>
          <div className="mb-1 flex justify-between text-sm" style={{ color: "var(--color-text-muted)" }}>
            <span>Strict testing (3-year window)</span>
            <span className="font-bold" style={{ color: "var(--color-danger)" }}>
              {strictRate}%
            </span>
          </div>
          <div className="h-8 overflow-hidden rounded-md" style={{ background: "var(--color-cream)" }}>
            <div
              className="h-full rounded-md"
              style={{
                width: showBars ? `${strictRate}%` : "0%",
                background: "var(--color-danger)",
                transition,
              }}
            />
          </div>
        </div>

        {/* Broad testing bar */}
        <div>
          <div className="mb-1 flex justify-between text-sm" style={{ color: "var(--color-text-muted)" }}>
            <span>Broad testing (incl. random glucose)</span>
            <span className="font-bold" style={{ color: "var(--color-green-mid)" }}>
              {broadRate}%
            </span>
          </div>
          <div className="h-8 overflow-hidden rounded-md" style={{ background: "var(--color-cream)" }}>
            <div
              className="h-full rounded-md"
              style={{
                width: showBars ? `${broadRate}%` : "0%",
                background: "var(--color-green-mid)",
                transition,
                transitionDelay: reducedMotion ? "0s" : "0.3s",
              }}
            />
          </div>
        </div>

        {/* 1 in 4 callout */}
        {showUntested && (
          <div className="rounded-lg px-4 py-3 text-center" style={{ background: "var(--color-danger-15)" }}>
            <span className="font-display text-3xl font-bold" style={{ color: "var(--color-danger)" }}>
              1 in 4
            </span>
            <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
              adults with overweight or obesity went untested in 3 years
            </p>
          </div>
        )}

        {/* USPSTF Timeline */}
        {showTimeline && (
          <div className="mt-6">
            <h4 className="mb-3 text-center text-sm font-bold" style={{ color: "var(--color-green-dark)" }}>
              USPSTF Screening Guidelines
            </h4>
            <div className="relative ml-4 border-l-2 pl-6" style={{ borderColor: "var(--color-green-mid)" }}>
              {timeline.map((item, i) => (
                <div key={item.year} className="relative mb-4 last:mb-0">
                  {/* Dot on timeline */}
                  <span
                    className="absolute top-1 -left-7.75 inline-block h-3 w-3 rounded-full border-2"
                    style={{
                      background: "var(--color-bg)",
                      borderColor: "var(--color-green-mid)",
                    }}
                  />
                  <span className="font-display text-lg font-bold" style={{ color: "var(--color-green-dark)" }}>
                    {item.year}
                  </span>
                  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    {item.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hopeful closing */}
        {showHope && (
          <div className="mt-4 rounded-lg px-4 py-3 text-center" style={{ background: "var(--color-green-dark-10)" }}>
            <p className="text-sm font-medium" style={{ color: "var(--color-green-dark)" }}>
              Adults aware of having prediabetes were <strong>more than twice as likely</strong> to pursue lifestyle changes.
            </p>
            <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
              Screening saves lives.
            </p>
          </div>
        )}
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
