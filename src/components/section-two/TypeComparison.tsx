interface TypeComparisonProps {
  currentStep: number;
}

interface TypeCard {
  type: string;
  color: string;
  cause: string;
  onset: string;
  prevalence: string;
  treatment: string;
}

const cards: TypeCard[] = [
  {
    type: "Type 1",
    color: "var(--color-orange)",
    cause: "Autoimmune — immune system destroys beta cells",
    onset: "Usually childhood/early adulthood (peak age: 10)",
    prevalence: "5–10% of cases",
    treatment: "Insulin injections for life",
  },
  {
    type: "Type 2",
    color: "var(--color-green-mid)",
    cause: "Insulin resistance — cells stop responding",
    onset: "Usually age 45+, increasingly in youth",
    prevalence: "90–95% of cases",
    treatment: "Lifestyle changes, medication, possibly insulin",
  },
];

export default function TypeComparison({ currentStep }: TypeComparisonProps) {
  // Show T1 card from step 1, T2 card from step 4
  const showT1 = currentStep >= 1;
  const showT2 = currentStep >= 4;

  return (
    <div className="flex flex-col gap-4" role="list" aria-label="Comparison of Type 1 and Type 2 diabetes">
      {cards.map((card, i) => {
        const visible = i === 0 ? showT1 : showT2;
        return (
          <div
            key={card.type}
            role="listitem"
            className="rounded-lg border-l-4 p-4"
            style={{
              borderColor: card.color,
              background: "var(--color-bg)",
              opacity: visible ? 1 : 0.15,
              transition: "opacity 0.4s ease",
            }}
          >
            <h3 className="font-display mb-2 text-xl" style={{ color: card.color }}>
              {card.type}
            </h3>
            <dl className="space-y-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
              <div>
                <dt className="inline font-semibold" style={{ color: "var(--color-text)" }}>
                  Cause:{" "}
                </dt>
                <dd className="inline">{card.cause}</dd>
              </div>
              <div>
                <dt className="inline font-semibold" style={{ color: "var(--color-text)" }}>
                  Onset:{" "}
                </dt>
                <dd className="inline">{card.onset}</dd>
              </div>
              <div>
                <dt className="inline font-semibold" style={{ color: "var(--color-text)" }}>
                  Prevalence:{" "}
                </dt>
                <dd className="inline">{card.prevalence}</dd>
              </div>
              <div>
                <dt className="inline font-semibold" style={{ color: "var(--color-text)" }}>
                  Treatment:{" "}
                </dt>
                <dd className="inline">{card.treatment}</dd>
              </div>
            </dl>
          </div>
        );
      })}
    </div>
  );
}
