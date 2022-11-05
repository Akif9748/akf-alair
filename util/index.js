const { UserModel, GuildModel } = require("./models");

/**
 * Alair ana classes dosyası / Ara katman
 */
module.exports = {
    Alair: require("./alair.js"),  // Alair-Core

    /* Metodlar */
    User: async (_id, select = "") => await UserModel.findById(_id, select) || await UserModel.create({ _id }),
    Guild: async (_id, select = "") => await GuildModel.findById(_id, select) || await GuildModel.create({ _id }),
    delay: require("node:timers/promises").setTimeout,
    parsems(sure) {
        // taken from parse-ms
        const gun = Math.trunc(sure / 86400000),
            saat = Math.trunc(sure / 3600000) % 24,
            dakika = Math.trunc(sure / 60000) % 60,
            saniye = Math.trunc(sure / 1000) % 60;

        return `${gun ? `${gun} gün, ` : ""}${saat ? `${saat} saat, ` : ""}${dakika ? `${dakika} dakika, ` : ""}${saniye} saniye`;

    },
    random: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    parsenum: num => String(num).replace(/\B(?=(\d{3})+(?!\d))/g, "."),
    hata: (dosya, prefix) => `Doğru kullanım:\n\`\`\`${prefix + dosya.help.usage}\`\`\`\n`,

    /**
     * Değişkenler
     */

    emoji: require("./config.json").emoji,
    URL_REGEX: /((https?:\/\/(?:www\.|(?!www))?[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})|discord.gg\/.*)/g,

    /**
     * Bot komutları için olan türlerin açıklaması:
    */
    türler: {
        other: { ad: "Genel", emoji: '🏳', aciklama: 'Genel Kategorisi' },
        bot: { ad: "Bot", emoji: '🤖', aciklama: 'Bot ile ilgili komutlar' },
        eglence: { ad: "Eğlence", emoji: '🕹', aciklama: 'Eğlence komutları' },
        ekonomi: { ad: "Ekonomi", emoji: '💵', aciklama: 'Ekonomi komutları' },
        yetkili: { ad: "Yetkili", emoji: '🏅', aciklama: 'Yetkili komutları' },
        interaction: { ad: "Interaction", emoji: '🆕', aciklama: 'Interaction komutları' },
        sahip: { ad: "Sahip" }
    }
};