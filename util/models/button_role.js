const mongoose = require('mongoose');

module.exports = mongoose.model('button_role',
    new mongoose.Schema({
        _id: { type: String, unique: true },
        authorId: String,
        roleId: String,
        channelId: String,
        guildId: String,
    }, { versionKey: false }));