const Discord = require('discord.js');
const list = require("../../util/json/tesekkur.json");
exports.run = (client, message) => {

    const embed = new Discord.MessageEmbed()
        .setTitle(`Yegane destekçilerimiz :heart:`)
        .setDescription(`[**${message.author.username}**](https://discord.com/users/${message.author.id}) Alair seni cok seviyor, neden acaba ?? :heart:\n`
            + list.map(x => `[**${x.name}**](https://discord.com/users/${x.id}) ${x.text}`).join("\n")+
            `\n\n**thesportstacker**, korona komutu ve komutların ilk handleri.
            *Daha buraya adı yazılmayı hak eden kaç kişi var sayamayız...*`
        );


    return message.reply({ embeds: [embed] });
}

exports.help = {
    name: ["teşekkür", "adam"],
    description: "❤❤Bot ve sahibinin yegane destekçileri❤❤",
    usage: 'teşekkür'
};
