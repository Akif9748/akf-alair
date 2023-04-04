const { User } = require("../../util");

exports.run = async (client, message, args, { prefix }) => {
    const bahis = parseInt(args[0]);

    if (!bahis|| parseInt(args[0]) <= 0) return message.hata("Miktarı girmeyi unuttunuz.")

    const kul = await User(message.author.id, "para");
    if (kul.para < bahis) return message.reply("Paran buna yetmiyor :)")

    if (Math.random() < 0.5) {
        kul.para += bahis;
        await message.reply("Kazandın. Paranı verdim.")
    } else {
        kul.para -= bahis;
        await message.reply("Kaybettin. Paranı aldım.")
    }
    await kul.save()

};

exports.help = {
    name: ["bahis"],
    description: 'Botla bahse gir!',
    usage: 'bahis <miktar>'
};