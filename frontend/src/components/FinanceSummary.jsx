import { useEffect, useRef, useState } from 'react';
import {
  select,
  arc,
  pie,
  interpolate,
  scaleBand,
  scaleLinear,
  axisLeft,
  axisBottom,
} from 'd3';
import API from '../services/apis';

const FinancialSummary = () => {
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [budget, setBudget] = useState(0);
  const pieRef = useRef();
  const barRef = useRef();
  const month = new Date().toISOString().slice(0, 7);

  const loadSummary = async () => {
    try {
      const res = await API.get('/summary/');
      const income = Number(res.data.income);
      const expense = Number(res.data.expense);
      const balance = income - expense;
      setSummary({ income, expense, balance });
    } catch (err) {
      console.error('Summary fetch error', err);
    }
  };

  const loadBudget = async () => {
    try {
      const res = await API.get(`/budget/?month=${month}`);
      setBudget(Number(res.data.amount));
    } catch (err) {
      console.error('Budget fetch error', err);
    }
  };

  useEffect(() => {
    loadSummary();
    loadBudget();
  }, []);

  // --- PIE CHART ---
  useEffect(() => {
    const data = [
      { label: 'Income', value: summary.income, color: '#3498db' },
      { label: 'Expenses', value: summary.expense, color: '#e74c3c' },
      { label: 'Balance', value: summary.balance, color: '#2ecc71' },
    ];

    const width = 400;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const svg = select(pieRef.current);
    svg.selectAll('*').remove();

    // ✅ Use viewBox for responsiveness
    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const group = svg
      .attr('width', width)
      .attr('height', height)
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
      .attrTween('d', function (d) {
        const i = interpolate({ startAngle: 0, endAngle: 0 }, d);
        return (t) => arcGen(i(t));
      });

    // Percentage + label inside
    arcs
      .append('text')
      .attr('transform', (d) => `translate(${arcGen.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#fff')
      .text((d) => {
        const total = data.reduce((acc, curr) => acc + curr.value, 0);
        const percent = ((d.data.value / total) * 100).toFixed(1);
        return `${d.data.label} (${percent}%)`;
      });
  }, [summary]);

  // --- BAR CHART (Budget vs Expense) ---
  useEffect(() => {
    const data = [
      { label: 'Budget', value: budget, color: '#3498db' },
      { label: 'Expenses', value: summary.expense, color: '#e74c3c' },
    ];

    const width = 500;
    const height = 300;

    const svg = select(barRef.current);
    svg.selectAll('*').remove();

    // ✅ Responsive container
    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    svg.attr('width', width).attr('height', height);

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
      .attr('font-size', '13px')
      .text((d) => `₹${d.value}`);
  }, [budget, summary.expense]);

  return (
    <div className="section">
      {/* Income, Expense, Balance Values */}
      <div className="finance-container">
        <div>
          <h3 className="mb-20">Income vs Expenses vs Balance</h3>

          <svg ref={pieRef}></svg>
        </div>
        {/* Bar Chart */}
        <div>
          <h3 className="mb-20">Monthly Budget vs Expenses</h3>
          <svg ref={barRef}></svg>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;
