const Discord = require("discord.js"); // Discord.js'yi tanımladık.
const { MessageEmbed } = Discord;
const { UserModel } = require("../../util/models/");

exports.run = async (client, message, args) => {


    const get = id => client.users.cache.get(id)?.tag || "~~" + id + "~~";

    const seviye = seviye => seviye ? "Seviye: **" + seviye + "**" : "";

    const path = `guilds.${message.guildId}`,
        query = {},
        sort = {}

    query[path] = { $exists: true };
    sort[path + ".seviye"] = -1;
    sort[path + ".xp"] = -1;

    const veri = await UserModel.find(query).select(path).sort(sort).limit(30);
    const gonder = veri.map((rank, index) =>
        `**${index + 1}.** ${get(rank._id)} ${seviye(rank.seviye)} • XP: **${rank.xp}**`
    )

    const embeds = [new MessageEmbed().setName("Seviye Sıralaması")
        .setTitle("» " + message.guild.name)
        .setDescription(gonder.join("\n"))]

    return message.reply({ embeds })

}


exports.help = {
    name: ["sıralama", 'ranklist'],
    description: 'Sunucu seviye sıralaması!',
    usage: 'sıralama'
};
