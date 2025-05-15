import { useEffect, useRef } from 'react';
import { select, arc, pie, interpolate } from 'd3';

const PieChartSummary = ({ summary }) => {
  const pieRef = useRef();

  useEffect(() => {
    const rawData = [
      { label: 'Income', value: summary.income },
      { label: 'Expenses', value: summary.expense },
      { label: 'Balance', value: summary.balance },
    ];

    const colorPalette = ['#3498db', '#e74c3c', '#2ecc71'];

    const data = rawData
      .filter((d) => d.value > 0)
      .map((d, i) => ({ ...d, color: colorPalette[i % colorPalette.length] }));

    if (data.length === 0) return;

    const width = 350;
    const height = 200;
    const radius = Math.min(width, height) / 2;
    const total = data.reduce((acc, d) => acc + d.value, 0);

    const svg = select(pieRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const group = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const pieGen = pie()
      .value((d) => d.value)
      .sort(null);
    const arcGen = arc().innerRadius(50).outerRadius(radius);

    const arcs = group.selectAll('arc').data(pieGen(data)).enter().append('g');

    arcs
      .append('path')
      .attr('d', arcGen)
      .attr('fill', (d) => d.data.color)
      .transition()
      .duration(800)
      .attrTween('d', (d) => {
        const i = interpolate({ startAngle: 0, endAngle: 0 }, d);
        return (t) => arcGen(i(t));
      });

    arcs
      .append('text')
      .attr('transform', (d) => `translate(${arcGen.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text((d) => {
        const percent = ((d.data.value / total) * 100).toFixed(1);
        return `${d.data.label} (₹${d.data.value}, ${percent}%)`;
      });
  }, [summary]);

  return <svg ref={pieRef}></svg>;
};

export default PieChartSummary;
