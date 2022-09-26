const mongoose = require('mongoose');

module.exports = mongoose.model('ceylin', new mongoose.Schema({ soz: String, timestamp: Number }, { versionKey: false }));