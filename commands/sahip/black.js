const { User } = require("../../util");

exports.run = async (client, message, args) => {

    if (!message.member.isOwner()) return;
    
    let kisi = message.mentions.users.first() || client.users.cache.get(args[0]);
    try {
        if (args[0] || !kisi)
            kisi = await client.users.fetch(args[0]);

    } catch { }

    if (!kisi) return message.reply("**[ASB]:** Salağı etiketlemeyi unuttun!")

    const kul = await User(kisi.id, "blacklist");
    kul.blacklist = !kul.blacklist;
    await kul.save()
    await client.updateBlacklist()
    await message.reply("**[ASB]:** Kişinin blacklist'i " + (kul.blacklist ? "**açıldı**" : "**kapatıldı**"));
    
};

exports.help = {
    names: ["black"],
    description: 'Şerefsiz sikici',
    usage: 'black [@kişi]', 
    gizli: true
};
