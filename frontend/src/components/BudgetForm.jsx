import { useEffect, useState } from 'react';
import { fetchBudget, updateBudget } from '../services/apis';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const BudgetForm = ({ onSuccess }) => {
  const [month, setMonth] = useState(() =>
    new Date().toISOString().slice(0, 7)
  );
  const [budget, setBudget] = useState(0);

  useEffect(() => {
    fetchBudget(month)
      .then((res) => setBudget(Number(res?.amount || 0)))
      .catch((err) => {
        console.error('Failed to fetch budget', err);
        setBudget(0);
      });
  }, [month]);

  const handleUpdateBudget = async (e) => {
    e.preventDefault();
    if (!budget || isNaN(Number(budget))) return alert('Enter a valid amount');
    try {
      await updateBudget(month, { month, amount: Number(budget) });
      alert('✅ Budget updated');
      onSuccess?.();
    } catch (err) {
      console.error('Failed to update budget', err);
    }
  };

  return (
    <div className="section">
      <h3 style={{ marginBottom: '20px' }}>Set Monthly Budget</h3>
      <p className="budget-note">
        Selected Month: <strong>{months[new Date(month).getMonth()]}</strong>{' '}
        Budget — ₹{budget}
      </p>
      <form onSubmit={handleUpdateBudget} className="budget-form">
        <div className="form-group">
          <label htmlFor="month">Month</label>
          <input
            id="month"
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="budget">Amount (₹)</label>
          <input
            id="budget"
            type="number"
            placeholder="Enter budget amount"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary">
          Save Budget
        </button>
      </form>
    </div>
  );
};

export default BudgetForm;
