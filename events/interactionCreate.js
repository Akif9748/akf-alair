const { ButtonRole, CommandUsage } = require("../util/models/");
const { Guild } = require("../util");
const asb = require("../util/lib/asb");

/**
 * Alair alt katman dosyası / guildMemberAdd.js
 * @param {import("discord.js").CommandInteraction} interaction
 * @returns 
 */
module.exports = async interaction => {

    interaction.client.logger.info("INTERACTION_GELDI", interaction.commandName || interaction.customId, interaction.user.tag);

    if (!interaction.channel || interaction.channel.type === 1) return interaction.reply({ content: "Bu komutu özel mesajlarda kullanamazsın!", ephemeral: true });

    const client = interaction.client;
    if (client.blacklist.includes(interaction.user.id)) return;
    const guild = await Guild(interaction.guildId);

    if (interaction.isButton()) {
        if (["rolbuton", "rolsil"].includes(interaction.customId)) {
            await interaction.deferReply({ ephemeral: true });

            const buton = await ButtonRole.findById(interaction.message.id);
            if (!buton) return;

            if (interaction.customId === "rolsil") {
                if (interaction.member.id !== buton.authorId) return;
                await buton.deleteOne();
                return interaction.message.delete();

            } else if (interaction.customId === "rolbuton") {
                const { roles } = interaction.member,
                    rply = content => interaction.editReply({ content, ephemeral: true });

                if (roles.cache.has(buton.roleId))
                    roles.remove(buton.roleId)
                        .then(() => rply("Rolü başarıyla aldım"))
                        .catch(() => rply("Rolü alamadım"));

                else
                    roles.add(buton.roleId)
                        .then(() => rply("Rolü başarıyla verdim"))
                        .catch(() => rply("Rolü veremedim"));

                return;
            }

        }
    }


    if (interaction.isCommand()) {

        if (!interaction.guild || guild.blacklist?.includes(interaction.channelId) && !interaction.member.isAdmin())
            return interaction.reply({ content: "Bu kanalda komutlar kullanıma kapalıdır!", ephemeral: true });

        const komut = client.interactions.get(interaction.commandName);

        try {
            if (!komut) return interaction.editReply({ content: "Böyle bir komut yok!", ephemeral: true });

            await interaction.deferReply();

            interaction.author ||= interaction.user;
            interaction.edit ||= interaction.editReply;

            interaction.reply = function (options) {
                return this.deferred ? this.editReply(options) : this.reply(options);
            }

            interaction.hata = (ek = "") => interaction.reply({ content: "```Komutu kullanırken bir şeyi yanlış yapmış olmalısınız.```\n" + ek, ephemeral: true }).catch(_ => _);

            let cmd = komut;

            if (cmd.subcommands?.has(interaction.options.getSubcommand()))
                cmd = cmd.subcommands.get(interaction.options.getSubcommand());

            if (cmd.data.native)
                await cmd.run(client, interaction, [], guild);
            else
                await cmd.run(client, interaction, guild);

        } catch (e) {
            asb.interaction(interaction, e);
        } finally {
            komut.kullanim++;

            const cmd = await CommandUsage.exists({ _id: client.today, "interactionlar._id": interaction.commandName });

            if (cmd)
                await CommandUsage.updateOne(
                    { _id: client.today, "interactionlar._id": interaction.commandName },
                    { $inc: { "interactionlar.$.kullanim": 1, komut: 1 } }
                );
            else
                await CommandUsage.updateOne({ _id: client.today }, {
                    $push: {
                        interactionlar: {
                            _id: interaction.commandName,
                            kullanim: 1
                        }
                    },
                    $inc: { komut: 1 }
                });
        }
    }
}
