// import mongoose from 'mongoose';
// const userSchema = new mongoose.Schema({
// name: {
//      type: String
//      },
// email: { 
//     type: String, unique: true, required: true 
// },
// password: { 
//     type: String
//  }, // hashed
// googleId: {
//      type: String
//      },
// phone: { 
//     type: String 
// },
// address: { 
//     type: String 
// },
// role: { 
//     type: String, enum: ['user','professional','admin'], default: 'user' 
// }
// }, { timestamps: true });
// const User =  mongoose.model('User', userSchema);
// export default User;
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: { 
    type: String, 
    unique: true, 
    required: true 
  },
  password: { 
    type: String,
  }, // hashed password
  googleId: {
    type: String,
  },
  phone: { 
    type: String,
  },
  address: { 
    type: String,
  },
  role: { 
    type: String, 
    enum: ['user', 'professional', 'admin'], 
    default: 'user' 
  },
  token: { 
    type: String, 
    default: null // 🔹 will store JWT token when user logs in
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
