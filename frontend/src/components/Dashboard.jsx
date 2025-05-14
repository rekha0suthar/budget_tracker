import { useState } from 'react';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import BudgetOverview from './BudgetOverview';
import FinancialSummary from './FinanceSummary';

export default function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editTxn, setEditTxn] = useState(null);

  const reloadTransactions = () => setRefreshKey((prev) => prev + 1);

  return (
    <>
      <div className="navbar">Personal Budget Tracker</div>

      <div className="dashboard-container">
        <FinancialSummary />

        {/* <div className="section">
          <BudgetOverview />
        </div> */}

        <div className="dashboard-body">
          <div className="dashboard-left section">
            <TransactionList
              key={refreshKey}
              onEdit={(txn) => setEditTxn(txn)}
            />
          </div>

          <div className="dashboard-right">
            <TransactionForm
              editingTransaction={editTxn}
              onClearEdit={() => setEditTxn(null)}
              onSuccess={reloadTransactions}
            />

            <BudgetOverview />
          </div>
        </div>
      </div>
    </>
  );
}
