import { useEffect, useRef } from 'react';
import { select, scaleBand, scaleLinear, axisLeft, axisBottom } from 'd3';

const BarChartBudget = ({ budget, expense }) => {
  const barRef = useRef();

  useEffect(() => {
    const data = [
      { label: 'Budget', value: budget, color: '#3498db' },
      { label: 'Expenses', value: expense, color: '#e74c3c' },
    ];

    const width = 600;
    const height = 600;
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };

    const svg = select(barRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, chartWidth])
      .padding(0.3);

    const y = scaleLinear()
      .domain([0, Math.max(...data.map((d) => d.value), 100)])
      .nice()
      .range([chartHeight, 0]);

    g.append('g').call(
      axisLeft(y)
        .ticks(5)
        .tickFormat((d) => `₹${d}`)
    );

    g.append('g')
      .call(
        axisLeft(y)
          .ticks(5)
          .tickFormat((d) => `₹${d}`)
      )
      .selectAll('text')
      .style('font-size', '14px'); //  Increase font size

    g.append('g')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(axisBottom(x));

    g.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.label))
      .attr('y', (d) => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', (d) => chartHeight - y(d.value))
      .attr('fill', (d) => d.color);

    g.selectAll('text.bar-label')
      .data(data)
      .enter()
      .append('text')
      .attr('x', (d) => x(d.label) + x.bandwidth() / 2)
      .attr('y', (d) => y(d.value) - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', '#333')
      .attr('font-size', '14px') // Bigger font
      .attr('font-weight', '600') // Bold
      .text((d) => `₹${d.value}`);
  }, [budget, expense]);

  return <svg ref={barRef}></svg>;
};

export default BarChartBudget;
