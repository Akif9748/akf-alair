const { Resolvers } = require("../../util");


exports.run = (client, message, args) => {
    if (!message.member.isAdmin())
        return message.reply('Üzgünüm, buna yetkin yok :grinning:')

    if (!args[0]) return message.hata("Tekrarlanacak şeyi yaz!")

    let textChannel, content;
    if (message.options) {
        textChannel = message.options.getChannel("kanal");
        content = message.options.getString("mesaj");
        message.reply({ content: `Mesaj gönderildi!`, ephemeral: true }).catch(_ => _)
    } else {
        textChannel = Resolvers.Channel({ message, channelType: "text" });
        content = args.slice(textChannel ? 1 : 0).join(" ");
        message.delete().catch(_ => _);
    }
    textChannel ||= message.channel;

    return textChannel.send(content);
};

exports.help = {
    native: true,
    options: [
        { name: "mesaj", description: "Mesajın içeriği", type: 3, required: true },
        { name: "kanal", description: "Mesajın gönderileceği kanal", type: 7 }
    ],
    names: ["tekrarla", 'söyle'],
    description: 'Söylediğiniz şeyi tekrarlar.',
    usage: 'söyle [#kanal] <mesaj>'
};
