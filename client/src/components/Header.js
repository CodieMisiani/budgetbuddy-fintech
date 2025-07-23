import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Header({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  return (
    <header className="bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 backdrop-blur shadow-lg p-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-white flex items-center gap-1">
          <span className="inline-block animate-fade-in">✨</span> BudgetBuddy
        </span>
      </div>
      <nav className="hidden md:flex gap-6 items-center">
        <Link href="/" className="text-white hover:underline transition">Dashboard</Link>
        <Link href="/pricing" className="text-white hover:underline transition">Pricing</Link>
        {user && <Link href="/profile" className="text-white hover:underline transition">Profile</Link>}
        {user && user.role === 'admin' && <Link href="/admin" className="text-white hover:underline transition">Admin</Link>}
        {user ? (
          <button onClick={onLogout} className="bg-white/20 px-4 py-2 rounded text-white hover:bg-white/30">Logout</button>
        ) : (
          <>
            <Link href="/login" className="bg-white/20 px-4 py-2 rounded text-white hover:bg-white/30">Login</Link>
            <Link href="/signup" className="bg-white/20 px-4 py-2 rounded text-white hover:bg-white/30">Sign Up</Link>
          </>
        )}
      </nav>
      <button className="md:hidden text-white" onClick={() => setMenuOpen(v => !v)}>
        <span className="material-icons">menu</span>
      </button>
      {menuOpen && (
        <div className="absolute right-4 top-16 bg-white/80 rounded shadow-lg p-4 flex flex-col gap-4 animate-fade-in">
          <Link href="/" className="text-blue-800" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <Link href="/pricing" className="text-blue-800" onClick={() => setMenuOpen(false)}>Pricing</Link>
          {user && <Link href="/profile" className="text-blue-800" onClick={() => setMenuOpen(false)}>Profile</Link>}
          {user && user.role === 'admin' && <Link href="/admin" className="text-blue-800" onClick={() => setMenuOpen(false)}>Admin</Link>}
          {user ? (
            <button onClick={() => { setMenuOpen(false); onLogout(); }} className="text-blue-800">Logout</button>
          ) : (
            <>
              <Link href="/login" className="text-blue-800" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/signup" className="text-blue-800" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
