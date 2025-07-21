import Transaction from "../models/transaction.js";
import categorize from "../utils/categorizer.js";

// Create a new transaction
export async function createTransaction(req, res) {
  try {
    const { amount, date, description, vendor } = req.body;
    const category = categorize(description || vendor || "");
    const transaction = new Transaction({
      amount,
      date,
      description,
      vendor,
      category,
    });
    await transaction.save();
    // Emit real-time event if io/socket is available (to be added in route/index)
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Get all transactions
export async function getTransactions(req, res) {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
