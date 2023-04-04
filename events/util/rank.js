const { User, random } = require("../../util");

module.exports = async message =>
    User(message.author.id, `guilds para`).then(user => {
        const member = user.member(message.guildId);
        member.xp += random(7, 15);
        if (member.xp > 100 + 50 * member.seviye) {
            user.para += random(member.seviye * 500, member.seviye * 1500);
            member.xp -= 100 + 50 * member.seviye;
            member.seviye++;
        }

        user.markModified("guilds." + message.guildId);

        return user.save();
    }).catch(_ => _);
