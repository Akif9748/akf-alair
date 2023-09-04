const mongoose = require('mongoose');
const createCache = require('./__cache');

const userSema = new mongoose.Schema({
    _id: { type: String, unique: true },
    blacklist: Boolean,

    // numbers:  
    para: { type: Number, default: 0, get: Math.trunc },
    arduino: { type: Number, default: 0 },
    times: {
        arduino: Date,
        gunluk: Date
    },
    // rank:
    guilds: { type: Object, default: {} }

}, { versionKey: false });

userSema.virtual('seviye').get(function () { return Object.values(this.guilds).reduce((a, b) => a + b.seviye, 0); });
userSema.virtual('xp').get(function () { return Object.values(this.guilds).reduce((a, b) => a + b.xp, 0); });
userSema.methods.member = function (id) {
    return this.guilds && (this.guilds[id] ||= { xp: 0, seviye: 0 });
}

module.exports = mongoose.model('user', createCache(userSema));
