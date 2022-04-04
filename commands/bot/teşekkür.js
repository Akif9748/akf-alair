const Discord = require('discord.js');
const fs = require("fs")
exports.run = (client, message, args) => {

    const embed = new Discord.MessageEmbed()
    .setTitle(`Yegane destekçilerimiz :heart:`)
    .setDescription(fs.readFileSync("./util/tesekkur.md","utf-8"))
    .setTimestamp().setColor(client.renk)

   return message.channel.send({embeds: [embed]});
}

exports.help = {
    name: ["teşekkür","adam"],
    description: ":heart::heart::heart:Bot ve sahibinin yegane destekçileri:heart::heart::heart:",
    usage: 'teşekkür'
};