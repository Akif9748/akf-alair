const { User, random } = require("../util");

module.exports = async message => {
    const xpekle = random(7, 15);

    const user = await User(message.author.id, `guilds para`);
    const member = user.member(message.guildId);

    member.xp += xpekle;

    if (member.xp > 100 + 50 * member.seviye) {
        user.para += random(member.seviye * 500, member.seviye * 1500);
        member.xp -= 100 + 50 * member.seviye;
        member.seviye++;
    }

    user.markModified("guilds." + message.guildId);

    await user.save();
}