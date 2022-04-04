const log = require("./util/log.js"),
    { Guild } = require("../util/classes");
module.exports = async message => {
    if (message.channel.type == "DM") return;
    const guild = await new Guild().getId(message.guild.id)
    if (guild.log)
        log.delete(message, guild.log);

}