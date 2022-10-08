const mongoose = require('mongoose');
const { defaultPrefix } = require("../config.json")
const guildSema = new mongoose.Schema({

    //MAIN: 
    guildId: { type: String, unique: true },

    //ARRAYLAR
    blacklist: { type: [String], default: [] },

    //STRINGLER
    prefix: { type: String, default: defaultPrefix },

    otokapa: { type: Boolean, default: true },
    kufur: Boolean,
    caps: Boolean,
    reklam: Boolean


}, { versionKey: false });

module.exports = mongoose.model('guild', guildSema);
