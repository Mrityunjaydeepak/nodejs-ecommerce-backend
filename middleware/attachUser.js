// middleware/attachUser.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const attachUser = async (req, res, next) => {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    const token = header.split(' ')[1];
    try {
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(id).select('-password');
    } catch (err) {
      // invalid token — just ignore it
    }
  }
  next();
};
