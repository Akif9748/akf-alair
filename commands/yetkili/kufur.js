exports.run = async (client, message, args, guild) => {

    if (!message.member.isAdmin())
        return message.channel.send('Üzgünüm, buna yetkin yok :grinning:')

    guild.kufur = !guild.kufur;
    await guild.save();
   return message.channel.send("Küfür engeli " + (guild.kufur ? "**açıldı**" : "**kapatıldı**"))

};

exports.help = {
    name: ["küfür", "küfürengel"],
    description: 'Küfür engelleme sistemi',
    usage: 'küfür'
};