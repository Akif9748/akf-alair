const { User, emoji, parsems } = require("../../util");
const { random } = require("../../util");

exports.run = async (client, message, args) => {

    const user = await User(message.author.id, "times.gunluk para"),
        sure = 86400000,
        miktar = random(2000,4500),
        asr = Date.now();

    if (user.times?.gunluk && sure - (asr - user.times.gunluk) > 0)
        return message.reply(`Günlük bonusunu zaten aldın canım, ${parsems(sure - (asr - user.times.gunluk))} sonra tekrar alabilirsin :)`)

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