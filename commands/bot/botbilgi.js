const Discord = require('discord.js');
var os = require("os");
var cpu = os.cpus()
const { parsems } = require("../../util/classes")

var pjson = require('../../package.json');


exports.run = (client, message, args, prefix) => {
  const count = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0),
    usedMemory = process.memoryUsage().rss / 2 ** 20,
    getpercentage = "%" + ((usedMemory / (os.totalmem() / 2 ** 20)) * 100).toFixed(2);


  const { interaction, komut } = client.ayarlar.kullanim;
  const embed = new Discord.MessageEmbed()
    .setTitle(`» Tüm komutlara erişmek için \`${prefix}yardım\` yazın.`)
    .setColor(client.renk)
    .setAuthor({ name: `${client.user.username} • V${pjson.version}`, iconURL: client.user.avatarURL() })
    .addField("» Sayılar:", `**• Sunucu:** ${client.guilds.cache.size}\n**• Kullanıcı:** ${client.users.cache.size} (${count})`, true)
    .addField("» Sürüm:", `**• Node.js:** ${process.version}\n**• Discord.js:** v${Discord.version}\n**• Paketler:** ${Object.keys(pjson.dependencies).length}`, true)
    .addField("» Sistem:", `**• RAM:** ${usedMemory.toFixed(2)}MB ${getpercentage}\n**• OS:** ${os.version().split(" ", 3).join(" ")} ${os.arch()}\n**• CPU:** ${cpu[0].model} **X${cpu.length}**`)
    .addField("» Çalıştırılma:", `**• Bot: **${parsems(client.uptime)}\n**• Sistem: **${parsems(os.uptime() * 1000)}`, false)
    .addField("» Kullanımlar:", `**• Komut: **${komut}\n**• Interaction: **${interaction}`, false)
    .addField("» Sahip:", `[Akif#7304](https://discord.com/users/${client.ayarlar.sahip[0]})`, true)
    .addField("» Bağlantılar:", `• [Davet Linki](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands) • [Destek Sunucusu](https://discord.gg/9cBnKmjzvH)`, true)
  return message.channel.send({ embeds: [embed] });

};

exports.help = {
  name: ['botbilgi', "bot"],
  description: 'Bot hakkında bilgiler verir.',
  usage: 'botbilgi'
};