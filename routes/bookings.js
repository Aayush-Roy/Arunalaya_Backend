// import express from 'express';
// import Booking from '../models/Booking.js';
// import auth from '../middleware/auth.js';
// import User from '../models/User.js';
// import nodemailer from "nodemailer";
// const router = express.Router();
// import ServiceArea from "../models/ServiceArea.js";

// import { getDistanceKm } from "../utils/distance.js";
// //GET BOOKINGS


// // router.post("/check-area", async (req, res) => {
// //   try {
// //     const { lat, lng } = req.body;

// //     if (!lat || !lng) {
// //       return res.status(400).json({ message: "Latitude & Longitude required" });
// //     }

// //     const areas = await ServiceArea.find({});

// //     for (let area of areas) {
// //       const distance = getDistanceKm(lat, lng, area.center.lat, area.center.lng);

// //       if (distance <= area.radiusKm) {
// //         return res.json({
// //           serviceable: true,
// //           distance,
// //           area: area.name
// //         });
// //       }
// //     }

// //     res.json({
// //       serviceable: false,
// //       message: "Area not serviceable"
// //     });

// //   } catch (err) {
// //     console.error("Serviceability check failed:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // });

// // function getTravelTime(distanceKm) {
// //   const avgSpeed = 25; // km/hr
// //   return Math.round((distanceKm / avgSpeed) * 60); // minutes
// // }

// router.get('/', async (req, res) => {
//   try {
//     const bookings = await Booking.find()
//       .populate('user', 'name email')     // ✅ fetch user name + email
//       .populate('service', 'title price'); // ✅ fetch service title + price
//     res.json(bookings);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch bookings' });
//   }
// });



// // create booking
// // router.post('/', auth, async (req, res) => {
// // const { serviceId, date, timeSlot, notes } = req.body;
// // console.log("Decoded user from token:", req.user);

// // try {
// // const booking = new Booking({
// //      user: req.user._id, service: serviceId, date, timeSlot, notes 
// //     });
// // await booking.save();
// //  await User.findByIdAndUpdate(req.user._id, {
// //       $push: { bookings: booking._id }
// //     });
// // res.json(booking);
// // } catch (err) {
// // console.error(err);
// // res.status(500).json({ message: 'Server error' });
// // }
// // });


// router.post("/", auth, async (req, res) => {
//   const { serviceId, date, timeSlot, notes } = req.body;
//   console.log("Decoded user from token:", req.user);

//   try {
//     // 1️⃣ Create booking
//     const booking = new Booking({
//       user: req.user._id,
//       service: serviceId,
//       date,
//       timeSlot,
//       notes,
//     });

//     await booking.save();

//     // 2️⃣ Add booking to user's record
//     await User.findByIdAndUpdate(req.user._id, {
//       $push: { bookings: booking._id },
//     });

//     // 3️⃣ Get user info for email
//     const user = await User.findById(req.user._id);
//     if (!user || !user.email) {
//       console.warn("User email not found, skipping email sending");
//     } else {
//       // 4️⃣ Setup Nodemailer transporter
//       const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: process.env.EMAIL_USER,
//           pass: process.env.EMAIL_PASS, // app password from Gmail
//         },
//       });

     
//       const mailOptions = {
//   from: `"Arunalaya Services" <${process.env.EMAIL_USER}>`,
//   to: user.email,
//   subject: "Your Booking Confirmation – Arunalaya Services 🎉",
//   html: `
//   <div style="font-family: 'Arial', sans-serif; background-color: #ffffff; padding: 30px; color: #000000; border-radius: 12px; max-width: 600px; margin: auto; border: 1px solid #eee;">
    
//     <!-- Logo -->
//     <div style="text-align: center; margin-bottom: 25px; background-color:"#ffffff">
//       <img src="https://arunalaya.com/wp-content/uploads/2025/01/cropped-cropped-cropped-logo-e1739007936169.png" alt="Arunalaya Logo" style="width: 120px; height: auto;" />
//     </div>

//     <!-- Heading -->
//     <h2 style="color: #F88310; text-align: center;">Booking Confirmed 🎉</h2>
//     <p style="text-align: center; font-size: 15px;">Hi <strong>${user.name || "there"}</strong> 👋,</p>
//     <p style="text-align: center; font-size: 15px; margin-bottom: 25px;">
//       Thank you for choosing <strong>Arunalaya Physiotherapy Center</strong>! <br>
//       Your booking has been successfully confirmed.
//     </p>

//     <!-- Booking Details -->
//     <div style="background-color: #fef4eb; border-radius: 10px; padding: 20px; margin-bottom: 25px;">
//       <p style="font-size: 15px; margin: 5px 0;"><strong>Date:</strong> ${date}</p>
//       <p style="font-size: 15px; margin: 5px 0;"><strong>Time:</strong> ${timeSlot}</p>
//       <p style="font-size: 15px; margin: 5px 0;"><strong>Notes:</strong> ${notes || "—"}</p>
//     </div>

