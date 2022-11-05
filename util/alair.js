/**
 * Alair-Core,
 * Client,
 * prototype handler 
 */
const Discord = require("discord.js");
const { UserModel } = require("./models");
const { emoji, token, renk, sahip, tokenBeta, sunucu } = require("./config.json");
const ayarlar = { renk, sahip, start: Date.now(), emoji, kullanim: { komut: 0, interaction: 0 } };

/* alair-prototype-system */

Discord.GuildMember.prototype.isOwner = function () {
    return this.client.ayarlar.sahip.includes(this.id)
}

Discord.GuildMember.prototype.perm = function (yetki) {
    return this.isOwner(this.id) || this.permissions.has(yetki);
}

Discord.GuildMember.prototype.isAdmin = function () {
    return this.perm("ADMINISTRATOR");
}

Discord.Message.prototype.üye = function () {
    const args = this.content.split(/ +/g).filter(Boolean).slice(1);

    return this.mentions.members.first() ||
        this.guild.members.cache.get(args[1]) ||
        this.guild.members.cache.find(m => m.displayName.toLowerCase() === args.join(" ").toLowerCase()) ||
        this.member;

}

/* nodejs-prototype */

Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)]
}

// İngilizce karakter dönüşümü:
String.prototype.toEN = function () {
    return this//UPPERS:     // LOWERS:
        .replaceAll("Ğ", "G").replaceAll("ğ", "g")
        .replaceAll("Ü", "U").replaceAll("ü", "u")
        .replaceAll("Ş", "S").replaceAll("ş", "s")
        .replaceAll("İ", "I").replaceAll("ı", "i")
        .replaceAll("Ö", "O").replaceAll("ö", "o")
        .replaceAll("Ç", "C").replaceAll("ç", "c")
};


let iconURL, name;
module.exports = class Alair extends Discord.Client {
    constructor(opts) {
        super(opts);
        this.token = process.platform === "linux" ? token : tokenBeta;
        this.ayarlar = ayarlar;
        this.version = require("../package.json").version;
        this.blacklist = []
        this.wh = require("./wh.js");
        this.sunucu = sunucu;
        this.commands = new Discord.Collection();
        this.interactions = new Discord.Collection();

        this.login().then(_ => {
            this.davet = `https://discord.com/api/oauth2/authorize?client_id=${this.user.id}&permissions=8&scope=bot%20applications.commands`
            iconURL = this.user.displayAvatarURL();
            name = this.user.username;
        });

    }
    async userBlock(_id) {
        if (_id) {
            const kisi = await UserModel.findById(_id, "blacklist");
            kisi.blacklist = true;
            await kisi.save();
        }
        const kisiler = await UserModel.find({ blacklist: true }, "_id");
        this.blacklist = kisiler.map(kisi => kisi._id);
        return this.blacklist;
    }


}

/* alair-embed */

class MessageEmbed extends Discord.MessageEmbed {
    constructor(opts, notAuth = false) {
        super(opts);
        this.setColor(renk);
        if (!notAuth)
            this.setAuthor({ iconURL, name });
    }

    setName(name) {
        this.author.name += " • " + name;
        return this;
    }

}
Discord.MessageEmbed = MessageEmbed;