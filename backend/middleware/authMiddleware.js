// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js'; // To find the admin by ID
// Ensure this secret matches the one in your authController.js
const JWT_SECRET = process.env.JWT_SECRET; // Use process.env.JWT_SECRET in production!

export const protectAdmin = async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Attach the admin to the request object (excluding password)
      // We find the admin by ID from the token payload
      req.admin = await Admin.findById(decoded.id).select('-password');

      // If no admin found for the ID in the token
      if (!req.admin) {
        return res.status(401).json({ message: 'Not authorized, admin not found' });
      }

      // Proceed to the next middleware/controller
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};