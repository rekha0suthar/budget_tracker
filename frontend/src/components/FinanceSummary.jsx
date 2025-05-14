import { useEffect, useState } from 'react';
import API from '../services/apis';

export default function FinancialSummary() {
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });

  const loadSummary = async () => {
    try {
      const res = await API.get('/summary/');
      setSummary(res.data);
    } catch (err) {
      console.error('Summary fetch error', err);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  return (
    <div className="section" style={{ marginBottom: '30px' }}>
      <h2>Financial Summary</h2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '18px',
        }}
      >
        <div>
          <strong>Total Income:</strong> ₹{summary.income}
        </div>
        <div>
          <strong>Total Expenses:</strong> ₹{summary.expense}
        </div>
        <div>
          <strong>Balance:</strong> ₹{summary.balance}
        </div>
      </div>
    </div>
  );
}
