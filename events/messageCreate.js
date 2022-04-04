const { Guild } = require("../util/classes"),
    { prefix_def, duyuru } = require("../util/config.json"),
    kelimeoyunu = require("./util/kelime"),
    { KelimeModel, BlackListModel } = require("../util/models");

module.exports = async message => {

    if (message.author.bot) return;
    message.content = message.content.replace(/\u200e/g, "");
    if (!message.content) return;
    const guild = new Guild(message.guild?.id);

    const kanal = message.channel.type !== "DM";

    if (kanal) await guild.getId();

    const { client } = message;
    if (guild.kufur) client.emit("kufur", message);

    const prefix = guild.prefix ?? prefix_def;

    if (message.content.startsWith(prefix) && (client.ayarlar.sahip.includes(message.author.id) || message.member.permissions.has("ADMINISTRATOR")|| !(await BlackListModel.findOne({ kanalid: message.channel.id })))) {

        const args = message.content.slice(prefix.length).split(' ').filter(arg => !!arg),
            command = args[0].toLowerCase() ?? null; //KOMUT ADI
        if (client.commands.has(command)) { //EĞER KOMUT VARSA
            if (kanal) {
                const member = message.guild.me
                if (!member.permissions.has("EMBED_LINKS") || !member.permissionsIn(message.channel).has("EMBED_LINKS"))
                    return message.reply("Embed mesaj gönderme yetkim kapalı.").catch(console.error)

            }

            try {
                client.commands.get(command).run(client, message, args.slice(1), prefix);
                message.channel.sendTyping();
            } catch (e) {
                console.error(e);
            } finally {
                client.ayarlar.kullanim.komut++;
            }

        }
    } else if (!kanal || !guild.otokapa)
        client.emit("autoReply", prefix, message, false);


    if (!kanal) return; //Mesaj DM ise çalışmayacak:

    if (message.channel.id === duyuru) message.react("✅").catch(console.error);
    if (message.content.length > 3) client.emit("rank", message)//RANK




}
