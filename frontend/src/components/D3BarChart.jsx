import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const D3BarChart = ({ data, xKey, yKey, groupKey, title }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data.length) return;

    // Clear previous chart
    d3.select(ref.current).selectAll("*").remove();

    // Set dimensions
    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 50, left: 60 };

    // SVG container
    const svg = d3.select(ref.current)
      .attr("width", width)
      .attr("height", height);

    const x0 = d3.scaleBand()
      .domain([...new Set(data.map(d => d[xKey]))])
      .range([margin.left, width - margin.right])
      .paddingInner(0.1);

    const groups = [...new Set(data.map(d => d[groupKey]))];
    const x1 = d3.scaleBand()
      .domain(groups)
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[yKey])])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
      .domain(groups)
      .range(d3.schemeSet2);

    // Axes
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x0));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Bars
    svg.append("g")
      .selectAll("g")
      .data(d3.group(data, d => d[xKey]))
      .join("g")
      .attr("transform", d => `translate(${x0(d[0])},0)`)
      .selectAll("rect")
      .data(d => d[1])
      .join("rect")
      .attr("x", d => x1(d[groupKey]))
      .attr("y", d => y(d[yKey]))
      .attr("width", x1.bandwidth())
      .attr("height", d => y(0) - y(d[yKey]))
      .attr("fill", d => color(d[groupKey]));

    // Title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text(title);

  }, [data, xKey, yKey, groupKey, title]);

  return <svg ref={ref}></svg>;
};

export default D3BarChart;
