const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get("/check", (req, res) => {
  const token = req.cookies.adminToken;

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ message: "Authorized", admin: decoded });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
