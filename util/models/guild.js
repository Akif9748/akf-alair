const mongoose = require('mongoose');
const createCache = require('./__cache');
const { prefix } = require("../config");

const guildSema = new mongoose.Schema({

    //MAIN: 
    _id: { type: String, unique: true },
    prefix: { type: String, set: p => p.slice(0, 5), default: prefix },

    //ARRAYLAR
    blacklist: [String],

    //BOOLLAR

    rank: Boolean,
    oto: Boolean,

    kufur: Boolean,
    caps: Boolean,
  

}, { versionKey: false });

module.exports = mongoose.model('guild', createCache(guildSema));