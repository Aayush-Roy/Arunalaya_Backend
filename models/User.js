
// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//   },
//   email: { 
//     type: String, 
//     unique: true, 
//     required: true 
//   },
//   password: { 
//     type: String,
//   }, // hashed password
//   googleId: {
//     type: String,
//   },
//   phone: { 
//     type: Number,
//   },
//   address: { 
//     type: String,
//   },
//   role: { 
//     type: String, 
//     enum: ['user', 'professional', 'admin'], 
//     default: 'user' 
//   },
//   token: { 
//     type: String, 
//     default: null 
//   },
  
// }, { timestamps: true });

// const User = mongoose.model('User', userSchema);

// export default User;
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String },
  googleId: { type: String },
  phone: { type: Number },
  address: { type: String },
  role: { type: String, enum: ['user', 'professional', 'admin'], default: 'user' },
  token: { type: String, default: null },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
}, { timestamps: true });

// ✅ Fix: Prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     