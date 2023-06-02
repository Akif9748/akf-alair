/* eslint-disable no-use-before-define */
/**
 * Alair-Core, Alair-Stabilization-System,
 * prototype handler 
 */
const Discord = require("discord.js");
const { UserModel } = require("./models");
const { emoji, token, renk, sahip, sunucu } = require("./config");
const ayarlar = { renk, sahip, start: Date.now(), emoji, kullanim: { komut: 0, interaction: 0 } };


// Alair-Stabilization-System

const FLAGS = {
    CREATE_INSTANT_INVITE: 1n << 0n,
    KICK_MEMBERS: 1n << 1n,
    BAN_MEMBERS: 1n << 2n,
    ADMINISTRATOR: 1n << 3n,
    MANAGE_CHANNELS: 1n << 4n,
    MANAGE_GUILD: 1n << 5n,
    ADD_REACTIONS: 1n << 6n,
    VIEW_AUDIT_LOG: 1n << 7n,
    PRIORITY_SPEAKER: 1n << 8n,
    STREAM: 1n << 9n,
    VIEW_CHANNEL: 1n << 10n,
    SEND_MESSAGES: 1n << 11n,
    SEND_TTS_MESSAGES: 1n << 12n,
    MANAGE_MESSAGES: 1n << 13n,
    EMBED_LINKS: 1n << 14n,
    ATTACH_FILES: 1n << 15n,
    READ_MESSAGE_HISTORY: 1n << 16n,
    MENTION_EVERYONE: 1n << 17n,
    USE_EXTERNAL_EMOJIS: 1n << 18n,
    VIEW_GUILD_INSIGHTS: 1n << 19n,
    CONNECT: 1n << 20n,
    SPEAK: 1n << 21n,
    MUTE_MEMBERS: 1n << 22n,
    DEAFEN_MEMBERS: 1n << 23n,
    MOVE_MEMBERS: 1n << 24n,
    USE_VAD: 1n << 25n,
    CHANGE_NICKNAME: 1n << 26n,
    MANAGE_NICKNAMES: 1n << 27n,
    MANAGE_ROLES: 1n << 28n,
    MANAGE_WEBHOOKS: 1n << 29n,
    MANAGE_EMOJIS_AND_STICKERS: 1n << 30n,
    USE_APPLICATION_COMMANDS: 1n << 31n,
    REQUEST_TO_SPEAK: 1n << 32n,
    MANAGE_EVENTS: 1n << 33n,
    MANAGE_THREADS: 1n << 34n,
    CREATE_PUBLIC_THREADS: 1n << 35n,
    USE_PRIVATE_THREADS: 1n << 36n,
    CREATE_PRIVATE_THREADS: 1n << 36n,
    USE_EXTERNAL_STICKERS: 1n << 37n,
    SEND_MESSAGES_IN_THREADS: 1n << 38n,
    START_EMBEDDED_ACTIVITIES: 1n << 39n,
    MODERATE_MEMBERS: 1n << 40n,
    VIEW_CREATOR_MONETIZATION_ANALYTICS: 1n << 41n,
    USE_SOUNDBOARD: 1n << 42n,
    SEND_VOICE_MESSAGES: 1n << 46n,
};


/* memberPrototype */

Discord.GuildMember.prototype.isOwner = function () {
    return this.client.ayarlar.sahip.includes(this.id)
}

Discord.GuildMember.prototype.perm = function (yetki) {
    return this.isOwner(this.id) || this.permissions.has(FLAGS[yetki] || yetki);
}

Discord.GuildMember.prototype.isAdmin = function () {
    return this.perm(FLAGS.ADMINISTRATOR);
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
const { GatewayIntentBits: Bits } = Discord;
class Alair extends Discord.Client {
    constructor(opts = {}) {
        const intents = [
            Bits.Guilds,
            Bits.GuildMembers,
            Bits.GuildVoiceStates,
            Bits.GuildPresences,
            Bits.GuildMessages,
            Bits.GuildMessageReactions,
            Bits.MessageContent
        ]
        super({ ...opts, failIfNotExists: false, intents });
        this.token = token;
        this.ayarlar = ayarlar;
        this.version = require("../package.json").version;
        this.blacklist = [];
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
                new Discord.MessageButton().setLabel('Bot Davet').setStyle('Link').setURL(this.davet),
                new Discord.MessageButton().setLabel('Destek Sunucusu').setStyle('Link').setURL(this.sunucu)
            );

        });

    }
    async updateBlacklist() {
        return this.blacklist = (await UserModel.find({ blacklist: true }, "_id")).map(kisi => kisi._id);
    }
}

/* alair-embed */

class MessageEmbed extends Discord.EmbedBuilder {
    constructor(notAuth) {
        typeof notAuth === "object" ? super(notAuth) : super();
        this.setColor(renk);
        if (!notAuth && name)
            this.setAuthor({ iconURL, name });
    }

    addField(name, value, inline) {
        this.addFields({ name, value, inline });
        return this;
    }

    setName(name) {
        if (!this.data.author) return this;
        this.data.author.name += " • " + name;
        return this;
    }

    setAuthor(name, iconURL, url) {
        if (typeof name === "string")
            super.setAuthor({ name, iconURL, url });
        else
            super.setAuthor(name);
        return this;
    }

    setFooter(text, iconURL) {
        if (typeof text === "string")
            super.setFooter({ text, iconURL });
        else
            super.setFooter(text);
        return this;
    }

}

class AttachmentBuilder extends Discord.AttachmentBuilder {
    constructor(file, name) {
        super(file, { name });
    }
}


Discord.MessageEmbed = MessageEmbed;
Discord.MessageAttachment = AttachmentBuilder;



// V14 FAST FIX

Discord.MessageButton = Discord.ButtonBuilder;
Discord.MessageActionRow = Discord.ActionRowBuilder;
Discord.MessageSelectMenu = Discord.StringSelectMenuBuilder;



module.exports = { Alair, MessageEmbed };