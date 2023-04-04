const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const { Custom } = require("../util/models");
const liste = require("../util/functions/listeleyici");
/**
 * 
 * @param {import("discord.js").Client} client 
 * @param {import("discord.js").CommandInteraction} interaction 
 * @returns 
 */
exports.run = async (client, interaction) => {
    const { guildId, user } = interaction;
    if (!interaction.member.perm("MANAGE_MESSAGES")) return interaction.reply("Bunun için mesajları yönetme yetkin olmalı.")

    const subcommand = interaction.options.getSubcommand(true);
    const embed = new Discord.MessageEmbed().setName("Custom anahtar")

    if (subcommand === "göster") {

        const sonuclar = await Custom.find({ guildId })
        if (!sonuclar.length) return interaction.reply("**Hiç bir anahtar-değer kompleksiniz yok!**\n**Doğru kullanımlar:**\n" +
            "**• Eklemek:** `/custom ekle anahtar değer`\n" +
            "**• Silmek:** `/custom sil anahtar`\n" +
            "Bu komut ile, sunucunuza özel kelimelere özel yanıtlar ekleyebilirsiniz."
        )

        return interaction.reply({
            embeds: liste(sonuclar, embed, sonuc => `• **${sonuc.key}** => ${sonuc.value} (<@${sonuc.authorid}>)`)
        })

    } else if (subcommand === "sil") {
        const key = interaction.options.getString('anahtar').toLocaleLowerCase("tr")

        const sil = await Custom.findOneAndDelete({ guildId, key })

        if (!sil) return interaction.reply("Böyle bir anahtar yok.")

        return interaction.reply("Anahtar silindi!");

    } else if (subcommand === "ekle") {
        const key = interaction.options.getString('anahtar').toLocaleLowerCase("tr")

        const yaz = await Custom.exists({ guildId, key })
        if (yaz) return interaction.reply("Zaten böyle bir anahtar var ve dolu.")
        const value = interaction.options.getString('değer');
        if (key.length > 2000 || value.length > 2000) return interaction.reply("Değerler 2000 karakterden fazla olamaz.")
        await Custom.create({ guildId, authorid: user.id, key, value })

        return interaction.reply("Anahtar eklendi!");

    }
}

exports.data = new SlashCommandBuilder()
    .setName('custom')
    .setDescription('Sunucuya özel yanıtlar eklemenizi sağlar!')
    .addSubcommand(subcommand =>
        subcommand
            .setName('göster')
            .setDescription('Adınıza kayıtlı tüm customları gösterir!')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('ekle')
            .setDescription('Yeni bir tane özel yanıt eklemenizi sağlar!')
            .addStringOption(option => option.setName('anahtar').setDescription('Neyi yazınca tetikleyeceğini belirlersiniz!').setRequired(true))
            .addStringOption(option => option.setName('değer').setDescription('Ne ile yanıt vereceğini belirlersiniz!').setRequired(true))

    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('sil')
            .setDescription('Özel yanıtı kaldırmanı sağlar!')
            .addStringOption(option => option.setName('anahtar').setDescription('Sileceğin tetikleyici anahtar!').setRequired(true))


    );