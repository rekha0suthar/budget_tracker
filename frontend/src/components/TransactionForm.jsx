import { useEffect, useState } from 'react';
import { addTransaction, updateTransaction } from '../services/apis';

const TransactionForm = ({ onSuccess, editingTransaction, onClearEdit }) => {
  const [data, setData] = useState({
    title: '',
    amount: '',
    category: 'OTHERS',
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
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, data);
        onClearEdit(); // Exit edit mode
      } else {
        await addTransaction(data);
      }
      onSuccess(); // Refetch transactions
      setData({
        title: '',
        amount: '',
        category: 'OTHERS',
        date: '',
        type: 'EXPENSE',
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Load form values if editing
  useEffect(() => {
    if (editingTransaction) {
      console.log(editingTransaction, 'e');
      setData({ ...editingTransaction });
    } else {
      setData({
        title: '',
        amount: '',
        category: 'OTHERS',
        date: '',
        type: 'EXPENSE',
      });
    }
  }, [editingTransaction]);

  return (
    <div className="container">
      <h2>Add Transaction</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={data.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <input
          name="amount"
          type="number"
          value={data.amount}
          onChange={handleChange}
          placeholder="Amount"
          required
        />
        <input
          name="date"
          type="date"
          value={data.date}
          onChange={handleChange}
          required
        />
        <select name="category" value={data.category} onChange={handleChange}>
          <option value="SALARY">SALARY</option>
          <option value="GROCERY">GROCERY</option>
          <option value="ENTERTAINMENT">ENTERTAINMENT</option>
          <option value="RENT">RENT</option>
          <option value="OTHERS">OTHERS</option>
        </select>
        <select name="type" value={data.type} onChange={handleChange}>
          <option>INCOME</option>
          <option>EXPENSE</option>
        </select>
        <button type="submit">
          {editingTransaction ? 'Update' : 'Add'} Transaction
        </button>
        {editingTransaction && (
          <button onClick={onClearEdit} type="button">
            Cancel Edit
          </button>
        )}
      </form>
    </div>
  );
};

export default TransactionForm;
