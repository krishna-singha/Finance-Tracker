import { Schema, model, Types } from "mongoose";

const transactionSchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User", required: true },
  categoryId: { type: Types.ObjectId, ref: "Category", required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  amount: { type: Number, required: true },
  note: { type: String },
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Transaction = model("Transaction", transactionSchema);
