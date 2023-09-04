process.env.TZ = "Europe/Istanbul";
const { UserModel, GuildModel } = require("./models");
const logger = require("./lib/logger");
const { setTimeout } = require("node:timers/promises");
const Resolvers = require("./lib/resolvers");
const { cache: gCache } = GuildModel.schema;
const { cache: uCache } = UserModel.schema;
const config = require("./config");
const engChars = {
    "Ğ": "G",
    "Ü": "U",
    "Ş": "S",
    "İ": "I",
    "Ö": "O",
    "Ç": "C",
    "ğ": "g",
    "ü": "u",
    "ş": "s",
    "ı": "i",
    "ö": "o",
    "ç": "c"
};


/**
 * Alair ana classes dosyası / Ara katman
 */
module.exports = {
    ...require("./lib/alair.js"),  // Alair-Core, Alair-Embed
    logger,
    config, // config.json
    Resolvers,
    /* Metodlar */
    User: async (_id,/* _select = ""*/) =>
        uCache.get(_id) ||
        await UserModel.findById(_id/*, select*/).then(uCache.feed) ||
        await UserModel.create({ _id }),
    Guild: async _id =>
        gCache.get(_id) ||
        await GuildModel.findById(_id).then(gCache.feed) ||
        await GuildModel.create({ _id }),
    delay: setTimeout,
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
    toEN: str => str.split("").map(c => engChars[c] || c).join(""),
    /**
     * Değişkenler
     */
    emoji: config.emoji,

    /**
     * Bot komutları renderlenecek olan türlerin açıklaması:
    */
    turler: [
        {
            klasor: 'other',
            ad: 'Genel',
            emoji: '🏳',
            aciklama: 'Genel komutlar'
        },
        {
            klasor: 'bot',
            ad: 'Bot',
            emoji: '🤖',
            aciklama: 'Bot ile ilgili komutlar'
        },
        {
            klasor: 'eglence',
            ad: 'Eğlence',
            emoji: '🕹',
            aciklama: 'Eğlence komutları'
        },
        {
            klasor: 'ekonomi',
            ad: 'Ekonomi',
            emoji: '💵',
            aciklama: 'Ekonomi komutları'
        },
        {
            klasor: 'yetkili',
            ad: 'Yetkili',
            emoji: '🏅',
            aciklama: 'Yetkili komutları'
        },
        {
            klasor: 'interaction',
            ad: 'Interaction',
            emoji: '🆕',
            aciklama: 'Interaction komutları'
        },
        // { klasor: 'sahip', ad: 'Sahip' }
    ]
};