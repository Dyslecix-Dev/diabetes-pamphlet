import { useEffect, useRef, useState } from "react";

const CHAPTERS = [
  { id: "section-1", label: "What Is Diabetes?" },
  { id: "section-2", label: "Type I vs. Type II" },
  { id: "section-3", label: "How It Develops" },
  { id: "section-4", label: "Treatments" },
  { id: "section-5", label: "Risks & Prevention" },
  { id: "section-6", label: "Living with Diabetes" },
];

export default function ChapterNav() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [highestPassed, setHighestPassed] = useState(-1);
  const [justPopped, setJustPopped] = useState<Set<number>>(new Set());
  const highestRef = useRef(-1);

  useEffect(() => {
    function update() {
      const viewMid = window.innerHeight / 2;
      let closest = -1;
      let minDist = Infinity;

      CHAPTERS.forEach((ch, i) => {
        const el = document.getElementById(ch.id);
        if (!el) return;
        const rect = el.getBoundingClientRect();

        if (rect.top < window.innerHeight * 0.85 && i > highestRef.current) {
          highestRef.current = i;
          setHighestPassed(i);
          setJustPopped((prev) => {
            const next = new Set(prev);
            next.add(i);
            return next;
          });
          setTimeout(() => {
            setJustPopped((prev) => {
              const next = new Set(prev);
              next.delete(i);
              return next;
            });
          }, 400);
        }

        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - viewMid);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });

      setActiveIndex(closest);
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    const t1 = setTimeout(update, 300);
    const t2 = setTimeout(update, 1500);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  function scrollToChapter(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <style>{`
        .chapter-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid var(--color-green-mid);
          background: transparent;
          cursor: pointer;
          transition: background 0.4s ease, border-color 0.4s ease, transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          padding: 0;
        }
        .chapter-dot:hover {
          transform: scale(1.35);
          box-shadow: 0 0 8px rgba(98, 129, 65, 0.4);
        }
        .chapter-dot.passed {
          background: var(--color-green-mid);
          border-color: var(--color-green-mid);
        }
        .chapter-dot.just-passed {
          animation: chDotPop 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .chapter-dot.active {
          background: var(--color-green-dark);
          border-color: var(--color-green-dark);
          transform: scale(1.25);
          box-shadow: 0 0 10px rgba(64, 81, 59, 0.5);
        }
        .chapter-dot.passed:not(.active) {
          animation: chDotBreathe 3s ease-in-out infinite;
        }
        .chapter-dot.passed:not(.active):nth-child(2) { animation-delay: 0.5s; }
        .chapter-dot.passed:not(.active):nth-child(3) { animation-delay: 1s; }
        .chapter-dot.passed:not(.active):nth-child(4) { animation-delay: 1.5s; }
        .chapter-dot.passed:not(.active):nth-child(5) { animation-delay: 2s; }
        .chapter-dot.passed:not(.active):nth-child(6) { animation-delay: 2.5s; }
        @keyframes chDotPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.6); }
          100% { transform: scale(1); }
        }
        @keyframes chDotBreathe {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 rgba(98, 129, 65, 0); }
          50% { transform: scale(1.15); box-shadow: 0 0 8px rgba(98, 129, 65, 0.35); }
        }
        .chapter-dot-tooltip {
          position: absolute;
          right: calc(100% + 8px);
          top: 50%;
          transform: translateY(-50%) translateX(4px);
          white-space: nowrap;
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--color-green-dark);
          background: white;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .chapter-dot:hover .chapter-dot-tooltip,
        .chapter-dot:focus-visible .chapter-dot-tooltip {
          opacity: 1;
          transform: translateY(-50%) translateX(0);
        }
      `}</style>
      <nav aria-label="Chapter navigation" className="fixed top-1/2 right-4 z-50 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
        {CHAPTERS.map((chapter, i) => {
          const isActive = activeIndex === i;
          const isPassed = i <= highestPassed;
          const isPopping = justPopped.has(i);

          const classes = ["chapter-dot", isPassed ? "passed" : "", isActive ? "active" : "", isPopping ? "just-passed" : ""].filter(Boolean).join(" ");

          return (
            <button key={chapter.id} onClick={() => scrollToChapter(chapter.id)} aria-label={`Go to chapter: ${chapter.label}`} aria-current={isActive ? "true" : undefined} className={classes}>
              <span className="chapter-dot-tooltip" aria-hidden="true">
                {chapter.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
