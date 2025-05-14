import { useEffect, useRef, useState } from 'react';
import { fetchBudget, fetchTransactions, updateBudget } from '../services/apis';
import { select, scaleBand, scaleLinear, axisLeft, axisBottom } from 'd3';

const BudgetOverview = () => {
  const [month, setMonth] = useState(() =>
    new Date().toISOString().slice(0, 7)
  );
  const [budget, setBudget] = useState(0);
  const [expense, setExpense] = useState(0);
  const svgRef = useRef();

  // Fetch current budget
  const getBudget = async () => {
    try {
      const res = await fetchBudget(month);
      setBudget(Number(res?.amount) || 0);
    } catch (error) {
      console.error('Failed to fetch budget', error);
      setBudget(0);
    }
  };

  // Fetch monthly expenses
  const fetchExpense = async () => {
    try {
      const res = await fetchTransactions();
      console.log(res);
      const monthlyExpenses = res.results.filter(
        (item) => item.type === 'EXPENSE' && item.date.startsWith(month)
      );

      const total = monthlyExpenses.reduce(
        (sum, t) => sum + Number(t.amount),
        0
      );
      setExpense(total);
    } catch (error) {
      console.error('Failed to fetch expenses', error);
      setExpense(0);
    }
  };

  // Save budget
  const handleUpdateBudget = async (e) => {
    e.preventDefault();
    if (!budget || isNaN(Number(budget))) return alert('Enter valid amount');
    try {
      await updateBudget(month, { month, amount: Number(budget) });
      alert('Budget updated');
    } catch (err) {
      console.error('Failed to update budget', err);
    }
  };

  // Fetch data on month change
  useEffect(() => {
    getBudget();
    fetchExpense();
  }, [month]);

  // Draw D3 bar chart
  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll('*').remove();

    const data = [
      { label: 'Budget', value: Number(budget) || 0 },
      { label: 'Expenses', value: Number(expense) || 0 },
    ];

    const width = 400;
    const height = 250;
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };

    svg.attr('width', width).attr('height', height);

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const chart = svg
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

    chart.append('g').call(
      axisLeft(y)
        .ticks(5)
        .tickFormat((d) => `₹${d}`)
    );

    chart
      .append('g')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(axisBottom(x));

    chart
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.label))
      .attr('y', (d) => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', (d) => chartHeight - y(d.value))
      .attr('fill', (d) => (d.label === 'Expenses' ? '#e74c3c' : '#3498db'));

    chart
      .selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('x', (d) => x(d.label) + x.bandwidth() / 2)
      .attr('y', (d) => y(d.value) - 8)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('fill', '#333')
      .text((d) => `₹${d.value}`);
  }, [budget, expense]);

  return (
    <div className="chart-container">
      {/* Budget Form */}
      <h3>Set Monthly Budget</h3>
      <form
        onSubmit={handleUpdateBudget}
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '15px',
          alignItems: 'center',
        }}
      >
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        <input
          type="number"
          placeholder="Set budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        <button type="submit">Save</button>
      </form>

      {/* Chart */}
      <h3 style={{ marginBottom: '20px' }}>Monthly Budget Overview</h3>

      <svg ref={svgRef}></svg>
    </div>
  );
};

export default BudgetOverview;
