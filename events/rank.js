const { User } = require("../util");

module.exports = async message => {
    const xpekle = Math.floor(Math.random() * 7) + 8;

    const user = await User(message.author.id,"guilds para");
    const member = user.member(message.guildId);

    member.xp += xpekle

    if (member.xp > 100 + 50 * member.seviye) {
        user.para += Math.floor(Math.random() * 5000) + 2000;
        member.xp -= 100 + 50 * member.seviye;
        member.seviye++;
    };
    user.markModified("guilds." + message.guildId);

    await user.save();
}