import relativeTime from "../utils/relativeTime";

export default function TransactionList({ transactions }) {
  if (!transactions.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 animate-fade-in">
        <img src="/empty.svg" alt="No transactions" className="w-32 mb-2" />
        <div className="text-gray-500">No transactions yet!</div>
      </div>
    );
  }
  return (
    <ul className="grid gap-4 animate-fade-in">
      {transactions.map(tx => (
        <li key={tx._id || tx.id} className={`bg-white/80 rounded-lg shadow-lg p-4 flex flex-col md:flex-row justify-between items-center border-l-4 ${tx.type === 'income' ? 'border-green-500' : 'border-red-500'} hover-scale`}>
          <div className="flex-1">
            <div className="font-semibold text-lg">{tx.description}</div>
            <div className="flex gap-2 items-center mt-1">
              <span className={`px-2 py-1 rounded text-xs ${tx.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{tx.type}</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{tx.category}</span>
              {tx.vendor && <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">{tx.vendor}</span>}
            </div>
          </div>
          <div className="flex flex-col items-end mt-2 md:mt-0">
            <span className={`font-bold text-lg ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{tx.amount ? `Ksh ${tx.amount}` : ''}</span>
            <span className="text-xs text-gray-400 mt-1">{relativeTime(tx.createdAt || tx.timestamp)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
