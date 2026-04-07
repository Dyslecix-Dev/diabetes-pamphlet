import { useEffect, useRef, useState } from "react";

// ~1.2M new diagnoses/year ≈ ~0.038 per second
const DIAGNOSES_PER_SECOND = 1_200_000 / (365.25 * 24 * 60 * 60);

// Captured when the module first loads (page load time)
const PAGE_START = performance.now();

function diagnosedSincePageLoad() {
  return ((performance.now() - PAGE_START) / 1000) * DIAGNOSES_PER_SECOND;
}

export default function DiagnosisCounter() {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const CATCH_UP_DURATION = 1500; // ms to animate from 0 → current count
    const catchUpStart = performance.now();
    const catchUpTarget = diagnosedSincePageLoad();

    const tick = (now: number) => {
      const catchUpElapsed = now - catchUpStart;

      if (catchUpElapsed < CATCH_UP_DURATION) {
        // Ease-out catch-up: animate 0 → catchUpTarget
        const progress = 1 - Math.pow(1 - catchUpElapsed / CATCH_UP_DURATION, 3);
        setCount(Math.floor(progress * catchUpTarget));
      } else {
        // Real-time counting from page load
        setCount(Math.floor(diagnosedSincePageLoad()));
      }

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
