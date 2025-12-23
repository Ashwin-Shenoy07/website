const express = require("express");
const router = express.Router();
const TshirtRegistration = require("../models/TshirtRegistration");

/**
 * POST – Register T-shirt
 */
router.post("/register", async (req, res) => {
  try {
    const { name, whatsapp, shirtSize } = req.body;

    if (!name || !whatsapp || !shirtSize) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const registration = await TshirtRegistration.create({
      name,
      whatsapp,
      shirtSize
    });

    res.status(201).json({
      message: "Registration successful",
      registration
    });
  } catch (error) {
    console.error("T-shirt registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
