import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Employee from '../models/Employee.js';
import Manager from '../models/Manager.js';

export const login = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Email/Username and password are required' });
  }

  const trimmedId = identifier.trim();
  const trimmedPw = password.trim();

  try {
    let user = await Employee.findOne({
      $or: [{ email: trimmedId }, { username: trimmedId }],
    });

    let role = 'employee';

    if (!user) {
      user = await Manager.findOne({
        $or: [{ email: trimmedId }, { username: trimmedId }],
      });
      if (user) role = 'manager';
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials (user not found)' });
    }

    const isMatch = await bcrypt.compare(trimmedPw, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials (password mismatch)' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        role: role,
      },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        role: role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error during login' });
  }
};
