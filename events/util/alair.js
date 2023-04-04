/**
 * [ MİNÖR ]
 * Alair otoCevap zekası:
 * @param {import("discord.js").Message} msg 
 * @param {String} msj 
 * @returns 
 */
module.exports = async (msg, msj) => {
    //MESAJ tek haneyse:
    if (msj.length === 1)
        return msg.reply("Sadece **" + msj + "** yani");


    //💘💛  
    if (msg.includes("gs") || msg.includes("galata")) return msg.reply(":heart: :yellow_heart:");

    //EMOJIYSE:
    if (msj.length === 2)
        return msg.reply([msj, (msj.repeat(Math.floor(Math.random() * 6) + 2))].random());


    //TARİHİN ORUSPU ÇOCUKLARI:
    if (msj.includes("mete"))
        return msg.reply("MeTe hocam mı? Oruspu çocuğunun önde gidenidir :)");

}