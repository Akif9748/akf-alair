const { ButtonRole } = require("../util/models/")
const { Guild } = require("../util");
/**
 * Alair alt katman dosyası / guildMemberAdd.js
 * @param {import("discord.js").CommandInteraction} interaction
 * @returns 
 */
module.exports = async interaction => {
    const client = interaction.client;
    if (client.blacklist.includes(interaction.user.id)) return;
    const guild = await Guild(interaction.guildId);
    if (guild.blacklist?.includes(interaction.channelId) && !interaction.member.isAdmin())
        return interaction.reply({ content: "Bu kanalda komutlar kullanıma kapalıdır!", ephemeral: true });

    if (interaction.isButton()) {
        if (["rolbuton", "rolsil"].includes(interaction.customId)) {
            try {
                const buton = await ButtonRole.findById(interaction.message.id)
                if (!buton) return;

                if (interaction.customId === "rolsil") {
                    if (interaction.member.id !== buton.authorId) return;
                    await buton.deleteOne();
                    return interaction.message.delete();

                }
                else
                    return require("../buttons/rol")(interaction, buton.roleId);

            } catch (e) { console.error(e) }

        }

    }


    else if (!interaction.isStringSelectMenu()) {
        if (!interaction.guild) return interaction.deferReply();
        const komut = client.interactions.get(interaction.commandName);
        try {
            interaction.author ||= interaction.user;
            interaction.edit ||= interaction.editReply;
            if (komut.data.native)
                await komut.run(client, interaction, [], guild);
            else
                await komut.run(client, interaction, guild);
        } catch (e) {
            console.error("⚠ [Interaction içi alt katman hatası]\n", require('util').inspect(interaction, { depth: 0 }), "\nTam Hata:\n", e);
            if (!interaction.replied)
                interaction.reply({ content: "Bir hata oluştu, komut çalıştırılamadı. Bilgi geliştiricilere iletildi.", ephemeral: true }).catch(_ => _)
            client.wh.asb.send(`⚠ **Interaction** hatası, komut: **${interaction.commandName}**\n\n\`\`\`js\n${e}\`\`\`\n*Konsolda daha fazla bilgi bulabilirsin!*`).catch(_ => _)
        } finally {
            client.ayarlar.kullanim.interaction++;
            komut.kullanim++;
        }
    }
}
