import { useEffect, useState } from "react";

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

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    CHAPTERS.forEach((chapter, i) => {
      const el = document.getElementById(chapter.id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIndex(i);
        },
        { threshold: 0.3 },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  function scrollToChapter(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav aria-label="Chapter navigation" className="fixed top-1/2 right-4 z-50 flex hidden -translate-y-1/2 flex-col gap-3 lg:flex">
      {CHAPTERS.map((chapter, i) => {
        const isActive = activeIndex === i;
        return (
          <button
            key={chapter.id}
            onClick={() => scrollToChapter(chapter.id)}
            aria-label={`Go to chapter: ${chapter.label}`}
            aria-current={isActive ? "true" : undefined}
            title={chapter.label}
            className="group relative flex items-center justify-end gap-2"
          >
            {/* Tooltip label */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-full mr-2 translate-x-1 rounded bg-[var(--color-green-dark)] px-2 py-0.5 text-xs font-medium whitespace-nowrap text-[var(--color-cream)] opacity-0 transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
            >
              {chapter.label}
            </span>

            {/* Dot */}
            <span
              aria-hidden="true"
              className={`block rounded-full border-2 transition-all duration-200 ${
                isActive ? "h-3 w-3 border-[var(--color-green-mid)] bg-[var(--color-green-mid)]" : "h-2.5 w-2.5 border-[var(--color-green-dark)] bg-transparent opacity-50 group-hover:opacity-100"
              } `}
            />
          </button>
        );
      })}
    </nav>
  );
}
