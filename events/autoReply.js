const { MessageEmbed, Message } = require('discord.js');
const mainReply = require("./util/mainReply");

//KÜFÜRLER
const kufur = require("../util/kufur.json");

// Selamlamalar
const selamlama = ["sa", "selam", "selamun aleyküm", "selamunaleykum", "selamunaleyküm", "selamün aleyküm"]

//SÖVMEYE KARŞI YANIT
const sovgu = ["Sövmek sana yakışmıyor", "Niye ?", "Neden sövdün ki şimdi? Kötü bir şey mi yaptım :(", "Hop hop, yavaaş!", "Ama, niye ya?", "Ne suçum vardı?", "Biraz anlama sorunumuz olabilir ama sövmeye hiç gerek yoktu :/"]

/**
 * GENEL SUNUCU YANITLARI:
 */
const herTurlu = {
  "merhaba": 'Merhaba, hoş geldin!',
  "iyi akşamlar": 'İyi akşamlar!'
}

/**
 * Alair sor komutu
 * @param {String} prefix Bot prefixi
 * @param {Message} msg Mesaj objesi
 * @param {Boolean} komut Veri komuttan mı geldi?
 * @returns {Message} Mesaj olarak döner
 */
module.exports = (prefix, msg, komut) => {
  const { channel, client, guild, content, mentions } = msg;

  const dmkosul = channel.type === "DM";

  if (!dmkosul)
    if (!guild.me.permissions.has("EMBED_LINKS") || !guild.me.permissionsIn(channel).has("EMBED_LINKS"))
      return msg.reply("Embed mesaj gönderme yetkim kapalı.").catch(console.error);

  //MESAJ İÇERİĞİ:
  const msj = content.replace(prefix + "sor ", "").toLocaleLowerCase("tr").trim();

  /**
   * SUNUCULAR İÇİN ANA YANIT:
   * @description Böyle sa as falan için bakar.
   */

  if (selamlama.some(kelam => msj === kelam)) return msg.reply("Aleyküm Selam!");

  if (msj in herTurlu)
    return msg.reply(herTurlu[msj]);

  /**
   * SADECE DÜZ ETİKET TEPKİSİ
  */
  if (content.includes(`<@${client.user.id}>`) || content.includes(`<@!${client.user.id}>`))
    if (msj.includes("n!öp") || msj.includes("n!aşk"))
      return msg.reply('Yiaaa 🔥');

    else
      return msg.reply({ embeds: [new MessageEmbed().setColor(client.renk).setDescription(herTurlu.alair)] });

  /**
   * ALINTI TEPKİSİ:
   */
  if ((dmkosul || mentions.has(client.user) || komut) && (kufur.some(word => (" " + msj + " ").includes(" " + word + " ")) || kufur.some(word => msg.content.toLowerCase() == word)))
    return msg.reply(sovgu[Math.floor(Math.random() * sovgu.length)])

  /*
   *OTOCEVAP SİSTEMİ:
  */
  if (komut || dmkosul)
    return mainReply(msg, msj);

}
