const mongoose = require('mongoose');

module.exports = mongoose.model('custom', new mongoose.Schema({
    guildId: String,
    authorid: String,
    key: String,
    value: String
}, { versionKey: false, }));