import express from 'express';
import Booking from '../models/Booking.js';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

//GET BOOKINGS

router.get('/',async(req,res)=>{
  try{

    const AllBookings = await Booking.find({});
    return res.json(AllBookings);
  }catch(err){
    res.status(404).json({message:err.message});
  }
})



// create booking
router.post('/', auth, async (req, res) => {
const { serviceId, date, timeSlot, notes } = req.body;
console.log("Decoded user from token:", req.user);

try {
const booking = new Booking({
     user: req.user._id, service: serviceId, date, timeSlot, notes 
    });
await booking.save();
 await User.findByIdAndUpdate(req.user._id, {
      $push: { bookings: booking._id }
    });
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

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Error fetching booking", error: err.message });
  }
});

// cancel a booking
router.put('/:id/cancel', auth,async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    // find the booking
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // ensure the logged-in user owns this booking (optional but safer)
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    // update booking status
    booking.status = "Cancelled";
    await booking.save();

    res.status(200).json({ message: "Booking cancelled successfully", booking });
  } catch (err) {
    console.error("Error cancelling booking:", err);
    res.status(500).json({ message: "Error cancelling booking", error: err.message });
  }
});



export default router;