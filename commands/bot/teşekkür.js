const Discord = require('discord.js');
const fs = require("fs")
exports.run = (client, message, args) => {

    const embed = new Discord.MessageEmbed()
        .setTitle(`Yegane destekçilerimiz :heart:`)
        .setDescription(`[**${message.author.username}**](https://discord.com/users/${message.author.id}) (Alair seni cok seviyor, neden acaba ?? :heart:)\n`
        +fs.readFileSync("./util/tesekkur.md", "utf-8"))
        .setTimestamp()

    return message.reply({ embeds: [embed] });
}

exports.help = {
    name: ["teşekkür", "adam"],
    description: ":heart::heart:Bot ve sahibinin yegane destekçileri:heart::heart:",
    usage: 'teşekkür'
};
