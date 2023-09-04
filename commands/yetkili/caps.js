exports.run = async (client, message, args, guild) => {

    if (!message.member.isAdmin())
        return message.reply('Üzgünüm, buna yetkin yok :grinning:');

    guild.caps = !guild.caps;
    await guild.save();
    message.reply("Caps engeli " + (guild.caps ? "**açıldı**" : "**kapatıldı**"))

};

exports.help = {
    native: true,
    subcommand: "korumalar",
    names: ["caps", "capsengel"],
    description: 'Cümle tamamen büyük harften ibaretse siler.',
    usage: 'caps'
};