const { User, emoji, hata } = require("../../util");
exports.run = async (client, message, args, { prefix }) => {

    if (!args[1]) return ogret();

    const şanslı = message.üye();
    if (!şanslı) return ogret();
    const para = Number(args[1])
    if (!para || para < 0) return ogret()

    const kul = await User(message.author.id, "para")

    if (kul.para < para) return message.reply("Paran buna yetmiyor :)")

    const user2 = await User(şanslı.id, "para")
    kul.para -= para;
    user2.para += para;
    await kul.save()
    await user2.save()
    return message.reply(`${şanslı}, ${message.author} sana **${para} ATC** <:atacoin:${emoji.ata}> gönderdi`)

    function ogret() {
        return message.reply(hata(this, prefix));
    }
};

exports.help = {
    name: ["gönder"],
    description: 'Para gönderme komutu.',
    usage: 'gönder <@kişi> <miktar>'
};