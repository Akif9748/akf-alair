const { User } = require("../../util");

exports.run = async (client, message, args) => {
    if (!Number(args[0]) || Number(args[0]) <= 0) return message.reply("Kaç parayla gireceğini yaz.")

    const bahis = Number(args[0]);
    const kul = await User(message.author.id, "para");
    if (kul.para <= bahis) return message.reply("Paran buna yetmiyor :)")

    if (Math.random() < 0.5) {
        kul.para += bahis
        await message.reply("Kazandın. Paranı verdim.")
    } else {
        kul.para -= bahis
        await message.reply("Kaybettin. Paranı aldım.")
    }
    await kul.save()

};

exports.help = {
    name: ["bahis"],
    description: 'Botla bahse gir!',
    usage: 'bahis miktar'
};