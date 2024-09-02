const UserModel = require('../database/model/userModel');

const handleSellStock = async (req, res) => {
    const { _id, stockName, sellingPrice, stockQuantity } = req.body;

    if (!_id || !stockName || !sellingPrice || !stockQuantity) {
        return res.status(400).json('All fields are required');
    }
    try {
        const user = await UserModel.findOne({ _id });
        if (!user) {
            return res.status(404).json('User not found');
        }

        const stock = user.stocks.filter(stock => stock.name === stockName && stock.status === 'hold')[0];
        if (!stock) {
            return res.status(404).json('Stock not found');
        }

        if (stockQuantity > stock.quantity) {
            return res.status(400).send('Stock quantity is greater than available quantity');
        }
        else if (stockQuantity === stock.quantity) {
            stock.amount = sellingPrice;
            stock.quantity = stockQuantity;
            stock.status = 'sold';
            stock.date = new Date().toISOString().split('T')[0];
            await user.save();
            return res.status(200).json('Stock sold successfully');
        }
        else {
            stock.amount = ((stock.quantity - stockQuantity) * stock.amount)/stock.quantity;
            stock.quantity = stock.quantity - stockQuantity;
            stock.status = 'hold';

            const stockAlready = user.stocks.filter(stock => stock.name === stockName && stock.status === 'sold')[0];
            if (!stockAlready) {
                const newStock = {
                    name: stock.name,
                    amount: sellingPrice,
                    quantity: stockQuantity,
                    status: 'sold',
                    date: new Date().toISOString().split('T')[0],
                };
                user.stocks.push(newStock);
            }
            else {
                stockAlready.amount = stockAlready.amount + sellingPrice;
                stockAlready.quantity = stockAlready.quantity + stockQuantity;
                stockAlready.status = 'sold';
                stockAlready.date = new Date().toISOString().split('T')[0];
            }
            await user.save();
            return res.status(200).json('Stock sold successfully');
        }
    }
    catch (error) {
        console.error('Failed to sell stock:', error);
        return res.status(500).json('Failed to sell stock');
    }
}

module.exports = {
    handleSellStock,
};