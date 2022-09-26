const Discord = require('discord.js');

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {*} args 
 * @returns 
 */
exports.run = async (client, message, args) => {
    if (!message.member.isOwner()) return message.reply(`Bu komutu sadece Bot Sahibi kullanabilir!`);
    const embed = new Discord.MessageEmbed().setName("resetleniyor")
        .setDescription("**Açılış tarihi:** " + new Date(client.readyTimestamp).toLocaleString("tr"))
        .setTimestamp()
    await message.channel.send({ embeds: [embed] });
    return process.exit(137);
};

exports.help = {
    name: 'reset',
    description: 'Botun sahibi botu resetler.',
    usage: 'reset', gizli: true
};
