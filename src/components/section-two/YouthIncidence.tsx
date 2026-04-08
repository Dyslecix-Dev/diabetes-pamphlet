import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import youthData from "../../data/youth-incidence.json";
import { useReducedMotion } from "../../utils/a11y";

interface YouthIncidenceProps {
  isActive: boolean;
}

const MARGIN = { top: 40, right: 20, bottom: 50, left: 60 };
const WIDTH = 500;
const HEIGHT = 320;
const innerW = WIDTH - MARGIN.left - MARGIN.right;
const innerH = HEIGHT - MARGIN.top - MARGIN.bottom;

const bars = [
  {
    label: "Type 1",
    value: youthData.findings.t1d_annual_increase_pct,
    color: "var(--color-orange)",
    population: youthData.findings.t1d_population,
  },
  {
    label: "Type 2",
    value: youthData.findings.t2d_annual_increase_pct,
    color: "var(--color-green-mid)",
    population: youthData.findings.t2d_population,
  },
];

export default function YouthIncidence({ isActive }: YouthIncidenceProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!svgRef.current || (!isActive && !hasAnimated)) return;
    if (hasAnimated) return;
    setHasAnimated(true);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g").attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    const x = d3
      .scaleBand()
      .domain(bars.map((b) => b.label))
      .range([0, innerW])
      .padding(0.4);

    const y = d3
      .scaleLinear()
      .domain([0, Math.ceil(d3.max(bars, (b) => b.value)! + 1)])
      .range([innerH, 0]);

    // Axes
    g.append("g").attr("transform", `translate(0,${innerH})`).call(d3.axisBottom(x)).selectAll("text").style("font-size", "13px").style("fill", "var(--color-text)");

    g.append("g")
      .call(
        d3
          .axisLeft(y)
          .ticks(4)
          .tickFormat((d) => `+${d}%`),
      )
      .selectAll("text")
      .style("font-size", "11px")
      .style("fill", "var(--color-text-muted)");

    // Y-axis label
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -45)
      .attr("x", -innerH / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("fill", "var(--color-text-muted)")
      .text("Annual incidence increase");

    // Bars
    g.selectAll(".bar")
      .data(bars)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.label)!)
      .attr("width", x.bandwidth())
      .attr("fill", (d) => d.color)
      .attr("rx", 4)
      .attr("y", reducedMotion ? (d) => y(d.value) : innerH)
      .attr("height", reducedMotion ? (d) => innerH - y(d.value) : 0)
      .transition()
      .duration(reducedMotion ? 0 : 800)
      .ease(d3.easeCubicOut)
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => innerH - y(d.value));

    // Value labels on bars
    g.selectAll(".val-label")
      .data(bars)
      .enter()
      .append("text")
      .attr("x", (d) => x(d.label)! + x.bandwidth() / 2)
      .attr("y", (d) => y(d.value) - 8)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "700")
      .style("fill", (d) => d.color)
      .style("opacity", reducedMotion ? 1 : 0)
      .text((d) => `+${d.value}%/yr`)
      .transition()
      .delay(reducedMotion ? 0 : 600)
      .duration(reducedMotion ? 0 : 400)
      .style("opacity", 1);

    // Title
    g.append("text")
      .attr("x", innerW / 2)
      .attr("y", -15)
      .attr("text-anchor", "middle")
      .style("font-size", "13px")
      .style("font-weight", "600")
      .style("fill", "var(--color-text)")
      .text("Youth Diabetes Incidence (Annual Increase)");
  }, [isActive, hasAnimated, reducedMotion]);

  return (
    <div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label="Bar chart comparing youth diabetes incidence increases: Type 1 at 2.02% per year among 0-19 year olds, Type 2 at 5.31% per year among 10-19 year olds."
      />

      <table className="sr-only" role="table" aria-label="Youth diabetes incidence data">
        <caption className="sr-only">Annual incidence increase from SEARCH for Diabetes in Youth Study</caption>
        <thead>
          <tr className="border-b" style={{ borderColor: "var(--color-cream)" }}>
            <th className="py-1 text-left" scope="col">
              Type
            </th>
            <th className="py-1 text-right" scope="col">
              Annual Increase
            </th>
            <th className="py-1 text-right" scope="col">
              Population
            </th>
          </tr>
        </thead>
        <tbody>
          {bars.map((b) => (
            <tr key={b.label} className="border-b" style={{ borderColor: "var(--color-cream)" }}>
              <td className="py-1">{b.label}</td>
              <td className="py-1 text-right">+{b.value}%/yr</td>
              <td className="py-1 text-right">{b.population}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
