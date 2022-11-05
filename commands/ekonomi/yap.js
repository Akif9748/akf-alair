const { User, emoji, parsems } = require("../../util");

module.exports = {
    help: {
        name: ["arduinoyap", "yap", "üret"],
        description: "Arduino üretirsin.",
        usage: 'arduinoyap'
    },

    async run(client, message, args) {
        const user = await User(message.author.id, "times.arduino arduino"),
            sure = 1000 * 60 * 2,
            asr = Date.now();


        if (user.times?.arduino && sure - (asr - user.times.arduino) > 0)
            return message.reply(`Bunu şu süre boyunca yapamazsın: ${parsems(sure - (asr - user.times.arduino))}`)


        const amount = Math.floor(Math.random() * 5) + 1;
        user.arduino += amount;
        user.times.arduino = asr;
        await user.save()
        await message.reply(`**${amount} Arduino** <:arduino:${emoji.arduino}> ürettin.`)
        await message.react(emoji.arduino);

    }
}