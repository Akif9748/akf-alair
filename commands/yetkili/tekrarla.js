

exports.run = (client, message, args, { prefix }) => {
    if (!message.member.isAdmin())
        return message.reply('Üzgünüm, buna yetkin yok :grinning:')

    if (!args[0]) return message.hata("Tekrarlanacak şeyi yaz!")

    const textChannel = message.mentions.channels.first();

    message.delete().catch(_ => _)

    if (textChannel)
        return textChannel.send(args.slice(1).join(" "))
    else
        return message.channel.send(args.join(" "))

};

exports.help = {
    name: ["tekrarla", 'söyle'],
    description: 'Söylediğiniz şeyi tekrarlar.',
    usage: 'söyle [#kanal] <mesaj>'
};
