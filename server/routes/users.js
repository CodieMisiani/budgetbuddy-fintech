import express from "express";
import User from "../models/user.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// List all users (admin only)
router.get("/", requireAuth, requireAdmin, async (req, res) => {
  const users = await User.find({}, "_id email role createdAt");
  res.json(users);
});

// Delete a user (admin only)
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ success: true, deleted: user });
});

// Promote/demote user (admin only)
router.patch("/:id", requireAuth, requireAdmin, async (req, res) => {
  const { role } = req.body;
  if (!role || !["user", "admin"].includes(role)) return res.status(400).json({ error: "Invalid role" });
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ success: true, user });
});

export default router;
