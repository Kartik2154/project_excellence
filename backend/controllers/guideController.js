// backend/controllers/guideController.js
import Guide from "../models/guide.js"; // make sure casing matches filename
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sendEmail from "../utils/emailService.js";

// helper for JWT
const generateToken = (id) => {
  return jwt.sign({ id, role: "guide" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ✅ Register Guide
export const registerGuide = async (req, res) => {
  try {
    const { name, expertise, email, password } = req.body;

    // check if already exists
    const guideExists = await Guide.findOne({ email });
    if (guideExists) {
      return res.status(400).json({ message: "Guide already exists" });
    }

    // create new guide (password will be hashed in schema)
    const guide = await Guide.create({
      name,
      expertise,
      email,
      password,
    });

    res.status(201).json({
      _id: guide._id,
      name: guide.name,
      email: guide.email,
      expertise: guide.expertise,
      status: guide.status,
      token: generateToken(guide._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Login Guide
export const loginGuide = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if guide exists
    const guide = await Guide.findOne({ email });
    if (!guide) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // check password using model method
    const isMatch = await guide.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // check if guide is approved by admin
    if (guide.status !== "approved") {
      return res
        .status(403)
        .json({ message: "Your account is not approved by admin yet" });
    }

    res.json({
      _id: guide._id,
      name: guide.name,
      email: guide.email,
      expertise: guide.expertise,
      isActive: guide.isActive,
      token: generateToken(guide._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Pass Forgot, reset, change goes here

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ✅ Forgot Password - send OTP
export const forgotPasswordGuide = async (req, res) => {
  try {
    const { email } = req.body;
    const guide = await Guide.findOne({ email });
    if (!guide) return res.status(404).json({ message: "Guide not found" });

    const otp = generateOTP();
    guide.otp = otp;
    guide.otpExpiry = Date.now() + 15 * 60 * 1000; // 15 mins
    await guide.save();

    await sendEmail(guide.email, "Password Reset OTP", `Your OTP is: ${otp}`);
    res.json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Reset Password with OTP
export const resetPasswordGuide = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const guide = await Guide.findOne({ email });

    if (!guide) return res.status(404).json({ message: "Guide not found" });
    if (guide.otp !== otp || guide.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    guide.password = newPassword; // will be hashed automatically by pre-save
    guide.otp = undefined;
    guide.otpExpiry = undefined;
    await guide.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Change Password (while logged in)
export const changePasswordGuide = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const guide = await Guide.findOne({ email });
    if (!guide) return res.status(404).json({ message: "Guide not found" });

    const isMatch = await bcrypt.compare(oldPassword, guide.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect old password" });

    guide.password = newPassword; // will hash via pre-save
    await guide.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all guides (Admin only)
export const getAllGuides = async (req, res) => {
  try {
    const guides = await Guide.find().select("-password -otp -otpExpiry"); // don’t leak sensitive info
    res.json(guides);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// PATCH /api/guides/:id/status
export const updateGuideStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const guide = await Guide.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select("-password");

    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    res.json({ message: `Guide status updated to ${status}`, guide });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PATCH /api/guides/:id/active
export const updateGuideAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive must be true or false" });
    }

    // If logged in as Guide, only allow self toggle
    if (req.guide && req.guide._id.toString() !== id) {
      return res.status(403).json({ message: "Guides can only toggle their own availability" });
    }

    const guide = await Guide.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select("-password");

    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    res.json({
      message: `Guide availability updated to ${isActive ? "Active" : "Inactive"}`,
      guide,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Update Guide Details (Admin only, no password here)
export const updateGuide = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, expertise, email, phone, isActive, status } = req.body;

    const guide = await Guide.findByIdAndUpdate(
      id,
      { name, expertise, email, phone, isActive, status },
      { new: true, runValidators: true }
    ).select("-password");

    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    res.json({
      message: "Guide updated successfully",
      guide,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ✅ Delete Guide (Admin only)
export const deleteGuide = async (req, res) => {
  try {
    const { id } = req.params;
    const guide = await Guide.findByIdAndDelete(id);

    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    res.json({ message: "Guide deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Create Guide (Admin only)
export const createGuideByAdmin = async (req, res) => {
  try {
    const { name, expertise, email, phone, password } = req.body;

    // check if already exists
    const guideExists = await Guide.findOne({ email });
    if (guideExists) {
      return res.status(400).json({ message: "Guide already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const guide = await Guide.create({
      name,
      expertise,
      email,
      phone,
      password: hashedPassword,
      status: "approved", // ✅ Admin adds directly as approved
    });

    res.status(201).json({
      message: "Guide created successfully",
      guide: {
        _id: guide._id,
        name: guide.name,
        email: guide.email,
        phone: guide.phone,
        expertise: guide.expertise,
        status: guide.status,
        isActive: guide.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
