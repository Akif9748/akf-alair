const { Schema, model } = require('mongoose');

const kelimeSema = new Schema({

    //idler: 
    guildid: String,
    channelid: String,

    //Kelimeye dair:
    topkelime: Number,
    sonharf: String,
    kelimeler: [String],

});

module.exports = model('kelime', kelimeSema);