//     <!-- Info -->
//     <p style="font-size: 15px; line-height: 1.6;">
//       Our team will reach out to you soon for confirmation and assistance. <br>
//       In the meantime, feel free to reach us at 
//       <a href="mailto:arunalayacare@gmail.com" style="color: #F88310; text-decoration: none;">arunalayacare@gmail.com</a>.
//     </p>

//     <!-- Footer -->
//     <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;" />
//     <div style="text-align: center; font-size: 13px; color: #555;">
//       <p style="margin: 5px 0;">Arunalaya Physiotherapy Center</p>
//       <p style="margin: 5px 0;">Empowering Your Recovery • Since 2015</p>
//       <p style="margin-top: 10px;">
//         <a href="https://arunalaya.com" style="color: #F88310; text-decoration: none;">Visit Website</a>
//       </p>
//     </div>
//   </div>
//   `,
// };


//       // 6️⃣ Send email
//       await transporter.sendMail(mailOptions);
//       console.log("✅ Confirmation email sent to", user.email);
//     }

//     // 7️⃣ Send response
//     res.json({ message: "Booking created successfully", booking });
//   } catch (err) {
//     console.error("Error creating booking:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.post("/", auth, async (req, res) => {
//   const { serviceId, date, timeSlot, notes, userLat, userLng } = req.body;

//   try {
//     // Fetch service
//     const service = await Service.findById(serviceId);
//     if (!service) return res.status(404).json({ message: "Service not found" });

//     // Check serviceable area
//     const areas = await ServiceArea.find({});
//     let distanceKm = null;

//     let isServiceable = false;

//     for (let area of areas) {
//       const d = getDistanceKm(userLat, userLng, area.center.lat, area.center.lng);
//       if (d <= area.radiusKm) {
//         isServiceable = true;
//         distanceKm = d;
//         break;
//       }
//     }

//     if (!isServiceable) {
//       return res.status(400).json({ message: "Your area is not serviceable" });
//     }

//     // Calculate travel time
//     const travelTime = getTravelTime(distanceKm);

//     // Extra travel charge (example)
//     let extraCharges = 0;
//     if (distanceKm > 3) extraCharges = (distanceKm - 3) * 10; // ₹10 per km after 3km

//     const totalCost = service.price + extraCharges;

//     // Create booking
//     const booking = new Booking({
//       user: req.user._id,
//       service: serviceId,
//       date,
//       timeSlot,
//       notes,
//       travelTime,
//       distanceKm,
//       totalCost
//     });

//     await booking.save();

//     await User.findByIdAndUpdate(req.user._id, {
//       $push: { bookings: booking._id }
//     });

//     return res.json({
//       message: "Booking created successfully",
//       booking
//     });

//   } catch (err) {
//     console.error("Booking creation error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });



// // get user's bookings
// router.get('/me', auth, async (req, res) => {
// const bookings = await Booking.find({ user: req.user._id }).populate('service');
// res.json(bookings);
// });

// router.get('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const booking = await Booking.findById(id);

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     res.status(200).json(booking);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching booking", error: err.message });
//   }
// });

// // cancel a booking
// router.put('/:id/cancel', auth,async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log(id);

//     // find the booking
//     const booking = await Booking.findById(id);
//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     // ensure the logged-in user owns this booking (optional but safer)
//     if (booking.user.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "Not authorized to cancel this booking" });
//     }

//     // update booking status
//     booking.status = "Cancelled";
//     await booking.save();

//     res.status(200).json({ message: "Booking cancelled successfully", booking });
//   } catch (err) {
//     console.error("Error cancelling booking:", err);
//     res.status(500).json({ message: "Error cancelling booking", error: err.message });
//   }
// });



// export default router;

// // Chod Bhangda


// // import express from 'express';
// // import Booking from '../models/Booking.js';
// // import auth from '../middleware/auth.js';
// // import User from '../models/User.js';
// // import Service from "../models/Service.js";  // ✅ FIXED (missing import)
// // import ServiceArea from "../models/ServiceArea.js";
// // import { getDistanceKm } from "../utils/distance.js";

// // const router = express.Router();


// // // ------------------------------
// // // Check Serviceable Area Route
// // // ------------------------------
// // router.post("/check-area", async (req, res) => {
// //   try {
// //     const { lat, lng } = req.body;

// //     if (!lat || !lng) {
// //       return res.status(400).json({ message: "Latitude & Longitude required" });
// //     }

// //     const areas = await ServiceArea.find({});

// //     for (let area of areas) {
// //       const distance = getDistanceKm(lat, lng, area.center.lat, area.center.lng);

