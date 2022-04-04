const kufur = require("../util/kufur.json")

module.exports = message => {
    const msj = message.content.toLowerCase()

    if (kufur.some(word => (" " + msj + " ").includes(" " + word + " ")) || kufur.some(word => msj == word))
        message.delete().then(_m =>
            message.channel.send("Küfürlü mesaj saptandı ve silindi.").then(uyarı => setTimeout(() => uyarı.delete(), 2000)).catch(console.error)
        ).catch(console.error)

}
