import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import ChartLegend from './ChartLegend';

function CountryYearChart({ data }) {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);

  // Track which countries are "active" (checked)
  const [activeCountries, setActiveCountries] = useState([]);

  // On first load or when data changes, reset activeCountries to "all"
  useEffect(() => {
    if (!data || data.length === 0) return;
    const allCountries = Array.from(new Set(data.map(d => d.country)));
    setActiveCountries(allCountries);
  }, [data]);

  // The main D3 drawing/updating effect
  useEffect(() => {
    if (!data || data.length === 0) return;

    const margin = { top: 50, right: 120, bottom: 50, left: 60 };
    const width = 600;
    const height = 400;

    // Select or create the SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create a tooltip div
    const tooltip = d3.select(tooltipRef.current)
      .style('position', 'absolute')
      .style('padding', '6px 8px')
      .style('background', '#333')
      .style('color', '#fff')
      .style('border-radius', '4px')
      .style('opacity', 0);

    // X and Y scales
    const allCountries = Array.from(new Set(data.map(d => d.country))).sort();
    const allYears = Array.from(new Set(data.map(d => d.year))).sort();

    const colorScale = d3.scaleOrdinal(allCountries, d3.schemeSet2);

    const x0 = d3.scaleBand()
      .domain(allYears)
      .range([margin.left, width - margin.right])
      .paddingInner(0.1);

    const x1 = d3.scaleBand()
      .domain(allCountries)
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const yMax = d3.max(data, d => d.count);
    const y = d3.scaleLinear()
      .domain([0, yMax || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Axes (re‐create or update)
    // Remove old axes if you want them to properly update
    svg.selectAll('.x-axis').remove();
    svg.selectAll('.y-axis').remove();

    // X axis
    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x0).tickSizeOuter(0));

    // Y axis
    svg.append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y));

    // Group data by year
    const groupedData = Array.from(d3.group(data, d => d.year), ([year, values]) => ({
      year,
      values
    }));

    // ----------------------
    // Join pattern per year
    // ----------------------
    const yearGroups = svg.selectAll('g.year-group')
      .data(groupedData, d => d.year);

    // ENTER + UPDATE
    const yearGroupsEnter = yearGroups.enter()
      .append('g')
      .attr('class', 'year-group');

    yearGroupsEnter.merge(yearGroups)
      .attr('transform', d => `translate(${x0(d.year)}, 0)`);

    // yearGroups EXIT
    yearGroups.exit().remove();

    // Now each yearGroup has its own array of "values" (one for each country).
    // We'll do another data join for the rects inside each yearGroup.
    yearGroupsEnter.each(function(d) {
      // We create a sub-selection for each new group
      d3.select(this)
        .selectAll('rect')
        .data(d.values, (val) => val.country) // key by "country"
        .enter()
        .append('rect');
    });

    // For both new and existing yearGroups, select the "rect" and bind data
    const allRects = yearGroups.selectAll('rect')
      .data(d => d.values, d => d.country);

    // ENTER
    allRects.enter()
    .append('rect')
    .attr('x', d => x1(d.country))
    .attr('width', x1.bandwidth())
    .attr('fill', d => colorScale(d.country))
    .attr('y', y(0))      // start from bottom
    .attr('height', 0)    // collapsed
    .on('mouseover', (event, d) => {
    tooltip.style('opacity', 1);
    })
    .on('mousemove', (event, d) => {
    tooltip
        .style('left', event.pageX + 10 + 'px')
        .style('top', event.pageY + 'px')
        .html(`
        <div><strong>Country:</strong> ${d.country}</div>
        <div><strong>Year:</strong> ${d.year}</div>
        <div><strong>Threats:</strong> ${d.count}</div>
        `);
    })
    .on('mouseleave', () => {
    tooltip.style('opacity', 0);
    })
    .transition()
    .duration(600)
    .attr('y', d => activeCountries.includes(d.country) ? y(d.count) : y(0))
    .attr('height', d => activeCountries.includes(d.country) ? y(0) - y(d.count) : 0);

    // UPDATE
    allRects
    .on('mouseover', (event, d) => {
    tooltip.style('opacity', 1);
    })
    .on('mousemove', (event, d) => {
    tooltip
        .style('left', event.pageX + 10 + 'px')
        .style('top', event.pageY + 'px')
        .html(`
        <div><strong>Country:</strong> ${d.country}</div>
        <div><strong>Year:</strong> ${d.year}</div>
        <div><strong>Threats:</strong> ${d.count}</div>
        `);
    })
    .on('mouseleave', () => {
    tooltip.style('opacity', 0);
    })
    .transition()
    .duration(600)
    .attr('x', d => x1(d.country))
    .attr('width', x1.bandwidth())
    .attr('fill', d => colorScale(d.country))
    .attr('y', d => activeCountries.includes(d.country) ? y(d.count) : y(0))
    .attr('height', d => activeCountries.includes(d.country) ? y(0) - y(d.count) : 0);

    // EXIT
    allRects.exit()
      .transition().duration(600)
      .attr('height', 0)
      .attr('y', y(0))
      .remove();

    // Title
    svg.selectAll('.chart-title').remove();
    svg.append('text')
      .attr('class', 'chart-title')
      .attr('x', width / 2)
      .attr('y', margin.top / 1.3)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('No. of Threats per Year for each Country');

    // Remove old legend if needed
    svg.selectAll('.legend-group').remove();
    svg.append('g')
      .attr('class', 'legend-group')
      .attr('transform', `translate(${width - margin.right + 20}, ${margin.top})`)
      .call(ChartLegend, {
        colorScale,
        title: 'Country'
      });

  }, [data, activeCountries]);

  // We create checkboxes in the chart itself for toggling activeCountries
  const allCountries = Array.from(new Set(data.map(d => d.country))).sort();

  const handleToggle = (country) => {
    setActiveCountries(prev =>
      prev.includes(country)
        ? prev.filter(c => c !== country)
        : [...prev, country]
    );
  };

  return (
    <div style={{ marginBottom: '40px', textAlign: 'center' }}>
      {/* Checkboxes */}
      <div style={{ marginBottom: '1rem' }}>
      <h5>Country Filter (Click to Hide/Show)</h5>
        {allCountries.map((c) => (
          <label key={c} style={{ marginRight: '15px' }}>
            <input
              type="checkbox"
              checked={activeCountries.includes(c)}
              onChange={() => handleToggle(c)}
            />
            {` ${c}`}
          </label>
        ))}
      </div>

      <svg ref={svgRef}></svg>
      <div ref={tooltipRef}></div>
    </div>
  );
}

export default CountryYearChart;
