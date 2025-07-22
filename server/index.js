import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import logger from "./utils/logger.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true, // allow cookies/JWT if needed
  })
);
app.use(express.json());

// API routes
import transactionsRouter from "./routes/transactions.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";

// Attach io to req for real-time events in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/transactions", transactionsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

// Placeholder route
app.get("/", (req, res) => {
  res.send("BudgetBuddy backend is running 🚀");
});

// Socket.IO connection
io.on("connection", (socket) => {
  logger.info("Socket connected:", socket.id);

  socket.on("user:typing", (data) => {
    socket.broadcast.emit("user:typing", data);
  });

  socket.on("disconnect", () => {
    logger.info("Socket disconnected:", socket.id);
  });
});

// MongoDB connection and server start
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      server.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      logger.error("MongoDB connection error:", err);
    });
}

export { app };
