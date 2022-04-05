const { Schema, model } = require('mongoose');

module.exports = model('custom', new Schema({
    guildid: String,
    authorid: String,
    key: String,
    value: String
}));