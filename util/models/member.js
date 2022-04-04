const { Schema, model } = require('mongoose');

const memberSema = new Schema({
    guildid: String,
    userid: String,
    xp: Number,
    seviye: Number,
    topxp: Number
});

module.exports = model('member', memberSema);