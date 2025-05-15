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

  // Save budget
  const handleUpdateBudget = async (e) => {
    e.preventDefault();
    if (!budget || isNaN(Number(budget))) return alert('Enter valid amount');
    try {
      await updateBudget(month, { month, amount: Number(budget) });
      alert('Budget updated');
      onSuccess();
    } catch (err) {
      console.error('Failed to update budget', err);
    }
  };

  useEffect(() => {
    getBudget();
  }, [month]);

  return (
    <div className="section flex-1">
      <h3>Set Monthly Budget</h3>
      <form onSubmit={handleUpdateBudget}>
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
      <p className="budget">
        {months[new Date(month).getMonth()]} month's budget: ₹{budget}
      </p>
    </div>
  );
};

export default BudgetForm;
