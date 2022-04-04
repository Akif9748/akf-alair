const { Schema, model } = require('mongoose');

const guildSema = new Schema({

    //MAIN: 
    guildid: String,

    //IDLER
    hgrol: String, //'891243339234566154',
    hgkanal: String,// '841645565925130240',
    log: String, //'941840958096568400',

    //Stringler
    prefix: { type: String, default: "!" },

       //BOOLLAR
    hgkapa: Boolean,//false,
    otokapa: Boolean,// false,
    kufur: Boolean//false,


});

module.exports = model('guild', guildSema);
