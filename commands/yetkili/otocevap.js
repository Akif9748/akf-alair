exports.run = async (client, message, args, guild) => {

    if (!message.member.isAdmin())
        return message.channel.send('Üzgünüm, buna yetkin yok :grinning:')

    guild.otokapa = !guild.otokapa;
    await guild.save();
   return message.channel.send("Oto mesaj " + (guild.otokapa ? "**kapatıldı**" : "**açıldı**"))

};

exports.help = {
    name: ["otocevap", "oto"],
    description: 'Otomatik cevaplar :)',
    usage: 'oto'
};