const { Message } = require('discord.js');
const { Custom } = require("../util/models");
const otoCevap = require("./util/oto_cevap.js");

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
  "mewaba": "mewaba!",
  "sa anime": 'as anime',
  "sa hocam": 'as hocam', "napim": "domal da yapim",
  "günaydın": 'Sana da günaydın.',
  "gün aydın": 'Sana da günaydın.',
  "günaydınlar": 'Sana da günaydın.',
  "hayırlı sabahlar": "Hayırlı sabahlar size de!",
  "iyi geceler": 'İyi geceleer.',
  "ii gclr": "ii gclr",
  "iyi akşamlar": 'İyi akşamlar!',
  "bb": "bb cnm", "bye": "bye cnm",
  "görüşürüz": 'Hadi kendine iyi baaak, görüşürüz. :hugging:',
  "alair": 'Buyrun, komutlarımı **!yardım** yazarak öğrenebilirsiniz.',
  'niye?': 'İşte. :/', 'niye': 'İşte. :/',
  "çıkacam": "Kiminle çıkacan?",
  "çıkacağım": "Kiminle??",
  'olr': "Olmaz mıı?",
  "31": { content: 'SJ çok komik ben gülmek ölmek', files: ["https://cdn.discordapp.com/attachments/930555249041735711/1021495517739483286/unknown.png"] },
  "cu": { content: 'cu çok komik ben gülmek ölmek', files: ["https://foto.haberler.com/haber/2021/06/17/sj-ne-demek-s-ve-j-hikayesi-nedir-sosyal-14206005_2219_m.jpg"] },
  "gençleştim": {
    content: 'Gençleştim resmen! Bu kadar mı fark eder?',
    files: ["https://cdn.discordapp.com/attachments/841640767600721950/898641696865267762/E25SCjtWYAQTJj3.png"]
  }
}

/**
 * Alair sor komutu
 * @param {Message} msg Mesaj objesi
 * @param {String} prefix Bot prefixi
 * @param {Boolean} komut Veri komuttan mı geldi?
 * @returns {Message} Mesaj olarak döner
 */
module.exports = async (msg, prefix, komut) => {
  const { channel, client, guild, guildId, content, mentions } = msg;

  if (!guild.me.perm("EMBED_LINKS") || !guild.me.permissionsIn(channel).has("EMBED_LINKS"))
    return await msg.reply("Embed mesaj gönderme yetkim kapalı.").catch(_ => _);

  //MESAJ İÇERİĞİ:
  const msj = (komut ? content.replace(prefix + "sor ", "") : content.replace(`<@${client.user.id}>`, ""))
    .toLocaleLowerCase("tr").trim();


  const sonuc = await Custom.findOne({ guildId, key: msj }, "key value");
  if (sonuc) return await msg.reply(sonuc.value);


  if (msj.startsWith("yarr") && msj.endsWith("rrdım")) return await msg.reply("Yardım neyine yetmiyor olm :smiley:")
  /**
   * SUNUCULAR İÇİN ANA YANIT:
   * @description Böyle sa as falan için bakar.
   */

  if (selamlama.some(word => msj === word)) return await msg.reply("Aleyküm Selam!");

  if (msj in herTurlu)
    return await msg.reply(herTurlu[msj]);

  /**
   * SADECE DÜZ ETİKET TEPKİSİ
  */
  if (content === (`<@${client.user.id}>`) || content === (`<@!${client.user.id}>`))
    if (msj.includes("n!öp") || msj.includes("n!aşk"))
      return await msg.reply('Yiaaa 🔥');

  /**
   * ALINTI TEPKİSİ:
   */
  if ((mentions.has(client.user) || komut) && (kufur.some(word => (" " + msj + " ").includes(" " + word + " ")) || kufur.some(word => msg.content.toLowerCase() == word)))
    return await msg.reply(sovgu.random())

  try {
    if (content.startsWith(`<@!${client.user.id}>`) || content.startsWith(`<@${client.user.id}>`) || komut)
      await otoCevap(msg, msj);

  } catch (e) {
    console.error(e)
  }
}
