exports.run = async (client, message, args, guild) => {

    if (!message.member.isAdmin())
        return message.channel.send('Üzgünüm, buna yetkin yok :grinning:')

    guild.reklam = !guild.reklam;
    await guild.save();
    message.channel.send("Reklam engeli " + (guild.reklam ? "**açıldı**" : "**kapatıldı**"))
    
};

exports.help = {
    name: ["reklam", "reklamengel"],
    description: 'Cümlede reklam geçiyorsa siler.',
    usage: 'reklam'
};