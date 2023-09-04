const { Resolvers } = require("../../util");

exports.run = async (client, message, args, guild) => {

    if (!message.member.isAdmin())
        return message.reply('Üzgünüm, buna yetkin yok :grinning:')


    const kanal = message.options?.getChannel("kanal") || Resolvers.Channel({ message, type: "text" });
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
    native: true,
    options: [
        {
            name: "kanal", description: "Komut kullanılamayacak kanalı etiketleyin.", type: 7, required: true
        }
    ],
    names: ["karaliste"],
    description: 'Dilediğiniz kanalda komutlara yanıt vermeyi keser.',
    usage: 'karaliste <#kanal>'
};
