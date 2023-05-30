const Discord = require("discord.js");
const { User } = require("../../util");
const profil = require("../../util/functions/profil")

const f = async (user, m, guild) => {


    m.reply({
        content: !guild.rank ? "Uyarı: Bu sunucuda rank sistemi kapalı!" : "Alair rank kartın. Kartın tasarımı kötü görünüyorsa kendin tasarlayıp bize gönderebilirsin :toxplode:",
        files: [
            new Discord.MessageAttachment(await profil(user, await User(user.id)), "seviye.png")
        ]
    });
}

exports.run = async (client, message, args, guild) => f(message.üye(), message, guild);

/**
 * 
 * @param {import("discord.js").Client} client 
 * @param {import("discord.js").ContextMenuInteraction} interaction 
 * @returns 
 */

exports.runInteraction = async (client, interaction, guild) => {
    if (interaction.channel.type == "DM") return
    const user = interaction.guild.members.cache.get(interaction.targetId);
    if (!user) return interaction.reply({ content: "Böyle bir kullanıcı bulunamadı. Bu imkansız bir hataya benziyor..." });
    return f(user, interaction, guild);
};
exports.data = { name: "Alair Profili", type: 2 }
exports.help = {
    name: ['seviye', "level", "profil", "bakiye", "envanter", "cüzdan"],
    description: 'Level sorgulama!',
    usage: 'seviye [@kişi]'
};
