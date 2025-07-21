import { useState, useEffect } from "react";
import Toast from "../components/Toast";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "success" });

  useEffect(() => {
    const jwt = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
    if (!jwt) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/me`, {
      headers: { Authorization: `Bearer ${jwt}` }
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(() => setToast({ message: "Failed to load profile", type: "error" }));
  }, []);

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, message: "" })} />
      <div className="bg-white/80 rounded-lg shadow-lg p-8 flex flex-col gap-4 w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-bold mb-2 text-center">Profile</h2>
        <div className="text-lg"><b>Email:</b> {user.email}</div>
        <div className="text-lg"><b>Role:</b> {user.role}</div>
        <div className="text-lg"><b>Premium:</b> {user.premium ? '✅' : '❌'}</div>
      </div>
    </div>
  );
}
