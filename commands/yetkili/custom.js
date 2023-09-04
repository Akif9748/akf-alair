const Discord = require("discord.js");
const { Custom } = require("../../util/models");
const liste = require("../../util/functions/listeleyici");
const embed = new Discord.MessageEmbed().setName("Custom anahtar");

/**
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").Message} message
 * @param {[String]} args String arrayı, mesaj içerikleri
 * @param {String} prefix Prefix
 */

exports.run = async (client, message, args, { prefix }) => {
    const { guildId, member } = message;
    if (!message.member.perm("MANAGE_MESSAGES")) return message.reply("Bunun için mesajları yönetme yetkin olmalı.")
    const subcommand = message.options?.getSubcommand() || args[0];

    if (!subcommand || subcommand === "göster") {
        const sonuclar = await Custom.find({ guildId })

        const bilgi = message.options ? "**Hiç bir anahtar-değer kompleksiniz yok!**\n**Doğru kullanımlar:**\n" +
            "**• Eklemek:** `/custom ekle anahtar değer`\n" +
            "**• Silmek:** `/custom sil anahtar`\n" +
            "Bu komut ile, sunucunuza özel kelimelere özel yanıtlar ekleyebilirsiniz." :
            "**Doğru kullanımlar:**\n" +
            "**• Eklemek:** `" + prefix + "custom ekle anahtar değer`\n" +
            "**• Silmek:** `" + prefix + "custom sil anahtar`";

        if (!sonuclar.length) return message.reply(bilgi);

        const embeds = liste(sonuclar, embed, sonuc => `• **${sonuc.key}** => ${sonuc.value} (<@${sonuc.authorid}>)`);

        return message.reply({ embeds })

    } else if (subcommand === "sil") {

        const key = message.options?.getString('anahtar') || args[1];
        if (!key) return message.reply(`Doğru kullanım: \`${prefix}custom sil anahtar\``)

        const sil = await Custom.findOneAndDelete({ guildId, key: key.toLocaleLowerCase("tr") });
        return message.reply(sil ? "Anahtar silindi!" : "Böyle bir anahtar yok.");
    } else if (subcommand == "ekle") {

        let key, value;
        if (message.options) {
            key = message.options.getString('anahtar');
            value = message.options.getString('değer');
        } else {
            if (!args[2]) return message.reply(`Doğru kullanım: \`${prefix}custom ekle anahtar değer\``);
            key = args[1];
            value = args.slice(2).join(" ");
        }

        const yaz = await Custom.exists({ guildId, key });
        if (key.length > 2000 || value.length > 2000) return message.reply("Değerler 2000 karakterden fazla olamaz.");
        if (yaz) return message.reply("Zaten böyle bir anahtar var ve dolu.");
        await Custom.create({ guildId, authorid: member.id, key: key.toLocaleLowerCase("tr"), value });

        return message.reply("Anahtar eklendi!");

    } else {
        return message.reply("**Doğru kullanımlar:**\n" +
            "**• Eklemek:** `" + prefix + "custom ekle anahtar değer`\n" +
            "**• Silmek:** `" + prefix + "custom sil anahtar`"
        )
    }


};

exports.help = {
    native: true,
    names: ["custom"],
    description: 'Sunucuya özel cevaplar oluşturmanızı sağlar.',
    usage: 'custom [metod]',
    options: [
        { "type": 1, "name": "göster", "description": "Adınıza kayıtlı tüm customları gösterir!", "options": [] },
        { "type": 1, "name": "ekle", "description": "Yeni bir tane özel yanıt eklemenizi sağlar!", "options": [{ "type": 3, "name": "anahtar", "description": "Neyi yazınca tetikleyeceğini belirlersiniz!", "required": true }, { "type": 3, "name": "değer", "description": "Ne ile yanıt vereceğini belirlersiniz!", "required": true }] },
        {
            "type": 1, "name": "sil", "description": "Özel yanıtı kaldırmanı sağlar!", "options": [{ "type": 3, "name": "anahtar", "description": "Sileceğin tetikleyici anahtar!", "required": true }]
        }
    ]

};
