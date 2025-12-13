// backend/routes/adminAuthRoutes.js
const express = require("express");
const router = express.Router();
const { adminLogin, checkAuth } = require("../controllers/adminAuthController");

// POST /api/admin/auth/login
router.post("/login", adminLogin);

// GET /api/admin/auth/check
router.get("/check", checkAuth);

module.exports = router;
