const mongoose = require('mongoose');

module.exports = mongoose.model('roleButton',
    new mongoose.Schema({
        authorid: String,
        rolid: String,
        messageid: String
    }, { versionKey: false }));