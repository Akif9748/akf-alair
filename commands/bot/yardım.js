const { MessageActionRow, MessageEmbed, MessageSelectMenu } = require('discord.js');

const { turler } = require("../../util");

const options = [
    { label: "Ana Sayfa", description: "Ana sayfa, tüm kategorilerin listesi", value: "anasayfa", emoji: "📖" },
    { label: "Mesajı sil", description: "Yardım menüsünü imha eder!", value: "sil", emoji: "⚠" },
    ...turler.map(t => ({
        label: t.ad,
        description: t.aciklama,
        value: t.klasor,
        emoji: t.emoji
    }))
]
const anasayfa = turler.map(tur => `» ${tur.emoji} • ${tur.aciklama}`);
const bilgi2 = {
    name: "Bazı komutlar hem `interaction` hem de `prefix` ile kullanılabilirler",
    value: "Bu komutlar tabloda belirtilmiştir."
};

let aciklamalar;

/**
 * 
 * @param {import("discord.js").Client} client 
 * @param {import("discord.js").Message} message 
 * @param {*} args 
 * @param {*} param3 
 * @returns 
 */
exports.run = async (client, message, args, { prefix }) => {
    const bilgi = {
        name: `Bir komut hakkında daha fazla almak için \`${prefix}yardım komutadı\` yazın.`,
        value: `Örneğin \`${prefix}yardım bot\` gibi.`
    },
        footer = { iconURL: message.member.displayAvatarURL(), text: `${message.author.username} tarafından istendi` };


    if (message.options)
        args[0] = message.options.getString("komut");

    if (!args[0]) {
        if (!aciklamalar) {
            const komutlar = client.commands.filter(x => typeof x !== "string" && !x.help.gizli);
            aciklamalar = new Map(turler
                .filter(t => t.klasor !== "interaction") //
                .map(t => [t.klasor,
                komutlar.filter(x => x.tur === t.klasor).map((value, key) => ({
                    native: value.help.native,
                    description: value.help.description,
                    name: key,
                    slashName: value.help.subcommand ? `/${value.help.subcommand} ${key}` : `/${key}`,
                    usage: value.help.usage
                }))
                ]));

            aciklamalar.set("interaction", client.interactions.filter(x => !x.data.native).map(
                ({ data }, key) => {
                    data.type ||= 1;
                    return {
                        name: `${data.type === 1 ? "/" : ""}${key}`,
                        description: data.type === 1 ? (data.description || "**Subcommand** olarak kullanılabilir") : `**${data.type === 3 ? "Mesaj" : "Kullanıcı"}** arayüzünde bulunur`
                    }
                }
            ));
        }

        const embedler = {
            anasayfa: new MessageEmbed()
                .setTitle("» Ana sayfa")
                .addField(":book: Sayfalar:", anasayfa.join("\n"))
                .setName("Yardım menüsü")
                .setFooter(footer).addFields(bilgi)
        }

        for (const tur of turler)
            embedler[tur.klasor] = new MessageEmbed()
                .setTitle(`» ${tur.emoji} ${tur.ad} komutları:`)
                .setDescription(aciklamalar.get(tur.klasor).map(
                    x =>
                        //////////////////////
                        tur.klasor === "interaction" ?
                            `• \`${x.name}\`: ${x.description}`
                            :
                            //////////////////////
                            `${x.native ? `• \`${x.slashName}\` -` : "•"} \`${prefix + x.name}\`: ${x.description}`
                ).join("\n"))
                .setName("Yardım menüsü")
                .setFooter(footer).addFields(bilgi, bilgi2)

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
            const komutTur = turler.find(t => t.klasor === komut.tur)
            const embed = new MessageEmbed()
                .setName("Yardım menüsü")
                .setTitle(`\`${komut.help.names[0]}\` hakkında yardım`)
                .addField("Komutun tüm adları:", `\`\`\`${String(komut.help.names)}\`\`\``)
                .addField("Komut hakkında bilgi:", komut.help.description)
                .addField("Komut kullanımı:", prefix + komut.help.usage)
                .addField("Kategori:", komutTur.ad)
                .setFooter(footer);

            if (komut.help.native)
                embed.addField("🆕 Bu komut interaction desteklemektedir!", `\`/${komut.help.names[0]}\` olarak kullanılabilir`);

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
    names: ['yardım', "komutlar"],
    description: 'Komutlar hakkında bilgi verir.',
    usage: 'yardım [komut adı]',
    options: [
        { type: 3, name: "komut", description: "Komuta özel yardım", required: false }
    ]
};