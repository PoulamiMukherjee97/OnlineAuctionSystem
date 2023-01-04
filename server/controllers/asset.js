const Asset = require('../models/asset');
const User = require('../models/User');
const { nftContract, tokenContract } = require('../contract');
const e = require('express');

exports.register = async (req, res) => {
    const { asset, price, owner } = req.body;
    if (!(asset && price)) {
        return res.status(402).send("Asset not added.Required fields missing");
    }
    const tokenId = Math.floor(Math.random() * Date.now());
    const assetDao = new Asset({ ...req.body, price: Number(price), tokenId });
    try {
        const userObj = await User.findOne({ _id: owner });
        if (userObj) {
            assetDao.save((err, data) => {
                if (!err) {
                    nftContract.methods.mint(userObj.account, data.tokenId).send({ from: userObj.account })
                    return res.status(200).send('Asset Added Successfully');
                } else {
                    return res.status(400).send('Asset not Added.');
                }
            });
        } else {
            res.status(400).send("Owner not found");
        }
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }

}

exports.getAssets = (req, res) => {
    const { userId } = req.params;
    if (userId) {
        Asset.find({ owner: userId }, (err, data) => {
            if (!err) {
                return res.status(200).send(data)
            } else {
                return res.status(400).send("User not found")
            }
        })
    }
    else {
        Asset.find({}, (err, data) => {
            if (!err) {
                return res.status(200).send(data)
            } else {
                return res.status(400).send("User not found")
            }
        })
    }
}

exports.deleteAsset = async (req, res) => {
    const { owner, tokenId, _id } = req.body;
    try {
        const userObj = await User.findOne({ _id: owner });
        if (userObj) {
            const deletedObj = await Asset.deleteOne({ tokenId })
            // const deletedObj = { acknowledged: true, deletedCount: 1}
            if (deletedObj.acknowledged && deletedObj.deletedCount > 0) {
                nftContract.methods.burn(tokenId).send({ from: userObj.account });
                res.send("Asset Deleted");
            } else {
                res.status(400).send('Asset not deleted');
            }

        }
        else {
            res.status(400).send("Asset owner not present");
        }
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }

}
exports.buyAsset = async (req, res) => {
    const { buyer, owner, tokenId, price } = req.body;
    const buyerObj = await User.findOne({ _id: buyer });
    const ownerObj = await User.findOne({ _id: owner })
    if (buyerObj && ownerObj) {
        const accountBalance = await tokenContract.methods.balanceOf(buyerObj.account).call();
        if (accountBalance >= price) {
            const assetObj = await Asset.updateOne({ tokenId }, { $set: { owner: buyer } });
            if (assetObj.acknowledged && assetObj.modifiedCount > 0) {
                await tokenContract.methods.transferFrom(buyerObj.account, ownerObj.account, price).send({ from: buyerObj.account });
                await nftContract.methods.transferFrom(ownerObj.account, buyerObj.account, tokenId).send({ from: ownerObj.account });
                return res.status(200).send('Asset Owner updated');
            } else {
                return res.status(400).send('Asset owner not updated')
            }
        } else {
            return res.status(400).send('Insufficient Account Balance');
        }
    } else {
        res.status(400).send("Buyer or Owner invalid");
    }
}
exports.fetchAssetHistory = async (req, res) => {
    let history = [];
    let transHistory = [];
    const usersArray = await User.find({});
    const events = await nftContract.getPastEvents('Transfer', {
        filter: { _tokenId: req.body.tokenId },
        fromBlock: 0,
        toBlock: 'latest'
    })
    events.forEach(element => {
        history.push({ from: element.returnValues['_from'], to: element.returnValues['_to'] })
    })
    history.forEach((el) => {
        let fromObj, toObj = null;
        if (el.from === '0x0000000000000000000000000000000000000000') {
            fromObj = { name: 'Creation Point' };
        } else {
            fromObj = usersArray.find(ele => ele.account === el.from);
        }
        toObj = usersArray.find(ele => ele.account === el.to);
        if (fromObj && toObj) {
            transHistory.push({ from: fromObj.name, from_address: el.from, to: toObj.name, to_address: el.to });
        }
    })
    return res.send(transHistory);
}