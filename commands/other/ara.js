const { MessageEmbed } =require("discord.js");
const gis = require('async-g-i-s');
const sayfa = require("../../util/functions/sayfa");

/**
 * 
 * @param {import("discord.js").Client} client 
 * @param {import("discord.js").Message} message 
 * @param {Array} args 
 * @returns 
 */
exports.run = async (client, message, args) => {
    const aramaterimi = message.options?.getString("sorgu") || args.join(" ");
    if (!aramaterimi) return message.hata()

    try {

        const results = await gis(aramaterimi, {
            query: { hl: "tr", safe: message.channel.nsfw ? "off" : "on" }
        });
        const embed = new MessageEmbed().setTitle("» Butonlara tıklayarak resmi değiştirebilirsiniz").setImage(results[0].url.replace(".gifv", ".gif"))
            .setFooter({ iconURL: message.member.displayAvatarURL(), text: message.member.displayName + " • Sayfa 1/" + results.length }).setName("Görsel Arama")


        sayfa(message, { embeds: [embed] }, results.length, (reply, sayfa) => {
            const embeds = [embed
                .setFooter({ iconURL: message.member.displayAvatarURL(), text: message.member.displayName + `• Sayfa ${sayfa}/${results.length}` })
                .setImage(results[sayfa - 1].url.replace(".gifv", ".gif"))]

            return reply({ embeds });

        });

    } catch (e) {
        return message.reply(`**Resim bulamadım!** ${message.channel.nsfw ? "Arama teriminizle ilgili hiç bir resim yok!" : "\nNOT: NSFW sonuçlar sadece NSFW kanallarda görüntülenebilir."}`)
    }


};

exports.help = {
    native: true,
    names: ['ara', 'bul'],
    description: 'Görsel arama',
    usage: 'ara <sorgu>',
    options: [
        { type: 3, name: "sorgu", description: "Arayacağım şeyi gir!", required: true }
    ]
};