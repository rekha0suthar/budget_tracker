import { useState } from 'react';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import BudgetForm from './BudgetForm';
import FinancialSummary from './FinanceSummary';

export default function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editTxn, setEditTxn] = useState(null);

  const reloadTransactions = () => setRefreshKey((prev) => prev + 1);

  return (
    <div className="dashboard-container">
      <div className="bento-grid">
        <FinancialSummary
          key={refreshKey}
          reloadTransactions={reloadTransactions}
        />
      </div>

      <div className="dashboard-body">
        <div className="dashboard-left section">
          <TransactionList
            key={refreshKey}
            onEdit={(txn) => setEditTxn(txn)}
            onSuccess={reloadTransactions}
          />
        </div>

        <div className="dashboard-right">
          <TransactionForm
            editingTransaction={editTxn}
            onClearEdit={() => setEditTxn(null)}
            onSuccess={reloadTransactions}
          />
        </div>
      </div>
    </div>
  );
}
