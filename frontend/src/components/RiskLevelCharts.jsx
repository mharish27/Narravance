import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import ChartLegend from './ChartLegend';

function RiskLevelCharts({ data }) {
  const containerRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clear
    d3.select(containerRef.current).selectAll('*').remove();

    const allSeverities = [...new Set(data.map(d => d.severity))].sort((a,b) => a - b);
    const allCountries = [...new Set(data.map(d => d.country))].sort();
    const allYears = [...new Set(data.map(d => d.year))].sort();
    const colorScale = d3.scaleOrdinal()
      .domain(allYears)
      .range(d3.schemeSet2);

    // We'll create one <svg> per severity
    allSeverities.forEach((severity, chartIndex) => {
      const chartData = data.filter(d => d.severity === severity);

      // Grouped bar chart by: X-axis = Country, groups = Year
      const margin = { top: 50, right: 120, bottom: 40, left: 60 };
      const width = 600;
      const height = 300;

      const svg = d3.select(containerRef.current)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('margin-bottom', '40px');

      let tooltip = d3.select(tooltipRef.current)
        .style('position', 'absolute')
        .style('padding', '6px 8px')
        .style('background', '#333')
        .style('color', '#fff')
        .style('border-radius', '4px')
        .style('opacity', 0);

      // X0 = countries
      const x0 = d3.scaleBand()
        .domain(allCountries)
        .range([margin.left, width - margin.right])
        .paddingInner(0.1);

      // x1 = years within each country
      const x1 = d3.scaleBand()
        .domain(allYears)
        .range([0, x0.bandwidth()])
        .padding(0.05);

      const yMax = d3.max(chartData, d => d.count);
      const y = d3.scaleLinear()
        .domain([0, yMax || 0])
        .nice()
        .range([height - margin.bottom, margin.top]);

      // X axis
      svg.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x0));

      // Y axis
      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

      // Group data: group by country
      const grouped = d3.group(chartData, d => d.country);

      svg.selectAll('.country-group')
        .data(grouped)
        .join('g')
        .attr('class', 'country-group')
        .attr('transform', ([country]) => `translate(${x0(country)},0)`)
        .selectAll('rect')
        .data(([country, vals]) => vals)
        .join('rect')
        .attr('x', d => x1(d.year))
        .attr('y', d => y(d.count))
        .attr('width', x1.bandwidth())
        .attr('height', d => y(0) - y(d.count))
        .attr('fill', d => colorScale(d.year))
        .on('mouseover', (event, d) => tooltip.style('opacity', 1))
        .on('mousemove', (event, d) => {
          tooltip
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY + 'px')
            .html(`
              <div>Country: ${d.country}</div>
              <div>Year: ${d.year}</div>
              <div>Threats: ${d.count}</div>
            `);
        })
        .on('mouseleave', () => tooltip.style('opacity', 0));

      // Chart Title
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', margin.top / 1.3)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text(`Severity ${severity} - Country vs Year`);

      // Legend
      svg
        .append('g')
        .attr('transform', `translate(${width - margin.right + 20}, ${margin.top})`)
        .call(ChartLegend, {
          colorScale,
          title: 'Year'
        });
    });
  }, [data]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div ref={containerRef}></div>
      <div ref={tooltipRef}></div>
    </div>
  );
}

export default RiskLevelCharts;
