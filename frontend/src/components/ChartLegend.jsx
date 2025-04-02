import * as d3 from 'd3';

export default function ChartLegend(selection, props) {
  const { colorScale, title } = props;
  const size = 15;
  const spacing = 20;

  const groups = colorScale.domain();

  const legendG = selection.selectAll('g.legend').data([null]).join('g').attr('class', 'legend');

  // Title
  legendG.selectAll('text.legend-title')
    .data([null])
    .join('text')
    .attr('class', 'legend-title')
    .attr('x', 0)
    .attr('y', 0)
    .style('font-size', '14px')
    .style('font-weight', 'bold')
    .text(title);

  // One 'g' per country
  const item = legendG.selectAll('g.legend-item')
    .data(groups)
    .join('g')
    .attr('class', 'legend-item')
    .attr('transform', (d, i) => `translate(0, ${(i + 1) * spacing})`);

  // Rect color swatch
  item.selectAll('rect')
    .data(d => [d])
    .join('rect')
    .attr('x', 0)
    .attr('width', size)
    .attr('height', size)
    .attr('fill', d => colorScale(d));

  // Text label
  item.selectAll('text')
    .data(d => [d])
    .join('text')
    .attr('x', size + 5)
    .attr('y', size - 3)
    .style('font-size', '12px')
    .text(d => d);
}
