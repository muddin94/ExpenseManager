const mongoose = require('mongoose');

const bankSchema = mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true }
});

module.exports = mongoose.model('Bank', bankSchema);