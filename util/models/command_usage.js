const mongoose = require('mongoose');

module.exports = mongoose.model('command_usage', new mongoose.Schema({
    _id: Date,
    komut: { type: Number, default: 0 },
    interaction: { type: Number, default: 0 },
    komutlar: [
        {
            _id: String,
            kullanim: Number
        }
    ],
    interactionlar: [
        {
            _id: String,
            kullanim: Number
        }
    ]
}, { versionKey: false }));