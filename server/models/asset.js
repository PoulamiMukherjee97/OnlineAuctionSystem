const { isObjectIdOrHexString } = require('./mongoDB');
const mongoose = require('./mongoDB');

const Schema = mongoose.Schema;

const Asset = new Schema({
    asset: String,
    created: { type: Date, default: Date.now },
    image: String,
    tokenId: Number,
    description: String,
    price: Number,
    type: String,
    owner: String,
});

module.exports = mongoose.model('Asset', Asset);