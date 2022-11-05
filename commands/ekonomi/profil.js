const Discord = require("discord.js");
const { User } = require("../../util");
const profil = require("../../util/functions/profil")

exports.run = async (client, message, args) => {

    const user = message.üye();

    return message.reply({
        files: [
            new Discord.MessageAttachment(await profil(user, await User(user.id)), "seviye.png")
        ]
    });

}


exports.help = {
    name: ['seviye', "rank", "level", "profil", "bakiye", "envanter", "cüzdan"],
    description: 'Level sorgulama!',
    usage: 'seviye [@kişi]'
};
