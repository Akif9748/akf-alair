const { User, Member } = require("../util/classes");

module.exports = async message => {
    const xpekle = Math.floor(Math.random() * 7) + 8;
    const member = await new Member().getId(message.guild.id, message.author.id);

    member.xp += xpekle
    member.topxp += xpekle;

    if (member.xp > member.required()) {
        member.xp -= member.required();
        member.seviye++;

    };
    member.write();

    //VERİ TABANI PARÇA İKİ

    const user = await new User().getId(message.author.id);
    user.xp += xpekle;
    user.topxp += xpekle;

    if (user.xp > user.required()) {
        user.para += Math.floor(Math.random() * 5000) + 2000;
        user.xp -= user.required();
        user.seviye++;

    };

    user.write();

}