import { BookOpen, ExternalLink, Heart } from "lucide-react";

const RESOURCES = [
  {
    label: "CDC Diabetes Basics",
    url: "https://www.cdc.gov/diabetes/about/index.html",
  },
  {
    label: "ADA — Living with Type 2",
    url: "https://diabetes.org/living-with-diabetes/type-2",
  },
  {
    label: "NIDDK — Diabetes Overview",
    url: "https://www.niddk.nih.gov/health-information/diabetes",
  },
];

export default function ClosingCTA() {
  return (
    <div className="flex flex-col items-center gap-6 px-4 text-center">
      <div className="rounded-full p-4" style={{ backgroundColor: "var(--color-green-dark-10)" }}>
        <Heart size={36} style={{ color: "var(--color-green-mid)" }} strokeWidth={1.5} />
      </div>

      <h3 className="font-display text-2xl md:text-3xl" style={{ color: "var(--color-green-dark)" }}>
        You now know more about diabetes than most people.
      </h3>

      <p className="font-body max-w-md text-base" style={{ color: "var(--color-text-muted)" }}>
        Share what you've learned. Early awareness and small daily choices make a real difference — for you and the people around you.
      </p>

      <div className="mt-2 flex w-full max-w-sm flex-col gap-3">
        <p className="font-body flex items-center justify-center gap-1.5 text-xs tracking-wider uppercase" style={{ color: "var(--color-text-muted)" }}>
          <BookOpen size={14} /> Learn more
        </p>
        {RESOURCES.map((r) => (
          <a
            key={r.url}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body flex items-center justify-between rounded-lg px-4 py-3 text-sm transition-colors"
            style={{
              backgroundColor: "var(--color-cream)",
              color: "var(--color-green-dark)",
            }}
          >
            {r.label}
            <ExternalLink size={14} style={{ color: "var(--color-text-muted)" }} />
          </a>
        ))}
      </div>
    </div>
  );
}
