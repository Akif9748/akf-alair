const { Schema, model } = require('mongoose');

module.exports = model('roleButton', new Schema({ rolid: String, messageid: String }));