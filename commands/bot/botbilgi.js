const Discord = require('discord.js');
const os = require("os");
const cpu = os.cpus();
const { parsems } = require("../../util")
const { GuildModel, Usage, SiteUsage } = require("../../util/models");

exports.run = async (client, message, args, { prefix }) => {
  const sahip = client.users.cache.get(client.ayarlar.sahip[0]);
  const count = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0),
    usedMemory = process.memoryUsage().rss / 2 ** 20,
    getpercentage = "%" + (usedMemory / (os.totalmem() / 2 ** 20) * 100).toFixed(2);
  const ilk10Komut =
    client.commands.filter(komut => typeof komut !== "string" && komut.kullanim > 0).sort((a, b) => b.kullanim - a.kullanim).first(10).map((x, i) => `**${i + 1}.** ${x.dosyaAdi} (${x.kullanim})`).join("\n");

  const sayi = (await Usage.aggregate([
    { $group: { _id: null, sayi: { $sum: "$sayi" } } },
    { $project: { _id: 0, sayi: 1 } }
  ]))[0]?.sayi || 0;

  const enEski = await Usage.findOne().sort({ _id: 1 });


  const site = (await SiteUsage.aggregate([
    { $group: { _id: null, count: { $sum: "$count" } } },
    { $project: { _id: 0, count: 1 } }
  ]))[0]?.count || 0;

  const { interaction, komut } = client.ayarlar.kullanim;
  const embed = new Discord.MessageEmbed()
    .setTitle(`» Tüm komutlara erişmek için \`${prefix}yardım\` yazın.`).setName("V" + client.version)
    .addField("» Sayılar:", `**• Sunucu:** ${client.guilds.cache.size} **• Bellek:** ${GuildModel.schema.fetchCache().size}\n**• Kullanıcı:** ${client.users.cache.size} (${count})\n**• Ses kanalı:** ${client.voice.adapters.size}`, true)
    .addField("» Sürüm:", `**• Node.js:** ${process.version} - ${process.release.lts || "A-LTS"}\n**• Discord.js:** v${Discord.version}`, true)
    .addField("» Sistem:", `**• RAM:** ${usedMemory.toFixed(2)}MB ${getpercentage}\n**• OS:** ${os.version().split(" ", 3).join(" ")} ${os.arch()}\n**• CPU:** ${cpu[0].model} **X${cpu.length}**`)
    .addField("» Çalıştırılma:", `**• Bot: **${parsems(client.uptime)}\n**• Sistem: **${parsems(os.uptime() * 1000)}`, false)
    .addField("» Site kullanımı:", `**• Toplam:** ${site}`, true)
    .addField("» Oturumdaki kullanımlar:", `**• Komut: **${komut}\n**• Interaction: **${interaction}\n`, false)
    .addField("» Oturumdaki en çok kullanılanlar:", ilk10Komut || "İlk kullanım, senden", false)
    .addField("» Önceki oturumların kullanımları:", `**• Başlangıç:** <t:${Math.trunc(enEski._id.getTime() / 1000)}:R>\n**• Sayı: **${sayi}\n**• Detaylı kullanım bilgisi için \`${prefix}istatistik\` komutunu kullanın.**`, false)
    .addField("» Sahip:", `[${sahip.tag}](https://discord.com/users/${sahip.id})`, true)
  const m = {
    embeds: [embed], components: [client.BUTONLAR]
  }

  if (args[0] == "asb") {
    m.embeds[0].title = "» Kapanış sinyali!"
    return m;
  }

  return message.reply(m);

};
exports.help = {
  name: ['botbilgi', "bot", "istatistik", "boy"],
  description: 'Bot hakkında bilgiler verir.',
  usage: 'botbilgi'
};