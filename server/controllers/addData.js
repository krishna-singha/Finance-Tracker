const UserModel = require('../database/model/userModel');

const handleIncome = async (req, res) => {
    const { _id, income } = req.body;

    if (!_id || !income) {
        return res.status(400).json({ error: 'User ID and income data are required' });
    }

    try {
        const user = await UserModel.findOne({ _id });
        if (user) {
            user.incomes.push(income);
            await user.save();
            return res.status(200).json({ message: 'Income added successfully' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const handleExpenses = async (req, res) => {
    const { _id, expense } = req.body;

    if (!_id || !expense) {
        return res.status(400).json({ error: 'User ID and expense data are required' });
    }

    try {
        const user = await UserModel.findOne({ _id });
        if (user) {
            user.expenses.push(expense);
            await user.save();
            return res.status(200).json({ message: 'Expense added successfully' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const handleStocks = async (req, res) => {
    const { _id, stock } = req.body;

    if (!_id || !stock) {
        return res.status(400).json({ error: 'User ID and stock data are required' });
    }

    try {
        const user = await UserModel.findOne({ _id });
        if (user) {
            user.stocks.push(stock);
            await user.save();
            return res.status(200).json({ message: 'Stock added successfully' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    handleIncome,
    handleExpenses,
    handleStocks
};