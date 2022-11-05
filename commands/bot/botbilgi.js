const Discord = require('discord.js');
const os = require("os");
const cpu = os.cpus()
const { parsems } = require("../../util")


exports.run = (client, message, args, { prefix }) => {
  const count = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0),
    usedMemory = process.memoryUsage().rss / 2 ** 20,
    getpercentage = "%" + (usedMemory / (os.totalmem() / 2 ** 20) * 100).toFixed(2);
  const ilk10Komut =
    client.commands.filter(komut => typeof komut !== "string" && komut.kullanim > 0).sort((a, b) => b.kullanim - a.kullanim).first(10).map((x, i) => `**${i + 1}.** ${x.file} (${x.kullanim})`).join("\n");
  const { interaction, komut } = client.ayarlar.kullanim;
  const embed = new Discord.MessageEmbed()
    .setTitle(`» Tüm komutlara erişmek için \`${prefix}yardım\` yazın.`).setName("V" + client.version)
    .addField("» Sayılar:", `**• Sunucu:** ${client.guilds.cache.size}\n**• Kullanıcı:** ${client.users.cache.size} (${count})\n**• Ses kanalı:** ${client.voice.adapters.size}`, true)
    .addField("» Sürüm:", `**• Node.js:** ${process.version} - ${process.release.lts || "A-LTS"}\n**• Discord.js:** v${Discord.version}`, true)
    .addField("» Sistem:", `**• RAM:** ${usedMemory.toFixed(2)}MB ${getpercentage}\n**• OS:** ${os.version().split(" ", 3).join(" ")} ${os.arch()}\n**• CPU:** ${cpu[0].model} **X${cpu.length}**`)
    .addField("» Çalıştırılma:", `**• Bot: **${parsems(client.uptime)}\n**• Sistem: **${parsems(os.uptime() * 1000)}`, false)
    .addField("» Kullanımlar:", `**• Komut: **${komut}\n**• Interaction: **${interaction}\n`, false)
    .addField("» En çok kullanılanlar:", ilk10Komut || "İlk kullanım, senden", false)

    .addField("» Sahip:", `[Akif#6820](https://discord.com/users/${client.ayarlar.sahip[0]})`, true)


  const DAV_BUTON = new Discord.MessageButton().setLabel('Bot Davet').setStyle('LINK').setURL(client.davet)
  const SW_BUTON = new Discord.MessageButton().setLabel('Destek Sunucusu').setStyle('LINK').setURL(client.sunucu)
  const DAVET = new Discord.MessageActionRow().addComponents(DAV_BUTON, SW_BUTON)

  return message.reply({ embeds: [embed], components: [DAVET] });

};

exports.help = {
  name: ['botbilgi', "bot", "istatistik"],
  description: 'Bot hakkında bilgiler verir.',
  usage: 'botbilgi'
};