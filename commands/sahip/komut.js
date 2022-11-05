const Discord = require('discord.js');

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {*} args 
 * @returns 
 */
exports.run = async (client, message, args) => {
    if (!message.member.isOwner()) return message.reply(`Bu komutu sadece Bot Sahibi kullanabilir!`);
    if (!args[0]) return message.reply("Komut adı eksik!")

    let komut = client.commands.get(args[0].toLowerCase());
    if (!komut) return message.reply("Tüm allasiases dereceleri üzerinde, böyle bir komut yok!");

    if (typeof komut === "string")
        komut = client.commands.get(komut);

    const { tur, file } = komut;
    const konum = `../${komut.tur}/${komut.file}`;
    await message.reply("Komut bulundu!\n"
        + "**Komut adları:** `" + String(komut.help.name) + "`\n"
        + "**Komut türü:** `" + tur + "`\n"
        + "**Gizli mi?** `" + (komut.help.gizli ? "Evet" : "Hayır") + "`\n"
        + "**Konum:** `" + konum + "`"
    )



    /* silici */

    let _adlar = komut.help.name;
    if (!Array.isArray(_adlar)) _adlar = [_adlar];

    client.commands.delete(_adlar[0]);

    delete require.cache[require.resolve(konum)];
    const m = await message.channel.send("Komut " + _adlar.length + " alliasesiyle silindi!")

    /* yükleyici */
    const dosya = require(konum);
    let adlar = dosya.help.name;
    if (!Array.isArray(adlar)) adlar = [adlar];

    client.commands.set(adlar[0], { ...dosya, file, tur });

    await m.edit(`Komut ${adlar.length} alliasesiyle yeniden eklendi!`)

};

exports.help = {
    name: 'komut',
    description: 'Komut sil & resetle',
    usage: 'komut <komut-adi>', gizli: true
};
