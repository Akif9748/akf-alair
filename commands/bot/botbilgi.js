const Discord = require('discord.js');
const os = require("os");
const cpu = os.cpus();
const { parsems } = require("../../util")
const { GuildModel, UserModel, CommandUsage, SiteUsage } = require("../../util/models");

exports.run = async (client, message, args, { prefix }) => {

  const sahip = client.users.cache.get(client.ayarlar.sahip[0]),
    count = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0),
    usedMemory = process.memoryUsage().rss / 2 ** 20,
    getpercentage = "%" + (usedMemory / (os.totalmem() / 2 ** 20) * 100).toFixed(2);

  const [komut_toplam, interaction_toplam, site, bugun] = await Promise.all([
    CommandUsage.aggregate([
      { $group: { _id: null, komut: { $sum: "$komut" } } },
      { $project: { _id: 0, komut: 1 } }
    ]),
    CommandUsage.aggregate([
      { $group: { _id: null, interaction: { $sum: "$interaction" } } },
      { $project: { _id: 0, interaction: 1 } }
    ]),
    SiteUsage.aggregate([
      { $group: { _id: null, count: { $sum: "$count" } } },
      { $project: { _id: 0, count: 1 } }
    ]),
    CommandUsage.findOne({ _id: client.today })
  ]);

  const embed = new Discord.MessageEmbed()
    .setTitle(`» Tüm komutlara erişmek için \`${prefix}yardım\` yazın.`).setName("v" + client.version)
    .addField("» Sayılar:", `**• Sunucu:** ${client.guilds.cache.size} (${GuildModel.schema.cache.size} bellek)\n**• Kullanıcı:** ${client.users.cache.size} ~${count} (${UserModel.schema.cache.size} bellek)\n**• Ses kanalı:** ${client.voice.adapters.size}`, true)
    .addField("» Sürüm:", `**• Alair:** v${client.version} \n**• Node.js:** ${process.version} - ${process.release.lts || "A-LTS"}\n**• Discord.js:** v${Discord.version}`, true)

    .addField("» Sistem:", `**• RAM:** ${usedMemory.toFixed(2)}MB ${getpercentage}\n**• OS:** ${os.version().split(" ", 3).join(" ")} ${os.arch()}\n**• CPU:** ${cpu[0].model} **X${cpu.length}**`, false)
    .addField("» Çalıştırılma:", `**• Bot: **${parsems(client.uptime)}\n**• Sistem: **${parsems(os.uptime() * 1000)}`, true)

    .addField("» Bugün:", `**• Komut: **${bugun.komut}\n**• Interaction: **${bugun.interaction}\n`, true)
    .addField("» Tüm zamanlar:", `**• Komut Sayısı: **${komut_toplam[0]?.komut || 0}\n**• Interaction Sayısı: **${interaction_toplam[0]?.interaction || 0}\n**• Site kullanımı:** ${site[0]?.count || 0}`, true)

    .addField("» Sahip:", `**[${sahip.username}](https://discord.com/users/${sahip.id})** -> ${client.ayarlar.sahip.map(s => `<@${s}>`).join(", ")}`, false)
    .addField("» Komutların adları, günlere göre komutlar",
      `Bu bilgilere erişmek için \`${prefix}istatistik\` / \`${prefix}günler\` komutlarını kullanabilirsiniz.`, false)

  return message.reply({ embeds: [embed], components: [client.BUTONLAR] });
};
exports.help = {
  native: true,
  subcommand: "alair",
  names: ['botbilgi', "bot", "istatistik", "boy"],
  description: 'Bot hakkında bilgiler verir.',
  usage: 'botbilgi'
};