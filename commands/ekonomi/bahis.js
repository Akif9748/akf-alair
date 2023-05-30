const { User, delay, random } = require("../../util");
const emojiler = ["🍇", "🍊", "🍒"];

exports.run = async (client, message, args) => {
    const bahis = parseInt(args[0]);

    if (!bahis || bahis <= 0) return message.hata("Miktarı girmeyi unuttunuz.")

    const kul = await User(message.author.id, "para");
    if (kul.para < bahis) return message.reply("Paran buna yetmiyor :)")
    await delay(random(500, 3000));

    if (Math.random() < 0.5) {
        kul.para += bahis;
        const rndm = emojiler[Math.floor(Math.random() * emojiler.length)];
        await message.reply(`${Array(3).fill(rndm).join(" **:** ")}\n\`\`\`Kazandın. Paranı verdim.\`\`\``)
    } else {
        kul.para -= bahis;
        const rndm1 = emojiler[Math.floor(Math.random() * emojiler.length)];
        const rndm2 = emojiler[Math.floor(Math.random() * emojiler.length)];
        let rndm3;
        do {
            rndm3 = emojiler[Math.floor(Math.random() * emojiler.length)];
        } while (rndm3 == rndm1 && rndm3 == rndm2);
        
        await message.reply(`${rndm1} **:** ${rndm2} **:** ${rndm3}\n\`\`\`Kaybettin. Paranı aldım.\`\`\``);
    }
    await kul.save()

};

exports.help = {
    name: ["bahis", "slot"],
    description: 'Botla bahse gir!',
    usage: 'bahis <miktar>'
};