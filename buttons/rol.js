module.exports = (interaction, roleId) => {

    if (interaction.member.roles.cache.has(roleId)) {
        interaction.member.roles.remove(roleId).then(() =>
            interaction.reply({ content: "Rolü başarıyla aldım", ephemeral: true })
        ).catch(() => interaction.reply({ content: "Rolü alamadım", ephemeral: true }))

    } else {
        interaction.member.roles.add(roleId).then(() =>
            interaction.reply({ content: "Rolü başarıyla verdim", ephemeral: true })
        ).catch(() => interaction.reply({ content: "Rolü veremedim", ephemeral: true }))
    }

}