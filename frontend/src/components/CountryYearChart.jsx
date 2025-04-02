import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import ChartLegend from './ChartLegend';

function CountryYearChart({ data }) {
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const margin = { top: 50, right: 120, bottom: 50, left: 60 };
    const width = 600;
    const height = 400;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create a div for tooltip (absolute positioned)
    let tooltip = d3.select(tooltipRef.current)
      .style('position', 'absolute')
      .style('padding', '6px 8px')
      .style('background', '#333')
      .style('color', '#fff')
      .style('border-radius', '4px')
      .style('opacity', 0);

    // Extract unique countries & years
    const allCountries = Array.from(new Set(data.map(d => d.country))).sort();
    const allYears = Array.from(new Set(data.map(d => d.year))).sort();

    // Color scale (consistent across entire app, typically)
    const colorScale = d3.scaleOrdinal()
      .domain(allCountries)
      .range(d3.schemeSet2);

    // X scale = year band
    const x0 = d3.scaleBand()
      .domain(allYears)
      .range([margin.left, width - margin.right])
      .paddingInner(0.1);

    // x1 scale = for grouping countries within each year
    const x1 = d3.scaleBand()
      .domain(allCountries)
      .range([0, x0.bandwidth()])
      .padding(0.05);

    // Y scale = count
    const yMax = d3.max(data, d => d.count);
    const y = d3.scaleLinear()
      .domain([0, yMax || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x0).tickSizeOuter(0));

    // Add Y axis
    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y));

    // Bars
    // Group by year
    const groupedData = d3.group(data, d => d.year);

    svg
      .selectAll('g.year-group')
      .data(groupedData)
      .enter()
      .append('g')
      .attr('class', 'year-group')
      .attr('transform', ([year]) => `translate(${x0(year)},0)`)
      .selectAll('rect')
      .data(([year, values]) => values)
      .enter()
      .append('rect')
      .attr('x', d => x1(d.country))
      .attr('y', d => y(d.count))
      .attr('width', x1.bandwidth())
      .attr('height', d => y(0) - y(d.count))
      .attr('fill', d => colorScale(d.country))
      .on('mouseover', (event, d) => {
        tooltip.style('opacity', 1);
      })
      .on('mousemove', (event, d) => {
        const [mx, my] = d3.pointer(event);
        tooltip
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY + 'px')
          .html(
            `<div>Country: ${d.country}</div>
             <div>Year: ${d.year}</div>
             <div>Threats: ${d.count}</div>`
          );
      })
      .on('mouseleave', () => {
        tooltip.style('opacity', 0);
      });

    // Title
    svg
      .append('text')
      .attr('x', (width / 2))
      .attr('y', margin.top / 1.3)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Countries vs No. of Threats per Year');

    // Legend
    svg
      .append('g')
      .attr('transform', `translate(${width - margin.right + 20}, ${margin.top})`)
      .call(ChartLegend, {
        colorScale,
        title: 'Country'
      });

  }, [data]);

  return (
    <div style={{ marginBottom: '40px', textAlign: 'center' }}>
      <svg ref={svgRef}></svg>
      <div ref={tooltipRef}></div>
    </div>
  );
}

export default CountryYearChart;
