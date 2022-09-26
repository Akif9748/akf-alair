const { emoji } = require("./config.json");
const { UserModel, GuildModel } = require("./models");
const ms = require("parse-ms");

/**
 * Bot komutları için olan türlerin açıklaması:
 */
const türler = {
    other: { ad: "Genel", emoji: '🏳', aciklama: 'Genel Kategorisi' },
    bot: { ad: "Bot", emoji: '🤖', aciklama: 'Bot ile ilgili komutlar' },
    muzik: { ad: "Müzik", emoji: '🎵', aciklama: 'Müzik komutları' },
    eglence: { ad: "Eğlence", emoji: '🕹', aciklama: 'Eğlence komutları' },
    oyun: { ad: "Oyun", emoji: '🎮', aciklama: 'Oyun komutları' },
    resim: { ad: "Resim", emoji: '🖼', aciklama: 'Resim düzenlemeli komutlar' },
    ekonomi: { ad: "Ekonomi", emoji: '💵', aciklama: 'Ekonomi komutları' },
    yetkili: { ad: "Yetkili", emoji: '🏅', aciklama: 'Yetkili komutları' },
    interaction: { ad: "Interaction", emoji: '🆕', aciklama: 'Interaction komutları' },
    sahip: { ad: "Sahip" }
};

/* methods */
const User = async userid => await UserModel.findOne({ userid }) || await UserModel.create({ userid });
const Guild = async guildId => await GuildModel.findOne({ guildId }) || await GuildModel.create({ guildId });
const delay = ms => new Promise(r => setTimeout(r, ms));
const parsems = sure => {
    const asr = ms(sure);
    return (asr.days ? `${asr.days} gün, ` : "") +
        (asr.hours ? `${asr.hours} saat, ` : "") +
        (asr.minutes ? `${asr.minutes} dakika, ` : "") +
        `${asr.seconds} saniye`;

}
const parsenum = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/**
 * Alair ana classes dosyası / Ara katman
 */
module.exports = {
    Alair: require("./alair.js"),  // Alair-Core
    User, Guild, delay, parsems, parsenum, //Metodlar
    emoji, türler, //Constantlar
};