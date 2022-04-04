const { SlashCommandBuilder } = require('@discordjs/builders');
const ytara = require("../util/functions/ytara")

exports.run = async (client, interaction) => {

    const result = await ytara(interaction.options.getString('video'))

    if (result)
        return interaction.reply(result);
    else
        return interaction.reply(msj + ' adında bir video bulamadım!');

}

exports.data = new SlashCommandBuilder()
    .setName('ytara')
    .setDescription('Youtubede isimle video arama!')
    .addStringOption(option => option.setName('video').setDescription('Video adını gir!').setRequired(true))

