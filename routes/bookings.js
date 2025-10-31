
import express from 'express';
import Booking from '../models/Booking.js';
import auth from '../middleware/auth.js';
const router = express.Router();

// create booking
router.post('/', auth, async (req, res) => {
const { serviceId, date, timeSlot, notes } = req.body;
try {
const booking = new Booking({
     user: req.user._id, service: serviceId, date, timeSlot, notes 
    });
await booking.save();
res.json(booking);
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});


// get user's bookings
router.get('/me', auth, async (req, res) => {
const bookings = await Booking.find({ user: req.user._id }).populate('service');
res.json(bookings);
});


export default router;