const { MessageEmbed } =  require("discord.js"); 
const { UserModel } = require("../../util/models/");
const { parsenum } = require("../../util");

exports.run = async (client, message) => {
    const get = id => client.users.cache.get(id)?.username || "~~" + id + "~~";

    const veri = await UserModel.find().sort({ para: -1 }).select("para").limit(30);

    const gonder = veri.map((rank, index) =>
        `**${index + 1}.** ${get(rank._id)} • ATC: **${parsenum(rank.para)}**`
    )

    const embeds = [new MessageEmbed()
        .setName("ATC Sıralaması")
        .setTitle("» Alair Global")
        .setDescription(gonder.join("\n"))]
    return message.reply({ embeds })
}


exports.help = {
    native: true,
    names: ["atc", 'para'],
    description: 'Alair Global ATC sıralaması!',
    usage: 'atc'
};
