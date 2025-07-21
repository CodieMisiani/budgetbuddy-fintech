import express from "express";
import { createTransaction, getTransactions, updateTransaction, deleteTransaction } from "../controllers/transactionController.js";

const router = express.Router();

// @route   GET /api/transactions
// @desc    Get all transactions
router.get("/", getTransactions);

// @route   POST /api/transactions
// @desc    Create a new transaction
router.post("/", createTransaction);

// @route   PUT /api/transactions/:id
// @desc    Update a transaction
router.put("/:id", updateTransaction);

// @route   DELETE /api/transactions/:id
// @desc    Delete a transaction
router.delete("/:id", deleteTransaction);

export default router;
