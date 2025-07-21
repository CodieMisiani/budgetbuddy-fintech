import { useEffect, useState } from "react";
import Toast from "../../components/Toast";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [toast, setToast] = useState({ message: "", type: "success" });
  useEffect(() => {
    const jwt = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
    if (!jwt) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/users`, {
      headers: { Authorization: `Bearer ${jwt}` }
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => setToast({ message: "Failed to load users", type: "error" }));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, message: "" })} />
      <div className="bg-white/80 rounded-lg shadow-lg p-8 mt-12 w-full max-w-2xl animate-fade-in">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h2>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Premium</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b">
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.premium ? '✅' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
