const Discord = require('discord.js');
const { User } = require("../util");

/**
 * Alair alt katman dosyası / guildCreate.js
 * @param {Discord.Guild} guild
 * @returns 
 */
module.exports = async guild => {
  const owner = await guild.fetchOwner();
  
  if (guild.ownerId) {
    const kul = await User(guild.ownerId);
    if (!kul.blacklist) return
    await owner.send("Bu sunucunun kurucusu tam... neyse bosver ağza almaya gerek yok. O yüzden buraya giremem. Yani karalistemde var. ")
    return await guild.leave();
  }
  const client = guild.client;
  const embed = new Discord.MessageEmbed()
    .setTitle(`Alair\'i ${guild.name}\'e eklediğin için teşekkürler!`)
    .setThumbnail(guild.iconURL())
    .setDescription("Prefix değiştirmek için » `!prefix`\nOto-rol sistemini kullanmak için » `!otorol`\nHoş geldin mesajı açıp kapatmak için » `!hg`\nSunucuda log sistemini açmak için » `!log`\nOtomatik cevaplamayı (sa as) kapatmak için » `!oto` \nBot özellikleri hakkında daha fazla bilgi almak için » `!yardım`\n*komutlarını kullanabilirsiniz...*")
    .addField('Alair\'in davet linki:', `[Davet Linki](${client.davet})`)
    .addField('Botda gördüğünüz bir hatayı, şikayetlerinizi ve bota eklenmesini talep ettiğiniz şeyleri bildirmek için resmi destek sunucumuza gelebilirsiniz!', `[Destek Sunucusu](${client.sunucu})`)
    .setTimestamp()
  const DAV_BUTON = new Discord.MessageButton().setLabel('Bot Davet').setStyle('LINK').setURL(client.davet)
  const SW_BUTON = new Discord.MessageButton().setLabel('Destek Sunucusu').setStyle('LINK').setURL(client.sunucu)
  const DAVET = new Discord.MessageActionRow().addComponents(DAV_BUTON, SW_BUTON)

  await owner?.send({ embeds: [embed], components: [DAVET] });



}
