import express from "express";
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";
import { validateTransaction } from "../middleware/validateTransaction.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/transactions
// @desc    Get all transactions for a user
router.get("/", requireAuth, getTransactions);

// @route   POST /api/transactions
// @desc    Create a new transaction
router.post("/", requireAuth, validateTransaction, createTransaction);

// @route   PUT /api/transactions/:id
// @desc    Update a transaction
router.put("/:id", requireAuth, validateTransaction, updateTransaction);

// @route   DELETE /api/transactions/:id
// @desc    Delete a transaction
router.delete("/:id", requireAuth, deleteTransaction);

export default router;
