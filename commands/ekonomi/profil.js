const Discord = require("discord.js");
const { User, Resolvers } = require("../../util");
const profil = require("../../util/functions/profil")



exports.run = async (client, message, args, guild) => {
    const user = message.options?.getMember("üye") || Resolvers.Member({ message });

    return message.reply({
        content: !guild.rank ? "Uyarı: Bu sunucuda rank sistemi kapalı!" : "Alair rank kartın. Eksik görünmesinin nedeni biz değiliz, linux",
        files: [
            new Discord.MessageAttachment(await profil(user, await User(user.id)), "seviye.png")
        ]
    });

}

exports.help = {
    native: true,
    names: ["profil", 'seviye', "level", "bakiye", "envanter", "cüzdan"],
    options: [
        {
            name: "üye",
            description: "Üyenin profilini gösterir",
            type: 9,
        }
    ],
    description: 'Alair profil kartını gösterir',
    usage: 'profil [@kişi]'
};
