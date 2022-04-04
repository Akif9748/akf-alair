const Discord = require('discord.js');


exports.run = (client, message, args) => {
    if (!client.ayarlar.sahip.includes(message.author.id)) return message.reply(`Bu komutu sadece Bot Sahibi kullanabilir!`);

    const embed = new Discord.MessageEmbed().setAuthor({ name: client.user.tag + " resetleniyor", iconURL: client.user.displayAvatarURL() })
        .setDescription("**Açılış tarihi:** " + new Date(Date.now() - client.uptime).toLocaleString("tr"))
        .setColor(client.renk).setTimestamp()
    return message.channel.send({ embeds: [embed] }).then(() => process.exit(1))
};

exports.help = {
    name: 'reset',
    description: 'Botun sahibi botu resetler.',
    usage: 'reset'
};
