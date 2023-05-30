/* eslint-disable no-use-before-define */
/**
 * Alair-Core,
 * Client, MessageEmbed,
 * prototype handler 
 */
const Discord = require("discord.js");
const { UserModel } = require("./models");
const { emoji, token, renk, sahip, sunucu } = require("./config");
const ayarlar = { renk, sahip, start: Date.now(), emoji, kullanim: { komut: 0, interaction: 0 } };

/* alair-prototype-system */

/* memberPrototype */

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

/* alair-client */

class Alair extends Discord.Client {
    constructor(opts) {
        super(opts);
        this.token = token;
        this.ayarlar = ayarlar;
        this.version = require("../package.json").version;
        this.blacklist = []
        this.wh = require("./wh.js");
        this.sunucu = sunucu;
        this.commands = new Discord.Collection();
        this.interactions = new Discord.Collection();
            
        this.login().then(() => {
            this.davet = `https://discord.com/api/oauth2/authorize?client_id=${this.user.id}&permissions=8&scope=bot%20applications.commands`
            iconURL = this.user.displayAvatarURL();
            name = this.user.username;

            // butonlar için
            this.BUTONLAR = new Discord.MessageActionRow().addComponents(
                new Discord.MessageButton().setLabel('Bot Davet').setStyle('LINK').setURL(this.davet),
                new Discord.MessageButton().setLabel('Destek Sunucusu').setStyle('LINK').setURL(this.sunucu)
            );

        });

    }
    async updateBlacklist() {
        return this.blacklist = (await UserModel.find({ blacklist: true }, "_id")).map(kisi => kisi._id);
    }
}

/* alair-embed */

class MessageEmbed extends Discord.MessageEmbed {
    constructor(notAuth) {
        typeof notAuth === "object" ? super(notAuth) : super();
        this.setColor(renk);
        if (!notAuth && name)
            this.setAuthor({ iconURL, name });
    }

    setName(name) {
        if (!this.author) return;
        this.author.name += " • " + name;
        return this;
    }

}
Discord.MessageEmbed = MessageEmbed;
module.exports = { Alair, MessageEmbed };