import { useEffect, useState } from 'react';
import { fetchTransactions, deleteTransaction } from '../services/apis';
import { FiEdit, FiTrash, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function TransactionList({ onEdit }) {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    category: '',
    min_amount: '',
    max_amount: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadTransactions = async (p = 1) => {
    const res = await fetchTransactions(p, filters);
    setTransactions(res.results);
    setPage(p);
    setTotalPages(Math.ceil(res.count / 3)); // match PAGE_SIZE
  };

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    loadTransactions(page);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    loadTransactions(1);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <div>
      <h2>Transactions</h2>

      {/* Filter Form */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          name="start_date"
          type="date"
          value={filters.start_date}
          onChange={handleFilterChange}
        />
        <input
          name="end_date"
          type="date"
          value={filters.end_date}
          onChange={handleFilterChange}
        />
        <input
          name="category"
          placeholder="Category"
          value={filters.category}
          onChange={handleFilterChange}
        />
        <input
          name="min_amount"
          type="number"
          placeholder="Min ₹"
          value={filters.min_amount}
          onChange={handleFilterChange}
        />
        <input
          name="max_amount"
          type="number"
          placeholder="Max ₹"
          value={filters.max_amount}
          onChange={handleFilterChange}
        />
        <button onClick={handleApplyFilters}>Apply</button>
      </div>

      {/* Transactions Table */}
      <table
        className="transaction-table"
        style={{ width: '100%', borderCollapse: 'collapse' }}
      >
        <thead>
          <tr style={{ background: '#f2f2f2' }}>
            <th>Title</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Category</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn.id}>
              <td>{txn.title}</td>
              <td>₹{txn.amount}</td>
              <td>{txn.type}</td>
              <td>{txn.category}</td>
              <td>{txn.date}</td>
              <td>
                <FiEdit
                  onClick={() => onEdit(txn)}
                  style={{ cursor: 'pointer', marginRight: '10px' }}
                  title="Edit"
                />
                <FiTrash
                  onClick={() => handleDelete(txn.id)}
                  style={{ cursor: 'pointer', color: 'red' }}
                  title="Delete"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '20px',
        }}
      >
        <button
          onClick={() => loadTransactions(page - 1)}
          disabled={page <= 1}
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: 'black',
            width: 'auto',
          }}
          title="Previous Page"
        >
          <FiChevronLeft size={24} />
        </button>
        <p>
          Page {page} of {totalPages}
        </p>
        <button
          onClick={() => loadTransactions(page + 1)}
          disabled={page >= totalPages}
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: 'black',
            width: 'auto',
          }}
          title="Next Page"
        >
          <FiChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
