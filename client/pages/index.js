import { useAuth } from "../src/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import TransactionForm from "../src/components/TransactionForm";
import TransactionList from "../src/components/TransactionList";
import Toast from "../src/components/Toast"; // Keep for transaction feedback

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "success" });

  // Handle client-side redirects
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Initialize Socket.IO only on client side
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const s = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
    setSocket(s);
    
    return () => {
      if (s) s.disconnect();
    };
  }, []);

  // Fetch transactions when socket is ready
  useEffect(() => {
    if (!socket) return;
    
    const fetchTxs = async () => {
      try {
        setTransactionsLoading(true);
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) return;
        
        const res = await fetch('/api/transactions', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setTransactions(data);
        }
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        setToast({
          message: 'Failed to load transactions. Please try again.',
          type: 'error'
        });
      } finally {
        setTransactionsLoading(false);
      }
    };
    
    fetchTxs();
    
    // Set up socket listeners
    const handleNewTransaction = (tx) => {
      setTransactions((prev) =>
        prev.find((t) => t._id === tx._id) ? prev : [tx, ...prev]
      );
    };
    
    socket.on('transaction', handleNewTransaction);
    
    return () => {
      if (socket) {
        socket.off('transaction', handleNewTransaction);
      }
    };
  }, [socket]);

  // Show loading state on server or while checking auth
  if (typeof window === 'undefined' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    router.push('/login');
    return null;
  }

  useEffect(() => {
    const s = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
    setSocket(s);
    return () => s.disconnect();
  }, []);

  useEffect(() => {
    if (!socket) return;
    fetchTxs();

    const handleNewTransaction = (tx) => {
      setTransactions((prev) =>
        prev.find((t) => t._id === tx._id) ? prev : [tx, ...prev]
      );
    };

    const handleUpdateTransaction = (updatedTx) => {
      setTransactions((prev) =>
        prev.map((tx) => (tx._id === updatedTx._id ? updatedTx : tx))
      );
    };

    const handleDeleteTransaction = (deletedTx) => {
      setTransactions((prev) => prev.filter((tx) => tx._id !== deletedTx._id));
    };

    socket.on("transaction:new", handleNewTransaction);
    socket.on("transaction:updated", handleUpdateTransaction);
    socket.on("transaction:deleted", handleDeleteTransaction);

    socket.on("disconnect", () => {
      setToast({
        message: "Lost connection to server. Attempting to reconnect...",
        type: "error",
      });
    });
    socket.on("connect", () => {
      setToast({ message: "Connected to server", type: "success" });
    });

    return () => {
      socket.off("transaction:new", handleNewTransaction);
      socket.off("transaction:updated", handleUpdateTransaction);
      socket.off("transaction:deleted", handleDeleteTransaction);
      socket.off("disconnect");
      socket.off("connect");
    };
  }, [socket]);

  const fetchTxs = async () => {
    setTransactionsLoading(true);
    try {
      const jwt =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        }/api/transactions`,
        {
          headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
        }
      );
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (e) {
      setToast({ message: e.message, type: "error" });
    } finally {
      setTransactionsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, message: "" })}
      />
      <div className="container mx-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="text-right">
            <p className="text-lg">Welcome, {user.username || user.email}</p>
            <p className="text-sm text-gray-400">Manage your finances</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1">
            <TransactionForm
              jwt={
                typeof window !== "undefined"
                  ? localStorage.getItem("token")
                  : null
              }
              onAdd={(newTx) => {
                setTransactions((prev) => [newTx, ...prev]);
                setToast({ message: "Transaction added!", type: "success" });
              }}
              showToast={(message, type) => setToast({ message, type })}
            />
          </div>
          <div className="col-span-2">
            {transactionsLoading ? (
              <div className="text-white">Loading transactions...</div>
            ) : (
              <TransactionList transactions={transactions} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
