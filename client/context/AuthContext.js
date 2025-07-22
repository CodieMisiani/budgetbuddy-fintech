'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
    // Only run auth check on client side
    if (typeof window !== 'undefined') {
      const checkAuth = async () => {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const res = await fetch('/api/auth/auth', {
              method: 'GET',
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
              const userData = await res.json();
              setUser(userData);
            } else {
              // If token is invalid, clear it
              localStorage.removeItem('token');
            }
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }
        } finally {
          setLoading(false);
        }
      };
      checkAuth();
    } else {
      // On server, just set loading to false
      setLoading(false);
    }
    
    return () => setMounted(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const { token, user } = await res.json();
        localStorage.setItem('token', token);
        setUser(user);
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  // Only render children when mounted (client-side) and not loading
  return (
    <AuthContext.Provider value={{ user, loading: !mounted || loading, login, logout }}>
      {mounted && !loading ? children : null}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
