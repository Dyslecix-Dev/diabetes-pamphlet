import { useEffect, useRef, useState } from "react";

// ~1.2M new diagnoses/year ≈ ~2.28 per minute ≈ ~0.038 per second
const DIAGNOSES_PER_SECOND = 1_200_000 / (365.25 * 24 * 60 * 60);

export default function DiagnosisCounter() {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - startTimeRef.current!) / 1000;
      setCount(Math.floor(elapsed * DIAGNOSES_PER_SECOND));
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="text-center" role="status" aria-live="polite" aria-atomic="true">
      <div className="font-mono text-5xl font-bold tabular-nums" style={{ color: "var(--color-orange)" }} aria-label={`${count} people diagnosed with diabetes since you started reading`}>
        {count.toLocaleString()}
      </div>
      <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
        people diagnosed since you started reading
      </p>
      <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
        Based on ~1.2 million new diagnoses per year (CDC)
      </p>
    </div>
  );
}
