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
            // const mailOptions = {
            //     from: `Arunalaya Services <${process.env.EMAIL_USER}>`,
            //     to: user.email,
            //     subject: 'Your Booking Confirmation – Arunalaya Services 🎉',
            //     html: `
            //         <div style="font-family: 'Arial', sans-serif; background-color: #ffffff; padding: 30px; color: #000000; border-radius: 12px; max-width: 600px; margin: auto; border: 1px solid #eee;">
            //             <div style="text-align: center; margin-bottom: 25px; background-color: #ffffff;">
            //                 <img src="https://arunalaya.com/wp-content/uploads/2025/01/cropped-cropped-cropped-logo-e1739007936169.png" alt="Arunalaya Logo" style="width: 120px; height: auto;" />
            //             </div>
            //             <h2 style="color: #F88310; text-align: center;">Booking Confirmed 🎉</h2>
            //             <p style="text-align: center; font-size: 15px;">Hi <strong>${user.name || 'there'}</strong> 👋,</p>
            //             <p style="text-align: center; font-size: 15px; margin-bottom: 25px;">
            //                 Thank you for choosing <strong>Arunalaya Physiotherapy Center</strong>! <br> Your booking has been successfully confirmed.
            //             </p>
            //             <div style="background-color: #fef4eb; border-radius: 10px; padding: 20px; margin-bottom: 25px;">
            //                 <p style="font-size: 15px; margin: 5px 0;"><strong>Date:</strong> ${date}</p>
            //                 <p style="font-size: 15px; margin: 5px 0;"><strong>Time:</strong> ${timeSlot}</p>
            //                 <p style="font-size: 15px; margin: 5px 0;"><strong>Notes:</strong> ${notes || '—'}</p>
            //             </div>
            //             <p style="font-size: 15px; line-height: 1.6;">
            //                 Our team will reach out to you soon for confirmation and assistance. <br> In the meantime, feel free to reach us at <a href="mailto:arunalayacare@gmail.com" style="color: #F88310; text-decoration: none;">arunalayacare@gmail.com</a>.
            //             </p>
            //             <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;" />
            //             <div style="text-align: center; font-size: 13px; color: #555;">
            //                 <p style="margin: 5px 0;">Arunalaya Physiotherapy Center</p>
            //                 <p style="margin: 5px 0;">Empowering Your Recovery • Since 2015</p>
            //                 <p style="margin-top: 10px;">
            //                     <a href="https://arunalaya.com" style="color: #F88310; text-decoration: none;">Visit Website</a>
            //                 </p>
            //             </div>
            //         </div>
            //     `,
            // };
            const mailOptions = {
  from: `Arunalaya Services <${process.env.EMAIL_USER}>`,
  to: user.email,
  subject: 'Your Booking Confirmation – Arunalaya Services 🎉',
  html: `
    <div style="font-family: 'Arial', sans-serif; background-color: #ffffff; padding: 25px; color: #000000; border-radius: 12px; max-width: 600px; margin: auto; border: 1px solid #eee;">
      <style>
        @media (max-width: 600px) {
          .main-container {
            padding: 10px !important;
          }
          .logo-bg {
            padding: 18px 0 !important;
          }
          .booking-info {
            padding: 15px !important;
          }
          h2 {
            font-size: 20px !important;
          }
          p, .booking-info p {
            font-size: 14px !important;
          }
        }
      </style>
      <div class="main-container" style="padding: 25px;">
        <div class="logo-bg" style="
                text-align: center; 
                margin-bottom: 25px; 
                background: rgba(250,250,250,0.85); 
                box-shadow: 0 2px 6px rgba(0,0,0,0.04); 
                border-radius: 12px;
                padding: 22px 0;
            ">
          <img src="https://arunalaya.com/wp-content/uploads/2025/01/cropped-cropped-cropped-logo-e1739007936169.png" alt="Arunalaya Logo" style="width: 120px; height: auto;" />
        </div>
        <h2 style="color: #F88310; text-align: center;">Booking Confirmed 🎉</h2>
        <p style="text-align: center; font-size: 15px;">Hi <strong>${user.name || 'there'}</strong> 👋,</p>
        <p style="text-align: center; font-size: 15px; margin-bottom: 25px;">
          Thank you for choosing <strong>Arunalaya Physiotherapy Center</strong>! <br> Your booking has been successfully confirmed.
        </p>
        <div class="booking-info" style="background-color: #fef4eb; border-radius: 10px; padding: 20px; margin-bottom: 25px;">
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