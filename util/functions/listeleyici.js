const { MessageEmbed } = require("discord.js")
/**
 * 
 * @param {Array} arr 
 * @param {MessageEmbed} embed 
 * @returns {[MessageEmbed]}
 */
module.exports = (arr, embed, fun = _ => _) => {

    const embeds = [new MessageEmbed(embed)];

    for (const sonuc of arr) {
        if (embeds.at(-1).description?.length > 4096)
            embeds.push(new MessageEmbed(embed).setDescription(`${fun(sonuc)}\n`));
        embeds.at(-1).description ||= ""
        embeds.at(-1).description += fun(sonuc) + "\n";
    }
    return embeds.slice(0, 10).map((e, i) => e.setFooter({ text: `Sayfa ${i + 1}/${embeds.length}` }).setDescription(e.description?.slice(0, 4096)))
}