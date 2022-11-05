const { hata } = require("../../util");
exports.run = async (client, message, args, guild) => {

    if (!message.member.isAdmin())
        return message.reply('Üzgünüm, buna yetkin yok :grinning:')

    if (!args[0]) return message.reply(hata(this, guild.prefix) + "Geçerli bir ön ek girdiğinizden emin olun.")

    if (args[0] == "!") {
        guild.prefix = "!";
        await message.reply("Prefix artık **varsayılan** olan **!**")

    } else {
        guild.prefix = args[0];
        await message.reply("Prefix artık **" + guild.prefix + "**")

    }
    await guild.save()

};

exports.help = {
    name: "prefix",
    description: 'Prefixi değiştirmek içindir.',
    usage: 'prefix <prefix>'
};