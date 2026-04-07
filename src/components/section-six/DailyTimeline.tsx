import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../../utils/a11y";

interface TimelineEvent {
  hour: number;
  label: string;
  type: "meal" | "exercise" | "medication" | "monitoring";
  icon: string;
}

const BASE_EVENTS: TimelineEvent[] = [
  { hour: 7, label: "Breakfast", type: "meal", icon: "🍳" },
  { hour: 8, label: "Morning medication", type: "medication", icon: "💊" },
  { hour: 9, label: "Glucose check", type: "monitoring", icon: "🩸" },
  { hour: 12, label: "Lunch", type: "meal", icon: "🥗" },
  { hour: 13, label: "Walk after lunch", type: "exercise", icon: "🚶" },
  { hour: 15, label: "Glucose check", type: "monitoring", icon: "🩸" },
  { hour: 18, label: "Dinner", type: "meal", icon: "🍽️" },
  { hour: 20, label: "Evening medication", type: "medication", icon: "💊" },
  { hour: 21, label: "Glucose check", type: "monitoring", icon: "🩸" },
];

type Scenario = "normal" | "skip-breakfast" | "miss-medication" | "add-walk";

function generateGlucoseCurve(scenario: Scenario): number[] {
  // Generate 24 data points (one per hour) representing mg/dL
  const baseline = 90;
  const curve: number[] = [];

  for (let h = 0; h < 24; h++) {
    let val = baseline;

    // Normal meal spikes
    if (scenario !== "skip-breakfast") {
      // Breakfast spike at 7-9
      if (h >= 7 && h <= 9) val += 40 * Math.exp(-0.5 * (h - 8) ** 2);
    } else {
      // Skipping breakfast causes a bigger lunch spike and morning instability
      if (h >= 9 && h <= 11) val += 15; // slightly elevated from fasting stress
    }

    // Lunch spike at 12-14
    const lunchPeak = scenario === "skip-breakfast" ? 65 : 45;
    if (h >= 12 && h <= 14) val += lunchPeak * Math.exp(-0.5 * (h - 13) ** 2);

    // Dinner spike at 18-20
    if (h >= 18 && h <= 20) val += 40 * Math.exp(-0.5 * (h - 19) ** 2);

    // Miss medication: everything stays elevated
    if (scenario === "miss-medication") {
      if (h >= 8) val += 30 + (h >= 12 ? 20 : 0);
    }

    // Add walk: smooths out post-lunch
    if (scenario === "add-walk" && h >= 13 && h <= 16) {
      val -= 20 * Math.exp(-0.5 * (h - 14) ** 2);
    }

    // Night dip
    if (h >= 22 || h <= 5) val -= 10;

    curve.push(Math.round(val));
  }

  return curve;
}

const SCENARIOS: { id: Scenario; label: string; description: string }[] = [
  { id: "normal", label: "Normal day", description: "Balanced meals, medication, and exercise" },
  { id: "skip-breakfast", label: "Skip breakfast", description: "See what happens when you miss a meal" },
  { id: "miss-medication", label: "Miss medication", description: "Glucose stays elevated all day" },
  { id: "add-walk", label: "Add afternoon walk", description: "Exercise smooths out post-lunch spike" },
];

const TYPE_COLORS: Record<string, string> = {
  meal: "var(--color-orange)",
  exercise: "var(--color-green-mid)",
  medication: "var(--color-green-dark)",
  monitoring: "var(--color-danger)",
};

