import Admin from '../models/Admin.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Define a secret key for JWT. In a real application, this should be
// stored securely as an environment variable (e.g., process.env.JWT_SECRET).
const JWT_SECRET = process.env.JWT_SECRET; // Replace with a strong, random secret

/**
 * @desc    Generates a JWT token for the given admin ID
 * @param   {string} id - The ID of the admin
 * @returns {string} The generated JWT token
 */
const generateToken = (id) => {
  // Sign the token with the admin's ID as the payload, the secret key,
  // and an expiration time (e.g., 30 days).
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

/**
 * @desc    Registers a new admin
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerAdmin = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation: Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    // Check if an admin with the given email already exists
    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    // Create a new admin instance. The pre-save hook in the Admin model
    // will automatically hash the password before saving.
    const admin = await Admin.create({
      email,
      password,
    });

    if (admin) {
      // If admin creation is successful, generate a JWT token and send it back
      res.status(201).json({
        _id: admin._id,
        email: admin.email,
        token: generateToken(admin._id), // Generate and send the JWT token
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error) {
    // Handle any server-side errors
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Authenticates an admin and gets token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation: Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    // Find the admin by their email address
    const admin = await Admin.findOne({ email });

    // If admin not found or password does not match, return an error
    // Using `bcrypt.compare` to compare the plain text password with the hashed password
    if (admin && (await bcrypt.compare(password, admin.password))) {
      // If authentication is successful, generate a JWT token and send it back
      res.status(200).json({
        _id: admin._id,
        email: admin.email,
        token: generateToken(admin._id), // Generate and send the JWT token
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' }); // Unauthorized
    }
  } catch (error) {
    // Handle any server-side errors
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
