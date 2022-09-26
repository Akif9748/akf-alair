const mongoose = require('mongoose');
const { defaultPrefix } = require("../config.json")
const guildSema = new mongoose.Schema({

    //MAIN: 
    guildId: { type: String, unique: true },

    //IDLER
    hgrol: String,
    hgkanal: String,
    log: String,
    sayac: String,


    //ARRAYLAR
    blacklist: { type: [String], default: [] },

    //NESTED / OBJELER \ OYUNLAR
    sayi: {
        channelId: String,
        sayi: { type: Number, default: 0 }
    },
    kelime: {
        channelId: String,
        topkelime: { type: Number, default: 0 },
        sonharf: String,
        kelimeler: [String],
    },

    //STRINGLER
    prefix: { type: String, default: defaultPrefix },
    hgmesaj: String,

    //BOOLLAR
    sunucukur: Boolean,

    hgkapa: Boolean,
    otokapa: { type: Boolean, default: true },
    kufur: Boolean,
    caps: Boolean,
    reklam: Boolean,
    etiket: Boolean


}, { versionKey: false, });

module.exports = mongoose.model('guild', guildSema);
