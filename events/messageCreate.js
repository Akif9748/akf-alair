const { duyuru } = require("../util/config"),
    blokerler = require("./util/blokerler"),
    { Guild } = require("../util"),
    asb = require("../util/lib/asb"),
    { Custom, CommandUsage } = require("../util/models"),
    sonkomut = {}, sonoto = {};

let regex;

/**
 * Alair alt katman dosyası / messageCreate.js
 * @param {Message} message 
 * @returns 
 */
module.exports = async message => {
    // guild text & guild news
    if (message.author.bot || ![0, 5].includes(message.channel.type) || message.client.blacklist.includes(message.author.id)) return;

    message.content = message.content.replaceAll("\u200e", "");
    if (!message.content) return;

    const { client, channelId, guildId } = message;

    if (channelId === duyuru) return message.react("🎉").catch(_ => _);

    const guild = await Guild(guildId);
    let { prefix, kufur, caps, oto, blacklist } = guild;

    regex ||= new RegExp(`^<@!?${client.user.id}>( |)$`);

    if (message.content.match(regex))
        return await message.reply(`Buyrun, komutlarımı **${prefix}yardım** yazarak öğrenebilirsiniz.`);

    /* engelleyiciler */
    if (!message.member.isAdmin()) {
        if (kufur && await blokerler.kufur(message)) return;
        if (caps && await blokerler.caps(message)) return;
    }

    const key = message.content.toLowerCase();
    if (
        key.startsWith(prefix.toLowerCase())
        && (message.member.isAdmin() || !sonkomut[message.author.id] || sonkomut[message.author.id] < Date.now() - 1500)
    ) {
        const args = message.content.slice(prefix.length).split(/ +/g).filter(Boolean),
            command = args.shift()?.toLowerCase(); //KOMUT ADI

        let komut = client.commands.get(command);
        if (!komut) return;
        if (blacklist?.includes(channelId) && !message.member.isAdmin()) return blokerler.kes(message, "Bu kanalda komutlar kullanıma kapalıdır!");

        if (!message.guild.members.me.perm("EMBED_LINKS"))
            return message.reply("Embed mesaj gönderme yetkim kapalı.");

        if (typeof komut === "string")
            komut = client.commands.get(komut);

        if (!komut.help.gizli)
            message.channel.sendTyping().catch(_ => _);

        sonkomut[message.author.id] = Date.now();

        try {
            message.hata = (ek = "") => message.reply(`Doğru kullanım:\n\`\`\`${prefix + komut.help.usage}\`\`\`\n${ek}`).catch(_ => _);
            await komut.run(client, message, args, guild);
        } catch (e) {
            asb.komut(command, message, e);
        } finally {
            komut.kullanim++;

            const cmd = await CommandUsage.exists({ _id: client.today, "komutlar._id": komut.help.names[0] });

            if (cmd)
                await CommandUsage.updateOne(
                    { _id: client.today, "komutlar._id": komut.help.names[0] },
                    { $inc: { "komutlar.$.kullanim": 1, komut: 1 } }
                );
            else
                await CommandUsage.updateOne({ _id: client.today }, {
                    $push: {
                        komutlar: {
                            _id: komut.help.names[0],
                            kullanim: 1
                        }
                    },
                    $inc: { komut: 1 }
                });

        }

    }

    if (!message.content.startsWith(prefix)) {
        if (guild.rank && message.content.length > 3) require("./util/rank")(message);

        const sonuc = await Custom.findOne({ guildId, key });
        if (sonuc) return await message.reply(sonuc.value);
        if (oto)
            try {
                if (
                    (message.member.isAdmin() || !sonoto[message.author.id] || sonoto[message.author.id] < Date.now() - 4000)
                    && await require("./util/oto_cevap")(message, prefix)
                )
                    sonoto[message.author.id] = Date.now();
            } catch { }
    }

}
