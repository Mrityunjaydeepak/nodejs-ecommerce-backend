// middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes: verify token and attach user to req.user
export const protect = async (req, res, next) => {
  let token = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Only allow admins through
export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: admins only' });
  }
  next();
};
