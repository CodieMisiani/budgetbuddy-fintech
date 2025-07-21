import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"));
  }, []);

  useEffect(() => {
    if (!socket) return;
    fetchTxs();
    socket.on("new_transaction", (tx) => {
      setTransactions((prev) => [tx, ...prev]);
    });
    return () => socket.off("new_transaction");
    // eslint-disable-next-line
  }, [socket]);

  const fetchTxs = async () => {
    setLoading(true);
    const res = await axios.get((process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/transactions");
    setTransactions(res.data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await axios.post((process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/transactions", { text: input });
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-2">BudgetBuddy</h1>
      <p className="mb-6 text-gray-600">BudgetBuddy helps you stay on top of your expenses in real-time with a smart AI-powered assistant.</p>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g. Spent Ksh 500 at Naivas"
          className="p-2 border rounded w-72"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </form>
      <div className="w-full max-w-xl">
        {loading ? <div>Loading...</div> : (
          <ul>
            {transactions.map(tx => (
              <li key={tx._id} className="bg-white p-4 mb-2 rounded shadow flex justify-between items-center">
                <div>
                  <div className="font-medium">{tx.text}</div>
                  <div className="text-xs text-gray-500">{tx.category} | {tx.vendor} | {tx.amount ? `Ksh ${tx.amount}` : ''}</div>
                </div>
                <div className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
