import { useEffect, useState } from 'react';
import { fetchTransactions, deleteTransaction } from '../services/api';

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);

  const loadTransactions = async () => {
    const data = await fetchTransactions();
    setTransactions(data);
  };

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    loadTransactions();
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Transactions</h2>
      <ul className="space-y-2">
        {transactions.map((txn) => (
          <li
            key={txn.id}
            className="p-4 border shadow rounded flex justify-between items-center"
          >
            <div>
              <strong>{txn.title}</strong> — ₹{txn.amount} ({txn.category}) [
              {txn.type}]
              <br />
              <small>{txn.date}</small>
            </div>
            <button
              onClick={() => handleDelete(txn.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
