const { Schema, model } = require('mongoose');

const userSema = new Schema({
    userid: { type: String, unique: true },
    para: Number,
    xp: Number,
    seviye: Number,
    topxp: Number,
    arduino: Number,
    timeout: { type: Object, default: { calis: null, gunluk: null } }//{ arduino: Date.now, gunluk: Date.now }

});

module.exports = model('user', userSema);
