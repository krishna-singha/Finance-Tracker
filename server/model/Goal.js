import { Schema, model, Types } from 'mongoose';

const goalSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  deadline: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export const Goal = model('Goal', goalSchema);