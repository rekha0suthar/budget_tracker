import { useEffect, useState } from 'react';
import { fetchTransactions, deleteTransaction } from '../services/apis';
import { FiEdit, FiTrash, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function TransactionList({ onEdit, onSuccess }) {
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
    const normalizedFilters = {
      ...filters,
      category: filters.category?.toUpperCase() || '',
    };

    const res = await fetchTransactions(p, normalizedFilters);
    setTransactions(res.results);
    setPage(p);
    setTotalPages(Math.ceil(res.count / 5));
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this transaction?'
    );
    if (confirmDelete) {
      await deleteTransaction(id);
      await loadTransactions(page);
      onSuccess?.(); // optional callback if defined
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    loadTransactions(1);
  };

  const handleReset = () => {
    setFilters({
      start_date: '',
      end_date: '',
      category: '',
      min_amount: '',
      max_amount: '',
    });
    loadTransactions(1);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <div className="table-wrapper">
      <h2>Transactions</h2>

      {/* Filter Form */}
      <div className="transaction-filter-group">
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
        <button className="margin" onClick={handleApplyFilters}>
          Apply
        </button>
        <button className="margin" onClick={handleReset}>
          Reset
        </button>
      </div>

      {/* Transactions Table */}
      <div className="table-scroll">
        <table className="transaction-table">
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
            {transactions.length > 0 &&
              transactions.map((txn) => (
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
            {transactions.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: 'center',
                    padding: '20px',
                    color: '#888',
                  }}
                >
                  No transactions are added
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {transactions.length > 0 && (
        <div className="pagination-buttons">
          <button
            onClick={() => loadTransactions(page - 1)}
            disabled={page <= 1}
            title="Previous Page"
            className="pag-btn"
          >
            <FiChevronLeft size={24} />
          </button>
          <p>
            Page {page} of {totalPages}
          </p>
          <button
            onClick={() => loadTransactions(page + 1)}
            disabled={page >= totalPages}
            className="pag-btn"
            title="Next Page"
          >
            <FiChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
