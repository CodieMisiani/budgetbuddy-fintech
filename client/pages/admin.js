import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // For demo: get token from localStorage or prompt
    let t = localStorage.getItem("jwt");
    if (!t) t = prompt("Enter admin JWT token:");
    setToken(t);
    if (t) fetchUsers(t);
  }, []);

  async function fetchUsers(jwt) {
    try {
      const res = await axios.get("/api/users", {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      setUsers(res.data);
      setError("");
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  }

  async function promote(id, role) {
    try {
      await axios.patch(`/api/users/${id}`, { role }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers(token);
    } catch (e) { alert(e.response?.data?.error || e.message); }
  }

  async function remove(id) {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers(token);
    } catch (e) { alert(e.response?.data?.error || e.message); }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin: User Management</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Created</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id} className="border">
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.role}</td>
              <td className="p-2 border">{new Date(u.createdAt).toLocaleString()}</td>
              <td className="p-2 border">
                {u.role !== "admin" && <button className="bg-blue-500 text-white px-2 py-1 mr-2" onClick={() => promote(u._id, "admin")}>Promote</button>}
                {u.role !== "user" && <button className="bg-yellow-500 text-white px-2 py-1 mr-2" onClick={() => promote(u._id, "user")}>Demote</button>}
                <button className="bg-red-500 text-white px-2 py-1" onClick={() => remove(u._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
