import screeningData from "../../data/screening-rates.json";
import { useReducedMotion } from "../../utils/a11y";

interface RiskFactorVizProps {
  isActive: boolean;
}

const overweightPct = screeningData.findings.us_overweight_prevalence_pct;
const obesityPct = screeningData.findings.us_obesity_prevalence_pct;
const combinedPct = overweightPct + obesityPct;

export default function RiskFactorViz({ isActive }: RiskFactorVizProps) {
  const reducedMotion = useReducedMotion();
  const transition = reducedMotion ? "none" : "all 0.6s ease";

  return (
    <div role="figure" aria-label={`US adult weight statistics: ${overweightPct}% overweight, ${obesityPct}% obese`}>
      <h3 className="font-display mb-4 text-center text-xl" style={{ color: "var(--color-green-dark)" }}>
        US Adult Weight Prevalence
      </h3>

      {/* Stacked bar */}
      <div className="mx-auto max-w-xs">
        <div className="flex h-12 overflow-hidden rounded-lg" style={{ background: "var(--color-cream)" }}>
          {/* Overweight segment */}
          <div
            className="flex items-center justify-center text-sm font-bold text-white"
            style={{
              width: isActive ? `${(overweightPct / 100) * 100}%` : "0%",
              background: "var(--color-orange)",
              transition,
            }}
          >
            {isActive && `${overweightPct}%`}
          </div>
          {/* Obesity segment */}
          <div
            className="flex items-center justify-center text-sm font-bold text-white"
            style={{
              width: isActive ? `${(obesityPct / 100) * 100}%` : "0%",
              background: "var(--color-danger)",
              transition,
              transitionDelay: reducedMotion ? "0s" : "0.2s",
            }}
          >
            {isActive && `${obesityPct}%`}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex justify-center gap-4 text-sm" style={{ color: "var(--color-text-muted)" }}>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ background: "var(--color-orange)" }} />
            Overweight ({overweightPct}%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ background: "var(--color-danger)" }} />
            Obese ({obesityPct}%)
          </span>
        </div>

        {/* Combined callout */}
        {isActive && (
          <p className="mt-4 rounded-md px-3 py-2 text-center text-sm font-medium" style={{ background: "var(--color-danger-15)", color: "var(--color-danger)" }}>
            {combinedPct.toFixed(1)}% of US adults are overweight or obese — key risk factors for Type 2 diabetes.
          </p>
        )}
      </div>

      {/* Accessible data table */}
      <table className="sr-only">
        <caption>US adult weight prevalence (2017-2018 NHANES)</caption>
        <thead>
          <tr>
            <th>Category</th>
            <th>Prevalence (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Overweight</td>
            <td>{overweightPct}</td>
          </tr>
          <tr>
            <td>Obesity</td>
            <td>{obesityPct}</td>
          </tr>
          <tr>
            <td>Combined</td>
            <td>{combinedPct.toFixed(1)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
