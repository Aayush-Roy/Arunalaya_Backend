import mongoose from 'mongoose';
const bookingSchema = new mongoose.Schema({
user: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User', required: true
 },
service: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'Service', required: true 
},
date: {
     type: Date, required: true 
    },
timeSlot: {
     type: String, required: true 
    },
status: {
     type: String, enum: ['Pending','Confirmed','Completed','Cancelled'], default: 'Pending' 
    },
notes: String,
}, {
     timestamps: true
 });
const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;

