import { useEffect, useRef, useState } from "react";
import screeningData from "../../data/screening-rates.json";
import { useReducedMotion } from "../../utils/a11y";

interface RiskFactorVizProps {
  isActive: boolean;
}

const overweightPct = screeningData.findings.us_overweight_prevalence_pct;
const obesityPct = screeningData.findings.us_obesity_prevalence_pct;
const combinedPct = overweightPct + obesityPct;
const normalPct = parseFloat((100 - combinedPct).toFixed(1));

export default function RiskFactorViz({ isActive }: RiskFactorVizProps) {
  const reducedMotion = useReducedMotion();
  const [hasAnimated, setHasAnimated] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Trigger animation once when isActive becomes true
  useEffect(() => {
    if (isActive && !hasAnimated) {
      timerRef.current = setTimeout(() => setHasAnimated(true), 50);
    }
    return () => clearTimeout(timerRef.current);
  }, [isActive, hasAnimated]);

  const show = reducedMotion ? isActive : hasAnimated;
  const barTransition = reducedMotion ? "none" : "width 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
  const fadeTransition = reducedMotion ? "none" : "opacity 0.6s ease 1s";
  const slideTransition = reducedMotion ? "none" : "opacity 0.6s ease 1.1s, transform 0.6s ease 1.1s";

  return (
    <div role="figure" aria-label={`US adult weight statistics: ${normalPct}% normal weight, ${overweightPct}% overweight, ${obesityPct}% obese`}>
      <h3 className="font-display mb-5 text-center text-2xl" style={{ color: "var(--color-green-dark)" }}>
        US Adult Weight Prevalence
      </h3>

      {/* Stacked bar */}
      <div className="mx-auto max-w-sm">
        <div className="flex h-14 overflow-hidden rounded-lg" style={{ background: "var(--color-cream)" }}>
          {/* Normal weight segment */}
          <div
            className="flex items-center justify-center font-bold text-black"
            style={{
              width: show ? `${normalPct}%` : "0%",
              background: "var(--color-cream)",
              transition: barTransition,
              fontSize: "0.95rem",
            }}
          >
            <span style={{ opacity: show ? 1 : 0, transition: fadeTransition }}>{normalPct}%</span>
          </div>
          {/* Overweight segment */}
          <div
            className="flex items-center justify-center font-bold text-white"
            style={{
              width: show ? `${overweightPct}%` : "0%",
              background: "var(--color-orange)",
              transition: barTransition,
              transitionDelay: reducedMotion ? "0s" : "0.15s",
              fontSize: "0.95rem",
            }}
          >
            <span style={{ opacity: show ? 1 : 0, transition: fadeTransition }}>{overweightPct}%</span>
          </div>
          {/* Obesity segment */}
          <div
            className="flex items-center justify-center font-bold text-white"
            style={{
              width: show ? `${obesityPct}%` : "0%",
              background: "var(--color-danger)",
              transition: barTransition,
              transitionDelay: reducedMotion ? "0s" : "0.3s",
              fontSize: "0.95rem",
            }}
          >
            <span style={{ opacity: show ? 1 : 0, transition: fadeTransition }}>{obesityPct}%</span>
          </div>
        </div>

        {/* Legend — slides up */}
        <div
          className="mt-4 flex justify-center gap-5 text-sm"
          style={{
            color: "var(--color-text-muted)",
            opacity: show ? 1 : 0,
            transform: show ? "translateY(0)" : "translateY(12px)",
            transition: slideTransition,
          }}
        >
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm border" style={{ background: "var(--color-cream)" }} />
            Normal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ background: "var(--color-orange)" }} />
            Overweight
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ background: "var(--color-danger)" }} />
            Obese
          </span>
        </div>

        {/* Combined callout */}
        <div
          className="mt-5 rounded-md px-4 py-3 text-center font-medium"
          style={{
            background: "var(--color-danger-15)",
            color: "var(--color-danger)",
            opacity: show ? 1 : 0,
            transform: show ? "translateY(0)" : "translateY(16px)",
            transition: reducedMotion ? "none" : "opacity 0.6s ease 1.3s, transform 0.6s ease 1.3s",
            fontSize: "0.95rem",
          }}
        >
          {combinedPct.toFixed(1)}% of US adults are overweight or obese — key risk factors for Type 2 diabetes.
        </div>
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
            <td>Normal weight</td>
            <td>{normalPct}</td>
          </tr>
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
