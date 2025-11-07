
// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';
// const auth =  async (req, res, next) => {
// const token = req.header('Authorization')?.replace('Bearer ', '') || req.body.token || req.query.token;
// if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
// try {
// const decoded = jwt.verify(token, process.env.JWT_SECRET);
// req.user = await User.findById(decoded.id).select('-password');
// next();
// } catch (err) {
// console.error(err);
// res.status(401).json({ message: 'Token is not valid' });
// }
// };
// export default auth;
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
  const token =
    req.header('Authorization')?.replace('Bearer ', '') ||
    req.body.token ||
    req.query.token;

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user; 
    next();
  } catch (err) {
    console.error('Auth Error:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default auth;
