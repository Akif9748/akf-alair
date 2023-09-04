const Discord = require("discord.js");
const turkce = require("turkce");


exports.run = async (client, message, args) => {
    const klm = message.options?.getString("kelime") || args.join(' ');
    if (!klm) return message.hata('Bir kelime girmelisin.')


    try {

        const sonuc = await turkce(klm);
        if (!sonuc) return message.reply("TDK'de böyle bir kelime yok!")
        const { kelime, anlam, lisan, ornek, atasozu } = sonuc;
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

        if (!embed.data.fields.length) return message.reply("Kelime hakkında yeterli bilgi yok!")

        return message.reply({ embeds: [embed] })
    } catch (e) {
        await message.reply(e.message)
        client.logger.ierror("TDK Komutu", e);
    }
};

exports.help = {
    native: true,
    options: [
        {
            name: "kelime", description: "TDK'de aranacak kelime.", type: 3, required: true
        }
    ],
    names: ["tdk"],
    description: 'TDK apisini kullanarak yazdığınız kelime hakkında bilgi verir.',
    usage: 'tdk <kelime>'
};
