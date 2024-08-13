const UserModel = require('../database/model/userModel');

const handleUser = async (req, res) => {
    const { _id, name, email } = req.body;
    try {
        const user = await UserModel.findOne({ _id });
        if (!user) {
            await UserModel.create({ _id, name, email });
        }
        return res.status(200).json('user found');
    } catch (error) {
        return res.status(500).json('Internal server error');
    }
};

module.exports = {
    handleUser
};