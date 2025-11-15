import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.js';
import serviceRoutes from './routes/services.js';
import bookingRoutes from './routes/bookings.js';
import chekBookingRoutes from './routes/booking.js';

dotenv.config();

const app = express();
connectDB();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/bookings',chekBookingRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
