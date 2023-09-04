exports.run = async (client, message, args, guild) => {

    if (!message.member.isAdmin())
        return message.reply('Üzgünüm, buna yetkin yok :grinning:')

    guild.kufur = !guild.kufur;
    await guild.save();
   return message.reply("Küfür engeli " + (guild.kufur ? "**açıldı**" : "**kapatıldı**"))

};

exports.help = {
    native: true,
    subcommand: "korumalar",
    names: ["küfür", "küfürengel"],
    description: 'Küfür engelleme sistemi',
    usage: 'küfür'
};