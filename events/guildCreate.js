const Discord = require('discord.js');

module.exports = guild => {
  const client = guild.client;
  const embed = new Discord.MessageEmbed()
    .setTitle(guild.name)
    .setThumbnail(guild.iconURL())
    .setDescription("Prefix değiştirmek için: `!prefix`\nHoş geldin mesajı açıp kapatmak için: `!hg`\nSunucuya log açmak için (Mesaj silme, düzenleme) `!log`\nOtomatik cevap (sa as) kapatmak için `!oto` \n**Yazabilirsiniz :)**")
    .addField('Botu sunucunuza eklediğiniz için teşekkürler!', "**!yardım** komutu ile tüm komutları öğrenebilirsiniz.")
    .addField('Bot davet linki:', '[Davet Linki](https://discord.com/api/oauth2/authorize?client_id=' + client.user.id + '&permissions=8&scope=bot%20applications.commands)')
    .addField('Aynı zamanda botta herhangi bir hatayı, bota eklenmesini istediğiniz şeyleri, botla ilgili şikayetlerinizi iletmek için sunucumuza gelebilirsiniz.', '[Destek Sunucusu](https://discord.gg/9cBnKmjzvH)')
    .setColor(client.ayarlar.renk)
    .setTimestamp()

  guild.fetchOwner().then(owner => owner.send({ embeds: [embed] }).catch(console.error));


}
