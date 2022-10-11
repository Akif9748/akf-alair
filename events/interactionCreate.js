const { ButtonRole } = require("../util/models/")
const Discord = require('discord.js');

/**
 * Alair alt katman dosyası / guildMemberAdd.js
 * @param {Discord.CommandInteraction} interaction
 * @returns 
 */
module.exports = async interaction => {
    const client = interaction.client;
    if (client.blacklist.includes(interaction.user.id)) return;

    if (interaction.isButton()) {



        if (["rolbuton", "rolsil"].includes(interaction.customId)) {
            try {
                const buton = await ButtonRole.findById(interaction.message.id)
                if (!buton) return;

                if (interaction.customId === "rolsil") {
                    if (interaction.member.id !== buton.authorId) return;
                    await buton.remove();
                    return interaction.message.delete();

                }
                else
                    return await require("../buttons/rol")(interaction, buton.roleId);

            } catch (e) { console.error(e) }

        }

    }


    else if (!interaction.isSelectMenu())
        try {
            if (!interaction.guild) return interaction.deferReply();
            await client.interactions.get(interaction.commandName).run(client, interaction);
        } catch (e) {
            console.error(e);
        } finally {
            client.ayarlar.kullanim.interaction++;
        }
}
