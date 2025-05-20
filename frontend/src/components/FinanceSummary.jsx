import { useEffect, useState } from 'react';
import API, { fetchSummary } from '../services/apis';
import PieChartSummary from './PieChartSummary';
import BarChartBudget from './BarChartBudget';
import BudgetForm from './BudgetForm';

const FinancialSummary = ({ reloadTransactions }) => {
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
    <div className="mb-30">
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <div className="spinner"></div>
          <p>Loading charts...</p>
        </div>
      ) : (
        <div className="bento-grid">
          <div className="bento-card">
            <h3>Income vs Expenses vs Balance</h3>
            {summary &&
            (summary.income || summary.expense || summary.balance) ? (
              <PieChartSummary summary={summary} />
            ) : (
              <p className="chart-msg">No data added</p>
            )}
          </div>

          <div className="bento-card">
            <h3>Monthly Budget vs Expenses</h3>
            {budget || (summary && summary.expense) ? (
              <BarChartBudget budget={budget} expense={summary.expense} />
            ) : (
              <p className="chart-msg">No data added</p>
            )}
          </div>

          <div className="bento-card">
            <h3>Set Your Monthly Budget</h3>
            <BudgetForm onSuccess={reloadTransactions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialSummary;
