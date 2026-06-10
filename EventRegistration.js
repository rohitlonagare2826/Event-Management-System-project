const mongoose = require('mongoose');

const eventRegistrationSchema = new mongoose.Schema({
  eventId:    { type: String, required: true },
  eventTitle: { type: String },
  eventDate:  { type: String },
  venue:      { type: String },
  userName:   { type: String, required: true, trim: true },
  contact:    { type: String, required: true },
  className:  { type: String, required: true, trim: true },
  userEmail:  { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('EventRegistration', eventRegistrationSchema);
