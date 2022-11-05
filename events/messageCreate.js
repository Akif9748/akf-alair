const { Message } = require("discord.js"),
    { duyuru } = require("../util/config.json"),
    blokerler = require("./util/blokerler"),
    { Guild } = require("../util"),
    sonkomut = {};


/**
 * Alair alt katman dosyası / messageCreate.js
 * @param {Message} message 
 * @returns 
 */
module.exports = async message => {
    if (message.author.bot || !["GUILD_TEXT", "GUILD_NEWS"].includes(message.channel.type) || message.client.blacklist.includes(message.author.id)) return;
    message.content = message.content.replaceAll("\u200e", "");
    if (!message.content) return;

    const { client, channelId, guildId, content } = message;

    const guild = { prefix, kufur, caps, oto, reklam, blacklist } = await Guild(guildId);

    /* engelleyiciler */
    if (!message.member.isAdmin()) {
        if (kufur && await blokerler.kufur(message)) return;
        if (caps && await blokerler.caps(message)) return;
        if (reklam && await blokerler.reklam(message)) return;
    }

    if (
        content.toLowerCase().startsWith(prefix.toLowerCase())
        && (message.member.isAdmin() ||
            (
                (!sonkomut[message.author.id] || sonkomut[message.author.id] < Date.now() - 1500) &&
                !blacklist.includes(channelId)
            )
        )
    ) {
        const args = content.slice(prefix.length).split(/ +/g).filter(Boolean),
            command = args.shift()?.toLowerCase(); //KOMUT ADI

        if (client.commands.has(command)) { //EĞER KOMUT VARSA

            if (!message.guild.me.perm("EMBED_LINKS"))
                return message.reply("Embed mesaj gönderme yetkim kapalı.")

            try {
                let komut = client.commands.get(command);
                if (typeof komut === "string")
                    komut = client.commands.get(komut);

                if (!komut.gizli)
                    message.channel.sendTyping().catch(_ => _)
                sonkomut[message.author.id] = Date.now();

                await komut.run(client, message, args, guild);
            } catch (e) {
                console.error("[Alt Katman İç Komut Hatası]\n", require('util').inspect(message, { depth: 0 }), "\nTam Hata:\n", e);
                client.wh.asb.send(`⚠Alt Katman İç Komut Hatası, komut: ${command}\n\`\`\`js\n${e}\`\`\`\n*Konsolda daha fazla bilgi bulabilirsin!*`).catch(_ => _)
            } finally {
                client.ayarlar.kullanim.komut++;
            }

        }
    } else if (content === `<@${client.user.id}>` || content === `<@!${client.user.id}>`)
        return await message.reply("Buyrun, komutlarımı **!yardım** yazarak öğrenebilirsiniz.");

    else if (oto) client.emit("autoReply", message, prefix);

    if (channelId === duyuru) message.react("🎉").catch(_ => _)
    if (content.length > 3) client.emit("rank", message)//RANK

}
