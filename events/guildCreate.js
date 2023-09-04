const Discord = require('discord.js');
const { User } = require("../util");
const { yonetim } = require("../util/config")

/**
 * Alair alt katman dosyası / guildCreate.js
 * @param {import("discord.js").Guild} guild
 * @returns 
 */
module.exports = async guild => {
  const owner = await guild.fetchOwner();

  guild.client.channels.cache.get(yonetim).send(`📈 BOT EKLENDİ: 
    \`\`\`
YER: ${guild.name} (${guild.id})
SAHİBİ: ${owner?.user.username} (${guild.ownerId})
KİŞİ SAYISI: ${guild.memberCount}\`\`\``
).catch(_ => _)

  if (guild.ownerId) {
    const kul = await User(guild.ownerId, "blacklist");
    if (!kul.blacklist) return
    await owner.send("Bu sunucunun kurucusu tam... neyse bosver ağza almaya gerek yok. O yüzden buraya giremem. Yani karalistemde var. ")
    return await guild.leave();
  }
  const client = guild.client;
  const embed = new Discord.MessageEmbed()
    .setTitle(`Alair'i ${guild.name}'e eklediğin için teşekkürler!`)
    .setThumbnail(guild.iconURL())
    .setDescription("Prefix değiştirmek için » `!prefix`\nOto-rol sistemini kullanmak için » `!otorol`\nHoş geldin mesajı açıp kapatmak için » `!hg`\nSunucuda log sistemini açmak için » `!log`\nOtomatik cevaplamayı (sa as) kapatmak için » `!oto` \nBot özellikleri hakkında daha fazla bilgi almak için » `!yardım`\n*komutlarını kullanabilirsiniz...*")
    .addField('Alair\'in davet linki:', `[Davet Linki](${client.davet})`)
    .addField('Botda gördüğünüz bir hatayı, şikayetlerinizi ve bota eklenmesini talep ettiğiniz şeyleri bildirmek için resmi destek sunucumuza gelebilirsiniz!', `[Destek Sunucusu](${client.sunucu})`)
    .setTimestamp()

  await owner?.send({ embeds: [embed], components: [client.BUTONLAR] });



}
