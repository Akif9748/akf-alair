const { ButtonRolModel } = require("../util/models/")

module.exports = async interaction => {
    const client = interaction.client;

    if (interaction.isButton()) {
        if (interaction.customId === "rolbuton") {
            const buton = await ButtonRolModel.findOne({ messageid: interaction.message.id });
            if (buton)
                return require("../buttons/rol")(interaction, buton.rolid);

        } else if (interaction.customId === "rolsil") {
            await ButtonRolModel.deleteOne({ messageid: interaction.message.id });
            interaction.update({ content: "Bu buton rol açan kişi tarafından durduruldu.", embeds: [], components: [] })
        }
    }
    
    else if (!interaction.isSelectMenu())
        try {
            client.interactions.get(interaction.commandName).run(client, interaction);
        } catch (e) {
            console.error(e);
        } finally {
            client.ayarlar.kullanim.interaction++;
        }
}
