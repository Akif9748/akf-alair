const mongoose = require('mongoose');

module.exports = mongoose.model('usage', new mongoose.Schema({
    _id: {
        type: Date,
        default: Date.now
    },
    sayi: Number,
    komutlar: [
        {
            _id: String,
            kullanim: Number
        }
    ]
}, { versionKey: false }));