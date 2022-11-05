const Discord = require("discord.js");
const Canvas = require('@napi-rs/canvas');

const { User, parsenum } = require("../../util");

exports.run = async (client, message, args) => {

    const user = message.mentions.members.first() || message.member,
        kul = await User(user.id),
        member = kul.member(message.guildId);

    const canvas = Canvas.createCanvas(650, 450);
    const context = canvas.getContext('2d');

    context.fillStyle = "#736FE9";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "white";
    context.fillRect(0, 200, canvas.width, 10);


    const avatar = await Canvas.loadImage(user.displayAvatarURL({ size: 256, format: "jpg" }));
    context.drawImage(avatar, canvas.width - 200, 20, 180, 180);

    context.strokeRect(0, 0, canvas.width, canvas.height);
    context.font = '40px Arial';
    context.fillStyle = 'white';
    context.fillText( "» " + message.guild.name, 20, 60);

    context.font = '30px Arial';
    context.fillText(`• Seviye: ${member.seviye}       • XP: ${member.xp}`, 20, 110);

    context.font = '40px Arial';
    context.fillText(`${user.user.username} • ` + (kul.harem ? "Premium" : "Alair"), 20, 250);
    context.font = '30px Arial';
    context.fillText(
        `• Seviye: ${kul.seviye}       • XP: ${kul.xp}

• Arduinolar: ${kul.arduino}

• Para: ${parsenum(kul.para)}       • Eşi: ${kul.manita?.isim || "yok"}`, 20, 300);




    return message.reply({
        files: [
            new Discord.MessageAttachment(canvas.toBuffer(), "seviye.png")
        ]
    });

}


exports.help = {
    name: ['seviye', "rank", "level","profil", "bakiye", "envanter","cüzdan"],
    description: 'Level sorgulama!',
    usage: 'seviye @affansen'
};
