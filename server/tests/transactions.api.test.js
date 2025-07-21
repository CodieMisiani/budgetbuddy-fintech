import request from "supertest";
import mongoose from "mongoose";
import app from "../index.js";
import Transaction from "../models/transaction.js";

// Use a test database
const MONGO_TEST_URI = process.env.MONGO_TEST_URI || "mongodb://localhost:27017/budgetbuddy_test";

beforeAll(async () => {
  await mongoose.connect(MONGO_TEST_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("/api/transactions endpoints", () => {
  let txId;
  it("should create a transaction", async () => {
    const res = await request(app)
      .post("/api/transactions")
      .send({ amount: 100, date: "2025-07-21", description: "Test Tx", vendor: "TestVendor" });
    expect(res.statusCode).toBe(200);
    expect(res.body.amount).toBe(100);
    txId = res.body._id;
  });

  it("should get all transactions", async () => {
    const res = await request(app).get("/api/transactions");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should update a transaction", async () => {
    const res = await request(app)
      .put(`/api/transactions/${txId}`)
      .send({ amount: 200 });
    expect(res.statusCode).toBe(200);
    expect(res.body.amount).toBe(200);
  });

  it("should delete a transaction", async () => {
    const res = await request(app).delete(`/api/transactions/${txId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
