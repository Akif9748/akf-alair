/* eslint-disable no-use-before-define */
/**
 * Alair-Core, Alair-Stabilization-System,
 * prototype handler 
 */
const Discord = require("discord.js");
const { UserModel } = require("../models");
const { emoji, token, renk, sahip, sunucu } = require("../config");
const ayarlar = { renk, sahip, start: Date.now(), emoji };

// Alair-Stabilization-System

/* Discord.GuildMember.prototype */
const FLAGS = {
    KICK_MEMBERS: 2n,
    BAN_MEMBERS: 4n,
    ADMINISTRATOR: 8n,
    MANAGE_MESSAGES: 8192n,
    EMBED_LINKS: 16384n,
    MANAGE_ROLES: 268435456n,
    MODERATE_MEMBERS: 1099511627776n
};

Discord.GuildMember.prototype.isOwner = function () {
    return this.client.ayarlar.sahip.includes(this.id)
}

Discord.GuildMember.prototype.isAdmin = function () {
    return this.perm(8n);
}

Discord.GuildMember.prototype.perm = function (yetki) {
    return this.isOwner(this.id) || this.permissions.has(FLAGS[yetki] || yetki);
}

// Discord.Message.prototype.hata 

/* nodejs-prototype */

Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)]
}

let iconURL, name;

/* alair-client */
const { GatewayIntentBits: Bits } = Discord;
class Alair extends Discord.Client {
    constructor(opts = {}) {
        const intents = [ // 34435
            Bits.Guilds,
            Bits.GuildMembers,
            Bits.GuildVoiceStates,
        //  Bits.GuildPresences,
            Bits.GuildMessages,
            Bits.GuildMessageReactions,
            Bits.MessageContent
        ]

        super({ ...opts, failIfNotExists: false, intents });
        this.token = token;
        this.ayarlar = ayarlar;
        this.version = require("../../package.json").version;
        this.blacklist = [];
        this.wh = require("./wh.js");
        this.logger = require("./logger.js");
        this.sunucu = sunucu;
        this.commands = new Discord.Collection();
        this.interactions = new Discord.Collection();

        this.login().then(() => {
            this.davet = `https://discord.com/api/oauth2/authorize?client_id=${this.user.id}&permissions=8&scope=bot%20applications.commands`
            iconURL = this.user.displayAvatarURL();
            name = this.user.username;

            // butonlar için
            this.BUTONLAR = new Discord.MessageActionRow().addComponents(
                new Discord.MessageButton().setLabel('Bot Davet').setStyle(5).setURL(this.davet),
                new Discord.MessageButton().setLabel('Destek Sunucusu').setStyle(5).setURL(this.sunucu)
            );

        });

    }
    async updateBlacklist() {
        return this.blacklist = (await UserModel.find({ blacklist: true }, "_id")).map(kisi => kisi._id);
    }
}

/* alair-embed */

class MessageEmbed extends Discord.EmbedBuilder {
    constructor(data) {
        typeof data === "object" ? super(data) : super();
        this.setColor(renk);
        if (!data && name)
            this.setAuthor({ iconURL, name });
    }

    addField(name, value, inline) {
        this.addFields({ name, value, inline });
        return this;
    }

    setName(name) {
        if (this.data.author)
            this.data.author.name += " • " + name;

        return this;
    }

    setAuthor(name, iconURL, url) {
        return typeof name === "string"
            ? super.setAuthor({ name, iconURL, url })
            : super.setAuthor(name);
    }

    setFooter(text, iconURL) {
        return typeof text === "string"
            ? super.setFooter({ text, iconURL })
            : super.setFooter(text);
    }

}

class AttachmentBuilder extends Discord.AttachmentBuilder {
    constructor(file, name) {
        super(file, { name });
    }
}

// V14 FAST FIX

Discord.MessageEmbed = MessageEmbed;
Discord.MessageAttachment = AttachmentBuilder;

Discord.MessageButton = Discord.ButtonBuilder;
Discord.MessageActionRow = Discord.ActionRowBuilder;
Discord.MessageSelectMenu = Discord.StringSelectMenuBuilder;



module.exports = { Alair, MessageEmbed };
