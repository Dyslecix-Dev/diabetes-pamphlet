import { useEffect, useState } from "react";
import { useReducedMotion } from "../utils/a11y";

export default function ProgressBar() {
  const [progress, setProgress] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      setProgress(pct);
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  const pct = Math.round(progress * 100);

  return (
    <div role="progressbar" aria-label="Page reading progress" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} className="fixed top-0 right-0 left-0 z-50 h-1 bg-transparent">
      <div
        className="h-full origin-left bg-[var(--color-green-mid)]"
        style={{
          transform: `scaleX(${progress})`,
          transition: reduced ? "none" : "transform 0.1s linear",
          willChange: "transform",
        }}
      />
    </div>
  );
}
