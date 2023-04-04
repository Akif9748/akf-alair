const mongoose = require('mongoose');

module.exports = mongoose.model('site_usage', new mongoose.Schema({
    _id: String,
    count: Number
}, { versionKey: false }));