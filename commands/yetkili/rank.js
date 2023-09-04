exports.run = async (client, message, args, guild) => {

    if (!message.member.isAdmin())
        return message.reply('Üzgünüm, buna yetkin yok :grinning:')

    guild.rank = !guild.rank;

    await guild.save();
    message.reply(`Rank sistemi **${guild.rank ? "açıldı" : "kapatıldı"}**.`)

};

exports.help = {
    native: true,
    names: ["rank"],
    description: 'Rank sistemini açar/kapatır.',
    usage: 'rank'
};