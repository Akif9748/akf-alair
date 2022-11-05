exports.run = async (client, message, args, guild) => {

    if (!message.member.isAdmin())
        return message.reply('Üzgünüm, buna yetkin yok :grinning:')

    guild.oto = !guild.oto;
    await guild.save();
    return message.reply(`Oto mesaj ${guild.oto ? "**açıldı**" : "**kapatıldı**"}`)

};

exports.help = {
    name: ["otocevap", "oto"],
    description: 'Otomatik cevaplar :)',
    usage: 'oto'
};