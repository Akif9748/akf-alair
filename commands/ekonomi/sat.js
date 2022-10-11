const { User, emoji } = require("../../util");

module.exports = {

    help: {
        name: ["arduinosat", "sat"],
        description: "Elindeki Arduinoları satarsın",
        usage: 'arduinosat miktar'
    },

    async run(client, message, args) {
        const kul = await User(message.author.id,"arduino para");
        let { arduino = 0 } = kul;
        if (!arduino) return message.channel.send('Hiç Arduinon yok ki, B R U H')

        let sayi = Number(args[0]);
        if (!sayi) return message.channel.send('Satılacak Arduino sayısı yazın.')

        if (sayi > arduino) return message.channel.send(`Elinde sadece ${arduino} arduino var ama.`);

        let fiyat = (Math.floor(Math.random() * 500) + 500) * sayi;

        kul.arduino -= sayi;
        kul.para += fiyat;
        await kul.save()
        await message.reply(`**${sayi} Arduino** <:arduino:${emoji.arduino}> satarak **${fiyat} ATC** <:atacoin:${emoji.ata}> kazandın.`);
        await message.react(emoji.arduino);


    }
}