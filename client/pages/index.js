import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [typingUser, setTypingUser] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Auto-login: fetch user if JWT exists
    const jwt = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
    if (jwt) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/me`, {
        headers: { Authorization: `Bearer ${jwt}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.email) setUser(data);
        })
        .catch(() => setUser(null));
    }
    // Persistent socket connection with reconnection logic
    const s = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });
    setSocket(s);
    return () => s.disconnect();
  }, []);

  useEffect(() => {
    if (!socket) return;
    fetchTxs();
    socket.on("new_transaction", (tx) => {
      setTransactions((prev) => [tx, ...prev]);
    });
    socket.on("user:typing", ({ user }) => {
      setTypingUser(user || "Someone");
      setTimeout(() => setTypingUser(null), 2000);
    });
    socket.on("disconnect", () => {
      setError("Lost connection to server. Attempting to reconnect...");
    });
    socket.on("connect", () => {
      setError("");
    });
    return () => {
      socket.off("new_transaction");
      socket.off("user:typing");
      socket.off("disconnect");
      socket.off("connect");
    };
    // eslint-disable-next-line
  }, [socket]);

  const fetchTxs = async function fetchTxs() {
    setLoading(true);
    try {
      const jwt = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/transactions`, {
        headers: jwt ? { Authorization: `Bearer ${jwt}` } : {}
      });
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      // If user is logged in, filter transactions by user (if backend supports it)
      setTransactions(Array.isArray(data) ? data : []);
      setError("");
    } catch (e) {
      setTransactions([]);
      setError(e.message || "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    // Very basic parse: expects 'Spent Ksh <amount> at <vendor>'
    const match = input.match(/spent\s*ksh\s*(\d+)\s*at\s*(.+)/i);
    let amount = 0, vendor = '', description = input, date = new Date().toISOString().slice(0,10);
    if (match) {
      amount = parseInt(match[1], 10);
      vendor = match[2];
      description = input;
    }
    await axios.post((process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/transactions", {
      amount,
      date,
      description,
      vendor
    });
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-2">BudgetBuddy</h1>
      <p className="mb-6 text-gray-600">BudgetBuddy helps you stay on top of your expenses in real-time with a smart AI-powered assistant.</p>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          value={input}
          onChange={e => {
            setInput(e.target.value);
            if (socket) socket.emit("user:typing", { user: "Someone" });
          }}
          placeholder="e.g. Spent Ksh 500 at Naivas"
          className="p-2 border rounded w-72"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </form>
      {typingUser && <div className="mb-2 text-sm text-blue-600">{typingUser} is typing...</div>}
      <div className="w-full max-w-xl">
        {loading ? <div>Loading...</div> : (
          <ul>
            {transactions.map(tx => (
              <li key={tx._id} className="bg-white p-4 mb-2 rounded shadow flex justify-between items-center">
                <div>
                  <div className="font-medium">{tx.description}</div>
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
