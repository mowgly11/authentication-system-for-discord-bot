const {
    Schema,
    model
} = require('mongoose');

const schema = new Schema({
    username: String,
    password: String,
    loggedIn: {
        user: String,
        log: {
            type: Boolean,
            default: false
        }
    },
    wallet: Number,
    daily: Number,
    transaction: {
        type: Number,
        max: 100000,
    },
});

module.exports = new model("wallet-accounts", schema);