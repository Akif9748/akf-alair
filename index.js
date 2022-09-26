console.info("[Kontrolcü] devrede!", "\n\x1b[31m\x1b[40m" + require('figlet').textSync("inos & akis works"), "\x1b[0m");
const { fork } = require('child_process');
const { MessageEmbed } = require('discord.js');
const { kontrolcu } = require("./util/wh");

const SIGTERM_EMBED = new MessageEmbed().setTitle("`SIGTERM` sinyali!").setDescription("Kontrolcüden kapanışı isteniyor! Talep kabul edildi, kontrolcü yeniden açılıyor!").setColor("BLURPLE")

process.on('SIGTERM', () => kontrolcu.send({ embeds: [SIGTERM_EMBED] }).then(_ => process.exit(143)).catch(console.error));

let hata = 0;

(function create() {
  fork("app").on("exit", code => {
    create();

    console.log("[Kontrolcü]", code, "koduyla bitti, yeniden başlatılıyor!");
    const embed = new MessageEmbed().setTitle(Math.random() > 0.5 ? "Düşürüldü!" : "Çakıldı!").setColor("RED").setAuthor({ name: "ASB - KONTROLCÜ" })

    if (code === 137)
      embed.setTitle("`SIGKILL` sinyali ile bitti!").setColor("DARK_GOLD")
        .setDescription(`Geliştirici ekibi tarafından bota **${code}** koduyla zorunlu \`reset\` attırılıyor!`)
    else
      embed.setTitle("Yakalanamayan hata!").setDescription(`Bot \`${code}\` koduyla \`${++hata == 1 ? "ilk" : hata}\` kez düştü. Tekrar açılıyor!`)

    if (process.platform === "linux")
      kontrolcu.send({ embeds: [embed] }).catch(console.error);


  }).on("error", e => {
    console.log("Hata:", e);
    setTimeout(create, 200);
  });

})();