// //       if (distance <= area.radiusKm) {
// //         return res.json({
// //           serviceable: true,
// //           distance,
// //           area: area.name
// //         });
// //       }
// //     }

// //     res.json({
// //       serviceable: false,
// //       message: "Area not serviceable"
// //     });

// //   } catch (err) {
// //     console.error("Serviceability check failed:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // });


// // // ------------------------------
// // // Travel Time Helper
// // // ------------------------------
// // function getTravelTime(distanceKm) {
// //   const avgSpeed = 25; 
// //   return Math.round((distanceKm / avgSpeed) * 60);
// // }


// // // ------------------------------
// // // Get All Bookings (Admin)
// // // ------------------------------
// // router.get('/', async (req, res) => {
// //   try {
// //     const bookings = await Booking.find()
// //       .populate('user', 'name email')
// //       .populate('service', 'title price');

// //     res.json(bookings);
// //   } catch (err) {
// //     res.status(500).json({ error: 'Failed to fetch bookings' });
// //   }
// // });


// // // ------------------------------
// // // Create Booking (Main Route)
// // // ------------------------------
// // router.post("/", auth, async (req, res) => {
// //   const { serviceId, date, timeSlot, notes, userLat, userLng } = req.body;

// //   try {
// //     // Validate location
// //     if (!userLat || !userLng) {
// //       return res.status(400).json({ message: "Location required for booking" });
// //     }

// //     // Get service
// //     const service = await Service.findById(serviceId);
// //     if (!service) return res.status(404).json({ message: "Service not found" });

// //     // Check serviceable area
// //     const areas = await ServiceArea.find({});
// //     let distanceKm = null;
// //     let isServiceable = false;

// //     for (let area of areas) {
// //       const d = getDistanceKm(userLat, userLng, area.center.lat, area.center.lng);

// //       if (d <= area.radiusKm) {
// //         isServiceable = true;
// //         distanceKm = d;
// //         break;
// //       }
// //     }

// //     if (!isServiceable) {
// //       return res.status(400).json({ message: "Your area is not serviceable" });
// //     }

// //     // Travel time
// //     const travelTime = getTravelTime(distanceKm);

// //     // Extra charges
// //     let extraCharges = 0;
// //     if (distanceKm > 3) extraCharges = (distanceKm - 3) * 10;

// //     const totalCost = service.price + extraCharges;

// //     // Create booking
// //     // const booking = new Booking({
// //     //   user: req.user._id,
// //     //   service: serviceId,
// //     //   date,
// //     //   timeSlot,
// //     //   notes,
// //     //   travelTime,
// //     //   distanceKm,
// //     //   totalCost,
// //     // });

// //     const bookingData = {
// //   serviceId: service._id,
// //   date: selectedDate,
// //   timeSlot: selectedTime,
// //   address,
// //   phone,
// //   notes,
// //   userLocation: coords,
// // };


// //     await booking.save();

// //     await User.findByIdAndUpdate(req.user._id, {
// //       $push: { bookings: booking._id }
// //     });

// //     return res.json({
// //       message: "Booking created successfully",
// //       booking
// //     });

// //   } catch (err) {
// //     console.error("Booking creation error:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // });


// // // ------------------------------
// // // get user's bookings
// // // ------------------------------
// // router.get('/me', auth, async (req, res) => {
// //   const bookings = await Booking.find({ user: req.user._id }).populate('service');
// //   res.json(bookings);
// // });


// // // ------------------------------
// // // Get booking by ID
// // // ------------------------------
// // router.get('/:id', async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const booking = await Booking.findById(id);

// //     if (!booking) {
// //       return res.status(404).json({ message: "Booking not found" });
// //     }

// //     res.status(200).json(booking);
// //   } catch (err) {
// //     res.status(500).json({ message: "Error fetching booking", error: err.message });
// //   }
// // });


// // // ------------------------------
// // // Cancel Booking
// // // ------------------------------
// // router.put('/:id/cancel', auth, async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     const booking = await Booking.findById(id);
// //     if (!booking) {
// //       return res.status(404).json({ message: "Booking not found" });
// //     }

// //     if (booking.user.toString() !== req.user._id.toString()) {
// //       return res.status(403).json({ message: "Not authorized to cancel this booking" });
// //     }

// //     booking.status = "Cancelled";
// //     await booking.save();

// //     res.status(200).json({ message: "Booking cancelled successfully", booking });
// //   } catch (err) {
// //     console.error("Error cancelling booking:", err);
// //     res.status(500).json({ message: "Error cancelling booking", error: err.message });
// //   }
// // });

// // export default router;


import express from 'express';
import Booking from '../models/Booking.js';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// GET BOOKINGS
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email') // ✅ fetch user name + email
            .populate('service', 'title price'); // ✅ fetch service title + price

        res.json(bookings);
    } catch (err) {
        res.status(500).json({
            error: 'Failed to fetch bookings'
        });
    }
});

