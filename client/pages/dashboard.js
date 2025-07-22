"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const fetchTxs = async () => {
      setFetching(true);
      setError("");
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
        setError(e.message);
      } finally {
        setFetching(false);
      }
    };
    fetchTxs();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // Calculate balance
  const balance = transactions.reduce((sum, tx) => {
    if (tx.type === "income") return sum + (tx.amount || 0);
    if (tx.type === "expense") return sum - (tx.amount || 0);
    return sum;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-sm text-gray-700">{user.email}</span>
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Welcome, {user.email}!
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              This is your personal finance dashboard.
            </p>
            {fetching ? (
              <div className="text-gray-500">
                Loading your recent activity...
              </div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <>
                <div className="mb-4">
                  <span className="font-semibold">Current Balance:</span>{" "}
                  <span
                    className={balance >= 0 ? "text-green-600" : "text-red-600"}
                  >
                    Ksh {balance.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Recent Transactions:</span>
                  <ul className="mt-2 divide-y divide-gray-200">
                    {transactions.slice(0, 5).map((tx) => (
                      <li
                        key={tx._id}
                        className="py-2 flex justify-between items-center"
                      >
                        <div>
                          <span className="font-medium">{tx.description}</span>{" "}
                          <span className="text-xs text-gray-500">
                            ({tx.category})
                          </span>
                        </div>
                        <span
                          className={
                            tx.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {tx.type === "income" ? "+" : "-"}Ksh {tx.amount}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
