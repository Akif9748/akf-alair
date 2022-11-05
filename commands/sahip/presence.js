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
    if (!args[0]) return message.reply("Presence ayarlamak için bir argüman belirtmelisiniz!");

    client.user.setActivity(args.join(" "))
    return message.reply("Ayarlandı!")
};

exports.help = {
    name: 'presence',
    description: 'presence sabitleme.',
    usage: 'presence <yazi>', gizli: true
};
