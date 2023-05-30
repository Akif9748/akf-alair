const Discord = require('discord.js');
const asb = require("../../util/asb")
/**
 * 
 * @param {import("discord.js").Client} client 
 * @param {import("discord.js").Message} message 
 * @param {*} args 
 * @returns 
 */
exports.run = async (client, message) => {
    if (!message.member.isOwner()) return message.reply(`Bu komutu sadece Bot Sahibi kullanabilir!`);
    const embed = new Discord.MessageEmbed().setName("resetleniyor")
        .setDescription("**Açılış tarihi:** " + new Date(client.readyTimestamp).toLocaleString("tr"))
        .setTimestamp()
    await message.reply({ embeds: [embed] }).catch(() => { });

    await asb.sigterm(client, 137).catch(() => process.exit(137));

};

exports.help = {
    name: 'reset',
    description: 'Botun sahibi botu resetler.',
    usage: 'reset', gizli: true
};
