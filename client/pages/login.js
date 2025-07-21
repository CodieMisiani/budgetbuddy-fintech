import { useState } from "react";
import { useRouter } from "next/router";
import Toast from "../components/Toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("jwt", data.token);
        setToast({ message: "Login successful!", type: "success" });
        setTimeout(() => router.push("/"), 1000);
      } else {
        setToast({ message: data.message || "Login failed", type: "error" });
      }
    } catch {
      setToast({ message: "Login failed", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, message: "" })} />
      <form onSubmit={handleLogin} className="bg-white/80 rounded-lg shadow-lg p-8 flex flex-col gap-4 w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-bold mb-2 text-center">Login</h2>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="p-3 border rounded w-full" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="p-3 border rounded w-full" required />
        <button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-2 rounded shadow hover-scale disabled:opacity-50" disabled={loading}>{loading ? "..." : "Login"}</button>
        <a href="/signup" className="text-blue-600 text-sm text-center underline">Don't have an account? Sign up</a>
      </form>
    </div>
  );
}
