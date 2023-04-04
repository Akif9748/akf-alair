const mongoose = require('mongoose');
const { prefix } = require("../config")
const guildSema = new mongoose.Schema({

    //MAIN: 
    _id: { type: String, unique: true },

    //ARRAYLAR
    blacklist: [String],

    //STRINGLER
    prefix: { type: String, default: prefix },

    oto: Boolean,
    kufur: Boolean,
    caps: Boolean


}, { versionKey: false });

const cache = new Map();
guildSema.fetchCache = () => cache;
guildSema.getCache = id => cache.get(id);
guildSema.feedCache = d => {
    if (d) cache.set(d._id, d);
    return d;
}
guildSema.pre('save', function (next) {
    guildSema.feedCache(this);
    next();
});

module.exports = mongoose.model('guild', guildSema);