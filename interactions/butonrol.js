const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, Interaction, Permissions, Client } = require("discord.js")



/**
 * @param {Client} client
 * @param {Interaction} interaction 
 */

exports.run = (client, interaction) => {


    if (interaction.channel.type === "DM") return interaction.reply("Sadece sunucular içindir.")

    if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return interaction.reply({ content: "Buna yetkim yok." })

    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return interaction.reply({ content: "Yetkin yok.", ephemeral: true })

    const rol = interaction.options.getRole('rol')

    if (rol.name === "@everyone") return interaction.reply("Everyone rolünu kimseden alamam.")
    if (interaction.guild.me.roles.highest.position <= rol.position) return interaction.reply("Bu rol benim rolumden üstün, bu yüzden rol veremem.")
    const acikla = interaction.options.getString('açıklama');
    const açıklama = acikla ? acikla : rol.name + " rolünu almak için butona basın"


    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('buton')
                .setEmoji("🆗")
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('sil')
                .setLabel('Mesajı sil').setEmoji("⚠")
                .setStyle('DANGER')
        )



    const embed = new MessageEmbed()
        .setColor(client.renk)
        .setAuthor({ name: `${client.user.username} • Buton Rol`, iconURL: client.user.avatarURL() })
        .setTitle(açıklama)
        .setDescription("Rolu almak için butona basın, tekrar basarsanız rolu geri alırım.")

    interaction.reply({ embeds: [embed], components: [row] })



    client.on('interactionCreate', async interaction2 => {
        const m = await interaction.fetchReply();

        if (!interaction2.isButton() || interaction2.message.id !== m.id) return;
        if (interaction2.customId == "sil") {
            if (interaction2.member.id == interaction.member.id)
                return interaction.deleteReply();

        } else {

            if (interaction2.member.roles.cache.has(rol.id)) {
                interaction2.member.roles.remove(rol).then(r => {
                    console.log(r)


                    interaction2.reply({ content: "Rolü başarıyla aldım", ephemeral: true })
                }
                ).catch(e => interaction2.reply({ content: "Rolü alamadım", ephemeral: true }))

            } else {
                interaction2.member.roles.add(rol).then(r =>
                    interaction2.reply({ content: "Rolü başarıyla verdim", ephemeral: true })
                ).catch(e => interaction2.reply({ content: "Rolü veremedim", ephemeral: true }))
            }

        }

    });


};

exports.data = new SlashCommandBuilder()
    .setName('butonrol')
    .setDescription('Buton rol sistemi ayarlar!')
    .addRoleOption(option => option.setName('rol').setDescription('Rolu gir!').setRequired(true))
    .addStringOption(option => option.setName('açıklama').setDescription('Buton rol başlatırken içine yazılacak şey!'))

