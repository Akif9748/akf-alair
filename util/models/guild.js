const mongoose = require('mongoose');
const { prefix } = require("../config.json")
const guildSema = new mongoose.Schema({

    //MAIN: 
    _id: { type: String, unique: true },

    //ARRAYLAR
    blacklist: [String],

    //STRINGLER
    prefix: { type: String, default: prefix },

    oto: Boolean,
    kufur: Boolean,
    caps: Boolean,
    reklam: Boolean


}, { versionKey: false });

module.exports = mongoose.model('guild', guildSema);
