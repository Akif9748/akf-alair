const Discord = require('discord.js');
const asb = require("../../util/lib/asb")
/**
 * 
 * @param {import("discord.js").Client} client 
 * @param {import("discord.js").Message} message 
 * @param {*} args 
 * @returns 
 */
exports.run = async (client, message) => {
    if (!message.member.isOwner()) return message.reply(`Bu komutu sadece Bot Sahibi kullanabilir!`);
    const embed = new Discord.MessageEmbed()
        .setFooter({ text: "Açılış tarihi:" })
        .setName("Resetleniyor")
        .setTimestamp(client.readyTimestamp)
        
    await message.reply({ embeds: [embed] }).catch(() => { });

    await asb.telemetri(client, 137).catch(() => process.exit(137));

};

exports.help = {
    names: ["reset"],
    description: 'Botun sahibi botu resetler.',
    usage: 'reset',
    gizli: true
};
