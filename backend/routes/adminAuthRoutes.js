// backend/routes/adminAuthRoutes.js
const express = require("express");
const router = express.Router();
const { adminLogin, checkAuth,adminLogout } = require("../controllers/adminAuthController");

// POST /api/admin/auth/login
router.post("/login", adminLogin);

// GET /api/admin/auth/check
router.get("/check", checkAuth);

router.post("/logout", adminLogout);

module.exports = router;
