const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.adminLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    // identifier = phone OR email

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
      { expiresIn: "1d" }
    );

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: "Admin login successful",
      admin: {
        name: admin.name,
        email: admin.email,
        phone: admin.phone
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
