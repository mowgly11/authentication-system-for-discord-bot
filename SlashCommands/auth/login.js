const walletData = require('../../models/userData');
const bcrypt = require('bcrypt');
const {
    MessageActionRow,
    Modal,
    TextInputComponent
} = require('discord.js');

module.exports = {
    name: "login",
    description: "login with your earth bot account",

    run: async (client, interaction, args) => {
        let data;
        try {
            data = await walletData.findOne({
                loggedIn: {
                    user: interaction.user.id,
                    log: true
                }
            });
            if (data) return interaction.reply({
                content: "You are already logged in to an account",
                ephemeral: true
            });
        } catch (err) {
            console.log(err)
        }
        const modal = new Modal()
            .setCustomId('loginModal')
            .setTitle('Login To Your Account');
        const usernameInput = new TextInputComponent()
            .setCustomId('usernameField')
            .setLabel("Username")
            .setStyle('SHORT');
        const passwordInput = new TextInputComponent()
            .setCustomId('passwordField')
            .setLabel("Password")
            .setStyle('SHORT');

        const firstActionRow = new MessageActionRow().addComponents(usernameInput);
        const secondActionRow = new MessageActionRow().addComponents(passwordInput);

        modal.addComponents(firstActionRow, secondActionRow);
        await interaction.showModal(modal);
    }
}