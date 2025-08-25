import jwt from 'jsonwebtoken';
import Employee from '../models/Employee.js';
import Manager from '../models/Manager.js';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;
    if (decoded.role === 'manager') {
      user = await Manager.findById(decoded.id);
    } else if (decoded.role === 'employee') {
      user = await Employee.findById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      userId: user._id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access forbidden: insufficient rights' });
    }
    next();
  };
};
