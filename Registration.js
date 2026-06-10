const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String
});

module.exports = mongoose.model('Registration', registrationSchema);
