const otoCevap = require("./alair.js");

//KÜFÜRLER
const kufur = require("../../util/json/kufur.json");

// Selamlamalar
const selamlama = ["sa", "selam", "selamun aleyküm", "selamunaleykum", "selamunaleyküm", "selamün aleyküm"]

//SÖVMEYE KARŞI YANIT
const anti_sov = ["Sövmek sana yakışmıyor", "Niye ?", "Neden sövdün ki şimdi? Kötü bir şey mi yaptım :(", "Hop hop, yavaaş!", "Ama, niye ya?", "Ne suçum vardı?", "Biraz anlama sorunumuz olabilir ama sövmeye hiç gerek yoktu :/"]

/**
 * GENEL SUNUCU YANITLARI:
 */
const genel_yanit = {
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
  "31": { content: 'SJ çok komik ben gülmek ölmek', files: ["https://i.redd.it/vaavlsszf0a71.jpg"] },
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
  const { client, guild, content, mentions } = msg;

  if (!guild.members.me.perm("EMBED_LINKS"))
    return await msg.reply("Embed mesaj gönderme yetkim kapalı.").catch(_ => _);

  //MESAJ İÇERİĞİ:
  const msj = (komut ? content.replace(prefix + "sor ", "") : content.replace(`<@${client.user.id}>`, ""))
    .toLocaleLowerCase("tr").trim();

  if (msj.startsWith("<:") && msj.includes("nah") && msj.endsWith(">")) return await msg.reply("Çok ayıp...");


  if (msj.startsWith("yarr") && msj.endsWith("rrdım")) return await msg.reply("Yardım neyine yetmiyor olm :smiley:")
  /**
   * SUNUCULAR İÇİN ANA YANIT:
   * @description Böyle sa as falan için bakar.
   */

  if (selamlama.some(word => msj === word)) return await msg.reply("Aleyküm Selam!");

  if (msj in genel_yanit)
    return await msg.reply(genel_yanit[msj]);


  /**
   * ALINTI TEPKİSİ:
   */
  if ((mentions.has(client.user) || komut) && (kufur.some(word => (" " + msj + " ").includes(" " + word + " ")) || kufur.some(word => msg.content.toLowerCase() == word)))
    return await msg.reply(anti_sov.random())

  try {
    if (content.startsWith(`<@!${client.user.id}>`) || content.startsWith(`<@${client.user.id}>`) || komut)
      return await otoCevap(msg, msj);

  } catch (e) {
    client.logger.ierror("OTOCEVAP SISTEMI", e);
  }
}
