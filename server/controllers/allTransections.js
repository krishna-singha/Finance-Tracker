const UserModel = require('../database/model/userModel');

const handleAllTransactions = async (req, res) => {
    const { _id } = req.body;

    if (!_id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const user = await UserModel.findOne({ _id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const incomes = user.incomes.map(income => ({
            date: income.date,
            name: income.name,
            amount: income.amount,
            type: 'income',
        }));

        const expenses = user.expenses.map(expense => ({
            date: expense.date,
            name: expense.name,
            amount: expense.amount,
            type: 'expense',
        }));

        const stocks = user.stocks.map(stock => ({
            date: stock.date,
            name: stock.name,
            amount: stock.amount,
            quantity: stock.quantity,
            status: stock.status,
            type: 'stock',
        }));

        const allTransactions = [
            ...incomes,
            ...expenses,
            ...stocks,
        ];

        return res.status(200).json(allTransactions);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = handleAllTransactions;
