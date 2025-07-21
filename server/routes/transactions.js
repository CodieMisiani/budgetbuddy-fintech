import express from "express";
import { createTransaction, getTransactions } from "../controllers/transactionController.js";

const router = express.Router();

// @route   GET /api/transactions
// @desc    Get all transactions
router.get("/", getTransactions);

// @route   POST /api/transactions
// @desc    Create a new transaction
router.post("/", createTransaction);

export default router;
