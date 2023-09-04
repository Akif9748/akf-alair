const Logger = require("./util/lib/logger")
Logger.log("KONTROLCÜ", "Devrede!", "\n\x1b[31m\x1b[40m" + require('figlet').textSync("Alair"), "\x1b[0m");

const { sahip, alpha } = require("./util/config")
const { fork } = require('child_process');
const { EmbedBuilder } = require('discord.js');
const { kontrolcu } = require("./util/lib/wh");
const author = { name: "Kontrolcü" };
const alphaSTR = "[Kontrolcü] devredışı! 24 saat içinde 5. çökme limiti aşıldı, manuel müdahale isteniyor...";

let hata = 0;
process.on('SIGTERM', async () => {
  Logger.log("KONTROLCÜ", "Kapatılıyor!");

  await kontrolcu.send({
    embeds: [
      new EmbedBuilder(author)
        .setColor("Orange")
        .setTitle("`SIGTERM` sinyali!")
        .setDescription(`Kontrolcü kapatılıyor! Oturum süresi: **${(process.uptime() / 60 ** 2).toFixed(2)}** saat.`)
    ]
  }).catch(Logger.error);
  process.exit(0);

});

(function create() {
  if (hata >= 5) {
    kontrolcu.send(`💥 **[ASB]:** Yakalanamayan ana katman kritik hatası!
\`\`\`
${alphaSTR}
\`\`\`
||${sahip.map(id => `<@${id}>`).join(", ")}||`).catch(Logger.error);

    return Logger.error(alphaSTR);
  }

  fork("app").on("exit", code => {
    create();

    Logger.log("KONTROLCÜ", "Bot", code, "koduyla bitti, yeniden başlatılıyor!");

    if (!alpha || code === 0) return;

    const embed = new EmbedBuilder(author);

    if (code === null)
      embed.setTitle("Bot kapandı ama neden ki?").setColor("Cyan")
        .setDescription("Botun kapanmasına sebep olan şey bilinmiyor. Host tarafından yapıldığı düşünülüyor");

    else if (code === 137)
      embed.setTitle("`SIGKILL` sinyali ile bitti!").setColor("DarkGold")
        .setDescription(`Geliştirici ekibi tarafından bota **${code}** koduyla zorunlu \`reset\` attırılıyor!`);

    else
      embed.setTitle("Yakalanamayan hata!").setColor("Red")
        .setDescription(`Bot \`${code}\` koduyla \`${++hata == 1 ? "ilk" : hata}\` kez düştü. Tekrar açılıyor!`);

    kontrolcu.send({ embeds: [embed] }).catch(Logger.error);

  }).on("error", e => Logger.ierror("KONTROLCÜ", e));

})();