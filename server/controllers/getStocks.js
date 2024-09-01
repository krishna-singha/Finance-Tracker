const UserModel = require('../database/model/userModel');

const handleGetStocks = async (req, res) => {
    const { _id } = req.body;

    if (!_id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const user = await UserModel.findOne({ _id });
        if (user) {
            return res.status(200).json(user.stocks);
        }
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    handleGetStocks,
};

            