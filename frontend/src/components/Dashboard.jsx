import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';

export default function Dashboard() {
  return (
    <div className="p-4">
      <TransactionForm onSuccess={() => window.location.reload()} />
      <TransactionList />
    </div>
  );
}
