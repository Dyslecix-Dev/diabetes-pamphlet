import { gsap } from "gsap";
import { useEffect, useId, useRef, useState } from "react";
import complicationsData from "../../data/complications.json";
import { useReducedMotion } from "../../utils/a11y";

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

// Red <70, green 70-99, orange 100-125, red 126+
function getGradient() {
  const total = 270;
  const pct = (v: number) => `${((v - 30) / total) * 100}%`;
  return `linear-gradient(to right,
    #c0392b ${pct(30)},
    #c0392b ${pct(69)},
    #27ae60 ${pct(70)},
    #27ae60 ${pct(99)},
    #e67e22 ${pct(100)},
    #e67e22 ${pct(125)},
    #c0392b ${pct(126)},
    #c0392b ${pct(300)}
  )`;
}

export default function GlucoseSlider() {
  const reducedMotion = useReducedMotion();
  const [value, setValue] = useState(reducedMotion ? 90 : 30);
  const [animating, setAnimating] = useState(!reducedMotion);
  const animObj = useRef({ val: 30 });
  const zone = getZone(value);
  const sliderId = useId();

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setAnimating(false),
      });

      // Sweep from 30 → 300
      tl.to(animObj.current, {
        val: 300,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => setValue(Math.round(animObj.current.val)),
      });

      // Then settle at 90
      tl.to(animObj.current, {
        val: 90,
        duration: 1,
        ease: "power2.out",
        onUpdate: () => setValue(Math.round(animObj.current.val)),
      });
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div className="mx-auto w-full max-w-lg">
      <h3 className="font-display mb-3 text-center text-2xl" style={{ color: "var(--color-green-dark)" }}>
        Blood Glucose Level
      </h3>

      <div className="mb-5 text-center">
        <span className="font-mono text-5xl font-bold" style={{ color: zone.color }} aria-live="polite">
          {value}
        </span>
        <span className="font-body ml-1" style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
          mg/dL
        </span>
      </div>

      <label htmlFor={sliderId} className="sr-only">
        Adjust blood glucose level
      </label>
      <div className="relative">
        {/* Gradient track */}
        <div className="h-4 w-full rounded-full" style={{ background: getGradient() }} />
        {/* Tall vertical bar marker */}
        <div
          className="pointer-events-none absolute top-1/2 -translate-x-1/2"
          style={{
            left: `${((value - 30) / 270) * 100}%`,
            width: 4,
            height: 40,
            marginTop: -20,
            background: "#1a1a2e",
            borderRadius: 2,
            boxShadow: "0 0 0 2px #fff, 0 2px 8px rgba(0,0,0,0.3)",
            transition: "none",
          }}
        />
        {/* Invisible range input on top for interaction */}
        <input
          id={sliderId}
          type="range"
          min={30}
          max={300}
          step={1}
          value={value}
          onChange={(e) => {
            if (!animating) setValue(Number(e.target.value));
          }}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-valuemin={30}
          aria-valuemax={300}
          aria-valuenow={value}
          aria-valuetext={`${value} mg/dL — ${zone.label}`}
        />
      </div>

      {/* Zone labels — positioned at actual boundary percentages */}
      <div className="font-body relative mt-2 h-5 text-sm" style={{ color: "var(--color-text-muted)" }}>
        {[30, 70, 100, 126, 300].map((v) => (
          <span key={v} className="absolute -translate-x-1/2" style={{ left: `${((v - 30) / 270) * 100}%` }}>
            {v}
          </span>
        ))}
      </div>

      {/* Current zone */}
      <div className="mt-5 rounded-lg p-5 text-center" style={{ backgroundColor: zone.color + "18", border: `2px solid ${zone.color}` }}>
        <p className="font-body text-xl font-semibold" style={{ color: zone.color }}>
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
