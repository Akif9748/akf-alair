const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const { ButtonRole } = require("../../util/models/")
const { Resolvers } = require("../../util/")

const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('rolbuton')
            .setEmoji("🆗")
            .setStyle(1),
        new MessageButton()
            .setCustomId('rolsil')
            .setLabel('Mesajı sil').setEmoji("⚠")
            .setStyle(4)
    )



/**
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").Message} message
 */

exports.run = async (client, message, args) => {
    if (!message.member.perm("MANAGE_ROLES")) return message.reply({ content: "Yetkin yok.", ephemeral: true })
    if (!message.guild.members.me.perm("MANAGE_ROLES")) return message.reply({ content: "Buna yetkim yok.", ephemeral: true })

    let kanal, rol;
    if (message.options) {
        kanal = message.options.getChannel('kanal') || message.channel;
        rol = message.options.getRole('rol');
    } else {
        if (!args[0]) return message.hata();
        rol = Resolvers.Role({ message });
        kanal = Resolvers.Channel({ message, search: args[1] }) || message.channel;
    }

    if (rol.name === "@everyone") return message.reply({ ephemeral: true, content: "Everyone rolünu kimseden alamam." })
    if (message.guild.members.me.roles.highest.position <= rol.position) return message.reply({ ephemeral: true, content: "Bu rol benim rolumden üstün, bu yüzden rol veremem." })

    const açıklama = message.options?.getString('açıklama') || `${rol.name} rolünu almak için butona basın`;

    const embed = new MessageEmbed()
        .setTitle(açıklama).setName("Buton Rol")
        .setDescription("Rolu almak için butona basın, tekrar basarsanız rolu geri alırım.")
    await message.reply("Rol butonu oluşturuldu!");
    const m = await kanal.send({ embeds: [embed], components: [row] });

    await ButtonRole.create({ roleId: rol.id, authorId: message.author.id, _id: m.id, channelId: kanal.id, guildId: message.guild.id });

};

exports.help = {
    native: true,
    names: ["butonrol"],
    description: "Buton rol sistemi ayarlar!",
    usage: "butonrol <@rol> [#kanal]",
    options: [
        { name: "rol", description: "Rolu gir!", type: 8, required: true },
        { name: "açıklama", description: "Buton rol başlatırken içine yazılacak şey!", type: 3 },
        { name: "kanal", description: "Buton rol başlatılacak kanal!", type: 7 }
    ]
}