


module.exports = (interaction, roleId) => {

    if (interaction.member.roles.cache.has(roleId)) {
        interaction.member.roles.remove(roleId).then(r =>
            interaction.reply({ content: "Rolü başarıyla aldım", ephemeral: true })
        ).catch(e => interaction.reply({ content: "Rolü alamadım", ephemeral: true }))

    } else {
        interaction.member.roles.add(roleId).then(r =>
            interaction.reply({ content: "Rolü başarıyla verdim", ephemeral: true })
        ).catch(e => interaction.reply({ content: "Rolü veremedim", ephemeral: true }))
    }

}