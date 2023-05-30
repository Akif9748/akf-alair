const Discord = require('discord.js')
const { MessageActionRow, MessageEmbed, MessageSelectMenu } = Discord;
const { türler } = require("../../util");

/**
 * 
 * @param {import("discord.js").Client} client 
 * @param {import("discord.js").Message} message 
 * @param {*} args 
 * @param {*} param3 
 * @returns 
 */
exports.run = async (client, message, args, { prefix }) => {
    const bilgi = `Bir komut hakkında daha fazla almak için \`${prefix}yardım komutadı\` yazın.`, ornek = `Örneğin \`${prefix}yardım çeviri\` gibi.`,
        footer = { iconURL: message.member.displayAvatarURL(), text: `${message.author.tag} tarafından istendi` }

   if (message.options)
       args[0] = message.options.getString("komut");

    if (!args[0]) {

        const description = { anasayfa: "", ...türler }, embedler = {};

        for (const i in description) description[i] = "";

        for (const [key, value] of client.interactions)
            description.interaction += value.data.type === 1 ? `• **/${key}**: ${value.data.description}\n`
                : `• **${key}**: ${value.data.type === 3 ? "Mesaj" : "Kullanıcı"} tipi interaction\n`;

        for (const [key, value] of client.commands)
            if (typeof value !== "string" && !value.help.gizli)
                description[value.tur] += `• **${prefix + key}**: ${value.help.description}\n`;

        const options = [{ label: "Ana Sayfa", description: "Ana sayfa, tüm kategorilerin listesi", value: "anasayfa", emoji: "📖" }, { label: "Mesajı sil", description: "Yardım menüsünü imha eder!", value: "sil", emoji: "⚠" }];

        for (const tür in türler) {
            if (tür === "sahip") continue;

            description.anasayfa += `» ${türler[tür].emoji} • ${türler[tür].aciklama}\n`

            options.push(
                {
                    label: türler[tür].ad,
                    description: türler[tür].aciklama,
                    value: tür, emoji: türler[tür].emoji
                }
            )

            embedler[tür] = new Discord.MessageEmbed().setDescription(description[tür])
                .setTitle(`» ${türler[tür].emoji} ${türler[tür].ad} komutları:`)
                .setTimestamp().addField(bilgi, ornek).setName("Yardım menüsü")

                .setFooter(footer)
        }


        embedler.anasayfa = new Discord.MessageEmbed()
            .setTitle("» Ana sayfa").setName("Yardım menüsü")
            .addField(":book: Sayfalar:", description.anasayfa).setFooter(footer)
            .setTimestamp().addField(bilgi, ornek)


        const m = await message.reply({ fetchReply: true, embeds: [embedler.anasayfa], components: [client.BUTONLAR, new MessageActionRow().addComponents(new MessageSelectMenu().addOptions(options).setPlaceholder('Hakkında yardım almak istediğin kategoriyi seçebilirsin!').setCustomId("main"))] })
        const collector = m.createMessageComponentCollector({ idle: 5 * 60_000 });

        collector.on('collect', async interaction => {

            if (interaction.user.id !== message.author.id) return interaction.reply({ content: 'Komutu sen kullanmadığın için değiştiremezsin.', ephemeral: true })
            try {

                await interaction.deferUpdate();

                if (interaction.values[0] === "sil")
                    return interaction.deleteReply()
                else
                    return interaction.editReply({ embeds: [embedler[interaction.values[0]]] })

            } catch { }

        });


        collector.on("end", () => m.edit({ components: [client.BUTONLAR] }).catch(_ => _))


    } else {
        let komut = client.commands.get(args[0].toLowerCase());

        if (typeof komut === "string")
            komut = client.commands.get(komut);

        if (komut && !komut.help.gizli) {

            const embed = new MessageEmbed()
                .setName("Yardım menüsü").setTitle(`**${prefix + args[0]}** hakkında yardım`)
                .addField("Komut hakkında bilgi:", komut.help.description)
                .addField("Komut kullanımı:", prefix + komut.help.usage)
                .addField("Kategori:", türler[komut.tur].ad)

                .setFooter(footer)
            return message.reply({ embeds: [embed] })
        } else {
            const embed = new MessageEmbed().setFooter(footer)
                .setName("Yardım menüsü").setTitle(`» Böyle bir komut bulunamadı, tüm komutlara erişmek için \`${prefix}yardım\` yazın.`)
            return message.reply({ embeds: [embed] })
        }
    }
};

exports.help = {
    native: true,
    name: ['yardım', "komutlar"],
    description: 'Komutlar hakkında bilgi verir.',
    usage: 'yardım [komut adı]',
    options: [
        { "type": 3, "name": "komut", "description": "Komuta özel yardım", "required": false }
    ]
};