// CREATE BOOKING
router.post('/', auth, async (req, res) => {
    const {
        serviceId,
        date,
        timeSlot,
        notes
    } = req.body;
    console.log('Decoded user from token:', req.user);

    try {
        // 1️⃣ Create booking
        const booking = new Booking({
            user: req.user._id,
            service: serviceId,
            date,
            timeSlot,
            notes,
        });
        await booking.save();

        // 2️⃣ Add booking to user's record
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                bookings: booking._id
            },
        });

        // 3️⃣ Get user info for email
        const user = await User.findById(req.user._id);

        if (!user || !user.email) {
            console.warn('User email not found, skipping email sending');
        } else {
            // 4️⃣ Setup Nodemailer transporter
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS, // app password from Gmail
                },
            });

            // 5️⃣ Construct mail options (HTML part formatted for readability)
            const mailOptions = {
                from: `Arunalaya Services <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: 'Your Booking Confirmation – Arunalaya Services 🎉',
                html: `
                    <div style="font-family: 'Arial', sans-serif; background-color: #ffffff; padding: 30px; color: #000000; border-radius: 12px; max-width: 600px; margin: auto; border: 1px solid #eee;">
                        <div style="text-align: center; margin-bottom: 25px; background-color: #ffffff;">
                            <img src="https://arunalaya.com/wp-content/uploads/2025/01/cropped-cropped-cropped-logo-e1739007936169.png" alt="Arunalaya Logo" style="width: 120px; height: auto;" />
                        </div>
                        <h2 style="color: #F88310; text-align: center;">Booking Confirmed 🎉</h2>
                        <p style="text-align: center; font-size: 15px;">Hi <strong>${user.name || 'there'}</strong> 👋,</p>
                        <p style="text-align: center; font-size: 15px; margin-bottom: 25px;">
                            Thank you for choosing <strong>Arunalaya Physiotherapy Center</strong>! <br> Your booking has been successfully confirmed.
                        </p>
                        <div style="background-color: #fef4eb; border-radius: 10px; padding: 20px; margin-bottom: 25px;">
                            <p style="font-size: 15px; margin: 5px 0;"><strong>Date:</strong> ${date}</p>
                            <p style="font-size: 15px; margin: 5px 0;"><strong>Time:</strong> ${timeSlot}</p>
                            <p style="font-size: 15px; margin: 5px 0;"><strong>Notes:</strong> ${notes || '—'}</p>
                        </div>
                        <p style="font-size: 15px; line-height: 1.6;">
                            Our team will reach out to you soon for confirmation and assistance. <br> In the meantime, feel free to reach us at <a href="mailto:arunalayacare@gmail.com" style="color: #F88310; text-decoration: none;">arunalayacare@gmail.com</a>.
                        </p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;" />
                        <div style="text-align: center; font-size: 13px; color: #555;">
                            <p style="margin: 5px 0;">Arunalaya Physiotherapy Center</p>
                            <p style="margin: 5px 0;">Empowering Your Recovery • Since 2015</p>
                            <p style="margin-top: 10px;">
                                <a href="https://arunalaya.com" style="color: #F88310; text-decoration: none;">Visit Website</a>
                            </p>
                        </div>
                    </div>
                `,
            };

            // 6️⃣ Send email
            await transporter.sendMail(mailOptions);
            console.log('✅ Confirmation email sent to', user.email);
        }

        // 7️⃣ Send response
        res.json({
            message: 'Booking created successfully',
            booking
        });
    } catch (err) {
        console.error('Error creating booking:', err);
        res.status(500).json({
            message: 'Server error'
        });
    }
});

// GET USER'S BOOKINGS
router.get('/me', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({
            user: req.user._id
        }).populate('service');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({
            message: 'Error fetching user bookings'
        });
    }
});

// GET SINGLE BOOKING BY ID
router.get('/:id', async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }
        res.status(200).json(booking);
    } catch (err) {
        res.status(500).json({
            message: 'Error fetching booking',
            error: err.message
        });
    }
});

// CANCEL A BOOKING
router.put('/:id/cancel', auth, async (req, res) => {
    try {
        const {
            id
        } = req.params;
        console.log(id);

        // find the booking
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }

        // ensure the logged-in user owns this booking (optional but safer)
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: 'Not authorized to cancel this booking'
            });
        }

        // update booking status
        booking.status = 'Cancelled';
        await booking.save();

        res.status(200).json({
            message: 'Booking cancelled successfully',
            booking
        });
    } catch (err) {
        console.error('Error cancelling booking:', err);
        res.status(500).json({
            message: 'Error cancelling booking',
            error: err.message
        });
    }
});

export default router;