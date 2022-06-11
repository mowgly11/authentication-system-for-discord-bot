const client = require("../index");
const bcrypt = require('bcrypt');
const walletData = require('../models/userData');

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd)
            return interaction.followUp({
                content: "An error has occured "
            });

        const args = [];

        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options ?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);

        cmd.run(client, interaction, args);
    }

    if (interaction.isContextMenu()) {
        await interaction.deferReply({
            ephemeral: false
        });
        const command = client.slashCommands.get(interaction.commandName);
        if (command) command.run(client, interaction);
    }

    if (interaction.isModalSubmit()) {
        //checking the modal id
        if (interaction.customId === "registerModal") {
            //getting inputs from the modal
            const usernameRegister = interaction.fields.getTextInputValue("usernameRegisterField");
            const passwordRegister = interaction.fields.getTextInputValue("passwordRegisterField");
            const passwordRegister2 = interaction.fields.getTextInputValue("passwordRegisterField2");

            console.log(
                usernameRegister,
                passwordRegister,
                passwordRegister2
            )
            // if inputs are empty
            if (!usernameRegister) {
                return interaction.reply({
                    content: "username field is required. you need to provide your account username to login.",
                    ephemeral: true
                });
            }
            if (!passwordRegister) {
                return interaction.reply({
                    content: "password field is required. you need to provide your account password to login.",
                    ephemeral: true
                });
            }
            if (!passwordRegister2) {
                return interaction.reply({
                    content: "repeating your password is required. you need to provide your account password to login.",
                    ephemeral: true
                });
            }
            if (passwordRegister !== passwordRegister2) return interaction.reply({
                content: "passwords do not match.",
                ephemeral: true
            });
            //looking for data
            let userRegister;

            try {
                userRegister = await walletData.findOne({
                    username: usernameRegister
                });
                if (userRegister) return interaction.reply({ // if this username already exists
                    content: "This Account Already Exist",
                    ephemeral: true
                });
                userRegister = await walletData.create({ // creating the account and hashing the password if everything is okay
                    username: usernameRegister,
                    password: await bcrypt.hash(passwordRegister, 10),
                    loggedIn: {
                        user: "",
                        log: false
                    },
                    cooldown: Date.now(),
                    wallet: 0
                });
                await userRegister.save();
                interaction.reply("You created your account!");
            } catch (err) {
                console.log(err)
            };

        } else if (interaction.customId === "loginModal") { // checking the modal customId
            //getting inputs from the modal
            const usernameLogin = interaction.fields.getTextInputValue("usernameField");
            const passwordLogin = interaction.fields.getTextInputValue("passwordField");

            // if inputs are empty
            if (!usernameLogin) {
                return interaction.reply({
                    content: "username field is required. you need to provide your account username to login.",
                    ephemeral: true
                });
            }
            if (!passwordLogin) {
                return interaction.reply({
                    content: "password field is required. you need to provide your account password to login.",
                    ephemeral: true
                });
            }
            // getting data
            let userLogin;
            try {
                userLogin = await walletData.findOne({
                    username: usernameLogin
                });
                if (!userLogin) { // if user was not found
                    return interaction.reply({
                        content: "This account does not exist",
                        ephemeral: true
                    });
                }
            } catch (err) {
                console.log(err)
            };
            if (!usernameLogin.toLowerCase() === userLogin.username.toLowerCase()) return interaction.reply({
                content: "Incorrect Username!",
                ephemeral: true
            });

            if (await bcrypt.compare(passwordLogin, userLogin.password)) {
                await walletData.findOneAndUpdate({
                    username: usernameLogin
                }, {
                    loggedIn: {
                        user: interaction.user.id,
                        log: true
                    }
                });

                interaction.reply("logged in to " + `**${usernameLogin}**`)
            } else {
                return interaction.reply({
                    content: "Incorrect Password!",
                    ephemeral: true
                });
            }

        }
    }
});