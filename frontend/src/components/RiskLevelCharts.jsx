import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import ChartLegend from './ChartLegend';

function RiskLevelCharts({ data }) {
  const containerRef = useRef(null);
  const tooltipRef = useRef(null);

  // 1) Extract all unique severities, countries, and years
  const allSeverities = Array.from(new Set(data.map(d => d.severity))).sort((a, b) => a - b);
  const allCountries = Array.from(new Set(data.map(d => d.country))).sort();
  const allYears = Array.from(new Set(data.map(d => d.year))).sort((a, b) => a - b);

  // 2) A state for which years are currently "active" (checked).
  const [activeYears, setActiveYears] = useState(allYears);

  // If data changes drastically, reset activeYears to all
  useEffect(() => {
    setActiveYears(allYears);
  }, [data]);

  // 3) Toggle a year in/out of activeYears
  const toggleYear = (year) => {
    setActiveYears(prev =>
      prev.includes(year)
        ? prev.filter(y => y !== year)  // remove year
        : [...prev, year]               // add year
    );
  };

  // 4) The main effect that sets up sub-charts for each severity
  //    We do a "join" on severities and inside each sub-chart we do a "join" on bars.
  useEffect(() => {
    if (!data || data.length === 0) return;

    const margin = { top: 50, right: 150, bottom: 40, left: 60 };
    const width = 600;
    const height = 300;

    // TIP: color scale for each "year" group
    const colorScale = d3.scaleOrdinal()
      .domain(allYears)
      .range(d3.schemeSet2);

    // CREATE/UPDATE a tooltip div (only once). We'll re-use it for all subcharts
    let tooltip = d3.select(tooltipRef.current)
      .style('position', 'absolute')
      .style('padding', '6px 8px')
      .style('background', '#333')
      .style('color', '#fff')
      .style('border-radius', '4px')
      .style('opacity', 0);

    // 4A) We'll do a standard data join on the severities
    const container = d3.select(containerRef.current);

    // Wipe old sub-charts? Instead of removing everything, we do a "join" 
    // so each severity gets its own <svg> with .severity-chart
    const severitySel = container.selectAll('.severity-chart')
      .data(allSeverities, d => d);

    // EXIT old severities
    severitySel.exit().remove();

    // ENTER new severities => append <svg>
    const severityEnter = severitySel.enter()
      .append('svg')
      .attr('class', 'severity-chart')
      .attr('width', width)
      .attr('height', height)
      .style('margin-bottom', '40px');

    // MERGE to get the updated selection
    const mergedSeverity = severityEnter.merge(severitySel);

    // 4B) We handle each severity's logic in a .each(...) 
    mergedSeverity.each(function (sev, i) {
      const svg = d3.select(this);

      // Data for this severity
      const chartData = data.filter(d => d.severity === sev);

      // X scales
      const x0 = d3.scaleBand()
        .domain(allCountries)
        .range([margin.left, width - margin.right])
        .paddingInner(0.1);

      const x1 = d3.scaleBand()
        .domain(allYears)
        .range([0, x0.bandwidth()])
        .padding(0.05);

      // Y scale
      const yMax = d3.max(chartData, d => d.count);
      const y = d3.scaleLinear()
        .domain([0, yMax || 0])
        .nice()
        .range([height - margin.bottom, margin.top]);

      // Clean up old axes if any
      svg.selectAll('.x-axis').remove();
      svg.selectAll('.y-axis').remove();
      svg.selectAll('.chart-title').remove();
      svg.selectAll('.legend-group').remove();

      // Axes
      svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x0));

      svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y));

      // Chart Title
      svg.append('text')
        .attr('class', 'chart-title')
        .attr('x', width / 2)
        .attr('y', margin.top / 1.3)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text(`No of Severity ${sev} threats for Countres in each Year`);

      // Legend
      svg.append('g')
        .attr('class', 'legend-group')
        .attr('transform', `translate(${width - margin.right + 20}, ${margin.top})`)
        .call(ChartLegend, {
            colorScale,
            title: 'Year'
        });

      // Group data by (country), each gets an array of years
      const grouped = d3.group(chartData, d => d.country);

      // JOIN pattern for each "country-group"
      const countryGroups = svg.selectAll('.country-group')
        .data(grouped, ([country]) => country);

      countryGroups.exit().remove();

      const countryGroupsEnter = countryGroups.enter()
        .append('g')
        .attr('class', 'country-group');

      const mergedCountryGroups = countryGroupsEnter.merge(countryGroups)
        .attr('transform', ([country]) => `translate(${x0(country)},0)`);

      // Now join the rects for each year inside that country
      mergedCountryGroups.each(function ([country, records]) {
        const groupSel = d3.select(this);

        // JOIN for rects
        const rectSel = groupSel.selectAll('rect')
          .data(records, d => d.year);

        rectSel.exit()
          .transition().duration(600)
          .attr('height', 0)
          .attr('y', y(0))
          .remove();

        // ENTER
        rectSel.enter()
          .append('rect')
          .attr('x', d => x1(d.year))
          .attr('width', x1.bandwidth())
          .attr('fill', d => colorScale(d.year))
          // Start from y(0)
          .attr('y', y(0))
          .attr('height', 0)
          .on('mouseover', (event, d) => {
            tooltip.style('opacity', 1);
          })
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
          .on('mouseleave', () => {
            tooltip.style('opacity', 0);
          })
          .call(enter => enter
            .transition()
            .duration(600)
            .attr('y', d => activeYears.includes(d.year) ? y(d.count) : y(0))
            .attr('height', d => activeYears.includes(d.year) ? (y(0) - y(d.count)) : 0)
          );

        // UPDATE
        rectSel
          .on('mouseover', (event, d) => {
            tooltip.style('opacity', 1);
          })
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
          .on('mouseleave', () => {
            tooltip.style('opacity', 0);
          })
          .transition()
          .duration(600)
          .attr('x', d => x1(d.year))
          .attr('width', x1.bandwidth())
          .attr('fill', d => colorScale(d.year))
          .attr('y', d => activeYears.includes(d.year) ? y(d.count) : y(0))
          .attr('height', d => activeYears.includes(d.year) ? (y(0) - y(d.count)) : 0);

      }); // end mergedCountryGroups.each
    }); // end mergedSeverity.each
  }, [data, activeYears, allCountries, allYears, allSeverities]);

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Year Checkboxes */}
      <div style={{ marginBottom: '1rem' }}>
        <h5>Year Filter (Click to Hide/Show)</h5>
        {allYears.map(yr => (
          <label key={yr} style={{ marginRight: '15px' }}>
            <input
              type="checkbox"
              checked={activeYears.includes(yr)}
              onChange={() => toggleYear(yr)}
            />
            {` ${yr}`}
          </label>
        ))}
      </div>

      {/* Container for all severity sub-charts */}
      <div ref={containerRef}></div>

      {/* Tooltip (shared among sub-charts) */}
      <div ref={tooltipRef}></div>
    </div>
  );
}

export default RiskLevelCharts;
