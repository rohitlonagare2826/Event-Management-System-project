const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  date:  { type: String, required: true },
  venue: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  organizerEmail: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
