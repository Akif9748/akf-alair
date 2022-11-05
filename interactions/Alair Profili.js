const Discord = require('discord.js');
const profil = require("../util/functions/profil")
const { User } = require("../util")

const { ContextMenuCommandBuilder } = require('@discordjs/builders');

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.ContextMenuInteraction} interaction 
 * @returns 
 */
exports.run = async (client, interaction) => {
    if (interaction.channel.type == "DM") return
    const user = interaction.guild.members.cache.get(interaction.targetId);
    if (!user) return interaction.reply({ content: "Böyle bir kullanıcı bulunamadı. Bu imkansız bir hataya benziyor..." });
    return interaction.reply({
        files: [
            new Discord.MessageAttachment(await profil(user, await User(interaction.targetId)), "seviye.png")
        ]
    })

};

exports.data = new ContextMenuCommandBuilder().setName("Alair Profili").setType(2);
