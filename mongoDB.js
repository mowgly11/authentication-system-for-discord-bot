const mongoose = require('mongoose');
const config = require('./config.json');

module.exports = {
    init: function () {
        mongoose.connect(config.mongoDB_URL);
        mongoose.Promise = global.Promise;

        mongoose.connection.on("connected", () => {
            console.log("[MONGODB] - Connected!");
        });

        mongoose.connection.on("disconnected", () => {
            console.log("[MONGODB] - Disconnected!");
        });

        mongoose.connection.on("error", (error) => {
            console.log("[MONGODB] - Error" + error);
        });
    }
}