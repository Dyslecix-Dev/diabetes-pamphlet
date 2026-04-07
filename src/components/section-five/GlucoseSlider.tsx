import { useId, useState } from "react";
import complicationsData from "../../data/complications.json";

const ranges = complicationsData.glucose_ranges_mg_dl;

function getZone(value: number) {
  if (value < ranges.hypoglycemia.below) {
    return {
      label: "Hypoglycemia (Dangerous)",
      color: "var(--color-danger)",
      symptoms: ranges.hypoglycemia.symptoms,
    };
  }
  if (value <= ranges.normal_fasting.max) {
    return { label: "Normal Fasting", color: "var(--color-success)", symptoms: null };
  }
  if (value <= ranges.prediabetic.max) {
    return { label: "Prediabetic", color: "var(--color-orange)", symptoms: null };
  }
  return { label: "Diabetic", color: "var(--color-danger)", symptoms: null };
}

// Green 70-99, orange 100-125, red 126+, red below 70
function getGradient() {
  // 30-300 range mapped: 30=0%, 300=100%
  const total = 270;
  const pct = (v: number) => ((v - 30) / total) * 100;
  return `linear-gradient(to right,
    var(--color-danger) ${pct(30)}%,
    var(--color-danger) ${pct(69)}%,
    var(--color-success) ${pct(70)}%,
    var(--color-success) ${pct(99)}%,
    var(--color-orange) ${pct(100)}%,
    var(--color-orange) ${pct(125)}%,
    var(--color-danger) ${pct(126)}%,
    var(--color-danger) ${pct(300)}%
  )`;
}

export default function GlucoseSlider() {
  const [value, setValue] = useState(90);
  const zone = getZone(value);
  const sliderId = useId();

  return (
    <div className="mx-auto w-full max-w-md">
      <h3 className="font-display mb-2 text-center text-xl" style={{ color: "var(--color-green-dark)" }}>
        Blood Glucose Level
      </h3>

      <div className="mb-4 text-center">
        <span className="font-mono text-4xl font-bold" style={{ color: zone.color }} aria-live="polite">
          {value}
        </span>
        <span className="font-body ml-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
          mg/dL
        </span>
      </div>

      <label htmlFor={sliderId} className="sr-only">
        Adjust blood glucose level
      </label>
      <input
        id={sliderId}
        type="range"
        min={30}
        max={300}
        step={1}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="h-3 w-full cursor-pointer appearance-none rounded-full"
        style={{
          background: getGradient(),
          accentColor: zone.color,
        }}
        aria-valuemin={30}
        aria-valuemax={300}
        aria-valuenow={value}
        aria-valuetext={`${value} mg/dL — ${zone.label}`}
      />

      {/* Zone labels */}
      <div className="font-body mt-1 flex justify-between text-xs" style={{ color: "var(--color-text-muted)" }}>
        <span>30</span>
        <span>70</span>
        <span>100</span>
        <span>126</span>
        <span>300</span>
      </div>

      {/* Current zone */}
      <div className="mt-4 rounded-lg p-4 text-center" style={{ backgroundColor: zone.color + "18", border: `2px solid ${zone.color}` }}>
        <p className="font-body text-lg font-semibold" style={{ color: zone.color }}>
          {zone.label}
        </p>
        {zone.symptoms && (
          <div className="mt-2">
            <p className="font-body text-sm" style={{ color: "var(--color-text-primary)" }}>
              Symptoms:
            </p>
            <ul className="mt-1 flex flex-wrap justify-center gap-2">
              {zone.symptoms.map((s) => (
                <li key={s} className="font-body rounded-full px-2 py-1 text-sm" style={{ backgroundColor: "var(--color-danger-light)", color: "#fff" }}>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Zone legend */}
      <div className="font-body mt-4 grid grid-cols-2 gap-2 text-sm">
        {[
          { label: "Hypoglycemia", range: "< 70", color: "var(--color-danger)" },
          { label: "Normal", range: "70–99", color: "var(--color-success)" },
          { label: "Prediabetic", range: "100–125", color: "var(--color-orange)" },
          { label: "Diabetic", range: "126+", color: "var(--color-danger)" },
        ].map((z) => (
          <div key={z.label} className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: z.color }} aria-hidden="true" />
            <span>
              {z.label} <span style={{ color: "var(--color-text-muted)" }}>({z.range})</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
