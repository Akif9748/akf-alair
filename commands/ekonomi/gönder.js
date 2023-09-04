const { User, emoji, Resolvers } = require("../../util");

exports.run = async (client, message, args) => {
    const ogret = () => message.hata();
    let para, kişi;
    
    if (message.options) {
        para = message.options.getInteger("miktar")
        kişi = message.options.getUser("kişi")
    } else {
        if (!args[1]) return ogret();
        para = parseInt(args[1])
        kişi = Resolvers.Member({ message, me: false });
    }

    if (!kişi || kişi.id === message.author.id) return ogret();
    if (!para || para < 0) return ogret();

    const kul = await User(message.author.id, "para");

    if (kul.para < para) return message.reply("Paran buna yetmiyor :)");

    const user2 = await User(kişi.id, "para");
    kul.para -= para;
    user2.para += para;
    await kul.save();
    await user2.save();
    return message.reply(`${kişi}, ${message.author} sana **${para} ATC** ${emoji.ata} gönderdi`);

};

exports.help = {
    native: true,
    options: [
        { name: "kişi", description: "Para gönderilecek kişi", type: 6, required: true },
        { name: "miktar", description: "Gönderilecek ATC miktarı", type: 4, required: true }
    ],
    names: ["gönder", "eft", "havale"],
    description: 'Para gönderme komutu.',
    usage: 'gönder <@kişi> <miktar>'
};