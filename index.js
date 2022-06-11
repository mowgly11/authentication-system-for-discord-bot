process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 1; // not neccessary

const { Client, Collection } = require("discord.js");

const client = new Client({
    intents: 32767,
});

const mongoDB = require('./mongoDB')
module.exports = client;

client.slashCommands = new Collection();
const config = require("./config.json");

require("./handler")(client);

mongoDB.init();
client.login(config.clientToken);