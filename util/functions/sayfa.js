const { MessageActionRow, MessageButton } = require("discord.js");
const { emoji } = require("..");

const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('ilk')
            .setEmoji(emoji.sol)
            .setStyle(1),
        new MessageButton()
            .setCustomId('son')
            .setEmoji(emoji.sag)
            .setStyle(1),
        new MessageButton()
            .setCustomId('sil')
            .setEmoji(emoji.sil)
            .setStyle(4)
    );
/**
 * 
 * @param {import("discord.js").Message} message 
 * @param {import("discord.js").MessageOptions} reply 
 * @param {number} son 
 * @param {function} callback
 */
module.exports = async (message, reply, son, callback) => {

    reply.components ||= [];

    const m = await message.reply({ ...reply, components: [...reply.components, row], fetchReply: true });
    const collector = m.createMessageComponentCollector({ idle: 5 * 60_000 });
    let sayfa = 1;

    const gidilcekler = {};

    collector.on('collect', async interaction => {
        try {
            const { id } = interaction.user;

            if (!interaction.deferred)
                await interaction.deferUpdate();

            if (id !== (message.author || message.user).id) {
                if (id in gidilcekler === false)
                    gidilcekler[id] = sayfa;

                if (interaction.customId == "ilk") {
                    if (gidilcekler[id] != 1)
                        gidilcekler[id]--;
                } else if (interaction.customId == "son") {
                    if (gidilcekler[id] != son)
                        gidilcekler[id]++;
                } else if (interaction.customId == "sil")
                    if (interaction.member.perm("MANAGE_MESSAGES"))
                        return interaction.deleteReply().catch(_ => _);
                    else return;

                await callback(_ => interaction.followUp({ ..._, ephemeral: true }), gidilcekler[id])

            } else {
                if (interaction.customId == "sil")
                    return await interaction.deleteReply().catch(_ => _);

                const nS = sayfa;

                if (interaction.customId == "ilk") {
                    if (sayfa != 1)
                        sayfa--;
                }

                else if (interaction.customId == "son") {
                    if (sayfa != son)
                        sayfa++;
                }

                if (nS == sayfa) return;

                await callback(_ => {
                    if (_.components)
                        _.components.push(row)
                    return interaction.editReply(_);
                }, sayfa)
            }
        } catch (e) {
            message.client.logger.ierror("SAYFA FUNCTION", e);
        }
    });

    collector.on("end", () => m.edit({ components: [] }).catch(_ => _))
    return collector;
};