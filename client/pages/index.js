import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Header from "../components/Header";
import Toast from "../components/Toast";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";

const sampleTransactions = [
  {
    id: '1',
    description: 'Received Ksh 50000 salary payment',
    amount: 50000,
    category: 'Salary',
    vendor: 'Employer',
    type: 'income',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '2',
    description: 'Spent Ksh 1200 at Naivas',
    amount: 1200,
    category: 'Groceries',
    vendor: 'Naivas',
    type: 'expense',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
];

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [typingUser, setTypingUser] = useState(null);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "success" });

  useEffect(() => {
    // Auto-login: fetch user if JWT exists
    const jwt = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
    if (!jwt) {
      window.location.href = "/login";
      return;
    }
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/me`, {
      headers: { Authorization: `Bearer ${jwt}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.email) setUser(data);
        else window.location.href = "/login";
      })
      .catch(() => window.location.href = "/login");
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
      setToast({ message: "Lost connection to server. Attempting to reconnect...", type: "error" });
    });
    socket.on("connect", () => {
      setToast({ message: "Connected to server", type: "success" });
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
      setTransactions(Array.isArray(data) && data.length ? data : sampleTransactions);
    } catch (e) {
      setTransactions(sampleTransactions);
      setToast({ message: e.message || "Failed to fetch transactions", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  function handleLogout() {
    localStorage.removeItem("jwt");
    window.location.href = "/login";
  }

  return (
    <>
      <Header user={user} onLogout={handleLogout} />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, message: "" })} />
      <div className="min-h-screen bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 flex flex-col items-center p-6 animate-fade-in">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          <div className="col-span-1">
            <TransactionForm onAdd={tx => setTransactions([tx, ...transactions])} jwt={typeof window !== "undefined" ? localStorage.getItem("jwt") : null} showToast={(msg, type) => setToast({ message: msg, type })} />
            {typingUser && <div className="mb-2 text-sm text-blue-100">{typingUser} is typing...</div>}
          </div>
          <div className="col-span-2">
            {loading ? <div className="text-white">Loading...</div> : <TransactionList transactions={transactions} />}
          </div>
        </div>
      </div>
    </>
  );
}
