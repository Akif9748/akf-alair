console.info("[Kontrolcü] devrede!", "\n\x1b[31m\x1b[40m" + require('figlet').textSync("inos & akis works"), "\x1b[0m");

const { sahip } = require("./util/config")
const { fork } = require('child_process');
const { EmbedBuilder } = require('discord.js');
const { kontrolcu } = require("./util/wh");
const EMBED = new EmbedBuilder().setColor("Orange").setAuthor({ name: "Kontrolcü" });
const alphaSTR = "[Kontrolcü] devredışı! 24 saat içinde 5. çökme limiti aşıldı, manuel müdahale isteniyor...";

let hata = 0;
process.on('SIGTERM', async () => {
  console.log("[Kontrolcü] kapatılıyor!");

  await kontrolcu.send({
    embeds: [
      EMBED.setTitle("`SIGTERM` sinyali!").setDescription(`Kontrolcü kapatılıyor! Oturum süresi: **${(process.uptime() / 60 ** 2).toFixed(2)}** saat.`)
    ]
  }).catch(console.error);
  process.exit(0);

});

(function create() {
  if (hata >= 5) {
    kontrolcu.send(`💥 **[ASB]:** Yakalanamayan ana katman kritik hatası!
\`\`\`
${alphaSTR}
\`\`\`
||${sahip.map(id => `<@${id}>`).join(", ")}||`).catch(console.error);

    return console.error(alphaSTR);
  }

  fork("app").on("exit", code => {
    create();

    console.log("[Kontrolcü] Bot", code, "koduyla bitti, yeniden başlatılıyor!");
    if (process.platform !== "linux" && code === 0) return;

    const embed = EMBED.setTitle(Math.random() > 0.5 ? "Düşürüldü!" : "Çakıldı!").setColor("Red")

    if (code === 137)
      embed.setTitle("`SIGKILL` sinyali ile bitti!").setColor("DarkGold")
        .setDescription(`Geliştirici ekibi tarafından bota **${code}** koduyla zorunlu \`reset\` attırılıyor!`)
    else
      embed.setTitle("Yakalanamayan hata!").setDescription(`Bot \`${code}\` koduyla \`${++hata == 1 ? "ilk" : hata}\` kez düştü. Tekrar açılıyor!`)

    kontrolcu.send({ embeds: [embed] }).catch(console.error);


  }).on("error", e => console.error("[Kontrolcü] Hata:", e));

})();