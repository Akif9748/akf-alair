const { User, emoji, parsems } = require("../../util");

exports.run = async (client, message, args) => {

    const user = { times } = await User(message.author.id, "times.gunluk para"),
        sure = 86400000,
        miktar = Math.floor(Math.random() * 2000) + 2000,
        asr = Date.now();

    if (times?.gunluk && sure - (asr - times.gunluk) > 0)
        return message.reply(`Günlük bonusunu zaten aldın canım, ${parsems(sure - (asr - times.gunluk))} sonra tekrar alabilirsin :)`)

    user.para += miktar;
    user.times.gunluk = asr;
    await user.save()

    return message.reply(`**${miktar} ATC** <:atacoin:${emoji.ata}> paranı verdim`)


};

exports.help = {
    name: ["günlük", "bonus"],
    description: 'Günlük bonus.',
    usage: 'günlük'
};