const Discord = require("discord.js");
const { MessageActionRow, MessageButton } = Discord;
/**
 * 
 * @param {Discord.Message} message 
 * @param {Discord.MessageOptions} reply 
 * @param {number} son 
 * @param {function} callback
 */
module.exports = async (message, reply, son, callback) => {

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('ilk')
                .setEmoji("◀")
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('son')
                .setEmoji("▶")
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('sil')
                .setLabel('Mesajı sil').setEmoji("⚠")
                .setStyle('DANGER')
        );

    const m = await message.reply({ ...reply, components: [row], fetchReply: true });
    const collector = m.createMessageComponentCollector({ idle: 5 * 60_000 });
    let sayfa = 1;

    const gidilcekler = {};

    collector.on('collect', async interaction => {
        if (!interaction.replied)
            await interaction.deferUpdate();
        try {
            const { id } = interaction.user;

            if (id !== (message.author || message.user).id) {
                if (id in gidilcekler === false)
                    gidilcekler[id] = sayfa;

                if (interaction.customId == "ilk") {
                    if (gidilcekler[id] != 1)
                        gidilcekler[id]--;
                }

                else if (interaction.customId == "son") {
                    if (gidilcekler[id] != son)
                        gidilcekler[id]++;
                } else
                    if (interaction.member.perm("MANAGE_MESSAGES"))
                        return interaction.deleteReply();
                    else return;


                await callback(_ => interaction.followUp({ ..._, ephemeral: true }), gidilcekler[id])

            } else {
                if (interaction.customId == "sil")
                    return interaction.deleteReply();

                if (interaction.customId == "ilk") {
                    if (sayfa != 1)
                        sayfa--;
                }

                else if (sayfa != son)
                    sayfa++;

                await callback(_ => {
                    if (_.components)
                        _.components.push(row)
                    return interaction.editReply(_);
                }, sayfa)
            }
        } catch (e) { console.error(e) }



    })
    collector.on("end", c => m.edit({ components: [] }).catch(_ => _))



};
