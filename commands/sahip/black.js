
const { User } = require("../../util");

exports.run = async (client, message, args, guild) => {

    if (!message.member.isOwner())
        return message.channel.send('Üzgünüm, bu komut ancak sahiplere özeldir.')
    let kisi = message.mentions.users.first() || client.users.cache.get(args[0]);
    try {
        if (args[0] || !kisi)
            kisi = await client.users.fetch(args[0]);

    } catch { };

    if (!kisi) return message.reply("Salağı etiketlemeyi unuttun!")
    const kul = await User(kisi.id);
    kul.blacklist = !kul.blacklist;
    await kul.save()
    await client.userBlock()
    await message.channel.send("Kişinin blacklist'i " + (kul.blacklist ? "**açıldı**" : "**kapatıldı**"))



};

exports.help = {
    name: "black",
    description: 'Şerefsiz sikici',
    usage: 'black @piç', gizli: true
};
