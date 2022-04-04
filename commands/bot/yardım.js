const Discord = require('discord.js')
const { MessageActionRow, MessageEmbed, MessageSelectMenu } = Discord;
const { türler } = require("../../util/classes");

exports.run = (client, message, args, prefix) => {
    const bag = '» Bağlantılar:', davet = `[Davet Linki](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands) & [Destek Sunucusu](https://discord.gg/9cBnKmjzvH)`,
        bilgi = `Bir komut hakkında daha fazla almak için \`${prefix}yardım komutadı\` yazın.`, ornek = `Örneğin \`${prefix}yardım çeviri\` gibi.`,
        av = client.user.displayAvatarURL(), baslık = `${client.user.username} • Yardım menüsü`, resim = message.member.displayAvatarURL(), isim = message.author.tag + " tarafından istendi"

    if (!args[0]) {

        const description = { anasayfa: "", ...türler }, embedler = {};

        for (const i in description) description[i] = "";

        for (const [key, value] of client.interactions)
            description.interaction += value.data.type === 1 ? `• **/${key}**: ${value.data.description}\n`
                : `• **${key}**: ${value.data.type === 3 ? "Mesaj" : "Kullanıcı"} tipi interaction\n`;

        for (const [key, value] of client.commands)
            if (!value.sayi && !value.help.gizli)
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
                .setTitle(`» ${türler[tür].emoji} ${türler[tür].ad} komutları:`).setAuthor({ name: baslık, iconURL: av })
                .setColor(client.renk).setTimestamp().addField(bag, davet).addField(bilgi, ornek)
                .setFooter({ iconURL: resim, text: isim })
        }


        embedler.anasayfa = new Discord.MessageEmbed()
            .setTitle("» Ana sayfa").setAuthor({ name: baslık, iconURL: av })
            .addField(":book: Sayfalar:", description.anasayfa).setFooter({ iconURL: resim, text: isim })
            .addField(':book: Kelime oyunu:', `\`${prefix}kelime\` Kelime oyunu başlatır. \`${prefix}kelimedur\` oyunu bitirir.`)
            .setColor(client.renk).setTimestamp().addField(bag, davet).addField(bilgi, ornek)


        message.reply({
            embeds: [embedler.anasayfa], components: [new MessageActionRow().addComponents(new MessageSelectMenu().addOptions(options).setPlaceholder('Hakkında yardım almak istediğin kategoriyi seçebilirsin!').setCustomId("main"))]
        }).then(m => 
            client.on('interactionCreate', interaction => {
                if (!interaction.isSelectMenu() || interaction.message.id !== m.id) return;
                if (interaction.user.id !== message.author.id) return interaction.reply({ content: 'Komutu sen kullanmadığın için değiştiremezsin.', ephemeral: true })

                interaction.deferUpdate();

                if (interaction.values[0] === "sil")
                    return m.delete()
                else
                    m.edit({ embeds: [embedler[interaction.values[0]]] })

            })
        )
    } else {

        const komut = client.commands.get(args[0].toLowerCase());

        if (komut && !komut.help.gizli) {
           
            const embed = new MessageEmbed()
                .setAuthor({ name: baslık, iconURL: av })
                .setTitle(`**${prefix + args[0]}** hakkında yardım`)
                .addField("Komut hakkında bilgi:", komut.help.description)
                .addField("Komut kullanımı:", prefix + komut.help.usage)
                .addField("Kategori:", türler[komut.tur].ad)
                .setColor(client.renk)
                .setFooter({ iconURL: resim, text: isim })
            return message.reply({ embeds: [embed] })
        } else {
            const embed = new MessageEmbed().setFooter({ iconURL: resim, text: isim })
                .setAuthor({ name: baslık, iconURL: av }).setColor(client.renk)
                .setTitle(`» Böyle bir komut bulunamadı, tüm komutlara erişmek için \`${prefix}yardım\` yazın.`)
            return message.reply({ embeds: [embed] })
        }
    }
};

exports.help = {
    name: ['yardım', "komutlar"],
    description: 'Komutlar hakkında bilgi verir.',
    usage: 'yardım'
};