const { UserModel, GuildModel } = require("./models");
const { getCache, feedCache } = GuildModel.schema;
const config = require("./config");

/**
 * Alair ana classes dosyası / Ara katman
 */
module.exports = {
    ...require("./alair.js"),  // Alair-Core, Alair-Embed
    config, // config.json
    /* Metodlar */
    User: async (_id, select = "") => await UserModel.findById(_id, select) || await UserModel.create({ _id }),
    Guild: async _id =>
        getCache(_id) ||
        await GuildModel.findById(_id).then(feedCache) || await GuildModel.create({ _id }),
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

    /**
     * Değişkenler
     */

    emoji: config.emoji,

    /**
     * Bot komutları için olan türlerin açıklaması:
    */
    türler: {
        other: { ad: "Genel", emoji: '🏳', aciklama: 'Genel komutlar' },
        bot: { ad: "Bot", emoji: '🤖', aciklama: 'Bot ile ilgili komutlar' },
        eglence: { ad: "Eğlence", emoji: '🕹', aciklama: 'Eğlence komutları' },
        ekonomi: { ad: "Ekonomi", emoji: '💵', aciklama: 'Ekonomi komutları' },
        yetkili: { ad: "Yetkili", emoji: '🏅', aciklama: 'Yetkili komutları' },
        interaction: { ad: "Interaction", emoji: '🆕', aciklama: 'Interaction komutları' },
        sahip: { ad: "Sahip" }
    }
};