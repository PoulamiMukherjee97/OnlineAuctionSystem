const { tokenContract, web3, nftContract } = require('../contract');
const User = require('../models/User');

exports.addToken = async (req, res) => {
    const { token, userId } = req.body;
    try {
        const userObj = await User.findOne({ _id: userId });
        if (userObj) {
            tokenContract.methods.mint(token).send({ from: userObj.account })
            return res.status(200).send('Token added');
        } else {
            return res.status(400).send('User not found');
        }

    } catch (err) {
        return res.status(500).send("Internal server error")
    }

}

exports.fetchAccountDetails = async (req, res) => {
    const { userId } = req.body;
    try {
        const userObj = await User.findOne({ _id: userId });
        if (userObj) {
            const balance = await web3.eth.getBalance(userObj.account);
            const etherBalance = await web3.utils.fromWei(balance, 'ether');
            const tokenBalance = await tokenContract.methods.balanceOf(userObj.account).call();
            const assetBalance = await nftContract.methods.balanceOf(userObj.account).call();
            res.send({ etherBalance, tokenBalance, name: userObj.name, assetBalance, accountAddress: userObj.account });
        } else {
            res.status(400).send("User not found");
        }
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
    }
}