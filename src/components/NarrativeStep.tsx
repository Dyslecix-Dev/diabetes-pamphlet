import { useReducedMotion } from "../utils/a11y";

interface NarrativeStepProps {
  children: React.ReactNode;
  isActive?: boolean;
}

export default function NarrativeStep({ children, isActive = false }: NarrativeStepProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className="flex min-h-[80vh] items-center p-8"
      style={{
        opacity: reducedMotion ? 1 : isActive ? 1 : 0.3,
        transform: reducedMotion ? "none" : isActive ? "translateX(0)" : "translateX(-20px)",
        transition: reducedMotion ? "none" : "opacity 0.5s ease, transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
    >
      <div className="font-body text-text-primary mx-auto max-w-md text-lg leading-relaxed">{children}</div>
    </div>
  );
}
