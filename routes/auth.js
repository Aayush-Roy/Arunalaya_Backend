
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { auth, OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';
import Booking from '../models/Booking.js';
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '841193026208-ir9e000vrv0p7k162cm7u9lmmis5ptsh.apps.googleusercontent.com');
const router = express.Router();

// 🟢 SIGNUP (only create user)
// router.post('/signup', async (req, res) => {
//   const { name, email, password, phone } = req.body;
//   try {
//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ message: 'User already exists' });

//     const salt = await bcrypt.genSalt(10);
//     const hashed = await bcrypt.hash(password, salt);

//     user = new User({ name, email, password: hashed, phone });
//     await user.save();

//     // 🔸 Don't generate token here
//     res.status(201).json({ message: 'Signup successful. Please login to continue.' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });
router.post('/signup', async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashed, phone });
    await user.save();

    // 🔹 Generate JWT token after successful signup
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Optional: store token in DB if you need
    user.token = token;
    await user.save();

    // ✅ Send token + user info to client directly
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
      message: 'Signup successful! Logged in automatically.',
    });
  } catch (err) {
    console.error('❌ Signup error:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
});
                                                
// 🟡 LOGIN (email-password)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.password)
      return res.status(400).json({ message: 'Please use Google login' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // 🔹 Generate token here only
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    user.token = token; // Store token in user document
    await user.save();
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
});

// 🔵 GOOGLE SIGN-IN

// routes/auth.js
router.post("/google", async (req, res) => {
  try {
    const { googleId, email, name, picture } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        picture,
        authProvider: "google"
      });
    }
    
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Google Sign-In failed" });
  }
});
// router.post('/google', async (req, res) => {
//   const { idToken } = req.body;
//   try {
//     const ticket = await googleClient.verifyIdToken({
//       idToken,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });
//     const payload = ticket.getPayload();
//     const { sub: googleId, email, name } = payload;

//     let user = await User.findOne({ email });
//     if (!user) {
//       user = new User({ name, email, googleId });
//       await user.save();
//     } else if (!user.googleId) {
//       user.googleId = googleId;
//       await user.save();
//     }

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: '7d',
//     });

//     res.json({
//       token,
//       user: { id: user._id, name: user.name, email: user.email },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(401).json({ message: 'Google token invalid' });
//   }
// });


// router.get("/me", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password -token");
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });

router.get("/me", authMiddleware, async (req, res) => {
  try {
    // user details without password/token
    const user = await User.findById(req.user.id).select("-password -token");
    if (!user) return res.status(404).json({ message: "User not found" });

    // get all bookings for this user (populate service info too)
    const bookings = await Booking.find({ user: req.user.id })
      .populate("service", "title price durationMins category") // include some service fields
      .sort({ createdAt: -1 });

    res.json({
      user,
      bookings,
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -token');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// 🟠 UPDATE PROFILE
// router.put('/update', authMiddleware, async (req, res) => {
//   const { name, phone, address } = req.body;
//   try {
//     const user = await User.findByIdAndUpdate(
//       req.user.id,
//       { name, phone, address },
//       { new: true, runValidators: true }
//     ).select('-password -token');

//     res.json({ message: 'Profile updated successfully', user });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });
router.put('/update', authMiddleware, async (req, res) => {
  console.log("🟡 Received body:", req.body);
  const { name, phone, address } = req.body;
  console.log(name,phone,address);
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, address },
      { new: true, runValidators: true }
    ).select('-password -token');
    if(!user) return res.status(404).json({ message: 'User not found' });

    console.log("✅ Updated user:", user);
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).send('Server error');
  }
});


export default router;
