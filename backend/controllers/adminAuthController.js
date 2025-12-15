// backend/controllers/adminAuthController.js
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

    const cookieOptions = {
  httpOnly: true,
  secure: true,          // 🔥 MUST be true on Render
  sameSite: "None",      // 🔥 REQUIRED for cross-site
  path: "/"
};
/**
 * ADMIN LOGIN
 */
exports.adminLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const admin = await Admin.findOne({
      $or: [{ email: identifier }, { phone: identifier }]
    });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // ⬅️ SHORT expiry for security
    );



// LOGIN
res.cookie("adminToken", token, cookieOptions);


    return res.status(200).json({
      message: "Admin login successful",
      admin: {
        name: admin.name,
        email: admin.email,
        phone: admin.phone
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * AUTH CHECK (used for auto-logout)
 */
exports.checkAuth = (req, res) => {
  const token = req.cookies?.adminToken;

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({
      authenticated: true,
      admin: decoded
    });
  } catch (err) {
    return res.status(401).json({ authenticated: false });
  }
};

/**
 * ADMIN LOGOUT
 */
exports.adminLogout = (req, res) => {
  try {
    res.clearCookie("adminToken", cookieOptions);

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Logout failed" });
  }
};
