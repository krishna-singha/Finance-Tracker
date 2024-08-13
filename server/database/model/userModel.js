const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    source: String,
    amount: Number,
    date: String,
}, { _id: false });

const expenseSchema = new mongoose.Schema({
    type: String,
    amount: Number,
    date: String,
}, { _id: false });

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
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
}, {
    timestamps: true,
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;