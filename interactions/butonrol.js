const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, CommandInteraction, Client } = require("discord.js")
const { ButtonRole } = require("../util/models/")



/**
 * @param {Client} client
 * @param {CommandInteraction} interaction 
 */

exports.run = async (client, interaction) => {


    if (interaction.channel.type === "DM") return interaction.reply("Sadece sunucular içindir.")
    if (!interaction.member.perm("MANAGE_ROLES")) return interaction.reply({ content: "Yetkin yok.", ephemeral: true })

    if (!interaction.guild.me.perm("MANAGE_ROLES")) return interaction.reply({ content: "Buna yetkim yok.", ephemeral: true })


    const rol = interaction.options.getRole('rol');
    const kanal = interaction.options.getChannel('kanal') || interaction.channel;
    if (rol.name === "@everyone") return interaction.reply({ ephemeral: true, content: "Everyone rolünu kimseden alamam." })
    if (interaction.guild.me.roles.highest.position <= rol.position) return interaction.reply({ ephemeral: true, content: "Bu rol benim rolumden üstün, bu yüzden rol veremem." })

    const açıklama = interaction.options.getString('açıklama') || `${rol.name} rolünu almak için butona basın`;


    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('rolbuton')
                .setEmoji("🆗")
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('rolsil')
                .setLabel('Mesajı sil').setEmoji("⚠")
                .setStyle('DANGER')
        )



    const embed = new MessageEmbed()
        .setTitle(açıklama).setName("Buton Rol")
        .setDescription("Rolu almak için butona basın, tekrar basarsanız rolu geri alırım.")
    await interaction.reply("Rol butonu oluşturuldu!");
    const m = await kanal.send({ embeds: [embed], components: [row] });

    await ButtonRole.create({ roleId: rol.id, authorId: interaction.user.id, _id: m.id, channelId: kanal.id, guildId: interaction.guild.id });

};

exports.data = new SlashCommandBuilder()
    .setName('butonrol')
    .setDescription('Buton rol sistemi ayarlar!')
    .addRoleOption(option => option.setName('rol').setDescription('Rolu gir!').setRequired(true))
    .addStringOption(option => option.setName('açıklama').setDescription('Buton rol başlatırken içine yazılacak şey!'))
    .addChannelOption(option => option.setName('kanal').addChannelType(0).setDescription('Buton rol başlatılacak kanal!'))
