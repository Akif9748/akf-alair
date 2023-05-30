const Discord = require("discord.js");
const { emoji } = require("..");
const { MessageActionRow, MessageButton } = Discord;
const row = new MessageActionRow()
.addComponents(
    new MessageButton()
        .setCustomId('ilk')
        .setEmoji(emoji.sol)
        .setStyle('PRIMARY'),
    new MessageButton()
        .setCustomId('son')
        .setEmoji(emoji.sag)
        .setStyle('PRIMARY'),
    new MessageButton()
        .setCustomId('sil')
        .setEmoji(emoji.sil)
        .setStyle('DANGER')
);
/**
 * 
 * @param {import("discord.js").Message} message 
 * @param {import("discord.js").MessageOptions} reply 
 * @param {number} son 
 * @param {function} callback
 */
module.exports = async (message, reply, son, callback) => {

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

    collector.on("end", () => m.edit({ components: [] }).catch(_ => _))

};