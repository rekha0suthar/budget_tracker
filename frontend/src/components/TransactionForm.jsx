import { useState } from 'react';
import { addTransaction } from '../services/apis';

const TransactionForm = () => {
  const [data, setData] = useState({
    title: '',
    amount: '',
    category: 'OTHER',
    date: '',
    type: 'EXPENSE',
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addTransaction(data);
    // onSuccess()
    setData({
      title: '',
      amount: '',
      category: 'OTHER',
      date: '',
      type: 'EXPENSE',
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 p-4 border shadow rounded bg-white max-w-md mx-auto mt-5"
    >
      <h2 className="text-lg font-bold">Add Transaction</h2>
      <input
        name="title"
        value={data.title}
        onChange={handleChange}
        placeholder="Title"
        required
        className="w-full border p-2"
      />
      <input
        name="amount"
        type="number"
        value={data.amount}
        onChange={handleChange}
        placeholder="Amount"
        required
        className="w-full border p-2"
      />
      <input
        name="date"
        type="date"
        value={data.date}
        onChange={handleChange}
        required
        className="w-full border p-2"
      />
      <select
        name="category"
        value={data.category}
        onChange={handleChange}
        className="w-full border p-2"
      >
        <option>SALARY</option>
        <option>GROCERIES</option>
        <option>ENTERTAINMENT</option>
        <option>RENT</option>
        <option>OTHER</option>
      </select>
      <select
        name="type"
        value={data.type}
        onChange={handleChange}
        className="w-full border p-2"
      >
        <option>INCOME</option>
        <option>EXPENSE</option>
      </select>
      <button
        type="submit"
        className="bg-blue-500 text-white w-full py-2 rounded"
      >
        Add
      </button>
    </form>
  );
};
