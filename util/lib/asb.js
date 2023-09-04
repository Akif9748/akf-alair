const { MessageEmbed } = require("discord.js"),
    { inspect } = require("util"),
    Logger = require("./logger.js"),
    { asb, kontrolcu } = require("./wh.js");

process.on("uncaughtException", async err => {
    if (err.message.includes("abort") || err.message.includes("Unknown interaction") || err.message.includes("YouTube")) {
        await asb.send(`⚫ **Bilinen hata**\n\`\`\`js\n${err.stack || err}\`\`\``).catch(_ => _);
        return Logger.ierror("⚫ Bilinen hata", err);
    }
    Logger.ierror("🔴 uncaughtException", err);
    await asb.send(`🔴**Yakalanamayan kritik hata**\n\`\`\`js\n${err.stack || err}\`\`\``).catch(_ => _);
    process.exit(1);
});

module.exports = {
    event(file, err, _) {
        Logger.ierror("🟡 Event dinleyici hatası", err, "\nEk Bilgi:", _);
        asb.send(`🟡**Event dinleyici hatası**\n**Dosya:**\`${file}\`
        \`\`\`js\n${err.stack || err}\`\`\``).catch(_ => _)
    },
    komut(command, message, e) {
        Logger.ierror("AltKatman: ⚠ Komut", "\nMesaj:", inspect(message, { depth: 0 }), "\nTam Hata:\n", e);

        if (e.code === 50006) return message.reply("Boş mesaj. Göndereceğim mesaj bilinmeyen bir sebepten ötürü boş, komutu düzgün kullan.").catch(_ => _);
        if (e.code === 50013) return message.reply("Yetki sorunu. Bu komutun içeriğini yürütmek için gerekli yetkilerim yok.").catch(_ => _);
        if (e.code === 50035) return message.reply("Boyut sorunu. Vereceğim cevap discorda sığmıyor. Bu bence çok büyük bir sorun değil. Eğer büyük bir sorunsa `davet` komutunu kullananarak bana ulaşabilirsin.").catch(_ => _);
        message.reply("Bir hata oluştu. Nasıl başardın, bilmiyorum ama bunu geliştiricilere bildirdim.").catch(_ => _)
        asb.send(`⚠ **Komut** hatası, komut: **${command}**\n\n\`\`\`js\n${e}\`\`\`\n*Konsolda daha fazla bilgi bulabilirsin!*`).catch(_ => _)
    },
    interaction(interaction, e) {
        Logger.ierror("AltKatman: ⚠ Interaction", "\nInteraction:", inspect(interaction, { depth: 0 }), "\nTam Hata:\n", e);
        if (!interaction.replied)
            interaction.reply({ content: "Bir hata oluştu, komut çalıştırılamadı. Bilgi geliştiricilere iletildi.", ephemeral: true }).catch(_ => _);

        asb.send(`⚠ **Interaction** hatası, komut: **${interaction.commandName}**\n\n\`\`\`js\n${e}\`\`\`\n*Konsolda daha fazla bilgi bulabilirsin!*`).catch(_ => _);
    },
    async telemetri(client, code) {
        try {
            await client.commands.get("botbilgi").run(client, { reply: m => kontrolcu.send(m) }, [], { prefix: "!" });
        } catch (e) {
            Logger.ierror("TELEMETRI", e);
            await kontrolcu.send({
                embeds: [
                    new MessageEmbed().setTitle("Telemetri Hatası!")
                        .setDescription("Bot Bilgisi yüklenemedi")
                ]
            }).catch(Logger.error);
        }

        process.exit(code);
    }
}
