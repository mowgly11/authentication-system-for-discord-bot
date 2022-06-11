const walletData = require('../../models/userData');
const bcrypt = require('bcrypt');
const {
    MessageActionRow,
    Modal,
    TextInputComponent
} = require('discord.js');

module.exports = {
    name: "register",
    description: "register a new earth bot account",

    run: async (client, interaction, args) => {
        const modal = new Modal()
            .setCustomId('registerModal')
            .setTitle('register a new Account');
        const usernameInput = new TextInputComponent()
            .setCustomId('usernameRegisterField')
            .setLabel("create a username")
            .setStyle('SHORT');
        const passwordInput = new TextInputComponent()
            .setCustomId('passwordRegisterField')
            .setLabel("Password")
            .setStyle('SHORT');
        const passwordInput2 = new TextInputComponent()
            .setCustomId('passwordRegisterField2')
            .setLabel("Verify Password")
            .setStyle('SHORT');

        const firstActionRow = new MessageActionRow().addComponents(usernameInput);
        const secondActionRow = new MessageActionRow().addComponents(passwordInput);
        const thirdActionRow = new MessageActionRow().addComponents(passwordInput2);

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);
        await interaction.showModal(modal);
    }
}