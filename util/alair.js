/**
 * Alair-Core,
 * Client,
 * prototype handler 
 */
const Discord = require("discord.js");
const { Player } = require("discord-music-player");
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

/* modejs-prototype */

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
        this.player = new Player(this, { timeout: 10 }).on('songChanged', (queue, song) => {

            const embed = new MessageEmbed()
                .setDescription(`[${song.name}](${song.url}), ${song.requestedBy} tarafından çalınmaya başlandı!`)
                .setThumbnail(song.thumbnail).setName("Müzik sistemi")

            queue.data.channel.send({ embeds: [embed] }).catch(_ => _);

        }).on('queueDestroyed', queue => {
            const embed = new MessageEmbed().setTitle("Müzik durduruldu!").setName("Müzik sistemi")
            return queue.data.channel.send({ embeds: [embed] }).catch(_ => _);

        }).on('queueEnd', queue => this.player.emit('queueDestroyed', queue)).on('error', (error, queue) => {
            console.log("Bot error in", queue.guild.name, error);
            return queue.data.channel.send("**HATA!**" + "```\n" + error + "\n```").catch(_ => _);

        });

        this.login().then(_ => {
            this.davet = `https://discord.com/api/oauth2/authorize?client_id=${this.user.id}&permissions=8&scope=bot%20applications.commands`
            iconURL = this.user.displayAvatarURL();
            name = this.user.username;
        });

    }
    async userBlock(userid) {
        if (userid) {
            const kisi = await User(userid);
            kisi.blacklist = true;
            await kisi.save();
        }
        const kisiler = await UserModel.find({ blacklist: true });
        this.blacklist = kisiler.map(kisi => kisi.userid);
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