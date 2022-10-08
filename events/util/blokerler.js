const kufur = require("../../util/kufur.json")
const { delay } = require("../../util")
const REGEX = /(https?:\/\/(?:www\.|(?!www))?[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g;

exports.kufur = async message => {
    if (kufur.some(word => (` ${message.content.toLowerCase()} `).includes(` ${word} `)))
        return await kes(message, "Küfürlü mesaj saptandı ve silindi.")
}
exports.caps = async message => {

    if (message.content.toLocaleUpperCase("tr") === message.content && /^[a-zA-Z]/g.test(message.content))
        return await kes(message, "Tamamı büyük harflerden oluşan mesaj tespit edildi ve silindi.")
}
exports.reklam = async message => {
    if (message.content.includes("discord.gg/") || REGEX.test(message.content))
        return await kes(message, "Reklam içeren mesaj tespit edildi ve silindi.")
}
async function kes(message, tip) {
    try {
        await message.delete();
        const uyarı = await message.channel.send(tip);
        await delay(2000);
        await uyarı.delete();
        return true;
    } catch { return true; }

}