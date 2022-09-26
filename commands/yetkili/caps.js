exports.run = async (client, message, args, guild) => {

    if (!message.member.isAdmin())
        return message.channel.send('Üzgünüm, buna yetkin yok :grinning:')

    guild.caps = !guild.caps;
    await guild.save();
    message.channel.send("Caps engeli " + (guild.caps ? "**açıldı**" : "**kapatıldı**"))

};

exports.help = {
    name: ["caps", "capsengel"],
    description: 'Cümle tamamen büyük harften ibaretse siler.',
    usage: 'caps'
};