import { Schema, model, Types } from 'mongoose';

const categorySchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
});

export const Category = model('Category', categorySchema);