const { Schema, model } = require('mongoose');

const userSema = new Schema({
    userid: String,
    para: Number,
    xp: Number,
    seviye: Number,
    topxp: Number,
    arduino: Number,
    timeout: { type: Object, default: { calis: null, gunluk: null } }

});

module.exports = model('user', userSema);