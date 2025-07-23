import { useState } from "react";
import axios from "axios";
import categorize from "../utils/categorize";

export default function TransactionForm({ onAdd, jwt, showToast }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    try {
      // AI parse: 'Spent Ksh 500 at Naivas'
      const match = input.match(/(spent|received)\s*ksh\s*(\d+)\s*(at|from)?\s*(.+)?/i);
      let amount = 0, vendor = '', description = input, date = new Date().toISOString().slice(0,10), type = 'expense';
      if (match) {
        amount = parseInt(match[2], 10);
        vendor = match[4] || '';
        description = input;
        if (/received/i.test(match[1])) type = 'income';
      }
      const category = categorize(vendor || description);
      const res = await axios.post((process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/transactions", {
        amount,
        date,
        description,
        vendor,
        category,
        type
      }, {
        headers: jwt ? { Authorization: `Bearer ${jwt}` } : {}
      });
      setInput("");
      if (onAdd) onAdd(res.data);
      if (showToast) showToast("Transaction added!", "success");
    } catch (e) {
      if (showToast) showToast("Failed to add transaction", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 rounded-lg shadow-lg p-6 mb-6 flex flex-col gap-4 animate-fade-in">
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="e.g. Spent Ksh 500 at Naivas"
        className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        disabled={loading}
      />
      <button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-2 rounded shadow hover-scale disabled:opacity-50" disabled={loading}>
        {loading ? <span className="animate-spin">⏳</span> : "Add Transaction"}
      </button>
    </form>
  );
}
