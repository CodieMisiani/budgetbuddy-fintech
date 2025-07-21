import request from "supertest";
import mongoose from "mongoose";
import { app } from "../index.js";
import Transaction from "../models/transaction.js";

// Use a test database
const MONGO_TEST_URI = process.env.MONGO_TEST_URI || "mongodb://localhost:27017/budgetbuddy_test";


afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
  } catch (e) {
    // ignore errors
  }
});

describe("/api/transactions endpoints", () => {
  let txId;
  // Increase timeout for slow DB operations
  jest.setTimeout(20000);

  beforeEach(async () => {
    await Transaction.deleteMany({});
  });

  it("should create a transaction", async () => {
    try {
      const res = await request(app)
        .post("/api/transactions")
        .send({ amount: 100, date: "2025-07-21", description: "Test Tx", vendor: "TestVendor" });
      expect([200, 201]).toContain(res.statusCode); // Allow 201 Created or 200 OK
      expect(res.body.amount).toBe(100);
      txId = res.body._id;
    } catch (e) {
      console.error(e);
      throw e;
    }
  });

  it("should get all transactions", async () => {
    try {
      const res = await request(app).get("/api/transactions");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    } catch (e) {
      console.error(e);
      throw e;
    }
  });

  it("should update a transaction", async () => {
    try {
      // Create a transaction first if txId is undefined
      if (!txId) {
        const createRes = await request(app)
          .post("/api/transactions")
          .send({ amount: 100, date: "2025-07-21", description: "Test Tx", vendor: "TestVendor" });
        txId = createRes.body._id;
      }
      const res = await request(app)
        .put(`/api/transactions/${txId}`)
        .send({ amount: 200, date: "2025-07-21", description: "Test Tx", vendor: "TestVendor" });
      expect([200, 201]).toContain(res.statusCode);
      expect(res.body.amount).toBe(200);
    } catch (e) {
      console.error(e);
      throw e;
    }
  });

  it("should delete a transaction", async () => {
    try {
      // Create a transaction first if txId is undefined
      if (!txId) {
        const createRes = await request(app)
          .post("/api/transactions")
          .send({ amount: 100, date: "2025-07-21", description: "Test Tx", vendor: "TestVendor" });
        txId = createRes.body._id;
      }
      const res = await request(app).delete(`/api/transactions/${txId}`);
      expect([200, 201]).toContain(res.statusCode);
      expect(res.body.success).toBe(true);
    } catch (e) {
      console.error(e);
      throw e;
    }
  });
});
