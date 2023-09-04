const Discord = require("discord.js");
const { User } = require("../../util");
const profil = require("../../util/functions/profil")

/**
 * 
 * @param {import("discord.js").Client} client 
 * @param {import("discord.js").ContextMenuInteraction} interaction 
 * @returns 
 */

exports.runInteraction = async (client, interaction, guild) => {
    if (!interaction.channel || interaction.channel.type == 1) return
    const user = interaction.guild.members.cache.get(interaction.targetId);
    if (!user) return interaction.reply({ content: "Böyle bir kullanıcı bulunamadı. Bu imkansız bir hataya benziyor..." });

    return interaction.reply({
        content: !guild.rank ? "Uyarı: Bu sunucuda rank sistemi kapalı!" : "Alair rank kartın, rengi rolüne göre belirlenir.",
        files: [
            new Discord.MessageAttachment(await profil(user, await User(user.id)), "seviye.png")
        ]
    });
};

exports.data = { name: "Alair Profili", type: 2 };