exports.run = (client, message, args) => {
    if (!message.member.isAdmin())
        return message.channel.send('Üzgünüm, buna yetkin yok :grinning:')

    if (!args[0]) return message.channel.send("Tekrarlanacak şeyi yaz!")

    let textChannel = message.mentions.channels.first();

    message.delete().catch(_=>_)

    if (textChannel)
        return textChannel.send(args.slice(1).join(" ")) 
    else
        return message.channel.send(args.join(" "))

};

exports.help = {
    name: ["tekrarla", 'söyle'],
    description: 'Söylediğiniz şeyi tekrarlar.',
    usage: 'söyle bişiler'
};
