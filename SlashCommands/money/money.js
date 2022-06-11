const walletData = require('../../models/userData');

module.exports = {
    name: "wallet",
    description: "see your wallet balance",

    run: async (client, interaction, args) => {
        let data;
        try {
            data = await walletData.findOne({
                loggedIn: {
                    user: interaction.user.id,
                    log: true
                }
            });
            if (!data) return interaction.reply({
                content: "You are not logged in to any account",
                ephemeral: true
            });
        } catch (err) {
            console.log(err)
        }

        interaction.reply(`${data.wallet}`)
    }
}