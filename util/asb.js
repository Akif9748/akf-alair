const { Usage, InteractionUsage } = require("./models"),
    { MessageEmbed } = require("discord.js"),
    { asb, kontrolcu } = require("./wh");

process.on("uncaughtException", async err => {
    console.error("🔴 [uncaughtException]", err);
    if (err.message.includes("abort") || err.message.includes("Unknown interaction") || err.message.includes("YouTube")) return;
    await asb.send(`🔴**Yakalanamayan kritik hata**\n\`\`\`js\n${err.stack || err}\`\`\``).catch(_ => _);
    process.exit(1);
});

module.exports = {
    event(file, err, _) {
        console.error("🟡 [Event dinleyici hatası]", err, "\nEk Bilgi:", _);
        asb.send(`🟡**Event dinleyici hatası**\n**Dosya:**\`${file}\`
        \`\`\`js\n${err.stack || err}\`\`\``).catch(_ => _)
    },
    komut(command, message, e) {
        console.error("⚠ [Komut içi alt katman hatası]\n", require('util').inspect(message, { depth: 0 }), "\nTam Hata:\n", e);
        if (e.code === 50006) return message.reply("Boş mesaj. Göndereceğim mesaj bilinmeyen bir sebepten ötürü boş, komutu düzgün kullan.").catch(_ => _);
        if (e.code === 50013) return message.reply("Yetki sorunu. Bu komutun içeriğini yürütmek için gerekli yetkilerim yok.").catch(_ => _);
        if (e.code === 50035) return message.reply("Boyut sorunu. Vereceğim cevap discorda sığmıyor. Bu bence çok büyük bir sorun değil. Eğer büyük bir sorunsa `davet` komutunu kullananarak bana ulaşabilirsin.").catch(_ => _);
        message.reply("Bir hata oluştu. Nasıl başardın, bilmiyorum ama bunu geliştiricilere bildirdim.").catch(_ => _)
        asb.send(`⚠ **Komut** hatası, komut: **${command}**\n\n\`\`\`js\n${e}\`\`\`\n*Konsolda daha fazla bilgi bulabilirsin!*`).catch(_ => _)
    },
    async sigterm(client, code = 0) {
        const interactionlar = client.interactions.filter(komut => komut.kullanim)
        const isayi = interactionlar.reduce((a, b) => a + b.kullanim, 0);
        if (isayi)
            await InteractionUsage.create({
                sayi: isayi,
                komutlar: interactionlar.map((dosya, komut) => ({ _id: komut, kullanim: dosya.kullanim }))
            }).catch(_ => _);


        const komutlar = client.commands.filter(komut => typeof komut !== "string" && komut.kullanim)
        const sayi = komutlar.reduce((a, b) => a + b.kullanim, 0);
        if (sayi)
            await Usage.create({
                sayi,
                komutlar: komutlar.map((dosya, komut) => ({ _id: komut, kullanim: dosya.kullanim }))
            }).catch(_ => _);

        try {
            await kontrolcu.send(await client.commands.get("botbilgi").run(client, {}, ["asb"], { prefix: "!" }))
        } catch (e) {
            console.error(e);
            await kontrolcu.send({
                embeds: [
                    new MessageEmbed().setTitle("Telemetri Hatası!")
                        .setDescription(`Telemetri kaydı işlendi, oturum **${sayi}** komut, **${isayi}** interaction kullanımıyla kapatılıyor.`)
                ]
            }).catch(console.error);
        }

        process.exit(code);

    }
}
