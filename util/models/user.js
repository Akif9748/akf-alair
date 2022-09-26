const mongoose = require('mongoose');

const userSema = new mongoose.Schema({
    userid: { type: String, unique: true },
    blacklist: Boolean,

    // numbers:
    para: { type: Number, default: 0 },
    arduino: { type: Number, default: 0 },
    times: {
        arduino: { type: Number, default: null },
        gunluk: { type: Number, default: null }
    },

    // harem:
    harem: Boolean,
    manitalar: [{
        isim: String,
        userid: String,
        asr: { type: Date, default: Date.now }
    }],

    // arrays:
    guilds: { type: Object, default: {} },

    manita: {
        type: {
            isim: String,
            mesaj: String,
            userid: String,
            asr: Date
        }, default: {}
    }

}, { versionKey: false });

userSema.virtual('seviye').get(function () { return Object.values(this.guilds || {}).reduce((a, b) => a + b.seviye, 0); });
userSema.virtual('xp').get(function () { return Object.values(this.guilds || {}).reduce((a, b) => a + b.xp, 0); });
userSema.methods.member = function (id) {
    return (this.guilds && this.guilds[id]) || (this.guilds[id] = { xp: 0, seviye: 0 });
}

module.exports = mongoose.model('user', userSema);
