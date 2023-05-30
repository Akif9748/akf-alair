/**
 * 
 * @param {import("discord.js").Client} client 
 * @param {import("discord.js").Message} message 
 * @param {[String]} args 
 * @returns 
 */
exports.run = async (client, message, args) => {
    if (!message.member.isOwner()) return message.reply(`Bu komutu sadece bot sahibi kullanabilir!`);
    if (!args[0]) return message.reply("Komut adı eksik!")

    let komut = client.commands.get(args[0].toLowerCase());
    if (!komut) return message.reply("Tüm dereceler üzerinde komut bulunamadı!");

    if (typeof komut === "string")
        komut = client.commands.get(komut);

    const { tur, dosyaAdi } = komut;
    const konum = `../${tur}/${dosyaAdi}`;
    await message.reply("Komut bulundu!\n"
        + "**Komut adı:** `" + komut.help.name + "`\n"
        + "**Gizli mi?** `" + (komut.help.gizli ? "Evet" : "Hayır") + "`\n"
        + "**Konum:** `" + konum + "`"
    )

    /* silici */

    let ad = args[0].toLowerCase(); // beta
    client.commands.delete(ad);
    delete require.cache[require.resolve(konum)];

    const m = await message.channel.send("Komut silindi!");

    /* yükleyici */
    const dosya = require(konum);
    client.commands.set(ad, { run: dosya.run, help: dosya.help, dosyaAdi, tur, kullanim: 0 });

    return m.edit(`Komut yeniden eklendi!`);

};

exports.help = {
    name: 'komut',
    description: 'Komut sil & resetle',
    usage: 'komut <komut-adi>', gizli: true
};
