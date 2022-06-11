const walletData = require('../../models/userData');

module.exports = {
    name: "logout",
    description: "logout from you earth bot account",

    run: async (client, interaction, args) => {
        walletData.findOne({
            loggedIn: {
                user: interaction.user.id,
                log: true
            }
        }, async(err, data) => {
            await walletData.findOneAndUpdate({
                loggedIn: {
                    user: interaction.user.id,
                    log: true
                }
            }, {
                loggedIn: {
                    user: "",
                    log: false
                }
            });

            interaction.reply({ content: "Logged Out Successfully", ephemeral: true })
        })
    }
}