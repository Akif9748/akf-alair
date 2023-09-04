exports.run = async (client, message, args, { prefix }) => {
    if (!args[0]) return message.hata()
    return require("../../events/util/oto_cevap")(message, prefix, true)

}
exports.help = {
    native: true,
    names: ["sor"],
    description: 'Bota soru sorar.',
    usage: 'sor <soru>',
};