export default function DailyTimeline({ isActive = false }: { isActive?: boolean }) {
  const [scenario, setScenario] = useState<Scenario>("normal");
  const svgRef = useRef<SVGSVGElement>(null);
  const reducedMotion = useReducedMotion();
  const [curve, setCurve] = useState(() => generateGlucoseCurve("normal"));

  useEffect(() => {
    setCurve(generateGlucoseCurve(scenario));
  }, [scenario]);

  const width = 600;
  const height = 280;
  const padding = { top: 30, right: 20, bottom: 50, left: 45 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const xScale = useCallback((h: number) => padding.left + (h / 23) * chartW, [chartW]);
  const yMin = 70;
  const yMax = 180;
  const yScale = useCallback((val: number) => padding.top + chartH - ((Math.min(Math.max(val, yMin), yMax) - yMin) / (yMax - yMin)) * chartH, [chartH]);

  // Build SVG path
  const pathD = curve.map((val, h) => `${h === 0 ? "M" : "L"} ${xScale(h)} ${yScale(val)}`).join(" ");

  // Determine which events apply to this scenario
  const events = BASE_EVENTS.filter((e) => {
    if (scenario === "skip-breakfast" && e.hour === 7 && e.type === "meal") return false;
    if (scenario === "miss-medication" && e.type === "medication") return false;
    return true;
  });

  // Add extra walk event for add-walk scenario
  const displayEvents =
    scenario === "add-walk" && !events.find((e) => e.hour === 15 && e.type === "exercise")
      ? [...events, { hour: 15, label: "Afternoon walk", type: "exercise" as const, icon: "🚶" }].sort((a, b) => a.hour - b.hour)
      : events;

  const dangerZone = scenario === "miss-medication";

  return (
    <div className="flex flex-col items-center gap-4" role="figure" aria-label="24-hour glucose timeline with interactive scenarios">
      {/* Scenario toggles */}
      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Glucose scenario selector" style={{ maxWidth: "20rem" }}>
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => setScenario(s.id)}
            role="radio"
            aria-checked={scenario === s.id}
            className="font-body min-h-11 rounded-lg px-3 py-2 text-sm transition-colors"
            style={{
              backgroundColor: scenario === s.id ? "var(--color-green-mid)" : "var(--color-cream)",
              color: scenario === s.id ? "#fff" : "var(--color-text)",
              border: `2px solid ${scenario === s.id ? "var(--color-green-mid)" : "transparent"}`,
            }}
            title={s.description}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* SVG Chart */}
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="w-full max-w-150" aria-hidden="true">
        {/* Normal range band */}
        <rect x={padding.left} y={yScale(140)} width={chartW} height={yScale(80) - yScale(140)} fill="var(--color-green-mid)" opacity={0.08} />
        <text x={padding.left + 4} y={yScale(138)} fontSize="9" fill="var(--color-text-muted)">
          Normal range
        </text>

        {/* Danger zone line at 140 */}
        <line x1={padding.left} y1={yScale(140)} x2={padding.left + chartW} y2={yScale(140)} stroke="var(--color-danger)" strokeDasharray="4 3" opacity={0.4} />

        {/* X axis labels */}
        {[0, 6, 12, 18, 23].map((h) => (
          <text key={h} x={xScale(h)} y={height - 8} textAnchor="middle" fontSize="10" fill="var(--color-text-muted)">
            {h === 0 ? "12am" : h === 6 ? "6am" : h === 12 ? "12pm" : h === 18 ? "6pm" : "11pm"}
          </text>
        ))}

        {/* Y axis labels */}
        {[80, 100, 120, 140, 160, 180].map((v) => (
          <text key={v} x={padding.left - 6} y={yScale(v) + 3} textAnchor="end" fontSize="9" fill="var(--color-text-muted)">
            {v}
          </text>
        ))}

        {/* Y axis label */}
        <text x={12} y={padding.top + chartH / 2} textAnchor="middle" fontSize="9" fill="var(--color-text-muted)" transform={`rotate(-90, 12, ${padding.top + chartH / 2})`}>
          mg/dL
        </text>

        {/* Glucose curve */}
        <path
          d={pathD}
          fill="none"
          stroke={dangerZone ? "var(--color-danger)" : "var(--color-green-mid)"}
          strokeWidth={2.5}
          strokeLinejoin="round"
          style={reducedMotion ? {} : { transition: "d 0.5s ease" }}
        />

        {/* Event markers */}
        {displayEvents.map((e, i) => (
          <g key={`${e.hour}-${e.type}-${i}`}>
            <line x1={xScale(e.hour)} y1={padding.top} x2={xScale(e.hour)} y2={height - padding.bottom} stroke={TYPE_COLORS[e.type]} strokeDasharray="2 2" opacity={0.3} />
            <text x={xScale(e.hour)} y={height - padding.bottom + 14} textAnchor="middle" fontSize="13">
              {e.icon}
            </text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="font-body flex flex-wrap justify-center gap-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
        {(["meal", "exercise", "medication", "monitoring"] as const).map((type) => (
          <span key={type} className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: TYPE_COLORS[type] }} />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        ))}
      </div>

      {/* Accessible data table */}
      <table className="sr-only" aria-label="Glucose values throughout the day">
        <caption>Blood glucose levels (mg/dL) by hour for scenario: {scenario}</caption>
        <thead>
          <tr>
            <th>Hour</th>
            <th>Glucose (mg/dL)</th>
          </tr>
        </thead>
        <tbody>
          {curve.map((val, h) => (
            <tr key={h}>
              <td>{h}:00</td>
              <td>{val}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
