const Discord = require("discord.js"); // Discord.js'yi tanımladık.
const { Rank } = require("canvacord");
const { Member, User } = require("../../util/classes");

exports.run = async (client, message, args) => {
    if (message.channel.type == "DM") return
    const user = message.mentions.members.first() || message.member,
        member = await new Member().getId(message.guild.id, user.id),
        kul = await new User().getId(user.id),
        renk = "#736FE9";

    // if (!swxp) return message.reply("Hiç puanın yok ki :(")

    const rank = new Rank()
        .setAvatar(user.user.displayAvatarURL({ size: 512, format: "jpg" }))
        .setCurrentXP(kul.xp)
        .setRequiredXP(kul.required())
        .setStatus(user.presence.status, true)
        .setProgressBar("#FFFFFF", "COLOR")
        .setUsername(user.user.username)
        .setDiscriminator(user.user.discriminator)
        .setLevel(kul.seviye, "seviye   ")
        .setRank(0, "GLOBALDE", true)
        .setBackground("COLOR", client.renk)
        .setRankColor("WHITE", client.renk)
        .setOverlay("BLACK", 0.1);

    const swrank = new Rank()
        .setCurrentXP(member.xp)
        .setRequiredXP(member.required())
        .setProgressBar("#FFFFFF", "COLOR")

        .setStatus(user.presence.status, true)
        .setAvatar(user.displayAvatarURL({ size: 512, format: "jpg" }))
        .setUsername(user.displayName).setDiscriminator("0000", renk)

        .setLevel(member.seviye, "seviye   ", true)
        .setRank(0, "SUNUCUDA", true).setRankColor("WHITE", renk)
        .setBackground("COLOR", renk).setOverlay("BLACK", 0.1);


    return message.reply({
        files: [
            new Discord.MessageAttachment(await rank.build(), "global.png"),
            new Discord.MessageAttachment(await swrank.build(), "server.png")
        ]
    });

}


exports.help = {
    name: ['seviye', "rank", "level"],
    description: 'Level sorgulama!',
    usage: 'seviye @affansen'
};
