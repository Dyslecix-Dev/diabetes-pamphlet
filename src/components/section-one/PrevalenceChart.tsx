import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import prevalenceData from "../../data/prevalence.json";
import { useReducedMotion } from "../../utils/a11y";

interface PrevalenceChartProps {
  isActive: boolean;
}

const MARGIN = { top: 30, right: 20, bottom: 50, left: 50 };
const WIDTH = 500;
const HEIGHT = 320;
const innerW = WIDTH - MARGIN.left - MARGIN.right;
const innerH = HEIGHT - MARGIN.top - MARGIN.bottom;

export default function PrevalenceChart({ isActive }: PrevalenceChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const reducedMotion = useReducedMotion();

  const data = prevalenceData.data;

  useEffect(() => {
    if (!svgRef.current || (!isActive && !hasAnimated)) return;
    if (hasAnimated) return;

    setHasAnimated(true);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g").attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    // Scales
    const x = d3
      .scalePoint<string>()
      .domain(data.map((d) => d.period))
      .range([0, innerW])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.total)! + 2])
      .range([innerH, 0]);

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${innerH})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-35)")
      .style("text-anchor", "end")
      .style("font-size", "10px")
      .style("fill", "var(--color-text-muted)");

    g.append("g")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => `${d}%`),
      )
      .selectAll("text")
      .style("font-size", "11px")
      .style("fill", "var(--color-text-muted)");

    // Line generators
    const lineDiagnosed = d3
      .line<(typeof data)[0]>()
      .x((d) => x(d.period)!)
      .y((d) => y(d.diagnosed))
      .curve(d3.curveMonotoneX);

    const lineTotal = d3
      .line<(typeof data)[0]>()
      .x((d) => x(d.period)!)
      .y((d) => y(d.total))
      .curve(d3.curveMonotoneX);

    const lineUndiagnosed = d3
      .line<(typeof data)[0]>()
      .x((d) => x(d.period)!)
      .y((d) => y(d.undiagnosed))
      .curve(d3.curveMonotoneX);

    // Draw lines
    const lines = [
      { gen: lineTotal, color: "var(--color-danger)", label: "Total" },
      { gen: lineDiagnosed, color: "var(--color-orange)", label: "Diagnosed" },
      { gen: lineUndiagnosed, color: "var(--color-green-mid)", label: "Undiagnosed" },
    ];

    lines.forEach(({ gen, color }) => {
      const path = g.append("path").datum(data).attr("fill", "none").attr("stroke", color).attr("stroke-width", 2.5).attr("d", gen);

      if (!reducedMotion) {
        const totalLength = (path.node() as SVGPathElement).getTotalLength();
        path.attr("stroke-dasharray", totalLength).attr("stroke-dashoffset", totalLength).transition().duration(1500).ease(d3.easeCubicOut).attr("stroke-dashoffset", 0);
      }
    });

    // Legend
    const legend = g.append("g").attr("transform", `translate(0, -15)`);
    lines.forEach(({ color, label }, i) => {
      const item = legend.append("g").attr("transform", `translate(${i * 110}, 0)`);
      item.append("rect").attr("width", 12).attr("height", 3).attr("y", -2).attr("fill", color);
      item.append("text").attr("x", 16).attr("y", 0).attr("dominant-baseline", "central").style("font-size", "11px").style("fill", "var(--color-text-muted)").text(label);
    });

    // Y-axis label
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -innerH / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("fill", "var(--color-text-muted)")
      .text("Prevalence (%)");
  }, [isActive, hasAnimated, reducedMotion, data]);

  return (
    <div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label="Line chart showing US adult diabetes prevalence from 2001 to 2023. Total prevalence rose from 11.2% to 13.5%."
      />

      <table className="sr-only" role="table" aria-label="Diabetes prevalence data 2001-2023">
        <caption className="sr-only">Age-adjusted diabetes prevalence among US adults 18+, {prevalenceData.source}</caption>
        <thead>
          <tr className="border-b" style={{ borderColor: "var(--color-cream)" }}>
            <th className="py-1 text-left" scope="col">
              Period
            </th>
            <th className="py-1 text-right" scope="col">
              Diagnosed %
            </th>
            <th className="py-1 text-right" scope="col">
              Undiagnosed %
            </th>
            <th className="py-1 text-right" scope="col">
              Total %
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.period} className="border-b" style={{ borderColor: "var(--color-cream)" }}>
              <td className="py-1">{row.period}</td>
              <td className="py-1 text-right">{row.diagnosed}</td>
              <td className="py-1 text-right">{row.undiagnosed}</td>
              <td className="py-1 text-right">{row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
