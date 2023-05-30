const Discord = require("discord.js");
const { Custom } = require("../../util/models");
const liste = require("../../util/functions/listeleyici");
const embed = new Discord.MessageEmbed().setName("Custom anahtar");

const gosterf = async (guildId) => {
    const sonuclar = await Custom.find({ guildId })
    if (!sonuclar.length) return null;
    return liste(sonuclar, embed, sonuc => `• **${sonuc.key}** => ${sonuc.value} (<@${sonuc.authorid}>)`)
}
const silf = (guildId, key) => Custom.findOneAndDelete({ guildId, key })
const eklef = async ({ guildId, authorid, key, value }) => {

    const yaz = await Custom.exists({ guildId, key })
    if (yaz) return ("Zaten böyle bir anahtar var ve dolu.")
    if (key.length > 2000 || value.length > 2000) return ("Değerler 2000 karakterden fazla olamaz.")
    await Custom.create({ guildId, authorid, key, value })
    return false;
}


/**
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").Message} message
 * @param {[String]} args String arrayı, mesaj içerikleri
 * @param {String} prefix Prefix
 */

exports.run = async (client, message, args, { prefix }) => {
    const { guildId, member } = message;
    if (!message.member.perm("MANAGE_MESSAGES")) return message.reply("Bunun için mesajları yönetme yetkin olmalı.")

    if (!args[0]) {

        const embeds = await gosterf(guildId)
        if (!embeds) return message.reply("**Doğru kullanımlar:**\n" +
            "**• Eklemek:** `" + prefix + "custom ekle anahtar değer`\n" +
            "**• Silmek:** `" + prefix + "custom sil anahtar`")

        return message.reply({ embeds })

    } else if (args[0] === "sil") {
        if (!args[1]) return message.reply(`Doğru kullanım: \`${prefix}custom sil anahtar\``)
        const sil = await silf(guildId, args[1].toLocaleLowerCase("tr"));
        return message.reply(sil ? "Anahtar silindi!" : "Böyle bir anahtar yok.");

    } else if (args[0] == "ekle") {
        if (!args[2]) return message.reply(`Doğru kullanım: \`${prefix}custom ekle anahtar değer\``)
        const yazma = await eklef({ guildId, authorid: member.id, key: args[1].toLocaleLowerCase("tr"), value: args.slice(2).join(" ") })
        return message.reply(yazma || "Anahtar eklendi!");
    } else return message.reply("**Doğru kullanımlar:**\n" +
        "**• Eklemek:** `" + prefix + "custom ekle anahtar değer`\n" +
        "**• Silmek:** `" + prefix + "custom sil anahtar`"
    )


};
/**
 * 
 * @param {import("discord.js").Client} client 
 * @param {import("discord.js").CommandInteraction} interaction 
 * @returns 
 */
exports.runInteraction = async (client, interaction) => {
    const { guildId, user } = interaction;
    if (!interaction.member.perm("MANAGE_MESSAGES")) return interaction.reply("Bunun için mesajları yönetme yetkin olmalı.")

    const subcommand = interaction.options.getSubcommand(true);

    if (subcommand === "göster") {

        const embeds = await gosterf(guildId)
        if (!embeds) return interaction.reply("**Hiç bir anahtar-değer kompleksiniz yok!**\n**Doğru kullanımlar:**\n" +
            "**• Eklemek:** `/custom ekle anahtar değer`\n" +
            "**• Silmek:** `/custom sil anahtar`\n" +
            "Bu komut ile, sunucunuza özel kelimelere özel yanıtlar ekleyebilirsiniz."
        )
        return interaction.reply({ embeds })

    } else if (subcommand === "sil") {
        const key = interaction.options.getString('anahtar').toLocaleLowerCase("tr")
        const sil = await silf(guildId, key);
        return interaction.reply(sil ? "Anahtar silindi!" : "Böyle bir anahtar yok.");

    } else if (subcommand === "ekle") {
        const key = interaction.options.getString('anahtar').toLocaleLowerCase("tr"),
            value = interaction.options.getString('değer'),
            yazma = await eklef({ guildId, authorid: user.id, key, value });

        return interaction.reply(yazma || "Anahtar eklendi!");
    }
}
exports.help = {
    name: ["custom"],
    description: 'Sunucuya özel Anahtar-Değer kompleksleri oluşturmanızı sağlar.',
    usage: 'custom [metod]',
    options: [
        { "type": 1, "name": "göster", "description": "Adınıza kayıtlı tüm customları gösterir!", "options": [] },
        { "type": 1, "name": "ekle", "description": "Yeni bir tane özel yanıt eklemenizi sağlar!", "options": [{ "type": 3, "name": "anahtar", "description": "Neyi yazınca tetikleyeceğini belirlersiniz!", "required": true }, { "type": 3, "name": "değer", "description": "Ne ile yanıt vereceğini belirlersiniz!", "required": true }] },
        {
            "type": 1, "name": "sil", "description": "Özel yanıtı kaldırmanı sağlar!", "options": [{ "type": 3, "name": "anahtar", "description": "Sileceğin tetikleyici anahtar!", "required": true }]
        }
    ]

};
