
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const auth =  async (req, res, next) => {
const token = req.header('Authorization')?.replace('Bearer ', '') || req.body.token || req.query.token;
if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
try {
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = await User.findById(decoded.id).select('-password');
next();
} catch (err) {
console.error(err);
res.status(401).json({ message: 'Token is not valid' });
}
};
export default auth;