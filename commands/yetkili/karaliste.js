const { hata } = require("../../util");

exports.run = async (client, message, args, guild) => {

    if (!message.member.isAdmin())
        return message.reply('Üzgünüm, buna yetkin yok :grinning:')
    if (!args[0]) return message.reply(hata(this, guild.prefix) + "Komut kullanılamayacak kanalı etiketleyin.")
    const kanal = message.guild.channels.cache.get(args[0].replace("!", "").replace("<#", "").replace(">", ""))
    if (!kanal) return message.reply("Böyle bir kanal yok")

    const durum = guild.blacklist.includes(kanal.id);

    if (!durum) {
        guild.blacklist.push(kanal.id)
        await guild.save();
        return message.reply(`${kanal} kanalında artık komut kullanılamaz.`)
    } else {
        guild.blacklist = guild.blacklist.filter(item => item !== kanal.id)
        await guild.save();
        return message.reply("Kilidi tekrardan açtım!")
    }


};

exports.help = {
    name: "karaliste",
    description: 'Dilediğiniz kanalda komutlara yanıt vermeyi keser.',
    usage: 'karaliste <#kanal>'
};
