import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return; // Don't fetch if user is not yet loaded
    const jwt =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!jwt) return;
    fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      }/api/admin/users`,
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load users");
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => setError(err.message));
  }, [user]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        <ul className="divide-y divide-gray-200">
          {users.map((u) => (
            <li key={u._id} className="py-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{u.email}</p>
                <p className="text-sm text-gray-500">Role: {u.role}</p>
              </div>
              <p className="text-sm text-gray-500">
                Joined: {new Date(u.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
