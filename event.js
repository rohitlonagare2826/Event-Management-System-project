const express  = require('express');
const router   = express.Router();
const Event    = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const { verifyToken, requireRole } = require('../middleware/auth');

// ─── Input Validation Helpers ────────────────────────────────────────────────
function isValidContact(contact) {
  return /^[6-9]\d{9}$/.test(contact); // Indian 10-digit mobile
}

function sanitizeString(str) {
  return typeof str === 'string' ? str.trim() : '';
}

// ═══════════════════════════════════════════════════════════════
//  ORGANIZER ROUTES  (protected: must be logged in as organizer)
// ═══════════════════════════════════════════════════════════════

// CREATE EVENT
router.post('/create-event', verifyToken, requireRole('organizer'), async (req, res) => {
  try {
    const { title, date, venue, description } = req.body;

    // Validation
    if (!title || !date || !venue) {
      return res.status(400).json({ message: 'Title, date, and venue are required.' });
    }
    if (sanitizeString(title).length < 3) {
      return res.status(400).json({ message: 'Event title must be at least 3 characters.' });
    }
    if (!date || isNaN(Date.parse(date))) {
      return res.status(400).json({ message: 'Please enter a valid date.' });
    }

    const event = new Event({
      title:          sanitizeString(title),
      date:           sanitizeString(date),
      venue:          sanitizeString(venue),
      description:    sanitizeString(description),
      organizerEmail: req.user.email   // taken from JWT, not from request body
    });

    await event.save();
    res.json({ message: 'Event created successfully.' });

  } catch (err) {
    console.error('Create event error:', err);
    res.status(500).json({ message: 'Server error while creating event.' });
  }
});

// DELETE EVENT
router.delete('/event/:id', verifyToken, requireRole('organizer'), async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting event.' });
  }
});

// VIEW REGISTRATIONS (ORGANIZER)
router.get('/event-registrations/:eventId', verifyToken, requireRole('organizer'), async (req, res) => {
  try {
    const regs = await EventRegistration.find({ eventId: req.params.eventId });
    res.json(regs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching registrations.' });
  }
});

// ═══════════════════════════════════════════════════════════════
//  USER ROUTES  (protected: must be logged in)
// ═══════════════════════════════════════════════════════════════

// GET ALL EVENTS
router.get('/events', verifyToken, async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events.' });
  }
});

// REGISTER FOR EVENT (USER)
router.post('/register-event', verifyToken, requireRole('user'), async (req, res) => {
  try {
    const { eventId, eventTitle, eventDate, venue, userName, contact, className } = req.body;

    // Validation
    if (!eventId || !userName || !contact || !className) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (sanitizeString(userName).length < 2) {
      return res.status(400).json({ message: 'Please enter your full name.' });
    }
    if (!isValidContact(contact)) {
      return res.status(400).json({ message: 'Please enter a valid 10-digit mobile number.' });
    }
    if (sanitizeString(className).length < 1) {
      return res.status(400).json({ message: 'Please enter your class.' });
    }

    const reg = new EventRegistration({
      eventId,
      eventTitle: sanitizeString(eventTitle),
      eventDate:  sanitizeString(eventDate),
      venue:      sanitizeString(venue),
      userName:   sanitizeString(userName),
      contact:    sanitizeString(contact),
      className:  sanitizeString(className),
      userEmail:  req.user.email  // taken from JWT, not from request body
    });

    await reg.save();
    res.json({ message: 'Registered successfully.' });

  } catch (err) {
    console.error('Event registration error:', err);
    res.status(500).json({ message: 'Server error during event registration.' });
  }
});

module.exports = router;
