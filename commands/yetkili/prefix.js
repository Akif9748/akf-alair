
exports.run = async (client, message, args, guild) => {

    if (!message.member.isAdmin())
        return message.channel.send('Üzgünüm, buna yetkin yok :grinning:')

    if (!args[0]) return message.reply("Geçerli bir ön ek girdiğinizden emin olun.")

    if (args[0] == "!") {
        guild.prefix = "!";
     await message.channel.send("Prefix artık **varsayılan** olan **!**")

    } else {
        guild.prefix = args[0];
        await message.channel.send("Prefix artık **" + guild.prefix + "**")

    }
    await guild.save()

};

exports.help = {
    name: "prefix",
    description: 'Prefixi değiştirmek içindir.',
    usage: 'prefix'
};