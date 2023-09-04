exports.run = async (client, message, args, guild) => {

    if (!message.member.isAdmin())
        return message.reply('Üzgünüm, buna yetkin yok :grinning:')

    const prefix = message.options?.getString("prefix").split(" ")[0] || args[0];

    if (!prefix || prefix == "!") {
        guild.prefix = "!";
        await message.reply("Prefix artık **varsayılan** olan **!**");
    } else {
        guild.prefix = prefix;
        await message.reply("Prefix artık **" + guild.prefix + "**");
    }
    await guild.save();

};

exports.help = {
    native: true,
    options: [{ name: "prefix", description: "Yeni prefix", type: 3 }],
    names: ["prefix"],
    description: 'Prefixi değiştirmek/sıfırlamak içindir.',
    usage: 'prefix [prefix]'
};