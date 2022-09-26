const Discord = require("discord.js");
const turkce = require("turkce");

exports.run = async (client, message, args) => {
    if (!args[0]) return message.reply('Bir kelime girmelisin.')


    try {

        const sonuc = await turkce(args[0]);
        if (!sonuc) return message.reply("Kelime yok!")
        const { kelime, anlam, lisan, ornek, atasozu }= sonuc;
        const embed = new Discord.MessageEmbed()
            .setColor('#ff0000')
            .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/5/51/Türk_Dil_Kurumu_logo.png')

        if (kelime)
            embed.addField('Kelime:', kelime)

        if (anlam)
            embed.addField('Anlam:', anlam)

        if (lisan)
            embed.addField('Lisan:', lisan)

        if (ornek?.ornek)
            embed.addField('Örnek:', `${ornek.ornek} ${(ornek?.yazar) ? "-Yazar: **" + ornek?.yazar + "**" : ""}`)

        if (atasozu)
            embed.addField('Atasözü:', atasozu)
       
        if (!embed.fields.length) return message.reply("Kelime hakkında yeterli bilgi yok!")

        return message.reply({ embeds: [embed] })
    } catch (e) {
        await message.reply(e.message)
        console.error(e)
    }
};

exports.help = {
    name: 'tdk',
    description: 'TDK apisini kullanarak yazdığınız kelime hakkında bilgi verir.',
    usage: 'tdk kelime'
};
