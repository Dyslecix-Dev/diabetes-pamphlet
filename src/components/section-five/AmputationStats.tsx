import * as d3 from "d3";
import { useEffect, useRef } from "react";
import complicationsData from "../../data/complications.json";
import { useReducedMotion } from "../../utils/a11y";

const data = complicationsData.amputation_data;

interface BarDatum {
  label: string;
  major: number;
  minor: number;
}

const barData: BarDatum[] = [
  {
    label: "Overall",
    major: data.major_amputation_rate_per_100k.overall,
    minor: data.minor_amputation_rate_per_100k.overall,
  },
  {
    label: "Type 1",
    major: data.major_amputation_rate_per_100k.t1d,
    minor: data.minor_amputation_rate_per_100k.t1d,
  },
  {
    label: "Type 2",
    major: data.major_amputation_rate_per_100k.t2d,
    minor: data.minor_amputation_rate_per_100k.t2d,
  },
];

const genderData = [
  { label: "Men", rate: data.by_gender_per_100k.men },
  { label: "Women", rate: data.by_gender_per_100k.women },
];

export default function AmputationStats({ isActive }: { isActive: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!svgRef.current || !isActive) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 320;
    const height = 300;
    const margin = { top: 30, right: 20, bottom: 50, left: 55 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const x0 = d3
      .scaleBand<string>()
      .domain(barData.map((d) => d.label))
      .range([0, innerW])
      .padding(0.3);
    const x1 = d3.scaleBand<string>().domain(["major", "minor"]).range([0, x0.bandwidth()]).padding(0.1);
    const y = d3.scaleLinear().domain([0, 160]).range([innerH, 0]);

    // Axes
    g.append("g").attr("transform", `translate(0,${innerH})`).call(d3.axisBottom(x0).tickSizeOuter(0)).selectAll("text").style("font-family", "var(--font-body)").style("font-size", "12px");

    g.append("g").call(d3.axisLeft(y).ticks(5)).selectAll("text").style("font-family", "var(--font-body)").style("font-size", "11px");

    // Y-axis label
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -45)
      .attr("x", -innerH / 2)
      .attr("text-anchor", "middle")
      .style("font-family", "var(--font-body)")
      .style("font-size", "11px")
      .style("fill", "var(--color-text-muted)")
      .text("per 100,000 patients");

    const colors = { major: "var(--color-danger)", minor: "var(--color-orange)" };

    // Bars
    barData.forEach((d) => {
      const barGroup = g.append("g").attr("transform", `translate(${x0(d.label)},0)`);

      (["major", "minor"] as const).forEach((key) => {
        const val = key === "major" ? d.major : d.minor;
        const bar = barGroup.append("rect").attr("x", x1(key)!).attr("width", x1.bandwidth()).attr("rx", 3).attr("fill", colors[key]);

        if (reducedMotion) {
          bar.attr("y", y(val)).attr("height", innerH - y(val));
        } else {
          bar
            .attr("y", innerH)
            .attr("height", 0)
            .transition()
            .duration(800)
            .delay(key === "minor" ? 200 : 0)
            .attr("y", y(val))
            .attr("height", innerH - y(val));
        }

        // Value label
        barGroup
          .append("text")
          .attr("x", x1(key)! + x1.bandwidth() / 2)
          .attr("y", y(val) - 4)
          .attr("text-anchor", "middle")
          .style("font-family", "var(--font-mono)")
          .style("font-size", "10px")
          .style("fill", "var(--color-text-primary)")
          .style("opacity", reducedMotion ? 1 : 0)
          .text(val.toFixed(0))
          .transition()
          .delay(reducedMotion ? 0 : 900)
          .style("opacity", 1);
      });
    });

    // Legend
    const legend = g.append("g").attr("transform", `translate(${innerW - 90}, -15)`);
    (["major", "minor"] as const).forEach((key, i) => {
      legend
        .append("rect")
        .attr("x", i * 55)
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", 10)
        .attr("rx", 2)
        .attr("fill", colors[key]);
      legend
        .append("text")
        .attr("x", i * 55 + 14)
        .attr("y", 9)
        .style("font-family", "var(--font-body)")
        .style("font-size", "10px")
        .style("fill", "var(--color-text-primary)")
        .text(key.charAt(0).toUpperCase() + key.slice(1));
    });
  }, [isActive, reducedMotion]);

  return (
    <div className="w-full">
      <h3 className="font-display mb-2 text-center text-lg" style={{ color: "var(--color-green-dark)" }}>
        Amputation Rates by Diabetes Type
      </h3>
      <svg ref={svgRef} className="mx-auto w-full max-w-85" role="img" aria-label="Bar chart showing diabetes-related amputation rates per 100,000 patients" />

      {/* Gender comparison */}
      <div className="mt-4 flex justify-center gap-6" role="group" aria-label="Amputation rates by gender">
        {genderData.map((g) => (
          <div key={g.label} className="text-center">
            <p className="font-mono text-2xl font-bold" style={{ color: "var(--color-danger)" }} aria-hidden="true">
              {g.rate}
            </p>
            <p className="font-body text-sm" style={{ color: "var(--color-text-muted)" }}>
              <span className="sr-only">{g.rate} amputations per 100,000 for </span>
              {g.label}
              <span aria-hidden="true"> / 100k</span>
            </p>
          </div>
        ))}
      </div>
      <p className="font-body mt-1 text-center text-xs" style={{ color: "var(--color-text-muted)" }}>
        {data.gender_disparity}
      </p>

      {/* Accessible data table */}
      <table className="sr-only">
        <caption>Diabetes-related amputation rates per 100,000 patients annually</caption>
        <thead>
          <tr>
            <th>Category</th>
            <th>Major amputations</th>
            <th>Minor amputations</th>
          </tr>
        </thead>
        <tbody>
          {barData.map((d) => (
            <tr key={d.label}>
              <td>{d.label}</td>
              <td>{d.major}</td>
              <td>{d.minor}</td>
            </tr>
          ))}
          <tr>
            <td>Men (total)</td>
            <td colSpan={2}>{data.by_gender_per_100k.men}</td>
          </tr>
          <tr>
            <td>Women (total)</td>
            <td colSpan={2}>{data.by_gender_per_100k.women}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
