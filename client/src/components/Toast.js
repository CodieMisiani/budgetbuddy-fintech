import { useEffect } from "react";

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);
  if (!message) return null;
  return (
    <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded shadow-lg animate-fade-in ${type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
      {message}
    </div>
  );
}
