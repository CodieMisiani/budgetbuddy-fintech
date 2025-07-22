import Transaction from "../models/transaction.js";
import { categorize } from "../utils/categorizer.js";

// Create a new transaction
export async function createTransaction(req, res) {
  try {
    const { amount, date, description, vendor, category, type } = req.body;
    const userId = req.user.id; // Assuming requireAuth middleware adds user to req

    const transaction = new Transaction({
      amount,
      date,
      description,
      vendor,
      category: category || categorize(description || vendor || ""), // Use client category or categorize
      type,
      user: userId,
    });

    await transaction.save();

    if (req.io) {
      // Emit only to the specific user if possible, or broadcast
      req.io.emit("transaction:new", transaction);
    }

    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Get all transactions for the logged-in user
export async function getTransactions(req, res) {
  try {
    const userId = req.user.id; // Assuming requireAuth middleware adds user to req
    const transactions = await Transaction.find({ user: userId }).sort({
      date: -1,
    });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

// Update a transaction
export async function updateTransaction(req, res) {
  try {
    const { id } = req.params;
    const { amount, date, description, vendor } = req.body;
    // Find existing transaction
    const transaction = await Transaction.findById(id);
    if (!transaction)
      return res.status(404).json({ error: "Transaction not found" });
    // Update fields
    transaction.amount = amount ?? transaction.amount;
    transaction.date = date ?? transaction.date;
    transaction.description = description ?? transaction.description;
    transaction.vendor = vendor ?? transaction.vendor;
    // Re-categorize if description or vendor changed
    if (description || vendor) {
      transaction.category = categorize(
        transaction.description || transaction.vendor || ""
      );
    }
    await transaction.save();
    if (req.io) {
      req.io.emit("transaction:updated", transaction);
    }
    res.json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Delete a transaction
export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction)
      return res.status(404).json({ error: "Transaction not found" });
    if (req.io) {
      req.io.emit("transaction:deleted", transaction);
    }
    res.json({ success: true, deleted: transaction });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
