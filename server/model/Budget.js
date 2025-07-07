import { Schema, model, Types } from 'mongoose';

const budgetSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Budget = model('Budget', budgetSchema);