import { useEffect, useState } from 'react';
import API, { fetchSummary } from '../services/apis';
import PieChartSummary from './PieChartSummary';
import BarChartBudget from './BarChartBudget';

const FinancialSummary = () => {
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [budget, setBudget] = useState(0);
  const [loading, setLoading] = useState(true);

  const month = new Date().toISOString().slice(0, 7);

  const loadSummary = async () => {
    try {
      const res = await fetchSummary();
      const income = Number(res.income);
      const expense = Number(res.expense);
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
    setLoading(true);
    Promise.all([loadSummary(), loadBudget()]).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-2">
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <div className="spinner"></div>
          <p>Loading charts...</p>
        </div>
      ) : (
        <div className="bento-grid">
          <div className="bento-card">
            <h3>Income vs Expenses vs Balance</h3>
            <PieChartSummary summary={summary} />
          </div>
          <div className="bento-card">
            <h3>Monthly Budget vs Expenses</h3>
            <BarChartBudget budget={budget} expense={summary.expense} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialSummary;
