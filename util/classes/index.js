const { emoji, token, renk, sahip } = require("../config.json");
const { Intents } = require("discord.js")
const intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES];

const { MemberModel, UserModel } = require("../models/");

const Guild = require("./Guild")

/**
 * Member tipi. Sadece XP ve Seviye
 */

class Member {


    /**
     * 
     * @param {Number} seviye 
     * @param {Number} xp 
     */
    constructor(seviye = 0, xp = 0, guild = null, user = null) {
        this.seviye = seviye;
        this.xp = xp;
        this.topxp = 0;
        this.guildid = guild;
        this.userid = user;
    }



    /**
     * Setup gibi bir şey.
     * @param {String} guild 
     * @param {String} user 
     * @returns 
     */

    async getId(guild, user) {
        this.guildid = guild;
        this.userid = user;

        let bilgi = await MemberModel.findOne({ userid: user, guildid: guild });

        if (!bilgi) {
            bilgi = new Member(0, 0, guild, user)
            await new MemberModel(this).save();
        }


        let { seviye = 0, xp = 0, topxp = 0 } = bilgi;
        this.seviye = seviye;
        this.xp = xp;
        this.topxp = topxp;
        return this;
    }

    /**
     * 
     * @returns {Number} Seviye atlamak için gerekli XPyi verir.
     */
    required() {

        return 100 + 50 * this.seviye //- this.xp

    }
    /**
       * @param {String} guild guild id
       * @param {String} user kullanıcı idi ile dbye veri akışı
       */
    async write(guildid = this.guildid, userid = this.userid) {
        await MemberModel.findOneAndUpdate({ userid, guildid }, this);
    }

}

/**
 * User tipi. Global. Sadece XP, para (now) ve Seviye
 */

class User extends Member {

    /**
     * 
     * @param {Number} seviye 
     * @param {Number} xp 
     * @param {Number} para 
     */
    constructor(seviye, xp, userid, para = 0, arduino = 0) {
        super(seviye, xp, userid);
        this.para = para;
        this.arduino = arduino;
        this.topxp = 0;
        this.timeout = {};
    }



    /**
     * 
     * @param {String} user User id
     * @returns 
     */
    async getId(userid) {
        this.userid = userid;

        let bilgi = await UserModel.findOne({ userid });
        if (!bilgi) {
            bilgi = new User(0, 0, userid)
            await new UserModel(this).save();
        }

        let { seviye = 0, xp = 0, para = 0, arduino = 0, topxp = 0, timeout = {} } = bilgi;
        this.seviye = seviye;
        this.xp = xp;
        this.para = para;
        this.arduino = arduino;
        this.topxp = topxp;
        this.timeout = timeout;
        return this
    }
    /**
     * 
     * @param {String} user kullanıcı idi ile dbye veri akışı
     */

    async write(userid = this.userid) {
        await UserModel.findOneAndUpdate({ userid }, this);
    }
}


/**
 * Bot komutları için olan türlerin açıklaması:
 */
const türler = {
    other: { ad: "Genel", emoji: '🏳', aciklama: 'Genel Kategorisi' },
    bot: { ad: "Bot", emoji: '🤖', aciklama: 'Bot ile ilgili komutlar' },
    eglence: { ad: "Eğlence", emoji: '🎮', aciklama: 'Eğlence komutları' },
    ekonomi: { ad: "Ekonomi", emoji: '💵', aciklama: 'Ekonomi komutları' },
    yetkili: { ad: "Yetkili", emoji: '🏅', aciklama: 'Yetkili komutları' },
    interaction: { ad: "Interaction", emoji: '🆕', aciklama: 'Interaction komutları' },
    sahip: { ad: "Sahip" }
};


/**
 * Türkçe harflerden arındırma fonksiyonu
 * @returns {String} Arındırılmış string
 */
const ingilizce = function () {
    return this
        .replace(/Ğ/g, "G")
        .replace(/ğ/g, "g")
        .replace(/Ü/g, "U")
        .replace(/ü/g, "u")
        .replace(/Ş/g, "S")
        .replace(/ş/g, "s")
        .replace(/İ/g, "I")
        .replace(/ı/g, "i")
        .replace(/Ö/g, "O")
        .replace(/ö/g, "o")
        .replace(/Ç/g, "C")
        .replace(/ç/g, "c");
};



const ms = require("parse-ms");
/**
 * 
 * @param {Number} sure MS cinsinden hem de
 * @returns {String}
 */
const parsems = sure => {
    const asr = ms(sure);
    return (asr.days ? `${asr.days} gün, ` : "") +
        (asr.hours ? `${asr.hours} saat, ` : "") +
        (asr.minutes ? `${asr.minutes} dakika, ` : "") +
        `${asr.seconds} saniye`;

}


const kullanim = { komut: 0, interaction: 0 };

const ayarlar = { renk, sahip, start: Date.now(), emoji, kullanim };

module.exports = { emoji, sahip, User, Member, Guild, türler, intents, ingilizce, parsems, ayarlar, token };