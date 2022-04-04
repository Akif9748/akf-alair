const { Schema, model } = require('mongoose');

module.exports = model('timeout', new Schema({ userid: String, arduino: Number, gunluk: Number }));