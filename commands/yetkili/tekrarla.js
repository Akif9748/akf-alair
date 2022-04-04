exports.run = (client, message, args) => {
    let msg;
    if (!client.ayarlar.sahip.includes(message.author.id) && !message.member.permissions.has("ADMINISTRATOR"))
        return message.channel.send('Üzgünüm, buna yetkin yok :grinning:')

    if (!args) return message.channel.send("Tekrarlanacak şeyi yaz!")

    let textChannel = message.mentions.channels.first()
    message.delete().catch(console.error)

    if (textChannel) {
        msg = args.slice(1).join(" ");
        return textChannel.send(msg).catch(console.error)
    } else {
        msg = args.join(" ");
        return message.channel.send(msg)
    }
};

exports.help = {
    name: ["tekrarla", 'söyle'],
    description: 'Söylediğiniz şeyi tekrarlar.',
    usage: 'söyle bişiler'
};
