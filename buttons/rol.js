


module.exports = (interaction, rolid) => {

    //   if (interaction2.member.id == interaction.member.id)    return interaction.deleteReply();
    if (interaction.member.roles.cache.has(rolid))
        interaction.member.roles.remove(rolid).then(r =>
            interaction.reply({ content: "Rolü başarıyla aldım", ephemeral: true })

        ).catch(e => interaction.reply({ content: "Rolü alamadım", ephemeral: true }))

    else
        interaction.member.roles.add(rolid).then(r =>
            interaction.reply({ content: "Rolü başarıyla verdim", ephemeral: true })
        ).catch(e => interaction.reply({ content: "Rolü veremedim", ephemeral: true }))



}