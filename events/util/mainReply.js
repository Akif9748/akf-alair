const { MessageEmbed, Message } = require('discord.js');


/**
 * Rastgele item getirir
 * @param {[String]} c İtemlerin arrayı
 * @returns {String} Rastgele item
 */
const ra = arr => arr[Math.floor(Math.random() * arr.length)];
/**
 * Alair otoCevap zekası: (Küçültülmüş)
 * @param {Message} msg 
 * @param {String} msj 
 * @returns 
 */
module.exports = (msg, msj) => {

    //MESAJ tek haneyse:
    if (msj.length === 1)
        return msg.reply("Sadece **" + msj + "** yani");


    //💘💛  
    if (msg.includes("gs") || msg.includes("galata")) return msg.reply(":heart: :yellow_heart:");

    //EMOJIYSE:
    if (msj.length === 2)
        return msg.reply(ra([msj, (msj.repeat(Math.floor(Math.random() * 6) + 2))]));


    //TARİHİN ORUSPU ÇOCUKLARI:
    if (msj.includes("mete"))
        return msg.reply("MeTe hocam mı? Oruspu çocuğunun önde gidenidir :)");


}

