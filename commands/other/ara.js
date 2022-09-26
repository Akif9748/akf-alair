const Discord = require("discord.js");
const gis = require('async-g-i-s');
const { MessageActionRow, MessageButton, MessageEmbed } = Discord;
/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns 
 */
exports.run = async (client, message, args) => {

    if (!args[0]) return message.channel.send("Sorguyu yaz.")

    const aramaterimi = args.join(" ")


    try {

        const results = await gis(aramaterimi, { safe: message.channel.nsfw ? "off" : "on" });
        const embed = new MessageEmbed().setTitle("» Butonlara tıklayarak resmi değiştirebilirsiniz").setImage(results[0].url.replace(".gifv", ".gif"))
            .setFooter({ iconURL: message.member.displayAvatarURL(), text: message.member.displayName + " • Sayfa 1/" + results.length }).setName("Görsel Arama")

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('ilk')
                    .setEmoji("◀")
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('son')
                    .setEmoji("▶")
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('sil')
                    .setLabel('Mesajı sil').setEmoji("⚠")
                    .setStyle('DANGER')
            )

        const m = await message.reply({ embeds: [embed], components: [row] })

        const collector = m.channel.createMessageComponentCollector({ message: m, time: 5 * 60_000 });
        let sayfa = 1;

        const gidilcekler = {}

        collector.on('collect', async interaction => {
            try {
                const { id } = interaction.user;
                await interaction.deferUpdate()

                if (id !== message.author.id) {
                    if (id in gidilcekler === false)
                        gidilcekler[id] = sayfa;

                    if (interaction.customId == "ilk") {
                        if (gidilcekler[id] != 1)
                            gidilcekler[id]--;
                    }

                    else if (gidilcekler[id] != results.length)
                        gidilcekler[id]++;

                    const embeds = [embed

                        .setFooter({ text: `Sayfa ${gidilcekler[id]}/${results.length}` })
                        .setImage(results[gidilcekler[id] - 1].url.replace(".gifv", ".gif"))]

                    return await interaction.followUp({ embeds, ephemeral: true })

                } else {
                    if (interaction.customId == "sil")
                        return interaction.deleteReply();

                    if (interaction.customId == "ilk") {
                        if (sayfa != 1)
                            sayfa--;
                    }

                    else if (sayfa != results.length)
                        sayfa++;

                    const embeds = [embed.setFooter({ text: `Sayfa ${sayfa}/${results.length}` }).setImage(results[sayfa - 1].url.replace(".gifv", ".gif"))]

                    interaction.editReply({ embeds })
                        .catch(e => {
                            console.log(e)
                            if (sayfa != results.length) sayfa++
                            else sayfa--
                        })
                }
            } catch { }



        })
        collector.on("end", c => m.edit({ components: [] }).catch(_ => _))

    } catch (e) {
        return message.reply(`**Resim bulamadım!** ${message.channel.nsfw ? "Arama teriminizle ilgili hiç bir resim yok!" : "\nNOT: NSFW sonuçlar sadece NSFW kanallarda görüntülenebilir."}`)
    }


};

exports.help = {
    name: ['ara', 'bul'],
    description: 'Görsel arama',
    usage: 'ara istanbul'
};
