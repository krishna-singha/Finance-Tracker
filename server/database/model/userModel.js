const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    name: String,
    amount: Number,
    date: String,
}, { _id: false });

const expenseSchema = new mongoose.Schema({
    category: String,
    name: String,
    amount: Number,
    date: String,
}, { _id: false });

const stockSchema = new mongoose.Schema({
    name: String,
    amount: Number,
    currentPrice: {
        type: Number,
        default: 300,
    },
    status: {
        type: String,
        enum: ['hold', 'sold'],
        default: 'hold',
    },
}, { _id: false });

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    incomes: [incomeSchema],
    expenses: [expenseSchema],
    stocks: [stockSchema],
}, {
    timestamps: true,
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;