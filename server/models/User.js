const mongoose = require('./mongoDB');

const Schema = mongoose.Schema;

const User = new Schema({
    name: String,
    created: { type: Date, default: Date.now },
    password: String,
    email: String,
    account: String,
});

module.exports = mongoose.model('User', User);